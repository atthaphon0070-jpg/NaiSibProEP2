// NaiSibPro EP.45 — scenes.  All timing comes from window.TL (measured narration) + window.BEATS (phrase cues).
// All numbers come from window.MATH.  840 / 748 / the solved 92 / the correct-answer highlight only exist at t >= AN.
(function () {
const { $, clamp, lerp, E, P, life, bob, h, ICON, sfx, mark } = NSP;
// Safe-zone guard: every .crit element is transformed through this wrapper, which limits pop-in overshoot
// (scale) and entrance offsets so its box stays inside X 220–860 / Y 350–1430 even at the end of a scene,
// where the engine grows the whole scene by 2.5 % around (540, 864).
const SZ = (() => { const k = 1.025, m = 1.5; return { x0: 540 - (320 - m) / k, x1: 540 + (320 - m) / k, y0: 864 - (514 - m) / k, y1: 864 + (566 - m) / k }; })();
const boxCache = new WeakMap();
function boxOf(el) {
  let b = boxCache.get(el); if (b) return b;
  if (!el.offsetWidth) return null;
  let l = 0, t = 0; for (let e = el; e && e.id !== 'stage'; e = e.offsetParent) { l += e.offsetLeft; t += e.offsetTop; }
  b = { l, t, w: el.offsetWidth, h: el.offsetHeight }; boxCache.set(el, b); return b;
}
function tf(el, o = {}) {
  if (el.classList && el.classList.contains('crit') && !el.closest('.world')) {
    const b = boxOf(el);
    if (b) {
      o = { ...o };
      let sx = o.sx ?? o.s ?? 1, sy = o.sy ?? o.s ?? 1;
      const maxSx = (SZ.x1 - SZ.x0) / b.w, maxSy = (SZ.y1 - SZ.y0) / b.h;
      sx = Math.min(sx, maxSx); sy = Math.min(sy, maxSy);
      const cx = b.l + b.w / 2, cy = b.t + b.h / 2, hw = b.w * sx / 2, hh = b.h * sy / 2;
      let x = o.x || 0, y = o.y || 0;
      x = clamp(x, SZ.x0 + hw - cx, SZ.x1 - hw - cx); y = clamp(y, SZ.y0 + hh - cy, SZ.y1 - hh - cy);
      o.x = x; o.y = y; delete o.s; o.sx = sx; o.sy = sy;
    }
  }
  NSP.tf(el, o);
}
const { COL, LOOKS, LEAVER, DOOR, avatar, avatarGrid, classroom, seatOf, blinkAt, student } = STUDENTS;
const M = window.MATH, B = window.BEATS, T = window.TL;
const S = k => T[k][0], D = k => T[k][1];
const FPS = T.fps, snap = x => Math.round(x * FPS) / FPS;   // countdown/answer boundaries sit exactly on the frame grid (render time = frame / fps)
const H0 = S('hook'), ST0 = S('story'), KN0 = S('know'), EX0 = S('expl'), QS = S('quiz'), CD = snap(S('cd')), AN = snap(S('ans')), PR = S('promo'), END = T.end;
const CDD = D('cd');

// ------------------------------------------------------------------ helpers
const add = (parent, html) => { const e = h(html); parent.appendChild(e); return e; };
const L = (u, a, b = 1e9, o = {}) => life(u, a, b, { from: .5, dy: 40, d: .5, out: .25, ...o });
const pulse = (u, at, d = .6, k = .12) => 1 + k * Math.sin(Math.PI * clamp((u - at) / d));
const show = (e, l, extra = {}) => tf(e, { ...l, ...extra });
const hideAll = (...els) => els.forEach(e => tf(e, { o: 0 }));
const fitted = new WeakSet();
function fit(e, maxW) {   // shrink a single-line element once so it never exceeds maxW (measured after fonts load)
  if (fitted.has(e)) return; fitted.add(e);
  const w = e.scrollWidth; if (w > maxW) e.style.fontSize = (parseFloat(getComputedStyle(e).fontSize) * maxW / w) + 'px';
}
const CHECK = (c = '#fff', s = 40) => ICON.check(c, s);
const CROSS = (c = '#fff', s = 40) => ICON.cross(c, s);
const QMARK = (s = 140, c = COL.pink) => `<div style="width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FFE58A,${COL.yellow} 70%);box-shadow:0 0 0 ${s * .06}px #fff,0 0 ${s * .35}px rgba(255,210,63,.8);display:grid;place-items:center;font-weight:800;font-size:${s * .7}px;color:${COL.navy};line-height:1;padding-bottom:${s * .06}px">?</div>`;
const UP = (c = COL.green, s = 60) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21V6M5 12l7-7 7 7" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const PAPER = (s = 40) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="5" y="3" width="14" height="18" rx="2.5" fill="#fff" stroke="${COL.blue}" stroke-width="2"/><path d="M8 8h8M8 12h8M8 16h5" stroke="${COL.light}" stroke-width="2" stroke-linecap="round"/></svg>`;
const CLOCK = (s = 40) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#fff" stroke="${COL.navy}" stroke-width="2.4"/><path d="M12 7v5l3.5 2" stroke="${COL.blue}" stroke-width="2.4" fill="none" stroke-linecap="round"/></svg>`;
const REW = (s = 60) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M11 6L3 12l8 6zM21 6l-8 6 8 6z" fill="#fff"/></svg>`;
const MAS = (img, hgt) => `<div class="mas"><img src="../../shared/brand/${img}" style="height:${hgt}px"></div>`;
const camKeys = (u, keys) => {   // [t, cx, cy, z, dur]
  let i = 0; while (i < keys.length - 1 && keys[i + 1][0] <= u) i++;
  const k = keys[i], pv = keys[Math.max(0, i - 1)], e = k[4] > 0 && i > 0 ? E.inOut(P(u, k[0], k[4])) : 1, f = k[4] > 0 && i > 0 ? pv : k;
  return [lerp(f[1], k[1], e), lerp(f[2], k[2], e), lerp(f[3], k[3], e)];
};

// ======================================================================
// SCENE 1 — HOOK + STORY (classroom)
// ======================================================================
const s1 = $('s1');
const room = classroom(add(s1, `<div class="abs" style="inset:0;overflow:hidden"></div>`));
const kids = room.kids, LK = kids[LEAVER];
const dim = add(s1, `<div class="fx" style="inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(20,43,83,0) 22%,rgba(20,43,83,.72) 75%);opacity:0"></div>`);
const rew = add(s1, `<div class="fx" style="inset:0;background:repeating-linear-gradient(0deg,rgba(47,107,255,.10) 0 6px,rgba(255,255,255,0) 6px 14px);opacity:0"></div>`);
const rewTag = add(s1, `<div class="pill2 p-navy c" style="left:240px;width:600px;top:1300px;font-size:40px">${REW(48)}ย้อนกลับ…</div>`);
const dash = DASH.build(s1, { left: 240, top: 368, w: 600 });
const qBig = add(s1, `<div class="fx c" style="left:0;top:0">${QMARK(150)}</div>`);
const flash = add(s1, `<div class="fx" style="inset:0;background:#fff;opacity:0"></div>`);

// --- cover (frame zero) ---
const cover = add(s1, `<div class="fx" style="inset:0"></div>`);
add(cover, `<div class="fx" style="inset:0;background:linear-gradient(165deg,#E6F4FF 0%,#D3E7FF 45%,#B9D6FA 100%)"><div class="fx" style="inset:0;background-image:radial-gradient(rgba(47,107,255,.16) 2.4px,transparent 2.6px);background-size:46px 46px"></div>
  ${[['+', 90, 330, -12], ['×', 930, 420, 10], ['÷', 110, 1500, 8], ['−', 960, 1560, -8], ['x̄', 900, 1720, 0], ['=', 140, 1760, 6]].map(([c, x, y, r]) => `<div class="fx" style="left:${x - 50}px;top:${y - 50}px;width:100px;height:100px;border-radius:30px;background:rgba(255,255,255,.75);box-shadow:0 10px 24px rgba(20,43,83,.12);display:grid;place-items:center;font-weight:800;font-size:58px;color:#2F6BFF;transform:rotate(${r}deg)">${c}</div>`).join('')}</div>`);
const cvTitle = add(cover, `<div class="pill2 p-blue crit c" style="left:240px;width:600px;top:362px;font-size:62px;padding:10px 20px 14px">เตรียมสอบนายสิบ</div>`);
const cvSub = add(cover, `<div class="pill2 p-ice crit c" style="left:240px;width:600px;top:478px;font-size:32px;padding:6px 12px 9px">คณิตศาสตร์ · ค่าเฉลี่ยเลขคณิต</div>`);
const cvBoard = add(cover, `<div class="cardN crit c" style="left:240px;top:572px;width:600px;height:380px">
   <div class="g" style="position:absolute;left:30px;top:60px"></div>
   <div style="position:absolute;left:350px;top:44px;width:230px;text-align:center;font-weight:700;font-size:36px;color:#95BFEF;line-height:1.4">เฉลี่ย</div>
   <div class="v70" style="position:absolute;left:350px;top:92px;width:230px;text-align:center;font-weight:800;font-size:150px;color:#FFD23F;line-height:1.15">${M.avg1}</div>
   <div style="position:absolute;left:350px;top:276px;width:230px;text-align:center;font-weight:700;font-size:36px;color:#E6F4FF;line-height:1.4">คะแนน</div></div>`);
const cvGrid = avatarGrid(66, 12); cvBoard.querySelector('.g').appendChild(cvGrid.el);
const cvQ = add(cover, `<div class="fx c" style="left:716px;top:500px">${QMARK(124)}</div>`);
const cvH = [`นักเรียน ${M.n1} คน`, `เฉลี่ย ${M.avg1} คะแนน`, `ออกไป ${M.left} คน...`].map((t, i) => add(cover,
  `<div class="crit c mathbig" style="position:absolute;left:230px;width:620px;top:${990 + i * 128}px;text-align:center;font-size:76px;color:${['#142B53', '#2F6BFF', '#EE7FAA'][i]};text-shadow:0 5px 0 #fff,0 -3px 0 #fff,4px 0 0 #fff,-4px 0 0 #fff">${t}</div>`));

// --- hook overlays ---
const hDrop = add(s1, `<div class="pill2 p-red crit c" style="left:290px;width:500px;top:624px;font-size:38px">${DASH.ARROW_DN('#fff', 40)}เฉลี่ยลดลง ${M.avg1 - M.avg2} คะแนน</div>`);
const hCap = add(s1, `<div class="pill2 p-navy crit c" style="left:240px;width:600px;top:1176px;font-size:50px">คนที่ออกไปได้กี่คะแนน?</div>`);
const hEq = add(s1, `<div class="pill2 p-ice crit c" style="left:250px;width:580px;top:1290px;font-size:40px">คะแนนของคนที่ออกไป = <span style="color:#EE7FAA;font-size:54px">?</span></div>`);
const hCare = add(s1, `<div class="pill2 p-red crit c" style="left:380px;width:320px;top:640px;font-size:46px">ระวังนะ!</div>`);
const hWarn = add(s1, `<div class="cardB crit c" style="left:236px;top:760px;width:608px;height:420px">
  <div class="w1" style="position:absolute;left:30px;top:34px;right:30px;display:flex;align-items:center;gap:18px">
    <div style="width:72px;height:72px;flex:none;border-radius:50%;background:#EF4444;display:grid;place-items:center">${CROSS('#fff', 44)}</div>
    <div><div style="font-weight:800;font-size:40px;line-height:1.35;color:#142B53">ไม่ได้ให้หาค่าเฉลี่ย</div>
    <div style="font-weight:700;font-size:30px;line-height:1.35;color:#EF4444">ไม่ใช่แค่ ${M.avg1} − ${M.avg2}</div></div></div>
  <div style="position:absolute;left:30px;right:30px;top:198px;height:4px;border-radius:2px;background:#DCEBFF"></div>
  <div class="w2" style="position:absolute;left:30px;top:232px;right:30px;display:flex;align-items:center;gap:18px">
    <div style="width:72px;height:72px;flex:none;border-radius:50%;background:#22C55E;display:grid;place-items:center">${CHECK('#fff', 44)}</div>
    <div><div style="font-weight:800;font-size:40px;line-height:1.35;color:#142B53">ย้อนหาคะแนน</div>
    <div style="font-weight:800;font-size:40px;line-height:1.35;color:#2F6BFF">ของคนที่หายไป</div></div></div></div>`);
const hTech = add(s1, `<div class="pill2 p-blue crit c" style="left:290px;width:500px;top:1240px;font-size:46px">มาดูเทคนิคกัน!</div>`);

// --- story overlays ---
const sChip = ['สมมุติว่า...', 'เพิ่งสอบเสร็จ!', 'ต่อมา...', 'ย้ายออกจากกลุ่ม 1 คน', 'คำนวณค่าเฉลี่ยใหม่...', `เฉลี่ยลดลง ${M.avg1 - M.avg2} คะแนน`]
  .map((t, i) => add(s1, `<div class="pill2 ${['p-navy', 'p-ice', 'p-ice', 'p-pink', 'p-cyan', 'p-red'][i]} crit c" style="left:240px;width:600px;top:${i < 2 ? 380 : 624}px;font-size:${i < 2 ? 50 : 38}px">${[REW(44), PAPER(46), CLOCK(40), '', '', DASH.ARROW_DN('#fff', 40)][i]}${t}</div>`));
const teacher = add(s1, MAS('mascot_presenter.png', 560)); teacher.style.left = '-10px'; teacher.style.top = '1010px';
const tTag = add(s1, `<div class="pill2 p-navy c" style="left:40px;width:220px;top:1520px;font-size:30px;padding:6px 14px 8px">คุณครู</div>`);
const flyP = [...Array(12)].map(() => add(s1, `<div class="fx" style="left:0;top:0">${PAPER(44)}</div>`));
const gauge = add(s1, `<div class="fx crit" style="left:232px;top:780px;width:200px;height:380px">
   <div style="position:absolute;left:84px;top:20px;width:30px;height:330px;border-radius:15px;background:rgba(230,244,255,.9);box-shadow:0 0 0 4px #fff,0 10px 20px rgba(20,43,83,.3)"></div>
   <div class="gfill" style="position:absolute;left:88px;bottom:34px;width:22px;height:0;border-radius:11px;background:linear-gradient(0deg,#2F6BFF,#22D3EE)"></div>
   <div style="position:absolute;left:52px;top:236px;width:96px;height:0;border-top:5px dashed #FFD23F"></div>
   <div class="g70" style="position:absolute;left:0;top:254px;width:200px;text-align:center;font-weight:800;font-size:26px;line-height:1.35;color:#142B53;background:#FFD23F;border-radius:16px;padding:2px 0 4px">ค่าเฉลี่ยเดิม ${M.avg1}</div>
   <div class="garr" style="position:absolute;left:69px;top:120px">${UP('#22C55E', 60)}</div>
   <div class="gq" style="position:absolute;left:54px;top:-46px">${QMARK(90)}</div></div>`);
const sHigh = add(s1, `<div class="pill2 p-green crit c" style="left:240px;width:600px;top:1186px;font-size:42px">${UP('#fff', 44)}สูงกว่าค่าเฉลี่ยเดิม!</div>`);
const sHow = add(s1, `<div class="pill2 p-yellow crit c" style="left:330px;width:420px;top:1296px;font-size:44px">แต่สูงแค่ไหน?</div>`);
const sNext = add(s1, `<div class="cardN crit c ctr" style="left:240px;top:1176px;width:600px;height:200px;flex-direction:column;gap:2px">
   <div style="font-weight:800;font-size:46px;line-height:1.35">จะหาคะแนนที่หายไป</div><div style="font-weight:800;font-size:46px;line-height:1.35;color:#FFD23F">ได้อย่างไร?</div></div>`);

// --- leaver path (seat -> aisle -> door) ---
const SEAT = seatOf(LEAVER), STAND_Y = SEAT.y + 100 * SEAT.s;
const PATH = [[SEAT.x, STAND_Y, SEAT.s], [852, STAND_Y, SEAT.s], [DOOR.x, DOOR.floor, DOOR.s]];
const segLen = [Math.hypot(PATH[1][0] - PATH[0][0], PATH[1][1] - PATH[0][1]), Math.hypot(PATH[2][0] - PATH[1][0], PATH[2][1] - PATH[1][1])];
const TOT = segLen[0] + segLen[1];
function pathAt(p) {
  const d = clamp(p) * TOT;
  const [a, b, f] = d <= segLen[0] ? [PATH[0], PATH[1], d / segLen[0]] : [PATH[1], PATH[2], (d - segLen[0]) / segLen[1]];
  return { x: lerp(a[0], b[0], f), y: lerp(a[1], b[1], f), s: lerp(a[2], b[2], f), d };
}
// departure: stand at a, walk from w0 to w1 ; returns state at u
function departure(u, a, w0, w1) {
  const sit = 1 - E.inOut(P(u, a, w0 - a));
  const p = E.inOut(P(u, w0, w1 - w0));
  const walking = u > w0 && u < w1;
  return { sit, p, walking, ...pathAt(p) };
}
const STEP_EVERY = 0.3;
function stepSfx(t0, t1, g = .5) { for (let t = t0 + .1; t < t1; t += STEP_EVERY) sfx('step', t, g); }

// hook timing
const hk = B.hook, HK = { cover: 2.9, stand: 7.0, w0: 7.45, w1: 9.35, cross: 8.12, drop: 10.85, cam: 12.81 };
// story timing
const st = B.story, SK = { rw0: .35, rw1: 1.55, sit: 1.85, stand: 9.8, w0: 10.25, w1: 12.15, cross: 10.95, drop: 15.85, cam: 17.98 };
const crossAt = (w0, w1) => { // time at which the walker crosses the group boundary (x = 864)
  for (let u = w0; u < w1; u += 1 / 60) if (pathAt(E.inOut(P(u, w0, w1 - w0))).x >= 864) return u; return w1; };
HK.cross = crossAt(HK.w0, HK.w1); SK.cross = crossAt(SK.w0, SK.w1);

// sfx: hook
sfx('pop', .14, .5); sfx('sparkle', 1.4, .5); sfx('whoosh', HK.cover - .05, .8);
for (let i = 0; i < 12; i++) sfx('pop', hk.twelve + .1 + i * .085, .25);
sfx('ding', hk.avg70 + .05, .6); sfx('pop', hk.leave + .05, .7); sfx('cloth', HK.stand, .8); stepSfx(HK.w0, HK.w1, .55);
sfx('digit', HK.cross + .05, .9); sfx('digit', HK.drop, .9); sfx('drop', HK.drop + .2, .7); sfx('pop', HK.drop + .45, .6);
sfx('whoosh', HK.cam, .7); sfx('pop', hk.who + .05, .9); sfx('pop', hk.howMany + .05, .7); sfx('pop', hk.howMany + .35, .5);
sfx('stamp', hk.careful + .05, .7); sfx('drop', hk.notAvg + .1, .6); sfx('success', hk.backSolve + .1, .7); sfx('sparkle', hk.tech + .1, .6);
// sfx: story
sfx('rewind', ST0 + SK.rw0, .9); sfx('pop', ST0 + st.suppose + .1, .5);
for (let i = 0; i < 12; i++) sfx('pop', ST0 + st.exam + .1 + i * .06, .25);
sfx('whoosh', ST0 + st.teacher, .6); for (let i = 0; i < 4; i++) sfx('page', ST0 + st.teacher + .5 + i * .18, .5);
sfx('riser', ST0 + st.teacher + .9, .35); sfx('digit', ST0 + st.got70 + .05, .9); sfx('ding', ST0 + st.got70 + .15, .6);
sfx('tick', ST0 + st.later + .1, .4); sfx('tick', ST0 + st.later + .45, .4); sfx('pop', ST0 + st.moveOut + .05, .7);
sfx('cloth', ST0 + SK.stand, .8); stepSfx(ST0 + SK.w0, ST0 + SK.w1, .55); sfx('digit', ST0 + SK.cross + .05, .9);
sfx('riser', ST0 + st.recalc + .1, .3); sfx('digit', ST0 + SK.drop, .9); sfx('drop', ST0 + SK.drop + .2, .7);
sfx('whoosh', ST0 + SK.cam, .7); sfx('riser', ST0 + st.higher - .2, .35); sfx('pop', ST0 + st.higher + .6, .7); sfx('pop', ST0 + st.howHigh + .05, .7); sfx('whoosh', ST0 + st.must, .6);
sfx('room', 2.9, 1); sfx('room', ST0 + .2, 1);

function poseKid(k, u, extra = {}) {
  k.pose({ blink: blinkAt(u, k.i), tilt: Math.sin(u * 1.3 + k.i) * 3, lookX: Math.sin(u * .5 + k.i * 1.7) * .3, ...extra });
}
function drawClass(t, u, cam, story) {
  room.camera(cam[0], cam[1], cam[2]);
  room.clock.querySelector('.cm').setAttribute('transform', `rotate(${t * 30})`);
  room.clock.querySelector('.ch').setAttribute('transform', `rotate(${t * 2.5})`);
  kids.forEach(k => { if (k.i !== LEAVER) { room.place(k, { sit: 1 }); poseKid(k, t, { legs: 0 }); k.ring.style.opacity = 0; } });
}
function drawCover(t) {
  const out = E.in(P(t, HK.cover, .55));
  cover.style.opacity = 1 - out; cover.style.display = out >= 1 ? 'none' : 'block';
  cover.style.transform = `scale(${1 - .12 * out})`; cover.style.transformOrigin = '540px 900px';
  tf(cvTitle, { s: pulse(t, hk.title, .5, .06), y: bob(t, 0, 4) });
  tf(cvSub, { s: pulse(t, hk.subject, .6, .1) });
  tf(cvBoard, { y: bob(t, 1, 5, 1.3) });
  tf(cvQ, { r: Math.sin(t * 2.2) * 10, y: bob(t, 2, 10, 2.4), s: 1 + .06 * Math.sin(t * 3) });
  cvH.forEach((e, i) => tf(e, { y: bob(t, i, 4, 1.8), s: i === 2 ? 1 + .04 * Math.sin(t * 4) : 1 }));
  cvGrid.cells.forEach((c, i) => tf(c.face, { y: bob(t, i * .7, 3, 2.2) }));
}
function drawHook(t) {
  const u = t;
  drawCover(t);
  const roomIn = E.out(P(u, HK.cover, .7));
  let cam = camKeys(u, [[0, 540, 960, 1.25, 0], [HK.cover, 540, 960, 1, .7], [HK.w0, 600, 960, 1.04, 1.9], [HK.cam, DOOR.x, 830, 1.9, 1.0]]);
  drawClass(t, u, cam, false);
  // leaver
  const dp = departure(u, HK.stand, HK.w0, HK.w1);
  room.place(LK, { x: dp.x, y: dp.sit > 0 ? STAND_Y + 20 * SEAT.s * dp.sit : dp.y, s: dp.s });
  const turned = u > HK.w1 + .2;
  LK.pose({ blink: blinkAt(u, 7), legs: clamp(1 - dp.sit * 2), walk: dp.d * .085, walkAmt: dp.walking ? 1 : 0, expr: u > hk.leave ? (turned ? 'flat' : 'o') : 'smile',
    lookX: dp.walking ? .9 : turned ? 0 : .2, armL: 8, armR: -8, tilt: turned ? -4 : 0 });
  LK.ring.style.opacity = clamp((u - hk.leave) * 4) * (1 - P(u, HK.stand + .2, .3));
  const sil = E.inOut(P(u, HK.cam + .2, .8));
  LK.el.style.filter = sil > 0 ? `brightness(${1 - .88 * sil}) saturate(${1 - sil}) drop-shadow(0 0 ${10 * sil}px rgba(238,127,170,${sil})) drop-shadow(0 0 ${3 * sil}px rgba(238,127,170,${sil}))` : '';
  // group box: ripple on "12 คน", pulse on "remaining"
  room.groupBox.style.opacity = roomIn * (.55 + .45 * Math.max(Math.sin(Math.PI * clamp((u - hk.twelve) / 1.2)), Math.sin(Math.PI * clamp((u - hk.rest) / 1.4))));
  kids.forEach(k => { if (k.i === LEAVER) return; const r = P(u, hk.twelve + .1 + k.i * .085, .35); k.ring.style.opacity = Math.sin(Math.PI * r) * .9; k.ring.style.borderColor = COL.cyan; k.ring.style.boxShadow = `0 0 24px ${COL.cyan}`; });
  // dashboard
  const cP = P(u, HK.cross, .3), aP = P(u, HK.drop, .35);
  tf(dash.el, { o: roomIn, s: lerp(.85, 1, E.back(P(u, HK.cover + .1, .6))) * pulse(u, HK.cross, .5, .05) });
  dash.draw({ count: [M.n1, M.n2, cP], avg: [M.avg1, M.avg2, aP], hiC: Math.sin(Math.PI * clamp((u - hk.twelve) / 1.3)) + Math.sin(Math.PI * clamp((u - HK.cross) / 1)) * 1,
    hiA: Math.sin(Math.PI * clamp((u - hk.avg70) / 1.3)) + Math.sin(Math.PI * clamp((u - hk.rest) / 1.5)), drop: E.out(P(u, HK.drop + .2, .4)), warn: Math.sin(Math.PI * clamp((u - HK.drop) / 1.6)) * .8, pipOut: E.inOut(cP) });
  show(hDrop, L(u, HK.drop + .45, HK.cam, { from: .4, el: true, d: .7 }));
  // focus on the student who left
  dim.style.opacity = E.inOut(P(u, HK.cam + .3, .8)) * .85 + E.inOut(P(u, hk.careful, .5)) * .1;
  const head = room.w2s(cam, LK.wrap ? dp.x : 0, dp.y - 250 * dp.s);
  const ql = L(u, hk.who, 1e9, { from: .2, dy: 0, el: true, d: .8 });
  tf(qBig, { ...ql, x: head[0] - 75, y: head[1] - 170 + bob(u, 0, 10, 2.5) - (1 - ql.o) * 0, r: Math.sin(u * 2) * 8, o: ql.o * (1 - P(u, hk.notAvg, .3) * .6) });
  show(hCap, L(u, hk.howMany, hk.careful, { el: true, d: .7 }));
  show(hEq, L(u, hk.howMany + .35, hk.careful, { el: true, d: .7 }));
  show(hCare, { ...L(u, hk.careful, hk.tech, { from: 2, dy: 0, d: .35 }), r: Math.sin(u * 20) * 3 * (1 - P(u, hk.careful + .3, .4)) });
  const wl = L(u, hk.notAvg, 1e9, { from: .6, dy: 60, d: .6 });
  show(hWarn, wl);
  tf(hWarn.querySelector('.w1'), L(u, hk.notAvg + .05, 1e9, { from: .6, dy: 20 }));
  tf(hWarn.querySelector('.w2'), L(u, hk.backSolve, 1e9, { from: .5, dy: 20, el: true, d: .7 }));
  show(hTech, L(u, hk.tech, 1e9, { el: true, d: .7 }));
  hideAll(rew, rewTag, ...sChip, teacher, tTag, gauge, sHigh, sHow, sNext, ...flyP);
  flash.style.opacity = Math.max(clamp(1 - Math.abs(u - HK.cover - .1) / .12) * .5, clamp(1 - Math.abs(u - HK.cam - .5) / .1) * .25);
}
function drawStory(t) {
  const u = t - ST0;
  cover.style.display = 'none';
  const cam = camKeys(u, [[0, 486, 1080, .82, 0], [SK.cam, DOOR.x, 830, 1.9, 1.0]]);
  drawClass(t, u, cam, true);
  // papers on desks after the exam, collected by the teacher
  kids.forEach((k, i) => { const on = P(u, st.exam + .1 + i * .06, .3), off = P(u, st.teacher + .5 + i * .05, .15); k.paper.style.opacity = on * (1 - off); k.paper.style.transform = `skewX(-12deg) scale(${.5 + .5 * E.back(on)})`; });
  flyP.forEach((f, i) => {
    const k = kids[i], a = room.w2s(cam, k.seat.x, k.seat.y - 20 * k.seat.s), b = [250, 1180], p = P(u, st.teacher + .5 + i * .05, .7);
    if (p <= 0 || p >= 1) { tf(f, { o: 0 }); return; }
    const e = E.inOut(p); tf(f, { x: lerp(a[0], b[0], e) - 22, y: lerp(a[1], b[1], e) - 22 - Math.sin(e * Math.PI) * 120, r: e * 200, s: .7 + .3 * Math.sin(e * Math.PI), o: 1 });
  });
  // leaver: rewind back to the seat, then the story's departure
  let x, y, s, sit = 1, walking = false, walk = 0, lookX = 0, expr = 'smile';
  if (u < SK.sit) {
    const p = 1 - E.inOut(P(u, SK.rw0, SK.rw1 - SK.rw0)), pa = pathAt(p);
    sit = E.inOut(P(u, SK.rw1, SK.sit - SK.rw1)); x = pa.x; y = sit > 0 ? STAND_Y + 20 * SEAT.s * sit : pa.y; s = pa.s;
    walking = u > SK.rw0 && u < SK.rw1; walk = -pa.d * .085; lookX = walking ? .9 : 0;
  } else {
    const dp = departure(u, SK.stand, SK.w0, SK.w1);
    sit = dp.sit; x = dp.x; y = sit > 0 ? STAND_Y + 20 * SEAT.s * sit : dp.y; s = dp.s; walking = dp.walking; walk = dp.d * .085;
    lookX = walking ? .9 : u > SK.w1 ? 0 : .2; expr = u > st.moveOut ? (u > SK.w1 ? 'flat' : 'o') : u > st.exam ? 'grin' : 'smile';
  }
  room.place(LK, { x, y, s });
  LK.pose({ blink: blinkAt(u, 7), legs: clamp(1 - sit * 2), walk, walkAmt: walking ? 1 : 0, expr, lookX, armL: 8, armR: -8 });
  LK.ring.style.opacity = clamp((u - st.moveOut) * 4) * (1 - P(u, SK.stand + .2, .3));
  const sil = E.inOut(P(u, SK.cam + .2, .8));
  LK.el.style.filter = sil > 0 ? `brightness(${1 - .88 * sil}) saturate(${1 - sil}) drop-shadow(0 0 ${10 * sil}px rgba(238,127,170,${sil})) drop-shadow(0 0 ${3 * sil}px rgba(238,127,170,${sil}))` : '';
  kids.forEach(k => { if (k.i === LEAVER) return; const glow = Math.sin(Math.PI * clamp((u - st.eleven) / 1.4)); k.ring.style.opacity = glow * .9; k.ring.style.borderColor = COL.cyan; k.ring.style.boxShadow = `0 0 24px ${COL.cyan}`; });
  room.groupBox.style.opacity = .55 + .45 * Math.sin(Math.PI * clamp((u - st.eleven) / 1.4));
  // rewind fx
  const rw = Math.sin(Math.PI * clamp((u - SK.rw0 + .1) / (SK.rw1 - SK.rw0 + .3)));
  rew.style.opacity = rw; rew.style.backgroundPosition = `0 ${u * 400}px`;
  show(rewTag, { o: rw, s: 1 });
  // chips
  show(sChip[0], L(u, st.suppose, st.exam - .05, { from: .5, el: true, d: .7 }));
  show(sChip[1], L(u, st.exam, st.teacher + .6, { from: .5, el: true, d: .7 }));
  show(sChip[2], L(u, st.later, st.moveOut - .05));
  show(sChip[3], L(u, st.moveOut, st.recalc - .05));
  show(sChip[4], L(u, st.recalc, SK.drop + .2));
  show(sChip[5], L(u, SK.drop + .45, SK.cam, { el: true, d: .7 }));
  // teacher
  const tl = L(u, st.teacher, SK.cam, { from: .9, dy: 0, d: .6, out: .4 });
  const tx = (1 - E.out(P(u, st.teacher, .6))) * -320 - E.in(P(u, SK.cam, .5)) * 320;
  const point = E.inOut(P(u, st.got70 - .2, .4)) * (1 - E.inOut(P(u, st.later, .4)));
  tf(teacher, { o: tl.o, x: tx, y: bob(u, 0, 5), r: -6 * point + Math.sin(u * 1.4) * 1.2, s: 1 + .03 * point });
  tf(tTag, { o: tl.o * clamp((u - st.teacher - .5) * 3), x: tx });
  // dashboard (appears when the teacher computes)
  const dIn = E.out(P(u, st.teacher + .8, .5)) * (1 - E.in(P(u, SK.cam + .2, .5)) * 0);
  const cP = P(u, SK.cross, .3), aP = P(u, SK.drop, .35);
  tf(dash.el, { o: dIn, s: lerp(.85, 1, E.back(P(u, st.teacher + .8, .6))) * pulse(u, st.got70, .6, .06) });
  dash.draw({ count: [M.n1, M.n2, cP], avg: u < st.got70 ? ['--', M.avg1, P(u, st.got70, .35)] : [M.avg1, M.avg2, aP],
    hiC: Math.sin(Math.PI * clamp((u - SK.cross) / 1)) + Math.sin(Math.PI * clamp((u - st.eleven) / 1.4)),
    hiA: Math.sin(Math.PI * clamp((u - st.got70) / 1.3)) + Math.sin(Math.PI * clamp((u - SK.drop) / 1.4)),
    scan: u < st.got70 ? ((u - st.teacher - .9) / 1.2) % 1 * (u > st.teacher + .9 ? 1 : -1) : u > st.recalc && u < SK.drop ? ((u - st.recalc) / 1.1) % 1 : -1,
    drop: E.out(P(u, SK.drop + .2, .4)), warn: Math.sin(Math.PI * clamp((u - SK.drop) / 1.6)) * .8, pipOut: E.inOut(cP) });
  // focus: higher than the old average
  dim.style.opacity = E.inOut(P(u, SK.cam + .3, .8)) * .85;
  const head = room.w2s(cam, x, y - 250 * s);
  const ql = L(u, st.higher, 1e9, { from: .2, dy: 0, el: true, d: .8 });
  tf(qBig, { ...ql, x: head[0] - 75, y: head[1] - 170 + bob(u, 0, 10, 2.5), r: Math.sin(u * 2) * 8, s: ql.s * pulse(u, st.howHigh, .7, .25) });
  const gl = L(u, st.higher - .1, 1e9, { from: .6, dy: 40 });
  show(gauge, gl);
  const gf = E.out(P(u, st.higher + .2, 1.2));
  gauge.querySelector('.gfill').style.height = (lerp(0, 290, gf)) + 'px';
  tf(gauge.querySelector('.garr'), { o: clamp((u - st.higher - .6) * 3), y: -20 * E.out(P(u, st.higher + .6, .6)) + bob(u, 0, 5, 4) });
  tf(gauge.querySelector('.gq'), { ...L(u, st.higher + .6, 1e9, { from: .2, dy: 0, el: true, d: .7 }), s: pulse(u, st.howHigh, .7, .25) });
  show(sHigh, L(u, st.higher + .5, st.must - .05, { el: true, d: .7 }));
  show(sHow, L(u, st.howHigh, st.must - .05, { el: true, d: .7 }));
  show(sNext, L(u, st.must, 1e9, { from: .6, dy: 60 }));
  hideAll(hDrop, hCap, hEq, hCare, hWarn, hTech);
  flash.style.opacity = Math.max(clamp(1 - Math.abs(u - st.got70 - .1) / .1) * .3, clamp(1 - Math.abs(u - SK.cam - .5) / .1) * .25);
}
function drawS1(t) { if (t < ST0) drawHook(t); else drawStory(t); }

// ======================================================================
// SCENE 3 — KNOWLEDGE: mean formula, reverse formula, missing-score principle
// ======================================================================
const s3 = $('s3'), kn = B.know;
const kHdr = add(s3, `<div class="pill2 p-blue crit c" style="left:250px;width:580px;top:362px;font-size:46px">ก่อนทำโจทย์ จำสูตรนี้!</div>`);
const kCard = add(s3, `<div class="cardB crit c" style="left:230px;top:470px;width:620px;height:252px"></div>`);
const kTag = add(s3, `<div class="chipT c" style="left:430px;top:448px;width:220px;justify-content:center;background:#142B53;color:#fff">สูตรค่าเฉลี่ย</div>`);
const TOK = {
  A: add(s3, `<div class="tok t-avg crit" style="width:210px">ค่าเฉลี่ย</div>`),
  EQ: add(s3, `<div class="tok t-op crit">=</div>`),
  T: add(s3, `<div class="tok t-tot crit" style="width:230px">คะแนนรวม</div>`),
  OPd: add(s3, `<div class="tok t-op crit">÷</div>`),
  OPm: add(s3, `<div class="tok t-op crit">×</div>`),
  N: add(s3, `<div class="tok t-n crit" style="width:220px">จำนวนคน</div>`),
};
const R1 = 492, R2 = 604;
const LAY1 = { A: [400, R1], EQ: [624, R1], T: [273, R2], OP: [517, R2], N: [587, R2] };
const LAY3 = { T: [390, R1], EQ: [634, R1], A: [283, R2], OP: [507, R2], N: [577, R2] };
Object.values(TOK).forEach(e => { e.style.left = '0px'; e.style.top = '0px'; });
const kMove = add(s3, `<div class="chipT c" style="left:290px;top:738px;width:500px;justify-content:center;background:#E6F4FF;color:#1E44B8;box-shadow:0 0 0 3px #95BFEF">ย้ายข้าง: ÷ กลายเป็น ×</div>`);
// diagram 1: unequal scores, average line, total container
const BARS = [180, 118, 222, 150, 204, 126], BAVG = BARS.reduce((a, b) => a + b) / BARS.length, BASE = 1110;
const dg1 = add(s3, `<div class="fx" style="inset:0"></div>`);
const kNote = add(dg1, `<div class="chipT c crit" style="left:300px;top:796px;width:480px;justify-content:center;background:#fff;color:#31445D;box-shadow:0 6px 14px rgba(20,43,83,.12)">คะแนนแต่ละคนไม่เท่ากัน</div>`);
const bars = BARS.map((v, i) => add(dg1, `<div style="position:absolute;left:${262 + i * 96}px;top:${BASE - v}px;width:66px;height:${v}px;border-radius:14px 14px 4px 4px;background:linear-gradient(180deg,${i % 2 ? '#95BFEF,#2F6BFF' : '#7DE7F7,#22B8D6'});transform-origin:50% 100%"></div>`));
const bAv = [0, 1, 2, 3, 4, 5].map(i => add(dg1, `<div style="position:absolute;left:${265 + i * 96}px;top:${BASE + 10}px">${avatar(LOOKS[[0, 1, 2, 3, 4, 9][i]], 60)}</div>`));
const avgLine = add(dg1, `<div style="position:absolute;left:246px;top:${BASE - BAVG - 3}px;width:590px;height:0;border-top:7px dashed #22D3EE;transform-origin:0 50%"></div>`);
const avgTag = add(dg1, `<div class="chipT c crit" style="left:612px;top:${BASE - BAVG - 64}px;background:#22D3EE;color:#142B53"><span class="ck" style="display:none">${CHECK('#142B53', 26)}</span>ค่าเฉลี่ย</div>`);
const nBr = add(dg1, `<div style="position:absolute;left:258px;top:${BASE + 80}px;width:564px;height:22px;border:5px solid #2F6BFF;border-top:none;border-radius:0 0 16px 16px"></div>`);
const nTag = add(dg1, `<div class="chipT c crit" style="left:430px;top:${BASE + 110}px;width:220px;justify-content:center;background:#2F6BFF;color:#fff"><span class="ck" style="display:none">${CHECK('#fff', 26)}</span>จำนวนคน</div>`);
const tank = add(dg1, `<div class="crit c" style="position:absolute;left:250px;top:1290px;width:580px;height:118px;border-radius:30px;background:#FFF8DD;box-shadow:inset 0 0 0 5px #FFD23F,0 10px 24px rgba(200,150,0,.2);overflow:hidden">
   <div class="fill" style="position:absolute;left:0;top:0;bottom:0;width:0;background:linear-gradient(90deg,#FFD23F,#FFE27A)"></div>
   <div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;gap:12px;font-weight:800;font-size:40px;color:#7A5A00;line-height:1.3">คะแนนรวม<span class="sub" style="font-size:32px;color:#142B53"></span></div></div>`);
const blocks = [...Array(18)].map((_, i) => add(dg1, `<div class="fx" style="left:0;top:0;width:34px;height:26px;border-radius:7px;background:${i % 2 ? '#2F6BFF' : '#22D3EE'};box-shadow:0 0 0 3px #fff"></div>`));
// diagram 2: missing-score principle with proportional total bars (no numbers before the countdown)
const dg2 = add(s3, `<div class="fx" style="inset:0"></div>`);
const pr = [
  add(dg2, `<div class="crit c" style="position:absolute;left:236px;top:792px;display:flex;align-items:center;gap:10px"><div class="tok t-tot" style="position:relative;width:330px;height:76px;font-size:36px">คะแนนรวมเดิม</div><div style="font-weight:700;font-size:28px;color:#31445D">(${M.n1} คน)</div></div>`),
  add(dg2, `<div class="crit c" style="position:absolute;left:236px;top:900px;display:flex;align-items:center;gap:10px"><div class="tok t-op" style="position:relative;width:40px;height:76px">−</div><div class="tok t-n" style="position:relative;width:290px;height:76px;font-size:34px">คะแนนรวมที่เหลือ</div></div>`),
  add(dg2, `<div class="crit c" style="position:absolute;left:236px;top:1040px;display:flex;align-items:center;gap:10px"><div class="tok t-op" style="position:relative;width:40px;height:76px">=</div><div class="tok t-miss" style="position:relative;width:290px;height:76px;font-size:34px">คะแนนคนที่ออกไป</div></div>`),
];
const prLine = add(dg2, `<div style="position:absolute;left:236px;top:1004px;width:340px;height:6px;border-radius:3px;background:#142B53;transform-origin:0 50%"></div>`);
const H1 = 340, H2 = H1 * M.total2 / M.total1, PB = 1180;
const pb1 = add(dg2, `<div style="position:absolute;left:640px;top:${PB - H1}px;width:96px;height:${H1}px;border-radius:16px 16px 6px 6px;background:linear-gradient(180deg,#FFE27A,#FFD23F);box-shadow:inset 0 0 0 4px #E0A800;transform-origin:50% 100%"></div>`);
const pb2 = add(dg2, `<div style="position:absolute;left:752px;top:${PB - H2}px;width:96px;height:${H2}px;border-radius:16px 16px 6px 6px;background:linear-gradient(180deg,#95BFEF,#2F6BFF);transform-origin:50% 100%"></div>`);
const pbGap = add(dg2, `<div style="position:absolute;left:752px;top:${PB - H1}px;width:96px;height:${H1 - H2}px;border-radius:12px;border:5px dashed #EE7FAA;background:rgba(238,127,170,.25)"></div>`);
const pbQ = add(dg2, `<div class="fx c" style="left:768px;top:${PB - H1 - 80}px">${QMARK(64)}</div>`);
const pbL = [add(dg2, `<div class="chipT" style="left:640px;top:${PB + 10}px;width:96px;justify-content:center;padding:4px 0;font-size:26px;background:#fff;color:#142B53">${M.n1} คน</div>`),
  add(dg2, `<div class="chipT" style="left:752px;top:${PB + 10}px;width:96px;justify-content:center;padding:4px 0;font-size:26px;background:#fff;color:#142B53">${M.n2} คน</div>`)];
const kRule = add(s3, `<div class="pill2 p-yellow crit c" style="left:236px;width:608px;top:1290px;font-size:42px;padding:16px 18px 18px">หาคะแนนรวมก่อน แล้วค่อยลบ!</div>`);
const kMas = add(s3, MAS('mascot_pose.png', 470)); kMas.style.left = '840px'; kMas.style.top = '1400px';

sfx('pop', KN0 + kn.before + .05, .6); sfx('pop', KN0 + kn.formula, .6);
sfx('pen', KN0 + kn.mean, .7); sfx('pen', KN0 + kn.eqTotal, .7); sfx('pen', KN0 + kn.divN, .7);
for (let i = 0; i < 6; i++) sfx('pop', KN0 + kn.mean + .2 + i * .1, .25);
sfx('whoosh', KN0 + 7.0, .4); sfx('success', KN0 + kn.weKnow + .2, .45); sfx('success', KN0 + kn.weKnow + 1.2, .45);
sfx('swoosh', KN0 + kn.reverse, .6); sfx('chime', KN0 + kn.reverse + .9, .6);
for (let i = 0; i < 9; i++) sfx('pop', KN0 + kn.reverse + .3 + i * .1, .2);
sfx('pop', KN0 + kn.byAvg, .5); sfx('chime', KN0 + kn.timesN, .5);
sfx('whoosh', KN0 + kn.missing, .6); sfx('pen', KN0 + kn.oldTotal, .6); sfx('sub', KN0 + kn.minusRest, .7); sfx('pop', KN0 + kn.minusRest + 1.0, .7); sfx('stamp', KN0 + kn.heart + .1, .8);

function drawS3(t) {
  const u = t - KN0;
  show(kHdr, { ...L(u, kn.before, 1e9, { el: true, d: .8 }), s: L(u, kn.before, 1e9, { el: true, d: .8 }).s * pulse(u, kn.formula, .5, .06) });
  show(kCard, L(u, kn.formula - .3, 1e9, { from: .8, dy: 30 }));
  show(kTag, L(u, kn.formula, 1e9, { el: true, d: .7 }));
  // token layout: L1 (A = T ÷ N) → L3 (T = A × N)
  const k = E.inOut(P(u, kn.reverse, 1.2));
  const pos = n => { const a = LAY1[n], b = LAY3[n]; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k) + (n === 'T' || n === 'A' ? Math.sin(k * Math.PI) * (n === 'T' ? -34 : 34) : 0)]; };
  const ap = { A: kn.mean, EQ: kn.eqTotal, T: kn.eqTotal + .15, OP: kn.divN, N: kn.divN + .15 };
  ['A', 'EQ', 'T', 'N'].forEach(n => {
    const [x, y] = pos(n), l = L(u, ap[n], 1e9, { from: .3, dy: 30, el: true, d: .7 });
    let s = l.s;
    if (n === 'A') s *= pulse(u, kn.byAvg, .6, .14) * pulse(u, kn.weKnow, .6, .1);
    if (n === 'N') s *= pulse(u, kn.timesN + .2, .6, .14) * pulse(u, kn.weKnow + .9, .6, .1);
    if (n === 'T') s *= pulse(u, kn.reverse + 1.2, .6, .14);
    tf(TOK[n], { x, y: y + l.y, s, o: l.o });
  });
  const [ox, oy] = pos('OP'), lo = L(u, ap.OP, 1e9, { from: .3, dy: 30, el: true, d: .7 });
  const sw = E.inOut(P(u, kn.reverse + .3, .7));
  tf(TOK.OPd, { x: ox, y: oy + lo.y, s: lo.s, o: lo.o * (1 - sw), r: sw * 135 });
  tf(TOK.OPm, { x: ox, y: oy + lo.y, s: lo.s * pulse(u, kn.timesN, .6, .2), o: lo.o * sw, r: (1 - sw) * -135 });
  show(kMove, L(u, kn.reverse + .2, kn.missing - .1, { from: .5, dy: 20 }));
  // diagram 1
  const d1o = 1 - E.in(P(u, kn.missing - .1, .5));
  dg1.style.opacity = d1o; dg1.style.display = d1o > 0 ? 'block' : 'none';
  if (d1o > 0) {
    const pour = P(u, kn.reverse + .3, 1.2);
    bars.forEach((b, i) => { const g = E.back(P(u, kn.mean + .2 + i * .1, .5)); tf(b, { sy: g * (1 - E.inOut(clamp(pour * 1.15 - i * .03))) * 1, sx: 1, o: clamp(g * 3) });
      b.style.boxShadow = Math.sin(Math.PI * clamp((u - kn.eqTotal) / 1.4)) > 0 ? `0 0 0 ${5 * Math.sin(Math.PI * clamp((u - kn.eqTotal) / 1.4))}px #FFD23F` : ''; });
    bAv.forEach((a, i) => tf(a, { ...L(u, kn.mean + .1 + i * .08, 1e9, { from: .3, dy: 20 }), y: bob(u, i, 3, 2) }));
    show(kNote, L(u, kn.mean + .8, 1e9, { from: .5, dy: 20 }));
    tf(avgLine, { sx: E.out(P(u, kn.divN + .5, .8)), o: clamp((u - kn.divN - .5) * 4) });
    show(avgTag, { ...L(u, kn.divN + 1.0, 1e9, { el: true, d: .6 }), s: L(u, kn.divN + 1.0, 1e9, { el: true, d: .6 }).s * pulse(u, kn.weKnow, .6, .2) });
    avgTag.querySelector('.ck').style.display = u > kn.weKnow ? 'inline-block' : 'none';
    tf(nBr, { o: clamp((u - kn.divN) * 3), sy: 1 });
    show(nTag, { ...L(u, kn.divN + .1, 1e9, { el: true, d: .6 }), s: L(u, kn.divN + .1, 1e9, { el: true, d: .6 }).s * pulse(u, kn.weKnow + 1.0, .6, .2) });
    nTag.querySelector('.ck').style.display = u > kn.weKnow + 1.0 ? 'inline-block' : 'none';
    show(tank, { ...L(u, kn.but, 1e9, { from: .6, dy: 30 }), s: L(u, kn.but, 1e9, { from: .6, dy: 30 }).s * pulse(u, kn.reverse + 1.5, .6, .06) });
    tank.querySelector('.fill').style.width = (E.out(P(u, kn.reverse + .5, 1.4)) * 100) + '%';
    tank.querySelector('.sub').textContent = u > kn.byAvg ? (u > kn.timesN ? '= ค่าเฉลี่ย × จำนวนคน' : '= ค่าเฉลี่ย ×') : u > kn.reverse + 1.5 ? '' : (u > kn.but ? '= ?' : '');
    blocks.forEach((b, i) => {
      const col = i % 6, p = P(u, kn.reverse + .3 + i * .05, .8);
      if (p <= 0 || p >= 1) { tf(b, { o: 0 }); return; }
      const e = E.inOut(p), x0 = 278 + col * 96, y0 = BASE - BARS[col] * (1 - Math.floor(i / 6) * .3), x1 = 300 + i * 26, y1 = 1330;
      tf(b, { x: lerp(x0, x1, e), y: lerp(y0, y1, e) - Math.sin(e * Math.PI) * 140, r: e * 180, o: 1, s: 1 - .3 * e });
    });
  }
  // diagram 2
  const d2 = E.out(P(u, kn.missing, .5));
  dg2.style.opacity = d2; dg2.style.display = d2 > 0 ? 'block' : 'none';
  if (d2 > 0) {
    show(pr[0], { ...L(u, kn.oldTotal, 1e9, { el: true, d: .7 }), s: L(u, kn.oldTotal, 1e9, { el: true, d: .7 }).s });
    show(pr[1], L(u, kn.minusRest, 1e9, { el: true, d: .7 }));
    tf(prLine, { sx: E.out(P(u, kn.minusRest + .7, .4)), o: clamp((u - kn.minusRest - .7) * 4) });
    show(pr[2], { ...L(u, kn.minusRest + 1.0, 1e9, { el: true, d: .7 }), s: L(u, kn.minusRest + 1.0, 1e9, { el: true, d: .7 }).s * pulse(u, kn.heart, .7, .1) });
    tf(pb1, { sy: E.back(P(u, kn.oldTotal + .2, .7)), o: clamp((u - kn.oldTotal - .2) * 4) });
    tf(pb2, { sy: E.back(P(u, kn.minusRest + .2, .7)), o: clamp((u - kn.minusRest - .2) * 4) });
    pbL.forEach((e, i) => tf(e, L(u, [kn.oldTotal, kn.minusRest][i] + .3, 1e9, { from: .5, dy: 10 })));
    tf(pbGap, { o: clamp((u - kn.minusRest - 1.0) * 3) * (.75 + .25 * Math.sin(u * 5)) });
    tf(pbQ, { ...L(u, kn.minusRest + 1.2, 1e9, { from: .2, dy: 0, el: true, d: .7 }), y: bob(u, 0, 6, 3) });
  }
  show(kRule, { ...L(u, kn.heart + .1, 1e9, { from: 1.8, dy: 0, d: .35 }), r: -2 });
  tf(kMas, { ...L(u, .3, 1e9, { from: .3, dy: 140, el: true, d: .8 }), y: bob(u, 0, 6) + L(u, .3, 1e9, { from: .3, dy: 140, el: true, d: .8 }).y });
}

