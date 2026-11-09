# EP.46 Handoff — สัญลักษณ์ Flowchart: The Exam Decision Challenge

## 1. Episode
- **Title:** NaiSibPro EP.46 — สัญลักษณ์ Flowchart: โจทย์ตรวจผลสอบ
- **Subject:** Computer Studies — flowchart symbols and decision logic (Input/Output vs Process vs Decision)
- **Answer:** ข้อ ก. ด้านขนาน → ข้าวหลามตัด → ด้านขนาน

## 2. Repository / branch
`atthaphon0070-jpg/NaiSibProEP2`, branch `claude/loving-albattani-smv42b`. Everything is new under `EP46/`. Earlier episodes and `shared/` are unchanged.

## 3. Original audio inventory
Seven user-supplied ElevenLabs MP3s (mono, 44.1 kHz) were copied unmodified into `EP46/audio/`. The only change is the file name: the archive's doubled `.mp3.mp3` extension became `.mp3`. MD5 checksums are in `qc/audio_durations.txt`. No narration was generated, trimmed, reordered, sped up or replaced. Narration gain stays at 1.0; only music and SFX duck under it.

## 4. Measured narration
| File | Duration |
|---|---|
| 01_hook.mp3 | 22.831 s |
| 02_story.mp3 | 25.391 s |
| 03_knowledge.mp3 | 27.638 s |
| 04_explanation.mp3 | 29.466 s |
| 05_quiz.mp3 | 36.441 s |
| 06_answer.mp3 | 37.564 s |
| 07_promotion.mp3 | 19.069 s |
| **Total narration** | **198.40 s** |

## 5. Runtime — over the limit, reported rather than fixed
**The video is 204.6 s long (3:24.6):** 198.4 s of narration, the 5.0 s countdown and a 1.2 s end tail. That is **24.6 s over the 180 s maximum**. The narration alone runs 3:18, so the limit can't be met without editing the recordings, which the brief forbids. To get under 3:00, the recordings themselves need to be shorter: re-record or re-script at the source. The video has no extra silent holds; the only gaps are the countdown and the 1.2 s tail.

## 6. Scene timeline (absolute)
| Scene | Audio | Start → end (s) |
|---|---|---|
| 01 Flowchart symbol mystery | 01_hook | 0.000 → 22.831 |
| 02 Program scenario | 02_story | 22.831 → 48.222 |
| 03 Four main symbols | 03_knowledge | 48.222 → 75.860 |
| 04 Flowline, connector, memory technique | 04_explanation | 75.860 → 105.326 |
| 05 Official four-choice quiz | 05_quiz | 105.326 → 141.767 |
| 06 Countdown (silent, frames 4253–4402) | — | 141.767 → 146.767 |
| 07 Answer + complete flowchart + test runs + memory rule | 06_answer | 146.767 → 184.331 |
| 08 Promotional ending | 07_promotion | 184.331 → 203.400 (+1.2 s tail) |

Phrase-level beats are in `qc/beat_map.md`.

## 7. Reused shared assets
`shared/engine/engine.js` (renderAt engine, easing, `life()`, scene switching, brand header, wipes, confetti, SFX registry), `shared/engine/engine.css` (fonts and base kit), `shared/brand/logo.png` (not recoloured), `shared/brand/poster.jpg` (shown whole, never zoomed into prices or the QR code), Prompt Thai/Latin fonts, and `shared/tools/audio_prep.py`, `audio_mix.py`, `render.js` and `build_episode.sh`, all unchanged.

Two shared pieces were deliberately not used:
- **`promo.js`:** its pink, eight-beat package/price ending doesn't match this narration (comment → six symbols → brand → 10,000+ / weekly → like/share/follow), so EP.46 has its own blue promo scene.
- **`buildCountdown`:** replaced by a blue, frame-exact countdown.

## 8. New symbol components (`source/flowchart_symbols.js`)
`FS.node()` and `FS.mini()` draw six standard symbols:
- **terminator:** stadium shape
- **process:** square-cornered rectangle
- **io:** parallelogram, slanted 0.34 × its height
- **decision:** diamond
- **connector:** small circle
- **flowline:** arrow

States change only stroke, fill and glow (idle / hot / ok / bad / dim), never the geometry, so each shape is recognisable without colour. `FS.fixGlyphs` draws ≥ and → as inline SVG because the Prompt Latin subset lacks them.

## 9. Decision execution (`source/flowchart_engine.js`, `decision_logic.js`)
- `FCE.Chart` builds the chart from `flowchart_spec.js`. Each flowline has a base line that draws itself on, a cyan lit overlay, a travelling pulse, an arrowhead and Yes/No labels.
- The chart also has a data token, an evaluation bubble, a result pop and a camera.
- `DL.route(score)` returns the node/edge walk.
- `FCE.plan()` times that walk from flowline lengths and per-symbol dwell times.
- `FCE.stateAt(plan, u)` returns token position, lit edges and node hits for any time `u`. Everything depends only on `t`, so the same timestamp always gives the same frame.

