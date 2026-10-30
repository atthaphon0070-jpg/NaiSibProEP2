// Shared map-video engine for MR BOXER episodes (classic script, exposes globals).
// Every frame must be a pure function of t: no Date.now(), no network at render time.
"use strict";

const W = 1080, H = 1920, CX = W / 2, CY = H * 0.5;
const SAFE = { x0: 100, x1: 940, y0: 300, y1: 1520 };
const BRAND = "MR BOXER";
const QS = new URLSearchParams(location.search);
const GUIDES = QS.has("guides");

const THEMES = {
  atlas: {
    dark: true, space0: "#0b1424", space1: "#020409", ocean0: "#0d2240", ocean1: "#050c18",
    land: "#2a3a52", landBorder: "rgba(150,175,210,0.40)", grat: "rgba(120,160,220,0.10)", atmos: "90,170,255",
    country: "#38e8ff", countryRGB: "56,232,255", target: "#ffc53d", targetRGB: "255,197,61",
    alert: "#ff5a4e", alertRGB: "255,90,78", warm: "#ff9a3c", warmRGB: "255,154,60",
    water: "40,140,255", provLine: "rgba(56,232,255,0.28)",
    text: "#ffffff", sub: "#bcd7ff", dimRGB: "2,4,10", shadow: "rgba(0,0,0,0.75)",
    card: "rgba(10,14,24,0.84)", limb: 0.45, vignette: 0.55, grain: [255, 18], glow: 1,
  },
  vintage: {
    dark: false, space0: "#f1e4c6", space1: "#cdb68a", ocean0: "#cfdccd", ocean1: "#a9bba6",
    land: "#ead8af", landBorder: "rgba(105,70,35,0.55)", grat: "rgba(105,70,35,0.20)", atmos: "120,90,50",
    country: "#7a2e0e", countryRGB: "122,46,14", target: "#c0392b", targetRGB: "192,57,43",
    alert: "#a8231a", alertRGB: "168,35,26", warm: "#b8651b", warmRGB: "184,101,27",
    water: "70,110,140", provLine: "rgba(105,70,35,0.35)",
    text: "#3b2410", sub: "#6b4a2a", dimRGB: "230,214,180", shadow: "rgba(255,245,220,0.6)",
    card: "rgba(250,240,215,0.9)", limb: 0.18, vignette: 0.45, grain: [90, 34], glow: 0.25,
  },
  light: {
    dark: false, space0: "#f5f8fc", space1: "#d8e2ee", ocean0: "#d6e8f7", ocean1: "#a8c8e6",
    land: "#ffffff", landBorder: "rgba(70,95,130,0.35)", grat: "rgba(70,110,160,0.12)", atmos: "120,170,230",
    country: "#1f6fe5", countryRGB: "31,111,229", target: "#ff6a2b", targetRGB: "255,106,43",
    alert: "#e5383b", alertRGB: "229,56,59", warm: "#f08c00", warmRGB: "240,140,0",
    water: "30,120,230", provLine: "rgba(31,111,229,0.30)",
    text: "#14213d", sub: "#3f5675", dimRGB: "236,242,249", shadow: "rgba(255,255,255,0.7)",
    card: "rgba(255,255,255,0.9)", limb: 0.12, vignette: 0.12, grain: [128, 10], glow: 0.35,
  },
  neon: {
    dark: true, space0: "#22093d", space1: "#05010d", ocean0: "#170b30", ocean1: "#06020f",
    land: "#2b1650", landBorder: "rgba(200,130,255,0.40)", grat: "rgba(200,120,255,0.12)", atmos: "190,90,255",
    country: "#00f0ff", countryRGB: "0,240,255", target: "#ff2bd6", targetRGB: "255,43,214",
    alert: "#ff3b6b", alertRGB: "255,59,107", warm: "#ffb000", warmRGB: "255,176,0",
    water: "0,200,255", provLine: "rgba(0,240,255,0.30)",
    text: "#ffffff", sub: "#e7b8ff", dimRGB: "5,1,13", shadow: "rgba(0,0,0,0.8)",
    card: "rgba(20,8,40,0.85)", limb: 0.5, vignette: 0.6, grain: [255, 16], glow: 1.4,
  },
};
let C = THEMES.atlas;
function setTheme(name) { C = THEMES[QS.get("theme") || name]; if (!C) throw new Error("unknown theme"); }

const cv = document.getElementById("c");
const ctx = cv.getContext("2d");
const svgNS = "http://www.w3.org/2000/svg";
const _measure = document.createElementNS(svgNS, "path");
{ const s = document.createElementNS(svgNS, "svg"); s.style.position = "absolute"; s.style.width = s.style.height = "0"; s.appendChild(_measure); document.body.appendChild(s); }

