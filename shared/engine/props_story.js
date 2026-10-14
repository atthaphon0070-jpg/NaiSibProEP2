// NaiSibPro 2.5D story kit (shared, EP04+).
// Jointed SVG character rig with poses/expressions, a consistent wallet prop with
// stylized (non-official) banknotes, a layered pastel Thai street with a parallax
// camera, café set pieces and thought bubbles. All illustrations are original.
// EP05 adds looks F (sender, woman) and R (receiver, man), a phone held in the right hand
// (pose {phone:1, phoneGlow}) and the 'grin' expression. Older looks render exactly as before.
(function () {
  const { h, clamp, lerp, E } = window.NSP;
  let uid = 0;

  // ------------------------------------------------------------------ wallet
  // Same drawing everywhere (ground, hand, panels) so the prop stays consistent.
  function walletSVG(id) {
    return `<defs>
      <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#A86B36"/><stop offset="1" stop-color="#6E4220"/></linearGradient>
      <linearGradient id="${id}i" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C08A57"/><stop offset="1" stop-color="#93602F"/></linearGradient></defs>
      <g class="w-closed">
        <rect x="-50" y="-34" width="100" height="68" rx="13" fill="url(#${id}b)"/>
        <rect x="-43" y="-27" width="86" height="54" rx="9" fill="none" stroke="#E2BE8E" stroke-width="2.4" stroke-dasharray="5 4"/>
        <path d="M-50 -10 Q0 4 50 -10 L50 -20 Q50 -34 37 -34 L-37 -34 Q-50 -34 -50 -20Z" fill="#8C5529"/>
        <circle cx="0" cy="-2" r="6" fill="#E9C79A"/><circle cx="-2" cy="-4" r="2" fill="#fff" opacity=".7"/>
        <path d="M-40 -28 Q-10 -33 20 -30" stroke="rgba(255,255,255,.35)" stroke-width="4" fill="none" stroke-linecap="round"/></g>
      <g class="w-open">
        <g class="w-notes">
          <rect x="-86" y="-66" width="76" height="42" rx="6" fill="#C9EBD6" stroke="#8CCBA7" stroke-width="2" transform="rotate(-8 -48 -45)"/>
          <rect x="-40" y="-72" width="76" height="42" rx="6" fill="#E3DAF7" stroke="#B3A4E6" stroke-width="2" transform="rotate(4 -2 -51)"/>
          <rect x="8" y="-64" width="76" height="42" rx="6" fill="#C9EBD6" stroke="#8CCBA7" stroke-width="2" transform="rotate(10 46 -43)"/>
          <circle cx="-48" cy="-46" r="10" fill="#fff" opacity=".9"/><text x="-48" y="-41" font-size="14" font-weight="800" text-anchor="middle" fill="#3E9C6B" font-family="Prompt">฿</text>
          <circle cx="46" cy="-44" r="10" fill="#fff" opacity=".9"/><text x="46" y="-39" font-size="14" font-weight="800" text-anchor="middle" fill="#3E9C6B" font-family="Prompt">฿</text></g>
        <rect x="-100" y="-34" width="98" height="68" rx="12" fill="url(#${id}b)"/>
        <rect x="2" y="-34" width="98" height="68" rx="12" fill="url(#${id}b)"/>
        <rect x="-92" y="-26" width="82" height="52" rx="8" fill="url(#${id}i)"/>
        <rect x="10" y="-26" width="82" height="52" rx="8" fill="url(#${id}i)"/>
        <rect x="-86" y="-6" width="70" height="10" rx="4" fill="#7E5028" opacity=".5"/><rect x="-86" y="10" width="70" height="10" rx="4" fill="#7E5028" opacity=".5"/>
        <rect x="18" y="-18" width="66" height="34" rx="6" fill="#F7F1E6"/><rect x="24" y="-12" width="20" height="14" rx="3" fill="#E7C66E"/>
        <rect x="-4" y="-34" width="8" height="68" rx="4" fill="#5E3818"/></g>`;
  }
  // standalone wallet (DOM) with .set(open 0..1)
  function wallet(scale = 1) {
    const id = 'wl' + (++uid);
    const el = h(`<svg width="${220 * scale}" height="${160 * scale}" viewBox="-110 -80 220 160" style="overflow:visible">${walletSVG(id)}</svg>`);
    const c = el.querySelector('.w-closed'), o = el.querySelector('.w-open');
    el.set = (open) => { c.style.opacity = 1 - clamp(open * 2); o.style.opacity = clamp(open * 2 - .6); o.setAttribute('transform', `scale(${lerp(.55, 1, E.out(clamp(open)))} 1)`); };
    el.set(0);
    return el;
  }

  // ------------------------------------------------------------------ phone (EP05)
  // small smartphone held in the hand; centred on the grip point, screen facing the camera
  function phoneSVG(id) {
    return `<defs><linearGradient id="${id}ps" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EAF5FF"/><stop offset="1" stop-color="#B8D9F8"/></linearGradient></defs>
      <g transform="translate(0 -40)">
        <rect x="-27" y="-50" width="54" height="100" rx="12" fill="#3C4660"/>
        <rect x="-23" y="-45" width="46" height="88" rx="8" fill="url(#${id}ps)"/>
        <rect x="-17" y="-36" width="34" height="10" rx="4" fill="#95BFEF"/><rect x="-17" y="-20" width="34" height="18" rx="5" fill="#fff"/>
        <rect x="-17" y="4" width="22" height="6" rx="3" fill="#F5A9C7"/><rect x="-17" y="16" width="30" height="6" rx="3" fill="#D3E3F6"/>
        <rect x="-8" y="-48" width="16" height="4" rx="2" fill="#2A3248"/>
        <rect class="ph-glow" x="-30" y="-53" width="60" height="106" rx="14" fill="none" stroke="#FFE38A" stroke-width="6" opacity="0"/></g>`;
  }

  // ------------------------------------------------------------------ characters
  const LOOKS = {
    // Character A — finder: ~25–30, short dark spiky hair, light-blue casual shirt, dark trousers, white sneakers
    A: { skin: '#F4CFB2', skinD: '#E3AE8C', hair: '#2A2933', shirt: '#A9D1F5', shirtD: '#7FB2E3', collar: '#E6F2FD', pants: '#3A4660', pantsD: '#2B3549', shoe: '#FFFFFF', sole: '#D6DCE6', sleeves: 'short', style: 'spiky' },
    // Character B — owner: ~30–40, neat short black hair, cream shirt, dark-blue trousers, brown shoes, small mustache
    B: { skin: '#EBC09E', skinD: '#D29E7C', hair: '#121219', shirt: '#F4E7CC', shirtD: '#DCC9A3', collar: '#FFF8EA', pants: '#2C4A7C', pantsD: '#213962', shoe: '#7A4A26', sole: '#5A3418', sleeves: 'long', style: 'neat', belt: '#5B3A20', mustache: true },
    // Character C — a different person used only in the theft illustration: grey hoodie, black cap
    C: { skin: '#E8B996', skinD: '#CF9A78', hair: '#1D1D22', shirt: '#9DA6B8', shirtD: '#7E889C', collar: '#B9C1D0', pants: '#3B3F4A', pantsD: '#2C2F38', shoe: '#E46C6C', sole: '#FFFFFF', sleeves: 'long', style: 'cap', hood: true },
    // F — sender (EP05): woman ~25, shoulder-length dark-brown bob with bangs and a pink clip, pink blouse with bow, lavender A-line skirt, white sneakers
    F: { skin: '#F7D5BF', skinD: '#E8B79A', hair: '#3B2A2C', shirt: '#F7B9D1', shirtD: '#EE97B9', collar: '#FFF1F7', pants: '#F7D5BF', pantsD: '#E8B79A', shoe: '#FFFFFF', sole: '#F5A9C7', sleeves: 'short', style: 'bob', hairBack: true, lashes: true, skirt: '#C7B7EE', skirtD: '#A996DD', bow: '#EE7FAA', clip: '#FF8FB8' },
    // R — receiver (EP05): man ~30, tousled black hair, mint T-shirt with a round print, denim trousers, grey sneakers, light stubble
    R: { skin: '#E3B48F', skinD: '#C99673', hair: '#17171D', shirt: '#9FDCC0', shirtD: '#6FC09B', collar: '#9FDCC0', pants: '#5873A6', pantsD: '#435C8C', shoe: '#E9ECF2', sole: '#AEB6C6', sleeves: 'short', style: 'messy', tee: true, print: '#FFFFFF', stubble: true },
  };
  const HAIR = {
    spiky: c => `<path d="M-86 -92 C-94 -170 -40 -194 2 -192 C52 -194 96 -168 86 -92 L74 -112 L64 -132 L48 -116 L34 -138 L16 -120 L0 -142 L-18 -122 L-34 -140 L-50 -118 L-66 -130 L-74 -108Z" fill="${c.hair}"/>
             <path d="M-40 -170 Q-6 -186 30 -176" stroke="rgba(255,255,255,.18)" stroke-width="8" fill="none" stroke-linecap="round"/>`,
    neat: c => `<path d="M-88 -88 C-96 -170 -30 -196 12 -190 C64 -188 96 -160 88 -90 C82 -122 60 -142 26 -146 C4 -146 -20 -132 -44 -136 C-64 -140 -80 -122 -88 -88Z" fill="${c.hair}"/>
             <path d="M-28 -150 Q-6 -176 30 -180" stroke="rgba(255,255,255,.22)" stroke-width="5" fill="none" stroke-linecap="round"/>
             <rect x="-88" y="-104" width="12" height="34" rx="6" fill="${c.hair}"/><rect x="76" y="-104" width="12" height="34" rx="6" fill="${c.hair}"/>`,
    cap: c => `<path d="M-86 -100 C-90 -176 -36 -196 4 -194 C52 -194 92 -170 86 -100Z" fill="#26262E"/>
             <path d="M-30 -112 Q40 -126 112 -104 Q118 -96 104 -94 Q40 -104 -30 -100Z" fill="#33333D"/>
             <circle cx="4" cy="-192" r="7" fill="#33333D"/><path d="M-60 -166 Q-20 -184 30 -178" stroke="rgba(255,255,255,.15)" stroke-width="7" fill="none" stroke-linecap="round"/>`,
    bob: c => `<path d="M-90 -92 C-100 -178 -36 -200 4 -198 C56 -198 100 -176 90 -92 C84 -126 66 -142 44 -140 C24 -150 4 -132 -12 -126 C-28 -140 -52 -146 -66 -128 C-78 -118 -86 -104 -90 -92Z" fill="${c.hair}"/>
             <path d="M-92 -110 C-104 -60 -100 -20 -84 6 C-80 -30 -78 -70 -74 -104Z" fill="${c.hair}"/><path d="M92 -110 C104 -60 100 -20 84 6 C80 -30 78 -70 74 -104Z" fill="${c.hair}"/>
             <path d="M-46 -176 Q-6 -194 36 -182" stroke="rgba(255,255,255,.22)" stroke-width="8" fill="none" stroke-linecap="round"/>
             <g transform="translate(62 -150) rotate(20)"><rect x="-22" y="-7" width="44" height="14" rx="7" fill="${c.clip}"/><circle cx="-10" cy="0" r="3" fill="#fff" opacity=".8"/></g>`,
    messy: c => `<path d="M-88 -90 C-98 -168 -44 -198 4 -196 C58 -196 100 -168 88 -90 L80 -116 C72 -138 54 -150 34 -146 L44 -128 C26 -134 14 -146 4 -152 L-2 -130 C-16 -142 -34 -146 -48 -138 L-44 -120 C-60 -128 -74 -122 -80 -110Z" fill="${c.hair}"/>
             <path d="M-30 -196 L-20 -214 L-8 -198 L6 -218 L16 -198 L34 -208 L30 -190Z" fill="${c.hair}"/>
             <rect x="-90" y="-112" width="12" height="36" rx="6" fill="${c.hair}"/><rect x="78" y="-112" width="12" height="36" rx="6" fill="${c.hair}"/>
             <path d="M-36 -170 Q0 -188 40 -176" stroke="rgba(255,255,255,.16)" stroke-width="7" fill="none" stroke-linecap="round"/>`,
  };
  // hair drawn behind the head (long styles)
  const HAIRBACK = {
    bob: c => `<path d="M-96 -112 C-108 -206 108 -206 96 -112 C100 -60 106 -14 96 14 Q76 30 52 10 L-52 10 Q-76 30 -96 14 C-106 -14 -100 -60 -96 -112Z" fill="${c.hair}"/>`,
  };
  const MOUTHS = {
    smile: `<path d="M-18 -60 Q0 -42 18 -60" stroke="#8A3D3D" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    happy: `<path d="M-22 -62 Q0 -28 22 -62Z" fill="#A7404F"/><path d="M-10 -44 Q0 -38 10 -44 Q0 -50 -10 -44Z" fill="#F08A9A"/>`,
    surprise: `<ellipse cx="0" cy="-54" rx="11" ry="14" fill="#8A3D3D"/><ellipse cx="0" cy="-47" rx="6" ry="4" fill="#F08A9A"/>`,
    worried: `<path d="M-16 -50 Q-8 -58 0 -54 Q8 -50 16 -58" stroke="#8A3D3D" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    sly: `<path d="M-18 -58 Q4 -50 22 -66" stroke="#8A3D3D" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    neutral: `<path d="M-12 -56 L12 -56" stroke="#8A3D3D" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    curious: `<path d="M-10 -55 Q0 -50 10 -57" stroke="#8A3D3D" stroke-width="5" fill="none" stroke-linecap="round"/>`,
    grin: `<path d="M-24 -62 Q2 -36 26 -68 Q2 -54 -24 -62Z" fill="#A7404F"/><path d="M-20 -61 Q2 -54 23 -65 L21 -60 Q2 -50 -18 -57Z" fill="#fff"/>`,
  };
  // brow pose per expression: [left rot, right rot, dy]
  // left brow: negative = inner end up (worried); positive = inner end down (scheming)
  const BROWS = { smile: [0, 0, 0], happy: [-6, 6, -6], surprise: [-6, 6, -14], worried: [-20, 20, -4], sly: [14, -10, 0], neutral: [0, 0, 0], curious: [-4, 12, -8], grin: [16, -16, 2] };

  function character(kind) {
    const c = LOOKS[kind], id = 'ch' + (++uid);
    const leg = (side) => `<g transform="translate(${side * 30} 0)"><g class="th${side < 0 ? 'L' : 'R'}">
        <rect x="-25" y="-4" width="50" height="108" rx="22" fill="${c.pants}"/><rect x="${side < 0 ? -25 : 9}" y="0" width="16" height="100" rx="8" fill="${c.pantsD}" opacity=".5"/>
        <g class="sh${side < 0 ? 'L' : 'R'}" transform="translate(0 100)">
          <rect x="-23" y="-6" width="46" height="104" rx="20" fill="${c.pants}"/>
          <ellipse cx="${side * 8}" cy="106" rx="36" ry="21" fill="${c.shoe}" stroke="${c.sole}" stroke-width="3"/>
          <path d="M${side * 8 - 30} 114 Q${side * 8} 124 ${side * 8 + 30} 114" stroke="${c.sole}" stroke-width="6" fill="none" stroke-linecap="round"/>
          <ellipse cx="${side * 8 - 8}" cy="98" rx="12" ry="6" fill="#fff" opacity=".45"/></g></g></g>`;
    const arm = (side) => {
      const long = c.sleeves === 'long';
      return `<g transform="translate(${side * 74} -152)"><g class="ua${side < 0 ? 'L' : 'R'}">
          <rect x="-21" y="-12" width="42" height="${long ? 84 : 66}" rx="19" fill="${c.shirt}"/><rect x="${side < 0 ? -21 : 7}" y="-6" width="14" height="${long ? 72 : 54}" rx="7" fill="${c.shirtD}" opacity=".55"/>
          <g class="fa${side < 0 ? 'L' : 'R'}" transform="translate(0 70)">
            ${long ? `<rect x="-19" y="-10" width="38" height="62" rx="17" fill="${c.shirt}"/><rect x="-20" y="44" width="40" height="12" rx="6" fill="${c.collar}"/>` : `<rect x="-16" y="-8" width="32" height="66" rx="15" fill="${c.skin}"/>`}
            <circle cx="0" cy="70" r="21" fill="${c.skin}"/><circle cx="${-side * 7}" cy="64" r="8" fill="${c.skinD}" opacity=".35"/>
            ${side > 0 ? `<g class="hold" transform="translate(0 70)"><g class="hold-w" style="display:none" transform="scale(.62)">${walletSVG(id + 'w')}</g>${c.style === 'bob' || c.style === 'messy' ? `<g class="hold-p" style="display:none">${phoneSVG(id)}</g>` : ''}</g>` : ''}
          </g></g></g>`;
    };
    const el = h(`<svg width="420" height="660" viewBox="-210 -640 420 660" style="overflow:visible;position:absolute;left:-210px;top:-640px">
      <ellipse class="shadow" cx="0" cy="0" rx="96" ry="17" fill="rgba(60,50,90,.22)"/>
      <g class="rootg">
        <g class="legs" transform="translate(0 -224)">${leg(-1)}${leg(1)}</g>
        <g class="up" transform="translate(0 -224)">
          <rect x="-66" y="-14" width="132" height="40" rx="18" fill="${c.pants}"/>
          ${c.belt ? `<rect x="-66" y="-16" width="132" height="14" rx="6" fill="${c.belt}"/><rect x="-10" y="-17" width="20" height="16" rx="3" fill="#D8B47A"/>` : ''}
          <g class="pocket-w" style="display:none" transform="translate(48 -6) scale(.5) rotate(-12)">${walletSVG(id + 'p')}</g>
          ${arm(-1)}
          <path d="M-66 ${c.belt ? -14 : 10} Q-72 -80 -80 -146 Q-78 -170 -50 -174 L50 -174 Q78 -170 80 -146 Q72 -80 66 ${c.belt ? -14 : 10} Q0 ${c.belt ? -8 : 18} -66 ${c.belt ? -14 : 10}Z" fill="${c.shirt}"/>
          <path d="M40 -170 Q74 -160 78 -140 Q70 -80 64 0 L44 4 Q52 -80 40 -170Z" fill="${c.shirtD}" opacity=".45"/>
          ${c.hood ? `<path d="M-58 -176 Q0 -140 58 -176 Q62 -150 0 -132 Q-62 -150 -58 -176Z" fill="${c.shirtD}"/><rect x="-46" y="-80" width="92" height="40" rx="14" fill="${c.shirtD}" opacity=".6"/><path d="M-10 -150 L-14 -112 M10 -150 L14 -112" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`
                   : c.tee ? `<path d="M-30 -174 Q0 -150 30 -174" stroke="${c.shirtD}" stroke-width="7" fill="none" stroke-linecap="round"/>`
                   : `<path d="M-30 -174 L0 -146 L30 -174 L18 -176 L0 -160 L-18 -176Z" fill="${c.collar}"/>`}
          ${kind === 'B' ? `<path d="M0 -146 L0 -14" stroke="${c.shirtD}" stroke-width="3"/>${[-120, -84, -48].map(y => `<circle cx="0" cy="${y}" r="4" fill="${c.shirtD}"/>`).join('')}` : ''}
          ${kind === 'A' ? `<rect x="-52" y="-136" width="34" height="30" rx="6" fill="none" stroke="${c.shirtD}" stroke-width="3"/>` : ''}
          ${c.skirt ? `<path d="M-70 -20 L-92 92 Q0 108 92 92 L70 -20 Q0 -10 -70 -20Z" fill="${c.skirt}"/><path d="M40 -16 L58 96 L82 93 L66 -18Z" fill="${c.skirtD}" opacity=".6"/><path d="M-30 -14 L-40 100 M10 -12 L12 104" stroke="${c.skirtD}" stroke-width="3" opacity=".5"/>` : ''}
          ${c.bow ? `<g transform="translate(0 -160)"><path d="M0 0 L-26 -14 Q-32 0 -26 14Z M0 0 L26 -14 Q32 0 26 14Z" fill="${c.bow}"/><circle r="7" fill="${c.bow}"/><circle r="3" cx="-2" cy="-2" fill="#fff" opacity=".6"/></g>` : ''}
          ${c.print ? `<circle cx="0" cy="-96" r="30" fill="${c.print}" opacity=".7"/><path d="M0 -118 L6 -103 L22 -102 L10 -92 L14 -76 L0 -85 L-14 -76 L-10 -92 L-22 -102 L-6 -103Z" fill="${c.shirtD}"/>` : ''}
          ${arm(1)}
          <rect x="-17" y="-186" width="34" height="26" rx="10" fill="${c.skinD}"/>
          <g class="head" transform="translate(0 -172)">
            ${c.hairBack ? HAIRBACK[c.style](c) : ''}
            <circle cx="-80" cy="-86" r="18" fill="${c.skin}"/><circle cx="80" cy="-86" r="18" fill="${c.skin}"/>
            <circle cx="-80" cy="-86" r="9" fill="${c.skinD}" opacity=".5"/><circle cx="80" cy="-86" r="9" fill="${c.skinD}" opacity=".5"/>
            <ellipse cx="0" cy="-90" rx="83" ry="87" fill="${c.skin}"/>
            <ellipse cx="-26" cy="-128" rx="40" ry="22" fill="#fff" opacity=".18"/>
            <g class="face">
              <ellipse cx="-52" cy="-66" rx="15" ry="8" fill="#F59BB0" opacity=".45"/><ellipse cx="52" cy="-66" rx="15" ry="8" fill="#F59BB0" opacity=".45"/>
              ${c.stubble ? `<path d="M-46 -52 Q0 -14 46 -52 Q40 -26 0 -18 Q-40 -26 -46 -52Z" fill="${c.hair}" opacity=".12"/>` : ''}
              <g class="eyeL" transform="translate(-30 -92)"><g class="eyeLs">${c.lashes ? '<path d="M-8 -11 L-16 -18 M-3 -13 L-8 -21" stroke="#2B2A33" stroke-width="3.4" stroke-linecap="round"/>' : ''}<ellipse rx="11" ry="14" fill="#2B2A33"/><g class="pupL"><circle cx="-3" cy="-5" r="4.2" fill="#fff"/><circle cx="4" cy="4" r="2" fill="#fff" opacity=".8"/></g></g></g>
              <g class="eyeR" transform="translate(30 -92)"><g class="eyeRs">${c.lashes ? '<path d="M8 -11 L16 -18 M3 -13 L8 -21" stroke="#2B2A33" stroke-width="3.4" stroke-linecap="round"/>' : ''}<ellipse rx="11" ry="14" fill="#2B2A33"/><g class="pupR"><circle cx="-3" cy="-5" r="4.2" fill="#fff"/><circle cx="4" cy="4" r="2" fill="#fff" opacity=".8"/></g></g></g>
              <path class="brL" d="M-44 -118 Q-30 -126 -16 -120" stroke="${c.hair}" stroke-width="${kind === 'B' ? 8 : 6}" fill="none" stroke-linecap="round"/>
              <path class="brR" d="M16 -120 Q30 -126 44 -118" stroke="${c.hair}" stroke-width="${kind === 'B' ? 8 : 6}" fill="none" stroke-linecap="round"/>
              <path d="M-4 -76 Q0 -70 4 -76" stroke="${c.skinD}" stroke-width="4" fill="none" stroke-linecap="round"/>
              ${c.mustache ? `<path d="M-20 -64 Q-10 -70 0 -66 Q10 -70 20 -64 Q10 -60 0 -62 Q-10 -60 -20 -64Z" fill="${c.hair}"/>` : ''}
              <g class="mouth">${Object.entries(MOUTHS).map(([k, v]) => `<g data-m="${k}" style="display:none">${v}</g>`).join('')}</g>
            </g>
            ${HAIR[c.style](c)}
            <path class="sweat" d="M70 -140 Q80 -122 70 -116 Q60 -122 70 -140Z" fill="#B8E0FF" stroke="#fff" stroke-width="2" style="display:none"/>
          </g>
        </g>
      </g></svg>`);
    const q = s => el.querySelector(s);
    const P = {
      root: q('.rootg'), up: q('.up'), thL: q('.thL'), thR: q('.thR'), shL: q('.shL'), shR: q('.shR'),
      uaL: q('.uaL'), uaR: q('.uaR'), faL: q('.faL'), faR: q('.faR'), head: q('.head'), face: q('.face'),
      eyeLs: q('.eyeLs'), eyeRs: q('.eyeRs'), pupL: q('.pupL'), pupR: q('.pupR'), brL: q('.brL'), brR: q('.brR'),
      mouths: [...el.querySelectorAll('[data-m]')], holdW: q('.hold-w'), pocketW: q('.pocket-w'), sweat: q('.sweat'), shadow: q('.shadow'),
      holdP: q('.hold-p'), phGlow: q('.ph-glow'),
    };
    const hw = P.holdW, hwC = hw.querySelector('.w-closed'), hwO = hw.querySelector('.w-open');
    const pw = P.pocketW;
    pw.querySelector('.w-open').style.display = 'none';
    // pose: walk phase/amount, crouch 0..1, lean deg, arms [upper,fore] (+ = outward/up), tilt, turn -1..1, expr, blink, look, wallet hold/open/pocket
    el.pose = (p = {}) => {
      const wa = p.walkAmt || 0, ph = p.walk || 0, cr = p.crouch || 0;
      const sw = Math.sin(ph) * wa;
      const lift = Math.max(0, Math.sin(ph)) * wa, liftR = Math.max(0, -Math.sin(ph)) * wa;
      const a1 = 66 * cr, a2 = -4 * cr;   // knees-out squat, shins stay upright
      const tL = a1 + sw * 14, tR = -a1 + sw * 14;
      const sL = (a2 - a1) - lift * 30, sR = -(a2 - a1) + liftR * 30;
      P.thL.setAttribute('transform', `rotate(${tL})`); P.thR.setAttribute('transform', `rotate(${tR})`);
      P.shL.setAttribute('transform', `translate(0 100) rotate(${sL})`); P.shR.setAttribute('transform', `translate(0 100) rotate(${sR})`);
      const legH = 100 * Math.cos(a1 * Math.PI / 180) + 124 * Math.cos(a2 * Math.PI / 180);
      const bob = -Math.abs(Math.sin(ph)) * 8 * wa + (p.bob || 0);
      const hipY = -legH + bob;
      el.querySelector('.legs').setAttribute('transform', `translate(0 ${hipY})`);
      const breathe = 1 + .012 * Math.sin((p.t || 0) * 2.4);
      P.up.setAttribute('transform', `translate(0 ${hipY}) rotate(${p.lean || 0}) scale(1 ${breathe})`);
      const aL = p.armL || [8 - sw * 16, -6], aR = p.armR || [8 + sw * 16, -6];
      P.uaL.setAttribute('transform', `rotate(${aL[0]})`); P.faL.setAttribute('transform', `translate(0 70) rotate(${aL[1]})`);
      P.uaR.setAttribute('transform', `rotate(${-aR[0]})`); P.faR.setAttribute('transform', `translate(0 70) rotate(${-aR[1]})`);
      P.head.setAttribute('transform', `translate(0 -172) rotate(${p.tilt || 0} 0 -40)`);
      const tu = p.turn || 0;
      P.face.setAttribute('transform', `translate(${tu * 16} ${(p.lookY || 0) * 3})`);
      const ex = p.expr || 'smile';
      P.mouths.forEach(m => m.style.display = m.dataset.m === ex ? '' : 'none');
      const br = BROWS[ex] || BROWS.smile;
      P.brL.setAttribute('transform', `translate(0 ${br[2]}) rotate(${br[0]} -30 -120)`); P.brR.setAttribute('transform', `translate(0 ${br[2]}) rotate(${br[1]} 30 -120)`);
      const big = ex === 'surprise' ? 1.18 : 1, bl = 1 - (p.blink || 0) * .9;
      P.eyeLs.setAttribute('transform', `scale(${big} ${big * bl})`); P.eyeRs.setAttribute('transform', `scale(${big} ${big * bl})`);
      const lx = (p.lookX || 0) * 4, ly = (p.lookY || 0) * 4;
      P.pupL.setAttribute('transform', `translate(${lx} ${ly})`); P.pupR.setAttribute('transform', `translate(${lx} ${ly})`);
      P.sweat.style.display = p.sweat ? '' : 'none';
      // wallet in right hand, counter-rotated to stay upright
      const hold = p.hold || 0;
      hw.style.display = hold ? '' : 'none';
      if (hold) {
        const o = p.walletOpen || 0;
        hwC.style.opacity = 1 - clamp(o * 2); hwO.style.opacity = clamp(o * 2 - .6);
        hwO.setAttribute('transform', `scale(${lerp(.55, 1, E.out(clamp(o)))} 1)`);
        hw.setAttribute('transform', `rotate(${aR[0] + aR[1] - (p.lean || 0)}) scale(${.62 * (p.walletScale || 1)})`);
      }
      pw.style.display = p.pocket ? '' : 'none';
      if (P.holdP) {   // phone in right hand (EP05 looks), counter-rotated like the wallet; screen faces the camera
        P.holdP.style.display = p.phone ? '' : 'none';
        if (p.phone) { P.holdP.setAttribute('transform', `rotate(${aR[0] + aR[1] - (p.lean || 0) + (p.phoneTilt || 0)}) scale(${p.phoneScale || 1})`); P.phGlow.style.opacity = p.phoneGlow || 0; }
      }
      P.shadow.setAttribute('rx', 96 - cr * 6);
      el._k = { hipY, lean: p.lean || 0, aR };
    };
    // right-hand position in character-local units (feet at 0,0), from the last pose (forward kinematics)
    el.handR = () => {
      const { hipY, lean, aR } = el._k, r = d => d * Math.PI / 180;
      const rot = (a, x, y) => [x * Math.cos(a) - y * Math.sin(a), x * Math.sin(a) + y * Math.cos(a)];
      const t1 = r(-aR[0]), t2 = r(-aR[1]);
      const f = rot(t2, 0, 70), ua = rot(t1, 0 + f[0], 70 + f[1]);
      const up = [74 + ua[0], -152 + ua[1]], w = rot(r(lean), up[0], up[1]);
      return { x: w[0], y: hipY + w[1] };
    };
    el.pose({});
    return el;
  }
  // blink helper: deterministic blinks every ~3.1s
  const blinkAt = (t, seed = 0) => { const u = (t + seed) % 3.1; return u < .12 ? Math.sin(u / .12 * Math.PI) : 0; };

  // ------------------------------------------------------------------ city set (2400 × 1920 world)
  function city(root) {
    const layer = (cls, p, html) => { const el = h(`<div class="lyr ${cls}" style="position:absolute;left:0;top:0;width:2400px;height:1920px;transform-origin:0 0">${html}</div>`); el.p = p; root.appendChild(el); return el; };
    const SH = [['#F8CFE2', '#EE9FBF', 'ร้านกาแฟ'], ['#CFE3FA', '#8FB7E6', 'ร้านขนม'], ['#FFF1C9', '#F0C76E', 'ร้านดอกไม้'], ['#D6F0E2', '#8CCBA7', 'ร้านหนังสือ'], ['#FFDCC8', '#F2A67E', 'ร้านข้าว'], ['#E6DDF8', '#B3A4E6', 'ร้านผลไม้'], ['#F8CFE2', '#EE9FBF', 'ร้านชา'], ['#CFE3FA', '#8FB7E6', 'ร้านเบเกอรี่']];
    const shop = (x, w, hgt, i) => {
      const [col, acc, name] = SH[i % SH.length], top = 1190 - hgt;
      const win = (wx, wy) => `<div style="position:absolute;left:${wx}px;top:${wy}px;width:62px;height:78px;border-radius:12px 12px 6px 6px;background:linear-gradient(180deg,#EAF5FF,#BFD9F2);box-shadow:inset 0 0 0 6px #fff"><div style="position:absolute;left:-6px;right:-6px;bottom:-14px;height:16px;border-radius:6px;background:${acc}"></div><div style="position:absolute;left:4px;bottom:-4px;width:12px;height:12px;border-radius:50%;background:#F36F9B"></div><div style="position:absolute;left:24px;bottom:-6px;width:12px;height:12px;border-radius:50%;background:#FFD36E"></div></div>`;
      return `<div style="position:absolute;left:${x}px;top:${top}px;width:${w}px;height:${hgt}px">
        <div style="position:absolute;inset:0;border-radius:18px 18px 0 0;background:linear-gradient(180deg,${col},${col} 70%,${acc}55);box-shadow:inset -18px 0 0 rgba(0,0,0,.05)"></div>
        <div style="position:absolute;left:-12px;right:-12px;top:-22px;height:30px;border-radius:12px;background:${acc};box-shadow:0 6px 0 rgba(0,0,0,.06)"></div>
        ${win(w * .16, 60)}${win(w * .58, 60)}${hgt > 560 ? win(w * .16, 200) + win(w * .58, 200) : ''}
        <div style="position:absolute;left:${w * .12}px;right:${w * .12}px;top:${hgt - 330}px;height:56px;border-radius:14px;background:#fff;display:grid;place-items:center;font-family:Prompt;font-weight:700;font-size:28px;color:${acc};box-shadow:0 6px 12px rgba(0,0,0,.08)">${name}</div>
        <div style="position:absolute;left:-14px;right:-14px;top:${hgt - 262}px;height:70px;border-radius:0 0 30px 30px;background:repeating-linear-gradient(90deg,${acc} 0 34px,#fff 34px 68px);box-shadow:0 10px 14px rgba(0,0,0,.08)"></div>
        <div style="position:absolute;left:${w * .5 - 52}px;bottom:0;width:104px;height:170px;border-radius:52px 52px 0 0;background:linear-gradient(180deg,#9AC2EE,#7AA6DA);box-shadow:inset 0 0 0 8px #fff"></div>
        <div style="position:absolute;left:${w * .08}px;bottom:0;width:${w * .22}px;height:150px;border-radius:14px 14px 0 0;background:linear-gradient(180deg,#EAF5FF,#C9E0F5);box-shadow:inset 0 0 0 6px #fff"></div></div>`;
    };
    const tree = (x, s, y = 1270) => `<div style="position:absolute;left:${x}px;top:${y - 330 * s}px;width:${240 * s}px;height:${340 * s}px">
        <div style="position:absolute;left:44%;bottom:0;width:12%;height:42%;border-radius:10px;background:linear-gradient(90deg,#B98A63,#9A6E4C)"></div>
        <div style="position:absolute;left:4%;top:12%;width:60%;height:50%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#C7EFD3,#86CFA2)"></div>
        <div style="position:absolute;left:36%;top:4%;width:60%;height:52%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#D3F4DC,#93D6AC)"></div>
        <div style="position:absolute;left:18%;top:30%;width:66%;height:40%;border-radius:50%;background:radial-gradient(circle at 40% 30%,#BDEBCB,#7CC79A)"></div>
        <div style="position:absolute;left:30%;bottom:-6px;width:40%;height:30px;border-radius:12px;background:#F5A9C7"></div></div>`;
    const lamp = (x) => `<div style="position:absolute;left:${x}px;top:820px;width:40px;height:460px"><div style="position:absolute;left:16px;top:40px;width:9px;height:420px;border-radius:5px;background:#7E8DB0"></div>
        <div style="position:absolute;left:0;top:0;width:42px;height:56px;border-radius:14px 14px 20px 20px;background:linear-gradient(180deg,#FFF6D6,#FFE39A);box-shadow:0 0 30px 10px rgba(255,230,150,.45),inset 0 0 0 5px #7E8DB0"></div></div>`;
    const sky = h(`<div style="position:absolute;inset:0;background:linear-gradient(180deg,#FFE4D6 0%,#FCE3EF 30%,#E6EEFC 62%,#D7E7FB 100%)">
        <div class="sun" style="position:absolute;left:-120px;top:-160px;width:760px;height:760px;border-radius:50%;background:radial-gradient(circle,rgba(255,244,214,.95) 0%,rgba(255,226,190,.45) 30%,rgba(255,255,255,0) 66%)"></div></div>`);
    root.appendChild(sky);
    const clouds = layer('clouds', .12, [[200, 160, 1], [900, 90, .8], [1500, 210, 1.1], [2050, 120, .9]].map(([x, y, s]) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${300 * s}px;height:${90 * s}px;border-radius:60px;background:#fff;opacity:.85;box-shadow:${60 * s}px -${30 * s}px 0 -${8 * s}px #fff, -${50 * s}px -${16 * s}px 0 -${16 * s}px #fff"></div>`).join(''));
    const far = layer('far', .3, `<div style="position:absolute;left:0;top:0;width:2400px;height:1920px;filter:blur(2.5px)">${[...Array(13)].map((_, i) => { const w = 150 + (i * 53) % 120, hh = 360 + (i * 97) % 300; return `<div style="position:absolute;left:${i * 190 - 40}px;top:${1100 - hh}px;width:${w}px;height:${hh + 40}px;border-radius:16px 16px 0 0;background:${i % 2 ? '#E7E3F7' : '#DCE8F8'};box-shadow:inset 0 0 0 0 #fff">${[...Array(4)].map((_, r) => `<div style="position:absolute;left:24px;right:24px;top:${40 + r * 70}px;height:26px;border-radius:6px;background:rgba(255,255,255,.6)"></div>`).join('')}</div>`; }).join('')}</div>`);
    let shops = '', x = -60;
    for (let i = 0; x < 2460; i++) { const w = 270 + (i * 37) % 70, hgt = 560 + (i * 71) % 160; shops += shop(x, w, hgt, i); x += w + 26; }
    const bunting = `<svg width="2400" height="200" style="position:absolute;left:0;top:520px" viewBox="0 0 2400 200"><path d="M0 40 Q300 120 600 40 Q900 120 1200 40 Q1500 120 1800 40 Q2100 120 2400 40" stroke="#B9A9D9" stroke-width="4" fill="none"/>
        ${[...Array(32)].map((_, i) => { const px = i * 75 + 20, py = 40 + 40 * Math.sin(((px % 600) / 600) * Math.PI); return `<path d="M${px} ${py} l18 0 l-9 30z" fill="${['#F5A9C7', '#95BFEF', '#FFD36E', '#9ED8B0'][i % 4]}"/>`; }).join('')}</svg>`;
    const mid = layer('mid', .65, `<div style="position:absolute;inset:0;filter:blur(.6px)">${shops}${bunting}</div>`);
    const ground = layer('ground', 1, `
        <div style="position:absolute;left:0;top:1180px;width:2400px;height:540px;background:linear-gradient(180deg,#F3E4EA 0%,#F7ECEF 40%,#FBF3F4 100%)"></div>
        <div style="position:absolute;left:0;top:1180px;width:2400px;height:540px;background-image:linear-gradient(90deg,rgba(214,190,204,.55) 3px,transparent 3px),linear-gradient(180deg,rgba(214,190,204,.55) 3px,transparent 3px);background-size:120px 90px;opacity:.7"></div>
        <div style="position:absolute;left:0;top:1180px;width:2400px;height:60px;background:linear-gradient(180deg,rgba(150,120,170,.18),rgba(150,120,170,0))"></div>
        <div style="position:absolute;left:0;top:1716px;width:2400px;height:30px;background:linear-gradient(180deg,#FFFFFF,#E5EAF3)"></div>
        <div style="position:absolute;left:0;top:1746px;width:2400px;height:700px;background:linear-gradient(180deg,#B7C3D8,#A5B3CC)"></div>
        <div style="position:absolute;left:0;top:1830px;width:2400px;height:12px;background:repeating-linear-gradient(90deg,#fff 0 90px,transparent 90px 170px);opacity:.85"></div>
        ${tree(160, 1.15)}${tree(820, 1.0)}${tree(1530, 1.2)}${tree(2150, 1.05)}${lamp(560)}${lamp(1260)}${lamp(1960)}
        <div class="actors" style="position:absolute;left:0;top:0;width:2400px;height:1920px"></div>`);
    const fore = layer('fore', 1.35, `<div style="position:absolute;inset:0;filter:blur(7px)">
        <div style="position:absolute;left:-60px;top:1600px;width:420px;height:300px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#C7EFD3,#7CC79A)"></div>
        <div style="position:absolute;left:330px;top:1700px;width:60px;height:60px;border-radius:50%;background:#F5A9C7"></div>
        <div style="position:absolute;left:2080px;top:1580px;width:460px;height:340px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#D3F4DC,#86CFA2)"></div>
        <div style="position:absolute;left:2150px;top:1640px;width:56px;height:56px;border-radius:50%;background:#FFD36E"></div></div>`);
    const light = h(`<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(125deg,rgba(255,236,200,.38) 0%,rgba(255,236,200,0) 45%);mix-blend-mode:screen"></div>`);
    const vig = h(`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(60,40,80,.22) 100%)"></div>`);
    root.appendChild(light); root.appendChild(vig);
    const layers = [clouds, far, mid, ground, fore];
    const actors = ground.querySelector('.actors');
    // camera: cx, cy in ground-layer world px; z zoom. Far layers move/zoom less (parallax).
    function camera(cx, cy, z, t = 0, dof = 0) {
      layers.forEach(L => {
        const p = L.p, zl = 1 + (z - 1) * Math.min(1, p), lx = lerp(1200, cx, p) + (L === clouds ? t * 8 : 0), ly = lerp(960, cy, Math.min(1, p));
        L.style.transform = `translate(540px,960px) scale(${zl}) translate(${-lx}px,${-ly}px)`;
      });
      fore.style.opacity = clamp((z - 1.8) * 2);   // blurred foreground only in close-ups
      const b = clamp(dof) * 6;
      far.style.filter = `blur(${b * .8}px)`; mid.style.filter = b > .1 ? `blur(${b * .55}px)` : '';
      sky.querySelector('.sun').style.transform = `scale(${1 + .04 * Math.sin(t * .7)})`;
    }
    return { actors, camera, sky, layers };
  }

  // ------------------------------------------------------------------ small set pieces
  function cafeTable(w = 220) {
    return h(`<svg width="${w}" height="${w * .8}" viewBox="0 0 220 176" style="overflow:visible"><ellipse cx="110" cy="170" rx="90" ry="10" fill="rgba(60,50,90,.18)"/>
      <rect x="100" y="40" width="20" height="124" rx="8" fill="#B9A9D9"/><ellipse cx="110" cy="164" rx="52" ry="10" fill="#A595CE"/>
      <ellipse cx="110" cy="40" rx="104" ry="24" fill="#FFF6FA"/><ellipse cx="110" cy="34" rx="104" ry="22" fill="#FFFFFF" stroke="#F5A9C7" stroke-width="4"/>
      <rect x="150" y="6" width="26" height="28" rx="6" fill="#F5A9C7"/><path d="M176 14 q12 0 0 14" stroke="#F5A9C7" stroke-width="4" fill="none"/></svg>`);
  }
  function counter(w = 260) {
    return h(`<svg width="${w}" height="${w * .9}" viewBox="0 0 260 234" style="overflow:visible"><rect x="10" y="80" width="240" height="150" rx="16" fill="#CFE3FA"/><rect x="0" y="66" width="260" height="26" rx="10" fill="#95BFEF"/>
      <rect x="30" y="110" width="200" height="16" rx="8" fill="#fff" opacity=".7"/><rect x="40" y="10" width="70" height="56" rx="10" fill="#fff"/><rect x="50" y="20" width="50" height="10" rx="5" fill="#F5A9C7"/><rect x="50" y="38" width="36" height="10" rx="5" fill="#B8D9F8"/>
      <circle cx="190" cy="44" r="22" fill="#FFD36E"/></svg>`);
  }
  // thought bubble with arbitrary HTML content; tail points down-left (dir=-1) or down-right (dir=1)
  function thought(html, { w = 300, dir = -1 } = {}) {
    return h(`<div style="position:absolute;width:${w}px">
      <div style="position:relative;background:#fff;border-radius:60px;padding:22px 28px;box-shadow:0 14px 30px rgba(110,90,150,.2);display:flex;align-items:center;justify-content:center;gap:14px;font-family:Prompt;font-weight:700;font-size:38px;color:#31445D;white-space:nowrap">${html}</div>
      <div style="position:absolute;${dir < 0 ? 'left:40px' : 'right:40px'};bottom:-34px;width:30px;height:30px;border-radius:50%;background:#fff;box-shadow:0 8px 16px rgba(110,90,150,.18)"></div>
      <div style="position:absolute;${dir < 0 ? 'left:20px' : 'right:20px'};bottom:-62px;width:18px;height:18px;border-radius:50%;background:#fff;box-shadow:0 6px 12px rgba(110,90,150,.18)"></div></div>`);
  }
  const SPEND_ICONS = `
    <svg width="64" height="64" viewBox="0 0 24 24"><path d="M5 8h14l-1.2 12H6.2z" fill="#F5A9C7"/><path d="M9 8V6a3 3 0 0 1 6 0v2" stroke="#EE7FAA" stroke-width="2" fill="none"/></svg>
    <svg width="64" height="64" viewBox="0 0 24 24"><path d="M7 7h10l-1.4 14H8.4z" fill="#FFE1B8"/><rect x="6" y="5" width="12" height="3" rx="1.5" fill="#B9A9D9"/><path d="M14 1.5 L12.5 7" stroke="#EE7FAA" stroke-width="1.8" stroke-linecap="round"/><circle cx="10" cy="17" r="1.2" fill="#5B3A20"/><circle cx="13" cy="18" r="1.2" fill="#5B3A20"/><circle cx="11.5" cy="15" r="1.2" fill="#5B3A20"/></svg>
    <svg width="64" height="64" viewBox="0 0 24 24"><rect x="6" y="2" width="12" height="20" rx="3" fill="#95BFEF"/><rect x="8" y="5" width="8" height="12" rx="1.5" fill="#EAF5FF"/><circle cx="12" cy="19.5" r="1" fill="#fff"/></svg>`;

  window.STORY = { character, wallet, walletSVG, city, cafeTable, counter, thought, blinkAt, SPEND_ICONS };
})();
