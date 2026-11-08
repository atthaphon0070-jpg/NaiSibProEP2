// EP.41 math QC: re-derives every value independently and checks it against source/math_logic.js (what the video shows).
const fs = require('fs'), path = require('path');
const ep = process.argv[2] || '.';
const M = require(path.resolve(ep, 'source/math_logic.js'));
const chk = (name, got, want) => ({ check: name, value: got, expected: want, pass: Math.abs(got - want) < 1e-9 || got === want });
const checks = [
  chk('pole time (s)', M.poleTime, 8), chk('bridge time (s)', M.bridgeTime, 18), chk('bridge length (m)', M.bridgeLen, 200),
  chk('extra time 18 − 8 (s)', M.extraTime, 10), chk('speed 200 ÷ 10 (m/s)', M.speed, 20), chk('train length 20 × 8 (m)', M.trainLen, 160),
  chk('bridge distance 160 + 200 (m)', M.bridgeDist, 360), chk('reverse check 360 ÷ 20 (s)', M.checkTime, 18),
  chk('reverse check equals bridge time', M.checkTime === M.bridgeTime, true),
  chk('correct option letter', M.correctLetter, 'ค'), chk('correct option value (m)', M.options[M.correctIndex][1], 160),
  chk('exactly one option equals the answer', M.options.filter(o => o[1] === M.trainLen).length, 1),
];
// distractors: what each wrong option corresponds to (documentation only)
const distractors = { 'ก. 120': 'not derivable from the givens (trap value)', 'ข. 144': '8 × 18 (multiplying the two times)', 'ง. 200': 'bridge length — the classic misread of the question' };
const rep = { givens: { poleTime: 8, bridgeTime: 18, bridgeLen: 200 }, derivation: ['18 − 8 = 10 s', '200 ÷ 10 = 20 m/s', '20 × 8 = 160 m', '160 + 200 = 360 m', '360 ÷ 20 = 18 s ✓'],
  checks, distractors, answer: `${M.correctLetter}. ${M.trainLen} เมตร`, pass: checks.every(c => c.pass) };
fs.writeFileSync(path.resolve(ep, 'qc/math_validation.json'), JSON.stringify(rep, null, 1));
console.log(rep.pass ? 'MATH PASS' : 'MATH FAIL', checks.filter(c => !c.pass));
