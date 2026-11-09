// EP.46 rendered-page QC. usage: node tools/qc_browser.js
// Drives the real page with renderAt(t) (same code path as the frame renderer) and writes:
//   qc/countdown_validation.json  — all 150 countdown frames + neighbours, no reveal before the countdown ends
//   qc/safe_zone_report.json      — critical elements sampled every 6 frames (0.2 s) over the whole video, incl. transitions
//   appends rendered checks to qc/flowchart_validation.json
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const fs = require('fs'), path = require('path');
const EP = path.join(__dirname, '..'), QC = path.join(EP, 'qc');
const ZONE = { x0: 220, x1: 860, y0: 350, y1: 1430 }, TOL = 4;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(EP, 'source/index.html')); await page.evaluate(() => window.ready);
  const TL = await page.evaluate(() => window.TL), fps = TL.fps;
  // ---------------- countdown + early reveal ----------------
  const F0 = Math.round(TL.cd[0] * fps), F1 = Math.round((TL.cd[0] + TL.cd[1]) * fps);
  const frames = [];
  for (let f = Math.round(TL.quiz[0] * fps); f < F1 + 12; f++) {
    frames.push(await page.evaluate(f => {
      renderAt(f / TL.fps);
      const opts = [...document.querySelectorAll('.qopt')];
      const vis = el => el.checkVisibility({ opacityProperty: true, visibilityProperty: true }) && parseFloat(getComputedStyle(el).opacity) > .01;
      return { f, num: document.querySelector('.cdw .num').textContent, ring: +document.querySelector('.cdw .ring').style.strokeDashoffset,
        right: opts.filter(o => o.classList.contains('right')).map(o => o.dataset.letter), check: opts.filter(o => vis(o.querySelector('.ok'))).map(o => o.dataset.letter),
        ansHdr: vis(document.querySelector('#sQuiz .pillb.gn')), confetti: [...document.querySelectorAll('#sQuiz .conf')].some(vis) };
    }, f));
  }
  const cdFrames = frames.filter(r => r.f >= F0 && r.f < F1);
  const before = frames.filter(r => r.f < F1);
  const digitRuns = {}; cdFrames.forEach(r => digitRuns[r.num] = (digitRuns[r.num] || 0) + 1);
  const narr = require('child_process').execSync(`python3 -c "import numpy as n;a=n.load('${EP}/renders/narration.npy');s=int(${TL.cd[0]}*48000);e=int(${TL.cd[0] + TL.cd[1]}*48000);print(float(abs(a[s:e]).max()))"`).toString().trim();
  const cd = {
    fps, start_s: TL.cd[0], end_s: TL.cd[0] + TL.cd[1], duration_s: TL.cd[1], start_frame: F0, end_frame_exclusive: F1, frames: F1 - F0,
    start_on_frame_boundary: Math.abs(TL.cd[0] * fps - F0) < 1e-6,
    frames_per_digit: digitRuns, digit_sequence: [...new Set(cdFrames.map(r => r.num))],
    digit_changes_at_frames: cdFrames.filter((r, i) => i && r.num !== cdFrames[i - 1].num).map(r => r.f - F0),
    narration_peak_during_countdown: +narr,
    answer_06_starts_at_s: TL.ans[0], answer_06_start_frame: Math.round(TL.ans[0] * fps),
    reveal_time_s: TL.ans[0] + 0.06,
    early_reveal_frames: before.filter(r => r.right.length || r.check.length || r.ansHdr || r.confetti).map(r => r.f),
    first_reveal_frame: (frames.find(r => r.right.length) || {}).f, first_reveal_letter: (frames.find(r => r.right.length) || {}).right,
  };
  cd.pass = cd.frames === 150 && cd.start_on_frame_boundary && cd.digit_sequence.join() === '5,4,3,2,1' && Object.values(digitRuns).every(n => n === 30)
    && cd.narration_peak_during_countdown === 0 && cd.early_reveal_frames.length === 0 && cd.first_reveal_frame >= F1 && cd.first_reveal_letter?.[0] === 'ก';
  fs.writeFileSync(path.join(QC, 'countdown_validation.json'), JSON.stringify(cd, null, 1));
  console.log('countdown pass', cd.pass, digitRuns, 'early', cd.early_reveal_frames.length, 'first reveal', cd.first_reveal_frame, F1);
  // ---------------- rendered runs (flowchart execution) ----------------
  const runs = [];
  const QCr = await page.evaluate(() => window.QC.runs);
  for (const r of QCr) {
    const t = r.outAt + .5;  // result shown on the output symbol
    r.finishes_before_next_run = r.at + r.dur <= r.next + 1e-6;
    runs.push(await page.evaluate(([t, r]) => { renderAt(t); const pop = document.querySelector('.fc-pop'), ev = document.querySelector('.fc-eval');
      return { score: r.score, expected: r.result, finishes_before_next: r.finishes_before_next_run, at: +r.at.toFixed(2), dur: +r.dur.toFixed(2), route: r.route, shown_result: pop.textContent.trim(), eval_text: ev.textContent.replace(/\s+/g, ' ').trim(), pop_class: pop.className, ok_node: document.querySelector('.n-out_pass').style.getPropertyValue('--st'), fail_node: document.querySelector('.n-out_fail').style.getPropertyValue('--st') }; }, [t, r]));
  }
  // ---------------- safe zone ----------------
  await page.evaluate(() => {
    const SEL = '.scene .col, .scene .panel, .scene .qopt, .scene .chip, .scene .row, .scene .card6, .scene .fsn, .scene .fl-label, .scene .fc-eval, .scene .fc-pop, .scene .bigq, .scene .cdw, .scene > .abs.c';
    window.__crit = [...document.querySelectorAll(SEL)].filter(e => !e.closest('#fcbg') && !e.closest('.fc-world .fsn .lb'));
    window.__crit.forEach((e, i) => e.dataset.qid = i);
  });
  const N = Math.ceil(TL.end * fps), samples = [], viol = [];
  const probe = t => page.evaluate(t => {
    renderAt(t); const Z = { x0: 220, x1: 860, y0: 350, y1: 1430 }, res = [];
    for (const e of window.__crit) {
      if (!e.checkVisibility({ opacityProperty: true, visibilityProperty: true })) continue;
      let o = 1; for (let p = e; p && p !== document.body; p = p.parentElement) o *= parseFloat(getComputedStyle(p).opacity);
      if (o < .5) continue;
      // containers (.col / .abs.c wrappers) are measured by their rendered content, boxes (panels, cards, symbols) by their box
      let r = e.getBoundingClientRect();
      if (e.matches('.col, .scene > .abs.c') && !e.matches('.panel')) { const rg = document.createRange(); rg.selectNodeContents(e); const cr = rg.getBoundingClientRect(); if (cr.width > 1) r = cr; }
      if (r.width < 2 || r.bottom < 0 || r.top > 1920 || r.right < 0 || r.left > 1080) { if (r.width >= 2) res.push({ qid: e.dataset.qid, out: 'offscreen', o }); continue; }
      const ov = Math.max(Z.x0 - r.left, r.right - Z.x1, Z.y0 - r.top, r.bottom - Z.y1);
      if (ov > 4) res.push({ qid: e.dataset.qid, cls: (e.className.baseVal ?? e.className).slice(0, 40), text: e.textContent.replace(/\s+/g, ' ').trim().slice(0, 40), rect: [r.left, r.top, r.right, r.bottom].map(Math.round), over: Math.round(ov), o: +o.toFixed(2) });
    }
    return res;
  }, t);
  for (let f = 0; f < N; f += 6) {
    const t = f / fps; const v = (await probe(t)).filter(x => x.out !== 'offscreen');
    samples.push(f);
    for (const x of v) {
      const later = (await probe(t + .4)).find(y => y.qid === x.qid && y.out !== 'offscreen');   // still outside 0.4 s later → not a transition
      viol.push({ t: +t.toFixed(2), ...x, persists_0_4s: !!later });
    }
  }
  await page.evaluate(t => renderAt(t), 0);
  const persistent = viol.filter(v => v.persists_0_4s);
  // mobile crops: video scaled to cover the device screen
  const devices = [[375, 812], [390, 844], [430, 932]].map(([w, h]) => { const s = Math.max(w / 1080, h / 1920), vis = w / s; const cut = (1080 - vis) / 2;
    return { device: `${w}x${h}`, scale: +s.toFixed(4), visible_x: [Math.round(cut), Math.round(1080 - cut)], visible_y: [0, 1920], safe_zone_fully_visible: cut <= ZONE.x0 }; });
  const overlays = [
    { platform: 'TikTok', right_action_rail_x_from: 940, bottom_caption_y_from: 1500, top_tabs_y_to: 230 },
    { platform: 'Instagram Reels', right_action_rail_x_from: 950, bottom_caption_y_from: 1480, top_y_to: 200 },
    { platform: 'YouTube Shorts', right_action_rail_x_from: 930, bottom_caption_y_from: 1460, top_y_to: 210 }];
  overlays.forEach(o => o.zone_clear = ZONE.x1 <= o.right_action_rail_x_from && ZONE.y1 <= o.bottom_caption_y_from && ZONE.y0 >= (o.top_tabs_y_to ?? o.top_y_to));
  const report = { canvas: [1080, 1920], zone: ZONE, tolerance_px: TOL, sampling: { every_frames: 6, samples: samples.length, span_s: [0, +(N / fps).toFixed(2)], includes_transitions: true },
    critical_selectors: 'titles, panels, quiz cards, chips, recap rows, symbol nodes (incl. flowchart nodes after camera), Yes/No labels, evaluation bubble, result pop, countdown, CTA',
    mobile_devices: devices, platform_overlays: overlays,
    transient_excursions: viol.filter(v => !v.persists_0_4s).length,
    transient_examples: viol.filter(v => !v.persists_0_4s).slice(0, 12),
    persistent_violations: persistent, unresolved_critical_clipping: persistent.length, page_errors: errs };
  report.pass = persistent.length === 0 && devices.every(d => d.safe_zone_fully_visible) && overlays.every(o => o.zone_clear) && !errs.length;
  fs.writeFileSync(path.join(QC, 'safe_zone_report.json'), JSON.stringify(report, null, 1));
  console.log('safe zone pass', report.pass, 'persistent', persistent.length, 'transient', report.transient_excursions, 'errors', errs.length);
  persistent.slice(0, 30).forEach(v => console.log(JSON.stringify(v)));
  // ---------------- append rendered checks to flowchart validation ----------------
  const fv = JSON.parse(fs.readFileSync(path.join(QC, 'flowchart_validation.json')));
  fv.checks = fv.checks.filter(c => c.id !== 16 && c.id !== 'R');
  fv.checks.push({ id: 16, name: 'No correct-answer highlight before the countdown completes (every frame from quiz start to countdown end)', pass: cd.early_reveal_frames.length === 0 && cd.first_reveal_frame >= F1,
    detail: { frames_checked: before.length, first_reveal_frame: cd.first_reveal_frame, countdown_end_frame: F1 } });
  const runsOk = runs.every(r => r.finishes_before_next && r.shown_result === r.expected && r.eval_text.startsWith(`${r.score} `) && r.eval_text.endsWith(r.expected === 'ผ่าน' ? 'จริง' : 'เท็จ'));
  fv.checks.push({ id: 'R', name: 'Rendered execution runs (75, 45, 60) show the correct evaluation and result', pass: runsOk, detail: runs });
  fv.all_pass = fv.all_static_pass && fv.checks.every(c => c.pass);
  fs.writeFileSync(path.join(QC, 'flowchart_validation.json'), JSON.stringify(fv, null, 1));
  console.log('runs', runsOk, JSON.stringify(runs.map(r => [r.score, r.eval_text, r.shown_result])));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
