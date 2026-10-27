# EP20 handoff

| | |
|---|---|
| Episode | EP.20 (number taken from the supplied ZIP name `…ep20.zip`) |
| Subject | คอมพิวเตอร์ |
| Topic | Binary → decimal, light-bulb 8-4-2-1 method, memory phrase "เปิดไฟ แล้วบวก" |
| Worked example | 1010₂ = 8 + 2 = 10 |
| Quiz | เลขฐานสอง 1101₂ มีค่าเท่าใดในเลขฐานสิบ: ก. 11 / ข. 12 / **ค. 13 (correct)** / ง. 1,101 |
| Final file | `EP20/output/NaiSibPro_EP20_Binary_1101.mp4`: 130.40 s, 1080×1920, 30 fps, H.264 High + AAC 48 kHz, −14.1 LUFS |
| Re-render | `shared/tools/build_episode.sh EP20` (about 6 min on 4 cores; `WORKERS=n` to change parallelism) |

## Audio (supplied recordings, unedited)
| File | Duration | Starts at |
|---|---:|---:|
| 01_hook.mp3 | 14.446 s | 0.000 s |
| 02_story.mp3 | 14.028 s | 14.746 s |
| 03_knowledge.mp3 | 19.226 s | 29.073 s |
| 04_explanation.mp3 | 18.442 s | 48.600 s |
| 05_quiz.mp3 | 16.039 s | 67.342 s |
| countdown (silent, 150 frames) | 5.000 s | 83.400 s |
| 06_answer.mp3 | 26.279 s | 88.400 s |
| 07_promotion.mp3 | 14.524 s | 114.979 s |

Each gap between files is 0.3 s (9 frames). The countdown starts at the end of 05 and 06 starts right after countdown frame 150. The recording ends with "ตอนหน้าเจอเลขฐานสิบหก!", so the hex teaser is shown.

## Stack
The stack is the repo's HTML/CSS/JS deterministic `renderAt(t)` engine (`shared/engine`). Headless Chromium (Playwright) captures the frames, a numpy mixer builds the synth bed and SFX, and FFmpeg encodes. The build is 2D only; no Blender is involved.

## Reused vs new
- **Reused unchanged:** `engine.js` / `engine.css` (life/easing, brand header with the real logo, wipe, countdown ring, SFX registry), the Prompt fonts, `logo.png`, `audio_prep.py`, `render.js`, `audio_mix.py` (music bed + SFX library) and `build_episode.sh`.
- **New shared component:** `shared/engine/props_binary.js` (`BINROW`). It takes a column count and a binary string (`setBits('1101')`) and lays out aligned digits, flat bulbs and place-value labels, with optional "×2" arrows. `light(i, level, red)` drives ON/OFF (7-frame ramp + bloom) and the red flash; `BINROW.ramp()` and `BINROW.flicker()` are helpers. Pass `values` for other bases, e.g. hex place values, in a future episode. No earlier episode loads it.
- **Shared tool extension:** `audio_prep.py` accepts an optional `{"silence": s}` segment. It is backward compatible: EP04 and EP05 timelines re-generate unchanged, and EP04/EP05 pages still render.
- **New, episode-only:** the navy circuit/0-1-rain background, exam room, switches, monitor, quiz cards with ✓/✗ states, promo icons, and scene modules `drawHook`, `drawStory`, `drawKnow`, `drawExpl`, `drawQuiz` (quiz + countdown + answer) and `drawPromo` in `source/index.html`. Timing comes from `source/beats.js`.

## QC
Every checklist item passes; see `qc/QC_REPORT.md`. Two items carry a note: "13 before 06" (only the required choice card ค. 13 is visible) and transient 1–9 px safe-zone overshoots during pop or pulse animations.

## Known issues / deviations (and why)
1. **The beat map has no forced alignment.** HuggingFace is blocked by the network policy, so no Whisper model could be downloaded. Beats were measured from the silence map, syllable onsets and spectrograms; the tools are in `EP20/tools/`. If a reviewer hears a drift, change the number in `source/beats.js` and rebuild. Every visual beat follows it.
2. **The palette differs from EP03–EP05.** The brief asks for navy/cyan, while the shared look is pastel. The override lives only in EP20's CSS (background, wipe colours, brand text colour).
3. **EP.12 and EP.14 are not in the repo.** No branch has them, so `shared/` + EP05 was used as the style baseline.
4. **The hook keyword is on two lines.** "เตรียมสอบนายสิบ" at ≥ 110 px is wider than the 680 px safe zone on one line, so it is split เตรียมสอบ / นายสิบ at 118 px.
5. **Loudness is −14.1 LUFS, not −16.** The brief says to match earlier episodes if they use a different target; EP05 is −14.2 LUFS and EP02 about −13.
6. **The music bed sits about 14 dB under the voice.** That is the brief's 10–14 dB duck, done with a lower bed level rather than sidechain ducking; the shared mixer keeps the narration untouched.
7. **The brand-header EP pill uses the series' 22 px size.** It is series chrome outside the safe zone; all content text is ≥ 42 px. Decorative 0/1 rain, monitor-screen digits and the binary numbers on the promo practice sheets are background art, not readable copy.
8. **The audio files were renamed.** The ZIP had doubled `.mp3.mp3` extensions, which were dropped. The content is byte-identical, the same handling as EP05.
