// NaiSibPro EP.25 archive kit — original 2D props for the document-retention episode.
// Folder (opening cover + sticker label), paper document, desk shredder (feed slot, running strips,
// freeze state), flip calendar counting "ปีที่ n", archive shelving, desk, door, stamp, stop sign.
// Everything is drawn in code; state is set per frame from explicit times (deterministic).
(function () {
  const { h, clamp, lerp, E, tf } = window.NSP;
  const COL = {
    pink: ['#FFD3E4', '#F5A9C7', '#E07FA6'], blue: ['#D6E9FC', '#A9CBF3', '#6F9FE0'],
    gold: ['#FCE7A9', '#F2CB6A', '#C9962F'], lav: ['#E4DEFA', '#BDB2F0', '#8E80DC'],
    manila: ['#FDEBC4', '#F3D08C', '#D2A457'], green: ['#D5F5E3', '#8FDDB3', '#3DAE78'],
  };

  // ---------------------------------------------------------------- folder
  function folder(w = 260, { col = 'manila', label = '', sub = '', fs } = {}) {
    const c = COL[col] || COL.manila, H = Math.round(w * .78);
    const el = h(`<div class="fd" style="position:absolute;width:${w}px;height:${H}px;perspective:900px">
      <svg width="${w}" height="${H}" viewBox="0 0 260 203" style="position:absolute;left:0;top:0;overflow:visible">
        <path d="M10 22 Q10 10 22 10 H92 Q102 10 108 18 L116 28 H238 Q250 28 250 40 V190 Q250 200 240 200 H20 Q10 200 10 190Z" fill="${c[2]}"/>
        <path d="M18 18 H90 Q98 18 102 24 L108 32" stroke="rgba(255,255,255,.35)" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      <div class="pp" style="position:absolute;left:${w * .1}px;top:${H * .1}px;width:${w * .78}px;height:${H * .82}px;background:#fff;border-radius:${w * .03}px;transform:rotate(-3deg);box-shadow:0 2px 6px rgba(80,70,120,.15)">
        ${[0, 1, 2, 3].map(i => `<div style="position:absolute;left:12%;right:${14 + (i % 2) * 18}%;top:${18 + i * 15}%;height:${Math.max(3, w * .025)}px;border-radius:4px;background:#DCE6F4"></div>`).join('')}</div>
      <div class="pp2" style="position:absolute;left:${w * .16}px;top:${H * .06}px;width:${w * .74}px;height:${H * .8}px;background:#FBFCFF;border-radius:${w * .03}px;transform:rotate(4deg);box-shadow:0 2px 6px rgba(80,70,120,.12)"></div>
      <div class="cov" style="position:absolute;left:0;right:0;bottom:0;height:${H * .8}px;border-radius:${w * .05}px ${w * .05}px ${w * .04}px ${w * .04}px;background:linear-gradient(180deg,${c[1]},${c[2]} 160%);transform-origin:50% 100%;box-shadow:inset 0 ${w * .015}px 0 rgba(255,255,255,.5),0 ${w * .03}px ${w * .05}px rgba(90,70,120,.22);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:${w * .02}px">
        ${label ? `<div class="lab" style="background:#fff;border-radius:${w * .05}px;padding:${w * .02}px ${w * .07}px;font-weight:800;font-size:${fs || w * .17}px;line-height:1.2;color:#31445D;white-space:nowrap;box-shadow:0 3px 0 rgba(0,0,0,.06)">${label}</div>` : ''}
        ${sub ? `<div class="sub" style="font-weight:700;font-size:${w * .085}px;color:#fff;text-shadow:0 2px 0 rgba(0,0,0,.12);white-space:nowrap">${sub}</div>` : ''}
      </div></div>`);
    const cov = el.querySelector('.cov');
    el.W = w; el.H = H;
    el.open = p => { cov.style.transform = `rotateX(${-62 * p}deg)`; };
    el.setLabel = s => { const l = el.querySelector('.lab'); if (l) l.innerHTML = s; };
    return el;
  }

  // ---------------------------------------------------------------- document sheet
  function doc(w = 160, { title = '', col = '#95BFEF', copy = false, rows = 5 } = {}) {
    const H = Math.round(w * 1.3);
    return h(`<div style="position:absolute;width:${w}px;height:${H}px;border-radius:${w * .07}px;background:#fff;box-shadow:0 10px 20px rgba(90,80,140,.18),0 0 0 3px ${copy ? '#E3ECF8' : '#F3E6F0'};overflow:hidden">
      ${copy ? `<div style="position:absolute;inset:0;background:repeating-linear-gradient(135deg,rgba(149,191,239,.12) 0 10px,transparent 10px 20px)"></div>` : ''}
      <div style="height:${H * .2}px;background:${col};display:flex;align-items:center;justify-content:center;color:#fff;font-weight:800;font-size:${w * .14}px">${title}</div>
      ${[...Array(rows)].map((_, i) => `<div style="margin:${w * .07}px ${w * .1}px 0;height:${w * .045}px;width:${[78, 62, 70, 50, 66, 58][i % 6]}%;border-radius:4px;background:#E2E9F4"></div>`).join('')}</div>`);
  }

  // ---------------------------------------------------------------- shredder
  // coordinates: 400 × 440 design box, slot centre at (200, 58). el.feed is between bin and hood.
  function shredder(W = 400) {
    const k = W / 400, Hh = 440 * k;
    const el = h(`<div style="position:absolute;width:${W}px;height:${Hh}px">
      <div class="sh-in" style="position:absolute;left:0;top:0;width:400px;height:440px;transform:scale(${k});transform-origin:0 0">
        <div class="sh-glow" style="position:absolute;left:-60px;top:-60px;width:520px;height:560px;border-radius:50%;background:radial-gradient(circle,rgba(224,81,127,.55),rgba(224,81,127,0) 65%);opacity:0"></div>
        <svg width="400" height="440" viewBox="0 0 400 440" style="position:absolute;left:0;top:0">
          <defs><linearGradient id="shbin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6EEFA"/><stop offset="1" stop-color="#C9D8EE"/></linearGradient></defs>
          <rect x="44" y="176" width="312" height="252" rx="26" fill="url(#shbin)" stroke="#B4C6E2" stroke-width="4"/>
          <rect x="74" y="204" width="252" height="196" rx="16" fill="#F7FAFF"/>
          ${[...Array(16)].map((_, i) => `<rect x="${84 + i * 15}" y="${352 - (i * 37 % 40)}" width="9" height="${48 + (i * 37 % 40)}" rx="3" fill="${['#FFFFFF', '#FCE3EF', '#E2ECFA', '#FFF4D6'][i % 4]}" stroke="#DCE6F4" stroke-width="1.5"/>`).join('')}
          <rect x="74" y="204" width="252" height="196" rx="16" fill="none" stroke="#D5E1F2" stroke-width="3"/>
          <path d="M90 214 L120 214" stroke="#fff" stroke-width="6" stroke-linecap="round" opacity=".8"/></svg>
        <div class="sh-strips" style="position:absolute;left:80px;top:186px;width:240px;height:170px;overflow:hidden"></div>
        <div class="sh-feed" style="position:absolute;left:200px;top:58px;width:0;height:0"></div>
        <svg width="400" height="200" viewBox="0 0 400 200" style="position:absolute;left:0;top:0;overflow:visible">
          <defs><linearGradient id="shh" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7486A6"/><stop offset="1" stop-color="#4C5B78"/></linearGradient></defs>
          <rect x="14" y="64" width="372" height="124" rx="30" fill="url(#shh)"/>
          <rect x="14" y="150" width="372" height="18" fill="#EE7FAA" opacity=".9"/>
          <rect x="24" y="42" width="352" height="40" rx="18" fill="#8C9DBC"/>
          <rect x="66" y="52" width="268" height="14" rx="7" fill="#1C2333"/>
          <path d="M44 92 H150" stroke="rgba(255,255,255,.25)" stroke-width="8" stroke-linecap="round"/>
          <g class="sh-teeth">${[...Array(13)].map((_, i) => `<circle cx="${80 + i * 20}" cy="186" r="8" fill="#9AA8C2" stroke="#3B4862" stroke-width="3"/>`).join('')}</g>
          <circle cx="330" cy="112" r="20" fill="#2D3A52"/><circle class="sh-led" cx="330" cy="112" r="13" fill="#5FDC9B"/>
          <rect x="250" y="102" width="50" height="20" rx="10" fill="#2D3A52"/><rect class="sh-sw" x="254" y="105" width="22" height="14" rx="7" fill="#fff"/>
        </svg>
      </div></div>`);
    const strips = el.querySelector('.sh-strips'), led = el.querySelector('.sh-led'), sw = el.querySelector('.sh-sw'), glow = el.querySelector('.sh-glow'), teeth = el.querySelector('.sh-teeth');
    const S = [...Array(14)].map((_, i) => { const d = h(`<div style="position:absolute;top:0;width:9px;height:62px;border-radius:3px;background:${['#fff', '#FCE3EF', '#E2ECFA', '#FFF4D6'][i % 4]};box-shadow:0 0 0 1.5px #DCE6F4"></div>`); d.style.left = (8 + i * 16.5) + 'px'; strips.appendChild(d); return { d, ph: (i * 0.37) % 1 }; });
    el.feed = el.querySelector('.sh-feed');
    el.W = W; el.k = k;
    // slot centre in the shredder's own px
    el.slot = { x: 200 * k, y: 58 * k };
    let acc = 0, lastT = 0;
    // run: 0..1 motor; stop: 0..1 alarm; pos: strip travel driven by an explicit clock (t * run)
    el.set = ({ t = 0, run = 0, stop = 0, travel } = {}) => {
      const tr = travel ?? t * 2.2;
      S.forEach(s => { const y = ((tr + s.ph) % 1) * 230 - 70; s.d.style.transform = `translateY(${y}px)`; s.d.style.opacity = run > .05 ? 1 : 0; });
      led.setAttribute('fill', stop > .5 ? '#E0517F' : run > .05 ? '#5FDC9B' : '#B9C6DA');
      sw.setAttribute('x', run > .05 || stop > .5 ? 274 : 254);
      glow.style.opacity = stop * (.6 + .4 * Math.sin(t * 14));
      teeth.style.transform = `translateX(${run > .05 ? ((tr * 40) % 20) - 10 : 0}px)`;
      el.querySelector('.sh-in').style.transform = `scale(${k}) translate(${run * Math.sin(t * 70) * 2}px,${run * Math.cos(t * 83) * 1.5}px)`;
    };
    el.set({});
    return el;
  }

  // ---------------------------------------------------------------- flip calendar ("ปีที่ n")
  function calendar(w = 220) {
    const k = w / 220;
    const el = h(`<div style="position:absolute;width:${w}px;height:${260 * k}px">
      <div style="position:absolute;left:0;top:0;width:220px;height:260px;transform:scale(${k});transform-origin:0 0;perspective:700px">
        <div style="position:absolute;left:0;top:18px;width:220px;height:240px;border-radius:26px;background:#fff;box-shadow:0 16px 30px rgba(90,80,140,.22),0 0 0 4px #fff"></div>
        <div style="position:absolute;left:0;top:18px;width:220px;height:64px;border-radius:26px 26px 0 0;background:linear-gradient(90deg,#EE7FAA,#F7A8C8)"></div>
        <div class="cl-page" style="position:absolute;left:0;top:82px;width:220px;height:176px;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1">
          <div class="cl-cap" style="font-weight:700;font-size:30px;color:#7A8BA3">ปีที่</div><div class="cl-num" style="font-weight:800;font-size:96px;color:#31445D;margin-top:6px">1</div></div>
        <div class="cl-flip" style="position:absolute;left:0;top:82px;width:220px;height:176px;background:#fff;border-radius:0 0 26px 26px;transform-origin:50% 0;display:flex;flex-direction:column;align-items:center;justify-content:center;line-height:1;backface-visibility:hidden;box-shadow:0 6px 12px rgba(90,80,140,.15)">
          <div style="font-weight:700;font-size:30px;color:#7A8BA3">ปีที่</div><div class="cl-fnum" style="font-weight:800;font-size:96px;color:#31445D;margin-top:6px">1</div></div>
        ${[50, 110, 170].map(x => `<div style="position:absolute;left:${x - 9}px;top:0;width:18px;height:44px;border-radius:9px;background:#5E6E8C;box-shadow:inset 0 3px 0 rgba(255,255,255,.3)"></div>`).join('')}
        <div class="cl-done" style="position:absolute;left:150px;top:-12px;width:90px;height:90px;border-radius:50%;background:#26A269;display:grid;place-items:center;box-shadow:0 0 0 6px #fff,0 8px 16px rgba(38,162,105,.4);opacity:0"><svg width="54" height="54" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11" fill="none" stroke="#fff" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
      </div></div>`);
    const num = el.querySelector('.cl-num'), fl = el.querySelector('.cl-flip'), fnum = el.querySelector('.cl-fnum'), cap = el.querySelector('.cl-cap'), done = el.querySelector('.cl-done');
    // v: continuous year value (1..max); flips happen at each integer crossing
    el.set = (v, { max = 10, doneP = 0, capText = 'ปีที่' } = {}) => {
      const n = clamp(Math.floor(v), 1, max), fr = v - Math.floor(v);
      num.textContent = n; cap.textContent = capText;
      const flipping = v >= 2 && v < max + .5 && fr < .35 && Math.floor(v) <= max;
      if (flipping) { fnum.textContent = n - 1; fl.style.visibility = 'visible'; fl.style.transform = `rotateX(${-100 * E.in(fr / .35)}deg)`; }
      else fl.style.visibility = 'hidden';
      num.style.transform = `scale(${1 + .15 * Math.max(0, 1 - fr / .25) * (v >= 2 ? 1 : 0)})`;
      tf(done, { s: lerp(.2, 1, E.back(doneP)), o: clamp(doneP * 3) });
    };
    el.set(1);
    return el;
  }

  // ---------------------------------------------------------------- archive shelving / room pieces
  function shelf(w = 320, hgt = 820, seed = 0) {
    const rows = 4, rh = (hgt - 60) / rows;
    let s = '';
    for (let r = 0; r < rows; r++) {
      const y = 30 + r * rh;
      s += `<rect x="16" y="${y + rh - 16}" width="${w - 32}" height="16" fill="#D7B08A"/>`;
      let x = 30, i = 0;
      while (x < w - 60) {
        const kind = (seed * 7 + r * 5 + i * 3) % 5;
        if (kind < 2) {   // archive box
          const bw = 92, bh = rh * .62;
          s += `<rect x="${x}" y="${y + rh - 16 - bh}" width="${bw}" height="${bh}" rx="8" fill="${kind ? '#F4E3C8' : '#EAD6B6'}" stroke="#D8BE97" stroke-width="3"/>
                <rect x="${x + 18}" y="${y + rh - 16 - bh + 16}" width="${bw - 36}" height="26" rx="5" fill="#fff"/><rect x="${x + 26}" y="${y + rh - 16 - bh + 26}" width="${bw - 52}" height="6" rx="3" fill="#C9D6EA"/>
                <rect x="${x + bw / 2 - 12}" y="${y + rh - 16 - 26}" width="24" height="10" rx="5" fill="#C9A77E"/>`;
          x += bw + 8;
        } else {           // binders / folder spines
          const n = 3 + (r + i) % 3;
          for (let j = 0; j < n && x < w - 50; j++) {
            const bh = rh * (.6 + ((seed + r + i + j) % 3) * .08), c = ['#F5A9C7', '#A9CBF3', '#BDB2F0', '#F2CB6A', '#8FDDB3'][(seed + r * 2 + i + j) % 5];
            s += `<rect x="${x}" y="${y + rh - 16 - bh}" width="26" height="${bh}" rx="5" fill="${c}"/><rect x="${x + 5}" y="${y + rh - 16 - bh + 18}" width="16" height="22" rx="3" fill="#fff" opacity=".85"/>`;
            x += 29;
          }
          x += 10;
        }
        i++;
      }
    }
    return h(`<div style="position:absolute;width:${w}px;height:${hgt}px"><svg width="${w}" height="${hgt}" viewBox="0 0 ${w} ${hgt}">
      <rect x="0" y="0" width="${w}" height="${hgt}" rx="16" fill="#E9C9A4"/><rect x="14" y="14" width="${w - 28}" height="${hgt - 28}" rx="8" fill="#F6E7D3"/>${s}
      <rect x="0" y="0" width="${w}" height="22" rx="10" fill="#DDB892"/></svg></div>`);
  }
  function desk(w = 560) {
    return h(`<div style="position:absolute;width:${w}px;height:320px"><svg width="${w}" height="320" viewBox="0 0 ${w} 320">
      <rect x="30" y="40" width="34" height="280" rx="10" fill="#C99D74"/><rect x="${w - 64}" y="40" width="34" height="280" rx="10" fill="#C99D74"/>
      <rect x="${w - 230}" y="44" width="180" height="200" rx="16" fill="#E2BC93"/>
      <rect x="${w - 215}" y="70" width="150" height="70" rx="12" fill="#EBCBA6"/><rect x="${w - 215}" y="156" width="150" height="70" rx="12" fill="#EBCBA6"/>
      <rect x="${w - 160}" y="100" width="40" height="10" rx="5" fill="#B88A5F"/><rect x="${w - 160}" y="186" width="40" height="10" rx="5" fill="#B88A5F"/>
      <rect x="0" y="0" width="${w}" height="48" rx="16" fill="#E8C39B"/><rect x="0" y="34" width="${w}" height="14" rx="6" fill="#D2A87D"/>
      <path d="M30 14 H${w * .45}" stroke="rgba(255,255,255,.4)" stroke-width="7" stroke-linecap="round"/></svg></div>`);
  }
  function door(w = 300) {
    return h(`<div style="position:absolute;width:${w}px;height:${w * 2.3}px"><svg width="${w}" height="${w * 2.3}" viewBox="0 0 300 690">
      <rect x="0" y="0" width="300" height="690" rx="22" fill="#D9B48C"/><rect x="22" y="22" width="256" height="668" rx="12" fill="#EBCDA9"/>
      <rect x="50" y="60" width="200" height="250" rx="12" fill="#F4DFC3"/><rect x="50" y="350" width="200" height="290" rx="12" fill="#F4DFC3"/>
      <circle cx="236" cy="370" r="14" fill="#C99D74"/></svg>
      <div style="position:absolute;left:${w * .12}px;top:${w * .3}px;width:${w * .76}px;padding:10px 0;border-radius:16px;background:#fff;text-align:center;font-weight:800;font-size:${w * .1}px;color:#31445D;box-shadow:0 6px 12px rgba(90,70,120,.18)">ห้องเก็บเอกสาร</div></div>`);
  }
  function stamp(text, { col = '#E0517F', fs = 54, rot = -8 } = {}) {
    return h(`<div class="c" style="position:relative;display:inline-block;white-space:nowrap"><div style="display:inline-block;transform:rotate(${rot}deg);padding:10px 30px;border:7px solid ${col};border-radius:20px;color:${col};font-weight:800;font-size:${fs}px;line-height:1.2;background:rgba(255,255,255,.88);box-shadow:0 0 0 4px rgba(255,255,255,.7)">${text}</div></div>`);
  }
  function stopSign(size = 220) {
    return h(`<div class="c" style="position:absolute;width:${size}px;height:${size}px"><svg width="${size}" height="${size}" viewBox="0 0 100 100">
      <path d="M30 2 H70 L98 30 V70 L70 98 H30 L2 70 V30Z" fill="#fff"/><path d="M32 7 H68 L93 32 V68 L68 93 H32 L7 68 V32Z" fill="#E0517F"/>
      <text x="50" y="59" font-family="Prompt" font-weight="800" font-size="25" fill="#fff" text-anchor="middle">STOP</text></svg></div>`);
  }
  // simple icons used by the process diagram and summaries
  const IC = {
    mag: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="#EAF3FE" stroke="#5E8FD6" stroke-width="2.6"/><path d="M15 15l6 6" stroke="#5E8FD6" stroke-width="3" stroke-linecap="round"/></svg>`,
    list: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="4" y="2.5" width="16" height="19" rx="2.5" fill="#fff" stroke="#EE7FAA" stroke-width="2"/><path d="M8 8h8M8 12h8M8 16h5" stroke="#EE7FAA" stroke-width="2" stroke-linecap="round"/></svg>`,
    bldg: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3 9l9-5 9 5z" fill="#9C8FE6"/><path d="M5 10h14v9H5z" fill="#E4DEFA"/><path d="M7.5 11.5v6M10.5 11.5v6M13.5 11.5v6M16.5 11.5v6" stroke="#9C8FE6" stroke-width="1.8"/><rect x="3" y="19" width="18" height="2.5" rx="1" fill="#9C8FE6"/></svg>`,
    team: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="7" r="3.2" fill="#26A269"/><circle cx="5.5" cy="9" r="2.6" fill="#8FDDB3"/><circle cx="18.5" cy="9" r="2.6" fill="#8FDDB3"/><path d="M6.5 20a5.5 5.5 0 0 1 11 0z" fill="#26A269"/><path d="M1 20a4.5 4.5 0 0 1 7-3.7M23 20a4.5 4.5 0 0 0-7-3.7" fill="#8FDDB3"/></svg>`,
    loop: (s, c = '#6F9FE0') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M20 12a8 8 0 1 1-2.3-5.6M20 4v5h-5" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    inf: (s, c = '#C9962F') => `<svg width="${s}" height="${s * .5}" viewBox="0 0 48 24"><path d="M24 12c-4-6-8-8-12-8a8 8 0 0 0 0 16c4 0 8-2 12-8s8-8 12-8a8 8 0 0 1 0 16c-4 0-8-2-12-8z" fill="none" stroke="${c}" stroke-width="4.2" stroke-linecap="round"/></svg>`,
    seal: s => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><g fill="#E7B84A">${[...Array(16)].map((_, i) => `<circle cx="${50 + 40 * Math.cos(i / 16 * 6.283)}" cy="${50 + 40 * Math.sin(i / 16 * 6.283)}" r="9"/>`).join('')}</g><circle cx="50" cy="50" r="40" fill="#F2CB6A"/><circle cx="50" cy="50" r="31" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="4 4"/><path d="M50 30l5.5 11.5 12.5 1.6-9.2 8.6 2.4 12.4L50 58l-11.2 6.1 2.4-12.4-9.2-8.6 12.5-1.6z" fill="#fff"/></svg>`,
    lock: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M7 11V8a5 5 0 0 1 10 0v3" fill="none" stroke="#5E6E8C" stroke-width="2.6"/><rect x="4" y="10.5" width="16" height="11" rx="3" fill="#F2CB6A" stroke="#C9962F" stroke-width="1.6"/><circle cx="12" cy="15.5" r="1.8" fill="#8A6420"/><path d="M12 16.5v2.5" stroke="#8A6420" stroke-width="1.8" stroke-linecap="round"/></svg>`,
    warn: (s, c = '#E0517F') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2.5L22.5 21h-21z" fill="${c}" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 9v5.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.5" fill="#fff"/></svg>`,
    scroll: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="1.5" fill="#FDF3DA" stroke="#C9962F" stroke-width="1.6"/><rect x="3" y="2.5" width="18" height="3.5" rx="1.75" fill="#E7B84A"/><rect x="3" y="18" width="18" height="3.5" rx="1.75" fill="#E7B84A"/><path d="M8 9h8M8 12h8M8 15h5" stroke="#C9962F" stroke-width="1.4" stroke-linecap="round"/></svg>`,
    chart: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="3" fill="#fff" stroke="#6F9FE0" stroke-width="1.8"/><rect x="6.5" y="12" width="3" height="6" rx="1" fill="#95BFEF"/><rect x="10.5" y="8" width="3" height="10" rx="1" fill="#EE7FAA"/><rect x="14.5" y="10" width="3" height="8" rx="1" fill="#6F9FE0"/></svg>`,
    book: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3 5c3-1 6-1 9 1 3-2 6-2 9-1v14c-3-1-6-1-9 1-3-2-6-2-9-1z" fill="#E4DEFA" stroke="#8E80DC" stroke-width="1.8" stroke-linejoin="round"/><path d="M12 6v14" stroke="#8E80DC" stroke-width="1.8"/></svg>`,
    gavel: s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="9" y="2" width="9" height="5" rx="1.5" transform="rotate(45 13.5 4.5)" fill="#C99D74"/><path d="M10 10l-6.5 6.5" stroke="#8C6440" stroke-width="2.6" stroke-linecap="round"/><rect x="11" y="18.5" width="10" height="3" rx="1.2" fill="#8C6440"/></svg>`,
  };

  window.ARCH = { COL, folder, doc, shredder, calendar, shelf, desk, door, stamp, stopSign, IC };
})();
