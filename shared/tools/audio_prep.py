"""NaiSibPro audio-first timeline builder (shared by EP03 onward).

usage: python3 shared/tools/audio_prep.py <episode_dir> [--allow-missing]

Reads <episode_dir>/episode.json, decodes every narration file in order, measures
its real length and writes:
  <episode_dir>/<build_dir>/timeline.json   master timeline (seconds; build_dir from episode.json, default 'build')
  <episode_dir>/<build_dir>/narration.npy   narration track (48 kHz mono float32)
  <episode_dir>/source/timeline.js    window.TL for the animation page

A {"countdown": 5} segment inserts exact silence. Its start is padded (<1 frame of
silence) onto a frame boundary so the countdown spans exactly fps*seconds frames.
A {"silence": 0.3} segment (EP19+) inserts a breathing gap between narration files; it is
rounded so the next segment starts exactly on a frame boundary (fps*seconds frames, >= 1).
"cues": N on a segment splits its speech at the N-1 longest pauses and stores the
N phrase start times as TL["<key>_cues"] (used to time scenes to unseen audio).
--allow-missing substitutes silence for missing files (preview only) and lists them
in TL["missing"]; the final build refuses to run when anything is missing.
"""
import json, os, subprocess, sys
import numpy as np

SR = 48000
ep = sys.argv[1]
allow_missing = "--allow-missing" in sys.argv
cfg = json.load(open(os.path.join(ep, "episode.json")))
FPS = cfg.get("fps", 30)
BUILD = cfg.get("build_dir", "build")
os.makedirs(os.path.join(ep, BUILD), exist_ok=True)


def decode(path):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", path, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


def phrase_starts(a, n):
    """Start times of the n phrases separated by the n-1 longest pauses."""
    w = int(.02 * SR)
    rms = np.sqrt(np.convolve(a.astype(np.float64) ** 2, np.ones(w) / w, "same"))
    voiced = rms > 10 ** (-38 / 20)
    edges = np.flatnonzero(np.diff(voiced.astype(int)))
    starts = [i / SR for i in edges if voiced[i + 1]]
    ends = [i / SR for i in edges if not voiced[i + 1]]
    if voiced[0]: starts = [0.0] + starts
    gaps = []
    for e in ends:
        nxt = [s for s in starts if s > e]
        if nxt: gaps.append((nxt[0] - e, e, nxt[0]))
    gaps = sorted(sorted(gaps, reverse=True)[:max(0, n - 1)], key=lambda g: g[1])
    return [round(starts[0] if starts else 0.0, 3)] + [round(g[2], 3) for g in gaps]


tl, pieces, missing, t = {}, [], [], 0.0
for seg in cfg["segments"]:
    key = seg["key"]
    if "countdown" in seg:
        pad = int(round((np.ceil(t * FPS - 1e-9) / FPS - t) * SR))
        pieces.append(np.zeros(pad, np.float32)); t += pad / SR
        d = float(seg["countdown"])
        tl[key] = [t, d]
        pieces.append(np.zeros(int(round(d * SR)), np.float32)); t += d
        continue
    if "silence" in seg:
        nf = max(1, int(round(float(seg["silence"]) * FPS)))
        end = (np.ceil(t * FPS - 1e-9) + nf) / FPS
        pad = int(round((end - t) * SR))
        tl[key] = [t, pad / SR]
        pieces.append(np.zeros(pad, np.float32)); t += pad / SR
        continue
    path = os.path.join(ep, seg["file"])
    if os.path.exists(path):
        a = decode(path)
    elif allow_missing:
        missing.append(seg["file"])
        a = np.zeros(int(seg.get("placeholder", 20.0) * SR), np.float32)
    else:
        sys.exit(f"MISSING narration file: {path}")
    d = len(a) / SR
    tl[key] = [t, d]
    if "cues" in seg:
        tl[key + "_cues"] = phrase_starts(a, seg["cues"]) if a.any() else \
            [round(i * d / seg["cues"], 3) for i in range(seg["cues"])]
    pieces.append(a); t += d
tail = cfg.get("tail", 1.6)
tl["end"] = t + tail
tl["fps"] = FPS
tl["missing"] = missing
pieces.append(np.zeros(int(round(tail * SR)), np.float32))
np.save(os.path.join(ep, BUILD, "narration.npy"), np.concatenate(pieces))
json.dump(tl, open(os.path.join(ep, BUILD, "timeline.json"), "w"), indent=1)
open(os.path.join(ep, "source", "timeline.js"), "w").write("window.TL=" + json.dumps(tl) + ";")
print(json.dumps(tl))
if missing: print("WARNING: silent placeholders used for", missing)
