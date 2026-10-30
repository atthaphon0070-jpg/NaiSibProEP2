// SCENE 4 — EXPLANATION (04_explanation.mp3), light NaiSibPro pink with a navy diagram panel:
// TREE (grows top-down, flips into a real tree silhouette and back) → HYBRID (two star groups joined by a bus
// backbone, as narrated) → POINT-TO-POINT → six rapid memory beats on one morphing network → exam tips.
{
  const X0 = S('expl'), b = k => BT('expl', k);
  const el = mkScene('s4');
  const panel = add(el, `<div class="panel" style="left:214px;top:556px;width:652px;height:700px"></div>`);
  const gTree = TOPO.DEF.tree({ w: 520, top: 640, dy: 220 });
  const gTreeUp = TOPO.graph('tree', Object.values(gTree.nodes).map(n => ({ ...n, y: 1840 - n.y })), gTree.links.map(l => [l.a, l.b, l.kind]), gTree.meta);
  const gHyb = TOPO.DEF.hybrid(), gP2P = TOPO.DEF.p2p({ d: 420 });
  const G6 = { star: TOPO.DEF.star({ r: 235 }), bus: TOPO.DEF.bus({ w: 600 }), ring: TOPO.DEF.ring({ r: 245 }), mesh: TOPO.DEF.mesh({ r: 245 }), tree: gTree, hybrid: gHyb };
  // real-tree silhouette laid over the upside-down network (trunk at the root, big limbs = root→branch links, twigs = branch→PC)
  const N = gTreeUp.nodes;
  const sil = add(el, `<svg width="1080" height="1920" style="position:absolute;inset:0;overflow:visible">
    <path class="tk" d="M540 1250 L540 ${N.R.y}" stroke="#8B5A2B" stroke-width="46" stroke-linecap="round"/>
    <g class="bg">${['B1', 'B2'].map(k => `<path d="M540 ${N.R.y} L${N[k].x} ${N[k].y}" stroke="#9C6B3A" stroke-width="30" stroke-linecap="round"/>`).join('')}</g>
    <g class="sm">${[['B1', 'PC1'], ['B1', 'PC2'], ['B2', 'PC3'], ['B2', 'PC4']].map(([a, c]) => `<path d="M${N[a].x} ${N[a].y} L${N[c].x} ${N[c].y}" stroke="#B07C45" stroke-width="16" stroke-linecap="round"/>`).join('')}</g>
    <g class="lv">${['PC1', 'PC2', 'PC3', 'PC4'].map(k => `<circle cx="${N[k].x}" cy="${N[k].y - 10}" r="92" fill="#4CC38A" opacity=".55"/>`).join('')}</g></svg>`);
  const net = TOPO.view(el);
  const silTags = add(el, `<div class="abs" style="left:0;top:0">
    <div class="tag yl crit st1" style="position:absolute;left:560px;top:1188px">ลำต้น</div>
    <div class="tag yl crit st2" style="position:absolute;left:262px;top:1052px">กิ่งใหญ่</div>
    <div class="tag yl crit st3" style="position:absolute;left:620px;top:836px">กิ่งเล็ก</div></div>`);
  const st = ['.st1', '.st2', '.st3'].map(s => silTags.querySelector(s));
  // intro: four known + two new
  const known = add(el, `<div class="ctr" style="top:640px;gap:14px">${['star', 'bus', 'ring', 'mesh'].map(k => `<div class="kn crit" style="width:140px;height:140px;border-radius:30px;background:#142B53;box-shadow:0 0 0 4px #fff,0 10px 20px rgba(60,70,130,.3);display:grid;place-items:center;position:relative">${glyph(k, '#22D3EE', 80)}<div style="position:absolute;right:-12px;top:-12px;width:46px;height:46px;border-radius:50%;background:#22C55E;display:grid;place-items:center;box-shadow:0 0 0 4px #fff">${ICON.check('#fff', 30)}</div></div>`).join('')}</div>`);
  const kn = [...known.querySelectorAll('.kn')];
  const two = add(el, `<div class="ctr" style="top:880px;gap:30px">${['?', '?'].map(() => `<div class="tw crit" style="width:200px;height:200px;border-radius:40px;background:linear-gradient(180deg,#FFE6F1,#FBD3E5);box-shadow:0 0 0 5px #fff,0 0 0 10px rgba(238,127,170,.6);display:grid;place-items:center;font-weight:800;font-size:120px;color:#EE7FAA">?</div>`).join('')}</div>`);
  const tw = [...two.querySelectorAll('.tw')];
  const cTwo = cap(el, 1290, ['อีก <span class="pkc">2 แบบ</span> ที่ควรรู้!'], 'pk');
  const H = { tree: header(el, 5, 'TREE TOPOLOGY', 'แบบต้นไม้', 'tree'), hyb: header(el, 6, 'HYBRID TOPOLOGY', 'แบบผสม', 'hybrid'), p2p: header(el, '', 'POINT-TO-POINT', 'แบบจุดต่อจุด', 'p2p'), six: header(el, '', 'จำจุดเด่น <span style="color:#EE7FAA">6 แบบ</span>', 'STAR · BUS · RING · MESH · TREE · HYBRID', 'six') };
  H.hyb.nm.style.fontSize = '50px'; H.six.tt.style.fontSize = '24px';
  const C = {
    level: cap(el, 1286, ['เชื่อมต่อเป็น<span class="bl">ลำดับชั้น</span>'], 'lt'),
    top: cap(el, 1280, ['แตกแขนงจาก<span class="bl">ระดับบน</span>', '<span class="pkc">ลงสู่ระดับล่าง</span>'], 'lt', 42),
    trunk: cap(el, 1286, ['นึกภาพ<span class="pkc">ต้นไม้</span> 🌳'], 'pk'),
    two: cap(el, 1280, ['นำ<span class="pkc">ตั้งแต่ 2 แบบขึ้นไป</span>', 'มาใช้ร่วมกัน'], 'pk', 42),
    stars: cap(el, 1286, ['<span class="bl">ดาวหลายกลุ่ม</span> + โครงสร้างอื่น'], 'lt', 42),
    p2p: cap(el, 1286, ['อุปกรณ์ <span class="pkc">2 จุด</span> เชื่อมกัน<span class="bl">โดยตรง</span>'], 'lt', 38),
    six: cap(el, 1286, ['มาจำ<span class="pkc">จุดเด่น</span>กัน!'], 'pk'),
  };
  const M = { tree: memo(el, 1286, 'TREE <span class="eq">=</span> แตกกิ่งเป็นลำดับชั้น', 'tree'), hyb: memo(el, 1286, 'HYBRID <span class="eq">=</span> หลายแบบผสมกัน', 'hybrid') };
  M.tree.firstChild.style.fontSize = '42px'; M.hyb.firstChild.style.fontSize = '42px';
  const formula = add(el, `<div class="ctr" style="top:760px;gap:18px;align-items:center">
    <div class="fm crit" style="width:170px;height:170px;border-radius:34px;background:#142B53;display:grid;place-items:center;box-shadow:0 0 0 4px #fff">${glyph('star', '#22D3EE', 96)}</div>
    <div class="fm crit" style="font-weight:800;font-size:90px;color:#EE7FAA">+</div>
    <div class="fm crit" style="width:170px;height:170px;border-radius:34px;background:#142B53;display:grid;place-items:center;box-shadow:0 0 0 4px #fff">${glyph('bus', '#22D3EE', 96)}</div></div>`);
  const fm = [...formula.querySelectorAll('.fm')];
  const hyTags = add(el, `<div class="abs" style="left:0;top:0">
    <div class="tag yl crit h1" data-topo="star" style="position:absolute;left:592px;top:620px">STAR กลุ่ม A</div>
    <div class="tag yl crit h2" data-topo="star" style="position:absolute;left:268px;top:1136px">STAR กลุ่ม B</div>
    <div class="tag crit h3" data-topo="bus" style="position:absolute;left:262px;top:924px;color:#0E1D48;background:#FFD23F">BUS</div></div>`);
  const hy = ['.h1', '.h2', '.h3'].map(s => hyTags.querySelector(s));
  const p2pTag = add(el, `<div class="ctr" style="top:1050px"><div class="tag crit" style="font-size:38px">2 จุด · 1 สายตรง</div></div>`);
  const SIX = [['star', 'STAR', 'ดาว', 'มีศูนย์กลาง!', 'mStar', 'mStarK'], ['bus', 'BUS', 'บัส', 'มีสายหลัก!', 'mBus', 'mBusK'], ['ring', 'RING', 'ริง', 'เชื่อมเป็นวง!', 'mRing', 'mRingK'],
    ['mesh', 'MESH', 'เมช', 'มีหลายเส้นทาง!', 'mMesh', 'mMeshK'], ['tree', 'TREE', 'ทรี', 'แตกกิ่งเป็นลำดับชั้น!', 'mTree', 'mTreeK'], ['hybrid', 'HYBRID', 'ไฮบริด', 'นำหลายแบบมาผสมกัน!', 'mHyb', 'mHybK']];
  const sixN = SIX.map(([k, n, th]) => add(el, `<div class="ctr" style="top:1266px"><div class="memo crit" data-topo="${k}" style="font-size:46px">${n} <span class="eq">·</span> ${th}</div></div>`));
  const sixK = SIX.map(([k, , , kk]) => add(el, `<div class="ctr" style="top:1350px"><div class="chip pink crit" data-topo="${k}" style="font-size:40px;padding:6px 26px">${kk}</div></div>`));
  // exam paper
  const paper = add(el, `<div class="paper crit" style="left:250px;top:560px;width:580px;height:520px;overflow:hidden">
    <div style="height:84px;background:linear-gradient(90deg,#EE7FAA,#F7A8C8);color:#fff;font-weight:800;font-size:40px;display:flex;align-items:center;justify-content:center">ข้อสอบ · วิชาคอมพิวเตอร์</div>
    <div style="margin:22px 34px 0;height:16px;width:80%;border-radius:8px;background:#DCE5F3"></div><div style="margin:12px 34px 0;height:16px;width:55%;border-radius:8px;background:#DCE5F3"></div>
    <div class="pv mcard" style="left:150px;top:150px;width:280px;height:300px;box-shadow:none"></div></div>`);
  const pv = TOPO.view(paper.querySelector('.pv'));
  const bubs = [['เชื่อมต่อแบบใด?', 1110], ['ถ้าอุปกรณ์เสีย จะกระทบอะไร?', 1196], ['มีศูนย์กลางหรือไม่?', 1282]].map(([tx, y]) => add(el, `<div class="ctr" style="top:${y}px"><div class="bub crit">${tx}</div></div>`));
  const cFast = cap(el, 1150, ['<span class="bl">จำภาพได้</span>', '= <span class="pkc">ตอบได้ทันที!</span>'], 'lt', 50);
  const cGo = chip(el, 1300, 'มาลองทำข้อสอบกัน!', 'pink', 46);
  // ---- timing
  const FLIP = [b('trunk') - .1, .9], BACK = [b('smallB') + .75, .8];
  // ---- SFX
  kn.forEach((_, i) => sfx('pop', X0 + b('besides') + .2 + i * .15, .45)); tw.forEach((_, i) => sfx('pop', X0 + b('two') + .3 + i * .3, .6));
  sfx('build', X0 + b('t5') + .3, .7); [0, 1, 2].forEach(i => sfx('plug', X0 + b('t5') + .5 + i * .6, .4)); sfx('packet', X0 + b('tTop') + .2, .7); sfx('packet', X0 + b('tDown') + .2, .7);
  sfx('swoosh', X0 + FLIP[0], .5); sfx('sparkle', X0 + b('bigB'), .5); sfx('sparkle', X0 + b('smallB'), .5); sfx('swoosh', X0 + BACK[0], .5);
  sfx('swoosh', X0 + b('h6'), .5); fm.forEach((_, i) => sfx('pop', X0 + b('hTwo') + .3 + i * .3, .5)); sfx('build', X0 + b('hStars') + .1, .6); sfx('build', X0 + b('hJoin') + .1, .7); sfx('packet', X0 + b('hJoin') + 1.4, .7);
  sfx('swoosh', X0 + b('pBesides'), .5); sfx('plug', X0 + b('pDef') + .3, .7); sfx('packet', X0 + b('pDef') + .9, .6);
  sfx('riser', X0 + b('six') - .2, .5); SIX.forEach(s => { sfx('whoosh', X0 + b(s[4]) - .1, .5); sfx('pop', X0 + b(s[5]), .6); });
  sfx('page', X0 + b('exam'), .7); bubs.forEach((_, i) => sfx('pop', X0 + [b('exam') + .6, b('which'), b('which') + 1.3][i], .55)); sfx('success', X0 + b('fast'), .6); sfx('whoosh', X0 + b('go'), .5);
  function draw(t) {
    const u = t - X0;
    let St = null;
    sil.style.opacity = 0;
    if (u >= b('t5') && u < b('h6')) {
      // TREE
      const kf = E.inOut(P(u, FLIP[0], FLIP[1])) * (1 - E.inOut(P(u, BACK[0], BACK[1])));
      St = kf > 0 ? TOPO.morph(gTree, gTreeUp, kf, { retract: [2, 3], move: [0, 1], grow: [-1, 0] }) : TOPO.state(gTree);
      St.type = 'tree';
      const lv = id => id === 'R' ? 0 : id[0] === 'B' ? 1 : 2;
      Object.entries(St.nodes).forEach(([id, n]) => { const at = b('t5') + .3 + lv(id) * .6; n.s = (n.s ?? 1) * E.back(P(u, at, .4)); n.o = P(u, at, .1); n.ph = id.length; if (kf > .05 && n.kind === 'switch') n.lab = false; });
      St.links.forEach(l => { l.p = E.out(P(u, b('t5') + .5 + lv(l.b) * .6 - .3, .4)); });
      if (win(u, b('tTop'), FLIP[0])) St.packets = [...TOPO.stream(['R', 'B1', 'PC1'], u, b('tTop') + .1, FLIP[0], { T: 1.8 }), ...TOPO.stream(['R', 'B2', 'PC4'], u, b('tTop') + .4, FLIP[0], { T: 1.8 }), ...(u > b('tDown') ? TOPO.stream(['R', 'B2', 'PC3'], u, b('tDown'), FLIP[0], { T: 1.6 }) : [])];
      if (win(u, b('tTop'), b('tDown'))) setN(St, 'R', { glow: true, halo: .6 });
      if (win(u, b('tDown'), FLIP[0])) eachPC(St, (id, n) => { n.glow = true; });
      // silhouette
      const so = kf; sil.style.opacity = so;
      sil.querySelector('.tk').style.opacity = E.out(P(u, b('trunk'), .5));
      sil.querySelector('.bg').style.opacity = E.out(P(u, b('bigB'), .4));
      sil.querySelector('.sm').style.opacity = E.out(P(u, b('smallB'), .4));
      sil.querySelector('.lv').style.opacity = E.out(P(u, b('smallB') + .3, .4));
      if (u > b('smallB') + 1.6) St.packets = TOPO.stream(['R', 'B1', 'PC2'], u, b('smallB') + 1.6, b('h6'), { T: 1.4 });
    } else if (u >= b('hStars') && u < b('pBesides')) {
      // HYBRID: two stars, then the bus backbone that joins them
      St = TOPO.state(gHyb); St.type = 'hybrid'; St.cam = { x: 540, y: 905, s: .8 };
      const grpA = ['SA', 'A1', 'A2', 'A3'], grpB = ['SB', 'B1', 'B2', 'B3'];
      Object.entries(St.nodes).forEach(([id, n]) => {
        const at = grpA.includes(id) ? b('hStars') + .1 : grpB.includes(id) ? b('hStars') + .9 : b('hJoin') + .1;
        n.o = P(u, at, .2); n.s = (n.s ?? 1) * E.back(P(u, at, .4));
      });
      St.links.forEach(l => {
        const at = grpA.includes(l.a) && grpA.includes(l.b) ? b('hStars') + .3 : grpB.includes(l.a) && grpB.includes(l.b) ? b('hStars') + 1.1 : l.kind === 'bb' ? b('hJoin') + .2 : b('hJoin') + .7;
        l.p = E.out(P(u, at, .45));
        if (win(u, b('hJoin') + .2, b('hJoin') + 1.4) && (l.kind === 'bb' || l.kind === 'drop')) l.st = 'hot';
      });
      if (u > b('hStars') + 1) St.packets = TOPO.stream(['A1', 'SA', 'A3'], u, b('hStars') + 1, b('hJoin') + 1.2, { T: 1.2 });
      if (u > b('hJoin') + 1.3) St.packets = [...TOPO.stream(['A1', 'SA', 'T1', 'T2', 'SB', 'B3'], u, b('hJoin') + 1.3, 99, { T: 2.4 }), ...TOPO.stream(['B1', 'SB', 'T2', 'T1', 'SA', 'A2'], u, b('hJoin') + 2.2, 99, { T: 2.4 })];
    } else if (u >= b('pName') - .3 && u < b('six')) {
      St = TOPO.state(gP2P); St.type = 'p2p';
      Object.values(St.nodes).forEach((n, i) => { n.s = E.back(P(u, b('pName') - .2 + i * .2, .4)); n.o = P(u, b('pName') - .2 + i * .2, .1); });
      St.links[0].p = E.out(P(u, b('pDef') + .2, .6)); St.links[0].w = 12;
      if (u > b('pDef') + .9) St.packets = [...TOPO.stream(['A', 'B'], u, b('pDef') + .9, 99, { T: 1.4 }), ...TOPO.stream(['B', 'A'], u, b('pDef') + 1.6, 99, { T: 1.4 })];
    } else if (u >= b('mStar') - .4 && u < b('exam')) {
      // six memory beats: the diagram morphs to each named topology exactly on its spoken name
      let i = 0; SIX.forEach((s, j) => { if (u >= b(s[4]) - .4) i = j; });
      const k = P(u, b(SIX[i][4]) - .4, .5), prev = i ? G6[SIX[i - 1][0]] : null, cur = G6[SIX[i][0]];
      St = prev && k < 1 ? TOPO.morph(prev, cur, k, { retract: [0, .35], move: [.2, .75], grow: [.55, 1] }) : TOPO.state(cur);
      if (!prev) Object.values(St.nodes).forEach(n => { n.s = (n.s ?? 1) * E.back(k); n.o = k; });
      St.type = k < .6 && prev ? SIX[i - 1][0] : SIX[i][0];
      St.cam = { x: 540, y: 905, s: SIX[i][0] === 'hybrid' ? .8 : SIX[i][0] === 'tree' ? .95 : .92 };
      eachPC(St, (id, n) => { n.lab = false; });
      Object.values(St.nodes).forEach(n => { if (n.kind === 'switch') n.lab = false; });
      const r = { star: ['PC1', 'SW', 'PC3'], bus: ['PC1', 'T1', 'T2', 'T3', 'T4', 'T5', 'PC5'], ring: ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC1'], mesh: ['PC2', 'PC5'], tree: ['R', 'B2', 'PC4'], hybrid: ['A1', 'SA', 'T1', 'T2', 'SB', 'B2'] }[SIX[i][0]];
      if (k >= 1) St.packets = TOPO.stream(r, u, b(SIX[i][4]) + .15, 99, { T: 1.4 });
      if (k >= 1 && SIX[i][0] === 'star') setN(St, 'SW', { halo: .7, glow: true });
      if (k >= 1 && SIX[i][0] === 'bus') St.links.forEach(l => { if (l.kind === 'bb') l.st = 'hot'; });
    }
    const pOn = St ? 1 : 0;
    if (!St) { St = TOPO.state(gP2P); St.o = 0; }
    net.draw(St, t);
    const po = (win(u, b('t5'), b('h6') - .1) || win(u, b('hStars') - .1, b('pBesides') - .1) || win(u, b('pName') - .4, b('six') - .1) || win(u, b('mStar') - .5, b('exam') - .1)) ? 1 : 0;
    tf(panel, { o: po });
    // ---- intro
    kn.forEach((e, i) => show(e, u, b('besides') + .2 + i * .15, b('t5') - .2, { from: .3, el: true, d: .6 }));
    tw.forEach((e, i) => show(e, u, b('two') + .3 + i * .3, b('t5') - .2, { from: .2, el: true, d: .7 }));
    show(cTwo, u, b('two') + .1, b('t5') - .2);
    drawHeader(H.tree, u, b('tName') - .05, b('h6') - .1, b('tTh'));
    show(C.level, u, b('tLevel') + .1, b('tTop') - .1); show(C.top, u, b('tTop') + .1, b('trunk') - .2); show(C.trunk, u, b('trunk') + .1, b('smallB') + .7);
    st.forEach((e, i) => show(e, u, [b('trunk') + .4, b('bigB'), b('smallB')][i], BACK[0], { from: .3, el: true, d: .6 }));
    show(M.tree, u, b('smallB') + .8, b('h6') - .1, { from: .3, el: true, d: .7 });
    drawHeader(H.hyb, u, b('hName') - .05, b('pBesides') - .1, b('hTh'));
    fm.forEach((e, i) => show(e, u, b('hTwo') + .3 + i * .3, b('hStars') - .15, { from: .3, el: true, d: .6 }));
    show(C.two, u, b('hTwo') + .1, b('hStars') - .1); show(C.stars, u, b('hStars') + .1, b('hJoin') + 1.6);
    hy.forEach((e, i) => show(e, u, [b('hStars') + .5, b('hStars') + 1.3, b('hJoin') + .6][i], b('pBesides') - .1, { from: .3, el: true, d: .6 }));
    show(M.hyb, u, b('hJoin') + 1.7, b('pBesides') - .1, { from: .3, el: true, d: .7 });
    drawHeader(H.p2p, u, b('pName') - .1, b('six') - .1, b('pName') + .4);
    show(C.p2p, u, b('pDef') + .1, b('six') - .1); show(p2pTag, u, b('pDef') + .8, b('six') - .1);
    drawHeader(H.six, u, b('six'), b('exam') - .1, b('six') + .5);
    show(C.six, u, b('six') + .2, b('mStar') - .1);
    SIX.forEach((s, j) => { const nx = j < 5 ? b(SIX[j + 1][4]) - .45 : b('exam') - .1; show(sixN[j], u, b(s[4]) - .05, nx, { from: .4, dy: 20, d: .4 }); show(sixK[j], u, b(s[5]), nx, { from: .4, el: true, d: .6 }); });
    // exam paper
    show(paper, u, b('exam'), b('go') + .6, { from: .5, dy: 60 });
    if (u >= b('exam') - .1) { const Sp = TOPO.state(G6.star); Sp.type = 'star-q'; Sp.cam = { x: 540, y: 905, s: .36, tx: 140, ty: 150 }; eachPC(Sp, (id, n) => { n.lab = false; }); Sp.nodes.SW.lab = false; Sp.packets = TOPO.stream(['PC2', 'SW', 'PC4'], u, b('exam'), 99, { T: 1.5, s: 1.6 }); pv.draw(Sp, t); }
    bubs.forEach((e, i) => show(e, u, [b('exam') + .6, b('which'), b('which') + 1.3][i], b('ifSee') - .1, { from: .3, el: true, d: .6 }));
    show(cFast, u, b('ifSee') + .1, b('go') - .1);
    show(cGo, u, b('go'), 1e9, { from: .3, el: true, d: .7 });
  }
  SC.push({ el, a: X0, b: S('quiz'), draw, dark: () => 0 });
}
