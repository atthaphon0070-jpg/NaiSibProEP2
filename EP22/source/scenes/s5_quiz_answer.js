// SCENES 5 / 5b / 6 — QUIZ (05_quiz.mp3) → silent 150-frame COUNTDOWN → ANSWER (06_answer.mp3).
// One module because the choice cards persist across all three. Correct answer: ข้อ ก. 2 วัน.
// Rules kept here: plain wall without a grid during quiz + countdown; no grid/fill/hint before 06 starts.
SC.quizAnswer = function (root) {
  const { h, tf, life, clamp, lerp, E, P, ICON, sfx } = NSP;
  const { T, A, C, pop, LAY, workSet, drawOfficers, drawCalendar, gridSfx } = EP22;
  const Q = BEATS.quiz, AN = BEATS.ans, QS = T.quiz0, CD = T.cd0, AS = T.ans0;
  const badge = (k, cls) => `<span class="wbadge ${cls}">${k}</span>`;

  // ---------- thinking aid: plain wall (no grid) + small officers with worker badges ----------
  const aid = h(`<div class="abs" style="inset:0"></div>`); root.appendChild(aid);
  WORK.wall(aid, { x: 330, y: 1460, w: 420, hgt: 250, beacon: false });
  const aA = WORK.officer({ paint: C.blue, scale: .5 }), aB = WORK.officer({ paint: C.cyan, flip: true, scale: .5 });
  [[aA, 235], [aB, 845]].forEach(([o, x]) => { o.el.style.left = (x - 120) + 'px'; o.el.style.top = (1830 - 600) + 'px'; aid.appendChild(o.el); });
  A(aid, 235, 1490, `<span class="wbadge b" style="font-size:52px">ก</span>`, "artlbl"); A(aid, 845, 1490, `<span class="wbadge c" style="font-size:52px">ข</span>`, "artlbl");

  // ---------- banners ----------
  const bQ = A(root, 540, 362, `<div class="banner">QUIZ</div>`);
  const bA = A(root, 540, 372, `<div class="banner" style="background:linear-gradient(90deg,#16A34A,#22C55E);box-shadow:0 14px 34px rgba(34,197,94,.5)">เฉลย!</div>`);
  const hdrA = A(root, 540, 346, `<div class="pill2 chipH" style="box-shadow:0 0 0 5px #22C55E,0 12px 24px rgba(0,0,0,.35)">เฉลย: ข้อ ก. <span class="grn">2 วัน</span> ${ICON.check('#4ADE80', 44)}</div>`);
  const hdrM = A(root, 540, 346, `<div class="pill2 chipH">จำไว้เลย!</div>`);

  // ---------- question card (lines revealed with the narration) ----------
  const qc = h(`<div class="qcard2" style="top:414px">
    <span class="ql">${badge('ก', 'b')} ทำงานคนเดียว</span>
    <span class="ql" style="padding-left:62px">เสร็จใน <span class="hl">6 วัน</span></span>
    <span class="ql">${badge('ข', 'c')} ทำงานเดียวกัน</span>
    <span class="ql" style="padding-left:62px">คนเดียว เสร็จใน <span class="hl">3 วัน</span></span>
    <span class="ql">ถ้าช่วยกันทำ</span>
    <span class="ql">จะเสร็จใน<span style="color:#FF3D7F">กี่วัน?</span></span></div>`);
  root.appendChild(qc);
  const ql = [...qc.querySelectorAll('.ql')], hls = [...qc.querySelectorAll('.hl')];
  const QL_AT = [Q.qa, Q.qa + .95, Q.qb, Q.qb3, Q.qc, Q.qc2], HL_AT = [Q.qa6, Q.qb6];

  // ---------- choice cards (identical neutral cards) ----------
  const OPTS = [['ข้อ ก.', '2 วัน'], ['ข้อ ข.', '3 วัน'], ['ข้อ ค.', '4.5 วัน'], ['ข้อ ง.', '9 วัน']];
  const WHY = [null, 'ลืมแรงของ ก', 'เฉลี่ยวัน', 'บวกวัน'];
  const cards = OPTS.map(([b, v], i) => {
    const el = h(`<div class="ch"><div class="ov"></div><div class="cb">${b}</div><div class="tx">${v}</div>
      ${WHY[i] ? `<div class="why">${WHY[i]}</div><div class="xx">${ICON.cross('#fff', 50)}</div>` : ''}<div class="ok">${ICON.check('#16A34A', 56)}</div></div>`);
    root.appendChild(el);
    const q = s => el.querySelector(s);
    return { el, ov: q('.ov'), cb: q('.cb'), tx: q('.tx'), why: q('.why'), xx: q('.xx'), ok: q('.ok') };
  });
  const OPT_AT = [Q.o1, Q.o2, Q.o3, Q.o4], VAL_AT = [Q.v1, Q.v2, Q.v3, Q.v4];
  const WRONG_AT = [null, AN.n3, AN.n45, AN.n9], WHY_AT = [null, AN.w3why, AN.w45why, AN.w9why];
  // geometry: quiz list (left column, countdown on the right) and trap list (full width)
  const GQ = i => ({ x: 190, w: 470, y: 946 + i * 106 }), GC = i => ({ x: 190, w: 680, y: 432 + i * 134 });

  // ---------- countdown (shared component, neutral colours) ----------
  const cdWrap = A(root, 772, 1150, '<div style="position:relative"></div>'); const cd = NSP.buildCountdown(cdWrap.firstChild.firstChild, 220);

  // ---------- answer: work set 2 × 3, rates 1 (ก) + 2 (ข) ----------
  const wsC = h(`<div class="abs" style="inset:0"></div>`); root.appendChild(wsC);
  const ws = workSet(wsC, { rows: 2, cols: 3, rates: [1, 2] });
  const g = ws.grid;
  const DAYS = [AN.six, AN.six + (AN.done - AN.six) / 2, AN.done - .05];
  const dA = A(ws.ov, LAY.lblL, LAY.dayY, `<div class="pill2 lbl b">${badge('ก', 'b')}6 วัน</div>`);
  const dB = A(ws.ov, LAY.lblR, LAY.dayY, `<div class="pill2 lbl c">${badge('ข', 'c')}3 วัน</div>`);
  const rA = A(ws.ov, LAY.lblL, LAY.rateY, `<div class="pill2 rate b" style="font-size:42px">ก: 1 ช่อง/วัน</div>`);
  const rB = A(ws.ov, LAY.lblR, LAY.rateY, `<div class="pill2 rate c" style="font-size:42px">ข: 2 ช่อง/วัน</div>`);
  const eq1 = A(root, 540, 432, `<div class="eq"><span class="t blu">1</span><span class="t">+ <span class="cya">2</span></span> <span class="t">=</span> <span class="t yel">3 ช่อง/วัน</span></div>`);
  const eq2 = A(root, 540, 522, `<div class="eq" style="font-size:66px"><span class="t">6</span> <span class="t">÷ 3</span> <span class="t">=</span> <span class="t yel">2</span></div>`);
  const e1 = [...eq1.querySelectorAll('.t')], e2 = [...eq2.querySelectorAll('.t')];
  const E1 = [AN.together, AN.together + .4, AN.perDay + .1, AN.r3], E2 = [AN.six, AN.div3, AN.done - .1, AN.done];
  const resB = A(root, 540, 822, `<div class="resbox" style="position:relative;width:640px;height:300px"></div>`);
  const res = A(root, 540, 822, `<div class="res">2 วัน</div>`);
  const conf = h(`<div class="abs" style="inset:0"></div>`); root.appendChild(conf);
  const cf = NSP.buildConfetti(conf, 60, 540, 820), cf0 = NSP.buildConfetti(conf, 40, 420, 990);

  // ---------- traps check ----------
  const chk = A(root, 540, 1010, `<div class="pill2 chipH">เช็กง่าย ๆ</div>`);
  const faster = A(root, 540, 1010, `<div class="big wht" style="font-size:54px">ช่วยกันต้องเร็วกว่า <span class="yel">3 วัน</span></div>`);
  const line = h(`<div class="abs" style="left:110px;top:${432 + 104 + 13}px;width:860px;height:10px;border-radius:5px;background:repeating-linear-gradient(90deg,#FFD23F 0 34px,transparent 34px 52px);transform-origin:left center;box-shadow:0 0 18px rgba(255,210,63,.8)"></div>`);
  root.appendChild(line);
  const lt = A(root, 540, 640, `<div class="pill2" style="font-size:64px;color:#3A2A00;background:#FFD23F;box-shadow:0 0 0 6px #fff,0 14px 28px rgba(0,0,0,.4)">&lt; 3 วัน</div>`);
  const fastC = A(root, 540, 1130, `<div class="pill2 rate c" style="font-size:46px">${badge('ข', 'c')} 3 วัน = คนที่เร็วที่สุด</div>`);

  // ---------- shortcut formula (spoken in 06_answer, so it is shown) ----------
  const fT = A(root, 540, 470, `<div class="pill2" style="font-size:54px;color:#3A2A00;background:#FFD23F;box-shadow:0 0 0 5px #fff,0 12px 24px rgba(0,0,0,.35)">สูตรลัด</div>`);
  const frac = (num, den, w, fs, cls = '') => `<div class="frac ${cls}" style="display:flex;flex-direction:column;align-items:center;font-weight:800;font-size:${fs}px;line-height:1.15;color:#fff;text-shadow:0 5px 0 #071330">
      <div class="nu">${num}</div><div class="fb" style="width:${w}px;height:10px;border-radius:5px;background:#fff;margin:8px 0;transform-origin:center"></div><div class="de">${den}</div></div>`;
  const F1 = A(root, 540, 700, frac(`<span class="ft blu">วัน</span> <span class="ft"><b class="mx">×</b> <span class="cya">วัน</span></span>`, `<span class="ft blu">วัน</span><span class="ft">+ <span class="cya">วัน</span></span>`, 420, 76));
  const F2 = A(root, 330, 1000, frac(`<span class="ft blu">6</span> <span class="ft"><b class="mx">×</b> <span class="cya">3</span></span>`, `<span class="ft">6 + 3</span>`, 230, 70));
  const F2eq = A(root, 520, 1000, `<div class="eq">=</div>`);
  const F3 = A(root, 630, 1000, frac(`<span class="ft">18</span>`, `<span class="ft">9</span>`, 110, 70));
  const F3eq = A(root, 785, 1000, `<div class="eq" style="font-size:110px">= <span class="yel">2</span></div>`);
  const f1t = [...F1.querySelectorAll('.ft')], f1b = F1.querySelector('.fb');
  const f2t = [...F2.querySelectorAll('.ft')], f2b = F2.querySelector('.fb'), f3t = [...F3.querySelectorAll('.ft')], f3b = F3.querySelector('.fb');
  const F1_AT = [AN.fA, AN.fMul, AN.fDiv + .2, AN.fPlus], F2_AT = [AN.s6, AN.s3, AN.sDiv];

  // ---------- memory phrase over the finished wall ----------
  const mBox = A(root, 540, 822, `<div class="resbox" style="position:relative;width:760px;height:380px"></div>`);
  const m1 = A(root, 540, 745, `<div class="mph" style="font-size:120px">บวกงาน…</div>`);
  const m2 = A(root, 540, 905, `<div class="mph" style="font-size:104px">ไม่ใช่บวกวัน!</div>`);

  // ---------- SFX ----------
  sfx('whoosh', QS + Q.go - .05, .8); sfx('pop', QS + Q.go + .25, .9);
  QL_AT.forEach(a => sfx('click', QS + a, .3)); HL_AT.forEach(a => sfx('pop', QS + a, .5));
  OPT_AT.forEach(a => sfx('pop', QS + a, .8)); sfx('pop', QS + Q.think + .2, .5);
  for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', CD + i, 1);
  sfx('pop', AS + AN.sol, .6); sfx('ding', AS + AN.reveal, 1); sfx('success', AS + AN.reveal + .05, 1); sfx('sparkle', AS + AN.reveal + .3, .7);
  sfx('whoosh', AS + AN.split - .1, .6); for (let i = 0; i < 5; i++) sfx('click', AS + AN.g6 + i * .14, .35);
  sfx('pop', AS + AN.r1, .9); sfx('pop', AS + AN.r2, .9); E1.forEach(a => sfx('pop', AS + a, .6)); E2.slice(0, 3).forEach(a => sfx('pop', AS + a, .6));
  gridSfx(g, DAYS.map(d => AS + d));
  sfx('ding', AS + AN.done, 1); sfx('success', AS + AN.done + .05, .9); sfx('sparkle', AS + AN.done + .2, .8);
  sfx('whoosh', AS + AN.w9 - .2, .5);
  [3, 2, 1].forEach(i => { sfx('buzz', AS + WRONG_AT[i], .3); sfx('pop', AS + WHY_AT[i], .6); });
  sfx('pop', AS + AN.check, .6); sfx('whoosh', AS + AN.lt3 - .05, .7); sfx('drop', AS + AN.lt3 + .45, .6); sfx('pop', AS + AN.fastest, .7);
  sfx('whoosh', AS + AN.f0 - .2, .5); sfx('pop', AS + AN.f0, .8); F1_AT.forEach(a => sfx('click', AS + a, .5)); F2_AT.forEach(a => sfx('click', AS + a, .5));
  sfx('pop', AS + AN.s18, .7); sfx('pop', AS + AN.s9, .7); sfx('ding', AS + AN.s2, .9); sfx('sparkle', AS + AN.s2 + .2, .6);
  sfx('whoosh', AS + AN.memo - .1, .5); sfx('pop', AS + AN.addWork, 1); sfx('pop', AS + AN.notDays, 1); sfx('sparkle', AS + AN.notDays + .3, .6);

  return function (t) {
    const uq = t - QS, uc = t - CD, ua = t - AS, ans = ua >= 0, rv = ua - AN.reveal;
    const phB = ans && ua >= AN.split - .2, phC = ans && ua >= AN.w9 - .3;
    // banners
    const sweep = E.out(P(uq, Q.go, .5));
    const bqOut = ans ? P(ua, AN.sol - .05, .2) : 0;
    tf(bQ, { x: lerp(-1100, 0, sweep), r: lerp(-8, 0, sweep), s: 1 + .03 * Math.sin(uq * 5) * (uq > Q.go + .5 ? 1 : 0), o: clamp((uq - Q.go) * 4) * (1 - bqOut) });
    tf(bA, { ...life(ua, AN.sol, AN.split - .3, { from: .4, dy: 0, d: .5, el: true }) });
    tf(hdrA, pop(ua, AN.split - .2, AN.memo - .2)); tf(hdrM, pop(ua, AN.memo, 1e9));
    // question card + lines
    const qOut = phB ? E.in(P(ua, AN.split - .2, .4)) : 0;
    tf(qc, { ...life(uq, Q.qa - .3, 1e9, { from: .7, dy: 60 }), y: life(uq, Q.qa - .3, 1e9, { from: .7, dy: 60 }).y - 200 * qOut, o: life(uq, Q.qa - .3, 1e9).o * (1 - qOut) });
    ql.forEach((l, i) => { const k = E.out(P(uq, QL_AT[i], .4)); l.style.opacity = k; l.style.transform = `translateX(${(1 - k) * 40}px)`; });
    hls.forEach((e, i) => { const k = P(uq, HL_AT[i], .3); e.style.background = `rgba(255,230,128,${k})`; e.style.color = k > .5 ? '#9A5B00' : '#0B1A3A'; e.style.display = 'inline-block'; e.style.transform = `scale(${1 + .12 * Math.max(0, 1 - Math.abs(uq - HL_AT[i] - .15) / .3)})`; });
    // thinking aid: plain wall, never a grid; leaves when the answer's wall arrives
    const aidO = clamp((uq - Q.qa) / .4) * (1 - qOut);
    tf(aid, { o: aidO, y: 300 * qOut });
    aA.pose({ t, roll: .35, ph: 0, blink: WORK.blinkAt(t) }); aB.pose({ t, roll: .35, ph: 2, blink: WORK.blinkAt(t, 1) });
    // cards
    cards.forEach((c, i) => {
      const inC = ans && ua >= AN.w9 - .6, G = inC ? GC(i) : GQ(i);
      c.el.style.left = G.x + 'px'; c.el.style.width = G.w + 'px'; c.el.style.top = G.y + 'px';
      const l = life(uq, OPT_AT[i], 1e9, { from: .4, dy: 0, d: .5 });
      const xin = (1 - E.out(P(uq, OPT_AT[i], .5))) * 500;
      c.tx.style.opacity = E.out(P(uq, VAL_AT[i] - .05, .3));
      let o = l.o, s = l.s, x = xin, y = 0, r = 0;
      const correct = i === 0, revealed = ans && rv >= 0;
      // B: slide away; C: come back as the trap list
      if (phB && !phC) { const k = E.in(P(ua, AN.split - .2, .4)); o *= 1 - k; y = 260 * k; }
      if (phC) { const k = E.out(P(ua, AN.w9 - .3, .5)); o = k; y = (1 - k) * 80; s = 1; x = 0; }
      if (revealed && correct) {
        const rp = E.back(P(rv, 0, .5));
        c.ov.style.opacity = clamp(rv / .25); c.tx.style.color = '#fff'; c.cb.style.background = '#15803D';
        tf(c.ok, { s: lerp(0, 1, E.elastic(P(rv, .1, .8))), o: clamp(rv / .1) });
        c.el.style.boxShadow = `0 10px 0 #15803D,0 0 0 6px #fff,0 0 ${40 + 14 * Math.sin(ua * 3)}px 12px rgba(74,222,128,.55)`;
        s *= phC ? 1 : 1 + .08 * rp;
        c.el.style.filter = '';
      } else {
        c.ov.style.opacity = 0; tf(c.ok, { o: 0 });
        const dim = revealed && !phC ? .6 * E.out(P(rv, 0, .45)) : 0;
        o *= 1 - dim; c.el.style.filter = dim ? `grayscale(${dim * 1.5})` : '';
        const wr = WRONG_AT[i] != null && ans ? P(ua, WRONG_AT[i], .4) : 0;
        c.el.style.boxShadow = wr > 0 ? `0 10px 0 rgba(0,0,0,.25),0 0 0 ${6 * wr}px #EF4444` : '';
        if (c.xx) { tf(c.xx, { s: lerp(0, 1, E.elastic(P(ua, WRONG_AT[i], .7))), o: clamp((ua - WRONG_AT[i]) * 8) }); tf(c.why, life(ua, WHY_AT[i], 1e9, { from: .4, dy: 0, d: .45 })); }
        if (wr > 0 && wr < 1) x += Math.sin(ua * 70) * 10 * (1 - wr);
        // "< 3 วัน": every card ≥ 3 days drops away
        const dr = ans ? E.in(P(ua, AN.lt3 + .45 + (i - 1) * .08, .6)) : 0;
        x += 760 * dr * (i % 2 ? 1 : -1); y += 60 * dr; r = 14 * dr * (i % 2 ? 1 : -1); o *= 1 - clamp(dr * 1.6);
      }
      if (correct && phC) s *= 1 + .04 * E.out(P(ua, AN.lt3 + .2, .4)) + .015 * Math.sin(ua * 4) * (ua > AN.lt3 ? 1 : 0);
      const fOut = ans ? P(ua, AN.f0 - .3, .35) : 0;
      y += Math.sin(t * 1.7 + i * 1.1) * (phC ? 7 : 4);   // gentle float keeps the list alive between beats
      r += Math.sin(t * 1.3 + i) * (phC ? .6 : .3);
      tf(c.el, { o: o * (1 - fOut), s, x, y, r });
    });
    // countdown: appears on "ให้เวลาคิด", ticks exactly 150 frames from CD, neutral colours
    if (uc < 0) {
      tf(cd.el, life(uq, Q.think + .2, 1e9, { from: .3, dy: 30 })); cd.num.textContent = 5; cd.num.style.transform = 'none';
      cd.ring.setAttribute('stroke-dashoffset', 0); cd.dot.setAttribute('cx', cd.c); cd.dot.setAttribute('cy', cd.c - cd.r);
    } else {
      // the shared component replays its entrance at uc = 0; the ring is already on screen, so hold it steady
      NSP.drawCountdown(cd, uc, T.cdLen);
      const fr = uc - Math.floor(uc);
      if (uc < T.cdLen) tf(cd.el, { s: 1 + .05 * Math.max(0, 1 - fr / .25) });
      else tf(cd.el, { s: 1 - .12 * E.out(P(uc, T.cdLen, .3)), o: 1 - P(uc, T.cdLen, .3) });
    }
    NSP.drawConfetti(cf0, t, AS + AN.reveal + .05, 2.2);
    // ---------- B: work set ----------
    const k1 = E.out(P(ua, AN.split - .1, .7)), k2 = E.in(P(ua, AN.w9 - .4, .45)), k3 = E.out(P(ua, AN.memo - .15, .6));
    const wy = !ans ? 1300 : ua < AN.memo - .15 ? lerp(1300, 0, k1) + 1300 * k2 : lerp(1300, 0, k3);
    tf(wsC, { y: wy, o: ans ? 1 : 0 });
    tf(dA, pop(ua, AN.split + .35)); tf(dB, pop(ua, AN.split + .55));
    tf(rA, pop(ua, AN.r1)); tf(rB, pop(ua, AN.r2));
    const eqOut = 1 - P(ua, AN.w9 - .4, .3);
    e1.forEach((e, i) => { const l = life(ua, E1[i], 1e9, { from: .3, dy: 30, d: .45 }); tf(e, { ...l, o: l.o * eqOut }); });
    e2.forEach((e, i) => { const l = life(ua, E2[i], 1e9, { from: .3, dy: 30, d: .45 }); tf(e, { ...l, o: l.o * eqOut }); });
    const day = ans ? WORK.dayAt(ua, DAYS) : 0;
    g.draw({ lines: ans ? P(ua, AN.g6 - .1, .9) : 0, day, preview: ans && ua < AN.six ? [E.out(P(ua, AN.r1, .3)), E.out(P(ua, AN.r2, .3))] : [0, 0], glow: ua });
    drawCalendar(ws, ua, DAYS, AN.six - .25);
    drawOfficers(ws, t, { roll: ua > AN.six && ua < AN.done ? 1 : .45, look: -1 });
    const rl = life(ua, AN.done, AN.w9 - .3, { from: .2, dy: 0, d: .7, el: true, out: .3 });
    tf(res, { ...rl, s: rl.s * (1 + .03 * Math.sin(ua * 5)) }); tf(resB, { ...rl, s: 1 });
    NSP.drawConfetti(cf, t, AS + AN.done + .05, 2.2);
    // ---------- C: traps ----------
    tf(chk, pop(ua, AN.check, AN.faster - .1));
    tf(faster, life(ua, AN.faster, AN.f0 - .3, { from: .6, dy: 30 }));
    const ls = E.inOut(P(ua, AN.lt3 - .05, .5));
    tf(line, { sx: Math.max(.001, ls), sy: 1, o: ls > 0 ? 1 - P(ua, AN.f0 - .3, .3) : 0 });
    tf(lt, life(ua, AN.lt3 + .9, AN.f0 - .3, { from: .3, dy: 20, el: true, d: .7 }));
    tf(fastC, pop(ua, AN.fastest, AN.f0 - .3));
    // ---------- D: shortcut formula ----------
    const fo = 1 - P(ua, AN.memo - .3, .3);
    const fl = k => ({ y: Math.sin(t * 1.6 + k) * 8, r: Math.sin(t * 1.1 + k) * .8 });
    tf(fT, { ...pop(ua, AN.f0, AN.memo - .3), r: Math.sin(t * 2) * 3 });
    [F1, F2, F3, F2eq].forEach((f, k) => tf(f, { ...fl(k), o: 1 }));
    const tok = (els, ats) => els.forEach((e, i) => { const l = life(ua, ats[i], 1e9, { from: .3, dy: 24, d: .45 }); tf(e, { ...l, o: l.o * fo }); });
    tok(f1t, F1_AT); f1b.style.transform = `scaleX(${E.out(P(ua, AN.fDiv, .35))})`; f1b.style.opacity = fo;
    tok(f2t, F2_AT); f2b.style.transform = `scaleX(${E.out(P(ua, AN.sDiv - .1, .3))})`; f2b.style.opacity = fo;
    tf(F2eq, { ...life(ua, AN.s18 - .05, 1e9, { from: .3, dy: 0 }), o: life(ua, AN.s18 - .05, 1e9).o * fo });
    tok(f3t, [AN.s18, AN.s9]); f3b.style.transform = `scaleX(${E.out(P(ua, AN.s18, .3))})`; f3b.style.opacity = fo;
    const r2 = life(ua, AN.s2, 1e9, { from: .2, dy: 0, d: .7, el: true });
    tf(F3eq, { ...r2, o: r2.o * fo, y: Math.sin(t * 1.6 + 3) * 8 });
    // ---------- E: memory phrase with the finished wall ----------
    tf(mBox, { o: E.out(P(ua, AN.addWork - .2, .4)), s: 1 });
    const q1 = life(ua, AN.addWork, 1e9, { from: .3, dy: 40, el: true, d: .8 }), q2 = life(ua, AN.notDays, 1e9, { from: .3, dy: 40, el: true, d: .8 });
    tf(m1, { ...q1, s: q1.s * (1 + .025 * Math.sin(ua * 4)) }); tf(m2, { ...q2, s: q2.s * (1 + .025 * Math.sin(ua * 4 + 1)) });
  };
};