// ======================================================================
// SCENE 4 — EXPLANATION: apply the method, results stay unevaluated ("?")
// ======================================================================
const s4 = $('s4'), ex = B.expl;
const eHdr = add(s4, `<div class="pill2 p-blue crit c" style="left:250px;width:580px;top:362px;font-size:46px">ลองใช้สูตรกับโจทย์นี้</div>`);
function groupPanel(top, title, n, avg, f, totalLabel, eleven) {
  const p = add(s4, `<div class="row-panel crit c" style="top:${top}px;height:268px"></div>`);
  const tag = add(p, `<div class="chipT" style="left:22px;top:-22px;background:${eleven ? '#EE7FAA' : '#142B53'};color:#fff">${title}</div>`);
  const g = avatarGrid(48, 6); g.el.style.position = 'absolute'; g.el.style.left = '22px'; g.el.style.top = '40px'; p.appendChild(g.el);
  if (eleven) { g.cells[LEAVER].face.style.opacity = 0; g.cells[LEAVER].slot.style.opacity = 1; }
  const nTok = add(p, `<div class="tok t-n" style="left:258px;top:26px;width:150px;height:62px;font-size:34px">${n} คน</div>`);
  const aTok = add(p, `<div class="tok t-avg" style="left:420px;top:26px;width:180px;height:62px;font-size:34px">เฉลี่ย ${avg}</div>`);
  const fx = add(p, `<div class="mathbig" style="position:absolute;left:258px;top:100px;width:342px;text-align:center;font-size:62px">${f} =<span class="q" style="display:inline-block;margin-left:14px;width:84px;height:76px;border-radius:18px;background:#FFF3C4;box-shadow:inset 0 0 0 4px #FFD23F;color:#7A5A00;text-align:center;line-height:76px;vertical-align:middle">?</span></div>`);
  const lab = add(p, `<div class="chipT" style="left:300px;top:196px;width:260px;justify-content:center;background:#FFD23F;color:#142B53">${totalLabel}</div>`);
  return { p, tag, g, nTok, aTok, fx, lab, q: fx.querySelector('.q') };
}
const PA = groupPanel(468, 'ตอนแรก', M.n1, M.avg1, M.f1, 'คะแนนรวมเดิม', false);
const PB2 = groupPanel(782, 'เหลือ', M.n2, M.avg2, M.f2, 'คะแนนรวมใหม่', true);
const eC = add(s4, `<div class="cardN crit c" style="left:236px;top:1094px;width:608px;height:236px"></div>`);
const eC1 = add(eC, `<div class="mathbig" style="position:absolute;left:0;right:0;top:30px;text-align:center;font-size:46px;color:#fff"><span class="a">(${M.f1})</span> <span class="b">− (${M.f2})</span> <span class="c2">= <span style="color:#FFD23F">?</span></span></div>`);
const eC2 = add(eC, `<div style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center;align-items:center;gap:14px;font-weight:800;font-size:40px;line-height:1.35;color:#fff">= ${avatar(LOOKS[LEAVER], 64, { ring: COL.pink })}<span style="color:#FFB3CF">คะแนนของคนที่ออกไป</span></div>`);
const eDim = add(s4, `<div class="fx" style="inset:0;background:rgba(230,244,255,.78);opacity:0"></div>`);
const eTry = add(s4, `<div class="cardN crit c ctr" style="left:240px;top:760px;width:600px;height:300px;flex-direction:column;gap:10px">
  <div style="font-weight:700;font-size:38px;line-height:1.35;color:#95BFEF">ลองคิดคำตอบด้วยตัวเองก่อน!</div>
  <div style="font-weight:800;font-size:52px;line-height:1.35;color:#FFD23F">คุณคิดว่าได้กี่คะแนน?</div></div>`);
