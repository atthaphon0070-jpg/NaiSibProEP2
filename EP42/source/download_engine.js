// EP.42 reusable download UI: generic fictional download window, progress bar with optional
// 0/25/50/75/100 % ticks, server -> computer packet stream, speed gauge. Deterministic (draw(t)).
(function () {
  const { clamp, lerp, E, P, tf, h } = window.NSP;
  const MBPS = 'M<span class="lb">b</span>ps', MB = 'M<span class="ub">B</span>';
  const SVG = {
    file: s => `<svg width="${s}" height="${s * 1.18}" viewBox="0 0 100 118"><defs><linearGradient id="fg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#4F8BFF"/><stop offset="1" stop-color="#2F6BFF"/></linearGradient></defs>
      <path d="M10 4h56l30 30v74q0 6-6 6H10q-6 0-6-6V10q0-6 6-6z" fill="url(#fg)" stroke="#95BFEF" stroke-width="3"/><path d="M66 4v24q0 6 6 6h24" fill="#1B4CC4"/>
      <circle cx="50" cy="70" r="22" fill="rgba(255,255,255,.18)"/><path d="M43 58l20 12-20 12z" fill="#fff"/><rect x="18" y="98" width="64" height="10" rx="5" fill="rgba(255,255,255,.35)"/></svg>`,
    wifi: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M2 8.5a15 15 0 0 1 20 0M5 12a10.5 10.5 0 0 1 14 0M8.3 15.4a6 6 0 0 1 7.4 0" fill="none" stroke="#22D3EE" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="19" r="1.9" fill="#22D3EE"/></svg>`,
    server: s => `<svg width="${s}" height="${s * 1.25}" viewBox="0 0 80 100"><rect x="6" y="4" width="68" height="92" rx="10" fill="#1E3F7A" stroke="#22D3EE" stroke-width="3"/>
      ${[0, 1, 2].map(i => `<rect x="14" y="${14 + i * 27}" width="52" height="19" rx="5" fill="#142B53" stroke="#2F6BFF" stroke-width="2"/><circle cx="24" cy="${23.5 + i * 27}" r="3.4" fill="#22C55E"/><rect x="34" y="${21 + i * 27}" width="24" height="5" rx="2.5" fill="#95BFEF"/>`).join('')}</svg>`,
    laptop: s => `<svg width="${s}" height="${s * .7}" viewBox="0 0 120 84"><rect x="16" y="4" width="88" height="60" rx="7" fill="#1E3F7A" stroke="#22D3EE" stroke-width="3"/><rect x="23" y="11" width="74" height="46" rx="3" fill="#0E2348"/>
      <rect x="31" y="40" width="58" height="7" rx="3.5" fill="#24365E"/><rect class="lt-fill" x="31" y="40" width="30" height="7" rx="3.5" fill="#22D3EE"/><path d="M52 20v12m-6-5 6 6 6-6" stroke="#E6F4FF" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M2 68h116l-6 12H8z" fill="#2F6BFF"/><rect x="48" y="68" width="24" height="4" rx="2" fill="#95BFEF"/></svg>`,
  };
  // ---------- download window ----------
  // opts: { x, y, w, name, big (value font px), ticks (bool), timeLabel }
  function window_(parent, o = {}) {
    const w = o.w ?? 640, big = o.big ?? 54;
    const el = h(`<div class="dlw abs c${o.ticks ? ' tk' : ''}" style="left:${o.x ?? 220}px;top:${o.y}px;width:${w}px">
      <div class="dl-bar"><i style="background:#EF4444"></i><i style="background:#FFD23F"></i><i style="background:#22C55E"></i><span>ตัวจัดการดาวน์โหลด</span></div>
      <div class="dl-body">
        <div class="dl-file">${SVG.file(78)}<div style="flex:1;min-width:0"><div class="dl-name">${o.name ?? 'training_video.mp4'}</div>
          <div class="dl-row"><span class="dl-lab">ขนาดไฟล์</span><b class="dl-size" style="font-size:${big}px">500 ${MB}</b></div></div></div>
        <div class="dl-speed">${SVG.wifi(54)}<span class="dl-lab">ความเร็วเน็ต</span><b class="dl-spd" style="font-size:${big}px">100 ${MBPS}</b></div>
        <div class="dl-trackwrap"><div class="dl-track"><div class="dl-fill"></div><div class="dl-glint"></div></div>
          ${o.ticks ? [0, 25, 50, 75, 100].map((p, i) => `<div class="dl-tick" style="left:${p}%"><i></i><span class="tp">${p}%</span><span class="ts">${i * 10} วิ</span></div>`).join('') : ''}</div>
        <div class="dl-stats"><span class="dl-pct">0%</span><span class="dl-time">${o.timeLabel ?? ''}</span></div>
      </div></div>`);
    parent.appendChild(el);
    const q = s => el.querySelector(s);
    const r = { el, fill: q('.dl-fill'), glint: q('.dl-glint'), pct: q('.dl-pct'), time: q('.dl-time'), file: q('.dl-file'), speed: q('.dl-speed'),
      ticks: [...el.querySelectorAll('.dl-tick')], size: q('.dl-size'), spd: q('.dl-spd') };
    // p: 0..1 progress, t: clock for the glint
    r.set = (p, t, { pctText, timeText } = {}) => {
      r.fill.style.width = (100 * clamp(p)) + '%';
      r.glint.style.left = (((t * 0.6) % 1.4) * 100 - 20) + '%';
      r.pct.innerHTML = pctText ?? Math.round(100 * clamp(p)) + '%';
      if (timeText !== undefined) r.time.innerHTML = timeText;
      r.ticks.forEach((k, i) => k.classList.toggle('on', p >= i / 4 - 1e-9));
    };
    return r;
  }
  // ---------- packet stream between two points (organised: lanes, constant spacing) ----------
  function packets(parent, { x0, y0, x1, y1, n = 10, lanes = 3, arc = 40, size = 22 }) {
    const box = h(`<div class="abs" style="left:0;top:0;width:1080px;height:1920px;pointer-events:none"></div>`); parent.appendChild(box);
    const ps = [...Array(n)].map((_, i) => {
      const kind = i % 3;
      const el = h(kind === 0 ? `<div class="pk pk-sq" style="width:${size}px;height:${size}px">${i % 2}</div>` : `<div class="pk pk-dot" style="width:${size * .6}px;height:${size * .6}px"></div>`);
      box.appendChild(el); return { el, ph: i / n, lane: i % lanes };
    });
    return {
      box,
      // t: clock, on: 0..1 visibility, rate: packets speed (cycles/s)
      draw(t, on = 1, rate = .45) {
        ps.forEach(p => {
          const u = (p.ph + t * rate) % 1;
          const off = (p.lane - (lanes - 1) / 2) * 26;
          const x = lerp(x0, x1, u), y = lerp(y0, y1, u) - Math.sin(u * Math.PI) * arc + off;
          tf(p.el, { x, y, o: on * clamp(Math.sin(u * Math.PI) * 1.6), s: .8 + .4 * Math.sin(u * Math.PI) });
        });
      },
    };
  }
  // ---------- speed gauge (SVG arc + needle) ----------
  function gauge(parent, { x, y, size = 300 }) {
    const el = h(`<div class="abs c" style="left:${x}px;top:${y}px;width:${size}px;height:${size * .62}px">
      <svg width="${size}" height="${size * .62}" viewBox="0 0 200 124"><defs><linearGradient id="gg" x1="0" x2="1"><stop offset="0" stop-color="#2F6BFF"/><stop offset="1" stop-color="#22D3EE"/></linearGradient></defs>
      <path d="M20 110A80 80 0 0 1 180 110" fill="none" stroke="rgba(149,191,239,.22)" stroke-width="16" stroke-linecap="round"/>
      <path class="g-arc" d="M20 110A80 80 0 0 1 180 110" fill="none" stroke="url(#gg)" stroke-width="16" stroke-linecap="round" stroke-dasharray="251.3" stroke-dashoffset="251.3"/>
      ${[...Array(11)].map((_, i) => { const a = Math.PI * (1 - i / 10); return `<line x1="${100 + 62 * Math.cos(a)}" y1="${110 - 62 * Math.sin(a)}" x2="${100 + 54 * Math.cos(a)}" y2="${110 - 54 * Math.sin(a)}" stroke="#95BFEF" stroke-width="${i % 5 ? 2 : 4}"/>`; }).join('')}
      <g class="g-needle"><path d="M97 110L100 46L103 110Z" fill="#FFD23F"/></g><circle cx="100" cy="110" r="9" fill="#E6F4FF" stroke="#2F6BFF" stroke-width="4"/></svg></div>`);
    parent.appendChild(el);
    const arc = el.querySelector('.g-arc'), nd = el.querySelector('.g-needle');
    return { el, set(v) { arc.setAttribute('stroke-dashoffset', 251.3 * (1 - v)); nd.setAttribute('transform', `rotate(${-90 + 180 * v} 100 110)`); } };
  }
  window.DL = { SVG, window: window_, packets, gauge, MBPS, MB };
})();
