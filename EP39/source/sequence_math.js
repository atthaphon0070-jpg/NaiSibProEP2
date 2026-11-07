// EP.39 — interleaved number sequence: the single source of truth for every value shown on screen.
// Loaded by the page (window.SeqMath) and by tools/validate_math.js (module.exports).
(function (root) {
  const SEQ = [10, 18, 15, 27, 21, 38, 28, 51, 36];          // positions 1..9, position 10 is asked
  const CHOICES = [['ก', 62], ['ข', 64], ['ค', 66], ['ง', 68]];
  const diffs = a => a.slice(1).map((v, i) => v - a[i]);
  function analyse(seq = SEQ) {
    const odd = seq.filter((_, i) => i % 2 === 0);              // positions 1,3,5,7,9
    const even = seq.filter((_, i) => i % 2 === 1);             // positions 2,4,6,8
    const oddD = diffs(odd), evenD = diffs(even);
    const oddStep = diffs(oddD), evenStep = diffs(evenD);
    const constant = a => a.every(x => x === a[0]);
    const askedPosition = seq.length + 1;                        // 10
    const askedParity = askedPosition % 2 === 0 ? 'even' : 'odd';
    // the asked term continues the sequence its position belongs to
    const src = askedParity === 'even' ? { vals: even, d: evenD, step: evenStep } : { vals: odd, d: oddD, step: oddStep };
    const nextDiff = src.d[src.d.length - 1] + src.step[0];
    const next = src.vals[src.vals.length - 1] + nextDiff;
    const correct = CHOICES.find(c => c[1] === next);
    return {
      sequence: seq, adjacentDifferences: diffs(seq),
      odd, oddDifferences: oddD, oddSecondDifferences: oddStep, oddRuleConstantStep: constant(oddStep),
      even, evenDifferences: evenD, evenSecondDifferences: evenStep, evenRuleConstantStep: constant(evenStep),
      askedPosition, askedParity, nextDifference: nextDiff, next,
      choices: CHOICES, correctLetter: correct ? correct[0] : null,
      oddContinuation: odd[odd.length - 1] + oddD[oddD.length - 1] + oddStep[0],   // what a wrong-row calculation would give
    };
  }
  const api = { SEQ, CHOICES, diffs, analyse, A: analyse() };
  if (typeof module !== 'undefined' && module.exports) module.exports = api; else root.SeqMath = api;
})(typeof window !== 'undefined' ? window : globalThis);
