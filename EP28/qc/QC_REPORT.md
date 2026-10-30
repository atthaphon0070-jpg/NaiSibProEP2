# EP.28 QC report — Network Topology

All checks below were run on the final source and on the exported `output/NaiSibPro_EP28_Network_Topology.mp4`.

## Release blockers
| Requirement | Result | Evidence |
|---|---|---|
| Frame 0 shows "เตรียมสอบนายสิบ" | PASS: fully visible at frame 0 (no fade), with the live star network and the question line | `frame_0001.png` (from the MP4) |
| Topology diagrams structurally correct | PASS: 7/7 graphs valid, 14/14 failure scenarios, 8/8 wrong shapes rejected | `topology_validation.json` |
| No packet over a broken or missing link | PASS: 0 violations over 3,607 samples (the view refuses and logs any such packet) | `frame_checks.json` |
| Star has no PC-to-PC links; bus is not a star; ring closes; mesh reroute uses a real path; tree has no cycle; hybrid combines types | PASS | `topology_validation.json` |
| Topology names match the displayed diagram | PASS: 0 mismatches (every `data-topo` label compared with the diagram type every 0.1 s) | `frame_checks.json` |
| Quiz answer | ข. Star Topology (unchanged) | `source/scenes/s5_quiz.js` |
| Countdown exactly 5 s | PASS: frames 7737–7886 = 150 frames, 30 per numeral, 7736 and 7887 blank. No narration (voice track peak 0.0 in 257.9–262.9 s); the answer voice starts at 262.945 s | `frame_checks.json`, `countdown_frames.jpg`, `countdown_audio.txt` |
| ข not revealed early | PASS: all four cards identical (overlay, check, filter, shadow, badge) at every sample before 264.074 s | `frame_checks.json` |
| Safe zone X 220–860, Y 350–1430 | PASS: 0 unresolved. All `.crit` boxes and every main diagram (union of nodes and cables) are inside at opacity ≥ 0.98, including entrances, morphs and camera moves | `safe_zone_report.json` |
| Phone views | PASS: center-crop on 375×812 / 390×844 / 430×932 keeps video X ≈ 97–983 (critical 220–860). The TikTok / Reels / Shorts style overlay boxes do not touch the critical zone | `phone/phone_report.json`, `phone/phone_f_*.jpg` |
| All 7 narration files present, original | PASS: md5-identical to the ZIP. Gain 1.0, no speed change, no trimming | `audio_durations.txt` |
| MP4 rendered and validated | PASS (see below) | `ffprobe.txt`, `decode_errors.txt` |

## Media
- 1080 × 1920, 30/1 fps constant, H.264 High, yuv420p, 10,821 frames.
- AAC-LC, 48 kHz, stereo; 360.700 s; 97.3 MB.
- Full decode: 0 errors. `blackdetect`: no black segments.
- Loudness: −13.0 LUFS integrated, −0.6 dBFS true peak, LRA 3.7 LU.

## Diagram bounds (union over the episode, stage px)
| Diagram | Bounds (x0, y0, x1, y1) |
|---|---|
| star | 222, 588, 858, 1241 |
| bus | 223, 612, 857, 1214 |
| ring | 232, 595, 848, 1230 |
| mesh | 232, 532, 848, 1230 |
| tree | 227, 508, 853, 1323 |
| hybrid | 270, 554, 810, 1272 |
| p2p | 254, 845, 826, 1033 |

## Limits of these checks
- The phone overlays are approximate UI boxes, not captures of the real apps.
- Word timing comes from per-chunk offline transcription plus pause detection, not forced alignment. Beats inside a single chunk (e.g. "คณิตศาสตร์", "กดติดตาม") use the finer pause map. One human listening pass is still recommended.
