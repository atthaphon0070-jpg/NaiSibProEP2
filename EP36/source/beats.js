// EP.36 beat map — phrase starts (seconds, local to each narration file).
// Measured from the supplied audio: pause detection (-40 dB, gaps >= 0.28 s) + a local
// Whisper pass used ONLY to read which phrase is which (no voice was generated or altered).
window.BEATS = {
  hook:  { title: 0.07, subject: 1.43, objects: 5.14, qImm: 7.45, qMov: 9.52, many: 11.69, but: 13.68, why: 15.19, eh: 20.61, diff: 21.07, today: 22.46, go: 28.82 },
  story: { buyer: 0.08, house: 4.04, car: 6.76, ship: 9.27, wonder: 12.61, houseRule: 19.24, carReg: 22.97, carTransfer: 24.45, shipQ: 27.74, shipRule: 28.74, answer: 35.67 },
  know:  { imm: 0.06, code: 2.01, s139: 4.36, immDef: 6.44, immRights: 12.27, immEx: 14.97, exLand: 16.15, exHouse: 17.6, exTree: 19.0,
           mov: 21.34, s140: 23.34, movDef: 25.50, movRights: 28.57, movEx: 31.42, movEx2: 35.23,
           spec: 36.69, specRule: 39.02, ship: 42.05, raft: 43.96, beast: 45.2, preview: 46.90, go: 48.25 },
  expl:  { trap: 0.09, carMov: 3.41, carSale: 6.30, carLaw: 14.50, transfer: 16.38, see: 22.00, special: 25.01, form: 31.19, void: 34.38, remember: 36.18, hookLine: 37.20, next: 42.41 },
  quiz:  { intro: 0.06, q1: 2.82, q2: 7.12, q3: 10.71, q4: 12.49, opts: [17.90, 20.97, 23.38, 27.02], hint: 29.61, think: 36.66 },
  ans:   { reveal: 0.07, choice: 1.06, ship: 2.16, law: 5.09, immRule: 9.70, extend: 16.89, raftBeast: 20.2, whyCar: 23.93, carMov: 25.96, carReg: 30.41,
           others: 39.07, memo: 43.66, memoCar: 44.91, memoShip: 47.11, final: 53.32 },
  promo: { comment: 0.07, trap: 3.17, practice: 7.95, brand: 11.0, bank: 12.9, subjects: 16.73, cta: 19.94, bye: 22.56 },
};
