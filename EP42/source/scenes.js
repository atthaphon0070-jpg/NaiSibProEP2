// NaiSibPro EP.42 — 100 Mbps vs 500 MB (Bit & Byte trap). Blue-dominant classic 2D motion graphics.
// Audio-first: every scene boundary comes from TL (measured narration) and every beat from BEATS (beats.js).
(function () {
  const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark } = NSP;
  const T = window.TL, BT = window.BEATS, U = window.UNITS;
  const MBPS = DL.MBPS, MB = DL.MB, Mb = 'M<span class="lb">b</span>';
  const stage = $('stage'), brandEl = $('brand');
  const S = k => T[k][0];
  const FPS = T.fps || 30;
  const CD0 = S('cd'), CDF = Math.round(CD0 * FPS), CDN = Math.round(T.cd[1] * FPS);   // countdown start frame, 150 frames
  const ANS = S('ans'), AREV = ANS + 3.8;      // quiz scene keeps the cards on screen for the first 3.8 s of the answer
  const fmt = U.fmt;

  function mkScene(id) { const el = h(`<div class="scene" id="${id}"></div>`); stage.insertBefore(el, brandEl); return el; }
  const add = (p, html) => { const e = h(html); p.appendChild(e); return e; };
  const show = (el, t, a, b = 1e9, o = {}) => { const l = life(t, a, b, o); tf(el, l); return l; };
  const SV = {
    neq: (s, c = '#EF4444') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="vertical-align:middle"><path d="M4 9h16M4 15h16M16.5 3.5L7.5 20.5" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/></svg>`,
    arr: (s, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="vertical-align:middle"><path d="M3 12h16M13 6l6 6-6 6" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    down: (s, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 3v16M6 13l6 6 6-6" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    warn: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2.2L23 21H1z" fill="#EF4444" stroke="#FCA5A5" stroke-width="1" stroke-linejoin="round"/><path d="M12 9v5.6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="17.8" r="1.5" fill="#fff"/></svg>`,
    xc: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#EF4444"/><path d="M7.5 7.5l9 9M16.5 7.5l-9 9" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/></svg>`,
    okc: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="#22C55E"/><path d="M6.5 12.5l3.8 3.8 7.4-8" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    pc: (s, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="13" rx="2" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M8 21h8M12 16v5" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    bubble: (s, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="${c}"/><circle cx="8" cy="11" r="1.4" fill="#142B53"/><circle cx="12" cy="11" r="1.4" fill="#142B53"/><circle cx="16" cy="11" r="1.4" fill="#142B53"/></svg>`,
    like: (s, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M2 10h4v11H2zM8 21h9.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 19 10h-5.5l.8-4.2A2 2 0 0 0 12.4 3.4L8 9.5z" fill="${c}"/></svg>`,
    share: (s, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M14 4l8 7-8 7v-4C8 14 4.5 16 2 20c.8-6 4-11 12-12z" fill="${c}"/></svg>`,
    bell: (s, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM9.5 19a2.5 2.5 0 0 0 5 0z" fill="${c}"/></svg>`,
    cal: (s, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M3 10h18M8 3v4M16 3v4" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><path d="M8.5 15l2.2 2.2 4.5-4.5" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };

  // ======================= GLOBAL BACKGROUND (circuit traces + packets, organised) =======================
  const bgS = mkScene('bgx');
  const grid = add(bgS, `<div class="abs" style="left:-60px;top:-60px;width:1200px;height:2100px;background-image:linear-gradient(rgba(149,191,239,.065) 2px,transparent 2px),linear-gradient(90deg,rgba(149,191,239,.065) 2px,transparent 2px);background-size:60px 60px"></div>`);
  const orbs = [['rgba(47,107,255,.45)', 520, 160, 420], ['rgba(34,211,238,.28)', 460, 930, 1050], ['rgba(47,107,255,.35)', 560, 260, 1650]].map(([c, r, x, y]) =>
    ({ el: add(bgS, `<div class="abs" style="width:${r * 2}px;height:${r * 2}px;border-radius:50%;background:radial-gradient(circle,${c} 0%,rgba(0,0,0,0) 68%)"></div>`), r, x, y }));
  const TRACES = [
    [[30, 520], [150, 520], [150, 860], [70, 860], [70, 1250], [170, 1250], [170, 1500]],
    [[1050, 640], [940, 640], [940, 980], [1010, 980], [1010, 1380], [910, 1380], [910, 1520]],
    [[60, 1820], [330, 1820], [330, 1700], [740, 1700], [740, 1800], [1040, 1800]],
    [[560, 40], [560, 110], [820, 110], [820, 230], [1050, 230]],
  ].map(pts => { let L = 0; const seg = pts.slice(1).map((p, i) => { const a = pts[i], d = Math.hypot(p[0] - a[0], p[1] - a[1]); L += d; return { a, b: p, d, L }; }); return { pts, seg, L }; });
  add(bgS, `<svg class="abs" width="1080" height="1920" style="left:0;top:0">${TRACES.map(tr => `<polyline points="${tr.pts.map(p => p.join(',')).join(' ')}" fill="none" stroke="rgba(47,107,255,.42)" stroke-width="4" stroke-linejoin="round"/>` +
    tr.pts.map(p => `<circle cx="${p[0]}" cy="${p[1]}" r="7" fill="#142B53" stroke="rgba(34,211,238,.6)" stroke-width="3"/>`).join('')).join('')}</svg>`);
  const bgPk = [];
  TRACES.forEach((tr, ti) => { for (let k = 0; k < 3; k++) bgPk.push({ tr, ph: k / 3 + ti * .17, el: add(bgS, `<div class="abs" style="left:-9px;top:-9px;width:18px;height:18px;border-radius:5px;background:${k % 2 ? '#22D3EE' : '#6FA0FF'};box-shadow:0 0 14px ${k % 2 ? '#22D3EE' : '#6FA0FF'}"></div>`) }); });
  add(bgS, `<div class="scan"></div>`);
  add(bgS, `<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(4,10,26,.55) 100%)"></div>`);
  function drawBg(t) {
    grid.style.transform = `translateY(${(t * 14) % 60}px)`;
    orbs.forEach((o, i) => tf(o.el, { x: o.x - o.r + Math.sin(t * .22 + i * 2) * 70, y: o.y - o.r + Math.cos(t * .18 + i) * 60, s: 1 + .07 * Math.sin(t * .4 + i) }));
    bgPk.forEach(p => {
      const d = ((p.ph + t * 150 / p.tr.L) % 1) * p.tr.L;
      const sg = p.tr.seg.find(s => d <= s.L) || p.tr.seg[p.tr.seg.length - 1];
      const k = 1 - (sg.L - d) / sg.d;
      tf(p.el, { x: lerp(sg.a[0], sg.b[0], k), y: lerp(sg.a[1], sg.b[1], k), o: .9 });
    });
  }

  // ======================= SCENE 1 — HOOK (01_hook.mp3) =======================
  const H0 = S('hook'), hb = BT.hook;
  const sH = mkScene('s1');
  const hExam = add(sH, `<div class="ctr" style="top:366px"><div class="chipx chip-b" data-fit="640" style="font-size:56px;font-weight:800;padding:12px 46px">เตรียมสอบนายสิบ</div></div>`);
  const hComp = add(sH, `<div class="ctr" style="top:476px"><div class="chipx chip-c" style="font-size:34px;padding:8px 28px">${SV.pc(40)}วิชาคอมพิวเตอร์</div></div>`);
  const hWin = DL.window(sH, { y: 566, big: 56, timeLabel: 'ใช้เวลา: <b style="color:#FFD23F;font-size:40px">?</b> วินาที' });
  const hQ = add(sH, `<div class="abs c" style="left:728px;top:500px;width:118px;height:118px;border-radius:50%;display:grid;place-items:center;background:radial-gradient(circle at 35% 30%,#FFE27A,#FFD23F 60%,#E0AE10);color:#142B53;font-weight:800;font-size:84px;box-shadow:0 0 0 6px rgba(255,210,63,.3),0 0 40px rgba(255,210,63,.55)">?</div>`);
  const hHead = add(sH, `<div class="ctr th" style="top:1028px;flex-direction:column;font-size:54px;line-height:1.28;font-weight:800">
    <div>เน็ต <span class="glow">100 ${MBPS}</span></div><div>โหลดไฟล์ <span class="yglow">500 ${MB}</span></div><div style="color:#FFD23F">ใช้เวลากี่วินาที?</div></div>`);
  const hSrv = add(sH, `<div class="abs c" style="left:236px;top:1266px">${DL.SVG.server(64)}</div>`);
  const hLap = add(sH, `<div class="abs c" style="left:722px;top:1280px">${DL.SVG.laptop(130)}</div>`);
  const hPk = DL.packets(sH, { x0: 320, y0: 1320, x1: 712, y1: 1320, n: 9, lanes: 3, arc: 30 });
  // B: speed zoom
  const hbLab = add(sH, `<div class="ctr" style="top:600px"><div class="chipx chip-c" style="font-size:36px">${DL.SVG.wifi(40)}อินเทอร์เน็ตความเร็ว</div></div>`);
  const hbVal = add(sH, `<div class="ctr" style="top:690px"><div class="big glow" data-fit="640" style="font-size:132px">100 ${MBPS}</div></div>`);
  const hGauge = DL.gauge(sH, { x: 340, y: 870, size: 400 });
  const hbSub = add(sH, `<div class="ctr th" style="top:1150px;font-size:44px">เมกะ<span class="lb">บิต</span> ต่อ วินาที</div>`);
  // C: file 100 MB in 1 s?
  const hcFile = add(sH, `<div class="panel y abs c" style="left:220px;top:880px;width:640px;height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px">
    <div class="small" style="font-size:34px">ไฟล์ขนาด</div><div class="big yglow" style="font-size:124px">100 ${MB}</div><div class="th" style="font-size:46px">ใน 1 วินาที?</div></div>`);
  const hcX = add(sH, `<div class="abs c" style="left:600px;top:842px;transform-origin:50% 50%"><div class="chipx chip-r" style="font-size:44px;font-weight:800;transform:rotate(-10deg)">${SV.xc(44)}ไม่ถึง!</div></div>`);
  // D/E: Mb vs MB letter trap
  const hdHead = add(sH, `<div class="ctr" style="top:580px"><div class="chipx chip-r" style="font-size:42px">${SV.warn(44)}ข้อนี้หลายคนพลาด!</div></div>`);
  const tile = (x, L, cls, word, sub) => add(sH, `<div class="panel abs c" style="left:${x}px;top:690px;width:290px;height:300px;display:flex;flex-direction:column;align-items:center;justify-content:center">
      <div class="big" style="font-size:168px;line-height:1">M<span class="${cls} lt" style="display:inline-block">${L}</span></div><div class="th" style="font-size:34px">${word}</div><div class="small" style="font-size:28px">${sub}</div></div>`);
  const hdL = tile(220, 'b', 'lb', 'เมกะ<span class="lb">บิต</span>', 'b ตัวเล็ก'), hdR = tile(570, 'B', 'ub', 'เมกะ<span class="ub">ไบต์</span>', 'B ตัวใหญ่');
  const hdVs = add(sH, `<div class="abs c" style="left:506px;top:806px;width:68px;height:68px;border-radius:50%;display:grid;place-items:center;background:#EF4444;color:#fff;font-weight:800;font-size:30px;box-shadow:0 0 0 5px rgba(239,68,68,.3)">vs</div>`);
  const hdLetter = add(sH, `<div class="ctr th" style="top:1030px;font-size:50px;font-weight:800">เพราะตัวอักษร<span style="color:#FFD23F">แค่ตัวเดียว!</span></div>`);
  const heQ = add(sH, `<div class="panel abs c" style="left:220px;top:1030px;width:640px;height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center">
    <div class="th" style="font-size:52px;font-weight:800">ตัว <span class="lb big" style="font-size:84px">b</span> เล็ก กับ <span class="ub big" style="font-size:84px">B</span> ใหญ่</div><div class="th" style="font-size:52px;font-weight:800;color:#FFD23F">ต่างกันอย่างไร?</div></div>`);
  const hdLt = [hdL.querySelector('.lt'), hdR.querySelector('.lt')];
  sfx('pop', H0 + hb.comp, .5); sfx('whoosh', H0 + hb.speed - .1, .6); sfx('riser', H0 + hb.speed + .1, .6); sfx('pop', H0 + hb.file + .05, .7);
  sfx('stamp', H0 + hb.file + 1.9, .7); sfx('whoosh', H0 + hb.trap - .1, .6); sfx('pop', H0 + hb.trap + .3, .6); sfx('pop', H0 + hb.trap + .5, .6);
  sfx('ding', H0 + hb.letter, .7); sfx('pop', H0 + hb.q + .05, .7);
  const sceneH = { el: sH, a: H0, b: S('story'), draw(t) {
    const u = t - H0;
    tf(hExam, { s: 1 + .04 * Math.max(0, Math.sin(u * 3)) * (u < 1 ? 1 : 0) + .015 * Math.sin(u * 2) });
    tf(hComp, { s: 1 + .08 * E.out(1 - clamp(Math.abs(u - hb.comp - .15) / .3)) });
    // A — frame-zero composition (fully visible at t = 0)
    const A = life(u, -1, hb.speed, { out: .35 });
    tf(hWin.el, { ...A, y: A.y + bob(u, 0, 6, 1.4) });
    hWin.set(.04 + .16 * E.inOut(clamp(u / 4)), u);
    tf(hQ, { ...A, y: A.y + bob(u, 1, 10, 2.2), r: Math.sin(u * 2.4) * 8, s: A.s * (1 + .06 * Math.sin(u * 4)) });
    tf(hHead, A); tf(hSrv, A); tf(hLap, A); hPk.draw(u, A.o, .5);
    // B — speed
    show(hbLab, u, hb.speed + .1, hb.file);
    const vb = life(u, hb.speed, hb.trap, { from: .3, d: .6 });
    const toC = E.inOut(P(u, hb.file, .5));
    tf(hbVal, { ...vb, s: vb.s * lerp(1, .62, toC), y: vb.y + lerp(0, -100, toC) });
    show(hGauge.el, u, hb.speed + .2, hb.file); hGauge.set(.82 * E.out(P(u, hb.speed + .3, 1.6)) + .02 * Math.sin(u * 9) * P(u, hb.speed + 1.9, .3));
    show(hbSub, u, hb.speed + .6, hb.file);
    // C — 100 MB in 1 s?
    show(hcFile, u, hb.file + .05, hb.trap, { from: .5 });
    const xl = life(u, hb.file + 1.9, hb.trap, { from: 2.2, d: .35 }); tf(hcX, { ...xl, r: -4 });
    // D/E — letter trap
    show(hdHead, u, hb.trap + .05, 1e9);
    const tl = life(u, hb.trap + .3, 1e9, { from: .3, el: true, d: .8 }), tr = life(u, hb.trap + .5, 1e9, { from: .3, el: true, d: .8 });
    tf(hdL, { ...tl, x: (1 - E.out(P(u, hb.trap + .3, .5))) * -200 }); tf(hdR, { ...tr, x: (1 - E.out(P(u, hb.trap + .5, .5))) * 200 });
    show(hdVs, u, hb.trap + .8, 1e9, { el: true });
    const pulse = P(u, hb.letter, .4);
    hdLt.forEach((e, i) => {
      const k = pulse * (1 + .5 * Math.sin((u - hb.letter) * 5 + i));
      e.style.transform = `scale(${1 + .16 * E.back(pulse) - .04 * (1 - k)})`;
      e.style.textShadow = `0 0 ${10 + 26 * pulse}px rgba(255,210,63,${.25 + .5 * pulse * clamp(k)})`;
    });
    show(hdLetter, u, hb.letter, hb.q - .1);
    show(heQ, u, hb.q, 1e9, { from: .6 });
  } };

  // ======================= SCENE 2 — STORY (02_story.mp3) =======================
  const S2 = S('story'), sb = BT.story;
  const sS = mkScene('s2');
  const sHdr = add(sS, `<div class="ctr" style="top:366px"><div class="chipx chip-b" style="font-size:40px">${SV.down(42, '#fff')}สถานการณ์จำลอง</div></div>`);
  const sWin = DL.window(sS, { y: 462, big: 56, timeLabel: 'กำลังดาวน์โหลด...' });
  const sSrv = add(sS, `<div class="abs c" style="left:236px;top:930px">${DL.SVG.server(64)}<div class="small" style="font-size:24px;text-align:center;margin-top:4px">เซิร์ฟเวอร์</div></div>`);
  const sLap = add(sS, `<div class="abs c" style="left:722px;top:944px">${DL.SVG.laptop(130)}<div class="small" style="font-size:24px;text-align:center">คอมของเรา</div></div>`);
  const sSpd = add(sS, `<div class="ctr" style="top:1110px"><div class="chipx chip-c" style="font-size:40px;font-weight:800">${DL.SVG.wifi(44)}100 ${MBPS}</div></div>`);
  const sPk = DL.packets(sS, { x0: 320, y0: 985, x1: 712, y1: 985, n: 12, lanes: 3, arc: 36 });
  const sThink = add(sS, `<div class="ctr" style="top:470px"><div class="chipx chip-c" style="font-size:38px">${SV.bubble(42)}หลายคนอาจคิดว่า...</div></div>`);
  const sEq = add(sS, `<div class="panel abs c" style="left:220px;top:575px;width:640px;height:220px;display:flex;align-items:center;justify-content:center;gap:22px">
    <span class="big e1" style="font-size:96px">500</span><span class="big e2" style="font-size:96px">÷ 100</span><span class="big e3" style="font-size:96px;color:#FFD23F">= 5</span>
    <div class="strike abs" style="left:40px;right:40px;top:104px;height:12px;border-radius:6px;background:#EF4444;box-shadow:0 0 14px #EF4444;transform-origin:left center"></div></div>`);
  const sEqR = add(sS, `<div class="abs" style="left:220px;top:575px;width:640px;height:220px;border-radius:32px;box-shadow:0 0 0 4px #EF4444,0 0 50px rgba(239,68,68,.5);background:rgba(239,68,68,.12)"></div>`);
  const sFive = add(sS, `<div class="ctr" style="top:822px"><div class="chipx chip-y" style="font-size:42px;font-weight:800">5 วินาที?</div></div>`);
  const sStamp = add(sS, `<div class="abs c" style="left:560px;top:520px"><div class="chipx chip-r" style="font-size:46px;font-weight:800;transform:rotate(8deg)">${SV.warn(46)}ผิด!</div></div>`);
  const sT1 = add(sS, `<div class="panel y abs c" style="left:220px;top:930px;width:260px;height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center">
    <div class="big" style="font-size:120px;line-height:1">M<span class="ub">B</span></div><div class="small" style="font-size:28px">ไฟล์ 500 ${MB}</div><div class="th" style="font-size:28px">หน่วย <span class="ub">Byte</span></div></div>`);
  const sNeq = add(sS, `<div class="abs c" style="left:490px;top:1005px;width:100px;height:100px">${SV.neq(100)}</div>`);
  const sT2 = add(sS, `<div class="panel abs c" style="left:600px;top:930px;width:260px;height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center">
    <div class="big" style="font-size:120px;line-height:1">M<span class="lb">b</span></div><div class="small" style="font-size:28px">เน็ต 100 ${MBPS}</div><div class="th" style="font-size:28px">หน่วย <span class="lb">bit</span></div></div>`);
  const sConv = add(sS, `<div class="ctr" style="top:1224px"><div class="chipx chip-y" data-fit="640" style="font-size:50px;font-weight:800;padding:14px 40px">ต้องแปลงหน่วยก่อน!</div></div>`);
  const sE = [1, 2, 3].map(i => sEq.querySelector('.e' + i)), sStrike = sEq.querySelector('.strike');
  sfx('pop', S2 + sb.file + .2, .7); sfx('notify', S2 + sb.speed + .1, .8); sfx('whoosh', S2 + sb.think - .1, .5);
  [0, .7, 1.6].forEach((d, i) => sfx('type', S2 + sb.calc + d, .8)); sfx('stamp', S2 + sb.wrong, .9); sfx('pop', S2 + sb.units + .2, .6); sfx('pop', S2 + sb.units + .5, .6); sfx('ding', S2 + sb.convert, .8);
  const sceneS = { el: sS, a: S2, b: S('know'), draw(t) {
    const u = t - S2;
    show(sHdr, u, .05, 1e9);
    const W = life(u, sb.file, sb.think, { from: .7, dy: 60 });
    tf(sWin.el, W);
    tf(sWin.file, { o: clamp((u - sb.file - .1) / .3), x: (1 - E.out(P(u, sb.file + .1, .5))) * -60 });
    tf(sWin.speed, { o: clamp((u - sb.speed) / .3), x: (1 - E.out(P(u, sb.speed, .5))) * 60 });
    sWin.set(.35 * E.inOut(P(u, sb.speed + .3, 3.7)), u);
    show(sSrv, u, sb.file + .3, sb.think); show(sLap, u, sb.file + .45, sb.think); show(sSpd, u, sb.speed, sb.think);
    sPk.draw(u, clamp((u - sb.speed) / .4) * (1 - P(u, sb.think, .3)), .55);
    show(sThink, u, sb.think, sb.units - .1);
    show(sEq, u, sb.think + .2, 1e9, { from: .7 });
    sE.forEach((e, i) => { const k = E.back(P(u, sb.calc + [0, .7, 1.6][i], .45)); e.style.opacity = clamp(k * 2); e.style.transform = `translateY(${(1 - k) * 40}px) scale(${.6 + .4 * k})`; });
    const wr = P(u, sb.wrong, .35);
    sStrike.style.transform = `scaleX(${E.out(wr)})`;
    sEqR.style.opacity = wr * (.75 + .25 * Math.sin(u * 7));
    sE.forEach(e => { e.style.filter = wr > 0 ? `opacity(${1 - .45 * wr})` : ''; });
    show(sFive, u, sb.calc + 2.1, 1e9);
    sFive.firstChild.style.textDecoration = wr > .5 ? 'line-through' : 'none';
    sFive.firstChild.style.textDecorationColor = '#EF4444'; sFive.firstChild.style.textDecorationThickness = '6px';
    const st = life(u, sb.wrong, 1e9, { from: 2, d: .3 }); tf(sStamp, st);
    const t1 = life(u, sb.units + .15, 1e9, { from: .4, el: true, d: .8 }), t2 = life(u, sb.units + .45, 1e9, { from: .4, el: true, d: .8 });
    tf(sT1, { ...t1, x: (1 - E.out(P(u, sb.units + .15, .5))) * -160 }); tf(sT2, { ...t2, x: (1 - E.out(P(u, sb.units + .45, .5))) * 160 });
    const nq = life(u, sb.units + .8, 1e9, { from: .2, el: true, d: .8 }); tf(sNeq, { ...nq, r: Math.sin(u * 3) * 4 });
    const cv = life(u, sb.convert, 1e9, { from: .4 }); tf(sConv, { ...cv, s: cv.s * (1 + .03 * Math.sin(u * 5)) });
  } };

  // ======================= SCENE 3 — BIT vs BYTE (03_knowledge.mp3) =======================
  const K0 = S('know'), kb = BT.know;
  const sK = mkScene('s3');
  const kHdr = add(sK, `<div class="ctr" style="top:366px"><div class="chipx chip-b" data-fit="640" style="font-size:40px">บิต (<span style="color:#9FF0FF">bit</span>) กับ ไบต์ (<span style="color:#FFE27A">Byte</span>)</div></div>`);
  const card = (x, L, cls, name, th, sub) => add(sK, `<div class="panel abs c" style="left:${x}px;top:466px;width:305px;height:350px;display:flex;flex-direction:column;align-items:center;justify-content:center">
    <div class="big ${cls}" style="font-size:220px;line-height:.95;${cls === 'lb' ? 'text-shadow:0 0 30px rgba(34,211,238,.6)' : 'text-shadow:0 0 30px rgba(255,210,63,.55)'}">${L}</div>
    <div class="th" style="font-size:40px;font-weight:800">${name} · ${th}</div><div class="small" style="font-size:28px">${sub}</div></div>`);
  const kL = card(220, 'b', 'lb', 'bit', 'บิต', 'b ตัวพิมพ์เล็ก'), kR = card(555, 'B', 'ub', 'Byte', 'ไบต์', 'B ตัวพิมพ์ใหญ่');
  const kBit = add(sK, `<div class="panel abs c" style="left:220px;top:860px;width:640px;height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px">
    <div class="big" style="font-size:104px">bit = <span class="lb" style="font-size:130px">b</span></div><div class="th" style="font-size:36px">หน่วยข้อมูลขนาดเล็ก · ตัว<span class="lb">พิมพ์เล็ก</span></div></div>`);
  const kByte = add(sK, `<div class="panel y abs c" style="left:220px;top:860px;width:640px;height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px">
    <div class="big" style="font-size:104px">Byte = <span class="ub" style="font-size:130px">B</span></div><div class="th" style="font-size:36px">ใช้ตัว B ภาษาอังกฤษ · ตัว<span class="ub">พิมพ์ใหญ่</span></div></div>`);
  const kBox = add(sK, `<div class="abs c" style="left:250px;top:858px;width:580px;height:112px;border-radius:24px;border:4px dashed rgba(255,210,63,.85);background:rgba(255,210,63,.07)"></div>`);
  const kBoxTag = add(sK, `<div class="abs c" style="left:676px;top:828px"><div class="chipx chip-y" style="font-size:28px;padding:4px 18px;font-weight:800">1 Byte</div></div>`);
  const BITS = '01000010';
  const kBlk = [...BITS].map((d, i) => ({ el: add(sK, `<div class="bitblk">${d}</div>`), tx: 270 + i * 70, ty: 884, fx: [120, 900, 300, 820, 160, 940, 420, 700][i], fy: [1180, 1240, 1330, 1150, 1400, 1360, 1250, 1420][i] }));
  const kEight = add(sK, `<div class="ctr" style="top:996px"><div class="big" data-fit="640" style="font-size:80px"><span class="lb">8 bits</span> = <span class="ub">1 Byte</span></div></div>`);
  const kMega = add(sK, `<div class="panel y abs c" style="left:220px;top:1110px;width:640px;height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">
    <div class="big" data-fit="600" style="font-size:104px">1 ${MB} = <span style="color:#FFD23F">8</span> ${Mb}</div>
    <div class="chipx chip-c" style="font-size:30px;padding:6px 22px">หน่วยแบบฐานสิบ (decimal)</div></div>`);
  const kMas = add(sK, `<div class="mas" style="left:800px;top:1400px"><img src="../../shared/brand/mascot_presenter.png" style="height:560px"></div>`);
  sfx('pop', K0 + .3, .6); sfx('pop', K0 + .55, .6); sfx('ding', K0 + kb.bit, .6); sfx('ding', K0 + kb.byte, .6);
  BITS.split('').forEach((_, i) => sfx('pop', K0 + kb.eight + .1 + i * .11 + .45, .45)); sfx('success', K0 + kb.eight + 1.5, .7); sfx('whoosh', K0 + kb.mega - .1, .5); sfx('ding', K0 + kb.mega + .3, .8);
  const sceneK = { el: sK, a: K0, b: S('expl'), draw(t) {
    const u = t - K0;
    show(kHdr, u, .05, 1e9);
    const focL = P(u, kb.bit, .4) * (1 - P(u, kb.byte, .4)), focR = P(u, kb.byte, .4) * (1 - P(u, kb.eight, .4));
    const lL = life(u, .3, 1e9, { from: .3, el: true, d: .8 }), lR = life(u, .55, 1e9, { from: .3, el: true, d: .8 });
    tf(kL, { ...lL, s: lL.s * (1 + .07 * focL), o: lL.o * (1 - .55 * focR) });
    tf(kR, { ...lR, s: lR.s * (1 + .07 * focR), o: lR.o * (1 - .55 * focL) });
    kL.style.boxShadow = focL > .01 ? `0 0 0 ${3 + 3 * focL}px #22D3EE,0 0 ${60 * focL}px rgba(34,211,238,.6)` : '';
    kR.style.boxShadow = focR > .01 ? `0 0 0 ${3 + 3 * focR}px #FFD23F,0 0 ${60 * focR}px rgba(255,210,63,.5)` : '';
    show(kBit, u, kb.bit + .1, kb.byte - .05, { from: .6 });
    show(kByte, u, kb.byte + .1, kb.eight - .05, { from: .6 });
    show(kBox, u, kb.eight, 1e9, { from: .8 }); show(kBoxTag, u, kb.eight + 1.4, 1e9, { from: .3, el: true, d: .8 });
    kBox.style.boxShadow = `0 0 ${40 * P(u, kb.eight + 1.4, .4) * (1 - P(u, kb.eight + 2.4, .8))}px rgba(255,210,63,.7)`;
    kBlk.forEach((b, i) => {
      const a = kb.eight + .1 + i * .11, k = E.out(P(u, a, .55));
      tf(b.el, { x: lerp(b.fx, b.tx, k), y: lerp(b.fy, b.ty, k) - Math.sin(k * Math.PI) * 120, r: (1 - k) * (i % 2 ? 200 : -200), s: lerp(.4, 1, k), o: clamp((u - a) * 5) });
    });
    show(kEight, u, kb.eight + 1.4, 1e9, { from: .5 });
    show(kMega, u, kb.mega + .1, 1e9, { from: .5 });
    const mm = life(u, .6, 1e9, { from: 1, dy: 300, d: .9 }); tf(kMas, { ...mm, y: mm.y + bob(u, 0, 6, 2), r: Math.sin(u * 1.4) * 2 });
  } };

  // ======================= SCENE 4 — PREPARING THE CALCULATION (04_explanation.mp3) =======================
  const X0 = S('expl'), xb = BT.expl;
  const sX = mkScene('s4');
  const xHdr = add(sX, `<div class="ctr" style="top:366px"><div class="chipx chip-b" style="font-size:40px">เตรียมคำนวณ · แปลงหน่วยก่อน</div></div>`);
  const row = (y, hgt, lab, cls = '') => add(sX, `<div class="panel ${cls} abs c" style="left:220px;top:${y}px;width:640px;height:${hgt}px"><div class="small" style="position:absolute;left:26px;top:14px;font-size:28px">${lab}</div></div>`);
  const xR1 = row(458, 182, 'ความเร็วเน็ต'), xR2 = row(664, 262, 'ขนาดไฟล์', 'y'), xR3 = row(950, 262, 'เวลาในการดาวน์โหลด');
  const inRow = (r, top, html, fs, fit = 600) => add(r, `<div class="abs c" style="left:0;right:0;top:${top}px;display:flex;justify-content:center"><div class="big" data-fit="${fit}" style="font-size:${fs}px">${html}</div></div>`);
  const x1a = inRow(xR1, 56, `100 ${MBPS}`, 84), x1b = inRow(xR1, 46, `100 ${Mb}/s`, 84);
  const x1c = add(xR1, `<div class="abs c th" style="left:0;right:0;top:136px;font-size:30px;color:#9FF0FF">= เมกะบิต ต่อ วินาที</div>`);
  const x2a = inRow(xR2, 56, `500 ${MB}<span class="x2m" style="display:inline-block">&nbsp;× 8</span>`, 84);
  const x2tag = add(xR2, `<div class="abs c" style="left:0;right:0;top:162px;display:flex;justify-content:center"><div class="chipx chip-c" style="font-size:34px">แปลง <span class="ub">Byte</span> ${SV.arr(34)} <span class="lb">bit</span> (×8)</div></div>`);
  const x2c = inRow(xR2, 150, `= <span style="color:#FFD23F">4,000</span> ${Mb}`, 84);
  const x3a = add(xR3, `<div class="abs c th" style="left:0;right:0;top:58px;font-size:40px;font-weight:800">เวลา = ขนาดข้อมูล ÷ ความเร็ว</div>`);
  const x3b = inRow(xR3, 140, `4,000 ${Mb} ÷ 100 ${Mb}/s = <span class="qm" style="display:inline-block;color:#FFD23F">?</span>`, 56);
  const xThink = add(sX, `<div class="ctr" style="top:1240px"><div class="chipx chip-y" data-fit="640" style="font-size:50px;font-weight:800;padding:14px 40px">คุณคิดว่าใช้กี่วินาที?</div></div>`);
  const xMas = add(sX, `<div class="mas" style="left:-30px;top:1420px"><img src="../../shared/brand/mascot_pose.png" style="height:520px"></div>`);
  const x2m = x2a.querySelector('.x2m'), xqm = x3b.querySelector('.qm');
  sfx('pop', X0 + xb.speed, .6); sfx('whoosh', X0 + xb.means, .4); sfx('pop', X0 + xb.file, .6); sfx('ding', X0 + xb.convert, .5);
  sfx('type', X0 + xb.mult + .1, .8); sfx('type', X0 + xb.mult + 1.9, .8); sfx('pop', X0 + xb.formula, .6); sfx('type', X0 + xb.eq, .8); sfx('riser', X0 + xb.think - .4, .5); sfx('pop', X0 + xb.think, .7);
  const sceneX = { el: sX, a: X0, b: S('quiz'), draw(t) {
    const u = t - X0;
    show(xHdr, u, .05, 1e9);
    const dim = .6 * E.out(P(u, xb.think, .5));
    [[xR1, .15], [xR2, .3], [xR3, .45]].forEach(([r, d]) => { const l = life(u, d, 1e9, { from: .8 }); tf(r, { ...l, o: l.o * (1 - dim) }); });
    const mo = E.inOut(P(u, xb.means, .5));
    tf(x1a, { o: clamp((u - xb.speed) / .3) * (1 - mo), s: (lerp(.5, 1, E.back(P(u, xb.speed, .5)))) * (1 - .3 * mo), y: -30 * mo });
    tf(x1b, { o: mo, s: lerp(1.25, 1, mo), y: 20 * (1 - mo) }); tf(x1c, { o: clamp((u - xb.means - .5) / .3) });
    tf(x2a, { o: clamp((u - xb.file) / .3), s: lerp(.5, 1, E.back(P(u, xb.file, .5))) });
    const m = E.back(P(u, xb.mult, .45)); x2m.style.opacity = clamp(m * 2); x2m.style.transform = `translateX(${(1 - m) * 60}px)`;
    show(x2tag, u, xb.convert, xb.mult + 1.8, { from: .5 });
    show(x2c, u, xb.mult + 1.9, 1e9, { from: .4 });
    show(x3a, u, xb.formula, 1e9, { from: .6 });
    show(x3b, u, xb.eq, 1e9, { from: .6 });
    xqm.style.transform = `scale(${1 + .18 * Math.max(0, Math.sin((u - xb.eq) * 5))})`;
    const th = life(u, xb.think, 1e9, { from: .4 }); tf(xThink, { ...th, s: th.s * (1 + .03 * Math.sin(u * 5)) });
    const mm = life(u, .8, 1e9, { from: 1, dy: 300, d: .9 }); tf(xMas, { ...mm, y: mm.y + bob(u, 0, 6, 2) });
  } };

  // ======================= SCENES 5–7a — QUIZ + 5 s COUNTDOWN + REVEAL ON THE CARDS =======================
  const Q0 = S('quiz'), qb = BT.quiz, ab = BT.ans;
  const sQ = mkScene('s5');
  const qTitle = add(sQ, `<div class="ctr" style="top:366px"><div class="chipx chip-b" data-fit="640" style="font-size:36px;font-weight:800">เตรียมสอบนายสิบ · วิชาคอมพิวเตอร์</div></div>`);
  const qCard = add(sQ, `<div class="panel abs c" style="left:220px;top:454px;width:640px;height:322px;padding:20px 26px;display:flex;flex-direction:column;justify-content:center;align-items:center">
    <span class="qline th" data-fit="588" style="font-size:35px">อินเทอร์เน็ตมีความเร็วคงที่ <b class="glow">100 ${MBPS}</b></span>
    <span class="qline th" data-fit="588" style="font-size:35px">ดาวน์โหลดไฟล์ขนาด <b class="yglow">500 ${MB}</b></span>
    <span class="qline th" data-fit="588" style="font-size:35px">ไม่คิดความสูญเสียหรือข้อจำกัดอื่น</span>
    <span class="qline th" data-fit="588" style="font-size:42px;font-weight:800;color:#FFD23F">จะใช้เวลากี่วินาที?</span></div>`);
  const qLines = [...qCard.querySelectorAll('.qline')];
  const qOpts = NSP.buildQuizOptions(sQ, U.CHOICES.map(([k, v]) => [k, `${v} วินาที`]), { top: 800, gap: 0 });
  qOpts.forEach((o, i) => { o.el.style.left = (i % 2 ? 550 : 220) + 'px'; o.el.style.top = (i < 2 ? 800 : 942) + 'px'; });
  const qHint = add(sQ, `<div class="ctr" style="top:1100px"><div class="chipx chip-y" data-fit="640" style="font-size:38px;font-weight:800">อย่าลืม! แปลง ${MB} ${SV.arr(38, '#142B53')} ${Mb} ก่อน</div></div>`);
  qHint.querySelectorAll('.ub,.lb').forEach(e => { e.style.color = '#142B53'; e.style.textDecoration = 'underline'; });
  const qCue = add(sQ, `<div class="ctr" style="top:1100px"><div class="chipx chip-c" style="font-size:42px;font-weight:800">ให้เวลาคิด 5 วินาที!</div></div>`);
  // countdown: electric-blue digits + cyan ring, exactly CDN frames, frame-indexed (no float drift)
  const CDS = 316, CR = 132, CC = 2 * Math.PI * CR;
  const qCd = add(sQ, `<div class="abs c" style="left:${540 - CDS / 2}px;top:1092px;width:${CDS}px;height:${CDS}px">
    <svg width="${CDS}" height="${CDS}" viewBox="0 0 ${CDS} ${CDS}" style="position:absolute;inset:0"><defs><linearGradient id="cdg2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#22D3EE"/><stop offset="1" stop-color="#2F6BFF"/></linearGradient></defs>
    <circle cx="${CDS / 2}" cy="${CDS / 2}" r="${CDS / 2 - 6}" fill="#0E2348" stroke="rgba(34,211,238,.35)" stroke-width="3"/>
    <circle cx="${CDS / 2}" cy="${CDS / 2}" r="${CR}" fill="none" stroke="rgba(149,191,239,.18)" stroke-width="20"/>
    <circle class="cd-ring" cx="${CDS / 2}" cy="${CDS / 2}" r="${CR}" fill="none" stroke="url(#cdg2)" stroke-width="20" stroke-linecap="round" stroke-dasharray="${CC}" stroke-dashoffset="0" transform="rotate(-90 ${CDS / 2} ${CDS / 2})" style="filter:drop-shadow(0 0 10px #22D3EE)"/></svg>
    <div class="cd-num" style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:170px;line-height:1;color:#4F8BFF;text-shadow:0 0 30px rgba(47,107,255,.9),0 0 8px rgba(34,211,238,.8);padding-top:8px"></div></div>`);
  const cdRing = qCd.querySelector('.cd-ring'), cdNum = qCd.querySelector('.cd-num');
  const qSol = add(sQ, `<div class="ctr" style="top:1110px;flex-direction:column;gap:14px"><div class="chipx chip-g" style="font-size:60px;font-weight:800;padding:12px 50px">${ICON.check('#fff', 56)}เฉลย!</div>
    <div class="big qsol2" style="font-size:76px;color:#4ADE80;text-shadow:0 0 26px rgba(34,197,94,.6)">ค. 40 วินาที</div></div>`);
  const qSol2 = qSol.querySelector('.qsol2');
  const qConf = add(sQ, `<div class="abs" style="inset:0"></div>`);
  const conf = NSP.buildConfetti(qConf, 46, 375, 1000);
  conf.forEach((c, i) => { c.el.style.background = ['#22D3EE', '#2F6BFF', '#22C55E', '#FFD23F', '#95BFEF', '#E6F4FF'][i % 6]; });
  const REVEAL = ANS + ab.choice;     // "ข้อ ค สี่สิบวินาที" — first moment option ค is marked correct
  sfx('pop', Q0 + qb.title, .6); qb.q.forEach(a => sfx('pop', Q0 + a, .35)); qb.opt.forEach(a => sfx('pop', Q0 + a + .05, .7)); sfx('ding', Q0 + qb.hint, .6); sfx('pop', Q0 + qb.cue, .6);
  for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', (CDF + i * 30) / FPS, 1);
  sfx('riser', ANS - .05, .5); sfx('pop', ANS + ab.reveal, .7); sfx('success', REVEAL, 1); sfx('sparkle', REVEAL + .2, .9);
  mark('countdown_start', CDF / FPS); mark('countdown_end', (CDF + CDN) / FPS); mark('reveal', REVEAL);
  const sceneQ = { el: sQ, a: Q0, b: AREV, draw(t) {
    const u = t - Q0, f = Math.round(t * FPS), k = f - CDF;
    show(qTitle, u, qb.title, 1e9);
    show(qCard, u, qb.title + .2, 1e9, { from: .8 });
    qLines.forEach((l, i) => { const p = E.out(P(u, qb.q[i] - .05, .4)); l.style.opacity = .18 + .82 * p; l.style.transform = `translateX(${(1 - p) * 20}px)`; });
    NSP.drawQuizOptions(qOpts, u, t - REVEAL, qb.opt, U.CORRECT);
    show(qHint, u, qb.hint, qb.cue - .05, { from: .5 });
    show(qCue, u, qb.cue + .05, (CDF / FPS) - Q0 - .55, { from: .5, out: .3 });   // gone before the ring fades in
    // countdown
    const inCd = k >= 0 && k < CDN;
    if (k >= -6 && k < CDN + 8) {
      const o = k < 0 ? clamp((k + 6) / 6) : k >= CDN ? clamp(1 - (k - CDN) / 8) : 1;
      const kk = clamp(k, 0, CDN - 1), n = 5 - Math.floor(kk / 30), fr = (kk % 30) / 30;
      cdNum.textContent = n;
      cdNum.style.transform = `scale(${inCd ? lerp(1.4, 1, E.back(clamp(fr / .3))) : 1})`;
      cdRing.setAttribute('stroke-dashoffset', CC * clamp(k / CDN));
      tf(qCd, { o, s: (k < 0 ? lerp(.6, 1, o) : 1) * (1 + (inCd ? .04 * Math.max(0, 1 - fr / .2) : 0)) });
    } else tf(qCd, { o: 0 });
    // reveal (only after the countdown has fully elapsed)
    show(qSol.firstChild, t - ANS, ab.reveal, 1e9, { from: .4, el: true, d: .8 });
    show(qSol2, t - REVEAL, 0, 1e9, { from: .4 });
    NSP.drawConfetti(conf, t, REVEAL + .05, 2.2);
  } };

  // ======================= SCENE 7 — ANSWER EXPLANATION (06_answer.mp3) =======================
  const sA = mkScene('s6');
  const aHdr = add(sA, `<div class="ctr" style="top:366px"><div class="chipx chip-g" style="font-size:44px;font-weight:800">${ICON.check('#fff', 44)}เฉลย ข้อ ค. 40 วินาที</div></div>`);
  const aConv = add(sA, `<div class="panel y abs c" style="left:220px;top:462px;width:640px;height:262px"><div class="small" style="position:absolute;left:26px;top:14px;font-size:28px">1) แปลงขนาดไฟล์เป็น bit</div></div>`);
  const ac1 = add(aConv, `<div class="abs c" style="left:0;right:0;top:56px;display:flex;justify-content:center"><div class="big" data-fit="600" style="font-size:84px">500 ${MB} × 8</div></div>`);
  const ac2 = add(aConv, `<div class="abs c" style="left:0;right:0;top:152px;display:flex;justify-content:center"><div class="big" data-fit="600" style="font-size:84px">= <span style="color:#FFD23F">4,000</span> ${Mb}</div></div>`);
  const aDiv = add(sA, `<div class="panel abs c" style="left:220px;top:750px;width:640px;height:262px"><div class="small" style="position:absolute;left:26px;top:14px;font-size:28px">2) หารด้วยความเร็ว 100 ${Mb}/s</div></div>`);
  const ad1 = add(aDiv, `<div class="abs c" style="left:0;right:0;top:56px;display:flex;justify-content:center"><div class="big" data-fit="600" style="font-size:84px">4,000 ÷ 100</div></div>`);
  const ad2 = add(aDiv, `<div class="abs c" style="left:0;right:0;top:152px;display:flex;justify-content:center"><div class="big" data-fit="600" style="font-size:84px;color:#4ADE80;text-shadow:0 0 24px rgba(34,197,94,.6)">= 40 วินาที</div></div>`);
  // download simulation
  const aRes = add(sA, `<div class="panel g abs c" style="left:220px;top:458px;width:640px;height:96px;display:flex;align-items:center;justify-content:center"><div class="big" data-fit="600" style="font-size:44px">4,000 ${Mb} ÷ 100 ${Mb}/s = 40 วินาที</div></div>`);
  const aWin = DL.window(sA, { y: 580, big: 50, ticks: true, timeLabel: '' });
  aWin.el.querySelector('.dl-stats').style.marginTop = '118px';
  const aDone = add(aWin.el, `<div class="abs c" style="right:22px;top:72px"><div class="chipx chip-g" style="font-size:28px;padding:6px 18px">${ICON.check('#fff', 28)}เสร็จ</div></div>`);
  const aSimLab = add(sA, `<div class="ctr" style="top:1196px"><div class="chipx chip-c" style="font-size:36px;font-weight:800">เวลาในการจำลอง: 40 วินาที</div></div>`);
  const aSimNote = add(sA, `<div class="ctr th" style="top:1280px;font-size:28px;color:#95BFEF;flex-direction:column;line-height:1.35"><div>ภาพจำลองแบบเร่งเวลา (ไม่ใช่เวลาจริง)</div><div>อัตราคงที่ 100 ${MBPS} = 12.5 ${MB}/s</div></div>`);
  // wrong-answer explanation
  const aWrong = add(sA, `<div class="panel r abs c" style="left:220px;top:462px;width:640px;height:262px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">
    <div class="small" style="position:absolute;left:26px;top:14px;font-size:28px;color:#FCA5A5">คำตอบ ก. 5 วินาที มาจาก...</div>
    <div style="position:relative;margin-top:30px"><div class="big" data-fit="590" style="font-size:58px">500 ${MB} ÷ 100 ${MBPS} = 5</div><div class="wstrike abs" style="left:-10px;right:-10px;top:50%;height:10px;margin-top:-5px;border-radius:5px;background:#EF4444;box-shadow:0 0 12px #EF4444;transform-origin:left center"></div></div>
    <div class="chipx chip-r" style="font-size:32px">${SV.xc(34)}หารข้ามหน่วย <span style="color:#FFE27A">Byte</span> ÷ <span style="color:#BFF6FF">bit</span> ไม่ได้</div></div>`);
  const aArrow = add(sA, `<div class="abs c" style="left:500px;top:736px">${SV.down(80, '#22C55E')}</div>`);
  const aRight = add(sA, `<div class="panel g abs c" style="left:220px;top:828px;width:640px;height:230px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px">
    <div class="big" data-fit="590" style="font-size:58px">4,000 ${Mb} ÷ 100 ${Mb}/s = 40 s</div>
    <div class="chipx chip-g" style="font-size:32px">${ICON.check('#fff', 32)}แปลงหน่วยให้ตรงกันก่อน</div></div>`);
  const wStrike = aWrong.querySelector('.wstrike');
  // theoretical vs real
  const aTh = add(sA, `<div class="panel y abs c" style="left:220px;top:462px;width:640px;height:140px;display:flex;align-items:center;justify-content:center"><div class="big" data-fit="600" style="font-size:58px"><span style="color:#FFD23F">40 วินาที</span> = ค่าทางทฤษฎี</div></div>`);
  const GW = 600, GH = 330;
  const wob = x => 210 + 34 * Math.sin(x * .045) + 22 * Math.sin(x * .13 + 1) + 14 * Math.sin(x * .31 + 2);
  const realPts = [...Array(61)].map((_, i) => { const x = 70 + i * 8.5; return [x, wob(x)]; });
  const aGraph = add(sA, `<div class="panel abs c" style="left:220px;top:632px;width:640px;height:400px">
    <svg width="${GW}" height="${GH}" viewBox="0 0 ${GW} ${GH}" style="position:absolute;left:20px;top:40px">
      <path d="M60 10V300H590" fill="none" stroke="rgba(149,191,239,.6)" stroke-width="3"/>
      <text x="62" y="0" fill="#95BFEF" font-size="22" font-family="Prompt" font-weight="600" dominant-baseline="hanging" transform="translate(-48 0)">ความเร็ว</text>
      <line x1="62" y1="90" x2="590" y2="90" stroke="#22D3EE" stroke-width="5" stroke-dasharray="14 10"/>
      <text x="580" y="78" text-anchor="end" fill="#22D3EE" font-size="26" font-family="Prompt" font-weight="700">100 Mbps (ทฤษฎี)</text>
      <polyline class="real" points="${realPts.map(p => p.map(v => v.toFixed(1)).join(',')).join(' ')}" fill="none" stroke="#FFD23F" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
      <text x="580" y="292" text-anchor="end" fill="#FFD23F" font-size="26" font-family="Prompt" font-weight="700">ใช้งานจริง (แกว่ง)</text>
      <text x="320" y="326" text-anchor="middle" fill="#95BFEF" font-size="22" font-family="Prompt" font-weight="600">เวลา</text></svg></div>`);
  const aReal = aGraph.querySelector('.real'); const realLen = realPts.slice(1).reduce((s, p, i) => s + Math.hypot(p[0] - realPts[i][0], p[1] - realPts[i][1]), 0);
  aReal.setAttribute('stroke-dasharray', realLen);
  const aWarn = add(sA, `<div class="ctr" style="top:1060px"><div class="chipx chip-r" data-fit="640" style="font-size:36px">${SV.warn(40)}ใช้งานจริงอาจใช้เวลามากกว่านี้</div></div>`);
  const aF = ['Overhead ของเครือข่าย', 'ข้อจำกัดของเซิร์ฟเวอร์', 'ความเร็วไม่คงที่ตลอดเวลา'].map((s, i) => add(sA, `<div class="ctr" style="top:${1146 + i * 70}px"><div class="chipx chip-c" style="font-size:30px;padding:6px 24px">${s}</div></div>`));
  // memory rule
  const aRule = add(sA, `<div class="panel y abs c" style="left:220px;top:470px;width:640px;height:560px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:26px">
    <div class="chipx chip-y" style="font-size:36px;font-weight:800">สูตรจำ</div>
    <div class="big r1" data-fit="600" style="font-size:78px"><span class="ub">Byte</span> × 8 = <span class="lb">bit</span></div>
    <div class="big r2" data-fit="600" style="font-size:78px">${MB} × 8 = ${Mb}</div>
    <div class="r3 chipx chip-b" style="font-size:50px;font-weight:800;padding:14px 40px">จำให้แม่น! <span class="lb" style="font-size:72px;line-height:1;color:#BFF6FF">b</span> ${SV.neq(56, '#FFD23F')} <span class="ub" style="font-size:72px;line-height:1">B</span></div></div>`);
  const [ar1, ar2, ar3] = ['.r1', '.r2', '.r3'].map(s => aRule.querySelector(s));
  const SIM0 = ab.result + 2.0, SIMD = 4.4;  // compressed: 40 simulated seconds shown in 4.4 real seconds
  sfx('whoosh', AREV - .1, .5); sfx('type', ANS + ab.conv + 1.7, .8); sfx('ding', ANS + ab.conv + 3.85, .7); sfx('type', ANS + ab.div, .8); sfx('success', ANS + ab.result, .8);
  sfx('whoosh', ANS + SIM0 - .5, .5); for (let i = 1; i <= 4; i++) sfx('pop', ANS + SIM0 + SIMD * i / 4, .6); sfx('notify', ANS + SIM0 + SIMD + .05, .8);
  sfx('stamp', ANS + ab.wrong + .6, .8); sfx('pop', ANS + ab.wrong + 3.3, .6); sfx('ding', ANS + ab.wrong + 3.5, .6);
  sfx('pop', ANS + ab.theory + .1, .6); sfx('pop', ANS + ab.theory + 2.4, .5); sfx('pop', ANS + ab.theory + 3.6, .45); sfx('pop', ANS + ab.theory + 4.8, .45); sfx('pop', ANS + ab.theory + 6.0, .45);
  sfx('sparkle', ANS + ab.rule, .8); sfx('pop', ANS + ab.rule + .45, .6); sfx('ding', ANS + ab.rule + .9, .8);
  mark('sim_start', ANS + SIM0); mark('sim_end', ANS + SIM0 + SIMD);
  const sceneA = { el: sA, a: AREV, b: S('promo'), draw(t) {
    const u = t - ANS;
    show(aHdr, u, 3.85, 1e9, { from: .7 });
    const gone1 = ab.result + 1.6;
    show(aConv, u, ab.conv, gone1); show(ac1, u, ab.conv + 1.7, 1e9, { from: .5 }); show(ac2, u, ab.conv + 3.85, 1e9, { from: .5 });
    show(aDiv, u, ab.div - .05, gone1); show(ad1, u, ab.div + .05, 1e9, { from: .5 });
    const r2 = life(u, ab.result, 1e9, { from: .3, el: true, d: .8 }); tf(ad2, r2);
    show(aRes, u, gone1 + .2, ab.wrong - .1, { from: .7 });
    show(aWin.el, u, gone1 + .35, ab.wrong - .1, { from: .7 });
    const sp = clamp((u - SIM0) / SIMD), simS = Math.floor(sp * U.TIME_S * 10 + 1e-6) / 10, sm = U.sim(simS);
    aWin.set(sm.pct / 100, u, { pctText: `${Math.floor(sm.pct + 1e-9)}% · ${fmt(Math.floor(sm.mb + 1e-9))} / 500 MB`, timeText: `เวลาจำลอง <b style="color:#22D3EE">${simS.toFixed(1)}</b> / 40 วินาที` });
    show(aDone, u, SIM0 + SIMD, 1e9, { from: .3, el: true, d: .6 });
    show(aSimLab, u, gone1 + .6, ab.wrong - .1); show(aSimNote, u, gone1 + .8, ab.wrong - .1);
    show(aWrong, u, ab.wrong, ab.theory - .1, { from: .7 });
    wStrike.style.transform = `scaleX(${E.out(P(u, ab.wrong + .6, .35))})`;
    show(aArrow, u, ab.wrong + 3.2, ab.theory - .1); show(aRight, u, ab.wrong + 3.4, ab.theory - .1, { from: .6 });
    show(aTh, u, ab.theory, ab.rule - .3, { from: .7 });
    show(aGraph, u, ab.theory + .3, ab.rule - .3, { from: .8 });
    aReal.setAttribute('stroke-dashoffset', realLen * (1 - E.inOut(P(u, ab.theory + .6, 3.0))));
    show(aWarn, u, ab.theory + 2.4, ab.rule - .3);
    aF.forEach((e, i) => show(e, u, ab.theory + 3.6 + i * 1.2, ab.rule - .3, { from: .5 }));
    show(aRule, u, ab.rule - .1, 1e9, { from: .6, d: .4 });
    show(ar1, u, ab.rule, 1e9, { from: .4, d: .4 }); show(ar2, u, ab.rule + .45, 1e9, { from: .4, d: .4 });
    const l3 = life(u, ab.rule + .9, 1e9, { from: .4, el: true, d: .7 }); tf(ar3, { ...l3, s: l3.s * (1 + .03 * Math.sin(u * 6)) });
  } };

  // ======================= SCENE 8 — PROMO (07_promotion.mp3) =======================
  const PR = S('promo'), pb = BT.promo;
  const sP = mkScene('s7');
  const pQ = add(sP, `<div class="ctr" style="top:470px"><div class="big glow" data-fit="640" style="font-size:84px">คุณตอบถูกไหม?</div></div>`);
  const cm = (y, txt, ok) => add(sP, `<div class="abs c" style="left:${ok ? 240 : 300}px;top:${y}px;display:flex;align-items:center;gap:16px">
    <div style="width:76px;height:76px;border-radius:50%;background:linear-gradient(160deg,${ok ? '#95BFEF,#2F6BFF' : '#F7A8C8,#EE7FAA'});flex:none;display:grid;place-items:center">${SV.bubble(40, '#fff')}</div>
    <div class="panel" style="padding:14px 28px;border-radius:26px;font-weight:700;font-size:36px;white-space:nowrap">${txt}</div></div>`);
  const pC = [cm(640, `ค. 40 วินาที ${ICON.check('#22C55E', 34)}`, 1), cm(770, `500 × 8 ÷ 100 = 40`, 0), cm(900, `ต้องแปลง ${MB} ${SV.arr(30)} ${Mb} ก่อน!`, 1)];
  const pFiveW = add(sP, `<div class="abs c" style="left:460px;top:520px">${SV.warn(160)}</div>`);
  const pFive = add(sP, `<div class="ctr" style="top:720px"><div class="big" style="font-size:150px;color:#FCA5A5;text-shadow:0 0 30px rgba(239,68,68,.6)">5 วินาที?</div></div>`);
  const pFiveS = add(sP, `<div class="ctr" style="top:920px"><div class="chipx chip-r" style="font-size:38px">${SV.xc(40)}ลืมแปลง ${MB} เป็น ${Mb}</div></div>`);
  pFiveS.querySelectorAll('.ub,.lb').forEach(e => { e.style.color = '#fff'; });
  const pLogo = add(sP, `<div class="abs c" style="left:300px;top:400px;width:480px"><img src="../../shared/brand/logo.png" style="width:480px;display:block;filter:drop-shadow(0 0 40px rgba(34,211,238,.45)) drop-shadow(0 20px 30px rgba(0,0,0,.4))"></div>`);
  const pWord = add(sP, `<div class="ctr" style="top:930px;flex-direction:column"><div class="big glow" style="font-size:84px">NaiSibPro</div><div class="th" style="font-size:52px;font-weight:800;color:#95BFEF">นายสิบโปร</div></div>`);
  const pBank = add(sP, `<div class="panel y abs c" style="left:220px;top:660px;width:640px;height:210px;display:flex;flex-direction:column;align-items:center;justify-content:center">
    <div class="th" style="font-size:36px">รวมข้อสอบมากกว่า</div><div class="big yglow" style="font-size:100px"><span class="pnum">10,000</span><span style="font-size:60px"> ข้อ</span></div></div>`);
  const pNum = pBank.querySelector('.pnum');
  const pWeek = add(sP, `<div class="panel abs c" style="left:220px;top:896px;width:640px;height:130px;display:flex;align-items:center;justify-content:center;gap:20px">${SV.cal(64)}<div class="big" style="font-size:54px">อัปเดตทุกสัปดาห์!</div></div>`);
  const pMore = add(sP, `<div class="ctr" style="top:1054px"><div class="chipx chip-c" style="font-size:32px">ข้อสอบครบ 6 วิชา · เตรียมสอบตำรวจ</div></div>`);
  const BTN = [['ไลก์', SV.like, pb.cta], ['แชร์', SV.share, pb.cta + 1.1], ['ติดตาม', SV.bell, pb.follow]];
  const pBtn = BTN.map(([lab, ic], i) => add(sP, `<div class="abs c" style="left:${236 + i * 216}px;top:1140px;width:176px;display:flex;flex-direction:column;align-items:center;gap:10px">
    <div class="pb" style="width:150px;height:150px;border-radius:50%;display:grid;place-items:center;background:#1A3A72;box-shadow:0 0 0 4px rgba(34,211,238,.6),0 14px 26px rgba(0,0,0,.35)">${ic(80)}</div><div class="th" style="font-size:36px;font-weight:800">${lab}</div></div>`));
  const pHand = add(sP, `<div class="abs" style="left:0;top:0;width:100px;height:100px">${ICON.hand(100)}</div>`);
  sfx('pop', PR + pb.comment, .6); pC.forEach((_, i) => sfx('msg', PR + pb.comment + .5 + i * .45, .7)); sfx('stamp', PR + pb.five, .6);
  sfx('whoosh', PR + pb.brand - .1, .5); sfx('sparkle', PR + pb.brand + .2, .9); sfx('pop', PR + pb.bank, .6);
  for (let i = 0; i < 6; i++) sfx('coin', PR + pb.bank + .2 + i * .15, .35); sfx('pop', PR + pb.weekly, .6); sfx('pop', PR + pb.more, .5);
  BTN.forEach(b => { sfx('click', PR + b[2] + .25, .9); sfx('pop', PR + b[2] + .3, .6); });
  mark('endcard', PR + pb.cta);
  const sceneP = { el: sP, a: PR, b: 1e9, draw(t) {
    const u = t - PR;
    show(pQ, u, pb.comment, pb.five - .1, { from: .5 });
    pC.forEach((c, i) => { const l = life(u, pb.comment + .5 + i * .45, pb.five - .1, { from: .5 }); tf(c, { ...l, x: (1 - E.out(P(u, pb.comment + .5 + i * .45, .5))) * (i % 2 ? 120 : -120) }); });
    const fw = life(u, pb.five, pb.brand - .1, { from: .3, el: true, d: .8 }); tf(pFiveW, { ...fw, r: Math.sin(u * 8) * 4 * P(u, pb.five, .3) });
    show(pFive, u, pb.five + .15, pb.brand - .1, { from: .5 }); show(pFiveS, u, pb.five + .6, pb.brand - .1);
    // logo: big at brand, then docks to the top
    const lg = life(u, pb.brand, 1e9, { from: .3, el: true, d: 1.0, dy: 200 }), dk = E.inOut(P(u, pb.bank - .1, .6));
    tf(pLogo, { ...lg, s: lg.s * lerp(1, .5, dk), y: lg.y + lerp(0, -170, dk) + bob(u, 0, 6) });
    show(pWord, u, pb.brand + .35, pb.bank - .1);
    show(pBank, u, pb.bank, 1e9, { from: .6 });
    pNum.textContent = fmt(Math.round(10000 * E.out(P(u, pb.bank + .2, 1.1)) / 100) * 100) + (u > pb.bank + 1.3 ? '+' : '');
    show(pWeek, u, pb.weekly, 1e9, { from: .6 });
    show(pMore, u, pb.more, 1e9, { from: .5 });
    pBtn.forEach((b, i) => {
      const a = BTN[i][2], l = life(u, pb.cta - .1 + i * .12, 1e9, { from: .3, el: true, d: .8 });
      const on = P(u, a + .25, .25), pd = NSP.pressDepth(u, [a + .25]);
      tf(b, { ...l, s: l.s * (1 + .12 * E.back(on) * (1 - .5 * P(u, a + .6, .4))) * (1 - .1 * pd) });
      b.querySelector('.pb').style.background = on > 0 ? `linear-gradient(160deg,${i === 2 ? '#EE7FAA,#D9548A' : '#22D3EE,#2F6BFF'})` : '#1A3A72';
    });
    // tapping hand follows the three buttons
    let hx = 900, hy = 1500, ho = 0;
    if (u > pb.cta - .3) {
      const idx = u < BTN[1][2] ? 0 : u < BTN[2][2] ? 1 : 2, a = BTN[idx][2], prev = idx ? BTN[idx - 1][2] : pb.cta - .5;
      const k = E.inOut(clamp((u - Math.max(prev + .5, a - .5)) / .45));
      const px = idx ? 236 + (idx - 1) * 216 + 100 : 900, py = idx ? 1230 : 1500;
      hx = lerp(px, 236 + idx * 216 + 100, k); hy = lerp(py, 1230, k); ho = clamp((u - pb.cta + .3) / .3);
    }
    pHand.style.transform = `translate(${hx}px,${hy}px) scale(${1 - .15 * NSP.pressDepth(u, BTN.map(b => b[2] + .25))})`; pHand.style.opacity = ho;
  } };

  // ======================= START =======================
  { // Prompt's '×' glyph is tiny: draw it as a CSS cross (same idea as the engine's '+' fix)
    const w = document.createTreeWalker(stage, NodeFilter.SHOW_TEXT), hits = []; let n;
    while ((n = w.nextNode())) if (n.nodeValue.includes('×') && !n.parentElement.closest('svg')) hits.push(n);
    hits.forEach(n => { const sp = document.createElement('span'); sp.innerHTML = n.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\s?×\s?/g, '<i class="mx"></i>'); n.replaceWith(sp); });
  }
  const bgScene = { el: bgS, a: -1, b: 1e9, draw: drawBg };
  // camera: the shared engine pushes each scene in by 2.5 %, which would carry full-width panels past the
  // 220–860 safe zone. EP.42 swaps it for a slow 6 px vertical drift (essential text never leaves the zone).
  [sceneH, sceneS, sceneK, sceneX, sceneQ, sceneA, sceneP].forEach(sc => { const d = sc.draw, len = Math.min(sc.b, T.end) - sc.a;
    sc.draw = t => { sc.el.style.transform = `translateY(${(3 - 6 * clamp((t - sc.a) / len)).toFixed(2)}px)`; d(t); }; });
  NSP.start({ scenes: [bgScene, sceneH, sceneS, sceneK, sceneX, sceneQ, sceneA, sceneP], wipes: [S('story'), S('know'), S('expl'), S('quiz'), PR + .2], brand: { showAt: 1.2, hideAt: PR + pb.brand - .3 }, ep: 'EP.42' });
  // shrink-to-fit for any element tagged data-fit="maxWidthPx" (layout width, transform-independent)
  const ready0 = window.ready;
  window.ready = ready0.then(() => {
    const sc = [...document.querySelectorAll('.scene')]; const prev = sc.map(s => s.style.display);
    sc.forEach(s => { s.style.display = 'block'; });
    document.querySelectorAll('[data-fit]').forEach(el => {
      const max = +el.dataset.fit; let fs = parseFloat(getComputedStyle(el).fontSize), n = 0;
      while (Math.max(el.offsetWidth, el.scrollWidth) > max && fs > 12 && n++ < 80) { fs -= 1; el.style.fontSize = fs + 'px'; }
    });
    sc.forEach((s, i) => { s.style.display = prev[i]; });
    window.renderAt(0); return true;
  });
  window.EP42 = { CDF, CDN, REVEAL, SIM0: ANS + SIM0, SIMD };
})();
