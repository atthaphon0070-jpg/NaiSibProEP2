// SCENE 04 — QUICK SOLUTION METHOD (04_explanation.mp3)
// Step 1 on the Venn: 360 people, remove the 50 outside → 310 in at least one circle.
// Step 2: the formula and its substitution, with the result kept as "?" until the answer scene.
(function () {
  const b = B.expl;
  add('s4', `<div id="x-p1" class="col c crit" style="top:462px"><div class="pillH" style="font-size:36px;padding:10px 28px"><span style="background:#fff;color:#2F6BFF;border-radius:50%;width:48px;height:48px;display:grid;place-items:center">1</span>หาคนที่เรียนอย่างน้อย 1 วิชา</div></div>`);
  const vEl = add('s4', `<div id="x-venn" class="abs c" style="left:220px;top:500px"></div>`);
  const V = VENN.build(vEl);
  vEl.querySelectorAll('.vn-tagU,.vn-vout').forEach(e => e.classList.add('crit'));
  add('s4', `<div id="x-eq1" class="col c crit" style="top:1040px"><div class="eq" style="font-size:74px"><span class="nT">360</span><span class="op">−</span><span class="nO">50</span><span class="op">=</span><span class="nG" id="x-310">310</span></div></div>`);
  add('s4', `<div id="x-r1" class="abs c crit box grn" style="left:248px;top:1170px;width:584px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.25">
     <div style="font-size:36px;font-weight:700">เรียนอย่างน้อยหนึ่งวิชา</div><div style="font-size:56px;font-weight:800;color:#16A34A">= 310 คน</div></div>`);
  // step 2
  add('s4', `<div id="x-p2" class="col c crit" style="top:462px"><div class="pillH" style="font-size:36px;padding:10px 28px"><span style="background:#fff;color:#EE7FAA;border-radius:50%;width:48px;height:48px;display:grid;place-items:center">2</span>จำสูตรง่าย ๆ</div></div>`);
  add('s4', `<div id="x-chip" class="col c crit" style="top:548px"><div class="pillW" style="font-size:28px;padding:8px 22px;box-shadow:0 0 0 4px #22C55E,0 8px 18px rgba(34,197,94,.25)">ขั้นที่ 1 ได้แล้ว: อย่างน้อยหนึ่งวิชา = <b class="nG" style="font-size:38px">310</b></div></div>`);
  const fx = add('s4', `<div id="x-f" class="abs c crit box yel" style="left:248px;top:630px;width:584px;height:440px"></div>`);
  fx.innerHTML = `
    <div class="xf1" style="position:absolute;left:0;right:0;top:34px;text-align:center;font-size:46px;font-weight:800;color:#8A5A00">เรียนทั้งสองวิชา</div>
    <div class="xfe" style="position:absolute;left:0;right:0;top:100px;text-align:center;font-size:56px;font-weight:800;color:#7A8BA3">=</div>
    <div class="xf2" style="position:absolute;left:0;right:0;top:176px;text-align:center;font-size:44px;font-weight:800"><span class="nA">คอมพิวเตอร์</span><span class="op" style="color:#7A8BA3"> + </span><span class="nB">กฎหมาย</span></div>
    <div class="xf3" style="position:absolute;left:0;right:0;top:250px;text-align:center;font-size:40px;font-weight:800;line-height:1.3"><span style="color:#7A8BA3">−</span> <span class="nG">คนที่เรียนอย่างน้อย<br>หนึ่งวิชา</span></div>`;
  add('s4', `<div id="x-sub" class="col c crit" style="top:1108px"><div class="eq" style="font-size:66px;gap:10px"><span class="nA">230</span><span class="op">+</span><span class="nB">190</span><span class="op">−</span><span class="nG">310</span><span class="op">=</span><span id="x-q" style="display:inline-block;width:70px;height:80px;border-radius:20px;background:linear-gradient(180deg,#FFE27A,#F2B705);color:#142B53;text-align:center;line-height:80px;font-size:56px;box-shadow:0 0 0 5px #fff">?</span></div></div>`);
  add('s4', `<div id="x-mem" class="col c crit" style="top:1232px"><div class="pillW" style="font-size:40px;font-weight:800;padding:12px 32px;color:#142B53;box-shadow:0 0 0 5px #FFD23F,0 10px 22px rgba(200,150,0,.25)">${IC.bulb(42, '#F2B705')}จำสูตรนี้ไว้!</div></div>`);
  add('s4', `<div id="x-go" class="col c crit" style="top:1316px"><div class="pillH" style="font-size:40px;padding:12px 34px">ไปทำข้อสอบกัน!</div></div>`);

  const P2 = b.formula - .2;
  sfx('pop', X0 + .1, .7); sfx('pop', X0 + b.minus, .8); sfx('buzz', X0 + b.minus + .9, .3); sfx('whoosh', X0 + b.minus + 1.6, .4);
  sfx('pop', X0 + b.rem - .1, .7); sfx('success', X0 + b.rem + .1, .5); sfx('pop', X0 + b.atl, .8);
  sfx('whoosh', X0 + P2, .5); sfx('pop', X0 + b.formula + .1, .7); sfx('pop', X0 + b.both, .9); sfx('pop', X0 + b.sum, .9); sfx('pop', X0 + b.minus2, .9);
  sfx('type', X0 + b.minus2 + 1.6, .4); sfx('type', X0 + b.minus2 + 1.9, .4); sfx('type', X0 + b.minus2 + 2.2, .4);
  sfx('ding', X0 + b.remember + .1, .6); sfx('sparkle', X0 + b.go + .1, .5);

  window.drawExplain = function (t) {
    const u = t - X0, out1 = E.inOut(P(u, P2, .6));
    tf($('x-p1'), { ...life(u, .05, P2, { from: .4, dy: 30, out: .3 }) });
    // Venn: all 36 dots (360) → outside 50 highlighted → removed → union 310
    tf(vEl, { s: .74 * (1 - .2 * out1), o: clamp(u * 3) * (1 - out1), y: -60 * out1 });
    const gone = P(u, b.minus + 1.6, .7);
    V.set({
      t: u, u: 1, ca: 1, cb: 1, na: 1, nb: 1, tagU: 1,
      tagUtx: u < b.rem ? 'ผู้สมัครทั้งหมด 360 คน' : 'อยู่ในวงอย่างน้อย 1 วง = 310 คน',
      dots: { a: P(u, .15, .7), ab: P(u, .15, .7), b: P(u, .15, .7), out: P(u, .3, .4) * (1 - gone) },
      hiOut: P(u, b.minus, .4) * (1 - P(u, b.rem, .4)), vals: { out: P(u, b.minus + .2, .5) },
      hiUnion: P(u, b.rem, .5), hiAB: 0,
    });
    tf($('x-eq1'), { ...life(u, b.minus, P2, { from: .5, dy: 30, out: .3 }) });
    $('x-310').style.visibility = u >= b.rem ? 'visible' : 'hidden';
    $('x-310').style.display = 'inline-block'; $('x-310').style.transform = `scale(${lerp(1.6, 1, E.back(P(u, b.rem, .5)))})`;
    tf($('x-r1'), life(u, b.atl, P2, { from: .4, dy: 30, el: true, d: .8 }));
    // step 2
    tf($('x-p2'), life(u, b.formula, 1e9, { from: .4, dy: 30, el: true, d: .8 }));
    tf($('x-chip'), life(u, b.formula + .3, 1e9, { from: .4, dy: 20 }));
    const fl = life(u, b.both - .2, 1e9, { from: .6, dy: 40 });
    const glow = u > b.remember ? 1 : 0;
    tf(fx, { ...fl, s: fl.s * (1 + .02 * glow * Math.sin((u - b.remember) * 5)) });
    tf(fx.querySelector('.xf1'), life(u, b.both, 1e9, { from: .4, dy: 20 }));
    tf(fx.querySelector('.xfe'), life(u, b.both + .9, 1e9, { from: .3, dy: 0 }));
    tf(fx.querySelector('.xf2'), life(u, b.sum, 1e9, { from: .4, dy: 20 }));
    tf(fx.querySelector('.xf3'), life(u, b.minus2, 1e9, { from: .4, dy: 20 }));
    tf($('x-sub'), life(u, b.minus2 + 1.5, 1e9, { from: .5, dy: 30 }));
    tf($('x-q'), { s: 1 + .08 * Math.sin(u * 5), r: Math.sin(u * 3) * 6 });
    tf($('x-mem'), life(u, b.remember, 1e9, { from: .3, dy: 20, el: true }));
    tf($('x-go'), { ...life(u, b.go, 1e9, { from: .3, dy: 20, el: true }) });
  };
})();