const eMas = add(s4, MAS('mascot_presenter.png', 470)); eMas.style.left = '820px'; eMas.style.top = '1340px';
const eQ = add(s4, `<div class="fx c" style="left:700px;top:690px">${QMARK(110)}</div>`);
sfx('pop', EX0 + ex.apply + .05, .6); sfx('whoosh', EX0 + ex.first12 - .1, .5); sfx('pop', EX0 + ex.first12 + .1, .6); sfx('pop', EX0 + ex.avg70 + .05, .6);
sfx('pen', EX0 + ex.mul1, .7); sfx('chime', EX0 + ex.mul1 + .6, .5); sfx('pop', EX0 + ex.total1 + .1, .6);
sfx('whoosh', EX0 + ex.then11 - .1, .5); sfx('pop', EX0 + ex.then11 + .1, .6); sfx('pop', EX0 + ex.avg68 + .05, .6);
sfx('pen', EX0 + ex.mul2a, .7); sfx('chime', EX0 + ex.mul2b + .1, .5); sfx('pop', EX0 + ex.total2 + .1, .6);
sfx('whoosh', EX0 + ex.takeOld - .1, .5); sfx('pen', EX0 + ex.takeOld + .1, .6); sfx('sub', EX0 + ex.minusNew, .7); sfx('pop', EX0 + ex.minusNew + .7, .6);
sfx('sparkle', EX0 + ex.diff + .1, .6); sfx('whoosh', EX0 + ex.tryIt - .1, .6); sfx('pop', EX0 + ex.tryIt + .4, .8);
function drawPanel(P_, u, a, avgAt, mulAt, mulAt2, totAt, eleven) {
  show(P_.p, L(u, a - .2, 1e9, { from: .85, dy: 60, d: .55 }));
  P_.g.cells.forEach((c, i) => { const l = L(u, a + i * .04, 1e9, { from: .2, dy: 0, d: .4 }); tf(c.el, { s: l.s, o: l.o });
    if (eleven && i === LEAVER) { c.slot.style.opacity = 1; tf(c.slot, { s: 1 + .06 * Math.sin(u * 5) }); } });
  show(P_.nTok, { ...L(u, a + .15, 1e9, { el: true, d: .6 }), s: L(u, a + .15, 1e9, { el: true, d: .6 }).s * pulse(u, mulAt, .5, .12) });
  show(P_.aTok, { ...L(u, avgAt, 1e9, { el: true, d: .6 }), s: L(u, avgAt, 1e9, { el: true, d: .6 }).s * pulse(u, mulAt2, .5, .12) });
  show(P_.fx, L(u, mulAt, 1e9, { from: .4, dy: 20, el: true, d: .7 }));
  tf(P_.q, { s: E.back(P(u, mulAt2 + .5, .5)) * pulse(u, totAt, .6, .25), o: clamp((u - mulAt2 - .5) * 4) });
  show(P_.lab, L(u, totAt, 1e9, { el: true, d: .7 }));
}
function drawS4(t) {
  const u = t - EX0;
  show(eHdr, L(u, ex.apply, 1e9, { el: true, d: .8 }));
  drawPanel(PA, u, ex.first12, ex.avg70, ex.mul1, ex.mul1 + .8, ex.total1, false);
  drawPanel(PB2, u, ex.then11, ex.avg68, ex.mul2a, ex.mul2b, ex.total2, true);
  show(eC, L(u, ex.takeOld - .1, 1e9, { from: .85, dy: 60 }));
  tf(eC1.querySelector('.a'), { o: clamp((u - ex.takeOld) * 4), s: pulse(u, ex.takeOld + .1, .6, .1) });
  tf(eC1.querySelector('.b'), { o: clamp((u - ex.minusNew) * 4), s: pulse(u, ex.minusNew + .1, .6, .1) });
  tf(eC1.querySelector('.c2'), { o: clamp((u - ex.minusNew - .7) * 4) });
  ['.a', '.b', '.c2'].forEach(s => eC1.querySelector(s).style.display = 'inline-block');
  show(eC2, L(u, ex.diff, 1e9, { from: .5, dy: 20, el: true, d: .7 }));
  const tr = E.inOut(P(u, ex.tryIt, .5));
  eDim.style.opacity = tr; show(eTry, L(u, ex.tryIt + .2, 1e9, { from: .4, dy: 40, el: true, d: .8 }));
  tf(eQ, { ...L(u, ex.tryIt + .5, 1e9, { from: .2, dy: 0, el: true, d: .7 }), r: Math.sin(u * 3) * 10 });
  tf(eMas, { ...L(u, .4, 1e9, { from: .3, dy: 140, el: true, d: .8 }), y: bob(u, 0, 6) + L(u, .4, 1e9, { from: .3, dy: 140, el: true, d: .8 }).y, r: Math.sin(u * 1.5) * 2 });
}

