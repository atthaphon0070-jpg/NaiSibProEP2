// EP62 characters + environment: the friendly government administrative officer (shared rig, look 'G')
// and a pastel Thai government records office. All artwork is original vector drawing.
(function () {
  const { h, clamp, lerp, E, P, bob } = NSP;

  // ------------------------------------------------------------------ officer
  // pose presets: armL / armR = [upper, fore] degrees (+ = outward / up), see props_story.js
  const POSE = {
    idle: { armL: [8, -6], armR: [8, -6] },
    hold: { armL: [22, 112], armR: [22, 112] },          // documents held at the chest
    point: { armL: [8, -6], armR: [128, 8] },            // pointing up to the right
    pointL: { armL: [128, 8], armR: [8, -6] },           // pointing up to the left
    think: { armL: [14, 30], armR: [28, 140] },          // hand to chin
    cheer: { armL: [150, 16], armR: [150, 16] },
    shrug: { armL: [52, 70], armR: [52, 70] },
    type: { armL: [26, 80], armR: [26, 80] },
    present: { armL: [8, -6], armR: [70, 40] },          // open palm to the side
  };
  const mixArm = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  // blend two presets (k 0..1)
  function blend(p0, p1, k) {
    const A = POSE[p0] || p0, B = POSE[p1] || p1;
    return { armL: mixArm(A.armL, B.armL, k), armR: mixArm(A.armR, B.armR, k) };
  }
  function officer(parent) {
    const wrap = h(`<div class="actor"></div>`);
    const ch = STORY.character('G');
    wrap.appendChild(ch); parent.appendChild(wrap);
    return {
      wrap, ch,
      set(x, y, s = 1, o = 1, r = 0) {
        wrap.style.transform = `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;
        wrap.style.opacity = o; wrap.style.visibility = o <= .001 ? 'hidden' : 'visible';
      },
      pose(p) { ch.pose(p); },
    };
  }
  // idle helpers
  const blink = (t, s = 0) => STORY.blinkAt(t, s);

  // ------------------------------------------------------------------ office set
  const binder = (x, y, w, hgt, c, c2) => `<g><rect x="${x}" y="${y}" width="${w}" height="${hgt}" rx="7" fill="${c}"/><rect x="${x + 6}" y="${y + 16}" width="${w - 12}" height="26" rx="5" fill="#fff" opacity=".85"/><circle cx="${x + w / 2}" cy="${y + hgt - 26}" r="7" fill="${c2}"/></g>`;
  function officeBack() {
    let binders = '';
    const cols = [['#95BFEF', '#2F6BFF'], ['#F7A8C4', '#EE7FAA'], ['#B8D9F8', '#5E8FF0'], ['#FFC9DC', '#FF91BA']];
    [690, 870, 1050].forEach((sy, r) => { let x = 726; for (let i = 0; i < 7; i++) { const c = cols[(i + r) % 4], w = 34 + ((i * 7 + r * 3) % 3) * 6; binders += binder(x, sy - 150 - (i % 2) * 10, w, 150 + (i % 2) * 10, c[0], c[1]); x += w + 6; } });
    return `<svg width="1200" height="1920" viewBox="0 0 1200 1920" style="position:absolute;left:-60px;top:0">
      <defs>
        <linearGradient id="ofW" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFE7F1"/><stop offset=".5" stop-color="#FDEFF6"/><stop offset=".5" stop-color="#EEF6FF"/><stop offset="1" stop-color="#E3F0FF"/></linearGradient>
        <linearGradient id="ofSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFE0FF"/><stop offset="1" stop-color="#FFE3EF"/></linearGradient>
        <linearGradient id="ofFl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F3E4DA"/><stop offset="1" stop-color="#E9D3C6"/></linearGradient>
      </defs>
      <rect width="1200" height="1920" fill="url(#ofW)"/>
      ${[...Array(12)].map((_, i) => `<rect x="${i * 100}" y="0" width="50" height="1240" fill="#fff" opacity=".22"/>`).join('')}
      <rect y="1170" width="1200" height="20" fill="#fff" opacity=".9"/><rect y="1190" width="1200" height="330" fill="#F6EEF7"/>
      <rect y="1520" width="1200" height="400" fill="url(#ofFl)"/>
      ${[...Array(9)].map((_, i) => `<path d="M${i * 150 - 40} 1520 L${i * 150 - 200} 1920" stroke="#E2C9BA" stroke-width="4"/>`).join('')}
      <!-- window -->
      <g transform="translate(150 380)"><rect x="-16" y="-16" width="352" height="412" rx="26" fill="#fff"/><rect width="320" height="380" rx="16" fill="url(#ofSky)"/>
        <circle cx="240" cy="90" r="40" fill="#FFF3B8"/><path d="M30 300 Q90 230 150 290 Q200 240 260 300 L320 380 L0 380Z" fill="#CDE7D9"/>
        <ellipse cx="90" cy="120" rx="54" ry="20" fill="#fff" opacity=".9"/><ellipse cx="130" cy="108" rx="40" ry="22" fill="#fff" opacity=".9"/>
        <rect x="154" width="12" height="380" fill="#fff"/><rect y="184" width="320" height="12" fill="#fff"/>
        ${[...Array(6)].map((_, i) => `<rect x="0" y="${i * 14}" width="320" height="8" fill="#fff" opacity=".75"/>`).join('')}</g>
      <!-- clock -->
      <g transform="translate(600 470)"><circle r="62" fill="#fff" stroke="#95BFEF" stroke-width="10"/><circle r="6" fill="#31445D"/>
        <path class="ofc-h" d="M0 0 L0 -30" stroke="#31445D" stroke-width="8" stroke-linecap="round"/><path class="ofc-m" d="M0 0 L0 -46" stroke="#EE7FAA" stroke-width="6" stroke-linecap="round"/>
        ${[...Array(12)].map((_, i) => `<circle cx="${Math.sin(i * Math.PI / 6) * 48}" cy="${-Math.cos(i * Math.PI / 6) * 48}" r="4" fill="#B9C7DD"/>`).join('')}</g>
      <!-- shelves -->
      <g><rect x="704" y="500" width="400" height="690" rx="18" fill="#F2E3D7"/><rect x="716" y="512" width="376" height="666" rx="12" fill="#FBF3EC"/>
        ${[690, 870, 1050].map(y => `<rect x="704" y="${y}" width="400" height="18" rx="6" fill="#E2CDBD"/>`).join('')}${binders}
        <g transform="translate(740 1010)"><rect width="110" height="40" rx="8" fill="#fff" stroke="#E2CDBD" stroke-width="3"/><rect y="-20" width="110" height="24" rx="6" fill="#F7A8C4"/></g></g>
      <!-- filing cabinet -->
      <g transform="translate(40 900)"><rect width="230" height="620" rx="18" fill="#DCE7F6"/><rect x="10" y="10" width="210" height="600" rx="12" fill="#EAF2FC"/>
        ${[0, 1, 2, 3].map(i => `<rect x="24" y="${26 + i * 146}" width="182" height="128" rx="12" fill="#fff"/><rect x="85" y="${50 + i * 146}" width="60" height="16" rx="8" fill="${i % 2 ? '#F7A8C4' : '#95BFEF'}"/><rect x="66" y="${84 + i * 146}" width="98" height="26" rx="6" fill="#F4F7FC" stroke="#DCE7F6" stroke-width="3"/>`).join('')}</g>
      <!-- plant -->
      <g transform="translate(1110 1520)"><path d="M-50 0 L-40 -90 L40 -90 L50 0Z" fill="#F7A8C4"/><rect x="-46" y="-100" width="92" height="18" rx="8" fill="#EE7FAA"/>
        <path d="M0 -100 C-30 -180 -90 -200 -100 -260 C-40 -240 -10 -190 0 -100Z M0 -100 C20 -200 70 -230 110 -280 C110 -210 50 -160 0 -100Z M0 -100 C0 -200 10 -260 20 -320 C40 -250 30 -170 0 -100Z" fill="#7FCBA4"/></g>
    </svg>`;
  }
  function officeDesk() {
    return `<svg width="1080" height="700" viewBox="0 0 1080 700" style="position:absolute;left:0;top:1220px;overflow:visible">
      <defs><linearGradient id="dkTop" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F6E3D3"/><stop offset="1" stop-color="#E9CDB8"/></linearGradient>
        <linearGradient id="dkFr" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#FFD3E3"/><stop offset=".5" stop-color="#FCE4EE"/><stop offset=".5" stop-color="#E4F0FF"/><stop offset="1" stop-color="#C9E0FB"/></linearGradient></defs>
      <!-- monitor -->
      <g transform="translate(150 -110)"><rect x="70" y="160" width="40" height="70" fill="#C9D6EA"/><rect x="30" y="220" width="120" height="18" rx="9" fill="#B9C7DD"/>
        <rect x="-30" y="0" width="240" height="170" rx="18" fill="#31445D"/><rect x="-18" y="12" width="216" height="140" rx="10" fill="#E6F4FF"/>
        <rect x="-4" y="26" width="120" height="16" rx="8" fill="#95BFEF"/><rect x="-4" y="54" width="180" height="12" rx="6" fill="#fff"/><rect x="-4" y="76" width="150" height="12" rx="6" fill="#fff"/>
        <rect x="-4" y="104" width="70" height="30" rx="10" fill="#F7A8C4"/><rect x="76" y="104" width="70" height="30" rx="10" fill="#5E8FF0"/></g>
      <!-- top -->
      <rect x="60" y="110" width="960" height="44" rx="16" fill="url(#dkTop)"/><rect x="60" y="110" width="960" height="12" rx="6" fill="#fff" opacity=".55"/>
      <!-- front -->
      <rect x="100" y="150" width="880" height="560" rx="22" fill="url(#dkFr)"/>
      <rect x="140" y="190" width="360" height="140" rx="18" fill="#fff" opacity=".55"/><rect x="580" y="190" width="360" height="140" rx="18" fill="#fff" opacity=".55"/>
      <rect x="280" y="250" width="80" height="16" rx="8" fill="#EE7FAA"/><rect x="720" y="250" width="80" height="16" rx="8" fill="#2F6BFF"/>
      <!-- tray -->
      <g transform="translate(770 60)"><path d="M0 30 L180 30 L168 66 L12 66Z" fill="#95BFEF"/><rect x="10" y="14" width="160" height="22" rx="4" fill="#fff"/><rect x="18" y="6" width="150" height="20" rx="4" fill="#FFE3EF"/></g>
      <!-- pen cup -->
      <g transform="translate(680 40)"><rect x="0" y="20" width="56" height="70" rx="12" fill="#F7A8C4"/><path d="M14 22 L8 -24 M28 22 L30 -30 M42 22 L52 -18" stroke-width="7" stroke-linecap="round" stroke="#2F6BFF"/><circle cx="30" cy="-30" r="6" fill="#FFD23F"/></g>
    </svg>`;
  }
  // full set: back layer (parallax), actor layer, desk layer
  function office(parent) {
    const back = h(`<div class="abs" style="inset:0">${officeBack()}</div>`);
    const actors = h(`<div class="abs" style="inset:0"></div>`);
    const desk = h(`<div class="abs" style="inset:0">${officeDesk()}</div>`);
    parent.appendChild(back); parent.appendChild(actors); parent.appendChild(desk);
    const ch = back.querySelector('.ofc-h'), cm = back.querySelector('.ofc-m');
    return {
      back, actors, desk,
      draw(t, camX = 0, camY = 0, zoom = 1) {
        back.style.transform = `translate(${camX * .4}px,${camY * .4}px) scale(${1 + (zoom - 1) * .6})`;
        actors.style.transform = `translate(${camX * .8}px,${camY * .8}px) scale(${zoom})`;
        desk.style.transform = `translate(${camX}px,${camY}px) scale(${zoom})`;
        actors.style.transformOrigin = desk.style.transformOrigin = back.style.transformOrigin = '540px 1300px';
        ch.setAttribute('transform', `rotate(${300 + t * 2})`); cm.setAttribute('transform', `rotate(${t * 24})`);
      },
    };
  }

  window.CHAR = { POSE, blend, officer, office, blink };
})();
