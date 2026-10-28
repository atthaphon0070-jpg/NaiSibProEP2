// SCENE 7 — PROMOTION (07_promotion.mp3). Approved CTA text only; real logo prominent here, ends on a short logo hold.
SC.promotion = function (root) {
  const { h, tf, life, clamp, lerp, E, P, ICON, sfx, BASE } = NSP;
  const { T, A, C, pop } = EP22, B = BEATS.promo, S = T.promo0;
  const who = A(root, 540, 360, `<div class="pill2 chipH" style="font-size:54px">ใครตอบถูก</div>`);
  // comment icon + bubble "2 วัน ✓"
  const cm = A(root, 540, 690, `<div style="position:relative;width:520px;height:330px">
      <svg width="240" height="220" viewBox="0 0 24 22" style="position:absolute;left:0;top:70px"><path d="M3 3h18a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10l-5 4v-4H3a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2z" fill="#fff"/><circle cx="7.5" cy="10" r="1.4" fill="#2F6BFF"/><circle cx="12" cy="10" r="1.4" fill="#2F6BFF"/><circle cx="16.5" cy="10" r="1.4" fill="#2F6BFF"/></svg>
      <div class="cmb" style="position:absolute;left:250px;top:0;padding:20px 34px;border-radius:40px 40px 40px 8px;background:#22C55E;color:#fff;font-weight:800;font-size:76px;display:flex;align-items:center;gap:12px;box-shadow:0 0 0 6px #fff,0 16px 30px rgba(0,0,0,.4);white-space:nowrap">2 วัน ${ICON.check('#fff', 64)}</div></div>`);
  const cmb = cm.querySelector('.cmb');
  const cmt = A(root, 540, 1000, `<div class="big wht" style="font-size:58px">คอมเมนต์ <span class="grn">2 วัน</span> มาเลย!</div>`);
  // practice more: math tiles
  const prac = A(root, 540, 460, `<div class="big wht" style="font-size:64px">อยากฝึกโจทย์<span class="yel">คณิต</span><br>แบบนี้อีกเยอะ ๆ</div>`);
  const OPS = ['+', '−', '×', '÷'].map((o, i) => A(root, 270 + i * 180, 700, `<div style="width:150px;height:150px;border-radius:36px;display:grid;place-items:center;font-weight:800;font-size:96px;line-height:1;color:#fff;background:${['#2F6BFF', '#22D3EE', '#FFD23F', '#FF3D7F'][i]};box-shadow:0 0 0 6px #fff,0 16px 30px rgba(0,0,0,.4)">${o === '+' ? '<span style="font-size:110px">+</span>' : o}</div>`));
  // real logo + name
  const logo = A(root, 540, 660, `<img src="${BASE}brand/logo.png" style="width:440px;display:block;filter:drop-shadow(0 16px 30px rgba(0,0,0,.5))">`);
  const name = A(root, 540, 960, `<div class="big" style="font-size:62px">NaiSibPro <span class="yel">นายสิบโปร</span></div>`);
  const ex = A(root, 540, 1050, `<div class="big wht" style="font-size:54px">ข้อสอบมากกว่า</div>`);
  const cnt = A(root, 540, 1190, `<div class="res" style="font-size:128px"><span class="cn">0</span> <span style="font-size:64px;color:#fff">ข้อ</span></div>`);
  const cn = cnt.querySelector('.cn');
  const wk = A(root, 540, 1350, `<div class="pill2 chipH" style="font-size:52px">${ICON.cal(56, '#FFD23F')}อัปเดตทุกสัปดาห์</div>`);
  const fol = A(root, 540, 1210, `<div class="pill2" style="font-size:66px;color:#fff;padding:20px 54px;background:linear-gradient(90deg,#FF3D7F,#FF6B9A);box-shadow:0 0 0 6px #fff,0 18px 36px rgba(255,61,127,.5)">${ICON.heart('#fff')}กดติดตาม</div>`);
  const hand = A(root, 760, 1300, ICON.hand(110));
  const bye = A(root, 540, 1360, `<div class="big wht" style="font-size:56px">แล้วเจอกันข้อต่อไป!</div>`);
  const oA = WORK.officer({ paint: C.blue, scale: .8 }), oB = WORK.officer({ paint: C.cyan, flip: true, scale: .8 });
  [[oA, 260], [oB, 820]].forEach(([o, x]) => { o.el.style.left = (x - 120) + 'px'; o.el.style.top = (1880 - 600) + 'px'; root.appendChild(o.el); });
  const conf = h(`<div class="abs" style="inset:0"></div>`); root.appendChild(conf);
  const cf = NSP.buildConfetti(conf, 60, 540, 1100);

  sfx('pop', S + B.who, .7); sfx('pop', S + B.comment, .8); sfx('ding', S + B.two, .8); sfx('whoosh', S + B.practice - .1, .5);
  for (let i = 0; i < 4; i++) sfx('pop', S + B.practice + .2 + i * .12, .5);
  sfx('whoosh', S + B.goto, .6); sfx('sparkle', S + B.brand + .2, .8);
  for (let i = 0; i < 6; i++) sfx('coin', S + B.exams + .2 + i * .15, .35); sfx('ding', S + B.tenk + .3, .7);
  sfx('pop', S + B.weekly, .8); sfx('pop', S + B.follow, 1); sfx('click', S + B.follow + .6, .9); sfx('stamp', S + B.follow + .9, .3);
  sfx('sparkle', S + B.bye + .2, .8); sfx('success', S + B.bye + .1, .6);

  return function (t) {
    const u = t - S;
    tf(who, pop(u, B.who, B.practice - .2));
    tf(cm, life(u, B.comment, B.practice - .2, { from: .4, dy: 60, out: .25 }));
    tf(cmb, { ...life(u, B.two, 1e9, { from: .2, dy: 0, d: .7, el: true }), r: -4 + Math.sin(u * 4) * 2 });
    tf(cmt, life(u, B.comment + .2, B.practice - .2, { from: .6, dy: 30, out: .25 }));
    tf(prac, life(u, B.practice, B.goto - .15, { from: .6, dy: 30, out: .25 }));
    OPS.forEach((o, i) => tf(o, { ...life(u, B.practice + .2 + i * .12, B.goto - .15, { from: .2, dy: 60, el: true, d: .7, out: .25 }), r: Math.sin(u * 3 + i) * 8 }));
    // logo: enters centre on "นายสิบโปร", lifts as the stats arrive, returns big for the end hold
    const lgIn = life(u, B.goto, 1e9, { from: .2, dy: 200, d: .9, el: true });
    const up = E.inOut(P(u, B.exams - .1, .5)) * (1 - E.inOut(P(u, B.bye - .1, .6)));
    tf(logo, { ...lgIn, y: lgIn.y - 175 * up + Math.sin(u * 2) * 6, s: lgIn.s * lerp(1, .55, up) });
    tf(name, { ...life(u, B.brand, 1e9, { from: .5, dy: 40 }), y: -195 * up });
    const statsOut = 1 - P(u, B.follow - .2, .3);
    const exL = life(u, B.exams, 1e9, { from: .5, dy: 30 }); tf(ex, { ...exL, o: exL.o * statsOut, y: exL.y - 200 });
    const cL = life(u, B.exams + .1, 1e9, { from: .5, dy: 30 }); tf(cnt, { ...cL, o: cL.o * statsOut, y: cL.y - 200 });
    cn.textContent = (Math.round(10000 * E.out(P(u, B.exams + .2, B.tenk + .3 - B.exams - .2)) / 100) * 100).toLocaleString('en-US') + (u >= B.tenk + .3 ? '+' : '');
    const wL = life(u, B.weekly, 1e9, { from: .4, dy: 30 }); tf(wk, { ...wL, o: wL.o * statsOut, y: wL.y - 210 });
    const fL = life(u, B.follow, B.bye + .2, { from: .3, dy: 0, d: .6, el: true, out: .3 });
    tf(fol, { ...fL, s: fL.s * (1 + .04 * Math.sin(u * 6)) * (1 - .08 * NSP.pressDepth(u, [B.follow + .6])) });
    hand.style.transform = `translate(${0}px,${NSP.bob(u, 0, 10, 6)}px) scale(${1 - .15 * NSP.pressDepth(u, [B.follow + .6])})`;
    hand.style.opacity = clamp((u - B.follow - .2) / .2) * (1 - P(u, B.bye, .3));
    tf(bye, life(u, B.bye, 1e9, { from: .5, dy: 30 }));
    // officers walk in for the follow beat and tap rollers together
    const oin = E.out(P(u, B.follow - .4, .7)), tap = E.inOut(P(u, B.follow + .7, .35)) * (1 - E.inOut(P(u, B.bye + .6, .5)));
    oA.pose({ t, roll: .4 * (1 - tap), tap, blink: WORK.blinkAt(t), x: lerp(-420, 200 * tap, oin), o: oin });
    oB.pose({ t, roll: .4 * (1 - tap), ph: 2, tap, blink: WORK.blinkAt(t, 1), x: lerp(420, -200 * tap, oin), o: oin });
    NSP.drawConfetti(cf, t, S + B.bye + .1, 2.4);
  };
};
