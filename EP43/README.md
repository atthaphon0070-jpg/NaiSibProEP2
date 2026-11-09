# NaiSibPro EP.43 — From Bit to Quettabyte (เรียงหน่วยข้อมูลจากเล็กไปใหญ่)

**Final video:** `output/NaiSibPro_EP43_Bit_to_Quettabyte.mp4`
- 1080×1920 (9:16), 30 fps constant, H.264 High, yuv420p
- AAC 48 kHz stereo
- Runtime 194.85 s, −14.9 LUFS, −1.0 dBTP

**Rebuild:**
```bash
shared/tools/build_episode.sh EP43
```
The build writes intermediates to `EP43/renders/` (git-ignored). About 6 minutes with 4 workers.

## Timeline (audio-first, measured)
| # | Scene | Audio | Start (s) | Length (s) |
|---|---|---|---:|---:|
| 1 | Hook: frame-0 title + BIT→BYTE→KB→MB→GB→? teaser, TB/YB assumptions, YB with two hidden platforms, full-tower zoom-out | 01_hook.mp3 | 0.00 | 25.97 |
| 2 | Storage devices: flash drive (GB), hard disk (TB), data centre, PB → EB, blank ranking ladder | 02_story.mp3 | 25.97 | 23.33 |
| 3 | Bit 0↔1, 4 bits = 1 nibble, 8 bits = 1 Byte, then Data Size Tower kB → MB → GB → TB, recap, "ยังไม่หมด!" | 03_knowledge.mp3 | 49.29 | 27.79 |
| 4 | Tower PB → EB → ZB → YB (hold), SI ×1,000 card, 2022 new prefixes, RONNA / QUETTA reveal, ZB/YB/RB/QB shuffle | 04_explanation.mp3 | 77.09 | 28.84 |
| 5 | Official quiz: question + four options, tokens appear as spoken | 05_quiz.mp3 | 105.93 | 32.99 |
| 6 | Countdown 5→1, 150 frames, no narration | — | 138.93 | 5.00 |
| 7 | Reveal ข้อ ก. (green), ZB/YB/RB/QB = 10²¹/10²⁴/10²⁷/10³⁰ B, ×1,000 steps, QUETTA card, 13-level ladder, bit ≠ Byte | 06_answer.mp3 | 143.93 | 30.12 |
| 8 | Promo: comments, "เคยรู้จัก Quettabyte ไหม?", official logo, 10,000+ / weekly, LIKE · SHARE · FOLLOW, end card | 07_promotion.mp3 | 174.05 | 19.80 |

The 1.0 s end hold brings the total to 194.85 s. This is over the 180 s cap; see `qc/QC_REPORT.md` → *Runtime conflict*.

## Source
| File | Role |
|---|---|
| `source/index.html` | Page shell and the BLUE DOMINANT theme (overrides the shared pastel CSS for this episode only) |
| `source/units.js` | Single source of truth for the 13 units, their symbols and values, and the official quiz |
| `source/beats.js` | Measured narration beat map (seconds local to each MP3) |
| `source/data_ladder.js` | **Data Size Tower** component and keyframe camera |
| `source/scenes.js` | All 8 scenes, the custom blue wipe, background, SFX cues |
| `tools/` | QC scripts: `qc_page.js`, `unit_validate.py`, `audio_qc.py`, `beat_map.py` |
| `qc/` | Reports, `first_frame.png` and `contact_sheet.png` |

The `audio/` folder holds the seven supplied ElevenLabs files, byte-identical to the ZIP (only the doubled `.mp3.mp3` extension was dropped).

## Re-run QC
```bash
node EP43/tools/qc_page.js
```
```bash
python3 EP43/tools/unit_validate.py
```
```bash
python3 EP43/tools/audio_qc.py EP43/output/NaiSibPro_EP43_Bit_to_Quettabyte.mp4
```
```bash
python3 EP43/tools/beat_map.py
```
