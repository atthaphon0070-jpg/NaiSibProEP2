// NaiSibPro EP.31 — The Clock Angle Trap (03:15 = 7.5°). Deterministic renderAt(t) scenes.
// Every factual clock is driven by ck.setTime(T) (T = minutes since 00:00), so the hour and minute
// hands always agree with the displayed time. Time-lapses ease the TIME value, never the hand angles.
const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark } = NSP;
const { MATH } = CLOCK;
const T = window.TL, S = k => T[k][0], D = k => T[k][1], B = window.BEATS;
const H0 = S('hook'), ST0 = S('story'), K0 = S('know'), X0 = S('expl'), QS = S('quiz'), CD = S('cd'), AN = S('ans'), PR = S('promo');
const T0300 = MATH.T(3, 0), T0315 = MATH.T(3, 15), T0400 = MATH.T(4, 0);

const show = (el, u, a, b = 1e9, o = {}) => tf(el, life(u, a, b, { from: .5, dy: 40, d: .5, out: .3, ...o }));
const hide = (...els) => els.forEach(e => tf(e, { o: 0 }));
const lapse = (u, a, d, A, Bv, ease = E.inOut) => lerp(A, Bv, ease(P(u, a, d)));
const pulse = (u, f = 5) => .55 + .45 * Math.sin(u * f);
function mount(parent, ck, cx, cy) {
  (typeof parent === 'string' ? $(parent) : parent).appendChild(ck.el);
  ck.el.classList.add('c'); ck.el.dataset.ess = 'clock';
  ck.el.style.left = cx - ck.size / 2 + 'px'; ck.el.style.top = cy - ck.size / 2 + 'px';
  ck.cx = cx; ck.cy = cy;
  return ck;
}
// screen point of a clock-local polar coordinate (angle deg, radius 0..100) for an unscaled clock
const cpt = (ck, a, r) => { const [x, y] = CLOCK.pt(a, r * ck.size / 200); return [ck.cx + x, ck.cy + y]; };
const ALL_CLOCKS = [];
const clock = (o) => { const c = CLOCK.create(o); ALL_CLOCKS.push(c); return c; };
window.EP31 = { ALL_CLOCKS };

// ======================================================================
// SCENE 1 — HOOK: the clock angle trap
// ======================================================================
const hb = B.hook;
const hClock = mount('h-cam', clock({ size: 480, label: 'hook' }), 540, 800);
const imClock = clock({ size: 334, label: 'hook-imagined-wrong' });
$('h-imClock').appendChild(imClock.el);
imClock.setAngles(90, 90);           // the student's WRONG mental model: both hands exactly on 3
imClock.emph({ hour: 1, minute: 1 });
$('h-warnI').innerHTML = `<svg width="44" height="44" viewBox="0 0 24 24"><path d="M12 3L2 21h20z" fill="#fff"/><path d="M12 10v5M12 18v.5" stroke="#EF4444" stroke-width="2.6" stroke-linecap="round"/></svg>`;
$('h-imX').innerHTML = ICON.cross('#fff', 34);
sfx('tick', hb.time + .05, .5); sfx('rewind', hb.time + .3, .5);
for (let i = 0; i < 8; i++) sfx('tick', hb.time + .3 + i * .26, .35);
sfx('pop', hb.sub, .5); sfx('drop', hb.warn, .6); sfx('ding', hb.long + .1, .45);
sfx('whoosh', hb.assume, .6); sfx('pop', hb.assume + 1.0, .7); sfx('stamp', hb.wrong, .9);
sfx('freeze', hb.because, .8); sfx('whoosh', hb.zoom, .8); sfx('sparkle', hb.zoom + 1.2, .7); sfx('pop', hb.hold, .5);

function drawHook(t) {
  $('s1').style.transform = 'none';
  const u = t - H0;
  // keyword: fully visible from frame 0
  tf($('h-kw').firstElementChild, { s: 1 + .025 * Math.sin(u * 3.2) });
  show($('h-sub'), u, hb.sub, hb.zoom, { from: .6, dy: 20 });
  // time-lapse 02:45 -> 03:15 ; both hands from the same time value
  const Tm = u < hb.time ? MATH.T(2, 45) : lapse(u, hb.time + .1, 2.1, MATH.T(2, 45), T0315);
  hClock.setTime(Tm);
  $('h-digT').textContent = MATH.label(Tm);
  const dig = life(u, hb.time, hb.assume, { from: .5, dy: 30 });
  const dig2 = life(u, hb.because + .2, hb.zoom, { from: .5, dy: 30 });
  tf($('h-dig'), u < hb.because ? dig : dig2);
  show($('h-warn'), u, hb.warn, hb.time + 2.2, { el: true, d: .8 });
  show($('h-long'), u, hb.long, hb.assume - .2);
  // emphasis
  const longOn = u > hb.long && u < hb.assume;
  const zoomOn = u > hb.because;
  hClock.emph({ hour: longOn ? .45 : 1, minute: 1, minuteGlow: longOn ? pulse(u, 6) : 0, hourGlow: zoomOn ? pulse(u, 5) : 0, halo: u < hb.assume ? .5 + .3 * Math.sin(u * 2) : 0 });
  hClock.numeral(3, longOn ? '#2F6BFF' : zoomOn ? '#D9568A' : '#31445D', longOn || zoomOn ? 1.25 : 1);
  hClock.ref(90, zoomOn ? clamp((u - hb.zoom - .6) / .4) : 0);
  // imagined (wrong) model card
  const dimReal = u > hb.assume && u < hb.because + .2 ? .2 : 1;
  tf(hClock.el, { o: dimReal + (1 - dimReal) * 0 });
  const im = life(u, hb.assume, hb.because, { from: .4, dy: 80, d: .6, out: .35 });
  tf($('h-imag'), { ...im, r: u > hb.because ? -8 * P(u, hb.because, .3) : 0 });
  show($('h-zero'), u, hb.assume + 1.0, 1e9, { from: .2, el: true, d: .8, dy: 0 });
  tf($('h-stamp'), { ...life(u, hb.wrong, 1e9, { from: 2.4, dy: 0, d: .35 }), r: -12 });
  // surprise: flash + camera push toward number 3
  $('flash1').style.opacity = .85 * (1 - P(u, hb.because, .35)) * (u >= hb.because ? 1 : 0);
  const k = E.inOut(P(u, hb.zoom, 1.3)), s = lerp(1, 1.75, k);
  $('h-cam').style.transform = `translate(${-150 * s * k}px,${70 * k}px) scale(${s})`;
  hClock.el.dataset.zoom = k > .02 ? '1' : '';
  tf($('h-clockGlow'), { o: 1 - k * .6 });
  show($('h-moved'), u, hb.zoom + .5, 1e9, { el: true, d: .8 });
  show($('h-q'), u, hb.hold, 1e9, { from: .2, el: true, d: .8, dy: 0 });
  if (u > hb.hold + .8) tf($('h-q'), { s: 1 + .06 * Math.sin(u * 5), r: 8 * Math.sin(u * 2.5) });
}

