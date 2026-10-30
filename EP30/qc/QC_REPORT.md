# EP.30 QC report — Probability: drawing two red balls without replacement

All checks were run on the final source, and the video checks on the exported MP4. **Result: no open release blockers.**

| Check | Result | Evidence |
|---|---|---|
| Final MP4 exists and decodes | ✅ 1080×1920, H.264 High, yuv420p, 30/1 fps constant, AAC-LC 48 kHz stereo. Full decode has no errors and no black frames | `video_checks.txt` |
| Duration / A-V | ✅ Video 296.700 s (8,901 frames), audio 296.733 s | `video_checks.txt` |
| Loudness | ✅ −12.8 LUFS integrated, −0.5 dBFS peak, LRA 4.0 | `video_checks.txt` |
| Narration | ✅ The 7 original files, byte-identical (md5 listed). No TTS, trims, speed change or re-ordering. Narration gain 1.0; only the music/SFX bed ducks | `audio_durations.txt` |
| First frame | ✅ "เตรียมสอบนายสิบ" is fully visible on frame 0 (opacity 1.00, box 257–823 × 362–445). The box with 3 red + 2 blue balls is visible on frame 0 | `dom_checks.txt`, `frame_0001.png` |
| Countdown | ✅ Exactly 150 frames, 5860–6009. Each digit 5·4·3·2·1 lasts 30 frames. No narration (05 ends 0.2 ms before frame 5860; 06 starts on frame 6010) | `dom_checks.txt`, `countdown_frames.jpg` |
| No early answer | ✅ 1,130 frames from the quiz start to "ข้อ ข.": 0 frames with a green overlay or check, 0 frames where the shown choices differ in style | `dom_checks.txt` |
| Quiz text | ✅ Matches the approved question exactly. Choices ก 9/25 · ข 3/10 · ค 3/5 · ง 1/2; correct answer ข. 3/10 | `dom_checks.txt` |
| Ball states (release blocker) | ✅ 20/20 narrated moments match state A (3R 2B = 5), B (2R 2B = 4) or C (1R 2B = 3), counted from the DOM balls actually inside the box | `probability_validation.json` |
| Removed balls never counted | ✅ On 4,939 frames, the on-screen count bar equals the balls inside the box: 0 mismatches. Ball colours never change (0 identity errors) | `probability_validation.json` |
| Fractions match the box | ✅ 7/7 fractions built from the box (3/5 ×4, 2/4 ×3) equal red-inside / total-inside at the frame they are completed | `probability_validation.json` |
| Arithmetic | ✅ 3/5 × 2/4 = 6/20 = 3/10 = 30 %; the ring stops at exactly 30.0 %; the 10-cell bar fills 3 cells. 9/25 = 3/5 × 3/5 is shown as wrong ("ลืมว่าไม่ใส่คืน"). 3/5 is shown as "first draw only". 1/2 = 2/4 is shown as "second draw only", not as a wrong simplification | `probability_validation.json` |
| Safe zone 220–860 × 350–1430 | ✅ All 8,902 frames: 103,836 element measurements, **0 violations**. Critical extent 221.7–858.3 × 350.2–1382.4 | `safe_zone_report.json` |
| Phone / platform simulation | ✅ 4 screens × cover/fit × TikTok / Reels / Shorts-style overlays (24 simulations), glyph-level: **0 hits**. The first pass found ~20 issues (right rail on small iPhones, caption bar on plain 9:16). All were fixed by recomposing, not by shrinking the scene | `safe_zone_report.json` |
| Mobile previews | ✅ Built from the MP4 and checked by eye: small / modern / large iPhone, Reels, Shorts, plain 9:16, aspect-fit | `mobile_preview_*.png` |
| Smallest critical text | 25.7 px ("÷ 2" badges); all other labels ≥ 27.8 px | `safe_zone_report.json` |

Notes:
- The timeline is 8,902 frames. The encoder's `-shortest` drops the final end-card frame because the audio ends 0.2 ms before it. This is harmless.
- Countdown audio (volumedetect): mean −33 dB, peaks −7 dB from the tick SFX and soft music. A spoken span measures −15.7 / −0.9 dB.
