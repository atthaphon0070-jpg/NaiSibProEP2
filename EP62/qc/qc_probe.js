// EP62 QC probe: safe-zone measurement of critical text (.crit) + countdown/reveal state checks.
// usage: node EP62/qc/qc_probe.js   (writes EP62/qc/safe_zone_report.json and countdown_validation.json)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(__dirname, '..');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const pg = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await pg.goto('file://' + path.join(EP, 'source/index.html')); await pg.evaluate(() => window.ready);
  const TL = await pg.evaluate(() => window.TL);
  const SZ = { x0: 220, x1: 860, y0: 350, y1: 1430 };
  const viol = [], seen = new Set(), hits = {}; let samples = 0, checked = 0;
  for (let t = 0; t < TL.end; t += 0.25) {
    samples++;
    const r = await pg.evaluate(t => {
      renderAt(t);
      const vis = el => { let o = 1; for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
      return [...document.querySelectorAll('.crit')].map(el => { const o = vis(el); if (o < .9) return null; const q = el.getBoundingClientRect();
        // measure the visible content (children union) for centred wrappers
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9; const kids = el.classList.contains('ctr') ? [...el.children] : [el];
        kids.forEach(k => { const c = k.getBoundingClientRect(); x0 = Math.min(x0, c.left); y0 = Math.min(y0, c.top); x1 = Math.max(x1, c.right); y1 = Math.max(y1, c.bottom); });
        return { txt: el.innerText.replace(/\s+/g, ' ').slice(0, 40), x0, y0, x1, y1 }; }).filter(Boolean);
    }, t);
    r.forEach(e => { checked++; const tol = 6; if (e.x0 < SZ.x0 - tol || e.x1 > SZ.x1 + tol || e.y0 < SZ.y0 - tol || e.y1 > SZ.y1 + tol) { (hits[e.txt] = hits[e.txt] || []).push(+t.toFixed(2)); const k = e.txt + '|' + Math.round(e.x0) + Math.round(e.y0); if (!seen.has(e.txt)) { seen.add(e.txt); viol.push({ t: +t.toFixed(2), ...e, x0: Math.round(e.x0), y0: Math.round(e.y0), x1: Math.round(e.x1), y1: Math.round(e.y1) }); } } });
  }
  // persistent = outside the region in >= 4 consecutive samples (>= 1 s); shorter = entrance/exit motion only
  const persistent = [], transient = [];
  viol.forEach(v => { const ts = hits[v.txt]; let run = 1, best = 1; for (let i = 1; i < ts.length; i++) { run = Math.abs(ts[i] - ts[i - 1] - .25) < .01 ? run + 1 : 1; best = Math.max(best, run); } (best >= 4 ? persistent : transient).push({ ...v, longest_run_s: best * .25, samples_outside: ts.length }); });
  fs.writeFileSync(path.join(EP, 'qc/safe_zone_report.json'), JSON.stringify({ canvas: [1080, 1920], essential_region: SZ, tolerance_px: 6, sample_step_s: .25, samples, critical_element_checks: checked,
    note: 'Bounding boxes include the scene push-in scale and animation overshoot. "transient" = outside only during an entrance/exit (< 1 s).', persistent_violations: persistent, transient_motion_only: transient, pass: persistent.length === 0 }, null, 1));
  // countdown + early-reveal checks, frame by frame around the quiz
  const fps = TL.fps, cd0 = TL.cd[0], cd1 = cd0 + TL.cd[1], an = TL.ans[0];
  const f0 = Math.round(cd0 * fps), f1 = Math.round(cd1 * fps);
  const st = [];
  for (let f = Math.round(TL.quiz[0] * fps); f <= Math.round((an + 1) * fps); f++) {
    st.push(await pg.evaluate(([f, fps]) => { renderAt(f / fps); const o = [...document.querySelectorAll('#s5 .qo')];
      const num = document.querySelector('#s5 .cd-num'); const cdEl = num.closest('.c');
      const shown = getComputedStyle(document.getElementById('s5')).display !== 'none'; return { f, shown, ov: o.map(x => +getComputedStyle(x.querySelector('.ov')).opacity), mk: o.map(x => +getComputedStyle(x.querySelector('.mk')).opacity), filt: o.map(x => x.style.filter || ''), num: +getComputedStyle(cdEl).opacity > .5 ? num.textContent : '' }; }, [f, fps]));
  }
  const pre = st.filter(s => s.shown && s.f < Math.round(an * fps));
  const early = pre.filter(s => s.ov.some(v => v > 0) || s.mk.some(v => v > 0) || s.filt.some(v => v));
  const digits = {}; st.filter(s => s.f >= f0 && s.f < f1).forEach(s => { digits[s.num] = (digits[s.num] || 0) + 1; });
  const outside = st.filter(s => (s.f < f0 || s.f >= f1 + 9) && s.num && s.num !== '').map(s => s.f);
  const firstGreen = st.find(s => s.shown && s.ov[3] > 0);
  const nar = TL; // narration silence check is in audio_qc.py
  fs.writeFileSync(path.join(EP, 'qc/countdown_validation.json'), JSON.stringify({
    fps, countdown_start_s: cd0, countdown_end_s: cd1, countdown_start_frame: f0, countdown_end_frame_exclusive: f1, countdown_frames: f1 - f0,
    frames_per_digit: digits, quiz_audio_end_s: TL.quiz[0] + TL.quiz[1], answer_audio_start_s: an,
    gap_quiz_end_to_countdown_s: +(cd0 - (TL.quiz[0] + TL.quiz[1])).toFixed(4), gap_countdown_end_to_answer_s: +(an - cd1).toFixed(4),
    pre_reveal_frames_checked: pre.length, frames_with_early_reveal_signal: early.map(s => s.f), first_frame_answer_green: firstGreen ? firstGreen.f : null, answer_start_frame: Math.ceil(an * fps),
    countdown_digits_visible_outside_window_frames: outside.length,
    pass: f1 - f0 === 150 && early.length === 0 && Object.values(digits).every(v => v === 30) && Object.keys(digits).length === 5 && firstGreen && firstGreen.f >= Math.ceil(an * fps),
  }, null, 1));
  await b.close();
  console.log('safe-zone persistent', viol.filter(v => (hits[v.txt] || []).length >= 4).length, 'flagged', viol.length, '| countdown frames', f1 - f0, digits, '| early', early.length, '| first green', firstGreen && firstGreen.f);
})();
