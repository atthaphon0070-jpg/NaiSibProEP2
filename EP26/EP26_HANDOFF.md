# EP.26 Production Handoff — ส่งหนังสือราชการทางอีเมลแล้ว ต้องส่งกระดาษซ้ำไหม?

## Deliverable
`EP26/output/NaiSibPro_EP26_Electronic_Correspondence.mp4` (75.3 MB)

| Check | Result |
|---|---|
| Resolution / aspect | 1080 × 1920 (9:16) |
| Frame rate / frames | 30 fps, 6,897 frames |
| Video | H.264 High, yuv420p, CRF 17 |
| Audio | AAC-LC 48 kHz stereo |
| Duration | 229.9 s |
| Loudness | −12.5 LUFS integrated, −0.5 dBFS peak |
| Full decode | No errors (`ffmpeg -f null`) |
| Black frames | None (`blackdetect`) |
| First frame | “เตรียมสอบนายสิบ” + “ส่งอีเมลแล้ว ต้องส่งกระดาษซ้ำไหม?” + e-mail composer + document, all fully visible (`qc/first_frame.png`, taken from the MP4) |
| Countdown | Frames 4756–4905 = exactly 150 frames (5.000 s), no narration. It ends on “1”. Frame 4906 shows “หมดเวลา!” with no answer shown. The reveal comes at frame 4940, on “ข้อ ข” (`qc/countdown_frames.jpg`). |

Build command (repo root): `shared/tools/build_episode.sh EP26`. It takes about 7.5 min with 4 workers.

## Audio (original narration, unaltered)
| # | File (from ZIP `*.mp3.mp3`) | Role | Duration | Starts at |
|---|---|---|---:|---:|
| 1 | `audio/01_hook.mp3` | Hook | 21.551 s | 0.000 |
| 2 | `audio/02_story.mp3` | Story | 30.511 s | 21.551 |
| 3 | `audio/03_common_mistake.mp3` | Common mistake | 32.366 s | 52.062 |
| 4 | `audio/04_explanation.mp3` | Explanation | 42.998 s | 84.428 |
| 5 | `audio/05_quiz.mp3` | Quiz | 31.086 s | 127.425 |
| — | silent countdown | 5 → 1 | 5.000 s | 158.533 |
| 6 | `audio/06_answer.mp3` | Answer | 43.964 s | 163.533 |
| 7 | `audio/07_promotion.mp3` | Promotion | 20.611 s | 207.497 (+1.8 s hold) |

- The seven files are byte-identical to the ZIP; only the doubled extension was dropped. All seven are distinct (md5s in `qc/audio_manifest.json`).
- Order is as supplied. Voice gain is 1.0, with no speed change, trimming or re-voicing, and no TTS was used. Music and SFX duck under the voice.
- One uniform +2.5 dB master gain and a −1 dBFS limiter apply to the whole mix. The narration arrived at about −17 LUFS.

**Timing method / limitation:** this environment's network policy blocks the Whisper model hosts, so no transcription ran. Phrase starts were measured from the speech pauses in each file (−38 dBFS RMS, 20 ms). They were then mapped to the script anchors from the production prompt by order and length. Every phrase start used is listed in the comment block above each scene in `source/index.html`.

- Most anchors map without ambiguity.
- The quiz options were placed on the four regular “letter + text” phrase pairs at 15.86 / 19.86 / 23.43 / 27.27 s.
- The audio between them leaves no room for a separate spoken “ให้เวลาคิด 5 วินาที”. So the thinking-time prompt is shown on screen from 29.9 s, and the countdown starts only after the quiz file ends.
- A few mid-sentence words in the story, explanation and answer are unknown without a transcript. Their visuals follow the pause structure.

**Please do one listening pass** to confirm sync: the four quiz options, the exception cards at about 116–120 s, and the mnemonic at about 197–203 s.

