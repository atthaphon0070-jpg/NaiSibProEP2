"""EP.60 media QC on the final MP4: specs, first frame, colour balance, loudness, countdown silence.
usage: python3 EP60/qc/tools/media_qc.py EP60
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image
EP = sys.argv[1]
cfg = json.load(open(os.path.join(EP, 'episode.json')))
MP4 = os.path.join(EP, cfg['output']); QC = os.path.join(EP, 'qc'); BD = os.path.join(EP, cfg.get('build_dir', 'build'))
TL = json.load(open(os.path.join(BD, 'timeline.json')))
probe = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', MP4], capture_output=True, text=True).stdout)
v = next(s for s in probe['streams'] if s['codec_type'] == 'video'); a = next(s for s in probe['streams'] if s['codec_type'] == 'audio')
nb = int(subprocess.run(['ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', MP4], capture_output=True, text=True).stdout.strip())
spec = {'width': v['width'], 'height': v['height'], 'fps': v['r_frame_rate'], 'video_codec': v['codec_name'], 'profile': v.get('profile'), 'pix_fmt': v['pix_fmt'],
        'audio_codec': a['codec_name'], 'sample_rate': a['sample_rate'], 'channels': a['channels'], 'duration_s': float(probe['format']['duration']), 'video_frames': nb}

def frame_at(t, path=None):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-ss', f'{t:.4f}', '-i', MP4, '-frames:v', '1', '-f', 'rawvideo', '-pix_fmt', 'rgb24', '-'], capture_output=True).stdout
    img = np.frombuffer(raw, np.uint8).reshape(1920, 1080, 3)
    if path: Image.fromarray(img).save(path)
    return img
# first frame straight from the MP4 (frame index 0)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', MP4, '-vf', 'select=eq(n\\,0)', '-frames:v', '1', os.path.join(QC, 'first_frame.png')], check=True)

# blue/pink balance: saturated pixels classified by hue
def hue_counts(img):
    x = img.astype(np.float32) / 255; r, g, b = x[..., 0], x[..., 1], x[..., 2]
    mx = x.max(-1); mn = x.min(-1); d = mx - mn + 1e-6
    h = np.where(mx == r, ((g - b) / d) % 6, np.where(mx == g, (b - r) / d + 2, (r - g) / d + 4)) * 60
    sat = d / (mx + 1e-6); m = (sat > .18) & (mx > .35)
    blue = m & (h >= 185) & (h <= 250); pink = m & ((h >= 300) | (h <= 8))
    return int(blue.sum()), int(pink.sum())
samples = []
for t in np.arange(0.5, spec['duration_s'] - .2, 2.0):
    bcount, pcount = hue_counts(frame_at(float(t)))
    samples.append({'t': round(float(t), 2), 'blue_px': bcount, 'pink_px': pcount, 'blue_share': round(bcount / max(1, bcount + pcount), 3)})
B = sum(s['blue_px'] for s in samples); Pk = sum(s['pink_px'] for s in samples)
balance = {'method': 'saturated pixels (S>0.18, V>0.35); blue hue 185-250 deg, pink hue 300-8 deg; one frame every 2 s from the MP4',
           'frames_sampled': len(samples), 'blue_share': round(B / (B + Pk), 3), 'pink_share': round(Pk / (B + Pk), 3),
           'per_scene': {}, 'samples': samples}
for k in ['hook', 'story', 'know', 'expl', 'quiz', 'ans', 'promo']:
    s0, d = TL[k]; ss = [s for s in samples if s0 <= s['t'] < s0 + d]
    b = sum(s['blue_px'] for s in ss); p = sum(s['pink_px'] for s in ss)
    balance['per_scene'][k] = round(b / max(1, b + p), 3)

# loudness + countdown silence (narration track carries nothing in the 5 s window)
ln = subprocess.run(['ffmpeg', '-nostats', '-i', MP4, '-af', 'loudnorm=print_format=json', '-f', 'null', '-'], capture_output=True, text=True).stderr
lj = json.loads(ln[ln.rindex('{'):ln.rindex('}') + 1])
narr = np.load(os.path.join(BD, 'narration.npy'))
c0, c1 = int(TL['cd'][0] * 48000), int((TL['cd'][0] + TL['cd'][1]) * 48000)
audio = {'integrated_lufs': float(lj['input_i']), 'true_peak_dbtp': float(lj['input_tp']), 'narration_peak_in_countdown': float(np.abs(narr[c0:c1]).max())}
rep = {'spec': spec, 'expected_frames': int(np.ceil(TL['end'] * TL['fps'])), 'balance': balance, 'audio': audio}
json.dump(rep, open(os.path.join(QC, 'media_qc.json'), 'w'), indent=1)
print(json.dumps({k: v for k, v in rep.items() if k != 'balance'}, indent=1)); print('balance', balance['blue_share'], balance['pink_share'], balance['per_scene'])