// ======================================================================
// SCENE 2 — EXAM ROOM STORY
// ======================================================================
const sb = B.story;
$('r-room').innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920">
  <defs><linearGradient id="rw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DDE9FC"/><stop offset="1" stop-color="#F4EEFA"/></linearGradient>
  <linearGradient id="rf" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9D8EE"/><stop offset="1" stop-color="#B3C6E2"/></linearGradient>
  <linearGradient id="rd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E8C9A0"/><stop offset="1" stop-color="#C99D6C"/></linearGradient></defs>
  <rect width="1080" height="1920" fill="url(#rw)"/>
  <rect y="1040" width="1080" height="880" fill="url(#rf)"/>
  <rect y="1030" width="1080" height="14" fill="#fff" opacity=".7"/>
  <g opacity=".9"><rect x="40" y="430" width="150" height="330" rx="16" fill="#fff"/><rect x="52" y="442" width="126" height="306" rx="10" fill="#BFE3FA"/><path d="M115 442v306M52 595h126" stroke="#fff" stroke-width="8"/></g>
  <g><rect x="470" y="470" width="400" height="300" rx="20" fill="#142B53"/><rect x="484" y="484" width="372" height="272" rx="12" fill="#FFFFFF"/>
    <text x="670" y="560" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="38" fill="#142B53">สอบนายสิบตำรวจ</text>
    <text x="670" y="615" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="30" fill="#EE7FAA">วิชาคณิตศาสตร์</text>
    <path d="M540 660h260M560 700h220" stroke="#C9D6EA" stroke-width="10" stroke-linecap="round"/></g>
  ${[0, 1, 2, 3].map(i => { const x = 70 + i * 260; return `<g opacity=".75"><circle cx="${x + 70}" cy="975" r="34" fill="#3E4A66"/><rect x="${x + 28}" y="1005" width="84" height="80" rx="34" fill="${['#A9D1F5', '#F7B9D1', '#9FDCC0', '#C7B7EE'][i]}"/><rect x="${x}" y="1060" width="200" height="26" rx="8" fill="#D9B98F"/><rect x="${x + 10}" y="1086" width="180" height="70" fill="#C9A577"/></g>`; }).join('')}
</svg>`;
const wallClock = mount('r-wallClock', clock({ size: 170, label: 'story-wall' }), 300, 610);
wallClock.setTime(T0315); delete wallClock.el.dataset.ess;   // set dressing, not essential
const student = STORY.character('A');
const stuWrap = h('<div style="position:absolute;left:0;top:0;transform-origin:0 0"></div>');
stuWrap.appendChild(student); $('r-actor').appendChild(stuWrap);
stuWrap.style.transform = 'translate(400px,1720px) scale(1.25)';
$('r-desk').innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">
  <path d="M-20 1400 L1100 1400 L1100 1460 L-20 1460Z" fill="#E8C9A0"/><path d="M-20 1398h1120" stroke="#F6E2C6" stroke-width="8"/>
  <rect x="-20" y="1460" width="1120" height="600" fill="url(#rd2)"/>
  <defs><linearGradient id="rd2" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C99D6C"/><stop offset="1" stop-color="#A97E50"/></linearGradient></defs>
  <g transform="translate(470 1406) rotate(-4)"><rect x="0" y="0" width="150" height="46" rx="4" fill="#FFFEFA"/><path d="M14 14h110M14 28h80" stroke="#C9D6EA" stroke-width="5"/></g></svg>`;
const pClock = mount('r-pClock', clock({ size: 250, label: 'story-paper' }), 125, 125);
pClock.setTime(T0315);
const zClock = mount('r-zClock', clock({ size: 500, label: 'story-zoom' }), 540, 740);
zClock.setTime(T0315);
const rLens = CLOCK.lens({ size: 270, clockSize: 500, zoom: 3.4 });
ALL_CLOCKS.push(rLens.clock);
$('r-lens').appendChild(rLens.el); $('r-lens').style.left = 405 + 'px'; $('r-lens').style.top = 1150 + 'px';
$('r-lens').style.width = $('r-lens').style.height = '270px';
rLens.set(T0315, [93, 58]);
rLens.clock.ref(90, 1); rLens.clock.numeral(3, '#D9568A');
// thought bubble beside the student's head
Object.assign($('r-think').style, { left: '560px', top: '1110px', width: '300px', height: '210px' });
$('r-think').innerHTML = `<div style="position:absolute;left:0;right:0;top:20px;text-align:center;font-weight:800;font-size:32px;line-height:1.45;color:#142B53"><span class="cb">เข็มยาวชี้ 3</span><br><span class="cp">เข็มสั้นก็ชี้ 3?</span><br><span style="color:#EF4444">ทับกัน = 0°</span></div>
  <div style="position:absolute;left:-30px;top:150px;width:34px;height:34px;border-radius:50%;background:#fff;box-shadow:0 0 0 5px #F8CFE2"></div>
  <div style="position:absolute;left:-58px;top:186px;width:20px;height:20px;border-radius:50%;background:#fff;box-shadow:0 0 0 4px #F8CFE2"></div>`;
sfx('step', sb.room + .1, .5); sfx('page', sb.paper, .9); sfx('pop', sb.qtime, .4); sfx('pop', sb.qangle, .4);
sfx('pop', sb.think, .6); for (let i = 0; i < 4; i++) sfx('type', sb.zero + .05 + i * .12, .8); sfx('zip', sb.zero + .55, .5);
sfx('drop', sb.but, .6); sfx('stamp', sb.wrong, .9); sfx('riser', sb.zoom - .4, .6); sfx('whoosh', sb.zoom + .1, .8);
sfx('whoosh', sb.zoom + 1.3, .5); sfx('sparkle', sb.zoom + 1.5, .7); sfx('pop', sb.ask, .5);

