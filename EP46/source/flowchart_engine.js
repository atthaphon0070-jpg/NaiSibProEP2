// EP.46 FlowchartExecutionEngine — deterministic flowchart rendering + execution.
// A Chart owns: symbol nodes (FS.node), flowlines (draw-on base line, cyan "lit" overlay, travelling
// pulse, arrowhead, Yes/No label), a data token, a decision evaluation bubble, result pop-ups and a camera.
// Everything is a pure function of the time passed in: the same timestamp always gives the same frame.
(function () {
  const { clamp, lerp, E, P, tf } = window.NSP;
  const SVGNS = 'http://www.w3.org/2000/svg';

  function polyLen(pts) { let L = 0; for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); return L; }
  function polyAt(pts, f) {                          // point at fraction f of a polyline
    const L = polyLen(pts); let d = clamp(f) * L;
    for (let i = 1; i < pts.length; i++) {
      const a = pts[i - 1], b = pts[i], s = Math.hypot(b[0] - a[0], b[1] - a[1]);
      if (d <= s || i === pts.length - 1) { const k = s ? Math.min(1, d / s) : 0; return [lerp(a[0], b[0], k), lerp(a[1], b[1], k), Math.atan2(b[1] - a[1], b[0] - a[0])]; }
      d -= s;
    }
    return [...pts[pts.length - 1], 0];
  }
  const dOf = pts => 'M' + pts.map(p => p.join(',')).join('L');

  class Chart {
    // spec: { nodes:[{id,kind,cx,cy,w,h,label}], edges:[{id,from,to,pts,label,labelAt,branch}] }
    constructor(container, spec, { anchor = [540, 890] } = {}) {
      this.spec = spec; this.anchor = anchor; this.n = {}; this.e = {};
      const world = this.world = document.createElement('div');
      world.className = 'fc-world'; container.appendChild(world);
      const svg = this.svg = document.createElementNS(SVGNS, 'svg');
      svg.setAttribute('width', 1080); svg.setAttribute('height', 1920); svg.setAttribute('class', 'fc-lines');
      world.appendChild(svg);
      spec.edges.forEach(ed => {
        const g = document.createElementNS(SVGNS, 'g');
        const mk = (cls) => { const p = document.createElementNS(SVGNS, 'path'); p.setAttribute('d', dOf(ed.pts)); p.setAttribute('class', cls); g.appendChild(p); return p; };
        const base = mk('fl-base'), lit = mk('fl-lit'), pulse = mk('fl-pulse');
        const head = document.createElementNS(SVGNS, 'path'); head.setAttribute('class', 'fl-head'); head.setAttribute('d', 'M-26,-16L4,0L-26,16Z'); g.appendChild(head);
        svg.appendChild(g);
        const len = polyLen(ed.pts);
        [base, lit].forEach(p => p.style.strokeDasharray = `${len} ${len + 10}`);
        pulse.style.strokeDasharray = `60 ${len + 200}`;
        const end = ed.pts[ed.pts.length - 1], pre = ed.pts[ed.pts.length - 2];
        head.setAttribute('transform', `translate(${end[0]} ${end[1]}) rotate(${Math.atan2(end[1] - pre[1], end[0] - pre[0]) * 180 / Math.PI})`);
        let label = null;
        if (ed.label) {
          label = document.createElement('div'); label.className = 'fl-label ' + (ed.branch || '');
          label.innerHTML = ed.label; world.appendChild(label);
          label.style.left = ed.labelAt[0] + 'px'; label.style.top = ed.labelAt[1] + 'px';
        }
        this.e[ed.id] = { spec: ed, base, lit, pulse, head, label, len };
      });
      spec.nodes.forEach(nd => {
        world.insertAdjacentHTML('beforeend', window.FS.node(nd.kind, { w: nd.w, h: nd.h, label: nd.label, cx: nd.cx, cy: nd.cy, cls: 'n-' + nd.id, fs: nd.fs }));
        this.n[nd.id] = { spec: nd, el: world.lastElementChild };
      });
      // token, evaluation bubble, result pop
      world.insertAdjacentHTML('beforeend', `<div class="fc-token"><span></span></div>
        <div class="fc-eval"><span class="ev-t"></span></div>
        <div class="fc-pop"><span></span></div>`);
      this.token = world.querySelector('.fc-token'); this.evalEl = world.querySelector('.fc-eval'); this.pop = world.querySelector('.fc-pop');
    }
    node(id) { return this.n[id]; }
    // p: appear progress, tone/glow per FS.setState, s: extra scale
    setNode(id, { p = 1, tone = 'idle', glow = 0, s = 1, dy = 0 } = {}) {
      const n = this.n[id], e = E.back(clamp(p));
      window.FS.setState(n.el, { tone, glow });
      tf(n.el, { s: lerp(.3, 1, e) * s, o: clamp(p * 2.2), y: dy + (1 - E.out(clamp(p))) * 30 });
    }
    // p: draw-on progress (base line), lit: cyan overlay progress, pulse: travelling-dash phase (null = off)
    setEdge(id, { p = 1, lit = 0, pulse = null, label = p, tone = 'cy' } = {}) {
      const e = this.e[id];
      e.base.style.strokeDashoffset = e.len * (1 - clamp(p));
      e.base.style.opacity = p > 0 ? 1 : 0;
      e.lit.style.strokeDashoffset = e.len * (1 - clamp(lit));
      e.lit.style.opacity = lit > 0 ? 1 : 0;
      e.lit.setAttribute('class', 'fl-lit ' + tone);
      if (pulse == null || p < 1) e.pulse.style.opacity = 0;
      else { e.pulse.style.opacity = 1; e.pulse.style.strokeDashoffset = 60 - (pulse % 1) * (e.len + 60); }
      const hp = clamp((p - .86) / .14);
      e.head.style.opacity = hp; e.head.setAttribute('class', 'fl-head' + (lit >= .98 ? ' on ' + tone : ''));
      if (e.label) tf(e.label, { s: lerp(.4, 1, E.back(clamp(label))), o: clamp(label * 2) });
    }
    edgePoint(id, f) { return polyAt(this.e[id].spec.pts, f); }
    // camera: world point (cx,cy) appears at the screen anchor at zoom z
    camera(cx, cy, z = 1) {
      const [ax, ay] = this.anchor;
      this.world.style.transform = `translate(${ax - cx * z}px,${ay - cy * z}px) scale(${z})`;
      this.cam = { cx, cy, z };
    }
    // screen-space position of a world point (for safe-zone QC)
    toScreen(x, y) { const { cx, cy, z } = this.cam || { cx: 540, cy: 890, z: 1 }; return [this.anchor[0] + (x - cx) * z, this.anchor[1] + (y - cy) * z]; }
  }

  // ---------------- execution planning ----------------
  // route: ordered [node, edge, node, ...] from DL.route(). Returns timed steps.
  // speed px/s along flowlines; dwell per node kind; decision dwell holds the evaluation.
  function plan(chart, route, { speed = 620, dwell = { decision: .9, io: .35, terminator: .25 }, enter = .45 } = {}) {
    const steps = []; let t = 0;
    route.forEach((id, i) => {
      if (chart.e[id]) { const d = chart.e[id].len / speed; steps.push({ id, kind: 'edge', a: t, b: t + d }); t += d; }
      else {
        const k = chart.n[id].spec.kind; const d = i === 0 ? enter : (i === route.length - 1 ? .3 : (dwell[k] ?? .35));
        steps.push({ id, kind: 'node', nk: k, a: t, b: t + d }); t += d;
      }
    });
    return { steps, dur: t, route };
  }

  // State of a run at run-local time u (may be negative / past the end).
  function stateAt(chart, pl, u) {
    const st = { visible: u >= 0, pos: null, at: null, lit: {}, hit: {}, done: u >= pl.dur, step: null };
    for (const s of pl.steps) {
      if (s.kind === 'edge') st.lit[s.id] = clamp((u - s.a) / (s.b - s.a));
      else if (u >= s.a) st.hit[s.id] = u - s.a;
      if (u >= s.a && (u < s.b || s === pl.steps[pl.steps.length - 1])) st.step = s;
    }
    const s = st.step || pl.steps[0];
    if (s.kind === 'edge') { const [x, y] = chart.edgePoint(s.id, (u - s.a) / (s.b - s.a)); st.pos = [x, y]; }
    else {
      const n = chart.n[s.id].spec;
      if (n.kind === 'decision') {
        // token rests on the top vertex while the condition is evaluated, then leaves by the chosen exit
        st.pos = [n.cx, n.cy - n.h / 2];
      } else st.pos = [n.cx, n.cy];
    }
    st.at = s.id;
    return st;
  }

  window.FCE = { Chart, plan, stateAt, polyAt, polyLen };
})();
