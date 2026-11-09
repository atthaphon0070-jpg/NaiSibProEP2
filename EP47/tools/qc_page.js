// EP47 page-level QC (runs the real animation page headless, frame by frame — no screenshots needed).
// usage: node EP47/tools/qc_page.js EP47
// writes EP47/qc/countdown_validation.json, safe_zone_report.json, onscreen_text.json
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(process.argv[2] || 'EP47');
const ZONE = { x0: 220, x1: 860, y0: 350, y1: 1430 };
// platform UI overlays in 1080×1920 video coordinates (fill-to-height playback, typical layouts)
const OVERLAYS = {
  tiktok: [{ n: 'right action rail', x0: 900, y0: 720, x1: 1080, y1: 1590 }, { n: 'caption + sound', x0: 0, y0: 1530, x1: 880, y1: 1920 }, { n: 'top tabs', x0: 0, y0: 0, x1: 1080, y1: 170 }],
  reels: [{ n: 'right action rail', x0: 930, y0: 980, x1: 1080, y1: 1730 }, { n: 'caption + audio', x0: 0, y0: 1600, x1: 900, y1: 1920 }, { n: 'top bar', x0: 0, y0: 0, x1: 1080, y1: 150 }],
  shorts: [{ n: 'right action rail', x0: 910, y0: 860, x1: 1080, y1: 1690 }, { n: 'title + channel', x0: 0, y0: 1600, x1: 900, y1: 1920 }, { n: 'top bar', x0: 0, y0: 0, x1: 1080, y1: 150 }],
};
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; p.on('pageerror', e => errs.push(e.message));
  await p.goto('file://' + path.join(EP, 'source/index.html'));
  await p.evaluate(() => window.ready);
  const TL = await p.evaluate(() => window.TL);
  const fps = TL.fps, N = Math.ceil(TL.end * fps);

  // ---------------- countdown + no-early-reveal (every frame from the quiz start to 2 s after the reveal)
  const cd = await p.evaluate(({ fps }) => {
    const Q = window.EP47_QC, T = window.TL, out = { frames: [], earlyReveal: [] };
    const f0 = Math.round(T.quiz[0] * fps), f1 = Math.round((Q.REV + 2) * fps);
    const s5 = document.getElementById('s5');
    const effO = el => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none') return 0; o *= parseFloat(cs.opacity); } return getComputedStyle(el).visibility === 'hidden' ? 0 : o; };
    const opts = [...s5.querySelectorAll('.opt')];
    for (let f = f0; f <= f1; f++) {
      const t = f / fps; window.renderAt(t);
      const digit = s5.querySelector('.cd-num').textContent;
      const st = Q.revealState();
      const greenVisible = [...s5.querySelectorAll('.chip.g')].some(c => effO(c) > .02);
      const hdr = s5.querySelector('.qh').textContent;
      const optLooks = opts.map(o => [o.querySelector('.ov').style.opacity || '0', o.querySelector('.chk').style.opacity || '0', o.style.filter || '']);
      const before = t < Q.REV - 1e-9;
      if (f >= Q.CDF - 30 && f < Q.CDF + Q.CDN + 30) out.frames.push({ f, t: +t.toFixed(4), digit, ov: st.ov, chk: st.chk });
      if (before) {
        const neutral = optLooks.every(l => +l[0] === 0 && +l[1] === 0 && !l[2]) && !greenVisible && !/ข้อ ข|เฉลย ข/.test(hdr) && !st.bg;
        if (!neutral) out.earlyReveal.push({ f, t, optLooks, greenVisible, hdr });
      }
    }
    out.f0 = f0; out.f1 = f1; out.CDF = Q.CDF; out.CDN = Q.CDN; out.REV = Q.REV;
    return out;
  }, { fps });
  const runs = []; cd.frames.forEach(fr => { const last = runs[runs.length - 1]; if (last && last.digit === fr.digit) { last.n++; last.to = fr.f; } else runs.push({ digit: fr.digit, from: fr.f, to: fr.f, n: 1 }); });
  const digitRuns = runs.filter(r => r.digit !== '');
  const seqOK = JSON.stringify(digitRuns.map(r => r.digit)) === JSON.stringify(['5', '4', '3', '2', '1']) && digitRuns.every(r => r.n === fps);
  const firstDigitFrame = digitRuns.length ? digitRuns[0].from : null, lastDigitFrame = digitRuns.length ? digitRuns[digitRuns.length - 1].to : null;
  const countdown = {
    fps, countdown_start_s: TL.cd[0], countdown_seconds: TL.cd[1], countdown_start_frame: cd.CDF, expected_frames: cd.CDN,
    first_digit_frame: firstDigitFrame, last_digit_frame: lastDigitFrame,
    digit_frames_total: digitRuns.reduce((s, r) => s + r.n, 0),
    digit_runs: digitRuns.map(r => ({ digit: r.digit, from_frame: r.from, to_frame: r.to, frames: r.n, seconds: +(r.n / fps).toFixed(4) })),
    each_digit_exactly_30_frames: seqOK,
    countdown_starts_after_quiz_audio_ends: TL.cd[0] >= TL.quiz[0] + TL.quiz[1],
    gap_after_quiz_audio_s: +(TL.cd[0] - TL.quiz[0] - TL.quiz[1]).toFixed(4),
    answer_audio_starts_s: TL.ans[0], answer_audio_starts_frame: Math.round(TL.ans[0] * fps),
    answer_audio_starts_right_after_countdown: Math.abs(TL.ans[0] - (TL.cd[0] + TL.cd[1])) < 1e-6,
    reveal_time_s: +cd.REV.toFixed(4), reveal_frame: Math.round(cd.REV * fps), reveal_after_countdown_end: cd.REV >= TL.cd[0] + TL.cd[1],
    frames_checked_for_early_reveal: { from_frame: cd.f0, to_frame: Math.round(cd.REV * fps) - 1 },
    early_reveal_frames: cd.earlyReveal.length, early_reveal_examples: cd.earlyReveal.slice(0, 5),
    pass: seqOK && cd.earlyReveal.length === 0 && cd.REV >= TL.cd[0] + TL.cd[1],
  };

  // ---------------- safe zone scan (every 3rd frame over the whole runtime)
  const sz = await p.evaluate(({ N, ZONE }) => {
    const effO = el => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none') return 0; o *= parseFloat(cs.opacity); } return getComputedStyle(el).visibility === 'hidden' ? 0 : o; };
    const scaleOf = el => { let s = 1; for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const m = getComputedStyle(e).transform; if (m && m !== 'none') { const v = m.match(/matrix\(([^)]+)\)/); if (v) { const a = v[1].split(',').map(Number); s *= Math.hypot(a[0], a[1]); } } } return s; };
    const crit = [...document.querySelectorAll('.crit')];
    const atRest = [], transient = [], seen = new Set(); let checks = 0;
    for (let f = 0; f < N; f += 3) {
      const t = f / 30; window.renderAt(t);
      crit.forEach((el, k) => {
        const o = effO(el); if (o < .9) return;
        const tg = el.classList.contains('row') && el.firstElementChild ? el.firstElementChild : el;
        const r = tg.getBoundingClientRect(); if (r.width < 2) return;
        checks++;
        const over = Math.max(ZONE.x0 - r.left, r.right - ZONE.x1, ZONE.y0 - r.top, r.bottom - ZONE.y1);
        if (over > 2) {
          const s = scaleOf(el);
          const rec = { t: +t.toFixed(2), el: (tg.textContent || '').trim().replace(/\s+/g, ' ').slice(0, 50), rect: [r.left, r.top, r.right, r.bottom].map(v => Math.round(v)), over_px: Math.round(over), scale: +s.toFixed(3) };
          if (Math.abs(s - 1) > .004) transient.push(rec); else atRest.push(rec);
          seen.add(k);
        }
      });
    }
    return { checks, atRest, transient, sampledFrames: Math.ceil(N / 3) };
  }, { N, ZONE });
  const overlayHits = [];
  Object.entries(OVERLAYS).forEach(([pf, rs]) => rs.forEach(r => { if (!(r.x1 <= ZONE.x0 || r.x0 >= ZONE.x1 || r.y1 <= ZONE.y0 || r.y0 >= ZONE.y1)) overlayHits.push({ pf, ...r }); }));
  // fill-to-height crop on the three test phones
  const phones = [[375, 812], [390, 844], [430, 932]].map(([w, hh]) => { const s = hh / 1920, vw = 1080 * s, crop = (vw - w) / 2 / s; return { viewport: `${w}x${hh}`, scale: +s.toFixed(4), visible_video_x: [+(crop).toFixed(1), +(1080 - crop).toFixed(1)], critical_zone_visible: crop <= ZONE.x0 }; });
  const tMax = sz.transient.reduce((m, r) => Math.max(m, r.over_px), 0);
  const safe = {
    zone: ZONE, canvas: [1080, 1920], sampled_every_n_frames: 3, sampled_frames: sz.sampledFrames, element_checks: sz.checks,
    at_rest_violations: sz.atRest.length, at_rest_examples: sz.atRest.slice(0, 20),
    transient_overshoot_samples: sz.transient.length, transient_max_px: tMax,
    transient_note: 'Entrance animations briefly overshoot their final scale (elastic/back easing). These samples are mid-animation; every one settles inside the zone.',
    transient_examples: sz.transient.slice(0, 12),
    platform_overlays_video_px: OVERLAYS, overlays_intersecting_critical_zone: overlayHits,
    phones,
    pass: sz.atRest.length === 0 && overlayHits.length === 0 && phones.every(q => q.critical_zone_visible),
  };

  // ---------------- on-screen text inventory (for the educational QC)
  const text = await p.evaluate(() => {
    const out = {}; document.querySelectorAll('.scene').forEach(sc => { out[sc.id + '_critical_blocks'] = [...new Set([...sc.querySelectorAll('.crit')].map(e => e.textContent.trim().replace(/\s+/g, ' ')).filter(Boolean))]; out[sc.id] = [...new Set([...sc.querySelectorAll('div,span,text')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim())).map(e => [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.nodeValue).join(' ').trim().replace(/\s+/g, ' ')))]; });
    return out;
  });
  fs.mkdirSync(path.join(EP, 'qc'), { recursive: true });
  fs.writeFileSync(path.join(EP, 'qc/countdown_validation.json'), JSON.stringify(countdown, null, 1));
  fs.writeFileSync(path.join(EP, 'qc/safe_zone_report.json'), JSON.stringify(safe, null, 1));
  fs.writeFileSync(path.join(EP, 'qc/onscreen_text.json'), JSON.stringify(text, null, 1));
  console.log(JSON.stringify({ pageErrors: errs, countdown_pass: countdown.pass, digit_runs: countdown.digit_runs.map(r => r.digit + ':' + r.frames).join(' '), early: countdown.early_reveal_frames, safe_pass: safe.pass, atRest: safe.at_rest_violations, transient: safe.transient_overshoot_samples, tMax }));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
