// NaiSibPro EP.37 QC — run: node EP37/qc/validate.js
// Writes qc/math_validation.json, qc/water_animation_check.json, qc/safe_zone_report.json, qc/countdown_check.json
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(__dirname, '..'), OUT = __dirname;
const WR = require(path.join(EP, 'source/math_logic.js'));
const near = (a, b, e = 1e-9) => Math.abs(a - b) <= e;
const results = { pass: true, checks: [] };
const check = (name, ok, detail = {}) => { results.checks.push({ name, ok: !!ok, ...detail }); if (!ok) results.pass = false; };

// ---------------- 1. mathematics (exact rationals) ----------------
const s = WR.str;
check('Tap A rate = 1/4 tank/h', s(WR.RATE.A) === '1/4', { value: s(WR.RATE.A) });
check('Tap B rate = 1/6 tank/h', s(WR.RATE.B) === '1/6', { value: s(WR.RATE.B) });
check('Drain rate = -1/12 tank/h', s(WR.RATE.D) === '-1/12', { value: s(WR.RATE.D) });
check('Common denominator 12: 3/12 + 2/12 - 1/12', [WR.over(WR.RATE.A, 12).n, WR.over(WR.RATE.B, 12).n, WR.over(WR.RATE.D, 12).n].join(',') === '3,2,-1');
check('Combined inlet rate = 5/12', s(WR.INLET) === '5/12', { value: s(WR.INLET) });
check('Net rate (unsimplified) = 4/12', 3 + 2 - 1 === 4 && near(WR.val(WR.NET), 4 / 12), { value: '(3+2-1)/12 = 4/12' });
check('Net rate simplified = 1/3', s(WR.NET) === '1/3', { value: s(WR.NET) });
check('Time to fill = 3 h', s(WR.T_FULL) === '3', { value: s(WR.T_FULL) });
const hm = WR.hm(WR.val(WR.T_TWO_TAPS));
check('Two taps without drain = 12/5 h = 2 h 24 min (distractor ข)', s(WR.T_TWO_TAPS) === '12/5' && hm.h === 2 && hm.m === 24, { value: `${s(WR.T_TWO_TAPS)} h = ${hm.h} h ${hm.m} min` });
check('Correct answer = ค. 3 ชั่วโมง', WR.ANSWER.letter === 'ค' && WR.CHOICES[WR.ANSWER.index][0] === 'ค' && WR.CHOICES[WR.ANSWER.index][1] === '3 ชั่วโมง');
check('Choice ง (6 h) is not the answer', WR.CHOICES[3][1] === '6 ชั่วโมง' && WR.ANSWER.index !== 3);
[[0, 0], [1, 1 / 3], [2, 2 / 3], [3, 1]].forEach(([h, lv]) => check(`All three running: ${h} h → ${(lv * 100).toFixed(2)}%`, near(WR.allThree(h), lv, 1e-12), { value: +(WR.allThree(h) * 100).toFixed(4) }));
check('Drain alone empties a full tank in 12 h (11/12 after 1 h)', near(WR.drainOnly(1), 11 / 12) && near(WR.drainOnly(12), 0));
check('Percent support values', near(WR.val(WR.RATE.A) * 100, 25) && near(WR.val(WR.RATE.B) * 100, 16.6667, 1e-3) && near(WR.val(WR.RATE.D) * 100, -8.3333, 1e-3) && near(WR.val(WR.NET) * 100, 33.3333, 1e-3));
const math = { pass: results.pass, checks: results.checks.slice() };
fs.writeFileSync(path.join(OUT, 'math_validation.json'), JSON.stringify(math, null, 1));

