# NaiSibPro EP.12 — ด่วน! ด่วนมาก! ด่วนที่สุด! ต่างกันอย่างไร? (งานสารบรรณ)

**Final video:** `output/NAISIBPRO_EP12_SARABAN_URGENT_FINAL.mp4`. It is 1080×1920 (9:16), 30 fps, H.264 High + AAC 48 kHz stereo. See `qa/QA_NOTES.md` for the measured specs and the checks.

Rebuild it with `shared/tools/build_episode.sh EP12`. To audit the safe zone, run `STEP=0.1 node EP12/qa/safezone_audit.js`.

## Timeline (audio-first, measured from the supplied narration)
| # | Scene | Audio | Start (s) | Length (s) |
|---|-------|-------|------:|------:|
| 1 | Hook: envelopes land, ด่วน / ด่วนมาก / ด่วนที่สุด stamped on the spoken words, title, the ด่วนภายใน "level 4?" question | 01_hook.mp3 | 0.00 | 21.79 |
| 2 | Story: morning in a police office; the correspondence officer stamps three letters; a fourth arrives marked ด่วนภายใน | 02_story.mp3 | 21.79 | 34.43 |
| 3 | Knowledge: ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ ข้อ 28, three classes on a speed gauge and a growing list, "มี 3 ประเภทเท่านั้น" | 03_knowledge.mp3 | 56.22 | 35.87 |
| 4 | Common mistake: ด่วนมาก ≠ ด่วนที่สุด, no fixed hours, then the deadline question (answer withheld, four neutral candidates) | 04_common_mistake.mp3 | 92.08 | 35.16 |
| 5 | Quiz (question on screen matches the narration; choices appear as they are read) | 05_quiz.mp3 | 127.24 | 24.27 |
| 6 | **Silent countdown 5→1** (exactly 150 frames, no narration) | — | 151.53 | 5.00 |
| 7 | Answer: ง. ด่วนภายใน turns green on "ข้อ ง", envelope diagram + checklist, "not a 4th class", ชั้นความเร็ว vs ข้อความกำหนดเวลา split | 06_answer.mp3 | 156.53 | 38.35 |
| 8 | Promo (shared module, fitted to the safe zone, poster hidden) + end card | 07_promotion.mp3 | 194.88 | 21.63 (+2.2 s hold) |

## Content (fact-checked)
Three independent web researchers checked the regulation, with a skeptical adjudicator on top:
- **ข้อ 28 is correct.** It is the same number in the 2526 original and in the consolidated text (amendments ฉบับที่ 2 พ.ศ. 2548, ฉบับที่ 3 พ.ศ. 2560 and ฉบับที่ 4 พ.ศ. 2564 did not renumber it).
- **ด่วนที่สุด** = ให้เจ้าหน้าที่ปฏิบัติในทันทีที่ได้รับหนังสือนั้น
- **ด่วนมาก** = ให้เจ้าหน้าที่ปฏิบัติโดยเร็ว
- **ด่วน** = ให้เจ้าหน้าที่ปฏิบัติเร็วกว่าปกติ เท่าที่จะทำได้
- These are exactly three classes, and the regulation sets no hour or minute figures.
- **ด่วนภายใน** is used when a document must reach the recipient within a set time. It is written with วัน เดือน ปี และกำหนดเวลา. It is not a fourth class, and the video never shows it as one.
- The quiz answer is **ง. ด่วนภายใน**. No option is highlighted before the narration says "ข้อ ง" (159.49 s).

## Production notes
- **Narration:** the seven narration files from the ZIP are byte-identical, with only the doubled `.mp3.mp3` extension dropped. They are used once each, in order, unedited. A local Whisper pass was used only to read the timing; it generated no voice.
- **Fonts and colours:** Prompt (rounded, loopless Thai), headlines at weight 700–800. The NaiSibPro blue, pink, cyan and white palette carries red urgency stamps as the accent.
- **New shared props:** `shared/engine/props_saraban.js` (official envelope, distressed red stamp, rubber-stamp tool with ink splash, in-tray, speed gauge, icons) and the correspondence-officer look `Off` in `props_story.js`. Both are additive, and EP.04, EP.05 and EP.10 render pixel-identical.
- **No real insignia:** the envelopes are generic, with no Garuda or real agency marks. The deadline shown on screen (วันที่ 29 ตุลาคม 2569, เวลา 14.00 น.) is labelled ตัวอย่าง (example).
- **Mastering:** the whole soundtrack gets one uniform +6 dB gain and a peak limiter at 0.83 (set by `"master"` in `episode.json`). The narration is not edited, sped up or re-voiced. Result: −14.1 LUFS integrated, −1.2 dBFS true peak after AAC encoding.
- **Promo:** it uses only the claims from the narration (more than 10,000 practice questions, weekly updates, all 6 subjects, a real-time timer, AI result analysis, choosing a package). The promo poster is hidden in this episode (`poster:false`), so no price, discount or testimonial ever appears on screen.
- **Shared engine changes:** `promo.js` gains the opt-in options `poster`, `call0`, `handDX` and `fastTiles`. With the defaults, the EP.04, EP.05 and EP.10 promo frames are byte-identical to before.

## Wording note
The narration and the quiz say "บนหน้าซอง" (on the envelope's face). That is the usual exam phrasing. The regulation text itself says only that ด่วนภายใน is written with the date and the deadline, so the on-screen definitions follow the regulation, and "บนหน้าซอง" appears only where the narration says it.
