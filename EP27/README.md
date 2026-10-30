# NaiSibPro EP.27 — จดหมาย 500 ฉบับ ไม่ต้องพิมพ์ชื่อทีละคน! (Mail Merge / จดหมายเวียน)

วิชาคอมพิวเตอร์ · Microsoft Word · Classic 2D motion graphics · Blue × Pink Fusion · 1080×1920 · 30 fps

**Final video:** `output/NaiSibPro_EP27_Mail_Merge.mp4`

Rebuild (from the repo root):

```bash
shared/tools/build_episode.sh EP27
```

QC (after a build):

```bash
EP27/tools/qc_safe.sh
```

```bash
node EP27/tools/qc_dom.js > EP27/qc/dom_checks.txt
```

```bash
python3 EP27/tools/mobile_preview.py EP27/output/NaiSibPro_EP27_Mail_Merge.mp4
```

## Files
| Path | What |
|---|---|
| `audio/` | The seven supplied ElevenLabs recordings, byte-identical (the doubled `.mp3.mp3` extension was dropped) |
| `episode.json` | Segment order, 0.35 s scene gaps, the 5 s countdown, output name, music and master settings |
| `source/beats.js` | Every spoken-phrase time used by the animation (seconds from the start of each file) |
| `source/index.html` | All eight scenes; critical text carries the class `sz` (checked against the safe zone) |
| `source/mm_props.js` | Reusable Mail Merge kit: Word window with the Mailings ribbon + dropdowns + main document, Excel-style recipient table, letter with merge fields, paper stack, animated connector, night/day office set |
| `tools/segment.py`, `tools/syllables.py` | Pause map / syllable onsets (from EP.20) |
| `tools/qc_safe.js`, `tools/qc_safe.sh` | Per-frame safe-zone check plus 24 phone/platform overlay simulations → `qc/safe_zone_report.json` |
| `tools/qc_dom.js` | First frame, exact quiz text, countdown frames, no early hint → `qc/dom_checks.txt` |
| `tools/mobile_preview.py` | Phone-screen previews made from the MP4 → `qc/mobile_preview_*.png` |
| `tools/qc_docs.py` | `qc/audio_durations.txt`, `qc/beat_map.md` |
| `qc/` | QC report, contact sheet, first frame, countdown strip, mobile previews |
| `EP27_HANDOFF.md` | Production handoff |

Shared additions (additive, backward compatible): EP.26's looks `K`/`H` and `printer` SFX, and EP.20's `"silence"` segment in `audio_prep.py`, brought onto this branch so EP.27 builds from it. No earlier episode was modified.
