# EP.38 QC report

| # | Release-blocking check | Result | Evidence |
|---|---|---|---|
| 1 | Frame 0 shows "เตรียมสอบนายสิบ" | ✅ | `first_frame.png` (decoded frame 0 of the MP4): keyword pill, "ส่งอีเมลถึง 50 คน / แต่ไม่อยากให้เห็นชื่อกัน!", email window and 50 icons. There is no entrance animation and no black frame |
| 2 | Blue-dominant, not pink | ✅ | 98.9 % of chromatic pixels are blue/navy/cyan and 0.5 % pink (220 MP4 frames at 1 per second) |
| 3 | Composer animated during the explanation | ✅ | Row glows, chip pop-ins, count badge, send press with cursor, fold into envelope, 1→50 paths |
| 4 | 50-recipient scenario throughout | ✅ | Hook grid, draft "50 คน", tray, "+47 คน" chips, "BCC 50 คน", 50-icon delivery, question |
| 5 | To/CC explained correctly | ✅ | `email_privacy_validation.json` checks 1–2 |
| 6 | BCC does not hide To/CC | ✅ | Check 6: staff@example.com stays visible in To for every BCC recipient |
| 7 | BCC recipients don't see each other | ✅ | Checks 4–5: views for applicants 01/02/03 |
| 8 | Answer is ค. BCC | ✅ | Check 10 |
| 9 | Reply All is an action, not a field | ✅ | Check 8 |
| 10 | No reveal before the countdown ends | ✅ | 0 green frames before 158.083 s, while the countdown ends at 157.033 s |
| 11 | Countdown exactly 5 s | ✅ | Frames 4561–4710 = 150, with 30 frames per digit, verified in the MP4 |
| 12 | Thai text not cropped | ✅ | Clipping check in `safe_zone_report.json` (0 clipped), visual review of the contact sheet and stills. Thai lines use line-height ≥ 1.4 and pills have top padding for vowels and tone marks |
| 13 | Mobile readability | ✅ | `safe_zone_report.json`: 0 critical issues at 1/15 s sampling. `mobile_sim.png`: 375/390/430 pt in fill and fit |
| 14 | Original narration unmodified | ✅ | md5 identical to the ZIP, unity gain, no time-stretch. The whole mix gets +0.6 dB and a −1 dBFS limiter |
| 15 | Runtime ≤ 180 s | ❌ **conflict** | 219.99 s, because the narration alone is 213.79 s. Reported in `audio_durations.txt`, not hidden |
| 16 | Real MP4 rendered and verified | ✅ | ffprobe: H.264 High yuv420p 1080×1920 30/1, 6,599 frames (219.97 s), AAC 48 kHz stereo. Full decode has 0 errors. −13.7 LUFS integrated, −0.5 dBTP |

## Files in this folder
- `audio_durations.txt`: measured durations, md5s and the runtime conflict.
- `beat_map.md`: every beat with local/absolute time and frame number.
- `email_privacy_validation.json`: 14 DOM-level checks.
- `safe_zone_report.json`: animated safe-zone and clipping scan.
- `first_frame.png`: frame 0 decoded from the MP4.
- `contact_sheet.png`: 24 frames evenly spaced through the MP4.
- `mobile_sim.png`: device fill/fit simulation with generic short-video UI zones.

## Fixes made during QC
- The engine's scene push-in (scale up to 1.025) pushed 640 px panels about 9 px out of the zone. It is disabled for EP.38.
- Slide-in distances (±200–300 px) were cut to ±40 px. The scale pulses on 640 px cards were replaced by glow only.
- The "เตรียมสอบนายสิบ" pill now leaves at the reveal so "เฉลย ข้อ ค. BCC" does not sit on top of it.
- The quiz cards were narrowed from 312 to 300 px so that the revealed ค card (×1.05 plus pulse) stays inside X 220–860.
- Wide captions were made smaller ("เหมาะกับการส่งถึงผู้สมัครจำนวนมาก", tagline, "ติดตาม NaiSibPro", final line), and the Reply All row was kept to one line.
- The "50 คน" BCC count badge overlapped the first chip, so it moved under the field label.
- The inbox header tag wrapped, so it was replaced by an icon.
- The office camera was reframed (×1.25), and the supervisor moved in front of the monitor.
- The mix was −12.3 LUFS at +2.5 dB master gain. It was lowered to +0.6 dB, giving −13.7 LUFS, in line with EP.05 (−14.2).
- CRF 17 produced 100.5 MB, over GitHub's per-file limit, so the file was re-encoded at CRF 19 (74 MB).
