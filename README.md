# NaiSibPro EP.02 — คีย์ลัด Excel ที่ควรรู้ (สอบตำรวจ วิชาคอมพิวเตอร์)

**Final video:** `NaiSibPro_EP02_Excel_Shortcuts.mp4`. It is 1080×1920 (9:16), 30 fps, H.264 + AAC 48 kHz stereo, runs 113.3 s, and its loudness is about −13 LUFS.

## Timeline (audio-first, measured from the supplied ElevenLabs files)
| # | Scene | Audio | Start | Length |
|---|-------|-------|------:|------:|
| 1 | Hook | 01_hook.mp3 | 0.00 | 10.76 |
| 2 | Ctrl+S / Ctrl+Z | 02_basic.mp3 | 10.76 | 12.83 |
| 3 | F2 | 03_edit.mp3 | 23.59 | 9.80 |
| 4 | Ctrl+1 / Ctrl+Shift+L | 04_advanced.mp3 | 33.38 | 14.99 |
| 5 | Quiz question | 05_quiz.mp3 | 48.38 | 24.27 |
| 6 | **Silent countdown 5→1** | *(no narration)* | 72.65 | 5.00 |
| 7 | Answer reveal (ค. Ctrl + Shift + L) | 06_answer.mp3 | 77.65 | 13.64 |
| 8 | Promo + end card | 07_promotion.mp3 | 91.28 | 20.43 (+1.6 s end-card hold) |

The narration plays unedited, with no speed change and no trimming. The background music sits about 20 dB under the voice and the UI sound effects are quiet.

## Project
`project/` contains everything needed to rebuild the video with `project/build.sh`:
- `public/index.html` is the deterministic HTML/CSS/JS motion-graphics timeline (`renderAt(t)`), using the Prompt font for Thai.
- `audio_prep.py` decodes the narration, measures the real durations and writes the timeline.
- `render.js` uses headless Chromium (Playwright) to capture the frames and export the SFX cue list.
- `audio_mix.py` builds the narration track with the 5 s silence and adds the synthesized music and SFX.
- `assets/` holds the original audio and brand images.
