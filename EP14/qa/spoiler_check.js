// EP14 spoiler check: from t=0 until the answer frame, no visible text may show the solved results
// (1,428 outside the quiz options, 136, the middle term 68, n = 21, 1,360 outside option ก) and
// no option may be highlighted. Samples every frame of the quiz+countdown, every 0.1 s before that.
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, '../source/index.html')); await p.evaluate(() => window.ready);
  const res = await p.evaluate(() => {
    const ansF = Math.round(TL.ans[0] * TL.fps), out = []; let n = 0;
    const visible = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .02) return false; } return true; };
    const BAD = [/1,?428/, /(^|[^\d,])136(?!\d)/, /(^|[^\d,])68(?!\d)/, /n\s*=\s*21/, /1,?360/];
    const times = []; for (let t = 0; t < TL.quiz[0]; t += .1) times.push(t); for (let f = Math.round(TL.quiz[0] * TL.fps); f < ansF; f++) times.push(f / TL.fps);
    for (const t of times) {
      renderAt(t); n++;
      const w = document.createTreeWalker(document.getElementById('stage'), NodeFilter.SHOW_TEXT); let x;
      while ((x = w.nextNode())) {
        const s = x.nodeValue; if (!s.trim() || !visible(x.parentElement)) continue;
        const inOpt = !!x.parentElement.closest('.optx');
        BAD.forEach((re, i) => { if (re.test(s) && !(inOpt && (i === 0 || i === 4))) out.push({ t: +t.toFixed(3), text: s.trim().slice(0, 40) }); });
      }
      document.querySelectorAll('.optx .ov, .optx .chk').forEach(e => { if (visible(e) && +getComputedStyle(e).opacity > .01) out.push({ t: +t.toFixed(3), text: 'option highlight' }); });
    }
    return { samples: n, answerFrame: ansF, violations: out.slice(0, 50), count: out.length };
  });
  fs.writeFileSync(path.join(__dirname, 'spoiler_check.json'), JSON.stringify(res, null, 1));
  console.log(JSON.stringify(res).slice(0, 1500));
  await b.close();
})();
