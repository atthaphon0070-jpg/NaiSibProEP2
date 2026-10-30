# NaiSibPro EP.32 — ลำดับศักดิ์ของกฎหมายไทย

**Final video:** `output/NaiSibPro_EP32_Thai_Law_Hierarchy.mp4`

- 1080×1920 (9:16), constant 30 fps, H.264 High at CRF 20, yuv420p.
- AAC 48 kHz stereo, −14.6 LUFS.
- Runs **297.6 s**, which is over the 240 s target. The supplied narration alone is 291.4 s (see `EP32_HANDOFF.md`).

Rebuild with `shared/tools/build_episode.sh EP32`.

| # | Scene | Audio | Start (s) | Length (s) |
|---|---|---|---:|---:|
| 1 | Hook: เตรียมสอบนายสิบ on frame 0, พ.ร.บ. vs พ.ร.ก. scale, hidden pyramid, fast pyramid preview | 01_hook.mp3 | 0.00 | 28.92 |
| 2 | Story: hypothetical government office, กฎกระทรวง vs พระราชบัญญัติ, enabling-law link | 02_story.mp3 | 28.92 | 42.76 |
| 3 | Pyramid built tier by tier: Constitution → Organic Act → พ.ร.บ. = พ.ร.ก. → subordinate law | 03_knowledge.mp3 | 71.68 | 65.80 |
| 4 | Four exam traps (including the balanced scale) and a fast pyramid recap | 04_explanation.mp3 | 137.48 | 54.20 |
| 5 | Quiz (four neutral choices) | 05_quiz.mp3 | 191.69 | 24.27 |
| 6 | **Silent countdown 5→1**, exactly 150 frames | — | 215.97 | 5.00 |
| 7 | Answer ค. พระราชกำหนด, มาตรา 172, ก/ข/ง to the subordinate-law group, recap | 06_answer.mp3 | 220.97 | 56.69 |
| 8 | Promo and end card | 07_promotion.mp3 | 277.65 | 18.76 (+1.2 s hold) |

## Files

**Source**
- `source/index.html`: all scenes, timed to the measured narration.
- `source/hierarchy.js`: the reusable four-tier legal pyramid component (`HIER.build`).

**QC (`qc/`)**
- `QC_REPORT.md`, `legal_accuracy_check.md`, `beat_map.md`, `audio_durations.txt`.
- `safe_zone_report.json`, written by `qc_safezone.js`.
- `countdown_check.json`, written by `qc_countdown.js`.
- Preview PNGs.

## Shared engine

EP.32 reuses the following without modifying them: `engine.js`/`engine.css`, `props_legal.js` (scales), and `props_story.js` (character rigs A and F).

The one shared change is in `shared/tools/build_episode.sh`. It now reads an optional `"crf"` from `episode.json`. The default is still 17, so earlier episodes build exactly as before.
