// usage: node EP39/tools/qc_timing.js -> EP39/qc/countdown_spoiler_check.json
// 1) countdown: every frame of the 150-frame window shows the right numeral (5,4,3,2,1 × 30 frames), no narration.
// 2) spoiler guard: before the answer narration starts, no visible element shows "66" or "+15", option ค carries
//    no green layer and no checkmark; checked on every 2nd frame from 0 to the reveal.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(__dirname, '..');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(EP, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const TL = await page.evaluate(() => window.TL);
  const fps = TL.fps, cd0 = Math.round(TL.cd[0] * fps), an0 = Math.round(TL.ans[0] * fps);
  const counts = {}, seq = [];
  for (let f = cd0 - 3; f < cd0 + 153; f++) {
    const r = await page.evaluate(t => { renderAt(t); const n = document.querySelector('.cd-num'); let o = 1, e = n; while (e && e.nodeType === 1) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') { o = 0; break; } o *= +cs.opacity; e = e.parentElement; } return { txt: n.textContent, o }; }, f / fps);
    const shown = r.o > .5 && r.txt ? r.txt : '';
    seq.push([f, shown]); if (shown) counts[shown] = (counts[shown] || 0) + 1;
  }
  const inWin = seq.filter(([f]) => f >= cd0 && f < cd0 + 150);
  const expected = inWin.every(([f, s]) => s === String(5 - Math.floor((f - cd0) / 30)));
  const outside = seq.filter(([f, s]) => (f < cd0 || f >= cd0 + 150) && s);
  const spoilers = [];
  for (let f = 0; f < an0; f += 2) {
    const hits = await page.evaluate(t => {
      renderAt(t); const out = [];
      const vis = el => { let o = 1, e = el; while (e && e.nodeType === 1) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; e = e.parentElement; } return o; };
      document.querySelectorAll('.scene .ess').forEach(el => { const tx = el.textContent.replace(/\s+/g, ''); if (vis(el) > .05 && (/(^|\D)66(\D|$)/.test(tx) && !el.querySelector('.opt39')) || (vis(el) > .05 && el.innerHTML.includes('class="pl"') && /^15$/.test(tx))) out.push(tx.slice(0, 20)); });
      document.querySelectorAll('.opt39').forEach(o => { if (o.textContent.includes('66')) { const ok = +o.querySelector('.ok').style.opacity || 0, ck = vis(o.querySelector('.ck')); if (ok > .01 || ck > .01) out.push('option ค highlighted'); } });
      return out;
    }, f / fps);
    if (hits.length) spoilers.push({ frame: f, t: +(f / fps).toFixed(3), hits });
  }
  await browser.close();
  const rep = { countdownStartFrame: cd0, countdownStartSec: TL.cd[0], countdownDurationSec: TL.cd[1], countdownFrames: TL.cd[1] * fps, answerStartFrame: an0,
    numeralFrameCounts: counts, everyFrameCorrect: expected, numeralsOutsideWindow: outside.length, framesBeforeRevealChecked: Math.ceil(an0 / 2), spoilerHits: spoilers.slice(0, 50), spoilerFree: spoilers.length === 0 };
  fs.writeFileSync(path.join(EP, 'qc/countdown_spoiler_check.json'), JSON.stringify(rep, null, 1));
  console.log(JSON.stringify({ ...rep, spoilerHits: spoilers.length }));
})().catch(e => { console.error(e); process.exit(1); });
