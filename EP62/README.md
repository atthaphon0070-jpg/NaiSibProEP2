# NaiSibPro EP.62 — คำสั่ง ระเบียบ ข้อบังคับ หรือประกาศ?

**Final video:** `output/NaiSibPro_EP62_Official_Document_Classification.mp4`. It is 1080×1920 (9:16), 30 fps constant, H.264 High yuv420p, AAC-LC 48 kHz stereo, and runs **195.66 s** (5,869 frames).

Rebuild it with:

```bash
shared/tools/build_episode.sh EP62
```

QC: `qc/QC_REPORT.md` (summary), `qc/qc_probe.js` (safe-zone + countdown + early-reveal probe), `qc/audio_qc.py` (audio + MP4 checks).

## Runtime vs the 180 s target
The seven supplied recordings total **189.05 s**. With the required 5 s silent countdown and a 1.6 s end hold, the video runs 195.66 s. The narration was not sped up, trimmed or re-voiced, so the 180 s target cannot be met with this audio.

## Timeline (audio-first, measured from the supplied narration)
| # | Scene | Audio | Start (s) | Length (s) |
|---|-------|-------|------:|------:|
| 1 | Hook: frame-0 title, officer with four documents, "หนังสือสั่งการ?" folder, ประกาศ hesitates, one-word swap = wrong | 01_hook.mp3 | 0.000 | 21.238 |
| 2 | Office: four documents arrive, read one by one, "หนังสือสั่งการทั้งหมดจริงหรือ?", two folders | 02_story.mp3 | 21.238 | 27.402 |
| 3 | Classification: blue หนังสือสั่งการ (3) + pink หนังสือประชาสัมพันธ์ (3), side-by-side infographic | 03_knowledge.mp3 | 48.640 | 26.671 |
| 4 | The ประกาศ trap: official-looking ≠ directive category; แถลงการณ์ and ข่าว join pink | 04_explanation.mp3 | 75.311 | 24.764 |
| 5 | Official quiz (four neutral one-line options, equal focus) | 05_quiz.mp3 | 100.075 | 32.914 |
| 6 | **Silent countdown 5→1** (frames 3990–4139, exactly 150) | — | 133.000 | 5.000 |
| 7 | Answer ง, infographic E, DocumentCategoryShuffle for ก/ข/ค, final comparison | 06_answer.mp3 | 138.000 | 33.071 |
| 8 | Promo: comments, "อ่านทุกคำ", logo, 10,000+ / weekly, LIKE · SHARE · FOLLOW | 07_promotion.mp3 | 171.071 | 22.988 (+1.6 s hold) |

Per-phrase timing is in `qc/beat_map.md` and `source/beats.js`.

## Source layout
| File | Contents |
|---|---|
| `source/index.html` | Page, EP62 palette (blue = หนังสือสั่งการ, pink = หนังสือประชาสัมพันธ์), component CSS |
| `source/beats.js` | Measured phrase starts per narration file |
| `source/characters.js` | Officer wrapper and pose presets for the shared rig (new look `G`), plus the government records-office set (wall, window, clock, shelves, cabinet, desk, monitor, tray) |
| `source/document_classifier.js` | `OfficialDocumentClassifier`: document cards, blue/pink folders, item fly-in and highlight |
| `source/answer_shuffle.js` | `DocumentCategoryShuffle`: one term swaps and takes its category colour (used in the hook warning, after the answer reveal, and in the promo) |
| `source/quiz.js` | Question, the four options, neutral focus, reveal and trap-word highlighting |
| `source/scenes.js` | The six scenes, SFX cues, `NSP.start` |

## Assets
- `audio/` holds the seven narration files from the ZIP. They are byte-identical; only the doubled `.mp3.mp3` extension was dropped. MD5s are in `qc/audio_durations.txt`.
- The shared logo, brand mascot (promo only) and Prompt fonts are used unchanged.
- The administrative officer is a new look (`G`) on the shared 2D rig in `shared/engine/props_story.js`: glasses, white shirt, pink lanyard ID. The change is additive, and earlier looks render exactly as before.
- All document art is fictional and generic: a round seal, no Garuda, no real agency names, signatures or order numbers.

## Audio
The narration is mixed at gain 1.0, unedited. It already measures about −16 LUFS, so no mastering gain was added. The music bed and SFX duck locally under loud speech. The final mix measures −14.2 LUFS with a −0.2 dBFS peak and 0 clipped samples.
