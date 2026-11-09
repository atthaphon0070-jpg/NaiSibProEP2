# EP.45 QC report — คนที่ออกไปได้กี่คะแนน?

All results below were measured on the real page (`tools/qc_scan.js`) and on the exported MP4 (`tools/verify_mp4.py`), not inferred from the source.

## Verdict
| Area | Result |
|---|---|
| Final MP4 exists, plays, 1080 × 1920, H.264 High, yuv420p, 30/1 fps constant, AAC 48 kHz stereo | **PASS** |
| All seven narration files present, in order, unmodified level, correctly placed | **PASS** (correlation 0.980–0.991, offset ≤ 0.02 ms, gain 0.990–0.997) |
| Countdown exactly 5.000 s = 150 frames, 5/4/3/2/1 × 30 frames | **PASS** |
| No answer reveal before the countdown ends | **PASS** (0 spoiler hits; verified on encoded frames 4235 / 4236) |
| Maths (12 × 70 = 840, 11 × 68 = 748, 840 − 748 = 92, back-checks, ค) | **PASS** (13 / 13 checks) |
| Safe zone X 220–860 / Y 350–1430, incl. transitions | **PASS** (0 violations in 2 080 scanned frames) |
| "เตรียมสอบนายสิบ" visible at 00:00.000 | **PASS** |
| Runtime ≤ 180 s | **FAIL — reported conflict, not fixable without editing narration** (200.905 s) |

## 1. Final file (`qc/final_mp4_verification.json`)
- `output/NaiSibPro_EP45_Missing_Student_Average.mp4`, 46.2 MB, duration 200.905 s, 6 027 frames.
- 6 028 frames were rendered; ffmpeg `-shortest` stops at the end of the audio (200.905 s), so the last silent tail frame is not encoded. The ending is the end card on silence (clean).
- Loudness of the final AAC: RMS −17.3 dBFS, peak −0.39 dBFS (no clipping). Countdown window RMS −36.1 dBFS (music bed + ticks only).

## 2. Narration
| file | planned start | found in MP4 | offset | gain | bed vs voice |
|---|---:|---:|---:|---:|---:|
| 01_hook | 0.000 | 0.000 | 0.00 ms | 0.997 | −16.2 dB |
| 02_story | 25.156 | 25.156 | 0.00 ms | 0.997 | −15.9 dB |
| 03_knowledge | 50.234 | 50.234 | 0.00 ms | 0.996 | −17.4 dB |
| 04_explanation | 76.356 | 76.356 | −0.02 ms | 0.994 | −15.5 dB |
| 05_quiz | 105.822 | 105.822 | −0.02 ms | 0.991 | −15.1 dB |
| 06_answer | 141.200 | 141.200 | 0.00 ms | 0.995 | −15.5 dB |
| 07_promotion | 179.548 | 179.548 | −0.02 ms | 0.990 | −13.9 dB |

Narration is placed at gain 1.0 (the ~0.5 % shortfall is AAC coding); only the music/SFX bed ducks. No time-stretching, trimming, reordering or added speech. A 0.024 s silence pad (under 1 frame) before the countdown aligns its start with the frame grid.

## 3. Countdown (`qc/countdown_validation.json`)
Frames 4086–4235 (136.200–141.200 s). Every frame checked: digit 5 on 4086–4115, 4 … 1 on 4206–4235, timer visible on all 150 frames and hidden on the frames immediately outside them. Answer audio and the green ค highlight both start on frame 4236.
Defect found and fixed during QC: the timeline value 136.20000000000002 made the countdown, and therefore the reveal, start one frame late. Both boundaries are now snapped to the frame grid.

## 4. No early reveal
Before frame 4236, the scan found no visible 840 or 748 anywhere. The number 92 appears only inside the neutral answer card "ค. 92 คะแนน". No option is green and no checkmark is visible. In scene 04 every formula stays unevaluated (`12 × 70 = ?`, `11 × 68 = ?`, `(12 × 70) − (11 × 68) = ?`).

## 5. Mathematical integrity (`qc/math_validation.json`)
All numbers come from `source/math_logic.js`. No student is given an individual score: the knowledge diagram uses unlabelled, unequal bars (with the note "คะแนนแต่ละคนไม่เท่ากัน"), and the missing-score diagram uses total bars in proportion 840 : 748, without numbers. The "เฉลี่ยลดลง 2 คะแนน" chip is labelled as a change in the average, and the hook warns "ไม่ใช่แค่ 70 − 68".

## 6. Mobile safe zone (`qc/safe_zone_report.json`)
- Every `.crit` element was checked on every third frame across the whole episode, plus every frame around the reveal: 0 violations.
- A transform guard in `scenes.js` keeps pop-in overshoot inside the zone, including the engine's 2.5 % scene growth.
- Phones (9:16 master shown at full height):

| Screen | Visible master width (px) |
|---|---|
| 375 × 812 | 97–983 |
| 390 × 844 | 96–984 |
| 430 × 932 | 97–983 |

  The 220–860 zone is fully visible on all three. A 40 px master font appears at about 17–19 px on screen.
- Platform overlays (the TikTok, Shorts and Reels right rails and bottom caption bands) all fall outside 220–860 / 350–1430.

## 7. Visual review
`qc/contact_sheet.png` (30 frames taken from the MP4) and `qc/first_frame.png` were inspected.
- Blue, navy and cyan dominate. Pink is limited to the departing student, the "ออกไป 1 คน" line and a few small accents.
- Thai text checked: no clipped vowels or tone marks.
- The tiny `×` / `÷` glyphs in the Prompt font are replaced with drawn signs.

## Known minor issues
- During the first ~0.3 s of the countdown, the hint card is still fading out underneath the timer. This is cosmetic, and the timer is fully readable.
- The brand header ("NaiSibPro" in navy) has low contrast against the navy countdown background for 5 s. The logo stays visible.