// ======================================================================
// SCENE 5 — QUIZ, 5-SECOND COUNTDOWN, ANSWER REVEAL
// ======================================================================
const s5 = $('s5'), qz = B.quiz, an = B.ans;
const qNavy = add(s5, `<div class="fx" style="inset:0;background:radial-gradient(ellipse at 50% 55%,#1E3F7A 0%,#142B53 70%);opacity:0"></div>`);
const qDots = [...Array(26)].map((_, i) => add(qNavy, `<div class="fx" style="left:0;top:0;width:${6 + (i % 4) * 3}px;height:${6 + (i % 4) * 3}px;border-radius:50%;background:${i % 3 ? '#22D3EE' : '#95BFEF'};box-shadow:0 0 10px #22D3EE"></div>`));
const qHdr = add(s5, `<div class="pill2 p-blue crit c" style="left:250px;width:580px;top:362px;font-size:46px">ข้อสอบจริง ลองทำ!</div>`);
const aHdr = add(s5, `<div class="pill2 p-green crit c" style="left:236px;width:608px;top:362px;font-size:48px">${CHECK('#fff', 46)}เฉลยข้อ ค. ${M.missing} คะแนน</div>`);
const qCard = add(s5, `<div class="cardB crit c" style="left:230px;top:452px;width:620px;height:282px;padding:22px 26px"></div>`);
const QL = [`นักเรียน ${M.n1} คน มีคะแนนเฉลี่ย ${M.avg1} คะแนน`, `มีนักเรียนออกไป ${M.left} คน`, `${M.n2} คนที่เหลือมีคะแนนเฉลี่ย ${M.avg2} คะแนน`, `นักเรียนที่ออกไปได้กี่คะแนน?`];
const qLines = QL.map((t, i) => add(qCard, `<span class="qline" style="font-weight:${i === 3 ? 800 : 600};font-size:34px;line-height:1.66;color:${i === 3 ? '#2F6BFF' : '#142B53'}">${t}</span>`));
const OPTS = M.choices.map(([b, v], i) => add(s5, `<div class="opt2 crit c" style="left:${i % 2 ? 545 : 230}px;top:${i < 2 ? 760 : 892}px"><div class="b">${b}</div><span class="tx">${v} คะแนน</span><div class="ck">${CHECK('#fff', 40)}</div></div>`));
const recap = add(s5, `<div class="cardB crit c" style="left:236px;top:1040px;width:608px;height:220px">
   <div class="r1" style="position:absolute;left:24px;top:30px;width:250px;text-align:center"><div style="display:flex;justify-content:center;gap:4px;margin-bottom:6px">${[0, 1, 2, 3].map(i => avatar(LOOKS[i], 46)).join('')}</div>
     <div style="font-weight:800;font-size:34px;line-height:1.4;color:#142B53">${M.n1} คน</div><div style="font-weight:700;font-size:30px;line-height:1.35;color:#0B8FA6">เฉลี่ย ${M.avg1}</div></div>
   <div class="ar" style="position:absolute;left:276px;top:80px;width:56px;text-align:center">${ICON.check ? `<svg width="56" height="56" viewBox="0 0 24 24"><path d="M3 12h16M13 6l6 6-6 6" stroke="#2F6BFF" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>` : ''}</div>
   <div class="r2" style="position:absolute;left:334px;top:30px;width:250px;text-align:center"><div style="display:flex;justify-content:center;gap:4px;margin-bottom:6px">${[0, 1, 2].map(i => avatar(LOOKS[i], 46)).join('')}${avatar(LOOKS[LEAVER], 46, { dashed: true })}</div>
     <div style="font-weight:800;font-size:34px;line-height:1.4;color:#142B53">${M.n2} คน</div><div style="font-weight:700;font-size:30px;line-height:1.35;color:#0B8FA6">เฉลี่ย ${M.avg2}</div></div></div>`);
