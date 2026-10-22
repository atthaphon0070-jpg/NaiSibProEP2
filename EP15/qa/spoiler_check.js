// EP15 spoiler check: until the answer frame, no visible overlay may state the legal conclusion
// (outside the four choice cards) and no choice may be highlighted. Every frame of quiz + countdown,
// every 0.1 s before that.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, '../source/index.html')); await p.evaluate(() => window.ready);
  const res = await p.evaluate(() => {
    const ansF = Math.round(TL.ans[0] * TL.fps), out = []; let n = 0;
    const visible = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .02) return false; } return true; };
    const BAD = [/อาจเป็นการป้องกันโดยชอบ/, /ภัยสิ้นสุดแล้ว/, /เอาคืน/, /อาจมีความผิด/, /เฉลย/, /ไม่มีภยันตราย/, /ภัยยังมีอยู่/];
    const times = []; for (let t = 0; t < TL.quiz[0]; t += .1) times.push(t); for (let f = Math.round(TL.quiz[0] * TL.fps); f < ansF; f++) times.push(f / TL.fps);
    for (const t of times) {
      renderAt(t); n++;
      const w = document.createTreeWalker(document.getElementById('ui'), NodeFilter.SHOW_TEXT); let x;
      while ((x = w.nextNode())) {
        const s = x.nodeValue; if (!s.trim() || !visible(x.parentElement) || x.parentElement.closest('.opt')) continue;
        BAD.forEach(re => { if (re.test(s)) out.push({ t: +t.toFixed(3), text: s.trim().slice(0, 50) }); });
      }
      const key = document.querySelector('.neq'); if (key && visible(key)) out.push({ t: +t.toFixed(3), text: 'key graphic' });
      document.querySelectorAll('.opt .ov, .opt .chk').forEach(e => { if (visible(e) && +getComputedStyle(e).opacity > .01) out.push({ t: +t.toFixed(3), text: 'option highlight' }); });
      document.querySelectorAll('.opt').forEach(e => { if (visible(e) && e.style.borderColor && e.style.borderColor.includes('240')) out.push({ t: +t.toFixed(3), text: 'option border highlight' }); });
    }
    return { samples: n, answerFrame: ansF, count: out.length, violations: out.slice(0, 40) };
  });
  fs.writeFileSync(path.join(__dirname, 'spoiler_check.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res).slice(0, 1500));
  await b.close();
})();
