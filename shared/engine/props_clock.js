// NaiSibPro analog clock (shared, EP31+). Hands are driven by a time value, never by free rotation.
// Time T is minutes since 00:00 (float). Angles are degrees clockwise from 12 o'clock:
//   minute = 6 * (T mod 60)      hour = 30 * (hours mod 12) + 0.5 * minutes = 0.5 * (T mod 720)
// The SVG viewBox is centred on the clock centre, so rotate(a) pivots every hand on the true centre.
// setAngles() exists only for illustrations of a WRONG mental model; such clocks are flagged
// data-model="incorrect" so QC can tell them apart from factual clocks.
(function () {
  const { h, clamp } = window.NSP;
  let uid = 0;
  const mod = (a, n) => ((a % n) + n) % n;
  const MATH = {
    minuteAngle: T => 6 * mod(T, 60),
    hourAngle: T => 0.5 * mod(T, 720),
    smaller: (a, b) => { const d = mod(Math.abs(a - b), 360); return Math.min(d, 360 - d); },
    T: (hh, mm) => hh * 60 + mm,
    label: T => { const m = Math.floor(mod(T, 1440) + 1e-6); return `${String(Math.floor(m / 60) % 12 || 12).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`; },
  };
  const pt = (a, r) => [r * Math.sin(a * Math.PI / 180), -r * Math.cos(a * Math.PI / 180)];
  // filled wedge (r0 = 0) or ring band from a1 clockwise to a2
  function wedge(a1, a2, r1, r0 = 0) {
    const sweep = mod(a2 - a1, 360), big = sweep > 180 ? 1 : 0;
    const [x1, y1] = pt(a1, r1), [x2, y2] = pt(a2, r1);
    if (!r0) return `M0 0L${x1} ${y1}A${r1} ${r1} 0 ${big} 1 ${x2} ${y2}Z`;
    const [x3, y3] = pt(a2, r0), [x4, y4] = pt(a1, r0);
    return `M${x1} ${y1}A${r1} ${r1} 0 ${big} 1 ${x2} ${y2}L${x3} ${y3}A${r0} ${r0} 0 ${big} 0 ${x4} ${y4}Z`;
  }
  function arcPath(a1, a2, r) {
    const sweep = mod(a2 - a1, 360), big = sweep > 180 ? 1 : 0, [x1, y1] = pt(a1, r), [x2, y2] = pt(a2, r);
    return sweep < .01 ? '' : `M${x1} ${y1}A${r} ${r} 0 ${big} 1 ${x2} ${y2}`;
  }

  // opts: size (px), dark (navy bezel glow), id
  function create({ size = 500, numerals = true, label = '' } = {}) {
    const id = 'ck' + (++uid);
    const ticks = [...Array(60)].map((_, i) => {
      const big = i % 5 === 0, [x1, y1] = pt(i * 6, big ? 79 : 83), [x2, y2] = pt(i * 6, 87);
      return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${big ? '#31445D' : '#AFC0D8'}" stroke-width="${big ? 2.4 : 1}" stroke-linecap="round"/>`;
    }).join('');
    const nums = numerals ? [...Array(12)].map((_, i) => {
      const n = i + 1, [x, y] = pt(n * 30, 69);
      return `<text class="n${n}" x="${x}" y="${y + 5.6}" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="16" fill="#31445D">${n}</text>`;
    }).join('') : '';
    const el = h(`<div class="nsp-clock" data-clock="${label || id}" style="position:absolute;width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="-100 -100 200 200" style="overflow:visible;display:block">
        <defs>
          <radialGradient id="${id}f" cx="40%" cy="35%" r="75%"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".7" stop-color="#F6F9FF"/><stop offset="1" stop-color="#E4EDFB"/></radialGradient>
          <linearGradient id="${id}b" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2F6BFF"/><stop offset=".45" stop-color="#142B53"/><stop offset="1" stop-color="#EE7FAA"/></linearGradient>
          <linearGradient id="${id}m" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#1E4FD6"/><stop offset="1" stop-color="#4C86FF"/></linearGradient>
          <linearGradient id="${id}h" x1="0" y1="1" x2="0" y2="0"><stop offset="0" stop-color="#D9568A"/><stop offset="1" stop-color="#F59BC0"/></linearGradient>
          <filter id="${id}s" x="-50%" y="-50%" width="200%" height="200%"><feDropShadow dx="0" dy="1.6" stdDeviation="1.4" flood-color="#142B53" flood-opacity=".35"/></filter>
          <filter id="${id}g" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="2.6"/></filter>
        </defs>
        <circle class="halo" r="104" fill="none" stroke="#22D3EE" stroke-width="5" opacity="0" filter="url(#${id}g)"/>
        <circle r="100" fill="url(#${id}b)"/>
        <circle r="95.5" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="1"/>
        <circle r="92" fill="url(#${id}f)"/>
        <circle r="92" fill="none" stroke="#95BFEF" stroke-width="1.2" opacity=".7"/>
        <g class="zones"></g>
        ${ticks}${nums}
        <line class="ref" x1="0" y1="0" x2="0" y2="-90" stroke="#22D3EE" stroke-width="1.6" stroke-dasharray="4 3" opacity="0"/>
        <g class="arcs"></g>
        <path class="sector" d="" fill="#FFD23F" fill-opacity=".72" stroke="#E0A800" stroke-width=".8" opacity="0"/>
        <g class="ghostH" opacity="0"><path d="M-2.4 8 L-1.4 -50 L0 -53 L1.4 -50 L2.4 8Z" fill="#EE7FAA" opacity=".35"/></g>
        <g class="ghostM" opacity="0"><path d="M-1.8 10 L-1 -77 L0 -80 L1 -77 L1.8 10Z" fill="#2F6BFF" opacity=".3"/></g>
        <g class="hgH" opacity="0"><path d="M-6 8 L-4 -52 L0 -57 L4 -52 L6 8Z" fill="#EE7FAA" filter="url(#${id}g)"/></g>
        <g class="hgM" opacity="0"><path d="M-5 10 L-3 -78 L0 -83 L3 -78 L5 10Z" fill="#2F6BFF" filter="url(#${id}g)"/></g>
        <g class="hour" filter="url(#${id}s)"><path d="M-3.6 10 L-1.9 -49 L0 -53 L1.9 -49 L3.6 10Z" fill="url(#${id}h)"/><circle class="tipH" cx="0" cy="-53" r=".3" fill="none"/></g>
        <g class="minute" filter="url(#${id}s)"><path d="M-2.6 12 L-1.3 -76 L0 -80 L1.3 -76 L2.6 12Z" fill="url(#${id}m)"/><circle class="tipM" cx="0" cy="-80" r=".3" fill="none"/></g>
        <circle r="6" fill="#142B53"/><circle r="3.2" fill="#FFD23F"/><circle class="ctr" r=".3" fill="none"/><circle class="top" cx="0" cy="-90" r=".3" fill="none"/>
      </svg></div>`);
    const q = s => el.querySelector(s);
    const H = q('.hour'), M = q('.minute'), HG = q('.hgH'), MG = q('.hgM');
    const ck = { el, T: 0, hA: 0, mA: 0, model: 'time', size };
    // factual state: both hands derived from the same time value
    ck.setTime = T => {
      ck.T = T; ck.model = 'time'; el.dataset.model = 'time'; el.dataset.t = T.toFixed(4);
      apply(MATH.hourAngle(T), MATH.minuteAngle(T));
    };
    // ONLY for clearly-labelled wrong-model illustrations
    ck.setAngles = (hA, mA) => { ck.model = 'incorrect'; el.dataset.model = 'incorrect'; apply(hA, mA); };
    function apply(hA, mA) {
      ck.hA = hA; ck.mA = mA;
      H.setAttribute('transform', `rotate(${hA})`); HG.setAttribute('transform', `rotate(${hA})`);
      M.setAttribute('transform', `rotate(${mA})`); MG.setAttribute('transform', `rotate(${mA})`);
    }
    // emphasis: hour / minute in 0..1 (1 = full), glow 0..1 per hand
    ck.emph = ({ hour = 1, minute = 1, hourGlow = 0, minuteGlow = 0, halo = 0 } = {}) => {
      H.style.opacity = .18 + .82 * hour; M.style.opacity = .18 + .82 * minute;
      HG.setAttribute('opacity', hourGlow * .9); MG.setAttribute('opacity', minuteGlow * .9);
      q('.halo').setAttribute('opacity', halo);
    };
    // yellow angle sector between two angles (clockwise a1 -> a2), radius r (0..92)
    ck.sector = (a1, a2, o = 1, r = 88) => { const s = q('.sector'); s.setAttribute('opacity', o); s.setAttribute('d', o > 0 ? wedge(a1, a2, r) : ''); };
    ck.ghost = (hA, mA, o = 1) => {
      const gh = q('.ghostH'), gm = q('.ghostM');
      gh.setAttribute('opacity', hA == null ? 0 : o); gm.setAttribute('opacity', mA == null ? 0 : o);
      if (hA != null) gh.setAttribute('transform', `rotate(${hA})`); if (mA != null) gm.setAttribute('transform', `rotate(${mA})`);
    };
    // named trace arcs: ck.arc('m', from, to, colour, radius, width, opacity)
    const arcs = {};
    ck.arc = (name, a1, a2, col, r, w = 4, o = 1) => {
      let p = arcs[name];
      if (!p) { p = arcs[name] = document.createElementNS('http://www.w3.org/2000/svg', 'path'); p.setAttribute('fill', 'none'); p.setAttribute('stroke-linecap', 'round'); q('.arcs').appendChild(p); }
      p.setAttribute('d', o > 0 ? arcPath(a1, a2, r) : ''); p.setAttribute('stroke', col); p.setAttribute('stroke-width', w); p.setAttribute('opacity', o);
    };
    // dashed reference ray from the centre (e.g. "exactly at 3" = 90 deg)
    ck.ref = (a, o = 1, col = '#22D3EE') => { const l = q('.ref'); l.setAttribute('transform', `rotate(${a})`); l.setAttribute('opacity', o); l.setAttribute('stroke', col); };
    ck.numeral = (n, col = '#31445D', scale = 1) => { const t = q('.n' + n); if (!t) return; t.setAttribute('fill', col); t.setAttribute('font-size', 16 * scale); };
    // screen-space geometry (for QC): centre, 12 o'clock mark and both hand tips from the rendered DOM.
    // hour/minute are relative to the dial's own 12 o'clock (so a tilted prop still reads true).
    ck.measure = () => {
      const c = q('.ctr').getBoundingClientRect(), th = q('.tipH').getBoundingClientRect(), tm = q('.tipM').getBoundingClientRect(), tp = q('.top').getBoundingClientRect();
      const cx = c.x + c.width / 2, cy = c.y + c.height / 2;
      const ang = r => mod(Math.atan2((r.x + r.width / 2) - cx, -((r.y + r.height / 2) - cy)) * 180 / Math.PI, 360);
      const dial = ang(tp);
      return { cx, cy, dial, hour: mod(ang(th) - dial, 360), minute: mod(ang(tm) - dial, 360) };
    };
    ck.setTime(0); ck.emph();
    return ck;
  }

  // magnifier: a second clock at `zoom` x size inside a round lens, showing the same time.
  // focus = [angle, radius 0..100] of the clock point kept in the lens centre.
  function lens({ size = 300, clockSize = 500, zoom = 3 } = {}) {
    const inner = create({ size: clockSize * zoom, label: 'lens' });
    const el = h(`<div class="nsp-lens" style="position:absolute;width:${size}px;height:${size}px;border-radius:50%;overflow:hidden;box-shadow:0 0 0 10px #fff,0 0 0 16px #142B53,0 18px 40px rgba(20,43,83,.45);background:#F6F9FF"></div>`);
    el.appendChild(inner.el);
    const handle = h(`<div style="position:absolute;width:${size * .2}px;height:${size * .62}px;border-radius:${size * .1}px;background:linear-gradient(90deg,#142B53,#2F6BFF);transform-origin:50% 0;box-shadow:0 10px 20px rgba(20,43,83,.35)"></div>`);
    const lz = { el, handle, clock: inner, size, zoom };
    lz.set = (T, focus) => {
      inner.setTime(T);
      const s = inner.size, [fx, fy] = pt(focus[0], focus[1] / 100 * s / 2);
      inner.el.style.transform = `translate(${size / 2 - s / 2 - fx}px,${size / 2 - s / 2 - fy}px)`;
    };
    return lz;
  }

  window.CLOCK = { MATH, create, lens, wedge, pt };
})();
