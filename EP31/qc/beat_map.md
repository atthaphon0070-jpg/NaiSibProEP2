# EP.31 beat map (audio-first)

Phrase boundaries come from silence detection on each narration file (−40 dBFS, 20 ms RMS window, pauses of 0.14 s or more). No speech-to-text model was reachable from the build container, so each measured phrase is matched to the script's voice anchors by order and length. The cue values live in `source/beats.js` (segment-local seconds). The promo cues are measured automatically by `audio_prep.py` (`"cues": 10`).

Absolute time = segment start + local time. The frame number is round(absolute × 30).

## 01_hook.mp3 — start 0.000 s
| Local s | Phrase (measured span) | Visual |
|---:|---|---|
| 0.00 | 0.07–1.02 "เตรียมสอบนายสิบ!" | Keyword pill already fully visible at frame 0. Clock shown at 02:45 |
| 1.38 | 1.38–2.31 "วิชาคณิตศาสตร์" | Cyan subject chip |
| 2.67 | 2.67–4.36 "ข้อนี้คนชอบตอบผิด!" | Red warning pill |
| 4.98 | 4.98–7.30 "เวลา สามนาฬิกาสิบห้านาที" | Time-lapse from 02:45 to 03:15. Both hands are driven by time. Digital readout |
| 7.53 | 7.53–9.23 "เข็มยาวชี้เลขสาม!" | Minute hand glows. Numeral 3 turns blue |
| 9.66 | 9.66–11.88 "แล้วเข็มสั้นก็อยู่ตรงเลขสาม…ใช่ไหม?" | "ความเข้าใจผิด" card: wrong-model clock with both hands on 3, then "0° ?" |
| 14.95 | 14.95–16.42 | "ผิด!" stamp on the wrong model |
| 16.87 | 16.87–19.77 "เพราะเข็มสั้นไม่ได้หยุดอยู่กับที่!" | Flash back to the accurate clock. At 17.66, camera push-in toward 3 with a dashed line marking exactly 3. Hour hand glows past it. "เข็มสั้นขยับแล้ว!" |
| 20.14 | 20.14–22.50 | "?" badge. The 7.5° value is not revealed yet |

## 02_story.mp3 — start 22.753 s
| Local s | Phrase | Visual |
|---:|---|---|
| 0.08 | "สมมติว่าคุณกำลังนั่งสอบนายสิบตำรวจ" | Layered exam room: wall clock (03:15), whiteboard, other candidates, student A behind the desk |
| 2.99 | 2.99–4.25 | Question paper slides up |
| 4.83 / 7.21 | "เวลา สามนาฬิกาสิบห้านาที" / "…ทำมุมกันกี่องศา?" | The two question lines appear. The paper carries an accurate 03:15 clock |
| 10.41 | 10.41–13.49 | Thought bubble: "เข็มยาวชี้ 3 / เข็มสั้นก็ชี้ 3? / ทับกัน = 0°" |
| 13.81 / 14.80 | "คุณเลยรีบตอบว่า" / "ศูนย์องศา!" | The pencil writes 0° and circles it in red. The student grins |
| 16.58 / 17.92 | 16.58–19.84 | The student looks surprised, then the "ผิด!" stamp lands |
| 20.11 | 20.11–24.75 "ถ้าซูมเข้าไปดูดี ๆ …เลยเลขสามไปแล้ว!" | Zoom to a full-screen accurate clock on navy. A ×3.4 magnifier on 3 shows the hour hand below the minute hand. "เข็มสั้นเลยเลข 3 ไปแล้ว!" |
| 25.32 | 25.32–27.33 | "?" badge |

## 03_knowledge.mp3 — start 50.312 s
| Local s | Phrase | Visual |
|---:|---|---|
| 0.11 / 1.94 / 2.85 | "จำตัวเลขสำคัญแค่สองตัวครับ!" … | Header, then the 6° badge, then the 0.5° badge |
| 4.30 → 9.13 | "เข็มยาว หมุนครบ 360° ใน 60 นาที" | Time-lapse from 03:00 to 04:00. The minute hand makes a full lap with a blue trail. The hour hand stays dimmed but still moves 30°. "360° ÷ 60 นาที" |
| 9.30 / 10.21 | | "= 6°", then "เข็มยาว = 6° ต่อนาที" |
| 12.45 | | Rewind from 04:00 to 03:00 (time value) |
| 12.87 → 19.90 | "เข็มสั้น เคลื่อนที่ 30° ในหนึ่งชั่วโมง…" | Time-lapse from 03:00 to 04:00 with the hour hand emphasised. A pink arc runs from 3 to 4. "30° ÷ 60 นาที = 0.5°", then "เข็มสั้น = 0.5° ต่อนาที" |
| 20.57 / 21.97 | "เข็มสั้นเคลื่อนที่ตลอดเวลา ไม่ได้กระโดดทีละชั่วโมง!" | Left: jumping hour hand, marked with ✗ and "แบบนี้ผิด". Right: continuous hour hand, marked with ✓. Shared digital time |
| 26.17 / 27.19 / 29.37 | "เข็มยาว นาทีละหก! เข็มสั้น นาทีละครึ่งองศา!" | Summary cards: MINUTE = 6°/min and HOUR = 0.5°/min, with a live clock |