// ---------- math / timing ----------
const clamp = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, p) => a + (b - a) * p;
const easeInOutCubic = p => p < 0.5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2;
const easeOutCubic = p => 1 - Math.pow(1 - p, 3);
const easeOutBack = p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); };
const life = (t, a, b) => clamp((t - a) / (b - a));
const win = (t, a, b, f = 0.3) => Math.min(life(t, a, a + f), 1 - life(t, b - f, b));
function mulberry32(s) { return () => { s |= 0; s = s + 0x6D2B79F5 | 0; let r = Math.imul(s ^ s >>> 15, 1 | s); r = r + Math.imul(r ^ r >>> 7, 61 | r) ^ r; return ((r ^ r >>> 14) >>> 0) / 4294967296; }; }
const lerpRGB = (a, b, p) => a.split(",").map((v, i) => Math.round(lerp(+v, +b.split(",")[i], p))).join(",");

// ---------- data ----------
const getJSON = f => fetch(f).then(r => { if (!r.ok) throw new Error("missing " + f); return r.json(); });
function rewind(f) {
  // d3 wants clockwise outer rings; GeoJSON tools often write RFC 7946 (counter-clockwise).
  if (!f.geometry || !/Polygon/.test(f.geometry.type) || d3.geoArea(f) <= 2 * Math.PI) return f;
  const polys = f.geometry.type === "Polygon" ? [f.geometry.coordinates] : f.geometry.coordinates;
  for (const poly of polys) for (const ring of poly) ring.reverse();
  return f;
}
async function loadGeo(name) { const d = await getJSON(name); (d.features || []).forEach(rewind); return d; }

// ---------- projection / camera ----------
function makeProjection(c, k, y = CY) {
  return d3.geoOrthographic().rotate([-c[0], -c[1]]).scale(k).translate([CX, y]).clipAngle(90).precision(0.3);
}
// Centre + scale that fit a lon/lat box into wpx x hpx on screen.
function fitBox([w, s, e, n], wpx, hpx, y = CY) {
  const c = [(w + e) / 2, (s + n) / 2], p = makeProjection(c, 1, 0);
  const pts = [[w, s], [w, n], [e, s], [e, n], [c[0], s], [c[0], n], [w, c[1]], [e, c[1]]].map(q => p(q));
  const bw = Math.max(...pts.map(q => q[0])) - Math.min(...pts.map(q => q[0]));
  const bh = Math.max(...pts.map(q => q[1])) - Math.min(...pts.map(q => q[1]));
  return { c, k: Math.min(wpx / bw, hpx / bh), y };
}
function fitFeature(f, wpx, hpx, y = CY) {
  const [[w, s], [e, n]] = d3.geoBounds(f);
  return fitBox([w, s, e, n], wpx, hpx, y);
}
// keys: [{t, c, k, y}] — rotation eases over each segment; on big zooms the zoom lags (dive) or leads (pull-out).
function cameraAt(keys, t) {
  let i = 0;
  while (i < keys.length - 2 && t >= keys[i + 1].t) i++;
  const a = keys[i], b = keys[i + 1];
  const p = clamp((t - a.t) / (b.t - a.t));
  const ratio = b.k / a.k, e = easeInOutCubic(p);
  const pz = ratio > 3 ? easeInOutCubic(clamp((p - 0.18) / 0.82)) : ratio < 1 / 3 ? easeInOutCubic(clamp(p / 0.82)) : e;
  const pr = ratio > 3 ? e : ratio < 1 / 3 ? easeInOutCubic(clamp((p - 0.12) / 0.88)) : e;
  const lin = Math.abs(Math.log(ratio)) < 0.15 && dist(a.c, b.c) < 0.02;   // slow push: linear, no ease stall
  const c = d3.geoInterpolate(a.c, b.c)(lin ? p : pr);
  const k = Math.exp(lerp(Math.log(a.k), Math.log(b.k), lin ? p : pz));
  return { c, k, y: lerp(a.y ?? CY, b.y ?? CY, lin ? p : pz) };
}
const dist = (a, b) => Math.hypot(a[0] - b[0], a[1] - b[1]);

