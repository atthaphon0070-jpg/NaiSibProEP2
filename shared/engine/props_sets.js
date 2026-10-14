// NaiSibPro interior sets (shared, EP05+). Layered pastel interiors with the same parallax
// camera model as STORY.city(): 2400 × 1920 world, camera(cx, cy, zoom, t, dof).
//   SETS.cafe(root)  daytime café: arched windows, pendant lamps, menu board, counter, table + chair
//   SETS.room(root)  evening apartment: night window, fairy lights, shelf, floor lamp, sofa, coffee table
// Each returns { actors, front, camera, layers }: actors sit between the "behind" furniture
// (chair back / sofa back) and `front` (table / sofa seat), so a character placed there reads as seated.
// All illustrations are original; no real brands or logos.
(function () {
  const { h, clamp, lerp } = window.NSP;

  function world(root, skyHTML) {
    const layer = (p, html, extra = '') => { const el = h(`<div style="position:absolute;left:0;top:0;width:2400px;height:1920px;transform-origin:0 0;${extra}">${html}</div>`); el.p = p; root.appendChild(el); return el; };
    const sky = skyHTML ? h(skyHTML) : null; if (sky) root.appendChild(sky);
    return {
      layer,
      finish(layers, fore, grade = '') {
        const vig = h(`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(60,40,80,.22) 100%)"></div>`);
        const gr = h(`<div style="position:absolute;inset:0;pointer-events:none;${grade}"></div>`);
        root.appendChild(gr); root.appendChild(vig);
        const back = layers[0];
        return function camera(cx, cy, z, t = 0, dof = 0) {
          layers.forEach(L => {
            const p = L.p, zl = 1 + (z - 1) * Math.min(1, p), lx = lerp(1200, cx, p), ly = lerp(960, cy, Math.min(1, p));
            L.style.transform = `translate(540px,960px) scale(${zl}) translate(${-lx}px,${-ly}px)`;
          });
          if (fore) fore.style.opacity = clamp((z - 1.6) * 2);
          const b = clamp(dof) * 6;
          back.style.filter = b > .1 ? `blur(${b}px)` : '';
          if (layers[1] && layers[1] !== layers[layers.length - 1]) layers[1].style.filter = b > .1 ? `blur(${b * .55}px)` : '';
        };
      },
    };
  }

  // ------------------------------------------------------------------ café (daytime, pink)
  function cafe(root) {
    const W = world(root);
    const win = (x) => `<div style="position:absolute;left:${x}px;top:290px;width:440px;height:600px;border-radius:220px 220px 22px 22px;background:#fff;box-shadow:0 18px 30px rgba(150,100,140,.18)">
        <div style="position:absolute;inset:18px;border-radius:204px 204px 12px 12px;overflow:hidden;background:linear-gradient(180deg,#CFE6FF 0%,#EAF4FF 55%,#FFE9F2 100%)">
          <div style="position:absolute;left:40px;top:90px;width:150px;height:46px;border-radius:30px;background:#fff;opacity:.9;box-shadow:40px -18px 0 -6px #fff"></div>
          ${[0, 1, 2, 3, 4].map(i => `<div style="position:absolute;left:${-10 + i * 86}px;bottom:0;width:${70 + (i * 17) % 30}px;height:${150 + (i * 53) % 120}px;border-radius:10px 10px 0 0;background:${i % 2 ? '#DCD6F5' : '#C9DDF5'};filter:blur(1.5px)"></div>`).join('')}
          <div style="position:absolute;left:-20px;right:-20px;bottom:0;height:70px;background:radial-gradient(ellipse at 30% 100%,#BFE8CC 0%,#A6DDB8 60%,transparent 61%),radial-gradient(ellipse at 80% 100%,#C7EFD3 0%,#9ED8B0 55%,transparent 56%)"></div></div>
        <div style="position:absolute;left:213px;top:18px;width:14px;bottom:18px;background:#fff"></div><div style="position:absolute;left:18px;right:18px;top:330px;height:14px;background:#fff"></div>
        <div style="position:absolute;left:-26px;right:-26px;bottom:-20px;height:34px;border-radius:12px;background:#F7D9E6;box-shadow:0 8px 0 rgba(0,0,0,.05)"></div>
        <div style="position:absolute;left:30px;bottom:6px;width:80px;height:56px;border-radius:12px 12px 20px 20px;background:#F5A9C7"></div><div style="position:absolute;left:36px;bottom:52px;width:68px;height:60px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#C7EFD3,#7CC79A)"></div></div>`;
    const lamp = (x, len) => `<div style="position:absolute;left:${x}px;top:0;width:8px;height:${len}px;background:#B9A9D9"></div>
        <div style="position:absolute;left:${x - 56}px;top:${len}px;width:120px;height:70px;border-radius:60px 60px 10px 10px;background:linear-gradient(180deg,#FFFFFF,#F7C9DC);box-shadow:inset 0 -8px 0 #EE9FBF"></div>
        <div style="position:absolute;left:${x - 150}px;top:${len + 20}px;width:308px;height:260px;border-radius:50%;background:radial-gradient(ellipse at 50% 20%,rgba(255,236,180,.75),rgba(255,236,180,0) 65%)"></div>`;
    const back = W.layer(.55, `
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,#FFF1F6 0%,#FCE6EF 60%,#F8DCE8 100%)"></div>
        <div style="position:absolute;left:0;top:0;width:2400px;height:1920px;background-image:radial-gradient(rgba(245,169,199,.22) 3px,transparent 3.5px);background-size:60px 60px"></div>
        <div style="position:absolute;left:0;top:1060px;width:2400px;height:300px;background:linear-gradient(180deg,#CFE3FA,#BCD6F4);box-shadow:inset 0 10px 0 #fff"></div>
        <div style="position:absolute;left:0;top:1060px;width:2400px;height:300px;background-image:linear-gradient(90deg,rgba(255,255,255,.55) 4px,transparent 4px);background-size:90px 100%"></div>
        ${win(170)}${win(980)}${win(1790)}
        <div style="position:absolute;left:690px;top:380px;width:220px;height:300px;border-radius:24px;background:#5B6B86;box-shadow:inset 0 0 0 12px #C79A6B,0 14px 24px rgba(0,0,0,.12)">
          <div style="position:absolute;left:0;right:0;top:30px;text-align:center;font-family:Prompt;font-weight:800;font-size:40px;color:#FFE3EE">เมนู</div>
          ${['กาแฟ', 'ชาไทย', 'โกโก้', 'นมชมพู'].map((m, i) => `<div style="position:absolute;left:34px;top:${100 + i * 46}px;font-family:Prompt;font-weight:600;font-size:26px;color:#fff;opacity:.85">${m}</div><div style="position:absolute;right:34px;top:${112 + i * 46}px;width:30px;height:8px;border-radius:4px;background:#F5A9C7"></div>`).join('')}</div>
        <div style="position:absolute;left:1480px;top:560px;width:250px;height:20px;border-radius:8px;background:#C79A6B"></div>
        ${[0, 1, 2].map(i => `<div style="position:absolute;left:${1500 + i * 76}px;top:${504}px;width:52px;height:56px;border-radius:8px 8px 18px 18px;background:${['#F5A9C7', '#95BFEF', '#FFD36E'][i]}"></div>`).join('')}
        <div style="position:absolute;left:1488px;top:420px;width:250px;height:20px;border-radius:8px;background:#C79A6B"></div>
        <div style="position:absolute;left:1520px;top:340px;width:70px;height:80px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#C7EFD3,#86CFA2)"></div><div style="position:absolute;left:1530px;top:390px;width:50px;height:32px;border-radius:6px 6px 14px 14px;background:#fff"></div>
        ${lamp(560, 160)}${lamp(1360, 120)}${lamp(2160, 160)}`);
    const mid = W.layer(.8, `
        <div style="position:absolute;left:1880px;top:1010px;width:620px;height:380px;border-radius:26px 0 0 0;background:linear-gradient(180deg,#FFFFFF,#F4E8F1);box-shadow:inset 0 14px 0 #F5A9C7,0 18px 30px rgba(120,80,120,.12)"></div>
        <div style="position:absolute;left:1960px;top:880px;width:170px;height:140px;border-radius:20px 20px 6px 6px;background:linear-gradient(180deg,#B9C4D8,#8E9BB4)"><div style="position:absolute;left:24px;top:30px;width:120px;height:40px;border-radius:10px;background:#5B6B86"></div><div style="position:absolute;left:62px;top:84px;width:44px;height:44px;border-radius:50%;background:#F5A9C7"></div></div>
        <div style="position:absolute;left:2180px;top:930px;width:46px;height:80px;border-radius:8px 8px 16px 16px;background:#fff;box-shadow:inset 0 -24px 0 #C79A6B"></div>
        <div style="position:absolute;left:60px;top:1050px;width:160px;height:200px;border-radius:12px 12px 40px 40px;background:#F5A9C7"></div><div style="position:absolute;left:10px;top:820px;width:260px;height:280px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#D3F4DC,#7CC79A)"></div>`);
    const ground = W.layer(1, `
        <div style="position:absolute;left:0;top:1350px;width:2400px;height:600px;background:linear-gradient(180deg,#F1DCCB 0%,#F6E6D8 50%,#FAEFE6 100%)"></div>
        <div style="position:absolute;left:0;top:1350px;width:2400px;height:600px;background-image:linear-gradient(90deg,rgba(214,176,150,.45) 3px,transparent 3px);background-size:160px 100%"></div>
        <div style="position:absolute;left:0;top:1350px;width:2400px;height:40px;background:linear-gradient(180deg,rgba(150,110,120,.18),rgba(150,110,120,0))"></div>
        <div class="behind" style="position:absolute;inset:0"></div><div class="actors" style="position:absolute;inset:0"></div><div class="front" style="position:absolute;inset:0"></div>`);
    // A's chair back (behind) and table (front), centred on x = 1200
    ground.querySelector('.behind').innerHTML = `
        <div style="position:absolute;left:1050px;top:1080px;width:300px;height:340px;border-radius:150px 150px 30px 30px;background:linear-gradient(180deg,#B8D9F8,#95BFEF);box-shadow:inset 0 0 0 14px #fff,0 14px 24px rgba(80,110,170,.18)"></div>`;
    ground.querySelector('.front').innerHTML = `
        <div style="position:absolute;left:880px;top:1400px;width:640px;height:56px;border-radius:28px;background:#FFFFFF;box-shadow:0 8px 0 #F5A9C7,0 20px 30px rgba(120,80,120,.18)"></div>
        <div style="position:absolute;left:930px;top:1452px;width:540px;height:300px;background:linear-gradient(180deg,#FCE3EF,#F7CFE0);border-radius:0 0 40px 40px"></div>
        <div style="position:absolute;left:930px;top:1452px;width:540px;height:300px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.55) 0 30px,transparent 30px 60px);border-radius:0 0 40px 40px"></div>
        <div style="position:absolute;left:1370px;top:1336px;width:70px;height:70px;border-radius:10px 10px 22px 22px;background:#fff;box-shadow:inset 0 -22px 0 #C79A6B"></div><div style="position:absolute;left:1434px;top:1350px;width:26px;height:34px;border:7px solid #fff;border-left:0;border-radius:0 18px 18px 0"></div>
        <div style="position:absolute;left:1360px;top:1300px;width:12px;height:30px;border-radius:6px;background:rgba(255,255,255,.7);filter:blur(3px)"></div><div style="position:absolute;left:1392px;top:1290px;width:12px;height:30px;border-radius:6px;background:rgba(255,255,255,.7);filter:blur(3px)"></div>
        <div style="position:absolute;left:960px;top:1358px;width:120px;height:46px;border-radius:50%;background:#FFE1B8;box-shadow:inset 0 -10px 0 #F2C79A"></div>`;
    const fore = W.layer(1.35, `<div style="position:absolute;inset:0;filter:blur(8px)">
        <div style="position:absolute;left:-80px;top:1400px;width:520px;height:520px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#C7EFD3,#7CC79A)"></div>
        <div style="position:absolute;left:2000px;top:1500px;width:520px;height:420px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#FFD6E6,#F5A9C7)"></div></div>`);
    const light = h(`<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(120deg,rgba(255,240,210,.45) 0%,rgba(255,240,210,0) 50%);mix-blend-mode:screen"></div>`);
    root.appendChild(light);
    const layers = [back, mid, ground, fore];
    const camera = W.finish(layers, fore);
    return { actors: ground.querySelector('.actors'), front: ground.querySelector('.front'), camera, layers };
  }

  // ------------------------------------------------------------------ apartment (evening, lavender)
  function room(root) {
    const W = world(root);
    const stars = [...Array(16)].map((_, i) => `<div style="position:absolute;left:${(i * 97) % 520 + 20}px;top:${(i * 61) % 260 + 30}px;width:${4 + i % 3 * 2}px;height:${4 + i % 3 * 2}px;border-radius:50%;background:#FFF6D6;box-shadow:0 0 8px #FFF6D6"></div>`).join('');
    const bulbs = [...Array(22)].map((_, i) => { const x = 120 + i * 100, y = 250 + 40 * Math.sin(((x % 500) / 500) * Math.PI); return `<div class="fl" style="position:absolute;left:${x}px;top:${y}px;width:22px;height:30px;border-radius:50% 50% 50% 50% / 60% 60% 40% 40%;background:${['#FFE38A', '#FFC2DA', '#BDE3FF'][i % 3]};box-shadow:0 0 18px 6px ${['rgba(255,227,138,.6)', 'rgba(255,194,218,.6)', 'rgba(189,227,255,.6)'][i % 3]}"></div>`; }).join('');
    const back = W.layer(.55, `
        <div style="position:absolute;inset:0;background:linear-gradient(180deg,#D9D3F2 0%,#E3DDF6 55%,#EDE4F5 100%)"></div>
        <div style="position:absolute;left:0;top:0;width:2400px;height:1920px;background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 60px,transparent 60px 120px)"></div>
        <svg width="2400" height="200" style="position:absolute;left:0;top:200px"><path d="M0 50 Q250 130 500 50 Q750 130 1000 50 Q1250 130 1500 50 Q1750 130 2000 50 Q2250 130 2500 50" stroke="#8C7FB8" stroke-width="3" fill="none"/></svg>
        ${bulbs}
        <div style="position:absolute;left:1300px;top:380px;width:600px;height:560px;border-radius:26px;background:#fff;box-shadow:0 16px 30px rgba(90,70,140,.2)">
          <div style="position:absolute;inset:20px;border-radius:14px;overflow:hidden;background:linear-gradient(180deg,#2E2A63 0%,#4B4390 55%,#7C6DB8 100%)">${stars}
            <div style="position:absolute;left:400px;top:50px;width:90px;height:90px;border-radius:50%;background:#FFF3C4;box-shadow:0 0 40px 10px rgba(255,243,196,.5)"></div><div style="position:absolute;left:426px;top:40px;width:84px;height:84px;border-radius:50%;background:#3A3478"></div>
            ${[...Array(7)].map((_, i) => `<div style="position:absolute;left:${-10 + i * 82}px;bottom:0;width:${66 + (i * 13) % 26}px;height:${120 + (i * 47) % 140}px;background:#26224F;border-radius:6px 6px 0 0">${[...Array(6)].map((_, k) => `<div style="position:absolute;left:${10 + (k % 2) * 26}px;top:${14 + Math.floor(k / 2) * 30}px;width:12px;height:14px;background:${(i + k) % 3 ? '#FFE38A' : '#4A4580'};opacity:.9"></div>`).join('')}</div>`).join('')}</div>
          <div style="position:absolute;left:290px;top:20px;width:20px;bottom:20px;background:#fff"></div></div>
        <div style="position:absolute;left:1220px;top:340px;width:150px;height:640px;border-radius:20px 20px 60px 20px;background:linear-gradient(90deg,#F5A9C7,#F8CFE2);box-shadow:inset -12px 0 0 rgba(0,0,0,.05)"></div>
        <div style="position:absolute;left:1830px;top:340px;width:150px;height:640px;border-radius:20px 20px 20px 60px;background:linear-gradient(90deg,#F8CFE2,#F5A9C7)"></div>
        <div style="position:absolute;left:1190px;top:320px;width:820px;height:28px;border-radius:14px;background:#B9A9D9"></div>
        <div style="position:absolute;left:560px;top:420px;width:300px;height:400px;border-radius:18px;background:linear-gradient(160deg,#95BFEF,#9C8FE6);box-shadow:0 0 0 14px #fff,0 14px 24px rgba(90,70,140,.18)">
          <div style="position:absolute;left:60px;top:70px;width:180px;height:180px;border-radius:50%;background:#FFD6E6;opacity:.9"></div><div style="position:absolute;left:40px;top:280px;width:220px;height:22px;border-radius:11px;background:#fff;opacity:.8"></div><div style="position:absolute;left:80px;top:320px;width:140px;height:16px;border-radius:8px;background:#fff;opacity:.6"></div></div>
        <div style="position:absolute;left:2120px;top:470px;width:140px;height:140px;border-radius:50%;background:#fff;box-shadow:inset 0 0 0 10px #B9A9D9"><div style="position:absolute;left:66px;top:30px;width:8px;height:44px;border-radius:4px;background:#5B6B86"></div><div style="position:absolute;left:68px;top:66px;width:40px;height:8px;border-radius:4px;background:#5B6B86"></div></div>
        <div style="position:absolute;left:0;top:1200px;width:2400px;height:200px;background:linear-gradient(180deg,#CFC6EC,#C3B9E6)"></div>`);
    const mid = W.layer(.8, `
        <div style="position:absolute;left:120px;top:640px;width:380px;height:700px;border-radius:20px;background:#E9DDF6;box-shadow:inset 0 0 0 14px #CDBCEB,0 18px 30px rgba(90,70,140,.15)">
          ${[0, 1, 2, 3].map(r => `<div style="position:absolute;left:14px;right:14px;top:${150 + r * 160}px;height:14px;background:#CDBCEB"></div>${[...Array(5)].map((_, k) => `<div style="position:absolute;left:${40 + k * 58}px;top:${50 + r * 160 + (k % 2) * 14}px;width:${40 + (k % 3) * 6}px;height:${100 - (k % 2) * 14}px;border-radius:6px;background:${['#F5A9C7', '#95BFEF', '#FFD36E', '#9ED8B0', '#B3A4E6'][(k + r) % 5]}"></div>`).join('')}`).join('')}</div>
        <div style="position:absolute;left:640px;top:760px;width:16px;height:600px;background:#8C7FB8;border-radius:8px"></div>
        <div style="position:absolute;left:560px;top:690px;width:180px;height:110px;border-radius:30px 30px 60px 60px;background:linear-gradient(180deg,#FFF3D6,#FFE09A)"></div>
        <div style="position:absolute;left:380px;top:640px;width:540px;height:540px;border-radius:50%;background:radial-gradient(circle,rgba(255,224,150,.55),rgba(255,224,150,0) 65%)"></div>`);
    const ground = W.layer(1, `
        <div style="position:absolute;left:0;top:1380px;width:2400px;height:600px;background:linear-gradient(180deg,#CDB7A6 0%,#D9C6B6 50%,#E2D2C4 100%)"></div>
        <div style="position:absolute;left:0;top:1380px;width:2400px;height:600px;background-image:linear-gradient(90deg,rgba(150,120,100,.35) 3px,transparent 3px);background-size:180px 100%"></div>
        <div style="position:absolute;left:700px;top:1600px;width:1000px;height:260px;border-radius:50%;background:radial-gradient(ellipse,#F8CFE2 0%,#F5A9C7 70%);opacity:.9"></div>
        <div class="behind" style="position:absolute;inset:0"></div><div class="actors" style="position:absolute;inset:0"></div><div class="front" style="position:absolute;inset:0"></div>`);
    // sofa: back cushion behind the actor (centre x = 1200), seat + arms in front
    ground.querySelector('.behind').innerHTML = `
        <div style="position:absolute;left:820px;top:1110px;width:760px;height:330px;border-radius:70px 70px 20px 20px;background:linear-gradient(180deg,#8FD3BA,#6FC09B);box-shadow:0 14px 24px rgba(40,90,70,.18)"></div>
        <div style="position:absolute;left:860px;top:1140px;width:330px;height:260px;border-radius:50px;background:linear-gradient(180deg,#A3DCC6,#82CCAE)"></div>
        <div style="position:absolute;left:1210px;top:1140px;width:330px;height:260px;border-radius:50px;background:linear-gradient(180deg,#A3DCC6,#82CCAE)"></div>
        <div style="position:absolute;left:1380px;top:1230px;width:130px;height:120px;border-radius:30px;background:#FFD36E;transform:rotate(12deg)"></div>`;
    ground.querySelector('.front').innerHTML = `
        <div style="position:absolute;left:780px;top:1400px;width:840px;height:150px;border-radius:40px;background:linear-gradient(180deg,#9AD9C1,#6FC09B);box-shadow:inset 0 10px 0 rgba(255,255,255,.35)"></div>
        <div style="position:absolute;left:740px;top:1270px;width:120px;height:300px;border-radius:50px;background:linear-gradient(90deg,#7ECBAA,#6FC09B)"></div>
        <div style="position:absolute;left:1540px;top:1270px;width:120px;height:300px;border-radius:50px;background:linear-gradient(90deg,#6FC09B,#5DB38D)"></div>
        <div style="position:absolute;left:800px;top:1540px;width:30px;height:50px;border-radius:8px;background:#8C7FB8"></div><div style="position:absolute;left:1570px;top:1540px;width:30px;height:50px;border-radius:8px;background:#8C7FB8"></div>
        <div style="position:absolute;left:880px;top:1600px;width:640px;height:50px;border-radius:25px;background:#FFFFFF;box-shadow:0 8px 0 #B9A9D9,0 20px 30px rgba(90,70,140,.2)"></div>
        <div style="position:absolute;left:930px;top:1646px;width:24px;height:200px;background:#B9A9D9"></div><div style="position:absolute;left:1446px;top:1646px;width:24px;height:200px;background:#B9A9D9"></div>
        <div style="position:absolute;left:960px;top:1530px;width:110px;height:90px;border-radius:14px 14px 20px 20px;background:linear-gradient(180deg,#FFB86B,#FF9A4D);transform:rotate(-8deg)"><div style="position:absolute;left:20px;top:26px;width:70px;height:30px;border-radius:50%;background:#FFE3B8"></div></div>
        <div style="position:absolute;left:1340px;top:1550px;width:64px;height:60px;border-radius:10px 10px 18px 18px;background:#fff;box-shadow:inset 0 -18px 0 #95BFEF"></div>`;
    const fore = W.layer(1.35, `<div style="position:absolute;inset:0;filter:blur(8px)">
        <div style="position:absolute;left:-60px;top:1450px;width:460px;height:460px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#D9CCF4,#B3A4E6)"></div>
        <div style="position:absolute;left:2050px;top:1450px;width:480px;height:460px;border-radius:50%;background:radial-gradient(circle at 40% 30%,#C7EFD3,#7CC79A)"></div></div>`);
    const layers = [back, mid, ground, fore];
    const camera = W.finish(layers, fore, 'background:linear-gradient(180deg,rgba(90,70,160,.10),rgba(255,190,140,.08));mix-blend-mode:multiply');
    const fl = [...back.querySelectorAll('.fl')];
    const cam2 = (cx, cy, z, t = 0, dof = 0) => { camera(cx, cy, z, t, dof); fl.forEach((b, i) => { b.style.opacity = .65 + .35 * Math.sin(t * 2.2 + i * 1.3); }); };
    return { actors: ground.querySelector('.actors'), front: ground.querySelector('.front'), camera: cam2, layers };
  }

  window.SETS = { cafe, room };
})();
