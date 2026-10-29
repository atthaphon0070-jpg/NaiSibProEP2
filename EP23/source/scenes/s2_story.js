// SCENE 2 — STORY (02_story.mp3). Report (walkie-talkie + case folder + "คดีด่วน") → a newbie's box of parts
// opens → the built PC stays dark with "?" → lineup wall; the five suspects walk in exactly on their spoken
// names holding cards 1–5 → "ใครคือตัวการ?" nervous wobble → spotlight snaps on for the interrogation.
SC.story = function (root) {
  const { h, tf, life, clamp, lerp, E, P, sfx, ICON: NI } = NSP;
  const { T, A, layer, pop, SUS, mini } = EP23, B = BEATS.story, S = T.story0, I = CASE.ICON;
  const mid = layer(root), fg = layer(root), ov = layer(root, 5);

  // ---------- A: report ----------
  const walkie = A(mid, 270, 900, `<div style="position:relative">${I.walkie(260)}</div>`);
  const waves = [0, 1, 2].map(i => A(mid, 330, 760, `<div style="width:${90 + i * 60}px;height:${90 + i * 60}px;border-radius:50%;border:8px solid #22D3EE;border-left-color:transparent;border-bottom-color:transparent;transform:rotate(-10deg)"></div>`));
  const rep = CASE.folder({ w: 440, hgt: 540, tab: 'แจ้งเหตุ', who: 'รับแจ้ง', th: 'คอมเปิดไม่ติด!', photo: `<div style="position:absolute;inset:0;display:grid;place-items:center">${I.power(110, '#FFD23F')}</div>` });
  const repW = A(mid, 640, 930, ''); repW.firstChild.appendChild(rep.el); rep.el.style.left = '-220px'; rep.el.style.top = '-270px';
  rep.el.dataset.sus = 'report';
  const urgent = CASE.stamp('คดีด่วน', 'red', 70, -10); rep.stampBox.appendChild(urgent);
  const lblTip = A(ov, 540, 400, `<div class="pill2 chipH">สายสืบได้รับแจ้งเหตุ</div>`);

  // ---------- B: newbie builds a PC (box of parts on a desk) ----------
  const desk = h(`<div class="abs" style="left:90px;top:1250px;width:900px;height:40px;border-radius:12px;background:#7A5230;border:5px solid #0B1A3A;box-shadow:0 20px 40px rgba(0,0,0,.45)"></div>`); mid.appendChild(desk);
  const boxW = A(mid, 540, 1110, `<div style="position:relative;width:340px;height:260px">
      <div class="lidL" style="position:absolute;left:10px;top:40px;width:160px;height:34px;background:#D9A76A;border:5px solid #0B1A3A;border-radius:6px;transform-origin:5px 50%"></div>
      <div class="lidR" style="position:absolute;right:10px;top:40px;width:160px;height:34px;background:#D9A76A;border:5px solid #0B1A3A;border-radius:6px;transform-origin:calc(100% - 5px) 50%"></div>
      <div style="position:absolute;left:10px;top:66px;width:320px;height:190px;background:#C8955A;border:5px solid #0B1A3A;border-radius:8px"></div>
      <div style="position:absolute;left:140px;top:66px;width:60px;height:190px;background:#E0B47A;border-left:5px solid #0B1A3A;border-right:5px solid #0B1A3A"></div></div>`);
  const lidL = boxW.querySelector('.lidL'), lidR = boxW.querySelector('.lidR');
  const parts = SUS.map((s, i) => { const w = A(mid, 540, 1110, `<div style="position:relative;width:0;height:0"></div>`); const m = mini(s.kind, s.num, .7); m.el.style.top = '0'; m.el.style.left = '0'; w.firstChild.firstChild.appendChild(m.el); return w; });
  const lblNew = A(ov, 540, 400, `<div class="pill2 chipH">มือใหม่ <span class="yel">ประกอบคอมเอง</span></div>`);
  // ---------- C: built PC stays dark ----------
  const pc = CASE.pc({ scale: .9 }); const pcW = A(mid, 540, 1060, ''); pcW.firstChild.appendChild(pc.el); pc.el.style.left = '-117px'; pc.el.style.top = '-189px';
  const hand = h(`<div class="abs" style="left:${540 - 59}px;top:${1060 + 126 - 6}px">${NI.hand(130)}</div>`); mid.appendChild(hand);
  const qm = A(fg, 760, 800, `<div class="big yel" style="font-size:220px;-webkit-text-stroke:4px #071330;paint-order:stroke fill">?</div>`);
  const lblPress = A(ov, 540, 400, `<div class="pill2 chipH">${I.power(54, '#FFD23F')}กดเปิดแล้ว…</div>`);
  const lblNo = A(ov, 540, 560, `<div class="pill2 chipR" style="font-size:64px">ไม่ติด!</div>`);

  // ---------- D: lineup ----------
  const lw = h(`<div class="abs" style="inset:0"></div>`); mid.appendChild(lw);
  CASE.lineupWall(lw, { x: 30, y: 600, w: 1020, hgt: 740 });
  lw.appendChild(h(`<div class="abs" style="left:-40px;right:-40px;top:1332px;height:640px;background:linear-gradient(180deg,#1C3566,#0E2148);box-shadow:0 -6px 0 #2A4A86"></div>`));
  const spot = CASE.spotlight(fg, { x: 540, top: 150, floor: 1340, w: 1150 });
  const POS = [140, 340, 540, 740, 940], FEET = 1332;
  const sus = SUS.map(s => { const c = CASE.suspect(s.kind, { num: s.num, scale: 1.15 }); c.el.style.left = '0'; c.el.style.top = FEET + 'px'; fg.appendChild(c.el); return c; });
  const ENTER = [B.psu, B.mb, B.cpu, B.ram, B.hdd];
  const lblCall = A(ov, 540, 356, `<div class="pill2 chipH">เรียกผู้ต้องหาทั้ง <span class="yel">5</span></div>`);
  const lblLine = A(ov, 540, 356, `<div class="pill2 chipY">มาเข้าแถว!</div>`);
  const names = SUS.map(s => A(ov, 540, 475, `<div class="nm"><span class="t">${s.num}. ${s.th}</span><span class="e">${s.en}</span></div>`));
  const lblWho = A(ov, 540, 470, `<div class="pill2 chipR" style="font-size:64px">ใครคือตัวการ?</div>`);
  const lblAsk = A(ov, 540, 470, `<div class="pill2 chipY" style="font-size:64px">มาสอบปากคำกัน!</div>`);

  sfx('radio', S + B.tip, .9); sfx('radio', S + B.tip + .5, .6); sfx('whoosh', S + B.tip + .2, .6); sfx('stamp', S + B.tip + .95, .9);
  sfx('whoosh', S + B.newbie - .1, .6); sfx('cloth', S + B.buy, .6); sfx('page', S + B.build - .05, .7); SUS.forEach((_, i) => sfx('pop', S + B.build + .1 + i * .1, .5));
  sfx('whoosh', S + B.pressed - .1, .5); sfx('click', S + B.pressed + .25, 1); sfx('freeze', S + B.noOn, .5); sfx('pop', S + B.noOn + .1, .7);
  sfx('whoosh', S + B.call - .15, .7); sfx('pop', S + B.line, .8);
  ENTER.forEach(a => { for (let k = 0; k < 4; k++) sfx('step', S + a - .05 + k * .16, .8); sfx('pop', S + a, .5); });
  sfx('buzz', S + B.who, .3); sfx('click', S + B.ask - .05, .9); sfx('riser', S + B.ask, .4);

  return function (t) {
    const u = t - S;
    // A
    const aOut = E.in(P(u, B.newbie - .25, .35));
    tf(lblTip, pop(u, B.tip, B.newbie - .2));
    const wk = life(u, B.tip, 1e9, { from: .4, dy: 60, d: .5 });
    const buzz = u < 1.6 ? Math.sin(u * 70) * 6 * (1 - P(u, 1.2, .4)) : 0;
    tf(walkie, { ...wk, x: buzz - 600 * aOut, r: buzz * .6, o: wk.o * (1 - aOut) });
    waves.forEach((w, i) => { const ph = ((u - B.tip) * 1.6 - i * .25); const on = u > B.tip && u < B.newbie - .3; tf(w, { s: .7 + .5 * (ph % 1 + 1) % 1, o: on ? (1 - (ph % 1 + 1) % 1) * .9 : 0 }); });
    const fIn = E.out(P(u, B.tip + .15, .55));
    tf(repW, { x: lerp(700, 0, fIn) + 700 * aOut, r: lerp(12, -3, fIn), o: fIn > 0 ? 1 : 0 });
    const sh = CASE.slam(urgent, u - (B.tip + .95));
    repW.firstChild.style.marginLeft = sh + 'px';
    // B
    const bIn = E.out(P(u, B.newbie - .1, .5)), bOut = E.in(P(u, B.pressed - .3, .35));
    tf(lblNew, pop(u, B.newbie, B.pressed - .2));
    desk.style.opacity = bIn * (1 - P(u, B.call - .3, .3));
    tf(boxW, { y: lerp(500, 0, bIn) + 400 * bOut, o: bIn * (1 - bOut) });
    const op = E.back(P(u, B.build - .15, .45));
    lidL.style.transform = `rotate(${-150 * op}deg)`; lidR.style.transform = `rotate(${150 * op}deg)`;
    parts.forEach((p, i) => {
      const k = E.out(P(u, B.build + .1 + i * .1, .5)), back = E.inOut(P(u, B.pressed - .35, .45));
      const tx = (i - 2) * 190, ty = -300 - (i % 2) * 90;
      tf(p, { x: lerp(0, tx, k) * (1 - back), y: lerp(0, ty, k) * (1 - back) + bob(u, i), s: lerp(.4, 1, k) * (1 - .6 * back), o: k * (1 - back) });
    });
    // C
    const cIn = E.out(P(u, B.pressed - .25, .45)), cOut = E.in(P(u, B.call - .3, .35));
    tf(pcW, { s: lerp(.6, 1, cIn), o: cIn * (1 - cOut) });
    const pd = NSP.pressDepth(u, [B.pressed + .25]);
    tf(hand, { o: clamp((u - B.pressed) / .2) * (1 - P(u, B.noOn, .3)), y: -12 * pd });
    pc.set({ press: pd });
    tf(lblPress, pop(u, B.pressed, B.call - .2));
    tf(qm, { ...life(u, B.noOn, B.call - .2, { from: .2, dy: 0, el: true, d: .7, out: .25 }), y: Math.sin(u * 3) * 14, r: Math.sin(u * 2) * 8 });
    tf(lblNo, { ...life(u, B.noOn, B.call - .2, { from: .5, dy: 0, d: .4, out: .25 }), x: u > B.noOn && u < B.noOn + .3 ? Math.sin(u * 80) * 5 * (1 - P(u, B.noOn, .3)) : 0 });
    // D: lineup wall drops in, suspects walk in on their names
    const dIn = E.out(P(u, B.call - .1, .6));
    tf(lw, { y: lerp(-1300, 0, dIn), o: dIn > 0 ? 1 : 0 });
    tf(lblCall, pop(u, B.call, B.line - .15)); tf(lblLine, pop(u, B.line, B.who - .2));
    names.forEach((n, i) => tf(n, life(u, ENTER[i], i < 4 ? ENTER[i + 1] - .05 : B.who - .1, { from: .6, dy: 20, d: .35, out: .15 })));
    const nervous = u > B.who && u < B.ask ? 1 : 0;
    sus.forEach((c, i) => {
      const k = P(u, ENTER[i] - .1, .7), x = lerp(1250, POS[i], E.out(k)), walking = k > 0 && k < 1 ? 1 : 0;
      c.pose({ t: u + i, walk: walking, x, y: walking ? 0 : Math.sin(u * 1.8 + i) * 3, o: k > 0 ? 1 : 0, blink: CASE.blinkAt(u, i), mood: nervous ? 1 : 0, wobble: nervous * (.5 + .5 * Math.sin(u * 3 + i)), look: walking ? -1 : 0, s: 1 + .03 * Math.max(0, 1 - Math.abs(u - ENTER[i] - .6) / .2) });
    });
    tf(lblWho, { ...life(u, B.who, B.ask - .1, { from: .5, dy: 0, d: .4, out: .2 }) });
    tf(lblAsk, life(u, B.ask, 1e9, { from: .4, dy: 0, d: .45, el: true }));
    // spotlight snaps on (no fade) on "สอบปากคำ"
    spot.draw(u, { o: u >= B.ask ? 1 : 0, swing: 0 });
  };
  function bob(u, i) { return Math.sin(u * 2.4 + i) * 10; }
};