function drawStory(t) {
  $('s2').style.transform = 'none';
  const u = t - ST0;
  $('r-world').style.transform = `scale(${1 + .05 * E.inOut(P(u, 0, 20))})`;
  show($('r-title'), u, sb.room, sb.paper - .2);
  // student acting
  const ex = u < sb.rush ? 'curious' : u < sb.but ? 'grin' : 'surprise';
  student.pose({ t: u, expr: ex, blink: STORY.blinkAt(u, 2), lookY: u > sb.paper && u < sb.but ? .8 : 0, lookX: u > sb.think && u < sb.rush ? .6 : 0,
    tilt: u > sb.think && u < sb.rush ? -6 : 0, sweat: u > sb.wrong, armL: [10, -8], armR: [10, -8] });
  // question paper
  const pl = life(u, sb.paper, sb.zoom, { from: .3, dy: 500, d: .7, out: .35 });
  tf($('r-paper'), { ...pl, s: pl.s * (u > sb.zoom ? 1 + 1.2 * E.in(P(u, sb.zoom, .35)) : 1), r: (1 - E.out(P(u, sb.paper, .7))) * -8 });
  tf($('r-q1'), { o: clamp((u - sb.qtime) / .3) });
  tf($('r-q2'), { o: clamp((u - sb.qangle) / .3) });
  // writing "0°" then circling it
  const wp = P(u, sb.zero, .55);
  $('r-ans').style.clipPath = `inset(0 ${100 - 100 * wp}% 0 0)`;
  $('r-circ').querySelector('path').setAttribute('stroke-dashoffset', 100 - 100 * E.inOut(P(u, sb.zero + .55, .6)));
  const pen = u > sb.rush && u < sb.but + .4;
  const px = u < sb.zero ? 470 : u < sb.zero + .55 ? lerp(410, 520, wp) : lerp(520, 560, P(u, sb.zero + .55, .6));
  const py = u < sb.zero ? 300 : 330 + 14 * Math.sin(u * 40) * (u < sb.zero + 1.1 ? 1 : 0);
  tf($('r-pencil'), { x: px, y: py, r: -35, o: pen ? clamp((u - sb.rush) / .2) * (1 - P(u, sb.but + .2, .2)) : 0 });
  tf($('r-wrong'), { ...life(u, sb.wrong, 1e9, { from: 2.2, dy: 0, d: .35 }), r: -10 });
  show($('r-think'), u, sb.think, sb.rush + .2, { from: .3, el: true, d: .8 });
  // zoom into the physically accurate clock
  const zo = E.out(P(u, sb.zoom, .5));
  $('r-zoom').style.opacity = zo; $('r-zoom').style.visibility = zo > 0 ? 'visible' : 'hidden';
  const zk = E.out(P(u, sb.zoom + .1, .9));
  tf(zClock.el, { s: lerp(.4, 1, zk), y: lerp(-80, 0, zk), o: clamp((u - sb.zoom) / .3) });
  zClock.emph({ hourGlow: u > sb.zoom + 1 ? pulse(u, 5) : 0, minute: .8, halo: .3 });
  zClock.ref(90, clamp((u - sb.zoom - .8) / .4));
  zClock.numeral(3, '#D9568A', 1.2);
  show($('r-zTitle'), u, sb.zoom + .3);
  show($('r-lens'), u, sb.zoom + 1.3, 1e9, { from: .2, el: true, d: .9, dy: 0 });
  const [ax, ay] = cpt(zClock, 94, 66);
  const lk = P(u, sb.zoom + 1.2, .5);
  const lp = $('r-link').querySelector('path');
  lp.setAttribute('d', `M${ax} ${ay} L${lerp(ax, 540, lk)} ${lerp(ay, 1150, lk)}`); lp.setAttribute('opacity', .85 * lk);
  show($('r-zLbl'), u, sb.zoom + 1.9, 1e9, { el: true, d: .8 });
  show($('r-ask'), u, sb.ask, 1e9, { from: .2, el: true, d: .8, dy: 0 });
  if (u > sb.ask + .8) tf($('r-ask'), { s: 1 + .06 * Math.sin(u * 5), r: 8 * Math.sin(u * 2.5) });
}

// ======================================================================
// SCENE 3 — HOW THE HANDS MOVE (6°/min and 0.5°/min)
// ======================================================================
const kb = B.know;
const kClock = mount('k-clock', clock({ size: 440, label: 'know' }), 540, 690);
const cmpL = mount('k-cmpL', clock({ size: 280, label: 'know-jump-wrong' }), 380, 720);
const cmpR = mount('k-cmpR', clock({ size: 280, label: 'know-continuous' }), 700, 720);
const sumClock = mount('k-sumClock', clock({ size: 290, label: 'know-summary' }), 540, 1250);
$('k-cmpLx').innerHTML = ICON.cross('#fff', 52); $('k-cmpRx').innerHTML = ICON.check('#fff', 52);
sfx('pop', kb.n6, .8); sfx('pop', kb.n05, .8); sfx('whoosh', kb.mh - .1, .5);
for (let i = 0; i < 12; i++) sfx('tick', kb.mRun + i * (kb.mEnd - kb.mRun) / 12, .25);
sfx('pop', kb.mEq, .5); sfx('ding', kb.mRes, .5); sfx('sparkle', kb.mHi, .5);
sfx('rewind', 12.45, .6); sfx('pop', kb.hh, .5);
for (let i = 0; i < 12; i++) sfx('tick', kb.hRun + i * (kb.hEnd - kb.hRun) / 12, .25);
sfx('pop', kb.hEq, .5); sfx('ding', kb.hRes, .5); sfx('sparkle', kb.hHi, .5);
sfx('whoosh', kb.cmp - .1, .6); sfx('drop', kb.cmpB, .5); sfx('success', kb.cmpB + .5, .5);
sfx('whoosh', kb.sum - .1, .5); sfx('pop', kb.sumM, .7); sfx('pop', kb.sumH, .7);

