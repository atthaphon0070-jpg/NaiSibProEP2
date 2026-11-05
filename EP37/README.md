# NaiSibPro EP.37 — เปิดน้ำ 2 ก๊อก แต่มีท่อระบาย น้ำจะเต็มถังในกี่ชั่วโมง?

**Final video:** `output/NaiSibPro_EP37_Water_Taps_Work_Rate.mp4` — 1080×1920 (9:16), 30 fps CFR, H.264 High yuv420p + AAC 48 kHz stereo, **261.1 s (4:21)**, −14.1 LUFS, peak −0.1 dBFS. QC summary: `qc/QC_REPORT.md` · full handoff: `EP37_HANDOFF.md`.

Rebuild: `shared/tools/build_episode.sh EP37` · QC: `node EP37/qc/validate.js` · Stills: `EP37/qc/stills.sh <dir> 0,12.5,…`

> ⚠️ **Runtime:** the seven supplied recordings total 254.90 s, so the unmodified episode is 4:21 — 81 s over the 3:00 limit. The audio was not cut, sped up or re-voiced. Reaching 2:55 requires a script about 86 s shorter, re-recorded. See `EP37_HANDOFF.md` §15.

## Files
| Path | Purpose |
|---|---|
| `audio/` | The 7 narration files from the ZIP, byte-identical (only the doubled `.mp3.mp3` extension dropped) |
| `episode.json` | Segment order, the 5 s countdown, music settings (104 BPM, voice ducking 0.45) |
| `source/index.html` | Page + **blue-dominant theme** overriding the shared pastel-pink engine CSS (logo art untouched) |
| `source/math_logic.js` | Exact rational work-rate maths; single source of every number and tank level |
| `source/water_system.js` | Reusable animated transparent tank: taps A/B, bottom drain (outflow only), mean-preserving waves, bubbles, ripples, splashes, scale ticks |
| `source/beats.js` | Measured phrase cues for all 7 files |
| `source/scenes.js` | The 8 scenes (hook, story, knowledge, explanation, quiz, countdown, answer, promo) |
| `qc/` | `validate.js` plus its reports, audio durations, beat map, first frame, contact sheet, QC report |

Shared-system changes (additive): `shared/tools/audio_mix.py` gained the `water`, `drain`, `splash`, `bubble`, `tap` and `err` SFX kinds and an opt-in `music.duck` key. Earlier episodes don't use either, so their output is unchanged.
