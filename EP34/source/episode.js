// NaiSibPro EP.34 — "5 ยุคของคอมพิวเตอร์" special explainer hosted by Box.
// Engine: shared NaiSibPro renderAt(t) (shared/engine). Presenter: Box from the MR BOXER character rig
// (shared/characters/box = unmodified copies of core.js + puppet.js), drawn on <canvas id="c"> every frame.
// Beat times are phrase starts measured from the supplied narration (see EP34/README.md).
(function () {
  const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark } = NSP;
  const TL = window.TL, ENV = window.ENV || [], A = window.ART;
  const S = k => TL[k][0];
  const SEG = ['hook', 'gen1', 'gen2', 'gen3', 'gen4', 'gen5', 'sum'];
  const END = TL.end;

  // ---------- era identities ----------
  const ERA = [
    { ec: 'rgba(245,169,199,.6)', ecd: '#EE7FAA', ec2: 'linear-gradient(90deg,#EE7FAA,#F7A8C8)' },
    { th: 'หลอดสุญญากาศ', en: 'Vacuum Tube', yr: 'ราวทศวรรษ 1940 – 1950', ec: 'rgba(231,154,60,.55)', ecd: '#C9711F', ec2: 'linear-gradient(90deg,#E58A2E,#F5B25C)', dot: '#E58A2E',
      bg: 'linear-gradient(170deg,#FFF5E6 0%,#FBE4C4 55%,#F4D2A2 100%)' },
    { th: 'ทรานซิสเตอร์', en: 'Transistor', yr: 'ราวทศวรรษ 1950 – 1960', ec: 'rgba(47,168,138,.5)', ecd: '#1E8C70', ec2: 'linear-gradient(90deg,#26A285,#5FD3B0)', dot: '#26A285',
      bg: 'linear-gradient(170deg,#F0FCF7 0%,#D5F3E7 55%,#B8E7D5 100%)' },
    { th: 'วงจรรวม (IC)', en: 'Integrated Circuit', yr: 'ราวทศวรรษ 1960 – 1970', ec: 'rgba(94,143,214,.55)', ecd: '#3F6FB8', ec2: 'linear-gradient(90deg,#4F82D0,#86B2EC)', dot: '#4F82D0',
      bg: 'linear-gradient(170deg,#F1F7FF 0%,#DAE9FC 55%,#C1D8F7 100%)' },
    { th: 'ไมโครโปรเซสเซอร์', en: 'Microprocessor', yr: 'ทศวรรษ 1970 – ปัจจุบัน', ec: 'rgba(156,143,230,.6)', ecd: '#7465CF', ec2: 'linear-gradient(90deg,#8C7EE0,#EE7FAA)', dot: '#8C7EE0',
      bg: 'linear-gradient(170deg,#F9F2FF 0%,#EEDFFB 50%,#F8D5E8 100%)' },
    { th: 'ปัญญาประดิษฐ์ (AI)', en: 'Artificial Intelligence', yr: 'ปัจจุบัน – อนาคต', ec: 'rgba(91,224,255,.65)', ecd: '#4B3AA8', ec2: 'linear-gradient(90deg,#3FB7F0,#FF7FC8)', dot: '#3FB7F0',
      bg: 'linear-gradient(170deg,#1B2148 0%,#251E52 55%,#341F5E 100%)' },
  ];
  const SC = ['sHook', 'sG1', 'sG2', 'sG3', 'sG4', 'sG5', 'sSum'].map($);
  SC.forEach((el, i) => { const e = ERA[Math.min(i, 5)] && i < 6 ? ERA[i] : ERA[0]; el.style.setProperty('--ec', e.ec); el.style.setProperty('--ecd', e.ecd); el.style.setProperty('--ec2', e.ec2); });

  // ---------- helpers ----------
  const mk = (sc, html) => { const e = h(html); sc.appendChild(e); return e; };
  const at = (sc, x, y, inner, extra = '') => mk(sc, `<div class="abs c" style="left:${x}px;top:${y}px;${extra}">${inner}</div>`);
  const lbl = (sc, top, inner, extra = '') => mk(sc, `<div class="lbl c" style="top:${top}px;${extra}"><div class="in">${inner}</div></div>`);
  const chipX = (sc, x, y, icon, txt, extra = '') => mk(sc, `<div class="abs c" style="left:${x}px;top:${y}px;transform-origin:0 50%;${extra}"><div class="cx"><div class="i">${icon}</div>${txt}</div></div>`);
  function show(el, u, a, b = 1e9, o = {}, ex = {}) {
    const l = life(u, a, b, Object.assign({ from: .5, dy: 50, d: .55, out: .3 }, o));
    tf(el, { x: ex.x || 0, y: l.y + (ex.y || 0), s: l.s * (ex.s ?? 1), r: ex.r || 0, o: l.o * (ex.o ?? 1) });
    return l;
  }
  const pop = (t, g = .55) => sfx('pop', t, g);
  const whoosh = (t, g = .45) => sfx('whoosh', t, g);
  const ic = (svg, bg) => `<div style="width:62px;height:62px;border-radius:50%;display:grid;place-items:center;background:${bg}">${svg}</div>`;
  const CHECK = ICON.check('#26A269', 40);
  function eraTitle(sc, n) {
    const e = ERA[n];
    return mk(sc, `<div class="etitle c"><div class="yr">${e.yr}</div><div class="title-sticker n">ยุคที่ ${n}</div>
      <div class="title-sticker th">${e.th}</div><div class="en">${e.en}</div></div>`);
  }
  function drawTitle(el, u) { const l = show(el, u, .12, 3.25, { from: .3, dy: 80, d: .7, el: true, out: .35 }); return l; }

  // =====================================================================
  // era atmosphere layers (behind every scene, above the brand background)
  // =====================================================================
  const eraBox = $('era');
  const svgUrl = s => `url("data:image/svg+xml;utf8,${encodeURIComponent(s)}")`;
  const PAT = [
    '',
    `radial-gradient(rgba(201,113,31,.16) 3px, transparent 3.6px) 0 0/54px 54px`,
    `linear-gradient(rgba(30,140,112,.08) 2px,transparent 2px) 0 0/64px 64px, linear-gradient(90deg,rgba(30,140,112,.08) 2px,transparent 2px) 0 0/64px 64px`,
    `${svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='260' height='260'><g fill='none' stroke='#5E8FD6' stroke-opacity='.2' stroke-width='5' stroke-linejoin='round'><path d='M0 40h80v60h90V20h90M0 190h50v-40h130v80M120 0v60M210 260v-60h50'/></g><g fill='#5E8FD6' fill-opacity='.25'><circle cx='80' cy='40' r='9'/><circle cx='170' cy='100' r='9'/><circle cx='180' cy='150' r='9'/><circle cx='210' cy='200' r='9'/></g></svg>`)} 0 0/260px 260px`,
    `${svgUrl(`<svg xmlns='http://www.w3.org/2000/svg' width='90' height='90'><rect x='10' y='10' width='22' height='22' rx='6' fill='#9C8FE6' fill-opacity='.12'/><rect x='55' y='55' width='16' height='16' rx='5' fill='#EE7FAA' fill-opacity='.14'/></svg>`)} 0 0/90px 90px`,
    `linear-gradient(rgba(91,224,255,.07) 2px,transparent 2px) 0 0/70px 70px, linear-gradient(90deg,rgba(91,224,255,.07) 2px,transparent 2px) 0 0/70px 70px`,
  ];
  const layers = [null];
  for (let n = 1; n <= 5; n++) {
    const L = h(`<div class="lay" style="background:${ERA[n].bg}"><div class="abs" style="inset:0;background:${PAT[n]}"></div></div>`);
    eraBox.appendChild(L);
    let floor = null;
    if (n === 5) {
      L.insertAdjacentHTML('beforeend', `<div class="abs" style="left:0;top:1080px;width:1080px;height:240px;background:radial-gradient(ellipse at 50% 100%,rgba(255,127,200,.35),rgba(255,127,200,0) 70%)"></div>`);
      floor = h(`<div class="abs" style="left:-540px;width:2160px;top:1300px;height:900px;background-image:linear-gradient(rgba(91,224,255,.35) 3px,transparent 3px),linear-gradient(90deg,rgba(91,224,255,.35) 3px,transparent 3px);background-size:120px 120px;transform:perspective(500px) rotateX(64deg);transform-origin:50% 0"></div>`);
      L.appendChild(floor);
    }
    const pts = [];
    for (let i = 0; i < 18; i++) {
      const r = NSP.rnd();
      let html;
      if (n === 1) { const s = 14 + r * 22; html = `<div style="width:${s}px;height:${s}px;border-radius:50%;background:radial-gradient(circle,#FFC27A,rgba(255,154,60,0) 70%)"></div>`; }
      else if (n === 2) { const s = 18 + r * 20; html = `<div style="width:${s}px;height:${s}px;border-radius:50%;border:5px solid rgba(38,162,133,.35)"></div>`; }
      else if (n === 3) html = `<div style="opacity:.2">${A.chip(44 + r * 26)}</div>`;
      else if (n === 4) { const s = 14 + r * 18; html = `<div style="width:${s}px;height:${s}px;border-radius:5px;background:${i % 2 ? 'rgba(238,127,170,.4)' : 'rgba(156,143,230,.4)'}"></div>`; }
      else html = i % 3 ? `<div style="font:800 ${26 + r * 20}px monospace;color:rgba(91,224,255,.45)">${i % 2}</div>` : `<div style="width:12px;height:12px;border-radius:50%;background:#FF7FC8;box-shadow:0 0 14px #FF7FC8"></div>`;
      const el = h(`<div class="ptc">${html}</div>`); L.appendChild(el);
      pts.push({ el, x: NSP.rnd() * 1080, y: NSP.rnd() * 1920, sp: 16 + NSP.rnd() * 30, ph: NSP.rnd() * 6.28 });
    }
    layers.push({ L, pts, floor });
  }
  function eraAt(t) { let k = 0; for (let i = 1; i <= 5; i++) if (t >= S(SEG[i])) k = i; if (t >= S('sum')) k = 0; return k; }
  function drawEra(t) {
    for (let n = 1; n <= 5; n++) {
      const a = S(SEG[n]), b = S(SEG[n + 1]);
      const o = clamp((t - a + .12) / .24) * (1 - clamp((t - b + .12) / .24));
      const { L, pts, floor } = layers[n];
      L.style.opacity = o; L.style.visibility = o > 0 ? 'visible' : 'hidden';
      if (o <= 0) continue;
      pts.forEach(p => { let y = (p.y - t * p.sp) % 2000; if (y < -80) y += 2000; tf(p.el, { x: p.x + Math.sin(t * .7 + p.ph) * 24, y, o: .5 + .4 * Math.sin(t * 1.4 + p.ph) }); });
      if (floor) floor.style.backgroundPosition = `0 ${(t * 60) % 120}px`;
    }
  }

  // =====================================================================
  // HUD: era pill + 5-stop timeline (from the first era to the summary)
  // =====================================================================
  const hud = $('hud');
  hud.innerHTML = `<div id="hud-p" class="abs c" style="left:70px;width:940px;top:0;display:flex;justify-content:center"></div>
    <div class="abs" style="left:220px;top:112px;width:640px;height:8px;border-radius:4px;background:rgba(255,255,255,.75);box-shadow:0 2px 6px rgba(40,40,90,.15)"></div>
    <div id="hud-f" class="abs" style="left:220px;top:112px;width:640px;height:8px;border-radius:4px;transform-origin:0 50%"></div>`;
  const hudP = $('hud-p'), hudF = $('hud-f');
  const pills = [null];
  for (let n = 1; n <= 5; n++) { const p = h(`<div class="hudpill" style="background:${ERA[n].ec2};position:absolute"><div class="hn" style="color:${ERA[n].dot}">${n}</div>ยุคที่ ${n} · ${ERA[n].th}</div>`); hudP.appendChild(p); pills.push(p); }
  const dots = [1, 2, 3, 4, 5].map(n => { const d = h(`<div class="hdot" style="left:${220 + (n - 1) * 160}px;top:96px">${n}</div>`); hud.appendChild(d); return d; });
  function drawHud(t) {
    const k = eraAt(t), a0 = S('gen1') + 3.2, a1 = S('sum') - .2;
    const vis = clamp((t - a0) / .4) * (1 - clamp((t - a1) / .3));
    hud.style.opacity = vis; hud.style.visibility = vis > 0 ? 'visible' : 'hidden';
    if (vis <= 0) return;
    for (let n = 1; n <= 5; n++) {
      const st = S(SEG[n]), on = n === k;
      const ti = t - st;   // the big era title owns the first 3.2 s, then the pill takes over
      const l = on ? life(ti, 3.25, 1e9, { from: .4, dy: -30, d: .5 }) : { s: 1, o: 0, y: 0 };
      if (on && n > 1 && ti < 3.25) l.o = 0;
      tf(pills[n], { x: 0, y: l.y, s: l.s, o: on ? l.o : 0 });
      const d = dots[n - 1], past = n < k;
      d.style.background = on || past ? ERA[n].dot : '#fff';
      d.style.color = on || past ? '#fff' : '#9AA6B8';
      const pulse = on ? 1.25 + .06 * Math.sin(t * 5) : 1;
      d.style.transform = `scale(${on ? pulse * E.back(clamp((ti - .1) / .5)) || 1 : 1})`;
    }
    const prog = k <= 1 ? 0 : (k - 1) / 4;
    hudF.style.background = ERA[Math.max(1, k)].ec2;
    hudF.style.transform = `scaleX(${prog})`;
  }

  // =====================================================================
  // time-warp transitions between eras
  // =====================================================================
  const warp = $('warp');
  const WB = [1, 2, 3, 4, 5].map(n => ({ b: S(SEG[n]), n }));
  const streaks = [];
  for (let i = 0; i < 46; i++) {
    const el = h(`<div class="streak"></div>`); warp.appendChild(el);
    streaks.push({ el, a: NSP.rnd() * 360, d0: 60 + NSP.rnd() * 300, L: 120 + NSP.rnd() * 260, sp: .7 + NSP.rnd() * .7, w: 3 + NSP.rnd() * 6 });
  }
  const flash = h(`<div class="abs" style="inset:0;background:radial-gradient(circle at 50% 47%,#fff 0%,rgba(255,255,255,.92) 35%,rgba(255,255,255,.2) 75%);opacity:0"></div>`); warp.appendChild(flash);
  const ring = h(`<div class="abs" style="left:540px;top:900px;width:200px;height:200px;margin:-100px 0 0 -100px;border-radius:50%;border:16px solid #fff;opacity:0"></div>`); warp.appendChild(ring);
  const wnum = h(`<div class="abs title-sticker" style="left:0;width:1080px;top:770px;text-align:center;font-size:200px;opacity:0"></div>`); warp.appendChild(wnum);
  WB.forEach(({ b }) => { sfx('riser', b - 1.1, .45); sfx('swoosh', b - .35, .75); sfx('sparkle', b + .15, .55); });
  function drawWarp(t) {
    let cur = null;
    WB.forEach(w => { if (t > w.b - .7 && t < w.b + .55) cur = w; });
    if (!cur) { warp.style.visibility = 'hidden'; return; }
    warp.style.visibility = 'visible';
    const p = (t - (cur.b - .7)) / 1.25, env = Math.sin(Math.PI * clamp(p));
    const col = ERA[cur.n].dot;
    streaks.forEach((s, i) => {
      const r = s.d0 + Math.pow(p, 1.6) * 1500 * s.sp;
      s.el.style.width = s.L * (.4 + env) + 'px'; s.el.style.height = s.w + 'px';
      s.el.style.background = `linear-gradient(90deg,rgba(255,255,255,0),${i % 3 ? '#fff' : col})`;
      s.el.style.transform = `rotate(${s.a}deg) translateX(${r}px)`; s.el.style.opacity = env * .9;
    });
    const f = Math.exp(-Math.pow((t - cur.b) / .16, 2));
    flash.style.opacity = f * .95;
    const rp = clamp((t - cur.b + .25) / .7);
    ring.style.transform = `scale(${.2 + rp * 7})`; ring.style.opacity = (1 - rp) * (rp > 0 ? .8 : 0); ring.style.borderColor = col;
    wnum.textContent = cur.n; wnum.style.color = col;
    const np = clamp((t - (cur.b - .55)) / .5);
    wnum.style.opacity = Math.sin(Math.PI * np) * (1 - f * .6);
    wnum.style.transform = `scale(${.6 + np * .9})`;
  }

  // =====================================================================
  // BOX — presenter track (keys in absolute seconds)
  // =====================================================================
  const PZ = {
    idle: POSES.idle,
    point: POSES.point,
    pointSide: pose({ shL: 1.6, elL: 0.05, lookX: 1, head: -0.03 }),
    present: pose({ shL: 1.0, elL: -0.45, shR: 0.18, elR: -0.2, lookX: 0.6 }),
    explain: pose(Object.assign({ head: 0.03 }, reach(-1, -62, -PUP.torso + 112), reach(1, 66, -PUP.torso + 104))),
    think: POSES.thinking,
    wai: POSES.wai,
    hold: pose(Object.assign({ lookX: 0.5, lookY: 0.4, head: 0.05 }, reach(1, 70, -PUP.torso + 64))),
    cheer: pose({ shR: 2.55, elR: 0.25, shL: 2.55, elL: 0.25, head: -0.04 }),
    shrug: pose({ shR: 0.85, elR: 1.15, shL: 0.85, elL: 1.15, head: 0.06 }),
    glasses: POSES.glasses,
    wave: t => pose({ shL: 2.45, elL: 0.45 * Math.sin(t * 9), shR: 0.14, elR: -0.12, lookX: 0.2 }),
  };
  const getPose = (k, t) => { const p = PZ[k]; return typeof p === 'function' ? p(t) : p; };
  const BK = [];
  const bk = (t, o) => BK.push(Object.assign({ t }, o));
  const B0 = { x: -260, g: 1580, s: 1, o: 0, P: 'idle', emo: 'talk', flip: false, glasses: 0, hold: 0, finger: false, talk: 1, glow: 0 };
  let BST = null;
  function buildBox() {
    BK.sort((a, b) => a.t - b.t);
    let st = Object.assign({}, B0, { d: .01 });
    BST = BK.map(k => (st = Object.assign({}, st, { d: .45, walk: false }, k)));
  }
  const cv = $('c'), cx2 = cv.getContext('2d');
  function drawBox(t) {
    cx2.setTransform(1, 0, 0, 1, 0, 0); cx2.clearRect(0, 0, 1080, 1920);
    let i = -1;
    for (let j = 0; j < BST.length; j++) if (BST[j].t <= t) i = j;
    if (i < 0) { cv.style.opacity = 0; return; }
    const cur = BST[i], prev = BST[i - 1] || cur;
    const p = E.inOut(clamp((t - cur.t) / cur.d));
    const L = k => lerp(prev[k], cur[k], p);
    const x = L('x'), g = L('g'), s = L('s'), o = L('o'), gd = L('glasses'), hold = L('hold'), glow = L('glow');
    cv.style.opacity = o;
    if (o <= 0.001) return;
    let Pz = mixPose(getPose(prev.P, t), getPose(cur.P, t), E.inOut(clamp((t - cur.t) / Math.min(cur.d, .45))));
    if (cur.walk && p < 1) Pz = mixPose(Pz, walkPose(t * 8.5, 1), Math.sin(Math.PI * p) * .95 + (p < .5 ? .05 : 0));
    Pz = Object.assign({}, Pz, { bob: (Pz.bob || 0) + Math.sin(t * 2.2) * 2.2, head: (Pz.head || 0) + Math.sin(t * .9) * .02 });
    if (glow > 0) {
      const gr = cx2.createRadialGradient(x, g - 300 * s, 20, x, g - 300 * s, 360 * s);
      gr.addColorStop(0, `rgba(120,220,255,${.22 * glow})`); gr.addColorStop(1, 'rgba(120,220,255,0)');
      cx2.fillStyle = gr; cx2.fillRect(x - 400, g - 700 * s, 800, 800 * s);
    }
    const emo = p > .3 || cur.d < .1 ? cur.emo : prev.emo;
    const talk = (ENV[Math.floor(t * 30)] || 0) * cur.talk;
    drawPuppet('box', x, g, s, Pz, { emo, talk, blink: blinkAt(t, 3), glassesDown: gd }, t, { flip: cur.flip, fingerL: cur.finger && p > .3 });
    if (hold > .01 && PUP_HAND.boxL) heldChip(PUP_HAND.boxL.x, PUP_HAND.boxL.y, s * hold, t);
  }
  function heldChip(x, y, s, t) {
    const c = cx2; c.save(); c.translate(x, y - 34 * s); c.rotate(-.12 + Math.sin(t * 2) * .04); c.scale(s, s);
    c.shadowColor = 'rgba(94,143,214,.9)'; c.shadowBlur = 30;
    c.fillStyle = '#C8CFD9'; for (let i = 0; i < 6; i++) { c.fillRect(-40 + i * 15, -40, 8, 14); c.fillRect(-40 + i * 15, 26, 8, 14); }
    c.fillStyle = '#2B2F3A'; c.beginPath(); c.roundRect(-52, -30, 104, 60, 9); c.fill(); c.shadowBlur = 0;
    c.fillStyle = '#fff'; c.font = '800 32px Prompt'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText('IC', 4, 2);
    c.restore();
  }

  // =====================================================================
  // SCENE 1 — HOOK
  // =====================================================================
  const H0 = S('hook');
  const hk = (() => {
    const sc = SC[0];
    const glow = at(sc, 240, 380, `<div style="width:600px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.95) 0%,rgba(184,217,248,.5) 45%,rgba(255,255,255,0) 70%)"></div>`);
    const phoneEl = at(sc, 390, 440, A.phone(300, true));
    const now = lbl(sc, 1100, `<span style="color:var(--hot)">วันนี้</span> คอมพิวเตอร์อยู่ในมือเรา`);
    const en = at(sc, 40, 430, A.eniac(1000));
    const past = lbl(sc, 1090, `<span class="pill" style="font-size:34px;padding:6px 20px;background:#31445D;color:#F6D77E">ค.ศ. 1946</span>แต่ก่อน ใหญ่เท่า<b style="color:#E0517F">ทั้งห้อง!</b>`);
    const nowTag = at(sc, 800, 1385, `<div class="pill" style="font-size:30px;padding:8px 22px;background:#fff;color:var(--hot);box-shadow:0 8px 18px rgba(110,90,150,.2)">วันนี้</div>`);
    const name = at(sc, 440, 1110, `<div style="position:relative;width:540px;height:200px;border-radius:44px;background:linear-gradient(180deg,#fff,#FFF2F8);box-shadow:0 18px 40px rgba(110,90,150,.25),0 0 0 6px #fff,0 0 0 12px rgba(245,169,199,.6)">
      <div style="position:absolute;left:34px;top:22px;font-weight:800;font-size:72px;color:var(--navy);line-height:1.1">บ็อกซ์</div>
      <div class="pill" style="position:absolute;left:30px;top:120px;font-size:30px;padding:8px 22px;color:#fff;background:linear-gradient(90deg,#EE7FAA,#F7A8C8)">พิธีกรพิเศษ · NaiSibPro</div>
      <img src="../../shared/brand/logo.png" style="position:absolute;right:26px;top:26px;width:140px"></div>`);
    const ttl = mk(sc, `<div class="etitle c" style="top:390px"><div class="yr" style="color:var(--hot)">NaiSibPro SPECIAL · EP.34</div>
      <div class="title-sticker n" style="color:var(--hot);font-size:190px">5 ยุค</div><div class="title-sticker th">ของคอมพิวเตอร์</div></div>`);
    const badges = [1, 2, 3, 4, 5].map(n => at(sc, 170 + (n - 1) * 185 - 70, 820, `<div style="position:relative;width:140px;height:140px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 12px 26px rgba(110,90,150,.22),0 0 0 6px ${ERA[n].dot}">${A.eraIcon(n, 100)}
      <div style="position:absolute;right:-8px;top:-8px;width:52px;height:52px;border-radius:50%;background:${ERA[n].dot};color:#fff;font-weight:800;font-size:30px;display:grid;place-items:center;box-shadow:0 0 0 5px #fff">${n}</div></div>`));
    const bline = at(sc, 170, 885, `<div style="width:740px;height:10px;border-radius:5px;background:linear-gradient(90deg,#E58A2E,#26A285,#4F82D0,#8C7EE0,#3FB7F0)"></div>`, 'transform-origin:0 50%');
    sc.insertBefore(bline, badges[0]);
    const clk = at(sc, 530, 1000, A.clock(300));
    const clkL = at(sc, 470, 1318, `<div class="pill" style="font-size:42px;font-weight:800;padding:14px 34px;color:#fff;background:linear-gradient(90deg,#EE7FAA,#9C8FE6);box-shadow:0 12px 26px rgba(150,110,200,.4)">ย้อนเวลา 5 ยุค!</div>`);
    const hm = clk.querySelector('.hm'), hh = clk.querySelector('.hh');
    const U = [0.11, 1.33, 2.94, 4.98, 9.01, 13.86, 15.89, 18.43, 22.61, 24.13, 29.26, 34.18];
    pop(H0 + .2); whoosh(H0 + 2.85); sfx('drop', H0 + 3.0, .5); pop(H0 + 3.6); sfx('step', H0 + 9.3, .4); sfx('step', H0 + 9.75, .4); sfx('step', H0 + 10.2, .4);
    pop(H0 + 10.5); whoosh(H0 + 18.3); sfx('sparkle', H0 + 18.6, .6); [0, 1, 2, 3, 4].forEach(i => pop(H0 + 24.13 + i * .8, .5)); pop(H0 + 29.4); sfx('rewind', H0 + 32.6, .5);
    // Box enters and hosts
    bk(H0 + 9.0, { x: -200, o: 1, d: .01, P: 'idle', emo: 'happy' });
    bk(H0 + 9.05, { x: 250, walk: true, d: 1.3, emo: 'happy' });
    bk(H0 + 10.4, { P: 'wave', emo: 'happy' });
    bk(H0 + 13.86, { P: 'explain', emo: 'talk' });
    bk(H0 + 15.89, { P: 'point', finger: true, emo: 'surprised' });
    bk(H0 + 18.43, { P: 'present', finger: false, emo: 'happy' });
    bk(H0 + 22.61, { P: 'explain', emo: 'talk' });
    bk(H0 + 24.13, { P: 'point', finger: true, emo: 'sparkle' });
    bk(H0 + 29.26, { P: 'pointSide', emo: 'talk' });
    bk(H0 + 33.9, { P: 'cheer', finger: false, emo: 'laugh' });
    function draw(t) {
      const u = t - H0;
      const zoomOut = E.inOut(P(u, 2.7, .9));
      tf(glow, { o: (1 - zoomOut) * clamp(u * 3), s: 1 + .04 * Math.sin(u * 2) });
      const pl = life(u, .02, 9.0, { from: .6, dy: 40, d: .5 });
      tf(phoneEl, { x: lerp(0, 330, zoomOut), y: lerp(bob(u, 0, 6), 490, zoomOut) + pl.y, s: lerp(1, .3, zoomOut) * pl.s, o: pl.o, r: lerp(0, 6, zoomOut) });
      show(now, u, .45, 2.7, { from: .6, dy: 30 });
      const el = life(u, 2.94, 18.3, { from: 1.7, dy: 0, d: .9, out: .4 });
      tf(en, { s: el.s, o: el.o, y: -200 * E.in(P(u, 18.3, .5)) });
      en.querySelectorAll('.lamp').forEach((l, i) => { l.style.opacity = .35 + .65 * (Math.sin(u * (3 + i % 5) + i * 1.7) > 0 ? 1 : .2); });
      show(past, u, 3.6, 9.0, { from: .5, dy: 40 });
      show(nowTag, u, 3.8, 9.0, { from: .3, dy: 20 });
      show(name, u, 10.5, 18.2, { from: .4, dy: 60, el: true, d: .8 }, { y: bob(u, 1, 5) });
      show(ttl, u, 18.43, 34.0, { from: .3, dy: 80, d: .8, el: true });
      const bl = P(u, 24.0, 4.0);
      bline.style.transform = `scaleX(${bl})`; bline.style.opacity = clamp((u - 24) * 4) * (1 - P(u, 34, .3));
      badges.forEach((b, i) => show(b, u, 24.13 + i * .8, 34.0, { from: .2, dy: 40, el: true, d: .8 }, { y: bob(u, i, 5) }));
      show(clk, u, 29.26, 34.3, { from: .3, dy: 40, el: true, d: .8 });
      const spin = u < 29.26 ? 0 : (u - 29.26) * 60 + Math.pow(Math.max(0, u - 32.6), 2) * 900;
      hm.style.transform = `rotate(${-spin * 6}deg)`; hh.style.transform = `rotate(${-spin / 2}deg)`;
      show(clkL, u, 29.8, 34.3, { from: .4, dy: 30 }, { s: 1 + .04 * Math.sin(u * 6) });
    }
    return draw;
  })();

  // =====================================================================
  // SCENE 2 — GEN 1: vacuum tubes
  // =====================================================================
  const G1 = S('gen1');
  const g1 = (() => {
    const sc = SC[1];
    const title = eraTitle(sc, 1);
    const tubeBig = at(sc, 580, 440, A.tube(260));
    const lead1 = mk(sc, `<div class="lead" style="left:440px;top:530px;width:170px"></div>`), lead2 = mk(sc, `<div class="lead" style="left:470px;top:772px;width:180px"></div>`);
    const tl1 = at(sc, 80, 492, `<div class="pill" style="font-size:36px;padding:12px 26px;background:#fff;color:var(--navy);box-shadow:0 10px 22px rgba(110,90,150,.2)">หลอดแก้วสุญญากาศ</div>`);
    const tl2 = at(sc, 80, 734, `<div class="pill" style="font-size:36px;padding:12px 26px;background:#fff;color:var(--navy);box-shadow:0 10px 22px rgba(110,90,150,.2)">${A.flame(40)}ไส้หลอดร้อน เรืองแสง</div>`);
    const job = at(sc, 420, 1070, `<div class="panel" style="position:relative;width:540px;height:200px"><div class="cap" style="top:30px;font-size:34px;color:var(--ecd)">หน้าที่ของหลอด</div><div class="cap" style="top:86px;font-size:44px">เป็น “สวิตช์” ไฟฟ้า<br><span class="sub" style="font-size:30px">เปิด / ปิด สัญญาณ</span></div></div>`);
    const en = at(sc, 40, 430, A.eniac(1000));
    const big = mk(sc, `<div class="abs c title-sticker" style="left:0;width:1080px;top:1075px;text-align:center;font-size:78px">ใหญ่เท่า<span style="color:#E0517F">ห้องทั้งห้อง!</span></div>`);
    const st1 = chipX(sc, 120, 1215, A.bigIcon(40), '≈ 167 ตร.ม.'), st2 = chipX(sc, 570, 1215, `<b style="font-size:26px;color:var(--ecd)">ตัน</b>`, '≈ 30 ตัน');
    const nm = lbl(sc, 1340, `<b>ENIAC</b><span class="sub" style="font-size:34px">คอมพิวเตอร์ยุคบุกเบิก · ค.ศ. 1946</span>`);
    const pH = at(sc, 90, 440, `<div class="panel" style="position:relative;width:430px;height:540px"><div style="position:absolute;left:140px;top:40px">${A.thermo(150)}</div>
      <div class="hw" style="position:absolute;left:40px;top:60px">${A.flame(70)}</div><div class="hw" style="position:absolute;right:40px;top:150px">${A.flame(56)}</div>
      <div class="cap" style="top:420px;font-size:46px">ความร้อนสูง</div><div class="cap sub" style="top:478px;font-size:28px">ต้องมีระบบระบายความร้อน</div></div>`);
    const pP = at(sc, 560, 440, `<div class="panel" style="position:relative;width:430px;height:540px"><div style="position:absolute;left:55px;top:90px">${A.gauge(320)}</div>
      <div style="position:absolute;left:175px;top:40px">${A.bolt(80)}</div>
      <div class="cap" style="top:420px;font-size:46px">กินไฟมหาศาล</div><div class="cap sub" style="top:478px;font-size:28px">ราว 150 กิโลวัตต์</div></div>`);
    const merc = pH.querySelector('.merc'), needle = pP.querySelector('.needle'), hws = [...pH.querySelectorAll('.hw')];
    let grid = '';
    for (let i = 0; i < 30; i++) grid += `<div class="mt" style="position:absolute;left:${60 + (i % 10) * 78}px;top:${36 + Math.floor(i / 10) * 112}px">${A.tube(52)}</div>`;
    const cnt = at(sc, 90, 440, `<div class="panel" style="position:relative;width:900px;height:560px">${grid}
      <div class="cap" style="top:390px;font-size:96px;color:var(--ecd)"><span class="cn">0</span> หลอด</div><div class="cap sub" style="top:500px;font-size:30px">ในเครื่อง ENIAC เครื่องเดียว (โดยประมาณ)</div></div>`);
    const mts = [...cnt.querySelectorAll('.mt')], cn = cnt.querySelector('.cn');
    const stamp = at(sc, 560, 455, `<div class="stamp">หลอดขาดบ่อย!</div>`, 'transform-origin:50% 50%');
    const rc = [chipX(sc, 430, 1060, A.bigIcon(40).replace('#fff', '#C9711F').replace(/stroke="#fff"/, 'stroke="#C9711F"'), 'ขนาดใหญ่มาก'), chipX(sc, 430, 1180, A.flame(44), 'ร้อนมาก'), chipX(sc, 430, 1300, A.bolt(44), 'กินไฟมาก')];
    const recapTop = at(sc, 340, 450, `<div class="panel" style="position:relative;width:400px;height:520px"><div style="position:absolute;left:115px;top:30px">${A.tube(170)}</div><div class="cap" style="top:380px;font-size:40px">ยุคหลอดสุญญากาศ</div><div class="cap sub" style="top:440px;font-size:28px">ค.ศ. 1940s – 1950s</div></div>`);
    // sfx
    pop(G1 + .3, .5); pop(G1 + 3.45); pop(G1 + 3.95, .45); pop(G1 + 6.7, .45); pop(G1 + 6.9); whoosh(G1 + 8.5); sfx('drop', G1 + 8.75, .5); sfx('stamp', G1 + 9.3, .45);
    pop(G1 + 13.3); pop(G1 + 13.6); pop(G1 + 14.2, .45); pop(G1 + 16.75); sfx('riser', G1 + 17.0, .3); pop(G1 + 22.9); sfx('buzz', G1 + 23.4, .4);
    pop(G1 + 25.9); sfx('stamp', G1 + 29.7, .6); [34.59, 35.58, 36.53].forEach(x => pop(G1 + x + .05, .6));
    // Box
    bk(G1 + .05, { x: 250, g: 1580, s: 1, P: 'present', emo: 'happy', finger: false });
    bk(G1 + 3.37, { P: 'point', finger: true, emo: 'talk' });
    bk(G1 + 6.6, { P: 'explain', finger: false, emo: 'talk' });
    bk(G1 + 8.66, { x: 880, g: 1000, s: .5, P: 'idle', emo: 'surprised', d: .8 });
    bk(G1 + 11.5, { P: 'point', finger: true, flip: true, emo: 'surprised' });
    bk(G1 + 13.25, { P: 'idle', finger: false, flip: false, emo: 'talk' });
    bk(G1 + 16.69, { x: 250, g: 1580, s: 1, P: 'shrug', emo: 'worried', d: .7 });
    bk(G1 + 22.84, { P: 'explain', emo: 'surprised' });
    bk(G1 + 25.82, { P: 'present', emo: 'talk' });
    bk(G1 + 29.58, { P: 'think', emo: 'thinking' });
    bk(G1 + 32.0, { P: 'explain', emo: 'talk' });
    bk(G1 + 34.59, { P: 'pointSide', finger: true, emo: 'happy' });
    bk(G1 + 37.6, { P: 'cheer', finger: false, emo: 'laugh' });
    function draw(t) {
      const u = t - G1;
      drawTitle(title, u);
      show(tubeBig, u, 3.37, 8.45, { from: .3, dy: 60, el: true, d: .8 }, { y: bob(u, 0, 6) });
      const fl = .75 + .25 * Math.sin(u * 23) * Math.sin(u * 7.3);
      tubeBig.querySelector('.tglow').style.opacity = fl; tubeBig.querySelector('.tfil').style.opacity = .7 + .3 * fl;
      [[lead1, 3.95], [lead2, 6.75]].forEach(([l, a]) => { l.style.transform = `scaleX(${E.out(P(u, a, .4))})`; l.style.opacity = 1 - P(u, 8.3, .2); });
      show(tl1, u, 3.95, 8.45, { from: .5, dy: 0 }, { x: -60 * (1 - E.out(P(u, 3.95, .5))) });
      show(tl2, u, 6.75, 8.45, { from: .5, dy: 0 }, { x: -60 * (1 - E.out(P(u, 6.75, .5))) });
      show(job, u, 6.9, 8.45, { from: .4, dy: 40 });
      const el = life(u, 8.66, 16.5, { from: 1.8, dy: 0, d: 1.0, out: .35 });
      tf(en, { s: el.s, o: el.o });
      en.querySelectorAll('.lamp').forEach((l, i) => { l.style.opacity = .35 + .65 * (Math.sin(u * (3 + i % 5) + i * 1.7) > 0 ? 1 : .2); });
      show(big, u, 9.2, 16.5, { from: .3, dy: 40, el: true, d: .8 });
      show(st1, u, 13.3, 16.5, { from: .4, dy: 30 }); show(st2, u, 13.6, 16.5, { from: .4, dy: 30 });
      show(nm, u, 14.2, 16.5, { from: .5, dy: 30 });
      show(pH, u, 16.69, 25.6, { from: .4, dy: 60, el: true, d: .8 });
      show(pP, u, 22.84, 25.6, { from: .4, dy: 60, el: true, d: .8 });
      merc.style.transform = `scaleY(${.2 + .8 * E.out(P(u, 17.0, 2.2)) + .02 * Math.sin(u * 9)})`;
      hws.forEach((w, i) => { w.style.transform = `translateY(${-((u * 40 + i * 30) % 60)}px) scale(${1 + .1 * Math.sin(u * 8 + i)})`; w.style.opacity = clamp((u - 17.4) * 2); });
      needle.style.transform = `rotate(${-80 + 158 * E.back(P(u, 23.2, 1.3)) + 3 * Math.sin(u * 17)}deg)`;
      show(cnt, u, 25.82, 34.4, { from: .4, dy: 60, el: true, d: .8 });
      mts.forEach((m, i) => {
        const on = u > 26.0 + i * .06, dead = [3, 11, 17, 26].includes(i) && u > 29.7;
        m.style.opacity = on ? 1 : .15; m.style.filter = dead ? 'grayscale(1) brightness(.75)' : '';
        const g = m.querySelector('.tglow'); g.style.opacity = dead ? 0 : .5 + .5 * Math.sin(u * 9 + i);
      });
      cn.textContent = Math.round(18000 * E.out(P(u, 26.0, 2.6)) / 100) * 100 >= 18000 ? '≈ 18,000' : (Math.round(18000 * E.out(P(u, 26.0, 2.6)) / 100) * 100).toLocaleString('en-US');
      show(stamp, u, 29.7, 34.4, { from: 2.2, dy: 0, d: .35 }, { r: -10 });
      show(recapTop, u, 34.5, 38.3, { from: .4, dy: 60 });
      rc.forEach((c, i) => show(c, u, [34.59, 35.58, 36.53][i], 38.3, { from: .3, dy: 0, el: true, d: .7 }, { x: 80 * (1 - E.out(P(u, [34.59, 35.58, 36.53][i], .5))) }));
    }
    return draw;
  })();

  // =====================================================================
  // SCENE 3 — GEN 2: transistors
  // =====================================================================
  const G2 = S('gen2');
  const g2 = (() => {
    const sc = SC[2];
    const title = eraTitle(sc, 2);
    const cmp = at(sc, 70, 440, `<div class="panel" style="position:relative;width:940px;height:560px">
      <div class="tb" style="position:absolute;left:150px;top:105px">${A.tube(180)}</div>
      <div class="ts" style="position:absolute;left:640px;top:330px">${A.transistor(84)}</div>
      <div class="vs" style="position:absolute;left:420px;top:230px;width:100px;height:100px;border-radius:50%;background:var(--ec2);color:#fff;font-weight:800;font-size:44px;display:grid;place-items:center;box-shadow:0 0 0 6px #fff,0 10px 20px rgba(30,140,112,.35)">VS</div>
      <div class="cap" style="top:476px;left:40px;right:auto;width:400px;font-size:36px">หลอดสุญญากาศ</div><div class="cap" style="top:476px;left:500px;right:auto;width:400px;font-size:36px;color:var(--ecd)">ทรานซิสเตอร์</div>
      <div class="m1" style="position:absolute;left:0;right:0;top:26px;display:flex;justify-content:center"><div class="pill" style="font-size:36px;padding:10px 28px;color:#fff;background:var(--ec2)">เล็กกว่ามาก!</div></div>
      <div class="m2" style="position:absolute;left:0;right:0;top:26px;display:flex;justify-content:center"><div class="pill" style="font-size:34px;padding:10px 28px;color:var(--navy);background:#EFFBF6">ทำหน้าที่เดียวกัน: สวิตช์ไฟฟ้า</div></div></div>`);
    const tb = cmp.querySelector('.tb'), ts = cmp.querySelector('.ts'), vs = cmp.querySelector('.vs'), m1 = cmp.querySelector('.m1'), m2 = cmp.querySelector('.m2');
    const BEN = [['ขนาด', 'เล็กลง', '↓', A.bigIcon(36).replace(/stroke="#fff"/, 'stroke="#1E8C70"')], ['กินไฟ', 'น้อยลง', '↓', A.bolt(40, '#F5A623')], ['ความร้อน', 'ลดลง', '↓', A.flame(40)], ['เชื่อถือได้', 'มากขึ้น', '↑', ICON.check('#26A269', 40)]];
    const ben = at(sc, 420, 1050, `<div class="panel" style="position:relative;width:540px;height:460px">${BEN.map((b, i) => `<div class="br" style="position:absolute;left:24px;top:${22 + i * 106}px;display:flex;align-items:center;gap:16px;font-size:38px;font-weight:600;white-space:nowrap">
      <div style="width:70px;height:70px;border-radius:50%;background:#EFFBF6;display:grid;place-items:center">${b[3]}</div>${b[0]} <b style="font-weight:800;color:var(--ecd)">${b[1]}</b>
      <span style="font-weight:800;font-size:44px;color:${b[2] === '↑' ? '#26A269' : '#1E8C70'}">${b[2]}</span></div>`).join('')}</div>`);
    const brs = [...ben.querySelectorAll('.br')];
    const mf = at(sc, 90, 450, A.mainframe(900));
    const reels = [...mf.querySelectorAll('.reel')], lamps = [...mf.querySelectorAll('.lamp2')], paper = mf.querySelector('.paper');
    const mc = [chipX(sc, 90, 1060, A.bigIcon(40).replace(/stroke="#fff"/, 'stroke="#1E8C70"'), 'จากเต็มห้อง → เหลือเป็นตู้'), chipX(sc, 90, 1180, `${ICON.pkg(40, '#1E8C70')}`, 'เริ่มใช้ในงานธุรกิจ'), chipX(sc, 90, 1300, ICON.check('#26A269', 40), 'เร็วและทนกว่าเดิม')];
    pop(G2 + .3, .5); pop(G2 + 3.8); sfx('sparkle', G2 + 5.1, .6); pop(G2 + 6.6, .5); pop(G2 + 11.7, .5);
    [13.75, 17.42, 24.02, 28.21].forEach(x => { pop(G2 + x + .05, .55); sfx('ding', G2 + x + .35, .25); });
    whoosh(G2 + 29.9); sfx('drop', G2 + 30.1, .45); [30.3, 33.1, 34.4].forEach(x => pop(G2 + x, .55));
    bk(G2 + .05, { x: 250, g: 1580, s: 1, P: 'present', emo: 'happy', finger: false, flip: false });
    bk(G2 + 3.72, { P: 'explain', emo: 'talk' });
    bk(G2 + 5.1, { P: 'point', finger: true, emo: 'surprised' });
    bk(G2 + 10.0, { P: 'explain', finger: false, emo: 'talk' });
    bk(G2 + 13.75, { P: 'pointSide', finger: true, emo: 'happy' });
    bk(G2 + 20.5, { P: 'explain', finger: false, emo: 'talk' });
    bk(G2 + 28.21, { P: 'cheer', emo: 'laugh' });
    bk(G2 + 29.98, { x: 840, flip: true, walk: true, d: 1.1, P: 'idle', emo: 'happy' });
    bk(G2 + 31.3, { P: 'point', finger: true, emo: 'talk' });
    bk(G2 + 34.34, { P: 'present', finger: false, emo: 'happy' });
    bk(G2 + 37.7, { P: 'wave', emo: 'happy' });
    function draw(t) {
      const u = t - G2;
      drawTitle(title, u);
      show(cmp, u, 3.72, 29.85, { from: .4, dy: 60, el: true, d: .8 });
      tb.style.transform = `translateY(${bob(u, 0, 5)}px)`; tb.querySelector('.tglow').style.opacity = .6 + .3 * Math.sin(u * 13);
      const tp = E.elastic(P(u, 5.0, 1.0));
      ts.style.transform = `translateY(${bob(u, 2, 5)}px) scale(${tp})`; ts.style.opacity = clamp((u - 5) * 4);
      vs.style.transform = `scale(${E.back(P(u, 4.3, .5))})`;
      tf(m1, { ...life(u, 6.6, 11.5, { from: .4, dy: 20 }) }); tf(m2, { ...life(u, 11.65, 29.8, { from: .4, dy: 20 }) });
      show(ben, u, 13.6, 29.85, { from: .5, dy: 60 });
      brs.forEach((b, i) => show(b, u, [13.75, 17.42, 24.02, 28.21][i], 29.85, { from: .3, dy: 0, el: true, d: .7 }));
      const ml = life(u, 29.98, 40.0, { from: .3, dy: 0, d: .9 });
      tf(mf, { s: lerp(2.2, 1, E.out(P(u, 29.98, 1.0))) * (ml.o > 0 ? 1 : 0), o: ml.o });
      reels.forEach((r, i) => { r.style.transform = `rotate(${(u * (i % 2 ? -140 : 180)) % 360}deg)`; });
      lamps.forEach((l, i) => { l.style.opacity = Math.sin(u * 6 + i * 2.3) > -.2 ? 1 : .25; });
      paper.style.transform = `translateY(${-((u * 12) % 30)}px)`;
      mc.forEach((c, i) => show(c, u, [30.3, 33.1, 34.4][i], 40.0, { from: .3, dy: 0, el: true, d: .7 }, { x: -60 * (1 - E.out(P(u, [30.3, 33.1, 34.4][i], .5))) }));
    }
    return draw;
  })();

  // =====================================================================
  // SCENE 4 — GEN 3: integrated circuits
  // =====================================================================
  const G3 = S('gen3');
  const g3 = (() => {
    const sc = SC[3];
    const title = eraTitle(sc, 3);
    const PARTS = [[A.resistor(150), 90, 450], [A.capacitor(70), 880, 440], [A.diode(130), 110, 900], [A.transistor(64), 860, 820], [A.resistor(130), 470, 430], [A.capacitor(60), 120, 640], [A.diode(120), 820, 660], [A.transistor(56), 520, 880]];
    const parts = PARTS.map(([s, x, y]) => ({ el: at(sc, x, y, s), x, y }));
    const ring = at(sc, 340, 520, `<div style="width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.95),rgba(149,191,239,.55) 45%,rgba(149,191,239,0) 70%)"></div>`);
    const chipBig = at(sc, 405, 640, A.chip(270));
    const cap1 = lbl(sc, 870, `หลายชิ้นส่วน <span style="color:var(--ecd)">→</span> รวมในชิปเดียว`);
    const icCard = at(sc, 420, 1070, `<div class="panel" style="position:relative;width:540px;height:220px"><div class="cap" style="top:28px;font-size:60px;color:var(--ecd)">IC</div><div class="cap" style="top:104px;font-size:40px">Integrated Circuit</div><div class="cap sub" style="top:158px;font-size:32px">วงจรรวม</div></div>`);
    const lensEl = at(sc, 260, 430, A.lens(560));
    const pulses = [...lensEl.querySelectorAll('.pulse')];
    const mini = at(sc, 120, 440, `<div style="position:relative">${A.chip(140)}<div style="position:absolute;left:120px;top:60px;width:150px;height:6px;background:#5E8FD6;transform:rotate(18deg);transform-origin:0 50%"></div></div>`);
    const lc = [chipX(sc, 430, 1060, A.transistor(30), 'ทรานซิสเตอร์จำนวนมาก'), chipX(sc, 430, 1180, A.chip(56), 'บนชิปซิลิคอนเล็กๆ'), chipX(sc, 430, 1300, A.bolt(42), 'เร็วขึ้น ประหยัดขึ้น')];
    const mcEl = at(sc, 200, 450, A.minicomp(680));
    const mreel = mcEl.querySelector('.reel'), mlamps = [...mcEl.querySelectorAll('.lamp2')], cursor = mcEl.querySelector('.cursor');
    const mlbl = at(sc, 330, 440, `<div class="pill" style="font-size:36px;padding:10px 28px;color:#fff;background:var(--ec2)">มินิคอมพิวเตอร์</div>`);
    const dc = [chipX(sc, 430, 1060, A.bigIcon(40).replace(/stroke="#fff"/, 'stroke="#3F6FB8"'), 'ขนาดเล็กลง'), chipX(sc, 430, 1180, A.bolt(42), 'ทำงานเร็วขึ้น'), chipX(sc, 430, 1300, ICON.check('#26A269', 40), 'ราคาถูกลง')];
    const icT = mk(sc, `<div class="etitle c" style="top:430px"><div class="title-sticker" style="font-size:118px;color:var(--ecd)">วงจรรวม (IC)</div><div class="yr" style="color:var(--ecd)">รวมชิ้นส่วนไว้บนชิปเดียว</div></div>`);
    const orb = [0, 1, 2, 3, 4, 5].map(i => at(sc, 480, 760, A.chip(110)));
    const ec = [chipX(sc, 430, 1080, ICON.check('#26A269', 40), 'เล็กลง + เก่งขึ้น'), chipX(sc, 430, 1200, `<span style="font-weight:800;font-size:36px;color:var(--ecd)">→</span>`, 'ปูทางสู่ยุคที่ 4')];
    pop(G3 + .3, .5); PARTS.forEach((_, i) => sfx('click', G3 + 5.2 + i * .45, .5)); sfx('success', G3 + 9.2, .5); pop(G3 + 9.5);
    whoosh(G3 + 12.5); sfx('sparkle', G3 + 12.9, .5); [14.6, 16.55, 17.95].forEach(x => pop(G3 + x, .55));
    whoosh(G3 + 20.9); [21.3, 23.3, 25.3].forEach(x => pop(G3 + x, .55)); sfx('key', G3 + 22.0, .4); sfx('key', G3 + 22.2, .4); sfx('key', G3 + 22.35, .4);
    sfx('sparkle', G3 + 27.9, .7); pop(G3 + 32.2); pop(G3 + 33.4);
    bk(G3 + .05, { x: 250, g: 1580, s: 1, P: 'present', emo: 'happy', finger: false, flip: false, d: .6 });
    bk(G3 + 4.74, { P: 'explain', emo: 'talk' });
    bk(G3 + 9.2, { P: 'point', finger: true, emo: 'sparkle' });
    bk(G3 + 12.64, { P: 'think', finger: false, emo: 'thinking' });
    bk(G3 + 14.57, { P: 'pointSide', finger: true, emo: 'talk' });
    bk(G3 + 20.98, { P: 'explain', finger: false, emo: 'happy' });
    bk(G3 + 24.0, { P: 'present', emo: 'talk' });
    bk(G3 + 27.8, { P: 'hold', hold: 1, emo: 'happy' });
    bk(G3 + 32.16, { P: 'hold', emo: 'talk' });
    bk(G3 + 35.6, { P: 'cheer', hold: 0, emo: 'laugh' });
    function draw(t) {
      const u = t - G3;
      drawTitle(title, u);
      parts.forEach((p, i) => {
        const a = 5.2 + i * .45, k = E.inOut(P(u, a, .9)), l = life(u, 4.74 + i * .08, 1e9, { from: .3, dy: 30, d: .5 });
        tf(p.el, { x: (540 - p.x - 60) * k, y: (690 - p.y - 30) * k + l.y + bob(u, i, 6) * (1 - k), s: l.s * (1 - .8 * k), r: k * 200, o: l.o * (1 - P(u, a + .7, .2)) * (u < 12.5 ? 1 : 0) });
      });
      const cpL = life(u, 9.2, 12.5, { from: 0, dy: 0, el: true, d: .9, out: .3 });
      tf(chipBig, { ...cpL, y: bob(u, 0, 6) }); tf(ring, { s: .8 + .1 * Math.sin(u * 4), o: cpL.o * .9 });
      show(cap1, u, 9.4, 12.5, { from: .5, dy: 30 });
      show(icCard, u, 9.6, 12.5, { from: .4, dy: 40 });
      show(lensEl, u, 12.64, 20.85, { from: .2, dy: 0, d: .8 });
      pulses.forEach((p, i) => { p.style.strokeDashoffset = -((u * 520 + i * 137) % 940); });
      show(mini, u, 13.0, 20.85, { from: .4, dy: 0 });
      lc.forEach((c, i) => show(c, u, [14.57, 16.52, 17.93][i], 20.85, { from: .3, dy: 0, el: true, d: .7 }, { x: 70 * (1 - E.out(P(u, [14.57, 16.52, 17.93][i], .5))) }));
      const mcl = life(u, 20.98, 27.6, { from: .4, dy: 0, d: .8 });
      tf(mcEl, { s: mcl.s * lerp(1.5, 1, E.out(P(u, 20.98, .9))), o: mcl.o, y: 0 });
      mreel.style.transform = `rotate(${u * 160}deg)`; mlamps.forEach((l, i) => { l.style.opacity = Math.sin(u * 7 + i * 1.9) > 0 ? 1 : .3; }); cursor.style.opacity = Math.floor(u * 2) % 2 ? 0 : 1;
      show(mlbl, u, 21.6, 27.6, { from: .4, dy: 20 });
      dc.forEach((c, i) => show(c, u, [21.3, 23.3, 25.3][i], 27.6, { from: .3, dy: 0, el: true, d: .7 }, { x: 70 * (1 - E.out(P(u, [21.3, 23.3, 25.3][i], .5))) }));
      show(icT, u, 27.8, 37.4, { from: .3, dy: 60, el: true, d: .8 });
      orb.forEach((o, i) => { const a = u * .9 + i * Math.PI / 3, l = life(u, 28.2 + i * .12, 37.4, { from: .2, dy: 0 }); tf(o, { x: Math.cos(a) * 300 - 55, y: Math.sin(a) * 70 - 30, s: l.s * (.75 + .25 * Math.sin(a)), o: l.o }); o.style.zIndex = Math.sin(a) > 0 ? 2 : 0; });
      ec.forEach((c, i) => show(c, u, [32.16, 33.33][i], 37.4, { from: .3, dy: 0, el: true, d: .7 }));
    }
    return draw;
  })();

  // =====================================================================
  // SCENE 5 — GEN 4: microprocessors
  // =====================================================================
  const G4 = S('gen4');
  const g4 = (() => {
    const sc = SC[4];
    const title = eraTitle(sc, 4);
    const PT = [['หน่วยควบคุม', 'Control Unit'], ['หน่วยคำนวณ', 'ALU'], ['หน่วยความจำ', 'Register']];
    const parts = PT.map(([a, b], i) => lbl(sc, 470 + i * 120, `${a}<span class="sub" style="font-size:30px">${b}</span>`));
    const glowC = at(sc, 300, 410, `<div style="width:480px;height:480px;border-radius:50%;background:radial-gradient(circle,rgba(246,215,126,.9),rgba(246,215,126,0) 68%)"></div>`);
    const cpuEl = at(sc, 370, 480, A.cpu(340));
    const cpuL = lbl(sc, 870, `CPU ทั้งตัว <span style="color:var(--ecd)">อยู่บนชิปเดียว</span>`);
    const turn = at(sc, 420, 1060, `<div style="position:relative;width:540px;height:200px"><svg width="200" height="200" viewBox="0 0 200 200" class="burst" style="position:absolute;left:-10px;top:0"><path d="${[...Array(16)].map((_, i) => { const a = i * Math.PI / 8, r = i % 2 ? 70 : 98; return `${i ? 'L' : 'M'}${100 + r * Math.cos(a)} ${100 + r * Math.sin(a)}`; }).join('')}Z" fill="#FFD36E"/><text x="100" y="116" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="46" fill="#31445D">!</text></svg>
      <div class="panel" style="position:absolute;left:170px;top:30px;width:370px;height:140px"><div class="cap" style="top:16px;font-size:44px;color:var(--ecd)">จุดเปลี่ยน</div><div class="cap" style="top:74px;font-size:36px">สำคัญของโลกคอมพ์</div></div></div>`);
    const burst = turn.querySelector('.burst');
    const c4 = at(sc, 90, 440, `<div class="panel" style="position:relative;width:900px;height:560px"><div class="ch" style="position:absolute;left:190px;top:40px">${A.i4004(520)}</div>
      <div class="cap l1" style="top:325px;font-size:66px">Intel 4004</div><div class="cap l2" style="top:412px;font-size:36px;color:var(--ecd)">ค.ศ. 1971 · ราว 2,300 ทรานซิสเตอร์</div>
      <div class="cap sub l3" style="top:470px;font-size:32px">หนึ่งในไมโครโปรเซสเซอร์ตัวแรกของโลก</div></div>`);
    const [l1, l2, l3, ch4] = ['.l1', '.l2', '.l3', '.ch'].map(s => c4.querySelector(s));
    const head = lbl(sc, 430, `คอมพิวเตอร์ส่วนบุคคล <span style="color:var(--ecd)">(PC)</span>`);
    const devs = [[A.desktop(300), 80, 540, 'PC ตั้งโต๊ะ'], [A.laptop(270), 405, 580, 'แล็ปท็อป'], [A.phone(120), 790, 535, 'สมาร์ตโฟน']]
      .map(([s, x, y, n]) => ({ el: at(sc, x, y, s), lb: at(sc, x + (n === 'สมาร์ตโฟน' ? -60 : 0), 845, `<div style="width:${n === 'สมาร์ตโฟน' ? 240 : 300}px;display:flex;justify-content:center"><div class="pill" style="font-size:32px;padding:8px 22px;background:#fff;color:var(--navy);box-shadow:0 8px 18px rgba(110,90,150,.18)">${n}</div></div>`) }));
    const arrs = [380, 690].map(x => at(sc, x, 660, `<svg width="44" height="60" viewBox="0 0 44 60"><path d="M6 6l28 24L6 54" fill="none" stroke="#9C8FE6" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`));
    const hs = at(sc, 110, 450, A.house(330)), of = at(sc, 640, 450, A.office(330));
    const ows = [...of.querySelectorAll('.ow')];
    const hoL = lbl(sc, 780, `คอมพิวเตอร์เข้าสู่ <span style="color:var(--ecd)">ทุกบ้าน ทุกออฟฟิศ</span>`);
    const hc = [chipX(sc, 430, 1060, ICON.check('#26A269', 40), 'ราคาถูกลง'), chipX(sc, 430, 1180, A.laptop(52), 'เล็กลง พกพาได้'), chipX(sc, 430, 1300, ICON.check('#26A269', 40), 'ใช้งานง่ายขึ้น')];
    const heart = mk(sc, `<div class="etitle c" style="top:440px"><div style="position:relative;width:300px;height:300px"><div style="position:absolute;inset:-60px;border-radius:50%;background:radial-gradient(circle,rgba(246,215,126,.8),rgba(246,215,126,0) 68%)"></div><div style="position:absolute;left:10px;top:10px">${A.cpu(280)}</div></div>
      <div class="title-sticker" style="font-size:66px;margin-top:16px">หัวใจของคอมพิวเตอร์</div><div class="title-sticker" style="font-size:66px;color:var(--ecd)">ยุคใหม่</div></div>`);
    const rc4 = chipX(sc, 430, 1100, A.cpu(48), 'ยุค 4 = CPU บนชิปเดียว');
    pop(G4 + .3, .5); [3.9, 4.9, 5.9].forEach(x => pop(G4 + x, .5)); whoosh(G4 + 6.0); sfx('success', G4 + 6.6, .5); pop(G4 + 7.4); sfx('stamp', G4 + 7.9, .5);
    whoosh(G4 + 11.95); pop(G4 + 12.2); [12.6, 14.15, 16.8].forEach(x => pop(G4 + x, .45));
    whoosh(G4 + 19.6); pop(G4 + 19.8); pop(G4 + 22.45); pop(G4 + 26.65); pop(G4 + 29.9); sfx('notify', G4 + 30.4, .35);
    whoosh(G4 + 32.95); pop(G4 + 33.2); [34.9, 36.85, 38.45].forEach(x => pop(G4 + x, .55)); whoosh(G4 + 41.6); sfx('sparkle', G4 + 41.9, .6); pop(G4 + 44.7);
    bk(G4 + .05, { x: 250, g: 1580, s: 1, P: 'present', emo: 'happy', finger: false, flip: false, hold: 0 });
    bk(G4 + 3.78, { P: 'explain', emo: 'talk' });
    bk(G4 + 6.6, { P: 'point', finger: true, emo: 'surprised' });
    bk(G4 + 7.32, { P: 'cheer', finger: false, emo: 'sparkle' });
    bk(G4 + 9.2, { P: 'explain', emo: 'talk' });
    bk(G4 + 12.08, { P: 'point', finger: true, emo: 'talk' });
    bk(G4 + 16.75, { P: 'present', finger: false, emo: 'happy' });
    bk(G4 + 19.7, { P: 'pointSide', finger: true, emo: 'talk' });
    bk(G4 + 26.57, { P: 'explain', finger: false, emo: 'happy' });
    bk(G4 + 29.85, { P: 'point', finger: true, emo: 'sparkle' });
    bk(G4 + 33.05, { P: 'present', finger: false, emo: 'talk' });
    bk(G4 + 36.81, { P: 'explain', emo: 'happy' });
    bk(G4 + 41.75, { P: 'point', finger: true, emo: 'talk' });
    bk(G4 + 44.61, { P: 'cheer', finger: false, emo: 'laugh' });
    function draw(t) {
      const u = t - G4;
      drawTitle(title, u);
      parts.forEach((p, i) => { const k = E.in(P(u, 6.0 + i * .08, .55)); const l = life(u, 3.78 + i * 1.0, 1e9, { from: .4, dy: 40 }); tf(p, { y: l.y + (640 - 505 - i * 120) * k, s: l.s * (1 - .85 * k), o: l.o * (1 - P(u, 6.4 + i * .08, .2)) }); });
      const cl = life(u, 6.6, 11.9, { from: 0, dy: 0, el: true, d: .9, out: .3 });
      tf(cpuEl, { ...cl, y: bob(u, 0, 6), r: Math.sin(u * 1.5) * 2 });
      tf(glowC, { s: .9 + .1 * Math.sin(u * 3), o: cl.o });
      show(cpuL, u, 7.32, 11.9, { from: .5, dy: 30 });
      show(turn, u, 7.6, 11.9, { from: .3, dy: 30, el: true, d: .8 });
      burst.style.transform = `rotate(${u * 40}deg)`;
      show(c4, u, 12.08, 19.55, { from: .4, dy: 60, el: true, d: .8 });
      ch4.style.transform = `translateY(${bob(u, 0, 6)}px) rotate(${Math.sin(u * 1.4) * 2}deg)`;
      [[l1, 12.6], [l2, 14.09], [l3, 16.75]].forEach(([l, a]) => tf(l, life(u, a, 1e9, { from: .6, dy: 20 })));
      show(head, u, 22.38, 32.9, { from: .5, dy: 30 });
      devs.forEach((d, i) => { const a = [19.7, 26.57, 29.85][i]; show(d.el, u, a, 32.9, { from: .3, dy: 60, el: true, d: .8 }, { y: bob(u, i, 5) }); show(d.lb, u, a + .3, 32.9, { from: .5, dy: 20 }); });
      arrs.forEach((a, i) => show(a, u, [26.3, 29.6][i], 32.9, { from: .3, dy: 0 }, { x: 8 * Math.sin(u * 6) }));
      show(hs, u, 33.05, 41.6, { from: .3, dy: 60, el: true, d: .8 }); show(of, u, 33.4, 41.6, { from: .3, dy: 60, el: true, d: .8 });
      ows.forEach((w, i) => { w.style.fill = u > 33.6 + (i * 7 % 20) * .12 ? '#FFD36E' : '#B8D9F8'; });
      show(hoL, u, 33.6, 41.6, { from: .5, dy: 30 });
      hc.forEach((c, i) => show(c, u, [34.84, 36.81, 38.38][i], 41.6, { from: .3, dy: 0, el: true, d: .7 }, { x: 70 * (1 - E.out(P(u, [34.84, 36.81, 38.38][i], .5))) }));
      show(heart, u, 41.75, 49.2, { from: .3, dy: 60, el: true, d: .8 });
      show(rc4, u, 44.61, 49.2, { from: .3, dy: 0, el: true, d: .7 });
    }
    return draw;
  })();

  // =====================================================================
  // SCENE 6 — GEN 5: artificial intelligence (dark, neon)
  // =====================================================================
  const G5 = S('gen5');
  const g5 = (() => {
    const sc = SC[5];
    const title = eraTitle(sc, 5);
    title.querySelector('.n').style.color = '#4B3AA8';
    const netEl = at(sc, 210, 440, A.net(660));
    const pulses = [...netEl.querySelectorAll('.pulses circle')], nds = [...netEl.querySelectorAll('.nd')];
    const aiCard = at(sc, 420, 1070, `<div class="panel" style="position:relative;width:550px;height:230px"><div class="cap" style="top:24px;font-size:52px;color:#4B3AA8">AI = ปัญญาประดิษฐ์</div>
      <div class="cap sub" style="top:104px;font-size:32px;line-height:1.35">ทำให้คอมพิวเตอร์ “เรียนรู้”<br>และ “คิด” ได้คล้ายมนุษย์</div></div>`);
    const TI = [[A.chat(250), 'ประมวลผลภาษา', 'Natural Language Processing'], [A.catPic(250), 'จดจำภาพ', 'Image Recognition'], [A.learnChart(250), 'การเรียนรู้ของเครื่อง', 'Machine Learning'], [A.dataChart(250), 'วิเคราะห์ข้อมูล', 'Data Analysis']];
    const tiles = TI.map(([art, a, b], i) => mk(sc, `<div class="tile c" style="left:${i % 2 ? 560 : 90}px;top:${i < 2 ? 430 : 718}px"><div class="art">${art}</div>${a}<i>${b}</i></div>`));
    const cb = [tiles[0].querySelector('.cb1'), tiles[0].querySelector('.cb2')], bbox = tiles[1].querySelector('.bbox'), btag = tiles[1].querySelector('.btag');
    const lcv = tiles[2].querySelector('.lc'), lps = [...tiles[2].querySelectorAll('.lp')], dbs = [...tiles[3].querySelectorAll('.db')];
    const hd = lbl(sc, 440, `ยุคที่ 5 = เน้น<span style="color:#4B3AA8">ความสามารถด้าน AI</span>`);
    const top = at(sc, 130, 580, `<div style="position:relative;width:820px;height:150px;border-radius:36px;background:linear-gradient(90deg,#3FB7F0,#FF7FC8);box-shadow:0 0 40px rgba(255,127,200,.6),0 0 0 5px #fff;display:flex;align-items:center;justify-content:center;gap:20px;color:#fff;font-weight:800;font-size:50px">${A.brainIcon(80)}ความสามารถ AI</div>`);
    const mid = at(sc, 480, 742, `<svg width="120" height="70" viewBox="0 0 120 70"><path d="M60 64V8M36 30L60 6l24 24" fill="none" stroke="#fff" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`);
    const bot = at(sc, 130, 822, `<div style="position:relative;width:820px;height:150px;border-radius:36px;background:linear-gradient(180deg,#3A4470,#2A3260);box-shadow:0 0 0 5px rgba(255,255,255,.85);display:flex;align-items:center;justify-content:center;gap:20px;color:#fff;font-weight:800;font-size:44px">${A.cpu(96)}ไมโครโปรเซสเซอร์ · ชิปประมวลผล</div>`);
    const n1 = at(sc, 420, 1060, `<div class="panel" style="position:relative;width:550px;height:130px"><div class="cap" style="top:16px;font-size:38px">ไมโครโปรเซสเซอร์</div><div class="cap" style="top:66px;font-size:38px;color:#E0517F">ไม่ได้หายไป</div></div>`);
    const n2 = at(sc, 420, 1230, `<div class="panel" style="position:relative;width:550px;height:130px"><div class="cap" style="top:16px;font-size:36px">AI ยังทำงานบนชิป</div><div class="cap" style="top:66px;font-size:38px;color:#4B3AA8">CPU · GPU</div></div>`);
    const fin = mk(sc, `<div class="etitle c" style="top:460px"><div class="title-sticker" style="font-size:150px;color:#4B3AA8">ยุคแห่ง AI</div><div class="yr" style="color:#4B3AA8">เรียนรู้ · เข้าใจภาษา · มองเห็น · วิเคราะห์</div></div>`);
    const orbit = [A.chat(130), A.catPic(130), A.learnChart(130), A.dataChart(130)].map(s => at(sc, 475, 820, `<div style="border-radius:16px;box-shadow:0 0 24px rgba(91,224,255,.6)">${s}</div>`));
    pop(G5 + .3, .5); sfx('sparkle', G5 + 3.8, .7); whoosh(G5 + 5.1); sfx('riser', G5 + 5.2, .3); pop(G5 + 6.1);
    [12.6, 15.45, 18.9, 22.32].forEach(x => pop(G5 + x + .05, .6)); sfx('msg', G5 + 13.2, .5); sfx('msg', G5 + 13.9, .5); sfx('ding', G5 + 16.4, .35); sfx('success', G5 + 20.4, .35); sfx('coin', G5 + 23.0, .3);
    whoosh(G5 + 28.45); pop(G5 + 28.7); pop(G5 + 29.4); pop(G5 + 30.1); pop(G5 + 32.65); pop(G5 + 34.3); whoosh(G5 + 41.55); sfx('sparkle', G5 + 41.8, .7);
    bk(G5 + .05, { x: 250, g: 1580, s: 1, P: 'present', emo: 'happy', finger: false, flip: false, glow: 1 });
    bk(G5 + 3.0, { P: 'glasses', emo: 'smirk' });
    bk(G5 + 3.67, { P: 'glasses', glasses: 1, emo: 'sparkle', d: .5 });
    bk(G5 + 5.15, { P: 'point', finger: true, emo: 'sparkle' });
    bk(G5 + 8.5, { P: 'explain', finger: false, emo: 'talk' });
    bk(G5 + 12.0, { g: 1665, P: 'present', emo: 'happy', d: .6 });
    bk(G5 + 18.9, { P: 'explain', emo: 'talk' });
    bk(G5 + 24.01, { P: 'pointSide', finger: true, emo: 'happy' });
    bk(G5 + 28.58, { g: 1580, P: 'explain', finger: false, emo: 'talk', d: .6 });
    bk(G5 + 32.59, { P: 'pointSide', finger: true, emo: 'talk' });
    bk(G5 + 36.72, { P: 'explain', finger: false, emo: 'happy' });
    bk(G5 + 41.69, { P: 'cheer', emo: 'laugh' });
    bk(G5 + 45.2, { P: 'wave', emo: 'happy' });
    function draw(t) {
      const u = t - G5;
      drawTitle(title, u);
      show(netEl, u, 5.15, 12.45, { from: .4, dy: 0, d: .8 });
      pulses.forEach((c, i) => { const e = A.NET.edges[(i * 7 + Math.floor((u * 1.6 + i * .37))) % A.NET.edges.length]; const f = (u * 1.6 + i * .37) % 1; c.setAttribute('cx', lerp(e[0].x, e[1].x, f)); c.setAttribute('cy', lerp(e[0].y, e[1].y, f) + 20); });
      nds.forEach((n, i) => { n.style.fill = Math.sin(u * 4 + i) > .6 ? '#5BE0FF' : '#1B2148'; });
      show(aiCard, u, 6.1, 12.45, { from: .4, dy: 40 });
      tiles.forEach((tl, i) => show(tl, u, [12.6, 15.45, 18.9, 22.32][i], 28.45, { from: .3, dy: 60, el: true, d: .8 }, { y: bob(u, i, 4) }));
      cb.forEach((c, i) => { c.style.opacity = clamp((u - 13.0 - i * .7) * 4); });
      const bp = E.out(P(u, 16.2, .5)); bbox.style.opacity = bp; btag.style.opacity = clamp((u - 16.5) * 4);
      lcv.style.strokeDashoffset = 100 - 100 * E.out(P(u, 19.4, 2.0)); lps.forEach((l, i) => { l.style.opacity = u > 19.6 + i * .35 ? 1 : 0; });
      dbs.forEach((d, i) => { d.style.transform = `scaleY(${E.back(P(u, 22.8 + i * .12, .6)) * (.9 + .1 * Math.sin(u * 3 + i))})`; });
      show(hd, u, 28.58, 41.5, { from: .5, dy: 30 });
      show(top, u, 29.4, 41.5, { from: .4, dy: -60, el: true, d: .8 }, { y: bob(u, 0, 5) });
      show(mid, u, 30.0, 41.5, { from: .3, dy: 0 }, { y: -8 * Math.abs(Math.sin(u * 4)) });
      show(bot, u, 28.7, 41.5, { from: .4, dy: 60 });
      show(n1, u, 32.59, 41.5, { from: .4, dy: 30 }); show(n2, u, 34.26, 41.5, { from: .4, dy: 30 });
      show(fin, u, 41.69, 48.2, { from: .3, dy: 60, el: true, d: .8 });
      orbit.forEach((o, i) => { const a = u * .8 + i * Math.PI / 2, l = life(u, 42.2 + i * .15, 48.2, { from: .2, dy: 0 }); tf(o, { x: Math.cos(a) * 330 - 65, y: Math.sin(a) * 80 + 30, s: l.s * (.8 + .2 * Math.sin(a)), o: l.o }); });
    }
    return draw;
  })();

  // =====================================================================
  // SCENE 7 — SUMMARY + NaiSibPro promo + end card
  // =====================================================================
  const SM = S('sum');
  const PROMO = 18.32, CTA = 30.46, ENDC = 34.1;
  mark('endcard', SM + ENDC);
  const sm = (() => {
    const sc = SC[6];
    const hdr = mk(sc, `<div class="abs c title-sticker" style="left:60px;width:960px;top:400px;text-align:center;font-size:72px">สรุป <span style="color:var(--hot)">5 ยุค</span> คอมพิวเตอร์</div>`);
    const NAMES = [['หลอดสุญญากาศ', 'Vacuum Tube'], ['ทรานซิสเตอร์', 'Transistor'], ['วงจรรวม IC', 'Integrated Circuit'], ['ไมโครโปรเซสเซอร์', 'Microprocessor'], ['ปัญญาประดิษฐ์ AI', 'Artificial Intelligence']];
    const rows = NAMES.map(([a, b], i) => mk(sc, `<div class="row c" style="left:70px;top:${520 + i * 122}px;transform-origin:0 50%"><div class="nb" style="background:${ERA[i + 1].dot}">${i + 1}</div>${A.eraIcon(i + 1, 80)}
      <div style="display:flex;flex-direction:column;line-height:1.1"><b>${a}</b><span class="sub" style="font-size:24px">${b}</span></div></div>`));
    const jr = at(sc, 70, 1150, `<div class="panel" style="position:relative;width:640px;height:150px;--ec:rgba(245,169,199,.6)"><div class="cap" style="top:22px;font-size:38px">จากเครื่อง<span style="color:#C9711F">ใหญ่เท่าห้อง</span></div><div class="cap" style="top:80px;font-size:38px">สู่ <span style="color:#4F82D0">AI</span> ที่อยู่ในมือเรา</div></div>`);
    const logo = at(sc, 80, 430, `<img src="../../shared/brand/logo.png" style="width:380px">`);
    const poster = at(sc, 500, 440, `<div style="width:440px;height:782px;border-radius:34px;overflow:hidden;box-shadow:0 24px 50px rgba(110,90,150,.3),0 0 0 8px #fff"><img src="../../shared/brand/poster.jpg" style="width:440px;height:782px;display:block"></div>`);
    const FT = [[ICON.docs(40), 'ข้อสอบครบ 6 วิชา'], [ICON.cal(40), 'อัปเดตทุกสัปดาห์'], [ICON.ai(40), 'AI วิเคราะห์ผล']];
    const feats = FT.map(([i, tx], k) => at(sc, 70, 845 + k * 82, `<div class="pill" style="font-size:32px;padding:8px 24px 8px 10px;background:#fff;color:var(--navy);box-shadow:0 8px 18px rgba(110,90,150,.18)"><div style="width:52px;height:52px;border-radius:50%;background:#FFF0F6;display:grid;place-items:center">${i}</div>${tx}</div>`, 'transform-origin:0 50%'));
    const cta = at(sc, 290, 1255, `<div style="position:relative;width:640px;display:flex;justify-content:center"><div class="pill" style="font-size:42px;font-weight:800;padding:18px 36px;color:#fff;background:linear-gradient(90deg,#EE7FAA,#F7A8C8);box-shadow:0 16px 34px rgba(238,127,170,.45),inset 0 4px 0 rgba(255,255,255,.4)">${ICON.link(46, '#fff')}คลิกลิงก์ที่หน้าโปรไฟล์</div>
      <div class="hand" style="position:absolute;left:470px;top:60px">${ICON.hand(100)}</div></div>`);
    const hand = cta.querySelector('.hand');
    const end = mk(sc, `<div class="abs" style="inset:0;background:linear-gradient(165deg,#FCE0EE 0%,#F3E7F8 45%,#D9E9FC 100%);visibility:hidden">
      <img class="ec-logo abs c" src="../../shared/brand/logo.png" style="width:500px;left:290px;top:330px">
      <div class="ec-word abs c wordmark" style="left:0;width:1080px;top:880px;text-align:center">NaiSibPro</div>
      <div class="ec-tag abs c title-sticker" style="left:40px;width:1000px;top:1070px;text-align:center;font-size:56px">ติววันละนิด พิชิตข้อสอบตำรวจ!</div>
      <div class="ec-fin abs c" style="left:70px;width:940px;top:1170px;display:flex;justify-content:center"><div class="pill" style="font-size:34px;padding:12px 30px;background:#fff;color:var(--deep);box-shadow:0 10px 22px rgba(110,90,150,.18)">5 ยุคคอมพิวเตอร์ · กับบ็อกซ์</div></div>
      <div class="ec-cta abs c" style="left:240px;width:740px;top:1270px;display:flex;justify-content:center"><div class="pill" style="font-size:40px;font-weight:800;padding:16px 34px;color:#fff;background:linear-gradient(90deg,#EE7FAA,#F7A8C8);box-shadow:0 16px 34px rgba(238,127,170,.45),inset 0 4px 0 rgba(255,255,255,.4)">${ICON.link(44, '#fff')}คลิกลิงก์ที่หน้าโปรไฟล์</div></div>
      <div class="ec-conf"></div></div>`);
    const q = s => end.querySelector(s);
    const conf = NSP.buildConfetti(q('.ec-conf'), 70, 540, 640);
    pop(SM + .3, .5); [3.59, 4.53, 6.06, 7.06, 8.42].forEach((x, i) => { pop(SM + x + .05, .6); sfx('tick', SM + x + .1, .3); });
    pop(SM + 12.0); sfx('success', SM + 12.9, .4);
    sfx('sparkle', SM + PROMO + .5, .6); [23.3, 24.0, 24.7].forEach(x => pop(SM + x, .5)); pop(SM + CTA + .1, .7); sfx('click', SM + CTA + 1.2, .7); sfx('click', SM + CTA + 2.6, .6);
    sfx('whoosh', SM + ENDC - .1, .7); sfx('ding', SM + ENDC + .25, .8); sfx('sparkle', SM + ENDC + .4, .9);
    bk(SM + .05, { x: 800, g: 1600, s: .95, P: 'explain', emo: 'happy', flip: true, finger: false, glow: 0, glasses: 0, d: .01 });
    bk(SM + 3.59, { P: 'present', emo: 'talk' });
    bk(SM + 9.2, { P: 'explain', emo: 'talk' });
    bk(SM + 11.93, { P: 'cheer', emo: 'laugh' });
    bk(SM + 14.54, { P: 'explain', emo: 'happy' });
    bk(SM + 16.76, { P: 'wai', emo: 'happy' });
    bk(SM + PROMO, { x: 240, g: 1600, s: .9, flip: false, P: 'idle', emo: 'happy', d: .01 });
    bk(SM + PROMO + .9, { P: 'point', finger: true, emo: 'talk' });
    bk(SM + 23.29, { P: 'explain', finger: false, emo: 'talk' });
    bk(SM + CTA, { x: 160, g: 1620, s: .8, P: 'pointSide', finger: true, emo: 'sparkle', d: .6 });
    bk(SM + ENDC, { x: 150, g: 1650, s: .62, P: 'wave', finger: false, emo: 'happy', d: .01 });
    function draw(t) {
      const u = t - SM;
      show(hdr, u, .1, PROMO - .2, { from: .4, dy: 40 });
      rows.forEach((r, i) => show(r, u, [3.59, 4.53, 6.06, 7.06, 8.42][i] + .05, PROMO - .2, { from: .3, dy: 0, el: true, d: .7 }, { x: -60 * (1 - E.out(P(u, [3.59, 4.53, 6.06, 7.06, 8.42][i], .5))) }));
      show(jr, u, 11.93, PROMO - .2, { from: .4, dy: 40 });
      const lg = life(u, PROMO + .2, ENDC, { from: .3, dy: 200, d: .9, el: true, out: .25 });
      tf(logo, { ...lg, y: lg.y + bob(u, 0, 8) });
      const pIn = E.out(P(u, PROMO + .5, .8));
      tf(poster, { x: lerp(200, 0, pIn), y: bob(u, 1, 6), r: lerp(14, 3, pIn), o: clamp((u - PROMO - .5) * 3) * (1 - P(u, ENDC, .2)) });
      feats.forEach((f, i) => show(f, u, 23.3 + i * .7, ENDC, { from: .3, dy: 0, el: true, d: .7 }, { x: -60 * (1 - E.out(P(u, 23.3 + i * .7, .5))) }));
      const cl = show(cta, u, CTA, ENDC, { from: .4, dy: 40, el: true, d: .8 }, { s: 1 + .04 * Math.sin(u * 6) });
      hand.style.transform = `translate(0,${bob(u, 0, 10, 6)}px) scale(${1 - .15 * NSP.pressDepth(u, [CTA + 1.2, CTA + 2.6])})`; hand.style.opacity = clamp((u - CTA - .6) / .2) * cl.o;
      const ue = u - ENDC;
      end.style.visibility = ue < 0 ? 'hidden' : 'visible';
      end.style.clipPath = `circle(${E.out(P(ue, 0, .5)) * 1300}px at 540px 900px)`;
      const l2 = life(ue, .15, 1e9, { from: .2, dy: 0, el: true, d: 1.0 });
      tf(q('.ec-logo'), { ...l2, y: bob(ue, 0, 8), r: Math.sin(ue * 1.8) * 2 });
      tf(q('.ec-word'), life(ue, .4, 1e9, { from: .5, dy: 50 }));
      tf(q('.ec-tag'), life(ue, .65, 1e9, { from: .5, dy: 50 }));
      tf(q('.ec-fin'), life(ue, .85, 1e9, { from: .5, dy: 40 }));
      const ct = life(ue, 1.05, 1e9, { from: .5, dy: 50 });
      tf(q('.ec-cta'), { ...ct, s: ct.s * (1 + .04 * Math.sin(ue * 6)) });
      NSP.drawConfetti(conf, t, SM + ENDC + .3, 2.8);
    }
    return draw;
  })();

  // =====================================================================
  // start
  // =====================================================================
  buildBox();
  const bounds = SEG.map(S).concat([END + 1]);
  const draws = [hk, g1, g2, g3, g4, g5, sm];
  NSP.start({
    scenes: SC.map((el, i) => ({ el, a: bounds[i], b: bounds[i + 1], draw: draws[i] })),
    wipes: [SM, SM + PROMO],
    brand: { showAt: 1.0, hideAt: SM + ENDC },
    ep: 'EP.34 SPECIAL',
  });
  const base = window.renderAt;
  window.renderAt = function (t) {
    base(t); drawEra(t); drawHud(t); drawWarp(t); drawBox(t);
  };
})();
