"""EP51 media QC: inspects the rendered MP4 and the build products, writes the qc/ reports.

usage: python3 EP51/tools/qc_media.py EP51
needs: renders/timeline.json + narration.npy (from the build), the final MP4, qc/onscreen_text.json (qc_page.js)
writes: qc/audio_durations.txt, qc/beat_map.md, qc/countdown_validation.json, qc/grammar_validation.json,
        qc/media_qc.json, qc/first_frame.png, qc/countdown_frames.png, qc/contact_sheet.png
"""
import hashlib, json, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

EP = sys.argv[1]
CFG = json.load(open(f'{EP}/episode.json'))
BD = f"{EP}/{CFG.get('build_dir', 'build')}"
TL = json.load(open(f'{BD}/timeline.json'))
OUT = f"{EP}/{CFG['output']}"
QC = f'{EP}/qc'; os.makedirs(QC, exist_ok=True)
FPS = TL['fps']; SR = 48000
run = lambda *a: subprocess.run(a, capture_output=True, text=True, check=True)
SUPPLIED = {  # md5 of the files exactly as supplied in the user's zip
    '01_hook.mp3': '34fd3ebc956ca1ac123529c2a48f593f', '02_story.mp3': 'c426f68bd24dd6e1f9712c581eb52bad',
    '03_knowledge.mp3': '31c8af53a895f03d46abebd58349295b', '04_explanation.mp3': 'ef915d4a41c406deed2a6bfe973e4759',
    '05_quiz.mp3': 'b645d3c1035876e676fde43a2031abb9', '06_answer.mp3': '1706003418b143fc3e7f61f4a4f084c5',
    '07_promotion.mp3': '32aca293237673d847fd310a97c3d37a'}

