# EP43 HANDOFF — NaiSibPro EP.43 "From Bit to Quettabyte"

## 1. Episode at a glance
| Item | Value |
|---|---|
| Episode | NaiSibPro EP.43 — From Bit to Quettabyte · เรียงหน่วยข้อมูลจากเล็กไปใหญ่ · หน่วยไหนใหญ่กว่า Yottabyte? |
| Branch | `claude/gifted-knuth-hkgpas` (repo `atthaphon0070-jpg/NaiSibProEP2`) |
| Final MP4 | `EP43/output/NaiSibPro_EP43_Bit_to_Quettabyte.mp4` |
| Re-render | `shared/tools/build_episode.sh EP43` |

**Source files:** `EP43/source/` (`index.html`, `scenes.js`, `data_ladder.js`, `units.js`, `beats.js`) and `EP43/episode.json`.
Previous episodes were not modified.

**Shared change:** `shared/tools/audio_mix.py` gained opt-in options. Existing episodes don't set them, so their output is unchanged:
- `music.style: "tech"`, `music.duck`, `music.automation`
- six new SFX kinds: `blip`, `bit`, `lock`, `rise`, `reveal`, `boom`

## 2. Narration
Files: `EP43/audio/01_hook.mp3` … `07_promotion.mp3`. They are the original recordings, unmodified, in the brief's order. Durations, start times and md5s are in `qc/audio_durations.txt`.

| File | Duration (s) |
|---|---:|
| 01_hook | 25.966 |
| 02_story | 23.327 |
| 03_knowledge | 27.794 |
| 04_explanation | 28.839 |
| 05_quiz | 32.993 |
| 06_answer | 30.119 |
| 07_promotion | 19.801 |
| **Narration total** | **188.839** |

**Total runtime: 194.853 s.** That is narration + 5.000 s countdown + 0.014 s frame alignment + 1.0 s end hold. It **exceeds the 180 s maximum**: the narration plus the countdown alone is 193.84 s. Nothing was cut or sped up. The conflict is reported in `qc/QC_REPORT.md`.

## 3. Scene timeline
See `README.md` for the scene table and `qc/beat_map.md` for every phrase → frame → visual beat.

Beat timing comes from the RMS phrase boundaries of each MP3 plus a local Whisper-small pass. That pass was used only to read when words are spoken; it generated no audio. One phrase in 04 (≈10.4–13.7 s, "แต่ละระดับใหญ่กว่า…") could not be transcribed. The ×1,000 card is timed to its measured phrase start.

## 4. Data Size Tower (`source/data_ladder.js`)
- **Structure:** 13 holographic disc platforms on a vertical world axis, 460 px apart: bit → nibble → Byte → kB … YB → RB → QB. The spacing is a schematic ranking, not proportional volume.
- **Platform contents:** each platform carries:
  - an icon (Phase B uses a document, photo, video and drive; Phase C uses a rack, racks, a network and a cube)
  - the large symbol
  - the English and Thai names
  - the exact value
- **States:** a hidden "?" silhouette state, an active glow, and travelling light pulses on the side struts.
- **Camera:** `TOWER.camera(KF, t)` takes eased keyframes (`f` focus level, `z` zoom, `fy` screen y). It drives the elevator rises, the YB hold, the recap pull-back and the 2022 reveal framing.
- **Instances:** one in the hook (01D/01E) and one persistent instance through scenes 3–4.

## 5. Accuracy
`qc/unit_validation.json`: all 24 checks pass.
- **Decimal only:** the ladder uses decimal SI prefixes only (kB with a lowercase k; 1 kB = 1,000 B). No 1,024 values appear anywhere.
- **Bit groupings:** bit → nibble → Byte is shown as 4 / 8 bits and is labelled on screen as not a ×1,000 step.
- **Ronna and Quetta:** R = 10²⁷ and Q = 10³⁰, credited on screen to BIPM CGPM 27 (2022), Resolution 3.
- **Quettabyte wording:** described as "คำนำหน้า SI ขนาดใหญ่ที่สุดที่รับรองในปัจจุบัน", with a disclaimer that it is not a maximum possible file size.
- **Hook teaser:** uses the brief's simplified BIT/BYTE/KB chain. The formal ladder uses kB.

## 6. Countdown
`qc/countdown_validation.json`:
- Frames 4168–4317: 150 frames at 30 per numeral, frame-aligned, one instance, no narration.
- The first answer highlight is at 145.000 s, after the countdown ends at 143.933 s.

## 7. Safe zone
`qc/safe_zone_report.json`: **PASS**.
- 1,949 samples, every 0.1 s including all transitions.
- 0 critical boxes outside X 220–860 / Y 350–1430.
- 0 collisions with the approximate TikTok, Reels and Shorts overlays.
- Device crops checked at 375×812, 390×844 and 430×932.

## 8. Blue Dominant theme
| Colour | Hex | Used for |
|---|---|---|
| Navy | #142B53 / #0B1A36 | Backgrounds |
| Electric blue | #2F6BFF | Platforms and chips |
| Cyan | #22D3EE | Glow, rings and lines |
| Light blue | #95BFEF | Secondary text |
| Ice blue | #E6F4FF | Main text |
| Yellow | #FFD23F | Values and maths |
| Green | #22C55E | Answer only |
| Red | #EF4444 | Warnings |

Pink appears only in the original logo artwork and one comment avatar. The logo was not recoloured.

The music is a synthesized futuristic bed: detuned pad, 16th-note arpeggio and soft kick. It ducks 7 dB under the voice, softens during the explanations and quiz, and lifts during the tower climbs.

## 9. Known limitations
1. **Runtime over the cap.** The video is 194.85 s, over the 180 s maximum and the 2:30–2:55 target, because the supplied narration is 188.8 s. Fixing this needs shorter source recordings.
2. **Small exponents.** The smallest settled glyphs are the superscript exponents in the tower value lines: 13.7 px, about 6 pt on a 390-wide phone. The main symbols and values are far larger.
3. **Approximate timing transcription.** Whisper-small Thai transcription is approximate. The visual sync uses the measured phrase onsets, not the wording.
4. **Synthesized audio bed.** The music and SFX are synthesized in-repo; there are no licensed stems.
5. **Unofficial overlay zones.** The overlay checks use approximate per-app UI zones, not official specs.
