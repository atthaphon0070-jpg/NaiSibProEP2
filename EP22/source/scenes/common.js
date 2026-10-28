// EP22 shared scene helpers: absolute timeline, beat lookup, anchors, and the WORK SET layout
// (wall + grid + two officers + day/rate labels + calendar) used identically by scenes 1, 4 and 6.
(function () {
  const { h, tf, life, clamp, lerp, E, P } = NSP;
  const TL = window.TL;
  const T = {
    hook0: TL.hook[0], story0: TL.story[0], know0: TL.know[0], expl0: TL.expl[0], quiz0: TL.quiz[0],
    cd0: TL.cd[0], cdLen: TL.cd[1], ans0: TL.ans[0], promo0: TL.promo[0], end: TL.end,
  };
  // absolute time of a beat: at('expl', 'r3')
  const at = (seg, k) => TL[seg][0] + BEATS[seg][k];
  const C = { blue: '#2F6BFF', cyan: '#22D3EE', yel: '#FFD23F', pink: '#FF3D7F', green: '#22C55E', red: '#EF4444', ink: '#0B1A3A' };
  // centred anchor: a zero-size box at (x, y); tf() on it scales around that point
  function A(root, x, y, html, cls = '', z = 0) {
    const a = h(`<div class="anc" style="left:${x}px;top:${y}px;${z ? 'z-index:' + z : ''}"><div class="ac ${cls}">${html}</div></div>`);
    root.appendChild(a); return a;
  }
  const hide = el => tf(el, { o: 0 });
  // pop for labels: elastic-ish entrance, optional exit
  const pop = (t, a, b = 1e9, o = {}) => life(t, a, b, { from: .3, dy: 30, d: .5, out: .3, ...o });

  // ---------- WORK SET ----------
  const LAY = {
    wall: { x: 190, y: 612, w: 700, hgt: 420 },
    gridPad: 12,
    offL: 230, offR: 850, feet: 1736, offScale: .88,
    lblL: 345, lblR: 735, dayY: 1104, rateY: 1186,
    cal: { x: 450, y: 1262, w: 180, hgt: 166 },
  };
  // opts: { rows, cols, rates:[a,b] } or no grid (plain wall). Returns handles; scenes drive them.
  function workSet(root, { rows, cols, rates, ground = true, beacon = false } = {}) {
    const set = h(`<div class="abs" style="inset:0"></div>`); root.appendChild(set);
    if (ground) set.appendChild(h(`<div class="abs" style="left:-40px;right:-40px;top:${LAY.feet - 30}px;height:${1920 - LAY.feet + 40}px;background:linear-gradient(180deg,#1C3566,#10224A);box-shadow:0 -6px 0 #2A4A86"></div>`));
    const wl = WORK.wall(set, { ...LAY.wall, beacon });
    let grid = null;
    if (rows) {
      const p = LAY.gridPad;
      grid = WORK.grid(wl.inner, { x: p, y: p, w: LAY.wall.w - 2 * p, hgt: LAY.wall.hgt - 2 * p, rows, cols, workers: [{ rate: rates[0], color: C.blue }, { rate: rates[1], color: C.cyan }] });
    }
    const offA = WORK.officer({ paint: C.blue, scale: LAY.offScale }), offB = WORK.officer({ paint: C.cyan, flip: true, scale: LAY.offScale });
    [offA, offB].forEach((o, i) => { o.el.style.left = ((i ? LAY.offR : LAY.offL) - 120) + 'px'; o.el.style.top = (LAY.feet - 600) + 'px'; set.appendChild(o.el); });
    const cal = WORK.calendar(set, LAY.cal);
    const ov = h(`<div class="abs" style="inset:0"></div>`); root.appendChild(ov);   // foreground layer for labels
    return { set, wall: wl, grid, offA, offB, cal, ov };
  }
  // standard officer animation: rolling, blinking, idle bob; `look` turns heads toward the wall/centre
  function drawOfficers(ws, t, { roll = 1, tap = 0, look = 0, o = 1, dx = 0, dy = 0 } = {}) {
    ws.offA.pose({ t, roll, ph: 0, tap, look, blink: WORK.blinkAt(t, 0), o, x: -dx, y: dy });
    ws.offB.pose({ t, roll, ph: 1.9, tap, look, blink: WORK.blinkAt(t, 1), o, x: dx, y: dy });
  }
  // calendar state from beat times: days = [start of day1, start of day2, ..., complete]
  function drawCalendar(ws, t, days, appear) {
    const l = life(t, appear, 1e9, { from: .3, dy: 40, d: .5 });
    tf(ws.cal.el, l);
    let n = 1, fp = 1;
    for (let k = 1; k < days.length - 1; k++) if (t >= days[k]) { n = k + 1; fp = clamp((t - days[k]) / .35); }
    ws.cal.draw(n, fp);
  }
  // SFX helper for a filling grid: roller swish on each block start, page flip on each new day, chime on completion
  function gridSfx(grid, days) {
    grid.starts.forEach(s => { const k = Math.floor(s), f = s - k; NSP.sfx('roller', days[k] + f * (days[k + 1] - days[k]), .9); });
    for (let k = 1; k < days.length - 1; k++) NSP.sfx('page', days[k] - .05, .9);
  }
  window.EP22 = { T, at, C, A, hide, pop, LAY, workSet, drawOfficers, drawCalendar, gridSfx };
  window.SC = {};
})();
