// EP.31 QC: clock geometry (measured from the rendered DOM), safe zone, frame-0 hook, countdown, reveal timing.
// usage: node EP31/tools/qc.js EP31
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const ep = path.resolve(process.argv[2] || 'EP31'), QC = path.join(ep, 'qc');
fs.mkdirSync(QC, { recursive: true });
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('PAGEERR', e.message); process.exitCode = 2; });
  await page.goto('file://' + path.join(ep, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const res = await page.evaluate(() => {
    const SZ = { x0: 220, x1: 860, y0: 350, y1: 1430 }, TOL = 2;
    const TL = window.TL, fps = TL.fps, { MATH } = CLOCK;
    const eff = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
    const wipeOn = () => getComputedStyle(document.getElementById('wipe')).visibility === 'visible';
    // ---- reference states on a fresh clock (same engine as the video) ----
    const ref = CLOCK.create({ size: 500, label: 'qc-ref' }); ref.el.style.left = '290px'; ref.el.style.top = '600px'; document.getElementById('stage').appendChild(ref.el);
    const refs = [[3, 0, 90, 0, 90], [3, 5, 92.5, 30, 62.5], [3, 10, 95, 60, 35], [3, 15, 97.5, 90, 7.5]].map(([hh, mm, eh, em, es]) => {
      ref.setTime(MATH.T(hh, mm)); const m = ref.measure();
      const sm = MATH.smaller(m.hour, m.minute);
      return { time: MATH.label(MATH.T(hh, mm)), expected: { hour: eh, minute: em, smaller: es },
        formula: { hour: MATH.hourAngle(MATH.T(hh, mm)), minute: MATH.minuteAngle(MATH.T(hh, mm)), smaller: MATH.smaller(MATH.hourAngle(MATH.T(hh, mm)), MATH.minuteAngle(MATH.T(hh, mm))) },
        rendered: { hour: +m.hour.toFixed(3), minute: +m.minute.toFixed(3), smaller: +sm.toFixed(3) },
        pass: Math.abs(m.hour - eh) < .25 && Math.abs(m.minute - em) < .25 && Math.abs(sm - es) < .25 };
    });
    ref.el.remove();
    // ---- sweep the whole timeline ----
    const clocks = {}, viol = {}, N = Math.ceil(TL.end * fps);
    let maxErr = 0, samples = 0;
    for (let f = 0; f < N; f += 5) {
      const t = f / fps; renderAt(t);
      for (const ck of EP31.ALL_CLOCKS) {
        const o = eff(ck.el); if (o < .05) continue;
        const c = clocks[ck.el.dataset.clock] ||= { model: ck.model, frames: 0, maxErrDeg: 0, times: new Set() };
        c.frames++; c.model = ck.model;
        if (ck.model === 'time') {
          const m = ck.measure(), eh = MATH.hourAngle(ck.T), em = MATH.minuteAngle(ck.T);
          const e = Math.max(MATH.smaller(m.hour, eh), MATH.smaller(m.minute, em));
          c.maxErrDeg = Math.max(c.maxErrDeg, e); maxErr = Math.max(maxErr, e); samples++;
          c.times.add(MATH.label(ck.T));
        }
      }
      if (wipeOn()) continue;
      for (const el of document.querySelectorAll('[data-ess]')) {
        const o = eff(el); if (o < .9) continue;
        let boxes;
        if (el.dataset.zoom === '1') {   // camera push-in: the focus region (numeral 3 + both hand tips) must stay inside
          boxes = ['.n3', '.tipH', '.tipM'].map(s => el.querySelector(s).getBoundingClientRect());
        } else if (el.classList.contains('row')) boxes = [...el.children].map(c => c.getBoundingClientRect());   // centred row: its visible content
        else boxes = [el.getBoundingClientRect()];
        for (const r of boxes) {
          if (r.width === 0 && r.height === 0 && !el.dataset.zoom) continue;
          const over = Math.max(SZ.x0 - r.left, r.right - SZ.x1, SZ.y0 - r.top, r.bottom - SZ.y1);
          if (over > TOL) {
            const k = (el.id || el.dataset.clock || el.dataset.ess) + '';
            (viol[k] ||= []).push({ t: +t.toFixed(2), over: +over.toFixed(1) });
          }
        }
      }
    }
    // persistence: a violation is critical if it lasts >= 0.5 s (readable time), otherwise transient (pop-in overshoot)
    const vr = Object.entries(viol).map(([k, v]) => {
      let run = 1, best = 1; for (let i = 1; i < v.length; i++) { run = v[i].t - v[i - 1].t < .2 ? run + 1 : 1; best = Math.max(best, run); }
      return { element: k, samples: v.length, longest_s: +(best * 5 / fps).toFixed(2), max_over_px: Math.max(...v.map(x => x.over)), first: v[0].t, critical: best * 5 / fps >= .5 };
    });
    // ---- frame 0 hook ----
    renderAt(0);
    const kw = document.getElementById('h-kw'), kr = kw.firstElementChild.getBoundingClientRect();
    const frame0 = { text: kw.textContent.trim(), opacity: eff(kw), box: [kr.left, kr.top, kr.right, kr.bottom].map(Math.round),
      inside: kr.left >= SZ.x0 && kr.right <= SZ.x1 && kr.top >= SZ.y0 && kr.bottom <= SZ.y1 };
    frame0.pass = frame0.text === 'เตรียมสอบนายสิบ' && frame0.opacity > .99 && frame0.inside;
    // ---- countdown: every frame ----
    const cd0 = Math.round(TL.cd[0] * fps), cdN = Math.round(TL.cd[1] * fps), num = document.querySelector('#q-cd .cd-num');
    const counts = {}; let premature = 0;
    for (let f = cd0 - 30; f < cd0 + cdN; f++) {
      renderAt(f / fps);
      if (f >= cd0) counts[num.textContent] = (counts[num.textContent] || 0) + 1;
      const ov = document.querySelectorAll('#q-opts .ov');
      if ([...ov].some(o => +o.style.opacity > 0)) premature++;
    }
    // first frame where option ข turns green
    let greenAt = null;
    for (let f = cd0 + cdN; f < cd0 + cdN + 90; f++) { renderAt(f / fps); if (+document.querySelectorAll('#q-opts .ov')[1].style.opacity > 0) { greenAt = f / fps; break; } }
    const countdown = { start_frame: cd0, start_s: TL.cd[0], frames: cdN, per_numeral: counts, premature_highlight_frames: premature,
      correct_highlight_at_s: greenAt, answer_audio_start_s: TL.ans[0],
      pass: cdN === 150 && ['5', '4', '3', '2', '1'].every(n => counts[n] === 30) && premature === 0 && greenAt > TL.ans[0] };
    Object.values(clocks).forEach(c => c.times = [...c.times].slice(0, 12));
    return { refs, clocks, maxErr, samples, vr, frame0, countdown, end: TL.end };
  });
  const hookRow = Object.entries(res.clocks);
  fs.writeFileSync(path.join(QC, 'clock_validation.json'), JSON.stringify({
    rules: { minute: '6 * minutes', hour: '30 * (hours mod 12) + 0.5 * minutes', smaller: 'min(|H-M|, 360-|H-M|)', zero_deg: '12 o\'clock, clockwise positive' },
    reference_states: res.refs, all_reference_pass: res.refs.every(r => r.pass),
    timeline_sweep: { step_frames: 5, measured_clock_samples: res.samples, max_hand_error_deg: +res.maxErr.toFixed(4), pass: res.maxErr < .25 },
    clocks: Object.fromEntries(hookRow.map(([k, c]) => [k, { ...c, maxErrDeg: +c.maxErrDeg.toFixed(4) }])),
    note: 'Clocks with model "incorrect" are the two labelled wrong-model illustrations (hook thought card, "jumping hour hand" comparison); every other clock is time-driven.',
    answer: { minute_0315: 90, hour_0315: 97.5, smaller_angle: 7.5, correct_option: 'ข. 7.5°' },
  }, null, 1));
  fs.writeFileSync(path.join(QC, 'safe_zone_report.json'), JSON.stringify({
    safe_zone: { x: [220, 860], y: [350, 1430] }, tolerance_px: 2, sample_step_frames: 5,
    method: 'Rendered bounding box of every element tagged data-ess with effective opacity >= 0.9, skipping wipe transitions. During camera push-ins only the focus region (numeral 3 + both hand tips) is required inside.',
    violations: res.vr, critical_violations: res.vr.filter(v => v.critical).length,
    frame0_hook: res.frame0, countdown: res.countdown,
  }, null, 1));
  console.log(JSON.stringify({ refs: res.refs.map(r => [r.time, r.rendered, r.pass]), maxErr: res.maxErr, clocks: Object.fromEntries(hookRow.map(([k, c]) => [k, [c.model, c.frames, +c.maxErrDeg.toFixed(3)]])), violations: res.vr, frame0: res.frame0, countdown: res.countdown }, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