# ---------------------------------------------------------------- probe the final file
pr = json.loads(run('ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', OUT).stdout)
v = next(s for s in pr['streams'] if s['codec_type'] == 'video'); a = next(s for s in pr['streams'] if s['codec_type'] == 'audio')
nb = int(run('ffprobe', '-v', 'error', '-count_frames', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_frames', '-of', 'csv=p=0', OUT).stdout.strip())
dec = subprocess.run(['ffmpeg', '-v', 'error', '-i', OUT, '-f', 'null', '-'], capture_output=True, text=True)
lufs = subprocess.run(['ffmpeg', '-hide_banner', '-i', OUT, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
I = float(re.findall(r'I:\s+(-?[\d.]+) LUFS', lufs)[-1]); TP = float(re.findall(r'Peak:\s+(-?[\d.]+) dBFS', lufs)[-1])
media = {
    'file': CFG['output'], 'size_mb': round(os.path.getsize(OUT) / 1e6, 2),
    'video': {'codec': v['codec_name'], 'profile': v.get('profile'), 'width': v['width'], 'height': v['height'], 'pix_fmt': v['pix_fmt'],
              'r_frame_rate': v['r_frame_rate'], 'avg_frame_rate': v['avg_frame_rate'], 'frames': nb},
    'audio': {'codec': a['codec_name'], 'sample_rate': a['sample_rate'], 'channels': a['channels']},
    'duration_s': round(float(pr['format']['duration']), 3), 'expected_frames': int(np.ceil(TL['end'] * FPS)),
    'full_decode_errors': dec.stderr.strip()[:500] or None, 'integrated_loudness_lufs': I, 'true_peak_dbfs': TP,
}
media['checks'] = {
    'h264': v['codec_name'] == 'h264', '1080x1920': (v['width'], v['height']) == (1080, 1920), 'yuv420p': v['pix_fmt'] == 'yuv420p',
    'cfr_30': v['r_frame_rate'] == '30/1' and v['avg_frame_rate'] == '30/1', 'aac': a['codec_name'] == 'aac',
    'frame_count_matches_timeline_within_1': abs(nb - media['expected_frames']) <= 1, 'decodes_without_errors': not dec.stderr.strip(),
    'under_180s': media['duration_s'] <= 180.0,
}
json.dump(media, open(f'{QC}/media_qc.json', 'w'), indent=1)

# ---------------------------------------------------------------- audio durations + integrity
narr = np.load(f'{BD}/narration.npy')
lines = ['EP51 narration — measured durations (ffmpeg decode, 48 kHz mono) and placement on the master timeline', '']
order_ok, t_prev = True, -1
for seg in CFG['segments']:
    k = seg['key']; st, d = TL[k]
    if 'countdown' in seg:
        lines.append(f"{'[countdown]':<20} start {st:8.3f} s   duration {d:7.3f} s   frames {round(st * FPS)}–{round(st * FPS) + round(d * FPS) - 1} ({round(d * FPS)} frames, silent)")
    else:
        f = seg['file']; md5 = hashlib.md5(open(f'{EP}/{f}', 'rb').read()).hexdigest()
        same = md5 == SUPPLIED[os.path.basename(f)]
        lines.append(f"{os.path.basename(f):<20} start {st:8.3f} s   duration {d:7.3f} s   md5 {md5}  {'= supplied file (unchanged)' if same else 'CHANGED!'}")
    order_ok &= st > t_prev; t_prev = st
speech = sum(TL[s['key']][1] for s in CFG['segments'] if 'file' in s)
lines += ['', f'narration total     {speech:8.3f} s', f'countdown           {TL["cd"][1]:8.3f} s', f'tail                {TL["end"] - TL["promo"][0] - TL["promo"][1]:8.3f} s',
          f'timeline end        {TL["end"]:8.3f} s', f'final MP4           {media["duration_s"]:8.3f} s ({nb} frames)', '',
          f'Target "under 180 s if source audio permits": the seven recordings alone last {speech:.1f} s, so with the required 5 s',
          f'countdown the episode cannot be under 180 s without cutting or speeding up the narration (both forbidden). Reported, not altered.']
open(f'{QC}/audio_durations.txt', 'w').write('\n'.join(lines) + '\n')

# ---------------------------------------------------------------- countdown
cd0, cdd = TL['cd']; f0 = round(cd0 * FPS); n = round(cdd * FPS)
i0, i1 = int(round(cd0 * SR)), int(round((cd0 + cdd) * SR))
seg = narr[i0:i1]
ans_i = int(round(TL['ans'][0] * SR)); ans_audio = narr[ans_i:]
w = int(.02 * SR); rms = np.sqrt(np.convolve(ans_audio[:SR * 3].astype(np.float64) ** 2, np.ones(w) / w, 'same'))
first_voice = float(np.argmax(rms > 10 ** (-38 / 20)) / SR)
q_end = narr[int(TL['quiz'][0] * SR):i0]; rq = np.sqrt(np.convolve(q_end.astype(np.float64) ** 2, np.ones(w) / w, 'same'))
last_quiz_voice = TL['quiz'][0] + float(np.flatnonzero(rq > 10 ** (-38 / 20))[-1] / SR)
# read the countdown digits back from the rendered video (one frame per number + boundary frames)
probe_frames = sorted({f0 - 1, f0, f0 + 29, f0 + 30, f0 + 59, f0 + 60, f0 + 89, f0 + 90, f0 + 119, f0 + 120, f0 + 149, f0 + 150})
tiles = []
for fr in probe_frames:
    png = f'{BD}/cdq_{fr}.png'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', OUT, '-vf', f'select=eq(n\\,{fr})', '-vframes', '1', png], check=True)
    tiles.append((fr, Image.open(png).convert('RGB')))
sheet = Image.new('RGB', (6 * 270, 2 * 500), 'white'); d = ImageDraw.Draw(sheet)
for i, (fr, im) in enumerate(tiles):
    x, y = (i % 6) * 270, (i // 6) * 500
    sheet.paste(im.crop((340, 1100, 740, 1480)).resize((270, 256)), (x, y + 30)); d.text((x + 6, y + 6), f'frame {fr} (cd+{fr - f0})', fill='black')
    sheet.paste(im.resize((135, 240)), (x + 68, y + 290))
sheet.save(f'{QC}/countdown_frames.png')
cdv = {
    'fps': FPS, 'countdown_start_s': cd0, 'countdown_duration_s': cdd, 'start_frame': f0, 'frames': n, 'end_frame_inclusive': f0 + n - 1,
    'start_on_frame_boundary': abs(cd0 * FPS - f0) < 1e-6, 'exactly_150_frames': n == 150,
    'digits': {str(5 - k): [f0 + 30 * k, f0 + 30 * k + 29] for k in range(5)},
    'narration_peak_inside_countdown': float(np.max(np.abs(seg))) if len(seg) else 0.0,
    'no_narration_during_countdown': bool(np.max(np.abs(seg)) == 0),
    'quiz_speech_ends_s': round(last_quiz_voice, 3), 'quiz_speech_ends_before_countdown': last_quiz_voice < cd0,
    'answer_audio_starts_s': TL['ans'][0], 'answer_first_voice_s': round(TL['ans'][0] + first_voice, 3),
    'answer_starts_after_countdown': TL['ans'][0] >= cd0 + cdd - 1e-6,
    'reveal_visuals': 'choice ข turns green, tick and blank fill are driven by answer-local time (≥ 0 only after the countdown); see scenes.js drawS5',
    'visual_check_sheet': 'qc/countdown_frames.png (frames at every digit boundary, read from the final MP4)',
}
json.dump(cdv, open(f'{QC}/countdown_validation.json', 'w'), indent=1)

# ---------------------------------------------------------------- first frame + contact sheet
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', OUT, '-vf', 'select=eq(n\\,0)', '-vframes', '1', f'{QC}/first_frame.png'], check=True)
ts = list(np.arange(0, media['duration_s'] - .2, 4.0))
cw, ch = 216, 384; cols = 10; rows = (len(ts) + cols - 1) // cols
cs = Image.new('RGB', (cols * cw, rows * (ch + 22)), 'white'); d = ImageDraw.Draw(cs)
for i, t in enumerate(ts):
    png = f'{BD}/cs_{i}.jpg'
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.2f}', '-i', OUT, '-vframes', '1', '-q:v', '4', png], check=True)
    x, y = (i % cols) * cw, (i // cols) * (ch + 22)
    cs.paste(Image.open(png).resize((cw, ch)), (x, y + 22)); d.text((x + 4, y + 4), f'{int(t // 60)}:{t % 60:04.1f}', fill='black')
cs.save(f'{QC}/contact_sheet.png')

# ---------------------------------------------------------------- beat map
md = ['# EP51 beat map', '', 'Phrase starts measured from the supplied recordings (voice-activity detection, -38 dBFS, 20 ms window) and',
      'identified with an offline Whisper pass (timing only). "Master" = position on the final video timeline.', '']
cur = None
for line in open(f'{EP}/source/beats.js'):
    m = re.match(r'\s+(\w+): \{\s+// (\S+) \(([\d.]+) s\)', line)
    if m:
        cur = m.group(1); st = TL[cur][0]
        md += ['', f'## {m.group(2)} — starts {st:.3f} s ({int(st // 60)}:{st % 60:06.3f}), {TL[cur][1]:.3f} s', '', '| beat | local s | master s | frame | narration |', '|---|---|---|---|---|']
        continue
    m = re.match(r'\s+(\w+): ([\d.]+),\s*// (.*)', line)
    if m and cur:
        loc = float(m.group(2)); mt = TL[cur][0] + loc
        md.append(f'| {m.group(1)} | {loc:.2f} | {mt:.2f} | {round(mt * FPS)} | {m.group(3)} |')
    if cur == 'quiz' and line.strip().startswith('},'):
        md += ['', f'## countdown — {TL["cd"][0]:.3f} s → {TL["cd"][0] + TL["cd"][1]:.3f} s, frames {f0}–{f0 + n - 1} (150 frames, no narration)']
        cur = None
open(f'{QC}/beat_map.md', 'w').write('\n'.join(md) + '\n')

# ---------------------------------------------------------------- grammar validation (from the rendered page's on-screen text)
ot = json.load(open(f'{QC}/onscreen_text.json'))
texts = [(e['first_seen_s'], e['text']) for e in ot['text_log']]
alltxt = ' | '.join(t for _, t in texts)
low = alltxt.lower()
quiz_src = open(f'{EP}/source/quiz.js').read()
scenes_src = open(f'{EP}/source/scenes.js').read()
def seen(s): return any(s.lower() in t.lower() for _, t in texts)
def first(s): return next((ts for ts, t in texts if s.lower() in t.lower()), None)
a_police_bad = [t for _, t in texts if re.search(r'\ba police\b(?! officer)', t, re.I)]
checks = [
    ('1 official question exact', "stem: ['The police', '_____', 'looking for the suspect.']" in quiz_src and seen('looking for the suspect.') and seen('The police'),
     'Card shows "The police ____ / looking for the suspect." with the Thai line ตำรวจกำลังตามหาผู้ต้องสงสัย'),
    ('2 correct answer is ข', "correct: 1" in quiz_src and "['ข.', 'are']" in quiz_src, 'choice index 1 = ข. are'),
    ('3 correct word is ARE', seen('THE POLICE → ARE') or seen('The police ='), 'blank filled with "are" after the countdown; memory rule The police = ARE'),
    ('4 the police taught with a plural verb', seen('ต้องใช้กริยารูปพหูพจน์') and seen('PLURAL VERB'), 'scene 04 PLURAL VERB card + answer reasons'),
    ('5 a police officer taught with a singular verb', seen('A police officer =') and seen('เอกพจน์'), 'A police officer → IS (singular · เอกพจน์)'),
    ('6 no claim that all singular subjects use IS', 'โดยทั่วไป' in alltxt and 'ทุกประธาน' not in alltxt, 'rules say "โดยทั่วไป" (generally)'),
    ('7 no claim that all nouns without S are singular', seen('ไม่ได้แปลว่าเป็นเอกพจน์เสมอไป') and seen('ไม่ได้แปลว่า ต้องใช้'), 'shown as "No final S ≠ automatically singular"'),
    ('8 no "a police" meaning one officer', not a_police_bad, f'occurrences: {a_police_bad}'),
    ('9 every English example correct', all(seen(s) for s in ['A police officer is on duty.', 'Two police officers are on duty.', 'The police are looking for the suspect.', 'A police officer is looking for the suspect.']) and not any(re.search(r'police officers? (is|are)', t) and not re.search(r'(A police officer is|Two police officers are)', t) for _, t in texts),
     'A police officer is on duty. / Two police officers are on duty. / The police are looking for the suspect. / A police officer is looking for the suspect.'),
    ('10 Thai translations accurate', all(seen(s) for s in ['ตำรวจหนึ่งคนกำลังปฏิบัติหน้าที่', 'ตำรวจสองคนกำลังปฏิบัติหน้าที่', 'ตำรวจกำลังตามหาผู้ต้องสงสัย', 'ตำรวจหนึ่งคนกำลังตามหาผู้ต้องสงสัย']), ''),
    ('11 answer not identified before the countdown', 'ua >= 0 && i === QUIZ.correct' in open(f'{EP}/source/quiz.js').read() and "Q.fill.style.opacity = ua >= 0 ? fk : 0" in scenes_src,
     'green state, tick and blank fill only for answer-local time ≥ 0 (after frame %d); focus ring during the reading is the same yellow for all four choices' % (f0 + n)),
    ('12 memory comparison shown after the reveal', (first('A police officer =') or 0) > TL['ans'][0], f"memory lock first seen at {first('A police officer =')} s"),
    ('wrong form only as an explicit error', seen('The police is looking…') and 'line-through' in scenes_src and seen('ผิด'), '"The police is looking…" appears once, struck through in red with the label ผิด'),
    ('frame-zero brand phrase', any(ts == 0 and 'เตรียมสอบนายสิบตำรวจ' in t for ts, t in texts), 'เตรียมสอบนายสิบตำรวจ visible at 0.0 s'),
    ('lesson is subject–verb agreement, not "add S"', 'add s' not in low and 'เติม s' not in low, ''),
]
gv = {'checks': [{'check': c, 'pass': bool(p), 'note': nte} for c, p, nte in checks]}
gv['all_pass'] = all(c['pass'] for c in gv['checks'])
json.dump(gv, open(f'{QC}/grammar_validation.json', 'w'), ensure_ascii=False, indent=1)
print(json.dumps({'media': media['checks'], 'countdown_ok': cdv['exactly_150_frames'] and cdv['no_narration_during_countdown'] and cdv['answer_starts_after_countdown'],
                  'grammar_all_pass': gv['all_pass'], 'failed': [c['check'] for c in gv['checks'] if not c['pass']]}, ensure_ascii=False, indent=1))
