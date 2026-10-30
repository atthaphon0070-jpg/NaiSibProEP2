// SCENE 01 — THE NUMBER TRAP (01_hook.mp3). Beat times are hook-local seconds from beats.js.
(function () {
  const b = B.hook;
  // phase A — branded opening card, fully visible on frame 0
  add('s1', `<div id="h-venn" class="col c" style="top:450px">${IC.venn(150)}</div>`);
  add('s1', `<div id="h-title" class="col c crit" style="top:640px"><div class="title-sticker" style="font-size:74px;line-height:1.3;white-space:nowrap">เตรียมสอบนายสิบ</div></div>`);
  add('s1', `<div id="h-sub" class="col c crit" style="top:780px"><div class="pillH" style="font-size:36px;padding:12px 32px">วิชาคณิตศาสตร์ • เซตและการนับซ้ำ</div></div>`);
  add('s1', `<div id="h-trap" class="col c crit" style="top:890px"><div class="pillW" style="font-size:44px;font-weight:800;padding:14px 34px;color:#fff;background:linear-gradient(90deg,#EF4444,#F87171);box-shadow:0 12px 26px rgba(239,68,68,.35)">${IC.warn(46)}ข้อนี้คนชอบพลาด!</div></div>`);
  add('s1', `<div id="h-tease" class="abs c crit box" style="left:248px;top:1010px;width:584px;height:190px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.3">
     <div style="font-size:38px;font-weight:700">คนที่เรียน<span class="nA">สองวิชา</span>พร้อมกัน</div><div style="font-size:60px;font-weight:800;color:#142B53">มีกี่คน?</div></div>`);
  add('s1', `<div id="h-masA" class="mas" style="left:700px;top:1215px"><img src="../../shared/brand/mascot_pose.png" style="height:460px"></div>`);
  // phase B — 360 applicants, 230 + 190 = 420
  add('s1', `<div id="h-clb" class="col c crit" style="top:466px"><div class="pillW" style="font-size:38px;padding:10px 30px">มีผู้สมัครสอบทั้งหมด</div></div>`);
  add('s1', `<div id="h-cnt" class="col c crit" style="top:540px;align-items:baseline;gap:16px"><span class="big gN" id="h-cntn" style="font-size:150px">360</span><span style="font-size:56px;font-weight:800">คน</span></div>`);
  const crowd = add('s1', `<div id="h-crowd" class="abs" style="left:243px;top:722px;width:594px;height:260px"></div>`);
  const cIcons = [...Array(36)].map((_, i) => { const el = h(`<div class="abs c" style="left:${(i % 9) * 66 + 7}px;top:${Math.floor(i / 9) * 64}px">${IC.person(52, i % 3 === 0 ? '#5B8BFF' : i % 3 === 1 ? '#EE7FAA' : '#8EA2C0')}</div>`); crowd.appendChild(el); return el; });
  add('s1', `<div id="h-cA" class="abs c crit box" style="left:248px;top:1000px;width:292px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><div style="display:flex;align-items:center;gap:10px;font-size:32px;font-weight:700;color:#2F6BFF"><span class="ic" style="width:48px;height:48px;border-radius:14px;background:#2F6BFF;display:grid;place-items:center">${IC.laptop(34)}</span>คอมพิวเตอร์</div><div class="big nA" style="font-size:72px">230</div></div>`);
  add('s1', `<div id="h-cB" class="abs c crit box pk" style="left:552px;top:1000px;width:292px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px"><div style="display:flex;align-items:center;gap:10px;font-size:32px;font-weight:700;color:#E06A9A"><span class="ic" style="width:48px;height:48px;border-radius:14px;background:#EE7FAA;display:grid;place-items:center">${IC.scales(34)}</span>กฎหมาย</div><div class="big nB" style="font-size:72px">190</div></div>`);
  add('s1', `<div id="h-eq" class="col c crit" style="top:1196px"><div class="eq" style="font-size:72px"><span class="nA">230</span><span class="op">+</span><span class="nB">190</span><span class="op">=</span><span class="nR" id="h-420">420</span></div></div>`);
  add('s1', `<div id="h-wow" class="abs c" style="left:770px;top:1128px"><div class="big" style="font-size:70px;color:#EF4444;text-shadow:0 0 0 #fff,3px 3px 0 #fff">!?</div></div>`);
  // phase C — the mystery
  add('s1', `<div id="h-x" class="abs c crit box yel" style="left:248px;top:596px;width:584px;height:226px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px">
     <div style="display:flex;align-items:baseline;gap:18px;font-weight:800"><span style="font-size:46px">คนเกินมา</span><span class="big nR" style="font-size:112px" id="h-60">60</span><span style="font-size:46px">คน</span></div>
     <div style="font-size:54px;font-weight:800;color:#142B53">จากไหน?</div></div>`);
  add('s1', `<div id="h-dup" class="abs c crit box" style="left:248px;top:852px;width:584px;height:196px;display:flex;align-items:center;justify-content:center;gap:24px">
     <div style="position:relative;width:180px;height:120px">${IC.venn(120)}<div id="h-dupP" style="position:absolute;left:70px;top:36px">${IC.person(46, '#142B53')}</div></div>
     <div style="font-size:42px;font-weight:800;line-height:1.3">หรือว่า…<br><span style="color:#2F6BFF">นับคน</span><span style="color:#EF4444">ซ้ำ?</span></div></div>`);
  add('s1', `<div id="h-warn" class="abs c crit box red" style="left:248px;top:1080px;width:584px;height:164px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px">
     <div style="font-size:40px;font-weight:700">คิดผิดแค่ขั้นเดียว</div><div id="h-warn2" style="font-size:50px;font-weight:800;color:#EF4444">เสียคะแนนทันที!</div></div>`);
  add('s1', `<div id="h-go" class="col c crit" style="top:1282px"><div class="pillH" style="font-size:44px;padding:14px 40px">${IC.bulb(44)}มาดูวิธีคิดกัน!</div></div>`);
  add('s1', `<div id="h-masC" class="mas" style="left:-10px;top:1120px"><img src="../../shared/brand/mascot_presenter.png" style="height:420px;transform:scaleX(-1)"></div>`);

  const A_END = b.total - .15, B_END = b.extra - .1;
  sfx('pop', H0 + b.sub, .9); sfx('buzz', H0 + b.sub + .05, .35);
  sfx('whoosh', H0 + b.total - .1, .5); for (let i = 0; i < 12; i++) sfx('tick', H0 + b.total + .1 + i * .09, .25);
  for (let i = 0; i < 36; i += 3) sfx('pop', H0 + b.total + .25 + i * .035, .2);
  sfx('pop', H0 + b.sets, .8); sfx('pop', H0 + b.sets + .9, .8);
  sfx('pop', H0 + b.sum, .7); sfx('buzz', H0 + b.sum + .9, .5);
  sfx('whoosh', H0 + b.extra - .15, .5); sfx('stamp', H0 + b.extra + .1, .7);
  sfx('pop', H0 + b.dup, .8); sfx('pop', H0 + b.warn, .8); sfx('buzz', H0 + b.warn2, .5); sfx('sparkle', H0 + b.go, .6);

  window.drawHook = function (t) {
    const u = t - H0;
    // phase A: frame 0 already complete (no fade from black)
    const outA = E.in(P(u, A_END, .35));
    tf($('h-venn'), { y: bob(u, 0, 6) - 60 * outA, s: 1 + .03 * Math.sin(u * 2), o: 1 - outA, r: Math.sin(u * 1.2) * 3 });
    tf($('h-title'), { s: (1 + .02 * Math.sin(u * 2.4)) * (1 - .2 * outA), y: -80 * outA, o: 1 - outA });
    tf($('h-sub'), { s: 1 - .15 * outA, o: 1 - outA, y: -40 * outA });
    const tr = life(u, b.sub, A_END, { from: .3, dy: 30, el: true, d: .8 });
    tf($('h-trap'), { ...tr, r: Math.sin(u * 8) * 2 * P(u, b.sub, .2) * (1 - P(u, b.sub + 1.2, .4)) });
    tf($('h-tease'), { s: (1 + .015 * Math.sin(u * 3)) * (1 - .15 * outA), o: 1 - outA, y: 40 * outA });
    masDraw($('h-masA'), u, .25, A_END, { amp: 6 });
    // phase B
    tf($('h-clb'), life(u, b.total, B_END, { from: .5, dy: 30 }));
    tf($('h-cnt'), life(u, b.total + .1, B_END, { from: .5, dy: 40 }));
    $('h-cntn').textContent = countUp(u, b.total + .1, 1.1, M.GIVEN.total);
    cIcons.forEach((el, i) => { const l = life(u, b.total + .25 + i * .035, B_END + (i % 9) * .02, { from: 0, dy: 20, d: .4 }); tf(el, { ...l, y: l.y + bob(u, i, 3, 3) }); });
    tf($('h-cA'), life(u, b.sets, B_END, { from: .4, dy: 40, el: true, d: .8 }));
    tf($('h-cB'), life(u, b.sets + .9, B_END, { from: .4, dy: 40, el: true, d: .8 }));
    // equation: appears on "กลับได้ 420", then rides up for phase C
    const eqUp = E.inOut(P(u, b.extra - .2, .6));
    const eq = life(u, b.sum, b.go + .6, { from: .5, dy: 40 });
    tf($('h-eq'), { ...eq, y: eq.y + lerp(0, -726, eqUp), s: eq.s * lerp(1, .86, eqUp) });
    const sh = u > b.sum + .8 && u < b.sum + 1.4 ? Math.sin(u * 60) * 6 : 0;
    $('h-420').style.display = 'inline-block'; $('h-420').style.transform = `translateX(${sh}px) scale(${1 + .15 * Math.max(0, 1 - Math.abs(u - b.sum - .9) / .3)})`;
    tf($('h-wow'), { ...life(u, b.sum + .9, B_END, { from: .2, dy: 0, el: true }), r: 10 + Math.sin(u * 6) * 6 });
    // phase C
    const x = life(u, b.extra, 1e9, { from: .3, dy: 50, el: true, d: .9 });
    tf($('h-x'), { ...x, y: x.y + bob(u, 1, 3) });
    $('h-60').style.display = 'inline-block'; $('h-60').style.transform = `scale(${1 + .06 * Math.sin(u * 5)})`;
    tf($('h-dup'), life(u, b.dup, 1e9, { from: .4, dy: 40 }));
    const dp = u - b.dup; $('h-dupP').style.transform = `translateY(${-Math.abs(Math.sin(dp * 4)) * 10}px)`;
    $('h-dupP').style.filter = `drop-shadow(0 0 6px ${Math.sin(dp * 6) > 0 ? '#2F6BFF' : '#EE7FAA'})`;
    tf($('h-warn'), { ...life(u, b.warn, 1e9, { from: .4, dy: 40 }), x: u > b.warn2 && u < b.warn2 + .5 ? Math.sin(u * 50) * 6 : 0 });
    tf($('h-warn2'), life(u, b.warn2, 1e9, { from: .3, dy: 20, el: true }));
    tf($('h-go'), { ...life(u, b.go, 1e9, { from: .3, dy: 30, el: true }), s: life(u, b.go, 1e9, { from: .3, el: true }).s * (1 + .03 * Math.sin(u * 6)) });
    masDraw($('h-masC'), u, b.extra + .3, 1e9, { amp: 5, ph: 2 });
  };
})();
