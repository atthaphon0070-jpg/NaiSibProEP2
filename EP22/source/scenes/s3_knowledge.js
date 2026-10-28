// SCENE 3 — KNOWLEDGE (03_knowledge.mp3): rule 1 — together is always faster than the fastest single worker;
// think in work per day, never in days.
SC.knowledge = function (root) {
  const { h, tf, life, clamp, lerp, E, P, ICON, sfx } = NSP;
  const { T, A, pop } = EP22, B = BEATS.know, S = T.know0;
  const stamp = A(root, 540, 420, `<div class="stamp">กฎข้อ 1</div>`);
  // speed bars: length = how fast (work per day)
  const BARS = [
    { y: 600, w: 330, col: 'linear-gradient(90deg,#2F6BFF,#5B8CFF)', txt: '<span class="wbadge b" style="font-size:40px">1</span>คนที่ 1', tc: '#fff', at: B.if + .2 },
    { y: 720, w: 440, col: 'linear-gradient(90deg,#13B8D3,#3FE0F5)', txt: '<span class="wbadge c" style="font-size:40px">2</span>คนที่ 2', tc: '#06243A', at: B.if + .45 },
    { y: 840, w: 680, col: 'linear-gradient(90deg,#F5B700,#FFD23F)', txt: 'ช่วยกัน', tc: '#3A2A00', at: B.fastest - .15 },
  ].map(b => { const el = h(`<div class="bar" style="left:190px;top:${b.y}px;width:${b.w}px;background:${b.col};transform-origin:left center;box-shadow:0 10px 22px rgba(0,0,0,.35)">
      <div style="position:absolute;left:24px;top:0;bottom:0;display:flex;align-items:center;gap:10px;font-weight:800;font-size:44px;color:${b.tc};white-space:nowrap">${b.txt}</div></div>`); root.appendChild(el); return { ...b, el }; });
  const fastest = A(root, 740, 960, `<div class="pill2" style="font-size:52px;color:#3A2A00;background:#FFD23F;box-shadow:0 0 0 5px #fff,0 12px 24px rgba(0,0,0,.35)">เร็วที่สุด!</div>`);
  const spd = A(root, 540, 520, `<div class="big wht" style="font-size:50px">ยิ่งยาว = ยิ่งเร็ว</div>`);
  // muscles merge
  const m1 = A(root, 400, 1180, WORK.muscle(150, '#2F6BFF')), m2 = A(root, 680, 1180, WORK.muscle(150, '#22D3EE'));
  const mp = A(root, 540, 1180, `<div class="big wht" style="font-size:90px">+</div>`);
  const mBig = A(root, 540, 1180, WORK.muscle(250, '#FFD23F'));
  // "ห้ามคิดเป็นวัน" → strike "วัน"; then "งานต่อวัน"
  const task = A(root, 540, 560, `<div class="pill2 chipH">โจทย์งาน</div>`);
  const noDay = A(root, 540, 720, `<div class="big wht" style="font-size:100px">ห้ามคิดเป็น <span style="position:relative;display:inline-block" class="yel">วัน<i class="strike"></i></span></div>`);
  const strike = noDay.querySelector('.strike');
  const but = A(root, 540, 900, `<div class="big wht" style="font-size:52px">แต่ต้องคิดว่า แต่ละคนทำได้</div>`);
  const rate = A(root, 540, 1110, `<div class="mph" style="font-size:136px">งานต่อวัน</div>`);
  const rateBox = A(root, 540, 1290, `<div style="display:flex;gap:14px">${[0, 1, 2, 3].map(i => `<div class="rb" style="width:84px;height:84px;border-radius:16px;background:${i < 2 ? '#2F6BFF' : 'rgba(255,255,255,.15)'};box-shadow:0 0 0 4px rgba(255,255,255,.8)"></div>`).join('')}</div>`);
  const rbs = [...rateBox.querySelectorAll('.rb')];

  sfx('stamp', S + B.rule + .3, 1); sfx('whoosh', S + B.if + .1, .5); sfx('pop', S + B.if + .2, .6); sfx('pop', S + B.if + .45, .6);
  sfx('riser', S + B.must, .5); sfx('whoosh', S + B.fastest - .15, .8); sfx('ding', S + B.fastest + .2, .7);
  sfx('pop', S + B.force, .8); sfx('sparkle', S + B.force + .9, .8); sfx('pop', S + B.task, .7); sfx('pop', S + B.noDay0, .8);
  sfx('buzz', S + B.noDay + .1, .35); sfx('pop', S + B.but, .6); sfx('success', S + B.rate, .8);

  return function (t) {
    const u = t - S;
    // stamp slams down, then rides up as the header
    const sp = P(u, B.rule + .05, .25), up = E.inOut(P(u, B.if - .3, .5));
    tf(stamp, { s: lerp(2.6, 1, E.in(sp)) * (1 + .06 * Math.max(0, 1 - (u - B.rule - .3) / .25) * (u > B.rule + .3 ? 1 : 0)) * lerp(1, .62, up), o: clamp(sp * 3) * (1 - P(u, B.task - .3, .3)), r: lerp(-14, -6, sp), y: lerp(0, -50, up) + (u > B.rule + .3 && u < B.rule + .55 ? Math.sin(u * 80) * 6 : 0) });
    const phase1 = 1 - P(u, B.task - .3, .4);
    BARS.forEach((b, i) => {
      const g = i === 2 ? E.out(P(u, b.at, .45)) : E.back(P(u, b.at, .7));
      tf(b.el, { sx: Math.max(.001, g), sy: 1, o: clamp((u - b.at) * 6) * phase1, x: 0 });
      b.el.style.boxShadow = i === 2 && u > b.at ? `0 0 ${30 + 10 * Math.sin(u * 6)}px rgba(255,210,63,.7)` : '0 10px 22px rgba(0,0,0,.35)';
    });
    tf(spd, { ...life(u, B.if + .3, B.task - .3, { from: .6, dy: 20 }) });
    tf(fastest, { ...life(u, B.fastest + .2, B.task - .3, { from: .3, dy: 20, el: true, d: .7 }) });
    // muscles: two arms of help merge into one bigger strength
    const mg = E.inOut(P(u, B.force + .5, .5));
    const ml = life(u, B.force, B.task - .3, { from: .3, dy: 40 });
    tf(m1, { ...ml, x: lerp(0, 140, mg), o: ml.o * (1 - mg) }); tf(m2, { ...ml, x: lerp(0, -140, mg), o: ml.o * (1 - mg) });
    tf(mp, { ...ml, o: ml.o * (1 - mg) });
    const mb = life(u, B.force + .9, B.task - .3, { from: .2, dy: 0, el: true, d: .8 });
    tf(mBig, { ...mb, s: mb.s * (1 + .04 * Math.sin(u * 5)) });
    tf(task, pop(u, B.task)); tf(noDay, life(u, B.noDay0, 1e9, { from: .6, dy: 40 }));
    strike.style.transform = `scaleX(${E.out(P(u, B.noDay + .05, .3))})`;
    tf(but, life(u, B.but, 1e9, { from: .6, dy: 30 }));
    const rl = life(u, B.rate, 1e9, { from: .3, dy: 30, el: true, d: .9 });
    tf(rate, { ...rl, s: rl.s * (1 + .02 * Math.sin(u * 4)) });
    tf(rateBox, life(u, B.each + .3, 1e9, { from: .5, dy: 30 }));
    rbs.forEach((r, i) => { r.style.background = i < 2 || (u > B.rate + .3 && i < 4 && ((Math.floor((u - B.rate) * 1.6) % 2) === 0 || i < 2)) ? (i < 2 ? '#2F6BFF' : '#22D3EE') : 'rgba(255,255,255,.15)'; });
  };
};
