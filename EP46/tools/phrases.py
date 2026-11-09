"""Print voiced phrase spans (pauses >= MINGAP s) for each EP46 narration file. usage: python3 phrases.py <audio_dir> [mingap]"""
import subprocess, sys, os, numpy as np
SR = 48000
d = sys.argv[1]; MG = float(sys.argv[2]) if len(sys.argv) > 2 else .28
for f in sorted(os.listdir(d)):
    if not f.endswith('.mp3'): continue
    a = np.frombuffer(subprocess.run(["ffmpeg", "-v", "error", "-i", os.path.join(d, f), "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout, np.float32)
    w = int(.02 * SR); rms = np.sqrt(np.convolve(a.astype(np.float64) ** 2, np.ones(w) / w, "same"))
    v = rms > 10 ** (-38 / 20)
    segs = []; i = 0; n = len(v)
    idx = np.flatnonzero(np.diff(np.r_[0, v.astype(int), 0]))
    for s, e in zip(idx[::2], idx[1::2]):
        if segs and s / SR - segs[-1][1] < MG: segs[-1][1] = e / SR
        else: segs.append([s / SR, e / SR])
    segs = [s for s in segs if s[1] - s[0] > .08]
    print(f"{f} dur={len(a)/SR:.3f} phrases={len(segs)}")
    print("   " + "  ".join(f"{s:.2f}-{e:.2f}" for s, e in segs))
