# EP.39 QC report

Final file: `output/NaiSibPro_EP39_Interleaved_Number_Sequence.mp4` (84.8 MB). Everything below was checked on the rendered file or on the exact page that produced its frames.

## Release-blocking checklist

| Check | Result | Evidence |
|---|---|---|
| "เตรียมสอบนายสิบ" fully visible on frame 0 | PASS | `qc/first_frame.png` (extracted from the MP4, frame n=0) |
| Blue-dominant (not pink) | PASS — 99.3 % of coloured pixels are blue/cyan/navy hues, pink 0.1 % | `qc/color_balance.json` (1 fps over the whole MP4) |
| Numbers readable | PASS — main cards 110×132 px with 62 px numerals (hook 150×170 / 90 px); quiz chips 50 px; never a 10-wide row | contact sheet, mobile sim |
| Card order / odd–even grouping | PASS — cards are created from `sequence_math.js` by original index; odd = positions 1,3,5,7,9, even = 2,4,6,8,10 | `source/scenes.js` `pos3()`, contact sheet |
| Odd differences +5 +6 +7 +8; even +9 +11 +13 (+15) | PASS (15/15 programmatic checks) | `qc/math_validation.json` |
| Answer 66 = option ค, derived from the even row | PASS | `qc/math_validation.json` (wrong-row continuation 45 checked to be unused) |
| No reveal before the countdown ends; audio 04 does not spoil | PASS — every 2nd frame from 0 to the answer start (1,981 frames): no visible "66" outside the neutral option card, no "+15", option ค never green/checked. Detector positive-controlled after the reveal (it finds 66 / +15 there) | `qc/countdown_spoiler_check.json` |
| Countdown exactly 5 s | PASS — frames 3811–3960 (150 frames), each numeral exactly 30 frames, no numeral outside the window, narration peak inside the window = 0.0 (silence; only the bed + ticks) | `qc/countdown_spoiler_check.json`, `qc/countdown_frames.png`, `qc/media_summary.json` |
| Narration unchanged | PASS — the seven MP3s are byte-identical to the upload (md5 listed), decoded once, never time-stretched, trimmed, reordered or re-voiced; narration gain fixed at 1.0, a uniform +3 dB master gain + peak limiter is applied to the whole mix (same mechanism as EP.05) | `qc/audio_durations.txt`, `episode.json` |
| Mobile safe zone (X 220–860, Y 350–1430) | PASS — 779 moving frames (every 0.25 s), 8,818 element checks, 0 violations; zone lies inside the fill-to-height crop of 375×812, 390×844, 430×932 (visible X ≈ 97–983) and outside the modelled TikTok / Shorts / Reels UI | `qc/safe_zone_report.json`, `qc/mobile_sim.png` |
| Motion trackable | PASS — separations take 0.95–1.0 s per card, staggered 0.15 s, arc paths + motion trails, same card element travels | stills in this report's contact sheet |
| Runtime ≤ 180 s | **NOT MET — reported, not hidden.** See below | `qc/audio_durations.txt` |
| Rendered and inspected | PASS — ffprobe: H.264 High, yuv420p, 1080×1920, 30/1, AAC 48 kHz stereo, 5,839 frames, 194.648 s | `qc/media_probe.json`, `qc/media_summary.json` |

## Runtime conflict (not a silent change)
Unmodified narration = **189.022 s**; + mandatory 5.000 s countdown + 0.026 s frame-alignment pad + 0.6 s tail = **194.648 s**. The 180 s maximum cannot be met without altering the recordings, which the brief forbids. Nothing was sped up or cut; the only non-narration time is the countdown, a 0.026 s pad and a 0.6 s tail (no extended end card). To reach ≤180 s, ~15 s of narration would need to be re-recorded/shortened by the client.

## Notes
* Frame count: 5,840 frames were rendered; the encoder's `-shortest` (shared build tool) drops the final frame because the audio ends 0.019 s before it. That frame is inside the silent tail — no content is lost.
* Phrase timing: no offline speech recogniser is available, so phrase starts come from voice-activity detection and were matched to the brief's voice anchors by count/order. Number-by-number cues (hook, odd row, quiz numbers, choices, even row, "+n" labels) line up one-to-one with the detected phrases. Three phrases whose words are not in the brief (03 at 18.98 s / 22.05 s, 06 at 39.20 s, 07 at 13.54 s) are given neutral visuals. Please spot-check by ear; any cue can be nudged in `source/beats.js`.
* Two marginal (2–3 px) entrance-overshoot touches found in the 0.25 s pass were fixed and only the affected frame ranges (1460–1500, 4620–4860) re-rendered before the final encode; the re-run shows 0 violations.
* The brand header (logo + "NaiSibPro" top-left, decorative, unchanged series element) sits above Y 350 and is partly under platform top bars on phones; it is not essential content.
