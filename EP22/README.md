# NaiSibPro EP.22: ช่วยกันทำ เสร็จกี่วัน? (คณิตศาสตร์, โจทย์งาน)

**Final video:** `output/NaiSibPro_EP22_Work_Rate.mp4`. It is 1080×1920 (9:16), 30 fps CFR, H.264 High yuv420p, with AAC 48 kHz stereo at 192 kbps. It runs 148.1 s (4,444 frames) and measures −13.9 LUFS integrated with a true peak of −0.3 dBTP.

Rebuild it with:

```bash
shared/tools/build_episode.sh EP22
```

Then run QC:

```bash
python3 EP22/tools/qc_final.py && node EP22/tools/qc_layout.js 0.25 > EP22/qc/layout_check.txt && node EP22/tools/qc_content.js > EP22/qc/content_check.txt
```

## 0. Workspace inspection (done before building)

- **Stack:** this is not Remotion or React. The repo uses deterministic HTML/CSS/SVG motion graphics driven by `renderAt(t)` (`shared/engine/engine.js`). Headless Chromium (Playwright) captures every frame as a JPEG (`shared/tools/render.js`). Python and NumPy build the audio-first timeline and the mix (`audio_prep.py`, `audio_mix.py`), and FFmpeg encodes the result (`build_episode.sh`).
- **Reusable parts found in `shared/`:**
  - Prompt Thai/Latin fonts (offline woff2).
  - Real logo `brand/logo.png`.
  - Palette tokens (`--navy #31445D`, pinks and powder blues, `--ok` greens).
  - `life()`/easing/`tf()` helpers, `pressDepth`, confetti, the pastel logo wipe transition, the brand header, the quiz option card component and the 5 s countdown ring.
  - The SFX cue registry plus the synthesized music bed and UI SFX, and the one-command build.
- **Latest episode used as the baseline:** EP05 (`EP05/episode.json`, `source/index.html`, `README.md`). It provided the folder layout (`audio/`, `source/`, `output/`, `renders/` build dir, `.gitignore`), the README format, the series loudness of −14.2 LUFS, the 150-frame silent countdown convention and the fact that narration is never processed alone.
- **Style references EP.12 and EP.14 are not in this repository.** Only `main` and this branch exist, and the newest episode is EP05. So `shared/` and EP05 served as the style baseline, as the order instructs.
- **Conflicts between the order and the repo, and what I chose:**
  1. **Palette.** The series engine is pastel (pink and light-blue background), but the order asks for a navy background with Electric Blue, Cyan and Yellow. A yellow-and-cyan colour code that teaches who painted what cannot be read on a pastel background, so EP22 follows the order: a navy station set as an episode-local background layer. Everything else keeps the series identity: the Prompt font, the brand header (white name on navy), the pastel series logo wipe between scenes, the shared countdown ring, the confetti and the pill/card shapes.
  2. **Promo.** The shared promo module (`promo.js`) shows callouts the 07 narration of this episode does not say (packages, "คลิกลิงก์…"). The order requires approved CTA text only, so EP22 has its own short promo scene built from the transcript.
  3. **Fonts.** The order expects Kanit or Prompt; the repo has Prompt, so Prompt is used.

## Timeline (audio-first, measured from the supplied recordings)

| # | Scene | Audio | Start (s) | Length (s) |
|---|---|---|---:|---:|
| 1 | Hook: keyword at frame 0, officers + wall, 6 วัน / 3 วัน, "?" , ✗ icons, push-in | 01_hook.mp3 | 0.000 | 15.569 |
| 2 | Common mistakes: exam paper, "วัน + วัน", "(วัน + วัน) ÷ 2", freeze, hourglasses, "แปลก!", "?" | 02_story.mp3 | 15.900 | 13.166 |
| 3 | Rule 1: stamp, speed bars, muscles merge, "ห้ามคิดเป็นวัน", "งานต่อวัน" | 03_knowledge.mp3 | 29.367 | 14.446 |
| 4 | Worked example: 4 & 12 days → 12 blocks → 3 + 1 = 4 → 12 ÷ 4 = 3 วัน, memory phrase | 04_explanation.mp3 | 44.133 | 23.171 |
| 5 | Quiz: QUIZ banner, question line by line, 4 neutral cards, plain wall (no grid) | 05_quiz.mp3 | 67.633 | 20.846 |
| 5b | **Silent countdown 5→1**, exactly 150 frames (2655–2804) | — | 88.500 | 5.000 |
| 6 | Answer: ข้อ ก. 2 วัน, 6-block grid, 1 + 2 = 3, 6 ÷ 3 = 2, traps, "< 3 วัน", shortcut formula, memory phrase | 06_answer.mp3 | 93.500 | 39.811 |
| 7 | Promotion: comment "2 วัน ✓", logo, 10,000+, อัปเดตทุกสัปดาห์, กดติดตาม, logo hold (0.99 s after the last word) | 07_promotion.mp3 | 133.633 | 13.714 |

There are 9 frames of silence between files, each start aligned to a frame. The countdown begins on the first frame boundary after 05 ends (0.63 frames of padding), and 06 starts exactly after countdown frame 150. The narration is mixed unedited: in the final track it is bit-identical to the decoded source files, with no time-stretching or trimming and no processing applied to the voice alone. The beat map with every cue is in `qc/beat_map.md`.

**06_answer contains the shortcut-formula lines** ("มีสูตรลัดด้วย… หกคูณสามได้สิบแปด หารเก้า… ได้สอง!"), so the formula beat is built.

## Files

| Path | What it is |
|---|---|
| `episode.json` | Segments (with 9-frame gaps), countdown, output name, music bed (`duck_db: 12`) |
| `audio/` | The 7 approved recordings, byte-identical to the ZIP (only the doubled `.mp3.mp3` extension was dropped, as in EP05) |
| `source/index.html` | Page shell, EP22 colour tokens and styles, scene wiring |
| `source/beats.js` | The beat map as data (file-relative seconds); all animation timing reads from here |
| `source/scenes/common.js` | Absolute timeline, anchors, the shared **work set** layout (wall + grid + officers + labels + calendar) used by scenes 1, 4 and 6 |
| `source/scenes/s0_background.js` … `s7_promotion.js` | One module per scene (`s5_quiz_answer.js` holds quiz + countdown + answer because the choice cards persist across them) |
| `tools/qc_final.py`, `qc_layout.js`, `qc_content.js` | QC on the final MP4 and on the rendered DOM |
| `qc/` | Durations, beat map, frame 0, contact sheet, measurements, layout/content checks, `QC_REPORT.md` |
| `HANDOFF.md` | Handoff notes |

## Shared additions (do not change earlier episodes)

- `shared/engine/props_work.js` is a new file holding the reusable **work grid**, officers, wall, calendar and hourglass. EP03–EP05 do not load it.
- `audio_prep.py` has an optional `"gap"` per segment.
- `audio_mix.py` has the `roller` SFX and an optional `music.duck_db`.
- Verified for EP05: the new `audio_prep.py` writes a byte-identical timeline and narration, and the new `audio_mix.py` writes a byte-identical `mix.wav`. EP03, EP04 and EP05 pages still render.
