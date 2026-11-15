"""EP52 media QC on the exported MP4 (and rendered frames).
usage: python3 EP52/qc/tools/qc_media.py
Writes qc/media_report.json, qc/color_balance.json, qc/first_frame.png, qc/contact_sheet.png
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

EP = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
cfg = json.load(open(os.path.join(EP, 'episode.json')))
MP4 = os.path.join(EP, cfg['output'])
TL = json.load(open(os.path.join(EP, 'renders/timeline.json')))
QC = os.path.join(EP, 'qc')
run = lambda *a: subprocess.run(a, capture_output=True, text=True).stdout + subprocess.run(a, capture_output=True, text=True).stderr

probe = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', MP4], capture_output=True, text=True).stdout)
v = [s for s in probe['streams'] if s['codec_type'] == 'video'][0]
a = [s for s in probe['streams'] if s['codec_type'] == 'audio'][0]
nb = int(subprocess.run(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', MP4], capture_output=True, text=True).stdout.strip())

# full decode (playback) check
dec = subprocess.run(['ffmpeg', '-v', 'error', '-i', MP4, '-f', 'null', '-'], capture_output=True, text=True)
# loudness
eb = subprocess.run(['ffmpeg', '-hide_banner', '-i', MP4, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
def grab(key):
    lines = [l for l in eb.splitlines() if l.strip().startswith(key)]
    return lines[-1].split(':', 1)[1].strip() if lines else None
# audio: decode mix and compare windows
pcm = subprocess.run(['ffmpeg', '-v', 'error', '-i', MP4, '-f', 'f32le', '-ac', '1', '-ar', '48000', '-'], capture_output=True).stdout
x = np.frombuffer(pcm, np.float32)
SR = 48000
narr = np.load(os.path.join(EP, 'renders/narration.npy'))
def rms(sig, t0, t1): s = sig[int(t0 * SR):int(t1 * SR)]; return float(np.sqrt(np.mean(s.astype(np.float64) ** 2))) if len(s) else 0.0
cd0, cd1 = TL['cd'][0], TL['cd'][0] + TL['cd'][1]
segs = {}
for k in ['hook', 'story', 'know', 'expl', 'quiz', 'ans', 'promo']:
    t0, d = TL[k]
    # correlation of the exported mix with the original narration track inside the segment (narration present, unedited timing)
    m = x[int(t0 * SR):int((t0 + d) * SR)].astype(np.float64); n = narr[int(t0 * SR):int((t0 + d) * SR)].astype(np.float64)
    L = min(len(m), len(n)); c = float(np.dot(m[:L], n[:L]) / (np.linalg.norm(m[:L]) * np.linalg.norm(n[:L]) + 1e-12))
    segs[k] = {'start_s': round(t0, 3), 'dur_s': round(d, 3), 'narration_rms_db': round(20 * np.log10(rms(narr, t0, t0 + d) + 1e-9), 1), 'mix_corr_with_narration': round(c, 3)}
clip = float(np.mean(np.abs(x) > .999))
media = {
    'file': os.path.relpath(MP4, EP), 'size_bytes': os.path.getsize(MP4),
    'video': {'codec': v['codec_name'], 'profile': v.get('profile'), 'width': v['width'], 'height': v['height'], 'pix_fmt': v['pix_fmt'], 'r_frame_rate': v['r_frame_rate'], 'avg_frame_rate': v['avg_frame_rate'], 'frames': nb, 'duration_s': float(v['duration'])},
    'audio': {'codec': a['codec_name'], 'sample_rate': a['sample_rate'], 'channels': a['channels'], 'duration_s': float(a['duration'])},
    'container_duration_s': float(probe['format']['duration']),
    'timeline_end_s': TL['end'], 'expected_frames': int(np.ceil(TL['end'] * TL['fps'])),
    'decode_errors': dec.stderr.strip()[:500], 'full_decode_ok': dec.returncode == 0 and not dec.stderr.strip(),
    'loudness_integrated': grab('I:'), 'true_peak': grab('Peak:'), 'clipped_sample_fraction': clip,
    'countdown_window_mix_rms_db': round(20 * np.log10(rms(x, cd0 + .02, cd1 - .02) + 1e-9), 1),
    'countdown_window_narration_rms_db': round(20 * np.log10(rms(narr, cd0, cd1) + 1e-12), 1) if narr[int(cd0 * SR):int(cd1 * SR)].any() else 'digital silence (no narration)',
    'segments': segs,
    'limit_180s': {'total_s': round(float(v['duration']), 3), 'under_180': float(v['duration']) < 180,
                   'narration_plus_countdown_s': round(sum(TL[k][1] for k in ['hook', 'story', 'know', 'expl', 'quiz', 'ans', 'promo']) + 5.0, 3)},
}
json.dump(media, open(os.path.join(QC, 'media_report.json'), 'w'), indent=1, ensure_ascii=False)

# frames from the MP4: first frame + contact sheet + colour balance
tmp = os.path.join(QC, '_frames'); os.makedirs(tmp, exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', MP4, '-vf', 'select=eq(n\\,0)', '-vframes', '1', os.path.join(QC, 'first_frame.png')])
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', MP4, '-vf', 'fps=1', os.path.join(tmp, '%04d.jpg')])
files = sorted(os.listdir(tmp))

def classify(img):
    hsv = np.asarray(img.convert('HSV')).astype(np.float32)
    H, S, V = hsv[..., 0] * 360 / 255, hsv[..., 1] / 255, hsv[..., 2] / 255
    col = (S > .07) & (V > .35)
    pink = col & ((H >= 290) | (H <= 15))
    blue = col & (H >= 180) & (H <= 250)
    return int(pink.sum()), int(blue.sum())
SCN = [('hook', 0, TL['story'][0]), ('story', TL['story'][0], TL['know'][0]), ('knowledge', TL['know'][0], TL['expl'][0]), ('explanation', TL['expl'][0], TL['quiz'][0]),
       ('quiz+countdown', TL['quiz'][0], TL['ans'][0]), ('answer', TL['ans'][0], TL['promo'][0]), ('promotion', TL['promo'][0], TL['end'] + 1)]
acc = {s[0]: [0, 0] for s in SCN}; tot = [0, 0]
for i, f in enumerate(files):
    t = i + .5
    p, b = classify(Image.open(os.path.join(tmp, f)).resize((270, 480)))
    tot[0] += p; tot[1] += b
    for n, a0, a1 in SCN:
        if a0 <= t < a1: acc[n][0] += p; acc[n][1] += b
cb = {'method': 'MP4 sampled at 1 fps, 270x480 downscale; pink = hue 290-15 deg, blue = hue 180-250 deg, saturation > 0.07, value > 0.35. Neutral / white / text pixels excluded.',
      'overall': {'pink_pct': round(100 * tot[0] / sum(tot), 1), 'blue_pct': round(100 * tot[1] / sum(tot), 1)},
      'per_scene': {k: {'pink_pct': round(100 * v[0] / max(1, sum(v)), 1), 'blue_pct': round(100 * v[1] / max(1, sum(v)), 1)} for k, v in acc.items()}}
cb['balanced_40_60'] = 40 <= cb['overall']['pink_pct'] <= 60
json.dump(cb, open(os.path.join(QC, 'color_balance.json'), 'w'), indent=1)

# contact sheet: one tile every 4 s
picks = files[::4]
cols = 8; rows = (len(picks) + cols - 1) // cols; tw, th = 180, 320
sheet = Image.new('RGB', (cols * tw, rows * (th + 26)), 'white'); d = ImageDraw.Draw(sheet)
for i, f in enumerate(picks):
    im = Image.open(os.path.join(tmp, f)).resize((tw, th)); x0, y0 = (i % cols) * tw, (i // cols) * (th + 26)
    sheet.paste(im, (x0, y0)); d.text((x0 + 6, y0 + th + 5), f'{int(f[:4]) - 1:>3d}s', fill=(20, 43, 83))
sheet.save(os.path.join(QC, 'contact_sheet.png'))
for f in files: os.remove(os.path.join(tmp, f))
os.rmdir(tmp)
print(json.dumps({'frames': nb, 'dur': media['video']['duration_s'], 'decode_ok': media['full_decode_ok'], 'I': media['loudness_integrated'], 'TP': media['true_peak'], 'balance': cb['overall']}, ensure_ascii=False))
