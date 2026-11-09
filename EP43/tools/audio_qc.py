"""EP43 audio QC on the RENDERED video: narration integrity, placement, countdown silence, loudness.
usage: python3 EP43/tools/audio_qc.py <video.mp4>   -> qc/audio_qc.json + qc/audio_durations.txt"""
import json, os, subprocess, sys, hashlib, numpy as np
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(HERE)
CFG = json.load(open(os.path.join(EP, 'episode.json'))); BD = os.path.join(EP, CFG.get('build_dir', 'build'))
TL = json.load(open(os.path.join(BD, 'timeline.json'))); SR = 48000
vid = sys.argv[1]
dec = lambda p, ch=1: np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', p, '-f', 'f32le', '-ac', str(ch), '-ar', str(SR), '-'], capture_output=True, check=True).stdout, np.float32)
mix = dec(vid).astype(np.float64)
PADN = 2400; mixp = np.concatenate([np.zeros(PADN), mix])
narr = np.load(os.path.join(BD, 'narration.npy')).astype(np.float64)
res = {'video': os.path.relpath(vid, EP), 'segments': []}
lines = ['EP43 narration durations (decoded from the supplied ElevenLabs MP3s, 48 kHz)', '']
total = 0.0
for seg in CFG['segments']:
    k = seg['key']; st, d = TL[k]
    if 'countdown' in seg:
        a, b = int(round(st * SR)), int(round((st + d) * SR))
        nz = float(np.max(np.abs(narr[a:b])))
        rms_mix = float(np.sqrt(np.mean(mix[a:b] ** 2)))
        res['countdown'] = {'start_s': st, 'duration_s': d, 'frames': round(d * TL['fps']), 'narration_peak_inside': nz, 'mix_rms_dbfs': round(20 * np.log10(rms_mix + 1e-12), 1),
                            'narration_free': nz == 0.0}
        lines.append(f'{"[countdown]":<22} {"":>9}  start {st:9.3f} s  len {d:7.3f} s  (no narration, {round(d * TL["fps"])} frames)')
        continue
    f = os.path.join(EP, seg['file']); raw = open(f, 'rb').read()
    src = dec(f).astype(np.float64)
    a = int(round(st * SR))
    # placement: cross-correlate the original file against the mixed video audio around its expected start (±50 ms)
    W = min(len(src), SR * 8); best = (-2, 0)
    seg_mix = mixp[a: a + W + 2 * PADN]
    for lag in range(-2400, 2401, 24):
        x = seg_mix[2400 + lag: 2400 + lag + W]
        if len(x) < W: continue
        c = float(np.dot(x, src[:W]) / (np.linalg.norm(x) * np.linalg.norm(src[:W]) + 1e-12))
        if c > best[0]: best = (c, lag)
    lag0 = best[1]
    for lag in range(lag0 - 24, lag0 + 25):
        x = seg_mix[2400 + lag: 2400 + lag + W]
        if len(x) < W: continue
        c = float(np.dot(x, src[:W]) / (np.linalg.norm(x) * np.linalg.norm(src[:W]) + 1e-12))
        if c > best[0]: best = (c, lag)
    # narration track inside the build equals the decoded original sample-for-sample
    same = np.array_equal(narr[a:a + len(src)].astype(np.float32), src.astype(np.float32))
    # whole-file correlation (narration vs mix) to show nothing was cut, reordered or re-voiced
    full = float(np.dot(mix[a:a + len(src)], src) / (np.linalg.norm(mix[a:a + len(src)]) * np.linalg.norm(src) + 1e-12))
    total += d
    res['segments'].append({'key': k, 'file': seg['file'], 'md5': hashlib.md5(raw).hexdigest(), 'duration_s': round(d, 4), 'start_s': round(st, 4),
                            'narration_track_identical_to_source': bool(same), 'offset_in_video_ms': round(best[1] / SR * 1000, 2),
                            'corr_first8s': round(best[0], 4), 'corr_whole_file': round(full, 4)})
    lines.append(f'{os.path.basename(seg["file"]):<22} {d:9.3f} s  start {st:9.3f} s  md5 {hashlib.md5(raw).hexdigest()}')
lines += ['', f'narration total     {total:9.3f} s', f'countdown           {TL["cd"][1]:9.3f} s', f'tail (end hold)     {TL["end"] - sum(TL[s["key"]][1] for s in CFG["segments"]) - (TL["cd"][0] - TL["quiz"][0] - TL["quiz"][1]):9.3f} s',
          f'timeline end        {TL["end"]:9.3f} s', f'180 s limit         {"EXCEEDED by %.3f s (narration + countdown alone = %.3f s)" % (TL["end"] - 180, total + TL["cd"][1]) if TL["end"] > 180 else "within limit"}']
open(os.path.join(EP, 'qc', 'audio_durations.txt'), 'w').write('\n'.join(lines) + '\n')
lu = subprocess.run(['ffmpeg', '-hide_banner', '-nostats', '-i', vid, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
summ = lu[lu.rfind('Summary:'):]
grab = lambda key: float(summ.split(key)[1].split()[0])
res['loudness'] = {'integrated_lufs': grab('I:'), 'true_peak_dbfs': grab('Peak:'), 'lra_lu': grab('LRA:')}
res['narration_total_s'] = round(total, 3); res['timeline_end_s'] = round(TL['end'], 3)
res['all_ok'] = all(s['narration_track_identical_to_source'] and abs(s['offset_in_video_ms']) <= 1.0 and s['corr_whole_file'] > .8 for s in res['segments']) and res['countdown']['narration_free']
json.dump(res, open(os.path.join(EP, 'qc', 'audio_qc.json'), 'w'), indent=1)
print(json.dumps(res, indent=1))
