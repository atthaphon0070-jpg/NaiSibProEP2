// SCENE 2 — STORY / COMMON MISTAKES (02_story.mp3). No numbers 9 or 4.5 here: the mistakes are shown as "วัน + วัน".
SC.story = function (root) {
  const { h, tf, life, clamp, lerp, E, P, ICON, sfx } = NSP;
  const { T, A, pop } = EP22, B = BEATS.story, S = T.story0;
  const cam = h(`<div class="abs" style="inset:0;transform-origin:540px 860px"></div>`); root.appendChild(cam);
  // exam paper with a small drawing of the two officers at the wall
  const paper = h(`<div class="paper" style="left:200px;top:330px;width:680px;height:560px">
      <div style="position:absolute;left:34px;top:26px;font-weight:800;font-size:46px;color:#0B1A3A">ข้อสอบ คณิตศาสตร์</div>
      <div style="position:absolute;left:34px;top:92px;right:34px;height:6px;border-radius:3px;background:#E3E8F2"></div>
      <div style="position:absolute;left:34px;top:116px;font-weight:600;font-size:44px;color:#33415C">ช่วยกันทำ จะเสร็จในกี่วัน?</div>
      <div class="pdraw" style="position:absolute;left:0;top:190px;width:680px;height:360px;overflow:hidden"></div></div>`);
  cam.appendChild(paper);
  const pd = paper.querySelector('.pdraw');
  const mw = WORK.wall(pd, { x: 190, y: 60, w: 300, hgt: 170, roof: false });
  mw.el.querySelector('.wk-face').style.boxShadow = '0 0 0 4px #C9D3E6';
  const mA = WORK.officer({ paint: '#2F6BFF', scale: .5 }), mB = WORK.officer({ paint: '#22D3EE', flip: true, scale: .5 });
  [[mA, 130], [mB, 550]].forEach(([o, x]) => { o.el.style.left = (x - 120) + 'px'; o.el.style.top = (350 - 600) + 'px'; pd.appendChild(o.el); });
  const pq = A(pd, 340, 145, `<div class="big" style="font-size:110px;color:#FF3D7F;text-shadow:none">?</div>`);
  const lAdd = A(cam, 540, 990, `<div class="flt">วัน + วัน</div>`);
  const bigPlus = A(cam, 860, 900, `<div class="big" style="font-size:190px;color:#FF6B6B">+</div>`);
  const lAvg = A(cam, 540, 1130, `<div class="flt">(วัน + วัน) ÷ 2</div>`);
  const think = A(root, 540, 1320, `<div class="big wht" style="font-size:72px">แต่ลองคิดดูดี ๆ…</div>`);
  // hourglasses: alone (fast) vs together (slow — the paradox)
  const hgA = WORK.hourglass('#2F6BFF', 1.25), hgB = WORK.hourglass('#22D3EE', 1.25);
  const ha = A(cam, 345, 760, ''), hb = A(cam, 735, 760, '');
  ha.firstChild.appendChild(hgA.el); hgA.el.style.position = 'relative'; hb.firstChild.appendChild(hgB.el); hgB.el.style.position = 'relative';
  const la = A(cam, 345, 1010, `<div class="pill2 rate b" style="font-size:48px">ทำคนเดียว</div>`);
  const lb = A(cam, 735, 1010, `<div class="pill2 rate c" style="font-size:48px">ช่วยกัน</div>`);
  const solo = WORK.officer({ paint: '#2F6BFF', scale: .42 }), duoA = WORK.officer({ paint: '#2F6BFF', scale: .42 }), duoB = WORK.officer({ paint: '#22D3EE', flip: true, scale: .42 });
  [[solo, 345], [duoA, 680], [duoB, 790]].forEach(([o, x]) => { o.el.style.left = (x - 120) + 'px'; o.el.style.top = (1400 - 600) + 'px'; cam.appendChild(o.el); });
  const odd = A(root, 540, 400, `<div class="pill2" style="font-size:84px;color:#fff;background:linear-gradient(90deg,#E11D48,#EF4444);box-shadow:0 0 0 6px #fff,0 16px 30px rgba(0,0,0,.4);transform:rotate(-4deg)">แปลก!</div>`);
  const how = A(root, 540, 770, `<div class="big" style="font-size:360px;color:#FF3D7F;-webkit-text-stroke:5px #fff;paint-order:stroke fill">?</div>`);

  sfx('whoosh', S + B.paper, .6); sfx('pop', S + B.add + .4, .8); sfx('pop', S + B.plus, 1); sfx('pop', S + B.avg, .9);
  sfx('freeze', S + B.think, .8); sfx('whoosh', S + B.two - .1, .5); sfx('stamp', S + B.slow, .7); sfx('pop', S + B.how, 1);

  return function (t) {
    const u0 = t - S;
    // freeze frame on "คิดดูดี ๆ": scene time stops, picture desaturates, slow push-in keeps it alive
    const fr = u0 >= B.think && u0 < B.two, u = fr ? B.think : u0;
    const fz = clamp((u0 - B.think) / .2) * (1 - clamp((u0 - B.two + .2) / .2));
    cam.style.filter = fz > 0 ? `grayscale(${fz}) brightness(${1 - .25 * fz})` : '';
    cam.style.transform = `scale(${1 + .06 * E.inOut(P(u0, B.think, B.two - B.think))})`;
    const pin = E.out(P(u, B.paper, .6));
    tf(paper, { x: lerp(900, 0, pin), r: lerp(12, -1.5, pin) + Math.sin(u * 1.4) * .6, o: (1 - P(u0, B.two - .1, .35)) });
    mA.pose({ t: u, roll: 1, ph: 0, blink: WORK.blinkAt(u) }); mB.pose({ t: u, roll: 1, ph: 2, blink: WORK.blinkAt(u, 1) });
    tf(pq, { s: 1 + .1 * Math.sin(u * 5) });
    const fl = (a, b) => { const l = life(u, a, b, { from: .6, dy: 120, d: .7, out: .3 }); return { ...l, y: l.y - 18 * clamp((u - a) / 3) }; };
    tf(lAdd, fl(B.add + .4, B.two - .1)); tf(lAvg, fl(B.avg, B.two - .1));
    tf(bigPlus, { ...life(u, B.plus, B.avg, { from: .2, dy: 0, el: true, d: .7 }), r: Math.sin(u * 3) * 10 });
    tf(think, life(u0, B.think + .1, B.two, { from: .6, dy: 30, out: .2 }));
    const hl = (x) => life(u0, B.two + x, 1e9, { from: .5, dy: 80, d: .6 });
    const dim = 1 - .55 * P(u0, B.how, .4);
    [ha, hb, la, lb].forEach((e, i) => { const l = hl(i % 2 * .15); tf(e, { ...l, o: l.o * dim }); });
    [solo, duoA, duoB].forEach((o, i) => { const l = hl(.2 + i * .08); o.pose({ t: u0, roll: .6, ph: i * 1.3, blink: WORK.blinkAt(u0, i), o: l.o * dim, y: l.y }); });
    hgA.draw(1 - E.inOut(P(u0, B.slow0 + .2, 1.1)));
    hgB.draw(1 - .4 * E.inOut(P(u0, B.slow0 + .2, 2.4)));
    tf(odd, life(u0, B.slow, 1e9, { from: 2.2, dy: 0, d: .35, out: .3 }));
    const hw = life(u0, B.how, 1e9, { from: .2, dy: 0, d: .7, el: true });
    tf(how, { ...hw, s: hw.s * (1 + .05 * Math.sin(u0 * 6)), r: Math.sin(u0 * 2) * 4 });
  };
};
