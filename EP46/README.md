# NaiSibPro EP.46 — สัญลักษณ์ Flowchart: โจทย์ตรวจผลสอบ

Computer Studies · Blue Dominant · Classic 2D motion graphics · 1080 × 1920, 30 fps.

| Path | What it is |
|---|---|
| `audio/` | The seven original ElevenLabs narration files, byte-identical to the supplied archive (only the duplicated `.mp3.mp3` extension was dropped) |
| `episode.json` | Segment order, the 5 s countdown, output name, music settings (no master gain: this narration is already at series loudness) |
| `source/index.html` | Page, Blue Dominant theme (overrides the shared pastel defaults) |
| `source/beats.js` | Measured phrase starts for each recording |
| `source/decision_logic.js` | `score >= 60` rule, results and routes (also used by the validator) |
| `source/flowchart_spec.js` | Complete score-checking flowchart (nodes, edges, Yes/No labels) and the official quiz |
| `source/flowchart_symbols.js` | Six reusable symbols: terminator, process, I/O, decision, flowline, connector; ≥ and → glyphs |
| `source/flowchart_engine.js` | `FlowchartExecutionEngine`: chart, draw-on flowlines, travelling pulses, data token, evaluation bubble, result pop, camera; deterministic |
| `source/scenes.js` | The eight scenes |
| `tools/phrases.py` | Phrase-boundary measurement |
| `tools/validate_flowchart.js` | Static logic validation → `qc/flowchart_validation.json` |
| `tools/qc_browser.js` | Rendered-page QC → countdown, early reveal, safe zone, execution runs |
| `tools/stills.sh`, `tools/contact.py` | Stills and contact sheets |
| `qc/` | QC reports, first frame, contact sheet |
| `output/NaiSibPro_EP46_Flowchart_Symbols.mp4` | Final render |

## Build

```bash
shared/tools/build_episode.sh EP46
```

```bash
node EP46/tools/validate_flowchart.js
```

```bash
node EP46/tools/qc_browser.js
```

Intermediate files go to `EP46/renders/` (git-ignored).
