// EP51 characters and sets (original 2D artwork, drawn in SVG).
// One jointed cartoon rig for the Thai police officers (brown uniform matching the NaiSibPro mascot:
// khaki-brown shirt and trousers, maroon cap band, black visor, silver cap badge) plus a student look.
// Rig: legs (hip), arms (shoulder + elbow), head (neck), blink, brows, mouth shapes, breathing, walk cycle.
// Feet are the origin: ch.set({x, y}) puts the feet centre at stage pixel (x, y).
(function () {
  const { h, clamp, lerp, E } = window.NSP;
  const NS = 'http://www.w3.org/2000/svg';
  let uid = 0;

  const UNI = { shirt: '#B39C87', shirtS: '#9C8571', shirtL: '#C6B19D', pant: '#A08A75', pantS: '#87725F',
    cap: '#B7A28D', capS: '#9D8873', band: '#8E3A4C', visor: '#2D2A2A', silver: '#DCE2EA', silverS: '#9AA4B2',
    belt: '#2E2A28', shoe: '#2D2A2A', cord: '#A33B4F' };
  const LOOKS = {
    // A: main officer (the "one police officer" through the whole lesson)
    A: { skin: '#F6D3B9', skinS: '#E7B898', hair: '#2E2420', style: 'short', scale: 1 },
    // B: woman officer, hair in a low bun, lashes
    B: { skin: '#F3CDB0', skinS: '#E2B192', hair: '#3A2620', style: 'bun', lashes: 1, scale: .95 },
    // C: tall officer with glasses
    C: { skin: '#E5B994', skinS: '#D19E78', hair: '#231B18', style: 'side', glasses: 1, scale: 1.06 },
    // D: shorter, rounder officer with darker skin
    D: { skin: '#D7A07A', skinS: '#C28761', hair: '#1F1916', style: 'crop', round: 1, scale: .93 },
    // S: student (white shirt, navy trousers, no cap)
    S: { skin: '#F7D7C0', skinS: '#E8BDA0', hair: '#2B211D', style: 'student', student: 1, scale: .96 },
  };

  function mouthPath(m, smile = 1) {
    // m = openness 0..1 ; a curved smile that opens downward
    const y = -226, w = 15 - 3 * m;
    return `M${-w} ${y} Q0 ${y + 3 * smile} ${w} ${y} Q0 ${y + 5 + 17 * m} ${-w} ${y}Z`;
  }

  function officer(look = 'A', opt = {}) {
    const L = LOOKS[look], id = 'po' + (++uid), stu = !!L.student;
    const shirt = stu ? '#FFFFFF' : UNI.shirt, shirtS = stu ? '#DCE5F1' : UNI.shirtS, pant = stu ? '#33456A' : UNI.pant, pantS = stu ? '#26375A' : UNI.pantS;
    const leg = s => `<g class="leg${s < 0 ? 'L' : 'R'}">
        <rect x="${s * 17 - 15}" y="-104" width="30" height="88" rx="13" fill="${pant}"/>
        <rect x="${s * 17 - 15}" y="-104" width="9" height="84" rx="5" fill="${pantS}" opacity=".45"/>
        <rect x="${s * 17 - 18}" y="-22" width="36" height="22" rx="10" fill="${UNI.shoe}"/>
        <rect x="${s * 17 - 12}" y="-19" width="14" height="5" rx="2.5" fill="#fff" opacity=".25"/></g>`;
    const arm = s => `<g class="arm${s < 0 ? 'L' : 'R'}">
        <rect x="${s * 41 - 12}" y="-190" width="24" height="50" rx="12" fill="${shirt}" stroke="${shirtS}" stroke-width="2"/>
        <g class="fore">
          <rect x="${s * 41 - 11}" y="-150" width="22" height="42" rx="11" fill="${shirt}" stroke="${shirtS}" stroke-width="2"/>
          <rect x="${s * 41 - 11}" y="-118" width="22" height="7" rx="3" fill="${shirtS}"/>
          <g class="prop"></g>
          <circle cx="${s * 41}" cy="-102" r="12" fill="${L.skin}"/>
          <path d="M${s * 41 - 8} -98 q8 6 16 0" stroke="${L.skinS}" stroke-width="2" fill="none" stroke-linecap="round"/></g></g>`;
    let hairBack = '', hairFront = '';
    if (L.style === 'bun') { hairBack = `<circle cx="-50" cy="-206" r="21" fill="${L.hair}"/><circle cx="-56" cy="-212" r="6" fill="#fff" opacity=".18"/><circle cx="-42" cy="-224" r="6" fill="#EE7FAA"/>`; hairFront = `<path d="M-57 -272 Q-66 -232 -50 -212 L-42 -262Z M57 -272 Q66 -232 50 -212 L42 -262Z" fill="${L.hair}"/>`; }
    if (L.style === 'short') hairFront = `<path d="M-55 -268 Q-58 -248 -52 -238 L-46 -262Z M55 -268 Q58 -248 52 -238 L46 -262Z" fill="${L.hair}"/>`;
    if (L.style === 'side') hairFront = `<path d="M-56 -270 Q-60 -244 -52 -232 L-46 -262Z M56 -270 Q60 -244 52 -232 L46 -262Z" fill="${L.hair}"/>`;
    if (L.style === 'crop') hairFront = `<path d="M-55 -268 Q-57 -252 -52 -244 L-46 -262Z M55 -268 Q57 -252 52 -244 L46 -262Z" fill="${L.hair}"/>`;
    if (stu) hairFront = `<path d="M-60 -246 Q-66 -300 -20 -312 Q30 -322 56 -292 Q66 -270 60 -244 Q52 -270 30 -280 Q4 -268 -30 -282 Q-52 -272 -60 -246Z" fill="${L.hair}"/>`;
    const faceRx = L.round ? 60 : 56, faceRy = L.round ? 54 : 56;
    const cap = stu ? '' : `<g class="cap">
        <path d="M-68 -282 Q-74 -322 0 -328 Q74 -322 68 -282 Q0 -268 -68 -282Z" fill="${UNI.cap}"/>
        <path d="M-60 -300 Q0 -318 60 -300" stroke="#fff" stroke-width="4" opacity=".25" fill="none" stroke-linecap="round"/>
        <path d="M-56 -288 Q0 -276 56 -288 L54 -270 Q0 -258 -54 -270Z" fill="${UNI.band}"/>
        <path d="M-58 -272 Q0 -256 58 -272 L56 -262 Q0 -242 -56 -262Z" fill="${UNI.visor}"/>
        <path d="M-40 -264 Q0 -254 40 -264" stroke="#fff" stroke-width="2.5" opacity=".18" fill="none"/>
        <path d="M0 -322 L13 -315 L12 -298 Q0 -288 -12 -298 L-13 -315Z" fill="${UNI.silver}" stroke="${UNI.silverS}" stroke-width="2"/>
        <circle cx="0" cy="-306" r="4.5" fill="${UNI.silverS}"/></g>`;
    const torso = stu ? `
        <path d="M-41 -100 L-45 -180 Q-45 -196 -30 -197 L30 -197 Q45 -196 45 -180 L41 -100Z" fill="${shirt}" stroke="${shirtS}" stroke-width="2.5"/>
        <path d="M-15 -197 L0 -178 L15 -197" fill="#fff" stroke="${shirtS}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M0 -178 L-6 -146 L0 -134 L6 -146Z" fill="#2F6BFF"/>
        <rect x="14" y="-170" width="22" height="20" rx="4" fill="none" stroke="${shirtS}" stroke-width="2.5"/>
        <path d="M-30 -168 l5 -5 5 5 -5 5z" fill="#EE7FAA"/>
        <rect x="-43" y="-110" width="86" height="12" rx="4" fill="${UNI.belt}"/>` : `
        <path d="M-41 -100 L-45 -180 Q-45 -196 -30 -197 L30 -197 Q45 -196 45 -180 L41 -100Z" fill="${UNI.shirt}"/>
        <path d="M-41 -100 L-45 -180 Q-45 -196 -30 -197 L-26 -197 L-32 -100Z" fill="${UNI.shirtS}" opacity=".35"/>
        <path d="M-17 -197 L0 -176 L17 -197" fill="${UNI.shirtL}" stroke="${UNI.shirtS}" stroke-width="2.5" stroke-linejoin="round"/>
        <path d="M-17 -197 L-24 -186 L-4 -180Z M17 -197 L24 -186 L4 -180Z" fill="${UNI.shirtL}" stroke="${UNI.shirtS}" stroke-width="2"/>
        <path d="M0 -176 V-112" stroke="${UNI.shirtS}" stroke-width="3"/>
        ${[-166, -146, -126].map(y => `<circle cx="0" cy="${y}" r="3" fill="${UNI.silver}"/>`).join('')}
        <rect x="-36" y="-170" width="24" height="24" rx="4" fill="${UNI.shirtL}" stroke="${UNI.shirtS}" stroke-width="2"/>
        <rect x="12" y="-170" width="24" height="24" rx="4" fill="${UNI.shirtL}" stroke="${UNI.shirtS}" stroke-width="2"/>
        <rect x="-36" y="-182" width="22" height="6" rx="2" fill="#31445D"/>
        <rect x="13" y="-182" width="7" height="6" fill="#2F6BFF"/><rect x="20" y="-182" width="7" height="6" fill="#FFD23F"/><rect x="27" y="-182" width="7" height="6" fill="#EF4444"/>
        <rect x="-46" y="-198" width="22" height="9" rx="3" fill="${UNI.shirtS}"/><rect x="24" y="-198" width="22" height="9" rx="3" fill="${UNI.shirtS}"/>
        <circle cx="-35" cy="-193.5" r="2.6" fill="${UNI.silver}"/><circle cx="35" cy="-193.5" r="2.6" fill="${UNI.silver}"/>
        <path d="M36 -196 Q46 -160 24 -146" stroke="${UNI.cord}" stroke-width="4" fill="none" stroke-linecap="round"/>
        <rect x="-43" y="-112" width="86" height="14" rx="4" fill="${UNI.belt}"/>
        <rect x="-10" y="-114" width="20" height="18" rx="3" fill="none" stroke="${UNI.silver}" stroke-width="4"/>`;
    const svg = `<svg width="${220}" height="${350}" viewBox="-110 -340 220 350" style="overflow:visible;position:absolute;left:0;top:0">
      <ellipse class="shadow" cx="0" cy="0" rx="58" ry="10" fill="rgba(49,68,93,.18)"/>
      <g class="body">
        ${leg(-1)}${leg(1)}
        <g class="torso">${torso}</g>
        ${arm(-1)}${arm(1)}
        <g class="head">
          <rect x="-11" y="-208" width="22" height="16" rx="6" fill="${L.skinS}"/>
          ${hairBack}
          <circle cx="${-faceRx}" cy="-246" r="11" fill="${L.skin}"/><circle cx="${faceRx}" cy="-246" r="11" fill="${L.skin}"/>
          <ellipse cx="0" cy="-250" rx="${faceRx}" ry="${faceRy}" fill="${L.skin}"/>
          ${hairFront}
          <ellipse cx="-33" cy="-228" rx="10" ry="6" fill="#F59BB8" opacity=".55"/><ellipse cx="33" cy="-228" rx="10" ry="6" fill="#F59BB8" opacity=".55"/>
          <g class="eyes">
            <g class="eye" transform="translate(-21 -246)"><ellipse class="eb" rx="9.5" ry="12" fill="#3A2A22"/><circle class="eh" cx="3" cy="-4.5" r="3.6" fill="#fff"/></g>
            <g class="eye" transform="translate(21 -246)"><ellipse class="eb" rx="9.5" ry="12" fill="#3A2A22"/><circle class="eh" cx="3" cy="-4.5" r="3.6" fill="#fff"/></g>
            ${L.lashes ? `<path class="lash" d="M-31 -256 l-6 -4 M31 -256 l6 -4" stroke="#3A2A22" stroke-width="3" stroke-linecap="round"/>` : ''}
          </g>
          <path class="browL" d="M-32 -266 Q-21 -273 -10 -266" stroke="${L.hair}" stroke-width="5" fill="none" stroke-linecap="round"/>
          <path class="browR" d="M10 -266 Q21 -273 32 -266" stroke="${L.hair}" stroke-width="5" fill="none" stroke-linecap="round"/>
          ${L.glasses ? `<g fill="none" stroke="#31445D" stroke-width="3.5"><circle cx="-21" cy="-246" r="16"/><circle cx="21" cy="-246" r="16"/><path d="M-5 -248 h10"/></g>` : ''}
          <path d="M-2 -236 q2 4 5 0" stroke="${L.skinS}" stroke-width="3" fill="none" stroke-linecap="round"/>
          <path class="mouth" d="" fill="#8E3A4C"/>
          <ellipse class="mouthO" cx="0" cy="-222" rx="7" ry="9" fill="#8E3A4C" opacity="0"/>
          ${cap}
        </g>
      </g></svg>`;
    const el = h(`<div class="actor" style="position:absolute;left:0;top:0;width:220px;height:350px;transform-origin:110px 340px"></div>`);
    el.innerHTML = svg;
    const q = s => el.querySelector(s);
    const parts = { body: q('.body'), legL: q('.legL'), legR: q('.legR'), torso: q('.torso'), armL: q('.armL'), armR: q('.armR'),
      foreL: q('.armL .fore'), foreR: q('.armR .fore'), propL: q('.armL .prop'), propR: q('.armR .prop'), head: q('.head'), eyes: [...el.querySelectorAll('.eye')],
      eb: [...el.querySelectorAll('.eb')], eh: [...el.querySelectorAll('.eh')], browL: q('.browL'), browR: q('.browR'), mouth: q('.mouth'), mouthO: q('.mouthO'), shadow: q('.shadow') };
    const blinkPh = (opt.blinkPhase ?? (uid * 1.37)) % 3.7;
    const base = L.scale * (opt.scale ?? 1);
    // props held in the right hand
    if (opt.prop === 'magnifier') parts.propR.innerHTML = `<g transform="translate(41 -102) rotate(-35)"><rect x="-4" y="-46" width="8" height="34" rx="4" fill="#31445D"/><circle cx="0" cy="-62" r="20" fill="rgba(230,244,255,.75)" stroke="#2F6BFF" stroke-width="6"/><path d="M-8 -70 q6 -6 14 -2" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/></g>`;
    if (opt.prop === 'clipboard') parts.propL.innerHTML = `<g transform="translate(-41 -110) rotate(10)"><rect x="-26" y="-34" width="52" height="64" rx="7" fill="#7E6A58"/><rect x="-21" y="-28" width="42" height="54" rx="4" fill="#fff"/><rect x="-10" y="-38" width="20" height="10" rx="3" fill="#DCE2EA"/><path d="M-14 -14h28M-14 -2h28M-14 10h18" stroke="#95BFEF" stroke-width="4" stroke-linecap="round"/></g>`;
    const R = (g, a, x, y) => g.setAttribute('transform', `rotate(${a.toFixed(2)} ${x} ${y})`);
    // p: { x, y, s, flip, o, t, walk (phase rad or null), armL, armR (outward deg), foreL, foreR (bend deg), head (tilt deg), lookX, expr, talk (0..1), brow }
    function set(p) {
      const t = p.t ?? 0, s = base * (p.s ?? 1), flip = p.flip ? -1 : 1;
      const walking = p.walk != null;
      const ph = walking ? p.walk : 0;
      const bodyBob = walking ? -Math.abs(Math.sin(ph)) * 7 : 0;
      const breathe = Math.sin(t * 2.1 + blinkPh) * 1.2;
      el.style.transform = `translate(${(p.x ?? 0) - 110}px,${(p.y ?? 0) - 340}px) scale(${s * flip},${s})`;
      el.style.opacity = p.o ?? 1;
      el.style.visibility = (p.o ?? 1) <= .001 ? 'hidden' : 'visible';
      parts.body.setAttribute('transform', `translate(0 ${(bodyBob + (p.dy ?? 0)).toFixed(2)})`);
      parts.torso.setAttribute('transform', `translate(0 ${(-breathe * .4).toFixed(2)})`);
      const sw = walking ? Math.sin(ph) * 24 : 0;
      R(parts.legL, sw + (p.legL ?? 0), -17, -100); R(parts.legR, -sw + (p.legR ?? 0), 17, -100);
      const aw = walking ? Math.sin(ph) * 20 : 0;
      R(parts.armL, (p.armL ?? 4) - aw, -41, -186); R(parts.armR, -(p.armR ?? 4) - aw, 41, -186);
      R(parts.foreL, -(p.foreL ?? 6), -41, -146); R(parts.foreR, (p.foreR ?? 6), 41, -146);
      parts.head.setAttribute('transform', `translate(${(p.lookX ?? 0) * 3} ${(-breathe * .7).toFixed(2)}) rotate(${(p.head ?? 0) + Math.sin(t * 1.3 + blinkPh) * 1.5} 0 -200)`);
      const lx = (p.lookX ?? 0) * 3;
      parts.eyes.forEach((e, i) => e.setAttribute('transform', `translate(${(i ? 21 : -21) + lx} -246)`));
      // blink every ~3.7 s (2 frames closed) or forced
      const bt = (t + blinkPh) % 3.7, closed = p.expr === 'happy' ? 1 : (bt < .1 || p.blink) ? 1 : 0;
      parts.eb.forEach(e => e.setAttribute('ry', closed ? 2.2 : (p.expr === 'surprise' ? 13.5 : 12)));
      parts.eh.forEach(e => e.setAttribute('opacity', closed ? 0 : 1));
      const br = (p.brow ?? 0) + (p.expr === 'surprise' ? 6 : p.expr === 'think' ? 3 : 0);
      parts.browL.setAttribute('transform', `translate(0 ${-br}) rotate(${p.expr === 'think' ? -8 : 0} -21 -268)`);
      parts.browR.setAttribute('transform', `translate(0 ${-br + (p.expr === 'think' ? -3 : 0)})`);
      const tk = p.talk ? clamp(p.talk) * (.35 + .65 * Math.abs(Math.sin(t * 11.3) * Math.sin(t * 4.7 + 1))) : 0;
      if (p.expr === 'surprise' || p.expr === 'o') { parts.mouth.setAttribute('d', ''); parts.mouthO.setAttribute('opacity', 1); parts.mouthO.setAttribute('ry', p.expr === 'o' ? 6 : 10); }
      else { parts.mouthO.setAttribute('opacity', 0); parts.mouth.setAttribute('d', mouthPath(p.expr === 'big' || p.expr === 'happy' ? .85 : p.expr === 'smile' ? .35 + tk * .5 : .12 + tk * .8)); }
    }
    set({});
    return { el, set, look };
  }

  // tiny person glyph (for "1 คน" / "หลายคน" counts), police cap silhouette
  function person(size = 60, c = '#2F6BFF', cap = true) {
    return `<svg width="${size}" height="${size}" viewBox="0 0 60 60"><circle cx="30" cy="22" r="12" fill="${c}"/>${cap ? `<path d="M15 16 Q30 2 45 16 L45 19 Q30 15 15 19Z" fill="${c}"/><path d="M14 18 Q30 13 46 18" stroke="#fff" stroke-width="2.5" fill="none"/>` : ''}<path d="M10 58 Q10 38 30 38 Q50 38 50 58Z" fill="${c}"/></svg>`;
  }

  // police station exterior (generic, original): facade, sign, windows, door, steps, plants, sidewalk
  function station(parent, { top = 640, sign = true } = {}) {
    const el = h(`<div class="abs" style="left:0;top:${top}px;width:1080px;height:900px"></div>`);
    el.innerHTML = `<svg width="1080" height="900" viewBox="0 0 1080 900" style="position:absolute;left:0;top:0">
      <defs><linearGradient id="stw" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF6FA"/><stop offset="1" stop-color="#FFE3EF"/></linearGradient>
      <linearGradient id="stg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE4FA"/><stop offset="1" stop-color="#95BFEF"/></linearGradient>
      <linearGradient id="stwin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#E6F4FF"/><stop offset="1" stop-color="#B8D9F8"/></linearGradient></defs>
      <rect x="90" y="40" width="900" height="660" rx="26" fill="url(#stw)" stroke="#F7A8C4" stroke-width="6"/>
      <path d="M60 60 Q60 20 100 20 H980 Q1020 20 1020 60 V78 H60Z" fill="#2F6BFF"/>
      <path d="M60 78 H1020" stroke="#22D3EE" stroke-width="6"/>
      ${sign ? `<rect x="300" y="96" width="480" height="96" rx="20" fill="#142B53"/>
      <text x="540" y="140" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="40" fill="#fff">สถานีตำรวจ</text>
      <text x="540" y="178" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="24" letter-spacing="4" fill="#95BFEF">POLICE STATION</text>
      <circle cx="262" cy="144" r="34" fill="#FFD23F"/><path d="M262 120 L276 128 L274 152 Q262 164 250 152 L248 128Z" fill="#fff"/>
      <circle cx="818" cy="144" r="34" fill="#FFD23F"/><path d="M818 120 L832 128 L830 152 Q818 164 806 152 L804 128Z" fill="#fff"/>` : ''}
      ${[150, 330, 650, 830].map(x => `<rect x="${x}" y="240" width="110" height="150" rx="14" fill="url(#stwin)" stroke="#95BFEF" stroke-width="6"/><path d="M${x + 55} 240 V390 M${x} 315 H${x + 110}" stroke="#95BFEF" stroke-width="5"/><path d="M${x + 14} 256 l30 -0 -30 40z" fill="#fff" opacity=".6"/>`).join('')}
      ${[150, 830].map(x => `<rect x="${x}" y="440" width="110" height="150" rx="14" fill="url(#stwin)" stroke="#95BFEF" stroke-width="6"/><path d="M${x + 55} 440 V590" stroke="#95BFEF" stroke-width="5"/>`).join('')}
      <rect x="430" y="420" width="220" height="280" rx="16" fill="#E6F4FF" stroke="#2F6BFF" stroke-width="7"/>
      <path d="M540 420 V700" stroke="#2F6BFF" stroke-width="6"/><rect x="514" y="540" width="8" height="40" rx="4" fill="#2F6BFF"/><rect x="558" y="540" width="8" height="40" rx="4" fill="#2F6BFF"/>
      <path d="M440 432 l40 0 -40 60z M550 432 l40 0 -40 60z" fill="#fff" opacity=".7"/>
      <rect x="400" y="396" width="280" height="22" rx="8" fill="#EE7FAA"/>
      ${[300, 760].map(x => `<rect x="${x}" y="610" width="70" height="80" rx="10" fill="#EE7FAA"/><circle cx="${x + 20}" cy="596" r="26" fill="#7BD3A0"/><circle cx="${x + 50}" cy="590" r="30" fill="#5FC48B"/><circle cx="${x + 35}" cy="572" r="24" fill="#8BDDAE"/>`).join('')}
      <rect x="380" y="700" width="320" height="18" rx="6" fill="#F7A8C4"/><rect x="350" y="716" width="380" height="18" rx="6" fill="#EE7FAA"/>
      <rect x="0" y="732" width="1080" height="170" fill="url(#stg)"/>
      <path d="M0 732 H1080" stroke="#fff" stroke-width="6" opacity=".8"/>
      ${[...Array(9)].map((_, i) => `<path d="M${i * 130 - 20} 732 L${i * 130 - 80} 900" stroke="#fff" stroke-width="4" opacity=".35"/>`).join('')}
    </svg>`;
    parent.appendChild(el);
    return el;
  }

  // generic "looking for" notice board with an anonymous silhouette (no real person, no violence)
  function searchBoard(parent, { left, top, w = 250 }) {
    const el = h(`<div class="abs c" style="left:${left}px;top:${top}px;width:${w}px"></div>`);
    el.innerHTML = `<svg width="${w}" height="${w * 1.05}" viewBox="0 0 250 262">
      <rect x="10" y="10" width="230" height="230" rx="20" fill="#fff" stroke="#142B53" stroke-width="8"/>
      <rect x="10" y="10" width="230" height="56" rx="20" fill="#142B53"/><rect x="10" y="40" width="230" height="26" fill="#142B53"/>
      <text x="125" y="50" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="26" fill="#FFD23F">กำลังตามหา</text>
      <rect x="62" y="82" width="126" height="126" rx="14" fill="#E6F4FF"/>
      <circle cx="125" cy="128" r="28" fill="#95BFEF"/><path d="M78 208 Q78 166 125 166 Q172 166 172 208Z" fill="#95BFEF"/>
      <text x="125" y="140" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="40" fill="#fff">?</text>
      <text x="125" y="232" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="20" fill="#31445D">ผู้ต้องสงสัย</text>
      <rect x="117" y="240" width="16" height="22" fill="#7E6A58"/></svg>`;
    parent.appendChild(el);
    return el;
  }

  // UI icons (original line icons)
  const ICO = {
    check: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11" fill="none" stroke="${c}" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cross: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="${c}" stroke-width="3.6" stroke-linecap="round"/></svg>`,
    warn: (s = 40, c = '#142B53') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 3L22 20H2Z" fill="#FFD23F" stroke="${c}" stroke-width="2" stroke-linejoin="round"/><path d="M12 9v5" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="17" r="1.5" fill="${c}"/></svg>`,
    bulb: (s = 40, c = '#142B53') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2a7 7 0 0 0-4 12.7V18h8v-3.3A7 7 0 0 0 12 2z" fill="#FFD23F" stroke="${c}" stroke-width="1.8"/><path d="M9 21h6" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    mag: (s = 40, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="rgba(230,244,255,.6)" stroke="${c}" stroke-width="2.6"/><path d="M15 15l6 6" stroke="${c}" stroke-width="3" stroke-linecap="round"/></svg>`,
    book: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/><path d="M12 6v14" stroke="${c}" stroke-width="2"/></svg>`,
    comment: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="none" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"/></svg>`,
    like: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M7 10v10H3V10zM7 10l4-7c1.6 0 2.6 1.2 2.2 2.8L12.5 9H19a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.8 20H7" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/></svg>`,
    share: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" fill="${c}"/><circle cx="6" cy="12" r="3" fill="${c}"/><circle cx="18" cy="19" r="3" fill="${c}"/><path d="M8.6 10.6l6.8-4M8.6 13.4l6.8 4" stroke="${c}" stroke-width="2.2"/></svg>`,
    bell: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6 17V11a6 6 0 0 1 12 0v6l2 2H4z" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/><path d="M10 21h4" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    timer: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="13.5" r="8" fill="none" stroke="${c}" stroke-width="2.6"/><path d="M12 9v5l3 2M9 2.5h6" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    cal: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="16" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M3 10h18M8 3v4M16 3v4" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    q: (s = 120) => `<svg width="${s}" height="${s * 1.3}" viewBox="0 0 100 130"><defs><linearGradient id="qmg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FF91BA"/><stop offset=".5" stop-color="#EE7FAA"/><stop offset=".5" stop-color="#2F6BFF"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs><path d="M22 40 Q22 8 52 8 Q82 8 82 36 Q82 54 64 62 Q54 67 54 80 V86" fill="none" stroke="#fff" stroke-width="30" stroke-linecap="round"/><path d="M22 40 Q22 8 52 8 Q82 8 82 36 Q82 54 64 62 Q54 67 54 80 V86" fill="none" stroke="url(#qmg)" stroke-width="18" stroke-linecap="round"/><circle cx="54" cy="114" r="15" fill="#fff"/><circle cx="54" cy="114" r="10" fill="#2F6BFF"/></svg>`,
  };

  window.CHAR = { officer, person, station, searchBoard, ICO, UNI, LOOKS };
})();
