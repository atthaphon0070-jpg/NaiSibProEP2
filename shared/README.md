# NaiSibPro shared production system (EP.03 onward)

EP.02 (`project/`, `NaiSibPro_EP02_Excel_Shortcuts.mp4`) is left exactly as delivered. Everything here is a **copy** of its reusable parts.

| Path | What it is |
|---|---|
| `brand/` | Logo, mascot and promo poster (copied from EP.02); `mascot_presenter.png` / `mascot_pose.png` are transparent cut-outs of the supplied mascot art (EP.05+) |
| `fonts/` | Prompt (Thai + Latin) woff2 files, offline |
| `engine/engine.css` | Brand palette, typography, cards, pills, quiz cards, wipe, confetti |
| `engine/engine.js` | Deterministic `renderAt(t)` engine: easing, `life()` entrances, background, brand header, wipes, quiz options, 5 s countdown, confetti, SFX cue registry |
| `engine/props_legal.js` | Legal props: justice scales, 3D law book (open + page flip), court, folder, document, house, people, banknote, question mark |
| `engine/props_story.js` | 2.5D story kit (EP.04): jointed character rig (walk, squat, lean, arms, head turn, blink, 7 expressions, hold/pocket wallet, hand kinematics), characters A/B/C, wallet prop with stylized notes, layered Thai street set with parallax camera + depth of field, café set, thought bubbles |
| `engine/props_story.js` (EP.05 additions) | Looks F (woman, sender) and R (man, receiver), long hair layer, lashes, skirt, phone held in the hand (`pose({phone:1, phoneGlow, phoneTilt})`), `grin` expression. Older looks render as before. EP.26 adds looks K (correspondence officer) and H (supervisor) |
| `engine/props_sets.js` | Interior sets with the street's parallax camera (EP.05+): `SETS.cafe()` (daytime café, table + chair) and `SETS.room()` (evening apartment, sofa + coffee table); actors sit between the back furniture and `front` |
| `engine/props_phone.js` | Large glossy smartphone for screen-space close-ups (EP.05+), 500 × 1060 design-size screen, generic fictional banking UI helpers |
| `engine/promo.js` | Shared promotional ending (EP.04+): 8 beats timed to the promo narration's measured phrase starts, approved poster shown whole, end card. Optional `pickAt` / `endAt` (EP.05) when the package pick or end card must follow the voice |
| `tools/audio_prep.py` | Audio-first timeline: measures each narration file, inserts a frame-aligned silent countdown, auto-detects phrase cues. `{"silence": s}` segments (EP.20+) add a plain gap between files |
| `tools/audio_mix.py` | Synth music + UI SFX under the narration. Narration gain is fixed at 1.0; only the bed ducks. EP.05 adds `notify`, `buzz`, `msg`, `cash`; EP.26 adds `printer` |
| `tools/render.js` | Headless Chromium frame capture / stills / SFX export |
| `tools/build_episode.sh` | One-command build: `shared/tools/build_episode.sh EP03` (`--preview` allows a missing file as silence) |

## New episode checklist
1. `mkdir EPxx/{audio,source,output}` and copy the narration MP3s into `EPxx/audio/`.
2. Write `EPxx/episode.json`: list the segments in order, a `{"countdown": 5}` entry, the output filename, an optional `build_dir` (default `build`) and the music settings.
3. Write `EPxx/source/index.html`, loading `../../shared/engine/*`, defining scenes and calling `NSP.start(...)`.
4. Run `shared/tools/build_episode.sh EPxx`.
