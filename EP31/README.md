# NaiSibPro EP.31 — เวลา 3:15 น. เข็มนาฬิกาทับกันจริงหรือ? (The Clock Angle Trap)

**Final video:** `output/NaiSibPro_EP31_Clock_Angle_0315.mp4`. It is 1080×1920, 30 fps, H.264 High + AAC 48 kHz stereo, runs 209.97 s and measures −13.5 LUFS.

**The answer:** at 03:15 the minute hand is at 90° and the hour hand at 97.5°, so the smaller angle is **7.5° (ข.)**.

**Rebuild:** run `shared/tools/build_episode.sh EP31`, then `node EP31/tools/qc.js EP31` for QC.

**Runtime:** the supplied narration alone runs 203.96 s, so the 180 s target cannot be met without editing speech. See `EP31_HANDOFF.md` for the details and suggested cuts.

| # | Scene | Audio | Start (s) | Length (s) |
|---|---|---|---:|---:|
| 1 | Hook: the 03:15 trap, the wrong "0° ?" model, push-in on 3 | 01_hook.mp3 | 0.00 | 22.75 |
| 2 | Exam-room story, circled 0°, zoom + magnifier | 02_story.mp3 | 22.75 | 27.56 |
| 3 | 6°/min vs 0.5°/min, jump ✗ vs continuous ✓ | 03_knowledge.mp3 | 50.31 | 31.79 |
| 4 | Quick method: 03:00 = 90°, formulas, difference | 04_explanation.mp3 | 82.10 | 29.88 |
| 5 | Quiz (ก 0° / ข 7.5° / ค 15° / ง 30°) | 05_quiz.mp3 | 111.99 | 23.17 |
| 6 | **Silent countdown 5→1** (150 frames) | — | 135.17 | 5.00 |
| 7 | Answer: 15×6 = 90°, 15×0.5 = 7.5°, 97.5° − 90° = 7.5°, distractors, memory | 06_answer.mp3 | 140.17 | 49.40 |
| 8 | Promo + end card | 07_promotion.mp3 | 189.56 | 19.41 (+1.0 s tail) |

The clocks run on the shared time-driven engine `shared/engine/props_clock.js`. QC reports are in `qc/`.
