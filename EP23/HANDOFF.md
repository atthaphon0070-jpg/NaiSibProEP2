# EP23 handoff

| | |
|---|---|
| Episode | NaiSibPro EP.23 |
| Subject | คอมพิวเตอร์ (Computer) |
| Topic | Minimum hardware to power on and reach the BIOS: "คดีคอมเปิดไม่ติด! ผู้ต้องหาคือใคร?" Five hardware suspects; PSU ⚡ / Mainboard 🏠 / CPU 🧠 / RAM 🗂️ are essential (POST); the Hard Disk 🗄️ is not needed to reach the BIOS but is needed to load the OS |
| Memory phrase | ไฟ บ้าน สมอง โต๊ะ — ขาดตัวไหน ไม่ติด! |
| Quiz | อุปกรณ์ใดต่อไปนี้ ถ้าไม่มี คอมพิวเตอร์ยังเปิดติด และเข้าหน้าไบออสได้: ก. ซีพียู / ข. แรม / ค. พาวเวอร์ซัพพลาย / ง. ฮาร์ดดิสก์ |
| Answer | **ข้อ ง. ฮาร์ดดิสก์** |
| Final file | `EP23/output/NaiSibPro_EP23_PC_Boot_Case.mp4` (165.5 s, 1080×1920, 30 fps CFR, H.264 High + AAC 48 kHz stereo 192 kbps) |
| Re-render | `shared/tools/build_episode.sh EP23` (about 8 min with `WORKERS=4` on 4 cores) |
| QC | `python3 EP23/tools/qc_final.py`, `node EP23/tools/qc_layout.js 0.25`, `node EP23/tools/qc_content.js` → `EP23/qc/` |
| Branch | `claude/pensive-euler-7gu8hj` in `NaiSibProEP2` (based on `main`, like the other episode branches) |

**New series rule:** the opening keyword is now **"เตรียมสอบนายสิบตำรวจ"**, including ตำรวจ. It is on screen, fully visible, at frame 0, and nothing covers or dims it during the hook.

## Audio files

All 7 files are present, real, non-silent (mean −15 to −18 dB) and unique: none has the same git blob as any MP3 on any branch of this repo.

| File | Duration (s) | Start in video (s) | Start frame |
|---|---:|---:|---:|
| 01_hook.mp3 | 11.233 | 0.000 | 0 |
| 02_story.mp3 | 18.599 | 11.533 | 346 |
| 03_knowledge.mp3 | 31.478 | 30.433 | 913 |
| 04_explanation.mp3 | 26.514 | 62.233 | 1867 |
| 05_quiz.mp3 | 17.789 | 89.067 | 2672 |
| (countdown, silent) | 5.000 | 106.867 | 3206 |
| 06_answer.mp3 | 36.989 | 111.867 | 3356 |
| 07_promotion.mp3 | 15.647 | 149.167 | 4475 |

The ZIP files were named `NN_name.mp3.mp3`; they were copied byte-identically as `NN_name.mp3`. Each phrase was transcribed with a local Whisper-small recogniser (sherpa-onnx, used for checking only) and matches the approved transcripts.

**Optional lines:**
- **04 "หรือ โพสต์": present** (11.26–12.28 s file time). The label shows "การตรวจตอนเปิดเครื่อง", then "POST ✓".
- **06 "ฮาร์ดดิสก์จึงเหมือนตู้เก็บเอกสาร ไม่มีตู้ ก็ยังเข้าบ้านได้ แต่ไม่มีงานให้ทำ": present** (13.19–19.16 s). The beat is built: 🗄️ cabinet → it disappears with ✗ "ไม่มีตู้" → 🏠 door opens "ก็ยังเข้าบ้านได้" → empty desk "แต่ไม่มีงานให้ทำ".

## Stack

The repo's own HTML/CSS/SVG `renderAt(t)` engine renders frames in headless Chromium (Playwright). Python builds the timeline and the mix, and FFmpeg encodes. It is 2D only.

## Reused vs new

**Reused from `shared/`:**
- Engine helpers (`life`, easing, `tf`, `pressDepth`, `bob`), Prompt fonts, the real logo, brand header and series logo wipe.
- The 5 s countdown ring (neutral colours) and confetti.
- `ICON` hand / heart / calendar / check.
- Music bed generator, UI SFX and the build and render scripts.
- From EP22: the episode structure, the QC tools (adapted) and the shared tool updates (`gap`, `duck_db`).

