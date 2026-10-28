// EP22 content QC (DOM, every 0.1 s before 06_answer): no "9"/"4.5" in scenes 1–4; "2 วัน" only on the quiz
// choice card before 06; no 6-block grid (any visible, drawn grid line) before 06; quiz/countdown wall has no grid.
// usage: node EP22/tools/qc_content.js > EP22/qc/content_check.txt
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.resolve(__dirname, '../source/index.html'));
  await page.evaluate(() => window.ready);
  const T = await page.evaluate(() => ({ quiz0: TL.quiz[0], ans0: TL.ans[0] }));
  const bad = []; let n = 0;
  for (let t = 0; t < T.ans0; t += .1) {
    n++;
    const r = await page.evaluate(t => {
      renderAt(t);
      const eff = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
      const texts = []; const w = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT); let nd;
      while ((nd = w.nextNode())) { const s = nd.nodeValue.trim(); if (!s) continue; const el = nd.parentElement; if (el.closest('#brand,#wipe')) continue; if (eff(el) > .02) texts.push({ s, card: !!el.closest('.ch') }); }
      const grids = [...document.querySelectorAll('.wk-grid')].filter(g => eff(g) > .02).map(g => ({ cells: g.querySelectorAll('rect').length, drawn: [...g.querySelectorAll('rect')].some(r => +r.getAttribute('stroke-dashoffset') < 0.95 * +r.getAttribute('stroke-dasharray') && getComputedStyle(r).opacity > 0) }));
      return { texts, grids };
    }, t);
    const sc14 = t < T.quiz0;
    r.texts.forEach(x => {
      if (sc14 && /(^|[^\d])9([^\d,]|$)|4\.5/.test(x.s)) bad.push(`${t.toFixed(1)}s scenes 1-4 show "${x.s}"`);
      if (/(^|[^\d])2 วัน/.test(x.s) && !x.card) bad.push(`${t.toFixed(1)}s "2 วัน" outside the quiz choice card before 06: "${x.s}"`);
    });
    r.grids.forEach(g => { if (g.cells === 6 && g.drawn) bad.push(`${t.toFixed(1)}s 6-block grid visible before 06`); if (t >= T.quiz0 && g.drawn) bad.push(`${t.toFixed(1)}s a grid is drawn during quiz/countdown`); });
  }
  console.log(`samples: ${n} (every 0.1 s, 0 → ${T.ans0.toFixed(2)} s), violations: ${bad.length}`);
  bad.slice(0, 50).forEach(b => console.log(b));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
