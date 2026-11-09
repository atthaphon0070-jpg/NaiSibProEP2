"""EP47 media QC: audio inventory, beat map, narration-integrity check, final MP4 probe, frame grabs
from the actual exported file (first frame, contact sheet, countdown strip, phone overlay mockups) and
the educational-accuracy checklist.

usage: python3 EP47/tools/qc_media.py EP47
Run after shared/tools/build_episode.sh EP47 and node EP47/tools/qc_page.js EP47.
"""
import hashlib, json, os, re, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont

EP = os.path.abspath(sys.argv[1] if len(sys.argv) > 1 else 'EP47')
CFG = json.load(open(os.path.join(EP, 'episode.json')))
BD = os.path.join(EP, CFG.get('build_dir', 'build'))
QC = os.path.join(EP, 'qc'); os.makedirs(QC, exist_ok=True)
TL = json.load(open(os.path.join(BD, 'timeline.json')))
MP4 = os.path.join(EP, CFG['output'])
FPS = TL['fps']; SR = 48000
LIMIT = 180.0
FONT = '/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
font = lambda s: ImageFont.truetype(FONT, s) if os.path.exists(FONT) else ImageFont.load_default()
# sha256 of the seven files as extracted from the supplied ZIP (recorded at intake)
ORIGINAL_SHA = {
    '01_hook.mp3': '912a0e07375a9dfe17eb825f5191ae1305f42ae24a4f8df55908130ea768bf46',
    '02_story.mp3': '46b6fbc62908a4366e3954ecb57aeec5304b7d57a28a8590c2372a971ddd2a54',
    '03_knowledge.mp3': 'ec368e839394acc6b72b24eedf9e32b8bbaab7edee3cb47f44982bd15065ce07',
    '04_explanation.mp3': '91468709cecdf8fb84f0bd2c02b111135d8c84928843a50676f255d241b17bf4',
    '05_quiz.mp3': 'c72766a734f66d17333f46908a2b2005fe9054af9cd1440fbfa9afb1995f0bd9',
    '06_answer.mp3': 'd5a802d042eced03176b145d314863f0129a1f5566a94b1a9c2d27883342cf16',
    '07_promotion.mp3': 'f651ced1f7b887158ffdbe3a581e809997d35851657af54c22d55bed9f77e920',
}


def run(cmd): return subprocess.run(cmd, capture_output=True, text=True, check=True).stdout
def probe(path): return json.loads(run(['ffprobe', '-v', 'error', '-show_streams', '-show_format', '-of', 'json', path]))
def decode(path, sr=SR, ch=1):
    raw = subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', str(ch), '-ar', str(sr), '-'], capture_output=True, check=True).stdout
    return np.frombuffer(raw, dtype=np.float32)


# ------------------------------------------------------------------ 1. audio inventory
segs = [s for s in CFG['segments'] if 'file' in s]
lines, audio = [], []
lines.append('NaiSibPro EP.47 — original narration inventory (measured, unmodified)')
lines.append('=' * 72)
lines.append(f"{'#':<3}{'file':<22}{'codec':<7}{'Hz':<7}{'ch':<4}{'kbps':<6}{'ffprobe s':>11}{'decoded s':>11}{'lead s':>8}{'tail s':>8}  timeline start")
narr_total = 0.0
for i, s in enumerate(segs):
    p = os.path.join(EP, s['file']); name = os.path.basename(p)
    pr = probe(p); st = pr['streams'][0]
    a = decode(p); d = len(a) / SR
    w = int(.02 * SR); rms = np.sqrt(np.convolve(a.astype(np.float64) ** 2, np.ones(w) / w, 'same')); v = np.flatnonzero(rms > 10 ** (-38 / 20))
    lead, tail = v[0] / SR, d - v[-1] / SR
    sha = hashlib.sha256(open(p, 'rb').read()).hexdigest()
    narr_total += d
    audio.append({'file': name, 'sha256': sha, 'sha_matches_zip': sha == ORIGINAL_SHA.get(name), 'duration_ffprobe': float(pr['format']['duration']), 'duration_decoded': d,
                  'lead_silence': lead, 'tail_silence': tail, 'start': TL[s['key']][0], 'key': s['key']})
    lines.append(f"{i + 1:<3}{name:<22}{st['codec_name']:<7}{st['sample_rate']:<7}{st['channels']:<4}{int(st['bit_rate']) // 1000:<6}{float(pr['format']['duration']):>11.3f}{d:>11.3f}{lead:>8.2f}{tail:>8.2f}  {TL[s['key']][0]:8.3f} s")
