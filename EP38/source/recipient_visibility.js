// EP38 — 50-recipient visuals: applicant grid, delivery paths (visual metaphor only),
// and the background layer (digital grid + cyan particles) for the blue-dominant look.
(function () {
  const { h, tf, life, clamp, lerp, E, P, rnd } = window.NSP;
  const { IC } = window.EMAIL;

  // 50 recipient icons, 10 x 5. Returns {el, items:[{el,cx,cy}], set(u, opts)}
  function AppGrid(parent, { x = 236, y = 1060, cols = 10, size = 52, gap = 12, n = 50 } = {}) {
    const el = h(`<div class="abs" style="left:0;top:0;width:1080px;height:1920px;pointer-events:none"></div>`);
    parent.appendChild(el);
    const items = [];
    for (let i = 0; i < n; i++) {
      const cx = x + (i % cols) * (size + gap) + size / 2, cy = y + Math.floor(i / cols) * (size + gap) + size / 2;
      const it = h(`<div class="abs" style="left:${cx - size / 2}px;top:${cy - size / 2}px;width:${size}px;height:${size}px">
        <div class="pp" style="position:absolute;inset:0;border-radius:50%;display:grid;place-items:center;background:linear-gradient(160deg,#22D3EE,#2F6BFF);box-shadow:0 0 0 3px rgba(230,244,255,.85),0 6px 12px rgba(0,0,0,.3)">${IC.person(size * .62)}</div>
        <div class="sh" style="position:absolute;right:-12px;bottom:-12px;opacity:0">${IC.shield(size * .56, '#1E50D8', '#fff')}</div>
        <div class="ml" style="position:absolute;left:-10px;top:-14px;opacity:0;width:32px;height:24px;border-radius:5px;background:#fff;display:grid;place-items:center">${IC.mail(26, '#2F6BFF')}</div></div>`);
      el.appendChild(it);
      items.push({ el: it, pp: it.querySelector('.pp'), sh: it.querySelector('.sh'), ml: it.querySelector('.ml'), cx, cy, i, ph: rnd() * 6.28 });
    }
    // u: local time; a: appear time; opts: spread (0..1), shield (time), mail (time), wave (time), out (time)
    function set(u, { a = 0, stag = .018, spread = 0, shield = 1e9, mail = 1e9, mailStag = .02, wave = -1, out = 1e9, o = 1, noPop = false } = {}) {
      items.forEach(it => {
        const l = noPop ? { s: 1, o: 1, y: 0 } : life(u, a + it.i * stag, out, { from: .2, dy: 0, d: .45 });
        const col = it.i % 10, row = Math.floor(it.i / 10);
        const dx = (col - 4.5) * 7 * spread, dy = (row - 2) * 7 * spread;
        const wv = wave >= 0 ? Math.max(0, Math.sin(clamp((u - wave - col * .06 - row * .03) / .5) * Math.PI)) : 0;
        tf(it.el, { x: dx, y: dy - 10 * wv, s: l.s * (1 + .15 * wv), o: l.o * o });
        const sl = life(u, shield + it.i * .012, 1e9, { from: .2, dy: 0, d: .35 });
        tf(it.sh, { s: sl.s, o: sl.o });
        const ml = life(u, mail + it.i * mailStag, 1e9, { from: .2, dy: 0, d: .35 });
        tf(it.ml, { s: ml.s, o: ml.o });
      });
    }
    return { el, items, set };
  }

  // delivery paths from (sx,sy) to every grid item; draw(u, t0, dur)
  function Paths(parent, grid, sx, sy, { col = '#22D3EE' } = {}) {
    const svg = h(`<svg class="abs" width="1080" height="1920" viewBox="0 0 1080 1920" style="left:0;top:0;overflow:visible;pointer-events:none"></svg>`);
    parent.appendChild(svg);
    const ps = grid.items.map(it => {
      const mx = (sx + it.cx) / 2 + (it.cx - sx) * .1, my = Math.min(sy, it.cy) - 60;
      const d = `M${sx} ${sy} Q${mx} ${my} ${it.cx} ${it.cy}`;
      const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      p.setAttribute('d', d); p.setAttribute('fill', 'none'); p.setAttribute('stroke', col); p.setAttribute('stroke-width', '3'); p.setAttribute('stroke-linecap', 'round'); p.setAttribute('opacity', '.75');
      svg.appendChild(p);
      const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      dot.setAttribute('r', '7'); dot.setAttribute('fill', '#fff'); dot.setAttribute('stroke', col); dot.setAttribute('stroke-width', '3');
      svg.appendChild(dot);
      const L = p.getTotalLength();
      p.setAttribute('stroke-dasharray', L);
      return { p, dot, L, i: it.i };
    });
    function draw(u, t0, dur = 1.1, fadeAt = 1e9) {
      const fo = 1 - P(u, fadeAt, .4);
      ps.forEach(q => {
        const k = E.inOut(P(u, t0 + q.i * .012, dur));
        q.p.setAttribute('stroke-dashoffset', q.L * (1 - k));
        q.p.style.opacity = (k > 0 ? .75 : 0) * fo;
        const pt = q.p.getPointAtLength(q.L * k);
        q.dot.setAttribute('cx', pt.x); q.dot.setAttribute('cy', pt.y);
        q.dot.style.opacity = (k > 0 && k < 1 ? 1 : 0) * fo;
      });
    }
    return { svg, draw };
  }

  // background: digital grid drifting + cyan particles (+ a few tiny pink accents)
  function Background() {
    const bg = document.getElementById('bg');
    const grid = h('<div id="dgrid"></div>'); bg.appendChild(grid);
    const dots = [];
    for (let i = 0; i < 40; i++) {
      const pink = i % 13 === 0, s = 4 + rnd() * 9, c = pink ? '#F8CFE2' : (i % 3 ? '#22D3EE' : '#95BFEF');
      const el = h(`<div class="dp" style="width:${s}px;height:${s}px;background:${c};box-shadow:0 0 ${s * 2}px ${c}"></div>`); bg.appendChild(el);
      dots.push({ el, x: rnd() * 1080, y: rnd() * 1920, sp: 14 + rnd() * 30, ph: rnd() * 6.28 });
    }
    // recolour the engine's soft blobs to blues
    const cols = ['rgba(47,107,255,.35)', 'rgba(34,211,238,.18)', 'rgba(47,107,255,.28)', 'rgba(149,191,239,.16)'];
    [...bg.querySelectorAll('.blob')].forEach((b, i) => { b.style.background = `radial-gradient(circle, ${cols[i]} 0%, rgba(0,0,0,0) 68%)`; });
    // engine wipe recoloured to the blue identity (logo kept as-is)
    const bands = [...document.querySelectorAll('#wipe .band')];
    const bc = ['#22D3EE', '#2F6BFF', 'linear-gradient(180deg,#1C3A6E,#142B53)', '#2F6BFF', '#22D3EE'];
    bands.forEach((b, i) => b.style.background = bc[i]);
    return function draw(t) {
      grid.style.transform = `translate(${(t * 12) % 90}px,${(t * 20) % 90}px)`;
      dots.forEach(d => { let y = (d.y - t * d.sp) % 1980; if (y < -40) y += 1980; tf(d.el, { x: d.x + Math.sin(t * .7 + d.ph) * 20, y, o: .35 + .35 * Math.sin(t * 1.4 + d.ph) }); });
    };
  }

  window.VIS = { AppGrid, Paths, Background };
})();
