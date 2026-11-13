// EP51 page QC: renders the page every 0.5 s and checks that every visible text element
// sits inside the essential mobile zone x 220–860, y 350–1430. Also records the on-screen text
// so the grammar validation can confirm what was actually shown and when.
// usage: node EP51/tools/qc_page.js EP51 <outJson>
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const [, , ep, out] = process.argv;
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.resolve(ep, 'source/index.html'));
  await p.evaluate(() => window.ready);
  const end = await p.evaluate(() => window.TL.end);
  const res = { zone: { x: [220, 860], y: [350, 1430] }, tolerance_px: 4, samples: 0, violations: [], text_log: [], page_errors: errs };
  const seen = new Map();
  for (let t = 0; t <= end; t += .5) {
    const r = await p.evaluate(t => {
      renderAt(t);
      const outE = [];
      const effO = el => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
      const els = [...document.querySelectorAll('#stage *')].filter(e => !e.closest('svg') && !e.closest('#brand') && !e.closest('#wipe') && !e.closest('#bg')
        && [...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim()));
      // whole sentences (word-by-word spans) are also logged as one line
      const visText = root => { const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const out = []; let n; while ((n = w.nextNode())) { const v = n.nodeValue.trim(); if (v && effO(n.parentElement) >= .5) out.push(n.parentElement.closest('[data-wrong]') ? `[✗ ${v}]` : v); } return out.join(' ').replace(/\s+/g, ' ').trim(); };
      [...document.querySelectorAll('#stage .sent')].concat([...document.querySelectorAll('#stage .ql1')].map(e => e.parentElement)).forEach(e => { const tx = visText(e); if (tx) outE.push({ txt: tx, sentence: true, x0: 400, x1: 600, y0: 600, y1: 700, o: 1 }); });
      for (const e of els) {
        const o = effO(e); if (o < .5) continue;
        const rg = document.createRange(); rg.selectNodeContents(e); const bb = rg.getBoundingClientRect();
        if (bb.width < 2) continue;
        const txt = [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.nodeValue.trim()).join(' ').trim();
        outE.push({ txt, x0: Math.round(bb.left), x1: Math.round(bb.right), y0: Math.round(bb.top), y1: Math.round(bb.bottom), o: +o.toFixed(2) });
      }
      return outE;
    }, t);
    res.samples++;
    for (const e of r) {
      const key = e.txt;
      if (!seen.has(key)) { seen.set(key, t); res.text_log.push({ first_seen_s: +t.toFixed(1), text: e.txt }); }
      const tol = 4;
      // end-card zone excluded only for decorative/non-text; all text is checked
      if (e.x0 < 220 - tol || e.x1 > 860 + tol || e.y0 < 350 - tol || e.y1 > 1430 + tol) res.violations.push({ t: +t.toFixed(1), ...e });
    }
  }
  fs.writeFileSync(out, JSON.stringify(res, null, 1));
  console.log('samples', res.samples, 'violations', res.violations.length, 'errors', errs.length);
  await b.close();
})();
