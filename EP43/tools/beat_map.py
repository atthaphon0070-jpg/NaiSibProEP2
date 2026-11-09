"""Writes qc/beat_map.md: every measured narration beat -> absolute time, frame, and the visual it drives."""
import json, os, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(HERE)
CFG = json.load(open(os.path.join(EP, 'episode.json'))); TL = json.load(open(os.path.join(EP, CFG.get('build_dir', 'build'), 'timeline.json')))
B = json.loads(subprocess.run(['node', os.path.join(HERE, 'dump_data.js')], capture_output=True, text=True, check=True).stdout)['BEATS']
FPS = TL['fps']
# heard phrase (timing transcription, approximate wording) and the visual beat it triggers
V = {
 'hook': [('exam', 'เตรียมสอบนายสิบ', 'Frame 0: title, subtitle, BIT→BYTE→KB→MB→GB→? teaser and the hook question already on screen'),
          ('comp', 'วิชาคอมพิวเตอร์', 'subtitle pill pulses'), ('ask', 'ข้อถามว่า', 'teaser ladder idles'),
          ('q', 'หน่วยข้อมูลที่ใหญ่ที่สุดคืออะไร', 'teaser cards rise, "?" card grows (01B)'),
          ('many', 'หลายคนอาจตอบว่า', '"หลายคนอาจตอบว่า…" header (01C)'), ('tb', 'เทราไบต์', 'TB card'), ('yb', 'หรือยอตตะไบต์', 'YB card + "ใหญ่สุดแล้ว… จริงเหรอ?" (not marked final)'),
          ('but', 'แต่รู้ไหมครับ', '"แต่รู้ไหม?" pill'), ('now', 'ปัจจุบันมีหน่วยที่ใหญ่กว่ายอตตะไบต์อย่างเป็นทางการแล้ว', 'Tower: YB + two hidden "?" platforms above (01D)'),
          ('today', 'วันนี้เราจะมาเรียงหน่วยข้อมูล', 'camera pulls back to the whole 13-level tower, "เรียงหน่วยข้อมูล เล็ก → ใหญ่" (01E)'),
          ('frombit', 'ตั้งแต่บิต', '"bit" chip at the bottom platform'), ('to', 'ไปจนถึงหน่วยที่ใหญ่ที่สุดตามมาตรฐานปัจจุบัน', 'light beam climbs to the top, "?" chip'),
          ('see', 'แล้วมาดูกันว่าคุณจะเรียงถูกหรือเปล่า', '"คุณจะเรียงถูกไหม?" card')],
 'story': [('buy', 'สมมุติว่าคุณกำลังเลือกซื้ออุปกรณ์เก็บข้อมูล', 'flash drive + hard disk on screen'), ('flash', 'แฟลชไดรฟ์มีความจุเป็นกิกะไบต์', 'flash drive hero + GB (02A)'),
           ('hdd', 'ฮาร์ดดิสก์มีความจุเป็นเทราไบต์', 'spinning hard disk + TB (02B)'), ('huge', 'แต่พอพูดถึงระบบจัดเก็บข้อมูลขนาดมหาศาล', 'data centre racks + network grow (02C)'),
           ('more', 'ก็มีหน่วยที่ใหญ่กว่านั้นอีก', '"มีหน่วยที่ใหญ่กว่านั้นอีก!"'), ('pb', 'ทั้งเพตะไบต์', 'PB (02D)'), ('eb', 'เอกซะไบต์ และอีกหลายหน่วย', 'EB above PB, upward camera'),
           ('q', 'คำถามคือ', 'blank ranking ladder (02E)'), ('order', 'ถ้าต้องเรียงทั้งหมดจากเล็กไปใหญ่', 'shuffled unit cards float beside it'), ('remember', 'คุณจะจำลำดับได้หรือไม่', '"จำลำดับได้หรือไม่?"')],
 'know': [('basic', 'เริ่มจากหน่วยพื้นฐานกันครับ', 'header'), ('bit', 'บิต', 'single bit tile flipping 0↔1, "bit (b)" (03A)'), ('val', 'เป็นหน่วยข้อมูลที่มีค่าได้เป็นศูนย์หรือหนึ่ง', '"มีค่าได้ 0 หรือ 1"'),
          ('four', 'สี่บิต', 'four bit tiles'), ('nibble', 'หนึ่งนิบเบิล', 'brace + "4 bits = 1 nibble" (03B)'), ('eight', 'แปดบิต', 'eight bit tiles in two groups'),
          ('byte', 'เท่ากับหนึ่งไบต์', 'Byte container, "8 bits = 1 Byte", "2 nibbles = 1 Byte" (03C)'), ('then', 'หลังจากนั้น ขนาดจะเพิ่มขึ้นเป็น', 'Byte folds into the tower platform'),
          ('kB', 'กิโลไบต์', 'camera rises, kB platform (03D)'), ('MB', 'เมกะไบต์', 'MB (03E)'), ('GB', 'กิกะไบต์', 'GB (03F)'), ('TB', 'และเทราไบต์', 'TB (03G)'),
          ('rem', 'จำลำดับนี้ให้แม่นนะครับ', 'camera pulls back to bit…TB (03H)'), ('notyet', 'แต่ยังไม่หมดเพียงเท่านี้ครับ', '"แต่ยังไม่หมด!" + two "?" platforms above TB')],
 'expl': [('next', 'ถัดจากเทราไบต์คือ', 'camera back on TB'), ('PB', 'เพตะไบต์', 'PB (04A)'), ('EB', 'ต่อด้วยเอกซะไบต์', 'EB (04B)'), ('ZB', 'เซตตะไบต์', 'ZB + flash (04C)'),
          ('YB', 'และยอตตะไบต์', 'YB + hold, "สูงสุดแล้วหรือยัง?" (04D)'), ('dec', 'โดยหน่วยที่มีคำนำหน้าตามระบบฐานสิบ', 'SI decimal-prefix card (04E)'),
          ('x1000', '(แต่ละระดับใหญ่กว่าก่อนหน้า 1,000 เท่า)', '"แต่ละขั้น × 1,000" + "bit → nibble → Byte ไม่ใช่ × 1,000"'),
          ('interest', 'แต่ที่น่าสนใจคือ', 'tower: YB with two hidden platforms above'), ('y2022', 'ในปี 2022', '"2022" (04F)'), ('approved', 'มีการรับรองคำนำหน้าที่ใหญ่ขึ้นอีก 2 ระดับ', '"NEW SI PREFIXES · +2 ระดับ"'),
          ('that', 'นั่นคือ', ''), ('ronna', 'รอนนา', 'RB platform revealed: RONNA · R, Ronnabyte (04G)'), ('quetta', 'และเควตตา', 'QB platform revealed: QUETTA · Q, Quettabyte (04H)'),
          ('sort', 'ถ้าเอาหน่วยเหล่านี้มาเรียงลำดับ', 'ZB / YB / RB / QB cards shuffled (04I)'), ('first', 'ใครอยู่ก่อน', 'shuffle'), ('last', 'ใครอยู่หลัง', 'shuffle'), ('test', 'ลองทำข้อสอบกันครับ', '"ลองทำข้อสอบกัน!", cards fly out')],
 'quiz': [('intro', 'มาทดสอบความรู้กันครับ', 'mascot + "มาทดสอบความรู้กัน!"'), ('q', 'ข้อใดเรียงหน่วยข้อมูลจากขนาดเล็กไปใหญ่ได้ถูกต้อง', 'question card'),
          ('think', 'ลองคิดให้ดีนะครับ', '"ลองคิดให้ดี · ให้เวลา 5 วินาที"'), ('five', 'ให้เวลา 5 วินาที', 'countdown starts after this phrase ends')],
 'ans': [('sol', 'เฉลย', '"เฉลย!"'), ('ko', 'ข้อ ก', 'option ก turns green + check (first highlight)'), ('kai', 'ไก่', ''), ('zb', 'เรียงจากเซตตะไบต์', 'ZB = 10²¹ Bytes (07B)'),
         ('yb', 'ไปยอตตะไบต์', 'YB = 10²⁴ Bytes (07C)'), ('rb', 'รอนนาไบต์', 'RB = 10²⁷ Bytes (07D)'), ('qb', 'และเควตตาไบต์', 'QB = 10³⁰ Bytes (07E), rows lock (07F)'),
         ('x1', 'เพราะยอตตะไบต์ใหญ่กว่าเซตตะไบต์', 'ZB × 1,000 = YB (07G)'), ('x2', 'รอนนาไบต์ใหญ่กว่ายอตตะไบต์', 'YB × 1,000 = RB'), ('x3', 'และเควตตาไบต์ใหญ่กว่ารอนนาไบต์', 'RB × 1,000 = QB'),
         ('quetta', 'เควตตาไบต์', 'QUETTA = 10³⁰ card (07H)'), ('largest', 'ใช้คำนำหน้าใหญ่ที่สุดตามมาตรฐานสากลในปัจจุบัน', 'QB = 10³⁰ B, "คำนำหน้า SI ขนาดใหญ่ที่สุดที่รับรองในปัจจุบัน", source + disclaimer'),
         ('remember', 'จำไว้นะครับ', 'full 13-level ladder (scrolling)'), ('notonly', 'หน่วยข้อมูลไม่ได้หยุดอยู่แค่เทราไบต์หรือยอตตะไบต์อีกต่อไป', 'ladder scrolls to QB; TB and YB rows pulse'),
         ('dont', 'และอย่าลืมว่า', '"อย่าลืม!"'), ('bit', 'บิต', 'b tile'), ('byte', 'กับไบต์', 'B tile, ≠, "bit (b) ≠ Byte (B)" (07I)'), ('diff', 'ก็เป็นคนละหน่วยกันครับ', '"1 B = 8 b" + 8 bit tiles')],
 'promo': [('who', 'ใครตอบถูกข้อ ก ไก่', '"คุณตอบถูกข้อ ก. ไหม?" (08A)'), ('comment', 'คอมเมนต์มาบอกกันหน่อย', 'three comment bubbles'), ('before', 'แล้วก่อนดูคลิปนี้', ''),
           ('know', 'คุณรู้จักเควตตาไบต์มาก่อนหรือเปล่า', '"เคยรู้จัก Quettabyte ไหม?" + QB badge (08B)'), ('want', 'ถ้าอยากฝึกข้อสอบคอมพิวเตอร์อีกเยอะ ๆ', ''),
           ('nsp', 'มาฝึกกับ NaiSibPro นายสิบโปร', 'official logo + wordmark (08C)'), ('bank', 'รวมข้อสอบมากกว่าหมื่นข้อ', '10,000+ (08D)'), ('weekly', 'อัปเดตทุกสัปดาห์', '"อัปเดตทุกสัปดาห์"'),
           ('like', 'กดไลก์', 'LIKE · SHARE · FOLLOW, LIKE pressed (08E)'), ('share', 'กดแชร์', 'SHARE pressed'), ('follow', 'และกดติดตามไว้', 'FOLLOW pressed'), ('bye', 'แล้วเจอกันในข้อถัดไปครับ', 'end card')],
}
L = ['# EP43 beat map (audio-first)', '', f'FPS {FPS}. Times are absolute video seconds = segment start (from `audio_prep.py`) + phrase start measured in the supplied MP3.',
     'Phrase wording is what the local timing transcription heard (used for timing only, never as audio).', '']
