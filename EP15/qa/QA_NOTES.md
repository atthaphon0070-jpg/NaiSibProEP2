# EP.15 — ถูกต่อยก่อน แต่ทำไมถึงกลายเป็นคนผิด? (ป้องกันตัว · มาตรา 68) — QA notes

**Final file:** `EP15/output/NAISIBPRO_EP15_SELF_DEFENSE_CRIME_STORY_FINAL.mp4`

| Property | Value |
|---|---|
| Video | 1080×1920 (9:16), 30 fps, H.264 High crf 17 |
| Audio | AAC 192k, stereo, 48 kHz |
| Duration | 239.97 s (7,199 frames) |
| Size | 81 MB |

## Narration: only the 7 supplied ElevenLabs files

Each file is located in the final mix by cross-correlation with its source MP3:

| Segment | File | Length (s) | Start (s) | Offset (ms) | Correlation* |
|---|---|---|---|---|---|
| hook | 01_hook.mp3 | 22.909 | 0.000 | 0 | 0.930 |
| story | 02_story.mp3 | 27.089 | 22.909 | 0 | 0.972 |
| conflict | 03_conflict.mp3 | 29.388 | 49.998 | 0 | 0.950 |
| clue | 04_legal_clue.mp3 | 31.242 | 79.386 | 0 | 0.989 |
| quiz | 05_quiz.mp3 | 33.724 | 110.629 | 0 | 0.993 |
| countdown | (silent, 5.000 s) | 5.000 | 144.367 | — | — |
| answer | 06_answer.mp3 | 58.358 | 149.367 | 0 | 0.977 |
| promo | 07_promotion.mp3 | 29.649 | 207.724 | 0 | 0.984 |

\*Correlation is below 1.0 only because the score, ambience, SFX and the mastering limiter sit on top of the voice.

- The narration is never trimmed, re-voiced, sped up or overlapped. Its gain in the mix is 1.0.
- No other voices exist anywhere. The characters never lip-sync, and every sound in `EP15/tools/score.py` is synthesized from tones and filtered noise, so there is no speech and no third-party music.
- Mastering applies one uniform +6 dB gain followed by a lookahead limiter at 0.84 (`latency=1`). The files were delivered at about −21 to −24 LUFS. The final file measures −14.3 LUFS integrated, LRA 4.0 LU, true peak −0.8 dBFS.

## Countdown (5 s = 150 frames)

The countdown occupies frames 4331–4480 (144.367–149.367 s). Narration amplitude in that window is exactly 0.0; only the ticks play.

Checked on the encoded MP4:

| Frame | Content |
|---|---|
| 4330 | no timer |
| 4331 | "5" |
| 4480 | "1" |
| 4481 | first answer frame: the ค highlight begins and the timer is gone |

`qa/spoiler_check.js` sampled every frame of the quiz and countdown, and every 0.1 s before that. It found 0 violations:

- no ค highlight or border before frame 4481;
- outside the choice cards, none of these appear: อาจเป็นการป้องกันโดยชอบ, ภัยสิ้นสุดแล้ว, เอาคืน, อาจมีความผิด, เฉลย, ไม่มีภยันตราย, ภัยยังมีอยู่;
- the ≠ key graphic does not appear.

## Safe Zone V2 (x 190–870, y 300–1430)

`qa/safezone_audit.js` samples every 0.25 s and measures every visible overlay text run, plus the countdown, logo and mascot. Result: 0 violations.

- The street world (store sign, Soi 9 sign) is background and is not checked.
- The tracking markers that follow the characters clamp their labels inside the zone; only the tracking ring may follow the action outside it.

## Story facts vs. the legal explanation (verified from the rendered frames)

1. **Tae throws the first punch** (story time τ 12.55). During the argument, Nont's hands stay near his own chest and never touch Tae.
2. **Tae keeps advancing with his fists up**, so the threat is still ongoing.
3. **Nont pushes once**, briefly, with both hands (Event A, τ 14.3). Tae is pushed back and regains his balance.
4. **Tae stops attacking:** hands down, a fearful expression, a step back.
5. **Tae turns and runs right** along the same sidewalk, then stops to catch his breath with his back turned. He makes no new threat, and no weapon appears at any point.
6. **Nont's anger builds** in close-ups, and he decides to chase.
7. **Nont follows the same route** and punches Tae (Event B, τ 45.2), near lamp 3. Tae turns toward the footsteps, startled, with his hands low; he does not attack.
8. **Tae is hurt but not shown graphically:** he folds and kneels holding his face. There is no blood and no injury close-up.

