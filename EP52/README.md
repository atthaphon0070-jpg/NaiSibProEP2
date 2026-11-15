# NaiSibPro EP.52 — DID YOU GO OR DID YOU WENT?

**Did + V1** · Past Simple questions · เตรียมสอบนายสิบตำรวจ วิชาภาษาอังกฤษ

**Final video:** `output/NaiSibPro_EP52_Did_You_Go_or_Went.mp4` — 1080×1920 (9:16), 30 fps CFR, H.264 High yuv420p + AAC 48 kHz stereo.
Full QC: [`qc/QC_REPORT.md`](qc/QC_REPORT.md) · Handoff: [`EP52_HANDOFF.md`](EP52_HANDOFF.md)

## Rebuild
```bash
shared/tools/build_episode.sh EP52
```
Then re-run the QC:
```bash
node EP52/qc/tools/qc_page.js
python3 EP52/qc/tools/qc_text.py
python3 EP52/qc/tools/qc_media.py
```

## Layout
| Path | Contents |
|---|---|
| `audio/` | The seven original ElevenLabs recordings (byte-identical to the ZIP; only the doubled `.mp3.mp3` extension was fixed) |
| `episode.json` | Segment order, 5 s countdown, music bed, +3 dB master (uniform gain + −1 dBFS limiter on the whole mix) |
| `source/index.html` | Page: loads the shared engine + EP52 modules |
| `source/beats.js` | Narration beat map (measured phrase starts, local seconds per file) |
| `source/grammar_transformer.js` | `GrammarSentenceTransformer` + `DidVerbTransformation` (He went → Did he go, deterministic `draw(p)`) |
| `source/characters.js` | World panorama (home → road → police station, parallax camera), calendar flip, CTA icons |
| `source/infographic_cards.js` | Correct / incorrect / neutral sentence cards, chips, formulas |
| `source/quiz.js` | Official quiz, exact 150-frame countdown, answer reveal |
| `source/scenes.js` | All eight scenes timed to the narration |
| `qc/` | QC reports, first frame, contact sheet, QC tools |

The police officer is look `P`, added to the shared rig in `shared/engine/props_story.js`. The change only adds a new look, so earlier episodes render exactly as before.
