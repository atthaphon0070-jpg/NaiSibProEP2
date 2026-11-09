// EP.46 beat map — phrase starts measured from the original narration (seconds, local to each file).
// Measured with tools/phrases.py (RMS > -38 dBFS, pauses >= 0.14 s); see qc/beat_map.md for the
// anchor each phrase carries. Scenes add TL[segment][0] to get absolute time.
window.BEATS = {
  hook:  { title: .12, subject: 1.30, intro: 2.92, oval: 4.87, rect: 5.77, para: 7.11, dia: 8.50, flow: 10.55, ask: 14.37, qIn: 15.83, qDec: 17.94, q2: 20.21, q3: 21.76 },
  story: { prog: .08, input: 4.22, check: 7.14, check2: 8.05, check3: 9.08, pass: 11.74, fail: 14.97, fail2: 16.80, ask: 19.22, which: 20.85, go: 23.89 },
  know:  { intro: .05, term: 2.53, proc: 7.65, proc2: 9.30, io: 12.57, io2: 14.20, dec: 17.61, dec2: 19.61, review: 22.90, review2: 24.69 },
  expl:  { intro: .05, flow: 2.56, conn: 6.30, conn2: 7.52, tip: 10.98, rTerm: 12.80, rProc: 15.44, rIO: 18.12, rDec: 21.55, rDec2: 24.14, rDec3: 25.61, go: 27.27 },
  quiz:  { intro: .06, q1: 1.98, q2: 3.67, q3: 5.49, q4: 8.84, q5: 12.77, A: 16.54, B: 20.77, C: 25.62, D: 30.06, think: 34.65 },
  ans:   { reveal: .06, input: 2.82, input2: 5.44, dec: 8.19, dec2: 11.29, branch: 13.35, out: 17.24, out2: 18.78, end: 23.43, rule: 27.10, rule2: 29.67, rule3: 30.77, rule4: 32.88, rule5: 34.71 },
  promo: { comment: .07, comment2: 1.64, memory: 3.42, brand: 6.18, brand2: 8.31, promo: 10.01, promo2: 11.24, weekly: 13.31, cta: 14.89, follow: 17.49 },
};
