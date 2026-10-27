# EP19 handoff

| | |
|---|---|
| Episode | EP.19 |
| Subject | งานสารบรรณ (government correspondence) |
| Topic | Garuda emblem size and position: external letter 3 cm top-centre (≈ 2.5 cm from the top edge), memo 1.5 cm top-left. Memory phrase: ใหญ่อยู่กลาง เล็กอยู่ซ้าย |
| Correct answer | **ค.** หนังสือภายนอก ครุฑสูง 3 ซม. วางกึ่งกลางด้านบน |
| Final file | `EP19/final/NAISIBPRO_EP19_2D_GARUDA_SIZE_POSITION.mp4` (148.66 s, 98 MB) |
| Re-render | `EP19/build.sh` from the repo root (about 6 min with 4 workers; `WORKERS=n` to change) |
| Stack | Shared HTML/JS `renderAt(t)` engine → Playwright/Chromium frames → NumPy mix → FFmpeg (H.264/AAC) |

## Audio files and durations
| File | Duration (s) |
|---|--:|
| 01_hook.mp3 | 14.028 |
| 02_story.mp3 | 16.509 |
| 03_knowledge.mp3 | 16.849 |
| 04_explanation.mp3 | 22.596 |
| 05_quiz.mp3 | 30.589 |
| 06_answer.mp3 | 26.828 |
| 07_promotion.mp3 | 13.793 |

These seven files come from the uploaded ZIP and are byte-identical. Only the names were normalised: the doubled `.mp3.mp3` extension was dropped, and `7_promotion` was renamed to `07_promotion`.

## Components
- **Reused unchanged:**
  - Engine runtime, countdown, confetti, wipes, brand header.
  - `render.js`, `build_episode.sh`, the mixer and music synthesiser.
  - The logo and the Prompt fonts.
- **Shared, extended (backwards compatible, verified byte-identical for EP03–EP05):**
  - The `silence` segment in `audio_prep.py`.
  - The `err` SFX in `audio_mix.py`.
- **New:**
  - The EP19 navy theme and Garuda vector.
  - Six scene modules, the beat-map generator, layout QC, final-file QC, and `build.sh`.

## QC results
All items pass: see `qc/QC_REPORT.md` and `qc/frame_0001.png`.

## Deviations from the production order (with reasons)
1. **Folder layout:** the episode lives in `EP19/` as the repo-context section asked. It uses the shared builder's folders: `source/scenes/` holds the scene modules, `renders/` holds intermediates (git-ignored), and `final/` and `qc/` hold the deliverables.
2. **EP.12 / EP.14 are not in the repo.** The style baseline is `shared/` + EP05, re-themed to the documented EP.12/EP.14 navy palette.
3. **Font:** Prompt, not Kanit, because Prompt is the font the repo actually ships.
4. **Promo:** EP19 uses its own CTA scene, not `shared/engine/promo.js`, because the shared module shows packages, subjects and links that are not in this script.
5. **Diagram scale:**
   - Emblems and the 2.5 cm gap are drawn at 2× page scale so they are legible on a phone. The 2:1 ratio between the two emblems is exact everywhere.
   - In the explanation scene, the camera focuses on each page in turn (1.3×) before both return side by side. This makes the emblems, guideline and dimension readable while keeping the split-screen layout.
6. **Answer-scene labels:** "ขนาดผิด" / "ตำแหน่งผิด" appear in the explanation panel under the cards, next to a red ✗ on the card itself. Putting the label on the card would have covered the choice text.
7. **Music bed:** the mixer has no voice-keyed ducking. The bed sits at a constant 12–13 dB under active speech, with a local limiter where voice + bed would clip.
8. **Countdown "5":** it fades and scales in over the first ~5 frames of its 30-frame slot, using the shared countdown component's entrance.
9. **Frame count:** 4,459 frames, not 4,460. The shared `-shortest` mux drops the last frame because the audio ends 8 ms earlier.

## Known issues / for the producer to confirm
- **Factual check:** please confirm the "≈ 2.5 ซม. from the top edge" figure against the current regulation template. It comes from the approved narration and was not changed. Some templates instead quote about 1.5 cm from the top edge to the emblem.
- **File size:** the final MP4 is 98 MB (CRF 17, the series encoder setting). That is below GitHub's 100 MB hard limit, but GitHub warns about files over 50 MB.
- **Alignment method:** no network access to ASR model weights, so phrase timing comes from silence detection matched to the transcript. Every file's phrase count matched exactly, and any change in the audio stops the build. Sub-phrase beats are interpolated by character position (estimated ±3–5 frames).