const qHint = add(s5, `<div class="cardN crit c ctr" style="left:236px;top:1040px;width:608px;height:200px;flex-direction:column;gap:8px">
   <div style="font-weight:700;font-size:34px;line-height:1.35;color:#95BFEF">อย่าลืม! ต้องหาคะแนนรวมก่อน</div>
   <div class="f" style="font-weight:800;font-size:40px;line-height:1.35"><span style="color:#FFD23F">คะแนนรวม</span> = <span style="color:#7DE7F7">เฉลี่ย</span> × <span style="color:#9DB8FF">จำนวนคน</span></div></div>`);
const qHintS = add(s5, `<div class="pill2 p-navy crit c" style="left:236px;width:608px;top:1318px;font-size:34px"><span style="color:#FFD23F">คะแนนรวม</span> = <span style="color:#7DE7F7">เฉลี่ย</span> × <span style="color:#9DB8FF">จำนวนคน</span></div>`);
const q5 = add(s5, `<div class="pill2 p-yellow crit c" style="left:290px;width:500px;top:1262px;font-size:40px">${ICON.timer(44, '#142B53')}ให้เวลาคิด 5 วินาที!</div>`);
const qCdBox = add(s5, `<div class="abs c crit" style="left:410px;top:1036px"></div>`);
const cd = NSP.buildCountdown(qCdBox, 260);
qCdBox.querySelectorAll('stop')[0].setAttribute('stop-color', '#2F6BFF'); qCdBox.querySelectorAll('stop')[1].setAttribute('stop-color', '#22D3EE');
{ const cs = qCdBox.querySelectorAll('circle'); cs[0].setAttribute('fill', '#0E2147'); cs[0].setAttribute('stroke', '#2F6BFF'); cs[0].setAttribute('stroke-width', '6'); cs[1].setAttribute('stroke', '#1F3E78'); cd.dot.setAttribute('stroke', '#22D3EE'); cd.num.style.color = '#fff'; }
const qMas = add(s5, MAS('mascot_pose.png', 460)); qMas.style.left = '850px'; qMas.style.top = '1360px';
// answer layout
const aRow = (top) => add(s5, `<div class="row-panel crit c" style="top:${top}px;height:220px"></div>`);
const A1 = aRow(456), A2 = aRow(696);
const aG1 = avatarGrid(46, 6); aG1.el.style.cssText += ';position:absolute;left:22px;top:34px'; A1.appendChild(aG1.el);
const aG2 = avatarGrid(46, 6); aG2.el.style.cssText += ';position:absolute;left:22px;top:34px'; A2.appendChild(aG2.el);
const rowTxt = (p, n, avg, f) => ({
  info: add(p, `<div style="position:absolute;left:252px;top:16px;width:350px;text-align:center;font-weight:700;font-size:30px;line-height:1.4;color:#31445D"><span class="n">${n} คน</span> · <span class="a" style="color:#0B8FA6">เฉลี่ย ${avg}</span></div>`),
  f: add(p, `<div class="mathbig" style="position:absolute;left:252px;top:62px;width:350px;text-align:center;font-size:60px">${f}</div>`),
  tot: add(p, `<div style="position:absolute;left:252px;top:140px;width:350px;display:flex;justify-content:center;align-items:center;gap:12px"><span class="mathbig" style="font-size:52px">=</span><span class="v" style="min-width:150px;padding:2px 16px;border-radius:18px;background:#FFF3C4;box-shadow:inset 0 0 0 4px #FFD23F;font-weight:800;font-size:52px;line-height:1.3;color:#7A5A00;text-align:center"></span></div>`),
});
const R1t = rowTxt(A1, M.n1, M.avg1, M.f1), R2t = rowTxt(A2, M.n2, M.avg2, M.f2);
const aLab1 = add(A1, `<div class="chipT" style="left:22px;top:-22px;background:#142B53;color:#fff">คะแนนรวมเดิม</div>`);
const aLab2 = add(A2, `<div class="chipT" style="left:22px;top:-22px;background:#2F6BFF;color:#fff">คะแนนรวมใหม่</div>`);
const aSub = add(s5, `<div class="cardN crit c" style="left:236px;top:940px;width:608px;height:136px"></div>`);
const aSubN = [add(aSub, `<div class="fx mathbig" style="left:46px;top:28px;font-size:66px;color:#FFD23F">${M.total1}</div>`),
  add(aSub, `<div class="fx mathbig" style="left:196px;top:28px;font-size:66px;color:#fff">−</div>`),
  add(aSub, `<div class="fx mathbig" style="left:262px;top:28px;font-size:66px;color:#9DB8FF">${M.total2}</div>`),
  add(aSub, `<div class="fx mathbig" style="left:404px;top:28px;font-size:66px;color:#fff">=</div>`),
  add(aSub, `<div class="fx mathbig" style="left:458px;top:22px;font-size:76px;padding:0 14px;border-radius:20px;background:linear-gradient(90deg,#FFD23F,#22C55E);color:#fff;text-shadow:0 3px 0 rgba(0,0,0,.15)">${M.missing}</div>`)];
