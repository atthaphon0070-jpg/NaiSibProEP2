"""EP62 audio QC: source files, durations, narration placement, countdown silence, final MP4 checks.
usage: python3 EP62/qc/audio_qc.py   -> EP62/qc/audio_durations.txt + audio_validation.json"""
import json, os, subprocess, hashlib, numpy as np
EP = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SR = 48000
cfg = json.load(open(f'{EP}/episode.json')); BD = f"{EP}/{cfg['build_dir']}"
TL = json.load(open(f'{BD}/timeline.json'))
def dec(p, ac=1):
    return np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', str(ac), '-ar', str(SR), '-'], capture_output=True, check=True).stdout, np.float32)
narr = np.load(f'{BD}/narration.npy')
rows, res = [], {'segments': []}
for seg in cfg['segments']:
    k = seg['key']; st, d = TL[k]
    if 'countdown' in seg:
        a = narr[int(round(st * SR)):int(round((st + d) * SR))]
        res['countdown'] = {'start_s': st, 'duration_s': d, 'frames': round(d * TL['fps']), 'start_frame_exact': abs(st * TL['fps'] - round(st * TL['fps'])) < 1e-6, 'narration_peak_in_window': float(np.abs(a).max())}
        rows.append(f"{'COUNTDOWN (silent)':<24}{'':>34}  start {st:8.3f}s  dur {d:7.3f}s  frames {round(d*TL['fps'])}")
        continue
    p = f"{EP}/{seg['file']}"; a = dec(p)
    md5 = hashlib.md5(open(p, 'rb').read()).hexdigest()
    i0 = int(round(st * SR)); placed = narr[i0:i0 + len(a)]
    same = len(placed) == len(a) and float(np.abs(placed - a).max()) == 0.0
    w = int(.02 * SR); r = np.sqrt(np.convolve(a.astype(np.float64) ** 2, np.ones(w) / w, 'same')); v = np.flatnonzero(r > 10 ** (-38 / 20))
    first, last = v[0] / SR, v[-1] / SR
    probe = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=sample_rate,channels,codec_name,bit_rate', '-of', 'json', p], capture_output=True).stdout)
    res['segments'].append({'key': k, 'file': seg['file'], 'md5': md5, 'duration_s': round(len(a) / SR, 4), 'timeline_start_s': round(st, 4), 'voice_first_s': round(first, 3), 'voice_last_s': round(last, 3), 'peak': round(float(np.abs(a).max()), 4), 'placed_bit_identical_in_narration_track': same, 'source': probe['streams'][0]})
    rows.append(f"{seg['file']:<24}md5 {md5}  start {st:8.3f}s  dur {len(a)/SR:7.3f}s  voice {first:5.2f}-{last:6.2f}s  peak {np.abs(a).max():.3f}")
q, c, an = TL['quiz'], TL['cd'], TL['ans']
res['quiz_voice_end_s'] = round(q[0] + res['segments'][4]['voice_last_s'], 3)
res['gap_last_quiz_word_to_countdown_s'] = round(c[0] - res['quiz_voice_end_s'], 3)
res['answer_audio_starts_at_countdown_end'] = abs(an[0] - (c[0] + c[1])) < 1e-9
res['answer_first_voice_s'] = round(an[0] + res['segments'][5]['voice_first_s'], 3)
res['narration_total_s'] = round(sum(s['duration_s'] for s in res['segments']), 3)
res['timeline_end_s'] = TL['end']
out = f"{EP}/{cfg['output']}"
if os.path.exists(out):
    pr = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration,size,bit_rate:stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,avg_frame_rate,nb_frames,sample_rate,channels,duration', '-of', 'json', out], capture_output=True).stdout)
    res['mp4'] = pr
    mix = dec(out, 1)
    # alignment: cross-correlate the narration track with the decoded MP4 audio (envelope, 10 ms hop)
    hop = SR // 100
    e = lambda x: np.sqrt(np.add.reduceat(x.astype(np.float64) ** 2, np.arange(0, len(x) - hop, hop)))
    en, em = e(narr), e(mix)
    n = min(len(en), len(em)); en, em = en[:n] - en[:n].mean(), em[:n] - em[:n].mean()
    lags = range(-30, 31); cc = [float(np.dot(en[max(0, -l):n - max(0, l)], em[max(0, l):n - max(0, -l)])) for l in lags]
    res['mp4_narration_offset_ms'] = 10 * list(lags)[int(np.argmax(cc))]
    seg_c = mix[int(c[0] * SR):int((c[0] + c[1]) * SR)]
    res['mp4_countdown_rms_dbfs'] = round(20 * np.log10(np.sqrt(np.mean(seg_c.astype(np.float64) ** 2)) + 1e-12), 1)
    res['mp4_peak'] = round(float(np.abs(mix).max()), 4)
    tail = mix[int((TL['promo'][0] + TL['promo'][1] - 1.0) * SR):]
    res['mp4_contains_promo_end'] = len(mix) / SR >= TL['promo'][0] + TL['promo'][1]
    lufs = subprocess.run(['ffmpeg', '-hide_banner', '-i', out, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    res['mp4_loudness'] = [l.strip() for l in lufs.splitlines()[-12:] if 'I:' in l or 'Peak:' in l or 'LRA:' in l]
json.dump(res, open(f'{EP}/qc/audio_validation.json', 'w'), indent=1, ensure_ascii=False)
open(f'{EP}/qc/audio_durations.txt', 'w').write('NaiSibPro EP62 — narration measured from the supplied ElevenLabs MP3s (mono 44.1 kHz 128 kb/s; decoded at 48 kHz)\n\n' + '\n'.join(rows) +
  f"\n\nNarration total     {res['narration_total_s']:.3f} s\nCountdown           5.000 s (150 frames @ 30 fps)\nEnd hold (tail)     {cfg['tail']:.3f} s\nTimeline / video    {TL['end']:.3f} s  (> 180 s target: the supplied narration alone is {res['narration_total_s']:.1f} s; nothing was sped up or trimmed)\n")
print(json.dumps({k: v for k, v in res.items() if k not in ('segments', 'mp4')}, ensure_ascii=False, indent=1))
