# EP.42 HANDOFF — 100 Mbps vs 500 MB: The Bit & Byte Trap

## 1. Episode
**เตรียมสอบนายสิบ: เน็ต 100 Mbps โหลดไฟล์ 500 MB ใช้เวลากี่วินาที?** The subject is Computer Studies: internet speed, data units, and bits vs Bytes.
The answer is **ค. 40 วินาที**: 500 MB × 8 = 4,000 Mb, and 4,000 Mb ÷ 100 Mb/s = 40 s. This is theoretical and uses decimal SI units.

## 2. Branch
`claude/bold-cannon-le1okk` on `atthaphon0070-jpg/NaiSibProEP2`. EP.02–EP.05 and `shared/` were not modified.

## 3. Source paths
- `EP42/episode.json`
- `EP42/source/{index.html, scenes.js, download_engine.js, data_units.js, beats.js, timeline.js}`
- `EP42/tools/qc.js`

It reuses the shared engine (life/easing, quiz cards, confetti, wipes, SFX registry), the audio prep / mix / render / build tools, the Prompt fonts and the official logo and mascots.

## 4. Original audio inventory
`EP42/audio/01_hook … 07_promotion.mp3` are mono MP3s at 44.1 kHz, 128 kb/s. They are byte-identical to the ZIP; only the doubled `.mp3.mp3` extension was dropped. The md5 sums are in `qc/audio_durations.txt`.

## 5. Measured durations (s)
| Segment | File | Length |
|---|---|---:|
| 01 hook | 01_hook.mp3 | 20.506 |
| 02 story | 02_story.mp3 | 21.159 |
| 03 knowledge | 03_knowledge.mp3 | 24.999 |
| 04 explanation | 04_explanation.mp3 | 28.029 |
| 05 quiz | 05_quiz.mp3 | 29.231 |
| 06 answer | 06_answer.mp3 | 39.811 |
| 07 promotion | 07_promotion.mp3 | 19.331 |
| **Narration total** | | **183.066** |

## 6. Total runtime
The total is **189.07 s**: 183.07 s of narration, a 5.00 s countdown, a 0.008 s frame-alignment pad and a 1.0 s tail.
**This is over the 180 s maximum.** The narration alone already exceeds the limit, so per the brief it was reported rather than sped up or cut. Getting under 180 s needs re-recorded, shorter narration.

## 7. Scene timeline
| # | Start–End (s) | Content |
|---|---|---|
| 1 Hook | 0.00–20.51 | Frame 0: เตรียมสอบนายสิบ, a download window with 500 MB and 100 Mbps, ?, and the headline. Then a 100 Mbps zoom with a gauge, "100 MB ใน 1 วินาที? ✗ ไม่ถึง!", Mb vs MB tiles with b/B glow, and "ตัว b เล็ก กับ B ใหญ่ ต่างกันอย่างไร?" |
| 2 Story | 20.51–41.67 | training_video.mp4 with server→PC packets; "500 ÷ 100 = 5" builds and is struck through with ผิด!; MB ≠ Mb (Byte vs bit); "ต้องแปลงหน่วยก่อน!" |
| 3 Bit vs Byte | 41.67–66.66 | b/B cards; bit = b; Byte = B; 8 bit blocks (01000010) fly into a 1 Byte box; 8 bits = 1 Byte; 1 MB = 8 Mb (decimal) |
| 4 Preparing | 66.66–94.69 | 100 Mbps → 100 Mb/s; 500 MB × 8 = 4,000 Mb; เวลา = ขนาดข้อมูล ÷ ความเร็ว; **4,000 Mb ÷ 100 Mb/s = ?**; คุณคิดว่าใช้กี่วินาที? |
| 5 Quiz | 94.69–123.93 | The question card is read line by line, then four neutral cards (ก 5 / ข 10 / ค 40 / ง 400 วินาที), then the MB → Mb hint and "ให้เวลาคิด 5 วินาที!" |
| 6 Countdown | 123.93–128.93 | Frames 3718–3867 with no narration: cyan ring and electric-blue 5→4→3→2→1, ticks, cards neutral |
| 7 Answer | 128.93–168.74 | เฉลย!; ค turns green at 130.03 s; 500 MB × 8 = 4,000 Mb; 4,000 ÷ 100 = 40 วินาที; download simulation (0/25/50/75/100 % at 0/10/20/30/40 simulated s); wrong 5 s method struck out → correct method; 40 s = theoretical, with a fluctuation graph; Byte × 8 = bit, MB × 8 = Mb, จำให้แม่น! b ≠ B |
| 8 Promo | 168.74–189.07 | คุณตอบถูกไหม? with comments; 5 วินาที? warning; official logo; NaiSibPro นายสิบโปร; 10,000+ ข้อ; อัปเดตทุกสัปดาห์; like / share / follow taps |

