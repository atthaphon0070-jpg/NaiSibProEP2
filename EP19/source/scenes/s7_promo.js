// SCENE 7 — PROMOTION (07_promotion.mp3). Approved CTA only: comment "ใหญ่อยู่กลาง", real NaiSibPro logo,
// 10,000+ questions, updated weekly, follow. Ends on the logo hold (<= 1.0 s after the narration).
// (EP19 does not use shared/engine/promo.js: that module shows packages / subjects / links that are not in this script.)
(function () {
  const { clamp, lerp, E, P, tf, life, bob, h, sfx, ICON, pressDepth } = NSP;
  const X = EP19, K = 'promo', S0 = X.S(K);
  const b = i => X.B(K, i), w = (i, s) => X.W(K, i, s);
  const el = document.getElementById('s7');
  const A = S0 + .6;                                            // scene cut, after the answer's memory-phrase hold
  el.innerHTML = `
    <div id="p-h1" class="row" style="top:322px"><div class="big kt" style="font-size:76px">ใครตอบ<span class="yl">ถูก</span>?</div></div>
    <div id="p-h2" class="row" style="top:428px"><div class="pill2 p-nv kt" style="font-size:50px">คอมเมนต์บอกเลยว่า</div></div>
    <div id="p-ic" class="ctr" style="width:260px;height:230px"><svg width="260" height="230" viewBox="0 0 260 230">
      <path d="M40 10 H220 Q250 10 250 40 V150 Q250 180 220 180 H110 L60 222 L66 180 H40 Q10 180 10 150 V40 Q10 10 40 10Z" fill="url(#p-icg)"/>
      <defs><linearGradient id="p-icg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#7DE8F7"/><stop offset="1" stop-color="#2F6BFF"/></linearGradient></defs>
      <circle class="p-dot" cx="80" cy="95" r="16" fill="#fff"/><circle class="p-dot" cx="130" cy="95" r="16" fill="#fff"/><circle class="p-dot" cx="180" cy="95" r="16" fill="#fff"/></svg></div>
    <div id="p-bub" class="row" style="top:850px"><div style="position:relative;display:flex;align-items:center;gap:16px;padding:18px 36px;border-radius:40px;background:#fff;box-shadow:0 16px 34px rgba(0,0,0,.4)">
      <span class="kt" style="font-weight:800;font-size:66px;color:var(--ink)">ใหญ่อยู่กลาง</span><span class="xic" style="width:66px;height:66px;background:var(--gn)">${ICON.check('#fff', 48)}</span>
      <svg style="position:absolute;left:60px;bottom:-30px" width="50" height="34" viewBox="0 0 50 34"><path d="M0 0 H50 L8 34Z" fill="#fff"/></svg></div></div>
    <div id="p-likes"></div>
    <div id="p-c3" class="row" style="top:330px"><div class="big kt" style="font-size:54px">ฝึกข้อสอบแบบนี้<span class="cy">อีกเยอะ ๆ</span></div></div>
    <div id="p-stack" class="abs" style="left:0;top:0"></div>
    <div id="p-logo" class="ctr" style="width:420px;height:442px"><img src="../../shared/brand/logo.png" style="width:420px;height:442px;display:block;filter:drop-shadow(0 18px 30px rgba(0,0,0,.45))"></div>
    <div id="p-glow" class="ctr" style="width:640px;height:640px;border-radius:50%;background:radial-gradient(circle,rgba(125,232,247,.35) 0%,rgba(47,107,255,.18) 40%,rgba(0,0,0,0) 70%)"></div>
    <div id="p-name" class="row" style="top:818px"><div class="big kt" style="font-size:60px">NaiSibPro <span class="yl">นายสิบโปร</span></div></div>
    <div id="p-n1" class="row" style="top:920px"><div class="kt" style="font-weight:700;font-size:50px">ข้อสอบมากกว่า</div></div>
    <div id="p-n2" class="row" style="top:984px;gap:18px"><span class="big yl kt" style="font-size:120px"><span id="p-num">0</span>+</span><span class="big kt" style="font-size:66px">ข้อ</span></div>
    <div id="p-up" class="row" style="top:1136px"><div class="pill2 p-cy kt" style="font-size:52px">${ICON.cal(54, '#06243A')}อัปเดตทุกสัปดาห์</div></div>
    <div id="p-fol" class="row" style="top:1248px"><div id="p-folb" class="pill2 p-pk kt" style="font-size:58px;padding:14px 44px">+ ติดตาม</div></div>
    <div id="p-hand" class="abs" style="left:0;top:0;width:110px;height:110px">${ICON.hand(110)}</div>
    <div id="p-bye" class="row" style="top:1352px"><div class="big kt" style="font-size:54px">แล้วเจอกัน<span class="yl">ข้อต่อไป!</span></div></div>`;
  const q = s => el.querySelector(s);
  const ic = X.sized(q('#p-ic'), 260, 230), logo = X.sized(q('#p-logo'), 420, 442), glow = X.sized(q('#p-glow'), 640, 640);
  const dots = [...el.querySelectorAll('.p-dot')];
  const likes = [...Array(6)].map((_, i) => { const e = h(`<div class="abs" style="left:0;top:0">${ICON.heart(['#FF4D7E', '#FFD23F', '#22D3EE'][i % 3])}</div>`); q('#p-likes').appendChild(e); return e; });
  const sheets = [...Array(5)].map((_, i) => {
    const e = X.sized(h(`<div class="ctr" style="width:300px;height:400px"><div class="card9" style="left:0;top:0;width:300px;height:400px;background:linear-gradient(180deg,#fff,#EEF3FB)">
      <div style="position:absolute;left:24px;right:24px;top:28px;height:16px;border-radius:8px;background:#C9D2E1"></div><div style="position:absolute;left:24px;width:170px;top:58px;height:16px;border-radius:8px;background:#C9D2E1"></div>
      ${['ก', 'ข', 'ค', 'ง'].map((c, j) => `<div style="position:absolute;left:24px;right:24px;top:${110 + j * 68}px;height:52px;border-radius:26px;background:#E3EBF8;display:flex;align-items:center;gap:12px;padding-left:8px"><div style="width:38px;height:38px;border-radius:50%;background:#2F6BFF;color:#fff;font-weight:800;font-size:24px;display:grid;place-items:center">${c}</div><div style="height:12px;width:${[60, 74, 52, 66][(j + i) % 4]}%;border-radius:6px;background:#C3CFE3"></div></div>`).join('')}</div></div>`), 300, 400);
    q('#p-stack').appendChild(e); return e;
  });

  const T = { cm: b(1), bub: b(2), more: b(3), go: b(4), logo: w(4, 'นายสิบโปร'), n: b(5), up: b(6), fol: b(7), tap: b(7) + .55, bye: b(8) };
  sfx('pop', A + .05, .6); sfx('pop', T.cm + .05, .8); sfx('msg', T.bub + .05, 1); for (let i = 0; i < 6; i++) sfx('pop', T.bub + .3 + i * .1, .35);
  sfx('whoosh', T.more, .5); for (let i = 0; i < 5; i++) sfx('page', T.more + .15 + i * .12, .35);
  sfx('swoosh', T.go, .5); sfx('riser', T.logo - .6, .5); sfx('ding', T.logo + .05, .8); sfx('sparkle', T.logo + .2, .8);
  for (let i = 0; i < 8; i++) sfx('coin', T.n + .1 + i * .13, .35); sfx('pop', T.up + .05, .8);
  sfx('pop', T.fol + .05, .9); sfx('click', T.tap, 1); sfx('success', T.tap + .05, .5); sfx('pop', T.bye + .05, .7);

  function draw(t) {
    const u = t - A;
    // beat 1: comment
    const g1 = 1 - E.inOut(P(t, T.more - .15, .5));
    tf(q('#p-h1'), { ...life(t, A, 1e9, { from: .5, dy: 30, d: .4 }), o: clamp((t - A) / .2) * g1 });
    tf(q('#p-h2'), { ...life(t, T.cm, 1e9, { from: .4, dy: 30, d: .45 }), o: clamp((t - T.cm) / .2) * g1 });
    const il = life(t, T.cm, 1e9, { from: .2, dy: 0, d: .6, el: true });
    X.at(ic, 540, 680 + bob(t, 0, 6, 2), { s: il.s, o: il.o * g1, r: Math.sin(t * 2) * 3 });
    dots.forEach((d, i) => d.setAttribute('cy', 95 - 10 * Math.max(0, Math.sin((t - T.cm) * 7 - i * .8))));
    tf(q('#p-bub'), { ...life(t, T.bub, 1e9, { from: .3, dy: 40, d: .55, el: true }), o: clamp((t - T.bub) / .15) * g1 });
    likes.forEach((e, i) => { const k = P(t, T.bub + .3 + i * .1, 1.2); tf(e, { x: 300 + i * 95 + Math.sin(k * 6 + i) * 20, y: 900 - 360 * E.out(k), o: Math.sin(Math.PI * k) * g1, s: .8 + .4 * Math.sin(Math.PI * k) }); });
    // beat 2: lots more practice
    const g2 = 1 - E.inOut(P(t, T.go, .45));
    const l3 = life(t, T.more, T.go, { from: .5, dy: 30, d: .45, out: .3 }); tf(q('#p-c3'), { ...l3, y: Math.max(0, l3.y) });
    sheets.forEach((e, i) => { const k = E.out(P(t, T.more + .1 + i * .12, .55)), a = (i - 2) * 9; X.at(e, 540 + (i - 2) * 70 * k, 820 - 40 * k + Math.abs(i - 2) * 16 + bob(t, i, 4, 1.6), { r: a * k, s: lerp(.4, .9, k), o: clamp(k * 3) * g2 }); });
    // beat 3: real logo enters centre (the only prominent logo use)
    const li = life(t, T.logo - .25, 1e9, { from: .2, dy: 0, d: .9, el: true });
    X.at(logo, 540, 600 + (1 - clamp((t - T.logo + .25) / .5)) * 140 + bob(t, 0, 6, 1.6), { s: li.s, o: li.o, r: Math.sin(t * 1.4) * 1.5 });
    X.at(glow, 540, 600, { s: 1 + .06 * Math.sin(t * 2.2), o: li.o * .9 });
    tf(q('#p-name'), life(t, T.logo + .25, 1e9, { from: .5, dy: 30, d: .45 }));
    // beat 4: 10,000+ counter, updated weekly
    tf(q('#p-n1'), life(t, T.n, 1e9, { from: .5, dy: 20, d: .4 }));
    tf(q('#p-n2'), life(t, T.n + .1, 1e9, { from: .3, dy: 20, d: .5, el: true }));
    q('#p-num').textContent = (Math.round(10000 * E.out(P(t, T.n + .1, 1.1)) / 50) * 50).toLocaleString('en-US');
    tf(q('#p-up'), life(t, T.up, 1e9, { from: .4, dy: 30, d: .45, el: true }));
    // beat 5: follow
    const fl = life(t, T.fol, 1e9, { from: .3, dy: 30, d: .5, el: true });
    tf(q('#p-fol'), { ...fl, s: fl.s * (1 - .1 * pressDepth(t, [T.tap])) * (1 + .03 * Math.sin((t - T.fol) * 6) * (t > T.fol ? 1 : 0)) });
    const hk = E.inOut(P(t, T.fol + .1, .45));
    tf(q('#p-hand'), { x: lerp(860, 600, hk), y: lerp(1450, 1270, hk) + 10 * pressDepth(t, [T.tap]), s: 1 - .12 * pressDepth(t, [T.tap]), o: clamp((t - T.fol - .1) / .15) * (1 - P(t, T.bye - .2, .3)) });
    tf(q('#p-bye'), life(t, T.bye, 1e9, { from: .5, dy: 30, d: .45 }));
  }
  window.SC = window.SC || {};
  SC.promo = { el, a: A, b: 1e9, draw, logoAt: T.logo - .3 };
})();