L += ['| Segment | Start (s) | Length (s) |', '|---|---:|---:|'] + [f"| {s['key']} | {TL[s['key']][0]:.3f} | {TL[s['key']][1]:.3f} |" for s in CFG['segments']] + ['']
for seg, rows in V.items():
    st = TL[seg][0]; L += [f'## {seg}', '', '| Local (s) | Video (s) | Frame | Narration phrase | Visual beat |', '|---:|---:|---:|---|---|']
    for key, phrase, vis in rows:
        lt = B[seg][key]; L.append(f'| {lt:.2f} | {st + lt:.3f} | {round((st + lt) * FPS)} | {phrase} | {vis} |')
    if seg == 'know': L.append(f"| {', '.join(f'{x:.2f}' for x in B['know']['r'])} | | | บิต นิบเบิล ไบต์ กิโล เมกะ กิกะ เทรา | recap: active level enlarges word by word |")
    if seg == 'quiz':
        for i, b in enumerate('กขคง'):
            L.append(f"| {B['quiz']['opt'][i]:.2f} | {st + B['quiz']['opt'][i]:.3f} | {round((st + B['quiz']['opt'][i]) * FPS)} | ข้อ {b} | option {b} card; tokens at {', '.join(f'{x:.2f}' for x in B['quiz']['tok'][i])} |")
    if seg == 'quiz':
        cd = TL['cd'][0]; L.append(f"| — | {cd:.3f} | {round(cd * FPS)} | (silence) | countdown 5→4→3→2→1, 30 frames each, frames {round(cd * FPS)}–{round(cd * FPS) + 149} |")
    L.append('')
open(os.path.join(EP, 'qc', 'beat_map.md'), 'w').write('\n'.join(L) + '\n')
print('ok', len(L))
