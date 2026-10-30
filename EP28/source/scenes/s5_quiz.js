// SCENE 5–6–7A — QUIZ (05_quiz.mp3) + exact 5.000 s silent countdown (150 frames) + answer reveal (06_answer.mp3 0–5.3 s).
// Before the reveal all four cards are identical in colour/size/type; the diagram is a neutral central device (no "STAR" label).
{
  const Q0 = S('quiz'), CD = S('cd'), A0 = S('ans'), b = k => BT('quiz', k), ba = k => BT('ans', k);
  const END = A0 + 5.3;
  window.REVEAL_AT = A0 + ba('b');
  const el = mkScene('s5');
  add(el, `<img src="${NSP.BASE}brand/mascot_presenter.png" class="masc" style="position:absolute;left:-30px;top:1440px;width:300px;opacity:.95">`);
  const masc = el.querySelector('.masc');
  const top1 = add(el, `<div class="ctr" style="top:372px"><div class="crit" style="font-weight:800;font-size:50px;line-height:1.15;color:#2F6BFF;text-shadow:0 4px 0 #fff,0 10px 18px rgba(47,107,255,.25)">เตรียมสอบนายสิบ</div></div>`);
  const top2 = chip(el, 432, 'วิชาคอมพิวเตอร์', 'pink', 34);
  const qb = add(el, `<div class="qbox crit" style="top:494px"><div class="q">
    <div class="ql">เครือข่ายคอมพิวเตอร์ที่เชื่อมต่อ</div><div class="ql">ทุกเครื่องเข้ากับ<span class="hl">อุปกรณ์ศูนย์กลาง</span></div>
    <div class="ql">เช่น <b>Hub</b> หรือ <b>Switch</b></div><div class="ql">เรียกว่า <b>Topology</b> รูปแบบใด?</div></div></div>`);
  const ql = [...qb.querySelectorAll('.ql')], hl = qb.querySelector('.hl');
  const pnl = add(el, `<div class="panel crit-box" style="left:220px;top:786px;width:640px;height:206px;border-radius:30px"></div>`);
  const qv = TOPO.view(el);
  const gQ = TOPO.DEF.star({ r: 235 });
  const hubTag = add(el, `<div class="abs" style="left:632px;top:812px;width:212px;text-align:center"><div class="crit" style="display:inline-block;font-weight:700;font-size:30px;line-height:1.3;color:#fff">อุปกรณ์ศูนย์กลาง<br><span style="color:#FFD23F;font-size:36px">Hub / Switch</span></div></div>`);
  const think = add(el, `<div class="abs" style="left:632px;top:820px;width:212px;text-align:center"><div class="crit" style="display:inline-block;font-weight:800;font-size:38px;line-height:1.25;color:#FFD23F">ให้เวลาคิด<br><span style="color:#fff;font-size:56px">5 วินาที</span></div></div>`);
  const cdBox = add(el, `<div class="abs crit" style="left:650px;top:794px;width:190px;height:190px"></div>`);
  const cd = NSP.buildCountdown(cdBox, 190);
  const tUp = add(el, `<div class="abs" style="left:632px;top:842px;width:212px;text-align:center"><div class="crit" style="display:inline-block;font-weight:800;font-size:48px;color:#FFD23F">หมดเวลา!</div></div>`);
  const sol = add(el, `<div class="abs" style="left:632px;top:842px;width:212px;text-align:center"><div class="crit" style="display:inline-block;font-weight:800;font-size:56px;color:#4ADE80">เฉลย!</div></div>`);
  const OPTS = [['ก', 'Bus Topology', 'แบบบัส'], ['ข', 'Star Topology', 'แบบดาว'], ['ค', 'Ring Topology', 'แบบวงแหวน'], ['ง', 'Mesh Topology', 'แบบตาข่าย']];
  const opts = OPTS.map(([l, en, th], i) => {
    const e = add(el, `<div class="qo crit" style="top:${1010 + i * 102}px"><div class="ov"></div><div class="b">${l}</div><div class="tx">${en}<small>${th}</small></div><div class="mk">${ICON.check('#22C55E', 50)}</div></div>`);
    return { e, ov: e.querySelector('.ov'), b: e.querySelector('.b'), tx: e.querySelector('.tx'), mk: e.querySelector('.mk') };
  });
  const OPT_AT = [b('oA'), b('oB'), b('oC'), b('oD')];
  const ansBan = add(el, `<div class="ctr" style="top:806px"><div class="memo crit" data-topo="star" style="font-size:48px;background:linear-gradient(180deg,#7BE3AD,#22C55E);color:#fff">${ICON.check('#fff', 50)} ข. STAR TOPOLOGY</div></div>`);
  const ansTh = add(el, `<div class="ctr" style="top:902px"><div class="chip pink crit" data-topo="star" style="font-size:42px">แบบดาว</div></div>`);
  const conf = NSP.buildConfetti(add(el, `<div class="abs" style="left:0;top:0"></div>`), 70, 540, 1160);
  // ---- SFX
  sfx('swoosh', Q0 + .05, .5); sfx('pop', Q0 + b('intro') + .3, .6);
  ql.forEach((_, i) => sfx('pop', Q0 + [b('q1'), b('q1') + 1.7, b('eg'), b('q2')][i], .35)); sfx('build', Q0 + b('q1') + .4, .4);
  OPT_AT.forEach(a => sfx('pop', Q0 + a, .7)); sfx('pop', Q0 + b('time') + .3, .6);
  for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', CD + i, .8);
  sfx('ding', CD + 5.0, .4);
  const RV = A0 + ba('b');
  sfx('success', RV, 1); sfx('sparkle', RV + .2, .8); sfx('ding', RV + 1.0, .6);
  function draw(t) {
    const u = t - Q0, ua = t - RV, uA = t - A0;
    const k = Math.round((t - CD) * 30);           // countdown frame index (0 … 149)
    tf(masc, { ...life(u, .2, 1e9, { from: .6, dy: 120, d: .7 }), y: life(u, .2, 1e9, { from: .6, dy: 120, d: .7 }).y + bob(u, 0, 8) });
    show(top1, u, b('intro'), 1e9, { from: .5 }); show(top2, u, b('intro') + .3, 1e9, { from: .4, el: true, d: .6 });
    { const p = P(u, b('q1') - .2, .5); tf(qb, { o: clamp(p * 3), s: lerp(.9, 1, E.out(p)), y: 30 * (1 - E.out(p)) }); }
    ql.forEach((e, i) => { const a = [b('q1'), b('q1') + 1.7, b('eg'), b('q2')][i]; e.style.opacity = clamp((u - a + .15) / .25) * .85 + .15 * (u > b('q1') - .2 ? 1 : 0); });
    hl.style.transform = `scale(${pulse(u, b('q1') + 2.4, .5, .08)})`; hl.style.display = 'inline-block';
    tf(pnl, life(u, b('q1') + .6, 1e9, { from: .7, dy: 30 }));
    const Sq = TOPO.state(gQ); Sq.type = ua >= 0 ? 'star' : 'central-q'; Sq.cam = { x: 540, y: 905, s: .3, tx: 420, ty: 889 };
    eachPC(Sq, (id, n) => { n.lab = false; n.ph = +id[2]; }); Sq.nodes.SW.lab = false;
    TOPO.drawIn(Sq, u, b('q1') + 1.0, .3, .12);
    Sq.o = clamp((u - b('q1') - .6) / .3);
    if (u > b('imagine') && u < b('time') + 1.5) Sq.links.forEach(l => { l.st = 'hot'; });
    Sq.packets = u > b('q1') + 2 ? TOPO.stream(['PC2', 'SW', 'PC4'], u, b('q1') + 2, 1e9, { T: 1.6, s: 2 }) : [];
    if (ua >= 0) setN(Sq, 'SW', { halo: .8, glow: true });
    qv.draw(Sq, t);
    show(hubTag, u, b('hub'), b('which'), { from: .4 });
    show(think, u, b('time') + .1, CD - Q0 - .05, { from: .4, el: true, d: .6 });
    // countdown: visible from its first frame, each numeral exactly 30 frames
    if (k >= 0 && k < 150) {
      NSP.drawCountdown(cd, k / 30, 5);
      tf(cdBox, { o: 1, s: 1 + .05 * Math.max(0, 1 - (k % 30) / 8) });
      cd.num.textContent = 5 - Math.floor(k / 30);
    } else tf(cdBox, { o: 0 });
    show(tUp, t - CD, 5.0, RV - CD - .6, { from: .4, el: true, d: .5 });
    show(sol, t - A0, ba('reveal'), 1e9, { from: .4, el: true, d: .5 });
    tf(sol.firstChild, { o: 1 - P(ua, 1.0, .3) });
    // options: identical until the reveal
    opts.forEach((o, i) => {
      const pp = P(u, OPT_AT[i], .45), l = { o: clamp(pp * 3), s: lerp(.85, 1, E.out(pp)), y: 0 };
      if (ua >= 0 && i === 1) {
        o.ov.style.opacity = clamp(ua / .25); o.tx.style.color = '#fff'; o.tx.querySelector('small').style.color = '#fff';
        o.b.style.background = 'radial-gradient(circle at 35% 30%,#9CF2C6,#15803D 75%)';
        tf(o.mk, { s: E.elastic(P(ua, .1, .8)), o: clamp(ua / .1) });
        o.e.style.boxShadow = `0 10px 0 #15803D,0 0 0 6px #fff,0 0 ${40 + 14 * Math.sin(ua * 3)}px 10px rgba(34,197,94,.5)`;
        tf(o.e, { ...l, s: l.s * (1 + .03 * E.out(P(ua, 0, .4)) - .03 * P(ua, .5, .4)) });
      } else {
        const dim = ua >= 0 ? .5 * E.out(P(ua, 0, .45)) : 0;
        tf(o.e, { ...l, o: l.o * (1 - dim) }); o.e.style.filter = dim ? `grayscale(${dim * 1.6})` : '';
      }
    });
    show(ansBan, uA, ba('name'), 1e9, { from: .3, el: true, d: .7 });
    show(ansTh, uA, ba('th'), 1e9, { from: .3, el: true, d: .6 });
    NSP.drawConfetti(conf, t, RV + .05, 2.6);
  }
  SC.push({ el, a: Q0, b: END, draw, dark: () => 0 });
}