function drawKnow(t) {
  $('s3').style.transform = 'none';
  const u = t - K0;
  show($('k-hdr'), u, kb.hdr, kb.cmp - .15);
  show($('k-n6'), u, kb.n6, kb.mh - .2, { from: .2, el: true, d: .9, dy: 0 });
  show($('k-n05'), u, kb.n05, kb.mh - .2, { from: .2, el: true, d: .9, dy: 0 });
  // main clock: minute-hand lap (03:00 -> 04:00), rewind, hour-hand lap (03:00 -> 04:00)
  let Tm = T0300;
  if (u >= kb.mRun) Tm = lapse(u, kb.mRun, kb.mEnd - kb.mRun, T0300, T0400);
  if (u >= 12.45) Tm = lapse(u, 12.45, .4, T0400, T0300);
  if (u >= kb.hRun) Tm = lapse(u, kb.hRun, kb.hEnd - kb.hRun, T0300, T0400);
  kClock.setTime(Tm);
  const mPh = u < 12.45, hPh = u >= 12.45;
  show(kClock.el, u, kb.mh - .1, kb.cmp - .15, { from: .6, dy: 30 });
  kClock.emph({ hour: mPh ? .4 : 1, minute: hPh ? .35 : 1, minuteGlow: mPh && u > kb.mh ? pulse(u, 6) * .8 : 0, hourGlow: hPh && u > kb.hh ? pulse(u, 6) * .8 : 0 });
  const mSweep = Math.min(359.9, 6 * (Tm - T0300));
  kClock.arc('m', 0, mSweep, '#2F6BFF', 88, 5, mPh && u > kb.mRun ? 1 : 0);
  kClock.arc('h', 90, MATH.hourAngle(Tm), '#EE7FAA', 62, 9, hPh && u > kb.hRun ? .9 : 0);
  show($('k-lM'), u, kb.mh, 12.4); show($('k-lH'), u, kb.hh, kb.cmp - .15);
  show($('k-eqM'), u, kb.mEq, 12.4); tf($('k-eqMr'), life(u, kb.mRes, 1e9, { from: .3, dy: 0, el: true, d: .7 }));
  show($('k-eqH'), u, kb.hEq, kb.cmp - .15); tf($('k-eqHr'), life(u, kb.hRes, 1e9, { from: .3, dy: 0, el: true, d: .7 }));
  show($('k-hiM'), u, kb.mHi, 12.4, { el: true, d: .8 }); show($('k-hiH'), u, kb.hHi, kb.cmp - .15, { el: true, d: .8 });
  // comparison: WRONG (jumping hour hand) vs RIGHT (continuous)
  show($('k-hdr2'), u, kb.cmp, kb.sum - .15);
  const cp = clamp(((u - kb.cmp - .5) % 2.9) / 2.3), Tc = T0300 + 60 * cp;
  cmpR.setTime(Tc);
  cmpL.setAngles(cp >= 1 ? 120 : 90, MATH.minuteAngle(Tc) + (cp >= 1 ? 360 : 0));   // illustration of the wrong model
  cmpL.emph({ hourGlow: .6 }); cmpR.emph({ hourGlow: .6 });
  show(cmpL.el, u, kb.cmp + .1, kb.sum - .15, { from: .5 }); show(cmpR.el, u, kb.cmp + .25, kb.sum - .15, { from: .5 });
  show($('k-cmpLt'), u, kb.cmp + .4, kb.sum - .15); show($('k-cmpRt'), u, kb.cmpB, kb.sum - .15);
  show($('k-cmpLx'), u, kb.cmpB, kb.sum - .15, { from: .2, el: true, d: .8, dy: 0 });
  show($('k-cmpRx'), u, kb.cmpB + .5, kb.sum - .15, { from: .2, el: true, d: .8, dy: 0 });
  $('k-cmpTimeT').textContent = MATH.label(Tc);
  show($('k-cmpTime'), u, kb.cmp + .3, kb.sum - .15);
  show($('k-cmpNote'), u, kb.cmpB + 1.3, kb.sum - .15);
  // summary
  show($('k-hdr3'), u, kb.sum);
  show($('k-sumM'), u, kb.sumM, 1e9, { from: .4, el: true, d: .8 });
  show($('k-sumH'), u, kb.sumH, 1e9, { from: .4, el: true, d: .8 });
  const Ts = lapse(u, kb.sum + .2, 5, T0300, T0315, p => p);
  sumClock.setTime(Ts);
  show(sumClock.el, u, kb.sum + .2);
  sumClock.emph({ minuteGlow: u > kb.sumM && u < kb.sumH ? pulse(u, 6) : 0, hourGlow: u > kb.sumH ? pulse(u, 6) : 0 });
}

// ======================================================================
// SCENE 4 — QUICK CALCULATION METHOD
// ======================================================================
const xb = B.expl;
const xClock = mount('x-clock', clock({ size: 440, label: 'expl' }), 540, 690);
const x90 = h(`<div class="lbl c" style="background:#FFD23F;color:#142B53;font-size:40px">90°</div>`); $('s4').appendChild(x90);
sfx('pop', xb.t300, .5); sfx('ding', xb.pos + .1, .4); sfx('ding', xb.posH + .1, .4); sfx('sparkle', xb.deg90, .6);
sfx('whoosh', xb.lapse, .5); for (let i = 0; i < 10; i++) sfx('tick', xb.lapse + .45 + i * .36, .3);
sfx('pop', xb.fM, .6); sfx('pop', xb.fH, .6); sfx('pop', xb.diff, .6); sfx('riser', xb.go - .3, .5);

