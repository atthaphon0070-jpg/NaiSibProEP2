# EP.41 handoff

1. **Title:** NaiSibPro EP.41 — รถไฟผ่านเสาไฟ 8 วินาที ผ่านสะพาน 200 เมตร 18 วินาที รถไฟยาวกี่เมตร? (Mathematics: speed, distance, time)
2. **Audio:** `audio/01_hook.mp3`, `02_story.mp3`, `03_knowledge.mp3`, `04_explanation.mp3`, `05_quiz.mp3`, `06_answer.mp3`, `07_promotion.mp3`. These are the originals from the ZIP, byte-identical.
3. **Measured durations (s):** 22.518 · 26.828 · 25.887 · 32.287 · 31.713 · 40.673 · 17.006. That is 196.911 s of narration. Details are in `qc/audio_durations.txt`.
4. **Final runtime:** **203.112 s (3:23.1)**. ⚠ That is 23.1 s over the 180 s maximum. The cause is the source narration (196.9 s) plus the 5 s countdown; the narration was not altered. Options are in `qc/QC_REPORT.md` §1.
5. **Math:** 18 − 8 = 10 s, 200 ÷ 10 = 20 m/s and 20 × 8 = 160 m. Check: 160 + 200 = 360 m and 360 ÷ 20 = 18 s ✓. See `qc/math_validation.json` (12/12 pass).
6. **Quiz answer:** **ค. 160 เมตร.** It is highlighted green only at 145.333 s, on the spoken "ข้อ ค", after the countdown.
7. **Safe zone:** x 220–860, y 350–1430, checked every 0.25 s with animations included. Result: 0 violations across 5,013 element checks (`qc/safe_zone_report.json`).
8. **Countdown:** 139.233 → 144.233 s. That is exactly 150 frames at 30 fps, 30 per digit, with no highlight during the countdown.
9. **Reused shared assets:** `shared/engine/engine.css` and `engine.js` (background, brand header, wipes, quiz cards, countdown, confetti, SFX registry), `shared/fonts/` (Prompt), `shared/brand/logo.png` (unaltered), `mascot_presenter.png`, `mascot_pose.png`, `shared/tools/audio_prep.py`, `audio_mix.py` (two SFX added: `clack` and `horn`), `render.js` and `build_episode.sh`. The shared promo module was not used, because this episode's promo narration (comment prompt, update line, like/share/follow) has different beats; a blue end sequence was built instead.
10. **Final MP4:** `EP41/output/NaiSibPro_EP41_Train_Pole_Bridge.mp4` (1080×1920, 30 fps, H.264 High + AAC 48 kHz, −14.2 LUFS)
11. **Re-render:** `shared/tools/build_episode.sh EP41` takes about 6 minutes with 4 workers. For QC, run `node EP41/tools/qc_math.js EP41`, `node EP41/tools/qc_safezone.js EP41 0.25` and `EP41/tools/qc_video.sh EP41`.
12. **Known issues:**
    - The runtime is over 180 s, as described in item 4. This is a release blocker until the producer decides.
    - Beats are timed to measured phrase onsets without a transcript (no speech-to-text model could be downloaded). Please do one listening pass; adjust in `source/beats.js` if any beat sits one phrase off.
