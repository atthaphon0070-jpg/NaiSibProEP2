# NaiSibPro EP.51 — The police IS or ARE?

ข้อสอบภาษาอังกฤษง่าย ๆ ที่หลายคนตอบผิด (เตรียมสอบนายสิบตำรวจ · วิชาภาษาอังกฤษ)

| | |
|---|---|
| Topic | Subject–verb agreement: **A police officer → is** · **The police → are** |
| Official question | The police _____ looking for the suspect. (ก. is · ข. are · ค. am · ง. be) |
| Answer | **ข. are** → The police are looking for the suspect. |
| Style | Classic 2D motion graphics, pink + blue 50:50, original cartoon Thai police officers |
| Output | `output/NaiSibPro_EP51_The_Police_IS_or_ARE.mp4` (1080 × 1920, 30 fps CFR, H.264 yuv420p + AAC) |
| Narration | 7 supplied ElevenLabs MP3s in `audio/`, byte-identical to the zip (md5 in `qc/audio_durations.txt`) |

## Layout

```
EP51/
├── audio/            01_hook … 07_promotion (unchanged originals, renamed from *.mp3.mp3)
├── source/
│   ├── index.html            page + EP51 pink/blue theme
│   ├── beats.js              measured phrase starts for every narration file
│   ├── characters.js         police officer rig (looks A–D) + student, station set, search board, icons
│   ├── grammar_comparison.js kinetic sentences, comparison panels, GrammarComparisonAnimation
│   ├── quiz.js               exact question, 2 × 2 choices, dual pink/blue countdown (150 frames)
│   └── scenes.js             the 8 parts of the episode, all keyed to beats.js
├── tools/qc_page.js   safe-zone scan + on-screen text log (every 0.5 s)
├── tools/qc_media.py  final-file checks, countdown, grammar validation, contact sheet
├── qc/                reports (see QC_REPORT.md)
├── episode.json
└── EP51_HANDOFF.md
```

## Build

```bash
shared/tools/build_episode.sh EP51
```

```bash
node EP51/tools/qc_page.js EP51 EP51/qc/onscreen_text.json
```

```bash
python3 EP51/tools/qc_media.py EP51
```

Frames and the mix are written to `EP51/renders/` (git-ignored).
