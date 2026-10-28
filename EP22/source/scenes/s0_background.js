// Background layer (whole video): navy night sky, out-of-focus police-station exterior with slow drift,
// warm window glows and bokeh. Parallax: far layer drifts slower than the near one.
SC.background = function (root) {
  const { h, tf } = NSP;
  root.innerHTML = `
    <div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 30%,#1B3A78 0%,#10275A 45%,#0A1A3E 100%)"></div>
    <div id="bgFar" class="abs" style="left:-120px;top:0;width:1320px;height:1920px;filter:blur(7px);opacity:.75">
      <div class="abs" style="left:60px;top:640px;width:1200px;height:900px;background:#173064;border-radius:12px"></div>
      <div class="abs" style="left:20px;top:580px;width:1280px;height:80px;background:#1E3C78;border-radius:10px"></div>
      <div class="abs" style="left:430px;top:470px;width:460px;height:140px;background:#1E3C78;border-radius:16px 16px 0 0"></div>
      <div class="abs" style="left:520px;top:505px;width:280px;height:70px;border-radius:10px;background:#E9C46A;opacity:.55"></div>
      ${[0, 1, 2, 3, 4, 5].map(i => `<div class="abs bgw" style="left:${120 + i * 190}px;top:720px;width:120px;height:170px;border-radius:10px;background:#FFC86B;opacity:.35"></div>`).join('')}
      ${[0, 1, 2, 3, 4, 5].map(i => `<div class="abs bgw" style="left:${120 + i * 190}px;top:960px;width:120px;height:170px;border-radius:10px;background:#FFC86B;opacity:.25"></div>`).join('')}
      <div class="abs" style="left:1180px;top:240px;width:10px;height:420px;background:#2A4A86"></div>
      <div class="abs" style="left:1190px;top:250px;width:120px;height:80px;background:linear-gradient(180deg,#E5484D 0 20%,#fff 20% 40%,#2F6BFF 40% 60%,#fff 60% 80%,#E5484D 80%)"></div>
    </div>
    <div id="bgNear" class="abs" style="left:-160px;top:0;width:1400px;height:1920px;filter:blur(12px);opacity:.6">
      <div class="abs" style="left:0;top:1380px;width:1400px;height:540px;background:#0E2148"></div>
      ${[0, 1, 2].map(i => `<div class="abs" style="left:${80 + i * 560}px;top:980px;width:24px;height:420px;background:#24427C"></div><div class="abs" style="left:${40 + i * 560}px;top:950px;width:110px;height:60px;border-radius:30px;background:#FFE7A8;opacity:.8"></div>`).join('')}
    </div>
    <div id="bgBok" class="abs" style="inset:0"></div>
    <div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 55%,rgba(0,0,0,0) 45%,rgba(3,9,26,.55) 100%)"></div>`;
  const bok = [];
  let s = 7;
  const r = () => (s = (s * 16807) % 2147483647) / 2147483647;
  for (let i = 0; i < 18; i++) {
    const d = 20 + r() * 60, el = h(`<div class="abs" style="width:${d}px;height:${d}px;border-radius:50%;background:radial-gradient(circle,rgba(${r() < .5 ? '255,214,120' : '140,190,255'},.55),rgba(255,255,255,0) 70%)"></div>`);
    root.querySelector('#bgBok').appendChild(el);
    bok.push({ el, x: r() * 1080, y: r() * 1920, sp: 6 + r() * 14, ph: r() * 6.28 });
  }
  const far = root.querySelector('#bgFar'), near = root.querySelector('#bgNear'), wins = [...root.querySelectorAll('.bgw')];
  return function (t) {
    tf(far, { x: Math.sin(t * .05) * 40, y: Math.cos(t * .04) * 12 });
    tf(near, { x: Math.sin(t * .05 + .6) * 90, y: 0 });
    wins.forEach((w, i) => { w.style.opacity = (i < 6 ? .35 : .25) + .12 * Math.sin(t * .7 + i * 1.3); });
    bok.forEach(b => { let y = (b.y - t * b.sp) % 1980; if (y < -60) y += 1980; tf(b.el, { x: b.x + Math.sin(t * .4 + b.ph) * 30, y, o: .5 + .4 * Math.sin(t * .9 + b.ph) }); });
  };
};
