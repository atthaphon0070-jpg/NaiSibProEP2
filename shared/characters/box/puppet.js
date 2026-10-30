// Flat-vector "paper puppet" characters: jointed limbs with visible pins, simple faces, outfits.
// Pure function of (character, pose, t). Units are px at scale 1; a character is ~560 px tall.
"use strict";

const PUP_HAND = {};   // last drawn hand positions in canvas pixels, e.g. PUP_HAND.tonL, PUP_HAND.tonN
const PUP = { legU: 112, legL: 108, hipW: 24, torso: 168, neck: 12, shW: 58, armU: 84, armL: 78, headW: 108, headH: 120 };

// Characters (original designs). BOX is based on the channel owner's look.
const CHARS = {
  box: {
    name: "บ็อกซ์", skin: "#e2b28c", skinShade: "#c99570", hair: "#8a3b20", hairHi: "#b45a32", hairStyle: "fringe",
    shirt: "#6f9cc9", shirtShade: "#5a84ae", shirtOpen: true, tee: "#f3f1ec", bottom: "#d8bf98", bottomShade: "#c2a77f", shorts: true,
    sock: "#f4f4f4", shoe: "#f2f2f2", sole: "#9aa0a6", sunglasses: true, necklace: true, watch: true, brow: "#4a1d10", iris: "#5a3420",
  },
  mint: {
    name: "มิ้นท์", skin: "#efc6a4", skinShade: "#d9a986", hair: "#1f1a1a", hairHi: "#3a3030", hairStyle: "long",
    shirt: "#e0795c", shirtShade: "#c9644a", hoodie: true, tee: "#e0795c", bottom: "#2f3a4c", bottomShade: "#273142", shorts: false,
    sock: "#2f3a4c", shoe: "#f0f0f0", sole: "#8f969c", backpack: "#4d5c4a", brow: "#120e0e", iris: "#3b2418", lashes: true,
  },
  shadow: {
    name: "เงา", skin: "#0b0a0f", skinShade: "#0b0a0f", hair: "#0b0a0f", hairHi: "#0b0a0f", hairStyle: "short",
    shirt: "#0b0a0f", shirtShade: "#0b0a0f", tee: "#0b0a0f", bottom: "#0b0a0f", bottomShade: "#0b0a0f", shorts: false,
    sock: "#0b0a0f", shoe: "#0b0a0f", sole: "#0b0a0f", silhouette: true,
  },
  ton: {
    name: "ต้น", skin: "#b9805a", skinShade: "#9c6744", hair: "#151414", hairHi: "#2a2828", hairStyle: "short",
    shirt: "#8d9399", shirtShade: "#767c82", shirtOpen: true, tee: "#d9a441", bottom: "#4a5a41", bottomShade: "#3e4c37", shorts: false,
    sock: "#4a5a41", shoe: "#6b4a33", sole: "#3b2a1e", cap: "#1d1d1f", flashlight: true, brow: "#0e0c0c", iris: "#2e1b12",
  },
};

// ---------- poses ----------
// A pose is a set of angles (radians). Arms/legs: 0 = hanging straight down; positive = away from the body.
// Elbow/knee bends are added to the parent angle. lift: 0..1 raises a foot (front-view walking).
const POSE_IDLE = { sway: 0, torso: 0, head: 0, lookX: 0, lookY: 0, shR: 0.12, elR: -0.12, shL: 0.12, elL: -0.12, hipR: 0.04, kneeR: 0, liftR: 0, hipL: 0.04, kneeL: 0, liftL: 0, bob: 0 };
function pose(over) { return Object.assign({}, POSE_IDLE, over); }
function mixPose(a, b, p) { const o = {}; for (const k in a) o[k] = typeof a[k] === "number" ? lerp(a[k], b[k] ?? a[k], p) : (p < 0.5 ? a[k] : b[k]); return o; }
// Front-view walk: feet alternate lifting, arms swing, body bobs.
function walkPose(ph, amt = 1) {
  const s = Math.sin(ph), c = Math.cos(ph);
  return pose({ liftR: Math.max(0, s) * 0.9 * amt, liftL: Math.max(0, -s) * 0.9 * amt, hipR: 0.04, hipL: 0.04,
    shR: 0.13 + 0.07 * s * amt, elR: -0.18 - 0.32 * Math.max(0, -s) * amt, shL: 0.13 - 0.07 * s * amt, elL: -0.18 - 0.32 * Math.max(0, s) * amt,
    bob: -Math.abs(c) * 7 * amt, torso: 0.018 * s * amt, head: -0.015 * s * amt, sway: 5 * s * amt });
}
// Two-bone IK: arm angles that put the hand at (tx, ty) in torso coordinates (pelvis at 0,0, up = -y).
// sgn -1 = character's right arm (screen left), +1 = left arm. The elbow bends outward.
function reach(sgn, tx, ty) {
  const sx = sgn * (PUP.shW - 6), sy = -PUP.torso + 16, U = PUP.armU, Lw = PUP.armL;
  const d = Math.min(Math.hypot(tx - sx, ty - sy), (U + Lw) * 0.999);
  const base = Math.atan2((tx - sx) * sgn, ty - sy), alpha = Math.acos(clamp((U * U + d * d - Lw * Lw) / (2 * U * d), -1, 1));
  // two solutions (elbow out or in); keep the one whose elbow hangs lower, like a relaxed arm
  const cand = [base + alpha, base - alpha].map(a => ({ a, ex: sx + Math.sin(a) * sgn * U, ey: sy + Math.cos(a) * U })).sort((p, q) => q.ey - p.ey)[0];
  const sh = cand.a, ex = cand.ex, ey = cand.ey;
  const a2 = Math.atan2((tx - ex) * sgn, ty - ey);
  return sgn < 0 ? { shR: sh, elR: a2 - sh } : { shL: sh, elL: a2 - sh };
}
// head-relative target helpers (face at about y = -T - neck - headH/2)
const FACE_Y = -PUP.torso - PUP.neck - 6 - PUP.headH / 2;

const POSES = {
  idle: pose({}),
  scared: pose(Object.assign({ torso: -0.04, head: 0.05, hipR: 0.12, hipL: 0.12, bob: 6 }, reach(-1, -20, -PUP.torso + 70), reach(1, 20, -PUP.torso + 70))),
  point: pose({ shL: 2.1, elL: 0.1, head: -0.05, lookX: 1 }),
  glasses: pose(Object.assign({ head: 0.06, lookY: 0.3 }, reach(-1, -46, FACE_Y + 6))),   // hand to the sunglasses
  flashlight: pose({ shL: 1.35, elL: -0.25, lookX: 0.8 }),
  thinking: pose(Object.assign({ head: -0.08, lookY: -0.6 }, reach(-1, -8, FACE_Y + 52))),
  wai: pose(Object.assign({ head: 0.08, lookY: 0.6 }, reach(-1, -3, -PUP.torso + 52), reach(1, 3, -PUP.torso + 52))),
  scared2: pose(Object.assign({ torso: -0.04, head: 0.05, bob: 6, brow: 1 }, reach(-1, -16, FACE_Y + 50), reach(1, 16, FACE_Y + 50))),
};

// ---------- drawing ----------
function band(x1, y1, x2, y2, w, col) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "butt"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }   // square-ended strip (hems, cuffs)
function cap(x1, y1, x2, y2, w, col) { ctx.strokeStyle = col; ctx.lineWidth = w; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(x1, y1); ctx.lineTo(x2, y2); ctx.stroke(); }
const SHOW_PINS = false;   // owner: joints must not show; limbs overlap cleanly instead
function jointPin(x, y) { if (!SHOW_PINS) return; ctx.fillStyle = "rgba(30,28,26,0.85)"; ctx.beginPath(); ctx.arc(x, y, 4.6, 0, 6.283); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.55)"; ctx.beginPath(); ctx.arc(x - 1.2, y - 1.2, 1.5, 0, 6.283); ctx.fill(); }
const dirv = (a, sgn) => [Math.sin(a) * sgn, Math.cos(a)];

