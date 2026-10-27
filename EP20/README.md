# NaiSibPro EP.20 — 1101 ไม่ใช่พันหนึ่งร้อยเอ็ด! อ่านเลขฐานสองใน 5 วิ

**Subject:** คอมพิวเตอร์, binary to decimal using the light-bulb 8-4-2-1 method ("เปิดไฟ แล้วบวก").
**Final video:** `output/NaiSibPro_EP20_Binary_1101.mp4`. Specs and QC results are in `qc/QC_REPORT.md`.
**Rebuild it with:** `shared/tools/build_episode.sh EP20`

## 0. Inspection summary (written before the build)

**Stack.** The repo uses its own deterministic HTML/CSS/JS motion engine. It does not use Remotion, Canvas or Blender. A page exposes `renderAt(t)`. Headless Chromium (Playwright) captures every frame to JPEG, a numpy mixer builds the soundtrack, and FFmpeg encodes H.264 + AAC. One command runs all of it: `shared/tools/build_episode.sh EPxx`.

**Style references.** EP.12 and EP.14 are not in this repository on any branch; only `main` and this branch exist. The style baseline is therefore `shared/` plus the most recent episode, EP05, and their conventions are followed here.

**Reused from `shared/`, unchanged:**
| Component | Used for |
|---|---|
| `engine/engine.js` and `engine.css` | `renderAt` loop, easing, `life()` entrances, scene switching, brand header (real logo), wipe transition, countdown ring component, SFX cue registry, `+` glyph fix |
| `fonts/` (Prompt, Thai + Latin, weights 400–800) | All text. This is the series font; Kanit is not in the repo. |
| `brand/logo.png` | Brand header and the CTA logo, shown as-is (no redraw or recolour) |
| `tools/audio_prep.py`, `render.js`, `audio_mix.py`, `build_episode.sh` | Audio-first timeline, frame capture, music + SFX mix, encode |
| SFX library in `audio_mix.py` | click (bulbs and switches), whoosh, drop (thud on ✗), buzz (wrong), tick/tick2 (countdown), ding + success (results 10 and 13), sparkle, page, freeze, zip, cloth, coin, type |
| Music bed (`audio_mix.py` synth loop) | Series bed with an EP20 chord progression in `episode.json` |

**New, added to `shared/` without affecting earlier episodes:**
- `engine/props_binary.js` contains `BINROW`, the reusable light-bulb place-value row. Input: a column count and a binary string. Output: digits centred over their bulbs, flat-2D bulbs with OFF and ON states (7-frame ramp, bloom, optional red flash), place-value labels and "×2" arrows. No earlier episode loads this file.
- `tools/audio_prep.py` accepts a new optional `{"silence": s}` segment, used for the 9-frame gaps between files. Earlier episodes don't use it, and their timelines were re-generated and are unchanged (EP05: end 150.611 s, countdown at 103.400 s, matching its README; EP04: end 148.387 s).

**New in `EP20/` (episode-specific):** a navy/cyan tech background (circuit board with parallax, slow 0/1 rain), an exam room (desk, answer sheet, pencil, ticking wall clock, back desks), toggle switches 0/1, a monitor, a comment icon, a subscribe button, the hex teaser card, the quiz choice cards with ✓/✗ states, and the scene modules for all 7 scenes plus the countdown.

**Missing or deviating:**
- Whisper and other speech-recognition models can't be downloaded here (HuggingFace is blocked by the network policy). The beat map was therefore measured from the waveform: silence detection, syllable onsets, and spectrogram reading of the /s/ onsets of ศูนย์/สอง/สี่/สิบ/สาม. See `qc/beat_map.md`.
- The shared EP03–EP05 look is pastel pink/blue. This brief asks for a navy tech palette, so EP20 overrides the background, wipe colours and brand-header text colour in its own CSS. Shared files are not edited.

## Episode files
| Path | What it is |
|---|---|
| `audio/01_hook.mp3 … 07_promotion.mp3` | The seven supplied recordings (byte-identical to the ZIP; only the doubled `.mp3.mp3` extension was dropped) |
| `episode.json` | Segment order, 0.3 s gaps, 5 s countdown, tail, music settings, output name |
| `source/beats.js` | Measured beat map (file-local seconds). Every visual beat reads its time from here. |
| `source/index.html` | Scenes 1–7 + countdown (one draw function per scene: `drawHook`, `drawStory`, `drawKnow`, `drawExpl`, `drawQuiz` (quiz + countdown + answer), `drawPromo`) |
| `tools/segment.py`, `syllables.py`, `spectro.py` | Timing analysis (silence map, syllable onsets, spectrogram PNGs) |
| `tools/qc_docs.py` | Writes `qc/audio_durations.txt` and `qc/beat_map.md` |
| `tools/qc_video.sh` | Frame-0 still, contact sheet, ffprobe, loudness and black-frame check on the final MP4 |
| `qc/` | QC report and evidence |
| `output/NaiSibPro_EP20_Binary_1101.mp4` | Final video |
| `HANDOFF.md` | Hand-off notes |

`renders/` (frames, mix) is a build directory and is git-ignored, like EP05.
