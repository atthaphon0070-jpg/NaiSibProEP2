# EP.45 handoff — THE MISSING STUDENT (Arithmetic Mean)

**นักเรียน 12 คน ค่าเฉลี่ย 70 → เหลือ 11 คน ค่าเฉลี่ย 68 — คนที่ออกไปได้กี่คะแนน?  เฉลย ค. 92 คะแนน**

## 1. Episode
- **Subject:** Mathematics, arithmetic mean.
- **Topic:** finding a missing individual score from two averages.
- **Method shown:** (12 × 70) − (11 × 68) = 840 − 748 = 92.
- **Format:** vertical 1080 × 1920, 30 fps, Blue Dominant 2D motion graphics.

## 2. Branch
`claude/elegant-lovelace-6lgarz` on `atthaphon0070-jpg/NaiSibProEP2`. Earlier episodes (EP02–EP05) are untouched.

## 3. Narration inventory
There are seven original ElevenLabs recordings in `audio/`. They arrived as `*.mp3.mp3` and were renamed to `*.mp3`; the bytes are unchanged, and SHA-256 hashes are in `qc/audio_durations.txt`. All are MP3, 44.1 kHz, mono, 128 kbps.

## 4. Measured durations
| file | seconds |
|---|---:|
| 01_hook | 25.156 |
| 02_story | 25.078 |
| 03_knowledge | 26.122 |
| 04_explanation | 29.466 |
| 05_quiz | 30.354 |
| 06_answer | 38.348 |
| 07_promotion | 19.958 |
| **narration total** | **194.482** |

## 5. Final runtime: 200.905 s (3:20.9). Over the 180 s maximum.
- Narration (194.5 s) plus the mandatory 5.0 s countdown already comes to 199.5 s. A 1.4 s end-card tail follows.
- As the brief requires, no narration was trimmed, sped up or removed. The overrun is reported here, not hidden.
- The only ways under 180 s are shorter recordings or dropping a segment, which is your decision.

## 6. Scene timeline (absolute seconds)
| # | Scene | Audio | Start | End |
|---|---|---|---:|---:|
| 01 | Missing-student mystery: cover at frame 0 → classroom → departure → 11 / 68 → silhouette + ? → warning card | 01 | 0.000 | 25.156 |
| 02 | Story: rewind → exam papers → teacher (mascot) + scoreboard 12 / 70 → departure → 11 / 68 → "higher than the old average" gauge | 02 | 25.156 | 50.234 |
| 03 | Mean: A = T ÷ N, animated into T = A × N; unequal bars poured into the total container; missing-score principle with proportional total bars; rule "หาคะแนนรวมก่อน แล้วค่อยลบ!" | 03 | 50.234 | 76.356 |
| 04 | Method, unevaluated: 12 × 70 = ?, 11 × 68 = ?, (12 × 70) − (11 × 68) = ? → "คุณคิดว่าได้กี่คะแนน?" | 04 | 76.356 | 105.822 |
| 05 | Official quiz: four lines, neutral 2 × 2 choices ก 88 / ข 90 / ค 92 / ง 96, recap, hint | 05 | 105.822 | 136.176 |
| 06 | Countdown: 150 frames (4086–4235), navy, no speech | — | 136.200 | 141.200 |
| 07 | Reveal: ค turns green with a check → 12 × 70 = 840 → 11 × 68 = 748 → 840 − 748 = 92 → the departing student returns with "= 92" → 748 + 92 = 840 ✓, 840 ÷ 12 = 70 ✓ → memory rule | 06 | 141.200 | 179.548 |
| 08 | Promotion: comments → "คุณใช้วิธีไหนคิด?" → mascot → logo / NaiSibPro / นายสิบโปร → poster + 10,000+ ข้อ + weekly updates → LIKE · SHARE · FOLLOW → end card | 07 | 179.548 | 200.905 |

Phrase-level cues for every scene are in `qc/beat_map.md`.

