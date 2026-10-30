// NaiSibPro EP.32 — reusable Thai legal-hierarchy pyramid (educational overview).
// Four tiers, each one coherent object (shape + labels move together):
//   T1 gold  รัฐธรรมนูญ (กฎหมายสูงสุด)
//   T2 pink  พระราชบัญญัติประกอบรัฐธรรมนูญ
//   T3 blue  พ.ร.บ. = พ.ร.ก.  (same band, same card size, same height)
//   T4 navy  กฎหมายลำดับรอง: พ.ร.ฎ. · กฎกระทรวง · ข้อบัญญัติท้องถิ่น (grouped, no internal ranking)
// HIER.build(parent, { top, scale }) → { el, draw(state), box(name) }.
// state: { in:[4] 0..1 entrance, hl:[4] highlight, dim:[4], ghost 0..1 (dashed outlines),
//          pb, pk, eq 0..1 (Act / Emergency Decree cards and the equals sign),
//          sub:[3] 0..1 (example chips), auth 0..1 (ให้อำนาจ link T3→T4), scan -1..2 (light sweep), glow 0..1, q 0..1 ("?" on tiers) }
(function () {
  const { h, clamp, lerp, E, tf } = window.NSP;
  let uid = 0;
  const TIERS = [
    { y: 70, h: 140, w: 360, fill: ['#FFF1B8', '#F2C766', '#C99A3E'], stroke: '#FFE58A', glow: '255,210,63' },
    { y: 226, h: 140, w: 470, fill: ['#FFE3EE', '#F5A9C7', '#EE7FAA'], stroke: '#FFF', glow: '238,127,170' },
    { y: 382, h: 180, w: 580, fill: ['#DCEBFF', '#95BFEF', '#2F6BFF'], stroke: '#FFF', glow: '47,107,255' },
    { y: 578, h: 190, w: 640, fill: ['#2A4A80', '#1D3766', '#142B53'], stroke: '#22D3EE', glow: '34,211,238' },
  ];
  const SL = 34;   // side slant per tier
  function poly(t, id, dashed) {
    const w = t.w, hh = t.h;
    const d = `M${SL} 3 H${w - SL} L${w - 3} ${hh - 3} H3 Z`;
    return `<svg width="${w}" height="${hh}" viewBox="0 0 ${w} ${hh}" style="position:absolute;inset:0;overflow:visible">
      ${dashed ? `<path d="${d}" fill="rgba(255,255,255,.35)" stroke="#95BFEF" stroke-width="4" stroke-dasharray="14 10" stroke-linejoin="round"/>` : `
      <defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${t.fill[0]}"/><stop offset=".55" stop-color="${t.fill[1]}"/><stop offset="1" stop-color="${t.fill[2]}"/></linearGradient></defs>
      <path d="${d}" fill="url(#${id})" stroke="${t.stroke}" stroke-width="6" stroke-linejoin="round"/>
      <path d="M${SL + 10} 14 H${w - SL - 10}" stroke="rgba(255,255,255,.55)" stroke-width="6" stroke-linecap="round"/>`}</svg>`;
  }
  function build(parent, { top = 470, scale = 1 } = {}) {
    const root = h(`<div class="hier abs" style="left:0;top:${top}px;width:1080px;height:800px;transform-origin:540px 400px"></div>`);
    parent.appendChild(root);
    const rays = h(`<div class="abs c" style="left:340px;top:-110px;width:400px;height:400px;border-radius:50%;background:conic-gradient(from 0deg,rgba(255,210,63,0) 0deg,rgba(255,210,63,.55) 12deg,rgba(255,210,63,0) 24deg,rgba(255,210,63,0) 45deg,rgba(255,210,63,.5) 57deg,rgba(255,210,63,0) 69deg,rgba(255,210,63,0) 90deg,rgba(255,210,63,.55) 102deg,rgba(255,210,63,0) 114deg,rgba(255,210,63,0) 135deg,rgba(255,210,63,.5) 147deg,rgba(255,210,63,0) 159deg,rgba(255,210,63,0) 180deg,rgba(255,210,63,.55) 192deg,rgba(255,210,63,0) 204deg,rgba(255,210,63,0) 225deg,rgba(255,210,63,.5) 237deg,rgba(255,210,63,0) 249deg,rgba(255,210,63,0) 270deg,rgba(255,210,63,.55) 282deg,rgba(255,210,63,0) 294deg,rgba(255,210,63,0) 315deg,rgba(255,210,63,.5) 327deg,rgba(255,210,63,0) 339deg);-webkit-mask:radial-gradient(circle,#000 20%,transparent 70%);mask:radial-gradient(circle,#000 20%,transparent 70%)"></div>`);
    root.appendChild(rays);
    const ped = h(`<div class="abs c" style="left:180px;top:776px;width:720px;height:30px;border-radius:14px;background:linear-gradient(180deg,#FFFFFF,#DCE7F6);box-shadow:0 14px 26px rgba(20,43,83,.25),0 0 0 4px rgba(255,255,255,.8)"></div>`);
    root.appendChild(ped);
    const ghosts = TIERS.map(t => { const g = h(`<div class="abs" style="left:${540 - t.w / 2}px;top:${t.y}px;width:${t.w}px;height:${t.h}px">${poly(t, '', true)}</div>`); root.appendChild(g); return g; });
    const qs = TIERS.map(t => { const q = h(`<div class="abs c" style="left:${540 - 40}px;top:${t.y + t.h / 2 - 46}px;width:80px;height:92px;display:grid;place-items:center;font-weight:800;font-size:76px;color:#5E8FD6;text-shadow:0 4px 0 #fff">?</div>`); root.appendChild(q); return q; });
    const tiers = TIERS.map((t, i) => {
      const el = h(`<div class="ht c" style="position:absolute;left:${540 - t.w / 2}px;top:${t.y}px;width:${t.w}px;height:${t.h}px">${poly(t, 'hg' + (++uid), false)}<div class="lab" style="position:absolute;inset:0"></div></div>`);
      root.appendChild(el); return el;
    });
    const lab = i => tiers[i].querySelector('.lab');
    lab(0).innerHTML = `<div style="position:absolute;left:0;right:0;top:20px;text-align:center;font-weight:800;font-size:52px;line-height:1.25;color:#142B53;text-shadow:0 3px 0 rgba(255,255,255,.7)">รัฐธรรมนูญ</div>
      <div style="position:absolute;left:0;right:0;top:90px;display:flex;justify-content:center"><span style="font-weight:700;font-size:27px;line-height:1.3;color:#fff;background:#142B53;border-radius:20px;padding:2px 18px">กฎหมายสูงสุด</span></div>`;
    lab(1).innerHTML = `<div style="position:absolute;left:0;right:0;top:20px;text-align:center;font-weight:800;font-size:38px;line-height:1.3;color:#142B53;text-shadow:0 3px 0 rgba(255,255,255,.6)">พระราชบัญญัติ<br>ประกอบรัฐธรรมนูญ</div>`;
    const card = (cls, ab, full) => `<div class="${cls} c" style="position:absolute;top:26px;width:212px;height:128px;border-radius:26px;background:linear-gradient(180deg,#fff,#EEF5FF);box-shadow:0 10px 20px rgba(20,43,83,.25),0 0 0 4px #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1.25">
        <div style="font-weight:800;font-size:46px;color:#2F6BFF">${ab}</div><div style="font-weight:700;font-size:25px;color:#31445D">${full}</div></div>`;
    lab(2).innerHTML = `${card('pb', 'พ.ร.บ.', 'พระราชบัญญัติ')}${card('pk', 'พ.ร.ก.', 'พระราชกำหนด')}
      <div class="eq c" style="position:absolute;left:${290 - 34}px;top:56px;width:68px;height:68px;border-radius:50%;background:linear-gradient(135deg,#FFD23F,#F2B705);box-shadow:0 0 0 5px #fff,0 8px 16px rgba(20,43,83,.3);display:grid;place-items:center;font-weight:800;font-size:54px;line-height:1;color:#142B53;padding-bottom:6px">=</div>`;
    lab(2).querySelector('.pb').style.left = '42px'; lab(2).querySelector('.pk').style.left = (580 - 42 - 212) + 'px';
    lab(3).innerHTML = `<div style="position:absolute;left:0;right:0;top:44px;text-align:center;font-weight:800;font-size:42px;line-height:1.3;color:#fff">กฎหมาย<span style="color:#22D3EE">ลำดับรอง</span></div>
      <div style="position:absolute;left:0;right:0;top:118px;display:flex;justify-content:center;gap:12px">${['พ.ร.ฎ.', 'กฎกระทรวง', 'ข้อบัญญัติท้องถิ่น'].map((s, i) => `<span class="sub${i} c" style="font-weight:700;font-size:27px;line-height:1.35;color:#142B53;background:#E6FBFF;border-radius:18px;padding:3px 14px;box-shadow:0 0 0 3px #22D3EE">${s}</span>`).join('')}</div>`;
    const pb = root.querySelector('.pb'), pk = root.querySelector('.pk'), eq = root.querySelector('.eq');
    const subs = [0, 1, 2].map(i => root.querySelector('.sub' + i));
    const auth = h(`<div class="abs c" style="left:${540 - 92}px;top:548px;width:184px;height:46px;border-radius:23px;background:linear-gradient(90deg,#22D3EE,#2F6BFF);color:#fff;font-weight:800;font-size:27px;line-height:46px;text-align:center;box-shadow:0 0 0 4px #fff,0 8px 18px rgba(34,211,238,.5)">ให้อำนาจ ▼</div>`);
    auth.style.zIndex = 5;
    root.appendChild(auth);
    const scan = h(`<div class="abs" style="left:200px;top:0;width:680px;height:120px;background:linear-gradient(180deg,rgba(255,255,255,0),rgba(255,255,255,.75),rgba(255,255,255,0));mix-blend-mode:screen;pointer-events:none"></div>`);
    scan.style.zIndex = 6;
    root.appendChild(scan);
    const apex = h(`<svg class="abs c" style="left:500px;top:2px;overflow:visible" width="80" height="70" viewBox="0 0 80 70"><path d="M40 4 L52 34 L40 64 L28 34Z" fill="#FFD23F" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M8 36 L72 36" stroke="#FFD23F" stroke-width="4" stroke-linecap="round" opacity=".7"/></svg>`);
    root.appendChild(apex);

    function draw(s = {}) {
      tf(root, { s: scale * (s.zoom || 1), x: s.x || 0, y: s.y || 0, o: s.o ?? 1 });
      const ins = s.in || [0, 0, 0, 0], hl = s.hl || [0, 0, 0, 0], dim = s.dim || [0, 0, 0, 0];
      ghosts.forEach((g, i) => { g.style.opacity = (s.ghost || 0) * (1 - clamp(ins[i] * 3)); });
      qs.forEach((q, i) => tf(q, { o: (s.q || 0) * (1 - clamp(ins[i] * 3)), s: .8 + .2 * (s.q || 0) }));
      tiers.forEach((el, i) => {
        const p = clamp(ins[i]), e = E.back(p);
        const k = hl[i], d = dim[i] * (1 - k);
        tf(el, { y: (1 - E.out(p)) * -180, s: lerp(.7, 1, e) * (1 + .045 * k), o: clamp(p * 3) * (1 - .62 * d) });
        el.style.filter = `${d > .01 ? `saturate(${1 - .7 * d}) ` : ''}drop-shadow(0 ${10 + 6 * k}px ${14 + 18 * k}px rgba(${k > .01 ? TIERS[i].glow + ',' + (.25 + .45 * k) : '20,43,83,.22'}))`;
        el.style.zIndex = k > .5 ? 3 : 1;
      });
      tf(ped, { o: clamp((s.ped ?? (ins[3] || s.ghost || 0)) * 2), s: lerp(.8, 1, E.out(clamp(s.ped ?? 1))) });
      const g = s.glow ?? clamp(ins[0] * 2);
      tf(rays, { o: g * .9, r: (s.t || 0) * 12, s: .9 + .1 * Math.sin((s.t || 0) * 1.4) });
      tf(apex, { o: clamp(ins[0] * 2), s: E.back(clamp(ins[0])) * (1 + .06 * Math.sin((s.t || 0) * 3)), y: (1 - E.out(clamp(ins[0]))) * -120 });
      const cardIn = (el, v, dx) => tf(el, { o: clamp(v * 3), s: lerp(.5, 1, E.back(clamp(v))), x: (1 - E.out(clamp(v))) * dx });
      cardIn(pb, s.pb ?? 1, -60); cardIn(pk, s.pk ?? 1, 60);
      tf(eq, { o: clamp((s.eq || 0) * 3), s: E.elastic(clamp(s.eq || 0)) * (1 + .08 * Math.sin((s.t || 0) * 5) * clamp(s.eq || 0)) });
      const eqg = clamp(s.eq || 0);
      [pb, pk].forEach(c => { c.style.boxShadow = eqg > .01 ? `0 10px 20px rgba(20,43,83,.25),0 0 0 4px #fff,0 0 0 ${4 + 6 * eqg}px rgba(255,210,63,${.9 * eqg})` : ''; });
      subs.forEach((c, i) => tf(c, { o: clamp(((s.sub || [1, 1, 1])[i]) * 3), s: lerp(.4, 1, E.back(clamp((s.sub || [1, 1, 1])[i]))) }));
      const a = clamp(s.auth || 0);
      tf(auth, { o: clamp(a * 3), s: lerp(.4, 1, E.back(a)), y: Math.sin((s.t || 0) * 4) * 4 * a });
      const sc = s.scan ?? -1;
      scan.style.transform = `translateY(${lerp(-60, 760, clamp(sc))}px)`; scan.style.opacity = sc > 0 && sc < 1 ? Math.sin(sc * Math.PI) : 0;
    }
    // element bounds for the safe-zone report
    function parts() { return { tiers, pb, pk, eq, subs, auth }; }
    draw({});
    return { el: root, draw, parts };
  }
  window.HIER = { build, TIERS };
})();
