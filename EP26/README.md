# NaiSibPro EP.26 — ส่งหนังสือราชการทางอีเมลแล้ว ต้องส่งกระดาษซ้ำไหม?

วิชางานสารบรรณ · Classic 2D motion graphics · 1080×1920 · 30 fps

**Final video:** `output/NaiSibPro_EP26_Electronic_Correspondence.mp4`

Rebuild (from the repo root):

```bash
shared/tools/build_episode.sh EP26
```

The build measures the narration (`audio_prep.py`), exports SFX cues from the page, mixes music + SFX under the untouched voice (`audio_mix.py`), applies a +2.5 dB master with a −1 dBFS peak limiter (`"master"` in `episode.json`), renders all frames in headless Chromium and encodes H.264 + AAC. Intermediate files go to `renders/` (git-ignored).

## Files
| Path | What |
|---|---|
| `audio/` | The seven supplied ElevenLabs recordings, byte-identical (the doubled `.mp3.mp3` extension was dropped) |
| `episode.json` | Segment order, the 5 s countdown, output name, music and master settings |
| `source/index.html` | All scenes and their phrase-timed beats (timing comments at the top of each scene) |
| `source/props_office.js` | EP.26 props: office set, monitor, fictional agency e-mail UI, sender↔recipient diagram, printer, icons |
| `qc/` | Audio manifest, contact sheets, first-frame check, validation report |
| `EP26_HANDOFF.md` | Production handoff report |

Shared additions (additive only): looks `K` and `H` in `shared/engine/props_story.js`, and a `printer` SFX in `shared/tools/audio_mix.py`.

See `EP26_HANDOFF.md` for timeline, legal framing and QC results.
