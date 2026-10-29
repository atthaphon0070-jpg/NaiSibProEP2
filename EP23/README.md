# NaiSibPro EP.23: คดีคอมเปิดไม่ติด! ผู้ต้องหาคือใคร? (คอมพิวเตอร์)

**Final video:** `output/NaiSibPro_EP23_PC_Boot_Case.mp4`. It is 1080×1920 (9:16), 30 fps CFR, H.264 High yuv420p, with AAC 48 kHz stereo at 192 kbps. It runs 165.5 s (4,965 frames) and measures −13.6 LUFS integrated with a true peak of −0.1 dBTP.

Rebuild it with:

```bash
shared/tools/build_episode.sh EP23
```

Then run QC:

```bash
python3 EP23/tools/qc_final.py && node EP23/tools/qc_layout.js 0.25 > EP23/qc/layout_check.txt && node EP23/tools/qc_content.js > EP23/qc/content_check.txt
```

## 0. Workspace inspection (done before building)

- **Repository.** The order targets `NaiSibProEP2`. The session started in a different repo (`3D`, the MR BOXER channel), so `NaiSibProEP2` was attached and EP23 was built there. Nothing in `3D` was changed.
- **Stack:** this is not Remotion or React. The repo uses deterministic HTML/CSS/SVG motion graphics driven by `renderAt(t)` (`shared/engine/engine.js`). Headless Chromium (Playwright) captures every frame as a JPEG (`shared/tools/render.js`). Python and NumPy build the audio-first timeline and the mix (`audio_prep.py`, `audio_mix.py`), and FFmpeg encodes the result (`build_episode.sh`).
- **Reusable parts found in `shared/`:**
  - Prompt Thai/Latin fonts (offline woff2).
  - Real logo `brand/logo.png`.
  - Palette tokens.
  - `life()`/easing/`tf()`/`pressDepth` helpers, confetti, the pastel logo wipe, the brand header, the 5 s countdown ring.
  - The SFX cue registry plus the synthesized music bed and UI SFX, and the one-command build.
  - There is no subtitle system; the series uses kinetic captions instead.
- **Branches.** Every episode after EP05 lives on its own branch, not on `main`. They are EP12/EP13 (`claude/amazing-volta-14mxds`), EP14/EP15 (`claude/stoic-hawking-qz988i`), EP19, EP20 and EP22 (`claude/epic-fermat-xi19ia`, the latest).
- **Style references.** EP.12 and EP.14 were found on those branches. Their final MP4s were sampled and used as the style reference, together with EP22. EP12 is a flat 2D office set with kinetic labels. EP14 is navy with spotlight and glow and has a yellow keyword. EP22 is navy with white pills, a yellow keyword at frame 0 and grey quiz cards.
- **Baseline.** The latest episode, EP22, was the structural template: folder layout, `episode.json`, `beats.js`, one module per scene, QC tools, README/HANDOFF/QC_REPORT format and the 9-frame gaps.
- **Base branch.** This branch starts from `main`. It brings in EP22's two backward-compatible shared tool updates byte-for-byte: `"gap"` per segment in `audio_prep.py`, and `music.duck_db` plus the `roller` SFX in `audio_mix.py`. EP22 itself is not on this branch.
- **Conflicts between the order and the repo, and what I chose:**
  1. **Repo layout.** The order lists `audio/, scenes/ or source/, assets/, renders/, qc/`. The repo convention (EP22) is `audio/, source/ (index.html, beats.js, scenes/), output/, renders/ (build dir, git-ignored), qc/, tools/`, so EP23 follows the repo. The order allows this ("match existing episodes").
  2. **Final file location.** The order suggests `EP23/NaiSibPro_EP23_PC_Boot_Case.mp4` "or the repo's naming pattern". The repo puts finals in `EPxx/output/`, so EP23 does too.
  3. **Promo.** The shared `promo.js` shows CTA lines this narration does not say. EP23 has its own promo built only from the 07 transcript, as EP22 did.
  4. **Palette.** The engine background is pastel, but the order asks for a dark navy investigation room. EP23 uses an episode-local navy room (as EP14 and EP22 do) and keeps the series identity: Prompt font, brand header, logo wipe, countdown ring, confetti and pills.

