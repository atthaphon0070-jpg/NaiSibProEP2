"""Contact sheet of all t_*.jpg in a folder. usage: python3 contact.py <dir> <out.jpg> [cols]"""
import sys, os, glob
from PIL import Image, ImageDraw
d, out = sys.argv[1], sys.argv[2]; cols = int(sys.argv[3]) if len(sys.argv) > 3 else 6
fs = sorted(glob.glob(os.path.join(d, 't_*.jpg')), key=lambda f: float(os.path.basename(f)[2:-4]))
W, H = 270, 480
rows = (len(fs) + cols - 1) // cols
sheet = Image.new('RGB', (cols * W, rows * (H + 24)), (8, 16, 34))
dr = ImageDraw.Draw(sheet)
for i, f in enumerate(fs):
    im = Image.open(f).resize((W, H)); x, y = (i % cols) * W, (i // cols) * (H + 24)
    sheet.paste(im, (x, y + 24)); dr.text((x + 6, y + 5), os.path.basename(f)[2:-4] + 's', fill=(230, 244, 255))
    # safe-zone guide
    dr.rectangle([x + 220 / 4, y + 24 + 350 / 4, x + 860 / 4, y + 24 + 1430 / 4], outline=(255, 210, 63))
sheet.save(out, quality=85)
print(out, len(fs))
