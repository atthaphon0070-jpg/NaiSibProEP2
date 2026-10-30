# EP.32 — Beat map (audio-first)

All times are measured from the supplied recordings. Segment starts are absolute times in the video. Beat times are local to each recording, which is how they appear in `source/index.html`.

**How the times were found:**

- Phrase starts come from pause detection on the decoded audio: RMS at −40 dBFS, gaps longer than 0.18 s.
- Law names were located by acoustic keyword matching: subsequence DTW on MFCCs, with templates cut from the same voice reading the quiz choices in `05_quiz.mp3`.
- No speech-to-text model was available offline (the network policy blocked the model download), so the in-between wording follows the brief's voice anchors.

| Seg | File | Start (s) | End (s) | Length (s) |
|---|---|---:|---:|---:|
| 1 Hook | 01_hook.mp3 | 0.000 | 28.918 | 28.918 |
| 2 Story | 02_story.mp3 | 28.918 | 71.680 | 42.762 |
| 3 Hierarchy | 03_knowledge.mp3 | 71.680 | 137.482 | 65.802 |
| 4 Traps + recap | 04_explanation.mp3 | 137.482 | 191.687 | 54.204 |
| 5 Quiz | 05_quiz.mp3 | 191.687 | 215.954 | 24.268 |
| — frame-align pad | silence | 215.954 | 215.967 | 0.012 |
| 6 Countdown 5→1 | silence | 215.967 | 220.967 | 5.000 (frames 6479–6628) |
| 7 Answer | 06_answer.mp3 | 220.967 | 277.652 | 56.686 |
| 8 Promo + end card | 07_promotion.mp3 | 277.652 | 296.408 | 18.756 |
| end-card hold | tail | 296.408 | 297.608 | 1.200 |

Scene transitions use the shared brand wipe, centred on each segment boundary (0.9 s). No two narration files overlap. No silent title screens were added.

## 1 Hook — 01_hook.mp3

| t (s) | Audio cue | Visual |
|---:|---|---|
| 0.00 | "เตรียมสอบนายสิบ!" | Frame 0 already shows **เตรียมสอบ / นายสิบ** (navy and gold). Four documents stand vertically behind it. |
| 1.38 | "วิชากฎหมาย …" | Pill **วิชากฎหมาย**. At 2.5 s, red tag **ข้อนี้หลายคนจำลำดับผิด!** |
| 4.75 | pause | Title shrinks to the top. A scale enters. |
| 5.10 / 6.54 | พ.ร.บ. (5.55) / พ.ร.ก. (6.73) | Two identical cards land on the pans. |
| 7.83 | "…มีศักดิ์สูงกว่ากัน?" | "?" appears with **ฉบับไหนมีศักดิ์สูงกว่า?**. The scale keeps wobbling, so no answer is given. |
| 13.2–17.3 | รัฐธรรมนูญ (13.72), พ.ร.ฎ. (14.77), กฎกระทรวง (16.21) | A hidden pyramid of dashed tiers with "?" on each. The three cards hover around it. At 17.3 s: **อยู่ตรงไหนของลำดับ?** |
| 19.58 | "วันนี้เราจะมาเรียงลำดับศักดิ์…" | Fast preview: tiers drop in from the bottom up, then the equals sign and a scan light. At 21.6 s, banner **ลำดับศักดิ์ของกฎหมายไทย**. |
| 24.70 | closing line | Mascot and chip **EP.32 · วิชากฎหมาย**. |

## 2 Story — 02_story.mp3 (tag "สถานการณ์สมมติ · ไม่ใช่คดีจริง" throughout)

| t | Cue | Visual |
|---:|---|---|
| 0–1.4 | opening | Original 2D government office: window blinds, clock, calendar, binders, filing cabinet, desk and monitor. Slow camera push. |
| 1.40 | "เจ้าหน้าที่ใหม่…" | Officer (rig A) at the desk, tag **เจ้าหน้าที่ใหม่**. |
| 4.10–5.6 | colleague | Colleague (rig F) walks in. The officer turns to her. |
| 5.6 / 6.27 | กฎกระทรวง (6.27) | She hands over a document. Close-up card **กฎกระทรวง** with abstract lines only. |
| 8.62 | reading | Reading scan over the lines. |
| 12.30 / 13.43 | พ.ร.บ. (13.43) | Second card **พระราชบัญญัติ** beside the first. |
| 14.0 / 15.30 | conflict | Red passages on both cards and a bolt. Then **ขัดกันหรือไม่?** |
| 16.97 | "ถ้ากฎหมายสองฉบับขัดกัน…" | Scale with **พ.ร.บ. (กฎหมายแม่บท)** and **กฎกระทรวง (กฎหมายลำดับรอง)**. |
| 22.49 | "…ยึดฉบับไหน" | **เราจะยึดฉบับไหน?** From 28.7 s the scale settles toward the enabling Act. |
| 30.69 | ลำดับรอง (30.94) | Chain **พระราชบัญญัติ / กฎหมายแม่บท → ให้อำนาจ → กฎกระทรวง / กฎหมายลำดับรอง**. |
| 34.57 / 36.26 | "…ดูศักดิ์…อำนาจตามกฎหมายแม่บท" | Chip **ดูศักดิ์ + อำนาจตามกฎหมายแม่บท**. Officer has the "aha" moment. |
| 38.10 / 40.49 | "มาดูภาพพีระมิด…" | Paperwork becomes four coloured blocks that stack. **มาดูพีระมิดกฎหมายไทย!** |