// ---------- BODY v2 (2026-10-26): hands, flashlight aim, clothing details ----------
// Flashlight: pass opts.aim = {x, y} (canvas px) to point the torch at a target. Without it, the torch follows the
// target used by beam()/flashCone() on the previous frame (if the hand has not jumped), else the forearm.
// PUP_HAND.<ch><side> also carries .lx/.ly (lens tip, canvas px) and .ang (beam direction, radians).
const PUP_AIM = {};
function aimLocal(hxLocal, hyLocal, key, aim, fallbackAng) {
  const M = ctx.getTransform(), hp = M.transformPoint(new DOMPoint(hxLocal, hyLocal));
  let tgt = aim;
  if (!tgt) { const m = PUP_AIM[key]; if (m && Math.hypot(m.hx - hp.x, m.hy - hp.y) < 60) tgt = { x: m.tx, y: m.ty }; }
  if (!tgt) return fallbackAng;
  const dx = tgt.x - hp.x, dy = tgt.y - hp.y, det = M.a * M.d - M.b * M.c;   // canvas vector -> local vector
  const lx = (M.d * dx - M.c * dy) / det, ly = (-M.b * dx + M.a * dy) / det;
  return Math.atan2(ly, lx);
}
// Torch body along local angle `ang` from the hand; returns the lens tip in canvas px.
function drawTorch(hx, hy, ang, s = 1) {
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang - Math.PI / 2);
  ctx.fillStyle = "#2b2b2e"; roundRect(-7 * s, -14 * s, 14 * s, 44 * s, 5 * s); ctx.fill();             // grip
  ctx.fillStyle = "#3a3a3e"; roundRect(-10 * s, 26 * s, 20 * s, 16 * s, 4 * s); ctx.fill();            // head
  ctx.fillStyle = "#c9c9c9"; ctx.fillRect(-10.5 * s, 40 * s, 21 * s, 4 * s);                             // bezel
  ctx.fillStyle = "rgba(255,246,210,0.95)"; ctx.fillRect(-8 * s, 43 * s, 16 * s, 2.5 * s);               // lens
  ctx.fillStyle = "rgba(255,255,255,0.25)"; ctx.fillRect(-5 * s, -10 * s, 3 * s, 34 * s);                // sheen
  ctx.restore();
  return ctx.getTransform().transformPoint(new DOMPoint(hx + Math.cos(ang) * 45 * s, hy + Math.sin(ang) * 45 * s));
}
// Hand along the forearm direction `ang` (local radians). mode: "open" (mitten + thumb), "fist", "grip" (holding a prop).
function drawHand(hx, hy, ang, C2, mode = "open", sgn = 1, k = 1) {
  const skin = k === 1 ? C2.skin : shadeOf(C2.skin, k), sh = shadeOf(C2.skinShade, k === 1 ? 1 : k);
  ctx.save(); ctx.translate(hx, hy); ctx.rotate(ang);
  if (mode === "open") {
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(6, 0, 17, 13, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(2, -sgn * 11, 7, 5, -sgn * 0.5, 0, 6.283); ctx.fill();   // thumb
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(3, -sgn * 10, 6, 4.4, -sgn * 0.5, 0, 6.283); ctx.fill();
  } else {
    ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(2, 0, 15, 14, 0, 0, 6.283); ctx.fill();
    ctx.strokeStyle = sh; ctx.lineWidth = 2; ctx.lineCap = "round"; ctx.beginPath();
    for (let i = -1; i <= 1; i++) { ctx.moveTo(10, i * 6); ctx.lineTo(14, i * 6); }   // knuckles
    ctx.stroke();
    if (mode === "grip") { ctx.fillStyle = sh; ctx.beginPath(); ctx.ellipse(-2, -sgn * 10, 7, 4.5, 0, 0, 6.283); ctx.fill(); }
  }
  ctx.restore();
}

// face: { mouth: "closed"|"smile"|"open"|"o"|"scared"|"sad", talk: 0..1, blink: 0..1, brow: -1..1 (frown..raise), sparkle: 0..1 }
// FACE v2: also face.emo (see EMO below) for full expressions; legacy keys still work.
// opts: flip, squash, fingerR / fingerL (pointing index finger)
function drawPuppet(ch, x, y, s, P, face = {}, t = 0, opts = {}) {
  const C2 = CHARS[ch] || ch, flip = opts.flip ? -1 : 1;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * flip * (opts.squash ?? 1), s);
  // soft contact shadow
  ctx.fillStyle = "rgba(0,0,0,0.28)"; ctx.beginPath(); ctx.ellipse(0, 4, 78, 13, 0, 0, 6.283); ctx.fill();
  const legLen = PUP.legU + PUP.legL + 14;
  ctx.translate(P.sway || 0, -legLen + (P.bob || 0));
  // legs (pelvis at 0,0)
  const leg = (sgn, hip, knee, lift) => {
    // lift: the knee comes toward the camera, so thigh and shin foreshorten and the foot rises under the hip
    const hx = sgn * PUP.hipW, up = PUP.legU * (1 - 0.42 * lift), lo = PUP.legL * (1 - 0.22 * lift);
    const [dx, dy] = dirv(hip + 0.05 * lift, sgn), kx = hx + dx * up, ky = dy * up;
    const [ex, ey] = dirv(hip + knee - 0.12 * lift, sgn), ax = kx + ex * lo, ay = ky + ey * lo;
    const low = C2.shorts ? C2.skin : C2.bottom;
    // lower leg (skin or trouser), thigh, shoe
    cap(kx, ky, ax, ay - 6, 32, low);
    if (!C2.shorts) { cap(kx + sgn * 6, ky + 8, ax + sgn * 5, ay - 14, 3, C2.bottomShade); band(ax, ay - 15, ax, ay - 6, 32, C2.bottomShade); }   // crease + hem
    if (C2.shorts && !opts.barefoot) cap(ax, ay - 16, ax, ay - 4, 31, C2.sock);
    cap(hx, 0, kx, ky, 36, low);
    if (lift > 0.15) { ctx.fillStyle = C2.shorts ? C2.skinShade : C2.bottomShade; ctx.globalAlpha = Math.min(1, lift) * 0.45; ctx.beginPath(); ctx.ellipse(kx, ky + 2, 17, 9, 0, 0, 6.283); ctx.fill(); ctx.globalAlpha = 1; }   // bent knee
    if (C2.shorts) {
      cap(hx, -2, hx + (kx - hx) * 0.4, ky * 0.4, 44, C2.bottom); band(hx, 0, hx + (kx - hx) * 0.88, ky * 0.88, 44, C2.bottom);
      cap(hx + sgn * 8, -2, hx + sgn * 8 + (kx - hx) * 0.6, ky * 0.6, 14, C2.bottomShade);   // cargo pocket
      band(hx + (kx - hx) * 0.78, ky * 0.78, hx + (kx - hx) * 0.88, ky * 0.88, 44, C2.bottomShade);   // shorts hem
    }
    // shoe (seen a little from below while lifted), toe cap, laces
    if (opts.barefoot) { ctx.fillStyle = C2.skin; ctx.beginPath(); ctx.ellipse(ax + sgn * 6, ay + 6, 22, 10, 0, 0, 6.283); ctx.fill(); return; }
    const fy = 1 - 0.25 * lift;
    ctx.fillStyle = C2.shoe; ctx.beginPath(); ctx.ellipse(ax + sgn * 8, ay + 4, 30, 15 * fy, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = C2.sole; ctx.fillRect(ax + sgn * 8 - 30, ay + 10 * fy, 60, 7);
    ctx.strokeStyle = shadeOf(C2.shoe, 0.72); ctx.lineWidth = 2.2; ctx.lineCap = "round"; ctx.beginPath();
    ctx.moveTo(ax + sgn * 8 + sgn * 14, ay - 4 * fy); ctx.quadraticCurveTo(ax + sgn * 8 + sgn * 22, ay + 4 * fy, ax + sgn * 8 + sgn * 15, ay + 11 * fy);   // toe cap
    for (let i = 0; i < 2; i++) { ctx.moveTo(ax - 7 + i * 7, ay - 8 * fy); ctx.lineTo(ax - 3 + i * 7, ay - 4 * fy); }   // laces
    ctx.stroke();
    jointPin(kx, ky);
  };
  leg(-1, P.hipR, P.kneeR, P.liftR); leg(1, P.hipL, P.kneeL, P.liftL);
  if (C2.legsExtra) C2.legsExtra("front", P, t);   // EXTRAS (extras.js): sarong over the legs etc.
  // torso
  ctx.save(); ctx.rotate(P.torso || 0);
  const T = PUP.torso, sw = PUP.shW;
  if (C2.hairStyle === "long") {   // hair falling behind the shoulders, drawn under the body
    ctx.save(); ctx.translate(0, -T - PUP.neck - 6); ctx.rotate(P.head || 0); ctx.translate(0, -PUP.headH / 2);
    const w = PUP.headW, h = PUP.headH; ctx.fillStyle = C2.hair;
    ctx.beginPath(); ctx.moveTo(-w * 0.55, -10); ctx.quadraticCurveTo(-w * 0.66, h * 0.7, -w * 0.5, h * 0.98); ctx.lineTo(w * 0.5, h * 0.98); ctx.quadraticCurveTo(w * 0.66, h * 0.7, w * 0.55, -10); ctx.closePath(); ctx.fill();
    ctx.restore();
  }
  if (C2.backpack) { ctx.fillStyle = C2.backpack; roundRect(-50, -T + 20, 100, 130, 22); ctx.fill(); }
  const body = new Path2D(); body.moveTo(-sw, -T + 6); body.quadraticCurveTo(0, -T - 8, sw, -T + 6); body.lineTo(sw - 6, 4); body.quadraticCurveTo(0, 12, -sw + 6, 4); body.closePath();
  ctx.fillStyle = C2.tee; ctx.fill(body);
  if (C2.shirtOpen) {
    ctx.save(); ctx.clip(body);
    ctx.fillStyle = C2.shirt;
    ctx.beginPath(); ctx.moveTo(-sw - 4, -T); ctx.lineTo(-16, -T); ctx.lineTo(-6, -T + 70); ctx.lineTo(-10, 14); ctx.lineTo(-sw - 4, 14); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(sw + 4, -T); ctx.lineTo(16, -T); ctx.lineTo(6, -T + 70); ctx.lineTo(10, 14); ctx.lineTo(sw + 4, 14); ctx.closePath(); ctx.fill();
    ctx.fillStyle = C2.shirtShade; ctx.fillRect(sw - 18, -T, 24, T + 20);
    roundRect(-sw + 10, -T + 52, 26, 28, 4); ctx.fill();                                  // chest pocket
    ctx.fillStyle = shadeOf(C2.shirtShade, 0.85); ctx.fillRect(-sw + 10, -T + 52, 26, 6);   // pocket flap
    ctx.fillStyle = C2.shirtShade; ctx.fillRect(-sw - 4, -2, 2 * sw + 8, 14);              // hem
    // collar flaps
    ctx.fillStyle = C2.shirtShade;
    ctx.beginPath(); ctx.moveTo(-16, -T); ctx.lineTo(-34, -T + 2); ctx.lineTo(-14, -T + 46); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(16, -T); ctx.lineTo(34, -T + 2); ctx.lineTo(14, -T + 46); ctx.closePath(); ctx.fill();
    ctx.restore();
    ctx.fillStyle = "#f7f7f7"; for (let i = 0; i < 3; i++) { ctx.beginPath(); ctx.arc(-9, -T + 92 + i * 30, 3, 0, 6.283); ctx.fill(); }
  } else {
    ctx.fillStyle = C2.shirtShade; ctx.save(); ctx.clip(body); ctx.fillRect(sw - 20, -T, 26, T + 20); ctx.restore();
    if (C2.hoodie) {
      ctx.strokeStyle = "rgba(255,255,255,0.85)"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-10, -T + 8); ctx.lineTo(-12, -T + 60); ctx.moveTo(10, -T + 8); ctx.lineTo(12, -T + 60); ctx.stroke();
      ctx.fillStyle = C2.shirtShade; roundRect(-36, -T + 98, 72, 40, 10); ctx.fill();
      ctx.strokeStyle = shadeOf(C2.shirtShade, 0.85); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(-30, -T + 104); ctx.lineTo(-30, -T + 132); ctx.moveTo(30, -T + 104); ctx.lineTo(30, -T + 132); ctx.stroke();   // pocket openings
      ctx.save(); ctx.clip(body); ctx.fillStyle = C2.shirtShade; ctx.fillRect(-sw - 4, -12, 2 * sw + 8, 26); ctx.restore();   // ribbed hem band
      ctx.fillStyle = "#f2f2f2"; ctx.beginPath(); ctx.arc(-12, -T + 62, 3, 0, 6.283); ctx.arc(12, -T + 62, 3, 0, 6.283); ctx.fill();   // drawstring tips
    }
  }
  if (C2.backpack) { cap(-sw + 14, -T + 4, -sw + 18, -T + 110, 9, C2.backpack); cap(sw - 14, -T + 4, sw - 18, -T + 110, 9, C2.backpack); }
  if (C2.dress) C2.dress("front", T, t);   // extra clothing details (zombie rags, prints)
  if (C2.necklace) { const cols = ["#e7d36a", "#9ad1c4", "#f2f2f2", "#e59ab3", "#8fbf6a"]; for (let i = 0; i <= 10; i++) { const a = Math.PI * (0.18 + 0.64 * i / 10); ctx.fillStyle = cols[i % cols.length]; ctx.beginPath(); ctx.arc(Math.cos(a) * 20, -T + 4 + Math.sin(a) * 20, 3.2, 0, 6.283); ctx.fill(); } }
  // neck
  cap(0, -T - 4, 0, -T - PUP.neck - 8, 24, C2.skinShade);
  // arms
  const arm = (sgn, sh, el, front) => {
    const sx = sgn * (sw - 6), sy = -T + 16, [dx, dy] = dirv(sh, sgn), exx = sx + dx * PUP.armU, eyy = sy + dy * PUP.armU;
    const [fx, fy] = dirv(sh + el, sgn), hx = exx + fx * PUP.armL, hy = eyy + fy * PUP.armL;
    cap(exx, eyy, hx, hy, 24, C2.hoodie ? C2.shirt : C2.skin);
    if (C2.hoodie) band(exx + fx * PUP.armL * 0.8, eyy + fy * PUP.armL * 0.8, exx + fx * PUP.armL * 0.94, eyy + fy * PUP.armL * 0.94, 24, C2.shirtShade);   // ribbed cuff
    cap(sx, sy, exx, eyy, 27, C2.skin);
    const sleeve = C2.hoodie ? 1 : 0.55; cap(sx, sy, sx + dx * PUP.armU * sleeve, sy + dy * PUP.armU * sleeve, 36, C2.shirt);
    if (!C2.hoodie) band(sx + dx * PUP.armU * (sleeve - 0.09), sy + dy * PUP.armU * (sleeve - 0.09), sx + dx * PUP.armU * sleeve, sy + dy * PUP.armU * sleeve, 34, C2.shirtShade);   // sleeve hem
    if (C2.watch && sgn === 1) cap(exx + fx * PUP.armL * 0.82, eyy + fy * PUP.armL * 0.82, exx + fx * PUP.armL * 0.92, eyy + fy * PUP.armL * 0.92, 27, "#d5d9de");
    const key = ch + (sgn < 0 ? "R" : "L"), foreAng = Math.atan2(fy, fx);
    const torch = C2.flashlight && sgn === 1 && !opts.noFlash;
    let lens = null, beamAng = foreAng;
    if (torch) { beamAng = aimLocal(hx, hy, key, opts.aim, foreAng); lens = drawTorch(hx, hy, beamAng); }
    const pointing = sgn < 0 ? opts.fingerR : opts.fingerL;
    if (pointing) cap(hx, hy, hx + fx * 27, hy + fy * 27, 10, C2.skin);   // pointing index finger
    drawHand(hx, hy, torch ? beamAng : foreAng, C2, torch ? "grip" : pointing ? "fist" : (opts.hand || "open"), sgn);
    const hp = ctx.getTransform().transformPoint(new DOMPoint(hx, hy)); hp.key = key;
    if (lens) { hp.lx = lens.x; hp.ly = lens.y; hp.ang = Math.atan2(lens.y - hp.y, lens.x - hp.x); }
    PUP_HAND[key] = hp;
    jointPin(exx, eyy);
    return [hx, hy];
  };
  const handR = arm(-1, P.shR, P.elR), handL = arm(1, P.shL, P.elL);
  // head
  ctx.save(); ctx.translate(0, -T - PUP.neck - 6); ctx.rotate(P.head || 0); ctx.translate(0, -PUP.headH / 2);
  drawHead(C2, face, P, t);
  ctx.restore();
  // hands raised to the face (cover mouth, touch glasses) must sit in front of the head
  if (handR[1] < -T - 4) arm(-1, P.shR, P.elR);
  if (handL[1] < -T - 4) arm(1, P.shL, P.elL);
  ctx.restore(); // torso
  ctx.restore();
  return handL;
}

