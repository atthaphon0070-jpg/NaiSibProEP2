// EP20 safe-zone check: key text (captions, keyword, chips, cards, numbers, labels) must sit inside X 190–870, Y 300–1430
// whenever it is fully shown (opacity ≈ 1, no entrance/exit transform). usage: node EP20/tools/qc_safe.js
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, '../source/index.html')); await p.evaluate(() => window.ready);
  const r = await p.evaluate(() => {
    const bad = {};
    const op = el => { let o = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
    const sel = '.cap,.kw span,#h-kw span,.chip,.qcd,.br-dig,.br-lab,.br-arr,.tok,.bignum,#q-bantx span,#p-name,#p-cnt,#p-hex,.cd-num';
    for (let t = 0; t < TL.end; t += .25) { renderAt(t);
      document.querySelectorAll(sel).forEach(e => {
        if (op(e) < .98 || !e.textContent.trim()) return;
        const q = e.getBoundingClientRect(); let x0 = q.left, x1 = q.right;
        if (e.classList.contains('bignum') || e.classList.contains('br-dig') || e.classList.contains('tok') || e.id === 'p-name' || e.id === 'p-cnt') { const rg = document.createRange(); rg.selectNodeContents(e); const rr = rg.getBoundingClientRect(); x0 = rr.left; x1 = rr.right; }
        if (x0 < 189 || x1 > 871 || q.top < 299 || q.bottom > 1431) { const k = (e.id || e.className) + ' "' + e.textContent.trim().slice(0, 24) + '"'; (bad[k] = bad[k] || []).push(`${t.toFixed(2)}s [${x0.toFixed(0)},${q.top.toFixed(0)},${x1.toFixed(0)},${q.bottom.toFixed(0)}]`); }
      }); }
    return Object.entries(bad).map(([k, v]) => `${k}: ${v.length} samples, e.g. ${v.slice(0, 2).join(' ')}`);
  });
  console.log(r.length ? r.join('\n') : 'all key text inside the safe zone'); await b.close();
})();
