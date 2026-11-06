// EP38 safe-zone QC: samples the timeline and checks every visible essential (.ess) element.
// usage: node EP38/tools/safe_zone_check.js EP38 [step=0.25]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const [, , ep, stepArg] = process.argv;
const SAFE = { x0: 220, x1: 860, y0: 350, y1: 1430 }, TOL = 6;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.resolve(ep, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const end = await page.evaluate(() => window.TL.end), step = +(stepArg || .25);
  const issues = {}; let samples = 0, checks = 0;
  for (let t = 0; t < end; t += step) {
    samples++;
    const res = await page.evaluate(({ t, SAFE, TOL }) => {
      renderAt(t);
      const out = [];
      const opa = el => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
      document.querySelectorAll('.ess').forEach(el => {
        const o = opa(el); if (o < .95) return;
        const r = el.getBoundingClientRect();
        const name = (el.closest('.scene')?.id || '') + ' | ' + el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40);
        const over = Math.max(SAFE.x0 - r.left, r.right - SAFE.x1, SAFE.y0 - r.top, r.bottom - SAFE.y1);
        // text clipping: any child line wider than its box
        let clip = 0; el.querySelectorAll('*').forEach(c => { if (c.scrollWidth > c.clientWidth + 2 && getComputedStyle(c).overflow === 'hidden') clip = 1; });
        out.push({ name, over: Math.round(over), clip, r: [Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)] });
      });
      return out;
    }, { t, SAFE, TOL });
    res.forEach(e => {
      checks++;
      if (e.over > TOL || e.clip) {
        const k = e.name; const it = issues[k] || (issues[k] = { element: k, first: +t.toFixed(2), last: 0, frames: 0, maxOver: 0, rect: e.r, clip: 0, run: 0, runMax: 0, prev: -1 });
        it.run = (it.prev >= 0 && Math.abs(t - it.prev - step) < 1e-6) ? it.run + 1 : 1; it.runMax = Math.max(it.runMax, it.run); it.prev = t; it.last = +t.toFixed(2); it.frames++; if (e.over > it.maxOver) { it.maxOver = e.over; it.rect = e.r; } it.clip |= e.clip;
      }
    });
  }
  // critical = a readable element sits outside the zone in steady state (continuously for more than 0.5 s)
  // or by more than 40 px; shorter overshoots are entrance/exit motion (back-ease pop, slide-in) and are listed as transient.
  const list0 = Object.values(issues).forEach(i => { delete i.run; delete i.prev; });
  const list = Object.values(issues).map(i => ({ ...i, critical: i.runMax * step > .5 || i.maxOver > 40, kind: (i.runMax * step > .5 || i.maxOver > 40) ? 'steady' : 'transient' }));
  const report = { canvas: [1080, 1920], safe_zone: SAFE, tolerance_px: TOL, step_s: step, samples, element_checks: checks,
    violations: list, critical_unresolved: list.filter(i => i.critical).length };
  fs.writeFileSync(path.join(ep, 'qc', 'safe_zone_report.json'), JSON.stringify(report, null, 1));
  console.log(JSON.stringify({ samples, checks, violations: list.length, critical: report.critical_unresolved }));
  list.forEach(i => console.log(i.critical ? 'CRIT' : 'minor', i.first, '-', i.last, i.frames, i.maxOver, i.rect.join(','), i.element));
  await browser.close();
})();
