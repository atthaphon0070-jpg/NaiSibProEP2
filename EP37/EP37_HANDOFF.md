# EP.37 Handoff — Two Water Taps + One Drain Pipe

## 1. Episode
NaiSibPro EP.37 — เปิดน้ำ 2 ก๊อก แต่มีท่อระบาย น้ำจะเต็มถังในกี่ชั่วโมง? (คณิตศาสตร์ อัตราการทำงาน). Answer: **ค. 3 ชั่วโมง**.

## 2. Branch
`claude/happy-ride-3q7fbw` on `atthaphon0070-jpg/NaiSibProEP2`. EP.02–EP.05 were not touched.

## 3. Source paths
`EP37/source/index.html` (blue theme + page), `scenes.js` (8 scenes), `water_system.js` (tank component), `math_logic.js` (exact maths), `beats.js` (measured cues). Episode config is in `EP37/episode.json`.
Shared changes are additive only: `shared/tools/audio_mix.py` gains the water SFX kinds and the opt-in `music.duck` key.

## 4. Audio files
`EP37/audio/01_hook.mp3 … 07_promotion.mp3`. These are byte-identical to the ZIP (MD5-verified), with the doubled `.mp3.mp3` extension dropped.

## 5. Measured durations
| File | Length (s) | Starts at (s) |
|---|---:|---:|
| 01_hook | 27.873 | 0.000 |
| 02_story | 39.158 | 27.873 |
| 03_knowledge | 36.362 | 67.030 |
| 04_explanation | 39.158 | 103.393 |
| 05_quiz | 34.351 | 142.550 |
| countdown (silent) | 5.000 | 176.933 (frame 5308) |
| 06_answer | 58.514 | 181.933 |
| 07_promotion | 19.487 | 240.448 |
| **Narration total** | **254.903** | |

## 6. Final runtime
**261.135 s (4:21.1)**, which is over the 3:00 limit by 81.1 s. See §15.

## 7. Scene timeline
| # | Scene | Time (s) | Content |
|---|---|---|---|
| 1 | Hook | 0–27.9 | Frame 0 shows "เตรียมสอบนายสิบ" over a navy background, with an electric-blue flash and the tank. Taps open at 4.97 s; the drain plus a warning sign appear at 9.05 s; then "น้ำจะเต็มในกี่ชั่วโมง?", the A+B rush trap, "เดี๋ยวก่อน!", and +/− direction badges. |
| 2 | Story | 27.9–67.0 | Empty tank. A alone: 4 h time-lapse with clock. B alone: 6 h, visibly slower. Drain alone: full → empty in 12 h. Then all three open in order with the "A + B − ท่อระบาย" formula, "? ชั่วโมง", the "เร็วมากแน่ๆ" thought bubble and the "อัตราการทำงาน" card. |
| 3 | Knowledge | 67.0–103.4 | Full tank = 1 งาน. Three one-hour demos fill exactly ¼ and ⅙ and remove 1/12, against tick scales. A summary row and the "เติม + เติม − ระบาย" memory card follow. |
| 4 | Explanation | 103.4–142.6 | The equation 1/4 + 1/6 − 1/12 builds on the spoken words, then ×3/×2 → 3/12 + 2/12 − 1/12 → (3+2−1)/12 = 4/12 = 1/3. A 3-hour time-lapse runs 33 → 67 → 100%, ending on "ใช้เวลา 3 ชั่วโมง". |
| 5 | Quiz | 142.6–176.9 | The question appears line by line as it is read, then 4 neutral cards on the spoken cues, then the "อย่าลืม! มีท่อระบายด้วย" hint with a mini tank. |
| 6 | Countdown | 176.933–181.933 | Blue ring, 5→1, 150 frames, ticks, question and choices visible, no narration. |
| 7 | Answer | 181.9–240.4 | "เฉลย!" then ค turns green with confetti at 182.903 s. 1/4 + 1/6 = 5/12 and 5/12 − 1/12 = 4/12 = 1/3, with the tank running. A reset leads to a 3 h time-lapse and timeline chips. The ข trap shows 1 ÷ 5/12 = 12/5 = 2 ชม. 24 นาที, a restrained red ✗ "ลืมหักท่อระบาย", and a mini tank with its drain crossed out. A memory card (เติม = +, ถ่วงงาน/รั่ว/ระบาย/ลบงาน = −) and a conclusion close the scene. |
| 8 | Promo | 240.4–261.1 | "ตอบ ค. ถูกไหม?" with comment bubbles, then the ข-vs-ค recap, floating fractions, the official logo and "NaiSibPro นายสิบโปร", 10,000+ ข้อ, อัปเดตทุกสัปดาห์, like/share/follow buttons, and "เจอกันข้อถัดไป". Tail is 1.2 s. |

