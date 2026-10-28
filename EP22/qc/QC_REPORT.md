# EP22 QC report: run on the FINAL MP4

File: `EP22/output/NaiSibPro_EP22_Work_Rate.mp4`. The raw numbers are in `measurements.json`; the tools are `EP22/tools/qc_final.py`, `qc_layout.js` and `qc_content.js`.

## OPENING
- [x] **Frame 0 shows "เตรียมสอบนายสิบ" fully visible**, large (116 px) and yellow, as the top-priority element. Two officers stand in front of the white wall with rollers mid-stroke. See `frame_0001.png`, extracted with `select=eq(n,0)` from the final MP4. There is no entrance animation on the keyword.
- [x] **No black or empty frames at the start.** Mean luma of frames 0–4 is 76.6 (navy set, not black), and `blackdetect` finds 0 black segments in the whole video. The "6 วัน" / "3 วัน" labels pop on the spoken words (4.44 s / 6.52 s).

## AUDIO
- [x] **All 7 files, in order, with no overlaps.** The gaps are +9.9 / 9.0 / 9.6 / 9.9 frames between 01→05 (9 frames plus padding to the frame boundary), 0.63 frames 05→countdown, 0 countdown→06, and 9.7 frames 06→07.
- [x] **No cuts mid-word and no time-stretching.** Each file's decoded samples are **bit-identical** inside the narration track (`narration_bit_exact_in_track`: all true).
- [x] **Voice above the music.** The bed (music + SFX) sits a median **24.5 dB** under the voice in voiced 50 ms windows (10th percentile 11.5 dB). The music has a 12 dB voice-keyed duck: bed −43.4 dBFS during speech, −40.4 dBFS between phrases.
- [x] **No clipping.** True peak is −0.3 dBTP (the narration's own peak; the voice gets gain 1.0, and the bed is turned down locally wherever voice plus bed would exceed 0.97).
- [x] **Loudness** is −13.9 LUFS integrated, LRA 4.6 LU, which matches EP05 (−14.2 LUFS).

## MATH & GRAPHICS
- [x] **Example:** 12 blocks (3 rows × 4 columns), 3 blue + 1 cyan per day, complete on day 3. The calendar flips วันที่ 1 → 2 → 3 and the wall completes at "สามวัน" (62.72 s); "12 ÷ 4 = 3" and "3 วัน" follow. The grid component refuses block counts that are not a whole number of days.
- [x] **Answer:** 6 blocks (2 × 3), 1 blue (ก) + 2 cyan (ข) per day, complete on day 2. The calendar shows วันที่ 1 → 2; "6 ÷ 3 = 2" and "2 วัน" land at "สองวัน" (106.91 s).
- [x] **Block colours match the worker who painted them.** Every cell's colour comes from the cell's assigned worker in the plan; ก paints from the left edge, ข from the right.
- [x] **"2 วัน" as a result, and any 6-block grid, do not appear before 06_answer.** `content_check.txt` samples every 0.1 s from 0 to 93.5 s and finds 0 violations; "2 วัน" appears only on the quiz choice card ข้อ ก.
- [x] **The numbers 9 and 4.5 do not appear in scenes 1–4** (same check; the mistakes are shown as "วัน + วัน" and "(วัน + วัน) ÷ 2").
- [x] **Shortcut beat present only if spoken.** The lines are in 06_answer (28.49–36.31 s), so the formula is shown, synced to "คูณ", "หาร", "บวก", "หก", "สาม", "สิบแปด", "เก้า" and "ได้สอง".
- [x] **Thai text matches the transcripts; vowels and tone marks are correct.** Prompt is used throughout, the stills were checked visually (tone marks on ห้าม/ไม่/เร็วที่สุด, sara am, mai han-akat and so on), and there is no clipping of upper or lower marks.
- [x] **No overlapping text; key text inside the safe zone.** `layout_check.txt` samples every 0.25 s with tight text boxes and reports 0 overlaps. It finds 7 transient safe-zone hits, all on moving elements: a trap card sliding off-screen at 120.25 s, and the answer wall's labels rising back in at 130.25 s.
- [x] **Worker badges (ก/ข) are visually distinct from choice letters.** Workers appear as white letters in solid blue or cyan circular badges; choices appear as "ข้อ ก." … "ข้อ ง." in dark-grey pills on neutral white cards.
- [x] **No static stretch longer than 2.5 s.** The longest run of practically identical frames (mean absolute difference below 0.15 on a 108×192 grey proxy) is **1.83 s** (frame 965).

## QUIZ
- [x] **4 identical cards before the reveal**, each popping at "ข้อ X" with its value at the spoken value.
- [x] **Plain wall without a grid during the quiz and countdown.** The thinking-aid wall is a plain `WORK.wall` with no grid; `content_check` confirms no grid is drawn during the quiz or countdown.
- [x] **Countdown exactly 150 frames, 5→1, no narration.** Frames 2655–2804 (88.500–93.500 s) show 5, 4, 3, 2, 1 for 30 frames each, with ticks. The narration peak inside is exactly 0.0, and 06_answer starts at frame 2805.
- [x] **Answer ข้อ ก. 2 วัน revealed only after the countdown**, at "ข้อ ก. สองวัน" (94.60 s): green card, scaled ×1.08, ✓, others dimmed to 40 %.

## BRANDING
- [x] **Real logo** (`shared/brand/logo.png`, not redrawn or recoloured): small in the header during content, prominent in the CTA.
- [x] **Correct name** "NaiSibPro นายสิบโปร".
- [x] **Approved CTA only:** ใครตอบถูก, คอมเมนต์ 2 วัน มาเลย!, อยากฝึกโจทย์คณิตแบบนี้อีกเยอะ ๆ, นายสิบโปร, ข้อสอบมากกว่า 10,000+ ข้อ, อัปเดตทุกสัปดาห์, กดติดตาม, แล้วเจอกันข้อต่อไป!
- [x] **End logo hold** is 0.97 s after the last word.

## EXPORT
- [x] **1080×1920, 30 fps CFR.** r_frame_rate and avg_frame_rate are both 30/1, and packet Δt is 0.033333–0.033334 s over 4,444 frames.
- [x] **H.264 High yuv420p + AAC LC 48 kHz stereo, 196 kbps.**
- [x] **Plays correctly; A/V in sync.** Video and audio start at 0. Video is 148.133 s and audio 148.147 s (the encoder's `-shortest` trims the 14 ms tail). The visuals are driven by the same `timeline.json` as the audio.
- [x] **Contact sheet** at one frame per second: `contact_sheet.png`.

## Files in this folder
`audio_durations.txt`, `beat_map.md`, `frame_0001.png`, `contact_sheet.png`, `measurements.json`, `layout_check.txt`, `content_check.txt`, `QC_REPORT.md`.
