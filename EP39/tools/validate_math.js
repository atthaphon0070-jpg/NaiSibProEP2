// usage: node EP39/tools/validate_math.js  -> writes EP39/qc/math_validation.json, exits 1 on any failure
const path = require('path'), fs = require('fs');
const M = require('../source/sequence_math.js');
const A = M.analyse();
const eq = (a, b) => JSON.stringify(a) === JSON.stringify(b);
const checks = [
  ['original sequence', A.sequence, [10, 18, 15, 27, 21, 38, 28, 51, 36]],
  ['odd-position values (1,3,5,7,9)', A.odd, [10, 15, 21, 28, 36]],
  ['odd-position differences', A.oddDifferences, [5, 6, 7, 8]],
  ['odd differences grow by a constant 1', [A.oddRuleConstantStep, A.oddSecondDifferences[0]], [true, 1]],
  ['even-position known values (2,4,6,8)', A.even, [18, 27, 38, 51]],
  ['even-position differences', A.evenDifferences, [9, 11, 13]],
  ['even differences grow by a constant 2', [A.evenRuleConstantStep, A.evenSecondDifferences[0]], [true, 2]],
  ['asked term is position 10 (even position)', [A.askedPosition, A.askedParity], [10, 'even']],
  ['predicted next even-position difference', A.nextDifference, 15],
  ['predicted next value (51 + 15)', A.next, 66],
  ['correct choice letter', A.correctLetter, 'ค'],
  ['choices exactly as specified', A.choices, [['ก', 62], ['ข', 64], ['ค', 66], ['ง', 68]]],
  ['adjacent differences (story scene)', A.adjacentDifferences, [8, -3, 12, -6, 17, -10, 23, -15]],
  ['exactly one choice equals the answer', A.choices.filter(c => c[1] === A.next).length, 1],
  ['wrong-row continuation (odd row, 36+9=45) is not used and is not a choice', [A.oddContinuation, A.choices.some(c => c[1] === A.oddContinuation)], [45, false]],
].map(([name, got, want]) => ({ name, got, expected: want, pass: eq(got, want) }));
const out = { episode: 'EP39', generated: new Date().toISOString(), source: 'EP39/source/sequence_math.js (same module drives every on-screen value)', analysis: A, checks, allPass: checks.every(c => c.pass) };
fs.writeFileSync(path.join(__dirname, '../qc/math_validation.json'), JSON.stringify(out, null, 1));
checks.forEach(c => console.log(c.pass ? 'PASS' : 'FAIL', c.name, JSON.stringify(c.got)));
process.exit(out.allPass ? 0 : 1);