function drawExpl(t) {
  $('s4').style.transform = 'none';
  const u = t - X0;
  show($('x-hdr'), u, xb.t300, xb.go - .1); show($('x-go'), u, xb.go, 1e9, { el: true, d: .8 });
  const Tm = u < xb.lapse + .45 ? T0300 : lapse(u, xb.lapse + .45, 3.6, T0300, T0315);
  xClock.setTime(Tm); show(xClock.el, u, 0, 1e9, { from: .6 });
  $('x-digT').textContent = MATH.label(Tm); show($('x-dig'), u, xb.t300 + .2);
  const mG = (u > xb.pos && u < xb.posH) || (u > xb.fMarc && u < xb.fH) ? pulse(u, 6) : 0;
  const hG = (u > xb.posH && u < xb.deg90) || (u > xb.fHarc && u < xb.diff) ? pulse(u, 6) : 0;
  const dG = u > xb.diff ? pulse(u, 4) * .7 : 0;
  xClock.emph({ minuteGlow: Math.max(mG, dG), hourGlow: Math.max(hG, dG), hour: u > xb.fM && u < xb.fH ? .45 : 1, minute: u > xb.fH && u < xb.diff ? .45 : 1 });
  xClock.numeral(12, u > xb.pos && u < xb.lapse ? '#2F6BFF' : '#31445D', u > xb.pos && u < xb.lapse ? 1.3 : 1);
  xClock.numeral(3, u > xb.posH && u < xb.lapse ? '#D9568A' : '#31445D', u > xb.posH && u < xb.lapse ? 1.3 : 1);
  // 03:00 = 90 deg (minute on 12, hour on 3)
  const so = clamp((u - xb.deg90) / .4) * (1 - P(u, xb.lapse - .1, .4));
  xClock.sector(0, 90 * E.out(P(u, xb.deg90, .6)), so, 80);
  const [lx, ly] = cpt(xClock, 45, 45);
  tf(x90, { ...life(u, xb.deg90 + .3, xb.lapse - .1, { from: .3, dy: 0, el: true }), x: lx - 40, y: ly - 32 });
  show($('x-90'), u, xb.deg90, xb.lapse - .1);
  // +15 minutes: ghosts at the 03:00 positions, both hands move (no difference revealed yet)
  xClock.ghost(90, 0, u > xb.lapse + .2 && u < xb.fM ? .9 : 0);
  show($('x-plus'), u, xb.lapse + .1, xb.fM - .1);
  const trace = u > xb.lapse + .45 && u < xb.fM ? 1 : 0;
  xClock.arc('m', 0, MATH.minuteAngle(Tm), '#2F6BFF', 88, 5, trace);
  xClock.arc('h', 90, MATH.hourAngle(Tm), '#EE7FAA', 62, 9, trace);
  // position markers measured from 12
  const mk = E.inOut(P(u, xb.fMarc, 1.2)), hk = E.inOut(P(u, xb.fHarc, 1.4));
  xClock.arc('pm', 0, 90 * mk, '#2F6BFF', 88, 6, u > xb.fMarc ? 1 : 0);
  xClock.arc('ph', 0, MATH.hourAngle(Tm) * hk, '#EE7FAA', 48, 6, u > xb.fHarc ? 1 : 0);
  show($('x-fM'), u, xb.fM, xb.go - .1); show($('x-fH'), u, xb.fH, xb.go - .1);
  show($('x-fD'), u, xb.diffB, xb.go - .1); show($('x-note'), u, xb.diffB + .8, xb.go - .1, { dy: 10 });
}

// ======================================================================
// SCENE 5 — QUIZ, EXACT 5 s COUNTDOWN, ANSWER
// ======================================================================
const qb = B.quiz, ab = B.ans;
const qClock = mount('q-clock', clock({ size: 270, label: 'quiz' }), 540, 797);
qClock.setTime(T0315);
const aClock = mount('a-clock', clock({ size: 480, label: 'answer' }), 540, 700);
const OPTS = [['ก', '0°'], ['ข', '7.5°'], ['ค', '15°'], ['ง', '30°']], CORRECT = 1;
const OP_TOP = [948, 1060, 1172, 1284];
const qOpts = OPTS.map(([b, tx], i) => {
  const el = h(`<div class="op c" data-ess="opt" style="top:${OP_TOP[i]}px"><div class="ov"></div><div class="b">${b}</div><div class="tx">${b}. ${tx}</div><div class="ck">${ICON.check('#16A34A', 50)}</div></div>`);
  el.querySelector('.tx').textContent = `${tx}`;
  $('q-opts').appendChild(el);
  return { el, ov: el.querySelector('.ov'), b: el.querySelector('.b'), tx: el.querySelector('.tx'), ck: el.querySelector('.ck') };
});
const qCd = NSP.buildCountdown($('q-cd'), 230);
Object.assign($('q-think').style, { left: '220px', width: '640px', top: '352px', display: 'flex', justifyContent: 'center' });
$('q-think').classList.add('row'); $('q-think').dataset.ess = 'qthink';
$('q-think').firstElementChild.style.fontSize = '40px';
Object.assign($('q-cdLbl').style, { left: '220px', width: '640px', top: '352px', display: 'flex', justifyContent: 'center' });
$('q-cdLbl').innerHTML = `<div class="tag t-navy" style="font-size:40px">${ICON.timer(44, '#22D3EE')}คิด 5 วินาที</div>`;
$('q-cdLbl').dataset.ess = 'qcdlbl';
$('q-ansHdrI').innerHTML = ICON.check('#fff', 40);
['a-dA', 'a-dC', 'a-dD'].forEach(id => { $(id).querySelector('.x').innerHTML = ICON.cross('#fff', 44); });
const aLens = CLOCK.lens({ size: 230, clockSize: 480, zoom: 3 });
ALL_CLOCKS.push(aLens.clock);
$('a-lens').appendChild(aLens.el); Object.assign($('a-lens').style, { left: '627px', top: '445px', width: '230px', height: '230px' });
const qConf = NSP.buildConfetti($('q-conf'), 60, 540, 1320);
// SFX + marks
sfx('whoosh', qb.hdr, .6); sfx('sparkle', qb.hdr + .3, .6); sfx('page', qb.q, .7); sfx('pop', qb.clock, .5);
qb.opts.forEach(a => sfx('pop', a + .05, .8)); sfx('ding', qb.hint, .4); sfx('riser', qb.five, .4);
for (let i = 0; i < 5; i++) sfx(i < 4 ? 'tick' : 'tick2', CD + i, 1.0);
mark('countdown_start', CD); mark('answer_start', AN);
sfx('success', AN + ab.pick, 1.0); sfx('ding', AN + ab.pick + .15, .7); sfx('sparkle', AN + ab.pick + .3, .8);
sfx('whoosh', AN + ab.calc, .6); sfx('rewind', AN + 4.6, .5);
for (let i = 0; i < 6; i++) sfx('tick', AN + ab.mRun + i * .35, .3);
sfx('pop', AN + ab.mEq, .6); sfx('ding', AN + ab.mRes, .5); sfx('rewind', AN + ab.hStart, .5); sfx('pop', AN + ab.hStart + .3, .5);
for (let i = 0; i < 8; i++) sfx('tick', AN + ab.hRun + i * .45, .25);
sfx('pop', AN + ab.hEq, .6); sfx('ding', AN + ab.hRes, .5); sfx('pop', AN + ab.hPos, .6); sfx('ding', AN + ab.hPosRes, .5);
sfx('pop', AN + ab.diff, .6); sfx('success', AN + ab.diffRes, .8); sfx('whoosh', AN + ab.diffRes + .4, .5);
[ab.dA, ab.dC, ab.dD].forEach(a => { sfx('pop', AN + a, .6); sfx('drop', AN + a + .4, .45); });
sfx('pop', AN + ab.memM, .7); sfx('pop', AN + ab.memH, .7);
sfx('riser', AN + ab.fin - .5, .5); sfx('success', AN + ab.fin + .1, .9); sfx('sparkle', AN + ab.fin + .3, .9);

