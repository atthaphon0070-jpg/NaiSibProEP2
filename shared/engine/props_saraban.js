// NaiSibPro official-correspondence props (shared, EP12+). งานสารบรรณ: official envelopes with
// red urgency stamps, a rubber-stamp tool, an in-tray, a speed gauge and deadline tags.
// Generic and fictional: no Garuda / government seals, no real agency names or addresses.
(function () {
  const { h, clamp, lerp, E } = window.NSP;
  let uid = 0;
  const RED = '#D3263E', REDD = '#A8172C';
  // distressed-ink mask (fractal noise) shared by every stamp
  const INK = `url("data:image/svg+xml;utf8,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='240' height='120'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='2' seed='7'/><feColorMatrix values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 -2.6 2.15'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>`)}")`;
  document.head.insertAdjacentHTML('beforeend', `<style>
    .ustamp{display:inline-flex;align-items:center;justify-content:center;font-family:Prompt;font-weight:800;color:${RED};border:6px solid ${RED};border-radius:14px;
      padding:2px 22px 6px;line-height:1.15;white-space:nowrap;box-shadow:inset 0 0 0 3px #fff,inset 0 0 0 6px ${RED};background:rgba(255,255,255,.0);
      -webkit-mask-image:${INK};mask-image:${INK};-webkit-mask-size:240px 120px;mask-size:240px 120px}
    .ustamp.solid{background:${RED};color:#fff;box-shadow:none}
    .env{position:relative;filter:drop-shadow(0 18px 24px rgba(20,30,60,.32))}
  </style>`);

  // red urgency stamp label (DOM); size = font px
  function stamp(text, size = 56, { rot = -4, solid = false } = {}) {
    const el = h(`<div class="ustamp${solid ? ' solid' : ''}" style="font-size:${size}px;border-width:${Math.max(3, size * .1)}px;border-radius:${size * .24}px;transform:rotate(${rot}deg)">${text}</div>`);
    return el;
  }

  // official kraft envelope, front side; slots: .env-label (urgency), .env-extra (deadline lines)
  function envelope(w = 600, { label = '', labelSize, rot = -5, extra = '' } = {}) {
    const id = 'ev' + (++uid), hh = Math.round(w * .62), k = w / 600;
    const el = h(`<div class="env" style="width:${w}px;height:${hh}px">
      <svg width="${w}" height="${hh}" viewBox="0 0 600 372" style="position:absolute;inset:0">
        <defs><linearGradient id="${id}k" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#F7E6C3"/><stop offset=".55" stop-color="#EDD3A2"/><stop offset="1" stop-color="#E2C18A"/></linearGradient>
          <pattern id="${id}f" width="14" height="14" patternUnits="userSpaceOnUse"><path d="M0 14 L14 0" stroke="rgba(160,120,60,.07)" stroke-width="2"/></pattern></defs>
        <rect x="0" y="0" width="600" height="372" rx="20" fill="url(#${id}k)"/><rect x="0" y="0" width="600" height="372" rx="20" fill="url(#${id}f)"/>
        <path d="M6 8 L300 196 L594 8" stroke="rgba(176,132,70,.28)" stroke-width="4" fill="none"/>
        <rect x="8" y="8" width="584" height="356" rx="15" fill="none" stroke="rgba(255,255,255,.55)" stroke-width="3"/>
        <rect x="470" y="30" width="100" height="84" rx="10" fill="none" stroke="#B9955E" stroke-width="4" stroke-dasharray="10 8"/>
        <path d="M486 60 h68 M486 84 h50" stroke="#C9A877" stroke-width="7" stroke-linecap="round"/>
        <path d="M250 236 h270 M250 270 h230 M250 304 h250" stroke="#B9955E" stroke-width="9" stroke-linecap="round" opacity=".55"/>
        <path d="M40 300 h120 M40 328 h86" stroke="#B9955E" stroke-width="7" stroke-linecap="round" opacity=".35"/>
      </svg>
      <div class="env-label" style="position:absolute;left:${34 * k}px;top:${34 * k}px;transform-origin:0 50%"></div>
      <div class="env-extra" style="position:absolute;left:${34 * k}px;top:${148 * k}px">${extra}</div></div>`);
    if (label) el.querySelector('.env-label').appendChild(stamp(label, labelSize || 62 * k, { rot }));
    el.label = el.querySelector('.env-label'); el.extra = el.querySelector('.env-extra');
    return el;
  }

  // rubber stamp tool (DOM); origin = centre of the rubber face (bottom). set(press 0..1)
  function stampTool(size = 220) {
    const id = 'st' + (++uid);
    const el = h(`<div style="position:absolute;width:${size}px;height:${size * 1.25}px;margin-left:${-size / 2}px;margin-top:${-size * 1.25}px;transform-origin:50% 100%">
      <svg width="${size}" height="${size * 1.25}" viewBox="-100 -250 200 250" style="overflow:visible">
        <defs><linearGradient id="${id}w" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#9A6234"/><stop offset=".45" stop-color="#D59B62"/><stop offset="1" stop-color="#8A5329"/></linearGradient>
          <linearGradient id="${id}b" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4C5674"/><stop offset="1" stop-color="#2C334A"/></linearGradient></defs>
        <ellipse cx="0" cy="-205" rx="52" ry="40" fill="url(#${id}w)"/><ellipse cx="-16" cy="-218" rx="16" ry="9" fill="rgba(255,255,255,.35)"/>
        <rect x="-16" y="-172" width="32" height="88" rx="10" fill="url(#${id}w)"/>
        <rect x="-82" y="-92" width="164" height="62" rx="14" fill="url(#${id}b)"/><rect x="-74" y="-86" width="70" height="10" rx="5" fill="rgba(255,255,255,.18)"/>
        <rect x="-88" y="-32" width="176" height="28" rx="8" fill="${RED}"/><rect x="-88" y="-12" width="176" height="10" rx="5" fill="${REDD}"/>
      </svg></div>`);
    return el;
  }

  // ink splash ring at impact (DOM); draw(u) with u = seconds since impact
  function splash(size = 360) {
    const dots = [...Array(12)].map((_, i) => { const a = i / 12 * Math.PI * 2; return { a, r: .32 + (i % 3) * .07, s: 10 + (i % 4) * 5 }; });
    const el = h(`<div style="position:absolute;width:${size}px;height:${size}px;margin:${-size / 2}px 0 0 ${-size / 2}px;pointer-events:none">
      <div class="sp-ring" style="position:absolute;inset:0;border-radius:50%;border:8px solid rgba(211,38,62,.55)"></div>
      ${dots.map(d => `<div class="sp-d" style="position:absolute;left:50%;top:50%;width:${d.s}px;height:${d.s}px;margin:${-d.s / 2}px;border-radius:50%;background:${RED}"></div>`).join('')}</div>`);
    const ring = el.querySelector('.sp-ring'), ds = [...el.querySelectorAll('.sp-d')];
    el.draw = u => {
      const on = u >= 0 && u < .55;
      el.style.visibility = on ? 'visible' : 'hidden'; if (!on) return;
      const k = E.out(clamp(u / .45));
      ring.style.transform = `scale(${.3 + .9 * k})`; ring.style.opacity = 1 - k;
      ds.forEach((d, i) => { const dd = dots[i]; d.style.transform = `translate(${Math.cos(dd.a) * dd.r * size * k}px,${Math.sin(dd.a) * dd.r * size * k}px) scale(${1 - k * .6})`; d.style.opacity = 1 - k; });
    };
    return el;
  }

  // in-tray with a stack of envelopes (DOM)
  function tray(w = 320, n = 3) {
    return h(`<div style="position:relative;width:${w}px;height:${w * .5}px">
      ${[...Array(n)].map((_, i) => `<div style="position:absolute;left:${w * .08 + i * 4}px;top:${w * (.06 - i * .035)}px;width:${w * .84}px;height:${w * .3}px;border-radius:10px;background:linear-gradient(135deg,#F7E6C3,#E2C18A);box-shadow:0 2px 0 rgba(150,110,60,.3);transform:rotate(${(i - 1) * 2}deg)"></div>`).join('')}
      <div style="position:absolute;left:0;top:${w * .22}px;width:${w}px;height:${w * .26}px;border-radius:12px 12px 18px 18px;background:linear-gradient(180deg,#DDE6F3,#B7C7DE);box-shadow:inset 0 6px 0 rgba(255,255,255,.6),0 12px 20px rgba(20,30,60,.25)"></div>
      <div style="position:absolute;left:${w * .3}px;top:${w * .31}px;width:${w * .4}px;height:${w * .07}px;border-radius:6px;background:#9FB2CF"></div></div>`);
  }

  // speed gauge: three arcs (ด่วน / ด่วนมาก / ด่วนที่สุด), no numbers. set(level 0..3 float)
  function gauge(w = 520, labels = ['ด่วน', 'ด่วนมาก', 'ด่วนที่สุด']) {
    const id = 'gg' + (++uid), cols = ['#F6B04B', '#F07C3E', RED];
    const R = 200, arc = (a0, a1) => { const p = a => [Math.cos(Math.PI * (1 - a)) * R, -Math.sin(Math.PI * (1 - a)) * R]; const [x0, y0] = p(a0), [x1, y1] = p(a1); return `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`; };
    const segs = [[.02, .32], [.35, .65], [.68, .98]];
    const el = h(`<div style="position:relative;width:${w}px;height:${w * .62}px">
      <svg width="${w}" height="${w * .62}" viewBox="-260 -250 520 322" style="overflow:visible">
        <defs><radialGradient id="${id}h" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#E4ECF8"/></radialGradient></defs>
        <path d="M-236 0 A236 236 0 0 1 236 0 Z" fill="rgba(255,255,255,.92)"/>
        ${segs.map((s, i) => `<path class="g-s" d="${arc(s[0], s[1])}" stroke="${cols[i]}" stroke-width="40" fill="none" stroke-linecap="round" opacity=".28"/>`).join('')}
        ${segs.map((s, i) => { const a = (s[0] + s[1]) / 2, x = Math.cos(Math.PI * (1 - a)) * 148, y = -Math.sin(Math.PI * (1 - a)) * 148; return `<text class="g-t" x="${x}" y="${y + 11}" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="${i === 2 ? 33 : 36}" fill="${cols[i]}" stroke="#fff" stroke-width="6" paint-order="stroke" opacity=".6">${labels[i]}</text>`; }).join('')}
        <g class="g-n"><path d="M-11 0 L0 -112 L11 0 Z" fill="#31445D"/></g>
        <circle r="26" fill="url(#${id}h)" stroke="#31445D" stroke-width="6"/><circle r="8" fill="#31445D"/>
      </svg></div>`);
    const segEls = [...el.querySelectorAll('.g-s')], txt = [...el.querySelectorAll('.g-t')], nd = el.querySelector('.g-n');
    const mids = segs.map(s => (s[0] + s[1]) / 2), stops = [0, ...mids];
    el.set = (lv, t = 0) => {   // lv: 0 = rest at the left end, 1..3 = centre of segment 1..3 (fractions interpolate)
      const L = clamp(lv, 0, 3), i = Math.min(2, Math.floor(L)), a = lerp(stops[i], stops[i + 1], L - i);
      nd.setAttribute('transform', `rotate(${-90 + 180 * a + (L > 0 ? Math.sin(t * 9) * .8 : 0)})`);
      segEls.forEach((s, k) => { const on = L >= k + 1 - .02; s.setAttribute('opacity', on ? 1 : .28); txt[k].setAttribute('opacity', on ? 1 : .6); });
    };
    el.set(0);
    return el;
  }

  // icons
  const ICO = {
    clock: (s = 80, c = '#31445D', lines = 0) => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><circle cx="26" cy="25" r="16" fill="#fff" stroke="${c}" stroke-width="4"/><path d="M26 16v10l6 4" stroke="${c}" stroke-width="4" fill="none" stroke-linecap="round"/>${[...Array(lines)].map((_, i) => `<path d="M${4 + i * 0} ${18 + i * 7}h${8 - i * 2}" stroke="${RED}" stroke-width="3.6" stroke-linecap="round"/>`).join('')}</svg>`,
    bolt: (s = 80, c = RED) => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><path d="M28 3 L9 27 h13 l-4 18 L39 19 H26z" fill="${c}" stroke="#fff" stroke-width="2.5" stroke-linejoin="round"/></svg>`,
    cal: (s = 80, c = '#3E7BD6') => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><rect x="6" y="10" width="36" height="32" rx="6" fill="#fff" stroke="${c}" stroke-width="4"/><path d="M6 19h36" stroke="${c}" stroke-width="4"/><path d="M15 6v8M33 6v8" stroke="${c}" stroke-width="4" stroke-linecap="round"/><rect x="13" y="25" width="8" height="7" rx="2" fill="${RED}"/></svg>`,
    hourglass: (s = 80, c = '#31445D') => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><path d="M12 5h24M12 43h24" stroke="${c}" stroke-width="4" stroke-linecap="round"/><path d="M15 5c0 10 9 13 9 19s-9 9-9 19M33 5c0 10-9 13-9 19s9 9 9 19" stroke="${c}" stroke-width="3.6" fill="none"/><path d="M18 40c2-5 4-7 6-7s4 2 6 7z" fill="#F6B04B"/><path d="M19 11h10c-1 4-3 6-5 7-2-1-4-3-5-7z" fill="#F6B04B"/></svg>`,
    doc: (s = 80, c = '#3E7BD6') => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><path d="M12 4h17l9 9v29a2 2 0 0 1-2 2H12a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="#fff" stroke="${c}" stroke-width="3.6"/><path d="M29 4v9h9" fill="#E2ECFA" stroke="${c}" stroke-width="3.6" stroke-linejoin="round"/><path d="M16 22h16M16 29h16M16 36h10" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/></svg>`,
    warn: (s = 60, c = '#F6B04B') => `<svg width="${s}" height="${s}" viewBox="0 0 48 48"><path d="M24 5 L45 42 H3z" fill="${c}" stroke="#fff" stroke-width="3" stroke-linejoin="round"/><path d="M24 18v12" stroke="#fff" stroke-width="5" stroke-linecap="round"/><circle cx="24" cy="36" r="3" fill="#fff"/></svg>`,
  };

  window.SARABAN = { stamp, envelope, stampTool, splash, tray, gauge, ICO, RED, REDD };
})();
