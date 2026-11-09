# EP.47 handoff — FIVE TYPES OF COMPUTERS · คอมพิวเตอร์ 5 ประเภท ต่างกันอย่างไร?

## 1. Episode
NaiSibPro EP.47 covers Computer Studies: the five textbook computer categories and what each is built to do. The official quiz answer is **ข. เมนเฟรม และซูเปอร์คอมพิวเตอร์**.

## 2. Repository / branch
`atthaphon0070-jpg/NaiSibProEP2`, branch `claude/admiring-hypatia-009vkw`. Completed episodes (EP.02–EP.05) are untouched.

## 3. Source paths
| Path | Contents |
|---|---|
| `EP47/episode.json` | Segment order, the 5 s countdown, music settings, `crf` 21 |
| `EP47/source/index.html` | Page shell and Blue Dominant overrides |
| `EP47/source/beats.js` | Measured phrase anchors |
| `EP47/source/computer_types.js` | All educational wording and the quiz data |
| `EP47/source/environment_animations.js` | The five environments, the modern server room, the 3D gear and the weather simulation |
| `EP47/source/scenes.js` | The timeline |
| `EP47/tools/qc_page.js`, `EP47/tools/qc_media.py` | QC scripts |
| `EP47/qc/` | Reports |

Shared changes are additive only:
- `shared/tools/audio_mix.py` adds six SFX: `data`, `beep`, `hum`, `pulse`, `confirm`, `scan`.
- `shared/tools/build_episode.sh` adds an optional per-episode `crf`, defaulting to the previous 17.
- `shared/README.md` documents both.

## 4. Original audio inventory
Seven ElevenLabs MP3s (mono, 44.1 kHz, 128 kbps) came from the supplied ZIP and sit in `EP47/audio/`. They are byte-identical to the ZIP; the SHA-256 hashes are in `qc/audio_durations.txt`. The ZIP named them `*.mp3.mp3`; only the extension was corrected. There is no re-recording, TTS, trimming, speed change or re-ordering, and no extra spoken lines.

## 5. Measured durations
| File | Seconds |
|---|---:|
| 01_hook | 25.078 |
| 02_story | 26.906 |
| 03_knowledge | 33.724 |
| 04_explanation | 34.273 |
| 05_quiz | 34.351 |
| 06_answer | 40.124 |
| 07_promotion | 19.722 |
| **Total narration** | **214.178** |

## 6. Total runtime
The video runs **220.67 s (3:40.7)**:
- 214.178 s of narration
- 5.000 s of countdown
- 0.002 s frame-alignment pad
- 1.5 s end-card hold

**Duration conflict:** narration plus countdown is 219.18 s, which is 39.18 s over the 180 s maximum. Edge silence totals only 2.21 s, so the target can't be reached without altering the recordings. The episode is therefore **not** reported as runtime-compliant. To hit ≤ 180 s, the narration would need re-recording roughly 34 s shorter in total.

