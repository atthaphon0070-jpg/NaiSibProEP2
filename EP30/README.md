# NaiSibPro EP.30 — หยิบลูกบอล 2 ครั้ง ทำไมความน่าจะเป็นไม่เท่าเดิม?

วิชาคณิตศาสตร์ · ความน่าจะเป็น (หยิบ 2 ครั้งโดยไม่ใส่คืน) · Classic 2D motion graphics · Blue × Pink Fusion · 1080×1920 · 30 fps

**Final video:** `output/NaiSibPro_EP30_Probability_Without_Replacement.mp4`

**Lesson:** a box with 3 red and 2 blue balls; draw twice without replacement. P(both red) = 3/5 × 2/4 = 6/20 = 3/10 = 30 %.

Rebuild (from the repo root):

```bash
shared/tools/build_episode.sh EP30
```

QC (after a build):

```bash
EP30/tools/qc_safe.sh
```

```bash
node EP30/tools/qc_dom.js
```

```bash
EP30/tools/qc_video.sh
```

```bash
python3 EP30/tools/mobile_preview.py EP30/output/NaiSibPro_EP30_Probability_Without_Replacement.mp4
```

```bash
python3 EP30/tools/qc_docs.py
```

## Files
| Path | What |
|---|---|
| `audio/` | The seven supplied ElevenLabs recordings, byte-identical (the doubled `.mp3.mp3` extension was dropped) |
| `episode.json` | Segment order, 0.35 s scene gaps, the exact 5 s countdown, output name, music and master settings |
| `source/beats.js` | Every spoken-phrase time used by the animation (seconds from the start of each file) |
| `source/probability.js` | Reusable probability kit: glass box, five balls with stable IDs (R1 R2 R3 B1 B2), scripted draw-without-replacement with a hand and a separate "หยิบออกแล้ว" tray, state-driven count bar, stacked fractions, 30 % ring, 10-cell bar |
| `source/index.html` | All eight scenes (hook, story, knowledge, calculation, quiz, countdown, answer, promo); critical content carries the class `sz` |
| `tools/segment.py`, `tools/syllables.py`, `tools/transcribe_runs.py` | Pause map, syllable onsets and timing-only transcription (EP.20/EP.27 method) |
| `tools/qc_safe.js`, `tools/qc_safe.sh` | Per-frame safe-zone check plus 24 phone/platform overlay simulations → `qc/safe_zone_report.json` |
| `tools/qc_dom.js` | First frame, exact quiz text, countdown frames, no early hint, ball states, count bar vs. balls on every frame, fractions vs. box → `qc/dom_checks.txt`, `qc/probability_validation.json` |
| `tools/qc_video.sh` | Checks on the exported MP4 → `qc/video_checks.txt`, `qc/frame_0001.png`, `qc/countdown_frames.jpg`, `qc/contact_sheet.png` |
| `tools/mobile_preview.py` | Phone-screen previews made from the MP4 → `qc/mobile_preview_*.png` |
| `tools/qc_docs.py` | `qc/audio_durations.txt`, `qc/beat_map.md` |
| `qc/QC_REPORT.md` | QC summary |
| `EP30_HANDOFF.md` | Production handoff |

Shared changes (additive, backward compatible): the `"silence"` segment type, looks K/H and the `printer` SFX from the EP.26/EP.27 branches (identical copies), plus two new SFX in `shared/tools/audio_mix.py`: `clack` (ball landing) and `glass` (tap on the box). No earlier episode was modified.
