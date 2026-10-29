// NaiSibPro investigation kit (shared, EP23+). Flat 2D vector art, all original and unbranded.
// CASE.suspect(kind, { num, scale })  hardware "suspect" characters: psu, mb, cpu, ram, hdd.
//   Minimal faces (dot eyes, small mouth), stubby legs, hands holding a lineup number card.
//   pose({ t, blink, walk, wobble, mood, x, y, s, o, r }): idle bob is the caller's job (pass y).
// CASE.pc({ scale })      desktop tower: power button, LED, drive bays, optional empty-bay highlight.
// CASE.monitor({ w })     monitor whose screen shows 'off' | 'standby' | 'bios' | 'noboot' | 'picture'.
// CASE.folder(opts)       kraft case folder with a paper file: photo, number, Thai + English name, notes, stamp slot.
// CASE.stamp(text, tone)  rubber stamp ('red' | 'green' | 'yellow'); CASE.slam(el, u) animates its impact.
// CASE.lineupWall(root, box)  height-line wall; CASE.spotlight(root, opts) warm cone + floor pool + dust.
// CASE.board(root, box)   cork board; board.pin(x, y, html) adds a pinned card; board.string(points) a red string.
// CASE.tape(text)         yellow-black crime-scene tape; CASE.ICON: bolt, house, brain, desk, cabinet, gpu,
//   speaker, screen, oswin, walkie, gavel, power, box, comment, beep.
// EP03–EP22 do not load this file.
(function () {
  const { h, tf, clamp, lerp, E, P } = NSP;
  const INK = '#0B1A3A', OUT = 'stroke="#0B1A3A" stroke-width="5" stroke-linejoin="round"';

  // ------------------------------------------------------------------ icons (viewBox 0 0 100 100)
  const svg = (s, body, vb = '0 0 100 100') => `<svg width="${s}" height="${s}" viewBox="${vb}" style="display:block;overflow:visible">${body}</svg>`;
  const ICON = {
    bolt: (s = 100) => svg(s, `<circle cx="50" cy="50" r="46" fill="#FFD23F" ${OUT}/><path d="M56 12 L28 56 H48 L42 88 L72 42 H52 Z" fill="#fff" ${OUT}/>`),
    house: (s = 100) => svg(s, `<path d="M10 50 L50 14 L90 50" fill="none" stroke="#0B1A3A" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M20 46 V88 H80 V46 L50 20 Z" fill="#FF8FA3" ${OUT}/><rect x="40" y="58" width="20" height="30" rx="3" fill="#7A4A2A" ${OUT}/><rect x="25" y="54" width="12" height="12" fill="#BDE7FF" stroke="#0B1A3A" stroke-width="4"/><rect x="63" y="54" width="12" height="12" fill="#BDE7FF" stroke="#0B1A3A" stroke-width="4"/>`),
    brain: (s = 100) => svg(s, `<path d="M50 18 C40 8 22 12 22 26 C10 28 8 44 16 50 C8 58 14 74 26 74 C28 86 44 90 50 80 C56 90 72 86 74 74 C86 74 92 58 84 50 C92 44 90 28 78 26 C78 12 60 8 50 18 Z" fill="#FF9EC4" ${OUT}/>
      <path d="M50 20 V80 M34 34 C40 38 40 46 34 50 M30 60 C38 58 42 64 40 70 M66 34 C60 38 60 46 66 50 M70 60 C62 58 58 64 60 70" fill="none" stroke="#0B1A3A" stroke-width="4" stroke-linecap="round"/>`),
    desk: (s = 100) => svg(s, `<rect x="8" y="52" width="84" height="10" rx="3" fill="#B7793F" ${OUT}/><path d="M16 62 V90 M84 62 V90" stroke="#0B1A3A" stroke-width="7" stroke-linecap="round"/>
      <rect x="18" y="30" width="30" height="22" rx="3" fill="#FFE2A8" ${OUT}/><rect x="22" y="24" width="30" height="22" rx="3" fill="#FFF" ${OUT}/><path d="M27 31 H46 M27 38 H42" stroke="#0B1A3A" stroke-width="3"/>
      <rect x="58" y="36" width="28" height="16" rx="3" fill="#7FB2FF" ${OUT}/><path d="M64 36 V30 H80 V36" fill="none" stroke="#0B1A3A" stroke-width="4"/>`),
    cabinet: (s = 100, empty = false) => svg(s, `<rect x="20" y="8" width="60" height="86" rx="6" fill="#9AA8BD" ${OUT}/>
      ${[0, 1, 2].map(i => `<rect x="27" y="${15 + i * 26}" width="46" height="21" rx="3" fill="${empty && i === 1 ? '#3A4A66' : '#C7D2E2'}" stroke="#0B1A3A" stroke-width="4"/><rect x="42" y="${22 + i * 26}" width="16" height="5" rx="2" fill="#0B1A3A"/>`).join('')}
      ${empty ? '' : '<rect x="32" y="38" width="10" height="4" fill="#FFE2A8"/>'}`),
    gpu: (s = 100) => svg(s, `<rect x="6" y="26" width="88" height="44" rx="6" fill="#33415C" ${OUT}/><circle cx="32" cy="48" r="15" fill="#5B6B88" stroke="#0B1A3A" stroke-width="4"/><circle cx="68" cy="48" r="15" fill="#5B6B88" stroke="#0B1A3A" stroke-width="4"/>
      <path d="M32 36 V60 M20 48 H44 M68 36 V60 M56 48 H80" stroke="#22D3EE" stroke-width="3"/><rect x="16" y="70" width="56" height="9" fill="#E7B84A" stroke="#0B1A3A" stroke-width="4"/>`),
    speaker: (s = 100) => svg(s, `<path d="M14 38 H32 L54 18 V82 L32 62 H14 Z" fill="#fff" ${OUT}/><path d="M66 34 C74 42 74 58 66 66 M76 24 C90 38 90 62 76 76" fill="none" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`),
    screen: (s = 100) => svg(s, `<rect x="8" y="14" width="84" height="56" rx="6" fill="#0E1A33" stroke="#fff" stroke-width="7"/><path d="M38 86 H62 M50 70 V86" stroke="#fff" stroke-width="7" stroke-linecap="round"/>`),
    // generic program window: title bar with three dots, text lines (no OS logo)
    oswin: (s = 100) => svg(s, `<rect x="6" y="12" width="88" height="74" rx="8" fill="#EAF1FF" ${OUT}/><path d="M6 30 H94" stroke="#0B1A3A" stroke-width="5"/><rect x="8.5" y="14.5" width="83" height="13" rx="5" fill="#2F6BFF"/>
      <circle cx="18" cy="21" r="3.5" fill="#fff"/><circle cx="28" cy="21" r="3.5" fill="#fff"/><circle cx="38" cy="21" r="3.5" fill="#fff"/><path d="M18 44 H70 M18 56 H60 M18 68 H74" stroke="#7A8BA3" stroke-width="5" stroke-linecap="round"/>`),
    walkie: (s = 100) => svg(s, `<rect x="56" y="2" width="8" height="30" rx="3" fill="#2A2F3A" stroke="#0B1A3A" stroke-width="3"/><rect x="26" y="24" width="48" height="72" rx="10" fill="#2E3A52" ${OUT}/>
      <rect x="34" y="32" width="32" height="16" rx="3" fill="#7CF0B4" stroke="#0B1A3A" stroke-width="3"/>${[0, 1, 2].map(i => `<path d="M36 ${58 + i * 9} H64" stroke="#8C99B3" stroke-width="4" stroke-linecap="round"/>`).join('')}<circle cx="68" cy="30" r="4" fill="#FF4D4D"/>`),
    gavel: (s = 100) => svg(s, `<path d="M44 44 L88 88" stroke="#0B1A3A" stroke-width="15" stroke-linecap="round"/><path d="M44 44 L88 88" stroke="#B7793F" stroke-width="8" stroke-linecap="round"/>
      <g transform="rotate(45 36 36)"><rect x="8" y="22" width="56" height="28" rx="7" fill="#8B5A2B" ${OUT}/><rect x="2" y="25" width="10" height="22" rx="3" fill="#E7B84A" stroke="#0B1A3A" stroke-width="3"/><rect x="60" y="25" width="10" height="22" rx="3" fill="#E7B84A" stroke="#0B1A3A" stroke-width="3"/></g>`),
    block: (s = 100) => svg(s, `<rect x="14" y="40" width="72" height="22" rx="8" fill="#8B5A2B" ${OUT}/><rect x="22" y="30" width="56" height="14" rx="6" fill="#A86F38" ${OUT}/>`),
    power: (s = 100, c = '#fff') => svg(s, `<path d="M32 26 A30 30 0 1 0 68 26" fill="none" stroke="${c}" stroke-width="9" stroke-linecap="round"/><path d="M50 10 V46" stroke="${c}" stroke-width="9" stroke-linecap="round"/>`),
    comment: (s = 100) => svg(s, `<path d="M12 14 H88 A8 8 0 0 1 96 22 V62 A8 8 0 0 1 88 70 H44 L24 88 V70 H12 A8 8 0 0 1 4 62 V22 A8 8 0 0 1 12 14 Z" fill="#fff" ${OUT}/><circle cx="30" cy="42" r="6" fill="#2F6BFF"/><circle cx="50" cy="42" r="6" fill="#2F6BFF"/><circle cx="70" cy="42" r="6" fill="#2F6BFF"/>`),
    box: (s = 100) => svg(s, `<rect x="10" y="40" width="80" height="54" rx="4" fill="#C8955A" ${OUT}/><path d="M10 52 H90" stroke="#0B1A3A" stroke-width="4"/><rect x="40" y="40" width="20" height="54" fill="#E0B47A" stroke="#0B1A3A" stroke-width="4"/>`),
    check: (s = 100, c = '#22C55E') => svg(s, `<circle cx="50" cy="50" r="44" fill="${c}" stroke="#fff" stroke-width="8"/><path d="M28 52 L44 68 L74 34" fill="none" stroke="#fff" stroke-width="11" stroke-linecap="round" stroke-linejoin="round"/>`),
    cross: (s = 100, c = '#EF4444') => svg(s, `<circle cx="50" cy="50" r="44" fill="${c}" stroke="#fff" stroke-width="8"/><path d="M32 32 L68 68 M68 32 L32 68" stroke="#fff" stroke-width="11" stroke-linecap="round"/>`),
  };

  // ------------------------------------------------------------------ suspects
  // viewBox 0 0 200 290; feet at y 284; card held at y ~196–252.
  const BODY = {
    psu: `<rect x="18" y="40" width="164" height="150" rx="16" fill="#8E9BB0" ${OUT}/><rect x="18" y="40" width="164" height="22" rx="10" fill="#A9B5C7"/>
      <circle cx="100" cy="92" r="40" fill="#5D6A82" stroke="#0B1A3A" stroke-width="5"/>${[0, 60, 120, 180, 240, 300].map(a => `<path d="M100 92 Q${100 + 30 * Math.cos((a + 25) * Math.PI / 180)} ${92 + 30 * Math.sin((a + 25) * Math.PI / 180)} ${100 + 36 * Math.cos(a * Math.PI / 180)} ${92 + 36 * Math.sin(a * Math.PI / 180)}" fill="none" stroke="#B9C4D6" stroke-width="5" stroke-linecap="round"/>`).join('')}
      <circle cx="100" cy="92" r="9" fill="#0B1A3A"/><rect x="146" y="50" width="26" height="18" rx="3" fill="#FFD23F" stroke="#0B1A3A" stroke-width="3"/><path d="M161 52 L154 60 H160 L157 66 L165 57 H159 Z" fill="#0B1A3A"/>
      <path d="M182 120 C214 126 210 170 192 186" fill="none" stroke="#FFD23F" stroke-width="6"/><path d="M182 130 C206 138 202 172 186 190" fill="none" stroke="#EF4444" stroke-width="6"/><path d="M182 140 C198 150 196 176 180 194" fill="none" stroke="#0B1A3A" stroke-width="6"/>`,
    mb: `<rect x="14" y="26" width="172" height="168" rx="10" fill="#1F8A57" ${OUT}/>
      <path d="M30 150 H80 V120 M96 170 V140 H130 M40 60 H70 M150 40 V90" fill="none" stroke="#5FE0A0" stroke-width="3" opacity=".7"/>
      <rect x="28" y="38" width="52" height="52" rx="5" fill="#C9D1DC" stroke="#0B1A3A" stroke-width="4"/><rect x="38" y="48" width="32" height="32" rx="3" fill="none" stroke="#7A8BA3" stroke-width="3"/>
      <rect x="146" y="36" width="10" height="96" rx="3" fill="#0B1A3A"/><rect x="164" y="36" width="10" height="96" rx="3" fill="#0B1A3A"/>
      <rect x="30" y="164" width="96" height="10" rx="3" fill="#0B1A3A"/><rect x="30" y="178" width="70" height="8" rx="3" fill="#E7B84A"/>
      ${[[100, 44], [114, 44], [128, 44], [136, 160], [150, 160]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="5" fill="#2F6BFF" stroke="#0B1A3A" stroke-width="2"/>`).join('')}`,
    cpu: `<rect x="22" y="42" width="156" height="156" rx="14" fill="#2C6E49" ${OUT}/>
      ${Array.from({ length: 9 }, (_, i) => `<circle cx="${40 + i * 15}" cy="52" r="3" fill="#E7B84A"/><circle cx="${40 + i * 15}" cy="188" r="3" fill="#E7B84A"/><circle cx="32" cy="${62 + i * 14}" r="3" fill="#E7B84A"/><circle cx="168" cy="${62 + i * 14}" r="3" fill="#E7B84A"/>`).join('')}
      <rect x="44" y="64" width="112" height="112" rx="12" fill="url(#ihs)" stroke="#0B1A3A" stroke-width="4"/>`,
    ram: `<rect x="56" y="14" width="88" height="182" rx="8" fill="#1F8A57" ${OUT}/>
      ${[24, 56, 152].map(y => `<rect x="68" y="${y}" width="64" height="26" rx="3" fill="#1A1F2B" stroke="#0B1A3A" stroke-width="2"/>`).join('')}
      ${Array.from({ length: 9 }, (_, i) => `<rect x="${62 + i * 8.6}" y="182" width="5" height="12" fill="#E7B84A"/>`).join('')}<rect x="96" y="184" width="8" height="12" fill="#0B1A3A"/>
      <rect x="56" y="14" width="88" height="182" rx="8" fill="none" ${OUT}/>`,
    hdd: `<rect x="20" y="36" width="160" height="160" rx="14" fill="#B9C2CF" ${OUT}/>
      <circle cx="100" cy="112" r="60" fill="#DDE3EC" stroke="#0B1A3A" stroke-width="4"/><circle cx="100" cy="112" r="44" fill="none" stroke="#C3CBD8" stroke-width="3"/><circle cx="100" cy="112" r="28" fill="none" stroke="#C3CBD8" stroke-width="3"/>
      <path d="M164 182 L150 168 L128 140" stroke="#5D6A82" stroke-width="9" stroke-linecap="round"/><circle cx="164" cy="182" r="8" fill="#5D6A82" stroke="#0B1A3A" stroke-width="3"/>
      ${[[32, 48], [168, 48], [32, 184]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="4" fill="#7A8BA3"/>`).join('')}`,
  };
  // face anchor (eye line y, mouth y) per kind; ram is narrow so its eyes sit closer
  const FACE = { psu: [140, 160, 22], mb: [104, 124, 22], cpu: [112, 136, 22], ram: [102, 124, 15], hdd: [104, 126, 20] };
  const ARMS = { psu: [18, 182], mb: [14, 186], cpu: [22, 178], ram: [56, 144], hdd: [20, 180] };
  const ACCENT = { psu: '#FFD23F', mb: '#22C55E', cpu: '#22D3EE', ram: '#FF3D7F', hdd: '#FF9F1C' };
  let uid = 0;
  function suspect(kind, { num = 1, scale = 1, card = true } = {}) {
    const id = 'ihs' + (uid++), [ey, my, ex] = FACE[kind], [al, ar] = ARMS[kind];
    const W = 200 * scale, H = 290 * scale;
    const el = h(`<div class="abs" style="width:0;height:0">
      <div class="sp" style="position:absolute;left:${-W / 2}px;top:${-H}px;width:${W}px;height:${H}px;transform-origin:50% 100%">
      <svg width="${W}" height="${H}" viewBox="0 0 200 290" style="overflow:visible;display:block">
        <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#EEF2F7"/><stop offset="1" stop-color="#AAB6C8"/></linearGradient></defs>
        <ellipse class="shd" cx="100" cy="286" rx="70" ry="9" fill="rgba(0,0,0,.35)"/>
        <g class="lgL"><rect x="70" y="186" width="18" height="86" rx="8" fill="#26324A" stroke="#0B1A3A" stroke-width="4"/><rect x="60" y="270" width="34" height="14" rx="7" fill="#0B1A3A"/></g>
        <g class="lgR"><rect x="112" y="186" width="18" height="86" rx="8" fill="#26324A" stroke="#0B1A3A" stroke-width="4"/><rect x="106" y="270" width="34" height="14" rx="7" fill="#0B1A3A"/></g>
        <g class="bd">${BODY[kind].replace('url(#ihs)', `url(#${id})`)}
          <g class="face"><g class="eyes"><circle cx="${100 - ex}" cy="${ey}" r="8" fill="#0B1A3A"/><circle cx="${100 + ex}" cy="${ey}" r="8" fill="#0B1A3A"/>
            <circle cx="${102 - ex}" cy="${ey - 3}" r="2.6" fill="#fff"/><circle cx="${102 + ex}" cy="${ey - 3}" r="2.6" fill="#fff"/></g>
            <path class="m0" d="M${100 - 9} ${my} Q100 ${my + 7} ${100 + 9} ${my}" fill="none" stroke="#0B1A3A" stroke-width="4.5" stroke-linecap="round"/>
            <path class="m1" d="M${100 - 11} ${my + 2} q4 -5 7 0 t7 0 t7 0" fill="none" stroke="#0B1A3A" stroke-width="4" stroke-linecap="round" opacity="0"/>
            <ellipse class="m2" cx="100" cy="${my + 2}" rx="6" ry="7" fill="#0B1A3A" opacity="0"/>
            <path class="sw" d="M${100 + ex + 16} ${ey - 16} q5 8 0 12 q-5 -4 0 -12z" fill="#7FD3FF" stroke="#0B1A3A" stroke-width="2" opacity="0"/></g></g>
        ${card ? `<g class="cd"><path d="M${al} 150 L60 214 M${ar} 150 L140 214" stroke="#0B1A3A" stroke-width="7" stroke-linecap="round"/>
          <rect x="52" y="196" width="96" height="58" rx="8" fill="#fff" stroke="#0B1A3A" stroke-width="4"/><rect x="52" y="196" width="96" height="12" rx="6" fill="${ACCENT[kind]}"/>
          <text x="100" y="248" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="40" fill="#0B1A3A">${num}</text>
          <circle cx="60" cy="214" r="8" fill="#fff" stroke="#0B1A3A" stroke-width="4"/><circle cx="140" cy="214" r="8" fill="#fff" stroke="#0B1A3A" stroke-width="4"/></g>` : ''}
      </svg></div></div>`);
    const q = s => el.querySelector(s);
    const sp = q('.sp'), eyes = q('.eyes'), m = [q('.m0'), q('.m1'), q('.m2')], sw = q('.sw'), lgL = q('.lgL'), lgR = q('.lgR'), bd = q('.bd'), shd = q('.shd');
    // mood: 0 neutral, 1 nervous (wavy mouth + sweat), 2 surprised (o mouth)
    function pose({ t = 0, blink = 0, walk = 0, wobble = 0, mood = 0, x = 0, y = 0, s = 1, o = 1, r = 0, look = 0 } = {}) {
      const st = Math.sin(t * 9) * walk, lift = Math.abs(Math.sin(t * 9)) * walk;
      lgL.setAttribute('transform', `translate(0 ${-Math.max(0, st) * 12})`);
      lgR.setAttribute('transform', `translate(0 ${-Math.max(0, -st) * 12})`);
      const wb = Math.sin(t * 22) * wobble * 4;
      bd.setAttribute('transform', `translate(${wb} ${-lift * 8}) rotate(${wb * .8} 100 190)`);
      eyes.setAttribute('transform', `translate(${look * 6} ${ey * (1 - Math.max(.08, 1 - blink))}) scale(1 ${Math.max(.08, 1 - blink)})`);
      m.forEach((p, i) => p.setAttribute('opacity', i === mood ? 1 : 0));
      sw.setAttribute('opacity', mood === 1 ? .9 : 0);
      shd.setAttribute('rx', 70 - lift * 8);
      el.style.transform = `translate(${x}px,${y}px)`;
      sp.style.transform = `rotate(${r}deg) scale(${s})`;
      el.style.opacity = o; el.style.visibility = o <= .001 ? 'hidden' : 'visible';
    }
    return { el, pose, kind };
  }
  // deterministic blink: ~every 3.4 s, 0.16 s long
  const blinkAt = (t, k = 0) => { const u = (t + k * 1.37) % 3.4; return u < .16 ? Math.sin(u / .16 * Math.PI) : 0; };

  // ------------------------------------------------------------------ PC tower (260 × 420)
  function pc({ scale = 1 } = {}) {
    const el = h(`<div class="abs" style="width:${260 * scale}px;height:${420 * scale}px">
      <svg width="${260 * scale}" height="${420 * scale}" viewBox="0 0 260 420" style="display:block;overflow:visible">
        <ellipse cx="130" cy="414" rx="120" ry="10" fill="rgba(0,0,0,.4)"/>
        <rect x="14" y="8" width="232" height="400" rx="20" fill="#2B3650" ${OUT}/>
        <rect x="30" y="24" width="200" height="368" rx="12" fill="#344264" stroke="#0B1A3A" stroke-width="4"/>
        <rect x="46" y="44" width="168" height="34" rx="6" fill="#26304A" stroke="#0B1A3A" stroke-width="3"/><rect x="46" y="86" width="168" height="34" rx="6" fill="#26304A" stroke="#0B1A3A" stroke-width="3"/>
        <rect class="bay" x="46" y="128" width="168" height="44" rx="6" fill="#1A2238" stroke="#FFD23F" stroke-width="5" stroke-dasharray="12 8" opacity="0"/>
        ${Array.from({ length: 8 }, (_, i) => `<rect x="60" y="${200 + i * 18}" width="140" height="7" rx="3.5" fill="#26304A"/>`).join('')}
        <circle class="glow" cx="130" cy="262" r="70" fill="#22D3EE" opacity="0" style="filter:blur(14px)"/>
        <circle cx="130" cy="350" r="24" fill="#4A5A80" stroke="#0B1A3A" stroke-width="5"/><g class="btn"><circle cx="130" cy="350" r="17" fill="#5F72A0"/><path d="M122 342 A11 11 0 1 0 138 342 M130 336 V350" fill="none" stroke="#E6ECF7" stroke-width="4" stroke-linecap="round"/></g>
        <circle class="led" cx="186" cy="350" r="7" fill="#1E2840" stroke="#0B1A3A" stroke-width="3"/>
        <circle class="ledg" cx="186" cy="350" r="16" fill="#22C55E" opacity="0" style="filter:blur(5px)"/>
      </svg></div>`);
    const q = s => el.querySelector(s);
    const led = q('.led'), ledg = q('.ledg'), btn = q('.btn'), bay = q('.bay'), glow = q('.glow');
    return {
      el,
      // led: 0..1 brightness; color; press: 0..1; bay: empty-bay highlight 0..1; fan: interior glow 0..1
      set({ led: L = 0, color = '#22C55E', press = 0, bay: b = 0, fan = 0 } = {}) {
        led.setAttribute('fill', L > .05 ? color : '#1E2840'); ledg.setAttribute('fill', color); ledg.setAttribute('opacity', L * .9);
        btn.setAttribute('transform', `translate(130 350) scale(${1 - .14 * press}) translate(-130 -350)`);
        bay.setAttribute('opacity', b); glow.setAttribute('opacity', fan * .35);
      },
      // power button centre in element coordinates (for placing a finger)
      button: { x: 130 * scale, y: 350 * scale },
    };
  }

  // ------------------------------------------------------------------ monitor (screen w × w*0.6)
  function monitor({ w = 380 } = {}) {
    const sh = Math.round(w * .6), pad = 16;
    const el = h(`<div class="abs" style="width:${w + 2 * pad}px;height:${sh + 2 * pad + 90}px">
      <div style="position:absolute;left:${(w + 2 * pad) / 2 - 22}px;top:${sh + 2 * pad - 4}px;width:44px;height:64px;background:#2B3650;border:5px solid #0B1A3A;border-top:none"></div>
      <div style="position:absolute;left:${(w + 2 * pad) / 2 - 90}px;top:${sh + 2 * pad + 54}px;width:180px;height:22px;border-radius:11px;background:#2B3650;border:5px solid #0B1A3A"></div>
      <div style="position:absolute;left:0;top:0;width:${w + 2 * pad}px;height:${sh + 2 * pad}px;border-radius:18px;background:#1C2438;border:6px solid #0B1A3A;box-shadow:0 18px 36px rgba(0,0,0,.45)"></div>
      <div class="scr" style="position:absolute;left:${pad + 3}px;top:${pad + 3}px;width:${w - 6}px;height:${sh - 6}px;border-radius:8px;overflow:hidden;background:#05070D;font-family:Prompt">
        <div class="L stb" style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 40%,#16213A,#070B14)"></div>
        <div class="L bios" style="position:absolute;inset:0;background:#1238A8;color:#fff;font-weight:600">
          <div style="height:${sh * .16}px;background:#2F6BFF;display:flex;align-items:center;gap:${w * .05}px;padding-left:${w * .05}px;font-size:${w * .055}px;color:#fff">${['Main', 'Advanced', 'Boot', 'Exit'].map((s, i) => `<span style="${i ? '' : 'background:#fff;color:#1238A8;padding:0 8px;border-radius:4px'}">${s}</span>`).join('')}</div>
          <div style="padding:${w * .04}px ${w * .06}px;font-size:${w * .06}px;line-height:1.55">
            <div style="color:#FFD23F;font-weight:800;font-size:${w * .075}px">BIOS SETUP</div>
            <div class="bl">System Time&nbsp;&nbsp;<span style="color:#9DBBFF">[ 09:00 ]</span></div>
            <div class="bl">CPU&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#7CF0B4">[ OK ]</span></div>
            <div class="bl">Memory&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<span style="color:#7CF0B4">[ OK ]</span></div></div></div>
        <div class="L noboot" style="position:absolute;inset:0;background:#05070D;color:#E6ECF7;display:flex;flex-direction:column;justify-content:center;padding-left:${w * .07}px;font-size:${w * .062}px;line-height:1.5;font-weight:600">
          <div>ไม่พบอุปกรณ์สำหรับบูต</div><div style="color:#8C99B3">No bootable device</div><div class="cur" style="width:${w * .05}px;height:${w * .012}px;background:#E6ECF7;margin-top:6px"></div></div>
        <div class="L pic" style="position:absolute;inset:0;background:linear-gradient(180deg,#7FC8FF 0 58%,#3FBF6F 58%)"><div style="position:absolute;left:62%;top:14%;width:${w * .14}px;height:${w * .14}px;border-radius:50%;background:#FFD23F"></div><div style="position:absolute;left:8%;bottom:28%;width:0;height:0;border-left:${w * .16}px solid transparent;border-right:${w * .16}px solid transparent;border-bottom:${w * .22}px solid #2E8B57"></div></div>
        <div class="L flash" style="position:absolute;inset:0;background:#fff"></div>
      </div></div>`);
    const L = {}; el.querySelectorAll('.L').forEach(n => { L[n.classList[1]] = n; });
    const cur = el.querySelector('.cur');
    return {
      el,
      // levels: { stb, bios, noboot, pic, flash } opacities 0..1 (black underneath when all are 0)
      set(levels = {}, t = 0) {
        for (const k in L) { const v = levels[k] || 0; L[k].style.opacity = v; L[k].style.visibility = v > .001 ? 'visible' : 'hidden'; }
        cur.style.opacity = Math.sin(t * 6) > 0 ? 1 : 0;
      },
    };
  }

  // ------------------------------------------------------------------ case folder
  // opts: { w, hgt, num, th, en, photo (html), note (html), tab, who (small label above the number),
  //        wide (names beside the photo, note below at 330 px), pw (photo width), nf (number font size) } — returns { el, paper, stampBox, setNote(o) }
  function folder({ w = 440, num = '', th = '', en = '', photo = '', tab = 'แฟ้มคดี', note = '', hgt, who = 'ผู้ต้องหา', wide = false, pw: PW, nf: NF } = {}) {
    const H = hgt || Math.round(w * 1.08), pw = PW || (wide ? 200 : w * .36), nf = NF || Math.min(w * .2, 110);
    const names = `<div class="th" style="font-weight:800;font-size:46px;line-height:1.25;white-space:nowrap">${th}</div>
          <div style="font-weight:700;font-size:42px;line-height:1.2;color:#5D6A82;white-space:nowrap">${en}</div>`;
    const el = h(`<div class="abs case-folder" style="width:${w}px;height:${H}px">
      <div style="position:absolute;left:24px;top:-34px;width:${Math.max(180, w * .42)}px;height:56px;border-radius:16px 16px 0 0;background:#B9864A;border:5px solid #0B1A3A;border-bottom:none;color:#3A2410;font-weight:800;font-size:30px;padding:6px 18px;white-space:nowrap">${tab}</div>
      <div style="position:absolute;inset:0;border-radius:18px;background:linear-gradient(180deg,#D3A262,#C08A4C);border:5px solid #0B1A3A;box-shadow:0 22px 44px rgba(0,0,0,.45)"></div>
      <div class="paper" style="position:absolute;left:22px;top:20px;right:22px;bottom:22px;border-radius:10px;background:#FFFDF6;border:4px solid #0B1A3A;color:#0B1A3A;overflow:hidden">
        <div style="position:absolute;left:0;right:0;top:0;height:14px;background:repeating-linear-gradient(90deg,#E8E2D2 0 18px,transparent 18px 26px)"></div>
        <div style="display:flex;gap:22px;padding:30px 22px 0">
          <div class="photo" style="flex:none;width:${pw}px;height:${pw * 1.16}px;border-radius:8px;background:linear-gradient(180deg,#3A4A6B,#26324A);border:4px solid #0B1A3A;position:relative;overflow:hidden">
            <div style="position:absolute;inset:0;background:repeating-linear-gradient(180deg,transparent 0 ${pw * .19}px,rgba(255,255,255,.12) ${pw * .19}px ${pw * .19 + 3}px)"></div>${photo}</div>
          <div style="min-width:0">
            <div style="font-weight:700;font-size:30px;color:#7A5A2A">${who}</div>
            <div style="font-weight:800;font-size:${nf}px;line-height:1;color:#C81E1E">${num ? 'No.' + num : ''}</div>
            ${wide ? `<div style="margin-top:10px">${names}</div>` : ''}
          </div></div>
        ${wide ? '' : `<div style="padding:14px 22px 0">${names}</div>`}
        <div class="note" style="position:absolute;left:22px;right:22px;${wide ? 'top:330px' : 'bottom:18px'}">${note}</div>
      </div>
      <div class="stampBox" style="position:absolute;left:${wide ? '70%' : '50%'};top:${H - 86}px;width:0;height:0"></div></div>`);
    return { el, paper: el.querySelector('.paper'), note: el.querySelector('.note'), photo: el.querySelector('.photo'), stampBox: el.querySelector('.stampBox') };
  }

  // ------------------------------------------------------------------ stamps
  const TONE = { red: ['#E5484D', 'rgba(229,72,77,.10)'], green: ['#16A34A', 'rgba(22,163,74,.10)'], yellow: ['#F5B700', 'rgba(255,210,63,.14)'] };
  function stamp(text, tone = 'red', fs = 64, rot = -12) {
    const [c, bg] = TONE[tone];
    return h(`<div class="abs case-stamp" style="width:0;height:0"><div class="stp" style="position:absolute;transform:translate(-50%,-50%) rotate(${rot}deg)"><div style="font-weight:800;font-size:${fs}px;line-height:1.2;color:${c};padding:4px ${fs * .45}px;border:${Math.max(6, fs * .13)}px solid ${c};border-radius:${fs * .3}px;background:${bg};white-space:nowrap;letter-spacing:1px;
      -webkit-mask-image:radial-gradient(circle at 30% 40%,#000 60%,rgba(0,0,0,.82) 61%,#000 70%);mask-image:radial-gradient(circle at 30% 40%,#000 60%,rgba(0,0,0,.82) 61%,#000 70%)">${text}</div></div></div>`);
  }
  // u: seconds since the impact time (negative before). Drops from 2.1× to 1×, small bounce; returns shake (px) for the host.
  function slam(el, u, { out = 1e9 } = {}) {
    if (u < -.12) { tf(el, { o: 0 }); return 0; }
    const k = E.out(clamp((u + .12) / .12));
    const o = clamp((u + .12) / .06) * (1 - clamp((u - out) / .3));
    tf(el, { s: lerp(2.1, 1, k) * (1 + .04 * Math.max(0, 1 - Math.abs(u - .08) / .1)), o });
    // ≤ 6 px, ≤ 8 frames
    return u >= 0 && u < .26 ? Math.sin(u * 90) * 6 * (1 - u / .26) : 0;
  }

  // ------------------------------------------------------------------ sets
  function lineupWall(root, { x = 40, y = 560, w = 1000, hgt = 820 } = {}) {
    const lines = [];
    for (let i = 0; i <= 8; i++) {
      const yy = hgt - 40 - i * ((hgt - 80) / 8);
      lines.push(`<div style="position:absolute;left:0;right:0;top:${yy}px;height:${i % 2 ? 3 : 5}px;background:rgba(220,232,255,${i % 2 ? .25 : .45})"></div>`);
      if (i % 2 === 0 && i) lines.push(`<div style="position:absolute;left:14px;top:${yy - 34}px;font-weight:700;font-size:28px;color:rgba(220,232,255,.6)">${140 + i * 5}</div><div style="position:absolute;right:14px;top:${yy - 34}px;font-weight:700;font-size:28px;color:rgba(220,232,255,.6)">${140 + i * 5}</div>`);
    }
    const el = h(`<div class="abs case-wall" style="left:${x}px;top:${y}px;width:${w}px;height:${hgt}px;border-radius:14px;background:linear-gradient(180deg,#22365F,#1A2B4E);box-shadow:inset 0 0 0 6px #2C4A80,0 20px 40px rgba(0,0,0,.35);overflow:hidden">${lines.join('')}</div>`);
    root.appendChild(el); return el;
  }
  // warm spotlight: cone from (x, top) to a floor pool at (x, floor), with dust specks drifting inside
  function spotlight(root, { x = 540, top = 120, floor = 1400, w = 520 } = {}) {
    const el = h(`<div class="abs" style="left:0;top:0;width:1080px;height:1920px;pointer-events:none">
      <div class="cone" style="position:absolute;left:${x - w / 2}px;top:${top}px;width:${w}px;height:${floor - top}px;clip-path:polygon(44% 0,56% 0,100% 100%,0 100%);background:linear-gradient(180deg,rgba(255,226,160,.42),rgba(255,226,160,.12));filter:blur(6px);transform-origin:50% 0"></div>
      <div class="pool" style="position:absolute;left:${x - w * .6}px;top:${floor - 60}px;width:${w * 1.2}px;height:120px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,226,160,.45),rgba(255,226,160,0) 70%)"></div>
      <div class="dust" style="position:absolute;inset:0"></div></div>`);
    root.appendChild(el);
    const dust = []; let s = 11;
    const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
    for (let i = 0; i < 22; i++) {
      const d = h(`<div style="position:absolute;width:${3 + r() * 5}px;height:${3 + r() * 5}px;border-radius:50%;background:#FFF2C8"></div>`);
      el.querySelector('.dust').appendChild(d);
      dust.push({ d, fx: r(), fy: r(), sp: .02 + r() * .05, ph: r() * 6.28 });
    }
    const cone = el.querySelector('.cone'), pool = el.querySelector('.pool');
    return {
      el,
      // o: overall level, swing: degrees of cone rotation about its top, t: time for dust
      draw(t, { o = 1, swing = 0 } = {}) {
        el.style.opacity = o; el.style.visibility = o > .001 ? 'visible' : 'hidden';
        cone.style.transform = `rotate(${swing}deg)`;
        const dx = Math.tan(-swing * Math.PI / 180) * (floor - top);
        pool.style.transform = `translateX(${dx}px)`;
        dust.forEach(p => {
          const fy = (p.fy + t * p.sp) % 1, yy = top + 80 + fy * (floor - top - 120);
          const half = (w / 2) * ((yy - top) / (floor - top)) * .8;
          const cx = x + Math.tan(-swing * Math.PI / 180) * (yy - top);
          p.d.style.transform = `translate(${cx + (p.fx - .5) * 2 * half + Math.sin(t * .8 + p.ph) * 14}px,${yy}px)`;
          p.d.style.opacity = (.35 + .4 * Math.sin(t * 1.4 + p.ph)) * Math.sin(fy * Math.PI);
        });
      },
    };
  }
  // cork board with wooden frame; pins are absolutely positioned inside; strings drawn in an SVG overlay
  function board(root, { x = 70, y = 520, w = 940, hgt = 900 } = {}) {
    const el = h(`<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${hgt}px">
      <div style="position:absolute;inset:0;border-radius:18px;background:#8A5A2E;box-shadow:0 26px 50px rgba(0,0,0,.5);border:5px solid #0B1A3A"></div>
      <div style="position:absolute;inset:22px;border-radius:8px;background:radial-gradient(#B07D4C 1.6px,transparent 2px) 0 0/14px 14px,radial-gradient(#D9A877 1.4px,transparent 1.8px) 7px 7px/14px 14px,#C79461;border:4px solid #0B1A3A"></div>
      <svg class="str" width="${w}" height="${hgt}" style="position:absolute;inset:0;overflow:visible;z-index:2"></svg>
      <div class="pins" style="position:absolute;inset:0;z-index:3"></div></div>`);
    root.appendChild(el);
    const sv = el.querySelector('.str'), pinsBox = el.querySelector('.pins');
    return {
      el,
      pin(px, py, html, { rot = 0 } = {}) {
        const p = h(`<div class="abs" style="left:${px}px;top:${py}px;width:0;height:0"><div class="pc" style="position:absolute;transform:translate(-50%,-50%) rotate(${rot}deg)">${html}
          <div style="position:absolute;left:50%;top:-14px;width:30px;height:30px;margin-left:-15px;border-radius:50%;background:radial-gradient(circle at 35% 35%,#FF8A8A,#D11F2F 70%);border:4px solid #0B1A3A"></div></div></div>`);
        pinsBox.appendChild(p); return p;
      },
      // red string through points; returns { draw(k) 0..1 drawn, pulse(k) 0..1 position, len }
      string(pts) {
        const d = 'M' + pts.map(p => p.join(' ')).join(' L');
        let len = 0; for (let i = 1; i < pts.length; i++) len += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]);
        sv.insertAdjacentHTML('beforeend', `<path d="${d}" fill="none" stroke="rgba(0,0,0,.35)" stroke-width="7" transform="translate(3 5)" stroke-dasharray="${len}" stroke-dashoffset="${len}"/><path d="${d}" fill="none" stroke="#E11D2E" stroke-width="7" stroke-linecap="round" stroke-dasharray="${len}" stroke-dashoffset="${len}"/><circle r="13" fill="#FFF2A8" opacity="0" style="filter:drop-shadow(0 0 10px #FFD23F)"/>`);
        const n = sv.children.length, sh = sv.children[n - 3], ln = sv.children[n - 2], dot = sv.children[n - 1];
        return {
          len,
          draw(k) { const off = len * (1 - clamp(k)); sh.setAttribute('stroke-dashoffset', off); ln.setAttribute('stroke-dashoffset', off); },
          pulse(k, o = 1) {
            let rem = clamp(k) * len, i = 1;
            for (; i < pts.length; i++) { const sl = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); if (rem <= sl || i === pts.length - 1) { const f = sl ? Math.min(1, rem / sl) : 0; dot.setAttribute('cx', lerp(pts[i - 1][0], pts[i][0], f)); dot.setAttribute('cy', lerp(pts[i - 1][1], pts[i][1], f)); break; } rem -= sl; }
            dot.setAttribute('opacity', o);
          },
        };
      },
    };
  }
  function tape(text = 'ห้ามเข้า ที่เกิดเหตุ', w = 1700) {
    const words = Array.from({ length: 6 }, () => `<span style="padding:0 34px">${text}</span><span style="display:inline-block;width:26px;height:26px;background:#0B1A3A;transform:rotate(45deg);vertical-align:middle"></span>`).join('');
    return h(`<div class="abs case-tape" style="width:${w}px;height:96px;background:repeating-linear-gradient(-45deg,#FFD23F 0 34px,#FFC300 34px 36px);border-top:10px solid #0B1A3A;border-bottom:10px solid #0B1A3A;box-shadow:0 14px 30px rgba(0,0,0,.5);overflow:hidden;white-space:nowrap;font-weight:800;font-size:44px;line-height:76px;color:#0B1A3A">${words}</div>`);
  }

  window.CASE = { ICON, suspect, blinkAt, pc, monitor, folder, stamp, slam, lineupWall, spotlight, board, tape, ACCENT };
})();