## 7. Scene timeline
| Scene | Audio | Start → end (s) | Content |
|---|---|---|---|
| 01 Hook | 01_hook | 0.000 → 25.078 | Frame 0 shows "เตรียมสอบนายสิบ" and "คอมพิวเตอร์ 5 ประเภท ต่างกันอย่างไร?" in electric blue on an ice card, over five equal silhouettes. Then: "วิชาคอมพิวเตอร์" → everyday office PC + laptop → left/right split, banking data centre vs research facility, "ต่างกันอย่างไร?" → 3D wireframe model → transaction stream → weather model → "5 TYPES OF COMPUTERS" kinetic title |
| 02 Story | 02_story | 25.078 → 51.984 | A data packet moves through the five environments with screen-zoom transitions: งานทั่วไป → โมเดล 3 มิติ → หลายคนใช้งาน → ธุรกรรมมหาศาล → จำลองสภาพอากาศ. Ends on five glowing job cards, "งานต่างกัน → ใช้คอมพิวเตอร์แบบไหน?", with "?" badges and no answer |
| 03 Knowledge | 03_knowledge | 51.984 → 85.708 | MICROCOMPUTER (personal office, PC ตั้งโต๊ะ / โน้ตบุ๊ก). WORKSTATION (3D/CAD studio, the gear model sweeps from wireframe to a shaded render). A nested diagram puts WORKSTATION inside PERSONAL / MICROCOMPUTER. MINICOMPUTER (historical room: tape reels, panel lights, four terminals sharing one machine, archive frame). Modern Server Systems, with the note "Server ไม่ได้หมายถึง Minicomputer เสมอไป" |
| 04 Explanation | 04_explanation | 85.708 → 119.981 | MAINFRAME COMPUTER (bank data centre: branch / ATM / mobile / card requests in, confirmations out, a "TRANSACTION PROCESSING" dashboard with no numbers, reliability / security chips). SUPERCOMPUTER (HPC aisle with parallel node waves feeding a storm simulation; weather forecasting / research). Stacked comparison cards. "Different Workloads / Different Strengths — ไม่ได้เร็วกว่ากัน “ในทุกงาน”" |
| 05 Quiz | 05_quiz | 119.981 → 154.331 | Organisation 1 (bank icon) and organisation 2 (storm icon), each highlighted while read, then the question and four blue cards (Thai + English). Live bank and HPC strips run along the bottom |
| 06 Countdown | — | 154.333 → 159.333 | Frames 4630–4779. Electric-blue digits, cyan ring, navy background, choices still visible, ticks on every second, all choices neutral |
| 07 Answer | 06_answer | 159.333 → 199.457 | "เฉลย!", then ข turns green with a check mark at 160.393 s. Organisation tags MAINFRAME and SUPERCOMPUTER appear. Then "MAINFRAME = ธุรกรรมจำนวนมาก" (live bank panel) → "SUPERCOMPUTER = คำนวณทางวิทยาศาสตร์" (live weather panel). A five-card recap highlights each card as it is named. Then "อย่าจำแค่ขนาด / ต้องดูหน้าที่การใช้งาน!" with "เฉลย ข. เมนเฟรม และซูเปอร์คอมพิวเตอร์" |
| 08 Promo | 07_promotion | 199.457 → 220.680 | "คุณตอบถูกข้อ ข. ไหม?" with a generic comment thread. Then "จำครบ 5 ประเภทหรือยัง?" with five checked icons → "ฝึกข้อสอบคอมพิวเตอร์เพิ่ม" → official logo + NaiSibPro / นายสิบโปร → approved poster + 10,000+ / รวมข้อสอบมากกว่าหมื่นข้อ / อัปเดตทุกสัปดาห์! → end card LIKE · SHARE · FOLLOW with button presses → "แล้วเจอกันคลิปถัดไป!" |

The phrase-level map is in `qc/beat_map.md`.

## 8. The five animated environments
All are original flat 2.5D SVG/canvas art. They are built so the job reads from the visuals alone; none of them reuses a generic server cabinet.
1. **Microcomputer: personal office.** A bright room with a window, desktop PC, monitor and laptop. One person seen from behind types a document; a chart window opens and the browser scrolls.
2. **Workstation: 3D design studio.** Dark room with cyan rim light. Dual monitors show a real-time 3D CAD gear (perspective, rotating, wireframe → shaded sweep) next to CAD drawing and render panels. The glass tower's GPU fans spin; the artist wears headphones.
3. **Minicomputer: historical multi-user room.** A vintage cabinet with spinning tape reels, blinking panel lights and toggle switches. Four text terminals, two of them with operators, send data pulses along cables to the central machine. Scanlines and archive corners mark it as historical.
4. **Mainframe: banking data centre.** Monolithic cabinets with light strips and a security shield. ฿ transaction tokens arrive from bank, ATM, mobile and card sources; check-mark confirmations go out. The dashboard and heartbeat line show continuous operation.
5. **Supercomputer: scientific facility.** A perspective aisle of racks whose node LEDs light in parallel waves. Data streams rise into a hanging weather-model display with an evolving storm spiral, isobars, wind lines and a compute-domain grid. A scientist in a lab coat watches.
6. **Modern server room** (comparison only). Bright racks of 1U servers serving laptops and phones over request/response paths.

