// SCENE 1 — HOOK (01_hook.mp3). Frame 0: "เตรียมสอบนายสิบตำรวจ" fully visible (no entrance), the PC case
// with a finger already on the power button, monitor in standby. Press → LED flickers once → everything
// goes dark (the keyword stays bright) → no sound / no picture → crime-scene tape + "ผู้ต้องหาคือใคร?".
SC.hook = function (root) {
  const { h, tf, life, clamp, lerp, E, P, sfx, ICON: NI } = NSP;
  const { T, A, layer, pop } = EP23, B = BEATS.hook, S = T.hook0, I = CASE.ICON;
  const cam = layer(root); cam.style.transformOrigin = '540px 1100px';
  // midground: PC + monitor on a desk
  cam.appendChild(h(`<div class="abs" style="left:60px;top:1300px;width:960px;height:44px;border-radius:12px;background:#7A5230;border:5px solid #0B1A3A;box-shadow:0 20px 40px rgba(0,0,0,.45)"></div>`));
  [110, 930].forEach(x => cam.appendChild(h(`<div class="abs" style="left:${x}px;top:1340px;width:40px;height:300px;background:#5E3E22;border:5px solid #0B1A3A"></div>`)));
  const pc = CASE.pc({ scale: 1 }); pc.el.style.left = '140px'; pc.el.style.top = '884px'; cam.appendChild(pc.el);
  const mon = CASE.monitor({ w: 400 }); mon.el.style.left = '470px'; mon.el.style.top = '930px'; cam.appendChild(mon.el);
  const BX = 140 + pc.button.x, BY = 884 + pc.button.y;
  // finger (pointing hand) touching the power button from frame 0
  const hand = h(`<div class="abs" style="left:${BX - 66}px;top:${BY - 8}px;width:150px;height:150px;transform-origin:66px 8px">${NI.hand(150)}</div>`); cam.appendChild(hand);
  const dimMid = h(`<div class="dim" style="opacity:0"></div>`); cam.appendChild(dimMid);
  const ov = layer(root, 5);
  // keyword block (2 lines, 118 px), the top-priority element at frame 0
  const kw = A(ov, 540, 468, `<div class="hk" style="font-size:110px">เตรียมสอบ<br>นายสิบตำรวจ</div>`);
  const must = A(ov, 540, 712, `<div class="pill2" style="font-size:62px;color:#fff;background:linear-gradient(90deg,#FF3D7F,#FF6B9A);box-shadow:0 0 0 6px #fff,0 14px 30px rgba(255,61,127,.5)">คดีนี้ต้องรู้!</div>`);
  const press = A(ov, 540, 712, `<div class="pill2 chipH" style="font-size:54px">${I.power(54, '#FFD23F')}กดปุ่มเปิดคอม…</div>`);
  const dark = A(ov, 540, 712, `<div class="pill2 chipR" style="font-size:60px">จอดำสนิท!</div>`);
  const ICN = [[I.speaker(150), 'ไม่มีเสียง', 360, B.noSnd], [I.screen(150), 'ไม่มีภาพ', 720, B.noPic]].map(([svg, tx, x, a]) => ({
    ic: A(ov, x, 720, `<div style="position:relative;width:180px;height:180px;border-radius:40px;background:rgba(19,42,87,.95);box-shadow:0 0 0 5px rgba(255,255,255,.85),0 14px 28px rgba(0,0,0,.4);display:grid;place-items:center">${svg}</div>`),
    x: A(ov, x + 62, 660, I.cross(84)), lb: A(ov, x, 860, `<div class="big wht" style="font-size:48px">${tx}</div>`), a,
  }));
  const nothing = A(ov, 540, 975, `<div class="pill2 chipH" style="font-size:52px">ไม่มีอะไรเลย…</div>`);
  // crime-scene tape sweeps diagonally across the midground (below the overlay text)
  const tp = CASE.tape('ห้ามเข้า ที่เกิดเหตุ', 1800); const tpw = h(`<div class="abs" style="left:-360px;top:1130px;transform-origin:900px 48px"></div>`); tpw.appendChild(tp); tp.style.position = 'relative'; cam.appendChild(tpw);
  const tp2 = CASE.tape('ห้ามเข้า ที่เกิดเหตุ', 1800); const tpw2 = h(`<div class="abs" style="left:-360px;top:1380px;transform-origin:900px 48px"></div>`); tpw2.appendChild(tp2); tp2.style.position = 'relative'; cam.appendChild(tpw2);
  const who = A(ov, 540, 735, `<div class="big" style="font-size:108px;color:#FF4D5E;-webkit-text-stroke:3px #fff;paint-order:stroke fill;text-shadow:0 8px 0 #071330,0 0 40px rgba(255,77,94,.5)">ผู้ต้องหา…</div>`);
  const whoQ = A(ov, 540, 870, `<div class="big" style="font-size:108px;color:#FF4D5E;-webkit-text-stroke:3px #fff;paint-order:stroke fill;text-shadow:0 8px 0 #071330,0 0 40px rgba(255,77,94,.5)">คือใคร?</div>`);
  // siren wash at the screen edges (short)
  const sirR = h(`<div class="abs" style="inset:0;pointer-events:none;background:radial-gradient(ellipse at 0% 50%,rgba(255,60,80,.55),rgba(255,60,80,0) 45%)"></div>`);
  const sirB = h(`<div class="abs" style="inset:0;pointer-events:none;background:radial-gradient(ellipse at 100% 50%,rgba(60,120,255,.55),rgba(60,120,255,0) 45%)"></div>`);
  root.appendChild(sirR); root.appendChild(sirB);

  sfx('pop', S + B.must, .8); sfx('click', S + B.press + .05, 1); sfx('click', S + B.btn, .6);
  sfx('flicker', S + B.open, .7); sfx('freeze', S + B.dark - .05, .6); sfx('drop', S + B.dark, .5);
  sfx('pop', S + B.noSnd, .8); sfx('buzz', S + B.noSnd + .35, .25); sfx('pop', S + B.noPic, .8); sfx('buzz', S + B.noPic + .3, .25);
  sfx('pop', S + B.nothing, .5); sfx('whoosh', S + B.who - .15, .7); sfx('siren', S + B.who, .35); sfx('stamp', S + B.whoQ, .5);

  return function (t) {
    const u = t - S;
    // keyword: full size from frame 0 (no entrance), gentle pulse, never dimmed
    tf(kw, { s: 1 + .004 * Math.sin(u * 4) });
    tf(must, { ...pop(u, B.must, B.press - .2), r: -2 + Math.sin(u * 5) * 1.5 });
    tf(press, pop(u, B.press, B.dark - .15));
    tf(dark, { ...life(u, B.dark, B.noSnd - .15, { from: .5, dy: 0, d: .4, out: .2 }), x: u > B.dark && u < B.dark + .3 ? Math.sin(u * 80) * 5 * (1 - P(u, B.dark, .3)) : 0 });
    ICN.forEach((c, i) => {
      const out = B.who - .25;
      tf(c.ic, life(u, c.a, out, { from: .3, dy: 30, d: .5, out: .25 }));
      tf(c.x, { ...life(u, c.a + .35, out, { from: .2, dy: 0, d: .5, el: true, out: .25 }), r: -10 });
      tf(c.lb, life(u, c.a + .1, out, { from: .5, dy: 20, out: .25 }));
    });
    tf(nothing, life(u, B.nothing, B.who - .25, { from: .5, dy: 30, out: .25 }));
    // press: finger pushes in, button sinks; LED flickers once on "เปิดคอม"
    const pd = NSP.pressDepth(u, [B.press + .05, B.btn]);
    hand.style.transform = `translate(${-6 * pd}px,${-10 * pd}px) rotate(-14deg)`;
    hand.style.opacity = 1 - P(u, B.dark + .4, .4);
    const fl = u > B.open && u < B.open + .45 ? (Math.sin((u - B.open) * 42) > 0 ? 1 : .15) * (1 - P(u, B.open + .25, .2)) : 0;
    pc.set({ led: fl, color: '#22C55E', press: pd });
    const isDark = u >= B.dark;
    mon.set({ stb: isDark ? 0 : .75 + .25 * fl, flash: fl * .25 }, u);
    dimMid.style.opacity = .5 * clamp((u - B.dark) / .2);
    // tape sweeps in on "ผู้ต้องหา"
    const k1 = E.out(P(u, B.who - .1, .45)), k2 = E.out(P(u, B.who + .15, .45));
    tpw.style.transform = `translateX(${lerp(-1900, 0, k1)}px) rotate(-9deg)`; tpw.style.opacity = k1 > 0 ? 1 : 0;
    tpw2.style.transform = `translateX(${lerp(1900, 0, k2)}px) rotate(7deg)`; tpw2.style.opacity = k2 > 0 ? 1 : 0;
    tf(who, { ...life(u, B.who, 1e9, { from: .4, dy: 30, d: .5 }), x: u > B.who && u < B.who + .3 ? Math.sin(u * 70) * 5 * (1 - P(u, B.who, .3)) : 0 });
    const wq = life(u, B.whoQ, 1e9, { from: .2, dy: 0, d: .6, el: true });
    tf(whoQ, { ...wq, s: wq.s * (1 + .03 * Math.sin(u * 6)) });
    // short siren wash (about 1.4 s), alternating red/blue
    const sv = clamp((u - B.who) / .15) * (1 - P(u, B.who + 1.2, .3));
    const ph = Math.sin((u - B.who) * 14);
    sirR.style.opacity = sv * Math.max(0, ph); sirB.style.opacity = sv * Math.max(0, -ph);
    // gentle push-in on the PC after the press, settles back for the tape
    const pi = E.inOut(P(u, B.press - .2, 1.2)) * (1 - E.inOut(P(u, B.who - .3, .8)));
    cam.style.transform = `scale(${1 + .05 * pi})`;
  };
};
