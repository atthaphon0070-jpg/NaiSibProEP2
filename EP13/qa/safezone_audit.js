// EP13 Central Safe Zone V2 audit (from EP12; the boutique set in #world is background and excluded): every STEP s, measure every visible text run,
// every card/pill/stamp/option box and the key
// foreground image/countdown, report anything outside x 190–870, y 300–1430.
// usage: [STEP=0.1] node EP13/qa/safezone_audit.js   (writes EP13/qa/safezone_audit.json; default step 0.25 s)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, '../source/index.html')); await p.evaluate(() => window.ready);
  await p.evaluate(() => Promise.all([...document.fonts].map(f => f.load().catch(() => null))).then(() => document.fonts.ready));   // all faces loaded before measuring
  const res = await p.evaluate((STEP) => {
    const Z = { x0: 190, x1: 870, y0: 300, y1: 1430 }, TOL = 2, out = [];
    const visible = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .05) return false; } return true; };
    let checked = 0;
    for (let t = 0; t < TL.end; t += STEP) {
      renderAt(t);
      const w = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT);
      let n; const seen = new Set();
      while ((n = w.nextNode())) {
        if (!n.nodeValue.trim()) continue;
        const el = n.parentElement; if (el.closest('#world') || el.closest('.ods') || !visible(el)) continue;   // odometer strips are measured by their windows (.odw) below
        const r = document.createRange(); r.selectNodeContents(n); const bb = r.getBoundingClientRect();
        if (bb.width < 1) continue; checked++;
        if (bb.left < Z.x0 - TOL || bb.right > Z.x1 + TOL || bb.top < Z.y0 - TOL || bb.bottom > Z.y1 + TOL) {
          const k = n.nodeValue.trim().slice(0, 40); if (seen.has(k)) continue; seen.add(k);
          out.push({ t: +t.toFixed(2), text: k, box: [bb.left, bb.top, bb.right, bb.bottom].map(v => Math.round(v)) });
        }
      }
      document.querySelectorAll('.qcd, img[src*="logo"], img[src*="mascot"], .optx, .node, .calc, .sj, .bar, .brk, .odw, .chip2, .glass, .bub, .pbadge, .shop-tag, .pr-callout .in, .pr-feat').forEach(el => {
        if (!visible(el)) return; const bb = el.getBoundingClientRect(); if (bb.width < 2) return; checked++;
        if (el.closest('.lyr') || el.closest('#wipe') || el.closest('#world')) return;   // world-set decorations and the full-frame wipe transition are background
        const clip = el.parentElement && getComputedStyle(el.parentElement).overflow === 'hidden' ? el.parentElement : el;   // photo inside a circular clip
        const cb = clip.getBoundingClientRect(); bb.x0 = cb.left; 
        if (cb.left < Z.x0 - TOL || cb.right > Z.x1 + TOL || cb.top < Z.y0 - TOL || cb.bottom > Z.y1 + TOL) out.push({ t: +t.toFixed(2), text: '[' + (el.className || el.getAttribute('src').split('/').pop()) + ']', box: [cb.left, cb.top, cb.right, cb.bottom].map(v => Math.round(v)) });
      });
    }
    return { checked, violations: out };
  }, +(process.env.STEP || .25));
  fs.writeFileSync(path.join(__dirname, 'safezone_audit.json'), JSON.stringify(res, null, 1));
  console.log('measurements:', res.checked, 'violations:', res.violations.length);
  res.violations.slice(0, 40).forEach(v => console.log(v.t, v.text, v.box.join(',')));
  await b.close();
})();
