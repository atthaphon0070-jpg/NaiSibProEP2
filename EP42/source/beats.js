// EP.42 beat map. Every value is SEGMENT-LOCAL seconds, measured from the supplied narration
// (phrase starts after pauses >= 0.17 s at -40 dBFS; see qc/beat_map.md). Absolute time = TL[key][0] + value.
window.BEATS = {
  hook:  { exam: 0.11, comp: 1.36, lead: 3.09, speed: 4.15, file: 7.70, trap: 11.45, letter: 13.66, q: 16.19 },
  story: { file: 0.06, speed: 3.70, think: 7.74, calc: 9.30, wrong: 12.64, units: 13.76, convert: 17.94 },
  know:  { intro: 0.07, bit: 4.87, byte: 9.73, eight: 13.47, mega: 16.90 },
  expl:  { intro: 0.06, speed: 2.42, means: 4.93, file: 8.02, convert: 11.09, mult: 14.08, formula: 17.98, eq: 21.05, think: 23.58 },
  quiz:  { title: 0.07, q: [2.04, 4.00, 6.32, 12.07], opt: [15.20, 17.48, 19.85, 22.39], hint: 25.21, cue: 27.30 },
  ans:   { reveal: 0.08, choice: 1.10, conv: 3.83, div: 9.57, result: 13.85, wrong: 21.11, theory: 27.64, rule: 37.85 },
  promo: { comment: 0.07, five: 3.42, brand: 6.04, bank: 8.66, weekly: 11.57, more: 13.56, cta: 15.09, follow: 17.71 },
};
