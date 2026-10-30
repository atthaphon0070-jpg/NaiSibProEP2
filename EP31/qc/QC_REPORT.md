# EP.31 QC report

Every check below was run on the exported MP4 or on the rendered page.

| Check | Result |
|---|---|
| Container | 1080×1920, H.264 High, yuv420p, 30/1 fps CFR, 6,299 decoded frames, AAC-LC 48 kHz stereo, 209.97 s |
| Loudness | −13.5 LUFS integrated, −0.6 dBFS peak |
| Narration | 7/7 originals in order. The mix aligns with the narration at 0-sample lag with one uniform gain (no speed change or edit). 0 narration energy inside the countdown |
| Frame 0 | "เตรียมสอบนายสิบ" fully visible inside the safe zone (`frame_0001.png`) — PASS |
| Clock reference states | 03:00 / 03:05 / 03:10 / 03:15 → 90/0/90, 92.5/30/62.5, 95/60/35, 97.5/90/7.5 — PASS |
| Clock sweep | 1,283 samples, max hand error 0.0001° — PASS (`clock_validation.json`) |
| Countdown | 150 frames (4055–4204), 30 frames per numeral, 0 premature-highlight frames, ข green at 141.27 s — PASS |
| Safe zone | 0 critical violations. 22 transient pop-in overshoots (≤0.33 s, ≤16 px) — PASS (`safe_zone_report.json`) |
| Duration < 180 s | **FAIL.** The narration alone is 203.96 s. See `../EP31_HANDOFF.md` |

`contact_sheet.png` shows every 180th frame of the final MP4.
