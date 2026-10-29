// Background layer (whole video): dark navy interrogation room. Back wall with panel seams and a dark
// one-way mirror, hanging lamp with a slow warm light drift, floor, vignette and floating dust.
// Parallax: the far wall drifts slower than the near lamp/floor layer. The hook's "จอดำสนิท" beat dims it.
SC.background = function (root) {
  const { h, tf, clamp, P } = NSP;
  const { at } = EP23;
  root.innerHTML = `
    <div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 32%,#1D3C7C 0%,#122B60 45%,#0A1A3E 100%)"></div>
    <div id="bgFar" class="abs" style="left:-100px;top:0;width:1280px;height:1920px">
      ${[0, 1, 2, 3, 4, 5, 6].map(i => `<div class="abs" style="left:${i * 190}px;top:0;width:4px;height:1560px;background:rgba(120,160,240,.10)"></div>`).join('')}
      <div class="abs" style="left:0;right:0;top:1180px;height:6px;background:rgba(120,160,240,.12)"></div>
      <div class="abs" style="left:230px;top:300px;width:820px;height:420px;border-radius:14px;background:linear-gradient(135deg,#0F2147,#16305F 55%,#0D1C3E);box-shadow:inset 0 0 0 10px #213C72,0 0 0 4px #0A1735;opacity:.8">
        <div class="abs" style="left:120px;top:0;width:90px;height:100%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(170,200,255,.12),rgba(255,255,255,0));transform:skewX(-18deg)"></div>
        <div class="abs" style="left:260px;top:0;width:30px;height:100%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(170,200,255,.10),rgba(255,255,255,0));transform:skewX(-18deg)"></div></div>
      <div class="abs" style="left:0;right:0;top:1560px;height:400px;background:linear-gradient(180deg,#0E2148,#081633)"></div>
      ${[-3, -2, -1, 0, 1, 2, 3].map(i => `<div class="abs" style="left:${640 + i * 60}px;top:1560px;width:3px;height:420px;background:rgba(120,160,240,.10);transform-origin:top;transform:rotate(${-i * 14}deg)"></div>`).join('')}
    </div>
    <div id="bgNear" class="abs" style="inset:0">
      <div class="abs" style="left:536px;top:0;width:8px;height:110px;background:#0A1530"></div>
      <div class="abs" style="left:450px;top:104px;width:180px;height:60px;border-radius:90px 90px 14px 14px;background:#24375F;border:5px solid #0A1530"></div>
      <div id="bgLamp" class="abs" style="left:240px;top:140px;width:600px;height:600px;border-radius:50%;background:radial-gradient(circle,rgba(255,220,150,.30),rgba(255,220,150,0) 65%)"></div>
    </div>
    <div id="bgDust" class="abs" style="inset:0"></div>
    <div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 50%,rgba(0,0,0,0) 42%,rgba(3,9,26,.62) 100%)"></div>
    <div id="bgDim" class="dim" style="opacity:0"></div>`;
  const dust = []; let s = 5;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 26; i++) {
    const d = 4 + r() * 8, el = h(`<div class="abs" style="width:${d}px;height:${d}px;border-radius:50%;background:${r() < .5 ? 'rgba(255,226,160,.55)' : 'rgba(150,190,255,.45)'};filter:blur(1px)"></div>`);
    root.querySelector('#bgDust').appendChild(el);
    dust.push({ el, x: r() * 1080, y: r() * 1920, sp: 8 + r() * 16, ph: r() * 6.28 });
  }
  const far = root.querySelector('#bgFar'), lamp = root.querySelector('#bgLamp'), dim = root.querySelector('#bgDim');
  const dk0 = at('hook', 'dark'), dk1 = EP23.T.story0;
  return function (t) {
    tf(far, { x: Math.sin(t * .05) * 30, y: Math.cos(t * .04) * 10 });
    tf(lamp, { x: Math.sin(t * .23) * 60, s: 1 + .06 * Math.sin(t * .5), o: .85 + .15 * Math.sin(t * .9) });
    dust.forEach(b => { let y = (b.y - t * b.sp) % 1980; if (y < -40) y += 1980; tf(b.el, { x: b.x + Math.sin(t * .4 + b.ph) * 26, y, o: .45 + .35 * Math.sin(t * .9 + b.ph) }); });
    // hook: the room goes dark on "จอดำ" and comes back for the story
    const d = .62 * clamp((t - dk0) / .25) * (1 - P(t, dk1 - .4, .5));
    dim.style.opacity = d;
  };
};
