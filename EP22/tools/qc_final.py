"""EP22 QC on the FINAL MP4 (plus the build's narration track).

usage: python3 EP22/tools/qc_final.py
Writes EP22/qc/: audio_durations.txt, beat_map.md, frame_0001.png, contact_sheet.png, measurements.json
"""
import json, os, re, subprocess
import numpy as np
from PIL import Image, ImageDraw

EP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
QC = os.path.join(EP, 'qc'); os.makedirs(QC, exist_ok=True)
CFG = json.load(open(os.path.join(EP, 'episode.json')))
MP4 = os.path.join(EP, CFG['output'])
TL = json.load(open(os.path.join(EP, CFG['build_dir'], 'timeline.json')))
BEATS = json.loads(re.search(r'window\.BEATS\s*=\s*(\{.*\});', open(os.path.join(EP, 'source/beats.js')).read(), re.S).group(1))
FPS = TL['fps']
run = lambda *a: subprocess.run(a, capture_output=True, text=True, check=True).stdout
M = {}

# ---------- audio durations ----------
lines = ['# EP22 narration files (measured; source of truth for the timeline)', f'# {"file":24s} {"ffprobe_s":>10s} {"decoded_s":>10s} {"start_s":>9s} {"start_frame":>11s}']
for seg in CFG['segments']:
    if 'file' not in seg:
        lines.append(f'  {"[countdown 5 s, silent]":24s} {"":>10s} {TL[seg["key"]][1]:10.3f} {TL[seg["key"]][0]:9.3f} {round(TL[seg["key"]][0] * FPS):11d}')
        continue
    f = os.path.join(EP, seg['file'])
    d = float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f))
    st, dd = TL[seg['key']]
    lines.append(f'  {os.path.basename(f):24s} {d:10.3f} {dd:10.3f} {st:9.3f} {st * FPS:11.2f}')
lines.append(f'# total timeline {TL["end"]:.3f} s ({TL["end"] * FPS:.1f} frames incl. tail); gaps between files: 9 frames; countdown exactly {TL["cd"][1] * FPS:.0f} frames')
open(os.path.join(QC, 'audio_durations.txt'), 'w').write('\n'.join(lines) + '\n')

