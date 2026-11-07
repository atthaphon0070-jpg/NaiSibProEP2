// EP.39 beat map — phrase starts measured from the ORIGINAL narration files (seconds, local to each file).
// Measured with an RMS voice-activity pass (20 ms window, -38 dBFS gate, pauses < 120 ms merged);
// see qc/beat_map.md for the full phrase list. Scenes add these to the segment starts in window.TL.
window.BEATS = {
  hook: {               // 01_hook.mp3 22.439 s
    title: 0.11, subj: 1.38, notSimple: 3.10, plus2: 4.64,
    nums: [7.77, 8.44, 9.04, 9.95, 10.80, 11.61],            // สิบ แปด สิบห้า ยี่สิบเจ็ด ยี่สิบเอ็ด สามสิบแปด
    chaos: 12.93, butReally: 16.24, twoSets: 17.07, five: 19.54,
  },
  story: {              // 02_story.mp3 17.241 s
    exam: 0.08, upDown: 2.95, adjacent: 7.52, moreCalc: 11.04, notOne: 14.00, notOne2: 15.17,
  },
  know: {               // 03_knowledge.mp3 26.201 s
    tech: 0.06, split: 2.11,
    odd: [5.30, 5.85, 6.67, 7.90, 8.70], oddGroup: 9.51,      // ตัวที่หนึ่ง สาม ห้า เจ็ด (+ position 9)
    even: [12.75, 13.35, 14.09, 15.67, 16.15], evenGroup: 16.69, // ตัวที่สอง สี่ หก แปด (+ position 10 = ?)
    rows: 18.98, rows2: 22.05, diffEach: 24.31,
  },
  expl: {               // 04_explanation.mp3 29.649 s
    intro: 0.07, nums: [2.08, 2.79, 3.82, 4.82, 5.76],       // สิบ สิบห้า ยี่สิบเอ็ด ยี่สิบแปด สามสิบหก
    pairs: [7.49, 10.00, 12.95, 15.70],                      // "สิบไปสิบห้า" ...
    plus: [8.92, 11.79, 14.61, 17.64],                       // "เพิ่มห้า" "เพิ่มหก" "เพิ่มเจ็ด" "เพิ่มแปด"
    summary: 18.88, summary2: 19.75, other: 21.97, other2: 23.91, self: 25.96, self2: 26.82,
  },
  quiz: {               // 05_quiz.mp3 31.478 s
    head: 0.06, question: 1.95,
    nums: [5.12, 6.00, 7.12, 8.29, 9.42, 10.60, 11.92, 13.29, 14.39, 15.59],  // 10 … 36, then "?"
    opts: [18.02, 20.29, 22.53, 24.65], hint: 26.89, give5: 29.69, give5End: 31.22,
  },
  ans: {                // 06_answer.mp3 42.527 s
    reveal: 0.07, letter: 1.09, value: 2.23, toEven: 3.46, evenIs: 5.47,
    nums: [7.75, 8.77, 9.78, 10.88],                          // สิบแปด ยี่สิบเจ็ด สามสิบแปด ห้าสิบเอ็ด
    pairs: [12.69, 15.91, 19.19], plus: [14.53, 17.83, 21.09],
    byTwo: 22.44, byTwo2: 23.45, so: 25.73, add15: 26.48,
    calc: 29.16, equals: 30.77, result: 31.29,
    memo: 32.43, memo2: 34.80, memo3: 36.47, outro: 39.20,
  },
  promo: {              // 07_promotion.mp3 19.487 s
    who: 0.07, comment: 1.79, how: 3.51, brand: 5.65, bank: 8.64, weekly: 11.65, extra: 13.54,
    like: 15.21, share: 15.83, follow: 16.70, last: 17.83,
  },
};
