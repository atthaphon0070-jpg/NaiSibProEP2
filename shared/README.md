# NaiSibPro shared production system (EP.03 onward)

EP.02 (`project/`, `NaiSibPro_EP02_Excel_Shortcuts.mp4`) is left exactly as delivered. Everything here is a **copy** of its reusable parts.

| Path | What it is |
|---|---|
| `brand/` | Logo, mascot and promo poster (copied from EP.02) |
| `fonts/` | Prompt (Thai + Latin) woff2 files, offline |
| `engine/engine.css` | Brand palette, typography, cards, pills, quiz cards, wipe, confetti |
| `engine/engine.js` | Deterministic `renderAt(t)` engine: easing, `life()` entrances, background, brand header, wipes, quiz options, 5 s countdown, confetti, SFX cue registry |
| `engine/props_legal.js` | Legal props: justice scales, 3D law book (open + page flip), court, folder, document, house, people, banknote, question mark |
| `tools/audio_prep.py` | Audio-first timeline: measures each narration file, inserts a frame-aligned silent countdown, auto-detects phrase cues |
| `tools/audio_mix.py` | Synth music + UI SFX under the narration. Narration gain is fixed at 1.0; only the bed ducks |
| `tools/render.js` | Headless Chromium frame capture / stills / SFX export |
| `tools/build_episode.sh` | One-command build: `shared/tools/build_episode.sh EP03` (`--preview` allows a missing file as silence) |

## New episode checklist
1. `mkdir EPxx/{audio,source,output}` and copy the narration MP3s into `EPxx/audio/`.
2. Write `EPxx/episode.json`: list the segments in order, a `{"countdown": 5}` entry, the output filename and the music settings.
3. Write `EPxx/source/index.html`, loading `../../shared/engine/*`, defining scenes and calling `NSP.start(...)`.
4. Run `shared/tools/build_episode.sh EPxx`.
