# NaiSibPro EP.36 — อสังหาริมทรัพย์ · สังหาริมทรัพย์ · สังหาริมทรัพย์ชนิดพิเศษ (ป.พ.พ. ม.456 วรรคหนึ่ง)

**Final video:** `output/NaiSibPro_EP36_Property_Law_M456.mp4` (1080×1920, 9:16, 30 fps, H.264 High + AAC 48 kHz stereo).

> ⚠ **Runtime blocker:** the seven supplied narration files add up to **281.025 s** on their own. With the mandatory 5 s countdown and a 1.2 s end card, the episode runs **287.24 s (4:47)**. The 240 s limit cannot be met without editing or re-recording the voice. The narration was left untouched, as the brief requires. See `EP36_HANDOFF.md`.

Rebuild with `shared/tools/build_episode.sh EP36`, then re-run QC with `node EP36/qc/qc_check.js`.

## Files
| Path | Purpose |
|---|---|
| `audio/` | The seven narration MP3s from the ZIP, byte-identical (the doubled `.mp3.mp3` extension was dropped) |
| `episode.json` | Segment order, the 5 s countdown, music, and the +3 dB master gain with a −1 dBFS limiter |
| `source/index.html` | All scenes (hook, story, property types, registration trap, quiz + countdown + answer, promo) |
| `source/beats.js` | Phrase-start beat map measured from the audio |
| `source/legal_categories.js` | Single source of legal labels (ม.139 / ม.140 / ม.456 ว.1, anchors) |
| `source/quiz_logic.js` | Question, choices and answer key, self-validated against the legal data |
| `source/props_property.js` | Original SVG props: house + land, car, ship, motorcycle, phone, table, chair, raft, buffalo, stamp, office, contract |
| `qc/` | Durations, beat map, legal check, safe-zone report, preview stills, QC report |

The page also reuses the shared engine: `engine.js/css`, the countdown and quiz components, wipes, confetti, `props_legal.js` (person icons) and `props_story.js` (buyer rig). It reuses the brand logo, mascots, poster and fonts from `shared/brand`.
