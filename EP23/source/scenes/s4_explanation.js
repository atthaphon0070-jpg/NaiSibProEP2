// SCENE 4 — EXPLANATION (04_explanation.mp3). Cork board "เส้นทางคดี": red string runs power button → ⚡ PSU →
// 🏠 Mainboard → 🧠 CPU + 🗂️ RAM (both ✓, "การตรวจตอนเปิดเครื่อง" / "POST ✓" because โพสต์ is spoken) → BIOS screen.
// Memory phrase ไฟ บ้าน สมอง โต๊ะ, "ขาดตัวไหน ไม่ติด!", then "แต่เดี๋ยวก่อน…": the spotlight swings to the
// Hard Disk alone in the corner; its file is empty with a yellow "?". No verdict is shown or implied here.
SC.explanation = function (root) {
  const { h, tf, life, clamp, lerp, E, P, sfx } = NSP;
  const { T, A, layer, pop, SUS, mini } = EP23, B = BEATS.expl, S = T.expl0, I = CASE.ICON;
  const cam = layer(root); cam.style.transformOrigin = '540px 800px';
  const BX = 70, BY = 430;
  const bd = CASE.board(cam, { x: BX, y: BY, w: 940, hgt: 800 });
  const tile = (ico, th, en) => `<div class="tile" style="width:220px">${ico}<span>${th}</span><span style="font-size:42px;color:#5D6A82;font-weight:700">${en}</span></div>`;
  const PIN = {
    btn: [230, 150], psu: [620, 150], mb: [620, 410], cpu: [230, 410], ram: [230, 660],
  };
  const pins = {
    btn: bd.pin(...PIN.btn, `<div class="tile" style="width:200px"><div style="width:110px;height:110px;border-radius:50%;background:#2B3650;border:5px solid #0B1A3A;display:grid;place-items:center">${I.power(70, '#E6ECF7')}</div><span>กดปุ่ม</span></div>`, { rot: -3 }),
    psu: bd.pin(...PIN.psu, tile(I.bolt(110), 'ไฟ', 'PSU'), { rot: 2 }),
    mb: bd.pin(...PIN.mb, tile(I.house(110), 'บ้าน', 'Mainboard'), { rot: -2 }),
    cpu: bd.pin(...PIN.cpu, tile(I.brain(110), 'สมอง', 'CPU'), { rot: 3 }),
    ram: bd.pin(...PIN.ram, tile(I.desk(110), 'โต๊ะ', 'RAM'), { rot: -2 }),
  };
  const chk = { cpu: A(bd.el.querySelector('.pins'), PIN.cpu[0] + 100, PIN.cpu[1] - 110, I.check(86)), ram: A(bd.el.querySelector('.pins'), PIN.ram[0] + 100, PIN.ram[1] - 110, I.check(86)) };
  // BIOS monitor pinned at the lower left of the board
  const mon = CASE.monitor({ w: 250 }); const monW = A(bd.el.querySelector('.pins'), 620, 660, ''); monW.firstChild.appendChild(mon.el); mon.el.style.left = '-141px'; mon.el.style.top = '-150px';
  const S1 = bd.string([[PIN.btn[0], PIN.btn[1] - 60], [PIN.psu[0], PIN.psu[1] - 60]]);
  const S2 = bd.string([[PIN.psu[0], PIN.psu[1] - 60], [PIN.mb[0], PIN.mb[1] - 60]]);
  const S3 = bd.string([[PIN.mb[0], PIN.mb[1] - 60], [PIN.cpu[0], PIN.cpu[1] - 60]]);
  const S4 = bd.string([[PIN.mb[0], PIN.mb[1] - 60], [PIN.ram[0], PIN.ram[1] - 60]]);
  const S5 = bd.string([[PIN.ram[0], PIN.ram[1] - 60], [620, 600]]);
  const ov = layer(root, 5);
  const hdr = A(ov, 540, 356, `<div class="pill2 chipH">เส้นทางคดี</div>`);
  const lPress = A(ov, 540, 1300, `<div class="pill2 chipH">${I.power(52, '#FFD23F')}กดปุ่มเปิด…</div>`);
  const lPow = A(ov, 540, 1300, `<div class="pill2 chipH"><span class="yel">ไฟ</span>วิ่งเข้าเมนบอร์ด</div>`);
  const lChk = A(ov, 540, 1300, `<div class="pill2 chipH">ตรวจ<span class="yel">สมอง</span>กับ<span class="yel">โต๊ะทำงาน</span></div>`);
  const lPostTh = A(ov, 540, 1300, `<div class="pill2 chipG" style="font-size:50px">การตรวจตอนเปิดเครื่อง</div>`);
  const lPost = A(ov, 540, 1390, `<div class="pill2 chipG" style="font-size:56px">POST ${I.check(56, '#15803D')}</div>`);
  const lPass = A(ov, 540, 1300, `<div class="pill2 chipH">ถ้าผ่าน…</div>`);
  const lBios = A(ov, 540, 1300, `<div class="pill2 chipG" style="font-size:54px">เข้าหน้าไบออสได้ ${I.check(54, '#15803D')}</div>`);
  // memory phrase
  const memoHdr = A(ov, 540, 470, `<div class="pill2 chipH">จำง่าย ๆ ว่า…</div>`);
  const MW = [['bolt', 'ไฟ', B.fai], ['house', 'บ้าน', B.baan], ['brain', 'สมอง', B.samong], ['desk', 'โต๊ะ', B.to]];
  const memo = MW.map(([ico, w, a], i) => ({ a, el: A(ov, 270 + i * 180, 760, `<div style="display:flex;flex-direction:column;align-items:center;gap:6px">${I[ico](150)}<div class="mph" style="font-size:66px">${w}</div></div>`) }));
  const mBox = A(ov, 540, 1080, `<div class="resbox" style="position:relative;width:820px;height:300px"></div>`);
  const kad1 = A(ov, 540, 1030, `<div class="mph" style="font-size:112px">ขาดตัวไหน</div>`);
  const kad2 = A(ov, 540, 1160, `<div class="mph" style="font-size:112px">ไม่ติด!</div>`);
  // cliffhanger: Hard Disk alone in the corner
  const freeze = h(`<div class="abs" style="inset:0;background:#fff;pointer-events:none;opacity:0"></div>`);
  const dark = h(`<div class="dim" style="opacity:0"></div>`); root.insertBefore(dark, ov);
  const spot = CASE.spotlight(root, { x: 540, top: 150, floor: 1420, w: 560 }); root.insertBefore(spot.el, ov);
  const hdd = CASE.suspect('hdd', { num: 5, scale: 1.25 }); hdd.el.style.left = '820px'; hdd.el.style.top = '1420px'; root.insertBefore(hdd.el, ov);
  const lWait = A(ov, 540, 400, `<div class="pill2 chipY" style="font-size:60px">แต่เดี๋ยวก่อน…</div>`);
  const lS5 = A(ov, 540, 400, `<div class="pill2 chipH">ผู้ต้องหารายที่ <span class="yel">5</span></div>`);
  const lName = A(ov, 540, 545, `<div class="nm"><span class="t">${SUS[4].th}</span><span class="e">${SUS[4].en}</span></div>`);
  const f5 = CASE.folder({ w: 400, hgt: 440, num: 5, photo: `<div style="position:absolute;inset:0;display:grid;place-items:center" class="big yel"><span style="font-size:120px">?</span></div>`,
    note: `<div style="text-align:center;font-weight:800;font-size:200px;line-height:1;color:#FFD23F;-webkit-text-stroke:5px #0B1A3A;paint-order:stroke fill">?</div>` });
  f5.el.dataset.sus = 'hdd';
  const f5W = A(ov, 365, 1030, ''); f5W.firstChild.appendChild(f5.el); f5.el.style.left = '-200px'; f5.el.style.top = '-220px';
  const lNot = A(ov, 540, 690, `<div class="pill2 chipY" style="font-size:58px">ยังไม่ได้ตัดสิน!</div>`);
  root.appendChild(freeze);

  sfx('whoosh', S + B.path - .1, .7); sfx('page', S + B.path + .2, .6);
  sfx('pop', S + B.press, .6); sfx('click', S + B.press + .3, 1);
  sfx('swoosh', S + B.pow, .45); sfx('pop', S + B.psu, .6); sfx('swoosh', S + B.run, .45); sfx('pop', S + B.mb, .6);
  sfx('swoosh', S + B.check + .2, .4); sfx('pop', S + B.brain, .6); sfx('pop', S + B.desk, .6); sfx('ding', S + B.brain + .5, .5); sfx('ding', S + B.desk + .5, .5);
  sfx('pop', S + B.postTh, .7); sfx('ding', S + B.post, .8);
  sfx('pop', S + B.pass, .5); sfx('swoosh', S + B.pass + .2, .4); sfx('success', S + B.bios, .8);
  sfx('whoosh', S + B.memo - .1, .6); MW.forEach(m => sfx('pop', S + m[2], 1)); sfx('stamp', S + B.kad, .7); sfx('sparkle', S + B.kad + .3, .6);
  sfx('freeze', S + B.wait, .9); sfx('whoosh', S + B.wait + .3, .5); sfx('click', S + B.s5, .8); sfx('pop', S + B.hdd, .7); sfx('riser', S + B.notYet - .3, .4); sfx('page', S + B.notYet, .7);

  return function (t) {
    const u = t - S;
    // board enters, camera tours it (top row → checks → monitor), then pulls back for the memory phrase
    const bIn = E.out(P(u, B.path - .05, .6)), bOut = E.inOut(P(u, B.memo - .2, .5));
    const z1 = E.inOut(P(u, B.press - .3, .8)) * (1 - E.inOut(P(u, B.check - .4, .8)));
    const z2 = E.inOut(P(u, B.check - .4, .8)) * (1 - E.inOut(P(u, B.pass - .2, .8)));
    const z3 = E.inOut(P(u, B.pass - .2, .8)) * (1 - bOut);
    const sc = 1 + .06 * z1 + .06 * z2 + .05 * z3, ty = 60 * z1 - 20 * z2 - 40 * z3, tx = 30 * z2;
    cam.style.transform = `translate(${tx}px,${ty + lerp(1200, 0, bIn)}px) scale(${sc * (1 - .35 * bOut)})`;
    cam.style.opacity = 1 - bOut;
    tf(hdr, pop(u, B.path, B.pass - .2));
    // pins pop on the spoken words
    const pinAt = { btn: B.press, psu: B.psu, mb: B.mb, cpu: B.brain, ram: B.desk };
    for (const k in pins) tf(pins[k], life(u, pinAt[k], 1e9, { from: .3, dy: 30, d: .5 }));
    // strings draw on, a light pulse travels each one
    const draw = (s, a, d) => { s.draw(E.inOut(P(u, a, d))); const pk = P(u, a, d + .4); s.pulse(pk, pk > 0 && pk < 1 ? 1 : 0); };
    draw(S1, B.pow, .45); draw(S2, B.run, B.mb - B.run); draw(S3, B.check + .2, B.brain - B.check - .1); draw(S4, B.brain + .2, B.desk - B.brain - .1); draw(S5, B.pass + .1, B.bios - B.pass - .2);
    tf(chk.cpu, { s: E.elastic(P(u, B.brain + .45, .7)), o: clamp((u - B.brain - .45) * 6) });
    tf(chk.ram, { s: E.elastic(P(u, B.desk + .45, .7)), o: clamp((u - B.desk - .45) * 6) });
    tf(monW, life(u, B.pass, 1e9, { from: .4, dy: 30 }));
    mon.set({ stb: u < B.bios ? 1 : 0, bios: E.out(P(u, B.bios, .3)), flash: u > B.bios && u < B.bios + .25 ? 1 - (u - B.bios) / .25 : 0 }, u);
    // bottom captions follow the narration (one at a time)
    tf(lPress, pop(u, B.press, B.pow - .1)); tf(lPow, pop(u, B.pow, B.check - .1)); tf(lChk, pop(u, B.check, B.postTh - .1));
    tf(lPostTh, pop(u, B.postTh, B.pass - .15)); tf(lPost, { ...pop(u, B.post, B.pass - .15), s: pop(u, B.post, B.pass - .15).s * (1 + .03 * Math.sin(u * 5)) });
    tf(lPass, pop(u, B.pass, B.bios - .1)); tf(lBios, pop(u, B.bios, B.memo - .2));
    // memory phrase: icons pop on each word, then the rule; rest beat before "แต่เดี๋ยวก่อน"
    const mOut = P(u, B.wait - .05, .2);
    tf(memoHdr, pop(u, B.memo, B.wait - .05));
    memo.forEach((m, i) => { const l = life(u, m.a, 1e9, { from: .2, dy: 40, d: .6, el: true }); tf(m.el, { ...l, o: l.o * (1 - mOut), y: l.y + Math.sin(u * 2 + i) * 6 }); });
    tf(mBox, { o: E.out(P(u, B.kad - .2, .4)) * (1 - mOut), s: 1 });
    const k1 = life(u, B.kad, 1e9, { from: .3, dy: 40, el: true, d: .8 }), k2 = life(u, B.kad + .55, 1e9, { from: .3, dy: 40, el: true, d: .8 });
    tf(kad1, { ...k1, o: k1.o * (1 - mOut), s: k1.s * (1 + .02 * Math.sin(u * 4)) }); tf(kad2, { ...k2, o: k2.o * (1 - mOut), s: k2.s * (1 + .02 * Math.sin(u * 4 + 1)) });
    // freeze flash, room darkens, spotlight swings to the Hard Disk in the corner
    freeze.style.opacity = u > B.wait && u < B.wait + .25 ? .55 * (1 - (u - B.wait) / .25) : 0;
    dark.style.opacity = .45 * clamp((u - B.wait) / .3);
    const sw = E.inOut(P(u, B.wait + .3, .9));
    spot.draw(u, { o: clamp((u - B.wait - .1) / .2), swing: lerp(10, -12.6, sw) });
    const hit = u > B.s5 - .2;
    hdd.pose({ t: u, o: clamp((u - B.wait) / .3), blink: CASE.blinkAt(u, 3), mood: hit ? 1 : 0, wobble: hit ? (u < B.s5 + .8 ? 1 : .3) : 0, y: Math.sin(u * 1.8) * 3 });
    tf(lWait, { ...life(u, B.wait, B.s5 - .1, { from: .5, dy: 0, d: .35, out: .2 }), x: u > B.wait && u < B.wait + .3 ? Math.sin(u * 80) * 5 : 0 });
    tf(lS5, pop(u, B.s5, 1e9)); tf(lName, life(u, B.hdd, 1e9, { from: .6, dy: 20, d: .4 }));
    tf(f5W, { ...life(u, B.notYet, 1e9, { from: .4, dy: 60, d: .5 }), r: -2 + Math.sin(u * 1.4) * .8 });
    f5.note.firstChild.style.transform = `scale(${1 + .06 * Math.sin(u * 5)})`;
    tf(lNot, life(u, B.notYet + .1, 1e9, { from: .3, dy: 0, d: .6, el: true }));
  };
};
