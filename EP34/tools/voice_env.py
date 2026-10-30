"""EP.34 lip-sync envelope: per-frame voice level (0..1) of the narration track, for Box's mouth.

usage: python3 EP34/tools/voice_env.py EP34   (after shared/tools/audio_prep.py has written <build_dir>/narration.npy)
Writes EP34/source/env.js -> window.ENV = [level per video frame]. Reads the audio only; nothing is changed.
"""
import json, os, sys
import numpy as np
SR = 48000
ep = sys.argv[1]
cfg = json.load(open(os.path.join(ep, "episode.json")))
bd = os.path.join(ep, cfg.get("build_dir", "build"))
fps = cfg.get("fps", 30)
a = np.load(os.path.join(bd, "narration.npy")).astype(np.float64)
hop = SR // fps
n = int(np.ceil(len(a) / hop))
a = np.pad(a, (0, n * hop - len(a)))
rms = np.sqrt((a.reshape(n, hop) ** 2).mean(1)) + 1e-9
db = 20 * np.log10(rms)
lvl = np.clip((db + 40) / 22, 0, 1)
lvl = np.convolve(lvl, [.25, .5, .25], "same")
open(os.path.join(ep, "source", "env.js"), "w").write("window.ENV=[" + ",".join(f"{v:.2f}".rstrip("0").rstrip(".") or "0" for v in lvl) + "];")
print("frames", n)
