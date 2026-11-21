# EP.61 QC report: หนังสือภายใน vs หนังสือภายนอก

**Verdict:** approved for release, with two items for a human to confirm (runtime over target, regulation text check). Both are in *Open items* below.

## 1. Export (measured on the delivered file)
| Check | Result |
|---|---|
| File | `output/NaiSibPro_EP61_Internal_vs_External_Documents.mp4` (74.5 MB) |
| Video | H.264 High, 1080×1920 (9:16), yuv420p, 30/1 fps constant, 5809 frames, 193.633 s |
| Audio | AAC-LC 48 kHz stereo, 193.660 s |
| Full decode | 0 errors (`ffmpeg -v error -f null`) |
| Loudness | −14.2 LUFS integrated, LRA 4.5 LU, true peak −0.5 dBFS (same as EP.05) |
| Runtime vs target | **193.66 s, over the 180 s target.** Narration alone is 186.83 s. Nothing was sped up, trimmed or reordered (see `audio_durations.txt`) |

The timeline is 5810 frames long. The encoder's `-shortest` dropped the last 33 ms of the silent end-card hold, so the video stream has 5809 frames. No narration is affected.

## 2. Audio (`audio_durations.txt`, `countdown_validation.json`)
- All seven files are present, in order 01 → 07, and byte-identical to the ZIP (md5 listed).
- The narration is mixed at gain 1.0: no stretching, trimming or processing on the voice alone. The master is unity gain plus a −1 dBFS lookahead limiter on the full mix. The raw mix was already −14.1 LUFS, so the series' make-up gain was set to 0 dB.
- No narration is replaced or added. The local Whisper pass only read phrase timings (`asr_phrase_timing_raw.txt`).
- Music sits about 19 dB under the voice, and the bed ducks automatically. SFX: paper slides, page flips, folder drops, stamps, pops, ticks, ding/success.

## 3. Countdown (`countdown_validation.json`, `countdown_frames.png`)
| Check | Result |
|---|---|
| Start | 139.500 s = frame 4185. Audio 05 ends at 139.468 s and the last voiced sample is 139.306 s; a 0.032 s pad aligns the start to a frame |
| Length | 5.000 s = **150 frames** (4185–4334); narration peak inside the window is exactly 0 |
| Digits | 5: 4185–4214 · 4: 4215–4244 · 3: 4245–4274 · 2: 4275–4304 · 1: 4305–4334. Checked frame by frame in the MP4 |
| After | Frame 4335 has no ring. Audio 06 starts at exactly 144.500 s (first voiced 144.549 s) |
| Look | Blue half-ring + pink half-ring drain together. Ticks every second. The question and all four choices stay on screen, all neutral |

## 4. No early reveal
- While choices are read: a neutral grey focus ring and grey underline on the card being read. No green, no ✓, no ✗, no dimming.
- All four cards return to equal weight at quiz 42.7 s, before the countdown.
- Green, ✓, dimming and the header **เฉลยข้อ ข.** start at 06 "ข้อ ข", global **145.55 s**, after the countdown ends at 144.50 s. Checked at 144.4 s: header "ข้อสอบสับขาหลอก!", all ✓ badges at opacity 0.
- The sorter's "correct folder" animation only runs in the explanation scene (04), never during the quiz.

## 5. Content (`regulation_validation.json`, 15/15 PASS)
- ภายใน → แบบพิธีน้อยกว่า → กระดาษบันทึกข้อความ; ภายนอก → เป็นแบบพิธี → กระดาษตราครุฑ. Consistent in every scene. Blue always means ภายใน and pink always means ภายนอก.
- Every memo drawing carries its small top-left Garuda. "ภายในไม่มีตราครุฑ" appears only as the struck-out wrong claim, and the forbidden form "หนังสือภายใน = ไม่มีครุฑ" never appears.
- Choices use the approved wording exactly, in a 2×2 table (ภายใน/ภายนอก × ระดับแบบพิธี/รูปแบบกระดาษ). Correct answer ข. ก = paper names swapped, ค = formality swapped, ง = external paper wrong.
- All required exact terms are present in the page text (automated check): เตรียมสอบนายสิบตำรวจ, วิชางานสารบรรณ, หนังสือภายใน, หนังสือภายนอก, แบบพิธีน้อยกว่า, เป็นแบบพิธี, กระดาษบันทึกข้อความ, กระดาษตราครุฑ, เฉลยข้อ ข.
- Sample papers use fictional text only (สำนักงานตัวอย่าง, ตย, นายตัวอย่าง ใจดี). No real agency, person or signature.

