# EP.28 Production Handoff — คอมพิวเตอร์เชื่อมต่อกันกี่แบบ? รู้จัก Star, Bus, Ring, Mesh, Tree และ Hybrid

## 1–4. Deliverable
- **Branch:** `claude/optimistic-bell-fv856d`
- **MP4:** `EP28/output/NaiSibPro_EP28_Network_Topology.mp4` (97.3 MB)
- **Duration:** 360.700 s (10,821 frames @ 30 fps)

## 5. Narration (original ElevenLabs files, unaltered)
| # | File (ZIP name `*.mp3.mp3`) | Role | Duration | Starts at |
|---|---|---|---:|---:|
| 1 | `audio/01_hook.mp3` | Hook | 34.429 s | 0.000 |
| 2 | `audio/02_story.mp3` | Story | 51.722 s | 34.429 |
| 3 | `audio/03_knowledge.mp3` | Knowledge: 4 topologies | 68.911 s | 86.152 |
| 4 | `audio/04_explanation.mp3` | Tree, Hybrid, P2P, memory | 69.251 s | 155.063 |
| 5 | `audio/05_quiz.mp3` | Quiz | 33.567 s | 224.314 |
| — | silent countdown | 5 → 1 | 5.000 s | 257.900 (frames 7737–7886) |
| 6 | `audio/06_answer.mp3` | Answer | 67.239 s | 262.900 |
| 7 | `audio/07_promotion.mp3` | Promotion | 28.761 s | 330.139 (+1.8 s end-card hold) |

- The files are md5-identical to the ZIP; only the doubled extension was dropped.
- Voice gain is 1.0, with no speed change, trimming, re-voicing or TTS.
- Music ducks 6 dB under the voice; SFX are synthesized.
- A uniform +2 dB master gain and a −1 dBFS limiter apply to the whole mix.

**How timing was found:** each file was split at its pauses (20 ms RMS at −38 dBFS). Every chunk was then transcribed offline (Whisper large-v3-turbo through sherpa-onnx; model downloaded from the sherpa-onnx GitHub release) and matched to the approved script. The transcript chunks are kept in `qc/transcript_chunks.json`; the full beat map is in `qc/beat_map.md` and `source/beats.js`.

**Where the recordings differ from the written storyboard (the recordings were followed):**
- **Hook:** adds "ผลลัพธ์จะเหมือนเดิมไหม?" and "ใครเตรียมสอบนายสิบต้องแยกให้ออกครับ".
- **Story:** adds "ทำไมถึงเป็นอย่างนั้น?" and "แต่นี่เป็นเพียงหนึ่งในรูปแบบที่เราต้องรู้".
- **Knowledge:** gives a spoken failure explanation for each type. The bus and ring failures are phrased as "อาจ…" (may), so they are shown with warning markers rather than hard failures.
- **Hybrid example:** the narration says "นำเครือข่ายแบบดาวหลายกลุ่ม มาเชื่อมต่อกันผ่านโครงสร้างอีกแบบหนึ่ง". It is drawn as **two star groups joined by a bus backbone (star–bus hybrid)** instead of the storyboard's star + ring.
- **Quiz:** the file reads all four options and "ให้เวลาคิดห้าวินาที" but has **no spoken count**, so the 5.000 s silent countdown follows the file.

No educational contradictions were found.

## 6. Production timeline (scenes)
1. **Hook (0–34.4 s, navy).**
   - Frame 0: "เตรียมสอบนายสิบ", a live 5-PC star with packets, and "สวิตช์เสียตัวเดียว ทำไมทั้งห้องติดต่อกันไม่ได้?".
   - PCs highlight in turn, then the switch, with "5 COMPUTERS / 1 SWITCH".
   - The switch faults, its links go dead, and all five PCs show offline. A push toward the switch with "เสียตัวเดียว กระทบทั้งเครือข่าย?".
   - The spokes withdraw and the nodes glide into a ring, then mesh links are added with "ผลลัพธ์จะเหมือนเดิมไหม?".
   - Ends on the NETWORK TOPOLOGY title, the 6-type icon row, and "ต้องแยกให้ออก!".
2. **Story (34.4–86.2 s).**
   - A light 2D office with officer and desks. The desk monitors sit exactly on the star layout, so the room can fade into the navy diagram without moving any computer.
   - Cables are plugged in, then a file goes PC1 → switch → PC4.
   - PC3's cable unplugs: red break, PC3 offline. PC1/2/4/5 keep exchanging packets through the switch, with "→ กระทบเฉพาะเครื่องนั้น".
   - PC3 is re-plugged, then the switch fails and all five lose the switch.
   - "ทำไม?" leads to STAR TOPOLOGY, shown with star rays around the switch.
3. **Knowledge (86.2–155.1 s).** "จัดวาง + เชื่อมต่อ", then four type cards. **One network morphs Star → Bus → Ring → Mesh**, keeping PC1–PC5:
   - **Star:** PC2 cable cut, others still work; centre fails and every PC is hit. Memo: STAR = มีศูนย์กลาง.
   - **Bus:** spokes withdraw, then a yellow backbone with terminators and drops; packets run along the backbone. A T2–T3 break stops a packet at the break, with warnings. Memo: BUS = สายหลักร่วมกัน.
   - **Ring:** five links drawn one by one, closing the loop. PC1's two neighbours are tagged. A clockwise packet runs until the PC3–PC4 break, labelled "วงแหวนพื้นฐาน (วงเดียว)". Memo: RING = เชื่อมเป็นวง.
   - **Full mesh (10 links, labelled):** three real routes PC1 → PC3. PC1–PC3 breaks, then a green reroute PC1 → PC2 → PC3. Memo: MESH = หลายเส้นทาง.
   - Ends with a 2 × 2 review of live mini diagrams.
