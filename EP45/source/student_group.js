// NaiSibPro EP.45 — twelve stylised 2D students + Blue Dominant classroom set with a camera.
// All drawings are original SVG.  A student is rigged (legs, arms, head, eyes, mouth) so it can sit,
// stand, walk, gesture, blink and turn into a silhouette.  No individual scores are ever attached to a
// student: the narration only gives group sizes and averages.
(function () {
  const { h, clamp, lerp, E } = window.NSP;
  const COL = { navy: '#142B53', blue: '#2F6BFF', cyan: '#22D3EE', light: '#95BFEF', ice: '#E6F4FF', pink: '#EE7FAA', yellow: '#FFD23F', text: '#31445D' };

  // 12 looks: hair style / hair / skin / shirt / bottom / accessory.  Index 7 is the student who leaves
  // (pink hoodie + star pin: the only pink character, so they stay recognisable all episode long).
  const LOOKS = [
    { hair: 'short', hc: '#2A2F45', skin: '#F6D2B4', shirt: '#FFFFFF', bottom: '#22355E', acc: '#2F6BFF', skirt: 0 },
    { hair: 'bob',   hc: '#3B2A2A', skin: '#F3C9A6', shirt: '#FFFFFF', bottom: '#22355E', acc: '#22D3EE', skirt: 1 },
    { hair: 'spiky', hc: '#1E2233', skin: '#E9B98F', shirt: '#DCEBFF', bottom: '#22355E', acc: '#142B53', skirt: 0 },
    { hair: 'pony',  hc: '#4A3426', skin: '#F7D7BC', shirt: '#FFFFFF', bottom: '#22355E', acc: '#95BFEF', skirt: 1 },
    { hair: 'side',  hc: '#2B2B3A', skin: '#F2C7A2', shirt: '#FFFFFF', bottom: '#22355E', acc: '#FFD23F', skirt: 0 },
    { hair: 'long',  hc: '#1F1B2A', skin: '#F6D2B4', shirt: '#E6F4FF', bottom: '#22355E', acc: '#2F6BFF', skirt: 1 },
    { hair: 'buzz',  hc: '#2C2C2C', skin: '#DDA77F', shirt: '#FFFFFF', bottom: '#22355E', acc: '#22D3EE', skirt: 0 },
    { hair: 'short', hc: '#5A3A28', skin: '#F4CDAE', shirt: '#FFFFFF', bottom: '#22355E', acc: '#EE7FAA', skirt: 0, hoodie: '#EE7FAA', star: 1 }, // leaver
    { hair: 'bun',   hc: '#3A2A22', skin: '#F7D9C0', shirt: '#FFFFFF', bottom: '#22355E', acc: '#2F6BFF', skirt: 1 },
    { hair: 'side',  hc: '#1C2030', skin: '#EDBE97', shirt: '#DCEBFF', bottom: '#22355E', acc: '#142B53', skirt: 0, glasses: 1 },
    { hair: 'bob',   hc: '#2A1E1E', skin: '#F1C6A0', shirt: '#FFFFFF', bottom: '#22355E', acc: '#FFD23F', skirt: 1, glasses: 1 },
    { hair: 'spiky', hc: '#3A2C24', skin: '#F6D2B4', shirt: '#FFFFFF', bottom: '#22355E', acc: '#95BFEF', skirt: 0 },
  ];
  const LEAVER = 7;

  // ---------- hair (head centre 0,-196, r 40) ----------
  function hairBack(lk) {
    const c = lk.hc;
    if (lk.hair === 'long') return `<path d="M-44 -200 Q-50 -150 -40 -128 L40 -128 Q50 -150 44 -200Z" fill="${c}"/>`;
    if (lk.hair === 'pony') return `<path d="M30 -222 Q70 -214 62 -168 Q58 -150 48 -146 Q54 -180 30 -200Z" fill="${c}"/>`;
    if (lk.hair === 'bob') return `<path d="M-46 -200 Q-50 -160 -36 -158 L36 -158 Q50 -160 46 -200Z" fill="${c}"/>`;
    return '';
  }
  function hairFront(lk) {
    const c = lk.hc;
    switch (lk.hair) {
      case 'short': return `<path d="M-42 -192 Q-46 -244 0 -244 Q46 -244 42 -192 Q36 -214 18 -218 Q4 -208 -14 -220 Q-34 -214 -42 -192Z" fill="${c}"/>`;
      case 'spiky': return `<path d="M-42 -190 Q-48 -230 -30 -240 L-26 -256 L-12 -244 L0 -260 L10 -244 L26 -254 L28 -238 Q48 -228 42 -190 Q36 -212 14 -216 Q0 -206 -16 -218 Q-34 -212 -42 -190Z" fill="${c}"/>`;
      case 'bob': return `<path d="M-46 -176 Q-52 -246 0 -246 Q52 -246 46 -176 L38 -176 Q38 -206 24 -214 Q-6 -204 -30 -212 Q-38 -200 -38 -176Z" fill="${c}"/>`;
      case 'pony': return `<path d="M-42 -192 Q-46 -244 0 -244 Q46 -244 42 -196 Q30 -220 6 -222 Q-20 -222 -42 -192Z" fill="${c}"/><circle cx="34" cy="-222" r="7" fill="${COL.blue}"/>`;
      case 'side': return `<path d="M-42 -190 Q-46 -246 4 -244 Q46 -240 42 -194 Q34 -222 -6 -222 Q-26 -214 -42 -190Z" fill="${c}"/>`;
      case 'long': return `<path d="M-44 -170 Q-50 -246 0 -246 Q50 -246 44 -170 L38 -172 Q36 -212 16 -218 Q-2 -206 -20 -216 Q-38 -206 -38 -172Z" fill="${c}"/>`;
      case 'buzz': return `<path d="M-41 -200 Q-42 -242 0 -242 Q42 -242 41 -200 Q36 -226 0 -228 Q-36 -226 -41 -200Z" fill="${c}"/>`;
      case 'bun': return `<circle cx="0" cy="-248" r="17" fill="${c}"/><path d="M-42 -192 Q-46 -244 0 -244 Q46 -244 42 -192 Q34 -216 0 -220 Q-34 -216 -42 -192Z" fill="${c}"/><rect x="-14" y="-236" width="28" height="6" rx="3" fill="${COL.cyan}"/>`;
    }
    return '';
  }

  // full rigged character: returns { el, pose(p) } ; el is an <svg> sized 140x280 with feet at (70,262)
  let uid = 0;
  function student(lk, { scale = 1 } = {}) {
    const id = 'st' + (++uid);
    const top = lk.hoodie || lk.shirt;
    const el = h(`<svg class="stu" width="${150 * scale}" height="${290 * scale}" viewBox="-75 -275 150 290" style="position:absolute;overflow:visible">
      <defs><linearGradient id="${id}sh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${top}"/><stop offset="1" stop-color="${lk.hoodie ? '#D9608F' : '#D7E6FA'}"/></linearGradient></defs>
      <ellipse class="shadow" cx="0" cy="2" rx="40" ry="8" fill="rgba(20,43,83,.18)"/>
      <g class="rig">
        <g class="legs">
          <g class="legL" transform="translate(-13 -92)"><rect x="-10" y="0" width="20" height="84" rx="9" fill="${lk.bottom}"/><ellipse cx="-2" cy="86" rx="15" ry="7" fill="#1A2238"/></g>
          <g class="legR" transform="translate(13 -92)"><rect x="-10" y="0" width="20" height="84" rx="9" fill="${lk.bottom}"/><ellipse cx="2" cy="86" rx="15" ry="7" fill="#1A2238"/></g>
          ${lk.skirt ? `<path d="M-36 -98 L36 -98 L44 -58 L-44 -58Z" fill="${lk.bottom}"/>` : `<rect x="-30" y="-100" width="60" height="22" rx="8" fill="${lk.bottom}"/>`}
        </g>
        <g class="upper">
          <g class="armL" transform="translate(-33 -150)"><rect x="-9" y="0" width="18" height="60" rx="9" fill="url(#${id}sh)"/><circle cx="0" cy="62" r="10" fill="${lk.skin}"/></g>
          <g class="armR" transform="translate(33 -150)"><rect x="-9" y="0" width="18" height="60" rx="9" fill="url(#${id}sh)"/><circle cx="0" cy="62" r="10" fill="${lk.skin}"/></g>
          <path d="M-33 -158 Q0 -166 33 -158 L36 -98 Q0 -92 -36 -98Z" fill="url(#${id}sh)"/>
          ${lk.hoodie ? `<path d="M-6 -156 L-6 -100 M6 -156 L6 -100" stroke="#fff" stroke-width="3" opacity=".7"/><path d="M-26 -160 Q0 -146 26 -160" stroke="#C94F7E" stroke-width="7" fill="none" stroke-linecap="round"/>`
                     : `<path d="M-12 -160 L0 -146 L12 -160" fill="none" stroke="#C9D8EE" stroke-width="4"/><path d="M-4 -148 L4 -148 L7 -124 L0 -116 L-7 -124Z" fill="${lk.acc}"/>`}
          ${lk.star ? `<path d="M20 -136 l3 6 6 1 -4.5 4.3 1 6.2 -5.5-3 -5.5 3 1-6.2 -4.5-4.3 6-1z" fill="${COL.yellow}" stroke="#fff" stroke-width="1.5"/>` : `<rect x="14" y="-142" width="13" height="9" rx="2" fill="${lk.acc}" opacity=".8"/>`}
          <g class="head">
            ${hairBack(lk)}
            <rect x="-9" y="-162" width="18" height="10" fill="${lk.skin}"/>
            <circle cx="0" cy="-196" r="40" fill="${lk.skin}"/>
            <g class="face">
              <ellipse cx="-24" cy="-180" rx="7" ry="4.5" fill="#F29BB8" opacity=".35"/><ellipse cx="24" cy="-180" rx="7" ry="4.5" fill="#F29BB8" opacity=".35"/>
              <g class="eyes"><ellipse class="eL" cx="-14" cy="-194" rx="4.6" ry="6.4" fill="#1E2436"/><ellipse class="eR" cx="14" cy="-194" rx="4.6" ry="6.4" fill="#1E2436"/>
                <circle cx="-12.6" cy="-196.5" r="1.6" fill="#fff"/><circle cx="15.4" cy="-196.5" r="1.6" fill="#fff"/></g>
              <path class="brows" d="M-21 -207 Q-14 -211 -7 -207 M7 -207 Q14 -211 21 -207" stroke="${lk.hc}" stroke-width="3" fill="none" stroke-linecap="round"/>
              <path class="mouth" d="M-8 -176 Q0 -169 8 -176" stroke="#7A2E3A" stroke-width="3.2" fill="none" stroke-linecap="round"/>
              ${lk.glasses ? `<g fill="none" stroke="${COL.navy}" stroke-width="2.6"><circle cx="-14" cy="-194" r="10"/><circle cx="14" cy="-194" r="10"/><path d="M-4 -195 L4 -195"/></g>` : ''}
            </g>
            ${hairFront(lk)}
          </g>
        </g>
      </g></svg>`);
    const q = s => el.querySelector(s);
    const parts = { rig: q('.rig'), legs: q('.legs'), legL: q('.legL'), legR: q('.legR'), armL: q('.armL'), armR: q('.armR'), head: q('.head'), face: q('.face'), eyes: q('.eyes'), mouth: q('.mouth'), upper: q('.upper'), shadow: q('.shadow') };
    const MOUTH = { smile: 'M-8 -176 Q0 -169 8 -176', grin: 'M-10 -178 Q0 -164 10 -178 Z', o: 'M-4 -176 Q0 -182 4 -176 Q0 -168 -4 -176Z', flat: 'M-7 -174 L7 -174', worried: 'M-8 -172 Q0 -178 8 -172', open: 'M-9 -178 Q0 -162 9 -178 Z' };
    function pose({ walk = 0, walkAmt = 0, armL = 8, armR = -8, tilt = 0, lookX = 0, lookY = 0, blink = 0, expr = 'smile', legs = 1, bob = 0 } = {}) {
      const sw = Math.sin(walk) * 26 * walkAmt;
      const lift = Math.abs(Math.sin(walk)) * 5 * walkAmt;
      parts.legL.setAttribute('transform', `translate(-13 -92) rotate(${sw})`);
      parts.legR.setAttribute('transform', `translate(13 -92) rotate(${-sw})`);
      parts.legs.style.opacity = legs;
      parts.armL.setAttribute('transform', `translate(-33 -150) rotate(${armL - sw * .8})`);
      parts.armR.setAttribute('transform', `translate(33 -150) rotate(${armR + sw * .8})`);
      parts.upper.setAttribute('transform', `translate(0 ${-lift + bob})`);
      parts.head.setAttribute('transform', `rotate(${tilt} 0 -160)`);
      parts.face.setAttribute('transform', `translate(${lookX * 7} ${lookY * 4})`);
      parts.eyes.setAttribute('transform', `translate(0 -194) scale(1 ${Math.max(.08, 1 - blink)}) translate(0 194)`);
      const m = MOUTH[expr] || MOUTH.smile;
      parts.mouth.setAttribute('d', m);
      parts.mouth.setAttribute('fill', m.endsWith('Z') ? '#7A2E3A' : 'none');
      parts.shadow.style.opacity = legs;
    }
    pose();
    return { el, pose, look: lk };
  }
  const blinkAt = (t, ph = 0) => { const u = (t + ph * 1.37) % 3.7; return u < .12 ? Math.sin(u / .12 * Math.PI) : 0; };

  // round bust avatar (static) used by the math diagrams
  function avatar(lk, size = 60, { ring = null, bg = '#DCEBFF', dashed = false } = {}) {
    if (dashed) return `<div class="av" style="width:${size}px;height:${size}px;border-radius:50%;border:${Math.max(3, size * .06)}px dashed ${ring || COL.pink};background:rgba(238,127,170,.08)"></div>`;
    const top = lk.hoodie || lk.shirt;
    return `<div class="av" style="width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;background:${bg};box-shadow:0 0 0 ${Math.max(2, size * .05)}px ${ring || '#fff'}${ring ? `,0 0 ${size * .3}px ${ring}` : ''}">
      <svg width="${size}" height="${size}" viewBox="-60 -262 120 120">${hairBack(lk)}<path d="M-46 -120 Q-46 -160 0 -160 Q46 -160 46 -120Z" fill="${top}"/>${lk.hoodie ? '' : `<path d="M-4 -150 L4 -150 L6 -128 L-6 -128Z" fill="${lk.acc}"/>`}
      <circle cx="0" cy="-196" r="40" fill="${lk.skin}"/><ellipse cx="-14" cy="-194" rx="4.6" ry="6.4" fill="#1E2436"/><ellipse cx="14" cy="-194" rx="4.6" ry="6.4" fill="#1E2436"/>
      <path d="M-8 -176 Q0 -169 8 -176" stroke="#7A2E3A" stroke-width="3.2" fill="none" stroke-linecap="round"/>${lk.glasses ? `<g fill="none" stroke="${COL.navy}" stroke-width="2.6"><circle cx="-14" cy="-194" r="10"/><circle cx="14" cy="-194" r="10"/></g>` : ''}${hairFront(lk)}</svg></div>`;
  }
  // grid of 12 avatars (rows x 4) ; mode 'all' | 'eleven' (leaver slot dashed) | 'none'
  function avatarGrid(size = 50, gap = 8, { leaverRing = true } = {}) {
    const wrap = h(`<div class="avgrid" style="position:relative;width:${4 * size + 3 * gap}px;height:${3 * size + 2 * gap}px"></div>`);
    const cells = LOOKS.map((lk, i) => {
      const c = h(`<div style="position:absolute;left:${(i % 4) * (size + gap)}px;top:${Math.floor(i / 4) * (size + gap)}px;width:${size}px;height:${size}px"></div>`);
      c.innerHTML = avatar(lk, size, { ring: i === LEAVER && leaverRing ? COL.pink : null });
      const slot = h(`<div style="position:absolute;inset:0">${avatar(lk, size, { dashed: true })}</div>`);
      c.appendChild(slot); slot.style.opacity = 0;
      wrap.appendChild(c);
      return { el: c, face: c.firstElementChild, slot };
    });
    return { el: wrap, cells };
  }

  // ---------------------------------------------------------------- classroom
  // world coordinates == screen coordinates at camera (540, 960, 1)
  const ROWS = [{ y: 1000, s: .70, dx: 128 }, { y: 1140, s: .80, dx: 148 }, { y: 1290, s: .90, dx: 168 }];
  const DOOR = { x: 930, floor: 905, s: .62 };
  function seatOf(i) { const r = ROWS[Math.floor(i / 4)], c = i % 4; return { x: 540 + (c - 1.5) * r.dx, y: r.y, s: r.s, row: Math.floor(i / 4) }; }
  function deskSVG(s) {
    const w = 120 * s, hgt = 100 * s;
    return `<svg width="${w + 20}" height="${hgt + 20}" viewBox="${-w / 2 - 10} ${-16 * s - 4} ${w + 20} ${hgt + 20}" style="position:absolute;overflow:visible">
      <rect x="${-w / 2 + 6 * s}" y="${60 * s}" width="${7 * s}" height="${40 * s}" fill="#1D3566"/><rect x="${w / 2 - 13 * s}" y="${60 * s}" width="${7 * s}" height="${40 * s}" fill="#1D3566"/>
      <rect x="${-w / 2 + 4 * s}" y="0" width="${w - 8 * s}" height="${64 * s}" rx="${6 * s}" fill="#BCD6F6"/>
      <rect x="${-w / 2 + 4 * s}" y="${44 * s}" width="${w - 8 * s}" height="${8 * s}" fill="#A7C7F0"/>
      <rect x="${-w / 2}" y="${-14 * s}" width="${w}" height="${16 * s}" rx="${5 * s}" fill="#FFFFFF"/>
      <rect x="${-w / 2}" y="${-2 * s}" width="${w}" height="${5 * s}" rx="${2 * s}" fill="#7FB2F0"/></svg>`;
  }
  function classroom(container) {
    const world = h(`<div class="world" style="position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0"></div>`);
    container.appendChild(world);
    world.innerHTML = `<svg class="room" width="1880" height="2720" viewBox="-400 -400 1880 2720" style="position:absolute;left:-400px;top:-400px">
      <defs>
        <linearGradient id="cWall" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#BFD9FB"/><stop offset="1" stop-color="#D9EAFF"/></linearGradient>
        <linearGradient id="cFloor" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#CFE2F8"/><stop offset="1" stop-color="#E9F3FF"/></linearGradient>
        <linearGradient id="cWin" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#BDE9F7"/></linearGradient>
        <radialGradient id="cLight" cx=".5" cy=".3" r=".7"><stop offset="0" stop-color="rgba(255,255,255,.7)"/><stop offset="1" stop-color="rgba(255,255,255,0)"/></radialGradient>
      </defs>
      <rect x="-400" y="-400" width="1880" height="1305" fill="url(#cWall)"/>
      ${[...Array(9)].map((_, i) => `<rect x="${-300 + i * 200}" y="-400" width="4" height="1305" fill="rgba(255,255,255,.35)"/>`).join('')}
      <rect x="-400" y="905" width="1880" height="1500" fill="url(#cFloor)"/>
      ${[...Array(15)].map((_, i) => `<path d="M${540 + (i - 7) * 70} 905 L${540 + (i - 7) * 260} 2300" stroke="rgba(47,107,255,.07)" stroke-width="3"/>`).join('')}
      ${[0, 1, 2, 3, 4].map(i => `<path d="M-400 ${960 + i * i * 60 + i * 40} H1480" stroke="rgba(47,107,255,.06)" stroke-width="3"/>`).join('')}
      <rect x="-400" y="893" width="1880" height="14" fill="#9CC2F2"/>
      <!-- window (left) -->
      <g transform="translate(40 640)"><rect width="150" height="200" rx="12" fill="#1D3566"/><rect x="10" y="10" width="130" height="180" rx="6" fill="url(#cWin)"/>
        <path d="M75 10 V190 M10 100 H140" stroke="#1D3566" stroke-width="7"/><path d="M24 30 L60 30 M24 44 L48 44" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/></g>
      <!-- whiteboard -->
      <g transform="translate(270 625)"><rect width="540" height="215" rx="18" fill="#142B53"/><rect x="10" y="10" width="520" height="195" rx="12" fill="#F7FBFF"/>
        <rect x="10" y="190" width="520" height="15" fill="#DCEBFF"/>
        <text x="270" y="64" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="38" fill="#2F6BFF">ค่าเฉลี่ยเลขคณิต</text>
        <g transform="translate(78 92)">${[38, 66, 50, 80, 58, 72, 44].map((v, i) => `<rect x="${i * 44}" y="${80 - v}" width="28" height="${v}" rx="5" fill="${i % 2 ? '#95BFEF' : '#2F6BFF'}" opacity=".85"/>`).join('')}
          <path d="M-8 22 H310" stroke="#22D3EE" stroke-width="4" stroke-dasharray="10 8"/></g>
        <text x="460" y="150" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="40" fill="#142B53">x̄</text></g>
      <!-- door (back wall, right) -->
      <g class="door-back"><rect x="868" y="700" width="124" height="208" rx="8" fill="#142B53"/><rect x="878" y="710" width="104" height="198" fill="#0C1C3A"/>
        <rect x="878" y="710" width="104" height="198" fill="url(#cLight)" opacity=".25"/></g>
      <rect x="-400" y="-400" width="1880" height="2720" fill="url(#cLight)" opacity=".5"/>
      <g class="clock" transform="translate(960 600)"><circle r="34" fill="#fff" stroke="#142B53" stroke-width="6"/><path class="ch" d="M0 0 V-22" stroke="#142B53" stroke-width="5" stroke-linecap="round"/><path class="cm" d="M0 0 H16" stroke="#2F6BFF" stroke-width="5" stroke-linecap="round"/></g>
    </svg>
    <div class="group-box" style="position:absolute;left:222px;top:842px;width:642px;height:560px;border-radius:44px;border:5px dashed rgba(34,211,238,.9);box-shadow:0 0 0 8px rgba(34,211,238,.12),inset 0 0 40px rgba(34,211,238,.15)"></div>
    <div class="actors"></div>
    <svg class="door-front" width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0;pointer-events:none">
      <path d="M862 694 H998 V912 H984 V708 H876 V912 H862Z" fill="#2F6BFF"/><path d="M984 708 L1030 690 L1030 930 L984 912Z" fill="#E6F4FF" stroke="#2F6BFF" stroke-width="4"/><circle cx="1020" cy="812" r="5" fill="#FFD23F"/></svg>`;
    const actors = world.querySelector('.actors');
    const kids = [];
    // build by rows, back to front: students then desks of that row
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        const i = r * 4 + c, st = seatOf(i);
        const s = student(LOOKS[i]); const wrap = h(`<div class="kid" style="position:absolute;left:0;top:0;transform-origin:0 0"></div>`);
        wrap.appendChild(s.el); s.el.style.left = '-75px'; s.el.style.top = '-275px';
        const ring = h(`<div class="hl" style="position:absolute;left:-70px;top:-60px;width:140px;height:44px;border-radius:50%;border:6px solid ${COL.pink};box-shadow:0 0 24px ${COL.pink};opacity:0"></div>`);
        wrap.insertBefore(ring, s.el);
        actors.appendChild(wrap);
        kids[i] = { ...s, wrap, ring, seat: st, i };
      }
      for (let c = 0; c < 4; c++) {
        const st = seatOf(r * 4 + c);
        const d = h(`<div class="desk" style="position:absolute;left:${st.x}px;top:${st.y}px">${deskSVG(st.s)}</div>`);
        d.firstChild.style.left = -(120 * st.s / 2 + 10) + 'px'; d.firstChild.style.top = -(16 * st.s + 4) + 'px';
        const paper = h(`<div class="paper" style="position:absolute;left:${-34 * st.s}px;top:${-30 * st.s}px;width:${46 * st.s}px;height:${30 * st.s}px;border-radius:${3 * st.s}px;background:#fff;box-shadow:0 2px 6px rgba(20,43,83,.25);transform:skewX(-12deg);opacity:0">
          <div style="margin:${5 * st.s}px ${5 * st.s}px 0;height:${3 * st.s}px;background:#95BFEF"></div><div style="margin:${4 * st.s}px ${5 * st.s}px 0;height:${3 * st.s}px;width:60%;background:#95BFEF"></div></div>`);
        d.appendChild(paper);
        actors.appendChild(d);
        kids[r * 4 + c].desk = d; kids[r * 4 + c].paper = paper;
      }
    }
    // a kid's placement: x, feet y, scale, seated amount (1 seated, 0 standing)
    function place(k, { x = k.seat.x, y, s = k.seat.s, sit = 1, o = 1, z = null } = {}) {
      const feet = y ?? (k.seat.y + lerp(100, 120, sit) * s);
      k.wrap.style.transform = `translate(${x}px,${feet}px) scale(${s})`;
      k.wrap.style.opacity = o; k.wrap.style.visibility = o > .001 ? 'visible' : 'hidden';
      if (z !== null) k.wrap.style.zIndex = z;
    }
    function camera(cx, cy, z) { world.style.transform = `translate(${540 - cx * z}px,${960 - cy * z}px) scale(${z})`; }
    const w2s = (cam, x, y) => [540 + (x - cam[0]) * cam[2], 960 + (y - cam[1]) * cam[2]];
    return { world, kids, place, camera, w2s, groupBox: world.querySelector('.group-box'), clock: world.querySelector('.clock') };
  }

  window.STUDENTS = { COL, LOOKS, LEAVER, ROWS, DOOR, student, avatar, avatarGrid, classroom, seatOf, blinkAt };
})();
