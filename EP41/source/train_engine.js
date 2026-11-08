// EP.41 train demonstration system: side-view train, track, railway signal pole, arch bridge,
// dimension arrows, event markers and a stopwatch. Pure SVG, deterministic (positions set per frame).
// World units are canvas pixels; the episode uses SCALE px per metre so the train (160 m) and the
// bridge (200 m) keep their true proportions in every shot.
(function () {
  const C = { navy: '#142B53', blue: '#2F6BFF', cyan: '#22D3EE', light: '#95BFEF', ice: '#E6F4FF', pink: '#EE7FAA',
    yellow: '#FFD23F', green: '#22C55E', red: '#EF4444', text: '#31445D' };
  const SCALE = 1.15;                       // px per metre
  const PX_PER_S = 20 * SCALE;              // story-time: 20 m/s ⇒ 23 px per story second
  const ANIM_V = 80;                        // on-screen px per real second (same in every demo ⇒ constant speed)
  let uid = 0;

  // ---------- train markup (tail at x=0, front at x=L, rail top at y=0) ----------
  function trainMarkup(L, id, ghost = false) {
    const g = `tg${id}`;
    const carW = Math.round(L * .46), gap = 6, locoX = carW + gap, x1 = L;
    const wheels = (a, b) => [a + 15, a + 32, b - 32, b - 15].map(x => `<circle cx="${x}" cy="-8" r="8" fill="${C.navy}"/><circle cx="${x}" cy="-8" r="3" fill="${C.light}"/>`).join('');
    const wins = (a, b) => { let s = ''; for (let x = a + 12; x + 16 <= b - 10; x += 23) s += `<rect x="${x}" y="-63" width="16" height="15" rx="4" fill="${C.ice}" stroke="${C.navy}" stroke-width="2"/>`; return s; };
    const body = ghost
      ? `fill="none" stroke="${C.blue}" stroke-width="3" stroke-dasharray="8 6"`
      : `fill="url(#${g})"`;
    return `<defs><linearGradient id="${g}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#6E97FF"/><stop offset=".55" stop-color="${C.blue}"/><stop offset="1" stop-color="#1D4ACB"/></linearGradient></defs>
      <rect x="2" y="-80" width="${carW - 4}" height="10" rx="5" fill="${ghost ? 'none' : C.navy}"/>
      <rect x="0" y="-74" width="${carW}" height="58" rx="11" ${body}/>
      ${ghost ? '' : `${wins(0, carW)}<rect x="0" y="-40" width="${carW}" height="7" fill="${C.cyan}"/><rect x="0" y="-24" width="${carW}" height="8" rx="3" fill="${C.navy}"/>${wheels(0, carW)}
      <rect x="${carW - 2}" y="-34" width="${gap + 4}" height="8" rx="2" fill="${C.navy}"/>`}
      <path d="M${locoX + 10} -82 H${x1 - 46} Q${x1 - 22} -82 ${x1 - 14} -70 L${x1 - 14} -74 Z" fill="${ghost ? 'none' : C.navy}"/>
      <path d="M${locoX + 11} -74 H${x1 - 44} Q${x1 - 6} -72 ${x1} -28 V-16 H${locoX} V-63 Q${locoX} -74 ${locoX + 11} -74 Z" ${body}/>
      ${ghost ? '' : `<path d="M${x1 - 42} -68 Q${x1 - 16} -66 ${x1 - 8} -46 H${x1 - 42} Z" fill="${C.navy}"/><path d="M${x1 - 38} -64 Q${x1 - 24} -62 ${x1 - 17} -52" fill="none" stroke="${C.cyan}" stroke-width="3" stroke-linecap="round"/>
      ${wins(locoX, x1 - 44)}<path d="M${locoX} -40 H${x1 - 3} L${x1 - 1} -33 H${locoX} Z" fill="${C.cyan}"/><rect x="${locoX + 8}" y="-45" width="${Math.max(10, x1 - locoX - 70)}" height="3" rx="1.5" fill="${C.pink}"/>
      <rect x="${locoX}" y="-24" width="${x1 - locoX}" height="8" rx="3" fill="${C.navy}"/><circle cx="${x1 - 5}" cy="-24" r="4.5" fill="${C.yellow}"/>${wheels(locoX, x1)}`}`;
  }

  // ---------- diagram ----------
  // o: { top, h, railY, panel:[x,y,w,h], pole:x|null, bridge:{x0,len(m)}|null, trainLen(m), bridgeDim:true, dimY, chipsY }
  function diagram(parent, opts) {
    const id = ++uid;
    const o = Object.assign({ top: 0, h: 300, railY: 200, panel: [196, 0, 688, 300], pole: null, bridge: null, trainLen: 160, bridgeDim: true }, opts);
    const L = o.trainLen * SCALE, [px, py, pw, ph] = o.panel, R = o.railY;
    const br = o.bridge ? { x0: o.bridge.x0, x1: o.bridge.x0 + o.bridge.len * SCALE, len: o.bridge.len } : null;
    const el = document.createElement('div');
    el.className = 'diag abs c';
    el.style.cssText = `left:0;top:${o.top}px;width:1080px;height:${o.h}px;transform-origin:540px ${o.h / 2}px`;
    let sleepers = '';
    for (let x = px - 10; x < px + pw + 10; x += 21) if (!br || x + 12 < br.x0 || x > br.x1) sleepers += `<rect x="${x}" y="${R + 3}" width="12" height="7" rx="2" fill="#5B7BB0"/>`;
    let bridge = '', water = '';
    if (br) {
      const n = Math.max(2, Math.round((br.x1 - br.x0) / 115)), span = (br.x1 - br.x0) / n;
      water = `<path d="M${br.x0 - 26} ${R + 6} L${br.x0} ${R + 26} V${py + ph} H${br.x1} V${R + 26} L${br.x1 + 26} ${R + 6} Z" fill="url(#wt${id})"/>
        ${[0, 1, 2].map(k => `<path d="M${br.x0 + 14 + k * 30} ${R + 62 + k * 14} q14 -8 28 0 t28 0" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round" transform="translate(${k * 52} 0)"/>`).join('')}`;
      let arches = '', piers = '';
      for (let i = 0; i < n; i++) { const a = br.x0 + i * span; arches += `<path d="M${a + 4} ${R + 84} Q${a + span / 2} ${R + 4} ${a + span - 4} ${R + 84}" fill="none" stroke="#fff" stroke-width="8" stroke-linecap="round"/>`; }
      for (let i = 0; i <= n; i++) { const a = br.x0 + i * span; piers += `<rect x="${a - 7}" y="${R + 12}" width="14" height="${py + ph - R - 12}" rx="3" fill="${C.navy}"/>`; }
      let rail = ''; for (let x = br.x0 + 6; x < br.x1; x += 16) rail += `<rect x="${x}" y="${R - 26}" width="4" height="26" fill="${C.light}"/>`;
      bridge = `<g class="bridge">${piers}${arches}<rect x="${br.x0 - 4}" y="${R - 1}" width="${br.x1 - br.x0 + 8}" height="14" rx="4" fill="${C.navy}"/>
        <rect x="${br.x0}" y="${R - 28}" width="${br.x1 - br.x0}" height="4" rx="2" fill="${C.light}"/>${rail}
        <rect class="sweep" x="${br.x0}" y="${R - 30}" width="70" height="46" fill="url(#sw${id})" opacity="0"/></g>`;
    }
    const PH = o.poleH || 150;
    const pole = o.pole != null ? `<g class="pole"><rect x="${o.pole - 14}" y="${R - 6}" width="28" height="10" rx="3" fill="${C.navy}"/>
        <rect x="${o.pole - 4}" y="${R - PH}" width="8" height="${PH - 4}" rx="3" fill="${C.navy}"/>
        <rect x="${o.pole - 15}" y="${R - PH - 40}" width="30" height="50" rx="10" fill="${C.navy}"/>
        <circle class="lamp1" cx="${o.pole}" cy="${R - PH - 27}" r="8" fill="${C.cyan}"/><circle cx="${o.pole}" cy="${R - PH - 4}" r="8" fill="#33507F"/></g>` : '';
    const svg = `<svg width="1080" height="${o.h}" viewBox="0 0 1080 ${o.h}" style="position:absolute;left:0;top:0;overflow:visible">
      <defs>
        <linearGradient id="sky${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F4FAFF"/><stop offset="1" stop-color="#D5E9FF"/></linearGradient>
        <linearGradient id="wt${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CCBFA"/><stop offset="1" stop-color="#5E9BEA"/></linearGradient>
        <linearGradient id="sw${id}" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${C.cyan}" stop-opacity="0"/><stop offset=".5" stop-color="${C.cyan}" stop-opacity=".95"/><stop offset="1" stop-color="${C.cyan}" stop-opacity="0"/></linearGradient>
        <clipPath id="cp${id}"><rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="34"/></clipPath>
      </defs>
      <rect x="${px - 6}" y="${py - 6}" width="${pw + 12}" height="${ph + 12}" rx="40" fill="#fff" opacity=".9"/>
      <g clip-path="url(#cp${id})">
        <rect x="${px}" y="${py}" width="${pw}" height="${ph}" fill="url(#sky${id})"/>
        <path d="M${px} ${R - 40} Q${px + 120} ${R - 110} ${px + 250} ${R - 50} T${px + 520} ${R - 60} T${px + pw} ${R - 70} V${R} H${px} Z" fill="#C3DDFB" opacity=".75"/>
        <g class="clouds">${[[px + 90, py + 52, 1], [px + pw - 150, py + 70, .8]].map(([x, y, s]) => `<g transform="translate(${x} ${y}) scale(${s})"><ellipse cx="0" cy="0" rx="40" ry="16" fill="#fff"/><ellipse cx="26" cy="-9" rx="24" ry="17" fill="#fff"/><ellipse cx="-20" cy="-4" rx="18" ry="12" fill="#fff"/></g>`).join('')}</g>
        <rect x="${px}" y="${R + 6}" width="${pw}" height="${py + ph - R}" fill="#B9D6F7"/>
        <rect x="${px}" y="${R + 6}" width="${pw}" height="5" fill="#9DC3F0"/>
        ${water}${bridge}
        <rect x="${px}" y="${R - 2}" width="${pw}" height="6" fill="${C.navy}"/>${sleepers}
        ${pole}
        <g class="speed" opacity="0">${[0, 1, 2].map(k => `<rect x="${-60 - k * 26}" y="${-62 + k * 18}" width="${44 - k * 8}" height="5" rx="2.5" fill="${C.light}"/>`).join('')}</g>
        <g class="ghost" opacity="0">${trainMarkup(L, id + 'g', true)}</g>
        <g class="train">${trainMarkup(L, id)}</g>
      </g>
      <g class="ov"></g>
    </svg>`;
    el.innerHTML = svg;
    parent.appendChild(el);
    const q = s => el.querySelector(s), ov = q('.ov');
    const NS = 'http://www.w3.org/2000/svg';
    const mk = html => { const g = document.createElementNS(NS, 'g'); g.innerHTML = html; ov.appendChild(g); return g; };
    const D = { el, L, R, br, pole: o.pole, o };
    D.setTrain = (front, { vib = 0, speed = 0 } = {}) => {
      q('.train').setAttribute('transform', `translate(${front - L} ${R + vib})`);
      const sp = q('.speed'); sp.setAttribute('transform', `translate(${front - L} ${R})`); sp.setAttribute('opacity', speed);
    };
    D.setGhost = (front, op) => { const g = q('.ghost'); g.setAttribute('transform', `translate(${front - L} ${R})`); g.setAttribute('opacity', op); };
    D.sweep = p => { const s = q('.sweep'); if (!s || !br) return; s.setAttribute('x', br.x0 - 70 + (br.x1 - br.x0 + 70) * p); s.setAttribute('opacity', p > 0 && p < 1 ? 1 : 0); };
    D.lamp = on => { const l = q('.lamp1'); if (l) l.setAttribute('fill', on ? C.yellow : C.cyan); };
    // pill label in SVG
    const pill = (x, y, txt, { fill = '#fff', color = C.navy, size = 28, stroke = C.light, w } = {}) => {
      const tw = w || Math.max(60, measure(txt, size) + 36);
      return `<g transform="translate(${x} ${y})"><rect x="${-tw / 2}" y="${-size * .95}" width="${tw}" height="${size * 1.9}" rx="${size * .95}" fill="${fill}" stroke="${stroke}" stroke-width="3"/>
        <text x="0" y="${size * .36}" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="${size}" fill="${color}">${txt}</text></g>`;
    };
    D.pill = pill;
    // dimension arrow: set(x0, x1, p, opacity)
    D.arrow = ({ y, color = C.blue, label = '', labelY, size = 28, labelFill = '#fff', labelColor, dash = false, safe = true }) => {
      const g = mk(''); if (safe) g.setAttribute('data-safe', 'arrow');
      g.setAttribute('opacity', 0);
      return {
        g, set(x0, x1, p = 1, op = 1, txt = label) {
          const xe = x0 + (x1 - x0) * clamp01(p), dir = Math.sign(x1 - x0) || 1;
          const head = Math.abs(xe - x0) > 14 ? `<path d="M${xe} ${y} l${-16 * dir} -11 v22 Z" fill="${color}"/>` : '';
          g.innerHTML = `<line x1="${x0}" y1="${y - 16}" x2="${x0}" y2="${y + 16}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>
            <line x1="${x0}" y1="${y}" x2="${xe - 10 * dir}" y2="${y}" stroke="${color}" stroke-width="7" stroke-linecap="round" ${dash ? 'stroke-dasharray="14 10"' : ''}/>${head}
            ${p >= 1 ? `<line x1="${x1}" y1="${y - 16}" x2="${x1}" y2="${y + 16}" stroke="${color}" stroke-width="5" stroke-linecap="round"/>` : ''}
            ${txt && p > .55 ? `<g opacity="${clamp01((p - .55) / .3)}">${pill((x0 + x1) / 2, labelY ?? y - 34, txt, { size, fill: labelFill, color: labelColor || color, stroke: color })}</g>` : ''}`;
          g.setAttribute('opacity', op);
        },
      };
    };
    // event marker: vertical dashed line + chip
    D.marker = ({ color = C.cyan, text = '', top = R - 150, size = 24 }) => {
      const g = mk(''); g.setAttribute('data-safe', 'marker'); g.setAttribute('opacity', 0);
      return { g, set(x, op, txt = text) {
        g.innerHTML = `<line x1="${x}" y1="${top + 18}" x2="${x}" y2="${R + 14}" stroke="${color}" stroke-width="4" stroke-dasharray="8 7"/>${txt ? pill(x, top, txt, { size, fill: color, color: '#fff', stroke: '#fff' }) : ''}`;
        g.setAttribute('opacity', op);
      } };
    };
    // free label that can follow the train (front/tail chips)
    D.label = ({ size = 24, fill = '#fff', color = C.navy, stroke = C.light, safe = true }) => {
      const g = mk(''); if (safe) g.setAttribute('data-safe', 'label'); g.setAttribute('opacity', 0);
      return { g, set(x, y, txt, op = 1, sc = 1) { g.innerHTML = `<g transform="translate(${x} ${y}) scale(${sc})">${pill(0, 0, txt, { size, fill, color, stroke })}</g>`; g.setAttribute('opacity', op); } };
    };
    // bridge dimension (below deck)
    if (br && o.bridgeDim) {
      const dy = o.dimY ?? R + 62;
      D.dim = mk(`<g data-safe="bridge-dim"><line x1="${br.x0}" y1="${dy}" x2="${br.x1}" y2="${dy}" stroke="#fff" stroke-width="5"/>
        <path d="M${br.x0} ${dy} l14 -9 v18Z M${br.x1} ${dy} l-14 -9 v18Z" fill="#fff"/>
        ${pill((br.x0 + br.x1) / 2, dy, `สะพาน ${o.bridge.len} เมตร`, { size: 26, fill: C.yellow, color: C.navy, stroke: '#fff', w: 230 })}</g>`);
    }
    return D;
  }

  // text width estimate (Prompt) via canvas — fonts are loaded before the first render
  const cv = document.createElement('canvas').getContext('2d');
  function measure(txt, size, weight = 700) { cv.font = `${weight} ${size}px Prompt`; return cv.measureText(txt.replace(/<[^>]+>/g, '')).width; }
  const clamp01 = x => Math.max(0, Math.min(1, x));

  // ---------- stopwatch (HTML) ----------
  function stopwatch(parent, { x, y, size = 150 }) {
    const r = size * .36, Cc = 2 * Math.PI * r, c = size / 2;
    const el = document.createElement('div');
    el.className = 'abs c sw'; el.setAttribute('data-safe', 'stopwatch');
    el.style.cssText = `left:${x}px;top:${y}px;width:${size}px;height:${size + 6}px`;
    el.innerHTML = `<svg width="${size}" height="${size + 6}" viewBox="0 -6 ${size} ${size + 6}" style="position:absolute;inset:0;overflow:visible">
      <rect x="${c - 13}" y="-4" width="26" height="14" rx="5" fill="${C.navy}"/><rect x="${c + r * .78}" y="${c - r * 1.05}" width="16" height="10" rx="4" fill="${C.navy}" transform="rotate(40 ${c + r * .85} ${c - r})"/>
      <circle cx="${c}" cy="${c + 4}" r="${size * .47}" fill="#fff" stroke="${C.navy}" stroke-width="${size * .05}"/>
      <circle cx="${c}" cy="${c + 4}" r="${r}" fill="none" stroke="#DCEBFF" stroke-width="${size * .07}"/>
      <circle class="sw-ring" cx="${c}" cy="${c + 4}" r="${r}" fill="none" stroke="${C.cyan}" stroke-width="${size * .07}" stroke-linecap="round" stroke-dasharray="${Cc}" stroke-dashoffset="${Cc}" transform="rotate(-90 ${c} ${c + 4})"/>
    </svg>
    <div class="sw-num" style="position:absolute;left:0;right:0;top:${size * .27}px;text-align:center;font-weight:800;font-size:${size * .3}px;line-height:1;color:${C.navy}">0</div>
    <div style="position:absolute;left:0;right:0;top:${size * .6}px;text-align:center;font-weight:700;font-size:${size * .13}px;line-height:1.2;color:${C.text}">วินาที</div>`;
    parent.appendChild(el);
    const ring = el.querySelector('.sw-ring'), num = el.querySelector('.sw-num');
    return { el, set(v, max, done = false) {
      ring.setAttribute('stroke-dashoffset', Cc * (1 - clamp01(v / max)));
      ring.setAttribute('stroke', done ? C.green : C.cyan);
      num.textContent = done ? String(Math.round(v)) : v.toFixed(1);
      num.style.color = done ? '#15803D' : C.navy;
    } };
  }

  // ---------- demo motion ----------
  // An "event" starts when the front reaches xStart at local time tA and ends after `dist` px.
  // Returns front position, story-time on the stopwatch, and phase flags, for local time u.
  function event(u, { xStart, dist, tA, freeze = true, v = ANIM_V }) {
    const raw = xStart + v * (u - tA);
    const tB = tA + dist / v;
    const front = freeze ? Math.min(raw, xStart + dist) : raw;
    const run = Math.max(0, Math.min(dist, raw - xStart));
    return { front, tB, story: run / PX_PER_S, started: u >= tA, done: u >= tB, moving: !freeze || u < tB };
  }

  window.TRAIN = { C, SCALE, PX_PER_S, ANIM_V, diagram, stopwatch, event, measure };
})();