## 04_explanation.mp3 — start 82.103 s
| Local s | Phrase | Visual |
|---:|---|---|
| 0.06 | "ลองดูเวลา สามนาฬิกาตรง!" | Clock at 03:00 |
| 2.80 / 4.46 / 6.19 | | 12 and the minute hand glow, then 3 and the hour hand glow, then the yellow 90° sector and "03:00 = 90°" |
| 8.55 → 12.6 | "เมื่อเวลาผ่านไปสิบห้านาที เข็มทั้งสองก็เคลื่อนที่!" | Ghost hands stay at the 03:00 positions. Time-lapse to 03:15 traces a 90° blue arc and a 7.5° pink arc. No difference is shown |
| 13.06 / 14.57 | "หาตำแหน่งของเข็มยาว จากจำนวนนาทีคูณหก" | "เข็มยาว = นาที × 6". A position arc runs from 12 to the minute hand |
| 18.09 / 21.30 | "ชั่วโมงคูณสามสิบ แล้วบวกจำนวนนาทีคูณศูนย์จุดห้า" | "(ชั่วโมง × 30) + (นาที × 0.5)". A position arc runs from 12 to the hour hand |
| 24.11 | "นำตำแหน่งทั้งสองมาหาผลต่างของมุม" | "ผลต่าง = \| เข็มสั้น − เข็มยาว \|" plus the smaller-angle rule note |
| 27.78 | "พร้อมแล้ว มาลองทำข้อสอบกันครับ!" | "มาลองทำข้อสอบกัน!" |

## 05_quiz.mp3 — start 111.987 s
| Local s | Visual |
|---:|---|
| 0.07 | Header "เตรียมสอบนายสิบ • วิชาคณิตศาสตร์" |
| 1.93 | Question card (the exact approved wording) |
| 4.47 | Accurate 03:15 clock with no exaggeration |
| 9.44 / 10.93 / 13.57 / 15.92 | ก. 0°, ข. 7.5°, ค. 15° and ง. 30° each appear as the narration reads it. All four are neutral |
| 19.20 | Header changes to "เข็มสั้นไม่ได้หยุดนิ่ง!". The hour hand pulses as a hint, not as the answer |

## Countdown — 135.167 s to 140.167 s (frames 4055–4204)
150 frames with no narration. The numerals run 5→4→3→2→1 at 30 frames each, with a ring and a tick each second. The clock moves left and keeps showing 03:15. All four choices stay neutral.

## 06_answer.mp3 — start 140.167 s
| Local s | Phrase | Visual |
|---:|---|---|
| 0.07 / 1.10 | "เฉลย! ข้อ ข. เจ็ดจุดห้าองศา!" | "เฉลย!". At 1.10, ข turns green with a check and the others dim. Chime and confetti |
| 3.95 | | Layout changes to calculation mode. The quiz clock grows into the 480 px answer clock |
| 5.50 → 7.5 / 8.57 | "สิบห้านาที คูณหก เท่ากับเก้าสิบองศา" | Time runs from 03:00 to 03:15 with a blue arc. "15 × 6 = 90°" and a 90° tag |
| 10.74 | "เข็มสั้น เริ่มที่เลขสาม หรือเก้าสิบองศา" | Rewind to 03:00. A pink 0→90° arc. "เข็มสั้นเริ่มที่เลข 3 = 90°" |
| 11.91 → 15.4 | | Time runs from 03:00 to 03:15 while the hour hand travels 7.5°. A ghost hour hand stays at 3 |
| 16.72 / 18.64 | "สิบห้า คูณศูนย์จุดห้า เท่ากับเจ็ดจุดห้าองศา" | "15 × 0.5 = 7.5°" |
| 20.26 / 22.45 | "เข็มสั้นอยู่ที่ เก้าสิบเจ็ดจุดห้าองศา" | "90° + 7.5° = 97.5°" and a 97.5° tag |
| 24.31 / 27.46 | "เก้าสิบเจ็ดจุดห้า ลบเก้าสิบ เท่ากับเจ็ดจุดห้าองศา" | "97.5° − 90° = 7.5°", a true-scale 7.5° yellow sector and the ×3 magnified inset |
| 29.88 / 33.54 / 38.05 | Distractor explanations | ก. 0° shows a red line at "exactly 3". ค. 15° gives its reason. ง. 30° shows a red 3→4 band |
| 41.89 / 44.69 | "เข็มยาว นาทีละหกองศา! เข็มสั้น นาทีละครึ่งองศา!" | Memory cards |
| 47.29 | | "03:15 = 7.5°" final card with confetti |

## 07_promotion.mp3 — start 189.564 s (measured cues 0.065, 1.532, 3.223, 6.005, 9.09, 11.048, 12.454, 15.463, 16.091, 18.103)
| Cue | Visual |
|---|---|
| 0.065 | "ตอบ ข. ถูกไหม?" with three comment bubbles and a comment bar |
| 3.223 | Original logo, "NaiSibPro" and "นายสิบโปร" |
| 6.005 / 9.09 | "10,000+ ข้อ" count-up, then "อัปเดตทุกสัปดาห์!" |
| 11.048 | Six subject tiles under "ครบหลายวิชา เตรียมสอบนายสิบตำรวจ" |
| 15.463 / 16.091 / 16.84 | Like, share and follow buttons, each pressed in turn |
| 18.103 | End card: logo, wordmark, tagline and follow CTA. A 1.0 s tail after the narration |
