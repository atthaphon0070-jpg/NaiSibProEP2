# EP.12 — ด่วน! ด่วนมาก! ด่วนที่สุด! — Render & QA notes

**Final file:** `EP12/output/NAISIBPRO_EP12_SARABAN_URGENT_FINAL.mp4`. It is 1080×1920, 30 fps, H.264 High (yuv420p) + AAC 48 kHz stereo, 218.71 s long (6,561 frames). A full decode reported no errors. All measured values are in `qa/verify_mp4.json`, which `qa/verify_mp4.py` writes from the encoded file.

## Content check (multi-agent fact-check before building)
Three independent web researchers checked ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ, with a skeptical adjudicator on top. They agreed on the following:
- **ข้อ 28** sets out the urgency classes for หนังสือที่ต้องปฏิบัติให้เร็วกว่าปกติ. It has the same number in the 2526 original and the consolidated text (amendments 2548, 2560 and 2564).
- There are exactly three classes, worded verbatim on screen:
  - **ด่วนที่สุด** = ให้เจ้าหน้าที่ปฏิบัติในทันทีที่ได้รับหนังสือนั้น
  - **ด่วนมาก** = ให้เจ้าหน้าที่ปฏิบัติโดยเร็ว
  - **ด่วน** = ให้เจ้าหน้าที่ปฏิบัติเร็วกว่าปกติ เท่าที่จะทำได้
- The regulation gives no hour or minute figures. The video shows none, and the mistake scene says so explicitly.
- **ด่วนภายใน** is used when the document must reach the recipient within a set time. It is written with วัน เดือน ปี and the deadline time.
  - It is never drawn as a 4th class. The hook's "ระดับ 4?" ladder is posed as a question.
  - The answer scene shows "ไม่ใช่ชั้นความเร็ว ประเภทที่ 4" and a split between ประเภทชั้นความเร็ว (3 classes) and ข้อความกำหนดเวลาส่งถึงผู้รับ.
- "บนหน้าซอง" is standard exam phrasing rather than the regulation's literal text. It appears on screen only where the narration says it (quiz 9.22 s; answer 18.50 s).

## Audio
- Seven narration files, in order and each used once: 01_hook, 02_story, 03_knowledge, 04_common_mistake, 05_quiz, 06_answer, 07_promotion.
  - They are byte copies of the ZIP files; only the doubled `.mp3.mp3` extension was dropped.
  - Each was identified by content using a local Whisper pass. The pass was used for timing only and generated no voice.
- Placement in the final MP4, measured by cross-correlation of each source file against the encoded soundtrack: offsets of 0.00 to ±0.02 ms, normalised correlation 0.954–0.965 for all seven.
- **Countdown:** 151.53–156.53 s, frames 4546–4695, exactly 150 frames. The narration track inside the window is digital silence (peak 0.0); only ticks and music play.
- **Mastering:** one uniform +6 dB gain and a peak limiter at 0.83. The music bed ducks under the voice; the narration gain stays at 1.0.
  - Result: −14.1 LUFS integrated, −1.2 dBFS true peak after AAC, no clipping.
  - The first master (limit 0.891) measured −0.3 dBTP after encoding, so the limit was lowered and the file re-encoded.

## Central Safe Zone V2 (x 190–870, y 300–1430)
- `qa/safezone_audit.js` (`STEP=0.1`) renders the page every 0.1 s and checks the important foreground against the zone. It measures every visible text run plus these boxes: countdown ring, logo/mascot images, quiz options, level cards and rows, split panels, comparison cards, stamps, chips, glass cards, promo callouts and features.
- Result: **0 violations in 29,365 measurements** (`qa/safezone_audit.json`).
- Excluded on purpose: the office set and the officer behind the counter (background, `#world`) and the full-frame wipes.
- Boxes are read after CSS transforms, so the engine's scene push-in (scale up to 1.025) is included. That is why the layout keeps tops at y ≥ ~330 and bottoms at y ≤ ~1400.
- `qa/safezone_guide_*.jpg` show the zone (dashed red) over mock platform overlays (top tabs, right-side buttons, caption and bottom bar), for all scenes.
- The guide is drawn only with `GUIDE=1`; the final render does not contain it.

## Visual review
- **Multi-agent visual QA:** 88 guide frames across all scenes went to independent reviewers (readability, layout, story logic, content accuracy). Every finding was adversarially verified before it was fixed. The fixes that changed the edit:
  - The story letters now arrive already marked, because the sender marks the class. The officer no longer stamps them.
  - On-screen numbering was removed from the three classes, since the regulation lists them from ด่วนที่สุด down.
  - The mistake scene was re-laid out, and its four neutral candidates now appear earlier, without hinting at the answer.
  - Confetti was moved behind the options.
  - The example deadline gets a "ตัวอย่าง" tag.
  - The right split panel says วัน เดือน ปี และเวลา.
  - The "4" is struck through.
  - The speed-gauge needle was fixed so it no longer jumps to level 2, and it no longer covers the labels.
  - Contrast was raised on the "?!" bubble and the ladder label.
  - The promo poster is hidden (no prices or discounts on screen), and a duplicate CTA was removed.
- **Checks on the encoded MP4:**
  - Frame 4545 (last quiz frame): all four options are neutral and no timer is showing.
  - Frames 4546–4695: the timer fades in and counts 5→4→3→2→1 on whole seconds (frame 4636 shows 2). No option is highlighted.
  - Frame 4696 (answer start): the ring fades out and the options are still neutral. Frame 4780 (159.33 s) is still neutral.
  - Frame 4785 (159.49 s, as the narration says "ข้อ ง"): ง. ด่วนภายใน turns green with a check mark.
- ffmpeg blackdetect found no black segments, and freezedetect found no freezes of 1.5 s or longer.

## Shared-engine regression
- `props_story.js` (new look `Off`, bun hair, lanyard) is additive. Sample frames from EP.04, EP.05 and EP.10 render pixel-identical.
- `promo.js` (options `poster`, `call0`, `handDX`, `fastTiles`) leaves EP.04, EP.05 and EP.10 unchanged with the defaults. Eight promo frames per episode were rendered with the old and the new module, and all 24 JPEGs are byte-identical.
- `props_saraban.js` is a new file.
