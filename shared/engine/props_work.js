// NaiSibPro work-rate kit (shared, EP22+): flat 2D police officers with paint rollers, a station wall,
// the reusable WORK GRID (blocks split by worker rate, filled day by day), a flip calendar, hourglass,
// muscle icon and stamp. Pure SVG/DOM, deterministic: every draw() takes explicit state, never reads a clock.
(function () {
  const { clamp, lerp, E, P, tf, h } = window.NSP;

  // ---------- officer: Thai police NCO, simple respectful flat style ----------
  // viewBox 240 × 600, feet at (120, 600). The roller arm is on the +x side; mirror with flip:true.
  // pose({ t, roll, ph, tap, look, blink }) — roll: 0..1 stroke amplitude, tap: 0..1 roller raised to the centre.
  function officer({ paint = '#2F6BFF', flip = false, scale = 1 } = {}) {
    const el = h(`<div class="wk-off" style="position:absolute;width:240px;height:600px;transform-origin:120px 600px;overflow:visible">
      <svg width="240" height="600" viewBox="0 0 240 600" style="overflow:visible;position:absolute;left:0;top:0;transform:scaleX(${flip ? -1 : 1})">
        <ellipse cx="120" cy="596" rx="88" ry="12" fill="rgba(0,0,0,.28)"/>
        <g class="body">
          <rect x="84" y="398" width="34" height="186" rx="10" fill="#4E3C2F"/><rect x="122" y="398" width="34" height="186" rx="10" fill="#4E3C2F"/>
          <path d="M120 404v170" stroke="#3F3026" stroke-width="3"/>
          <ellipse cx="98" cy="590" rx="27" ry="11" fill="#15110F"/><ellipse cx="142" cy="590" rx="27" ry="11" fill="#15110F"/>
          <g class="armB"><rect x="50" y="250" width="30" height="128" rx="15" fill="#8E6E52"/><circle cx="65" cy="384" r="15" fill="#F2C8A0"/></g>
          <path d="M72 262 Q72 238 98 234 L142 234 Q168 238 168 262 L166 402 L74 402 Z" fill="#8E6E52"/>
          <path d="M104 234 L120 268 L136 234" fill="#7A5C43"/><path d="M110 234 L120 254 L130 234" fill="#F2C8A0"/>
          <path d="M120 268v126" stroke="#7A5C43" stroke-width="3"/>
          <circle cx="120" cy="300" r="3.2" fill="#5A4433"/><circle cx="120" cy="336" r="3.2" fill="#5A4433"/><circle cx="120" cy="372" r="3.2" fill="#5A4433"/>
          <rect x="84" y="282" width="28" height="32" rx="6" fill="none" stroke="#6E523D" stroke-width="3"/><rect x="128" y="282" width="28" height="32" rx="6" fill="none" stroke="#6E523D" stroke-width="3"/>
          <rect x="130" y="272" width="24" height="7" rx="2" fill="#E9C46A"/><rect x="88" y="272" width="22" height="7" rx="2" fill="#F4F4F4"/>
          <rect x="72" y="238" width="30" height="12" rx="4" fill="#3B2A20"/><rect x="138" y="238" width="30" height="12" rx="4" fill="#3B2A20"/>
          <rect x="72" y="392" width="96" height="16" rx="3" fill="#1F1A17"/><rect x="112" y="393" width="16" height="14" rx="2" fill="#C9CDD3"/>
          <rect x="108" y="216" width="24" height="24" fill="#E6B88F"/>
          <g class="head">
            <circle cx="73" cy="184" r="10" fill="#EBBE95"/><circle cx="167" cy="184" r="10" fill="#EBBE95"/>
            <ellipse cx="120" cy="178" rx="47" ry="50" fill="#F2C8A0"/>
            <path d="M74 166 Q76 140 96 136 L144 136 Q164 140 166 166 L160 160 Q150 150 120 150 Q90 150 80 160Z" fill="#2B211C"/>
            <g class="eyes"><ellipse cx="102" cy="182" rx="5.5" ry="6.5" fill="#2B211C"/><ellipse cx="138" cy="182" rx="5.5" ry="6.5" fill="#2B211C"/></g>
            <path d="M92 166 q10-6 20 0M128 166 q10-6 20 0" stroke="#2B211C" stroke-width="4" fill="none" stroke-linecap="round"/>
            <path d="M106 204 q14 12 28 0" stroke="#9A4A3A" stroke-width="4" fill="none" stroke-linecap="round"/>
            <circle cx="90" cy="200" r="8" fill="#F29A8A" opacity=".35"/><circle cx="150" cy="200" r="8" fill="#F29A8A" opacity=".35"/>
            <path d="M64 132 Q66 102 120 98 Q174 102 176 132 L168 146 L72 146Z" fill="#6E5240"/>
            <rect x="72" y="136" width="96" height="16" rx="4" fill="#7B1E2E"/>
            <path d="M74 152 Q120 172 166 152 L162 160 Q120 178 78 160Z" fill="#1A1614"/>
            <path d="M120 106 l9 9 -3 13 h-12 l-3-13z" fill="#E9C46A"/><circle cx="120" cy="120" r="5" fill="#C99A2E"/>
          </g>
          <g class="armF">
            <rect x="160" y="248" width="30" height="76" rx="15" fill="#8E6E52"/>
            <g class="fore"><rect x="163" y="306" width="28" height="70" rx="14" fill="#8E6E52"/><circle cx="177" cy="380" r="15" fill="#F2C8A0"/>
              <g class="roller">
                <rect x="173" y="372" width="8" height="74" rx="4" fill="#3A3F4B"/>
                <path d="M177 444 V462 H150 V476" stroke="#9AA3B2" stroke-width="6" fill="none" stroke-linejoin="round"/>
                <rect x="112" y="474" width="78" height="32" rx="12" fill="${paint}"/>
                <rect x="112" y="494" width="78" height="10" rx="5" fill="rgba(0,0,0,.18)"/>
              </g></g>
          </g>
        </g>
      </svg></div>`);
    const q = s => el.querySelector(s);
    const body = q('.body'), head = q('.head'), armF = q('.armF'), fore = q('.fore'), armB = q('.armB'), eyes = q('.eyes');
    el.style.transform = `scale(${scale})`;
    function pose({ t = 0, roll = 1, ph = 0, tap = 0, look = 0, blink = 0, x = 0, y = 0, s = 1, o = 1 } = {}) {
      const w = Math.sin(t * 5.2 + ph);
      const by = Math.abs(Math.sin(t * 2.6 + ph)) * -6 * (.4 + .6 * roll);
      body.setAttribute('transform', `translate(0 ${by.toFixed(2)})`);
      // shoulder swing + elbow bend: the roller travels up and down ~60px at full roll
      // arm is drawn hanging down; rotating it by about -145deg raises the roller up and toward the wall
      const sh = lerp(-145, -168, tap) + w * 10 * roll, el2 = lerp(-12, -4, tap) + w * 14 * roll;
      armF.setAttribute('transform', `rotate(${sh.toFixed(2)} 175 262)`);
      fore.setAttribute('transform', `rotate(${el2.toFixed(2)} 177 312)`);
      armB.setAttribute('transform', `rotate(${(4 + Math.sin(t * 2.6 + ph) * 3).toFixed(2)} 65 258)`);
      head.setAttribute('transform', `rotate(${(look * 6 + Math.sin(t * 1.3 + ph) * 2).toFixed(2)} 120 216)`);
      eyes.setAttribute('transform', `translate(0 ${182 * blink}) scale(1 ${1 - blink})`);
      el.style.transform = `translate(${x}px,${y}px) scale(${scale * s})`;
      el.style.opacity = o; el.style.visibility = o <= .001 ? 'hidden' : 'visible';
    }
    return { el, pose };
  }
  const blinkAt = (t, ph = 0) => { const u = (t + ph * 1.7) % 3.6; return u < .12 ? Math.sin(u / .12 * Math.PI) : 0; };

  // ---------- station wall ----------
  function wall(container, { x, y, w, hgt, roof = true, beacon = true }) {
    const el = h(`<div class="wk-wall" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${hgt}px">
      ${roof ? `<div style="position:absolute;left:-34px;right:-34px;top:-58px;height:58px;border-radius:14px 14px 4px 4px;background:linear-gradient(180deg,#22407A,#17305E);box-shadow:0 10px 0 rgba(0,0,0,.25)">
        ${beacon ? '' : '<!--'}<div style="position:absolute;left:50%;top:-30px;width:70px;height:30px;margin-left:-35px;border-radius:12px 12px 0 0;background:linear-gradient(90deg,#E5484D 50%,#2F6BFF 50%);box-shadow:0 0 24px rgba(255,255,255,.35)"></div>${beacon ? '' : '-->'}
        <div style="position:absolute;left:24px;right:24px;top:20px;height:8px;border-radius:4px;background:rgba(255,255,255,.18)"></div></div>` : ''}
      <div class="wk-face" style="position:absolute;inset:0;border-radius:10px;background:linear-gradient(180deg,#FFFFFF,#EEF2F8);box-shadow:0 26px 60px rgba(0,0,0,.45),inset 0 -14px 0 rgba(23,48,94,.12)"></div>
      <div class="wk-tex" style="position:absolute;inset:0;border-radius:10px;opacity:.5;background-image:linear-gradient(rgba(23,48,94,.05) 2px,transparent 2px);background-size:100% 46px"></div>
      <div class="wk-in" style="position:absolute;inset:0"></div></div>`);
    container.appendChild(el);
    return { el, inner: el.querySelector('.wk-in') };
  }

  // ---------- WORK GRID ----------
  // workers: [{ rate, color }] (2 workers). Blocks = rows × cols, must equal days × Σrate.
  // Worker 0 paints from the left edge, worker 1 from the right edge, column by column (top → bottom),
  // `rate` blocks per day each, so every colour on the wall shows who painted it and how fast.
  function grid(container, { x = 0, y = 0, w, hgt, rows, cols, workers, gap = 10, radius = 14 }) {
    const total = rows * cols, perDay = workers.reduce((a, k) => a + k.rate, 0), days = total / perDay;
    if (Math.abs(days - Math.round(days)) > 1e-9) throw new Error('work grid: blocks must be a multiple of the daily total');
    const cw = (w - gap * (cols + 1)) / cols, ch = (hgt - gap * (rows + 1)) / rows;
    const order0 = [], order1 = [];
    for (let c = 0; c < cols; c++) for (let r = 0; r < rows; r++) order0.push(r * cols + c);
    for (let c = cols - 1; c >= 0; c--) for (let r = 0; r < rows; r++) order1.push(r * cols + c);
    const plan = new Array(total).fill(null);   // cell -> { worker, day (0-based), j (index within that worker's day) }
    const taken = new Set();
    for (let d = 0; d < days; d++) workers.forEach((wk, i) => {
      const ord = i === 0 ? order0 : order1; let n = 0;
      for (const cell of ord) { if (n >= wk.rate) break; if (taken.has(cell)) continue; taken.add(cell); plan[cell] = { worker: i, day: d, j: n++ }; }
    });
    const el = h(`<div class="wk-grid" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${hgt}px"></div>`);
    container.appendChild(el);
    const NS = 'http://www.w3.org/2000/svg';
    const svg = document.createElementNS(NS, 'svg');
    svg.setAttribute('width', w); svg.setAttribute('height', hgt); svg.style.cssText = 'position:absolute;left:0;top:0;overflow:visible;z-index:3';
    el.appendChild(svg);
    const cells = [];
    for (let i = 0; i < total; i++) {
      const r = Math.floor(i / cols), c = i % cols, cx = gap + c * (cw + gap), cy = gap + r * (ch + gap);
      const col = workers[plan[i].worker].color;
      const cell = h(`<div style="position:absolute;left:${cx}px;top:${cy}px;width:${cw}px;height:${ch}px;border-radius:${radius}px;overflow:hidden">
        <div class="gl" style="position:absolute;inset:0;border-radius:${radius}px;background:${col};opacity:0"></div>
        <div class="fl" style="position:absolute;left:0;right:0;bottom:0;height:0;background:linear-gradient(180deg,${col},${col}),${col}">
          <div style="position:absolute;inset:0;opacity:.22;background-image:repeating-linear-gradient(90deg,rgba(255,255,255,.9) 0 6px,transparent 6px 22px)"></div></div>
        <div class="ed" style="position:absolute;left:0;right:0;height:16px;border-radius:8px;background:${col};filter:brightness(1.25);opacity:0"></div></div>`);
      el.appendChild(cell);
      const rect = document.createElementNS(NS, 'rect');
      const per = 2 * (cw + ch);
      rect.setAttribute('x', cx); rect.setAttribute('y', cy); rect.setAttribute('width', cw); rect.setAttribute('height', ch); rect.setAttribute('rx', radius);
      rect.setAttribute('fill', 'none'); rect.setAttribute('stroke', '#17305E'); rect.setAttribute('stroke-width', 5); rect.setAttribute('stroke-dasharray', per); rect.setAttribute('stroke-linecap', 'round');
      svg.appendChild(rect);
      cells.push({ el: cell, gl: cell.querySelector('.gl'), fl: cell.querySelector('.fl'), ed: cell.querySelector('.ed'), rect, per, cx, cy, plan: plan[i] });
    }
    // roller sprites riding the wipe edge, one per worker
    const rollers = workers.map(wk => { const r = h(`<div style="position:absolute;left:0;top:0;width:${Math.min(cw * .9, 150)}px;height:34px;z-index:4">
      <div style="position:absolute;inset:0;border-radius:14px;background:${wk.color};box-shadow:0 0 0 4px #fff,0 8px 16px rgba(0,0,0,.3)"></div>
      <div style="position:absolute;left:50%;top:34px;width:8px;height:60px;margin-left:-4px;background:#9AA3B2;border-radius:4px"></div></div>`); el.appendChild(r); return r; });
    // per-cell fill progress: worker i paints its j-th block of day d during [d + j/r, d + (j+1)/r] (day units)
    function cellFill(cell, day) { const p = cell.plan, r = workers[p.worker].rate; return clamp((day - p.day - p.j / r) * r / .92); }
    function draw({ lines = 1, day = 0, preview = [], glow = 0 } = {}) {
      cells.forEach((c, i) => {
        const lp = clamp(lines * (total + 3) / 4 - i * .25 * (total + 3) / total / 1.2);
        c.rect.setAttribute('stroke-dashoffset', c.per * (1 - E.inOut(lp)));
        c.rect.style.opacity = lines > 0 ? 1 : 0;
        const f = cellFill(c, day);
        c.fl.style.height = (100 * E.inOut(f)) + '%';
        c.ed.style.top = `calc(${100 * (1 - E.inOut(f))}% - 8px)`; c.ed.style.opacity = f > 0 && f < 1 ? 1 : 0;
        const pv = c.plan.day === 0 ? (preview[c.plan.worker] || 0) : 0;
        c.gl.style.opacity = f >= 1 ? 0 : clamp(pv) * (.45 + .2 * Math.sin(glow * 6 + i));
        c.el.style.boxShadow = f >= 1 ? 'inset 0 -6px 0 rgba(0,0,0,.18)' : pv > 0 ? `0 0 ${18 * pv}px ${4 * pv}px ${workers[c.plan.worker].color}` : '';
      });
      rollers.forEach((r, wi) => {
        const act = cells.filter(c => c.plan.worker === wi).map(c => ({ c, f: cellFill(c, day) })).find(o => o.f > 0 && o.f < 1);
        if (!act) { r.style.opacity = 0; r.style.visibility = 'hidden'; return; }
        const yy = act.c.cy + ch * (1 - E.inOut(act.f)) - 17, xx = act.c.cx + (cw - parseFloat(r.style.width)) / 2;
        r.style.visibility = 'visible'; r.style.opacity = clamp(act.f * 8) * clamp((1 - act.f) * 8);
        r.style.transform = `translate(${xx}px,${yy}px) rotate(${Math.sin(day * 40) * 3}deg)`;
      });
    }
    // events for SFX: [time-in-day-units of each cell start]
    const starts = cells.map(c => c.plan.day + c.plan.j / workers[c.plan.worker].rate);
    return { el, cells, draw, plan, days, perDay, starts };
  }
  // day-float from beat times: dayAt(t, [T0, T1, ..., Tn]) → 0..n, linear inside each day
  function dayAt(t, T) {
    if (t <= T[0]) return 0;
    for (let k = 0; k < T.length - 1; k++) if (t < T[k + 1]) return k + (t - T[k]) / (T[k + 1] - T[k]);
    return T.length - 1;
  }

  // ---------- flip calendar ----------
  function calendar(container, { x, y, w = 190, hgt = 170 }) {
    const el = h(`<div class="wk-cal" style="position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${hgt}px;perspective:700px">
      <div style="position:absolute;inset:0;border-radius:22px;background:#fff;box-shadow:0 16px 30px rgba(0,0,0,.4)"></div>
      <div style="position:absolute;left:0;right:0;top:0;height:${hgt * .3}px;border-radius:22px 22px 0 0;background:linear-gradient(90deg,#E5484D,#FF6B6B)"></div>
      <div style="position:absolute;left:${w * .25 - 6}px;top:-12px;width:12px;height:30px;border-radius:6px;background:#2B3446"></div><div style="position:absolute;left:${w * .75 - 6}px;top:-12px;width:12px;height:30px;border-radius:6px;background:#2B3446"></div>
      <div class="cn" style="position:absolute;left:0;right:0;top:${hgt * .3}px;bottom:0;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1"><span class="c1" style="font-weight:700;font-size:${hgt * .2}px;color:#56607A">วันที่</span><span class="c2" style="font-weight:800;font-size:${hgt * .42}px;color:#0B1A3A">1</span></div>
      <div class="fp" style="position:absolute;left:0;right:0;top:${hgt * .3}px;bottom:0;border-radius:0 0 22px 22px;background:linear-gradient(180deg,#F3F5FA,#FFFFFF);transform-origin:50% 0;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1;backface-visibility:hidden"><span style="font-weight:700;font-size:${hgt * .2}px;color:#56607A">วันที่</span><span class="f2" style="font-weight:800;font-size:${hgt * .42}px;color:#0B1A3A">1</span></div></div>`);
    container.appendChild(el);
    const c2 = el.querySelector('.c2'), fp = el.querySelector('.fp'), f2 = el.querySelector('.f2');
    // page(t) = current day number (1-based integer) and flip progress from the last change
    function draw(n, flipP = 1) {
      c2.textContent = n;
      if (flipP >= 1 || n <= 1) { fp.style.visibility = 'hidden'; return; }
      fp.style.visibility = 'visible'; f2.textContent = n - 1;
      fp.style.transform = `rotateX(${-100 * E.in(flipP)}deg)`; fp.style.opacity = 1 - E.in(clamp(flipP * 1.2 - .2));
    }
    return { el, draw };
  }

  // ---------- hourglass (sand: 1 = all on top) ----------
  function hourglass(color = '#2F6BFF', s = 1) {
    const el = h(`<div style="position:absolute;width:${180 * s}px;height:${280 * s}px">
      <svg width="${180 * s}" height="${280 * s}" viewBox="0 0 180 280">
        <rect x="10" y="4" width="160" height="22" rx="10" fill="${color}"/><rect x="10" y="254" width="160" height="22" rx="10" fill="${color}"/>
        <path d="M30 26 Q30 120 86 140 Q30 160 30 254 H150 Q150 160 94 140 Q150 120 150 26Z" fill="rgba(255,255,255,.14)" stroke="#fff" stroke-width="5"/>
        <clipPath id="hgT${color.slice(1)}"><path d="M34 30 Q34 118 88 138 L92 138 Q146 118 146 30Z"/></clipPath>
        <clipPath id="hgB${color.slice(1)}"><path d="M88 142 Q34 162 34 250 H146 Q146 162 92 142Z"/></clipPath>
        <rect class="st" clip-path="url(#hgT${color.slice(1)})" x="30" y="30" width="120" height="110" fill="#FFD23F"/>
        <rect class="sb" clip-path="url(#hgB${color.slice(1)})" x="30" y="250" width="120" height="0" fill="#FFD23F"/>
        <rect class="sm" x="88" y="138" width="4" height="112" fill="#FFD23F"/>
      </svg></div>`);
    const st = el.querySelector('.st'), sb = el.querySelector('.sb'), sm = el.querySelector('.sm');
    function draw(top) {
      top = clamp(top);
      st.setAttribute('y', 30 + 108 * (1 - top)); st.setAttribute('height', 110 * top);
      sb.setAttribute('y', 250 - 108 * (1 - top)); sb.setAttribute('height', 108 * (1 - top));
      sm.style.opacity = top > .005 && top < .995 ? 1 : 0;
    }
    return { el, draw };
  }

  // ---------- muscle (strength) icon ----------
  const muscle = (s = 150, c = '#FFD23F') => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><path d="M18 80 C10 60 14 34 30 22 C36 18 44 20 46 26 C48 32 44 36 38 38 C34 44 34 52 38 58 C44 50 56 46 66 48 C80 50 90 62 86 74 C82 86 64 90 46 88 C34 87 24 86 18 80Z" fill="${c}" stroke="#fff" stroke-width="4" stroke-linejoin="round"/><path d="M58 60 q8 4 10 12" stroke="rgba(0,0,0,.25)" stroke-width="4" fill="none" stroke-linecap="round"/></svg>`;

  window.WORK = { officer, blinkAt, wall, grid, dayAt, calendar, hourglass, muscle };
})();