## 6. Frame zero (`first_frame.png`)
Frame 0 already shows **เตรียมสอบ / นายสิบตำรวจ** at full opacity, plus the officer at the desk and the blue memo and pink letter. No black frame, no delayed title, no logo-only intro. วิชางานสารบรรณ arrives on its narration at 1.85 s; หนังสือภายใน / หนังสือภายนอก + VS follow at 3.75 / 5.00 s.

## 7. Colour balance (measured on the MP4, 1 fps, saturation-weighted blue vs pink hue)
| Scene | Blue : Pink |
|---|---|
| Hook + story (office) | 49 : 51 |
| Knowledge | 50 : 50 |
| Explanation | 46 : 54 |
| Quiz + countdown | 54 : 46 |
| Answer | 51 : 49 |
| Promo | 44 : 56 |
| **Whole video** | **50 : 50** |

Before the rebalance the whole video measured 61 : 39.

## 8. Mobile safe zones (`safe_zone_report.json`, `device_preview.png`)
- 4,591 text measurements: every 0.5 s, every visible text run (opacity ≥ 0.5).
- Platform rule, accounting for the cover crop on 19.5:9 phones (375×812, 390×844, 430×932): text within x 110–984 and y 240–1480, and x ≤ 840 wherever y is 880–1650 (the right action rail). **Only transient violations remain**: the ก card's entrance slide and a 6 px camera push on the desk plaque.
- Against the brief's conservative 220–860 / 350–1430 box:
  - The frame-zero title fits (236–844), apart from 11 px of empty line-box padding at the top.
  - The resting countdown digit fits (1272–1401).
  - The quiz cards, comparison panels and memory cards deliberately use x ≈ 115–840 to keep the long Thai terms at 29–60 px instead of shrinking them. The brief allows this ("redesign… do not shrink text excessively").
- Smallest essential text in the quiz is 29 px, about 10 pt on a 390 pt-wide phone.

## 9. Thai typography
- Prompt (Thai + Latin) is loaded offline from `shared/fonts`. Tone marks and vowels rendered correctly in every reviewed frame, with no clipped ascenders or descenders.
- Spacing bug found and fixed: flexbox was swallowing the spaces in mixed-colour pill text.
- Text overflow found and fixed: "กระดาษบันทึกข้อความ" in the quiz cells was measured at 292 px at 31 px font, and the column width was raised to fit.

## 10. Defects found during QC and fixed
1. Quiz paper column overflowed its card → widths recomputed from measured glyph widths.
2. Countdown ring popped in on its first frame and lingered 0.3 s into audio 06 → now fully visible on frame 4185 and gone on 4335.
3. Master gain inherited from EP.05 (+3 dB) pushed loudness to −12.2 LUFS → set to 0 dB, now −14.2 LUFS.
4. On cover-cropped phones the right action rail hid the ends of the lower quiz cards, the pink plaque, the folders, the memory card and LIKE·SHARE·FOLLOW → everything re-laid out to x ≤ 840 inside the rail band.
5. Blue dominated the non-office scenes (61:39 overall) → background gradient rebalanced; now 50:50 (section 7).
6. Officer sat too low behind the desk; the paper docs were missing on frame 0; zoomed papers covered the scene titles → fixed.

## Open items for a human
1. **Runtime 193.7 s > 180 s.** This is set by the supplied narration (186.8 s) under the no-edit rules.
2. **Regulation text.** The official PDF hosts were unreachable from the sandbox, so do a one-minute check of ข้อ 11/12 against an official copy (see `regulation_validation.json`).
3. Beat timing was checked visually against measured phrase starts, not by listening. A quick watch-through with sound is recommended.
