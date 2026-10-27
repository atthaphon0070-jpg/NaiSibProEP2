// NaiSibPro binary kit (shared, EP20+): light-bulb place-value row for binary / hex episodes.
// BINROW.build(parent, opts) lays out n columns left→right with place values 2^(n-1) … 1:
//   digit (above)  ·  bulb  ·  place-value label (below)  ·  "×2" arrows between labels (right → left).
// Every digit is centred on the same x as its bulb and label, so a binary string always sits exactly above its bulbs.
// Nothing here runs on its own: the episode drives it per frame with light(), tf() and the exposed elements.
(function () {
  const { clamp, lerp, E, P, h } = window.NSP;
  document.head.insertAdjacentHTML('beforeend', `<style>
    .br{position:absolute;left:0;top:0;width:1080px;height:0;transform-origin:540px 0}
    .br-col{position:absolute;top:0;width:0;height:0}
    .br-dig{position:absolute;left:-100px;width:200px;text-align:center;font-weight:800;line-height:1;color:#39E6FF;font-variant-numeric:tabular-nums;
      text-shadow:0 0 18px rgba(57,230,255,.75),0 0 46px rgba(57,230,255,.35);transform-origin:50% 60%}
    .br-bulb{position:absolute;transform-origin:50% 70%}
    .br-bulb svg{position:absolute;inset:0;overflow:visible}
    .br-glow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(255,226,120,.95) 0%,rgba(255,196,60,.45) 32%,rgba(255,170,40,0) 68%);pointer-events:none}
    .br-redglow{position:absolute;border-radius:50%;background:radial-gradient(circle,rgba(255,80,110,.9) 0%,rgba(255,60,90,.35) 35%,rgba(255,60,90,0) 68%);pointer-events:none;opacity:0}
    .br-lab{position:absolute;display:grid;place-items:center;border-radius:22px;font-weight:800;line-height:1;color:#fff;
      background:linear-gradient(180deg,#2B4C8C,#1E3A72);box-shadow:0 0 0 4px rgba(90,170,255,.55),0 10px 22px rgba(0,0,0,.35);transform-origin:50% 50%}
    .br-arr{position:absolute;transform-origin:50% 50%;color:#7FD8FF;font-weight:800;text-align:center;line-height:1}
  </style>`);

  // flat 2D bulb, viewBox 100 × 150 (glass centre 50,50)
  const GLASS = 'M31,94 C31,80 10,72 10,50 A40,40 0 1 1 90,50 C90,72 69,80 69,94 Z';
  let uid = 0;
  function bulbSVG() {
    const id = 'bg' + (uid++);
    return `<svg viewBox="0 0 100 150" preserveAspectRatio="xMidYMid meet">
      <defs><radialGradient id="${id}" cx="45%" cy="38%" r="65%"><stop offset="0" stop-color="#FFFBE3"/><stop offset=".45" stop-color="#FFE066"/><stop offset="1" stop-color="#FFB21E"/></radialGradient></defs>
      <path class="g-off" d="${GLASS}" fill="#283246" stroke="#62728F" stroke-width="2.6"/>
      <path class="g-on" d="${GLASS}" fill="url(#${id})" stroke="#FFE9A0" stroke-width="2.6" opacity="0"/>
      <path class="g-red" d="${GLASS}" fill="#FF4D6D" stroke="#FFC2CF" stroke-width="2.6" opacity="0"/>
      <path class="fil" d="M41,93 L42,64 Q46,53 50,63 Q54,53 58,64 L59,93" fill="none" stroke="#56647D" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      <path d="M26,40 Q30,22 46,16" fill="none" stroke="#fff" stroke-width="4.5" stroke-linecap="round" opacity=".28"/>
      <rect x="32" y="95" width="36" height="9" rx="3" fill="#8D9BB3"/><rect x="34" y="105" width="32" height="8" rx="3" fill="#6E7D97"/>
      <rect x="35" y="114" width="30" height="8" rx="3" fill="#8D9BB3"/><path d="M40,123 h20 l-4,9 h-12z" fill="#55627A"/>
    </svg>`;
  }

  function build(parent, { n = 4, cx = 540, top = 0, gap = 210, size = 150, digitSize = 170, labelSize = 56, digitY = null, labelY = null, arrows = true, values = null } = {}) {
    const el = h(`<div class="br"></div>`); el.style.top = top + 'px'; parent.appendChild(el);
    const bh = size * 1.5;
    const dY = digitY ?? -digitSize * 1.1;            // digit block sits above the bulb
    const lY = labelY ?? bh + 18;                     // label chip under the bulb
    const lw = Math.max(labelSize * 1.9, 96), lh = labelSize * 1.5;
    const cols = [];
    for (let i = 0; i < n; i++) {
      const x = cx + (i - (n - 1) / 2) * gap, value = values ? values[i] : Math.pow(2, n - 1 - i);
      const c = h(`<div class="br-col" style="left:${x}px">
        <div class="br-glow" style="left:${-size * 1.35}px;top:${size * .33 - size * 1.35}px;width:${size * 2.7}px;height:${size * 2.7}px;opacity:0"></div>
        <div class="br-redglow" style="left:${-size * 1.2}px;top:${size * .33 - size * 1.2}px;width:${size * 2.4}px;height:${size * 2.4}px"></div>
        <div class="br-bulb" style="left:${-size / 2}px;top:0;width:${size}px;height:${bh}px">${bulbSVG()}</div>
        <div class="br-dig" style="top:${dY}px;font-size:${digitSize}px"></div>
        <div class="br-lab" style="left:${-lw / 2}px;top:${lY}px;width:${lw}px;height:${lh}px;font-size:${labelSize}px">${value}</div>
      </div>`);
      el.appendChild(c);
      cols.push({ i, x, value, el: c, dig: c.querySelector('.br-dig'), bulb: c.querySelector('.br-bulb'), glow: c.querySelector('.br-glow'), redGlow: c.querySelector('.br-redglow'),
        on: c.querySelector('.g-on'), red: c.querySelector('.g-red'), fil: c.querySelector('.fil'), lab: c.querySelector('.br-lab') });
    }
    // "×2" arrows under the labels, travelling right → left; arr[k] links col n-1-k → col n-2-k
    const arr = [];
    if (arrows) for (let k = 0; k < n - 1; k++) {
      const r = cols[n - 1 - k], l = cols[n - 2 - k], w = gap - 24;
      const a = h(`<div class="br-arr" style="left:${l.x + 12}px;top:${lY + lh + 4}px;width:${w}px;font-size:${Math.max(42, Math.round(labelSize * .7))}px">
        <svg width="${w}" height="30" viewBox="0 0 ${w} 30" style="display:block"><path d="M${w - 8},4 Q${w / 2},38 12,6" fill="none" stroke="#7FD8FF" stroke-width="5" stroke-linecap="round"/><path d="M12,6 l15,1 M12,6 l4,14" stroke="#7FD8FF" stroke-width="5" stroke-linecap="round"/></svg>×2</div>`);
      el.appendChild(a); arr.push(a);
    }
    function setBits(bits) { cols.forEach((c, i) => { c.dig.textContent = bits[i] ?? ''; }); }
    // level 0..1 = OFF → ON (warm glow + bloom); red 0..1 = red warning flash; flick adds a CPU-like flicker on top
    function light(i, level, red = 0) {
      const c = cols[i], L = clamp(level), R = clamp(red);
      c.on.setAttribute('opacity', L * (1 - R)); c.red.setAttribute('opacity', R);
      c.fil.setAttribute('stroke', L > .5 ? '#FFF7D6' : '#56647D');
      c.glow.style.opacity = L * (1 - R);
      c.glow.style.transform = `scale(${.65 + .35 * E.out(L)})`;
      c.redGlow.style.opacity = R;
    }
    return { el, cols, arr, setBits, light, n, gap, size };
  }
  // 7-frame (≈0.23 s) ease-out ramp for a bulb switching on at `at` — never a hard cut
  const ramp = (t, at, d = .23) => E.out(P(t, at, d));
  // deterministic flicker 0..1 (CPU "processing" look) for column i
  const flicker = (t, i) => { const v = Math.sin(t * 11.3 + i * 2.1) + Math.sin(t * 17.9 + i * 4.7) * .7 + Math.sin(t * 5.3 + i); return clamp(.5 + v * .45); };
  window.BINROW = { build, ramp, flicker, bulbSVG };
})();
