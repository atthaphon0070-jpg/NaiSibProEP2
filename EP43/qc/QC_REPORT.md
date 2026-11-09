# EP43 QC REPORT

Final file: `output/NaiSibPro_EP43_Bit_to_Quettabyte.mp4`. Every check below ran on the rendered page or on the exported MP4.

| Area | Result | Evidence |
|---|---|---|
| Container / codecs | PASS | MP4, H.264 High, yuv420p, 1080×1920 (9:16), 30/1 fps constant, AAC-LC 48 kHz stereo; `ffmpeg -f null` decodes the whole file without errors |
| Runtime | **OVER LIMIT (reported, not hidden)** | 194.85 s. Narration alone is 188.84 s and the countdown adds 5.00 s, so the audio by itself is 193.84 s, 13.85 s over the 180 s maximum before any visual padding. The narration was not cut, sped up or trimmed. See "Runtime conflict" below |
| Frame zero | PASS | `qc/first_frame.png` is frame 0 of the MP4: "เตรียมสอบนายสิบ" at full opacity, no black frame |
| Original narration | PASS | `qc/audio_qc.json`: all 7 files used in order; the narration track is sample-identical to the decoded MP3s; each sits at 0.00 ms offset in the video (cross-correlation ≥ 0.99); md5s match the supplied ZIP |
| Countdown | PASS | `qc/countdown_validation.json`: frames 4168–4317 (150), 30 frames per numeral, order 5-4-3-2-1, frame-aligned, one instance, narration peak inside = 0, answer audio starts on the next frame |
| No early answer | PASS | First green highlight at 145.000 s (frame 4350, on "ข้อ ก"), after the countdown ended at 143.933 s. All four cards are neutral before that |
| Unit accuracy | PASS (25/25) | `qc/unit_validation.json`: 1 nibble = 4 bits, 1 B = 8 bits = 2 nibbles, kB…QB = 10³…10³⁰ B, ×1,000 decimal steps, no binary 1,024 values, ZB < YB < RB < QB, ก computed as the only ascending option, Ronna/Quetta tied to 2022 (27th CGPM Res. 3), no "maximum file size" claim |
| Safe zone (animated) | PASS | `qc/safe_zone_report.json`: 1949 samples (every 0.1 s across the whole video, transitions included), 8382 critical-element checks, 0 boxes outside X 220–860 / Y 350–1430 |
| Platform overlays | PASS | TikTok, Reels and Shorts right-rail / caption / top-bar zones: 0 collisions with critical text |
| Phones | PASS | 375×812, 390×844, 430×932: fill-crop keeps x ≈ 96–984 visible, so the safe zone is fully inside |
| Loudness | PASS | -14.9 LUFS integrated, -1.0 dBTP, LRA 3.9 LU. Uniform −1 dB master trim; narration is otherwise untouched |
| Blue dominance | PASS (visual) | Navy / electric blue / cyan everywhere. Yellow marks maths, green marks the answer, red marks warnings. Pink appears only in the logo artwork and one comment avatar (`qc/contact_sheet.png`) |

## Runtime conflict
The brief caps the video at 180 s ("if original narration permits") and targets 2:30–2:55. The supplied narration measures 188.839 s. With the required 5.000 s countdown, that is 193.839 s, so no compliant cut exists without editing the recordings, which the brief forbids. The video is 194.853 s: narration + countdown + 0.014 s of frame alignment + a 1.0 s end hold. To reach 180 s, the narration needs re-recording or shortening at the source by at least about 14 s.

## Readability note
The smallest text that reaches full opacity is the superscript exponent in the tower's "1 YB = 10²⁴ B" lines at 0.62× zoom. It measures 13.7 px in the video, about 6 pt on a 390×844 phone. All unit abbreviations, answers and headers are much larger. The exponents also appear large in the answer scene (10²¹…10³⁰ Bytes) and the QUETTA card.

## Fixes made during QC
- Headers and pills were wider than the strict 640 px safe width. They were resized, and the sweep was re-run until it found 0 violations.
- Quiz and answer cards no longer slide in from off-zone positions. They scale in place instead.
- The reveal check mark was moved off the "QB" token, and the confetti origin was moved below the options.
- The RONNA/QUETTA reveal camera was reframed so the header pills don't touch the new QB label.
- The recap header waits until the zoom-out finishes. Shuffle cards fade while leaving.
- The "×" sign was redrawn as an SVG, because Prompt's glyph is tiny.
- The true peak was −0.1 dBTP after AAC encoding. A uniform −1 dB master trim fixed it.
