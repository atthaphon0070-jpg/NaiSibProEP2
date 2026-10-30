// EP28 QC over the page (not the MP4): samples the whole timeline and writes
//   qc/safe_zone_report.json  — critical text/cards (.crit) and every fully visible topology diagram inside X 220–860, Y 350–1430
//   qc/frame_checks.json      — packet-route violations, label ↔ diagram consistency, neutral options before the reveal, countdown frames
// usage: node EP28/tools/qc_frames.js [step=0.1]
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const STEP = +(process.argv[2] || .1), Z = { x0: 220, x1: 860, y0: 350, y1: 1430 };
(async () => {
  const br = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const pg = await br.newPage({ viewport: { width: 1080, height: 1920 } });
  pg.on('pageerror', e => console.error('PAGEERR', e.message));
  await pg.goto('file://' + path.resolve(__dirname, '../source/index.html')); await pg.evaluate(() => window.ready);
  const res = await pg.evaluate(({ STEP, Z }) => {
    const op = el => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
    const out = { samples: 0, checked: 0, viol: {}, diag: {}, label: [], neutral: [], scenes: {} };
    const inZ = r => r.left >= Z.x0 - .5 && r.right <= Z.x1 + .5 && r.top >= Z.y0 - .5 && r.bottom <= Z.y1 + .5;
    const KN = ['star', 'bus', 'ring', 'mesh', 'tree', 'hybrid', 'p2p'];
    window.TOPO_VIOLATIONS.length = 0;
    for (let t = 0; t < TL.end; t += STEP) {
      renderAt(t); out.samples++;
      // critical boxes
      document.querySelectorAll('.crit').forEach(e => {
        if (op(e) < .98) return; const r = e.getBoundingClientRect(); if (!r.width) return;
        out.checked++;
        if (!inZ(r)) { const k = (e.textContent.trim().slice(0, 30) || e.className); (out.viol[k] = out.viol[k] || []).push([+t.toFixed(2), Math.round(r.left), Math.round(r.top), Math.round(r.right), Math.round(r.bottom)]); }
      });
      // main diagrams: union of visible nodes + links
      const views = [...document.querySelectorAll('svg.topo')].filter(s => !s.closest('.mcard') && op(s) >= .98);
      views.forEach(s => {
        let x0 = 1e9, y0 = 1e9, x1 = -1e9, y1 = -1e9, n = 0;
        s.querySelectorAll(':scope > g > g > g').forEach(g => { if (getComputedStyle(g).display === 'none' || +g.style.opacity < .98) return; const r = g.getBoundingClientRect(); if (!r.width && !r.height) return; n++; x0 = Math.min(x0, r.left); y0 = Math.min(y0, r.top); x1 = Math.max(x1, r.right); y1 = Math.max(y1, r.bottom); });
        if (!n) return;
        out.checked++;
        const k = 'diagram:' + (s.dataset.type || '?');
        out.diag[k] = out.diag[k] || { samples: 0, bbox: [1e9, 1e9, -1e9, -1e9], outside: [] };
        const d = out.diag[k]; d.samples++; d.bbox = [Math.min(d.bbox[0], x0), Math.min(d.bbox[1], y0), Math.max(d.bbox[2], x1), Math.max(d.bbox[3], y1)].map(Math.round);
        if (!inZ({ left: x0, right: x1, top: y0, bottom: y1 })) d.outside.push([+t.toFixed(2), ...[x0, y0, x1, y1].map(Math.round)]);
      });
      // label ↔ diagram
      const mainTypes = views.map(s => s.dataset.type);
      document.querySelectorAll('[data-topo]').forEach(e => {
        const X = e.dataset.topo; if (!KN.includes(X) || op(e) < .98) return;
        const inner = e.querySelector('svg.topo');
        if (inner) { if (inner.dataset.type !== X) out.label.push([+t.toFixed(2), X, 'card shows ' + inner.dataset.type]); return; }
        if (!mainTypes.length) return;
        const ok = mainTypes.some(m => m === X || (m === 'hybrid' && ['star', 'bus'].includes(X)));
        if (!ok) out.label.push([+t.toFixed(2), X, 'diagram is ' + mainTypes.join(',')]);
      });
      // quiz options neutral before the reveal
      const qo = [...document.querySelectorAll('.qo')];
      if (qo.length && t < window.REVEAL_AT && op(qo[0]) > 0) {
        const sig = qo.map(o => [o.querySelector('.ov').style.opacity || '0', o.querySelector('.mk').style.opacity || '0', o.style.filter || '', o.style.boxShadow || '', o.querySelector('.b').style.background || ''].join('|'));
        if (new Set(sig).size > 1 || sig.some(s => !s.startsWith('0|0|'))) out.neutral.push([+t.toFixed(2), sig]);
      }
    }
    out.packetViolations = window.TOPO_VIOLATIONS.slice(0, 50); out.packetViolationCount = window.TOPO_VIOLATIONS.length;
    // countdown: every frame
    const CD = TL.cd[0], f0 = Math.round(CD * 30), cdF = [];
    for (let f = f0 - 2; f < f0 + 152; f++) { renderAt(f / 30); const n = document.querySelector('#s5 .cd-num'); const box = n.closest('.crit'); cdF.push([f, op(box) > .5 ? n.textContent : '']); }
    out.countdown = { start_frame: f0, frames: cdF };
    return out;
  }, { STEP, Z });
  await br.close();
  const q = path.resolve(__dirname, '../qc');
  // countdown verdict
  const fr = res.countdown.frames, shown = fr.filter(([, n]) => n !== '');
  const runs = {}; shown.forEach(([, n]) => { runs[n] = (runs[n] || 0) + 1; });
  const cdOk = shown.length === 150 && ['5', '4', '3', '2', '1'].every(n => runs[n] === 30) && shown[0][0] === res.countdown.start_frame;
  const diagOut = Object.fromEntries(Object.entries(res.diag).map(([k, v]) => [k, { samples: v.samples, union_bbox: v.bbox, outside_samples: v.outside.length, first_outside: v.outside.slice(0, 3) }]));
  const safe = { zone: Z, canvas: [1080, 1920], step_s: STEP, samples: res.samples, boxes_checked: res.checked,
    rule: 'every .crit element and every main topology diagram (union of its visible nodes and cables) at opacity >= 0.98 must lie inside the zone, including entrances, morphs and camera moves',
    text_violations: Object.fromEntries(Object.entries(res.viol).map(([k, v]) => [k, { samples: v.length, first: v.slice(0, 3) }])),
    diagrams: diagOut,
    unresolved_critical: Object.keys(res.viol).length + Object.values(diagOut).filter(d => d.outside_samples).length };
  fs.writeFileSync(q + '/safe_zone_report.json', JSON.stringify(safe, null, 1));
  const fc = { packet_violation_count: res.packetViolationCount, packet_violations: res.packetViolations, label_mismatches: res.label.slice(0, 40), label_mismatch_count: res.label.length,
    options_not_neutral_before_reveal: res.neutral.slice(0, 10), countdown: { start_frame: res.countdown.start_frame, frames_with_numeral: shown.length, per_numeral: runs, exact_150: cdOk, edges: fr.slice(0, 3).concat(fr.slice(-3)) } };
  fs.writeFileSync(q + '/frame_checks.json', JSON.stringify(fc, null, 1));
  console.log('safe-zone unresolved:', safe.unresolved_critical, JSON.stringify(safe.text_violations).slice(0, 1500));
  console.log('diagrams:', JSON.stringify(diagOut).slice(0, 1500));
  console.log('packets:', res.packetViolationCount, 'labels:', res.label.length, JSON.stringify(res.label.slice(0, 8)), 'neutral:', res.neutral.length, 'countdown ok:', cdOk, JSON.stringify(runs));
})();
