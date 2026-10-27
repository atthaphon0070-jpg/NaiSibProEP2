// SCENE 3 — KNOWLEDGE (03_knowledge.mp3). Regulation cover, two standard sizes measured on one common scale
// (120 px = 1 cm, so the 3 cm emblem is exactly twice the 1.5 cm one), "only the numbers?" beat, ภายนอก / ภายใน split.
(function () {
  const { clamp, lerp, E, P, tf, life, bob, h, sfx } = NSP;
  const X = EP19, K = 'know', A = X.S(K);
  const b = i => X.B(K, i), w = (i, s) => X.W(K, i, s);
  const el = document.getElementById('s3');
  const CM = 120, BASE = 1180;                                  // px per cm, common baseline of both emblems
  const GL = { cx: 392, hh: 3 * CM }, GS = { cx: 738, hh: 1.5 * CM };
  el.innerHTML = `
    <div id="k-cov" class="abs" style="left:220px;top:330px;width:640px;height:360px;border-radius:26px;background:linear-gradient(160deg,#1E4A8C,#122C57);box-shadow:0 0 0 4px #E2B93B,0 0 0 10px rgba(226,185,59,.25),0 24px 50px rgba(0,0,0,.45);transform-origin:50% 0">
      <div class="abs" style="left:285px;top:34px">${X.gar(78, '#FFD23F')}</div>
      <div class="row kt" style="left:0;width:640px;top:132px;font-weight:800;font-size:60px;color:#fff">ระเบียบงานสารบรรณ</div>
      <div id="k-ul" class="abs" style="left:52px;top:222px;width:536px;height:12px;border-radius:6px;background:var(--yl);transform-origin:0 50%"></div>
      <div class="abs" style="left:52px;top:262px;width:536px;height:10px;border-radius:5px;background:rgba(255,255,255,.18)"></div>
      <div class="abs" style="left:52px;top:290px;width:380px;height:10px;border-radius:5px;background:rgba(255,255,255,.18)"></div>
    </div>
    <div id="k-c1" class="row" style="top:596px"><div class="pill2 p-nv kt" style="font-size:52px">ตราครุฑแบบมาตรฐาน</div></div>
    <div id="k-c2" class="row" style="top:590px"><div class="big kt" style="font-size:76px">มีอยู่ <span class="yl">2 ขนาด</span></div></div>
    <div id="k-rl" class="abs" style="left:${GL.cx - GL.hh * X.GR / 2 - 66}px;top:${BASE - 3 * CM}px"></div>
    <div id="k-rs" class="abs" style="left:${GS.cx - GS.hh * X.GR / 2 - 66}px;top:${BASE - 1.5 * CM}px"></div>
    <div id="k-gl" class="ctr" style="width:${GL.hh * X.GR}px;height:${GL.hh}px">${X.gar(GL.hh, '#FFD23F', 'glow')}</div>
    <div id="k-gs" class="ctr" style="width:${GS.hh * X.GR}px;height:${GS.hh}px">${X.gar(GS.hh, '#FFD23F', 'glow')}</div>
    <div id="k-hl" class="abs" style="left:${GL.cx - GL.hh * X.GR / 2 - 14}px;width:${GL.hh * X.GR + 20}px;top:${BASE - 3 * CM}px;border-top:3px dashed rgba(255,229,138,.8)"></div>
    <div id="k-hs" class="abs" style="left:${GS.cx - GS.hh * X.GR / 2 - 14}px;width:${GS.hh * X.GR + 20}px;top:${BASE - 1.5 * CM}px;border-top:3px dashed rgba(255,229,138,.8)"></div>
    <div id="k-base" class="abs" style="left:160px;width:720px;top:${BASE}px;height:4px;border-radius:2px;background:rgba(125,232,247,.55)"></div>
    <div id="k-nl" class="abs" style="left:${GL.cx - 160}px;width:320px;top:${BASE + 22}px;display:flex;justify-content:center"><div class="big kt" style="font-size:66px"><span id="k-nlv">0.0</span> ซม.</div></div>
    <div id="k-ns" class="abs" style="left:${GS.cx - 160}px;width:320px;top:${BASE + 22}px;display:flex;justify-content:center"><div class="big kt" style="font-size:66px"><span id="k-nsv">0.0</span> ซม.</div></div>
    <div id="k-fl" class="abs" style="left:${GL.cx - 120}px;width:240px;top:0;height:0"><div class="row big yl kt" style="left:0;width:240px;top:0;font-size:132px">3</div>
      <div class="k-q abs" style="left:96px;top:150px;width:48px;transform-origin:24px 0"><div style="margin:0 auto;width:4px;height:44px;background:var(--yl2)"></div><div class="qm" style="position:relative;width:62px;height:62px;margin-left:-7px;font-size:44px">?</div></div></div>
    <div id="k-fs" class="abs" style="left:${GS.cx - 120}px;width:240px;top:0;height:0"><div class="row big yl kt" style="left:0;width:240px;top:0;font-size:132px">1.5</div>
      <div class="k-q abs" style="left:96px;top:150px;width:48px;transform-origin:24px 0"><div style="margin:0 auto;width:4px;height:44px;background:var(--yl2)"></div><div class="qm" style="position:relative;width:62px;height:62px;margin-left:-7px;font-size:44px">?</div></div></div>
    <div id="k-le" class="abs" style="left:${GL.cx - 170}px;width:340px;top:1318px;display:flex;justify-content:center"><div class="pill2 p-eb kt" style="font-size:58px">ภายนอก</div></div>
    <div id="k-li" class="abs" style="left:${GS.cx - 170}px;width:340px;top:1318px;display:flex;justify-content:center"><div class="pill2 p-cy kt" style="font-size:58px">ภายใน</div></div>
    <div id="k-diff" class="row" style="top:590px"><div class="big kt yl" style="font-size:72px">คนละแบบ!</div></div>`;
  const q = s => el.querySelector(s);
  q('#k-rl').innerHTML = X.ruler(3, CM); q('#k-rs').innerHTML = X.ruler(1.5, CM);
  const gl = X.sized(q('#k-gl'), GL.hh * X.GR, GL.hh), gs = X.sized(q('#k-gs'), GS.hh * X.GR, GS.hh);
  const qs = [...el.querySelectorAll('.k-q')];

  const T = { std: b(1), two: b(2), first: b(3), cm3: w(4, 'สาม'), second: b(5), cm15: w(6, 'หนึ่ง'), nums: b(7), forget: b(8), each: b(9), diff: b(10), kind: w(10, 'คนละแบบ') };
  sfx('page', A + b(0) - A + .05, .7); sfx('swoosh', T.std, .4); sfx('sparkle', T.std + .2, .5);
  sfx('whoosh', T.two + .05, .5); sfx('pop', T.two + .3, .6);
  sfx('pop', T.first + .05, .5); sfx('whoosh', T.cm3 - .3, .4); for (let i = 0; i < 6; i++) sfx('tick', T.cm3 + i * .15, .25); sfx('click', T.cm3 + .95, .7);
  sfx('pop', T.second + .05, .5); sfx('whoosh', T.cm15 - .3, .4); for (let i = 0; i < 6; i++) sfx('tick2', T.cm15 + i * .15, .2); sfx('click', T.cm15 + .95, .7);
  sfx('whoosh', T.nums + .05, .5); sfx('pop', T.nums + .4, .5);
  sfx('drop', T.each + .1, .4); sfx('whoosh', T.diff, .5); sfx('pop', T.diff + .2, .8); sfx('pop', T.diff + .45, .8); sfx('ding', T.kind, .4);

  function draw(t) {
    const u = t - A;
    // regulation cover slides in, underline sweeps, then shrinks into the header
    const ci = E.out(P(t, A, .7)), cs = E.inOut(P(t, T.std - .1, .6));
    tf(q('#k-cov'), { x: lerp(-160, 0, ci), y: -20 * cs + bob(u, 0, 3, 1.1), s: lerp(1, .72, cs), r: lerp(-6, 0, ci), o: clamp((ci - .45) * 2.5) });
    q('#k-ul').style.transform = `scaleX(${E.inOut(P(t, A + .45, .7))})`;
    tf(q('#k-c1'), life(t, T.std, T.two - .05, { from: .5, dy: 30, d: .45, out: .2 }));
    tf(q('#k-c2'), life(t, T.two, T.nums - .05, { from: .4, dy: 30, d: .45, el: true, out: .2 }));
    // one emblem appears, then splits into the two standard sizes on a shared baseline
    const sp = E.inOut(P(t, T.two, .7)), dimN = E.inOut(P(t, T.nums, .5)) * (1 - E.inOut(P(t, T.each, .5)));
    const gi = life(t, T.std, 1e9, { from: .2, dy: 0, d: .8, el: true });
    const hiL = Math.max(0, 1 - Math.abs(t - T.first - .3) / .5), hiS = Math.max(0, 1 - Math.abs(t - T.second - .3) / .5);
    X.at(gl, lerp(540, GL.cx, sp), BASE - GL.hh / 2 + bob(u, 0, 4, 1.3) * (1 - sp), { s: gi.s * (1 + .06 * hiL), o: gi.o * (1 - .65 * dimN) });
    X.at(gs, lerp(540, GS.cx, sp), BASE - GS.hh / 2, { s: lerp(1.8, 1, sp), o: clamp(sp * 3) * (1 - .65 * dimN) * (1 + 0 * hiS), r: 0 });
    tf(q('#k-base'), { o: clamp(sp * 2) * .9, sx: sp });
    // rulers + counters on "สามเซนติเมตร" / "หนึ่งจุดห้าเซนติเมตร"
    const rl = E.out(P(t, T.cm3 - .35, .5)), rs = E.out(P(t, T.cm15 - .35, .5)), rOut = 1 - .7 * dimN;
    tf(q('#k-rl'), { y: lerp(260, 0, rl), o: clamp(rl * 2) * rOut });
    tf(q('#k-rs'), { y: lerp(260, 0, rs), o: clamp(rs * 2) * rOut });
    tf(q('#k-hl'), { o: clamp((t - T.cm3 - .7) / .3) * rOut, sx: E.out(P(t, T.cm3 + .6, .4)) });
    tf(q('#k-hs'), { o: clamp((t - T.cm15 - .7) / .3) * rOut, sx: E.out(P(t, T.cm15 + .6, .4)) });
    q('#k-nlv').textContent = (3 * E.out(P(t, T.cm3, .9))).toFixed(1);
    q('#k-nsv').textContent = (1.5 * E.out(P(t, T.cm15, .9))).toFixed(1);
    tf(q('#k-nl'), { ...life(t, T.cm3 - .1, 1e9, { from: .5, dy: 20, d: .4 }), o: clamp((t - T.cm3 + .1) / .2) * (1 - .6 * dimN) });
    tf(q('#k-ns'), { ...life(t, T.cm15 - .1, 1e9, { from: .5, dy: 20, d: .4 }), o: clamp((t - T.cm15 + .1) / .2) * (1 - .6 * dimN) });
    // "จำได้แค่ตัวเลข": the numbers float up with a dangling "?"
    const fu = E.out(P(t, T.nums, .8)), fo = clamp((t - T.nums) / .2) * (1 - P(t, T.diff - .2, .3));
    tf(q('#k-fl'), { y: lerp(BASE, 640, fu) + bob(u, 0, 8, 2), o: fo, s: lerp(.5, 1, fu) });
    tf(q('#k-fs'), { y: lerp(BASE, 660, fu) + bob(u, 1.5, 8, 2), o: fo, s: lerp(.5, 1, fu) });
    qs.forEach((e, i) => { const sw = (t > T.forget ? 22 : 12) * Math.sin((t - T.nums) * 3.2 + i * 1.3), fall = E.in(P(t, T.each, .5)); e.style.transform = `translateY(${fall * 260}px) rotate(${sw * (1 - fall)}deg)`; e.style.opacity = clamp((t - T.nums - .5) / .3) * (1 - fall); });
    // "คนละแบบ": labels split left / right
    const sl = E.out(P(t, T.diff, .6));
    tf(q('#k-le'), { x: lerp(70, 0, sl), o: clamp(sl * 3), s: lerp(.6, 1, E.back(P(t, T.diff, .6))) });
    tf(q('#k-li'), { x: lerp(-70, 0, sl), o: clamp(sl * 3), s: lerp(.6, 1, E.back(P(t, T.diff, .6))) });
    tf(q('#k-diff'), life(t, T.kind, 1e9, { from: .3, dy: 20, d: .5, el: true }));
  }
  window.SC = window.SC || {};
  SC.know = { el, a: X.S(K), b: X.S('expl'), draw };
})();
