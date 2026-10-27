// EP19 layout QC: steps through the real page and checks every visible key-text element (.kt).
//  - its glyph box (Range bounds, transforms included) lies inside the mobile safe zone X 190–870, Y 300–1430
//  - no two visible key texts overlap
//  - Thai font actually loaded (Prompt) and min on-screen font size >= 42 px for fully visible key text
// usage: node EP19/tools/qc_layout.js EP19 [stepFrames=3]   -> writes EP19/qc/layout_report.json, exits 1 on failure
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const [, , ep, stepArg] = process.argv, STEP = +(stepArg || 3);
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  page.on('pageerror', e => { console.error('PAGEERR', e.message); process.exitCode = 2; });
  await page.goto('file://' + path.resolve(ep, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const res = await page.evaluate(async (STEP) => {
    const SZ = { x0: 190, x1: 870, y0: 300, y1: 1430 }, TOL = 2;
    const fps = TL.fps, N = Math.ceil(TL.end * fps);
    const kts = [...document.querySelectorAll('.kt')];
    const effOp = el => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
    // ink box: horizontal extent from the text Range; vertical extent from canvas glyph metrics (actual ink of these
    // exact strings, Thai marks included) mapped onto the first / last line fragment, so line-box padding is ignored
    const ctx = document.createElement('canvas').getContext('2d');
    const box = el => {
      const r = document.createRange(); r.selectNodeContents(el);
      const tw = document.createTreeWalker(el, NodeFilter.SHOW_TEXT), rs = [];
      for (let n; (n = tw.nextNode());) { if (!n.nodeValue.trim() || n.parentElement.closest('svg')) continue; const rr = document.createRange(); rr.selectNodeContents(n); rs.push(...[...rr.getClientRects()].filter(q => q.width > 0 && q.height > 0)); }
      if (!rs.length) return { w: 0, h: 0 };
      const cs = getComputedStyle(el); ctx.font = `${cs.fontWeight} ${cs.fontSize} Prompt`;
      let ia = 0, id = 0, fa = 0, fd = 0;
      for (const line of el.innerText.split('\n').filter(Boolean)) { const m = ctx.measureText(line); ia = Math.max(ia, m.actualBoundingBoxAscent); id = Math.max(id, m.actualBoundingBoxDescent); fa = m.fontBoundingBoxAscent; fd = m.fontBoundingBoxDescent; }
      const sc = rs[0].height / (fa + fd), u = r.getBoundingClientRect();
      const y0 = Math.min(...rs.map(q => q.top)) + (fa - ia) * sc, y1 = Math.max(...rs.map(q => q.bottom)) - (fd - id) * sc;
      return { x0: u.left, x1: u.right, y0, y1, w: u.width, h: y1 - y0, fs: parseFloat(cs.fontSize) * sc };
    };
    const txt = el => el.textContent.trim().replace(/\s+/g, ' ');
    const issues = {}, add = (k, f, extra) => { (issues[k] = issues[k] || { frames: [], ...extra }).frames.push(f); };
    let minFont = 1e9, minFontTxt = ''; const sizes = new Map();
    for (let f = 0; f < N; f += STEP) {
      renderAt(f / fps);
      const vis = [];
      for (const el of kts) {
        const o = effOp(el); if (o < .6) continue;
        const b = box(el); if (b.w < 2 || b.h < 2) continue;
        vis.push({ el, b, t: txt(el) });
        if (o > .95) { const k = Math.round(b.fs), hst = (sizes.get(el) || sizes.set(el, {}).get(el)); hst[k] = (hst[k] || 0) + 1; }   // on-screen size, transforms included
        if (b.x0 < SZ.x0 - TOL || b.x1 > SZ.x1 + TOL || b.y0 < SZ.y0 - TOL || b.y1 > SZ.y1 + TOL) add('SAFE: ' + txt(el), f, { box: [b.x0, b.y0, b.x1, b.y1].map(Math.round) });
      }
      for (let i = 0; i < vis.length; i++) for (let j = i + 1; j < vis.length; j++) {
        const a = vis[i], c = vis[j];
        if (a.el.contains(c.el) || c.el.contains(a.el)) continue;
        const ix = Math.min(a.b.x1, c.b.x1) - Math.max(a.b.x0, c.b.x0), iy = Math.min(a.b.y1, c.b.y1) - Math.max(a.b.y0, c.b.y0);
        if (ix > 4 && iy > 4) add(`OVERLAP: "${a.t}" × "${c.t}"`, f);
      }
    }
    // settled size of each key text = its most frequent on-screen size (entrance / exit scaling ignored)
    sizes.forEach((hst, el) => { const mode = +Object.entries(hst).sort((a, b) => b[1] - a[1])[0][0]; if (mode < minFont) { minFont = mode; minFontTxt = txt(el); } });
    const fontOk = [...document.fonts].some(f => f.family.replace(/["']/g, '') === 'Prompt' && f.weight === '800' && f.status === 'loaded' && /E01/i.test(f.unicodeRange));
    const out = Object.entries(issues).map(([k, v]) => ({ issue: k, count: v.frames.length, first: v.frames[0], last: v.frames[v.frames.length - 1], box: v.box }));
    return { frames: N, step: STEP, keyTexts: kts.length, fontOk, minFont, minFontTxt, issues: out };
  }, STEP);
  fs.writeFileSync(path.join(ep, 'qc', 'layout_report.json'), JSON.stringify(res, null, 1));
  console.log(`frames ${res.frames} (every ${res.step}), key texts ${res.keyTexts}, Prompt loaded ${res.fontOk}, min settled key-text size ${res.minFont}px ("${res.minFontTxt}")`);
  res.issues.forEach(i => console.log(`${i.issue}  ×${i.count}  frames ${i.first}–${i.last}${i.box ? '  box ' + i.box : ''}`));
  if (res.issues.length || !res.fontOk || res.minFont < 42) process.exitCode = 1;
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
