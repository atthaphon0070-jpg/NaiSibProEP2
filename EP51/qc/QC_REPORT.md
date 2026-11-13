# EP.51 QC report — The police IS or ARE?

Final file: `EP51/output/NaiSibPro_EP51_The_Police_IS_or_ARE.mp4` (47.5 MB). Every number below was measured on the rendered file or the build products, not estimated.

## Verdict

**Approved, with one reported item:** runtime is **3:26.4 (206.4 s)**, not under 180 s. The seven supplied recordings alone last 200.2 s. Cutting or speeding up narration is forbidden, so the target can't be met from this audio (see "Runtime" below).

## Release-blocking checklist

| Check | Result | Evidence |
|---|---|---|
| Frame 0 shows **เตรียมสอบนายสิบตำรวจ** (with ตำรวจ) | ✅ | `qc/first_frame.png`; text log shows it at 0.0 s with วิชาภาษาอังกฤษ, THE POLICE / IS or ARE?, one officer vs a group, ? |
| Pink and blue balanced ~50:50 | ✅ | split pink/blue background on every frame; cards alternate blue/pink; dual countdown ring; `qc/contact_sheet.png` |
| One officer vs group comparisons present | ✅ | original cartoon officers A–D + student; group shown whenever "the police" is taught |
| Not a static slideshow | ✅ | walking, saluting, blinking, talking, gathering, searching; kinetic sentences, flips, wipes |
| The police taught with a plural verb | ✅ | `qc/grammar_validation.json` (15/15 pass) |
| Official question unchanged | ✅ | The police _____ looking for the suspect. · ก. is · ข. are · ค. am · ง. be |
| Correct answer ข. ARE | ✅ | choice ข turns green with a tick; blank fills with "are" |
| No early reveal | ✅ | green, tick and fill run only after the countdown ends (frame 4308); the reading focus ring is the same neutral yellow for all four choices |
| Countdown exactly 5 s / 150 frames | ✅ | frames 4158–4307, 30 frames per digit, read back from the MP4 in `qc/countdown_frames.png` |
| No narration during the countdown | ✅ | narration samples in the window are exactly 0; quiz speech ends 138.42 s, countdown 138.60 s, answer audio 143.60 s |
| English spelling | ✅ | every on-screen sentence logged in `qc/onscreen_text.json` |
| Thai readable | ✅ | Prompt font (Thai + Latin, offline), vowel/tone marks checked in stills |
| Essential content inside x 220–860, y 350–1430 | ✅ | `qc/safe_zone_report.json`: 413 samples; only 3 mid-entrance frames touch the edge |
| Original audio unchanged | ✅ | md5 of every file = the supplied zip (`qc/audio_durations.txt`); narration gain 1.0, no stretch |
| Final output rendered and verified | ✅ | `qc/media_qc.json` |

## Media

| | |
|---|---|
| Video | H.264 High, 1080 × 1920, yuv420p, 30/1 constant (r = avg = 30/1), 6191 frames |
| Audio | AAC 48 kHz stereo; full decode with no errors |
| Loudness | −14.0 LUFS integrated, −0.2 dBFS true peak (series is about −13.5 to −14.3) |
| Frames | the timeline gives 6192; the file has 6191 because `-shortest` dropped the last silent tail frame, as the audio is 3 ms shorter. Content is not affected |

## Runtime

| Part | Seconds |
|---|---|
| 01 hook · 02 story · 03 knowledge · 04 explanation · 05 quiz | 22.909 · 25.626 · 32.679 · 28.369 · 28.996 |
| countdown (+0.016 s pad to land on a frame boundary) | 5.000 |
| 06 answer · 07 promotion | 38.687 · 22.909 |
| tail | 1.200 |
| **Total** | **206.397** |

To get under 180 s, the recordings themselves would need to be about 26 s shorter, for example tighter takes of 03, 06 and 07.

## Issues found and fixed during QC

1. The text-fit routine shrank block-level titles (frame-zero "THE POLICE") to a tiny size. It now measures the text itself.
2. The panel caption used class `.pt`, which collides with the engine's particle class. It was renamed.
3. Quiz header and "เฉลย!" overlapped because of a local vs absolute time mix-up. Fixed.
4. The tick covered "are" on choice ข. It's now a corner badge.
5. The safe-zone scan flagged a 652 px Thai chip and the choice cards' focus pulse. Both were moved or resized inside the zone.
6. **Grammar:** during the IS→ARE flip, "Two police officers is on duty." was briefly on screen unmarked. The old verb now shows as a red, struck-through ✗ while it flips to "are".

## Method notes

- Phrase timings come from voice-activity detection on each file. The Whisper small model (CTranslate2 int8, from the npm package `@skillninja/shortmovie-telop-model-*`, sha256 verified) was used offline only to identify phrases. Nothing was generated or re-voiced.
- The narration says "A police officer" (never "a police"). The phrase "a police" without "officer" never appears on screen (check 8).