## Scenes (all synced to measured phrase starts)
1. **Hook:** office monitor, document attached, Send clicked, envelope flies out. Then an e-mail vs printer split with a ?, “ต้องส่ง!” crowd, a red stamp “ต้องส่งซ้ำ?” and the printer speeding up. On “แต่เดี๋ยวก่อน” the printer freezes with a warning pulse. Then the regulation card “ฉบับใหม่” and a digital network, ending on “คำตอบอาจเปลี่ยนไป!”.
2. **Story:** an iris opens on the office. The officer (rig K) is labelled เจ้าหน้าที่สารบรรณ. The supervisor (rig H) walks in and hands over a document, then a document card and a หน่วยงาน A → B map. A monitor close-up shows the fictional agency e-mail: screen on, typing, attach, cursor, Send, envelope out. The outbox then shows a blue “ส่งแล้ว” with the note “สถานะฝั่งผู้ส่ง”, and no acknowledgment yet. The officer celebrates, the supervisor steps into the foreground and asks “แล้วหนังสือฉบับกระดาษล่ะ? / ไม่ต้องส่งตามไปด้วยเหรอ?”, and a paper stack appears. It ends on ส่งอีเมล vs ส่งกระดาษ with a ? and “หลายคนยังเข้าใจผิด!”.
3. **Common mistake:** two cards: ส่งแล้ว ≠ ได้รับแจ้งตอบรับ, and หนังสือราชการ ≠ ต้องใช้กระดาษทุกครั้ง. The diagram shows a blue send, a “ส่งแล้ว” chip and “ยังไม่ได้รับแจ้งตอบรับ” on a dashed grey return path. A paper morphs into a file in the electronic system. Then a lavender magnifier for “ตรวจสอบผลการส่ง”, the recipient's green “แจ้งตอบรับ”, and a green return arrow. It ends on a 3-step loop infographic.
4. **Explanation:** law book opens on ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 / ฉบับที่ 4 พ.ศ. 2564. The page turns to **ข้อ 29**, “ใช้ระบบสารบรรณอิเล็กทรอนิกส์เป็นหลัก”, and papers hop from a tray into the system. The two-way diagram rebuilds. **“ได้รับแจ้งตอบรับแล้ว” appears only after the green acknowledgment reaches A.** The printer starts, stops safely and pulls the sheet back, the paper goes into the file, and “ไม่ต้องส่งเอกสารกระดาษตามไปอีก” appears with a check. Then a warning flash and **ข้อยกเว้น**: ข้อมูลชั้นลับที่สุด (shield-lock) and เหตุจำเป็นที่ไม่สามารถใช้ระบบอิเล็กทรอนิกส์ได้ (unavailable system). Summary: “กดส่ง = จบ” crossed out → ส่ง → ตรวจสอบผลการส่ง → แจ้งตอบรับ → ได้รับแจ้งตอบรับแล้ว ↓ ไม่ต้องส่งกระดาษตามไปอีก.
5. **Quiz:** header เตรียมสอบนายสิบ + วิชางานสารบรรณ. The question is read line by line with highlight, and the four exact options appear as read, in identical styling. Thinking bubble, then the shared 5 s countdown.
6. **Countdown:** 150 frames with ticks. The question and options stay visible and neutral.
7. **Answer:** “เฉลย ข.” shows option ข in green with a check, the others dim, and confetti. A green answer banner leads into a diagram replay: send, verify, acknowledgment back, then “ได้รับแจ้งตอบรับแล้ว”. The printer stops and “ไม่ต้องส่งกระดาษตามไปอีก” appears. Then ก “แค่กดส่ง” gets a red X and “ยังไม่ครบเงื่อนไข”, against ข “ได้รับแจ้งตอบรับ” with a green check. Mnemonic cards ส่ง / ตรวจสอบ / แจ้งตอบรับ, then “ส่ง → ตรวจสอบ → ตอบรับ” and “ได้รับแจ้งตอบรับแล้ว = ไม่ต้องส่งกระดาษตามไปอีก”.
8. **Promo:** logo with exam cards, “อย่ารอให้ใกล้สอบแล้วค่อยอ่าน!”, a fictional exam-app demo, 10,000+ counter with “อัปเดตทุกสัปดาห์”, and subject tiles: กฎหมาย, คอมพิวเตอร์, คณิตศาสตร์, ภาษาไทย, plus ภาษาอังกฤษ and สารรอบรู้ from the approved 6-subject set. A “กดติดตาม” button is pressed and turns to “ติดตามแล้ว”, with score chips. End card: logo, NaiSibPro, นายสิบโปร, and the tagline. No prices, links or offers.

## Educational accuracy
Based on ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 แก้ไขเพิ่มเติม (ฉบับที่ 4) พ.ศ. 2564, ข้อ 29.
- **Send, verify and acknowledge** are three visually distinct actions: a blue outgoing arc, a lavender magnifier, and a green return arc from the recipient.
- The sender's “ส่งแล้ว” is never presented as an acknowledgment.
- No deadline is invented. Nothing claims that personal e-mail counts as official correspondence; the UI is labelled “อีเมลหน่วยงาน · ตัวอย่างสมมติ”.
- The exception card names only ชั้นลับที่สุด and does not claim all classified material is barred.
- The answer is unchanged: **ข. ได้รับการแจ้งตอบรับจากผู้รับแล้ว**.
- All agencies, addresses and documents are fictional: หน่วยงาน A/B, “สารบรรณ หน่วยงาน B (ตัวอย่าง)”, and “(เอกสารตัวอย่างสมมติ)”. There are no real seals or e-mail addresses.

## Technology and components
Deterministic HTML/CSS/SVG frames (`renderAt(t)`), captured in headless Chromium by `shared/tools/render.js` and encoded with ffmpeg.

**Reused:** `engine.js`/`engine.css` (life/easing, background, brand header, wipes, quiz options, countdown, confetti, SFX registry); `props_story.js` character rig; `props_legal.js` book, folder, person and question mark; brand logo and mascot cut-outs; the shared promo's visual language; `audio_prep.py`, `audio_mix.py` and `build_episode.sh`.

**New in `EP26/source/props_office.js`:**
- `OFFICE.set`: office interior with a parallax camera.
- `monitor`, plus `mailUI`: the fictional composer and outbox.
- `diagram`: sender ↔ recipient with send, verify, pending, acknowledgment and done states.
- `printer`: feed, freeze and retract.
- Icons: envelope, envelope + check, file, building, magnifier, hourglass, lock, unavailable-system, cursor, warning.

**Shared additions (additive):** rig looks `K` (correspondence officer) and `H` (supervisor), and the `printer` SFX. Earlier episodes were not modified.

## Remaining issues
- Sync was set from pause analysis, not a transcript (see above). One listening pass is recommended, and any beat can be moved by editing the constants at the top of its scene.
- On the very first countdown frame (4756) the countdown ring is still scaling in. This is the shared engine's behaviour, the same as in EP.05.
- The mascot art is the existing 3D-rendered brand cut-out, used only as a presenter (quiz, summary, answer). It is not a 3D rig or a 3D production.
