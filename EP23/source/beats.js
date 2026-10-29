// EP23 beat map: seconds from the start of each narration file, measured from the real recordings
// (pause segmentation of the voice + syllable-nucleus dips inside phrases, each phrase checked with a local
// Whisper-small recogniser; see qc/beat_map.md). Every animation cue in scenes/*.js is read from here.
window.BEATS = {
  "hook": {
    "kw": 0.073, "must": 1.736, "press": 3.474, "btn": 3.65, "open": 3.88, "but": 4.804, "dark": 5.12,
    "noSnd": 6.247, "noPic": 7.196, "nothing": 8.054, "who": 9.538, "whoQ": 10.559, "end": 11.009
  },
  "story": {
    "tip": 0.047, "newbie": 2.072, "buy": 3.253, "build": 4.22, "pressed": 5.401, "noOn": 6.614,
    "call": 7.624, "line": 9.65, "psu": 10.765, "mb": 12.09, "cpu": 13.083, "ram": 14.139, "and": 14.781, "hdd": 15.08,
    "who": 16.103, "ask": 17.268, "end": 18.4
  },
  "know": {
    "s1": 0.067, "psu": 1.919, "elec": 3.79, "feed": 4.775, "noPow": 6.413, "nothing": 7.31, "e1": 8.324,
    "s2": 9.086, "mb": 10.259, "house": 11.75, "plug": 12.607, "e2": 14.21,
    "s3": 14.866, "cpu": 15.921, "brain": 17.18, "noBrain": 18.477, "e3": 20.426,
    "s4": 21.015, "ram": 22.0, "desk": 23.22, "noRam": 24.32, "fail": 25.82, "beep": 28.18, "e4": 28.797,
    "all": 29.343, "must": 30.42, "end": 31.234
  },
  "expl": {
    "path": 0.065, "press": 1.863, "pow": 3.349, "psu": 3.73, "run": 4.942, "mb": 5.47,
    "check": 6.542, "brain": 7.13, "desk": 7.72, "called": 8.775, "postTh": 9.636, "or": 11.259, "post": 11.793,
    "pass": 12.906, "bios": 14.66, "memo": 15.65, "fai": 17.021, "baan": 17.67, "samong": 18.349, "to": 19.236,
    "kad": 19.867, "kadEnd": 21.237, "wait": 21.872, "s5": 22.923, "hdd": 24.367, "notYet": 25.299, "end": 26.286
  },
  "quiz": {
    "go": 0.071, "q": 1.992, "ifNo": 3.465, "comp": 4.498, "still": 5.07, "bios": 5.983,
    "o1": 8.098, "v1": 8.882, "o2": 10.093, "v2": 10.92, "o3": 11.852, "v3": 12.649, "o4": 13.936, "v4": 14.724,
    "think": 15.967, "end": 17.562
  },
  "ans": {
    "verdict": 0.066, "d": 1.419, "hdd": 2.577, "noHdd": 3.856, "stillOn": 5.221, "bios": 7.06,
    "win": 8.5, "winNo": 8.96, "os": 10.096, "stored": 11.36, "cab0": 13.19, "cab": 14.51, "noCab": 15.888,
    "house": 16.784, "noWork": 18.16, "rest": 19.649, "cpu": 19.81, "ram": 20.992, "psu": 21.49,
    "kad": 22.896, "sure": 23.931, "dont": 25.652, "gpuIf": 26.538, "gpuNo": 27.69, "card": 29.19, "see": 30.178,
    "memo": 31.535, "fai": 32.722, "baan": 33.19, "samong": 33.77, "to": 34.605, "kad2": 35.191, "noOn": 36.203, "end": 36.69
  },
  "promo": {
    "closed": 0.072, "who": 1.648, "comment": 2.66, "hdd": 3.433, "now": 4.221, "practice": 5.436,
    "goto": 8.002, "brand": 8.641, "exams": 9.776, "tenk": 10.68, "weekly": 11.487, "follow": 12.821,
    "next": 13.94, "bye": 14.862, "end": 15.392
  }
};
