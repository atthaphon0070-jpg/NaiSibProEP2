# EP.37 — Final QC Report

Checked file: `EP37/output/NaiSibPro_EP37_Water_Taps_Work_Rate.mp4` (94.7 MB). Every check below was run on the rendered video or on the live page that produced it.

## Verdict
**Ready to publish, with one item outside the brief: the runtime is 4:21.135, over the 3:00 limit.** The overrun comes from the length of the supplied narration. I left the audio unaltered as instructed, so this is reported here and not hidden (see §6). No other release-blocking defect was found.

## 1. Container / stream (ffprobe on the MP4)
| Item | Result |
|---|---|
| Video | H.264 High, 1080×1920, yuv420p, 30/1 constant (r = avg = 30), 7,834 frames |
| Audio | AAC-LC, 48 kHz, stereo |
| Duration | 261.133 s video / 261.135 s audio (no drift) |
| Full decode (`ffmpeg -f null`) | 0 errors |
| Loudness | −14.1 LUFS integrated, LRA 4.6 LU, peak −0.1 dBFS |

## 2. Narration integrity (decoded MP4 vs the 7 source files)
All seven files are at **0.00 ms offset** from their timeline slots. The first 8 s of each correlates at 0.991–0.996 with the source; the small difference is the music bed and AAC encoding. Left-channel gain is **0.996**, so the narration is unchanged. The voice was not stretched, trimmed, reordered or replaced. File order: 01→02→03→04→05→[5 s countdown]→06→07.

## 3. Mathematics: `math_validation.json` (all pass)
A = 1/4, B = 1/6, drain = −1/12. Over 12: 3/12 + 2/12 − 1/12. Inlet = 5/12, net = 4/12 = **1/3 tank/h**, time = **3 h**, answer = **ค**. Distractor ข: 1 ÷ 5/12 = 12/5 h = **2 h 24 min**. It is shown as correct arithmetic for the case with no drain, labelled "ลืมหักท่อระบาย".

## 4. Water animation: `water_animation_check.json` (all pass)
- Time-lapses in the explanation and answer scenes check every frame: level = (1/3) × simulated hours. 0 mismatches. At 1 / 2 / 3 h the level reads 33.33 / 66.67 / 100 %.
- Knowledge one-hour demos: A alone fills exactly 1/4, B alone 1/6, and the drain alone takes a full tank to 11/12.
- Story: A is full at 4 h and B at 6 h. The drain-only demo starts full and is empty at 12 h.
- No negative levels and no level above 100% in any frame. Taps finish closing at the frame the tank reaches 100%.
- The drain component can only draw outflow, so it never flows inward. Levels are computed by deterministic functions, not by the particle effects.

## 5. Countdown, reveal and frame zero: `countdown_check.json` (all pass)
- The countdown runs frames 5308–5457: exactly **150 frames (5.000 s)**, digits 5→4→3→2→1 at 30 frames each, with no narration. I confirmed this on frames decoded from the MP4.
- All four answer cards stay neutral until **182.903 s**, on "ข้อ ค." That is 0.97 s after the countdown ends.
- Frame 0 shows "เตรียมสอบนายสิบ" at full opacity (`first_frame.png`).

## 6. Runtime (blocking for the 3:00 limit; not fixed, by instruction)
The narration totals 254.903 s. Adding the 5.000 s countdown and a 1.2 s end tail gives **261.135 s**, 81.1 s over 3:00. Hitting the 2:55 target needs about 86 s less narration, which means a shorter script, re-recorded. The longest files are 06_answer (58.5 s), 02_story (39.2 s) and 04_explanation (39.2 s). Part of the overlap is intentional teaching, because the full solution is explained twice (04 and 06). Trimming the trap explanation and the memory recap in 06, and the "หลายคนคิดว่า" passages in 01 and 02, would recover most of the time.

## 7. Safe zone (X 220–860, Y 350–1430): `safe_zone_report.json`
I sampled 1,567 frames (every 5th), including all animations, and checked every essential element: titles, chips, equations, question lines, options, countdown, the tanks and the CTA. There were **0 critical** violations. The 12 minor ones are pop-in overshoots of ≤13 px lasting ≤0.83 s. Two fixes made this possible: the engine's 2.5% camera push was reduced to 1% for this episode, and the quiz-card slide-in was shortened. All glyphs come from the bundled Prompt font; `→` and `✓` were replaced with inline SVG.

**Not done:** I did not render on-device phone viewports (375×812, 390×844, 430×932) or test against platform UI overlays. The safe zone here is the brief's conservative box. Everything essential sits within X 220–860, so a center-crop to 9:19.5 keeps all content. The 1430 px floor leaves 490 px clear for the bottom UI on TikTok, Reels and Shorts.

## 8. Blue dominance: `color_report.json` (261 frames at 1 fps from the MP4)
| Hue family | Share of saturated pixels |
|---|---:|
| Blue / cyan / navy | **98.77%** |
| Orange / yellow (highlights) | 0.57% |
| Red (wrong-approach X) | 0.36% |
| Green (correct answer) | 0.21% |
| Pink | 0.06% |

Blue is the dominant hue family in all 261 sampled frames (minimum 92.1% in any one frame). Pink is a thin accent only: a stripe on the wipe, a ring around the EP pill, and the logo's own artwork, which was left unchanged. The brief targeted 5–10% pink, so the measured share is lower than that but the direction is right. I kept pink minimal on purpose, because the brief puts views from blue first.

## 9. Files
`audio_durations.txt`, `beat_map.md`, `math_validation.json`, `water_animation_check.json`, `countdown_check.json`, `safe_zone_report.json`, `color_report.json`, `first_frame.png`, `contact_sheet.png` (25 frames from the MP4, red box = safe zone). Rerun with `node EP37/qc/validate.js` and `python3 EP37/qc/color_check.py <mp4>`.
