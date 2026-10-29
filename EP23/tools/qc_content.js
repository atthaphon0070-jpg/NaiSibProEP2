// EP23 content QC on the rendered DOM, every 0.1 s before 06_answer starts (frame-exact countdown end):
//  1. "ขาดไม่ได้" stamps appear only on the PSU / Mainboard / CPU / RAM files (never on the Hard Disk or a quiz card).
//  2. Nothing marks the Hard Disk as the answer: no ✓ / ✗ / green fill / stamp on any choice card, no verdict text.
//  3. The four choice cards look identical once all are on screen (same frame colour, background, filter, scale).
//  4. No spotlight during the quiz and countdown.
// Plus, over the whole video: no real brand names in any visible text.
// usage: node EP23/tools/qc_content.js > EP23/qc/content_check.txt
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.resolve(__dirname, '../source/index.html'));
  await page.evaluate(() => window.ready);
  const T = await page.evaluate(() => ({ quiz0: TL.quiz[0], ans0: TL.ans[0], end: TL.end, allCards: TL.quiz[0] + BEATS.quiz.v4 + .7 }));
  const BRANDS = /intel|amd|ryzen|nvidia|geforce|radeon|kingston|seagate|western digital|\bwd\b|samsung|corsair|asus|gigabyte|\bmsi\b|microsoft|windows|apple|dell|\bhp\b|lenovo|acer/i;
  const bad = []; let n = 0, nb = 0;
  for (let t = 0; t < T.end; t += .1) {
    const before = t < T.ans0 - 1e-6;
    const r = await page.evaluate(([t, before]) => {
      renderAt(t);
      const eff = el => { let o = 1; for (let e = el; e && e.nodeType === 1; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; o *= +cs.opacity; } return o; };
      const texts = []; const w = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT); let nd;
      while ((nd = w.nextNode())) { const s = nd.nodeValue.trim(); if (!s) continue; const el = nd.parentElement; if (el.closest('#wipe')) continue; if (eff(el) > .02) texts.push(s); }
      if (!before) return { texts };
      const stamps = [...document.querySelectorAll('.case-stamp')].filter(s => eff(s) > .02).map(s => ({ txt: s.textContent.trim(), sus: (s.closest('.case-folder') || {}).dataset?.sus || (s.closest('.ch') ? 'quiz-card' : 'none') }));
      const cards = [...document.querySelectorAll('.ch')].map(c => {
        const cs = getComputedStyle(c), m = cs.transform.match(/matrix\(([^,]+),/);
        return { vis: eff(c), ok: eff(c.querySelector('.ok')), xx: eff(c.querySelector('.xx')), ov: +getComputedStyle(c.querySelector('.ov')).opacity, border: cs.borderColor, bg: cs.backgroundImage, filter: cs.filter, shadow: cs.boxShadow, scale: m ? Math.abs(+m[1]).toFixed(3) : '1' };
      });
      const spot = [...document.querySelectorAll('.cone')].some(c => eff(c) > .02 && c.closest('#s5'));
      return { texts, stamps, cards, spot };
    }, [t, before]);
    n++;
    r.texts.forEach(s => { if (BRANDS.test(s)) bad.push(`${t.toFixed(1)}s brand name in text: "${s}"`); });
    if (!before) continue;
    nb++;
    r.stamps.forEach(s => { if (/ขาดไม่ได้/.test(s.txt) && !['psu', 'mb', 'cpu', 'ram'].includes(s.sus)) bad.push(`${t.toFixed(1)}s "ขาดไม่ได้" stamp on ${s.sus}`); });
    r.cards.forEach((c, i) => { if (c.vis > .02 && (c.ok > .02 || c.xx > .02 || c.ov > .02)) bad.push(`${t.toFixed(1)}s choice card ${i + 1} marked before 06`); });
    if (r.texts.some(s => /คำตัดสิน$|เฉลย|ปิดคดี|ไม่จำเป็น|ไม่ต้องใช้/.test(s))) bad.push(`${t.toFixed(1)}s verdict wording visible before 06`);
    if (t >= T.allCards) {
      const k = c => [c.border, c.bg, c.filter, c.shadow, c.scale].join('|');
      if (new Set(r.cards.map(k)).size !== 1) bad.push(`${t.toFixed(1)}s choice cards differ: ${[...new Set(r.cards.map(k))].join(' / ')}`);
    }
    if (r.spot) bad.push(`${t.toFixed(1)}s spotlight visible during quiz/countdown`);
  }
  console.log(`samples: ${n} (every 0.1 s, whole video; ${nb} before 06_answer at ${T.ans0.toFixed(3)} s), violations: ${bad.length}`);
  bad.slice(0, 60).forEach(b => console.log(b));
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
