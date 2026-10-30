# EP.27 Production Handoff — จดหมาย 500 ฉบับ ไม่ต้องพิมพ์ชื่อทีละคน! (Mail Merge / จดหมายเวียน)

## 1. Deliverable
`EP27/output/NaiSibPro_EP27_Mail_Merge.mp4` (87.9 MB)

| | |
|---|---|
| Duration | 291.87 s (4:51.9), 8,756 frames |
| Video | 1080 × 1920 (9:16), 30 fps constant, H.264 High, yuv420p, CRF 17 |
| Audio | AAC-LC 48 kHz stereo, −12.5 LUFS integrated, −0.4 dBFS true peak |
| Decode / black frames | clean / none |

## 2. Branch and source
- Branch `claude/fervent-hamilton-xsc1j4`. The episode folder is `EP27/`; see `EP27/README.md` for the file list.
- Studied before building:
  - EP.26 (`claude/tender-tesla-ou33xx`): office story kit, quiz layout, promo.
  - EP.25 (`claude/relaxed-maxwell-9pdb4w`)
  - EP.20 binary (`claude/peaceful-maxwell-ixkf9r`): navy / cyan / yellow palette, `beats.js` timing pattern, safe-zone checker idea.
  - Shared engine on `main`.
- Shared changes, all additive and backward compatible, brought onto this branch because EP.27 uses them:
  - EP.26's rig looks `K` and `H` plus the `printer` SFX (identical to that branch);
  - EP.20's `"silence"` segment type in `audio_prep.py` (identical to that branch).
- Episodes EP.02–EP.26 are untouched.

## 3–5. Narration and timeline
| # | File | Role | Measured | Starts |
|---|---|---|---:|---:|
| 1 | `audio/01_hook.mp3` | Hook | 28.186 s | 0.000 |
| 2 | `audio/02_story.mp3` | Story | 40.673 s | 28.536 |
| 3 | `audio/03_common_mistake.mp3` | Common mistake → Mail Merge | 51.487 s | 69.559 |
| 4 | `audio/04_explanation.mp3` | Steps in Word | 54.988 s | 121.396 |
| 5 | `audio/05_quiz.mp3` | Quiz | 27.011 s | 176.734 |
| — | silent countdown | 5 → 1 | 5.000 s (150 frames) | 203.767 (frame 6113) |
| 6 | `audio/06_answer.mp3` | Answer | 55.719 s | 208.767 (frame 6263) |
| 7 | `audio/07_promotion.mp3` | Promotion | 25.234 s | 264.836 (+1.8 s end-card hold) |

- The files come from the ZIP as `*.mp3.mp3` and are byte-identical; only the extension was fixed. Each file is 44.1 kHz mono MP3.
- Narration is untouched: no TTS, trims, speed change or re-ordering. A 0.35 s gap separates scenes.

**Timing method:** the model hosts for Whisper are blocked here, but a Whisper-small CTranslate2 model was available on the npm registry (checksum verified). I used it with faster-whisper only to transcribe for timing: word timestamps, plus a second pass on each pause-delimited phrase. Combined with a 10 ms pause map, this gave the spoken phrase start used for every beat in `source/beats.js`. The full table, with absolute times and frame numbers, is in `qc/beat_map.md`.

**Narration vs. script (nothing altered, for your information):**
- 05 has no separate spoken countdown or silence. It ends right after “ให้เวลาคิด 5 วินาที” (plus 0.2 s of room tone), so the silent 150-frame countdown follows the file.
- 06 adds “Find & Replace … จึงไม่ใช่คำตอบที่เหมาะสมที่สุดสำหรับโจทย์นี้”. This is visualised as an amber “ไม่ตรงโจทย์” tag, not as “wrong”.
- 07 says “สำหรับเตรียมสอบนายสิบตำรวจ”, shown as a chip. It names คอมพิวเตอร์ / กฎหมาย / คณิตศาสตร์ / ภาษาไทย / และอีกหลายวิชา, shown as five tiles.
- No content conflicts with the approved answer **ข. Mail Merge**.

