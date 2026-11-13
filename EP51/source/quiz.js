// EP51 quiz: exact official question, four choices (2 × 2), neutral focus while the narrator reads
// each choice, a pink + blue dual countdown ring (exactly 150 frames at 30 fps), then the reveal.
// Before the reveal no choice is ever coloured green, ticked or filled into the blank.
(function () {
  const { h, clamp, lerp, E, P, tf, life } = window.NSP;
  const add = (p, html) => { const e = h(html); p.appendChild(e); return e; };

  const QUIZ = {
    stem: ['The police', '_____', 'looking for the suspect.'],
    th: 'ตำรวจกำลังตามหาผู้ต้องสงสัย',
    opts: [['ก.', 'is'], ['ข.', 'are'], ['ค.', 'am'], ['ง.', 'be']],
    correct: 1,
  };

  function buildQuestion(parent, { top }) {
    const el = add(parent, `<div class="card dual c" style="top:${top}px;padding:22px 20px 22px">
      <div class="qi th" style="font-size:30px;color:#2F6BFF" data-fit="600">จงเลือกคำที่ถูกต้องเติมลงในช่องว่าง</div>
      <div class="ql1 en" style="font-size:68px;line-height:1.25;margin-top:6px"><span class="qw0">The police</span> <span class="blank" style="min-width:2.9em"><span class="fill" style="opacity:0"><span class="vb ok" style="font-size:.92em;padding:0 .3em">are</span></span></span></div>
      <div class="ql2 en" style="font-size:54px;line-height:1.3" data-fit="600"><span class="qw2">looking for the suspect.</span></div>
      <div class="qth th" style="font-size:34px;margin-top:8px;color:#EE7FAA" data-fit="600">${QUIZ.th}</div></div>`);
    const q = s => el.querySelector(s);
    return { el, qi: q('.qi'), l1: q('.ql1'), l2: q('.ql2'), th: q('.qth'), blank: q('.blank'), fill: q('.fill') };
  }

  // 2 × 2 option grid inside x 220–860
  function buildOptions(parent, { top, gapY = 142 }) {
    return QUIZ.opts.map(([k, tx], i) => {
      const x = i % 2 ? 552 : 228, y = top + Math.floor(i / 2) * gapY;
      const el = add(parent, `<div class="qo ${i % 3 === 0 ? 'p' : 'b'} c" style="left:${x}px;top:${y}px"><div class="foc"></div><div class="ov"></div><div class="k">${k.replace('.', '')}</div><div class="tx">${k} ${tx}</div><div class="chk">${CHAR.ICO.check(44, '#16A34A')}</div></div>`);
      return { el, foc: el.querySelector('.foc'), ov: el.querySelector('.ov'), tx: el.querySelector('.tx'), k: el.querySelector('.k'), chk: el.querySelector('.chk'), cx: x + 150, cy: y + 61 };
    });
  }
  // u: quiz-local; at[i]: when the narrator reads choice i; ua: answer-local (<0 before the reveal)
  function drawOptions(O, u, at, ua, { hideAt = 1e9, focusEnd = 1e9 } = {}) {
    O.forEach((o, i) => {
      const l = life(u, at[i] - .15, 1e9, { from: .4, dy: 0, d: .5 });
      const x = (1 - E.out(P(u, at[i] - .15, .5))) * (i % 2 ? 260 : -260);
      // neutral focus while that choice is read (same yellow ring for every choice, never green)
      const fEnd = Math.min(i < 3 ? at[i + 1] - .1 : at[i] + 1.6, focusEnd);
      const f = ua < 0 ? clamp((u - at[i]) / .15) * (1 - clamp((u - fEnd) / .25)) : 0;
      o.foc.style.opacity = f;
      const ho = 1 - clamp((ua - hideAt) / .4);
      if (ua >= 0 && i === QUIZ.correct) {
        const rp = E.back(P(ua, 0, .5));
        o.ov.style.opacity = clamp(ua / .25); o.tx.style.color = '#fff';
        o.k.style.background = 'radial-gradient(circle at 35% 30%,#9CF2C6,#16A34A 75%)';
        tf(o.chk, { s: lerp(0, 1, E.elastic(P(ua, .1, .8))), o: clamp(ua / .1), r: (1 - E.out(P(ua, .1, .6))) * -90 });
        o.el.style.boxShadow = `0 9px 0 #15803D,0 0 0 6px rgba(255,255,255,.95),0 0 ${40 + 14 * Math.sin(ua * 3)}px ${10 + 4 * Math.sin(ua * 3)}px rgba(34,197,94,.55)`;
        tf(o.el, { ...l, x, o: l.o * ho, s: l.s * (1 + .06 * rp - .06 * P(ua, .5, .4)) * (1 + .012 * Math.sin(ua * 3.4)) });
        o.el.style.filter = '';
      } else {
        o.ov.style.opacity = 0; o.tx.style.color = ''; o.k.style.background = ''; o.el.style.boxShadow = '';
        tf(o.chk, { o: 0 });
        const dim = ua >= 0 ? .45 * E.out(P(ua, 0, .45)) : 0;
        tf(o.el, { ...l, x, o: l.o * (1 - dim) * ho, s: l.s * (1 + .03 * f) * (1 - .06 * dim / .45) });
        o.el.style.filter = ua >= 0 ? `grayscale(${dim * 1.8})` : '';
      }
    });
  }

  // dual-colour countdown ring: pink half + blue half (hard stop), number in navy
  function buildCountdown(parent, { top, size = 280 }) {
    const r = size * .38, C = 2 * Math.PI * r, c = size / 2;
    const el = add(parent, `<div class="abs c" style="left:${540 - size / 2}px;top:${top}px;width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" style="position:absolute;inset:0;overflow:visible">
        <defs><linearGradient id="cdpb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#EE7FAA"/><stop offset=".5" stop-color="#FF91BA"/><stop offset=".5" stop-color="#2F6BFF"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>
        <circle cx="${c}" cy="${c}" r="${size * .47}" fill="#fff" stroke="#fff" stroke-width="10"/>
        <circle class="halo" cx="${c}" cy="${c}" r="${size * .47}" fill="none" stroke="url(#cdpb)" stroke-width="5" opacity=".5"/>
        <circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="#EEE6F3" stroke-width="${size * .075}"/>
        <circle class="ring" cx="${c}" cy="${c}" r="${r}" fill="none" stroke="url(#cdpb)" stroke-width="${size * .075}" stroke-linecap="round" stroke-dasharray="${C}" stroke-dashoffset="0" transform="rotate(-90 ${c} ${c})"/>
        <circle class="dot" cx="${c}" cy="${c - r}" r="${size * .055}" fill="#fff" stroke="#142B53" stroke-width="${size * .02}"/></svg>
      <div class="num" style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:${size * .46}px;color:#142B53;line-height:1;padding-top:${size * .03}px"></div></div>`);
    return { el, ring: el.querySelector('.ring'), dot: el.querySelector('.dot'), num: el.querySelector('.num'), halo: el.querySelector('.halo'), r, C, c };
  }
  // f: countdown-local frame (0..149 visible), fps 30
  function drawCountdown(cd, f, fps = 30, frames = 150) {
    const uc = f / fps, dur = frames / fps;
    const vis = f >= 0 && f < frames;
    const l = life(uc, 0, dur - .001, { from: .3, dy: 40, d: .4, out: .001 });
    if (!vis) { tf(cd.el, { o: 0 }); return; }
    const k = f % fps, fr = k / fps;
    tf(cd.el, { ...l, s: l.s * (1 + .06 * Math.max(0, 1 - fr / .25)) });
    cd.num.textContent = 5 - Math.floor(f / fps);   // 5,4,3,2,1 — each exactly 30 frames
    cd.num.style.transform = `scale(${lerp(1.45, 1, E.back(clamp(fr / .35)))})`;
    const prog = clamp(f / frames);
    cd.ring.setAttribute('stroke-dashoffset', cd.C * prog);
    const ang = -Math.PI / 2 + (1 - prog) * Math.PI * 2;
    cd.dot.setAttribute('cx', cd.c + cd.r * Math.cos(ang)); cd.dot.setAttribute('cy', cd.c + cd.r * Math.sin(ang));
    cd.halo.setAttribute('transform', `rotate(${f * 4} ${cd.c} ${cd.c})`);
  }

  window.QZ = { QUIZ, buildQuestion, buildOptions, drawOptions, buildCountdown, drawCountdown };
})();