## 3 Hierarchy — 03_knowledge.mp3

| t | Cue | Pyramid state / card |
|---:|---|---|
| 0.3 | intro | Pedestal and dashed outline of the four tiers. |
| 4.22 | "…คือรัฐธรรมนูญ" (4.50) | **T1 gold** drops in, highlighted. Header "ชั้นที่ 1 · สูงสุด". |
| 5.89 | | Card **กฎหมายสูงสุดของประเทศ · รัฐธรรมนูญ มาตรา 5** |
| 8.00 | "กฎหมายอื่นจะขัด…ไม่ได้" | A grey "ข้อบังคับ" climbs toward T1 and is stopped by a red barrier and stop sign. Card **กฎหมายอื่นขัดรัฐธรรมนูญไม่ได้** |
| 18.38 | พ.ร.บ.ประกอบรัฐธรรมนูญ (18.59 / 19.82) | **T2 pink** in; other tiers dimmed. Card **ออกตามเรื่องที่รัฐธรรมนูญกำหนด · คนละฉบับกับรัฐธรรมนูญ** |
| 25.30 | "ระดับพระราชบัญญัติ" (26.81) | **T3 blue** band in. Card **ระดับพระราชบัญญัติ**. Mascot presenter. |
| 28.74 / 31.94 | พ.ร.บ. / พ.ร.ก. | Equal cards pop in, side by side. |
| 36.68–40.03 | "พ.ร.ก.มีผลใช้บังคับดังเช่น พ.ร.บ. … ระดับเดียวกัน" | Gentle zoom on T3, gold "=" and gold rings. Card **พ.ร.ก. ใช้บังคับดังเช่น พ.ร.บ. · ศักดิ์ระดับเดียวกัน** |
| 42.05 | different conditions and process | Panel **พ.ร.บ. → กระบวนการนิติบัญญัติ** / **พ.ร.ก. → เงื่อนไขตามรัฐธรรมนูญ (กรณีฉุกเฉิน จำเป็นรีบด่วน)** |
| 47.58 | ลำดับรอง (49.30) | **T4 navy** in. Card **กลุ่มกฎหมายลำดับรอง · ตัวอย่าง (ไม่ได้เรียงลำดับกันเอง)** |
| 51.31 / 52.82 / 53.74 | พ.ร.ฎ. / กฎกระทรวง / ข้อบัญญัติท้องถิ่น | Chips pop in on the voice. |
| 55.51 | "…อำนาจและกฎหมายแม่บท" (58.50) | Link **ให้อำนาจ ▼** from T3 to T4. Card **ต้องอยู่ภายในอำนาจที่กฎหมายให้ไว้** |
| 61.83 | wrap-up | All tiers lit, scan light top to bottom. Card **สูงสุด = รัฐธรรมนูญ · แผนภาพสรุปเพื่อการศึกษา** |

## 4 Traps + recap — 04_explanation.mp3

