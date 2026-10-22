// NaiSibPro maths kit (shared, EP14+): a CSS-3D "mathematical universe" (perspective space,
// glowing grid floor, depth-sorted floating symbols, light beams, particles), glass number
// tiles, glowing pair arcs, and a 2.5D exam-room set with the same parallax camera contract.
// Decorative glyphs are operators only (+ − × ÷ =) so they can never be mistaken for terms.
(function () {
  const { h, clamp, lerp, E, rnd } = window.NSP;

  // ------------------------------------------------------------------ universe
  function universe(root) {
    root.insertAdjacentHTML('beforeend', `
      <div class="mu-bg" style="position:absolute;inset:0;background:radial-gradient(ellipse at 50% 38%,#1E3F7A 0%,#132B57 45%,#0B1A38 100%)"></div>
      <div class="mu-nebula" style="position:absolute;inset:-200px;background:radial-gradient(circle at 25% 30%,rgba(238,127,170,.22),rgba(238,127,170,0) 40%),radial-gradient(circle at 78% 62%,rgba(90,200,255,.22),rgba(90,200,255,0) 42%)"></div>
      <div class="mu-stars" style="position:absolute;inset:0"></div>
      <div class="mu-cam" style="position:absolute;inset:0;perspective:1400px;perspective-origin:50% 42%">
        <div class="mu-world" style="position:absolute;left:540px;top:960px;width:0;height:0;transform-style:preserve-3d">
          <div class="mu-floor" style="position:absolute;left:-2600px;top:-2600px;width:5200px;height:5200px;transform:translateY(760px) rotateX(90deg);
            background-image:linear-gradient(rgba(110,220,255,.35) 3px,transparent 3px),linear-gradient(90deg,rgba(110,220,255,.35) 3px,transparent 3px);background-size:160px 160px;
            -webkit-mask:radial-gradient(circle,#000 0%,rgba(0,0,0,.6) 30%,transparent 62%)"></div>
          <div class="mu-glyphs" style="position:absolute;left:0;top:0;transform-style:preserve-3d"></div>
          <div class="mu-items" style="position:absolute;left:0;top:0;transform-style:preserve-3d"></div>
        </div></div>
      <div class="mu-beams" style="position:absolute;inset:0;pointer-events:none">
        <div style="position:absolute;left:120px;top:-200px;width:420px;height:2300px;background:linear-gradient(180deg,rgba(140,230,255,.20),rgba(140,230,255,0) 80%);transform:rotate(14deg);filter:blur(10px)"></div>
        <div style="position:absolute;left:640px;top:-200px;width:360px;height:2300px;background:linear-gradient(180deg,rgba(255,200,230,.14),rgba(255,200,230,0) 75%);transform:rotate(-12deg);filter:blur(12px)"></div></div>`);
    const q = s => root.querySelector(s);
    const stars = [...Array(90)].map(() => { const s = 1.5 + rnd() * 3.5, el = h(`<div style="position:absolute;width:${s}px;height:${s}px;border-radius:50%;background:#fff;box-shadow:0 0 ${s * 3}px rgba(170,230,255,.9)"></div>`); q('.mu-stars').appendChild(el); return { el, x: rnd() * 1080, y: rnd() * 1920, ph: rnd() * 6.28, sp: 4 + rnd() * 14 }; });
    const GL = ['+', '−', '×', '÷', '='];
    const glyphs = [...Array(26)].map((_, i) => {
      const el = h(`<div style="position:absolute;left:0;top:0;font-weight:700;font-size:${80 + rnd() * 90}px;color:rgba(150,225,255,.55);text-shadow:0 0 24px rgba(110,210,255,.8)">${GL[i % GL.length]}</div>`);
      q('.mu-glyphs').appendChild(el);
      return { el, x: (rnd() - .5) * 2400, y: (rnd() - .5) * 1900, z: -400 - rnd() * 2200, ph: rnd() * 6.28, r: rnd() * 360 };
    });
    const world = q('.mu-world'), items = q('.mu-items');
    // camera: orbit (deg around Y), tilt (deg around X), dolly (px toward viewer), pan x/y
    function camera(t, { orbit = 0, tilt = 0, dolly = 0, px = 0, py = 0 } = {}) {
      world.style.transform = `translate3d(${px}px,${py}px,${dolly}px) rotateX(${tilt}deg) rotateY(${orbit}deg)`;
      stars.forEach(s => { let y = (s.y + t * s.sp) % 1920; s.el.style.transform = `translate(${s.x + orbit * 6}px,${y}px)`; s.el.style.opacity = .35 + .45 * Math.abs(Math.sin(t * 1.3 + s.ph)); });
      glyphs.forEach(g => {
        const z = g.z, fade = clamp((z + 2600) / 1200) * .9;
        g.el.style.transform = `translate3d(${g.x}px,${g.y + Math.sin(t * .6 + g.ph) * 40}px,${z}px) rotate(${g.r + t * 8}deg)`;
        g.el.style.opacity = fade; g.el.style.filter = `blur(${clamp((-z - 600) / 500) * 4}px)`;
      });
      q('.mu-nebula').style.transform = `translate(${Math.sin(t * .1) * 40 - orbit * 4}px,${Math.cos(t * .08) * 30}px)`;
    }
    return { root, world, items, camera };
  }

  // ------------------------------------------------------------------ glass number tile
  const TILE_THEMES = {
    glass: ['rgba(255,255,255,.16)', 'rgba(120,210,255,.08)', 'rgba(150,230,255,.75)', 'rgba(80,190,255,.55)', '#FFFFFF'],
    gold: ['rgba(255,236,170,.32)', 'rgba(242,199,102,.14)', 'rgba(255,224,140,.95)', 'rgba(255,200,90,.75)', '#FFF6D8'],
    pink: ['rgba(255,190,220,.28)', 'rgba(238,127,170,.12)', 'rgba(255,180,215,.9)', 'rgba(238,127,170,.65)', '#FFFFFF'],
    green: ['rgba(140,240,190,.30)', 'rgba(38,162,105,.14)', 'rgba(150,245,200,.95)', 'rgba(60,210,140,.7)', '#FFFFFF'],
  };
  function tile(label, { w = 120, h: hh = 96, fs = 46, theme = 'glass' } = {}) {
    const el = h(`<div class="mt" style="position:absolute;left:0;top:0;width:${w}px;height:${hh}px;margin:${-hh / 2}px 0 0 ${-w / 2}px;border-radius:24px;display:grid;place-items:center;font-weight:700;font-size:${fs}px;letter-spacing:.5px;font-variant-numeric:tabular-nums;backface-visibility:hidden"><span>${label}</span></div>`);
    el.theme = th => { const T = TILE_THEMES[th]; el.style.background = `linear-gradient(160deg,${T[0]},${T[1]})`; el.style.border = `3px solid ${T[2]}`; el.style.boxShadow = `0 0 28px ${T[3]}, inset 0 2px 0 rgba(255,255,255,.45)`; el.style.color = T[4]; el.style.textShadow = `0 0 14px ${T[3]}`; };
    el.theme(theme); el.set = txt => { el.firstChild.innerHTML = txt; };
    return el;
  }
  // glowing arc between two screen points (SVG path, animatable draw progress)
  function arc(color = '#7FE3FF') {
    const el = h(`<svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;left:0;top:0;overflow:visible;pointer-events:none">
      <path class="a2" fill="none" stroke="${color}" stroke-width="16" stroke-linecap="round" opacity=".25" style="filter:blur(6px)"/>
      <path class="a1" fill="none" stroke="${color}" stroke-width="6" stroke-linecap="round"/></svg>`);
    const p1 = el.querySelector('.a1'), p2 = el.querySelector('.a2');
    el.draw = (x1, y1, x2, y2, lift, prog, o = 1) => {
      const d = `M${x1} ${y1} Q${(x1 + x2) / 2} ${Math.min(y1, y2) - lift} ${x2} ${y2}`;
      [p1, p2].forEach(p => { p.setAttribute('d', d); const L = p.getTotalLength(); p.style.strokeDasharray = L; p.style.strokeDashoffset = L * (1 - clamp(prog)); });
      el.style.opacity = o;
    };
    return el;
  }

  // ------------------------------------------------------------------ exam room (2.5D, parallax camera)
  function examRoom(root) {
    const layer = (p, html) => { const el = h(`<div style="position:absolute;left:0;top:0;width:2400px;height:1920px;transform-origin:0 0">${html}</div>`); el.p = p; root.appendChild(el); return el; };
    root.appendChild(h(`<div style="position:absolute;inset:0;background:linear-gradient(180deg,#2E4A7A 0%,#3C5C91 55%,#5677AE 100%)"></div>`));
    const desk = (x, y, s) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${300 * s}px;height:${170 * s}px">
        <div style="position:absolute;left:0;top:0;width:100%;height:${26 * s}px;border-radius:${8 * s}px;background:linear-gradient(180deg,#D9B08A,#BF9370)"></div>
        <div style="position:absolute;left:${20 * s}px;top:${26 * s}px;width:${14 * s}px;height:${140 * s}px;background:#8C6A4E"></div><div style="position:absolute;right:${20 * s}px;top:${26 * s}px;width:${14 * s}px;height:${140 * s}px;background:#8C6A4E"></div>
        <div style="position:absolute;left:${110 * s}px;top:${-10 * s}px;width:${80 * s}px;height:${14 * s}px;border-radius:3px;background:#fff;transform:rotate(-5deg)"></div></div>`;
    const far = layer(.35, `<div style="position:absolute;inset:0;filter:blur(1.2px)">
        ${[0, 1].map(i => `<div style="position:absolute;left:${140 + i * 1680}px;top:200px;width:480px;height:700px;border-radius:22px;overflow:hidden;background:linear-gradient(180deg,#FFE4C2,#F9D3C8 45%,#C9DDF7);box-shadow:inset 0 0 0 14px #E5ECF6"><div style="position:absolute;left:226px;top:0;width:16px;height:100%;background:#E5ECF6"></div><div style="position:absolute;left:-40px;top:-60px;width:300px;height:300px;border-radius:50%;background:radial-gradient(circle,rgba(255,244,214,.95),rgba(255,226,190,0) 70%)"></div></div>`).join('')}
        <div class="board" style="position:absolute;left:760px;top:190px;width:880px;height:520px;border-radius:26px;background:linear-gradient(160deg,#2F5A4E,#244A40);box-shadow:inset 0 0 0 16px #C9A27C,0 20px 40px rgba(10,20,40,.35)">
          <div style="position:absolute;left:60px;top:46px;font-weight:700;font-size:44px;color:rgba(255,255,255,.85)">สอบคณิตศาสตร์</div>
          <div class="board-eq" style="position:absolute;left:0;right:0;top:200px;text-align:center;font-weight:600;font-size:66px;color:#F4FBF7;letter-spacing:1px">8 + 14 + 20 + 26 + … + 128</div>
          <div style="position:absolute;left:60px;bottom:40px;width:120px;height:18px;border-radius:9px;background:#fff;opacity:.7"></div></div>
        <div class="clock" style="position:absolute;left:1730px;top:120px;width:250px;height:250px;border-radius:50%;background:#FAF8F2;box-shadow:inset 0 0 0 14px #E1C27E,0 14px 26px rgba(10,20,40,.35)">
          ${[...Array(12)].map((_, i) => `<div style="position:absolute;left:121px;top:22px;width:8px;height:20px;border-radius:4px;background:#3D5E93;transform-origin:4px 103px;transform:rotate(${i * 30}deg)"></div>`).join('')}
          <div class="hh" style="position:absolute;left:120px;top:70px;width:10px;height:58px;border-radius:5px;background:#2B3B5A;transform-origin:5px 55px"></div>
          <div class="mh" style="position:absolute;left:121px;top:40px;width:8px;height:88px;border-radius:4px;background:#2B3B5A;transform-origin:4px 85px"></div>
          <div class="sh" style="position:absolute;left:123px;top:30px;width:4px;height:100px;border-radius:2px;background:#EE7FAA;transform-origin:2px 95px"></div>
          <div style="position:absolute;left:113px;top:113px;width:24px;height:24px;border-radius:50%;background:#EE7FAA"></div></div></div>`);
    const mid = layer(.7, `<div style="position:absolute;inset:0;filter:blur(1.4px)">${[0, 1, 2, 3, 4, 5, 6].map(i => desk(300 + i * 290, 1060, .78)).join('')}${[0, 1, 2, 3, 4, 5].map(i => desk(380 + i * 330, 1180, .9)).join('')}</div>`);
    const ground = layer(1, `
        <div style="position:absolute;left:0;top:1300px;width:2400px;height:900px;background:linear-gradient(180deg,#B9A58F,#D2C1AC 40%,#E2D4C1)"></div>
        <div style="position:absolute;left:0;top:1300px;width:2400px;height:40px;background:linear-gradient(180deg,rgba(20,30,60,.3),rgba(20,30,60,0))"></div>
        <div class="actors" style="position:absolute;left:0;top:0;width:2400px;height:1920px"></div>
        <div class="front-desk" style="position:absolute;left:930px;top:1470px;width:540px;height:300px">
          <div style="position:absolute;left:0;top:0;width:540px;height:44px;border-radius:12px;background:linear-gradient(180deg,#E2BA94,#C39773);box-shadow:0 14px 22px rgba(40,30,20,.3)"></div>
          <div style="position:absolute;left:30px;top:44px;width:480px;height:250px;border-radius:0 0 16px 16px;background:linear-gradient(180deg,#B98D68,#A27852)"></div>
          <div class="paper" style="position:absolute;left:150px;top:-26px;width:240px;height:52px;border-radius:6px;background:#fff;transform:rotate(-3deg);box-shadow:0 4px 8px rgba(0,0,0,.15)"></div>
          <div style="position:absolute;left:410px;top:-12px;width:90px;height:12px;border-radius:6px;background:#F2C766;transform:rotate(18deg)"></div></div>`);
    const beams = h(`<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(115deg,rgba(255,226,170,.28) 0%,rgba(255,226,170,0) 45%);mix-blend-mode:screen"></div>`);
    const vig = h(`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 50%,rgba(10,20,50,.38) 100%)"></div>`);
    root.appendChild(beams); root.appendChild(vig);
    const layers = [far, mid, ground];
    const clk = { hh: root.querySelector('.hh'), mh: root.querySelector('.mh'), sh: root.querySelector('.sh') };
    function camera(cx, cy, z, t = 0, dof = 0, clockT = t) {
      layers.forEach(L => { const p = L.p, zl = 1 + (z - 1) * p, lx = lerp(1200, cx, p), ly = lerp(960, cy, p); L.style.transform = `translate(540px,960px) scale(${zl}) translate(${-lx}px,${-ly}px)`; });
      far.style.filter = dof > .05 ? `blur(${dof * 5}px)` : ''; mid.style.filter = dof > .05 ? `blur(${dof * 3}px)` : '';
      const sec = Math.floor(clockT);                       // ticking second hand (steps once per second)
      clk.sh.style.transform = `rotate(${(sec % 60) * 6 + 6 * E.back(clamp((clockT - sec) / .2)) - 6}deg)`;
      clk.mh.style.transform = `rotate(${200 + clockT * .6}deg)`; clk.hh.style.transform = `rotate(${300 + clockT * .05}deg)`;
    }
    return { actors: ground.querySelector('.actors'), camera, board: root.querySelector('.board'), boardEq: root.querySelector('.board-eq'), paperX: 1200, paperY: 1450 };
  }
  window.MATH = { universe, tile, arc, examRoom };
})();
