// OfficialDocumentClassifier — reusable two-folder classification system for EP62.
// BLUE folder = หนังสือสั่งการ (คำสั่ง ระเบียบ ข้อบังคับ)   PINK folder = หนังสือประชาสัมพันธ์ (ประกาศ แถลงการณ์ ข่าว)
// Categories follow ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 ข้อ 15 / ข้อ 19. Colours are never swapped.
(function () {
  const { h, clamp, lerp, E, P, tf, life, bob } = NSP;

  const CAT = {
    'คำสั่ง': 'blue', 'ระเบียบ': 'blue', 'ข้อบังคับ': 'blue',
    'ประกาศ': 'pink', 'แถลงการณ์': 'pink', 'ข่าว': 'pink',
  };
  const DIRECTIVE = ['คำสั่ง', 'ระเบียบ', 'ข้อบังคับ'];
  const PUBLIC = ['ประกาศ', 'แถลงการณ์', 'ข่าว'];

  // official-looking (fictional, generic) document card: title, small seal, text lines, optional subtitle
  function docCard(title, { sub = '', tone = 'neutral', w = 280, hgt = 250, fs = 46, subFs = 26 } = {}) {
    const lines = [0, 1, 2].map(i => `<div class="ln" style="top:${82 + fs * 1.25 + 14 + i * 22}px;${i === 2 ? 'right:34%' : ''}"></div>`).join('');
    const el = h(`<div class="dcard ${tone}" style="width:${w}px;height:${hgt}px">
      <div class="band"></div><div class="seal"><i></i></div>
      <div class="tt" style="font-size:${fs}px;color:${tone === 'pink' ? '#C9467A' : tone === 'blue' ? '#1F4FC2' : '#31445D'}">${title}</div>
      ${lines}${sub ? `<div class="sb" style="bottom:16px;font-size:${subFs}px">${sub}</div>` : ''}</div>`);
    return el;
  }

  // folder + items
  function folder(parent, { x, y, w = 310, hgt = 560, tone = 'blue', head1 = 'หนังสือ', head2 = 'สั่งการ', headFs = 44, items = [], itemH = 82, itemFs = 38, gap = 16, top = 214, numbered = true, check = false }) {
    const el = h(`<div class="fold ${tone}" style="left:${x}px;top:${y}px;width:${w}px;height:${hgt}px">
      <div class="glow"></div><div class="tab"></div><div class="back"></div><div class="paper"></div><div class="front"></div>
      <div class="head" style="font-size:${headFs}px"><small>${head1}</small>${head2}</div></div>`);
    parent.appendChild(el);
    const glow = el.querySelector('.glow');
    const iw = w - 36, ix = x + 18;
    const its = items.map((word, i) => {
      const iy = y + top + i * (itemH + gap);
      const ph = h(`<div class="slotph" style="left:18px;top:${top + i * (itemH + gap)}px;width:${iw}px;height:${itemH}px"></div>`);
      el.appendChild(ph);
      const it = h(`<div class="item ${tone} c" style="left:${ix}px;top:${iy}px;width:${iw}px;height:${itemH}px;font-size:${itemFs}px">
        ${numbered ? `<div class="n" style="width:${itemH - 26}px;height:${itemH - 26}px;font-size:${itemFs * .78}px">${i + 1}</div>` : ''}<span>${word}</span>${check ? `<div class="ck">${NSP.ICON.check('#fff', 30)}</div>` : ''}</div>`);
      parent.appendChild(it);
      return { el: it, ph, word, cx: ix + iw / 2, cy: iy + itemH / 2, ck: it.querySelector('.ck') };
    });
    const F = {
      el, items: its, x, y, w, hgt, tone,
      // entrance a, exit b; glow pulses at [times]; shake for "not here" moments
      draw(t, a, b = 1e9, { glowAt = [], glowOn = 0, dy = 80, from = .5, nudge = 0 } = {}) {
        const l = life(t, a, b, { from, dy, d: .6, out: .3 });
        tf(el, { ...l, x: nudge });
        let g = glowOn;
        glowAt.forEach(at => { const u = t - at; if (u > 0 && u < 1.4) g = Math.max(g, Math.sin(clamp(u / 1.4) * Math.PI)); });
        glow.style.opacity = g;
        F._vis = l.o; F._b = b;
      },
      // item i: pops in at `from` (stage centre coords) at `at`, flies into its slot at `land`
      // opts.out hides it; hi = highlight 0..1; ck = time a check mark appears
      drawItem(i, t, { at, land, from = null, out = F._b ?? 1e9, hi = 0, ck = null, fromS = 1.7, dim = 0 }) {
        const it = its[i];
        if (t < at || t >= out + .3) { it.el.style.visibility = 'hidden'; it.el.style.opacity = 0; return; }
        const fo = 1 - P(t, out, .3);
        const src = from || { x: it.cx, y: it.cy - 60 };
        let x, y, s, r = 0;
        if (t < land) {
          const pi = E.back(P(t, at, .5));
          x = src.x - it.cx; y = src.y - it.cy + bob(t, i, 6, 2.2); s = lerp(.3, fromS, pi);
          r = Math.sin(t * 2 + i) * 2;
        } else {
          const k = E.inOut(P(t, land, .6));
          x = lerp(src.x - it.cx, 0, k); y = lerp(src.y - it.cy, 0, k) - Math.sin(k * Math.PI) * 90;
          s = lerp(fromS, 1, k);
          const sq = P(t, land + .6, .35); s *= 1 + .1 * Math.sin(sq * Math.PI);
          r = (1 - k) * (i % 2 ? 8 : -8);
        }
        tf(it.el, { x, y, s: s * (1 + .06 * hi), r, o: clamp((t - at) * 5) * fo * (1 - dim * .55) });
        it.el.style.boxShadow = hi > 0 ? `0 10px 20px rgba(40,50,110,.2),0 0 0 ${6 * hi}px #FFD23F,0 0 ${30 * hi}px ${8 * hi}px rgba(255,210,63,.5)` : '';
        if (it.ck) tf(it.ck, { s: ck == null ? 0 : E.elastic(P(t, ck, .7)), o: ck == null ? 0 : clamp((t - ck) * 6) });
      },
    };
    return F;
  }

  // bouncing word chip (stand-alone term)
  function chip(word, { fs = 40, tone = null, num = '' } = {}) {
    const c = tone || CAT[word] || 'neutral';
    return h(`<div class="item ${c} c" style="height:${fs * 2}px;font-size:${fs}px;padding:0 22px">${num ? `<div class="n" style="width:${fs * 1.4}px;height:${fs * 1.4}px;font-size:${fs * .8}px">${num}</div>` : ''}<span>${word}</span></div>`);
  }

  window.CLS = { CAT, DIRECTIVE, PUBLIC, docCard, folder, chip };
})();
