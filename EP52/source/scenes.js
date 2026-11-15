// EP52 scenes — every element is a pure function of t (renderAt(t)), timed to window.BEATS (measured phrase starts).
(function () {
  const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark } = window.NSP;
  const { sentence, chip, big, formula } = window.CARDS;
  const { DidVerbTransformation, measure } = window.GRAMMAR;
  const { world, actor, calendar, ICONS, COL } = window.EP52;
  const TL = window.TL, B = window.BEATS;
  const T = { hook: TL.hook[0], story: TL.story[0], know: TL.know[0], expl: TL.expl[0], quiz: TL.quiz[0], cd: TL.cd[0], ans: TL.ans[0], promo: TL.promo[0], end: TL.end };
  const FPS = TL.fps, CD_F0 = Math.round(T.cd * FPS);
  const A2 = T.ans + B.ans.why - .05;          // answer explanation part starts (after the reveal)
  const blink = window.STORY.blinkAt;
  const L = (el, t, a, b, o) => tf(el, life(t, a, b, o));
  const W = world();
  const putWorld = slot => { if (W.root.parentNode !== slot) slot.appendChild(W.root); };
  const officer = actor('P', W.actors);         // the one officer living in the world
  const wordCard = (txt, cls, size) => h(`<div class="abs c" style="left:0;top:0"><span class="wd ${cls}" data-ess="1" style="font-size:${size}px;font-weight:800;padding:6px 30px;border-radius:26px;box-shadow:0 12px 24px rgba(20,43,83,.2),0 0 0 6px #fff">${txt}</span></div>`);
  const place = (el, x, y, extra = {}) => tf(el, { x, y, ...extra });
  const centerOf = (el, cx, cy, l) => { const w = el.firstChild.offsetWidth || 200, hh = el.firstChild.offsetHeight || 100; tf(el, { ...l, x: cx - w / 2, y: cy - hh / 2 + (l.y || 0) }); };
  // presenter officer (screen space) used in lesson scenes — the same look 'P'
  function presenter(scene) { const a = actor('P', scene); return a; }
  function poseTalk(a, u, { x = 175, y = 1930, s = .66, gestures = [], expr = 'smile', think = 0, cheer = 0 } = {}) {
    let g = 0; gestures.forEach(at => { const d = u - at; if (d > 0 && d < 1.6) g = Math.max(g, Math.sin(clamp(d / 1.6) * Math.PI)); });
    const armR = cheer ? [150 + 10 * Math.sin(u * 8), 30] : think ? [28, 128] : [lerp(10, 112, g), lerp(-6, 26, g)];
    const armL = cheer ? [150 - 10 * Math.sin(u * 8), 30] : [8 + 2 * Math.sin(u * 1.4), -6];
    a.pose({ t: u, expr, blink: blink(u, x * .01), armR, armL, tilt: think ? -6 : 3 * Math.sin(u * 1.1) + 4 * g, lookX: think ? -.6 : .4, lookY: think ? -1 : 0, bob: cheer ? -Math.abs(Math.sin(u * 8)) * 18 : 0 });
    a.place(x, y + (cheer ? -Math.abs(Math.sin(u * 8)) * 10 : 0), s, 1);
  }

  // ============================================================ SCENE 1 — HOOK
  const sH = $('sHook');
  sH.insertAdjacentHTML('beforeend', `
    <div id="h-t1"><div class="row c" style="top:400px"><div class="big" data-ess="1" style="font-size:80px">เตรียมสอบ</div></div>
      <div class="row c" style="top:490px"><div class="big" data-ess="1" style="font-size:80px;color:${COL.PINK}">นายสิบตำรวจ</div></div></div>
    <div class="row c" id="h-t2" style="top:598px"><div class="chip blue" data-ess="1" style="font-size:44px;padding:10px 38px">วิชาภาษาอังกฤษ</div></div>
    <div id="h-title">
      <div class="row c" style="top:684px"><div class="big" data-ess="1" style="font-size:66px;color:${COL.BLUE}">DID YOU GO</div></div>
      <div class="row c" style="top:766px"><div class="chip navy" data-ess="1" style="font-size:32px;padding:6px 26px">OR</div></div>
      <div class="row c" style="top:830px"><div class="big" data-ess="1" style="font-size:66px;color:${COL.PINK}">DID YOU WENT?</div></div></div>`);
  const hT1 = $('h-t1'), hT2 = $('h-t2'), hTitle = $('h-title');
  const hDid = wordCard('DID', 'd', 70), hGo = wordCard('GO', 'g', 62), hWent = wordCard('WENT', 'w', 58);
  const hQ = h(`<div class="qm c" style="left:0;top:0">${ICONS.qmark(150)}</div>`);
  [hDid, hGo, hWent, hQ].forEach(e => sH.appendChild(e));
  const hC1 = sentence(sH, 694, ['Did you go?'], { st: 'q', size: 66, cls: 'blue' });
  const hVs = chip(sH, 866, 'หรือ', { col: 'navy', size: 36 });
  const hC2 = sentence(sH, 940, ['Did you went?'], { st: 'q', size: 66 });
  const hWhich = chip(sH, 1110, 'แบบไหนถูกกันแน่?', { col: 'white', size: 42 });
  const hEasy = chip(sH, 1110, 'ดูเหมือนง่ายมาก…', { col: 'white', size: 42 });
  const hTrap = chip(sH, 1110, '⚠ กับดัก! พลาดกันบ่อย', { col: 'warn', size: 42 });
  const hYd = chip(sH, 698, `${ICON.cal(54, '#142B53')}YESTERDAY`, { col: 'warn', size: 64 });
  const hArrow = h(`<div class="abs c" style="left:500px;top:822px;width:80px;height:80px"><svg width="80" height="80" viewBox="0 0 24 24"><path d="M12 3v16M5 13l7 7 7-7" stroke="#142B53" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`); sH.appendChild(hArrow);
  const hW2 = sentence(sH, 914, ['<span class="wd w">WENT</span> ?'], { st: 'q', size: 72 });
  const hW2lab = chip(sH, 1100, 'กริยาช่องที่สอง?', { col: 'white', size: 40 });
  const hDid2 = wordCard('DID', 'd', 66), hWent2 = wordCard('WENT', 'w', 58);
  const hQ2 = h(`<div class="qm c" style="left:0;top:0">${ICONS.qmark(150)}</div>`);
  [hDid2, hWent2, hQ2].forEach(e => sH.appendChild(e));
  const hStill = sentence(sH, 944, ['มี Did อยู่แล้ว…', 'กริยาหลักยังเป็นช่องสอง?'], { size: 44, cls: 'blue' });
  const student = actor('A', sH);
  const hThink = h(`<div class="qm c" style="left:0;top:0">${ICONS.qmark(110)}</div>`); sH.appendChild(hThink);
  const HB = B.hook;
  // sfx
  sfx('sparkle', .05, .8); sfx('pop', HB.subject, .6);
  sfx('whoosh', 2.95, .6); sfx('pop', HB.go - .05, .8); sfx('pop', HB.went - .05, .8); sfx('click', HB.which, .6);
  sfx('cloth', HB.easy - .2, .7); sfx('pop', HB.easy + .4, .7); sfx('drop', HB.trap, .5);
  sfx('whoosh', HB.yday - .25, .6); sfx('page', HB.yday, .7); sfx('pop', HB.v2, .8);
  sfx('whoosh', HB.did - .25, .6); sfx('stamp', HB.did + .05, .6); sfx('pop', HB.did + .5, .7); sfx('pop', HB.still, .6); sfx('riser', HB.q - .3, .5);
  function drawHook(t) {
    const u = t - T.hook;
    putWorld($('slotHook')); W.root.querySelector('.beacon').style.visibility = 'hidden';
    const cards = u > 2.9;
    W.camera(3640, 660, .92 + .05 * clamp(u / 3), u, cards ? .9 * E.out(P(u, 2.9, .6)) : 0);
    $('hVeil').style.opacity = cards ? .9 * E.out(P(u, 2.9, .6)) : 0;
    // officer: waving in front of the station
    const wave = Math.sin(u * 7);
    officer.pose({ t: u, expr: u < 15.4 ? 'happy' : u < 20.9 ? 'curious' : 'surprise', blink: blink(u), armR: u < 3 ? [150 + 12 * wave, 40 + 18 * wave] : [10, -6], armL: [8, -6], turn: .3, tilt: 3 * Math.sin(u * 1.3) });
    officer.place(3420, 1450, .92, 1);
    // header: present from frame 0
    tf(hT1, { s: 1 + .015 * Math.sin(u * 2.2), y: 0 });
    const pulse = Math.exp(-Math.max(0, u - HB.subject) * 3) * (u > HB.subject ? 1 : 0);
    tf(hT2, { s: 1 + .1 * pulse });
    tf(hTitle, { o: 1 - P(u, 2.75, .3), y: -20 * E.out(P(u, 2.75, .3)), s: 1 + .012 * Math.sin(u * 3) });
    const fo = 1 - P(u, 2.7, .3);
    place(hDid, 470, 1000 + bob(u, 0, 10), { r: -8, o: fo }); place(hGo, 680, 1060 + bob(u, 1, 12), { r: 6, o: fo }); place(hWent, 520, 1160 + bob(u, 2, 10), { r: -4, o: fo });
    place(hQ, 840, 1250 + bob(u, 3, 14), { r: 8 * Math.sin(u * 2), o: fo });
    // A — two challenge cards
    L(hC1, u, HB.go - .1, HB.yday - .3, { from: .5, dy: 60 });
    L(hVs, u, HB.went - .3, HB.yday - .3, { from: .3, dy: 20 });
    L(hC2, u, HB.went - .1, HB.yday - .3, { from: .5, dy: 60 });
    L(hWhich, u, HB.which, HB.easy - .1, { from: .5, dy: 30 });
    L(hEasy, u, HB.easy, HB.trap - .1, { from: .5, dy: 30 });
    const tr = life(u, HB.trap, HB.yday - .3, { from: .5, dy: 30 }); tf(hTrap, { ...tr, x: Math.sin(u * 40) * 8 * Math.exp(-Math.max(0, u - HB.trap) * 4) });
    // B — yesterday clue → WENT?
    L(hYd, u, HB.yday, HB.did - .25, { from: .4, dy: 60 });
    L(hArrow, u, HB.v2 - .3, HB.did - .25, { from: .3, dy: -20 });
    const w2 = life(u, HB.v2, HB.did - .25, { from: .3, dy: 40, el: true }); tf(hW2, { ...w2, r: 3 * Math.sin(u * 6) });
    L(hW2lab, u, HB.v2 + .5, HB.did - .25, { from: .5, dy: 20 });
    // C — DID ? WENT
    const d2 = life(u, HB.did, 1e9, { from: .3, dy: -200 }); centerOf(hDid2, 355, 760, d2);
    const w3 = life(u, HB.did + .45, 1e9, { from: .3, dy: -200 }); centerOf(hWent2, 725, 760, w3);
    const qg = u > HB.q ? 1 + .35 * E.back(P(u, HB.q, .5)) : 1;
    { const lq = life(u, HB.did + .8, 1e9, { from: .2, dy: 0, el: true }); tf(hQ2, { x: 540, y: 770, o: lq.o, s: .72 * lq.s * qg * (1 + .06 * Math.sin(u * 6)), r: 10 * Math.sin(u * 3) }); }
    L(hStill, u, HB.still, 1e9, { from: .5, dy: 40 });
    // student examining the cards
    const si = E.out(P(u, HB.easy - .3, .8));
    const sw = u > HB.easy - .3 && u < HB.easy + .5;
    student.pose({ t: u, walk: u * 9, walkAmt: sw ? 1 - P(u, HB.easy + .2, .3) : 0, expr: u < HB.v2 ? 'curious' : u < HB.did ? 'happy' : u < HB.q ? 'worried' : 'surprise', blink: blink(u, .7), armR: u > HB.easy + .4 ? [32, 128] : [8, -6], tilt: -6, lookX: -.7, lookY: -1, turn: -.3 });
    student.place(lerp(1260, 870, si), 1905, .7, -1, si > 0 ? 1 : 0);
    { const lt = life(u, HB.easy + .6, 1e9, { from: .2, dy: 0, el: true }); tf(hThink, { x: 880, y: 1300 + bob(u, 0, 10), o: lt.o, s: lt.s }); }
  }

  // ============================================================ SCENE 2 — STORY
  const sS = $('sStory');
  const cal = calendar(); cal.classList.add('c'); cal.style.left = '360px'; cal.style.top = '372px'; sS.appendChild(cal);
  const sCap = sentence(sS, 372, ['<span class="wd y">เมื่อวาน</span>', 'เจ้าหน้าที่ตำรวจไปทำงานตามปกติ'], { size: 40 });
  const sThq = sentence(sS, 372, ['เมื่อวานเจ้าหน้าที่ตำรวจ', 'ไปทำงานหรือไม่?'], { size: 48 });
  const sEn = h(`<div class="row c" style="top:640px"><div class="sc blue" style="font-size:43px;padding:26px 40px"><div data-ess="1" style="white-space:nowrap"><span class="slotbox" id="sSlot"></span> the police officer</div><div data-ess="1" style="white-space:nowrap"><span class="blank2" id="sBlank"></span>to work yesterday?</div></div></div>`); sS.appendChild(sEn);
  const sEnLab = chip(sS, 592, 'English', { col: 'navy', size: 28 });
  const sDid = wordCard('Did', 'd', 46), sWent = wordCard('went', 'w', 44);
  const sCard = sEn.firstChild; sCard.appendChild(sDid); sCard.appendChild(sWent);
  const sWentQ = h(`<div class="qm c" style="left:0;top:0;width:90px;height:90px;margin:-45px 0 0 -45px">${ICONS.qmark(90)}</div>`); sCard.appendChild(sWentQ);
  const sPast = chip(sS, 1000, 'เหตุการณ์ในอดีต → went ?', { col: 'warn', size: 40 });
  const sRule = h(`<div class="row c" style="top:1040px"><div class="sc" style="font-size:54px;padding:24px 50px"><div data-ess="1" style="display:flex;align-items:center;gap:16px;white-space:nowrap"><span id="sLock"></span>กฎสำคัญ!</div><div data-ess="1" style="font-size:40px;color:${COL.BLUE};white-space:nowrap">DID + กริยาหลัก = ?</div></div></div>`); sS.appendChild(sRule);
  const lockSvg = o => `<svg width="64" height="64" viewBox="0 0 24 24"><rect x="4" y="10" width="16" height="12" rx="3" fill="${COL.PINK}"/><path d="M8 10V7a4 4 0 0 1 ${o ? '8 0' : '8 0v3'}" stroke="${COL.BLUE}" stroke-width="2.6" fill="none" stroke-linecap="round" transform="${o ? 'translate(0 -3) rotate(-25 8 10)' : ''}"/><circle cx="12" cy="16" r="2" fill="#fff"/></svg>`;
  const SB = B.story, WALK0 = SB.officer + .25, WALK1 = SB.thq - .2, X0 = 700, X1 = 3790;
  sfx('page', T.story + .6, .9); sfx('whoosh', T.story + SB.officer - .2, .5);
  for (let k = 0; ; k++) { const tt = WALK0 + k * (WALK1 - WALK0) / 22; if (tt > WALK1 - .2) break; sfx('step', T.story + tt, .9); }
  sfx('pop', T.story + SB.thq, .7); sfx('pop', T.story + SB.thq + 1.0, .5); sfx('whoosh', T.story + SB.did - .3, .5); sfx('stamp', T.story + SB.did + .35, .8);
  sfx('pop', T.story + SB.trap, .6); sfx('click', T.story + SB.past, .6); sfx('riser', T.story + SB.but - .2, .5); sfx('sparkle', T.story + SB.rule + .2, .8); sfx('ding', T.story + SB.rule + .3, .5);
  let slotPos = null;
  function drawStory(t) {
    const u = t - T.story;
    putWorld($('slotStory')); W.root.querySelector('.beacon').style.visibility = 'visible';
    // walk: eased travel from home to the police station
    const wp = E.inOut(P(u, WALK0, WALK1 - WALK0));
    const ox = lerp(X0, X1, wp), walking = u > WALK0 && u < WALK1;
    const z = 1.05 - .17 * Math.sin(wp * Math.PI);
    const cx = u < WALK0 ? 760 : u < WALK1 ? clamp(ox + 120, 760, 3640) : lerp(3640, 3700, E.out(P(u, WALK1, 1.2)));
    const cards = u > SB.thq - .2;
    W.camera(cx, 760, z, u, cards ? .8 * E.out(P(u, SB.thq - .2, .6)) : 0);
    $('sVeil').style.opacity = cards ? .85 * E.out(P(u, SB.thq - .2, .6)) : .35 * (1 - P(u, SB.officer, .5));
    const arrived = u >= WALK1;
    officer.pose({ t: u, walk: wp * 46, walkAmt: walking ? 1 : 0, expr: u < 1.4 ? 'curious' : arrived ? 'happy' : 'smile', blink: blink(u, .3), lookY: u < 2 ? -1 : 0, lookX: u < 2 ? -.5 : arrived ? 0 : .6,
      armR: arrived && u < WALK1 + 1.6 ? [140 + 14 * Math.sin(u * 7), 40] : undefined, turn: arrived ? 0 : .6, tilt: arrived ? 4 * Math.sin(u * 1.4) : 0 });
    officer.place(ox, 1440, 1.0, 1);
    // calendar flip to YESTERDAY
    const cl = life(u, SB.yday - .1, SB.officer - .1, { from: .5, dy: 60 }); tf(cal, cl); cal.flip(P(u, .55, .8));
    L(sCap, u, SB.officer + .1, SB.thq - .3, { from: .6, dy: 40 });
    L(sThq, u, SB.thq, 1e9, { from: .6, dy: 40 });
    L(sEn, u, SB.thq + .9, 1e9, { from: .6, dy: 40 }); L(sEnLab, u, SB.thq + 1.1, 1e9, { from: .4, dy: 20 });
    if (!slotPos) { const sl = $('sSlot'), bl = $('sBlank'); slotPos = { x: sl.offsetLeft + sl.offsetWidth / 2, y: sl.offsetTop + sl.offsetHeight / 2, bx: bl.offsetLeft + bl.offsetWidth / 2, by: bl.offsetTop + bl.offsetHeight / 2 }; }
    // DID drops into the empty slot
    const dq = P(u, SB.did, .55);
    centerOf(sDid, slotPos.x, slotPos.y, { y: -(1 - E.back(dq)) * 420, o: clamp(dq * 4), s: lerp(1.5, 1, E.out(dq)) * (1 + .1 * Math.exp(-Math.max(0, u - SB.did - .55) * 6) * (u > SB.did + .55 ? 1 : 0)) });
    // WENT hovers over the blank as a tempting (unconfirmed) candidate — never inserted
    const wq = life(u, SB.trap, SB.but - .1, { from: .4, dy: -80 });
    const bx = slotPos.bx, by = slotPos.by;
    centerOf(sWent, bx + 70, by + 130 + bob(u, 0, 10), { ...wq, r: 6 * Math.sin(u * 4) });
    { const lq = life(u, SB.trap + .3, SB.but - .1, { from: .2, dy: 0, el: true }); tf(sWentQ, { x: bx + 160, y: by + 95 + bob(u, 1, 8), o: lq.o, s: lq.s }); }
    L(sPast, u, SB.past, SB.but - .1, { from: .5, dy: 30 });
    const rl = life(u, SB.but, 1e9, { from: .3, dy: 60, el: true }); tf(sRule, { ...rl, s: rl.s * (1 + .03 * Math.sin(u * 5)) });
    const open = u > SB.rule + .2; const lk = $('sLock'); if (lk.dataset.o !== String(open)) { lk.innerHTML = lockSvg(open); lk.dataset.o = String(open); }
  }

  // ============================================================ SCENE 3 — DID + V1 (knowledge)
  const sK = $('sKnow'), KB = B.know;
  const kPres = presenter(sK);
  const kAux = sentence(sK, 380, ['<span class="wd d">DID</span> = PAST SIMPLE', 'AUXILIARY'], { size: 52 });
  const kAuxTh = chip(sK, 590, 'ตัวช่วย (auxiliary) ที่บอกว่าเป็นอดีต', { col: 'white', size: 34 });
  sK.insertAdjacentHTML('beforeend', `<div id="kTl"><div class="tl-line"></div>
    <div class="tl-node" style="left:330px;top:860px;background:${COL.PINK}"></div><div class="tl-node" style="left:750px;top:860px;background:${COL.BLUE}"></div>
    <div class="tl-lab" data-ess="1" style="left:330px;top:920px;font-size:34px;color:${COL.PINK}">YESTERDAY<br><span style="font-size:30px">เมื่อวาน</span></div>
    <div class="tl-lab" data-ess="1" style="left:750px;top:920px;font-size:34px;color:${COL.BLUE}">TODAY<br><span style="font-size:30px">วันนี้</span></div>
    <div id="kTlDid" class="abs c" style="left:266px;top:740px"><span class="wd d" data-ess="1" style="font-size:44px;font-weight:800;padding:2px 22px">DID</span></div></div>`);
  const kF = formula(sK, 560, [['DID', 'pink'], ['SUBJECT', 'white'], ['V1', 'blue']], { size: 46 });
  const kV1a = chip(sK, 700, 'V1 = กริยาช่องที่หนึ่ง', { col: 'blue', size: 42 });
  const kV1b = chip(sK, 810, 'รูปพื้นฐาน (base form)', { col: 'white', size: 36 });
  const kEx = [
    sentence(sK, 490, ['<span class="wd d">Did</span> you <span class="wd g">go</span>', 'to school yesterday?'], { st: 'ok', size: 42, cls: 'blue', tag: false }),
    sentence(sK, 658, ['<span class="wd d">Did</span> he <span class="wd g">work</span>', 'last night?'], { st: 'ok', size: 42, cls: 'blue', tag: false }),
    sentence(sK, 826, ['<span class="wd d">Did</span> they <span class="wd g">play</span>', 'football?'], { st: 'ok', size: 42, cls: 'blue', tag: false }),
  ];
  const kNo = [sentence(sK, 1030, ['Did you went…?'], { st: 'bad', size: 42 }), sentence(sK, 1150, ['Did he worked…?'], { st: 'bad', size: 42 }), sentence(sK, 1270, ['Did they played…?'], { st: 'bad', size: 42 })];
  const kRc = [sentence(sK, 450, ['<span class="wd d">Did</span> + <span class="wd g">go</span>'], { st: 'ok', size: 54 }), sentence(sK, 610, ['<span class="wd d">Did</span> + <span class="wd g">work</span>'], { st: 'ok', size: 54 }), sentence(sK, 770, ['<span class="wd d">Did</span> + <span class="wd g">play</span>'], { st: 'ok', size: 54 })];
  const kBig = big(sK, 950, `<span style="color:${COL.PINK}">DID</span> + <span style="color:${COL.BLUE}">V1</span>`, { size: 130 });
  const kBigTh = chip(sK, 1130, 'Did + กริยาช่องที่หนึ่ง', { col: 'pink', size: 40 });
  sfx('pop', T.know + KB.aux, .7); sfx('sparkle', T.know + 2.4, .5); sfx('whoosh', T.know + KB.rule - .2, .5);
  [0, 1, 2].forEach(i => sfx('pop', T.know + KB.rule + .1 + i * .25, .6)); sfx('ding', T.know + KB.v1 + .2, .5);
  ['ex1', 'ex2', 'ex3'].forEach(k => { sfx('pop', T.know + KB[k] - .05, .7); sfx('success', T.know + KB[k] + .9, .45); });
  ['no1', 'no2', 'no3'].forEach(k => sfx('drop', T.know + KB[k] + .1, .45));
  sfx('whoosh', T.know + KB.recap - .2, .5); [0, 1, 2].forEach(i => sfx('pop', T.know + KB.recap + i * .2, .6)); sfx('sparkle', T.know + KB.recap + .9, .7);
  function drawKnow(t) {
    const u = t - T.know;
    poseTalk(kPres, u, { gestures: [KB.aux, KB.rule, KB.ex1, KB.no1, KB.recap], expr: u > KB.no1 && u < KB.recap ? 'neutral' : 'happy' });
    L(kAux, u, KB.aux, KB.rule - .15, { from: .5, dy: 40 });
    L(kAuxTh, u, KB.aux + .9, KB.rule - .15, { from: .5, dy: 20 });
    tf($('kTl'), life(u, 1.6, KB.rule - .15, { from: .8, dy: 30 }));
    const dd = life(u, 2.3, 1e9, { from: .3, dy: -60, el: true }); tf($('kTlDid'), { ...dd, y: dd.y + bob(u, 0, 6) });
    const up = E.inOut(P(u, KB.ex0, .5));
    const fl = life(u, KB.rule, KB.recap - .2, { from: .5, dy: 40 }); tf(kF, { ...fl, y: fl.y - up * 188, s: fl.s * lerp(1, .82, up) });
    kF.parts.forEach((p, i) => { const pp = life(u, KB.rule + .1 + i * .25, 1e9, { from: .3, dy: 0, el: true }); const hl = i === 2 && u > KB.v1 ? 1 + .1 * Math.sin((u - KB.v1) * 7) * Math.exp(-(u - KB.v1) * .6) : 1; tf(p, { ...pp, s: pp.s * hl }); });
    L(kV1a, u, KB.v1, KB.ex0, { from: .5, dy: 30 }); L(kV1b, u, KB.v1 + .4, KB.ex0, { from: .5, dy: 30 });
    ['ex1', 'ex2', 'ex3'].forEach((k, i) => { L(kEx[i], u, KB[k] - .1, KB.recap - .2, { from: .6, dy: 50 }); tf(kEx[i].card.querySelector('.bdg'), life(u, KB[k] + .9, 1e9, { from: 0, dy: 0, el: true })); });
    ['no1', 'no2', 'no3'].forEach((k, i) => { const l = life(u, KB[k], KB.recap - .2, { from: .6, dy: 30 }); tf(kNo[i], { ...l, x: Math.sin(u * 40) * 6 * Math.exp(-Math.max(0, u - KB[k] - .3) * 5) * (u > KB[k] + .3 ? 1 : 0) }); });
    kRc.forEach((c, i) => L(c, u, KB.recap + i * .2, 1e9, { from: .5, dy: 40 }));
    const bg = life(u, KB.recap + .8, 1e9, { from: .3, dy: 30, el: true }); tf(kBig, { ...bg, s: bg.s * (1 + .03 * Math.sin(u * 4)) });
    L(kBigTh, u, KB.recap + 1.3, 1e9, { from: .5, dy: 20 });
  }

  // ============================================================ SCENE 4 — STATEMENT vs QUESTION (signature transformation)
  const sE = $('sExpl'), XB = B.expl;
  const ePres = presenter(sE);
  const eYd = chip(sE, 470, `${ICON.cal(60, '#142B53')}YESTERDAY`, { col: 'warn', size: 72 });
  const eArr = h(`<div class="abs c" style="left:500px;top:620px;width:80px;height:80px"><svg width="80" height="80" viewBox="0 0 24 24"><path d="M12 3v16M5 13l7 7 7-7" stroke="#142B53" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`); sE.appendChild(eArr);
  const eWent = sentence(sE, 730, ['<span class="wd w">WENT</span>'], { size: 84 });
  const eWentLab = chip(sE, 920, 'กริยาช่องที่สอง (V2)', { col: 'pink', size: 40 });
  const eLabA = chip(sE, 392, 'PAST SIMPLE — STATEMENT', { col: 'pink', size: 38 });
  const eLabC = chip(sE, 392, 'PAST SIMPLE — QUESTION', { col: 'blue', size: 38 });
  const eSentBox = h(`<div class="abs c" style="left:150px;top:500px;width:780px;height:520px;border-radius:46px;background:linear-gradient(180deg,#fff,#F8FBFF);box-shadow:0 20px 44px rgba(20,43,83,.14),0 0 0 6px #fff,0 0 0 12px rgba(247,168,196,.6)"></div>`); sE.appendChild(eSentBox);
  const eT = DidVerbTransformation(sE, { left: 120, top: 540, width: 840, font: 100, maxW: 520, rows3: true, lineH: 1.55 });
  const eUl1 = h(`<div class="ul"></div>`), eUl2 = h(`<div class="ul"></div>`); eT.box.appendChild(eUl1); eT.box.appendChild(eUl2);
  const eOk = chip(sE, 1060, 'บอกเล่าอดีต ใช้ went (V2) ได้ ✓', { col: 'ok', size: 38 });
  const eRule = chip(sE, 1060, '<span class="wd d" style="font-size:44px">DID</span> + <span class="wd g" style="font-size:44px">GO</span>', { col: 'white', size: 44 });
  const eBad = sentence(sE, 1160, ['Did he <span class="wd x">went</span>', 'to work yesterday?'], { st: 'bad', size: 40, tag: 'ผิด · ไม่ใช่' });
  const eM1 = big(sE, 470, `<span style="color:${COL.PINK}">DID</span> มา`, { size: 120 });
  const eM2 = big(sE, 630, `กริยากลับ <span style="color:${COL.BLUE}">V1</span>`, { size: 92 });
  const eM3 = chip(sE, 790, 'Did มา กริยากลับรูปเดิม!', { col: 'pink', size: 46 });
  const eM4 = formula(sE, 930, [['DID', 'pink'], ['GO', 'blue']], { size: 70 });
  const eStars = [...Array(10)].map((_, i) => { const e = h(`<div class="abs" style="left:0;top:0">${ICON.star(i % 2 ? COL.PINK : COL.SKY)}</div>`); sE.appendChild(e); return e; });
  const TR0 = XB.did + .05, TR1 = XB.q - .05;     // transformation spans "แต่ถ้ามี Did แล้ว" → start of the question
  sfx('page', T.expl + XB.yday, .6); sfx('pop', T.expl + XB.v2 + .3, .7); sfx('whoosh', T.expl + XB.stmt - .25, .5); sfx('pop', T.expl + XB.stmt, .6); sfx('success', T.expl + XB.ok + .2, .4);
  sfx('whoosh', T.expl + TR0, .7); sfx('stamp', T.expl + TR0 + (TR1 - TR0) * .26, .8); sfx('cloth', T.expl + TR0 + (TR1 - TR0) * .3, .6);
  sfx('rewind', T.expl + TR0 + (TR1 - TR0) * .44, .6); sfx('sparkle', T.expl + TR0 + (TR1 - TR0) * .7, .8); sfx('pop', T.expl + TR0 + (TR1 - TR0) * .76, .7); sfx('ding', T.expl + XB.q + .1, .5);
  sfx('click', T.expl + XB.ul, .6); sfx('drop', T.expl + XB.wrong + .2, .45); sfx('whoosh', T.expl + XB.memo - .2, .5); sfx('pop', T.expl + XB.memo, .7); sfx('pop', T.expl + XB.memo + .5, .7); sfx('sparkle', T.expl + XB.memo2, .8);
  function drawExpl(t) {
    const u = t - T.expl;
    poseTalk(ePres, u, { gestures: [XB.stmt, XB.did, XB.ul, XB.memo2], expr: u > XB.wrong && u < XB.memo ? 'worried' : u > XB.memo ? 'happy' : 'smile', cheer: u > XB.memo2 + .3 && u < XB.memo2 + 2.2 });
    L(eYd, u, XB.yday, XB.stmt - .25, { from: .4, dy: 50 });
    L(eArr, u, XB.v2, XB.stmt - .25, { from: .3, dy: -20 });
    const ew = life(u, XB.v2 + .25, XB.stmt - .25, { from: .3, dy: 40, el: true }); tf(eWent, { ...ew, r: 2.5 * Math.sin(u * 6) });
    L(eWentLab, u, XB.v2 + .7, XB.stmt - .25, { from: .5, dy: 20 });
    const outA = XB.memo - .2;
    const lc = P(u, TR1 - .3, .3);
    const la = life(u, XB.stmt - .1, outA, { from: .6, dy: 30 }); tf(eLabA, { ...la, o: la.o * (1 - lc) });
    const lb = life(u, TR1 - .3, outA, { from: .6, dy: 30 }); tf(eLabC, lb);
    L(eSentBox, u, XB.stmt - .15, outA, { from: .9, dy: 30 });
    const tb = life(u, XB.stmt - .05, outA, { from: .7, dy: 30 }); tf(eT.box, tb);
    const p = P(u, TR0, TR1 - TR0);
    eT.draw(p, { hl: u > XB.ul ? .6 + .4 * Math.sin((u - XB.ul) * 5) : 0 });
    // underline Did … go
    const Lo = eT.layout();
    [[eUl1, 'did'], [eUl2, 'v']].forEach(([el, id], i) => { const c = Lo.C[id]; const q = E.out(P(u, XB.ul + i * .25, .4)); el.style.left = c.x + 'px'; el.style.top = (c.y + Lo.H + (id === 'v' ? 40 : 6)) + 'px'; el.style.width = c.w + 'px'; el.style.transform = `scaleX(${q})`; el.style.opacity = q > 0 ? 1 : 0; });
    L(eOk, u, XB.ok, TR0, { from: .5, dy: 30 });
    L(eRule, u, XB.ul + .2, outA, { from: .5, dy: 30 });
    const eb = life(u, XB.wrong, XB.memo - .3, { from: .7, dy: 30 }); tf(eBad, { ...eb, x: Math.sin(u * 40) * 6 * Math.exp(-Math.max(0, u - XB.wrong - .4) * 5) * (u > XB.wrong + .4 ? 1 : 0) });
    L(eM1, u, XB.memo, 1e9, { from: .3, dy: 40, el: true }); L(eM2, u, XB.memo + .5, 1e9, { from: .4, dy: 40 });
    const m3 = life(u, XB.memo2, 1e9, { from: .3, dy: 30, el: true }); tf(eM3, { ...m3, s: m3.s * (1 + .04 * Math.sin(u * 6)), r: -2 });
    L(eM4, u, XB.memo2 + .6, 1e9, { from: .5, dy: 30 }); eM4.parts.forEach((pp, i) => tf(pp, { s: 1 + .06 * Math.sin(u * 5 + i) }));
    eStars.forEach((s, i) => { const a = i / 10 * Math.PI * 2 + u * .6, d = P(u, XB.memo2, 1.2); tf(s, { x: 520 + Math.cos(a) * (200 + 230 * E.out(d)), y: 760 + Math.sin(a) * (120 + 260 * E.out(d)), s: .8 + .3 * Math.sin(u * 4 + i), o: d > 0 ? .9 * (1 - P(u, XB.memo2 + 2.4, .6)) : 0, r: u * 90 }); });
  }

  // ============================================================ SCENE 5/6/7a — QUIZ, COUNTDOWN, REVEAL
  const sQ = $('sQuiz'), QB = B.quiz, AB = B.ans;
  const qPres = presenter(sQ);
  const Q = window.QUIZ.build(sQ);
  const qWhich = chip(sQ, 1220, 'ข้อไหนถูก?', { col: 'white', size: 44 });
  const qThink = chip(sQ, 1220, `${ICON.timer(48, '#fff')} ให้เวลาคิด 5 วินาที!`, { col: 'pink', size: 44 });
  const qAns = chip(sQ, 1230, `${ICON.check('#fff', 44)} เฉลย ข้อ ก. go`, { col: 'ok', size: 52 });
  const qFly = h(`<div class="fly" style="font-size:54px;background:linear-gradient(180deg,#5C8DFF,#2F6BFF)">go</div>`); sQ.appendChild(qFly);
  const qConf = NSP.buildConfetti(sQ, 60, 380, 980);
  sfx('whoosh', T.quiz + QB.hdr, .5); sfx('pop', T.quiz + QB.q, .7); sfx('pop', T.quiz + QB.th, .5);
  QB.opts.forEach(o => { sfx('pop', T.quiz + o - .05, .7); sfx('click', T.quiz + o + .05, .4); });
  sfx('pop', T.quiz + QB.which, .5); sfx('riser', T.quiz + QB.think + .2, .4);
  for (let k = 0; k < 5; k++) sfx(k === 4 ? 'tick2' : 'tick', (CD_F0 + k * 30) / FPS, 1);
  sfx('success', T.ans + .02, .9); sfx('sparkle', T.ans + .2, .8); sfx('pop', T.ans + AB.choice, .6); sfx('whoosh', T.ans + AB.full - .1, .6); sfx('pop', T.ans + AB.full + .55, .8); sfx('ding', T.ans + AB.full + .6, .5);
  mark('cd_start', T.cd); mark('ans_start', T.ans);
  let qPos = null;
  function drawQuiz(t) {
    const u = t - T.quiz, f = Math.round(t * FPS), k = f - CD_F0, ua = f >= CD_F0 + 150 ? Math.max(0, t - T.ans) : -1;
    const inCd = k >= 0 && k < 150;
    poseTalk(qPres, u, { think: inCd, cheer: ua > .2 && ua < 3.2, expr: inCd ? 'curious' : ua >= 0 ? 'happy' : 'smile', gestures: [QB.q, QB.opts[0], QB.which] });
    window.QUIZ.draw(Q, u, k, ua, QB);
    L(qWhich, u, QB.which, QB.think - .1, { from: .5, dy: 20 });
    const th = life(u, QB.think, (CD_F0 - .5) / FPS - T.quiz + .4, { from: .5, dy: 20 }); tf(qThink, th);
    // answer reveal (only after the 150-frame countdown)
    const an = ua >= 0 ? life(ua, AB.choice, 1e9, { from: .4, dy: 30, el: true }) : { o: 0 };
    tf(qAns, an);
    if (!qPos) { const bk = Q.blank; qPos = { bx: 150 + bk.offsetLeft + bk.offsetWidth / 2, by: 560 + bk.offsetTop + bk.offsetHeight / 2, ox: 220 + 22 + 76 + 20 + 40, oy: 912 + 59 }; }
    const fq = ua >= 0 ? P(ua, AB.full - .05, .6) : 0, fe = E.inOut(fq);
    tf(qFly, { x: lerp(qPos.ox, qPos.bx, fe) - 45, y: lerp(qPos.oy, qPos.by, fe) - 35 - Math.sin(fe * Math.PI) * 140, s: 1 + .3 * Math.sin(fe * Math.PI), o: fq > 0 && fq < 1 ? 1 : 0 });
    Q.fill.style.opacity = ua >= 0 && fq >= 1 ? 1 : 0;
    Q.fill.style.transform = `scale(${fq >= 1 ? 1 + .25 * Math.exp(-(ua - AB.full - .55) * 5) : 1})`;
    Q.blank.querySelector('.bl').style.opacity = fq >= 1 ? 0 : 1;
    Q.card.style.boxShadow = fq >= 1 ? `0 20px 44px rgba(20,43,83,.16),0 0 0 6px #fff,0 0 0 13px rgba(34,197,94,.7),0 0 ${30 + 10 * Math.sin(ua * 4)}px 16px rgba(255,210,63,.45)` : '';
    NSP.drawConfetti(qConf, t, T.ans + .15, 2.4);
  }

  // ============================================================ SCENE 7b — WHY GO, statement comparison, final rule
  const sA = $('sAns');
  const aPres = presenter(sA);
  const aHdr = chip(sA, 372, 'ทำไมต้อง GO?', { col: 'navy', size: 44 });
  const aDid = formula(sA, 490, [['DID', 'pink']], { size: 64 }); aDid.firstChild.insertAdjacentHTML('beforeend', `<span class="big" data-ess="1" style="font-size:64px">= PAST</span>`);
  const aMain = h(`<div class="row c" style="top:630px"><div style="display:flex;align-items:center;gap:16px"><span class="chip white" data-ess="1" style="font-size:44px">MAIN VERB</span><span class="big" data-ess="1" style="font-size:60px">=</span><span class="chip blue" data-ess="1" style="font-size:54px">V1</span></div></div>`); sA.appendChild(aMain);
  const aOk = sentence(sA, 800, ['<span class="wd d">DID</span> + <span class="wd g">GO</span>'], { st: 'ok', size: 64 });
  const aBad = sentence(sA, 980, ['<span class="wd d">DID</span> + <span class="wd w">WENT</span>'], { st: 'bad', size: 64 });
  const aStmt = sentence(sA, 372, ['The police officer', '<span class="wd w">went</span> to work yesterday.'], { size: 48, cls: 'blue' });
  const aStLab = chip(sA, 562, 'PAST SIMPLE STATEMENT', { col: 'pink', size: 36 });
  const aStOk = chip(sA, 660, 'ประโยคบอกเล่าอดีต ใช้ went ✓', { col: 'ok', size: 36 });
  const aBig = big(sA, 400, `<span style="color:${COL.PINK}">DID</span> + <span style="color:${COL.BLUE}">V1</span>`, { size: 128 });
  const aGo = sentence(sA, 590, ['Did <span class="wd g">go</span>'], { st: 'ok', size: 62 });
  const aWent = sentence(sA, 740, ['Did <span class="wd w">went</span>'], { st: 'bad', size: 62 });
  const aFinal = chip(sA, 905, `${ICON.check('#fff', 46)} ข้อ ก. GO`, { col: 'ok', size: 56 });
  const aRBox = h(`<div class="abs c" style="left:170px;top:1060px;width:740px;height:320px;border-radius:40px;background:rgba(255,255,255,.85);box-shadow:0 14px 30px rgba(20,43,83,.12),0 0 0 6px #fff"></div>`); sA.appendChild(aRBox);
  const aT = DidVerbTransformation(sA, { left: 120, top: 1110, width: 840, font: 64, maxW: 520, pastMarker: false });
  const AP = { b: AB.why, phC: AB.stmt - .1, phD: AB.rule - .12 };
  sfx('pop', T.ans + AB.why, .7); sfx('pop', T.ans + AB.v1, .7); sfx('pop', T.ans + AB.base + .6, .7); sfx('success', T.ans + AB.base + 1.0, .4); sfx('drop', T.ans + AB.notwent, .45);
  for (let k = 0; k < 12; k++) sfx('step', T.ans + AP.phC + .4 + k * .45, .7);
  sfx('pop', T.ans + AB.stmt, .6); sfx('pop', T.ans + AB.stmt2 + .3, .5); sfx('success', T.ans + AB.stmt3, .35);
  sfx('whoosh', T.ans + AP.phD - .1, .5); sfx('ding', T.ans + AB.rule + .2, .5); sfx('success', T.ans + AB.ok + .3, .5); sfx('drop', T.ans + AB.bad + .3, .45); sfx('sparkle', T.ans + AB.fin, .8); sfx('whoosh', T.ans + AB.fin + .3, .4); sfx('rewind', T.ans + AB.fin + .6, .4);
  function drawAns(t) {
    const u = t - T.ans;
    const inC = u >= AP.phC && u < AP.phD;
    if (inC) {
      putWorld($('slotAns')); W.root.querySelector('.beacon').style.visibility = 'visible';
      const wp = P(u, AP.phC, AP.phD - AP.phC), ox = lerp(2750, 3700, wp);
      W.camera(clamp(ox + 60, 0, 3700), 760, 1.0, u, .25);
      $('aVeil').style.opacity = .55;
      officer.pose({ t: u, walk: wp * 22, walkAmt: wp < .97 ? 1 : 0, expr: 'smile', blink: blink(u, .2), turn: .6 });
      officer.place(ox, 1440, 1.0, 1);
      $('slotAns').style.display = '';
    } else { $('slotAns').style.display = 'none'; $('aVeil').style.opacity = 0; }
    aPres.style.display = inC ? 'none' : '';
    poseTalk(aPres, u, { gestures: [AB.why, AB.base, AB.rule, AB.fin], expr: u > AB.bad && u < AB.fin ? 'neutral' : 'happy', cheer: u > AB.fin + .2 && u < AB.fin + 2.0 });
    L(aHdr, u, AP.b, AP.phC, { from: .5, dy: 30 });
    L(aDid, u, AB.why + .05, AP.phC, { from: .5, dy: 40 });
    L(aMain, u, AB.v1, AP.phC, { from: .5, dy: 40 });
    L(aOk, u, AB.base + .5, AP.phC, { from: .6, dy: 40 });
    const ab = life(u, AB.base + 1.6, AP.phC, { from: .6, dy: 40 }); tf(aBad, { ...ab, x: Math.sin(u * 40) * 7 * Math.exp(-Math.max(0, u - AB.notwent) * 5) * (u > AB.notwent ? 1 : 0) });
    L(aStmt, u, AB.stmt, AP.phD, { from: .6, dy: 40 }); L(aStLab, u, AB.stmt2, AP.phD, { from: .5, dy: 20 }); L(aStOk, u, AB.stmt3, AP.phD, { from: .5, dy: 20 });
    const bg = life(u, AB.rule, 1e9, { from: .3, dy: 30, el: true }); tf(aBig, { ...bg, s: bg.s * (1 + .03 * Math.sin(u * 4)) });
    L(aGo, u, AB.ok, 1e9, { from: .5, dy: 40 }); L(aWent, u, AB.bad, 1e9, { from: .5, dy: 40 });
    const fi = life(u, AB.fin, 1e9, { from: .3, dy: 30, el: true }); tf(aFinal, { ...fi, s: fi.s * (1 + .04 * Math.sin(u * 5)) });
    L(aRBox, u, AB.fin + .25, 1e9, { from: .8, dy: 30 }); tf(aT.box, life(u, AB.fin + .3, 1e9, { from: .8, dy: 30 }));
    aT.draw(P(u, AB.fin + .7, 1.3), { hl: u > AB.fin + 2.0 ? .5 + .4 * Math.sin(u * 5) : 0, showLabels: 0 });
  }

  // ============================================================ SCENE 8 — PROMOTION
  const sP = $('sPromo'), PB = B.promo;
  const pPres = presenter(sP);
  const pQ = h(`<div class="row c" style="top:400px"><div class="sc" style="font-size:54px;padding:30px 50px;flex-direction:row;gap:22px"><div style="width:96px;height:96px;border-radius:50%;background:linear-gradient(160deg,${COL.PINK},${COL.BLUE});display:grid;place-items:center">${ICONS.comment(64)}</div><div data-ess="1" style="white-space:nowrap">คุณตอบถูก<br>ข้อ ก. ไหม?</div></div></div>`); sP.appendChild(pQ);
  const CM = [['ข้อ ก. go!', 250, 1120], ['Did go ✓', 600, 1180], ['ก. ครับ!', 300, 1260], ['ถูกแล้ว!', 640, 1300]];
  const pCm = CM.map(([tx, x, y]) => { const e = h(`<div class="cmt c" data-ess="1">${ICONS.comment(36, COL.PINK)}${tx}</div>`); e.style.left = x + 'px'; e.style.top = y + 'px'; sP.appendChild(e); return e; });
  const pErr = sentence(sP, 690, ['Did <span class="wd w">went</span>'], { st: 'bad', size: 70 });
  const pFix = sentence(sP, 690, ['Did <span class="wd g">go</span>'], { st: 'ok', size: 70 });
  const pLogo = h(`<div class="abs c" style="left:340px;top:360px;width:400px"><img src="../../shared/brand/logo.png" style="width:400px;height:auto;display:block;filter:drop-shadow(0 14px 22px rgba(20,43,83,.25))"></div>`); sP.appendChild(pLogo);
  const pWord = h(`<div class="row c" style="top:800px"><div class="wordmark" data-ess="1" style="font-size:96px;background:linear-gradient(90deg,#EE7FAA 0%,#EE7FAA 48%,#2F6BFF 52%,#2F6BFF 100%);-webkit-background-clip:text;background-clip:text">NaiSibPro</div></div>`); sP.appendChild(pWord);
  const pWordTh = chip(sP, 930, 'นายสิบโปร', { col: 'navy', size: 40 });
  const pBank = h(`<div class="row c" style="top:1030px"><div class="sc" style="font-size:44px;padding:20px 40px"><div data-ess="1" style="white-space:nowrap">ข้อสอบมากกว่า<span style="color:${COL.PINK}">หมื่นข้อ</span></div><div data-ess="1" class="pnum" style="font-size:64px;color:${COL.BLUE}">10,000+</div></div></div>`); sP.appendChild(pBank);
  const pWeek = chip(sP, 1270, `${ICON.cal(46, '#fff')} อัปเดตทุกสัปดาห์`, { col: 'blue', size: 44 });
  const CTA = [['like', 'LIKE', COL.PINK, 250], ['share', 'SHARE', COL.BLUE, 445], ['follow', 'FOLLOW', COL.PINK, 640]];
  const pCta = CTA.map(([ic, tx, c, x]) => { const e = h(`<div class="cta c" style="left:${x}px"><div class="ci" style="background:linear-gradient(160deg,${c},${c === COL.PINK ? COL.ROSE : '#5C8DFF'})">${ICONS[ic](86)}</div><div data-ess="1">${tx}</div></div>`); sP.appendChild(e); return e; });
  const pDots = h(`<div class="row c" style="top:1430px"><div class="chip white" style="font-size:30px;padding:8px 26px">LIKE · SHARE · FOLLOW</div></div>`); sP.appendChild(pDots);
  const pEnd1 = chip(sP, 1110, 'ติววันละนิด พิชิตข้อสอบตำรวจ!', { col: 'pink', size: 42 });
  const pEnd2 = chip(sP, 1220, '<span class="wd d">DID</span> + <span class="wd g">V1</span> · ข้อ ก. GO', { col: 'white', size: 42 });
  const pHand = h(`<div class="abs" style="left:0;top:0;width:100px;height:100px">${ICON.hand(100)}</div>`); sP.appendChild(pHand);
  const pConf = NSP.buildConfetti(sP, 70, 540, 700);
  sfx('pop', T.promo + PB.comment, .7); CM.forEach((_, i) => sfx('msg', T.promo + PB.comment + .9 + i * .45, .8));
  sfx('pop', T.promo + PB.err, .6); sfx('drop', T.promo + PB.err + .4, .4); sfx('rewind', T.promo + PB.fix + .2, .5); sfx('success', T.promo + PB.fix + .9, .5);
  sfx('whoosh', T.promo + PB.brand - .2, .6); sfx('riser', T.promo + PB.brand - .5, .4); sfx('sparkle', T.promo + PB.brand + .4, .9);
  sfx('pop', T.promo + PB.bank, .7); for (let i = 0; i < 6; i++) sfx('coin', T.promo + PB.bank + .3 + i * .15, .4); sfx('page', T.promo + PB.weekly, .6); sfx('pop', T.promo + PB.weekly + .1, .6);
  ['like', 'share', 'follow'].forEach(k => { sfx('pop', T.promo + PB[k], .8); sfx('click', T.promo + PB[k] + .45, .8); });
  sfx('ding', T.promo + PB.end, .6); sfx('sparkle', T.promo + PB.end + .2, .8);
  mark('endcard', T.promo + PB.end);
  function drawPromo(t) {
    const u = t - T.promo;
    poseTalk(pPres, u, { gestures: [PB.err, PB.bank], expr: 'happy', cheer: (u > PB.brand && u < PB.brand + 1.6) || u > PB.end });
    L(pQ, u, PB.comment, PB.brand - .2, { from: .5, dy: 40, el: true });
    pCm.forEach((c, i) => { const l = life(u, PB.comment + .9 + i * .45, PB.err - .1, { from: .4, dy: 40 }); tf(c, { ...l, y: l.y - 30 * (u - PB.comment - .9 - i * .45) * (u > PB.comment + .9 + i * .45 ? 1 : 0) }); });
    const fl = E.inOut(P(u, PB.fix + .2, .6));
    const pe = life(u, PB.err, PB.brand - .2, { from: .5, dy: 40 }); tf(pErr, { ...pe, o: pe.o * (fl < .5 ? 1 : 0), ry: fl * 180 });
    const pf = life(u, PB.err, PB.brand - .2, { from: .5, dy: 40 }); tf(pFix, { ...pf, o: pf.o * (fl >= .5 ? 1 : 0), ry: fl * 180 - 180 });
    const lg = life(u, PB.brand, 1e9, { from: .2, dy: 200, el: true, d: .9 }); const lu = E.inOut(P(u, PB.like - .3, .6));
    tf(pLogo, { ...lg, y: lg.y + bob(u, 0, 6) - lu * 40, s: lg.s * lerp(1, .78, lu) });
    L(pWord, u, PB.brand + .5, PB.like - .3, { from: .5, dy: 40 }); L(pWordTh, u, PB.brand + .9, PB.like - .3, { from: .5, dy: 30 });
    const bk = life(u, PB.bank, PB.like - .3, { from: .5, dy: 40 }); tf(pBank, { ...bk, y: bk.y - 70 * E.inOut(P(u, PB.weekly - .2, .4)) });
    pBank.querySelector('.pnum').textContent = (Math.round(10000 * E.out(P(u, PB.bank + .2, 1.2)) / 100) * 100).toLocaleString('en-US') + '+';
    tf(pWeek, { ...life(u, PB.weekly, PB.like - .3, { from: .5, dy: 30 }), y: life(u, PB.weekly, PB.like - .3, { from: .5, dy: 30 }).y - 70 });
    ['like', 'share', 'follow'].forEach((k, i) => { const l = life(u, PB[k], 1e9, { from: .2, dy: 60, el: true }); const press = Math.max(0, 1 - Math.abs(u - PB[k] - .45) / .15); const lift = -lu * 380; tf(pCta[i], { ...l, y: l.y + lift, s: l.s * (1 - .12 * press) * (1 + .04 * Math.sin(u * 4 + i)) }); });
    L(pDots, u, PB.follow + .6, 1e9, { from: .5, dy: 20 }); pDots.style.transform += ` translateY(${-lu * 380}px)`;
    // tapping hand visits LIKE → SHARE → FOLLOW
    let hx = 0, hy = 0, ho = 0;
    ['like', 'share', 'follow'].forEach((k, i) => { if (u > PB[k] + .1 && u < PB[k] + 1.1) { hx = 250 + i * 195 + 90; hy = 1180 - lu * 380 + 120; ho = clamp((u - PB[k] - .1) / .15) * (1 - P(u, PB[k] + .9, .2)); } });
    tf(pHand, { x: hx, y: hy + 10 * Math.sin(u * 12), o: ho });
    L(pEnd1, u, PB.end, 1e9, { from: .4, dy: 40, el: true }); L(pEnd2, u, PB.end + .35, 1e9, { from: .5, dy: 30 });
    NSP.drawConfetti(pConf, t, T.promo + PB.end + .1, 2.4);
  }

  // ============================================================ assemble
  const S = [
    { el: sH, a: T.hook, b: T.story, draw: drawHook },
    { el: sS, a: T.story, b: T.know, draw: drawStory },
    { el: sK, a: T.know, b: T.expl, draw: drawKnow },
    { el: sE, a: T.expl, b: T.quiz, draw: drawExpl },
    { el: sQ, a: T.quiz, b: A2, draw: drawQuiz },
    { el: sA, a: A2, b: T.end + 1, draw: drawAns },
    { el: sP, a: T.promo, b: T.end + 1, draw: drawPromo },
  ];
  S[5].b = T.promo;
  NSP.start({ scenes: S, wipes: [T.story, T.know, T.expl, T.quiz, A2, T.promo], brand: { showAt: 1.2 }, ep: 'EP.52' });
  window.EP52_T = T;
})();
