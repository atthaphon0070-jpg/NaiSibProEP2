// EP22 layout QC: samples the timeline and measures every visible text run (tight Range boxes).
// Boxes are trimmed 15% top/bottom (Prompt's line box is taller than its ink). Reports text outside the key-text safe zone (X 190–870, Y 300–1430) and overlaps between different text groups.
// usage: node EP22/tools/qc_layout.js [step_seconds=0.2] > EP22/qc/layout_check.txt
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
const step = +(process.argv[2] || .2);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.resolve(__dirname, '../source/index.html'));
  await page.evaluate(() => window.ready);
  const end = await page.evaluate(() => window.TL.end);
  const issues = [];
  let n = 0;
  for (let t = 0; t < end; t += step) {
    n++;
    const r = await page.evaluate(t => {
      renderAt(t);
      const SKIP = '#brand, #wipe, #sbg, .wk-cal, .artlbl, .paper';
      const eff = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
      const runs = [];
      const w = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT);
      let nd;
      while ((nd = w.nextNode())) {
        if (!nd.nodeValue.trim()) continue;
        const el = nd.parentElement;
        if (el.closest(SKIP) || el.closest('svg')) continue;
        const o = eff(el); if (o < .6) continue;
        const rg = document.createRange(); rg.selectNodeContents(nd);
        const r0 = rg.getBoundingClientRect(); if (r0.width < 2 || r0.bottom < 0 || r0.top > 1920 || r0.right < 0 || r0.left > 1080) continue;
        // the Range box is the font's full line box; trim 15% top and bottom to approximate the glyph ink
        const b = { left: r0.left, right: r0.right, top: r0.top + .15 * r0.height, bottom: r0.bottom - .15 * r0.height };
        const grp = el.closest('.ac, .ch, .qcard2, .bar') || el;
        runs.push({ txt: nd.nodeValue.trim().slice(0, 24), x0: b.left, y0: b.top, x1: b.right, y1: b.bottom, g: grp });
      }
      const out = [], ov = [];
      runs.forEach(a => { if (a.x0 < 188 || a.x1 > 872 || a.y0 < 298 || a.y1 > 1432) out.push(`${a.txt} [${a.x0 | 0},${a.y0 | 0}–${a.x1 | 0},${a.y1 | 0}]`); });
      for (let i = 0; i < runs.length; i++) for (let j = i + 1; j < runs.length; j++) {
        const a = runs[i], b = runs[j]; if (a.g === b.g || a.g.contains(b.g) || b.g.contains(a.g)) continue;
        const ix = Math.min(a.x1, b.x1) - Math.max(a.x0, b.x0), iy = Math.min(a.y1, b.y1) - Math.max(a.y0, b.y0);
        if (ix > 6 && iy > 6) ov.push(`"${a.txt}" × "${b.txt}"`);
      }
      return { out, ov };
    }, t);
    r.out.forEach(s => issues.push(`${t.toFixed(2)}s SAFE-ZONE ${s}`));
    r.ov.forEach(s => issues.push(`${t.toFixed(2)}s OVERLAP ${s}`));
  }
  console.log(`samples: ${n} (every ${step}s), issues: ${issues.length}`);
  issues.forEach(s => console.log(s));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
