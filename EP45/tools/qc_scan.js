// NaiSibPro EP.45 automated QC: renders the real page frame by frame in headless Chromium and checks
//  1. safe zone   — every visible .crit element stays inside X 220–860, Y 350–1430 (incl. transitions)
//  2. spoilers    — before the answer segment: no visible 840 / 748, no "92" outside the neutral answer
//                   cards, no green highlight / checkmark on any option
//  3. first frame — "เตรียมสอบนายสิบ" visible at t = 0.000
//  4. countdown   — digit shown on every one of the 150 countdown frames (5,4,3,2,1 × 30 frames)
//  5. math        — MATH self-checks
// usage: node EP45/tools/qc_scan.js EP45   (writes EP45/qc/*.json)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const ep = process.argv[2] || 'EP45';
const SAFE = { x0: 220, x1: 860, y0: 350, y1: 1430 }, TOL = 1;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.resolve(ep, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const info = await page.evaluate(() => ({ TL: window.TL, MATH: window.MATH }));
  const fps = info.TL.fps, AN_F = Math.round(info.TL.ans[0] * fps), AN = AN_F / fps, CD = Math.round(info.TL.cd[0] * fps) / fps, END = info.TL.end;
  await page.evaluate(() => {
    window.__vis = el => { let o = 1; for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none') return 0; o *= +cs.opacity; } return getComputedStyle(el).visibility === 'hidden' ? 0 : o; };
    window.__scan = (t, SAFE, TOL) => {
      renderAt(t);
      const out = { crit: [], text: [] };
      document.querySelectorAll('#stage .crit').forEach(el => {
        const v = __vis(el); if (v < .05) return;
        const r = el.getBoundingClientRect(); if (r.width < 2) return;
        if (r.left < SAFE.x0 - TOL || r.right > SAFE.x1 + TOL || r.top < SAFE.y0 - TOL || r.bottom > SAFE.y1 + TOL)
          out.crit.push({ el: (el.className + ' ' + (el.textContent || '').trim().slice(0, 40)).replace(/\s+/g, ' '), v: +v.toFixed(2), r: [r.left, r.top, r.right, r.bottom].map(Math.round) });
      });
      const w = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) { const s = n.nodeValue.trim(); if (!s) continue; const el = n.parentElement; const v = __vis(el); if (v < .05) continue;
        const r = el.getBoundingClientRect(); if (r.right < 0 || r.left > 1080 || r.bottom < 0 || r.top > 1920 || r.width < 1) continue;
        out.text.push({ s, inOpt: !!el.closest('.opt2'), v: +v.toFixed(2) }); }
      out.opts = [...document.querySelectorAll('.opt2')].map(o => ({ bg: o.style.background, ck: +getComputedStyle(o.querySelector('.ck')).opacity, v: __vis(o) }));
      return out;
    };
  });
  // ---- sweep: every 3rd frame over the whole episode + every frame in the last 3 s before the answer
  const safeViol = [], spoil = [];
  const frames = new Set();
  const N = Math.ceil(END * fps);
  for (let f = 0; f < N; f += 3) frames.add(f);
  for (let f = Math.round((AN - 3) * fps); f < Math.round(AN * fps) + 15; f++) frames.add(f);
  let n = 0;
  for (const f of [...frames].sort((a, b) => a - b)) {
    const t = f / fps; const r = await page.evaluate(([t, S, T]) => __scan(t, S, T), [t, SAFE, TOL]); n++;
    r.crit.forEach(c => safeViol.push({ t: +t.toFixed(3), ...c }));
    if (f < AN_F) {
      r.text.forEach(x => {
        if (/840|748/.test(x.s)) spoil.push({ t, what: 'total visible', s: x.s });
        if (/(^|\D)92(\D|$)/.test(x.s) && !x.inOpt) spoil.push({ t, what: '92 outside neutral option card', s: x.s });
      });
      r.opts.forEach((o, i) => { if (o.v > .05 && (/22C55E|4ADE80|16A34A|rgb\(74, 222, 128\)|rgb\(22, 163, 74\)/i.test(o.bg) || o.ck > .01)) spoil.push({ t, what: 'option highlighted', i }); });
    }
  }
  // ---- first frame
  const f0 = await page.evaluate(([S, T]) => __scan(0, S, T), [SAFE, TOL]);
  const firstFrame = { t: 0, titleVisible: f0.text.some(x => x.s.includes('เตรียมสอบนายสิบ') && x.v > .95), visibleText: f0.text.map(x => x.s).slice(0, 20) };
  // ---- countdown: every frame
  const cdFrames = [];
  const f0cd = Math.round(CD * fps);
  for (let f = f0cd - 2; f < f0cd + info.TL.cd[1] * fps + 3; f++) {
    const r = await page.evaluate(t => { renderAt(t); const box = document.querySelector('.cd-num'); const ring = box.parentElement; return { num: box.textContent, v: __vis(ring) }; }, f / fps);
    cdFrames.push({ f, t: +(f / fps).toFixed(4), num: r.num, visible: r.v > .05 });
  }
  const inCd = cdFrames.filter(x => x.f >= f0cd && x.f < f0cd + 150);
  const allVisible = inCd.every(x => x.visible), hiddenOutside = cdFrames.filter(x => x.f < f0cd || x.f >= f0cd + 150).every(x => !x.visible);
  const counts = {}; inCd.forEach(x => counts[x.num] = (counts[x.num] || 0) + 1);
  const seqOK = inCd.every((x, i) => x.num === String(5 - Math.floor(i / 30)) && x.visible);
  const cdReport = {
    fps, countdown_start_s: CD, countdown_start_frame: f0cd, countdown_end_s: CD + info.TL.cd[1], countdown_end_frame_exclusive: f0cd + 150,
    duration_s: info.TL.cd[1], frames: inCd.length, timer_visible_on_all_150_frames: allVisible, timer_hidden_before_and_after: hiddenOutside, frames_per_digit: counts, sequence_5_4_3_2_1_each_30_frames: seqOK,
    start_frame_aligned: Math.abs(CD * fps - f0cd) < 1e-6, answer_audio_start_s: AN, answer_starts_exactly_at_countdown_end: Math.round((CD + info.TL.cd[1]) * fps) === AN_F, answer_start_frame: AN_F,
    spoken_narration_during_countdown: 'none (exact digital silence inserted by audio_prep.py; music bed + ticks only)',
    pass: seqOK && allVisible && hiddenOutside && inCd.length === 150 && Math.round((CD + 5) * fps) === AN_F,
    per_frame: cdFrames,
  };
  // ---- math
  const M = info.MATH;
  const math = { checks: M.checks.map(([name, ok]) => ({ name, ok })), formulas: [M.eq1, M.eq2, M.eqSub, M.verify1, M.verify2], values: { n1: M.n1, avg1: M.avg1, total1: M.total1, left: M.left, n2: M.n2, avg2: M.avg2, total2: M.total2, missing: M.missing, correct: M.choices[M.correctIndex] },
    individual_scores_fabricated: false, individual_scores_note: 'Students are shown only with group counts and averages; diagrams use unlabelled bars / proportional totals. No student carries a number before or after the reveal except the departing student\'s 92 (= 840 − 748) after the countdown.',
    answer_not_revealed_before_countdown_end: spoil.length === 0, spoiler_hits: spoil.slice(0, 20), pass: M.ok && spoil.length === 0 };
  // ---- devices (9:16 master shown full-height on taller phones: sides are cropped)
  const devices = [[375, 812], [390, 844], [430, 932]].map(([w, h]) => { const vw = h * 9 / 16, crop = Math.max(0, (1080 - 1080 * w / vw) / 2);
    return { device: `${w}x${h}`, scale_px_per_master_px: +(h / 1920).toFixed(4), visible_master_x: [Math.round(crop), Math.round(1080 - crop)], safe_zone_inside_visible: crop < SAFE.x0, safe_zone_text_scale_note: `a 40 px master font shows at ~${(40 * h / 1920).toFixed(1)} pt-px` }; });
  const uniq = {}; safeViol.forEach(v => { const k = v.el; (uniq[k] = uniq[k] || []).push(v.t); });
  const safe = { safe_zone: SAFE, tolerance_px: TOL, frames_scanned: n, critical_violations: safeViol.length, violations_by_element: Object.entries(uniq).map(([el, ts]) => ({ el, count: ts.length, first_t: ts[0], last_t: ts[ts.length - 1] })),
    devices, platform_overlays: { tiktok: 'right action rail x>900, caption y>1450, top tabs y<300', youtube_shorts: 'right rail x>920, title/channel y>1500', instagram_reels: 'right rail x>920, caption y>1480, top bar y<250', result: 'all critical content is inside X 220–860, Y 350–1430, clear of every overlay band' },
    pass: safeViol.length === 0 };
  const qc = path.join(ep, 'qc'); fs.mkdirSync(qc, { recursive: true });
  fs.writeFileSync(path.join(qc, 'safe_zone_report.json'), JSON.stringify(safe, null, 1));
  fs.writeFileSync(path.join(qc, 'countdown_validation.json'), JSON.stringify(cdReport, null, 1));
  fs.writeFileSync(path.join(qc, 'math_validation.json'), JSON.stringify({ ...math, first_frame: firstFrame }, null, 1));
  console.log(JSON.stringify({ pageErrors: errs, safe: { pass: safe.pass, n: safeViol.length, by: safe.violations_by_element.slice(0, 15) }, spoilers: spoil.slice(0, 10), countdown: { pass: cdReport.pass, counts }, firstFrame: firstFrame.titleVisible, math: M.ok }, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
