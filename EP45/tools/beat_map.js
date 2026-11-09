// Writes EP45/qc/beat_map.md from source/beats.js + renders/timeline.json.  usage: node EP45/tools/beat_map.js
const fs = require('fs'), path = require('path');
const ep = path.resolve(__dirname, '..');
global.window = {}; require(path.join(ep, 'source/beats.js')); const B = window.BEATS;
const TL = JSON.parse(fs.readFileSync(path.join(ep, 'renders/timeline.json')));
const src = fs.readFileSync(path.join(ep, 'source/beats.js'), 'utf8');
const SEG = {
  hook: ['01_hook.mp3', 'SCENE 01 — Missing-student mystery (cover, classroom, dashboard, departure, question)'],
  story: ['02_story.mp3', 'SCENE 02 — Classroom story (rewind, exam, teacher, departure, higher-than-average indicator)'],
  know: ['03_knowledge.mp3', 'SCENE 03 — Understanding the mean (formula, reverse formula, missing-score principle)'],
  expl: ['04_explanation.mp3', 'SCENE 04 — Method, unevaluated (12 × 70 = ?, 11 × 68 = ?, (12 × 70) − (11 × 68) = ?)'],
  quiz: ['05_quiz.mp3', 'SCENE 05 — Official quiz (question + 4 neutral choices + hint)'],
  ans: ['06_answer.mp3', 'SCENE 07 — Answer reveal (ค. 92, 840, 748, 840 − 748 = 92, check, memory rule)'],
  promo: ['07_promotion.mp3', 'SCENE 08 — NaiSibPro promotion'],
};
const fr = s => Math.round(s * TL.fps);
let o = '# EP.45 beat map (audio-first)\n\nEvery cue is a phrase start measured in the original recording (pause detection at −38 dBFS; words identified by an offline Whisper-small Thai pass on each phrase). Absolute time = segment start + local cue; frame = round(abs × 30).\n\n';
for (const k of ['hook', 'story', 'know', 'expl', 'quiz', 'cd', 'ans', 'promo']) {
  if (k === 'cd') {
    const s = fr(TL.cd[0]) / TL.fps;
    o += `## SCENE 06 — Countdown (no narration)\n\nStart ${s.toFixed(3)} s (frame ${fr(s)}) → end ${(s + 5).toFixed(3)} s (frame ${fr(s) + 150}, exclusive). 5 → 4 → 3 → 2 → 1, 30 frames each, tick on every second, navy background, options neutral, no totals. The answer audio starts on frame ${fr(TL.ans[0])}.\n\n`;
    continue;
  }
  const [file, title] = SEG[k], s0 = TL[k][0];
  o += `## ${title}\n\n\`${file}\` — start ${s0.toFixed(3)} s, duration ${TL[k][1].toFixed(3)} s\n\n| cue | local s | abs s | frame | phrase |\n|---|---:|---:|---:|---|\n`;
  const block = src.split(`  ${k}: {`)[1].split('\n  },')[0];
  for (const [c, v] of Object.entries(B[k])) {
    const line = block.split('\n').find(l => new RegExp(`\\b${c}:`).test(l)) || '';
    const cm = line.includes('//') ? line.split('//').pop().trim() : '';
    o += `| ${c} | ${v.toFixed(2)} | ${(s0 + v).toFixed(2)} | ${fr(s0 + v)} | ${cm} |\n`;
  }
  o += '\n';
}
o += `Wipe transitions centred on: ${['story', 'know', 'expl', 'quiz', 'promo'].map(k => TL[k][0].toFixed(3) + ' s').join(', ')}\n`;
fs.writeFileSync(path.join(ep, 'qc/beat_map.md'), o);
console.log('wrote qc/beat_map.md');