| t | Cue | Visual |
|---:|---|---|
| 4.14 | "รัฐธรรมนูญอยู่สูงสุด ไม่ใช่ พ.ร.บ." (6.75) | Constitution card rises onto an "อันดับ 1" podium; the Act card sinks. **สูงสุด = รัฐธรรมนูญ** |
| 8.18 | พ.ร.บ.ประกอบรัฐธรรมนูญ (9.25 / 10.60) | Two separate documents with ≠. **คนละฉบับ · ไม่ใช่ชื่อเรียกอื่น** |
| 16.49–21.13 | พ.ร.บ. (18.90), พ.ร.ก. (20.07), "เทียบเท่ากัน" | Centrepiece scale: พ.ร.บ. lands and tips it, then พ.ร.ก. lands and it settles exactly level (green level line). **ศักดิ์เทียบเท่ากัน** |
| 22.95 | follow-up | **เท่ากันที่ศักดิ์ · ต่างกันที่วิธีตรา** |
| 29.53 | พ.ร.ฎ. (29.83), กฎกระทรวง (31.14), ลำดับรอง (32.82) | Enabling-Act box with arrows down to two cards inside a dashed **กฎหมายลำดับรอง** group. |
| 34.22 | "…ขัดกับกฎหมายแม่บท…ไม่ได้" | "ข้อกำหนด" tries to climb, is stopped, and slides back. **ขัดกฎหมายแม่บทไม่ได้** |
| 38.66–48.96 | recap: รัฐธรรมนูญ (40.07), ประกอบฯ (43.33), พ.ร.บ. (46.17), ลำดับรอง (47.61) | Pyramid rebuilt tier by tier on the voice (39.83 / 42.05 / 44.33 / 47.41), then **ให้อำนาจ** at 49.2 s. Caption **แผนภาพสรุปเพื่อการศึกษา**. |

## 5–7 Quiz, countdown, answer

| t | Cue | Visual |
|---:|---|---|
| quiz 0.06 | "มาทดสอบความรู้…" | Header **เตรียมสอบนายสิบ** and **วิชากฎหมาย** |
| 2.69 | question | **ข้อใดต่อไปนี้ / เป็นกฎหมายที่มีศักดิ์ / เทียบเท่าพระราชบัญญัติ?**, read line by line. |
| 7.80 / 10.20 / 12.28 / 14.47 | ก / ข / ค / ง | Four neutral pink cards appear on the voice. |
| 22.47 | "ให้เวลาคิดห้าวินาที" | **คิดก่อน 5 วินาที!** |
| CD 0–5 s | silence | Ring countdown 5→4→3→2→1, each exactly 30 frames. Neutral colours; the question and choices stay on screen. |
| ans 0.06 | "เฉลย" | Header **หมดเวลา!** |
| 1.05 | "ข้อ ค." | **REVEAL**: ค. พระราชกำหนด turns green with ✓; the others dim. Confetti and chime. Header **เฉลย! ข้อ ค.** |
| 3.62 / 7.36 | "…ดังเช่น พ.ร.บ. … เทียบเท่ากัน" | Level scale. **พ.ร.บ. = พ.ร.ก. · ศักดิ์เทียบเท่ากัน** |
| 9.47 / 10.58 | "ตามรัฐธรรมนูญ มาตรา 172" | Constitution document with **มาตรา 172**. Quote "ให้ใช้บังคับดังเช่นพระราชบัญญัติ". |
| 12.70 | conditions | Four purposes, then **กรณีฉุกเฉิน จำเป็นรีบด่วน** |
| 16.59 / 19.67 / 23.0 | "…เสนอรัฐสภา … ที่รัฐธรรมนูญบัญญัติ" (23.01) | Flow **ตราพระราชกำหนด → เสนอรัฐสภาพิจารณา** with caption. |
| 27.09 / 32.79 / 36.98 | ข้อ ก / ข / ง (names at 28.08 / 33.71 / 38.09) | Each wrong card appears, gets a ✗, and drops into **กลุ่มกฎหมายลำดับรอง**. For ง: **ออกโดยองค์กรปกครองส่วนท้องถิ่น** with a local-office icon. |
| 47.06–52.84 | final recap (รัฐธรรมนูญ 49.64; พ.ร.บ. 50.84; พ.ร.ก. 51.84) | **สูงสุด = รัฐธรรมนูญ** (48.34), **พ.ร.บ. = พ.ร.ก.** (50.63), **ศักดิ์เทียบเท่ากัน · จำให้แม่น!** |

## 8 Promo — 07_promotion.mp3

| t | Visual |
|---:|---|
| 0.08 | **ตอบ ค. ถูกไหม?** |
| 1.54 | Generic comment bubbles (no names) and **คอมเมนต์บอกกันหน่อย!** |
| 3.24 | Official logo and approved poster (shown whole), **NaiSibPro นายสิบโปร** |
| 5.94 | **ข้อสอบมากกว่า 10,000 ข้อ** (counter) |
| 10.41 | **อัปเดตทุกสัปดาห์** |
| 13.78 / 14.37 / 15.45 | **LIKE / SHARE / FOLLOW** buttons, each pressed in turn |
| 16.23 | End card: logo, wordmark, **LIKE · SHARE · FOLLOW**, "เตรียมสอบนายสิบไปด้วยกัน!", then a 1.2 s hold |

The promo beats after 3.24 s are matched to phrase starts only. The LIKE / SHARE / FOLLOW split (13.78 / 14.37 / 15.45) is inferred from three short phrases and should be confirmed by ear.
