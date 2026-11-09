// EP47 environment library — five animated computing environments + a modern server room.
// Each environment is a 1080 × 1920 "world" (SVG background + live canvases + SVG foreground)
// rendered deterministically from local time u. ENV.view() puts one inside a clipping frame with
// a camera (centre cx,cy in world px, zoom z), so the same environment can be full-screen, split
// screen, or a thumbnail card. Blue-dominant palette; no real brands, logos or performance figures.
(function () {
  const { h, clamp, lerp, E, P } = window.NSP;
  let uid = 0;
  const TAU = Math.PI * 2;
  const mkRnd = seed => { let s = seed; return () => (s = (s * 16807) % 2147483647) / 2147483647; };
  const frac = x => x - Math.floor(x);
  const C = { navy: '#142B53', navy2: '#0E2041', navy3: '#0A1830', blue: '#2F6BFF', cyan: '#22D3EE', light: '#95BFEF', ice: '#E6F4FF', pink: '#EE7FAA', yellow: '#FFD23F', green: '#22C55E', red: '#EF4444', text: '#31445D' };
  const svgEl = (w, hh, inner, style = '') => `<svg width="${w}" height="${hh}" viewBox="0 0 ${w} ${hh}" style="position:absolute;left:0;top:0;overflow:visible;${style}">${inner}</svg>`;
  // big fills so any camera position stays covered
  const BIG = (y0, y1, fill) => `<rect x="-1400" y="${y0}" width="3880" height="${y1 - y0}" fill="${fill}"/>`;

  // ------------------------------------------------------------------ icons (category badges + jobs)
  const ICO = {
    micro: (s = 120, c = '#E6F4FF', a = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><rect x="6" y="16" width="62" height="42" rx="5" fill="none" stroke="${c}" stroke-width="5"/><rect x="13" y="23" width="48" height="28" rx="2" fill="${a}" opacity=".35"/><path d="M37 58v10M24 72h26" stroke="${c}" stroke-width="5" stroke-linecap="round"/><path d="M62 46h26v24H62z" fill="#142B53" stroke="${c}" stroke-width="4.5" stroke-linejoin="round"/><path d="M56 76h38l-4 6H60z" fill="${c}"/><rect x="66" y="50" width="18" height="16" rx="1.5" fill="${a}" opacity=".45"/></svg>`,
    ws: (s = 120, c = '#E6F4FF', a = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><rect x="4" y="18" width="44" height="32" rx="4" fill="none" stroke="${c}" stroke-width="4.5"/><rect x="52" y="18" width="34" height="32" rx="4" fill="none" stroke="${c}" stroke-width="4.5"/><path d="M26 25l9 5v10l-9 5-9-5V30z M26 35l9-5 M26 35v10 M26 35l-9-5" fill="none" stroke="${a}" stroke-width="2.6" stroke-linejoin="round"/><path d="M58 28h22M58 35h16M58 42h20" stroke="${a}" stroke-width="2.6" stroke-linecap="round" opacity=".8"/><path d="M26 50v8M66 50v8M14 62h60" stroke="${c}" stroke-width="4.5" stroke-linecap="round"/><rect x="78" y="56" width="18" height="34" rx="3" fill="none" stroke="${c}" stroke-width="4.5"/><circle cx="87" cy="66" r="3" fill="${a}"/><path d="M82 76h10M82 82h10" stroke="${c}" stroke-width="2.4"/></svg>`,
    mini: (s = 120, c = '#E6F4FF', a = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><rect x="30" y="6" width="40" height="86" rx="4" fill="none" stroke="${c}" stroke-width="4.5"/><circle cx="41" cy="22" r="7" fill="none" stroke="${a}" stroke-width="3"/><circle cx="59" cy="22" r="7" fill="none" stroke="${a}" stroke-width="3"/><path d="M36 40h28M36 48h28" stroke="${c}" stroke-width="2.5"/><g fill="${a}"><circle cx="38" cy="58" r="2.4"/><circle cx="46" cy="58" r="2.4"/><circle cx="54" cy="58" r="2.4"/><circle cx="62" cy="58" r="2.4"/></g><rect x="2" y="56" width="22" height="18" rx="2" fill="none" stroke="${c}" stroke-width="3.5"/><rect x="76" y="56" width="22" height="18" rx="2" fill="none" stroke="${c}" stroke-width="3.5"/><path d="M24 70q4 12 6 12M76 70q-4 12-6 12" fill="none" stroke="${a}" stroke-width="2.5" stroke-dasharray="3 3"/></svg>`,
    mf: (s = 120, c = '#E6F4FF', a = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><rect x="10" y="12" width="36" height="78" rx="4" fill="none" stroke="${c}" stroke-width="4.5"/><rect x="54" y="12" width="36" height="78" rx="4" fill="none" stroke="${c}" stroke-width="4.5"/><path d="M28 20v62M72 20v62" stroke="${a}" stroke-width="4" stroke-linecap="round"/><path d="M16 28h6M16 36h6M16 44h6M78 28h6M78 36h6M78 44h6" stroke="${c}" stroke-width="2.5"/><path d="M50 2l9 4v6c0 6-4 9-9 11-5-2-9-5-9-11V6z" fill="${a}"/></svg>`,
    sc: (s = 120, c = '#E6F4FF', a = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><path d="M4 30l20-8v70L4 86z M30 20l20-6v84l-20-4z M56 14l20 6v76l-20 4z M82 22l14 6v58l-14 6z" fill="none" stroke="${c}" stroke-width="3.6" stroke-linejoin="round"/><g fill="${a}">${[0, 1, 2, 3, 4, 5].map(i => `<rect x="10" y="${34 + i * 8}" width="8" height="3"/><rect x="36" y="${28 + i * 10}" width="8" height="3"/><rect x="62" y="${28 + i * 10}" width="8" height="3"/><rect x="86" y="${34 + i * 8}" width="6" height="3"/>`).join('')}</g><path d="M38 8a10 6 0 0 1 24 0" fill="none" stroke="${a}" stroke-width="3" stroke-linecap="round"/></svg>`,
    doc: (s = 80, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6 2h9l5 5v15H6z" fill="#fff" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><path d="M15 2v5h5" fill="none" stroke="${c}" stroke-width="1.8"/><path d="M9 12h8M9 15h8M9 18h5" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    cube: (s = 80, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2l9 5v10l-9 5-9-5V7z" fill="#E6F4FF" stroke="${c}" stroke-width="1.8" stroke-linejoin="round"/><path d="M3 7l9 5 9-5M12 12v10" fill="none" stroke="${c}" stroke-width="1.6"/></svg>`,
    users: (s = 80, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="8" cy="8" r="3.2" fill="${c}"/><circle cx="16.5" cy="8.5" r="2.8" fill="${c}" opacity=".7"/><path d="M2 20c0-4 3-6.5 6-6.5s6 2.5 6 6.5z" fill="${c}"/><path d="M13 20c.2-3.5 2-5.6 3.6-5.6 2.4 0 5.4 1.8 5.4 5.6z" fill="${c}" opacity=".7"/></svg>`,
    bank: (s = 80, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2l10 5H2z" fill="${c}"/><path d="M4 9h16" stroke="${c}" stroke-width="1.6"/><path d="M5.5 10.5v7M9.8 10.5v7M14.2 10.5v7M18.5 10.5v7" stroke="${c}" stroke-width="2.2"/><rect x="2.5" y="18.5" width="19" height="3" rx="1" fill="${c}"/></svg>`,
    storm: (s = 80, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6.5 15a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 17.6 7.5 3.8 3.8 0 0 1 17.5 15z" fill="${c}"/><path d="M12 13l-2.5 4.5h3L11 22" fill="none" stroke="#FFD23F" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    atm: (s = 60, c = '#95BFEF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="4" y="2" width="16" height="20" rx="2" fill="none" stroke="${c}" stroke-width="1.8"/><rect x="7" y="5" width="10" height="6" rx="1" fill="${c}" opacity=".6"/><path d="M8 15h8M8 18h5" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    phone: (s = 60, c = '#95BFEF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="2.5" fill="none" stroke="${c}" stroke-width="1.8"/><rect x="8" y="5" width="8" height="11" rx="1" fill="${c}" opacity=".6"/><circle cx="12" cy="19" r="1.1" fill="${c}"/></svg>`,
    card: (s = 60, c = '#95BFEF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="2" y="5" width="20" height="14" rx="2.5" fill="none" stroke="${c}" stroke-width="1.8"/><path d="M2 9.5h20" stroke="${c}" stroke-width="2.4"/><path d="M5.5 15h5" stroke="${c}" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    shield: (s = 60, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="${c}"/><path d="M8.5 12l2.5 2.5 4.5-5" fill="none" stroke="#fff" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    lock: (s = 60, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="5" y="10" width="14" height="11" rx="2" fill="${c}"/><path d="M8 10V7a4 4 0 0 1 8 0v3" fill="none" stroke="${c}" stroke-width="2.2"/><circle cx="12" cy="15.5" r="1.6" fill="#fff"/></svg>`,
    server: (s = 80, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24">${[3, 9.5, 16].map(y => `<rect x="3" y="${y}" width="18" height="5" rx="1.4" fill="none" stroke="${c}" stroke-width="1.7"/><circle cx="6.5" cy="${y + 2.5}" r="1" fill="#22D3EE"/><path d="M10 ${y + 2.5}h8" stroke="${c}" stroke-width="1.4"/>`).join('')}</svg>`,
    cloud: (s = 80, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6.5 19a4.5 4.5 0 0 1-.4-9A6 6 0 0 1 17.6 11.5 3.8 3.8 0 0 1 17.5 19z" fill="${c}"/></svg>`,
    atom: (s = 60, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="${c}" stroke-width="1.6"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="${c}" stroke-width="1.6" transform="rotate(60 12 12)"/><ellipse cx="12" cy="12" rx="10" ry="4" fill="none" stroke="${c}" stroke-width="1.6" transform="rotate(-60 12 12)"/><circle cx="12" cy="12" r="2" fill="${c}"/></svg>`,
    ruler: (s = 60, c = '#95BFEF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="2" y="8" width="20" height="8" rx="1.5" fill="none" stroke="${c}" stroke-width="1.8"/><path d="M6 8v3M10 8v4M14 8v3M18 8v4" stroke="${c}" stroke-width="1.6"/></svg>`,
    gear: (s = 60, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.5 2l-2-.4a6.8 6.8 0 0 0-.8-1.9l1.2-1.7-1.4-1.4-1.7 1.2a6.8 6.8 0 0 0-1.9-.8L13.5 3.5h-2l-.4 2a6.8 6.8 0 0 0-1.9.8L7.5 5.1 6.1 6.5l1.2 1.7a6.8 6.8 0 0 0-.8 1.9l-2 .4v2l2 .4c.2.7.4 1.3.8 1.9l-1.2 1.7 1.4 1.4 1.7-1.2c.6.4 1.2.6 1.9.8l.4 2h2l.4-2c.7-.2 1.3-.4 1.9-.8l1.7 1.2 1.4-1.4-1.2-1.7c.4-.6.6-1.2.8-1.9l2-.4z" fill="${c}"/></svg>`,
    check: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    arrow: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="flex:none"><path d="M3 12h16M13 6l6 6-6 6" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    neq: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="flex:none"><path d="M5 9h14M5 15h14M16 4L8 20" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/></svg>`,
    globe: (s = 60, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="none" stroke="${c}" stroke-width="1.8"/><path d="M2.5 12h19M12 2.5c3 3 3 16 0 19M12 2.5c-3 3-3 16 0 19" fill="none" stroke="${c}" stroke-width="1.6"/></svg>`,
    comment: (s = 60, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="${c}"/><path d="M7 9h10M7 12.5h7" stroke="#fff" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    like: (s = 60, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M2 10h4v11H2zM8 21h9.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 19 10h-5l.8-4.2A2 2 0 0 0 12.8 3.5L8 10z" fill="${c}"/></svg>`,
    share: (s = 60, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M14 4l8 7-8 7v-4.2C8 13.8 4.5 16 2 20c.8-6.2 4.5-11 12-11.8z" fill="${c}"/></svg>`,
    bell: (s = 60, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2.5a6 6 0 0 0-6 6v4.5L4 16.5h16L18 13V8.5a6 6 0 0 0-6-6z" fill="${c}"/><path d="M9.5 19a2.5 2.5 0 0 0 5 0z" fill="${c}"/></svg>`,
  };

  // ------------------------------------------------------------------ people (seen from behind)
  // origin = shoulder line centre; head above, chair back below. Arms reach forward/up to a desk.
  function personBack({ hair = '#1B2440', style = 'short', shirt = '#2F6BFF', shirtD = '#2152C8', skin = '#E7B791', phones = false, coat = false, chair = '#1C3260', standing = false } = {}) {
    const top = coat ? '#F4F8FF' : shirt, topD = coat ? '#C9D8EE' : shirtD;
    const hairBack = style === 'long' ? `<path d="M-52 -150 C-60 -90 -58 -40 -46 -10 L46 -10 C58 -40 60 -90 52 -150Z" fill="${hair}"/>` : '';
    const hairTop = {
      short: `<path d="M-50 -152 C-52 -212 52 -212 50 -152 C50 -132 44 -122 40 -118 L-40 -118 C-44 -122 -50 -132 -50 -152Z" fill="${hair}"/>`,
      long: `<path d="M-51 -152 C-54 -214 54 -214 51 -152 C50 -126 46 -112 42 -100 L-42 -100 C-46 -112 -50 -126 -51 -152Z" fill="${hair}"/>`,
      bun: `<circle cx="0" cy="-214" r="22" fill="${hair}"/><path d="M-50 -152 C-52 -212 52 -212 50 -152 C50 -132 44 -124 40 -120 L-40 -120 C-44 -124 -50 -132 -50 -152Z" fill="${hair}"/>`,
      curly: `<g fill="${hair}">${[-40, -20, 0, 20, 40].map((x, i) => `<circle cx="${x}" cy="${-190 + (i % 2) * 8}" r="24"/>`).join('')}<path d="M-52 -170 C-52 -130 -44 -120 -40 -118 L40 -118 C44 -120 52 -130 52 -170Z"/></g>`,
    }[style];
    const ph = phones ? `<path d="M-56 -150 C-58 -226 58 -226 56 -150" fill="none" stroke="#0E1D38" stroke-width="10" stroke-linecap="round"/><rect x="-68" y="-168" width="22" height="44" rx="10" fill="#0E1D38"/><rect x="46" y="-168" width="22" height="44" rx="10" fill="#0E1D38"/><rect x="-66" y="-160" width="6" height="28" rx="3" fill="#22D3EE"/><rect x="60" y="-160" width="6" height="28" rx="3" fill="#22D3EE"/>` : '';
    const coatLines = coat ? `<path d="M0 -96 L0 60" stroke="#C9D8EE" stroke-width="4"/><path d="M-30 -100 L0 -70 L30 -100" fill="none" stroke="#C9D8EE" stroke-width="5"/>` : '';
    const chairBack = standing ? '' : `<rect x="-86" y="10" width="172" height="150" rx="34" fill="${chair}"/><rect x="-70" y="24" width="140" height="10" rx="5" fill="rgba(255,255,255,.12)"/><rect x="-12" y="160" width="24" height="70" fill="#0E1D38"/>`;
    return `<g class="pb">
      ${hairBack}
      <path class="armL" d="" fill="none" stroke="${topD}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      <path class="armR" d="" fill="none" stroke="${topD}" stroke-width="30" stroke-linecap="round" stroke-linejoin="round"/>
      <circle class="handL" r="15" fill="${skin}"/><circle class="handR" r="15" fill="${skin}"/>
      <path d="M-100 -60 C-100 -100 -70 -110 -40 -112 L40 -112 C70 -110 100 -100 100 -60 L112 ${standing ? 240 : 120} L-112 ${standing ? 240 : 120}Z" fill="${top}"/>
      <path d="M-100 -60 C-100 -100 -70 -110 -40 -112 L-20 -112 C-50 -100 -70 -80 -76 -40 L-90 ${standing ? 240 : 120} L-112 ${standing ? 240 : 120}Z" fill="${topD}" opacity=".55"/>
      ${coatLines}
      <rect x="-20" y="-130" width="40" height="26" rx="8" fill="${skin}"/>
      <circle cx="-48" cy="-152" r="11" fill="${skin}"/><circle cx="48" cy="-152" r="11" fill="${skin}"/>
      <circle cx="0" cy="-158" r="50" fill="${skin}"/>
      ${hairTop}${ph}
      ${chairBack}
    </g>`;
  }
  // arms: shoulders (±82,-80) → elbows → hands at (hx, hy) targets (local), with typing jitter
  function poseArms(g, { lx = -70, ly = -40, rx = 70, ry = -40, t = 0, type = 0, seed = 0 } = {}) {
    const j = k => type * Math.max(0, Math.sin(t * 17 + k * 2.1 + seed)) * 7;
    const L = [lx, ly - j(0)], R = [rx, ry - j(1)];
    const eL = [lx < -100 ? -150 : -128, ly > 0 ? 40 : -6], eR = [rx > 100 ? 150 : 128, ry > 0 ? 40 : -6];
    g.querySelector('.armL').setAttribute('d', `M-82 -82 Q${eL[0]} ${eL[1]} ${L[0]} ${L[1]}`);
    g.querySelector('.armR').setAttribute('d', `M82 -82 Q${eR[0]} ${eR[1]} ${R[0]} ${R[1]}`);
    const hl = g.querySelector('.handL'), hr = g.querySelector('.handR');
    hl.setAttribute('cx', L[0]); hl.setAttribute('cy', L[1]); hr.setAttribute('cx', R[0]); hr.setAttribute('cy', R[1]);
  }

  // ------------------------------------------------------------------ 3D gear (CAD model) on canvas
  function gearMesh(N = 14) {
    const rO = 1, rI = .8, rH = .34, d = .38, pts = [], hole = [];
    for (let i = 0; i < N; i++) {
      const a0 = i / N * TAU, st = TAU / N;
      [[rI, 0], [rO, .2], [rO, .44], [rI, .64]].forEach(([r, f]) => { const a = a0 + f * st; pts.push([r * Math.cos(a), r * Math.sin(a)]); hole.push([rH * Math.cos(a), rH * Math.sin(a)]); });
    }
    const n = pts.length, F = [], V = (p, z) => [p[0], p[1], z];
    for (let i = 0; i < n; i++) {
      const j = (i + 1) % n;
      F.push({ v: [V(pts[i], d / 2), V(pts[j], d / 2), V(hole[j], d / 2), V(hole[i], d / 2)], k: 'cap' });
      F.push({ v: [V(pts[j], -d / 2), V(pts[i], -d / 2), V(hole[i], -d / 2), V(hole[j], -d / 2)], k: 'cap' });
      F.push({ v: [V(pts[j], d / 2), V(pts[i], d / 2), V(pts[i], -d / 2), V(pts[j], -d / 2)], k: 'side' });
      F.push({ v: [V(hole[i], d / 2), V(hole[j], d / 2), V(hole[j], -d / 2), V(hole[i], -d / 2)], k: 'hole' });
    }
    // spokes (simple boxes) for a more "engineered" look
    for (let s = 0; s < 4; s++) {
      const a = s / 4 * TAU + .3, ca = Math.cos(a), sa = Math.sin(a), w = .07, z = d * .32;
      const p = (r, o) => [r * ca - o * sa, r * sa + o * ca];
      const q = [p(rH, -w), p(rI - .02, -w), p(rI - .02, w), p(rH, w)];
      F.push({ v: q.map(x => V(x, z)), k: 'spoke' }); F.push({ v: q.slice().reverse().map(x => V(x, -z)), k: 'spoke' });
      F.push({ v: [V(q[1], z), V(q[0], z), V(q[0], -z), V(q[1], -z)], k: 'spoke' }); F.push({ v: [V(q[3], z), V(q[2], z), V(q[2], -z), V(q[3], -z)], k: 'spoke' });
    }
    return F;
  }
  const GEAR = gearMesh();
  function drawModel(ctx, W, Hh, ang, wire, { tilt = -.22, scale = .34, sweep = null, grid = true } = {}) {
    ctx.clearRect(0, 0, W, Hh);
    const cx = W / 2, cy = Hh * .52, S = Math.min(W, Hh) * scale;
    if (grid) {   // viewport floor grid
      ctx.save(); ctx.strokeStyle = 'rgba(149,191,239,.22)'; ctx.lineWidth = W / 500;
      for (let i = -6; i <= 6; i++) {
        const pr = (x, z) => { const y = 1.15, yy = y * Math.cos(tilt) - z * Math.sin(tilt), zz = y * Math.sin(tilt) + z * Math.cos(tilt), f = 4 / (4 + zz); return [cx + x * S * f, cy + yy * S * f]; };
        let a = pr(i * .4, -2.4), b = pr(i * .4, 2.4); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
        a = pr(-2.4, i * .4); b = pr(2.4, i * .4); ctx.beginPath(); ctx.moveTo(...a); ctx.lineTo(...b); ctx.stroke();
      }
      ctx.restore();
    }
    const ca = Math.cos(ang), sa = Math.sin(ang), ct = Math.cos(tilt), stt = Math.sin(tilt);
    const tr = ([x, y, z]) => { // gear lies in XY: rotate to stand up, spin about vertical axis, then tilt view
      const X = x, Y = y, Z = z;                   // gear faces the camera, spins about the vertical axis
      const X1 = X * ca + Z * sa, Z1 = -X * sa + Z * ca;
      const Y2 = Y * ct - Z1 * stt, Z2 = Y * stt + Z1 * ct;
      const f = 4 / (4 + Z2); return [cx + X1 * S * f, cy + Y2 * S * f, Z2];
    };
    const faces = GEAR.map(f => { const p = f.v.map(tr); const ax = p[1][0] - p[0][0], ay = p[1][1] - p[0][1], bx = p[2][0] - p[0][0], by = p[2][1] - p[0][1]; return { p, k: f.k, nz: ax * by - ay * bx, z: p.reduce((s, q) => s + q[2], 0) / p.length }; });
    faces.sort((a, b) => b.z - a.z);
    const poly = f => { ctx.beginPath(); ctx.moveTo(f.p[0][0], f.p[0][1]); for (let i = 1; i < f.p.length; i++) ctx.lineTo(f.p[i][0], f.p[i][1]); ctx.closePath(); };
    const shaded = () => faces.forEach(f => {
      if (f.nz <= 0) return;
      const l = clamp(.35 + .65 * Math.abs(f.nz) / (S * S * .05));
      const base = f.k === 'side' ? [47, 107, 255] : f.k === 'hole' ? [20, 43, 83] : f.k === 'spoke' ? [34, 211, 238] : [149, 191, 239];
      const k = f.k === 'cap' ? .55 + .45 * l : .35 + .65 * l;
      ctx.fillStyle = `rgb(${base.map(c => Math.round(c * k)).join(',')})`; poly(f); ctx.fill();
      ctx.strokeStyle = 'rgba(10,24,48,.35)'; ctx.lineWidth = W / 900; ctx.stroke();
    });
    const wired = () => { ctx.lineWidth = W / 560; faces.forEach(f => { if (f.k === 'cap' && f.nz <= 0) return; ctx.strokeStyle = f.nz > 0 ? 'rgba(34,211,238,.95)' : 'rgba(34,211,238,.12)'; poly(f); ctx.stroke(); }); };
    if (sweep != null) {   // wireframe → render transition, swept left to right
      wired(); ctx.save(); ctx.beginPath(); ctx.rect(0, 0, W * sweep, Hh); ctx.clip(); ctx.clearRect(0, 0, W * sweep, Hh); shaded(); ctx.restore();
      ctx.fillStyle = 'rgba(34,211,238,.9)'; ctx.fillRect(W * sweep - W / 300, 0, W / 150, Hh);
    } else if (wire >= .5) wired(); else shaded();
  }

  // ------------------------------------------------------------------ weather simulation on canvas
  function drawWeather(ctx, W, Hh, u, { grow = 1, nodes = 0 } = {}) {
    const g = ctx.createLinearGradient(0, 0, 0, Hh); g.addColorStop(0, '#0B2350'); g.addColorStop(1, '#0F3470');
    ctx.fillStyle = g; ctx.fillRect(0, 0, W, Hh);
    // stylised generic coastline (not a real map)
    ctx.fillStyle = '#1D4A8C';
    ctx.beginPath(); ctx.moveTo(W * .0, Hh * .35); ctx.bezierCurveTo(W * .18, Hh * .3, W * .22, Hh * .55, W * .34, Hh * .62); ctx.bezierCurveTo(W * .42, Hh * .7, W * .38, Hh * .9, W * .5, Hh); ctx.lineTo(0, Hh); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(W * .7, 0); ctx.bezierCurveTo(W * .74, Hh * .18, W * .9, Hh * .2, W, Hh * .14); ctx.lineTo(W, 0); ctx.closePath(); ctx.fill();
    // lat/long grid
    ctx.strokeStyle = 'rgba(149,191,239,.16)'; ctx.lineWidth = W / 700;
    for (let i = 1; i < 8; i++) { ctx.beginPath(); ctx.moveTo(W * i / 8, 0); ctx.lineTo(W * i / 8, Hh); ctx.stroke(); }
    for (let i = 1; i < 5; i++) { ctx.beginPath(); ctx.moveTo(0, Hh * i / 5); ctx.lineTo(W, Hh * i / 5); ctx.stroke(); }
    const cx = W * (.62 - .04 * Math.sin(u * .2)), cy = Hh * (.5 + .03 * Math.cos(u * .25)), R = Math.min(W, Hh) * (.2 + .26 * grow);
    // isobars
    ctx.strokeStyle = 'rgba(230,244,255,.35)'; ctx.lineWidth = W / 600;
    for (let k = 1; k <= 5; k++) { ctx.beginPath(); for (let a = 0; a <= TAU + .01; a += .1) { const r = R * (.3 + k * .28) * (1 + .08 * Math.sin(a * 3 + k + u * .4)); const x = cx + Math.cos(a) * r * 1.25, y = cy + Math.sin(a) * r * .9; a ? ctx.lineTo(x, y) : ctx.moveTo(x, y); } ctx.stroke(); }
    // spiral cloud bands (particles on log spirals)
    const rnd = mkRnd(77);
    for (let i = 0; i < 520; i++) {
      const arm = i % 3, k = rnd(), jitter = (rnd() - .5) * .5;
      const a = arm * TAU / 3 + k * 5.2 + jitter - u * .9;
      const r = R * (.08 + k * 1.05);
      const x = cx + Math.cos(a) * r * 1.2, y = cy + Math.sin(a) * r * .88;
      const sz = W / 140 * (1.6 - k) * (0.6 + rnd());
      const al = (1 - k) * .7 * grow;
      ctx.fillStyle = k < .25 ? `rgba(255,255,255,${al})` : k < .55 ? `rgba(149,220,255,${al})` : `rgba(47,107,255,${al})`;
      ctx.beginPath(); ctx.ellipse(x, y, sz * 1.8, sz, a + 1.4, 0, TAU); ctx.fill();
    }
    // eye
    ctx.fillStyle = 'rgba(11,35,80,.9)'; ctx.beginPath(); ctx.ellipse(cx, cy, R * .07, R * .06, 0, 0, TAU); ctx.fill();
    // wind streamlines
    const rw = mkRnd(9);
    ctx.strokeStyle = 'rgba(34,211,238,.55)'; ctx.lineWidth = W / 500;
    for (let i = 0; i < 40; i++) {
      const y0 = rw() * Hh, x0 = frac(rw() + u * .08) * W * 1.2 - W * .1, L = W * .05;
      const dx = cx - x0, dy = cy - y0, d = Math.hypot(dx, dy) + 1, tx = -dy / d, ty = dx / d;
      ctx.beginPath(); ctx.moveTo(x0, y0); ctx.lineTo(x0 + (tx * .8 + 1) * L, y0 + ty * L * .8); ctx.stroke();
    }
    // forecast grid nodes (parallel compute domains)
    if (nodes > 0) {
      const nx = 8, ny = 5;
      for (let i = 0; i < nx; i++) for (let j = 0; j < ny; j++) {
        const on = frac(u * 1.2 - (i + j) * .07) < .5;
        ctx.strokeStyle = `rgba(34,211,238,${nodes * (on ? .55 : .15)})`; ctx.lineWidth = W / 400;
        ctx.strokeRect(W * i / nx + 3, Hh * j / ny + 3, W / nx - 6, Hh / ny - 6);
      }
    }
    // legend bar
    const lg = ctx.createLinearGradient(W * .04, 0, W * .3, 0); lg.addColorStop(0, '#2F6BFF'); lg.addColorStop(.6, '#95DCFF'); lg.addColorStop(1, '#FFFFFF');
    ctx.fillStyle = lg; ctx.fillRect(W * .04, Hh * .9, W * .26, Hh * .03);
  }

  // ------------------------------------------------------------------ environment shell
  function shell(kind) {
    const el = h(`<div class="env env-${kind}" style="position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0"></div>`);
    return el;
  }
  function canvasAt(el, x, y, w, hh, res = 2, style = '') {
    const c = h(`<canvas width="${Math.round(w * res)}" height="${Math.round(hh * res)}" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${hh}px;${style}"></canvas>`);
    el.appendChild(c); return c;
  }
  // sampled polyline of a quadratic/cubic path for movers
  function sampleCubic(p0, p1, p2, p3, n = 60) { const out = []; for (let i = 0; i <= n; i++) { const t = i / n, m = 1 - t; out.push([m * m * m * p0[0] + 3 * m * m * t * p1[0] + 3 * m * t * t * p2[0] + t * t * t * p3[0], m * m * m * p0[1] + 3 * m * m * t * p1[1] + 3 * m * t * t * p2[1] + t * t * t * p3[1]]); } return out; }
  const along = (pts, k) => { const f = clamp(k) * (pts.length - 1), i = Math.min(pts.length - 2, Math.floor(f)), r = f - i; return [lerp(pts[i][0], pts[i + 1][0], r), lerp(pts[i][1], pts[i + 1][1], r)]; };

  // ================================================================== 1. MICROCOMPUTER — personal office
  function office() {
    const id = 'of' + (++uid), el = shell('office');
    const books = [...Array(9)].map((_, i) => `<rect x="${772 + i * 24}" y="${372 - (i % 3) * 10}" width="20" height="${68 + (i % 3) * 10}" rx="3" fill="${['#2F6BFF', '#95BFEF', '#142B53', '#22D3EE', '#5E8FD6'][i % 5]}"/>`).join('');
    const cityB = [...Array(9)].map((_, i) => `<rect x="${90 + i * 38}" y="${640 - (i * 37 % 110) - 30}" width="34" height="${(i * 37 % 110) + 160}" fill="${i % 2 ? '#86B2E8' : '#9CC3EF'}"/>`).join('');
    el.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `
      <defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#D2E8FF"/><stop offset="1" stop-color="#B4D2F4"/></linearGradient>
      <linearGradient id="${id}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8FC3FF"/><stop offset="1" stop-color="#E6F4FF"/></linearGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FA3D3"/><stop offset="1" stop-color="#5D82B8"/></linearGradient>
      <radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFFFFF" stop-opacity=".7"/><stop offset="1" stop-color="#FFFFFF" stop-opacity="0"/></radialGradient></defs>
      ${BIG(-1200, 1250, `url(#${id}w)`)}${BIG(1250, 3200, `url(#${id}f)`)}
      <rect x="-1400" y="1240" width="3880" height="14" fill="#9DBFE6"/>
      <g opacity=".5">${[...Array(14)].map((_, i) => `<path d="M${540 + (i - 7) * 60} 1254 L${540 + (i - 7) * 260} 1920" stroke="#9FBDE3" stroke-width="3"/>`).join('')}</g>
      <rect x="60" y="300" width="380" height="420" rx="16" fill="#fff"/><rect x="76" y="316" width="348" height="388" rx="8" fill="url(#${id}s)"/>
      <circle cx="350" cy="390" r="60" fill="url(#${id}g)"/>
      <g class="clouds"><ellipse cx="160" cy="400" rx="54" ry="18" fill="#fff" opacity=".85"/><ellipse cx="300" cy="460" rx="40" ry="14" fill="#fff" opacity=".7"/></g>
      <clipPath id="${id}cl"><rect x="76" y="316" width="348" height="388"/></clipPath><g clip-path="url(#${id}cl)">${cityB}</g>
      <rect x="76" y="700" width="348" height="4" fill="#fff"/><path d="M250 316v388M76 510h348" stroke="#fff" stroke-width="10"/>
      <rect x="752" y="440" width="270" height="16" rx="6" fill="#F4F9FF"/>${books}
      <g transform="translate(985 400)"><path d="M-16 40h32l-5 -26h-22z" fill="#5E8FD6"/><circle cx="0" cy="8" r="20" fill="#22C55E" opacity=".75"/><circle cx="-10" cy="-2" r="13" fill="#22C55E" opacity=".9"/></g>
      <g transform="translate(860 230)"><circle r="50" fill="#fff" stroke="#95BFEF" stroke-width="7"/><path class="ch1" d="M0 0V-32" stroke="#142B53" stroke-width="6" stroke-linecap="round"/><path class="ch2" d="M0 0H24" stroke="#2F6BFF" stroke-width="5" stroke-linecap="round"/><circle r="5" fill="#142B53"/></g>
      <!-- desk -->
      <path d="M40 1060 L1040 1060 L1080 1150 L0 1150Z" fill="#F4F9FF"/><rect x="0" y="1150" width="1080" height="70" fill="#C8DDF5"/>
      <rect x="40" y="1220" width="30" height="200" fill="#A9C5EA"/><rect x="1010" y="1220" width="30" height="200" fill="#A9C5EA"/>
      <!-- PC tower -->
      <rect x="70" y="790" width="130" height="270" rx="14" fill="#23406E"/><rect x="82" y="804" width="106" height="242" rx="8" fill="#2D5089"/>
      <path d="M96 840h78M96 860h78M96 880h78" stroke="#4B6FA8" stroke-width="5" stroke-linecap="round"/><circle class="led" cx="135" cy="1010" r="9" fill="#22D3EE"/>
      <!-- monitor -->
      <rect x="236" y="560" width="528" height="356" rx="22" fill="#1A2F55"/><rect x="250" y="574" width="500" height="312" rx="8" fill="#F5FAFF"/>
      <rect x="474" y="916" width="52" height="96" fill="#B7CCEA"/><ellipse cx="500" cy="1022" rx="110" ry="18" fill="#B7CCEA"/>
      <g class="scr">
        <rect x="250" y="862" width="500" height="24" fill="#2F6BFF"/><circle cx="270" cy="874" r="7" fill="#fff"/>
        <rect x="294" y="866" width="30" height="16" rx="3" fill="#95BFEF"/><rect x="330" y="866" width="30" height="16" rx="3" fill="#95BFEF"/>
        <g class="w1"><rect x="268" y="590" width="330" height="262" rx="8" fill="#fff" stroke="#C9DDF5" stroke-width="2"/><rect x="268" y="590" width="330" height="30" rx="8" fill="#2F6BFF"/><rect x="268" y="606" width="330" height="14" fill="#2F6BFF"/>
          <circle cx="286" cy="605" r="5" fill="#fff"/><circle cx="302" cy="605" r="5" fill="#fff" opacity=".7"/><rect x="420" y="599" width="90" height="12" rx="6" fill="#fff" opacity=".6"/>
          <rect x="288" y="636" width="170" height="16" rx="5" fill="#142B53"/>
          ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect class="tl" x="288" y="${666 + i * 22}" width="0" height="10" rx="5" fill="#95BFEF"/>`).join('')}
          <rect class="caret" x="288" y="662" width="3" height="18" fill="#2F6BFF"/></g>
        <g class="w2"><rect x="520" y="640" width="214" height="180" rx="8" fill="#fff" stroke="#C9DDF5" stroke-width="2"/><rect x="520" y="640" width="214" height="26" rx="8" fill="#22D3EE"/><rect x="520" y="654" width="214" height="12" fill="#22D3EE"/>
          ${[0, 1, 2, 3, 4].map(i => `<rect class="bar" x="${542 + i * 36}" y="800" width="24" height="0" rx="4" fill="${i % 2 ? '#2F6BFF' : '#95BFEF'}"/>`).join('')}<path d="M536 802h184" stroke="#C9DDF5" stroke-width="3"/></g>
      </g>
      <!-- laptop -->
      <path d="M786 860 L1000 860 L1000 1010 L786 1010Z" fill="#1A2F55"/><rect x="796" y="870" width="194" height="130" rx="4" fill="#F5FAFF"/>
      <g class="lap"><rect x="796" y="870" width="194" height="20" fill="#E3EEFC"/><rect x="806" y="875" width="120" height="10" rx="5" fill="#fff"/><circle cx="975" cy="880" r="5" fill="#2F6BFF"/>
        <rect class="hero" x="806" y="898" width="174" height="48" rx="6" fill="#95BFEF"/><rect x="806" y="954" width="110" height="9" rx="4" fill="#C9DDF5"/><rect x="806" y="970" width="150" height="9" rx="4" fill="#C9DDF5"/><rect x="806" y="986" width="90" height="9" rx="4" fill="#C9DDF5"/></g>
      <path d="M770 1010 L1016 1010 L1036 1040 L750 1040Z" fill="#B7CCEA"/><rect x="852" y="1018" width="80" height="12" rx="6" fill="#A2BCE2"/>
      <!-- keyboard, mouse, mug, papers -->
      <path d="M330 1080 L670 1080 L690 1128 L310 1128Z" fill="#D6E5F8" stroke="#B7CCEA" stroke-width="3"/>
      ${[0, 1, 2].map(r => `<path d="M${336 - r * 6} ${1088 + r * 13}h${348 + r * 12}" stroke="#AFC6E8" stroke-width="7" stroke-dasharray="18 6"/>`).join('')}
      <g class="mouse"><ellipse cx="0" cy="0" rx="20" ry="28" fill="#fff" stroke="#B7CCEA" stroke-width="3"/><path d="M0 -26v14" stroke="#B7CCEA" stroke-width="3"/></g>
      <g transform="translate(200 1078)"><rect x="-26" y="-40" width="52" height="56" rx="10" fill="#2F6BFF"/><path d="M26 -28q20 0 20 16t-20 16" fill="none" stroke="#2F6BFF" stroke-width="8"/><path class="steam" d="M-8 -50q-8 -16 0 -30M8 -50q-8 -16 0 -30" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" opacity=".7"/></g>
      <g transform="translate(700 1088) rotate(-8)"><rect x="-50" y="-20" width="100" height="40" rx="4" fill="#fff"/><rect x="-44" y="-12" width="70" height="6" rx="3" fill="#C9DDF5"/><rect x="-44" y="0" width="50" height="6" rx="3" fill="#C9DDF5"/></g>`));
    const fg = h(`<div style="position:absolute;inset:0"></div>`); el.appendChild(fg);
    fg.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `<g class="person" transform="translate(470 1330) scale(1.05)">${personBack({ hair: '#2A2933', style: 'short', shirt: '#4F86F7', shirtD: '#2F6BFF' })}</g>`));
    const q = s => el.querySelector(s), qa = s => [...el.querySelectorAll(s)];
    const tl = qa('.tl'), bars = qa('.bar'), W = [480, 620, 560, 640, 400, 600, 520, 300];
    const person = q('.person .pb');
    return {
      el, port: [500, 720],
      draw(u, o = {}) {
        const typing = o.typing ?? 1;
        // document typing: lines fill progressively (loops gently so it never "finishes")
        const prog = (o.docT ?? u) * 1.6 * typing;
        tl.forEach((r, i) => { const k = clamp(prog - i * .9, 0, 1); r.setAttribute('width', (W[i] * .45) * k); });
        const li = Math.min(7, Math.floor(prog / .9)), lk = clamp(prog - li * .9, 0, 1);
        const caret = q('.caret'); caret.setAttribute('x', 288 + W[li] * .45 * lk); caret.setAttribute('y', 662 + li * 22); caret.setAttribute('opacity', frac(u * 1.6) < .5 ? 1 : 0);
        const w2 = clamp(o.chart ?? 0);
        q('.w2').setAttribute('opacity', w2); q('.w2').setAttribute('transform', `translate(${627 * (1 - E.back(w2))} ${730 * (1 - E.back(w2))}) scale(${E.back(w2) || .001})`);
        bars.forEach((b, i) => { const k = E.out(clamp(w2 * 2 - .6 - i * .12)); const hh = [60, 110, 85, 130, 100][i] * k * (1 + .06 * Math.sin(u * 3 + i)); b.setAttribute('y', 800 - hh); b.setAttribute('height', hh); });
        q('.hero').setAttribute('fill', frac(u * .35) < .5 ? '#95BFEF' : '#7FB0F0');
        q('.lap').setAttribute('transform', `translate(0 ${-((u * 10) % 20)})`);
        q('.ch1').setAttribute('transform', `rotate(${u * 6})`); q('.ch2').setAttribute('transform', `rotate(${u * 72})`);
        q('.led').setAttribute('opacity', .55 + .45 * Math.sin(u * 3));
        q('.clouds').setAttribute('transform', `translate(${(u * 8) % 60} 0)`);
        q('.steam').setAttribute('transform', `translate(0 ${-(u * 12 % 10)})`); q('.steam').setAttribute('opacity', .4 + .3 * Math.sin(u * 2));
        const mx = 760 + 18 * Math.sin(u * 1.3), my = 1104 + 8 * Math.cos(u * 1.7);
        q('.mouse').setAttribute('transform', `translate(${mx} ${my})`);
        poseArms(person, { lx: -84, ly: -140, rx: 84, ry: -142, t: u, type: typing });
      },
    };
  }

  // ================================================================== 2. WORKSTATION — 3D design studio
  function studio() {
    const id = 'st' + (++uid), el = shell('studio');
    const hex = [...Array(30)].map((_, i) => { const cx = 80 + (i % 6) * 190 + (Math.floor(i / 6) % 2) * 95, cy = 120 + Math.floor(i / 6) * 110; return `<path d="M${cx} ${cy - 56}l48 28v56l-48 28-48-28v-56z" fill="#132A52" stroke="#1C3A6E" stroke-width="4"/>`; }).join('');
    el.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `
      <defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0B1A36"/><stop offset="1" stop-color="#132C58"/></linearGradient>
      <linearGradient id="${id}f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0D1F40"/><stop offset="1" stop-color="#081530"/></linearGradient>
      <radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#22D3EE" stop-opacity=".45"/><stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></radialGradient>
      <linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#22D3EE" stop-opacity="0"/><stop offset=".5" stop-color="#22D3EE"/><stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></linearGradient></defs>
      ${BIG(-1200, 1250, `url(#${id}w)`)}${BIG(1250, 3200, `url(#${id}f)`)}
      <g opacity=".9">${hex}</g>
      <rect x="-200" y="250" width="1480" height="8" fill="url(#${id}t)" class="strip"/>
      <ellipse cx="540" cy="760" rx="560" ry="300" fill="url(#${id}g)" class="glow"/>
      <!-- desk -->
      <path d="M20 1040 L1060 1040 L1080 1130 L0 1130Z" fill="#1A3463"/><rect x="0" y="1130" width="1080" height="56" fill="#10244A"/>
      <rect x="0" y="1130" width="1080" height="6" fill="#22D3EE" class="under"/>
      <!-- monitors -->
      <rect x="70" y="540" width="520" height="350" rx="18" fill="#0A1430" stroke="#2A4D8A" stroke-width="5"/>
      <rect x="320" y="890" width="40" height="90" fill="#22406F"/><rect x="250" y="975" width="180" height="16" rx="8" fill="#22406F"/>
      <path d="M612 560 L960 590 L960 880 L612 900Z" fill="#0A1430" stroke="#2A4D8A" stroke-width="5"/>
      <rect x="770" y="890" width="36" height="86" fill="#22406F"/><rect x="705" y="970" width="166" height="16" rx="8" fill="#22406F"/>
      <!-- right monitor: CAD drawing + render panel -->
      <g transform="matrix(1 .086 0 1 0 -52)">
        <rect x="628" y="626" width="318" height="230" fill="#0E2246"/>
        <path d="M650 670h120v90h-120z M650 760l40 40h80l-40-40 M770 670l40 40v90" fill="none" stroke="#95BFEF" stroke-width="2.4" class="cad"/>
        <path d="M650 820h160M650 816v8M810 816v8" stroke="#FFD23F" stroke-width="2"/>
        <circle cx="710" cy="715" r="22" fill="none" stroke="#22D3EE" stroke-width="2.4"/>
        <rect x="836" y="640" width="96" height="200" rx="6" fill="#132C58"/>
        ${[0, 1, 2, 3, 4].map(i => `<rect x="846" y="${656 + i * 24}" width="76" height="8" rx="4" fill="#1D3E74"/><rect class="sl" x="846" y="${656 + i * 24}" width="40" height="8" rx="4" fill="#2F6BFF"/>`).join('')}
        <rect x="846" y="790" width="76" height="34" rx="6" fill="#0A1430"/>
        ${[0, 1, 2, 3, 4, 5, 6, 7].map(i => `<rect class="tile" x="${850 + (i % 4) * 18}" y="${794 + Math.floor(i / 4) * 14}" width="16" height="12" fill="#2F6BFF" opacity=".2"/>`).join('')}
      </g>
      <!-- workstation tower with glass panel + GPU -->
      <rect x="868" y="700" width="190" height="340" rx="16" fill="#0E1D3C" stroke="#2A4D8A" stroke-width="5"/>
      <rect x="886" y="720" width="120" height="300" rx="10" fill="#0A1430" stroke="#22D3EE" stroke-opacity=".5" stroke-width="3"/>
      <rect x="896" y="860" width="100" height="44" rx="6" fill="#1F3F7A"/>
      <g class="fan1" transform="translate(922 882)">${[0, 1, 2, 3].map(i => `<path d="M0 0 L16 -6 L16 6Z" fill="#22D3EE" transform="rotate(${i * 90})"/>`).join('')}</g>
      <g class="fan2" transform="translate(970 882)">${[0, 1, 2, 3].map(i => `<path d="M0 0 L16 -6 L16 6Z" fill="#22D3EE" transform="rotate(${i * 90})"/>`).join('')}</g>
      <rect x="896" y="740" width="100" height="90" rx="6" fill="#132C58"/><rect x="912" y="756" width="66" height="56" rx="4" fill="none" stroke="#2F6BFF" stroke-width="4"/>
      <rect x="896" y="930" width="100" height="10" rx="5" fill="#2F6BFF" class="ram1"/><rect x="896" y="948" width="100" height="10" rx="5" fill="#2F6BFF" class="ram2"/>
      <circle cx="1030" cy="740" r="7" fill="#22D3EE" class="pled"/>
      <!-- keyboard + pen tablet -->
      <path d="M230 1060 L540 1060 L556 1100 L214 1100Z" fill="#22406F"/>
      <path d="M600 1056 L800 1056 L812 1104 L588 1104Z" fill="#132C58" stroke="#2A4D8A" stroke-width="3"/><rect x="612" y="1064" width="176" height="30" rx="4" fill="#0A1430"/>
      <g class="pen"><path d="M0 0 L60 -110" stroke="#E6F4FF" stroke-width="10" stroke-linecap="round"/><circle cx="0" cy="0" r="5" fill="#22D3EE"/></g>`));
    const cv = canvasAt(el, 86, 556, 488, 318, 2, 'border-radius:8px');
    const ctx = cv.getContext('2d');
    const ov = h(`<div style="position:absolute;left:86px;top:556px;width:488px;height:318px;pointer-events:none"></div>`); el.appendChild(ov);
    ov.insertAdjacentHTML('beforeend', svgEl(488, 318, `<rect x="0" y="0" width="488" height="26" fill="#132C58"/>${[0, 1, 2, 3].map(i => `<rect x="${10 + i * 54}" y="7" width="44" height="12" rx="6" fill="#1D3E74"/>`).join('')}
      <rect x="0" y="26" width="34" height="292" fill="#0F2348"/>${[0, 1, 2, 3, 4, 5].map(i => `<rect x="7" y="${40 + i * 34}" width="20" height="20" rx="4" fill="${i === 1 ? '#2F6BFF' : '#1D3E74'}"/>`).join('')}
      <text class="mode" x="470" y="48" text-anchor="end" font-family="Prompt" font-weight="700" font-size="16" fill="#22D3EE">WIREFRAME</text>
      <path d="M50 300 l22 0 M50 300 l0 -22" stroke="#EF4444" stroke-width="3"/><path d="M50 300 l0 -22" stroke="#22C55E" stroke-width="3"/>`));
    const fg = h(`<div style="position:absolute;inset:0"></div>`); el.appendChild(fg);
    fg.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `<g class="person" transform="translate(400 1320) scale(1.05)">${personBack({ hair: '#1B1B26', style: 'bun', shirt: '#1F3F7A', shirtD: '#173263', phones: true, chair: '#0E1D3C' })}</g>`));
    const q = s => el.querySelector(s), qa = s => [...el.querySelectorAll(s)];
    const person = q('.person .pb'), sl = qa('.sl'), tiles = qa('.tile');
    return {
      el, port: [330, 715],
      draw(u, o = {}) {
        const wire = o.wire ?? 1, sweep = o.sweep;
        drawModel(ctx, cv.width, cv.height, (o.ang ?? u * .9), wire, { sweep: sweep != null && sweep > 0 && sweep < 1 ? sweep : null });
        q('.mode').textContent = sweep != null && sweep > 0 && sweep < 1 ? 'RENDERING…' : wire >= .5 ? 'WIREFRAME' : 'SHADED';
        sl.forEach((s, i) => s.setAttribute('width', 20 + 56 * frac(.3 + i * .21 + Math.sin(u * .7 + i) * .1)));
        const rp = o.render ?? frac(u * .25);
        tiles.forEach((t, i) => t.setAttribute('opacity', i < Math.floor(rp * 9) ? .95 : .2));
        q('.fan1').setAttribute('transform', `translate(922 882) rotate(${u * 900})`); q('.fan2').setAttribute('transform', `translate(970 882) rotate(${u * 900 + 30})`);
        q('.ram1').setAttribute('opacity', .5 + .5 * Math.sin(u * 5)); q('.ram2').setAttribute('opacity', .5 + .5 * Math.sin(u * 5 + 1.5));
        q('.pled').setAttribute('opacity', .6 + .4 * Math.sin(u * 4));
        q('.glow').setAttribute('opacity', .75 + .25 * Math.sin(u * 1.2));
        q('.strip').setAttribute('transform', `translate(${Math.sin(u * .6) * 120} 0)`);
        q('.under').setAttribute('opacity', .6 + .4 * Math.sin(u * 2));
        q('.pen').setAttribute('transform', `translate(${700 + 40 * Math.sin(u * 1.4)} ${1080 + 6 * Math.cos(u * 2.3)})`);
        poseArms(person, { lx: -86, ly: -140, rx: 120, ry: -150, t: u, type: o.typing ?? .5, seed: 1 });
      },
    };
  }

  // ================================================================== 3. MINICOMPUTER — historical multi-user room
  function minirm() {
    const id = 'mi' + (++uid), el = shell('mini');
    const tiles = [...Array(12)].map((_, r) => [...Array(16)].map((_, c) => (r + c) % 2 ? '' : `<rect x="${-200 + c * 100}" y="${1240 + r * 60}" width="100" height="60" fill="#25456F"/>`).join('')).join('');
    const term = (x, y, s, k) => `<g transform="translate(${x} ${y}) scale(${s})">
        <rect x="-20" y="150" width="240" height="20" rx="6" fill="#7E96B8"/><rect x="0" y="170" width="16" height="110" fill="#5D7699"/><rect x="184" y="170" width="16" height="110" fill="#5D7699"/>
        <path d="M10 0 H190 L200 20 V130 L190 150 H10 L0 130 V20Z" fill="#C7D3E3"/><rect x="22" y="16" width="156" height="112" rx="16" fill="#0A1A33"/>
        <g class="crt${k}">${[0, 1, 2, 3, 4, 5].map(i => `<rect class="ln" x="34" y="${28 + i * 16}" width="${60 + (i * 37 % 70)}" height="8" rx="2" fill="#5FE3F7"/>`).join('')}</g>
        <rect x="20" y="16" width="160" height="112" rx="16" fill="url(#${id}sc)"/>
        <path d="M-6 150 L206 150 L222 176 L-22 176Z" fill="#A9B9CF"/><path d="M8 158h184" stroke="#7E96B8" stroke-width="6" stroke-dasharray="12 4"/>
        <circle class="tled${k}" cx="186" cy="140" r="5" fill="#22D3EE"/></g>`;
    el.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `
      <defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2C4D7C"/><stop offset="1" stop-color="#1D3A66"/></linearGradient>
      <linearGradient id="${id}sc" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".18"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/></linearGradient>
      <linearGradient id="${id}c" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#B9C8DC"/><stop offset=".5" stop-color="#DCE5F1"/><stop offset="1" stop-color="#A8BAD2"/></linearGradient></defs>
      ${BIG(-1200, 1240, `url(#${id}w)`)}${BIG(1240, 3200, '#1B3760')}${tiles}
      ${[...Array(9)].map((_, i) => `<rect x="-200" y="${180 + i * 120}" width="1480" height="4" fill="#3A5F92" opacity=".5"/>`).join('')}
      <rect x="-200" y="1226" width="1480" height="16" fill="#3A5F92"/>
      <!-- cables (drawn under terminals) -->
      <g fill="none" stroke="#0F2546" stroke-width="12" stroke-linecap="round">
        <path class="cb0" d="M220 1290 C320 1300 380 1250 430 1180"/><path class="cb1" d="M860 1290 C760 1300 700 1250 650 1180"/>
        <path class="cb2" d="M250 940 C330 960 360 1040 420 1100"/><path class="cb3" d="M830 940 C750 960 720 1040 660 1100"/></g>
      <!-- central cabinet -->
      <g transform="translate(540 0)">
        <rect x="-170" y="380" width="340" height="830" rx="14" fill="url(#${id}c)"/><rect x="-170" y="380" width="340" height="40" rx="14" fill="#8FA5C3"/>
        <rect x="-140" y="440" width="280" height="250" rx="12" fill="#13294C"/>
        <g class="reel1" transform="translate(-62 565)"><circle r="78" fill="#0D1F3C" stroke="#95BFEF" stroke-width="6"/><circle r="24" fill="#95BFEF"/>${[0, 1, 2].map(i => `<path d="M0 0 L70 0" stroke="#95BFEF" stroke-width="10" transform="rotate(${i * 120})"/>`).join('')}<circle r="10" fill="#13294C"/></g>
        <g class="reel2" transform="translate(62 565)"><circle r="78" fill="#0D1F3C" stroke="#95BFEF" stroke-width="6"/><circle r="40" fill="#5E8FD6"/>${[0, 1, 2].map(i => `<path d="M0 0 L70 0" stroke="#95BFEF" stroke-width="10" transform="rotate(${i * 120})"/>`).join('')}<circle r="10" fill="#13294C"/></g>
        <path d="M-62 643 L62 643" stroke="#4E6E9E" stroke-width="5"/>
        <rect x="-140" y="712" width="280" height="190" rx="10" fill="#1A3560"/>
        ${[...Array(4)].map((_, r) => [...Array(10)].map((_, c) => `<circle class="bl" cx="${-115 + c * 25.5}" cy="${745 + r * 34}" r="8" fill="#22D3EE"/>`).join('')).join('')}
        <rect x="-140" y="920" width="280" height="70" rx="8" fill="#9FB2CC"/>
        ${[...Array(10)].map((_, c) => `<rect class="sw" x="${-122 + c * 25.5}" y="938" width="12" height="34" rx="4" fill="${c % 3 ? '#2F6BFF' : '#22D3EE'}"/>`).join('')}
        ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="-130" y="${1012 + i * 28}" width="260" height="10" rx="5" fill="#8FA5C3"/>`).join('')}
      </g>
      ${term(70, 760, .9, 0)}${term(830, 760, .9, 1)}`));
    const fg = h(`<div style="position:absolute;inset:0"></div>`); el.appendChild(fg);
    fg.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `
      ${term(-30, 1080, 1.25, 2)}${term(860, 1080, 1.25, 3)}
      <g class="pA" transform="translate(110 1480) scale(.95)">${personBack({ hair: '#33261F', style: 'curly', shirt: '#5E8FD6', shirtD: '#4874B8', chair: '#24406A' })}</g>
      <g class="pB" transform="translate(970 1480) scale(.95)">${personBack({ hair: '#141419', style: 'long', shirt: '#95BFEF', shirtD: '#6F9FE0', chair: '#24406A' })}</g>
      <g class="pulses"></g>
      <g class="scan" opacity=".22">${[...Array(64)].map((_, i) => `<rect x="-200" y="${i * 30}" width="1480" height="8" fill="#0A1830"/>`).join('')}</g>`));
    // data pulses along the four cables (terminal → cabinet and back), sampled once
    const paths = [sampleCubic([60, 1290], [320, 1300], [380, 1250], [430, 1180]), sampleCubic([1020, 1290], [760, 1300], [700, 1250], [650, 1180]), sampleCubic([250, 940], [330, 960], [360, 1040], [420, 1100]), sampleCubic([830, 940], [750, 960], [720, 1040], [660, 1100])];
    const pulseG = fg.querySelector('.pulses');
    const pulses = [];
    paths.forEach((p, k) => { for (let i = 0; i < 3; i++) { const c = h(`<svg><circle r="11" fill="#22D3EE"/></svg>`).firstChild; pulseG.appendChild(c); pulses.push({ c, p, k, ph: i / 3, back: i === 2 }); } });
    pulses.forEach(pp => pp.c.setAttribute('filter', ''));
    const q = s => el.querySelector(s), qa = s => [...el.querySelectorAll(s)];
    const bl = qa('.bl'), sw = qa('.sw');
    const pA = q('.pA .pb'), pB = q('.pB .pb');
    const rnd = mkRnd(31), blPh = bl.map(() => rnd());
    return {
      el, port: [540, 800],
      // o.users: 0..4 terminals active (sequential), o.flow 0..1 pulse intensity
      draw(u, o = {}) {
        const users = o.users ?? 4, flow = o.flow ?? 1;
        q('.reel1').setAttribute('transform', `translate(-62 565) rotate(${u * 140})`); q('.reel2').setAttribute('transform', `translate(62 565) rotate(${u * 110})`);
        bl.forEach((b, i) => b.setAttribute('opacity', frac(u * (1.5 + blPh[i] * 2) + blPh[i]) < .5 ? 1 : .15));
        sw.forEach((s, i) => s.setAttribute('transform', `translate(0 ${i % 2 ? 0 : 6})`));
        for (let k = 0; k < 4; k++) {
          const on = k < users ? 1 : .15;
          const g = q('.crt' + k); g.setAttribute('opacity', on);
          [...g.querySelectorAll('.ln')].forEach((ln, i) => ln.setAttribute('width', (40 + ((i * 37 + Math.floor(u * 3 + k) * 13) % 100)) * (k < users ? 1 : .4)));
          q('.tled' + k).setAttribute('opacity', k < users ? (frac(u * 2 + k * .3) < .5 ? 1 : .3) : .1);
        }
        pulses.forEach(pp => { const k = frac(u * .55 + pp.ph); const pos = along(pp.p, pp.back ? 1 - k : k); pp.c.setAttribute('cx', pos[0]); pp.c.setAttribute('cy', pos[1]); pp.c.setAttribute('fill', pp.back ? '#FFD23F' : '#22D3EE'); pp.c.setAttribute('opacity', pp.k < users ? flow * Math.sin(k * Math.PI) : 0); });
        poseArms(pA, { lx: -84, ly: -142, rx: 86, ry: -140, t: u, type: users > 2 ? 1 : 0, seed: 2 });
        poseArms(pB, { lx: -86, ly: -140, rx: 84, ry: -142, t: u, type: users > 3 ? 1 : 0, seed: 3 });
        q('.scan').setAttribute('transform', `translate(0 ${(u * 40) % 30})`);
        q('.scan').setAttribute('opacity', o.scan ?? .22);
      },
    };
  }

  // ================================================================== 4. MAINFRAME — banking data centre
  function bank() {
    const id = 'bk' + (++uid), el = shell('bank');
    const floorTiles = [...Array(10)].map((_, r) => `<path d="M-400 ${1250 + r * 70} H1480" stroke="#1F3D6E" stroke-width="3"/>`).join('') + [...Array(16)].map((_, c) => `<path d="M${540 + (c - 8) * 80} 1250 L${540 + (c - 8) * 260} 1920" stroke="#1F3D6E" stroke-width="3"/>`).join('');
    const cab = (x, w) => `<g transform="translate(${x} 0)"><rect x="0" y="640" width="${w}" height="560" rx="12" fill="#0B1934" stroke="#2B4F8C" stroke-width="4"/>
      <rect x="12" y="652" width="${w - 24}" height="536" rx="8" fill="url(#${id}cb)"/>
      <rect class="strip" x="${w / 2 - 6}" y="670" width="12" height="500" rx="6" fill="#22D3EE"/>
      ${[...Array(8)].map((_, i) => `<rect x="24" y="${690 + i * 58}" width="${w / 2 - 44}" height="30" rx="4" fill="#132A52"/><circle class="cl" cx="${w / 2 - 34}" cy="${705 + i * 58}" r="5" fill="#22D3EE"/><rect x="${w / 2 + 20}" y="${690 + i * 58}" width="${w / 2 - 44}" height="30" rx="4" fill="#132A52"/><circle class="cl" cx="${w - 34}" cy="${705 + i * 58}" r="5" fill="#2F6BFF"/>`).join('')}</g>`;
    const src = [['bank', 700], ['atm', 840], ['phone', 980], ['card', 1120]];
    el.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `
      <defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#091731"/><stop offset="1" stop-color="#11285A"/></linearGradient>
      <linearGradient id="${id}cb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#16305E"/><stop offset="1" stop-color="#0D1E40"/></linearGradient>
      <radialGradient id="${id}g" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#2F6BFF" stop-opacity=".55"/><stop offset="1" stop-color="#2F6BFF" stop-opacity="0"/></radialGradient></defs>
      ${BIG(-1200, 1250, `url(#${id}w)`)}${BIG(1250, 3200, '#0C1C3C')}${floorTiles}
      ${[...Array(12)].map((_, i) => `<rect x="${-200 + i * 130}" y="0" width="6" height="1250" fill="#13295A"/>`).join('')}
      <ellipse class="glow" cx="540" cy="930" rx="460" ry="380" fill="url(#${id}g)"/>
      <!-- wall dashboard -->
      <rect x="150" y="330" width="780" height="250" rx="18" fill="#0A1630" stroke="#2F6BFF" stroke-width="4"/>
      <text x="180" y="378" font-family="Prompt" font-weight="800" font-size="30" fill="#E6F4FF" letter-spacing="1">TRANSACTION PROCESSING</text>
      <circle class="live" cx="880" cy="368" r="9" fill="#22C55E"/><text x="862" y="378" text-anchor="end" font-family="Prompt" font-weight="700" font-size="22" fill="#22C55E">ONLINE</text>
      <path class="chart" d="" fill="none" stroke="#22D3EE" stroke-width="5" stroke-linejoin="round"/>
      <path class="chartF" d="" fill="#22D3EE" opacity=".15"/>
      <g class="dbars">${[...Array(10)].map((_, i) => `<rect x="${640 + i * 26}" y="540" width="18" height="0" rx="3" fill="${i % 2 ? '#2F6BFF' : '#95BFEF'}"/>`).join('')}</g>
      <g class="ticks">${[...Array(12)].map((_, i) => `<g transform="translate(${190 + i * 38} 548)"><circle r="12" fill="#22C55E"/><path d="M-6 0l4 4 8-8" fill="none" stroke="#fff" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>`).join('')}</g>
      <!-- pipes from sources into the mainframe, and out to confirmations -->
      <g fill="none" stroke="#1C3A6E" stroke-width="16" stroke-linecap="round">${src.map(([, y]) => `<path d="M150 ${y} C230 ${y} 250 920 330 920"/>`).join('')}${src.map(([, y]) => `<path d="M750 920 C830 920 850 ${y} 930 ${y}"/>`).join('')}</g>
      ${cab(330, 200)}${cab(550, 200)}
      <g transform="translate(540 610)"><path d="M0 -50l38 16v26c0 24-17 40-38 50-21-10-38-26-38-50v-26z" fill="#22D3EE"/><rect x="-14" y="-12" width="28" height="22" rx="4" fill="#0B1934"/><path d="M-9 -12v-7a9 9 0 0 1 18 0v7" fill="none" stroke="#0B1934" stroke-width="5"/></g>
      <path class="pulse" d="" fill="none" stroke="#22C55E" stroke-width="5" stroke-linejoin="round"/>
      ${src.map(([k, y]) => `<g transform="translate(90 ${y})"><circle r="56" fill="#132A52" stroke="#2F6BFF" stroke-width="4"/><g transform="translate(-32 -32)">${ICO[k](64, '#95BFEF')}</g></g>`).join('')}
      ${src.map(([, y], i) => `<g class="ok" transform="translate(990 ${y})"><circle r="44" fill="#0F2F3A" stroke="#22C55E" stroke-width="4"/><path d="M-16 0l10 10 20-22" fill="none" stroke="#22C55E" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></g>`).join('')}`));
    const fg = h(`<div style="position:absolute;inset:0"></div>`); el.appendChild(fg);
    fg.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `<g class="tok"></g><g class="person" transform="translate(540 1500) scale(.95)">${personBack({ hair: '#22202A', style: 'short', shirt: '#2F6BFF', shirtD: '#2152C8', standing: true })}</g>`));
    const tokG = fg.querySelector('.tok');
    const inP = src.map(([, y]) => sampleCubic([140, y], [230, y], [250, 920], [330, 920]));
    const outP = src.map(([, y]) => sampleCubic([750, 920], [830, 920], [850, y], [940, y]));
    const toks = [];
    for (let i = 0; i < 36; i++) { const g = h(`<svg><g><rect x="-26" y="-17" width="52" height="34" rx="8" fill="#2F6BFF" stroke="#95BFEF" stroke-width="3"/><text x="0" y="9" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="24" fill="#fff">฿</text></g></svg>`).firstChild; tokG.appendChild(g); toks.push({ g, p: inP[i % 4], ph: i / 36 * 4 % 1 + (i % 4) * .07, out: false }); }
    for (let i = 0; i < 24; i++) { const g = h(`<svg><g><circle r="16" fill="#22C55E"/><path d="M-7 0l5 5 9-10" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></g></svg>`).firstChild; tokG.appendChild(g); toks.push({ g, p: outP[i % 4], ph: i / 24 * 3 % 1 + (i % 4) * .09, out: true }); }
    const q = s => el.querySelector(s), qa = s => [...el.querySelectorAll(s)];
    const cl = qa('.cl'), strips = qa('.strip'), oks = qa('.ok'), ticks = qa('.ticks g'), dbars = qa('.dbars rect');
    const person = q('.person .pb');
    return {
      el, port: [540, 900],
      // o.txn 0..1 transaction stream intensity, o.ack 0..1 confirmations, o.dash 0..1 dashboard activity
      draw(u, o = {}) {
        const txn = o.txn ?? 1, ack = o.ack ?? txn, rate = .55 + .35 * txn;
        toks.forEach((t, i) => {
          const k = frac(u * rate + t.ph); const pos = along(t.p, k);
          const vis = (t.out ? ack : txn) * clamp(Math.sin(k * Math.PI) * 3) * ((i % 3) / 3 < (t.out ? ack : txn) ? 1 : 0);
          t.g.setAttribute('transform', `translate(${pos[0]} ${pos[1]}) scale(${t.out ? 1 : .85 + .15 * Math.sin(k * Math.PI)})`);
          t.g.setAttribute('opacity', vis);
        });
        cl.forEach((c, i) => c.setAttribute('opacity', frac(u * (2 + (i % 5) * .4) + i * .13) < .5 ? 1 : .25));
        strips.forEach((s, i) => s.setAttribute('opacity', .55 + .45 * Math.sin(u * 2.4 + i)));
        oks.forEach((g, i) => { const p = frac(u * rate + i * .25); g.setAttribute('opacity', ack * (.5 + .5 * (p < .3 ? 1 : 0))); });
        // dashboard: running line chart + bars + confirmations (conceptual, no figures)
        const pts = []; for (let i = 0; i <= 40; i++) { const x = 180 + i * 11.5, v = .5 + .22 * Math.sin(i * .5 + u * 2) + .14 * Math.sin(i * 1.3 - u * 3.1) + .1 * txn; pts.push([x, 520 - v * 110]); }
        q('.chart').setAttribute('d', 'M' + pts.map(p => p.join(' ')).join(' L'));
        q('.chartF').setAttribute('d', 'M180 530 L' + pts.map(p => p.join(' ')).join(' L') + ' L640 530Z');
        dbars.forEach((b, i) => { const hh = (30 + 70 * (.5 + .5 * Math.sin(u * 3 + i * .8))) * (.4 + .6 * txn); b.setAttribute('y', 540 - hh - 100); b.setAttribute('height', hh); });
        const nOk = Math.floor(frac(u * .6) * 13);
        ticks.forEach((g, i) => g.setAttribute('opacity', i < nOk ? ack : .15));
        q('.live').setAttribute('opacity', .5 + .5 * Math.sin(u * 4));
        // heartbeat / reliability pulse over the cabinets
        const hb = []; for (let i = 0; i <= 60; i++) { const x = 350 + i * 6.3, ph = frac(i / 60 - u * .5); const y = 1230 + (ph > .45 && ph < .5 ? -40 : ph >= .5 && ph < .55 ? 30 : 0); hb.push([x, y]); }
        q('.pulse').setAttribute('d', 'M' + hb.map(p => p.join(' ')).join(' L')); q('.pulse').setAttribute('opacity', o.pulse ?? .9);
        q('.glow').setAttribute('opacity', .7 + .3 * Math.sin(u * 1.5));
        poseArms(person, { lx: -112, ly: 70, rx: 112, ry: 70, t: u, type: 0, seed: 4 });
      },
    };
  }

  // ================================================================== 5. SUPERCOMPUTER — scientific computing facility
  function hpc() {
    const id = 'hp' + (++uid), el = shell('hpc');
    const VP = [540, 905];
    const K = d => 1 - 1 / (1 + d * 2.4);   // perspective compression
    const face = (side, d0, d1) => {   // rack face quad on the left (side -1) or right (+1) of the aisle
      const xN = side < 0 ? 300 : 780, yT = 520, yB = 1330;
      const p = d => [lerp(xN, VP[0] + side * 60, K(d)), lerp(yT, VP[1] - 40, K(d)), lerp(yB, VP[1] + 40, K(d))];
      const a = p(d0), b = p(d1); return { a, b };
    };
    const racks = [], leds = [];
    let racksSVG = '';
    [-1, 1].forEach(side => {
      for (let i = 5; i >= 0; i--) {
        const d0 = i * .5, d1 = i * .5 + .44, { a, b } = face(side, d0, d1);
        const outer = side < 0 ? Math.min(a[0], b[0]) - 30 : Math.max(a[0], b[0]) + 30;
        racksSVG += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${b[0]} ${b[2]} L${a[0]} ${a[2]}Z" fill="#0D1E40" stroke="#2B4F8C" stroke-width="${3 - i * .3}"/>`;
        racksSVG += `<path d="M${a[0]} ${a[1]} L${b[0]} ${b[1]} L${b[0] + side * 4} ${b[1] - 10} L${a[0] + side * 30} ${a[1] - 40}Z" fill="#132A52"/>`;
        for (let r = 0; r < 12; r++) for (let c = 0; c < 3; c++) {
          const fx = (c + .5) / 3, fy = (r + .7) / 12.6;
          const x = lerp(a[0], b[0], fx), yt = lerp(a[1], b[1], fx), yb = lerp(a[2], b[2], fx), y = lerp(yt, yb, fy);
          const s = Math.abs(b[0] - a[0]) / 3 * .55;
          leds.push({ x, y, s, i, side, r, c });
        }
      }
    });
    racksSVG += `<g class="leds">${leds.map(l => `<rect x="${l.x - l.s / 2}" y="${l.y - l.s * .12}" width="${l.s}" height="${Math.max(2, l.s * .24)}" rx="${l.s * .1}" fill="#22D3EE"/>`).join('')}</g>`;
    el.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `
      <defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#06122A"/><stop offset="1" stop-color="#0E2550"/></linearGradient>
      <radialGradient id="${id}v" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#22D3EE" stop-opacity=".55"/><stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></radialGradient></defs>
      ${BIG(-1200, 905, `url(#${id}w)`)}${BIG(905, 3200, '#081733')}
      ${[...Array(18)].map((_, i) => `<path d="M${VP[0]} ${VP[1]} L${-1400 + i * 230} 1920" stroke="#16336A" stroke-width="3"/>`).join('')}
      ${[...Array(10)].map((_, i) => { const y = VP[1] + 40 + Math.pow(i / 9, 2) * 1000; return `<path d="M-400 ${y} H1480" stroke="#16336A" stroke-width="3"/>`; }).join('')}
      ${[...Array(10)].map((_, i) => `<path d="M${VP[0]} ${VP[1]} L${-1400 + i * 430} -200" stroke="#0F2550" stroke-width="5"/>`).join('')}
      <ellipse class="vglow" cx="${VP[0]}" cy="${VP[1]}" rx="320" ry="220" fill="url(#${id}v)"/>
      ${racksSVG}
      <g class="floorlights">${[...Array(7)].map((_, i) => { const y = VP[1] + 60 + Math.pow(i / 6, 2) * 900, w = 20 + i * 30; return `<rect class="fl" x="${540 - w / 2}" y="${y}" width="${w}" height="${4 + i * 2}" rx="3" fill="#22D3EE"/>`; }).join('')}</g>
      <!-- hanging weather display -->
      <path d="M300 220V330M780 220V330" stroke="#2B4F8C" stroke-width="6"/>
      <rect x="160" y="320" width="760" height="440" rx="20" fill="#06122A" stroke="#2F6BFF" stroke-width="6"/>`));
    const cv = canvasAt(el, 178, 338, 724, 404, 1.6, 'border-radius:10px');
    const ctx = cv.getContext('2d');
    const ov = h(`<div style="position:absolute;left:178px;top:338px;width:724px;height:404px"></div>`); el.appendChild(ov);
    ov.insertAdjacentHTML('beforeend', svgEl(724, 404, `<rect x="14" y="14" width="250" height="38" rx="10" fill="rgba(6,18,42,.7)"/><text x="30" y="42" font-family="Prompt" font-weight="800" font-size="22" fill="#E6F4FF">WEATHER MODEL</text>
      <rect class="prog" x="500" y="24" width="0" height="14" rx="7" fill="#22D3EE"/><rect x="500" y="24" width="200" height="14" rx="7" fill="none" stroke="#95BFEF" stroke-width="2"/>`));
    const fg = h(`<div style="position:absolute;inset:0"></div>`); el.appendChild(fg);
    fg.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `<g class="streams"></g><g class="person" transform="translate(540 1520) scale(.95)">${personBack({ hair: '#3A2A22', style: 'long', coat: true, skin: '#EBC5A5', standing: true })}</g>`));
    const strG = fg.querySelector('.streams');
    const rnd = mkRnd(5);
    const streams = [...Array(28)].map((_, i) => { const l = leds[Math.floor(rnd() * leds.length)]; const end = [400 + rnd() * 280, 560 + rnd() * 80]; const p = sampleCubic([l.x, l.y], [l.x, l.y - 200], [end[0], end[1] + 200], end, 40); const c = h(`<svg><circle r="7" fill="#22D3EE"/></svg>`).firstChild; strG.appendChild(c); return { c, p, ph: rnd() }; });
    const q = s => el.querySelector(s);
    const ledEls = [...el.querySelectorAll('.leds rect')], fls = [...el.querySelectorAll('.fl')];
    const person = q('.person .pb');
    return {
      el, port: [540, 540],
      // o.par 0..1 parallel node activity, o.storm 0..1 simulation growth, o.streams 0..1
      draw(u, o = {}) {
        const par = o.par ?? 1, storm = o.storm ?? 1;
        drawWeather(ctx, cv.width, cv.height, u, { grow: storm, nodes: o.grid ?? .6 });
        q('.prog').setAttribute('width', 200 * (o.prog ?? frac(u * .12)));
        ledEls.forEach((r, i) => { const l = leds[i]; const wave = frac(u * 1.4 - l.r * .06 - l.i * .1 + (l.c * .33)); r.setAttribute('opacity', (.15 + .85 * (wave < .55 ? 1 : 0)) * (.25 + .75 * par)); r.setAttribute('fill', wave < .1 ? '#FFFFFF' : '#22D3EE'); });
        fls.forEach((f, i) => f.setAttribute('opacity', .3 + .7 * Math.max(0, Math.sin(u * 3 - i * .7))));
        streams.forEach(s => { const k = frac(u * .5 + s.ph); const pos = along(s.p, k); s.c.setAttribute('cx', pos[0]); s.c.setAttribute('cy', pos[1]); s.c.setAttribute('opacity', (o.streams ?? par) * Math.sin(k * Math.PI)); });
        q('.vglow').setAttribute('opacity', .6 + .4 * Math.sin(u * 2));
        poseArms(person, { lx: -112, ly: 70, rx: 112, ry: 70, t: u, type: 0, seed: 5 });
      },
    };
  }

  // ================================================================== 6. modern server room (comparison only)
  function servers() {
    const id = 'sv' + (++uid), el = shell('servers');
    const rack = x => `<g transform="translate(${x} 0)"><rect x="0" y="560" width="190" height="640" rx="10" fill="#1A2F55" stroke="#95BFEF" stroke-width="4"/>
      ${[...Array(14)].map((_, i) => `<rect x="12" y="${576 + i * 43}" width="166" height="34" rx="5" fill="#E6F4FF"/><circle class="sl" cx="30" cy="${593 + i * 43}" r="5" fill="#22C55E"/><circle class="sl" cx="46" cy="${593 + i * 43}" r="5" fill="#22D3EE"/><path d="M70 ${593 + i * 43}h96" stroke="#95BFEF" stroke-width="4" stroke-dasharray="10 5"/>`).join('')}</g>`;
    const clients = [[110, 380, 'micro'], [540, 330, 'phone'], [970, 380, 'micro']];
    el.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `
      <defs><linearGradient id="${id}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F4FF"/><stop offset="1" stop-color="#C3DCF6"/></linearGradient></defs>
      ${BIG(-1200, 1250, `url(#${id}w)`)}${BIG(1250, 3200, '#A9C7EA')}
      ${[...Array(12)].map((_, i) => `<path d="M${540 + (i - 6) * 90} 1250 L${540 + (i - 6) * 300} 1920" stroke="#95BFEF" stroke-width="3"/>`).join('')}
      ${[...Array(8)].map((_, i) => `<rect x="${-100 + i * 170}" y="180" width="110" height="18" rx="9" fill="#fff"/>`).join('')}
      <g fill="none" stroke="#95BFEF" stroke-width="6" stroke-dasharray="14 10">${clients.map(([x, y]) => `<path d="M${x} ${y + 60} C${x} 500 540 470 540 560"/>`).join('')}</g>
      ${rack(240)}${rack(445)}${rack(650)}
      ${clients.map(([x, y, k]) => `<g transform="translate(${x} ${y})"><circle r="62" fill="#fff" stroke="#2F6BFF" stroke-width="5"/><g transform="translate(-40 -40)">${k === 'micro' ? ICO.micro(80, '#2F6BFF', '#22D3EE') : ICO.phone(80, '#2F6BFF')}</g></g>`).join('')}`));
    const fg = h(`<div style="position:absolute;inset:0"></div>`); el.appendChild(fg);
    fg.insertAdjacentHTML('beforeend', svgEl(1080, 1920, `<g class="pk"></g>`));
    const pkG = fg.querySelector('.pk');
    const paths = clients.map(([x, y]) => sampleCubic([x, y + 60], [x, 500], [540, 470], [540, 560], 40));
    const pk = [...Array(12)].map((_, i) => { const c = h(`<svg><circle r="10" fill="#2F6BFF"/></svg>`).firstChild; pkG.appendChild(c); return { c, p: paths[i % 3], ph: i / 12, back: i % 2 }; });
    const sl = [...el.querySelectorAll('.sl')];
    return {
      el, port: [540, 800],
      draw(u, o = {}) {
        pk.forEach(p => { const k = frac(u * .6 + p.ph); const pos = along(p.p, p.back ? 1 - k : k); p.c.setAttribute('cx', pos[0]); p.c.setAttribute('cy', pos[1]); p.c.setAttribute('fill', p.back ? '#22C55E' : '#2F6BFF'); p.c.setAttribute('opacity', Math.sin(k * Math.PI)); });
        sl.forEach((s, i) => s.setAttribute('opacity', frac(u * 2.2 + i * .37) < .6 ? 1 : .3));
      },
    };
  }

  // ------------------------------------------------------------------ view = clipping frame + camera
  const MAKERS = { office, studio, mini: minirm, bank, hpc, servers };
  function view(parent, kind, { radius = 0, border = '' } = {}) {
    const env = MAKERS[kind]();
    const frame = h(`<div class="envframe" style="position:absolute;left:0;top:0;overflow:hidden;border-radius:${radius}px;${border}"></div>`);
    frame.appendChild(env.el); parent.appendChild(frame);
    let shown = false;
    const v = {
      env, frame, kind,
      // r: {x,y,w,h,o,s}: frame rect in parent px; cam: {cx,cy,z}
      set(r, cam = {}) {
        const o = r.o ?? 1; shown = o > .001;
        frame.style.visibility = shown ? 'visible' : 'hidden'; frame.style.opacity = o;
        if (!shown) return false;
        frame.style.left = r.x + 'px'; frame.style.top = r.y + 'px'; frame.style.width = r.w + 'px'; frame.style.height = r.h + 'px';
        frame.style.transform = `scale(${r.s ?? 1})`; frame.style.transformOrigin = '50% 50%';
        if (r.clip) frame.style.clipPath = r.clip; else frame.style.clipPath = '';
        const z = cam.z ?? 1, cx = cam.cx ?? 540, cy = cam.cy ?? 900;
        env.el.style.transform = `translate(${r.w / 2 - cx * z}px,${r.h / 2 - cy * z}px) scale(${z})`;
        return true;
      },
      draw(u, o) { if (shown) env.draw(u, o); },
      // world point → parent px for the last set()
      toParent(wx, wy, r, cam = {}) { const z = cam.z ?? 1; return [r.x + r.w / 2 + (wx - (cam.cx ?? 540)) * z, r.y + r.h / 2 + (wy - (cam.cy ?? 900)) * z]; },
    };
    return v;
  }

  window.ENV = { view, ICO, personBack, poseArms, drawModel, drawWeather, mkRnd, frac, TAU, C, sampleCubic, along };
})();
