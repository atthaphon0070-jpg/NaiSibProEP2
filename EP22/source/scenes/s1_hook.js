// SCENE 1 — HOOK (01_hook.mp3). Frame 0: keyword fully visible, officers + white wall, rollers already moving.
SC.hook = function (root) {
  const { h, tf, life, clamp, lerp, E, P, ICON, sfx } = NSP;
  const { T, A, C, pop, workSet, drawOfficers, LAY } = EP22, B = BEATS.hook, S = T.hook0;
  const cam = h(`<div class="abs" style="inset:0;transform-origin:540px 820px"></div>`); root.appendChild(cam);
  const ws = workSet(cam, { beacon: true });
  tf(ws.cal.el, { o: 0 });
  const ov = h(`<div class="abs" style="inset:0"></div>`); root.appendChild(ov);
  // keyword block (2 lines, 116 px) — the top-priority element at frame 0
  const kw = A(ov, 540, 446, `<div class="hk" style="font-size:116px">เตรียมสอบ<br>นายสิบ!</div>`);
  const must = A(cam, 540, 800, `<div class="pill2" style="font-size:64px;color:#fff;background:linear-gradient(90deg,#FF3D7F,#FF6B9A);box-shadow:0 14px 30px rgba(255,61,127,.5)">ข้อนี้ต้องรู้!</div>`);
  const l6 = A(ws.ov, LAY.lblL, LAY.dayY, `<div class="pill2 lbl b">6 วัน</div>`);
  const l3 = A(ws.ov, LAY.lblR, LAY.dayY, `<div class="pill2 lbl c">3 วัน</div>`);
  const w1 = A(ws.ov, LAY.lblL, LAY.rateY, `<div class="pill2 rate b">คนหนึ่ง</div>`);
  const w2 = A(ws.ov, LAY.lblR, LAY.rateY, `<div class="pill2 rate c">อีกคน</div>`);
  const q1 = A(ov, 540, 470, `<div class="big wht" style="font-size:80px">ช่วยกันทำ… <span class="yel">กี่วัน?</span></div>`);
  const qmark = A(cam, 540, 822, `<div class="big yel" style="font-size:300px;-webkit-text-stroke:4px #071330;paint-order:stroke fill">?</div>`);
  const wrong = A(ov, 540, 470, `<div class="pill2" style="font-size:60px;color:#fff;background:linear-gradient(90deg,#E11D48,#EF4444);box-shadow:0 0 0 6px #fff,0 16px 30px rgba(0,0,0,.4)">${ICON.cross('#fff', 56)}คนตอบผิดเยอะมาก!</div>`);
  const XS = [[120, 690], [960, 720], [150, 1010], [930, 1000], [260, 1500], [820, 1520], [540, 1620], [90, 1300], [990, 1290]]
    .map(([x, y], i) => ({ el: A(ov, x, y, `<div class="xmark" style="position:relative;transform:scale(${i % 3 ? .8 : 1})">${ICON.cross('#fff', 56)}</div>`), at: B.wrongW + i * .1 }));
  const watch = A(ov, 540, 362, `<div class="pill2 chipH" style="font-size:58px">${ICON.timer(62, '#FFD23F')}ดูให้จบ!</div>`);
  const few = A(ov, 540, 470, `<div class="big" style="font-size:76px">คิดได้ใน<span class="yel">ไม่กี่วินาที!</span></div>`);

  sfx('pop', S + B.d6, .9); sfx('pop', S + B.d3, .9); sfx('pop', S + B.must, .7);
  sfx('whoosh', S + B.help - .1, .5); sfx('pop', S + B.ki, .9);
  XS.forEach(x => sfx('buzz', S + x.at, .25)); sfx('whoosh', S + B.few - .1, .7); sfx('riser', S + B.think, .5);

  return function (t) {
    const u = t - S;
    // keyword: full size from frame 0 (no entrance), gentle pulse; shrinks to a header once the problem starts
    const k = E.inOut(P(u, B.p1 - .25, .5));
    tf(kw, { y: lerp(0, -82, k), s: lerp(1 + .025 * Math.sin(u * 4), .44, k), o: 1 - P(u, B.help - .3, .3) });
    tf(must, { ...pop(u, B.must, B.p1 - .25), r: -3 + Math.sin(u * 5) * 2 });
    tf(l6, pop(u, B.d6)); tf(l3, pop(u, B.d3));
    tf(w1, pop(u, B.p1 + .05, B.help)); tf(w2, pop(u, B.p2 + .05, B.help));
    const qq = life(u, B.help, B.wrong - .1, { from: .5, dy: 40, d: .5, out: .25 });
    tf(q1, qq);
    const qm = life(u, B.when, B.wrong + .4, { from: .2, dy: 0, d: .6, el: true, out: .3 });
    tf(qmark, { ...qm, s: qm.s * (1 + .08 * Math.sin((u - B.when) * 7)) * (1 + .15 * Math.max(0, 1 - Math.abs(u - B.ki) / .25)) });
    tf(wrong, { ...life(u, B.wrongW - .15, B.watch - .1, { from: .5, dy: 30, out: .25 }), x: u > B.wrongW && u < B.wrongW + .4 ? Math.sin(u * 60) * 8 * (1 - P(u, B.wrongW, .4)) : 0 });
    XS.forEach(x => tf(x.el, { ...life(u, x.at, B.watch, { from: .2, dy: 0, d: .4, el: true, out: .3 }), r: Math.sin(u * 3 + x.at) * 8 }));
    tf(watch, life(u, B.watch, 1e9, { from: .5, dy: 30, out: .3 }));
    tf(few, life(u, B.few, 1e9, { from: .6, dy: 40 }));
    // officers: rolling from frame 0, heads turn to the wall on "ช่วยกันทำ"
    drawOfficers(ws, u, { roll: 1, look: u > B.help ? -E.out(P(u, B.help, .4)) * (u < B.wrong ? 1 : 1 - P(u, B.wrong, .4)) : 0 });
    // push-in on the wall ("ไม่กี่วินาที")
    const pi = E.inOut(P(u, B.few - .2, 1.0));
    cam.style.transform = `scale(${1 + .22 * pi}) translateY(${60 * pi}px)`;
  };
};