// ---------- drawing helpers ----------
function subpaths(d) {
  if (!d) return [];
  return d.split(/(?=M)/).map(s => { _measure.setAttribute("d", s); return { p: new Path2D(s), L: _measure.getTotalLength() }; });
}
function drawOn(d, p, color, width, glowRGB, glow = 1) {
  if (p <= 0 || !d) return;
  ctx.save(); ctx.lineJoin = "round"; ctx.lineCap = "round";
  for (const s of subpaths(d)) {
    ctx.setLineDash([s.L, s.L + 1]); ctx.lineDashOffset = s.L * (1 - p);
    if (glow > 0) {
      ctx.strokeStyle = `rgba(${glowRGB},${0.5 * glow})`; ctx.lineWidth = width * 3.2;
      ctx.shadowColor = `rgba(${glowRGB},0.9)`; ctx.shadowBlur = 26 * C.glow * glow; ctx.stroke(s.p); ctx.shadowBlur = 0;
    }
    ctx.strokeStyle = color; ctx.lineWidth = width; ctx.stroke(s.p);
  }
  ctx.restore();
}
function fillGlow(d, rgb, a, blur = 50) {
  if (a <= 0 || !d) return;
  ctx.save(); ctx.shadowColor = `rgba(${rgb},0.8)`; ctx.shadowBlur = blur * C.glow;
  ctx.fillStyle = `rgba(${rgb},${a})`; ctx.fill(new Path2D(d)); ctx.restore();
}
function dimOutside(d, a) {
  if (a <= 0 || !d) return;
  const m = new Path2D(); m.rect(0, 0, W, H); m.addPath(new Path2D(d));
  ctx.fillStyle = `rgba(${C.dimRGB},${a})`; ctx.fill(m, "evenodd");
}
function roundRect(x, y, w, h, r) {
  ctx.beginPath(); ctx.moveTo(x + r, y); ctx.arcTo(x + w, y, x + w, y + h, r); ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r); ctx.arcTo(x, y, x + w, y, r); ctx.closePath();
}
// Glass card: dark translucent body, soft top sheen, hairline gradient border, optional accent rail on the left.
function card(x, y, w, h, alpha, accentRGB, r = 22) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.shadowColor = "rgba(0,0,0,0.45)"; ctx.shadowBlur = 30; ctx.shadowOffsetY = 10;
  roundRect(x, y, w, h, r); ctx.fillStyle = C.card; ctx.fill(); ctx.shadowColor = "transparent";
  const sheen = ctx.createLinearGradient(0, y, 0, y + h);
  sheen.addColorStop(0, C.dark ? "rgba(255,255,255,0.10)" : "rgba(255,255,255,0.6)"); sheen.addColorStop(0.5, "rgba(255,255,255,0.02)"); sheen.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = sheen; ctx.fill();
  const bd = ctx.createLinearGradient(x, y, x + w, y + h);
  bd.addColorStop(0, accentRGB ? `rgba(${accentRGB},0.9)` : "rgba(255,255,255,0.35)"); bd.addColorStop(0.6, "rgba(255,255,255,0.10)"); bd.addColorStop(1, accentRGB ? `rgba(${accentRGB},0.35)` : "rgba(255,255,255,0.15)");
  ctx.strokeStyle = bd; ctx.lineWidth = 1.5; ctx.stroke();
  if (accentRGB) { ctx.save(); roundRect(x, y, w, h, r); ctx.clip(); ctx.fillStyle = `rgb(${accentRGB})`; ctx.fillRect(x, y, 5, h); ctx.restore(); }
  ctx.restore();
}
function font(size, weight) { return `${weight} ${size}px Prompt`; }
function text(str, x, y, size, weight, alpha, color = C.text, align = "center", spacing = 0) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.fillStyle = color; ctx.textAlign = align; ctx.textBaseline = "alphabetic";
  ctx.font = font(size, weight); ctx.letterSpacing = spacing + "px";
  ctx.shadowColor = C.shadow; ctx.shadowBlur = 18; ctx.shadowOffsetY = C.dark ? 4 : 0;
  ctx.fillText(str, x, y); ctx.restore();
}
// Rich line: segs = [[str, color?], ...], centred on x. Returns width.
function rich(segs, x, y, size, weight, alpha, opts = {}) {
  if (alpha <= 0) return 0;
  ctx.save(); ctx.font = font(size, weight); ctx.textBaseline = "alphabetic"; ctx.textAlign = "left";
  const ws = segs.map(s => ctx.measureText(s[0]).width), tw = ws.reduce((a, b) => a + b, 0);
  let cx = opts.align === "left" ? x : x - tw / 2;
  ctx.globalAlpha = alpha;
  if (opts.outline) { ctx.lineJoin = "round"; ctx.lineWidth = opts.outline; ctx.strokeStyle = C.dark ? "rgba(0,0,0,0.85)" : "rgba(255,255,255,0.9)"; }
  ctx.shadowColor = C.shadow; ctx.shadowBlur = 20; ctx.shadowOffsetY = C.dark ? 4 : 0;
  segs.forEach((s, i) => {
    if (opts.outline) ctx.strokeText(s[0], cx, y);
    ctx.fillStyle = s[1] || C.text; ctx.fillText(s[0], cx, y); cx += ws[i];
  });
  ctx.restore();
  return tw;
}
// Map marker: solid core + white ring + accent halo, scales in with a soft overshoot.
function marker(px, py, p, color = C.target, t = 0) {
  if (p <= 0) return;
  const e = easeOutBack(clamp(p)), a = clamp(p * 2);
  ctx.save(); ctx.globalAlpha = a;
  const halo = ctx.createRadialGradient(px, py, 0, px, py, 70 * e);
  halo.addColorStop(0, color + "88"); halo.addColorStop(1, color + "00");
  ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(px, py, 70 * e, 0, 6.283); ctx.fill();
  const pulse = (t * 0.8) % 1;
  ctx.strokeStyle = color; ctx.globalAlpha = a * (1 - pulse) * 0.8; ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(px, py, 20 + 50 * pulse, 0, 6.283); ctx.stroke(); ctx.globalAlpha = a;
  ctx.shadowColor = color; ctx.shadowBlur = 20 * C.glow;
  ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(px, py, 17 * e, 0, 6.283); ctx.fill();
  ctx.shadowBlur = 0; ctx.fillStyle = color; ctx.beginPath(); ctx.arc(px, py, 11 * e, 0, 6.283); ctx.fill();
  ctx.restore();
}
// Callout: hairline leader from the marker with an elbow, ending in a glass card (title + optional sub).
function callout(px, py, dx, dy, title, sub, alpha, color = C.target, colorRGB = C.targetRGB) {
  if (alpha <= 0) return;
  ctx.save(); ctx.font = font(38, 700); const tw = ctx.measureText(title).width; ctx.font = font(28, 500);
  const sw = sub ? ctx.measureText(sub).width : 0; ctx.restore();
  const w = Math.max(tw, sw) + 64, h = sub ? 112 : 72;
  let cx = clamp(px + dx, SAFE.x0 + w / 2, SAFE.x1 - w / 2), cy = py + dy;
  const ex = cx, ey = dy > 0 ? cy - h / 2 : cy + h / 2;
  const grow = easeInOutCubic(clamp(alpha * 1.6));
  ctx.save(); ctx.globalAlpha = alpha; ctx.strokeStyle = color; ctx.lineWidth = 2.5; ctx.lineCap = "round";
  const mx = px, my = lerp(py, ey, 0.55);
  ctx.beginPath(); ctx.moveTo(px, py);
  const L1 = Math.abs(my - py), L2 = Math.hypot(ex - mx, ey - my), done = grow * (L1 + L2);
  if (done <= L1) ctx.lineTo(px, py + Math.sign(my - py) * done);
  else { ctx.lineTo(mx, my); const q = (done - L1) / L2; ctx.lineTo(lerp(mx, ex, q), lerp(my, ey, q)); }
  ctx.stroke(); ctx.restore();
  const ca = alpha * clamp((grow - 0.6) / 0.4);
  card(cx - w / 2, cy - h / 2, w, h, ca, colorRGB, 18);
  text(title, cx, sub ? cy - 4 : cy + 13, 38, 700, ca);
  if (sub) text(sub, cx, cy + 38, 28, 500, ca, C.sub);
}
function ripple(px, py, t, color, period = 1.4, maxR = 160) {
  for (let i = 0; i < 3; i++) {
    const ph = ((t / period) + i / 3) % 1;
    ctx.save(); ctx.globalAlpha = (1 - ph) * 0.7; ctx.strokeStyle = color; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.ellipse(px, py, maxR * ph, maxR * ph * 0.42, 0, 0, 6.283); ctx.stroke(); ctx.restore();
  }
}
// Sleek arrow: tapered shaft fading in from the tail, swept arrowhead with a notch, soft glow. Drawn up to p.
function arrow(x0, y0, x1, y1, p, color, width = 40, alpha = 1) {
  if (p <= 0 || alpha <= 0) return;
  const x = lerp(x0, x1, p), y = lerp(y0, y1, p), ang = Math.atan2(y1 - y0, x1 - x0), len = Math.hypot(x - x0, y - y0);
  const hw = width * 0.95, hl = Math.min(width * 1.5, len), sw = width * 0.32;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x0, y0); ctx.rotate(ang);
  const g = ctx.createLinearGradient(0, 0, len, 0);
  g.addColorStop(0, color + "00"); g.addColorStop(0.55, color + "cc"); g.addColorStop(1, color);
  ctx.shadowColor = color; ctx.shadowBlur = 22 * C.glow;
  ctx.fillStyle = g; ctx.beginPath();
  ctx.moveTo(0, -sw * 0.25); ctx.lineTo(len - hl * 0.7, -sw); ctx.lineTo(len - hl * 0.7, sw); ctx.lineTo(0, sw * 0.25); ctx.closePath(); ctx.fill();
  ctx.fillStyle = color; ctx.beginPath();
  ctx.moveTo(len, 0); ctx.lineTo(len - hl, -hw); ctx.lineTo(len - hl * 0.72, 0); ctx.lineTo(len - hl, hw); ctx.closePath(); ctx.fill();
  ctx.shadowBlur = 0; ctx.strokeStyle = "rgba(255,255,255,0.55)"; ctx.lineWidth = 1.5;
  ctx.beginPath(); ctx.moveTo(len, 0); ctx.lineTo(len - hl, -hw); ctx.stroke();
  ctx.restore();
}
// Ink stamp (e.g. a year): double rounded border, slight rotation, slams in from large with a settle.
// The stamp is drawn into its own small canvas first, so the worn-ink specks only knock holes in the ink
// (knocking them out of the main canvas left black dots in the video).
const _stampC = document.createElement("canvas");
function stamp(str, x, y, p, color = "#b3261e", size = 64, rot = -0.12) {
  if (p <= 0) return;
  const e = p < 1 ? 1 + 0.6 * Math.pow(1 - clamp(p / 0.35), 2) : 1, a = clamp(p / 0.25);
  const sc = _stampC.getContext("2d"); sc.font = font(size, 700);
  const w = sc.measureText(str).width + size * 0.9, h = size * 1.45, pad = size * 0.2;
  _stampC.width = Math.ceil(w + pad * 2); _stampC.height = Math.ceil(h + pad * 2);
  sc.translate(_stampC.width / 2, _stampC.height / 2); sc.font = font(size, 700); sc.strokeStyle = color; sc.fillStyle = color;
  const rr = (x0, y0, ww, hh, r) => { sc.beginPath(); sc.moveTo(x0 + r, y0); sc.arcTo(x0 + ww, y0, x0 + ww, y0 + hh, r); sc.arcTo(x0 + ww, y0 + hh, x0, y0 + hh, r); sc.arcTo(x0, y0 + hh, x0, y0, r); sc.arcTo(x0, y0, x0 + ww, y0, r); sc.closePath(); };
  sc.lineWidth = size * 0.07; rr(-w / 2, -h / 2, w, h, size * 0.18); sc.stroke();
  sc.lineWidth = size * 0.03; rr(-w / 2 + size * 0.14, -h / 2 + size * 0.14, w - size * 0.28, h - size * 0.28, size * 0.12); sc.stroke();
  sc.textAlign = "center"; sc.textBaseline = "middle"; sc.fillText(str, 0, size * 0.06);
  sc.globalCompositeOperation = "destination-out"; const r = mulberry32(str.length * 97 + size);   // worn ink
  for (let i = 0; i < 70; i++) { sc.beginPath(); sc.arc((r() - 0.5) * w, (r() - 0.5) * h, r() * size * 0.05, 0, 6.283); sc.fill(); }
  ctx.save(); ctx.translate(x, y); ctx.rotate(rot); ctx.scale(e, e); ctx.globalAlpha = a * 0.92;
  ctx.drawImage(_stampC, -_stampC.width / 2, -_stampC.height / 2); ctx.restore();
}
// Line icons (stroke only, consistent weight) — never emoji.
function icon(name, x, y, s, color, alpha = 1, lw = 4) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha; ctx.translate(x, y); ctx.scale(s / 48, s / 48);
  ctx.strokeStyle = color; ctx.fillStyle = color; ctx.lineWidth = lw * 48 / s; ctx.lineCap = "round"; ctx.lineJoin = "round";
  ctx.shadowColor = color; ctx.shadowBlur = 10 * C.glow;
  const P = new Path2D();
  if (name === "heart") { P.moveTo(0, 16); P.bezierCurveTo(-30, -6, -16, -30, 0, -12); P.bezierCurveTo(16, -30, 30, -6, 0, 16); }
  if (name === "share") { P.moveTo(-18, 16); P.quadraticCurveTo(-16, -8, 14, -8); P.moveTo(4, -20); P.lineTo(16, -8); P.lineTo(4, 4); }
  if (name === "plus") { P.moveTo(-14, 0); P.lineTo(14, 0); P.moveTo(0, -14); P.lineTo(0, 14); }
  if (name === "check") { P.moveTo(-14, 0); P.lineTo(-4, 10); P.lineTo(15, -11); }
  if (name === "house") { P.moveTo(-26, -2); P.lineTo(0, -24); P.lineTo(26, -2); P.moveTo(-19, -7); P.lineTo(-19, 22); P.lineTo(19, 22); P.lineTo(19, -7); P.moveTo(-6, 22); P.lineTo(-6, 8); P.lineTo(6, 8); P.lineTo(6, 22); }
  if (name === "chat") { P.moveTo(-22, -16); P.lineTo(22, -16); P.quadraticCurveTo(26, -16, 26, -12); P.lineTo(26, 8); P.quadraticCurveTo(26, 12, 22, 12); P.lineTo(-4, 12); P.lineTo(-14, 22); P.lineTo(-14, 12); P.lineTo(-22, 12); P.quadraticCurveTo(-26, 12, -26, 8); P.lineTo(-26, -12); P.quadraticCurveTo(-26, -16, -22, -16); P.moveTo(-12, -2); P.lineTo(12, -2); }
  if (name === "drop") { P.moveTo(0, -20); P.bezierCurveTo(14, -2, 16, 6, 16, 10); P.arc(0, 10, 16, 0, Math.PI); P.bezierCurveTo(-16, 6, -14, -2, 0, -20); }
  if (name === "law") { P.moveTo(-20, 20); P.lineTo(20, 20); P.moveTo(-14, 20); P.lineTo(-14, -6); P.moveTo(0, 20); P.lineTo(0, -6); P.moveTo(14, 20); P.lineTo(14, -6); P.moveTo(-22, -6); P.lineTo(22, -6); P.lineTo(0, -22); P.closePath(); }
  ctx.stroke(P);
  ctx.restore();
}
// Icon inside a glass circle.
function iconBadge(name, x, y, r, color, colorRGB, alpha = 1) {
  if (alpha <= 0) return;
  ctx.save(); ctx.globalAlpha = alpha;
  ctx.shadowColor = "rgba(0,0,0,0.4)"; ctx.shadowBlur = 24; ctx.shadowOffsetY = 8;
  ctx.fillStyle = C.card; ctx.beginPath(); ctx.arc(x, y, r, 0, 6.283); ctx.fill(); ctx.shadowColor = "transparent";
  const g = ctx.createLinearGradient(x, y - r, x, y + r); g.addColorStop(0, "rgba(255,255,255,0.14)"); g.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = g; ctx.fill();
  ctx.strokeStyle = `rgba(${colorRGB},0.9)`; ctx.lineWidth = 2; ctx.stroke();
  ctx.restore();
  icon(name, x, y, r * 1.05, color, alpha);
}
// ---------- raster (DEM) layers ----------
// Draw an equirectangular canvas covering bbox onto the projection, row strip by row strip.
function drawRaster(img, bbox, proj, alpha) {
  if (alpha <= 0) return;
  const [w, s, e, n] = bbox, rows = img.height, strip = 16;
  ctx.save(); ctx.globalAlpha = alpha; ctx.imageSmoothingEnabled = true; ctx.imageSmoothingQuality = "high";
  for (let r = 0; r < rows; r += strip) {
    const r1 = Math.min(rows, r + strip);
    const latT = n - (n - s) * r / rows, latB = n - (n - s) * r1 / rows, latM = (latT + latB) / 2, lonM = (w + e) / 2;
    const xl = proj([w, latM]), xr = proj([e, latM]), yt = proj([lonM, latT]), yb = proj([lonM, latB]);
    if (!xl || !xr || !yt || !yb) continue;
    ctx.drawImage(img, 0, r, img.width, r1 - r, xl[0], yt[1], xr[0] - xl[0], yb[1] - yt[1] + 0.8);
  }
  ctx.restore();
}

