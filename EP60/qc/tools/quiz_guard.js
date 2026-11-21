// EP.60 quiz guard: frame-by-frame DOM check of the countdown and the answer reveal.
// usage: node EP60/qc/tools/quiz_guard.js EP60 <out.json>
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const [, , ep, out] = process.argv;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.resolve(ep, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const r = await page.evaluate(() => {
    const T = window.TL, fps = T.fps, cd0 = T.cd[0], cdD = T.cd[1], qs = T.quiz[0], an = T.ans[0];
    const f0 = Math.round(cd0 * fps), f1 = Math.round((cd0 + cdD) * fps);
    const opts = [...document.querySelectorAll('#q-opts .opt')];
    const early = [], digits = {}, firstReveal = { frame: null };
    const hdr = document.getElementById('q-hdrtx');
    for (let f = Math.floor(qs * fps); f < Math.round((an + 4) * fps); f++) {
      renderAt(f / fps);
      const green = +opts[1].querySelector('.ov').style.opacity || 0;
      const chk = +opts[1].querySelector('.chk').style.opacity || 0;
      const saysAnswer = /เฉลย|ข้อ ข/.test(hdr.textContent);
      const dimmed = opts.some((o, i) => i !== 1 && (o.style.filter || '').includes('grayscale') && !o.style.filter.includes('grayscale(0)'));
      const revealedNow = green > 0 || chk > 0 || saysAnswer || dimmed;
      if (revealedNow && firstReveal.frame === null) firstReveal.frame = f;
      if (revealedNow && f < f1) early.push({ f, green, chk, hdr: hdr.textContent });
      if (f >= f0 && f < f1) { const n = document.querySelector('#q-cd .cd-num').textContent; digits[n] = (digits[n] || 0) + 1; }
    }
    return { fps, countdown_start_s: cd0, countdown_end_s: cd0 + cdD, start_frame: f0, end_frame_exclusive: f1, frames: f1 - f0, digit_frames: digits,
      first_reveal_frame: firstReveal.frame, first_reveal_s: firstReveal.frame / fps, answer_audio_start_s: an, early_reveal_frames: early.length, early_samples: early.slice(0, 5) };
  });
  r.pass = r.frames === 150 && Math.abs(r.countdown_end_s - r.countdown_start_s - 5) < 1e-9 && r.early_reveal_frames === 0 && ['5', '4', '3', '2', '1'].every(d => r.digit_frames[d] === 30);
  await browser.close();
  fs.writeFileSync(out, JSON.stringify(r, null, 1));
  console.log(JSON.stringify(r, null, 1));
})().catch(e => { console.error(e); process.exit(1); });
