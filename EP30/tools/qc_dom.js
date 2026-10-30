// EP30 DOM-level QC on the same page the renderer captures. usage: node EP30/tools/qc_dom.js
// Writes EP30/qc/dom_checks.txt and EP30/qc/probability_validation.json:
//  - frame 0 keyword, exact quiz text + choices, countdown digits per frame, no early answer hint, identical option styling
//  - ball states: balls counted from the DOM (data-loc="in", visible) at every narrated state, against states A/B/C
//  - every frame: each visible count bar equals the balls actually inside its box (a removed ball is never counted)
//  - every fraction marked data-check="box:R/T": at the frame it is first fully built, numerator = red inside, denominator = total inside
//  - the arithmetic of every equation shown, the 30 % ring and the 3-of-10 cells
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
(async () => {
  const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const p = await b.newPage({ viewport: { width: 1080, height: 1920 } });
  p.on('pageerror', e => { console.error('PAGEERR', e.message); process.exitCode = 2; });
  await p.goto('file://' + path.resolve(__dirname, '../source/index.html')); await p.evaluate(() => window.ready);
  const r = await p.evaluate(() => {
    const out = [], fps = TL.fps, S = k => TL[k][0], Bt = (k, n) => S(k) + BEATS[k][n][0];
    const eff = el => { let v = 1; for (let e = el; e && e !== document.body; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden') return 0; v *= +cs.opacity; } return v; };
    const boxes = () => [...document.querySelectorAll('.pgrp')].filter(g => eff(g) > .5).map(g => {
      const bs = [...g.querySelectorAll('.pball')].filter(x => eff(x) > .5);
      const inn = bs.filter(x => x.dataset.loc === 'in' || x.dataset.loc === 'lift'), outB = bs.filter(x => x.dataset.loc === 'out');
      const cnt = [...g.parentElement.children].find(c => c.classList && c.classList.contains('pcount'));
      return { g, R: inn.filter(x => x.dataset.color === 'red').length, B: inn.filter(x => x.dataset.color === 'blue').length, T: inn.length, inIds: inn.map(x => x.dataset.id), outIds: outB.map(x => x.dataset.id), colors: bs.map(x => x.dataset.id[0] + ':' + x.dataset.color),
        bar: cnt && eff(cnt) > .5 ? ['.pc-r', '.pc-b', '.pc-t'].map(c => +cnt.querySelector(c + ' .v').textContent) : null };
    });
    const V = { states: [], fractions: [], equations: [], count_bar_frames_checked: 0, count_bar_mismatches: [], color_identity_errors: 0 };
    // 1) frame 0
    renderAt(0);
    const kw = [...document.querySelectorAll('#s1 .hd')].find(e => e.textContent.trim() === 'เตรียมสอบนายสิบ');
    const kr = kw.getBoundingClientRect();
    out.push(`frame 0: "${kw.textContent.trim()}" effective opacity ${eff(kw).toFixed(2)}, box [${[kr.left, kr.top, kr.right, kr.bottom].map(x => x.toFixed(0)).join(', ')}] (zone 220–860 × 350–1430), font ${getComputedStyle(kw).fontSize}`);
    const b0 = boxes(); out.push(`frame 0 box: ${b0.map(x => `red ${x.R}, blue ${x.B}, total ${x.T}`).join(' | ')}`);
    // 2) named states
    const ST = [
      ['A', 'hook frame 0', 0], ['A', 'hook: red 3 / blue 2 / total 5', Bt('hook', 'draw') - .2], ['B', 'hook: 5 → 4', Bt('hook', 'count') + 1],
      ['A', 'story: five balls in the box', Bt('story', 'five5') + 1], ['A', 'story: 3/5 built', Bt('story', 'of5') + .6], ['B', 'story: after the first draw', Bt('story', 'change') + 1],
      ['B', 'knowledge: ball not returned', Bt('know', 'noret') + .5], ['A', 'knowledge: fresh start', Bt('know', 'of5') + .5], ['A', 'knowledge: 3/5', Bt('know', 'f35') + .6],
      ['B', 'knowledge: 4 left', Bt('know', 'left4') + 1], ['B', 'knowledge: 2/4', Bt('know', 'f24') + .7],
      ['A', 'explanation: 3/5', Bt('expl', 'f35') + .7], ['B', 'explanation: 2/4', Bt('expl', 'f24') + .5], ['C', 'explanation: second red drawn', Bt('expl', 'so') - .15],
      ['A', 'quiz: box reset to the problem state', Bt('quiz', 'q2') + 1], ['A', 'countdown', S('cd') + 2.5],
      ['A', 'answer: 3/5', Bt('ans', 'f35') + .6], ['B', 'answer: 4 left, 2 red', Bt('ans', 'red2') + 1], ['B', 'answer: 2/4', Bt('ans', 'f24') + .6], ['B', 'memory summary', Bt('ans', 'dont')],
    ];
    const EXP = { A: [3, 2, 5], B: [2, 2, 4], C: [1, 2, 3] };
    for (const [k, name, t] of ST) {
      renderAt(t); const bx = boxes();
      const ok = bx.length === 1 && bx[0].R === EXP[k][0] && bx[0].B === EXP[k][1] && bx[0].T === EXP[k][2] && (!bx[0].bar || bx[0].bar.join() === [bx[0].R, bx[0].B, bx[0].T].join());
      V.states.push({ state: k, moment: name, t: +t.toFixed(3), frame: Math.round(t * fps), visible_boxes: bx.length, red_inside: bx[0]?.R, blue_inside: bx[0]?.B, total_inside: bx[0]?.T, removed_outside: bx[0]?.outIds, count_bar: bx[0]?.bar, expected: EXP[k], pass: ok });
    }
    // 3) every frame: count bar = balls inside; colours never change; data-check fractions at first full build
    const seen = new Map(), N = Math.ceil(TL.end * fps);
    for (let f = 0; f < N; f++) {
      const t = f / fps; renderAt(t);
      for (const x of boxes()) {
        if (x.colors.some(c => (c[0] === 'R') !== c.endsWith('red'))) V.color_identity_errors++;
        if (x.bar) { V.count_bar_frames_checked++; if (x.bar.join() !== [x.R, x.B, x.T].join()) V.count_bar_mismatches.push({ t: +t.toFixed(3), bar: x.bar, inside: [x.R, x.B, x.T] }); }
      }
      for (const fr of document.querySelectorAll('[data-check]')) {
        if (seen.has(fr)) continue;
        const sc = fr.closest('.scene'); if (!sc || sc.style.display === 'none') continue;
        if (eff(fr.querySelector('.fd')) > .9 && eff(fr.querySelector('.fn')) > .9) {
          const bx = boxes().filter(x => x.g.closest('.scene') === sc);
          const n = +fr.dataset.n, d = +fr.dataset.d, b0 = bx[0];
          seen.set(fr, 1);
          V.fractions.push({ fraction: `${n}/${d}`, t: +t.toFixed(3), frame: f, box_red_inside: b0?.R, box_total_inside: b0?.T, pass: !!b0 && b0.R === n && b0.T === d });
        }
      }
    }
    V.fractions_marked = document.querySelectorAll('[data-check]').length;
    // 4) arithmetic
    const g = (a, b) => b ? g(b, a % b) : a, F = (n, d) => [n, d];
    const mul = (a, b) => [a[0] * b[0], a[1] * b[1]], red = a => [a[0] / g(a[0], a[1]), a[1] / g(a[0], a[1])], eq = (a, b) => a[0] * b[1] === a[1] * b[0];
    V.equations.push({ claim: 'P(first red) = 3/5', pass: eq(F(3, 5), F(3, 5)) });
    V.equations.push({ claim: 'P(second red | first red) = 2/4 (2 red of 4 left)', pass: eq(F(2, 4), F(3 - 1, 5 - 1)) });
    V.equations.push({ claim: '3/5 × 2/4 = 6/20', pass: mul(F(3, 5), F(2, 4)).join() === '6,20' });
    V.equations.push({ claim: '6/20 = 3/10 (÷2)', pass: red(F(6, 20)).join() === '3,10' });
    V.equations.push({ claim: '3/10 = 30%', pass: 3 / 10 * 100 === 30 });
    V.equations.push({ claim: 'distractor ก 9/25 = 3/5 × 3/5 (with replacement, shown as wrong)', pass: mul(F(3, 5), F(3, 5)).join() === '9,25' });
    V.equations.push({ claim: 'distractor ค 3/5 = first draw only', pass: true });
    V.equations.push({ claim: 'distractor ง 1/2 = 2/4 = second draw given first red (shown as not the answer, not as a bad simplification)', pass: eq(F(1, 2), F(2, 4)) });
    renderAt(Bt('expl', 'p30') + 2.5);
    const ring = [...document.querySelectorAll('[data-pct]')][0], cellsEl = [...document.querySelectorAll('[data-filled]')][0];
    V.equations.push({ claim: 'percentage ring stops at 30 %', value: ring && ring.dataset.pct, pass: ring && ring.dataset.pct === '30.0' });
    V.equations.push({ claim: '10-cell bar: 3 of 10 filled', value: cellsEl && +cellsEl.dataset.filled, pass: cellsEl && +cellsEl.dataset.filled === 3 });
    // 5) quiz text + choices
    const qJoined = [...document.querySelectorAll('.qln')].map(e => e.textContent).join('');
    const APPROVED = 'กล่องใบหนึ่งมีลูกบอลสีแดง 3 ลูก และสีน้ำเงิน 2 ลูก สุ่มหยิบลูกบอลทีละลูก 2 ครั้งโดยไม่ใส่คืน ความน่าจะเป็นที่จะได้ลูกบอลสีแดงทั้งสองครั้งเท่ากับเท่าใด?';
    out.push(`question lines: ${[...document.querySelectorAll('.qln')].map(e => '“' + e.textContent + '”').join(' / ')}`);
    out.push(`question matches approved text (ignoring line breaks/spaces): ${qJoined.replace(/\s/g, '') === APPROVED.replace(/\s/g, '')}`);
    const opts = [...document.querySelectorAll('.qo')].map(o => o.querySelector('.b').textContent + '. ' + o.querySelector('.frac').dataset.n + '/' + o.querySelector('.frac').dataset.d);
    out.push('choices: ' + opts.join(' | ') + ` → exact: ${JSON.stringify(opts) === JSON.stringify(['ก. 9/25', 'ข. 3/10', 'ค. 3/5', 'ง. 1/2'])}`);
    // 6) countdown
    const cd0 = Math.round(S('cd') * fps), seq = [];
    out.push(`countdown start ${S('cd').toFixed(4)} s × ${fps} = frame ${(S('cd') * fps).toFixed(4)}; quiz audio ends ${(S('quiz') + TL.quiz[1]).toFixed(4)} s; answer audio starts ${S('ans').toFixed(4)} s = frame ${(S('ans') * fps).toFixed(4)}`);
    for (let f = cd0 - 2; f < cd0 + 152; f++) { renderAt(f / fps); const el = document.querySelector('.cd-n'); const n = eff(el) > .5 ? el.textContent : '–'; if (!seq.length || seq[seq.length - 1][0] !== n) seq.push([n, 0, f]); seq[seq.length - 1][1]++; }
    out.push('countdown digits by frame: ' + seq.map(([n, c, f]) => `${n}×${c} (from ${f})`).join(' → '));
    // 7) no hint before the reveal; identical styling
    const REV = Bt('ans', 'kb'); let early = 0, diff = 0, nf = 0;
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
    out.push(`reveal at ${REV.toFixed(3)} s (“ข้อ ข.” in 06_answer, frame ${Math.round(REV * fps)}): ข (${ob.dataset.opt}) overlay opacity ${(+getComputedStyle(ob.querySelector('.ov')).opacity).toFixed(2)}, check ${(+getComputedStyle(ob.querySelector('.mk')).opacity).toFixed(2)}; other choices opacity ${[0, 2, 3].map(i => eff(document.querySelectorAll('.qo')[i]).toFixed(2)).join(', ')}`);
    V.correct_option = ob.dataset.opt; V.quiz_reset_to_initial_state = V.states.filter(s => s.moment.startsWith('quiz') || s.moment === 'countdown').every(s => s.pass);
    V.no_answer_hint_before_reveal = early === 0 && diff === 0;
    V.all_pass = V.states.every(s => s.pass) && V.fractions.every(f => f.pass) && V.fractions.length === V.fractions_marked && V.equations.every(e => e.pass) && !V.count_bar_mismatches.length && !V.color_identity_errors && V.correct_option === 'ข. 3/10';
    out.push(`probability: ${V.states.filter(s => s.pass).length}/${V.states.length} ball states pass; ${V.fractions.filter(f => f.pass).length}/${V.fractions_marked} box-built fractions match the box; ${V.equations.filter(e => e.pass).length}/${V.equations.length} equations; count bar checked on ${V.count_bar_frames_checked} frames, mismatches ${V.count_bar_mismatches.length}; colour identity errors ${V.color_identity_errors}; ALL PASS = ${V.all_pass}`);
    return { out, V };
  });
  const Q = path.resolve(__dirname, '../qc');
  fs.writeFileSync(path.join(Q, 'dom_checks.txt'), r.out.join('\n') + '\n');
  fs.writeFileSync(path.join(Q, 'probability_validation.json'), JSON.stringify({ problem: 'Box: 3 red + 2 blue. Two draws without replacement. P(both red)?', expected_states: { A_initial: { red: 3, blue: 2, total: 5 }, B_first_red_removed: { red: 2, blue: 2, total: 4 }, C_second_red_removed: { red: 1, blue: 2, total: 3 } }, ...r.V }, null, 1));
  console.log(r.out.join('\n'));
  await b.close();
})().catch(e => { console.error(e); process.exit(1); });
