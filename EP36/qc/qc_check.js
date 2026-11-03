// EP.36 QC: safe-zone sweep of every critical (.crit) element, countdown frame audit, quiz/legal logic, stills.
// usage: node EP36/qc/qc_check.js   (run after audio_prep has written source/timeline.js)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(__dirname, '..'), QC = __dirname;
const SAFE = { left: 220, right: 860, top: 350, bottom: 1430 };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(EP, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const TL = await page.evaluate(() => window.TL);
  const fps = TL.fps, N = Math.ceil(TL.end * fps);
  // 1) safe zone: sample every 3rd frame; an element counts when its effective opacity >= 0.6 and it has finished its entrance (scale within 3% of rest)
  const viol = {}; let checked = 0;
  for (let f = 0; f < N; f += 3) {
    const r = await page.evaluate(([t, S]) => {
      renderAt(t);
      const out = [];
      const effO = el => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
      document.querySelectorAll('.crit').forEach(el => {
        const o = effO(el); if (o < .6) return;
        // layout wrappers (.ctr, #topchip, .tag) are measured by their visible content, not the full-width wrapper
        let b = el.getBoundingClientRect(); if (!b.width) return;
        if (el.classList.contains('ctr') || el.classList.contains('tag') || el.id === 'topchip') {
          const rs = [...el.children].map(c => c.getBoundingClientRect()).filter(r => r.width);
          if (rs.length) b = { left: Math.min(...rs.map(r => r.left)), top: Math.min(...rs.map(r => r.top)), right: Math.max(...rs.map(r => r.right)), bottom: Math.max(...rs.map(r => r.bottom)), width: 1 };
        }
        // clipped text inside the element
        const over = [...el.querySelectorAll('*')].some(c => c.scrollWidth > c.clientWidth + 2 && getComputedStyle(c).overflow === 'hidden');
        const bad = b.left < S.left - .5 || b.right > S.right + .5 || b.top < S.top - .5 || b.bottom > S.bottom + .5;
        if (bad || over) out.push({ id: el.id || el.className + ':' + (el.textContent || '').trim().slice(0, 24), box: [b.left, b.top, b.right, b.bottom].map(v => Math.round(v)), over });
      });
      return out;
    }, [f / fps, SAFE]);
    checked++;
    r.forEach(v => { const k = v.id; (viol[k] = viol[k] || { frames: 0, first: f / fps, worst: v.box, clipped: v.over }).frames++; });
  }
  // 2) countdown: every frame of the 5 s window must show the right number, 30 frames each
  const cd0 = Math.round(TL.cd[0] * fps), counts = {}, bad = [];
  for (let f = cd0 - 2; f < cd0 + 152; f++) {
    const [n, shown] = await page.evaluate(t => { renderAt(t); const el = document.querySelector('#q-cd .cd-num'); return [window.cdNumberAt(t), el ? el.textContent : null]; }, f / fps);
    const k = f - cd0;
    if (k >= 0 && k < 150) { counts[n] = (counts[n] || 0) + 1; if (n !== 5 - Math.floor(k / 30) || String(n) !== shown) bad.push(f); }
    else if (n !== null) bad.push(f);
  }
  // 3) answer must not be revealed before the countdown ends
  const early = await page.evaluate(t => { renderAt(t); const ov = document.querySelectorAll('#q-opts .opt .ov'); return [...ov].some(o => +o.style.opacity > 0); }, (cd0 + 149) / fps);
  const quiz = await page.evaluate(() => ({ correct: QUIZ.options[QUIZ.correct], errors: QUIZ.errors, in456: LEGAL_DATA.s456p1.items, car: LEGAL_DATA.anchors.car }));
  // 4) stills
  const shots = { 'first_frame.png': 0, 'scene_preview.png': TL.expl[0] + 26, 'quiz_preview.png': TL.cd[0] + 2.5, 'answer_preview.png': TL.ans[0] + 3 };
  for (const [f, t] of Object.entries(shots)) { await page.evaluate(t => renderAt(t), t); await page.screenshot({ path: path.join(QC, f) }); }
  const firstFrameText = await page.evaluate(() => { renderAt(0); const e = document.getElementById('h-title'); return getComputedStyle(e).opacity + '|' + e.textContent.replace(/\s+/g, ''); });
  const report = {
    canvas: [1080, 1920], safe_zone: SAFE, frames_total: N, frames_sampled: checked, sample_step_frames: 3,
    rule: 'every .crit element with effective opacity >= 0.6 must lie fully inside the safe zone; overflow-hidden text must not clip',
    violations: viol, violation_count: Object.keys(viol).length,
    first_frame: { title: firstFrameText },
    countdown: { start_s: TL.cd[0], start_frame: cd0, frames_per_number: counts, bad_frames: bad, exact: bad.length === 0 && Object.values(counts).every(c => c === 30) && Object.keys(counts).length === 5 },
    answer_hidden_until_countdown_end: !early,
    quiz, page_errors: errs,
  };
  fs.writeFileSync(path.join(QC, 'safe_zone_report.json'), JSON.stringify(report, null, 1));
  console.log(JSON.stringify({ violations: report.violation_count, countdown: report.countdown.exact, counts, early, errs, firstFrameText }, null, 0));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
