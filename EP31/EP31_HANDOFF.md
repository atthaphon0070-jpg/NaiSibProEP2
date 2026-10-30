# NaiSibPro EP.31 — Handoff: The Clock Angle Trap (03:15 = 7.5°)

## Delivery
| Item | Value |
|---|---|
| Repository / branch | `atthaphon0070-jpg/NaiSibProEP2` @ `claude/friendly-goldberg-h8bou6` |
| Final MP4 | `EP31/output/NaiSibPro_EP31_Clock_Angle_0315.mp4` (53.4 MB) |
| Video | 1080 × 1920, H.264 High, yuv420p, constant 30 fps, **6,299 frames** (counted by decoding) |
| Audio | AAC-LC, 48 kHz stereo, 192 kb/s. **−13.5 LUFS** integrated, −0.6 dBFS peak |
| Duration | **209.97 s** (3 min 30 s) |
| Build | `shared/tools/build_episode.sh EP31` (about 8.5 min with `WORKERS=$(nproc)`) |
| QC | `node EP31/tools/qc.js EP31` writes `qc/clock_validation.json` and `qc/safe_zone_report.json` |

## ⚠ Known issue: the 180-second target is not met
The seven supplied recordings run **203.96 s of narration on their own**. That is 23.96 s over 180 s before the required 5 s countdown is added. As delivered (narration + 150-frame countdown + 1.0 s end-card tail) the video is **209.97 s, 29.97 s over the target**.

No visual padding was added and the tail is only 1.0 s. The overage comes entirely from the narration. Per the brief, the speech was **not** sped up, trimmed or re-voiced. Edge-silence trimming would only recover about 2 s in total.

To get under 180 s the script needs about **30 s less speech** (≈ 15%). The longest files are 06_answer (49.4 s) and 03_knowledge (31.8 s). In 06_answer, the three distractor explanations (29.9–41.4 s ≈ 11.5 s) and the repeated memory line (41.9–49.1 s ≈ 7.2 s) are the easiest cuts. The memory line repeats 03_knowledge 26.2–31.6 s. If the recordings in the ZIP are not the approved shortened script, please send the shortened set. The timeline rebuilds automatically from the new files, but the cue times in `source/beats.js` need re-measuring.

## Audio (unaltered originals, ZIP names had a doubled `.mp3.mp3` extension that was dropped)
| File | Duration (s) | Starts at (s) |
|---|---:|---:|
| 01_hook.mp3 | 22.753 | 0.000 |
| 02_story.mp3 | 27.559 | 22.753 |
| 03_knowledge.mp3 | 31.791 | 50.312 |
| 04_explanation.mp3 | 29.884 | 82.103 |
| 05_quiz.mp3 | 23.171 | 111.987 |
| — countdown (silent) | 5.000 | 135.167 (frame 4055) |
| 06_answer.mp3 | 49.398 | 140.167 |
| 07_promotion.mp3 | 19.409 | 189.564 |

`qc/audio_durations.txt` has the hashes. The phrase-level timeline is in `qc/beat_map.md`.

Narration integrity was checked on the exported MP4. The decoded mix aligns with the original narration track at **0-sample lag** with **one uniform gain**: the +0.5 dB master, plus a little lookahead limiting on peaks. Narration sits ≈ 20 dB above music and SFX in speech regions. The countdown window contains **zero** narration energy.

No speech-to-text model was reachable from the container (Hugging Face and OpenAI model hosts are blocked). Beats are therefore anchored to measured pauses matched to the script's voice anchors by order and length. A few mid-file lines whose wording wasn't in the brief (for example hook 12.6–16.4 s and story 16.6–19.8 s) carry generic visuals ("ผิด!" stamp, surprised reaction) rather than word-specific captions. A quick listen-through to confirm sync is recommended.

