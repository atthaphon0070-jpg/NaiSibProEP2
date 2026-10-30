# EP.27 QC report — Mail Merge (จดหมายเวียน)

All results below were measured on the final build (`output/NaiSibPro_EP27_Mail_Merge.mp4`) and the exact page it was rendered from.

## Export
| Check | Result |
|---|---|
| Container / video | MP4, H.264 High, yuv420p, 1080 × 1920 (9:16), 30/1 fps constant |
| Frames | 8,756 decoded (291.867 s) |
| Audio | AAC-LC, 48 kHz, stereo, 291.870 s (A/V end within 1 frame) |
| Size / bitrate | 87.9 MB, 2.41 Mb/s |
| Full decode (`ffmpeg -f null`) | no errors |
| Black frames (`blackdetect` ≥ 0.1 s) | none |
| Loudness | −12.5 LUFS integrated, LRA 3.9 LU, true peak −0.4 dBFS (same target as EP.26) |

Details: `video_checks.txt`.

## Narration
- Seven original files, byte-identical to the ZIP (md5 in `audio_durations.txt`), in the supplied order 01→07. Voice gain 1.0, no trimming, no speed change, no TTS.
- Music and SFX sit under the voice; the mixer only lowers the bed where voice + bed would clip (minimum bed gain 0.276). One uniform +2.5 dB master gain and a −1 dBFS limiter for the whole mix.
- 0.35 s of silence separates scenes (after 01, 02, 03, 04, 06). There is none between 05 and the countdown, and none between the countdown and 06.

## Quiz and countdown (`dom_checks.txt`, `countdown_frames.jpg`)
- Question matches the approved text exactly (6 lines). Choices exactly: ก. Track Changes · ข. Mail Merge · ค. WordArt · ง. Find and Replace.
- `05_quiz.mp3` ends at 203.745 s, after “ให้เวลาคิด 5 วินาที” (25.18–26.80 s in the file).
- The countdown spans frames 6113–6262 = **150 frames**: 5, 4, 3, 2, 1 for 30 frames each. No narration plays during it (mean −32.6 dB vs −17.5 dB on speech; only music and ticks).
- `06_answer.mp3` starts on frame 6263, immediately after.
- Between quiz start and the reveal (994 frames), no frame shows a green overlay or check, and no fully shown choice differs in style from the others.
- The reveal comes on “ข้อ ข.” at 209.877 s (frame 6296): ข turns green with a check, and the other three dim to 0.45.

## First frame (`frame_0001.png`, taken from the MP4)
“เตรียมสอบนายสิบ” is at opacity 1.0 at 80 px, box 225–855 × 360–452. Also fully visible: “500 ฉบับ ต้องพิมพ์ทีละคน?”, the glowing **500** and “ฉบับ”, over the navy office with the employee, monitor document and paper stacks. There is no black or logo-only intro.

## iPhone safe zone (`safe_zone_report.json`)
- **Method.** All **8,757 frames** were rendered in headless Chromium. On every frame, each critical element (196 distinct labels, class `sz`) with an effective opacity of 0.15 or more had its on-screen box measured. The box includes scale and translate, so entrances, exits and scale pulses are covered.
- **Zone.** X 220–860 × Y 350–1430.
- **Result.** 37,556 element checks found **0 violations**. The overall extent of critical content was 220.6–859.4 × 350.6–1391.5.
- **Platform simulation.** On every second frame, the glyph boxes of all active critical text were tested against 24 simulations:
  - 4 phones: 375×812, 390×844, 430×932 and 360×640 pt.
  - cover (centre-crop) and aspect-fit display.
  - generic TikTok-, Reels- and Shorts-style top bars, right rails, caption blocks and nav bars.

  Result: **0 hits** (no text cropped and no text under the UI).
- **Fixes this test caused.** An earlier pass found 95 hits: lower captions inside the Reels caption band on a 360×640 screen, and text under the right rail in cover mode. The fixes:
  - lower captions raised to end by about 1390;
  - text below y ≈ 760 kept left of x ≈ 820;
  - the quiz stack compacted so the countdown ring sits higher.
- **Readability.** The smallest fully visible critical text is 25 px (“Replace All” inside the dialog mock-up, and the “ไม่ตรงโจทย์” tags). Headlines are 80–118 px, key numbers 110–230 px, the question 44 px, choices 44 px, captions and commands 40–48 px.
- **Visual check.** The `mobile_preview_*.png` sheets are built from the MP4 frames: opening, story, Word demo, Excel data, Mail Merge result, quiz, countdown, answer and end card, on each simulated phone with overlays. They were inspected by eye. All key text is centred, unobstructed and legible; only card edges, the decorative mascot and the small brand pill meet overlay regions.

## Educational accuracy
- Mail Merge is shown as one **main document** plus a **recipient data source**, combined through **merge fields** («ชื่อ», «ที่อยู่»).
- Commands appear in spoken order with their real names: Mailings → Start Mail Merge (Letters) → Select Recipients (Use an Existing List…) → Insert Merge Field → Preview Results (recipient 1 → 2 → 3) → Finish & Merge (Edit Individual Documents… / Print Documents…). No e-mail sending is shown.
- Excel is presented as an example. The narration’s “not always Excel” beat shows Excel, a Word table, Outlook contacts, an Access database and a .csv file, which are source types listed by Microsoft Support.
- Find & Replace is shown working (“ค้นหาและแทนที่ข้อความ ✓”), followed by a caution (“ใช้ได้ แต่ไม่ได้ออกแบบมาเพื่อจดหมายหลายผู้รับโดยตรง”), not a red X. In the answer it gets an amber “ไม่ตรงโจทย์” tag.
- Track Changes is labelled → ติดตามการแก้ไข, and WordArt → ข้อความตกแต่ง.
- All names and addresses are fictional: ผู้รับ ก/ข/ค and ที่อยู่ A/B/C. The Word and Excel windows are labelled “ภาพจำลอง / ข้อมูลสมมติ” and use no Microsoft logos.

## Known limitations
- Timing comes from a local Whisper-small transcription plus pause analysis, not a hand-made transcript. Small Thai words inside long phrases may sit a few frames from the exact syllable. A quick listening pass is recommended.
- The platform overlays are conservative generic shapes, not pixel-exact copies of any app.
