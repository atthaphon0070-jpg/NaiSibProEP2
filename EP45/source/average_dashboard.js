// NaiSibPro EP.45 — digital average-score dashboard.
// Two metrics (student count, average) with slot-style digit changes: each changing digit slides out
// while the new digit slides in, so 12 → 11 and 70 → 68 never pass through invented in-between values.
(function () {
  const { h, clamp, lerp, E, P, tf } = window.NSP;
  const C = window.STUDENTS.COL;

  // slot digits: el gets n cells; set(from, to, p)
  function Slot(el, n) {
    el.style.display = 'inline-flex';
    const cells = [...Array(n)].map(() => {
      const c = h(`<span style="position:relative;display:inline-block;overflow:hidden;height:1.12em;line-height:1.12em;width:.62em;text-align:center"><span class="a" style="position:absolute;left:0;right:0;top:0"></span><span class="b" style="position:absolute;left:0;right:0;top:0"></span></span>`);
      el.appendChild(c); return { a: c.querySelector('.a'), b: c.querySelector('.b'), c };
    });
    return {
      set(from, to, p) {
        from = String(from).padStart(n, ' '); to = String(to).padStart(n, ' ');
        const e = E.out(clamp(p));
        cells.forEach((k, i) => {
          const f = from[i], t = to[i];
          k.c.style.display = (f === ' ' && t === ' ') ? 'none' : 'inline-block';
          if (f === t || p >= 1 || p <= 0) {
            k.a.textContent = p >= 1 ? t : f; k.a.style.transform = ''; k.a.style.opacity = 1; k.b.style.opacity = 0;
          } else {
            k.a.textContent = f; k.b.textContent = t;
            k.a.style.transform = `translateY(${e * 1.1}em)`; k.a.style.opacity = 1 - e;
            k.b.style.transform = `translateY(${-(1 - e) * 1.1}em)`; k.b.style.opacity = e;
          }
        });
      },
    };
  }

  const PERSON = (c) => `<svg width="30" height="34" viewBox="0 0 30 34"><circle cx="15" cy="9" r="7.5" fill="${c}"/><path d="M2 33 Q2 18 15 18 Q28 18 28 33Z" fill="${c}"/></svg>`;
  const ARROW_DN = (c = '#EF4444', s = 56) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 3v15M5 12l7 7 7-7" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;

  // build(parent, {left, top, w}) -> dashboard object ; the whole panel stays inside x 240..840
  function build(parent, { left = 240, top = 368, w = 600 } = {}) {
    const el = h(`<div class="dash crit c" style="position:absolute;left:${left}px;top:${top}px;width:${w}px;height:236px;border-radius:38px;
        background:linear-gradient(180deg,#1A3668 0%,#142B53 100%);box-shadow:0 22px 44px rgba(20,43,83,.35),0 0 0 5px #22D3EE,0 0 32px rgba(34,211,238,.55),inset 0 2px 0 rgba(255,255,255,.12);overflow:hidden">
      <div class="scan" style="position:absolute;top:0;bottom:0;width:140px;background:linear-gradient(90deg,rgba(34,211,238,0),rgba(34,211,238,.35),rgba(34,211,238,0));opacity:0"></div>
      <div style="position:absolute;inset:0;background-image:linear-gradient(rgba(149,191,239,.07) 2px,transparent 2px);background-size:100% 10px"></div>
      <div class="mC" style="position:absolute;left:24px;top:18px;width:250px;height:150px;border-radius:26px">
        <div style="font-size:30px;font-weight:700;color:#95BFEF;text-align:center;line-height:1.4">นักเรียน</div>
        <div style="display:flex;justify-content:center;align-items:baseline;gap:8px;margin-top:-6px"><span class="vC" style="font-size:88px;font-weight:800;color:#fff;line-height:1.12"></span><span style="font-size:34px;font-weight:700;color:#E6F4FF">คน</span></div>
      </div>
      <div style="position:absolute;left:290px;top:30px;width:4px;height:130px;border-radius:2px;background:rgba(149,191,239,.35)"></div>
      <div class="mA" style="position:absolute;left:306px;top:18px;width:${w - 330}px;height:150px;border-radius:26px">
        <div style="font-size:30px;font-weight:700;color:#95BFEF;text-align:center;line-height:1.4">คะแนนเฉลี่ย</div>
        <div style="display:flex;justify-content:center;align-items:center;gap:4px;margin-top:-6px"><span class="vA" style="font-size:88px;font-weight:800;color:#FFD23F;line-height:1.12"></span><span class="dn" style="display:inline-block;width:0;overflow:visible;transform-origin:left center">${ARROW_DN()}</span></div>
      </div>
      <div class="pips" style="position:absolute;left:0;right:0;top:176px;display:flex;justify-content:center;gap:9px"></div>
    </div>`);
    parent.appendChild(el);
    const q = s => el.querySelector(s);
    const pips = [...Array(12)].map((_, i) => { const p = h(`<div style="width:30px;height:34px">${PERSON(i === window.STUDENTS.LEAVER ? C.pink : '#95BFEF')}</div>`); q('.pips').appendChild(p); return p; });
    const sC = Slot(q('.vC'), 2), sA = Slot(q('.vA'), 2);
    const dn = q('.dn');
    // state: count [from,to,p], avg [from,to,p], hiC/hiA (0..1 glow), drop (0..1 arrow), scan (0..1 sweep progress, <0 off), pipOut (0..1)
    function draw(st) {
      const { count = [12, 12, 1], avg = [70, 70, 1], hiC = 0, hiA = 0, drop = 0, scan = -1, pipOut = 0, warn = 0 } = st;
      sC.set(count[0], count[1], count[2]); sA.set(avg[0], avg[1], avg[2]);
      q('.mC').style.boxShadow = hiC > 0 ? `0 0 0 ${4 * hiC}px rgba(34,211,238,${hiC}), inset 0 0 40px rgba(34,211,238,${.35 * hiC})` : '';
      q('.mA').style.boxShadow = hiA > 0 ? `0 0 0 ${4 * hiA}px rgba(255,210,63,${hiA}), inset 0 0 40px rgba(255,210,63,${.25 * hiA})` : '';
      q('.vA').style.color = warn > 0 ? `color-mix(in srgb, #FF8A8A ${Math.round(warn * 100)}%, #FFD23F)` : '#FFD23F';
      dn.style.opacity = drop; dn.style.transform = `translateY(${(1 - E.out(drop)) * -26}px) scale(${.6 + .4 * E.back(drop)})`;
      const sc = q('.scan');
      if (scan >= 0 && scan <= 1) { sc.style.opacity = Math.sin(scan * Math.PI); sc.style.left = (lerp(-160, w + 20, scan)) + 'px'; } else sc.style.opacity = 0;
      pips.forEach((p, i) => {
        if (i === window.STUDENTS.LEAVER) { p.style.opacity = 1 - pipOut; p.style.transform = `translate(${pipOut * 40}px,${-pipOut * 10}px) scale(${1 - .4 * pipOut})`; }
        else { p.style.opacity = 1; p.style.transform = ''; }
      });
    }
    draw({});
    return { el, draw };
  }
  window.DASH = { build, Slot, ARROW_DN, PERSON };
})();
