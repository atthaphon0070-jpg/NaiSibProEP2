// NaiSibPro EP.45 — single source of truth for every number shown on screen.
// Loaded by the page (window.MATH) and by Node QC (require).  Every on-screen formula is built from these values,
// so a typo in a scene cannot silently show a wrong calculation.
(function (root) {
  const n1 = 12, avg1 = 70;          // original group
  const left = 1;                    // students who left
  const n2 = n1 - left, avg2 = 68;   // remaining group
  const total1 = n1 * avg1;          // 840
  const total2 = n2 * avg2;          // 748
  const missing = total1 - total2;   // 92
  const choices = [['ก', 88], ['ข', 90], ['ค', 92], ['ง', 96]];
  const correctIndex = choices.findIndex(c => c[1] === missing);

  const checks = [
    ['Initial student count = 12', n1 === 12],
    ['Initial average = 70', avg1 === 70],
    ['Original total = 840 (12 × 70)', total1 === 840],
    ['Departing student count = 1', left === 1],
    ['Remaining student count = 11', n2 === 11],
    ['Remaining average = 68', avg2 === 68],
    ['Remaining total = 748 (11 × 68)', total2 === 748],
    ['Difference = 92 (840 − 748)', missing === 92],
    ['Correct answer = option ค', correctIndex === 2 && choices[correctIndex][0] === 'ค'],
    ['Reverse check 748 + 92 = 840', total2 + missing === total1],
    ['Reverse check 840 ÷ 12 = 70', total1 / n1 === avg1],
    ['Exactly one choice equals the answer', choices.filter(c => c[1] === missing).length === 1],
    ['Naive trap 70 − 68 = 2 is not the answer', avg1 - avg2 !== missing],
  ];
  const ok = checks.every(c => c[1]);
  const fmt = n => String(n);
  const MATH = {
    n1, avg1, left, n2, avg2, total1, total2, missing, choices, correctIndex, checks, ok,
    // display strings (Unicode minus/times/divide)
    f1: `${n1} × ${avg1}`, f2: `${n2} × ${avg2}`,
    eq1: `${n1} × ${avg1} = ${total1}`, eq2: `${n2} × ${avg2} = ${total2}`,
    sub: `${total1} − ${total2}`, eqSub: `${total1} − ${total2} = ${missing}`,
    unevaluated: `(${n1} × ${avg1}) − (${n2} × ${avg2}) = ?`,
    verify1: `${total2} + ${missing} = ${total1}`, verify2: `${total1} ÷ ${n1} = ${avg1}`,
    fmt,
    // numbers that must never be visible before the countdown has finished
    spoilers: [String(total1), String(total2)],
  };
  if (!ok && typeof console !== 'undefined') console.error('EP45 MATH CHECK FAILED', checks.filter(c => !c[1]));
  if (typeof module !== 'undefined' && module.exports) module.exports = MATH; else root.MATH = MATH;
})(typeof window !== 'undefined' ? window : globalThis);
