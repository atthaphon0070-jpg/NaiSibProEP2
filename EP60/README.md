# NaiSibPro EP.60 — CPU vs GPU ต่างกันอย่างไร? (วิชาคอมพิวเตอร์)

**Final video:** `output/NaiSibPro_EP60_CPU_vs_GPU.mp4`. It is 1080×1920 (9:16), 30 fps, H.264 High + AAC 48 kHz stereo, runs 206.6 s, and measures -14.0 LUFS.

QC: `qc/QC_REPORT.md` (all checks pass). Rebuild with `shared/tools/build_episode.sh EP60`.

| # | Scene | Audio | Start (s) | Length (s) |
|---|---|---|---:|---:|
| 1 | Hook: frame-0 title + CPU/GPU split, motherboard "?", curiosity cards | 01_hook.mp3 | 0.00 | 22.05 |
| 2 | Story: desktop jobs → CPU, 3D frame floods CPU, GPU joins, core question | 02_story.mp3 | 22.05 | 26.51 |
| 3 | Knowledge: CPU / GPU definitions, roles, examples, split recap | 03_knowledge.mp3 | 48.56 | 30.43 |
| 4 | Explanation: หัวหน้าทีม vs ทีมงานจำนวนมาก, pixel race, caution, work-type matrix | 04_explanation.mp3 | 78.99 | 29.00 |
| 5 | Official quiz (4 options, neutral) | 05_quiz.mp3 | 107.99 | 34.59 |
| 6 | **Silent countdown 5→1, exactly 150 frames** | — | 142.60 | 5.00 |
| 7 | Answer ข. + why, wrong-option corrections, memory card | 06_answer.mp3 | 147.60 | 32.13 |
| 8 | Promo: comment ask, recap, brand, หมื่นข้อ / ทุกสัปดาห์, like · share · follow, end card | 07_promotion.mp3 | 179.73 | 25.08 (+1.8 s hold) |

- `audio/` holds the seven narration files from the ZIP. They are byte-identical; only the doubled `.mp3.mp3` extension was dropped.
- `source/index.html` is the episode page on the shared engine, and `source/props_tech.js` is the EP.60 prop kit (CPU chip character, GPU card, core grid, task icons, low-poly mesh).
- `qc/` holds the reports plus `qc/tools/` (safe-zone audit, quiz/countdown guard, media QC).
- `renders/` holds the frames and intermediate audio. It is git-ignored and rebuilt by the build script.
