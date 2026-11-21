# EP62 handoff

**Deliverable:** `EP62/output/NaiSibPro_EP62_Official_Document_Classification.mp4`. It is 1080×1920, 30 fps, H.264/AAC, 195.66 s.

**Lesson:** หนังสือสั่งการ = คำสั่ง / ระเบียบ / ข้อบังคับ (blue). หนังสือประชาสัมพันธ์ = ประกาศ / แถลงการณ์ / ข่าว (pink).

**Quiz:** ข้อใดเป็นหนังสือสั่งการครบทั้ง 3 ชนิด ตามระเบียบงานสารบรรณ? The answer, **ง. คำสั่ง – ระเบียบ – ข้อบังคับ**, appears only when audio 06 starts.

## Decisions for the producer
1. **Length:** 195.66 s, over the 180 s target, because the seven recordings alone are 189.05 s. To get under 180 s, the narration itself has to be shorter, for example by re-generating 05_quiz (32.9 s) or 06_answer (33.1 s) with tighter lines. Then drop the new MP3s into `EP62/audio/`, update `source/beats.js` and rebuild.
2. **Regulation check:** the government page could not be opened from the render container. Please confirm ข้อ 15 / ข้อ 19 at https://laws.md.go.th/laws-implement/home/detail/111/?sID=111.

## Files
- `README.md`: timeline, source map, assets.
- `qc/QC_REPORT.md`: all checks with measured results.
- `qc/first_frame.png`, `qc/contact_sheet.png`: frames extracted from the MP4.
- `qc/audio_durations.txt`, `qc/audio_validation.json`, `qc/beat_map.md`, `qc/countdown_validation.json`, `qc/safe_zone_report.json`, `qc/regulation_validation.json`.
- `source/`: page and the components `OfficialDocumentClassifier` (document_classifier.js), `DocumentCategoryShuffle` (answer_shuffle.js), quiz.js, characters.js (officer + office) and scenes.js.

## Rebuild
```bash
shared/tools/build_episode.sh EP62
```
The build takes about 5–6 minutes on 4 cores.
