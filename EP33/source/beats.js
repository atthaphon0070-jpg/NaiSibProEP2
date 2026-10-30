// EP.33 beat map: segment-local seconds measured from the supplied narration
// (local faster-whisper "small" pass for the words + ffmpeg silencedetect phrase starts; no audio was altered).
// See qc/beat_map.md for the transcript next to each beat.
window.BEATS = {
  hook:  { sub: 1.28, total: 4.72, sets: 7.84, sum: 9.94, extra: 13.30, dup: 15.62, warn: 18.49, warn2: 20.96, go: 22.76 },
  story: { total: 3.59, comp: 6.54, law: 10.44, neither: 13.32, q: 17.32, wrong: 22.73, wait: 28.29 },
  know:  { venn: 2.05, circles: 3.65, A: 6.29, B: 8.76, mid: 11.31, dbl: 15.71, key: 21.19 },
  expl:  { minus: 2.93, rem: 6.44, atl: 8.60, formula: 10.76, both: 12.87, sum: 15.33, minus2: 18.47, remember: 22.00, go: 23.47 },
  quiz:  { start: .24, lines: [1.74, 4.23, 7.43, 9.91, 13.16], opts: [16.80, 18.00, 20.08, 22.40], hint: 25.26, think: 28.60 },
  ans:   { reveal: 1.07, how: 4.07, tot: 5.77, minus: 8.30, n50: 10.60, n310: 11.64, comp: 13.89, law: 17.27, n420: 19.96, sub: 22.17, n110: 24.70,
           both: 27.52, wrong: 30.30, why: 32.68, remember: 37.46, tip: 38.35, exam: 42.98 },
  promo: { cmt: 0.0, more: 3.19, brand: 5.60, bank: 8.62, subj: 11.91, cta: 14.99, bye: 17.49 },
};
