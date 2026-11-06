// EP38 beat map — segment-local seconds, measured from the supplied narration (pause detection,
// -38 dBFS / 20 ms RMS, phrases merged across gaps < 0.18 s). See ../qc/beat_map.md.
// Every value is a measured phrase start; nothing is guessed from a script.
window.BEATS = {
  hook:  { kw: 0.10, comp: 1.42, fail: 2.74, n50: 5.06, priv: 7.68, three: 10.96, to: 12.38, cc: 13.20, bcc: 14.23, x1: 16.28, risk: 18.61, go: 22.48 },
  story: { office: 0.08, assign: 2.82, boss: 7.65, rule: 9.10, open: 13.29, fields: 15.11, to: 17.31, cc: 18.09, bcc: 18.95, all: 20.59, diff: 23.27, diff2: 25.40, which: 27.70 },
  know:  { to: 0.06, toDef: 1.70, toSend: 4.50, cc: 6.95, ccFull: 8.61, ccDef: 9.42, ccSend: 11.37, ccEx: 14.28, vis: 17.30, vis2: 20.50, wrong: 23.80, warn: 27.68 },
  expl:  { bcc: 0.07, full: 3.43, th: 6.14, sender: 8.14, send: 9.86, deliver: 11.37, rcv: 14.77, both: 21.11, both2: 23.00, to: 26.63, cc: 28.16, bccC: 29.70, limit: 31.78, wrap: 35.94 },
  quiz:  { title: 0.08, q: 1.87, a: 13.75, b: 15.46, c: 17.51, d: 19.50, think: 21.86, think2: 22.95, cue: 26.39, cueEnd: 28.08 },
  ans:   { sol: 0.06, c: 1.05, bcc: 2.08, why: 4.03, fit: 8.60, a: 17.10, b: 21.30, d: 27.36, dNot: 32.20, sum: 35.04, to: 36.95, cc: 38.71, bcc2: 40.90, fin: 43.42 },
  promo: { cm: 0.06, brand: 3.23, bank: 5.81, week: 8.69, x: 10.67, cta: 12.11, end: 14.70 },
};
