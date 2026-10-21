"""EP13 encoded-video checks (run after the build).

usage: python3 EP13/qa/verify_mp4.py
- container/stream specs, full decode
- each narration file located in the final soundtrack by cross-correlation (offset vs the timeline)
- countdown window: narration track is digital silence; frame range = exactly fps * 5
- black frames / frozen stretches (ffmpeg blackdetect, freezedetect)
- integrated loudness and true peak
"""
import json, os, re, subprocess, sys
import numpy as np

EP = os.path.join(os.path.dirname(__file__), '..')
cfg = json.load(open(os.path.join(EP, 'episode.json')))
MP4 = os.path.join(EP, cfg['output'])
BD = os.path.join(EP, cfg.get('build_dir', 'build'))
TL = json.load(open(os.path.join(BD, 'timeline.json')))
SR = 16000
out = {}


def run(cmd):
    return subprocess.run(cmd, capture_output=True, text=True)


def decode(path, ss=None, t=None):
    cmd = ['ffmpeg', '-v', 'error']
    if ss is not None: cmd += ['-ss', str(ss)]
    if t is not None: cmd += ['-t', str(t)]
    cmd += ['-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).astype(np.float64)


probe = json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', MP4]).stdout)
v = next(s for s in probe['streams'] if s['codec_type'] == 'video'); a = next(s for s in probe['streams'] if s['codec_type'] == 'audio')
out['video'] = {k: v.get(k) for k in ('codec_name', 'profile', 'width', 'height', 'r_frame_rate', 'pix_fmt', 'nb_frames')}
out['audio'] = {k: a.get(k) for k in ('codec_name', 'sample_rate', 'channels')}
out['duration'] = float(probe['format']['duration'])
out['decode_errors'] = run(['ffmpeg', '-v', 'error', '-i', MP4, '-f', 'null', '-']).stderr.strip() or 'none'

# narration placement
mix = decode(MP4)
place = []
for seg in cfg['segments']:
    if 'file' not in seg: continue
    ref = decode(os.path.join(EP, seg['file']))
    t0 = TL[seg['key']][0]
    lo = int(max(0, (t0 - .5)) * SR)
    win = mix[lo: lo + len(ref) + SR]
    n = 1 << int(np.ceil(np.log2(len(win) + len(ref))))
    xc = np.fft.irfft(np.fft.rfft(win, n) * np.conj(np.fft.rfft(ref, n)), n)[:len(win) - len(ref) + 1]
    k = int(np.argmax(xc)); found = (lo + k) / SR
    corr = float(xc[k] / (np.linalg.norm(ref) * np.linalg.norm(win[k:k + len(ref)]) + 1e-12))
    place.append({'file': seg['file'], 'expected_s': round(t0, 4), 'found_s': round(found, 4), 'offset_ms': round((found - t0) * 1000, 2), 'norm_corr': round(corr, 3), 'len_s': round(len(ref) / SR, 3)})
out['narration_placement'] = place

# countdown window
narr = np.load(os.path.join(BD, 'narration.npy'))
c0, cd = TL['cd']; fps = TL['fps']
out['countdown'] = {'start_s': c0, 'dur_s': cd, 'first_frame': round(c0 * fps, 3), 'end_frame_excl': round((c0 + cd) * fps, 3), 'frames': round(cd * fps, 3),
                    'narration_peak_in_window': float(np.abs(narr[int(c0 * 48000):int((c0 + cd) * 48000)]).max())}

# black / freeze detection
bd = run(['ffmpeg', '-v', 'info', '-i', MP4, '-vf', 'blackdetect=d=0.1:pix_th=0.10', '-an', '-f', 'null', '-']).stderr
fd = run(['ffmpeg', '-v', 'info', '-i', MP4, '-vf', 'freezedetect=n=0.0008:d=1.5', '-an', '-f', 'null', '-']).stderr
out['black_segments'] = re.findall(r'black_start:\S+ black_end:\S+', bd)
out['freeze_segments'] = re.findall(r'freeze_start: \S+|freeze_end: \S+', fd)

# loudness
eb = run(['ffmpeg', '-nostats', '-i', MP4, '-af', 'ebur128=peak=true', '-f', 'null', '-']).stderr
summ = eb[eb.rfind('Summary:'):]
m1 = re.search(r'I:\s+(-?[\d.]+) LUFS', summ); m2 = re.search(r'Peak:\s+(-?[\d.]+) dBFS', summ)
out['loudness'] = {'integrated_LUFS': float(m1.group(1)) if m1 else None, 'true_peak_dBFS': float(m2.group(1)) if m2 else None}

json.dump(out, open(os.path.join(os.path.dirname(__file__), 'verify_mp4.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps(out, indent=1, ensure_ascii=False))
