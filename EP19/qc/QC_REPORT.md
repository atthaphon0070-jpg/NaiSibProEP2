# EP19 QC report — measured on the FINAL MP4

File: `final/NAISIBPRO_EP19_2D_GARUDA_SIZE_POSITION.mp4`. Machine-readable results are in `qc/final_qc.json` (final file) and `qc/layout_report.json` (every frame of the live page).

## OPENING
- [x] **Frame index 0 shows "เตรียมสอบนายสิบ" fully visible:** see `qc/frame_0001.png`, extracted from the final MP4.
  - Yellow keyword pixels: 49,642. Keyword box: x 228–851, y 306–555, inside the safe zone.
  - The keyword is set in 132 px Prompt 800 on two lines and is the largest element on screen.
  - The tilted A4 page and the gliding Garuda are already on screen and moving in frame 0.
- [x] **No black or empty frames at the start:** `blackdetect` over the first 2 s found nothing. Frame 0 mean luma is 70.6.

## AUDIO
- [x] **All 7 files present, in order, unedited, no overlaps:**
  - Durations are in `qc/audio_durations.txt`.
  - Each file is placed whole, with 9-frame silent gaps.
  - The phrase count measured in each file matches the transcript exactly (`qc/beat_map.md`).
- [x] **Voice clearly above the music; no clipping:**
  - The music + SFX bed sits 12.3 dB under active speech: −28.4 vs −16.1 dBFS RMS.
  - The mixer lowers the bed further wherever voice + bed would exceed 0.97 FS. The voice gain stays at 1.0.
  - The final file measures −16.0 LUFS integrated, 4.8 LU loudness range, and −2.2 dBFS true peak.

## GRAPHICS
- [x] **Thai text matches the approved script; vowels and tone marks render correctly:**
  - On-screen strings are copied from the transcript or the quiz text.
  - Prompt's Thai face is confirmed loaded.
  - The ink boxes, which include upper and lower marks, are checked on every frame. Nothing is clipped, and no text sits in a container with `overflow:hidden`.
- [x] **Numbers are correct:** 3 ซม., 1.5 ซม. and ≈ 2.5 ซม. Counters land exactly on 3.0 and 1.5.
- [x] **External = top-centre / 3 cm and memo = top-left / 1.5 cm everywhere:** this holds in the explanation, the answer panel and the recap. The only deliberately wrong placements are the story's mistake (top-right) and the ง panel (centre → corrected to top-left).
- [x] **No overlapping text; all key text inside the safe zone (X 190–870, Y 300–1430):**
  - `tools/qc_layout.js` checked all 4,460 frames against 91 key-text elements and found 0 issues.
  - The smallest settled on-screen text is 42 px (the choice cards). The quiz question is 62 px and the hook keyword is 132 px.
- [x] **No static stretch over 2.5 s:** the longest run of practically identical frames is 35 frames (1.17 s), from frame 662. The blueprint background drifts continuously.

## QUIZ
- [x] **4 choices, identical styling before the reveal:**
  - All four cards use the same renderer with the same style and size, and stay motionless once they have entered.
  - Nothing highlights a card while it is read.
  - See `qc/countdown_frames.png`.
- [x] **Countdown exactly 150 frames, 5→1, no narration:**
  - The countdown runs from frame 3055 to frame 3204, and 06_answer starts at frame 3205.
  - The number changes exactly at cd+30, +60, +90 and +120, checked on the final frames.
  - The countdown audio is silent apart from the ticks and a softer bed.
- [x] **Answer = ค., revealed only after the countdown:** the banner reads "เฉลย..." from frame 3205, and the ค card turns green on "ข้อ ค!" (06 audio 1.18 s, about frame 3240).

## BRANDING
- [x] Real `shared/brand/logo.png` is used unchanged: small in the header, and large only in the CTA.
- [x] The name is shown as "NaiSibPro นายสิบโปร".
- [x] The CTA is the approved one only: comment "ใหญ่อยู่กลาง", go to นายสิบโปร, 10,000+ questions, updated weekly, follow.

## EXPORT
- [x] 1080×1920, 30/1 fps CFR, H.264 High yuv420p, AAC 48 kHz stereo (about 200 kbps).
- [x] Video is 148.633 s and audio is 148.659 s: a 0.026 s difference, under one frame.
  - The shared builder muxes with `-shortest`, so the 4,460th rendered frame is dropped because the audio ends 8 ms earlier.
  - EP04 and EP05 behave the same way.
- [x] Contact sheet (one frame per second): `qc/contact_sheet.png`.
