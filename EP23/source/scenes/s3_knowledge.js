// SCENE 3 — KNOWLEDGE / INTERROGATION (03_knowledge.mp3). Suspects 1–4 are questioned one by one at the
// interrogation table under the spotlight. On each spoken name its case file pops (typewriter); on the analogy
// word the analogy beat plays; after each suspect a red "ขาดไม่ได้" stamp slams onto its file.
// "ทั้งสี่ราย… ขาดไม่ได้!" lines the four stamped files up. Suspect 5 (Hard Disk) is not shown here.
SC.knowledge = function (root) {
  const { h, tf, life, clamp, lerp, E, P, sfx } = NSP;
  const { T, A, layer, pop, SUS, mini } = EP23, B = BEATS.know, S = T.know0, I = CASE.ICON;
  const set = layer(root), mid = layer(root), fg = layer(root), ov = layer(root, 5);
  const spot = CASE.spotlight(set, { x: 540, top: 150, floor: 1430, w: 760 });
  // interrogation table (front), suspects stand behind it
  const table = h(`<div class="abs" style="left:110px;top:1400px;width:860px;height:600px"><div style="position:absolute;left:0;right:0;top:0;height:40px;border-radius:12px;background:#8A5A2E;border:5px solid #0B1A3A"></div><div style="position:absolute;left:30px;right:30px;top:40px;bottom:0;background:linear-gradient(180deg,#5E3E22,#3D2814);border:5px solid #0B1A3A;border-top:none"></div></div>`);
  const STEPS = [
    { a: B.s1, name: B.psu, an: B.elec, l2: [[B.feed, 'จ่ายไฟให้ทุกชิ้น'], [B.noPow, 'ไม่มีไฟ ก็ไม่มีอะไรทำงาน']], st: B.e1 + .08, out: B.s2 },
    { a: B.s2, name: B.mb, an: B.house, l2: [[B.plug, 'ทุกชิ้นต้องเสียบอยู่บนนี้']], st: B.e2 + .08, out: B.s3 },
    { a: B.s3, name: B.cpu, an: B.brain, l2: [[B.noBrain, 'ไม่มีสมอง ก็คิดอะไรไม่ได้']], st: B.e3 + .08, out: B.s4 },
    { a: B.s4, name: B.ram, an: B.desk, l2: [[B.noRam, 'เครื่องจะไม่ผ่านการตรวจตอนเปิด']], st: B.e4 + .07, out: B.all },
  ];
  const AN_TX = ['= ไฟฟ้า', '= บ้าน', '= สมองของเครื่อง', '= โต๊ะทำงาน'];
  const HDR = ['ผู้ต้องหารายที่ 1', 'รายที่ 2', 'รายที่ 3', 'รายที่ 4'];
  const X = STEPS.map((st, i) => {
    const s = SUS[i];
    const sp = CASE.suspect(s.kind, { num: s.num, scale: 1.05 }); sp.el.style.left = '0'; sp.el.style.top = '1420px'; mid.appendChild(sp.el);
    const photo = `<div class="ph" style="position:absolute;left:50%;bottom:-4px;width:0;height:0"></div>`;
    const f = CASE.folder({ w: 700, hgt: 650, wide: true, num: s.num, th: s.th, en: s.en, photo,
      note: `<div style="display:flex;align-items:center;gap:18px;height:96px"><div class="ni" style="flex:none">${I[s.ico](92)}</div><div class="n1" style="font-weight:800;font-size:58px;color:#1238A8;white-space:nowrap">${AN_TX[i]}</div></div>
        <div style="position:relative;height:56px">${st.l2.map(l => `<div class="n2" style="position:absolute;left:0;top:0;font-weight:700;font-size:42px;line-height:56px;color:#0B1A3A;white-space:nowrap">${l[1]}</div>`).join('')}</div>` });
    f.el.dataset.sus = s.kind;
    const m = mini(s.kind, s.num, .72); m.el.style.left = '0'; m.el.style.top = '0'; f.photo.querySelector('.ph').appendChild(m.el);
    const fw = A(fg, 540, 780, ''); fw.firstChild.appendChild(f.el); f.el.style.left = '-350px'; f.el.style.top = '-325px';
    const stp = CASE.stamp('ขาดไม่ได้', 'red', 60, -10); f.stampBox.appendChild(stp);
    const hdr = A(ov, 540, 356, `<div class="pill2 chipH">สอบปากคำ • <span class="yel">${HDR[i]}</span></div>`);
    return { st, sp, f, fw, stp, hdr, n1: f.note.querySelector('.n1'), n2: [...f.note.querySelectorAll('.n2')], ni: f.note.querySelector('.ni') };
  });
  mid.after(table);
  // ---------- analogy beats (zone y 1080–1400, around the suspect) ----------
  const icoL = SUS.slice(0, 4).map(s => A(fg, 250, 1220, `<div style="filter:drop-shadow(0 12px 18px rgba(0,0,0,.45))">${I[s.ico](170)}</div>`));
  // 1 PSU: current runs from the bolt to three parts
  const zap = h(`<svg class="abs" width="1080" height="1920" style="left:0;top:0;overflow:visible"></svg>`); fg.appendChild(zap);
  const ZP = [[740, 1150], [820, 1260], [900, 1150]];
  ZP.forEach(([x, y]) => zap.insertAdjacentHTML('beforeend', `<path d="M330 1215 C 520 ${y - 220}, ${x - 160} ${y - 160}, ${x} ${y - 70}" fill="none" stroke="#FFD23F" stroke-width="9" stroke-linecap="round" stroke-dasharray="26 22" style="filter:drop-shadow(0 0 8px #FFD23F)"/>`));
  const zPaths = [...zap.querySelectorAll('path')];
  const zParts = ['mb', 'cpu', 'ram'].map((k, i) => { const w = A(fg, ZP[i][0], ZP[i][1], `<div style="position:relative;width:0;height:0"></div>`); const m = mini(k, 0, .42); m.el.style.left = '0'; m.el.style.top = '0'; w.firstChild.firstChild.appendChild(m.el); return w; });
  // 2 MB: CPU + RAM snap onto the board
  const snaps = ['cpu', 'ram'].map((k, i) => { const w = A(fg, 0, 0, `<div style="position:relative;width:0;height:0"></div>`); const m = mini(k, 0, .34); m.el.style.left = '0'; m.el.style.top = '0'; w.firstChild.firstChild.appendChild(m.el); return w; });
  const SNAP_TO = [[500, 1255], [600, 1240]], SNAP_FROM = [[860, 1100], [900, 1260]];
  // 3 CPU: thought waves from the head
  const waves = [0, 1, 2].map(i => A(fg, 540, 1130, `<div style="width:${180 + i * 50}px;height:${90 + i * 26}px;border-radius:50% 50% 0 0;border:8px solid #FF9EC4;border-bottom:none"></div>`));
  // 4 RAM: files land on the desk; a PC beeps
  const files = [0, 1, 2].map(i => A(fg, 250 - 30 + i * 30, 1150, `<div style="width:64px;height:44px;border-radius:6px;background:${['#FFF', '#FFE2A8', '#BDE7FF'][i]};border:4px solid #0B1A3A"></div>`));
  const bpc = CASE.pc({ scale: .5 }); const bpcW = A(fg, 810, 1260, ''); bpcW.firstChild.appendChild(bpc.el); bpc.el.style.left = '-65px'; bpc.el.style.top = '-105px';
  const rings = [0, 1, 2].map(i => A(fg, 810, 1200, `<div style="width:120px;height:120px;border-radius:50%;border:8px solid #FF4D5E"></div>`));
  const beep = A(ov, 690, 1175, `<div class="pill2 chipR" style="font-size:54px">ปี๊บ!</div>`);
  // ---------- all four stamped files ----------
  const FP = [[365, 640], [715, 640], [365, 1010], [715, 1010]];
  const all = SUS.slice(0, 4).map((s, i) => {
    const photo = `<div class="ph" style="position:absolute;left:50%;bottom:-4px;width:0;height:0"></div>`;
    const f = CASE.folder({ w: 330, hgt: 330, num: s.num, photo, pw: 96, nf: 64 });
    f.el.dataset.sus = s.kind;
    const m = mini(s.kind, s.num, .36); m.el.style.left = '0'; m.el.style.top = '0'; f.photo.querySelector('.ph').appendChild(m.el);
    const w = A(fg, FP[i][0], FP[i][1], ''); w.firstChild.appendChild(f.el); f.el.style.left = '-165px'; f.el.style.top = '-165px';
    const stp = CASE.stamp('ขาดไม่ได้', 'red', 44, -10); f.stampBox.appendChild(stp);
    return { w, stp };
  });
  const allHdr = A(ov, 540, 356, `<div class="pill2 chipH">ทั้ง <span class="yel">4</span> ราย…</div>`);
  const must = A(ov, 540, 1330, `<div class="big" style="font-size:110px;color:#FF4D5E;-webkit-text-stroke:3px #fff;paint-order:stroke fill;text-shadow:0 8px 0 #071330,0 0 40px rgba(255,77,94,.5)">ขาดไม่ได้!</div>`);

  // ---------- SFX ----------
  STEPS.forEach((st, i) => {
    sfx('whoosh', S + st.a - .1, .5); for (let k = 0; k < 3; k++) sfx('step', S + st.a + k * .15, .7);
    for (let k = 0; k < 7; k++) sfx('type', S + st.name + .05 + k * .07, .8);
    sfx('pop', S + st.an, .8); st.l2.forEach(l => sfx('click', S + l[0], .4));
    sfx('stamp', S + st.st, 1);
  });
  sfx('sparkle', S + B.elec + .2, .6); for (let k = 0; k < 3; k++) sfx('flicker', S + B.feed + k * .25, .4);
  sfx('click', S + B.plug + .3, .8); sfx('click', S + B.plug + .55, .8); sfx('riser', S + B.brain, .3);
  sfx('page', S + B.desk + .1, .6); sfx('beep', S + B.beep, 1); sfx('beep', S + B.beep + .32, .8);
  sfx('whoosh', S + B.all - .1, .6); [0, 1, 2, 3].forEach(i => sfx('page', S + B.all + i * .12, .4)); sfx('stamp', S + B.must, 1); sfx('drop', S + B.must + .05, .5);

  return function (t) {
    const u = t - S, allIn = u >= B.all - .2;
    spot.draw(u, { o: 1 - P(u, B.all - .2, .3), swing: Math.sin(u * .6) * 2 });
    table.style.opacity = 1 - P(u, B.all - .2, .3);
    X.forEach((x, i) => {
      const st = x.st, on = u >= st.a - .3 && u < st.out + .3;
      // suspect walks in from the right to the table, leaves left when the next one is called
      const kin = E.out(P(u, st.a - .2, .6)), kout = E.in(P(u, st.out - .25, .45));
      const walking = (kin > 0 && kin < 1) || (kout > 0 && kout < 1);
      const nerv = u > st.name && u < st.st ? .25 : 0;
      x.sp.pose({ t: u, walk: walking ? 1 : 0, x: lerp(1300, 540, kin) - 900 * kout, y: Math.sin(u * 1.8) * 3, o: on ? 1 : 0, blink: CASE.blinkAt(u, i), mood: u > st.st ? 2 * (u < st.st + .8) : u > st.name ? 1 : 0, wobble: nerv + (u > st.st && u < st.st + .5 ? .8 : 0) });
      // case file pops on the spoken name; slides out with the suspect
      const fl = life(u, st.name, 1e9, { from: .5, dy: 60, d: .5 });
      const sh = CASE.slam(x.stp, u - st.st);
      tf(x.fw, { ...fl, x: -1100 * kout + sh, o: fl.o * (1 - clamp(kout * 1.5)), r: -1 + Math.sin(u * 1.3) * .6 });
      tf(x.hdr, pop(u, st.a, st.out - .2));
      // analogy text inside the file
      const ka = E.out(P(u, st.an, .35));
      x.n1.style.opacity = ka; x.n1.style.transform = `translateX(${(1 - ka) * 30}px)`;
      x.ni.style.opacity = ka; x.ni.style.transform = `scale(${lerp(.3, 1, E.back(P(u, st.an, .45)))})`;
      x.n2.forEach((n, k) => {
        const a = st.l2[k][0], b = st.l2[k + 1] ? st.l2[k + 1][0] - .1 : 1e9, kk = E.out(P(u, a, .3)) * (1 - P(u, b, .15));
        n.style.opacity = kk; n.style.transform = `translateY(${(1 - E.out(P(u, a, .3))) * 14}px)`;
      });
      tf(icoL[i], { ...life(u, st.an, st.out - .25, { from: .2, dy: 40, d: .55, el: true, out: .25 }), y: Math.sin(u * 2.2) * 8 });
    });
    // PSU: current flows to the parts (dashes run), parts glow when powered
    const zOn = clamp((u - B.feed) / .3) * (1 - P(u, B.s2 - .3, .3));
    zPaths.forEach((p, k) => { p.style.opacity = zOn * clamp((u - B.feed - k * .15) / .2); p.style.strokeDashoffset = -u * 160; });
    zParts.forEach((w, k) => {
      const l = life(u, B.elec + .2 + k * .12, B.s2 - .25, { from: .3, dy: 30, out: .25 });
      const lit = u > B.feed + .3 + k * .15 && u < B.s2 ? 1 : 0;
      tf(w, { ...l, y: l.y + Math.sin(u * 3 + k) * 5 }); w.style.filter = lit ? `drop-shadow(0 0 ${16 + 6 * Math.sin(u * 8 + k)}px #FFD23F)` : '';
    });
    // MB: parts snap onto the board on "เสียบ"
    snaps.forEach((w, k) => {
      const kk = E.inOut(P(u, B.plug + .05 + k * .25, .3)), on = u > B.house && u < B.s3 - .2;
      const x = lerp(SNAP_FROM[k][0], SNAP_TO[k][0], kk), y = lerp(SNAP_FROM[k][1], SNAP_TO[k][1], kk);
      const kout = E.in(P(u, B.s3 - .25, .45));
      tf(w, { x: x - 900 * kout, y, o: on ? clamp((u - B.house - .2) / .3) : 0, s: 1 + .25 * Math.max(0, 1 - Math.abs(u - B.plug - .35 - k * .25) / .12) });
    });
    // CPU: thought waves
    waves.forEach((w, k) => { const ph = ((u - B.brain) * .9 - k / 3) % 1, on = u > B.brain && u < B.s4 - .3; tf(w, { s: .6 + .7 * ((ph + 1) % 1), o: on ? (1 - (ph + 1) % 1) * .9 : 0, y: -40 * ((ph + 1) % 1) }); });
    // RAM: files drop onto the desk; the PC beeps (red rings)
    files.forEach((w, k) => { const kk = E.out(P(u, B.desk + .1 + k * .12, .4)); tf(w, { y: lerp(-160, 0, kk) - k * 22, o: kk * (1 - P(u, B.all - .25, .25)), r: (k - 1) * 8 }); });
    tf(bpcW, life(u, B.noRam, B.all - .25, { from: .4, dy: 40, out: .25 }));
    bpc.set({ led: u > B.beep && u < B.beep + .7 ? (Math.sin((u - B.beep) * 20) > 0 ? 1 : .2) : 0, color: '#FF4D5E' });
    rings.forEach((w, k) => { const v = u - B.beep - k * .14; tf(w, { s: .4 + 1.3 * clamp(v / .7), o: v > 0 && v < .7 ? 1 - v / .7 : 0 }); });
    tf(beep, { ...life(u, B.beep, B.all - .25, { from: .3, dy: 0, d: .4, el: true, out: .25 }), x: u > B.beep && u < B.beep + .3 ? Math.sin(u * 80) * 5 : 0 });
    // all four files line up, stamps pulse again on "ขาดไม่ได้!"
    let shake = 0;
    all.forEach((a, i) => {
      const l = life(u, B.all + i * .12, 1e9, { from: .4, dy: 80, d: .5 });
      tf(a.w, { ...l, r: (i % 2 ? 2 : -2) + Math.sin(u * 1.5 + i) * .8, x: shake });
      const v = u - B.must;
      tf(a.stp, allIn ? { s: v > 0 ? 1 + .25 * Math.max(0, 1 - v / .2) : 1, o: 1 } : { o: 0 });
    });
    tf(allHdr, pop(u, B.all, 1e9));
    const ml = life(u, B.must, 1e9, { from: .2, dy: 0, d: .6, el: true });
    tf(must, { ...ml, s: ml.s * (1 + .02 * Math.sin(u * 5)), x: u > B.must && u < B.must + .26 ? Math.sin(u * 90) * 6 * (1 - (u - B.must) / .26) : 0 });
  };
};