4. **Explanation (155.1–224.3 s, pink with a navy panel).**
   - "+2 แบบ".
   - **Tree** grows level by level (root → SW1/SW2 → PC1–4) with packets going down. It mirrors into a real tree (trunk, big limbs, twigs, leaves) on ลำต้น / กิ่งใหญ่ / กิ่งเล็ก, then mirrors back.
   - **Hybrid:** star + bus formula, then star groups A and B joined by a bus backbone, with a packet A1 → SA → T1 → T2 → SB → B3.
   - **Point-to-point:** two nodes, one direct link.
   - **Six memory beats:** the diagram morphs exactly on each spoken name.
   - Exam paper with the narrated question types, "จำภาพได้ = ตอบได้ทันที!", then the quiz.
5. **Quiz (224.3–257.9 s).**
   - เตรียมสอบนายสิบ / วิชาคอมพิวเตอร์ header.
   - The question appears line by line with "อุปกรณ์ศูนย์กลาง" highlighted.
   - A neutral central-device diagram labelled "อุปกรณ์ศูนย์กลาง Hub / Switch" (no "Star").
   - Four identical cards ก Bus / ข Star / ค Ring / ง Mesh, each on its spoken letter, then "ให้เวลาคิด 5 วินาที".
6. **Countdown (257.9–262.9 s).** Ring plus numerals 5 → 1, 30 frames each, ticks only. Then "หมดเวลา!" with nothing highlighted.
7. **Answer (262.9–330.1 s).**
   - "เฉลย!", then on "ข้อ ข." card ข turns green with a check while the others dim, and confetti. Banner "ข. STAR TOPOLOGY แบบดาว".
   - Star recap with HUB / SWITCH, then the office flashback.
   - PC3 cut while the rest still talk; switch fails with "ศูนย์กลางเสีย → การสื่อสารผ่านศูนย์กลางหยุด"; then "จุดสำคัญ = ศูนย์กลาง".
   - ก BUS, ค RING and ง MESH, each shown with its own correct diagram.
   - Four clue → name beats, then the summary list STAR / BUS / RING / MESH.
8. **Promo (330.1–360.7 s).**
   - "ตอบ ข. ถูกไหม?" with generic comment bubbles.
   - Six-type recall grid.
   - Real logo plus NaiSibPro / นายสิบโปร.
   - 10,000+ ข้อสอบ and อัปเดตทุกสัปดาห์.
   - Subject tiles (คอมพิวเตอร์, กฎหมาย, คณิตศาสตร์, ภาษาไทย, วิชาอื่น ๆ) on their spoken words.
   - Like / share / follow pressed → "ติดตามแล้ว".
   - End card. Only the narrated claims are used: no prices, links or packages.

## 7. Reused components
- `shared/engine/engine.js` + `engine.css`: `renderAt(t)`, easing, `life()`, brand header, wipes, countdown ring, confetti and the SFX registry.
- `props_story.js`: officer rig, look A.
- Brand logo, mascot cut-outs and Prompt fonts.
- `audio_prep.py`, `audio_mix.py`, `render.js` and `build_episode.sh`.
- The navy circuit background follows EP.20 (binary).

## 8. New components
- **`EP28/source/topology.js`.** Graph core, also runnable in Node:
  - Layouts for star, bus (terminators, taps, drops), ring, full or partial mesh, tree, star–bus hybrid and point-to-point.
  - BFS paths and per-type validators.
  - An SVG view with computer and switch icons, link states (draw-in, hot, dim, red-dead, broken with gap / spark / ✕, green), node states (on, offline ✕, warning, OK ✓, glow), packets (incl. file), camera and graph morphs.
- `EP28/source/scenes/*`: office set, glyph icons, caption, header and memo system.
- **Shared, additive:**
  - `audio_mix.py` gains SFX `packet`, `plug`, `unplug`, `fault`, `warn`, `down`, `restore` and `build`.
  - It also gains the opt-in `music.duck_db` voice duck (same behaviour as EP.22's). It is off unless an episode sets it, so earlier episodes mix exactly as before.

## 9–12. Validation
See `qc/QC_REPORT.md`.
- Topology: 7/7 structures, 14/14 scenarios, 8/8 negatives rejected, 0 packet violations and 0 label mismatches.
- Safe zone: 0 unresolved over 3,607 samples.
- Phone and overlay sims: pass.
- Countdown: 150 frames (7737–7886), narration-free, answer voice at 262.945 s.

## 13. Export
H.264 High (CRF 17, preset slow, yuv420p, level 4.2), 30 fps CFR, AAC-LC 192 kb/s at 48 kHz stereo, faststart. −13.0 LUFS, −0.6 dBFS true peak.

## 14. Build
```bash
shared/tools/build_episode.sh EP28
```
QC (from the repo root):
```bash
node EP28/tools/qc_frames.js 0.1 && node EP28/tools/qc_topology.js && EP28/tools/qc_video.sh
```
The full render takes about 25 min with 4 workers.

## 15. Known issues
- Word-level sync is from transcribed pause-chunks, not forced alignment. Please do one listening pass, especially the quiz option letters (ก. at 12.34 s in the quiz file) and the six memory beats (198.8–212.8 s).
- The phone UI overlays are approximations of TikTok / Reels / Shorts, not real captures.
- During the final build, a second accidental build run deleted 809 early frames. Those exact frame ranges were re-rendered from the same source, and the MP4 was encoded with the build script's ffmpeg settings.
