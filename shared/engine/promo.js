// NaiSibPro promotional ending (shared, EP04+). Generalised from EP.03's promo scene.
// Beats follow the measured phrase starts of the episode's 07_promotion.mp3 (TL.promo_cues).
// Uses the approved poster as-is (shown whole, never zoomed into prices/QR); no prices, links or QR claims.
(function () {
  const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark, pressDepth } = window.NSP;
  const BASE = window.NSP.BASE;
  document.head.insertAdjacentHTML('beforeend', `<style>
    .pr-callout{position:absolute;left:70px;width:880px;top:1215px;height:110px}
    .pr-callout .in{position:absolute;left:50%;translate:-50% 0;display:flex;align-items:center;gap:18px;padding:20px 38px;border-radius:44px;background:linear-gradient(90deg,#EE7FAA,#F7A8C8);color:#fff;font-weight:800;font-size:46px;box-shadow:0 16px 36px rgba(238,127,170,.45),inset 0 4px 0 rgba(255,255,255,.4);white-space:nowrap}
    .pr-callout .ci{width:66px;height:66px;border-radius:50%;background:#fff;display:grid;place-items:center}
    .pr-feat{position:absolute;display:flex;align-items:center;gap:10px;padding:10px 22px;border-radius:30px;background:#fff;font-weight:700;font-size:29px;color:var(--navy);box-shadow:0 6px 14px rgba(110,90,150,.14);white-space:nowrap}
    .pr-feat .ck{width:34px;height:34px;border-radius:50%;background:var(--ok);display:grid;place-items:center}
    .pr-tile{width:250px;height:200px;border-radius:36px;background:linear-gradient(180deg,#fff,#FFF3F9);box-shadow:0 14px 28px rgba(110,90,150,.16),0 0 0 5px #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;font-weight:700;font-size:32px}
    .pr-tile .ti{width:96px;height:96px;border-radius:28px;display:grid;place-items:center}
    .pr-pkg{width:270px;height:380px;border-radius:36px;background:#fff;box-shadow:0 16px 30px rgba(110,90,150,.18),0 0 0 5px #fff;display:flex;flex-direction:column;align-items:center;gap:12px;padding-top:22px;position:relative}
    .pr-pkg .tag{font-weight:800;font-size:28px;color:#fff;padding:6px 26px;border-radius:18px}
    .pr-pkg .du{font-weight:800;font-size:64px;margin-top:24px}
    .pr-pkg .btn{position:absolute;bottom:26px;left:22px;right:22px;height:62px;border-radius:31px;display:grid;place-items:center;font-weight:700;font-size:28px;color:#fff}
    .pr-big{font-weight:800;line-height:1;background:linear-gradient(180deg,#FFC2DA,#EE7FAA 55%,#C8557F);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 0 #fff) drop-shadow(0 10px 16px rgba(200,80,130,.3))}
    .pr-end{position:absolute;inset:0;background:linear-gradient(165deg,#FCE0EE 0%,#F3E7F8 45%,#D9E9FC 100%);visibility:hidden}
  </style>`);

  // opts: { start, dur, cues[8], calls[7] = callout text for beats 1..7, feats, finalMsg }
  function build(scene, opts) {
    const PR = opts.start, PD = opts.dur;
    const C = opts.cues.slice(0, 8);
    while (C.length < 8) C.push(Math.min(PD - .5, C[C.length - 1] + 2));
    const END_AT = opts.endAt ?? Math.max(C[7] + 1.4, Math.min(C[7] + 2.4, PD - .4));
    mark('endcard', PR + END_AT);
    const doc = () => `<svg width="170" height="221" viewBox="0 0 200 260"><path d="M14 8 H150 L190 48 V246 Q190 254 182 254 H14 Q6 254 6 246 V16 Q6 8 14 8Z" fill="#fff" stroke="#F3E6F0" stroke-width="3"/><path d="M150 8 V40 Q150 48 158 48 H190Z" fill="#E2ECFA"/><path d="M30 92h140M30 116h140M30 140h120M30 164h140M30 188h96" stroke="#DCE6F4" stroke-width="8" stroke-linecap="round"/></svg>`;
    scene.insertAdjacentHTML('beforeend', `
      <div class="pr-poster abs c" style="left:500px;top:330px;width:420px;height:747px;border-radius:34px;overflow:hidden;box-shadow:0 24px 50px rgba(110,90,150,.3),0 0 0 8px #fff"><img src="${BASE}brand/poster.jpg" style="width:420px;height:747px;display:block"></div>
      <div class="pr-logo abs c" style="left:70px;top:430px;width:480px"><img src="${BASE}brand/logo.png" style="width:480px"></div>
      ${[1, 2, 3, 4, 5, 6, 7].map(i => `<div class="pr-b${i} abs c" style="left:70px;width:880px;top:340px;height:820px"></div>`).join('')}
      <div class="pr-cursor abs" style="left:0;top:0;width:110px;height:110px">${ICON.hand(110)}</div>
      <div class="pr-callout"></div><div class="pr-feats"></div>
      <div class="pr-end">
        <img class="ec-logo abs c" src="${BASE}brand/logo.png" style="width:560px;left:260px;top:250px">
        <div class="ec-word abs c wordmark" style="left:0;width:1080px;top:900px;text-align:center">NaiSibPro</div>
        <div class="ec-tag abs c title-sticker" style="left:40px;width:1000px;top:1090px;text-align:center;font-size:60px">ติววันละนิด พิชิตข้อสอบตำรวจ!</div>
        <div class="ec-fin abs c" style="left:70px;width:880px;top:1215px;display:flex;justify-content:center"><div class="pill" style="font-size:36px;padding:14px 32px;background:#fff;color:var(--deep);box-shadow:0 10px 22px rgba(110,90,150,.18)">${opts.finalMsg}</div></div>
        <div class="ec-cta abs c" style="left:70px;width:880px;top:1320px;display:flex;justify-content:center"><div class="pill" style="font-size:44px;font-weight:800;padding:18px 42px;color:#fff;background:linear-gradient(90deg,#EE7FAA,#F7A8C8);box-shadow:0 16px 34px rgba(238,127,170,.45),inset 0 4px 0 rgba(255,255,255,.4)">${ICON.link(48, '#fff')}คลิกลิงก์ที่หน้าโปรไฟล์</div><div class="ec-hand" style="position:absolute;left:640px;top:62px">${ICON.hand(104)}</div></div>
        <div class="ec-conf"></div></div>`);
    const q = s => scene.querySelector(s);
    // optional central safe zone {x0,x1,y0,y1}: scale the foreground (designed for x 70–950, y 330–1500)
    // into the zone about a computed origin; full-frame backgrounds stay full-frame.
    if (opts.zone) {
      const Z = opts.zone, k = (Z.x1 - Z.x0) / 880, ox = (Z.x0 - 70 * k) / (1 - k), oy = ((Z.y0 + Z.y1) / 2 - 915 * k) / (1 - k);
      const wrap = (parent, nodes) => { const w = h(`<div style="position:absolute;inset:0;transform-origin:${ox}px ${oy}px;transform:scale(${k})"></div>`); nodes.forEach(n => w.appendChild(n)); parent.appendChild(w); };
      wrap(scene, ['.pr-poster', '.pr-logo', '.pr-b1', '.pr-b2', '.pr-b3', '.pr-b4', '.pr-b5', '.pr-b6', '.pr-b7', '.pr-cursor', '.pr-callout', '.pr-feats'].map(q));
      const end = q('.pr-end'); wrap(end, [...end.children]);
    }
    const B = i => q('.pr-b' + i);
    B(1).innerHTML = `<div class="b1-stack" style="position:absolute;left:290px;top:380px;width:300px;height:400px">${[...Array(7)].map((_, i) => `<div class="b1d c" style="position:absolute;left:${65 + (i % 2) * 14}px;top:${120 - i * 22}px;filter:drop-shadow(0 10px 14px rgba(90,80,140,.2))">${doc()}</div>`).join('')}</div>
      <div style="position:absolute;left:0;right:0;top:80px;text-align:center"><span class="b1-num pr-big" style="font-size:190px">10,000+</span></div>`;
    B(2).innerHTML = `<div class="card" style="position:absolute;left:150px;top:90px;width:580px;height:560px;overflow:hidden">
      <div style="height:110px;background:linear-gradient(90deg,#EE7FAA,#F7A8C8);color:#fff;font-weight:800;font-size:46px;display:flex;align-items:center;justify-content:center;gap:16px">${ICON.cal(54, '#fff')}อัปเดตทุกสัปดาห์</div>
      <div style="display:grid;grid-template-columns:repeat(7,1fr);gap:12px;padding:30px">${['จ', 'อ', 'พ', 'พฤ', 'ศ', 'ส', 'อา'].map(d => `<div style="text-align:center;font-weight:700;font-size:26px;color:var(--muted)">${d}</div>`).join('')}
      ${[...Array(28)].map((_, i) => `<div class="b2c" style="height:66px;border-radius:16px;background:#F4F6FB;display:grid;place-items:center;font-weight:600;font-size:24px;color:var(--muted)">${i + 1}</div>`).join('')}</div></div>
      <div class="b2-arrow" style="position:absolute;left:700px;top:-10px;width:150px;height:150px;border-radius:50%;background:#fff;box-shadow:0 12px 26px rgba(110,90,150,.2);display:grid;place-items:center"><svg width="90" height="90" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" fill="none" stroke="#EE7FAA" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`;
    const SUBJ = [['กฎหมาย', `<svg width="60" height="60" viewBox="0 0 24 24"><path d="M12 3v16M5 7h14M4 19h16" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M5 7l-3 6h6zM19 7l-3 6h6z" fill="#fff"/></svg>`],
      ['คณิตศาสตร์', `<div style="font-weight:800;font-size:40px;color:#fff;line-height:1.05;text-align:center">+ −<br>× ÷</div>`], ['ภาษาไทย', `<div style="font-weight:800;font-size:60px;color:#fff">ก</div>`],
      ['ภาษาอังกฤษ', `<div style="font-weight:800;font-size:50px;color:#fff">Aa</div>`], ['คอมพิวเตอร์', `<svg width="58" height="58" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="13" rx="2" fill="#fff"/><path d="M8 21h8M12 16v5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`],
      ['สารรอบรู้', `<svg width="58" height="58" viewBox="0 0 24 24"><path d="M9 18h6M10 21h4M12 3a6 6 0 0 0-3.5 10.9c.6.4.9 1 .9 1.6V16h5.2v-.5c0-.6.3-1.2.9-1.6A6 6 0 0 0 12 3z" fill="#fff"/></svg>`]];
    B(3).innerHTML = `<div style="position:absolute;left:0;right:0;top:150px;display:grid;grid-template-columns:repeat(3,250px);gap:30px;justify-content:center">${SUBJ.map((s, i) => `<div class="pr-tile b3t c"><div class="ti" style="background:linear-gradient(160deg,${i % 2 ? '#B8D9F8,#6F9FE0' : '#FFD6E6,#EE7FAA'})">${s[1]}</div>${s[0]}</div>`).join('')}</div>`;
    B(4).innerHTML = `<div class="card blue" style="position:absolute;left:120px;top:40px;width:640px;height:700px;border-radius:50px;overflow:hidden">
      <div style="display:flex;justify-content:space-between;align-items:center;padding:30px 34px"><div style="font-weight:700;font-size:32px">ข้อ 12 / 100</div>
        <div class="pill" style="font-size:36px;padding:8px 22px;background:#FFE9F2;color:var(--hot)">${ICON.timer(40)}<span class="b4-time">59:59</span></div></div>
      <div style="height:12px;margin:0 34px;border-radius:6px;background:#EEF2F8"><div class="b4-prog" style="height:12px;width:12%;border-radius:6px;background:linear-gradient(90deg,#95BFEF,#5E8FD6)"></div></div>
      <div style="padding:34px">${[95, 80, 60].map(w => `<div style="height:22px;width:${w}%;border-radius:11px;background:#E7EDF6;margin-bottom:18px"></div>`).join('')}
      ${['ก', 'ข', 'ค', 'ง'].map((c, i) => `<div class="b4o" style="display:flex;align-items:center;gap:18px;height:84px;border-radius:42px;background:#F4F7FC;margin-top:18px;padding:0 16px"><div style="width:56px;height:56px;border-radius:50%;background:#fff;display:grid;place-items:center;font-weight:800;font-size:30px;color:var(--deep);box-shadow:0 0 0 4px #DCE7F6">${c}</div><div style="height:18px;width:${[50, 64, 44, 58][i]}%;border-radius:9px;background:#E1E8F3"></div></div>`).join('')}</div></div>`;
    B(5).innerHTML = `<div class="card" style="position:absolute;left:90px;top:40px;width:700px;height:700px;border-radius:50px">
      <div style="display:flex;align-items:center;gap:16px;padding:32px 36px"><div style="width:74px;height:74px;border-radius:22px;background:linear-gradient(160deg,#FFD6E6,#EE7FAA);display:grid;place-items:center">${ICON.ai(52, '#fff')}</div><div style="font-weight:800;font-size:40px">ผลวิเคราะห์รายวิชา</div></div>
      <div style="position:relative;height:380px;margin:0 40px;border-bottom:4px solid #E7EDF6;display:flex;align-items:flex-end;justify-content:space-around">${[.62, .8, .55, .7, .9, .66].map((v, i) => `<div class="b5b" style="width:62px;border-radius:18px 18px 6px 6px;background:linear-gradient(180deg,${i % 2 ? '#95BFEF,#5E8FD6' : '#F7A8C8,#EE7FAA'});transform-origin:bottom center;height:${v * 360}px"></div>`).join('')}</div>
      <div style="display:flex;justify-content:space-around;margin:12px 40px 0;font-weight:600;font-size:22px;color:var(--muted)">${['กฎหมาย', 'คณิต', 'ไทย', 'อังกฤษ', 'คอมฯ', 'รอบรู้'].map(s => `<span style="width:90px;text-align:center">${s}</span>`).join('')}</div></div>`;
    const PK = [['STARTER', '6 เดือน', '#2E8FA0'], ['PLUS', '1 ปี', '#EE7FAA'], ['REGENT', '2 ปี', '#2E8FA0']];
    B(6).innerHTML = `<div style="position:absolute;left:0;right:0;top:230px;display:flex;justify-content:center;gap:24px">${PK.map(p => `<div class="pr-pkg c b6p"><div class="tag" style="background:${p[2]}">${p[0]}</div><div class="du">${p[1]}</div>
      <div style="display:flex;flex-direction:column;gap:12px;width:200px;margin-top:6px">${[90, 70, 80].map(w => `<div style="height:14px;width:${w}%;border-radius:7px;background:#EEF2F8"></div>`).join('')}</div><div class="btn" style="background:${p[2]}">เลือกแพ็กเกจนี้</div></div>`).join('')}</div>`;
    B(7).innerHTML = `<div class="b7-btn" style="position:absolute;left:0;right:0;top:640px;display:flex;justify-content:center"><div class="pill" style="font-size:50px;font-weight:800;padding:24px 50px;color:#fff;background:linear-gradient(90deg,#EE7FAA,#F7A8C8);box-shadow:0 18px 36px rgba(238,127,170,.5),inset 0 4px 0 rgba(255,255,255,.4)">${ICON.link(56, '#fff')}คลิกลิงก์ที่หน้าโปรไฟล์</div></div>`;
    const ICONS = [null, ICON.docs(46), ICON.cal(46), ICON.book(46), ICON.timer(46), ICON.ai(46), ICON.pkg(46), ICON.link(46)];
    const calls = opts.calls.map((txt, k) => { const i = k + 1; const el = h(`<div class="in c"><div class="ci">${ICONS[i]}</div><span>${txt}</span></div>`); if (txt.length > 26) el.style.fontSize = '40px'; q('.pr-callout').appendChild(el); return { i, el }; });
    const feats = opts.feats.map(([i, txt, x, y]) => { const el = h(`<div class="pr-feat c"><div class="ck">${ICON.check('#fff', 22)}</div>${txt}</div>`); el.style.left = x + 'px'; el.style.top = y + 'px'; q('.pr-feats').appendChild(el); return { i, el }; });
    const b1d = [...scene.querySelectorAll('.b1d')], b2c = [...scene.querySelectorAll('.b2c')], b3t = [...scene.querySelectorAll('.b3t')], b4o = [...scene.querySelectorAll('.b4o')], b5b = [...scene.querySelectorAll('.b5b')], b6p = [...scene.querySelectorAll('.b6p')];
    const ecConf = NSP.buildConfetti(q('.ec-conf'), 70, 540, 640);
    sfx('whoosh', PR + .05, .5); sfx('riser', PR + C[0] + .1, .6); sfx('sparkle', PR + C[0] + .7, .7);
    for (let i = 1; i <= 7; i++) { sfx('whoosh', PR + C[i] - .08, .35); sfx('pop', PR + C[i] + .1, .7); }
    for (let i = 0; i < 6; i++) sfx('coin', PR + C[1] + .2 + i * .16, .4);
    for (let i = 0; i < 6; i++) sfx('pop', PR + C[3] + .15 + i * .12, .45);
    sfx('click', PR + C[6] + 1.0, .8); sfx('click', PR + C[7] + .8, .8);
    sfx('whoosh', PR + END_AT - .1, .7); sfx('ding', PR + END_AT + .25, .8); sfx('sparkle', PR + END_AT + .4, .9); sfx('click', PR + END_AT + 1.7, .6);
    const beat = (u, i) => life(u, C[i], i < 7 ? C[i + 1] - .05 : END_AT, { from: .6, dy: 60, d: .55, out: .25 });
    function draw(t) {
      const u = t - PR;
      const lg = life(u, C[0], C[1] - .05, { from: .3, dy: 300, d: .9, out: .3, el: true });
      tf(q('.pr-logo'), { ...lg, y: lg.y + bob(u, 0, 8) });
      const pIn = E.out(P(u, C[0] + .3, .8)), late = u >= C[7];
      const po = u < C[1] ? clamp((u - C[0] - .3) * 3) * (1 - P(u, C[1] - .3, .25)) : late ? clamp((u - C[7]) * 3) * (1 - P(u, END_AT, .2)) : 0;
      tf(q('.pr-poster'), { x: late ? -280 : lerp(200, 0, pIn), y: (late ? -40 : 0) + bob(u, 1, 6), r: late ? -4 : lerp(16, 6, pIn), s: late ? .78 : 1, o: po });
      for (let i = 1; i <= 7; i++) tf(B(i), beat(u, i));
      q('.b1-num').textContent = (Math.round(10000 * E.out(P(u, C[1] + .1, 1.2)) / 100) * 100).toLocaleString('en-US') + '+';
      b1d.forEach((d, i) => tf(d, { ...life(u, C[1] + .1 + i * .1, 1e9, { from: .3, dy: -120, d: .4 }), r: (i % 2 ? 4 : -4) }));
      b2c.forEach((c, i) => { const on = u > C[2] + .3 + (i % 7) * .08 && (Math.floor(i / 7) % 2 === 0 || u > C[2] + 1.0); c.style.background = on && i % 7 === 4 ? 'linear-gradient(160deg,#FFD6E6,#EE7FAA)' : on ? '#FFF0F6' : '#F4F6FB'; c.style.color = on && i % 7 === 4 ? '#fff' : ''; });
      q('.b2-arrow').style.transform = `rotate(${(u - C[2]) * 220}deg)`;
      b3t.forEach((el, i) => tf(el, life(u, C[3] + .15 + i * .12, 1e9, { from: .2, dy: 40, el: true, d: .7 })));
      const sec = Math.max(0, 3599 - Math.floor(Math.max(0, u - C[4]))); q('.b4-time').textContent = `${String(Math.floor(sec / 60)).padStart(2, '0')}:${String(sec % 60).padStart(2, '0')}`;
      q('.b4-prog').style.width = (12 + 10 * E.out(P(u, C[4] + .5, 1.2))) + '%';
      b4o.forEach((o, i) => { const sel = i === 1 && u > C[4] + 1.0; o.style.background = sel ? '#E3EEFD' : '#F4F7FC'; o.style.boxShadow = sel ? '0 0 0 4px #95BFEF' : ''; });
      b5b.forEach((b, i) => { b.style.transform = `scaleY(${E.back(P(u, C[5] + .2 + i * .1, .6))})`; });
      b6p.forEach((p, i) => { const l = life(u, C[6] + .1 + i * .12, 1e9, { from: .4, dy: 60 }); const pick = i === 1 && u > C[6] + 1.0; tf(p, { ...l, y: l.y - (pick ? 24 * E.back(P(u, C[6] + 1.0, .4)) : 0), s: l.s * (pick ? 1.06 : 1) }); p.style.boxShadow = pick ? '0 20px 36px rgba(238,127,170,.35), 0 0 0 5px #fff, 0 0 0 11px rgba(238,127,170,.7)' : ''; });
      q('.b7-btn').style.transform = `scale(${(1 + .04 * Math.sin(u * 6)) * (1 - .08 * pressDepth(u, [C[7] + .8]))})`;
      let cx = 0, cy = 0, co = 0, cs = 1;
      if (u > C[6] + .4 && u < C[7] - .1) { const k = E.inOut(P(u, C[6] + .4, .6)); cx = lerp(900, 520, k); cy = lerp(1300, 940, k); co = clamp((u - C[6] - .4) / .2) * (1 - P(u, C[7] - .35, .25)); cs = 1 - .15 * pressDepth(u, [C[6] + 1.0]); }
      if (u > C[7] + .1 && u < END_AT) { const k = E.inOut(P(u, C[7] + .1, .6)); cx = lerp(900, 700, k); cy = lerp(1400, 1020, k); co = clamp((u - C[7] - .1) / .2) * (1 - P(u, END_AT - .25, .2)); cs = 1 - .15 * pressDepth(u, [C[7] + .8]); }
      const cur = q('.pr-cursor'); cur.style.transform = `translate(${cx}px,${cy}px) scale(${cs})`; cur.style.opacity = co;
      calls.forEach(c => tf(c.el, life(u, C[c.i], c.i < 7 ? C[c.i + 1] - .05 : END_AT, { from: .5, dy: 40, d: .45, out: .2 })));
      feats.forEach(f => tf(f.el, life(u, C[f.i] + .2, END_AT, { from: .3, dy: 30 })));
      const ue = u - END_AT, ec = q('.pr-end');
      ec.style.visibility = ue < 0 ? 'hidden' : 'visible';
      ec.style.clipPath = `circle(${E.out(P(ue, 0, .5)) * 1300}px at 540px 900px)`;
      const l2 = life(ue, .15, 1e9, { from: .2, dy: 0, el: true, d: 1.0 });
      tf(q('.ec-logo'), { ...l2, y: bob(ue, 0, 8), r: Math.sin(ue * 1.8) * 2 });
      tf(q('.ec-word'), life(ue, .4, 1e9, { from: .5, dy: 50 }));
      tf(q('.ec-tag'), life(ue, .65, 1e9, { from: .5, dy: 50 }));
      tf(q('.ec-fin'), life(ue, .85, 1e9, { from: .5, dy: 40 }));
      const ct = life(ue, 1.05, 1e9, { from: .5, dy: 50 });
      tf(q('.ec-cta'), { ...ct, s: ct.s * (1 + .04 * Math.sin(ue * 6)) });
      const eh = q('.ec-hand'); eh.style.transform = `translate(0,${bob(ue, 0, 10, 6)}px) scale(${1 - .15 * pressDepth(ue, [1.7, 2.5])})`; eh.style.opacity = clamp((ue - 1.4) / .2);
      NSP.drawConfetti(ecConf, t, PR + END_AT + .3, 2.8);
    }
    return { draw, END_AT };
  }
  window.PROMO = { build };
})();
