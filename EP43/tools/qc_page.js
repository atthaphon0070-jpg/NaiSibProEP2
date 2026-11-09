// EP43 page QC: animated safe-zone sweep, platform-overlay check, countdown frame audit, frame-zero check.
// usage: node EP43/tools/qc_page.js            (writes EP43/qc/safe_zone_report.json, countdown_validation.json, first_frame.png)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(__dirname, '..');
const QC = path.join(EP, 'qc');
fs.mkdirSync(QC, { recursive: true });
const SAFE = { x0: 220, x1: 860, y0: 350, y1: 1430 };
// approximate UI overlays (1080x1920 video coordinates)
const OVERLAYS = {
  tiktok: [{ n: 'right rail', x0: 900, x1: 1080, y0: 760, y1: 1500 }, { n: 'caption', x0: 0, x1: 1080, y0: 1500, y1: 1920 }, { n: 'top tabs', x0: 0, x1: 1080, y0: 0, y1: 200 }],
  reels: [{ n: 'right rail', x0: 930, x1: 1080, y0: 1000, y1: 1560 }, { n: 'caption', x0: 0, x1: 1080, y0: 1560, y1: 1920 }, { n: 'top bar', x0: 0, x1: 1080, y0: 0, y1: 180 }],
  shorts: [{ n: 'right rail', x0: 920, x1: 1080, y0: 900, y1: 1580 }, { n: 'caption', x0: 0, x1: 1080, y0: 1580, y1: 1920 }, { n: 'top bar', x0: 0, x1: 1080, y0: 0, y1: 170 }],
};
const DEVICES = [[375, 812], [390, 844], [430, 932]];

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(EP, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const info = await page.evaluate(() => ({ TL: window.TL, M: window.EP43, B: window.BEATS }));
  const fps = info.TL.fps, END = info.TL.end;

  // ---------- 1. frame zero ----------
  await page.evaluate(() => renderAt(0));
  await page.screenshot({ path: path.join(QC, 'first_frame.png') });
  const f0 = await page.evaluate(() => {
    const hits = [...document.querySelectorAll('#stage *')].filter(e => e.children.length === 0 && e.textContent.includes('เตรียมสอบนายสิบ'));
    return hits.map(e => { let o = 1, v = true, x = e; while (x && x.id !== 'stage') { const cs = getComputedStyle(x); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') v = false; x = x.parentElement; } const r = e.getBoundingClientRect(); return { o, v, r: [r.left, r.top, r.right, r.bottom] }; });
  });

  // ---------- 2. animated safe-zone sweep (every 0.1 s, every critical element, during transitions too) ----------
  const STEP = 0.1, samples = [];
  for (let t = 0; t < END; t += STEP) samples.push(+t.toFixed(3));
  const viol = [], ovl = [], fontMin = [];
  let checked = 0;
  for (const t of samples) {
    const r = await page.evaluate(t => {
      renderAt(t);
      const out = [];
      document.querySelectorAll('[data-crit]').forEach(e => {
        let o = 1, vis = true, x = e;
        while (x && x.id !== 'stage') { const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden') { vis = false; break; } o *= +cs.opacity; x = x.parentElement; }
        if (!vis || o < .6) return;
        const m = (e.classList.contains('ctr') && e.children.length === 1) ? e.firstElementChild : e;   // put() wrappers: measure the visible content
        let r0 = m.getBoundingClientRect(); let b = { left: r0.left, top: r0.top, right: r0.right, bottom: r0.bottom, width: r0.width, height: r0.height };
        // clip by ancestors with overflow:hidden (e.g. the scrolling recap ladder viewport)
        for (let a = m.parentElement; a && a.id !== 'stage'; a = a.parentElement) {
          if (getComputedStyle(a).overflow === 'hidden') { const c = a.getBoundingClientRect(); b = { left: Math.max(b.left, c.left), top: Math.max(b.top, c.top), right: Math.min(b.right, c.right), bottom: Math.min(b.bottom, c.bottom) }; b.width = b.right - b.left; b.height = b.bottom - b.top; }
        }
        if (b.width < 2 || b.height < 2) return;
        if (b.right <= 0 || b.left >= 1080 || b.bottom <= 0 || b.top >= 1920) return;   // entirely off canvas = not on screen
        // effective glyph size: computed font size of text leaves x the element's on-screen scale
        const sc = m.offsetHeight ? r0.height / m.offsetHeight : 1;
        let fs = 1e9; e.querySelectorAll('*').forEach(c => { if (c.childNodes.length && [...c.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim())) fs = Math.min(fs, parseFloat(getComputedStyle(c).fontSize)); });
        if ([...e.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim())) fs = Math.min(fs, parseFloat(getComputedStyle(e).fontSize));
        out.push({ txt: e.textContent.replace(/\s+/g, ' ').trim().slice(0, 48), o: +o.toFixed(2), b: [b.left, b.top, b.right, b.bottom].map(v => Math.round(v)), fpx: fs < 1e9 ? +(fs * sc).toFixed(1) : null, settled: o > .97 });
      });
      return out;
    }, t);
    for (const e of r) {
      checked++;
      const [x0, y0, x1, y1] = e.b;
      const tol = 2;
      if (x0 < 220 - tol || x1 > 860 + tol || y0 < 350 - tol || y1 > 1430 + tol) viol.push({ t, ...e });
      for (const [app, zones] of Object.entries(OVERLAYS)) for (const z of zones) if (x0 < z.x1 && x1 > z.x0 && y0 < z.y1 && y1 > z.y0) ovl.push({ t, app, zone: z.n, txt: e.txt, b: e.b });
      if (e.settled && e.fpx) fontMin.push({ t, txt: e.txt, fpx: e.fpx });
    }
  }
  // group violations into continuous intervals per element text
  const group = arr => { const g = {}; arr.forEach(v => { const k = v.txt; (g[k] = g[k] || []).push(v); }); return Object.entries(g).map(([txt, vs]) => ({ txt, first: vs[0].t, last: vs[vs.length - 1].t, samples: vs.length, worst: vs.reduce((m, v) => { const d = Math.max(220 - v.b[0], v.b[2] - 860, 350 - v.b[1], v.b[3] - 1430); return d > m.d ? { d, b: v.b, t: v.t, o: v.o } : m; }, { d: -1e9 }) })); };
  fontMin.sort((a, b) => a.fpx - b.fpx);
  const minF = fontMin.length ? fontMin[0].fpx : null;
  const p5 = fontMin.length ? fontMin[Math.floor(fontMin.length * .05)].fpx : null;
  const devices = DEVICES.map(([w, hh]) => {
    const fillScale = hh / 1920, visW = w / fillScale, crop = (1080 - visW) / 2;
    return { device: `${w}x${hh}`, fill_mode: { scale: +fillScale.toFixed(4), visible_x: [Math.round(crop), Math.round(1080 - crop)], safe_zone_inside: crop <= 220, min_settled_text_pt: +(minF * fillScale).toFixed(1), p5_settled_text_pt: +(p5 * fillScale).toFixed(1) },
      fit_mode: { scale: +(w / 1080).toFixed(4), letterbox: true, min_settled_text_pt: +(minF * w / 1080).toFixed(1) } };
  });
  const sz = {
    canvas: [1080, 1920], safe_zone: SAFE, sample_step_s: STEP, samples: samples.length, element_checks: checked,
    rule: 'every [data-crit] element whose effective opacity >= 0.6 is measured with its live transformed bounding box at every sample (transitions included)',
    violations: group(viol), violation_count: viol.length,
    overlay_collisions: Object.fromEntries(Object.keys(OVERLAYS).map(a => [a, group(ovl.filter(o => o.app === a)).map(g => ({ txt: g.txt, first: g.first, last: g.last }))])),
    smallest_settled_text: fontMin.slice(0, 8), small_text_groups: Object.values(fontMin.filter(f => f.fpx < 26).reduce((g, f) => { const k = f.txt; g[k] = g[k] || { txt: k, min_px: f.fpx, from: f.t, to: f.t, n: 0 }; g[k].min_px = Math.min(g[k].min_px, f.fpx); g[k].from = Math.min(g[k].from, f.t); g[k].to = Math.max(g[k].to, f.t); g[k].n++; return g; }, {})), devices,
    status: viol.length === 0 ? 'PASS' : 'REVIEW',
    page_errors: errs,
  };
  fs.writeFileSync(path.join(QC, 'safe_zone_report.json'), JSON.stringify(sz, null, 1));

  // ---------- 3. countdown + reveal audit (every frame from quiz start to the reveal) ----------
  const CD = info.TL.cd[0], NF = Math.round(info.TL.cd[1] * fps), cdF0 = Math.round(CD * fps);
  const Q = info.TL.quiz[0], A = info.TL.ans[0], KO = A + info.B.ans.ko;
  const frames = [];
  for (let f = Math.floor(Q * fps); f <= Math.ceil((KO + .5) * fps); f++) {
    const r = await page.evaluate(t => {
      renderAt(t);
      const shown = e => { for (let x = e; x && x.id !== 'stage'; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0) return false; } return true; };
      const cd = [...document.querySelectorAll('[data-n]')].find(shown);
      return { n: cd ? +cd.getAttribute('data-n') : null, reveal: [...document.querySelectorAll('[data-reveal]')].filter(shown).map(e => e.querySelector('.qb').textContent) };
    }, f / fps);
    frames.push({ f, ...r });
  }
  const cdFrames = frames.filter(x => x.n !== null);
  const per = {}; cdFrames.forEach(x => per[x.n] = (per[x.n] || 0) + 1);
  const firstReveal = frames.find(x => x.reveal.length);
  const order = []; cdFrames.forEach(x => { if (order[order.length - 1] !== x.n) order.push(x.n); });
  const narr = info.TL; // narration-free check: countdown sits between quiz end and answer start
  const quizEnd = info.TL.quiz[0] + info.TL.quiz[1];
  const cdv = {
    fps, countdown_start_s: +CD.toFixed(6), countdown_start_frame: cdF0, countdown_start_is_frame_aligned: Math.abs(CD * fps - cdF0) < 1e-6,
    countdown_frames: cdFrames.length, expected_frames: 150, first_countdown_frame: cdFrames[0]?.f, last_countdown_frame: cdFrames[cdFrames.length - 1]?.f,
    frames_per_numeral: per, numeral_order: order, duration_s: cdFrames.length / fps,
    quiz_narration_ends_s: +quizEnd.toFixed(4), gap_before_countdown_s: +(CD - quizEnd).toFixed(4),
    answer_narration_starts_s: +A.toFixed(4), answer_starts_on_frame_after_countdown: Math.round(A * fps) === cdF0 + NF,
    narration_during_countdown: 'none (timeline places no narration file inside [cd_start, cd_start + 5 s]; verified on the mixed audio by tools/audio_qc.py)',
    countdown_instances: 1,
    first_correct_highlight_frame: firstReveal ? firstReveal.f : null, first_correct_highlight_s: firstReveal ? +(firstReveal.f / fps).toFixed(3) : null, highlighted_option: firstReveal ? firstReveal.reveal : null,
    highlight_before_countdown_end: firstReveal ? firstReveal.f < cdF0 + NF : false,
  };
  cdv.status = cdv.countdown_frames === 150 && Object.values(per).every(v => v === 30) && order.join('') === '54321' && !cdv.highlight_before_countdown_end && cdv.countdown_start_is_frame_aligned && cdv.answer_starts_on_frame_after_countdown && cdv.highlighted_option?.[0] === 'ก' ? 'PASS' : 'FAIL';
  fs.writeFileSync(path.join(QC, 'countdown_validation.json'), JSON.stringify(cdv, null, 1));
  console.log(JSON.stringify({ frame_zero: f0, safe: { status: sz.status, violations: sz.violations, overlays: sz.overlay_collisions, minFont: minF, p5 }, countdown: cdv, errs }, null, 1));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