function drawQuiz(t) {
  $('s5').style.transform = 'none';
  const u = t - QS, uc = t - CD, ua = t - AN;
  const calc = ua >= ab.calc;
  // header states
  show($('q-hdr'), u, qb.hdr, qb.hint - .1, { from: .4, el: true, d: .8 });
  show($('q-think'), u, qb.hint, CD - QS - .05);
  tf($('q-cdLbl'), life(uc, 0, 5, { from: .5, dy: 20, d: .35, out: .2 }));
  show($('q-say'), ua, ab.say, ab.calc - .1, { from: .3, el: true, d: .7 });
  show($('q-ansHdr'), ua, ab.calc, 1e9, { from: .4, el: true, d: .8 });
  // question card + quiz clock (accurate 03:15, the hands are NOT exaggerated)
  show($('q-card'), u, qb.q, AN + ab.calc - QS, { from: .7, dy: 30 });
  const toLeft = E.inOut(P(uc, -.6, .6)) * (1 - E.inOut(P(ua, ab.calc, .65)));
  const k = E.inOut(P(ua, ab.calc, .65));
  const ql = life(u, qb.clock, 1e9, { from: .4, dy: 30 });
  tf(qClock.el, { ...ql, x: -145 * toLeft, y: ql.y + lerp(0, -97, k), s: ql.s * lerp(1, 480 / 270, k), o: ql.o * (1 - P(ua, ab.calc + .45, .2)) });
  qClock.emph({ hourGlow: u > qb.hint && uc < 0 ? pulse(u, 6) * .8 : 0 });
  // options: neutral until the reveal
  qOpts.forEach((o, i) => {
    const l = life(u, qb.opts[i], 1e9, { from: .5, dy: 30, d: .5 });
    const out = P(ua, ab.calc, .35);
    if (ua >= ab.pick && i === CORRECT) {
      const rp = ua - ab.pick;
      o.ov.style.opacity = clamp(rp / .25); o.tx.style.color = '#fff';
      o.b.style.background = 'radial-gradient(circle at 35% 30%,#BBF7D0,#16A34A 75%)';
      tf(o.ck, { s: lerp(0, 1, E.elastic(P(rp, .1, .8))), o: clamp(rp / .1) });
      o.el.style.boxShadow = `0 9px 0 #15803D,0 0 0 5px rgba(255,255,255,.9),0 0 ${40 + 14 * Math.sin(rp * 3)}px 10px rgba(34,197,94,.5)`;
      tf(o.el, { ...l, s: l.s * (1 + .025 * E.back(P(rp, 0, .5)) - .025 * P(rp, .5, .4)), o: l.o * (1 - out) });
      o.el.style.filter = '';
    } else {
      o.ov.style.opacity = 0; o.tx.style.color = ''; o.b.style.background = ''; o.el.style.boxShadow = ''; tf(o.ck, { o: 0 });
      const dim = ua >= ab.pick ? .5 * E.out(P(ua, ab.pick, .45)) : 0;
      tf(o.el, { ...l, o: l.o * (1 - dim) * (1 - out), s: l.s * (1 - .05 * dim / .5) });
      o.el.style.filter = dim ? `grayscale(${dim * 1.6})` : '';
    }
  });
  // exactly 150 frames: CD .. CD+5 (5,4,3,2,1 for 30 frames each)
  NSP.drawCountdown(qCd, uc, T.cd[1]);
  // ---------------- answer calculation ----------------
  let Tm = T0315;
  if (ua >= 4.6) Tm = lapse(ua, 4.6, .55, T0315, T0300);
  if (ua >= ab.mRun) Tm = lapse(ua, ab.mRun, 2.0, T0300, T0315);
  if (ua >= ab.hStart) Tm = lapse(ua, ab.hStart, .5, T0315, T0300);
  if (ua >= ab.hRun) Tm = lapse(ua, ab.hRun, 3.5, T0300, T0315, p => p);
  aClock.setTime(Tm);
  const al = { x: -145 * (1 - k) * (uc > 0 ? 1 : 0), y: lerp(97, 0, k), s: lerp(270 / 480, 1, k), o: calc ? clamp((ua - ab.calc - .35) / .2) : 0 };
  tf(aClock.el, al);
  const mPh = ua >= ab.mRun - .3 && ua < ab.hStart, hPh = ua >= ab.hStart && ua < ab.diff, dPh = ua >= ab.diff;
  aClock.emph({ hour: mPh ? .4 : 1, minute: hPh ? .4 : 1, minuteGlow: mPh ? pulse(ua, 6) * .8 : 0, hourGlow: hPh ? pulse(ua, 6) * .8 : dPh && ua < ab.dA ? pulse(ua, 4) * .5 : 0 });
  aClock.arc('m', 0, MATH.minuteAngle(Tm), '#2F6BFF', 88, 6, mPh && ua > ab.mRun ? 1 : 0);
  aClock.arc('h0', 0, 90 * E.inOut(P(ua, ab.hStart + .3, .8)), '#EE7FAA', 44, 6, hPh ? .8 : 0);
  aClock.ghost(hPh && ua > ab.hRun ? 90 : null, null, .9);
  aClock.arc('h', 90, MATH.hourAngle(Tm), '#EE7FAA', 62, 10, hPh && ua > ab.hRun ? .95 : 0);
  aClock.arc('hp', 90, 90 + 7.5 * E.inOut(P(ua, ab.hPosRes, .6)), '#D9568A', 44, 6, ua > ab.hPos && ua < ab.diff ? .95 : 0);
  // final difference: yellow sector from the minute hand (90) to the hour hand (97.5) = 7.5 deg, to scale
  const sp = E.out(P(ua, ab.diffRes, .5));
  aClock.sector(MATH.minuteAngle(T0315), MATH.minuteAngle(T0315) + (MATH.hourAngle(T0315) - MATH.minuteAngle(T0315)) * sp, ua > ab.diffRes ? 1 : 0, 88);
  aClock.ref(90, ua > ab.dA && ua < ab.dC ? 1 : 0, '#EF4444');
  aClock.arc('dd', 90, 120, '#EF4444', 91, 9, ua > ab.dD + .3 && ua < ab.memM ? .85 : 0);
  // tags on the clock
  tf($('a-tagM'), { ...life(ua, ab.mRes, ab.hStart, { from: .3, dy: 0, el: true }), x: 528, y: 626 });
  if (ua > ab.diff) tf($('a-tagM'), { ...life(ua, ab.diff + .2, ab.dA, { from: .3, dy: 0, el: true }), x: 528, y: 626 });
  tf($('a-tagH'), { ...life(ua, ab.hPosRes, ab.dA, { from: .3, dy: 0, el: true }), x: 588, y: 742 });
  tf($('a-tagS'), { ...life(ua, ab.diffRes + .3, ab.memM, { from: .3, dy: 0, el: true }), x: 756, y: 744 });
  // magnified inset (same time, same angles, larger scale)
  aLens.set(T0315, [94, 60]);
  aLens.clock.sector(90, 90 + 7.5 * sp, ua > ab.diffRes ? 1 : 0, 88);
  aLens.clock.emph({ hourGlow: .5, minuteGlow: .3 });
  show($('a-lens'), ua, ab.diffRes + .5, ab.dA - .3, { from: .2, el: true, d: .9, dy: 0 });
  const lk = P(ua, ab.diffRes + .4, .4) * (1 - P(ua, ab.dA - .3, .3));
  const [ax, ay] = cpt(aClock, 94, 70);
  const lp = $('a-link').querySelector('path');
  lp.setAttribute('d', `M${ax} ${ay} L${lerp(ax, 742, lk)} ${lerp(ay, 676, lk)}`); lp.setAttribute('opacity', .8 * lk);
  // equation stack
  const eqEnd = ab.dA - .3;
  show($('a-L1'), ua, ab.mEq, eqEnd); tf($('a-L1r'), life(ua, ab.mRes, 1e9, { from: .3, dy: 0, el: true }));
  show($('a-L2'), ua, ab.hStart + .3, eqEnd);
  show($('a-L3'), ua, ab.hEq, eqEnd); tf($('a-L3r'), life(ua, ab.hRes, 1e9, { from: .3, dy: 0, el: true }));
  show($('a-L4'), ua, ab.hPos, eqEnd); tf($('a-L4r'), life(ua, ab.hPosRes, 1e9, { from: .3, dy: 0, el: true }));
  show($('a-L5'), ua, ab.diff, eqEnd, { el: true, d: .8 }); tf($('a-L5r'), life(ua, ab.diffRes, 1e9, { from: .3, dy: 0, el: true }));
  // distractors
  show($('a-dA'), ua, ab.dA, ab.memM - .3); show($('a-dC'), ua, ab.dC, ab.memM - .3); show($('a-dD'), ua, ab.dD, ab.memM - .3);
  // memory + final
  show($('a-mM'), ua, ab.memM, 1e9, { el: true, d: .8 }); show($('a-mH'), ua, ab.memH, 1e9, { el: true, d: .8 });
  const fl = life(ua, ab.fin, 1e9, { from: .3, dy: 40, el: true, d: 1 });
  tf($('a-fin'), { ...fl, s: fl.s * (1 + .025 * Math.sin(ua * 4) * (ua > ab.fin + 1 ? 1 : 0)) });
  NSP.drawConfetti(qConf, t, ua < ab.fin ? AN + ab.pick + .1 : AN + ab.fin + .2, 2.4);
}

