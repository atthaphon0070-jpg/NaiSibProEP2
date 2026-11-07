// EP.39 — scenes. Every element is a pure function of the master time t (deterministic frame capture).
(function () {
  const { clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark, rnd } = window.NSP;
  const SE = window.SeqEngine, { slotX, pm } = SE;
  const MA = window.SeqMath.A, B = window.BEATS, TL = window.TL;
  const S0 = k => TL[k][0];
  const HK = S0('hook'), STY = S0('story'), KN = S0('know'), EX = S0('expl'), QZ = S0('quiz'), CD = S0('cd'), AN = S0('ans'), PR = S0('promo'), END = TL.end;
  const stage = document.getElementById('stage'), brandEl = document.getElementById('brand');
  const scenes = [];
  function scene(id, a, b) { const el = h(`<div class="scene" id="${id}"></div>`); stage.insertBefore(el, brandEl); const sc = { el, a, b, draw: () => { } }; scenes.push(sc); return sc; }
  const add = (parent, html) => { const el = h(html); parent.appendChild(el); return el; };
  const ctr = (parent, html, cls = '', ess = true) => add(parent, `<div class="ctr"><div class="in ${ess ? 'ess' : ''} ${cls}">${html}</div></div>`);
  const fio = (t, a, b = 1e9, d = .35, o = .3) => clamp((t - a) / d) * (1 - clamp((t - b) / o));
  function pop(el, t, a, b, x, y, { d = .5, from = .4, dy = 40, out = .3, s = 1, r = 0, o = 1 } = {}) {
    const l = life(t, a, b, { d, from, dy, out }); tf(el, { x, y: y + l.y, s: l.s * s, o: l.o * o, r }); return l;
  }
  const pulse = (t, at, d = .7) => (t >= at && t < at + d) ? Math.sin(Math.PI * (t - at) / d) : 0;
  const ARR = (w = 44, c = 'currentColor') => `<svg class="ar" width="${w}" height="28" viewBox="0 0 44 28"><path d="M3 14H36M26 4l12 10-12 10" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const TIMES = `<svg width=".5em" height=".5em" viewBox="0 0 10 10" style="margin:0 .12em;vertical-align:.04em"><path d="M1.5 1.5l7 7M8.5 1.5l-7 7" stroke="currentColor" stroke-width="1.9" stroke-linecap="round"/></svg>`;
  const SEQ = MA.sequence, ODD = MA.odd, EVEN = MA.even, OD = MA.oddDifferences, ED = MA.evenDifferences;
  const sgn = d => (d > 0 ? '+' : '-') + Math.abs(d);
  const NS = 'http://www.w3.org/2000/svg';
  function svgLayer(parent) { const s = document.createElementNS(NS, 'svg'); s.setAttribute('width', 1080); s.setAttribute('height', 1920); s.style.cssText = 'position:absolute;left:0;top:0;overflow:visible'; parent.appendChild(s); return s; }
  function polyl(svg, pts, col, w = 10) {
    const d = 'M' + pts.map(p => p.join(' ')).join(' L');
    const g = document.createElementNS(NS, 'g');
    g.innerHTML = `<path d="${d}" fill="none" stroke="${col}" stroke-opacity=".28" stroke-width="${w * 2.6}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/><path d="${d}" fill="none" stroke="${col}" stroke-width="${w}" stroke-linecap="round" stroke-linejoin="round" pathLength="1" stroke-dasharray="1 1"/>`;
    svg.appendChild(g); return g;
  }
  function setPoly(g, p, o = 1) { g.querySelectorAll('path').forEach(pa => pa.setAttribute('stroke-dashoffset', 1 - clamp(p))); g.style.opacity = p > 0 ? o : 0; }
  // generic confetti (blue / cyan / green / yellow)
  function confetti(parent, n, cx, cy) {
    const cols = ['#2F6BFF', '#22D3EE', '#22C55E', '#FFD23F', '#95BFEF', '#E6F4FF'];
    return Array.from({ length: n }, (_, i) => {
      const el = add(parent, `<div class="conf39" style="background:${cols[i % cols.length]}"></div>`);
      if (i % 3 === 0) { el.style.borderRadius = '50%'; el.style.width = el.style.height = '18px'; }
      const a = rnd() * Math.PI * 2, v = 450 + rnd() * 800;
      return { el, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 650, r: rnd() * 720, cx, cy };
    });
  }
  function drawConf(arr, t, at, dur = 2.2) {
    const u = t - at;
    arr.forEach(c => {
      if (u < 0 || u > dur) { c.el.style.visibility = 'hidden'; return; }
      tf(c.el, { x: c.cx + c.vx * u * .55, y: c.cy + c.vy * u * .55 + 880 * u * u, r: c.r * u, o: clamp(1 - (u - dur * .6) / (dur * .4)) });
    });
  }
  // caption track: [[a, b, html, cls?], ...] one element each, cross-faded
  function captions(parent, list, y, fs = 46) {
    const items = list.map(([a, b, html, cls = '']) => ({ a, b, el: ctr(parent, html, 'cap ' + cls), }));
    items.forEach(it => { it.el.firstChild.style.fontSize = fs + 'px'; });
    return t => items.forEach(it => pop(it.el, t, it.a, it.b, 540, y, { d: .45, from: .7, dy: 24, out: .25 }));
  }

  // =====================================================================
  // BACKGROUND (always on): navy layers, cyan grid, drifting glows, faint math glyphs, scan line
  // =====================================================================
  const BG = scene('sbg', 0, 1e9);
  BG.el.innerHTML = `<div class="bg-grid"></div>
    <div class="bg-glow" style="width:1100px;height:1100px;background:radial-gradient(circle,rgba(47,107,255,.32) 0%,rgba(47,107,255,0) 65%)"></div>
    <div class="bg-glow" style="width:900px;height:900px;background:radial-gradient(circle,rgba(34,211,238,.20) 0%,rgba(34,211,238,0) 65%)"></div>
    <div class="bg-glow" style="width:800px;height:800px;background:radial-gradient(circle,rgba(149,191,239,.16) 0%,rgba(149,191,239,0) 65%)"></div>
    <div class="bg-line"></div><div class="bg-vig"></div>`;
  const bgGrid = BG.el.querySelector('.bg-grid'), bgGlows = [...BG.el.querySelectorAll('.bg-glow')], bgLine = BG.el.querySelector('.bg-line');
  const GLY = ['+', '−', '×', '=', '?', '1', '2', '3', '5', '6', '8', '9', '0', '÷'];
  const glyphs = Array.from({ length: 26 }, (_, i) => {
    const el = add(BG.el, `<div class="bg-gl">${GLY[i % GLY.length]}</div>`);
    el.style.fontSize = (34 + rnd() * 70) + 'px';
    return { el, x: rnd() * 1040, y: rnd() * 1920, sp: 10 + rnd() * 22, ph: rnd() * 6.28, rot: (rnd() - .5) * 40 };
  });
  BG.draw = t => {
    bgGrid.style.backgroundPosition = `0 ${(t * 14) % 72}px, ${(t * 6) % 72}px 0`;
    const G = [[160, 520], [900, 1300], [560, 900]];
    bgGlows.forEach((g, i) => { const r = parseFloat(g.style.width) / 2; tf(g, { x: G[i][0] - r + Math.sin(t * .23 + i * 2) * 120, y: G[i][1] - r + Math.cos(t * .19 + i) * 110 }); });
    glyphs.forEach(p => { let y = (p.y - t * p.sp) % 2000; if (y < -100) y += 2000; tf(p.el, { x: p.x + Math.sin(t * .5 + p.ph) * 20, y, r: p.rot + Math.sin(t * .3 + p.ph) * 10, o: .7 + .3 * Math.sin(t * .9 + p.ph) }); });
    const ly = ((t * 120) % 2400) - 240; tf(bgLine, { y: ly, o: .55 });
  };

  // =====================================================================
  // SCENE 1 — HOOK (01_hook.mp3)
  // =====================================================================
  const S1 = scene('s1', HK, STY), b1 = B.hook;
  const s1svg = svgLayer(S1.el);
  const HX = [370, 540, 710], HY = [725, 920];
  const hpos = i => ({ x: HX[i % 3], y: HY[Math.floor(i / 3)] });
  const trackO = polyl(s1svg, [0, 2, 4].map(i => [hpos(i).x, hpos(i).y]), '#2F6BFF', 9);
  const trackE = polyl(s1svg, [1, 3, 5].map(i => [hpos(i).x, hpos(i).y]), '#22D3EE', 9);
  const s1Title = ctr(S1.el, 'เตรียมสอบนายสิบ', 'ttl'); s1Title.firstChild.style.fontSize = '76px';
  const s1Subj = ctr(S1.el, `<span style="display:inline-flex;width:46px;height:46px;border-radius:12px;background:#fff;color:#2F6BFF;align-items:center;justify-content:center;font-size:34px">${pm('+')}</span>วิชาคณิตศาสตร์`, 'hp'); s1Subj.firstChild.style.fontSize = '42px';
  const hookCards = SEQ.slice(0, 6).map((v, i) => SE.card(S1.el, v, i + 1, { w: 150, hh: 170, fs: 90 }));
  const qBadge = ctr(S1.el, '?', '', true);
  qBadge.firstChild.style.cssText += ';width:90px;height:90px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:72px;color:#142B53;background:radial-gradient(circle at 35% 30%,#FFE58A,#FFD23F 60%,#E0A800);box-shadow:0 0 0 6px rgba(230,244,255,.9),0 0 40px rgba(255,210,63,.55);padding-top:8px';
  const moreChip = ctr(S1.el, `<span style="letter-spacing:6px">…</span>&nbsp;,&nbsp;<span style="color:#FFD23F">?</span>`, 'cap'); moreChip.firstChild.style.fontSize = '48px';
  // up / down cues for the "jumping" beat
  const ud = SEQ.slice(1, 6).map((v, k) => { const up = v > SEQ[k]; return add(S1.el, `<div class="ctr"><div class="in" style="width:56px;height:56px;border-radius:50%;display:grid;place-items:center;background:${up ? '#22D3EE' : '#EE7FAA'};box-shadow:0 0 18px ${up ? 'rgba(34,211,238,.6)' : 'rgba(238,127,170,.5)'}"><svg width="30" height="30" viewBox="0 0 24 24"><path d="${up ? 'M12 4l8 10h-5v6H9v-6H4z' : 'M12 20l8-10h-5V4H9v6H4z'}" fill="#0B1B3A"/></svg></div></div>`); });
  // "not just +2 or ×2" panel
  const nope = ctr(S1.el, `<div style="display:flex;flex-direction:column;gap:36px;align-items:center;padding:40px 46px" class="pnl">
     <div class="mini"><b>10</b><i><span>${pm('+2')}</span>${ARR(52, '#FFD23F')}</i><b>12</b><i><span>${pm('+2')}</span>${ARR(52, '#FFD23F')}</i><b>14</b></div>
     <div class="mini"><b>10</b><i><span>${TIMES}2</span>${ARR(52, '#FFD23F')}</i><b>20</b><i><span>${TIMES}2</span>${ARR(52, '#FFD23F')}</i><b>40</b></div></div>`, '');
  const xSvg = svgLayer(S1.el);
  const crossA = polyl(xSvg, [[318, 722], [762, 798]], '#EF4444', 8), crossA2 = polyl(xSvg, [[762, 722], [318, 798]], '#EF4444', 8);
  const crossB = polyl(xSvg, [[318, 842], [762, 918]], '#EF4444', 8), crossB2 = polyl(xSvg, [[762, 842], [318, 918]], '#EF4444', 8);
  // stopwatch (dramatic hook only — not the countdown)
  const watch = ctr(S1.el, `<svg width="300" height="330" viewBox="0 0 300 330"><defs><radialGradient id="wg" cx=".4" cy=".35"><stop offset="0" stop-color="#2F6BFF"/><stop offset="1" stop-color="#142B53"/></radialGradient></defs>
      <rect x="125" y="6" width="50" height="34" rx="10" fill="#95BFEF"/><rect x="142" y="36" width="16" height="22" fill="#95BFEF"/>
      <circle cx="150" cy="185" r="134" fill="url(#wg)" stroke="#22D3EE" stroke-width="12"/>
      ${Array.from({ length: 12 }, (_, i) => `<line x1="150" y1="68" x2="150" y2="${i % 3 ? 82 : 92}" stroke="#E6F4FF" stroke-width="${i % 3 ? 4 : 7}" stroke-linecap="round" transform="rotate(${i * 30} 150 185)"/>`).join('')}
      <text x="150" y="226" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="120" fill="#FFD23F">?</text>
      <line class="hand" x1="150" y1="185" x2="150" y2="84" stroke="#EE7FAA" stroke-width="8" stroke-linecap="round"/><circle cx="150" cy="185" r="12" fill="#EE7FAA"/></svg>`, '');
  const watchHand = watch.querySelector('.hand');
  const cap1 = captions(S1.el, [
    [-1, b1.notSimple - .1, 'อนุกรมนี้<b>มีอะไรซ่อนอยู่?</b>'],
    [b1.notSimple + .2, b1.nums[0] - .35, 'ไม่ใช่แค่ <b>' + pm('+2') + '</b> หรือ <b>' + TIMES + '2</b> ธรรมดา!'],
    [b1.chaos, b1.butReally - .1, 'ตัวเลข<b>กระโดดไปมา</b> ?!'],
    [b1.butReally, b1.five - .15, 'ซ่อนรูปแบบไว้ถึง <em>2 ชุด!</em>'],
    [b1.five, 99, 'หาคำตอบได้ใน <b>5 วินาที</b> ไหม?'],
  ], 1135, 50);
  S1.draw = t => {
    const u = t - HK;
    // title is fully visible on frame 0 (no entrance), gentle breathing glow only
    tf(s1Title, { x: 540, y: 420, s: 1 + .012 * Math.sin(u * 2.2) });
    pop(s1Subj, u, -1, 99, 540, 528, { d: .5 });
    const out0 = E.in(P(u, b1.notSimple, .5));
    hookCards.forEach((c, i) => {
      let { x, y } = hpos(i), s = 1, o = 1, ry = 0, r = 0, odd = 0, even = 0, glow = 0, dim = 0;
      if (u < b1.nums[0] - .3) {                   // teaser: floating, slowly flipping, then scattered away
        ry = 16 * Math.sin(u * 1.25 + i * 1.1); y += bob(u, i * 1.3, 9, 1.7);
        s = 1 - .35 * out0; o = 1 - out0; x += (x - 540) * .5 * out0; y += (y - 820) * .5 * out0; r = (i % 2 ? 1 : -1) * 14 * out0;
      } else {                                      // each value re-enters on its spoken number
        const a = b1.nums[i], l = life(u, a, 1e9, { d: .5, from: .35, dy: 36 });
        s = l.s; o = l.o; y += l.y; ry = (1 - E.out(P(u, a, .45))) * -90; glow = Math.max(0, 1 - (u - a) / .9) * (u >= a ? 1 : 0);
      }
      const ch = fio(u, b1.chaos, b1.butReally, .3, .4);   // alternating up/down jumps
      y += ch * (i % 2 ? -1 : 1) * 26 * Math.sin((u - b1.chaos) * 7.5);
      r += ch * (i % 2 ? 1 : -1) * 3 * Math.sin((u - b1.chaos) * 7.5);
      const tw = P(u, b1.twoSets, .6);
      if (i % 2 === 0) odd = tw * .9; else even = tw * .9;
      glow = Math.max(glow, tw * .5 * (1 - P(u, b1.five, .4)));
      dim = .75 * P(u, b1.five, .4);
      SE.setCard(c, { x, y, s, o, ry, r, odd, even, glow, dim });
    });
    // question badge
    tf(qBadge, { x: 784, y: 628, s: (1 + .08 * Math.sin(u * 4)) * (1 - .5 * out0 + .5 * P(u, b1.nums[5] + .3, .4)) * (1 - P(u, b1.five, .3)), r: 10 * Math.sin(u * 2), o: (1 - out0 + P(u, b1.nums[5] + .3, .4)) * (1 - P(u, b1.five, .3)) });
    pop(moreChip, u, b1.nums[5] + .45, b1.chaos - .1, 540, 1135, { from: .6, dy: 20 });
    ud.forEach((el, k) => { const a = b1.chaos + .25 + k * .18; const l = life(u, a, b1.butReally - .1, { from: .3, dy: 0 }); const p = hpos(k + 1); tf(el, { x: p.x + 62, y: p.y - 78 + 6 * Math.sin(u * 6 + k), s: l.s, o: l.o }); });
    const nl = life(u, b1.notSimple + .15, b1.nums[0] - .45, { from: .7, dy: 30 });
    tf(nope, { x: 540, y: 820 + nl.y, s: nl.s, o: nl.o });
    const xo = 1 - P(u, b1.nums[0] - .45, .3);
    setPoly(crossA, P(u, b1.plus2 + .5, .25), xo); setPoly(crossA2, P(u, b1.plus2 + .7, .25), xo);
    setPoly(crossB, P(u, b1.plus2 + 1.5, .25), xo); setPoly(crossB2, P(u, b1.plus2 + 1.7, .25), xo);
    const to = 1 - P(u, b1.five, .4);
    setPoly(trackO, P(u, b1.twoSets, .8), to); setPoly(trackE, P(u, b1.twoSets + .5, .8), to);
    const wl = life(u, b1.five + .1, 99, { from: .3, dy: 30, d: .6 });
    tf(watch, { x: 540, y: 820 + wl.y, s: wl.s, o: wl.o, r: 3 * Math.sin(u * 9) * P(u, b1.five + .3, .3) });
    watchHand.setAttribute('transform', `rotate(${(u - b1.five) * 540} 150 185)`);
    cap1(u);
  };
  sfx('pop', HK + b1.subj, .6); sfx('whoosh', HK + b1.notSimple + .05, .6);
  sfx('stamp', HK + b1.plus2 + .55, .45); sfx('stamp', HK + b1.plus2 + 1.55, .45);
  b1.nums.forEach(a => { sfx('pop', HK + a, .9); sfx('click', HK + a + .05, .4); });
  [0, 1, 2, 3, 4].forEach(k => sfx('tick2', HK + b1.chaos + .25 + k * .18, .25));
  sfx('riser', HK + b1.butReally - .2, .6); sfx('sparkle', HK + b1.twoSets + .1, .8); sfx('ding', HK + b1.twoSets + .6, .4);
  sfx('pop', HK + b1.five + .1, .9); for (let k = 0; k < 4; k++) sfx('tick', HK + b1.five + .6 + k * .5, .25);

  // =====================================================================
  // SCENE 2 — EXAM ROOM STORY (02_story.mp3)
  // =====================================================================
  const S2 = scene('s2', STY, KN), b2 = B.story;
  const room = add(S2.el, `<div class="abs" style="left:0;top:0;width:1080px;height:1920px;transform-origin:560px 1110px"></div>`);
  room.innerHTML = `<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0">
    <defs><linearGradient id="wall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1E3F7A"/><stop offset="1" stop-color="#142B53"/></linearGradient>
      <linearGradient id="desk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3A6BC0"/><stop offset="1" stop-color="#2A5596"/></linearGradient></defs>
    <rect x="40" y="330" width="1000" height="900" rx="40" fill="url(#wall)" stroke="rgba(149,191,239,.35)" stroke-width="3"/>
    <rect x="240" y="372" width="420" height="120" rx="22" fill="#0B1B3A" stroke="#95BFEF" stroke-width="4"/>
    <text x="450" y="447" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="40" fill="#E6F4FF">ห้องสอบนายสิบตำรวจ</text>
    <g transform="translate(790 455)"><circle r="70" fill="#E6F4FF" stroke="#22D3EE" stroke-width="10"/>${Array.from({ length: 12 }, (_, i) => `<line x1="0" y1="-56" x2="0" y2="-46" stroke="#142B53" stroke-width="5" transform="rotate(${i * 30})"/>`).join('')}
      <line class="cl-m" x1="0" y1="0" x2="0" y2="-44" stroke="#142B53" stroke-width="6" stroke-linecap="round"/><line class="cl-h" x1="0" y1="0" x2="0" y2="-30" stroke="#142B53" stroke-width="8" stroke-linecap="round"/><circle r="7" fill="#EE7FAA"/></g>
    <g id="cand">
      <path d="M300 1120 Q300 900 470 880 Q640 900 640 1120Z" fill="#E6F4FF"/>
      <path d="M430 885 L470 960 L510 885Z" fill="#2F6BFF"/>
      <path d="M300 1120 Q300 960 360 915 L380 1120Z" fill="#95BFEF" opacity=".55"/>
      <rect x="440" y="820" width="60" height="80" rx="20" fill="#E9B98F"/>
      <circle cx="470" cy="740" r="100" fill="#F2C9A5"/>
      <circle cx="372" cy="752" r="22" fill="#E9B98F"/><circle cx="568" cy="752" r="22" fill="#E9B98F"/>
      <path d="M368 718 Q370 620 470 628 Q575 622 574 718 Q560 676 520 672 Q470 660 420 676 Q380 688 368 718Z" fill="#0B1B3A"/>
      <g class="eyes"><ellipse cx="432" cy="752" rx="12" ry="15" fill="#0B1B3A"/><ellipse cx="510" cy="752" rx="12" ry="15" fill="#0B1B3A"/></g>
      <path class="brow" d="M410 718 L452 712 M490 712 L532 718" stroke="#0B1B3A" stroke-width="8" stroke-linecap="round"/>
      <path class="mouth" d="M448 800 Q470 812 494 800" fill="none" stroke="#8A3B2E" stroke-width="7" stroke-linecap="round"/>
    </g>
    <polygon points="150,1040 930,1040 990,1170 90,1170" fill="url(#desk)"/>
    <rect x="90" y="1170" width="900" height="70" fill="#1C3D73"/>
    <g transform="translate(560 1100) skewX(-6)"><polygon points="-200,-46 200,-46 214,48 -214,48" fill="#F4F9FF"/>
      <text x="0" y="-12" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="24" fill="#31445D">จงหาจำนวนถัดไป</text>
      <text x="0" y="26" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="26" fill="#2F6BFF">10, 18, 15, 27, 21, 38, 28, 51, 36, ?</text></g>
    <g class="pen" transform="translate(730 1080)"><rect x="-8" y="-90" width="16" height="96" rx="6" fill="#2F6BFF" transform="rotate(32)"/></g>
    <circle cx="700" cy="1085" r="30" fill="#F2C9A5"/><circle cx="330" cy="1080" r="30" fill="#F2C9A5"/>
  </svg>`;
  const clM = room.querySelector('.cl-m'), clH = room.querySelector('.cl-h'), pen = room.querySelector('.pen');
  // card strip (controlled horizontal scrolling with camera tracking)
  const stripBox = add(S2.el, `<div class="abs" style="left:0;top:0;width:1080px;height:1920px"></div>`);
  const stripSvg = svgLayer(stripBox);
  const SP = 156, stripCards = SEQ.concat(['?']).map((v, i) => SE.card(stripBox, v, i + 1, { w: 124, hh: 146, fs: 68, kind: i === 9 ? 'q' : 'num' }));
  // vertical difference arrows — length proportional to |difference|
  const vArr = MA.adjacentDifferences.map((d, k) => {
    const g = document.createElementNS(NS, 'g');
    const L = 8 * Math.abs(d), up = d > 0, col = up ? '#22D3EE' : '#EE7FAA';
    g.innerHTML = `<line x1="0" y1="0" x2="0" y2="${up ? -L : L}" stroke="${col}" stroke-width="9" stroke-linecap="round"/><path d="${up ? `M-16 ${-L + 14} L0 ${-L - 6} L16 ${-L + 14}Z` : `M-16 ${L - 14} L0 ${L + 6} L16 ${L - 14}Z`}" fill="${col}"/>`;
    stripSvg.appendChild(g);
    const lab = k < 4 ? add(stripBox, `<div class="dlab"><div class="in ess ms ${up ? '' : 'dn'}">${pm(sgn(d))}</div></div>`) : null;
    return { g, lab, L, up, d };
  });
  // messy adjacent-difference chips (all mathematically correct, just not a visible system)
  const MESS = [[305, 630, -8], [470, 600, 6], [650, 640, -5], [800, 606, 9], [300, 1075, 7], [440, 1100, -6], [628, 1072, 5], [796, 1100, -9]];
  const messChips = MA.adjacentDifferences.map((d, k) => add(stripBox, `<div class="dlab"><div class="in ess ms ${d > 0 ? '' : 'dn'}">${pm(sgn(d))}</div></div>`));
  const scrib = [[[288, 800], [414, 800]], [[414, 800], [540, 800]], [[540, 800], [666, 800]], [[666, 800], [792, 800]], [[792, 800], [288, 960]], [[288, 960], [414, 960]], [[414, 960], [540, 960]], [[540, 960], [666, 960]]]
    .map((pts, k) => { const [a, b] = pts; const m = [(a[0] + b[0]) / 2 + (k % 2 ? 40 : -40), (a[1] + b[1]) / 2 + (k % 2 ? -90 : 90)]; return polyl(stripSvg, [a, m, b], k % 2 ? '#EE7FAA' : '#FFD23F', 4); });
  const gpos = p => ({ x: slotX((p - 1) % 5), y: p <= 5 ? 800 : 960 });           // 2 × 5 reading-order grid
  const trk2O = polyl(stripSvg, [1, 3, 5, 7, 9].map(p => [gpos(p).x, gpos(p).y]), '#2F6BFF', 8);
  const trk2E = polyl(stripSvg, [2, 4, 6, 8, 10].map(p => [gpos(p).x, gpos(p).y]), '#22D3EE', 8);
  stripSvg.parentNode.insertBefore(stripSvg, stripSvg.parentNode.firstChild);
  // mini candidate reaction (bottom-left) + thought bubble
  const mini = add(S2.el, `<div class="ctr"><div class="in"><svg width="170" height="170" viewBox="0 0 170 170">
      <circle cx="85" cy="85" r="80" fill="#1E3F7A" stroke="#22D3EE" stroke-width="5"/>
      <circle cx="85" cy="92" r="52" fill="#F2C9A5"/><path d="M33 84 Q35 30 85 34 Q138 30 137 84 Q128 60 85 58 Q44 60 33 84Z" fill="#0B1B3A"/>
      <g class="m-eyes"><ellipse cx="66" cy="96" rx="7" ry="9" fill="#0B1B3A"/><ellipse cx="104" cy="96" rx="7" ry="9" fill="#0B1B3A"/></g>
      <path class="m-mouth" d="M70 122 Q85 130 100 122" fill="none" stroke="#8A3B2E" stroke-width="5" stroke-linecap="round"/>
      <path class="m-sweat" d="M136 70 Q146 88 136 96 Q126 88 136 70Z" fill="#22D3EE"/></svg></div></div>`);
  const mMouth = mini.querySelector('.m-mouth'), mSweat = mini.querySelector('.m-sweat');
  const bulb = ctr(S2.el, `<svg width="90" height="110" viewBox="0 0 90 110"><circle cx="45" cy="42" r="34" fill="#FFD23F"/><rect x="30" y="72" width="30" height="26" rx="6" fill="#95BFEF"/><path d="M45 0v-0" /></svg>`, '', false);
  const th = [
    [b2.upDown + .3, b2.adjacent - .1, 'เพิ่มบ้าง ลดบ้าง…?'],
    [b2.adjacent + .2, b2.moreCalc - .1, 'ลองหาผลต่าง…'],
    [b2.moreCalc + .2, b2.notOne - .1, 'ยิ่งคิด ยิ่งงง!'],
    [b2.notOne + .3, 99, 'อ๋อ! มี 2 ชุด!'],
  ].map(([a, b, tx]) => ({ a, b, el: ctr(S2.el, tx, 'thought') }));
  const cap2 = captions(S2.el, [
    [b2.exam + .1, b2.upDown - .1, 'สนามสอบ<em>นายสิบตำรวจ</em>'],
    [b2.upDown + .5, b2.adjacent - .1, 'เพิ่มบ้าง <b>ลดบ้าง</b> สลับไปมา'],
    [b2.adjacent, b2.moreCalc - .1, 'หาผลต่างของ<b>ตัวที่อยู่ติดกัน</b>'],
    [b2.moreCalc + .1, b2.notOne - .1, 'คำนวณถูก… แต่<b>ดูไม่เป็นระบบ</b>'],
    [b2.notOne, 99, 'อนุกรมอาจมี<em>มากกว่า 1 ชุด!</em>'],
  ], 1190, 44);
  // strip camera: x of the card under the centre line over time
  function camX(u) {
    const k = [[b2.upDown, 1.6], [b2.upDown + 2.3, 6.4], [b2.adjacent - .35, .9], [b2.adjacent + .2, .9]];
    for (let i = 0; i < 8; i++) k.push([b2.adjacent + .25 + (i + 1) * .42, Math.max(.9, Math.min(7.6, i + .5))]);
    for (let i = 0; i < k.length - 1; i++) if (u < k[i + 1][0]) return u < k[i][0] ? k[i][1] : lerp(k[i][1], k[i + 1][1], E.inOut(P(u, k[i][0], k[i + 1][0] - k[i][0])));
    return k[k.length - 1][1];
  }
  const stripX = (i, u) => 540 + (i - camX(u)) * SP;
  const STRIP_Y = 830, toGrid = b2.moreCalc;
  function s2pos(i, u) {
    const sl = E.out(P(u, b2.upDown + .15, .7));
    const a = { x: stripX(i, u) + (1 - sl) * 900, y: STRIP_Y };
    if (u < toGrid) return { ...a, s: 1 };
    const g = gpos(i + 1), st = toGrid + i * .07;
    const m = SE.move(u, st, .85, { x: stripX(i, toGrid), y: STRIP_Y, s: 1 }, { x: g.x, y: g.y, s: 110 / 124 }, i % 2 ? -50 : 50);
    return m;
  }
  S2.draw = t => {
    const u = t - STY;
    const push = E.in(P(u, b2.upDown - .1, .75));
    tf(room, { s: 1 + 1.4 * push, o: 1 - push });
    clM.setAttribute('transform', `rotate(${u * 60})`); clH.setAttribute('transform', `rotate(${120 + u * 5})`);
    pen.setAttribute('transform', `translate(${730 + 6 * Math.sin(u * 9)} ${1080 + 4 * Math.cos(u * 11)})`);
    const so = P(u, b2.upDown, .4);
    stripBox.style.opacity = so; stripBox.style.visibility = so > 0 ? 'visible' : 'hidden';
    stripCards.forEach((c, i) => {
      const p = s2pos(i, u);
      const e0 = clamp(1 - (Math.abs(stripX(i, toGrid) - 540) - 200) / 60);
      const edge = u < toGrid ? clamp(1 - (Math.abs(p.x - 540) - 200) / 60) : (e0 > .5 ? 1 : clamp((p.p - .75) / .2));   // only cards fully inside the 640 px window are visible
      const tw = P(u, b2.notOne, .6);
      const hl = vArr.some((v, k) => (k === i || k + 1 === i) && Math.abs(u - (b2.adjacent + .25 + (k + 1) * .42)) < .3) ? 1 : 0;
      SE.setCard(c, { x: p.x, y: p.y, s: p.s ?? 1, o: edge, odd: i % 2 === 0 ? tw : 0, even: i % 2 ? tw : 0, q: i === 9 ? 1 - tw * .0 : 0, glow: Math.max(hl * .8, tw * .45), badge: P(u, b2.notOne + .4, .4), badgeKind: tw > .5 ? (i % 2 ? 'even' : 'odd') : '' });
      const past = [.035, .07, .105].map(d => s2pos(i, u - d));
      SE.setTrail(c, p, u > toGrid ? past : [], i % 2 ? '34,211,238' : '47,107,255');
    });
    vArr.forEach((v, k) => {
      const a = b2.adjacent + .25 + (k + 1) * .42 - .25;
      const x = (stripX(k, u) + stripX(k + 1, u)) / 2;
      const y0 = v.up ? STRIP_Y - 82 : STRIP_Y + 82;
      const p = E.out(P(u, a, .35)), o = clamp(1 - (Math.abs(x - 540) - 190) / 50) * (1 - P(u, toGrid, .3));
      v.g.setAttribute('transform', `translate(${x} ${y0}) scale(1 ${p})`); v.g.style.opacity = p > 0 ? o : 0;
      if (v.lab) tf(v.lab, { x, y: y0 + (v.up ? -v.L - 40 : v.L + 40), s: lerp(.4, 1, E.back(P(u, a + .25, .35))), o: clamp(P(u, a + .25, .2) * 2) * o });
    });
    messChips.forEach((el, k) => { const [x, y, r] = MESS[k]; const l = life(u, toGrid + .55 + k * .14, b2.notOne - .1, { from: .3, dy: 0 }); tf(el, { x: x + 4 * Math.sin(u * 5 + k), y, r: r + 3 * Math.sin(u * 4 + k), s: l.s, o: l.o }); });
    scrib.forEach((g, k) => setPoly(g, P(u, toGrid + .9 + k * .12, .35), .85 * (1 - P(u, b2.notOne - .1, .3))));
    setPoly(trk2O, P(u, b2.notOne + .2, .9), .9); setPoly(trk2E, P(u, b2.notOne2, .9), .9);
    // mini candidate
    const ml = life(u, b2.upDown + .3, 99, { from: .4, dy: 30 });
    const conf = fio(u, b2.moreCalc, b2.notOne, .3, .3);
    tf(mini, { x: 300, y: 1335 + ml.y + bob(u, 0, 4, 2), s: ml.s, o: ml.o, r: conf * 6 * Math.sin(u * 8) });
    mMouth.setAttribute('d', u >= b2.notOne ? 'M64 116 Q85 140 106 116' : conf > .5 ? 'M70 126 Q78 118 85 126 Q92 134 100 124' : 'M70 122 Q85 130 100 122');
    mSweat.style.opacity = conf;
    pop(bulb, u, b2.notOne + .2, 99, 385, 1262, { from: .3, dy: 20, s: .6 + .03 * Math.sin(u * 6) });
    th.forEach(o => pop(o.el, u, o.a, o.b, 590, 1335, { from: .5, dy: 16 }));
    cap2(u);
  };
  sfx('page', STY + .2, .8); sfx('tick', STY + .6, .2); sfx('tick', STY + 1.6, .2);
  sfx('whoosh', STY + b2.upDown - .05, .7); sfx('swoosh', STY + b2.upDown + 2.2, .4); sfx('swoosh', STY + b2.adjacent - .4, .4);
  for (let k = 0; k < 8; k++) sfx('click', STY + b2.adjacent + .25 + (k + 1) * .42 - .2, .45);
  sfx('whoosh', STY + toGrid + .1, .6); for (let k = 0; k < 8; k++) sfx('pop', STY + toGrid + .55 + k * .14, .35);
  sfx('riser', STY + b2.notOne - .4, .5); sfx('sparkle', STY + b2.notOne + .3, .7); sfx('ding', STY + b2.notOne + .4, .5);

  // =====================================================================
  // SCENES 3 + 4 — TECHNIQUE + FIRST HIDDEN SEQUENCE (03_knowledge + 04_explanation)
  // one continuous stage so every card keeps its identity through the separation
  // =====================================================================
  const S3 = scene('s3', KN, QZ), b3 = B.know, b4 = B.expl;
  const s3svg = SE.arcLayer(S3.el);
  const ROW_O = 640, ROW_E = 1200;
  const cards3 = SEQ.concat(['?']).map((v, i) => SE.card(S3.el, v, i + 1, { kind: i === 9 ? 'q' : 'num' }));
  const sepPos = p => p % 2 ? { x: slotX((p - 1) / 2), y: ROW_O } : { x: slotX(p / 2 - 1), y: ROW_E };
  const oddOrder = [1, 3, 5, 7, 9], evenOrder = [6, 8, 10, 2, 4];
  function pos3(p, u) {
    const g = gpos(p), s = sepPos(p);
    if (p % 2) { const k = oddOrder.indexOf(p); return SE.move(u, b3.oddGroup + k * .16, .95, g, s, 70); }
    const k = evenOrder.indexOf(p); return SE.move(u, b3.evenGroup + k * .15, 1.0, g, s, -30);
  }
  const lblO = ctr(S3.el, 'ชุดที่ 1 — <span style="opacity:.85">ตำแหน่งคี่</span>', 'hp'); lblO.firstChild.style.fontSize = '36px';
  const lblE = ctr(S3.el, 'ชุดที่ 2 — <span style="opacity:.85">ตำแหน่งคู่</span>', 'hp cyan'); lblE.firstChild.style.fontSize = '36px';
  const tag3 = ctr(S3.el, 'เทคนิคสำคัญ', 'hp yel'); tag3.firstChild.style.fontSize = '30px';
  const hdr3 = ctr(S3.el, 'แยก<i class="bl" style="font-style:normal;color:#9CC0FF">ตำแหน่งคี่</i> / <em style="font-style:normal;color:#22D3EE">ตำแหน่งคู่</em>', 'cap'); hdr3.firstChild.style.fontSize = '46px';
  // preview arcs (no labels) for "find the differences of each set"
  const pvO = [0, 1, 2, 3].map(() => SE.arc(s3svg, S3.el, null, { col: '#7FA6FF' }));
  const pvE = [0, 1, 2].map(() => SE.arc(s3svg, S3.el, null, { col: '#22D3EE' }));
  // explanation arcs for the odd row (yellow = the operation)
  const exO = OD.map(d => SE.arc(s3svg, S3.el, sgn(d)));
  const summ1 = ctr(S3.el, `<div class="pnl" style="padding:44px 34px 22px;display:flex;flex-direction:column;align-items:center;gap:16px">
      <div class="row" style="gap:6px">${OD.map((d, k) => `<span class="chip s1c">${pm(sgn(d))}</span>${k < 3 ? `<span class="step">${ARR(40, '#95BFEF')}<span class="s1">${pm('+1')}</span></span>` : ''}`).join('')}</div>
      <div class="hp" style="font-size:34px;padding:8px 28px 6px">ผลต่างเพิ่มทีละ 1</div></div>`, '');
  const s1Chips = [...summ1.querySelectorAll('.s1c')], s1Steps = [...summ1.querySelectorAll('.step')], s1Pill = summ1.querySelector('.hp');
  const cap3 = captions(S3.el, [
    [b3.odd[0] - .1, b3.oddGroup + .2, '<i class="bl">ตำแหน่งคี่</i> : 1, 3, 5, 7, 9'],
    [b3.even[0] - .5, b3.evenGroup - .05, '<em>ตำแหน่งคู่</em> : 2, 4, 6, 8, 10'],
  ], 1120, 46);
  const capMid = captions(S3.el, [
    [b3.rows, b3.diffEach - .1, 'แยกได้ <em>2 อนุกรม</em> ชัดเจน'],
    [b3.diffEach, EX - KN - .05, 'หา<b>ผลต่าง</b>ของแต่ละชุด<b>แยกกัน</b>'],
    [EX - KN + b4.other, EX - KN + b4.self - .1, 'ตัวถัดไป = <b>ตำแหน่งที่ 10</b>'],
    [EX - KN + b4.self, 999, '<b>คุณหาคำตอบได้ไหม?</b>'],
  ], 925, 46);
  const capMid2 = captions(S3.el, [
    [EX - KN + b4.other2, EX - KN + b4.self - .1, 'อยู่ใน<em>ชุดที่ 2 (ตำแหน่งคู่)</em>'],
    [EX - KN + b4.self + .3, 999, 'ใช้<em>เทคนิคเดียวกัน</em>กับชุดที่ 2'],
  ], 1000, 38);
  S3.draw = t => {
    const u = t - KN, v = t - EX;               // v < 0 during scene 3
    const inEx = v >= 0;
    { const l = life(u, b3.tech, 1e9, { from: .5, dy: 20 }); tf(tag3, { x: 540, y: 392 + l.y, s: l.s, o: l.o * (1 - P(u, b3.oddGroup, .3)) }); }   // fades in place (no upward exit)
    pop(hdr3, u, b3.split - .05, 999, 540, 452, { from: .6, dy: 20 });
    // focus weights in scene 4
    const focusOdd = inEx ? P(v, 0, .5) * (1 - P(v, b4.other, .5)) : 0;
    const focusEven = inEx ? P(v, b4.other, .5) : 0;
    cards3.forEach((c, i) => {
      const p = i + 1, isOdd = p % 2 === 1;
      const pp = pos3(p, u);
      const l = life(u, .2 + i * .07, 1e9, { from: .5, dy: 30 });
      const hk = isOdd ? b3.odd[(p - 1) / 2] : b3.even[p / 2 - 1];
      const sel = P(u, hk, .3);
      let glow = Math.max(0, 1 - Math.max(0, u - hk) / 1.4) * (u >= hk ? 1 : 0);
      let s = l.s, dim = 0;
      if (!isOdd && u < b3.evenGroup && u > b3.odd[0]) dim = .55 * (1 - P(u, b3.even[0] - .3, .3)) * P(u, b3.odd[0], .3);
      if (inEx) {
        if (isOdd) { const k = (p - 1) / 2; const pl = pulse(v, b4.nums[k], .6); s *= 1 + .12 * pl; glow = Math.max(glow, pl);
          b4.pairs.forEach((a, j) => { if ((j === k || j + 1 === k) && v >= a && v < b4.plus[j] + .7) glow = Math.max(glow, .75); });
          dim = .45 * focusEven; }
        else { dim = .6 * focusOdd * (1 - focusEven); if (p === 10) { const q = focusEven; glow = Math.max(glow, q * (.55 + .45 * Math.sin(v * 5))); s *= 1 + .06 * q * Math.sin(v * 5); } else glow = Math.max(glow, .35 * focusEven); }
      }
      SE.setCard(c, { x: pp.x, y: pp.y + l.y, s: s * (pp.s ?? 1), o: l.o, odd: isOdd ? sel : 0, even: isOdd ? 0 : sel, q: p === 10 ? 1 : 0, glow, dim, badge: P(u, b3.split + .3 + i * .07, .3), badgeKind: sel > .5 ? (isOdd ? 'odd' : 'even') : '' });
      SE.setTrail(c, pp, [.04, .08, .12].map(d => pos3(p, u - d)), isOdd ? '47,107,255' : '34,211,238');
      c.el.style.zIndex = pp.p > 0 && pp.p < 1 ? 5 : 1;
    });
    pop(lblO, u, b3.oddGroup + .75, 999, 540, 527, { from: .6, dy: 20, o: 1 - .45 * focusEven });
    pop(lblE, u, b3.evenGroup + .85, 999, 540, 1086, { from: .6, dy: 20, o: 1 - .55 * focusOdd * (1 - focusEven) });
    // preview arcs (scene 3 end) — removed when the explanation starts
    const pvo = inEx ? 1 - P(v, 0, .35) : 1;
    pvO.forEach((a, k) => SE.setPairArc(a, slotX(k), slotX(k + 1), ROW_O, P(u, b3.diffEach + .3 + k * .14, .35), 0, pvo * .9));
    pvE.forEach((a, k) => SE.setPairArc(a, slotX(k), slotX(k + 1), ROW_E, P(u, b3.diffEach + .9 + k * .14, .35), 0, pvo * .9));
    // explanation arcs (odd row): drawn on "x ไป y", labelled on "เพิ่ม n"
    exO.forEach((a, k) => SE.setPairArc(a, slotX(k), slotX(k + 1), ROW_O, inEx ? P(v, b4.pairs[k] + .25, .6) : 0, inEx ? P(v, b4.plus[k], .4) : 0, inEx ? 1 - .45 * focusEven : 0));
    // summary panel "+5 → +6 → +7 → +8 · เพิ่มทีละ 1"
    const sl = inEx ? life(v, b4.summary, b4.other - .2, { from: .7, dy: 30 }) : { s: 0, o: 0, y: 0 };
    tf(summ1, { x: 540, y: 925 + sl.y, s: sl.s, o: sl.o });
    s1Chips.forEach((ch, k) => tf(ch, { s: lerp(.3, 1, E.back(P(v, b4.summary + .1 + k * .22, .35))), o: P(v, b4.summary + .1 + k * .22, .15) }));
    s1Steps.forEach((ch, k) => tf(ch, { o: P(v, b4.summary2 + k * .25, .25), x: -8 * (1 - E.out(P(v, b4.summary2 + k * .25, .3))) }));
    tf(s1Pill, { s: lerp(.4, 1, E.back(P(v, b4.summary2 + .8, .4))), o: P(v, b4.summary2 + .8, .2) });
    cap3(u); capMid(u); capMid2(u);
  };
  sfx('pop', KN + b3.tech + .05, .7); sfx('pop', KN + b3.split + .05, .8);
  for (let i = 0; i < 10; i++) sfx('click', KN + .2 + i * .07, .25);
  b3.odd.forEach(a => sfx('pop', KN + a, .7)); b3.even.forEach(a => sfx('pop', KN + a, .7));
  sfx('whoosh', KN + b3.oddGroup + .1, .8); sfx('ding', KN + b3.oddGroup + .9, .5);
  sfx('whoosh', KN + b3.evenGroup + .1, .8); sfx('ding', KN + b3.evenGroup + 1.0, .5);
  sfx('sparkle', KN + b3.rows + .1, .6); sfx('swoosh', KN + b3.diffEach + .25, .35);
  b4.nums.forEach(a => sfx('click', EX + a, .5));
  b4.pairs.forEach(a => sfx('swoosh', EX + a + .25, .3)); b4.plus.forEach(a => sfx('pop', EX + a, .9));
  sfx('riser', EX + b4.summary - .4, .4); sfx('sparkle', EX + b4.summary2 + .8, .7); sfx('ding', EX + b4.summary2 + .85, .6);
  sfx('whoosh', EX + b4.other, .5); sfx('pop', EX + b4.other2, .6); sfx('pop', EX + b4.self, .8);

  // =====================================================================
  // SCENES 5 + 6 + 7 — QUIZ, EXACT 5 s COUNTDOWN, ANSWER (05_quiz, silence, 06_answer)
  // =====================================================================
  const S5 = scene('s5', QZ, PR), b5 = B.quiz, b7 = B.ans;
  const s5svg = SE.arcLayer(S5.el);
  const qTitle = ctr(S5.el, 'เตรียมสอบนายสิบ', 'ttl'); qTitle.firstChild.style.fontSize = '60px';
  const qSubj = ctr(S5.el, 'วิชาคณิตศาสตร์', 'hp'); qSubj.firstChild.style.fontSize = '32px';
  const qCard = ctr(S5.el, `<div class="pnl" style="width:616px;height:300px"></div>`, '');
  const qText = ctr(S5.el, 'จงหาจำนวนถัดไปในอนุกรมต่อไปนี้', ''); qText.firstChild.style.cssText += ';font-weight:700;font-size:36px;color:#E6F4FF';
  const QC = { w: 100, hh: 90, fs: 50 };
  const qChips = SEQ.concat(['?']).map((v, i) => SE.card(S5.el, v, null, { ...QC, kind: i === 9 ? 'q' : 'num' }));
  const qChipPos = p => ({ x: 540 + (((p - 1) % 5) - 2) * 120, y: p <= 5 ? 648 : 752 });
  const comma = SEQ.concat(['?']).map((_, i) => i < 9 ? ctr(S5.el, ',', '', false) : null);
  const OPTX = [385, 695], OPTY = [892, 1018];
  const opts = MA.choices.map(([l, v], i) => {
    const el = ctr(S5.el, `<div class="opt39"><div class="ok"></div><div class="lt">${l}</div><div class="vv">${v}</div><div class="ck">${ICON.check('#22C55E', 50)}</div></div>`, '');
    return { el, ok: el.querySelector('.ok'), lt: el.querySelector('.lt'), ck: el.querySelector('.ck'), correct: l === MA.correctLetter, x: OPTX[i % 2], y: OPTY[Math.floor(i / 2)] };
  });
  const hint = ctr(S5.el, `<div class="pnl" style="padding:20px 30px;display:flex;flex-direction:column;gap:14px">
      <div class="hintrow"><span style="width:60px;color:#9CC0FF">คี่</span>${'<span class="sq o"></span>'.repeat(5)}</div>
      <div class="hintrow"><span style="width:60px;color:#22D3EE">คู่</span>${'<span class="sq e"></span>'.repeat(4)}<span class="sq q">?</span></div></div>`, '');
  const hintTag = ctr(S5.el, 'อย่าลืม! แยกคี่–คู่', 'hp yel'); hintTag.firstChild.style.fontSize = '30px';
  const give5 = ctr(S5.el, 'ให้เวลาคิด <b style="color:#FFD23F">5 วินาที!</b>', 'cap'); give5.firstChild.style.fontSize = '50px';
  // countdown — blue circle, cyan ring, 150 frames, numerals 5..1 × 30 frames each
  const CDS = 250, CR = CDS * .38, CC = 2 * Math.PI * CR;
  const timer = ctr(S5.el, `<div style="position:relative;width:${CDS}px;height:${CDS}px">
      <svg width="${CDS}" height="${CDS}" viewBox="0 0 ${CDS} ${CDS}" style="position:absolute;inset:0">
        <defs><radialGradient id="tg" cx=".4" cy=".35"><stop offset="0" stop-color="#3B78FF"/><stop offset="1" stop-color="#142B53"/></radialGradient></defs>
        <circle cx="${CDS / 2}" cy="${CDS / 2}" r="${CDS * .47}" fill="url(#tg)" stroke="rgba(230,244,255,.85)" stroke-width="6"/>
        <circle cx="${CDS / 2}" cy="${CDS / 2}" r="${CR}" fill="none" stroke="rgba(149,191,239,.25)" stroke-width="18"/>
        <circle class="cd-ring" cx="${CDS / 2}" cy="${CDS / 2}" r="${CR}" fill="none" stroke="#22D3EE" stroke-width="18" stroke-linecap="round" stroke-dasharray="${CC}" transform="rotate(-90 ${CDS / 2} ${CDS / 2})"/>
        <circle class="cd-dot" r="13" fill="#E6F4FF" stroke="#22D3EE" stroke-width="5"/></svg>
      <div class="cd-num" style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:124px;line-height:1;color:#fff;padding-top:10px;text-shadow:0 0 20px rgba(34,211,238,.6)"></div></div>`, '');
  const cdRing = timer.querySelector('.cd-ring'), cdDot = timer.querySelector('.cd-dot'), cdNum = timer.querySelector('.cd-num');
  const revealBan = ctr(S5.el, 'เฉลย!', 'ttl'); revealBan.firstChild.style.cssText += ';font-size:110px;color:#FFD23F';
  const confA = confetti(S5.el, 46, 385, 1018), confB = confetti(S5.el, 40, 540, 1150);
  // answer layout
  const ROW_A = 700, AS = 1.12;
  const hdrA = ctr(S5.el, 'วิธีคิด: แยกตำแหน่งคี่ / คู่', 'cap'); hdrA.firstChild.style.fontSize = '42px';
  const lblA = ctr(S5.el, 'ชุดที่ 2 — <span style="opacity:.85">ตำแหน่งคู่</span>', 'hp cyan'); lblA.firstChild.style.fontSize = '36px';
  const lblA1 = ctr(S5.el, 'ชุดที่ 1 — <span style="opacity:.85">ตำแหน่งคี่</span>', 'hp'); lblA1.firstChild.style.fontSize = '36px';
  const ansQ = SE.card(S5.el, '?', null, { ...QC, kind: 'q' });
  const oddA = ODD.map(v => SE.card(S5.el, v, null, QC));
  const exE = ED.concat([MA.nextDifference]).map((d, k) => SE.arc(s5svg, S5.el, sgn(d)));
  const exA1 = OD.map(d => SE.arc(s5svg, S5.el, sgn(d), { col: '#5B8CFF', lcls: 'bl' }));
  const summ2 = ctr(S5.el, `<div class="pnl" style="padding:44px 14px 22px;display:flex;flex-direction:column;align-items:center;gap:16px">
      <div class="row" style="gap:6px">${ED.concat([MA.nextDifference]).map((d, k) => `<span class="chip s2c">${pm(sgn(d))}</span>${k < 3 ? `<span class="step">${ARR(38, '#95BFEF')}<span class="s1">${pm('+2')}</span></span>` : ''}`).join('')}</div>
      <div class="hp cyan" style="font-size:34px;padding:8px 28px 6px">ผลต่างเพิ่มทีละ 2</div></div>`, '');
  const s2Chips = [...summ2.querySelectorAll('.s2c')], s2Steps = [...summ2.querySelectorAll('.step')], s2Pill = summ2.querySelector('.hp');
  const eq = ctr(S5.el, `<div class="eq"><span class="e1">51</span><span class="e2" style="color:#FFD23F">${pm('+')}</span><span class="e3" style="color:#FFD23F">15</span><span class="e4">=</span><span class="e5" style="color:#22C55E">66</span></div>`, '');
  const eqP = ['e1', 'e2', 'e3', 'e4', 'e5'].map(c => eq.querySelector('.' + c));
  const badgeA = ctr(S5.el, `<span style="display:grid;place-items:center;width:52px;height:52px;border-radius:50%;background:#fff">${ICON.check('#22C55E', 38)}</span>เฉลยข้อ ค. 66`, 'hp green'); badgeA.firstChild.style.fontSize = '44px';
  const memo1 = ctr(S5.el, 'อนุกรมดูสลับไปมา?', 'cap'); memo1.firstChild.style.fontSize = '50px';
  const memo2 = ctr(S5.el, 'ลองแยก<span style="color:#7FA6FF">คี่</span>–<span style="color:#22D3EE">คู่</span>!', 'ttl'); memo2.firstChild.style.cssText += ';font-size:92px;color:#FFD23F';
  // positions of the even cards during the answer: question chip → row (y ROW_A) → final two-row layout
  const ROW_A2 = 920, ROW_A1 = 600, toAll = b7.memo;
  function evenAns(k, ua) {          // k = 0..3 (positions 2,4,6,8)
    const from = { ...qChipPos(2 * k + 2), s: 1 }, row = { x: slotX(k), y: ROW_A, s: AS };
    const m = SE.move(ua, b7.toEven + .1 + k * .12, .95, from, row, 70);
    if (ua < toAll) return m;
    return SE.move(ua, toAll + .05, .9, row, { x: slotX(k), y: ROW_A2, s: AS }, 0);
  }
  const rowY = ua => ua < toAll ? ROW_A : lerp(ROW_A, ROW_A2, E.inOut(P(ua, toAll + .05, .9)));
  S5.draw = t => {
    const uq = t - QZ, ua = t - AN, uc = t - CD;
    const revealed = ua >= 0;
    const outQ = revealed ? E.in(P(ua, b7.toEven, .6)) : 0;          // quiz UI leaves when the explanation starts
    pop(qTitle, uq, -.2, 1e9, 540, 404, { from: .7, dy: 20, o: 1 - outQ });
    pop(qSubj, uq, b5.head + .2, 1e9, 540, 474, { from: .5, dy: 16, o: 1 - outQ });
    const qc = life(uq, b5.question - .2, 1e9, { from: .85, dy: 30 });
    tf(qCard, { x: 540, y: 662 + qc.y, s: qc.s, o: qc.o * (1 - outQ) });
    tf(qText, { x: 540, y: 560 + qc.y, s: qc.s, o: qc.o * (1 - outQ) });
    qChips.forEach((c, i) => {
      const p = i + 1, a = b5.nums[i];
      const l = life(uq, a, 1e9, { from: .35, dy: 24 });
      let pp = { ...qChipPos(p), s: 1 }, o = l.o, ok = 0, label, ry = 0, glow = Math.max(0, 1 - Math.max(0, uq - a) / .8) * (uq >= a ? .8 : 0), q = p === 10 ? 1 : 0;
      if (p === 10 && revealed) {                    // the "?" flips into 66 after the countdown
        const f = ua - b7.value;
        if (f >= 0 && f < .3) ry = 90 * (f / .3);
        else if (f >= .3 && f < .6) { ry = -90 * (1 - (f - .3) / .3); }
        if (f >= .3) { label = MA.next; ok = 1; q = 0; glow = .8; }
        o *= 1 - P(ua, b7.toEven, .4);
      } else if (p % 2 === 0 && revealed) {
        if (ua >= b7.toEven) pp = evenAns(p / 2 - 1, ua);
        glow = ua >= b7.toEven ? Math.max(pulse(ua, b7.nums[p / 2 - 1], .6), .3) : 0;
        const k = p / 2 - 1;
        b7.pairs.forEach((a2, j) => { if ((j === k || j + 1 === k) && ua >= a2 && ua < b7.plus[j] + .7) glow = Math.max(glow, .8); });
        if (k === 3 && ua >= b7.so && ua < b7.add15 + 1.5) glow = Math.max(glow, .8);
        pp.s *= 1 + .12 * pulse(ua, b7.nums[k], .6);
      } else if (revealed) { o *= 1 - P(ua, b7.toEven, .4); }
      const ev = p % 2 === 0 && revealed && ua >= b7.toEven ? P(ua, b7.toEven + .3, .5) : 0;
      SE.setCard(c, { x: pp.x, y: pp.y + l.y, s: l.s * pp.s, o, ry, ok, q, label, glow, even: p !== 10 ? ev : 0 });
      if (p % 2 === 0 && p !== 10 && revealed) SE.setTrail(c, pp, [.04, .08, .12].map(d => evenAns(p / 2 - 1, ua - d)), '34,211,238');
      c.el.style.zIndex = 3;
    });
    comma.forEach((el, i) => { if (!el) return; const p = i + 1; if (p === 5) { tf(el, { o: 0 }); return; } const a = qChipPos(p); tf(el, { x: a.x + 60, y: a.y + 22, o: P(uq, b5.nums[i] + .2, .2) * (1 - (revealed ? P(ua, b7.toEven, .3) : 0)) }); el.firstChild.style.cssText = 'font-weight:800;font-size:40px;color:#95BFEF'; });
    // options: neutral until the countdown has finished
    opts.forEach((o, i) => {
      const l = life(uq, b5.opts[i], 1e9, { from: .4, dy: 0 });
      const x = o.x;
      let s = l.s, op = l.o;
      if (revealed && o.correct) {
        const r = P(ua, b7.letter, .3);
        o.ok.style.opacity = r; tf(o.ck, { s: lerp(0, 1, E.elastic(P(ua, b7.letter + .1, .8))), o: P(ua, b7.letter + .05, .1) });
        o.lt.style.background = r > .5 ? 'radial-gradient(circle at 35% 30%,#9CF2C6,#15964A 75%)' : '';
        s *= 1 + .08 * E.back(P(ua, b7.letter, .45)) - .08 * P(ua, b7.letter + .45, .4);
        o.el.firstChild.firstChild.style.boxShadow = r > .5 ? `0 10px 0 #0E6B35,0 0 0 4px #E6F4FF,0 0 ${40 + 14 * Math.sin(ua * 3)}px 10px rgba(34,197,94,.55)` : '';
      } else {
        o.ok.style.opacity = 0; tf(o.ck, { o: 0 }); o.lt.style.background = ''; o.el.firstChild.firstChild.style.boxShadow = '';
        if (revealed) { const dm = .55 * P(ua, b7.letter, .4); op *= 1 - dm; o.el.style.filter = `grayscale(${dm * 1.4})`; } else o.el.style.filter = '';
      }
      tf(o.el, { x, y: OPTY[Math.floor(i / 2)], s: s * (1 - .3 * outQ), o: op * (1 - outQ) });
    });
    // hint + countdown cue
    const hl = life(uq, b5.hint, b5.give5 - .1, { from: .6, dy: 24 });
    tf(hint, { x: 540, y: 1215 + hl.y, s: hl.s, o: hl.o });
    pop(hintTag, uq, b5.hint + .3, b5.give5 - .1, 540, 1127, { from: .5, dy: 12 });
    pop(give5, uq, b5.give5, CD - QZ - .28, 540, 1262, { from: .6, dy: 20, out: .2 });
    // exact countdown: integer frame index from the frame-aligned countdown start
    const fi = Math.round(t * TL.fps) - Math.round(CD * TL.fps);
    const cdOn = fi >= 0 && fi < 150;
    // visible from exactly the first countdown frame (no fade-in eating into the first numeral), fades after frame 150
    const beat = cdOn ? Math.max(0, 1 - (fi % 30) / 8) : 0;
    const tS = fi < 0 ? 0 : lerp(.72, 1, E.back(clamp(fi / 9))), tO = fi < 0 ? 0 : 1 - clamp((fi - 150) / 6);
    tf(timer, { x: 540, y: 1262, s: tS * (1 + .05 * beat), o: tO });
    if (cdOn) {
      cdNum.textContent = 5 - Math.floor(fi / 30);
      cdNum.style.transform = `scale(${lerp(1.35, 1, E.back(clamp((fi % 30) / 10)))})`;
      const prog = clamp(fi / 150 + (t * TL.fps - Math.round(t * TL.fps)) / 150);
      cdRing.setAttribute('stroke-dashoffset', CC * prog);
      const ang = -Math.PI / 2 + (1 - prog) * 2 * Math.PI;
      cdDot.setAttribute('cx', CDS / 2 + CR * Math.cos(ang)); cdDot.setAttribute('cy', CDS / 2 + CR * Math.sin(ang));
    } else if (fi < 0) { cdNum.textContent = 5; cdRing.setAttribute('stroke-dashoffset', 0); cdDot.setAttribute('cx', CDS / 2); cdDot.setAttribute('cy', CDS / 2 - CR); }
    else { cdNum.textContent = ''; cdRing.setAttribute('stroke-dashoffset', CC); }
    // ---- answer ----
    pop(revealBan, ua, b7.reveal, b7.toEven - .2, 540, 1262, { from: .3, dy: 0, d: .45 });
    drawConf(confA, t, AN + b7.letter + .1); drawConf(confB, t, AN + b7.result + .1);
    pop(hdrA, ua, b7.toEven + .3, toAll - .2, 540, 430, { from: .6, dy: 20 });
    const lA = life(ua, b7.evenIs, 1e9, { from: .6, dy: 20 });
    tf(lblA, { x: 540, y: lerp(585, 805, E.inOut(P(ua, toAll + .05, .9))) + lA.y, s: lA.s, o: lA.o });
    // the "?" card of the even row → flips into 66 on "เท่ากับ หกสิบหก"
    const ql = life(ua, b7.toEven + .7, 1e9, { from: .4, dy: 20 });
    const fq = ua - b7.result; let qry = 0;
    if (fq >= 0 && fq < .25) qry = 90 * fq / .25; else if (fq >= .25 && fq < .5) qry = -90 * (1 - (fq - .25) / .25);
    const qpost = fq >= .25;
    SE.setCard(ansQ, { x: slotX(4), y: rowY(ua) + ql.y, s: ql.s * AS * (1 + .05 * Math.sin(ua * 5) * (qpost ? 0 : 1)), o: ql.o, ry: qry, q: qpost ? 0 : 1, ok: qpost ? 1 : 0, label: qpost ? MA.next : '?', glow: qpost ? .9 : (ua > b7.so ? .6 + .3 * Math.sin(ua * 6) : .3) });
    // even-row arcs: +9 +11 +13 then +15
    const evO = 1;
    exE.forEach((a, k) => {
      const drawAt = k < 3 ? b7.pairs[k] + .25 : b7.so + .2, labAt = k < 3 ? b7.plus[k] : b7.add15;
      const col = ua >= toAll ? '#22D3EE' : '#FFD23F';
      a.line.setAttribute('stroke', col); a.glow.setAttribute('stroke', col); a.head.setAttribute('fill', col);
      if (a.lab) a.lab.firstChild.className = 'in ess' + (ua >= toAll ? ' cy' : '');
      SE.setPairArc(a, slotX(k), slotX(k + 1), rowY(ua), P(ua, drawAt, .6), P(ua, labAt, .4), evO, { hh: QC.hh * AS });
    });
    // summary "+9 → +11 → +13 → +15 · เพิ่มทีละ 2"
    const sl2 = life(ua, b7.byTwo, b7.calc - .2, { from: .7, dy: 30 });
    tf(summ2, { x: 540, y: 955 + sl2.y, s: sl2.s, o: sl2.o });
    s2Chips.forEach((ch, k) => { const a = k < 3 ? b7.byTwo + .1 + k * .22 : b7.byTwo2 + .9; tf(ch, { s: lerp(.3, 1, E.back(P(ua, a, .35))), o: P(ua, a, .15) }); });
    s2Steps.forEach((ch, k) => tf(ch, { o: P(ua, b7.byTwo2 + k * .25, .25) }));
    tf(s2Pill, { s: lerp(.4, 1, E.back(P(ua, b7.byTwo2 + .2, .4))), o: P(ua, b7.byTwo2 + .2, .2) });
    // 51 + 15 = 66
    const el = life(ua, b7.calc, toAll - .15, { from: .7, dy: 30 });
    tf(eq, { x: 540, y: 1105 + el.y, s: el.s, o: el.o });
    const ea = [b7.calc, b7.calc + .45, b7.calc + .75, b7.equals, b7.result];
    eqP.forEach((sp, k) => tf(sp, { s: lerp(.3, 1, E.back(P(ua, ea[k], .35))) * (k === 4 ? 1 + .1 * pulse(ua, b7.result + .3, .6) : 1), o: P(ua, ea[k], .12) }));
    pop(badgeA, ua, b7.result + .6, toAll - .15, 540, 1262, { from: .4, dy: 20 });
    // complete explanation: odd row returns above the even row
    pop(lblA1, ua, toAll + .3, 1e9, 540, 490, { from: .6, dy: 20 });
    oddA.forEach((c, k) => {
      const a = toAll + .35 + k * .1;
      const m = SE.move(ua, a, .8, { x: slotX(k), y: 470, s: AS * .6 }, { x: slotX(k), y: ROW_A1, s: AS }, 0);
      SE.setCard(c, { x: m.x, y: m.y, s: m.s, o: P(ua, a + .2, .3), odd: 1, glow: Math.max(.3, pulse(ua, a + .8, .5)) });
    });
    exA1.forEach((a, k) => SE.setPairArc(a, slotX(k), slotX(k + 1), ROW_A1, P(ua, toAll + 1.2 + k * .18, .4), P(ua, toAll + 1.4 + k * .18, .35), 1, { hh: QC.hh * AS }));
    const m1 = life(ua, b7.memo + .5, 1e9, { from: .6, dy: 24 });
    tf(memo1, { x: 540, y: 1165 + m1.y, s: m1.s, o: m1.o });
    const m2 = life(ua, b7.memo3, 1e9, { from: .3, dy: 20 });
    tf(memo2, { x: 540, y: 1300 + m2.y, s: m2.s * (1 + .03 * Math.sin(ua * 3) + .06 * pulse(ua, b7.outro, .8)), o: m2.o });
  };
  sfx('whoosh', QZ + .05, .5); sfx('pop', QZ + b5.question, .8);
  b5.nums.forEach(a => sfx('pop', QZ + a, .55));
  b5.opts.forEach(a => sfx('pop', QZ + a, .9)); sfx('pop', QZ + b5.hint, .6); sfx('pop', QZ + b5.give5, .7);
  for (let k = 0; k < 5; k++) sfx(k === 4 ? 'tick2' : 'tick', CD + k, 1);
  sfx('stamp', AN + b7.reveal + .05, .6); sfx('success', AN + b7.letter + .05, 1); sfx('ding', AN + b7.letter + .1, .7); sfx('sparkle', AN + b7.letter + .3, .6);
  sfx('whoosh', AN + b7.value, .5); sfx('pop', AN + b7.value + .3, .8);
  sfx('whoosh', AN + b7.toEven + .1, .7); sfx('pop', AN + b7.evenIs, .6); b7.nums.forEach(a => sfx('click', AN + a, .5));
  b7.pairs.forEach(a => sfx('swoosh', AN + a + .25, .3)); b7.plus.forEach(a => sfx('pop', AN + a, .9));
  sfx('riser', AN + b7.byTwo - .4, .4); sfx('sparkle', AN + b7.byTwo2 + .2, .7); sfx('ding', AN + b7.byTwo2 + .9, .6);
  sfx('swoosh', AN + b7.so + .2, .4); sfx('pop', AN + b7.add15, 1);
  sfx('pop', AN + b7.calc, .8); sfx('pop', AN + b7.calc + .75, .8); sfx('whoosh', AN + b7.result - .05, .4); sfx('success', AN + b7.result + .1, 1); sfx('sparkle', AN + b7.result + .3, .8); sfx('ding', AN + b7.result + .6, .5);
  sfx('whoosh', AN + toAll + .1, .6); for (let k = 0; k < 4; k++) sfx('pop', AN + toAll + 1.4 + k * .18, .4);
  sfx('pop', AN + b7.memo + .5, .7); sfx('stamp', AN + b7.memo3 + .05, .7); sfx('sparkle', AN + b7.memo3 + .2, .6);

  // =====================================================================
  // SCENE 8 — NAISIBPRO ENDING (07_promotion.mp3)
  // =====================================================================
  const S8 = scene('s8', PR, 1e9), b8 = B.promo;
  const pT1 = ctr(S8.el, 'คุณตอบถูกไหม?', 'ttl'); pT1.firstChild.style.fontSize = '72px';
  const pT2 = ctr(S8.el, 'คุณใช้<span style="color:#22D3EE">เทคนิคอะไร?</span>', 'ttl'); pT2.firstChild.style.fontSize = '68px';
  const AV = c => `<span class="av" style="background:${c}"><svg width="40" height="40" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4.5" fill="#fff"/><path d="M3.5 21c1-4.5 4.5-6.5 8.5-6.5s7.5 2 8.5 6.5z" fill="#fff"/></svg></span>`;
  const bubs = [['#2F6BFF', `ตอบ ค. 66 ${ICON.check('#22C55E', 34)}`], ['#22D3EE', 'แยกคี่–คู่ เห็นเลย!'], ['#5B8CFF', 'ผลต่างเพิ่มทีละ 2']]
    .map(([c, tx]) => ctr(S8.el, `<div class="bub">${AV(c)}<span style="display:flex;align-items:center;gap:8px">${tx}</span></div>`, ''));
  const cBar = ctr(S8.el, `<div style="display:flex;align-items:center;gap:16px;width:600px;height:86px;padding:0 14px 0 30px;border-radius:44px;background:rgba(230,244,255,.12);box-shadow:0 0 0 3px rgba(149,191,239,.5);font-weight:600;font-size:34px;color:#95BFEF"><span style="flex:1">เขียนคอมเมนต์…</span><span style="width:62px;height:62px;border-radius:50%;background:#2F6BFF;display:grid;place-items:center"><svg width="30" height="30" viewBox="0 0 24 24"><path d="M3 11l18-8-8 18-2-7z" fill="#fff"/></svg></span></div>`, '');
  const tech = [['แยกตำแหน่งคี่–คู่', true], ['หาผลต่างตัวติดกัน', false]].map(([tx, good]) => ctr(S8.el, `<div class="bub" style="${good ? 'background:#2F6BFF;color:#fff' : ''}"><span class="av" style="background:${good ? '#fff' : '#95BFEF'}">${good ? ICON.check('#2F6BFF', 38) : '<b style="font-size:40px;color:#142B53">?</b>'}</span>${tx}</div>`, ''));
  const logo = ctr(S8.el, `<img src="${NSP.BASE}brand/logo.png" style="width:400px;display:block;filter:drop-shadow(0 18px 30px rgba(0,0,0,.45))">`, '');
  const ring = ctr(S8.el, `<div style="width:520px;height:520px;border-radius:50%;background:radial-gradient(circle,rgba(34,211,238,.35) 0%,rgba(47,107,255,.15) 45%,rgba(47,107,255,0) 70%)"></div>`, '', false);
  const wm = ctr(S8.el, 'NaiSibPro', 'wm'); wm.firstChild.style.fontSize = '104px';
  const wmTh = ctr(S8.el, 'นายสิบโปร', 'ttl'); wmTh.firstChild.style.fontSize = '56px';
  const t1 = ctr(S8.el, `<div class="pnl" style="display:flex;align-items:center;gap:22px;padding:22px 30px;width:596px">${ICON.book(84, '#22D3EE')}<div style="line-height:1.25"><div style="font-weight:600;font-size:30px;color:#95BFEF">รวมข้อสอบ</div><div style="font-weight:800;font-size:50px;color:#fff">มากกว่า <span style="color:#FFD23F">10,000</span> ข้อ</div></div></div>`, '');
  const t2 = ctr(S8.el, `<div class="pnl" style="display:flex;align-items:center;gap:22px;padding:22px 30px;width:596px">${ICON.cal(84, '#22D3EE')}<div style="font-weight:800;font-size:50px;color:#fff">อัปเดต<span style="color:#22D3EE">ทุกสัปดาห์</span></div></div>`, '');
  const BTN = [['ไลก์', '<path d="M7 10v11H3V10zM9 21h8.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 19 10h-5l.8-4.2A2 2 0 0 0 12.8 3.4L9 10z" fill="#fff"/>'],
    ['แชร์', '<path d="M14 4l8 7-8 7v-4c-6 0-9 2-11 6 1-6 4-10 11-11z" fill="#fff"/>'],
    ['ติดตาม', '<circle cx="9" cy="8" r="4" fill="#fff"/><path d="M1.5 20c.8-4 3.8-6 7.5-6s6.7 2 7.5 6z" fill="#fff"/><path d="M19 7v8M15 11h8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/>']]
    .map(([lb, ic]) => ctr(S8.el, `<div class="cbtn"><div class="cc"><svg width="64" height="64" viewBox="0 0 24 24">${ic}</svg></div>${lb}</div>`, ''));
  const hand = ctr(S8.el, ICON.hand(110), '', false);
  const BX = [340, 540, 740];
  S8.draw = t => {
    const u = t - PR;
    pop(pT1, u, -.3, b8.how - .15, 540, 430, { from: .6, dy: 20 });
    bubs.forEach((el, k) => { const a = .35 + k * .55 + (k === 2 ? .5 : 0); const l = life(u, a, b8.how - .15, { from: .7, dy: 0 }); const off = (1 - E.out(P(u, a, .5))) * (k % 2 ? 500 : -500); tf(el, { x: 540 + off, y: 600 + k * 135 + bob(u, k, 4, 2), s: l.s, o: l.o * clamp(1 - Math.abs(off) / 30) }); });
    pop(cBar, u, b8.comment, b8.how - .15, 540, 1080, { from: .7, dy: 20 });
    pop(pT2, u, b8.how, b8.brand - .15, 540, 470, { from: .6, dy: 20 });
    tech.forEach((el, k) => pop(el, u, b8.how + .4 + k * .4, b8.brand - .15, 540, 680 + k * 150, { from: .6, dy: 20 }));
    // brand reveal → shrinks up for the promotional message
    const shr = E.inOut(P(u, b8.bank - .2, .7));
    const ll = life(u, b8.brand, 1e9, { from: .3, dy: 0, d: .7 });
    tf(logo, { x: 540, y: lerp(720, 545, shr), s: ll.s * lerp(1, .62, shr) * (1 + .015 * Math.sin(u * 2.5)), o: ll.o, r: (1 - E.out(P(u, b8.brand, .7))) * -12 });
    tf(ring, { x: 540, y: lerp(720, 545, shr), s: ll.s * lerp(1.05, .7, shr) * (1 + .05 * Math.sin(u * 3)), o: ll.o * .9 });
    const wl = life(u, b8.brand + .45, 1e9, { from: .5, dy: 30 });
    tf(wm, { x: 540, y: lerp(1015, 755, shr) + wl.y, s: wl.s * lerp(1, .62, shr), o: wl.o });
    const wt = life(u, b8.brand + .8, b8.bank - .2, { from: .5, dy: 20 });
    tf(wmTh, { x: 540, y: 1112 + wt.y, s: wt.s, o: wt.o });
    pop(t1, u, b8.bank, 1e9, 540, 900, { from: .6, dy: 30 });
    pop(t2, u, b8.weekly, 1e9, 540, 1060, { from: .6, dy: 30 });
    const BA = [b8.like, b8.share, b8.follow];
    BTN.forEach((el, k) => { const l = life(u, BA[k], 1e9, { from: .3, dy: 30 }); const pr = pulse(u, BA[k] + .35, .3); tf(el, { x: BX[k], y: 1270 + l.y, s: l.s * (1 - .1 * pr) * (1 + .03 * Math.sin(u * 4 + k)), o: l.o });
      el.querySelector('.cc').style.background = u > BA[k] + .4 ? 'linear-gradient(180deg,#22D3EE,#13AECB)' : ''; });
    // tapping hand visits like → share → follow
    const hk = [[b8.like + .1, 0], [b8.share + .1, 1], [b8.follow + .1, 2]];
    let hx = BX[0], hy = 1330; hk.forEach(([a, k], j) => { if (u >= a - .3) { const pr = j ? E.inOut(P(u, a - .3, .3)) : 1; hx = lerp(j ? BX[k - 1] : BX[0], BX[k], pr); } });
    const hp = life(u, b8.like - .1, b8.last + 1.2, { from: .5, dy: 30 });
    const tap = Math.max(...hk.map(([a]) => pulse(u, a + .2, .3)));
    tf(hand, { x: hx + 40, y: hy + 40 - 18 * tap + hp.y, s: hp.s * (1 - .08 * tap), o: hp.o, r: -12 });
  };
  sfx('msg', PR + .35, .8); sfx('msg', PR + .9, .8); sfx('msg', PR + 1.95, .8); sfx('click', PR + b8.comment + .2, .4);
  sfx('swoosh', PR + b8.how, .4); sfx('pop', PR + b8.how + .4, .6); sfx('pop', PR + b8.how + .8, .6);
  sfx('riser', PR + b8.brand - .6, .5); sfx('success', PR + b8.brand + .1, .8); sfx('sparkle', PR + b8.brand + .4, .8);
  sfx('pop', PR + b8.bank, .8); sfx('pop', PR + b8.weekly, .8);
  [b8.like, b8.share, b8.follow].forEach(a => { sfx('pop', PR + a, .7); sfx('click', PR + a + .35, .7); });
  mark('endcard', PR + b8.last);

  // auto-fit: any essential text wider than the safe zone allows is scaled down once (after fonts load)
  function fitAll() {
    scenes.forEach(sc => {
      sc.el.style.display = 'block';
      sc.el.querySelectorAll('.ctr > .in.ess').forEach(inn => {
        const w = inn.offsetWidth, max = 596;
        if (w > max) { const fs = parseFloat(getComputedStyle(inn).fontSize); inn.style.fontSize = (fs * max / w).toFixed(1) + 'px'; }
      });
      sc.el.style.display = 'none';
    });
  }
  NSP.start({ scenes, wipes: [STY, KN, QZ, PR], brand: { showAt: .5, hideAt: PR - .1 }, ep: 'EP.39 คณิตศาสตร์' });
  window.ready = window.ready.then(() => { fitAll(); window.renderAt(0); return true; });
})();
