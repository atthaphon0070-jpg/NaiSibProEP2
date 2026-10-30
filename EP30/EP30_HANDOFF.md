# EP.30 Production Handoff — หยิบลูกบอล 2 ครั้ง ทำไมความน่าจะเป็นไม่เท่าเดิม?

## 1. Deliverable
`EP30/output/NaiSibPro_EP30_Probability_Without_Replacement.mp4` (96.6 MB)

| | |
|---|---|
| Duration | 296.7 s (4:56.7), 8,901 frames |
| Video | 1080 × 1920 (9:16), 30 fps constant, H.264 High, yuv420p, CRF 17 |
| Audio | AAC-LC 48 kHz stereo, −12.8 LUFS integrated, −0.5 dBFS peak |

## 2. Branch and source
- Branch `claude/admiring-wright-1bquaa`, folder `EP30/` (file list in `EP30/README.md`).
- Studied before building: EP.27 (`claude/fervent-hamilton-xsc1j4`, most recent; its safe-zone and QC tools, Fusion layer, quiz and promo), EP.25 and EP.26, and the shared engine on `main`.
- Shared changes (additive): the EP.26/EP.27 shared files brought onto this branch unchanged (`"silence"` segments, looks K/H, `printer` SFX), plus new `clack` and `glass` SFX in `shared/tools/audio_mix.py`. Earlier episodes are untouched.

## 3–5. Narration and timeline
| # | File | Role | Measured | Starts |
|---|---|---|---:|---:|
| 1 | `audio/01_hook.mp3` | Hook | 28.682 s | 0.000 |
| 2 | `audio/02_story.mp3` | Story | 40.594 s | 29.032 |
| 3 | `audio/03_knowledge.mp3` | Knowledge — without replacement | 47.073 s | 69.977 |
| 4 | `audio/04_explanation.mp3` | Calculation | 46.028 s | 117.399 |
| 5 | `audio/05_quiz.mp3` | Quiz | 31.556 s | 163.777 |
| — | silent countdown | 5 → 1 | 5.000 s (150 frames) | 195.333 (frame 5860) |
| 6 | `audio/06_answer.mp3` | Answer | 65.881 s | 200.333 (frame 6010) |
| 7 | `audio/07_promotion.mp3` | Promotion | 28.369 s | 266.564 (+1.8 s end-card hold) |

- The ZIP files are named `*.mp3.mp3` and are byte-identical to the copies here; only the extension was fixed. All are 44.1 kHz mono MP3. There is a 0.35 s gap between scenes, and none around the countdown.
- **Timing method:** a 10 ms pause map, plus a local Whisper-small transcription used only to find where each phrase starts (the same method as EP.27). Every beat is one number in `source/beats.js`; `qc/beat_map.md` lists each with its absolute time and frame.
- **Narration vs. script (nothing altered):**
  - 01 adds "หลายคนรีบตอบทันที แต่เดี๋ยวก่อน" (shown as a ⚡ headline and a ✋ stop chip).
  - 04 ends with "จำนวนสิ่งที่เราต้องการก็อาจลดลงด้วย" (shown as a tag on "แดง 3 → 2").
  - 05 has no built-in pause, so the silent 150 frames follow the file directly.
  - 06 says "ข้อ ง. 1/2 ก็ไม่ตรงกับการคำนวณจริง", shown as "1/2 = 2/4 = ครั้งที่ 2 อย่างเดียว" with an amber "ไม่ใช่โอกาสแดงทั้ง 2 ครั้ง" tag.
  - 07 lists คณิตศาสตร์ first.
  - The narration has no mathematical errors.

## 6–7. Components
**Reused:** the `engine.js` / `engine.css` render loop, wipes, confetti, SFX registry and icons; EP.27's Fusion navy layer and light sweep, chip/card styles, quiz layout, exact countdown, promo sequence and auto-fit; the official `logo.png` and mascot cut-outs; `audio_prep.py`, `audio_mix.py`, `build_episode.sh` and `render.js`.

