// EP47 scene timeline. Every beat is keyed to phrase starts measured from the narration (beats.js)
// and to segment starts from the audio-first timeline (timeline.js). renderAt(t) is deterministic.
(function () {
  const { $, clamp, lerp, E, P, tf, life, bob, h, sfx, mark } = NSP;
  const T = window.TL, B = window.BEATS, CTD = window.CT, ICO = ENV.ICO, frac = ENV.frac;
  const FPS = T.fps, S = k => T[k][0], D = k => T[k][1];
  const H0 = S('hook'), ST0 = S('story'), KN0 = S('know'), EX0 = S('expl'), QS = S('quiz'), CD = S('cd'), AN = S('ans'), PR = S('promo'), END = T.end;
  const CDF = Math.round(CD * FPS), CDN = Math.round(T.cd[1] * FPS);   // countdown start frame, frame count (150)
  const FULL = { x: 0, y: 0, w: 1080, h: 1920 };
  const TYPES = CTD.types, Q = CTD.quiz;

  // ---------------------------------------------------------------- helpers
  const add = (parent, html) => { const e = h(html); parent.appendChild(e); return e; };
  const row = (parent, top, inner, { cls = '', fit = 0, left = 220, width = 640 } = {}) => add(parent, `<div class="row crit ${cls}" style="top:${top}px;left:${left}px;width:${width}px"${fit ? ` data-fit-row="${fit}"` : ''}>${inner}</div>`);
  const hide = (...els) => els.forEach(e => tf(e, { o: 0 }));
  const win = (u, a, b, fi = .35, fo = .35) => clamp((u - a) / fi) * (1 - clamp((u - b) / fo));
  const pop = (el, u, a, b = 1e9, o = {}) => tf(el, life(u, a, b, { from: .5, dy: 40, d: .5, out: .3, ...o }));
  const lerpR = (a, b, k) => ({ x: lerp(a.x, b.x, k), y: lerp(a.y, b.y, k), w: lerp(a.w, b.w, k), h: lerp(a.h, b.h, k) });
  function camAt(u, keys, drift = .006) {
    let i = 0; while (i < keys.length - 1 && keys[i + 1][0] <= u) i++;
    const k = keys[i], pv = keys[Math.max(0, i - 1)];
    const e = k[4] > 0 && i > 0 ? E.inOut(P(u, k[0], k[4])) : 1;
    return { cx: lerp(pv[1], k[1], e), cy: lerp(pv[2], k[2], e), z: lerp(pv[3], k[3], e) * (1 + drift * clamp(u - k[0], 0, 8)) };
  }
  const ARR = (s = 34, c = 'currentColor') => ICO.arrow(s, c);
  // label card: number badge, English name, Thai name, sub line
  function labelCard(parent, { n, en, th, sub, top = 1140, enSize = 62 }) {
    const el = add(parent, `<div class="lbl crit c" style="top:${top}px">${n ? `<div class="nb">${n}</div>` : ''}<div class="en" data-fit="${n ? 540 : 592}" style="font-size:${enSize}px">${en}</div>${th ? `<div class="th" data-fit="592">${th}</div>` : ''}${sub ? `<div class="sub" data-fit="592">${sub}</div>` : ''}</div>`);
    return { el, sub: el.querySelector('.sub'), th: el.querySelector('.th') };
  }
  const header = (parent, txt, num, cls = '') => row(parent, 362, `<div class="pill hp ${num == null ? 'np' : ''} ${cls}" data-fit="640">${num != null ? `<div class="num">${num}</div>` : ''}${txt}</div>`);
  const drawHeader = (el, u, a, b) => { const l = life(u, a, b, { from: .4, dy: -30, d: .5, out: .3 }); tf(el, { ...l, y: l.y + bob(u, 0, 3) }); };

  // ---------------------------------------------------------------- theme: blue background blobs + tech layer
  [...document.querySelectorAll('#bg .blob')].forEach((el, i) => { el.style.background = `radial-gradient(circle, ${['rgba(47,107,255,.35)', 'rgba(34,211,238,.18)', 'rgba(47,107,255,.28)', 'rgba(149,191,239,.2)'][i]} 0%, rgba(20,43,83,0) 68%)`; });
  const sg = $('sg');
  const rndG = ENV.mkRnd(101);
  const traces = [...Array(16)].map(() => { let x = Math.round(rndG() * 20) * 54, y = Math.round(rndG() * 36) * 54; const pts = [[x, y]]; for (let k = 0; k < 5; k++) { if (k % 2) y += (rndG() < .5 ? -1 : 1) * (2 + Math.floor(rndG() * 5)) * 54; else x += (rndG() < .5 ? -1 : 1) * (2 + Math.floor(rndG() * 5)) * 54; pts.push([x, y]); } return pts; });
  add(sg, `<svg width="1080" height="1920" style="position:absolute;inset:0"><g fill="none" stroke="#1D3B70" stroke-width="3" opacity=".9">${traces.map(p => `<path d="M${p.map(q => q.join(' ')).join(' L')}"/>`).join('')}</g>
    <g fill="#24508F">${traces.map(p => `<circle cx="${p[0][0]}" cy="${p[0][1]}" r="7"/><circle cx="${p[p.length - 1][0]}" cy="${p[p.length - 1][1]}" r="7"/>`).join('')}</g><g class="tp"></g><g class="bits"></g>
    <defs><linearGradient id="flg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22D3EE" stop-opacity="0"/><stop offset=".25" stop-color="#22D3EE" stop-opacity=".5"/><stop offset="1" stop-color="#2F6BFF" stop-opacity=".8"/></linearGradient>
    <radialGradient id="fhg" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#22D3EE" stop-opacity=".35"/><stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></radialGradient></defs>
    <ellipse cx="540" cy="1480" rx="620" ry="70" fill="url(#fhg)"/>
    <g stroke="url(#flg)" stroke-width="2.5" fill="none" opacity=".65">${[...Array(23)].map((_, i) => `<path d="M540 1480 L${540 + (i - 11) * 190} 1980"/>`).join('')}</g>
    <g class="fl" stroke="#22D3EE" fill="none">${[...Array(9)].map(() => `<path d=""/>`).join('')}</g></svg>`);
  const tpG = sg.querySelector('.tp'), bitsG = sg.querySelector('.bits'), flLines = [...sg.querySelectorAll('.fl path')];
  const tPulse = traces.map(p => { const segs = []; let L = 0; for (let i = 1; i < p.length; i++) { const l = Math.hypot(p[i][0] - p[i - 1][0], p[i][1] - p[i - 1][1]); segs.push([p[i - 1], p[i], L, l]); L += l; } const c = h(`<svg><circle r="6" fill="#22D3EE"/></svg>`).firstChild; tpG.appendChild(c); return { segs, L, c, ph: rndG() }; });
  const bits = [...Array(26)].map(() => { const s = 8 + rndG() * 14; const r = h(`<svg><rect width="${s}" height="${s}" rx="3" fill="${rndG() < .5 ? '#2F6BFF' : '#22D3EE'}"/></svg>`).firstChild; bitsG.appendChild(r); return { r, x: rndG() * 1080, y: rndG() * 1920, sp: 14 + rndG() * 30, ph: rndG() * 6 }; });
  function drawGlobal(t) {
    tPulse.forEach(p => { const d = frac(t * .12 + p.ph) * p.L; const s = p.segs.find(q => d >= q[2] && d <= q[2] + q[3]) || p.segs[0]; const k = (d - s[2]) / s[3]; p.c.setAttribute('cx', lerp(s[0][0], s[1][0], k)); p.c.setAttribute('cy', lerp(s[0][1], s[1][1], k)); p.c.setAttribute('opacity', .8 * Math.sin(frac(t * .12 + p.ph) * Math.PI)); });
    flLines.forEach((l, i) => { const k = frac(i / flLines.length + t * .12), y = 1480 + k * k * 460; l.setAttribute('d', `M-200 ${y} H1280`); l.setAttribute('stroke-width', 1 + 3 * k); l.setAttribute('opacity', .1 + .38 * k); });
    bits.forEach(b => { let y = (b.y - t * b.sp) % 1980; if (y < -40) y += 1980; b.r.setAttribute('x', b.x + Math.sin(t * .6 + b.ph) * 20); b.r.setAttribute('y', y); b.r.setAttribute('opacity', .18 + .22 * Math.sin(t * 1.3 + b.ph)); });
  }

  // ======================================================================
  // SCENE 1 — HOOK (01_hook.mp3)
  // ======================================================================
  const s1 = $('s1'), HB = B.hook;
  const v1 = { off: ENV.view(s1, 'office'), bank: ENV.view(s1, 'bank'), hpc: ENV.view(s1, 'hpc'), st: ENV.view(s1, 'studio') };
  const h1scrimB = add(s1, `<div class="scrimB"></div>`), h1scrimT = add(s1, `<div class="scrimT"></div>`);
  const h1div = add(s1, `<div class="abs" style="left:535px;top:-40px;width:10px;height:2000px;background:linear-gradient(180deg,#E6F4FF,#22D3EE);box-shadow:0 0 24px #22D3EE;transform-origin:50% 50%"></div>`);
  // frame-zero title (visible at 00:00.000)
  const h1prep = row(s1, 366, `<div class="pill hp np" style="font-size:46px;padding:14px 40px">เตรียมสอบนายสิบ</div>`);
  const h1card = add(s1, `<div class="ice crit c" style="position:absolute;left:220px;top:470px;width:640px;height:290px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;overflow:hidden">
    <div class="h1sweep" style="position:absolute;top:-20px;bottom:-20px;width:120px;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.9),rgba(255,255,255,0));transform:skewX(-18deg)"></div>
    <div style="font-weight:800;font-size:60px;line-height:1.2;position:relative" data-fit="600">คอมพิวเตอร์ <span style="color:#2F6BFF">5</span> ประเภท</div>
    <div style="font-weight:800;font-size:86px;line-height:1.2;color:#2F6BFF;position:relative" data-fit="600">ต่างกันอย่างไร?</div></div>`);
  const BPOS = [[300, 880], [540, 880], [780, 880], [420, 1060], [660, 1060]];
  const h1badges = TYPES.map((tp, i) => add(s1, `<div class="badge c" style="left:${BPOS[i][0] - 75}px;top:${BPOS[i][1] - 75}px"><div class="sh"></div>${ICO[tp.key](100)}</div>`));
  const h1subj = row(s1, 1210, `<div class="chip y" style="font-size:40px;padding:12px 34px">วิชาคอมพิวเตอร์</div>`);
  // beat labels
  const h1daily = row(s1, 1250, `<div class="chip d" style="font-size:36px">${ICO.micro(48)}คอมพิวเตอร์ที่เราใช้ทุกวัน</div>`);
  const h1bank = row(s1, 1250, `<div class="chip d" style="font-size:34px">${ICO.bank(44, '#22D3EE')}ธนาคาร</div>`, { left: 220, width: 300 });
  const h1lab = row(s1, 1250, `<div class="chip d" style="font-size:34px">${ICO.atom(44)}ศูนย์วิจัย</div>`, { left: 560, width: 300 });
  const h1diff = row(s1, 366, `<div class="pill hp cy np" style="font-size:46px">ต่างกันอย่างไร?</div>`);
  const h1m3d = row(s1, 1250, `<div class="chip d" style="font-size:36px">${ICO.cube(46, '#22D3EE')}ทำโมเดลสามมิติ</div>`);
  const h1txn = row(s1, 1250, `<div class="chip d" style="font-size:36px">${ICO.bank(46, '#22D3EE')}จัดการธุรกรรมมหาศาล</div>`);
  const h1wx = row(s1, 1250, `<div class="chip d" style="font-size:36px">${ICO.storm(46, '#22D3EE')}พยากรณ์อากาศ</div>`);
  const h1why = row(s1, 366, `<div class="pill hp np" style="font-size:40px">ทำไมใช้คนละเครื่อง?</div>`);
  // title reveal
  const TITLE = ['5 TYPES OF', 'COMPUTERS'];
  const h1t = TITLE.map((ln, i) => row(s1, 430 + i * 112, `<div class="big" style="font-size:${i ? 100 : 92}px;line-height:1;letter-spacing:2px;white-space:nowrap">${[...ln].map(ch => `<span class="lt" style="display:inline-block;${ch === '5' ? 'color:#22D3EE' : ''}">${ch === ' ' ? '&nbsp;' : ch}</span>`).join('')}</div>`));
  const h1tLetters = h1t.map(r => [...r.querySelectorAll('.lt')]);
  const h1tTh = row(s1, 670, `<div class="chip b" style="font-size:40px;padding:10px 34px">คอมพิวเตอร์ 5 ประเภท</div>`);
  const h1icons = TYPES.map((tp, i) => add(s1, `<div class="badge c" style="width:112px;height:112px;left:${220 + i * 132}px;top:800px"><div class="sh"></div>${ICO[tp.key](76)}</div>`));
  const h1choose = row(s1, 975, `<div class="chip y" style="font-size:34px">แต่ละประเภท เหมาะกับงานแบบไหน?</div>`, { fit: 640 });
  const JOBS = ['doc', 'cube', 'users', 'bank', 'storm'];
  const h1jobs = JOBS.map((k, i) => add(s1, `<div class="c" style="position:absolute;left:${236 + i * 132}px;top:1090px;width:80px;height:80px;border-radius:22px;background:#E6F4FF;display:grid;place-items:center;box-shadow:0 8px 18px rgba(0,0,0,.3)">${ICO[k](56)}</div>`));
  const h1q = JOBS.map((k, i) => add(s1, `<div class="c" style="position:absolute;left:${252 + i * 132}px;top:1190px;width:48px;height:48px;border-radius:50%;background:#2F6BFF;color:#fff;font-weight:800;font-size:30px;display:grid;place-items:center;box-shadow:0 0 0 3px #22D3EE">?</div>`));
  const h1flash = add(s1, `<div class="flash"></div>`);
  // SFX (hook)
  sfx('pop', H0 + HB.subj, .8); sfx('whoosh', H0 + HB.daily - .2, .6); for (let i = 0; i < 6; i++) sfx('key', H0 + HB.daily + .5 + i * .14, .5);
  sfx('swoosh', H0 + HB.bankLab - .15, .6); sfx('data', H0 + HB.bankLab + .5, .6); sfx('pop', H0 + HB.diff, .9);
  sfx('whoosh', H0 + HB.model3d - .15, .6); sfx('scan', H0 + HB.model3d + .3, .6);
  sfx('whoosh', H0 + HB.some2 - .15, .6); for (let i = 0; i < 5; i++) sfx('confirm', H0 + HB.txn + .2 + i * .22, .5);
  sfx('whoosh', H0 + HB.some3 - .15, .6); sfx('pulse', H0 + HB.weather, .7);
  sfx('riser', H0 + HB.title - .8, .7); sfx('stamp', H0 + HB.title + .1, .8); TYPES.forEach((_, i) => sfx('pop', H0 + HB.title + 1.0 + i * .15, .5)); sfx('sparkle', H0 + HB.see, .6); sfx('pop', H0 + HB.choose, .6);
  function drawS1(t) {
    const u = t - H0;
    // frame-zero title group: fully visible at u = 0, leaves at "daily"
    const tOut = E.in(P(u, HB.daily - .25, .4));
    tf(h1prep, { o: 1 - tOut, y: -60 * tOut + bob(u, 0, 3), s: 1 + .04 * Math.max(0, Math.sin(u * 2.4)) * (1 - tOut) });
    tf(h1card, { o: 1 - tOut, s: 1 - .1 * tOut, y: -40 * tOut });
    h1card.querySelector('.h1sweep').style.left = (-200 + frac(u * .45) * 1100) + 'px';
    h1badges.forEach((b, i) => {
      tf(b, { o: 1 - tOut, y: bob(u, i, 6) + 60 * tOut, s: 1 + .06 * Math.max(0, Math.sin(u * 3 - i * .7)) });
      const sh = b.querySelector('.sh'), k = frac(u * .7 - i * .2);
      sh.style.opacity = u > .1 ? (1 - k) * .9 : 0; sh.style.transform = `scale(${1 + k * .35})`;
    });
    tf(h1subj, { ...life(u, HB.subj, HB.daily - .2, { from: .3, dy: 30, el: true, d: .7 }) });
    // daily computer: office
    const offO = win(u, HB.daily - .1, HB.bankLab - .15, .4, .3);
    v1.off.set({ ...FULL, o: offO }, { cx: 560, cy: lerp(980, 930, E.out(P(u, HB.daily, 2))), z: lerp(.95, 1.12, E.out(P(u, HB.daily, 2.2))) });
    v1.off.draw(u, { chart: P(u, HB.daily + 1, .6) });
    pop(h1daily, u, HB.daily + .3, HB.bankLab - .2);
    // split screen: banking (left) vs research (right)
    const sIn = E.out(P(u, HB.bankLab - .1, .6)), sOut = win(u, HB.bankLab - .1, HB.model3d - .15, .3, .3);
    v1.bank.set({ x: -600 * (1 - sIn), y: 0, w: 600, h: 1920, o: sOut, clip: 'polygon(0 0,100% 0,80% 100%,0 100%)' }, { cx: 520, cy: 900, z: .82 + .05 * P(u, HB.bankLab, 3) });
    v1.hpc.set({ x: 480 + 600 * (1 - sIn), y: 0, w: 600, h: 1920, o: sOut, clip: 'polygon(20% 0,100% 0,100% 100%,0 100%)' }, { cx: 560, cy: 760, z: .78 + .05 * P(u, HB.bankLab, 3) });
    if (sOut > 0) { v1.bank.draw(u, { txn: .8 }); v1.hpc.draw(u, { storm: .7 }); }
    tf(h1div, { o: sOut * sIn, r: 3.58, sy: sIn });
    pop(h1bank, u, HB.bankLab + .6, HB.model3d - .2); pop(h1lab, u, HB.bankLab + 1.1, HB.model3d - .2);
    drawHeader(h1diff, u, HB.diff, HB.model3d - .2);
    // three workloads: 3D model → transactions → weather
    const stO = win(u, HB.model3d - .1, HB.some2 - .1, .35, .3);
    v1.st.set({ ...FULL, o: stO }, camAt(u, [[HB.model3d, 540, 930, 1.0, 0], [HB.model3d + .3, 330, 730, 1.6, 1.8]]));
    v1.st.draw(u, { wire: 1, ang: u * 1.1 });
    pop(h1m3d, u, HB.model3d + .3, HB.some2 - .2);
    const bkO = win(u, HB.some2 - .1, HB.some3 - .1, .35, .3);
    if (bkO > 0) { v1.bank.set({ ...FULL, o: bkO }, camAt(u, [[HB.some2, 540, 900, .95, 0], [HB.some2 + .3, 330, 930, 1.3, 1.6]])); v1.bank.draw(u, { txn: .4 + .6 * P(u, HB.txn, .8) }); }
    pop(h1txn, u, HB.txn, HB.some3 - .2);
    const hpO = win(u, HB.some3 - .1, HB.title - .1, .35, .3);
    if (hpO > 0) { v1.hpc.set({ ...FULL, o: hpO }, camAt(u, [[HB.some3, 540, 860, .9, 0], [HB.some3 + .2, 540, 590, 1.3, 1.6]])); v1.hpc.draw(u, { storm: .3 + .7 * E.out(P(u, HB.weather, 1.5)) }); }
    pop(h1wx, u, HB.weather, HB.title - .2);
    drawHeader(h1why, u, HB.model3d + .2, HB.title - .2);
    const scr = Math.max(offO, stO, bkO, hpO); h1scrimB.style.opacity = scr; h1scrimT.style.opacity = Math.max(stO, bkO, hpO, sOut) * .9;
    // title reveal
    h1tLetters.forEach((ls, r) => ls.forEach((l, i) => { const k = P(u, HB.title + r * .25 + i * .03, .45); l.style.opacity = k; l.style.transform = `translateY(${(1 - E.back(k)) * 60}px) scale(${lerp(1.6, 1, E.out(k))})`; }));
    h1t.forEach((r, i) => tf(r, { o: 1, y: bob(u, i, 3) }));
    pop(h1tTh, u, HB.title + .9);
    h1icons.forEach((b, i) => { tf(b, { ...life(u, HB.title + 1.0 + i * .15, 1e9, { from: .2, dy: 40, el: true, d: .7 }) }); const sh = b.querySelector('.sh'), k = frac(u * .8 - i * .2); sh.style.opacity = u > HB.see ? (1 - k) * .8 : 0; sh.style.transform = `scale(${1 + k * .3})`; });
    pop(h1choose, u, HB.see, 1e9, { el: true, d: .7, from: .3 });
    h1jobs.forEach((j, i) => pop(j, u, HB.choose + i * .12, 1e9, { from: .3 }));
    h1q.forEach((q, i) => tf(q, { ...life(u, HB.choose + .6 + i * .12, 1e9, { from: .2, dy: 0, el: true }), r: Math.sin(u * 3 + i) * 8 }));
    h1flash.style.opacity = .55 * Math.max(0, 1 - Math.abs(u - HB.title) / .25);
  }

  // ======================================================================
  // SCENE 2 — STORY: five jobs, one data packet travelling through five environments
  // ======================================================================
  const s2 = $('s2'), SB = B.story;
  const KINDS = ['off', 'st', 'mini', 'bank', 'hpc'], KMAP = { off: 'office', st: 'studio', mini: 'mini', bank: 'bank', hpc: 'hpc' };
  const v2 = KINDS.map(k => ENV.view(s2, KMAP[k], { radius: 0 }));
  const s2scrimB = add(s2, `<div class="scrimB"></div>`), s2scrimT = add(s2, `<div class="scrimT"></div>`);
  const SEGA = [SB.p1, SB.p2, SB.p3, SB.p4, SB.p5, SB.diffAbility];
  const CAMS = [{ cx: 520, cy: 960, z: 1.08 }, { cx: 460, cy: 830, z: 1.12 }, { cx: 540, cy: 900, z: .98 }, { cx: 520, cy: 880, z: 1.0 }, { cx: 540, cy: 760, z: .92 }];
  const s2hdr = header(s2, 'ลองจินตนาการ...', null);
  const s2five = row(s2, 470, `<div class="chip y" style="font-size:40px;padding:10px 36px">มีงานอยู่ 5 แบบ</div>`);
  const TPOS = [[220, 580], [442, 580], [664, 580], [331, 800], [553, 800]];
  const s2tiles = TYPES.map((tp, i) => add(s2, `<div class="ice crit c" style="position:absolute;left:${TPOS[i][0]}px;top:${TPOS[i][1]}px;width:196px;height:196px;border-radius:32px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">${ICO[tp.jobIcon](78)}<div style="font-weight:700;font-size:25px;white-space:nowrap" data-fit="180">${tp.job}</div></div>`));
  const JOB = [['งานทั่วไป', 'เอกสาร · อินเทอร์เน็ต'], ['โมเดล 3 มิติ', 'งานออกแบบสามมิติ'], ['หลายคนใช้งาน', 'หลายผู้ใช้ · ระบบเดียว'], ['ธุรกรรมมหาศาล', 'ธนาคาร'], ['จำลองสภาพอากาศ', 'นักวิทยาศาสตร์']];
  const s2lbl = JOB.map(([a, b], i) => labelCard(s2, { n: i + 1, en: a, enSize: 54, sub: b, top: 1150 }));
  const s2who = ['คนที่ 1', 'คนที่ 2', 'องค์กร', 'ธนาคาร', 'นักวิทยาศาสตร์'].map(w => header(s2, w, null, 'cy'));
  const pkt = add(s2, `<div class="pkt"><div class="ring"></div><div class="core">01</div></div>`);
  const burst = add(s2, `<div class="abs" style="left:0;top:0;width:200px;height:200px;margin:-100px 0 0 -100px;border-radius:50%;border:8px solid #22D3EE;opacity:0"></div>`);
  const s2flash = add(s2, `<div class="flash"></div>`);
  // final: five glowing cards (no answer given)
  const s2q = add(s2, `<div class="glass crit c" style="position:absolute;left:220px;top:362px;width:640px;height:96px;display:flex;align-items:center;justify-content:center;gap:12px;color:#fff;font-weight:800;font-size:36px;white-space:nowrap"><span data-fit="620" style="display:inline-flex;align-items:center;gap:12px"><span style="color:#22D3EE">งานต่างกัน</span>${ARR(40, '#FFD23F')}ใช้คอมพิวเตอร์แบบไหน?</span></div>`);
  const CARD = i => ({ x: 236, y: 486 + i * 158, w: 210, h: 128 });
  const THUMB = [{ cx: 500, cy: 760, z: .3 }, { cx: 330, cy: 715, z: .42 }, { cx: 540, cy: 760, z: .26 }, { cx: 540, cy: 760, z: .27 }, { cx: 540, cy: 560, z: .3 }];
  const s2cards = TYPES.map((tp, i) => add(s2, `<div class="glass crit c" style="position:absolute;left:220px;top:${478 + i * 158}px;width:640px;height:144px;border-radius:28px">
      <div style="position:absolute;left:250px;top:0;height:144px;display:flex;align-items:center;font-weight:700;font-size:34px;color:#fff;white-space:nowrap" data-fit="280">${JOB[i][0]}</div>
      <div class="qq" style="position:absolute;right:20px;top:36px;width:72px;height:72px;border-radius:50%;background:linear-gradient(135deg,#22D3EE,#2F6BFF);display:grid;place-items:center;font-weight:800;font-size:40px;color:#fff;box-shadow:0 0 0 4px rgba(230,244,255,.5)">?</div></div>`));
  const s2str = row(s2, 1290, `<div class="chip y" style="font-size:34px">แต่ละประเภท เด่นด้านไหน?</div>`, { fit: 640 });
  sfx('whoosh', ST0 + SB.imagine, .5); sfx('data', ST0 + SB.imagine + .3, .7); TYPES.forEach((_, i) => sfx('pop', ST0 + SB.five + .2 + i * .12, .6));
  SEGA.slice(0, 5).forEach((a, i) => { sfx(i ? 'swoosh' : 'whoosh', ST0 + a - .3, .6); sfx('data', ST0 + a + .2, .7); sfx('beep', ST0 + a + .85, .5); });
  for (let i = 0; i < 8; i++) sfx('key', ST0 + SB.p1b + .4 + i * .13, .45);
  sfx('scan', ST0 + SB.p2 + 1, .5); [0, 1, 2, 3].forEach(i => sfx('beep', ST0 + SB.p3 + 1.2 + i * .45, .45));
  for (let i = 0; i < 6; i++) sfx('confirm', ST0 + SB.p4 + 1.0 + i * .25, .45); sfx('pulse', ST0 + SB.p5b, .7);
  sfx('swoosh', ST0 + SB.diffAbility - .2, .6); TYPES.forEach((_, i) => sfx('pop', ST0 + SB.diffAbility + .3 + i * .14, .55)); sfx('sparkle', ST0 + SB.mustKnow, .5); sfx('pop', ST0 + SB.strength, .7);
  function drawS2(t) {
    const u = t - ST0;
    drawHeader(s2hdr, u, SB.imagine, SB.p1 - .1);
    pop(s2five, u, SB.five, SB.p1 - .1, { el: true, d: .7, from: .3 });
    s2tiles.forEach((el, i) => { const l = life(u, SB.five + .2 + i * .12, SB.p1 - .05, { from: .3, dy: 50, el: true, d: .7, out: .35 }); const k = E.in(P(u, SB.p1 - .4, .35)); tf(el, { ...l, x: (540 - TPOS[i][0] - 98) * k, y: l.y + (640 - TPOS[i][1] - 98) * k + bob(u, i, 4), s: l.s * (1 - .7 * k) }); });
    // environments (screen-zoom transitions between them)
    let pk = null; burst.style.opacity = 0;
    v2.forEach((v, i) => {
      const a = SEGA[i], b = SEGA[i + 1];
      const inK = E.out(P(u, a - .15, .55)), outK = E.in(P(u, b - .4, .4));
      const o = i < 4 ? win(u, a - .15, b - .02, .3, .02) : clamp((u - a + .15) / .3);
      const c = CAMS[i], port = v.env.port;
      if (u < SB.diffAbility || i === 4 && u < SB.diffAbility + .9) {
        const zi = lerp(2.2, 1, inK) * (1 + .02 * clamp(u - a, 0, 3)), zo = lerp(1, 2.6, outK);
        const cam = { cx: lerp(lerp(port[0], c.cx, inK), port[0], outK), cy: lerp(lerp(port[1], c.cy, inK), port[1], outK), z: c.z * zi * (i < 4 ? zo : 1) };
        if (i === 4 && u >= SB.diffAbility) { const k = E.inOut(P(u, SB.diffAbility, .8)); v.set({ ...lerpR(FULL, CARD(4), k), o: 1 }, { cx: lerp(cam.cx, THUMB[4].cx, k), cy: lerp(cam.cy, THUMB[4].cy, k), z: lerp(cam.z, THUMB[4].z, k) }); v.frame.style.borderRadius = 18 * k + 'px'; }
        else v.set({ ...FULL, o }, cam);
        if (o > 0) {
          const act = P(u, a + .8, .5);
          v.draw(u, [{ chart: P(u, a + 1.5, .6), typing: act }, { wire: 1, typing: act }, { users: 1 + 3 * P(u, a + 1.0, 1.6) }, { txn: .2 + .8 * act }, { storm: .2 + .8 * P(u, SB.p5b, 1.4), par: act }][i]);
          if (u >= a + .05 && u < a + .9) { const k = E.inOut(P(u, a + .1, .75)); const tgt = v.toParent(port[0], port[1], FULL, cam); pk = { x: lerp(540, tgt[0], k), y: lerp(560, tgt[1], k), s: lerp(1.1, .45, k), o: 1 - P(u, a + .78, .1) }; }
          if (u >= a + .8 && u < a + 1.4) { const k = P(u, a + .8, .6); const tgt = v.toParent(port[0], port[1], FULL, cam); burst.style.left = tgt[0] + 'px'; burst.style.top = tgt[1] + 'px'; burst.style.opacity = 1 - k; burst.style.transform = `scale(${.3 + 1.6 * E.out(k)})`; }
        }
      } else {   // thumbnail in the final card
        const k = E.out(P(u, SB.diffAbility + .3 + i * .14, .5));
        v.set({ ...CARD(i), o: i === 4 ? 1 : k }, THUMB[i]); v.frame.style.borderRadius = '18px';
        v.draw(u, [{ chart: 1 }, { wire: 1 }, { users: 4 }, { txn: 1 }, { storm: 1 }][i]);
      }
    });
    if (u < SB.p1) { pk = { x: 540, y: lerp(700, 640, E.out(P(u, SB.imagine, 1))), s: lerp(.3, 1.4, E.back(P(u, SB.imagine, .7))), o: 1 }; }
    if (u >= SB.p1 - .1 && u < SB.p1 + .05) pk = { x: 540, y: 640, s: 1.4, o: 1 };
    if (pk) { pkt.style.visibility = 'visible'; pkt.style.opacity = pk.o; pkt.style.transform = `translate(${pk.x}px,${pk.y}px) scale(${pk.s}) rotate(${u * 40}deg)`; } else pkt.style.visibility = 'hidden';
    s2flash.style.opacity = Math.max(...SEGA.slice(1, 5).map(a => .5 * Math.max(0, 1 - Math.abs(u - a + .05) / .18)));
    const envOn = u >= SB.p1 - .15 && u < SB.diffAbility + .4;
    s2scrimB.style.opacity = envOn ? 1 : 0; s2scrimT.style.opacity = envOn ? .8 : 0;
    s2lbl.forEach((l, i) => pop(l.el, u, SEGA[i] + .5, SEGA[i + 1] - .25, { from: .6, dy: 60 }));
    s2who.forEach((w, i) => drawHeader(w, u, SEGA[i] + .05, SEGA[i + 1] - .25));
    // final cards
    tf(s2q, life(u, SB.diffAbility + .1, 1e9, { from: .4, dy: -30 }));
    s2cards.forEach((c, i) => {
      const l = life(u, SB.diffAbility + .3 + i * .14, 1e9, { from: .5, dy: 50 });
      const g = Math.max(0, Math.sin((u - SB.mustKnow - i * .3) * 2.2)) * (u > SB.mustKnow ? 1 : 0);
      tf(c, l); c.style.boxShadow = `0 0 0 3px rgba(34,211,238,${.5 + .5 * g}),0 0 ${30 * g}px ${8 * g}px rgba(34,211,238,.55),0 18px 40px rgba(0,0,0,.35)`;
      c.querySelector('.qq').style.transform = `rotate(${Math.sin(u * 2.4 + i) * 10}deg) scale(${1 + .12 * g})`;
    });
    pop(s2str, u, SB.strength, 1e9, { el: true, d: .7, from: .3 });
  }

  // ======================================================================
  // SCENE 3 — KNOWLEDGE: Microcomputer, Workstation (+ overlap), Minicomputer, modern servers
  // ======================================================================
  const s3 = $('s3'), KB = B.know;
  const v3 = { off: ENV.view(s3, 'office'), st: ENV.view(s3, 'studio'), mini: ENV.view(s3, 'mini', { radius: 0 }), sv: ENV.view(s3, 'servers') };
  const s3scrimB = add(s3, `<div class="scrimB"></div>`), s3scrimT = add(s3, `<div class="scrimT"></div>`);
  const s3dim = add(s3, `<div class="abs" style="inset:0;background:rgba(9,20,42,.9)"></div>`);
  // intro: first three
  const s3h0 = header(s3, '3 ประเภทแรก', null);
  const s3intro = TYPES.slice(0, 3).map((tp, i) => add(s3, `<div class="glass crit c" style="position:absolute;left:${220 + i * 222}px;top:560px;width:196px;height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">
      <div style="position:absolute;left:-10px;top:-14px;width:52px;height:52px;border-radius:50%;background:linear-gradient(135deg,#22D3EE,#2F6BFF);color:#fff;font-weight:800;font-size:26px;display:grid;place-items:center">${i + 1}</div>${ICO[tp.key](110)}<div style="font-weight:800;font-size:24px;color:#fff;white-space:nowrap" data-fit="180">${tp.short}</div></div>`));
  // 1 · micro
  const s3h1 = header(s3, 'ประเภทที่ 1', 1);
  const s3l1 = labelCard(s3, { n: 1, en: 'MICROCOMPUTER', th: 'ไมโครคอมพิวเตอร์', sub: 'งานส่วนบุคคล' });
  const s3pc = row(s3, 470, `<div class="chip y" style="font-size:34px">= คอมพิวเตอร์ส่วนบุคคล</div>`);
  const s3desk = add(s3, `<div class="chip b crit c" style="position:absolute;left:240px;top:560px;font-size:30px">${ARR(30, '#fff')}PC ตั้งโต๊ะ</div>`);
  const s3lap = add(s3, `<div class="chip b crit c" style="position:absolute;left:600px;top:760px;font-size:30px">โน้ตบุ๊ก</div>`);
  // 2 · workstation
  const s3h2 = header(s3, 'ประเภทที่ 2', 2);
  const s3l2 = labelCard(s3, { n: 2, en: 'WORKSTATION', th: 'เวิร์กสเตชัน', sub: 'งาน 3D / CAD / <span class="eng">วิศวกรรม</span>' });
  const s3hp = row(s3, 470, `<div class="chip c" style="font-size:34px">สมรรถนะสูง · งานเฉพาะทาง</div>`);
  // overlap diagram (nested, not mutually exclusive)
  const s3ov = add(s3, `<div class="abs c" style="left:220px;top:430px;width:640px;height:560px">
      <div class="ovOuter crit" style="position:absolute;inset:0;border-radius:44px;border:5px dashed #95BFEF;background:rgba(47,107,255,.14)"></div>
      <div class="crit" style="position:absolute;left:0;right:0;top:22px;text-align:center"><div style="font-weight:800;font-size:36px;color:#fff;letter-spacing:1px" data-fit="600">PERSONAL / MICROCOMPUTER</div><div style="font-weight:700;font-size:26px;color:#95BFEF">กลุ่มคอมพิวเตอร์ส่วนบุคคล</div></div>
      <div class="ovA c" style="position:absolute;left:44px;top:170px;width:150px;text-align:center;font-weight:700;font-size:24px;color:#E6F4FF">${ICO.micro(110)}<div>PC / โน้ตบุ๊ก</div></div>
      <div class="ovIn crit c" style="position:absolute;left:230px;top:150px;width:370px;height:370px;border-radius:40px;border:5px solid #22D3EE;background:linear-gradient(160deg,rgba(34,211,238,.25),rgba(47,107,255,.25));box-shadow:0 0 40px rgba(34,211,238,.45);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px">
        ${ICO.ws(150)}<div style="font-weight:800;font-size:40px;color:#fff;letter-spacing:1px">WORKSTATION</div><div style="font-weight:700;font-size:30px;color:#22D3EE">เวิร์กสเตชัน</div></div></div>`);
  const s3ovCap = add(s3, `<div class="ice crit c" style="position:absolute;left:220px;top:1030px;width:640px;padding:22px 20px;text-align:center;font-weight:800;font-size:38px;line-height:1.35"><div data-fit="600">เวิร์กสเตชัน ก็อาจจัดอยู่ใน</div><div data-fit="600" style="color:#2F6BFF">กลุ่มไมโครคอมพิวเตอร์ได้</div></div>`);
  const s3ovNote = row(s3, 1236, `<div class="chip d" style="font-size:30px">ไม่ได้แยกขาดจากกันเสมอไป</div>`);
  // 3 · mini (historical)
  const s3h3 = header(s3, 'ประเภทที่ 3', 3);
  const s3l3 = labelCard(s3, { n: 3, en: 'MINICOMPUTER', th: 'มินิคอมพิวเตอร์', sub: 'ระบบขนาดกลางแบบดั้งเดิม' });
  const s3arch = row(s3, 470, `<div class="chip d" style="font-size:30px">${ICO.ruler(40, '#FFD23F')}การแบ่งแบบดั้งเดิม · ระบบในอดีต</div>`, { fit: 640 });
  const s3multi = row(s3, 470, `<div class="chip c" style="font-size:34px">${ICO.users(42, '#08213F')}รองรับผู้ใช้หลายคน</div>`);
  const s3corners = [[236, 452, '0 0'], [790, 452, '0 0'], [236, 1064, '0 0'], [790, 1064, '0 0']].map(([x, y], i) => add(s3, `<div class="corner" style="left:${x}px;top:${y}px;border-width:${i < 2 ? '7px' : '0'} ${i % 2 ? '7px' : '0'} ${i > 1 ? '7px' : '0'} ${i % 2 ? '0' : '7px'}"></div>`));
  // modern servers comparison
  const s3hNow = header(s3, 'ปัจจุบัน', null, 'cy');
  const s3l4 = labelCard(s3, { en: 'Modern Server Systems', enSize: 52, th: 'ระบบเซิร์ฟเวอร์สมัยใหม่', top: 1150 });
  const s3past = add(s3, `<div class="chip d crit c" style="position:absolute;left:236px;top:640px;font-size:26px;padding:6px 18px">อดีต: Minicomputer</div>`);
  const s3note = row(s3, 1010, `<div class="chip y" style="font-size:30px">Server ไม่ได้หมายถึง Minicomputer เสมอไป</div>`, { fit: 640 });
  const MINI_THUMB = { x: 236, y: 452, w: 290, h: 180 };
  sfx('whoosh', KN0 + KB.first3, .5); [0, 1, 2].forEach(i => sfx('pop', KN0 + KB.first3 + .3 + i * .15, .6));
  [KB.one, KB.two, KB.three].forEach(a => { sfx('swoosh', KN0 + a - .2, .6); sfx('pop', KN0 + a + .1, .7); });
  [KB.micro, KB.ws, KB.mini].forEach(a => sfx('ding', KN0 + a + .2, .45));
  for (let i = 0; i < 8; i++) sfx('key', KN0 + KB.micro + .6 + i * .14, .4); sfx('pop', KN0 + KB.personal, .7); sfx('click', KN0 + KB.deskLap, .7); sfx('click', KN0 + KB.deskLap + .7, .7);
  sfx('pop', KN0 + KB.hiPerf, .7); sfx('scan', KN0 + KB.design3d, .8); sfx('pop', KN0 + KB.eng, .6);
  sfx('whoosh', KN0 + KB.overlap - .1, .6); sfx('pop', KN0 + KB.overlap + .3, .7); sfx('data', KN0 + KB.overlap + .9, .7); sfx('ding', KN0 + KB.overlap + 1.6, .6); sfx('pop', KN0 + KB.overlap + 2.3, .6);
  sfx('pop', KN0 + KB.midTrad, .6); [0, 1, 2, 3].forEach(i => sfx('beep', KN0 + KB.multi + .2 + i * .4, .55));
  sfx('swoosh', KN0 + KB.server - .1, .7); sfx('hum', KN0 + KB.server + .2, .6); sfx('pop', KN0 + KB.server + 1.4, .7);
  function drawS3(t) {
    const u = t - KN0;
    s3dim.style.opacity = Math.max(1 - P(u, KB.one - .2, .4), win(u, KB.overlap, KB.three - .05, .4, .3)) ;
    drawHeader(s3h0, u, KB.first3, KB.one - .1);
    s3intro.forEach((c, i) => { const l = life(u, KB.first3 + .3 + i * .15, KB.one - .05, { from: .3, dy: 60, el: true, d: .7, out: .3 }); tf(c, { ...l, y: l.y + bob(u, i, 5) }); });
    // micro
    const oO = win(u, KB.one - .2, KB.two - .1, .4, .35);
    v3.off.set({ ...FULL, o: oO }, camAt(u, [[KB.one, 540, 1000, .95, 0], [KB.micro, 560, 960, 1.08, 2.2], [KB.deskLap, 620, 900, 1.05, 1.0]]));
    v3.off.draw(u, { chart: P(u, KB.personal + .8, .6) });
    drawHeader(s3h1, u, KB.one, KB.two - .2); pop(s3l1.el, u, KB.micro, KB.two - .2, { from: .6, dy: 60 });
    pop(s3pc, u, KB.personal, KB.deskLap - .1);
    tf(s3desk, { ...life(u, KB.deskLap, KB.two - .2, { from: .3, dy: 0, el: true }), y: bob(u, 0, 4) }); tf(s3lap, { ...life(u, KB.deskLap + .7, KB.two - .2, { from: .3, dy: 0, el: true }), y: bob(u, 1, 4) });
    // workstation
    const wO = win(u, KB.two - .2, KB.three - .1, .4, .35);
    v3.st.set({ ...FULL, o: wO }, camAt(u, [[KB.two, 540, 960, .95, 0], [KB.ws, 480, 840, 1.12, 1.6], [KB.design3d - .4, 330, 760, 1.55, 1.2], [KB.overlap, 540, 900, 1.0, .8]]));
    const sw = P(u, KB.design3d, 1.3);
    v3.st.draw(u, { wire: sw >= 1 ? 0 : 1, sweep: sw > 0 && sw < 1 ? sw : null, ang: u * .9 });
    drawHeader(s3h2, u, KB.two, KB.overlap - .2); pop(s3l2.el, u, KB.ws, KB.overlap - .2, { from: .6, dy: 60 });
    tf(s3l2.sub, { ...life(u, KB.design3d, 1e9, { from: .3, dy: 20, el: true }) });
    const eng = s3l2.sub.querySelector('.eng'); const ek = Math.max(0, 1 - Math.abs(u - KB.eng - .3) / .5); eng.style.background = `rgba(47,107,255,${ek})`; eng.style.color = ek > .3 ? '#fff' : ''; eng.style.borderRadius = '10px'; eng.style.padding = '0 6px';
    pop(s3hp, u, KB.hiPerf, KB.overlap - .2);
    // overlap: workstation nested inside the personal/micro group
    const ovO = win(u, KB.overlap, KB.three - .05, .4, .3);
    tf(s3ov, { o: ovO, s: lerp(.85, 1, E.out(P(u, KB.overlap, .6))) });
    tf(s3ov.querySelector('.ovA'), life(u, KB.overlap + .3, 1e9, { from: .3, dy: 30, el: true }));
    const inK = E.out(P(u, KB.overlap + .8, .9)); tf(s3ov.querySelector('.ovIn'), { o: clamp(inK * 3), y: (1 - inK) * 520, s: lerp(.6, 1, inK) * (1 + .02 * Math.sin(u * 3)) });
    pop(s3ovCap, u, KB.overlap + 1.5, KB.three - .1); pop(s3ovNote, u, KB.overlap + 2.3, KB.three - .1, { el: true, d: .7, from: .3 });
    // mini (historical) → modern servers
    const mO = win(u, KB.three - .2, 1e9, .4, .3);
    const sk = E.inOut(P(u, KB.server, .9));
    const mR = sk > 0 ? lerpR(FULL, MINI_THUMB, sk) : FULL;
    v3.mini.set({ ...mR, o: mO }, (() => { const c = camAt(u, [[KB.three, 540, 960, .9, 0], [KB.mini, 540, 880, 1.0, 1.6], [KB.multi, 540, 960, .95, 1.2]]); return { cx: lerp(c.cx, 540, sk), cy: lerp(c.cy, 800, sk), z: lerp(c.z, .3, sk) }; })());
    v3.mini.frame.style.borderRadius = 22 * sk + 'px'; v3.mini.frame.style.boxShadow = sk > .5 ? '0 0 0 4px #FFD23F,0 16px 30px rgba(0,0,0,.4)' : '';
    v3.mini.frame.style.zIndex = 2; v3.mini.frame.style.filter = `saturate(${lerp(.75, .55, sk)})`;
    v3.mini.draw(u, { users: u < KB.multi ? 2 : 2 + 2 * P(u, KB.multi + .2, 1.2), scan: .22 });
    drawHeader(s3h3, u, KB.three, KB.server - .2); pop(s3l3.el, u, KB.mini, KB.server - .2, { from: .6, dy: 60 });
    tf(s3l3.sub, life(u, KB.midTrad, 1e9, { from: .3, dy: 20, el: true }));
    pop(s3arch, u, KB.midTrad + .3, KB.multi - .1); pop(s3multi, u, KB.multi, KB.server - .2);
    s3corners.forEach((c, i) => tf(c, { o: win(u, KB.mini, KB.server, .4, .3), s: 1 + .05 * Math.sin(u * 2 + i) }));
    const svO = clamp((u - KB.server) / .5);
    v3.sv.set({ ...FULL, o: svO, x: 300 * (1 - E.out(clamp((u - KB.server) / .8))) }, { cx: 540, cy: 860, z: .92 + .04 * P(u, KB.server, 4) });
    v3.sv.frame.style.zIndex = 1; v3.sv.draw(u);
    drawHeader(s3hNow, u, KB.server + .1); pop(s3l4.el, u, KB.server + .4, 1e9, { from: .6, dy: 60 });
    pop(s3past, u, KB.server + .8); pop(s3note, u, KB.server + 1.4, 1e9, { el: true, d: .7, from: .3 });
    const envOn = oO + wO + mO > 0 && !(u >= KB.overlap + .3 && u < KB.three - .1);
    s3scrimB.style.opacity = envOn ? 1 : 0; s3scrimT.style.opacity = envOn ? .85 : 0;
    s3scrimB.style.zIndex = s3scrimT.style.zIndex = 3;
  }
  // keep overlays above the env frames (frames get z-index 1–2 during the mini → server move)
  [...s3.children].forEach(c => { if (!c.classList.contains('envframe')) c.style.zIndex = c.style.zIndex || 4; });

  // ======================================================================
  // SCENE 4 — MAINFRAME + SUPERCOMPUTER, then the side-by-side comparison
  // ======================================================================
  const s4 = $('s4'), XB = B.expl;
  const v4 = { bank: ENV.view(s4, 'bank'), hpc: ENV.view(s4, 'hpc') };
  const s4scrimB = add(s4, `<div class="scrimB"></div>`), s4scrimT = add(s4, `<div class="scrimT"></div>`);
  const s4h4 = header(s4, 'ประเภทที่ 4', 4), s4h5 = header(s4, 'ประเภทที่ 5', 5);
  const s4l4 = labelCard(s4, { n: 4, en: 'MAINFRAME COMPUTER', th: 'เมนเฟรมคอมพิวเตอร์', sub: 'ธุรกรรมจำนวนมหาศาล' });
  const s4l5 = labelCard(s4, { n: 5, en: 'SUPERCOMPUTER', th: 'ซูเปอร์คอมพิวเตอร์', sub: 'การคำนวณทางวิทยาศาสตร์ขนาดใหญ่' });
  const s4txn = row(s4, 470, `<div class="chip c" style="font-size:32px">รองรับธุรกรรมจำนวนมาก อย่างต่อเนื่อง</div>`, { fit: 640 });
  const s4rel = row(s4, 1030, `<div style="display:flex;gap:14px"><div class="chip d" style="font-size:30px">${ICO.shield(38)}เชื่อถือได้</div><div class="chip d" style="font-size:30px">${ICO.lock(38)}ปลอดภัย</div><div class="chip d" style="font-size:30px">${ICO.check(34, '#22C55E')}ต่อเนื่อง</div></div>`, { fit: 640 });
  const s4bank = row(s4, 470, `<div class="chip y" style="font-size:34px">${ICO.bank(40, '#142B53')}เช่น ระบบธนาคารขนาดใหญ่</div>`);
  const s4calc = row(s4, 470, `<div class="chip c" style="font-size:32px">คำนวณขนาดมหาศาล · ประมวลผลแบบขนาน</div>`, { fit: 640 });
  const s4ex = row(s4, 1030, `<div style="display:flex;gap:14px"><div class="chip y ex1" style="font-size:31px">${ICO.storm(40, '#142B53')}พยากรณ์อากาศ</div><div class="chip y ex2" style="font-size:31px">${ICO.atom(40, '#142B53')}งานวิจัยวิทยาศาสตร์</div></div>`, { fit: 640 });
  // comparison cards
  const s4hc = header(s4, 'จำจุดต่างให้ดี!', null, 'cy');
  const CA = { x: 220, y: 452, w: 640, h: 430 }, CB = { x: 220, y: 908, w: 640, h: 430 };
  const s4ta = add(s4, `<div class="crit c" style="position:absolute;left:220px;top:${CA.y + 286}px;width:640px;height:144px;border-radius:0 0 34px 34px;background:linear-gradient(180deg,rgba(9,22,46,0),rgba(9,22,46,.95) 40%);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:14px">
      <div style="font-weight:800;font-size:48px;color:#fff;letter-spacing:1px;line-height:1.1">MAINFRAME</div><div class="tg" style="font-weight:700;font-size:31px;color:#FFD23F">ธุรกรรม / ระบบองค์กร</div></div>`);
  const s4tb = add(s4, `<div class="crit c" style="position:absolute;left:220px;top:${CB.y + 286}px;width:640px;height:144px;border-radius:0 0 34px 34px;background:linear-gradient(180deg,rgba(9,22,46,0),rgba(9,22,46,.95) 40%);display:flex;flex-direction:column;align-items:center;justify-content:flex-end;padding-bottom:14px">
      <div style="font-weight:800;font-size:48px;color:#fff;letter-spacing:1px;line-height:1.1">SUPERCOMPUTER</div><div class="tg" style="font-weight:700;font-size:31px;color:#FFD23F">วิทยาศาสตร์ / แบบจำลอง</div></div>`);
  const s4ring = [CA, CB].map(r => add(s4, `<div class="abs" style="left:${r.x - 6}px;top:${r.y - 6}px;width:${r.w + 12}px;height:${r.h + 12}px;border-radius:40px;border:6px solid #22D3EE;box-shadow:0 0 40px rgba(34,211,238,.7);opacity:0"></div>`));
  const s4diff = add(s4, `<div class="glass crit c" style="position:absolute;left:220px;top:600px;width:640px;height:460px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;border-radius:40px;background:rgba(9,22,46,.95)">
      <div style="display:flex;gap:26px;margin-bottom:10px">${ICO.mf(96)}<div style="align-self:center">${ICO.neq(60, '#FFD23F')}</div>${ICO.sc(96)}</div>
      <div style="font-weight:800;font-size:50px;color:#fff;line-height:1.15" data-fit="600">Different Workloads</div>
      <div style="font-weight:800;font-size:50px;color:#22D3EE;line-height:1.15" data-fit="600">Different Strengths</div>
      <div class="dth" style="margin-top:12px;font-weight:700;font-size:32px;color:#142B53;background:#FFD23F;padding:6px 24px;border-radius:22px;white-space:nowrap" data-fit="600">ไม่ได้เร็วกว่ากัน “ในทุกงาน”</div></div>`);
  const s4try = row(s4, 1230, `<div class="pill hp" style="font-size:38px"><div class="num">?</div>มาลองทำข้อสอบกัน!</div>`);
  sfx('swoosh', EX0 + XB.four - .1, .6); sfx('hum', EX0 + XB.four + .2, .7); sfx('ding', EX0 + XB.mf + .2, .5);
  for (let i = 0; i < 10; i++) sfx('confirm', EX0 + XB.mfTxn + .3 + i * .2, .4); sfx('pop', EX0 + XB.mfTxn + 1.6, .6); sfx('pop', EX0 + XB.bank, .7);
  sfx('whoosh', EX0 + XB.five - .2, .7); sfx('ding', EX0 + XB.sc + .2, .5); sfx('pulse', EX0 + XB.scCalc, .8); sfx('pulse', EX0 + XB.scCalc + .8, .6);
  sfx('scan', EX0 + XB.weather, .6); sfx('pop', EX0 + XB.weather + .1, .6); sfx('pop', EX0 + XB.research, .6);
  sfx('swoosh', EX0 + XB.remember - .1, .6); sfx('ding', EX0 + XB.cmpMf, .5); sfx('ding', EX0 + XB.cmpSc2, .5); sfx('stamp', EX0 + XB.notFaster, .6); sfx('pop', EX0 + XB.notFaster2, .6); sfx('pop', EX0 + XB.tryQuiz, .8);
  function drawS4(t) {
    const u = t - EX0;
    const cK = E.inOut(P(u, XB.remember, .9));
    // mainframe
    const bO = u < XB.remember ? win(u, XB.four - .2, XB.five + .1, .4, .3) : clamp((u - XB.remember - .2) / .4);
    const bCam = camAt(u, [[XB.four, 540, 940, .8, 0], [XB.mf, 540, 920, .95, 1.6], [XB.mfTxn, 540, 660, 1.12, 1.2], [XB.mfTxn + 2.2, 540, 900, 1.0, 1.0], [XB.bank, 360, 930, 1.12, 1.2], [XB.five - .4, 540, 920, 1.6, .4]]);
    if (u < XB.remember) v4.bank.set({ ...FULL, o: bO }, bCam); else v4.bank.set({ ...CA, o: bO, s: lerp(.9, 1, E.out(P(u, XB.remember + .2, .5))) }, { cx: 540, cy: 870, z: .62 });
    v4.bank.frame.style.borderRadius = u < XB.remember ? '0' : '34px';
    v4.bank.draw(u, { txn: u < XB.mfTxn ? .35 : .35 + .65 * P(u, XB.mfTxn, 1.2) });
    drawHeader(s4h4, u, XB.four, XB.five - .2); pop(s4l4.el, u, XB.mf, XB.five - .2, { from: .6, dy: 60 });
    pop(s4txn, u, XB.mfTxn, XB.bank - .1); pop(s4rel, u, XB.mfTxn + 1.6, XB.five - .2); pop(s4bank, u, XB.bank, XB.five - .2);
    // supercomputer
    const hO = win(u, XB.five - .1, 1e9, .45, .3);
    const hCam = camAt(u, [[XB.five, 540, 900, 1.5, 0], [XB.five + .05, 540, 880, .92, 1.0], [XB.scCalc, 540, 980, 1.18, 1.4], [XB.weather, 540, 600, 1.22, 1.2], [XB.research, 540, 700, 1.05, 1.2]]);
    if (u < XB.remember) v4.hpc.set({ ...FULL, o: hO }, hCam);
    else { v4.hpc.set({ ...lerpR(FULL, CB, cK), o: 1 }, { cx: lerp(hCam.cx, 540, cK), cy: lerp(hCam.cy, 660, cK), z: lerp(hCam.z, .62, cK) }); }
    v4.hpc.frame.style.borderRadius = 34 * cK + 'px';
    v4.hpc.draw(u, { par: u < XB.scCalc ? .3 : .3 + .7 * P(u, XB.scCalc, 1), storm: u < XB.weather ? .35 : .35 + .65 * E.out(P(u, XB.weather, 1.6)) });
    drawHeader(s4h5, u, XB.five, XB.remember - .2); pop(s4l5.el, u, XB.sc, XB.remember - .2, { from: .6, dy: 60 });
    pop(s4calc, u, XB.scCalc, XB.remember - .2);
    tf(s4ex, { o: win(u, XB.weather, XB.remember - .2, .3, .3) });
    tf(s4ex.querySelector('.ex1'), life(u, XB.weather, 1e9, { from: .3, dy: 20, el: true })); tf(s4ex.querySelector('.ex2'), life(u, XB.research, 1e9, { from: .3, dy: 20, el: true }));
    const envOn = u < XB.remember + .3;
    s4scrimB.style.opacity = envOn ? 1 : 0; s4scrimT.style.opacity = envOn ? .85 : 0;
    // comparison
    drawHeader(s4hc, u, XB.remember + .1, XB.tryQuiz - .1);
    const dim = E.out(P(u, XB.notFaster, .5));
    [v4.bank, v4.hpc].forEach(v => { if (u >= XB.remember) v.frame.style.filter = `brightness(${1 - .5 * dim})`; else v.frame.style.filter = ''; });
    tf(s4ta, { ...life(u, XB.remember + .5, 1e9, { from: .6, dy: 30 }), o: (1 - .6 * dim) * clamp((u - XB.remember - .5) * 3) });
    tf(s4tb, { ...life(u, XB.remember + .7, 1e9, { from: .6, dy: 30 }), o: (1 - .6 * dim) * clamp((u - XB.remember - .7) * 3) });
    const gA = win(u, XB.cmpMf, XB.cmpSc - .1, .3, .4), gB = win(u, XB.cmpSc, XB.notFaster - .1, .3, .4);
    s4ring[0].style.opacity = gA * (.7 + .3 * Math.sin(u * 5)); s4ring[1].style.opacity = gB * (.7 + .3 * Math.sin(u * 5));
    tf(s4ta.querySelector('.tg'), { s: 1 + .12 * gA }); tf(s4tb.querySelector('.tg'), { s: 1 + .12 * gB });
    pop(s4diff, u, XB.notFaster, 1e9, { from: .7, dy: 40 });
    tf(s4diff.querySelector('.dth'), life(u, XB.notFaster2, 1e9, { from: .3, dy: 20, el: true }));
    pop(s4try, u, XB.tryQuiz, 1e9, { el: true, d: .7, from: .3 });
  }

  // ======================================================================
  // SCENE 5 — QUIZ, exact 5-second countdown (150 frames), ANSWER + recap
  // ======================================================================
  const s5 = $('s5'), QB = B.quiz, AB = B.ans;
  const REV = AN + AB.reveal;   // "ข้อ ขอ ไข่" — the only moment option ข is highlighted (after the countdown)
  mark('reveal', REV);
  const q5hdr = row(s5, 362, `<div class="pill hp np" style="font-size:40px"><span class="qh">ลองทำข้อสอบ!</span></div>`);
  const org = [Q.org1, Q.org2].map((o, i) => add(s5, `<div class="org glass crit c" style="top:${452 + i * 154}px"><div class="oi">${ICO[o.icon](70, '#fff')}</div><div><div class="ot">${o.title}</div><div class="ox">${o.text}</div></div>
      <div class="tag" style="position:absolute;right:-6px;bottom:-16px;opacity:0"><div class="chip g" style="font-size:24px;padding:6px 16px">${ICO.check(26)}${i ? 'SUPERCOMPUTER' : 'MAINFRAME'}</div></div></div>`));
  const q5ask = row(s5, 766, `<div class="chip y" style="font-size:33px">${Q.ask}</div>`, { fit: 640 });
  const OPT_AT = [QB.optA, QB.optB, QB.optC, QB.optD];
  const q5opts = NSP.buildQuizOptions(add(s5, `<div class="abs" style="inset:0"></div>`), Q.options.map(o => [o.b, `<span class="t1" data-fit="450">${o.th}</span><span class="t2">${o.en[0]}${ICO.arrow(24, '#2F6BFF')}${o.en[1]}</span>`]), { top: 850, gap: 142 });
  q5opts.forEach(o => o.el.classList.add('crit'));
  // countdown: engine component, restyled (electric-blue digits, cyan ring, navy scene)
  const q5cd = NSP.buildCountdown(add(s5, `<div class="abs c" style="left:400px;top:450px"></div>`), 280);
  { const sv = q5cd.el.querySelector('svg'), st = sv.querySelectorAll('stop'), cs = sv.querySelectorAll('circle');
    st[0].setAttribute('stop-color', '#22D3EE'); st[1].setAttribute('stop-color', '#7DEBFA');
    cs[0].setAttribute('fill', '#E6F4FF'); cs[1].setAttribute('stroke', '#BFD6F2'); cs[3].setAttribute('stroke', '#2F6BFF');
    q5cd.num.style.color = '#2F6BFF'; q5cd.el.classList.add('crit'); q5cd.el.style.filter = 'drop-shadow(0 0 22px rgba(34,211,238,.6))'; }
  const q5mini = [Q.org1, Q.org2].map((o, i) => add(s5, `<div class="c" style="position:absolute;left:${i ? 726 : 234}px;top:530px;width:120px;height:120px;border-radius:30px;display:grid;place-items:center;background:linear-gradient(160deg,#2F6BFF,#1A3E9A);box-shadow:0 0 0 4px rgba(149,191,239,.6)">${ICO[o.icon](76, '#fff')}<div style="position:absolute;left:-12px;top:-12px;width:44px;height:44px;border-radius:50%;background:#FFD23F;color:#142B53;font-weight:800;font-size:26px;display:grid;place-items:center">${i + 1}</div></div>`));
  const q5conf = NSP.buildConfetti(add(s5, `<div class="abs" style="inset:0"></div>`), 50, 540, 1050);
  [...s5.querySelectorAll('.conf')].forEach((c, i) => { c.style.background = ['#22D3EE', '#2F6BFF', '#95BFEF', '#FFD23F', '#22C55E', '#E6F4FF'][i % 6]; });
  // answer panels
  const q5panel = { bank: ENV.view(s5, 'bank', { radius: 36 }), hpc: ENV.view(s5, 'hpc', { radius: 36 }) };
  const PANEL = { x: 220, y: 452, w: 640, h: 590 };
  const q5mf = row(s5, 1070, `<div class="ice" style="padding:16px 30px;font-weight:800;font-size:38px;white-space:nowrap;border-radius:30px" data-fit="640"><span style="color:#2F6BFF">MAINFRAME</span> = ธุรกรรมจำนวนมาก</div>`);
  const q5mfEx = row(s5, 1186, `<div class="chip d" style="font-size:31px">${ICO.bank(40, '#22D3EE')}เช่น ระบบธนาคาร</div>`);
  const q5sc = row(s5, 1070, `<div class="ice" style="padding:16px 30px;font-weight:800;font-size:38px;white-space:nowrap;border-radius:30px" data-fit="640"><span style="color:#2F6BFF">SUPERCOMPUTER</span> = คำนวณทางวิทยาศาสตร์</div>`);
  const q5scEx = row(s5, 1186, `<div class="chip d" style="font-size:31px">${ICO.storm(40, '#22D3EE')}เช่น แบบจำลองสภาพอากาศ</div>`);
  // recap (equal cards, narration order — not a ranking)
  const RC_AT = [[AB.rMicro, AB.rMicroD], [AB.rWs, AB.rWsD], [AB.rMini, AB.rMiniD], [AB.rMf, AB.rMfD], [AB.rSc, AB.rScD]];
  const q5rc = TYPES.map((tp, i) => add(s5, `<div class="rc glass crit c" style="top:${448 + i * 184}px"><div class="ri">${ICO[tp.key](92)}</div><div><div class="rn" data-fit="440">${tp.short}</div><div class="rd" data-fit="440">${tp.recap}</div></div></div>`));
  const q5rank = row(s5, 1374, `<div style="font-weight:600;font-size:24px;color:#95BFEF;white-space:nowrap">* แบ่งตามลักษณะงาน ไม่ใช่การจัดอันดับความเร็ว</div>`, { fit: 640 });
  const q5rule = add(s5, `<div class="ice crit c" style="position:absolute;left:220px;top:560px;width:640px;height:400px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:16px;text-align:center">
      <div class="r1" style="display:flex;align-items:center;gap:16px;font-weight:800;font-size:50px;white-space:nowrap" data-fit="600"><span style="position:relative;display:inline-grid">${ICO.ruler(70, '#2F6BFF')}<svg style="position:absolute;inset:0" width="70" height="70" viewBox="0 0 24 24"><path d="M4 4l16 16" stroke="#EF4444" stroke-width="2.6" stroke-linecap="round"/></svg></span>อย่าจำแค่ขนาด</div>
      <div class="r2" style="font-weight:800;font-size:56px;color:#2F6BFF;white-space:nowrap" data-fit="600">ต้องดูหน้าที่การใช้งาน!</div></div>`);
  const q5final = row(s5, 1020, `<div class="chip g" style="font-size:36px;padding:14px 30px">${ICO.check(40)}${Q.answerLine}</div>`, { fit: 640 });
  // SFX: quiz, ticks on exact frames, reveal
  sfx('whoosh', QS + QB.intro, .6); sfx('pop', QS + QB.intro + .1, .8); sfx('pop', QS + QB.org1, .7); sfx('pop', QS + QB.org2, .7); sfx('pop', QS + QB.ask, .6);
  OPT_AT.forEach(a => sfx('pop', QS + a, .8)); sfx('pop', QS + QB.think, .5); sfx('riser', QS + QB.fiveSec + .2, .4);
  for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', (CDF + i * FPS) / FPS, 1);
  sfx('ding', AN + AB.reveal0, .6); sfx('ding', REV, 1); sfx('success', REV + .05, 1); sfx('sparkle', REV + .3, .7);
  sfx('pop', AN + AB.pair, .7); sfx('pop', AN + AB.pair + .4, .7);
  sfx('swoosh', AN + AB.mf - .1, .6); for (let i = 0; i < 8; i++) sfx('confirm', AN + AB.mfTxn + .2 + i * .25, .4); sfx('pop', AN + AB.mfBank, .6);
  sfx('swoosh', AN + AB.sc - .1, .6); sfx('pulse', AN + AB.sc + .4, .7); sfx('pop', AN + AB.scWeather, .6);
  sfx('whoosh', AN + AB.recap - .1, .6); TYPES.forEach((_, i) => sfx('pop', AN + AB.recap + .2 + i * .12, .45)); RC_AT.forEach(([a, b]) => { sfx('ding', AN + a, .35); sfx('click', AN + b, .4); });
  sfx('swoosh', AN + AB.exam - .1, .6); sfx('stamp', AN + AB.notSize, .7); sfx('ding', AN + AB.role, .7); sfx('sparkle', AN + AB.role + .2, .6);
  // countdown digit from the frame index (exactly 30 frames per digit, nothing outside the 150 frames)
  function cdDigit(t) { const f = Math.round(t * FPS) - CDF; return f >= 0 && f < CDN ? 5 - Math.floor(f / FPS) : 0; }
  window.EP47_QC = { cdDigit, CDF, CDN, REV, revealState: () => ({ ov: +q5opts[Q.correct].ov.style.opacity || 0, chk: +q5opts[Q.correct].chk.style.opacity || 0, bg: q5opts[Q.correct].b.style.background }) };
  function drawS5(t) {
    const u = t - QS, ua = t - AN, rv = t - REV, f = Math.round(t * FPS) - CDF;
    const inCd = f >= 0 && f < CDN, ans = t >= AN;
    // header
    const HS = [[-1e9, 'ลองทำข้อสอบ!'], [CD - AN, 'คิดให้ดี! 5 วินาที'], [0, 'เฉลย!'], [AB.reveal, 'เฉลย ข้อ ข.'], [AB.mf, 'ทำไมข้อ ข. ถึงถูก?'], [AB.recap, 'สรุป 5 ประเภท'], [AB.exam, 'จำให้แม่น!']];
    let hs = 0; HS.forEach((x, i) => { if (ua >= x[0]) hs = i; });
    q5hdr.querySelector('.qh').textContent = HS[hs][1];
    const hl = life(u, QB.intro, 1e9, { from: .4, dy: -30 });
    tf(q5hdr, { ...hl, s: hl.s * (1 + .08 * Math.max(0, 1 - Math.abs(ua - HS[hs][0]) / .3) * (hs ? 1 : 0)) });
    // org cards (hidden during the countdown: compact icons instead) and question
    const orgO = ans ? win(ua, AB.reveal0 + .2, AB.mf - .2, .4, .3) : 1 - clamp((u - QB.fiveSec - .9) / .3);
    org.forEach((o, i) => {
      const a = i ? QB.org2 : QB.org1;
      const l = life(u, a, 1e9, { from: .5, dy: 40 });
      tf(o, { ...l, o: l.o * orgO });
      const ox = o.querySelector('.ox'), ra = i ? QB.org2b : QB.org1b, rb = i ? QB.ask - .1 : QB.org2 - .1;
      ox.style.opacity = clamp((u - ra) / .4);
      const rk = u >= ra && u < rb + .4 ? clamp((u - ra) / (rb - ra)) : 0, ro = u >= ra && u < rb + .4 ? 1 - clamp((u - rb) / .4) : 0;
      ox.style.background = ro > 0 ? `linear-gradient(90deg,rgba(34,211,238,${.28 * ro}) ${rk * 100}%,rgba(34,211,238,${.08 * ro}) 0)` : 'none'; ox.style.borderRadius = '10px'; ox.style.margin = '0 -6px'; ox.style.padding = '0 6px';
      tf(o.querySelector('.tag'), life(ua, AB.pair + i * .4, 1e9, { from: .2, dy: 10, el: true }));
    });
    const miniO = clamp((u - QB.fiveSec - 1.0) / .3) * (ans ? 1 - clamp((ua - AB.reveal0) / .3) : 1);
    q5mini.forEach((m, i) => tf(m, { o: miniO, s: lerp(.6, 1, E.back(clamp((u - QB.fiveSec - 1.0) / .4))), y: bob(t, i, 4) }));
    tf(q5ask, { ...life(u, QB.ask, AN + AB.mf - QS - .2, { from: .5, dy: 30 }) });
    // countdown ring: prepared during "ให้เวลา 5 วินาที" with no digit; digits only inside the 150 frames
    const prep = clamp((u - QB.fiveSec - 1.0) / .35) * (ans ? 0 : 1);
    tf(q5cd.el, { o: prep, s: lerp(.5, 1, E.back(clamp((u - QB.fiveSec - 1.0) / .45))) * (inCd ? 1 + .05 * Math.max(0, 1 - (f % FPS) / 8) : 1) });
    const dg = cdDigit(t);
    q5cd.num.textContent = dg ? dg : '';
    q5cd.num.style.transform = `scale(${dg ? lerp(1.45, 1, E.back(clamp((f % FPS) / 10))) : 1})`;
    const prog = inCd ? f / CDN : f >= CDN ? 1 : 0;
    q5cd.ring.setAttribute('stroke-dashoffset', q5cd.C * prog);
    const ang = -Math.PI / 2 + (1 - prog) * Math.PI * 2; q5cd.dot.setAttribute('cx', q5cd.c + q5cd.r * Math.cos(ang)); q5cd.dot.setAttribute('cy', q5cd.c + q5cd.r * Math.sin(ang));
    // options: neutral until REV; engine reveal styling after
    NSP.drawQuizOptions(q5opts, u, rv, OPT_AT, Q.correct, { shiftY: 0 });
    q5opts[Q.correct].tx.querySelector('.t2').style.color = rv >= 0 ? '#fff' : '';
    const optOut = ans ? E.in(P(ua, AB.mf - .3, .45)) : 0;
    if (optOut > 0) q5opts.forEach((o, i) => { const op = parseFloat(o.el.style.opacity) * (1 - optOut); o.el.style.opacity = op; o.el.style.visibility = op <= .001 ? 'hidden' : 'visible'; o.el.style.transform += ` translateY(${optOut * 120}px)`; });
    NSP.drawConfetti(q5conf, t, REV + .05, 2.6);
    // explanation panels
    const pB = win(ua, AB.mf - .1, AB.sc - .05, .4, .3), pH = win(ua, AB.sc - .1, AB.recap - .1, .4, .3);
    const STRIP_B = { x: 0, y: 1462, w: 540, h: 460 }, STRIP_H = { x: 540, y: 1462, w: 540, h: 460 };
    const kB = E.inOut(P(ua, AB.mf - .15, .6)), kH = E.inOut(P(ua, AB.sc - .15, .6));
    const sB = clamp((u - QB.org1) / .6) * .7, sH = clamp((u - QB.org2) / .6) * .7;
    const oB = ua < AB.mf - .15 ? sB : kB < 1 ? lerp(.7, 1, kB) : pB, oH = ua < AB.sc - .15 ? sH : kH < 1 ? lerp(.7, 1, kH) : pH;
    q5panel.bank.set({ ...lerpR(STRIP_B, PANEL, kB), o: oB }, { cx: 540, cy: lerp(880, 900, kB), z: lerp(.5, .7, kB) + .06 * P(ua, AB.mf, 5) });
    q5panel.bank.draw(t, { txn: 1 });
    const zW = E.inOut(P(ua, AB.scWeather - .3, 1));
    q5panel.hpc.set({ ...lerpR(STRIP_H, PANEL, kH), o: oH }, { cx: 540, cy: lerp(lerp(560, 700, kH), 560, zW), z: lerp(lerp(.5, .66, kH), .9, zW) });
    q5panel.hpc.draw(t, { storm: 1 });
    [[q5panel.bank, kB], [q5panel.hpc, kH]].forEach(([p, k]) => { p.frame.style.boxShadow = k > .5 ? '0 0 0 4px rgba(34,211,238,.7),0 20px 44px rgba(0,0,0,.45)' : ''; p.frame.style.borderRadius = 36 * k + 'px'; p.frame.style.webkitMaskImage = p.frame.style.maskImage = k > .99 ? 'none' : `linear-gradient(180deg,rgba(0,0,0,${k}) 0%,#000 ${lerp(45, 0, k)}%)`; });
    pop(q5mf, ua, AB.mfTxn - .3, AB.sc - .2); pop(q5mfEx, ua, AB.mfBank, AB.sc - .2, { el: true, d: .7, from: .3 });
    pop(q5sc, ua, AB.sc + .3, AB.recap - .2); pop(q5scEx, ua, AB.scWeather, AB.recap - .2, { el: true, d: .7, from: .3 });
    // recap
    const rDim = E.out(P(ua, AB.exam, .5));
    q5rc.forEach((c, i) => {
      const l = life(ua, AB.recap + .2 + i * .12, 1e9, { from: .5, dy: 50, d: .5 });
      const nx = i < 4 ? RC_AT[i + 1][0] : AB.exam, on = ua >= RC_AT[i][0] - .1 && ua < nx - .1, said = ua >= RC_AT[i][0] - .1;
      const hk = on ? E.out(P(ua, RC_AT[i][0] - .1, .3)) : 0;
      tf(c, { ...l, o: l.o * (said ? 1 : .55) * (1 - .82 * rDim), s: l.s * (1 + .03 * hk) * (1 - .04 * rDim) });
      c.style.boxShadow = `0 0 0 ${3 + 3 * hk}px rgba(34,211,238,${.5 + .5 * hk}),0 0 ${36 * hk}px rgba(34,211,238,.55),0 18px 40px rgba(0,0,0,.35)`;
      c.querySelector('.rd').style.opacity = clamp((ua - RC_AT[i][1]) / .35);
    });
    tf(q5rank, { o: win(ua, AB.recap + .4, AB.exam, .5, .3) });
    tf(q5rule, life(ua, AB.notSize - .2, 1e9, { from: .6, dy: 40 }));
    tf(q5rule.querySelector('.r1'), life(ua, AB.notSize - .1, 1e9, { from: .3, dy: 20, el: true }));
    tf(q5rule.querySelector('.r2'), life(ua, AB.role, 1e9, { from: .3, dy: 20, el: true }));
    tf(q5final, life(ua, AB.exam, 1e9, { from: .3, dy: 30, el: true, d: .8 }));
  }

  // ======================================================================
  // SCENE 6 — PROMOTION + END CARD (07_promotion.mp3)
  // ======================================================================
  const s6 = $('s6'), PB = B.promo, BASE = NSP.BASE;
  const p6q = row(s6, 400, `<div class="ice" style="padding:20px 34px;font-weight:800;font-size:54px;white-space:nowrap;border-radius:36px" data-fit="640">คุณตอบถูกข้อ <span style="color:#22C55E">ข.</span> ไหม?</div>`);
  const p6cm = add(s6, `<div class="glass crit c" style="position:absolute;left:220px;top:600px;width:640px;height:470px;padding:30px;border-radius:36px">
      <div style="display:flex;align-items:center;gap:14px;font-weight:800;font-size:32px;color:#fff">${ICO.comment(50, '#22D3EE')}คอมเมนต์</div>
      ${[['ข้อ ข. ครับ!', '#2F6BFF'], ['เมนเฟรม + ซูเปอร์คอมฯ', '#0FA6C4'], ['ข้อ ข. ค่ะ', '#5E8FD6']].map(([tx, c], i) => `<div class="cm c" style="display:flex;align-items:center;gap:16px;margin-top:26px"><div style="width:72px;height:72px;border-radius:50%;background:${c};display:grid;place-items:center;flex:none"><svg width="44" height="44" viewBox="0 0 100 100"><circle cx="50" cy="38" r="18" fill="#fff"/><path d="M20 86 Q20 60 50 60 Q80 60 80 86Z" fill="#fff"/></svg></div><div style="background:#E6F4FF;color:#142B53;font-weight:700;font-size:32px;padding:14px 24px;border-radius:24px;white-space:nowrap">${tx}</div><div class="lk" style="margin-left:auto">${NSP.ICON.heart('#EE7FAA')}</div></div>`).join('')}</div>`);
  const p6cbtn = row(s6, 1110, `<div class="btn" style="font-size:36px">${ICO.comment(44, '#fff')}คอมเมนต์มาบอกกันหน่อย!</div>`, { fit: 640 });
  const p6rh = row(s6, 400, `<div class="pill hp np" style="font-size:40px">จำครบ 5 ประเภทหรือยัง?</div>`, { fit: 640 });
  const RPOS = [[220, 520], [442, 520], [664, 520], [331, 800], [553, 800]];
  const p6ic = TYPES.map((tp, i) => add(s6, `<div class="glass crit c" style="position:absolute;left:${RPOS[i][0]}px;top:${RPOS[i][1]}px;width:196px;height:250px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px">${ICO[tp.key](106)}<div style="font-weight:800;font-size:24px;color:#fff;white-space:nowrap" data-fit="180">${tp.short}</div>
      <div class="ck" style="position:absolute;right:-10px;top:-12px;width:50px;height:50px;border-radius:50%;background:#22C55E;display:grid;place-items:center;box-shadow:0 0 0 4px #0A1730">${ICO.check(30)}</div></div>`));
  const p6prac = row(s6, 1110, `<div class="chip y" style="font-size:34px">${ICO.doc(42, '#142B53')}ฝึกข้อสอบคอมพิวเตอร์เพิ่ม</div>`, { fit: 640 });
  const p6logo = add(s6, `<img class="abs c" src="${BASE}brand/logo.png" style="left:330px;top:420px;width:420px">`);
  const p6wm = row(s6, 870, `<div class="wm" style="font-size:112px">NaiSibPro</div>`);
  const p6th = row(s6, 1010, `<div class="chip b" style="font-size:40px;padding:10px 36px">นายสิบโปร</div>`);
  const p6poster = add(s6, `<div class="abs c" style="left:300px;top:450px;width:280px;height:498px;border-radius:24px;overflow:hidden;box-shadow:0 20px 44px rgba(0,0,0,.45),0 0 0 6px #E6F4FF"><img src="${BASE}brand/poster.jpg" style="width:280px;height:498px;display:block"></div>`);
  const p6cnt = add(s6, `<div class="crit c" style="position:absolute;left:600px;top:540px;width:260px;text-align:center"><div class="cn big" style="font-size:64px;line-height:1">10,000</div><div style="font-weight:800;font-size:30px;color:#22D3EE">ข้อขึ้นไป</div></div>`);
  const p6bank = row(s6, 990, `<div class="chip y" style="font-size:36px">รวมข้อสอบมากกว่าหมื่นข้อ</div>`, { fit: 640 });
  const p6week = row(s6, 1100, `<div class="chip c" style="font-size:36px"><svg width="40" height="40" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="#08213F" stroke-width="2.4"/><path d="M3 10h18M8 3v4M16 3v4" stroke="#08213F" stroke-width="2.4" stroke-linecap="round"/></svg>อัปเดตทุกสัปดาห์!</div>`);
  // end card
  const p6end = add(s6, `<div class="abs" style="inset:0;background:linear-gradient(170deg,#0A1730 0%,#142B53 50%,#1D3F78 100%);visibility:hidden"></div>`);
  const e6logo = add(p6end, `<img class="abs c" src="${BASE}brand/logo.png" style="left:350px;top:400px;width:380px">`);
  const e6wm = row(p6end, 770, `<div class="wm" style="font-size:104px">NaiSibPro</div>`);
  const e6cta = row(p6end, 930, `<div style="font-weight:800;font-size:46px;letter-spacing:2px;color:#E6F4FF;white-space:nowrap" data-fit="640">LIKE · SHARE · FOLLOW</div>`);
  const e6btns = row(p6end, 1030, `<div style="display:flex;gap:14px"><div class="btn b1" style="font-size:30px">${ICO.like(36)}ไลก์</div><div class="btn b2" style="font-size:30px;background:linear-gradient(90deg,#0FA6C4,#22D3EE)">${ICO.share(36)}แชร์</div><div class="btn b3" style="font-size:30px;background:linear-gradient(90deg,#EE7FAA,#F59BC0)">${ICO.bell(36)}ติดตาม</div></div>`, { fit: 640 });
  const e6bye = row(p6end, 1180, `<div class="chip d" style="font-size:32px">แล้วเจอกันคลิปถัดไป!</div>`);
  const e6hand = add(p6end, `<div class="abs" style="left:0;top:0">${NSP.ICON.hand(96)}</div>`);
  const e6conf = NSP.buildConfetti(add(p6end, `<div class="abs" style="inset:0"></div>`), 60, 540, 700);
  [...p6end.querySelectorAll('.conf')].forEach((c, i) => { c.style.background = ['#22D3EE', '#2F6BFF', '#95BFEF', '#FFD23F', '#E6F4FF', '#EE7FAA'][i % 6]; });
  const ENDC = PB.cta - .1;
  mark('endcard', PR + ENDC);
  const BTN_AT = [PB.cta + .1, PB.cta + .75, PB.cta + 1.35];
  sfx('whoosh', PR + PB.who - .05, .6); sfx('pop', PR + PB.who + .1, .8); sfx('ding', PR + PB.kk + .1, .6);
  [0, 1, 2].forEach(i => sfx('msg', PR + PB.who + .6 + i * .5, .7)); sfx('click', PR + PB.comment + .3, .7);
  sfx('swoosh', PR + PB.recall - .1, .6); TYPES.forEach((_, i) => { sfx('pop', PR + PB.recall + .2 + i * .12, .6); sfx('confirm', PR + PB.recall + 1.0 + i * .3, .5); });
  sfx('pop', PR + PB.practice, .7); sfx('riser', PR + PB.brand - .8, .6); sfx('whoosh', PR + PB.brand - .1, .6); sfx('sparkle', PR + PB.brand + .3, .8); sfx('ding', PR + PB.brand + .2, .6);
  sfx('whoosh', PR + PB.bank - .1, .5); for (let i = 0; i < 6; i++) sfx('coin', PR + PB.bank + .2 + i * .15, .4); sfx('pop', PR + PB.weekly, .7);
  sfx('whoosh', PR + ENDC, .7); sfx('ding', PR + ENDC + .3, .8); sfx('sparkle', PR + ENDC + .45, .9); BTN_AT.forEach(a => sfx('click', PR + a + .25, .7)); sfx('pop', PR + PB.bye, .6);
  function drawS6(t) {
    const u = t - PR;
    pop(p6q, u, PB.who, PB.recall - .2, { el: true, d: .7, from: .3 });
    tf(p6cm, life(u, PB.who + .3, PB.recall - .2, { from: .7, dy: 60 }));
    [...p6cm.querySelectorAll('.cm')].forEach((c, i) => { tf(c, life(u, PB.who + .6 + i * .5, 1e9, { from: .4, dy: 30 })); c.querySelector('.lk').style.transform = `scale(${1 + .25 * Math.max(0, Math.sin((u - PB.kk - i * .3) * 4)) * (u > PB.kk ? 1 : 0)})`; });
    tf(p6cbtn, { ...life(u, PB.comment, PB.recall - .2, { from: .3, dy: 30, el: true }), s: (1 + .04 * Math.sin(u * 6)) * life(u, PB.comment, PB.recall - .2, { from: .3, el: true }).s });
    drawHeader(p6rh, u, PB.recall, PB.brand - .2);
    p6ic.forEach((c, i) => { const l = life(u, PB.recall + .2 + i * .12, PB.brand - .2, { from: .3, dy: 50, el: true, d: .7 }); tf(c, { ...l, y: l.y + bob(u, i, 5) }); tf(c.querySelector('.ck'), life(u, PB.recall + 1.0 + i * .3, 1e9, { from: .1, dy: 0, el: true })); });
    pop(p6prac, u, PB.practice, PB.brand - .2, { el: true, d: .7, from: .3 });
    const lg = life(u, PB.brand, PB.bank - .1, { from: .2, dy: 120, el: true, d: 1.0, out: .3 });
    tf(p6logo, { ...lg, y: lg.y + bob(u, 0, 8), r: Math.sin(u * 1.8) * 2 });
    pop(p6wm, u, PB.brand + .4, PB.bank - .1); pop(p6th, u, PB.brand + .8, PB.bank - .1);
    tf(p6poster, { ...life(u, PB.bank, ENDC, { from: .6, dy: 60 }), x: -80, r: -4 + Math.sin(u * 1.4) * 1.5 });
    tf(p6cnt, { ...life(u, PB.bank + .2, ENDC, { from: .4, dy: 30 }), x: 0 });
    p6cnt.querySelector('.cn').textContent = (Math.round(10000 * E.out(P(u, PB.bank + .2, 1.2)) / 100) * 100).toLocaleString('en-US') + '+';
    pop(p6bank, u, PB.bank + .1, ENDC); pop(p6week, u, PB.weekly, ENDC, { el: true, d: .7, from: .3 });
    // end card: LIKE · SHARE · FOLLOW
    const ue = u - ENDC;
    p6end.style.visibility = ue < 0 ? 'hidden' : 'visible';
    p6end.style.clipPath = `circle(${E.out(P(ue, 0, .5)) * 1300}px at 540px 900px)`;
    tf(e6logo, { ...life(ue, .1, 1e9, { from: .2, dy: 0, el: true, d: 1.0 }), y: bob(ue, 0, 8) });
    pop(e6wm, ue, .35); pop(e6cta, ue, .55);
    tf(e6btns, life(ue, .7, 1e9, { from: .5, dy: 40 }));
    ['.b1', '.b2', '.b3'].forEach((s, i) => { const at = BTN_AT[i] - ENDC + .25; const pr = Math.max(0, 1 - Math.abs(ue - at) / .18); e6btns.querySelector(s).style.transform = `scale(${1 - .1 * pr + .06 * Math.max(0, 1 - Math.abs(ue - at - .3) / .3)})`; e6btns.querySelector(s).style.filter = ue > at ? 'brightness(1.12)' : ''; });
    let hx = 0, hy = 0, ho = 0;
    if (ue > .8) { const seg = ue < BTN_AT[1] - ENDC ? 0 : ue < BTN_AT[2] - ENDC ? 1 : 2; const bx = [330, 545, 760][seg]; const k = E.inOut(P(ue, seg ? BTN_AT[seg] - ENDC - .35 : .8, .35)); const px = seg ? [330, 545, 760][seg - 1] : 700; hx = lerp(px, bx, k) - 20; hy = 1080 + 6 * Math.sin(ue * 8); ho = clamp((ue - .8) / .2) * (1 - clamp((ue - (BTN_AT[2] - ENDC + .9)) / .3)); }
    e6hand.style.transform = `translate(${hx}px,${hy}px) scale(${1 - .15 * NSP.pressDepth(ue, BTN_AT.map(a => a - ENDC + .2))})`; e6hand.style.opacity = ho;
    pop(e6bye, ue, PB.bye - ENDC, 1e9, { el: true, d: .7, from: .3 });
    NSP.drawConfetti(e6conf, t, PR + ENDC + .3, 2.8);
  }

  // ---------------------------------------------------------------- start
  const W = [ST0, KN0, EX0, QS, PR];
  NSP.start({
    ep: 'EP.47',
    brand: { showAt: .4 },
    wipes: W,
    scenes: [
      { el: sg, a: 0, b: END + 1, draw: drawGlobal },
      { el: $('s1'), a: 0, b: ST0, draw: drawS1 },
      { el: $('s2'), a: ST0, b: KN0, draw: drawS2 },
      { el: $('s3'), a: KN0, b: EX0, draw: drawS3 },
      { el: $('s4'), a: EX0, b: QS, draw: drawS4 },
      { el: $('s5'), a: QS, b: PR, draw: drawS5 },
      { el: $('s6'), a: PR, b: END + 1, draw: drawS6 },
    ],
  });
  // make sure every Prompt weight is loaded, then shrink any text wider than its box, then draw frame 0
  function fitAll() {
    const sc = [...document.querySelectorAll('.scene')]; const prev = sc.map(s => s.style.display); sc.forEach(s => s.style.display = 'block');
    document.querySelectorAll('[data-fit]').forEach(el => {
      const max = +el.dataset.fit; let fs = parseFloat(getComputedStyle(el).fontSize), g = 0;
      const w = () => Math.max(el.scrollWidth, el.offsetWidth);
      while (w() > max && fs > 14 && g++ < 90) { fs -= 1; el.style.fontSize = fs + 'px'; }
    });
    document.querySelectorAll('[data-fit-row]').forEach(r => {
      const max = +r.dataset.fitRow, el = r.firstElementChild; if (!el) return;
      if (el.offsetWidth > max) el.style.zoom = (max - 4) / el.offsetWidth;   // shrinks nested px-sized chips too
    });
    sc.forEach((s, i) => s.style.display = prev[i]);
  }
  const fontsLoaded = Promise.all([400, 500, 600, 700, 800].map(w => document.fonts.load(`${w} 40px Prompt`, 'กขคง ABC 0123')));
  window.ready = Promise.all([window.ready, fontsLoaded]).then(() => document.fonts.ready).then(() => { fitAll(); window.renderAt(0); return true; });
})();
