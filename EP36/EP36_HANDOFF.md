# EP.36 handoff

## 1. Episode title
**NaiSibPro EP.36 — อสังหาริมทรัพย์ vs สังหาริมทรัพย์ vs สังหาริมทรัพย์ชนิดพิเศษ**
The trap it teaches: a car has a registration, but its sale does not need the written, registered form that ป.พ.พ. ม.456 วรรคหนึ่ง requires for some ships.

## 2. Audio files (from the user's ZIP, byte-identical; the doubled `.mp3.mp3` extension was dropped)
`EP36/audio/01_hook.mp3`, `02_story.mp3`, `03_knowledge.mp3`, `04_explanation.mp3`, `05_quiz.mp3`, `06_answer.mp3`, `07_promotion.mp3`

## 3. Measured durations
| File | s |
|---|---:|
| 01_hook | 29.649 |
| 02_story | 39.811 |
| 03_knowledge | 49.084 |
| 04_explanation | 44.278 |
| 05_quiz | 38.531 |
| 06_answer | 55.484 |
| 07_promotion | 24.189 |
| **Narration total** | **281.025** |

Details and checksums are in `qc/audio_durations.txt`; scene-by-scene timing is in `qc/beat_map.md`.

## 4. Final runtime
**287.24 s (4:47).** That is narration 281.025 s, plus the 5.000 s countdown, plus a 0.015 s frame-alignment pad and a 1.2 s end card.

⚠ **This exceeds the 240 s maximum and is reported as a blocker, not as compliant.** The voice tracks alone are 41 s over the limit. Nothing was sped up or cut. Getting under 240 s needs about 47 s less narration; see `qc/QC_REPORT.md` for the options.

## 5. Quiz answer verification
Correct answer: **ค. เรือมีระวางตั้งแต่ 5 ตันขึ้นไป**. `source/quiz_logic.js` checks at load time that it is the only keyed option and the only choice in the s.456 para 1 list. In the video, ค turns green at 207.43 s, when the narration says "ข้อ ค", after the countdown has ended.

## 6. Legal logic summary
- House and land are immovable property (ม.139).
- Cars, motorcycles, phones and furniture are movable property (ม.140).
- Sales of immovable property, ships of 5 tons and over, rafts and beasts of burden must be in writing and registered with the competent official, or they are void (ม.456 วรรคหนึ่ง).
- A car's transfer notification to the registrar under the motor-vehicle law is a separate matter and is not the s.456 rule.

All 7 checks pass; see `qc/legal_logic_check.md`.

## 7. Safe-zone validation
Zone: x 220–860, y 350–1430. 2,873 sampled frames, covering all critical elements and transitions: **0 violations**, no clipped text. See `qc/safe_zone_report.json`. Critical content sits in a 620 px column (x 230–850) so the scene zoom stays inside the zone, and pop-in overshoot is capped at 100% for critical elements.

## 8. Countdown verification
Exactly 150 frames, 5.000 s, from 201.367 s (frame 6041) to frame 6190. Each number shows for exactly 30 frames at full opacity. This was checked in the page's DOM and again on frames decoded from the final MP4. The countdown has no narration (ticks only), the question and choices stay visible, and the answer stays hidden.

## 9. Reused components
- **Shared engine:** `engine.js`/`engine.css` (deterministic `renderAt`, `life()` easing, background, brand badge, wipes, quiz option cards, countdown dial, confetti, SFX registry).
- **Legal and story props:** `props_legal.js` (person icons) and `props_story.js` (character rig A as the buyer).
- **Brand:** `shared/brand` (logo, both mascot cut-outs, poster) and `shared/fonts` (Prompt Thai/Latin).
- **Tools:** `shared/tools/audio_prep.py`, `audio_mix.py`, `render.js` and `build_episode.sh`.
- **New for EP.36:** `source/props_property.js` (house + land, car, ship, motorcycle, phone, table, chair, raft, buffalo, stamp, office, contract), plus a custom promo scene. The shared `promo.js` follows a different promo script (packages and links), so it did not fit this narration.

No earlier episode was modified.

## 10. Final MP4
`EP36/output/NaiSibPro_EP36_Property_Law_M456.mp4`: 1080×1920, 30 fps, H.264 High + AAC 48 kHz, −12.6 LUFS.

## 11. Re-render
```bash
shared/tools/build_episode.sh EP36
```
```bash
node EP36/qc/qc_check.js
```

## 12. Known issues
1. **The runtime of 4:47 is over the 4:00 limit.** This comes from the supplied audio and is a blocker.
2. The beat timing is based on pause detection and partial speech recognition. A few beats inside long phrases are interpolated, so check the sync on a phone.
3. The video stream ends 1 frame before the audio, because of the shared script's `-shortest`. The difference falls on the static end card.
4. The countdown frames 6041–6192 were re-rendered after a fix: the dial previously faded in on its first frame. The video was then re-encoded from the full frame set with the shared script's exact ffmpeg settings. A fresh `build_episode.sh EP36` run reproduces the same result.