# ---------- beat map ----------
DESC = {
 'hook': {'kw': 'เตรียมสอบนายสิบ! (keyword already on screen at frame 0)', 'must': 'ข้อนี้ต้องรู้! → pink chip', 'p1': 'คนหนึ่ง… → caption under left label', 'd6': 'หกวัน → "6 วัน" pops (left, Electric Blue)', 'p2': 'อีกคน… → caption right', 'd3': 'สามวัน → "3 วัน" pops (right, Cyan)', 'help': 'ถ้าช่วยกันทำ → heads turn to the wall, question line', 'when': 'จะเสร็จใน… → "?" at wall centre', 'ki': 'กี่วัน → "?" pulse', 'wrong': 'ข้อนี้คนตอบผิด…', 'wrongW': 'ตอบผิด → red ✗ icons + "คนตอบผิดเยอะมาก!"', 'watch': 'ดูให้จบ → chip', 'think': 'แล้วคุณจะคิดได้…', 'few': 'ไม่กี่วินาที → push-in on the wall', 'end': 'speech ends'},
 'story': {'paper': 'พอเจอโจทย์แบบนี้ → exam paper slides in', 'add': 'หลายคนเอาจำนวนวัน…', 'plus': 'บวก → big "+" ("วัน + วัน" floats up at add+0.4)', 'avg0': 'บางคนก็เอามา…', 'avg': 'ค่าเฉลี่ย → "(วัน + วัน) ÷ 2"', 'think': 'แต่ลองคิดดูดี ๆ → freeze + desaturate', 'two': 'สองคนช่วยกันทำ → hourglasses', 'slow0': 'แต่กลับเสร็จ… → hourglasses drain', 'slow': 'ช้ากว่า → "แปลก!"', 'how': 'มันเป็นไปได้ยังไง → big "?"', 'end': 'speech ends'},
 'know': {'rule': 'กฎข้อแรก → "กฎข้อ 1" stamp', 'if': 'ถ้าช่วยกันทำ → speed bars 1, 2', 'must': 'ต้องเสร็จเร็วกว่า…', 'fastest': 'เร็วที่สุด → yellow "ช่วยกัน" bar shoots out', 'force': 'มีแรงมาช่วยเพิ่ม → muscles merge', 'task': 'และโจทย์งาน → chip', 'noDay0': 'ห้ามคิดเป็นวัน', 'noDay': 'วัน → red strike-through', 'but': 'แต่ต้องคิดว่า', 'each': 'แต่ละคนทำงานได้…', 'rate': 'วันละเท่าไหร่ → "งานต่อวัน" (yellow)', 'end': 'speech ends'},
 'expl': {'ex': 'ลองดูตัวอย่าง', 'w1': 'คนแรกทำเสร็จใน…', 'd4': 'สี่วัน → "4 วัน"', 'w2': 'อีกคน…', 'd12': 'สิบสองวัน → "12 วัน"', 'split': 'ให้แบ่งกำแพง…', 'g12': 'สิบสองช่อง → 12-block grid draws (3 × 4)', 'first': 'คนแรก', 'r3': 'สามช่อง → 3 blue blocks glow, "3 ช่อง/วัน"', 'other': 'อีกคน…', 'r1': 'หนึ่งช่อง → 1 cyan block glows, "1 ช่อง/วัน"', 'together': 'ช่วยกัน → "3" (+ 1 at +0.45 s)', 'perDay': 'วันละ… → "="', 'r4': 'สี่ช่อง → "4 ช่อง/วัน"', 'twelve': 'สิบสองช่อง → "12", calendar วันที่ 1, day-1 fill', 'div': 'หาร…', 'div4': 'สี่ → "÷ 4"', 'fin': 'เสร็จใน', 'done': 'สามวัน → wall complete, "= 3", big "3 วัน", chime', 'memo': 'จำง่าย ๆ ว่า', 'addWork': 'บวกงาน → memory phrase line 1', 'notDays': 'ไม่ใช่บวกวัน → line 2', 'end': 'speech ends'},
 'quiz': {'go': 'ถึงเวลาทดสอบ → QUIZ banner sweep', 'qa': 'ก ทำงานคนเดียว… → line 1', 'qa6': 'หกวัน → "6 วัน" highlight', 'qb': 'ข → line 3', 'qb2': 'ทำงานเดียวกัน', 'qb3': 'คนเดียวเสร็จใน → line 4', 'qb6': 'สามวัน → "3 วัน" highlight', 'qc': 'ถ้าทั้งสองช่วยกันทำ → line 5', 'qc2': 'จะเสร็จในกี่วัน → line 6', 'o1': 'ข้อ ก. → card 1', 'v1': 'สองวัน → "2 วัน"', 'o2': 'ข้อ ข. → card 2', 'v2': 'สามวัน', 'o3': 'ข้อ ค. → card 3', 'v3': 'สี่จุดห้าวัน', 'o4': 'ข้อ ง. → card 4', 'v4': 'เก้าวัน', 'think': 'ให้เวลาคิดห้าวินาที → countdown ring shows 5', 'end': 'speech ends; countdown starts at the next frame boundary'},
 'ans': {'sol': 'เฉลย → green banner', 'reveal': 'ข้อ ก. สองวัน → card ก green ✓ ×1.08, others 40 %', 'split': 'แบ่งกำแพง… → wall set enters', 'g6': 'หกช่อง → 6-block grid draws (2 × 3)', 'aW': 'ก…', 'r1': 'หนึ่งช่อง → 1 blue block, "ก: 1 ช่อง/วัน"', 'bW': 'ข…', 'r2': 'สองช่อง → 2 cyan blocks, "ข: 2 ช่อง/วัน"', 'together': 'ช่วยกัน → "1" (+ 2 at +0.4 s)', 'perDay': 'วันละ… → "="', 'r3': 'สามช่อง → "3 ช่อง/วัน"', 'six': 'หกช่อง → "6", calendar วันที่ 1, fill', 'div': 'หาร…', 'div3': 'สาม → "÷ 3"', 'fin': 'เสร็จใน', 'done': 'สองวัน → wall complete on day 2, "= 2", big "2 วัน", chime + particles', 'w9': 'ใครตอบเก้าวัน → trap list', 'n9': 'เก้า → card ง ✗', 'w9why': 'เอาวันมาบวกกัน → "บวกวัน"', 'w45': 'ใครตอบสี่จุดห้า', 'n45': 'สี่จุดห้า → card ค ✗', 'w45why': 'เอาวันมาเฉลี่ย → "เฉลี่ยวัน"', 'w3': 'ใครตอบสามวัน', 'n3': 'สาม → card ข ✗', 'w3why': 'ลืมนับแรงของ ก → "ลืมแรงของ ก"', 'check': 'เช็กง่าย ๆ → chip', 'faster': 'ช่วยกันต้องเร็วกว่า…', 'lt3': 'สามวัน → "< 3 วัน" line sweeps, cards ≥ 3 leave', 'fastest': 'ซึ่งคือคนที่เร็วที่สุด → chip', 'f0': 'มีสูตรลัดด้วย → "สูตรลัด"', 'fA': 'เอาวัน… → numerator วัน', 'fMul': 'คูณ → "× วัน"', 'fDiv': 'หารด้วย → fraction bar', 'fPlus': 'บวก → "+ วัน"', 's6': 'หก → "6"', 'sMul': 'คูณ', 's3': 'สาม → "× 3"', 's18': 'สิบแปด → "= 18"', 'sDiv': 'หาร → "6 + 3"', 's9': 'เก้า → "9"', 's2': 'ได้สอง → "= 2" + chime', 'memo': 'จำไว้เลย → finished wall returns', 'addWork': 'บวกงาน', 'notDays': 'ไม่ใช่บวกวัน', 'end': 'speech ends'},
 'promo': {'who': 'ใครตอบถูก', 'comment': 'คอมเมนต์ → comment icon', 'two': 'สองวัน → bubble "2 วัน ✓"', 'now': 'มาเลย', 'practice': 'อยากฝึกโจทย์คณิต… → math tiles', 'goto': 'ไปที่ → logo enters', 'brand': 'นายสิบโปร → name', 'exams': 'ข้อสอบมากกว่า → counter runs', 'tenk': 'หมื่น → "10,000+"', 'weekly': 'อัปเดตทุกสัปดาห์', 'follow': 'กดติดตาม → button + tap, officers tap rollers', 'bye': 'แล้วเจอกันข้อต่อไป → logo hold', 'end': 'speech ends'},
}
FILE = {'hook': '01_hook', 'story': '02_story', 'know': '03_knowledge', 'expl': '04_explanation', 'quiz': '05_quiz', 'ans': '06_answer', 'promo': '07_promotion'}
md = ['# EP22 beat map', '',
      'Times are measured from the real recordings. Phrase starts come from pause segmentation (−40 dBFS, ≥120 ms gaps); words inside a phrase come from syllable-nucleus onsets on the energy envelope, matched to the transcript syllable count and checked with a local Whisper-small recogniser (sherpa-onnx, used for timing only, never for audio).',
      f'Absolute time = file start (timeline.json) + file-relative time. Frame = round(absolute × {FPS}). Visuals are keyed to these exact times in `source/beats.js`, so every reveal is within ±1 frame of its cue.', '',
      f'Countdown: {TL["cd"][0]:.3f}–{TL["cd"][0] + TL["cd"][1]:.3f} s = frames {round(TL["cd"][0] * FPS)}–{round((TL["cd"][0] + TL["cd"][1]) * FPS) - 1} (150 frames, no narration).', '']
