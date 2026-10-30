// EP27 DOM-level QC on the same page the renderer captures: first frame, exact quiz text, countdown frames,
// no early answer hint, identical option styling before the reveal. usage: node EP27/tools/qc_dom.js > EP27/qc/dom_checks.txt
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  await p.goto('file://' + path.resolve(__dirname, '../source/index.html')); await p.evaluate(() => window.ready);
  const r = await p.evaluate(() => {
    const out = [], fps = TL.fps, S = k => TL[k][0];
    const eff = el => { let v = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; v *= +cs.opacity; } return v; };
    // 1) frame 0
    renderAt(0);
    const kw = [...document.querySelectorAll('#s1 .hd')].find(e => e.textContent.trim() === 'เตรียมสอบนายสิบ');
    const kr = kw.getBoundingClientRect();
    out.push(`frame 0: "${kw.textContent.trim()}" effective opacity ${eff(kw).toFixed(2)}, box [${[kr.left, kr.top, kr.right, kr.bottom].map(x => x.toFixed(0)).join(', ')}] (zone 220–860 × 350–1430), font ${getComputedStyle(kw).fontSize}`);
    const vis0 = [...document.querySelectorAll('#s1 .sz')].filter(e => eff(e) > .9).map(e => e.textContent.trim());
    out.push('frame 0 critical text fully visible: ' + vis0.join(' | '));
    // 2) exact quiz text
    const Q = [...document.querySelectorAll('.qln')].map(e => e.textContent).join(' ').replace(/ (?=[ก-๙])/g, m => m).replace(/\s+/g, ' ');
    const APPROVED = 'หากต้องการสร้างจดหมายจำนวนมากใน Microsoft Word โดยใช้เนื้อหาเดียวกัน แต่เปลี่ยนชื่อและที่อยู่ของผู้รับแต่ละคน ควรใช้คำสั่งใด?';
    const qJoined = [...document.querySelectorAll('.qln')].map(e => e.textContent).join('');
    out.push(`question lines: ${[...document.querySelectorAll('.qln')].map(e => '“' + e.textContent + '”').join(' / ')}`);
    out.push(`question matches approved text (ignoring line breaks/spaces): ${qJoined.replace(/\s/g, '') === APPROVED.replace(/\s/g, '')}`);
    const opts = [...document.querySelectorAll('.qo')].map(o => o.querySelector('.b').textContent + '. ' + o.querySelector('.tx').textContent);
    out.push('choices: ' + opts.join(' | ') + ` → exact: ${JSON.stringify(opts) === JSON.stringify(['ก. Track Changes', 'ข. Mail Merge', 'ค. WordArt', 'ง. Find and Replace'])}`);
    // 3) countdown
    const cd0 = Math.round(S('cd') * fps), seq = [];
    out.push(`countdown start ${S('cd').toFixed(4)} s × ${fps} = frame ${(S('cd') * fps).toFixed(4)}; quiz audio ends ${(S('quiz') + TL.quiz[1]).toFixed(4)} s; answer audio starts ${S('ans').toFixed(4)} s = frame ${(S('ans') * fps).toFixed(4)}`);
    for (let f = cd0 - 2; f < cd0 + 152; f++) { renderAt(f / fps); const el = document.querySelector('.cd-n'); const n = eff(el) > .5 ? el.textContent : '–'; if (!seq.length || seq[seq.length - 1][0] !== n) seq.push([n, 0, f]); seq[seq.length - 1][1]++; }
    out.push('countdown digits by frame: ' + seq.map(([n, c, f]) => `${n}×${c} (from ${f})`).join(' → '));
    // 4) no hint before the reveal; identical styling
    const REV = S('ans') + BEATS.ans.kb[0]; let early = 0, diff = 0, nf = 0;
    for (let f = Math.round(S('quiz') * fps); f < Math.round(REV * fps); f++) {
      renderAt(f / fps); nf++;
      const os = [...document.querySelectorAll('.qo')];
      if (os.some(o => +getComputedStyle(o.querySelector('.ov')).opacity > 0 || +getComputedStyle(o.querySelector('.mk')).opacity > 0)) early++;
      const full = os.filter(o => eff(o) > .99);
      const sig = o => { const cs = getComputedStyle(o); return [cs.boxShadow, cs.filter, cs.backgroundImage, getComputedStyle(o.querySelector('.b')).backgroundImage, getComputedStyle(o.querySelector('.tx')).color].join('|'); };
      if (full.length > 1 && new Set(full.map(sig)).size > 1) diff++;
    }
    out.push(`frames from quiz start to the reveal (${nf}): frames with any green overlay/check = ${early}; frames where fully shown choices differ in style = ${diff}`);
    renderAt(REV + .6); const ob = document.querySelectorAll('.qo')[1];
    out.push(`reveal at ${REV.toFixed(3)} s (“ข้อ ข.” in 06_answer, frame ${Math.round(REV * fps)}): ข overlay opacity ${(+getComputedStyle(ob.querySelector('.ov')).opacity).toFixed(2)}, check ${(+getComputedStyle(ob.querySelector('.mk')).opacity).toFixed(2)}; other choices opacity ${[0, 2, 3].map(i => eff(document.querySelectorAll('.qo')[i]).toFixed(2)).join(', ')}`);
    return out;
  });
  console.log(r.join('\n'));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
