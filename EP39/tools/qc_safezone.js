// usage: node EP39/tools/qc_safezone.js [step=0.2]  -> EP39/qc/safe_zone_report.json
// Samples moving frames across the whole timeline and checks every essential element (.ess) that is visibly
// on screen (effective opacity > 0.3) against the conservative zone X 220–860, Y 350–1430, then models the
// 9:16 video on three phone screens (fill-to-height crop) and on approximate platform UI overlays.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(__dirname, '..'), STEP = +(process.argv[2] || .2);
const ZONE = { x0: 220, x1: 860, y0: 350, y1: 1430 }, TOL = 2;
// Approximate UI overlay areas in 1080×1920 video coordinates (conservative public safe-zone templates).
const OVERLAYS = {
  tiktok: [{ name: 'top bar', x0: 0, y0: 0, x1: 1080, y1: 250 }, { name: 'right action rail', x0: 900, y0: 700, x1: 1080, y1: 1600 }, { name: 'caption/description', x0: 0, y0: 1500, x1: 1080, y1: 1920 }],
  youtube_shorts: [{ name: 'top bar', x0: 0, y0: 0, x1: 1080, y1: 220 }, { name: 'right action rail', x0: 910, y0: 760, x1: 1080, y1: 1640 }, { name: 'title/channel', x0: 0, y0: 1520, x1: 1080, y1: 1920 }],
  instagram_reels: [{ name: 'top bar', x0: 0, y0: 0, x1: 1080, y1: 230 }, { name: 'right action rail', x0: 900, y0: 820, x1: 1080, y1: 1640 }, { name: 'caption/audio', x0: 0, y0: 1480, x1: 1080, y1: 1920 }],
};
const PHONES = [[375, 812], [390, 844], [430, 932]].map(([w, hh]) => { const s = hh / 1920, vis = w / s; const crop = Math.max(0, (1080 - vis) / 2); return { screen: `${w}x${hh}`, scale: +s.toFixed(4), visibleX: [+crop.toFixed(1), +(1080 - crop).toFixed(1)], zoneInsideCrop: ZONE.x0 >= crop && ZONE.x1 <= 1080 - crop }; });
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.join(EP, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const end = await page.evaluate(() => TL.end);
  const viol = [], perScene = {}; let checked = 0, frames = 0;
  for (let t = 0; t < end; t += STEP) {
    frames++;
    const r = await page.evaluate(({ t, Z, TOL }) => {
      renderAt(t);
      const out = [];
      document.querySelectorAll('.ess').forEach(el => {
        let o = 1, n = el;
        while (n && n.nodeType === 1) { const cs = getComputedStyle(n); if (cs.display === 'none' || cs.visibility === 'hidden') return; o *= +cs.opacity; n = n.parentElement; }
        if (o < .3) return;
        const b = el.getBoundingClientRect(); if (b.width < 2) return;
        const sc = el.closest('.scene'); const bad = b.left < Z.x0 - TOL || b.right > Z.x1 + TOL || b.top < Z.y0 - TOL || b.bottom > Z.y1 + TOL;
        out.push({ sc: sc ? sc.id : '-', bad, txt: el.textContent.trim().slice(0, 30), box: [b.left, b.top, b.right, b.bottom].map(v => Math.round(v)) });
      });
      return out;
    }, { t, Z: ZONE, TOL });
    r.forEach(e => { checked++; perScene[e.sc] = perScene[e.sc] || { checks: 0, violations: 0 }; perScene[e.sc].checks++; if (e.bad) { perScene[e.sc].violations++; viol.push({ t: +t.toFixed(2), ...e }); } });
  }
  await browser.close();
  const overlayHits = [];
  // essential zone vs overlays (geometry): any overlap of the conservative zone with a modelled overlay?
  for (const [pf, list] of Object.entries(OVERLAYS)) list.forEach(o => { const ov = !(o.x1 <= ZONE.x0 || o.x0 >= ZONE.x1 || o.y1 <= ZONE.y0 || o.y0 >= ZONE.y1); if (ov) overlayHits.push({ platform: pf, overlay: o.name }); });
  const rep = { episode: 'EP39', generated: new Date().toISOString(), method: `renderAt(t) every ${STEP}s across the full timeline (moving frames, not scene starts); every .ess element with effective opacity > 0.3 measured with getBoundingClientRect (includes all transforms)`,
    zone: ZONE, tolerancePx: TOL, framesSampled: frames, elementChecks: checked, violations: viol.length, perScene, violationList: viol.slice(0, 200),
    phones: PHONES, overlaysModelled: OVERLAYS, zoneOverlapsOverlay: overlayHits, criticalClipping: viol.length > 0 || overlayHits.length > 0 || PHONES.some(p => !p.zoneInsideCrop) };
  fs.writeFileSync(path.join(EP, 'qc/safe_zone_report.json'), JSON.stringify(rep, null, 1));
  console.log('frames', frames, 'checks', checked, 'violations', viol.length, JSON.stringify(perScene));
  viol.slice(0, 30).forEach(v => console.log(v.t, v.sc, v.txt, v.box.join(',')));
})().catch(e => { console.error(e); process.exit(1); });
