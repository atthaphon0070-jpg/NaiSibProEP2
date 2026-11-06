"""EP38 mobile viewing simulation from rendered frames.
usage: python3 -I EP38/tools/mobile_sim.py EP38 <frame.jpg> [...]
For each device (375x812, 390x844, 430x932 pt) it shows centre-crop (fill) and aspect-fit views, with a
generic short-video overlay: right action rail and bottom caption band (approximate zones common to TikTok,
Reels and Shorts; not any app's actual artwork). Writes qc/mobile_sim.png and prints how much of the
1080x1920 safe zone (220-860 x 350-1430) stays clear of the overlays in each view."""
import sys, os
from PIL import Image, ImageDraw
ep, frames = sys.argv[1], sys.argv[2:]
DEV = [(375, 812), (390, 844), (430, 932)]
SZ = (220, 350, 860, 1430)
# overlay zones in device points (approximate): right rail 56 pt wide from 45% height down; caption band 22% bottom; top bar 10%
def overlays(w, h): return [(w - 56, h * .45, w, h * .88), (0, h * .80, w - 56, h), (0, 0, w, h * .07)]
S = 1.0  # px per pt in the sheet
cols = []
report = []
for f in frames:
    im = Image.open(f).convert('RGB')
    for (w, h) in DEV:
        for mode in ('fill', 'fit'):
            k = max(w / 1080, h / 1920) if mode == 'fill' else min(w / 1080, h / 1920)
            vw, vh = 1080 * k, 1920 * k; ox, oy = (w - vw) / 2, (h - vh) / 2
            c = Image.new('RGB', (w, h), (0, 0, 0)); c.paste(im.resize((round(vw), round(vh))), (round(ox), round(oy)))
            d = ImageDraw.Draw(c, 'RGBA')
            sz = [SZ[0] * k + ox, SZ[1] * k + oy, SZ[2] * k + ox, SZ[3] * k + oy]
            d.rectangle(sz, outline=(34, 211, 238, 255), width=2)
            hit = False
            for o in overlays(w, h):
                d.rectangle(o, fill=(0, 0, 0, 110), outline=(255, 255, 255, 160))
                if not (o[2] <= sz[0] or o[0] >= sz[2] or o[3] <= sz[1] or o[1] >= sz[3]): hit = True
            vis = sz[0] >= 0 and sz[2] <= w and sz[1] >= 0 and sz[3] <= h
            d.text((6, 4), f'{w}x{h} {mode}', fill=(255, 255, 0, 255))
            report.append((os.path.basename(f), w, h, mode, 'safe zone fully on screen' if vis else 'SAFE ZONE CROPPED', 'overlay overlaps safe zone' if hit else 'no overlay overlap', round(28 * k / (w / 375), 1)))
            cols.append(c)
W = sum(c.width for c in cols[:6]) + 5 * 8; Hh = max(c.height for c in cols)
rows = [cols[i:i + 6] for i in range(0, len(cols), 6)]
sheet = Image.new('RGB', (W, len(rows) * (Hh + 8)), (20, 20, 20))
for r, row in enumerate(rows):
    x = 0
    for c in row: sheet.paste(c, (x, r * (Hh + 8))); x += c.width + 8
sheet.save(os.path.join(ep, 'qc', 'mobile_sim.png'))
for r in report: print(*r)
