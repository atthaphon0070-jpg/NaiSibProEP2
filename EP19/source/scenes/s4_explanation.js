// SCENE 4 — EXPLANATION (04_explanation.mp3). Two A4 pages (210 × 297): external letter (Electric Blue) and memo (Cyan).
// The camera focuses on each page in turn, then both return side by side for "ใหญ่อยู่กลาง... เล็กอยู่ซ้าย!".
// Diagram scale: page 350 px = 21 cm (16.67 px/cm); emblems and the 2.5 cm gap are drawn at 2× that scale for
// phone legibility, identically on both pages, so the 3 cm emblem is exactly twice the height of the 1.5 cm one.
(function () {
  const { clamp, lerp, E, P, tf, life, bob, h, sfx } = NSP;
  const X = EP19, K = 'expl', A = X.S(K);
  const b = i => X.B(K, i), w = (i, s) => X.W(K, i, s);
  const el = document.getElementById('s4');
  const PW = 350, PH = Math.round(PW * 297 / 210), CMP = PW / 21 * 2;      // 33.3 px per cm in the emblem zone
  const GL = 3 * CMP, GS = 1.5 * CMP, GAP = 2.5 * CMP;                     // 100 px, 50 px, 83 px
  const FIN_L = { x: PW / 2, y: GAP + GL / 2 }, FIN_S = { x: 18 + GS * X.GR / 2, y: 24 + GS / 2 };
  el.innerHTML = `
    <div id="x-hdr" class="row" style="top:318px"><div class="big kt" style="font-size:70px">มาจับคู่ให้<span class="yl">ชัด</span>กัน!</div></div>
    <div id="x-sub" class="row" style="top:336px"><div class="pill2 p-nv kt" style="font-size:44px">หนังสือภายใน</div></div>
    <div id="x-pl" class="abs" style="left:0;top:0;width:${PW}px;height:${PH}px;transform-origin:0 0"></div>
    <div id="x-pr" class="abs" style="left:0;top:0;width:${PW}px;height:${PH}px;transform-origin:0 0"></div>
    <div id="x-ll" class="abs" style="left:0;top:0;width:0;height:0"><div class="pill2 p-eb kt" style="position:absolute;left:0;top:0;translate:-50% 0;font-size:42px">หนังสือภายนอก</div></div>
    <div id="x-lr" class="abs" style="left:0;top:0;width:0;height:0"><div class="pill2 p-cy kt" style="position:absolute;left:0;top:0;translate:-50% 0;font-size:42px">บันทึกข้อความ</div></div>
    <div id="x-rowB" class="row" style="top:1190px;gap:22px"><div id="x-b1" class="pill2 p-eb kt" style="font-size:50px">กึ่งกลาง</div><div id="x-b2" class="pill2 p-eb kt" style="font-size:50px">ด้านบน</div></div>
    <div id="x-rowC" class="row" style="top:1190px"><div class="pill2 p-cy kt" style="font-size:50px">มุมบนซ้าย</div></div>
    <div id="x-easy" class="row" style="top:1032px"><div class="pill2 p-wh kt" style="font-size:44px">จำง่าย ๆ ว่า...</div></div>
    <div id="x-m1" class="row" style="top:1112px;gap:6px"><span class="big yl kt x-w" style="font-size:104px">ใหญ่</span><span class="big yl kt x-w" style="font-size:104px">อยู่</span><span class="big yl kt x-w" style="font-size:104px;position:relative">กลาง<i class="x-u" style="position:absolute;left:4px;right:4px;bottom:-4px;height:12px;border-radius:6px;background:var(--eb);transform-origin:0 50%"></i></span></div>
    <div id="x-m2" class="row" style="top:1258px;gap:6px"><span class="big yl kt x-w" style="font-size:104px">เล็ก</span><span class="big yl kt x-w" style="font-size:104px">อยู่</span><span class="big yl kt x-w" style="font-size:104px;position:relative">ซ้าย!<i class="x-u" style="position:absolute;left:4px;right:28px;bottom:-4px;height:12px;border-radius:6px;background:var(--cy);transform-origin:0 50%"></i></span></div>`;
  const q = s => el.querySelector(s);
  // ---- left page: external letter ----
  const pl = X.a4(PW, { top: .42, rows: 10 }); q('#x-pl').appendChild(pl);
  pl.insertAdjacentHTML('beforeend', `
    <div id="x-top" class="abs" style="left:-4px;top:-5px;width:${PW + 8}px;height:10px;border-radius:5px;background:var(--yl);box-shadow:0 0 18px 4px rgba(255,210,63,.8)"></div>
    <div id="x-guide" class="abs" style="left:${PW / 2 - 2}px;top:0;width:4px;height:${PH}px;background:repeating-linear-gradient(180deg,#14B8D6 0 14px,transparent 14px 24px);transform-origin:50% 0"></div>
    <svg id="x-dim" class="abs" style="left:0;top:0;overflow:visible" width="${PW}" height="${PH}">
      <line x1="${PW / 2 - GL * X.GR / 2 - 6}" y1="${GAP}" x2="${PW / 2 - GL * X.GR / 2 - 46}" y2="${GAP}" stroke="#E11D48" stroke-width="2.5" stroke-dasharray="5 4"/>
      <line id="x-dl" x1="${PW / 2 - GL * X.GR / 2 - 34}" y1="3" x2="${PW / 2 - GL * X.GR / 2 - 34}" y2="${GAP - 3}" stroke="#E11D48" stroke-width="4"/>
      <path id="x-da1" d="M${PW / 2 - GL * X.GR / 2 - 44} 14 L${PW / 2 - GL * X.GR / 2 - 34} 2 L${PW / 2 - GL * X.GR / 2 - 24} 14" fill="none" stroke="#E11D48" stroke-width="4" stroke-linejoin="round"/>
      <path id="x-da2" d="M${PW / 2 - GL * X.GR / 2 - 44} ${GAP - 14} L${PW / 2 - GL * X.GR / 2 - 34} ${GAP - 2} L${PW / 2 - GL * X.GR / 2 - 24} ${GAP - 14}" fill="none" stroke="#E11D48" stroke-width="4" stroke-linejoin="round"/>
    </svg>
    <div id="x-dlab" class="abs" style="left:${PW / 2 - GL * X.GR / 2 - 48}px;top:${GAP / 2}px;width:0;height:0"><div class="pill2 p-rd kt" style="position:absolute;right:0;top:0;translate:0 -50%;font-size:34px;padding:6px 16px">≈ 2.5 ซม.</div></div>
    <div id="x-gl" class="abs" style="left:0;top:0;width:${GL * X.GR}px;height:${GL}px">${X.gar(GL)}
      <div class="x-tag abs" style="left:${GL * X.GR + 14}px;top:${GL / 2}px;translate:0 -50%"><div class="pill2 p-yl kt" style="font-size:36px;padding:6px 18px">3 ซม.</div></div></div>`);
  // ---- right page: memo (บันทึกข้อความ) ----
  const pr = X.a4(PW, { top: .3, rows: 13 }); q('#x-pr').appendChild(pr);
  pr.insertAdjacentHTML('beforeend', `
    <svg id="x-corner" class="abs" style="left:4px;top:4px;overflow:visible" width="120" height="120"><path d="M6 110 L6 6 L110 6" fill="none" stroke="#22D3EE" stroke-width="10" stroke-linecap="round" style="filter:drop-shadow(0 0 10px #22D3EE)"/></svg>
    <div id="x-mt" class="ttl" style="left:${18 + GS * X.GR + 9}px;top:${FIN_S.y}px;translate:0 -50%;font-size:42px">บันทึกข้อความ</div>
    <div id="x-mf" class="abs" style="left:0;top:0">${[[22, 92, 300], [22, 122, 160], [190, 122, 132], [22, 152, 300]].map(([x, y, ww]) => `<div class="ln" style="position:absolute;left:${x}px;top:${y}px;width:${ww}px;height:8px;border-radius:4px;background:#C9D2E1"></div>`).join('')}</div>
    <div id="x-gs" class="abs" style="left:0;top:0;width:${GS * X.GR}px;height:${GS}px">${X.gar(GS)}
      <div class="x-tag abs" style="left:${GS * X.GR + 14}px;top:${GS / 2}px;translate:0 -50%"><div class="pill2 p-yl kt" style="font-size:36px;padding:6px 18px">1.5 ซม.</div></div></div>`);
  const tags = [...el.querySelectorAll('.x-tag')], words = [...el.querySelectorAll('.x-w')], unders = [...el.querySelectorAll('.x-u')];

  const T = {
    hdr: b(0), ext: b(1), fB: b(2) - .3, fly1: b(2), cm3: w(2, 'สาม'), mid: b(3), snap1: w(3, 'กึ่งกลาง'), top: b(4), dim: b(5), d25: w(5, 'สองจุดห้า'),
    fC: b(6) - .15, memo: w(6, 'บันทึกข้อความ'), fly2: b(7), cm15: w(7, 'หนึ่ง'), corner: b(8), snap2: w(8, 'มุมบนซ้าย'), fD: b(9) - .1, easy: b(9), m1: b(10), m2: b(11),
  };
  const wt = [w(10, 'ใหญ่'), w(10, 'อยู่'), w(10, 'กลาง'), w(11, 'เล็ก'), w(11, 'อยู่'), w(11, 'ซ้าย')];
  sfx('page', A + .05, .8); sfx('page', A + .25, .6); sfx('pop', T.ext + .05, .7);
  sfx('swoosh', T.fB, .45); sfx('whoosh', T.fly1, .7); sfx('pop', T.cm3 + .05, .6);
  sfx('zip', T.mid + .05, .5); sfx('click', T.snap1 + .3, 1); sfx('pop', T.mid + .1, .5); sfx('pop', T.top + .1, .5); sfx('sparkle', T.top + .1, .35);
  sfx('zip', T.dim + .1, .5); sfx('pop', T.d25 + .05, .7);
  sfx('swoosh', T.fC, .45); sfx('pop', b(6) + .05, .6); sfx('pop', T.memo + .05, .7); sfx('whoosh', T.fly2, .7); sfx('pop', T.cm15 + .05, .6);
  sfx('pop', T.corner + .05, .5); sfx('click', T.snap2 + .3, 1); sfx('pop', T.snap2 + .4, .6);
  sfx('swoosh', T.fD, .45); sfx('pop', T.easy + .05, .6); wt.forEach(a => sfx('pop', a + .03, .5)); sfx('sparkle', T.m1 + .2, .5); sfx('sparkle', T.m2 + .2, .6);

  const mixp = (p, o, k) => ({ x: lerp(p.x, o.x, k), y: lerp(p.y, o.y, k), s: lerp(p.s, o.s, k) });
  const SIDE = { L: { x: 160, y: 520, s: 1 }, R: { x: 540, y: 520, s: 1 } }, FOC = { x: 540 - PW * 1.3 / 2, y: 520, s: 1.3 };
  function pose(which, t) {
    const kB = E.inOut(P(t, T.fB, .7)), kC = E.inOut(P(t, T.fC, .7)), kD = E.inOut(P(t, T.fD, .8));
    let p = SIDE[which];
    if (which === 'L') { p = mixp(p, FOC, kB); p = mixp(p, { x: -620, y: 520, s: 1.3 }, kC); p = mixp(p, SIDE.L, kD); }
    else { p = mixp(p, { x: 1160, y: 520, s: 1.3 }, kB); p = mixp(p, FOC, kC); p = mixp(p, SIDE.R, kD); }
    const enter = E.out(P(t, A + (which === 'L' ? 0 : .15), .7));
    return { x: p.x, y: p.y + (1 - enter) * 900, s: p.s, o: clamp(enter * 2) };
  }
  // garuda flight inside its page: hover after flying in, then snap (≤ 4 % overshoot) to the regulation spot
  function gpose(t, fly, land, snapAt, hover, fin, from) {
    const f = E.out(P(t, fly, land - fly + .15)), k = X.snap(P(t, snapAt, .5));
    const hv = { x: lerp(from.x, hover.x, f) + Math.sin((t - fly) * 2.2) * 10 * (1 - k), y: lerp(from.y, hover.y, f) + Math.sin((t - fly) * 3) * 8 * (1 - k) };
    return { x: lerp(hv.x, fin.x, k), y: lerp(hv.y, fin.y, k), r: (1 - f) * -25 + Math.sin((t - fly) * 2.6) * 5 * (1 - k), o: clamp((t - fly) / .12) };
  }
  function draw(t) {
    const u = t - A;
    tf(q('#x-hdr'), life(t, T.hdr, T.fB + .2, { from: .5, dy: 30, d: .45, out: .25 }));
    const L = pose('L', t), R = pose('R', t);
    tf(q('#x-pl'), { x: L.x, y: L.y + bob(u, 0, 3, 1.2), s: L.s, o: L.o });
    tf(q('#x-pr'), { x: R.x, y: R.y + bob(u, 1, 3, 1.2), s: R.s, o: R.o });
    // labels: side-by-side positions (inside the safe zone) or centred over the focused page
    const kB = E.inOut(P(t, T.fB, .7)), kC = E.inOut(P(t, T.fC, .7)), kD = E.inOut(P(t, T.fD, .8));
    const llx = lerp(lerp(355, 540, kB), 355, kD), lrx = lerp(lerp(712, 540, kC), 712, kD);   // labels fade (never slide off-screen)
    const lls = 1 + .14 * (kB * (1 - kC)), lrs = 1 + .14 * (kC * (1 - kD));
    tf(q('#x-ll'), { x: llx, y: 428 + (1 - E.back(P(t, T.ext, .5))) * 30, s: lls * lerp(.4, 1, E.back(P(t, T.ext, .5))), o: clamp((t - T.ext) / .15) * (kC < 1 ? 1 - kC : clamp((kD - .75) * 4)) });
    tf(q('#x-lr'), { x: lrx, y: 428 + (1 - E.back(P(t, T.memo, .5))) * 30, s: lrs * lerp(.4, 1, E.back(P(t, T.memo, .5))), o: clamp((t - T.memo) / .15) });
    tf(q('#x-sub'), life(t, b(6), T.fD, { from: .5, dy: 20, d: .4, out: .25 }));
    // external letter: emblem flies in, centre guideline draws, snaps top-centre, top edge glows, 2.5 cm dimension
    const g1 = gpose(t, T.fly1, T.cm3, T.snap1, { x: PW * .32, y: PH * .58 }, FIN_L, { x: -260, y: -360 });
    tf(q('#x-gl'), { x: g1.x - GL * X.GR / 2, y: g1.y - GL / 2, r: g1.r, o: g1.o, s: 1 + (t > T.fD ? .08 * Math.max(0, Math.sin(Math.PI * P(t, wt[0], 1.2))) : 0) });
    q('#x-guide').style.transform = `scaleY(${E.inOut(P(t, T.mid, .6))})`; q('#x-guide').style.opacity = .9 - .5 * kD;
    q('#x-top').style.opacity = clamp((t - T.top) / .2) * (.55 + .45 * Math.sin((t - T.top) * 7)) * (1 - P(t, T.top + 1.6, .5));
    const dd = E.out(P(t, T.dim + .1, .6));
    q('#x-dl').setAttribute('y2', 3 + (GAP - 6) * dd); q('#x-da2').style.opacity = dd > .95 ? 1 : 0;
    q('#x-dim').style.opacity = clamp((t - T.dim) / .15) * (1 - .4 * kD);
    tf(q('#x-dlab'), { ...life(t, T.d25, T.fC - .1, { from: .3, dy: 0, d: .45, el: true, out: .25 }) });
    // memo: emblem flies in, top-left corner glows, snaps, form title appears beside it
    const g2 = gpose(t, T.fly2, T.cm15, T.snap2, { x: PW * .62, y: PH * .55 }, FIN_S, { x: PW + 260, y: -320 });
    tf(q('#x-gs'), { x: g2.x - GS * X.GR / 2, y: g2.y - GS / 2, r: -g2.r, o: g2.o, s: 1 + (t > T.fD ? .16 * Math.max(0, Math.sin(Math.PI * P(t, wt[3], 1.2))) : 0) });
    q('#x-corner').style.opacity = clamp((t - T.corner) / .2) * (.5 + .5 * Math.sin((t - T.corner) * 7)) * (1 - P(t, T.snap2 + .9, .5));
    tf(q('#x-mt'), { o: clamp((t - T.snap2 - .35) / .25), x: (1 - E.out(P(t, T.snap2 + .35, .4))) * 20 });
    q('#x-mf').style.opacity = clamp((t - T.snap2 - .5) / .4);
    tf(tags[0], life(t, T.cm3, T.fC - .1, { from: .3, dy: 0, d: .45, el: true, out: .25 }));
    tf(tags[1], life(t, T.cm15, T.snap2 + .2, { from: .3, dy: 0, d: .45, el: true, out: .25 }));
    // overlay chips under the focused page
    tf(q('#x-rowB'), { o: t >= T.mid && t < T.fC ? 1 : 0 });
    tf(q('#x-b1'), life(t, T.mid, T.fC - .05, { from: .4, dy: 30, d: .45, el: true, out: .2 }));
    tf(q('#x-b2'), life(t, T.top, T.fC - .05, { from: .4, dy: 30, d: .45, el: true, out: .2 }));
    tf(q('#x-rowC'), life(t, T.corner, T.fD - .05, { from: .4, dy: 30, d: .45, el: true, out: .2 }));
    // memory phrase: word by word on the spoken words, then hold
    tf(q('#x-easy'), life(t, T.easy, 1e9, { from: .5, dy: 30, d: .45 }));
    words.forEach((e, i) => { const l = life(t, wt[i] - .04, 1e9, { from: .2, dy: 60, d: .5, el: true }); tf(e, { ...l, s: l.s * (1 + .03 * Math.sin((t - wt[i]) * 4)) }); });
    unders.forEach((e, i) => { e.style.transform = `scaleX(${E.out(P(t, wt[i * 3 + 2] + .25, .4))})`; });
  }
  window.SC = window.SC || {};
  SC.expl = { el, a: X.S(K), b: X.S('quiz'), draw };
})();