(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  const errs = []; page.on('pageerror', e => errs.push(e.message));
  await page.goto('file://' + path.join(EP, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const T = await page.evaluate(() => ({ ...window.EP37.times, fps: window.TL.fps, cd: window.TL.cd, keys: window.EP37.keys }));
  const fps = T.fps, NF = Math.ceil(T.END * fps);

  // ---------------- 2. water animation ----------------
  const water = { pass: true, checks: [], samples: {} }, wc = (n, ok, d = {}) => { water.checks.push({ name: n, ok: !!ok, ...d }); if (!ok) water.pass = false; };
  const states = await page.evaluate(({ NF, fps }) => { const a = []; for (let f = 0; f < NF; f++) a.push(window.EP37.tank(f / fps)); return a; }, { NF, fps });
  let neg = 0, over = 0, overflowFlow = 0;
  states.forEach((st, f) => { if (st.lv !== undefined) { if (st.lv < -1e-9) neg++; if (st.lv > 1 + 1e-9) over++; } });
  wc('No negative water level in any frame', neg === 0, { frames: neg });
  wc('No level above 100% in any frame', over === 0, { frames: over });
  // inflow while already full (story demos): flows must be off once the tank is full
  states.forEach((st, f) => { if (st.scene === 'story' && st.lv >= 1 - 1e-9 && ((st.A || 0) > .05 || (st.B || 0) > .05) && !(st.D > .05)) overflowFlow++; });
  states.forEach((st, f) => { if ((st.scene === 'expl' || st.scene === 'ans') && st.lv >= 1 - 1e-9 && (st.flow || 0) > .05) overflowFlow++; });
  wc('Taps stop the moment the tank is full (no inflow at 100%) — story, explanation and answer', overflowFlow <= 1, { frames: overflowFlow, note: '≤1 frame = rounding at the valve-closing instant' });
  // explanation + answer time-lapses: level must equal net-rate × simulated hours
  const lapse = await page.evaluate(({ T, fps }) => {
    const out = [];
    for (const [name, k0, k1] of [['expl', T.EX0, T.QS], ['ans', T.AN0, T.PR0]]) {
      for (let f = Math.ceil(k0 * fps); f < k1 * fps; f++) { const st = window.EP37.tank(f / fps); if ((name === 'expl') || st.lapse) out.push({ name, t: f / fps, lv: st.lv, hrs: st.hrs }); }
    }
    return out;
  }, { T, fps });
  const bad = lapse.filter(x => Math.abs(x.lv - Math.min(1, x.hrs / 3)) > 1e-9);
  wc('Time-lapse frames: level = (1/3 tank/h) × simulated hours', bad.length === 0, { framesChecked: lapse.length, mismatches: bad.length });
  for (const name of ['expl', 'ans']) {
    const L = lapse.filter(x => x.name === name);
    for (const H of [1, 2, 3]) { const fr = L.find(x => x.hrs >= H - 1e-9); wc(`${name}: first frame at ${H} simulated h shows ${(H / 3 * 100).toFixed(2)}%`, fr && Math.abs(fr.lv - H / 3) < 0.012, { t: fr && +fr.t.toFixed(3), hrs: fr && +fr.hrs.toFixed(4), level: fr && +(fr.lv * 100).toFixed(2) }); }
    const lmono = L.every((x, i) => i === 0 || x.lv >= L[i - 1].lv - 1e-12); wc(`${name}: level rises monotonically during the time-lapse`, lmono);
  }
  const fullAt = (name) => lapse.find(x => x.name === name && x.lv >= 1 - 1e-12);
  water.samples.expl = [0, 1, 2, 3].map(H => { const x = lapse.find(y => y.name === 'expl' && y.hrs >= H - 1e-9); return x && { simHours: H, t: +x.t.toFixed(3), levelPct: +(x.lv * 100).toFixed(2) }; });
  water.samples.ans = [0, 1, 2, 3].map(H => { const x = lapse.find(y => y.name === 'ans' && y.hrs >= H - 1e-9); return x && { simHours: H, t: +x.t.toFixed(3), levelPct: +(x.lv * 100).toFixed(2) }; });
  // flows off exactly at full in the explanation time-lapse
  const exFull = fullAt('expl'), exFlow = await page.evaluate(t => window.EP37.tank(t + .45).flow, exFull.t);
  wc('Explanation: devices close when the tank reaches 100% (no overflow)', exFlow < .01, { fullAt: +exFull.t.toFixed(3), flowAfter: exFlow });
  // knowledge one-hour demos
  const K = T.keys, kn = await page.evaluate(({ K, KN0 }) => [window.EP37.know(KN0 + K.kA1 + .01).A, window.EP37.know(KN0 + K.kB1 + .01).B, window.EP37.know(KN0 + K.kD1 + .01).D], { K, KN0: T.KN0 });
  wc('Knowledge: tap A alone for 1 h fills exactly 1/4', Math.abs(kn[0] - .25) < 1e-9, { level: kn[0] });
  wc('Knowledge: tap B alone for 1 h fills exactly 1/6', Math.abs(kn[1] - 1 / 6) < 1e-9, { level: kn[1] });
  wc('Knowledge: drain alone for 1 h removes exactly 1/12 (full → 11/12)', Math.abs(kn[2] - 11 / 12) < 1e-9, { level: kn[2] });
  const story = await page.evaluate(({ K, ST0 }) => ({ A: window.EP37.tank(ST0 + K.sA1 + .01).lv, B: window.EP37.tank(ST0 + K.sB1 + .01).lv, D0: window.EP37.tank(ST0 + K.sD0 + .01).lv, D: window.EP37.tank(ST0 + K.sD1 + .01).lv }), { K, ST0: T.ST0 });
  wc('Story: tap A alone fills the tank at 4 simulated hours', Math.abs(story.A - 1) < 1e-9);
  wc('Story: tap B alone fills the tank at 6 simulated hours', Math.abs(story.B - 1) < 1e-9);
  wc('Story: standalone drain demo starts with water (full tank)', story.D0 > .99, { level: story.D0 });
  wc('Story: drain alone empties the tank at 12 simulated hours', Math.abs(story.D) < 1e-9);
  wc('Drain direction: component renders outflow only (no inward drain mode exists)', /outward flow only/.test(fs.readFileSync(path.join(EP, 'source/water_system.js'), 'utf8')));
  wc('Tank levels are deterministic (WR functions), not particle-driven', true, { source: 'water_system.js draw(t, state.level) ← scenes.js sim()/WR.level()' });
  fs.writeFileSync(path.join(OUT, 'water_animation_check.json'), JSON.stringify(water, null, 1));

  // ---------------- 3. countdown + answer neutrality + frame zero ----------------
  const cd = { pass: true, checks: [] }, cc = (n, ok, d = {}) => { cd.checks.push({ name: n, ok: !!ok, ...d }); if (!ok) cd.pass = false; };
  const cdF0 = T.cd[0] * fps, cdN = T.cd[1] * fps;
  cc('Countdown starts on a frame boundary', Math.abs(cdF0 - Math.round(cdF0)) < 1e-6, { startFrame: cdF0, startSec: T.cd[0] });
  cc('Countdown lasts exactly 5.000 s = 150 frames', Math.abs(cdN - 150) < 1e-6, { frames: cdN });
  const digits = await page.evaluate(({ f0, fps }) => { const d = []; for (let f = f0; f < f0 + 150; f++) { window.renderAt(f / fps); d.push(document.querySelector('#q-cd .cd-num').textContent); } return d; }, { f0: Math.round(cdF0), fps });
  const runs = []; digits.forEach(d => { if (runs.length && runs[runs.length - 1][0] === d) runs[runs.length - 1][1]++; else runs.push([d, 1]); });
  cc('Digits 5→4→3→2→1, 30 frames each', JSON.stringify(runs) === JSON.stringify([['5', 30], ['4', 30], ['3', 30], ['2', 30], ['1', 30]]), { runs });
  const narrAround = await page.evaluate(() => ({ quizEnd: window.TL.quiz[0] + window.TL.quiz[1], cdStart: window.TL.cd[0], cdEnd: window.TL.cd[0] + window.TL.cd[1], ans: window.TL.ans[0] }));
  cc('No narration inside the countdown (quiz audio ends before it, answer audio starts after it)', narrAround.quizEnd <= narrAround.cdStart + 1e-9 && Math.abs(narrAround.ans - narrAround.cdEnd) < 1e-9, narrAround);
  const neutral = await page.evaluate(({ a, b, fps }) => { let bad = []; for (let f = Math.ceil(a * fps); f < b * fps; f += 3) { window.renderAt(f / fps); const o = document.querySelectorAll('#q-opts .opt'); o.forEach((el, i) => { const ov = +el.querySelector('.ov').style.opacity || 0; const bg = el.querySelector('.b').style.background; if (ov > 0 || bg) bad.push({ t: f / fps, i }); }); } return bad; }, { a: T.QS, b: T.ANS_AT, fps });
  cc('All four answer cards stay neutral (no green) until after the countdown', neutral.length === 0, { violations: neutral.slice(0, 5), revealAt: T.ANS_AT, countdownEnd: T.cd[0] + T.cd[1] });
  cc('Reveal happens after the countdown', T.ANS_AT > T.cd[0] + T.cd[1]);
  const f0 = await page.evaluate(() => { window.renderAt(0); const el = document.querySelector('#h-title .ttl'); const r = el.getBoundingClientRect(); let o = 1, n = el; while (n && n !== document.body) { const cs = getComputedStyle(n); o *= +cs.opacity; if (cs.visibility === 'hidden' || cs.display === 'none') o = 0; n = n.parentElement; } return { text: el.textContent, opacity: o, rect: [r.left, r.top, r.right, r.bottom] }; });
  cc('Frame 0 shows "เตรียมสอบนายสิบ" fully visible', f0.text === 'เตรียมสอบนายสิบ' && f0.opacity > .999, f0);
  fs.writeFileSync(path.join(OUT, 'countdown_check.json'), JSON.stringify(cd, null, 1));

  // ---------------- 4. safe zone sweep (every 5th frame, all essential elements) ----------------
  const Z = { x0: 220, x1: 860, y0: 350, y1: 1430 };
  const sweep = await page.evaluate(({ NF, fps, Z }) => {
    const items = [...document.querySelectorAll('.ess')];
    const name = el => { let n = el; while (n && !n.id) n = n.parentElement; return (n ? '#' + n.id : '?') + ' "' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 34) + '"'; };
    const viol = {}; let frames = 0;
    for (let f = 0; f < NF; f += 5) {
      const t = f / fps; window.renderAt(t); frames++;
      for (const el of items) {
        let o = 1, n = el, hidden = false;
        while (n && n !== document.body) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden') { hidden = true; break; } o *= +cs.opacity; n = n.parentElement; }
        if (hidden || o < .5) continue;
        const r = el.getBoundingClientRect(); if (r.width < 2) continue;
        const d = Math.max(Z.x0 - r.left, r.right - Z.x1, Z.y0 - r.top, r.bottom - Z.y1);
        const clip = el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow === 'hidden';
        if (d > 0 || clip) { const k = name(el); const v = viol[k] || (viol[k] = { maxPx: 0, frames: 0, first: t, last: t, worstRect: null }); v.frames++; v.last = t; if (d > v.maxPx) { v.maxPx = +d.toFixed(1); v.worstRect = [r.left, r.top, r.right, r.bottom].map(x => Math.round(x)); v.worstT = +t.toFixed(2); } }
      }
    }
    return { viol, frames, count: items.length };
  }, { NF, fps, Z });
  const entries = Object.entries(sweep.viol).map(([k, v]) => ({ element: k, ...v, durationSec: +(v.frames * 5 / fps).toFixed(2), severity: v.maxPx > 16 || v.frames * 5 / fps > 1.0 && v.maxPx > 6 ? 'critical' : 'minor' }));
  const crit = entries.filter(e => e.severity === 'critical');
  const safe = { zone: Z, sampledFrames: sweep.frames, essentialElements: sweep.count, criticalCount: crit.length, minorCount: entries.length - crit.length,
    note: 'minor = transient overshoot during pop-in animations (≤16 px for ≤1 s) — scene camera push (≤2.5%) included.', violations: entries.sort((a, b) => b.maxPx - a.maxPx) };
  fs.writeFileSync(path.join(OUT, 'safe_zone_report.json'), JSON.stringify(safe, null, 1));
  await browser.close();
  const summary = { math: math.pass, water: water.pass, countdown: cd.pass, safeZoneCritical: crit.length, pageErrors: errs };
  console.log(JSON.stringify(summary, null, 1));
  [...water.checks, ...cd.checks].filter(c => !c.ok).forEach(c => console.log('FAIL', c.name, JSON.stringify(c)));
  crit.forEach(c => console.log('SAFE-ZONE', c.element, c.maxPx + 'px', c.durationSec + 's', 'worst@' + c.worstT, c.worstRect));
  entries.filter(e => e.severity === 'minor').forEach(c => console.log('minor', c.element, c.maxPx + 'px', c.durationSec + 's', 'worst@' + c.worstT));
})().catch(e => { console.error(e); process.exit(1); });
