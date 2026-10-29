"""EP23 QC on the FINAL MP4 (plus the build's narration track).

usage: python3 EP23/tools/qc_final.py
Writes EP23/qc/: audio_durations.txt, beat_map.md, frame_0001.png, contact_sheet.png, measurements.json
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
lines = ['# EP23 narration files (measured; source of truth for the timeline)', f'# {"file":24s} {"ffprobe_s":>10s} {"decoded_s":>10s} {"start_s":>9s} {"start_frame":>11s}']
for seg in CFG['segments']:
    if 'file' not in seg:
        lines.append(f'  {"[countdown 5 s, silent]":24s} {"":>10s} {TL[seg["key"]][1]:10.3f} {TL[seg["key"]][0]:9.3f} {round(TL[seg["key"]][0] * FPS):11d}')
        continue
    f = os.path.join(EP, seg['file'])
    d = float(run('ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', f))
    st, dd = TL[seg['key']]
    lines.append(f'  {os.path.basename(f):24s} {d:10.3f} {dd:10.3f} {st:9.3f} {st * FPS:11.2f}')
lines.append(f'# total timeline {TL["end"]:.3f} s ({TL["end"] * FPS:.1f} frames incl. tail); gaps between files: 9 frames (+ padding onto the frame grid); countdown exactly {TL["cd"][1] * FPS:.0f} frames')
open(os.path.join(QC, 'audio_durations.txt'), 'w').write('\n'.join(lines) + '\n')

# ---------- beat map ----------
DESC = {
 'hook': {'kw': 'เตรียมสอบนายสิบตำรวจ! (keyword already on screen at frame 0: PC + finger on the power button)', 'must': 'คดีนี้ต้องรู้! → pink chip', 'press': 'กดปุ่มเปิดคอม → finger presses, click', 'btn': 'ปุ่ม → button sinks', 'open': 'เปิดคอม → LED flickers once', 'but': 'แต่…', 'dark': 'จอดำสนิท → monitor/LED/room go dark (keyword stays bright), red chip', 'noSnd': 'ไม่มีเสียง → speaker icon, ✗', 'noPic': 'ไม่มีภาพ → monitor icon, ✗', 'nothing': 'ไม่มีอะไรเลย → chip', 'who': 'ผู้ต้องหา → crime-scene tape sweeps, red "ผู้ต้องหา…", short siren', 'whoQ': 'คือใคร → "คือใคร?"', 'end': 'speech ends'},
 'story': {'tip': 'สายสืบได้รับแจ้งเหตุ → walkie-talkie buzz, case folder slides in, "คดีด่วน" stamp (+0.95 s)', 'newbie': 'มือใหม่คนหนึ่ง → desk + box', 'buy': 'ซื้อชิ้นส่วน…', 'build': 'ประกอบคอมเอง → box opens, parts pop out', 'pressed': 'แต่กดเปิดแล้ว → dark PC, press', 'noOn': 'ไม่ติด → floating "?" + red "ไม่ติด!"', 'call': 'เราจึงเรียกผู้ต้องหาทั้งห้า → lineup wall drops in', 'line': 'เข้าแถว → "มาเข้าแถว!"', 'psu': 'พาวเวอร์ซัพพลาย → suspect 1 walks in + name', 'mb': 'เมนบอร์ด → suspect 2', 'cpu': 'ซีพียู → suspect 3', 'ram': 'แรม → suspect 4', 'and': 'และ…', 'hdd': 'ฮาร์ดดิสก์ → suspect 5', 'who': 'ใครคือตัวการ → nervous wobble, red chip', 'ask': 'มาสอบปากคำกัน → spotlight snaps on', 'end': 'speech ends'},
 'know': {'s1': 'ผู้ต้องหารายที่หนึ่ง → suspect 1 to the table', 'psu': 'พาวเวอร์ซัพพลาย → case file pops (typewriter)', 'elec': 'ไฟฟ้า → ⚡ + "= ไฟฟ้า"', 'feed': 'จ่ายไฟให้ทุกชิ้น → current runs to the parts', 'noPow': 'ไม่มีไฟ ก็ไม่มีอะไรทำงาน', 'nothing': 'ก็ไม่มีอะไรทำงาน', 'e1': 'phrase end → "ขาดไม่ได้" stamp at +0.08 s', 's2': 'รายที่สอง', 'mb': 'เมนบอร์ด → file 2', 'house': 'บ้าน → 🏠 + "= บ้าน"', 'plug': 'ทุกชิ้นต้องเสียบอยู่บนนี้ → CPU + RAM snap on', 'e2': 'phrase end → stamp', 's3': 'รายที่สาม', 'cpu': 'ซีพียู → file 3', 'brain': 'สมองของเครื่อง → 🧠, thought waves', 'noBrain': 'ไม่มีสมอง ก็คิดอะไรไม่ได้', 'e3': 'phrase end → stamp', 's4': 'รายที่สี่', 'ram': 'แรม → file 4', 'desk': 'โต๊ะทำงาน → 🗂️ desk, files land', 'noRam': 'ไม่มีแรม → small PC appears', 'fail': 'ไม่ผ่านการตรวจตอนเปิด', 'beep': 'ปี๊บ → red sound-wave rings + "ปี๊บ!" + soft beep', 'e4': 'phrase end → stamp', 'all': 'ทั้งสี่ราย → four stamped files line up', 'must': 'ขาดไม่ได้ → big red text, stamps pulse', 'end': 'speech ends'},
 'expl': {'path': 'มาดูเส้นทางคดีกัน → cork board', 'press': 'กดปุ่มเปิด → power-button pin', 'pow': 'ไฟ… → string to the ⚡ pin', 'psu': 'พาวเวอร์ซัพพลาย → ⚡ pin pops', 'run': 'วิ่งเข้า… → string ⚡ → 🏠 with light pulse', 'mb': 'เมนบอร์ด → 🏠 pin', 'check': 'เครื่องจะตรวจ…', 'brain': 'สมอง → 🧠 pin, ✓', 'desk': 'โต๊ะทำงาน → 🗂️ pin, ✓', 'called': 'เรียกว่า', 'postTh': 'การตรวจตอนเปิดเครื่อง → green label', 'or': 'หรือ', 'post': 'โพสต์ (spoken) → "POST ✓"', 'pass': 'ถ้าผ่าน → string to the monitor', 'bios': 'ไบออส → monitor shows generic BIOS', 'memo': 'จำง่าย ๆ ว่า', 'fai': 'ไฟ → ⚡', 'baan': 'บ้าน → 🏠', 'samong': 'สมอง → 🧠', 'to': 'โต๊ะ → 🗂️', 'kad': 'ขาดตัวไหน ไม่ติด → big yellow rule (line 2 at +0.55 s)', 'kadEnd': 'phrase end (rest beat to "แต่เดี๋ยวก่อน")', 'wait': 'แต่เดี๋ยวก่อน → freeze flash, room darkens, spotlight swings', 'see': '', 's5': 'ผู้ต้องหารายที่ห้า → spotlight on the Hard Disk, nervous', 'hdd': 'ฮาร์ดดิสก์ → name', 'notYet': 'ยังไม่ได้ตัดสิน → empty file with yellow "?"', 'end': 'speech ends'},
 'quiz': {'go': 'ถึงเวลาตัดสินคดี → QUIZ banner + gavel strike', 'q': 'อุปกรณ์ใดต่อไปนี้ → question line 1', 'ifNo': 'ถ้าไม่มี → line 2, yellow highlight', 'comp': 'คอมพิวเตอร์', 'still': 'ยังเปิดติด → line 3, yellow highlight', 'bios': 'และเข้าหน้าไบออสได้ → line 4', 'o1': 'ข้อ ก. → card 1', 'v1': 'ซีพียู', 'o2': 'ข้อ ข. → card 2', 'v2': 'แรม', 'o3': 'ข้อ ค. → card 3', 'v3': 'พาวเวอร์ซัพพลาย', 'o4': 'ข้อ ง. → card 4', 'v4': 'ฮาร์ดดิสก์', 'think': 'ให้เวลาคิดห้าวินาที → countdown ring shows 5', 'end': 'speech ends; countdown starts at the next frame boundary'},
 'ans': {'verdict': 'คำตัดสิน → banner + gavel', 'd': 'ข้อ ง. → card ง green ✓ ×1.08, others 40 %, gavel', 'hdd': 'ฮาร์ดดิสก์ → chime + confetti', 'noHdd': 'ไม่มีฮาร์ดดิสก์ → PC with an empty drive bay + monitor', 'stillOn': 'ยังเปิดติด → LED on, fan glow, "ยังเปิดติด ✓"', 'bios': 'ไบออส → BIOS screen, "เข้าหน้าไบออสได้ ✓"', 'win': 'วินโดวส์ → "ไม่พบอุปกรณ์สำหรับบูต" screen, OS window icon', 'winNo': 'ไม่ได้ → red ✗', 'os': 'เพราะระบบปฏิบัติการ → chip, OS icon + arrow + Hard Disk', 'stored': 'ถูกเก็บไว้… → OS icon flies into the Hard Disk', 'cab0': 'ฮาร์ดดิสก์จึงเหมือน… (OPTIONAL line, spoken) → house + chip', 'cab': 'ตู้เก็บเอกสาร → 🗄️ cabinet', 'noCab': 'ไม่มีตู้ → cabinet gone, ✗', 'house': 'ก็ยังเข้าบ้านได้ → door opens', 'noWork': 'แต่ไม่มีงานให้ทำ → empty desk', 'rest': 'ส่วน… → cards return as the essentials list', 'cpu': 'ซีพียู → card ก brightens, "ขาดไม่ได้" stamp, ✗', 'ram': 'แรม → card ข', 'psu': 'พาวเวอร์ซัพพลาย → card ค', 'kad': 'ขาดตัวไหน', 'sure': 'เครื่องไม่ติดแน่นอน', 'dont': 'และอย่าลืม → note box', 'gpuIf': 'ถ้าซีพียูไม่มีกราฟิกในตัว → graphics-card icon + label', 'gpuNo': 'ไม่มีกราฟิก…', 'card': 'การ์ดจอ → "ต้องมีการ์ดจอ"', 'see': 'ถึงจะเห็นภาพ', 'memo': 'จำไว้เลย', 'fai': 'ไฟ', 'baan': 'บ้าน', 'samong': 'สมอง', 'to': 'โต๊ะ', 'kad2': 'ขาดตัวไหน → yellow rule line 1', 'noOn': 'ไม่ติด → line 2 (hold to the end of 06)', 'end': 'speech ends'},
 'promo': {'closed': 'ปิดคดีเรียบร้อย → folder closes, green "ปิดคดี" stamp (+0.62 s)', 'who': 'ใครตอบถูก', 'comment': 'คอมเมนต์ → comment icon', 'hdd': 'ฮาร์ดดิสก์ → bubble "ฮาร์ดดิสก์ ✓"', 'now': 'มาเลย', 'practice': 'อยากฝึกข้อสอบคอมพิวเตอร์… → suspects parade', 'goto': 'ไปที่ → real logo centre', 'brand': 'นายสิบโปร → name', 'exams': 'ข้อสอบมากกว่า → counter runs', 'tenk': 'หมื่น → "10,000+"', 'weekly': 'อัปเดตทุกสัปดาห์', 'follow': 'กดติดตามไว้ → button + tap', 'next': 'คดีหน้า → new folder with "?" slides in', 'bye': 'เจอกัน → logo hold', 'end': 'speech ends'},
}
FILE = {'hook': '01_hook', 'story': '02_story', 'know': '03_knowledge', 'expl': '04_explanation', 'quiz': '05_quiz', 'ans': '06_answer', 'promo': '07_promotion'}
md = ['# EP23 beat map', '',
      'Times are measured from the real recordings. Phrase starts come from pause segmentation (−38 dBFS, ≥140 ms gaps); words inside a phrase come from syllable-nucleus dips on the 10 ms energy envelope, matched to the transcript syllables. Every phrase was transcribed with a local Whisper-small recogniser (sherpa-onnx, used for timing and content checks only, never for audio). Optional lines: 04 "หรือ โพสต์" IS spoken (11.26–12.28 s); 06 "ฮาร์ดดิสก์จึงเหมือนตู้เก็บเอกสาร…ไม่มีงานให้ทำ" IS spoken (13.19–19.16 s).',
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
kwbox = f0[330:620, 190:890]
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
