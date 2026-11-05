// NaiSibPro EP.37 — scenes (Two taps + one drain). Deterministic: everything is a function of t.
// Every tank level on screen comes from WR (math_logic.js) through sim-hour clocks defined below.
(function () {
const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark } = NSP;
const TL = window.TL, BT = window.BEATS, W = window.WR, WT = window.WATER;
const S0 = k => TL[k][0], D = k => TL[k][1];
const H0 = S0('hook'), ST0 = S0('story'), KN0 = S0('know'), EX0 = S0('expl'), QS = S0('quiz'), CD0 = S0('cd'), AN0 = S0('ans'), PR0 = S0('promo');
const END = TL.end;
const add = (sc, html) => sc.insertAdjacentHTML('beforeend', html);
const fr = (n, d, c = '') => `<span class="fr ${c}"><span class="fn">${n}</span><span class="fb"></span><span class="fd">${d}</span></span>`;
const op = s => `<span class="op">${s}</span>`;
const row = (id, top, inner, st = '') => `<div id="${id}" class="row" style="top:${top}px;${st}">${inner}</div>`;
const lbl = (id, inner) => `<div id="${id}" class="lbl">${inner}</div>`;
const show = (id, t, a, b, o) => tf($(id), life(t, a, b, o));
const ramp = (u, on, off = 1e9, d = .35, out = .3) => clamp(P(u, on, d) * (1 - P(u, off, out)));
const CLOSE = .12;                                  // valves close in 0.12 s, finishing exactly when the tank reaches 100%
const tp = (cx, cy, s, lx, ly) => [cx + (lx - 320) * s, cy + (ly - 400) * s];
function placeTank(tk, cx, cy, s, o = 1) { tf(tk.el, { x: cx - 320, y: cy - 400, s, o }); }
function at(id, x, y, extra = {}) { tf($(id), { ...extra, x: x + (extra.x || 0), y: y + (extra.y || 0) }); }
const fmtClock = hrs => { const m = Math.round(hrs * 60); return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`; };
function clockHTML(id, txt = '0:00 ชม.') { return `<div class="clock" id="${id}"><div class="face"><div class="hand2"></div><div class="hand"></div></div><span>${txt}</span></div>`; }
function setClock(id, hrs, suffix = ' ชม.') {
  const el = $(id); el.querySelector('span').textContent = 'เวลา ' + fmtClock(hrs) + suffix;
  el.querySelector('.hand').style.transform = `rotate(${hrs * 360}deg)`;           // one turn per simulated hour
  el.querySelector('.hand2').style.transform = `rotate(${hrs * 30}deg)`;
}
const pctTxt = lv => Math.round(lv * 100) + '%';
// sim-hour integrator for piecewise device schedules: ev = [[u, {A,B,D}, hoursPerSecond], ...]
function sim(u, ev, start = 0) {
  let lv = start, hrs = 0;
  for (let i = 0; i < ev.length; i++) {
    const [u0, fl, hps] = ev[i], u1 = i + 1 < ev.length ? ev[i + 1][0] : 1e9;
    if (u <= u0) break;
    const dt = Math.min(u, u1) - u0, dh = dt * hps;
    lv = W.level(dh, fl, lv); hrs += dh;
  }
  return { lv, hrs };
}
// water SFX loops while a device runs
function loop(kind, a, b, gain = .6, every = 1.25) { for (let x = a; x < b - .3; x += every) sfx(kind, x, gain); }
const SIGN = (c, bg, s = 62, fs = 50) => `<div class="sign" style="width:${s}px;height:${s}px;background:${bg};font-size:${fs}px;color:${c}">`;
const PLUS_SVG = (s = 34, c = '#0B1B3A') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 3v18M3 12h18" stroke="${c}" stroke-width="4.4" stroke-linecap="round"/></svg>`;
const MINUS_SVG = (s = 34, c = '#0B1B3A') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3 12h18" stroke="${c}" stroke-width="4.4" stroke-linecap="round"/></svg>`;
const ARROW_DOWN = (c, s = 70) => `<svg width="${s}" height="${s * 1.3}" viewBox="0 0 40 52"><path d="M20 2v40M6 30l14 16 14-16" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const WARN = s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2.5L22.5 21h-21z" fill="#FFD23F" stroke="#0B1B3A" stroke-width="1.6" stroke-linejoin="round"/><path d="M12 9v5.5" stroke="#0B1B3A" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.5" fill="#0B1B3A"/></svg>`;
const STOPWATCH = (s, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="13.5" r="8.2" fill="#0B1B3A" stroke="${c}" stroke-width="2.4"/><path d="M12 9v5l3 2M9 2.5h6M19 6l1.5-1.5" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/></svg>`;
const QMARK = s => `<svg width="${s}" height="${s * 1.4}" viewBox="0 0 50 70"><path d="M10 20a15 15 0 1 1 22 13c-5 3-7 6-7 11v3" fill="none" stroke="#FFD23F" stroke-width="10" stroke-linecap="round"/><circle cx="25" cy="62" r="6" fill="#FFD23F"/></svg>`;
const ARR = (s = 30, c = 'currentColor') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="margin:0 6px"><path d="M3 12h16M13 6l6 6-6 6" fill="none" stroke="${c}" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const TANK_ICON = s => `<svg width="${s}" height="${s}" viewBox="0 0 40 40"><rect x="8" y="8" width="24" height="28" rx="5" fill="none" stroke="#95BFEF" stroke-width="3"/><rect x="10" y="20" width="20" height="14" rx="3" fill="#22D3EE"/></svg>`;

// ---------- background recolour (blue bubbles instead of pastel stars/hearts) ----------
{
  const cols = ['rgba(47,107,255,.55)', 'rgba(34,211,238,.45)', 'rgba(47,107,255,.45)', 'rgba(34,211,238,.4)'];
  document.querySelectorAll('#bg .blob').forEach((el, i) => { el.style.background = `radial-gradient(circle, ${cols[i]} 0%, rgba(20,43,83,0) 68%)`; });
  document.querySelectorAll('#particles .pt').forEach((el, i) => {
    const s = 10 + (i * 37 % 26), c = i % 7 === 0 ? 'rgba(238,127,170,.55)' : i % 2 ? 'rgba(34,211,238,.7)' : 'rgba(149,191,239,.7)';
    el.innerHTML = i % 3 ? `<div style="width:${s}px;height:${s}px;border-radius:50%;border:3px solid ${c};box-shadow:0 0 10px ${c}"></div>` : `<div style="width:${s * .6}px;height:${s * .6}px;border-radius:50%;background:${c}"></div>`;
  });
}

// =====================================================================================
// SCENE 1 — HOOK (01_hook.mp3)
// =====================================================================================
const s1 = $('s1'), bH = BT.hook;
add(s1, `
  <div id="h-flash" class="abs c" style="left:140px;top:560px;width:800px;height:800px;border-radius:50%;background:radial-gradient(circle,rgba(47,107,255,.9) 0%,rgba(47,107,255,.35) 38%,rgba(47,107,255,0) 70%)"></div>
  ${row('h-title', 372, `<div class="ttl ess" style="font-size:74px">เตรียมสอบ<span class="y">นายสิบ</span></div>`)}
  ${row('h-subj', 482, `<div class="chip ice ess" style="font-size:40px">${TANK_ICON(44)}วิชาคณิตศาสตร์</div>`)}
  <div id="h-tankwrap"></div>
  ${row('h-miss', 560, `<div class="chip yl ess" style="font-size:42px;transform:rotate(-4deg)">${WARN(46)}ข้อนี้หลายคนพลาด!</div>`)}
  ${lbl('h-pct', `<div class="pct ess">0%</div>`)}
  ${lbl('h-warn', `<div>${WARN(78)}</div>`)}
  ${lbl('h-q', `<div>${QMARK(120)}</div>`)}
  ${lbl('h-inA', `<div style="display:flex;flex-direction:column;align-items:center">${SIGN('#fff', '#2F6BFF', 64)}${PLUS_SVG(34, '#fff')}</div></div>`)}
  ${lbl('h-inB', `<div style="display:flex;flex-direction:column;align-items:center">${SIGN('#0B1B3A', '#22D3EE', 64)}${PLUS_SVG(34)}</div></div>`)}
  ${lbl('h-outD', `<div>${SIGN('#0B1B3A', '#FFD23F', 64)}${MINUS_SVG(34)}</div></div>`)}
  <div class="row" style="top:1330px;gap:16px"><div id="h-k1" class="chip blue ess" style="font-size:34px;padding:10px 22px">${PLUS_SVG(28, '#fff')} 2 ก๊อกเติมน้ำ</div><div id="h-k2" class="chip dark ess" style="font-size:34px;padding:10px 22px">${MINUS_SVG(28, '#FFD23F')} 1 ท่อระบาย</div></div>
  ${row('h-kq', 1330, `<div class="chip yl ess" style="font-size:46px">น้ำจะเต็มในกี่ชั่วโมง?</div>`)}
  ${row('h-rush', 1330, `<div class="chip ice ess" style="font-size:38px"><span class="cA" style="color:#2F6BFF">ก๊อก A</span>${op('+')}<span style="color:#0EA5C6">ก๊อก B</span>${ARR(32)}ตอบเลย!</div>`)}
  ${row('h-wait', 600, `<div class="ttl ess" style="font-size:96px;transform:rotate(-3deg)"><span class="y">เดี๋ยวก่อน!</span></div>`)}
  ${row('h-io', 1330, `<div class="chip dark ess" style="font-size:36px"><span class="cB">เติมเข้า +</span><span style="opacity:.6">|</span><span class="cY">ระบายออก −</span></div>`)}
  ${row('h-go', 1330, `<div class="chip blue pinkline ess" style="font-size:42px">มาดูวิธีคิดให้ถูกต้อง!</div>`)}
`);
const tkH = WT.tank($('h-tankwrap'), { ticks: [{ f: .25 }, { f: .5 }, { f: .75 }] });
const hk = { cx: 540, cy: 1000, s: .86 };
const hkEv = [[bH.taps + .3, { A: 1, B: 1 }, .075], [bH.drain + .25, { A: 1, B: 1, D: 1 }, .075]];
sfx('whoosh', .02, .7); sfx('sparkle', .1, .6);
sfx('pop', bH.subj, .7); sfx('pop', bH.miss, .8); sfx('tap', bH.taps, 1); sfx('tap', bH.taps + .2, 1); sfx('splash', bH.taps + .5, .8);
loop('water', bH.taps + .3, D('hook'), .55); sfx('tap', bH.drain, 1); loop('drain', bH.drain + .3, D('hook'), .6, 1.4);
sfx('pop', bH.taps + .25, .6); sfx('pop', bH.drain + .25, .6); sfx('ding', bH.q, .6); sfx('riser', bH.rush - .2, .5);
sfx('freeze', bH.wait - .05, .9); sfx('pop', bH.notOnly + .2, .6); sfx('pop', bH.out + .2, .7); sfx('whoosh', bH.letsSee, .5);
function drawHook(t) {
  const u = t - H0;
  // frame 0: title is fully visible (no entrance), only a gentle pulse when the voice says it
  tf($('h-title'), { s: 1 + .04 * Math.sin(clamp((u - bH.title) / .9) * Math.PI) * (u > bH.title ? 1 : 0) });
  const fl = E.out(P(u, 0, 1.1)); tf($('h-flash'), { s: .4 + .9 * fl, o: (1 - fl) * .95 + .25 + .1 * Math.sin(u * 2) });
  show('h-subj', u, bH.subj, 1e9, { from: .5, dy: 30 });
  tf($('h-miss'), { ...life(u, bH.miss, bH.taps - .2, { from: .3, dy: 0, el: true, d: .8 }), y: 0 });
  // tank: push-in camera across the hook, small shake on "เดี๋ยวก่อน"
  const shake = u > bH.wait && u < bH.wait + .35 ? Math.sin(u * 90) * 10 * (1 - (u - bH.wait) / .35) : 0;
  const cs = hk.s * (1 + .05 * E.inOut(P(u, bH.letsSee, 2)));
  const { lv } = sim(u, hkEv);
  placeTank(tkH, hk.cx + shake, hk.cy, cs);
  const fA = ramp(u, bH.taps + .05), fD = ramp(u, bH.drain + .05);
  tkH.draw(t, { level: lv, A: fA, B: fA, D: fD, hlA: ramp(u, bH.notOnly, bH.out) + ramp(u, bH.taps, bH.taps + 1.4), hlB: ramp(u, bH.notOnly + .3, bH.out) + ramp(u, bH.taps, bH.taps + 1.4), hlD: ramp(u, bH.but, bH.drain + 2) + ramp(u, bH.out, bH.letsSee) });
  const [px, py] = tp(hk.cx, hk.cy, cs, 572, 340); at('h-pct', px, py, { o: clamp((u - bH.taps) * 3) }); $('h-pct').firstChild.textContent = pctTxt(lv);
  const [wx, wy] = tp(hk.cx, hk.cy, cs, 600, 560); at('h-warn', wx, wy + bob(u, 0, 6, 5), { s: E.back(P(u, bH.drain, .5)), o: clamp((u - bH.drain) * 3) * (1 - P(u, bH.q, .3)) });
  const ql = life(u, bH.q, bH.rush - .2, { from: .2, dy: 0, el: true, d: .9 });
  const [qx, qy] = tp(hk.cx, hk.cy, cs, 320, 430); at('h-q', qx, qy + bob(u, 1, 10, 3), { s: ql.s, o: ql.o, r: Math.sin(u * 2) * 6 });
  // opposite directions: + at taps, − at drain
  const [ax, ay] = tp(hk.cx, hk.cy, cs, 222, 225), [bx, by] = tp(hk.cx, hk.cy, cs, 418, 225), [dx, dy] = tp(hk.cx, hk.cy, cs, 600, 790);
  const la = life(u, bH.notOnly + .2, bH.letsSee + .6, { from: .3, dy: -30 }), ld = life(u, bH.out + .2, bH.letsSee + .6, { from: .3, dy: 30 });
  at('h-inA', ax - 70, ay + 10 + bob(u, 0, 6, 6), { s: la.s, o: la.o }); at('h-inB', bx + 70, by + 10 + bob(u, 1, 6, 6), { s: la.s, o: la.o });
  at('h-outD', dx - 80, dy - 30 + bob(u, 2, 6, 6), { s: ld.s * (1 + .08 * Math.sin(u * 8)), o: ld.o });
  show('h-k1', u, bH.taps + .25, bH.q - .1, { from: .5, dy: 30 }); show('h-k2', u, bH.drain + .25, bH.q - .1, { from: .5, dy: 30 });
  show('h-kq', u, bH.q, bH.rush - .1, { from: .4, dy: 30, el: true, d: .7 });
  const rl = life(u, bH.rush, bH.wait, { from: .5, dy: 30 }); tf($('h-rush'), { ...rl, x: Math.sin(u * 40) * 2 * (u > bH.rush + 2.5 ? 1 : 0) });
  show('h-wait', u, bH.wait, bH.notOnly + .5, { from: 2.2, dy: 0, d: .35 });
  show('h-io', u, bH.notOnly + .2, bH.letsSee - .1, { from: .5, dy: 30 });
  show('h-go', u, bH.letsSee, 1e9, { from: .4, dy: 30, el: true, d: .8 });
}

// =====================================================================================
// SCENE 2 — STORY (02_story.mp3)
// =====================================================================================
const s2 = $('s2'), bS = BT.story;
const HPS_AB = .6;                                  // A and B demos share one time-lapse speed: 0.6 s per simulated hour
const sA0 = bS.A4 + .15, sA1 = sA0 + W.HOURS.A * HPS_AB;              // tap A alone: 0 → full in 4 h
const sB0 = bS.B6 - .2, sB1 = sB0 + W.HOURS.B * HPS_AB;               // tap B alone: 0 → full in 6 h
const DR_HPS = .4, sD0 = bS.drainOnly + .3, sD1 = sD0 + W.HOURS.D * DR_HPS;   // drain alone: full → empty in 12 h
const allEv = [[bS.allA + .25, { A: 1 }, .1], [bS.allB + .25, { A: 1, B: 1 }, .1], [bS.allD + .3, { A: 1, B: 1, D: 1 }, .1]];
add(s2, `
  <div id="s-tankwrap"></div>
  ${row('s-empty', 380, `<div class="chip ice ess" style="font-size:44px">${TANK_ICON(48)}ถังเปล่า 1 ใบ</div>`)}
  ${row('s-tA', 372, `<div class="chip blue ess" style="font-size:40px">ก๊อก A เติมเต็ม = 4 ชั่วโมง</div>`)}
  ${row('s-tB', 456, `<div class="chip cyan ess" style="font-size:40px">ก๊อก B เติมเต็ม = 6 ชั่วโมง</div>`)}
  ${row('s-tD', 540, `<div class="chip dark ess" style="font-size:40px">ท่อระบาย ระบายหมด = 12 ชั่วโมง</div>`)}
  ${lbl('s-pct', `<div class="pct ess">0%</div>`)}
  ${lbl('s-dlab', `<div class="chip yl ess" style="font-size:32px;padding:8px 18px">ท่อระบาย 1 ท่อ</div>`)}
  ${row('s-clock', 1300, clockHTML('s-clk'))}
  ${row('s-formula', 1274, `<div class="eq ess" style="font-size:52px;gap:6px">
      <span class="t chip blue" id="s-fA" style="font-size:44px;padding:8px 24px">A</span><span class="t op" id="s-f1">+</span>
      <span class="t chip cyan" id="s-fB" style="font-size:44px;padding:8px 24px">B</span><span class="t op" id="s-f2">−</span>
      <span class="t chip dark" id="s-fD" style="font-size:40px;padding:8px 22px">ท่อระบาย</span></div>`)}
  ${row('s-when', 1356, `<div class="chip yl ess" style="font-size:34px;padding:6px 22px">${STOPWATCH(40, '#0B1B3A')}น้ำจะเต็มใน ? ชั่วโมง</div>`)}
  ${row('s-think', 560, `<div class="bub ess" style="position:relative;font-size:33px;border-radius:40px;padding:16px 24px;box-shadow:0 0 0 5px #22D3EE,0 16px 30px rgba(0,0,0,.4)">2 ก๊อกช่วยกันเติม <span style="color:#2F6BFF;font-weight:800">ต้องเร็วมากแน่ๆ!</span></div>`)}
  <div id="s-dim" class="abs" style="inset:0;background:rgba(11,27,58,.72);opacity:0"></div>
  ${row('s-key1', 700, `<div class="ttl ess" style="font-size:54px">แต่สิ่งสำคัญคือ…</div>`)}
  ${row('s-key2', 820, `<div class="icecard ess" style="position:relative;left:0;width:auto;padding:30px 40px;text-align:center"><div style="font-size:44px;font-weight:700">ต้องคิดเป็น</div><div style="font-size:76px;font-weight:800;color:#2F6BFF;line-height:1.2">อัตราการทำงาน</div></div>`)}
`);
const tkS = WT.tank($('s-tankwrap'), { ticks: [{ f: .25 }, { f: .5 }, { f: .75 }] });
const st = { cx: 540, cy: 960, s: .78 };
sfx('whoosh', ST0 - .1, .4); sfx('pop', ST0 + bS.empty + .1, .6);
sfx('tap', ST0 + bS.A4, 1); loop('water', ST0 + sA0, ST0 + sA1, .55); sfx('ding', ST0 + sA1, .55);
sfx('swoosh', ST0 + bS.B - .15, .4); sfx('tap', ST0 + sB0 - .1, 1); loop('water', ST0 + sB0, ST0 + sB1, .5); sfx('ding', ST0 + sB1, .55);
sfx('pop', ST0 + bS.hasDrain + .1, .7); sfx('tap', ST0 + sD0 - .1, 1); loop('drain', ST0 + sD0, ST0 + sD1, .65, 1.4); sfx('ding', ST0 + sD1, .5);
sfx('swoosh', ST0 + bS.question, .4);
[bS.allA, bS.allB, bS.allD].forEach((x, i) => { sfx('tap', ST0 + x + .2, .9); sfx('pop', ST0 + x + .25, .7); });
loop('water', ST0 + bS.allA + .3, ST0 + bS.key, .45); loop('drain', ST0 + bS.allD + .3, ST0 + bS.key, .5, 1.4);
sfx('tick', ST0 + bS.when, .7); sfx('pop', ST0 + bS.many + .2, .7); sfx('riser', ST0 + bS.fast - .3, .4);
sfx('whoosh', ST0 + bS.key, .5); sfx('ding', ST0 + bS.rate + .1, .9); sfx('sparkle', ST0 + bS.rate + .3, .7);
// per-moment tank state for the story
function storyState(u) {
  if (u < bS.B - .1) {                          // empty → tap A alone
    const hrs = clamp((u - sA0) / HPS_AB, 0, W.HOURS.A);
    return { lv: W.level(hrs, { A: 1 }), hrs, A: ramp(u, bS.A4, sA1 - CLOSE, .35, CLOSE), B: 0, D: 0, clock: u > bS.A4 - .2, clockHrs: hrs };
  }
  if (u < bS.drainOnly + .1) {                  // reset → tap B alone
    const hrs = clamp((u - sB0) / HPS_AB, 0, W.HOURS.B);
    return { lv: W.level(hrs, { B: 1 }), hrs, A: 0, B: ramp(u, sB0 - .1, sB1 - CLOSE, .35, CLOSE), D: 0, clock: u > sB0 - .3 && u < bS.hasDrain + .4, clockHrs: hrs, reset: bS.B - .1 };
  }
  if (u < bS.question + .1) {                   // drain alone, starting full
    const hrs = clamp((u - sD0) / DR_HPS, 0, W.HOURS.D);
    return { lv: W.drainOnly(hrs), hrs, A: 0, B: 0, D: ramp(u, sD0 - .1, sD1 - CLOSE, .35, CLOSE), clock: true, clockHrs: hrs };
  }
  const r = sim(u, allEv);                        // all three from empty
  return { lv: r.lv, hrs: r.hrs, A: ramp(u, bS.allA + .2), B: ramp(u, bS.allB + .2), D: ramp(u, bS.allD + .25), clock: false, reset: bS.question + .1 };
}
function drawStory(t) {
  const u = t - ST0, s = storyState(u);
  const push = 1 + .04 * E.inOut(P(u, bS.allA, 4));
  placeTank(tkS, st.cx, st.cy, st.s * push, clamp((u + .2) * 4));
  tkS.draw(t, { level: s.lv, A: s.A, B: s.B, D: s.D,
    hlA: ramp(u, bS.A, bS.B - .3) + ramp(u, bS.allA, bS.allA + 1.2), hlB: ramp(u, bS.B, bS.hasDrain - .2) + ramp(u, bS.allB, bS.allB + 1.2), hlD: ramp(u, bS.hasDrain, bS.question - .2) + ramp(u, bS.allD, bS.allD + 1.5) });
  const sc = st.s * push, [px, py] = tp(st.cx, st.cy, sc, 560, 250);
  at('s-pct', px, py, { o: clamp((u - .3) * 3) }); $('s-pct').firstChild.textContent = pctTxt(s.lv);
  const [dx, dy] = tp(st.cx, st.cy, sc, 520, 600); at('s-dlab', dx, dy, { ...life(u, bS.hasDrain + .1, bS.drainOnly + 3, { from: .4, dy: 0 }) });
  show('s-empty', u, bS.empty + .05, bS.A - .1, { from: .5, dy: 30 });
  show('s-tA', u, bS.A4 + .2, bS.many - .2, { from: .5, dy: 30 }); show('s-tB', u, bS.B6 + .2, bS.many - .2, { from: .5, dy: 30 }); show('s-tD', u, bS.drainOnly + .6, bS.many - .2, { from: .5, dy: 30 });
  const cl = life(u, bS.A4 - .2, bS.question - .1, { from: .6, dy: 30 });
  tf($('s-clock'), cl); setClock('s-clk', s.clockHrs ?? 0);
  // a quick blue flash marks each reset to a fresh demonstration
  const rf = Math.max(1 - Math.abs(u - (bS.B - .1)) / .25, 1 - Math.abs(u - (bS.question + .1)) / .25, 0);
  $('flash').style.opacity = Math.max(+$('flash').style.opacity || 0, rf * .55);
  // all three running → formula
  show('s-formula', u, bS.allA, bS.key - .1, { from: .6, dy: 30 });
  [['s-fA', bS.allA + .2], ['s-f1', bS.allB + .1], ['s-fB', bS.allB + .2], ['s-f2', bS.allD + .1], ['s-fD', bS.allD + .25]].forEach(([id, a]) => tf($(id), life(u, a, 1e9, { from: .2, dy: 0, el: true, d: .7 })));
  show('s-when', u, bS.when, bS.key - .1, { from: .4, dy: 20, el: true, d: .8 });
  const th = life(u, bS.many + .2, bS.key, { from: .4, dy: 30, el: true, d: .9 });
  tf($('s-think'), { ...th, s: th.s * (1 + .05 * E.back(P(u, bS.fast, .4)) * (1 - P(u, bS.fast + .5, .4))) });
  $('s-dim').style.opacity = .85 * ramp(u, bS.key, 1e9, .4);
  show('s-key1', u, bS.key + .05, 1e9, { from: .5, dy: 30 });
  show('s-key2', u, bS.rate, 1e9, { from: .3, dy: 40, el: true, d: .9 });
}

// =====================================================================================
// SCENE 3 — KNOWLEDGE: work rates (03_knowledge.mp3)
// =====================================================================================
const s3 = $('s3'), bK = BT.know;
const qTicks = n => [...Array(n - 1)].map((_, i) => ({ f: (i + 1) / n, label: `${i + 1}/${n}`, fs: 34 }));
add(s3, `
  ${row('k-hdr', 370, `<div class="chip blue pinkline ess" style="font-size:44px">${STOPWATCH(48, '#fff')}หลักอัตราการทำงาน</div>`)}
  <div id="k-wrap"></div>
  ${row('k-job', 1205, `<div class="chip ice ess" style="font-size:48px">เต็มถัง <span style="color:#2F6BFF;margin:0 10px">=</span> 1 งาน</div>`)}
  ${row('k-cap', 466, `<div class="ttl ess" style="font-size:44px" id="k-capt">ก๊อก A เติมเต็มใน 4 ชม.</div>`)}
  ${row('k-clock', 1200, clockHTML('k-clk'))}
  ${row('k-bigA', 1168, `<div class="eq ess" style="font-size:80px"><span class="cA">A</span><span class="op">=</span>${fr(1, 4, 'cA')}<span style="font-size:34px;margin-left:16px;color:#fff;font-weight:700">ถัง/ชม.</span></div>`)}
  ${row('k-bigB', 1168, `<div class="eq ess" style="font-size:80px"><span class="cB">B</span><span class="op">=</span>${fr(1, 6, 'cB')}<span style="font-size:34px;margin-left:16px;color:#fff;font-weight:700">ถัง/ชม.</span></div>`)}
  ${row('k-bigD', 1168, `<div class="eq ess" style="font-size:76px"><span class="cD" style="font-size:50px">ระบาย</span><span class="op">=</span><span class="cY" style="font-size:96px;margin-right:4px">−</span>${fr(1, 12, 'cD')}</div>`)}
  ${lbl('k-band', `<div style="width:290px;height:42px;border:5px dashed #FFD23F;border-radius:10px;background:rgba(255,210,63,.18)"></div>`)}
  ${lbl('k-bandl', `<div class="chip yl ess" style="font-size:34px;padding:6px 16px">หายไป 1/12</div>`)}
  <div id="k-sum" class="row" style="top:1316px;gap:12px">
    <div id="k-s1" class="chip dark ess" style="font-size:40px;padding:6px 18px;box-shadow:0 0 0 4px #2F6BFF"><span class="cA">A</span><span class="op">=</span>${fr(1, 4, 'cA')}</div>
    <div id="k-s2" class="chip dark ess" style="font-size:40px;padding:6px 18px;box-shadow:0 0 0 4px #22D3EE"><span class="cB">B</span><span class="op">=</span>${fr(1, 6, 'cB')}</div>
    <div id="k-s3" class="chip dark ess" style="font-size:40px;padding:6px 18px;box-shadow:0 0 0 4px #FFD23F"><span class="cD" style="font-size:32px">ระบาย</span><span class="op">=</span><span class="cY">−</span>${fr(1, 12, 'cD')}</div>
  </div>
  <div id="k-mem" class="icecard" style="top:600px;height:560px"></div>
  ${row('k-easy', 560, `<div class="chip yl ess" style="font-size:44px;transform:rotate(-3deg)">จำง่ายๆ!</div>`)}
  ${row('k-form', 700, `<div class="eq ess" style="font-size:66px;color:#142B53">
      <span class="t" id="k-f1" style="color:#2F6BFF">เติม</span><span class="t op" id="k-f2" style="color:#2F6BFF">+</span><span class="t" id="k-f3" style="color:#0EA5C6">เติม</span><span class="t op" id="k-f4" style="color:#D97706">−</span><span class="t" id="k-f5" style="color:#142B53">ระบาย</span></div>`)}
  ${row('k-plus', 860, `<div class="chip blue ess" style="font-size:48px">${SIGN('#2F6BFF', '#fff', 62)}${PLUS_SVG(36, '#2F6BFF')}</div>คนเติม = บวก</div>`)}
  ${row('k-minus', 990, `<div class="chip dark ess" style="font-size:48px;box-shadow:0 0 0 4px #FFD23F">${SIGN('#0B1B3A', '#FFD23F', 62)}${MINUS_SVG(36)}</div>คนระบาย = ลบ</div>`)}
`);
const kw = $('k-wrap');
const tkK0 = WT.tank(kw, { ticks: [] }), tkKA = WT.tank(kw, { B: false, D: false, ticks: qTicks(4) }), tkKB = WT.tank(kw, { A: false, D: false, ticks: qTicks(6) }),
  tkKD = WT.tank(kw, { A: false, B: false, ticks: [...Array(11)].map((_, i) => ({ f: (i + 1) / 12 })).concat([{ f: 11 / 12, label: '11/12', fs: 32, c: '#FFD23F', major: 1 }]) });
const kt = { cx: 540, cy: 870, s: .74 };
const kA0 = bK.A1h + .1, kA1 = bK.Afr - .05, kB0 = bK.B1h + .1, kB1 = bK.Bfr - .05, kD0 = bK.D1h + .1, kD1 = bK.Dfr - .05;   // exactly one simulated hour each
sfx('whoosh', KN0 - .1, .4); sfx('pop', KN0 + bK.rule + .1, .7); sfx('pop', KN0 + bK.full, .6); sfx('ding', KN0 + bK.job, .7);
sfx('swoosh', KN0 + bK.A4 - .1, .4); sfx('tap', KN0 + kA0 - .1, .9); loop('water', KN0 + kA0, KN0 + kA1, .5); sfx('ding', KN0 + bK.Afr, .8);
sfx('swoosh', KN0 + bK.B6 - .1, .4); sfx('tap', KN0 + kB0 - .1, .9); loop('water', KN0 + kB0, KN0 + kB1, .5); sfx('ding', KN0 + bK.Bfr, .8);
sfx('swoosh', KN0 + bK.D - .1, .4); sfx('tap', KN0 + kD0 - .1, .9); loop('drain', KN0 + kD0, KN0 + kD1, .6, 1.2); sfx('ding', KN0 + bK.Dfr, .8);
sfx('whoosh', KN0 + bK.easy - .1, .5); sfx('pop', KN0 + bK.easy + .1, .7);
[[bK.plus, 0], [bK.plus + .35, 1], [bK.plus + .7, 2], [bK.minus, 3], [bK.minus + .35, 4]].forEach(([x]) => sfx('pop', KN0 + x, .6));
sfx('success', KN0 + bK.plus + .2, .5); sfx('stamp', KN0 + bK.minus + .2, .6);
function drawKnow(t) {
  const u = t - KN0;
  show('k-hdr', u, bK.rule, 1e9, { from: .5, dy: 30 });
  // which tank is on stage
  const vis = (a, b) => clamp((u - a) / .3) * (1 - clamp((u - b) / .3));
  const o0 = vis(bK.rule + .3, bK.A4 - .2), oA = vis(bK.A4 - .2, bK.B6 - .2), oB = vis(bK.B6 - .2, bK.D - .2), oD = vis(bK.D - .2, bK.easy);
  const sl = (a) => (1 - E.out(P(u, a, .45))) * 60;
  placeTank(tkK0, kt.cx, kt.cy + sl(bK.rule + .3), kt.s, o0); tkK0.draw(t, { level: 1, wave: .8 });
  const hA = clamp((u - kA0) / (kA1 - kA0)), hB = clamp((u - kB0) / (kB1 - kB0)), hD = clamp((u - kD0) / (kD1 - kD0));
  placeTank(tkKA, kt.cx, kt.cy + sl(bK.A4 - .2), kt.s, oA); if (oA > 0) tkKA.draw(t, { level: W.level(hA, { A: 1 }), A: ramp(u, kA0 - .1, kA1), hlA: ramp(u, bK.A4, bK.A4 + 2) });
  placeTank(tkKB, kt.cx, kt.cy + sl(bK.B6 - .2), kt.s, oB); if (oB > 0) tkKB.draw(t, { level: W.level(hB, { B: 1 }), B: ramp(u, kB0 - .1, kB1), hlB: ramp(u, bK.B6, bK.B6 + 2) });
  placeTank(tkKD, kt.cx, kt.cy + sl(bK.D - .2), kt.s, oD); if (oD > 0) tkKD.draw(t, { level: W.drainOnly(hD), D: ramp(u, kD0 - .1, kD1), hlD: ramp(u, bK.D, bK.D12 + 2) });
  show('k-job', u, bK.job, bK.A4 - .2, { from: .4, dy: 30, el: true, d: .8 });
  // caption above the tank
  const cap = u < bK.B6 - .2 ? 'ก๊อก A เติมเต็มใน 4 ชม.' : u < bK.D - .2 ? 'ก๊อก B เติมเต็มใน 6 ชม.' : 'ท่อระบาย ระบายหมดใน 12 ชม.';
  $('k-capt').textContent = cap;
  const ca = u < bK.B6 - .2 ? bK.A4 : u < bK.D - .2 ? bK.B6 : bK.D12;
  tf($('k-cap'), life(u, ca, u < bK.B6 - .2 ? bK.B6 - .3 : u < bK.D - .2 ? bK.D - .3 : bK.easy - .1, { from: .5, dy: 30 }));
  // one-hour clocks
  const cOn = u < bK.B6 - .2 ? [bK.A1h - .2, bK.Afr - .1, hA] : u < bK.D - .2 ? [bK.B1h - .2, bK.Bfr - .1, hB] : [bK.D1h - .2, bK.Dfr - .1, hD];
  tf($('k-clock'), life(u, cOn[0], cOn[1], { from: .6, dy: 30, out: .2 })); setClock('k-clk', cOn[2]);
  // big results, then they fly into the summary row
  const big = (id, a, b) => { const l = life(u, a, b, { from: .3, dy: 0, el: true, d: .8, out: .35 }); tf($(id), l); };
  big('k-bigA', bK.Afr, bK.B6 - .3); big('k-bigB', bK.Bfr, bK.D - .3); big('k-bigD', bK.Dfr, bK.easy - .2);
  [['k-s1', bK.B6 - .2], ['k-s2', bK.D - .2], ['k-s3', bK.easy - .1]].forEach(([id, a]) => tf($(id), life(u, a, 1e9, { from: .4, dy: -60 })));
  // the removed twelfth on the drain tank
  const [bx, by] = tp(kt.cx, kt.cy, kt.s, 320, tkKD.Y1 - tkKD.IH * 23 / 24);
  at('k-band', bx, by, { s: kt.s, o: oD * clamp((u - bK.Dfr + .3) * 3) });
  const [lx, ly] = tp(kt.cx, kt.cy, kt.s, 320, tkKD.Y1 - tkKD.IH * 23 / 24 - 70); at('k-bandl', lx, ly, { o: oD * clamp((u - bK.Dfr) * 3), s: E.back(P(u, bK.Dfr, .5)) });
  // memory rule card
  const mc = life(u, bK.easy, 1e9, { from: .6, dy: 60 }); tf($('k-mem'), mc);
  show('k-easy', u, bK.easy + .1, 1e9, { from: .3, dy: 0, el: true, d: .8 });
  show('k-form', u, bK.easy + .15, 1e9, { from: .6, dy: 20 });
  [['k-f1', bK.plus], ['k-f2', bK.plus + .35], ['k-f3', bK.plus + .7], ['k-f4', bK.minus], ['k-f5', bK.minus + .35]].forEach(([id, a]) => tf($(id), life(u, a, 1e9, { from: .2, dy: -30, el: true, d: .7 })));
  show('k-plus', u, bK.plus + .2, 1e9, { from: .4, dy: 30 }); show('k-minus', u, bK.minus + .2, 1e9, { from: .4, dy: 30 });
}

// =====================================================================================
// SCENE 4 — EXPLANATION: net rate (04_explanation.mp3)
// =====================================================================================
const s4 = $('s4'), bX = BT.expl;
const hourTicks = [1, 2, 3].map(k => ({ f: k / 3, label: k < 3 ? `${k} ชม.` : '3 ชม.', fs: 36, c: '#FFD23F', major: 1 }));
add(s4, `
  ${row('x-hdr', 370, `<div class="chip blue pinkline ess" style="font-size:42px">รวมอัตราการทำงาน</div>`)}
  <div id="x-panel" class="panel" style="top:450px;height:462px"></div>
  ${row('x-net', 470, `<div class="chip ice ess" style="font-size:32px;padding:6px 20px">อัตราสุทธิ (ถังต่อชั่วโมง)</div>`)}
  ${row('x-r1', 528, `<div class="eq ess" style="font-size:80px">
      <span class="t" id="x-a">${fr(1, 4, 'cA')}</span><span class="t op" id="x-p1">+</span><span class="t" id="x-b">${fr(1, 6, 'cB')}</span><span class="t op" id="x-m1">−</span><span class="t" id="x-d">${fr(1, 12, 'cD')}</span></div>`)}
  ${lbl('x-x3', `<div class="chip yl" style="font-size:28px;padding:2px 12px">×3</div>`)}
  ${lbl('x-x2', `<div class="chip yl" style="font-size:28px;padding:2px 12px">×2</div>`)}
  ${row('x-lcd', 470, `<div class="chip yl ess" style="font-size:32px;padding:6px 20px">ทำส่วนให้เท่ากัน${ARR(28)}ส่วน 12</div>`)}
  ${row('x-r2', 730, `<div class="eq ess" style="font-size:80px">
      <span class="t" id="x-c1">${fr(3, 12, 'cA')}</span><span class="t op" id="x-p2">+</span><span class="t" id="x-c2">${fr(2, 12, 'cB')}</span><span class="t op" id="x-m2">−</span><span class="t" id="x-c3">${fr(1, 12, 'cD')}</span></div>`)}
  ${row('x-r3', 738, `<div class="eq ess" style="font-size:70px">
      <span class="t op" id="x-e0">=</span><span class="t" id="x-sum">${fr('<span class="cA">3</span> + <span class="cB">2</span> − <span class="cD">1</span>', 12)}</span>
      <span class="t op" id="x-e1">=</span><span class="t" id="x-412">${fr(4, 12)}</span><span class="t op" id="x-e2">=</span>
      <span class="t" id="x-13" style="background:#FFD23F;color:#142B53;border-radius:18px;padding:4px 14px">${fr(1, 3)}</span></div>`)}
  <div id="x-tw"></div>
  ${lbl('x-tA', `<div class="chip blue" style="font-size:34px;padding:6px 16px">+${fr(1, 4)}</div>`)}
  ${lbl('x-tB', `<div class="chip cyan" style="font-size:34px;padding:6px 16px">+${fr(1, 6)}</div>`)}
  ${lbl('x-tD', `<div class="chip yl" style="font-size:34px;padding:6px 16px">−${fr(1, 12)}</div>`)}
  ${row('x-rate', 380, `<div class="chip ice ess" style="font-size:40px">อัตราสุทธิ <span class="op" style="color:#2F6BFF">=</span><span style="color:#2F6BFF;font-size:46px">${fr(1, 3)}</span> ถัง/ชม.</div>`)}
  ${lbl('x-pct', `<div class="pct ess">0%</div>`)}
  ${row('x-clock', 1216, clockHTML('x-clk'))}
  ${row('x-h1', 1318, `<div class="chip yl ess" style="font-size:40px;padding:8px 26px">1 ชั่วโมง = ${fr(1, 3)} ถัง</div>`)}
  ${row('x-ans', 1330, `<div class="ttl ess" style="font-size:80px">ใช้เวลา <span class="y">3 ชั่วโมง</span></div>`)}
`);
const tkE = WT.tank($('x-tw'), { ticks: hourTicks });
const xLapse = [[bX.hour1 + .5, 0], [bX.third + 2.6, 1], [bX.full + .2, 1], [bX.three - .1, 3]];   // [u, sim hours] keyframes: 0→1 h, hold, 1→3 h
const xHours = u => { if (u <= xLapse[0][0]) return 0; for (let i = 0; i < xLapse.length - 1; i++) { const [a, ha] = xLapse[i], [b, hb] = xLapse[i + 1]; if (u <= b) return lerp(ha, hb, (u - a) / (b - a)); } return 3; };
const xFlowOn = bX.hour1 + .4, xFlowOff = bX.three - .1;
const xFlow = u => ramp(u, xFlowOn, xFlowOff - CLOSE, .35, CLOSE);    // devices run exactly while simulated time advances; stop at full
sfx('whoosh', EX0 - .1, .4); sfx('pop', EX0 + bX.intro + .2, .6);
[bX.a, bX.b, bX.d].forEach(x => { sfx('pop', EX0 + x + .1, .8); sfx('bubble', EX0 + x + .3, .6); });
sfx('ding', EX0 + bX.net, .5); [bX.n1, bX.n2, bX.n3].forEach(x => sfx('click', EX0 + x, .6));
sfx('whoosh', EX0 + bX.lcd, .4); sfx('pop', EX0 + bX.lcd + .5, .6); sfx('pop', EX0 + bX.lcd + .8, .6);
[bX.c1, bX.c2, bX.c3].forEach(x => sfx('pop', EX0 + x + .05, .7));
sfx('pop', EX0 + bX.eq + .05, .6); sfx('pop', EX0 + bX.r412 + .05, .7); sfx('ding', EX0 + bX.r13 + .05, .9); sfx('sparkle', EX0 + bX.r13 + .2, .6);
sfx('swoosh', EX0 + bX.hour1 - .2, .4); [0, .15, .3].forEach(d => sfx('tap', EX0 + xFlowOn - .2 + d, .8));
loop('water', EX0 + xFlowOn, EX0 + xFlowOff, .5); loop('drain', EX0 + xFlowOn + .2, EX0 + xFlowOff, .5, 1.4);
sfx('ding', EX0 + bX.third + 2.6, .7); sfx('tick', EX0 + bX.full + 1.2, .6); sfx('success', EX0 + bX.three, .8); sfx('sparkle', EX0 + bX.three + .2, .8);
function drawExpl(t) {
  const u = t - EX0, ph2 = E.inOut(P(u, bX.hour1 - .3, .8));
  show('x-hdr', u, bX.intro, bX.hour1 - .3, { from: .5, dy: 30 });
  const pn = life(u, bX.intro + .2, bX.hour1 - .4, { from: .8, dy: 40 }); tf($('x-panel'), pn);
  show('x-net', u, bX.net, bX.lcd, { from: .5, dy: 20 });
  const r1 = life(u, bX.a, bX.hour1 - .4, { from: .8, dy: 20 }); tf($('x-r1'), r1);
  const pulse = (a) => 1 + .14 * Math.sin(clamp((u - a) / .6) * Math.PI);
  [['x-a', bX.a, bX.n1], ['x-p1', bX.b, bX.n2], ['x-b', bX.b, bX.n2], ['x-m1', bX.d, bX.n3], ['x-d', bX.d, bX.n3]].forEach(([id, a, pz]) => { const l = life(u, a, 1e9, { from: .2, dy: 0, el: true, d: .7 }); tf($(id), { ...l, s: l.s * pulse(pz) }); });
  // ×3, ×2 annotations above the first two fractions
  const ra = $('x-a').getBoundingClientRect(), rb = $('x-b').getBoundingClientRect();
  at('x-x3', ra.left + ra.width / 2, 709, { s: E.back(P(u, bX.lcd + .5, .4)), o: clamp((u - bX.lcd - .5) * 4) * (1 - P(u, bX.hour1 - .5, .3)) });
  at('x-x2', rb.left + rb.width / 2, 709, { s: E.back(P(u, bX.lcd + .8, .4)), o: clamp((u - bX.lcd - .8) * 4) * (1 - P(u, bX.hour1 - .5, .3)) });
  show('x-lcd', u, bX.lcd, bX.hour1 - .4, { from: .5, dy: 20 });
  show('x-r2', u, bX.c1, bX.eq - .1, { from: .9, dy: 0 });
  [['x-c1', bX.c1], ['x-p2', bX.c2], ['x-c2', bX.c2 + .1], ['x-m2', bX.c3], ['x-c3', bX.c3 + .1]].forEach(([id, a]) => tf($(id), life(u, a, 1e9, { from: .2, dy: -40, el: true, d: .7 })));
  const r3 = life(u, bX.eq, bX.hour1 - .4, { from: .9, dy: 0 }); tf($('x-r3'), r3);
  [['x-e0', bX.eq], ['x-sum', bX.eq + .1], ['x-e1', bX.r412], ['x-412', bX.r412 + .1], ['x-e2', bX.r13], ['x-13', bX.r13 + .05]].forEach(([id, a]) => tf($(id), life(u, a, 1e9, { from: .2, dy: 0, el: true, d: .7 })));
  // tank: small under the panel while the equation builds (valves closed, level 0), then centre stage for the time-lapse
  const cy = lerp(1185, 900, ph2), sc = lerp(.5, .78, ph2);
  const hrs = xHours(u), lv = W.allThree(hrs);
  placeTank(tkE, 540, cy, sc, clamp((u - bX.a + .3) * 3));
  const f = xFlow(u);
  tkE.draw(t, { level: lv, A: f, B: f, D: f, hlA: ramp(u, bX.a, bX.b) + ramp(u, bX.n1, bX.n1 + .8), hlB: ramp(u, bX.b, bX.d) + ramp(u, bX.n2, bX.n2 + .8), hlD: ramp(u, bX.d, bX.net) + ramp(u, bX.n3, bX.n3 + .8),
    tickOn: fv => clamp((lv - fv + .02) * 30) });
  const [ax, ay] = tp(540, cy, sc, 110, 230), [bx, by] = tp(540, cy, sc, 530, 230), [dx, dy] = tp(540, cy, sc, 560, 590);
  const tl = (a) => life(u, a, bX.hour1 - .4, { from: .3, dy: 20, el: true, d: .7 });
  at('x-tA', ax, ay, tl(bX.a + .1)); at('x-tB', bx, by, tl(bX.b + .1)); at('x-tD', dx, dy, tl(bX.d + .1));
  show('x-rate', u, bX.hour1 - .1, 1e9, { from: .5, dy: 30 });
  const [px, py] = tp(540, cy, sc, 560, 250); at('x-pct', px, py, { o: clamp((u - bX.hour1) * 3) }); $('x-pct').firstChild.textContent = pctTxt(lv);
  tf($('x-clock'), life(u, bX.hour1, 1e9, { from: .6, dy: 30 })); setClock('x-clk', hrs);
  show('x-h1', u, bX.third, bX.three - .2, { from: .4, dy: 20, el: true, d: .8 });
  show('x-ans', u, bX.three, 1e9, { from: .3, dy: 0, el: true, d: .9 });
}

// =====================================================================================
// SCENE 5 — QUIZ, 5 s COUNTDOWN, ANSWER (05_quiz.mp3 + silence + 06_answer.mp3)
// =====================================================================================
const s5 = $('s5'), bQ = BT.quiz, bA = BT.ans;
add(s5, `
  ${row('q-hdr', 368, `<div class="chip blue pinkline ess" style="font-size:33px">เตรียมสอบนายสิบ • วิชาคณิตศาสตร์</div>`)}
  <div id="q-card" class="icecard" style="top:448px;height:372px;padding:22px 30px">
    <span class="qline" id="q-l1">ก๊อก A เติมถังเต็มใน <b>4 ชม.</b></span>
    <span class="qline" id="q-l2">ก๊อก B เติมถังเต็มใน <b>6 ชม.</b></span>
    <span class="qline" id="q-l3">ท่อระบาย ระบายน้ำเต็มถังหมดใน <b>12 ชม.</b></span>
    <span class="qline" id="q-l4">เปิดทั้งสามพร้อมกัน ตั้งแต่ถังเปล่า</span>
    <span class="qline" id="q-l5" style="font-weight:800;color:#2F6BFF;font-size:40px">น้ำจะเต็มถังในกี่ชั่วโมง?</span>
  </div>
  <div id="q-opts"></div>
  ${row('q-think', 1270, `<div class="chip ice ess" style="font-size:38px">คิดให้ดีนะครับ!</div>`)}
  <div id="q-hint" class="row" style="top:1236px;gap:18px"><div id="q-mini" style="position:relative;width:130px;height:130px;flex:none"></div>
    <div class="chip yl ess" style="font-size:33px">${WARN(40)}อย่าลืม! มีท่อระบายด้วย</div></div>
  ${row('q-five', 1376, `<div class="chip dark ess" style="font-size:32px;padding:6px 20px">${STOPWATCH(36)}ให้เวลาคิด 5 วินาที</div>`)}
  <div id="q-cd" class="abs c ess" style="left:445px;top:1220px"></div>
  <div id="q-mas" class="mas" style="left:-60px;top:1330px"><img src="../../shared/brand/mascot_presenter.png" style="height:520px"></div>
  ${row('a-sol', 368, `<div class="ttl ess" style="font-size:70px"><span class="y">เฉลย!</span></div>`)}
  <div id="a-conf"></div>
  ${row('a-badge', 372, `<div class="chip green ess" style="font-size:40px">${ICON.check('#fff', 40)}ข้อ ค. 3 ชั่วโมง</div>`)}
  <div id="a-panel" class="panel" style="top:448px;height:330px"></div>
  ${row('a-r1', 470, `<div class="eq ess" style="font-size:66px">
     <span class="t" id="a-a">${fr(1, 4, 'cA')}</span><span class="t op" id="a-p">+</span><span class="t" id="a-b">${fr(1, 6, 'cB')}</span><span class="t op" id="a-e1">=</span><span class="t" id="a-512">${fr(5, 12, 'cB')}</span></div>`)}
  ${row('a-r2', 612, `<div class="eq ess" style="font-size:66px">
     <span class="t" id="a-512b">${fr(5, 12, 'cB')}</span><span class="t op" id="a-m">−</span><span class="t" id="a-d">${fr(1, 12, 'cD')}</span><span class="t op" id="a-e2">=</span><span class="t" id="a-412">${fr(4, 12)}</span><span class="t op" id="a-e3">=</span><span class="t" id="a-13" style="background:#FFD23F;color:#142B53;border-radius:16px;padding:2px 12px">${fr(1, 3)}</span></div>`)}
  ${row('a-rate', 470, `<div class="chip ice ess" style="font-size:40px">อัตราสุทธิ <span class="op" style="color:#2F6BFF">=</span><span style="color:#2F6BFF;font-size:46px">${fr(1, 3)}</span> ถัง/ชม.</div>`)}
  <div id="a-tw"></div>
  ${lbl('a-pct', `<div class="pct ess">0%</div>`)}
  ${row('a-clock', 1258, clockHTML('a-clk'))}
  <div id="a-tl" class="row" style="top:1336px;gap:10px">
    <div id="a-t1" class="chip dark ess" style="font-size:30px;padding:4px 14px;gap:6px">1 ชม. = ${fr(1, 3)}</div>
    <div id="a-t2" class="chip dark ess" style="font-size:30px;padding:4px 14px;gap:6px">2 ชม. = ${fr(2, 3)}</div>
    <div id="a-t3" class="chip yl ess" style="font-size:30px;padding:4px 14px;gap:6px">3 ชม. = เต็ม</div></div>
  <div id="a-trapP" class="panel" style="top:455px;height:615px"></div>
  ${row('a-trapH', 372, `<div class="chip ice ess" style="font-size:38px">ข้อ ข. <b style="margin:0 8px;color:#2F6BFF">2 ชม. 24 นาที</b> มาจากไหน?</div>`)}
  ${row('a-trapC', 640, `<div class="opt ess" style="position:relative;left:0;top:0;width:560px;height:110px;font-size:48px;filter:grayscale(.2)"><div class="b">ข</div><div class="tx">2 ชั่วโมง 24 นาที</div><div style="position:absolute;right:24px">${QMARK(46)}</div></div>`)}
  ${row('a-tr0', 470, `<div class="chip dark ess" style="font-size:31px;padding:8px 20px">คิดแค่ <span class="cA">ก๊อก A</span> + <span class="cB">ก๊อก B</span> (ไม่มีท่อระบาย)</div>`)}
  ${row('a-tr1', 575, `<div class="eq ess" style="font-size:62px">${fr(1, 4, 'cA')}${op('+')}${fr(1, 6, 'cB')}${op('=')}${fr(5, 12, 'cB')}</div>`)}
  ${row('a-tr2', 730, `<div class="eq ess" style="font-size:58px">1${op('÷')}${fr(5, 12, 'cB')}${op('=')}${fr(12, 5)}<span style="font-size:40px;margin-left:10px">ชม.</span></div>`)}
  ${row('a-tr3', 885, `<div class="eq ess" style="font-size:52px"><span class="op">=</span>2 ชั่วโมง 24 นาที</div>`)}
  ${row('a-tr4', 990, `<div class="chip red ess" style="font-size:40px">${ICON.cross('#EF4444', 44)}ลืมหักท่อระบาย</div>`)}
  <div id="a-tw2"></div>
  ${lbl('a-xD', `<div>${ICON.cross('#EF4444', 110)}</div>`)}
  ${row('a-dont', 1366, `<div class="chip yl ess" style="font-size:36px;padding:8px 24px">ข้อนี้อย่าพลาดนะ!</div>`)}
  <div id="a-mem" class="icecard" style="top:448px;height:532px"></div>
  ${row('a-memH', 470, `<div class="chip blue ess" style="font-size:40px">จำไว้! โจทย์อัตราการทำงาน</div>`)}
  ${row('a-plus', 572, `<div class="eq ess" style="font-size:54px;color:#142B53;gap:16px">${SIGN('#fff', '#2F6BFF', 70)}${PLUS_SVG(40, '#fff')}</div>เติมน้ำ = บวก</div>`)}
  <div id="a-chips" class="row" style="top:680px;gap:10px;flex-wrap:wrap">
    <div id="a-c1" class="chip dark ess" style="font-size:34px;padding:8px 18px">คนถ่วงงาน</div><div id="a-c2" class="chip dark ess" style="font-size:34px;padding:8px 18px">น้ำรั่ว</div>
    <div id="a-c3" class="chip dark ess" style="font-size:34px;padding:8px 18px">ท่อระบาย</div><div id="a-c4" class="chip dark ess" style="font-size:34px;padding:8px 18px">ลบงาน</div></div>
  ${row('a-minus', 860, `<div class="eq ess" style="font-size:54px;color:#142B53;gap:16px">${SIGN('#0B1B3A', '#FFD23F', 70)}${MINUS_SVG(40)}</div>ต้อง<span style="color:#D97706;margin-left:6px">ลบออกเสมอ!</span></div>`)}
  ${row('a-fin1', 1070, `<div class="chip ice ess" style="font-size:40px">อัตราสุทธิ = <span style="color:#2F6BFF;margin:0 8px;font-size:46px">${fr(1, 3)}</span> ถังต่อชั่วโมง</div>`)}
  ${row('a-fin2', 1190, `<div class="ttl ess" style="font-size:76px">ใช้เวลา <span class="y">3 ชั่วโมง</span></div>`)}
`);
const qOpts = NSP.buildQuizOptions($('q-opts'), W.CHOICES, { top: 838, gap: 98 });
qOpts.forEach(o => o.el.classList.add('ess'));
[1, 2, 3, 4, 5].forEach(i => $('q-l' + i).classList.add('ess'));
const qCd = NSP.buildCountdown($('q-cd'), 190);
{ // blue countdown skin
  const st = $('q-cd').querySelectorAll('stop'); st[0].setAttribute('stop-color', '#22D3EE'); st[1].setAttribute('stop-color', '#2F6BFF');
  const cs = $('q-cd').querySelectorAll('circle'); cs[0].setAttribute('fill', '#0B1B3A'); cs[0].setAttribute('stroke', '#95BFEF'); cs[0].setAttribute('stroke-width', '4');
  cs[1].setAttribute('stroke', '#1D3F7C'); cs[3].setAttribute('stroke', '#22D3EE'); qCd.num.style.color = '#fff';
}
const tkQ = WT.tank($('q-mini'), { left: 0, top: 0, ticks: [] });
const tkA = WT.tank($('a-tw'), { ticks: [1, 2].map(k => ({ f: k / 3, label: `${k} ชม.`, fs: 36, c: '#FFD23F', major: 1 })) });
const tkT = WT.tank($('a-tw2'), { ticks: [] });
const qConf = NSP.buildConfetti($('a-conf'), 60, 540, 1000);
const ANS_AT = AN0 + bA.c;                                        // the green reveal lands on "ข้อ ค."
const aEv = [[bA.a + .2, { A: 1 }, .02], [bA.b + .2, { A: 1, B: 1 }, .02], [bA.d + .2, { A: 1, B: 1, D: 1 }, .02], [bA.net, { }, 0]];   // slow run, paused before the reset
const aLapse = [[bA.h1 + .3, 0], [bA.h1fr + 1.8, 1], [bA.so, 1], [bA.t3 + .8, 3]];
const aHours = u => { if (u <= aLapse[0][0]) return 0; for (let i = 0; i < aLapse.length - 1; i++) { const [a, ha] = aLapse[i], [b, hb] = aLapse[i + 1]; if (u <= b) return lerp(ha, hb, (u - a) / (b - a)); } return 3; };
const aRun = sim(bA.net, aEv);
const aFlowLapse = ua => ramp(ua, bA.h1 + .2, bA.t3 + .8 - CLOSE, .35, CLOSE);   // full exactly at t3 + 0.8 (aLapse end)
sfx('whoosh', QS - .1, .4); sfx('pop', QS + bQ.intro + .1, .7);
[bQ.l1, bQ.l2, bQ.l3, bQ.l4, bQ.l5].forEach(x => sfx('type', QS + x + .05, .7));
bQ.opts.forEach(x => { sfx('whoosh', QS + x - .1, .3); sfx('pop', QS + x + .05, .7); });
sfx('pop', QS + bQ.think, .6); sfx('buzz', QS + bQ.drain + .1, .5); sfx('drain', QS + bQ.drain + .3, .5); sfx('pop', QS + bQ.five + .05, .6);
for (let i = 0; i < 5; i++) sfx(i < 4 ? 'tick' : 'tick2', CD0 + i, 1);
sfx('drop', ANS_AT - .05, .7); sfx('success', ANS_AT, 1); sfx('sparkle', ANS_AT + .2, .9); sfx('ding', AN0 + bA.h3, .7); sfx('pop', AN0 + bA.sol, .8);
sfx('whoosh', AN0 + bA.again - .1, .5);
sfx('tap', AN0 + bA.a + .1, .8); sfx('pop', AN0 + bA.aFr, .7); sfx('tap', AN0 + bA.b + .1, .8); sfx('pop', AN0 + bA.bFr + 1.2, .7); sfx('ding', AN0 + bA.sum + .5, .7);
sfx('tap', AN0 + bA.d + .1, .8); sfx('pop', AN0 + bA.dFr + 1.4, .7); sfx('pop', AN0 + bA.netEq, .6); sfx('pop', AN0 + bA.r412, .7); sfx('ding', AN0 + bA.r13, .9);
loop('water', AN0 + bA.a + .2, AN0 + bA.net, .4); loop('drain', AN0 + bA.d + .2, AN0 + bA.net, .45, 1.4);
sfx('swoosh', AN0 + bA.h1 - .1, .4); loop('water', AN0 + bA.h1 + .3, AN0 + bA.t3 + .8, .45); loop('drain', AN0 + bA.h1 + .4, AN0 + bA.t3 + .8, .45, 1.4);
sfx('ding', AN0 + bA.h1fr + 1.8, .6); sfx('success', AN0 + bA.t3 + .8, .8);
sfx('whoosh', AN0 + bA.trap - .1, .5); sfx('pop', AN0 + bA.why, .6); sfx('pop', AN0 + bA.why + 1.4, .6); sfx('pop', AN0 + bA.why + 2.6, .6); sfx('err', AN0 + bA.forgot + .1, 1);
sfx('pop', AN0 + bA.dont, .6); sfx('whoosh', AN0 + bA.remember - .1, .5); sfx('success', AN0 + bA.remember + .2, .5);
[bA.drag, bA.leak, bA.drain, bA.sub].forEach(x => sfx('pop', AN0 + x + .05, .6)); sfx('stamp', AN0 + bA.always + .1, .8);
function masDraw(el, u, a, b, amp = 6) { const l = life(u, a, b, { from: .3, dy: 120, d: .7 }); tf(el, { ...l, y: l.y + bob(u, 0, amp, 2.4), r: Math.sin(u * 1.6) * 1.5 }); }
function drawQuiz(t) {
  const u = t - QS, ua = t - AN0, rv = t - ANS_AT, uc = t - CD0;
  const P1 = AN0 + bA.again - .2;                 // quiz layout leaves here
  const leave = P(t, P1, .4);
  // header + question card
  const hd = life(u, bQ.intro, 1e9, { from: .5, dy: 30 }); tf($('q-hdr'), { ...hd, o: hd.o * (1 - leave) * (1 - P(ua, bA.sol - .05, .2)) });
  const qc = life(u, bQ.intro + .1, 1e9, { from: .85, dy: 50 }); tf($('q-card'), { ...qc, o: qc.o * (1 - leave), y: qc.y - 60 * leave });
  [[1, bQ.l1], [2, bQ.l2], [3, bQ.l3], [4, bQ.l4], [5, bQ.l5]].forEach(([i, a]) => { const l = life(u, a, 1e9, { from: .9, dy: 0, d: .4 }); tf($('q-l' + i), { o: l.o, x: (1 - E.out(P(u, a, .4))) * -40 }); });
  // answer cards: neutral until the reveal, which only happens after the countdown (rv < 0 before)
  NSP.drawQuizOptions(qOpts, u, rv, bQ.opts, W.ANSWER.index);
  qOpts.forEach(o => { o.el.style.transform = o.el.style.transform.replace(/translate\(([-\d.e]+)px/, (m, v) => `translate(${(+v * .15).toFixed(2)}px`); });   // gentler slide-in: cards stay inside the safe zone
  qOpts.forEach(o => { if (leave > 0) { o.el.style.opacity = (+o.el.style.opacity) * (1 - leave); } });
  // thinking prompts → countdown
  show('q-think', u, bQ.think, bQ.drain - .05, { from: .5, dy: 20 });
  const hn = life(u, bQ.drain, D('quiz') + .15, { from: .5, dy: 30 }); tf($('q-hint'), hn);
  if (hn.o > 0) { tf(tkQ.el, { x: -255, y: -335, s: .2 }); tkQ.draw(t, { level: .55, A: 1, B: 1, D: 1, hlD: 1 }); }
  show('q-five', u, bQ.five, D('quiz') + .1, { from: .5, dy: 20 });
  NSP.drawCountdown(qCd, uc, TL.cd[1]);
  masDraw($('q-mas'), u, bQ.think - .3, AN0 + bA.again - QS, 5);
  // reveal
  show('a-sol', ua, bA.sol, bA.again - .2, { from: .3, dy: 0, el: true, d: .8 });
  NSP.drawConfetti(qConf, t, ANS_AT + .05, 2.6);
  // --- phase 1: rates, with the tank running slowly ---
  const ex0 = bA.again, hd1 = bA.trap - .3;
  show('a-badge', ua, ex0, bA.trap - .3, { from: .4, dy: 30 });
  tf($('a-panel'), life(ua, ex0 + .1, bA.h1 - .2, { from: .85, dy: 40 }));
  show('a-r1', ua, bA.a, bA.h1 - .2, { from: .9, dy: 0 });
  [['a-a', bA.aFr], ['a-p', bA.b + .3], ['a-b', bA.bFr + 1.2], ['a-e1', bA.sum], ['a-512', bA.sum + .5]].forEach(([id, a]) => tf($(id), life(ua, a, 1e9, { from: .2, dy: 0, el: true, d: .7 })));
  show('a-r2', ua, bA.dFr, bA.h1 - .2, { from: .9, dy: 0 });
  [['a-512b', bA.netEq], ['a-m', bA.dFr + .2], ['a-d', bA.dFr + 1.4], ['a-e2', bA.r412], ['a-412', bA.r412 + .2], ['a-e3', bA.r13], ['a-13', bA.r13 + .1]].forEach(([id, a]) => tf($(id), life(ua, a, 1e9, { from: .2, dy: 0, el: true, d: .7 })));
  // tank: slow run during phase 1, reset (flash) and a 3-hour time-lapse in phase 2
  const ph2 = E.inOut(P(ua, bA.h1 - .4, .8));
  const lapse = ua >= bA.h1 - .1;
  const run = lapse ? { lv: W.allThree(aHours(ua)), hrs: aHours(ua) } : sim(ua, aEv);
  const cy = lerp(1040, 930, ph2), sc = lerp(.56, .74, ph2);
  const tko = clamp((ua - ex0) * 3) * (1 - P(ua, bA.trap - .4, .3));
  placeTank(tkA, 540, cy, sc, tko);
  if (tko > 0) {
    const fA = lapse ? aFlowLapse(ua) : ramp(ua, bA.a + .1, bA.net), fB = lapse ? fA : ramp(ua, bA.b + .1, bA.net), fD = lapse ? fA : ramp(ua, bA.d + .1, bA.net);
    tkA.draw(t, { level: run.lv, A: fA, B: fB, D: fD, hlA: ramp(ua, bA.a, bA.b), hlB: ramp(ua, bA.b, bA.sum + 1), hlD: ramp(ua, bA.d, bA.net), tickOn: fv => clamp((run.lv - fv + .02) * 30) });
  }
  const rf = 1 - Math.abs(ua - (bA.h1 - .1)) / .25; if (rf > 0) $('flash').style.opacity = Math.max(+$('flash').style.opacity || 0, rf * .5);
  const [px, py] = tp(540, cy, sc, 572, 340); at('a-pct', px, py, { o: tko * clamp((ua - bA.a) * 3) }); $('a-pct').firstChild.textContent = pctTxt(run.lv);
  show('a-rate', ua, bA.h1 - .1, bA.trap - .3, { from: .5, dy: 30 });
  tf($('a-clock'), life(ua, bA.a, bA.trap - .3, { from: .6, dy: 30 })); setClock('a-clk', run.hrs);
  [['a-t1', bA.h1fr + 1.8], ['a-t2', bA.so + 1.8], ['a-t3', bA.t3 + .8]].forEach(([id, a]) => tf($(id), life(ua, a, bA.trap - .3, { from: .3, dy: 30, el: true, d: .7 })));
  tf($('a-tl'), { o: 1 });
  // --- phase 3: the ข. trap (correct arithmetic for a different, drain-free scenario) ---
  show('a-trapH', ua, bA.trap, bA.remember - .3, { from: .5, dy: 30 });
  tf($('a-trapP'), life(ua, bA.trap + .1, bA.remember - .3, { from: .85, dy: 40 }));
  show('a-trapC', ua, bA.trap + .25, bA.why - .1, { from: .3, dy: 0, el: true, d: .8 });
  show('a-tr0', ua, bA.why, bA.remember - .3, { from: .5, dy: 20 });
  show('a-tr1', ua, bA.why + 1.4, bA.remember - .3, { from: .6, dy: 20 });
  show('a-tr2', ua, bA.why + 2.6, bA.remember - .3, { from: .6, dy: 20 });
  show('a-tr3', ua, bA.trapT - .1 > bA.why + 3.2 ? bA.trapT : bA.why + 3.2, bA.remember - .3, { from: .6, dy: 20 });
  show('a-tr4', ua, bA.forgot, bA.remember - .3, { from: 1.6, dy: 0, d: .35 });
  const t2o = clamp((ua - bA.why) * 3) * (1 - P(ua, bA.remember - .3, .3));
  placeTank(tkT, 540, 1212, .34, t2o);
  if (t2o > 0) tkT.draw(t, { level: .6, A: 1, B: 1, D: 0, hlD: ramp(ua, bA.forgot, bA.dont + 1) });
  const [xx, xy] = tp(540, 1212, .34, 600, 700); at('a-xD', xx, xy, { s: E.back(P(ua, bA.forgot + .1, .4)) * .5, o: t2o * clamp((ua - bA.forgot - .1) * 4) });
  show('a-dont', ua, bA.dont, bA.remember - .3, { from: .5, dy: 20 });
  // --- phase 4: memory rule + conclusion ---
  tf($('a-mem'), life(ua, bA.remember, 1e9, { from: .85, dy: 50 }));
  show('a-memH', ua, bA.remember + .1, 1e9, { from: .5, dy: 20 });
  show('a-plus', ua, bA.topic, 1e9, { from: .5, dy: 20 });
  [['a-c1', bA.drag], ['a-c2', bA.leak], ['a-c3', bA.drain], ['a-c4', bA.sub]].forEach(([id, a]) => tf($(id), life(ua, a, 1e9, { from: .3, dy: 20, el: true, d: .7 })));
  tf($('a-chips'), { o: 1 });
  show('a-minus', ua, bA.always, 1e9, { from: .4, dy: 20, el: true, d: .8 });
  show('a-fin1', ua, bA.remember + .6, 1e9, { from: .5, dy: 30 });
  show('a-fin2', ua, bA.remember + 1.0, 1e9, { from: .5, dy: 30 });
}

// =====================================================================================
// SCENE 6 — PROMOTION (07_promotion.mp3)
// =====================================================================================
const s6 = $('s6'), bP = BT.promo;
const AV = c => `<div class="av" style="background:${c}"></div>`;
const ICL = { like: `<svg width="64" height="64" viewBox="0 0 24 24"><path d="M7 10v11H3V10zM7 10l4-8c1.7 0 3 1.3 3 3v4h5.5a2 2 0 0 1 2 2.3l-1.3 8A2 2 0 0 1 18.2 21H7" fill="#fff"/></svg>`,
  share: `<svg width="64" height="64" viewBox="0 0 24 24"><path d="M14 4l8 8-8 8v-5c-6 0-10 2-12 6 1-6 4-11 12-12z" fill="#fff"/></svg>`,
  follow: `<svg width="64" height="64" viewBox="0 0 24 24"><circle cx="10" cy="8" r="4.5" fill="#fff"/><path d="M2 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="#fff"/><path d="M19.5 7v7M16 10.5h7" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>` };
add(s6, `
  ${row('p-q', 372, `<div class="ttl ess" style="font-size:76px">ตอบ <span class="cG" style="color:#4ADE80">ค.</span> ถูกไหม?</div>`)}
  <div id="p-c1" class="bub ess" style="left:232px;top:520px;font-size:40px">${AV('linear-gradient(135deg,#2F6BFF,#22D3EE)')}ค. 3 ชั่วโมง ${ICON.check('#22C55E', 40)}</div>
  <div id="p-c2" class="bub ess" style="left:236px;top:650px;font-size:38px">${AV('linear-gradient(135deg,#22D3EE,#95BFEF)')}สุทธิ 1/3 ถัง/ชม.!</div>
  <div id="p-c3" class="bub ess" style="left:380px;top:780px;font-size:40px">${AV('linear-gradient(135deg,#EE7FAA,#95BFEF)')}ตอบ ค. ครับ</div>
  ${row('p-trap', 560, `<div class="icecard ess" style="position:relative;left:0;width:620px;padding:30px 26px;display:flex;flex-direction:column;gap:20px;align-items:center">
      <div style="font-size:36px;font-weight:700;color:#5A6B85">ใครเผลอตอบข้อนี้บ้าง?</div>
      <div style="display:flex;align-items:center;gap:14px;font-size:50px;font-weight:800">${ICON.cross('#EF4444', 52)}ข. 2 ชม. 24 นาที</div>
      <div style="font-size:36px;font-weight:700;color:#EF4444">ลืมหักท่อระบาย!</div>
      <div class="chip green" style="font-size:46px">${ICON.check('#fff', 40)}ค. 3 ชั่วโมง</div></div>`)}
  ${row('p-cm', 940, `<div class="chip blue pinkline ess" style="font-size:42px"><svg width="46" height="46" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H9l-5 4v-4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fff"/><path d="M7 9h10M7 13h6" stroke="#2F6BFF" stroke-width="2" stroke-linecap="round"/></svg>คอมเมนต์มาบอกกันหน่อย!</div>`)}
  <div id="p-math"></div>
  ${row('p-more', 1290, `<div class="chip blue pinkline ess" style="font-size:40px">ฝึกโจทย์คณิตแบบนี้อีกเยอะ!</div>`)}
  <div id="p-glow" class="abs c" style="left:190px;top:330px;width:700px;height:700px;border-radius:50%;background:radial-gradient(circle,rgba(47,107,255,.85) 0%,rgba(34,211,238,.3) 40%,rgba(34,211,238,0) 70%)"></div>
  <img id="p-logo" class="abs c ess" src="../../shared/brand/logo.png" style="left:330px;top:390px;width:420px">
  ${row('p-word', 860, `<div class="ttl ess" style="font-size:64px">NaiSib<span class="c">Pro</span> <span style="font-size:50px">นายสิบโปร</span></div>`)}
  ${row('p-bank', 990, `<div class="chip ice ess" style="font-size:42px">รวมข้อสอบ <span id="p-num" style="color:#2F6BFF;margin:0 8px">10,000+</span> ข้อ</div>`)}
  ${row('p-week', 1090, `<div class="chip cyan ess" style="font-size:40px">${ICON.cal(42, '#0B1B3A')}อัปเดตทุกสัปดาห์</div>`)}
  <div id="p-cta" class="row" style="top:1166px;gap:22px">
    <div id="p-like" class="ess" style="display:flex;flex-direction:column;align-items:center;gap:8px;font-weight:800;font-size:32px;color:#fff"><div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#2F6BFF,#5B8CFF);display:grid;place-items:center;box-shadow:0 12px 26px rgba(47,107,255,.5)">${ICL.like}</div>กดไลก์</div>
    <div id="p-share" class="ess" style="display:flex;flex-direction:column;align-items:center;gap:8px;font-weight:800;font-size:32px;color:#fff"><div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#0EA5C6,#22D3EE);display:grid;place-items:center;box-shadow:0 12px 26px rgba(34,211,238,.45)">${ICL.share}</div>กดแชร์</div>
    <div id="p-follow" class="ess" style="display:flex;flex-direction:column;align-items:center;gap:8px;font-weight:800;font-size:32px;color:#fff"><div style="width:120px;height:120px;border-radius:50%;background:linear-gradient(135deg,#142B53,#2F6BFF);display:grid;place-items:center;box-shadow:0 0 0 4px #EE7FAA,0 12px 26px rgba(47,107,255,.5)">${ICL.follow}</div>กดติดตาม</div></div>
  ${row('p-bye', 1346, `<div class="chip ice ess" style="font-size:36px;padding:8px 26px">แล้วเจอกันข้อถัดไปครับ!</div>`)}
  <div id="p-conf"></div>
`);
const PMATH = [[fr(1, 4, 'cA'), 290, 620], [fr(1, 6, 'cB'), 450, 760], [op('÷'), 640, 600], [fr(1, 12, 'cD'), 790, 760], [op('×'), 320, 900], [fr(1, 3, 'cY'), 660, 930], [op('−'), 520, 1060], [fr(5, 12, 'cB'), 330, 1130], [fr(4, 12, 'cA'), 760, 1110]];
PMATH.forEach(([m, x, y], i) => add($('p-math'), `<div id="p-m${i}" class="abs c" style="left:${x - 60}px;top:${y - 80}px;width:120px;height:160px;display:grid;place-items:center;font-weight:800;font-size:80px;color:#fff">${m}</div>`));
const pConf = NSP.buildConfetti($('p-conf'), 60, 540, 700);
mark('endcard', PR0 + bP.bye);
sfx('whoosh', PR0 - .1, .5); sfx('pop', PR0 + bP.who + .1, .7); [0, .35, .7].forEach(d => sfx('msg', PR0 + bP.comment + d, .8));
sfx('swoosh', PR0 + bP.trap - .1, .4); sfx('err', PR0 + bP.trap + .4, .6); sfx('ding', PR0 + bP.trap + 1.3, .6);
PMATH.forEach((_, i) => sfx('bubble', PR0 + bP.more + .1 + i * .15, .6)); sfx('pop', PR0 + bP.more + .3, .6);
sfx('riser', PR0 + bP.brand - .6, .6); sfx('sparkle', PR0 + bP.brand + .1, 1); sfx('ding', PR0 + bP.brand + .2, .8);
for (let i = 0; i < 6; i++) sfx('coin', PR0 + bP.bank + .1 + i * .15, .45); sfx('pop', PR0 + bP.weekly, .7);
[bP.like, bP.share, bP.follow].forEach(x => { sfx('pop', PR0 + x + .05, .8); sfx('click', PR0 + x + .3, .7); });
sfx('success', PR0 + bP.bye, .6);
function drawPromo(t) {
  const u = t - PR0, clr = bP.brand - .15;
  show('p-q', u, bP.who, clr, { from: .4, dy: 30, el: true, d: .8 });
  [['p-c1', bP.comment], ['p-c2', bP.comment + .35], ['p-c3', bP.comment + .7]].forEach(([id, a], i) => { const l = life(u, a, bP.trap - .1, { from: .3, dy: 40, el: true, d: .7 }); tf($(id), { ...l, y: l.y + bob(u, i, 5, 3) }); });
  show('p-trap', u, bP.trap, bP.more - .1, { from: .5, dy: 30 });
  show('p-cm', u, bP.comment + .2, bP.trap - .1, { from: .4, dy: 30, el: true, d: .8 });
  PMATH.forEach((_, i) => { const l = life(u, bP.more + .1 + i * .15, clr, { from: .2, dy: 60, el: true, d: .8 }); tf($('p-m' + i), { ...l, y: l.y + bob(u, i, 12, 2.2), r: Math.sin(u * 1.5 + i) * 10 }); });
  show('p-more', u, bP.more + .3, clr, { from: .5, dy: 30 });
  const g = life(u, bP.brand, 1e9, { from: .2, dy: 0, d: .8 }); tf($('p-glow'), { ...g, s: g.s * (1 + .06 * Math.sin(u * 2)) });
  const lg = life(u, bP.brand, 1e9, { from: .2, dy: 120, el: true, d: 1 }); tf($('p-logo'), { ...lg, y: lg.y + bob(u, 0, 8, 1.8), r: Math.sin(u * 1.4) * 2 });
  show('p-word', u, bP.brand + .4, 1e9, { from: .5, dy: 40 });
  show('p-bank', u, bP.bank, 1e9, { from: .5, dy: 30 });
  $('p-num').textContent = (Math.round(10000 * E.out(P(u, bP.bank + .1, 1.1)) / 100) * 100).toLocaleString('en-US') + '+';
  show('p-week', u, bP.weekly, 1e9, { from: .5, dy: 30 });
  const press = (a) => 1 - .12 * Math.max(0, 1 - Math.abs(u - a - .3) / .15);
  [['p-like', bP.like], ['p-share', bP.share], ['p-follow', bP.follow]].forEach(([id, a]) => { const l = life(u, a, 1e9, { from: .2, dy: 40, el: true, d: .7 }); tf($(id), { ...l, s: l.s * press(a) }); });
  show('p-bye', u, bP.bye, 1e9, { from: .5, dy: 20 });
  NSP.drawConfetti(pConf, t, PR0 + bP.bye + .1, 2.4);
}

// =====================================================================================
const WIPES = [ST0, KN0, EX0, QS, PR0];
const scenes = [
  { el: s1, a: 0, b: ST0, draw: drawHook },
  { el: s2, a: ST0, b: KN0, draw: drawStory },
  { el: s3, a: KN0, b: EX0, draw: drawKnow },
  { el: s4, a: EX0, b: QS, draw: drawExpl },
  { el: s5, a: QS, b: PR0, draw: drawQuiz },
  { el: s6, a: PR0, b: 1e9, draw: drawPromo },
];
// flash overlay is reset each frame, then raised by whichever scene asks for it
const scenesWrapped = scenes.map(s => ({ ...s, draw: t => s.draw(t) }));
scenesWrapped[0].draw = t => { drawHook(t); };
NSP.start({ ep: 'EP.37 • คณิตศาสตร์', brand: { showAt: 1.0, hideAt: PR0 + bP.brand - .3 }, wipes: WIPES, scenes: scenesWrapped });
const _render = window.renderAt;
window.renderAt = t => {
  $('flash').style.opacity = 0; _render(t);
  scenesWrapped.forEach(sc => { if (t >= sc.a && t < sc.b) { const len = Math.min(sc.b, END) - sc.a; sc.el.style.transform = `scale(${1 + .01 * clamp((t - sc.a) / len)})`; } });
};
window.ready = window.ready.then(() => { window.renderAt(0); return true; });

[tkH, tkS, tkK0, tkKA, tkKB, tkKD, tkE, tkA].forEach(tk => tk.el.classList.add('ess'));   // tanks are essential content for the safe-zone sweep
// ---------- QC probes (read by EP37/qc/validate.js) ----------
window.EP37 = {
  times: { H0, ST0, KN0, EX0, QS, CD0, AN0, PR0, END, ANS_AT },
  // tank state at t, per scene, as rendered (same functions the draw code uses)
  tank(t) {
    if (t < ST0) { const u = t - H0; return { scene: 'hook', ...sim(u, hkEv) }; }
    if (t < KN0) { const s = storyState(t - ST0); return { scene: 'story', lv: s.lv, hrs: s.hrs, A: s.A, B: s.B, D: s.D }; }
    if (t < EX0) return { scene: 'know' };
    if (t < QS) { const u = t - EX0, hrs = xHours(u); return { scene: 'expl', lv: W.allThree(hrs), hrs, flow: xFlow(u) }; }
    if (t >= AN0 && t < PR0) { const ua = t - AN0, lapse = ua >= bA.h1 - .1; const r = lapse ? { lv: W.allThree(aHours(ua)), hrs: aHours(ua) } : sim(ua, aEv); return { scene: 'ans', lapse, ...r, flow: lapse ? aFlowLapse(ua) : 0 }; }
    return { scene: 'other' };
  },
  know(t) { const u = t - KN0; return { A: W.level(clamp((u - kA0) / (kA1 - kA0)), { A: 1 }), B: W.level(clamp((u - kB0) / (kB1 - kB0)), { B: 1 }), D: W.drainOnly(clamp((u - kD0) / (kD1 - kD0))) }; },
  keys: { sA0, sA1, sB0, sB1, sD0, sD1, kA0, kA1, kB0, kB1, kD0, kD1, xLapse, aLapse, xFlowOn, xFlowOff },
};
})();