const aFly = [add(s5, `<div class="fx mathbig" style="left:0;top:0;font-size:52px;color:#7A5A00">${M.total1}</div>`), add(s5, `<div class="fx mathbig" style="left:0;top:0;font-size:52px;color:#7A5A00">${M.total2}</div>`)];
const aRes = add(s5, `<div class="cardB crit c" style="left:420px;top:1100px;width:424px;height:196px">
   <div style="position:absolute;left:0;right:0;top:22px;text-align:center;font-weight:700;font-size:32px;line-height:1.35;color:#31445D">คะแนนของคนที่ออกไป</div>
   <div style="position:absolute;left:0;right:0;top:66px;text-align:center"><span class="mathbig" style="font-size:96px;color:#16A34A">= ${M.missing}</span></div></div>`);
const aVer = [add(s5, `<div class="pill2 p-ice crit c" style="left:232px;width:300px;top:1330px;font-size:32px;padding:8px 10px 10px">${M.verify1}<span style="width:36px;height:36px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${CHECK('#fff', 26)}</span></span></div>`),
  add(s5, `<div class="pill2 p-ice crit c" style="left:548px;width:300px;top:1330px;font-size:32px;padding:8px 10px 10px">${M.verify2}<span style="width:36px;height:36px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${CHECK('#fff', 26)}</span></div>`)];
const aKid = student(LOOKS[LEAVER]); const aKidW = add(s5, `<div class="fx" style="left:0;top:0;transform-origin:0 0"></div>`); aKidW.appendChild(aKid.el); aKid.el.style.left = '-75px'; aKid.el.style.top = '-275px';
const aBadge = add(s5, `<div class="fx c" style="left:0;top:0;min-width:120px;height:80px;padding:0 18px;border-radius:40px;background:linear-gradient(90deg,#FFD23F,#22C55E);box-shadow:0 0 0 5px #fff,0 0 26px rgba(34,197,94,.6);display:grid;place-items:center;font-weight:800;font-size:54px;color:#fff;line-height:1">${M.missing}</div>`);
const aMem = add(s5, `<div class="cardN crit c" style="left:236px;top:470px;width:608px;height:490px"></div>`);
const memT = add(aMem, `<div class="pill2 p-yellow" style="left:164px;width:280px;top:-30px;font-size:40px;padding:6px 10px 9px">จำไว้ให้ดี!</div>`);
const mem = [
  add(aMem, `<div style="position:absolute;left:0;right:0;top:56px;text-align:center;font-weight:700;font-size:36px;line-height:1.4;color:#95BFEF">ถ้าโจทย์ให้ค่าเฉลี่ยมา...</div>`),
  add(aMem, `<div style="position:absolute;left:30px;right:30px;top:130px"><div style="font-weight:800;font-size:38px;line-height:1.4;color:#fff">① ย้อนหาผลรวมก่อน</div>
     <div style="margin-top:10px;display:flex;justify-content:center;gap:8px;font-weight:800;font-size:34px;line-height:1.35;white-space:nowrap"><span style="color:#7DE7F7">เฉลี่ย</span>×<span style="color:#9DB8FF">จำนวนคน</span>=<span style="color:#FFD23F">คะแนนรวม</span></div></div>`),
  add(aMem, `<div style="position:absolute;left:30px;right:30px;top:300px"><div style="font-weight:800;font-size:38px;line-height:1.4;color:#fff">② แล้วค่อยหาผลต่าง</div>
     <div style="margin-top:10px;text-align:center;font-weight:800;font-size:34px;line-height:1.45;white-space:nowrap"><span style="color:#FFD23F">คะแนนรวมเดิม</span> − <span style="color:#9DB8FF">คะแนนรวมใหม่</span></div>
     <div style="text-align:center;font-weight:800;font-size:34px;line-height:1.45;white-space:nowrap">= <span style="color:#FFB3CF">คะแนนที่หายไป</span></div></div>`),
];
const aConf = add(s5, `<div class="fx" style="inset:0"></div>`);
const conf = NSP.buildConfetti(aConf, 46, 690, 830);
conf.forEach((c, i) => c.el.style.background = ['#2F6BFF', '#22D3EE', '#22C55E', '#FFD23F', '#95BFEF', '#FFFFFF'][i % 6]);

sfx('pop', QS + qz.test + .05, .6); sfx('whoosh', QS + qz.l1 - .2, .4);
[qz.l1, qz.l2, qz.l3, qz.l4].forEach(a => sfx('pen', QS + a, .45));
[qz.oA, qz.oB, qz.oC, qz.oD].forEach(a => sfx('pop', QS + a + .02, .7));
sfx('pop', QS + qz.hint0, .6); sfx('chime', QS + qz.hint + .2, .4); sfx('pop', QS + qz.five + .05, .7);
for (let i = 0; i < CDD; i++) sfx(i === CDD - 1 ? 'tick2' : 'tick', CD + i, .9);
sfx('success', AN + .02, .9); sfx('sparkle', AN + an.choice + .05, .7); sfx('ding', AN + an.ninety2 + .05, .7);
sfx('whoosh', AN + an.method - .05, .7); sfx('pop', AN + an.first, .5); sfx('pop', AN + an.n12, .5); sfx('pop', AN + an.a70, .5);
sfx('pen', AN + an.mul1, .6); sfx('chime', AN + an.mul1 + .3, .5); for (let i = 0; i < 6; i++) sfx('digit', AN + an.t840 + i * .1, .35); sfx('ding', AN + an.t840 + .7, .6);
sfx('whoosh', AN + an.after + .2, .5); sfx('pop', AN + an.n11, .5); sfx('pop', AN + an.a68, .5);
sfx('pen', AN + an.mul2, .6); sfx('chime', AN + an.mul2 + .3, .5); for (let i = 0; i < 6; i++) sfx('digit', AN + an.t748 + i * .1, .35); sfx('ding', AN + an.t748 + .7, .6);
sfx('whoosh', AN + an.take840, .6); sfx('sub', AN + an.minus748, .8); sfx('whoosh', AN + an.minus748 + .1, .5); sfx('success', AN + an.r92 + .02, .9); sfx('sparkle', AN + an.r92 + .3, .6);
stepSfx(AN + an.isScore, AN + an.isScore + 1.2, .5); sfx('pop', AN + an.isScore + 1.2, .7); sfx('pop', AN + 30.9, .5); sfx('pop', AN + 31.5, .5);
sfx('whoosh', AN + an.remember - .05, .6); sfx('stamp', AN + an.remember + .2, .6); sfx('pop', AN + an.ifAvg, .5); sfx('pop', AN + an.backTotal, .6); sfx('pop', AN + an.thenDiff, .6);
mark('countdown_start', CD); mark('answer_start', AN);

