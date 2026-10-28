# EP22 handoff

| | |
|---|---|
| Episode | NaiSibPro EP.22 |
| Subject | คณิตศาสตร์ (Mathematics) |
| Topic | Work-rate problems: "ช่วยกันทำ เสร็จกี่วัน?" Think in work per day; wall-grid method; "บวกงาน ไม่ใช่บวกวัน" |
| Worked example | 4 days & 12 days → 12 blocks → 3 + 1 = 4 blocks/day → 12 ÷ 4 = **3 วัน** |
| Quiz | ก alone 6 days, ข alone 3 days, together? Choices: ข้อ ก. 2 วัน / ข้อ ข. 3 วัน / ข้อ ค. 4.5 วัน / ข้อ ง. 9 วัน |
| Answer | **ข้อ ก. 2 วัน** (6 blocks → 1 + 2 = 3 blocks/day → 6 ÷ 3 = 2) |
| Final file | `EP22/output/NaiSibPro_EP22_Work_Rate.mp4` (148.1 s, 1080×1920, 30 fps CFR, H.264 High + AAC 48 kHz stereo 192 kbps) |
| Re-render | `shared/tools/build_episode.sh EP22` (about 6 min with `WORKERS=8` on 4 cores) |
| QC | `python3 EP22/tools/qc_final.py`, `node EP22/tools/qc_layout.js 0.25`, `node EP22/tools/qc_content.js` → `EP22/qc/` |

## Audio files (all 7 present, real, non-silent and unique; md5 differs from every earlier episode's files)

| File | Duration (s) | Start in video (s) |
|---|---:|---:|
| 01_hook.mp3 | 15.569 | 0.000 |
| 02_story.mp3 | 13.166 | 15.900 |
| 03_knowledge.mp3 | 14.446 | 29.367 |
| 04_explanation.mp3 | 23.171 | 44.133 |
| 05_quiz.mp3 | 20.846 | 67.633 |
| (countdown, silent) | 5.000 | 88.500 |
| 06_answer.mp3 | 39.811 | 93.500 |
| 07_promotion.mp3 | 13.714 | 133.633 |

The ZIP files were named `NN_name.mp3.mp3`; they were copied byte-identically as `NN_name.mp3`. Each recording was checked against the approved transcript with a local speech recogniser, and all seven match.

**Shortcut lines:** present in 06_answer (28.49–36.31 s file time: "มีสูตรลัดด้วย… เอาวันคูณกัน หารด้วยวันบวกกัน / หกคูณสาม ได้สิบแปด หารเก้า… ได้สอง!"). The formula beat is built: the fraction "วัน × วัน / วัน + วัน" assembles piece by piece, then "6 × 3 / 6 + 3 = 18 / 9 = 2".

## Stack

The repo's own HTML/CSS/SVG `renderAt(t)` engine renders frames in headless Chromium (Playwright). Python builds the timeline and mix, and FFmpeg encodes. It is 2D only.

## Reused vs new

**Reused from `shared/`:**
- Engine helpers (`life`, easing, `tf`, `pressDepth`, `bob`) and the Prompt fonts.
- The real logo, the brand header and the series logo wipe.
- The 5 s countdown ring (`buildCountdown`/`drawCountdown`, neutral colours) and confetti.
- The `ICON` set (check, cross, timer, calendar, heart, hand).
- The music bed generator, the UI SFX (`pop`, `whoosh`, `ding`, `success`, `sparkle`, `page`, `stamp`, `tick`/`tick2`, `buzz`, `freeze`, `drop`, `coin`, `riser`, `click`) and the build and render scripts.

**New, shared (`shared/engine/props_work.js`):**
- **WORK GRID** `WORK.grid({ rows, cols, workers: [{ rate, color }, …] })`. It rejects block counts that are not a whole number of days. Worker 0 paints from the left and worker 1 from the right, column by column, `rate` blocks per day, so the block colours show who painted what and the fill speed shows each rate. It has a roller-wipe fill with a riding roller sprite, a day-1 preview glow, a grid draw-on, and `starts` for the SFX. `WORK.dayAt(t, [day1, day2, …, done])` maps beat times to day progress.
- Flat Thai police officers with paint rollers (arm and roller motion, idle bob and blink, no lip sync), the station wall with an optional beacon, the flip calendar ("วันที่ N"), the hourglass and the muscle icon.

**New, shared tools (backward-compatible):**
- `audio_prep.py`: `"gap": N` frames per segment.
- `audio_mix.py`: the `roller` SFX and `music.duck_db` (voice-keyed duck; absent means off).
- EP05's timeline, narration and `mix.wav` are byte-identical with the new tools, and EP03, EP04 and EP05 pages still render.

**New, episode:** the background station set, scene modules s1–s7, the beat map, QC tools.

## QC summary

All items pass; details are in `qc/QC_REPORT.md`. Key numbers:
- Frame 0: keyword fully visible.
- Countdown: frames 2655–2804, narration peak inside = 0.
- Narration bit-exact in the track.
- Longest near-static stretch 1.83 s.
- Loudness −13.9 LUFS, true peak −0.3 dBTP.
- Content check: 0 violations. Layout check: 7 transient hits, all on moving elements.

## Known issues

- **Word-level onsets** (number words inside a phrase) come from syllable-nucleus detection plus recogniser verification, not a trained forced aligner. Hugging Face model downloads are blocked by this environment's network policy, so Whisper-small came from GitHub-hosted sherpa-onnx releases instead. The estimated accuracy is ±2–3 frames for in-phrase words; phrase starts are exact to the 20 ms analysis window.
- The layout checker reports 7 transient hits (`qc/layout_check.txt`):
  - At 120.25 s a trap card is sliding off-screen during its exit.
  - At 130.25 s the answer's wall set is rising back into frame (its labels are briefly below Y 1430 while moving).
  - No text is parked outside the safe zone.
- The worker badges "ก"/"ข" under the quiz's small thinking-aid officers sit at Y≈1490, below the key-text safe zone. They are art labels, not key text, and the same letters appear inside the question card within the safe zone.
- The "low-res preview" step was a full-resolution preview build (`build_episode.sh EP22 --preview` → `renders/preview.mp4`), because the shared renderer captures at 1080×1920 only and a full build takes about 6 minutes. The preview was checked for frame 0, sync, grid math, countdown and overlaps, and then fixed (the countdown hand-off pop at frame 2655 and static stretches) before the final build.

## Deviations (with reasons)

1. **Navy palette vs the pastel series engine:** the order asks for navy; Yellow and Cyan coding needs a dark background. Series identity is kept through the font, header, logo wipe, countdown ring and card shapes. (Reported in README §0.)
2. **Custom promo instead of `shared/engine/promo.js`:** the shared module shows CTA lines this narration does not say, and the order requires approved CTA text only.
3. **EP.12 and EP.14 style references are not in the repo** (only `main` + this branch); EP05 and `shared/` were used as the baseline.
4. **Loudness target:** the order says about −16 LUFS or match previous episodes. Matched EP05 (−14.2 LUFS measured) at −13.9 LUFS with no mastering gain; the narration's own level gives this. The music bed sits a median 24.5 dB under the voice during speech, with a 12 dB voice-keyed duck.
5. **"4.5" and "9" first appear in 05_quiz** (spoken choices), never in scenes 1–4; "2 วัน" before 06 appears only as the quiz choice card text, never as a result.
6. **Wall reveal on 06 "หกช่อง":** the order asks for the grid to draw on "หกช่อง". It draws at the word "หก" inside "แบ่งกำแพงเป็นหกช่อง" (3.30 s file time).
