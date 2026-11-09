// EP.46 scenes — Flowchart Symbols: The Exam Decision Challenge.
// Audio-first: every beat is TL[segment][0] + BEATS[segment][phrase]. Deterministic renderAt(t).
(function () {
  const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark } = NSP;
  const T = window.TL, B = window.BEATS, SPEC = window.SPEC, DL = window.DL, FS = window.FS;
  FS.installDefs();
  const S0 = k => T[k][0];
  const fin = (u, a, d = .4) => clamp((u - a) / d);
  const fout = (u, b, d = .3) => 1 - clamp((u - b) / d);
  const add = (parent, html) => { parent.insertAdjacentHTML('beforeend', html.trim()); return parent.lastElementChild; };
  const q = (root, s) => root.querySelector(s);
  // sequential keyframe track: keys [[t, {x,y,s,r,o}, dur?], ...] sorted by t
  function track(u, keys, d0 = .7) {
    const v = { x: 0, y: 0, s: 1, r: 0, o: 1, ...keys[0][1] };
    for (let i = 1; i < keys.length; i++) {
      const [kt, kv, kd] = keys[i]; const p = E.inOut(P(u, kt, kd ?? d0)); if (p <= 0) break;
      for (const k in kv) v[k] = lerp(v[k], kv[k], p);
    }
    return v;
  }
  const show = (el, o, extra = {}) => tf(el, { ...extra, o });
  const SH_TH = { terminator: 'วงรี', process: 'สี่เหลี่ยมผืนผ้า', io: 'สี่เหลี่ยมด้านขนาน', decision: 'สี่เหลี่ยมข้าวหลามตัด' };
  const ICON2 = {
    monitor: (s, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="13" rx="2" fill="none" stroke="${c}" stroke-width="2.2"/><path d="M8 21h8M12 16v5" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    like: (s, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M7 10v11H3V10zM7 10l4-8a3 3 0 0 1 3 3v4h6a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 18.6 21H7" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
    share: (s, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M14 4l7 7-7 7v-4c-6 0-9 2-11 6 1-6 4-11 11-12z" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
    bell: (s, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4zM10 21h4" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round" stroke-linecap="round"/></svg>`,
    chat: (s, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 4h16v12H9l-5 4z" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/><path d="M8 9h8M8 12.5h5" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`,
  };

  // ======================= BACKGROUND: blue grid, ghost symbols, data sparks =======================
  const bgEl = add($('bg'), `<div id="fcbg"><div class="grid2"></div><div class="grid"></div><div class="vig"></div></div>`);
  const ghosts = [], sparks = [];
  { const kinds = ['terminator', 'process', 'io', 'decision', 'connector'];
    for (let i = 0; i < 9; i++) {
      const k = kinds[i % 5], w = k === 'connector' ? 70 : 150 + NSP.rnd() * 90, hh = k === 'connector' ? 70 : k === 'decision' ? w * .62 : w * .42;
      const el = add(bgEl, `<div class="ghost">${FS.mini(k, w, hh, { sw: 3, stroke: '#5FA8FF', fill: 'none' })}</div>`);
      ghosts.push({ el, x: NSP.rnd() * 1080 - 60, y: NSP.rnd() * 1920, sp: 10 + NSP.rnd() * 16, ph: NSP.rnd() * 6.28, r: (NSP.rnd() - .5) * 20 });
    }
    for (let i = 0; i < 14; i++) {
      const el = add(bgEl, `<div class="spark"></div>`); const vert = i % 2 === 0;
      sparks.push({ el, vert, lane: Math.floor(NSP.rnd() * (vert ? 9 : 16)) * 120 - 2, sp: 140 + NSP.rnd() * 160, ph: NSP.rnd() * 3000 });
    }
  }
  function drawBg(t) {
    const g = bgEl.querySelectorAll('.grid,.grid2');
    g.forEach((el, i) => { el.style.transform = `translate(${(t * (i ? 6 : 3)) % 120}px,${(t * (i ? 14 : 7)) % 120}px)`; });
    ghosts.forEach(p => { let y = (p.y - t * p.sp) % 2100; if (y < -200) y += 2100; tf(p.el, { x: p.x + Math.sin(t * .3 + p.ph) * 30, y, r: p.r + Math.sin(t * .2 + p.ph) * 6, o: 1 }); });
    sparks.forEach(s => {
      const span = s.vert ? 2100 : 1300, d = (s.ph + t * s.sp) % span - 100;
      const tr = s.vert ? `translate(${s.lane}px,${d}px)` : `translate(${d}px,${s.lane}px)`;
      s.el.style.transform = tr; s.el.style.opacity = .55 + .35 * Math.sin(t * 2 + s.ph);
    });
  }

  // ======================= SCENE 1 — HOOK: FLOWCHART SYMBOL MYSTERY =======================
  function buildHook() {
    const el = $('sHook'), H = B.hook, a0 = S0('hook');
    const pill = add(el, `<div class="col center" style="top:360px;height:90px"><div class="pillb" style="font-size:52px">เตรียมสอบนายสิบ</div></div>`);
    const subj = add(el, `<div class="col center c" style="top:462px;height:64px"><div class="chip" style="position:relative;font-size:34px">${ICON2.monitor(40)}วิชาคอมพิวเตอร์</div></div>`);
    const head = add(el, `<div class="col c" style="top:540px;text-align:center;line-height:1.05"><div class="glowtx" style="font-size:96px">สัญลักษณ์</div><div class="glowtx" style="font-size:96px;color:#22D3EE">Flowchart</div></div>`);
    const sub = add(el, `<div class="col c" style="top:770px;text-align:center"><span class="glowtx y" style="font-size:60px;color:#FFD23F">รูปไหนใช้ทำอะไร?</span></div>`);
    // hero shapes (centre-origin nodes, moved by transforms)
    const K = ['terminator', 'process', 'io', 'decision'];
    const SZ = { terminator: [250, 96], process: [240, 110], io: [250, 100], decision: [250, 156] };
    const cards = K.map(() => add(el, `<div class="panel c" style="left:0;top:0;width:310px;height:290px"></div>`));
    const names = K.map(k => add(el, `<div class="abs c th" style="left:0;top:0;width:310px;text-align:center;font-size:${k === 'decision' ? 33 : 36}px">${SH_TH[k]}</div>`));
    const shapes = K.map(k => add(el, FS.node(k, { w: SZ[k][0], h: SZ[k][1], cx: 0, cy: 0, label: '' })));
    const qmark = add(el, `<div class="bigq c" style="left:-60px;top:-90px;width:120px;text-align:center;font-size:150px;line-height:180px">?</div>`);
    const big = add(el, `<div class="col c" style="top:780px;text-align:center;line-height:1.1"><div class="en" style="font-size:86px;letter-spacing:5px">FLOWCHART</div><div class="glowtx" style="font-size:110px">ผังงาน</div></div>`);
    const loop = add(el, `<svg class="abs" width="1080" height="1920" style="left:0;top:0"><path d="M330,600 H750 V1300 H330 Z" fill="none" stroke="#22D3EE" stroke-width="5" stroke-dasharray="18 16" opacity=".55"/></svg>`);
    const askIn = add(el, `<div class="chip c" style="left:0;top:0;font-size:36px;border-color:#FFD23F">ใช้รับข้อมูล?</div>`);
    const askDec = add(el, `<div class="chip c" style="left:0;top:0;font-size:36px;border-color:#FFD23F">ใช้ตัดสินใจ?</div>`);
    const bigQ = add(el, `<div class="bigq c" style="left:440px;top:1120px;width:200px;text-align:center;font-size:230px;line-height:260px">?</div>`);
    // grid cells for phase B
    const GX = [375, 705], GY = [870, 1180];
    const cell = i => [GX[i % 2], GY[Math.floor(i / 2)]];
    const tIn = [H.oval, H.rect, H.para, H.dia];
    const HERO = [[365, 1000, .95, -6, .55], [722, 990, .95, 5, .55], [390, 1300, .95, -4, .55], [550, 1130, 1.6, 0, 1]];
    const ORBIT = [[330, 600], [750, 600], [330, 1300], [750, 1300]];
    // phase D layout: io left, decision right; oval & rect dim small at the bottom
    const QD = [[300, 1330, .62, 0, .35], [780, 1330, .62, 0, .35], [380, 960, 1.15, 0, 1], [705, 960, 1.15, 0, 1]];
    tIn.forEach((x, i) => { sfx('pop', a0 + x + .05, .7); });
    sfx('whoosh', a0 + H.flow - .1, .6); sfx('sparkle', a0 + H.flow + .2, .6);
    sfx('pop', a0 + H.qIn + .1, .8); sfx('pop', a0 + H.qDec + .1, .8); sfx('ding', a0 + H.q2 + .1, .5);
    function draw(t) {
      const u = t - a0;
      show(pill, 1, { s: 1 + .02 * Math.sin(u * 2.4) });
      tf(subj, { ...life(u, H.subject, 1e9, { from: .5, dy: 20, d: .45 }) });
      const hp = track(u, [[0, { y: 0, s: 1, o: 1 }], [H.oval - .3, { y: -40, s: .8, o: 0 }, .4], [H.flow - .2, { o: 0, s: .7 }, .4]]);
      tf(head, { y: hp.y + (u < .5 ? 0 : 0), s: hp.s, o: hp.o });
      tf(sub, { o: fout(u, H.oval - .3, .3), s: 1 + .03 * Math.sin(u * 3) });
      shapes.forEach((sh, i) => {
        const k = K[i], hero = HERO[i], [gx, gy] = cell(i), ti = tIn[i];
        const keys = [[0, { x: hero[0], y: hero[1], s: hero[2], r: hero[3], o: hero[4] }],
          [ti, { x: gx, y: gy - 30, s: 1, r: 0, o: 1 }, .6],
          [H.flow, { x: ORBIT[i][0], y: ORBIT[i][1], s: .85 }, .8],
          [H.ask + .2, { x: QD[i][0], y: QD[i][1], s: QD[i][2], o: QD[i][4] }, .8]];
        const v = track(u, keys);
        const fl = u > H.flow && u < H.ask + .6 ? bob(u, i * 1.4, 10) : 0;
        tf(sh, { x: v.x, y: v.y + fl + (i === 3 && u < H.dia ? bob(u, 0, 8, 1.4) : 0), s: v.s * (i === 3 && u < H.dia ? 1 + .03 * Math.sin(u * 3) : 1), r: v.r, o: v.o });
        let tone = 'idle', glow = .3;
        if (i === 3 && u < H.oval) { tone = 'hot'; glow = .7 + .3 * Math.sin(u * 4); }
        if (u >= ti && u < ti + .9 && u < H.flow) { tone = 'hot'; glow = 1; }
        if (u >= H.qIn && i === 2) { tone = 'hot'; glow = .6 + .4 * Math.sin(u * 5); }
        if (u >= H.qDec && i === 3) { tone = 'hot'; glow = .6 + .4 * Math.sin(u * 5 + 1); }
        FS.setState(sh, { tone, glow });
        const cl = life(u, ti - .05, H.flow - .1, { from: .6, dy: 30, d: .5 });
        tf(cards[i], { x: gx - 155, y: gy - 175 + cl.y, s: cl.s, o: cl.o });
        tf(names[i], { x: gx - 155, y: gy + 50 + cl.y, s: cl.s, o: cl.o });
      });
      tf(qmark, { x: 560, y: 1130 + bob(u, 0, 8, 1.4), o: fout(u, H.dia - .2, .3), s: 1 + .06 * Math.sin(u * 3) });
      tf(big, { ...life(u, H.flow, H.ask, { from: .5, dy: 40, d: .6 }) });
      loop.style.opacity = fin(u, H.flow + .3, .5) * fout(u, H.ask, .3);
      loop.querySelector('path').style.strokeDashoffset = -u * 60;
      const ai = life(u, H.qIn + .1, 1e9, { from: .4, dy: 30 }); tf(askIn, { x: 380 - 120, y: 1075 + ai.y, s: ai.s, o: ai.o });
      const ad = life(u, H.qDec + .1, 1e9, { from: .4, dy: 30 }); tf(askDec, { x: 705 - 112, y: 1075 + ad.y, s: ad.s, o: ad.o });
      const bq = life(u, H.q2, 1e9, { from: .2, dy: 0, el: true, d: .8 });
      tf(bigQ, { ...bq, s: bq.s * (1 + .05 * Math.sin(u * 4)), r: Math.sin(u * 2) * 6 });
    }
    // phase-D question header (re-uses the subject chip position)
    return { a: 0, b: S0('story'), el, draw };
  }

  // ======================= SCENE 2 — PROGRAM SCENARIO =======================
  function buildStory() {
    const el = $('sStory'), H = B.story, a0 = S0('story');
    const mon = add(el, `<div class="abs c" style="left:220px;top:370px;width:640px;height:500px">
      <div style="position:absolute;left:0;top:0;width:640px;height:420px;border-radius:34px;background:#0B1A36;box-shadow:0 0 0 4px #2F6BFF,0 0 40px rgba(47,107,255,.45)"></div>
      <div class="scr" style="left:18px;top:18px;width:604px;height:384px">
        <div style="height:64px;background:linear-gradient(90deg,#2F6BFF,#22D3EE);display:flex;align-items:center;gap:12px;padding:0 22px;font-weight:800;font-size:32px;color:#fff">
          <span style="width:16px;height:16px;border-radius:50%;background:#fff;opacity:.8"></span><span style="width:16px;height:16px;border-radius:50%;background:#fff;opacity:.55"></span><span class="m-title" style="margin-left:10px">โปรแกรมตรวจผลสอบ</span></div>
        <div style="padding:30px 34px">
          <div style="font-weight:700;font-size:34px;color:#95BFEF">กรอกคะแนนสอบ</div>
          <div class="m-box" style="margin-top:14px;height:96px;border-radius:20px;background:#E6F4FF;display:flex;align-items:center;padding:0 26px;font-weight:800;font-size:64px;color:#142B53"><span class="m-num"></span><span class="caret"></span></div>
          <div class="m-btn" style="margin-top:22px;display:inline-block;padding:10px 34px;border-radius:24px;background:#2F6BFF;color:#fff;font-weight:800;font-size:32px">ตรวจผล</div>
        </div></div>
      <div style="position:absolute;left:270px;top:420px;width:100px;height:46px;background:linear-gradient(180deg,#1C3D7A,#142B53)"></div>
      <div style="position:absolute;left:190px;top:462px;width:260px;height:20px;border-radius:10px;background:#2F6BFF"></div></div>`);
    const cIn = add(el, `<div class="col center c" style="top:910px;height:100px"><div class="pillb" style="font-size:44px"><span class="n">1</span>รับคะแนนจากผู้ใช้</div></div>`);
    const cmp = add(el, `<div class="panel c" style="left:230px;top:900px;width:620px;height:190px;text-align:center">
      <div class="glowtx" style="font-size:82px;line-height:1.3;margin-top:6px">คะแนน ≥ <span class="y">60</span> ?</div>
      <div class="cmp-note th" style="font-size:30px;color:#95BFEF">ตั้งแต่ 60 ขึ้นไป = <span class="y">รวม 60 ด้วย</span></div></div>`);
    const pass = add(el, `<div class="panel c" style="left:220px;top:1120px;width:305px;height:290px;text-align:center;box-shadow:0 0 0 4px #22C55E,0 0 40px rgba(34,197,94,.35)">
      <div style="margin:24px auto 0;width:84px;height:84px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${ICON.check('#fff', 54)}</div>
      <div style="font-weight:800;font-size:72px;color:#fff;line-height:1.3">ผ่าน</div><div class="th" style="font-size:28px;color:#4ADE80">ถึงเกณฑ์ ≥ 60</div></div>`);
    const fail = add(el, `<div class="panel c" style="left:555px;top:1120px;width:305px;height:290px;text-align:center;box-shadow:0 0 0 4px #EF4444,0 0 40px rgba(239,68,68,.3)">
      <div style="margin:24px auto 0;width:84px;height:84px;border-radius:50%;background:#EF4444;display:grid;place-items:center">${ICON.cross('#fff', 50)}</div>
      <div style="font-weight:800;font-size:72px;color:#fff;line-height:1.3">ไม่ผ่าน</div><div class="th" style="font-size:28px;color:#F87171">ต่ำกว่า 60</div></div>`);
    const ask = add(el, `<div class="col c" style="top:400px;text-align:center;line-height:1.2"><div class="glowtx" style="font-size:74px">เราจะใช้</div><div class="glowtx y" style="font-size:80px;color:#FFD23F">รูปอะไรบ้าง?</div></div>`);
    const K = ['terminator', 'process', 'io', 'decision'];
    const SZ = { terminator: [250, 100], process: [240, 120], io: [260, 110], decision: [260, 170] };
    const GX = [375, 705], GY = [870, 1190];
    const slots = K.map((k, i) => add(el, `<div class="panel c" style="left:${GX[i % 2] - 155}px;top:${GY[i >> 1] - 140}px;width:310px;height:280px"></div>`));
    const shapes = K.map((k, i) => add(el, FS.node(k, { w: SZ[k][0], h: SZ[k][1], cx: GX[i % 2], cy: GY[i >> 1], label: '' })));
    const ring = add(el, `<div class="abs" style="left:0;top:0;width:330px;height:300px;border-radius:44px;box-shadow:0 0 0 6px #22D3EE,0 0 40px rgba(34,211,238,.7);visibility:hidden"></div>`);
    const qm = add(el, `<div class="bigq c" style="left:470px;top:960px;width:140px;text-align:center;font-size:150px;line-height:180px">?</div>`);
    const typeAt = [H.input + .7, H.input + 1.0];
    typeAt.forEach(x => sfx('key', a0 + x, 1)); sfx('pop', a0 + H.input + .1, .7);
    sfx('whoosh', a0 + H.check - .05, .5); sfx('pop', a0 + H.check3 + .1, .5);
    sfx('success', a0 + H.pass + .1, .7); sfx('buzz', a0 + H.fail + .1, .6);
    sfx('whoosh', a0 + H.ask - .05, .6);
    for (let i = 0; i < 4; i++) sfx('pop', a0 + H.ask + .2 + i * .14, .5);
    const hopT = [0, .5, 1, 1.5, 2.0, 2.5]; hopT.forEach(x => sfx('click', a0 + H.which + x, .6));
    function draw(t) {
      const u = t - a0;
      const gone = fout(u, H.ask - .1, .4);
      const ml = life(u, H.prog, 1e9, { from: .6, dy: 60, d: .6 });
      tf(mon, { ...ml, o: ml.o * gone, s: ml.s * lerp(.85, 1, gone) });
      const typed = u >= typeAt[1] ? '72' : u >= typeAt[0] ? '7' : '';
      q(mon, '.m-num').textContent = typed;
      q(mon, '.caret').style.opacity = (Math.floor(u * 2.2) % 2 === 0 || (u > H.input && u < H.input + 1.6)) ? 1 : 0;
      q(mon, '.m-box').style.boxShadow = u > H.input && u < H.check ? `0 0 0 5px #22D3EE,0 0 ${24 + 10 * Math.sin(u * 6)}px rgba(34,211,238,.8)` : 'none';
      q(mon, '.m-btn').style.boxShadow = u > H.check && u < H.check + .5 ? '0 0 0 5px #FFD23F' : 'none';
      tf(cIn, life(u, H.input + .1, H.check - .1, { from: .5, dy: 30 }));
      const cl = life(u, H.check, H.ask - .1, { from: .5, dy: 30, d: .55 }); tf(cmp, cl);
      q(cmp, '.cmp-note').style.opacity = fin(u, H.check3, .4);
      tf(pass, life(u, H.pass, H.ask - .1, { from: .4, dy: 50, el: true, d: .8 }));
      tf(fail, life(u, H.fail, H.ask - .1, { from: .4, dy: 50, el: true, d: .8 }));
      tf(ask, life(u, H.ask, 1e9, { from: .5, dy: 40 }));
      let hop = -1;
      if (u >= H.which && u < H.go) hop = Math.floor((u - H.which) / .5) % 4;
      shapes.forEach((s, i) => {
        const l = life(u, H.ask + .2 + i * .14, 1e9, { from: .3, dy: 40, el: true, d: .8 });
        const allPulse = u >= H.go;
        tf(s, { ...l, y: l.y + bob(u, i, 6), s: l.s * (hop === i ? 1.08 : 1) * (allPulse ? 1 + .04 * Math.sin(u * 5 + i) : 1) });
        FS.setState(s, { tone: hop === i || allPulse ? 'hot' : 'idle', glow: hop === i ? 1 : .4 });
        tf(slots[i], { ...l, s: l.s, o: l.o * .9 });
      });
      if (hop >= 0) { tf(ring, { x: GX[hop % 2] - 165, y: GY[hop >> 1] - 150, o: 1 }); } else tf(ring, { o: 0 });
      tf(qm, { ...life(u, H.go, 1e9, { from: .2, dy: 0, el: true, d: .8 }), r: Math.sin(u * 2) * 6 });
    }
    return { a: a0, b: S0('know'), el, draw };
  }

  // ======================= SCENE 3 — FOUR MAIN SYMBOLS =======================
  function buildKnow() {
    const el = $('sKnow'), H = B.know, a0 = S0('know');
    const hdr = add(el, `<div class="col center c" style="top:360px;height:90px"><div class="pillb" style="font-size:44px"><span class="n">4</span>สัญลักษณ์หลัก</div></div>`);
    const K = ['terminator', 'process', 'io', 'decision'];
    const tabs = K.map((k, i) => add(el, `<div class="abs c" style="left:${232 + i * 156}px;top:470px;width:146px;height:74px;display:grid;place-items:center;border-radius:20px;background:rgba(14,33,71,.9);box-shadow:0 0 0 2px rgba(95,168,255,.45)">${FS.mini(k, k === 'decision' ? 90 : 100, k === 'decision' ? 56 : 44, { sw: 4 })}</div>`));
    const tIn = [H.term, H.proc, H.io, H.dec], tOut = [H.proc, H.io, H.dec, H.review];
    const SZ = { terminator: [440, 150], process: [440, 170], io: [470, 160], decision: [440, 270] };
    const LBL = { terminator: 'START', process: 'คำนวณ', io: 'รับ / แสดง', decision: 'คะแนน ≥ <span class="y">60</span> ?' };
    const big = K.map(k => add(el, FS.node(k, { w: SZ[k][0], h: SZ[k][1], cx: 540, cy: 720, label: LBL[k], fs: k === 'decision' ? 40 : 54 })));
    const EN = ['START / END', 'PROCESS', 'INPUT / OUTPUT', 'DECISION'];
    const THL = ['เริ่มต้น / สิ้นสุด', 'การประมวลผล', 'รับข้อมูล / แสดงผล', 'ตรวจเงื่อนไข / ตัดสินใจ'];
    const lab = K.map((k, i) => add(el, `<div class="col c" style="top:890px;text-align:center"><div class="en" style="font-size:${i === 2 ? 52 : 62}px">${EN[i]}</div><div class="th" style="font-size:${i === 3 ? 44 : 50}px;margin-top:4px">${THL[i]}</div></div>`));
    // demo panel contents
    const demo = add(el, `<div class="panel c" style="left:230px;top:1090px;width:620px;height:320px"></div>`);
    // term demo: START → END mini flow with pulse
    const dTerm = add(el, `<div class="abs" style="left:230px;top:1090px;width:620px;height:320px">
      ${FS.node('terminator', { w: 210, h: 84, cx: 150, cy: 160, label: 'เริ่มต้น', fs: 34 })}${FS.node('terminator', { w: 210, h: 84, cx: 490, cy: 160, label: 'สิ้นสุด', fs: 34 })}
      <svg class="abs" width="640" height="320" style="left:0;top:0;overflow:visible"><path d="M262,160H372" stroke="#3F78E8" stroke-width="7" stroke-dasharray="14 12"/><path d="M366,146L388,160L366,174Z" fill="#3F78E8"/></svg>
      <div class="tdot" style="position:absolute;left:0;top:0;width:26px;height:26px;margin:-13px;border-radius:50%;background:#E6FDFF;box-shadow:0 0 20px 6px #22D3EE"></div></div>`);
    // process demo: numbers fly into the rectangle
    const dProc = add(el, `<div class="abs" style="left:230px;top:1090px;width:620px;height:320px">
      <div class="th" style="position:absolute;left:0;right:0;top:40px;text-align:center;font-size:34px">คะแนนรวม = คะแนน A + คะแนน B</div>
      <div class="chip pA" style="left:110px;top:150px;font-size:44px">A = 30</div><div class="chip pB" style="left:370px;top:150px;font-size:44px">B = 42</div>
      <div class="pR glowtx" style="position:absolute;left:0;right:0;top:140px;text-align:center;font-size:76px">= <span class="y">72</span></div></div>`);
    const dIO = add(el, `<div class="abs" style="left:230px;top:1090px;width:620px;height:320px">
      <div class="io1 abs" style="left:0;top:34px;width:320px;text-align:center"><span class="pillb" style="font-size:32px;padding:6px 24px">INPUT</span><div class="th" style="font-size:36px;margin-top:14px">รับคะแนน</div><div class="glowtx y" style="font-size:54px;color:#FFD23F">75</div></div>
      <div class="io2 abs" style="left:320px;top:34px;width:320px;text-align:center"><span class="pillb gn" style="font-size:32px;padding:6px 24px">OUTPUT</span><div class="th" style="font-size:36px;margin-top:14px">แสดงผลบนจอ</div></div>
      <div class="abs" style="left:319px;top:30px;width:3px;height:260px;background:rgba(149,191,239,.3)"></div></div>`);
    const in75 = add(el, `<div class="chip c" style="left:0;top:0;font-size:52px;border-color:#FFD23F">75</div>`);
    const outCard = add(el, `<div class="abs c" style="left:0;top:0;width:200px;height:120px;border-radius:20px;background:#0B1A36;box-shadow:0 0 0 4px #22C55E,0 0 30px rgba(34,197,94,.6);display:grid;place-items:center;font-weight:800;font-size:58px;color:#4ADE80">ผ่าน</div>`);
    const dDec = add(el, `<div class="abs" style="left:230px;top:1090px;width:620px;height:320px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">
      <div class="th" style="font-size:38px">มีคำถาม → ต้องเลือกทาง</div><div class="glowtx" style="font-size:44px">แยกได้ <span class="y">2 ทาง</span></div></div>`);
    const branches = add(el, `<svg class="abs" width="1080" height="1920" style="left:0;top:0;overflow:visible">
      <path class="bl" d="M320,720H262V880" fill="none" stroke="#22D3EE" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path class="bh1" d="M248,862L262,890L276,862Z" fill="#22D3EE"/>
      <path class="br" d="M760,720H818V880" fill="none" stroke="#22D3EE" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/><path class="bh2" d="M804,862L818,890L832,862Z" fill="#22D3EE"/></svg>`);
    const rev = K.map((k, i) => add(el, `<div class="panel c" style="left:${i % 2 ? 550 : 220}px;top:${i < 2 ? 580 : 910}px;width:310px;height:310px;text-align:center">
      <div style="height:150px;display:grid;place-items:center;margin-top:14px">${FS.mini(k, k === 'decision' ? 200 : 220, k === 'decision' ? 124 : 96, { sw: 5, stroke: '#22D3EE' })}</div>
      <div class="en" style="font-size:${i === 2 ? 26 : 34}px">${EN[i]}</div><div class="th" style="font-size:${i === 3 ? 30 : 32}px">${['เริ่มต้น / สิ้นสุด', 'ประมวลผล', 'รับข้อมูล / แสดงผล', 'ตรวจเงื่อนไข'][i]}</div></div>`));
    const blen = 58 + 160;
    branches.querySelectorAll('.bl,.br').forEach(p => { p.style.strokeDasharray = `${blen} ${blen}`; });
    tIn.forEach((x, i) => { sfx('whoosh', a0 + x - .1, .5); sfx('pop', a0 + x + .1, .8); });
    sfx('coin', a0 + H.proc2 + .4, .6); sfx('coin', a0 + H.proc2 + .6, .6); sfx('ding', a0 + H.proc2 + 1.3, .6);
    sfx('pop', a0 + H.io + .6, .6); sfx('success', a0 + H.io2 + .7, .5);
    sfx('zip', a0 + H.dec2 + .1, .5);
    for (let i = 0; i < 4; i++) sfx('pop', a0 + H.review + .1 + i * .2, .6);
    function draw(t) {
      const u = t - a0;
      tf(hdr, life(u, H.intro, 1e9, { from: .5, dy: 30 }));
      let cur = -1; tIn.forEach((x, i) => { if (u >= x && u < tOut[i]) cur = i; });
      tabs.forEach((tb, i) => {
        const l = life(u, H.intro + .15 + i * .1, H.review - .1, { from: .5, dy: 20 });
        tf(tb, { ...l, s: l.s * (cur === i ? 1.08 : 1) });
        tb.style.boxShadow = cur === i ? '0 0 0 4px #22D3EE,0 0 26px rgba(34,211,238,.6)' : '0 0 0 2px rgba(95,168,255,.45)';
        tb.style.opacity = (cur === i ? 1 : u >= tIn[i] ? .85 : .5) * l.o;
      });
      big.forEach((b, i) => {
        const a = tIn[i], z = tOut[i];
        const pi = E.back(P(u, a, .6)), po = E.inOut(P(u, z - .05, .45));
        const vis = u >= a && u < z + .5;
        tf(b, { x: (1 - E.out(P(u, a, .6))) * 360 - po * 380, y: bob(u, i, 6), s: lerp(.5, 1, pi) * (1 - .3 * po), o: vis ? clamp((u - a) * 3) * (1 - po) : 0 });
        FS.setState(b, { tone: 'hot', glow: .55 + .45 * Math.sin(u * 3.2) });
        tf(lab[i], { ...life(u, a + .3, z - .1, { from: .6, dy: 30, d: .5 }) });
      });
      // START → END label swap on the oval
      q(big[0], '.lb').innerHTML = '<span>' + (u < H.term + 2.2 ? 'START' : 'END') + '</span>';
      tf(demo, life(u, H.term + .5, H.review - .1, { from: .7, dy: 40 }));
      const dv = (i) => fin(u, tIn[i] + .7, .4) * fout(u, tOut[i] - .1, .3);
      show(dTerm, dv(0));
      { const k = ((u - H.term - 1) % 1.6 + 1.6) % 1.6 / 1.2; const x = lerp(262, 390, clamp(k)); tf(q(dTerm, '.tdot'), { x, y: 160, o: k < 1 ? 1 : 0 }); }
      show(dProc, dv(1));
      { const k = E.inOut(P(u, H.proc2 + .1, .7)); tf(q(dProc, '.pA'), { x: lerp(0, 55, k), y: lerp(0, -555, k), s: lerp(1, .5, k), o: 1 - P(u, H.proc2 + .6, .2) });
        tf(q(dProc, '.pB'), { x: lerp(0, -85, k), y: lerp(0, -555, k), s: lerp(1, .5, k), o: 1 - P(u, H.proc2 + .6, .2) });
        tf(q(dProc, '.pR'), { ...life(u, H.proc2 + 1.2, 1e9, { from: .4, dy: 20, el: true, d: .7 }) });
        q(big[1], '.lb').innerHTML = '<span>' + (u < H.proc2 + .8 ? 'คำนวณ' : u < H.proc2 + 1.2 ? '30<i class="pl"></i>42' : 'รวม = <span class="y">72</span>') + '</span>';
        if (u > H.proc2 + .75 && u < H.proc2 + 1.3) FS.setState(big[1], { tone: 'hot', glow: 1 }); }
      show(dIO, dv(2));
      q(dIO, '.io1').style.opacity = fin(u, H.io + .5, .3); q(dIO, '.io2').style.opacity = fin(u, H.io2 + .3, .3);
      { const k = E.inOut(P(u, H.io + .5, .9)); tf(in75, { x: lerp(60, 470, k), y: 680, s: lerp(1, .4, k), o: fin(u, H.io + .4, .2) * (1 - P(u, H.io + 1.3, .2)) });
        const k2 = E.out(P(u, H.io2 + .4, .8)); tf(outCard, { x: lerp(440, 600, k2), y: lerp(660, 1262, k2) - 60 * Math.sin(k2 * Math.PI), s: lerp(.3, 1.2, k2), o: fin(u, H.io2 + .4, .15) * fout(u, H.dec - .1, .3) });
        if (u > H.io + 1.2 && u < H.io + 1.7) FS.setState(big[2], { tone: 'hot', glow: 1 }); }
      show(dDec, dv(3));
      { const k = E.inOut(P(u, H.dec2 + .1, .8)); const o = fin(u, H.dec2, .1) * fout(u, H.review - .1, .3);
        branches.style.opacity = o;
        branches.querySelectorAll('.bl,.br').forEach(p => p.style.strokeDashoffset = blen * (1 - k));
        branches.querySelectorAll('.bh1,.bh2').forEach(p => p.style.opacity = clamp((k - .85) / .15)); }
      rev.forEach((r, i) => tf(r, life(u, H.review + .1 + i * .2, 1e9, { from: .4, dy: 40, el: true, d: .8 })));
    }
    return { a: a0, b: S0('expl'), el, draw };
  }

  // ======================= SCENE 4 — FLOWLINES, CONNECTORS, MEMORY TECHNIQUE =======================
  function buildExpl() {
    const el = $('sExpl'), H = B.expl, a0 = S0('expl');
    const hdr1 = add(el, `<div class="col center c" style="top:360px;height:90px"><div class="pillb" style="font-size:44px">ลูกศร &amp; จุดเชื่อมต่อ</div></div>`);
    const hdr2 = add(el, `<div class="col center c" style="top:360px;height:90px"><div class="pillb yl" style="font-size:44px">เทคนิคจำง่าย ๆ</div></div>`);
    const rect = add(el, FS.node('process', { w: 300, h: 110, cx: 0, cy: 0, label: 'คำนวณ', fs: 42 }));
    const para = add(el, FS.node('io', { w: 320, h: 110, cx: 0, cy: 0, label: 'แสดงผล', fs: 42 }));
    const lines = add(el, `<svg class="abs" width="1080" height="1920" style="left:0;top:0;overflow:visible">
      <path class="Lg" fill="none" stroke="#3F78E8" stroke-width="8" stroke-linecap="round"/><path class="Lp" fill="none" stroke="#E6FDFF" stroke-width="9" stroke-linecap="round" style="filter:drop-shadow(0 0 12px #22D3EE)"/>
      <path class="Lh" fill="#22D3EE"/>
      <path class="L1" d="M380,620V756" fill="none" stroke="#3F78E8" stroke-width="8" stroke-linecap="round"/><path class="L1h" d="M366,752L380,778L394,752Z" fill="#3F78E8"/>
      <path class="L2" d="M700,678V780" fill="none" stroke="#3F78E8" stroke-width="8" stroke-linecap="round"/><path class="L2h" d="M686,778L700,804L714,778Z" fill="#3F78E8"/>
      <path class="Lj" d="M426,820 C 520,700 560,700 654,630" fill="none" stroke="#22D3EE" stroke-width="5" stroke-dasharray="10 14"/>
      <circle class="Pd" r="14" fill="#E6FDFF" style="filter:drop-shadow(0 0 12px #22D3EE)"/></svg>`);
    const cA1 = add(el, FS.node('connector', { w: 96, h: 96, cx: 380, cy: 826, label: 'A', fs: 48 }));
    const cA2 = add(el, FS.node('connector', { w: 96, h: 96, cx: 700, cy: 626, label: 'A', fs: 48 }));
    const l1 = add(el, `<div class="col c" style="top:1110px;text-align:center"><div class="en" style="font-size:66px">FLOWLINE</div><div class="th" style="font-size:46px">ลูกศร = ทิศทางการทำงาน</div></div>`);
    const l2 = add(el, `<div class="col c" style="top:1090px;text-align:center"><div class="en" style="font-size:66px">CONNECTOR</div><div class="th" style="font-size:44px">วงกลมเล็ก = จุดเชื่อมต่อ</div><div class="th" style="font-size:32px;color:#95BFEF">(ภายในหน้าเดียวกัน)</div></div>`);
    const ROWS = [['terminator', 'เริ่ม / จบ', 'ใช้ วงรี', H.rTerm], ['process', 'คำนวณ', 'ใช้ สี่เหลี่ยมผืนผ้า', H.rProc],
      ['io', 'รับ / แสดงข้อมูล', 'ใช้ สี่เหลี่ยมด้านขนาน', H.rIO], ['decision', 'มีคำถามให้เลือกทาง', 'ใช้ ข้าวหลามตัด', H.rDec]];
    const rows = ROWS.map(([k, t1, t2], i) => add(el, `<div class="row c" style="top:${470 + i * 190}px;${i === 3 ? 'height:250px;' : ''}">
      <div class="ic">${i === 3 ? `<svg width="200" height="210" viewBox="0 0 200 210" style="overflow:visible"><path d="M100,8L170,56L100,104L30,56Z" fill="url(#fsFill)" stroke="#22D3EE" stroke-width="5" stroke-linejoin="round"/>
        <path class="dy" d="M30,56H12V150" fill="none" stroke="#22D3EE" stroke-width="6" stroke-linecap="round"/><path class="dyh" d="M2,138L12,160L22,138Z" fill="#22D3EE"/>
        <path class="dn" d="M170,56H188V150" fill="none" stroke="#22D3EE" stroke-width="6" stroke-linecap="round"/><path class="dnh" d="M178,138L188,160L198,138Z" fill="#22D3EE"/>
        <text class="dyt" x="12" y="196" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="28" fill="#4ADE80">ใช่</text><text class="dnt" x="186" y="196" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="28" fill="#F87171">ไม่ใช่</text></svg>`
        : FS.mini(k, 180, k === 'process' ? 90 : 84, { sw: 5 })}</div>
      <div><div class="t1">${t1}</div><div class="t2">${t2}</div></div></div>`));
    const go = add(el, `<div class="col center c" style="top:840px;height:240px;flex-direction:column;gap:20px">
      <div class="pillb yl" style="font-size:54px">ลองทำข้อสอบกัน!</div><div class="th" style="font-size:36px;color:#95BFEF">นำความรู้ไปใช้จริง</div></div>`);
    const goShapes = ['terminator', 'process', 'io', 'decision'].map((k, i) => add(el, `<div class="abs c" style="left:${[250, 690, 260, 700][i]}px;top:${[560, 600, 1180, 1160][i]}px;opacity:.8">${FS.mini(k, k === 'decision' ? 130 : 140, k === 'decision' ? 84 : 62, { sw: 4, stroke: '#95BFEF' })}</div>`));
    const dyLen = 18 + 94;
    // geometry for the flowline phase
    const lg = q(lines, '.Lg'), lp = q(lines, '.Lp'), lh = q(lines, '.Lh'), pd = q(lines, '.Pd');
    sfx('pop', a0 + .3, .6); sfx('pop', a0 + .7, .6); sfx('zip', a0 + 1.0, .5);
    for (let i = 0; i < 3; i++) sfx('whoosh', a0 + H.flow + .2 + i * 1.2, .25);
    sfx('swoosh', a0 + H.conn + .1, .5); sfx('pop', a0 + H.conn + .6, .7); sfx('pop', a0 + H.conn + .8, .7);
    sfx('ding', a0 + H.conn2 + 1.0, .5); sfx('ding', a0 + H.conn2 + 1.5, .5);
    sfx('whoosh', a0 + H.tip - .1, .5);
    [H.rTerm, H.rProc, H.rIO, H.rDec].forEach(x => sfx('pop', a0 + x + .05, .8)); sfx('zip', a0 + H.rDec2, .5);
    sfx('riser', a0 + H.go - .2, .5); sfx('sparkle', a0 + H.go + .3, .5);
    function draw(t) {
      const u = t - a0;
      tf(hdr1, life(u, H.intro, H.tip - .1, { from: .5, dy: 30 }));
      tf(hdr2, life(u, H.tip, H.go - .1, { from: .5, dy: 30 }));
      const split = E.inOut(P(u, H.conn + .1, .7)), endA = fout(u, H.tip - .1, .4);
      const rl = life(u, .3, 1e9, { from: .5, dy: 30 }), pl = life(u, .7, 1e9, { from: .5, dy: 30 });
      const rx = lerp(540, 380, split), ry = 560, px = lerp(540, 700, split), py = lerp(1000, 860, split);
      tf(rect, { x: rx, y: ry + rl.y, s: rl.s, o: rl.o * endA }); tf(para, { x: px, y: py + pl.y, s: pl.s, o: pl.o * endA });
      FS.setState(rect, { tone: 'idle', glow: .3 }); FS.setState(para, { tone: 'idle', glow: .3 });
      // long flowline (rect bottom → para top), drawn 1.0–2.2 s, pulses from H.flow
      const y0 = 615, y1 = 1000 - 55 - 4, L = y1 - y0 - 18;
      lg.setAttribute('d', `M540,${y0}V${y1 - 18}`); lp.setAttribute('d', `M540,${y0}V${y1 - 18}`);
      lh.setAttribute('d', `M524,${y1 - 26}L540,${y1 + 2}L556,${y1 - 26}Z`);
      const dp = E.inOut(P(u, 1.0, 1.0));
      lg.style.strokeDasharray = `${L} ${L}`; lg.style.strokeDashoffset = L * (1 - dp);
      const longO = 1 - P(u, H.conn + .05, .2); lg.style.opacity = longO; lh.style.opacity = clamp((dp - .85) / .15) * longO;
      lh.setAttribute('fill', u > H.flow ? '#22D3EE' : '#3F78E8');
      const ph = ((u - H.flow) % 1.2) / 1.2;
      lp.style.strokeDasharray = `70 ${L + 200}`; lp.style.strokeDashoffset = 70 - ph * (L + 70); lp.style.opacity = u > H.flow ? longO : 0;
      if (u > H.flow && u < H.conn) FS.setState(para, { tone: ph > .8 ? 'hot' : 'idle', glow: ph > .8 ? 1 : .3 });
      tf(l1, life(u, H.flow + .1, H.conn - .1, { from: .6, dy: 30 }));
      // connector phase
      const co = fin(u, H.conn + .55, .3) * endA;
      ['.L1', '.L1h', '.L2', '.L2h', '.Lj'].forEach(s => q(lines, s).style.opacity = co * (s === '.Lj' ? .8 : 1));
      q(lines, '.Lj').style.strokeDashoffset = -u * 40;
      const c1 = life(u, H.conn + .55, H.tip - .1, { from: .3, dy: 0, el: true, d: .7 }), c2 = life(u, H.conn + .75, H.tip - .1, { from: .3, dy: 0, el: true, d: .7 });
      tf(cA1, c1); tf(cA2, c2);
      // signal: left line → A … A → right line → para (loops from conn2)
      let pdx = 0, pdy = 0, pdo = 0;
      if (u > H.conn2 + .2 && u < H.tip - .1) {
        const k = ((u - H.conn2 - .2) % 2.2) / 2.2;
        if (k < .3) { pdx = 380; pdy = lerp(620, 778, k / .3); pdo = 1; }
        else if (k < .45) { pdx = 380; pdy = 826; pdo = 0; }
        else if (k < .8) { pdx = 700; pdy = lerp(678, 804, (k - .45) / .35); pdo = 1; }
        const hitA1 = k >= .28 && k < .45, hitA2 = k >= .43 && k < .58;
        FS.setState(cA1, { tone: hitA1 ? 'hot' : 'idle', glow: hitA1 ? 1 : .4 }); FS.setState(cA2, { tone: hitA2 ? 'hot' : 'idle', glow: hitA2 ? 1 : .4 });
      } else { FS.setState(cA1, { tone: 'idle', glow: .4 }); FS.setState(cA2, { tone: 'idle', glow: .4 }); }
      pd.setAttribute('cx', pdx); pd.setAttribute('cy', pdy); pd.style.opacity = pdo;
      tf(l2, life(u, H.conn + .3, H.tip - .1, { from: .6, dy: 30 }));
      // recap rows
      rows.forEach((r, i) => {
        const a = ROWS[i][3]; const l = life(u, a, H.go - .1, { from: .5, dy: 40, d: .55 });
        const x = (1 - E.out(P(u, a, .55))) * (i % 2 ? 260 : -260);
        const act = (i < 3 ? u >= a && u < ROWS[i + 1][3] : u >= a);
        tf(r, { ...l, x });
        r.style.boxShadow = act ? '0 0 0 4px #22D3EE,0 0 34px rgba(34,211,238,.4),0 14px 30px rgba(0,0,0,.35)' : '';
      });
      { const r = rows[3], k1 = E.inOut(P(u, H.rDec2, .5)), k2 = E.inOut(P(u, H.rDec2 + .45, .5));
        r.querySelector('.dy').style.strokeDasharray = `${dyLen} ${dyLen}`; r.querySelector('.dy').style.strokeDashoffset = dyLen * (1 - k1);
        r.querySelector('.dn').style.strokeDasharray = `${dyLen} ${dyLen}`; r.querySelector('.dn').style.strokeDashoffset = dyLen * (1 - k2);
        r.querySelector('.dyh').style.opacity = clamp((k1 - .85) / .15); r.querySelector('.dnh').style.opacity = clamp((k2 - .85) / .15);
        r.querySelector('.dyt').style.opacity = fin(u, H.rDec2 + .3, .3); r.querySelector('.dnt').style.opacity = fin(u, H.rDec2 + .75, .3); }
      tf(go, life(u, H.go, 1e9, { from: .4, dy: 40, el: true, d: .8 }));
      goShapes.forEach((g, i) => tf(g, { ...life(u, H.go + .2 + i * .1, 1e9, { from: .3, dy: 20 }), y: bob(u, i * 1.3, 10), r: Math.sin(u + i) * 6 }));
    }
    return { a: a0, b: S0('quiz'), el, draw };
  }

  // ======================= SCENES 5–7a — QUIZ, 5 s COUNTDOWN, ANSWER REVEAL =======================
  function buildQuiz() {
    const el = $('sQuiz'), H = B.quiz, A = B.ans, a0 = S0('quiz'), cd0 = S0('cd'), cdD = T.cd[1], an0 = S0('ans');
    const Qz = SPEC.quiz;
    const tag = add(el, `<div class="col center c" style="top:360px;height:90px"><div class="pillb yl" style="font-size:44px">ข้อสอบนายสิบ · คอมพิวเตอร์</div></div>`);
    const qbig = add(el, `<div class="panel c" style="left:230px;top:470px;width:620px;height:800px;padding:44px 40px">
      <div class="qt glowtx" style="font-size:50px;text-align:center;color:#22D3EE">${Qz.program}</div>
      ${Qz.steps.map((s, i) => `<div class="qs" style="display:flex;align-items:center;gap:20px;margin-top:${i ? 26 : 40}px;font-weight:700;font-size:${i === 1 ? 38 : 42}px;white-space:nowrap">
        <span style="flex:none;width:66px;height:66px;border-radius:50%;display:grid;place-items:center;background:#2F6BFF;color:#fff;font-weight:800;font-size:38px">${i + 1}</span>${s.replace('60', '<span class="y">60</span>')}</div>`).join('')}
      <div class="qq" style="margin-top:56px;padding-top:34px;border-top:3px dashed rgba(149,191,239,.5);text-align:center;font-weight:800;font-size:40px;line-height:1.4;color:#FFD23F">สัญลักษณ์หลักทั้งสามขั้นตอน<br>ควรเรียงอย่างไร?</div></div>`);
    const qsmall = add(el, `<div class="panel c" style="left:230px;top:360px;width:620px;height:206px;text-align:center;padding-top:22px">
      <div class="th" style="font-size:32px;color:#95BFEF">${Qz.program}</div>
      <div style="font-weight:700;font-size:34px;margin-top:4px">รับคะแนน → ตรวจ ≥ <span class="y">60</span> → แสดงผล</div>
      <div style="font-weight:800;font-size:40px;color:#FFD23F;margin-top:6px">สัญลักษณ์หลักควรเรียงอย่างไร?</div></div>`);
    const cdBox = add(el, `<div class="panel c" style="left:230px;top:360px;width:620px;height:206px"></div>`);
    const R = 82, C = 2 * Math.PI * R;
    const cdw = add(cdBox, `<div class="cdw" style="left:0;top:-2px"><svg width="210" height="210" viewBox="0 0 210 210" style="position:absolute;inset:0">
      <circle cx="105" cy="105" r="${R}" fill="rgba(11,26,54,.9)" stroke="rgba(47,107,255,.3)" stroke-width="16"/>
      <circle class="ring" cx="105" cy="105" r="${R}" fill="none" stroke="#22D3EE" stroke-width="16" stroke-linecap="round" stroke-dasharray="${C}" transform="rotate(-90 105 105)" style="filter:drop-shadow(0 0 8px #22D3EE)"/></svg><div class="num"></div></div>`);
    add(cdBox, `<div style="position:absolute;left:220px;top:40px;width:400px"><div class="glowtx" style="font-size:54px">คิดให้ทัน!</div><div class="th" style="font-size:32px;color:#95BFEF">เลือกข้อที่ถูกต้อง</div></div>`);
    const ansHdr = add(el, `<div class="col center c" style="top:400px;height:130px"><div class="pillb gn" style="font-size:62px">${ICON.check('#fff', 56)}เฉลย ข้อ ก.</div></div>`);
    const TOP = [590, 798, 1006, 1214];
    const AR = `<svg class="ar" viewBox="0 0 24 24"><path d="M3 12h15M12 5l7 7-7 7" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
    const MS = { io: [140, 70], process: [130, 70], decision: [120, 92] };
    const opts = Qz.options.map((o, i) => add(el, `<div class="qopt c" style="top:${TOP[i]}px" data-letter="${o.letter}">
      <div class="lt">${o.letter}</div>
      <div class="shp">${o.seq.map(k => FS.mini(k, MS[k][0], MS[k][1], { sw: 4.5, stroke: '#7FC8FF' })).join(AR)}</div>
      <div class="tx">${o.text}</div><div class="ok">${ICON.check('#fff', 48)}</div></div>`));
    const optAt = [H.A, H.B, H.C, H.D], optEnd = [H.B, H.C, H.D, H.think];
    const conf = NSP.buildConfetti(add(el, `<div></div>`), 46, 540, 700);
    sfx('pop', a0 + H.intro + .05, .7); sfx('pop', a0 + H.q1 + .05, .5);
    [H.q2, H.q3, H.q4].forEach(x => sfx('pop', a0 + x + .05, .6)); sfx('ding', a0 + H.q5 + .1, .5);
    sfx('whoosh', a0 + H.A - .25, .5);
    optAt.forEach(x => { sfx('swoosh', a0 + x - .05, .45); sfx('pop', a0 + x + .25, .6); });
    sfx('riser', a0 + H.think + .2, .35);
    for (let i = 0; i < 5; i++) sfx(i < 4 ? 'tick' : 'tick2', cd0 + i, 1);
    sfx('success', an0 + A.reveal, .9); sfx('sparkle', an0 + A.reveal + .2, .8); sfx('ding', an0 + A.reveal + .35, .7);
    sfx('whoosh', an0 + A.input - .1, .6);
    window.QC = window.QC || {};
    window.QC.reveal = an0 + A.reveal; window.QC.cd = [cd0, cd0 + cdD];
    function draw(t) {
      const u = t - a0, uc = t - cd0, ua = t - an0;
      const revealed = ua >= A.reveal;                                  // never before the countdown ends
      const leave = E.in(P(ua, A.input - .25, .5));
      tf(tag, life(u, H.intro, H.A - .3, { from: .5, dy: 30 }));
      const qb = life(u, H.intro + .1, 1e9, { from: .7, dy: 50, d: .6 });
      const shrink = E.inOut(P(u, H.A - .55, .5));
      tf(qbig, { x: 0, y: qb.y - shrink * 200, s: qb.s * lerp(1, .5, shrink), o: qb.o * (1 - shrink) });
      q(qbig, '.qt').style.opacity = fin(u, H.q1, .3);
      qbig.querySelectorAll('.qs').forEach((s, i) => { const l = life(u, [H.q2, H.q3, H.q4][i], 1e9, { from: .6, dy: 20, d: .45 }); s.style.opacity = l.o; s.style.transform = `translateX(${(1 - E.out(P(u, [H.q2, H.q3, H.q4][i], .45))) * -60}px)`; });
      q(qbig, '.qq').style.opacity = fin(u, H.q5, .4);
      // compact header ↔ countdown ↔ answer header
      const cdIn = fin(uc, -.25, .25), cdOut = fout(ua, 0, .25);
      tf(qsmall, { ...life(u, H.A - .3, 1e9, { from: .7, dy: -20, d: .5 }), o: fin(u, H.A - .3, .4) * (1 - cdIn) });
      tf(cdBox, { o: cdIn * cdOut, s: lerp(.9, 1, cdIn) });
      // countdown: frame-exact — number = 5 - floor(frame/30), 30 frames per digit, 150 frames total
      const fr = Math.round(uc * T.fps), n = clamp(cdD - Math.floor(fr / T.fps), 1, cdD);
      const fp = (fr % T.fps) / T.fps;
      q(cdw, '.num').textContent = n;
      q(cdw, '.num').style.transform = `scale(${uc >= 0 && uc < cdD ? lerp(1.4, 1, E.back(clamp(fp / .35))) : 1})`;
      q(cdw, '.ring').style.strokeDashoffset = C * clamp(fr / (cdD * T.fps));
      tf(ansHdr, { ...life(ua, A.reveal, A.input - .2, { from: .3, dy: 0, el: true, d: .8 }) });
      opts.forEach((o, i) => {
        const l = life(u, optAt[i], 1e9, { from: .5, dy: 0, d: .55 });
        const x = (1 - E.out(P(u, optAt[i], .55))) * (i % 2 ? 340 : -340);
        const focus = !revealed && u >= optAt[i] && u < optEnd[i];
        o.classList.toggle('focus', focus);
        const right = revealed && i === Qz.correct;
        o.classList.toggle('right', right);
        const dim = revealed && i !== Qz.correct ? .6 * E.out(P(ua, A.reveal, .45)) : 0;
        const rp = right ? E.back(P(ua, A.reveal, .5)) : 0;
        tf(o, { x: x + leave * (i % 2 ? 900 : -900), y: (right ? -10 * rp : 0), o: l.o * (1 - dim) * (1 - leave), s: l.s * (1 + .03 * rp) });
        o.style.filter = dim ? `grayscale(${dim})` : '';
        const ok = q(o, '.ok');
        tf(ok, right ? { s: lerp(0, 1, E.elastic(P(ua, A.reveal + .1, .8))), o: 1 } : { o: 0 });
      });
      NSP.drawConfetti(conf, t, an0 + A.reveal + .1, 2.2);
    }
    return { a: a0, b: an0 + A.input + .45, el, draw };
  }

  // ======================= SCENE 7 — COMPLETE FLOWCHART + EXECUTION + MEMORY RULE =======================
  function buildChart() {
    const el = $('sChart'), A = B.ans, an0 = S0('ans');
    const chart = new FCE.Chart(el, SPEC, { anchor: [540, 890] });
    q(chart.n.decision.el, '.lb').innerHTML = '<span>คะแนน ≥ <span class="y">60</span> ?</span>';
    q(chart.n.decision.el, '.lb').style.fontSize = '36px';
    ['out_pass', 'out_fail'].forEach(id => q(chart.n[id].el, '.lb').style.fontSize = '32px');
    FS.fixGlyphs(chart.world);
    const scoreChip = add(el, `<div class="chip c" style="left:0;top:0;font-size:46px;border-color:#FFD23F">คะแนน <span class="y" style="margin-left:6px">75</span></div>`);
    const cap = add(el, `<div class="abs c" style="left:230px;top:1240px;width:620px;height:150px;text-align:center"><div class="cap-en en" style="font-size:40px"></div><div class="cap-th glowtx" style="font-size:44px"></div></div>`);
    const CAPS = [[A.input, A.dec - .15, 'STEP 1 · INPUT', 'รับคะแนน → <span class="y">ด้านขนาน</span>'],
      [A.dec, A.branch - .15, 'STEP 2 · DECISION', 'ตรวจเงื่อนไข → <span class="y">ข้าวหลามตัด</span>'],
      [A.branch, A.out - .15, 'แยกเป็น 2 ทาง', '<span class="g">ใช่ = ผ่าน</span> · <span class="r">ไม่ใช่ = ไม่ผ่าน</span>'],
      [A.out, A.out + 2.2, 'STEP 3 · OUTPUT', 'แสดงผล → <span class="y">ด้านขนาน</span> ทั้ง 2 ทาง']];
    const capEls = CAPS.map(c => { const d = add(cap, `<div style="position:absolute;inset:0;white-space:nowrap"><div class="en" style="font-size:38px">${c[2]}</div><div class="glowtx" style="font-size:40px">${c[3]}</div></div>`); return d; });
    // memory rule
    const mHdr = add(el, `<div class="col center c" style="top:360px;height:84px"><div class="pillb fit" style="font-size:32px;padding:10px 28px 12px">INPUT → DECISION → OUTPUT</div></div>`);
    const MR = [['io', 'รับข้อมูล', 'ใช้ ด้านขนาน', A.rule], ['decision', 'ตัดสินใจ', 'ใช้ ข้าวหลามตัด', A.rule3], ['io', 'แสดงผล', 'ใช้ ด้านขนาน เช่นกัน', A.rule4]];
    const mRows = MR.map(([k, t1, t2], i) => add(el, `<div class="row c" style="top:${465 + i * 186}px;height:170px"><div class="ic">${FS.mini(k, 180, k === 'decision' ? 110 : 84, { sw: 5 })}</div><div><div class="t1">${t1}</div><div class="t2">${t2}</div></div></div>`));
    const mAns = add(el, `<div class="panel c" style="left:230px;top:1030px;width:620px;height:230px;text-align:center;box-shadow:0 0 0 5px #22C55E,0 0 50px rgba(34,197,94,.45),0 24px 60px rgba(0,0,0,.45)">
      <div style="display:flex;align-items:center;justify-content:center;gap:16px;margin-top:22px"><span style="width:72px;height:72px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${ICON.check('#fff', 48)}</span><span class="glowtx" style="font-size:72px">ตอบ ข้อ ก.</span></div>
      <div style="display:flex;align-items:center;justify-content:center;gap:10px;margin-top:14px;color:#95BFEF">${FS.mini('io', 120, 56, { sw: 4 })}${FS.AR}${FS.mini('decision', 100, 66, { sw: 4 })}${FS.AR}${FS.mini('io', 120, 56, { sw: 4 })}</div></div>`);
    const mNote = add(el, `<div class="col c" style="top:1286px;text-align:center;font-weight:600;font-size:27px;line-height:1.4;color:#95BFEF">* 3 ขั้นหลักของโจทย์ ไม่ใช่ผังงานทั้งหมด<br>ผังงานจริงต้องมี เริ่มต้น · สิ้นสุด · ลูกศร ด้วย</div>`);
    FS.fixGlyphs(el);
    // execution runs (deterministic plans)
    const RUNS = [
      { score: 75, at: 19.55, until: 'out_pass', speed: 650, dwell: { decision: 1.0, io: .45, terminator: .25 } },
      { score: 45, at: 23.6, until: 'end', speed: 1150, dwell: { decision: .55, io: .3, terminator: .2 } },
      { score: 60, at: 25.58, until: 'end', speed: 1150, dwell: { decision: .55, io: .3, terminator: .2 } },
    ].map(r => ({ ...r, plan: FCE.plan(chart, DL.route(r.score, { from: 'input', until: r.until }), { speed: r.speed, dwell: r.dwell, enter: .3 }) }));
    RUNS.forEach((r, i) => { r.next = RUNS[i + 1] ? RUNS[i + 1].at : A.rule + .55; });
    window.QC = window.QC || {};
    window.QC.runs = RUNS.map(r => ({ score: r.score, at: an0 + r.at, dur: r.plan.dur, next: an0 + r.next, outAt: an0 + r.at + r.plan.steps.find(s => /^out_/.test(s.id)).a, route: r.plan.route, result: DL.result(r.score) }));
    // SFX
    sfx('pop', an0 + 2.8, .6); sfx('pop', an0 + 3.2, .7); sfx('whoosh', an0 + 3.9, .5); sfx('key', an0 + 4.5, .9);
    sfx('zip', an0 + A.dec + .05, .5); sfx('pop', an0 + A.dec + .35, .8); sfx('ding', an0 + A.dec2 + .1, .4);
    sfx('zip', an0 + A.branch + .25, .5); sfx('zip', an0 + A.branch + 1.15, .5); sfx('pop', an0 + A.out + .1, .7); sfx('pop', an0 + A.out + .75, .7);
    sfx('zip', an0 + A.end + .05, .4); sfx('zip', an0 + A.end + .25, .4); sfx('pop', an0 + A.end + .6, .7);
    RUNS.forEach(r => {
      const st = r.plan.steps, dec = st.find(s => s.id === 'decision'), out = st.find(s => s.id === 'out_pass' || s.id === 'out_fail');
      sfx('whoosh', an0 + r.at + .2, .35); sfx('ding', an0 + r.at + dec.a + .15, .5);
      sfx(DL.passes(r.score) ? 'success' : 'buzz', an0 + r.at + out.a + .05, DL.passes(r.score) ? .7 : .55);
    });
    sfx('whoosh', an0 + A.rule - .05, .6); [A.rule, A.rule3, A.rule4].forEach(x => sfx('pop', an0 + x + .1, .8));
    sfx('success', an0 + A.rule5 + .1, .8); sfx('sparkle', an0 + A.rule5 + .3, .7);
    function draw(t) {
      const ua = t - an0;
      // ---------- build-up ----------
      const np = { start: P(ua, 2.75, .5), input: P(ua, 3.15, .55), decision: P(ua, A.dec + .3, .6), out_pass: P(ua, A.out + .1, .55), out_fail: P(ua, A.out + .7, .55), end: P(ua, A.end + .55, .5) };
      const ep = { e_start_in: P(ua, 3.0, .35), e_in_dec: P(ua, A.dec + .05, .4), e_yes: P(ua, A.branch + .25, .7), e_no: P(ua, A.branch + 1.15, .7), e_pass_end: P(ua, A.end + .05, .6), e_fail_end: P(ua, A.end + .25, .6) };
      const tone = {}, glow = {};
      for (const id in np) { tone[id] = 'idle'; glow[id] = .35; }
      if (ua > 3.5 && ua < A.dec) { tone.input = 'hot'; glow.input = .6 + .4 * Math.sin(ua * 4); }
      if (ua > A.dec + .4 && ua < A.branch + .3) { tone.decision = 'hot'; glow.decision = .6 + .4 * Math.sin(ua * 4); }
      if (ua > A.out && ua < A.out + 2) { tone.out_pass = tone.out_fail = 'hot'; glow.out_pass = glow.out_fail = .7; }
      if (ua > A.end + .5 && ua < A.end + 1.3) { tone.end = 'hot'; glow.end = 1; }
      const pulseD = ua > A.dec2 && ua < A.dec2 + .6 ? 1 + .08 * Math.sin(P(ua, A.dec2, .6) * Math.PI) : 1;
      // ---------- execution runs ----------
      let tokenSt = null, run = null; const lit = {};
      RUNS.forEach(r => { const u = ua - r.at; if (u >= 0 && ua < r.next) { run = r; tokenSt = FCE.stateAt(chart, r.plan, u); } });
      if (run) {
        const yes = DL.passes(run.score), outId = yes ? 'out_pass' : 'out_fail';
        for (const id in tokenSt.lit) lit[id] = tokenSt.lit[id];
        if (tokenSt.hit.input != null && tokenSt.hit.input < .6) { tone.input = 'hot'; glow.input = 1; }
        if (tokenSt.hit.decision != null) { tone.decision = 'hot'; glow.decision = tokenSt.hit.decision < .8 ? 1 : .5; }
        if (tokenSt.hit[outId] != null) { tone[outId] = yes ? 'ok' : 'bad'; glow[outId] = 1; }
        if (tokenSt.hit.end != null) { tone.end = 'hot'; glow.end = 1; }
        // token
        const u = ua - run.at, endT = run.plan.dur;
        const tok = chart.token; tok.querySelector('span').textContent = run.score;
        const hideAtDec = tokenSt.at === 'decision' && tokenSt.hit.decision > run.dwell.decision - .2;
        const tokO = clamp(u / .15) * (1 - P(u, endT - .05, .3)) * (hideAtDec ? .3 : 1);
        tf(tok, { x: tokenSt.pos[0], y: tokenSt.pos[1], o: tokO, s: lerp(.4, 1, E.back(clamp(u / .3))) * (tokenSt.at === 'decision' ? .85 : 1) });
        // evaluation bubble: "75 ≥ 60 = จริง"
        const ev = chart.evalEl, hd = tokenSt.hit.decision;
        if (hd != null) {
          ev.className = 'fc-eval ' + (yes ? 'ok' : 'bad');
          ev.innerHTML = `${run.score} ${FS.GE} <span class="y">60</span> = <span class="${yes ? 'g' : 'r'}">${yes ? 'จริง' : 'เท็จ'}</span>`;
          tf(ev, { x: 600, y: 624, s: lerp(.5, 1, E.back(clamp(hd / .3))), o: clamp(hd / .12) * (1 - P(ua, run.next - .25, .2)) });
        } else tf(ev, { o: 0 });
        // result pop from the output symbol toward the viewer
        const ho = tokenSt.hit[outId], pop = chart.pop, on = chart.n[outId].spec;
        if (ho != null) {
          pop.className = 'fc-pop ' + (yes ? 'ok' : 'bad'); pop.querySelector('span').textContent = DL.result(run.score);
          const k = E.back(clamp(ho / .45));
          tf(pop, { x: on.cx, y: on.cy - 6 - 40 * clamp(ho / .45), s: lerp(.3, 1.08, k), o: clamp(ho / .1) * (1 - P(ua, run.next - .3, .25)) });
        } else tf(pop, { o: 0 });
      } else { tf(chart.token, { o: 0 }); tf(chart.evalEl, { o: 0 }); tf(chart.pop, { o: 0 }); }
      for (const id in np) chart.setNode(id, { p: np[id], tone: tone[id], glow: glow[id], s: id === 'decision' ? pulseD : 1 });
      for (const id in ep) {
        const runLit = lit[id] ?? 0;
        const yesBr = id === 'e_yes' && ua > A.branch + .25 && ua < A.out, noBr = id === 'e_no' && ua > A.branch + 1.15 && ua < A.out;
        chart.setEdge(id, { p: ep[id], lit: runLit, pulse: !run && ep[id] >= 1 && ua < A.rule ? (ua * .6 + (id.length % 3) * .33) : null, label: ep[id] * 1.4 - .2 });
        if ((yesBr || noBr) && !run) chart.setEdge(id, { p: ep[id], lit: ep[id], label: ep[id] * 1.4 - .2 });
      }
      // ---------- camera ----------
      const cam = track(ua, [[0, { x: 540, y: 520, s: 1.3 }], [A.dec, { x: 540, y: 700, s: 1.25 }, .8], [A.branch, { x: 540, y: 840, s: 1.05 }, .8], [A.out, { x: 540, y: 880, s: 1.0 }, .9]]);
      chart.camera(cam.x, cam.y, cam.s * (1 - .12 * E.inOut(P(ua, A.rule + .05, .55))));
      // score chip flies into the input symbol (STEP 1)
      { const k = E.inOut(P(ua, 3.9, .7)); const [sx, sy] = chart.toScreen(540, 565);
        tf(scoreChip, { x: lerp(-120, sx - 110, k), y: lerp(sy - 260, sy - 34, k), s: lerp(1, .45, E.in(P(ua, 4.3, .35))), o: fin(ua, 3.85, .15) * (1 - P(ua, 4.55, .15)) }); }
      capEls.forEach((c, i) => tf(c, life(ua, CAPS[i][0] + .05, CAPS[i][1], { from: .6, dy: 30, d: .45 })));
      // ---------- memory rule ----------
      const out = E.inOut(P(ua, A.rule + .05, .55));
      chart.world.style.opacity = 1 - out; chart.world.style.visibility = out >= 1 ? 'hidden' : 'visible';
      tf(mHdr, life(ua, A.rule + .1, 1e9, { from: .5, dy: 30 }));
      mRows.forEach((r, i) => { const a = MR[i][3]; const l = life(ua, a + .1, 1e9, { from: .5, dy: 40, d: .55 }); tf(r, { ...l, x: (1 - E.out(P(ua, a + .1, .55))) * (i % 2 ? 260 : -260) }); });
      const ma = life(ua, A.rule5 + .05, 1e9, { from: .3, dy: 0, el: true, d: .9 }); tf(mAns, { ...ma, s: ma.s * (1 + .015 * Math.sin(ua * 4)) });
      tf(mNote, life(ua, A.rule5 + .9, 1e9, { from: .7, dy: 20 }));
    }
    return { a: an0 + 2.6, b: S0('promo'), el, draw, chart };
  }

  // ======================= SCENE 8 — NAISIBPRO PROMOTIONAL ENDING =======================
  function buildPromo() {
    const el = $('sPromo'), H = B.promo, a0 = S0('promo');
    const ask = add(el, `<div class="col c" style="top:380px;text-align:center;line-height:1.2"><div class="glowtx" style="font-size:76px">คุณตอบถูก</div><div class="glowtx" style="font-size:86px;color:#4ADE80">ข้อ ก. ไหม?</div></div>`);
    const cbox = add(el, `<div class="panel c" style="left:230px;top:700px;width:620px;height:420px;padding:28px">
      <div style="display:flex;align-items:center;gap:14px;font-weight:800;font-size:36px">${ICON2.chat(48)}คอมเมนต์</div>
      ${['ตอบ ข้อ ก. ครับ', 'ด้านขนาน → ข้าวหลามตัด → ด้านขนาน', 'ได้ ก. เหมือนกัน!'].map((c, i) => `<div class="cm" style="margin-top:16px;display:flex;align-items:center;gap:14px">
        <span style="flex:none;width:58px;height:58px;border-radius:50%;background:${['#2F6BFF', '#22D3EE', '#95BFEF'][i]}"></span>
        <span style="padding:10px 22px;border-radius:24px;background:#E6F4FF;color:#142B53;font-weight:700;font-size:${i === 1 ? 26 : 32}px;white-space:nowrap">${c}</span>${ICON.heart('#EE7FAA').replace('width="40" height="40"', 'width="34" height="34"')}</div>`).join('')}</div>`);
    const memT = add(el, `<div class="col c" style="top:370px;text-align:center;line-height:1.25"><div class="glowtx" style="font-size:56px">จำสัญลักษณ์ Flowchart</div><div class="glowtx y" style="font-size:60px;color:#FFD23F">ได้ครบ 6 แบบหรือยัง?</div></div>`);
    const SIX = [['terminator', 'START/END', 'เริ่ม / จบ'], ['process', 'PROCESS', 'ประมวลผล'], ['io', 'I/O', 'รับ / แสดงผล'], ['decision', 'DECISION', 'ตัดสินใจ'], ['flowline', 'FLOWLINE', 'ทิศทาง'], ['connector', 'CONNECTOR', 'จุดเชื่อมต่อ']];
    const six = SIX.map(([k, e, t], i) => add(el, `<div class="card6 c" style="left:${220 + (i % 3) * 220}px;top:${600 + Math.floor(i / 3) * 240}px">
      <div style="height:96px;display:grid;place-items:center">${FS.mini(k, k === 'connector' ? 70 : 150, k === 'decision' ? 90 : k === 'connector' ? 70 : 64, { sw: 4.5, label: k === 'connector' ? 'A' : '' })}</div>
      <div class="e">${e}</div><div class="t">${t}</div></div>`));
    const logo = add(el, `<img class="abs c" src="${NSP.BASE}brand/logo.png" style="left:360px;top:400px;width:360px">`);
    const word = add(el, `<div class="col c" style="top:800px;text-align:center;line-height:1.15"><div style="font-weight:800;font-size:110px;background:linear-gradient(90deg,#22D3EE,#5B8CFF);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 0 #0B1A36)">NaiSibPro</div><div class="glowtx" style="font-size:64px">นายสิบโปร</div></div>`);
    const poster = add(el, `<div class="abs c" style="left:238px;top:540px;width:260px;height:462px;border-radius:24px;overflow:hidden;box-shadow:0 0 0 5px #E6F4FF,0 20px 50px rgba(0,0,0,.5)"><img src="${NSP.BASE}brand/poster.jpg" style="width:260px;height:462px;display:block"></div>`);
    const f1 = add(el, `<div class="panel c" style="left:510px;top:560px;width:350px;height:220px;text-align:center;padding-top:22px"><div class="th" style="font-size:32px">ข้อสอบมากกว่า</div><div class="p-num glowtx y" style="font-size:72px;color:#FFD23F">10,000</div><div class="th" style="font-size:34px;margin-top:-6px">ข้อ</div></div>`);
    const f2 = add(el, `<div class="panel c" style="left:510px;top:800px;width:350px;height:220px;text-align:center;padding-top:30px"><div style="display:grid;place-items:center">${ICON.cal(70, '#22D3EE')}</div><div class="glowtx" style="font-size:42px;margin-top:8px">อัปเดต</div><div class="th" style="font-size:34px">ทุกสัปดาห์</div></div>`);
    const btns = [['like', 'กดไลก์', 'LIKE'], ['share', 'กดแชร์', 'SHARE'], ['bell', 'กดติดตาม', 'FOLLOW']].map(([ic, t, e], i) => add(el, `<div class="abs c" style="left:${232 + i * 210}px;top:640px;width:196px;text-align:center">
      <div class="bt" style="margin:0 auto;width:170px;height:170px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(160deg,#5B8CFF,#2F6BFF);box-shadow:0 0 0 6px rgba(230,244,255,.9),0 0 40px rgba(47,107,255,.6)">${ICON2[ic](92)}</div>
      <div class="en" style="font-size:34px;margin-top:22px">${e}</div><div class="th" style="font-size:34px">${t}</div></div>`));
    const cta = add(el, `<div class="col c" style="top:1040px;text-align:center"><div class="glowtx" style="font-size:56px">LIKE · SHARE · FOLLOW</div><div class="th" style="font-size:36px;color:#95BFEF;margin-top:6px">ติวสอบนายสิบ ไปกับ NaiSibPro</div></div>`);
    const smallLogo = add(el, `<img class="abs c" src="${NSP.BASE}brand/logo.png" style="left:470px;top:380px;width:140px">`);
    const hand = add(el, `<div class="abs" style="left:0;top:0;width:110px;height:110px">${ICON.hand(110)}</div>`);
    const press = [H.cta + .25, H.cta + 1.2, H.follow + .2];
    const ecConf = NSP.buildConfetti(add(el, `<div></div>`), 50, 540, 760);
    mark('endcard', a0 + H.follow);
    sfx('pop', a0 + H.comment + .1, .7); [0, 1, 2].forEach(i => sfx('msg', a0 + H.comment + .7 + i * .5, .8));
    sfx('whoosh', a0 + H.memory - .1, .6); for (let i = 0; i < 6; i++) sfx('pop', a0 + H.memory + .15 + i * .12, .5);
    sfx('riser', a0 + H.brand - .4, .5); sfx('sparkle', a0 + H.brand + .2, .8); sfx('ding', a0 + H.brand + .3, .6);
    sfx('whoosh', a0 + H.promo - .1, .5); for (let i = 0; i < 6; i++) sfx('coin', a0 + H.promo + .3 + i * .15, .4); sfx('pop', a0 + H.weekly + .1, .7);
    sfx('whoosh', a0 + H.cta - .1, .6); press.forEach(x => sfx('click', a0 + x, .9)); sfx('success', a0 + H.follow + .3, .6);
    function draw(t) {
      const u = t - a0;
      tf(ask, life(u, H.comment, H.memory - .1, { from: .5, dy: 40 }));
      const cb = life(u, H.comment + .3, H.memory - .1, { from: .7, dy: 50 }); tf(cbox, cb);
      cbox.querySelectorAll('.cm').forEach((c, i) => { const l = fin(u, H.comment + .7 + i * .5, .3); c.style.opacity = l; c.style.transform = `translateY(${(1 - E.out(l)) * 30}px)`; });
      tf(memT, life(u, H.memory, H.brand - .1, { from: .5, dy: 30 }));
      six.forEach((c, i) => { const l = life(u, H.memory + .15 + i * .12, H.brand - .1, { from: .3, dy: 40, el: true, d: .8 }); tf(c, { ...l, y: l.y + bob(u, i, 5) }); });
      const lg = life(u, H.brand, H.promo - .1, { from: .3, dy: 120, el: true, d: 1 }); tf(logo, { ...lg, y: lg.y + bob(u, 0, 8) });
      tf(word, life(u, H.brand + .3, H.promo - .1, { from: .5, dy: 40 }));
      tf(smallLogo, { ...life(u, H.promo, H.cta - .1, { from: .5, dy: 20 }), y: bob(u, 1, 5) });
      tf(poster, { ...life(u, H.promo, H.cta - .1, { from: .6, dy: 60, d: .6 }), r: -2 });
      tf(f1, life(u, H.promo + .15, H.cta - .1, { from: .5, dy: 40 }));
      q(f1, '.p-num').textContent = (Math.round(10000 * E.out(P(u, H.promo + .3, 1.3)) / 100) * 100).toLocaleString('en-US') + (u > H.promo + 1.6 ? '+' : '');
      tf(f2, life(u, H.weekly, H.cta - .1, { from: .4, dy: 40, el: true, d: .8 }));
      btns.forEach((b, i) => {
        const l = life(u, H.cta + i * .12, 1e9, { from: .3, dy: 40, el: true, d: .8 });
        const pd = NSP.pressDepth(u, [press[i]]); tf(b, { ...l, s: l.s * (1 - .1 * pd) });
        const on = u > press[i] + .1; q(b, '.bt').style.background = on ? (i === 2 ? 'linear-gradient(160deg,#F59BC0,#EE7FAA)' : 'linear-gradient(160deg,#4ADE80,#16A34A)') : '';
      });
      tf(cta, life(u, H.cta + .4, 1e9, { from: .5, dy: 30 }));
      let hx = 0, hy = 0, ho = 0;
      const tgt = i => [232 + i * 210 + 85, 640 + 120];
      if (u > H.cta + .0 && u < H.follow + 1.2) {
        const k1 = E.inOut(P(u, H.cta, .25)), k2 = E.inOut(P(u, H.cta + .7, .45)), k3 = E.inOut(P(u, H.follow - .4, .55));
        let p = [lerp(900, tgt(0)[0], k1), lerp(1300, tgt(0)[1], k1)];
        p = [lerp(p[0], tgt(1)[0], k2), lerp(p[1], tgt(1)[1], k2)]; p = [lerp(p[0], tgt(2)[0], k3), lerp(p[1], tgt(2)[1], k3)];
        hx = p[0]; hy = p[1]; ho = fin(u, H.cta, .2) * fout(u, H.follow + .9, .3);
      }
      hand.style.transform = `translate(${hx}px,${hy}px) scale(${1 - .15 * NSP.pressDepth(u, press)})`; hand.style.opacity = ho;
      NSP.drawConfetti(ecConf, t, a0 + H.follow + .3, 2.4);
    }
    return { a: a0, b: T.end + 1, el, draw };
  }

  // shrink single-line texts that would overflow their box (measured once fonts are loaded)
  document.fonts.ready.then(() => {
    const sc = [...document.querySelectorAll('.scene')]; sc.forEach(e => e.style.display = 'block');
    document.querySelectorAll('.qopt .tx, .fit, .cm span, .pillb').forEach(e => {
      const box = e.closest('.qopt') ? e.clientWidth : 620;
      let f = parseFloat(getComputedStyle(e).fontSize);
      while (e.scrollWidth > box + 1 && f > 18) { f -= 1; e.style.fontSize = f + 'px'; }
    });
    sc.forEach(e => e.style.display = 'none');
  });
  const scenes = [buildHook(), buildStory(), buildKnow(), buildExpl(), buildChart(), buildQuiz(), buildPromo()];
  FS.fixGlyphs($('stage'));
  NSP.start({ scenes, wipes: [S0('story'), S0('know'), S0('expl'), S0('quiz'), S0('promo')], brand: { showAt: 1.2, hideAt: S0('promo') + B.promo.brand }, ep: 'EP.46' });
  // blue wipe bands
  const bands = document.querySelectorAll('#wipe .band');
  ['#95BFEF', '#2F6BFF', 'linear-gradient(180deg,#1C3D7A,#0B1A36)', '#2F6BFF', '#95BFEF'].forEach((c, i) => bands[i].style.background = c);
  const base = window.renderAt;
  // EP.46 keeps scenes still (no slow 2.5 % push-in) so edge-aligned panels stay inside the mobile safe zone
  window.renderAt = t => { drawBg(t); base(t); scenes.forEach(sc => { sc.el.style.transform = 'none'; }); };
  window.SCENES = scenes;
})();
