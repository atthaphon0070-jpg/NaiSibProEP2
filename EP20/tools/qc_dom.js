// EP20 DOM-level QC (runs the same page the renderer captures). usage: node EP20/tools/qc_dom.js > EP20/qc/dom_checks.txt
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, '../source/index.html')); await p.evaluate(() => window.ready);
  const r = await p.evaluate(() => {
    const T = TL, S = k => T[k][0], fps = T.fps, out = [];
    const vis = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .02) return false; } return true; };
    const rows = () => [...document.querySelectorAll('.br')].filter(vis);
    const bulbOn = () => rows().flatMap(r => [...r.querySelectorAll('.g-on')].map(g => +g.getAttribute('opacity')));
    // 1) alignment: every visible digit centred on its bulb and label (sampled every 0.5 s where digits show)
    let maxDx = 0, nChk = 0;
    for (let t = 0; t < T.end; t += .5) { renderAt(t);
      rows().forEach(r => r.querySelectorAll('.br-col').forEach(c => { const d = c.querySelector('.br-dig'), bu = c.querySelector('.br-bulb'), l = c.querySelector('.br-lab');
        if (!d.textContent || !vis(d)) return; const cx = e => { const q = e.getBoundingClientRect(); return q.left + q.width / 2; };
        maxDx = Math.max(maxDx, Math.abs(cx(d) - cx(bu)), Math.abs(cx(l) - cx(bu))); nChk++; })); }
    out.push(`digit/bulb/label centre alignment: max |dx| = ${maxDx.toFixed(2)} px over ${nChk} samples`);
    // 2) place values left→right
    renderAt(S('expl') + 5); out.push('place values (explanation row) L→R: ' + [...rows()[0].querySelectorAll('.br-lab')].map(e => e.textContent).join(' · ') + ' | digits: ' + [...rows()[0].querySelectorAll('.br-dig')].map(e => e.textContent).join(''));
    renderAt(S('expl') + 10); out.push('1010 lit bulbs (opacity of ON glass, L→R): ' + bulbOn().map(v => v.toFixed(2)).join(' '));
    renderAt(S('ans') + 12); out.push('answer row digits: ' + [...rows()[0].querySelectorAll('.br-dig')].map(e => e.textContent).join('') + ' | lit L→R: ' + bulbOn().map(v => v.toFixed(2)).join(' '));
    // 3) quiz + countdown: bulbs all OFF, cards identical before the reveal
    let maxOn = 0, cardDiff = 0;
    for (let f = Math.round(S('quiz') * fps); f < Math.round(S('ans') * fps); f++) { renderAt(f / fps); maxOn = Math.max(maxOn, ...bulbOn(), 0);
      const cards = [...document.querySelectorAll('.qcd')].filter(vis).filter(c => +getComputedStyle(c).opacity > .99);
      const sig = c => { const cs = getComputedStyle(c); return [cs.boxShadow, cs.filter, cs.background, getComputedStyle(c.querySelector('.ov')).opacity, getComputedStyle(c.querySelector('.mk')).opacity, getComputedStyle(c.querySelector('.b')).backgroundImage].join('|'); };
      if (cards.length > 1 && new Set(cards.map(sig)).size > 1) cardDiff++; }
    out.push(`quiz + countdown frames ${Math.round(S('quiz') * fps)}–${Math.round(S('ans') * fps) - 1}: max bulb ON level = ${maxOn}; frames where fully-shown cards differ in style = ${cardDiff}`);
    // 4) countdown numbers per frame
    const cd0 = Math.round(S('cd') * fps), seq = [];
    for (let f = cd0; f < cd0 + 150; f++) { renderAt(f / fps); const n = document.querySelector('.cd-num').textContent; if (!seq.length || seq[seq.length - 1][0] !== n) seq.push([n, 0]); seq[seq.length - 1][1]++; }
    out.push(`countdown frames ${cd0}–${cd0 + 149}: ` + seq.map(([n, c]) => `${n}×${c}f`).join(' → ') + `; answer audio starts frame ${Math.round(S('ans') * fps)}`);
    // 5) where "13" is visible before 06_answer
    const hits = new Set();
    for (let f = 0; f < Math.round(S('ans') * fps); f += 3) { renderAt(f / fps);
      document.querySelectorAll('#stage *').forEach(e => { if (e.children.length === 0 && !e.closest('svg') && /13/.test(e.textContent) && vis(e)) hits.add((e.closest('[id]') || e).id + ': "' + e.textContent.trim() + '"'); }); }
    out.push('"13" visible before 06_answer in: ' + ([...hits].join(', ') || 'nowhere'));
    // 6) frame 0 keyword fully inside the frame
    renderAt(0); const sp = [...document.querySelectorAll('#h-kw span')].map(e => e.getBoundingClientRect()); const k = { left: Math.min(...sp.map(q => q.left)), right: Math.max(...sp.map(q => q.right)), top: Math.min(...sp.map(q => q.top)), bottom: Math.max(...sp.map(q => q.bottom)) };
    out.push(`frame 0 keyword box: x ${k.left.toFixed(0)}–${k.right.toFixed(0)}, y ${k.top.toFixed(0)}–${k.bottom.toFixed(0)}, opacity ${getComputedStyle(document.getElementById('h-kw')).opacity}`);
    return out;
  });
  console.log(r.join('\n')); await b.close();
})();
