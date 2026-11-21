// NaiSibPro EP.60 tech prop kit: CPU chip character, GPU card, core grid, task icons, monitor, low-poly mesh.
// Blue = CPU world, pink = GPU world. All SVG, deterministic (state is set from draw(t)).
(function () {
  let gid = 0;
  const C = {
    eb: '#2F6BFF', sb: '#95BFEF', cy: '#22D3EE', nv: '#142B53',
    bp: '#EE7FAA', sp: '#F7A8C4', rp: '#FF91BA', bl: '#FFE3EF',
    tx: '#31445D', yl: '#FFD23F', gr: '#22C55E', rd: '#EF4444',
  };

  // ---------- CPU chip character ----------
  function chipSVG(size = 200, { face = true, tie = false, label = 'CPU', kind = 'cpu' } = {}) {
    const id = 'tg' + (gid++), blue = kind === 'cpu';
    const c1 = blue ? C.eb : C.bp, c2 = blue ? C.cy : C.rp, body = blue ? C.nv : '#8E2F5A', pin = blue ? C.sb : C.sp;
    let pins = '';
    for (let i = 0; i < 6; i++) {
      const p = 44 + i * 22.4;
      pins += `<rect x="${p - 5}" y="2" width="10" height="22" rx="4" fill="${pin}"/><rect x="${p - 5}" y="176" width="10" height="22" rx="4" fill="${pin}"/><rect x="2" y="${p - 5}" width="22" height="10" rx="4" fill="${pin}"/><rect x="176" y="${p - 5}" width="22" height="10" rx="4" fill="${pin}"/>`;
    }
    const H = tie ? 250 : 200;
    return `<svg width="${size}" height="${size * H / 200}" viewBox="0 0 200 ${H}" overflow="visible">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${c1}"/><stop offset="1" stop-color="${c2}"/></linearGradient></defs>
      ${pins}
      <rect x="20" y="20" width="160" height="160" rx="26" fill="${body}"/>
      <rect x="34" y="34" width="132" height="132" rx="18" fill="url(#${id})"/>
      <path d="M46 52 Q46 46 52 46 H118" stroke="#fff" stroke-opacity=".55" stroke-width="6" fill="none" stroke-linecap="round"/>
      ${face ? `<g class="eyes"><ellipse cx="78" cy="90" rx="12" ry="15" fill="#fff"/><ellipse cx="122" cy="90" rx="12" ry="15" fill="#fff"/><circle class="pu" cx="80" cy="93" r="6.5" fill="${body}"/><circle class="pu" cx="124" cy="93" r="6.5" fill="${body}"/></g>
        <path class="mouth" d="M86 116 Q100 128 114 116" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round"/>
        <circle cx="60" cy="112" r="8" fill="#fff" fill-opacity=".3"/><circle cx="140" cy="112" r="8" fill="#fff" fill-opacity=".3"/>
        <path class="sweat" d="M156 52 q8 12 0 18 q-8 -6 0 -18z" fill="#BFEFFF" stroke="#fff" stroke-width="2" opacity="0"/>` : ''}
      <text x="100" y="${face ? 157 : 117}" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="${face ? 30 : 46}" fill="#fff" letter-spacing="1">${label}</text>
      ${tie ? `<path d="M88 184 h24 l-6 10 l10 44 l-16 12 l-16 -12 l10 -44z" fill="${C.yl}" stroke="#E0A800" stroke-width="3" stroke-linejoin="round"/>` : ''}
    </svg>`;
  }
  // expression: 0 = smile, 1 = stressed; blink 0..1 (1 = closed)
  function chipFace(root, { blink = 0, stress = 0, look = 0 } = {}) {
    const eyes = root.querySelector('.eyes'); if (!eyes) return;
    eyes.setAttribute('transform', `translate(0,90) scale(1,${Math.max(.08, 1 - blink)}) translate(0,-90)`);
    root.querySelectorAll('.pu').forEach((p, i) => p.setAttribute('cx', (i ? 124 : 80) + look * 4));
    const m = root.querySelector('.mouth');
    const k = stress;
    m.setAttribute('d', `M86 ${116 + 6 * k} Q100 ${128 - 22 * k} 114 ${116 + 6 * k}`);
    root.querySelector('.sweat').setAttribute('opacity', k > .5 ? 1 : 0);
  }
  const blinkAt = (t, ph = 0) => { const u = ((t + ph) % 3.7); return u < .14 ? Math.sin(u / .14 * Math.PI) : 0; };

  // ---------- GPU card ----------
  function gpuSVG(w = 300, { label = 'GPU' } = {}) {
    const id = 'tg' + (gid++);
    const fan = (cx, cy) => `<circle cx="${cx}" cy="${cy}" r="50" fill="#8E2F5A"/><circle cx="${cx}" cy="${cy}" r="44" fill="#B84A7A"/>
      <g class="fan" data-cx="${cx}" data-cy="${cy}">${[...Array(7)].map((_, i) => `<path d="M${cx} ${cy} q14 -18 4 -40 q-16 6 -20 22z" fill="${C.bl}" transform="rotate(${i * 360 / 7} ${cx} ${cy})"/>`).join('')}</g>
      <circle cx="${cx}" cy="${cy}" r="11" fill="#fff"/><circle cx="${cx}" cy="${cy}" r="5" fill="${C.bp}"/>`;
    return `<svg width="${w}" height="${w * 186 / 300}" viewBox="0 0 300 186">
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${C.rp}"/><stop offset="1" stop-color="${C.bp}"/></linearGradient></defs>
      <rect x="24" y="160" width="160" height="22" rx="4" fill="${C.yl}"/>${[...Array(12)].map((_, i) => `<rect x="${32 + i * 12.5}" y="166" width="6" height="14" fill="#E0A800"/>`).join('')}
      <rect x="0" y="0" width="300" height="166" rx="22" fill="url(#${id})"/>
      <rect x="9" y="9" width="282" height="148" rx="16" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3"/>
      ${fan(80, 72)}${fan(220, 72)}
      <rect x="108" y="128" width="84" height="30" rx="10" fill="#fff"/>
      <text x="150" y="151" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="25" fill="${C.bp}" letter-spacing="1">${label}</text>
    </svg>`;
  }
  function spinFans(root, t, speed = 1) {
    root.querySelectorAll('.fan').forEach((g, i) => g.setAttribute('transform', `rotate(${(t * 420 * speed + i * 40) % 360} ${g.dataset.cx} ${g.dataset.cy})`));
  }

  // ---------- GPU core grid (many small workers) ----------
  function coreGrid(container, cols, rows, cell = 40, gap = 8, { eyes = true, hat = false } = {}) {
    const cells = [];
    for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
      const el = document.createElement('div');
      el.className = 'core';
      el.style.cssText = `left:${c * (cell + gap)}px;top:${r * (cell + gap)}px;width:${cell}px;height:${cell}px;border-radius:${cell * .26}px`;
      if (eyes) el.innerHTML = `<i style="left:${cell * .28}px;top:${cell * .36}px;width:${cell * .14}px;height:${cell * .2}px"></i><i style="left:${cell * .58}px;top:${cell * .36}px;width:${cell * .14}px;height:${cell * .2}px"></i>${hat ? `<b style="left:${cell * .1}px;top:${-cell * .2}px;width:${cell * .8}px;height:${cell * .3}px"></b>` : ''}`;
      container.appendChild(el);
      cells.push({ el, r, c });
    }
    container.style.width = cols * (cell + gap) - gap + 'px';
    container.style.height = rows * (cell + gap) - gap + 'px';
    return cells;
  }
  function lightCore(cell, k) {   // k 0..1
    const a = Math.max(0, Math.min(1, k));
    cell.el.style.background = a > .02 ? `linear-gradient(160deg, rgba(255,145,186,${.55 + .45 * a}), rgba(238,127,170,${.6 + .4 * a}))` : '';
    cell.el.style.boxShadow = a > .02 ? `0 0 ${14 * a}px ${4 * a}px rgba(255,145,186,${.6 * a}), inset 0 -4px 0 rgba(142,47,90,.35)` : '';
  }

  // ---------- icons (24-unit viewBox) ----------
  const s = (sz, body) => `<svg width="${sz}" height="${sz}" viewBox="0 0 24 24" fill="none" stroke-linecap="round" stroke-linejoin="round">${body}</svg>`;
  const IC = {
    doc: (z = 48, c = C.eb) => s(z, `<path d="M6 2.8h8l4.2 4.2V20a1.2 1.2 0 0 1-1.2 1.2H6A1.2 1.2 0 0 1 4.8 20V4A1.2 1.2 0 0 1 6 2.8z" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M14 2.8V7h4.2M8 11.5h8M8 15h8M8 18.3h5" stroke="${c}" stroke-width="2"/>`),
    sheet: (z = 48, c = C.eb) => s(z, `<rect x="3" y="3.5" width="18" height="17" rx="2.4" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M3 9h18M3 14.5h18M9 3.5v17M15 3.5v17" stroke="${c}" stroke-width="1.8"/>`),
    globe: (z = 48, c = C.eb) => s(z, `<circle cx="12" cy="12" r="9" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M3 12h18M12 3c2.6 2.6 3.6 5.6 3.6 9s-1 6.4-3.6 9c-2.6-2.6-3.6-5.6-3.6-9s1-6.4 3.6-9z" stroke="${c}" stroke-width="1.8"/>`),
    calc: (z = 48, c = C.eb) => s(z, `<rect x="5" y="2.8" width="14" height="18.4" rx="2.6" fill="#fff" stroke="${c}" stroke-width="2"/><rect x="8" y="5.8" width="8" height="4" rx="1" fill="${c}"/><path d="M8.5 13.5h.01M12 13.5h.01M15.5 13.5h.01M8.5 17h.01M12 17h.01M15.5 17h.01" stroke="${c}" stroke-width="2.6"/>`),
    win: (z = 48, c = C.eb) => s(z, `<rect x="7" y="3.5" width="14" height="11" rx="2" fill="#fff" stroke="${c}" stroke-width="2"/><rect x="3" y="9.5" width="14" height="11" rx="2" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M3 13h14M7 7h14" stroke="${c}" stroke-width="1.8"/>`),
    gear: (z = 48, c = C.eb) => s(z, `<path d="M12 2.5l1.6 2.3 2.7-.7.6 2.7 2.6 1-.9 2.6 1.9 2-1.9 2 .9 2.6-2.6 1-.6 2.7-2.7-.7L12 21.5l-1.6-2.3-2.7.7-.6-2.7-2.6-1 .9-2.6-1.9-2 1.9-2-.9-2.6 2.6-1 .6-2.7 2.7.7z" fill="#fff" stroke="${c}" stroke-width="1.8"/><circle cx="12" cy="12" r="3.3" stroke="${c}" stroke-width="2"/>`),
    folder: (z = 48, c = C.eb) => s(z, `<path d="M3 6.5A1.5 1.5 0 0 1 4.5 5H9l2 2.2h8.5A1.5 1.5 0 0 1 21 8.7v9.8a1.5 1.5 0 0 1-1.5 1.5h-15A1.5 1.5 0 0 1 3 18.5z" fill="#fff" stroke="${c}" stroke-width="2"/>`),
    game: (z = 48, c = C.bp) => s(z, `<path d="M7 7.5h10a4.5 4.5 0 0 1 4.4 5.3l-.8 4.3a2.4 2.4 0 0 1-4.2 1L14.6 16H9.4l-1.8 2.1a2.4 2.4 0 0 1-4.2-1l-.8-4.3A4.5 4.5 0 0 1 7 7.5z" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M8 10.5v3M6.5 12h3" stroke="${c}" stroke-width="2"/><circle cx="16" cy="11" r="1.1" fill="${c}"/><circle cx="17.5" cy="13.3" r="1.1" fill="${c}"/>`),
    cube: (z = 48, c = C.bp) => s(z, `<path d="M12 2.8l8.2 4.6v9.2L12 21.2l-8.2-4.6V7.4z" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M3.8 7.4L12 12l8.2-4.6M12 12v9.2" stroke="${c}" stroke-width="2"/>`),
    pix: (z = 48, c = C.bp) => s(z, `${[0, 1, 2].map(r => [0, 1, 2].map(k => `<rect x="${3.5 + k * 6}" y="${3.5 + r * 6}" width="5" height="5" rx="1" fill="${(r + k) % 2 ? '#fff' : c}" stroke="${c}" stroke-width="1.2"/>`).join('')).join('')}`),
    chat: (z = 48, c = C.bp) => s(z, `<path d="M4 5.5A2.5 2.5 0 0 1 6.5 3h11A2.5 2.5 0 0 1 20 5.5v8a2.5 2.5 0 0 1-2.5 2.5H10l-4.5 4v-4A2.5 2.5 0 0 1 4 13.5z" fill="#fff" stroke="${c}" stroke-width="2"/><circle cx="8.5" cy="9.5" r="1.2" fill="${c}"/><circle cx="12" cy="9.5" r="1.2" fill="${c}"/><circle cx="15.5" cy="9.5" r="1.2" fill="${c}"/>`),
    thumb: (z = 48, c = '#fff') => s(z, `<path d="M7.5 10.5V20H4.5a1 1 0 0 1-1-1v-7.5a1 1 0 0 1 1-1zM7.5 10.5l3.6-6.6a1.9 1.9 0 0 1 3.5 1.3L13.8 9h5a2 2 0 0 1 2 2.3l-1.2 7A2 2 0 0 1 17.6 20H7.5" fill="${c}" stroke="${c}" stroke-width="1.6"/>`),
    share: (z = 48, c = '#fff') => s(z, `<circle cx="18" cy="5.5" r="2.8" fill="${c}"/><circle cx="6" cy="12" r="2.8" fill="${c}"/><circle cx="18" cy="18.5" r="2.8" fill="${c}"/><path d="M8.5 10.7l7-3.9M8.5 13.3l7 3.9" stroke="${c}" stroke-width="2.2"/>`),
    bell: (z = 48, c = '#fff') => s(z, `<path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 2H4.5z" fill="${c}" stroke="${c}" stroke-width="1.6"/><path d="M10 20.5a2 2 0 0 0 4 0" stroke="${c}" stroke-width="2"/>`),
    flow: (z = 48, c = C.eb) => s(z, `<rect x="8" y="2.5" width="8" height="4.5" rx="1.2" fill="#fff" stroke="${c}" stroke-width="1.8"/><path d="M12 7v2.3M12 9.3l4 3-4 3-4-3z" fill="#fff" stroke="${c}" stroke-width="1.8"/><path d="M8 12.3H4.5V17M16 12.3h3.5V17" stroke="${c}" stroke-width="1.8"/><rect x="2" y="17" width="5" height="4" rx="1" fill="${c}"/><rect x="17" y="17" width="5" height="4" rx="1" fill="${c}"/>`),
    warn: (z = 48, c = C.rd) => s(z, `<path d="M12 3l9.5 17h-19z" fill="${c}" stroke="${c}" stroke-width="2"/><path d="M12 9.5v5" stroke="#fff" stroke-width="2.6"/><circle cx="12" cy="17.4" r="1.4" fill="#fff"/>`),
    bolt: (z = 48, c = C.yl) => s(z, `<path d="M13.5 2L5 13.5h6L9.8 22 19 10h-6z" fill="${c}" stroke="#E0A800" stroke-width="1.4"/>`),
    cal: (z = 48, c = C.eb) => s(z, `<rect x="3" y="4.5" width="18" height="16.5" rx="3" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M3 9.5h18M8 2.5v4M16 2.5v4" stroke="${c}" stroke-width="2"/><path d="M8.5 15l2.3 2.3 4.7-4.7" stroke="${c}" stroke-width="2.2"/>`),
    stack: (z = 48, c = C.bp) => s(z, `<path d="M4 8l8-4 8 4-8 4z" fill="#fff" stroke="${c}" stroke-width="1.8"/><path d="M4 12l8 4 8-4M4 16l8 4 8-4" stroke="${c}" stroke-width="1.8"/>`),
    monitor: (z = 48, c = '#fff') => s(z, `<rect x="2.5" y="3.5" width="19" height="13" rx="2" fill="${c}"/><path d="M8 20.5h8M12 16.5v4" stroke="${c}" stroke-width="2.4"/>`),
  };

  // ---------- low-poly mesh (icosahedron) for the "3D" screen ----------
  const PHI = (1 + Math.sqrt(5)) / 2;
  const V = [[-1, PHI, 0], [1, PHI, 0], [-1, -PHI, 0], [1, -PHI, 0], [0, -1, PHI], [0, 1, PHI], [0, -1, -PHI], [0, 1, -PHI], [PHI, 0, -1], [PHI, 0, 1], [-PHI, 0, -1], [-PHI, 0, 1]];
  const F = [[0, 11, 5], [0, 5, 1], [0, 1, 7], [0, 7, 10], [0, 10, 11], [1, 5, 9], [5, 11, 4], [11, 10, 2], [10, 7, 6], [7, 1, 8], [3, 9, 4], [3, 4, 2], [3, 2, 6], [3, 6, 8], [3, 8, 9], [4, 9, 5], [2, 4, 11], [6, 2, 10], [8, 6, 7], [9, 8, 1]];
  function meshSVG(w, h) {
    return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" class="mesh">${F.map(() => '<polygon stroke="#fff" stroke-width="2" stroke-linejoin="round"/>').join('')}</svg>`;
  }
  function drawMesh(svg, t, R, cx, cy) {
    const ay = t * .9, ax = .5 + Math.sin(t * .6) * .25;
    const P = V.map(([x, y, z]) => {
      let X = x * Math.cos(ay) + z * Math.sin(ay), Z = -x * Math.sin(ay) + z * Math.cos(ay), Y = y;
      const Y2 = Y * Math.cos(ax) - Z * Math.sin(ax), Z2 = Y * Math.sin(ax) + Z * Math.cos(ax);
      return [X, Y2, Z2];
    });
    const polys = [...svg.querySelectorAll('polygon')];
    const faces = F.map(f => {
      const [a, b, c] = f.map(i => P[i]);
      const u = [b[0] - a[0], b[1] - a[1], b[2] - a[2]], v = [c[0] - a[0], c[1] - a[1], c[2] - a[2]];
      const n = [u[1] * v[2] - u[2] * v[1], u[2] * v[0] - u[0] * v[2], u[0] * v[1] - u[1] * v[0]];
      const ln = Math.hypot(...n); const nz = n[2] / ln, nx = n[0] / ln;
      return { f, z: (a[2] + b[2] + c[2]) / 3, nz, nx };
    }).sort((p, q) => p.z - q.z);
    faces.forEach((fc, i) => {
      const pg = polys[i];
      if (fc.nz <= 0) { pg.setAttribute('points', ''); return; }
      pg.setAttribute('points', fc.f.map(k => `${cx + P[k][0] * R / 1.9},${cy - P[k][1] * R / 1.9}`).join(' '));
      const k = (fc.nx + 1) / 2, l = .55 + .45 * fc.nz;
      const r = Math.round((47 * (1 - k) + 238 * k) * l + 255 * (1 - l) * .5), g = Math.round((107 * (1 - k) + 127 * k) * l + 255 * (1 - l) * .5), b = Math.round((255 * (1 - k) + 170 * k) * l + 255 * (1 - l) * .5);
      pg.setAttribute('fill', `rgb(${r},${g},${b})`);
    });
  }

  window.TECH = { C, chipSVG, chipFace, blinkAt, gpuSVG, spinFans, coreGrid, lightCore, IC, meshSVG, drawMesh };
})();
