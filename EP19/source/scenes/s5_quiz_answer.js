// SCENE 5 — QUIZ (05_quiz.mp3) + exact 150-frame silent COUNTDOWN + ANSWER (06_answer.mp3).
// Four identical cards (no highlight before the reveal); answer ค revealed on "ข้อ ค!" after the countdown;
// ก / ข / ง explained one by one; recap returns to the two-page comparison with the memory phrase.
(function () {
  const { clamp, lerp, E, P, tf, life, bob, h, sfx, ICON } = NSP;
  const X = EP19, A = X.S('quiz'), CD = X.S('cd'), AN = X.S('ans');
  const bq = i => X.B('quiz', i), ba = i => X.B('ans', i), wa = (i, s) => X.W('ans', i, s);
  const el = document.getElementById('s5');
  const OPTS = [
    ['ก', 'หนังสือภายนอก ครุฑสูง 1.5 ซม.', 'วางกึ่งกลางด้านบน'],
    ['ข', 'บันทึกข้อความ ครุฑสูง 3 ซม.', 'วางมุมบนซ้าย'],
    ['ค', 'หนังสือภายนอก ครุฑสูง 3 ซม.', 'วางกึ่งกลางด้านบน'],
    ['ง', 'บันทึกข้อความ ครุฑสูง 1.5 ซม.', 'วางกึ่งกลางด้านบน'],
  ];
  const CORRECT = 2;                                             // ค. — fixed by the approved script
  const TOP0 = 612, STEP = 150, SHIFT = 200;
  el.innerHTML = `
    <div id="q-quiz" class="abs" style="inset:0">
      <div id="q-band" class="abs" style="left:-60px;top:300px;width:1200px;height:96px;transform:skewX(-12deg);background:linear-gradient(90deg,#FF2E63,#FF4D7E 60%,#FF7A9C);box-shadow:0 14px 30px rgba(255,46,99,.4)"></div>
      <div id="q-bandG" class="abs" style="left:-60px;top:300px;width:1200px;height:96px;transform:skewX(-12deg);background:linear-gradient(90deg,#16A34A,#22C55E 60%,#4ADE80);box-shadow:0 14px 30px rgba(34,197,94,.4)"></div>
      <div id="q-bt1" class="row" style="top:300px;height:96px;gap:22px"><span class="kt" style="font-weight:800;font-size:66px;color:#fff;letter-spacing:4px">QUIZ</span><span class="kt" style="font-weight:700;font-size:50px;color:#fff">ถึงเวลาทดสอบ!</span></div>
      <div id="q-bt2" class="row" style="top:300px;height:96px"><span class="kt" style="font-weight:800;font-size:62px;color:#fff">เฉลย...</span></div>
      <div id="q-bt3" class="row" style="top:300px;height:96px;gap:16px"><span class="kt" style="font-weight:800;font-size:62px;color:#fff">เฉลย ข้อ ค.</span><span class="xic" style="width:62px;height:62px">${ICON.check('#16A34A', 46)}</span></div>
      <div id="q-qc" class="card9" style="left:190px;top:410px;width:680px;height:182px">
        <div id="q-l1" class="row kt" style="left:0;width:680px;top:12px;font-weight:800;font-size:62px;line-height:1.3">ข้อใดกล่าว<span class="yl">ถูกต้อง</span></div>
        <div id="q-l2" class="row kt" style="left:0;width:680px;top:92px;font-weight:800;font-size:62px;line-height:1.3">เกี่ยวกับการใช้ตราครุฑ</div>
      </div>
      <div id="q-opts"></div>
      <div id="q-think" class="row" style="top:1262px"><div class="pill2 p-yl kt" style="font-size:52px">${ICON.timer(52, '#1B1300')}ให้เวลาคิด 5 วินาที!</div></div>
      <div id="q-cd" class="abs" style="left:435px;top:1210px"></div>
      <div id="q-pan" class="card9" style="left:150px;top:1020px;width:780px;height:400px"></div>
      <div id="q-conf"></div>
    </div>
    <div id="q-rec" class="abs" style="inset:0">
      <div id="q-easy" class="row" style="top:1032px"><div class="pill2 p-wh kt" style="font-size:44px">จำไว้เลย...</div></div>
      <div id="q-m1" class="row" style="top:1112px;gap:6px"><span class="big yl kt q-w" style="font-size:104px">ใหญ่</span><span class="big yl kt q-w" style="font-size:104px">อยู่</span><span class="big yl kt q-w" style="font-size:104px">กลาง</span></div>
      <div id="q-m2" class="row" style="top:1258px;gap:6px"><span class="big yl kt q-w" style="font-size:104px">เล็ก</span><span class="big yl kt q-w" style="font-size:104px">อยู่</span><span class="big yl kt q-w" style="font-size:104px">ซ้าย!</span></div>
    </div>`;
  const q = s => el.querySelector(s);
  // ---- choice cards (identical until the reveal) ----
  const opts = OPTS.map(([c, l1, l2], i) => {
    const e = h(`<div class="qopt" style="top:${TOP0 + i * STEP}px"><div class="ov"></div><div class="bd">${c}</div><div class="tx kt">${l1}<br>${l2}</div><div class="mk"></div></div>`);
    q('#q-opts').appendChild(e);
    return { e, ov: e.querySelector('.ov'), bd: e.querySelector('.bd'), mk: e.querySelector('.mk') };
  });
  const OPT_AT = [bq(3), bq(6), bq(10), bq(14)];
  const cd = NSP.buildCountdown(q('#q-cd'), 210);
  const conf = NSP.buildConfetti(q('#q-conf'), 46, 540, TOP0 + CORRECT * STEP + 66);
  // ---- explanation panel: mini A4 diagram (left) + text column (right) per beat ----
  const MW = 236, MCM = MW / 21 * 2;                             // same 2× emblem scale as the other diagrams
  const mini = (memo) => { const p = X.a4(MW, { top: memo ? .32 : .42, rows: memo ? 9 : 8 }); p.style.left = '30px'; p.style.top = '32px'; return p; };
  const panes = [];
  function pane(memo, lines, emblem) {
    const pn = h(`<div class="abs" style="inset:0"></div>`), pg = mini(memo); pn.appendChild(pg);
    const gh = memo ? 1.5 * MCM : 3 * MCM;
    const g = h(`<div class="abs" style="left:0;top:0;width:${gh * X.GR}px;height:${gh}px">${X.gar(gh)}</div>`); pg.appendChild(g);
    const fin = memo ? { x: 12, y: 16 } : { x: MW / 2 - gh * X.GR / 2, y: 2.5 * MCM };
    const items = lines.map(([html, top]) => { const it = h(`<div class="abs" style="left:282px;width:430px;top:${top}px;display:flex;justify-content:center">${html}</div>`); pn.appendChild(it); return it; });
    q('#q-pan').appendChild(pn);
    const o = { pn, pg, g, gh, fin, items, emblem }; panes.push(o); return o;
  }
  const big = (s, fs = 54) => `<div class="big kt" style="font-size:${fs}px">${s}</div>`;
  const xIc = s => `<span class="xic" style="width:${s}px;height:${s}px">${ICON.cross('#EF4444', s * .72)}</span>`;
  const pC = pane(false, [[`<div class="pill2 p-eb kt" style="font-size:44px">หนังสือภายนอก</div>`, 52], [big('ครุฑสูง <span class="yl">3 ซม.</span>'), 150], [big('วางกึ่งกลางด้านบน', 46), 252]]);
  const pA = pane(true, [[`<div class="pill2 p-rd kt" style="font-size:50px">ขนาดผิด ${xIc(50)}</div>`, 48], [big('<span class="cy">1.5 ซม.</span>', 62), 150], [big('ใช้กับบันทึกข้อความ', 46), 252]]);
  const pB = pane(true, [[`<div class="pill2 p-rd kt" style="font-size:50px">ขนาดผิด ${xIc(50)}</div>`, 48], [big('บันทึกข้อความ', 50), 150], [big('ใช้ครุฑ <span class="cy">1.5 ซม.</span>', 50), 252]]);
  const pD = pane(true, [[`<div class="pill2 p-rd kt" style="font-size:50px">ตำแหน่งผิด ${xIc(50)}</div>`, 48], [big('บันทึกข้อความ', 50), 150], [big('ต้องวาง<span class="cy">มุมบนซ้าย</span>', 50), 252]]);
  // ---- recap: two-page comparison returns ----
  const cmp = X.comparePages(q('#q-rec'));
  const recW = [...el.querySelectorAll('.q-w')];

  const AREV = ba(1);
  const T = { q1: bq(1), q2: bq(2), think: bq(18), shift: ba(2) - .2, recap: ba(17) };
  const PH = [ // [pane, from, to, item times, card index or -1]
    [pC, ba(2), ba(5), [ba(2), ba(3), ba(4)], -1],
    [pA, ba(5), ba(9), [ba(6), ba(7), ba(8)], 0],
    [pB, ba(9), ba(13), [ba(10), ba(11), ba(12)], 1],
    [pD, ba(13), ba(17), [ba(14), ba(15), ba(16)], 3],
  ];
  const recT = [X.W('ans', 18, 'ใหญ่'), X.W('ans', 18, 'อยู่'), X.W('ans', 18, 'กลาง'), X.W('ans', 19, 'เล็ก'), X.W('ans', 19, 'อยู่'), X.W('ans', 19, 'ซ้าย')];
  // sound
  sfx('swoosh', A + .02, .6); sfx('pop', A + .3, .8); sfx('pop', T.q1 + .05, .6); sfx('pop', T.q2 + .05, .6);
  OPT_AT.forEach(a => { sfx('whoosh', a - .05, .35); sfx('pop', a + .1, .7); });
  sfx('pop', T.think + .05, .7);
  for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', CD + i, 1);
  sfx('riser', AN - .05, .35); sfx('pop', AN + .1, .5);
  sfx('ding', AREV, 1); sfx('success', AREV + .05, 1); sfx('sparkle', AREV + .3, .7);
  sfx('swoosh', T.shift, .4);
  PH.forEach(([, from, , it, ci]) => { sfx('pop', from + .05, .4); it.forEach(a => sfx('pop', a + .05, .55)); if (ci >= 0) sfx('err', it[0] + .05, .9); });
  sfx('whoosh', PH[3][3][2] + .1, .5); sfx('click', PH[3][3][2] + .55, .7);
  sfx('swoosh', T.recap, .5); recT.forEach(a => sfx('pop', a + .03, .5)); sfx('sparkle', recT[2] + .2, .5); sfx('sparkle', recT[5] + .2, .6);

  function draw(t) {
    const u = t - A, ua = t - AN;
    const rec = E.inOut(P(t, T.recap, .6));
    tf(q('#q-quiz'), { o: 1 - rec, s: 1 - .06 * rec });
    tf(q('#q-rec'), { o: rec, y: (1 - rec) * 60 });
    // banner: QUIZ (pink) -> เฉลย... -> เฉลย ข้อ ค. (green)
    const bi = E.out(P(t, A, .55));
    q('#q-band').style.transform = `translateX(${lerp(-1300, 0, bi)}px) skewX(-12deg)`;
    q('#q-bandG').style.transform = `translateX(${lerp(-1300, 0, E.out(P(t, AREV, .45)))}px) skewX(-12deg)`;
    tf(q('#q-bt1'), { ...life(t, A + .2, AN, { from: .4, dy: 0, d: .45, el: true, out: .2 }), y: 0 });
    tf(q('#q-bt2'), { ...life(t, AN, AREV, { from: .4, dy: 0, d: .4, out: .15 }), y: 0 });
    tf(q('#q-bt3'), life(t, AREV, 1e9, { from: .3, dy: 0, d: .5, el: true }));
    // question: line by line, leaves when the explanation needs the room
    const sh = E.inOut(P(t, T.shift, .6));
    tf(q('#q-qc'), { ...life(t, T.q1 - .1, 1e9, { from: .7, dy: 40, d: .45 }), o: clamp((t - T.q1 + .1) / .2) * (1 - sh) });
    tf(q('#q-l1'), life(t, T.q1, 1e9, { from: .6, dy: 20, d: .4 }));
    tf(q('#q-l2'), life(t, T.q2, 1e9, { from: .6, dy: 20, d: .4 }));
    // cards: enter on their spoken letter, then stay perfectly still (no hint) until the reveal
    const rv = t - AREV, revealed = rv >= 0;
    opts.forEach((o, i) => {
      const pi = P(t, OPT_AT[i], .5), x = (1 - E.out(pi)) * 140;
      let s = 1, op = clamp((pi - .1) * 2), dim = 0;
      o.ov.style.opacity = 0; o.mk.style.opacity = 0; o.e.style.boxShadow = ''; o.bd.style.background = '';
      if (revealed) {
        if (i === CORRECT) {
          s = 1 + .08 * E.back(P(rv, 0, .5));
          o.ov.style.background = 'linear-gradient(180deg,#22C55E,#16A34A)'; o.ov.style.opacity = clamp(rv / .2);
          o.bd.style.background = 'radial-gradient(circle at 35% 30%,#86EFAC,#15803D 72%)';
          o.mk.innerHTML = ICON.check('#16A34A', 54); o.mk.style.opacity = clamp(rv / .1);
          o.mk.style.transform = `scale(${lerp(0, 1, E.elastic(P(rv, .05, .8)))})`;
          o.e.style.boxShadow = `0 0 0 4px #fff,0 0 ${40 + 14 * Math.sin(rv * 3)}px 10px rgba(34,197,94,.55)`;
        } else {
          dim = .6 * E.out(P(rv, 0, .4));
          const ph = PH.find(p => p[4] === i);
          if (ph) {
            const on = E.out(P(t, ph[1], .25)) * (1 - E.out(P(t, ph[2], .35)));    // briefly back to full while explained
            dim *= 1 - on;
            const xm = t >= ph[3][0];
            if (xm) { o.mk.innerHTML = ICON.cross('#EF4444', 50); o.mk.style.opacity = 1; o.mk.style.transform = `scale(${lerp(0, 1, E.elastic(P(t, ph[3][0], .7)))})`; }
            o.e.style.boxShadow = on > .01 ? `0 0 0 ${3 + 2 * on}px rgba(239,68,68,${.4 + .6 * on}),0 14px 30px rgba(0,0,0,.4)` : (xm ? '0 0 0 3px rgba(239,68,68,.45),0 14px 30px rgba(0,0,0,.4)' : '');
            s = 1 + .03 * on;
          }
        }
      }
      tf(o.e, { x, y: -SHIFT * sh, s, o: op * (1 - dim) });
    });
    // "ให้เวลาคิด 5 วินาที!" then the countdown: exactly 30 frames per number (frame-snapped clock)
    tf(q('#q-think'), life(t, T.think, CD, { from: .4, dy: 30, d: .45, el: true, out: .2 }));
    const uc = Math.round((t - CD) * TL.fps) / TL.fps;
    NSP.drawCountdown(cd, uc, TL.cd[1]);
    NSP.drawConfetti(conf, t, AREV + .05, 2.4);
    // explanation panel
    tf(q('#q-pan'), { o: clamp((t - T.shift - .3) / .3), y: (1 - E.out(P(t, T.shift + .3, .5))) * 120 });
    PH.forEach(([p, from, to, it]) => {
      tf(p.pn, { o: clamp((t - from) / .2) * (1 - clamp((t - to + .1) / .2)), x: (1 - E.out(P(t, from, .4))) * 60 });
      p.items.forEach((e, j) => tf(e, life(t, it[j], 1e9, { from: .4, dy: 24, d: .45, el: j === 0 })));
      // emblem: pops into its regulation spot; the ง page shows the wrong (centre) spot first, then moves top-left
      let gx = p.fin.x, gy = p.fin.y;
      if (p === pD) { const k = X.snap(P(t, it[2] + .1, .5)); gx = lerp(MW / 2 - p.gh * X.GR / 2, p.fin.x, k); gy = lerp(2.5 * MCM, p.fin.y, k); }
      const gi = life(t, from + .15, 1e9, { from: .2, dy: 0, d: .5, el: true });
      tf(p.g, { x: gx, y: gy, s: gi.s, o: gi.o });
    });
    // recap: memory phrase word by word, held into the promo hand-off
    tf(cmp.L, { y: (1 - E.out(P(t, T.recap, .6))) * 120 }); tf(cmp.R, { y: (1 - E.out(P(t, T.recap + .1, .6))) * 120 });
    tf(cmp.gl, { s: 1 + .1 * Math.max(0, Math.sin(Math.PI * P(t, recT[0], 1.2))) });
    tf(cmp.gs, { s: 1 + .18 * Math.max(0, Math.sin(Math.PI * P(t, recT[3], 1.2))) });
    tf(q('#q-easy'), life(t, T.recap, 1e9, { from: .5, dy: 30, d: .45 }));
    recW.forEach((e, i) => { const l = life(t, recT[i] - .04, 1e9, { from: .2, dy: 60, d: .5, el: true }); tf(e, { ...l, s: l.s * (1 + .03 * Math.sin((t - recT[i]) * 4)) }); });
  }
  window.SC = window.SC || {};
  SC.quiz = { el, a: A, b: X.S('promo') + .6, draw };
})();
