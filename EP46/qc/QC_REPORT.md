# EP.46 QC report

## Final media (inspected from the encoded file)

| Item | Measured |
|---|---|
| File | `output/NaiSibPro_EP46_Flowchart_Symbols.mp4`, 71,866,008 bytes |
| Video | H.264 High @ L4.2, yuv420p, 1080×1920 (9:16), 30/1 fps constant, 6,138 frames |
| Audio | AAC-LC, 48 kHz, stereo, 192 kb/s |
| Duration | 204.600 s (3:24.6) |
| Full decode | `ffmpeg -f null` with no errors |
| Loudness | −14.4 LUFS integrated, LRA 4.4 LU; narration at gain 1.0 (bed ducks only) |
| Countdown audio | music and ticks only (max −9.2 dBFS); narration peak 0.0 |
| Encode | CRF 21 / preset slow (final), re-encoded from the same rendered frames as the CRF 17 build so it fits GitHub's 100 MB file limit; PSNR vs source frame 48.7 dB |

`qc/first_frame.png` is frame 0 of the MP4: เตรียมสอบนายสิบ, สัญลักษณ์ Flowchart, รูปไหนใช้ทำอะไร?, glowing diamond with ?. `qc/contact_sheet.png` has 42 frames from the encode, with the safe zone outlined in yellow.

## Release-blocking checklist

| Check | Result |
|---|---|
| Frame 0 shows เตรียมสอบนายสิบ | PASS (first_frame.png) |
| Blue dominant, not pink | PASS: navy/electric/cyan throughout; pink only on logo, follow button, comment hearts, poster (~4 s) |
| Animated, not a slideshow | PASS: flying shapes, self-drawing flowlines, pulses, data token, camera moves |
| Correct symbol shapes | PASS (checks 1–5, 7) |
| Decision branch logic | PASS (checks 9–11, fail conditions all false) |
| Threshold ≥ 60, 60 → ผ่าน | PASS (checks 8, 12, 12b; on-screen 60 ≥ 60 = จริง → ผ่าน) |
| Answer is ก; card shape order matches text | PASS (checks 14, 15) |
| No highlight before countdown ends | PASS: 1243 frames checked; first reveal frame 4405 ≥ countdown end 4403 |
| Countdown exactly 5 s / 150 frames | PASS: frames 4253–4402, digits {'1': 30, '2': 30, '3': 30, '4': 30, '5': 30} |
| Flowchart has no disconnected paths | PASS (checks 6, 11) |
| Pass/Fail not reversed | PASS (checks 9, 10, R) |
| Original narration unmodified | PASS: MD5s in audio_durations.txt; no trim/stretch |
| Thai typography | PASS: Prompt Thai; tone marks and vowels checked in stills; ≥ and → drawn as SVG glyphs |
| Mobile clipping | PASS: 0 persistent violations over 1024 samples |
| Runtime ≤ 180 s | **FAIL (reported, not hidden): 204.6 s.** Narration alone is 198.4 s; recordings were not modified, per the brief |
| MP4 actually rendered and inspected | PASS |

## Flowchart validation (`flowchart_validation.json`)

- PASS [1] Start uses the Terminator symbol
- PASS [2] End uses the Terminator symbol
- PASS [3] Process uses a rectangle (straight sides, square corners)
- PASS [4] Input/Output uses a parallelogram
- PASS [5] Decision uses a diamond
- PASS [6] Flowlines start at the source symbol, end with the arrowhead at the target, never point backward
- PASS [7] On-page Connector uses a small circle (96 px, labelled A on both ends)
- PASS [8] Score threshold is >= 60
- PASS [9] Yes branch outputs Pass
- PASS [10] No branch outputs Fail
- PASS [11] Both branches reach End
- PASS [12] Score 60 is classified as Pass
- PASS [13] Score 59 is classified as Fail
- PASS [12b] All test cases (45, 59, 60, 75, 100) give the expected result and end at End
- PASS [14] The exam's correct answer is ก
- PASS [15] All four options match the approved text, and each card draws the shapes in the same order as its text
- PASS [17] The three-symbol answer is not presented as the whole program
- PASS [16] No correct-answer highlight before the countdown completes (every frame from quiz start to countdown end)
- PASS [R] Rendered execution runs (75, 45, 60) show the correct evaluation and result

## Execution runs rendered in the video

- 75: `75 60 = จริง` → ผ่าน (route input → e_in_dec → decision → e_yes → out_pass)
- 45: `45 60 = เท็จ` → ไม่ผ่าน (route input → e_in_dec → decision → e_no → out_fail → e_fail_end → end)
- 60: `60 60 = จริง` → ผ่าน (route input → e_in_dec → decision → e_yes → out_pass → e_pass_end → end)

## Safe zone
Zone X 220–860, Y 350–1430, tolerance 4 px, sampled every 0.2 s including transitions. 50 transient excursions (entrance slides, back inside within 0.4 s), 0 persistent.
Device crops (cover fit): 375x812 → visible x 97–983, 390x844 → visible x 96–984, 430x932 → visible x 97–983. Platform overlays (TikTok / Reels / Shorts right rail and bottom caption) are outside the zone.

## Audio sync
Phrase starts were measured from each recording (`beat_map.md`), and every visual beat is keyed to them. No narration overlaps the countdown, and the answer reveal starts 0.06 s into 06_answer.mp3.
