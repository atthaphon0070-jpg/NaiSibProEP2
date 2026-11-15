// EP52 page-level QC (runs the real page in headless Chromium, deterministic renderAt(t)).
// usage: node EP52/qc/tools/qc_page.js
// Writes EP52/qc/safe_zone_report.json, EP52/qc/countdown_validation.json, EP52/qc/frame0_check.json
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(__dirname, '../..');
const SAFE = { x0: 220, x1: 860, y0: 350, y1: 1430 }, TOL = 4;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(EP, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const TL = await page.evaluate(() => window.TL);
  const fps = TL.fps;

  // ---------- safe zone: every essential text node, sampled every 0.2 s ----------
  const samples = [];
  for (let f = 0; f < Math.ceil(TL.end * fps); f += 6) samples.push(f);
  const viol = [], settledViol = [];
  let checked = 0;
  for (const f of samples) {
    const r = await page.evaluate(({ t, S, TOL }) => {
      renderAt(t);
      const out = [];
      document.querySelectorAll('[data-ess]').forEach(el => {
        if (!el.checkVisibility({ opacityProperty: true, visibilityProperty: true })) return;
        let op = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none') return; op *= +cs.opacity; }
        if (op < .05) return;
        const rg = document.createRange(); rg.selectNodeContents(el); const b = rg.getBoundingClientRect(); if (b.width < 1) return;   // glyph extent, not the container box
        const bad = b.left < S.x0 - TOL || b.right > S.x1 + TOL || b.top < S.y0 - TOL || b.bottom > S.y1 + TOL;
        out.push({ txt: el.textContent.trim().slice(0, 40), op: +op.toFixed(2), x0: Math.round(b.left), x1: Math.round(b.right), y0: Math.round(b.top), y1: Math.round(b.bottom), bad });
      });
      return out;
    }, { t: f / fps, S: SAFE, TOL });
    checked += r.length;
    r.filter(x => x.bad).forEach(x => { const v = { frame: f, t: +(f / fps).toFixed(2), ...x }; viol.push(v); if (x.op > .95) settledViol.push(v); });
  }
  // crop of a 9:16 master on taller phones (cover fit) → visible source columns
  const devices = [[375, 812], [390, 844], [430, 932]].map(([w, hh]) => {
    const scale = hh / 1920, visW = w / scale, crop = (1080 - visW) / 2;
    return { device: `${w}x${hh}`, fit: 'cover (full-height, sides cropped)', visible_x: [+crop.toFixed(1), +(1080 - crop).toFixed(1)], safe_zone_inside: crop <= SAFE.x0 };
  });
  const overlays = {
    note: 'Approximate platform UI regions on a 1080x1920 master; essential content is kept inside X 220-860, Y 350-1430.',
    tiktok: { right_rail_x_from: 900, caption_y_from: 1500, top_bar_y_to: 260 },
    reels: { right_rail_x_from: 920, caption_y_from: 1480, top_bar_y_to: 220 },
    shorts: { right_rail_x_from: 900, caption_y_from: 1450, top_bar_y_to: 230 },
  };
  fs.writeFileSync(path.join(EP, 'qc/safe_zone_report.json'), JSON.stringify({
    safe_zone: SAFE, tolerance_px: TOL, sample_every_frames: 6, samples: samples.length, text_nodes_checked: checked,
    violations_total: viol.length, violations_fully_visible: settledViol.length,
    pass: settledViol.length === 0,
    note: 'Violations with op<0.95 are elements mid entrance/exit animation (scaled/fading); fully visible text must be inside the zone.',
    devices, overlays, violations_fully_visible_list: settledViol.slice(0, 200), transient_examples: viol.filter(v => v.op <= .95).slice(0, 30), page_errors: errs,
  }, null, 1));

  // ---------- countdown + no-early-reveal ----------
  const cdF0 = Math.round(TL.cd[0] * fps), cdF1 = cdF0 + 150, ansF0 = Math.round(TL.ans[0] * fps), quizF0 = Math.round(TL.quiz[0] * fps);
  const frames = [];
  for (let f = quizF0; f < ansF0 + 10; f++) {
    const s = await page.evaluate(t => {
      renderAt(t);
      const sc = document.getElementById('sQuiz'); if (sc.style.display === 'none') return null;
      const o = [...sc.querySelectorAll('.qz-opt')].map(e => ({ ok: +e.querySelector('.ok').style.opacity || 0, ck: getComputedStyle(e.querySelector('.ck')).opacity, ring: +e.querySelector('.ring').style.opacity || 0 }));
      const cd = sc.querySelector('.cd'), num = cd.querySelector('.n').textContent;
      return { opts: o, fill: +sc.querySelector('.fill').style.opacity || 0, cdVis: cd.style.visibility !== 'hidden' && +cd.style.opacity > .01, num, ans: getComputedStyle(sc.querySelectorAll('.row')[sc.querySelectorAll('.row').length - 1]).opacity };
    }, f / fps);
    frames.push({ f, s });
  }
  const pre = frames.filter(x => x.f < ansF0 && x.s);
  const early = pre.filter(x => x.s.fill > 0 || x.s.opts.some(o => o.ok > 0 || +o.ck > 0));
  const ringDuringCd = pre.filter(x => x.f >= cdF0 && x.s.opts.some(o => o.ring > 0));
  const cdFrames = frames.filter(x => x.f >= cdF0 && x.f < cdF1);
  const perNum = {}; cdFrames.forEach(x => { if (x.s && x.s.cdVis) perNum[x.s.num] = (perNum[x.s.num] || 0) + 1; });
  const cdVisibleOutside = frames.filter(x => (x.f < cdF0 || x.f >= cdF1) && x.s && x.s.cdVis).map(x => x.f);
  const revealFirst = frames.find(x => x.s && x.s.opts[0].ok > 0);
  const sfx = JSON.parse(fs.readFileSync(path.join(EP, 'renders/sfx.json'), 'utf8')).events.filter(e => e.type.startsWith('tick'));
  const narrInCd = TL.quiz[0] + TL.quiz[1] <= TL.cd[0] + 1e-9 && TL.ans[0] >= TL.cd[0] + TL.cd[1] - 1e-9;
  fs.writeFileSync(path.join(EP, 'qc/countdown_validation.json'), JSON.stringify({
    fps, countdown_start_s: TL.cd[0], countdown_start_frame: cdF0, countdown_end_frame_exclusive: cdF1, countdown_frames: cdF1 - cdF0, countdown_seconds: (cdF1 - cdF0) / fps,
    audio05_end_s: +(TL.quiz[0] + TL.quiz[1]).toFixed(4), padding_to_frame_boundary_s: +(TL.cd[0] - TL.quiz[0] - TL.quiz[1]).toFixed(4),
    audio06_start_s: TL.ans[0], audio06_start_frame: ansF0, audio06_starts_after_countdown: ansF0 === cdF1,
    no_narration_during_countdown: narrInCd,
    frames_per_numeral: perNum, each_numeral_30_frames: ['5', '4', '3', '2', '1'].every(n => perNum[n] === 30),
    countdown_visible_outside_window_frames: cdVisibleOutside.length,
    tick_sfx_times: sfx.map(e => e.t),
    early_reveal_frames: early.length, option_focus_ring_during_countdown_frames: ringDuringCd.length,
    first_correct_highlight_frame: revealFirst ? revealFirst.f : null, highlight_starts_with_audio06: revealFirst ? revealFirst.f === ansF0 : false,
    pass: early.length === 0 && ringDuringCd.length === 0 && ['5', '4', '3', '2', '1'].every(n => perNum[n] === 30) && ansF0 === cdF1 && narrInCd && revealFirst && revealFirst.f === ansF0,
  }, null, 1));

  // ---------- frame 0 ----------
  const f0 = await page.evaluate(() => { renderAt(0); const el = document.getElementById('h-t1'); const b = el.getBoundingClientRect(); return { text: el.textContent.replace(/\s+/g, ''), visible: el.checkVisibility({ opacityProperty: true, visibilityProperty: true }), opacity: getComputedStyle(el).opacity, box: [b.left, b.top, b.right, b.bottom].map(Math.round), subject: document.getElementById('h-t2').textContent.trim(), title: document.getElementById('h-title').textContent.replace(/\s+/g, ' ').trim() }; });
  f0.has_full_phrase = f0.text.includes('เตรียมสอบนายสิบตำรวจ');
  fs.writeFileSync(path.join(EP, 'qc/frame0_check.json'), JSON.stringify(f0, null, 1));
  console.log('safe', settledViol.length, 'transient', viol.length - settledViol.length, '| cd', JSON.stringify(perNum), 'early', early.length, '| f0', f0.has_full_phrase, '| errs', errs.length);
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
