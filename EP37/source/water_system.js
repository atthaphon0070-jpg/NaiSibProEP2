// NaiSibPro EP.37 — reusable animated water-tank component (original artwork, deterministic).
// WATER.tank(container, opts) builds one transparent tank with up to two inlet taps (A: electric blue,
// upper-left; B: cyan, upper-right) and one bottom drain pipe (lower-right, flows OUTWARD only).
// draw(t, state) is a pure function of time + state: the water level is whatever the caller passes
// (computed from WR.level()), the surface wave is mean-preserving (whole wavelengths across the tank),
// and bubbles / splashes are decoration that never changes the mean level.
//
// Local design space: 640 × 800 (place the component at left:220 so it spans the safe zone X 220–860).
(function () {
  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  const C = { navy: '#142B53', deep: '#0B1B3A', blue: '#2F6BFF', cyan: '#22D3EE', light: '#95BFEF', ice: '#E6F4FF', yellow: '#FFD23F' };
  // interior of the tank
  const X0 = 150, X1 = 490, Y0 = 210, Y1 = 690, IW = X1 - X0, IH = Y1 - Y0;
  const SPOUT = { A: { x: 222, y: 166 }, B: { x: 418, y: 166 } };
  const DRAIN = { y: 674, x0: X1, x1: 600, out: 760 };
  const STREAM_W = { A: 36, B: 24 };                       // ∝ rate: 1/4 vs 1/6 (3 : 2)
  let uid = 0;
  let seed = 4242; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;

  function tap(id, k, col) {
    const sx = SPOUT[k].x, dir = k === 'A' ? -1 : 1, hx = sx + dir * 110;     // horizontal pipe comes in from the side
    const far = k === 'A' ? -40 : 680;
    const d = `M${far} 96 H${sx - dir * -0} `;
    const path = `M${far} 96 H${sx + dir * 26} Q${sx} 96 ${sx} 122 V152`;
    return `<g id="${id}-tap${k}">
      <circle id="${id}-hl${k}" cx="${sx}" cy="120" r="110" fill="url(#${id}-glow${k})" opacity="0"/>
      <path d="${path}" fill="none" stroke="${C.deep}" stroke-width="50" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="${path}" fill="none" stroke="${col}" stroke-width="36" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M${far} 88 H${sx + dir * 26}" fill="none" stroke="#fff" stroke-opacity=".45" stroke-width="6" stroke-linecap="round"/>
      <path id="${id}-chev${k}" d="${path}" fill="none" stroke="#fff" stroke-opacity=".9" stroke-width="8" stroke-dasharray="4 30" stroke-linecap="round"/>
      <rect x="${sx - 30}" y="146" width="60" height="22" rx="8" fill="${C.deep}"/>
      <rect x="${sx - 24}" y="150" width="48" height="14" rx="5" fill="${col}"/>
      <g id="${id}-valve${k}" transform="translate(${hx} 96)">
        <rect x="-9" y="-58" width="18" height="40" rx="6" fill="${C.deep}"/>
        <g class="wheel"><circle cx="0" cy="-62" r="30" fill="none" stroke="${C.deep}" stroke-width="16"/><circle cx="0" cy="-62" r="30" fill="none" stroke="${col}" stroke-width="9"/>
          <path d="M-30 -62H30M0 -92V-32" stroke="${col}" stroke-width="8" stroke-linecap="round"/><circle cx="0" cy="-62" r="9" fill="#fff"/></g>
      </g>
      <text x="${hx}" y="112" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="28" fill="#fff">${k}</text>
    </g>`;
  }

  function tank(container, opts = {}) {
    const o = Object.assign({ A: true, B: true, D: true, ticks: [], left: 0, top: 0, tickLabels: true }, opts);
    const id = 'wt' + (++uid);
    const el = document.createElement('div');
    el.className = 'wt abs';
    el.style.cssText = `left:${o.left}px;top:${o.top}px;width:640px;height:800px;transform-origin:320px 400px`;
    const bub = [...Array(16)].map(() => ({ x: X0 + 24 + rnd() * (IW - 48), sp: 40 + rnd() * 70, ph: rnd() * 1000, r: 4 + rnd() * 8, wob: rnd() * 6.28 }));
    const drops = [...Array(10)].map((_, i) => ({ k: i % 2 ? 'A' : 'B', ph: rnd(), vx: (rnd() - .5) * 160, vy: -120 - rnd() * 160, r: 4 + rnd() * 5 }));
    const swirl = [...Array(6)].map(() => ({ ph: rnd(), dy: (rnd() - .5) * 26 }));
    el.innerHTML = `<svg width="640" height="800" viewBox="0 0 640 800" style="overflow:visible;position:absolute;left:0;top:0">
      <defs>
        <clipPath id="${id}-clip"><rect x="${X0}" y="${Y0 - 60}" width="${IW}" height="${IH + 60}" rx="0"/><rect x="${X0}" y="${Y1 - 60}" width="${IW}" height="60" rx="30"/></clipPath>
        <clipPath id="${id}-clipIn"><path d="M${X0} ${Y0 - 80} H${X1} V${Y1 - 30} Q${X1} ${Y1} ${X1 - 30} ${Y1} H${X0 + 30} Q${X0} ${Y1} ${X0} ${Y1 - 30}Z"/></clipPath>
        <linearGradient id="${id}-water" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5EE6F7" stop-opacity=".92"/><stop offset=".35" stop-color="${C.cyan}" stop-opacity=".88"/><stop offset="1" stop-color="${C.blue}" stop-opacity=".95"/></linearGradient>
        <linearGradient id="${id}-back" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1FA7D8" stop-opacity=".8"/><stop offset="1" stop-color="#1B47C9" stop-opacity=".9"/></linearGradient>
        <linearGradient id="${id}-glass" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#BFE3FF" stop-opacity=".22"/><stop offset=".5" stop-color="#E6F4FF" stop-opacity=".06"/><stop offset="1" stop-color="#BFE3FF" stop-opacity=".18"/></linearGradient>
        <linearGradient id="${id}-refl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".55"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
        <linearGradient id="${id}-sA" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7FA6FF"/><stop offset=".45" stop-color="#C9DAFF"/><stop offset="1" stop-color="${C.blue}"/></linearGradient>
        <linearGradient id="${id}-sB" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#7DEBFA"/><stop offset=".45" stop-color="#E0FBFF"/><stop offset="1" stop-color="${C.cyan}"/></linearGradient>
        <linearGradient id="${id}-sD" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.light}"/><stop offset=".5" stop-color="#E6F4FF"/><stop offset="1" stop-color="#5E8FD6"/></linearGradient>
        <radialGradient id="${id}-glowA"><stop offset="0" stop-color="${C.blue}" stop-opacity=".75"/><stop offset="1" stop-color="${C.blue}" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-glowB"><stop offset="0" stop-color="${C.cyan}" stop-opacity=".7"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></radialGradient>
        <radialGradient id="${id}-glowD"><stop offset="0" stop-color="#FFD23F" stop-opacity=".55"/><stop offset="1" stop-color="#FFD23F" stop-opacity="0"/></radialGradient>
      </defs>
      <!-- shadow + back glass -->
      <ellipse cx="320" cy="${Y1 + 34}" rx="230" ry="26" fill="#000" opacity=".28"/>
      <path d="M${X0 - 14} ${Y0 - 14} V${Y1 - 30} Q${X0 - 14} ${Y1 + 14} ${X0 + 30} ${Y1 + 14} H${X1 - 30} Q${X1 + 14} ${Y1 + 14} ${X1 + 14} ${Y1 - 30} V${Y0 - 14}" fill="url(#${id}-glass)"/>
      <ellipse cx="320" cy="${Y0 - 14}" rx="${IW / 2 + 14}" ry="18" fill="#BFE3FF" fill-opacity=".10" stroke="${C.light}" stroke-opacity=".55" stroke-width="3"/>
      <!-- drain (behind the glass wall it passes through) -->
      ${o.D ? `<g id="${id}-drain">
        <circle id="${id}-hlD" cx="${DRAIN.x1 - 30}" cy="${DRAIN.y}" r="110" fill="url(#${id}-glowD)" opacity="0"/>
        <path id="${id}-out" d="" fill="url(#${id}-sD)" opacity="0"/>
        <path d="M${DRAIN.x0 - 6} ${DRAIN.y} H${DRAIN.x1 - 24} Q${DRAIN.x1} ${DRAIN.y} ${DRAIN.x1} ${DRAIN.y + 24} V${DRAIN.out - 26}" fill="none" stroke="${C.deep}" stroke-width="44" stroke-linecap="butt" stroke-linejoin="round"/>
        <path d="M${DRAIN.x0 - 6} ${DRAIN.y} H${DRAIN.x1 - 24} Q${DRAIN.x1} ${DRAIN.y} ${DRAIN.x1} ${DRAIN.y + 24} V${DRAIN.out - 26}" fill="none" stroke="#3A4F78" stroke-width="30" stroke-linejoin="round"/>
        <path id="${id}-chevD" d="M${DRAIN.x0 + 4} ${DRAIN.y} H${DRAIN.x1 - 24} Q${DRAIN.x1} ${DRAIN.y} ${DRAIN.x1} ${DRAIN.y + 24} V${DRAIN.out - 30}" fill="none" stroke="#9FD8FF" stroke-width="7" stroke-dasharray="4 26" stroke-linecap="round" opacity="0"/>
        <rect x="${DRAIN.x1 - 26}" y="${DRAIN.out - 32}" width="52" height="20" rx="6" fill="${C.deep}"/>
        <g id="${id}-valveD" transform="translate(${DRAIN.x0 + 50} ${DRAIN.y})"><circle r="24" fill="${C.deep}"/><g class="wheel"><circle r="18" fill="none" stroke="#FFD23F" stroke-width="6"/><path d="M-18 0H18M0 -18V18" stroke="#FFD23F" stroke-width="5"/></g></g>
      </g>` : ''}
      <!-- inlet streams (behind the water body so they plunge into it) -->
      ${['A', 'B'].filter(k => o[k]).map(k => `<g id="${id}-st${k}" opacity="0"><path class="body" d="" fill="url(#${id}-s${k})"/><path class="flow" d="" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="5" stroke-dasharray="26 34" stroke-linecap="round"/></g>`).join('')}
      <!-- water -->
      <g clip-path="url(#${id}-clipIn)">
        <path id="${id}-wBack" d="" fill="url(#${id}-back)"/>
        <path id="${id}-wFront" d="" fill="url(#${id}-water)"/>
        <g id="${id}-bub">${bub.map(() => `<circle r="6" fill="none" stroke="#fff" stroke-opacity=".8" stroke-width="2.5"/>`).join('')}</g>
        <g id="${id}-swirl">${swirl.map(() => `<path d="M0 0 l14 -7 v14z" fill="#fff" opacity="0"/>`).join('')}</g>
        <path id="${id}-surf" d="" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="5" stroke-linecap="round"/>
        <g id="${id}-rip">${['A', 'B'].map(() => `<ellipse rx="10" ry="4" fill="none" stroke="#fff" stroke-width="3" opacity="0"/><ellipse rx="10" ry="4" fill="none" stroke="#fff" stroke-width="3" opacity="0"/>`).join('')}</g>
      </g>
      <g id="${id}-drops">${drops.map(d => `<circle r="${d.r}" fill="#E0FBFF" opacity="0"/>`).join('')}</g>
      <!-- glass front -->
      <rect x="${X0 + 18}" y="${Y0 + 10}" width="34" height="${IH - 50}" rx="17" fill="url(#${id}-refl)" opacity=".55"/>
      <rect x="${X0 + 66}" y="${Y0 + 30}" width="12" height="${IH - 110}" rx="6" fill="url(#${id}-refl)" opacity=".4"/>
      <rect x="${X1 - 48}" y="${Y0 + 20}" width="16" height="${IH - 80}" rx="8" fill="url(#${id}-refl)" opacity=".3"/>
      <path d="M${X0 - 7} ${Y0 - 14} V${Y1 - 30} Q${X0 - 7} ${Y1 + 7} ${X0 + 30} ${Y1 + 7} H${X1 - 30} Q${X1 + 7} ${Y1 + 7} ${X1 + 7} ${Y1 - 30} V${Y0 - 14}" fill="none" stroke="${C.light}" stroke-width="14" stroke-opacity=".9" stroke-linejoin="round"/>
      <path d="M${X0 - 7} ${Y0 - 14} V${Y1 - 30} Q${X0 - 7} ${Y1 + 7} ${X0 + 30} ${Y1 + 7} H${X1 - 30} Q${X1 + 7} ${Y1 + 7} ${X1 + 7} ${Y1 - 30} V${Y0 - 14}" fill="none" stroke="#fff" stroke-width="3" stroke-opacity=".8" stroke-linejoin="round"/>
      <ellipse cx="320" cy="${Y0 - 14}" rx="${IW / 2 + 7}" ry="14" fill="none" stroke="#fff" stroke-opacity=".75" stroke-width="5"/>
      ${o.D ? `<rect x="${X1 - 4}" y="${DRAIN.y - 17}" width="16" height="34" rx="4" fill="${C.deep}"/>` : ''}
      <!-- scale -->
      <g id="${id}-ticks" font-family="Prompt" font-weight="700">${o.ticks.map(tk => {
        const y = Y1 - tk.f * IH;
        return `<g class="tk" data-f="${tk.f}"><line x1="${X0 - 40}" y1="${y}" x2="${X0 + 22}" y2="${y}" stroke="${tk.c || '#fff'}" stroke-width="${tk.major ? 6 : 4}" stroke-linecap="round" stroke-dasharray="${tk.major ? '' : '10 8'}"/>
          ${o.tickLabels && tk.label ? `<text x="${X0 - 50}" y="${y + 11}" text-anchor="end" font-size="${tk.fs || 32}" fill="${tk.c || '#fff'}">${tk.label}</text>` : ''}</g>`;
      }).join('')}</g>
      <!-- taps on top of everything -->
      ${o.A ? tap(id, 'A', C.blue) : ''}${o.B ? tap(id, 'B', C.cyan) : ''}
    </svg>`;
    container.appendChild(el);
    const q = s => el.querySelector('#' + id + '-' + s);
    const R = { wBack: q('wBack'), wFront: q('wFront'), surf: q('surf'), bub: [...q('bub').children], swirl: [...q('swirl').children], rip: [...q('rip').children], drops: [...q('drops').children], ticks: [...q('ticks').children] };
    ['A', 'B'].forEach(k => { if (o[k]) R['st' + k] = q('st' + k), R['chev' + k] = q('chev' + k), R['valve' + k] = q('valve' + k).querySelector('.wheel'), R['hl' + k] = q('hl' + k); });
    if (o.D) { R.out = q('out'); R.chevD = q('chevD'); R.valveD = q('valveD').querySelector('.wheel'); R.hlD = q('hlD'); }

    const surfY = (lv) => Y1 - clamp(lv) * IH;
    // mean-preserving surface: whole wavelengths across the interior width (IW/2 and IW/3)
    function waveY(x, t, amp, ph = 0) {
      const u = (x - X0) / IW * Math.PI * 2;
      return amp * (Math.sin(2 * u + t * 2.3 + ph) * .65 + Math.sin(3 * u - t * 1.7 + ph * 1.3) * .35);
    }
    function wavePath(ys, t, amp, ph) {
      let d = `M${X0 - 2} ${ys + waveY(X0, t, amp, ph)}`;
      for (let x = X0 + 10; x <= X1 + 2; x += 10) d += ` L${x} ${(ys + waveY(x, t, amp, ph)).toFixed(2)}`;
      return d;
    }

    // state: { level 0..1, A, B, D (flow 0..1), hlA, hlB, hlD (glow 0..1), wave (amp multiplier) }
    function draw(t, s = {}) {
      const lv = clamp(s.level ?? 0), ys = surfY(lv);
      const ampBase = (s.wave ?? 1) * 7 * clamp(lv * 12) * clamp((1 - lv) * 30 + .25);
      const agit = 1 + .8 * ((s.A || 0) + (s.B || 0)) / 2;
      const amp = ampBase * agit;
      const vis = lv > 0.0005;
      const sp = wavePath(ys, t, amp, 0);
      R.wFront.setAttribute('d', vis ? sp + ` L${X1 + 2} ${Y1 + 10} L${X0 - 2} ${Y1 + 10}Z` : '');
      R.wBack.setAttribute('d', vis ? wavePath(ys - 4, t * .8, amp * .8, 2.1) + ` L${X1 + 2} ${Y1 + 10} L${X0 - 2} ${Y1 + 10}Z` : '');
      R.surf.setAttribute('d', vis ? sp : '');
      // bubbles rise from the bottom; only shown under the surface
      R.bub.forEach((c, i) => {
        const b = bub[i], depth = Y1 - ys;
        if (depth < 30) { c.setAttribute('opacity', 0); return; }
        const y = Y1 - ((t * b.sp + b.ph) % depth);
        c.setAttribute('cx', (b.x + Math.sin(t * 2 + b.wob) * 6).toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', b.r);
        c.setAttribute('opacity', (.35 + .4 * clamp((Y1 - y) / 80)) * clamp((y - ys - 6) / 20) * (s.bubbles ?? 1));
      });
      // inlet streams
      ['A', 'B'].forEach((k, ki) => {
        if (!o[k]) return;
        const f = clamp(s[k] || 0), g = R['st' + k], sx = SPOUT[k].x, w = STREAM_W[k] * (.55 + .45 * f);
        const y0 = SPOUT[k].y, yEnd = ys + 8, len = (yEnd - y0) * clamp(f * 1.6);
        g.setAttribute('opacity', f > 0.01 ? clamp(f * 3) : 0);
        if (f > 0.01) {
          const yb = y0 + len, wob = Math.sin(t * 9 + ki) * 1.5;
          g.querySelector('.body').setAttribute('d', `M${sx - w / 2} ${y0} Q${sx - w / 2 + wob} ${(y0 + yb) / 2} ${sx - w / 2 + 2} ${yb} L${sx + w / 2 - 2} ${yb} Q${sx + w / 2 - wob} ${(y0 + yb) / 2} ${sx + w / 2} ${y0}Z`);
          const fl = g.querySelector('.flow'); fl.setAttribute('d', `M${sx - w * .12} ${y0 + 4} V${yb - 4}`); fl.setAttribute('stroke-dashoffset', (-t * 520).toFixed(1));
        }
        R['chev' + k].setAttribute('stroke-dashoffset', (-t * 140).toFixed(1));
        R['chev' + k].setAttribute('stroke-opacity', .9 * f);
        R['valve' + k].setAttribute('transform', `rotate(${(s['open' + k] ?? f) * 120 + f * t * 0})`);
        R['hl' + k].setAttribute('opacity', clamp(s['hl' + k] || 0) * (.75 + .25 * Math.sin(t * 6)));
        // ripples + splash where the stream meets the surface
        const on = f > .6 && vis;
        for (let j = 0; j < 2; j++) {
          const r = R.rip[ki * 2 + j], ph = (t * 1.4 + j * .5) % 1;
          r.setAttribute('cx', sx); r.setAttribute('cy', ys + 4); r.setAttribute('rx', 14 + ph * 70); r.setAttribute('ry', 4 + ph * 12);
          r.setAttribute('opacity', on ? (1 - ph) * .7 : 0);
        }
      });
      R.drops.forEach((c, i) => {
        const d = drops[i], f = clamp(s[d.k] || 0);
        if (!o[d.k] || f < .6 || !vis) { c.setAttribute('opacity', 0); return; }
        const u = ((t * 1.6 + d.ph) % 1) * .6;
        c.setAttribute('cx', SPOUT[d.k].x + d.vx * u); c.setAttribute('cy', ys + d.vy * u + 520 * u * u);
        c.setAttribute('opacity', (1 - u / .6) * .9);
      });
      // drain: outward flow only, and only while there is water to remove
      if (o.D) {
        const f = clamp(s.D || 0) * (lv > 0.0005 || (s.D && s.forceDrain) ? 1 : 0);
        const x = DRAIN.x1, y0 = DRAIN.out - 14, len = 92 * clamp(f * 1.5), w = 22 * (.6 + .4 * f);
        R.out.setAttribute('opacity', f > .01 ? clamp(f * 3) : 0);
        R.out.setAttribute('d', `M${x - w / 2} ${y0} Q${x - w / 2 - 4} ${y0 + len / 2} ${x - w / 2 - 8} ${y0 + len} L${x + w / 2 + 8} ${y0 + len} Q${x + w / 2 + 4} ${y0 + len / 2} ${x + w / 2} ${y0}Z`);
        R.chevD.setAttribute('opacity', f); R.chevD.setAttribute('stroke-dashoffset', (-t * 140).toFixed(1));
        R.valveD.setAttribute('transform', `rotate(${(s.openD ?? f) * 120})`);
        R.hlD.setAttribute('opacity', clamp(s.hlD || 0) * (.75 + .25 * Math.sin(t * 6)));
        R.swirl.forEach((p, i) => {
          const sw = swirl[i], u = (t * .9 + sw.ph) % 1, px = X1 - 120 + u * 116, py = DRAIN.y + sw.dy * (1 - u);
          p.setAttribute('transform', `translate(${px.toFixed(1)} ${py.toFixed(1)})`);
          p.setAttribute('opacity', f > .3 && ys < DRAIN.y - 10 ? Math.sin(u * Math.PI) * .85 * f : 0);
        });
      }
      R.ticks.forEach(g => { const fv = +g.dataset.f, k = s.tickOn ? s.tickOn(fv) : 1; g.setAttribute('opacity', k); });
    }
    // anchors in page coordinates (component is unscaled unless the caller scales el)
    const anchor = name => ({ A: [SPOUT.A.x + 110, 96], B: [SPOUT.B.x - 110, 96], D: [DRAIN.x1, DRAIN.y], surface: [320, 0] }[name]);
    return { el, draw, anchor, surfY, X0, X1, Y0, Y1, IH, IW, DRAIN, SPOUT };
  }
  window.WATER = { tank, C };
})();
