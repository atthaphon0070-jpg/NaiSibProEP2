# EP.33 handoff — NaiSibPro วิชาคณิตศาสตร์: คนที่เรียนสองวิชาพร้อมกันมีกี่คน? (เซตและการนับซ้ำ)

## 1. Episode
**Title:** NaiSibPro EP.33 — คนที่เรียนสองวิชาพร้อมกันมีกี่คน? It is a classic 2D motion-graphics explainer in Blue × Pink Fusion, built audio-first at 9:16, 1080×1920, 30 fps.

## 2. Audio files (from the user's ZIP, byte-identical; only `.mp3.mp3` → `.mp3`)
`audio/01_hook.mp3`, `02_story.mp3`, `03_knowledge.mp3`, `04_explanation.mp3`, `05_quiz.mp3`, `06_answer.mp3`, `07_promotion.mp3`. All are 44.1 kHz mono MP3, with SHA-256 hashes in `qc/audio_durations.txt`.

## 3. Measured durations
| File | Seconds |
|---|---:|
| 01_hook | 24.111 |
| 02_story | 31.556 |
| 03_knowledge | 25.391 |
| 04_explanation | 24.842 |
| 05_quiz | 30.433 |
| 06_answer | 45.087 |
| 07_promotion | 18.756 |
| **narration total** | **200.176** |

## 4. Final runtime
**206.176 s (3:26.2)** = 200.176 s narration + 5.000 s countdown + 1.000 s end-card hold. There are 6,185 frames.
**This exceeds the 180 s maximum.** See §12.

## 5. Equation validation — `qc/math_validation.json` (18/18 checks PASS)
- At least one subject = 360 − 50 = 310.
- Both = 230 + 190 − 310 = 110 (equivalently 420 − 310 = 110).
- Computer only = 230 − 110 = 120, and law only = 190 − 110 = 80.
- Region check: 120 + 110 + 80 + 50 = 360. The union is 120 + 110 + 80 = 310, the computer circle 120 + 110 = 230, and the law circle 80 + 110 = 190.
- Correct option is **ค. 110 คน**. The trap ก. 60 = 230 + 190 − 360 is shown in red and explained as "ลืมหัก 50 คนที่อยู่นอกวงออกก่อน".
- The Venn people-dots use 1 dot = 10 people: 12 + 11 + 8 inside, 5 outside, 36 in total.
- Every number on screen comes from `source/math_logic.js`.

## 6. Safe-zone validation — `qc/safe_zone_report.json` (PASS)
- Safe zone: x 220–860, y 350–1430.
- 116 critical elements (`.crit`) were sampled every 0.25 s across the whole video (825 samples), measuring painted text and boxes, including entry animations and the engine's 2.5 % push-in. **0 violations.**
- Content columns are x 248–832 to leave room for the push-in and pop overshoot.
- iPhone fill-crop simulation: 375×812, 390×844 and 430×932 all show source x ≈ 97–983, so the whole safe zone is visible. The smallest critical font is 28 px on the master, which is 11.8–13.6 CSS px on those phones.
- Shorts/Reels/TikTok overlays (top bar, right rail from x 930, caption from y 1450) do not reach the safe zone.
- Frame 0 shows **เตรียมสอบนายสิบ** fully at opacity 1, at x 249–831, y 640–736. There is no black intro.
- Decorative items (mascots, the NaiSibPro brand badge, confetti, background) sit partly outside the safe zone on purpose.

## 7. Countdown verification
The countdown starts at 136.333 s (frame 4090) and runs frames 4090–4239: **5, 4, 3, 2, 1 at 30 frames each (150 frames, exactly 5.000 s)**. There is no narration under it. The question and all four choices stay visible. Option ค's highlight opacity is 0 on all four options one frame before the answer audio, and it turns green on "ข้อ ค" at answer + 1.07 s (142.40 s).

## 8. Reused engine components (`shared/`)
- `engine.css` / `engine.js`: background, brand badge, wipes, `life()` easing, quiz option cards, `buildCountdown`/`drawCountdown`, confetti, the '+' glyph fix, and the SFX registry.
- `tools/audio_prep.py`, `render.js`, `audio_mix.py`, `build_episode.sh`.
- Brand assets: logo, mascot cut-outs, the approved poster (shown whole) and the Prompt fonts.
- One backward-compatible engine change: `drawQuizOptions(..., { enterX })` sets the option slide-in distance. The default stays 300, so EP.03–05 are unchanged. EP.33 uses 36 to stay inside its safe column.
- The shared `promo.js` was **not** used because it lays out on the older 70–950 px column. EP.33 has its own compact promo (`scenes/s6_promo.js`), timed to this episode's promo narration and built from the same brand assets.

## 9. New Venn-diagram components
- `source/venn.js` (`VENN.build(el).set(state)`) is reusable. It provides:
  - a universe box and two self-drawing circles with name tags (with an optional count suffix);
  - people-dots placed deterministically per region;
  - an overlap lens highlight, a union tint, and an outside-region highlight with a marching dashed border;
  - a "นับซ้ำ ×2" double-count effect, region value tags and an outside tag.
  - Clip and mask ids are unique per instance, so several diagrams can share a page.
- `source/math_logic.js` is the shared math model, readable both by the page and by Node.
- `qc/validate.js` writes the math, safe-zone, countdown and early-reveal reports, plus the preview stills (`first_frame.png`, `quiz_preview.png`, `venn_preview.png`).

## 10. Final MP4
`EP33/output/NaiSibPro_EP33_Set_Overlap_Venn.mp4` (71.4 MB)
- Video: H.264 High, 1080×1920, 30 fps, 6,185 frames, yuv420p, faststart.
- Audio: AAC-LC 48 kHz stereo.
- Loudness: −14.1 LUFS integrated, true peak −0.3 dBFS. No extra mastering was needed because this narration is about 5 dB louder than EP.05's.
- Narration gain is 1.0, with light synth music about 18 dB under the voice and UI SFX.
- The full file decodes without errors.

## 11. Re-render
Full build (about 9 min on 4 cores):

```bash
shared/tools/build_episode.sh EP33
```

Run QC after any change:

```bash
python3 shared/tools/audio_prep.py EP33 && node EP33/qc/validate.js
```

## 12. Known issues
- **Runtime blocker: 206.2 s against the 180 s maximum.** The narration alone is 200.2 s, so no layout choice can bring it under 3 minutes. As instructed, the narration was not altered. Any of these would fix it, but each needs the user's decision:
  1. **Re-record or regenerate shorter narration in ElevenLabs.** About 26 s has to go. The biggest candidates are 06_answer (45.1 s; its last ~15 s repeats the trap and tip), 02_story (31.6 s) and 05_quiz (30.4 s; it reads the full question again).
  2. **Approve specific cuts** of whole sentences, for example the 60-trap recap in 06 (30.3–37.4 s) or "อยากฝึกโจทย์…" in 07 (3.2–5.6 s). Even with both cuts the runtime only falls to about 196 s, so more would be needed.
  3. **Approve trimming pauses longer than 0.35 s.** That saves only about 10–12 s, which is not enough on its own.
  4. **Accept 3:26.** That works for TikTok and Reels. YouTube Shorts allows up to 3:00.
- Timing comes from a local Whisper "small" pass plus silence detection. The model failed on 03 and 04 as whole files, so those were transcribed in chunks. Beats were checked against the phrase pauses; small (≤0.2 s) offsets are possible.
- The "ให้เวลาคิด 5 วินาที!" pill fades out during the first ~0.3 s of the countdown, briefly overlapping the ring. This is cosmetic.
