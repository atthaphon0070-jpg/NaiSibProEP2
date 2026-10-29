// SCENES 5 / 5b / 6 — QUIZ (05_quiz.mp3) → silent 150-frame COUNTDOWN → ANSWER (06_answer.mp3).
// One module because the four suspect-photo cards persist across all three. Correct answer: ข้อ ง. ฮาร์ดดิสก์.
// Rules kept here: four identical grey cards (no stamps, spotlight or colour difference) until 06 starts.
SC.quizAnswer = function (root) {
  const { h, tf, life, clamp, lerp, E, P, sfx } = NSP;
  const { T, A, layer, pop, SUS, mini } = EP23, Q = BEATS.quiz, AN = BEATS.ans, QS = T.quiz0, CD = T.cd0, AS = T.ans0, I = CASE.ICON;
  const mid = layer(root), ov = layer(root, 5);

  // ---------- banners + gavel ----------
  const bQ = A(ov, 540, 380, `<div class="banner">QUIZ</div>`);
  const gav = A(ov, 860, 360, `<div style="position:relative;width:150px;height:150px"><div class="gv" style="position:absolute;left:0;top:0;transform-origin:120px 120px">${I.gavel(150)}</div><div style="position:absolute;left:-10px;top:90px">${I.block(110)}</div></div>`);
  const gv = gav.querySelector('.gv');
  const lGo = A(ov, 540, 530, `<div class="pill2 chipH" style="font-size:56px">ถึงเวลา<span class="yel">ตัดสินคดี!</span></div>`);
  const bV = A(ov, 540, 380, `<div class="banner" style="background:linear-gradient(90deg,#1238A8,#2F6BFF);box-shadow:0 14px 34px rgba(47,107,255,.5),inset 0 4px 0 rgba(255,255,255,.35)">คำตัดสิน</div>`);

  // ---------- question card ----------
  const qc = h(`<div class="qcard2" style="top:480px">
    <span class="ql">อุปกรณ์ใดต่อไปนี้</span>
    <span class="ql"><span class="hl">ถ้าไม่มี</span> <span class="w2">คอมพิวเตอร์</span></span>
    <span class="ql"><span class="hl">ยังเปิดติด</span></span>
    <span class="ql">และเข้าหน้าไบออสได้</span></div>`);
  ov.appendChild(qc);
  const ql = [...qc.querySelectorAll('.ql')], hls = [...qc.querySelectorAll('.hl')], w2 = qc.querySelector('.w2');
  const QL_AT = [Q.q, Q.ifNo, Q.still, Q.bios], HL_AT = [Q.ifNo, Q.still];

  // ---------- suspect-photo choice cards (identical grey frames) ----------
  const ORDER = [2, 3, 0, 4];    // ก CPU, ข RAM, ค PSU, ง HDD
  const LET = ['ข้อ ก.', 'ข้อ ข.', 'ข้อ ค.', 'ข้อ ง.'];
  const cards = ORDER.map((si, i) => {
    const s = SUS[si];
    const el = h(`<div class="ch"><div class="ov"></div><div class="ph"><div class="pa" style="position:absolute;left:50%;bottom:-6px;width:0;height:0"></div></div>
      <div class="cb">${LET[i]}</div><div class="tx"><span class="t">${s.th}</span><span class="e">${s.en}</span></div>
      <div class="ok">${I.check(84)}</div><div class="xx" style="right:auto;left:62px;top:auto;bottom:-4px;margin:0;width:60px;height:60px">${I.cross(60)}</div><div class="sb"></div></div>`);
    ov.appendChild(el);
    const m = mini(s.kind, 0, .38); m.el.style.left = '0'; m.el.style.top = '0'; el.querySelector('.pa').appendChild(m.el);
    const q = s => el.querySelector(s);
    const stp = i < 3 ? CASE.stamp('ขาดไม่ได้', 'red', 40, -6) : null;
    if (stp) { stp.style.left = '0'; stp.style.top = '0'; q('.sb').appendChild(stp); }
    return { el, ov: q('.ov'), cb: q('.cb'), tx: q('.tx'), t: q('.tx .t'), e: q('.tx .e'), ok: q('.ok'), xx: q('.xx'), stp };
  });
  cards.forEach(c => { c.el.querySelector('.sb').style.cssText = 'position:absolute;left:556px;top:94px;width:0;height:0'; });
  const OPT_AT = [Q.o1, Q.o2, Q.o3, Q.o4], VAL_AT = [Q.v1, Q.v2, Q.v3, Q.v4];
  const ESS_AT = [AN.cpu, AN.ram, AN.psu];
  const GQ = i => 870 + i * 125, GD = i => 470 + i * 140;

  // ---------- countdown (shared component, neutral colours) in the banner slot ----------
  const cdWrap = A(ov, 540, 380, '<div style="position:relative"></div>'); const cd = NSP.buildCountdown(cdWrap.firstChild.firstChild, 160);

  // ---------- B: PC without a hard disk still powers on, BIOS yes, Windows no ----------
  const bSet = layer(mid);
  const pc = CASE.pc({ scale: .85 }); pc.el.style.left = '175px'; pc.el.style.top = '520px'; bSet.appendChild(pc.el);
  const mon = CASE.monitor({ w: 380 }); mon.el.style.left = '440px'; mon.el.style.top = '545px'; bSet.appendChild(mon.el);
  const osI = A(ov, 815, 560, `<div style="position:relative;filter:drop-shadow(0 10px 16px rgba(0,0,0,.5))">${I.oswin(140)}</div>`);
  const osX = A(ov, 868, 515, I.cross(76));
  const tNo = A(ov, 540, 400, `<div class="pill2 chipY" style="font-size:56px">ไม่มีฮาร์ดดิสก์</div>`);
  const tWin = A(ov, 540, 400, `<div class="pill2 chipR" style="font-size:56px">แต่เข้าวินโดวส์ไม่ได้</div>`);
  const tOs = A(ov, 540, 400, `<div class="pill2 chipH" style="font-size:54px">เพราะ<span class="yel">ระบบปฏิบัติการ</span>…</div>`);
  const sOn = A(ov, 540, 990, `<div class="pill2 chipG">ยังเปิดติด ${I.check(52, '#15803D')}</div>`);
  const sBios = A(ov, 540, 1095, `<div class="pill2 chipG">เข้าหน้าไบออสได้ ${I.check(52, '#15803D')}</div>`);
  const sNb = A(ov, 540, 990, `<div class="pill2 chipH" style="font-size:48px">ไม่พบอุปกรณ์สำหรับบูต</div>`);
  const sStored = A(ov, 540, 1095, `<div class="pill2 chipY" style="font-size:50px">ถูกเก็บไว้ในฮาร์ดดิสก์</div>`);
  const osFly = A(ov, 320, 1290, `<div style="filter:drop-shadow(0 10px 16px rgba(0,0,0,.5))">${I.oswin(130)}</div>`);
  const arrow = h(`<div class="abs" style="left:410px;top:1282px;width:230px;height:14px;border-radius:7px;background:repeating-linear-gradient(90deg,#FFD23F 0 26px,transparent 26px 40px);transform-origin:left center"></div>`); ov.appendChild(arrow);
  const hddB = CASE.suspect('hdd', { num: 5, scale: .8, card: false }); hddB.el.style.left = '740px'; hddB.el.style.top = '1420px'; ov.appendChild(hddB.el);

  // ---------- C: filing cabinet analogy (spoken in 06) ----------
  const tCab = A(ov, 540, 400, `<div class="pill2 chipY" style="font-size:54px">ฮาร์ดดิสก์ = ตู้เก็บเอกสาร</div>`);
  const houseW = A(mid, 350, 790, `<div style="position:relative;width:280px;height:280px">${I.house(280)}<div class="door" style="position:absolute;left:112px;top:162px;width:56px;height:84px;background:#7A4A2A;border:5px solid #0B1A3A;border-radius:3px;transform-origin:left center"></div></div>`);
  const door = houseW.querySelector('.door');
  houseW.firstChild.firstChild.insertAdjacentHTML('afterbegin', `<div style="position:absolute;left:114px;top:164px;width:52px;height:80px;background:#FFE7A8"></div>`);
  const cabW = A(mid, 750, 790, `<div style="position:relative">${I.cabinet(280)}</div>`);
  const cabE = A(mid, 750, 790, `<div style="width:176px;height:256px;border-radius:14px;border:8px dashed rgba(255,255,255,.75)"></div>`);
  const cabX = A(ov, 835, 670, I.cross(84));
  const lNoCab = A(ov, 750, 1000, `<div class="pill2 chipR" style="font-size:48px">ไม่มีตู้</div>`);
  const lHouse = A(ov, 350, 1000, `<div class="pill2 chipG" style="font-size:44px">ก็ยังเข้าบ้านได้</div>`);
  const deskW = A(mid, 540, 1210, `<div style="position:relative">${I.desk(200)}</div>`);
  const lWork = A(ov, 540, 1365, `<div class="pill2 chipH" style="font-size:52px">แต่<span class="red">ไม่มีงาน</span>ให้ทำ</div>`);

  // ---------- D: the other three are essential ----------
  const kd1 = A(ov, 540, 1160, `<div class="big wht" style="font-size:66px">ขาดตัวไหน</div>`);
  const kd2 = A(ov, 540, 1255, `<div class="big" style="font-size:66px;color:#FF5A5A">เครื่องไม่ติดแน่นอน!</div>`);
  // ---------- E: graphics card note ----------
  const gBox = A(ov, 540, 1255, `<div style="position:relative;width:680px;height:300px;border-radius:30px;background:rgba(19,42,87,.96);box-shadow:0 0 0 5px rgba(255,255,255,.85),0 16px 30px rgba(0,0,0,.45)"></div>`);
  const gTab = A(ov, 540, 1105, `<div class="pill2 chipY" style="font-size:46px">อย่าลืม…</div>`);
  const gIco = A(ov, 300, 1270, `<div style="position:relative">${I.gpu(170)}</div>`);
  const gL1 = A(ov, 610, 1200, `<div style="font-weight:700;font-size:42px;color:#fff;text-align:center;line-height:1.2">ถ้าซีพียู<br><span class="yel">ไม่มีกราฟิกในตัว</span></div>`);
  const gL2 = A(ov, 610, 1303, `<div class="pill2 chipY" style="font-size:46px;padding:6px 26px">ต้องมีการ์ดจอ</div>`);
  const gL3 = A(ov, 610, 1374, `<div style="display:flex;align-items:center;gap:12px;font-weight:800;font-size:44px;color:#4ADE80">${I.screen(52)}ถึงจะเห็นภาพ</div>`);

  // ---------- F: memory phrase ----------
  const mHdr = A(ov, 540, 400, `<div class="pill2 chipH">จำไว้เลย…</div>`);
  const MW = [['bolt', 'ไฟ', AN.fai], ['house', 'บ้าน', AN.baan], ['brain', 'สมอง', AN.samong], ['desk', 'โต๊ะ', AN.to]];
  const memo = MW.map(([ico, w, a], i) => ({ a, el: A(ov, 270 + i * 180, 720, `<div style="display:flex;flex-direction:column;align-items:center;gap:6px">${I[ico](150)}<div class="mph" style="font-size:66px">${w}</div></div>`) }));
  const mBox = A(ov, 540, 1100, `<div class="resbox" style="position:relative;width:820px;height:320px"></div>`);
  const m1 = A(ov, 540, 1040, `<div class="mph" style="font-size:112px">ขาดตัวไหน</div>`);
  const m2 = A(ov, 540, 1175, `<div class="mph" style="font-size:112px">ไม่ติด!</div>`);
  const conf = layer(ov); const cf = NSP.buildConfetti(conf, 60, 540, 1240);

  // ---------- SFX ----------
  sfx('whoosh', QS + Q.go - .05, .8); sfx('gavel', QS + Q.go + .3, 1);
  QL_AT.forEach(a => sfx('click', QS + a, .35)); HL_AT.forEach(a => sfx('pop', QS + a + .05, .5));
  OPT_AT.forEach(a => sfx('pop', QS + a, .8)); sfx('pop', QS + Q.think + .2, .5);
  for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', CD + i, 1);
  sfx('gavel', AS + AN.verdict + .25, 1); sfx('gavel', AS + AN.d - .05, .8); sfx('ding', AS + AN.d + .05, 1); sfx('success', AS + AN.hdd, .9); sfx('sparkle', AS + AN.hdd + .2, .7);
  sfx('whoosh', AS + AN.noHdd - .15, .6); sfx('pop', AS + AN.noHdd, .6); sfx('click', AS + AN.stillOn, 1); sfx('ding', AS + AN.stillOn + .2, .6); sfx('success', AS + AN.bios, .7);
  sfx('buzz', AS + AN.win, .35); sfx('drop', AS + AN.winNo, .6); sfx('pop', AS + AN.os, .6); sfx('whoosh', AS + AN.stored - .2, .5); sfx('pop', AS + AN.stored, .7);
  sfx('whoosh', AS + AN.cab0 - .1, .6); sfx('pop', AS + AN.cab, .8); sfx('buzz', AS + AN.noCab, .3); sfx('click', AS + AN.house, .7); sfx('ding', AS + AN.house + .3, .5); sfx('pop', AS + AN.noWork, .6);
  sfx('whoosh', AS + AN.rest - .1, .6); ESS_AT.forEach(a => { sfx('stamp', AS + a + .25, 1); sfx('buzz', AS + a + .35, .25); }); sfx('pop', AS + AN.kad, .7); sfx('drop', AS + AN.sure, .4);
  sfx('pop', AS + AN.dont, .6); sfx('pop', AS + AN.gpuIf, .6); sfx('pop', AS + AN.card, .8); sfx('ding', AS + AN.see, .6);
  sfx('whoosh', AS + AN.memo - .1, .6); MW.forEach(m => sfx('pop', AS + m[2], 1)); sfx('stamp', AS + AN.kad2, .7); sfx('sparkle', AS + AN.noOn, .7);

  return function (t) {
    const uq = t - QS, uc = t - CD, ua = t - AS, ans = ua >= 0;
    const phB = ans && ua >= AN.noHdd - .3, phC = ans && ua >= AN.cab0 - .3, phD = ans && ua >= AN.rest - .3, phE = ans && ua >= AN.dont - .3, phF = ans && ua >= AN.memo - .3;
    // banners + gavel
    const sweep = E.out(P(uq, Q.go, .5));
    tf(bQ, { x: lerp(-1100, 0, sweep), s: 1 + .03 * Math.sin(uq * 5) * (uq > Q.go + .5 ? 1 : 0), o: clamp((uq - Q.go) * 4) * (1 - P(uq, Q.think - .1, .25)) });
    const g1 = Math.max(0, 1 - Math.abs(uq - Q.go - .3) / .18), g2 = ans ? Math.max(0, 1 - Math.abs(ua - AN.verdict - .25) / .18) + Math.max(0, 1 - Math.abs(ua - AN.d + .05) / .18) : 0;
    tf(gav, { o: clamp((uq - Q.go) * 4) * (1 - P(uq, Q.q - .2, .3)) + (ans ? clamp(ua * 4) * (1 - P(ua, AN.noHdd - .3, .3)) : 0) });
    gv.style.transform = `rotate(${-28 + 40 * Math.min(1, g1 + g2)}deg)`;
    tf(lGo, pop(uq, Q.go, Q.q - .1));
    tf(bV, ans ? life(ua, AN.verdict, AN.noHdd - .3, { from: .4, dy: 0, d: .5, el: true }) : { o: 0 });
    // question card
    const qOut = phB ? E.in(P(ua, AN.noHdd - .3, .35)) : 0;
    const ql0 = life(uq, Q.q - .2, 1e9, { from: .7, dy: 60 });
    tf(qc, { ...ql0, y: ql0.y - 300 * qOut, o: ql0.o * (1 - qOut) });
    ql.forEach((l, i) => { const k = E.out(P(uq, QL_AT[i], .35)); l.style.opacity = k; l.style.transform = `translateX(${(1 - k) * 40}px)`; });
    w2.style.opacity = E.out(P(uq, Q.comp, .3));
    hls.forEach((e, i) => { const k = P(uq, HL_AT[i], .3); e.style.background = `rgba(255,230,128,${k})`; e.style.color = k > .5 ? '#9A5B00' : '#0B1A3A'; e.style.transform = `scale(${1 + .1 * Math.max(0, 1 - Math.abs(uq - HL_AT[i] - .15) / .3)})`; });
    // cards
    cards.forEach((c, i) => {
      const correct = i === 3, rv = ans ? ua - AN.d : -1, revealed = rv >= 0;
      const l = life(uq, OPT_AT[i], 1e9, { from: .4, dy: 0, d: .5 });
      let o = l.o, s = l.s, x = (1 - E.out(P(uq, OPT_AT[i], .5))) * (i % 2 ? 600 : -600), y = GQ(i);
      c.t.style.opacity = E.out(P(uq, VAL_AT[i] - .05, .3)); c.e.style.opacity = c.t.style.opacity;
      // B/C: away; D: back as the essentials list
      if (phB && !phD) { const k = E.in(P(ua, AN.noHdd - .3, .4)); o *= 1 - k; y += 500 * k; }
      if (phD) { const k = E.out(P(ua, AN.rest - .3, .5)); o = k; y = GD(i) + (1 - k) * 120; s = 1; x = 0; c.e.style.opacity = correct ? 1 : 1 - k; }
      if (phF) { const k = E.in(P(ua, AN.memo - .3, .35)); o *= 1 - k; x -= 900 * k; }
      if (revealed && correct) {
        const rp = E.back(P(rv, 0, .5));
        c.ov.style.opacity = clamp(rv / .25); c.t.style.color = '#fff'; c.e.style.color = '#DCFCE7'; c.cb.style.background = '#15803D'; c.el.style.borderColor = '#fff';
        tf(c.ok, { s: lerp(0, 1, E.elastic(P(rv, .1, .8))), o: clamp(rv / .1) });
        c.el.style.boxShadow = `0 10px 0 #15803D,0 0 ${40 + 14 * Math.sin(ua * 3)}px 12px rgba(74,222,128,.55)`;
        s *= phD ? 1 : 1 + .08 * rp;
        c.el.style.filter = '';
      } else {
        c.ov.style.opacity = 0; tf(c.ok, { o: 0 }); c.el.style.boxShadow = ''; c.el.style.borderColor = '';
        // after the verdict the wrong cards dim to ~40 %; in D each one brightens on its spoken name and is stamped
        let dim = revealed && !phD ? .6 * E.out(P(rv, 0, .45)) : 0;
        if (phD && !correct) { const a = ESS_AT[i]; dim = .6 * (1 - E.out(P(ua, a, .3))); }
        if (phE && !correct) dim = Math.max(dim, .25 * P(ua, AN.dont - .3, .3));
        o *= 1 - dim; c.el.style.filter = dim > .01 ? `grayscale(${dim * 1.5})` : '';
        if (c.stp) {
          const sh = phD ? CASE.slam(c.stp, ua - ESS_AT[i] - .25) : (tf(c.stp, { o: 0 }), 0);
          x += sh;
          tf(c.xx, phD ? { s: lerp(0, 1, E.elastic(P(ua, ESS_AT[i] + .35, .6))), o: clamp((ua - ESS_AT[i] - .35) * 8) } : { o: 0 });
          c.el.style.borderColor = phD && ua > ESS_AT[i] + .25 ? '#E5484D' : '';
        } else tf(c.xx, { o: 0 });
      }
      y += Math.sin(t * 1.7 + i * 1.1) * 3;
      c.el.style.top = '0px';
      tf(c.el, { o, s, x, y });
    });
    // countdown: ring appears on "ให้เวลาคิด" in the banner slot, ticks exactly 150 frames from CD, neutral colours
    if (uc < 0) {
      tf(cdWrap, life(uq, Q.think + .2, 1e9, { from: .3, dy: 30 })); cd.num.textContent = 5; cd.num.style.transform = 'none';
      cd.ring.setAttribute('stroke-dashoffset', 0); cd.dot.setAttribute('cx', cd.c); cd.dot.setAttribute('cy', cd.c - cd.r);
    } else {
      NSP.drawCountdown(cd, uc, T.cdLen);
      const fr = uc - Math.floor(uc);
      if (uc < T.cdLen) tf(cdWrap, { s: 1 + .05 * Math.max(0, 1 - fr / .25) });
      else tf(cdWrap, { s: 1 - .12 * E.out(P(uc, T.cdLen, .3)), o: 1 - P(uc, T.cdLen, .3) });
    }
    if (!ans) { [bSet].forEach(e => tf(e, { o: 0 })); }
    NSP.drawConfetti(cf, t, AS + AN.hdd, 2.2);
    // ---------- B ----------
    const bIn = ans ? E.out(P(ua, AN.noHdd - .1, .5)) : 0, bOut = ans ? E.in(P(ua, AN.cab0 - .3, .35)) : 0;
    tf(bSet, { o: bIn * (1 - bOut), y: lerp(200, 0, bIn) - 300 * bOut });
    const on = ans && ua >= AN.stillOn;
    pc.set({ led: on ? 1 : 0, color: '#22C55E', bay: ans ? clamp((ua - AN.noHdd) / .3) * (.6 + .4 * Math.sin(ua * 6)) : 0, fan: on ? .8 + .2 * Math.sin(ua * 3) : 0, press: NSP.pressDepth(ua, [AN.stillOn - .1]) });
    mon.set({ stb: on && ua < AN.bios ? 1 : 0, bios: ua >= AN.bios && ua < AN.win ? 1 : 0, noboot: ua >= AN.win ? 1 : 0, flash: Math.max(ua > AN.bios && ua < AN.bios + .2 ? 1 - (ua - AN.bios) / .2 : 0, ua > AN.win && ua < AN.win + .15 ? .6 : 0) }, ua);
    tf(tNo, pop(ua, AN.noHdd, AN.win - .1)); tf(tWin, { ...pop(ua, AN.win, AN.os - .1), x: ua > AN.win && ua < AN.win + .3 ? Math.sin(ua * 80) * 5 : 0 }); tf(tOs, pop(ua, AN.os, AN.cab0 - .3));
    tf(sOn, pop(ua, AN.stillOn, AN.win - .1)); tf(sBios, pop(ua, AN.bios, AN.win - .1));
    tf(sNb, pop(ua, AN.win + .1, AN.cab0 - .3)); tf(sStored, pop(ua, AN.stored, AN.cab0 - .3));
    tf(osI, { ...life(ua, AN.win, AN.os, { from: .3, dy: 30, out: .2 }), y: Math.sin(ua * 3) * 5 });
    tf(osX, life(ua, AN.winNo, AN.os, { from: .2, dy: 0, d: .6, el: true, out: .2 }));
    // OS icon travels into the Hard Disk on "ถูกเก็บไว้ในฮาร์ดดิสก์"
    const ofl = E.inOut(P(ua, AN.stored, .7)), ol = life(ua, AN.os, AN.cab0 - .3, { from: .3, dy: 30, out: .25 });
    tf(osFly, { ...ol, x: lerp(0, 420, ofl), y: ol.y - 60 * Math.sin(ofl * Math.PI), s: ol.s * lerp(1, .45, ofl), o: ol.o * (1 - P(ua, AN.stored + .6, .15)) });
    tf(arrow, { sx: Math.max(.001, E.out(P(ua, AN.os + .2, .4))), sy: 1, o: ans && ua > AN.os && ua < AN.cab0 - .3 ? 1 - P(ua, AN.cab0 - .5, .2) : 0 });
    const hb = life(ua, AN.os + .1, AN.cab0 - .3, { from: .4, dy: 40, out: .25 });
    hddB.pose({ t: ua, o: ans ? hb.o : 0, s: hb.s * (1 + .12 * Math.max(0, 1 - Math.abs(ua - AN.stored - .7) / .15)), blink: CASE.blinkAt(ua, 2), mood: 0 });
    // ---------- C ----------
    const cOut = P(ua, AN.rest - .3, .3);
    tf(tCab, pop(ua, AN.cab0, AN.rest - .3));
    const hl = life(ua, AN.cab0 + .1, AN.rest - .3, { from: .4, dy: 50, out: .3 }); tf(houseW, { ...hl, o: ans ? hl.o : 0 });
    door.style.transform = `scaleX(${1 - .8 * E.out(P(ua, AN.house, .4))})`;
    const cbl = life(ua, AN.cab, AN.rest - .3, { from: .3, dy: 50, el: true, d: .7, out: .3 });
    const gone = E.inOut(P(ua, AN.noCab, .4));
    tf(cabW, { ...cbl, o: ans ? cbl.o * (1 - gone) : 0, s: cbl.s * (1 - .2 * gone) });
    tf(cabE, { o: ans ? gone * (1 - cOut) : 0 });
    tf(cabX, life(ua, AN.noCab + .2, AN.rest - .3, { from: .2, dy: 0, d: .6, el: true, out: .3 }));
    tf(lNoCab, pop(ua, AN.noCab, AN.rest - .3)); tf(lHouse, pop(ua, AN.house, AN.rest - .3));
    tf(deskW, { ...life(ua, AN.noWork, AN.rest - .3, { from: .4, dy: 40, out: .3 }), y: Math.sin(ua * 2) * 4 });
    tf(lWork, pop(ua, AN.noWork, AN.rest - .3));
    // ---------- D ----------
    tf(kd1, pop(ua, AN.kad, AN.dont - .3)); tf(kd2, { ...pop(ua, AN.sure, AN.dont - .3), x: ua > AN.sure && ua < AN.sure + .3 ? Math.sin(ua * 80) * 5 : 0 });
    // ---------- E ----------
    const eo = (a, b = AN.memo - .3) => life(ua, a, b, { from: .4, dy: 30, out: .3 });
    tf(gBox, { ...eo(AN.dont), s: 1 }); tf(gTab, eo(AN.dont)); tf(gIco, { ...life(ua, AN.gpuIf, AN.memo - .3, { from: .2, dy: 30, el: true, d: .7, out: .3 }), r: Math.sin(ua * 2) * 3 });
    tf(gL1, eo(AN.gpuIf)); tf(gL2, eo(AN.card)); tf(gL3, eo(AN.see));
    // ---------- F ----------
    tf(mHdr, pop(ua, AN.memo, 1e9));
    memo.forEach((m, i) => { const l = life(ua, m.a, 1e9, { from: .2, dy: 40, d: .6, el: true }); tf(m.el, { ...l, o: ans ? l.o : 0, y: l.y + Math.sin(ua * 2 + i) * 6 }); });
    tf(mBox, { o: ans ? E.out(P(ua, AN.kad2 - .2, .4)) : 0, s: 1 });
    const q1 = life(ua, AN.kad2, 1e9, { from: .3, dy: 40, el: true, d: .8 }), q2 = life(ua, AN.noOn, 1e9, { from: .3, dy: 40, el: true, d: .8 });
    tf(m1, { ...q1, o: ans ? q1.o : 0, s: q1.s * (1 + .02 * Math.sin(ua * 4)) }); tf(m2, { ...q2, o: ans ? q2.o : 0, s: q2.s * (1 + .02 * Math.sin(ua * 4 + 1)) });
  };
};