// ---------- subtitles ----------
// phrases: "text" or ["display text", "spoken text"] (spoken text gives the timing weight when the display
// differs, e.g. digits). Timing: characters are spread over the shot's measured speech segments.
const SEG = new Intl.Segmenter("th", { granularity: "word" });
function buildSubs(shot, phrases, keys) {
  const items = phrases.map(p => Array.isArray(p) ? { d: p[0], s: p[1] } : { d: p, s: p });
  const wts = items.map(it => it.s.replace(/\s+/g, "").length);
  const total = wts.reduce((a, b) => a + b, 0);
  const segs = shot.speech.length ? shot.speech : [[0, shot.dur]];
  const speechLen = segs.reduce((a, s) => a + s[1] - s[0], 0);
  // speech time r (pauses removed) -> absolute time; a start exactly on a pause jumps to the next segment
  const at = (r, start) => {
    for (const s of segs) { const L = s[1] - s[0]; if (start ? r < L - 1e-6 : r <= L + 1e-6) return shot.start + s[0] + Math.min(r, L); r -= L; }
    return shot.start + segs[segs.length - 1][1];
  };
  // phrase boundaries by character weight, snapped to a nearby pause in the voice (the phrase break is usually there)
  const gaps = segs.slice(0, -1).map((_, k) => segs.slice(0, k + 1).reduce((a, s) => a + s[1] - s[0], 0));
  const cuts = [0]; let acc = 0, used = -1;
  for (let i = 0; i < items.length - 1; i++) {
    acc += wts[i]; let r = acc / total * speechLen;
    let k = -1; gaps.forEach((g, j) => { if (j > used && Math.abs(g - r) < 0.5 && (k < 0 || Math.abs(g - r) < Math.abs(gaps[k] - r))) k = j; });
    if (k >= 0) { r = gaps[k]; used = k; }
    cuts.push(Math.max(r, cuts[cuts.length - 1]));
  }
  cuts.push(speechLen);
  const out = items.map((it, i) => {
    const ts = at(cuts[i], true), te = at(cuts[i + 1], false);
    const words = [...SEG.segment(it.d)].map(w => ({ str: w.segment, like: w.isWordLike, a: w.index, b: w.index + w.segment.length }));
    const L = it.d.length;
    words.forEach(w => { w.ts = lerp(ts, te, w.a / L); w.te = lerp(ts, te, w.b / L); w.key = keys.some(k => { const j = it.d.indexOf(k); return j >= 0 && w.a < j + k.length && w.b > j; }); });
    return { d: it.d, ts, te, words };
  });
  out.forEach((p, i) => { p.show = p.ts - 0.08; p.hide = i + 1 < out.length ? out[i + 1].ts - 0.08 : Math.min(p.te + 0.5, shot.start + shot.dur + 0.05); });
  return out;
}
function luminance(hex) {
  const v = [1, 3, 5].map(i => parseInt(hex.slice(i, i + 2), 16) / 255);
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}
function drawSubs(subs, t, o = {}) {
  const p = subs.find(s => t >= s.show && t < s.hide);
  if (!p) return;
  const size = 58, maxW = SAFE.x1 - SAFE.x0 - 20, lineH = 86, base = 1455, pad = 10;
  ctx.save(); ctx.font = font(size, 700); ctx.textBaseline = "alphabetic"; ctx.textAlign = "left"; ctx.lineJoin = "round";
  for (const w of p.words) w.w = ctx.measureText(w.str).width;
  const lines = [[]]; let lw = 0;
  for (const w of p.words) {
    if (lw + w.w > maxW && lines[lines.length - 1].length) { lines.push([]); lw = 0; if (!w.like && w.str.trim() === "") continue; }
    lines[lines.length - 1].push(w); lw += w.w;
  }
  const y0 = base - (lines.length - 1) * lineH;
  lines.forEach((ln, li) => { let x = CX - ln.reduce((a, w) => a + w.w, 0) / 2; for (const w of ln) { w.x = x; w.y = y0 + li * lineH; x += w.w; } });
  const pop = easeOutBack(life(t, p.show, p.show + 0.22));
  ctx.globalAlpha = clamp(life(t, p.show, p.show + 0.12)) * (1 - life(t, p.hide - 0.12, p.hide));
  ctx.translate(CX, y0 - 20); ctx.scale(0.88 + 0.12 * pop, 0.88 + 0.12 * pop); ctx.translate(-CX, -(y0 - 20));
  // speaker chip above the first line (story episodes)
  if (o.speaker) {
    ctx.save(); ctx.font = font(30, 700); const sw2 = ctx.measureText(o.speaker).width + 34;
    roundRect(CX - sw2 / 2, y0 - 118, sw2, 46, 23); ctx.fillStyle = o.bar || C.country; ctx.fill();
    ctx.fillStyle = luminance(o.bar || C.country) > 0.45 ? "#06101c" : "#ffffff"; ctx.textAlign = "center"; ctx.fillText(o.speaker, CX, y0 - 84); ctx.restore();
  }
  // 1) outlines of every word
  for (const w of p.words) { ctx.lineWidth = 12; ctx.strokeStyle = "rgba(0,0,0,0.78)"; ctx.strokeText(w.str, w.x, w.y); }
  // 2) the highlight bar: behind all fills, gliding from the previous word to the current one
  const spoken = p.words.filter(w => w.like);
  const i = spoken.findIndex(w => t >= w.ts && t < w.te + 0.05);
  let bar = null, barInk = "#06101c";
  if (i >= 0) {
    const cur = spoken[i], prev = spoken[i - 1], g = easeOutCubic(life(t, cur.ts, cur.ts + 0.12));
    const from = prev && prev.y === cur.y ? prev : cur;
    const hx = lerp(from.x, cur.x, g) - pad, hw = lerp(from.w, cur.w, g) + pad * 2;
    const col = cur.key ? C.target : (o.bar || C.country);
    ctx.save(); ctx.shadowColor = col; ctx.shadowBlur = 18 * C.glow;
    roundRect(hx, cur.y - 60, hw, 78, 14); bar = new Path2D(); bar.roundRect(hx, cur.y - 60, hw, 78, 14);
    const gr = ctx.createLinearGradient(0, cur.y - 60, 0, cur.y + 18); gr.addColorStop(0, col); gr.addColorStop(1, col + "cc");
    ctx.fillStyle = gr; ctx.fill(); ctx.restore();
    barInk = luminance(col) > 0.45 ? "#06101c" : "#ffffff";   // readable ink on light or dark bars
  }
  // 3) fills on top (nothing ever covers a word) ...
  for (const w of p.words) { ctx.fillStyle = w.key ? C.target : "#ffffff"; ctx.fillText(w.str, w.x, w.y); }
  // 4) ... and any glyph part that sits on the bar is knocked out in dark ink, so it stays readable
  if (bar) { ctx.save(); ctx.clip(bar); ctx.fillStyle = barInk; for (const w of p.words) ctx.fillText(w.str, w.x, w.y); ctx.restore(); }
  ctx.restore();
}

