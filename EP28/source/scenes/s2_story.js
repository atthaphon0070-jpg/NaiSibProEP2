// SCENE 2 — STORY (02_story.mp3): a light 2D office whose five desk monitors already sit on the star layout,
// then the room fades to the navy diagram view (same nodes, same positions): file transfer → PC3 cable out →
// others keep working → PC3 re-plugged → switch fails → all five lose the switch → STAR TOPOLOGY.
{
  const S0 = S('story'), b = k => BT('story', k);
  const el = mkScene('s2');
  const of = buildOffice(el);
  const g = TOPO.DEF.star({ r: 235 });
  const rays = add(el, `<svg width="1080" height="1920" style="position:absolute;inset:0;overflow:visible"><g class="ry" transform="translate(540 900)">${[0, 1, 2, 3, 4].map(i => `<path d="M0 0 L${-26} -300 L26 -300Z" fill="url(#st-ray)" transform="rotate(${i * 72})"/>`).join('')}</g>
    <defs><linearGradient id="st-ray" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#FFD23F" stop-opacity=".75"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></linearGradient></defs></svg>`);
  const net = TOPO.view(el);
  const loc = chip(el, 372, 'สำนักงานแห่งหนึ่ง (ตัวอย่างสมมติ)', 'pink', 36);
  const loc2 = chip(el, 372, 'แผนผังเครือข่ายของสำนักงาน', 'navy', 36);
  const cYou = cap(el, 1270, ['คุณ = <span class="pkc">เจ้าหน้าที่คอมพิวเตอร์</span>'], 'pk', 44);
  const c5 = cap(el, 1270, ['มีคอมพิวเตอร์ <span class="bl">5 เครื่อง</span>'], 'pk');
  const cSw = cap(el, 1254, ['ทุกเครื่องต่อสายเข้า', '<span class="bl">สวิตช์ (Switch)</span>'], 'lt');
  const cMid = cap(el, 1270, ['สวิตช์อยู่<span class="pkc">ตรงกลางห้อง</span>'], 'pk');
  const cFile = cap(el, 1270, ['ส่ง<span class="cy">ไฟล์งาน</span>ผ่านเครือข่าย'], '');
  const cOut = cap(el, 1270, ['สาย <span class="rd">PC3 หลุด!</span>'], 'red', 50);
  const cNo = cap(el, 1254, ['PC3 ติดต่อเครื่องอื่น', '<span class="rd">ผ่านเครือข่ายไม่ได้</span>'], 'red');
  const cOk = cap(el, 1254, ['สายเครื่องเดียวหลุด', '<span class="gr">→ กระทบเฉพาะเครื่องนั้น</span>'], 'grn');
  const fix = add(el, `<div style="position:absolute;left:580px;top:966px"><div class="tag crit" style="font-size:28px;color:#fff;background:#16A34A;box-shadow:none">ต่อสายกลับแล้ว ✓</div></div>`);
  const cLater = cap(el, 1270, ['ไม่นาน... <span class="yl">อีกเหตุการณ์</span>'], 'yl');
  const cSw2 = cap(el, 1270, ['<span class="rd">สวิตช์ตรงกลางเสีย!</span>'], 'red', 50);
  const cAll = cap(el, 1254, ['ทั้ง 5 เครื่อง', '<span class="rd">สื่อสารผ่านสวิตช์ไม่ได้</span>'], 'red');
  const cWhy = cap(el, 1270, ['<span class="yl">ทำไม</span>ถึงเป็นอย่างนั้น?'], 'yl', 50);
  const cBec = cap(el, 1270, ['เพราะเชื่อมต่อแบบ<span class="yl">ดาว</span>'], 'yl');
  const hdr = header(el, '', 'STAR TOPOLOGY', 'แบบดาว', 'star');
  const cOne = add(el, `<div class="ctr" style="top:1222px;flex-direction:column;align-items:center;gap:12px"><div class="cap crit" style="font-size:42px"><span class="ln">นี่เป็นแค่ <span class="yl">1 รูปแบบ</span> ที่ต้องรู้</span></div>
    <div class="gl" style="display:flex;gap:12px">${['star', 'bus', 'ring', 'mesh', 'tree', 'hybrid'].map((k, i) => `<div class="g1 crit" style="width:76px;height:76px;border-radius:22px;background:${i ? 'rgba(14,29,72,.9)' : '#FFD23F'};box-shadow:0 0 0 3px rgba(34,211,238,.5);display:grid;place-items:center">${glyph(k, i ? '#22D3EE' : '#0E1D48', 48)}</div>`).join('')}</div></div>`);
  const g1 = [...cOne.querySelectorAll('.g1')];
  const DK = [b('day') - .9, 1.0];                   // office → navy diagram
  const OUT = b('pc3') + .25, FIX = b('later') + .5, SWF = b('swdown') + .1, BACK = b('because') + .1;
  // ---- SFX
  [0, 1, 2, 3, 4].forEach(i => sfx('pop', S0 + b('five') + .2 + i * .3, .5));
  [0, 1, 2, 3, 4].forEach(i => sfx('plug', S0 + b('cable') + .3 + i * .28, .6));
  sfx('whoosh', S0 + DK[0], .5); sfx('packet', S0 + b('file') + .4, .8); sfx('packet', S0 + b('file') + 2.0, .8);
  sfx('unplug', S0 + OUT - .2, 1); sfx('down', S0 + b('pc3no') + .1, .6);
  [0, 1, 2].forEach(i => sfx('packet', S0 + b('normal') + .2 + i * .6, .7)); sfx('success', S0 + b('normal') + .4, .6);
  sfx('plug', S0 + FIX, .9); sfx('restore', S0 + FIX + .15, .7);
  sfx('warn', S0 + b('now'), .7); sfx('fault', S0 + SWF, 1);
  [0, 1, 2, 3, 4].forEach(i => sfx('down', S0 + b('all5') + i * .25, .45));
  sfx('pop', S0 + b('why') + .1, .6); sfx('restore', S0 + BACK, .6); sfx('sparkle', S0 + b('star'), .8); sfx('swoosh', S0 + b('star') - .1, .5);
  g1.forEach((_, i) => sfx('pop', S0 + b('one') + .4 + i * .14, .4));
  function draw(t) {
    const u = t - S0;
    const dk = E.inOut(P(u, DK[0], DK[1]));
    drawOffice(of, u, 1 - dk, { x: 945, y: 1580, s: .78, arm: E.out(P(u, b('you'), .5)) * (1 - P(u, b('five'), .5)), wave: win(u, b('you'), b('five')) ? 1 : 0, expr: 'happy' });
    const St = TOPO.state(g);
    eachPC(St, (id, n) => {
      const i = +id[2] - 1, at = b('five') + .2 + i * .3;
      n.on = u > at ? 1 : 0; n.s = pulse(u, at, .35, .15); n.lab = u > at - .1; n.ph = i;
    });
    St.links.forEach((l, i) => { l.p = E.out(P(u, b('cable') + .3 + i * .28, .45)); });
    setN(St, 'SW', { halo: win(u, b('cable') + 1.8, b('day')) ? .5 + .4 * Math.sin(u * 5) : 0, glow: win(u, b('middle'), b('day')), s: pulse(u, b('middle'), .5, .15) });
    // file transfer PC1 → switch → PC4 (always via the centre)
    St.packets = TOPO.stream(['PC1', 'SW', 'PC4'], u, b('file') + .3, b('sudden') + .4, { T: 1.6, file: true, s: 1.1 });
    // PC3 cable out
    if (u < FIX + .6) {
      breakLink(St, 'SW', 'PC3', u, OUT, { brk: .8 });
      setN(St, 'PC3', { glow: win(u, b('sudden'), OUT + .4), alert: E.back(P(u, b('pc3no') + .1, .3)), on: u > b('pc3no') + .1 ? 0 : St.nodes.PC3.on });
    }
    if (u >= FIX && u < FIX + .6) { setL(St, 'SW', 'PC3', { st: 'green', gap: 0, xs: 0, spark: 0 }); setN(St, 'PC3', { alert: 1 - P(u, FIX, .3), on: 1, ok: 1 - P(u, FIX + .3, .3) }); }
    // the other four keep working (through the switch)
    if (win(u, b('rest'), b('later'))) {
      St.packets.push(...TOPO.stream(['PC1', 'SW', 'PC2'], u, b('rest') + .3, b('later'), { T: 1.3 }), ...TOPO.stream(['PC4', 'SW', 'PC5'], u, b('rest') + .7, b('later'), { T: 1.5 }), ...TOPO.stream(['PC2', 'SW', 'PC4'], u, b('normal') + .2, b('later'), { T: 1.4 }));
      ['PC1', 'PC2', 'PC4', 'PC5'].forEach((id, i) => setN(St, id, { ok: E.back(P(u, b('normal') + .2 + i * .15, .3)) * (1 - P(u, b('later') - .3, .3)) }));
    }
    if (win(u, FIX + .8, SWF)) St.packets.push(...TOPO.stream(['PC3', 'SW', 'PC1'], u, FIX + .8, SWF, { T: 1.4 }), ...TOPO.stream(['PC5', 'SW', 'PC2'], u, FIX + 1.2, SWF, { T: 1.6 }));
    // switch failure → everything through it stops
    if (u < BACK) {
      failSwitch(St, 'SW', u, SWF);
      eachPC(St, (id, n) => { const i = +id[2] - 1, at = b('all5') + i * .25; if (u > at) { n.alert = E.back(P(u, at, .3)); n.on = 0; } });
    }
    // because → star: everything restored, star rays + header
    const ry = E.out(P(u, BACK + .2, .8)) * (1 - P(u, b('one') + .2, .5));
    if (u >= BACK) {
      setN(St, 'SW', { halo: .5 + .3 * Math.sin(u * 4), glow: true });
      St.links.forEach(l => { l.st = 'hot'; });
      St.packets = [...TOPO.stream(['PC1', 'SW', 'PC3'], u, BACK + .4, 99, { T: 1.4 }), ...TOPO.stream(['PC5', 'SW', 'PC2'], u, BACK + .8, 99, { T: 1.6 }), ...TOPO.stream(['PC4', 'SW', 'PC1'], u, BACK + 1.1, 99, { T: 1.5 })];
    }
    rays.querySelector('.ry').setAttribute('transform', `translate(540 900) rotate(${u * 8}) scale(${.6 + .4 * ry})`); rays.style.opacity = ry * (dk);
    St.cam = { x: 540, y: 900, s: lerp(1, 1, dk) };
    net.draw(St, t);
    // ---- text
    tf(loc, { ...life(u, b('imagine') + .2, DK[0] + .3, { from: .5, dy: 20 }) });
    tf(loc2, life(u, DK[0] + .9, b('because') - .2, { from: .5, dy: 20 }));
    show(cYou, u, b('you'), b('five') - .1);
    show(c5, u, b('five') + .1, b('every') - .1);
    show(cSw, u, b('every'), b('middle') - .1);
    show(cMid, u, b('middle'), b('day') - .3);
    show(cFile, u, b('file') + .1, b('pc3') - .1);
    tf(cOut, { ...life(u, OUT, b('pc3no') - .1, { from: .5, dy: 20 }), x: shake(u, OUT, .3, 6) });
    show(cNo, u, b('pc3no') + .1, b('rest') - .1);
    show(cOk, u, b('normal') + .1, b('later') - .1);
    show(fix, u, FIX + .1, SWF - .2, { from: .3, el: true, d: .6 });
    show(cLater, u, b('later') + .1, b('swdown') - .1);
    tf(cSw2, { ...life(u, SWF, b('all5') - .1, { from: .5, dy: 20 }), x: shake(u, SWF, .3, 6) });
    show(cAll, u, b('cant'), b('why') - .1);
    show(cWhy, u, b('why') + .05, b('because') - .1, { from: .3, el: true, d: .6 });
    show(cBec, u, b('because') + .1, b('one') - .1);
    drawHeader(hdr, u, b('star') - .05, 1e9, b('star') + .5);
    show(cOne, u, b('one') + .1, 1e9);
    g1.forEach((e, i) => show(e, u, b('one') + .4 + i * .14, 1e9, { from: .5, d: .5 }));
  }
  SC.push({ el, a: S0, b: S('know'), draw, dark: t => E.inOut(P(t - S0, DK[0], DK[1])) });
}
