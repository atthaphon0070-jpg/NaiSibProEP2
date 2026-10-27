"""EP20 QC helper: spectrogram + envelope PNG of an audio range with 0.1 s gridlines (timing inspection only).
usage: python3 EP20/tools/spectro.py <mp3> t0 t1 out.png"""
import sys, numpy as np
from PIL import Image, ImageDraw
from segment import decode, SR
a = decode(sys.argv[1]).astype(np.float64); t0, t1 = float(sys.argv[2]), float(sys.argv[3])
seg = a[int(t0 * SR):int(t1 * SR)]
hop = int(.0025 * SR); win = 1024
cols = (len(seg) - win) // hop
S = np.array([np.abs(np.fft.rfft(seg[i * hop:i * hop + win] * np.hanning(win)))[:400] for i in range(cols)])  # up to ~18.7 kHz
S = 20 * np.log10(S + 1e-6); S = np.clip((S - S.max() + 70) / 70, 0, 1)
img = (255 * S.T[::-1]).astype(np.uint8)
im = Image.fromarray(img).resize((cols, 300)).convert('RGB')
H = 460; out = Image.new('RGB', (cols, H), (20, 20, 30)); out.paste(im, (0, 0))
d = ImageDraw.Draw(out)
env = np.array([np.sqrt((seg[i * hop:i * hop + win] ** 2).mean()) for i in range(cols)])
edb = np.clip((20 * np.log10(env + 1e-9) + 60) / 60, 0, 1)
for x in range(cols - 1): d.line([(x, 440 - edb[x] * 130), (x + 1, 440 - edb[x + 1] * 130)], fill=(120, 255, 160))
t = np.ceil(t0 * 10) / 10
while t < t1:
    x = int((t - t0) * SR / hop); major = abs(t * 2 - round(t * 2)) < 1e-6
    d.line([(x, 0), (x, H)], fill=(255, 80, 80) if major else (90, 90, 120))
    if major: d.text((x + 2, 302), f"{t:.1f}", fill=(255, 255, 255))
    t = round(t + .1, 3)
out.save(sys.argv[4])
