"""Step 1: decode narration, measure exact durations, write timeline.js / timeline.json."""
import json, subprocess, sys, os
import numpy as np

SR = 48000
ASSETS = sys.argv[1]
OUT = sys.argv[2]
NAMES = ["01_hook", "02_basic", "03_edit", "04_advanced", "05_quiz", "06_answer", "07_promotion"]
KEYS = ["hook", "basic", "edit", "adv", "quiz", "ans", "promo"]
COUNTDOWN = 5.0
TAIL = 1.6  # end card hold after final narration


def find(name):
    for f in os.listdir(ASSETS):
        if f.startswith(name) and f.lower().endswith(".mp3"):
            return os.path.join(ASSETS, f)
    raise SystemExit(f"missing {name}")


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


tl = {}
t = 0.0
pieces = []
for name, key in zip(NAMES, KEYS):
    a = decode(find(name))
    d = len(a) / SR
    if key == "ans":
        tl["cd"] = [t, COUNTDOWN]
        pieces.append(np.zeros(int(round(COUNTDOWN * SR)), np.float32))
        t += COUNTDOWN
    tl[key] = [t, d]
    pieces.append(a)
    t += d
tl["end"] = t + TAIL
pieces.append(np.zeros(int(round(TAIL * SR)), np.float32))
narr = np.concatenate(pieces)
np.save(os.path.join(OUT, "narration.npy"), narr)
json.dump(tl, open(os.path.join(OUT, "timeline.json"), "w"), indent=1)
open(os.path.join(OUT, "public", "timeline.js"), "w").write("window.TL=" + json.dumps(tl) + ";")
print(json.dumps(tl, indent=1), len(narr) / SR)
