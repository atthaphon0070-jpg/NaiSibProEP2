// EP32 safe-zone QC: samples the page every STEP seconds (plus every scene boundary ±0.3 s),
// collects the rendered bounding boxes of visible essential text (.ess, opacity ≥ 0.5) and
// reports any box outside the conservative zone X 220–860, Y 350–1430 (tolerance TOL px).
// usage: node EP32/qc/qc_safezone.js   → EP32/qc/safe_zone_report.json
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(__dirname, '..'), STEP = .25, TOL = 6, Z = { x0: 220, x1: 860, y0: 350, y1: 1430 };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(EP, 'source/index.html')); await page.evaluate(() => window.ready);
  const TL = await page.evaluate(() => window.TL);
  const ts = []; for (let t = 0; t < TL.end; t += STEP) ts.push(+t.toFixed(3));
  ['story', 'know', 'expl', 'quiz', 'cd', 'ans', 'promo'].forEach(k => [-.3, -.1, .1, .3].forEach(d => ts.push(+(TL[k][0] + d).toFixed(3))));
  ts.sort((a, b) => a - b);
  const viol = {}; let boxes = 0;
  for (const t of ts) {
    const bx = await page.evaluate(t => { renderAt(t); return QC_BOXES(); }, t);
    boxes += bx.length;
    for (const b of bx) {
      const over = Math.max(Z.x0 - b.x0, b.x1 - Z.x1, Z.y0 - b.y0, b.y1 - Z.y1);
      if (over > TOL) { const k = b.text; (viol[k] ||= { text: k, frames: 0, worst_px: 0, first_t: t, last_t: t, box: b }); const v = viol[k]; v.frames++; v.last_t = t; if (over > v.worst_px) { v.worst_px = over; v.box = b; } }
    }
  }
  const list = Object.values(viol).sort((a, b) => b.worst_px - a.worst_px);
  const rep = { zone: Z, tolerance_px: TOL, step_s: STEP, samples: ts.length, boxes_checked: boxes, violations: list.length, details: list };
  fs.writeFileSync(path.join(EP, 'qc/safe_zone_report.json'), JSON.stringify(rep, null, 1));
  console.log(`samples ${ts.length}, boxes ${boxes}, violations ${list.length}`);
  list.slice(0, 40).forEach(v => console.log(`${v.worst_px}px  ${v.first_t}-${v.last_t}s  ${v.text}  [${v.box.x0},${v.box.y0},${v.box.x1},${v.box.y1}]`));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
