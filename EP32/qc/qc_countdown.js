// EP32 countdown/reveal QC: checks every frame from 1 s before the countdown to 2 s after the answer starts.
// Expects 5,4,3,2,1 for exactly 30 frames each, and no correct-answer highlight before 06_answer "ข้อ ค.".
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, '../source/index.html')); await p.evaluate(() => window.ready);
  const r = await p.evaluate(() => {
    const fps = TL.fps, f0 = Math.round(TL.cd[0] * fps), rows = [];
    for (let f = f0 - 30; f < f0 + 150 + 60; f++) {
      renderAt(f / fps);
      const cd = document.querySelector('.cd-num'), ring = cd.closest('div[style*="width"]').parentElement;
      const ov = [...document.querySelectorAll('#s5 .opt .ov')].map(o => +getComputedStyle(o).opacity);
      rows.push({ f, num: getComputedStyle(cd.parentElement.parentElement).visibility !== "hidden" && +getComputedStyle(cd.parentElement.parentElement).opacity > .05 && getComputedStyle(cd.parentElement).visibility !== 'hidden' && +getComputedStyle(cd.parentElement).opacity > .05 ? cd.textContent : '', green: ov.some(x => x > .01), greenIdx: ov.findIndex(x => x > .01) });
    }
    return { f0, rev: Math.round(MARKS.reveal * fps), cdStart: TL.cd[0], cdDur: TL.cd[1], rows };
  });
  const cnt = {}; r.rows.filter(x => x.f >= r.f0 && x.f < r.f0 + 150).forEach(x => cnt[x.num] = (cnt[x.num] || 0) + 1);
  const seq = r.rows.filter(x => x.f >= r.f0 && x.f < r.f0 + 150).map(x => x.num).join('');
  const expected = '5'.repeat(30) + '4'.repeat(30) + '3'.repeat(30) + '2'.repeat(30) + '1'.repeat(30);
  const earlyGreen = r.rows.filter(x => x.green && x.f < r.rev);
  const firstGreen = r.rows.find(x => x.green);
  const outside = r.rows.filter(x => x.num && (x.f < r.f0 || x.f >= r.f0 + 150)).length;
  console.log(JSON.stringify({ countdown_start_s: +r.cdStart.toFixed(4), countdown_start_frame: r.f0, countdown_frames: 150, duration_s: r.cdDur, per_number_frames: cnt, sequence_exact: seq === expected,
    reveal_frame: r.rev, first_green_frame: firstGreen && firstGreen.f, first_green_option: firstGreen && 'กขคง'[firstGreen.greenIdx], green_before_reveal: earlyGreen.length, number_visible_outside_window_frames: outside, frames_checked: [r.rows[0].f, r.rows[r.rows.length - 1].f] }, null, 1));
  await b.close();
})();
