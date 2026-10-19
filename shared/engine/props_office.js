// NaiSibPro office set (shared, EP10+). Layered 2.5D modern office in cinematic blue with
// warm golden window light, pastel-cyan accents and NaiSibPro pink — intriguing, not scary.
// Same parallax camera contract as STORY.city(): camera(cx, cy, z, t, dof).
(function () {
  const { h, clamp, lerp } = window.NSP;

  // consistent blue document folder prop (same drawing in every shot)
  function folderSVG() {
    return `<g><path d="M-70 -42 Q-70 -52 -60 -52 H-20 L-10 -42 H60 Q70 -42 70 -32 V44 Q70 52 60 52 H-60 Q-70 52 -70 44Z" fill="#2F64B5"/>
      <rect x="-58" y="-46" width="112" height="80" rx="5" fill="#fff" transform="rotate(-3)"/><path d="M-46 -30h80M-46 -16h88M-46 -2h64" stroke="#D7E3F3" stroke-width="5" stroke-linecap="round" transform="rotate(-3)"/>
      <path d="M-70 -24 Q-70 -32 -60 -32 H60 Q70 -32 70 -24 V44 Q70 52 60 52 H-60 Q-70 52 -70 44Z" fill="#3E7BD6"/>
      <path d="M-62 -26 H62" stroke="rgba(255,255,255,.45)" stroke-width="4" stroke-linecap="round"/>
      <rect x="-26" y="2" width="52" height="22" rx="6" fill="#EAF3FE"/><path d="M-16 13 h32" stroke="#3E7BD6" stroke-width="4" stroke-linecap="round"/></g>`;
  }
  function folder(scale = 1) {
    return h(`<svg width="${150 * scale}" height="${110 * scale}" viewBox="-75 -55 150 110" style="overflow:visible">${folderSVG()}</svg>`);
  }

  function office(root) {
    const layer = (cls, p, html) => { const el = h(`<div class="lyr ${cls}" style="position:absolute;left:0;top:0;width:2400px;height:1920px;transform-origin:0 0">${html}</div>`); el.p = p; root.appendChild(el); return el; };
    const back = h(`<div style="position:absolute;inset:0;background:linear-gradient(180deg,#3D5E93 0%,#4F76AE 45%,#6C93C8 100%)"></div>`);
    root.appendChild(back);
    // far wall: big windows with soft skyline + golden light
    const skyline = [...Array(14)].map((_, i) => { const w = 90 + (i * 37) % 70, hh = 160 + (i * 83) % 220; return `<div style="position:absolute;left:${i * 110 - 20}px;bottom:0;width:${w}px;height:${hh}px;border-radius:8px 8px 0 0;background:rgba(214,230,250,${.35 + (i % 3) * .1})"></div>`; }).join('');
    const win = x => `<div style="position:absolute;left:${x}px;top:150px;width:640px;height:760px;border-radius:26px;overflow:hidden;background:linear-gradient(180deg,#FFE6C2 0%,#FBD3C7 40%,#C9DDF7 100%);box-shadow:inset 0 0 0 14px #E8EEF8,0 20px 40px rgba(20,30,60,.25)">
        <div style="position:absolute;left:0;right:0;bottom:0;height:420px;filter:blur(3px)">${skyline}</div>
        <div style="position:absolute;left:310px;top:0;width:18px;height:100%;background:#E8EEF8"></div><div style="position:absolute;left:0;top:370px;width:100%;height:16px;background:#E8EEF8"></div>
        <div style="position:absolute;left:-60px;top:-80px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(255,244,214,.95),rgba(255,226,190,0) 70%)"></div></div>`;
    const far = layer('far', .35, `<div style="position:absolute;inset:0;filter:blur(1.5px)">${win(140)}${win(1600)}
        <div style="position:absolute;left:860px;top:240px;width:660px;height:400px;border-radius:24px;background:#F4F7FC;box-shadow:inset 0 0 0 12px #DCE5F2,0 16px 30px rgba(20,30,60,.2)">
          <div style="position:absolute;left:50px;top:60px;width:260px;height:18px;border-radius:9px;background:#B8D9F8"></div><div style="position:absolute;left:50px;top:100px;width:200px;height:18px;border-radius:9px;background:#F5A9C7"></div>
          <div style="position:absolute;left:380px;top:60px;width:220px;height:260px;border-radius:16px;border:6px dashed #C9D6E8"></div>
          <svg style="position:absolute;left:50px;top:150px" width="300" height="200" viewBox="0 0 300 200"><path d="M10 170 L80 110 L140 140 L210 60 L290 90" stroke="#95BFEF" stroke-width="8" fill="none" stroke-linecap="round"/></svg></div>
        <div style="position:absolute;left:1040px;top:690px;width:300px;height:300px;border-radius:50%;background:#F7F4EC;box-shadow:inset 0 0 0 14px #E1C27E,0 12px 24px rgba(20,30,60,.2)"><div style="position:absolute;left:146px;top:60px;width:10px;height:96px;border-radius:5px;background:#3D5E93;transform-origin:5px 90px;transform:rotate(30deg)"></div><div style="position:absolute;left:146px;top:90px;width:10px;height:66px;border-radius:5px;background:#EE7FAA;transform-origin:5px 60px;transform:rotate(-70deg)"></div></div></div>`);
    // golden light shafts from the windows
    const beams = layer('beams', .5, `<div style="position:absolute;left:250px;top:150px;width:900px;height:1700px;background:linear-gradient(180deg,rgba(255,226,170,.38),rgba(255,226,170,0) 85%);clip-path:polygon(10% 0,48% 0,100% 100%,40% 100%);mix-blend-mode:screen"></div>
        <div style="position:absolute;left:1700px;top:150px;width:800px;height:1700px;background:linear-gradient(180deg,rgba(255,226,170,.3),rgba(255,226,170,0) 85%);clip-path:polygon(10% 0,48% 0,100% 100%,40% 100%);mix-blend-mode:screen"></div>`);
    // mid: cabinets, shelves with binders (no blue folders anywhere else), plants
    const cabinet = (x, col) => `<div style="position:absolute;left:${x}px;top:820px;width:230px;height:520px;border-radius:18px;background:linear-gradient(180deg,${col},#9FC0E6);box-shadow:inset -14px 0 0 rgba(0,0,0,.06),0 18px 30px rgba(20,30,60,.25)">${[0, 1, 2, 3].map(r => `<div style="position:absolute;left:18px;right:18px;top:${22 + r * 124}px;height:108px;border-radius:12px;background:rgba(255,255,255,.35)"><div style="position:absolute;left:80px;top:46px;width:56px;height:14px;border-radius:7px;background:#E1C27E"></div></div>`).join('')}</div>`;
    const shelf = (x) => { const cols = ['#F5A9C7', '#E7B84A', '#9ED8B0', '#F8CFE2', '#D9C6F2', '#FFD36E', '#9AD7D8']; return `<div style="position:absolute;left:${x}px;top:700px;width:420px;height:640px;border-radius:16px;background:#E9DDCC;box-shadow:inset 0 0 0 14px #D8C6AE,0 18px 30px rgba(20,30,60,.25)">${[0, 1, 2].map(r => `<div style="position:absolute;left:14px;right:14px;top:${190 + r * 200}px;height:14px;background:#D8C6AE"></div>${[...Array(7)].map((_, i) => `<div style="position:absolute;left:${28 + i * 52}px;top:${38 + r * 200 + (i % 3) * 8}px;width:40px;height:${150 - (i % 3) * 8}px;border-radius:6px;background:${cols[(i + r * 2) % cols.length]}"><div style="position:absolute;left:8px;right:8px;top:24px;height:16px;border-radius:4px;background:rgba(255,255,255,.7)"></div></div>`).join('')}`).join('')}</div>`; };
    const plant = (x, s = 1) => `<div style="position:absolute;left:${x}px;top:${1340 - 380 * s}px;width:${220 * s}px;height:${380 * s}px">
        <div style="position:absolute;left:22%;bottom:0;width:56%;height:34%;border-radius:12px 12px 30px 30px;background:linear-gradient(180deg,#F8CFE2,#EE9FBF)"></div>
        ${[[-10, 0, 70], [30, 10, 80], [60, -10, 70], [10, 20, 60]].map(([lx, ly, w], i) => `<div style="position:absolute;left:${lx}%;top:${ly}%;width:${w}%;height:46%;border-radius:50% 50% 50% 0;background:radial-gradient(circle at 40% 30%,#BDEBCB,#5FB485);transform:rotate(${i * 50 - 60}deg)"></div>`).join('')}</div>`;
    const mid = layer('mid', .7, `<div style="position:absolute;inset:0;filter:blur(.8px)">${cabinet(120, '#CFE3FA')}${shelf(400)}${cabinet(1560, '#CFE3FA')}${shelf(1840)}${plant(860, 1.1)}${plant(1350, 1.0)}</div>`);
    // ground: floor, rug, main desk with the folder slot
    const ground = layer('ground', 1, `
        <div style="position:absolute;left:0;top:1340px;width:2400px;height:900px;background:linear-gradient(180deg,#C9B49B 0%,#D9C7B0 30%,#E6D8C5 100%)"></div>
        <div style="position:absolute;left:0;top:1340px;width:2400px;height:900px;background-image:linear-gradient(90deg,rgba(150,120,90,.18) 3px,transparent 3px);background-size:160px 100%"></div>
        <div style="position:absolute;left:0;top:1340px;width:2400px;height:40px;background:linear-gradient(180deg,rgba(40,50,80,.25),rgba(40,50,80,0))"></div>
        <div style="position:absolute;left:560px;top:1520px;width:1280px;height:260px;border-radius:50%;background:radial-gradient(ellipse,#BFD7F2 0%,#A9C7EC 60%,rgba(169,199,236,0) 72%)"></div>
        <div class="desk" style="position:absolute;left:880px;top:1260px;width:640px;height:330px">
          <div style="position:absolute;left:40px;top:60px;width:30px;height:270px;background:#8C6A4E"></div><div style="position:absolute;right:40px;top:60px;width:30px;height:270px;background:#8C6A4E"></div>
          <div style="position:absolute;left:90px;top:70px;width:220px;height:200px;border-radius:10px;background:#B98D68"><div style="position:absolute;left:20px;right:20px;top:30px;height:60px;border-radius:8px;background:rgba(255,255,255,.18)"></div><div style="position:absolute;left:20px;right:20px;top:110px;height:60px;border-radius:8px;background:rgba(255,255,255,.18)"></div></div>
          <div style="position:absolute;left:0;top:30px;width:640px;height:46px;border-radius:12px;background:linear-gradient(180deg,#D6A87F,#B98D68);box-shadow:0 14px 20px rgba(60,40,30,.25)"></div>
          <div style="position:absolute;left:10px;top:20px;width:620px;height:24px;border-radius:10px;background:#E6BC94"></div>
          <div style="position:absolute;left:400px;top:-170px;width:200px;height:150px;border-radius:14px;background:#2E3A52;box-shadow:inset 0 0 0 8px #E8EEF8"><div style="position:absolute;left:20px;top:20px;right:20px;height:12px;border-radius:6px;background:#9AD7D8"></div><div style="position:absolute;left:20px;top:44px;width:100px;height:12px;border-radius:6px;background:#F5A9C7"></div></div>
          <div style="position:absolute;left:470px;top:-20px;width:60px;height:24px;border-radius:6px;background:#E8EEF8"></div>
          <div style="position:absolute;left:40px;top:-60px;width:56px;height:70px;border-radius:10px 10px 14px 14px;background:#F8CFE2"><div style="position:absolute;left:10px;top:-30px;width:6px;height:40px;background:#3D5E93;transform:rotate(-10deg)"></div><div style="position:absolute;left:28px;top:-36px;width:6px;height:46px;background:#E7B84A;transform:rotate(8deg)"></div></div>
          <div style="position:absolute;left:330px;top:-6px;width:110px;height:30px;border-radius:4px;background:#FFF;transform:rotate(-4deg);box-shadow:0 3px 6px rgba(0,0,0,.1)"></div>
        </div>
        <div class="actors" style="position:absolute;left:0;top:0;width:2400px;height:1920px"></div>`);
    const fore = layer('fore', 1.35, `<div style="position:absolute;inset:0;filter:blur(8px)">
        <div style="position:absolute;left:-80px;top:1560px;width:520px;height:380px;border-radius:30px;background:linear-gradient(180deg,#D6A87F,#B98D68)"></div>
        <div style="position:absolute;left:2000px;top:1500px;width:420px;height:420px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#BDEBCB,#5FB485)"></div></div>`);
    const light = h(`<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(120deg,rgba(255,226,170,.22) 0%,rgba(255,226,170,0) 50%);mix-blend-mode:screen"></div>`);
    const vig = h(`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(20,30,60,.3) 100%)"></div>`);
    root.appendChild(light); root.appendChild(vig);
    const layers = [far, beams, mid, ground, fore];
    function camera(cx, cy, z, t = 0, dof = 0) {
      layers.forEach(L => {
        const p = L.p, zl = 1 + (z - 1) * Math.min(1, p), lx = lerp(1200, cx, p), ly = lerp(960, cy, Math.min(1, p));
        L.style.transform = `translate(540px,960px) scale(${zl}) translate(${-lx}px,${-ly}px)`;
      });
      fore.style.opacity = clamp((z - 1.8) * 2);
      const b = clamp(dof) * 6;
      far.style.filter = b > .1 ? `blur(${b * .8}px)` : ''; mid.style.filter = b > .1 ? `blur(${b * .55}px)` : '';
      beams.style.opacity = .75 + .25 * Math.sin(t * .6);
    }
    return { actors: ground.querySelector('.actors'), camera, layers, DESK_TOP: 1282 };
  }
  window.OFFICE = { office, folder, folderSVG };
})();
