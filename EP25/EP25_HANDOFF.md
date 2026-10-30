# EP.25 Handoff — เอกสารราชการเก็บกี่ปี ถึงจะทำลายได้?

**Final MP4:** `EP25/output/NaiSibPro_EP25_Document_Retention.mp4` (77.2 MB)

| Property | Measured (ffprobe / ebur128) |
|---|---|
| Resolution | 1080 × 1920 (9:16), yuv420p |
| Video | H.264 High, 30 fps (r = avg = 30/1), 6,822 frames |
| Audio | AAC-LC, 48 kHz, stereo, 192 kb/s |
| Duration | 227.400 s |
| Loudness | −15.1 LUFS integrated, LRA 4.8 LU, true peak −0.7 dBFS |

## Source paths
- `EP25/episode.json` — segment order, countdown, music and mastering settings
- `EP25/audio/*.mp3` — the 7 narration files (byte-identical to the ZIP; only the doubled `.mp3.mp3` extension was dropped); `EP25/audio/manifest.json` — md5s, durations, phrase cues
- `EP25/source/index.html` — scenes and timeline; `EP25/source/archive.js` — new EP.25 props
- `EP25/qc/` — frame 1, last frame, countdown boundary frames, contact sheet
- `EP25/renders/` (git-ignored) — timeline, narration, SFX cues, mix, frames

## Audio (measured)
| # | File | Duration (s) | Start (s) |
|---|---|---:|---:|
| 01 | 01_hook.mp3 | 24.111 | 0.000 |
| 02 | 02_story.mp3 | 34.116 | 24.111 |
| 03 | 03_common_mistake.mp3 | 42.762 | 58.227 |
| 04 | 04_explanation.mp3 | 39.001 | 100.989 |
| 05 | 05_quiz.mp3 | 19.487 | 139.990 |
| — | countdown (silence) | 5.000 | 159.500 (frame 4785) |
| 06 | 06_answer.mp3 | 48.666 | 164.500 |
| 07 | 07_promotion.mp3 | 12.434 | 213.166 |
| — | end-card tail | 1.800 | 225.600 |

227.400 s = 220.577 s of narration + 5.000 s countdown + 0.022 s frame-alignment pad + 1.800 s end-card tail. No other silence was inserted.

**Timing analysis:** phrase boundaries came from energy detection (−38 dBFS, 20 ms RMS) plus local Whisper-small transcription. Whisper was used only to read the wording and word timing; it generated no audio. The recordings match the approved storyboard in substance. They differ only in phrasing, and the visuals follow what is actually spoken: the hook opens "ข้อนี้หลายคนพลาด", step 3 is spoken as "เสนอผู้มีอำนาจพิจารณา", and the promo has no package or link call-to-action. The quiz wording, the four options and the answer (ง. 10 ปี) match the approved quiz exactly, so nothing contradicts it.

## Rendering method
Deterministic HTML/CSS/JS. `renderAt(t)` is driven only by the timeline, with seeded pseudo-randomness and no timers. Headless Chromium captures each frame, and ffmpeg encodes them.

Build command:

```bash
shared/tools/build_episode.sh EP25
```

The full build took 8 m 51 s with 4 workers.

## Reused
- `shared/engine/engine.js`: background, brand header, logo wipe (quiz and promo entries), `life()`/easing, quiz options, countdown ring geometry, confetti, SFX registry
- `shared/engine/props_story.js`: character rig "B" (the archive officer), thought bubble
- `shared/brand/logo.png`, `mascot_presenter.png`, `mascot_pose.png`, `poster.jpg`; Prompt fonts
- `shared/tools/audio_prep.py`, `render.js`, `build_episode.sh`, and `audio_mix.py` with its master limiter

## New
- `archive.js`: folder (opening cover), document, desk shredder (feed slot, strips, run/freeze), flip calendar, shelving, desk, door, stamp, STOP sign, process icons
- In `index.html`:
  - archive room with 5 parallax layers
  - retention rows that dock into a comparison table
  - 4-step procedure diagram
  - ≠ comparison
  - recap scene
  - custom promo timed to this promo narration (`promo.js` assumes an 8-beat package/link script that this recording does not contain)
  - paper-sheet scene transition
  - a countdown driver with no re-entry pop at the countdown boundary
- `shared/tools/audio_mix.py`: three additive SFX (`shred`, `alarm`, `drawer`). Existing sounds are unchanged, so earlier episodes are unaffected.

## QC results
- Frame 1 (`qc/frames/frame0001.png`): "เตรียมสอบนายสิบ", the subject chip "เอกสารราชการ เก็บกี่ปี?", the archive shelves, and a folder mid-way to the shredder. No black lead-in.
- Countdown: frames 4785–4934 (exactly 150), showing 5/4/3/2/1 for 30 frames each, verified at every boundary (`qc/countdown_edges.jpg`). The narration track holds 0 non-zero samples in the window. All four options stay neutral pink; green appears only on "ข้อ ง." (answer +0.98 s).
- The full MP4 decodes with no errors, and blackdetect finds 0 black segments.
- All 7 recordings are present in order, unedited, with no overlap between them.
- The final follow CTA and "แล้วเจอกันในข้อถัดไป!" are on screen while spoken. The end card animates (logo bob, button press, confetti) through the 1.8 s tail.
- Stills and contact sheets were inspected for collisions. Six layout fixes were made before the final render: hook stamp, 5-year condition chip, check badge, calendar exit, recap chip row, promo card positioning.
- Mastering: the first encode peaked at −0.1 dBTP. The repo's existing limiter (`"master"`, 0 dB gain, −1 dBFS ceiling) brought it to −0.7 dBTP, and loudness was unchanged.

## Legal accuracy
- ข้อ 57: the normal rule (≥ 10 ปี) and the 5-year / 1-year / permanent categories, each shown with its conditions. A footnote covers the other exceptions (classified material, case files).
- Destruction: survey within 60 days after the calendar year ends → destruction-request list → department-level head → committee, then the rest of the regulation's steps. The video never presents reaching the retention period, or appointing the committee, as permission to destroy.

## Limitations
- The underlying law was cross-checked against published summaries and handbooks (e.g. the สารบรรณ handbooks at npru.ac.th and lumrang.go.th). The Royal Gazette text was not fetched directly.
- No speech-alignment model was available offline, so the phrase cues are accurate to about ±0.1 s. That is fine for beat timing, but not true word-level lip-sync.
- `poster.jpg` is the approved promo poster shown whole, as in earlier episodes. Its price details come from the existing brand asset.
