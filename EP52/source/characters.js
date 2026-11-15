// EP52 characters + environments (Classic 2D / 2.5D, original artwork).
// - Officer: shared rig look 'P' (props_story.js) — the same officer is used in every scene.
// - World: one panorama (4400 × 1920) with three locations — A home (x≈200–1100), B road (1100–3200), C police station (3250–4300) —
//   drawn in parallax layers and filmed by camera(cx, cy, z, t, dof). The DOM node is re-parented into whichever scene shows it.
// - Calendar flip prop, comment bubbles, small icons.
(function () {
  const { clamp, lerp, E, P, h, bob } = window.NSP;
  const S = window.STORY;
  const PINK = '#EE7FAA', PINK2 = '#F7A8C4', ROSE = '#FF91BA', BLUSH = '#FFE3EF', BLUE = '#2F6BFF', SKY = '#95BFEF', CYAN = '#22D3EE', ICE = '#E6F4FF', NAVY = '#142B53';

  function world() {
    const root = h(`<div class="world" style="position:absolute;inset:0;overflow:hidden"></div>`);
    const layer = (p, html) => { const el = h(`<div style="position:absolute;left:0;top:0;width:4400px;height:1920px;transform-origin:0 0">${html}</div>`); el.p = p; root.appendChild(el); return el; };
    // sky: diagonal 50:50 pink / blue
    root.appendChild(h(`<div style="position:absolute;inset:0;background:linear-gradient(112deg,#FFC9DE 0%,#FFE3EF 40%,#FDEAF4 47%,#E3F1FF 48%,#C9E2FF 62%,#A9CDF7 100%)">
      <div class="sun" style="position:absolute;left:640px;top:180px;width:320px;height:320px;border-radius:50%;background:radial-gradient(circle,#FFF6DA 0%,#FFE7B3 45%,rgba(255,231,179,0) 72%)"></div></div>`));
    const cloud = (x, y, s, c = '#fff') => `<div style="position:absolute;left:${x}px;top:${y}px;width:${300 * s}px;height:${92 * s}px;border-radius:60px;background:${c};opacity:.92;box-shadow:${66 * s}px -${34 * s}px 0 -${6 * s}px ${c},-${54 * s}px -${18 * s}px 0 -${14 * s}px ${c},0 ${12 * s}px 24px rgba(149,191,239,.25)"></div>`;
    const clouds = layer(.12, [[100, 300, 1], [800, 210, .8], [1500, 340, 1.1], [2300, 240, .9], [3100, 320, 1], [3900, 220, .85], [4600, 300, 1]].map(([x, y, s], i) => cloud(x, y, s, i % 2 ? '#FFFFFF' : '#FFF4FA')).join(''));
    // far hills (pink + blue alternating) and skyline
    const far = layer(.32, `<svg width="4400" height="1920" style="position:absolute;left:0;top:0"><path d="M0 1060 Q300 880 640 1010 T1300 990 T2000 1000 T2700 980 T3400 1000 T4400 990 V1300 H0Z" fill="#F9CFE0"/>
      <path d="M0 1120 Q420 980 860 1090 T1700 1080 T2600 1070 T3500 1090 T4400 1070 V1300 H0Z" fill="#CFE3FA"/></svg>
      ${[...Array(22)].map((_, i) => { const w = 120 + (i * 53) % 90, hh = 160 + (i * 97) % 200; return `<div style="position:absolute;left:${i * 205 + 20}px;top:${1130 - hh}px;width:${w}px;height:${hh + 40}px;border-radius:14px 14px 0 0;background:${i % 2 ? '#F3D3E6' : '#D6E6FA'};opacity:.85"></div>`; }).join('')}`);
    // ---- location A: home
    const home = `<div style="position:absolute;left:260px;top:690px;width:700px;height:520px">
        <div style="position:absolute;left:40px;top:150px;width:620px;height:370px;border-radius:18px 18px 0 0;background:linear-gradient(180deg,#FFE3EF,#FBD0E2);box-shadow:inset -26px 0 0 rgba(238,127,170,.15)"></div>
        <svg width="700" height="200" style="position:absolute;left:0;top:-10px"><path d="M10 170 L350 10 L690 170Z" fill="${SKY}"/><path d="M10 170 L350 10 L360 14 L36 176Z" fill="#B9D8FA"/><rect x="0" y="160" width="700" height="26" rx="12" fill="#6F9FE0"/></svg>
        <div style="position:absolute;left:290px;top:300px;width:130px;height:220px;border-radius:65px 65px 0 0;background:linear-gradient(180deg,#95BFEF,#6F9FE0);box-shadow:inset 0 0 0 10px #fff"><div style="position:absolute;right:22px;top:110px;width:16px;height:16px;border-radius:50%;background:#FFD23F"></div></div>
        ${[90, 480].map(x => `<div style="position:absolute;left:${x}px;top:240px;width:130px;height:120px;border-radius:16px;background:linear-gradient(180deg,#F1F8FF,#CDE3F7);box-shadow:inset 0 0 0 9px #fff"><div style="position:absolute;left:58px;top:0;width:12px;height:120px;background:#fff"></div><div style="position:absolute;left:-10px;right:-10px;bottom:-16px;height:18px;border-radius:8px;background:${PINK}"></div></div>`).join('')}
        <div style="position:absolute;left:300px;top:200px;width:110px;height:56px;border-radius:12px;background:#fff;display:grid;place-items:center;font:700 26px Prompt;color:${PINK}">บ้าน</div>
        <div style="position:absolute;left:520px;top:-40px;width:60px;height:110px;background:#E9A3BF;border-radius:8px"></div></div>
      <div style="position:absolute;left:150px;top:1120px;width:920px;height:90px;background:repeating-linear-gradient(90deg,#fff 0 18px,transparent 18px 60px);opacity:.95"></div>
      <div style="position:absolute;left:150px;top:1130px;width:920px;height:12px;border-radius:6px;background:#fff"></div>`;
    // ---- location C: police station (generic, Thai-inspired gable; no real station name / insignia)
    const station = `<div style="position:absolute;left:3260px;top:520px;width:1040px;height:690px">
        <svg width="1040" height="300" style="position:absolute;left:0;top:-40px"><path d="M60 290 L520 40 L980 290Z" fill="#8A5E38"/><path d="M130 290 L520 82 L910 290Z" fill="#B98B5F"/><path d="M520 40 L560 -10 L548 50Z" fill="#E7B84A"/><path d="M60 290 L20 250 L80 280Z" fill="#E7B84A"/><path d="M980 290 L1020 250 L960 280Z" fill="#E7B84A"/>
          <circle cx="520" cy="200" r="46" fill="#E7B84A" stroke="#FFF3C8" stroke-width="6"/><path d="M520 172 L536 194 L530 222 L520 230 L510 222 L504 194Z" fill="#B8862B"/></svg>
        <div style="position:absolute;left:60px;top:250px;width:920px;height:440px;background:linear-gradient(180deg,#FFF8EC,#F7E6CF);box-shadow:inset 0 -30px 0 rgba(185,139,95,.18)"></div>
        <div style="position:absolute;left:300px;top:268px;width:440px;height:76px;border-radius:16px;background:${NAVY};display:grid;place-items:center;font:800 40px Prompt;color:#fff;box-shadow:0 0 0 6px #E7B84A">สถานีตำรวจ</div>
        ${[110, 250, 690, 830].map(x => `<div style="position:absolute;left:${x}px;top:390px;width:100px;height:130px;border-radius:12px;background:linear-gradient(180deg,#EAF5FF,#BFD9F2);box-shadow:inset 0 0 0 8px #fff"></div>`).join('')}
        <div style="position:absolute;left:420px;top:400px;width:200px;height:290px;border-radius:20px 20px 0 0;background:linear-gradient(180deg,#9AC2EE,#6F9FE0);box-shadow:inset 0 0 0 10px #fff"><div style="position:absolute;left:96px;top:0;bottom:0;width:8px;background:#fff"></div></div>
        ${[0, 1, 2].map(i => `<div style="position:absolute;left:${380 - i * 20}px;top:${690 - 0 + i * 0}px;width:${280 + i * 40}px;height:0"></div>`).join('')}
        <div style="position:absolute;left:84px;top:250px;width:20px;height:440px;background:#EAD7BE"></div><div style="position:absolute;left:936px;top:250px;width:20px;height:440px;background:#EAD7BE"></div>
        <div class="beacon" style="position:absolute;left:478px;top:-110px;width:84px;height:40px;border-radius:20px 20px 6px 6px;background:linear-gradient(90deg,${PINK} 50%,${BLUE} 50%)"></div></div>
      <div style="position:absolute;left:3600px;top:1190px;width:360px;height:24px;border-radius:6px;background:#E9DCCB"></div>`;
    // ---- road B: trees, lamps, signposts
    const tree = (x, s, c1 = '#C7EFD3', c2 = '#86CFA2') => `<div style="position:absolute;left:${x}px;top:${1200 - 330 * s}px;width:${240 * s}px;height:${340 * s}px">
        <div style="position:absolute;left:44%;bottom:0;width:12%;height:42%;border-radius:10px;background:linear-gradient(90deg,#B98A63,#9A6E4C)"></div>
        <div style="position:absolute;left:4%;top:12%;width:60%;height:50%;border-radius:50%;background:radial-gradient(circle at 35% 30%,${c1},${c2})"></div>
        <div style="position:absolute;left:36%;top:4%;width:60%;height:52%;border-radius:50%;background:radial-gradient(circle at 35% 30%,#D3F4DC,#93D6AC)"></div>
        <div style="position:absolute;left:18%;top:30%;width:66%;height:40%;border-radius:50%;background:radial-gradient(circle at 40% 30%,#BDEBCB,#7CC79A)"></div></div>`;
    const blossom = (x, s) => tree(x, s, '#FFE3EF', '#F7A8C4');
    const lamp = x => `<div style="position:absolute;left:${x}px;top:760px;width:40px;height:460px"><div style="position:absolute;left:16px;top:40px;width:9px;height:420px;border-radius:5px;background:#7E8DB0"></div>
        <div style="position:absolute;left:0;top:0;width:42px;height:56px;border-radius:14px 14px 20px 20px;background:linear-gradient(180deg,#FFF6D6,#FFE39A);box-shadow:inset 0 0 0 5px #7E8DB0"></div></div>`;
    const sign = (x, txt) => `<div style="position:absolute;left:${x}px;top:880px;width:240px;height:340px"><div style="position:absolute;left:112px;top:80px;width:14px;height:260px;background:#7E8DB0;border-radius:6px"></div>
        <div style="position:absolute;left:0;top:0;width:240px;height:96px;border-radius:18px;background:${BLUE};color:#fff;display:flex;align-items:center;justify-content:center;gap:10px;font:700 30px Prompt;box-shadow:0 0 0 6px #fff">${txt}</div></div>`;
    const mid = layer(.68, `<div style="position:absolute;inset:0;filter:blur(.5px)">${[...Array(16)].map((_, i) => { const x = 1100 + i * 140, hh = 260 + (i * 61) % 160; return i % 3 === 1 ? '' : `<div style="position:absolute;left:${x}px;top:${1200 - hh}px;width:120px;height:${hh}px;border-radius:14px 14px 0 0;background:${i % 2 ? '#FBD0E2' : '#CFE3FA'}"><div style="position:absolute;left:22px;right:22px;top:30px;height:30px;border-radius:6px;background:rgba(255,255,255,.7)"></div><div style="position:absolute;left:22px;right:22px;top:90px;height:30px;border-radius:6px;background:rgba(255,255,255,.7)"></div></div>`; }).join('')}</div>`);
    const ground = layer(1, `
        <div style="position:absolute;left:0;top:1200px;width:4400px;height:400px;background:linear-gradient(180deg,#FFE3EF 0%,#FFEFF5 100%)"></div>
        <div style="position:absolute;left:0;top:1200px;width:4400px;height:400px;background-image:linear-gradient(90deg,rgba(238,127,170,.18) 3px,transparent 3px),linear-gradient(180deg,rgba(149,191,239,.25) 3px,transparent 3px);background-size:110px 80px"></div>
        <div style="position:absolute;left:0;top:1596px;width:4400px;height:28px;background:linear-gradient(180deg,#FFFFFF,#DDE7F4)"></div>
        <div style="position:absolute;left:0;top:1624px;width:4400px;height:400px;background:linear-gradient(180deg,#D9A9C4,#C894B3)"></div>
        <div style="position:absolute;left:0;top:1740px;width:4400px;height:14px;background:repeating-linear-gradient(90deg,#fff 0 100px,transparent 100px 190px);opacity:.9"></div>
        ${home}${station}
        ${tree(40, 1.1)}${blossom(1080, 1.0)}${lamp(1420)}${tree(1600, 1.15)}${sign(1880, 'สถานีตำรวจ →')}${blossom(2250, 1.1)}${lamp(2560)}${tree(2760, 1.0)}${blossom(3060, .95)}
        <div class="actors" style="position:absolute;left:0;top:0;width:4400px;height:1920px"></div>`);
    const fore = layer(1.3, `<div style="position:absolute;inset:0;filter:blur(6px)">${[300, 1300, 2300, 3300, 4100].map((x, i) => `<div style="position:absolute;left:${x}px;top:1700px;width:380px;height:300px;border-radius:50%;background:radial-gradient(circle at 40% 30%,${i % 2 ? '#FFE3EF,#F7A8C4' : '#D3F4DC,#86CFA2'})"></div>`).join('')}</div>`);
    root.appendChild(h(`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 58%,rgba(20,43,83,.18) 100%)"></div>`));
    const layers = [clouds, far, mid, ground, fore];
    const actors = ground.querySelector('.actors');
    const beacon = ground.querySelector('.beacon');
    function camera(cx, cy, z, t = 0, dof = 0) {
      layers.forEach(L => {
        const p = L.p, zl = 1 + (z - 1) * Math.min(1, p), lx = lerp(2200, cx, p) + (L === clouds ? -t * 14 : 0), ly = lerp(960, cy, Math.min(1, p));
        L.style.transform = `translate(540px,960px) scale(${zl}) translate(${-lx}px,${-ly}px)`;
      });
      fore.style.opacity = clamp((z - 1.25) * 2);
      const b = clamp(dof) * 7;
      far.style.filter = b > .1 ? `blur(${b * .7}px)` : ''; mid.style.filter = b > .1 ? `blur(${b * .5}px)` : ''; ground.style.filter = b > .1 ? `blur(${b * .35}px)` : '';
      beacon.style.background = `linear-gradient(90deg,${PINK} ${50 + 30 * Math.sin(t * 5)}%,${BLUE} ${50 + 30 * Math.sin(t * 5)}%)`;
    }
    return { root, actors, camera };
  }

  // officer / student wrappers: place(el, x, y, scale, flip)
  function actor(kind, parent) {
    const wrap = h(`<div style="position:absolute;left:0;top:0;width:0;height:0"></div>`);
    const ch = S.character(kind); wrap.appendChild(ch); (parent || document.body).appendChild(wrap);
    wrap.ch = ch;
    wrap.place = (x, y, s = 1, flip = 1, o = 1) => { wrap.style.transform = `translate(${x}px,${y}px) scale(${s * flip},${s})`; wrap.style.opacity = o; wrap.style.visibility = o < .01 ? 'hidden' : 'visible'; };
    wrap.pose = p => ch.pose(p);
    return wrap;
  }

  // wall calendar: page "วันนี้" flips up to reveal "เมื่อวาน / YESTERDAY"
  function calendar() {
    const el = h(`<div class="cal" style="position:absolute;width:360px;height:400px">
      <div style="position:absolute;left:0;top:30px;width:360px;height:370px;border-radius:34px;background:#fff;box-shadow:0 22px 44px rgba(20,43,83,.22),0 0 0 6px #fff"></div>
      <div class="pg2" style="position:absolute;left:0;top:30px;width:360px;height:370px;border-radius:34px;overflow:hidden;background:#fff">
        <div style="height:100px;background:linear-gradient(90deg,${BLUE},${SKY});display:grid;place-items:center;font:800 40px Prompt;color:#fff">YESTERDAY</div>
        <div style="text-align:center;font:800 150px/1.2 Prompt;color:${NAVY}">13</div><div style="text-align:center;font:800 46px Prompt;color:${BLUE}">เมื่อวาน</div></div>
      <div class="pg1" style="position:absolute;left:0;top:30px;width:360px;height:370px;border-radius:34px;overflow:hidden;background:#fff;transform-origin:50% 0;backface-visibility:hidden">
        <div style="height:100px;background:linear-gradient(90deg,${PINK},${PINK2});display:grid;place-items:center;font:800 40px Prompt;color:#fff">TODAY</div>
        <div style="text-align:center;font:800 150px/1.2 Prompt;color:${NAVY}">14</div><div style="text-align:center;font:800 46px Prompt;color:${PINK}">วันนี้</div></div>
      ${[90, 270].map(x => `<div style="position:absolute;left:${x - 14}px;top:8px;width:28px;height:52px;border-radius:14px;background:${NAVY}"></div>`).join('')}</div>`);
    el.flip = p => { const pg = el.querySelector('.pg1'); pg.style.transform = `perspective(900px) rotateX(${E.inOut(clamp(p)) * 170}deg)`; pg.style.opacity = p >= .55 ? 0 : 1; };
    return el;
  }

  const ICONS = {
    like: (s = 70, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M7 10v10H4V10zM9 20h8.5a2 2 0 0 0 2-1.6l1.2-6A2 2 0 0 0 18.7 10H14l.8-4a2 2 0 0 0-3.6-1.4L9 9z" fill="${c}"/></svg>`,
    share: (s = 70, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M14 4l7 7-7 7v-4c-5 0-8 1.5-10 5 .5-5.5 3.5-10 10-11z" fill="${c}"/></svg>`,
    follow: (s = 70, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="10" cy="8" r="4" fill="${c}"/><path d="M2 20c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="${c}"/><path d="M19 6v6M16 9h6" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    comment: (s = 70, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 5h16a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2z" fill="${c}"/><circle cx="8" cy="11.5" r="1.4" fill="#EE7FAA"/><circle cx="12" cy="11.5" r="1.4" fill="#2F6BFF"/><circle cx="16" cy="11.5" r="1.4" fill="#EE7FAA"/></svg>`,
    qmark: (s = 120) => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#FFD23F" stroke="#fff" stroke-width="6"/><text x="50" y="70" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="62" fill="#142B53">?</text></svg>`,
  };

  window.EP52 = Object.assign(window.EP52 || {}, { world, actor, calendar, ICONS, COL: { PINK, PINK2, ROSE, BLUSH, BLUE, SKY, CYAN, ICE, NAVY } });
})();
