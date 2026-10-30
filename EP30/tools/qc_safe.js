// EP30 iPhone safe-zone check. Every critical element (class "sz": keyword, headlines, the box front glass, every ball,
// ball-count chips, fractions, equations, the 30 % ring, quiz question, the four choices, countdown, answer, memory phrase, CTA) is measured with
// getBoundingClientRect on EVERY frame. An element counts as active once its effective opacity (product of its own and
// all ancestors' opacity) reaches 0.15, so entrances, exits and scale animations are checked, not only resting states.
// usage: node EP30/tools/qc_safe.js <startFrame> <endFrame> <out.json>     (EP30/tools/qc_safe.sh runs it in parallel)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const [, , a, b, out] = process.argv;
(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => { console.error('PAGEERR', e.message); process.exitCode = 2; });
  await p.goto('file://' + path.resolve(__dirname, '../source/index.html')); await p.evaluate(() => window.ready);
  const res = await p.evaluate(([f0, f1]) => {
    const Z = { l: 220, r: 860, t: 350, b: 1430 }, fps = TL.fps, MIN_O = .15;
    const all = [...document.querySelectorAll('.sz')];
    const label = el => el.dataset && el.dataset.id ? 'ball ' + el.dataset.id : (el.textContent || '').replace(/\s+/g, ' ').trim().slice(0, 48) || (el.className.baseVal ?? el.className);

    // ---- simulated phones + platform UI (conservative generic layouts, not exact app specs) ----
    const DEV = { small_iphone: [375, 812], modern_iphone: [390, 844], large_iphone: [430, 932], plain_9x16: [360, 640] };
    const PLAT = {   // screen-space rects as functions of (w,h): [x0,y0,x1,y1]
      tiktok: (w, h) => [[0, 0, w, .11 * h], [w - 66, .40 * h, w, .88 * h], [0, h - 170, w - 80, h - 50], [0, h - 50, w, h]],
      reels:  (w, h) => [[0, 0, w, .09 * h], [w - 60, .48 * h, w, .90 * h], [0, h - 175, w - 75, h - 50], [0, h - 50, w, h]],
      shorts: (w, h) => [[0, 0, w, .09 * h], [w - 64, .44 * h, w, .88 * h], [0, h - 160, w - 80, h - 48], [0, h - 48, w, h]],
    };
    const SIMS = [];
    for (const [dn, [w, h]] of Object.entries(DEV)) for (const mode of ['cover', 'fit']) {
      const k = mode === 'cover' ? Math.max(w / 1080, h / 1920) : Math.min(w / 1080, h / 1920), ox = (w - 1080 * k) / 2, oy = (h - 1920 * k) / 2;
      const toSrc = ([x0, y0, x1, y1]) => [(x0 - ox) / k, (y0 - oy) / k, (x1 - ox) / k, (y1 - oy) / k];
      const vis = toSrc([0, 0, w, h]);
      for (const [pn, fn] of Object.entries(PLAT)) SIMS.push({ name: `${dn}/${mode}/${pn}`, vis, ui: fn(w, h).map(toSrc) });
    }
    const simHits = {};
    const glyphRects = el => { const out = []; const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT); let n; while ((n = tw.nextNode())) { if (!n.nodeValue.trim()) continue; const rg = document.createRange(); rg.selectNodeContents(n); for (const q of rg.getClientRects()) if (q.width > 1) out.push(q); } return out; };
    const viol = {}, ext = { l: 1e9, r: -1e9, t: 1e9, b: -1e9 }; let checks = 0, minFont = { px: 1e9 }; const fonts = {};
    for (let f = f0; f < f1; f++) {
      const t = f / fps; renderAt(t);
      const cache = new Map();
      const eff = el => {                                   // effective opacity, 0 when hidden / not displayed
        if (!el || el === document.body) return 1;
        if (cache.has(el)) return cache.get(el);
        const cs = getComputedStyle(el);
        let v = (cs.display === 'none' || cs.visibility === 'hidden') ? 0 : +cs.opacity;
        if (v > 0) v *= eff(el.parentElement);
        cache.set(el, v); return v;
      };
      for (const el of all) {
        const sc = el.closest('.scene'); if (sc && sc.style.display === 'none') continue;
        const o = eff(el); if (o < MIN_O) continue;
        const r = el.getBoundingClientRect(); if (r.width < 1 || r.height < 1) continue;
        checks++;
        ext.l = Math.min(ext.l, r.left); ext.r = Math.max(ext.r, r.right); ext.t = Math.min(ext.t, r.top); ext.b = Math.max(ext.b, r.bottom);
        if (o > .9 && el.offsetWidth && [...el.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim())) { const px = parseFloat(getComputedStyle(el).fontSize) * r.width / el.offsetWidth; if (px < minFont.px && el.textContent.trim()) minFont = { px: +px.toFixed(1), t: +t.toFixed(3), el: label(el) }; const k = label(el); if (!(k in fonts) || px < fonts[k]) fonts[k] = +px.toFixed(1); }

        if (f % 2 === 0) for (const q of glyphRects(el)) for (const sm of SIMS) {
          const [vx0, vy0, vx1, vy1] = sm.vis;
          let hit = q.left < vx0 - .5 || q.right > vx1 + .5 || q.top < vy0 - .5 || q.bottom > vy1 + .5 ? 'cropped' : '';
          if (!hit) for (const [x0, y0, x1, y1] of sm.ui) if (q.right > x0 && q.left < x1 && q.bottom > y0 && q.top < y1) { hit = 'under UI'; break; }
          if (hit) { const k = sm.name + ' | ' + label(el) + ' | ' + hit; const v = simHits[k] || (simHits[k] = { sim: sm.name, el: label(el), kind: hit, frames: 0, at: +t.toFixed(3), rect: [q.left, q.top, q.right, q.bottom].map(x => +x.toFixed(0)) }); v.frames++; }
        }
        const over = { l: Z.l - r.left, r: r.right - Z.r, t: Z.t - r.top, b: r.bottom - Z.b };
        const worst = Math.max(over.l, over.r, over.t, over.b);
        if (worst > .5) {
          const k = label(el); const v = viol[k] || (viol[k] = { el: k, frames: 0, first: t, last: t, maxOver: 0, rect: null, opacity: 0 });
          v.frames++; v.last = t; if (worst > v.maxOver) { v.maxOver = +worst.toFixed(1); v.rect = [r.left, r.top, r.right, r.bottom].map(x => +x.toFixed(1)); v.opacity = +o.toFixed(2); v.at = +t.toFixed(3); }
        }
      }
    }
    return { frames: [f0, f1], checks, violations: Object.values(viol), extent: ext, minFont, fonts, simHits: Object.values(simHits), sims: SIMS.map(x => ({ name: x.name, visible_source_rect: x.vis.map(v => +v.toFixed(0)), ui_source_rects: x.ui.map(r => r.map(v => +v.toFixed(0))) })) };
  }, [+a, +b]);
  fs.writeFileSync(out, JSON.stringify(res));
  await br.close();
})().catch(e => { console.error(e); process.exit(1); });
