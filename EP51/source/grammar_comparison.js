// EP51 grammar graphics: kinetic sentences, comparison panels and the reusable
// GrammarComparisonAnimation (one officer + singular subject + IS  →  group + plural subject + ARE).
// The component teaches subject–verb agreement only; it never suggests "add S to the noun".
(function () {
  const { h, clamp, lerp, E, P, tf, life, bob } = window.NSP;
  const add = (p, html) => { const e = h(html); p.appendChild(e); return e; };

  // ---------------------------------------------------------------- kinetic sentence
  // words: ['A', 'police', {t:'officer', ul:'#2F6BFF'}, {t:'is', verb:'is'}, ...]
  //   verb: 'is' | 'are' | 'ok' | 'yl' → coloured verb pill;  ul: colour of an underline drawn under the word
  //   blank: true → an empty answer slot (with .fill for the reveal)
  function sentence(parent, { top, size = 56, words, left = 220, width = 640, th = null, thSize = 32, thColor = '#31445D' }) {
    const el = add(parent, `<div class="sent c" style="top:${top}px;left:${left}px;width:${width}px;font-size:${size}px"></div>`);
    const ws = words.map(w => {
      const o = typeof w === 'string' ? { t: w } : w;
      let inner;
      if (o.blank) inner = `<span class="blank"><span class="fill"></span></span>`;
      else if (o.verb) inner = `<span class="vb ${o.verb}">${o.t}</span>`;
      else inner = o.t;
      const s = add(el, `<span class="w">${o.hl ? `<span class="hl" style="background:${o.hl}"></span>` : ''}${inner}${o.ul ? `<span class="ul" style="background:${o.ul}"></span>` : ''}</span>`);
      return { el: s, o, ul: s.querySelector('.ul'), hl: s.querySelector('.hl'), fill: s.querySelector('.fill'), blank: s.querySelector('.blank') };
    });
    let thEl = null;
    if (th) thEl = add(el, `<div class="th" style="flex-basis:100%;text-align:center;font-size:${thSize}px;color:${thColor};margin-top:10px;font-weight:700" data-fit="${width}">${th}</div>`);
    return { el, ws, th: thEl };
  }
  // words pop in one after another from `at`; underlines draw at ulAt; highlight sweeps at hlAt
  function drawSentence(S, u, at, { step = .14, out = 1e9, ulAt = null, hlAt = null, thAt = null } = {}) {
    S.ws.forEach((w, i) => {
      const a = at + i * step;
      const l = life(u, a, out, { from: .3, dy: 36, d: .45, out: .3 });
      tf(w.el, { ...l, r: (1 - E.out(P(u, a, .45))) * (i % 2 ? 6 : -6) });
      if (w.ul) { w.ul.style.transform = `scaleX(${ulAt == null ? 0 : E.out(P(u, ulAt + i * .05, .4))})`; }
      if (w.hl) { w.hl.style.transform = `scaleX(${hlAt == null ? 0 : E.out(P(u, hlAt, .45))})`; }
    });
    if (S.th) tf(S.th, life(u, thAt ?? 1e9, out, { from: .7, dy: 20, d: .45 }));
  }

  // ---------------------------------------------------------------- comparison panel
  // theme 'blue' (one officer) | 'pink' (the police / several officers)
  function panel(parent, { left, top, w = 310, hgt = 560, theme = 'blue', head, subj, verb, foot = '', looks = [], scale = .6, subjSize = 34 }) {
    const el = add(parent, `<div class="pnl ${theme} c" style="left:${left}px;top:${top}px;width:${w}px;height:${hgt}px">
      <div class="ph" data-fit="${w - 20}">${head}</div>
      <div class="pstage" style="position:absolute;left:0;top:64px;width:${w}px;height:${hgt - 300}px"></div>
      <div style="position:absolute;left:0;right:0;bottom:22px;display:flex;flex-direction:column;align-items:center;gap:6px">
        <div class="en ps" style="font-size:${subjSize}px" data-fit="${w - 24}">${subj}</div>
        <div class="pv">${verb}</div>
        ${foot ? `<div class="pnt pf" data-fit="${w - 24}">${foot}</div>` : ''}
      </div></div>`);
    const st = el.querySelector('.pstage');
    const n = looks.length, floor = hgt - 300 - 6;
    const actors = looks.map((k, i) => {
      const a = CHAR.officer(k, { scale }); st.appendChild(a.el);
      a.px = n === 1 ? w / 2 : lerp(w * .24, w * .76, i / (n - 1)); a.py = floor - (n > 1 && i % 2 ? 0 : 0); return a;
    });
    return { el, actors, pv: el.querySelector('.pv'), ps: el.querySelector('.ps'), pf: el.querySelector('.pf') };
  }
  function drawPanel(Pn, u, a, b = 1e9, { t = 0, pulseAt = [], frozen = null, expr = 'smile' } = {}) {
    const l = life(u, a, b, { from: .5, dy: 60, d: .6, out: .35 });
    let pulse = 0; pulseAt.forEach(p => { pulse = Math.max(pulse, Math.max(0, 1 - Math.abs(u - p - .25) / .35)); });
    tf(Pn.el, { ...l, s: l.s * (1 + .06 * pulse) });
    Pn.pv.style.transform = `scale(${1 + .25 * pulse})`;
    const tt = frozen ?? t;
    Pn.actors.forEach((ac, i) => ac.set({ x: ac.px, y: ac.py, t: tt + i * .7, expr: pulse > .3 ? 'happy' : expr, armR: pulse > .2 ? 120 : 6, foreR: pulse > .2 ? 40 : 6, o: 1 }));
  }

  // ---------------------------------------------------------------- GrammarComparisonAnimation
  // States (local times T[0..5]):
  //  1 one officer appears · 2 subject A appears · 3 verb A enters
  //  4 the view changes to a group · 5 subject B appears · 6 verb changes A → B (IS → ARE)
  // opts: { stageY (feet line), top (sentence card top), A:{words, th, verbIdx}, B:{...}, main:'A', extra:['B'], xs, xg, scale, count: [txtA, txtB] }
  function GrammarComparisonAnimation(parent, opts) {
    const root = add(parent, `<div class="abs" style="left:0;top:0;width:1080px;height:1920px"></div>`);
    const card = add(root, `<div class="card dual c" style="top:${opts.top}px;height:${opts.cardH || 250}px"></div>`);
    const SA = sentence(root, { top: opts.top + 26, size: opts.size || 54, words: opts.A.words, th: opts.A.th });
    const SB = sentence(root, { top: opts.top + 26, size: opts.size || 54, words: opts.B.words, th: opts.B.th });
    const vA = SB.ws[opts.B.verbIdx];   // in sentence B the verb first shows A's verb, then flips
    const realB = vA.el.querySelector('.vb');
    vA.el.style.position = 'relative';
    const flipA = h(`<span class="vb ${opts.A.verbCls}" style="position:absolute;left:50%;top:0;transform:translateX(-50%)">${opts.A.verbTxt}</span>`);
    vA.el.appendChild(flipA);
    const main = CHAR.officer(opts.main || 'A', { scale: opts.scale || 1 }); root.appendChild(main.el);
    const others = (opts.extra || []).map(k => { const a = CHAR.officer(k, { scale: opts.scale || 1 }); root.appendChild(a.el); return a; });
    const cntA = add(root, `<div class="row" style="top:${opts.countY}px"><div class="chip bl" style="font-size:34px">${CHAR.person(44, '#fff')}${opts.count[0]}</div></div>`);
    const cntB = add(root, `<div class="row" style="top:${opts.countY}px"><div class="chip pk" style="font-size:34px">${opts.extra.map(() => CHAR.person(44, '#fff')).join('')}${CHAR.person(44, '#fff')}${opts.count[1]}</div></div>`);
    function draw(u, T, { out = 1e9, gesture = {} } = {}) {
      tf(root, { o: 1 - clamp((u - out) / .35) });
      tf(card, life(u, T[1] - .3, 1e9, { from: .8, dy: 30, d: .5 }));
      // state 1 + 4: characters
      const walkIn = (a, x0, x1, d = 1.3) => { const k = P(u, a, d); return { x: lerp(x0, x1, E.inOut(k)), walk: k > 0 && k < 1 ? (u - a) * 9 : null }; };
      const mx0 = opts.xs, mx1 = opts.xg[0];
      const m1 = walkIn(T[0], -160, mx0, 1.3);
      const m2 = P(u, T[3], 1.0);
      const mx = u < T[3] ? m1.x : lerp(mx0, mx1, E.inOut(m2));
      const mw = u < T[3] ? m1.walk : (m2 > 0 && m2 < 1 ? (u - T[3]) * 9 : null);
      main.set({ x: mx, y: opts.stageY, t: u, walk: mw, expr: gesture.mainExpr ? gesture.mainExpr(u) : 'smile', ...(gesture.main ? gesture.main(u) : {}) });
      others.forEach((a, i) => {
        const w = walkIn(T[3] + .1 + i * .25, 1240 + i * 80, opts.xg[i + 1], 1.4);
        a.set({ x: w.x, y: opts.stageY, t: u + i, walk: w.walk, flip: w.walk != null, o: u > T[3] ? 1 : 0, expr: 'smile', ...(gesture.other ? gesture.other(u, i) : {}) });
      });
      // states 2-3: sentence A (subject words, then the verb drops in)
      const swapOut = T[4] - .1;
      SA.ws.forEach((w, i) => {
        const isVerb = i === opts.A.verbIdx, isRest = i > opts.A.verbIdx;
        const a = isVerb ? T[2] : isRest ? T[2] + .25 + (i - opts.A.verbIdx) * .1 : T[1] + i * .12;
        const l = life(u, a, swapOut, { from: isVerb ? .2 : .4, dy: isVerb ? -90 : 30, d: isVerb ? .6 : .45, out: .3, el: isVerb });
        tf(w.el, l);
        if (w.ul) w.ul.style.transform = `scaleX(${E.out(P(u, T[1] + .4, .4))})`;
      });
      if (SA.th) tf(SA.th, life(u, opts.A.thAt ?? (T[2] + .8), swapOut, { from: .7, dy: 16 }));
      // states 5-6: sentence B (subject words, verb shows A's verb then flips to B's)
      SB.ws.forEach((w, i) => {
        const isVerb = i === opts.B.verbIdx, isRest = i > opts.B.verbIdx;
        const a = isVerb || isRest ? T[4] + .05 + (isRest ? (i - opts.B.verbIdx) * .08 : 0) : T[4] + i * .12;
        tf(w.el, life(u, a, out, { from: .4, dy: 30, d: .45, out: .3 }));
        if (w.ul) w.ul.style.transform = `scaleX(${E.out(P(u, T[4] + .4, .4))})`;
      });
      const fp = P(u, T[5], .5);
      realB.style.transform = `perspective(400px) rotateX(${(1 - E.back(clamp(fp * 2 - 1))) * 90}deg)`; realB.style.opacity = fp >= .5 ? 1 : 0;
      flipA.style.transform = `translateX(-50%) perspective(400px) rotateX(${-E.in(clamp(fp * 2)) * 90}deg)`; flipA.style.opacity = fp < .5 ? 1 : 0;
      if (SB.th) tf(SB.th, life(u, opts.B.thAt ?? (T[5] + .8), out, { from: .7, dy: 16 }));
      tf(cntA, life(u, T[0] + .8, T[3], { from: .4, dy: 20, el: true, d: .7 }));
      tf(cntB, life(u, T[3] + 1.2, out, { from: .4, dy: 20, el: true, d: .7 }));
    }
    return { root, draw, SA, SB, main, others };
  }

  window.GC = { sentence, drawSentence, panel, drawPanel, GrammarComparisonAnimation };
})();
