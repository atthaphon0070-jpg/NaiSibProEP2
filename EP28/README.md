# NaiSibPro EP.28 — Network Topology

**คอมพิวเตอร์เชื่อมต่อกันกี่แบบ? รู้จัก Star, Bus, Ring, Mesh, Tree และ Hybrid**

Vertical 1080 × 1920, 30 fps, H.264 + AAC 48 kHz → `output/NaiSibPro_EP28_Network_Topology.mp4`.

## Build
```bash
shared/tools/build_episode.sh EP28
```
(from the repo root; `WORKERS=4` by default). Then QC:
```bash
node EP28/tools/qc_frames.js 0.1
```
```bash
node EP28/tools/qc_topology.js
```
```bash
EP28/tools/qc_video.sh
```

## Layout
| Path | What |
|---|---|
| `audio/` | The seven original ElevenLabs recordings from the ZIP (byte-identical; `.mp3.mp3` → `.mp3`) |
| `episode.json` | Segment order, the 5 s silent countdown, music (voice-keyed duck 6 dB), mastering |
| `source/index.html` | Page shell + EP28 CSS (Blue × Pink Fusion tokens) |
| `source/topology.js` | Topology kit: graph core (layouts, BFS paths, validators — also runs in Node) + SVG view (computer, switch, bus taps/terminators, cables, packets, failures, morphs) |
| `source/beats.js` | Measured beat map (file-local seconds) |
| `source/scenes/*.js` | `common` helpers + office set, `s1_hook`, `s2_story`, `s3_know`, `s4_expl`, `s5_quiz` (quiz + countdown + reveal), `s7_answer`, `s8_promo`, `main` |
| `tools/` | `qc_frames.js` (safe zone, labels, packets, countdown), `qc_topology.js` (graph validation), `qc_video.sh` + `phone_sim.py` (MP4 checks, phone views), `qc_docs.js` |
| `qc/` | Reports, frame 0, contact sheet, countdown strip, phone simulations, transcript chunks |

The network diagrams are data: every computer/switch is a node with a stable id and every cable is a link of a
validated graph. A packet is drawn only along links that are fully drawn and unbroken in the current frame.