function drawHead(C2, face, P, t) {
  const w = PUP.headW, h = PUP.headH;
  // ears + face
  ctx.fillStyle = C2.skinShade; ctx.beginPath(); ctx.ellipse(-w / 2, 6, 11, 16, 0, 0, 6.283); ctx.ellipse(w / 2, 6, 11, 16, 0, 0, 6.283); ctx.fill();
  ctx.fillStyle = C2.skin; ctx.beginPath(); ctx.moveTo(-w / 2, -h * 0.25); ctx.bezierCurveTo(-w / 2, h * 0.38, -w * 0.3, h / 2, 0, h / 2); ctx.bezierCurveTo(w * 0.3, h / 2, w / 2, h * 0.38, w / 2, -h * 0.25);
  ctx.bezierCurveTo(w / 2, -h * 0.55, -w / 2, -h * 0.55, -w / 2, -h * 0.25); ctx.fill();
  ctx.fillStyle = "rgba(0,0,0,0.06)"; ctx.beginPath(); ctx.ellipse(w * 0.2, h * 0.12, w * 0.28, h * 0.36, 0, 0, 6.283); ctx.fill();
  // eyes, cheeks, nose, mouth (see FACE v2 below); brows are drawn after the hair so bangs never hide them
  const F = resolveFace(face, C2);
  const lx = (P.lookX || 0) * 4, ly = (P.lookY || 0) * 3;
  const eyeY = 2 + ly;
  if (C2.zombie) zombieFace(C2, face, lx, eyeY, t);   // creatures.js (EP09): hollow white eyes, slack mouth
  else if (!C2.sunglasses || (face.glassesDown || 0) > 0.3) drawEyes(C2, F, lx, eyeY, t);
  if (!C2.zombie) drawCheeks(F);
  ctx.strokeStyle = shadeOf(C2.skinShade, 0.85); ctx.lineWidth = 2.6; ctx.lineCap = "round"; ctx.beginPath(); ctx.moveTo(2, 11); ctx.quadraticCurveTo(6.5, 19, 0, 21.5); ctx.stroke();
  if (!C2.zombie) drawMouth(C2, F, t);
  // front hair
  ctx.fillStyle = C2.hair;
  if (C2.hairStyle === "fringe") {
    ctx.beginPath(); ctx.moveTo(-w * 0.58, 4); ctx.bezierCurveTo(-w * 0.66, -h * 0.62, w * 0.66, -h * 0.66, w * 0.58, 2);
    ctx.lineTo(w * 0.42, -6); ctx.lineTo(w * 0.32, -14); ctx.lineTo(w * 0.18, -8); ctx.lineTo(w * 0.04, -16); ctx.lineTo(-w * 0.12, -9); ctx.lineTo(-w * 0.26, -15); ctx.lineTo(-w * 0.4, -6); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C2.hairHi; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * 0.3, -h * 0.4); ctx.quadraticCurveTo(-w * 0.05, -h * 0.5, w * 0.2, -h * 0.42); ctx.stroke();
  } else if (C2.hairStyle === "long") {
    // full cap over the crown, side locks down to the jaw, straight bangs at the brow
    ctx.beginPath(); ctx.moveTo(-w * 0.57, 46); ctx.lineTo(-w * 0.58, -h * 0.28);
    ctx.bezierCurveTo(-w * 0.58, -h * 0.74, w * 0.58, -h * 0.74, w * 0.58, -h * 0.28); ctx.lineTo(w * 0.57, 46);
    ctx.quadraticCurveTo(w * 0.5, 2, w * 0.43, -22); ctx.quadraticCurveTo(0, -27, -w * 0.43, -22); ctx.quadraticCurveTo(-w * 0.5, 2, -w * 0.57, 46); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C2.hairHi; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * 0.28, -h * 0.42); ctx.quadraticCurveTo(0, -h * 0.52, w * 0.28, -h * 0.42); ctx.stroke();
    ctx.strokeStyle = C2.hairHi; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * 0.25, -h * 0.42); ctx.quadraticCurveTo(0, -h * 0.5, w * 0.25, -h * 0.42); ctx.stroke();
  } else if (C2.hairStyle === "messy") {   // uneven spiky tufts (zombies)
    ctx.beginPath(); ctx.moveTo(-w * 0.56, 4); ctx.lineTo(-w * 0.7, -h * 0.2); ctx.lineTo(-w * 0.55, -h * 0.3); ctx.lineTo(-w * 0.62, -h * 0.52); ctx.lineTo(-w * 0.36, -h * 0.5);
    ctx.lineTo(-w * 0.3, -h * 0.74); ctx.lineTo(-w * 0.1, -h * 0.56); ctx.lineTo(w * 0.06, -h * 0.78); ctx.lineTo(w * 0.2, -h * 0.56); ctx.lineTo(w * 0.42, -h * 0.68); ctx.lineTo(w * 0.44, -h * 0.42);
    ctx.lineTo(w * 0.68, -h * 0.36); ctx.lineTo(w * 0.56, -h * 0.16); ctx.lineTo(w * 0.62, 2); ctx.lineTo(w * 0.44, -18); ctx.lineTo(w * 0.3, -10); ctx.lineTo(w * 0.16, -24); ctx.lineTo(-w * 0.02, -12);
    ctx.lineTo(-w * 0.18, -26); ctx.lineTo(-w * 0.3, -12); ctx.lineTo(-w * 0.44, -20); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C2.hairHi; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * 0.3, -h * 0.4); ctx.quadraticCurveTo(-w * 0.05, -h * 0.5, w * 0.2, -h * 0.42); ctx.stroke();
  } else {
    ctx.beginPath(); ctx.moveTo(-w * 0.54, -2); ctx.bezierCurveTo(-w * 0.6, -h * 0.6, w * 0.6, -h * 0.6, w * 0.54, -2); ctx.lineTo(w * 0.42, -24); ctx.lineTo(-w * 0.42, -24); ctx.closePath(); ctx.fill();
  }
  if (C2.headExtra) C2.headExtra("front", w, h, F, t);   // EXTRAS (extras.js): bun, hats, headscarf, wrinkles
  if (C2.hat) zombieHat(C2, w, h, false);
  if (C2.cap) { // backwards cap
    ctx.fillStyle = C2.cap; ctx.beginPath(); ctx.ellipse(0, -h * 0.34, w * 0.55, h * 0.24, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-w * 0.55, -h * 0.36, w * 1.1, 10);
    ctx.fillStyle = "#2e2e31"; roundRect(w * 0.3, -h * 0.4, w * 0.42, 12, 5); ctx.fill();
  }
  if (!C2.zombie) drawBrows(C2, F, eyeY);
  if (F.sweat) drawSweat(F.sweat, t);
  // sunglasses (glassesDown: 0 on the eyes .. 1 lowered to the nose tip)
  if (C2.sunglasses) {
    const gd = clamp(face.glassesDown || 0), gy = eyeY + 2 + gd * 22;
    ctx.save(); ctx.translate(0, gy);
    for (const sx of [-1, 1]) {
      const g = ctx.createLinearGradient(sx * 22 - 16, -12, sx * 22 + 16, 12); g.addColorStop(0, "#2a2f36"); g.addColorStop(0.5, "#545d68"); g.addColorStop(1, "#1d2127");
      ctx.fillStyle = g; roundRect(sx * 22 - 17, -11, 34, 21, 8); ctx.fill();
      ctx.strokeStyle = "rgba(255,255,255,0.35)"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx * 22 - 9, -6); ctx.lineTo(sx * 22 + 2, -6); ctx.stroke();
    }
    ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-5, -4); ctx.lineTo(5, -4); ctx.moveTo(-39, -4); ctx.lineTo(-54, -8); ctx.moveTo(39, -4); ctx.lineTo(54, -8); ctx.stroke();
    ctx.restore();
  }
}