## Timeline (audio-first, measured from the supplied recordings)

| # | Scene | Audio | Start (s) | Length (s) |
|---|---|---|---:|---:|
| 1 | Hook: keyword + PC + finger at frame 0; press, LED flicker, room goes dark, no sound / no picture, crime-scene tape, "ผู้ต้องหา… คือใคร?" | 01_hook.mp3 | 0.000 | 11.233 |
| 2 | Report (walkie-talkie, folder, "คดีด่วน"), box of parts, dark PC "?", lineup wall, 5 suspects walk in on their names, spotlight | 02_story.mp3 | 11.533 | 18.599 |
| 3 | Interrogation of suspects 1–4: file pops on the name, analogy beat, "ขาดไม่ได้" stamp; four stamped files | 03_knowledge.mp3 | 30.433 | 31.478 |
| 4 | Cork board path ⏻ → ⚡ → 🏠 → 🧠 + 🗂️ (✓, POST ✓) → BIOS; memory phrase; spotlight on suspect 5, empty file "?" | 04_explanation.mp3 | 62.233 | 26.514 |
| 5 | Quiz: QUIZ banner + gavel, question line by line, 4 identical grey suspect-photo cards | 05_quiz.mp3 | 89.067 | 17.789 |
| 5b | **Silent countdown 5→1**, exactly 150 frames (3206–3355) | — | 106.867 | 5.000 |
| 6 | Verdict ข้อ ง. ฮาร์ดดิสก์; PC without HDD → BIOS ✓ → "ไม่พบอุปกรณ์สำหรับบูต", OS ✗; filing cabinet analogy; ก ข ค stamped; graphics-card note; memory phrase | 06_answer.mp3 | 111.867 | 36.989 |
| 7 | Case closed ("ปิดคดี"), comment "ฮาร์ดดิสก์ ✓", logo, 10,000+, อัปเดตทุกสัปดาห์, กดติดตาม, next-case folder, logo hold | 07_promotion.mp3 | 149.167 | 15.647 |

There are 9 frames of silence between files, with each start aligned to a frame; the countdown starts on the first frame boundary after 05 ends. The narration is mixed unedited: in the final track it is bit-identical to the decoded source files. Every cue is in `qc/beat_map.md`.

**Optional lines:** both are spoken, so both beats are built.
- 04 "หรือ โพสต์" is spoken, so the label reads "POST ✓".
- The 06 filing-cabinet line is spoken, so the cabinet/house/desk beat is shown.

## Files

| Path | What it is |
|---|---|
| `episode.json` | Segments (9-frame gaps), countdown, output name, minor-key detective music bed (`duck_db: 12`) |
| `audio/` | The 7 approved recordings, byte-identical to the ZIP (only the doubled `.mp3.mp3` extension was dropped, as in EP22) |
| `source/index.html` | Page shell, EP23 colour tokens and styles, scene wiring |
| `source/beats.js` | The beat map as data (file-relative seconds); all animation timing reads from here |
| `source/scenes/common.js` | Absolute timeline, anchors, suspect roster (kind, number, Thai/English name, analogy) |
| `source/scenes/s0_background.js` … `s7_promotion.js` | One module per scene (`s5_quiz_answer.js` holds quiz + countdown + answer because the cards persist) |
| `tools/qc_final.py`, `qc_layout.js`, `qc_content.js` | QC on the final MP4 and on the rendered DOM |
| `qc/` | Durations, beat map, frame 0, contact sheet, measurements, layout/content checks, `QC_REPORT.md` |
| `HANDOFF.md` | Handoff notes |

## Shared additions (earlier episodes unaffected)

- `shared/engine/props_case.js` is new: the reusable **investigation kit**. It has the 5 hardware suspects, PC, monitor screens, case folder, stamps and slam, lineup wall, spotlight, cork board with red string, crime-scene tape and icons. EP03–EP05 do not load it.
- `shared/tools/audio_mix.py` adds new SFX kinds only (`siren`, `gavel`, `beep`, `radio`, `flicker`).
- Verified: EP05's `timeline.json`, `narration.npy` and `mix.wav` are byte-identical between `main`'s tools and this branch's, and the EP03, EP04 and EP05 pages still render without errors.
