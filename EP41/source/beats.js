// EP.41 beat map — segment-local seconds, measured from the supplied narration (voiced-phrase onsets,
// -40 dBFS / 20 ms RMS, gaps ≥ 0.18 s). See qc/beat_map.md for the full phrase table.
window.BEATS = {
  hook:  { title: 0.11, math: 1.28, pole: 2.84, poleT: 4.13, bridge: 7.13, ask: 12.23, ask2: 13.51, warn: 15.98, warn2: 16.94, go: 21.17 },
  story: { cruise: 0.04, cruise2: 2.07, pole: 4.32, pole2: 6.61, poleD: 9.02, poleD2: 10.23, bridge: 11.82, bridge2: 13.89, bridge3: 16.38, bridgeD: 20.76, ask: 23.13 },
  know:  { intro: 0.09, intro2: 0.98, ruleA: 2.94, ruleA2: 4.98, ruleB: 9.12, ruleB2: 12.04, wrong: 17.26, wrongX: 19.04, trick: 21.70, trick2: 22.74 },
  expl:  { intro: 0.06, intro2: 0.72, cmp: 2.76, cmp2: 6.07, sub: 7.45, mean: 9.65, mean2: 10.92, eq: 12.59, eq2: 15.19, spd: 19.33, div: 20.25, res: 22.16, res2: 23.89, left: 26.48, left2: 27.96, left3: 29.92 },
  quiz:  { hdr: 0.06, hdr2: 2.05, q: [3.42, 5.6, 7.93, 10.1, 12.56], opt: [15.77, 18.57, 21.45, 24.21], hint: 26.60, cue: 29.84 },
  ans:   { timeUp: 0.05, reveal: 1.10, reveal2: 2.23, re: 4.10, sub: 5.72, div: 7.58, div2: 10.11, dist: 12.99, mul: 15.15, mul2: 17.37,
           vis: 19.73, vis2: 21.26, chk: 24.21, chk2: 29.39, chk3: 31.59, sum: 33.76, sumA: 34.85, sumB: 37.59, sumC: 38.84 },
  promo: { q: 0.06, like: 1.75, cmt: 3.41, brand: 9.31, upd: 11.30, cta: 12.74, cta2: 15.27 },
};
