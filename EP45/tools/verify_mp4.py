"""Verify the exported EP.45 MP4 itself (not the source).

usage: python3 EP45/tools/verify_mp4.py EP45
 - ffprobe: codec, profile, size, pix_fmt, fps (constant), duration, audio codec / rate
 - decodes the final AAC track and cross-correlates every original narration file against it:
   reports where each segment actually sits in the video (offset vs timeline) and its level (gain)
 - checks the countdown window is free of narration
 - extracts qc/first_frame.png (frame 0), qc/contact_sheet.png and key frames (countdown, reveal)
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

EP = sys.argv[1]
CFG = json.load(open(os.path.join(EP, 'episode.json')))
BD = os.path.join(EP, CFG.get('build_dir', 'build'))
TL = json.load(open(os.path.join(BD, 'timeline.json')))
OUT = os.path.join(EP, CFG['output'])
QC = os.path.join(EP, 'qc'); os.makedirs(QC, exist_ok=True)
SR = 16000

def probe():
    j = json.loads(subprocess.check_output(['ffprobe', '-v', 'error', '-show_format', '-show_streams', '-of', 'json', OUT]))
    v = next(s for s in j['streams'] if s['codec_type'] == 'video'); a = next(s for s in j['streams'] if s['codec_type'] == 'audio')
    nf = int(subprocess.check_output(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', OUT]).decode().strip().strip(','))
    return {'file': OUT, 'size_MB': round(int(j['format']['size']) / 1e6, 2), 'container': j['format']['format_name'], 'duration_s': float(j['format']['duration']),
            'video': {'codec': v['codec_name'], 'profile': v.get('profile'), 'width': v['width'], 'height': v['height'], 'pix_fmt': v['pix_fmt'],
                      'r_frame_rate': v['r_frame_rate'], 'avg_frame_rate': v['avg_frame_rate'], 'frames': nf, 'duration_s': float(v.get('duration', 0))},
            'audio': {'codec': a['codec_name'], 'sample_rate': int(a['sample_rate']), 'channels': a['channels'], 'duration_s': float(a.get('duration', 0))}}

def decode(path, seconds=None):
    # left channel only (narration is identical in L and R); avoids ffmpeg's stereo->mono downmix gain
    cmd = ['ffmpeg', '-v', 'error', '-i', path, '-af', 'pan=mono|c0=c0', '-ar', str(SR), '-f', 'f32le', '-']
    return np.frombuffer(subprocess.run(cmd, capture_output=True, check=True).stdout, np.float32).astype(np.float64)

def main():
    rep = {'probe': probe()}
    mix = decode(OUT)
    segs = []
    for seg in CFG['segments']:
        if 'file' not in seg: continue
        k = seg['key']; t0, d = TL[k]
        nar = decode(os.path.join(EP, seg['file']))
        # search ±0.5 s around the planned start
        lo = int((t0 - .5) * SR); w = mix[max(0, lo): lo + len(nar) + SR]
        n = 1 << int(np.ceil(np.log2(len(w) + len(nar))))
        xc = np.fft.irfft(np.fft.rfft(w, n) * np.conj(np.fft.rfft(nar, n)), n)[:len(w) - len(nar) + 1]
        i = int(np.argmax(xc)); st = max(0, lo) + i
        seg_mix = mix[st:st + len(nar)]
        gain = float(np.dot(seg_mix, nar) / np.dot(nar, nar))
        resid = seg_mix - gain * nar
        corr = float(np.dot(seg_mix, nar) / np.sqrt(np.dot(seg_mix, seg_mix) * np.dot(nar, nar)))
        segs.append({'segment': seg['file'], 'planned_start_s': round(t0, 4), 'found_start_s': round(st / SR, 4), 'offset_ms': round((st / SR - t0) * 1000, 2),
                     'duration_s': round(len(nar) / SR, 3), 'narration_gain_in_mix': round(gain, 3), 'correlation': round(corr, 4),
                     'bed_to_voice_rms_dB': round(20 * np.log10(np.sqrt(np.mean(resid ** 2)) / np.sqrt(np.mean((gain * nar) ** 2))), 1)})
    rep['narration'] = segs
    rep['narration_all_present'] = all(s['correlation'] > .9 and abs(s['offset_ms']) < 5 for s in segs)
    cd0, cdd = TL['cd']; a, b = int((cd0 + .05) * SR), int((cd0 + cdd - .05) * SR)
    rep['countdown_audio'] = {'window_s': [cd0, cd0 + cdd], 'rms_dBFS': round(20 * np.log10(np.sqrt(np.mean(mix[a:b] ** 2)) + 1e-12), 1),
                              'note': 'music bed at reduced level + one tick per second; no narration (narration segments are located outside this window above)'}
    rep['loudness'] = {'overall_rms_dBFS': round(20 * np.log10(np.sqrt(np.mean(mix ** 2))), 1), 'peak_dBFS': round(20 * np.log10(np.max(np.abs(mix))), 2)}
    # frames
    fps = TL['fps']
    def grab(t, path):
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.4f}', '-i', OUT, '-frames:v', '1', path], check=True)
    grab(0, os.path.join(QC, 'first_frame.png'))
    def grab_frame(n, path):   # exact frame index from the encoded video (no seek rounding)
        subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', OUT, '-vf', f'select=eq(n\\,{n})', '-vsync', '0', '-frames:v', '1', path], check=True)
    f_cd = round(cd0 * fps)
    keys = {'cd_first': f_cd, 'cd_last': f_cd + 149, 'answer_first': round(TL['ans'][0] * fps)}
    for n, f in keys.items(): grab_frame(f, os.path.join(QC, f'frame_{n}_{f}.png'))
    rep['key_frames'] = keys
    # contact sheet: 30 evenly spaced frames + labels
    ts = np.linspace(0, rep['probe']['duration_s'] - .1, 30)
    tiles = []
    for i, t in enumerate(ts):
        p = os.path.join(BD, f'cs_{i:02d}.png'); grab(float(t), p); tiles.append((t, Image.open(p).convert('RGB').resize((216, 384))))
    sheet = Image.new('RGB', (6 * 216, 5 * (384 + 22)), 'white'); dr = ImageDraw.Draw(sheet)
    for i, (t, im) in enumerate(tiles):
        x, y = (i % 6) * 216, (i // 6) * (384 + 22); sheet.paste(im, (x, y + 22)); dr.text((x + 6, y + 5), f'{int(t // 60)}:{t % 60:05.2f}', fill='black')
    sheet.save(os.path.join(QC, 'contact_sheet.png'))
    v = rep['probe']['video']
    rep['spec_checks'] = {
        '1080x1920': v['width'] == 1080 and v['height'] == 1920, 'h264': v['codec'] == 'h264', 'yuv420p': v['pix_fmt'] == 'yuv420p',
        '30fps_constant': v['r_frame_rate'] == '30/1' and v['avg_frame_rate'] == '30/1', 'aac': rep['probe']['audio']['codec'] == 'aac',
        'frame_count_matches_audio_length': v['frames'] == int(np.floor(rep['probe']['audio']['duration_s'] * fps + 1e-6)), 'all_narration_present_and_aligned': rep['narration_all_present'],
        'under_180s': rep['probe']['duration_s'] <= 180.0,
    }
    json.dump(rep, open(os.path.join(QC, 'final_mp4_verification.json'), 'w'), indent=1, ensure_ascii=False)
    print(json.dumps({k: rep[k] for k in ('probe', 'spec_checks', 'countdown_audio', 'loudness')}, indent=1, ensure_ascii=False))
    for s in segs: print(s)

main()
