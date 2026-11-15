// EP52 official quiz + exact 150-frame countdown + answer reveal.
// Rules enforced here: before the answer audio starts, every option has identical styling (only the option being
// read gets a short neutral cyan focus ring), the blank stays empty and no tick/check is drawn.
(function () {
  const { clamp, lerp, E, P, tf, life, h, ICON } = window.NSP;
  document.head.insertAdjacentHTML('beforeend', `<style>
    .qz-card{position:absolute;left:150px;width:780px;top:560px;padding:30px 30px 34px;border-radius:44px;background:linear-gradient(180deg,#fff,#F8FBFF);text-align:center;
      box-shadow:0 20px 44px rgba(20,43,83,.16),0 0 0 6px #fff,0 0 0 13px rgba(149,191,239,.8),0 0 0 19px rgba(247,168,196,.55)}
    .qz-card .ln{font-weight:800;font-size:48px;line-height:1.38;color:#142B53;white-space:nowrap}
    .qz-blank{display:inline-block;position:relative;width:120px;height:1.1em;vertical-align:-.12em;margin:0 .1em}
    .qz-blank .bl{position:absolute;left:6px;right:6px;bottom:2px;height:8px;border-radius:4px;background:#142B53}
    .qz-blank .fill{position:absolute;left:0;right:0;top:-.04em;text-align:center;color:#fff;border-radius:.25em;background:linear-gradient(180deg,#5C8DFF,#2F6BFF);opacity:0}
    .qz-th{position:absolute;left:0;width:1080px;top:842px;text-align:center;font-weight:700;font-size:35px;color:#31445D}
    .qz-opt{position:absolute;width:306px;height:118px;border-radius:40px;display:flex;align-items:center;gap:20px;padding:0 22px;font-weight:800;font-size:52px;color:#142B53}
    .qz-opt.pk{background:linear-gradient(180deg,#FFF0F6,#FFE3EF);box-shadow:0 10px 0 rgba(238,127,170,.35),0 16px 28px rgba(20,43,83,.12),0 0 0 5px #fff}
    .qz-opt.bl{background:linear-gradient(180deg,#F2F9FF,#E6F4FF);box-shadow:0 10px 0 rgba(149,191,239,.5),0 16px 28px rgba(20,43,83,.12),0 0 0 5px #fff}
    .qz-opt .k{width:76px;height:76px;flex:none;border-radius:50%;display:grid;place-items:center;font-size:42px;color:#fff}
    .qz-opt.pk .k{background:radial-gradient(circle at 35% 30%,#FFB3CF,#EE7FAA 70%)}
    .qz-opt.bl .k{background:radial-gradient(circle at 35% 30%,#9CC0FF,#2F6BFF 70%)}
    .qz-opt .ring{position:absolute;inset:-12px;border-radius:50px;border:7px solid #22D3EE;opacity:0}
    .qz-opt .ok{position:absolute;inset:0;border-radius:40px;background:linear-gradient(180deg,#4ADE80,#22C55E);opacity:0}
    .qz-opt .ck{position:absolute;right:-22px;top:-22px;width:70px;height:70px;border-radius:50%;background:#fff;display:grid;place-items:center;box-shadow:0 6px 14px rgba(20,43,83,.25);opacity:0}
    .qz-opt .tx,.qz-opt .k{position:relative}
    .cd{position:absolute;left:420px;top:1176px;width:240px;height:240px}
    .cd .n{position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:118px;color:#142B53;line-height:1;padding-top:8px}
  </style>`);

  // layout: header 360–470, question 560–(~760), Thai 842, options 900–1160, countdown 1176–1416
  function build(scene) {
    scene.insertAdjacentHTML('beforeend', `
      <div class="row c qz-h1" style="top:368px"><div class="chip pink" data-ess="1" style="font-size:46px;padding:12px 36px">เตรียมสอบนายสิบตำรวจ</div></div>
      <div class="row c qz-h2" style="top:462px"><div class="chip blue" data-ess="1" style="font-size:34px;padding:8px 30px;letter-spacing:2px">ENGLISH GRAMMAR</div></div>
      <div class="qz-card c"><div class="ln" data-ess="1">Did the police officer</div><div class="ln" data-ess="1"><span class="qz-blank"><span class="bl"></span><span class="fill">go</span></span> to work yesterday?</div></div>
      <div class="qz-th c" data-ess="1">เมื่อวานเจ้าหน้าที่ตำรวจไปทำงานหรือไม่?</div>`);
    const OPTS = [['ก', 'go'], ['ข', 'went'], ['ค', 'goes'], ['ง', 'going']];
    const opts = OPTS.map(([k, tx], i) => {
      const x = i % 2 ? 554 : 220, y = i < 2 ? 912 : 1050;
      const el = h(`<div class="qz-opt c ${i === 0 || i === 3 ? 'pk' : 'bl'}" style="left:${x}px;top:${y}px"><div class="ok"></div><div class="ring"></div><div class="k" data-ess="1">${k}</div><div class="tx" data-ess="1">${k}. ${tx}</div><div class="ck">${ICON.check('#22C55E', 48)}</div></div>`);
      // show "ก. go" as text; the round key shows the Thai letter alone
      el.querySelector('.tx').textContent = tx; el.querySelector('.tx').insertAdjacentHTML('afterbegin', '');
      scene.appendChild(el);
      return { el, ring: el.querySelector('.ring'), ok: el.querySelector('.ok'), ck: el.querySelector('.ck'), tx: el.querySelector('.tx'), k: el.querySelector('.k') };
    });
    const cd = h(`<div class="cd c"><svg width="240" height="240" viewBox="0 0 240 240" style="position:absolute;inset:0">
        <defs><linearGradient id="cdpb" x1="0" y1="0" x2="1" y2="0"><stop offset=".5" stop-color="#EE7FAA"/><stop offset=".5" stop-color="#2F6BFF"/></linearGradient></defs>
        <circle cx="120" cy="120" r="112" fill="#fff"/>
        <circle cx="120" cy="120" r="94" fill="none" stroke="#EEF2FA" stroke-width="18"/>
        <circle class="arc" cx="120" cy="120" r="94" fill="none" stroke="url(#cdpb)" stroke-width="18" stroke-linecap="round" stroke-dasharray="590.6" transform="rotate(-90 120 120)"/>
        <circle class="dot" cx="120" cy="26" r="13" fill="#fff" stroke="#142B53" stroke-width="5"/></svg><div class="n" data-ess="1">5</div></div>`);
    scene.appendChild(cd);
    const q = s => scene.querySelector(s);
    return { opts, cd, arc: cd.querySelector('.arc'), dot: cd.querySelector('.dot'), num: cd.querySelector('.n'), h1: q('.qz-h1'), h2: q('.qz-h2'), card: q('.qz-card'), th: q('.qz-th'), fill: q('.fill'), blank: q('.qz-blank') };
  }

  // u: quiz-local seconds; k: countdown frame index (0..149 during the countdown, <0 before, >=150 after); ua: answer-local seconds (<0 before)
  function draw(Q, u, k, ua, B, { leaveAt = 1e9 } = {}) {
    tf(Q.h1, life(u, B.hdr, leaveAt, { from: .5, dy: 40 }));
    tf(Q.h2, life(u, B.hdr + .25, leaveAt, { from: .5, dy: 40 }));
    tf(Q.card, life(u, B.q - .15, leaveAt, { from: .6, dy: 60 }));
    tf(Q.th, life(u, B.th, leaveAt, { from: .7, dy: 30 }));
    const rev = ua >= 0;
    Q.opts.forEach((o, i) => {
      const l = life(u, B.opts[i] - .1, leaveAt, { from: .4, dy: 50 });
      // neutral focus while the narrator reads this option (identical treatment for every option)
      const f = !rev ? clamp((u - B.opts[i]) / .15) * (1 - clamp((u - B.optsEnd[i] - .25) / .25)) : 0;
      o.ring.style.opacity = f;
      if (rev && i === 0) {
        const r = E.back(P(ua, 0, .5));
        o.ok.style.opacity = clamp(.35 + ua / .2); o.tx.style.color = '#fff';
        tf(o.ck, { s: E.elastic(P(ua, .1, .8)), o: clamp(ua / .1) });
        tf(o.el, { ...l, s: l.s * (1 + .08 * r - .03 * P(ua, .6, .4)) });
        o.el.style.filter = ''; o.el.style.zIndex = 2;
      } else {
        o.ok.style.opacity = 0; o.tx.style.color = ''; tf(o.ck, { o: 0 });
        const dim = rev ? .5 * E.out(P(ua, 0, .4)) : 0;
        tf(o.el, { ...l, s: l.s * (1 + .05 * f), o: l.o * (1 - dim) });
        o.el.style.filter = dim ? `grayscale(${dim * 1.6})` : ''; o.el.style.zIndex = '';
      }
    });
    // countdown: exactly 150 frames, 30 per numeral
    const on = k >= 0 && k < 150;
    const ci = life(k / 30, 0, 5, { from: .3, dy: 30, d: .35, out: .2 });
    tf(Q.cd, on ? { ...ci, o: 1, s: ci.s } : { o: 0 });
    if (on) {
      const n = 5 - Math.floor(k / 30), fr = (k % 30) / 30;
      Q.num.textContent = n;
      Q.num.style.transform = `scale(${lerp(1.5, 1, E.back(clamp(fr / .35)))})`;
      const prog = (k + 1) / 150;
      Q.arc.setAttribute('stroke-dashoffset', 590.6 * prog);
      const ang = -Math.PI / 2 + (1 - prog) * Math.PI * 2;
      Q.dot.setAttribute('cx', 120 + 94 * Math.cos(ang)); Q.dot.setAttribute('cy', 120 + 94 * Math.sin(ang));
    }
  }
  window.QUIZ = { build, draw };
})();
