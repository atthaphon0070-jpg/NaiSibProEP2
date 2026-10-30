"""EP27 mobile previews from the rendered MP4 (not from the page): each key moment is shown as a phone would display it,
with generic, unbranded platform overlays (same regions as EP27/tools/qc_safe.js) and the 220–860 × 350–1430 zone outline.
usage: python3 EP27/tools/mobile_preview.py <video.mp4>
writes EP27/qc/mobile_preview_{small_iphone,modern_iphone,large_iphone,reels,shorts,plain_9x16,aspect_fit}.png"""
import json, os, subprocess, sys
from PIL import Image, ImageDraw, ImageFont

EP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
VIDEO = sys.argv[1]
TL = json.load(open(os.path.join(EP, 'renders/timeline.json')))
src = open(os.path.join(EP, 'source/beats.js'), encoding='utf-8').read()
B = json.loads(src[src.index('{'):src.rindex('}') + 1])
S = lambda k: TL[k][0]
b = lambda seg, name: S(seg) + B[seg][name][0]
MOMENTS = [('Opening frame', 0.0), ('Story', b('story', 'n500') + .8), ('Word demo', b('expl', 'ins') + .8),
           ('Excel data', b('mistake', 'put') + .6), ('Mail Merge result', b('mistake', 'princ') + 1.4),
           ('Quiz', b('quiz', 'give') + .6), ('Countdown', S('cd') + 2.5), ('Correct answer', b('ans', 'kb') + 1.0),
           ('Promo end card', TL['end'] - 1.0)]
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = lambda s: ImageFont.truetype(FONT, s) if os.path.exists(FONT) else ImageFont.load_default()

def frame(t):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.3f}', '-i', VIDEO, '-frames:v', '1', '-f', 'image2pipe', '-vcodec', 'png', '-'], capture_output=True, check=True).stdout
    from io import BytesIO
    return Image.open(BytesIO(raw)).convert('RGB')

PLAT = {
    'tiktok': lambda w, h: [(0, 0, w, .11 * h, 'top'), (w - 66, .40 * h, w, .88 * h, 'rail'), (0, h - 170, w - 80, h - 50, 'caption'), (0, h - 50, w, h, 'nav')],
    'reels': lambda w, h: [(0, 0, w, .09 * h, 'top'), (w - 60, .48 * h, w, .90 * h, 'rail'), (0, h - 175, w - 75, h - 50, 'caption'), (0, h - 50, w, h, 'nav')],
    'shorts': lambda w, h: [(0, 0, w, .09 * h, 'top'), (w - 64, .44 * h, w, .88 * h, 'rail'), (0, h - 160, w - 80, h - 48, 'caption'), (0, h - 48, w, h, 'nav')],
}

