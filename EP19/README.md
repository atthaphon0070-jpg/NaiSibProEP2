# NaiSibPro EP.19 — ตราครุฑ วางกลาง หรือ มุมซ้าย? (งานสารบรรณ)

**Final video:** `final/NAISIBPRO_EP19_2D_GARUDA_SIZE_POSITION.mp4`. It is 1080×1920 (9:16), 30 fps CFR, H.264 High yuv420p, with AAC 48 kHz stereo audio at about 192 kbps. It runs 148.66 s (4,459 frames), measures −16.0 LUFS integrated, and peaks at −2.2 dBFS true peak.

Rebuild everything (timeline, beat map, layout QC, frames, mix, MP4, final QC) with one command from the repo root:

```bash
EP19/build.sh            # final MP4 + QC
EP19/build.sh --preview  # renders/preview.mp4 + renders/preview_540.mp4
```

The episode teaches one fact. A **หนังสือภายนอก** (external letter) uses a 3 cm Garuda, centred at the top of the page, about 2.5 cm from the top edge. A **บันทึกข้อความ** (internal memo) uses a 1.5 cm Garuda in the top-left corner. Memory phrase: **ใหญ่อยู่กลาง เล็กอยู่ซ้าย**. Quiz answer: **ค.**

## 1. Repository inspection (done before building)
| Item | Finding |
|---|---|
| Video stack | HTML/CSS/JS motion pages with a deterministic `renderAt(t)` (`shared/engine/engine.js`). Headless Chromium (Playwright) captures every frame (`shared/tools/render.js`), Python/NumPy builds the timeline and mix, and FFmpeg encodes. No Remotion, React or Blender. |
| Episodes present | EP.02 (`project/` + MP4), EP03, EP04 and EP05. `main` and the working branch are the only branches. |
| **EP.12 / EP.14** | **Not in this repository on any branch.** The look follows the documented EP.12/EP.14 brand (navy, Electric Blue, Cyan, white, yellow highlight, pink/red accent, Prompt font), built on `shared/` and the EP05 conventions. |
| Fonts | Prompt (Thai + Latin, weights 400–800) from `shared/fonts/`. Kanit is not in the repo. |
| Logo | `shared/brand/logo.png`, used unchanged: small in the shared brand header, and large only in the CTA. |
| Garuda asset | None in the repo. A new, original, simplified and symmetric vector was drawn for this episode (`assets/garuda.svg`). It has no face, no expression and no distortion. |
| Series music | Synthesised by `shared/tools/audio_mix.py` (no music files exist). EP19 sets its own chord progression and level in `episode.json`. |
| Missing / adapted | `shared/engine/promo.js` shows packages, subjects and a "link in profile" CTA that are not in this script, so EP19 has its own promo scene that uses the approved CTA only. The shared quiz-card CSS is pastel and its reveal can't show per-card ✗ marks, so EP19 has its own card renderer. It reuses the shared countdown, confetti, wipe, brand header, SFX registry and easing. |

## 2. Reused vs new
- **Reused unchanged:** engine runtime (`NSP.start`, `life`, easing, `tf`), the 5-second countdown component, confetti, section wipes and the brand header (recoloured by EP-local CSS), `render.js`, `build_episode.sh`, the mixer and music synthesiser, the logo, and Prompt.
- **Shared, extended (backwards compatible):**
  - `audio_prep.py` gains a `{"silence": s}` segment for frame-aligned 6–12-frame gaps.
  - `audio_mix.py` gains a soft `err` SFX for wrong marks.
  - Verified: EP03/EP04/EP05 `timeline.js` and `narration.npy` are byte-identical to before. The EP04/EP05 `mix.wav` are byte-identical under the old and new mixer. EP03/EP04/EP05 pages still render with no page errors.
- **New in EP19:**
  - `source/ep19.css`: navy theme.
  - `source/scenes/common.js`: beat-map timing, Garuda, A4 pages, ruler, snap easing, blueprint background, screen shake.
  - One module per scene: `s1_hook`, `s2_story`, `s3_knowledge`, `s4_explanation`, `s5_quiz_answer` (quiz + countdown + answer), `s7_promo`.
  - `tools/beatmap.py`, `tools/qc_layout.js`, `tools/qc_final.py`, and `build.sh`.

## 3. Timeline (audio-first, measured)
| # | Scene | Audio | Start (s) | Length (s) |
|---|---|---|--:|--:|
| 1 | Hook | 01_hook.mp3 | 0.000 | 14.028 |
| 2 | Story | 02_story.mp3 | 14.333 | 16.509 |
| 3 | Knowledge | 03_knowledge.mp3 | 31.167 | 16.849 |
| 4 | Explanation | 04_explanation.mp3 | 48.333 | 22.596 |
| 5 | Quiz | 05_quiz.mp3 | 71.233 | 30.589 |
| 5b | **Silent countdown 5→1** | — | 101.833 (frame 3055) | 5.000 (150 frames) |
| 6 | Answer | 06_answer.mp3 | 106.833 (frame 3205) | 26.828 |
| 7 | Promo + logo hold | 07_promotion.mp3 | 133.967 | 13.793 (+0.9 s hold) |

- **Gaps:** exactly 9 frames after 01, 02, 03, 04 and 06. There is no gap after 05: the countdown starts on the first frame boundary after the narration ends (0.32 frame of padding).
- **Narration:** never trimmed, stretched or processed on its own. One uniform −2.4 dB master gain and a −1 dBFS limiter are applied to the whole mix.
- **Beat timing:** every visual beat is driven by `source/beats.js`, generated from the audio by `tools/beatmap.py` (see `qc/beat_map.md`). The voiced-run count of every file matches the approved transcript's phrase count exactly (10/10/11/12/19/20/9), which also confirms each recording is the right one. Beats inside a run are interpolated by Thai character position.

## 4. Assets
- `audio/`: the seven files from the upload, byte-identical. Two names were normalised: the doubled `.mp3.mp3` extension was dropped, and `7_promotion` was renamed to `07_promotion`.
- `assets/garuda.svg`: the original Garuda vector, loaded once and referenced with `<use>` everywhere.
- Diagram scale:
  - A4 pages keep the 210 × 297 proportion.
  - In every diagram, the Garuda emblems and the 2.5 cm gap are drawn at 2× page scale for phone legibility. The factor is the same on every page, so the 3 cm emblem is always exactly twice the height of the 1.5 cm one.
  - In the knowledge scene, both emblems share one ruler scale (120 px = 1 cm).
