// EP.46 flowchart symbol library — six original, reusable symbol components (SVG + HTML).
//   terminator (oval / stadium) · process (rectangle) · io (parallelogram) · decision (diamond)
//   flowline (directed arrow)   · connector (small circle)
// Shapes stay geometrically standard at every state: only stroke colour, fill and glow change,
// so each symbol is recognisable without colour.
(function () {
  const FS = {};
  const IO_SKEW = .34;                                  // parallelogram slant (fraction of height)
  FS.skew = h => h * IO_SKEW;

  // outline path for a symbol of size w×h with its top-left at 0,0
  FS.path = function (kind, w, h) {
    switch (kind) {
      case 'terminator': { const r = h / 2; return `M${r},0H${w - r}A${r},${r} 0 0 1 ${w - r},${h}H${r}A${r},${r} 0 0 1 ${r},0Z`; }
      case 'process': return `M0,0H${w}V${h}H0Z`;
      case 'io': { const s = FS.skew(h); return `M${s},0H${w}L${w - s},${h}H0Z`; }
      case 'decision': return `M${w / 2},0L${w},${h / 2}L${w / 2},${h}L0,${h / 2}Z`;
      case 'connector': { const r = Math.min(w, h) / 2; return `M${w / 2 - r},${h / 2}a${r},${r} 0 1 0 ${2 * r},0a${r},${r} 0 1 0 ${-2 * r},0Z`; }
    }
    throw new Error('unknown symbol ' + kind);
  };

  // shared gradients (one hidden <svg> per document)
  FS.installDefs = function () {
    if (document.getElementById('fs-defs')) return;
    document.body.insertAdjacentHTML('afterbegin', `<svg id="fs-defs" width="0" height="0" style="position:absolute"><defs>
      <linearGradient id="fsFill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#21498F"/><stop offset="1" stop-color="#132A55"/></linearGradient>
      <linearGradient id="fsHot" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2F6BFF"/><stop offset="1" stop-color="#173B85"/></linearGradient>
      <linearGradient id="fsOk" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2FD27A"/><stop offset="1" stop-color="#127A44"/></linearGradient>
      <linearGradient id="fsBad" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F26565"/><stop offset="1" stop-color="#9C2424"/></linearGradient>
      <linearGradient id="fsIce" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#D6EBFF"/></linearGradient>
    </defs></svg>`);
  };

  // A positioned symbol node: <div class="fsn k-kind"> svg + label. cx/cy optional (absolute centre).
  FS.node = function (kind, { w, h, label = '', cx, cy, cls = '', sw = 6, fs } = {}) {
    const pad = 24, d = FS.path(kind, w, h);
    const pos = cx != null ? `left:${cx - w / 2}px;top:${cy - h / 2}px;` : '';
    const inset = kind === 'io' ? `padding:0 ${FS.skew(h) * .9}px;` : kind === 'decision' ? `padding:0 ${w * .16}px;` : '';
    return `<div class="fsn k-${kind} ${cls}" style="${pos}width:${w}px;height:${h}px">
      <svg width="${w + 2 * pad}" height="${h + 2 * pad}" viewBox="${-pad} ${-pad} ${w + 2 * pad} ${h + 2 * pad}" style="position:absolute;left:${-pad}px;top:${-pad}px;overflow:visible">
        <path class="sh-glow" d="${d}" style="stroke-width:${sw + 14}px"/><path class="sh" d="${d}" style="stroke-width:${sw}px"/>
        <path class="sh-in" d="${d}" transform="translate(${w * .04} ${h * .06}) scale(.92 .88)" /></svg>
      <div class="lb" style="${inset}${fs ? `font-size:${fs}px;` : ''}"><span>${label}</span></div></div>`;
  };

  // A small inline symbol (quiz cards, recap rows, end card)
  FS.mini = function (kind, w, h, { sw = 4.5, stroke = '#22D3EE', fill = 'url(#fsFill)', label = '' } = {}) {
    const pad = 6;
    if (kind === 'flowline') return `<svg width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible"><path d="M${w * .08},${h / 2}H${w * .78}" stroke="${stroke}" stroke-width="${sw * 1.2}" stroke-linecap="round"/><path d="M${w * .7},${h / 2 - h * .26}L${w * .95},${h / 2}L${w * .7},${h / 2 + h * .26}Z" fill="${stroke}"/></svg>`;
    const ww = kind === 'connector' ? Math.min(w, h) : w, hh = kind === 'connector' ? Math.min(w, h) : h;
    const ox = (w - ww) / 2, oy = (h - hh) / 2;
    return `<svg width="${w}" height="${h}" viewBox="${-pad} ${-pad} ${w + 2 * pad} ${h + 2 * pad}" style="overflow:visible">
      <path d="${FS.path(kind, ww, hh)}" transform="translate(${ox} ${oy})" fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round"/>
      ${label ? `<text x="${w / 2}" y="${h / 2 + h * .17}" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="${h * .5}" fill="#E6F4FF">${label}</text>` : ''}</svg>`;
  };

  // state: { p: appear 0..1, glow: 0..1, tone: 'idle'|'hot'|'ok'|'bad'|'dim', s: extra scale, x/y offsets }
  const TONES = {
    idle: ['#5FA8FF', 'url(#fsFill)', 'rgba(47,107,255,.35)', '#E6F4FF'],
    hot: ['#22D3EE', 'url(#fsHot)', 'rgba(34,211,238,.75)', '#FFFFFF'],
    ok: ['#7CF5B0', 'url(#fsOk)', 'rgba(34,197,94,.8)', '#FFFFFF'],
    bad: ['#FF9C9C', 'url(#fsBad)', 'rgba(239,68,68,.75)', '#FFFFFF'],
    dim: ['rgba(149,191,239,.45)', 'rgba(20,43,83,.85)', 'rgba(47,107,255,0)', 'rgba(230,244,255,.55)'],
  };
  FS.TONES = TONES;
  FS.setState = function (el, { tone = 'idle', glow = 0 } = {}) {
    const T = TONES[tone] || TONES.idle;
    el.style.setProperty('--st', T[0]); el.style.setProperty('--fl', T[1]);
    el.style.setProperty('--gl', T[2]); el.style.setProperty('--tx', T[3]);
    el.style.setProperty('--ga', (.25 + .75 * glow).toFixed(3));
  };

  // inline glyphs (Prompt's Latin subset lacks ≥ and →): replaces text in non-SVG text nodes
  const GE = `<svg class="gl" viewBox="0 0 20 24" style="width:.62em;height:.74em;vertical-align:-.06em;margin:0 .12em"><path d="M3 3.5l14 6.5-14 6.5M3 21h14" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const AR = `<svg class="gl" viewBox="0 0 24 20" style="width:.8em;height:.66em;vertical-align:-.02em;margin:0 .14em"><path d="M2 10h17M13 3.5l7 6.5-7 6.5" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  FS.GE = GE; FS.AR = AR;
  FS.fixGlyphs = function (root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const hits = []; let n;
    while ((n = w.nextNode())) if (/[≥→]/.test(n.nodeValue) && !n.parentElement.closest('svg')) hits.push(n);
    hits.forEach(n => {
      const sp = document.createElement('span');
      sp.innerHTML = n.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/≥/g, GE).replace(/→/g, AR);
      n.replaceWith(sp);
    });
  };
  window.FS = FS;
})();
