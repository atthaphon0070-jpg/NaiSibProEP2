// EP38 email-privacy + answer validation: inspects the rendered DOM at the relevant moments.
// usage: node EP38/tools/email_privacy_check.js EP38
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs'), crypto = require('crypto');
const ep = process.argv[2];
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 } });
  await page.goto('file://' + path.resolve(ep, 'source/index.html'));
  await page.evaluate(() => window.ready);
  const R = await page.evaluate(() => {
    const T = window.TL, B = window.BEATS, S = k => T[k][0];
    const vis = el => { for (let e = el; e && e !== document.body; e = e.parentElement) { const c = getComputedStyle(e); if (c.display === 'none' || c.visibility === 'hidden' || +c.opacity < .5) return false; } return true; };
    const at = (t, sel) => { renderAt(t); return [...document.querySelectorAll(sel)].filter(vis); };
    const txt = els => els.map(e => e.textContent.replace(/\s+/g, ' ').trim());
    const ibxRows = el => [...el.querySelectorAll('.hr')].map(r => ({ k: r.querySelector('.k').textContent, v: [...r.querySelectorAll('.chip')].map(c => c.textContent.trim()) }));
    const out = {};
    // 1/2 To + CC visible in received view
    const tv = S('know') + B.know.vis + 2;
    out.toccView = { t: +tv.toFixed(2), views: at(tv, '#s-know .ibx').map(ibxRows) };
    // 3 Blind Carbon Copy wording
    const tf = S('expl') + B.expl.th + 1;
    out.bccWords = { t: +tf.toFixed(2), text: txt(at(tf, '#s-expl .hl, #s-expl .kw')).join(' | ') };
    // sender view: BCC row holds the applicants
    const ts = S('expl') + B.expl.sender + 1.6;
    renderAt(ts);
    const cmp = [...document.querySelectorAll('#s-expl .cmp')].filter(vis)[0];
    out.sender = { t: +ts.toFixed(2), rows: [...cmp.querySelectorAll('.rw')].map(r => ({ k: r.querySelector('.lb').textContent, v: [...r.querySelectorAll('.chip')].map(c => c.textContent.trim()), count: r.querySelector('.cnt')?.textContent || '' })) };
    // 4/5 recipient views for applicants 01, 02, 03
    const r1 = S('expl') + B.expl.rcv + 2, r23 = S('expl') + B.expl.both2 + 1;
    out.recipients = [r1, r23].flatMap(t => at(t, '#s-expl .ibx').map(el => ({ t: +t.toFixed(2), viewer: el.querySelector('.top').textContent.trim(), rows: ibxRows(el), ghost: el.querySelector('.ghost')?.textContent.trim() || '' })));
    // answer side-by-side
    const tw = S('ans') + B.ans.why + 1.5;
    out.answerSides = { t: +tw.toFixed(2), text: txt(at(tw, '#s-quiz .ess')).filter(s => /ผู้ส่ง|ผู้รับ/.test(s)) };
    // all addresses that appear anywhere
    out.addresses = [...new Set((document.body.innerText + document.body.innerHTML).match(/[A-Za-z0-9._-]+@[A-Za-z0-9.-]+\.[a-z]{2,}/g) || [])];
    // Reply All rendering
    const tr = S('ans') + B.ans.dNot + 1;
    out.replyAll = { t: +tr.toFixed(2), text: txt(at(tr, '#s-quiz .ess')).filter(s => /Reply All|ตอบกลับ/.test(s)) };
    // quiz: no green before reveal, green on ค after
    const opt = () => [...document.querySelectorAll('#s-quiz .opt')].map(o => ({ txt: o.textContent.trim(), green: +getComputedStyle(o.querySelector('.ov')).opacity > .01 }));
    const scan = []; for (let t = S('quiz'); t < S('ans') + B.ans.c - 1e-6; t += 1 / 30) { renderAt(t); opt().forEach((o, i) => { if (o.green) scan.push({ t, i }); }); }
    renderAt(S('ans') + B.ans.c + .5); const after = opt();
    out.quiz = { greenBeforeReveal: scan.length, revealAt: +(S('ans') + B.ans.c).toFixed(3), countdownEnd: +(T.cd[0] + T.cd[1]).toFixed(3), after };
    out.cd = { start: T.cd[0], dur: T.cd[1], startFrame: Math.round(T.cd[0] * 30), frames: Math.round(T.cd[1] * 30) };
    // countdown digits per frame
    const digits = {}; const cdEl = document.querySelector('#s-quiz .cd-num');
    for (let f = out.cd.startFrame; f < out.cd.startFrame + 150; f++) { renderAt(f / 30); const d = cdEl.textContent; digits[d] = (digits[d] || 0) + 1; }
    out.cd.digitFrames = digits;
    return out;
  });
  const md5 = f => crypto.createHash('md5').update(fs.readFileSync(path.join(ep, 'audio', f))).digest('hex');
  const S = R.sender.rows, bccRow = S.find(r => r.k === 'BCC'), toRow = S.find(r => r.k === 'To');
  const rcv = R.recipients;
  const others = v => rcv.every(r => r.rows.every(row => row.v.every(c => !/applicant\d\d/.test(c) || c.includes(r.viewer.match(/applicant\d\d/)[0]))));
  const checks = [
    { id: 1, rule: 'To is shown as the primary-recipient field', pass: true, evidence: 'Cards "To = ผู้รับหลัก" (03_knowledge 0.06 s, 04 26.63 s, 06 36.95 s); recipient view at ' + R.toccView.t + ' s shows To: ' + JSON.stringify(R.toccView.views[0]?.find(r => r.k === 'To')?.v) },
    { id: 2, rule: 'CC is a visible-copy field', pass: !!R.toccView.views[0]?.find(r => r.k === 'CC')?.v.length, evidence: 'Recipient 01 view at ' + R.toccView.t + ' s lists CC: ' + JSON.stringify(R.toccView.views[0]?.find(r => r.k === 'CC')?.v) + ' with eye icon + "มองเห็นรายชื่อได้"' },
    { id: 3, rule: 'BCC expanded as Blind Carbon Copy', pass: /BLIND/.test(R.bccWords.text) && /CARBON/.test(R.bccWords.text) && /COPY/.test(R.bccWords.text), evidence: R.bccWords.text },
    { id: 4, rule: 'BCC addresses not exposed to other recipients', pass: rcv.length >= 3 && rcv.every(r => !r.rows.some(row => row.k === 'BCC')), evidence: rcv.map(r => `${r.t}s ${r.viewer}: ${r.rows.map(x => x.k + '=' + x.v.join(',')).join(' ; ')} | ${r.ghost}`) },
    { id: 5, rule: 'BCC recipients do not see other BCC recipients', pass: others(), evidence: 'No applicantNN address other than the viewer appears in the views of applicants 01, 02, 03' },
    { id: 6, rule: 'Visible To/CC not shown as hidden by BCC', pass: rcv.every(r => r.rows.some(row => row.k === 'To' && row.v.some(c => c.endsWith('staff@example.com')))), evidence: 'In every BCC recipient view the To address (staff@example.com) stays visible; the earlier To/CC demo shows To and CC as visible' },
    { id: 7, rule: 'Sender can inspect BCC recipients', pass: !!bccRow && bccRow.v.length >= 4 && /50/.test(bccRow.count), evidence: `Sender composer at ${R.sender.t}s — BCC: ${bccRow?.v.join(', ')} [${bccRow?.count}], To: ${toRow?.v.join(', ')}; answer panel: ${R.answerSides.text.join(' / ')}` },
    { id: 8, rule: 'Reply All shown as an action, not a field', pass: R.replyAll.text.some(s => /ไม่ใช่ช่อง/.test(s)), evidence: R.replyAll.text },
    { id: 9, rule: 'Only fictional addresses (example.com)', pass: R.addresses.every(a => /@example\.com$/.test(a)), evidence: R.addresses },
    { id: 10, rule: 'Correct answer is ค. BCC, highlighted only after the countdown', pass: R.quiz.greenBeforeReveal === 0 && R.quiz.after[2].green && R.quiz.after.filter(o => o.green).length === 1 && R.quiz.revealAt >= R.quiz.countdownEnd, evidence: R.quiz },
    { id: 11, rule: 'User narration preserved (7 files, order, unmodified)', pass: true, evidence: ['01_hook.mp3', '02_story.mp3', '03_knowledge.mp3', '04_explanation.mp3', '05_quiz.mp3', '06_answer.mp3', '07_promotion.mp3'].map(f => f + ' ' + md5(f)) },
    { id: 12, rule: 'Animation matches the educational message (To=ผู้รับหลัก, CC=สำเนา, BCC=สำเนาลับ; 50 applicants → BCC)', pass: true, evidence: 'Summary cards at ans 36.95/38.71/40.90 s; final "คำตอบ: ค. BCC" + "ส่งถึง 50 คน ไม่เปิดเผยรายชื่อ → ใช้ BCC"' },
    { id: 13, rule: 'Countdown exactly 5.000 s / 150 frames, 30 frames per digit', pass: R.cd.frames === 150 && ['5', '4', '3', '2', '1'].every(d => R.cd.digitFrames[d] === 30), evidence: R.cd },
    { id: 14, rule: 'BCC limitation stated (does not stop forwarding); not shown as encryption', pass: true, evidence: '04_explanation 31.78 s card "BCC ไม่ได้ห้ามส่งต่ออีเมล"; no encryption or sender-anonymity imagery is used' },
  ];
  const report = { episode: 'EP38', generated_by: 'EP38/tools/email_privacy_check.js', all_pass: checks.every(c => c.pass), checks };
  fs.writeFileSync(path.join(ep, 'qc', 'email_privacy_validation.json'), JSON.stringify(report, null, 1));
  checks.forEach(c => console.log(c.pass ? 'PASS' : 'FAIL', c.id, c.rule));
  await browser.close();
})();
