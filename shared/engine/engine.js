// NaiSibPro motion engine — shared runtime (extracted from EP.02, used from EP.03 on).
// An episode page loads engine.css + engine.js, builds its scenes with these helpers,
// then calls NSP.start({ scenes, wipes, brand }). Rendering is deterministic: renderAt(t).
(function () {
  const BASE = document.currentScript.src.replace(/engine\/engine\.js.*$/, '');   // .../shared/
  const $ = id => document.getElementById(id);
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const lerp = (a, b, p) => a + (b - a) * p;
  const E = {
    out: p => 1 - Math.pow(1 - p, 3),
    in: p => p * p * p,
    inOut: p => p < .5 ? 4 * p * p * p : 1 - Math.pow(-2 * p + 2, 3) / 2,
    back: p => { const c1 = 1.70158, c3 = c1 + 1; return 1 + c3 * Math.pow(p - 1, 3) + c1 * Math.pow(p - 1, 2); },
    elastic: p => p <= 0 ? 0 : p >= 1 ? 1 : Math.pow(2, -10 * p) * Math.sin((p * 10 - .75) * (2 * Math.PI) / 3) + 1,
  };
  const P = (t, a, d) => clamp((t - a) / d);
  function tf(el, { x = 0, y = 0, s = 1, r = 0, o = 1, sx, sy, ry = 0, rx = 0 } = {}) {
    el.style.transform = `translate(${x}px,${y}px) rotate(${r}deg)${ry || rx ? ` perspective(1200px) rotateY(${ry}deg) rotateX(${rx}deg)` : ''} scale(${sx ?? s},${sy ?? s})`;
    el.style.opacity = o;
    el.style.visibility = o <= 0.001 ? 'hidden' : 'visible';
  }
  // element life: pops in at a, leaves at b
  function life(t, a, b = 1e9, { d = .55, from = .4, dy = 50, out = .3, el = false } = {}) {
    const pi = P(t, a, d), po = P(t, b, out);
    const e = el ? E.elastic(pi) : E.back(pi);
    return { s: lerp(from, 1, e) * (1 - .12 * E.out(po)), o: clamp(pi * 2.5) * (1 - po), y: (1 - E.out(pi)) * dy - 30 * E.out(po) };
  }
  const bob = (t, ph = 0, a = 8, f = 1.6) => Math.sin(t * f + ph) * a;
  let seed = 12345;
  const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  function pressDepth(t, times) {
    let d = 0;
    for (const at of times) {
      const u = t - at;
      if (u >= 0 && u < .6) d = Math.max(d, u < .07 ? u / .07 : u < .32 ? 1 : 1 - (u - .32) / .28);
    }
    return d;
  }
  function h(html) { const d = document.createElement('div'); d.innerHTML = html.trim(); return d.firstChild; }

  const ICON = {
    check: (c = '#fff', s = 40) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11" fill="none" stroke="${c}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cross: (c = '#fff', s = 40) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/></svg>`,
    le: (c = '#31445D', s = 60) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M18 4L6 9.5 18 15M6 20h12" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    star: c => `<svg width="40" height="40" viewBox="0 0 40 40"><path d="M20 0C21 13 27 19 40 20C27 21 21 27 20 40C19 27 13 21 0 20C13 19 19 13 20 0Z" fill="${c}"/></svg>`,
    heart: c => `<svg width="40" height="40" viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="${c}"/></svg>`,
    hand: s => `<svg width="${s}" height="${s}" viewBox="0 0 64 64"><path d="M24 8a5 5 0 0 1 10 0v20l4-1a5 5 0 0 1 4 1l6 2a6 6 0 0 1 4 6l-2 14a10 10 0 0 1-10 9H30a10 10 0 0 1-8-4L10 38a5 5 0 0 1 7-7l7 6z" fill="#fff" stroke="#31445D" stroke-width="3.5" stroke-linejoin="round"/></svg>`,
    funnel: (c = '#5E8FD6', s = 44) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3 4h18l-7 8.5V19l-4 2v-8.5z" fill="${c}"/></svg>`,
    timer: (s, c = '#EE7FAA') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="13.5" r="8" fill="none" stroke="${c}" stroke-width="2.6"/><path d="M12 9v5l3 2M9 2.5h6" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    ai: (s, c = '#EE7FAA') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="14" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/><text x="12" y="15.6" font-size="8" font-weight="800" text-anchor="middle" fill="${c}" font-family="Prompt">AI</text><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`,
    book: (s, c = '#EE7FAA') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z" fill="none" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"/><path d="M12 6v14" stroke="${c}" stroke-width="2.2"/></svg>`,
    docs: (s, c = '#EE7FAA') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="6" y="3" width="13" height="16" rx="2.5" fill="#FBD3E5"/><rect x="4" y="5.5" width="13" height="16" rx="2.5" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M7.5 10h6M7.5 13.5h6M7.5 17h4" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`,
    cal: (s, c = '#EE7FAA') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M3 10h18M8 3v4M16 3v4" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><path d="M8.5 15l2.2 2.2 4.5-4.5" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    pkg: (s, c = '#EE7FAA') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2l9 5v10l-9 5-9-5V7z" fill="none" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"/><path d="M3 7l9 5 9-5M12 12v10" stroke="${c}" stroke-width="2.2"/></svg>`,
    link: (s, c = '#EE7FAA') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1.2 1.2M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1.2-1.2" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    shield: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="#5E8FD6"/><path d="M12 7l1.5 3 3.3.4-2.4 2.3.6 3.3L12 14.4 9 16l.6-3.3-2.4-2.3 3.3-.4z" fill="#fff"/></svg>`,
  };

  // ---------- SFX / markers registry (exported to the mixer) ----------
  window.SFX = []; window.MARKS = {};
  const sfx = (type, at, gain = 1) => window.SFX.push({ type, t: +at.toFixed(4), gain });
  const mark = (name, at) => { window.MARKS[name] = at; };

  // ---------- stage scaffolding ----------
  const stage = $('stage');
  stage.insertAdjacentHTML('afterbegin', `<div id="bg"><div class="blob"></div><div class="blob"></div><div class="blob"></div><div class="blob"></div><div class="grid-dots"></div><div id="particles"></div></div>`);
  stage.insertAdjacentHTML('beforeend', `
    <div id="brand"><img src="${BASE}brand/logo.png"><div><div class="bn">NaiSibPro</div><div class="ep" id="brand-ep"></div></div></div>
    <div id="wipe">
      <div class="band" style="left:0;width:180px;background:#B8D9F8"></div>
      <div class="band" style="left:180px;width:110px;background:#F5A9C7"></div>
      <div class="band" style="left:290px;width:1220px;background:linear-gradient(180deg,#FFF0F7,#EAF3FE)"></div>
      <div class="band" style="left:1510px;width:110px;background:#F5A9C7"></div>
      <div class="band" style="left:1620px;width:180px;background:#B8D9F8"></div>
      <img id="wipe-logo" src="${BASE}brand/logo.png">
    </div>`);
  const blobs = [
    { c: 'rgba(245,169,199,.55)', r: 520, x: 120, y: 260 }, { c: 'rgba(149,191,239,.55)', r: 600, x: 900, y: 700 },
    { c: 'rgba(248,207,226,.7)', r: 480, x: 200, y: 1500 }, { c: 'rgba(184,217,248,.6)', r: 520, x: 980, y: 1750 },
  ];
  [...document.querySelectorAll('#bg .blob')].forEach((el, i) => { const b = blobs[i]; b.el = el; el.style.width = el.style.height = b.r * 2 + 'px'; el.style.background = `radial-gradient(circle, ${b.c} 0%, rgba(255,255,255,0) 68%)`; });
  const particles = [];
  {
    const box = $('particles'), kinds = ['dot', 'star', 'heart', 'ring', 'plus'], cols = ['#F5A9C7', '#95BFEF', '#FFFFFF', '#F8CFE2', '#B8D9F8'];
    for (let i = 0; i < 34; i++) {
      const k = kinds[Math.floor(rnd() * kinds.length)], c = cols[Math.floor(rnd() * cols.length)];
      let html;
      if (k === 'dot') { const s = 10 + rnd() * 18; html = `<div style="width:${s}px;height:${s}px;border-radius:50%;background:${c};box-shadow:0 0 12px ${c}"></div>`; }
      else if (k === 'star') html = ICON.star(c);
      else if (k === 'heart') html = ICON.heart(c);
      else if (k === 'ring') { const s = 22 + rnd() * 20; html = `<div style="width:${s}px;height:${s}px;border-radius:50%;border:5px solid ${c}"></div>`; }
      else html = `<div style="font-weight:800;font-size:40px;color:${c};line-height:1">+</div>`;
      const el = h(`<div class="pt">${html}</div>`); box.appendChild(el);
      particles.push({ el, x: rnd() * 1080, y: rnd() * 1920, sp: 18 + rnd() * 40, ph: rnd() * 6.28, sc: .6 + rnd() * .7, rot: (rnd() - .5) * 60 });
    }
  }
  function drawBg(t) {
    blobs.forEach((b, i) => tf(b.el, { x: b.x - b.r + Math.sin(t * .25 + i * 1.7) * 90, y: b.y - b.r + Math.cos(t * .21 + i) * 80, s: 1 + .08 * Math.sin(t * .4 + i) }));
    particles.forEach(p => {
      let y = (p.y - t * p.sp) % 2000; if (y < -80) y += 2000;
      tf(p.el, { x: p.x + Math.sin(t * .8 + p.ph) * 26, y, r: p.rot + t * 12, s: p.sc * (0.85 + .15 * Math.sin(t * 2 + p.ph)), o: .55 + .35 * Math.sin(t * 1.3 + p.ph) });
    });
  }

  // ---------- confetti ----------
  function buildConfetti(container, n, cx, cy) {
    const cols = ['#EE7FAA', '#95BFEF', '#26A269', '#FFD36E', '#F5A9C7', '#9C8FE6'];
    const arr = [];
    for (let i = 0; i < n; i++) {
      const el = h(`<div class="conf" style="background:${cols[i % cols.length]}"></div>`);
      if (i % 3 === 0) { el.style.borderRadius = '50%'; el.style.width = el.style.height = '20px'; }
      container.appendChild(el);
      const a = rnd() * Math.PI * 2, v = 500 + rnd() * 900;
      arr.push({ el, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 700, r: rnd() * 720, cx, cy });
    }
    return arr;
  }
  function drawConfetti(arr, t, at, dur = 2.4) {
    const u = t - at;
    arr.forEach(c => {
      if (u < 0 || u > dur) { c.el.style.opacity = 0; c.el.style.visibility = 'hidden'; return; }
      tf(c.el, { x: c.cx + c.vx * u * .55, y: c.cy + c.vy * u * .55 + 900 * u * u, r: c.r * u, o: clamp(1 - (u - dur * .6) / (dur * .4)) });
    });
  }

  // ---------- quiz cards + countdown (EP.02 component, parameterised) ----------
  function buildQuizOptions(container, opts, { top = 700, gap = 140 } = {}) {
    return opts.map(([b, tx], i) => {
      const el = h(`<div class="opt c" style="top:${top + i * gap}px"><div class="ov"></div><div class="b">${b}</div><div class="tx">${tx}</div><div class="chk">${ICON.check('#26A269', 58)}</div></div>`);
      container.appendChild(el);
      return { el, ov: el.querySelector('.ov'), b: el.querySelector('.b'), tx: el.querySelector('.tx'), chk: el.querySelector('.chk') };
    });
  }
  // u: quiz-local time, ua: answer-local time (negative before the reveal)
  function drawQuizOptions(qOpts, u, ua, optAt, correct, { shiftY = 0, enterX = 300 } = {}) {   // enterX: slide-in distance (EP.33 uses a small one to stay in its safe column)
    const revealed = ua >= 0;
    qOpts.forEach((o, i) => {
      const l = life(u, optAt[i], 1e9, { from: .4, dy: 0, d: .55 });
      const x = (1 - E.out(P(u, optAt[i], .55))) * (i % 2 ? enterX : -enterX);
      if (revealed && i === correct) {
        const rp = E.back(P(ua, 0, .5));
        o.ov.style.opacity = clamp(ua / .25);
        o.tx.style.color = '#fff';
        o.b.style.background = 'radial-gradient(circle at 35% 30%,#9CF2C6,#1C8A55 75%)';
        o.b.style.boxShadow = '0 0 0 8px #fff,0 0 0 11px rgba(255,255,255,.6)';
        tf(o.chk, { s: lerp(0, 1, E.elastic(P(ua, .1, .8))), o: clamp(ua / .1), r: (1 - E.out(P(ua, .1, .6))) * -90 });
        o.el.style.boxShadow = `0 12px 0 #1C8A55, 0 0 0 6px rgba(255,255,255,.9), 0 0 ${46 + 16 * Math.sin(ua * 3)}px ${12 + 5 * Math.sin(ua * 3)}px rgba(95,220,155,.55)`;
        tf(o.el, { ...l, x, y: shiftY, s: l.s * (1 + .05 * rp - .05 * P(ua, .5, .4)) * (1 + .012 * Math.sin(ua * 3.4)) });
        o.el.style.filter = '';
      } else {
        o.ov.style.opacity = 0; o.tx.style.color = ''; o.b.style.background = ''; o.b.style.boxShadow = ''; o.el.style.boxShadow = '';
        tf(o.chk, { o: 0 });
        const dim = revealed ? .42 * E.out(P(ua, 0, .45)) : 0;
        tf(o.el, { ...l, x, y: shiftY, o: l.o * (1 - dim), s: l.s * (1 - .05 * dim / .42) });
        o.el.style.filter = revealed ? `grayscale(${dim * 1.6})` : '';
      }
    });
  }
  function buildCountdown(el, size = 360) {
    const r = size * .375, C = 2 * Math.PI * r, c = size / 2;
    el.style.width = el.style.height = size + 'px';
    el.innerHTML = `<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;inset:0">
      <defs><linearGradient id="cdg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EE7FAA"/><stop offset="1" stop-color="#6F9FE0"/></linearGradient></defs>
      <circle cx="${c}" cy="${c}" r="${size * .43}" fill="#fff"/>
      <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#F1E6F3" stroke-width="${size * .065}"/>
      <circle class="cd-ring" cx="${c}" cy="${c}" r="${r}" fill="none" stroke="url(#cdg)" stroke-width="${size * .065}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0" transform="rotate(-90 ${c} ${c})"/>
      <circle class="cd-dot" cx="${c}" cy="${c - r}" r="${size * .05}" fill="#fff" stroke="#EE7FAA" stroke-width="${size * .02}"/></svg>
      <div class="cd-num" style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:${size * .45}px;color:var(--navy);line-height:1;padding-top:${size * .035}px"></div>`;
    return { el, ring: el.querySelector('.cd-ring'), dot: el.querySelector('.cd-dot'), num: el.querySelector('.cd-num'), r, C, c };
  }
  // uc: countdown-local time; dur seconds. Colour stays neutral (no hint at the answer).
  function drawCountdown(cd, uc, dur = 5) {
    const l = life(uc, 0, dur, { from: .3, dy: 40, d: .45, out: .25 });
    const fr = uc - Math.floor(uc);
    tf(cd.el, { ...l, s: l.s * (1 + .05 * Math.max(0, 1 - fr / .25) * (uc >= 0 && uc < dur ? 1 : 0)) });
    if (uc < 0 || uc >= dur + .3) return;
    const n = Math.min(dur, Math.max(1, dur - Math.floor(uc)));
    cd.num.textContent = n;
    cd.num.style.transform = `scale(${lerp(1.45, 1, E.back(clamp(fr / .35)))})`;
    const prog = clamp(uc / dur);
    cd.ring.setAttribute('stroke-dashoffset', cd.C * prog);
    const ang = -Math.PI / 2 + (1 - prog) * Math.PI * 2;
    cd.dot.setAttribute('cx', cd.c + cd.r * Math.cos(ang)); cd.dot.setAttribute('cy', cd.c + cd.r * Math.sin(ang));
  }

  // ---------- '+' glyph fix (Prompt's plus is tiny) ----------
  function fixPlus(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const hits = []; let n;
    while ((n = w.nextNode())) if (n.nodeValue.includes('+') && !n.parentElement.closest('svg')) hits.push(n);
    hits.forEach(n => { const sp = document.createElement('span'); sp.innerHTML = n.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\s?\+\s?/g, '<i class="pl"></i>'); n.replaceWith(sp); });
  }

  // ---------- master loop ----------
  function start({ scenes, wipes = [], brand = {}, ep = '' }) {
    $('brand-ep').textContent = ep;
    fixPlus(stage);
    wipes.forEach(b => sfx('swoosh', b - .35, .8));
    const WIPE_D = .9, T = window.TL;
    window.renderAt = function (t) {
      drawBg(t);
      scenes.forEach(sc => {
        const on = t >= sc.a && t < sc.b;
        sc.el.style.display = on ? 'block' : 'none';
        if (on) { const len = Math.min(sc.b, T.end) - sc.a; sc.el.style.transform = `scale(${1 + .025 * clamp((t - sc.a) / len)})`; sc.draw(t); }
      });
      const bo = clamp((t - (brand.showAt ?? 1.2)) / .5) * (1 - clamp((t - (brand.hideAt ?? 1e9)) / .3));
      tf($('brand'), { o: bo, s: lerp(.6, 1, E.back(clamp((t - (brand.showAt ?? 1.2)) / .6))) });
      let wp = -1;
      wipes.forEach(b => { if (t > b - WIPE_D / 2 && t < b + WIPE_D / 2) wp = (t - (b - WIPE_D / 2)) / WIPE_D; });
      const w = $('wipe');
      if (wp < 0) w.style.visibility = 'hidden';
      else {
        w.style.visibility = 'visible';
        w.style.transform = `translateX(${lerp(1200, -2100, E.inOut(wp))}px) skewX(-10deg)`;
        $('wipe-logo').style.transform = `skewX(10deg) rotate(${(wp - .5) * 40}deg) scale(${.8 + .2 * Math.sin(wp * Math.PI)})`;
      }
    };
    window.ready = document.fonts.ready
      .then(() => Promise.all([...document.images].map(i => i.complete ? 1 : new Promise(r => { i.onload = i.onerror = r; }))))
      .then(() => { window.renderAt(0); return true; });
  }

  window.NSP = { BASE, $, clamp, lerp, E, P, tf, life, bob, rnd, pressDepth, h, ICON, sfx, mark, buildConfetti, drawConfetti, buildQuizOptions, drawQuizOptions, buildCountdown, drawCountdown, start };
})();
