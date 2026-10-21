# NaiSibPro EP.13 — เพิ่ม 20% แล้วลด 20% ได้ราคาเดิมจริงไหม? (คณิตศาสตร์ • ร้อยละ)

**Final video:** `output/NAISIBPRO_EP13_PERCENT_TRAP_FINAL.mp4` — 1080×1920 (9:16), 30 fps, H.264 High with AAC 48 kHz stereo. Measured specs and every check are in `qa/QA_NOTES.md`.

- **Rebuild:** `shared/tools/build_episode.sh EP13`.
- **Audits:**
  - `STEP=0.1 node EP13/qa/safezone_audit.js` (Central Safe Zone V2)
  - `node EP13/qa/spoiler_audit.js` (no early answer, countdown digits)
  - `python3 -I EP13/qa/verify_mp4.py` (encoded-file checks)

## The maths (one source of truth)
Every number on screen comes from one block at the top of `source/index.html`. That block throws an error at load if any value is wrong.

| Step | Value |
|---|---|
| Start price | 100 บาท |
| 20% of 100 | 20, so +20 → 120 บาท |
| 20% of 120 | 24, so −24 → **96 บาท** |
| Quiz | ก 94 · **ข 96 (correct)** · ค 100 (the trap) · ง 104 |

- **The lesson:** the two 20% are taken from different bases, first 100 and then 120.
- **100 as the trap:** it is never presented as correct. It appears only as a quick answer that gets marked as the trap, as a neutral quiz option, and crossed out in "ราคาไม่ได้กลับมาเป็น 100 บาท".

## Timeline (audio-first, measured from the supplied narration)
| # | Scene | Audio | Start (s) | Length (s) |
|---|-------|-------|------:|------:|
| 1 | **Hook.** Fast dolly onto the hero tumbler on its plinth; title "เพิ่ม 20% แล้วลด 20% / ได้ราคาเดิมจริงไหม?" with "คณิตศาสตร์ • เตรียมสอบนายสิบตำรวจ". The price tag rolls 100 → 120 → "?" as the 3D +20% / −20% coins land. Quick "เท่าเดิม!" answers freeze, then a % mousetrap snaps them. The 100 → 120 → ? strip asks how much it really is. | 01_hook.mp3 | 0.00 | 24.76 |
| 2 | **Story.** Camera pulls back into the shop. The shopkeeper raises the price 20% (100 → 120, "เพิ่มกำไร"); a "โปรโมชั่น ลด 20%" sign drops in and the tag spins to "?". Customers think "+20% −20% = กลับมาเท่าเดิม?". The magnifier and "ไม่ได้คิดจากฐานเดิมเสมอไป" close the scene with an iris into the next one. | 02_story.mp3 | 24.76 | 27.32 |
| 3 | **Common mistake.** The shortcut "+20 −20 หักลบกัน = 0" is shown as a thought. On "แต่ความจริงไม่ใช่แบบนั้น" the −20 is struck through ("ลดครั้งหลัง ไม่ใช่ 20 บาท!") and "ราคากลับมาเท่าเดิม?" is stamped กับดัก!. Then: first time from ราคาเดิม (100 bar), second time from ราคาที่เพิ่มขึ้นแล้ว (120 bar). | 03_common_mistake.mp3 | 52.09 | 28.11 |
| 4 | **Thinking method.** A 3-step stepper. Card 1: the 100 bar splits into five 20% parts, and one is added on (20% ของ 100 = 20). Card 2: the 120 bar re-slices into five 20% parts that are each visibly wider, with the last one an unknown "?". Then "ฐาน 100 ≠ ฐาน 120", "ราคาสุดท้าย = ? ไม่ใช่เรื่องที่เดาเอา" and "ต้องคำนวณจริงเท่านั้น!". No 24 and no 96 yet. | 04_thinking_method.mp3 | 80.20 | 35.16 |
| 5 | **Quiz.** The question lines and the four choices appear as they are read. | 05_quiz.mp3 | 115.36 | 24.92 |
| 6 | **Silent countdown 5 → 1.** Exactly 150 frames with no narration; all choices stay neutral. | — | 140.30 | 5.00 |
| 7 | **Answer.** ข. 96 บาท turns green with a gold ring on "ข้อ ข". The signature sequence follows: 100 → (+20% = +20 บาท, 20% ของ 100) → 100 + 20 = 120 → (ลด 20% ของ 120 = 24 บาท, คิดจาก 120 ไม่ใช่ 100) → 120 − 24 = 96. Each odometer rolls from the previous price, a light comet flows down each arrow, and a gold burst lands on 96. Then "ราคาไม่ได้กลับมาเป็น 100 บาท". **Recap:** "เปอร์เซ็นต์ทั้ง 2 ครั้ง คิดจากคนละฐาน", side-by-side columns 20% ของ 100 = 20 vs 20% ของ 120 = 24, the strip "100 → 120 → 96 บาท", and "ดังนั้นราคาสุดท้าย = 96 บาท". | 06_answer.mp3 | 145.30 | 50.83 |
| 8 | **Promo.** Shared module, fitted to the safe zone, poster hidden, feature chips laid out by measured width, then the end card. | 07_promotion.mp3 | 196.13 | 21.24 (+2.2 s hold) |

## Production notes
- **Narration:**
  - The seven ZIP files are byte-identical copies, with only the doubled `.mp3.mp3` extension dropped. Each is used once, in order, unedited.
  - They were identified by content with a local Whisper pass, used for timing only; no voice was generated.
  - **Mastering:** one uniform +7 dB gain and a peak limiter. The narration source is quieter than EP.12's (−23.8 vs −22.8 LUFS).
- **Look:**
  - A new bright 2.5D boutique set, `shared/engine/props_shop.js`: arched pink display niche, wall shelves, pendant lamps, neon %, cashier counter and marble plinth, with the same parallax camera and depth of field as the office set.
  - The hero tumbler is the same object in every shot: the camera zooms onto the plinth rather than cutting to a separate drawing.
  - Explainer scenes sit on the blurred, brightened shop with drifting bokeh, so they are never dark and never a flat slide.
- **Motion:**
  - Rolling odometers with true carry and motion blur, and extruded 3D percent coins (real CSS 3D).
  - Tilt-in card entrances, bars that split and re-slice, and comets on the answer arrows.
  - Transitions: a continuous camera pull-back (hook → story), an iris out of the story's last card, a light sweep (mistake → thinking), and the brand wipe only into the quiz and the promo.
- **Typography:** Prompt (rounded, loopless Thai). Headlines are weight 700 with soft shadows only: no heavy outlines and no extruded Thai text.
- **Promo:** only claims from the narration. The poster is hidden (`poster:false`), so no price, discount or testimonial appears.
- **Shared engine changes (all additive):**
  - `props_shop.js` (new).
  - The `Shop` look in `props_story.js`.
  - SFX `flip`/`calc`/`snap`/`boom` in `audio_mix.py`.
  - `render.js` now explicitly loads every webfont face before the first frame.
