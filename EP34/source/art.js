// NaiSibPro EP.34 — flat 2D props for "5 generations of computers" (inline SVG, brand palette).
// Every function returns an SVG string; animated parts carry class names the episode page drives.
(function () {
  let uid = 0;
  const id = p => p + (++uid);

  // ---------- generation 1 ----------
  function tube(w = 200) {
    const g = id('tg'), gl = id('tgl');
    return `<svg width="${w}" height="${w * 1.875}" viewBox="0 0 160 300" style="overflow:visible">
      <defs><radialGradient id="${gl}"><stop offset="0" stop-color="#FFB45C" stop-opacity=".95"/><stop offset=".45" stop-color="#FF9A3C" stop-opacity=".35"/><stop offset="1" stop-color="#FF9A3C" stop-opacity="0"/></radialGradient>
      <linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#EAF6FF" stop-opacity=".75"/><stop offset=".5" stop-color="#FFFFFF" stop-opacity=".25"/><stop offset="1" stop-color="#CFE3F7" stop-opacity=".7"/></linearGradient></defs>
      <ellipse class="tglow" cx="80" cy="150" rx="105" ry="125" fill="url(#${gl})"/>
      <rect x="56" y="78" width="48" height="112" rx="6" fill="#9AA6B8" stroke="#6E7B90" stroke-width="4"/>
      <path d="M62 92h36M62 106h36M62 120h36" stroke="#7D899C" stroke-width="3"/>
      <path class="tfil" d="M70 205V128Q80 108 90 128V205" fill="none" stroke="#FF8A2B" stroke-width="5" stroke-linecap="round"/>
      <path d="M30 228V92Q30 18 80 18Q130 18 130 92V228Z" fill="url(#${g})" stroke="#fff" stroke-width="6"/>
      <path d="M44 74Q48 40 72 30" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round" opacity=".85"/>
      <rect x="20" y="222" width="120" height="48" rx="12" fill="#4A4F5C"/><rect x="20" y="222" width="120" height="12" rx="6" fill="#626877"/>
      <path d="M46 270v26M68 270v26M92 270v26M114 270v26" stroke="#E7B84A" stroke-width="7" stroke-linecap="round"/></svg>`;
  }
  function eniac(w = 1000) {
    let cab = '';
    for (let i = 0; i < 6; i++) {
      const x = 22 + i * 161;
      let lamps = '';
      for (let r = 0; r < 8; r++) for (let c = 0; c < 6; c++) lamps += `<rect class="lamp" x="${x + 16 + c * 21}" y="${130 + r * 26}" width="13" height="17" rx="5" fill="#FFB45C"/>`;
      let knobs = '';
      for (let c = 0; c < 5; c++) knobs += `<circle cx="${x + 24 + c * 25}" cy="${370}" r="9" fill="#F4F6FB" stroke="#2C3747" stroke-width="3"/>`;
      let jacks = '';
      for (let r = 0; r < 3; r++) for (let c = 0; c < 7; c++) jacks += `<circle cx="${x + 18 + c * 19}" cy="${410 + r * 20}" r="4.5" fill="#1F2733"/>`;
      cab += `<rect x="${x}" y="96" width="150" height="430" rx="10" fill="#3C4A5E"/><rect x="${x + 7}" y="104" width="136" height="414" rx="7" fill="#46566D"/>
        <rect x="${x + 10}" y="120" width="130" height="220" rx="6" fill="#26303D"/>${lamps}${knobs}${jacks}`;
    }
    const cables = [['#EE7FAA', 140, 300], ['#95BFEF', 300, 460], ['#E7B84A', 470, 620], ['#5FDC9B', 620, 780], ['#9C8FE6', 790, 930]]
      .map(([c, a, b], i) => `<path d="M${a} 420 C${a + 20} ${560 + i * 6} ${b - 20} ${560 + i * 6} ${b} 430" fill="none" stroke="${c}" stroke-width="7" stroke-linecap="round"/>`).join('');
    return `<svg width="${w}" height="${w * .62}" viewBox="0 0 1000 620">
      <rect x="0" y="0" width="1000" height="560" rx="30" fill="#E9DCC6"/><rect x="0" y="520" width="1000" height="100" rx="20" fill="#CDB896"/>
      <path d="M0 540H1000" stroke="#B8A27D" stroke-width="4"/>
      <rect x="330" y="26" width="340" height="54" rx="14" fill="#31445D"/><text x="500" y="65" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="38" fill="#F6D77E" letter-spacing="8">ENIAC</text>
      ${cab}${cables}</svg>`;
  }
  function thermo(w = 150) {
    return `<svg width="${w}" height="${w * 2.4}" viewBox="0 0 150 360">
      <rect x="50" y="14" width="50" height="270" rx="25" fill="#fff" stroke="#E0517F" stroke-width="6"/>
      <circle cx="75" cy="300" r="46" fill="#E0517F" stroke="#fff" stroke-width="6"/>
      <rect class="merc" x="63" y="60" width="24" height="240" rx="12" fill="#E0517F" style="transform-box:fill-box;transform-origin:50% 100%"/>
      <path d="M104 70h22M104 120h16M104 170h22M104 220h16" stroke="#E0517F" stroke-width="5" stroke-linecap="round"/></svg>`;
  }
  function gauge(w = 300) {
    return `<svg width="${w}" height="${w * .72}" viewBox="0 0 300 216">
      <path d="M30 190A120 120 0 0 1 270 190" fill="none" stroke="#EEF2F8" stroke-width="30" stroke-linecap="round"/>
      <path d="M30 190A120 120 0 0 1 270 190" fill="none" stroke="url(#gg)" stroke-width="30" stroke-linecap="round"/>
      <defs><linearGradient id="gg"><stop offset="0" stop-color="#5FDC9B"/><stop offset=".55" stop-color="#FFD36E"/><stop offset="1" stop-color="#E0517F"/></linearGradient></defs>
      <g class="needle" style="transform-origin:150px 190px"><path d="M150 190L146 90L150 74L154 90Z" fill="#31445D"/></g><circle cx="150" cy="190" r="16" fill="#31445D"/>
      <path d="M150 112l-22 44h20l-8 34 30-48h-20l10-30z" fill="#FFB347" transform="translate(-2 -10) scale(1)" opacity="0"/></svg>`;
  }
  function bolt(s = 60, c = '#FFB347') { return `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M13 2L4 14h7l-1 8 9-12h-7z" fill="${c}"/></svg>`; }
  function flame(s = 60) { return `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2c1 4 6 6 6 12a6 6 0 0 1-12 0c0-3 2-5 3-6 0 2 1 3 2 3-1-3 0-6 1-9z" fill="#FF7A45"/><path d="M12 12c1 2 3 3 3 5a3 3 0 0 1-6 0c0-1.5 1-2.5 3-5z" fill="#FFD36E"/></svg>`; }
  function bigIcon(s = 60) { return `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3 9V3h6M21 9V3h-6M3 15v6h6M21 15v6h-6" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }

  // ---------- generation 2 ----------
  function transistor(w = 120) {
    const g = id('tr');
    return `<svg width="${w}" height="${w * 1.67}" viewBox="0 0 120 200" style="overflow:visible">
      <defs><linearGradient id="${g}" x1="0" x2="1"><stop offset="0" stop-color="#8E99A8"/><stop offset=".35" stop-color="#F4F7FB"/><stop offset=".7" stop-color="#C3CBD6"/><stop offset="1" stop-color="#7D8897"/></linearGradient></defs>
      <path d="M40 112v84M60 112v84M80 112v84" stroke="#E7B84A" stroke-width="6" stroke-linecap="round"/>
      <rect x="16" y="100" width="88" height="16" rx="8" fill="#9AA4B2"/><path d="M16 104l-10 10 12 2z" fill="#9AA4B2"/>
      <rect x="22" y="38" width="76" height="70" fill="url(#${g})"/>
      <ellipse cx="60" cy="108" rx="38" ry="9" fill="#8E99A8"/><ellipse cx="60" cy="38" rx="38" ry="12" fill="#F4F7FB" stroke="#B8C2CE" stroke-width="3"/></svg>`;
  }
  function mainframe(w = 900) {
    const reel = (cx, cy) => `<g class="reel" style="transform-origin:${cx}px ${cy}px"><circle cx="${cx}" cy="${cy}" r="52" fill="#2C3747"/><circle cx="${cx}" cy="${cy}" r="44" fill="#95BFEF"/>
      ${[0, 1, 2].map(i => `<path d="M${cx} ${cy}L${cx + 40 * Math.cos(i * 2.094)} ${cy + 40 * Math.sin(i * 2.094)}" stroke="#2C3747" stroke-width="10"/>`).join('')}<circle cx="${cx}" cy="${cy}" r="12" fill="#F4F6FB"/></g>`;
    const tape = x => `<rect x="${x}" y="70" width="190" height="400" rx="14" fill="#DDE5EF"/><rect x="${x + 12}" y="84" width="166" height="250" rx="10" fill="#C3D0E0"/>
      ${reel(x + 95, 150)}${reel(x + 95, 270)}<rect x="${x + 30}" y="356" width="130" height="16" rx="8" fill="#9AA6B8"/><rect x="${x + 30}" y="384" width="80" height="16" rx="8" fill="#9AA6B8"/>`;
    let lights = '';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 8; c++) lights += `<circle class="lamp2" cx="${452 + c * 22}" cy="${130 + r * 26}" r="7" fill="${(r + c) % 3 ? '#5FDC9B' : '#FFD36E'}"/>`;
    return `<svg width="${w}" height="${w * .58}" viewBox="0 0 900 520">
      <rect x="0" y="470" width="900" height="50" rx="16" fill="#BFD9CF"/>
      ${tape(20)}${tape(220)}
      <rect x="425" y="70" width="230" height="400" rx="14" fill="#3C4A5E"/><rect x="437" y="104" width="206" height="160" rx="10" fill="#26303D"/>${lights}
      <rect x="445" y="300" width="190" height="20" rx="10" fill="#5E6E85"/><rect x="445" y="336" width="120" height="20" rx="10" fill="#5E6E85"/>
      <rect x="675" y="190" width="205" height="280" rx="14" fill="#DDE5EF"/><rect x="690" y="150" width="175" height="60" rx="10" fill="#F4F6FB" stroke="#C3D0E0" stroke-width="4"/>
      <rect class="paper" x="705" y="90" width="145" height="80" fill="#fff" stroke="#DCE6F4" stroke-width="3"/><path d="M718 110h110M718 128h90M718 146h104" stroke="#C3D0E0" stroke-width="5"/>
      <rect x="700" y="250" width="155" height="22" rx="11" fill="#9AA6B8"/></svg>`;
  }

  // ---------- generation 3 ----------
  function chip(w = 260, label = 'IC', body = '#2B2F3A', txt = '#fff') {
    let pins = '';
    for (let i = 0; i < 8; i++) { const x = 52 + i * 22; pins += `<rect x="${x}" y="2" width="12" height="22" rx="3" fill="#C8CFD9"/><rect x="${x}" y="136" width="12" height="22" rx="3" fill="#C8CFD9"/>`; }
    return `<svg width="${w}" height="${w * .615}" viewBox="0 0 260 160">${pins}
      <rect x="30" y="20" width="200" height="120" rx="12" fill="${body}"/><path d="M30 64a16 16 0 0 1 0 32" fill="#ffffff22" stroke="#00000033" stroke-width="2"/>
      <circle cx="54" cy="116" r="7" fill="#ffffff33"/>
      <text x="138" y="96" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="46" fill="${txt}">${label}</text></svg>`;
  }
  function resistor(w = 150) {
    return `<svg width="${w}" height="${w * .4}" viewBox="0 0 150 60"><path d="M0 30h150" stroke="#C8CFD9" stroke-width="6"/>
      <rect x="35" y="12" width="80" height="36" rx="16" fill="#F2D7A6"/><rect x="50" y="12" width="8" height="36" fill="#8B4A2B"/><rect x="66" y="12" width="8" height="36" fill="#31445D"/><rect x="82" y="12" width="8" height="36" fill="#E0517F"/><rect x="100" y="12" width="6" height="36" fill="#E7B84A"/></svg>`;
  }
  function capacitor(w = 80) {
    return `<svg width="${w}" height="${w * 1.6}" viewBox="0 0 80 128"><path d="M30 92v36M50 92v36" stroke="#C8CFD9" stroke-width="6"/>
      <rect x="10" y="10" width="60" height="86" rx="14" fill="#5E8FD6"/><rect x="52" y="10" width="12" height="86" fill="#7FA8E3"/><ellipse cx="40" cy="12" rx="30" ry="8" fill="#9EC0EE"/><path d="M22 30h10" stroke="#fff" stroke-width="4"/></svg>`;
  }
  function diode(w = 130) {
    return `<svg width="${w}" height="${w * .4}" viewBox="0 0 130 52"><path d="M0 26h130" stroke="#C8CFD9" stroke-width="6"/><rect x="34" y="12" width="62" height="28" rx="12" fill="#31445D"/><rect x="80" y="12" width="9" height="28" fill="#E4E8EE"/></svg>`;
  }
  function lens(w = 560) {
    let tr = '';
    const ys = [70, 130, 190, 250, 310, 370, 430, 490];
    ys.forEach((y, i) => { tr += `<path class="trace" d="M40 ${y}H${180 + (i % 3) * 60}V${y + 40}H${400 + (i % 2) * 60}V${y}H520" fill="none" stroke="#E7B84A" stroke-width="7" stroke-linejoin="round"/>`; });
    let tx = '';
    for (let r = 0; r < 4; r++) for (let c = 0; c < 4; c++) tx += `<rect x="${110 + c * 100}" y="${100 + r * 110}" width="46" height="38" rx="6" fill="#9EC0EE" stroke="#fff" stroke-width="3"/>`;
    return `<svg width="${w}" height="${w}" viewBox="0 0 560 560"><defs><clipPath id="lc"><circle cx="280" cy="280" r="262"/></clipPath></defs>
      <circle cx="280" cy="280" r="276" fill="#fff"/><g clip-path="url(#lc)"><rect width="560" height="560" fill="#24324A"/>${tr}
      ${ys.map((y, i) => `<path class="pulse" d="M40 ${y}H${180 + (i % 3) * 60}V${y + 40}H${400 + (i % 2) * 60}V${y}H520" fill="none" stroke="#FFF3B0" stroke-width="9" stroke-linecap="round" stroke-dasharray="40 900"/>`).join('')}${tx}</g>
      <circle cx="280" cy="280" r="268" fill="none" stroke="#5E8FD6" stroke-width="16"/></svg>`;
  }
  function minicomp(w = 640) {
    return `<svg width="${w}" height="${w * .72}" viewBox="0 0 640 460">
      <rect x="0" y="420" width="640" height="40" rx="14" fill="#C3D6EF"/>
      <rect x="30" y="110" width="210" height="320" rx="16" fill="#E7EEF7" stroke="#C3D0E0" stroke-width="4"/><rect x="48" y="132" width="174" height="60" rx="8" fill="#31445D"/>
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<circle class="lamp2" cx="${66 + i * 23}" cy="162" r="7" fill="${i % 2 ? '#FFD36E' : '#5FDC9B'}"/>`).join('')}
      <rect x="48" y="214" width="174" height="12" rx="6" fill="#B9C6D8"/><rect x="48" y="240" width="120" height="12" rx="6" fill="#B9C6D8"/>
      <circle class="reel" style="transform-origin:135px 340px" cx="135" cy="340" r="54" fill="#95BFEF" stroke="#31445D" stroke-width="10" stroke-dasharray="30 12"/>
      <rect x="300" y="420" width="300" height="10" fill="#C3D6EF"/>
      <rect x="300" y="110" width="300" height="230" rx="22" fill="#DCE3EC" stroke="#C3D0E0" stroke-width="4"/><rect x="320" y="128" width="260" height="180" rx="12" fill="#10241B"/>
      <text class="term" x="338" y="172" font-family="monospace" font-weight="700" font-size="26" fill="#5FDC9B">READY</text>
      <text x="338" y="208" font-family="monospace" font-weight="700" font-size="22" fill="#5FDC9B" opacity=".7">RUN 10</text>
      <rect class="cursor" x="338" y="230" width="18" height="26" fill="#5FDC9B"/>
      <rect x="420" y="340" width="60" height="40" fill="#C3D0E0"/><rect x="310" y="378" width="280" height="44" rx="10" fill="#E7EEF7" stroke="#C3D0E0" stroke-width="4"/>
      ${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect x="${322 + i * 29}" y="388" width="22" height="10" rx="3" fill="#B9C6D8"/>`).join('')}</svg>`;
  }

  // ---------- generation 4 ----------
  function cpu(w = 320) {
    let pins = '';
    for (let i = 0; i < 9; i++) { const p = 46 + i * 26; pins += `<rect x="${p}" y="0" width="12" height="30" rx="3" fill="#E7B84A"/><rect x="${p}" y="290" width="12" height="30" rx="3" fill="#E7B84A"/><rect x="0" y="${p}" width="30" height="12" rx="3" fill="#E7B84A"/><rect x="290" y="${p}" width="30" height="12" rx="3" fill="#E7B84A"/>`; }
    return `<svg width="${w}" height="${w}" viewBox="0 0 320 320">${pins}<rect x="24" y="24" width="272" height="272" rx="26" fill="#2B2F3A"/>
      <rect class="die" x="80" y="80" width="160" height="160" rx="16" fill="#F6D77E" stroke="#B8862B" stroke-width="5"/>
      <path d="M100 120h40M180 120h40M100 200h40M180 200h40M120 100v40M200 100v40M120 180v40M200 180v40" stroke="#B8862B" stroke-width="4" opacity=".5"/>
      <text x="160" y="178" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="52" fill="#31445D">CPU</text></svg>`;
  }
  function i4004(w = 520) {
    let pins = '';
    for (let i = 0; i < 8; i++) { const x = 58 + i * 28; pins += `<rect x="${x}" y="0" width="14" height="30" rx="3" fill="#D9B45A"/><rect x="${x}" y="130" width="14" height="30" rx="3" fill="#D9B45A"/>`; }
    return `<svg width="${w}" height="${w * .5}" viewBox="0 0 320 160">${pins}<rect x="30" y="24" width="260" height="112" rx="10" fill="#F1ECE1" stroke="#D6CDBA" stroke-width="4"/>
      <rect x="30" y="66" width="260" height="28" fill="#B9B2A2"/><rect x="128" y="50" width="64" height="60" rx="6" fill="#D9B45A"/>
      <text x="160" y="125" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="20" fill="#6E6656">4004</text></svg>`;
  }
  function desktop(w = 300) {
    return `<svg width="${w}" height="${w * .9}" viewBox="0 0 340 306">
      <rect x="10" y="10" width="240" height="200" rx="18" fill="#EFE6D2" stroke="#D6CDBA" stroke-width="4"/><rect x="30" y="28" width="200" height="150" rx="12" fill="#2D5DA8"/>
      <rect x="44" y="44" width="90" height="60" rx="6" fill="#fff" opacity=".9"/><rect x="120" y="96" width="94" height="66" rx="6" fill="#F8CFE2"/>
      <rect x="100" y="210" width="60" height="26" fill="#D6CDBA"/><rect x="70" y="232" width="120" height="16" rx="6" fill="#E3D9C3"/>
      <rect x="262" y="40" width="70" height="210" rx="10" fill="#EFE6D2" stroke="#D6CDBA" stroke-width="4"/><rect x="274" y="60" width="46" height="10" rx="4" fill="#B9B2A2"/><rect x="274" y="80" width="46" height="10" rx="4" fill="#B9B2A2"/><circle cx="297" cy="220" r="8" fill="#5FDC9B"/>
      <rect x="20" y="262" width="220" height="38" rx="10" fill="#EFE6D2" stroke="#D6CDBA" stroke-width="4"/></svg>`;
  }
  function laptop(w = 290) {
    return `<svg width="${w}" height="${w * .72}" viewBox="0 0 320 230">
      <rect x="40" y="10" width="240" height="160" rx="14" fill="#5E6E85"/><rect x="52" y="22" width="216" height="136" rx="8" fill="#B8D9F8"/>
      <rect x="68" y="40" width="80" height="56" rx="6" fill="#fff"/><rect x="160" y="70" width="90" height="70" rx="6" fill="#F5A9C7"/>
      <path d="M10 178h300l-20 34H30z" fill="#C3CBD6"/><rect x="130" y="180" width="60" height="8" rx="4" fill="#9AA4B2"/></svg>`;
  }
  function phone(w = 150, glow = false) {
    const ap = ['#EE7FAA', '#95BFEF', '#5FDC9B', '#FFD36E', '#9C8FE6', '#F5A9C7', '#5E8FD6', '#FFB347', '#26A269'];
    return `<svg width="${w}" height="${w * 2}" viewBox="0 0 150 300"><rect x="4" y="4" width="142" height="292" rx="26" fill="#31445D"/><rect x="13" y="18" width="124" height="262" rx="16" fill="${glow ? '#EAF3FE' : '#DCEBFB'}"/>
      <rect x="55" y="9" width="40" height="7" rx="3.5" fill="#1F2B3B"/>
      ${ap.map((c, i) => `<rect x="${24 + (i % 3) * 38}" y="${44 + Math.floor(i / 3) * 44}" width="28" height="28" rx="8" fill="${c}"/>`).join('')}
      <rect x="24" y="200" width="104" height="56" rx="12" fill="#fff"/><path d="M36 218h70M36 236h50" stroke="#C3D0E0" stroke-width="7" stroke-linecap="round"/></svg>`;
  }
  function house(w = 300) {
    return `<svg width="${w}" height="${w * .9}" viewBox="0 0 300 270"><path d="M20 120L150 20l130 100" fill="none" stroke="#EE7FAA" stroke-width="18" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M50 110v150h200V110L150 34z" fill="#fff"/><rect x="80" y="140" width="140" height="90" rx="10" fill="#F1ECE1"/><rect x="92" y="150" width="76" height="54" rx="6" fill="#2D5DA8"/><rect x="176" y="168" width="32" height="56" rx="5" fill="#E3D9C3"/><rect x="96" y="212" width="80" height="12" rx="5" fill="#E3D9C3"/></svg>`;
  }
  function office(w = 300) {
    let win = '';
    for (let r = 0; r < 5; r++) for (let c = 0; c < 4; c++) win += `<rect class="ow" x="${66 + c * 44}" y="${60 + r * 40}" width="30" height="24" rx="4" fill="#B8D9F8"/>`;
    return `<svg width="${w}" height="${w * .9}" viewBox="0 0 300 270"><rect x="50" y="30" width="200" height="236" rx="14" fill="#fff"/>${win}<rect x="130" y="230" width="40" height="36" fill="#95BFEF"/></svg>`;
  }

  // ---------- generation 5 ----------
  const NET = (() => {
    const L = [[120, [90, 190, 290, 390]], [300, [60, 160, 260, 360, 440]], [480, [130, 240, 350]]];
    const nodes = [], edges = [];
    L.forEach(([x, ys], li) => ys.forEach(y => nodes.push({ x, y, li })));
    nodes.forEach(a => nodes.forEach(b => { if (b.li === a.li + 1) edges.push([a, b]); }));
    return { nodes, edges };
  })();
  function net(w = 600) {
    return `<svg width="${w}" height="${w * .84}" viewBox="0 0 600 504" style="overflow:visible">
      ${NET.edges.map(([a, b]) => `<path d="M${a.x} ${a.y + 20}L${b.x} ${b.y + 20}" stroke="#7FD8FF" stroke-opacity=".35" stroke-width="3"/>`).join('')}
      ${NET.nodes.map(n => `<circle class="nd" cx="${n.x}" cy="${n.y + 20}" r="24" fill="#1B2148" stroke="${n.li === 1 ? '#FF7FC8' : '#5BE0FF'}" stroke-width="7"/>`).join('')}
      <g class="pulses">${[...Array(10)].map(() => `<circle r="9" fill="#FFF3B0"/>`).join('')}</g></svg>`;
  }
  function chat(w = 300) {
    return `<svg width="${w}" height="${w * .6}" viewBox="0 0 300 180"><rect class="cb1" x="10" y="10" width="200" height="60" rx="24" fill="#fff"/><path d="M40 36h120M40 52h80" stroke="#C3D0E0" stroke-width="8" stroke-linecap="round"/>
      <rect class="cb2" x="80" y="92" width="210" height="76" rx="26" fill="#FF7FC8"/><path d="M106 118h150M106 142h100" stroke="#fff" stroke-width="8" stroke-linecap="round"/></svg>`;
  }
  function catPic(w = 300) {
    return `<svg width="${w}" height="${w * .66}" viewBox="0 0 300 198"><rect x="0" y="0" width="300" height="198" rx="20" fill="#FFE6B8"/><rect x="0" y="140" width="300" height="58" fill="#F5C98A"/>
      <path d="M110 70l-6-36 28 22h36l28-22-6 36c10 12 12 28 6 42-8 22-34 30-46 30s-38-8-46-30c-6-14-4-30 6-42z" fill="#8A5A3C"/>
      <circle cx="132" cy="96" r="7" fill="#1B2148"/><circle cx="168" cy="96" r="7" fill="#1B2148"/><path d="M144 112l6 6 6-6" fill="none" stroke="#1B2148" stroke-width="4" stroke-linecap="round"/>
      <rect class="bbox" x="88" y="26" width="124" height="134" rx="8" fill="none" stroke="#5BE0FF" stroke-width="6"/>
      <g class="btag"><rect x="88" y="0" width="124" height="30" rx="8" fill="#5BE0FF"/><text x="150" y="23" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="20" fill="#1B2148">แมว 98%</text></g></svg>`;
  }
  function learnChart(w = 300) {
    return `<svg width="${w}" height="${w * .62}" viewBox="0 0 300 186"><rect x="0" y="0" width="300" height="186" rx="20" fill="#24305E"/>
      <path d="M30 150H280M30 150V20" stroke="#5E6E9E" stroke-width="4"/>
      <path class="lc" d="M34 140C70 130 90 100 120 90S170 54 200 46S250 32 276 30" fill="none" stroke="#5FDC9B" stroke-width="8" stroke-linecap="round" pathLength="100" stroke-dasharray="100 100"/>
      ${[[60, 128], [100, 104], [150, 72], [200, 50], [250, 36]].map(([x, y]) => `<circle class="lp" cx="${x}" cy="${y}" r="7" fill="#FFF3B0"/>`).join('')}</svg>`;
  }
  function dataChart(w = 300) {
    return `<svg width="${w}" height="${w * .62}" viewBox="0 0 300 186"><rect x="0" y="0" width="300" height="186" rx="20" fill="#24305E"/>
      ${[.5, .8, .4, .95, .65].map((v, i) => `<rect class="db" x="${30 + i * 34}" y="${160 - v * 120}" width="24" height="${v * 120}" rx="6" fill="${i % 2 ? '#FF7FC8' : '#5BE0FF'}" style="transform-box:fill-box;transform-origin:50% 100%"/>`).join('')}
      <circle cx="238" cy="96" r="44" fill="#5BE0FF"/><path d="M238 96V52A44 44 0 0 1 280 108Z" fill="#FF7FC8"/><path d="M238 96L280 108A44 44 0 0 1 250 138Z" fill="#FFD36E"/></svg>`;
  }
  function brainIcon(s = 60, c = '#fff') {
    return `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M9 3a3 3 0 0 0-3 3 3 3 0 0 0-2 5 3 3 0 0 0 1 5 3 3 0 0 0 4 4V3zM15 3a3 3 0 0 1 3 3 3 3 0 0 1 2 5 3 3 0 0 1-1 5 3 3 0 0 1-4 4V3z" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M9 9h-2M9 14h-3M15 9h2M15 14h3" stroke="${c}" stroke-width="2" stroke-linecap="round"/></svg>`;
  }
  function clock(w = 300) {
    return `<svg width="${w}" height="${w}" viewBox="0 0 300 300"><circle cx="150" cy="150" r="140" fill="#fff" stroke="#95BFEF" stroke-width="14"/>
      ${[...Array(12)].map((_, i) => `<path d="M150 22v20" stroke="#31445D" stroke-width="${i % 3 ? 4 : 8}" stroke-linecap="round" transform="rotate(${i * 30} 150 150)"/>`).join('')}
      <g class="hm" style="transform-origin:150px 150px"><path d="M150 150V70" stroke="#31445D" stroke-width="12" stroke-linecap="round"/></g>
      <g class="hh" style="transform-origin:150px 150px"><path d="M150 150V96" stroke="#EE7FAA" stroke-width="14" stroke-linecap="round"/></g><circle cx="150" cy="150" r="14" fill="#31445D"/>
      <path d="M44 74A130 130 0 0 1 120 24" fill="none" stroke="#EE7FAA" stroke-width="10" stroke-linecap="round"/><path d="M30 60l14 18 20-10" fill="none" stroke="#EE7FAA" stroke-width="10" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  }
  // tiny era icons (badges, HUD, summary)
  function eraIcon(n, s = 90) {
    if (n === 1) return `<div style="width:${s}px;height:${s}px;display:grid;place-items:center">${tube(s * .48)}</div>`;
    if (n === 2) return `<div style="width:${s}px;height:${s}px;display:grid;place-items:center">${transistor(s * .52)}</div>`;
    if (n === 3) return `<div style="width:${s}px;height:${s}px;display:grid;place-items:center">${chip(s * .86)}</div>`;
    if (n === 4) return `<div style="width:${s}px;height:${s}px;display:grid;place-items:center">${cpu(s * .72)}</div>`;
    return `<div style="width:${s}px;height:${s}px;display:grid;place-items:center;border-radius:50%;background:radial-gradient(circle,#2C1D59,#1B2148)">${brainIcon(s * .6, '#5BE0FF')}</div>`;
  }
  window.ART = { tube, eniac, thermo, gauge, bolt, flame, bigIcon, transistor, mainframe, chip, resistor, capacitor, diode, lens, minicomp, cpu, i4004, desktop, laptop, phone, house, office, net, NET, chat, catPic, learnChart, dataChart, brainIcon, clock, eraIcon };
})();
