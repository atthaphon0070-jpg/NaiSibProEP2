// NaiSibPro EP30 probability kit (reusable): transparent acrylic box with five individually rendered balls that keep a
// stable identity (R1 R2 R3 red, B1 B2 blue), a deterministic draw-without-replacement animation (hand picks a ball,
// lifts it over the rim and drops it into a separate "removed" tray), a state-driven count bar, stacked fractions,
// a percentage ring and a 10-cell bar. Every ball element carries data-id / data-color / data-loc (in | lift = being raised, still inside | fly = dropping in | out) so the
// QC tools can count what is actually on screen. All artwork is original vector/CSS.
(function () {
  const { h, clamp, lerp, E, P, tf } = NSP;
  const add = (par, html) => { const e = h(html); par.appendChild(e); return e; };
  const COL = { R: '#EF4444', B: '#3B82F6' };
  const IDS = ['R1', 'R2', 'R3', 'B1', 'B2'];
  const colorOf = id => id[0];
  // geometry (box-local px). Box 350 × 250, open top; the tray sits 30 px to the right of the box.
  const BW = 350, BH = 250, TRX = 380, TW = 150, GW = TRX + TW, BALL = 96;
  // fixed slots: two reds on the top row (they are the ones drawn), B R B on the floor
  const SLOT = { R1: [125, 112], R2: [225, 112], B1: [75, 196], R3: [175, 196], B2: [275, 196] };
  const TRAY = [[TRX + 75, 196], [TRX + 75, 112]];
  const LIFT = -6;                                   // ball centre height while carried over the rim

  const ballHTML = (id) => `<div class="pball ${colorOf(id) === 'R' ? 'red' : 'blue'} sz" data-id="${id}" data-color="${colorOf(id) === 'R' ? 'red' : 'blue'}" data-loc="in">
      <div class="pb-glow"></div><div class="pb-body"></div><div class="pb-spec"></div><div class="pb-n"></div></div>`;
  const handHTML = `<svg class="phand" width="170" height="560" viewBox="0 0 170 560" style="position:absolute;left:0;top:0;overflow:visible">
      <defs><linearGradient id="slv" x1="0" x2="1"><stop offset="0" stop-color="#1E3D78"/><stop offset=".5" stop-color="#2F6BFF"/><stop offset="1" stop-color="#142B53"/></linearGradient></defs>
      <rect x="45" y="0" width="80" height="410" rx="20" fill="url(#slv)"/>
      <rect x="40" y="372" width="90" height="34" rx="12" fill="#EE7FAA"/><rect x="40" y="380" width="90" height="7" fill="#F8CFE2"/>
      <g class="ph-palm"><path d="M48 404 C44 440 40 470 52 492 L118 492 C130 470 126 440 122 404 Z" fill="#F6D2B8" stroke="#C99673" stroke-width="3"/>
      <path d="M48 430 C30 438 22 456 30 470 C36 476 44 470 48 462" fill="#F6D2B8" stroke="#C99673" stroke-width="3"/></g>
      <g class="ph-f">${[56, 74, 92, 110].map((x, i) => `<rect class="ph-fi" x="${x - 9}" y="478" width="18" height="${i === 0 || i === 3 ? 42 : 50}" rx="9" fill="#F6D2B8" stroke="#C99673" stroke-width="3"/>`).join('')}</g></svg>`;

  // one draw = { id, at, d }   (d defaults to 1.6 s). Ball clears the rim at at + .55 d.
  const PH = { reach: .28, grip: .36, lift: .58, carry: .80, drop: .92 };
  function box(par, { x = 275, y = 440, s = 1, tray = true, label = 'หยิบออกแล้ว' } = {}) {
    const g = add(par, `<div class="pgrp" style="position:absolute;left:${x}px;top:${y}px;width:${GW}px;height:${BH}px;transform-origin:50% 50%"></div>`);
    const gi = add(g, `<div class="pgrp-in" style="position:absolute;left:0;top:0;width:${GW}px;height:${BH}px;transform-origin:50% 50%;transform:scale(${s})"></div>`);
    const shadow = add(gi, `<div class="abs" style="left:-30px;top:${BH - 14}px;width:${GW + 60}px;height:44px;border-radius:50%;background:radial-gradient(ellipse at 50% 50%,rgba(12,27,58,.32),rgba(12,27,58,0) 70%)"></div>`);
    const back = add(gi, `<svg class="abs" width="${BW}" height="${BH}" style="left:0;top:0;z-index:1;overflow:visible">
      <defs><linearGradient id="bkg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="rgba(149,191,239,.10)"/><stop offset="1" stop-color="rgba(149,191,239,.28)"/></linearGradient></defs>
      <rect x="16" y="0" width="${BW - 32}" height="${BH - 22}" rx="10" fill="url(#bkg)" stroke="rgba(149,191,239,.75)" stroke-width="3"/>
      <path d="M16 ${BH - 22} L0 ${BH - 6}" stroke="rgba(149,191,239,.6)" stroke-width="3"/><path d="M${BW - 16} ${BH - 22} L${BW} ${BH - 6}" stroke="rgba(149,191,239,.6)" stroke-width="3"/>
      <rect x="2" y="${BH - 22}" width="${BW - 4}" height="18" fill="rgba(149,191,239,.25)"/></svg>`);
    const front = add(gi, `<svg class="abs pbox-front sz" width="${BW}" height="${BH}" style="left:0;top:0;z-index:3;overflow:visible">
      <defs><linearGradient id="frg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="rgba(255,255,255,.26)"/><stop offset=".45" stop-color="rgba(220,235,255,.08)"/><stop offset="1" stop-color="rgba(149,191,239,.20)"/></linearGradient></defs>
      <path d="M0 36 L${BW} 36 L${BW} ${BH - 14} Q${BW} ${BH} ${BW - 14} ${BH} L14 ${BH} Q0 ${BH} 0 ${BH - 14} Z" fill="url(#frg)" stroke="#95BFEF" stroke-width="6" stroke-linejoin="round"/>
      <path d="M0 36 L16 0 L${BW - 16} 0 L${BW} 36" fill="none" stroke="#B8D9F8" stroke-width="5" stroke-linejoin="round"/>
      <path d="M3 36 L${BW - 3} 36" stroke="#FFFFFF" stroke-opacity=".85" stroke-width="3"/>
      <path d="M28 60 L64 60 L30 ${BH - 30} L18 ${BH - 30} Z" fill="rgba(255,255,255,.30)"/><path d="M76 60 L90 60 L52 ${BH - 30} L42 ${BH - 30} Z" fill="rgba(255,255,255,.18)"/>
      <path d="M${BW - 20} 52 L${BW - 20} ${BH - 40}" stroke="rgba(255,255,255,.55)" stroke-width="5" stroke-linecap="round"/></svg>`);
    const tr = add(gi, `<div class="ptray" style="position:absolute;left:${TRX}px;top:0;width:${TW}px;height:${BH}px">
      <svg class="abs" width="${TW}" height="${BH}" style="left:0;top:0;overflow:visible">
        <rect x="3" y="20" width="${TW - 6}" height="${BH - 20}" rx="26" fill="rgba(248,207,226,.22)" stroke="#EE7FAA" stroke-width="5" stroke-dasharray="14 10"/></svg>
      <div class="ptray-l sz" style="position:absolute;right:0;width:max-content;top:-44px;text-align:center;font-weight:800;font-size:30px;line-height:1;white-space:nowrap;color:#EE7FAA">${label}</div></div>`);
    const trL = tr.querySelector('.ptray-l');
    const ghosts = {}; IDS.forEach(id => { ghosts[id] = add(gi, `<div class="abs" style="left:${SLOT[id][0] - BALL / 2}px;top:${SLOT[id][1] - BALL / 2}px;width:${BALL}px;height:${BALL}px;border-radius:50%;border:5px dashed ${COL[colorOf(id)]};opacity:0;z-index:2"></div>`); });
    const balls = {}; IDS.forEach(id => { const el = add(gi, ballHTML(id)); el.style.zIndex = 2; balls[id] = { el, n: el.querySelector('.pb-n'), glow: el.querySelector('.pb-glow') }; });
    // back glass z1, ghosts z2, balls z2 (z5 once carried above the rim), front glass z3, hand z6 — all siblings in the group
    const hand = add(gi, `<div class="abs" style="left:0;top:0;width:1px;height:1px;z-index:6">${handHTML}</div>`);
    const fing = [...hand.querySelectorAll('.ph-fi')];

    // cfg: { ev:[{id,at,d}], drop:{id:at}, hl:id=>0..1, dim:0..1, num:id=>[txt,o], tray:0..1, ghost:0..1, centre:0..1 (box centred, tray hidden), shake:{at} }
    function draw(u, cfg = {}) {
      const ev = (cfg.ev || []).map(e => ({ d: 1.6, ...e })).sort((a, b) => a.at - b.at);
      const trayO = cfg.tray ?? (tray ? 1 : 0), cen = cfg.centre ?? (tray ? 0 : 1);
      const off = lerp(0, (GW - BW) / 2, E.inOut(clamp(cen)));
      [back, front, ...Object.values(ghosts)].forEach(e => e.style.transform = `translateX(${off}px)`);
      tf(tr, { o: trayO * (1 - cen), x: 0 });
      trL.style.opacity = 1;
      let handPos = null, grip = 0;
      const out = [], state = { inside: [], fly: [], out: [] };
      const sk = cfg.shake ? Math.sin((u - cfg.shake) * 38) * 7 * (1 - P(u, cfg.shake, .6)) * (u >= cfg.shake ? 1 : 0) : 0;
      IDS.forEach(id => {
        const b = balls[id], k = ev.findIndex(e => e.id === id);
        let [bx0, by0] = SLOT[id]; bx0 += off;
        let X = bx0, Y = by0, loc = 'in', sc = 1, rot = 0, o = 1;
        if (cfg.drop && id in cfg.drop) {                 // falling into the box (intro)
          const a = cfg.drop[id], p = P(u, a, .55);
          o = clamp((u - a) / .12); Y = lerp(-40, by0, p < .7 ? E.in(p / .7) : 1) - (p >= .7 ? Math.sin((p - .7) / .3 * Math.PI) * 26 : 0);
          sc = p >= .7 && p < .78 ? 1 + .06 * Math.sin((p - .7) / .08 * Math.PI) : 1; if (u < a + .55 * .7) loc = 'fly';
        }
        if (k >= 0 && u >= ev[k].at) {
          const e = ev[k], q = (u - e.at) / e.d, slot = ev.filter((x, i) => i < k).length;   // nth removed ball → nth tray slot
          const [tx, ty] = TRAY[slot];
          if (q < PH.grip) { /* still resting */ }
          else if (q < PH.lift) { const p = E.inOut((q - PH.grip) / (PH.lift - PH.grip)); Y = lerp(by0, LIFT, p); loc = 'lift'; }   // still counted inside until it clears the rim
          else if (q < PH.carry) { const p = E.inOut((q - PH.lift) / (PH.carry - PH.lift)); X = lerp(bx0, tx, p); Y = LIFT - Math.sin(p * Math.PI) * 8; loc = 'out'; }
          else { const p = clamp((q - PH.carry) / (PH.drop - PH.carry)); X = tx; Y = lerp(LIFT, ty, E.in(p)) - (q > PH.drop ? Math.max(0, Math.sin(clamp((q - PH.drop) / .08) * Math.PI)) * 14 : 0); loc = 'out'; }
          if (q >= PH.lift - .02) b.el.style.zIndex = 5; else b.el.style.zIndex = 2;
          if (q >= PH.lift) state.out.push(id);
          // hand
          if (q < 1.25) {
            let hx = bx0, hy;
            if (q < PH.reach) { hx = bx0; hy = lerp(-640, by0 - 48, E.out(q / PH.reach)); }
            else if (q < PH.grip) { hy = by0 - 48; grip = (q - PH.reach) / (PH.grip - PH.reach); }
            else if (q < PH.drop) { hx = X; hy = Y - 48; grip = 1; }
            else { const p = clamp((q - PH.drop) / .33); hx = X; hy = lerp(ty - 48, -700, E.in(p)); grip = 1 - clamp(p * 3); }
            handPos = [hx, hy];
          }
          if (q >= PH.grip && q < PH.grip + .06) sc = 1 - .05 * Math.sin((q - PH.grip) / .06 * Math.PI);
        } else b.el.style.zIndex = 2;
        const carried = k >= 0 && u >= ev[k].at + ev[k].d * PH.lift, dropping = loc === 'fly' && !!cfg.drop && id in cfg.drop;
        if (!carried && !dropping && o > 0) state.inside.push(id);
        if (loc === 'in') X += sk;
        b.el.dataset.loc = loc;
        const hlv = cfg.hl ? clamp(cfg.hl(id, u)) : 0;
        const dim = cfg.dim ? clamp(cfg.dim) * (1 - hlv) : 0;
        tf(b.el, { x: X - BALL / 2, y: Y - BALL / 2, s: sc * (1 + .08 * hlv), r: rot, o: o * (1 - .55 * dim) });
        b.glow.style.opacity = hlv;
        const nm = cfg.num ? cfg.num(id, u) : null;
        if (nm && nm[1] > .01) { b.n.textContent = nm[0]; b.n.style.opacity = nm[1]; b.n.style.transform = `scale(${lerp(.4, 1, E.back(clamp(nm[1])))})`; } else b.n.style.opacity = 0;
        // ghost ring where a removed ball used to sit
        const go = k >= 0 ? clamp((u - ev[k].at - ev[k].d * PH.lift) / .3) * (cfg.ghost ?? 0) : 0;
        tf(ghosts[id], { o: go * (.55 + .15 * Math.sin(u * 4)), x: 0 });
      });
      if (handPos) { tf(hand, { x: handPos[0] - 85, y: handPos[1] - 500, o: 1 }); fing.forEach((f, i) => f.setAttribute('height', (i === 0 || i === 3 ? 42 : 50) * (1 - .38 * grip))); }
      else tf(hand, { o: 0 });
      const R = state.inside.filter(i => i[0] === 'R').length, Bc = state.inside.length - R;
      return { inside: state.inside, R, B: Bc, T: state.inside.length, out: state.out };
    }
    // seconds (scene-local) at which the visible inside-count drops, for SFX / count pops
    const rimTimes = ev => (ev || []).map(e => ({ id: e.id, t: e.at + (e.d ?? 1.6) * PH.lift, land: e.at + (e.d ?? 1.6) * PH.drop, grab: e.at + (e.d ?? 1.6) * PH.reach }));
    return { g, front, tr, balls, draw, rimTimes, size: [GW, BH] };
  }
  function drawSfx(base, ev) {
    ev.forEach(e => { const d = e.d ?? 1.6; NSP.sfx('whoosh', base + e.at, .35); NSP.sfx('glass', base + e.at + d * PH.reach, .6); NSP.sfx('pop', base + e.at + d * PH.grip, .7); NSP.sfx('whoosh', base + e.at + d * PH.lift, .4); NSP.sfx('clack', base + e.at + d * PH.drop, 1); });
  }

  // state-driven count bar: [● แดง n] [● น้ำเงิน m] [รวม T ลูก]
  function counts(par, top, { light = true } = {}) {
    const el = add(par, `<div class="pcount" style="position:absolute;left:220px;width:640px;top:${top}px;display:flex;justify-content:center;gap:14px">
      <div class="pc-r pchip sz"><span class="dot" style="background:radial-gradient(circle at 35% 30%,#FFD1D1,#EF4444 55%,#B91C1C)"></span>แดง <b class="v">3</b></div>
      <div class="pc-b pchip sz"><span class="dot" style="background:radial-gradient(circle at 35% 30%,#DCEBFF,#3B82F6 55%,#1D4ED8)"></span>น้ำเงิน <b class="v">2</b></div>
      <div class="pc-t pchip tot sz">รวม <b class="v">5</b> ลูก</div></div>`);
    const parts = { R: el.querySelector('.pc-r'), B: el.querySelector('.pc-b'), T: el.querySelector('.pc-t') };
    // st = box.draw() result; o = {R,B,T} opacities; pop = {R,B,T} seconds since the value last changed (or null)
    function draw(u, st, o = { R: 1, B: 1, T: 1 }, pop = {}) {
      for (const k of ['R', 'B', 'T']) {
        const v = st[k]; parts[k].querySelector('.v').textContent = v;
        const pp = pop[k] != null && pop[k] >= 0 && pop[k] < .6 ? Math.sin(pop[k] / .6 * Math.PI) : 0;
        tf(parts[k], { o: clamp(o[k] ?? 1), s: 1 + .14 * pp, y: (1 - E.out(clamp((o[k] ?? 1)))) * 20 });
        parts[k].style.boxShadow = pp ? `0 0 0 ${4 + 6 * pp}px rgba(255,210,63,${.8 * pp}),0 10px 22px rgba(20,43,83,.18)` : '';
      }
    }
    return { el, draw, parts };
  }

  // stacked fraction. kind: 'nv' (white/yellow on navy card) | 'lt' (navy on light) | 'gr' (white on green)
  const frac = (n, d, fs = 96, { cls = '', nc = '', dc = '', check = '' } = {}) =>
    `<span class="frac ${cls} sz" data-n="${n}" data-d="${d}"${check ? ` data-check="${check}"` : ''} style="font-size:${fs}px"><span class="fn"${nc ? ` style="color:${nc}"` : ''}>${n}</span><span class="fb"></span><span class="fd"${dc ? ` style="color:${dc}"` : ''}>${d}</span></span>`;

  // percentage ring: fills to `pct` (0..1) of the circle
  function ring(par, x, y, size = 230) {
    const r = size * .4, C = 2 * Math.PI * r, c = size / 2;
    const el = add(par, `<div class="abs sz" style="left:${x}px;top:${y}px;width:${size}px;height:${size}px">
      <svg width="${size}" height="${size}" style="position:absolute;inset:0"><defs><linearGradient id="rgp" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFD23F"/><stop offset="1" stop-color="#EE7FAA"/></linearGradient></defs>
      <circle cx="${c}" cy="${c}" r="${size * .48}" fill="#142B53"/><circle cx="${c}" cy="${c}" r="${r}" fill="none" stroke="rgba(255,255,255,.16)" stroke-width="${size * .1}"/>
      <circle class="rg" cx="${c}" cy="${c}" r="${r}" fill="none" stroke="url(#rgp)" stroke-width="${size * .1}" stroke-linecap="butt" stroke-dasharray="0 ${C}" transform="rotate(-90 ${c} ${c})"/></svg>
      <div class="rg-t" style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:${size * .26}px;color:#FFD23F;line-height:1;padding-top:${size * .03}px">0%</div></div>`);
    const arc = el.querySelector('.rg'), txt = el.querySelector('.rg-t');
    return { el, set(p) { arc.setAttribute('stroke-dasharray', `${C * p} ${C}`); txt.textContent = Math.round(p * 100) + '%'; el.dataset.pct = (p * 100).toFixed(1); } };
  }
  // 10-cell bar (3 of 10 filled = 3/10)
  function cells(par, x, y, n = 10, w = 58) {
    const el = add(par, `<div class="abs sz" style="left:${x}px;top:${y}px;display:flex;gap:6px">${[...Array(n)].map(() => `<div class="cl" style="width:${w}px;height:${w}px;border-radius:14px;background:rgba(255,255,255,.14);box-shadow:inset 0 0 0 3px rgba(149,191,239,.55)"></div>`).join('')}</div>`);
    const cl = [...el.querySelectorAll('.cl')];
    return { el, set(k, u, a) { cl.forEach((c, i) => { const on = i < k && u >= a + i * .18; c.style.background = on ? 'linear-gradient(160deg,#FFD23F,#F59E0B)' : 'rgba(255,255,255,.14)'; c.style.transform = on ? `scale(${1 + .2 * Math.max(0, 1 - (u - a - i * .18) / .3)})` : ''; }); el.dataset.filled = cl.filter(c => c.style.background.includes('gradient')).length; } };
  }
  const ballIcon = (c, s = 44) => `<span class="bi" style="display:inline-block;width:${s}px;height:${s}px;border-radius:50%;flex:none;vertical-align:middle;background:radial-gradient(circle at 35% 30%,${c === 'R' ? '#FFD1D1,#EF4444 55%,#B91C1C' : '#DCEBFF,#3B82F6 55%,#1D4ED8'});box-shadow:inset -3px -4px 0 rgba(0,0,0,.15)"></span>`;

  window.PROB = { box, drawSfx, counts, frac, ring, cells, ballIcon, IDS, SLOT, PH, BW, BH, GW, BALL, COL };
})();
