// EP13 no-spoiler + maths audit on the real page (every frame up to the reveal, then the answer section).
// usage: node EP13/qa/spoiler_audit.js   (writes EP13/qa/spoiler_audit.json)
// Before the reveal ("ข้อ ข", answer +2.97 s): no visible 96 or 24 anywhere except the quiz option text "96 บาท",
// no odometer showing 96/24, option ข never highlighted, no "เฉลย". Countdown digit per frame = 5..1.
// After the reveal: option ข highlighted, and every price/step number on screen comes from 100 → 120 → 96.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  const errors = []; p.on('pageerror', e => errors.push(e.message));
  await p.goto('file://' + path.resolve(__dirname, '../source/index.html')); await p.evaluate(() => window.ready);
  const res = await p.evaluate(() => {
    const fps = TL.fps, AN = TL.ans[0], CD = TL.cd[0], REV = AN + 2.97;
    const visible = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .05) return false; } return true; };
    const issues = [], numbersAfter = new Set(); let frames = 0;
    const optB = () => document.querySelectorAll('.optx')[1];
    for (let f = 0; f < Math.ceil(TL.end * fps); f++) {
      const t = f / fps; renderAt(t); frames++;
      const before = t < REV - 1e-6;
      const w = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT); let n;
      while ((n = w.nextNode())) {
        const tx = n.nodeValue; if (!/\d/.test(tx)) continue;
        const el = n.parentElement; if (el.closest('#world') || el.closest('.ods') || !visible(el)) continue;
        const nums = (tx.match(/\d[\d,]*/g) || []).map(s => s.replace(/,/g, ''));
        if (before) { if (nums.some(x => x === '96' || x === '24') && !el.closest('.optx')) issues.push({ t: +t.toFixed(3), kind: 'number-before-reveal', text: tx.trim() }); }
        else if (t < TL.promo[0]) nums.forEach(x => numbersAfter.add(x));
      }
      document.querySelectorAll('.odo').forEach(o => {
        if (!visible(o)) return; const v = Math.round(+o.dataset.v), qa = +o.dataset.qa;
        if (before && qa < .5 && (v === 96 || v === 24)) issues.push({ t: +t.toFixed(3), kind: 'odometer-before-reveal', v });
        if (!before && t < TL.promo[0] && qa < .5 && Math.abs(+o.dataset.v - v) < .02) numbersAfter.add(String(v));
      });
      if (TL.quiz[0] <= t && t < TL.promo[0]) {
        const ob = optB(), ov = +getComputedStyle(ob.querySelector('.ov')).opacity, ck = +getComputedStyle(ob.querySelector('.chk')).opacity;
        if (before && (ov > 0 || ck > 0)) issues.push({ t: +t.toFixed(3), kind: 'option-b-highlighted-early' });
        if (t >= REV + .3 && t < AN + 5.9 && ov < .9) issues.push({ t: +t.toFixed(3), kind: 'option-b-not-highlighted-after-reveal' });
        const hdr = document.getElementById('qHdr').textContent;
        if (before && hdr.includes('เฉลย')) issues.push({ t: +t.toFixed(3), kind: 'reveal-header-early' });
      }
      if (t >= CD && t < AN) {
        const k = Math.floor(t - CD + 1e-6), num = document.querySelector('.qcd .cd-num').textContent;
        if (num !== String(5 - k)) issues.push({ t: +t.toFixed(3), kind: 'countdown-digit', want: 5 - k, got: num });
      }
    }
    return { frames, reveal_t: REV, reveal_frame: Math.round(REV * fps), countdown_frames: [Math.round(CD * fps), Math.round(AN * fps) - 1], issues: issues.slice(0, 200), issue_count: issues.length, numbers_after_reveal: [...numbersAfter].sort((a, b) => a - b) };
  });
  res.page_errors = errors;
  fs.writeFileSync(path.join(__dirname, 'spoiler_audit.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify({ frames: res.frames, reveal: [res.reveal_t, res.reveal_frame], countdown: res.countdown_frames, issues: res.issue_count, after: res.numbers_after_reveal, errors }));
  res.issues.slice(0, 20).forEach(i => console.log(JSON.stringify(i)));
  await b.close();
})();
