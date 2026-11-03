# EP.36 QC report

**Overall: NOT release-compliant. One blocker: runtime is 287.24 s against the 240 s limit.**
Every other check passes. The overrun comes from the supplied narration and cannot be fixed without editing or re-recording the voice. See "Blocker" below.

## Final file
`EP36/output/NaiSibPro_EP36_Property_Law_M456.mp4`, about 90.5 MB. Checked with ffprobe and a full `ffmpeg -f null` decode (no errors):
- Video: H.264 High, 1080×1920 (9:16), 30 fps, 8,617 frames, 287.233 s
- Audio: AAC-LC, 48 kHz stereo, 192 kb/s, 287.240 s
- Loudness: −12.6 LUFS integrated, −0.5 dBFS peak. The narration is mixed at gain 1.0; the whole mix gets a uniform +3 dB and a −1 dBFS limiter, the same method as EP.05.

## Checklist
| Check | Result | Evidence |
|---|---|---|
| All 7 original narration files used, unmodified | PASS | md5 checksums in `audio_durations.txt`; no speed change, trimming or re-voicing |
| First frame shows "เตรียมสอบนายสิบ" | PASS | `first_frame.png`; title opacity 1 at t = 0 (`safe_zone_report.json → first_frame`), confirmed on frame 0 of the MP4 |
| Countdown exactly 5.000 s / 150 frames, 30 frames per number | PASS | DOM audit of every frame: {'1': 30, '2': 30, '3': 30, '4': 30, '5': 30}, 0 bad frames, dial at full opacity throughout. In the encoded MP4: frame 6040 blank, 5 = frames 6041–6070, 4 = 6071–6100, 3 = 6101–6130, 2 = 6131–6160, 1 = 6161–6190, frame 6191 blank. No narration in the window; only ticks and a softened music bed |
| Answer hidden until the countdown ends | PASS | `answer_hidden_until_countdown_end: true`; all four choices stay neutral through frame 6190. Option ค turns green on "ข้อ ค" (207.43 s) |
| Quiz answer = ค. เรือมีระวางตั้งแต่ 5 ตันขึ้นไป | PASS | `quiz_logic.js` self-check; `legal_logic_check.md` |
| Legal logic (7 items) | PASS | `legal_logic_check.md` |
| Safe zone x 220–860 / y 350–1430 | PASS | 2873 sampled frames (every 3rd of 8618), all `.crit` elements at effective opacity ≥ 0.6, entrances and transitions included: **0 violations**, no clipped text |
| Thai typography | PASS (visual) | Prompt font from `shared/fonts`; minimum critical text size 22 px (secondary notes), body text 28–36 px; line-height ≥ 1.35, so no tone-mark clipping seen in the stills or the contact sheet |
| Page errors | PASS | `page_errors: []` |
| No dead air, intro padding or long ending | PASS | Segments are butted together; the only padding is 0.0148 s that aligns the countdown to a frame, plus a 1.2 s end-card hold |
| **Runtime ≤ 240 s** | **FAIL (blocker)** | **287.24 s.** The narration alone is 281.025 s |

## Blocker: runtime
| | seconds |
|---|---:|
| 01_hook 29.649 + 02_story 39.811 + 03_knowledge 49.084 + 04_explanation 44.278 + 05_quiz 38.531 + 06_answer 55.484 + 07_promotion 24.189 | **281.025** |
| + countdown | 5.000 |
| + frame-alignment pad + end-card hold | 1.215 |
| **Total** | **287.240** (4:47) |

To get under 240 s with the mandatory countdown, the narration must total **≤ ~233.8 s**, which means cutting **at least ~47.2 s** (about 17%). The pauses between phrases are already natural (0.37–1.0 s) and add up to far less than that, so tightening silences cannot close the gap. Speeding the voice up by 1.2× would break the "no unnatural speed-up" rule. As instructed, the narration was left as delivered and this is reported here instead.

Options for the producer:
1. Re-generate shorter ElevenLabs takes. The biggest savings are in 06_answer (55.5 s), 03_knowledge (49.1 s) and 04_explanation (44.3 s). The beat map shows which lines carry each visual.
2. Authorize specific line cuts. The page is timed from `source/beats.js`, so a re-cut only needs new beat times.
3. Publish at 4:47 on a platform that allows it.

## Limitations
- The beats were timed from pause detection plus a local speech-recognition pass. Recognition of the Thai speech was partial, so a few beats inside long phrases (for example แพ / สัตว์พาหนะ, the promo "brand"/"bank" cues) are interpolated. Please spot-check the sync on a phone.
- The video stream ends 1 frame (0.007 s) before the audio, because of `-shortest` in the shared build script. This is inaudible and sits on the static end card.
- The engine's top-left "NaiSibPro" brand badge (y ≈ 130) sits outside the safe zone by series convention. It is decorative; the critical series chip "เตรียมสอบนายสิบ | วิชากฎหมาย" is inside the safe zone.

## Artifacts
`audio_durations.txt`, `beat_map.md`, `legal_logic_check.md`, `safe_zone_report.json`, `first_frame.png`, `scene_preview.png`, `quiz_preview.png`, `answer_preview.png`, `video_contact_sheet.jpg` (12 frames taken from the final MP4), `qc_check.js`
