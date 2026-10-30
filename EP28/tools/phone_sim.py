"""EP28 phone-view simulation on frames taken from the final MP4.
usage: python3 EP28/tools/phone_sim.py <frames_dir> <out_dir>
For each frame: 375×812, 390×844, 430×932 viewports (≈9:19.5) in center-crop (fill) and aspect-fit, plus
TikTok / Reels / Shorts style UI overlays (approximate rectangles, video px). Writes phone_report.json with the
visible video window per viewport and whether the overlay rectangles touch the critical zone X 220–860, Y 350–1430."""
import sys, os, json, glob
from PIL import Image, ImageDraw
src, out = sys.argv[1], sys.argv[2]; os.makedirs(out, exist_ok=True)
Z = (220, 350, 860, 1430)
VP = {'iphone_small_375x812': (375, 812), 'iphone_390x844': (390, 844), 'iphone_tall_430x932': (430, 932)}
# approximate UI chrome in 1080×1920 video coordinates (conservative boxes)
UI = {'tiktok': [(0, 0, 1080, 230), (930, 760, 1080, 1560), (0, 1560, 1080, 1920)],
      'reels': [(0, 0, 1080, 200), (940, 900, 1080, 1620), (0, 1600, 1080, 1920)],
      'shorts': [(0, 0, 1080, 210), (935, 880, 1080, 1640), (0, 1640, 1080, 1920)]}
inter = lambda a, b: not (a[2] <= b[0] or b[2] <= a[0] or a[3] <= b[1] or b[3] <= a[1])
rep = {'critical_zone': Z, 'viewports': {}, 'overlays': {}}
for n, (w, h) in VP.items():
    s = h / 1920; vis = (1080 - w / s) / 2
    rep['viewports'][n] = {'fill_visible_video_x': [round(vis), round(1080 - vis)], 'fill_crops_critical': vis > Z[0],
                           'fit_scale': round(w / 1080, 4), 'fit_text_scale_vs_1080': round(w / 1080, 3)}
for k, boxes in UI.items():
    rep['overlays'][k] = {'boxes': boxes, 'touch_critical_zone': any(inter(b, Z) for b in boxes)}
frames = sorted(glob.glob(os.path.join(src, '*.png')))
for f in frames:
    im = Image.open(f).convert('RGB'); base = os.path.splitext(os.path.basename(f))[0]
    tiles = []
    for n, (w, h) in VP.items():
        s = h / 1920; fw = round(1080 * s); fill = im.resize((fw, h)).crop(((fw - w) // 2, 0, (fw - w) // 2 + w, h))
        fit = Image.new('RGB', (w, h), 'black'); fh = round(1920 * w / 1080); fit.paste(im.resize((w, fh)), (0, (h - fh) // 2))
        tiles += [(n + ' fill', fill), (n + ' fit', fit)]
    for k, boxes in UI.items():
        w, h = VP['iphone_390x844']; s = h / 1920; fw = round(1080 * s); off = (fw - w) / 2
        v = im.resize((fw, h)).crop((round(off), 0, round(off) + w, h)).convert('RGBA'); ov = Image.new('RGBA', v.size, (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
        for b in boxes: d.rectangle([b[0] * s - off, b[1] * s, b[2] * s - off, b[3] * s], fill=(0, 0, 0, 120))
        d.rectangle([Z[0] * s - off, Z[1] * s, Z[2] * s - off, Z[3] * s], outline=(255, 0, 255, 200), width=2)
        tiles.append((k + ' overlay (390×844)', Image.alpha_composite(v, ov).convert('RGB')))
    W = sum(t[1].width for t in tiles) + 10 * len(tiles); H = max(t[1].height for t in tiles) + 26
    sheet = Image.new('RGB', (W, H), (30, 30, 30)); d = ImageDraw.Draw(sheet); x = 0
    for lab, t in tiles: sheet.paste(t, (x, 26)); d.text((x + 4, 6), lab, fill='white'); x += t.width + 10
    sheet.save(os.path.join(out, f'phone_{base}.jpg'), quality=82)
json.dump(rep, open(os.path.join(out, 'phone_report.json'), 'w'), indent=1)
print(json.dumps(rep, indent=1))