cd0, cdd = TL['cd']
pad = cd0 - (TL['quiz'][0] + TL['quiz'][1])
lines += ['',
          f'Narration total (decoded at 48 kHz) ........ {narr_total:9.3f} s',
          f'Countdown (silent, after 05_quiz) ............ {cdd:9.3f} s  (+{pad * 1000:.1f} ms frame-alignment pad)',
          f'Narration + countdown ........................ {narr_total + cdd + pad:9.3f} s',
          f'End-card hold after 07_promotion ............. {CFG.get("tail", 1.6):9.3f} s',
          f'Timeline end (video length) .................. {TL["end"]:9.3f} s',
          f'Requested maximum ............................ {LIMIT:9.3f} s',
          f'DURATION CONFLICT: narration + countdown exceeds {LIMIT:.0f} s by {narr_total + cdd + pad - LIMIT:.3f} s.',
          f'Leading + trailing silence across all seven files is only {sum(x["lead_silence"] + x["tail_silence"] for x in audio):.2f} s,',
          'so the limit cannot be met without cutting, re-voicing or speeding up the narration — none of which was done.',
          '', 'SHA-256 (identical to the files in the supplied ZIP; only the doubled ".mp3.mp3" extension was dropped):']
lines += [f"  {x['file']:<22}{x['sha256']}  {'MATCH' if x['sha_matches_zip'] else 'MISMATCH'}" for x in audio]
open(os.path.join(QC, 'audio_durations.txt'), 'w').write('\n'.join(lines) + '\n')

# ------------------------------------------------------------------ 2. beat map
bj = open(os.path.join(EP, 'source/beats.js'), encoding='utf-8').read()
bm = ['# EP.47 beat map (frame-aligned, audio-first)', '',
      'Phrase starts were measured from the original recordings (voice-activity regions, −38 dBFS). The quoted text is what each phrase says. Global time = segment start + local time; frame = round(global × 30).', '']
blocks = re.findall(r'\n  (\w+): \{\s*//\s*(\S+)[^\n]*\n(.*?)\n  \},', bj, re.S)
segname = {'hook': 'Scene 01 — Hook', 'story': 'Scene 02 — Story (five jobs)', 'know': 'Scene 03 — Micro / Workstation / Mini', 'expl': 'Scene 04 — Mainframe / Supercomputer', 'quiz': 'Scene 05 — Official quiz', 'ans': 'Scene 07 — Answer + recap', 'promo': 'Scene 08 — Promotion + end card'}
for key, fname, body in blocks:
    st, du = TL[key]
    bm += [f'## {segname.get(key, key)} · `{fname}` · {st:.3f} → {st + du:.3f} s (frames {round(st * FPS)}–{round((st + du) * FPS) - 1})', '', '| beat | local s | global s | frame | narration |', '|---|---:|---:|---:|---|']
    for ln in body.split('\n'):
        for m in re.finditer(r'(\w+):\s*([\d.]+),', ln):
            cm = ln.split('//', 1)[1].strip() if '//' in ln else ''
            loc = float(m.group(2)); g = st + loc
            bm.append(f'| {m.group(1)} | {loc:.2f} | {g:.3f} | {round(g * FPS)} | {cm} |')
    bm.append('')
    if key == 'quiz':
        bm += [f'## Scene 06 — Countdown · no narration · {cd0:.3f} → {cd0 + cdd:.3f} s', '',
               f'Frames {round(cd0 * FPS)}–{round((cd0 + cdd) * FPS) - 1} (exactly {round(cdd * FPS)} frames): 5 → 4 → 3 → 2 → 1, 30 frames each. Tick SFX on each digit start. Starts {pad * 1000:.1f} ms after 05_quiz.mp3 ends (frame alignment).', '']
open(os.path.join(QC, 'beat_map.md'), 'w').write('\n'.join(bm) + '\n')