// ======================================================================
// SCENE 6 — PROMOTION (timed to the measured phrase starts of 07_promotion.mp3)
// ======================================================================
const C = T.promo_cues;   // comment, comment b, logo, 10,000+, weekly, subjects, subjects b, like, share/follow, outro
const SUBJ = [['คณิตศาสตร์', `<div style="font-weight:800;font-size:30px;color:#fff;line-height:1.05;text-align:center">+ −<br>× ÷</div>`, 0],
  ['ภาษาไทย', `<div style="font-weight:800;font-size:52px;color:#fff">ก</div>`, 1], ['ภาษาอังกฤษ', `<div style="font-weight:800;font-size:44px;color:#fff">Aa</div>`, 0],
  ['กฎหมาย', `<svg width="52" height="52" viewBox="0 0 24 24"><path d="M12 3v16M5 7h14M4 19h16" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M5 7l-3 6h6zM19 7l-3 6h6z" fill="#fff"/></svg>`, 1],
  ['คอมพิวเตอร์', `<svg width="50" height="50" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="13" rx="2" fill="#fff"/><path d="M8 21h8M12 16v5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`, 0],
  ['สังคม/รอบรู้', `<svg width="50" height="50" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4.9 1 .9 1.6V16h5.2v-.5c0-.6.3-1.2.9-1.6A6 6 0 0 0 12 3z" fill="#fff"/></svg>`, 1]];
