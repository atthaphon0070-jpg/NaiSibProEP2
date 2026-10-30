// NaiSibPro EP.28 — network topology kit.
// Two halves:
//   1. GRAPH CORE (no DOM; also loadable from Node for QC): node/link graphs for star, bus, ring, mesh, tree,
//      hybrid and point-to-point, BFS path search over the links that are up, and a structural validator per type.
//   2. VIEW (browser only): one <svg> per diagram that draws a frame "state" — nodes (computer / switch / bus tap /
//      terminator), cables (draw-in progress, ok / hot / dim / broken / green), and data packets that follow a
//      route of node ids. A packet is drawn only if every hop of its route is a drawn, unbroken link of the
//      current state; otherwise it is dropped and logged in window.TOPO_VIOLATIONS (QC reads that list).
(function (root) {
  // ===================================================================== 1. GRAPH CORE
  const lid = (a, b) => (a < b ? a + '~' + b : b + '~' + a);
  function graph(type, nodes, links, meta = {}) {
    const N = {};
    nodes.forEach(n => { N[n.id] = { kind: 'pc', label: n.id, ...n }; });
    const L = links.map(([a, b, kind = 'cable']) => ({ id: lid(a, b), a, b, kind }));
    return { type, nodes: N, links: L, meta };
  }
  const ids = g => Object.keys(g.nodes);
  const pcs = g => ids(g).filter(i => g.nodes[i].kind === 'pc');
  function adj(g, up = () => true, nodeUp = () => true) {
    const A = {}; ids(g).forEach(i => (A[i] = []));
    g.links.forEach(l => { if (up(l) && nodeUp(l.a) && nodeUp(l.b)) { A[l.a].push(l.b); A[l.b].push(l.a); } });
    return A;
  }
  // shortest path (node ids) over links that pass `up`; null when unreachable
  function path(g, from, to, up, nodeUp) {
    const A = adj(g, up, nodeUp), prev = { [from]: null }, q = [from];
    if (nodeUp && (!nodeUp(from) || !nodeUp(to))) return null;
    while (q.length) {
      const c = q.shift(); if (c === to) break;
      for (const n of A[c]) if (!(n in prev)) { prev[n] = c; q.push(n); }
    }
    if (!(to in prev)) return null;
    const p = []; for (let c = to; c !== null; c = prev[c]) p.unshift(c);
    return p;
  }
  const degree = (g, i, kind) => g.links.filter(l => (l.a === i || l.b === i) && (!kind || l.kind === kind)).length;
  const hasLink = (g, a, b) => g.links.some(l => l.id === lid(a, b));
  function connected(g, sub) {
    const S = sub || ids(g); if (!S.length) return true;
    const inS = new Set(S), A = adj(g, l => inS.has(l.a) && inS.has(l.b)), seen = new Set([S[0]]), q = [S[0]];
    while (q.length) { const c = q.shift(); for (const n of A[c]) if (!seen.has(n)) { seen.add(n); q.push(n); } }
    return S.every(i => seen.has(i));
  }
  const induced = (g, S) => { const s = new Set(S); return g.links.filter(l => s.has(l.a) && s.has(l.b)); };

  // ---------- layouts (stage px, 1080 × 1920 canvas) ----------
  const DEF = {
    // n computers on a circle around one central switch; PC1 at the top, clockwise
    star({ cx = 540, cy = 900, r = 250, n = 5, sw = 'SW', a0 = -90, pre = 'PC' } = {}) {
      const nodes = [{ id: sw, kind: 'switch', label: 'SWITCH', x: cx, y: cy }], links = [];
      for (let i = 0; i < n; i++) {
        const a = (a0 + i * 360 / n) * Math.PI / 180, id = pre + (i + 1);
        nodes.push({ id, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }); links.push([sw, id]);
      }
      return graph('star', nodes, links, { center: sw });
    },
    // one shared backbone (terminator — taps — terminator), each PC on its own short drop cable, alternating up/down
    bus({ cx = 540, cy = 900, w = 600, n = 5, drop = 170 } = {}) {
      const nodes = [{ id: 'TL', kind: 'term', x: cx - w / 2, y: cy }, { id: 'TR', kind: 'term', x: cx + w / 2, y: cy }], links = [];
      const xs = [...Array(n)].map((_, i) => cx - w / 2 + w * (i + .5) / n);
      const bb = ['TL', ...xs.map((_, i) => 'T' + (i + 1)), 'TR'];
      for (let i = 0; i < bb.length - 1; i++) links.push([bb[i], bb[i + 1], 'bb']);      // backbone first (drawn first)
      xs.forEach((x, i) => {
        nodes.push({ id: 'T' + (i + 1), kind: 'tap', x, y: cy });
        nodes.push({ id: 'PC' + (i + 1), x, y: cy + (i % 2 ? drop : -drop) });
        links.push(['T' + (i + 1), 'PC' + (i + 1), 'drop']);
      });
      return graph('bus', nodes, links, { backbone: bb });
    },
    ring({ cx = 540, cy = 900, r = 260, n = 5, a0 = -90 } = {}) {
      const nodes = [], links = [];
      for (let i = 0; i < n; i++) {
        const a = (a0 + i * 360 / n) * Math.PI / 180;
        nodes.push({ id: 'PC' + (i + 1), x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
        links.push(['PC' + (i + 1), 'PC' + ((i + 1) % n + 1)]);
      }
      return graph('ring', nodes, links, { order: nodes.map(n => n.id) });   // clockwise order = packet direction
    },
    // full: every pair linked (n(n-1)/2 links). partial: ring + the listed chords
    mesh({ cx = 540, cy = 900, r = 260, n = 5, full = true, chords = [['PC1', 'PC3'], ['PC1', 'PC4'], ['PC2', 'PC5']], a0 = -90 } = {}) {
      const nodes = [], links = [];
      for (let i = 0; i < n; i++) {
        const a = (a0 + i * 360 / n) * Math.PI / 180;
        nodes.push({ id: 'PC' + (i + 1), x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) });
      }
      if (full) for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) links.push(['PC' + (i + 1), 'PC' + (j + 1)]);
      else { for (let i = 0; i < n; i++) links.push(['PC' + (i + 1), 'PC' + ((i + 1) % n + 1)]); chords.forEach(c => links.push(c)); }
      return graph('mesh', nodes, links, { full });
    },
    // root switch → branch switches → computers (top to bottom); spec = PCs per branch
    tree({ cx = 540, top = 560, dy = 230, w = 560, spec = [2, 2] } = {}) {
      const nodes = [{ id: 'R', kind: 'switch', label: 'ROOT', x: cx, y: top }], links = [];
      const nb = spec.length, tot = spec.reduce((a, b) => a + b, 0);
      let k = 0;
      spec.forEach((m, b) => {
        const bx = cx - w / 2 + w * (b + .5) / nb, bid = 'B' + (b + 1);
        nodes.push({ id: bid, kind: 'switch', label: 'SW' + (b + 1), x: bx, y: top + dy, small: true }); links.push(['R', bid]);
        for (let j = 0; j < m; j++) {
          k++; const x = cx - (w + 120) / 2 + (w + 120) * (k - .5) / tot;
          nodes.push({ id: 'PC' + k, x, y: top + 2 * dy }); links.push([bid, 'PC' + k]);
        }
      });
      return graph('tree', nodes, links, { root: 'R' });
    },
    // star–bus hybrid: two star groups (switch + 3 PCs each) whose switches hang on one shared backbone
    hybrid({ y = 900, sc = .72 } = {}) {
      const nodes = [{ id: 'TL', kind: 'term', x: 250, y }, { id: 'TR', kind: 'term', x: 830, y }, { id: 'T1', kind: 'tap', x: 400, y }, { id: 'T2', kind: 'tap', x: 680, y },
        { id: 'SA', kind: 'switch', label: 'SW-A', x: 400, y: y - 165, s: sc }, { id: 'SB', kind: 'switch', label: 'SW-B', x: 680, y: y + 165, s: sc }];
      const links = [['TL', 'T1', 'bb'], ['T1', 'T2', 'bb'], ['T2', 'TR', 'bb'], ['T1', 'SA', 'drop'], ['T2', 'SB', 'drop']];
      [[275, y - 340], [400, y - 370], [525, y - 340]].forEach(([x, yy], i) => { nodes.push({ id: 'A' + (i + 1), label: 'A' + (i + 1), x, y: yy, s: sc }); links.push(['SA', 'A' + (i + 1)]); });
      [[555, y + 340], [680, y + 370], [805, y + 340]].forEach(([x, yy], i) => { nodes.push({ id: 'B' + (i + 1), label: 'B' + (i + 1), x, y: yy, s: sc }); links.push(['SB', 'B' + (i + 1)]); });
      return graph('hybrid', nodes, links, { parts: { star: ['SA', 'A1', 'A2', 'A3'], star2: ['SB', 'B1', 'B2', 'B3'], bus: ['TL', 'T1', 'T2', 'TR', 'SA', 'SB'] }, kinds: { star: 'star', star2: 'star', bus: 'bus' }, backbone: ['TL', 'T1', 'T2', 'TR'] });
    },
    p2p({ cx = 540, cy = 900, d = 440 } = {}) {
      return graph('p2p', [{ id: 'A', label: 'PC1', x: cx - d / 2, y: cy }, { id: 'B', label: 'PC2', x: cx + d / 2, y: cy }], [['A', 'B']]);
    },
  };

  // ---------- structural validators (graph-based, not visual) ----------
  function validate(g, type = g.type) {
    const C = [], ck = (name, pass, detail = '') => C.push({ name, pass: !!pass, detail });
    const P = pcs(g), I = ids(g);
    if (type === 'star') {
      const sw = I.filter(i => g.nodes[i].kind === 'switch');
      ck('exactly one central device', sw.length === 1, sw.join(','));
      const c = sw[0];
      ck('every computer has one link, to the central device', P.every(p => degree(g, p) === 1 && hasLink(g, p, c)), `${P.length} computers`);
      ck('no direct computer-to-computer link', !g.links.some(l => g.nodes[l.a].kind === 'pc' && g.nodes[l.b].kind === 'pc'));
      ck('link count = computers', g.links.length === P.length, `${g.links.length} links`);
    } else if (type === 'bus') {
      const bb = g.links.filter(l => l.kind === 'bb'), bn = [...new Set(bb.flatMap(l => [l.a, l.b]))];
      const att = I.filter(i => !bn.includes(i));
      ck('no central switch in the bus itself', !bn.some(i => g.nodes[i].kind === 'switch'));
      ck('backbone is one continuous simple path', connected({ ...g, links: bb }, bn) && bb.length === bn.length - 1 && bn.filter(i => degree(g, i, 'bb') === 1).length === 2, `${bb.length} backbone segments`);
      ck('backbone ends are terminators', bn.filter(i => degree(g, i, 'bb') === 1).every(i => g.nodes[i].kind === 'term'));
      ck('every attached device hangs on its own drop to a backbone tap', att.every(p => degree(g, p) === 1 && g.links.some(l => l.kind === 'drop' && (l.a === p || l.b === p) && g.nodes[l.a === p ? l.b : l.a].kind === 'tap')), `${att.length} attached`);
      ck('no tap carries two drops', I.filter(i => g.nodes[i].kind === 'tap').every(t => degree(g, t, 'drop') <= 1));
      ck('no device-to-device link outside the backbone', !g.links.some(l => att.includes(l.a) && att.includes(l.b)));
    } else if (type === 'ring') {
      ck('every node has exactly two neighbours', I.every(i => degree(g, i) === 2));
      ck('links = nodes (one closed loop)', g.links.length === I.length, `${I.length} nodes, ${g.links.length} links`);
      ck('loop is connected (single cycle)', connected(g));
      const o = g.meta.order; ck('ring order follows the links (clockwise packet direction is valid)', o.every((id, i) => hasLink(g, id, o[(i + 1) % o.length])));
    } else if (type === 'mesh') {
      const n = I.length, full = n * (n - 1) / 2;
      if (g.meta.full) ck('full mesh: every pair directly linked', g.links.length === full && I.every((a, i) => I.slice(i + 1).every(b => hasLink(g, a, b))), `${g.links.length}/${full} links`);
      else ck('partial mesh: fewer than all pairs, labelled partial', g.links.length < full, `${g.links.length}/${full} links`);
      ck('connected', connected(g));
      ck('every link has an alternative route (no single link isolates anyone)', g.links.every(l => path(g, l.a, l.b, x => x.id !== l.id)));
    } else if (type === 'tree') {
      const r = g.meta.root;
      ck('connected', connected(g));
      ck('acyclic (links = nodes − 1)', g.links.length === I.length - 1, `${I.length} nodes, ${g.links.length} links`);
      const depth = { [r]: 0 }, q = [r], A = adj(g);
      while (q.length) { const c = q.shift(); A[c].forEach(n => { if (!(n in depth)) { depth[n] = depth[c] + 1; q.push(n); } }); }
      ck('hierarchy: every non-root node has exactly one parent one level up', I.filter(i => i !== r).every(i => A[i].filter(n => depth[n] === depth[i] - 1).length === 1));
      ck('drawn top-to-bottom by level', g.links.every(l => Math.sign(g.nodes[l.b].y - g.nodes[l.a].y) === Math.sign(depth[l.b] - depth[l.a])));
      ck('computers are leaves', P.every(p => degree(g, p) === 1));
      ck('branches (≥ 2 children) below the root', A[r].length >= 2 && A[r].every(b => A[b].length - 1 >= 1));
    } else if (type === 'hybrid') {
      const parts = g.meta.parts, kinds = g.meta.kinds;
      Object.entries(parts).forEach(([name, S]) => {
        const t = kinds[name];
        const sub = { type: t, nodes: Object.fromEntries(S.map(i => [i, g.nodes[i]])), links: induced(g, S), meta: t === 'ring' ? { order: S } : {} };
        const v = validate(sub, t); ck(`component "${name}" is a valid ${t}`, v.ok, v.checks.filter(c => !c.pass).map(c => c.name).join('; '));
      });
      ck('at least two different topology types combined', new Set(Object.values(kinds)).size >= 2, Object.values(kinds).join(' + '));
      ck('every component shares a device with or links to another', Object.entries(parts).every(([n, S]) => Object.entries(parts).some(([m, R]) => m !== n && (S.some(i => R.includes(i)) || g.links.some(l => (S.includes(l.a) && R.includes(l.b)) || (S.includes(l.b) && R.includes(l.a)))))));
      ck('whole network connected', connected(g));
    } else if (type === 'p2p') {
      ck('exactly two nodes', I.length === 2);
      ck('one direct link between them', g.links.length === 1 && hasLink(g, I[0], I[1]));
    }
    return { type, ok: C.every(c => c.pass), checks: C };
  }

  const CORE = { lid, graph, DEF, path, adj, degree, hasLink, connected, validate, pcs, ids };
  if (typeof module !== 'undefined' && module.exports) { module.exports = CORE; return; }

  // ===================================================================== 2. VIEW (browser)
  const { clamp, lerp, E, h } = root.NSP;
  root.TOPO_VIOLATIONS = [];
  root.TOPO_NOW = 0;
  const NS = 'http://www.w3.org/2000/svg';
  const el = (tag, attrs = {}, parent) => { const e = document.createElementNS(NS, tag); for (const k in attrs) e.setAttribute(k, attrs[k]); if (parent) parent.appendChild(e); return e; };
  const COL = { ok: '#2F6BFF', glow: '#22D3EE', hot: '#22D3EE', dim: '#55657F', bad: '#EF4444', green: '#22C55E', bb: '#FFD23F' };

  // computer icon (monitor 128 × 92, stand, base), centred on the screen
  function pcSVG(g) {
    g.innerHTML = `
      <ellipse cx="0" cy="78" rx="62" ry="10" fill="#000" opacity=".18"/>
      <path d="M-14 46 L14 46 L20 66 L-20 66 Z" fill="#9FB1D4"/><rect x="-40" y="64" width="80" height="10" rx="5" fill="#C6D4EE"/>
      <rect class="bez" x="-66" y="-50" width="132" height="98" rx="14" fill="#1C2D55" stroke="#9FC2FF" stroke-width="3"/>
      <rect class="scr" x="-56" y="-40" width="112" height="72" rx="7" fill="#2A3B63"/>
      <g class="ui" opacity="0"><rect x="-46" y="-30" width="50" height="9" rx="4" fill="#BFF6FF"/><rect x="-46" y="-14" width="80" height="7" rx="3.5" fill="#E6FBFF" opacity=".75"/><rect x="-46" y="-1" width="64" height="7" rx="3.5" fill="#E6FBFF" opacity=".6"/><rect x="-46" y="12" width="36" height="9" rx="4" fill="#FFD23F"/></g>
      <path d="M-50 -34 L-18 -34 L-50 -4 Z" fill="#fff" opacity=".10"/>
      <circle class="led" cx="52" cy="40" r="5.5" fill="#22C55E"/>
      <g class="off" opacity="0"><circle cx="0" cy="-4" r="22" fill="#EF4444"/><path d="M-9 -13 L9 5 M9 -13 L-9 5" stroke="#fff" stroke-width="5" stroke-linecap="round"/></g>
      <g class="ok" opacity="0"><circle cx="0" cy="-4" r="22" fill="#22C55E"/><path d="M-10 -4 L-3 3 L10 -10" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/></g>
      <g class="wy" opacity="0"><path d="M0 -36 L28 12 L-28 12 Z" fill="#FFD23F" stroke="#7A2A10" stroke-width="3" stroke-linejoin="round"/><rect x="-3" y="-22" width="6" height="18" rx="3" fill="#7A2A10"/><circle cx="0" cy="4" r="3.6" fill="#7A2A10"/></g>
      <g class="lab"><rect x="-38" y="86" width="76" height="34" rx="17" fill="#0E1D48" stroke="#22D3EE" stroke-width="2.5"/><text x="0" y="110" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="22" fill="#fff"></text></g>`;
    return { scr: g.querySelector('.scr'), ui: g.querySelector('.ui'), led: g.querySelector('.led'), off: g.querySelector('.off'), ok: g.querySelector('.ok'), wy: g.querySelector('.wy'), lab: g.querySelector('.lab'), txt: g.querySelector('text'), bez: g.querySelector('.bez') };
  }
  // network switch: 196 × 70 box with 8 ports + status LEDs
  function swSVG(g) {
    g.innerHTML = `
      <ellipse cx="0" cy="52" rx="104" ry="12" fill="#000" opacity=".2"/>
      <g class="halo" opacity="0"><circle r="120" fill="url(#tp-halo)"/></g>
      <rect class="box" x="-98" y="-36" width="196" height="72" rx="16" fill="#203A78" stroke="#9FC2FF" stroke-width="3"/>
      <rect x="-90" y="-28" width="180" height="14" rx="7" fill="#fff" opacity=".10"/>
      ${[...Array(8)].map((_, i) => `<rect x="${-82 + i * 21}" y="-4" width="15" height="14" rx="2.5" fill="#0B1634"/><circle class="pl" cx="${-74.5 + i * 21}" cy="20" r="3.6" fill="#22D3EE"/>`).join('')}
      <circle class="pwr" cx="84" cy="-21" r="5" fill="#22C55E"/>
      <g class="warn" opacity="0"><path d="M0 -112 L34 -54 L-34 -54 Z" fill="#FFD23F" stroke="#7A2A10" stroke-width="3" stroke-linejoin="round"/><rect x="-3.5" y="-96" width="7" height="24" rx="3" fill="#7A2A10"/><circle cx="0" cy="-63" r="4.2" fill="#7A2A10"/></g>
      <g class="lab"><rect x="-62" y="46" width="124" height="34" rx="17" fill="#0E1D48" stroke="#FFD23F" stroke-width="2.5"/><text x="0" y="70" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="21" fill="#FFD23F"></text></g>`;
    return { box: g.querySelector('.box'), pl: [...g.querySelectorAll('.pl')], pwr: g.querySelector('.pwr'), warn: g.querySelector('.warn'), lab: g.querySelector('.lab'), txt: g.querySelector('text'), halo: g.querySelector('.halo') };
  }
  function termSVG(g) { g.innerHTML = `<rect x="-11" y="-24" width="22" height="48" rx="6" fill="#FFD23F" stroke="#7A5A00" stroke-width="3"/><rect x="-4" y="-14" width="8" height="28" rx="3" fill="#7A5A00" opacity=".45"/>`; return {}; }
  function tapSVG(g) { g.innerHTML = `<circle r="10" fill="#FFD23F" stroke="#0E1D48" stroke-width="3"/>`; return {}; }

  // view: an absolutely positioned 1080 × 1920 svg; `cam` = {x, y, s} zooms about (x, y) → stage centre
  function view(parent, { dark = true } = {}) {
    const svg = el('svg', { width: 1080, height: 1920, viewBox: '0 0 1080 1920', class: 'topo', style: 'position:absolute;left:0;top:0;overflow:visible' });
    parent.appendChild(svg);
    const defs = el('defs', {}, svg);
    defs.innerHTML = `<radialGradient id="tp-halo"><stop offset="0" stop-color="#22D3EE" stop-opacity=".55"/><stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></radialGradient>
      <radialGradient id="tp-pk"><stop offset="0" stop-color="#FFFFFF"/><stop offset=".35" stop-color="#9FF3FF"/><stop offset="1" stop-color="#22D3EE" stop-opacity="0"/></radialGradient>
      <radialGradient id="tp-pkr"><stop offset="0" stop-color="#FFF"/><stop offset=".35" stop-color="#FFB4B4"/><stop offset="1" stop-color="#EF4444" stop-opacity="0"/></radialGradient>
      <radialGradient id="tp-pkg"><stop offset="0" stop-color="#FFF"/><stop offset=".35" stop-color="#B9FFD2"/><stop offset="1" stop-color="#22C55E" stop-opacity="0"/></radialGradient>
      <radialGradient id="tp-spark"><stop offset="0" stop-color="#FFF7C2"/><stop offset=".4" stop-color="#FFD23F"/><stop offset="1" stop-color="#EF4444" stop-opacity="0"/></radialGradient>`;
    const cam = el('g', {}, svg), gL = el('g', {}, cam), gP = el('g', {}, cam), gN = el('g', {}, cam), gX = el('g', {}, cam);
    const LP = {}, NP = {}, PP = [];
    let last = null;
    function linkEl(id) {
      if (LP[id]) return LP[id];
      const g = el('g', {}, gL);
      const o = { g, glow: el('path', { fill: 'none', 'stroke-linecap': 'round' }, g), core: el('path', { fill: 'none', 'stroke-linecap': 'round' }, g), hi: el('path', { fill: 'none', 'stroke-linecap': 'round', stroke: '#fff', 'stroke-opacity': .5 }, g),
        spark: el('circle', { r: 26, fill: 'url(#tp-spark)' }, g), x: el('g', {}, g) };
      o.x.innerHTML = `<circle r="17" fill="#EF4444" stroke="#fff" stroke-width="3"/><path d="M-6.5 -6.5 L6.5 6.5 M6.5 -6.5 L-6.5 6.5" stroke="#fff" stroke-width="4" stroke-linecap="round"/>`;
      return (LP[id] = o);
    }
    function nodeEl(id, kind) {
      const k = id + '|' + kind;
      if (NP[k]) return NP[k];
      const g = el('g', {}, gN);
      const parts = kind === 'switch' ? swSVG(g) : kind === 'term' ? termSVG(g) : kind === 'tap' ? tapSVG(g) : pcSVG(g);
      return (NP[k] = { g, kind, ...parts });
    }
    function pkEl(i) {
      while (PP.length <= i) {
        const g = el('g', {}, gP);
        PP.push({ g, halo: el('circle', { r: 30, fill: 'url(#tp-pk)' }, g), core: el('circle', { r: 9, fill: '#fff' }, g), file: (() => { const f = el('g', {}, g); f.innerHTML = `<path d="M-17 -22 H8 L17 -13 V22 H-17 Z" fill="#fff" stroke="#2F6BFF" stroke-width="3" stroke-linejoin="round"/><path d="M8 -22 V-13 H17" fill="#C9DBFF"/><path d="M-10 -6 H9 M-10 2 H9 M-10 10 H3" stroke="#2F6BFF" stroke-width="3" stroke-linecap="round"/>`; return f; })() });
      }
      return PP[i];
    }
    // state: { type, nodes:{id:{x,y,kind,label,s,o,on,alert,ok,lab,fail,glow}}, links:[{a,b,kind,p,o,st,brk,gap,w}], packets:[{route,u,c,file,s}], cam }
    function draw(S, t = 0) {
      last = S;
      svg.dataset.type = S.type || '';
      const c = S.cam || { x: 540, y: 900, s: 1 };
      cam.setAttribute('transform', `translate(${c.tx ?? 540} ${c.ty ?? 900}) scale(${c.s}) translate(${-c.x} ${-c.y})`);
      svg.style.opacity = S.o ?? 1;
      const used = new Set();
      // ---- links
      S.links.forEach(L => {
        const A = S.nodes[L.a], B = S.nodes[L.b]; if (!A || !B) return;
        const o = linkEl(L.id || lid(L.a, L.b)); used.add(o);
        const p = clamp(L.p ?? 1), op = (L.o ?? 1) * Math.min(A.o ?? 1, B.o ?? 1, 1);
        const st = L.st || 'ok', bb = L.kind === 'bb';
        const w = L.w ?? (bb ? 16 : L.kind === 'drop' ? 7 : 8);
        let col = st === 'bad' ? COL.bad : st === 'dim' ? (L.red ? '#B8475A' : COL.dim) : st === 'green' ? COL.green : st === 'hot' ? COL.hot : bb ? COL.bb : COL.ok;
        const x0 = A.x, y0 = A.y, x1 = lerp(A.x, B.x, p), y1 = lerp(A.y, B.y, p);
        let d;
        const brk = L.brk ?? .5, gap = clamp(L.gap ?? 0);
        if (st === 'bad' && gap > 0) {
          const len = Math.hypot(B.x - A.x, B.y - A.y) || 1, gh = Math.min(.45, 34 * gap / len);
          const m0 = Math.max(0, brk - gh), m1 = Math.min(1, brk + gh);
          d = `M${x0} ${y0} L${lerp(A.x, B.x, m0)} ${lerp(A.y, B.y, m0)} M${lerp(A.x, B.x, m1)} ${lerp(A.y, B.y, m1)} L${B.x} ${B.y}`;
        } else d = p > 0.001 ? `M${x0} ${y0} L${x1} ${y1}` : '';
        [o.glow, o.core, o.hi].forEach(e => e.setAttribute('d', d));
        o.glow.setAttribute('stroke', st === 'dim' ? 'none' : col); o.glow.setAttribute('stroke-width', w * 2.6); o.glow.setAttribute('stroke-opacity', st === 'hot' || st === 'green' ? .35 + .15 * Math.sin(t * 8) : .18);
        o.core.setAttribute('stroke', col); o.core.setAttribute('stroke-width', w);
        o.core.setAttribute('stroke-dasharray', st === 'dim' ? '14 12' : 'none');
        o.hi.setAttribute('stroke-width', w * .28); o.hi.setAttribute('stroke-opacity', st === 'dim' ? 0 : bb ? .55 : .4);
        o.g.style.opacity = op; o.g.style.display = op <= 0.001 || !d ? 'none' : '';
        const mx = lerp(A.x, B.x, brk), my = lerp(A.y, B.y, brk);
        const sp = L.spark ?? 0;
        o.spark.setAttribute('cx', mx); o.spark.setAttribute('cy', my); o.spark.style.opacity = sp; o.spark.setAttribute('r', 20 + 16 * sp);
        o.x.setAttribute('transform', `translate(${mx} ${my}) scale(${L.xs ?? 0})`); o.x.style.opacity = L.xs ? 1 : 0;
      });
      Object.values(LP).forEach(o => { if (!used.has(o)) o.g.style.display = 'none'; });
      // ---- nodes
      const usedN = new Set();
      Object.entries(S.nodes).forEach(([id, N]) => {
        const kind = N.kind || 'pc', o = nodeEl(id, kind); usedN.add(o);
        const sc = N.s ?? 1, op = N.o ?? 1;
        o.g.setAttribute('transform', `translate(${N.x} ${N.y}) scale(${sc * (N.small ? .8 : 1)})`);
        o.g.style.opacity = op; o.g.style.display = op <= 0.001 ? 'none' : '';
        if (kind === 'pc') {
          const on = N.on ?? 1;
          o.scr.setAttribute('fill', on > .5 ? (N.alert > .3 ? '#5A2A3A' : '#1F8FD8') : '#2A3B63');
          o.ui.setAttribute('opacity', on * (N.alert > .3 ? .25 : 1));
          o.led.setAttribute('fill', N.alert > .3 ? '#EF4444' : on > .5 ? (Math.sin(t * 9 + (N.ph || 0)) > -.3 ? '#22C55E' : '#0F7A3A') : '#3B4660');
          o.off.setAttribute('opacity', N.alert ?? 0); o.off.setAttribute('transform', `scale(${.6 + .4 * (N.alert ?? 0)})`);
          o.wy.setAttribute('opacity', N.warn ?? 0); o.wy.setAttribute('transform', `scale(${.6 + .4 * (N.warn ?? 0)})`);
          o.ok.setAttribute('opacity', N.ok ?? 0); o.ok.setAttribute('transform', `scale(${.6 + .4 * (N.ok ?? 0)})`);
          o.bez.setAttribute('stroke', N.glow ? '#FFD23F' : '#9FC2FF'); o.bez.setAttribute('stroke-width', N.glow ? 6 : 3);
          o.txt.textContent = N.label ?? id; o.lab.style.display = N.lab === false ? 'none' : '';
        } else if (kind === 'switch') {
          const f = N.fail ?? 0;
          o.box.setAttribute('fill', f > .5 ? '#5A1F2A' : '#203A78'); o.box.setAttribute('stroke', f > .5 ? '#EF4444' : N.glow ? '#FFD23F' : '#9FC2FF'); o.box.setAttribute('stroke-width', N.glow || f > .5 ? 6 : 3);
          o.pl.forEach((l, i) => l.setAttribute('fill', f > .5 ? (f < 1 && Math.sin(t * 40 + i) > 0 ? '#EF4444' : '#3B2030') : (Math.sin(t * 7 + i * 1.7) > -.4 ? '#22D3EE' : '#0B5560')));
          o.pwr.setAttribute('fill', f > .5 ? '#EF4444' : '#22C55E');
          o.warn.setAttribute('opacity', N.warn ?? 0); o.warn.setAttribute('transform', `translate(0 ${-6 * Math.sin(t * 6) * (N.warn ?? 0)})`);
          o.halo.setAttribute('opacity', N.halo ?? 0);
          o.txt.textContent = N.label ?? 'SWITCH'; o.lab.style.display = N.lab === false ? 'none' : '';
        }
      });
      Object.values(NP).forEach(o => { if (!usedN.has(o)) o.g.style.display = 'none'; });
      // ---- packets: only along drawn, unbroken links of THIS state
      const up = {};
      S.links.forEach(L => { if ((L.p ?? 1) >= .999 && (L.st || 'ok') !== 'bad' && (L.st || 'ok') !== 'dim' && (L.o ?? 1) > .5) up[L.id || lid(L.a, L.b)] = 1; });
      let k = 0;
      (S.packets || []).forEach(pk => {
        const r = pk.route; if (!r || r.length < 2) return;
        const u = clamp(pk.u);
        // hops actually travelled (or being travelled) at this u
        const seg = [];
        let tot = 0;
        for (let i = 0; i < r.length - 1; i++) { const A = S.nodes[r[i]], B = S.nodes[r[i + 1]]; const l = A && B ? Math.hypot(B.x - A.x, B.y - A.y) : 0; seg.push(l); tot += l; }
        let dist = u * tot, i = 0;
        while (i < seg.length - 1 && dist > seg[i]) { dist -= seg[i]; i++; }
        const bad = [];
        for (let j = 0; j <= i; j++) if (!up[lid(r[j], r[j + 1])]) bad.push(lid(r[j], r[j + 1]));
        if (bad.length) { root.TOPO_VIOLATIONS.push({ t: +root.TOPO_NOW.toFixed(3), type: S.type, route: r.join('>'), links: bad }); return; }
        const A = S.nodes[r[i]], B = S.nodes[r[i + 1]], f = seg[i] ? dist / seg[i] : 0;
        const o = pkEl(k++);
        o.g.style.display = ''; o.g.setAttribute('transform', `translate(${lerp(A.x, B.x, f)} ${lerp(A.y, B.y, f)}) scale(${pk.s ?? 1})`);
        o.g.style.opacity = pk.o ?? 1;
        o.halo.setAttribute('fill', pk.c === 'green' ? 'url(#tp-pkg)' : pk.c === 'red' ? 'url(#tp-pkr)' : 'url(#tp-pk)');
        o.core.style.display = pk.file ? 'none' : ''; o.file.style.display = pk.file ? '' : 'none';
      });
      for (; k < PP.length; k++) PP[k].g.style.display = 'none';
    }
    return { svg, draw, last: () => last, overlay: gX };
  }

  // ---------- state helpers ----------
  // base state from a graph: all links drawn, all nodes on
  function state(g, extra = {}) {
    const nodes = {};
    Object.values(g.nodes).forEach(n => { nodes[n.id] = { ...n }; });
    return { type: g.type, graph: g, nodes, links: g.links.map(l => ({ ...l })), packets: [], ...extra };
  }
  // links drawn in sequence: link i draws during [a + i*stagger, +d]
  function drawIn(S, u, a, d = .35, stagger = .12, filter = () => true) {
    let i = 0;
    S.links.forEach(L => { if (!filter(L)) return; L.p = E.out(clamp((u - a - i * stagger) / d)); i++; });
    return S;
  }
  // morph graph A → graph B over k ∈ [0,1]: old-only links retract, shared nodes glide, new-only links draw in
  function morph(gA, gB, k, { retract = [0, .3], move = [.25, .7], grow = [.62, 1] } = {}) {
    const ph = ([a, b]) => clamp((k - a) / (b - a));
    const kr = E.inOut(ph(retract)), km = E.inOut(ph(move)), kg = ph(grow);
    const nodes = {};
    const allN = new Set([...Object.keys(gA.nodes), ...Object.keys(gB.nodes)]);
    allN.forEach(id => {
      const a = gA.nodes[id], b = gB.nodes[id];
      if (a && b && a.kind === b.kind) nodes[id] = { ...b, x: lerp(a.x, b.x, km), y: lerp(a.y, b.y, km) };
      else if (a && b) nodes[id] = km < .5 ? { ...a, x: lerp(a.x, b.x, km), y: lerp(a.y, b.y, km), o: 1 - km * 2 } : { ...b, x: lerp(a.x, b.x, km), y: lerp(a.y, b.y, km), o: km * 2 - 1, _k: b.kind };
      else if (a) nodes[id] = { ...a, o: 1 - E.out(clamp(km * 2)), s: 1 - .4 * km };
      else nodes[id] = { ...b, o: E.out(clamp(km * 2 - 1)), s: .6 + .4 * km };
    });
    // a node id whose kind changes keeps one key per kind so both icons can cross-fade
    Object.keys(nodes).forEach(id => { if (nodes[id]._k) { const a = gA.nodes[id]; nodes[id + '#old'] = { ...a, x: nodes[id].x, y: nodes[id].y, o: 0 }; } });
    const bIds = new Set(gB.links.map(l => l.id)), aIds = new Set(gA.links.map(l => l.id));
    const links = [];
    gA.links.forEach(l => { if (!bIds.has(l.id)) links.push({ ...l, p: 1 - kr, o: 1 - kr }); });
    let i = 0; const nNew = gB.links.filter(l => !aIds.has(l.id)).length || 1;
    gB.links.forEach(l => {
      if (aIds.has(l.id)) links.push({ ...l, p: 1 });
      else { const s = i++ / nNew * .55; links.push({ ...l, p: E.out(clamp((kg - s) / .45)) }); }
    });
    return { type: k < .5 ? gA.type : gB.type, nodes, links, packets: [] };
  }
  // packet helpers: n packets travelling `route` back-to-back, period T seconds, u from time
  function stream(route, t, a, b, { T = 1.2, n = 1, c, file, s, ease = true } = {}) {
    const out = [];
    if (t < a || t >= b) return out;
    for (let j = 0; j < n; j++) {
      const v = (t - a) / T - j / n; if (v < 0) continue;
      const u = v - Math.floor(v);
      out.push({ route, u: ease ? E.inOut(u) : u, c, file, s });
    }
    return out;
  }
  root.TOPO = { ...CORE, view, state, drawIn, morph, stream, pcSVG, swSVG, COL };
})(typeof window !== 'undefined' ? window : globalThis);
