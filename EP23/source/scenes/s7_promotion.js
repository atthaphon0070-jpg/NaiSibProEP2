// SCENE 7 — PROMOTION (07_promotion.mp3). Case folder closes + green "ปิดคดี" stamp → comment "ฮาร์ดดิสก์ ✓" →
// practice line with the suspects → real logo + name → 10,000+ counter → อัปเดตทุกสัปดาห์ → กดติดตาม →
// a new case folder with "?" slides in on "คดีหน้า…" → logo hold (< 1 s after the last word). Approved CTA only.
SC.promotion = function (root) {
  const { h, tf, life, clamp, lerp, E, P, ICON: NI, sfx, BASE } = NSP;
  const { T, A, layer, pop, SUS, mini } = EP23, B = BEATS.promo, S = T.promo0, I = CASE.ICON;
  // closing case folder
  const f = CASE.folder({ w: 520, hgt: 600, num: 5, th: 'ฮาร์ดดิสก์', en: 'Hard Disk', photo: `<div class="ph" style="position:absolute;left:50%;bottom:-4px;width:0;height:0"></div>` });
  const m5 = mini('hdd', 5, .62); m5.el.style.left = '0'; m5.el.style.top = '0'; f.photo.querySelector('.ph').appendChild(m5.el);
  const fW = A(root, 540, 860, ''); fW.firstChild.appendChild(f.el); f.el.style.left = '-260px'; f.el.style.top = '-300px';
  const cover = h(`<div class="abs" style="left:0;top:0;width:520px;height:600px;border-radius:18px;background:linear-gradient(180deg,#D9AA6A,#C08A4C);border:5px solid #0B1A3A;transform-origin:left center;backface-visibility:visible;padding-top:70px">
      <div style="font-weight:800;font-size:46px;color:#3A2410;text-align:center;line-height:1.3">แฟ้มคดี<br>คอมเปิดไม่ติด</div></div>`);
  f.el.appendChild(cover);
  const closedSt = CASE.stamp('ปิดคดี', 'green', 96, -12); closedSt.style.left = '260px'; closedSt.style.top = '430px'; f.el.appendChild(closedSt);
  const lClosed = A(root, 540, 400, `<div class="pill2 chipG" style="font-size:60px">ปิดคดีเรียบร้อย!</div>`);
  const who = A(root, 540, 400, `<div class="pill2 chipH" style="font-size:54px">ใครตอบถูก</div>`);
  const cm = A(root, 540, 690, `<div style="position:relative;width:600px;height:330px">
      <div style="position:absolute;left:0;top:70px">${I.comment(230)}</div>
      <div class="cmb" style="position:absolute;left:236px;top:0;padding:20px 30px;border-radius:40px 40px 40px 8px;background:#22C55E;color:#fff;font-weight:800;font-size:68px;display:flex;align-items:center;gap:12px;box-shadow:0 0 0 6px #fff,0 16px 30px rgba(0,0,0,.4);white-space:nowrap">ฮาร์ดดิสก์ ${NI.check('#fff', 60)}</div></div>`);
  const cmb = cm.querySelector('.cmb');
  const cmt = A(root, 540, 1050, `<div class="big wht" style="font-size:60px">คอมเมนต์ <span class="grn">ฮาร์ดดิสก์</span><br>มาเลย!</div>`);
  const prac = A(root, 540, 540, `<div class="big wht" style="font-size:62px">อยากฝึกข้อสอบ<br><span class="yel">คอมพิวเตอร์</span>แบบนี้<br>อีกเยอะ ๆ</div>`);
  const parade = SUS.map((s, i) => { const c = CASE.suspect(s.kind, { num: s.num, scale: .8 }); c.el.style.left = (160 + i * 190) + 'px'; c.el.style.top = '1000px'; root.appendChild(c.el); return c; });
  // real logo + name
  const logo = A(root, 540, 660, `<img src="${BASE}brand/logo.png" style="width:440px;display:block;filter:drop-shadow(0 16px 30px rgba(0,0,0,.5))">`);
  const name = A(root, 540, 960, `<div class="big" style="font-size:62px">NaiSibPro <span class="yel">นายสิบโปร</span></div>`);
  const ex = A(root, 540, 1050, `<div class="big wht" style="font-size:54px">ข้อสอบมากกว่า</div>`);
  const cnt = A(root, 540, 1190, `<div class="big yel" style="font-size:128px;-webkit-text-stroke:3px #071330;paint-order:stroke fill"><span class="cn">0</span> <span style="font-size:64px;color:#fff">ข้อ</span></div>`);
  const cn = cnt.querySelector('.cn');
  const wk = A(root, 540, 1350, `<div class="pill2 chipH" style="font-size:52px">${NI.cal(56, '#FFD23F')}อัปเดตทุกสัปดาห์</div>`);
  const fol = A(root, 540, 1180, `<div class="pill2" style="font-size:66px;color:#fff;padding:20px 54px;background:linear-gradient(90deg,#FF3D7F,#FF6B9A);box-shadow:0 0 0 6px #fff,0 18px 36px rgba(255,61,127,.5)">${NI.heart('#fff')}กดติดตาม</div>`);
  const hand = A(root, 760, 1270, NI.hand(110));
  // next case teaser
  const nf = CASE.folder({ w: 300, hgt: 330, num: '?', who: 'คดีหน้า', photo: `<div style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:90px;color:#FFD23F">?</div>` });
  const nfW = A(root, 540, 1250, ''); nfW.firstChild.appendChild(nf.el); nf.el.style.left = '-150px'; nf.el.style.top = '-165px';
  const lNext = A(root, 540, 1000, `<div class="pill2 chipY" style="font-size:56px">คดีหน้า…</div>`);
  const bye = A(root, 540, 1095, `<div class="big wht" style="font-size:64px">เจอกัน!</div>`);
  const conf = h(`<div class="abs" style="inset:0"></div>`); root.appendChild(conf);
  const cf = NSP.buildConfetti(conf, 60, 540, 1000);

  sfx('page', S + B.closed, .8); sfx('stamp', S + B.closed + .62, 1); sfx('success', S + B.closed + .7, .6);
  sfx('pop', S + B.who, .7); sfx('pop', S + B.comment, .8); sfx('ding', S + B.hdd, .8); sfx('whoosh', S + B.practice - .1, .5);
  SUS.forEach((_, i) => sfx('pop', S + B.practice + .3 + i * .1, .4));
  sfx('whoosh', S + B.goto, .6); sfx('sparkle', S + B.brand + .2, .8);
  for (let i = 0; i < 6; i++) sfx('coin', S + B.exams + .2 + i * .15, .35); sfx('ding', S + B.tenk + .3, .7);
  sfx('pop', S + B.weekly, .8); sfx('pop', S + B.follow, 1); sfx('click', S + B.follow + .6, .9);
  sfx('whoosh', S + B.next - .1, .6); sfx('page', S + B.next + .1, .5); sfx('sparkle', S + B.bye + .2, .8); sfx('success', S + B.bye + .1, .6);

  return function (t) {
    const u = t - S;
    // folder closes, green stamp, then it flies off
    const fo = E.in(P(u, B.who - .25, .4));
    tf(fW, { ...life(u, 0, 1e9, { from: .85, dy: 0, d: .3 }), y: -900 * fo, r: -4 * fo, o: 1 - fo });
    tf(cover, { ry: lerp(-178, 0, E.inOut(P(u, B.closed + .05, .5))), o: 1 });
    cover.style.transformOrigin = 'left center';
    f.paper.style.visibility = E.inOut(P(u, B.closed + .05, .5)) > .5 ? 'hidden' : 'visible';   // fully covered once closed
    const sh = CASE.slam(closedSt, u - (B.closed + .62)); fW.firstChild.style.marginLeft = sh + 'px';
    tf(lClosed, pop(u, B.closed, B.who - .2));
    tf(who, pop(u, B.who, B.practice - .2));
    tf(cm, life(u, B.comment, B.practice - .2, { from: .4, dy: 60, out: .25 }));
    tf(cmb, { ...life(u, B.hdd, 1e9, { from: .2, dy: 0, d: .7, el: true }), r: -4 + Math.sin(u * 4) * 2 });
    tf(cmt, life(u, B.comment + .2, B.practice - .2, { from: .6, dy: 30, out: .25 }));
    tf(prac, life(u, B.practice, B.goto - .15, { from: .6, dy: 30, out: .25 }));
    parade.forEach((c, i) => {
      const l = life(u, B.practice + .3 + i * .1, B.goto - .15, { from: .3, dy: 60, el: true, d: .7, out: .25 });
      c.pose({ t: u + i, o: l.o, s: l.s, y: l.y + Math.abs(Math.sin(u * 4 + i)) * -14, blink: CASE.blinkAt(u, i), mood: 0 });
    });
    // logo: enters centre on "นายสิบโปร", lifts for the stats, returns big for the end hold
    const lgIn = life(u, B.goto, 1e9, { from: .2, dy: 200, d: .9, el: true });
    const up = E.inOut(P(u, B.exams - .1, .5)) * (1 - E.inOut(P(u, B.bye - .1, .5)));
    tf(logo, { ...lgIn, y: lgIn.y - 175 * up + Math.sin(u * 2) * 6, s: lgIn.s * lerp(1, .55, up) });
    tf(name, { ...life(u, B.brand, 1e9, { from: .5, dy: 40 }), y: -195 * up });
    const statsOut = 1 - P(u, B.follow - .2, .3);
    const exL = life(u, B.exams, 1e9, { from: .5, dy: 30 }); tf(ex, { ...exL, o: exL.o * statsOut, y: exL.y - 200 });
    const cL = life(u, B.exams + .1, 1e9, { from: .5, dy: 30 }); tf(cnt, { ...cL, o: cL.o * statsOut, y: cL.y - 200 });
    cn.textContent = (Math.round(10000 * E.out(P(u, B.exams + .2, B.tenk + .3 - B.exams - .2)) / 100) * 100).toLocaleString('en-US') + (u >= B.tenk + .3 ? '+' : '');
    const wL = life(u, B.weekly, 1e9, { from: .4, dy: 30 }); tf(wk, { ...wL, o: wL.o * statsOut, y: wL.y - 210 });
    const fL = life(u, B.follow, B.next - .1, { from: .3, dy: 0, d: .6, el: true, out: .25 });
    tf(fol, { ...fL, s: fL.s * (1 + .04 * Math.sin(u * 6)) * (1 - .08 * NSP.pressDepth(u, [B.follow + .6])) });
    hand.style.transform = `translate(0px,${NSP.bob(u, 0, 10, 6)}px) scale(${1 - .15 * NSP.pressDepth(u, [B.follow + .6])})`;
    hand.style.opacity = clamp((u - B.follow - .2) / .2) * (1 - P(u, B.next - .1, .25));
    // next case: a new folder with "?" slides in briefly
    const nk = E.out(P(u, B.next - .05, .45)), nx = E.in(P(u, B.bye - .15, .35));
    tf(nfW, { x: lerp(800, 0, nk) - 800 * nx, r: lerp(10, -3, nk), o: nk > 0 && nx < 1 ? 1 : 0 });
    tf(lNext, pop(u, B.next, B.bye - .1));
    tf(bye, life(u, B.bye, 1e9, { from: .5, dy: 30 }));
    NSP.drawConfetti(cf, t, S + B.bye + .1, 2.4);
  };
};
