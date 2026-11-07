// EP.39 number-sequence component: persistent number cards (object identity per sequence position),
// index badges, state layers (base / odd-blue / even-cyan / answer-green), motion trails, difference arcs.
// Everything is a pure function of t: callers compute positions, the engine only draws.
(function () {
  const { h, tf, clamp, lerp, E, P } = window.NSP;
  const NS = 'http://www.w3.org/2000/svg';
  const GAP = 126;                                  // column pitch of the 5-wide rows
  const slotX = k => 540 + (k - 2) * GAP;           // 288 … 792 (cards 233 … 847)
  const ease = E.inOut;

  // pm(): text with readable plus/minus glyphs (Prompt's '+' is tiny; engine.css .pl draws a proper one)
  const pm = s => String(s).replace(/\+/g, '<i class="pl"></i>').replace(/-(?=\d)/g, '−');

  function card(parent, label, idx, { w = 110, hh = 132, fs = 64, kind = 'num' } = {}) {
    const ghosts = [0, 1, 2].map(() => { const g = h(`<div class="nc-ghost" style="width:${w}px;height:${hh}px;margin:${-hh / 2}px 0 0 ${-w / 2}px"></div>`); parent.appendChild(g); return g; });
    const el = h(`<div class="nc ess ${kind === 'q' ? 'is-q' : ''}" style="width:${w}px;height:${hh}px;margin:${-hh / 2}px 0 0 ${-w / 2}px">
      <div class="ly lb"></div><div class="ly lo"></div><div class="ly le"></div><div class="ly lk"></div><div class="ly lq"></div>
      <div class="num" style="font-size:${fs}px">${label}</div>
      <div class="bdg">${idx ?? ''}</div></div>`);
    parent.appendChild(el);
    return { el, ghosts, w, hh, num: el.querySelector('.num'), lo: el.querySelector('.lo'), le: el.querySelector('.le'), lk: el.querySelector('.lk'), lq: el.querySelector('.lq'), bdg: el.querySelector('.bdg'), label: String(label), idx };
  }
  // st: {x,y,s,r,o,ry, odd,even,ok,q (layer weights 0..1), dim 0..1, glow 0..1, glowCol, badge 0..1, badgeKind, label}
  function setCard(c, st) {
    const { x = 540, y = 960, s = 1, r = 0, o = 1, ry = 0, odd = 0, even = 0, ok = 0, q = 0, dim = 0, glow = 0, badge = 0, badgeKind = '' } = st;
    tf(c.el, { x, y, s, r, o: o * (1 - .65 * dim), ry });
    c.lo.style.opacity = odd; c.le.style.opacity = even; c.lk.style.opacity = ok; c.lq.style.opacity = q;
    const col = st.glowCol || (ok > .5 ? '34,197,94' : even > .5 ? '34,211,238' : odd > .5 ? '47,107,255' : '149,191,239');
    c.el.style.boxShadow = `0 14px 26px rgba(3,10,30,.45), 0 0 0 3px rgba(149,191,239,${.25 + .5 * glow}), 0 0 ${18 + 46 * glow}px ${2 + 10 * glow}px rgba(${col},${.25 + .55 * glow})`;
    c.num.style.color = even > .5 && ok < .5 ? '#08243F' : q > .5 && ok < .5 ? '#FFD23F' : '#FFFFFF';
    c.bdg.style.opacity = badge;
    c.bdg.className = 'bdg ' + badgeKind;
    if (st.label !== undefined && String(st.label) !== c.label) { c.label = String(st.label); c.num.textContent = c.label; }
  }
  // motion trail: pts = earlier positions [{x,y,s}], speed-weighted opacity
  function setTrail(c, now, pts, col = '149,191,239') {
    c.ghosts.forEach((g, i) => {
      const p = pts[i];
      if (!p) { g.style.visibility = 'hidden'; return; }
      const d = Math.hypot(p.x - now.x, p.y - now.y);
      const o = clamp((d - 6) / 60) * (.34 - i * .09) * (now.o ?? 1);
      tf(g, { x: p.x, y: p.y, s: p.s ?? 1, o });
      g.style.background = `rgba(${col},.55)`;
    });
  }
  // eased move with an optional arc lift; returns {x,y,p}
  function move(t, t0, d, a, b, lift = 0) {
    const p = ease(P(t, t0, d));
    return { x: lerp(a.x, b.x, p), y: lerp(a.y, b.y, p) - Math.sin(Math.PI * p) * lift, p, s: lerp(a.s ?? 1, b.s ?? 1, p) };
  }
  // piecewise path through keyframes [[t, {x,y,s}, lift?], ...]
  function path(t, keys) {
    if (t <= keys[0][0]) return { ...keys[0][1] };
    for (let i = 0; i < keys.length - 1; i++) {
      const [ta, a] = keys[i], [tb, b, lift = 0, dur] = keys[i + 1];
      const start = dur ? tb - dur : ta;
      if (t < tb) return t < start ? { ...a } : move(t, start, tb - start, a, b, lift);
    }
    return { ...keys[keys.length - 1][1] };
  }

  // ---------- difference arcs (SVG layer + HTML label) ----------
  function arcLayer(parent) {
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', 1080); svg.setAttribute('height', 1920); svg.setAttribute('viewBox', '0 0 1080 1920');
    svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible';
    svg.innerHTML = `<defs><filter id="glw${Math.random().toString(36).slice(2, 6)}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="3"/></filter></defs>`;
    parent.appendChild(svg); return svg;
  }
  function arc(svg, parent, text, { col = '#FFD23F', lcls = '' } = {}) {
    const g = document.createElementNS(NS, 'g');
    g.innerHTML = `<path class="a-glow" fill="none" stroke="${col}" stroke-opacity=".35" stroke-width="12" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
      <path class="a-line" fill="none" stroke="${col}" stroke-width="5" stroke-linecap="round" pathLength="1" stroke-dasharray="1 1"/>
      <path class="a-head" fill="${col}" d="M0 0 L-16 -9 L-16 9Z"/>`;
    svg.appendChild(g);
    const lab = text == null ? null : h(`<div class="dlab"><div class="in ess ${lcls}">${pm(text)}</div></div>`);
    if (lab) parent.appendChild(lab);
    return { g, glow: g.querySelector('.a-glow'), line: g.querySelector('.a-line'), head: g.querySelector('.a-head'), lab };
  }
  // draw from (x1,y) to (x2,y), bulging by dep (positive = downward). p: draw progress, lo: label opacity
  function setArc(a, x1, x2, y, dep, p, lo = 0, o = 1, ls = 1) {
    const mx = (x1 + x2) / 2, cy = y + dep * 2;
    const d = `M${x1} ${y} Q${mx} ${cy} ${x2} ${y}`;
    a.glow.setAttribute('d', d); a.line.setAttribute('d', d);
    const off = 1 - clamp(p);
    a.glow.setAttribute('stroke-dashoffset', off); a.line.setAttribute('stroke-dashoffset', off);
    // head at the end, tangent of the quadratic at t=1: (x2-mx, y-cy)
    const ang = Math.atan2(y - cy, x2 - mx) * 180 / Math.PI;
    a.head.setAttribute('transform', `translate(${x2},${y}) rotate(${ang})`);
    a.head.style.opacity = clamp((p - .85) / .15);
    a.g.style.opacity = o * (p > 0 ? 1 : 0);
    if (a.lab) tf(a.lab, { x: mx, y: y + dep + Math.sign(dep || 1) * 34, s: lerp(.4, 1, E.back(clamp(lo))) * ls, o: clamp(lo * 2) * o });
  }
  // arc between two card centres sitting on a row at cy (cards hh tall)
  function setPairArc(a, xa, xb, cy, p, lo, o = 1, { below = true, hh = 132, dep = 34 } = {}) {
    const y = below ? cy + hh / 2 + 8 : cy - hh / 2 - 8;
    setArc(a, xa + 12, xb - 12, y, below ? dep : -dep, p, lo, o);
  }

  window.SeqEngine = { GAP, slotX, pm, card, setCard, setTrail, move, path, arcLayer, arc, setArc, setPairArc };
})();
