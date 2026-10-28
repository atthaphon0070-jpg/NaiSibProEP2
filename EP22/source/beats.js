// EP22 beat map: seconds from the start of each narration file, measured from the real recordings
// (pause segmentation + syllable-nucleus onsets, verified with a local speech recogniser; see qc/beat_map.md).
// Every animation cue in scenes/*.js is read from here. Regenerate qc/beat_map.md with tools/beat_map.py.
window.BEATS = {
  "hook": {
    "kw": 0.072, "must": 1.386, "p1": 3.219, "d6": 4.44, "p2": 5.321, "d3": 6.515,
    "help": 7.362, "when": 8.74, "ki": 9.22, "wrong": 10.139, "wrongW": 10.9,
    "watch": 12.3, "think": 13.191, "few": 14.435, "end": 15.405
  },
  "story": {
    "paper": 0.066, "add": 1.522, "plus": 2.93, "avg0": 4.237, "avg": 5.155, "think": 6.326,
    "two": 8.199, "slow0": 9.898, "slow": 10.445, "how": 12.054, "end": 12.909
  },
  "know": {
    "rule": 0.056, "if": 1.981, "must": 3.522, "fastest": 4.78, "force": 6.243,
    "task": 8.161, "noDay0": 9.532, "noDay": 10.285, "but": 10.813, "each": 12.123, "rate": 13.495, "end": 14.188
  },
  "expl": {
    "ex": 0.052, "w1": 1.461, "d4": 2.635, "w2": 3.566, "d12": 4.79, "split": 5.921, "g12": 7.015,
    "first": 8.346, "r3": 9.955, "other": 10.872, "r1": 12.17, "together": 13.367, "perDay": 14.563, "r4": 14.98,
    "twelve": 15.872, "div": 17.026, "div4": 17.385, "fin": 18.06, "done": 18.59,
    "memo": 19.8, "addWork": 20.978, "notDays": 21.958, "end": 22.997
  },
  "quiz": {
    "go": 0.063, "qa": 1.626, "qa6": 2.97, "qb": 4.094, "qb2": 4.801, "qb3": 6.007, "qb6": 7.195,
    "qc": 8.261, "qc2": 9.774,
    "o1": 11.294, "v1": 12.12, "o2": 13.177, "v2": 13.994, "o3": 15.053, "v3": 15.836, "o4": 17.29, "v4": 18.089,
    "think": 19.119, "end": 20.636
  },
  "ans": {
    "sol": 0.064, "reveal": 1.095, "split": 2.485, "g6": 3.3, "aW": 4.376, "r1": 5.02, "bW": 6.198, "r2": 7.55,
    "together": 8.614, "perDay": 9.479, "r3": 9.94, "six": 11.008, "div": 11.849, "div3": 12.2, "fin": 12.886, "done": 13.41,
    "w9": 14.51, "n9": 15.085, "w9why": 15.988, "w45": 17.352, "n45": 18.045, "w45why": 19.038, "w3": 20.509, "n3": 20.96, "w3why": 22.004,
    "check": 23.643, "faster": 24.741, "lt3": 25.87, "fastest": 26.716,
    "f0": 28.492, "fA": 29.927, "fMul": 30.33, "fDiv": 31.185, "fPlus": 31.865,
    "s6": 32.823, "sMul": 33.11, "s3": 33.355, "s18": 33.99, "sDiv": 34.794, "s9": 35.085, "s2": 35.569,
    "memo": 36.742, "addWork": 37.703, "notDays": 38.35, "end": 39.6
  },
  "promo": {
    "who": 0.065, "comment": 1.139, "two": 1.63, "now": 2.372, "practice": 3.597, "goto": 5.984, "brand": 6.15,
    "exams": 7.778, "tenk": 8.675, "weekly": 9.453, "follow": 11.037, "bye": 12.03, "end": 13.529
  }
};