function drawS5(t) {
  const u = t - QS, ua = t - AN, uc = t - CD;
  const revealed = t >= AN;               // hard gate: nothing below this flag can show before the countdown ends
  // navy thinking background (countdown) → back to ice for the worked solution
  const nv = E.inOut(P(uc, -.4, .5)) * (1 - E.inOut(P(ua, an.method, .6)));
  qNavy.style.opacity = nv; qNavy.style.display = nv > 0 ? 'block' : 'none';
  qDots.forEach((d, i) => { const y = (1900 - ((t * (30 + i * 4)) + i * 260) % 2000); tf(d, { x: (i * 131) % 1080, y, o: .5 + .3 * Math.sin(t * 2 + i) }); });
  const qOut = revealed ? E.in(P(ua, an.method, .5)) : 0;
  show(qHdr, { ...L(u, qz.test, 1e9, { el: true, d: .8 }), o: L(u, qz.test, 1e9, { el: true, d: .8 }).o * (revealed ? 1 - clamp(ua / .3) : 1) });
  show(aHdr, revealed ? { ...L(ua, 0, 1e9, { from: .5, dy: 0, el: true, d: .7 }), s: L(ua, 0, 1e9, { from: .5, dy: 0, el: true, d: .7 }).s * pulse(ua, an.ninety2, .6, .08) * pulse(ua, an.remember + .3, .6, .06) } : { o: 0 });
  // question
  const qc = L(u, qz.l1 - .3, 1e9, { from: .85, dy: 40 });
  show(qCard, { ...qc, o: qc.o * (1 - qOut), s: qc.s * (1 - .2 * qOut), y: qc.y - 200 * qOut });
  qLines.forEach((e, i) => {
    fit(e, 568);
    const at = [qz.l1, qz.l2, qz.l3, qz.l4][i], end = [qz.l2, qz.l3, qz.l4, qz.oA][i];
    tf(e, { o: clamp((u - at + .1) * 4) });
    const on = u > at && u < end; e.style.background = on ? 'rgba(34,211,238,.22)' : 'transparent';
  });
  // options: neutral until the answer segment begins
  OPTS.forEach((o, i) => {
    const at = [qz.oA, qz.oB, qz.oC, qz.oD][i];
    const l = L(u, at, 1e9, { from: .4, dy: 0, d: .55 }), x = (1 - E.out(P(u, at, .55))) * (i % 2 ? 260 : -260);
    const reading = u > at && u < at + 1.6 && !revealed;
    const isC = i === M.correctIndex;
    if (revealed && isC) {
      const rp = E.back(P(ua, 0, .5));
      o.style.background = 'linear-gradient(180deg,#4ADE80,#16A34A)'; o.style.color = '#fff';
      o.style.boxShadow = `0 10px 0 #15803D,0 0 0 6px #fff,0 0 ${40 + 14 * Math.sin(ua * 3)}px rgba(34,197,94,.7)`;
      o.querySelector('.b').style.background = 'radial-gradient(circle at 35% 30%,#BBF7D0,#15803D 75%)';
      tf(o.querySelector('.ck'), { s: E.elastic(P(ua, an.choice, .8)), o: clamp((ua - an.choice) * 8), r: (1 - E.out(P(ua, an.choice, .6))) * -90 });
      tf(o, { ...l, x, s: l.s * (1 + .07 * rp - .07 * P(ua, .5, .4)) * pulse(ua, an.ninety2, .5, .1), o: l.o * (1 - qOut), y: -150 * qOut });
      o.style.filter = '';
    } else {
      o.style.background = ''; o.style.color = ''; o.style.boxShadow = reading ? '0 10px 0 #95BFEF,0 0 0 6px #22D3EE,0 16px 28px rgba(20,43,83,.18)' : '';
      o.querySelector('.b').style.background = ''; tf(o.querySelector('.ck'), { o: 0 });
      const dim = revealed ? .55 * E.out(P(ua, 0, .45)) : 0;
      tf(o, { ...l, x, o: l.o * (1 - dim) * (1 - qOut), s: l.s * (1 - .06 * dim) * (reading ? pulse(u, at, .5, .06) : 1), y: -150 * qOut });
      o.style.filter = revealed ? `grayscale(${dim * 1.6})` : '';
    }
  });
  // recap → hint → countdown
  const rc = L(u, qz.l1 + .3, qz.hint0 - .05, { from: .7, dy: 30 });
  show(recap, rc);
  tf(recap.querySelector('.r2'), { o: clamp((u - qz.l3) * 3) }); tf(recap.querySelector('.ar'), { o: clamp((u - qz.l2) * 3), x: Math.sin(u * 4) * 4 });
  const hl = L(u, qz.hint0, CD - QS - .1, { from: .7, dy: 30 });
  show(qHint, hl);
  tf(qHint.querySelector('.f'), { o: clamp((u - qz.hint) * 4), s: pulse(u, qz.hint, .6, .1) });
  show(q5, L(u, qz.five, CD - QS - .05, { from: .4, dy: 0, el: true, d: .6 }));
  show(qHintS, revealed ? { o: 1 - clamp(ua / .3) } : L(uc, -.1, 1e9, { from: .7, dy: 20 }));
  NSP.drawCountdown(cd, revealed ? CDD + 1 : uc, CDD);
  if (revealed) tf(cd.el, { o: 0 });
  else if (uc >= 0 && uc < CDD) tf(cd.el, { o: 1, s: 1 + .18 * (1 - E.out(clamp(uc / .35))) + .04 * Math.max(0, 1 - (uc % 1) / .25) });   // fully visible from the first countdown frame
  tf(qMas, { ...L(u, .3, 1e9, { from: .3, dy: 140, el: true, d: .8 }), y: bob(u, 0, 6) + L(u, .3, 1e9, { from: .3, dy: 140, el: true, d: .8 }).y, o: 1 - (revealed ? E.in(P(ua, an.method, .4)) : 0) });
  // ---------------- answer (only when revealed) ----------------
  const ansEls = [A1, A2, aSub, aRes, ...aVer, aKidW, aBadge, aMem, ...aFly];
  if (!revealed) { hideAll(...ansEls); NSP.drawConfetti(conf, t, AN + an.choice, 2.2); return; }
  NSP.drawConfetti(conf, t, AN + an.choice, 2.2);
  const memO = E.inOut(P(ua, an.remember, .5));
  const rows = (l) => ({ ...l, o: l.o * (1 - memO), s: l.s * (1 - .1 * memO) });
  show(A1, rows(L(ua, an.first - .2, 1e9, { from: .85, dy: 60 })));
  show(A2, rows(L(ua, an.after - .1, 1e9, { from: .85, dy: 60 })));
  aG1.cells.forEach((c, i) => tf(c.el, L(ua, an.n12 + i * .04, 1e9, { from: .2, dy: 0, d: .4 })));
  aG2.cells.forEach((c, i) => {
    tf(c.el, L(ua, an.after + i * .03, 1e9, { from: .2, dy: 0, d: .4 }));
    if (i === LEAVER) { const out = E.inOut(P(ua, an.after + .6, .7)); tf(c.face, { x: out * 120, o: 1 - out, s: 1 - .3 * out }); c.slot.style.opacity = out; }
  });
  tf(R1t.info.querySelector('.n'), { s: pulse(ua, an.n12, .5, .12) }); R1t.info.querySelector('.n').style.display = 'inline-block';
  tf(R1t.info, { o: clamp((ua - an.n12) * 4) }); tf(R1t.info.querySelector('.a'), { o: clamp((ua - an.a70) * 4) }); R1t.info.querySelector('.a').style.display = 'inline-block';
  tf(R2t.info, { o: clamp((ua - an.n11) * 4) }); tf(R2t.info.querySelector('.a'), { o: clamp((ua - an.a68) * 4) }); R2t.info.querySelector('.a').style.display = 'inline-block';
  show(R1t.f, L(ua, an.mul1, 1e9, { from: .4, dy: 20, el: true, d: .7 }));
  show(R2t.f, L(ua, an.mul2, 1e9, { from: .4, dy: 20, el: true, d: .7 }));
  const roll = (a, v) => Math.round(v * E.out(P(ua, a, .6)));
  show(R1t.tot, { ...L(ua, an.t840, 1e9, { from: .4, dy: 0, el: true, d: .7 }), s: L(ua, an.t840, 1e9, { from: .4, dy: 0, el: true, d: .7 }).s * pulse(ua, an.t840 + .65, .5, .12) });
  R1t.tot.querySelector('.v').textContent = roll(an.t840, M.total1);
  show(R2t.tot, { ...L(ua, an.t748, 1e9, { from: .4, dy: 0, el: true, d: .7 }), s: L(ua, an.t748, 1e9, { from: .4, dy: 0, el: true, d: .7 }).s * pulse(ua, an.t748 + .65, .5, .12) });
  R2t.tot.querySelector('.v').textContent = roll(an.t748, M.total2);
  tf(aLab1, L(ua, an.t840 + .4, 1e9, { from: .5, dy: 10 })); tf(aLab2, L(ua, an.t748 + .4, 1e9, { from: .5, dy: 10 }));
  // subtraction: totals fly down into the equation
  show(aSub, rows(L(ua, an.then, 1e9, { from: .85, dy: 40 })));
  const fly = (e, a, from, to) => { const p = P(ua, a, .7); if (p <= 0 || p >= 1) { tf(e, { o: 0 }); return; } const k = E.inOut(p); tf(e, { x: lerp(from[0], to[0], k), y: lerp(from[1], to[1], k) - Math.sin(k * Math.PI) * 60, s: lerp(1, 1.25, k), o: 1 }); };
  fly(aFly[0], an.take840, [600, 596], [282, 966]); fly(aFly[1], an.minus748 + .1, [600, 836], [498, 966]);
  tf(aSubN[0], { o: clamp((ua - an.take840 - .7) * 6), s: pulse(ua, an.take840 + .7, .4, .15) });
  tf(aSubN[1], { o: clamp((ua - an.minus748) * 6) });
  tf(aSubN[2], { o: clamp((ua - an.minus748 - .8) * 6), s: pulse(ua, an.minus748 + .8, .4, .15) });
  tf(aSubN[3], { o: clamp((ua - an.equals) * 6) });
  tf(aSubN[4], { ...L(ua, an.r92, 1e9, { from: 2, dy: 0, d: .4 }), s: L(ua, an.r92, 1e9, { from: 2, dy: 0, d: .4 }).s * (1 + .04 * Math.sin(ua * 4)) });
  // the student who left returns to the foreground
  const kIn = P(ua, an.isScore, 1.2), kx = lerp(1180, 320, E.out(kIn)), down = E.inOut(P(ua, an.remember, .7));
  const ky = lerp(1300, 1418, down), ks = lerp(.82, .78, down);
  aKidW.style.transform = `translate(${kx}px,${ky}px) scale(${ks})`; aKidW.style.opacity = ua > an.isScore ? 1 : 0; aKidW.style.visibility = ua > an.isScore ? 'visible' : 'hidden';
  const walking = kIn > 0 && kIn < .95;
  aKid.pose({ walk: ua * 9, walkAmt: walking ? 1 - kIn : 0, expr: walking ? 'smile' : 'grin', lookX: walking ? -.8 : 0, blink: blinkAt(ua, 2), armL: walking ? 8 : 8, armR: walking ? -8 : -150 + Math.sin(ua * 6) * 12, tilt: walking ? 0 : -5 });
  const bl = L(ua, an.remember + .6, 1e9, { from: .2, dy: 0, el: true, d: .7 });
  tf(aBadge, { ...bl, x: kx - 70, y: ky - ks * 300 - 70 + bob(ua, 0, 6, 3) });
  show(aRes, { ...rows(L(ua, an.isScore + .3, 1e9, { from: .5, dy: 30, el: true, d: .7 })), x: 0 });
  aVer.forEach((v, i) => show(v, rows(L(ua, 30.9 + i * .6, 1e9, { from: .5, dy: 20, el: true, d: .6 }))));
  // memory rule
  show(aMem, L(ua, an.remember + .1, 1e9, { from: .7, dy: 60 }));
  tf(memT, { ...L(ua, an.remember + .2, 1e9, { from: 1.6, dy: 0, d: .35 }), r: -3 });
  mem.forEach((m, i) => tf(m, { ...L(ua, [an.ifAvg, an.backTotal, an.thenDiff][i], 1e9, { from: .6, dy: 20, el: true, d: .7 }), s: L(ua, [an.ifAvg, an.backTotal, an.thenDiff][i], 1e9, { from: .6, dy: 20, el: true, d: .7 }).s }));
  // after the memory rule, the result card sits beside the student at the bottom
  if (memO > 0) tf(aRes, { o: E.out(P(ua, an.remember + .4, .5)), x: 0, y: lerp(0, 112, down), s: .9 });
}

// ======================================================================
// SCENE 6 — PROMOTION (Blue Dominant, approved brand assets)
// ======================================================================
const s6 = $('s6'), pm = B.promo;
const pQ1 = add(s6, `<div class="pill2 p-navy crit c" style="left:240px;width:600px;top:368px;font-size:48px">คุณตอบถูกข้อ ค. ไหม?</div>`);
const pCom = add(s6, `<div class="cardB crit c" style="left:236px;top:480px;width:608px;height:560px;overflow:hidden">
   <div style="position:absolute;left:0;right:0;top:0;height:84px;background:linear-gradient(90deg,#2F6BFF,#22D3EE);display:flex;align-items:center;gap:14px;padding:0 28px;font-weight:800;font-size:34px;color:#fff;line-height:1.3">
     <svg width="44" height="44" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="#fff"/></svg>ความคิดเห็น</div>
   <div class="list" style="position:absolute;left:22px;right:22px;top:104px"></div>
   <div class="inp" style="position:absolute;left:22px;right:22px;bottom:22px;height:76px;border-radius:38px;background:#E6F4FF;box-shadow:inset 0 0 0 3px #95BFEF;display:flex;align-items:center;padding:0 26px;font-weight:600;font-size:30px;color:#31445D;line-height:1.3"><span class="ty"></span><span class="cur" style="display:inline-block;width:3px;height:36px;background:#2F6BFF;margin-left:4px"></span></div></div>`);
const COMMENTS = [[LOOKS[0], `ข้อ ค. ${M.missing} คะแนน!`], [LOOKS[1], 'หาคะแนนรวมก่อน ง่ายเลย'], [LOOKS[9], `${M.eqSub} ถูกต้อง`]];
const pBub = COMMENTS.map(([lk, tx], i) => add(pCom.querySelector('.list'), `<div class="bubbleC" style="position:relative;left:0;top:${i * 8}px;margin-bottom:14px;font-size:30px">${avatar(lk, 54)}<span>${tx}</span><span style="margin-left:auto;display:flex;align-items:center;gap:4px;font-size:24px;color:#2F6BFF">${ICON.heart('#2F6BFF').replace('width="40" height="40"', 'width="26" height="26"')}<span class="lk">0</span></span></div>`));
const pQ2 = add(s6, `<div class="pill2 p-blue crit c" style="left:270px;width:540px;top:1076px;font-size:46px">คุณใช้วิธีไหนคิด?</div>`);
const pPract = add(s6, `<div class="pill2 p-cyan crit c" style="left:236px;width:608px;top:1240px;font-size:40px">อยากฝึกข้อสอบคณิตแบบนี้อีก?</div>`);
const pSyms = ['+', '−', '×', '÷', 'x̄', '='].map((s, i) => add(s6, `<div class="fx c" style="left:0;top:0;width:96px;height:96px;border-radius:28px;background:${i % 2 ? '#2F6BFF' : '#fff'};color:${i % 2 ? '#fff' : '#2F6BFF'};display:grid;place-items:center;font-weight:800;font-size:56px;line-height:1;box-shadow:0 12px 24px rgba(20,43,83,.2)">${s}</div>`));
const pMas = add(s6, MAS('mascot_pose.png', 560)); pMas.style.left = '416px'; pMas.style.top = '620px';
const pLogo = add(s6, `<div class="fx c" style="left:300px;top:420px;width:480px"><img src="../../shared/brand/logo.png" style="width:480px;display:block;filter:drop-shadow(0 16px 24px rgba(20,43,83,.3))"></div>`);
const pWord = add(s6, `<div class="fx crit c" style="left:236px;width:608px;top:944px;text-align:center"><span class="wordmark" style="font-size:118px;background:linear-gradient(90deg,#142B53,#2F6BFF 55%,#22D3EE);-webkit-background-clip:text;background-clip:text;color:transparent">NaiSibPro</span></div>`);
const pThai = add(s6, `<div class="pill2 p-navy crit c" style="left:340px;width:400px;top:1112px;font-size:44px">นายสิบโปร</div>`);
const pPoster = add(s6, `<div class="fx c" style="left:236px;top:600px;width:290px;height:515px;border-radius:26px;overflow:hidden;box-shadow:0 20px 40px rgba(20,43,83,.3),0 0 0 6px #fff"><img src="../../shared/brand/poster.jpg" style="width:290px;height:515px;display:block"></div>`);
const pBank = add(s6, `<div class="cardN crit c ctr" style="left:546px;top:610px;width:298px;height:240px;flex-direction:column;gap:2px">
   <div style="font-weight:700;font-size:30px;line-height:1.35;color:#95BFEF">ข้อสอบมากกว่า</div><div class="n" style="font-weight:800;font-size:64px;line-height:1.2;color:#FFD23F">10,000+</div><div style="font-weight:700;font-size:32px;line-height:1.35">ข้อ</div></div>`);
