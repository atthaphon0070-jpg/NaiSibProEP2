// EP.41 safe-zone + early-reveal QC. Samples the real page every STEP seconds (animations included) and checks every
// visible element tagged data-safe (text, formulas, arrows, labels, options, countdown, stopwatch, logo) against the
// conservative phone safe zone. Also checks that the correct option is never highlighted before the countdown ends.
// usage: node EP41/tools/qc_safezone.js EP41 [step]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const ep = process.argv[2], STEP = +(process.argv[3] || .25);
const ZONE = { left: 220, right: 860, top: 350, bottom: 1430 };
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('PAGEERR', e.message); process.exitCode = 2; });
  await page.goto('file://' + path.resolve(ep, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const TL = await page.evaluate(() => window.TL);
  const cdEnd = TL.cd[0] + TL.cd[1];
  const viol = [], early = []; let samples = 0, checked = 0;
  for (let t = 0; t < TL.end; t += STEP) {
    const r = await page.evaluate(([t, Z]) => {
      renderAt(t);
      const eff = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; const ao = e.getAttribute ? e.getAttribute('opacity') : null; o *= (ao == null ? 1 : +ao) * +cs.opacity; } return o; };
      const out = []; let n = 0;
      document.querySelectorAll('[data-safe]').forEach(el => {
        const o = eff(el); if (o < .15) return;
        const tgt = (el.classList.contains('row') || el.classList.contains('hd')) && el.children.length === 1 ? el.firstElementChild : el;
        const b = tgt.getBoundingClientRect(); if (b.width < 2 || b.height < 2) return; n++;
        const over = Math.max(Z.left - b.left, b.right - Z.right, Z.top - b.top, b.bottom - Z.bottom);
        if (over > 0.5) out.push({ kind: el.getAttribute('data-safe'), text: (el.textContent || '').trim().slice(0, 40), rect: [b.left, b.top, b.right, b.bottom].map(v => Math.round(v)), over: Math.round(over), opacity: +o.toFixed(2) });
      });
      // is any option highlighted green?
      const hi = [...document.querySelectorAll('.opt')].filter(e => +getComputedStyle(e.querySelector('.ov')).opacity > .01 && eff(e) > .05).map(e => e.textContent.trim());
      return { out, n, hi };
    }, [t, ZONE]);
    samples++; checked += r.n;
    r.out.forEach(v => viol.push({ t: +t.toFixed(2), ...v }));
    if (r.hi.length && t < cdEnd) early.push({ t: +t.toFixed(2), highlighted: r.hi });
  }
  await browser.close();
  const rep = { zone: ZONE, step_s: STEP, samples, element_checks: checked, violations: viol.length, violation_list: viol.slice(0, 200),
    countdown: { start: TL.cd[0], end: cdEnd, frames: Math.round(TL.cd[1] * TL.fps) }, early_answer_highlight: early, pass: viol.length === 0 && early.length === 0 };
  fs.mkdirSync(path.join(ep, 'qc'), { recursive: true });
  fs.writeFileSync(path.join(ep, 'qc/safe_zone_report.json'), JSON.stringify(rep, null, 1));
  console.log(JSON.stringify({ samples, checked, violations: viol.length, early: early.length }));
  const byKind = {}; viol.forEach(v => { const k = v.kind + '|' + v.text; byKind[k] = byKind[k] || { n: 0, t0: v.t, t1: v.t, rect: v.rect, over: 0 }; byKind[k].n++; byKind[k].t1 = v.t; byKind[k].over = Math.max(byKind[k].over, v.over); });
  console.log(JSON.stringify(byKind, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