// ---------- FACE v2 (2026-10-26): expressive eyes, tapered brows, mouth shapes, lip-sync visemes ----------
// face: legacy keys still work { mouth, talk, blink, brow, sparkle, glassesDown }.
// New: face.emo = "neutral"|"happy"|"laugh"|"talk"|"surprised"|"scared"|"sad"|"worried"|"angry"|"thinking"|"smirk"|"sparkle"
// Optional fine control: blush 0..1, sweat 0..1, lid 0..1 (upper lid droop).
const EMO = {
  neutral:   { eye: "normal", raise: 0,    tilt: 0,    mouth: "closed", blush: 0.18 },
  talk:      { eye: "normal", raise: 0.12, tilt: 0,    mouth: "closed", blush: 0.18 },
  happy:     { eye: "smile",  raise: 0.25, tilt: 0.1,  mouth: "grin",   blush: 0.38 },
  laugh:     { eye: "happy",  raise: 0.45, tilt: 0.2,  mouth: "laugh",  blush: 0.45 },
  surprised: { eye: "wide",   raise: 1,    tilt: 0,    mouth: "o",      blush: 0.15 },
  scared:    { eye: "wide",   raise: 0.75, tilt: 0.85, mouth: "scared", blush: 0.04, sweat: 1 },
  sad:       { eye: "sad",    raise: 0.15, tilt: 0.9,  mouth: "sad",    blush: 0.12, lid: 0.3, lidTilt: 0.9 },
  worried:   { eye: "normal", raise: 0.35, tilt: 0.75, mouth: "wavy",   blush: 0.12, sweat: 0.7, lid: 0.12, lidTilt: 0.6 },
  angry:     { eye: "normal", raise: -0.55, tilt: -1,  mouth: "flat",   blush: 0.1,  lid: 0.32, lidTilt: -1 },
  thinking:  { eye: "normal", raise: 0.25, tilt: 0,    mouth: "hmm",    blush: 0.15, asym: 0.75, lid: 0.15, look: [0.5, -0.5] },
  smirk:     { eye: "normal", raise: 0.1,  tilt: 0,    mouth: "smirk",  blush: 0.2,  asym: 0.55, lid: 0.28 },
  sparkle:   { eye: "sparkle", raise: 0.4, tilt: 0.1,  mouth: "grin",   blush: 0.45 },
};
function resolveFace(face, C2) {
  const F = Object.assign({ eye: "normal", raise: 0, tilt: 0, mouth: "closed", blush: 0.18, asym: 0, lid: 0, lidTilt: 0, sweat: 0, look: null }, EMO[face.emo] || {});
  if (!face.emo) {   // legacy keys only: map them onto the new face
    const m = face.mouth || "closed", b = face.brow || 0;
    F.mouth = m;
    if (m === "smile") { F.eye = "smile"; F.blush = 0.3; }
    if (m === "o") { F.eye = "wide"; }
    if (m === "scared") { F.eye = "wide"; F.tilt = 0.8; F.sweat = 0.8; }
    if (m === "sad") { F.eye = "sad"; F.tilt = 0.9; F.lid = 0.3; F.lidTilt = 0.9; }
    if (b > 0) F.raise = Math.max(F.raise, b);
    if (b < 0) { F.raise = b * 0.55; F.tilt = b; F.lid = Math.max(F.lid, -b * 0.3); F.lidTilt = -1; }
  }
  if (face.sparkle) { F.sparkle = face.sparkle; if (F.eye === "normal" || F.eye === "smile") F.eye = "sparkle"; }
  if (face.blush != null) F.blush = face.blush;
  if (face.sweat != null) F.sweat = face.sweat;
  if (face.lid != null) F.lid = face.lid;
  F.talk = clamp(face.talk || 0); F.blink = clamp(face.blink || 0);
  return F;
}
function shadeOf(hex, k) {   // darken (#rrggbb) by factor k
  const n = parseInt(hex.slice(1), 16), r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return `rgb(${Math.round(r * k)},${Math.round(g * k)},${Math.round(b * k)})`;
}
const INK = "#1b1513", LIP = "#6b2a26", MOUTH_IN = "#4e1a1a", TONGUE = "#e07a78", SCLERA = "#fbf8f3";

