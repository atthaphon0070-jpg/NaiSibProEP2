// SCENE 4 — EXPLANATION (04_explanation.mp3): 4 days & 12 days → 12 blocks → 3 + 1 = 4 blocks/day → 12 ÷ 4 = 3 days.
SC.explanation = function (root) {
  const { h, tf, life, clamp, lerp, E, P, sfx } = NSP;
  const { T, A, pop, LAY, workSet, drawOfficers, drawCalendar, gridSfx } = EP22, B = BEATS.expl, S = T.expl0;
  const cam = h(`<div class="abs" style="inset:0;transform-origin:540px 820px"></div>`); root.appendChild(cam);
  const ws = workSet(cam, { rows: 3, cols: 4, rates: [3, 1] });
  const g = ws.grid;
  const DAYS = [B.twelve, B.twelve + (B.done - B.twelve) / 3, B.twelve + 2 * (B.done - B.twelve) / 3, B.done - .05];
  const hdr1 = A(root, 540, 346, `<div class="pill2 chipH">ลองดูตัวอย่าง</div>`);
  const hdr2 = A(root, 540, 346, `<div class="pill2 chipH">แบ่งกำแพงเป็น <span class="yel">12 ช่อง</span></div>`);
  const hdr3 = A(root, 540, 346, `<div class="pill2 chipH">จำง่าย ๆ ว่า…</div>`);
  const d4 = A(ws.ov, LAY.lblL, LAY.dayY, `<div class="pill2 lbl b">4 วัน</div>`);
  const d12 = A(ws.ov, LAY.lblR, LAY.dayY, `<div class="pill2 lbl c">12 วัน</div>`);
  const r3 = A(ws.ov, LAY.lblL, LAY.rateY, `<div class="pill2 rate b">3 ช่อง/วัน</div>`);
  const r1 = A(ws.ov, LAY.lblR, LAY.rateY, `<div class="pill2 rate c">1 ช่อง/วัน</div>`);
  // equations, token by token
  const eq1 = A(root, 540, 432, `<div class="eq"><span class="t blu">3</span><span class="t">+ <span class="cya">1</span></span> <span class="t">=</span> <span class="t yel">4 ช่อง/วัน</span></div>`);
  const eq2 = A(root, 540, 522, `<div class="eq" style="font-size:66px"><span class="t">12</span> <span class="t">÷ 4</span> <span class="t">=</span> <span class="t yel">3</span></div>`);
  const e1 = [...eq1.querySelectorAll('.t')], e2 = [...eq2.querySelectorAll('.t')];
  const E1 = [B.together, B.together + .45, B.perDay + .1, B.r4], E2 = [B.twelve, B.div4, B.done - .1, B.done];
  const resB = A(root, 540, 822, `<div class="resbox" style="position:relative;width:640px;height:300px"></div>`);
  const res = A(root, 540, 822, `<div class="res">3 วัน</div>`);
  const conf = h(`<div class="abs" style="inset:0"></div>`); root.appendChild(conf);
  const cf = NSP.buildConfetti(conf, 46, 540, 820);
  const mBox = A(root, 540, 822, `<div class="resbox" style="position:relative;width:760px;height:380px"></div>`);
  const m1 = A(root, 540, 745, `<div class="mph" style="font-size:120px">บวกงาน…</div>`);
  const m2 = A(root, 540, 905, `<div class="mph" style="font-size:104px">ไม่ใช่บวกวัน!</div>`);

  sfx('pop', S + B.ex, .6); sfx('pop', S + B.d4, .9); sfx('pop', S + B.d12, .9); sfx('whoosh', S + B.g12 - .2, .5);
  for (let i = 0; i < 6; i++) sfx('click', S + B.g12 + i * .14, .35);
  sfx('pop', S + B.r3, .9); sfx('pop', S + B.r1, .9); E1.forEach(a => sfx('pop', S + a, .6)); E2.slice(0, 3).forEach(a => sfx('pop', S + a, .6));
  gridSfx(g, DAYS.map(d => S + d));
  sfx('ding', S + B.done, 1); sfx('success', S + B.done + .05, .9); sfx('sparkle', S + B.done + .2, .7);
  sfx('whoosh', S + B.memo, .4); sfx('pop', S + B.addWork, 1); sfx('pop', S + B.notDays, 1); sfx('sparkle', S + B.notDays + .3, .6);

  return function (t) {
    const u = t - S;
    tf(hdr1, pop(u, B.ex, B.split)); tf(hdr2, pop(u, B.g12, B.together - .2)); tf(hdr3, pop(u, B.memo, 1e9));
    tf(d4, pop(u, B.d4)); tf(d12, pop(u, B.d12));
    const pre = u < B.twelve;
    tf(r3, pop(u, B.r3)); tf(r1, pop(u, B.r1));
    const eqOut = 1 - P(u, B.memo - .1, .3);
    e1.forEach((e, i) => tf(e, { ...life(u, E1[i], 1e9, { from: .3, dy: 30, d: .45 }), o: life(u, E1[i], 1e9, { d: .45 }).o * eqOut }));
    e2.forEach((e, i) => tf(e, { ...life(u, E2[i], 1e9, { from: .3, dy: 30, d: .45 }), o: life(u, E2[i], 1e9, { d: .45 }).o * eqOut }));
    // grid: lines draw on "สิบสองช่อง", previews glow on the spoken rates, fill day by day
    const day = WORK.dayAt(u, DAYS);
    g.draw({ lines: P(u, B.g12 - .1, 1.1), day, preview: pre ? [E.out(P(u, B.r3, .3)), E.out(P(u, B.r1, .3))] : [0, 0], glow: u });
    drawCalendar(ws, u, DAYS, B.twelve - .25);
    const painting = u > B.twelve && u < B.done;
    drawOfficers(ws, u, { roll: painting ? 1 : .45, look: -E.out(P(u, B.split, .4)) * (1 - P(u, B.memo, .4)) });
    const rl = life(u, B.done, B.memo + .2, { from: .2, dy: 0, d: .7, el: true, out: .3 });
    tf(res, { ...rl, s: rl.s * (1 + .03 * Math.sin(u * 5)) }); tf(resB, { ...rl, s: 1 });
    NSP.drawConfetti(cf, t, S + B.done + .05, 2.2);
    tf(mBox, { o: E.out(P(u, B.addWork - .2, .4)), s: 1 });
    const k1 = life(u, B.addWork, 1e9, { from: .3, dy: 40, el: true, d: .8 }), k2 = life(u, B.notDays, 1e9, { from: .3, dy: 40, el: true, d: .8 });
    tf(m1, { ...k1, s: k1.s * (1 + .025 * Math.sin(u * 4)) }); tf(m2, { ...k2, s: k2.s * (1 + .025 * Math.sin(u * 4 + 1)) });
    cam.style.transform = `scale(${1 + .03 * E.inOut(P(u, B.twelve - .3, 1)) - .03 * E.inOut(P(u, B.memo, 1))})`;
  };
};