## Clock engine — `shared/engine/props_clock.js` (new, reusable)
- `ck.setTime(T)` with T in minutes since 00:00 sets **minute = 6·(T mod 60)** and **hour = 0.5·(T mod 720)**, which equals 30·(h mod 12) + 0.5·m. Angles run clockwise from 12.
- The SVG viewBox is centred on the clock centre, so `rotate(a)` pivots every hand on the true centre, never the hand's own centre.
- Time-lapses ease the **time value**. Hand angles are always derived from it, never animated separately.
- Helpers: true-scale sector, trace arcs, ghost hands, dashed reference ray, glow/emphasis, and a magnifier `CLOCK.lens()`. The lens is a second clock at ×3–3.4 showing the same time, so angles are unchanged.
- `setAngles()` is used **only** for the two labelled wrong-model illustrations (the "ความเข้าใจผิด" card in the hook and the "กระโดดทีละชั่วโมง ✗" clock). These clocks are flagged `data-model="incorrect"`.

## Clock validation (`qc/clock_validation.json`), measured from rendered DOM geometry
| Time | Hour | Minute | Smaller angle | Result |
|---|---:|---:|---:|---|
| 03:00 | 90° | 0° | 90° | pass |
| 03:05 | 92.5° | 30° | 62.5° | pass |
| 03:10 | 95° | 60° | 35° | pass |
| 03:15 | 97.5° | 90° | **7.5°** | pass |

A whole-timeline sweep (every 5th frame, 1,283 clock samples across 11 factual clocks) found a maximum hand error of **0.0001°**. Hand angles are measured relative to the dial's own 12, so the tilting exam paper reads true. At 03:15 the hour hand is always 7.5° past 3. The final yellow sector spans exactly 90°→97.5°. The answer is **ข. 7.5°**.

## Safe zone (`qc/safe_zone_report.json`, X 220–860, Y 350–1430)
The check covers the rendered bounding boxes of every element tagged essential (clocks, text, equations, quiz cards, countdown, CTA), sampled every 5 frames. During camera push-ins it checks the focus region instead: numeral 3 and both hand tips.
- **0 critical violations.** 22 transient entries remain, each ≤ 0.33 s and ≤ 16 px: the elastic pop-in overshoot as a card enters, before it settles. Nothing stays outside long enough to be read there.
- All full-width cards are 620 px wide (10 px margin) and the scene-wide auto-zoom is disabled so the margins hold.
- The brand header (top-left logo chip) is decorative and sits outside the zone by design, as in earlier episodes.
- On 375×812 / 390×844 / 430×932 center-crop displays the 1080-wide frame scales to the device width, so the 640 px column stays fully visible. The lowest essential content ends at y ≤ 1427, above typical Shorts/Reels/TikTok caption and button areas.

## Countdown and quiz
- Frames 4055–4204 (135.167–140.167 s): exactly **150 frames**, with each of 5/4/3/2/1 on screen for **30 frames**. There are ticks each second and no narration.
- **0** frames show any answer highlight before the reveal. ข turns green at 141.27 s, on "ข้อ ข." in 06_answer.
- The four options appear in sync with the narration and stay visually neutral until the reveal.
- Frame 0 (`qc/frame_0001.png`): "เตรียมสอบนายสิบ" is fully opaque at x 240–840, y 362–466.

## Reused components
From `shared/`: `engine.js` (deterministic `renderAt`, easing, `life()`, wipes, brand header, countdown, confetti, SFX registry), `engine.css`, `props_story.js` (student A rig with expressions, blink and sweat), the Prompt fonts, logo, `audio_prep.py` (frame-aligned countdown, promo phrase cues), `audio_mix.py` and `render.js`. The promo is EP.31-specific because its script differs from `promo.js`'s; it reuses the subject-tile designs. EP.02–EP.05 are untouched.

## Files
`EP31/episode.json`, `source/index.html` (markup + Blue × Pink Fusion styles), `source/beats.js` (cue map), `source/scenes.js` (all scenes), `tools/qc.js`, `qc/*`, `audio/*`, `output/*.mp4`. `renders/` (frames, mixes) and `source/timeline.js` are build products and are git-ignored.
