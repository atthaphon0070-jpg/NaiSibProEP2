// EP62 official quiz: four equal-priority one-line answer cards + reveal helpers.
// Before the answer narration starts, every card is drawn with the same style, size, colour and focus timing.
(function () {
  const { h, clamp, lerp, E, P, tf, life, ICON } = NSP;

  const QUESTION = 'ข้อใดเป็นหนังสือสั่งการครบทั้ง 3 ชนิด ตามระเบียบงานสารบรรณ?';
  const OPTIONS = [
    ['ก', ['คำสั่ง', 'ระเบียบ', 'ประกาศ']],
    ['ข', ['คำสั่ง', 'ข้อบังคับ', 'แถลงการณ์']],
    ['ค', ['ระเบียบ', 'ข้อบังคับ', 'ข่าว']],
    ['ง', ['คำสั่ง', 'ระเบียบ', 'ข้อบังคับ']],
  ];
  const CORRECT = 3;                 // ง.
  const TRAP = [2, 2, 2, -1];        // index of the public-information term in each wrong option
  const FOCUS = 3.2;                 // identical focus duration for every option while it is read

  function build(parent, { top = 745, gap = 100 } = {}) {
    return OPTIONS.map(([L, terms], i) => {
      const el = h(`<div class="qo c" style="top:${top + i * gap}px"><div class="ov"></div><div class="fx"></div>
        <div class="row"><div class="L">${L}</div><div class="T">${terms.map((w, j) => `<b>${w}</b>${j < 2 ? '<i>–</i>' : ''}`).join('')}</div></div>
        <div class="mk"></div></div>`);
      parent.appendChild(el);
      return { el, L, terms, ov: el.querySelector('.ov'), fx: el.querySelector('.fx'), Lb: el.querySelector('.L'), T: el.querySelector('.T'), words: [...el.querySelectorAll('.T b')], mk: el.querySelector('.mk'), y: top + i * gap };
    });
  }

  // u = quiz-local time; ua = answer-local time (negative before the answer narration)
  // optAt/termAt from BEATS.quiz; trapAt[i] = answer-local time option i's trap word is explained
  function draw(opts, u, ua, { optAt, termAt, trapAt = [], litAt = [], shiftY = 0, fade = 0 }) {
    const rev = ua >= 0;
    opts.forEach((o, i) => {
      const l = life(u, optAt[i], 1e9, { from: .5, dy: 0, d: .5 });
      const xIn = (1 - E.out(P(u, optAt[i], .5))) * (i % 2 ? 260 : -260);
      // neutral reading focus — same for all four options
      const fIn = P(u, optAt[i], .25), fOut = P(u, optAt[i] + FOCUS, .35);
      const focus = rev ? 0 : fIn * (1 - fOut);
      o.fx.style.opacity = focus;
      o.words.forEach((w, j) => {
        const wa = termAt[i][j], on = !rev && u >= wa && u < wa + .7;
        w.style.background = on ? 'rgba(255,210,63,.45)' : 'transparent';
      });
      if (!rev) {
        o.ov.style.opacity = 0; o.T.style.color = ''; o.Lb.style.background = ''; o.Lb.innerHTML = o.L; o.Lb.style.transform = ''; tf(o.mk, { o: 0 });
        o.words.forEach(w => { w.style.color = ''; w.style.textDecoration = ''; });
        o.el.style.boxShadow = ''; o.el.style.filter = '';
        tf(o.el, { ...l, x: xIn, y: shiftY, s: l.s * (1 + .03 * focus), o: l.o * (1 - fade) });
        return;
      }
      if (i === CORRECT) {
        const rp = P(ua, 0, .5);
        o.ov.style.opacity = clamp(ua / .25);
        o.T.style.color = '#fff'; o.T.querySelectorAll('i').forEach(x => x.style.color = 'rgba(255,255,255,.8)');
        o.Lb.style.background = 'radial-gradient(circle at 35% 30%,#BBF7D0,#16A34A 75%)';
        o.Lb.innerHTML = ICON.check('#fff', 40); o.Lb.style.transform = `scale(${E.elastic(P(ua, .1, .8))}) rotate(${(1 - E.out(P(ua, .1, .6))) * -90}deg)`;
        tf(o.mk, { o: 0 });
        o.el.style.boxShadow = `0 8px 0 #15803D,0 0 0 6px rgba(255,255,255,.9),0 0 ${40 + 14 * Math.sin(ua * 3)}px ${10 + 4 * Math.sin(ua * 3)}px rgba(34,197,94,.5)`;
        o.el.style.filter = '';
        tf(o.el, { x: 0, y: shiftY, s: (1 + .06 * E.back(rp) - .06 * P(ua, .5, .4)) * (1 + .01 * Math.sin(ua * 3.4)), o: 1 - fade });
      } else {
        // wrong options: dimmed at reveal, re-lit while their trap word is explained
        const ta = trapAt[i] ?? 1e9, la = litAt[i] ?? ta, k = P(ua, la - .2, .4);
        const dim = .45 * E.out(P(ua, 0, .45)) * (1 - k);
        o.ov.style.opacity = 0; o.T.style.color = '';
        o.el.style.filter = `grayscale(${dim * 1.5})`;
        o.el.style.boxShadow = k > 0 ? `0 8px 0 rgba(239,68,68,.35),0 0 0 ${5 * k}px #FF91BA` : '';
        o.words.forEach((w, j) => {
          const isTrap = j === TRAP[i] && ua >= ta;
          w.style.background = isTrap ? 'linear-gradient(180deg,#FFD6E6,#FF91BA)' : 'transparent';
          w.style.color = isTrap ? '#9E2F5C' : '';
        });
        // wrong mark goes on the letter badge so it never covers the (long) trap word
        const xOn = ua >= ta + .4;
        o.Lb.innerHTML = xOn ? ICON.cross('#fff', 34) : o.L;
        o.Lb.style.background = xOn ? 'radial-gradient(circle at 35% 30%,#FCA5A5,#EF4444 75%)' : '';
        o.Lb.style.transform = `scale(${xOn ? E.elastic(P(ua, ta + .4, .7)) : 1})`;
        tf(o.mk, { o: 0 });
        tf(o.el, { x: 0, y: shiftY, s: 1 - .04 * dim / .45 + .03 * Math.sin(P(ua, la - .2, .5) * Math.PI), o: (1 - dim) * (1 - fade) });
      }
    });
  }
  // scene-space centre of word j of option o (layout offsets, unaffected by transforms)
  function wordCentre(o, j) {
    const w = o.words[j], row = w.offsetParent;
    return { x: 232 + row.offsetLeft + w.offsetLeft + w.offsetWidth / 2, y: o.y + 46 };
  }
  window.QUIZ = { QUESTION, OPTIONS, CORRECT, TRAP, FOCUS, build, draw, wordCentre };
})();