## 6–7. Components
**Reused:**
- `engine.js` / `engine.css`: `renderAt` loop, brand header (restyled as a centred pill), wipes (recoloured navy / pink), confetti, SFX registry, `pressDepth`, icons.
- `props_story.js` character rig: looks K (officer) and H (supervisor), with expressions, sweat, walk cycle and blinks.
- The official `logo.png` and the mascot cut-outs.
- `audio_prep.py`, `audio_mix.py` and `build_episode.sh`.

**New, in `EP27/source/mm_props.js` (reusable for future Word/Excel lessons):**
- `MM.word()`: Word window with tabs, a Mailings ribbon holding the five commands, ring highlights and presses, dropdown menus, the main-document page with typed body, «merge fields», values with pop, and a recipient preview navigator.
- `MM.sheet()`: Excel-style recipient table with row highlight and cell anchors.
- `MM.letter()`: letter whose body stays the same while the name and address slots switch between blank, field, value and typed.
- `MM.stack()`: instanced paper stack, about 20 elements rather than hundreds.
- `MM.link()`: draw-on connector with a travelling data dot.
- `MM.office(theme)`: night/day office with parallax camera, typing keyboard, clock, calendar and printer.
- `MM.monitor()` and icons.

**New, in `EP27/source/index.html`:**
- Blue × Pink Fusion navy layer: grid, glows and data particles, cross-faded per beat, with a cyan → pink light sweep at each dark/light change.
- The `mergeDemo` sequence (template + table → three personalised letters), used in scenes 3 and 7.
- A compact quiz layout and an exact 150-frame countdown ring.
- An auto-fit step that runs after fonts load and shrinks over-wide one-line text, deterministically.

**Scenes:**
1. Hook (navy office, 500 already on frame 0, 1→10→100→500, same-body letters, typing pain, hidden tool, “?”).
2. Story (supervisor drops 500 files, manual typing 1/500 → 10/500, 490 left, freeze, right tool).
3. Copy-paste vs Find & Replace → **MAIL MERGE / จดหมายเวียน** reveal → template + Excel rows → letters → 500.
4. Six Mailings steps with cursor and clicks → WORD + EXCEL → MAIL MERGE → personalised letters → other data sources.
5. Quiz.
6. Countdown.
7. Answer, then the merge again, 1 TEMPLATE + 500 RECIPIENTS → 500 letters, the three distractors, and the memory hook.
8. Promo with comment, logo + app demo, 10,000+, subjects, like / share / follow, and the end card.

## 8. Commands
```bash
shared/tools/build_episode.sh EP27
```

```bash
EP27/tools/qc_safe.sh
```

```bash
node EP27/tools/qc_dom.js > EP27/qc/dom_checks.txt
```

```bash
EP27/tools/qc_video.sh
```

```bash
python3 EP27/tools/mobile_preview.py EP27/output/NaiSibPro_EP27_Mail_Merge.mp4
```

With 4 workers, the full build takes about 10 minutes and the QC set about 2 minutes.

## 12–14. Validation summary (full details in `qc/QC_REPORT.md`)
- **Safe zone (220–860 × 350–1430):** all 8,757 frames checked, every active critical element measured; **0 violations**. Critical content extent: 220.6–859.4 × 350.6–1391.5.
- **Device and platform simulation** (4 phones × cover/fit × TikTok/Reels/Shorts-style overlays, glyph-level): **0 hits**. An earlier pass found 95, all fixed by recomposing the layout rather than shrinking text.
- **Mobile previews** (`qc/mobile_preview_*.png`) were built from the MP4 and inspected by eye. All key text is centred and readable.
- **Quiz:** exact question and choices. The countdown is exactly 150 frames (6113–6262) with no narration. There are no early hints, and the choices stay identical until the reveal on “ข้อ ข.”.
- **First frame:** “เตรียมสอบนายสิบ” is fully visible on frame 0 of the MP4.

## 15. Open items
- Please do one listening pass. Sync comes from a machine transcript, so a short Thai word inside a long phrase could land a few frames off. Every beat is a single number in `source/beats.js`, so it can be nudged without touching scene code.
- The brand header pill (y ≈ 222–300) sits above the safe zone by design. It is non-essential, and platform top bars may cover it.
- The mascot art is the existing 3D-rendered brand cut-out, used as a 2D presenter only.
