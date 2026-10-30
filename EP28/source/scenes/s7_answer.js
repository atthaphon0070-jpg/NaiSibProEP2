// SCENE 7 — ANSWER RECAP (06_answer.mp3 from 5.3 s): star rebuilt around a central device, office flashback,
// PC3 cable vs switch failure, why ก/ค/ง are wrong (each with its own correct diagram), four clue → name beats, summary.
{
  const A0 = S('ans'), ST = A0 + 5.3, b = k => BT('ans', k);
  const el = mkScene('s7');
  const of = buildOffice(el);
  const gStar = TOPO.DEF.star({ r: 235 }), gBus = TOPO.DEF.bus({ w: 600 }), gRing = TOPO.DEF.ring({ r: 245 }), gMesh = TOPO.DEF.mesh({ r: 245 });
  const net = TOPO.view(el);
  const hStar = header(el, 'ข', 'STAR TOPOLOGY', 'แบบดาว · คำตอบที่ถูก', 'star');
  const hW = { bus: header(el, 'ก', 'BUS TOPOLOGY', 'แบบบัส', 'bus'), ring: header(el, 'ค', 'RING TOPOLOGY', 'แบบวงแหวน', 'ring'), mesh: header(el, 'ง', 'MESH TOPOLOGY', 'แบบตาข่าย', 'mesh') };
  Object.values(hW).forEach(hh => { hh.nm.querySelector('.no').style.background = 'linear-gradient(180deg,#FF9A9A,#EF4444)'; hh.nm.querySelector('.no').style.color = '#fff'; });
  const C = {
    cen: cap(el, 1254, ['ทุกเครื่องต่อเข้า', '<span class="yl">อุปกรณ์ศูนย์กลาง</span>'], 'yl'),
    back: cap(el, 1270, ['กลับไปดู<span class="pkc">สำนักงานของเรา</span>'], 'pk'),
    conn: cap(el, 1270, ['5 เครื่อง → <span class="yl">สวิตช์ตรงกลาง</span>'], '', 42),
    pc3: cap(el, 1254, ['<span class="rd">สาย PC3 หลุด</span>', '<span class="gr">เครื่องที่เหลือยังติดต่อกันได้</span>'], 'grn', 42),
    sw: cap(el, 1254, ['<span class="rd">ศูนย์กลางเสีย</span> →', 'การสื่อสารผ่านศูนย์กลาง<span class="rd">หยุด</span>'], 'red', 42),
    why: cap(el, 1254, ['แล้ว<span class="yl">ข้ออื่น</span>', 'ทำไมไม่ถูก?'], 'yl'),
    bus: cap(el, 1270, ['ใช้<span class="yl">สายหลัก</span>ร่วมกัน'], ''),
    ring: cap(el, 1270, ['เชื่อมต่อเรียงกัน<span class="cy">เป็นวง</span>'], ''),
    mesh: cap(el, 1270, ['มีเส้นทาง<span class="cy">หลายทาง</span>'], ''),
    rem: cap(el, 1270, ['<span class="yl">จำไว้ให้แม่น!</span>'], 'yl', 50),
  };
  const keyMemo = memo(el, 1286, 'จุดสำคัญ <span class="eq">=</span> ศูนย์กลาง', 'star');
  const hubs = add(el, `<div class="ctr" style="top:1372px;gap:16px"><div class="chip yel crit hb" style="font-size:36px;padding:4px 22px">Hub</div><div class="chip yel crit hb" style="font-size:36px;padding:4px 22px">Switch</div></div>`);
  const hb = [...hubs.querySelectorAll('.hb')];
  const wrong = add(el, `<div class="ctr" style="top:620px;gap:24px">${['ก', 'ค', 'ง'].map(l => `<div class="wr crit" style="width:170px;height:170px;border-radius:40px;background:#fff;display:grid;place-items:center;font-weight:800;font-size:96px;color:#EE7FAA;box-shadow:0 0 0 6px rgba(238,127,170,.6);position:relative">${l}<div style="position:absolute;right:-14px;top:-14px;width:56px;height:56px;border-radius:50%;background:#EF4444;display:grid;place-items:center;box-shadow:0 0 0 4px #fff">${ICON.cross('#fff', 32)}</div></div>`).join('')}</div>`);
  const wr = [...wrong.querySelectorAll('.wr')];
  const CLUE = [['star', gStar, 'มีอุปกรณ์ศูนย์กลาง', 'แบบดาว · STAR', 'kStar', 'nStar'], ['bus', gBus, 'มีสายหลักเส้นเดียว', 'แบบบัส · BUS', 'kBus', 'nBus'],
    ['ring', gRing, 'เชื่อมเป็นวง', 'แบบวงแหวน · RING', 'kRing', 'nRing'], ['mesh', gMesh, 'มีหลายเส้นทาง', 'แบบตาข่าย · MESH', 'kMesh', 'nMesh']];
  const clueC = CLUE.map(c => add(el, `<div class="ctr" style="top:372px"><div class="cap crit yl" data-topo="${c[0]}" style="font-size:50px"><span class="ln">${c[2]}</span></div></div>`));
  const clueN = CLUE.map(c => add(el, `<div class="ctr" style="top:1286px"><div class="memo crit" data-topo="${c[0]}" style="font-size:50px">→ ${c[3]}</div></div>`));
  const SUM = [['star', 'STAR', 'ศูนย์กลาง'], ['bus', 'BUS', 'สายหลัก'], ['ring', 'RING', 'วงแหวน'], ['mesh', 'MESH', 'หลายเส้นทาง']];
  const sum = add(el, `<div class="abs" style="left:244px;top:420px;width:592px">${SUM.map(([k, n, th]) => `<div class="sm crit" data-topo="${k}" style="display:flex;align-items:center;gap:20px;height:150px;margin-bottom:22px;padding:0 24px;border-radius:36px;background:rgba(14,29,72,.92);box-shadow:0 0 0 4px rgba(34,211,238,.55)">
    <div style="width:120px;flex:none;display:grid;place-items:center">${glyph(k, '#22D3EE', 84)}</div><div style="font-weight:800;font-size:48px;color:#FFD23F;white-space:nowrap">${n} <span style="color:#fff">=</span> <span style="color:#fff;font-size:42px">${th}</span></div></div>`).join('')}</div>`);
  const sm = [...sum.querySelectorAll('.sm')];
  const cExam = cap(el, 1150, ['ข้อสอบ <span class="cy">Network Topology</span>', '<span class="yl">ง่ายขึ้นเยอะ!</span>'], 'yl', 40);
  // ---- timing
  const OFF = [b('back') + .1, .8], ON = [b('five') - .2, .8];
  const CUT = b('pc3') + .35, FIX = b('swdown') - .35, SWF = b('swdown') + .45;
  // ---- SFX
  sfx('build', A0 + b('because') + .2, .6); hb.forEach((_, i) => sfx('pop', A0 + b('eg') + .1 + i * .4, .6));
  sfx('whoosh', A0 + OFF[0], .5); [0, 1, 2, 3, 4].forEach(i => sfx('plug', A0 + b('conn') + .2 + i * .22, .45)); sfx('whoosh', A0 + ON[0], .4);
  sfx('unplug', A0 + CUT - .2, .9); sfx('success', A0 + b('rest') + .3, .5); sfx('plug', A0 + FIX, .5); sfx('warn', A0 + SWF - .5, .6); sfx('fault', A0 + SWF, .9);
  [0, 1, 2, 3, 4].forEach(i => sfx('down', A0 + b('stop') + i * .15, .4)); sfx('restore', A0 + b('key') + .1, .6); sfx('sparkle', A0 + b('key') + .8, .5);
  wr.forEach((_, i) => sfx('pop', A0 + b('whyNot') + .3 + i * .2, .5));
  ['a', 'c', 'd'].forEach(k => sfx('swoosh', A0 + b(k) - .05, .5));
  CLUE.forEach(c => { sfx('whoosh', A0 + b(c[4]) - .05, .45); sfx('pop', A0 + b(c[5]) + .05, .6); });
  sm.forEach((_, i) => sfx('pop', A0 + b('pics') + .1 + i * .18, .5)); sfx('success', A0 + b('easy'), .6);
  function draw(t) {
    const u = t - A0;
    const dO = E.inOut(P(u, OFF[0], OFF[1])) * (1 - E.inOut(P(u, ON[0], ON[1])));
    drawOffice(of, u, dO, { x: 945, y: 1580, s: .78, expr: 'smile' });
    let St;
    if (u < b('a') - .1) {
      St = TOPO.state(gStar); St.type = 'star';
      St.nodes.SW.label = u < b('back') ? 'HUB / SWITCH' : 'SWITCH';
      eachPC(St, (id, n) => { n.ph = +id[2]; n.lab = dO < .5; });
      if (u < b('back') + .3) setN(St, 'SW', { halo: .5 + .3 * Math.sin(u * 4), glow: true });
      if (u < b('back')) St.packets = [...TOPO.stream(['PC1', 'SW', 'PC3'], u, 5.3, b('back'), { T: 1.3 }), ...TOPO.stream(['PC5', 'SW', 'PC2'], u, 5.8, b('back'), { T: 1.5 })];
      if (u > b('five') - .3) {
        St.links.forEach((l, i) => { l.p = E.out(P(u, b('conn') + .2 + i * .22, .4)); });
        if (u < OFF[0] + OFF[1]) St.links.forEach(l => { l.p = 1; });
        if (win(u, b('conn') + 1.4, CUT)) St.packets = TOPO.stream(['PC4', 'SW', 'PC2'], u, b('conn') + 1.4, CUT - .2, { T: 1.2 });
        if (u < FIX) {
          breakLink(St, 'SW', 'PC3', u, CUT, { brk: .8 });
          if (u > CUT) setN(St, 'PC3', { alert: E.back(P(u, CUT + .2, .3)), on: 0 });
          if (win(u, b('rest'), FIX)) { St.packets = [...TOPO.stream(['PC1', 'SW', 'PC4'], u, b('rest') + .1, FIX, { T: 1.2 }), ...TOPO.stream(['PC5', 'SW', 'PC2'], u, b('rest') + .4, FIX, { T: 1.3 })]; ['PC1', 'PC2', 'PC4', 'PC5'].forEach((id, i) => setN(St, id, { ok: E.back(P(u, b('rest') + .2 + i * .12, .3)) })); }
        } else if (u < b('key')) {
          if (u < SWF - .2) setL(St, 'SW', 'PC3', { st: 'green' });
          failSwitch(St, 'SW', u, SWF);
          eachPC(St, (id, n) => { const at = b('stop') + (+id[2] - 1) * .15; if (u > at) { n.alert = E.back(P(u, at, .3)); n.on = 0; } });
          if (u < SWF - .1) St.packets = TOPO.stream(['PC3', 'SW', 'PC5'], u, FIX + .2, SWF - .1, { T: 1.0 });
        } else {
          setN(St, 'SW', { halo: .6 + .3 * Math.sin(u * 4), glow: true, s: pulse(u, b('key') + .2, .5, .15) });
          St.links.forEach(l => { l.st = 'hot'; });
          St.packets = [...TOPO.stream(['PC1', 'SW', 'PC3'], u, b('key') + .3, 99, { T: 1.3 }), ...TOPO.stream(['PC4', 'SW', 'PC2'], u, b('key') + .6, 99, { T: 1.5 })];
        }
      }
      St.o = 1 - P(u, b('whyNot') - .3, .3);
    } else if (u < b('remember')) {
      const W = u < b('c') ? ['bus', gBus, b('a')] : u < b('d') ? ['ring', gRing, b('c')] : ['mesh', gMesh, b('d')];
      const prev = W[0] === 'bus' ? gStar : W[0] === 'ring' ? gBus : gRing;
      const k = P(u, W[2], 1.0);
      St = k < 1 ? TOPO.morph(prev, W[1], k) : TOPO.state(W[1]);
      if (W[0] === 'bus' && k < 1) St.o = P(u, W[2] - .1, .3);
      St.type = k < .5 && W[0] !== 'bus' ? prev.type : W[0];
      const r = { bus: ['PC1', 'T1', 'T2', 'T3', 'T4', 'T5', 'PC5'], ring: ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC1'], mesh: ['PC1', 'PC3'] }[W[0]];
      if (k >= 1) { St.packets = TOPO.stream(r, u, W[2] + 1, 99, { T: W[0] === 'ring' ? 2.6 : 1.4 }); if (W[0] === 'mesh') St.packets.push(...TOPO.stream(['PC1', 'PC2', 'PC3'], u, W[2] + 1.2, 99, { T: 1.6 }), ...TOPO.stream(['PC1', 'PC5', 'PC4', 'PC3'], u, W[2] + 1.4, 99, { T: 2.0 })); }
      if (W[0] === 'bus' && k >= 1) St.links.forEach(l => { if (l.kind === 'bb') l.st = 'hot'; });
      St.o = (St.o ?? 1) * (1 - P(u, b('remember') - .3, .3));
    } else if (u < b('pics') - .1) {
      let i = 0; CLUE.forEach((c, j) => { if (u >= b(c[4]) - .3) i = j; });
      const k = P(u, b(CLUE[i][4]) - .3, .6);
      St = TOPO.state(CLUE[i][1]); St.type = CLUE[i][0];
      Object.values(St.nodes).forEach(n => { n.s = (n.s ?? 1) * lerp(.6, 1, E.back(k)); n.o = clamp(k * 2); });
      const r = { star: ['PC1', 'SW', 'PC3'], bus: ['PC1', 'T1', 'T2', 'T3', 'T4', 'T5', 'PC5'], ring: ['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC1'], mesh: ['PC2', 'PC5'] }[CLUE[i][0]];
      St.packets = TOPO.stream(r, u, b(CLUE[i][4]) + .4, 99, { T: CLUE[i][0] === 'ring' ? 2.4 : 1.3 });
      if (CLUE[i][0] === 'star') setN(St, 'SW', { halo: .7, glow: true });
      if (CLUE[i][0] === 'bus') St.links.forEach(l => { if (l.kind === 'bb') l.st = 'hot'; });
      if (CLUE[i][0] === 'ring') St.links.forEach(l => { l.st = 'hot'; });
      if (CLUE[i][0] === 'mesh') St.links.forEach(l => { l.st = 'hot'; });
    } else { St = TOPO.state(gStar); St.o = 0; }
    net.draw(St, t);
    // ---- text
    drawHeader(hStar, u, 5.3, b('whyNot') - .2, 5.6);
    tf(hStar, { o: 1 - dO });
    show(C.cen, u, 5.5, b('eg') + .9); hb.forEach((e, i) => show(e, u, b('eg') + .1 + i * .4, b('back') - .1, { from: .3, el: true, d: .6 }));
    show(C.back, u, b('back') + .1, b('five') - .1); show(C.conn, u, b('conn') + .1, b('pc3') - .1); show(C.pc3, u, b('pc3') + .2, b('swdown') - .1);
    show(C.sw, u, b('via'), b('key') - .1); show(keyMemo, u, b('key') + .2, b('whyNot') - .2, { from: .3, el: true, d: .7 });
    show(C.why, u, b('whyNot') + .1, b('a') - .1); wr.forEach((e, i) => show(e, u, b('whyNot') + .3 + i * .2, b('a') - .1, { from: .3, el: true, d: .6 }));
    drawHeader(hW.bus, u, b('a') + .5, b('c') - .25, b('aName')); show(C.bus, u, b('aDef'), b('c') - .1);
    drawHeader(hW.ring, u, b('c') + .5, b('d') - .25, b('cName')); show(C.ring, u, b('cDef'), b('d') - .1);
    drawHeader(hW.mesh, u, b('d') + .5, b('remember') - .1, b('dName')); show(C.mesh, u, b('dDef'), b('remember') - .1);
    show(C.rem, u, b('remember'), b('kStar') - .1, { from: .3, el: true, d: .6 });
    CLUE.forEach((c, j) => { const nx = j < 3 ? b(CLUE[j + 1][4]) - .3 : b('pics') - .1; show(clueC[j], u, b(c[4]), nx, { from: .5, dy: 20 }); show(clueN[j], u, b(c[5]), nx, { from: .3, el: true, d: .6 }); });
    sm.forEach((e, i) => show(e, u, b('pics') + .1 + i * .18, 1e9, { from: .85, dy: 30 }));
    show(cExam, u, b('exam'), 1e9);
    tf(cExam.firstChild, { s: pulse(u, b('easy'), .4, .06) });
  }
  SC.push({ el, a: ST, b: S('promo'), draw, dark: t => 1 - E.inOut(P(t - A0, OFF[0], OFF[1])) * (1 - E.inOut(P(t - A0, ON[0], ON[1]))) });
}
