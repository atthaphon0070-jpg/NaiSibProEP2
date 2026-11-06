// EP38 — To vs CC vs BCC. Scenes built on the shared NSP engine; every beat is a measured phrase start (beats.js).
(function () {
  const { $, clamp, lerp, E, P, tf, life, bob, h, sfx, mark, pressDepth } = window.NSP;
  const { IC, addr, chipHTML, Composer, rowGlow, chipsIn, Inbox } = window.EMAIL;
  const { AppGrid, Paths, Background } = window.VIS;
  const T = window.TL, S = k => T[k][0], B = window.BEATS;
  const stage = $('stage');
  const BASE = NSP.BASE;
  const mkScene = id => { const el = h(`<div class="scene" id="${id}"></div>`); stage.insertBefore(el, $('brand')); return el; };
  const add = (p, html) => { const el = h(html); p.appendChild(el); return el; };
  const put = (el, l, ex = {}) => tf(el, { s: l.s, o: l.o, y: l.y, ...ex });
  const W = (u, a, b = 1e9, o = {}) => life(u, a, b, o);
  const STATIC = { s: 1, o: 1, y: 0 };
  const ess = 'ess';   // class marking essential readable content (safe-zone QC)
  const cursorHTML = () => `<div class="abs" style="left:0;top:0;width:70px;height:70px;filter:drop-shadow(0 6px 8px rgba(0,0,0,.4))">${IC.cursor(70)}</div>`;
  const pulse = (u, a, d = .9) => { const k = (u - a) / d; return k < 0 || k > 1 ? 0 : Math.sin(k * Math.PI); };

  const H0 = S('hook'), ST0 = S('story'), K0 = S('know'), X0 = S('expl'), Q0 = S('quiz'), CD = S('cd'), A0 = S('ans'), PR = S('promo');
  const scenes = [];

  // =====================================================================  SCENE 1 — HOOK
  {
    const sc = mkScene('s-hook'), b = B.hook;
    const kw = add(sc, `<div class="row-c" style="top:356px"><div class="kw ${ess}" style="font-size:56px">${IC.mail(54)}เตรียมสอบนายสิบ</div></div>`);
    const hA = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:474px"><div class="hl thai" style="font-size:70px">ส่งอีเมลถึง <span class="cy">50 คน</span></div><div class="hl thai" style="font-size:50px;margin-top:-4px">แต่ไม่อยากให้เห็นชื่อกัน!</div></div>`);
    const hB = add(sc, `<div class="row-c c" style="top:480px"><div class="kw sub ${ess}" style="font-size:44px">วิชาคอมพิวเตอร์</div></div>`);
    const hC = add(sc, `<div class="row-c c" style="top:572px"><div class="cap warn ${ess}">${IC.warn(42)}ข้อนี้หลายคนตอบผิด!</div></div>`);
    const hD = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:470px"><div class="hl" style="font-size:84px;letter-spacing:2px"><span class="cy">50</span> RECIPIENTS</div><div class="hl thai" style="font-size:44px">ผู้รับ 50 คน · อีเมลฉบับเดียว</div></div>`);
    const hE = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:486px"><div class="hl thai" style="font-size:52px">ห้ามเห็นอีเมล<br><span class="cy">ของกันและกัน</span></div></div>`);
    const hF = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:488px"><div class="hl thai" style="font-size:62px">จะเลือกช่องไหน<span class="cy">?</span></div></div>`);
    const hG = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:470px"><div class="hl thai" style="font-size:56px">ถ้าเลือก<span style="color:#FCA5A5">ผิด</span>...</div></div>`);
    const hH = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:640px"><div class="hl" style="font-size:104px;line-height:1.15">To · CC · <span class="cy">BCC</span></div><div class="hl thai" style="font-size:56px;margin-top:20px">ต่างกันอย่างไร?</div></div>`);
    // stylised email window (frame-zero hero)
    const win = add(sc, `<div class="abs c" style="left:310px;top:690px;width:460px;height:320px;border-radius:30px;background:linear-gradient(180deg,rgba(230,244,255,.16),rgba(47,107,255,.14));border:3px solid rgba(149,191,239,.8);box-shadow:0 0 50px rgba(34,211,238,.35),inset 0 0 40px rgba(34,211,238,.15);overflow:hidden">
      <div style="height:54px;background:linear-gradient(90deg,#2F6BFF,#1E50D8);display:flex;align-items:center;gap:10px;padding:0 20px">${[0, 1, 2].map(() => '<i style="width:14px;height:14px;border-radius:50%;background:rgba(255,255,255,.6)"></i>').join('')}<span style="margin-left:auto;color:#fff;font-weight:700;font-size:24px">ข้อความใหม่</span></div>
      <div class="w-lines" style="position:absolute;left:24px;top:76px;width:150px">${[100, 80, 90, 60].map(w => `<i style="display:block;height:12px;border-radius:6px;background:rgba(230,244,255,.45);margin-bottom:14px;width:${w}%"></i>`).join('')}</div>
      <div class="w-env" style="position:absolute;left:190px;top:80px;filter:drop-shadow(0 0 18px rgba(34,211,238,.9))">${IC.mail(230, '#22D3EE', 'rgba(34,211,238,.12)')}</div>
      <div class="w-eye" style="position:absolute;left:236px;top:110px;width:140px;height:140px;border-radius:50%;background:#fff;display:grid;place-items:center;opacity:0"><div class="eo">${IC.eye(100)}</div><div class="ec" style="position:absolute">${IC.eyeOff(100)}</div></div></div>`);
    const wEnv = win.querySelector('.w-env'), wEye = win.querySelector('.w-eye'), wEo = win.querySelector('.eo'), wEc = win.querySelector('.ec'), wLines = [...win.querySelectorAll('.w-lines i')];
    const grid = AppGrid(sc, { x: 226, y: 1062 });
    const paths = Paths(sc, grid, 540, 1000);
    // three field cards (neutral — no hint of the answer)
    const fc = [['TO', 'To'], ['CC', 'CC'], ['BCC', 'BCC']].map(([t], i) => add(sc, `<div class="fcard c ${ess}" style="left:220px;top:${640 + i * 165}px"><div class="tg" style="${t === 'BCC' ? 'font-size:42px' : ''}">${t}</div><div class="tx">ช่อง ${t === 'TO' ? 'To' : t}</div></div>`));
    const qm = add(sc, `<div class="abs c" style="left:470px;top:1150px">${IC.q(140)}</div>`);
    const cur = add(sc, cursorHTML());
    const risk = Inbox(sc, { x: 220, y: 600, who: '02', whoAddr: addr(2), bad: true, hdr: [{ k: 'From', chips: [chipHTML('staff@example.com', { av: 'S' })] }, { k: 'To', chips: [chipHTML(addr(1), { av: '01', cls: 'warn' }), chipHTML(addr(3), { av: '03', cls: 'warn' }), chipHTML('+47 คน', { av: null, cls: 'more' })] }], body: 2 });
    risk.el.classList.add('c', ess);
    const riskCap = add(sc, `<div class="row-c c" style="top:1300px"><div class="cap warn ${ess}" style="font-size:32px">${IC.warn(38)}เห็นอีเมลคนอื่นโดยไม่ตั้งใจ</div></div>`);

    sfx('notify', H0 + .05, .7); sfx('pop', H0 + b.comp, .6); sfx('buzz', H0 + b.fail + .1, .45);
    sfx('whoosh', H0 + b.n50, .6); for (let i = 0; i < 10; i++) sfx('pop', H0 + b.n50 + .3 + i * .08, .25);
    sfx('zip', H0 + b.priv + .2, .5); sfx('click', H0 + b.priv + 1.3, .6);
    [b.to, b.cc, b.bcc].forEach(a => sfx('pop', H0 + a, .7)); sfx('whoosh', H0 + b.three, .6);
    sfx('click', H0 + b.x1 + .8, .5); sfx('click', H0 + b.x1 + 1.6, .5);
    sfx('buzz', H0 + b.risk + .4, .5); sfx('whoosh', H0 + b.go, .6); sfx('sparkle', H0 + b.go + .3, .6);

    scenes.push({ el: sc, a: 0, b: ST0, draw(t) {
      const u = t - H0;
      // keyword is fully visible from frame 0 (no entrance) — gentle glow only
      kw.firstChild.style.boxShadow = `0 0 0 4px rgba(34,211,238,.85),0 0 ${30 + 14 * Math.sin(u * 3)}px rgba(34,211,238,.45),inset 0 3px 0 rgba(255,255,255,.3)`;
      put(hA, u < 1 ? STATIC : W(u, -1, b.comp));
      put(hB, W(u, b.comp, b.n50 - .1)); put(hC, W(u, b.fail, b.n50 - .1));
      put(hD, W(u, b.n50, b.priv - .05)); put(hE, W(u, b.priv, b.three - .05)); put(hF, W(u, b.three, b.risk - .05)); put(hG, W(u, b.risk, b.go - .05));
      const lH = W(u, b.go, 1e9, { from: .3, el: true, d: .9 }); put(hH, lH);
      // hero window
      const wl = u < 1 ? { s: 1, o: 1, y: 0 } : W(u, -1, b.three, { out: .35 });
      const comp = E.back(P(u, b.comp, .6));
      tf(win, { ...wl, y: wl.y + bob(u, 0, 6), s: wl.s * (1 + .06 * pulse(u, b.comp, .6)), ry: 8 * Math.sin(u * .9) });
      wLines.forEach((l, i) => { l.style.transform = `scaleX(${clamp(.35 + .65 * P(u, b.comp + i * .25, .4))})`; l.style.transformOrigin = 'left'; });
      const envGlow = 1 + .08 * Math.sin(u * 4) + .2 * pulse(u, b.n50, .7);
      tf(wEnv, { s: envGlow, o: 1 - clamp((u - b.priv) / .3) * .7 });
      const eyeIn = W(u, b.priv + .15, 1e9, { from: .2, dy: 0 }); tf(wEye, { s: eyeIn.s, o: eyeIn.o });
      const closed = clamp((u - b.priv - 1.3) / .25);
      wEo.style.opacity = 1 - closed; wEc.style.opacity = closed;
      // 50 recipients: present at frame 0, wave on "50", shields on privacy line
      grid.set(u, { noPop: true, spread: E.inOut(P(u, b.priv, .7)), shield: b.priv + .3, wave: b.n50 + .3, o: 1 - P(u, b.three - .2, .35) });
      paths.draw(u, b.n50 + .25, 1.0, b.priv - .3);
      // three cards
      fc.forEach((c, i) => {
        const l = W(u, b.three + .15 + i * .15, b.risk, { from: .5, dy: 60 });
        const g = pulse(u, [b.to, b.cc, b.bcc][i], 1.0);
        put(c, l, { x: (1 - E.out(P(u, b.three + .15 + i * .15, .5))) * (i % 2 ? 40 : -40) });
        c.style.boxShadow = g > 0 ? `0 18px 40px rgba(0,0,0,.35),0 0 0 ${6 * g}px #22D3EE,0 0 ${40 * g}px rgba(34,211,238,.6)` : '';
      });
      const ql = W(u, b.three + .6, b.risk, { from: .2, el: true, d: .8 }); put(qm, ql, { r: Math.sin(u * 2.4) * 10 });
      // cursor hovering between the three fields
      let co = 0, cx = 0, cy = 0;
      if (u > b.x1 && u < b.risk) {
        const k = (u - b.x1) / (b.risk - b.x1);
        const ys = [715, 880, 1045, 880], seg = Math.min(2.999, k * 3), i = Math.floor(seg), f = E.inOut(seg - i);
        cx = 760; cy = lerp(ys[i], ys[i + 1], f); co = clamp((u - b.x1) / .2) * (1 - P(u, b.risk - .2, .2));
      }
      tf(cur, { x: cx, y: cy, o: co });
      put(risk.el, W(u, b.risk + .1, b.go - .05, { from: .6, dy: 120 }));
      put(riskCap, W(u, b.risk + .7, b.go - .05));
    } });
  }

  // =====================================================================  SCENE 2 — GOVERNMENT OFFICE STORY
  {
    const sc = mkScene('s-story'), b = B.story;
    const ow = add(sc, `<div class="abs" style="left:0;top:0;width:1080px;height:1920px;transform-origin:0 0"></div>`);
    add(ow, `<svg class="abs" width="1080" height="1920" style="left:0;top:0">
      <defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E3D73"/><stop offset="1" stop-color="#142B53"/></linearGradient>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC4FA"/><stop offset="1" stop-color="#D7EEFF"/></linearGradient></defs>
      <rect width="1080" height="1920" fill="url(#wall)"/>
      <rect x="0" y="1180" width="1080" height="10" fill="#2F6BFF" opacity=".35"/>
      <g transform="translate(560 420)"><rect width="420" height="330" rx="18" fill="#E6F4FF"/><rect x="14" y="14" width="392" height="302" rx="10" fill="url(#sky)"/>
        <path d="M14 316 V230 h50 v-60 h40 v90 h46 v-120 h56 v120 h40 v-70 h60 v70 h44 v-40 h56 v110z" fill="#6E9BD6" opacity=".7"/>
        <path d="M14 316 V262 h70 v-30 h60 v50 h70 v-40 h80 v40 h112 v34z" fill="#3E6DB3" opacity=".7"/>
        <rect x="205" y="14" width="10" height="302" fill="#E6F4FF"/><rect x="14" y="160" width="392" height="8" fill="#E6F4FF"/></g>
      <g transform="translate(110 430)"><rect width="300" height="400" rx="14" fill="#fff"/><rect x="0" y="0" width="300" height="96" rx="14" fill="#2F6BFF"/><rect x="0" y="70" width="300" height="26" fill="#2F6BFF"/>
        <text x="150" y="62" font-family="Prompt" font-weight="800" font-size="44" fill="#fff" text-anchor="middle">ประกาศ</text>
        <text x="150" y="160" font-family="Prompt" font-weight="800" font-size="50" fill="#142B53" text-anchor="middle">อบรม</text>
        <text x="150" y="208" font-family="Prompt" font-weight="600" font-size="30" fill="#2F6BFF" text-anchor="middle">ผู้สมัคร</text>
        <rect x="40" y="240" width="220" height="14" rx="7" fill="#DCE8FA"/><rect x="40" y="270" width="180" height="14" rx="7" fill="#DCE8FA"/><rect x="40" y="300" width="200" height="14" rx="7" fill="#DCE8FA"/>
        <circle cx="150" cy="352" r="22" fill="#22D3EE"/><path d="M140 352l7 7 14-15" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="150" cy="-6" r="10" fill="#EE7FAA"/></g>
      <g transform="translate(470 860)"><circle r="0"/></g>
    </svg>`);
    const SUP = (() => { const ch = STORY.character('S'), w = h('<div class="abs" style="left:0;top:0;transform-origin:0 0"></div>'); w.appendChild(ch); ow.appendChild(w); return { ch, w }; })();
    const OFF = (() => { const ch = STORY.character('O'), w = h('<div class="abs" style="left:0;top:0;transform-origin:0 0"></div>'); w.appendChild(ch); ow.appendChild(w); return { ch, w }; })();
    // monitor (screen-space inside the world)
    const mon = add(ow, `<div class="abs" style="left:450px;top:900px;width:440px;height:300px;border-radius:22px;background:#0D1E3D;padding:14px;box-shadow:0 20px 40px rgba(0,0,0,.4)">
      <div style="position:relative;width:412px;height:272px;border-radius:12px;overflow:hidden;background:#F3F8FF">
        <div style="height:40px;background:linear-gradient(90deg,#2F6BFF,#1E50D8);display:flex;align-items:center;gap:8px;padding:0 12px;color:#fff;font-weight:700;font-size:20px">${IC.mail(26)}อีเมล</div>
        <div style="padding:12px">${[0, 1, 2, 3].map(i => `<div style="display:flex;gap:10px;align-items:center;margin-bottom:12px"><i style="width:30px;height:30px;border-radius:50%;background:${i ? '#BFDBFE' : '#22D3EE'}"></i><i style="flex:1;height:12px;border-radius:6px;background:#DCE8FA"></i></div>`).join('')}</div>
        <div class="m-toast" style="position:absolute;left:16px;right:16px;top:60px;padding:10px 14px;border-radius:14px;background:#fff;box-shadow:0 8px 18px rgba(20,43,83,.3);display:flex;gap:10px;align-items:center;font-weight:700;font-size:21px;color:#142B53;opacity:0">${IC.mail(30, '#2F6BFF')}งานใหม่: แจ้งผู้สมัคร 50 คน</div>
        <div class="m-cmp" style="position:absolute;inset:0;background:#fff;opacity:0"><div style="height:40px;background:linear-gradient(90deg,#2F6BFF,#1E50D8)"></div>${['From', 'To', 'CC', 'BCC'].map(k => `<div style="display:flex;gap:8px;align-items:center;padding:8px 12px;border-bottom:2px solid #E3EDFB;font-weight:800;font-size:20px;color:#2F6BFF">${k}</div>`).join('')}</div>
      </div></div>
      <div class="abs" style="left:640px;top:1196px;width:60px;height:130px;background:#0D1E3D"></div>`);
    const mToast = mon.querySelector('.m-toast'), mCmp = mon.querySelector('.m-cmp');
    add(ow, `<svg class="abs" width="1080" height="1920" style="left:0;top:0">
      <rect x="60" y="1320" width="960" height="34" rx="10" fill="#4A79C9"/><rect x="80" y="1352" width="920" height="600" fill="#24467F"/><rect x="80" y="1352" width="920" height="20" fill="#1C3A6E"/>
      <rect x="520" y="1296" width="300" height="30" rx="8" fill="#DCE8FA"/>${[...Array(9)].map((_, i) => `<rect x="${532 + i * 32}" y="1302" width="24" height="8" rx="3" fill="#9DB6D9"/>`).join('')}
      <ellipse cx="880" cy="1316" rx="22" ry="12" fill="#DCE8FA"/>
      <g transform="translate(120 1222)"><rect width="190" height="34" rx="6" fill="#2F6BFF"/><rect y="36" width="190" height="34" rx="6" fill="#22D3EE"/><rect y="72" width="190" height="26" rx="6" fill="#95BFEF"/><rect x="150" y="6" width="26" height="22" rx="4" fill="#F8CFE2"/></g>
      <g transform="translate(360 1250)"><rect width="70" height="70" rx="12" fill="#E6F4FF"/><path d="M35 14v24l14 8" stroke="#2F6BFF" stroke-width="6" fill="none" stroke-linecap="round"/></g>
    </svg>`);
    ow.insertBefore(SUP.w, ow.lastChild);   // supervisor stands in front of the monitor, behind the desk
    // overlays (screen space)
    const cap1 = add(sc, `<div class="row-c c" style="top:372px"><div class="cap dark ${ess}" style="font-size:42px">${IC.person(44, '#22D3EE')}เจ้าหน้าที่ฝ่ายธุรการ</div></div>`);
    const draft = add(sc, `<div class="abs c ${ess}" style="left:220px;top:372px;width:640px;border-radius:30px;background:#fff;box-shadow:0 24px 50px rgba(0,0,0,.45),0 0 0 4px #2F6BFF;overflow:hidden">
      <div style="height:62px;background:linear-gradient(90deg,#2F6BFF,#1E50D8);display:flex;align-items:center;gap:12px;padding:0 22px;color:#fff;font-weight:700;font-size:28px">${IC.mail(36)}ร่างอีเมล</div>
      <div style="padding:16px 24px 6px;font-weight:600;font-size:28px;color:#5B7194">เรื่อง</div><div style="padding:0 24px;font-weight:800;font-size:44px;color:#142B53">แจ้งกำหนดการอบรม</div>
      <div style="display:flex;align-items:center;gap:14px;padding:16px 24px 22px"><span style="font-weight:700;font-size:32px;color:#142B53">ผู้รับ: ผู้สมัคร</span><span class="d-cnt" style="margin-left:auto;font-weight:800;font-size:54px;color:#fff;background:linear-gradient(90deg,#2F6BFF,#22A5EE);padding:0 26px 4px;border-radius:24px">50 คน</span></div></div>`);
    const dCnt = draft.querySelector('.d-cnt');
    const bub = add(sc, `<div class="bubble2 r c ${ess}" style="left:226px;top:380px;width:628px;display:flex;gap:18px;align-items:center"><span style="flex:none">${IC.shield(84, '#2F6BFF')}</span><span>ต้องรักษาความเป็นส่วนตัว<br><span style="color:#2F6BFF">ของผู้สมัคร</span></span></div>`);
    const flash = add(sc, `<div class="abs" style="inset:0;background:#E6F4FF;opacity:0"></div>`);
    const cmp = Composer(sc, { x: 220, y: 400, rows: [
      { key: 'from', label: 'From', chips: [chipHTML('staff@example.com', { av: 'S' })] }, { key: 'to', label: 'To' }, { key: 'cc', label: 'CC' }, { key: 'bcc', label: 'BCC' },
      { key: 'subj', label: 'เรื่อง', th: true, text: 'แจ้งกำหนดการอบรม' }], body: 2 });
    cmp.el.classList.add('c', ess);
    const marks = ['to', 'cc', 'bcc'].map(k => { const m = h(`<div class="abs" style="right:18px;top:16px;display:flex;gap:6px"><span class="mk1" style="width:44px;height:44px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${IC.check(28)}</span><span class="mk2" style="width:44px;height:44px;border-radius:50%;background:#EAF2FF;display:grid;place-items:center">${IC.eye(30)}</span></div>`); cmp.R[k].el.appendChild(m); return { m, a: m.querySelector('.mk1'), b: m.querySelector('.mk2') }; });
    const tray = add(sc, `<div class="abs c ${ess}" style="left:220px;top:1110px;width:640px;height:120px;border-radius:30px;background:rgba(230,244,255,.97);box-shadow:0 18px 40px rgba(0,0,0,.4),0 0 0 4px #22D3EE;display:flex;align-items:center;gap:14px;padding:0 24px">
      <div style="display:flex">${[0, 1, 2, 3, 4].map(i => `<span style="width:58px;height:58px;margin-left:${i ? -16 : 0}px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(160deg,#22D3EE,#2F6BFF);box-shadow:0 0 0 3px #fff">${IC.person(36)}</span>`).join('')}</div>
      <span style="font-weight:800;font-size:40px;color:#142B53">ผู้สมัคร 50 คน</span><span style="margin-left:auto">${IC.q(64)}</span></div>`);
    const cur = add(sc, cursorHTML());
    const which = add(sc, `<div class="row-c c" style="top:1290px"><div class="cap dark ${ess}" style="font-size:44px">${IC.q(52)}ควรเลือกช่องไหน?</div></div>`);

    for (let i = 0; i < 14; i++) sfx(i % 3 ? 'type' : 'key', ST0 + .4 + i * .17, .7);
    sfx('notify', ST0 + b.assign, .8); sfx('pop', ST0 + b.assign + .4, .6); sfx('step', ST0 + b.boss, .6); sfx('step', ST0 + b.boss + .35, .6); sfx('step', ST0 + b.boss + .7, .6);
    sfx('msg', ST0 + b.rule, .8); sfx('zip', ST0 + b.rule + .4, .4);
    sfx('click', ST0 + b.open - .1, .6); sfx('whoosh', ST0 + b.open + .1, .7); sfx('pop', ST0 + b.fields, .5);
    [b.to, b.cc, b.bcc].forEach(a => sfx('pop', ST0 + a, .7));
    sfx('whoosh', ST0 + b.all, .5); sfx('click', ST0 + b.diff, .5); sfx('click', ST0 + b.diff2, .5); sfx('ding', ST0 + b.which, .5);

    scenes.push({ el: sc, a: ST0, b: K0, draw(t) {
      const u = t - ST0;
      // camera: slow push, then dive into the monitor on "open compose window"
      const z = E.inOut(P(u, b.open, .85));
      const s = lerp(1.25 + .04 * clamp(u / b.open), 3.4, z), cx = lerp(600, 670, z), cy = lerp(1020, 1050, z);
      ow.style.transform = `translate(${540 - cx * s}px,${960 - cy * s}px) scale(${s})`;
      ow.style.opacity = 1 - P(u, b.open + .65, .25);
      // officer: typing → looks at supervisor → turns back
      const typing = u < b.boss + .4 || (u > b.rule + 3 && u < b.open);
      const tk = typing ? Math.sin(u * 22) * 6 : 0;
      const look = u > b.boss + .5 && u < b.open - .2;
      OFF.ch.pose({ t: u, armL: [-24 + tk, 70], armR: [-24 - tk, 70], expr: u > b.rule + .3 && u < b.rule + 3.2 ? 'worried' : u > b.rule + 3.2 ? 'smile' : look ? 'curious' : 'smile', turn: look ? .7 : .45, lookX: look ? 1 : .6, lookY: typing ? .6 : 0, tilt: u > b.rule + .3 && u < b.rule + 1.6 ? 4 * Math.sin((u - b.rule) * 6) : 0, blink: STORY.blinkAt(u) });
      OFF.w.style.transform = `translate(300px,1560px) scale(1)`;
      // supervisor walks in from the right
      const wk = E.out(P(u, b.boss, 1.1));
      const sx = lerp(1300, 905, wk);
      SUP.ch.pose({ t: u, walk: u * 9, walkAmt: wk < 1 ? .9 * (1 - wk) + .1 : 0, armR: u > b.rule ? [60 + 8 * Math.sin(u * 5), 40] : undefined, expr: u > b.rule ? 'neutral' : 'smile', turn: -.5, lookX: -1, blink: STORY.blinkAt(u, 2) });
      SUP.w.style.transform = `translate(${sx}px,1560px) scale(.95)`;
      SUP.w.style.opacity = u > b.boss ? 1 : 0;
      // screen content
      mToast.style.opacity = clamp((u - b.assign) / .3) * (1 - P(u, b.open - .5, .3));
      mToast.style.transform = `translateY(${(1 - E.back(P(u, b.assign, .5))) * -40}px)`;
      mCmp.style.opacity = clamp((u - b.open + .3) / .3);
      // overlays
      put(cap1, W(u, .05, b.assign - .05));
      put(draft, W(u, b.assign + .3, b.boss - .1, { from: .5, dy: 80 }));
      const n = Math.round(50 * E.out(P(u, b.assign + .6, 1.2))); dCnt.textContent = `${n} คน`;
      put(bub, W(u, b.rule, b.open - .1, { from: .3, el: true, d: .7 }));
      flash.style.opacity = pulse(u, b.open + .55, .45) * .85;
      put(cmp.el, W(u, b.open + .75, 1e9, { from: .85, dy: 30 }));
      ['to', 'cc', 'bcc'].forEach((k, i) => rowGlow(cmp.R[k], Math.max(pulse(u, [b.to, b.cc, b.bcc][i], 1.1), u > b.fields && u < b.to ? .25 * pulse(u, b.fields, 1.2) : 0)));
      marks.forEach((m, i) => { const la = W(u, b.diff + i * .15, 1e9, { from: .2, dy: 0, d: .35 }); tf(m.a, { s: la.s, o: la.o }); const lb = W(u, b.diff2 + i * .15, b.which, { from: .2, dy: 0, d: .35 }); tf(m.b, { s: lb.s, o: lb.o }); m.b.querySelector('svg').style.opacity = .4 + .6 * Math.abs(Math.sin(u * 3 + i)); });
      put(tray, W(u, b.all, 1e9, { from: .5, dy: 80 }), { y: W(u, b.all, 1e9, { dy: 80 }).y + bob(u, 0, 5) });
      let co = 0, ccx = 0, ccy = 0;
      if (u > b.all + .4) {
        const k = (u - b.all - .4) / (b.which - b.all - .4);
        const ys = [560, 640, 718, 640, 560, 640, 718], seg = Math.min(5.999, Math.max(0, k) * 6), i = Math.floor(seg), f = E.inOut(seg - i);
        ccx = 700; ccy = u < b.which ? lerp(ys[i], ys[i + 1], f) : 640; co = clamp((u - b.all - .4) / .3);
      }
      tf(cur, { x: ccx, y: ccy + 8 * Math.sin(u * 3), o: co });
      put(which, W(u, b.which, 1e9, { from: .4, el: true, d: .8 }));
    } });
  }

  // =====================================================================  SCENE 3 — TO and CC
  {
    const sc = mkScene('s-know'), b = B.know;
    const cmp = Composer(sc, { x: 220, y: 380, rows: [
      { key: 'from', label: 'From', chips: [chipHTML('staff@example.com', { av: 'S' })] },
      { key: 'to', label: 'To', chips: [chipHTML(addr(1), { av: '01' })] },
      { key: 'cc', label: 'CC', chips: [chipHTML('chief@example.com', { av: 'ห', cls: 'boss' })] },
      { key: 'bcc', label: 'BCC' }], body: 0 });
    cmp.el.classList.add('c', ess);
    const defTo = add(sc, `<div class="fcard c ${ess}" style="left:220px;top:880px"><div class="tg">To</div><div class="tx">ผู้รับหลัก</div></div>`);
    const defCc = add(sc, `<div class="fcard c ${ess}" style="left:220px;top:880px"><div class="tg">CC</div><div class="tx"><span class="cc1" style="font-size:38px;color:#2F6BFF;letter-spacing:1px">CARBON COPY</span><span class="cc2" style="display:block;font-size:46px">สำเนา</span></div></div>`);
    const cc1 = defCc.querySelector('.cc1'), cc2 = defCc.querySelector('.cc2');
    // recipients
    const rMain = add(sc, `<div class="abs c ${ess}" style="left:240px;top:1080px;width:260px;text-align:center"><div style="width:150px;height:150px;margin:0 auto;border-radius:50%;display:grid;place-items:center;background:linear-gradient(160deg,#22D3EE,#2F6BFF);box-shadow:0 0 0 6px #E6F4FF,0 14px 30px rgba(0,0,0,.4)">${IC.person(96)}</div><div class="cap" style="margin-top:16px;font-size:34px">ผู้รับหลัก</div></div>`);
    const rCopy = add(sc, `<div class="abs c ${ess}" style="left:580px;top:1080px;width:260px;text-align:center"><div style="position:relative;width:150px;height:150px;margin:0 auto;border-radius:50%;display:grid;place-items:center;background:linear-gradient(160deg,#5B7194,#1C3A6E);box-shadow:0 0 0 6px #95BFEF,0 14px 30px rgba(0,0,0,.4)">${IC.person(96)}<span style="position:absolute;right:-10px;bottom:-6px;width:62px;height:62px;border-radius:50%;background:#fff;display:grid;place-items:center">${IC.copy(40)}</span></div><div class="cap" style="margin-top:16px;font-size:34px">ผู้รับสำเนา</div></div>`);
    const env1 = add(sc, `<div class="abs" style="left:0;top:0;filter:drop-shadow(0 0 12px rgba(34,211,238,.9))">${IC.mail(80, '#22D3EE', '#0D1E3D')}</div>`);
    const env2 = add(sc, `<div class="abs" style="left:0;top:0;filter:drop-shadow(0 0 12px rgba(149,191,239,.9))">${IC.mail(80, '#95BFEF', '#0D1E3D')}</div>`);
    const env3 = add(sc, `<div class="abs" style="left:0;top:0;filter:drop-shadow(0 0 12px rgba(34,211,238,.9))">${IC.mail(80, '#22D3EE', '#0D1E3D')}</div>`);
    const cur = add(sc, cursorHTML());
    // recipient view (to + cc visible)
    const vis = Inbox(sc, { x: 220, y: 420, who: '01', whoAddr: addr(1), hdr: [{ k: 'From', chips: [chipHTML('staff@example.com', { av: 'S' })] }, { k: 'To', chips: [chipHTML(addr(1), { av: '01' })] }, { k: 'CC', chips: [chipHTML('chief@example.com', { av: 'ห', cls: 'boss' })] }], body: 2 });
    vis.el.classList.add('c', ess);
    const visEyes = vis.rows.slice(1).map(r => { const e = h(`<span style="flex:none;width:52px;height:52px;border-radius:50%;background:#EAF2FF;display:grid;place-items:center">${IC.eye(36)}</span>`); r.appendChild(e); return e; });
    const visCap = add(sc, `<div class="row-c c" style="top:1040px"><div class="cap ${ess}" style="font-size:44px">${IC.eye(56)}มองเห็นรายชื่อได้</div></div>`);
    const visNote = add(sc, `<div class="row-c c" style="top:1160px"><div class="kw sub ${ess}" style="font-size:36px">To · CC = รายชื่อที่ผู้รับเห็น</div></div>`);
    // wrong use: 50 applicants in To
    const wrong = Composer(sc, { x: 220, y: 470, title: 'ถ้าใส่ 50 คนในช่องที่มองเห็นได้', rows: [
      { key: 'from', label: 'From', chips: [chipHTML('staff@example.com', { av: 'S' })] },
      { key: 'to', label: 'To', chips: [chipHTML(addr(1), { av: '01' }), chipHTML(addr(2), { av: '02' }), chipHTML(addr(3), { av: '03' }), chipHTML('+47 คน', { av: null, cls: 'more' })], count: '50' },
      { key: 'cc', label: 'CC' }], body: 0 });
    wrong.el.classList.add('c', ess);
    const wrongTag = add(sc, `<div class="row-c c" style="top:376px"><div class="cap dark ${ess}" style="font-size:38px">มุมมองผู้ส่ง</div></div>`);
    const bad = Inbox(sc, { x: 220, y: 470, who: '02', whoAddr: addr(2), bad: true, hdr: [{ k: 'From', chips: [chipHTML('staff@example.com', { av: 'S' })] }, { k: 'To', chips: [chipHTML(addr(1), { av: '01', cls: 'warn' }), chipHTML(addr(2), { av: '02' }), chipHTML(addr(3), { av: '03', cls: 'warn' }), chipHTML('+47 คน', { av: null, cls: 'more' })] }], body: 1 });
    bad.el.classList.add('c', ess);
    const badTag = add(sc, `<div class="row-c c" style="top:376px"><div class="cap dark ${ess}" style="font-size:38px">มุมมองผู้สมัคร 02</div></div>`);
    const badCap = add(sc, `<div class="row-c c" style="top:1200px"><div class="cap warn ${ess}" style="font-size:46px">${IC.warn(50)}เสี่ยงเปิดเผยรายชื่อ</div></div>`);

    sfx('pop', K0 + b.to, .6); sfx('pop', K0 + b.toDef + .1, .7); sfx('click', K0 + b.toSend, .8); sfx('whoosh', K0 + b.toSend + .1, .7); sfx('notify', K0 + b.toSend + 1.1, .5);
    sfx('pop', K0 + b.cc, .6); sfx('pop', K0 + b.cc + .5, .7); sfx('click', K0 + b.ccSend, .8); sfx('whoosh', K0 + b.ccSend + .1, .7); sfx('notify', K0 + b.ccSend + 1.2, .5);
    sfx('whoosh', K0 + b.vis, .6); sfx('sparkle', K0 + b.vis + .9, .5);
    sfx('whoosh', K0 + b.wrong, .6); for (let i = 0; i < 4; i++) sfx('pop', K0 + b.wrong + .5 + i * .2, .5);
    sfx('whoosh', K0 + b.warn, .6); sfx('buzz', K0 + b.warn + .6, .55);

    scenes.push({ el: sc, a: K0, b: X0, draw(t) {
      const u = t - K0;
      const phase1 = u < b.vis;
      put(cmp.el, W(u, .0, b.vis - .1, { from: .9, dy: 40 }));
      rowGlow(cmp.R.to, u < b.cc ? clamp((u - b.to) / .3) * (1 - P(u, b.cc - .3, .3)) : 0);
      rowGlow(cmp.R.cc, u >= b.cc - .1 ? clamp((u - b.cc) / .3) * (1 - P(u, b.vis - .5, .3)) : 0);
      chipsIn(cmp.R.to.chips, u, [b.toDef]); chipsIn(cmp.R.cc.chips, u, [b.cc + .5]);
      put(defTo, W(u, b.to + .2, b.cc - .05, { from: .5, dy: 60 }));
      put(defCc, W(u, b.cc, b.vis - .1, { from: .5, dy: 60 }));
      tf(cc1, { o: clamp((u - b.ccFull) / .3), s: lerp(.7, 1, E.back(P(u, b.ccFull, .5))) }); tf(cc2, { o: clamp((u - b.ccDef) / .3), s: lerp(.7, 1, E.back(P(u, b.ccDef, .5))) });
      put(rMain, W(u, b.toSend - .2, b.vis - .1, { from: .3, el: true, d: .8 }));
      put(rCopy, W(u, b.ccSend - .2, b.vis - .1, { from: .3, el: true, d: .8 }));
      cmp.sendb.style.transform = `scale(${1 - .12 * pressDepth(u, [b.toSend, b.ccSend])})`;
      const sendXY = [300, 760];
      const fly = (el, a, x1, y1) => { const k = E.inOut(P(u, a, .9)); const on = u > a && u < a + 1.25; tf(el, { x: lerp(sendXY[0], x1, k), y: lerp(sendXY[1], y1, k) - Math.sin(k * Math.PI) * 140, s: .8 + .3 * Math.sin(k * Math.PI), o: on ? 1 - P(u, a + 1, .25) : 0 }); };
      fly(env1, b.toSend + .1, 330, 1110); fly(env2, b.ccSend + .1, 330, 1110); fly(env3, b.ccSend + .2, 670, 1110);
      let co = 0, cx = 0, cy = 0;
      [b.toSend, b.ccSend].forEach(a => { if (u > a - .8 && u < a + .5) { const k = E.inOut(P(u, a - .8, .7)); cx = lerp(700, 300, k); cy = lerp(1000, 770, k); co = clamp((u - a + .8) / .2) * (1 - P(u, a + .3, .2)); } });
      tf(cur, { x: cx, y: cy, o: co, s: 1 - .15 * Math.max(pressDepth(u, [b.toSend]), pressDepth(u, [b.ccSend])) });
      // visibility of To / CC
      put(vis.el, W(u, b.vis, b.wrong - .1, { from: .7, dy: 100 }));
      visEyes.forEach((e, i) => { const l = W(u, b.vis + .6 + i * .3, 1e9, { from: .2, dy: 0, el: true, d: .7 }); tf(e, { s: l.s * (1 + .1 * Math.sin(u * 4)), o: l.o }); });
      vis.chips.forEach((c, i) => { c.style.boxShadow = i > 0 && u > b.vis + .6 ? `0 0 0 ${3 + 2 * Math.sin(u * 4)}px rgba(47,107,255,.5)` : ''; });
      put(visCap, W(u, b.vis + .9, b.wrong - .1)); put(visNote, W(u, b.vis2, b.wrong - .1));
      // wrong use: sender puts all 50 in To
      put(wrong.el, W(u, b.wrong, b.warn - .1, { from: .7, dy: 100 })); put(wrongTag, W(u, b.wrong, b.warn - .1));
      chipsIn(wrong.R.to.chips, u, [b.wrong + .5, b.wrong + .7, b.wrong + .9, b.wrong + 1.1]);
      tf(wrong.R.to.cnt, W(u, b.wrong + 1.3, 1e9, { from: .2, dy: 0, el: true, d: .7 }));
      rowGlow(wrong.R.to, clamp((u - b.wrong - 1.4) / .3) * .9, '#EF4444');
      put(bad.el, W(u, b.warn, 1e9, { from: .7, dy: 100 })); put(badTag, W(u, b.warn, 1e9));
      bad.chips.forEach(c => { if (c.classList.contains('warn')) c.style.boxShadow = u > b.warn + .6 ? `0 0 0 ${3 + 2 * Math.sin(u * 5)}px rgba(239,68,68,.55)` : ''; });
      put(badCap, W(u, b.warn + .6, 1e9, { from: .4, el: true, d: .8 }));
    } });
  }

  // =====================================================================  SCENE 4 — BCC (centrepiece)
  {
    const sc = mkScene('s-expl'), b = B.expl;
    const bccHero = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:420px;text-align:center"><div class="bh-sh" style="display:inline-block;filter:drop-shadow(0 0 30px rgba(34,211,238,.8))">${IC.shield(200, '#2F6BFF')}</div><div class="hl" style="font-size:150px;line-height:1.05;letter-spacing:4px"><span class="cy">BCC</span></div></div>`);
    const bhSh = bccHero.querySelector('.bh-sh');
    const words = ['Blind', 'Carbon', 'Copy'].map((w, i) => add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:${830 + i * 92}px;text-align:center"><span class="hl" style="font-size:78px;letter-spacing:3px"><span class="cy" style="font-size:96px">${w[0]}</span>${w.slice(1).toUpperCase()}</span></div>`));
    const thai = add(sc, `<div class="row-c c" style="top:1130px"><div class="kw ${ess}" style="font-size:64px;background:linear-gradient(90deg,#FFD23F,#FFC107);color:#142B53;box-shadow:0 0 0 4px #fff,0 14px 34px rgba(255,210,63,.35)">${IC.lock(58, '#142B53')}สำเนาลับ</div></div>`);
    // sender view
    const sTag = add(sc, `<div class="row-c c" style="top:372px"><div class="cap dark ${ess}" style="font-size:38px">${IC.eye(46, '#22D3EE')}มุมมองผู้ส่ง: เห็นรายชื่อ BCC</div></div>`);
    const snd = Composer(sc, { x: 220, y: 470, rows: [
      { key: 'from', label: 'From', chips: [chipHTML('staff@example.com', { av: 'S' })] },
      { key: 'to', label: 'To', chips: [chipHTML('staff@example.com', { av: 'S' })] },
      { key: 'cc', label: 'CC' },
      { key: 'bcc', label: 'BCC', chips: [chipHTML(addr(1), { av: '01' }), chipHTML(addr(2), { av: '02' }), chipHTML(addr(3), { av: '03' }), chipHTML('+47 คน', { av: null, cls: 'more' })], count: '50 คน' },
      { key: 'subj', label: 'เรื่อง', th: true, text: 'แจ้งกำหนดการอบรม' }], body: 0 });
    snd.el.classList.add('c', ess);
    const cur = add(sc, cursorHTML());
    const bigEnv = add(sc, `<div class="abs" style="left:470px;top:560px;filter:drop-shadow(0 0 24px rgba(34,211,238,.9))">${IC.mail(140, '#22D3EE', '#0D1E3D')}</div>`);
    const grid = AppGrid(sc, { x: 226, y: 1040 });
    const paths = Paths(sc, grid, 540, 640);
    const dCap = add(sc, `<div class="row-c c" style="top:380px"><div class="cap dark ${ess}" style="font-size:40px">${IC.send(42, '#22D3EE')}ส่งถึงผู้สมัคร 50 คน</div></div>`);
    // recipient views
    const rTag = add(sc, `<div class="row-c c" style="top:372px"><div class="cap dark ${ess}" style="font-size:38px">${IC.eyeOff(46, '#22D3EE')}มุมมองผู้รับ: ผู้สมัคร 01</div></div>`);
    const ghost = `${IC.eyeOff(48, '#4A6488')}ไม่เห็นรายชื่อ BCC ของคนอื่น`;
    const r1 = Inbox(sc, { x: 220, y: 470, who: '01', whoAddr: addr(1), hdr: [{ k: 'From', chips: [chipHTML('staff@example.com', { av: 'S' })] }, { k: 'To', chips: [chipHTML('staff@example.com', { av: 'S' })] }], ghost, body: 2 });
    r1.el.classList.add('c', ess);
    const r1Cap = add(sc, `<div class="row-c c" style="top:1110px"><div class="cap ok ${ess}" style="font-size:40px">${IC.shield(46, '#16A34A')}รายชื่อผู้สมัครถูกซ่อน</div></div>`);
    const mini = (n, y) => { const v = Inbox(sc, { x: 220, y, who: n, whoAddr: addr(+n), hdr: [{ k: 'To', chips: [chipHTML('staff@example.com', { av: 'S' })] }], ghost: `${IC.eyeOff(44, '#4A6488')}ไม่เห็นรายชื่อ BCC คนอื่น`, body: 0 }); v.el.classList.add('c', ess); v.el.querySelector('.sj').style.display = 'none'; return v; };
    const r2 = mini('02', 440), r3 = mini('03', 770);
    const bothCap = add(sc, `<div class="row-c c" style="top:1110px"><div class="cap dark ${ess}" style="font-size:38px">${IC.eyeOff(46, '#22D3EE')}ผู้รับ BCC ด้วยกันก็ไม่เห็นกัน</div></div>`);
    // three-way comparison
    const cmpC = [['To', 'ผู้รับหลัก', ''], ['CC', 'สำเนา', ''], ['BCC', 'สำเนาลับ', 'bcc']].map(([k, v, c], i) => add(sc, `<div class="fcard ${c} c ${ess}" style="left:220px;top:${420 + i * 170}px"><div class="tg" style="${k === 'BCC' ? 'font-size:42px' : ''}">${k}</div><div class="tx">${v}</div>${c ? `<span style="margin-left:auto">${IC.shield(70, '#22D3EE')}</span>` : ''}</div>`));
    // limitation
    const lim = add(sc, `<div class="abs c ${ess}" style="left:220px;top:960px;width:640px;border-radius:32px;background:#fff;box-shadow:0 18px 40px rgba(0,0,0,.4),0 0 0 4px #FFD23F;padding:22px 24px">
      <div style="display:flex;align-items:center;justify-content:center;gap:22px;height:120px"><span class="l-a">${IC.mail(100, '#2F6BFF', '#E6F4FF')}</span><span class="l-f" style="width:120px;height:90px;border-radius:24px;background:#2F6BFF;display:grid;place-items:center">${IC.fwd(70, '#fff')}</span><span class="l-b">${IC.mail(100, '#5B7194', '#F1F5FB')}</span></div>
      <div style="text-align:center;font-weight:800;font-size:40px;color:#142B53;margin-top:8px">BCC ไม่ได้ห้ามส่งต่ออีเมล</div></div>`);
    const lF = lim.querySelector('.l-f'), lB = lim.querySelector('.l-b');

    sfx('stamp', X0 + b.bcc + .1, .6); sfx('sparkle', X0 + b.bcc + .3, .7); [0, 1, 2].forEach(i => sfx('pop', X0 + b.full + i * .45, .7)); sfx('ding', X0 + b.th, .6);
    sfx('whoosh', X0 + b.sender, .6); for (let i = 0; i < 4; i++) sfx('pop', X0 + b.sender + .4 + i * .18, .5);
    sfx('click', X0 + b.send + .5, .9); sfx('whoosh', X0 + b.send + .6, .8); sfx('riser', X0 + b.deliver - .4, .4); sfx('sparkle', X0 + b.deliver + .4, .7); for (let i = 0; i < 8; i++) sfx('msg', X0 + b.deliver + .5 + i * .12, .25);
    sfx('whoosh', X0 + b.rcv, .6); sfx('notify', X0 + b.rcv + .3, .5); sfx('zip', X0 + b.rcv + 1.2, .4);
    sfx('whoosh', X0 + b.both, .6); sfx('pop', X0 + b.both + .3, .5); sfx('pop', X0 + b.both + .6, .5);
    [b.to, b.cc, b.bccC].forEach(a => sfx('pop', X0 + a, .7)); sfx('sparkle', X0 + b.bccC + .2, .5);
    sfx('whoosh', X0 + b.limit, .6); sfx('swoosh', X0 + b.limit + .8, .5);

    scenes.push({ el: sc, a: X0, b: Q0, draw(t) {
      const u = t - X0;
      put(bccHero, W(u, b.bcc + .05, b.sender - .1, { from: .3, el: true, d: .9 }), { y: W(u, b.bcc + .05, b.sender - .1).y + bob(u, 0, 6) });
      tf(bhSh, { s: 1 + .1 * pulse(u, b.bcc + .6, .6), r: (1 - E.back(P(u, b.bcc, .7))) * -30 });
      words.forEach((w, i) => put(w, W(u, b.full + i * .45, b.sender - .1, { from: .4, dy: 40 }), { x: (1 - E.out(P(u, b.full + i * .45, .5))) * (i % 2 ? 40 : -40) }));
      put(thai, W(u, b.th, b.sender - .1, { from: .3, el: true, d: .9 }));
      // sender view → send
      const sl = W(u, b.sender, b.send + .9, { from: .8, dy: 80, out: .3 });
      const shrink = E.in(P(u, b.send + .6, .35));
      put(snd.el, sl, { s: sl.s * (1 - .7 * shrink), o: sl.o * (1 - shrink) });
      put(sTag, W(u, b.sender, b.send + .9));
      chipsIn(snd.R.bcc.chips, u, [b.sender + .4, b.sender + .58, b.sender + .76, b.sender + .94]);
      tf(snd.R.bcc.cnt, W(u, b.sender + 1.1, 1e9, { from: .2, dy: 0, el: true, d: .7 }));
      rowGlow(snd.R.bcc, clamp((u - b.sender - .3) / .3) * (1 - P(u, b.send + .4, .3)) * (.75 + .25 * Math.sin(u * 4)), '#22D3EE');
      snd.sendb.style.transform = `scale(${1 - .12 * pressDepth(u, [b.send + .5])})`;
      let co = 0, cx = 0, cy = 0;
      if (u > b.send - .3 && u < b.send + .8) { const k = E.inOut(P(u, b.send - .3, .7)); cx = lerp(760, 300, k); cy = lerp(1200, 1050, k); co = clamp((u - b.send + .3) / .2) * (1 - P(u, b.send + .65, .15)); }
      tf(cur, { x: cx, y: cy, o: co, s: 1 - .15 * pressDepth(u, [b.send + .5]) });
      // one message → 50 delivery paths (visual metaphor)
      const el = W(u, b.send + .8, b.rcv - .1, { from: .2, el: true, d: .7 });
      put(bigEnv, el, { y: el.y + bob(u, 0, 5), s: el.s * (1 + .08 * Math.sin(u * 5)) });
      put(dCap, W(u, b.deliver, b.rcv - .1));
      grid.set(u, { a: b.deliver - .6, stag: .012, out: b.rcv - .1, mail: b.deliver + .9, mailStag: .012 });
      paths.draw(u, b.deliver, 1.1, b.rcv - .6);
      // recipient 01
      put(rTag, W(u, b.rcv, b.both - .1)); put(r1.el, W(u, b.rcv, b.both - .1, { from: .7, dy: 100 }));
      const gk = W(u, b.rcv + 1.0, 1e9, { from: .6, dy: 0, el: true, d: .7 }); tf(r1.ghost, { s: gk.s, o: gk.o });
      put(r1Cap, W(u, b.rcv + 1.6, b.both - .1));
      // recipients 02 + 03
      put(r2.el, W(u, b.both + .2, b.to - .1, { from: .7, dy: 80 })); put(r3.el, W(u, b.both + .5, b.to - .1, { from: .7, dy: 80 }));
      [r2, r3].forEach((r, i) => r.ghost.style.boxShadow = u > b.both2 ? `0 0 0 ${3 + 2 * Math.sin(u * 4 + i)}px rgba(47,107,255,.45)` : '');
      put(bothCap, W(u, b.both2, b.to - .1, { from: .4, el: true, d: .8 }));
      // comparison + limitation
      cmpC.forEach((c, i) => { const a = [b.to, b.cc, b.bccC][i]; const l = W(u, a, 1e9, { from: .5, dy: 60 }); put(c, l, { x: (1 - E.out(P(u, a, .5))) * (i % 2 ? 40 : -40) }); });
      put(lim, W(u, b.limit, 1e9, { from: .5, dy: 80 }));
      const fk = (u - b.limit - .8) % 2.2;
      tf(lF, { x: u > b.limit + .8 ? 10 * Math.sin(Math.min(fk, 1) * Math.PI) : 0 }); tf(lB, { o: u > b.limit + 1.2 ? 1 : .25, s: 1 + .1 * pulse(u, b.limit + 1.2, .5) });
    } });
  }

  // =====================================================================  SCENE 5–7 — QUIZ · COUNTDOWN · ANSWER
  {
    const sc = mkScene('s-quiz'), b = B.quiz, a = B.ans;
    const kw = add(sc, `<div class="row-c c" style="top:356px"><div class="kw ${ess}" style="font-size:50px">เตรียมสอบนายสิบ</div></div>`);
    const QL = ['หากเจ้าหน้าที่ต้องส่งอีเมล', 'ถึง<b>ผู้สมัคร 50 คน</b> โดยไม่ต้องการ', 'ให้ผู้รับเห็นที่อยู่อีเมล', 'ของผู้รับคนอื่น ควรใช้ช่องใด', 'ในการระบุ<b>ผู้รับทั้ง 50 คน?</b>'];
    const qb = add(sc, `<div class="qbox c ${ess}" style="top:466px"><div style="display:flex;align-items:center;gap:12px;font-weight:700;font-size:30px;color:#2F6BFF;margin-bottom:8px">${IC.mail(36, '#2F6BFF')}วิชาคอมพิวเตอร์</div>${QL.map(l => `<div class="q ql" style="white-space:nowrap">${l}</div>`).join('')}</div>`);
    const qls = [...qb.querySelectorAll('.ql')];
    const opts = NSP.buildQuizOptions(sc, [['ก', 'To'], ['ข', 'CC'], ['ค', 'BCC'], ['ง', 'Reply All']]);
    opts.forEach((o, i) => { o.el.style.left = (i % 2 ? 552 : 228) + 'px'; o.el.style.top = (920 + Math.floor(i / 2) * 140) + 'px'; o.el.classList.add(ess); if (i === 3) o.el.classList.add('small'); });
    const think = add(sc, `<div class="abs c" style="left:480px;top:1225px;filter:drop-shadow(0 0 20px rgba(34,211,238,.7))">${IC.shield(120, '#2F6BFF')}</div>`);
    const cue = add(sc, `<div class="row-c c" style="top:1240px"><div class="cap dark ${ess}" style="font-size:42px">${NSP.ICON.timer(48, '#22D3EE')}คิด 5 วินาที</div></div>`);
    const cdEl = add(sc, `<div class="abs c ${ess}" style="left:430px;top:1200px"></div>`);
    const cd = NSP.buildCountdown(cdEl, 220);
    { const st = cdEl.querySelectorAll('stop'); st[0].setAttribute('stop-color', '#2F6BFF'); st[1].setAttribute('stop-color', '#22D3EE');
      const cs = cdEl.querySelectorAll('circle'); cs[0].setAttribute('fill', '#0D1E3D'); cs[1].setAttribute('stroke', '#24427A'); cd.dot.setAttribute('stroke', '#22D3EE');
      cd.num.style.color = '#fff'; cdEl.style.filter = 'drop-shadow(0 0 24px rgba(34,211,238,.45))'; }
    const conf = NSP.buildConfetti(sc, 60, 704, 1100);
    // answer panels
    const solTag = add(sc, `<div class="row-c c" style="top:356px"><div class="cap ok ${ess}" style="font-size:50px">${IC.check(52, '#16A34A')}เฉลย ข้อ ค. BCC</div></div>`);
    const side = (x, ico, title, line, extra) => add(sc, `<div class="abs c ${ess}" style="left:${x}px;top:470px;width:312px;height:500px;border-radius:32px;background:#fff;box-shadow:0 18px 40px rgba(0,0,0,.4),0 0 0 4px #2F6BFF;text-align:center;padding-top:26px">
      <div style="width:130px;height:130px;margin:0 auto;border-radius:50%;background:#EAF2FF;display:grid;place-items:center">${ico}</div>
      <div style="font-weight:800;font-size:46px;color:#142B53;margin-top:12px">${title}</div><div class="thai" style="font-weight:700;font-size:31px;color:#2F6BFF;margin-top:4px">${line}</div>${extra}</div>`);
    const sideL = side(220, IC.eye(96), 'ผู้ส่ง', 'เห็นรายชื่อ BCC', `<div style="display:flex;flex-direction:column;gap:10px;align-items:center;margin-top:18px">${[0, 1].map(() => '<i style="display:block;width:220px;height:30px;border-radius:15px;background:#E0F7FC;border:2px solid #7FDDEE"></i>').join('')}<span class="chip more" style="font-size:28px">BCC: 50 คน</span></div>`);
    const sideR = side(548, IC.eyeOff(96), 'ผู้รับ', 'ไม่เห็นรายชื่อ BCC<br>ของคนอื่น', `<div style="margin:18px auto 0;width:240px;height:96px;border-radius:20px;border:3px dashed #9DB6D9;display:grid;place-items:center">${IC.lock(56, '#9DB6D9')}</div>`);
    const grid = AppGrid(sc, { x: 226, y: 1020 });
    const gCap = add(sc, `<div class="row-c c" style="top:1338px"><div class="cap ok ${ess}" style="font-size:31px">${IC.shield(40, '#16A34A')}เหมาะกับการส่งถึงผู้สมัครจำนวนมาก</div></div>`);
    const whyRow = (y, bdg, key, l1, l2, ok) => add(sc, `<div class="abs c ${ess}" style="left:220px;top:${y}px;width:640px;height:150px;border-radius:30px;background:${ok ? '#ECFDF3' : '#fff'};box-shadow:0 14px 30px rgba(0,0,0,.35),0 0 0 4px ${ok ? '#22C55E' : '#95BFEF'};display:flex;align-items:center;gap:18px;padding:0 20px">
      <span style="flex:none;width:76px;height:76px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:40px;color:#fff;background:${ok ? '#22C55E' : '#2F6BFF'}">${bdg}</span>
      <span style="flex:none;min-width:120px;font-weight:800;font-size:${key.length > 4 ? 32 : 46}px;color:#142B53">${key}</span>
      <span class="thai" style="flex:1;font-weight:700;font-size:${key.length > 4 ? 26 : 29}px;color:#31445D;white-space:nowrap">${l1}${l2 ? `<br><span class="l2" style="color:${ok ? '#15803D' : '#B91C1C'}">${l2}</span>` : ''}</span>
      <span class="mk" style="flex:none;width:60px;height:60px;border-radius:50%;display:grid;place-items:center;background:${ok ? '#22C55E' : '#EF4444'}">${ok ? IC.check(38) : IC.cross(34)}</span></div>`);
    const wA = whyRow(430, 'ก', 'To', 'ผู้รับหลัก', 'รายชื่อมองเห็นได้'), wB = whyRow(600, 'ข', 'CC', 'ผู้รับสำเนา', 'รายชื่อมองเห็นได้'),
      wC = whyRow(770, 'ค', 'BCC', 'สำเนาลับ', 'ซ่อนรายชื่อผู้รับ', true), wD = whyRow(940, 'ง', 'Reply All', 'ตอบกลับทุกคน', 'ไม่ใช่ช่องซ่อนรายชื่อ');
    const wDl2 = wD.querySelector('.l2');
    const ra = add(sc, `<div class="row-c c" style="top:1130px"><div class="sendb ${ess}" style="font-size:36px;height:80px;padding:0 36px">${IC.replyAll(48, '#fff')}Reply All</div></div>`);
    const raCap = add(sc, `<div class="row-c c" style="top:1240px"><div class="cap ${ess}" style="font-size:34px">ปุ่มคำสั่งตอบกลับ ไม่ใช่ช่องใส่ผู้รับ</div></div>`);
    const sumTag = add(sc, `<div class="row-c c" style="top:380px"><div class="cap dark ${ess}" style="font-size:44px">${NSP.ICON.book(48, '#22D3EE')}จำง่าย ๆ</div></div>`);
    const sumC = [['To', 'ผู้รับหลัก', ''], ['CC', 'สำเนา', ''], ['BCC', 'สำเนาลับ', 'bcc']].map(([k, v, c], i) => add(sc, `<div class="fcard ${c} c ${ess}" style="left:220px;top:${500 + i * 170}px"><div class="tg" style="${k === 'BCC' ? 'font-size:42px' : ''}">${k}</div><div class="tx">= ${v}</div></div>`));
    const fin = add(sc, `<div class="row-c c" style="top:1040px"><div class="cap ok ${ess}" style="font-size:54px">${IC.check(56, '#16A34A')}คำตอบ: ค. BCC</div></div>`);
    const fin2 = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:1170px"><div class="hl thai" style="font-size:36px">ส่งถึง 50 คน ไม่เปิดเผยรายชื่อ<br><span class="cy">→ ใช้ BCC</span></div></div>`);

    const QA = [b.a, b.b, b.c, b.d];
    sfx('whoosh', Q0 + .05, .6); sfx('page', Q0 + b.q, .6); QA.forEach(x => sfx('pop', Q0 + x, .8));
    sfx('sparkle', Q0 + b.think2, .4); sfx('ding', Q0 + b.cue + .2, .4);
    for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', CD + i, 1);
    sfx('success', A0 + a.c, 1); sfx('sparkle', A0 + a.c + .2, .9);
    sfx('whoosh', A0 + a.why, .6); sfx('pop', A0 + a.why + .3, .5); sfx('pop', A0 + a.why + .6, .5); sfx('zip', A0 + a.why + 1.4, .4);
    sfx('whoosh', A0 + a.fit, .5); for (let i = 0; i < 8; i++) sfx('msg', A0 + a.fit + .6 + i * .1, .25);
    [a.a, a.b, a.d].forEach(x => { sfx('pop', A0 + x, .7); sfx('buzz', A0 + x + .9, .3); }); sfx('click', A0 + a.d + 1.2, .6);
    sfx('whoosh', A0 + a.sum, .6); [a.to, a.cc, a.bcc2].forEach(x => sfx('pop', A0 + x, .8)); sfx('success', A0 + a.fin, .7); sfx('sparkle', A0 + a.fin + .2, .6);
    mark('reveal', A0 + a.c);

    scenes.push({ el: sc, a: Q0, b: PR, draw(t) {
      const u = t - Q0, ua = t - (A0 + a.c), uA = t - A0, uc = t - CD;
      const qOut = A0 + a.why - Q0 - .1;   // quiz layout leaves when the explanation starts
      put(kw, W(u, b.title, Math.min(qOut, A0 + a.c - Q0 - .05)));   // gives its place to "เฉลย ข้อ ค. BCC"
      put(qb, W(u, b.title + .1, qOut, { from: .8, dy: 60 }));
      qls.forEach((l, i) => { const k = P(u, b.q + i * 1.7, .45); l.style.opacity = clamp(k * 2); l.style.transform = `translateX(${(1 - E.out(k)) * -40}px)`; });
      // answer highlight only from "ข้อ ค" (after the 150-frame countdown)
      NSP.drawQuizOptions(opts, u, ua, QA, 2);
      opts.forEach((o, i) => { const xs = (1 - E.out(P(u, QA[i], .55))) * (i % 2 ? 40 : -40); o.el.style.transform = o.el.style.transform.replace(/translate\([^)]*\)/, `translate(${xs}px,0px)`); });   // shorter slide-in than the shared default (safe zone)
      opts.forEach(o => { const lo = 1 - P(u, qOut, .3); o.el.style.opacity = +o.el.style.opacity * lo; if (lo <= 0) o.el.style.visibility = 'hidden'; });
      const th = W(u, b.think, b.cue - .1, { from: .3, el: true, d: .8 }); put(think, th, { s: th.s * (1 + .08 * Math.sin(u * 5)) });
      put(cue, W(u, b.cue, CD - Q0 - .05));
      NSP.drawCountdown(cd, uc, T.cd[1]);
      NSP.drawConfetti(conf, t, A0 + a.c + .1, 2.4);
      // answer
      put(solTag, W(uA, a.c, a.a - .1, { from: .4, el: true, d: .8 }));
      put(sideL, W(uA, a.why, a.a - .1, { from: .6, dy: 80 }), { x: (1 - E.out(P(uA, a.why, .5))) * -40 });
      put(sideR, W(uA, a.why + .3, a.a - .1, { from: .6, dy: 80 }), { x: (1 - E.out(P(uA, a.why + .3, .5))) * 40 });
      grid.set(uA, { a: a.fit, stag: .01, out: a.a - .1, mail: a.fit + .5, mailStag: .01, shield: a.fit + 1.2 });
      put(gCap, W(uA, a.fit + .3, a.a - .1));
      put(wA, W(uA, a.a, a.sum - .1, { from: .6, dy: 60 })); put(wB, W(uA, a.b, a.sum - .1, { from: .6, dy: 60 }));
      put(wC, W(uA, a.a + .4, a.sum - .1, { from: .6, dy: 60 })); put(wD, W(uA, a.d, a.sum - .1, { from: .6, dy: 60 }));
      [wA, wB, wD].forEach((w, i) => { const at = [a.a, a.b, a.d][i] + .9; tf(w.querySelector('.mk'), W(uA, at, 1e9, { from: .2, dy: 0, el: true, d: .6 })); });
      wDl2.style.opacity = clamp((uA - a.dNot) / .3);
      put(ra, W(uA, a.d + .3, a.sum - .1, { from: .4, el: true, d: .8 }), { s: W(uA, a.d + .3, a.sum - .1, { from: .4, el: true, d: .8 }).s * (1 - .1 * pressDepth(uA, [a.d + 1.2])) });
      put(raCap, W(uA, a.dNot, a.sum - .1));
      put(sumTag, W(uA, a.sum, 1e9));
      sumC.forEach((c, i) => { const at = [a.to, a.cc, a.bcc2][i]; const l = W(uA, at, 1e9, { from: .5, dy: 60 }); put(c, l, { x: (1 - E.out(P(uA, at, .5))) * (i % 2 ? 40 : -40) }); });
      put(fin, W(uA, a.fin, 1e9, { from: .3, el: true, d: .9 })); put(fin2, W(uA, a.fin + .4, 1e9));
    } });
  }

  // =====================================================================  SCENE 8 — PROMO (blue-dominant, real logo + approved poster)
  {
    const sc = mkScene('s-promo'), b = B.promo;
    const q1 = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:420px"><div class="hl thai" style="font-size:80px">ตอบ <span class="cy">ค.</span> ถูกไหม?</div></div>`);
    const cms = [0, 1, 2].map(i => add(sc, `<div class="abs c" style="left:${[250, 470, 330][i]}px;top:${[720, 860, 1010][i]}px;display:flex;align-items:center;gap:14px;padding:16px 26px;border-radius:28px;background:#fff;box-shadow:0 12px 26px rgba(0,0,0,.35)">${IC.comment(54, i === 1 ? '#22D3EE' : '#2F6BFF')}<span style="font-weight:800;font-size:44px;color:#142B53">ค. BCC</span><span style="width:44px;height:44px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${IC.check(28)}</span></div>`));
    const logo = add(sc, `<div class="abs c" style="left:330px;top:400px;width:420px"><img src="${BASE}brand/logo.png" style="width:420px;display:block;filter:drop-shadow(0 16px 30px rgba(0,0,0,.45))"></div>`);
    const name = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:880px"><div class="hl" style="font-size:84px">NaiSibPro</div><div class="hl thai" style="font-size:52px;color:#22D3EE">นายสิบโปร</div></div>`);
    const bank = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:430px;text-align:center"><div class="hl b-num" style="font-size:150px;color:#22D3EE">10,000+</div><div class="hl thai" style="font-size:48px;white-space:nowrap">รวมข้อสอบมากกว่าหมื่นข้อ</div></div>`);
    const bNum = bank.querySelector('.b-num');
    const docs = [...Array(6)].map((_, i) => add(sc, `<div class="abs c" style="left:${330 + i * 60}px;top:${800 + (i % 2) * 30}px">${NSP.ICON.docs(150, '#2F6BFF')}</div>`));
    const week = add(sc, `<div class="row-c c" style="top:1130px"><div class="kw ${ess}" style="font-size:52px">${NSP.ICON.cal(54, '#fff')}อัปเดตทุกสัปดาห์!</div></div>`);
    const poster = add(sc, `<div class="abs c" style="left:330px;top:380px;width:420px;height:747px;border-radius:30px;overflow:hidden;box-shadow:0 24px 50px rgba(0,0,0,.5),0 0 0 6px #fff"><img src="${BASE}brand/poster.jpg" style="width:420px;height:747px;display:block"></div>`);
    const ctas = [['like', 'กดไลก์'], ['share', 'กดแชร์'], ['bell', 'กดติดตาม']].map(([k, l], i) => add(sc, `<div class="abs c ${ess}" style="left:${226 + i * 214}px;top:1180px;width:200px;text-align:center"><div class="cb" style="width:150px;height:150px;margin:0 auto;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 14px 30px rgba(0,0,0,.4),0 0 0 6px rgba(34,211,238,.8)">${IC[k](86, '#2F6BFF')}</div><div style="margin-top:12px;font-weight:800;font-size:38px;color:#fff">${l}</div></div>`));
    const ctaLogo = add(sc, `<div class="abs c" style="left:380px;top:520px;width:320px"><img src="${BASE}brand/logo.png" style="width:320px;display:block;filter:drop-shadow(0 16px 30px rgba(0,0,0,.45))"></div>`);
    const ctaH = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:900px"><div class="hl thai" style="font-size:48px">ติดตาม <span class="cy">NaiSibPro</span></div></div>`);
    const endLogo = add(sc, `<div class="abs c" style="left:340px;top:420px;width:400px"><img src="${BASE}brand/logo.png" style="width:400px;display:block;filter:drop-shadow(0 16px 30px rgba(0,0,0,.45))"></div>`);
    const endTag = add(sc, `<div class="abs c ${ess}" style="left:220px;width:640px;top:900px"><div class="hl" style="font-size:84px">NaiSibPro</div><div class="hl thai" style="font-size:37px;white-space:nowrap">ติววันละนิด พิชิตข้อสอบตำรวจ!</div></div>`);
    const endKw = add(sc, `<div class="row-c c" style="top:1100px"><div class="kw ${ess}" style="font-size:46px">เตรียมสอบนายสิบ</div></div>`);
    const conf = NSP.buildConfetti(sc, 70, 540, 700);

    sfx('msg', PR + b.cm + .3, .7); sfx('msg', PR + b.cm + .7, .7); sfx('msg', PR + b.cm + 1.1, .7);
    sfx('riser', PR + b.brand - .6, .5); sfx('sparkle', PR + b.brand + .2, .8); sfx('whoosh', PR + b.bank, .5); for (let i = 0; i < 6; i++) sfx('coin', PR + b.bank + .2 + i * .15, .35);
    sfx('pop', PR + b.week, .7); sfx('whoosh', PR + b.x, .5); [0, .7, 1.4].forEach(d => sfx('click', PR + b.cta + d, .9)); sfx('ding', PR + b.end + .2, .7); sfx('sparkle', PR + b.end + .3, .8);
    mark('endcard', PR + b.end);

    scenes.push({ el: sc, a: PR, b: T.end + 1, draw(t) {
      const u = t - PR;
      put(q1, W(u, b.cm, b.brand - .1, { from: .4, el: true, d: .8 }));
      cms.forEach((c, i) => put(c, W(u, b.cm + .3 + i * .4, b.brand - .1, { from: .3, dy: 120 }), { y: W(u, b.cm + .3 + i * .4, b.brand - .1, { dy: 120 }).y + bob(u, i, 6) }));
      put(logo, W(u, b.brand, b.bank - .1, { from: .2, el: true, d: 1.0 }), { y: W(u, b.brand, b.bank - .1).y + bob(u, 0, 8) });
      put(name, W(u, b.brand + .4, b.bank - .1));
      put(bank, W(u, b.bank, b.x - .1, { from: .5, dy: 60 }));
      bNum.textContent = (Math.round(10000 * E.out(P(u, b.bank + .1, 1.4)) / 100) * 100).toLocaleString('en-US') + '+';
      docs.forEach((d, i) => put(d, W(u, b.bank + .2 + i * .1, b.x - .1, { from: .3, dy: -120 }), { r: (i % 2 ? 6 : -6) }));
      put(week, W(u, b.week, b.x - .1, { from: .3, el: true, d: .8 }));
      put(poster, W(u, b.x, b.cta - .1, { from: .6, dy: 80 }), { r: Math.sin(u) * 1.5 });
      ctas.forEach((c, i) => { const l = W(u, b.cta + i * .2, b.end - .1, { from: .3, dy: 60 }); put(c, l, { s: l.s * (1 - .12 * pressDepth(u, [b.cta + i * .7 + .3])) }); c.querySelector('.cb').style.background = u > b.cta + i * .7 + .35 ? '#E6F4FF' : '#fff'; });
      put(ctaLogo, W(u, b.cta, b.end - .1, { from: .3, el: true, d: .9 }), { y: W(u, b.cta, b.end - .1).y + bob(u, 0, 6) }); put(ctaH, W(u, b.cta + .2, b.end - .1));
      put(endLogo, W(u, b.end, 1e9, { from: .2, el: true, d: 1.0 }), { y: W(u, b.end, 1e9).y + bob(u, 0, 8) });
      put(endTag, W(u, b.end + .3, 1e9)); put(endKw, W(u, b.end + .5, 1e9));
      NSP.drawConfetti(conf, t, PR + b.end + .2, 2.4);
    } });
  }

  const bgDraw = Background();
  NSP.start({ scenes, wipes: [ST0, K0, X0, Q0, PR], brand: { showAt: 1.2, hideAt: PR }, ep: 'EP.38' });
  const base = window.renderAt;
  window.renderAt = t => { bgDraw(t); base(t); scenes.forEach(sc => { sc.el.style.transform = 'none'; }); };   // no scene push-in: keeps 640-px panels inside the safe zone
})();
