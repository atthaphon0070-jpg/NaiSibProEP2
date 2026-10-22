# EP.14 — 8 + 14 + 20 + 26 + … + 128 = ? (อนุกรมเลขคณิต) — QA notes

Final file: `EP14/output/NAISIBPRO_EP14_ARITHMETIC_SERIES_FINAL.mp4`
1080×1920 · 30 fps · H.264 High (crf 17) · AAC 192 kHz stereo 48 kHz · 255.42 s · 7,662 video frames

## Narration (the 7 supplied ElevenLabs files only)
Each file was located in the final mix by cross-correlation against the source MP3:

| Segment | File | Length (s) | Start (s) | Offset | Correlation* |
|---|---|---|---|---|---|
| hook | 01_hook.mp3 | 23.954 | 0.000 | 0 ms | 0.974 |
| story | 02_story.mp3 | 29.727 | 23.954 | 0 ms | 0.967 |
| mistake | 03_common_mistake.mp3 | 30.511 | 53.682 | 0 ms | 0.965 |
| method | 04_thinking_method.mp3 | 38.922 | 84.193 | 0 ms | 0.967 |
| quiz | 05_quiz.mp3 | 28.761 | 123.115 | 0 ms | 0.973 |
| countdown | — (silent, 5.000 s) | 5.000 | 151.900 | — | — |
| answer | 06_answer.mp3 | 68.598 | 156.900 | 0 ms | 0.959 |
| promo | 07_promotion.mp3 | 27.324 | 225.498 | 0 ms | 0.971 |

\*The correlation is below 1.0 only because of the music bed, the SFX and the mastering limiter.

Narration was not rewritten, trimmed, re-voiced or time-stretched. Narration gain is 1.0 in the mix.

Mastering applies one uniform +6 dB gain to the whole mix, followed by a lookahead limiter at 0.84 with `latency=1` (no time shift). This was done because the files were delivered at about −23 LUFS. Final loudness is −14.3 LUFS integrated, LRA 3.3 LU, true peak −0.6 dBFS.

## Countdown (5 s = 150 frames)
- The countdown runs from frame 4557 to frame 4706 (151.9 s to 156.9 s). Narration amplitude in that window is 0.0; only the tick SFX play.
- Verified on the encoded MP4:
  - frame 4556 has no timer;
  - frame 4557 shows "5";
  - frame 4706 shows "1";
  - frame 4707 is the first answer frame: the ค highlight starts and the timer is gone.
- `qa/spoiler_check.js` checked every frame of the quiz and countdown, plus every 0.1 s before the quiz, and found 0 violations. Throughout that range nothing shows 1,428 outside the choices, 136, 68, n = 21, or 1,360 outside choice ก, and no choice is highlighted.

## Safe Zone V2 (x 190–870, y 300–1430)
`qa/safezone_audit.js` samples every 0.25 s. It measures every visible text run, plus the countdown, logo and mascot.

Result: 13,302 measurements, 0 violations.

Not checked: the exam room and the maths universe. Both are full-frame background worlds (board text, operator glyphs).

## Maths (locked in code; the page throws if any of these fail)
- a₁ = 8, d = 6, aₙ = 128.
- n = (128 − 8) ÷ 6 + 1 = 21.
- S₂₁ = 21(8 + 128) ÷ 2 = 21 × 136 ÷ 2 = 1,428.
- Pairs: 8+128, 14+122, 20+116, 26+110, 32+104, 38+98, 44+92, 50+86, 56+80, 62+74, each = 136. The middle term is 68.
- 10 × 136 = 1,360, and 1,360 + 68 = 1,428.
- Choices: ก 1,360 / ข 1,407 / ค 1,428 / ง 1,496. Correct answer: ค.

## Other checks
- blackdetect and freezedetect (3 s threshold): none found.
- Earlier episodes:
  - All 110 tracked files in EP02–EP10 and `shared/` hash-identical to the pre-EP14 snapshot, except `shared/engine/props_story.js`.
  - That file's only change is one added look (`Cadet`); existing looks are untouched.
  - `shared/engine/props_math.js` is new and loaded only by EP14.
- Promo:
  - Feature claims come only from the narration and the existing poster: 10,000+ questions, weekly updates, 6 subjects, timer, AI analysis, packages, and the profile-link CTA.
  - The package cards show durations (6 เดือน / 1 ปี / 2 ปี) from the existing poster. They show no prices.
  - No discounts, testimonials, pass rates, endorsements or guarantees.

## Known limitations
- **No speech recognition was available**: model downloads are blocked in this environment. Visual cue times inside each narration file come from pause and energy analysis, matched to the order of the script. The quiz choice cues are 13.0 / 15.9 / 18.75 / 21.85 s into 05_quiz. The answer phrase map (formula steps, pairs 1–2 in detail, pairs 3–10 cascade, 68 focus, 1,360 → 1,428, recap lines) follows the pauses listed in `source/index.html`. A cue may land a little before or after the spoken words.
- The story's scratch paper deliberately stops at "42 + 26 = …", so the middle term 68 is never shown before the answer.