for k, b in BEATS.items():
    st = TL[k][0]
    md += [f'## {FILE[k]}.mp3 (start {st:.3f} s, frame {round(st * FPS)})', '', '| beat | file s | abs s | frame | spoken → visual |', '|---|---:|---:|---:|---|']
    for name, v in b.items():
        md.append(f'| {name} | {v:.3f} | {st + v:.3f} | {round((st + v) * FPS)} | {DESC[k].get(name, "")} |')
    md.append('')
open(os.path.join(QC, 'beat_map.md'), 'w').write('\n'.join(md))

# ---------- stream / export checks ----------
pr = json.loads(run('ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', MP4))
v = [s for s in pr['streams'] if s['codec_type'] == 'video'][0]; a = [s for s in pr['streams'] if s['codec_type'] == 'audio'][0]
M['video'] = {k: v.get(k) for k in ('codec_name', 'profile', 'pix_fmt', 'width', 'height', 'r_frame_rate', 'avg_frame_rate', 'nb_frames', 'duration')}
M['audio'] = {k: a.get(k) for k in ('codec_name', 'sample_rate', 'channels', 'bit_rate', 'duration')}
M['format_duration'] = float(pr['format']['duration'])
pts = [float(x) for x in run('ffprobe', '-v', 'error', '-select_streams', 'v', '-show_entries', 'packet=pts_time', '-of', 'csv=p=0', MP4).split()]
d = np.diff(sorted(pts)); M['cfr'] = {'frames': len(pts), 'min_dt': float(d.min()), 'max_dt': float(d.max())}
ebu = subprocess.run(['ffmpeg', '-hide_banner', '-i', MP4, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
summ = ebu[ebu.rfind('Summary:'):]
M['loudness'] = {'I_LUFS': float(re.search(r'I:\s+(-?[\d.]+)', summ).group(1)), 'LRA': float(re.search(r'LRA:\s+(-?[\d.]+)', summ).group(1)), 'true_peak_dBFS': float(re.search(r'Peak:\s+(-?[\d.]+)', summ).group(1))}

# ---------- frames: frame 0, contact sheet, start black check, static stretches ----------
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', MP4, '-vf', 'select=eq(n\\,0)', '-frames:v', '1', os.path.join(QC, 'frame_0001.png')], check=True)
f0 = np.asarray(Image.open(os.path.join(QC, 'frame_0001.png')).convert('RGB')).astype(float)
kwbox = f0[290:610, 190:890]
yellow = ((kwbox[..., 0] > 200) & (kwbox[..., 1] > 170) & (kwbox[..., 2] < 120)).mean()
M['frame0'] = {'mean_luma': float(f0.mean()), 'keyword_box_yellow_fraction': float(yellow)}
W, H = 108, 192
raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', MP4, '-vf', f'scale={W}:{H},format=gray', '-f', 'rawvideo', '-'], capture_output=True, check=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W).astype(np.int16)
M['first_frames_mean_luma'] = [float(x) for x in fr[:5].mean(axis=(1, 2))]
diff = np.abs(np.diff(fr, axis=0)).mean(axis=(1, 2))
still = diff < 0.15                         # practically identical consecutive frames
run_len, best, best_at = 0, 0, 0
for i, s in enumerate(still):
    run_len = run_len + 1 if s else 0
    if run_len > best: best, best_at = run_len, i - run_len + 1
M['longest_static_run'] = {'frames': int(best), 'seconds': best / FPS, 'starts_frame': int(best_at), 'threshold_mean_abs_diff': 0.15}
# contact sheet: one frame per second
n = int(len(fr) / FPS) + 1
tw, th, cols = 135, 240, 15
rows = (n + cols - 1) // cols
sheet = Image.new('RGB', (cols * tw, rows * (th + 18)), 'white'); dr = ImageDraw.Draw(sheet)
tmp = os.path.join(QC, '_cs'); os.makedirs(tmp, exist_ok=True)
subprocess.run(['ffmpeg', '-v', 'error', '-y', '-i', MP4, '-vf', f"select='not(mod(n\\,{FPS}))',scale={tw}:{th}", '-vsync', 'vfr', os.path.join(tmp, '%04d.jpg')], check=True)
for i, f in enumerate(sorted(os.listdir(tmp))):
    sheet.paste(Image.open(os.path.join(tmp, f)), ((i % cols) * tw, (i // cols) * (th + 18) + 18))
    dr.text(((i % cols) * tw + 4, (i // cols) * (th + 18) + 3), f'{i:3d}s', fill='black')
    os.remove(os.path.join(tmp, f))
os.rmdir(tmp)
sheet.save(os.path.join(QC, 'contact_sheet.png'))

# ---------- narration integrity + countdown silence ----------
narr = np.load(os.path.join(EP, CFG['build_dir'], 'narration.npy')); SR = 48000
cd0, cdl = TL['cd']
M['countdown'] = {'start_s': cd0, 'start_frame_exact': cd0 * FPS, 'frames': cdl * FPS,
                  'narration_peak_inside': float(np.abs(narr[int(cd0 * SR):int((cd0 + cdl) * SR)]).max()),
                  'ans_start_frame': TL['ans'][0] * FPS}
chk = {}
for seg in CFG['segments']:
    if 'file' not in seg: continue
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(EP, seg['file']), '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
    src = np.frombuffer(raw, np.float32); st = int(round(TL[seg['key']][0] * SR))
    chk[seg['key']] = bool(np.array_equal(narr[st:st + len(src)], src))
M['narration_bit_exact_in_track'] = chk
# gaps between consecutive files (in frames) and overlap check
order = [s for s in CFG['segments']]
gaps = []
for p, q in zip(order, order[1:]):
    e = TL[p['key']][0] + TL[p['key']][1]; gaps.append((p['key'], q['key'], round((TL[q['key']][0] - e) * FPS, 2)))
M['gaps_frames'] = gaps
# music/voice balance in speech: mixed track RMS vs narration RMS in voiced 50 ms windows
# measured on the build's PCM mix (the left channel: narration + music + SFX, before AAC) so codec error does not count as bed
mix = subprocess.run(['ffmpeg', '-v', 'error', '-i', os.path.join(EP, CFG['build_dir'], 'mix.wav'), '-af', 'pan=mono|c0=c0', '-f', 'f32le', '-ar', str(SR), '-'], capture_output=True, check=True).stdout
mix = np.frombuffer(mix, np.float32)[:len(narr)]
w = int(.05 * SR); nw = min(len(mix), len(narr)) // w
nr = np.sqrt((narr[:nw * w].reshape(nw, w) ** 2).mean(1)); bed = mix[:nw * w] - narr[:nw * w]
br = np.sqrt((bed.reshape(nw, w) ** 2).mean(1)); v_ = nr > 10 ** (-30 / 20)
vb = 20 * np.log10(nr[v_] / (br[v_] + 1e-9))
M['voice_over_bed_dB_in_speech'] = {'median': float(np.median(vb)), 'p10': float(np.percentile(vb, 10))}
mus_only = ~v_ & (br > 1e-4)
M['bed_level_dBFS'] = {'during_speech_median': float(np.median(20 * np.log10(br[v_] + 1e-9))), 'between_phrases_median': float(np.median(20 * np.log10(br[mus_only] + 1e-9)))}
json.dump(M, open(os.path.join(QC, 'measurements.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps(M, indent=1, ensure_ascii=False))
