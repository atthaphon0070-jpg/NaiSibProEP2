// SCENE 1 — HOOK (01_hook.mp3). Frame 0: "เตรียมสอบนายสิบ" fully visible, tilted A4 page, Garuda already gliding.
(function () {
  const { clamp, lerp, E, P, tf, life, bob, h, sfx } = NSP;
  const X = EP19, K = 'hook', A = X.S(K);
  const b = i => X.B(K, i), w = (i, s) => X.W(K, i, s);
  const el = document.getElementById('s1');
  const PX = 300, PY = 740, PW = 480;                         // page top-left / width (h = 679)
  el.innerHTML = `
    <div id="h-wrap" class="abs" style="inset:0;transform-origin:540px 900px">
      <div id="h-pgs" class="abs" style="left:0;top:0;width:1080px;height:1920px"></div>
    </div>
    <div id="h-title" class="abs" style="left:0;top:296px;width:1080px;transform-origin:540px 0px">
      <div class="row kt big yl" style="top:0;font-size:132px">เตรียมสอบ</div>
      <div class="row kt big yl" style="top:142px;font-size:132px">นายสิบ</div>
      <div id="h-ul" class="abs" style="left:300px;top:306px;width:480px;height:12px;border-radius:6px;background:var(--cy);transform-origin:0 50%"></div>
    </div>
    <div id="h-sub" class="row" style="top:652px"><div class="pill2 p-pk kt" style="font-size:58px">ข้อนี้ต้องรู้!</div></div>
    <div id="h-c1" class="row" style="top:520px"><div class="pill2 p-nv kt" style="font-size:52px">ตราครุฑ บนหนังสือราชการ</div></div>
    <div id="h-c2" class="row" style="top:520px"><div class="big kt" style="font-size:72px">วางตรงไหน<span class="yl">?</span></div></div>
    <div id="h-c3" class="row" style="top:516px;gap:22px"><div id="h-c3a" class="big kt yl" style="font-size:78px">กลาง</div><div id="h-c3b" class="big kt" style="font-size:78px">หรือ <span class="cy">ซ้าย?</span></div></div>
    <div id="h-c4" class="row" style="top:524px;gap:26px"><div id="h-c4a" class="pill2 p-eb kt" style="font-size:56px">3 ซม.?</div><div id="h-c4b" class="pill2 p-cy kt" style="font-size:56px">1.5 ซม.?</div></div>
    <div id="h-c5" class="row" style="top:516px"><div class="big kt yl" style="font-size:80px">ดูให้จบ!</div></div>
    <div id="h-c6" class="row" style="top:1325px"><div class="pill2 p-wh kt" style="font-size:50px">ไม่พลาดข้อนี้อีกเลย!</div></div>`;
  const q = s => el.querySelector(s);
  const page = X.a4(PW); page.style.left = PX + 'px'; page.style.top = PY + 'px'; page.style.transformOrigin = '50% 40%';
  page.insertAdjacentHTML('beforeend', `<div class="ttl" style="left:${PW * .1}px;top:${PW * 1.414 * .27}px;font-size:22px;color:#8A94A6">ที่ ............................. </div>`);
  q('#h-pgs').appendChild(page);
  // pulsing "?" spots: top-centre and top-left of the page
  const spots = [[PX + PW / 2, PY + 95], [PX + 78, PY + 88]].map(([x, y]) => { const s = X.sized(h(`<div class="qm" style="width:86px;height:86px;font-size:58px">?</div>`), 86, 86); q('#h-pgs').appendChild(s); s._x = x; s._y = y; return s; });
  const G = X.sized(h(`<div class="ctr" style="width:155px;height:170px">${X.gar(170, '#0E1526', 'glow')}</div>`), 155, 170);
  q('#h-pgs').appendChild(G);

  const T1 = b(3), T2 = b(5), T3 = b(6), T4 = b(7), T5 = b(8), T6 = b(9), END = X.S('story');
  const mix = (p, o, k) => ({ x: lerp(p.x, o.x, k), y: lerp(p.y, o.y, k), s: lerp(p.s, o.s, k), r: lerp(p.r, o.r, k) });
  function gpose(u) {
    const t = u + A;
    let p = { x: 540 + 250 * Math.sin(.9 * u + .6), y: 820 + 46 * Math.sin(1.8 * u), s: 1, r: 13 * Math.cos(.9 * u + .6) };              // glide above the page
    const th = 1.5 * (t - T1) + 2.2;
    p = mix(p, { x: 540 + 230 * Math.cos(th), y: 930 + 105 * Math.sin(th), s: .9 + .08 * Math.sin(th), r: -14 * Math.sin(th) }, E.inOut(P(t, T1, .9)));  // circles the page
    p = mix(p, { x: PX + PW / 2 + 5 * Math.sin(t * 9), y: PY + 95 + 3 * Math.sin(t * 7), s: .62, r: 4 * Math.sin(t * 6) }, E.inOut(P(t, T2 - .05, .45)));   // swoop: top-centre, hesitates
    p = mix(p, { x: PX + 78 + 3 * Math.sin(t * 8), y: PY + 88, s: .5, r: 0 }, E.inOut(P(t, T3 - .05, .42)));                                            // swoop: top-left
    const osc = .7 + .32 * Math.sin((t - T4) * 4.4 - Math.PI / 2) * -1;                                                                            // scales up and down
    p = mix(p, { x: 540, y: 1000, s: osc, r: 0 }, E.inOut(P(t, T4, .45)));
    p = mix(p, { x: 540, y: 960, s: 1.25, r: 0 }, E.inOut(P(t, T5, .8)));
    return p;
  }
  sfx('whoosh', A + .02, .45); sfx('pop', b(1) + .05, .7);
  sfx('whoosh', T1 + .05, .4); sfx('pop', T1 + .2, .5);
  sfx('pop', T2 + .05, .6); sfx('whoosh', T2 - .08, .7); sfx('click', T2 + .42, .7);
  sfx('whoosh', T3 - .08, .7); sfx('click', T3 + .4, .7); sfx('pop', T3 + .05, .6);
  sfx('pop', T4 + .05, .7); sfx('pop', T4 + .55, .7); sfx('whoosh', T4 + .1, .35);
  sfx('riser', T5 - .2, .5); sfx('pop', T5 + .05, .8); sfx('pop', T6 + .05, .7);

  function draw(t) {
    const u = t - A;
    // title: on screen at full size from frame 0 (no entrance); shrinks into a header when the topic starts
    const sh = E.inOut(P(t, T1 - .1, .55));
    tf(q('#h-title'), { s: lerp(1, .64, sh) * (1 + .015 * Math.sin(u * 3.2)), y: 18 * sh });
    q('#h-ul').style.transform = `scaleX(${.25 + .75 * E.out(clamp(u / .9))})`;
    tf(q('#h-sub'), { ...life(t, b(1), T1 - .05, { from: .4, dy: 30, d: .45 }) });
    // captions (one at a time)
    tf(q('#h-c1'), life(t, T1, b(4) - .1, { from: .5, dy: 30, d: .45 }));
    tf(q('#h-c2'), life(t, b(4), T2 - .1, { from: .5, dy: 30, d: .4, out: .2 }));
    tf(q('#h-c3'), { o: t >= T2 && t < T4 - .1 ? 1 : 0 });
    tf(q('#h-c3a'), { ...life(t, T2, T4 - .1, { from: .3, dy: 20, d: .45, el: true }) });
    tf(q('#h-c3b'), { ...life(t, T3, T4 - .1, { from: .3, dy: 20, d: .45, el: true }) });
    tf(q('#h-c4'), { o: t >= T4 && t < T5 - .1 ? 1 : 0 });
    tf(q('#h-c4a'), life(t, T4, T5 - .1, { from: .3, dy: 20, d: .45, el: true }));
    tf(q('#h-c4b'), life(t, T4 + .5, T5 - .1, { from: .3, dy: 20, d: .45, el: true }));
    tf(q('#h-c5'), life(t, T5, 1e9, { from: .4, dy: 30, d: .45, el: true }));
    tf(q('#h-c6'), life(t, T6, 1e9, { from: .5, dy: 30, d: .45 }));
    // page: tilted and drifting at frame 0, settles when the topic is named
    const st = E.out(P(t, T1, 1.0));
    tf(page, { r: lerp(-11 + 3 * Math.sin(u * 1.3), 0, st), y: lerp(10 * Math.sin(u * 1.1), 0, st) + bob(u, 0, 3, 1.2) * st, x: lerp(-8 * Math.cos(u * .9), 0, st) });
    spots.forEach((s, i) => { const a0 = i ? T3 : T2; const l = life(t, a0, T4 - .05, { from: .2, dy: 0, d: .5, el: true }); X.at(s, s._x + (i ? -70 : 92), s._y - 40, { ...l, s: l.s * (1 + .12 * Math.sin((t - a0) * 9)) }); });
    const g = gpose(u);
    X.at(G, g.x, g.y, { s: g.s, r: g.r, sx: g.s * (1 - .06 * Math.abs(Math.sin(u * 5))), sy: g.s });
    // push-in on "ดูให้จบ"
    const pi = E.inOut(P(t, T5, 2.6));
    tf(q('#h-wrap'), { s: 1 + .45 * pi, y: -80 * pi });
  }
  window.SC = window.SC || {};
  SC.hook = { el, a: 0, b: END, draw };
})();