The video runs three on-screen tests:

| Score | Evaluation | Branch | Result | Reaches |
|---|---|---|---|---|
| 75 | 75 ≥ 60 = จริง | ใช่ | ผ่าน | output |
| 45 | 45 ≥ 60 = เท็จ | ไม่ใช่ | ไม่ผ่าน | End |
| 60 | 60 ≥ 60 = จริง | ใช่ | ผ่าน | End |

Internally, 45, 59, 60, 75 and 100 are validated.

## 10. Flowchart logic validation
`qc/flowchart_validation.json` covers checks 1–17 plus `12b` (all five test scores) and `R` (the three rendered runs). The fail conditions it tests (missing branch, reversed Yes/No, wrong output, backward line, disconnected path, unreachable End, 60 → Fail) are all false. The answer note on screen says the three exam steps are not the whole flowchart (check 17).

## 11. Countdown validation
`qc/countdown_validation.json`:
- Starts on a frame boundary (frame 4253) and lasts exactly 150 frames.
- Shows 5, 4, 3, 2, 1 for exactly 30 frames each.
- Narration peak during the countdown is 0.0.
- No answer highlight, check mark, answer header or confetti appears on any frame from quiz start to countdown end.
- The first reveal frame is 4405, after the countdown ends at frame 4403, and it highlights ก.

## 12. Blue Dominant styling
- **Backgrounds:** navy radial #1C3D7A → #142B53 → #0B1A36, electric-blue 120 px grid plus a fine 30 px grid, drifting ghost symbol outlines and cyan "data packet" sparks on the grid lines.
- **Panels:** navy glass with #2F6BFF borders. Wipes are recoloured blue.
- **Colour roles:**
  - Yellow #FFD23F: the threshold 60 and the questions
  - Green: the ก reveal and Pass
  - Red: Fail
  - Pink: only the logo, the follow button after it is pressed, comment hearts and the approved poster (about 4 s)

## 13. Mobile safe zone
`qc/safe_zone_report.json`:
- **Sampling:** every 6 frames (0.2 s) over the whole video, transitions included.
- **Elements checked:** titles, panels, quiz cards, chips, rows, every symbol (including camera-moved flowchart nodes), Yes/No labels, evaluation bubble, result pop, countdown and CTA.
- **Zone:** X 220–860, Y 350–1430, 4 px tolerance.
- **Result:** 0 persistent violations. The only excursions are brief entrance slides, each back inside the zone within 0.4 s.
- **Devices:** with "cover" cropping, 375×812, 390×844 and 430×932 keep x ≈ 194–886 visible, so the whole zone shows.
- **Platform overlays:** TikTok, Reels and Shorts right-hand rails and bottom captions sit outside the zone.

To keep edge-aligned boxes inside, EP.46 turns off the engine's slow 2.5 % scene push-in.

## 14. Final MP4
`EP46/output/NaiSibPro_EP46_Flowchart_Symbols.mp4`: H.264 High, yuv420p, 1080×1920, 30 fps constant, AAC 48 kHz stereo 192 kb/s, faststart. Metadata is in `qc/QC_REPORT.md`.

The final file is 71.9 MB. The shared build script encodes at CRF 17, which came out at 134.6 MB, over GitHub's 100 MB per-file limit. The same rendered frames and mix were therefore re-encoded at CRF 21 (preset slow), measuring 48.7 dB PSNR against the source frame. To repeat that step after a build:
```bash
ffmpeg -framerate 30 -i EP46/renders/frames/%05d.jpg -i EP46/renders/mix.wav -map 0:v -map 1:a -c:v libx264 -preset slow -crf 21 -pix_fmt yuv420p -profile:v high -level 4.2 -r 30 -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart EP46/output/NaiSibPro_EP46_Flowchart_Symbols.mp4
```

## 15. Re-render
```bash
shared/tools/build_episode.sh EP46
```
```bash
node EP46/tools/validate_flowchart.js && node EP46/tools/qc_browser.js
```
To render stills plus a contact sheet: `EP46/tools/stills.sh <outdir> ans:20,24 promo:5`. Set `WORKERS=n` to change the number of render processes.

## 16. Known limitations
- **Runtime:** 204.6 s, over the 180 s limit (see section 5).
- **Phrase timing:** phrase starts come from pause detection, not a transcript; no speech recogniser was reachable offline. Phrases whose wording isn't in the brief have generic visuals. A transcript would let individual beats be tightened.
- **Music and SFX:** synthesised by the shared mixer, as in earlier episodes. No licensed music was added.
- **Poster:** the shared promo poster is pink-heavy. It appears whole for about 4 s as the approved promotion and is not recoloured.