$('p-subj').innerHTML = SUBJ.map(s => `<div class="subj c"><div class="ti" style="background:linear-gradient(160deg,${s[2] ? '#F9B6D0,#EE7FAA' : '#8DB1FF,#2F6BFF'})">${s[1]}</div>${s[0]}</div>`).join('');
$('p-subj').dataset.ess = 'psubj';
$('p-like').innerHTML = `<svg width="78" height="78" viewBox="0 0 24 24"><path d="M7 10v10H3V10zM9 20h8.5a2 2 0 0 0 2-1.6l1.4-6.6A2 2 0 0 0 18.9 9H14l.8-3.8A2 2 0 0 0 12.9 3L9 10z" fill="#fff"/></svg>ไลก์`;
$('p-share').innerHTML = `<svg width="78" height="78" viewBox="0 0 24 24"><path d="M14 4l7 7-7 7v-4c-5 0-8 1.5-11 5 1-6 4-10 11-11z" fill="#fff"/></svg>แชร์`;
$('p-follow').innerHTML = `<svg width="78" height="78" viewBox="0 0 24 24"><circle cx="10" cy="8" r="4" fill="#fff"/><path d="M3 20c0-4 3-6.5 7-6.5s7 2.5 7 6.5z" fill="#fff"/><path d="M19 7v6M16 10h6" stroke="#22D3EE" stroke-width="2.4" stroke-linecap="round"/></svg>ติดตาม`;
$('p-updI').innerHTML = ICON.cal(52, '#fff');
const pBtT = h(`<div class="row c" data-ess="pbtt" style="top:420px"><div class="tag t-navy" style="font-size:44px">อย่าลืมกด!</div></div>`); $('s6').insertBefore(pBtT, $('p-btns'));
$('p-btns').style.top = '560px';
const pFollowAt = C[8] + .75, END_AT = C[9];
const eConf = NSP.buildConfetti($('e-conf'), 70, 540, 700);
mark('endcard', PR + END_AT);
sfx('whoosh', PR + .05, .5); sfx('msg', PR + C[0] + .5, .8); sfx('msg', PR + C[0] + 1.2, .8); sfx('msg', PR + C[0] + 1.9, .8);
sfx('riser', PR + C[2] - .5, .5); sfx('sparkle', PR + C[2] + .2, .8);
sfx('whoosh', PR + C[3] - .08, .4); for (let i = 0; i < 6; i++) sfx('coin', PR + C[3] + .2 + i * .16, .4);
sfx('pop', PR + C[4] + .1, .7); sfx('whoosh', PR + C[5] - .08, .4); for (let i = 0; i < 6; i++) sfx('pop', PR + C[5] + .2 + i * .12, .45);
sfx('click', PR + C[7] + .25, .8); sfx('pop', PR + C[7] + .3, .6); sfx('click', PR + C[8] + .25, .8); sfx('click', PR + pFollowAt + .25, .8);
sfx('whoosh', PR + END_AT - .1, .7); sfx('ding', PR + END_AT + .25, .8); sfx('sparkle', PR + END_AT + .4, .9);
const press = (u, at) => { const v = u - at; return v > 0 && v < .5 ? Math.sin(v / .5 * Math.PI) : 0; };

function drawPromo(t) {
  $('s6').style.transform = 'none';
  const u = t - PR;
  show($('p-title'), u, C[0], C[2] - .1, { el: true, d: .8 });
  [...$('p-cmts').children].forEach((c, i) => show(c, u, C[0] + [.5, 1.2, 1.9, 1.5][i], C[2] - .1, { from: .3, dy: 40 }));
  const lg = life(u, C[2], C[3] - .1, { from: .3, dy: 200, d: .9, el: true });
  tf($('p-logo'), { ...lg, y: lg.y + bob(u, 0, 8) });
  show($('p-word'), u, C[2] + .35, C[3] - .1); show($('p-th'), u, C[2] + .6, C[3] - .1);
  show($('p-10k'), u, C[3], C[5] - .1);
  $('p-10kN').textContent = (Math.round(10000 * E.out(P(u, C[3] + .1, 1.2)) / 100) * 100).toLocaleString('en-US') + '+';
  show($('p-upd'), u, C[4], C[5] - .1, { el: true, d: .8 });
  show($('p-sT'), u, C[5], C[7] - .1);
  [...$('p-subj').children].forEach((el, i) => show(el, u, C[5] + .15 + i * .12, C[7] - .1, { from: .2, el: true, d: .7 }));
  show(pBtT, u, C[7] - .05, END_AT - .1);
  [['p-like', C[7]], ['p-share', C[8]], ['p-follow', pFollowAt]].forEach(([id, a]) => {
    const l = life(u, a, END_AT - .1, { from: .2, el: true, d: .8 });
    tf($(id), { ...l, s: l.s * (1 - .12 * press(u, a + .25)) });
  });
  const ue = u - END_AT, ec = $('p-end');
  ec.style.visibility = ue < 0 ? 'hidden' : 'visible';
  ec.style.clipPath = `circle(${E.out(P(ue, 0, .5)) * 1300}px at 540px 800px)`;
  const l2 = life(ue, .1, 1e9, { from: .2, dy: 0, el: true, d: 1.0 });
  tf($('e-logo'), { ...l2, y: bob(ue, 0, 8) });
  show($('e-word'), ue, .3); show($('e-tag'), ue, .5); show($('e-cta'), ue, .7);
  NSP.drawConfetti(eConf, t, PR + END_AT + .2, 2.4);
}

// ======================================================================
(function fixMul(root) {
  const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const hits = []; let n;
  while ((n = w.nextNode())) if (n.nodeValue.includes('×') && !n.parentElement.closest('svg')) hits.push(n);
  hits.forEach(n => { const sp = document.createElement('span'); sp.innerHTML = n.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\s?×\s?/g, '<i class="mx"></i>'); n.replaceWith(sp); });
})($('stage'));
NSP.start({
  ep: 'EP.31 • คณิตศาสตร์',
  brand: { showAt: 1.2, hideAt: PR + END_AT },
  wipes: [ST0, K0, X0, QS, PR],
  scenes: [
    { el: $('s1'), a: 0, b: ST0, draw: drawHook },
    { el: $('s2'), a: ST0, b: K0, draw: drawStory },
    { el: $('s3'), a: K0, b: X0, draw: drawKnow },
    { el: $('s4'), a: X0, b: QS, draw: drawExpl },
    { el: $('s5'), a: QS, b: PR, draw: drawQuiz },
    { el: $('s6'), a: PR, b: 1e9, draw: drawPromo },
  ],
});
if (/[?&]safe=1/.test(location.search)) $('safe-guide').style.display = 'block';