The full cue table is in `qc/beat_map.md`.

## 8. Water animation component (`water_system.js`)
`WATER.tank(container, {A, B, D, ticks})` returns `draw(t, {level, A, B, D, hlA/hlB/hlD, tickOn})`. It draws:
- a transparent acrylic tank with reflections, a rim ellipse and a shadow;
- a gradient water body, plus a back wave for depth;
- a mean-preserving surface wave (whole wavelengths across the tank);
- bubbles that rise only below the surface, ripples, and splash droplets;
- taps A (electric blue, upper left) and B (cyan, upper right) with turning valves, flow chevrons, and stream widths in a 3 : 2 ratio to match their rates;
- a dark bottom drain with a yellow valve, outward chevrons, an outflow stream and a suction swirl. It flows outward only, and only while water is present.

Water level is always passed in by the caller, computed from `WR`.

## 9. Work-rate validation
Everything passes (`qc/math_validation.json`, `qc/water_animation_check.json`): rates 1/4, 1/6, −1/12; inlet 5/12; net 4/12 = 1/3; 3 h; ค; 2 h 24 min for the no-drain case. Tank levels are 0 / 33.33 / 66.67 / 100% at 0 / 1 / 2 / 3 h. There are no negative or overflow frames.

## 10. Blue-dominant styling
The theme is built from navy (#142B53 / #0B1B3A) radial backgrounds with a blueprint grid, electric-blue (#2F6BFF) panels and tap A, cyan (#22D3EE) water and tap B, and ice-blue (#E6F4FF) cards. Yellow (#FFD23F) marks operators and key numbers. Green appears only at the reveal; red only on the trap ✗. Pink (#EE7FAA) is limited to accents.

Measured on the MP4: blue/cyan/navy is **98.8%** of saturated pixels and pink is **0.06%**. The logo art is unmodified.

## 11. Safe zone
I swept 1,567 frames covering every essential element. There are **0 critical** violations and 12 minor ones: pop-in overshoots of ≤13 px lasting ≤0.83 s. Details are in `qc/safe_zone_report.json`.

On-device phone renders and platform overlay mock-ups were **not** produced. See the note in QC_REPORT §7.

## 12. Countdown
Checked on frames decoded from the video: frames 5308–5457, exactly 150 frames, 30 frames per digit, no narration. The answer stays neutral until 182.903 s.

## 13. Final MP4
`EP37/output/NaiSibPro_EP37_Water_Taps_Work_Rate.mp4`: 1080×1920, 30 fps CFR, H.264 High yuv420p, AAC 48 kHz stereo, −14.1 LUFS, 94.7 MB.

## 14. Re-render
```bash
shared/tools/build_episode.sh EP37
```
```bash
node EP37/qc/validate.js
```
```bash
python3 EP37/qc/color_check.py EP37/output/NaiSibPro_EP37_Water_Taps_Work_Rate.mp4
```
The build takes about 12 min (mix about 1 min; 7,834 frames on 4 workers). `renders/` and `source/timeline.js` are build products and are git-ignored, as in EP.05.

## 15. Known limitations
1. **Runtime 4:21, over the 3:00 limit.** The unmodified narration alone is 4:15. Reaching 2:55 needs about 86 s less narration through a shorter, re-recorded script. The best candidates are the repeated solution in 06_answer (58.5 s, mostly re-teaching 04) and the "หลายคนคิดว่า" passages in 01 and 02. Once new files are dropped into `EP37/audio/`, only `source/beats.js` cue times need updating.
2. **Phrase timing.** Timing came from pause detection plus a local Whisper-small pass (read-only; it generated no audio). The Whisper weights came from an npm package (`@skillninja/shortmovie-telop-model`, SHA-256 verified) because HuggingFace is blocked in this environment. A few cues inside long phrases are interpolated within their pause-bounded block, to an estimated ±0.3 s.
3. **Safe-zone testing.** It was checked against the brief's conservative box, not on real device viewports or platform UI overlays.
4. **The 3-hour answer appears before the quiz**, in scene 4, because the approved narration in 04 says it. The quiz works as recall, and the answer cards stay neutral until after the countdown.
