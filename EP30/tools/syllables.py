"""EP20 syllable-onset analysis (timing only, no speech generated).
usage: python3 EP30/tools/syllables.py <mp3> [t0 t1]
Finds syllable nuclei as peaks of the smoothed 5 ms loudness envelope separated by dips >= 4 dB,
and flags onsets that begin with strong high-band (> 3.5 kHz) energy, i.e. fricatives such as ศ/ส (ศูนย์, สอง, สี่, สิบ)."""
import sys, numpy as np
from segment import decode, SR
a = decode(sys.argv[1]).astype(np.float64)
t0 = float(sys.argv[2]) if len(sys.argv) > 2 else 0; t1 = float(sys.argv[3]) if len(sys.argv) > 3 else len(a) / SR
hop = int(.005 * SR); n = len(a) // hop
fr = a[:n * hop].reshape(n, hop)
db = 10 * np.log10((fr ** 2).mean(1) + 1e-12)
k = np.hanning(9); k /= k.sum(); dbs = np.convolve(db, k, 'same')
# high band ratio via first difference (crude high-pass) per frame
hp = np.diff(a, prepend=a[0]); hp = hp[:n * hop].reshape(n, hop)
hr = 10 * np.log10((hp ** 2).mean(1) + 1e-12) - db
floor = -40
i0, i1 = int(t0 / .005), min(n, int(t1 / .005))
# peaks
peaks = []
i = i0 + 1
while i < i1 - 1:
    if dbs[i] > floor and dbs[i] >= dbs[i - 1] and dbs[i] >= dbs[i + 1]:
        if peaks:
            p = peaks[-1]; dip = dbs[p:i + 1].min()
            if min(dbs[p], dbs[i]) - dip < 4:
                if dbs[i] > dbs[p]: peaks[-1] = i
                i += 1; continue
        peaks.append(i)
    i += 1
for j, p in enumerate(peaks):
    lo = peaks[j - 1] if j else max(i0, p - 80)
    v = lo + int(np.argmin(dbs[lo:p + 1]))
    # onset: first frame after valley where level is within 12 dB of the peak
    on = v
    while on < p and dbs[on] < dbs[p] - 12: on += 1
    fric = hr[max(v, on - 12):on + 4].max()
    print(f"{on*.005:7.3f}  peak {p*.005:7.3f} {dbs[p]:6.1f} dB  hf {fric:5.1f}{'  <S' if fric > 2 else ''}")