## 7. Brand assets reused
- `shared/brand/logo.png`: header, promo and end card, original colours.
- `mascot_presenter.png`: the teacher, plus scene 04.
- `mascot_pose.png`: scenes 03, 05 and 08.
- `poster.jpg`: shown whole in the promo.
- The Prompt fonts, plus the shared engine (`engine.css/js`: wipes, life easing, countdown, confetti, SFX registry) and tools (`audio_prep.py`, `audio_mix.py`, `render.js`, `build_episode.sh`).
- The pink parts of the engine (background, wipe bands, header pill) are overridden to blue inside EP45 only.
- The shared `promo.js` was not used: its beats are built for a different promo script. Scene 08 is written for this episode's narration.

## 8. Student characters (`source/student_group.js`)
- **Cast:** twelve original rigged SVG students, each with their own hairstyle, hair and skin colour, glasses and accent colour, in Thai-school white shirts with navy shorts or skirts.
- **Layout:** a 3 × 4 grid of desks with depth, inside a cyan "group" boundary.
- **Rig:** legs, arms, head tilt, face direction, blink and six mouth shapes; can sit, stand and walk.
- **Departing student (index 7):** the only pink character, wearing a pink hoodie with a star pin.
  - Stands, steps into the aisle, and walks in perspective to the back door. The count changes at the exact frame they cross the group boundary.
  - Becomes a silhouette with a pink rim when the camera focuses on them.
  - Walks back to their seat in the story's rewind, leaves again, and finally returns to the foreground in the reveal with the 92 badge.
- **Other figures:** the maths diagrams use round avatars of the same twelve looks. In the "11" grids, the departing student's slot is dashed.
- **No individual scores:** no student is ever shown with a score of their own.

## 9. Average-score dashboard (`source/average_dashboard.js`)
- A navy digital scoreboard with a cyan glow showing "นักเรียน [12] คน | คะแนนเฉลี่ย [70]", plus 12 person pips.
- Changing digits slide out while the new digit slides in, so 12 → 11 and 70 → 68 never show in-between values.
- The count changes when the student actually crosses the group boundary; the average changes afterwards, on "กลับลดเหลือ 68".
- On the drop, a red down-arrow appears, the average flashes a warning colour, a "เฉลี่ยลดลง 2 คะแนน" chip pops up, and the departing student's pip fades out.
- A scan sweep runs while the teacher is calculating.

## 10. Maths validation
13 / 13 checks pass (`qc/math_validation.json`). Numbers come only from `source/math_logic.js`.

## 11. Countdown validation
Pass. Exactly 150 frames with 30 per digit. The answer appears on frame 4236 = 141.200 s, which is also where the audio-06 file was found in the final AAC (`qc/countdown_validation.json`, `qc/frame_*.png`).

## 12. Blue Dominant implementation
- **Palette:** navy #142B53, electric blue #2F6BFF, cyan #22D3EE, light blue #95BFEF and ice #E6F4FF make up the classroom, cards, scoreboard and countdown.
- **Accents:** yellow for totals and key numbers, green for correct, red for warnings, pink only on the departing student and a few small accents.
- **Typed colours:** average is cyan, total is yellow and count is blue, consistently in every formula.

## 13. Mobile safe zone
Pass: 0 violations (`qc/safe_zone_report.json`). The 375 × 812, 390 × 844 and 430 × 932 crops all show the full safe zone.

## 14. Final MP4
`EP45/output/NaiSibPro_EP45_Missing_Student_Average.mp4`
- 46.2 MB, 200.905 s, 6 027 frames.
- Video: H.264 High, yuv420p, 30/1 fps.
- Audio: AAC 48 kHz stereo.

## 15. Re-render
```bash
shared/tools/build_episode.sh EP45
```
```bash
node EP45/tools/qc_scan.js EP45
```
```bash
python3 EP45/tools/verify_mp4.py EP45
```
```bash
node EP45/tools/beat_map.js
```

## 16. Known issues
1. **Runtime is 200.9 s, over the 180 s maximum.** This comes from the supplied narration (see §5).
2. **Minor cosmetic issues:**
   - During the first ~0.3 s of the countdown, the hint card is still fading out under the timer.
   - The navy "NaiSibPro" header text has low contrast on the navy countdown background.
3. **Beat timing method:** beats are tied to measured pauses and offline speech-recognition word IDs. Exact word boundaries inside long phrases are approximate (±0.2 s).
4. **Sound design:** classroom ambience is a very quiet synthetic room tone. All SFX and music are synthesised by `audio_mix.py`; no external sound libraries were used.
