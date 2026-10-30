// EP.33 math model — single source of truth for every number shown on screen.
// Loaded by index.html (window.MATH) and by qc/validate.js (module.exports) to write qc/math_validation.json.
(function (root) {
  const GIVEN = { total: 360, computer: 230, law: 190, neither: 50 };
  const atLeastOne = GIVEN.total - GIVEN.neither;                 // 310
  const both = GIVEN.computer + GIVEN.law - atLeastOne;           // 110
  const computerOnly = GIVEN.computer - both;                     // 120
  const lawOnly = GIVEN.law - both;                               // 80
  const naiveSum = GIVEN.computer + GIVEN.law;                    // 420
  const trap = naiveSum - GIVEN.total;                            // 60 (forgets the 50 outside)
  const OPTIONS = [['ก', 60], ['ข', 90], ['ค', 110], ['ง', 160]];
  const correctIndex = OPTIONS.findIndex(o => o[1] === both);
  const trapIndex = OPTIONS.findIndex(o => o[1] === trap);
  const DOT = 10;                                                 // 1 dot = 10 people in the Venn diagram
  const M = {
    GIVEN, atLeastOne, both, computerOnly, lawOnly, naiveSum, trap, OPTIONS, correctIndex, trapIndex, DOT,
    regions: { computerOnly, both, lawOnly, neither: GIVEN.neither },
    dots: { computerOnly: computerOnly / DOT, both: both / DOT, lawOnly: lawOnly / DOT, neither: GIVEN.neither / DOT },
  };
  M.checks = function () {
    const r = M.regions, c = [];
    const ck = (name, got, want) => c.push({ name, got, want, pass: got === want });
    ck('at least one = total - neither', atLeastOne, 310);
    ck('both = computer + law - atLeastOne', both, 110);
    ck('computer only = computer - both', computerOnly, 120);
    ck('law only = law - both', lawOnly, 80);
    ck('regions sum to total (120+110+80+50)', r.computerOnly + r.both + r.lawOnly + r.neither, GIVEN.total);
    ck('union regions sum to atLeastOne (120+110+80)', r.computerOnly + r.both + r.lawOnly, atLeastOne);
    ck('computer circle = computerOnly + both', r.computerOnly + r.both, GIVEN.computer);
    ck('law circle = lawOnly + both', r.lawOnly + r.both, GIVEN.law);
    ck('outside both circles', r.neither, 50);
    ck('naive sum 230 + 190', naiveSum, 420);
    ck('420 - 310 = both', naiveSum - atLeastOne, both);
    ck('trap answer 230 + 190 - 360', trap, 60);
    ck('correct option letter', OPTIONS[correctIndex][0], 'ค');
    ck('correct option value', OPTIONS[correctIndex][1], 110);
    ck('trap option is ก. 60 (marked as common mistake)', OPTIONS[trapIndex]?.[0], 'ก');
    ck('exactly one option equals the answer', OPTIONS.filter(o => o[1] === both).length, 1);
    const d = M.dots; ck('dot counts are whole (1 dot = 10 people)', [d.computerOnly, d.both, d.lawOnly, d.neither].every(Number.isInteger), true);
    ck('dot total = total / 10', d.computerOnly + d.both + d.lawOnly + d.neither, GIVEN.total / DOT);
    return c;
  };
  if (typeof module !== 'undefined') module.exports = M; else root.MATH = M;
})(typeof window !== 'undefined' ? window : globalThis);