def phone(img, w, h, mode, plat, dpr=2):
    W, H = w * dpr, h * dpr
    k = (max if mode == 'cover' else min)(W / 1080, H / 1920)
    vw, vh = round(1080 * k), round(1920 * k); ox, oy = (W - vw) // 2, (H - vh) // 2
    scr = Image.new('RGB', (W, H), 'black'); scr.paste(img.resize((vw, vh), Image.LANCZOS), (ox, oy))
    ov = Image.new('RGBA', (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(ov)
    # safe-zone outline (thin green dashes)
    zx0, zy0, zx1, zy1 = ox + 220 * k, oy + 350 * k, ox + 860 * k, oy + 1430 * k
    for x in range(int(zx0), int(zx1), 12): d.line([(x, zy0), (x + 6, zy0)], fill=(34, 197, 94, 220), width=2); d.line([(x, zy1), (x + 6, zy1)], fill=(34, 197, 94, 220), width=2)
    for y in range(int(zy0), int(zy1), 12): d.line([(zx0, y), (zx0, y + 6)], fill=(34, 197, 94, 220), width=2); d.line([(zx1, y), (zx1, y + 6)], fill=(34, 197, 94, 220), width=2)
    if plat:
        for x0, y0, x1, y1, kind in PLAT[plat](w, h):
            x0, y0, x1, y1 = x0 * dpr, y0 * dpr, x1 * dpr, y1 * dpr
            if kind == 'top':
                d.rectangle([x0, y0, x1, y1], fill=(0, 0, 0, 70)); d.text((W / 2 - 60 * dpr / 2, y1 * .55), 'status · tabs', fill=(255, 255, 255, 230), font=font(9 * dpr))
            elif kind == 'rail':
                d.rectangle([x0, y0, x1, y1], fill=(0, 0, 0, 40)); n = 5
                for i in range(n):
                    cy = y0 + (i + .5) * (y1 - y0) / n; r = 15 * dpr
                    d.ellipse([(x0 + x1) / 2 - r, cy - r, (x0 + x1) / 2 + r, cy + r], fill=(255, 255, 255, 200))
            elif kind == 'caption':
                d.rectangle([x0, y0, x1, y1], fill=(0, 0, 0, 60))
                for i, wd in enumerate([.45, .8, .65]): d.rounded_rectangle([x0 + 12 * dpr, y0 + (14 + i * 26) * dpr, x0 + 12 * dpr + (x1 - x0 - 24 * dpr) * wd, y0 + (28 + i * 26) * dpr], 6 * dpr, fill=(255, 255, 255, 190))
            else:
                d.rectangle([x0, y0, x1, y1], fill=(0, 0, 0, 150))
                for i in range(5): d.ellipse([W * (i + .5) / 5 - 8 * dpr, y0 + 14 * dpr, W * (i + .5) / 5 + 8 * dpr, y0 + 30 * dpr], fill=(255, 255, 255, 200))
    scr = Image.alpha_composite(scr.convert('RGBA'), ov).convert('RGB')
    # device bezel
    out = Image.new('RGB', (W + 24, H + 24), (24, 24, 30)); out.paste(scr, (12, 12))
    m = Image.new('L', out.size, 0); ImageDraw.Draw(m).rounded_rectangle([0, 0, out.size[0] - 1, out.size[1] - 1], 40 * dpr // 2, fill=255)
    bg = Image.new('RGB', out.size, 'white'); bg.paste(out, (0, 0), m)
    return bg

def sheet(name, w, h, mode, plat, title):
    frames = [(lab, frame(t)) for lab, t in MOMENTS]
    tiles = [(lab, phone(img, w, h, mode, plat)) for lab, img in frames]
    tw, th = tiles[0][1].size; cols = 3; rows = (len(tiles) + cols - 1) // cols; pad = 30
    out = Image.new('RGB', (cols * (tw + pad) + pad, rows * (th + 70) + 110), (244, 246, 251)); d = ImageDraw.Draw(out)
    d.text((pad, 30), title, fill=(20, 43, 83), font=font(34))
    for i, (lab, tile) in enumerate(tiles):
        x, y = pad + (i % cols) * (tw + pad), 110 + (i // cols) * (th + 70)
        d.text((x, y), lab, fill=(20, 43, 83), font=font(26)); out.paste(tile, (x, y + 40))
    out.save(os.path.join(EP, 'qc', f'mobile_preview_{name}.png'), optimize=True)
    print('wrote', name, out.size)

sheet('small_iphone', 375, 812, 'cover', 'tiktok', 'Small iPhone 375x812 pt, centre-crop (cover), TikTok-style overlay (simulated, generic)')
sheet('modern_iphone', 390, 844, 'cover', 'tiktok', 'Modern iPhone 390x844 pt, centre-crop (cover), TikTok-style overlay (simulated, generic)')
sheet('large_iphone', 430, 932, 'cover', 'shorts', 'Large iPhone 430x932 pt, centre-crop (cover), Shorts-style overlay (simulated, generic)')
sheet('reels', 390, 844, 'cover', 'reels', 'Instagram Reels-style overlay, 390x844 pt cover (simulated, generic)')
sheet('shorts', 390, 844, 'cover', 'shorts', 'YouTube Shorts-style overlay, 390x844 pt cover (simulated, generic)')
sheet('plain_9x16', 360, 640, 'cover', 'reels', 'Plain 9:16 screen 360x640 pt, Reels-style overlay (largest relative caption area)')
sheet('aspect_fit', 390, 844, 'fit', None, 'Aspect-fit (letterboxed) 390x844 pt, no overlay')
