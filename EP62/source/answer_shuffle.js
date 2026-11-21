// DocumentCategoryShuffle — teaching effect: one term inside a three-term answer is swapped and the
// mismatched category shows up in its category colour. Used only after the official answer reveal.
(function () {
  const { h, clamp, lerp, E, P, tf, ICON } = NSP;
  const CAT = () => window.CLS.CAT;

  // x,y = top-left of the row (stage px), w = row width
  function build(parent, { x, y, w = 600, fs = 33, tokH = 74, words = ['คำสั่ง', 'ระเบียบ', 'ข้อบังคับ', 'ประกาศ', 'แถลงการณ์', 'ข่าว'] }) {
    const sepW = 30, tw = (w - 2 * sepW) / 3;
    const box = h(`<div class="abs" style="left:${x}px;top:${y}px;width:${w}px;height:${tokH}px"></div>`);
    parent.appendChild(box);
    const seps = [0, 1].map(i => { const s = h(`<div class="sep" style="left:${tw * (i + 1) + sepW * i}px;width:${sepW}px;top:0;height:${tokH}px;display:grid;place-items:center;font-size:${fs}px">–</div>`); box.appendChild(s); return s; });
    const toks = {};
    words.forEach(wd => { const el = h(`<div class="tok c" style="left:0;top:0;width:${tw}px;font-size:${fs}px">${wd}</div>`); box.appendChild(el); toks[wd] = el; });
    const mark = h(`<div class="abs c" style="left:${w - 30}px;top:${-34}px;width:68px;height:68px;border-radius:50%;display:grid;place-items:center;box-shadow:0 8px 16px rgba(0,0,0,.15)"></div>`);
    box.appendChild(mark);
    const slotX = i => i * (tw + sepW);
    const colour = (el, wd, k) => {   // k: 0 neutral white → 1 category colour
      const pink = CAT()[wd] === 'pink';
      el.style.background = k > .5 ? (pink ? 'linear-gradient(180deg,#FFD6E6,#FF91BA)' : 'linear-gradient(180deg,#DCE9FF,#95BFEF)') : '#fff';
      el.style.color = k > .5 ? (pink ? '#9E2F5C' : '#163E9C') : '#31445D';
      el.style.boxShadow = k > .5 ? `0 8px 16px rgba(80,90,150,.18),0 0 0 4px #fff,0 0 0 ${pink ? 9 : 4}px ${pink ? '#EE7FAA' : '#fff'}` : '';
    };
    // steps: [{at, list:[3 words], mark:'ok'|'bad'|null, tint}] ; a = box entrance, b = exit
    function draw(t, steps, a, b = 1e9) {
      const lb = clamp((t - a) * 3) * (1 - P(t, b, .3));
      box.style.opacity = lb; box.style.visibility = lb <= 0 ? 'hidden' : 'visible';
      seps.forEach(s => s.style.opacity = 1);
      let cur = 0; steps.forEach((s, i) => { if (t >= s.at) cur = i; });
      const S = steps[cur], prev = steps[Math.max(0, cur - 1)], k = cur === 0 ? 1 : E.inOut(P(t, S.at, .7));
      Object.entries(toks).forEach(([wd, el]) => {
        const i1 = S.list.indexOf(wd), i0 = prev.list.indexOf(wd);
        let x = 0, y = 0, o = 0, r = 0, s = 1;
        if (i1 >= 0 && i0 >= 0) { x = lerp(slotX(i0), slotX(i1), k); y = -Math.sin(k * Math.PI) * 30 * (i0 !== i1 ? 1 : 0); o = 1; }
        else if (i1 >= 0) { x = slotX(i1); y = lerp(-46, 0, E.back(k)); o = clamp(k * 3); r = (1 - k) * -12; }       // new term drops in
        else if (i0 >= 0 && cur > 0) { x = slotX(i0); y = lerp(0, 60, E.in(k)); o = 1 - clamp(k * 2.2); r = k * 14; s = 1 - .2 * k; } // old term leaves
        tf(el, { x, y, o, r, s });
        const swapped = i1 >= 0 && i0 < 0 && cur > 0;
        colour(el, wd, swapped ? (t >= S.at + .55 ? 1 : 0) : (S.tint === 'all' ? 1 : 0));
      });
      const mk = S.mark, mt = P(t, S.at + .9, .6);
      if (mk) {
        mark.innerHTML = mk === 'ok' ? ICON.check('#fff', 44) : ICON.cross('#fff', 44);
        mark.style.background = mk === 'ok' ? '#22C55E' : '#EF4444';
        tf(mark, { s: E.elastic(mt), o: clamp(mt * 4), r: (1 - mt) * -40 });
      } else tf(mark, { o: 0 });
    }
    return { box, draw };
  }
  window.SHUFFLE = { build };
})();
