# NaiSibPro EP.39 — อนุกรมตัวเลขสลับ 2 ชุด (The Hidden Interleaved Number Sequence)

Vertical 1080 × 1920, 30 fps, H.264 / yuv420p / AAC. Blue-dominant 2D motion graphics built on the shared
NaiSibPro engine (`shared/`), driven by the seven original ElevenLabs narration files.

**Final video:** `output/NaiSibPro_EP39_Interleaved_Number_Sequence.mp4`
**Handoff / QC:** `EP39_HANDOFF.md`, `qc/QC_REPORT.md`

## Build

```bash
shared/tools/build_episode.sh EP39
```

Run from the repository root. Steps: `audio_prep.py` measures the narration and inserts the frame-aligned 5 s
countdown → page exports SFX cues → `audio_mix.py` (music + SFX, narration gain fixed at 1.0) → 4 parallel
Chromium frame workers → ffmpeg encode. About 35–45 min on 4 cores. `WORKERS=n` changes parallelism.

## QC tools (run from the repository root after a build)

```bash
node EP39/tools/validate_math.js
```

```bash
node EP39/tools/qc_safezone.js 0.25
```

```bash
node EP39/tools/qc_timing.js
```

```bash
EP39/tools/verify_output.sh
```

## Layout

| Path | Purpose |
|---|---|
| `audio/` | the seven original MP3s, byte-identical to the upload (md5 in `qc/audio_durations.txt`) |
| `episode.json` | segment order, countdown, music, mastering |
| `source/index.html` | page + the episode's blue theme (overrides the shared pastel defaults for EP.39 only) |
| `source/sequence_math.js` | single source of truth for every number on screen (also used by the validator) |
| `source/sequence_engine.js` | number cards with identity, index badges, state layers, trails, difference arcs |
| `source/beats.js` | measured phrase starts for each narration file |
| `source/scenes.js` | all scenes, SFX cues |
| `tools/` | math validator, safe-zone QC, countdown/spoiler QC, output verification, phrase scanner |
| `qc/` | reports and stills |
| `renders/` | build scratch (frames, mix) — git-ignored |
