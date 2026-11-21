// EP.60 safe-zone audit: renders the page at sampled times and measures every visible text run.
// usage: node EP60/qc/tools/safe_zone_check.js EP60 <out.json> [step=0.5]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const [, , ep, out, stepArg] = process.argv;
const STEP = +(stepArg || 0.5), Z = { x0: 220, x1: 860, y0: 350, y1: 1430 }, TOL = 2;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  await page.goto('file://' + path.resolve(ep, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const end = await page.evaluate(() => window.TL.end);
  const viol = [], perScene = {};
  let samples = 0;
  for (let t = 0; t < end; t = +(t + STEP).toFixed(3)) {
    samples++;
    const v = await page.evaluate(([t, Z, TOL]) => {
      renderAt(t);
      const res = [];
      const eff = el => { let o = 1; for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
      const w = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT);
      let n;
      while ((n = w.nextNode())) {
        if (!n.nodeValue.trim()) continue;
        const el = n.parentElement;
        if (el.closest('#brand') || el.closest('#wipe')) continue;          // persistent brand header (decorative, top-left)
        const o = eff(el); if (o < 0.15) continue;
        const r = document.createRange(); r.selectNodeContents(n);
        for (const b of r.getClientRects()) {
          if (b.width < 1 || b.height < 1) continue;
          // skip wipe-covered frames
          if (b.left < Z.x0 - TOL || b.right > Z.x1 + TOL || b.top < Z.y0 - TOL || b.bottom > Z.y1 + TOL)
            res.push({ text: n.nodeValue.trim().slice(0, 40), o: +o.toFixed(2), box: [Math.round(b.left), Math.round(b.top), Math.round(b.right), Math.round(b.bottom)] });
        }
      }
      return res;
    }, [t, Z, TOL]);
    v.forEach(x => viol.push({ t, ...x }));
  }
  await browser.close();
  // collapse by text
  const byText = {};
  viol.forEach(v => { const k = v.text; (byText[k] = byText[k] || { text: k, first: v.t, last: v.t, n: 0, worst: v.box }).n++; byText[k].last = v.t; });
  const rep = { zone: Z, tolerance_px: TOL, step_s: STEP, samples, violations: viol.length, pass: viol.length === 0, by_text: Object.values(byText) };
  fs.writeFileSync(out, JSON.stringify(rep, null, 1));
  console.log(JSON.stringify({ samples, violations: viol.length, by_text: rep.by_text }, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
