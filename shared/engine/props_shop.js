// NaiSibPro retail set + price props (shared, EP13+). Bright pastel boutique in 2.5D: arched display niche,
// wall shelves, pendant lamps, neon % sign, cashier counter and a marble plinth for the hero product.
// Same parallax camera contract as OFFICE.office(): camera(cx, cy, z, t, dof).
// Props: tumbler (hero product, one design everywhere), swing price tag with an odometer, 3D percent coin,
// mousetrap with a % bait (the "trap" motif), hanging promotion sign.
(function () {
  const { h, clamp, lerp, E } = window.NSP;
  let uid = 0;

  // ------------------------------------------------------------------ product: insulated tumbler (cylinder shading, spinnable label)
  // pal: body / lid colours. spin(a) slides the wrap-around label like a turntable (a in turns).
  const TUMBLER_PALS = {
    blue: { b0: '#5C8CCB', b1: '#8DB7EC', b2: '#E6F1FD', lid0: '#E86F9E', lid1: '#FFB3CF', band: '#FFFFFF', ink: '#EE7FAA' },
    mint: { b0: '#3E9C84', b1: '#86D6BE', b2: '#E8FBF4', lid0: '#3E7BD6', lid1: '#9CC3EE', band: '#FFFFFF', ink: '#3E7BD6' },
    peach: { b0: '#D9845F', b1: '#F7BE9F', b2: '#FFF1E8', lid0: '#7C67D9', lid1: '#BFB2F5', band: '#FFFFFF', ink: '#7C67D9' },
    lav: { b0: '#7C67D9', b1: '#B9AAF2', b2: '#F3EFFF', lid0: '#3E9C84', lid1: '#9FDCC0', band: '#FFFFFF', ink: '#3E9C84' },
  };
  function tumbler(hgt = 300, pal = 'blue') {
    const c = TUMBLER_PALS[pal], id = 'tb' + (++uid), w = hgt * .5;
    const el = h(`<div style="position:absolute;width:${w}px;height:${hgt}px"><svg width="${w}" height="${hgt}" viewBox="0 0 200 400" style="overflow:visible;display:block">
      <defs>
        <linearGradient id="${id}b" x1="0" x2="1"><stop offset="0" stop-color="${c.b0}"/><stop offset=".16" stop-color="${c.b1}"/><stop offset=".36" stop-color="${c.b2}"/><stop offset=".44" stop-color="#FFFFFF"/><stop offset=".58" stop-color="${c.b1}"/><stop offset=".86" stop-color="${c.b0}"/><stop offset="1" stop-color="${c.b0}"/></linearGradient>
        <linearGradient id="${id}l" x1="0" x2="1"><stop offset="0" stop-color="${c.lid0}"/><stop offset=".38" stop-color="${c.lid1}"/><stop offset=".5" stop-color="#FFF3F8"/><stop offset=".66" stop-color="${c.lid1}"/><stop offset="1" stop-color="${c.lid0}"/></linearGradient>
        <linearGradient id="${id}sh" x1="0" x2="1"><stop offset="0" stop-color="#000" stop-opacity=".22"/><stop offset=".3" stop-color="#000" stop-opacity="0"/><stop offset=".72" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".28"/></linearGradient>
        <clipPath id="${id}c"><path d="M32 112 L168 112 L160 368 Q158 386 140 388 L60 388 Q42 386 40 368 Z"/></clipPath>
      </defs>
      <ellipse cx="100" cy="392" rx="78" ry="12" fill="rgba(40,40,80,.28)"/>
      <path d="M32 112 L168 112 L160 368 Q158 386 140 388 L60 388 Q42 386 40 368 Z" fill="url(#${id}b)"/>
      <g clip-path="url(#${id}c)">
        <rect x="0" y="214" width="200" height="74" fill="${c.band}" opacity=".96"/>
        <g class="tb-wrap">${[...Array(9)].map((_, i) => `<g transform="translate(${i * 70 - 140} 0)"><circle cx="35" cy="251" r="17" fill="${c.ink}"/><path d="M27 251 l6 6 l11 -12" stroke="#fff" stroke-width="5" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`).join('')}</g>
        <rect x="0" y="214" width="200" height="5" fill="${c.ink}" opacity=".55"/><rect x="0" y="283" width="200" height="5" fill="${c.ink}" opacity=".55"/>
        <rect x="0" y="100" width="200" height="300" fill="url(#${id}sh)"/>
        <rect x="70" y="112" width="16" height="276" rx="8" fill="#fff" opacity=".55" style="filter:blur(3px)"/>
        <rect x="148" y="112" width="6" height="276" rx="3" fill="#fff" opacity=".35"/>
      </g>
      <path d="M32 112 L168 112 L160 368 Q158 386 140 388 L60 388 Q42 386 40 368 Z" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="2"/>
      <rect x="26" y="66" width="148" height="50" rx="14" fill="url(#${id}l)"/>
      <rect x="26" y="104" width="148" height="12" rx="6" fill="${c.lid0}" opacity=".55"/>
      <path d="M62 66 Q62 22 100 22 Q138 22 138 66" fill="none" stroke="${c.lid0}" stroke-width="14" stroke-linecap="round"/>
      <path d="M68 62 Q70 32 100 30" fill="none" stroke="#fff" stroke-width="4" stroke-linecap="round" opacity=".55"/>
      <rect x="44" y="72" width="44" height="10" rx="5" fill="#fff" opacity=".6"/>
    </svg></div>`);
    const wrap = el.querySelector('.tb-wrap');
    el.spin = a => { wrap.setAttribute('transform', `translate(${(((a % 1) + 1) % 1) * 70} 0)`); };
    el.W = w; el.H = hgt;
    return el;
  }

  // ------------------------------------------------------------------ odometer (rolling digits; true carry like a mechanical counter)
  function odometer({ digits = 3, size = 100, color = '#31445D', weight = 800 } = {}) {
    const lh = size * 1.12, dw = size * .64;
    const el = h(`<div class="odo" style="position:relative;display:inline-flex;height:${lh}px;font-family:Prompt;font-weight:${weight};font-size:${size}px;line-height:${lh}px;color:${color};font-variant-numeric:tabular-nums">
      ${[...Array(digits)].map(() => `<div class="odw" style="position:relative;width:${dw}px;height:${lh}px;overflow:hidden"><div class="ods" style="position:absolute;left:0;top:0;width:100%;text-align:center">${[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 0].map(d => `<div style="height:${lh}px">${d}</div>`).join('')}</div></div>`).join('')}
      <div class="odq" style="position:absolute;inset:0;display:grid;place-items:center;opacity:0">?</div></div>`);
    const wins = [...el.querySelectorAll('.odw')].reverse(), strips = wins.map(w => w.querySelector('.ods')), q = el.querySelector('.odq');
    // v: value (may be fractional while rolling), vel: |dv/dt| for motion blur, qa: 0..1 crossfade to "?"
    el.set = (v, { vel = 0, qa = 0 } = {}) => {
      strips.forEach((s, k) => {
        const p = Math.pow(10, k), low = v % p, carry = k === 0 ? 0 : clamp(low - (p - 1));
        let pos = k === 0 ? v % 10 : (Math.floor(v / p) % 10) + carry;
        pos = ((pos % 10) + 10) % 10;
        s.style.transform = `translateY(${-pos * lh}px)`;
        const blur = clamp(vel / Math.pow(10, k) / 30) * 5;
        s.style.filter = blur > .2 ? `blur(${blur}px)` : '';
        // hide leading zeros (fade while the leading digit rolls away)
        const lead = k === 0 ? 1 : clamp(v - (p - 1));
        wins[k].style.opacity = lead * (1 - qa);
        wins[k].style.width = dw * lead + 'px';
      });
      q.style.opacity = qa;
      el.dataset.v = v.toFixed(3); el.dataset.qa = qa.toFixed(3);   // read by EP13/qa/spoiler_audit.js
      q.style.transform = `scale(${lerp(.6, 1, E.back(qa))})`;
    };
    el.set(0);
    return el;
  }

  // ------------------------------------------------------------------ swing price tag (thick card, hole + string, odometer price)
  function tag({ w = 360, label = 'ราคา', size = 104, accent = '#3E7BD6' } = {}) {
    const hgt = w * .58, id = 'tg' + (++uid);
    const shape = 'polygon(16% 0,100% 0,100% 100%,16% 100%,0 50%)';
    const el = h(`<div class="shop-tag" style="position:absolute;width:${w}px;height:${hgt}px;transform-origin:0% 50%">
      <div class="tg-edge" style="position:absolute;inset:0;transform:translate(7px,9px);clip-path:${shape};background:linear-gradient(180deg,#C9D6E8,#A9BAD3);filter:drop-shadow(0 0 0 #000)"></div>
      <div class="tg-face" style="position:absolute;inset:0;clip-path:${shape};background:linear-gradient(160deg,#FFFFFF 0%,#F4F8FE 55%,#E4EEFB 100%)">
        <div style="position:absolute;left:16%;top:0;bottom:0;width:10px;background:${accent}"></div>
        <div class="tg-gl" style="position:absolute;left:-40%;top:-60%;width:40%;height:220%;background:linear-gradient(90deg,rgba(255,255,255,0),rgba(255,255,255,.85),rgba(255,255,255,0));transform:rotate(18deg)"></div>
      </div>
      <div style="position:absolute;left:${w * .055}px;top:${hgt / 2 - w * .032}px;width:${w * .064}px;height:${w * .064}px;border-radius:50%;background:#9FB2CC;box-shadow:inset 0 3px 4px rgba(0,0,0,.35),0 0 0 4px #D7E3F3"></div>
      <div class="tg-in" style="position:absolute;left:${w * .21}px;right:${w * .05}px;top:0;bottom:0;display:flex;flex-direction:column;justify-content:center">
        <div class="tg-lbl" style="font-family:Prompt;font-weight:600;font-size:${size * .3}px;color:#7A8BA3;line-height:1.1">${label}</div>
        <div class="tg-row" style="display:flex;align-items:baseline;gap:${size * .1}px"><span class="tg-odo"></span><span class="tg-unit" style="font-family:Prompt;font-weight:700;font-size:${size * .36}px;color:#31445D">บาท</span></div>
      </div></div>`);
    const odo = odometer({ digits: 3, size, color: '#31445D' });
    el.querySelector('.tg-odo').appendChild(odo);
    const gl = el.querySelector('.tg-gl');
    el.odo = odo; el.W = w; el.H = hgt;
    el.hole = () => [w * .087, hgt / 2];        // string anchor in tag-local px
    el.glint = p => { gl.style.transform = `translateX(${p * w * 1.6}px) rotate(18deg)`; };
    el.label = el.querySelector('.tg-lbl');
    return el;
  }

  // ------------------------------------------------------------------ 3D percent coin (extruded disc; spins in real CSS 3D)
  function badge(text, { kind = 'up', size = 170 } = {}) {
    const C = kind === 'up' ? ['#1C8A55', '#2FB874', '#7BE3AD', '#E9FFF3'] : ['#B5233B', '#E8445A', '#FF8A9A', '#FFF0F2'];
    const depth = Math.round(size * .09), layers = 10;
    const face = back => `<div style="position:absolute;inset:0;border-radius:50%;background:radial-gradient(circle at 34% 28%,${C[3]} 0%,${C[2]} 22%,${C[1]} 55%,${C[0]} 100%);box-shadow:inset 0 0 0 ${size * .045}px rgba(255,255,255,.55),inset 0 -${size * .06}px ${size * .08}px rgba(0,0,0,.18);display:grid;place-items:center;backface-visibility:hidden;transform:${back ? `rotateY(180deg) translateZ(${depth / 2}px)` : `translateZ(${depth / 2}px)`}">
        <div style="font-family:Prompt;font-weight:800;font-size:${size * .25}px;color:#fff;letter-spacing:-.5px;text-shadow:0 ${size * .02}px 0 ${C[0]},0 ${size * .04}px ${size * .06}px rgba(0,0,0,.25);white-space:nowrap">${text}</div>
        <div style="position:absolute;left:18%;top:10%;width:46%;height:24%;border-radius:50%;background:linear-gradient(180deg,rgba(255,255,255,.75),rgba(255,255,255,0))"></div></div>`;
    const rims = [...Array(layers)].map((_, i) => `<div style="position:absolute;inset:0;border-radius:50%;background:${i % 2 ? C[0] : C[1]};transform:translateZ(${-depth / 2 + depth * i / (layers - 1)}px)"></div>`).join('');
    const el = h(`<div class="pbadge" style="position:absolute;width:${size}px;height:${size}px">
      <div class="pb-sh" style="position:absolute;left:10%;top:88%;width:80%;height:18%;border-radius:50%;background:radial-gradient(ellipse,rgba(30,40,80,.32),rgba(30,40,80,0) 70%)"></div>
      <div class="pb-3d" style="position:absolute;inset:0;transform-style:preserve-3d">${rims}${face(false)}${face(true)}</div></div>`);
    const d3 = el.querySelector('.pb-3d');
    // place: x,y top-left px; ry/rx deg; s scale; o opacity
    el.set = ({ x = 0, y = 0, ry = 0, rx = 0, rz = 0, s = 1, o = 1 }) => {
      el.style.transform = `translate(${x}px,${y}px) scale(${s})`;
      el.style.opacity = o; el.style.visibility = o <= .001 ? 'hidden' : 'visible';
      d3.style.transform = `perspective(${size * 6}px) rotateZ(${rz}deg) rotateX(${rx}deg) rotateY(${ry}deg)`;
    };
    el.S = size;
    return el;
  }

  // ------------------------------------------------------------------ mousetrap with a % bait (the trap motif)
  function trap(w = 320) {
    const el = h(`<div style="position:absolute;width:${w}px;height:${w * .62}px"><svg width="${w}" height="${w * .62}" viewBox="0 0 320 200" style="overflow:visible;display:block">
      <defs><linearGradient id="trw${++uid}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#F2C894"/><stop offset="1" stop-color="#C98F57"/></linearGradient></defs>
      <ellipse cx="160" cy="190" rx="150" ry="12" fill="rgba(40,40,80,.25)"/>
      <path d="M20 120 L300 120 L300 170 Q300 182 288 182 L32 182 Q20 182 20 170 Z" fill="#B57B45"/>
      <path d="M20 112 Q20 100 32 100 L288 100 Q300 100 300 112 L300 128 L20 128 Z" fill="url(#trw${uid})"/>
      <path d="M40 112 Q120 106 200 114 T290 112" stroke="#D9A46C" stroke-width="3" fill="none" opacity=".7"/>
      <rect x="196" y="96" width="52" height="16" rx="5" fill="#AEB8C8"/><circle cx="222" cy="104" r="5" fill="#7D889C"/>
      <g class="tr-bait" transform="translate(200 62)"><path d="M0 34 L52 34 L46 0 Z" fill="#FFD36E" stroke="#E7B84A" stroke-width="3" stroke-linejoin="round"/>
        <text x="30" y="30" font-family="Prompt" font-weight="800" font-size="22" text-anchor="middle" fill="#B8862B">%</text></g>
      <path d="M150 104 Q150 92 162 92" stroke="#7D889C" stroke-width="6" fill="none"/>
      <g class="tr-bar" transform="translate(150 106)"><path d="M0 0 L-128 0 L-128 -10 L0 -10" fill="none" stroke="#9AA6B8" stroke-width="8" stroke-linejoin="round" stroke-linecap="round"/>
        <path d="M-6 0 L-122 0" stroke="#E4E9F1" stroke-width="3" stroke-linecap="round"/></g>
      <circle cx="150" cy="104" r="9" fill="#7D889C"/><circle cx="150" cy="104" r="4" fill="#C9D1DE"/>
    </svg></div>`);
    const bar = el.querySelector('.tr-bar');
    // k: 0 = set (bar lies back to the left), 1 = snapped shut (bar swung over to the right)
    el.snap = k => bar.setAttribute('transform', `translate(150 106) rotate(${lerp(0, 168, k)})`);
    el.snap(0);
    return el;
  }

  // ------------------------------------------------------------------ hanging promotion sign
  function promoSign(w = 420, line1 = 'โปรโมชั่น', line2 = 'ลด 20%') {
    return h(`<div style="position:absolute;width:${w}px;height:${w * .62 + 120}px;transform-origin:50% 0">
      <svg width="${w}" height="120" viewBox="0 0 ${w} 120" style="position:absolute;left:0;top:0;overflow:visible"><path d="M${w * .2} 120 L${w / 2} 0 L${w * .8} 120" stroke="#8A97AD" stroke-width="5" fill="none"/><circle cx="${w / 2}" cy="0" r="9" fill="#C9D1DE"/></svg>
      <div style="position:absolute;left:0;top:112px;width:${w}px;height:${w * .62}px;border-radius:28px;background:linear-gradient(180deg,#F25A6E,#D3263E);box-shadow:0 10px 0 #A81D33,0 24px 40px rgba(120,20,40,.35),inset 0 4px 0 rgba(255,255,255,.35);display:flex;flex-direction:column;align-items:center;justify-content:center">
        <div style="position:absolute;inset:12px;border-radius:20px;border:4px dashed rgba(255,255,255,.55)"></div>
        <div style="font-family:Prompt;font-weight:700;font-size:${w * .1}px;color:#FFE3E8;line-height:1.2">${line1}</div>
        <div style="font-family:Prompt;font-weight:800;font-size:${w * .2}px;color:#fff;line-height:1.15;text-shadow:0 4px 0 #A81D33">${line2}</div></div></div>`);
  }

  // ------------------------------------------------------------------ the boutique set
  function shop(root) {
    const layer = (cls, p, html) => { const el = h(`<div class="lyr ${cls}" style="position:absolute;left:0;top:0;width:2400px;height:1920px;transform-origin:0 0">${html}</div>`); el.p = p; root.appendChild(el); return el; };
    root.appendChild(h(`<div style="position:absolute;inset:0;background:linear-gradient(180deg,#B9D3F1 0%,#CFE2F7 50%,#E4EEFA 100%)"></div>`));
    const FLOOR = 1290;
    // ---- far wall: ceiling band with downlights, wall slats, arched display niche, wall shelves, neon %
    const downl = [...Array(9)].map((_, i) => `<div style="position:absolute;left:${120 + i * 270}px;top:96px;width:60px;height:14px;border-radius:7px;background:#FFF8E6;box-shadow:0 0 30px 10px rgba(255,236,190,.65)"></div>`).join('');
    const slats = [...Array(40)].map((_, i) => `<div style="position:absolute;left:${i * 60}px;top:120px;width:2px;height:${FLOOR - 120}px;background:rgba(255,255,255,.28)"></div>`).join('');
    const prodRow = (x, y, list) => list.map(([kind, pal, dx, hh], i) => {
      if (kind === 't') return `<div style="position:absolute;left:${x + dx}px;top:${y - hh}px">${tumbler(hh, pal).innerHTML}</div>`;
      if (kind === 'b') return `<div style="position:absolute;left:${x + dx}px;top:${y - hh}px;width:${hh * .8}px;height:${hh}px;border-radius:10px;background:linear-gradient(90deg,${pal},${pal}CC);box-shadow:inset -10px 0 0 rgba(0,0,0,.08),0 8px 14px rgba(40,50,90,.18)"><div style="position:absolute;left:18%;right:18%;top:22%;height:16%;border-radius:6px;background:rgba(255,255,255,.75)"></div></div>`;
      return `<div style="position:absolute;left:${x + dx}px;top:${y - hh}px;width:${hh * .7}px;height:${hh}px"><div style="position:absolute;left:20%;bottom:0;width:60%;height:40%;border-radius:8px 8px 18px 18px;background:#F7F4EC;box-shadow:inset -6px 0 0 rgba(0,0,0,.06)"></div><div style="position:absolute;left:0;top:0;width:100%;height:70%;border-radius:50% 50% 40% 40%;background:radial-gradient(circle at 40% 30%,#BDEBCB,#5FB485)"></div></div>`;
    }).join('');
    const shelf = (x, y, wd) => `<div style="position:absolute;left:${x}px;top:${y}px;width:${wd}px;height:22px;border-radius:6px;background:linear-gradient(180deg,#FFFFFF,#E3EAF4);box-shadow:0 14px 18px rgba(40,50,90,.22)"></div><div style="position:absolute;left:${x + 10}px;top:${y + 22}px;width:${wd - 20}px;height:6px;background:rgba(255,236,190,.8);box-shadow:0 0 18px 6px rgba(255,236,190,.55)"></div>`;
    const wallUnit = (x, flip) => `${shelf(x, 560, 600)}${shelf(x, 820, 600)}${shelf(x, 1080, 600)}
      ${prodRow(x, 560, flip ? [['p', 0, 30, 130], ['t', 'mint', 170, 150], ['t', 'peach', 270, 150], ['b', '#F5A9C7', 400, 120], ['b', '#B8D9F8', 500, 90]] : [['b', '#B8D9F8', 20, 100], ['b', '#F5A9C7', 110, 130], ['t', 'lav', 260, 150], ['t', 'mint', 360, 150], ['p', 0, 470, 130]])}
      ${prodRow(x, 820, flip ? [['t', 'lav', 40, 150], ['t', 'blue', 140, 150], ['b', '#FFD36E', 280, 110], ['p', 0, 420, 120]] : [['p', 0, 40, 120], ['b', '#9AD7D8', 170, 110], ['t', 'peach', 330, 150], ['t', 'blue', 430, 150]])}
      ${prodRow(x, 1080, flip ? [['b', '#D9C6F2', 30, 120], ['b', '#F8CFE2', 130, 90], ['t', 'mint', 280, 150], ['t', 'peach', 380, 150]] : [['t', 'blue', 40, 150], ['t', 'lav', 140, 150], ['b', '#FFD36E', 300, 100], ['b', '#B8D9F8', 410, 130]])}`;
    const neon = `<div style="position:absolute;left:420px;top:250px;width:240px;height:240px;border-radius:50%;background:radial-gradient(circle,rgba(255,140,190,.35),rgba(255,140,190,0) 70%)"></div>
      <div style="position:absolute;left:440px;top:256px;width:200px;text-align:center;font-family:Prompt;font-weight:600;font-size:200px;line-height:1;color:#FFE6F1;text-shadow:0 0 6px #FF9CC4,0 0 18px #FF5FA0,0 0 40px #FF5FA0,0 0 70px rgba(255,95,160,.7)">%</div>`;
    const tagNeon = `<div style="position:absolute;left:1840px;top:290px;width:180px;height:110px;border:7px solid #E8F6FF;border-radius:16px 50px 50px 16px;box-shadow:0 0 10px #8FD0FF,0 0 30px #5EB8FF,inset 0 0 10px #8FD0FF"><div style="position:absolute;left:24px;top:36px;width:24px;height:24px;border-radius:50%;border:6px solid #E8F6FF;box-shadow:0 0 10px #8FD0FF"></div></div>`;
    const niche = `<div style="position:absolute;left:880px;top:300px;width:640px;height:${FLOOR - 300}px;border-radius:320px 320px 0 0;background:linear-gradient(180deg,#FBE3EE 0%,#F6CFE0 60%,#F1C0D6 100%);box-shadow:inset 0 0 0 16px rgba(255,255,255,.65),inset 0 40px 80px rgba(255,255,255,.6),0 0 60px rgba(255,200,225,.6)"></div>
      <div style="position:absolute;left:910px;top:330px;width:580px;height:${FLOOR - 330}px;border-radius:290px 290px 0 0;border:5px solid rgba(255,248,230,.95);border-bottom:none;box-shadow:0 0 24px rgba(255,236,190,.9),inset 0 0 24px rgba(255,236,190,.6)"></div>
      <div style="position:absolute;left:1000px;top:420px;width:400px;height:400px;border-radius:50%;background:radial-gradient(circle,rgba(255,255,255,.75),rgba(255,255,255,0) 70%)"></div>`;
    const far = layer('far', .4, `${downl}${slats}${niche}${wallUnit(150, false)}${wallUnit(1650, true)}${neon}${tagNeon}`);
    // ---- light: pendant lamps + warm cones
    const lamp = x => `<div style="position:absolute;left:${x - 2}px;top:0;width:4px;height:250px;background:#8A97AD"></div>
      <div style="position:absolute;left:${x - 80}px;top:240px;width:160px;height:80px;border-radius:80px 80px 10px 10px;background:linear-gradient(180deg,#F6D77E,#D9A53A);box-shadow:inset 0 -8px 0 rgba(0,0,0,.12)"></div>
      <div style="position:absolute;left:${x - 50}px;top:312px;width:100px;height:22px;border-radius:50%;background:#FFF8E0;box-shadow:0 0 40px 18px rgba(255,236,190,.85)"></div>`;
    const beams = layer('beams', .55, `${lamp(760)}${lamp(1640)}
      <div class="spot" style="position:absolute;left:900px;top:0;width:600px;height:1500px;background:linear-gradient(180deg,rgba(255,246,220,.55),rgba(255,246,220,0) 92%);clip-path:polygon(38% 0,62% 0,100% 100%,0 100%);mix-blend-mode:screen"></div>`);
    // ---- mid: plants flanking the niche, round display tables
    const plant = (x, s = 1) => `<div style="position:absolute;left:${x}px;top:${FLOOR + 30 - 420 * s}px;width:${240 * s}px;height:${420 * s}px">
        <div style="position:absolute;left:24%;bottom:0;width:52%;height:30%;border-radius:12px 12px 34px 34px;background:linear-gradient(90deg,#F7F4EC,#E2DCCD);box-shadow:inset -10px 0 0 rgba(0,0,0,.05)"></div>
        ${[[-6, 0, 66, -64], [30, -6, 70, -10], [52, 8, 64, 40], [8, 22, 62, -36], [36, 26, 56, 16]].map(([lx, ly, w, r]) => `<div style="position:absolute;left:${lx}%;top:${ly}%;width:${w}%;height:44%;border-radius:50% 50% 50% 0;background:radial-gradient(circle at 40% 30%,#C6EFD2,#4FA877);transform:rotate(${r}deg)"></div>`).join('')}</div>`;
    const dtable = (x, items) => `<div style="position:absolute;left:${x}px;top:${FLOOR - 120}px;width:380px;height:260px">
        <div style="position:absolute;left:150px;top:40px;width:80px;height:220px;background:linear-gradient(90deg,#E9EEF5,#C9D3E2)"></div>
        <div style="position:absolute;left:0;top:20px;width:380px;height:56px;border-radius:50%;background:linear-gradient(180deg,#FFFFFF,#DCE5F2);box-shadow:0 12px 20px rgba(40,50,90,.2)"></div>${items}</div>`;
    const mid = layer('mid', .72, `<div style="position:absolute;inset:0">${plant(700, 1.1)}${plant(1500, 1.05)}
      ${dtable(160, prodRow(0, 44, [['b', '#F5A9C7', 70, 90], ['t', 'mint', 160, 120], ['b', '#B8D9F8', 250, 70]]))}
      ${dtable(1880, prodRow(0, 44, [['t', 'peach', 80, 120], ['b', '#D9C6F2', 170, 90], ['b', '#FFD36E', 260, 64]]))}</div>`);
    // ---- ground: glossy floor, marble plinth with the hero product, actors, cashier counter front
    const ground = layer('ground', 1, `
      <div style="position:absolute;left:0;top:${FLOOR}px;width:2400px;height:900px;background:linear-gradient(180deg,#EADFD3 0%,#F4EDE5 30%,#FBF7F2 100%)"></div>
      <div style="position:absolute;left:0;top:${FLOOR}px;width:2400px;height:900px;background-image:linear-gradient(90deg,rgba(160,140,120,.14) 2px,transparent 2px),linear-gradient(180deg,rgba(160,140,120,.12) 2px,transparent 2px);background-size:200px 100%,100% 120px"></div>
      <div style="position:absolute;left:0;top:${FLOOR}px;width:2400px;height:36px;background:linear-gradient(180deg,rgba(60,60,100,.18),rgba(60,60,100,0))"></div>
      <div style="position:absolute;left:820px;top:${FLOOR + 60}px;width:760px;height:180px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,236,200,.9) 0%,rgba(255,236,200,.4) 45%,rgba(255,236,200,0) 70%)"></div>
      <div class="plinth" style="position:absolute;left:1040px;top:1160px;width:320px;height:250px">
        <div style="position:absolute;left:0;top:24px;width:320px;height:200px;background:linear-gradient(90deg,#D9DEE8 0%,#F7F9FC 30%,#FFFFFF 45%,#E7ECF3 70%,#C8D0DC 100%)"></div>
        <div style="position:absolute;left:0;top:200px;width:320px;height:50px;border-radius:50%;background:linear-gradient(90deg,#C8D0DC,#E7ECF3 50%,#C8D0DC)"></div>
        <div style="position:absolute;left:0;top:186px;width:320px;height:14px;background:linear-gradient(90deg,#B8862B,#F6D77E 45%,#B8862B)"></div>
        <div style="position:absolute;left:0;top:0;width:320px;height:50px;border-radius:50%;background:radial-gradient(ellipse at 45% 40%,#FFFFFF,#E8EDF4 70%,#D3DAE5);box-shadow:inset 0 -3px 0 rgba(0,0,0,.05)"></div>
        <div class="w-prod" style="position:absolute;left:122.5px;top:-121px"></div></div>
      <div class="actors" style="position:absolute;left:0;top:0;width:2400px;height:1920px"></div>
      <div class="ctr" style="position:absolute;left:1560px;top:1250px;width:620px;height:300px">
        <div style="position:absolute;left:0;top:40px;width:620px;height:260px;border-radius:0 0 22px 22px;background:linear-gradient(180deg,#FFFFFF,#E6EDF6);box-shadow:inset 0 10px 0 rgba(0,0,0,.04)"></div>
        <div style="position:absolute;left:40px;top:90px;width:540px;height:150px;border-radius:18px;background:linear-gradient(90deg,#F8CFE2,#DCE9FA);box-shadow:inset 0 0 0 8px rgba(255,255,255,.6)"></div>
        <div style="position:absolute;left:0;top:0;width:620px;height:52px;border-radius:16px;background:linear-gradient(180deg,#F6D77E,#D9A53A);box-shadow:0 14px 22px rgba(80,60,30,.25)"></div>
        <div style="position:absolute;left:380px;top:-120px;width:160px;height:120px;border-radius:14px;background:linear-gradient(180deg,#3B4A66,#2A3650);box-shadow:inset 0 0 0 7px #E8EEF8"><div style="position:absolute;left:18px;top:18px;width:124px;height:40px;border-radius:6px;background:#9AD7D8"></div><div style="position:absolute;left:18px;top:70px;width:60px;height:12px;border-radius:6px;background:#F5A9C7"></div></div>
        <div style="position:absolute;left:60px;top:-60px">${tumbler(70, 'mint').innerHTML}</div></div>`);
    ground.querySelector('.w-prod').appendChild(tumbler(150, 'blue'));
    const fore = layer('fore', 1.35, `<div style="position:absolute;inset:0;filter:blur(9px)">
      <div style="position:absolute;left:-60px;top:1380px;width:520px;height:560px">${plant(0, 1.3).replace(/top:[^;]+;/, 'top:0;')}</div>
      <div style="position:absolute;left:2000px;top:1500px;width:520px;height:120px;border-radius:20px;background:linear-gradient(180deg,#FFFFFF,#DCE5F2)"></div></div>`);
    const light = h(`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 30%,rgba(255,244,214,.28),rgba(255,244,214,0) 60%);mix-blend-mode:screen"></div>`);
    const vig = h(`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 58%,rgba(40,50,100,.22) 100%)"></div>`);
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
      beams.style.opacity = .8 + .2 * Math.sin(t * .6);
    }
    return { actors: ground.querySelector('.actors'), camera, layers, FLOOR, PLINTH: { x: 1200, top: 1172 }, wprod: ground.querySelector('.w-prod').firstChild };
  }

  window.SHOP = { shop, tumbler, odometer, tag, badge, trap, promoSign, TUMBLER_PALS };
})();
