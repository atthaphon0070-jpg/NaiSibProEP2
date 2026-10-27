# EP20 QC report (run on the FINAL MP4)

File: `EP20/output/NaiSibPro_EP20_Binary_1101.mp4`, 130.403 s, 3,912 frames.
Evidence in this folder: `frame_0001.png`, `contact_sheet.png` (1 frame per second, 131 tiles), `ffprobe.txt`, `loudness.txt`, `blackdetect_start.txt`, `dom_checks.txt`, `safe_zone.txt`, `static_check.txt`, `audio_durations.txt`, `beat_map.md`.
Re-run: `EP20/tools/qc_video.sh EP20/output/NaiSibPro_EP20_Binary_1101.mp4`, `node EP20/tools/qc_dom.js`, `node EP20/tools/qc_safe.js`, `python3 EP20/tools/qc_static.py` (run from `EP20/`).

## OPENING
- [x] **PASS.** Frame 0 shows "เตรียมสอบนายสิบ" fully visible. It is yellow, 118 px, set on two lines (เตรียมสอบ / นายสิบ), with its glyph box at x 255–825, y 300–560 and opacity 1. 1101 is visible in glowing cyan above four flickering bulbs. See `frame_0001.png`, extracted from the final MP4 with `select=eq(n,0)`.
- [x] **PASS.** No black or empty frames at the start (`blackdetect`: none in the first 3 s). There is no fade-in or logo intro; the brand header only fades in at 2.2 s.

## AUDIO
- [x] **PASS.** All 7 files are present and play in order 01→07. They are byte-identical to the ZIP, and their MD5s differ from every other episode's audio.
- [x] **PASS.** Nothing is cut mid-word and nothing overlaps. Gaps between files are 0.300 s (9 frames). The countdown is 150 silent frames (narration peak 0.0 inside it). Nothing is time-stretched; narration gain is 1.0 before the master stage.
- [x] **PASS.** The voice sits above the music: the bed (music + SFX) is 13.9 dB under the voice (median of voiced 100 ms windows).
- [x] **PASS.** No clipping. Integrated loudness is −14.1 LUFS, matching EP05's −14.2 LUFS (the series target, per the brief's "match previous episodes" rule), with a true peak of −0.7 dBFS. The master stage is one uniform −1 dB gain plus a −1.4 dBFS lookahead limiter, which reduces gain by more than 1 dB in 0.00 % of windows.

## MATH & GRAPHICS
- [x] **PASS.** Place values read 8 · 4 · 2 · 1 left to right in every row (knowledge, explanation, quiz, answer).
- [x] **PASS.** 1010 lights bulbs 8 and 2 (ON levels 1 0 1 0) and gives 10. 1101 lights bulbs 8, 4 and 1 (1 1 0 1) and gives 13. Bulb 2 stays off.
- [x] **PASS.** Every binary digit sits exactly above its bulb and label: the maximum centre offset is 0.01 px over 409 samples (`dom_checks.txt`). Alignment is structural, because the shared `BINROW` component places the digit, bulb and label on one column x.
- [~] **PASS, with an interpretation.** The yellow result "13", the equation and the banner "1101₂ = 13" appear only after 06_answer starts. The only "13" on screen before then is the choice-card text **ค. 13**, which the brief's quiz section requires on screen when it is spoken (10.80 s into 05_quiz). That card looks identical to the other three until the reveal.
- [x] **PASS.** Thai on-screen text is taken verbatim from the approved transcripts, plus the labels the brief itself specifies (ลืมหลักสุดท้าย, สลับหลัก, อ่านเป็นฐานสิบ, QUIZ). Prompt renders vowels and tone marks correctly in every still checked (e.g. ข้อนี้ต้องรู้!, เดี๋ยว, เพิ่มขึ้น, สัปดาห์).
- [x] **PASS.** Nothing overlaps: the overlay is never covered, and the countdown sits below the cards.
- [~] **PASS, with small transient edge exceptions.** Key text stays in the safe zone (X 190–870, Y 300–1430). `safe_zone.txt` lists the remaining exceptions: 1–9 px for a few frames while an element's pop-in overshoot, its glow pulse or its bob is at its peak (for example the rightmost knowledge label at 876 px during the "สองเท่าเสมอ" glow pulse, and the countdown's beat-pulse at 1432 px). A few captions report a 1–2 px top edge at y 298–299, and the QUIZ banner (y 306–422) sits at the top edge. Settled layouts are all inside.
- [x] **PASS.** No static stretch longer than 2.5 s: the longest is 2.23 s, during the quiz question read-out at 69.9 s. Foreground change is measured 0.5 s apart, with the background excluded by threshold.

## QUIZ
- [x] **PASS.** The 4 cards are identical before the reveal (0 frames with differing card styles in frames 2020–2651). The bulbs are all OFF during the quiz and countdown (maximum ON level 0).
- [x] **PASS.** The countdown is exactly 150 frames (2502–2651): 5×30 → 4×30 → 3×30 → 2×30 → 1×30, with one tick per number. There is no narration and no change to the cards, bulbs or colours.
- [x] **PASS.** The answer ค. 13 is revealed only after the countdown: 06_answer starts at frame 2652, and the card turns green on "ค" 1.43 s into 06.

## BRANDING
- [x] **PASS.** The real logo is `shared/brand/logo.png`, unaltered, small in the header during content and large in the CTA. The name reads "NaiSibPro นายสิบโปร". The CTA uses only the approved phrases. The hex teaser "1F = ?" is shown because the recording does say "ตอนหน้าเจอเลขฐานสิบหก", confirmed by the /s/ onset of สิบ at 13.59 s and ห of หก at 13.91 s in 07_promotion.

## EXPORT
- [x] **PASS.** 1080×1920, 30 fps CFR (r = avg = 30/1, 3,912 frames), H.264 High yuv420p, AAC-LC 48 kHz stereo ~201 kbps. The MP4 has faststart and plays correctly.
- [x] **PASS.** A/V stays in sync throughout: the audio is one continuous mix muxed against frame-exact video (video 130.403 s, audio 130.411 s). Every visual beat is computed from the same timeline the mixer uses.

## Beat sync (±3 frames)
Visual reveals start on the exact frame of their beat in `source/beats.js` (frame = ceil(t × 30)). How accurate the beats themselves are depends on the measurement: phrase starts come from a 10 ms silence map, and single words come from syllable onsets plus spectrogram reading of the fricatives. The estimated error is about ±1–2 frames. They were **not** cross-checked with forced alignment, because no ASR model could be downloaded in this environment.
