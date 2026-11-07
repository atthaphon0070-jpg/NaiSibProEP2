# EP.39 handoff — อนุกรมตัวเลขสลับ 2 ชุด (The Hidden Interleaved Number Sequence)

## 1. Episode
NaiSibPro EP.39 · Mathematics — number sequences · interleaved (odd/even position) sequences.
Question: จงหาจำนวนถัดไป 10, 18, 15, 27, 21, 38, 28, 51, 36, ? — ก 62 · ข 64 · **ค 66** · ง 68.

## 2. Repository
`atthaphon0070-jpg/NaiSibProEP2`, branch `claude/fervent-turing-qd31tr`. New workspace `EP39/`; earlier episodes untouched.
One shared change: `shared/tools/audio_mix.py` gains an optional `music.duck_db` (voice-ducking of the music bed). Without the key the mixer behaves exactly as before, so EP03–EP05 rebuild unchanged.
Sources: `EP39/source/{index.html, scenes.js, sequence_engine.js, sequence_math.js, beats.js}`, tools in `EP39/tools/`.

## 3–4. Original audio (unmodified, md5 in `qc/audio_durations.txt`)
| File | Duration (s) |
|---|---|
| 01_hook.mp3 | 22.439 |
| 02_story.mp3 | 17.241 |
| 03_knowledge.mp3 | 26.201 |
| 04_explanation.mp3 | 29.649 |
| 05_quiz.mp3 | 31.478 |
| 06_answer.mp3 | 42.527 |
| 07_promotion.mp3 | 19.487 |
| **Total narration** | **189.022** |

## 5. Final runtime
**194.648 s** (5,839 encoded frames @ 30 fps). This is over the 180 s target: the unmodified narration alone is 189.0 s. Recordings were not altered (see `qc/QC_REPORT.md`).

## 6. Scene timeline (global seconds)
| Scene | Audio | Start | Key visuals |
|---|---|---|---|
| 01 Hook | 01 | 0.000 | title on frame 0, floating cards + "?", "+2 / ×2" crossed out, cards re-enter on each spoken number, alternating jumps, two guide tracks, stopwatch |
| 02 Exam story | 02 | 22.439 | exam room (desk, paper, pen, clock, candidate) → push-in to a panning card strip, arrows sized by adjacent differences (+8 −3 +12 −6), cards fly into the grid, messy differences, two tracks |
| 03 Technique | 03 | 39.680 | 2×5 grid with position badges; odd positions lit blue and flown to row 1, even lit cyan and flown to row 2; unlabelled arcs |
| 04 Odd sequence | 04 | 65.881 | +5 +6 +7 +8 drawn on cue; "+5 → +6 → +7 → +8 / เพิ่มทีละ 1"; focus moves to the even row and "?"; "คุณหาคำตอบได้ไหม?" — no 66, no +15 |
| 05 Quiz | 05 | 95.530 | title, question card, numbers on cue, 4 neutral choices, two-row hint, "ให้เวลาคิด 5 วินาที!" |
| 06 Countdown | — | 127.033 | 150 frames, 5→1 × 30 frames, blue timer with cyan ring, ticks, no narration |
| 07 Reveal | 06 | 132.033 | ค green + check, "?" flips to 66; even chips fly into a row; +9 +11 +13; "+9 → +11 → +13 → +15"; +15 arc; 51 + 15 = 66; "เฉลยข้อ ค. 66"; both rows; "อนุกรมดูสลับไปมา? ลองแยกคี่–คู่!" |
| 08 Ending | 07 | 174.561 | comments, "คุณใช้เทคนิคอะไร?", official logo + NaiSibPro / นายสิบโปร, 10,000+ questions, weekly updates, like/share/follow |
| End | | 194.648 | 0.6 s tail, no silent end card |

Full beat-level map: `qc/beat_map.md`.

## 7. New animation components (`source/sequence_engine.js`)
Number card with object identity (one element per sequence position for a whole scene), index badges, cross-faded state layers (base / odd-blue / even-cyan / answer-green / dashed "?"), glow, 3-ghost motion trails, eased arc moves and keyframe paths, SVG difference arcs with draw-on and arrowheads plus labels. Scenes also add a horizontally panning strip with a tracking camera, proportional up/down difference arrows, a 150-frame blue countdown, blue confetti and an auto-fit pass that shrinks any essential text wider than the safe zone.

## 8. Blue-dominant system
Navy #142B53 background layers, cyan #22D3EE grid and glows, electric blue #2F6BFF odd row, cyan even row, light blue #95BFEF outlines, ice #E6F4FF text; yellow #FFD23F only for operations/"?", green #22C55E only after the reveal, red #EF4444 only for the crossed-out "+2/×2", pink #EE7FAA only for "down" arrows and small accents. The shared pastel background, wipe and header are re-themed through EP.39's own CSS; the official logo is untouched. Measured: 99.3 % of coloured pixels are blue/cyan/navy hues (`qc/color_balance.json`).

## 9. Math validation — `qc/math_validation.json`: 15/15 PASS
odd [10,15,21,28,36] Δ [5,6,7,8]; even [18,27,38,51] Δ [9,11,13] → next Δ 15 → **66 = ค**. Position 10 is even, so the odd row is not used (its continuation 45 is checked as unused and not a choice).

## 10. Countdown — `qc/countdown_spoiler_check.json`
Frames 3811–3960, numerals 5/4/3/2/1 × 30 frames each, verified frame by frame; narration silent inside the window; no answer, +15 or green option on any checked frame before 132.033 s.

## 11. Mobile safe zone — `qc/safe_zone_report.json`, `qc/mobile_sim.png`
0 violations in 8,818 checks over 779 moving frames; zone inside the crop of 375×812, 390×844, 430×932 and clear of modelled TikTok / Shorts / Reels UI.

## 12. Final MP4
`EP39/output/NaiSibPro_EP39_Interleaved_Number_Sequence.mp4` — H.264 High, yuv420p, 1080×1920, 30 fps, AAC 192 kbps 48 kHz stereo, faststart.

## 13. Re-render
From the repository root (Chromium + Playwright + ffmpeg preinstalled; ~35–45 min on 4 cores):
`shared/tools/build_episode.sh EP39`, then `node EP39/tools/validate_math.js`, `node EP39/tools/qc_safezone.js 0.25`, `node EP39/tools/qc_timing.js`, `EP39/tools/verify_output.sh`. Timing tweaks go in `source/beats.js`; values come only from `source/sequence_math.js`.

## 14. Known limitations
* Runtime 194.6 s > 180 s because of narration length (not altered).
* Phrase cues come from voice-activity detection matched to the brief's anchors; there was no speech recogniser. Number-level cues match one-to-one; a few phrases outside the brief use neutral visuals. Worth a listen.
* The music bed and SFX are synthesized by the shared mixer (no licensed tracks).
* The encoder drops the final silent-tail frame (5,839 of 5,840); no content is affected.
