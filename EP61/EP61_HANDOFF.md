# EP.61 handoff

**Deliverable:** `EP61/output/NaiSibPro_EP61_Internal_vs_External_Documents.mp4` (1080×1920, 30 fps, H.264 High yuv420p, AAC 48 kHz stereo, 193.63 s video / 193.66 s audio, −14.2 LUFS).

## What is in the box
- Seven original ElevenLabs recordings, byte-identical to the ZIP, played unedited and in order. A silent countdown of exactly 150 frames sits between 05 and 06.
- Classic 2D build on the shared NaiSibPro engine (`shared/engine`), with the approved logo, poster and mascot from `shared/brand`.
- New reusable components:
  - `InternalMemoDocument` and `ExternalOfficialLetter` (`source/document_templates.js`)
  - `OfficialDocumentSorter` folders (`source/office.js`)
  - `TrickyChoiceComparison` cards (`choiceCard` in `source/index.html`)
  - The cartoon document officer (shared rig, look `G`)
- QC files are in `qc/`, starting with `QC_REPORT.md`.

## Things a human should still look at
1. **Runtime 193.7 s, over the 180 s target.** The narration alone is 186.8 s, so the target can't be met without breaking the audio rules. Decide whether that is acceptable for each platform; all three accept videos of this length.
2. **Regulation text.** The ข้อ 11 / ข้อ 12 wording follows the well-known text of ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526. The official PDFs could not be opened from the build sandbox because of network policy, so do a quick check against an official copy. No clause numbers or emblem sizes are shown on screen.
3. **Garuda artwork.** This is a simplified, stylised illustration, not the official emblem artwork. If you prefer the official artwork file, swap `garuda()` in `document_templates.js`; it is used on every paper.
4. **Narration wording.** The 06 cue "ข้อ ขอ ไข่" triggers the reveal at 145.55 s. Beat times came from pause detection plus a local Whisper timing pass (`qc/asr_phrase_timing_raw.txt`). They were checked visually but not by ear.

## Rebuild
```bash
shared/tools/build_episode.sh EP61
```
The build takes about 20 minutes on 4 cores. Intermediate files go to `EP61/renders/` (git-ignored).
