# EP.42 QC report — 100 Mbps vs 500 MB

**Verdict:** The episode is ready to deliver except for one item. The runtime is **189.07 s, which is over the 180 s maximum** (see §1). Every other release-blocking check below passes, and each was checked on the rendered MP4 or by the automated scan in `tools/qc.js`.

## 1. Runtime conflict (reported as the brief requires, not hidden)
- The seven supplied narration files measure **183.07 s** together, which is already over 180 s before the required 5 s countdown is added.
- The shortest compliant timeline is 183.07 + 5.00 = 188.07 s. The delivered file is 189.07 s, including a 1.0 s end-card tail.
- The audio was **not** sped up, trimmed, split or re-voiced. Bringing the video under 180 s would need shorter narration from the producer, for example re-recorded 06_answer (39.8 s) or 03/04.

## 2. Final file (measured with ffprobe/ffmpeg on the output)
| Check | Result |
|---|---|
| Path | `EP42/output/NaiSibPro_EP42_Mbps_vs_MB_Download.mp4` |
| Video | H.264 High, 1080×1920, yuv420p, 30/1 fps constant, 5,672 frames |
| Audio | AAC-LC 48 kHz stereo, 192 kb/s |
| Duration | 189.07 s |
| Loudness | about −13.4 LUFS integrated, peak −0.5 dBFS (one uniform +0.5 dB on the whole mix plus a −1 dBFS limiter; the narration is never processed on its own) |

## 3. Release-blocking checklist
| Item | Status | Evidence |
|---|---|---|
| Frame 0 shows เตรียมสอบนายสิบ | PASS | `qc/first_frame.png` (decoded from the MP4): pill, download window, 100 Mbps, 500 MB, ?, headline |
| Blue dominant | PASS | Of the coloured pixels across the 24-frame contact sheet: blue/cyan/navy 96.6 %, pink/red 1.4 %, yellow 0.7 %, green 0.7 %. The logo is not recoloured |
| Not static slides | PASS | Packet streams, progress bars, gauge, flying bit blocks, equation builds, a fluctuating-speed graph, tap animations, plus a background of circuit traces with moving packets |
| b vs B clear | PASS | The letters are 120–220 px on the master (≈ 46–85 px on a 375×812 phone), always labelled bit/Byte and ตัวเล็ก/ตัวใหญ่, so colour is not the only cue |
| Definitions | PASS | bit = b, Byte = B, 8 bits = 1 Byte, 1 MB = 8 Mb (labelled decimal) |
| Result = 40 s | PASS | `qc/math_validation.json`: 13/13 checks pass, all derived from `source/data_units.js` |
| No 1,024 / MiB | PASS | Decimal only; 1,024 never appears |
| No early answer | PASS | Before frame 3901, the scan of every frame finds 0 with the correct-card overlay or "ค. 40 วินาที" visible (`qc/reveal_check.json`). The pre-quiz equation stops at "4,000 Mb ÷ 100 Mb/s = ?" |
| ค is correct | PASS | Option ค turns green at 130.03 s, when "ข้อ ค" is spoken in 06_answer |
| Countdown exactly 5 s | PASS | Frames 3718–3867 (150 frames); digits 5/4/3/2/1 hold 30 frames each, checked per frame and on decoded MP4 frames 3717/3718/3747/3748/3867/3868 |
| Not duplicated | PASS | The narration files contain no countdown gap (longest internal pause 0.81 s), so exactly one silence was inserted |
| Narration unaltered | PASS | The files are byte-identical to the ZIP (md5 in `qc/audio_durations.txt`), with narration gain 1.0 in the mix and no time-stretching |
| Mobile safe zone | PASS* | `qc/safe_zone_report.json`. Sampling every 10 frames, text is outside X 220–860 / Y 350–1430 only in 12 mid-entrance frames (slide-ins and elastic overshoot lasting ≤ 0.3 s). At rest, everything sits inside. With a fill-height crop, 375×812, 390×844 and 430×932 all keep X 97–983 or wider visible, so the safe zone is never cropped |
| Thai / symbols | PASS | Prompt font throughout. `×` is drawn as a CSS cross because Prompt's glyph is tiny, and `≠` / `→` are SVG. MB, Mb, Mbps, Mb/s and MB/s are capitalised correctly everywhere; the wrong forms "500 Mb" and "100 MBps" never appear |

## 4. Download simulation
- At 144.79 s the bar goes from 0 to 100 % in 4.4 s of real time, covering 40 simulated seconds at a constant 12.5 MB/s.
- The ticks read 0 s 0 %, 10 s 25 %, 20 s 50 %, 30 s 75 % and 40 s 100 %, and the counters (simulated time, %, MB) all come from the same simulated clock.
- The scene is labelled "เวลาในการจำลอง: 40 วินาที" and "ภาพจำลองแบบเร่งเวลา (ไม่ใช่เวลาจริง)".
- The result is then qualified with "40 วินาที = ค่าทางทฤษฎี", a fluctuating real-speed graph and "ใช้งานจริงอาจใช้เวลามากกว่านี้".

## 5. Known limitations
- **Runtime:** see §1.
- **Beat timing:** No speech-recognition model could be downloaded in this environment because Hugging Face and the Whisper and Vosk hosts were blocked. Visual beats inside each narration file were therefore matched to measured pauses by order and length (`qc/beat_map.md`). Segment boundaries, the countdown and the reveal come from measured file lengths and are exact. A few mid-sentence beats may land up to about 1 s off the spoken word; I recommend a quick watch-through.
- **Promo, 13.6–15.0 s:** The words are unknown, so the screen shows a "ข้อสอบครบ 6 วิชา" chip, taken from the approved poster, at that phrase.
