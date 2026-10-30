# NaiSibPro EP.25 — เอกสารราชการเก็บกี่ปี ถึงจะทำลายได้? (วิชางานสารบรรณ)

**Final video:** `output/NaiSibPro_EP25_Document_Retention.mp4`. It is 1080×1920 (9:16), 30 fps, H.264 High + AAC 48 kHz stereo, 227.4 s, −15.1 LUFS with a true peak of −0.7 dBFS (`"master"` in `episode.json`: 0 dB gain, −1 dBFS limiter only).

Rebuild it with `shared/tools/build_episode.sh EP25`.

## Timeline (audio-first, measured from the supplied narration)
| # | Scene | Audio | Start (s) | Length (s) |
|---|-------|-------|------:|------:|
| 1 | Hook: folder approaches the shredder, years flip to 10, **STOP**, "ครบ 10 ปี = ทำลายได้เลย?", 10 / 5 / 1 / ตลอดไป teaser, locked shredder | 01_hook.mp3 | 0.000 | 24.111 |
| 2 | Archive room: parallax pan, officer pulls four kinds of folders, "ครบ 10 ปี" stamp, walks to the shredder, freeze, "ตอบข้อสอบผิด!", long / short / forever bars | 02_story.mp3 | 24.111 | 34.116 |
| 3 | Four retention categories: ทุกเอกสาร = 10 ปี? ✗ → โดยปกติ → 10 ปี / 5 ปี / 1 ปี / ตลอดไป, each docking into a comparison table → "เจอ โดยปกติ → นึกถึง 10 ปี" | 03_common_mistake.mp3 | 58.227 | 42.762 |
| 4 | Retention ≠ destruction: stamp, second shredder stop, 4-step procedure, ≠ comparison, exam tips | 04_explanation.mp3 | 100.989 | 39.001 |
| 5 | Quiz (question highlighted line by line; options appear as spoken) | 05_quiz.mp3 | 139.990 | 19.487 |
| 6 | **Silent countdown 5→1** (exactly 150 frames, 4785–4934; no narration) | — | 159.500 | 5.000 |
| 7 | Answer: ง. 10 ปี revealed on "ข้อ ง.", ข้อ 57 card, exceptions table, then the final memory hook (shredder stops, ≠, โดยปกติ = 10 ปี, options eliminated) | 06_answer.mp3 | 164.500 | 48.666 |
| 8 | Promotion + follow end card | 07_promotion.mp3 | 213.166 | 12.434 (+1.8 s end-card hold) |

The narration is mixed unedited, in the supplied order, with no speed change, trimming or re-voicing. The 22 ms before the countdown is the frame-alignment pad that `audio_prep.py` inserts. `audio/manifest.json` lists every file's checksum, measured duration and the phrase cues the animation is timed to.

## Source
- `source/index.html` — the episode timeline (7 scene functions + paper-sheet transition), built on `shared/engine/engine.js` (`renderAt(t)`, `life()`, quiz options, countdown ring, confetti, brand header, logo wipe) and `shared/engine/props_story.js` (character rig "B" as the archive officer, thought bubble).
- `source/archive.js` — new EP.25 props, all original code-drawn SVG/HTML: folder with opening cover and sticker label, document sheet, desk shredder (feed slot, strip animation, run/freeze states), flip calendar ("ปีที่ n"), archive shelving, desk, door, stamp, STOP sign, process icons.
- Shared change: `shared/tools/audio_mix.py` gained three SFX (`shred`, `alarm`, `drawer`). Nothing existing was altered, so older episodes rebuild identically.

## Legal content (ระเบียบสำนักนายกรัฐมนตรีว่าด้วยงานสารบรรณ พ.ศ. 2526 และที่แก้ไขเพิ่มเติม)
- ข้อ 57: โดยปกติให้เก็บไว้ไม่น้อยกว่า 10 ปี; completed duplicate copies whose original can be found elsewhere ≥ 5 ปี; completed routine, unimportant, recurring matters ≥ 1 ปี; historical / statistical / evidentiary / research records เก็บไว้ตลอดไป หรือตามที่สำนักหอจดหมายเหตุแห่งชาติกำหนด. An on-screen footnote notes that classified material and case files follow their own laws/regulations.
- ข้อ 66 onward, simplified: survey within 60 days after the calendar year ends → destruction-request list → submit to the department-level head → committee appointed, then the rest of the regulation's steps. The video never shows reaching the retention period as permission to destroy.
- Quiz answer: **ง. 10 ปี**.
