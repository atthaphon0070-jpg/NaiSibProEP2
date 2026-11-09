// EP.42 automated QC: maths, safe zone (every 10 frames), answer-leak scan, countdown digits per frame.
// usage: node EP42/tools/qc.js   (writes EP42/qc/math_validation.json, safe_zone_report.json, reveal_check.json)
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const EP = path.resolve(__dirname, '..'), QC = path.join(EP, 'qc');
const SAFE = { x0: 220, x1: 860, y0: 350, y1: 1430 };
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.join(EP, 'source/index.html')); await p.evaluate(() => window.ready);
  const info = await p.evaluate(() => ({ TL, EP42, checks: UNITS.validate(), U: { ...UNITS, sim: undefined, fmt: undefined, validate: undefined } }));
  const fps = info.TL.fps, N = Math.ceil(info.TL.end * fps), { CDF, CDN, REVEAL } = info.EP42;
  // visible text-bearing elements outside the safe zone (decor excluded: background scene, brand header, wipe, mascots, packets, cursor)
  const scan = () => {
    const vis = el => { for (let e = el; e && e.id !== 'stage'; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity < .05) return false; } return true; };
    const out = [];
    document.querySelectorAll('.scene:not(#bgx) *').forEach(el => {
      if (el.closest('svg') || el.closest('.mas') || el.closest('.pk') || el.closest('.conf')) return;
      const own = [...el.childNodes].some(n => n.nodeType === 3 && n.nodeValue.trim());
      if (!own || !vis(el)) return;
      const r = el.getBoundingClientRect(); if (r.width < 2) return;
      const m = 4;
      if (r.left < 220 - m || r.right > 860 + m || r.top < 350 - m || r.bottom > 1430 + m) out.push({ text: el.textContent.trim().slice(0, 40), l: Math.round(r.left), r: Math.round(r.right), t: Math.round(r.top), b: Math.round(r.bottom) });
    });
    return out;
  };
  const viol = {};
  for (let f = 0; f < N; f += 10) {
    await p.evaluate(t => renderAt(t), f / fps);
    const v = await p.evaluate(scan);
    // ignore elements mid-entrance/exit overshoot is not filtered: report everything
    if (v.length) viol[(f / fps).toFixed(2)] = v;
  }
  // answer-leak + countdown check (every frame from quiz start to reveal + 1 s)
  const q0 = Math.floor(info.TL.quiz[0] * fps), rv = Math.round(REVEAL * fps);
  const leak = [], digits = {};
  for (let f = q0; f < rv + 30; f++) {
    await p.evaluate(t => renderAt(t), f / fps);
    const s = await p.evaluate(() => {
      const opts = [...document.querySelectorAll('#s5 .opt')].map(o => +getComputedStyle(o.querySelector('.ov')).opacity);
      const sol = document.querySelector('#s5 .qsol2'), cs = getComputedStyle(sol);
      const cd = document.querySelector('#s5 .cd-num');
      let cdv = cd.closest('.abs'); const cdo = +getComputedStyle(cdv).opacity;
      return { shown: document.querySelector('#s5').style.display === 'block', opts, sol: cs.visibility !== 'hidden' && +cs.opacity > 0.01, cd: cdo > .5 ? cd.textContent : '' };
    });
    if (f < rv && s.shown && (s.opts.some(o => o > 0) || s.sol)) leak.push(f);
    if (f >= CDF && f < CDF + CDN) digits[s.cd] = (digits[s.cd] || 0) + 1;
  }
  const math = {
    episode: 'EP42', units: 'decimal SI (1 MB = 10^6 Byte, 1 Mb = 10^6 bit); no 1,024 conversion used',
    given: { speed: '100 Mbps', file: '500 MB' },
    steps: ['1 Byte = 8 bits', '500 MB × 8 = 4,000 Mb', '4,000 Mb ÷ 100 Mb/s = 40 s', 'alt: 100 Mbps ÷ 8 = 12.5 MB/s; 500 MB ÷ 12.5 MB/s = 40 s'],
    values: { file_Mb: info.U.FILE_Mb, time_s: info.U.TIME_S, speed_MBps: info.U.SPEED_MBps, wrong_shortcut: info.U.WRONG_S, correct_choice: info.U.CHOICES[info.U.CORRECT] },
    checks: info.checks,
    wrong_answer_flagged: 'shown struck through in red in story (02) and answer (06): "500 MB ÷ 100 Mbps = 5" — หารข้ามหน่วย Byte ÷ bit ไม่ได้',
    answer_not_revealed_before_countdown: { frames_with_leak: leak.length, countdown_frames: [CDF, CDF + CDN - 1], reveal_frame: rv },
    simulation: { real_seconds: info.EP42.SIMD, simulated_seconds: 40, rate: 'constant 12.5 MB/s', labelled: 'ภาพจำลองแบบเร่งเวลา (ไม่ใช่เวลาจริง)', ticks: '0 s 0% · 10 s 25% · 20 s 50% · 30 s 75% · 40 s 100%' },
    theoretical_qualified: '"40 วินาที = ค่าทางทฤษฎี" + "ใช้งานจริงอาจใช้เวลามากกว่านี้"',
    pass: info.checks.every(c => c.pass) && leak.length === 0,
  };
  fs.writeFileSync(path.join(QC, 'math_validation.json'), JSON.stringify(math, null, 1));
  const phones = [[375, 812], [390, 844], [430, 932]].map(([w, hh]) => {
    const s = hh / 1920, vis = w / s; const x0 = (1080 - vis) / 2;   // fill-height crop (worst case)
    return { phone: `${w}x${hh}`, mode: 'fill-height (centre crop)', visible_x: [Math.round(x0), Math.round(1080 - x0)], safe_zone_inside: x0 <= SAFE.x0, b_glyph_px_on_phone_min: +(84 * s).toFixed(1) };
  });
  fs.writeFileSync(path.join(QC, 'safe_zone_report.json'), JSON.stringify({ safe_zone: SAFE, sampled_every_frames: 10, frames_sampled: Math.ceil(N / 10), samples_with_text_outside: Object.keys(viol).length, violations: viol, phones }, null, 1));
  fs.writeFileSync(path.join(QC, 'reveal_check.json'), JSON.stringify({ CDF, CDN, countdown_seconds: CDN / fps, digit_frames: digits, leak_frames: leak, reveal_time: REVEAL }, null, 1));
  console.log('math pass', math.pass, 'leaks', leak.length, 'digits', JSON.stringify(digits), 'safe-zone samples with issues', Object.keys(viol).length);
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
