// EP52 — GrammarSentenceTransformer + DidVerbTransformation
// A sentence is a set of tokens laid out in rows. Two states (A = statement, C = question) give each token
// its row/order/text; draw(p) renders the transition deterministically for p in [0,1] (no wall-clock timing).
// Token kinds: aux (DID), subj, base (V1), past (V2), verb (V2→V1 flip card), time, rest, punct.
(function () {
  const { clamp, lerp, E, P, h } = window.NSP;
  const KIND_CSS = {
    aux: 'tk-aux', subj: 'tk-subj', verb: 'tk-verb', past: 'tk-past', base: 'tk-base', time: 'tk-time', rest: 'tk-rest', punct: 'tk-punct',
  };
  document.head.insertAdjacentHTML('beforeend', `<style>
    .gst{position:absolute}
    .gst .tk{position:absolute;left:0;top:0;white-space:nowrap;font-weight:800;line-height:1;transform-origin:50% 50%}
    .gst .tk-verb{perspective:6em}
    .gst .tk .face{position:absolute;left:0;top:0;display:flex;align-items:center;justify-content:center;border-radius:.32em;backface-visibility:hidden}
    .gst .tk-aux .face{color:#fff;background:linear-gradient(180deg,#FF91BA,#EE7FAA);box-shadow:0 .1em 0 #C95C89,0 .18em .3em rgba(238,127,170,.45),inset 0 .06em 0 rgba(255,255,255,.5)}
    .gst .tk-subj .face{color:#142B53;background:#E6F4FF;box-shadow:inset 0 0 0 .05em #95BFEF}
    .gst .tk-past .face,.gst .tk-verb .fa{color:#fff;background:linear-gradient(180deg,#F7A8C4,#E9709F);box-shadow:0 .1em 0 #C25A86,0 .16em .28em rgba(200,80,130,.35),inset 0 .06em 0 rgba(255,255,255,.5)}
    .gst .tk-base .face,.gst .tk-verb .fb{color:#fff;background:linear-gradient(180deg,#5C8DFF,#2F6BFF);box-shadow:0 .1em 0 #1F4FC4,0 .16em .28em rgba(47,107,255,.35),inset 0 .06em 0 rgba(255,255,255,.45)}
    .gst .tk-time .face{color:#142B53;background:#FFF3C4;box-shadow:inset 0 0 0 .05em #FFD23F}
    .gst .tk-rest .face{color:#31445D}
    .gst .tk-punct .face{color:#142B53}
    .gst .vlab{position:absolute;left:50%;top:100%;translate:-50% .32em;font-size:.4em;font-weight:800;padding:.1em .55em;border-radius:1em;color:#fff;white-space:nowrap}
    .gst .pastm{position:absolute;left:0;top:0;font-weight:800;font-size:.36em;color:#fff;background:#142B53;padding:.18em .6em;border-radius:1em;white-space:nowrap;box-shadow:0 0 0 .12em #FFD23F}
  </style>`);

  function measure(text, px) {
    const c = measure.c || (measure.c = document.createElement('canvas').getContext('2d'));
    c.font = `800 ${px}px Prompt`;
    return c.measureText(text).width;
  }

  // opts: { left, top, width (box, centered), font (px), maxW, lineH, tokens: {id:{kind, A:'text'|null, C:'text'|null, labA, labC}}, rowsA:[[ids]], rowsC:[[ids]], pastMarker:bool }
  function GrammarSentenceTransformer(parent, opts) {
    const box = h(`<div class="gst" style="left:${opts.left}px;top:${opts.top}px;width:${opts.width}px;height:10px"></div>`);
    parent.appendChild(box);
    const toks = {};
    for (const [id, t] of Object.entries(opts.tokens)) {
      const el = h(`<div class="tk ${KIND_CSS[t.kind]}" data-ess="1"></div>`);
      if (t.kind === 'verb') {
        el.innerHTML = `<div class="face fa">${t.A}</div><div class="face fb" style="transform:rotateX(180deg)">${t.C}</div>
          <div class="vlab la" style="background:#E9709F">${t.labA || 'V2'}</div><div class="vlab lb" style="background:#2F6BFF">${t.labC || 'V1'}</div>`;
      } else {
        el.innerHTML = `<div class="face fa">${t.A ?? t.C}</div>${t.C != null && t.A != null && t.C !== t.A ? `<div class="face fb">${t.C}</div>` : ''}`;
        if (t.lab) el.insertAdjacentHTML('beforeend', `<div class="vlab la" style="background:${t.labCol || '#2F6BFF'}">${t.lab}</div>`);
      }
      box.appendChild(el);
      toks[id] = { ...t, id, el, fa: el.querySelector('.fa'), fb: el.querySelector('.fb'), la: el.querySelector('.la'), lb: el.querySelector('.lb') };
    }
    const pm = opts.pastMarker ? h(`<div class="pastm">PAST</div>`) : null;
    if (pm) box.appendChild(pm);
    let L = null;
    function layout() {
      const base = 100;
      const padX = k => (k === 'rest' || k === 'punct') ? .04 : k === 'time' ? .16 : .24;
      const tw = (t, s) => { const tx = t[s] ?? t.A ?? t.C; return measure(tx, base) + 2 * padX(t.kind) * base; };
      const rowW = (rows, s) => rows.map(r => r.reduce((w, id, i) => w + tw(toks[id], s) + (i && toks[id].kind !== 'punct' ? .2 * base : 0), 0));
      const maxRow = Math.max(...rowW(opts.rowsA, 'A'), ...rowW(opts.rowsC, 'C'));
      const fs = Math.min(opts.font, base * opts.maxW / maxRow);
      const k = fs / base, lh = (opts.lineH || 1.75) * fs, H = 1.3 * fs;
      const pos = s => {
        const rows = s === 'A' ? opts.rowsA : opts.rowsC, out = {};
        rows.forEach((r, ri) => {
          const w = rowW([r], s)[0] * k; let x = (opts.width - w) / 2;
          r.forEach((id, i) => { const t = toks[id]; if (i && t.kind !== 'punct') x += .2 * fs; const ww = tw(t, s) * k; out[id] = { x, y: ri * lh, w: ww }; x += ww; });
        });
        return out;
      };
      L = { fs, H, A: pos('A'), C: pos('C'), lh };
      box.style.fontSize = fs + 'px';
      for (const t of Object.values(toks)) {
        t.el.style.height = H + 'px';
        [t.fa, t.fb].forEach((f, j) => { if (!f) return; f.style.height = H + 'px'; });
      }
    }
    // staged timing inside p: DID drops, subject swaps, verb flips, punctuation changes
    const ST = Object.assign({ did: [0, .3], subj: [.22, .3], move: [.3, .35], flip: [.42, .3], punct: [.7, .16], past: [.36, .34] }, opts.stages || {});
    function draw(p, { hl = 0, showLabels = 1, labelsC = 1 } = {}) {
      if (!L) layout();
      const S = (k) => P(p, ST[k][0], ST[k][1]);
      for (const t of Object.values(toks)) {
        const a = L.A[t.id], c = L.C[t.id];
        let x, y, o = 1, s = 1, rx = 0, w;
        if (a && c) {
          const q = E.inOut(t.kind === 'subj' ? S('subj') : S('move'));
          x = lerp(a.x, c.x, q); y = lerp(a.y, c.y, q) - (t.kind === 'subj' ? Math.sin(q * Math.PI) * L.fs * .9 : 0); w = lerp(a.w, c.w, q);
        } else if (c) {          // enters (DID)
          const q = S('did'); x = c.x; w = c.w; y = c.y - (1 - E.back(q)) * L.fs * 3.2; o = clamp(q * 3); s = lerp(1.6, 1, E.out(q));
        } else { x = a.x; y = a.y; w = a.w; o = 1 - S('did'); }
        if (t.kind === 'verb') {
          const f = E.inOut(S('flip')); rx = f * 180;
          t.fa.style.transform = `rotateX(${rx}deg)`; t.fb.style.transform = `rotateX(${rx - 180}deg)`;
          t.fa.style.width = w + 'px'; t.fb.style.width = w + 'px';
          s *= 1 + .1 * Math.sin(f * Math.PI);
          if (t.la) { t.la.style.opacity = showLabels * (1 - clamp(f * 2)); t.lb.style.opacity = showLabels * labelsC * clamp(f * 2 - 1); }
        } else {
          t.fa.style.width = w + 'px';
          if (t.fb) { t.fb.style.width = w + 'px'; const f = t.kind === 'punct' ? S('punct') : S('subj'); t.fa.style.opacity = 1 - f; t.fb.style.opacity = f; }
          if (t.la) t.la.style.opacity = showLabels;
        }
        if (t.kind === 'punct') s *= 1 + .6 * Math.sin(S('punct') * Math.PI);
        const glow = (t.kind === 'aux' || t.kind === 'verb') ? hl : 0;
        t.el.style.filter = glow ? `drop-shadow(0 0 ${18 * glow}px rgba(255,210,63,${.9 * glow}))` : '';
        t.el.style.transform = `translate(${x}px,${y}px) scale(${s * (1 + .06 * glow)})`;
        t.el.style.width = w + 'px';
        t.el.style.opacity = o; t.el.style.visibility = o < .01 ? 'hidden' : 'visible';
      }
      if (pm) {
        const q = S('past'), v = Object.values(toks).find(t => t.kind === 'verb'), d = Object.values(toks).find(t => t.kind === 'aux');
        const a = L.A[v.id], c = L.C[d.id], e = E.inOut(q);
        const x = lerp(a.x + a.w / 2, c.x + c.w / 2, e), y = lerp(a.y, c.y, e) - L.fs * .55 - Math.sin(e * Math.PI) * L.fs * 1.4;
        pm.style.transform = `translate(${x}px,${y}px) translate(-50%,-50%) scale(${.9 + .3 * Math.sin(e * Math.PI)})`;
        pm.style.opacity = q > 0 && q < 1 ? clamp(q * 6) * clamp((1 - q) * 6) : 0;
      }
    }
    return { box, draw, toks, layout: () => L || (layout(), L) };
  }

  // The signature EP52 animation: "He went to work yesterday."  →  "Did he go to work yesterday?"
  function DidVerbTransformation(parent, { left = 120, top = 0, width = 840, font = 92, maxW = 620, subj = ['He', 'he'], pastMarker = true, labels = true, rows3 = false, lineH = 1.75 } = {}) {
    return GrammarSentenceTransformer(parent, {
      left, top, width, font, maxW, pastMarker, lineH,
      tokens: {
        did: { kind: 'aux', A: null, C: 'Did' },
        s: { kind: 'subj', A: subj[0], C: subj[1] },
        v: { kind: 'verb', A: 'went', C: 'go', labA: labels ? 'V2' : '', labC: labels ? 'V1' : '' },
        r: { kind: 'rest', A: 'to work', C: 'to work' },
        y: { kind: 'time', A: 'yesterday', C: 'yesterday' },
        p: { kind: 'punct', A: '.', C: '?' },
      },
      rowsA: rows3 ? [['s', 'v'], ['r'], ['y', 'p']] : [['s', 'v'], ['r', 'y', 'p']],
      rowsC: rows3 ? [['did', 's', 'v'], ['r'], ['y', 'p']] : [['did', 's', 'v'], ['r', 'y', 'p']],
    });
  }
  window.GRAMMAR = { GrammarSentenceTransformer, DidVerbTransformation, measure };
})();
