// NaiSibPro EP.41 — Train passing a pole and a bridge. Scenes timed to the measured narration (beats.js).
const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark } = NSP;
const T = window.TL, M = window.MATH, B = window.BEATS, C = TRAIN.C, V = TRAIN.ANIM_V;
const S = k => T[k][0], D = k => T[k][1];
const ST = S('story'), KN = S('know'), EX = S('expl'), QZ = S('quiz'), CD = S('cd'), AN = S('ans'), PR = S('promo');
const L = M.trainLen * TRAIN.SCALE;                       // train length on screen (px)
const BRX0 = 425, BRX1 = BRX0 + M.bridgeLen * TRAIN.SCALE; // bridge on screen: 425 → 655
const POLE = 540;

// ---------- blue theme for the shared background (episode-local) ----------
document.querySelectorAll('#bg .blob').forEach((el, i) => { el.style.background = `radial-gradient(circle, ${['rgba(149,191,239,.6)', 'rgba(34,211,238,.25)', 'rgba(47,107,255,.16)', 'rgba(149,191,239,.55)'][i]} 0%, rgba(255,255,255,0) 68%)`; });
document.querySelectorAll('#particles .pt').forEach(p => { p.innerHTML = p.innerHTML.replace(/#F5A9C7/gi, '#95BFEF').replace(/#F8CFE2/gi, '#CFE6FF'); });

// ---------- icons (SVG; Prompt has no arrow/check/emoji glyphs) ----------
const IC = {
  arrow: (s = 40, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3 12h15M13 6l6 6-6 6" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  warn: (s = 44) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2.5L23 21.5H1z" fill="#FFD23F" stroke="#142B53" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 9v6" stroke="#142B53" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="18.3" r="1.5" fill="#142B53"/></svg>`,
  bulb: (s = 40) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4.9 1 .9 1.6V16h5.2v-.5c0-.6.3-1.2.9-1.6A6 6 0 0 0 12 3z" fill="#FFD23F" stroke="#142B53" stroke-width="1.4"/></svg>`,
  gauge: (s = 40, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3.5 17a8.5 8.5 0 1 1 17 0" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/><path d="M12 17l5-6" stroke="#142B53" stroke-width="2.8" stroke-linecap="round"/><circle cx="12" cy="17" r="2.2" fill="#142B53"/></svg>`,
  timer: (s = 36, c = '#142B53') => ICON.timer(s, c),
  check: (s = 36, c = '#16A34A') => ICON.check(c, s),
  cross: (s = 36, c = '#EF4444') => ICON.cross(c, s),
  comment: (s = 44, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="${c}"/><path d="M7 9h10M7 13h6" stroke="#2F6BFF" stroke-width="2" stroke-linecap="round"/></svg>`,
  like: (s = 36) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M2 10h4v11H2zM8 21h9.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 19 10h-5l1-4.5A2 2 0 0 0 13 3l-5 7z" fill="#fff"/></svg>`,
  share: (s = 36) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M14 4l7 7-7 7v-4c-6 0-9 2-11 6 1-6 4-11 11-12z" fill="#fff"/></svg>`,
  bell: (s = 36) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" fill="#fff"/></svg>`,
  train: (s = 40, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="2" y="6" width="17" height="10" rx="3" fill="${c}"/><path d="M19 7c2 0 3 3 3 6v3h-3z" fill="${c}"/><rect x="4" y="8" width="4" height="3" rx="1" fill="#E6F4FF"/><rect x="10" y="8" width="4" height="3" rx="1" fill="#E6F4FF"/><circle cx="6" cy="18" r="2" fill="#142B53"/><circle cx="16" cy="18" r="2" fill="#142B53"/><path d="M1 21h22" stroke="#142B53" stroke-width="1.6"/></svg>`,
};
const ic = (svg) => `<span class="icn">${svg}</span>`;
const add = (parent, html) => { const el = h(html); parent.appendChild(el); return el; };
const row = (parent, top, inner, extra = '') => add(parent, `<div class="row c" data-safe="text" style="top:${top}px;${extra}">${inner}</div>`);
const hd = (parent, top, inner) => add(parent, `<div class="hd c" data-safe="text" style="top:${top}px">${inner}</div>`);
const show = (el, u, a, b = 1e9, o = {}) => tf(el, life(u, a, b, { from: .5, dy: 40, ...o }));
const FITS = [];
const fit = (el, max = 570) => { FITS.push([el, max]); return el; };
const clackRun = (t0, t1, step = .42, g = .45) => { for (let t = t0; t < t1; t += step) sfx('clack', t, g); };

// =====================================================================================
// SCENE 1 — HOOK (frame zero already shows the exam title, train, pole, bridge, timer and the question)
// =====================================================================================
const s1 = $('s1'), b1 = B.hook;
const h1 = hd(s1, 368, `<div class="in" style="font-size:52px"><span class="dot">!</span>เตรียมสอบนายสิบ!</div>`);
const h1s = row(s1, 466, `<div class="chipb cy" style="font-size:32px">${ic(IC.train(36, '#142B53'))}วิชาคณิตศาสตร์</div>`);
const dA1 = TRAIN.diagram(s1, { top: 545, h: 270, railY: 200, panel: [196, 0, 688, 270], pole: POLE });
const dB1 = TRAIN.diagram(s1, { top: 835, h: 290, railY: 186, panel: [196, 0, 688, 290], bridge: { x0: BRX0, len: M.bridgeLen }, dimY: 252 });
const cA1 = row(s1, 560, `<div class="chipb dk">ผ่านเสาไฟ</div><div class="chipb cy hA1">${ic(IC.timer(34))}<span class="tA1">8 วินาที</span></div>`, 'justify-content:space-between');
const cB1 = row(s1, 850, `<div class="chipb dk">ผ่านสะพาน</div><div class="chipb cy">${ic(IC.timer(34))}<span class="tB1">18 วินาที</span></div>`, 'justify-content:space-between');
const q1a = row(s1, 1146, `<div class="big" style="font-size:68px">รถไฟยาว<span class="hl">กี่เมตร?</span></div>`);
const q1b = fit(row(s1, 1146, `<div class="big" style="font-size:60px">รถไฟขบวนนี้ยาว<span class="hl">กี่เมตร?</span></div>`));
const w1 = fit(row(s1, 1262, `<div class="cardx rd col" style="font-size:40px;padding:12px 30px 14px"><div style="display:flex;align-items:center;gap:12px">${ic(IC.warn(46))}โจทย์ถาม<span class="hl">ความยาวรถไฟ</span></div><div class="small r" style="font-size:32px">ไม่ใช่ความยาวสะพาน!</div></div>`));
const aA1 = dA1.arrow({ y: 238, labelY: 238, color: C.yellow, label: '? เมตร', labelColor: C.navy, labelFill: C.yellow, size: 28 });
const fl1 = add(s1, `<div class="flash"></div>`);
// motion: idle at frame zero, then constant speed
const evA1 = u => { const tA = b1.pole + .45 + (POLE - 470) / V; return TRAIN.event(Math.max(u, b1.pole + .45), { xStart: POLE, dist: L, tA }); };
const evB1 = u => { const tA = b1.bridge + .3 + (BRX0 - 395) / V; return TRAIN.event(Math.max(u, b1.bridge + .3), { xStart: BRX0, dist: BRX1 - BRX0 + L, tA }); };
{ const a = evA1(0), b = evB1(0); sfx('whoosh', 0, .5); sfx('pop', b1.math, .6); clackRun(b1.pole + .45, a.tB, .4); sfx('ding', a.tB, .6);
  clackRun(b1.bridge + .3, b.tB, .4); sfx('ding', b.tB, .7); sfx('pop', b1.ask, .9); sfx('riser', b1.warn - .7, .5); sfx('drop', b1.warn + .05, .8); sfx('pop', b1.warn2, .5); sfx('horn', b1.pole + .2, .5); }
function drawHook(t) {
  const u = t;
  // frame zero: everything already visible (no entrance), gentle motion only
  tf(h1, { s: 1 + .04 * Math.max(0, 1 - Math.abs(u - b1.title - .2) / .4) + .01 * Math.sin(u * 2.2) });
  tf(h1s, { s: 1 + .08 * Math.max(0, 1 - Math.abs(u - b1.math - .2) / .3) });
  // pole demo
  const a = evA1(u), mvA = u > b1.pole + .45 && !a.done;
  dA1.setTrain(a.front, { vib: mvA ? Math.sin(u * 38) * .7 : 0, speed: mvA ? .9 : 0 });
  dA1.lamp(a.started && !a.done);
  $('s1').querySelector('.tA1').textContent = u < b1.pole + .45 ? '8 วินาที' : (a.done ? `${M.poleTime} วินาที` : `${a.story.toFixed(1)} วินาที`);
  tf(cA1.lastElementChild, { s: 1 + .06 * Math.max(0, 1 - Math.abs(u - a.tB) / .3) });
  // bridge demo
  const b = evB1(u), mvB = u > b1.bridge + .3 && !b.done;
  dB1.setTrain(b.front, { vib: mvB ? Math.sin(u * 38) * .7 : 0, speed: mvB ? .9 : 0 });
  dB1.sweep(P(u, b1.bridge + .6, 1.4));
  $('s1').querySelector('.tB1').textContent = u < b1.bridge + .3 ? '18 วินาที' : (b.done ? `${M.bridgeTime} วินาที` : `${b.story.toFixed(1)} วินาที`);
  tf(cB1.lastElementChild, { s: 1 + .06 * Math.max(0, 1 - Math.abs(u - b.tB) / .3) });
  // question: short version at frame zero, full version on the spoken question
  tf(q1a, { s: 1 + .015 * Math.sin(u * 2.5), o: 1 - P(u, b1.ask - .1, .2) });
  const qb = life(u, b1.ask, 1e9, { from: .6, dy: 0, d: .6 });
  tf(q1b, { ...qb, y: -lerp(0, 40, E.inOut(P(u, b1.warn - .3, .5))) });
  // "? เมตร" over the train (train length is the unknown)
  aA1.set(a.front - L, a.front, E.out(P(u, b1.ask + .3, .6)), clamp((u - b1.ask - .3) * 4));
  // warning
  const wl = life(u, b1.warn, 1e9, { from: .6, dy: 30, d: .6 });
  tf(w1, { ...wl, x: u > b1.warn && u < b1.warn + .5 ? Math.sin(u * 60) * 6 * (1 - P(u, b1.warn, .5)) : 0, s: wl.s * (1 + .02 * Math.sin(u * 4)) });
  // push-in before the story
  const push = E.inOut(P(u, b1.go, D('hook') - b1.go));
  dA1.el.style.transform = `translateY(${-6 * push}px)`; dB1.el.style.transform = `translateY(${-6 * push}px)`;
  fl1.style.opacity = .5 * Math.max(0, 1 - Math.abs(u - a.tB) / .12) + .5 * Math.max(0, 1 - Math.abs(u - b.tB) / .12);
}

// =====================================================================================
// SCENE 2 — STORY: constant speed → pole event (front reaches pole … tail passes) → bridge event
// =====================================================================================
const s2 = $('s2'), b2 = B.story;
const h2 = [
  hd(s2, 368, `<div class="in">${ic(IC.gauge(44, '#22D3EE'))}รถไฟวิ่งด้วยความเร็วคงที่</div>`),
  hd(s2, 368, `<div class="in"><span class="dot">1</span>ผ่านเสาไฟ</div>`),
  hd(s2, 368, `<div class="in"><span class="dot">2</span>ผ่านสะพาน ${M.bridgeLen} เมตร</div>`),
];
const sp2 = add(s2, `<div class="abs c" data-safe="text" style="left:236px;top:500px"><div class="chipb">${ic(IC.gauge(38))}ความเร็วคงที่ตลอดทาง</div></div>`);
const sw2 = TRAIN.stopwatch(s2, { x: 694, y: 462, size: 150 });
const dP2 = TRAIN.diagram(s2, { top: 640, h: 370, railY: 250, panel: [196, 0, 688, 370], pole: POLE });
const dB2 = TRAIN.diagram(s2, { top: 640, h: 370, railY: 250, panel: [196, 0, 688, 370], bridge: { x0: BRX0, len: M.bridgeLen }, dimY: 336 });
const mk = d => ({ m1: d.marker({ color: C.cyan, text: 'เริ่มจับเวลา', top: d.R - 176 }), m2: d.marker({ color: C.navy, text: 'หยุดเวลา', top: d.R - 176 }),
  fr: d.label({ size: 22, fill: '#fff', color: C.blue, stroke: C.blue }), tl: d.label({ size: 22, fill: '#fff', color: C.pink, stroke: C.pink }),
  a1: d.arrow({ y: d.R - 104, color: C.blue, label: 'ความยาวรถไฟ', size: 26 }), a2: d.arrow({ y: d.R - 104, color: '#0891B2', label: `สะพาน ${M.bridgeLen} ม.`, size: 26 }),
});
const P2 = mk(dP2), Q2 = mk(dB2);
const fA2 = fit(row(s2, 1024, `<div class="cardx" style="font-size:42px">ระยะทาง = <span class="hl">ความยาวรถไฟ</span></div>`));
const fB2 = fit(row(s2, 1130, `<div class="cardx cy" style="font-size:40px">ระยะทาง = ความยาวรถไฟ + <span class="hl">${M.bridgeLen} เมตร</span></div>`));
const fQ2 = fit(row(s2, 1250, `<div class="cardx dk col" style="font-size:40px"><div>แล้วเราจะหา</div><div><span class="hlb">ความยาวรถไฟ</span> ได้อย่างไร?</div></div>`));
const tA2 = 4.9, tB2 = 14.0;
const evP2 = u => TRAIN.event(u, { xStart: POLE, dist: L, tA: tA2 });
const evQ2 = u => TRAIN.event(u, { xStart: BRX0, dist: BRX1 - BRX0 + L, tA: tB2 });
{ const p = evP2(0), q = evQ2(0); sfx('horn', ST + .5, .45); clackRun(ST + .6, ST + p.tB, .42); sfx('pop', ST + b2.cruise2, .6); sfx('pop', ST + tA2, .8);
  for (let k = 1; k <= M.poleTime; k++) sfx('tick', ST + tA2 + k * (p.tB - tA2) / M.poleTime, .35);
  sfx('ding', ST + p.tB, .8); sfx('pop', ST + b2.poleD, .9); sfx('whoosh', ST + b2.bridge - .4, .5); clackRun(ST + b2.bridge - .2, ST + q.tB, .42); sfx('pop', ST + tB2, .8);
  for (let k = 1; k <= M.bridgeTime; k++) sfx('tick', ST + tB2 + k * (q.tB - tB2) / M.bridgeTime, .3);
  sfx('ding', ST + q.tB, .9); sfx('pop', ST + b2.bridgeD, .9); sfx('sparkle', ST + b2.bridgeD + .3, .5); sfx('riser', ST + b2.ask - .6, .4); sfx('pop', ST + b2.ask, .9); }
function demo(d, G, e, u, tA, { xEnd, ghostAt, arrowAt, segs = false, endText }) {
  const moving = !e.done;
  d.setTrain(e.front, { vib: moving ? Math.sin(u * 38) * .7 : 0, speed: moving ? .9 : 0 });
  d.setGhost(d.br ? d.br.x0 : d.pole, clamp((u - ghostAt) * 3) * .9);   // ghost = start position (front at the start point)
  const mo = 1 - P(u, arrowAt - .2, .3);
  G.m1.set(d.br ? d.br.x0 : d.pole, clamp((u - tA) * 5) * (u < e.tB ? 1 : mo));
  G.m2.set(xEnd, clamp((u - e.tB) * 5) * mo, endText);
  const chipO = clamp((u - tA + .6) * 3) * (1 - P(u, arrowAt + 3, .4));
  G.fr.set(e.front - 30, d.R + 34, 'หัว', chipO);
  G.tl.set(Math.max(e.front - L + 30, 262), d.R + 34, 'ท้าย', chipO);
  if (!segs) G.a1.set(e.front - L, e.front, E.out(P(u, arrowAt, .7)), clamp((u - arrowAt) * 4));
  else {
    G.a2.set(d.br.x0, d.br.x1, E.out(P(u, arrowAt, .6)), clamp((u - arrowAt) * 4));
    G.a1.set(d.br.x1, e.front, E.out(P(u, arrowAt + .55, .6)), clamp((u - arrowAt - .55) * 4));
  }
}
function drawStory(t) {
  const u = t - ST;
  const hs = [0, b2.pole, b2.bridge];
  h2.forEach((el, i) => show(el, u, hs[i] + (i ? 0 : .05), i < 2 ? hs[i + 1] - .05 : 1e9, { from: .6, dy: 20, out: .2 }));
  show(sp2, u, b2.cruise + .3, 1e9, { dy: 20 });
  const inBridge = u >= b2.bridge - .3, xf = E.inOut(P(u, b2.bridge - .3, .5));
  tf(dP2.el, { o: (u < b2.bridge - .3 ? 1 : 1 - xf) * clamp(u * 6 + 1), s: 1 - .03 * xf });
  const push = E.inOut(P(u, b2.ask, .8));
  tf(dB2.el, { o: xf, s: lerp(.97, 1, xf), y: -10 * push });
  const p = evP2(u);
  demo(dP2, P2, p, u, tA2, { xEnd: POLE, ghostAt: p.tB + .3, arrowAt: b2.poleD, endText: `ครบ ${M.poleTime} วินาที` });
  const q = evQ2(u);
  demo(dB2, Q2, q, u, tB2, { xEnd: BRX1, ghostAt: q.tB + .3, arrowAt: b2.bridgeD, segs: true, endText: `ครบ ${M.bridgeTime} วินาที` });
  dB2.sweep(P(u, tB2 + .3, 1.6));
  if (u >= b2.ask) { Q2.a1.set(BRX1, q.front, 1, 1, '? เมตร'); }
  // stopwatch follows whichever event is on screen
  if (!inBridge) sw2.set(p.story, M.poleTime, p.done); else sw2.set(u < tB2 ? 0 : q.story, M.bridgeTime, q.done);
  const swl = life(u, b2.cruise2, 1e9, { from: .3, dy: 20, el: true });
  tf(sw2.el, { ...swl, s: swl.s * (1 + .08 * Math.max(0, 1 - Math.abs(u - (inBridge ? q.tB : p.tB)) / .3)) });
  // formulas
  const fa = life(u, b2.poleD + .2, 1e9, { from: .6, dy: 30, d: .6 });
  tf(fA2, { ...fa, o: fa.o * (u > b2.bridgeD ? .55 : 1) });
  show(fB2, u, b2.bridgeD + .2, 1e9, { from: .6, dy: 30, d: .6 });
  show(fQ2, u, b2.ask + .1, 1e9, { from: .6, dy: 30, d: .6 });
}

// =====================================================================================
// SCENE 3 — CORE KNOWLEDGE: two rules, the classic mistake, the memory trick
// =====================================================================================
const s3 = $('s3'), b3 = B.know;
const h3 = hd(s3, 368, `<div class="in">${ic(IC.bulb(44))}หลักสำคัญ ต้องจำ!</div>`);
const dA3 = TRAIN.diagram(s3, { top: 466, h: 250, railY: 178, panel: [196, 0, 688, 250], pole: POLE, poleH: 110 });
const dB3 = TRAIN.diagram(s3, { top: 848, h: 262, railY: 176, panel: [196, 0, 688, 262], bridge: { x0: BRX0, len: M.bridgeLen }, bridgeDim: false });
const A3 = { a1: dA3.arrow({ y: dA3.R - 100, color: C.blue, label: 'ความยาวรถไฟ', size: 26 }), st: dA3.label({ size: 22, fill: '#fff', color: C.navy, stroke: C.navy }) };
const B3 = { a2: dB3.arrow({ y: dB3.R - 100, color: '#0891B2', label: `สะพาน ${M.bridgeLen} ม.`, size: 26 }), a1: dB3.arrow({ y: dB3.R - 100, color: C.blue, label: 'ความยาวรถไฟ', size: 26 }),
  wr: dB3.arrow({ y: dB3.R + 44, color: C.red, label: `คิดแค่ ${M.bridgeLen} ม.`, size: 24, dash: true }),
  tl: dB3.label({ size: 22, fill: '#fff', color: C.pink, stroke: C.pink }), ok: dB3.marker({ color: C.green, text: 'พ้นสะพานแล้ว', top: dB3.R - 150 }) };
const rA3 = fit(row(s3, 728, `<div class="cardx" style="font-size:42px">ผ่านเสาไฟ = <span class="hl">ความยาวรถไฟ</span></div>`));
const rB3 = fit(row(s3, 1122, `<div class="cardx cy col" style="font-size:40px"><div>ผ่านสะพาน =</div><div><span class="hl">ความยาวรถไฟ</span> + <span class="hl">ความยาวสะพาน</span></div></div>`));
const wr3 = fit(row(s3, 1276, `<div class="cardx rd" style="font-size:42px">${ic(IC.cross(44))}คิดแค่ ${M.bridgeLen} เมตร <span class="small r">(ผิด!)</span></div>`));
const st3 = add(s3, `<div class="stamp c" style="left:690px;top:1238px">${ICON.cross('#fff', 96)}</div>`);
const tk3 = fit(row(s3, 1270, `<div class="cardx dk" style="font-size:44px">${ic(IC.bulb(48))}<span><span class="hlb">ท้ายขบวน</span> ต้องพ้นสะพานด้วย!</span></div>`));
const rA = u => TRAIN.event(Math.max(u, b3.ruleA + .3), { xStart: POLE, dist: L, tA: b3.ruleA + .3 });
const rB = u => TRAIN.event(Math.max(u, b3.ruleB + .2), { xStart: BRX0, dist: BRX1 - BRX0 + L, tA: b3.ruleB + .2 });
{ const a = rA(0), b = rB(0); sfx('pop', KN + b3.intro, .8); sfx('sparkle', KN + b3.intro + .2, .4); sfx('pop', KN + b3.ruleA, .8); clackRun(KN + b3.ruleA + .3, KN + a.tB, .4, .35); sfx('pop', KN + b3.ruleA2, .9);
  sfx('pop', KN + b3.ruleB, .8); clackRun(KN + b3.ruleB + .2, KN + b.tB, .4, .35); sfx('ding', KN + b.tB, .6); sfx('pop', KN + b3.ruleB2, .8);
  sfx('drop', KN + b3.wrong, .6); sfx('stamp', KN + b3.wrongX + .1, 1.1); sfx('whoosh', KN + b3.trick - .2, .5); sfx('success', KN + b3.trick + .1, .7); }
function drawKnow(t) {
  const u = t - KN;
  show(h3, u, b3.intro, 1e9, { from: .6, dy: 20 });
  // rule A — pole
  tf(dA3.el, { ...life(u, b3.intro2, 1e9, { from: .85, dy: 30 }), o: life(u, b3.intro2, 1e9, { from: .85 }).o * (u > b3.trick ? .55 : 1) });
  const a = rA(u);
  dA3.setTrain(a.front, { vib: a.started && !a.done ? Math.sin(u * 38) * .7 : 0, speed: a.started && !a.done ? .9 : 0 });
  dA3.setGhost(POLE, clamp((u - a.tB - .1) * 3) * .9);
  A3.a1.set(POLE, a.front, E.out(P(u, Math.max(a.tB, b3.ruleA2), .6)), clamp((u - Math.max(a.tB, b3.ruleA2)) * 4));
  show(rA3, u, b3.ruleA2 + .1, 1e9, { from: .6, dy: 30, d: .6 });
  // rule B — bridge (arrow grows with the front: the distance covered keeps growing until the tail clears)
  tf(dB3.el, life(u, b3.ruleB - .2, 1e9, { from: .85, dy: 30 }));
  const b = rB(u), mv = b.started && !b.done;
  dB3.setTrain(b.front, { vib: mv ? Math.sin(u * 38) * .7 : 0, speed: mv ? .9 : 0 });
  dB3.setGhost(BRX0, clamp((u - b.tB - .1) * 3) * .9);
  const live = b.started;
  B3.a2.set(BRX0, Math.min(Math.max(b.front, BRX0 + 1), BRX1), 1, live ? 1 : 0, b.front >= BRX1 ? `สะพาน ${M.bridgeLen} ม.` : '');
  B3.a1.set(BRX1, Math.max(b.front, BRX1 + 1), 1, b.front > BRX1 + 4 ? 1 : 0, b.done ? 'ความยาวรถไฟ' : '');
  B3.tl.set(Math.max(b.front - L + 32, 292), dB3.R + 36, 'ท้ายขบวน', clamp((u - b3.ruleB) * 3) * (u > b3.wrong - .2 && u < b3.trick ? 0 : 1), 1 + .25 * Math.max(0, Math.sin((u - b3.trick) * 5)) * (u > b3.trick ? 1 : 0));
  show(rB3, u, b3.ruleB2, 1e9, { from: .6, dy: 30, d: .6 });
  // the classic mistake: only the bridge
  B3.wr.set(BRX0, BRX1, E.out(P(u, b3.wrong + .1, .5)), clamp((u - b3.wrong) * 4) * (1 - P(u, b3.trick - .2, .3)));
  show(wr3, u, b3.wrong, b3.trick - .15, { from: .4, dy: 30, out: .25 });
  tf(st3, { s: u < b3.wrongX ? 0 : lerp(2.2, 1, E.out(P(u, b3.wrongX, .3))), o: clamp((u - b3.wrongX) * 6) * (1 - P(u, b3.trick - .15, .25)), r: lerp(-20, -8, E.out(P(u, b3.wrongX, .3))) });
  // memory trick: the tail must clear the bridge
  show(tk3, u, b3.trick, 1e9, { from: .6, dy: 30, d: .6 });
  B3.ok.set(BRX1, clamp((u - b3.trick - .3) * 4));
}

// =====================================================================================
// SCENE 4 — FAST METHOD: compare times → extra 10 s ↔ 200 m → speed 20 m/s → one step left
// =====================================================================================
const s4 = $('s4'), b4 = B.expl;
const h4 = hd(s4, 368, `<div class="in">${ic(IC.timer(44, '#22D3EE'))}วิธีคิดลัด</div>`);
const PXS = 600 / M.bridgeTime, X0 = 236, W8 = M.poleTime * PXS, W10 = M.extraTime * PXS;
const bl1 = add(s4, `<div class="barlab c" data-safe="text" style="top:466px">${ic(IC.train(38))} ผ่านเสาไฟ</div>`);
const bl2 = add(s4, `<div class="barlab c" data-safe="text" style="top:604px">${ic(IC.train(38))} ผ่านสะพาน</div>`);
const barHTML = (top, left, w, bg, top2, main, cls = '') => `<div class="bar ${cls}" data-safe="bar" style="top:${top}px;left:${left}px;width:${w}px;background:${bg};flex-direction:column;line-height:1.15"><span class="b-sub" style="font-size:22px;font-weight:700;opacity:.92">${top2}</span><span class="b-main">${main}</span></div>`;
const bar1 = add(s4, barHTML(518, X0, W8, 'linear-gradient(180deg,#5B8CFF,#2F6BFF)', '', `${M.poleTime} วินาที`));
const bar2a = add(s4, barHTML(656, X0, W8, 'linear-gradient(180deg,#5B8CFF,#2F6BFF)', '', `${M.poleTime} วินาที`));
const bar2b = add(s4, barHTML(656, X0 + W8 + 6, W10 - 6, 'linear-gradient(180deg,#5FE3F5,#22D3EE)', '', `${M.extraTime} วินาที`, 'xb'));
[bar1, bar2a, bar2b].forEach(b => { b.style.height = '78px'; });
const f1 = fit(row(s4, 756, `<div class="cardx" style="font-size:46px">${M.bridgeTime} − ${M.poleTime} = <span class="hlb">${M.extraTime}</span> วินาที</div>`));
const f2 = fit(row(s4, 862, `<div class="cardx cy" style="font-size:40px">${M.extraTime} วินาที ${ic(IC.arrow(40, '#0891B2'))} วิ่งผ่านสะพาน <span class="hl">${M.bridgeLen} เมตร</span></div>`));
const f3 = fit(row(s4, 968, `<div class="cardx dk col" style="font-size:42px;padding:14px 34px 18px"><div><span class="f3a">ความเร็ว =</span> <span class="f3b">${M.bridgeLen} ÷ ${M.extraTime}</span></div><div class="f3c" style="font-size:58px">= <span class="hlb">${M.speed}</span> เมตร/วินาที</div></div>`));
const f4 = fit(row(s4, 1196, `<div class="cardx col" style="font-size:40px"><div class="g" style="display:flex;align-items:center;gap:10px">${ic(IC.check(42))}ความเร็วรู้แล้ว</div><div class="f4b">เหลือหา<span class="hl">ความยาวรถไฟ</span> <span class="hlb q4">?</span></div></div>`));
{ sfx('pop', EX + b4.intro, .8); sfx('pop', EX + b4.cmp, .7); sfx('whoosh', EX + b4.cmp + .2, .4); sfx('pop', EX + b4.cmp2, .7); sfx('whoosh', EX + b4.cmp2 + .3, .4); sfx('pop', EX + b4.sub, .9); sfx('ding', EX + b4.sub + .3, .5);
  sfx('pop', EX + b4.mean, .6); sfx('pop', EX + b4.eq, .9); sfx('sparkle', EX + b4.eq + .2, .4); sfx('pop', EX + b4.spd, .8); sfx('pop', EX + b4.div, .8); sfx('success', EX + b4.res, .8); sfx('sparkle', EX + b4.res + .3, .6); sfx('pop', EX + b4.left, .8); sfx('pop', EX + b4.left2, .7); }
function drawExpl(t) {
  const u = t - EX;
  show(h4, u, b4.intro, 1e9, { from: .6, dy: 20 });
  show(bl1, u, b4.cmp, 1e9, { dy: 20 }); show(bl2, u, b4.cmp2, 1e9, { dy: 20 });
  const g1 = E.out(P(u, b4.cmp + .2, .7)), g2 = E.out(P(u, b4.cmp2 + .2, .6)), g3 = E.out(P(u, b4.cmp2 + .7, .7));
  tf(bar1, { sx: g1, sy: 1, o: clamp(g1 * 4) });
  tf(bar2a, { sx: g2, sy: 1, o: clamp(g2 * 4) });
  const hot = u > b4.sub;
  tf(bar2b, { sx: g3, sy: 1, o: clamp(g3 * 4), s: 1 });
  bar2b.style.background = hot ? 'linear-gradient(180deg,#FFE27A,#FFD23F)' : 'linear-gradient(180deg,#5FE3F5,#22D3EE)';
  bar2b.style.color = hot ? '#142B53' : '#fff';
  bar2b.style.boxShadow = hot ? `0 0 0 5px #fff,0 0 ${24 + 8 * Math.sin(u * 4)}px rgba(255,210,63,.8)` : '';
  const sub = u > b4.mean;   // captions: what each slice of time pays for
  bar1.querySelector('.b-sub').textContent = sub ? 'ความยาวรถไฟ' : ''; bar2a.querySelector('.b-sub').textContent = sub ? 'ความยาวรถไฟ' : ''; bar2b.querySelector('.b-sub').textContent = sub ? `สะพาน ${M.bridgeLen} ม.` : '';
  bar2b.querySelector('.b-main').textContent = hot ? `เพิ่ม ${M.extraTime} วินาที` : `${M.extraTime} วินาที`;
  show(f1, u, b4.sub, 1e9, { from: .6, dy: 30, d: .6 });
  show(f2, u, b4.eq, 1e9, { from: .6, dy: 30, d: .6 });
  show(f3, u, b4.spd, 1e9, { from: .5, dy: 30 });
  tf(f3.querySelector('.f3b'), { o: clamp((u - b4.div) * 4), s: lerp(.6, 1, E.back(P(u, b4.div, .45))) });
  const r = life(u, b4.res, 1e9, { from: .3, dy: 20, el: true, d: .9 });
  tf(f3.querySelector('.f3c'), { ...r, s: r.s * (1 + .03 * Math.sin(u * 4) * (u > b4.res + 1 ? 1 : 0)) });
  show(f4, u, b4.left, 1e9, { from: .6, dy: 30, d: .6 });
  tf(f4.querySelector('.f4b'), { o: clamp((u - b4.left2) * 4), y: (1 - E.out(P(u, b4.left2, .4))) * 20 });
  tf(f4.querySelector('.q4'), { s: 1 + .18 * Math.max(0, Math.sin((u - b4.left3) * 5)) * (u > b4.left3 ? 1 : 0) });
}

// =====================================================================================
// SCENE 5 — QUIZ → exact 5 s countdown → ANSWER (reveal only after the countdown)
// =====================================================================================
const s5 = $('s5'), b5 = B.quiz, b6 = B.ans;
const h5 = fit(hd(s5, 368, `<div class="in"><span class="dot">?</span><span class="h5t">เตรียมสอบนายสิบ • วิชาคณิตศาสตร์</span></div>`), 600);
const QL = ['รถไฟขบวนหนึ่ง วิ่งด้วยความเร็วคงที่', `ผ่านเสาไฟใช้เวลา ${M.poleTime} วินาที`, `และผ่านสะพานยาว ${M.bridgeLen} เมตร`, `ใช้เวลา ${M.bridgeTime} วินาที`, 'รถไฟขบวนนี้มีความยาวเท่าใด?'];
const qb5 = add(s5, `<div class="qbox c" data-safe="text" style="top:466px">${QL.map((s, i) => `<span class="ql ql${i}">${s}</span>`).join('')}</div>`);
const qLines = [...qb5.querySelectorAll('.ql')];
const OPTS = M.options.map(([b, v]) => [b, `${v} เมตร`]);
const qOpts = NSP.buildQuizOptions($('s5'), OPTS, { top: 812, gap: 0 });
qOpts.forEach((o, i) => { o.el.style.left = (i % 2 ? 546 : 236) + 'px'; o.el.style.top = (i < 2 ? 812 : 926) + 'px'; o.el.setAttribute('data-safe', 'option'); });
const hn5 = fit(row(s5, 1048, `<div class="chipb dk" style="font-size:32px">${ic(IC.bulb(38))}รู้ความเร็วแล้ว อย่าลืมหา<span style="color:#FFD23F">ความยาวรถไฟ</span></div>`));
const cue5 = row(s5, 1140, `<div class="chipb cy" style="font-size:34px">${ic(IC.timer(38))}ให้เวลาคิด 5 วินาที</div>`);
const cdEl = add(s5, `<div class="abs c" data-safe="countdown" style="left:420px;top:1144px"></div>`);
const qCd = NSP.buildCountdown(cdEl, 240);
qCd.el.querySelectorAll('stop')[0].setAttribute('stop-color', '#22D3EE'); qCd.el.querySelectorAll('stop')[1].setAttribute('stop-color', '#2F6BFF');
qCd.el.querySelectorAll('circle')[1].setAttribute('stroke', '#DCEBFF'); qCd.dot.setAttribute('stroke', '#2F6BFF'); qCd.num.style.color = '#142B53';
const mas5 = add(s5, `<div class="mas" style="left:14px;top:1150px"><img src="${NSP.BASE}brand/mascot_presenter.png" style="height:430px"></div>`);
const masP = add(s5, `<div class="mas" style="left:8px;top:1190px"><img src="${NSP.BASE}brand/mascot_pose.png" style="height:430px"></div>`);
const conf5 = NSP.buildConfetti(s5, 60, 540, 700);
// answer pages
const r1 = fit(row(s5, 712, `<div class="cardx" style="font-size:44px">${M.bridgeTime} − ${M.poleTime} = <span class="hlb">${M.extraTime}</span> วินาที</div>`));
const r2 = fit(row(s5, 816, `<div class="cardx cy" style="font-size:44px">${M.bridgeLen} ÷ ${M.extraTime} = <span class="hlb">${M.speed}</span> เมตร/วินาที</div>`));
const r3 = fit(row(s5, 932, `<div class="cardx" style="font-size:40px">ระยะทาง = ความเร็ว × เวลา</div>`));
const r4 = fit(row(s5, 1040, `<div class="cardx dk col" style="font-size:66px;padding:12px 40px 18px"><div>${M.speed} × ${M.poleTime} = <span class="hlb">${M.trainLen}</span></div><div class="r4b" style="font-size:36px">ความยาวรถไฟ = <span style="color:#FFD23F">${M.trainLen} เมตร</span></div></div>`));
const r5 = fit(row(s5, 1262, `<div class="chipb" style="font-size:30px">${ic(IC.bulb(36))}ผ่านเสาไฟ ${M.poleTime} วินาที = เวลาวิ่งเท่าความยาวรถไฟ</div>`));
const dP5 = TRAIN.diagram(s5, { top: 712, h: 270, railY: 196, panel: [196, 0, 688, 270], pole: POLE, poleH: 120 });
const dB5 = TRAIN.diagram(s5, { top: 712, h: 270, railY: 182, panel: [196, 0, 688, 270], bridge: { x0: BRX0, len: M.bridgeLen }, bridgeDim: false });
const P5 = { a: dP5.arrow({ y: dP5.R - 100, color: C.green, label: `ความยาวรถไฟ = ${M.trainLen} เมตร`, labelColor: '#15803D', size: 26 }) };
const B5 = { a2: dB5.arrow({ y: dB5.R - 100, color: '#0891B2', label: `${M.bridgeLen} ม.`, size: 26 }), a1: dB5.arrow({ y: dB5.R - 100, color: C.green, label: `${M.trainLen} ม.`, labelColor: '#15803D', size: 26 }),
  tot: dB5.arrow({ y: dB5.R + 50, color: C.navy, label: `รวม ${M.bridgeDist} เมตร`, labelFill: C.yellow, labelColor: C.navy, size: 26 }) };
const c1 = fit(row(s5, 1004, `<div class="cardx" style="font-size:44px">${M.trainLen} + ${M.bridgeLen} = <span class="hlb">${M.bridgeDist}</span> เมตร</div>`));
const c2 = fit(row(s5, 1110, `<div class="cardx cy" style="font-size:44px">${M.bridgeDist} ÷ ${M.speed} = <span class="hlb">${M.checkTime}</span> วินาที</div>`));
const c3 = fit(row(s5, 1222, `<div class="cardx gn" style="font-size:42px">${ic(IC.check(46))}ตรงกับโจทย์ ${M.bridgeTime} วินาที!</div>`));
const sT = row(s5, 712, `<div class="chipb dk" style="font-size:36px">${ic(IC.bulb(40))}สรุปจำง่าย</div>`);
const sA = fit(row(s5, 800, `<div class="cardx" style="font-size:42px">ผ่านเสาไฟ = <span class="hl">ความยาวรถไฟ</span></div>`));
const sB = fit(row(s5, 906, `<div class="cardx cy" style="font-size:42px">ผ่านสะพาน = <span class="hl">ความยาวรถไฟ + สะพาน</span></div>`));
const sC = fit(row(s5, 1020, `<div class="cardx dk col" style="font-size:40px;padding:14px 34px 18px"><div>${M.bridgeLen} ÷ (${M.bridgeTime} − ${M.poleTime}) = ${M.speed} เมตร/วินาที</div><div style="font-size:52px">${M.speed} × ${M.poleTime} = <span class="hlb">${M.trainLen} เมตร</span></div></div>`));
const REV = AN + b6.reveal;            // visual reveal: on "ข้อ ค" — strictly after the countdown ends
mark('reveal', REV);
const QOPT_AT = b5.opt.map(a => a + .1);
{ sfx('whoosh', QZ, .5); sfx('pop', QZ + b5.hdr, 1); sfx('pop', QZ + b5.q[0] - .1, .7); b5.q.slice(1).forEach(a => sfx('click', QZ + a, .25));
  QOPT_AT.forEach(a => sfx('pop', QZ + a, .8)); sfx('pop', QZ + b5.hint, .8); sfx('pop', QZ + b5.cue, .8);
  for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', CD + i, 1);
  sfx('ding', AN + b6.timeUp, .5); sfx('ding', REV, 1); sfx('success', REV + .05, 1); sfx('sparkle', REV + .3, .7);
  sfx('whoosh', AN + b6.re - .1, .5); [b6.sub, b6.div, b6.dist, b6.mul].forEach(a => sfx('pop', AN + a, .85)); sfx('success', AN + b6.mul2, .6);
  sfx('whoosh', AN + b6.vis - .2, .5); clackRun(AN + b6.vis + .2, AN + b6.vis + .2 + L / V, .4, .35); sfx('pop', AN + b6.vis2, .7);
  sfx('whoosh', AN + b6.chk - .2, .4); sfx('pop', AN + b6.chk + .4, .85); sfx('pop', AN + b6.chk2, .85); sfx('success', AN + b6.chk3, .8);
  sfx('whoosh', AN + b6.sum - .2, .5); sfx('pop', AN + b6.sum, .7); sfx('pop', AN + b6.sumA, .8); sfx('pop', AN + b6.sumB, .8); sfx('sparkle', AN + b6.sumC, .7); }
const pageO = (ua, a, b) => clamp((ua - a) * 4) * (1 - P(ua, b - .25, .25));
function drawQuiz(t) {
  const u = t - QZ, uc = t - CD, ua = t - AN, rv = t - REV, revealed = rv >= 0;
  // header
  const hl = life(u, b5.hdr, 1e9, { from: .6, dy: 20 });
  tf(h5, { ...hl, s: hl.s * (1 + .08 * Math.max(0, 1 - Math.abs(ua - .1) / .3) + .04 * Math.max(0, 1 - Math.abs(rv - .1) / .3)) });
  h5.querySelector('.h5t').textContent = revealed ? `เฉลย! ข้อ ${M.correctLetter}. ${M.trainLen} เมตร` : ua >= 0 ? 'หมดเวลา!' : 'เตรียมสอบนายสิบ • วิชาคณิตศาสตร์';
  h5.querySelector('.in').style.background = revealed ? 'linear-gradient(90deg,#15803D,#22C55E)' : '';
  // question (fades when the answer explanation starts)
  const out = ua >= 0 ? E.inOut(P(ua, b6.re, .6)) : 0;
  const qc = life(u, b5.q[0] - .3, 1e9, { from: .6, dy: 50 });
  tf(qb5, { ...qc, o: qc.o * (1 - out), s: qc.s * (1 - .08 * out), y: qc.y - 40 * out });
  qLines.forEach((l, i) => { const a = b5.q[i], b = i < 4 ? b5.q[i + 1] : b5.opt[0] - .4, on = u >= a && u < b + .1;
    l.style.background = on ? `linear-gradient(90deg,rgba(149,191,239,.55) ${P(u, a, Math.max(.6, b - a - .2)) * 100}%,rgba(230,244,255,.6) 0)` : 'transparent';
    l.style.color = u < a ? '#8DA0BC' : ''; });
  // options: neutral until the answer narration says "ข้อ ค" (after the countdown)
  NSP.drawQuizOptions(qOpts, u, rv, QOPT_AT, M.correctIndex, { shiftY: -342 * out });
  qOpts.forEach((o, i) => { if (u < QOPT_AT[i] + .6) { const l = life(u, QOPT_AT[i], 1e9, { from: .6, dy: 0, d: .5 }); tf(o.el, { ...l, y: -342 * out }); } });
  show(hn5, u, b5.hint, AN + b6.re - QZ - .1, { from: .4, dy: 20, out: .25 });
  show(cue5, u, b5.cue, CD - QZ - .05, { from: .4, dy: 20, out: .2 });
  NSP.drawCountdown(qCd, uc, T.cd[1]);
  // presenter while the viewer thinks; celebration pose after the reveal
  const mi = life(u, b5.hint - .2, AN + b6.re - QZ, { from: .7, dy: 60, out: .3 });
  tf(mas5, { ...mi, y: mi.y + bob(u, 0, 5), o: mi.o * (revealed ? 0 : 1) });
  const mp = life(rv, .1, b6.re - b6.reveal, { from: .5, dy: 80, el: true, out: .3 });
  tf(masP, { ...mp, y: mp.y + bob(u, 1, 6) - 30 * Math.max(0, Math.sin(rv * 6)) * (1 - P(rv, 0, 2)) });
  NSP.drawConfetti(conf5, t, REV + .05, 2.6);
  // page 1: rebuild speed, then distance = speed × time
  const p1 = pageO(ua, b6.re, b6.vis);
  const R = (el, a, o = {}) => { const l = life(ua, a, 1e9, { from: .6, dy: 30, d: .6, ...o }); tf(el, { ...l, o: l.o * p1 }); };
  R(r1, b6.sub); R(r2, b6.div); R(r3, b6.dist); R(r4, b6.mul); R(r5, b6.mul2 + .6);
  tf(r4.querySelector('.r4b'), { o: clamp((ua - b6.mul2) * 4), s: lerp(.7, 1, E.back(P(ua, b6.mul2, .45))) });
  // page 2: the picture — pole (train length) then reverse-check on the bridge
  const p2 = pageO(ua, b6.vis, b6.sum), toB = E.inOut(P(ua, b6.chk - .2, .5));
  tf(dP5.el, { o: p2 * (1 - toB), s: lerp(.92, 1, E.out(P(ua, b6.vis, .5))) });
  const pv = TRAIN.event(Math.max(ua, b6.vis + .2), { xStart: POLE, dist: L, tA: b6.vis + .2 });
  dP5.setTrain(pv.front, { vib: pv.started && !pv.done ? Math.sin(ua * 38) * .7 : 0, speed: pv.started && !pv.done ? .9 : 0 });
  dP5.setGhost(POLE, clamp((ua - pv.tB) * 3) * .9);
  P5.a.set(POLE, pv.front, E.out(P(ua, Math.max(pv.tB, b6.vis2), .6)), clamp((ua - Math.max(pv.tB, b6.vis2)) * 4));
  tf(dB5.el, { o: p2 * toB, s: lerp(.95, 1, toB) });
  dB5.setTrain(BRX1 + L); dB5.setGhost(BRX0, .9);
  B5.a2.set(BRX0, BRX1, E.out(P(ua, b6.chk + .1, .5)), clamp((ua - b6.chk - .1) * 4));
  B5.a1.set(BRX1, BRX1 + L, E.out(P(ua, b6.chk + .5, .5)), clamp((ua - b6.chk - .5) * 4));
  B5.tot.set(BRX0, BRX1 + L, E.out(P(ua, b6.chk + 1.0, .6)), clamp((ua - b6.chk - 1.0) * 4));
  const R2 = (el, a) => { const l = life(ua, a, 1e9, { from: .6, dy: 30, d: .6 }); tf(el, { ...l, o: l.o * p2 }); };
  R2(c1, b6.chk + .4); R2(c2, b6.chk2); R2(c3, b6.chk3);
  // page 3: summary
  const p3 = clamp((ua - b6.sum) * 4);
  const R3 = (el, a) => { const l = life(ua, a, 1e9, { from: .6, dy: 30, d: .6 }); tf(el, { ...l, o: l.o * p3 }); };
  R3(sT, b6.sum); R3(sA, b6.sumA); R3(sB, b6.sumB); R3(sC, b6.sumC);
}

// =====================================================================================
// SCENE 6 — NAISIBPRO ENDING (blue promo: comment prompt → brand → update line → like/share/follow)
// =====================================================================================
const s6 = $('s6'), b7 = B.promo;
const p1 = fit(row(s6, 470, `<div class="big" style="font-size:62px">คุณตอบถูก<span class="hlb" style="background:#22C55E;color:#fff;box-shadow:0 4px 0 #15803D;text-shadow:none">ข้อ ${M.correctLetter}.</span> ไหม?</div>`));
const p2 = fit(row(s6, 612, `<div class="chipb" style="font-size:34px">${ic(IC.train(40))}ถ้าชอบโจทย์คณิตแนวสอบตำรวจ</div>`));
const p3 = fit(row(s6, 712, `<div class="cardx dk" style="font-size:46px">${ic(IC.comment(52))}คอมเมนต์มาบอกกัน!</div>`));
const BUBS = [['ตอบ ค. ถูกแล้ว!', 250, 870], ['เข้าใจแล้ว ต้องบวกสะพานด้วย', 300, 980], ['ขอโจทย์แบบนี้อีก!', 420, 1090]].map(([s, x, y]) =>
  ({ el: add(s6, `<div class="bub c" data-safe="text" style="left:${x}px;top:${y}px">${ic(IC.comment(34, '#2F6BFF'))}${s}</div>`), x }));
const lg6 = add(s6, `<div class="abs c" data-safe="logo" style="left:370px;top:420px;width:340px"><img src="${NSP.BASE}brand/logo.png" style="width:340px;display:block;filter:drop-shadow(0 16px 22px rgba(20,43,83,.25))"></div>`);
const wm6 = row(s6, 784, `<div class="big" style="font-size:104px;color:#2F6BFF;letter-spacing:1px">Nai<span style="color:#142B53">Sib</span><span style="color:#0891B2">Pro</span></div>`);
const u61 = fit(row(s6, 934, `<div class="chipb cy" style="font-size:36px">${ic(IC.check(38, '#142B53'))}รวมข้อสอบมากกว่าหมื่นข้อ</div>`));
const u62 = fit(row(s6, 1020, `<div class="chipb" style="font-size:36px">${ic(IC.timer(38, '#2F6BFF'))}อัปเดตทุกสัปดาห์</div>`));
const ctaRow = row(s6, 1130, `<div class="cta k0">${ic(IC.like(36))}ไลก์</div><div class="cta k1">${ic(IC.share(36))}แชร์</div><div class="cta k2">${ic(IC.bell(36))}ติดตาม</div>`, 'gap:12px');
const ctas = [0, 1, 2].map(i => ctaRow.querySelector('.k' + i));
const fin6 = fit(row(s6, 1250, `<div class="big" style="font-size:46px">กดไลก์ กดแชร์ และ<span class="hl">กดติดตาม</span>ไว้!</div>`));
const hand6 = add(s6, `<div class="abs" style="left:0;top:0;width:100px;height:100px">${ICON.hand(100)}</div>`);
const mas6 = add(s6, `<div class="mas" style="left:850px;top:1210px"><img src="${NSP.BASE}brand/mascot_pose.png" style="height:420px"></div>`);
const conf6 = NSP.buildConfetti(s6, 60, 540, 600);
const CTA_AT = [b7.cta + .1, b7.cta + .8, b7.cta + 1.5];
mark('endcard', PR + b7.cta);
{ sfx('whoosh', PR, .5); sfx('pop', PR + b7.q, .9); sfx('pop', PR + b7.like, .7); sfx('pop', PR + b7.cmt, .9); [0, 1, 2].forEach(i => sfx('msg', PR + b7.cmt + .5 + i * .55, .8));
  sfx('whoosh', PR + b7.brand - .2, .6); sfx('sparkle', PR + b7.brand + .2, .8); sfx('ding', PR + b7.brand + .3, .6); sfx('pop', PR + b7.brand + .8, .8); sfx('pop', PR + b7.upd, .8);
  CTA_AT.forEach(a => { sfx('pop', PR + a, .7); sfx('click', PR + a + .45, .9); }); sfx('success', PR + b7.cta2, .6); }
function drawPromo(t) {
  const u = t - PR, end1 = b7.brand - .15;
  const a = life(u, b7.q, end1, { from: .6, dy: 40, d: .6, out: .3 });
  tf(p1, { ...a, s: a.s * (1 + .02 * Math.sin(u * 4)) });
  show(p2, u, b7.like, end1, { out: .3 }); show(p3, u, b7.cmt, end1, { from: .6, d: .6, out: .3 });
  BUBS.forEach((bb, i) => { const l = life(u, b7.cmt + .5 + i * .55, end1, { from: .4, dy: 30, out: .3 }); tf(bb.el, { ...l, x: (1 - E.out(P(u, b7.cmt + .5 + i * .55, .5))) * (i % 2 ? 30 : -30), y: l.y + bob(u, i, 5) }); });
  const lg = life(u, b7.brand, 1e9, { from: .2, dy: 120, el: true, d: 1.0 });
  tf(lg6, { ...lg, y: lg.y + bob(u, 0, 6), r: Math.sin(u * 1.8) * 2 });
  show(wm6, u, b7.brand + .35, 1e9, { from: .5, dy: 40 });
  show(u61, u, b7.brand + .8, 1e9, { from: .6, dy: 30 }); show(u62, u, b7.upd, 1e9, { from: .6, dy: 30 });
  tf(ctaRow, { o: clamp((u - b7.cta) * 4) });
  ctas.forEach((c, i) => { const l = life(u, CTA_AT[i], 1e9, { from: .3, dy: 20, el: true }); tf(c, { ...l, s: l.s * (1 - .12 * NSP.pressDepth(u, [CTA_AT[i] + .45])) });
    c.style.background = u > CTA_AT[i] + .5 ? 'linear-gradient(90deg,#0891B2,#22D3EE)' : ''; });
  show(fin6, u, b7.cta2, 1e9, { from: .6, dy: 30, d: .6 });
  // hand cursor taps the three buttons
  let hx = 900, hy = 1500, ho = 0;
  for (let i = 0; i < 3; i++) if (u > CTA_AT[i] - .1 && u < CTA_AT[i] + .75) { const r = ctas[i].getBoundingClientRect(); const k = E.inOut(P(u, CTA_AT[i] - .1, .45)); hx = lerp(i ? ctas[i - 1].getBoundingClientRect().left + 40 : 900, r.left + r.width / 2 - 20, k); hy = lerp(i ? 1180 : 1500, 1170, k); ho = 1; }
  hand6.style.transform = `translate(${hx}px,${hy}px) scale(${1 - .15 * NSP.pressDepth(u, CTA_AT.map(a => a + .45))})`; hand6.style.opacity = ho;
  const ms = life(u, b7.brand + .5, 1e9, { from: .5, dy: 80, el: true });
  tf(mas6, { ...ms, y: ms.y + bob(u, 2, 6) });
  NSP.drawConfetti(conf6, t, PR + b7.cta2 + .2, 2.6);
}

// =====================================================================================
const W = [ST, KN, EX, QZ, PR];
NSP.start({
  ep: 'EP.41 • คณิตศาสตร์',
  brand: { showAt: 1.2, hideAt: PR },
  wipes: W,
  scenes: [
    { el: $('s1'), a: 0, b: ST, draw: drawHook },
    { el: $('s2'), a: ST, b: KN, draw: drawStory },
    { el: $('s3'), a: KN, b: EX, draw: drawKnow },
    { el: $('s4'), a: EX, b: QZ, draw: drawExpl },
    { el: $('s5'), a: QZ, b: PR, draw: drawQuiz },
    { el: $('s6'), a: PR, b: 1e9, draw: drawPromo },
  ],
});
// fit wide single-line items to the safe width once the fonts are loaded (measured with every scene laid out)
window.ready = window.ready.then(() => {
  const sc = [...document.querySelectorAll('.scene')], prev = sc.map(s => s.style.display);
  sc.forEach(s => { s.style.display = 'block'; });
  FITS.forEach(([el, max]) => { const t = el.firstElementChild || el; t.style.zoom = ''; const w = t.offsetWidth; if (w > max) t.style.zoom = (max / w).toFixed(4); });
  sc.forEach((s, i) => { s.style.display = prev[i]; });
  window.renderAt(0); return true;
});
