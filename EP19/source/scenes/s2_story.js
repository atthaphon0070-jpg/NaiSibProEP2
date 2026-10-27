// SCENE 2 — STORY (02_story.mp3). Flat 2D office: new officer drafts a letter, puts the Garuda top-RIGHT,
// sends it to the chief's tray, it bounces back with a red "แก้ไข" stamp: wrong size + wrong position.
(function () {
  const { clamp, lerp, E, P, tf, life, bob, h, sfx, ICON } = NSP;
  const X = EP19, K = 'story', A = X.S(K);
  const b = i => X.B(K, i), w = (i, s) => X.W(K, i, s);
  const el = document.getElementById('s2');
  const xIcon = s => `<span class="xic" style="width:${s}px;height:${s}px">${ICON.cross('#EF4444', s * .72)}</span>`;
  el.innerHTML = `
    <div id="o-back" class="abs" style="left:-40px;top:560px;width:1160px;height:700px;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 110px)">
      <svg width="1160" height="700" viewBox="0 0 1160 700">
        <rect x="0" y="0" width="1160" height="700" fill="#16335F"/>
        <rect x="0" y="0" width="1160" height="700" fill="url(#o-wallg)"/>
        <defs><linearGradient id="o-wallg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D4177" stop-opacity=".0"/><stop offset="1" stop-color="#0D2346" stop-opacity=".9"/></linearGradient>
          <linearGradient id="o-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7CC4FF"/><stop offset="1" stop-color="#CDEBFF"/></linearGradient></defs>
        <g transform="translate(700 70)"><rect width="300" height="250" rx="14" fill="#0E2547"/><rect x="14" y="14" width="272" height="222" rx="6" fill="url(#o-sky)"/>
          ${[...Array(9)].map((_, i) => `<rect x="14" y="${22 + i * 24}" width="272" height="9" fill="#E9F4FF" opacity=".75"/>`).join('')}</g>
        <g transform="translate(330 90)"><circle r="54" cx="54" cy="54" fill="#F3F6FB" stroke="#0E2547" stroke-width="10"/><path id="o-clk" d="M54 54 L54 20 M54 54 L78 64" stroke="#0E2547" stroke-width="7" stroke-linecap="round"/></g>
        <g transform="translate(90 230)"><rect width="200" height="380" rx="10" fill="#0F2A52"/>
          ${[0, 1, 2].map(r => [0, 1, 2, 3, 4].map(c => `<rect x="${16 + c * 36}" y="${22 + r * 122}" width="28" height="98" rx="4" fill="${['#2F6BFF', '#22D3EE', '#FFD23F', '#5B8CFF', '#7DE8F7'][(r + c) % 5]}" opacity=".85"/>`).join('')).join('')}
          ${[0, 1, 2].map(r => `<rect x="0" y="${120 + r * 122}" width="200" height="10" fill="#0A1E3E"/>`).join('')}</g>
        <rect x="0" y="600" width="1160" height="100" fill="#0C2041"/>
      </svg>
    </div>
    <div id="o-man" class="abs" style="left:190px;top:820px;width:300px;height:380px">
      <svg width="300" height="380" viewBox="0 0 300 380" style="overflow:visible">
        <path d="M40 380 C40 300 70 262 150 262 C230 262 260 300 260 380 Z" fill="#8EC5FF"/>
        <path d="M120 262 L150 300 L180 262 Z" fill="#fff"/><path d="M143 290 L157 290 L162 380 L138 380 Z" fill="#1E3A8A"/>
        <rect x="134" y="214" width="32" height="52" rx="10" fill="#E8B98F"/>
        <g id="o-head" style="transform-origin:150px 230px">
          <circle cx="86" cy="158" r="13" fill="#E8B98F"/><circle cx="214" cy="158" r="13" fill="#E8B98F"/>
          <ellipse cx="150" cy="152" rx="64" ry="72" fill="#F2C9A0"/>
          <path d="M82 156 C74 40 226 36 218 156 C210 122 180 106 150 110 C120 106 92 122 82 156 Z" fill="#1F2937"/>
          <path d="M112 132 L138 128 M162 128 L188 132" stroke="#1F2937" stroke-width="6" stroke-linecap="round"/>
          <g id="o-eyes" style="transform-origin:150px 160px"><ellipse cx="126" cy="160" rx="7" ry="9" fill="#1F2937"/><ellipse cx="174" cy="160" rx="7" ry="9" fill="#1F2937"/></g>
          <path d="M138 196 Q150 204 162 196" stroke="#9A4A3A" stroke-width="5" fill="none" stroke-linecap="round"/>
        </g>
      </svg>
    </div>
    <div id="o-tag" class="abs" style="left:200px;width:320px;top:742px;display:flex;justify-content:center"><div class="pill2 p-yl kt" style="font-size:46px">เจ้าหน้าที่ใหม่</div></div>
    <div id="o-desk" class="abs" style="left:-40px;top:1170px;width:1160px;height:420px">
      <svg width="1160" height="420" viewBox="0 0 1160 420">
        <rect x="40" y="0" width="1080" height="34" rx="8" fill="#D9A06A"/><rect x="40" y="26" width="1080" height="8" fill="#B97F4B"/>
        <rect x="70" y="34" width="1020" height="386" fill="#A8713F"/><rect x="110" y="70" width="400" height="140" rx="10" fill="#9A6537"/><rect x="650" y="70" width="400" height="140" rx="10" fill="#9A6537"/>
        <ellipse cx="270" cy="14" rx="44" ry="16" fill="#F2C9A0"/><ellipse cx="452" cy="14" rx="44" ry="16" fill="#F2C9A0"/>
        <path d="M230 6 C200 -40 196 -90 214 -120 L262 -120 C258 -80 262 -30 300 6 Z" fill="#8EC5FF"/>
        <path d="M492 6 C522 -40 526 -90 508 -120 L460 -120 C464 -80 460 -30 422 6 Z" fill="#8EC5FF"/>
      </svg>
    </div>
    <div id="o-mon" class="abs" style="left:540px;top:930px;width:300px;height:250px">
      <svg width="300" height="250" viewBox="0 0 300 250"><rect x="125" y="190" width="50" height="50" fill="#1F2937"/><rect x="85" y="232" width="130" height="14" rx="6" fill="#111827"/>
        <rect x="0" y="0" width="300" height="200" rx="16" fill="#111827"/><rect x="12" y="12" width="276" height="176" rx="8" fill="#E8F1FF"/></svg>
      <div id="o-scr" class="abs" style="left:96px;top:18px;width:116px;height:164px;background:#fff;box-shadow:0 2px 6px rgba(0,0,0,.2)"></div>
    </div>
    <div id="o-tray" class="abs" style="left:870px;top:1100px;width:200px;height:90px">
      <svg width="200" height="90" viewBox="0 0 200 90"><path d="M10 30 L190 30 L176 86 L24 86 Z" fill="#2F6BFF"/><path d="M10 30 L190 30 L184 44 L16 44 Z" fill="#5B8CFF"/>
        <rect x="40" y="12" width="120" height="26" rx="3" fill="#fff" transform="rotate(-4 100 25)"/><rect x="46" y="4" width="120" height="26" rx="3" fill="#F3F6FB" transform="rotate(3 100 17)"/></svg></div>
    <div id="o-dim" class="abs" style="inset:0;background:rgba(5,14,32,.62)"></div>
    <div id="o-pg" class="abs" style="left:340px;top:612px;width:400px;height:566px;transform-origin:50% 50%"></div>
    <div id="o-c0" class="row" style="top:330px"><div class="big kt" style="font-size:70px">ลองนึกภาพตาม...</div></div>
    <div id="o-c1" class="row" style="top:330px"><div class="pill2 p-nv kt" style="font-size:56px">ร่างหนังสือราชการ</div></div>
    <div id="o-c2" class="row" style="top:330px"><div class="big kt" style="font-size:62px">วางตราครุฑลงไป<span class="yl">...</span></div></div>
    <div id="o-c3" class="row" style="top:330px"><div class="pill2 p-eb kt" style="font-size:56px">ส่งให้หัวหน้าตรวจ</div></div>
    <div id="o-c4" class="row" style="top:330px"><div class="big kt" style="font-size:70px">ผลคือ<span id="o-dots" class="yl">...</span></div></div>
    <div id="o-c5" class="row" style="top:330px"><div class="pill2 p-rd kt" style="font-size:60px">ถูกตีกลับมาให้แก้!</div></div>
    <div id="o-c6" class="row" style="top:330px"><div class="big kt" style="font-size:66px">เพราะ<span class="yl">ครุฑ</span>...</div></div>
    <div id="o-l" class="row" style="top:1222px;gap:30px"><div id="o-l1" class="pill2 p-rd kt" style="font-size:56px">ขนาด ${xIcon(58)}</div><div id="o-l2" class="pill2 p-rd kt" style="font-size:56px">ตำแหน่ง ${xIcon(58)}</div></div>`;
  const q = s => el.querySelector(s);
  // the draft on the monitor (types in) and the big close-up page
  const scr = q('#o-scr'), scrLines = [];
  for (let i = 0; i < 9; i++) { const l = h(`<div style="position:absolute;left:12px;top:${42 + i * 13}px;height:5px;border-radius:3px;background:#B8C2D4;width:0"></div>`); l._w = i % 4 === 3 ? 50 : 88; scr.appendChild(l); scrLines.push(l); }
  const scrG = h(`<div class="abs" style="left:84px;top:6px">${X.gar(22)}</div>`); scr.appendChild(scrG);
  const pg = X.a4(400); pg.style.left = '0'; pg.style.top = '0'; q('#o-pg').appendChild(pg);
  const GH = 54, gx = 400 - 26 - GH * X.GR, gy = 24;                 // garuda placed top-RIGHT (the mistake)
  const PG_G = h(`<div class="abs" style="left:${gx}px;top:${gy}px;width:${GH * X.GR}px;height:${GH}px;transform-origin:50% 100%">${X.gar(GH)}</div>`); pg.appendChild(PG_G);
  const RING = h(`<svg class="abs" style="left:${gx + GH * X.GR / 2 - 70}px;top:${gy + GH / 2 - 70}px;overflow:visible" width="140" height="140"><circle cx="70" cy="70" r="58" fill="none" stroke="#EF4444" stroke-width="9" stroke-linecap="round" stroke-dasharray="365" stroke-dashoffset="365" transform="rotate(-100 70 70)"/></svg>`); pg.appendChild(RING);
  const STAMP = h(`<div class="stamp" style="left:70px;top:205px;width:260px;height:140px;font-size:86px">แก้ไข</div>`); pg.appendChild(STAMP);

  const T = { man: b(1), draft: b(2), put: b(3), land: w(3, 'ลงไป'), send: b(4), res: b(5), back: b(6), stamp: w(6, 'ให้แก้'), why: b(7), size: b(8), pos: b(9) };
  X.shake(T.stamp + .05, 6, 8);
  sfx('pop', T.man + .05, .7); for (let i = 0; i < 10; i++) sfx('type', T.draft + .2 + i * .22, .5);
  sfx('whoosh', T.put + .05, .6); sfx('whoosh', T.land - .25, .5); sfx('click', T.land, .9);
  sfx('page', T.send + .05, .8); sfx('whoosh', T.send + .6, .5); sfx('pop', T.res + .1, .4);
  sfx('whoosh', T.back + .02, .7); sfx('stamp', T.stamp + .05, 1); sfx('err', T.stamp + .12, .5);
  sfx('pop', T.why + .1, .7); sfx('err', T.size + .05, .8); sfx('err', T.pos + .05, .8);

  function draw(t) {
    const u = t - A;
    // set: gentle parallax drift (back wall slower than the desk)
    tf(q('#o-back'), { x: -12 * Math.sin(u * .18), y: 4 * Math.sin(u * .3) });
    tf(q('#o-desk'), { x: -24 * Math.sin(u * .18) });
    tf(q('#o-mon'), { x: -24 * Math.sin(u * .18) });
    tf(q('#o-tray'), { x: -24 * Math.sin(u * .18) + (t > T.res && t < T.back ? Math.sin((t - T.res) * 30) * 3 * (1 - P(t, T.res, .6)) : 0) });
    q('#o-clk').setAttribute('transform', `rotate(${u * 30} 54 54)`);
    // officer: rises in on "เจ้าหน้าที่ใหม่", breathes, blinks, glances at the screen
    const mi = E.back(P(t, T.man - .25, .6));
    tf(q('#o-man'), { x: -20 * Math.sin(u * .18), y: lerp(120, 0, mi) + bob(u, 0, 3, 2.2), o: clamp(mi * 3) });
    q('#o-head').style.transform = `rotate(${t > T.draft ? 6 * E.inOut(P(t, T.draft, .5)) : 0}deg)`;
    const bl = (u % 3.1) < .12 ? .15 : 1; q('#o-eyes').style.transform = `scaleY(${bl})`;
    tf(q('#o-tag'), life(t, T.man, T.draft + .6, { from: .3, dy: 30, d: .5, el: true }));
    // monitor draft types in
    scrLines.forEach((l, i) => { l.style.width = l._w * E.out(P(t, T.draft + .2 + i * .26, .3)) + 'px'; });
    tf(scrG, { o: clamp((t - T.land) / .2), s: 1 });
    // close-up page: flies out of the monitor, garuda lands top-right, goes to the tray, bounces back
    const pIn = E.inOut(P(t, T.put, .6)), pOut = E.in(P(t, T.send + .1, .7)), pAway = E.in(P(t, T.send + .8, .5)), pBack = E.back(P(t, T.back, .6));
    let px = lerp(150, 0, pIn), py = lerp(160, 0, pIn), ps = lerp(.28, 1, pIn), po = clamp((t - T.put) / .15), pr = 0;
    if (t > T.send) { px = lerp(0, 430, pOut) + 380 * pAway; py = lerp(0, 255, pOut); ps = lerp(1, .32, pOut); pr = 8 * pOut; }
    if (t > T.back) { px = lerp(800, 0, pBack); py = lerp(255, 0, E.out(P(t, T.back, .5))); ps = lerp(.32, 1, E.out(P(t, T.back, .5))); pr = lerp(14, 0, E.out(P(t, T.back, .6))); }
    tf(q('#o-pg'), { x: px, y: py + (t > T.put ? bob(u, 1, 3, 1.4) : 0), s: ps, r: pr, o: po });
    const dimOn = clamp((t - T.put) / .4) * (1 - clamp((t - T.send - .3) / .5)) + clamp((t - T.back) / .3);
    q('#o-dim').style.opacity = .95 * clamp(dimOn);
    const gl = X.snap(P(t, T.land - .3, .45));
    tf(PG_G, { y: lerp(-260, 0, gl), o: clamp((t - T.land + .3) / .1), sy: 1 - .08 * Math.max(0, 1 - Math.abs(t - T.land - .02) / .08) });
    const ring = RING.querySelector('circle'); ring.setAttribute('stroke-dashoffset', 365 * (1 - E.out(P(t, T.why + .1, .5))));
    tf(RING, { o: t > T.why ? 1 : 0, s: 1 + .05 * Math.sin((t - T.why) * 6) * (t > T.why ? 1 : 0) });
    const sk = P(t, T.stamp - .14, .18);
    tf(STAMP, { s: lerp(2.4, 1, E.in(sk)), r: -14, o: t > T.stamp - .14 ? clamp(sk * 3) : 0 });
    // captions (one at a time, each held while spoken)
    tf(q('#o-c0'), life(t, b(0), T.draft - .05, { from: .5, dy: 30, d: .45, out: .2 }));
    tf(q('#o-c1'), life(t, T.draft, T.put - .05, { from: .5, dy: 30, d: .45, out: .2 }));
    tf(q('#o-c2'), life(t, T.put, T.send - .05, { from: .5, dy: 30, d: .45, out: .2 }));
    tf(q('#o-c3'), life(t, T.send, T.res - .05, { from: .5, dy: 30, d: .45, out: .2 }));
    tf(q('#o-c4'), life(t, T.res, T.back - .05, { from: .5, dy: 30, d: .45, out: .2 }));
    q('#o-dots').style.opacity = .4 + .6 * Math.abs(Math.sin((t - T.res) * 4));
    tf(q('#o-c5'), { ...life(t, T.back, T.why - .05, { from: .4, dy: 0, d: .4, el: true, out: .2 }) });
    tf(q('#o-c6'), life(t, T.why, 1e9, { from: .5, dy: 30, d: .45 }));
    tf(q('#o-l1'), life(t, T.size, 1e9, { from: .3, dy: 30, d: .5, el: true }));
    tf(q('#o-l2'), life(t, T.pos, 1e9, { from: .3, dy: 30, d: .5, el: true }));
  }
  window.SC = window.SC || {};
  SC.story = { el, a: X.S(K), b: X.S('know'), draw };
})();