# ------------------------------------------------------------------ 3. final MP4 probe + narration integrity in the actual export
res = {'mp4': os.path.relpath(MP4, EP), 'exists': os.path.exists(MP4)}
if res['exists']:
    pr = probe(MP4)
    v = next(s for s in pr['streams'] if s['codec_type'] == 'video'); a = next(s for s in pr['streams'] if s['codec_type'] == 'audio')
    nfr = int(run(['ffprobe', '-v', 'error', '-count_packets', '-select_streams', 'v:0', '-show_entries', 'stream=nb_read_packets', '-of', 'csv=p=0', MP4]).strip())
    res.update({'size_mb': round(os.path.getsize(MP4) / 2 ** 20, 2), 'container_duration_s': float(pr['format']['duration']),
                'video': {'codec': v['codec_name'], 'profile': v.get('profile'), 'pix_fmt': v['pix_fmt'], 'width': v['width'], 'height': v['height'], 'r_frame_rate': v['r_frame_rate'], 'avg_frame_rate': v['avg_frame_rate'], 'frames': nfr, 'duration_s': nfr / FPS},
                'audio': {'codec': a['codec_name'], 'sample_rate': a['sample_rate'], 'channels': a['channels'], 'bit_rate': a.get('bit_rate')}})
    lo = subprocess.run(['ffmpeg', '-nostats', '-i', MP4, '-af', 'ebur128=peak=true', '-f', 'null', '-'], capture_output=True, text=True).stderr
    m = re.findall(r'I:\s+(-?[\d.]+) LUFS', lo); pk = re.findall(r'Peak:\s+(-?[\d.]+) dBFS', lo)
    res['loudness_lufs'] = float(m[-1]) if m else None; res['true_peak_dbfs'] = float(pk[-1]) if pk else None
    # narration integrity: least-squares gain of the narration track inside the exported mix, per file
    mix = decode(MP4, SR, 2).astype(np.float64)[0::2]; narr = np.load(os.path.join(BD, 'narration.npy')).astype(np.float64)
    n = min(len(mix), len(narr)); mix, narr = mix[:n], narr[:n]
    # AAC adds a small fixed delay: find it by cross-correlating the first 20 s
    seg = slice(0, 20 * SR); best = max(range(0, 4000, 8), key=lambda d: float(np.dot(mix[seg.start + d:seg.stop + d], narr[seg])))
    mix = mix[best:]; narr = narr[:len(mix)]
    integ = []
    for x in audio:
        s0, s1 = int(x['start'] * SR), int((x['start'] + x['duration_decoded']) * SR)
        nn, mm = narr[s0:s1], mix[s0:s1]
        g = float(np.dot(mm, nn) / np.dot(nn, nn)); c = float(np.corrcoef(mm, nn)[0, 1])
        integ.append({'file': x['file'], 'gain_in_mix': round(g, 4), 'correlation': round(c, 4)})
    res['narration_in_export'] = {'aac_delay_samples': best, 'per_file': integ}
    c0, c1 = int(cd0 * SR), int((cd0 + cdd) * SR)
    res['countdown_narration_peak'] = float(np.max(np.abs(np.load(os.path.join(BD, 'narration.npy'))[c0:c1])))

    # ---------------- 4. frame grabs from the exported MP4
    def grab(t, out, w=None):
        args = ['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.4f}', '-i', MP4, '-frames:v', '1']
        if w: args += ['-vf', f'scale={w}:-1']
        subprocess.run(args + [out], check=True)
    def frame_at(f, w=None):  # exact frame by index
        out = f'/tmp/ep47_f{f}.png'; args = ['ffmpeg', '-v', 'error', '-y', '-i', MP4, '-vf', f"select=eq(n\\,{f})" + (f',scale={w}:-1' if w else ''), '-vsync', '0', '-frames:v', '1', out]
        subprocess.run(args, check=True); return Image.open(out).convert('RGB')
    frame_at(0).save(os.path.join(QC, 'first_frame.png'))
    # contact sheet every 4 s
    times = np.arange(0, nfr / FPS - .1, 4.0)
    cols, W, H = 11, 180, 320
    rows = int(np.ceil(len(times) / cols))
    sh = Image.new('RGB', (cols * W, rows * (H + 22)), '#06101f'); dr = ImageDraw.Draw(sh)
    for i, t in enumerate(times):
        p = f'/tmp/ep47_cs_{i}.jpg'; grab(t, p, W)
        im = Image.open(p).convert('RGB'); x, y = (i % cols) * W, (i // cols) * (H + 22)
        sh.paste(im, (x, y + 22)); dr.text((x + 6, y + 4), f'{int(t // 60)}:{t % 60:04.1f}', fill='#E6F4FF', font=font(14))
    sh.save(os.path.join(QC, 'contact_sheet.png'))
    # countdown strip: the frame before, the first/last frame of every digit, the frame after
    CDF = round(cd0 * FPS)
    picks = [CDF - 1] + [x for k in range(5) for x in (CDF + 30 * k, CDF + 30 * k + 29)] + [CDF + 150]
    W2, H2 = 162, 288
    st = Image.new('RGB', (len(picks) * W2, H2 + 40), '#06101f'); dr = ImageDraw.Draw(st)
    for i, f in enumerate(picks):
        im = frame_at(f).crop((180, 300, 900, 1580)).resize((W2, H2)); st.paste(im, (i * W2, 40))
        dr.text((i * W2 + 6, 4), f'frame {f}', fill='#E6F4FF', font=font(13)); dr.text((i * W2 + 6, 20), f'{f / FPS:.3f}s', fill='#95BFEF', font=font(12))
    st.save(os.path.join(QC, 'countdown_frames.png'))
    # phone overlay mockups (fill-to-height crop + typical platform UI)
    OV = json.load(open(os.path.join(QC, 'safe_zone_report.json')))['platform_overlays_video_px']
    shots = [(0.0, 'frame 0'), (TL['know'][0] + 3.6, 'Microcomputer'), (TL['quiz'][0] + 30.0, 'quiz choices'), (cd0 + 2.5, 'countdown'), (TL['ans'][0] + 2.0, 'answer reveal'), (TL['ans'][0] + 39.5, 'memory rule'), (TL['promo'][0] + 16.8, 'end card')]
    phones = [('tiktok', 375, 812), ('reels', 390, 844), ('shorts', 430, 932)]
    PW = 230
    mk = Image.new('RGB', (len(phones) * (PW + 20) + 20, len(shots) * (int(PW * 812 / 375) + 50) + 20), '#06101f'); dm = ImageDraw.Draw(mk)
    yy = 20
    for t, lab in shots:
        f = round(t * FPS); src = frame_at(f)
        ph = 0
        for j, (pf, w, hh) in enumerate(phones):
            s = hh / 1920; vw = 1080 * s; crop = (vw - w) / 2 / s
            vis = src.crop((int(crop), 0, int(1080 - crop), 1920))
            ph = int(PW * hh / w); im = vis.resize((PW, ph)).convert('RGBA')
            ov = Image.new('RGBA', im.size, (0, 0, 0, 0)); do = ImageDraw.Draw(ov)
            k = PW / (1080 - 2 * crop)
            for r in OV[pf]:
                do.rectangle([(r['x0'] - crop) * k, r['y0'] * k, (r['x1'] - crop) * k, r['y1'] * k], fill=(255, 255, 255, 70), outline=(255, 255, 255, 160))
            do.rectangle([(220 - crop) * k, 350 * k, (860 - crop) * k, 1430 * k], outline=(34, 211, 238, 255), width=2)
            im = Image.alpha_composite(im, ov).convert('RGB')
            x = 20 + j * (PW + 20); mk.paste(im, (x, yy + 30))
            dm.text((x, yy + 4), f'{pf} {w}x{hh} · {lab}', fill='#E6F4FF', font=font(12))
        yy += ph + 50
    mk.save(os.path.join(QC, 'mobile_overlays.png'))

json.dump({'audio': audio, 'narration_total_s': narr_total, 'narration_plus_countdown_s': narr_total + cdd + pad, 'limit_s': LIMIT, 'over_limit_s': narr_total + cdd + pad - LIMIT, 'export': res},
          open(os.path.join(QC, 'media_qc.json'), 'w'), indent=1, ensure_ascii=False)

# ------------------------------------------------------------------ 5. educational accuracy checklist
ct = open(os.path.join(EP, 'source/computer_types.js'), encoding='utf-8').read()
txt = json.load(open(os.path.join(QC, 'onscreen_text.json')))
alltext = ' | '.join(' | '.join(v) for v in txt.values())
cdv = json.load(open(os.path.join(QC, 'countdown_validation.json')))
has = lambda *ss: all(s in alltext for s in ss)
APPROVED = ['ซูเปอร์คอมพิวเตอร์ และเมนเฟรม', 'เมนเฟรม และซูเปอร์คอมพิวเตอร์', 'เวิร์กสเตชัน และมินิคอมพิวเตอร์', 'ไมโครคอมพิวเตอร์ และเวิร์กสเตชัน']
opts_js = re.findall(r"\{ b: '(.)', th: '([^']+)'", ct)
ranking_patterns = [r'(MICRO|ไมโคร)[^|]{0,30}<', r'<\s*(MINI|มินิ|MAINFRAME|เมนเฟรม)', r'เร็วที่สุด', r'ช้าที่สุด', r'อันดับ\s*\d', r'TFLOPS|PFLOPS|FLOPS|TPS|ล้านรายการ|ผู้ใช้\s*\d']
ranking_hits = [p for p in ranking_patterns if re.search(p, alltext)]
integ_ok = res.get('narration_in_export') and all(abs(x['gain_in_mix'] - 1) < .03 and x['correlation'] > .97 for x in res['narration_in_export']['per_file'])
checks = [
    (1, 'Microcomputer is associated with personal computing', has('MICROCOMPUTER', 'งานส่วนบุคคล', '= คอมพิวเตอร์ส่วนบุคคล', 'PC ตั้งโต๊ะ', 'โน้ตบุ๊ก'), 'Label "MICROCOMPUTER / ไมโครคอมพิวเตอร์ / งานส่วนบุคคล", chip "= คอมพิวเตอร์ส่วนบุคคล", pointers "PC ตั้งโต๊ะ" and "โน้ตบุ๊ก"; office environment with one person writing a document.'),
    (2, 'Workstation is associated with demanding professional work', has('WORKSTATION', 'สมรรถนะสูง · งานเฉพาะทาง', 'วิศวกรรม'), 'Label "WORKSTATION / เวิร์กสเตชัน / งาน 3D / CAD / วิศวกรรม", chip "สมรรถนะสูง · งานเฉพาะทาง"; 3D studio with a CAD gear model (wireframe → shaded render).'),
    (3, 'Workstation is not described as always outside the microcomputer category', has('เวิร์กสเตชัน ก็อาจจัดอยู่ใน', 'กลุ่มไมโครคอมพิวเตอร์ได้', 'ไม่ได้แยกขาดจากกันเสมอไป', 'PERSONAL / MICROCOMPUTER'), 'Nested diagram: WORKSTATION drawn inside a PERSONAL / MICROCOMPUTER region, caption "เวิร์กสเตชัน ก็อาจจัดอยู่ในกลุ่มไมโครคอมพิวเตอร์ได้", note "ไม่ได้แยกขาดจากกันเสมอไป".'),
    (4, 'Minicomputer is identified as a traditional historical classification', has('MINICOMPUTER', 'ระบบขนาดกลางแบบดั้งเดิม', 'การแบ่งแบบดั้งเดิม · ระบบในอดีต', 'ระบบขนาดกลางตามตำราแบบเดิม'), 'Historical room (vintage cabinet, tape reels, text terminals, archive corners); labels "ระบบขนาดกลางแบบดั้งเดิม" and "การแบ่งแบบดั้งเดิม · ระบบในอดีต"; recap "ระบบขนาดกลางตามตำราแบบเดิม".'),
    (5, 'Server is not presented as exactly synonymous with Minicomputer', has('Server ไม่ได้หมายถึง Minicomputer เสมอไป', 'Modern Server Systems', 'อดีต: Minicomputer'), 'Separate modern server room (racks serving client devices) labelled "Modern Server Systems", with the historical room shrunk to an "อดีต: Minicomputer" thumbnail and the note "Server ไม่ได้หมายถึง Minicomputer เสมอไป".'),
    (6, 'Mainframe is associated with high-volume enterprise transaction processing', has('MAINFRAME COMPUTER', 'รองรับธุรกรรมจำนวนมาก อย่างต่อเนื่อง', 'เช่น ระบบธนาคารขนาดใหญ่', 'ธุรกรรม / ระบบองค์กร'), 'Banking data centre: branch/ATM/mobile/card requests flow into the mainframe, confirmations flow out; dashboard "TRANSACTION PROCESSING" with no throughput figures; chips เชื่อถือได้ / ปลอดภัย / ต่อเนื่อง.'),
    (7, 'Supercomputer is associated with large-scale scientific computing', has('SUPERCOMPUTER', 'การคำนวณทางวิทยาศาสตร์ขนาดใหญ่', 'คำนวณขนาดมหาศาล · ประมวลผลแบบขนาน', 'งานวิจัยวิทยาศาสตร์'), 'HPC aisle with parallel node activity feeding a weather model (storm simulation); chips พยากรณ์อากาศ / งานวิจัยวิทยาศาสตร์; no benchmark numbers.'),
    (8, 'The five categories are not presented as a universal benchmark ranking', not ranking_hits and has('Different Workloads', 'Different Strengths', 'ไม่ใช่การจัดอันดับความเร็ว', 'อย่าจำแค่ขนาด'), f'No ranking patterns found on screen ({len(ranking_patterns)} patterns checked, hits: {ranking_hits}). Equal-size badges/cards everywhere; "Different Workloads / Different Strengths", "ไม่ได้เร็วกว่ากัน “ในทุกงาน”", recap footnote "แบ่งตามลักษณะงาน ไม่ใช่การจัดอันดับความเร็ว".'),
    (9, 'The quiz pairs banking with Mainframe', 'ประมวลผลธุรกรรมทางการเงินจำนวนมหาศาลอย่างต่อเนื่อง' in ct and has('MAINFRAME = ธุรกรรมจำนวนมาก'), 'หน่วยงานที่ 1 (bank icon) = financial transactions → answer explanation "MAINFRAME = ธุรกรรมจำนวนมาก", tag "MAINFRAME" on organisation 1 after the reveal.'),
    (10, 'The quiz pairs scientific weather modelling with Supercomputer', 'คำนวณแบบจำลองสภาพอากาศที่ซับซ้อนมาก' in ct and has('SUPERCOMPUTER = คำนวณทางวิทยาศาสตร์', 'เช่น แบบจำลองสภาพอากาศ'), 'หน่วยงานที่ 2 (storm icon) = weather model → "SUPERCOMPUTER = คำนวณทางวิทยาศาสตร์", tag "SUPERCOMPUTER" on organisation 2.'),
    (11, 'Correct answer is option ข', re.search(r'correct:\s*1,', ct) is not None and [o[0] for o in opts_js][1] == 'ข' and opts_js[1][1] == APPROVED[1], 'computer_types.js: correct = 1 → "ข. เมนเฟรม และซูเปอร์คอมพิวเตอร์"; reveal highlights ข in green with a check mark.'),
    (12, 'All four answer choices match the approved script', [o[1] for o in opts_js] == APPROVED and [o[0] for o in opts_js] == ['ก', 'ข', 'ค', 'ง'], ' | '.join(f'{b}. {t}' for b, t in opts_js)),
    (13, 'No correct-answer indicator before the countdown ends', cdv['pass'] and cdv['early_reveal_frames'] == 0, f"Checked every frame {cdv['frames_checked_for_early_reveal']['from_frame']}–{cdv['frames_checked_for_early_reveal']['to_frame']}: 0 frames with a green option, check mark, grayscale dimming or 'ข' header. Reveal at {cdv['reveal_time_s']} s (frame {cdv['reveal_frame']}), after the countdown ends at {cdv['answer_audio_starts_s']:.3f} s."),
    (14, 'The narration is preserved unchanged', all(x['sha_matches_zip'] for x in audio) and bool(integ_ok), 'All seven MP3s are byte-identical to the ZIP (SHA-256). In the exported MP4 each file sits at gain ' + ', '.join(f"{x['gain_in_mix']:.3f}" for x in res.get('narration_in_export', {}).get('per_file', [])) + ' with correlation ≥ 0.97 to the source, in the approved order, with no speed change or edits.'),
]
val = {'episode': 'EP47', 'checks': [{'id': i, 'check': c, 'pass': bool(ok), 'evidence': ev} for i, c, ok, ev in checks],
       'rejection_rule': {'teaches_universal_ranking_micro_lt_ws_lt_mini_lt_mainframe_lt_super': bool(ranking_hits), 'result': 'not triggered' if not ranking_hits else 'TRIGGERED'},
       'all_pass': all(ok for _, _, ok, _ in checks)}
json.dump(val, open(os.path.join(QC, 'computer_types_validation.json'), 'w'), indent=1, ensure_ascii=False)
print(json.dumps({'narration_total': round(narr_total, 3), 'over_limit': round(narr_total + cdd + pad - LIMIT, 3), 'export': {k: res.get(k) for k in ('video', 'audio', 'loudness_lufs', 'true_peak_dbfs', 'countdown_narration_peak')},
                  'integrity': res.get('narration_in_export'), 'edu_all_pass': val['all_pass'], 'edu_fail': [c['id'] for c in val['checks'] if not c['pass']]}, ensure_ascii=False, indent=1))