function drawEyes(C2, F, lx, eyeY, t) {
  const look = F.look ? [F.look[0] * 4, F.look[1] * 3] : [0, 0];
  for (const sx of [-1, 1]) {
    const cx = sx * 23 + lx * 0.4, cy = eyeY;
    const wide = F.eye === "wide", rx = wide ? 11 : 10, ry = wide ? 13.5 : 12;
    let lid = Math.max(F.lid, F.blink), lidTilt = F.lidTilt;
    if (F.asym) lid = Math.max(0, lid - (sx > 0 ? F.asym * 0.3 : 0));   // thinking/smirk: one eye a little more open
    if (F.eye === "happy" || lid > 0.9) {   // closed: ^ for happy, soft downward curve for blink
      ctx.strokeStyle = INK; ctx.lineWidth = 4; ctx.lineCap = "round"; ctx.beginPath();
      if (F.eye === "happy") { ctx.moveTo(cx - 9, cy + 3); ctx.quadraticCurveTo(cx, cy - 9, cx + 9, cy + 3); }
      else { ctx.moveTo(cx - 9, cy); ctx.quadraticCurveTo(cx, cy + 5, cx + 9, cy); }
      ctx.stroke(); continue;
    }
    ctx.save();
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.283); ctx.clip();
    ctx.fillStyle = SCLERA; ctx.fillRect(cx - rx, cy - ry, rx * 2, ry * 2);
    // iris + pupil follow the look direction
    const ix = cx + lx * 0.9 + look[0], iy = cy + 1.5 + look[1];
    const ir = wide ? 5.6 : 7.4;
    ctx.fillStyle = C2.iris || "#4a2c1d"; ctx.beginPath(); ctx.ellipse(ix, iy, ir, ir * 1.12, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.beginPath(); ctx.ellipse(ix, iy - ir * 0.35, ir, ir * 0.7, 0, Math.PI, 0); ctx.fill();
    ctx.fillStyle = "#120c0b"; ctx.beginPath(); ctx.arc(ix, iy, wide ? 2.6 : 3.8, 0, 6.283); ctx.fill();
    const sp = F.sparkle || (F.eye === "sparkle" ? 1 : 0);
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ix - 2.6, iy - 3.2, 2.5 + 1.4 * sp, 0, 6.283); ctx.fill();
    ctx.beginPath(); ctx.arc(ix + 2.8, iy + 3, 1.2 + 0.8 * sp, 0, 6.283); ctx.fill();
    if (sp) star(ix + 3.5, iy - 4.5, 3.2 * sp);
    // soft shadow under the upper lid
    ctx.fillStyle = "rgba(60,30,20,0.12)"; ctx.beginPath(); ctx.ellipse(cx, cy - ry, rx * 1.1, ry * 0.45, 0, 0, 6.283); ctx.fill();
    // upper lid (droop + tilt) and lower lid push for smiles
    const edge = x => cy - ry + 2 * ry * lid + lidTilt * (x - cx) * sx * 0.32;
    if (lid > 0.02) {
      ctx.fillStyle = C2.skin; ctx.beginPath(); ctx.moveTo(cx - rx - 2, cy - ry - 4); ctx.lineTo(cx + rx + 2, cy - ry - 4);
      ctx.lineTo(cx + rx + 2, edge(cx + rx + 2)); ctx.lineTo(cx - rx - 2, edge(cx - rx - 2)); ctx.closePath(); ctx.fill();
    }
    if (F.eye === "smile" || F.eye === "sparkle") {
      ctx.fillStyle = C2.skin; ctx.beginPath(); ctx.ellipse(cx, cy + ry * 1.25, rx * 1.3, ry * 0.62, 0, 0, 6.283); ctx.fill();
    }
    ctx.restore();
    // lash line along the top of the open eye (or along the lid edge)
    ctx.strokeStyle = INK; ctx.lineCap = "round"; ctx.lineJoin = "round"; ctx.lineWidth = 3.6; ctx.beginPath();
    if (lid > 0.02) { ctx.moveTo(cx - rx - 1, edge(cx - rx - 1)); ctx.lineTo(cx + rx + 1, edge(cx + rx + 1)); }
    else ctx.ellipse(cx, cy, rx + 0.6, ry + 0.6, 0, Math.PI * 1.08, Math.PI * 1.92);
    ctx.stroke();
    if (C2.lashes) {   // Mint: a small outer flick
      const ox = cx + sx * (rx - 1), oy = lid > 0.02 ? edge(ox) : cy - ry * 0.55;
      ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(ox, oy); ctx.lineTo(ox + sx * 5, oy - 4); ctx.stroke();
    }
    if (F.eye === "smile" || F.eye === "sparkle") { ctx.strokeStyle = shadeOf(C2.skinShade, 0.9); ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(cx - 7, cy + ry * 0.62); ctx.quadraticCurveTo(cx, cy + ry * 0.35, cx + 7, cy + ry * 0.62); ctx.stroke(); }
  }
}
function star(x, y, r) { ctx.beginPath(); for (let i = 0; i < 8; i++) { const a = i * Math.PI / 4, rr = i % 2 ? r * 0.35 : r; ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr); } ctx.closePath(); ctx.fill(); }
function drawBrows(C2, F, eyeY) {
  ctx.fillStyle = C2.brow || C2.hair;
  for (const sx of [-1, 1]) {
    const raise = F.raise + (F.asym && sx > 0 ? F.asym * 0.8 : 0);
    const by = eyeY - 21 - raise * 6.5, inner = -F.tilt * 5.5, outer = F.tilt * 1.5;
    const ix = sx * 10, ox = sx * 34;
    ctx.beginPath();
    ctx.moveTo(ix, by + inner - 3.6);
    ctx.quadraticCurveTo((ix + ox) / 2, by - 5 + (inner + outer) / 2, ox, by + outer - 0.6);
    ctx.quadraticCurveTo((ix + ox) / 2, by + 0.5 + (inner + outer) / 2, ix, by + inner + 3.2);
    ctx.closePath(); ctx.fill();
  }
}
function drawCheeks(F) {
  if (F.blush <= 0) return;
  for (const sx of [-1, 1]) {
    const g = ctx.createRadialGradient(sx * 31, 21, 1, sx * 31, 21, 13);
    g.addColorStop(0, `rgba(232,110,100,${F.blush})`); g.addColorStop(1, "rgba(232,110,100,0)");
    ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(sx * 31, 21, 14, 9, 0, 0, 6.283); ctx.fill();
  }
}
function drawSweat(a, t) {
  const y = -6 + 3 * Math.sin(t * 3);
  ctx.save(); ctx.globalAlpha = clamp(a); ctx.fillStyle = "#9fd3f2"; ctx.strokeStyle = "#5aa6d6"; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(48, y - 12); ctx.quadraticCurveTo(56, y + 2, 48, y + 4); ctx.quadraticCurveTo(40, y + 2, 48, y - 12); ctx.fill(); ctx.stroke();
  ctx.fillStyle = "rgba(255,255,255,0.8)"; ctx.beginPath(); ctx.arc(46, y - 1, 1.6, 0, 6.283); ctx.fill(); ctx.restore();
}
// D-shaped open mouth with teeth on top and tongue at the bottom.
function openMouth(cx, top, w, h, cornerUp, teeth = true) {
  ctx.beginPath(); ctx.moveTo(cx - w, top - cornerUp); ctx.quadraticCurveTo(cx, top + cornerUp * 0.6, cx + w, top - cornerUp);
  ctx.quadraticCurveTo(cx + w * 0.9, top + h * 1.15, cx, top + h * 1.1); ctx.quadraticCurveTo(cx - w * 0.9, top + h * 1.15, cx - w, top - cornerUp); ctx.closePath();
  ctx.save(); ctx.fillStyle = MOUTH_IN; ctx.fill(); ctx.clip();
  if (teeth && h > 5) { ctx.fillStyle = "#fffaf4"; ctx.fillRect(cx - w, top - cornerUp - 4, w * 2, Math.min(4.6, h * 0.34) + cornerUp + 4); }
  if (h > 7) { ctx.fillStyle = TONGUE; ctx.beginPath(); ctx.ellipse(cx, top + h * 1.05, w * 0.62, h * 0.42, 0, 0, 6.283); ctx.fill(); }
  ctx.restore();
  ctx.strokeStyle = LIP; ctx.lineWidth = 2.2; ctx.stroke();
}
function drawMouth(C2, F, t) {
  const m = F.mouth, talk = F.talk;
  ctx.strokeStyle = LIP; ctx.fillStyle = LIP; ctx.lineWidth = 3.2; ctx.lineCap = "round"; ctx.lineJoin = "round";
  const happy = m === "grin" || m === "laugh" || m === "smile" || m === "smirk";
  if (talk > 0.05) {
    // lip-sync: openness from the voice level, width wobbles over time so it reads as different vowels
    const vis = 0.5 + 0.5 * Math.sin(t * 13.1 + 1.7 * Math.sin(t * 5.3));
    const w = (9 + 5 * talk) * (0.78 + 0.4 * vis), h = 2 + 14 * talk * (1.2 - 0.4 * vis);
    if (m === "scared") openMouth(0, 32, w + 2, h + 2, -1, true);
    else openMouth(0, 32 - (happy ? 1 : 0), w + (happy ? 2 : 0), h, happy ? 3 : 0.5, true);
    return;
  }
  ctx.beginPath();
  switch (m) {
    case "smile": ctx.moveTo(-12, 31); ctx.quadraticCurveTo(0, 42, 12, 31); ctx.stroke(); break;
    case "grin": openMouth(0, 31, 13, 9.5, 3, true); break;
    case "laugh": openMouth(0, 30, 17, 14, 4, true); break;
    case "open": openMouth(0, 32, 11, 9, 0.5, true); break;
    case "o": ctx.fillStyle = MOUTH_IN; ctx.ellipse(0, 37, 6.5, 8.5, 0, 0, 6.283); ctx.fill(); ctx.strokeStyle = LIP; ctx.lineWidth = 2.2; ctx.stroke();
      ctx.fillStyle = TONGUE; ctx.beginPath(); ctx.ellipse(0, 41.5, 4, 2.8, 0, 0, 6.283); ctx.fill(); break;
    case "scared": {   // wide grimace with a wobbly top lip
      ctx.moveTo(-14, 33); ctx.quadraticCurveTo(-7, 30, 0, 33); ctx.quadraticCurveTo(7, 30, 14, 33);
      ctx.quadraticCurveTo(12, 47, 0, 47); ctx.quadraticCurveTo(-12, 47, -14, 33); ctx.closePath();
      ctx.save(); ctx.fillStyle = MOUTH_IN; ctx.fill(); ctx.clip(); ctx.fillStyle = "#fffaf4"; ctx.fillRect(-15, 28, 30, 9); ctx.restore();
      ctx.strokeStyle = LIP; ctx.lineWidth = 2.2; ctx.stroke(); break; }
    case "sad": ctx.moveTo(-11, 40); ctx.quadraticCurveTo(0, 30, 11, 40); ctx.stroke(); break;
    case "wavy": ctx.lineWidth = 2.8; ctx.moveTo(-11, 37); ctx.quadraticCurveTo(-7.5, 33, -4, 36.5); ctx.quadraticCurveTo(0, 40, 4, 36.5); ctx.quadraticCurveTo(7.5, 33, 11, 37); ctx.stroke(); break;
    case "flat": ctx.moveTo(-11, 38); ctx.quadraticCurveTo(0, 34.5, 11, 38); ctx.stroke(); break;
    case "hmm": ctx.moveTo(-3, 37); ctx.quadraticCurveTo(5, 35, 12, 33); ctx.stroke(); break;
    case "smirk": ctx.moveTo(-9, 36.5); ctx.quadraticCurveTo(3, 39, 13, 30); ctx.stroke();
      ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(14, 28.5); ctx.lineTo(16, 32); ctx.stroke(); break;
    default: ctx.moveTo(-8, 35.5); ctx.quadraticCurveTo(0, 38.5, 8, 35.5); ctx.stroke();
  }
}
// Side view (profile facing +x)
function drawBrowSide(C2, F, w) {
  ctx.fillStyle = C2.brow || C2.hair;
  const by = -19 - F.raise * 6, inner = -F.tilt * 4;
  ctx.beginPath(); ctx.moveTo(w * 0.38, by + inner - 2.8); ctx.quadraticCurveTo(w * 0.26, by - 4.5, w * 0.12, by + 0.5); ctx.quadraticCurveTo(w * 0.26, by + 1, w * 0.38, by + inner + 2.8); ctx.closePath(); ctx.fill();
}
function drawFaceSide(C2, F, t, w, hideEyes = false) {
  const ex = w * 0.24, ey = 0;
  if (hideEyes) {}
  else if (F.eye === "happy" || Math.max(F.lid, F.blink) > 0.9) {
    ctx.strokeStyle = INK; ctx.lineWidth = 3.6; ctx.lineCap = "round"; ctx.beginPath();
    if (F.eye === "happy") { ctx.moveTo(ex - 6, ey + 3); ctx.quadraticCurveTo(ex, ey - 7, ex + 6, ey + 3); } else { ctx.moveTo(ex - 6, ey); ctx.quadraticCurveTo(ex, ey + 4, ex + 6, ey); }
    ctx.stroke();
  } else {
    const wide = F.eye === "wide", rx = wide ? 7 : 6.2, ry = wide ? 12.5 : 11, lid = Math.max(F.lid, F.blink);
    ctx.save(); ctx.beginPath(); ctx.ellipse(ex, ey, rx, ry, 0, 0, 6.283); ctx.clip();
    ctx.fillStyle = SCLERA; ctx.fillRect(ex - rx, ey - ry, rx * 2, ry * 2);
    ctx.fillStyle = C2.iris || "#4a2c1d"; ctx.beginPath(); ctx.ellipse(ex + 2.5, ey + 1.5, wide ? 3.6 : 4.6, wide ? 5.6 : 7, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = "#120c0b"; ctx.beginPath(); ctx.arc(ex + 3, ey + 1.5, wide ? 1.8 : 2.6, 0, 6.283); ctx.fill();
    ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(ex + 1.3, ey - 2, 1.9 + (F.sparkle || 0), 0, 6.283); ctx.fill();
    if (lid > 0.02) { ctx.fillStyle = C2.skin; ctx.fillRect(ex - rx - 2, ey - ry - 2, rx * 2 + 4, 2 * ry * lid + 2); }
    if (F.eye === "smile" || F.eye === "sparkle") { ctx.fillStyle = C2.skin; ctx.beginPath(); ctx.ellipse(ex, ey + ry * 1.25, rx * 1.4, ry * 0.6, 0, 0, 6.283); ctx.fill(); }
    ctx.restore();
    ctx.strokeStyle = INK; ctx.lineWidth = 3.2; ctx.lineCap = "round"; ctx.beginPath();
    if (lid > 0.02) { ctx.moveTo(ex - rx, ey - ry + 2 * ry * lid); ctx.lineTo(ex + rx + 1, ey - ry + 2 * ry * lid); }
    else ctx.ellipse(ex, ey, rx + 0.5, ry + 0.5, 0, Math.PI * 1.1, Math.PI * 1.95);
    ctx.stroke();
    if (C2.lashes) { ctx.lineWidth = 2.6; ctx.beginPath(); ctx.moveTo(ex + rx - 0.5, ey - ry * 0.5); ctx.lineTo(ex + rx + 4.5, ey - ry * 0.85); ctx.stroke(); }
  }
  // cheek
  if (F.blush > 0) { const g = ctx.createRadialGradient(w * 0.2, 22, 1, w * 0.2, 22, 11); g.addColorStop(0, `rgba(232,110,100,${F.blush})`); g.addColorStop(1, "rgba(232,110,100,0)"); ctx.fillStyle = g; ctx.beginPath(); ctx.ellipse(w * 0.2, 22, 12, 8, 0, 0, 6.283); ctx.fill(); }
  // mouth
  const mx = w * 0.36, m = F.mouth, talk = F.talk;
  ctx.strokeStyle = LIP; ctx.lineWidth = 3; ctx.lineCap = "round";
  if (talk > 0.05 || m === "o" || m === "scared" || m === "laugh" || m === "grin" || m === "open") {
    const vis = 0.5 + 0.5 * Math.sin(t * 13.1 + 1.7 * Math.sin(t * 5.3));
    const oh = talk > 0.05 ? 2 + 9 * talk * (1.2 - 0.4 * vis) : m === "laugh" ? 11 : m === "scared" ? 10 : m === "grin" ? 6 : 7;
    ctx.save(); ctx.beginPath(); ctx.ellipse(mx, 35, m === "o" ? 5 : 7.5, oh, 0, 0, 6.283); ctx.fillStyle = MOUTH_IN; ctx.fill(); ctx.clip();
    if (oh > 4 && m !== "o") { ctx.fillStyle = "#fffaf4"; ctx.fillRect(mx - 9, 35 - oh - 1, 18, Math.min(4.5, oh * 0.45) + 1); }
    if (oh > 6) { ctx.fillStyle = TONGUE; ctx.beginPath(); ctx.ellipse(mx - 1, 35 + oh * 0.75, 5, oh * 0.4, 0, 0, 6.283); ctx.fill(); }
    ctx.restore();
  } else if (m === "smile" || m === "smirk") { ctx.beginPath(); ctx.moveTo(w * 0.27, 31); ctx.quadraticCurveTo(w * 0.36, 40, w * 0.44, 30); ctx.stroke(); }
  else if (m === "sad" || m === "flat") { ctx.beginPath(); ctx.moveTo(w * 0.28, 37); ctx.quadraticCurveTo(w * 0.36, 31, w * 0.43, 36); ctx.stroke(); }
  else { ctx.beginPath(); ctx.moveTo(w * 0.3, 35); ctx.quadraticCurveTo(w * 0.37, 36.5, w * 0.43, 34); ctx.stroke(); }
}

// Comic speech bubble with a tail pointing at (tx, ty). p = pop-in progress.
function bubble(str, x, y, tx, ty, p, maxW = 840) {
  if (p <= 0) return;
  const e = easeOutBack(clamp(p)); ctx.save();
  ctx.font = font(42, 700); const lines = wrapText(str, maxW - 70); const w = Math.min(maxW, Math.max(...lines.map(l => ctx.measureText(l).width)) + 70), h = lines.length * 58 + 40;
  ctx.translate(tx, ty); ctx.scale(e, e); ctx.translate(-tx, -ty); ctx.globalAlpha = clamp(p * 3);
  const bx = clamp(x - w / 2, SAFE.x0, SAFE.x1 - w), by = y - h;
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 6;
  ctx.fillStyle = "#f4ecd9"; roundRect(bx, by, w, h, 26); ctx.fill(); ctx.shadowColor = "transparent";
  ctx.beginPath(); ctx.moveTo(clamp(tx, bx + 40, bx + w - 40) - 18, by + h - 2); ctx.lineTo(tx, ty); ctx.lineTo(clamp(tx, bx + 40, bx + w - 40) + 18, by + h - 2); ctx.fill();
  ctx.strokeStyle = "#3b3326"; ctx.lineWidth = 4; roundRect(bx, by, w, h, 26); ctx.stroke();
  ctx.fillStyle = "#f4ecd9"; ctx.fillRect(clamp(tx, bx + 40, bx + w - 40) - 16, by + h - 4, 32, 6);
  ctx.strokeStyle = "#3b3326"; ctx.beginPath(); ctx.moveTo(clamp(tx, bx + 40, bx + w - 40) - 18, by + h); ctx.lineTo(tx, ty); ctx.lineTo(clamp(tx, bx + 40, bx + w - 40) + 18, by + h); ctx.stroke();
  ctx.fillStyle = "#2a241b"; ctx.textAlign = "center"; ctx.textBaseline = "alphabetic";
  lines.forEach((l, i) => ctx.fillText(l, bx + w / 2, by + 66 + i * 58));
  ctx.restore();
}
function wrapText(str, maxW) {
  const words = [...new Intl.Segmenter("th", { granularity: "word" }).segment(str)].map(s => s.segment);
  const lines = [""];
  for (const w of words) { const tryL = lines[lines.length - 1] + w; if (ctx.measureText(tryL).width > maxW && lines[lines.length - 1]) lines.push(w.trimStart()); else lines[lines.length - 1] = tryL; }
  return lines;
}
// Deterministic blink: ~every 3.2–4.5 s for 0.13 s.
function blinkAt(t, seed) { const per = 3.2 + (seed % 7) * 0.2, ph = (t + seed * 0.37) % per; return ph < 0.13 ? Math.sin(ph / 0.13 * Math.PI) : 0; }

// ---------- side view (profile, facing +x; pass opts.flip to face left) ----------
// Pose keys: hipN/kneeN/hipF/kneeF (near/far leg), shN/elN/shF/elF (arms), torso, head.
// Leg/arm angle 0 = straight down, positive = forward. Knee bends the shin backward; elbow bends the forearm forward.
function walkSide(ph, amt = 1) {
  const s = Math.sin(ph), c = Math.cos(ph), s2 = Math.sin(ph + Math.PI), c2 = Math.cos(ph + Math.PI);
  return { hipN: 0.42 * s * amt, kneeN: (0.08 + 0.85 * Math.max(0, c) ** 2) * amt, hipF: 0.42 * s2 * amt, kneeF: (0.08 + 0.85 * Math.max(0, c2) ** 2) * amt,
    shN: -0.38 * s * amt, elN: (0.22 + 0.3 * Math.max(0, -s)) * amt + 0.05, shF: 0.38 * s * amt, elF: (0.22 + 0.3 * Math.max(0, s)) * amt + 0.05,
    torso: 0.04 * amt, head: 0 };
}
const SIDE_STRIDE = 2 * 2 * (PUP.legU + PUP.legL) * Math.sin(0.42);   // body travel per walk cycle at scale 1

function drawPuppetSide(ch, x, y, s, P, face = {}, t = 0, opts = {}) {
  const C2 = CHARS[ch] || ch, U = PUP.legU, Lg = PUP.legL;
  ctx.save(); ctx.translate(x, y); ctx.scale(s * (opts.flip ? -1 : 1) * (opts.squash ?? 1), s);
  ctx.fillStyle = "rgba(0,0,0,0.28)"; ctx.beginPath(); ctx.ellipse(0, 4, 70, 12, 0, 0, 6.283); ctx.fill();
  const footY = (hip, kn) => Math.cos(hip) * U + Math.cos(hip - kn) * Lg;
  const lift = Math.max(footY(P.hipN, P.kneeN), footY(P.hipF, P.kneeF));
  ctx.translate(0, -lift - 16);
  const shade = (col, k) => { const v = parseInt(col.slice(1), 16), r = (v >> 16) * k, g = ((v >> 8) & 255) * k, b = (v & 255) * k; return `rgb(${r | 0},${g | 0},${b | 0})`; };
  const leg = (hip, kn, k) => {
    const kx = Math.sin(hip) * U, ky = Math.cos(hip) * U, ax = kx + Math.sin(hip - kn) * Lg, ay = ky + Math.cos(hip - kn) * Lg;
    const skin = shade(C2.skin, k), bottom = shade(C2.bottom, k);
    cap(kx, ky, ax, ay - 6, 30, C2.shorts ? skin : bottom);
    if (C2.shorts && !opts.barefoot) cap(ax, ay - 16, ax, ay - 4, 29, shade(C2.sock, k));
    cap(0, 0, kx, ky, 34, C2.shorts ? skin : bottom);
    if (C2.shorts) cap(0, -2, kx * 0.72, ky * 0.72, 42, bottom);
    ctx.save(); ctx.translate(ax, ay); ctx.rotate(-(hip - kn) * 0.35);
    if (opts.barefoot) { ctx.fillStyle = skin; ctx.beginPath(); ctx.ellipse(12, 6, 26, 10, 0, 0, 6.283); ctx.fill(); ctx.restore(); return; }   // shoes off (shrines)
    ctx.fillStyle = shade(C2.shoe, k); ctx.beginPath(); ctx.ellipse(14, 4, 32, 14, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = shade(C2.sole, k); ctx.fillRect(-16, 11, 62, 7); ctx.restore();
  };
  const T = PUP.torso;
  const arm = (sh, el, k) => {
    const sx = 0, sy = -T + 18, ex = sx + Math.sin(sh) * PUP.armU, ey = sy + Math.cos(sh) * PUP.armU;
    const hx = ex + Math.sin(sh + el) * PUP.armL, hy = ey + Math.cos(sh + el) * PUP.armL;
    cap(ex, ey, hx, hy, 23, shade(C2.hoodie ? C2.shirt : C2.skin, k));
    cap(sx, sy, ex, ey, 26, shade(C2.skin, k));
    const sl = C2.hoodie ? 1 : 0.55; cap(sx, sy, sx + (ex - sx) * sl, sy + (ey - sy) * sl, 34, shade(C2.shirt, k));
    if (C2.watch && k === 1) cap(ex + (hx - ex) * 0.8, ey + (hy - ey) * 0.8, ex + (hx - ex) * 0.9, ey + (hy - ey) * 0.9, 26, "#d5d9de");
    if (C2.hoodie) band(ex + (hx - ex) * 0.8, ey + (hy - ey) * 0.8, ex + (hx - ex) * 0.94, ey + (hy - ey) * 0.94, 23, shade(C2.shirtShade, k));
    const key = ch + (k === 1 ? "N" : "F"), foreAng = Math.atan2(Math.cos(sh + el), Math.sin(sh + el));
    const torch = C2.flashlight && !opts.noFlash && (k === 1) === !opts.flashFar;
    let lens = null, beamAng = foreAng;
    if (torch) { beamAng = aimLocal(hx, hy, key, opts.aim, foreAng); lens = drawTorch(hx, hy, beamAng); }
    if (opts.phone && k === 1) { ctx.save(); ctx.translate(hx, hy); ctx.rotate(-0.2); ctx.fillStyle = "#1d1f24"; roundRect(-6, -40, 14, 50, 4); ctx.fill(); ctx.fillStyle = "rgba(160,210,255,0.7)"; ctx.fillRect(-4, -36, 4, 42); ctx.restore(); }
    drawHand(hx, hy, torch ? beamAng : foreAng, C2, torch || (opts.phone && k === 1) ? "grip" : "open", 1, k);
    const hp = ctx.getTransform().transformPoint(new DOMPoint(hx, hy)); hp.key = key;
    if (lens) { hp.lx = lens.x; hp.ly = lens.y; hp.ang = Math.atan2(lens.y - hp.y, lens.x - hp.x); }
    PUP_HAND[key] = hp;
  };
  ctx.save(); ctx.rotate(P.torso || 0);
  // things behind the body: far arm, long hair, backpack
  arm(P.shF, P.elF, 0.82);
  if (C2.hairStyle === "long") { ctx.save(); ctx.translate(4, -T - PUP.neck - 6); ctx.rotate(P.head || 0); ctx.fillStyle = C2.hair; ctx.beginPath(); ctx.moveTo(-50, -PUP.headH * 0.6); ctx.quadraticCurveTo(-74, 10, -54, 70); ctx.lineTo(-12, 70); ctx.lineTo(0, -PUP.headH * 0.5); ctx.closePath(); ctx.fill(); ctx.restore(); }
  ctx.restore();
  leg(P.hipF, P.kneeF, 0.82); leg(P.hipN, P.kneeN, 1);
  ctx.save(); ctx.rotate(P.torso || 0);
  if (C2.backpack) { ctx.fillStyle = C2.backpack; roundRect(-76, -T + 22, 50, 128, 18); ctx.fill(); }
  const body = new Path2D(); body.moveTo(-30, -T + 8); body.quadraticCurveTo(4, -T - 6, 34, -T + 10); body.quadraticCurveTo(44, -T + 60, 34, -T + 110); body.lineTo(32, 6); body.quadraticCurveTo(0, 12, -32, 6); body.closePath();
  ctx.fillStyle = C2.tee; ctx.fill(body);
  ctx.save(); ctx.clip(body); ctx.fillStyle = C2.shirt;
  if (C2.shirtOpen) { ctx.beginPath(); ctx.moveTo(-60, -T - 10); ctx.lineTo(18, -T - 10); ctx.lineTo(24, -T + 60); ctx.lineTo(22, 20); ctx.lineTo(-60, 20); ctx.closePath(); ctx.fill(); ctx.fillStyle = C2.shirtShade; ctx.fillRect(-60, -T, 26, T + 20); }
  else { ctx.fillRect(-60, -T - 10, 120, T + 30); ctx.fillStyle = C2.shirtShade; ctx.fillRect(-60, -T, 24, T + 20); if (C2.hoodie) { ctx.fillStyle = C2.shirtShade; roundRect(4, -T + 96, 34, 40, 8); ctx.fill(); } }
  ctx.restore();
  if (C2.hoodie) { ctx.fillStyle = C2.shirtShade; ctx.beginPath(); ctx.ellipse(-22, -T + 2, 22, 14, -0.3, 0, 6.283); ctx.fill(); }
  if (C2.backpack) cap(-24, -T + 8, -26, -T + 100, 9, C2.backpack);
  if (C2.dress) C2.dress("side", T, t);
  if (C2.necklace) { const cols = ["#e7d36a", "#9ad1c4", "#f2f2f2", "#e59ab3", "#8fbf6a"]; for (let i = 0; i < 5; i++) { ctx.fillStyle = cols[i]; ctx.beginPath(); ctx.arc(12 + i * 4, -T + 6 + i * 3.5, 3.2, 0, 6.283); ctx.fill(); } }
  cap(4, -T - 2, 4, -T - PUP.neck - 8, 22, C2.skinShade);
  ctx.save(); ctx.translate(4, -T - PUP.neck - 6); ctx.rotate(P.head || 0); ctx.translate(0, -PUP.headH / 2);
  if (opts.lookBack) ctx.scale(-1, 1);   // glance back over the shoulder
  drawHeadSide(C2, face, t); ctx.restore();
  arm(P.shN, P.elN, 1);
  ctx.restore();
  ctx.restore();
}

function drawHeadSide(C2, face, t) {
  const w = PUP.headW, h = PUP.headH;
  // skull + jaw + nose
  ctx.fillStyle = C2.skin; ctx.beginPath();
  ctx.moveTo(-w * 0.46, -h * 0.1); ctx.bezierCurveTo(-w * 0.5, -h * 0.62, w * 0.42, -h * 0.66, w * 0.44, -h * 0.12);
  ctx.lineTo(w * 0.52, 6); ctx.lineTo(w * 0.44, 16); ctx.bezierCurveTo(w * 0.42, h * 0.42, w * 0.18, h * 0.5, -w * 0.06, h * 0.46);
  ctx.bezierCurveTo(-w * 0.34, h * 0.42, -w * 0.46, h * 0.2, -w * 0.46, -h * 0.1); ctx.fill();
  ctx.fillStyle = C2.skinShade; ctx.beginPath(); ctx.ellipse(-w * 0.08, 6, 11, 16, 0, 0, 6.283); ctx.fill();
  if (C2.silhouette) return;
  const F = resolveFace(face, C2);
  if (C2.zombie) zombieFaceSide(C2, face, t, w); else drawFaceSide(C2, F, t, w, C2.sunglasses && (face.glassesDown || 0) <= 0.3);
  if (C2.silhouette) return;
  // hair
  ctx.fillStyle = C2.hair;
  if (C2.hairStyle === "fringe") {
    ctx.beginPath(); ctx.moveTo(-w * 0.5, 12); ctx.bezierCurveTo(-w * 0.6, -h * 0.66, w * 0.5, -h * 0.72, w * 0.5, -10);
    ctx.lineTo(w * 0.42, -14); ctx.lineTo(w * 0.36, -6); ctx.lineTo(w * 0.26, -16); ctx.lineTo(w * 0.12, -10); ctx.lineTo(w * 0.02, -22); ctx.quadraticCurveTo(-w * 0.2, -10, -w * 0.22, 20); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = C2.hairHi; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * 0.3, -h * 0.4); ctx.quadraticCurveTo(0, -h * 0.52, w * 0.3, -h * 0.34); ctx.stroke();
  } else if (C2.hairStyle === "long") {
    ctx.beginPath(); ctx.moveTo(-w * 0.52, 30); ctx.bezierCurveTo(-w * 0.62, -h * 0.66, w * 0.5, -h * 0.72, w * 0.48, -14); ctx.quadraticCurveTo(w * 0.1, -22, -w * 0.18, 4); ctx.quadraticCurveTo(-w * 0.2, 30, -w * 0.3, 50); ctx.closePath(); ctx.fill();
  } else if (C2.hairStyle === "messy") {
    ctx.beginPath(); ctx.moveTo(-w * 0.5, 8); ctx.lineTo(-w * 0.66, -h * 0.18); ctx.lineTo(-w * 0.5, -h * 0.34); ctx.lineTo(-w * 0.56, -h * 0.6); ctx.lineTo(-w * 0.26, -h * 0.56); ctx.lineTo(-w * 0.12, -h * 0.8);
    ctx.lineTo(w * 0.06, -h * 0.58); ctx.lineTo(w * 0.3, -h * 0.72); ctx.lineTo(w * 0.32, -h * 0.46); ctx.lineTo(w * 0.56, -h * 0.4); ctx.lineTo(w * 0.42, -20); ctx.lineTo(w * 0.24, -16); ctx.lineTo(w * 0.12, -30);
    ctx.quadraticCurveTo(-w * 0.1, -20, -w * 0.2, -4); ctx.closePath(); ctx.fill();
  } else {
    ctx.beginPath(); ctx.moveTo(-w * 0.48, 4); ctx.bezierCurveTo(-w * 0.56, -h * 0.62, w * 0.46, -h * 0.66, w * 0.44, -20); ctx.quadraticCurveTo(0, -30, -w * 0.2, -4); ctx.closePath(); ctx.fill();
  }
  if (C2.hat) zombieHat(C2, w, h, true);
  if (C2.cap) { ctx.fillStyle = C2.cap; ctx.beginPath(); ctx.ellipse(-2, -h * 0.34, w * 0.5, h * 0.24, 0, Math.PI, 0); ctx.fill(); ctx.fillRect(-w * 0.52, -h * 0.36, w * 1.0, 10); ctx.fillStyle = "#2e2e31"; roundRect(-w * 0.86, -h * 0.38, w * 0.4, 12, 5); ctx.fill(); }
  if (!C2.zombie) drawBrowSide(C2, F, w);
  if (C2.sunglasses) {
    const gd = clamp(face.glassesDown || 0), gy = 2 + gd * 16;
    const g = ctx.createLinearGradient(w * 0.14, gy - 10, w * 0.44, gy + 10); g.addColorStop(0, "#2a2f36"); g.addColorStop(0.5, "#545d68"); g.addColorStop(1, "#1d2127");
    ctx.fillStyle = g; roundRect(w * 0.14, gy - 10, w * 0.32, 20, 7); ctx.fill();
    ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(w * 0.14, gy - 4); ctx.lineTo(-w * 0.06, gy - 6); ctx.stroke();
  }
}

// Side-view IK: near-arm angles that put the hand at (tx, ty) in torso coords (facing +x), elbow hanging low.
function reachSide(tx, ty, far = false) {
  const sx = 0, sy = -PUP.torso + 18, U = PUP.armU, Lw = PUP.armL;
  const d = Math.min(Math.hypot(tx - sx, ty - sy), (U + Lw) * 0.999);
  const base = Math.atan2(tx - sx, ty - sy), alpha = Math.acos(clamp((U * U + d * d - Lw * Lw) / (2 * U * d), -1, 1));
  const c = [base + alpha, base - alpha].map(a => ({ a, ey: sy + Math.cos(a) * U, ex: sx + Math.sin(a) * U })).sort((p, q) => q.ey - p.ey)[0];
  const a2 = Math.atan2(tx - c.ex, ty - c.ey);
  return far ? { shF: c.a, elF: a2 - c.a } : { shN: c.a, elN: a2 - c.a };
}
const SIDE_IDLE = { hipN: 0.02, kneeN: 0.03, hipF: -0.02, kneeF: 0.03, shN: 0.05, elN: 0.12, shF: -0.05, elF: 0.12, torso: 0, head: 0 };
const sidePose = over => Object.assign({}, SIDE_IDLE, over);

// Back view (character seen from behind). opts.headSide = 1/-1 shows the head turned in profile toward screen right/left.
function drawPuppetBack(ch, x, y, s, P, face = {}, t = 0, opts = {}) {
  const C2 = CHARS[ch] || ch;
  ctx.save(); ctx.translate(x, y); ctx.scale(s, s);
  ctx.fillStyle = "rgba(0,0,0,0.28)"; ctx.beginPath(); ctx.ellipse(0, 4, 78, 13, 0, 0, 6.283); ctx.fill();
  ctx.translate(0, -(PUP.legU + PUP.legL + 14) + (P.bob || 0));
  const leg = (sgn, hip, knee) => {
    const hx = sgn * PUP.hipW, [dx, dy] = dirv(hip, sgn), kx = hx + dx * PUP.legU, ky = dy * PUP.legU;
    const [ex, ey] = dirv(hip + knee, sgn), ax = kx + ex * PUP.legL, ay = ky + ey * PUP.legL;
    cap(kx, ky, ax, ay - 6, 32, C2.shorts ? C2.skin : C2.bottom);
    if (C2.shorts) cap(ax, ay - 16, ax, ay - 4, 31, C2.sock);
    cap(hx, 0, kx, ky, 36, C2.shorts ? C2.skin : C2.bottom);
    if (C2.shorts) cap(hx, -2, hx + (kx - hx) * 0.72, ky * 0.72, 44, C2.bottom);
    ctx.fillStyle = C2.shoe; ctx.beginPath(); ctx.ellipse(ax, ay + 2, 26, 16, 0, 0, 6.283); ctx.fill();
  };
  leg(-1, P.hipR, P.kneeR); leg(1, P.hipL, P.kneeL);
  ctx.save(); ctx.rotate(P.torso || 0);
  const T = PUP.torso, sw = PUP.shW;
  const body = new Path2D(); body.moveTo(-sw, -T + 6); body.quadraticCurveTo(0, -T - 8, sw, -T + 6); body.lineTo(sw - 6, 4); body.quadraticCurveTo(0, 12, -sw + 6, 4); body.closePath();
  ctx.fillStyle = C2.shirt; ctx.fill(body);
  ctx.save(); ctx.clip(body); ctx.fillStyle = C2.shirtShade; ctx.fillRect(-sw, -T, 22, T + 20); ctx.fillStyle = "rgba(0,0,0,0.08)"; ctx.fillRect(-2, -T + 20, 4, T); ctx.restore();
  if (C2.hoodie) { ctx.fillStyle = C2.shirtShade; ctx.beginPath(); ctx.ellipse(0, -T + 22, 44, 30, 0, 0, Math.PI); ctx.fill(); }
  cap(0, -T - 4, 0, -T - PUP.neck - 8, 24, C2.skinShade);
  const arm = (sgn, sh, el) => {
    const sx = sgn * (sw - 6), sy = -T + 16, [dx, dy] = dirv(sh, sgn), ex = sx + dx * PUP.armU, ey = sy + dy * PUP.armU;
    const [fx, fy] = dirv(sh + el, sgn), hx = ex + fx * PUP.armL, hy = ey + fy * PUP.armL;
    cap(ex, ey, hx, hy, 24, C2.hoodie ? C2.shirt : C2.skin); cap(sx, sy, ex, ey, 27, C2.skin);
    const sl = C2.hoodie ? 1 : 0.55; cap(sx, sy, sx + dx * PUP.armU * sl, sy + dy * PUP.armU * sl, 36, C2.shirt);
    ctx.fillStyle = C2.skin; ctx.beginPath(); ctx.arc(hx, hy, 15, 0, 6.283); ctx.fill();
    if (C2.flashlight && sgn === -1) { ctx.fillStyle = "#2b2b2e"; roundRect(hx - 8, hy - 4, 16, 40, 5); ctx.fill(); }
  };
  // seen from behind, the character's right arm is on screen right
  arm(1, P.shR, P.elR); arm(-1, P.shL, P.elL);
  if (C2.backpack) { ctx.fillStyle = C2.backpack; roundRect(-48, -T + 26, 96, 124, 22); ctx.fill(); ctx.fillStyle = "rgba(255,255,255,0.12)"; roundRect(-30, -T + 60, 60, 40, 10); ctx.fill(); }
  ctx.save(); ctx.translate(0, -T - PUP.neck - 6); ctx.rotate(P.head || 0); ctx.translate(0, -PUP.headH / 2);
  if (opts.headSide) { ctx.scale(opts.headSide, 1); drawHeadSide(C2, face, t); }
  else {
    const w = PUP.headW, h = PUP.headH;
    ctx.fillStyle = C2.skinShade; ctx.beginPath(); ctx.ellipse(-w / 2, 6, 11, 16, 0, 0, 6.283); ctx.ellipse(w / 2, 6, 11, 16, 0, 0, 6.283); ctx.fill();
    ctx.fillStyle = C2.hair; ctx.beginPath(); ctx.ellipse(0, -4, w * 0.56, h * 0.56, 0, 0, 6.283); ctx.fill();
    if (C2.hairStyle === "long") { ctx.beginPath(); ctx.moveTo(-w * 0.55, -10); ctx.quadraticCurveTo(-w * 0.62, h * 0.8, -w * 0.45, h * 1.2); ctx.lineTo(w * 0.45, h * 1.2); ctx.quadraticCurveTo(w * 0.62, h * 0.8, w * 0.55, -10); ctx.closePath(); ctx.fill(); }
    ctx.strokeStyle = C2.hairHi; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(-w * 0.3, -h * 0.36); ctx.quadraticCurveTo(0, -h * 0.5, w * 0.3, -h * 0.36); ctx.stroke();
    if (C2.cap) { ctx.fillStyle = C2.cap; ctx.beginPath(); ctx.ellipse(0, -h * 0.3, w * 0.56, h * 0.28, 0, Math.PI, 0); ctx.fill(); ctx.fillStyle = "#2e2e31"; roundRect(-w * 0.3, -h * 0.34, w * 0.6, 14, 6); ctx.fill(); }
    if (C2.sunglasses) { ctx.strokeStyle = "#1a1a1a"; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-w * 0.5, 0); ctx.lineTo(-w * 0.58, -4); ctx.moveTo(w * 0.5, 0); ctx.lineTo(w * 0.58, -4); ctx.stroke(); }
  }
  ctx.restore();
  ctx.restore(); ctx.restore();
}
// Cream label tag (comic style), e.g. "แพริโดเลีย (Pareidolia)".
function tag(str, x, y, p, size = 38) {
  if (p <= 0) return;
  const e = easeOutBack(clamp(p)); ctx.save(); ctx.font = font(size, 700); const w = ctx.measureText(str).width + 40, h = size + 30;
  ctx.translate(x, y); ctx.scale(e, e); ctx.globalAlpha = clamp(p * 3);
  ctx.shadowColor = "rgba(0,0,0,0.35)"; ctx.shadowBlur = 14; ctx.shadowOffsetY = 5;
  ctx.fillStyle = "#f4ecd9"; roundRect(-w / 2, -h / 2, w, h, 14); ctx.fill(); ctx.shadowColor = "transparent";
  ctx.strokeStyle = "#3b3326"; ctx.lineWidth = 3.5; ctx.stroke();
  ctx.fillStyle = "#2a241b"; ctx.textAlign = "center"; ctx.textBaseline = "middle"; ctx.fillText(str, 0, 2); ctx.restore();
}

const SIDE_WAI = () => sidePose(Object.assign({ head: 0.12 }, reachSide(40, -PUP.torso + 48), reachSide(36, -PUP.torso + 50, true)));
// Little "startle" lines above a head (screen coords).
function startleMarks(x, y, p) {
  if (p <= 0) return; ctx.save(); ctx.globalAlpha = clamp(p * 3) * (1 - life(p, 0.7, 1)); ctx.strokeStyle = "#f4ecd9"; ctx.lineWidth = 6; ctx.lineCap = "round";
  for (const a of [-0.6, 0, 0.6]) { const r0 = 30 + 20 * p, r1 = 60 + 30 * p; ctx.beginPath(); ctx.moveTo(x + Math.sin(a) * r0, y - Math.cos(a) * r0); ctx.lineTo(x + Math.sin(a) * r1, y - Math.cos(a) * r1); ctx.stroke(); }
  ctx.restore();
}
