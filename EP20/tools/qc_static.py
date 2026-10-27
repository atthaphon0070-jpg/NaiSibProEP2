"""Longest stretch without foreground motion. Frames are compared 0.5 s (15 frames) apart; the background rain/circuit
always drifts but is faint, so a pair counts as "static" when < 0.1 % of pixels change by more than 24 levels.
usage: python3 EP20/tools/qc_static.py   (reads renders/frames)"""
import glob, numpy as np
from PIL import Image
fs = sorted(glob.glob('renders/frames/*.jpg'))
G = 15
im = [np.asarray(Image.open(f).convert('L').resize((270, 480)), np.int16) for f in fs]
ch = np.array([np.mean(np.abs(im[i + G] - im[i]) > 24) for i in range(len(im) - G)]); st = ch < .001
best = cur = 0; at = 0
for i, s in enumerate(st):
    cur = cur + 1 if s else 0
    if cur > best: best, at = cur, i - cur + 1
best += G if best else 0
print(f'longest static stretch: {best} frames ({best/30:.2f} s) from frame {at} ({at/30:.2f} s)')
