"""EP20 phrase/onset analysis (timing only). usage: python3 EP30/tools/segment.py <mp3> [min_gap_s] [thresh_db]
Prints voiced runs (start, end) separated by pauses >= min_gap, from a 10 ms RMS envelope."""
import subprocess, sys, numpy as np
SR = 48000
def decode(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"], capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32)
def runs(a, min_gap=.12, th_db=-38, hop=.01):
    h = int(hop * SR); n = len(a) // h
    rms = np.sqrt((a[:n * h].reshape(n, h).astype(np.float64) ** 2).mean(1))
    db = 20 * np.log10(rms + 1e-9)
    v = db > th_db
    out = []; i = 0
    while i < n:
        if v[i]:
            j = i
            while j < n and v[j]: j += 1
            out.append([i * hop, j * hop]); i = j
        else: i += 1
    merged = []
    for s, e in out:
        if merged and s - merged[-1][1] < min_gap: merged[-1][1] = e
        else: merged.append([s, e])
    return [r for r in merged if r[1] - r[0] >= .05], db
if __name__ == "__main__":
    a = decode(sys.argv[1]); g = float(sys.argv[2]) if len(sys.argv) > 2 else .12; th = float(sys.argv[3]) if len(sys.argv) > 3 else -38
    r, _ = runs(a, g, th)
    print(f"{sys.argv[1]} dur={len(a)/SR:.3f}")
    for s, e in r: print(f"  {s:7.2f} - {e:7.2f}  ({e-s:.2f})")
