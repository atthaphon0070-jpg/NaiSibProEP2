// NaiSibPro animated Venn diagram (new in EP.33). Two sets inside a universe box, with people-dots
// (1 dot = MATH.DOT people) placed deterministically inside each region, region value tags,
// overlap highlight, outside highlight and a "counted twice" effect.
// usage: const v = VENN.build(containerEl, { w: 640, h: 560, nameA, nameB }); v.set({ ...state, t })
(function () {
  const { clamp, lerp, E, P, tf, h } = window.NSP;
  const G = { w: 640, h: 560, ux: 10, uy: 70, uw: 620, uh: 480, ax: 232, bx: 408, cy: 312, r: 172 };
  const COL = { a: '#2F6BFF', b: '#EE7FAA', ab: '#FFD23F', out: '#7A8BA3', navy: '#142B53' };

  function inA(x, y) { return (x - G.ax) ** 2 + (y - G.cy) ** 2 < (G.r - 20) ** 2; }
  function inB(x, y) { return (x - G.bx) ** 2 + (y - G.cy) ** 2 < (G.r - 20) ** 2; }
  function farA(x, y) { return (x - G.ax) ** 2 + (y - G.cy) ** 2 > (G.r + 22) ** 2; }
  function farB(x, y) { return (x - G.bx) ** 2 + (y - G.cy) ** 2 > (G.r + 22) ** 2; }
  // pick n well-spaced points from a candidate grid (deterministic farthest-point sampling)
  function spread(cands, n, seedPt) {
    const out = []; if (!cands.length) return out;
    let best = cands.reduce((b, c) => ((c[0] - seedPt[0]) ** 2 + (c[1] - seedPt[1]) ** 2 < (b[0] - seedPt[0]) ** 2 + (b[1] - seedPt[1]) ** 2 ? c : b));
    out.push(best);
    while (out.length < n) {
      let bd = -1; best = null;
      for (const c of cands) { let d = 1e9; for (const o of out) d = Math.min(d, (c[0] - o[0]) ** 2 + (c[1] - o[1]) ** 2); if (d > bd) { bd = d; best = c; } }
      out.push(best);
    }
    // reading order (top-left → bottom-right) so dots fill in naturally
    return out.sort((p, q) => (p[1] - q[1]) * 3 + (p[0] - q[0]) * .5);
  }
  function regionPoints(n) {
    const grid = []; for (let y = G.uy + 26; y < G.uy + G.uh - 22; y += 6) for (let x = G.ux + 26; x < G.ux + G.uw - 22; x += 6) grid.push([x, y]);
    const keepOff = ([x, y]) => !(Math.abs(y - (G.cy + 8)) < 52 && true);   // leave a band free for the region value tags
    return {
      a: spread(grid.filter(([x, y]) => inA(x, y) && !inB(x - 36, y) && farB(x, y) && keepOff([x, y])), n.computerOnly, [G.ax - 90, G.cy - 100]),
      ab: spread(grid.filter(([x, y]) => inA(x, y) && inB(x, y) && keepOff([x, y])), n.both, [(G.ax + G.bx) / 2, G.cy - 120]),
      b: spread(grid.filter(([x, y]) => inB(x, y) && farA(x, y) && keepOff([x, y])), n.lawOnly, [G.bx + 90, G.cy - 100]),
      out: [[G.ux + 34, G.uy + 34], [G.ux + G.uw - 34, G.uy + 34], [G.ux + 34, G.uy + G.uh - 34], [G.ux + G.uw - 34, G.uy + G.uh - 34], [G.ux + G.uw / 2, G.uy + G.uh - 30]].slice(0, n.neither),
    };
  }
  const PERSON = (c) => `<svg width="34" height="34" viewBox="0 0 24 24"><circle cx="12" cy="7.2" r="4.4" fill="${c}"/><path d="M3.5 22c0-5 3.8-8.6 8.5-8.6s8.5 3.6 8.5 8.6z" fill="${c}"/></svg>`;

  let nInst = 0;
  function build(el, opts = {}) {
    const id = 'vn' + (nInst++);
    const nameA = opts.nameA || 'คอมพิวเตอร์', nameB = opts.nameB || 'กฎหมาย';
    el.style.width = G.w + 'px'; el.style.height = G.h + 'px';
    const Ca = 2 * Math.PI * G.r;
    el.innerHTML = `
      <svg class="vn-svg" width="${G.w}" height="${G.h}" viewBox="0 0 ${G.w} ${G.h}" style="position:absolute;left:0;top:0;overflow:visible">
        <defs>
          <clipPath id="${id}vnClipA"><circle cx="${G.ax}" cy="${G.cy}" r="${G.r}"/></clipPath>
          <mask id="${id}vnOutMask"><rect x="0" y="0" width="${G.w}" height="${G.h}" fill="#fff"/><circle cx="${G.ax}" cy="${G.cy}" r="${G.r}" fill="#000"/><circle cx="${G.bx}" cy="${G.cy}" r="${G.r}" fill="#000"/></mask>
          <linearGradient id="${id}vnU" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#F4F7FF"/></linearGradient>
        </defs>
        <g class="vn-u">
          <rect x="${G.ux}" y="${G.uy}" width="${G.uw}" height="${G.uh}" rx="40" fill="url(#${id}vnU)" stroke="#95BFEF" stroke-width="6"/>
          <rect class="vn-outhi" x="${G.ux}" y="${G.uy}" width="${G.uw}" height="${G.uh}" rx="40" fill="#FFE1A8" mask="url(#${id}vnOutMask)" opacity="0"/>
          <rect class="vn-outline" x="${G.ux}" y="${G.uy}" width="${G.uw}" height="${G.uh}" rx="40" fill="none" stroke="#FFB020" stroke-width="8" stroke-dasharray="18 12" opacity="0"/>
        </g>
        <circle class="vn-fa" cx="${G.ax}" cy="${G.cy}" r="${G.r}" fill="${COL.a}" opacity="0"/>
        <circle class="vn-fb" cx="${G.bx}" cy="${G.cy}" r="${G.r}" fill="${COL.b}" opacity="0"/>
        <circle class="vn-fab" cx="${G.bx}" cy="${G.cy}" r="${G.r}" fill="${COL.ab}" clip-path="url(#${id}vnClipA)" opacity="0"/>
        <circle class="vn-sa" cx="${G.ax}" cy="${G.cy}" r="${G.r}" fill="none" stroke="${COL.a}" stroke-width="8" stroke-dasharray="${Ca}" stroke-dashoffset="${Ca}" transform="rotate(-90 ${G.ax} ${G.cy})"/>
        <circle class="vn-sb" cx="${G.bx}" cy="${G.cy}" r="${G.r}" fill="none" stroke="${COL.b}" stroke-width="8" stroke-dasharray="${Ca}" stroke-dashoffset="${Ca}" transform="rotate(-90 ${G.bx} ${G.cy})"/>
        <path class="vn-lens" d="${lensPath()}" fill="none" stroke="#F2A900" stroke-width="7" stroke-linejoin="round" opacity="0"/>
      </svg>
      <div class="vn-dots"></div>
      <div class="vn-tagU abs c" style="left:0;width:${G.w}px;top:0;display:flex;justify-content:center"><div class="pill" style="font-size:34px;padding:8px 26px;background:${COL.navy};color:#fff;box-shadow:0 8px 18px rgba(20,43,83,.3)"><span class="vn-tagUtx">ผู้สมัครทั้งหมด 360 คน</span></div></div>
      <div class="vn-nA abs c" style="left:${G.ax - 70 - 150}px;width:300px;top:${G.uy + 12}px;display:flex;justify-content:center"><div class="pill" style="font-size:31px;padding:6px 20px;background:#fff;color:${COL.a};box-shadow:0 0 0 4px ${COL.a},0 8px 16px rgba(47,107,255,.25)">${nameA}<span class="vn-nAc"></span></div></div>
      <div class="vn-nB abs c" style="left:${G.bx + 70 - 150}px;width:300px;top:${G.uy + 12}px;display:flex;justify-content:center"><div class="pill" style="font-size:31px;padding:6px 20px;background:#fff;color:#D9578C;box-shadow:0 0 0 4px ${COL.b},0 8px 16px rgba(238,127,170,.3)">${nameB}<span class="vn-nBc"></span></div></div>
      ${['a', 'ab', 'b'].map(k => `<div class="vn-v vn-v${k} abs c" style="left:${k === 'a' ? G.ax - 82 - 70 : k === 'b' ? G.bx + 82 - 70 : (G.ax + G.bx) / 2 - 70}px;width:140px;top:${G.cy - 40}px;display:flex;justify-content:center"><div class="vn-vin" style="min-width:${k === 'ab' ? 118 : 104}px;height:80px;border-radius:24px;display:grid;place-items:center;font-weight:800;font-size:${k === 'ab' ? 52 : 46}px;line-height:1;padding:0 10px;color:#fff;background:${k === 'a' ? 'linear-gradient(180deg,#5B8BFF,#2F6BFF)' : k === 'b' ? 'linear-gradient(180deg,#F59BC0,#E06A9A)' : 'linear-gradient(180deg,#FFE27A,#F2B705)'};${k === 'ab' ? 'color:#142B53;' : ''}box-shadow:0 0 0 5px #fff,0 10px 20px rgba(20,43,83,.25)"><span class="vn-vt"></span></div></div>`).join('')}
      <div class="vn-vout abs c" style="left:${G.ux + G.uw / 2 - 150}px;width:300px;top:${G.uy + G.uh - 62}px;display:flex;justify-content:center"><div class="pill" style="font-size:32px;padding:6px 20px;background:#fff;color:#8A5A00;box-shadow:0 0 0 4px #FFB020,0 8px 16px rgba(200,140,0,.25)">นอกวง&nbsp;<b class="vn-vot" style="font-size:38px">50</b>&nbsp;คน</div></div>
      <div class="vn-x2 abs c" style="left:${(G.ax + G.bx) / 2 - 90}px;width:180px;top:${G.cy - 178}px;display:flex;justify-content:center"><div class="pill" style="font-size:32px;font-weight:800;padding:6px 20px;color:#fff;background:linear-gradient(90deg,#EF4444,#F87171);box-shadow:0 8px 18px rgba(239,68,68,.4)">นับซ้ำ ×2</div></div>`;
    const q = s => el.querySelector(s);
    const pts = regionPoints(window.MATH.dots);
    const dots = {};
    for (const k of ['a', 'ab', 'b', 'out']) dots[k] = pts[k].map(([x, y], i) => {
      const c = k === 'a' ? COL.a : k === 'b' ? '#E06A9A' : k === 'ab' ? '#8B5CF6' : COL.out;
      const d = h(`<div class="abs" style="left:${x - 17}px;top:${y - 17}px;width:34px;height:34px">${PERSON(c)}</div>`);
      q('.vn-dots').appendChild(d);
      return { el: d, i, x, y };
    });
    function lensPath() {
      const dx = (G.bx - G.ax) / 2, hy = Math.sqrt(G.r * G.r - dx * dx), mx = (G.ax + G.bx) / 2;
      return `M ${mx} ${G.cy - hy} A ${G.r} ${G.r} 0 0 1 ${mx} ${G.cy + hy} A ${G.r} ${G.r} 0 0 1 ${mx} ${G.cy - hy} Z`;
    }
    // state keys (all 0..1 unless noted): u (universe box), ca/cb (circle draw), na/nb (name tags), tagU, tagUtx (string),
    // cntA/cntB (string appended to name tags), dots {a,ab,b,out}, dotDim, hiOut, hiAB, hiUnion, dbl, vals {a,ab,b,out}, valTx {a,ab,b}, t
    function set(s) {
      const t = s.t || 0;
      const u = s.u ?? 1;
      q('.vn-u').style.opacity = u; q('.vn-u').style.transform = `scale(${lerp(.92, 1, E.back(u))})`; q('.vn-u').style.transformOrigin = '320px 310px';
      const ca = s.ca ?? 1, cb = s.cb ?? 1;
      q('.vn-sa').setAttribute('stroke-dashoffset', Ca * (1 - E.inOut(ca)));
      q('.vn-sb').setAttribute('stroke-dashoffset', Ca * (1 - E.inOut(cb)));
      const un = s.hiUnion || 0, dim = s.dotDim || 0;
      q('.vn-fa').setAttribute('opacity', (.13 + .1 * un) * clamp(ca * 1.5 - .5));
      q('.vn-fb').setAttribute('opacity', (.15 + .1 * un) * clamp(cb * 1.5 - .5));
      const hab = s.hiAB || 0;
      q('.vn-fab').setAttribute('opacity', .75 * hab * (.85 + .15 * Math.sin(t * 5)));
      q('.vn-lens').setAttribute('opacity', hab);
      const ho = s.hiOut || 0;
      q('.vn-outhi').setAttribute('opacity', .55 * ho * (.8 + .2 * Math.sin(t * 4)));
      q('.vn-outline').setAttribute('opacity', ho); q('.vn-outline').setAttribute('stroke-dashoffset', -t * 40);
      tf(q('.vn-nA'), { s: lerp(.4, 1, E.back(s.na ?? 1)), o: clamp((s.na ?? 1) * 2) });
      tf(q('.vn-nB'), { s: lerp(.4, 1, E.back(s.nb ?? 1)), o: clamp((s.nb ?? 1) * 2) });
      q('.vn-nAc').textContent = s.cntA || ''; q('.vn-nBc').textContent = s.cntB || '';
      tf(q('.vn-tagU'), { s: lerp(.4, 1, E.back(s.tagU ?? 0)), o: clamp((s.tagU ?? 0) * 2) });
      if (s.tagUtx) q('.vn-tagUtx').textContent = s.tagUtx;
      const D = s.dots || {};
      for (const k of ['a', 'ab', 'b', 'out']) {
        const p = D[k] ?? 0, n = dots[k].length;
        dots[k].forEach(d => {
          const lp = clamp(p * n * 1.0 - d.i);                 // each dot pops in turn
          let sc = lerp(0, 1, E.back(lp)), o = clamp(lp * 3) * (1 - .6 * dim);
          if (k === 'ab' && s.dbl) sc *= 1 + .22 * s.dbl * Math.max(0, Math.sin(t * 6 - d.i * .5));
          if (k === 'out' && ho) sc *= 1 + .15 * ho * Math.sin(t * 5 + d.i);
          tf(d.el, { s: sc, o });
          d.el.style.filter = k === 'ab' && s.dbl ? `drop-shadow(0 0 ${8 * s.dbl}px ${Math.sin(t * 6 - d.i * .5) > 0 ? COL.a : COL.b})` : '';
        });
      }
      const V = s.vals || {}, VT = s.valTx || {};
      for (const k of ['a', 'ab', 'b']) {
        const p = V[k] ?? 0;
        tf(q('.vn-v' + k), { s: lerp(.3, 1, E.elastic(p)), o: clamp(p * 3) });
        q('.vn-v' + k + ' .vn-vt').textContent = VT[k] ?? '';
      }
      const po = V.out ?? 0;
      tf(q('.vn-vout'), { s: lerp(.3, 1, E.back(po)), o: clamp(po * 3) });
      const x2 = s.dbl || 0;
      tf(q('.vn-x2'), { s: lerp(.3, 1, E.elastic(x2)) * (1 + .04 * Math.sin(t * 6)), o: clamp(x2 * 3), r: -4 + Math.sin(t * 3) * 2 });
    }
    set({ u: 0, ca: 0, cb: 0, na: 0, nb: 0 });
    return { el, set, G, dots };
  }
  window.VENN = { build, G };
})();
