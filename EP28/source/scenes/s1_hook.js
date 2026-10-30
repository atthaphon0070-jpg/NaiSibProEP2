// SCENE 1 — HOOK (01_hook.mp3). Frame 0: "เตรียมสอบนายสิบ" + live star network + the question line, all inside the safe zone.
{
  const H0 = S('hook'), b = k => BT('hook', k);
  const el = mkScene('s1');
  const gStar = TOPO.DEF.star({ r: 235 }), gRing = TOPO.DEF.ring({ r: 240 }), gMesh = TOPO.DEF.mesh({ r: 240 });
  const net = TOPO.view(el);
  const kw = add(el, `<div class="ctr" style="top:362px"><div class="kw crit" style="font-size:72px">เตรียมสอบนายสิบ</div></div>`);
  const subj = chip(el, 468, 'วิชาคอมพิวเตอร์ · ข้อนี้ต้องรู้!', 'pink', 40);
  const q0 = cap(el, 1254, ['สวิตช์เสียตัวเดียว', 'ทำไม<span class="yl">ทั้งห้อง</span>ติดต่อกันไม่ได้?'], 'yl', 42);
  const c5 = add(el, `<div class="ctr" style="top:1270px;gap:22px"><div class="chip navy crit c5a" style="font-size:40px"><span class="cy">5</span> COMPUTERS</div><div class="chip yel crit c5b" style="font-size:40px">1 SWITCH</div></div>`);
  const cBad = cap(el, 1254, ['อุปกรณ์ตัวกลาง<span class="rd">เสีย!</span>'], 'red');
  const cAll = cap(el, 1254, ['ทั้ง 5 เครื่อง', '<span class="rd">ติดต่อกันผ่านเครือข่ายไม่ได้!</span>'], 'red', 42);
  const cWhy = cap(el, 1254, ['เสียตัวเดียว', '<span class="yl">กระทบทั้งเครือข่าย?</span>'], 'yl');
  const cChg = cap(el, 1254, ['ถ้าเปลี่ยนวิธีเชื่อมต่อ...'], '');
  const tRing = chip(el, 1280, 'รูปวงแหวน?', 'navy', 40), tMesh = chip(el, 1280, 'รูปตาข่าย?', 'navy', 40);
  const cSame = cap(el, 1254, ['ผลลัพธ์จะ<span class="yl">เหมือนเดิม</span>ไหม?'], 'yl');
  const title = add(el, `<div class="ctr" style="top:600px;flex-direction:column;align-items:center"><div class="kw crit tw1" style="font-size:100px;color:#fff;text-shadow:0 0 30px rgba(34,211,238,.7),0 8px 0 rgba(0,0,0,.35)">NETWORK</div><div class="kw crit tw2" style="font-size:100px">TOPOLOGY</div></div>`);
  const tTh = chip(el, 880, 'รูปแบบการเชื่อมต่อเครือข่าย', 'pink', 44);
  const row = add(el, `<div class="ctr" style="top:1010px;gap:10px">${['star', 'bus', 'ring', 'mesh', 'tree', 'hybrid'].map(k => `<div class="hg crit" style="width:86px;height:86px;border-radius:24px;background:rgba(14,29,72,.9);box-shadow:0 0 0 3px rgba(34,211,238,.5);display:grid;place-items:center">${glyph(k, '#22D3EE', 56)}</div>`).join('')}</div>`);
  const hg = [...row.querySelectorAll('.hg')];
  const cTell = cap(el, 1180, ['ใครเตรียมสอบนายสิบ', '<span class="yl">ต้องแยกให้ออก!</span>'], 'yl');
  // ---- SFX
  [0, 1, 2, 3, 4].forEach(i => sfx('pop', H0 + b('pc5') + i * .3, .5));
  sfx('build', H0 + b('via') + .2, .7); sfx('warn', H0 + b('sudden') + .05, .8); sfx('fault', H0 + b('broke') + .08, 1);
  [0, 1, 2, 3, 4].forEach(i => sfx('down', H0 + b('all5') + i * .25, .45));
  sfx('whoosh', H0 + b('why'), .5); sfx('unplug', H0 + b('change') + .1, .5); sfx('build', H0 + b('ring') - .3, .7); sfx('build', H0 + b('mesh'), .7);
  sfx('riser', H0 + b('called') - .2, .6); sfx('swoosh', H0 + b('topo') - .05, .7); sfx('sparkle', H0 + b('topo') + .35, .7);
  hg.forEach((_, i) => sfx('pop', H0 + b('who') + .1 + i * .16, .45));
  const FAIL = b('broke') + .08;
  function draw(t) {
    const u = t - H0;
    let St;
    if (u < b('change')) {
      St = TOPO.state(gStar);
      // packets flow from frame 0 (all via the switch)
      St.packets = [...TOPO.stream(['PC1', 'SW', 'PC3'], u, -0.6, FAIL, { T: 1.3 }), ...TOPO.stream(['PC4', 'SW', 'PC2'], u, -0.2, FAIL, { T: 1.5 }), ...TOPO.stream(['PC5', 'SW', 'PC1'], u, .3, FAIL, { T: 1.7 })];
      eachPC(St, (id, n) => { const i = +id[2] - 1; n.ph = i; const at = b('pc5') + i * .3; n.glow = win(u, at, at + .5) ? 1 : 0; n.s = pulse(u, at, .4, .12); });
      setN(St, 'SW', { halo: win(u, b('via'), b('sudden')) ? .6 + .4 * Math.sin(u * 5) : 0, glow: win(u, b('via'), b('sudden')) });
      if (win(u, b('via'), b('sudden'))) St.links.forEach((l, i) => { if (u > b('via') + .25 * i) l.st = 'hot'; });
      failSwitch(St, 'SW', u, FAIL);
      eachPC(St, (id, n) => { const i = +id[2] - 1; n.alert = E.back(P(u, b('all5') + i * .25, .3)); if (u > b('all5') + i * .25) n.on = 0; });
      const push = E.inOut(P(u, b('why'), 1.2)) * (1 - E.inOut(P(u, b('change') - .5, .5)));
      setN(St, 'SW', { s: 1 + .25 * push });
      St.cam = { x: 540, y: 900, s: 1 + .06 * E.inOut(clamp(u / 10)) * (1 - push) + .08 * push };
    } else if (u < b('mesh')) {
      const k = P(u, b('change') + .05, 2.4);
      St = TOPO.morph(gStar, gRing, k);
      if (k < .3) { setN(St, 'SW', { fail: 1 }); eachPC(St, (id, n) => { n.alert = 1 - clamp(k / .25); n.on = k > .2 ? 1 : 0; }); }
      St.cam = { x: 540, y: 900, s: 1.06 - .06 * E.inOut(k) };
      if (u > b('ring') + .6) St.packets = TOPO.stream(['PC1', 'PC2', 'PC3', 'PC4', 'PC5', 'PC1'], u, b('ring') + .6, b('mesh'), { T: 2.4 });
    } else {
      const k = P(u, b('mesh'), 1.0);
      St = TOPO.morph(gRing, gMesh, k);
      if (u > b('same')) St.packets = [...TOPO.stream(['PC1', 'PC3'], u, b('same'), 40, { T: 1.1 }), ...TOPO.stream(['PC2', 'PC5', 'PC4'], u, b('same') + .3, 40, { T: 1.4 }), ...TOPO.stream(['PC3', 'PC1', 'PC4'], u, b('same') + .6, 40, { T: 1.6 })];
      const dim = E.inOut(P(u, b('called'), .8));
      St.o = 1 - .8 * dim; St.cam = { x: 540, y: 900, s: 1 - .25 * dim };
    }
    St.type = u < b('change') + 1.2 ? 'star' : u < b('mesh') + .5 ? 'ring' : 'mesh';
    net.draw(St, t);
    // ---- text
    tf(kw, { o: 1 - P(u, b('called') - .2, .4), s: pulse(u, b('kw'), .45, .05) });
    tf(subj, { ...life(u, b('subj'), b('sudden') - .2, { from: .4, dy: 20, el: true, d: .7 }), s: life(u, b('subj'), b('sudden') - .2, { from: .4, d: .7, el: true }).s * pulse(u, b('must'), .35, .06) });
    tf(q0, { o: 1 - P(u, b('pc5') - .3, .3) });
    tf(c5, { o: 1 - P(u, b('sudden') - .2, .3) });
    show(c5.querySelector('.c5a'), u, b('pc5') + .4, 1e9, { from: .4 }); show(c5.querySelector('.c5b'), u, b('via') + .35, 1e9, { from: .4 });
    tf(cBad, { ...life(u, b('broke') + .1, b('all5') - .1, { from: .5, dy: 20 }), x: shake(u, b('broke') + .1, .3, 6) });
    show(cAll, u, b('all5') + .1, b('why') - .1);
    show(cWhy, u, b('why') + .1, b('change') - .1);
    show(cChg, u, b('change') + .15, b('ring'));
    show(tRing, u, b('ring'), b('mesh') - .05, { from: .3, el: true, d: .6 });
    show(tMesh, u, b('mesh') + .05, b('same') - .05, { from: .3, el: true, d: .6 });
    show(cSame, u, b('same'), b('called') + .2);
    show(title.querySelector('.tw1'), u, b('topo') - .1, 1e9, { from: .3, dy: 80, d: .7 });
    show(title.querySelector('.tw2'), u, b('topo') + .25, 1e9, { from: .3, dy: 80, d: .7 });
    show(tTh, u, b('topo') + .8, 1e9, { from: .4 });
    hg.forEach((g, i) => show(g, u, b('who') + .1 + i * .16, 1e9, { from: .5, d: .5 }));
    show(cTell, u, b('who') + .2, 1e9);
    tf(cTell.firstChild, { s: pulse(u, b('tell'), .4, .08) });
  }
  SC.push({ el, a: H0, b: S('story'), draw, dark: () => 1 });
}
