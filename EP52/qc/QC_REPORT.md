# EP.52 QC report — DID YOU GO OR DID YOU WENT?

Every value below is measured from the exported MP4 or the rendered page by the scripts in `qc/tools/`.

## Release checklist

| Check | Result | Evidence |
|---|---|---|
| MP4 exists, plays end to end | PASS | full ffmpeg decode, 0 errors; 64.5 MB |
| 1080×1920, 30 fps CFR, H.264 yuv420p, AAC | PASS | h264 High yuv420p 30/1 fps, aac 48000 Hz × 2 |
| Frame 0 shows “เตรียมสอบนายสิบตำรวจ” | PASS | full phrase visible at t = 0 (2 lines: เตรียมสอบ / นายสิบตำรวจ), with “วิชาภาษาอังกฤษ” and “DID YOU GO OR DID YOU WENT?”; see `first_frame.png` |
| All 7 original narrations present, unedited | PASS | mix vs. original narration correlation per segment: hook 0.982, story 0.98, know 0.98, expl 0.979, quiz 0.98, ans 0.975, promo 0.978 |
| Countdown exactly 5.000 s / 150 frames | PASS | frames 3832–3981; per numeral {'1': 30, '2': 30, '3': 30, '4': 30, '5': 30} |
| No narration during countdown | PASS | narration track in window: digital silence (no narration); only music bed + 5 ticks |
| Audio 06 starts after countdown | PASS | audio 06 at frame 3982 (132.733 s) |
| No early answer reveal | PASS | 0 frames with green/check/filled blank before audio 06; neutral focus ring off during countdown |
| Correct highlight begins with audio 06 | PASS | first green frame = 3982 |
| Grammar validation (14 checks) | PASS | `grammar_validation.json` |
| Mobile safe zone X 220–860 / Y 350–1430 | PASS | 924 sampled frames, 5698 text measurements, 0 violations |
| Pink–blue balance | PASS | pink 53.5% / blue 46.5% |
| No clipping | PASS | full-scale samples: 0.000000; true peak -0.2 dBFS; integrated -12.0 LUFS |
| Runtime under 180 s | NOT MET | 184.600 s. Narration (178.991 s) + countdown (5 s) alone = 183.991 s. Audio was not trimmed or sped up, per the brief. |

## Runtime

- Video stream: **184.600 s** (5538 frames at 30 fps). Container: 184.612 s.
- The timeline ends at 184.612 s (5539 frames). The encoder's `-shortest` drops the final frame, which is the last 1/30 s of the silent end tail; no content or narration is lost.

## Scene timeline

| # | Scene | Audio | Start (s) | Length (s) |
|---|---|---|---:|---:|
| 1 | Opening hook — title from frame 0, Did you go vs Did you went, student, YESTERDAY trap | 01_hook.mp3 | 0.000 | 22.831 |
| 2 | Officer’s yesterday — calendar flip, walk home → road → police station, DID enters the question, WENT temptation | 02_story.mp3 | 22.831 | 24.686 |
| 3 | DID + V1 — auxiliary timeline, formula, 3 examples, incorrect forms, recap | 03_knowledge.mp3 | 47.517 | 26.279 |
| 4 | Statement vs question — WENT → GO signature transformation, Did he went ✗, memory rule | 04_explanation.mp3 | 73.796 | 26.514 |
| 5 | Official quiz — question, Thai meaning, four choices read one by one | 05_quiz.mp3 | 100.310 | 27.402 |
| 6 | Silent countdown 5 → 1 (150 frames) | — | 127.733 | 5.000 |
| 7 | Answer — ก. go, blank fills, DID = PAST / MAIN VERB = V1, statement with went, DID + V1, replay | 06_answer.mp3 | 132.733 | 30.276 |
| 8 | NaiSibPro promotion — comments, Did went → Did go, logo, 10,000+ questions, weekly updates, LIKE · SHARE · FOLLOW | 07_promotion.mp3 | 163.009 | 21.002 |

## Pink–blue balance per scene

| Scene | Pink % | Blue % |
|---|---:|---:|
| hook | 60.1 | 39.9 |
| story | 65.0 | 35.0 |
| knowledge | 50.9 | 49.1 |
| explanation | 51.4 | 48.6 |
| quiz+countdown | 48.9 | 51.1 |
| answer | 52.9 | 47.1 |
| promotion | 52.6 | 47.4 |

_MP4 sampled at 1 fps, 270x480 downscale; pink = hue 290-15 deg, blue = hue 180-250 deg, saturation > 0.07, value > 0.35. Neutral / white / text pixels excluded._

## Mobile

| Device | Fit | Visible source columns | Safe zone fully visible |
|---|---|---|---|
| 375x812 | cover (full-height, sides cropped) | 96.7–983.3 | yes |
| 390x844 | cover (full-height, sides cropped) | 96.4–983.6 | yes |
| 430x932 | cover (full-height, sides cropped) | 97.1–982.9 | yes |

Platform overlays (TikTok / Reels / Shorts right rail from about x 900, captions from about y 1450) sit outside the essential zone.

## Grammar checks

| # | Check | Result |
|---|---|---|
| 1 | Official question exactly "Did the police officer _____ to work yesterday?" | PASS |
| 2 | Choices ก. go / ข. went / ค. goes / ง. going | PASS |
| 3 | Correct answer is ก (index 0 is the only option that turns green) | PASS |
| 4 | Correct word is GO (blank fill text) | PASS |
| 5 | DID + base verb taught accurately (Did + subject + V1) | PASS |
| 6 | WENT explained as the past (V2) form of GO | PASS |
| 7 | Affirmative statement uses WENT correctly | PASS |
| 8 | Matching question uses DID + GO | PASS |
| 9 | No incorrect grammar appears as an approved / final example | PASS |
| 10 | Incorrect examples are visually marked (red X badge, "ผิด" tag, strike-through) | PASS |
| 11 | Original narration preserved (7 files, used whole, in order, unprocessed) | PASS |
| 12 | Official quiz does not reveal the answer early | PASS |
| 13 | English spelling correct (all approved sentences spelled exactly) | PASS |
| 14 | Thai translations accurate | PASS |

## Known limitations

- **Runtime:** the brief targets under 180 s, but the supplied narration plus the required 5 s countdown is 183.991 s. The narration was not modified, so the episode runs 184.6 s.
- **Beat timing:** speech-recognition models could not be downloaded in this environment (network policy). Animation beats are timed to the measured phrase starts in each recording, matched to the script’s voice anchors by order and duration (`beat_map.md`). Watch-through review of the sync is recommended.
- The narration is mixed unedited (gain 1.0). The whole mix (voice + music + SFX) gets one uniform +3 dB and a −1 dBFS lookahead limiter (`episode.json` → `master`), as in EP.04–05.