**New — `source/probability.js` (reusable):**
- `PROB.box()`: acrylic box (back glass, balls, front glass with reflections) and five balls with fixed IDs and colours. Two reds sit on top; the floor row is B R B.
- Scripted draws `{id, at, d}`: a hand reaches in, grips, lifts the ball over the rim and drops it into a separate dashed "หยิบออกแล้ว" tray (first and second slot). A dashed ghost ring marks the empty spot.
- Drop-in intro, per-ball highlight, numbers on the balls, dimming, and a small shake. Each ball exposes `data-loc` (in / lift / out) for QC.
- `PROB.counts()`: count bar driven by the actual balls inside, so a removed ball can never be counted.
- `PROB.frac()` stacked fractions (numerator and denominator animate separately), `PROB.ring()` percentage ring, and `PROB.cells()` 10-cell bar.

**Scenes:**
1. Hook (navy): keyword and box on frame 0, red 3 / blue 2 / total 5, ครั้งที่ 1 ➜ 2, ไม่ใส่คืน stamp, ? × ?, first draw, 5 → 4.
2. Story (light tabletop): balls drop in and are counted, grouped by colour, the question, the 3/5 × 3/5 trap with a red ✗, the first draw, 5 ลูก → 4 ลูก.
3. Knowledge: kinetic "ไม่ใส่คืน", the draw into the tray behind a dashed boundary with a no-return arrow, then a fresh box: 3/5 (with labels), close-up removal, 4 left / 2 red, 2/4, and ครั้งที่ 1 3/5 → ครั้งที่ 2 2/4.
4. Calculation: 3/5 is built and the first red is drawn; 2/4 is built and the **second red is drawn (state C, 1R 2B)**; then 3/5 × 2/4, top × top and bottom × bottom, 6/20 ÷2 → 3/10, 3/10 = 30 % (ring and 3 of 10 cells); memory hook (navy).
5–6. Quiz with the reset five-ball box and four neutral 2×2 cards, then the exact countdown.
7. Answer: reveal on "ข้อ ข.", the method again with the box, the distractors (9/25, 3/5, 1/2) and the correct row, then the memory summary with the box (navy).
8. Promo: comment, 9/25 ✗ → 3/10 ✓, practice cards, logo and app demo, 10,000+, subjects, like/share/follow, end card.

## 8. Re-render
```bash
shared/tools/build_episode.sh EP30
```

```bash
EP30/tools/qc_safe.sh
```

```bash
node EP30/tools/qc_dom.js
```

```bash
EP30/tools/qc_video.sh
```

```bash
python3 EP30/tools/mobile_preview.py EP30/output/NaiSibPro_EP30_Probability_Without_Replacement.mp4
```

The full build takes about 6 minutes with 4 workers. `qc_dom.js` and `qc_safe.sh` take about 3–5 minutes each.

## 9–14. Validation summary (details in `qc/QC_REPORT.md`)
- **Math:** 20/20 ball states, 7/7 box-built fractions and 10/10 equations pass. The count bar equals the balls inside on all 4,939 frames where it shows. Correct option is ข. 3/10.
- **Safe zone:** 0 violations across all 8,902 frames; 0 hits in the 24 phone/platform simulations.
- **Countdown:** frames 5860–6009, 30 frames per digit, no narration, no early hint.
- **First frame:** "เตรียมสอบนายสิบ" and the five-ball box are both visible.

## 15. Known issues / notes
- Please do one listening pass. Sync comes from a machine transcript, so a word inside a long phrase could land a few frames off. Each beat can be nudged in `source/beats.js` without touching scene code.
- The brand header pill (y ≈ 222–300) sits above the safe zone by design, as in EP.27. It is non-essential.
- The final end-card frame is dropped by `-shortest` (audio is 0.2 ms shorter than the frame grid). This is harmless.
- The "÷ 2" badges are 25.7 px, the smallest critical text. They are secondary to the 6/20 → 3/10 fractions beside them.
- No lower-resolution preview MP4 was exported. Previews were full-resolution stills of every scene, checked by eye, plus the per-frame DOM and safe-zone checks; then the final render.
