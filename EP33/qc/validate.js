// EP.33 QC: math validation + safe-zone audit + key stills.
// usage: node EP33/qc/validate.js   (after python3 shared/tools/audio_prep.py EP33)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(__dirname, '..'), QC = __dirname;
const SAFE = { left: 220, right: 860, top: 350, bottom: 1430 };
// 1) math
const M = require(path.join(EP, 'source/math_logic.js'));
const checks = M.checks();
const math = { given: M.GIVEN, derived: { atLeastOne: M.atLeastOne, both: M.both, computerOnly: M.computerOnly, lawOnly: M.lawOnly, naiveSum: M.naiveSum, trap: M.trap },
  options: M.OPTIONS.map(([l, v]) => `${l}. ${v} คน`), correct: `${M.OPTIONS[M.correctIndex][0]}. ${M.both} คน`, trapOption: `${M.OPTIONS[M.trapIndex][0]}. ${M.trap} คน (ลืมหัก 50 คนนอกวง)`,
  venn_regions: M.regions, dots_per_region: M.dots, checks, pass: checks.every(c => c.pass) };
fs.writeFileSync(path.join(QC, 'math_validation.json'), JSON.stringify(math, null, 1));
console.log('math', math.pass ? 'PASS' : 'FAIL');
// 2) browser audit
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('PAGEERR', e.message); process.exitCode = 2; });
  await page.goto('file://' + path.join(EP, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const TL = await page.evaluate(() => window.TL);
  const audit = t => page.evaluate(({ t, SAFE }) => {
    renderAt(t);
    const out = [];
    for (const el of document.querySelectorAll('.crit')) {
      if (el.closest('.scene')?.style.display === 'none') continue;
      let o = 1, n = el, vis = true;
      while (n && n !== document.body) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') vis = false; n = n.parentElement; }
      if (!vis || o < .5) continue;
      // measure what is painted: text runs plus any descendant with a background/shadow (ignores empty full-width wrappers)
      const box = [];
      for (const e of [el, ...el.querySelectorAll('*')]) {
        if (e.closest('svg') && e.tagName !== 'svg') continue;
        const cs = getComputedStyle(e);
        if (cs.backgroundImage !== 'none' || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && cs.backgroundColor !== 'transparent') || cs.boxShadow !== 'none' || e.tagName === 'svg' || e.tagName === 'IMG') { const b = e.getBoundingClientRect(); if (b.width && b.height) box.push(b); }
        for (const c of e.childNodes) if (c.nodeType === 3 && c.nodeValue.trim()) { const rg = document.createRange(); rg.selectNodeContents(c); for (const b of rg.getClientRects()) if (b.width) box.push(b); }
      }
      if (!box.length) continue;
      const r = { left: Math.min(...box.map(b => b.left)), right: Math.max(...box.map(b => b.right)), top: Math.min(...box.map(b => b.top)), bottom: Math.max(...box.map(b => b.bottom)) };
      const txt = (el.innerText || '').replace(/\s+/g, ' ').trim().slice(0, 40);
      const fs = Math.min(...[el, ...el.querySelectorAll('*')].filter(e => e.childNodes && [...e.childNodes].some(c => c.nodeType === 3 && c.nodeValue.trim())).map(e => parseFloat(getComputedStyle(e).fontSize)));
      const bad = r.left < SAFE.left - .5 || r.right > SAFE.right + .5 || r.top < SAFE.top - .5 || r.bottom > SAFE.bottom + .5;
      out.push({ id: el.id || el.className.split(' ')[0], txt, r: [r.left, r.top, r.right, r.bottom].map(Math.round), bad, fs: isFinite(fs) ? Math.round(fs) : null });
    }
    return out;
  }, { t, SAFE });
  const viol = {}, extents = {}; let samples = 0, minFont = 1e9, minFontEl = '';
  for (let t = 0; t < TL.end; t += 0.25) {
    samples++;
    for (const e of await audit(+t.toFixed(2))) {
      const k = e.id + ' | ' + e.txt;
      const x = extents[k] || (extents[k] = { first: +t.toFixed(2), r: e.r.slice() });
      x.r = [Math.min(x.r[0], e.r[0]), Math.min(x.r[1], e.r[1]), Math.max(x.r[2], e.r[2]), Math.max(x.r[3], e.r[3])];
      if (e.fs && e.fs < minFont) { minFont = e.fs; minFontEl = k; }
      if (e.bad) (viol[k] = viol[k] || []).push({ t: +t.toFixed(2), r: e.r });
    }
  }
  // frame 0 must already read "เตรียมสอบนายสิบ"
  const frame0 = await page.evaluate(() => { renderAt(0); const el = document.getElementById('h-title'); return { text: el.innerText.trim(), opacity: getComputedStyle(el).opacity, rect: el.firstElementChild.getBoundingClientRect().toJSON() }; });
  // countdown frames (5→1, 30 frames each, ends before the answer narration)
  const cd0 = TL.cd[0], fps = TL.fps, cdFrames = [];
  for (let f = 0; f < 150; f += 1) cdFrames.push(await page.evaluate(t => { renderAt(t); return document.querySelector('#q-cd .cd-num').textContent; }, cd0 + f / fps + 1e-6));
  const runs = []; cdFrames.forEach(n => { if (runs.length && runs[runs.length - 1][0] === n) runs[runs.length - 1][1]++; else runs.push([n, 1]); });
  const revealBefore = await page.evaluate(t => { renderAt(t); return [...document.querySelectorAll('#q-opts .opt')].map(o => +getComputedStyle(o.querySelector('.ov')).opacity); }, TL.ans[0] - 1 / fps);
  // mobile crop (fill height, centre crop) for common iPhone viewports
  const mobile = [[375, 812], [390, 844], [430, 932]].map(([w, hh]) => { const s = hh / 1920, crop = (1080 * s - w) / 2 / s;
    return { viewport: `${w}x${hh}`, scale: +s.toFixed(4), visible_x: [Math.round(crop), Math.round(1080 - crop)], safe_inside: SAFE.left >= crop && SAFE.right <= 1080 - crop, min_critical_font_css_px: +(minFont * s).toFixed(1) }; });
  const overlays = { note: 'Shorts/Reels/TikTok UI: top ~0–300 px (search/tabs), right rail ~x 930–1080 at y 900–1700, caption/CTA ~y 1450–1920 on the 1080×1920 master', safe_zone_clear: SAFE.right <= 930 && SAFE.bottom <= 1450 && SAFE.top >= 300 };
  const report = { canvas: '1080x1920', safe_zone: SAFE, samples_every_s: .25, samples, elements_checked: Object.keys(extents).length, violations: viol, pass: Object.keys(viol).length === 0,
    min_critical_font_px: minFont, min_font_element: minFontEl, mobile, overlays, frame0, countdown: { start_s: cd0, start_frame: cd0 * fps, frames: cdFrames.length, runs, exact: JSON.stringify(runs) === JSON.stringify([['5', 30], ['4', 30], ['3', 30], ['2', 30], ['1', 30]]) },
    correct_option_overlay_opacity_one_frame_before_answer: revealBefore, extents };
  fs.writeFileSync(path.join(QC, 'safe_zone_report.json'), JSON.stringify(report, null, 1));
  console.log('safe zone', report.pass ? 'PASS' : 'FAIL', Object.keys(viol)); console.log('countdown', report.countdown.exact, JSON.stringify(runs)); console.log('min font', minFont, minFontEl); console.log('frame0', JSON.stringify(frame0)); console.log('reveal-before', revealBefore);
  // key stills
  const shot = async (t, f) => { await page.evaluate(t => renderAt(t), t); await page.screenshot({ path: path.join(QC, f), type: 'png' }); };
  await shot(0, 'first_frame.png');
  await shot(TL.ans[0] + 30.0 - 1.5, 'venn_preview.png');
  await shot(TL.cd[0] + 2.5, 'quiz_preview.png');
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
