// SCENES 05–07 — QUIZ (05_quiz.mp3) → EXACT 5 s COUNTDOWN (silent, 150 frames) → ANSWER (06_answer.mp3)
// The correct option stays neutral until the answer narration says "ข้อ ค" (B.ans.reveal, after the countdown).
(function () {
  const q = B.quiz, a = B.ans;
  add('s5', `<div id="q-hdr" class="col c crit" style="top:376px"><div class="pillH" style="font-size:34px;padding:10px 30px"><span id="q-hdrtx">เตรียมสอบนายสิบ<span style="opacity:.6"> | </span>วิชาคณิตศาสตร์</span></div></div>`);
  const QL = ['มีผู้สมัคร <b class="nT">360</b> คน', 'เรียนคอมพิวเตอร์ <b class="nA">230</b> คน', 'เรียนกฎหมาย <b class="nB">190</b> คน', 'และไม่เรียนเลยทั้งสองวิชา <b class="nO">50</b> คน', 'จะมีคนที่เรียน<b>ทั้งสองวิชา</b>กี่คน?'];
  add('s5', `<div id="q-card" class="qcard2 c crit" style="top:466px"><div id="q-text" style="font-size:37px;font-weight:600;line-height:1.42">${QL.map((s, i) => `<span class="qline">${s}</span>`).join('')}</div></div>`);
  const qLines = [...document.querySelectorAll('#q-text .qline')];
  add('s5', `<div id="q-opts"></div>`);
  const qOpts = NSP.buildQuizOptions($('q-opts'), M.OPTIONS.map(([l, v]) => [l, `${v} คน`]), { top: 818, gap: 110 });
  qOpts.forEach(o => o.el.classList.add('crit'));
  add('s5', `<div id="q-hint" class="col c crit" style="top:1262px"><div class="pillW" style="font-size:40px;font-weight:800;padding:14px 32px;color:#8A5A00;box-shadow:0 0 0 5px #FFB020,0 10px 22px rgba(200,140,0,.25)">${IC.warn(42, '#FFB020')}อย่าลืมคนที่อยู่นอกวง!</div></div>`);
  add('s5', `<div id="q-think" class="col c crit" style="top:1262px"><div class="pillH" style="font-size:40px;padding:14px 34px">${ICON.timer(44, '#fff')}ให้เวลาคิด 5 วินาที!</div></div>`);
  add('s5', `<div id="q-cd" class="abs c crit" style="left:458px;top:1240px"></div>`);
  const qCd = NSP.buildCountdown($('q-cd'), 164);
  add('s5', `<div id="q-mas" class="mas" style="left:-20px;top:1150px"><img src="../../shared/brand/mascot_presenter.png" style="height:380px"></div>`);
  // reveal
  add('s5', `<div id="a-ban" class="abs c crit box grn" style="left:248px;top:1246px;width:584px;height:150px;display:flex;align-items:center;justify-content:center;gap:18px">
     <div style="width:84px;height:84px;border-radius:50%;background:#22C55E;display:grid;place-items:center;flex:none">${ICON.check('#fff', 56)}</div>
     <div style="line-height:1.15"><div style="font-size:38px;font-weight:800;color:#16A34A">เฉลย!</div><div style="font-size:52px;font-weight:800">ข้อ ค. <span class="nG">110</span> คน</div></div></div>`);
  add('s5', `<div id="a-conf"></div>`);
  const aConf = NSP.buildConfetti($('a-conf'), 60, 540, 860);
  add('s5', `<div id="a-masJ" class="mas" style="left:858px;top:1060px"><img src="../../shared/brand/mascot_pose.png" style="height:420px"></div>`);
  // compact answer chip that stays during the explanation
  add('s5', `<div id="a-chip" class="col c crit" style="top:466px"><div class="pillW" style="font-size:38px;font-weight:800;padding:10px 30px;color:#fff;background:linear-gradient(90deg,#16A34A,#22C55E);box-shadow:0 10px 22px rgba(34,197,94,.35)"><span id="a-chiptx">${ICON.check('#fff', 40)}เฉลย ข้อ ค. 110 คน</span></div></div>`);
  // step-by-step calculation
  const calc = add('s5', `<div id="a-calc" class="abs c crit box" style="left:248px;top:560px;width:584px;height:470px"></div>`);
  const ROWS = [
    { tag: '① คนที่เรียนอย่างน้อย 1 วิชา', col: '#16A34A', eq: [['360', 'nT', a.tot], ['−', 'op', a.minus], ['50', 'nO', a.n50], ['=', 'op', a.n310], ['310', 'nG', a.n310]] },
    { tag: '② คอมพิวเตอร์ + กฎหมาย', col: '#2F6BFF', eq: [['230', 'nA', a.comp], ['+', 'op', a.law], ['190', 'nB', a.law], ['=', 'op', a.n420], ['420', 'nR', a.n420]] },
    { tag: '③ ลบคนที่อยู่ในวง (อย่างน้อย 1 วิชา)', col: '#B07F00', eq: [['420', 'nR', a.sub], ['−', 'op', a.sub], ['310', 'nG', a.sub + .5], ['=', 'op', a.n110], ['110', 'nG', a.n110]] },
  ];
  ROWS.forEach((r, i) => {
    r.el = h(`<div class="abs c" style="left:0;right:0;top:${24 + i * 148}px;height:136px"><div style="text-align:center;font-size:28px;font-weight:700;color:${r.col}">${r.tag}</div>
      <div class="eq" style="font-size:${i === 2 ? 78 : 70}px;margin-top:10px">${r.eq.map(([s, c]) => `<span class="n ${c}">${s}</span>`).join('')}</div></div>`);
    calc.appendChild(r.el); r.parts = [...r.el.querySelectorAll('.eq .n')];
  });
  const box110 = ROWS[2].parts[4];
  add('s5', `<div id="a-why" class="abs c crit box yel" style="left:248px;top:1068px;width:584px;height:150px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.3">
     <div style="font-size:34px;font-weight:700">ส่วนที่เกินมา = คนที่ถูก<b style="color:#EF4444">นับซ้ำ</b></div><div style="font-size:44px;font-weight:800">= เรียนทั้งสองวิชา <span class="nG">110</span> คน</div></div>`);
  // final Venn
  const vEl = add('s5', `<div id="a-venn" class="abs c" style="left:220px;top:560px"></div>`);
  const V = VENN.build(vEl);
  vEl.querySelectorAll('.vn-v,.vn-vout,.vn-tagU,.vn-nA,.vn-nB').forEach(e => e.classList.add('crit'));
  add('s5', `<div id="a-sum" class="col c crit" style="top:1110px"><div class="pillW" style="font-size:40px;font-weight:800;padding:12px 28px;gap:8px"><span class="nA">120</span>+<span style="color:#B07F00">110</span>+<span class="nB">80</span>+<span class="nO">50</span>=<span class="nT">360</span><span style="width:46px;height:46px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${ICON.check('#fff', 32)}</span></div></div>`);
  // why 60 is wrong
  add('s5', `<div id="a-wrong" class="abs c crit box red" style="left:248px;top:1086px;width:584px;height:318px">
     <div style="position:absolute;left:0;right:0;top:20px;display:flex;align-items:center;justify-content:center;gap:16px;font-size:40px;font-weight:800"><span class="xmark" style="position:relative;width:62px;height:62px;box-shadow:0 0 0 4px #fff">${ICON.cross('#fff', 38)}</span>ตอบ ก. 60 คน = ผิด!</div>
     <div id="a-weq" class="eq" style="position:absolute;left:0;right:0;top:108px;font-size:52px"><span class="nA">230</span><span class="op">+</span><span class="nB">190</span><span class="op">−</span><span class="nT" id="a-w360" style="position:relative">360<svg style="position:absolute;left:-10px;top:18px" width="120" height="20" viewBox="0 0 130 20"><path id="a-wstrike" d="M4 14 L126 6" stroke="#EF4444" stroke-width="8" stroke-linecap="round" stroke-dasharray="130" stroke-dashoffset="130"/></svg></span><span class="op">=</span><span class="nR">60</span></div>
     <div id="a-wwhy" style="position:absolute;left:0;right:0;top:196px;text-align:center;font-size:36px;font-weight:700;line-height:1.3">ลืมหัก <b class="nO" style="font-size:44px">50</b> คนที่อยู่นอกวง<br>ออกก่อน!</div></div>`);
  // memory tip
  add('s5', `<div id="a-tip" class="abs c crit box" style="left:248px;top:1086px;width:584px;height:318px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;text-align:center">
     <div style="display:flex;align-items:center;gap:12px;font-size:36px;font-weight:800;color:#2F6BFF">${IC.bulb(44, '#F2B705')}จำไว้!</div>
     <div style="font-size:42px;font-weight:800;line-height:1.3">โจทย์เซต<br>ต้องดู<span style="color:#C27C00">คนอยู่นอกวง</span>ด้วย</div>
     <div id="a-tipf" style="font-size:28px;font-weight:700;padding:10px 20px;border-radius:22px;background:#FFF6D6;box-shadow:inset 0 0 0 3px #FFD23F;white-space:nowrap">สูตร: A ∩ B = A + B − (อย่างน้อยหนึ่งวิชา)</div></div>`);

  const OPT_AT = q.opts, REV = AN + a.reveal, SHIFT = a.how;
  sfx('pop', QS + q.start + .1, .7); sfx('pop', QS + q.lines[0], .8);
  q.lines.forEach((x, i) => i && sfx('click', QS + x, .25));
  OPT_AT.forEach(x => sfx('pop', QS + x, .85)); sfx('pop', QS + q.hint, .7); sfx('pop', QS + q.think, .7);
  for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', CD + i, 1);
  sfx('ding', AN + .05, .5); sfx('ding', REV, 1); sfx('success', REV + .05, 1); sfx('sparkle', REV + .3, .7);
  sfx('whoosh', AN + SHIFT, .5);
  ROWS.forEach(r => r.eq.forEach(([, c, x], j) => c !== 'op' && sfx('pop', AN + x, .55)));
  sfx('success', AN + a.n110 + .05, .7); sfx('pop', AN + a.n110 + 1.6, .6);
  sfx('whoosh', AN + a.both - .15, .5); sfx('sparkle', AN + a.both + .4, .6); for (let i = 0; i < 4; i++) sfx('pop', AN + a.both + .5 + i * .35, .6); sfx('success', AN + a.both + 2.0, .5);
  sfx('buzz', AN + a.wrong + .1, .6); sfx('stamp', AN + a.wrong + 1.3, .5); sfx('pop', AN + a.why, .7);
  sfx('ding', AN + a.remember, .6); sfx('pop', AN + a.tip, .6); sfx('sparkle', AN + a.exam, .5);

  const ROW_END = a.both - .2;
  window.drawQuiz = function (t) {
    const u = t - QS, ua = t - AN, uc = t - CD, rv = t - REV, ans = ua >= 0, revealed = rv >= 0;
    const sh = ans ? E.inOut(P(ua, SHIFT, .7)) : 0;
    // header: exam header → "หมดเวลา!" → "เฉลย!"
    const hl = life(u, 0, ua > SHIFT ? SHIFT + .1 : 1e9, { from: .5, dy: -30, out: .3 });
    tf($('q-hdr'), { ...hl, s: hl.s * (1 + .08 * Math.max(0, 1 - Math.abs(ua - .1) / .3)) });
    $('q-hdrtx').innerHTML = revealed ? 'เฉลย!' : ans ? 'หมดเวลา!' : 'เตรียมสอบนายสิบ<span style="opacity:.6"> | </span>วิชาคณิตศาสตร์';
    // question card + line-by-line reading highlight
    const qc = life(u, q.lines[0] - .3, 1e9, { from: .6, dy: 50 });
    tf($('q-card'), { ...qc, y: qc.y - 60 * sh, o: qc.o * (1 - sh) });
    qLines.forEach((l, i) => {
      const s0 = q.lines[i], s1 = i < 4 ? q.lines[i + 1] : 15.6, on = u >= s0 && u < s1 + .1;
      l.style.background = on ? `linear-gradient(90deg,rgba(248,207,226,.95) ${P(u, s0, Math.max(.6, s1 - s0 - .2)) * 100}%,rgba(248,207,226,.35) 0)` : 'transparent';
      l.style.color = u < s0 ? '#9AA6BA' : '';
    });
    NSP.drawQuizOptions(qOpts, u, rv, OPT_AT, M.correctIndex, { shiftY: -40 * sh, enterX: 36 });
    qOpts.forEach(o => { o.el.style.opacity = +o.el.style.opacity * (1 - sh); });
    // thinking prompts + countdown (question and choices stay on screen)
    tf($('q-hint'), life(u, q.hint, q.think - .1, { from: .3, dy: 20, el: true }));
    tf($('q-think'), life(u, q.think, D('quiz') - .05, { from: .3, dy: 20, el: true }));
    NSP.drawCountdown(qCd, uc, T.cd[1]);
    masDraw($('q-mas'), u, q.hint - .2, AN + SHIFT - QS, { amp: 5 });
    // reveal
    tf($('a-ban'), { ...life(rv, 0, SHIFT - a.reveal, { from: .3, dy: 30, el: true, d: .8, out: .3 }) });
    NSP.drawConfetti(aConf, t, REV + .05, 2.6);
    masDraw($('a-masJ'), rv, .1, a.both - a.reveal, { amp: 4, jump: 26 * (1 - P(rv, 2.4, .8)) });
    tf($('a-chip'), life(ua, SHIFT + .2, 1e9, { from: .4, dy: -20, el: true }));
    if (ans) $('a-chiptx').innerHTML = ua >= a.exam ? `${IC.warn(38)}ข้อนี้อย่าพลาดในห้องสอบ!` : `${ICON.check('#fff', 40)}เฉลย ข้อ ค. 110 คน`;
    // calculation rows: each number lands as it is spoken
    tf(calc, life(ua, SHIFT + .3, ROW_END, { from: .6, dy: 50, out: .3 }));
    ROWS.forEach(r => r.parts.forEach((p, j) => { p.style.display = 'inline-block'; tf(p, life(ua, r.eq[j][2], 1e9, { from: .3, dy: 20, el: j % 2 === 0 })); }));
    box110.style.background = ua > a.n110 ? '#DCFCE7' : ''; box110.style.borderRadius = '18px'; box110.style.padding = '0 10px';
    box110.style.boxShadow = ua > a.n110 ? `0 0 0 ${4 + 2 * Math.sin(ua * 5)}px #22C55E` : '';
    tf($('a-why'), life(ua, a.n110 + 1.6, ROW_END, { from: .4, dy: 30, out: .3 }));
    // final Venn: 120 | 110 | 80 | outside 50
    const vb = ua - a.both;
    tf(vEl, { s: .92 * lerp(.8, 1, E.back(P(vb, 0, .7))), o: clamp(vb * 3), y: -20 });
    V.set({
      t: ua, u: 1, ca: P(vb, 0, .6), cb: P(vb, .1, .6), na: P(vb, .2, .5), nb: P(vb, .3, .5), tagU: P(vb, .1, .5), tagUtx: 'ผู้สมัครทั้งหมด 360 คน',
      cntA: ' 230', cntB: ' 190',
      dots: { a: P(vb, .3, .6), ab: P(vb, .3, .6), b: P(vb, .3, .6), out: P(vb, .3, .6) }, dotDim: P(vb, .5, .4),
      hiAB: P(vb, .5, .5), hiOut: P(ua, a.why, .4) * (1 - P(ua, a.remember + 1.5, .5)),
      vals: { a: P(vb, .5, .8), ab: P(vb, .85, .8), b: P(vb, 1.2, .8), out: P(vb, 1.55, .6) }, valTx: { a: M.computerOnly, ab: M.both, b: M.lawOnly },
    });
    tf($('a-sum'), life(vb, 2.0, a.wrong - a.both - .1, { from: .4, dy: 20, el: true }));
    // wrong path 60
    const wr = life(ua, a.wrong, a.remember - .1, { from: .85, dy: 40, out: .25 });
    tf($('a-wrong'), { ...wr, x: ua > a.wrong && ua < a.wrong + .45 ? Math.sin(ua * 55) * 4 : 0 });
    document.getElementById('a-wstrike').setAttribute('stroke-dashoffset', 130 * (1 - E.out(P(ua, a.wrong + 1.3, .4))));
    tf($('a-wwhy'), life(ua, a.why, 1e9, { from: .5, dy: 20 }));
    // memory tip
    tf($('a-tip'), life(ua, a.remember, 1e9, { from: .5, dy: 40, el: true, d: .8 }));
    tf($('a-tipf'), life(ua, a.tip, 1e9, { from: .4, dy: 20 }));
  };
})();