## 9. Shared assets reused
- Engine: `shared/engine/engine.css` and `engine.js` (deterministic `renderAt`, `life` easing, wipes, quiz option component and reveal styling, countdown ring, confetti, SFX registry).
- Brand: `shared/brand/logo.png` and `poster.jpg`, unchanged.
- Fonts: Prompt Thai + Latin, from `shared/fonts/`.
- Tools: `shared/tools/audio_prep.py`, `audio_mix.py`, `render.js`, `build_episode.sh`.

The shared `promo.js` was not used: its eight beats follow a different promotional script. EP.47 builds its own ending from the same logo, poster, wordmark and end-card pattern to match 07_promotion.mp3.

## 10. Blue Dominant implementation
- **Background:** EP-local CSS/JS overrides make it a navy gradient with circuit traces, data pulses, drifting data bits and a moving perspective floor.
- **Palette:** navy `#142B53`, electric blue `#2F6BFF`, cyan `#22D3EE`, light blue `#95BFEF` and ice `#E6F4FF` on every card, header, wipe band and environment.
- **Accent colours:** yellow `#FFD23F` for learning highlights; green `#22C55E` only for the answer reveal and confirmations; red only for the "not just size" strike-through; pink only as tiny accents (like hearts, the follow button) and in the official brand assets.
- **Shared defaults:** the shared pastel theme is untouched for other episodes.

## 11. Educational accuracy
All 14 checks in `qc/computer_types_validation.json` pass. Key points:
- Workstation is shown **inside** the personal/micro group, and the screen says the two are not always separate.
- Minicomputer is labelled as a traditional, historical classification. Modern servers appear as a separate comparison with "Server ไม่ได้หมายถึง Minicomputer เสมอไป".
- Mainframe means high-volume, reliable transactions; Supercomputer means large-scale scientific computation.
- There are no speed rankings, benchmark figures or throughput numbers. Every category gets the same badge or card size. The screen says "Different Workloads / Different Strengths" and the recap footnote says "แบ่งตามลักษณะงาน ไม่ใช่การจัดอันดับความเร็ว".
- The four choices match the approved script exactly, and the correct answer is ข.

## 12. Countdown verification
- Countdown starts at 154.333 s (frame 4630), 1.9 ms after 05_quiz ends.
- Digits 5/4/3/2/1 run for 30 frames each, 150 frames total (frames 4630–4779).
- The narration track is digital silence across the window.
- 06_answer starts at frame 4780. The reveal is at frame 4812.
- 0 of 1,213 frames before the reveal show any answer cue.
- Evidence: `qc/countdown_validation.json` and `qc/countdown_frames.png`, which is grabbed from the MP4.

## 13. Mobile safe-zone results
- 0 at-rest violations of x 220–860 / y 350–1430 across 2,207 sampled moving frames.
- 261 mid-entrance overshoot samples, max 65 px (option slide-in), all within the visible phone area.
- The TikTok, Reels and Shorts overlays don't intersect the critical zone.
- On 375×812, 390×844 and 430×932 fill-to-height playback, video x ≈ 97–983 stays visible.
- The brand header was moved to x 112 / y 184 for this episode so the logo isn't clipped on tall phones.
- Evidence: `qc/safe_zone_report.json` and `qc/mobile_overlays.png`.

## 14. Final MP4
`EP47/output/NaiSibPro_EP47_Five_Types_of_Computers.mp4`:
- 75.2 MB
- 1080×1920, 30 fps constant, H.264 High, yuv420p
- AAC 48 kHz stereo, 192 kbps
- 6,620 frames, 220.67 s
- −14.2 LUFS, −0.4 dBTP

## 15. Re-render command
```bash
shared/tools/build_episode.sh EP47
```

The full build takes about 7–8 minutes with `WORKERS=4`. Then run the QC:

```bash
node EP47/tools/qc_page.js EP47 && python3 EP47/tools/qc_media.py EP47
```

## 16. Known issues
1. **The runtime exceeds 180 s by about 40.7 s.** Narration plus countdown alone is 39.18 s over, and the 1.5 s end-card hold adds the rest. This is the duration conflict described above; it needs shorter narration from the user.
2. The reveal confetti crosses option ข for about 1 s.
3. Phrase anchors came from an offline Whisper transcription used for timing only. A few short interjections, such as 04 at 32.10 s, were not fully legible, but no visual depends on their wording.
