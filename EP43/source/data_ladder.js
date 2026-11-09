// EP43 — DATA SIZE TOWER: reusable animated unit ladder (2.5D holographic platforms + vertical camera).
// The platforms are a schematic RANKING (equal spacing), not proportional volumes.
//   const tw = TOWER.build(containerEl, { id: 'main' });
//   tw.draw(t, { f, z, fy }, stateFn)   f = focused level (float), z = zoom, fy = screen y of the focus
//   stateFn(i) -> { o, act, hidden, lab }  (visibility, active 0..1, '?' silhouette 0..1, label opacity)
(function () {
  const { tf, clamp, lerp, E, P, h } = NSP;
  const SP = 460;                      // world spacing between levels (px at zoom 1)
  const U = window.UNITS;

  const ICONS = {
    bit: () => `<svg width="92" height="92" viewBox="0 0 92 92"><rect x="10" y="10" width="72" height="72" rx="16" fill="#0F2A5C" stroke="#22D3EE" stroke-width="5"/><text x="46" y="64" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="50" fill="#E6F4FF">1</text></svg>`,
    nibble: () => `<svg width="92" height="92" viewBox="0 0 92 92">${[0, 1, 2, 3].map(i => `<rect x="${6 + (i % 2) * 42}" y="${6 + Math.floor(i / 2) * 42}" width="36" height="36" rx="8" fill="${i % 3 ? '#22D3EE' : '#2F6BFF'}" stroke="#E6F4FF" stroke-width="2.5"/>`).join('')}</svg>`,
    Byte: () => `<svg width="92" height="92" viewBox="0 0 92 92">${[...Array(8)].map((_, i) => `<rect x="${4 + (i % 4) * 22}" y="${22 + Math.floor(i / 4) * 26}" width="18" height="22" rx="4" fill="${i % 3 ? '#22D3EE' : '#2F6BFF'}" stroke="#E6F4FF" stroke-width="2"/>`).join('')}</svg>`,
    kB: () => `<svg width="92" height="92" viewBox="0 0 92 92"><path d="M20 8h38l16 16v60H20z" fill="#E6F4FF"/><path d="M58 8v16h16" fill="#95BFEF"/><path d="M30 40h34M30 52h34M30 64h22" stroke="#2F6BFF" stroke-width="5" stroke-linecap="round"/></svg>`,
    MB: () => `<svg width="92" height="92" viewBox="0 0 92 92"><rect x="8" y="16" width="76" height="60" rx="10" fill="#E6F4FF"/><circle cx="30" cy="36" r="8" fill="#FFD23F"/><path d="M12 72l24-24 14 14 12-12 22 22z" fill="#2F6BFF"/></svg>`,
    GB: () => `<svg width="92" height="92" viewBox="0 0 92 92"><rect x="6" y="16" width="80" height="60" rx="10" fill="#E6F4FF"/><path d="M6 28h80M6 64h80" stroke="#95BFEF" stroke-width="4"/>${[0, 1, 2, 3, 4].map(i => `<rect x="${12 + i * 16}" y="19" width="8" height="6" rx="2" fill="#142B53"/><rect x="${12 + i * 16}" y="67" width="8" height="6" rx="2" fill="#142B53"/>`).join('')}<path d="M38 36v20l18-10z" fill="#2F6BFF"/></svg>`,
    TB: () => `<svg width="92" height="92" viewBox="0 0 92 92"><rect x="10" y="10" width="72" height="72" rx="12" fill="#E6F4FF"/><circle cx="46" cy="44" r="24" fill="#95BFEF"/><circle cx="46" cy="44" r="6" fill="#142B53"/><path d="M46 44l22 26" stroke="#2F6BFF" stroke-width="5" stroke-linecap="round"/></svg>`,
    PB: () => `<svg width="92" height="92" viewBox="0 0 92 92"><rect x="22" y="6" width="48" height="80" rx="8" fill="#E6F4FF"/>${[0, 1, 2, 3, 4].map(i => `<rect x="28" y="${13 + i * 14}" width="36" height="9" rx="3" fill="#2F6BFF"/><circle cx="58" cy="${17.5 + i * 14}" r="2.5" fill="#22D3EE"/>`).join('')}</svg>`,
    EB: () => `<svg width="92" height="92" viewBox="0 0 92 92">${[0, 1, 2].map(k => `<g transform="translate(${4 + k * 29},${10 - k * 0})"><rect width="25" height="74" rx="5" fill="#E6F4FF"/>${[0, 1, 2, 3, 4].map(i => `<rect x="4" y="${6 + i * 13}" width="17" height="8" rx="2" fill="${k === 1 ? '#22D3EE' : '#2F6BFF'}"/>`).join('')}</g>`).join('')}</svg>`,
    ZB: () => `<svg width="92" height="92" viewBox="0 0 92 92"><circle cx="46" cy="46" r="36" fill="none" stroke="#95BFEF" stroke-width="4"/><ellipse cx="46" cy="46" rx="16" ry="36" fill="none" stroke="#95BFEF" stroke-width="3.5"/><path d="M10 46h72M16 28h60M16 64h60" stroke="#95BFEF" stroke-width="3"/>${[[46, 10], [80, 46], [22, 70], [62, 26]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="7" fill="#22D3EE" stroke="#E6F4FF" stroke-width="2.5"/>`).join('')}</svg>`,
    YB: () => `<svg width="92" height="92" viewBox="0 0 92 92"><path d="M46 6l36 20v40L46 86 10 66V26z" fill="#2F6BFF" stroke="#E6F4FF" stroke-width="4"/><path d="M10 26l36 20 36-20M46 46v40" stroke="#E6F4FF" stroke-width="4" fill="none"/><path d="M28 16l36 20M64 16 28 36" stroke="#22D3EE" stroke-width="2.5" opacity=".7"/></svg>`,
  };

  function slab(w, id, ghost) {
    const rx = w / 2, ry = w * 0.13, th = 30, W = w + 120, cx = W / 2, cy = 40 + ry, H = cy + ry + th + 40;
    const top = ghost ? '#10244A' : `url(#t${id})`, side = ghost ? '#0B1A36' : `url(#s${id})`;
    const stroke = ghost ? 'rgba(149,191,239,.75)' : '#22D3EE';
    return `<svg width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" style="position:absolute;left:${-cx}px;top:${-cy}px;overflow:visible">
      <defs>
        <linearGradient id="t${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#5B92FF"/><stop offset=".5" stop-color="#2F6BFF"/><stop offset="1" stop-color="#173C8C"/></linearGradient>
        <linearGradient id="s${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1D4AA8"/><stop offset="1" stop-color="#0B1A36"/></linearGradient>
      </defs>
      <path d="M${cx - rx},${cy} A${rx},${ry} 0 0 0 ${cx + rx},${cy} L${cx + rx},${cy + th} A${rx},${ry} 0 0 1 ${cx - rx},${cy + th} Z" fill="${side}" stroke="${stroke}" stroke-width="3" ${ghost ? 'stroke-dasharray="14 10"' : ''}/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${top}" stroke="${stroke}" stroke-width="5" ${ghost ? 'stroke-dasharray="16 12"' : ''}/>
      ${ghost ? '' : `<ellipse class="ring" cx="${cx}" cy="${cy}" rx="${rx * .74}" ry="${ry * .74}" fill="none" stroke="rgba(230,244,255,.55)" stroke-width="3" stroke-dasharray="18 12"/>
      <ellipse cx="${cx}" cy="${cy}" rx="${rx * .42}" ry="${ry * .42}" fill="rgba(34,211,238,.35)"/>
      <path d="M${cx - rx + 10},${cy + th + 2} A${rx - 10},${ry} 0 0 0 ${cx + rx - 10},${cy + th + 2}" fill="none" stroke="rgba(34,211,238,.8)" stroke-width="4"/>`}
    </svg>`;
  }

  function build(container, { id = 't', levels = U.length } = {}) {
    const world = h(`<div class="tw-world" style="position:absolute;left:0;top:0;width:1080px;height:0;transform-origin:0 0"></div>`);
    container.appendChild(world);
    // side struts with travelling light pulses
    const strut = h(`<div class="tw-strut" style="position:absolute;left:0;top:${-(levels - 1) * SP - 200}px;width:1080px;height:${(levels - 1) * SP + 400}px">
      <div style="position:absolute;left:236px;top:0;bottom:0;width:4px;background:linear-gradient(180deg,rgba(34,211,238,0),rgba(34,211,238,.45) 10%,rgba(34,211,238,.45) 90%,rgba(34,211,238,0))"></div>
      <div style="position:absolute;left:840px;top:0;bottom:0;width:4px;background:linear-gradient(180deg,rgba(34,211,238,0),rgba(34,211,238,.45) 10%,rgba(34,211,238,.45) 90%,rgba(34,211,238,0))"></div>
      ${[...Array(10)].map((_, k) => `<div class="tw-pulse" style="position:absolute;left:${k % 2 ? 832 : 228}px;width:20px;height:90px;border-radius:10px;background:radial-gradient(ellipse,rgba(230,244,255,.95),rgba(34,211,238,.4) 50%,rgba(34,211,238,0) 72%)"></div>`).join('')}
    </div>`);
    world.appendChild(strut);
    const pulses = [...strut.querySelectorAll('.tw-pulse')];
    const L = U.slice(0, levels).map((u, i) => {
      const w = 400 + i * 16;
      const el = h(`<div class="pf" style="position:absolute;left:540px;top:${-i * SP}px;width:0;height:0">
        <div class="pf-glow" style="position:absolute;left:${-w * .75}px;top:${-w * .22}px;width:${w * 1.5}px;height:${w * .44}px;border-radius:50%;background:radial-gradient(ellipse,rgba(34,211,238,.55),rgba(47,107,255,.25) 45%,rgba(47,107,255,0) 70%)"></div>
        <div class="pf-ghost">${slab(w, id + i + 'g', true)}</div>
        <div class="pf-real">${slab(w, id + i, false)}</div>
        <div class="pf-chev" style="position:absolute;left:-26px;top:${-SP + w * .13 + 44}px;width:52px;height:40px"><svg width="52" height="40" viewBox="0 0 52 40"><path d="M6 32L26 12l20 20" fill="none" stroke="#22D3EE" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>
        <div class="pf-lab" style="position:absolute;left:-360px;width:720px;bottom:46px;display:flex;flex-direction:column;align-items:center;transform-origin:50% 100%">
          ${u.si2022 ? `<div class="pf-pre" data-crit="1">${u.prefix.toUpperCase()} · ${u.p}</div>` : ''}
          <div class="pf-ab" data-crit="1">${ICONS[u.k] ? `<span class="pf-ic">${ICONS[u.k]()}</span>` : ''}<span class="ab">${u.big}</span></div>
          <div class="pf-nm" data-crit="1">${u.sym && u.sym !== u.big ? `${u.en} (${u.sym})` : u.en} · ${u.th}</div>
          <div class="pf-val" data-crit="1">${u.exp ? `1 ${u.sym} = 10<span class="ex">${u.exp}</span> B` : u.k === 'nibble' ? '1 nibble = 4 bits' : u.k === 'Byte' ? '1 B = 8 bits' : 'ค่า 0 หรือ 1'}</div>
        </div>
        <div class="pf-q" style="position:absolute;left:-200px;width:400px;bottom:60px;text-align:center;font-weight:800;font-size:150px;line-height:1;color:rgba(149,191,239,.9);text-shadow:0 0 30px rgba(34,211,238,.6)">?</div>
      </div>`);
      world.appendChild(el);
      const q = s => el.querySelector(s);
      el.querySelectorAll('[data-crit]').forEach(c => c.removeAttribute('data-crit'));
      return { el, crit: [...el.querySelectorAll('.pf-pre,.pf-ab,.pf-nm,.pf-val')], glow: q('.pf-glow'), ghost: q('.pf-ghost'), real: q('.pf-real'), lab: q('.pf-lab'), nm: q('.pf-nm'), val: q('.pf-val'), qm: q('.pf-q'), chev: q('.pf-chev'), ring: q('.ring'), w };
    });

    // world y of level i is -i*SP. Camera puts level f at screen (540, fy) with zoom z.
    function draw(t, { f, z, fy = 1000 }, stateFn) {
      world.style.transform = `translate(540px,${fy}px) scale(${z}) translate(-540px,${f * SP}px)`;
      pulses.forEach((p, k) => { const span = (levels - 1) * SP + 400; const y = (span - ((t * 260 + k * 397) % span)); p.style.top = (y - 45) + 'px'; p.style.opacity = .8; });
      const small = clamp((z - .2) / .1);               // labels fade when the camera is far out
      const detail = clamp((z - .45) / .15);            // names / values fade earlier than abbreviations
      L.forEach((p, i) => {
        const s = stateFn(i);
        const o = s.o ?? 0, act = s.act ?? 0, hid = s.hidden ?? 0, lab = (s.lab ?? 1);
        p.el.style.visibility = o <= .001 ? 'hidden' : 'visible';
        p.el.style.opacity = o;
        p.ghost.style.opacity = hid;
        p.real.style.opacity = 1 - hid;
        p.real.style.filter = `brightness(${.7 + .5 * act}) saturate(${.8 + .4 * act})`;
        p.glow.style.opacity = (.25 + .75 * act) * (1 - hid);
        p.glow.style.transform = `scale(${1 + .06 * Math.sin(t * 2.4 + i)})`;
        if (p.ring) p.ring.setAttribute('stroke-dashoffset', (t * 60 + i * 13).toFixed(1));
        const lo = (1 - hid) * lab * small;
        p.lab.style.opacity = lo;
        p.lab.style.visibility = lo <= .01 ? 'hidden' : 'visible';
        const ls = (s.scale ?? 1) * (.8 + .2 * act);
        p.lab.style.transform = `translateY(${(s.dy ?? 0) + Math.sin(t * 1.6 + i) * 6}px) scale(${ls})`;
        p.crit.forEach(c => c.toggleAttribute('data-crit', act > .5 && lo > .6 && o > .6));
        p.nm.style.opacity = detail; p.val.style.opacity = detail;
        p.nm.style.display = p.val.style.display = detail < .02 ? 'none' : '';
        p.qm.style.opacity = hid * (s.qo ?? 1) * small;
        p.qm.style.visibility = p.qm.style.opacity <= .01 ? 'hidden' : 'visible';
        p.qm.style.transform = `translateY(${Math.sin(t * 2 + i) * 8}px)`;
        p.chev.style.opacity = (s.chev ?? 0);
      });
    }
    // screen position of a level's anchor for overlays
    const screenY = (i, { f, z, fy = 1000 }) => fy + (f - i) * SP * z;
    return { world, L, draw, screenY, SP };
  }

  // eased keyframe camera: KF = [[t, f, z, fy], ...] (absolute times, sorted). Holds between equal frames.
  function camera(KF, t) {
    if (t <= KF[0][0]) return { f: KF[0][1], z: KF[0][2], fy: KF[0][3] };
    for (let k = 0; k < KF.length - 1; k++) {
      const a = KF[k], b = KF[k + 1];
      if (t >= a[0] && t < b[0]) { const p = E.inOut((t - a[0]) / (b[0] - a[0])); return { f: lerp(a[1], b[1], p), z: lerp(a[2], b[2], p), fy: lerp(a[3], b[3], p) }; }
    }
    const l = KF[KF.length - 1]; return { f: l[1], z: l[2], fy: l[3] };
  }
  window.TOWER = { build, camera, SP, ICONS };
})();
