# EP23 QC report: run on the FINAL MP4

File: `EP23/output/NaiSibPro_EP23_PC_Boot_Case.mp4`. The raw numbers are in `measurements.json`; the tools are `EP23/tools/qc_final.py`, `qc_layout.js` and `qc_content.js`.

## OPENING
- [x] **Frame 0 shows "เตรียมสอบนายสิบตำรวจ" fully visible, including "ตำรวจ".** It is 110 px, yellow, two lines inside the safe zone, and the top-priority element. The PC case and a finger pressing the power button are also on screen. See `frame_0001.png`, extracted with `select=eq(n,0)` from the final MP4. There is no entrance animation on the keyword.
- [x] **No black or empty frames at the start.** Mean luma of frames 0–4 is 39.9 (navy room, not black), and `blackdetect` finds 0 black segments in the whole video. The "จอดำสนิท" beat (5.12 s) dims the room and the midground only; the keyword stays on the overlay at full brightness.

## AUDIO
- [x] **All 7 files, in order, with no overlaps.** The gaps are 9.02 / 9.02 / 9.67 / 9.57 frames between 01→05 (9 frames plus padding to the frame grid), 0.32 frames 05→countdown, 0 countdown→06, and 9.32 frames 06→07.
- [x] **No cuts mid-word and no time-stretching.** Every file's decoded samples are **bit-identical** inside the narration track (`narration_bit_exact_in_track`: all true).
- [x] **Voice above music and SFX.** The bed sits a median **24.5 dB** under the voice in voiced 50 ms windows (10th percentile 11.6 dB), with a 12 dB voice-keyed duck. The siren (hook only) is about 1.2 s at a low level.
- [x] **No clipping.** True peak is −0.1 dBTP (the narration's own peaks; the voice gets gain 1.0, and the bed is turned down locally where voice plus bed would exceed 0.97).
- [x] **Loudness** is −13.6 LUFS integrated, LRA 5.8 LU, matching the series (EP22 −13.9, EP05 −14.2).

## CONTENT & GRAPHICS
- [x] **Only PSU, Mainboard, CPU and RAM get "ขาดไม่ได้" stamps before 06.** `content_check.txt` samples every 0.1 s and checks each visible stamp's folder: 0 violations.
- [x] **The Hard Disk is never shown as "not needed" or as the answer before 06.** In 04 its file is empty with a yellow "?" and "ยังไม่ได้ตัดสิน!". There is no ✓, ✗, green fill or stamp on any choice card and no verdict wording before 111.867 s (0 violations).
- [x] **Optional lines handled correctly.** "โพสต์" is spoken, so "POST ✓" is shown. The 06 filing-cabinet line is spoken, so the cabinet beat is shown.
- [x] **No real brand names or logos anywhere.** The brand-name scan over all visible text for the whole video finds 0 hits. The art is generic: the BIOS screen is unbranded and the OS icon is a generic program window.
- [x] **Thai text matches the transcripts; vowels and tone marks are correct.** Prompt is used throughout, the stills were checked visually (ตำรวจ, ผู้ต้องหา, ปี๊บ, ไบออส, ฮาร์ดดิสก์, อัปเดต), and no upper or lower marks are clipped.
- [x] **No overlapping text; key text inside the safe zone.** `layout_check.txt` samples every 0.25 s and reports **0 overlaps** (stamps are measured as separate groups). It reports 11 transient safe-zone hits, all on moving elements: the folders sliding out at 39.5, 45.25 and 59.75 s, the Hard Disk folder popping in at 87.75 s, and the promo folder flipping during the wipe at 149.25–149.5 s.
- [x] **No static stretch longer than 2.5 s.** The longest run of practically identical frames is **1.87 s** (frame 2859, while the quiz card waits for the next line).

## QUIZ
- [x] **4 identical cards before the verdict.** The content check compares frame colour, background, filter, shadow and scale once all cards are on screen: identical. Each card pops on "ข้อ X" and its name appears on the spoken name.
- [x] **Countdown exactly 150 frames, 5→1, no narration.** Frames 3206–3355 (106.867–111.867 s), 30 frames per digit, with ticks. The narration peak inside is 0.0, and there is no spotlight during the quiz or countdown.
- [x] **Answer ข้อ ง. ฮาร์ดดิสก์ revealed only after the countdown,** at "ข้อ ง." (113.29 s): green card, ×1.08, ✓, others dimmed to 40 %, gavel and chime.

## BRANDING
- [x] **Real logo** (`shared/brand/logo.png`, not redrawn or recoloured): small in the header during content, prominent in the CTA.
- [x] **Correct name** "NaiSibPro นายสิบโปร" and **approved CTA only**: ปิดคดีเรียบร้อย!, ใครตอบถูก, คอมเมนต์ ฮาร์ดดิสก์ มาเลย!, อยากฝึกข้อสอบคอมพิวเตอร์แบบนี้อีกเยอะ ๆ, NaiSibPro นายสิบโปร, ข้อสอบมากกว่า 10,000+ ข้อ, อัปเดตทุกสัปดาห์, กดติดตาม, คดีหน้า…, เจอกัน!
- [x] **End logo hold** is 0.94 s after the last word (≤ 1.0 s).

## EXPORT
- [x] **1080×1920, 30 fps CFR.** r_frame_rate and avg_frame_rate are both 30/1, and packet Δt is 0.033333–0.033334 s over 4,965 frames.
- [x] **H.264 High yuv420p + AAC LC 48 kHz stereo, 196 kbps.** It plays correctly and A/V are in sync: both streams start at 0, video is 165.500 s and audio 165.514 s, and the visuals and audio come from the same `timeline.json`.
- [x] **Contact sheet** at one frame per second: `contact_sheet.png`.
