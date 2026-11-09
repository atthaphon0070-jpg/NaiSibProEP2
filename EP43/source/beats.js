// EP43 — narration beat map, in seconds LOCAL to each narration file (0 = start of that file).
// Measured from the supplied ElevenLabs audio: phrase boundaries from the RMS envelope (pauses >= 0.14 s,
// -40 dBFS gate) and words identified with a local Whisper-small pass used only to read timing.
// Absolute time = TL[<segment key>][0] + local time (TL comes from shared/tools/audio_prep.py).
window.BEATS = {
  hook: { exam: 0.12, comp: 1.30, ask: 3.12, q: 4.27, many: 6.81, tb: 8.18, yb: 9.04, but: 10.79, now: 11.81, today: 16.21, frombit: 18.77, to: 19.66, see: 23.12 },
  story: { buy: 0.07, flash: 3.59, hdd: 6.44, huge: 9.27, more: 12.36, pb: 14.31, eb: 15.70, q: 18.04, order: 19.31, remember: 21.62 },
  know: { basic: 0.05, bit: 2.02, val: 2.69, zero: 4.55, one: 5.35, four: 6.38, called: 7.13, nibble: 8.02, eight: 9.41, byte: 10.12,
          then: 11.49, kB: 14.10, MB: 15.11, GB: 16.19, TB: 17.04, rem: 18.57,
          r: [20.69, 21.46, 22.24, 23.06, 23.78, 24.58, 25.21], notyet: 26.20 },
  expl: { next: 0.06, PB: 1.88, EB: 3.24, ZB: 4.97, YB: 6.07, dec: 7.87, x1000: 10.39, interest: 14.15, y2022: 15.85, approved: 16.55,
          that: 20.55, ronna: 21.44, quetta: 22.14, sort: 23.60, first: 25.62, last: 26.53, test: 27.65 },
  quiz: { intro: 0.05, q: 1.94, opt: [6.53, 12.29, 18.20, 24.16],
          tok: [[7.49, 8.68, 9.81, 10.92], [13.48, 14.64, 15.73, 16.85], [19.43, 20.57, 21.73, 22.83], [25.32, 26.47, 27.61, 28.68]],
          think: 30.00, five: 31.29 },
  ans: { sol: 0.06, ko: 1.04, kai: 2.03, zb: 2.82, yb: 4.31, rb: 5.44, qb: 6.37, x1: 7.95, x2: 10.55, x3: 12.90, quetta: 15.68, largest: 16.61,
         remember: 21.06, notonly: 21.87, dont: 26.46, bit: 27.51, byte: 28.07, diff: 28.83 },
  promo: { who: 0.06, comment: 1.71, before: 3.42, know: 4.80, want: 7.04, nsp: 9.21, bank: 12.21, weekly: 14.14, like: 15.62, share: 16.23, follow: 16.95, bye: 18.15 },
};