The beat-level timing is in `qc/beat_map.md`.

## 8. New animation components
- `download_engine.js`: generic fictional download window, a progress bar with optional 0–100 % / 0–40 s ticks, an organised server→PC packet stream (lanes, constant spacing), and a speed gauge.
- `scenes.js`: a circuit-trace background with packets, Bit→Byte block assembly, a struck-through wrong-equation treatment, the fluctuating real-speed graph, the like/share/follow CTA, and a frame-indexed countdown with no float drift.
- Two theme fixes: a CSS cross replaces Prompt's tiny `×`, and the engine's 2.5 % scene push-in is replaced by a 6 px vertical drift so panels stay inside the safe zone.

## 9. Unit-conversion validation
`qc/math_validation.json` passes 13/13 checks: 100 Mbps, 500 MB, 1 Byte = 8 bit, 4,000 Mb, 40 s, 12.5 MB/s, the alternative method, option ค, the wrong-5-s flag, and the simulation ticks. All values are decimal SI and no 1,024 conversion is used.

## 10. Correct-answer verification
ค (index 2) is computed from `UNITS.CHOICES`, the entry whose value equals `TIME_S`. Scanning every frame shows nothing distinguishes it before frame 3901.

## 11. Countdown validation
There are 150 frames: 30 each of 5, 4, 3, 2 and 1, confirmed by the per-frame scan and by frames decoded from the MP4. Exactly one silent interval exists, because the supplied files contain no countdown gap.

## 12. Blue-dominant style
- Navy radial background, electric-blue and cyan panels, and cyan glows.
- Yellow is used only for key numbers (B, 4,000, ?), green for correct, red for wrong, and pink for one comment avatar and the follow tap.
- Measured on the rendered frames: 96.6 % blue/cyan/navy and 1.4 % pink/red. The logo is not recoloured.

## 13. Mobile safe zone
- Text was scanned every 10 frames: it is all inside X 220–860 / Y 350–1430 at rest. The only exceptions are 12 sampled mid-entrance frames lasting ≤ 0.3 s.
- On 375×812, 390×844 and 430×932 (fill-height crop), the visible X range of 97–983 or wider contains the safe zone.
- The bottom of the frame (y > 1430), where platform captions and buttons sit, holds only decoration.

## 14. Final MP4
`EP42/output/NaiSibPro_EP42_Mbps_vs_MB_Download.mp4` is 1080×1920, 30 fps CFR, H.264 High yuv420p and AAC 48 kHz stereo, running 189.07 s at about −13.4 LUFS.

## 15. Re-render
Build the episode:

```bash
shared/tools/build_episode.sh EP42
```

Re-run QC:

```bash
node EP42/tools/qc.js
```

A full render takes about 8 minutes on 4 cores; set `WORKERS` to change the parallelism.

## 16. Known limitations
1. **The runtime of 189.07 s is over the 180 s limit**, because the narration is 183.07 s.
2. In-segment beats were timed from measured pauses, not word-level speech recognition, because no ASR model host was reachable. A few mid-sentence visuals may sit up to about 1 s from the exact word; segment boundaries, the countdown and the reveal are exact. A human watch-through is recommended.
3. The words of the promo phrase at about 13.6 s were unknown, so it shows "ข้อสอบครบ 6 วิชา · เตรียมสอบตำรวจ" from the approved poster.
4. The safe-zone scan found 12 transient entrance frames with text briefly crossing the edge.
