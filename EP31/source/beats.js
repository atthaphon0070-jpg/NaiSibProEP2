// EP.31 beat map: segment-local seconds, read from the measured phrase starts of each narration file
// (silence detection at -40 dBFS, see qc/beat_map.md). Visual actions are keyed to these.
window.BEATS = {
  hook: {   // 01_hook.mp3 (22.75 s)
    kw: 0.07, sub: 1.38, warn: 2.67, time: 4.98, long: 7.53, assume: 9.66, trap: 12.56, wrong: 14.95,
    because: 16.87, zoom: 17.66, hold: 20.14,
  },
  story: {  // 02_story.mp3 (27.56 s)
    room: 0.08, paper: 2.99, qtime: 4.83, qangle: 7.21, think: 10.41, rush: 13.81, zero: 14.80,
    but: 16.58, wrong: 17.92, zoom: 20.11, ask: 25.32,
  },
  know: {   // 03_knowledge.mp3 (31.79 s)
    hdr: 0.11, n6: 1.94, n05: 2.85, mh: 4.30, mRun: 5.19, mEq: 6.21, mEnd: 9.13, mRes: 9.30, mHi: 10.21,
    hh: 12.87, hRun: 13.84, hEq: 14.77, hRes: 17.30, hHi: 18.40, hEnd: 19.90,
    cmp: 20.57, cmpB: 21.97, sum: 26.17, sumM: 27.19, sumH: 29.37,
  },
  expl: {   // 04_explanation.mp3 (29.88 s)
    t300: 0.06, pos: 2.80, posH: 4.46, deg90: 6.19, lapse: 8.55, fM: 13.06, fMarc: 14.57,
    fH: 18.09, fHarc: 21.30, diff: 24.11, diffB: 24.88, go: 27.78,
  },
  quiz: {   // 05_quiz.mp3 (23.17 s)
    hdr: 0.07, q: 1.93, clock: 4.47, opts: [9.44, 10.93, 13.57, 15.92], think: 18.29, hint: 19.20, five: 21.30,
  },
  ans: {    // 06_answer.mp3 (49.40 s)
    say: 0.07, pick: 1.10, calc: 3.95, mRun: 5.50, mEq: 7.76, mRes: 8.57,
    hStart: 10.74, hRun: 11.91, hEq: 16.72, hRes: 18.64, hPos: 20.26, hPosRes: 22.45,
    diff: 24.31, diffRes: 27.46, dA: 29.88, dC: 33.54, dD: 38.05, memM: 41.89, memH: 44.69, fin: 47.29,
  },
  // promo: TL.promo_cues (10 measured phrase starts) -> comment, comment b, logo, 10,000+, weekly, subjects, subjects b, like, share/follow, outro
};