// ---------- frame furniture ----------
let _stars, _grain;
function initFurniture() {
  const rnd = mulberry32(7);
  _stars = Array.from({ length: 420 }, () => ({ x: rnd() * W, y: rnd() * H, r: 0.4 + rnd() * 1.6, a: 0.25 + rnd() * 0.75, tw: rnd() * 6.28 }));
  _grain = Array.from({ length: 6 }, (_, i) => {
    const g = document.createElement("canvas"); g.width = 270; g.height = 480;
    const gx = g.getContext("2d"), img = gx.createImageData(270, 480), r = mulberry32(100 + i), g0 = C.grain[0] / 255;
    for (let j = 0; j < img.data.length; j += 4) { const v = r() * 255; img.data[j] = v * g0 + 40 * (1 - g0); img.data[j + 1] = v * g0 + 25 * (1 - g0); img.data[j + 2] = v * g0; img.data[j + 3] = C.grain[1]; }
    gx.putImageData(img, 0, 0); return g;
  });
}
function drawSpace(t, k, cy, zoomed) {
  const bg = ctx.createRadialGradient(CX, CY, 0, CX, CY, H * 0.75);
  bg.addColorStop(0, C.space0); bg.addColorStop(1, C.space1); ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H);
  const starA = C.dark ? 1 - zoomed : 0;
  if (starA > 0) {
    ctx.fillStyle = "#cfe3ff";
    for (const s of _stars) { ctx.globalAlpha = starA * s.a * (0.75 + 0.25 * Math.sin(t * 2 + s.tw)); ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, 6.283); ctx.fill(); }
    ctx.globalAlpha = 1;
  }
  const R = k;
  if (R < H * 1.2) {
    const halo = ctx.createRadialGradient(CX, cy, R * 0.98, CX, cy, R * 1.18);
    halo.addColorStop(0, `rgba(${C.atmos},0.55)`); halo.addColorStop(0.35, `rgba(${C.atmos},0.14)`); halo.addColorStop(1, `rgba(${C.atmos},0)`);
    ctx.fillStyle = halo; ctx.beginPath(); ctx.arc(CX, cy, R * 1.18, 0, 6.283); ctx.fill();
  }
}
function drawOcean(path, k, cy) {
  const R = k, oc = ctx.createRadialGradient(CX - R * 0.35, cy - R * 0.4, R * 0.1, CX, cy, R);
  oc.addColorStop(0, C.ocean0); oc.addColorStop(1, C.ocean1);
  ctx.beginPath(); path({ type: "Sphere" }); ctx.fillStyle = oc; ctx.fill();
  if (k < 4000) { ctx.beginPath(); path(d3.geoGraticule10()); ctx.strokeStyle = C.grat; ctx.lineWidth = 1; ctx.stroke(); }
}
function drawLimb(k, cy) {
  if (k >= H * 1.2) return;
  const limb = ctx.createRadialGradient(CX, cy, k * 0.55, CX, cy, k);
  limb.addColorStop(0, "rgba(0,0,0,0)"); limb.addColorStop(1, `rgba(0,0,0,${C.limb})`);
  ctx.fillStyle = limb; ctx.beginPath(); ctx.arc(CX, cy, k, 0, 6.283); ctx.fill();
}
// Vignette + film grain: call after the map layers, before overlays and text.
function drawVignette(t) {
  const vg = ctx.createRadialGradient(CX, CY, H * 0.35, CX, CY, H * 0.72);
  vg.addColorStop(0, "rgba(0,0,0,0)"); vg.addColorStop(1, `rgba(0,0,0,${C.vignette})`);
  ctx.fillStyle = vg; ctx.fillRect(0, 0, W, H);
  ctx.imageSmoothingEnabled = false; ctx.drawImage(_grain[Math.floor(t * 30) % _grain.length], 0, 0, W, H); ctx.imageSmoothingEnabled = true;
}
function drawFinish(credit) {
  text(BRAND, SAFE.x0, SAFE.y0 + 30, 30, 700, 0.85, C.target, "left", 5);
  text(credit, SAFE.x0, SAFE.y1, 20, 500, 0.55, C.sub, "left");
}
function drawGuides() {
  if (!GUIDES) return;
  ctx.save();
  ctx.fillStyle = "rgba(255,40,40,0.28)"; ctx.fillRect(0, 0, W, 220); ctx.fillRect(0, H - 400, W, 400); ctx.fillRect(W - 140, 700, 140, H - 1100);
  ctx.fillStyle = "rgba(255,160,40,0.18)"; ctx.fillRect(0, 0, 60, H); ctx.fillRect(W - 60, 0, 60, H);
  ctx.setLineDash([18, 12]); ctx.lineWidth = 4; ctx.strokeStyle = "#ffd400"; ctx.strokeRect(2, 285, W - 4, 1350);
  ctx.setLineDash([]); ctx.strokeStyle = "#2bff6a"; ctx.strokeRect(SAFE.x0, SAFE.y0, SAFE.x1 - SAFE.x0, SAFE.y1 - SAFE.y0);
  ctx.restore();
}
async function loadFonts() {
  await Promise.all([document.fonts.load('700 100px Prompt', 'ไทยABC'), document.fonts.load('500 40px Prompt', 'ไทยABC')]);
}