const pWeek = add(s6, `<div class="cardB crit c ctr" style="left:546px;top:878px;width:298px;height:230px;flex-direction:column;gap:6px">
   <div style="width:84px;height:84px;border-radius:24px;background:linear-gradient(160deg,#22D3EE,#2F6BFF);display:grid;place-items:center">${ICON.cal(54, '#fff')}</div>
   <div style="font-weight:800;font-size:36px;line-height:1.35;color:#142B53">อัปเดต</div><div style="font-weight:800;font-size:36px;line-height:1.2;color:#2F6BFF">ทุกสัปดาห์</div></div>`);
const BTN = [['LIKE', `<svg width="80" height="80" viewBox="0 0 24 24"><path d="M2 10h4v11H2zM8 21h9.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 19 10h-5l.8-4.2A1.8 1.8 0 0 0 11.6 5L8 10z" fill="#fff"/></svg>`],
  ['SHARE', `<svg width="80" height="80" viewBox="0 0 24 24"><path d="M14 4l8 7-8 7v-4c-6 0-9 2-12 6 1-6 4-11 12-12z" fill="#fff"/></svg>`],
  ['FOLLOW', `<svg width="80" height="80" viewBox="0 0 24 24"><circle cx="9" cy="8" r="4" fill="#fff"/><path d="M1 21c0-5 4-7 8-7s8 2 8 7z" fill="#fff"/><path d="M19 7v8M15 11h8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`]];
const pBtns = BTN.map(([n, ic], i) => add(s6, `<div class="fx crit c" style="left:${240 + i * 210}px;top:1150px;width:180px;text-align:center">
   <div class="ci" style="width:150px;height:150px;margin:0 auto;border-radius:50%;background:${['linear-gradient(160deg,#4F8BFF,#2F6BFF)', 'linear-gradient(160deg,#5EE3F5,#22B8D6)', 'linear-gradient(160deg,#F49CBF,#EE7FAA)'][i]};display:grid;place-items:center;box-shadow:0 14px 28px rgba(20,43,83,.25),0 0 0 6px #fff">${ic}</div>
   <div style="margin-top:14px;font-weight:800;font-size:32px;letter-spacing:2px;color:#142B53;line-height:1.3">${n}</div></div>`));
const pHand = add(s6, `<div class="fx" style="left:0;top:0">${ICON.hand(96)}</div>`);
const pEnd = add(s6, `<div class="fx" style="inset:0;background:linear-gradient(165deg,#E6F4FF 0%,#CFE5FF 55%,#95BFEF 100%);display:none"></div>`);
const eLogo = add(pEnd, `<div class="fx c" style="left:330px;top:400px;width:420px"><img src="../../shared/brand/logo.png" style="width:420px;display:block;filter:drop-shadow(0 16px 24px rgba(20,43,83,.3))"></div>`);
const eWord = add(pEnd, `<div class="fx crit c" style="left:236px;width:608px;top:862px;text-align:center"><span class="wordmark" style="font-size:112px;background:linear-gradient(90deg,#142B53,#2F6BFF 55%,#22D3EE);-webkit-background-clip:text;background-clip:text;color:transparent">NaiSibPro</span></div>`);
const eTag = add(pEnd, `<div class="fx crit c title-sticker" style="left:236px;width:608px;top:1030px;text-align:center;font-size:44px;line-height:1.4;color:#142B53">ติววันละนิด พิชิตข้อสอบตำรวจ!</div>`);
const eBye = add(pEnd, `<div class="pill2 p-blue crit c" style="left:270px;width:540px;top:1130px;font-size:46px">แล้วเจอกันคลิปหน้า!</div>`);
const eRow = add(pEnd, `<div class="fx crit c" style="left:236px;width:608px;top:1250px;display:flex;justify-content:center;gap:14px">${['LIKE', 'SHARE', 'FOLLOW'].map((n, i) => `<div class="pill" style="font-size:30px;padding:8px 22px;font-weight:800;color:#fff;background:${['#2F6BFF', '#22B8D6', '#EE7FAA'][i]};line-height:1.35">${n}</div>`).join('')}</div>`);
const eConf = add(pEnd, `<div class="fx" style="inset:0"></div>`);
const econf = NSP.buildConfetti(eConf, 60, 540, 640); econf.forEach((c, i) => c.el.style.background = ['#2F6BFF', '#22D3EE', '#FFD23F', '#95BFEF', '#FFFFFF', '#EE7FAA'][i % 6]);
const CTA = [pm.cta + .05, pm.cta + .75, pm.cta + 1.5];
const TYPE = 'ฉันหาคะแนนรวมก่อน แล้วลบ!';
sfx('whoosh', PR + .02, .6); sfx('pop', PR + pm.who + .1, .7);
COMMENTS.forEach((_, i) => sfx('msg', PR + pm.comment + i * .45, .9));
for (let i = 0; i < 8; i++) sfx('click', PR + pm.comment + 1.6 + i * .09, .3);
sfx('pop', PR + pm.method + .05, .7); for (let i = 0; i < 14; i++) sfx('type', PR + pm.method + .4 + i * .1, .5);
sfx('whoosh', PR + pm.practice - .05, .6); for (let i = 0; i < 6; i++) sfx('pop', PR + pm.practice + .3 + i * .12, .4);
sfx('whoosh', PR + pm.brand - .1, .7); sfx('riser', PR + pm.brand - .3, .5); sfx('sparkle', PR + pm.brand + .5, .9); sfx('ding', PR + pm.brand + .3, .6);
sfx('whoosh', PR + pm.bank - .05, .6); for (let i = 0; i < 6; i++) sfx('coin', PR + pm.bank + .2 + i * .14, .4); sfx('pop', PR + pm.weekly + .05, .8);
CTA.forEach(c => { sfx('click', PR + c + .35, .9); sfx('pop', PR + c + .4, .7); });
sfx('whoosh', PR + pm.bye - .1, .7); sfx('ding', PR + pm.bye + .3, .8); sfx('sparkle', PR + pm.bye + .5, .9);
mark('endcard', PR + pm.bye);

function drawS6(t) {
  const u = t - PR;
  const ph1 = pm.practice, ph2 = pm.brand, ph3 = pm.bank, ph4 = pm.bye;
  show(pQ1, L(u, pm.who, ph1 - .1, { el: true, d: .7 }));
  show(pCom, L(u, pm.who + .2, ph1 - .1, { from: .8, dy: 60 }));
  pBub.forEach((b, i) => { const l = L(u, pm.comment + i * .45, 1e9, { from: .6, dy: 30, d: .4 }); tf(b, { ...l, x: (1 - E.out(P(u, pm.comment + i * .45, .4))) * -80 });
    b.querySelector('.lk').textContent = Math.max(0, Math.floor((u - pm.comment - 1.5 - i * .2) * 6 * (3 - i)));
  });
  const ty = Math.floor(clamp((u - pm.method - .4) / 1.5) * TYPE.length);
  pCom.querySelector('.ty').textContent = u > pm.method + .4 ? TYPE.slice(0, ty) : 'พิมพ์วิธีคิดของคุณ...';
  pCom.querySelector('.ty').style.color = u > pm.method + .4 ? '#142B53' : '#7A8BA3';
  pCom.querySelector('.cur').style.opacity = Math.floor(u * 2.5) % 2;
  show(pQ2, L(u, pm.method, ph1 - .1, { el: true, d: .7 }));
  // practice more
  const mm = L(u, ph1, ph2 + .3, { from: .3, dy: 160, el: true, d: .8, out: .3 });
  tf(pMas, { ...mm, y: mm.y + bob(u, 0, 6) });
  fit(pPract, 600); show(pPract, L(u, ph1 + .2, ph2 - .1, { el: true, d: .7 }));
  pSyms.forEach((e, i) => { const a = i / 6 * Math.PI * 2 + u * .6, l = L(u, ph1 + .3 + i * .12, ph2, { from: .2, dy: 0, el: true, d: .6 });
    tf(e, { ...l, x: 540 + Math.cos(a) * 280 - 48, y: 900 + Math.sin(a) * 250 - 48, r: Math.sin(u * 2 + i) * 12 }); });
  // brand
  const lg = L(u, ph2, ph4, { from: .2, dy: 200, el: true, d: 1 });
  const toTop = E.inOut(P(u, ph3, .6));
  tf(pLogo, { ...lg, x: 0, y: lg.y + bob(u, 0, 6) - toTop * 70, s: lg.s * lerp(1, .42, toTop) });
  pLogo.style.transformOrigin = '50% 0%';
  show(pWord, L(u, ph2 + .4, ph3, { from: .5, dy: 40, d: .6 }));
  show(pThai, L(u, ph2 + .7, ph3, { from: .4, dy: 30, el: true, d: .7 }));
  show(pPoster, { ...L(u, ph3, ph4, { from: .6, dy: 80, d: .6 }), r: -2 });
  show(pBank, L(u, ph3 + .1, ph4, { el: true, d: .7 }));
  pBank.querySelector('.n').textContent = (Math.round(10000 * E.out(P(u, ph3 + .2, .9)) / 100) * 100).toLocaleString('en-US') + '+';
  show(pWeek, L(u, pm.weekly, ph4, { el: true, d: .7 }));
  pBtns.forEach((b, i) => { const l = L(u, pm.cta - .2 + i * .1, ph4, { from: .3, dy: 40, el: true, d: .6 });
    const pr = NSP.pressDepth(u, [CTA[i] + .35]); tf(b, { ...l, s: l.s * (1 - .1 * pr) * pulse(u, CTA[i] + .4, .5, .12) }); });
  // pointer hand taps LIKE → SHARE → FOLLOW
  let hx = 0, hy = 0, ho = 0;
  for (let i = 0; i < 3; i++) { const a = CTA[i], nx = 330 + i * 210, k = E.inOut(P(u, a - .1, .4)); if (u > a - .1) { const px = i ? 330 + (i - 1) * 210 : 760; hx = lerp(px, nx, k); hy = lerp(i ? 1240 : 1460, 1240, k); } }
  ho = clamp((u - CTA[0] + .3) * 4) * (1 - P(u, ph4 - .3, .2));
  tf(pHand, { x: hx, y: hy + 10 * NSP.pressDepth(u, CTA.map(c => c + .35)), o: ho });
  // end card
  const ue = u - ph4;
  pEnd.style.display = ue < 0 ? 'none' : 'block';
  pEnd.style.clipPath = `circle(${E.out(P(ue, 0, .5)) * 1300}px at 540px 900px)`;
  tf(eLogo, { ...L(ue, .1, 1e9, { from: .2, dy: 0, el: true, d: 1 }), y: bob(ue, 0, 8) });
  show(eWord, L(ue, .35, 1e9, { from: .5, dy: 40 }));
  show(eTag, L(ue, .55, 1e9, { from: .5, dy: 40 }));
  show(eBye, { ...L(ue, .75, 1e9, { from: .4, dy: 30, el: true, d: .7 }), s: L(ue, .75, 1e9, { from: .4, dy: 30, el: true, d: .7 }).s * (1 + .03 * Math.sin(ue * 5)) });
  show(eRow, L(ue, 1.0, 1e9, { from: .5, dy: 30 }));
  NSP.drawConfetti(econf, t, PR + ph4 + .3, 2.6);
}

// '×' glyph fix (Prompt's multiplication sign is tiny): draw it, like the engine's '+' fix
{ const w = document.createTreeWalker($('stage'), NodeFilter.SHOW_TEXT); const hits = []; let n;
  while ((n = w.nextNode())) if (/[×÷]/.test(n.nodeValue) && !n.parentElement.closest('svg')) hits.push(n);
  hits.forEach(n => { const sp = document.createElement('span'); sp.innerHTML = n.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\s?×\s?/g, ' <i class="mx"></i> ').replace(/\s?÷\s?/g, ' <i class="dv"></i> '); n.replaceWith(sp); }); }
// ======================================================================
NSP.start({
  ep: 'EP.45 · ค่าเฉลี่ย',
  wipes: [ST0, KN0, EX0, QS, PR],
  brand: { showAt: -1, hideAt: PR + pm.brand },
  scenes: [
    { el: $('s1'), a: 0, b: KN0, draw: drawS1 },
    { el: $('s3'), a: KN0, b: EX0, draw: drawS3 },
    { el: $('s4'), a: EX0, b: QS, draw: drawS4 },
    { el: $('s5'), a: QS, b: PR, draw: drawS5 },
    { el: $('s6'), a: PR, b: 1e9, draw: drawS6 },
  ],
});
})();