**New, shared (`shared/engine/props_case.js`), reusable for future "investigation" episodes:**
- **Suspect lineup:** `CASE.suspect(kind, {num})` for psu / mb / cpu / ram / hdd. Generic hardware shapes with dot eyes and a small mouth, a number card 1–5, walk cycle, blink, nervous wobble with a sweat drop, and a surprised mouth. Also `CASE.lineupWall` and `CASE.spotlight` (cone + floor pool + dust, swingable).
- **Case folder + stamp:** `CASE.folder` (kraft folder; standard or `wide` layout; reserved stamp zone so stamps never cover text), `CASE.stamp` (red / green / yellow), and `CASE.slam` (2.1× → 1× drop, ≤ 6 px shake for ≤ 8 frames).
- **Evidence board:** `CASE.board` (cork board, pinned cards, red-string draw-on with a travelling light pulse).
- **Hardware props:** `CASE.pc` (power button press, LED, empty drive bay highlight, interior glow) and `CASE.monitor` (standby / generic BIOS / "ไม่พบอุปกรณ์สำหรับบูต" / picture / flash).
- **Other:** `CASE.tape` and `CASE.ICON`: bolt, house, brain, desk, cabinet, gpu, speaker, screen, generic program window, walkie, gavel, block, power, comment, box, check, cross.
- **No real brand names or logos.** The BIOS screen shows only "BIOS SETUP / Main Advanced Boot Exit / System Time / CPU [OK] / Memory [OK]". The OS icon is a generic program window, not a Windows logo.

**New, shared tools:** `audio_mix.py` gains the `siren`, `gavel`, `beep`, `radio` and `flicker` SFX (new kinds only).

**Backward compatibility, verified:**
- EP05's `timeline.json`, `narration.npy` and `mix.wav` are byte-identical between `main`'s tools and this branch's.
- EP03, EP04 and EP05 pages still render without errors.
- EP03 on `main` is missing `audio/07_promotion.mp3` (pre-existing), so it was checked in `--allow-missing` mode.

**New, episode:** the background investigation room, scene modules s1–s7, the beat map and the QC tools.

## QC summary

All items pass; details are in `qc/QC_REPORT.md`. Key numbers:
- Frame 0: keyword "เตรียมสอบนายสิบตำรวจ" fully visible.
- No black frames.
- Countdown: frames 3206–3355, narration peak inside = 0; 06 starts at frame 3356.
- Narration bit-exact in the track.
- Content check: 0 violations (stamps only on PSU/MB/CPU/RAM, no early verdict, identical cards, no brand names).
- Layout check: 0 overlaps; 11 transient safe-zone hits, all on moving elements.
- Longest near-static stretch 1.87 s.
- Loudness −13.6 LUFS, true peak −0.1 dBTP; bed a median 24.5 dB under the voice.

## Known issues

- **Word-level onsets.** Words inside a phrase (for example ไฟ / บ้าน / สมอง / โต๊ะ, the suspect names inside sentences, and ปี๊บ) come from syllable-nucleus dips on the energy envelope, matched to the transcript. Phrase starts are exact to the 20 ms window; in-phrase words are estimated at ±2–3 frames.
- **Layout checker.** It reports transient safe-zone hits only on moving elements: interrogation folders sliding off-screen at each suspect change, the Hard Disk folder during its pop-in, and the promo folder flipping during the scene wipe. It reports 0 text overlaps.
- **"Low-res preview."** As in EP22, the preview step was a full-resolution preview build (`build_episode.sh EP23 --preview` → `renders/preview.mp4`), because the shared renderer captures at 1080×1920 only. It was checked for frame 0, sync, the no-early-verdict rule, the countdown and overlaps before the final build.
- **Desk-leg fix.** One art bug found in the first final render (the hook desk's second leg was missing) was fixed and the final was re-rendered.

## Deviations (with reasons)

1. **Repository.** The session opened in the `3D` (MR BOXER) repo. The order names `NaiSibProEP2`, so that repo was attached and used, and `3D` was not touched. Work is on the branch `claude/pensive-euler-7gu8hj`, following the one-branch-per-episode pattern of EP12–EP22.
2. **Folder layout and final path follow the repo convention.** Finals go in `output/` and sources in `source/`. The order allows matching existing episodes.
3. **Navy room instead of the pastel engine background.** The order asks for it, and EP14 and EP22 do the same.
4. **Custom promo** instead of `shared/engine/promo.js`, because only approved CTA text may appear.
5. **Loudness.** The order says about −16 LUFS or match previous episodes. This matches the series (EP22 −13.9, EP05 −14.2) at −13.6 LUFS with no mastering gain; the voice is untouched at gain 1.0.
6. **Graphics-card note.** It is a note box across the lower third rather than a tiny corner icon. The label "ถ้าซีพียูไม่มีกราฟิกในตัว" must stay ≥ 42 px inside the safe zone, and the essential-parts cards occupy the upper area at that moment.
7. **Hook keyword size.** It is 110 px (the order's minimum), in two lines. At larger sizes "นายสิบตำรวจ" would leave the X 190–870 safe zone.
8. **Choice cards in 06 "ส่วนซีพียู แรม…".** The red "ขาดไม่ได้" stamp sits in the lower-right of each card, and the English sub-line fades out so the stamp never covers text. The red ✗ sits on the photo corner.