On continuity:

- All shots, the cold-open flashforward, the rewind, the evidence freezes and the split-screen replays sample one choreography (`actorState(τ)`). Positions, wardrobe and lighting therefore cannot change between shots.
- The two characters keep fixed designs throughout; see `qa/ref/character_sheet_*.jpg`.
- The geography and blocking are documented in `qa/location_map.md`.

## Legal wording on screen

- **Event A:** "ป้องกันโดยชอบด้วยกฎหมาย?" with the four elements of มาตรา 68, paraphrased from the statute:
  1. มีภยันตรายจากการประทุษร้ายอันละเมิดต่อกฎหมาย
  2. เป็นภยันตรายที่ใกล้จะถึง
  3. จำต้องกระทำเพื่อป้องกันสิทธิ
  4. กระทำพอสมควรแก่เหตุ

  Conclusion shown: "ผลัก = **อาจ**เป็นการป้องกันโดยชอบ".
- **Event B:** "ภัยสิ้นสุดแล้ว", "ไม่มีภยันตรายที่ใกล้จะถึงแล้ว", "**อาจ**มีความผิดฐานทำร้ายร่างกาย" and "ต้องพิจารณาข้อเท็จจริงประกอบ".
- Never stated: no specific section for the punch (no มาตรา 295), no injury severity, and no claim about มาตรา 69 or 72.
- **Key message:** "การป้องกันตัว ≠ การเอาคืน" (the ≠ is drawn as an SVG) and "การป้องกันตัว ไม่ใช่การเอาคืน".
- The reenactment is labelled "ภาพจำลองเหตุการณ์ (สมมติ)". There is no CCTV framing and there are no fake timestamps or forensic results.

## Quiz

The choices exactly as specified:

- ก. นนท์ไม่มีความผิด เพราะถูกทำร้ายก่อน
- ข. การตามไปชกเป็นการป้องกันโดยชอบเสมอ
- ค. การผลักอาจเป็นการป้องกัน แต่การตามไปชกอาจเป็นความผิด
- ง. นนท์ผิดทั้งสองช่วงเสมอ แม้ผลักเพื่อหยุดภัย

Correct answer: ค. Only ค is highlighted after the countdown; the other cards dim. There is no confetti.

## Other checks on the final MP4

- `blackdetect` and `freezedetect` (2.5 s threshold) find nothing. Slow drift was added to the quiz background, the split panels and the key-message hold, so no long stretch is perfectly static.
- **Promo** (shared module): it uses only the claims in the narration and the existing poster (10,000+ questions, weekly updates, 6 subjects, timer, AI analysis, packages, CTA to the profile link). The package cards show the poster's durations, not prices. There are no discounts, testimonials, pass rates, police endorsements or guarantees.
- **Earlier episodes:** untouched.
  - `shared/engine/props_crime.js` is new and loaded only by EP15.
  - `build_episode.sh` gained an optional `mixer` setting; episodes without it build exactly as before.

## Known limitations

- **No speech recognition was available**: model downloads are blocked in this environment. Cue times inside each narration file come from pause analysis, matched to the order of the script:
  - quiz choices: ก 9.97 / ข 13.86 / ค 18.32 / ง 25.27 s;
  - answer beats: Event A replay 9.32 s, the four elements 11.26 / 13.98 / 16.03 / 19.88 s, Event B 24.73 s, ภัยสิ้นสุดแล้ว 27.32 s, comparison 40.37 s, key message 44.71 s.

  A cue may land slightly before or after the spoken words.
- **Animation style:** the characters are a stylised 2.5D vector rig (SVG in a headless browser), not CG 3D models. Depth comes from parallax layers, depth-of-field blur, rim lighting and colour grading.
- **Fonts:** Prompt is used for all overlays. Kanit and Mitr are not installed.
