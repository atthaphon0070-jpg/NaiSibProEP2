// SCENE 3 — KNOWLEDGE (03_knowledge.mp3): what a topology is, then STAR → BUS → RING → MESH on ONE network whose
// five computers keep their identities while the links are withdrawn and rebuilt; each with a failure demo; 2 × 2 review.
{
  const K0 = S('know'), b = k => BT('know', k);
  const el = mkScene('s3');
  const gScat = TOPO.graph('intro', [[300, 640], [760, 700], [690, 1120], [380, 1180], [540, 880]].map(([x, y], i) => ({ id: 'PC' + (i + 1), x, y })), []);
  const gStar = TOPO.DEF.star({ r: 235 }), gBus = TOPO.DEF.bus({ w: 600, drop: 170 }), gRing = TOPO.DEF.ring({ r: 245 }), gMesh = TOPO.DEF.mesh({ r: 245 });
  const net = TOPO.view(el);
  const hT = header(el, '', '<span style="color:#fff">NETWORK</span> TOPOLOGY', 'รูปแบบการเชื่อมต่อเครือข่าย', 'intro'); hT.nm.style.fontSize = '50px';
  const cDef = cap(el, 1254, ['รูปแบบการ<span class="yl">จัดวาง</span>', 'และ<span class="cy">เชื่อมต่อ</span>อุปกรณ์ในเครือข่าย'], '', 40);
  const four = add(el, `<div class="abs" style="left:0;top:0;width:1080px;height:1920px">${[['star', 'STAR', 'แบบดาว'], ['bus', 'BUS', 'แบบบัส'], ['ring', 'RING', 'แบบวงแหวน'], ['mesh', 'MESH', 'แบบตาข่าย']].map(([k, n, th], i) =>
    `<div class="mcard f4 crit" data-topo="${k}" style="left:${i % 2 ? 548 : 242}px;top:${590 + Math.floor(i / 2) * 330}px;width:290px;height:300px"><div style="position:absolute;left:0;right:0;top:34px;display:flex;justify-content:center">${glyph(k, '#22D3EE', 120)}</div><div class="ms" style="bottom:20px;font-size:34px;color:#F8CFE2">${th}</div><div class="mt" style="top:178px;bottom:auto;font-size:46px">${i + 1}. ${n}</div></div>`).join('')}</div>`);
  const f4 = [...four.querySelectorAll('.f4')];
  const c4 = cap(el, 1290, ['<span class="yl">4 รูปแบบพื้นฐาน</span> ที่ควรจำ'], 'yl');
  const H = {
    star: header(el, 1, 'STAR TOPOLOGY', 'แบบดาว', 'star'), bus: header(el, 2, 'BUS TOPOLOGY', 'แบบบัส', 'bus'),
    ring: header(el, 3, 'RING TOPOLOGY', 'แบบวงแหวน', 'ring'), mesh: header(el, 4, 'MESH TOPOLOGY', 'แบบตาข่าย', 'mesh'),
  };
  const C = {
    sAll: cap(el, 1270, ['ทุกเครื่องต่อเข้า<span class="yl">ศูนย์กลาง</span>'], ''),
    sCable: cap(el, 1254, ['สายของ<span class="rd">เครื่องหนึ่ง</span>เสีย', '<span class="gr">เครื่องอื่นยังใช้งานได้</span>'], ''),
    sHub: cap(el, 1254, ['<span class="rd">ศูนย์กลางเสีย</span>', 'กระทบ<span class="rd">ทุกเครื่อง</span>ที่พึ่งพา'], 'red'),
    bShare: cap(el, 1254, ['ทุกเครื่องใช้<span class="yl">สายหลัก</span>', '<span class="yl">(Backbone)</span> ร่วมกัน'], 'yl'),
    bRisk: cap(el, 1254, ['<span class="rd">สายหลักมีปัญหา</span>', '<span class="yl">อาจกระทบทั้งเครือข่าย</span>'], 'red'),
    rLoop: cap(el, 1270, ['เชื่อมต่อเรียงกัน<span class="cy">เป็นวง</span>'], ''),
    rTwo: cap(el, 1254, ['แต่ละเครื่องต่อกับ', '<span class="yl">เพื่อนบ้าน 2 เครื่อง</span>'], 'yl'),
    rBreak: cap(el, 1254, ['วงแหวนพื้นฐาน<span class="rd">ขาด</span>', '+ <span class="yl">ไม่มีเส้นทางสำรอง</span>'], 'red'),
    rStop: cap(el, 1270, ['<span class="rd">การสื่อสารอาจหยุดชะงัก</span>'], 'red'),
    mPaths: cap(el, 1270, ['ถึงกันได้<span class="cy">หลายเส้นทาง</span>'], ''),
    mBreak: cap(el, 1254, ['<span class="rd">เส้นทางหนึ่งเสีย</span>', '<span class="gr">→ ใช้เส้นทางอื่นแทน</span>'], 'grn'),
  };
  const M = { star: memo(el, 1286, 'STAR <span class="eq">=</span> มีศูนย์กลาง', 'star'), bus: memo(el, 1286, 'BUS <span class="eq">=</span> สายหลักร่วมกัน', 'bus'),
    ring: memo(el, 1286, 'RING <span class="eq">=</span> เชื่อมเป็นวง', 'ring'), mesh: memo(el, 1286, 'MESH <span class="eq">=</span> หลายเส้นทาง', 'mesh') };
  const ringTag = add(el, `<div class="ctr" style="top:540px"><div class="tag crit">ตัวอย่าง: วงแหวนพื้นฐาน (วงเดียว)</div></div>`);
  const meshTag = add(el, `<div class="ctr" style="top:540px"><div class="tag crit" style="font-size:28px">ตัวอย่าง: Full Mesh · ทุกคู่ต่อตรง 10 สาย</div></div>`);
  const nbTag = add(el, `<div class="abs" style="left:0;top:0">${['PC5', 'PC2'].map(() => `<div class="tag yl crit nb" style="position:absolute;white-space:nowrap">เพื่อนบ้าน</div>`).join('')}</div>`);
  const nb = [...nbTag.querySelectorAll('.nb')];
  // review grid: four mini views
  const grid = add(el, `<div class="abs" style="left:0;top:0;width:1080px;height:1920px"></div>`);
  const minis = [['star', gStar, 'STAR', 'แบบดาว'], ['bus', gBus, 'BUS', 'แบบบัส'], ['ring', gRing, 'RING', 'แบบวงแหวน'], ['mesh', gMesh, 'MESH', 'แบบตาข่าย']].map(([k, g, n, th], i) => {
    const c = add(grid, `<div class="mcard crit" data-topo="${k}" style="left:${i % 2 ? 548 : 242}px;top:${560 + Math.floor(i / 2) * 340}px;width:290px;height:320px"><div class="ms" style="bottom:16px;font-size:32px;color:#F8CFE2">${th}</div><div class="mt" style="bottom:56px;font-size:44px">${n}</div></div>`);
    const v = TOPO.view(c); c.insertBefore(v.svg, c.firstChild);
    return { k, g, c, v };
  });
  const cRev = cap(el, 1290, ['จำ<span class="yl">รูปร่าง</span>ให้แม่น!'], 'yl');
  // ---- timing
  const MB = [b('b2') + .05, 2.3], MR = [b('r3') + .05, 2.0], MM = [b('m4') + .1, 1.8];
  const CUT = b('sCable') + .5, HUB = b('sHub') + .35, BB = b('bFault') + .4, RB = b('rBreak') + .45, MX = b('mBreak') + .35;
  // ---- SFX
  sfx('build', K0 + b('def') + 1.6, .6); f4.forEach((_, i) => sfx('pop', K0 + b('four') + .3 + i * .22, .5));
  sfx('build', K0 + b('s1') + .3, .7); sfx('packet', K0 + b('sAll') + .3, .7); sfx('unplug', K0 + CUT - .2, .9); sfx('success', K0 + b('sOthers') + .3, .5);
  sfx('plug', K0 + b('sHub') - .25, .5); sfx('warn', K0 + HUB - .45, .7); sfx('fault', K0 + HUB, .9); [0, 1, 2, 3, 4].forEach(i => sfx('down', K0 + b('sAllHit') + .1 + i * .2, .4));
  sfx('sparkle', K0 + b('sAllHit') + 1.2, .5);
  sfx('swoosh', K0 + MB[0], .5); sfx('build', K0 + MB[0] + 1.2, .7); sfx('packet', K0 + b('bShare') + .3, .6); sfx('unplug', K0 + BB - .2, .9); sfx('warn', K0 + b('bRisk') + .1, .7); sfx('sparkle', K0 + b('bRisk') + .9, .5);
  sfx('swoosh', K0 + MR[0], .5); [0, 1, 2, 3, 4].forEach(i => sfx('plug', K0 + b('rLoop') + .1 + i * .35, .45)); sfx('success', K0 + b('rLoop') + 1.9, .5);
  sfx('unplug', K0 + RB - .2, .9); sfx('warn', K0 + b('rStop') + .1, .7); sfx('sparkle', K0 + b('rStop') + .8, .5);
  sfx('swoosh', K0 + MM[0], .5); sfx('build', K0 + MM[0] + 1.0, .7); sfx('packet', K0 + b('mPaths') + .3, .7); sfx('unplug', K0 + MX - .2, .9); sfx('restore', K0 + b('mAlt') + .3, .8); sfx('sparkle', K0 + b('mAlt') + 1.2, .5);
  minis.forEach((_, i) => sfx('pop', K0 + b('review') + .15 + i * .2, .5));
  const resetAlerts = St => eachPC(St, (id, n) => { n.alert = 0; n.warn = 0; n.ok = 0; n.on = 1; });
  function draw(t) {
    const u = t - K0;
    let St, show4 = 0;
    nb.forEach(e => tf(e, { o: 0 }));
    if (u < b('four')) {
      const k = P(u, b('def'), 1.6);
      St = TOPO.morph(gScat, gStar, k, { retract: [0, .01], move: [0, .55], grow: [.55, 1] });
      if (u < b('def')) St = TOPO.state(gScat);
      St.type = 'intro';
      St.o = 1 - P(u, b('four') - .3, .3);
      if (u > b('def') + 1.7) St.packets = TOPO.stream(['PC1', 'SW', 'PC3'], u, b('def') + 1.7, 99, { T: 1.3 });
    } else if (u < b('s1')) {
      St = TOPO.state(gStar); St.o = 0; show4 = 1;
    } else if (u < MB[0]) {
      St = TOPO.state(gStar); St.type = 'star';
      TOPO.drawIn(St, u, b('s1') + .4, .35, .18);
      eachPC(St, (id, n) => { n.ph = +id[2]; });
      setN(St, 'SW', { s: E.back(P(u, b('s1') + .1, .4)), glow: win(u, b('sCenter'), b('sCable')), halo: win(u, b('sCenter'), b('sCable')) ? .6 + .3 * Math.sin(u * 5) : 0 });
      if (win(u, b('sAll'), CUT)) St.packets = [...TOPO.stream(['PC1', 'SW', 'PC4'], u, b('sAll') + .2, CUT - .2, { T: 1.4 }), ...TOPO.stream(['PC2', 'SW', 'PC5'], u, b('sAll') + .7, CUT - .2, { T: 1.5 })];
      if (u < b('sHub') - .3) {
        breakLink(St, 'SW', 'PC2', u, CUT, { brk: .72 });
        if (u > CUT) setN(St, 'PC2', { alert: E.back(P(u, CUT + .2, .3)), on: 0 });
        if (win(u, b('sOthers'), b('sHub') - .3)) {
          St.packets = [...TOPO.stream(['PC1', 'SW', 'PC4'], u, b('sOthers') + .1, b('sHub') - .3, { T: 1.3 }), ...TOPO.stream(['PC5', 'SW', 'PC3'], u, b('sOthers') + .4, b('sHub') - .3, { T: 1.4 })];
          ['PC1', 'PC3', 'PC4', 'PC5'].forEach((id, i) => setN(St, id, { ok: E.back(P(u, b('sOthers') + .2 + i * .12, .3)) }));
        }
      } else {
        if (u < b('sHub')) setL(St, 'SW', 'PC2', { st: 'green' });
        failSwitch(St, 'SW', u, HUB);
        eachPC(St, (id, n) => { const at = b('sAllHit') + .1 + (+id[2] - 1) * .2; if (u > at) { n.alert = E.back(P(u, at, .3)); n.on = 0; } });
        if (u < HUB - .1) St.packets = TOPO.stream(['PC3', 'SW', 'PC1'], u, b('sHub') - .25, HUB - .1, { T: 1.0 });
      }
    } else if (u < MR[0]) {
      const k = P(u, MB[0], MB[1]);
      St = k < 1 ? TOPO.morph(gStar, gBus, k) : TOPO.state(gBus);
      if (k < .3) { setN(St, 'SW', { fail: 1 }); eachPC(St, (id, n) => { n.alert = 1 - clamp(k / .2); n.on = k > .15 ? 1 : 0; }); }
      St.type = k < .5 ? 'star' : 'bus';
      if (win(u, b('bShare'), BB)) {
        St.links.forEach(l => { if (l.kind === 'bb') l.st = 'hot'; });
        St.packets = [...TOPO.stream(['PC1', 'T1', 'T2', 'T3', 'T4', 'T5', 'PC5'], u, b('bShare') + .2, BB - .3, { T: 2.0 }), ...TOPO.stream(['PC4', 'T4', 'T3', 'T2', 'PC2'], u, b('bShare') + 1.0, BB - .3, { T: 1.7 })];
      }
      if (u > BB - .35) {
        breakLink(St, 'T2', 'T3', u, BB);
        if (u > BB + .2) St.packets = TOPO.stream(['PC1', 'T1', 'T2'], u, BB + .2, b('r3'), { T: 1.2, c: 'red' });
        eachPC(St, (id, n) => { n.warn = E.back(P(u, b('bRisk') + .1 + (+id[2] - 1) * .15, .3)); });
      }
    } else if (u < MM[0]) {
      const k = P(u, MR[0], MR[1]);
      St = k < 1 ? TOPO.morph(gBus, gRing, k, { retract: [0, .35], move: [.3, 1], grow: [2, 3] }) : TOPO.state(gRing);
      if (k < .4) { setL(St, 'T2', 'T3', { st: 'bad', gap: 1, brk: .5 }); eachPC(St, (id, n) => { n.warn = 1 - clamp(k / .3); }); }
      St.type = k < .4 ? 'bus' : 'ring';
      const order = gRing.meta.order;
      St.links.forEach(l => { const i = order.findIndex((id, j) => TOPO.lid(id, order[(j + 1) % 5]) === l.id); if (i >= 0) l.p = E.out(P(u, b('rLoop') + .1 + i * .35, .35)); });
      if (u > b('rLoop') + 2.0 && u < RB) St.packets = TOPO.stream([...order, 'PC1'], u, b('rLoop') + 2.0, RB - .2, { T: 3.0, ease: false });
      if (win(u, b('rTwo'), b('rBreak'))) { setN(St, 'PC1', { glow: true, s: pulse(u, b('rTwo'), .4, .12) }); setL(St, 'PC1', 'PC2', { st: 'hot' }); setL(St, 'PC5', 'PC1', { st: 'hot' }); }
      if (u > RB - .35) {
        breakLink(St, 'PC3', 'PC4', u, RB);
        if (u > RB + .2) St.packets = TOPO.stream(['PC1', 'PC2', 'PC3'], u, RB + .2, b('m4'), { T: 1.6, c: 'red' });
        eachPC(St, (id, n) => { n.warn = E.back(P(u, b('rStop') + .1 + (+id[2] - 1) * .15, .3)); });
      }
      // neighbour tags next to PC5 and PC2 (PC1's two neighbours)
      [['PC5', -1], ['PC2', 1]].forEach(([id, sd], i) => { const n = St.nodes[id]; nb[i].style.left = (n.x - (sd > 0 ? 170 : 60)) + 'px'; nb[i].style.top = (n.y - 110) + 'px'; show(nb[i], u, b('rTwo') + .3 + i * .2, b('rBreak') - .1, { from: .3, el: true, d: .6 }); });
    } else if (u < b('review')) {
      const k = P(u, MM[0], MM[1]);
      St = k < 1 ? TOPO.morph(gRing, gMesh, k, { retract: [0, .01], move: [0, .01], grow: [.1, 1] }) : TOPO.state(gMesh);
      if (k < .15) setL(St, 'PC3', 'PC4', { st: 'green' });
      St.type = 'mesh';
      if (win(u, b('mPaths'), MX)) {
        [['PC1', 'PC3'], ['PC1', 'PC2'], ['PC2', 'PC3'], ['PC1', 'PC5'], ['PC5', 'PC4'], ['PC4', 'PC3']].forEach(([a, c]) => setL(St, a, c, { st: 'hot' }));
        St.packets = [...TOPO.stream(['PC1', 'PC3'], u, b('mPaths') + .2, MX - .2, { T: 1.2 }), ...TOPO.stream(['PC1', 'PC2', 'PC3'], u, b('mPaths') + .2, MX - .2, { T: 1.6 }), ...TOPO.stream(['PC1', 'PC5', 'PC4', 'PC3'], u, b('mPaths') + .2, MX - .2, { T: 2.0 })];
        setN(St, 'PC1', { glow: true }); setN(St, 'PC3', { glow: true });
      }
      if (u > MX - .35) {
        breakLink(St, 'PC1', 'PC3', u, MX);
        if (u > b('mAlt')) {
          setL(St, 'PC1', 'PC2', { st: 'green' }); setL(St, 'PC2', 'PC3', { st: 'green' });
          St.packets = TOPO.stream(['PC1', 'PC2', 'PC3'], u, b('mAlt') + .2, 99, { T: 1.4, c: 'green' });
          setN(St, 'PC3', { ok: E.back(P(u, b('mAlt') + 1.2, .3)) });
        }
      }
      St.o = 1;
    } else { St = TOPO.state(gMesh); St.o = 0; }
    net.draw(St, t);
    // ---- headers, captions, memos
    drawHeader(hT, u, b('net'), b('four') - .2, b('topo') + .3);
    show(cDef, u, b('def') + .1, b('four') - .2);
    f4.forEach((e, i) => show(e, u, b('four') + .3 + i * .22, b('s1') - .1, { from: .5, d: .5 }));
    show(c4, u, b('four') + .2, b('s1') - .1);
    drawHeader(H.star, u, b('sName') - .05, MB[0] + .6, b('sTh'));
    drawHeader(H.bus, u, b('bName') - .05, MR[0] + .5, b('bTh'));
    drawHeader(H.ring, u, b('rName') - .05, MM[0] - .3, b('rTh'));
    drawHeader(H.mesh, u, b('mName') - .05, b('review') - .1, b('mTh'));
    show(C.sAll, u, b('sAll') + .1, b('sCable') - .1); show(C.sCable, u, b('sCable') + .1, b('sHub') - .1); show(C.sHub, u, b('sHub') + .1, b('sAllHit') + 1.0);
    show(M.star, u, b('sAllHit') + 1.1, b('b2') - .05, { from: .3, el: true, d: .7 });
    show(C.bShare, u, b('bShare') + .1, b('bFault') - .1); show(C.bRisk, u, b('bFault') + .1, b('bRisk') + .8);
    show(M.bus, u, b('bRisk') + .9, b('r3') - .05, { from: .3, el: true, d: .7 });
    show(C.rLoop, u, b('rLoop') + .1, b('rTwo') - .1); show(C.rTwo, u, b('rTwo') + .1, b('rBreak') - .1); show(C.rBreak, u, b('rBreak') + .1, b('rStop') - .1); show(C.rStop, u, b('rStop') + .1, b('rStop') + .75);
    show(M.ring, u, b('rStop') + .8, b('m4') - .05, { from: .3, el: true, d: .7 });
    show(ringTag, u, b('rBreak') - .1, b('m4') - .1);
    show(meshTag, u, MM[0] + 1.0, b('review') - .1);
    show(C.mPaths, u, b('mPaths') + .1, b('mBreak') - .1); show(C.mBreak, u, b('mBreak') + .1, b('mAlt') + 1.1);
    show(M.mesh, u, b('mAlt') + 1.2, b('review') - .05, { from: .3, el: true, d: .7 });
    minis.forEach((m, i) => {
      const at = b('review') + .15 + i * .2;
      show(m.c, u, at, 1e9, { from: .5, d: .5 });
      if (u < at - .1) { m.c.style.visibility = 'hidden'; return; }
      const Sm = TOPO.state(m.g); Sm.type = m.k; Sm.cam = { x: 540, y: 905, s: .38, tx: 145, ty: 122 };
      eachPC(Sm, (id, n) => { n.lab = false; n.ph = +id[2]; });
      Object.values(Sm.nodes).forEach(n => { if (n.kind === 'switch') n.lab = false; });
      const r = { star: ['PC1', 'SW', 'PC3'], bus: ['PC1', 'T1', 'T2', 'T3', 'T4', 'T5', 'PC5'], ring: ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC1'], mesh: ['PC2', 'PC5'] }[m.k];
      Sm.packets = TOPO.stream(r, u, at + .3, 99, { T: m.k === 'ring' ? 2.6 : 1.5, s: 1.6 });
      m.v.draw(Sm, t);
    });
    show(cRev, u, b('review') + .2, 1e9);
  }
  SC.push({ el, a: K0, b: S('expl'), draw, dark: () => 1 });
}
