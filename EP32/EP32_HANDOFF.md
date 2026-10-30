# EP.32 handoff — ลำดับศักดิ์ของกฎหมายไทย (Thai Law Hierarchy)

> **Status:** rendered and validated. **One release requirement is not met:** the video runs **297.6 s**, against a limit of 240 s.
> The cause is the input audio. The seven supplied recordings already total 291.4 s before anything else is added. Details are in section 6.

## 1. Episode
NaiSibPro EP.32 · วิชากฎหมาย · ลำดับศักดิ์ของกฎหมายไทย — กฎหมายไหนอยู่สูงกว่ากัน?

The exam trap is that พ.ร.บ. and พ.ร.ก. have equivalent legal force. The answer is **ค. พระราชกำหนด**.

## 2. Branch
`claude/ecstatic-edison-ayag6v`. EP.01–EP.31 were not touched. This repository holds EP02–EP05; the episodes in between live elsewhere.

## 3. Source files
| Path | Purpose |
|---|---|
| `EP32/episode.json` | Segment order, the 5 s countdown, music, `"crf": 20` |
| `EP32/source/index.html` | All 8 scenes, beat timings, SFX cues, and the QC hook `QC_BOXES()` |
| `EP32/source/hierarchy.js` | **New** reusable pyramid component |
| `EP32/qc/qc_safezone.js`, `EP32/qc/qc_countdown.js` | **New** automated QC scripts |
| `EP32/qc/*` | Reports and preview images |

The brief suggested `scenes.js`, `legal_props.js` and `beats.js`. Following the EP03–EP05 convention, scenes and beats are kept together in `index.html` instead.

## 4. Audio (byte-identical to the ZIP; only the `.mp3.mp3` extension was fixed)
| File | Duration (s) | SHA-256 |
|---|---:|---|
| 01_hook.mp3 | 28.917 | `df71a1886b2bc19bae1d62f3643499d8aa703a18da8ebf0d0ee0c95ff846c14f` |
| 02_story.mp3 | 42.762 | `d1ce51d14e31d1cc22c3e4c35d171d4a9b840489512ba37eac75ea6dd072184e` |
| 03_knowledge.mp3 | 65.802 | `c23f7746a57d888b7d40b219fe1d3c615ec5cc5ba5922dbbbf5f8ae1befc8918` |
| 04_explanation.mp3 | 54.204 | `f443c00dc5995e4ed5037b564cc6e2ee58a30e55b0a009ddffd32d2c40fcced8` |
| 05_quiz.mp3 | 24.268 | `02069dab65a63c86422af2d5486b63194abc6bfd51d923b1700c4acfcee471e8` |
| 06_answer.mp3 | 56.686 | `240fedd7f6b11c00ec287fb50464b78c22bf2d19c6f25c937a4b54e16c37c16b` |
| 07_promotion.mp3 | 18.756 | `e11af4df4d45698d3041eaa76c4a3a769c520ae0b8cfe54e1a7a88e208733a6a` |

All files are MP3, 44.1 kHz mono, 128 kbps. None failed to decode. These hashes match the files inside the supplied ZIP.

## 5. Final video
- Path: `EP32/output/NaiSibPro_EP32_Thai_Law_Hierarchy.mp4` (68.1 MB).
- **297.608 s**, 8,928 frames.
- H.264 High, yuv420p, 1080×1920, constant 30 fps.
- AAC-LC 48 kHz stereo, −14.6 LUFS.
- A full decode reports 0 errors.

## 6. Duration — the blocker
| | Seconds |
|---|---:|
| Narration (7 files, unmodified) | 291.396 |
| Countdown | 5.000 |
| Frame alignment before the countdown | 0.012 |
| End-card hold | 1.200 |
| **Total** | **297.608** |
| Minimum possible (narration + countdown only) | 296.396 |
| **Narration that must be removed to meet 240 s** | **≥ 56.4 s**, about 19% |

The brief does not allow speeding up, trimming or replacing the recordings, so nothing was cut. The pauses inside the recordings are already short (0.35–0.87 s), so tightening them could not close the gap either. Possible options:

- (a) Re-record shorter narration. The largest files are 03 (65.8 s), 06 (56.7 s) and 04 (54.2 s).
- (b) Explicitly authorise cutting specific sentences.
- (c) Accept a 4:58 cut.

Once new audio is in place, a rebuild is one command.

## 7. Scene timeline
| # | Scene | Start (s) |
|---|---|---:|
| 1 | Hook | 0.000 |
| 2 | Office story | 28.918 |
| 3 | Pyramid | 71.680 |
| 4 | Traps and recap | 137.482 |
| 5 | Quiz | 191.687 |
| 6 | Countdown | 215.967 |
| 7 | Answer | 220.967 |
| 8 | Promo | 277.652 |

Every beat is listed in `qc/beat_map.md`.

## 8. New components
- **`HIER.build(parent, {top, scale})`**: a four-tier pyramid.
  - Tiers: gold รัฐธรรมนูญ, pink พ.ร.บ.ประกอบรัฐธรรมนูญ, blue พ.ร.บ. = พ.ร.ก. (equal cards with a central "="), navy/cyan กฎหมายลำดับรอง (grouped chips with no internal ranking).
  - It also has ghost outlines, "?" markers, per-tier entrance, highlight and dim, a "ให้อำนาจ" link, a scan light and an apex glow.
  - Each tier moves as one object, with its labels attached.
- **Episode helpers in `index.html`:**
  - `scaleRig()`: puts cards on the shared scale's pans using exact pan kinematics, so a "balanced" scale is truly level.
  - `docHTML()` / `lawCard()`: fictional documents with abstract lines only.
  - An original office set: window, clock, calendar, binders, cabinet, desk and monitor.
- **QC:** DOM bounding-box safe-zone sampler and a frame-exact countdown/reveal checker.

## 9. Reused shared components
| Component | Used for |
|---|---|
| `engine.js` | Background, brand header, wipes, `life()` and easing, quiz option cards, countdown ring, confetti, SFX registry |
| `props_legal.js` | Justice scales |
| `props_story.js` | Rigs A (officer) and F (colleague): walk, arms, expressions, blinks |
| `shared/brand` | Logo, poster (shown whole), `mascot_presenter.png`, `mascot_pose.png` |
| Tools | `audio_prep.py`, `audio_mix.py`, `render.js`, `build_episode.sh` |

**Shared change:** `build_episode.sh` now reads an optional `"crf"` (default 17, so other episodes are unchanged). EP.32 uses CRF 20. At CRF 17 the file was 105.7 MB, which exceeds GitHub's 100 MB per-file limit.

`promo.js` was not used. Its eight built-in beats (6 subjects, timer, AI, packages, "คลิกลิงก์") do not match this promo narration (comment → NaiSibPro → 10,000+ questions → weekly updates → like/share/follow), so EP.32 has its own promo built from the official logo and poster.

## 10. Legal accuracy
`qc/legal_accuracy_check.md` — checks 1–7 all PASS. Two caveats:

- The official sites (constitutionalcourt.or.th, ilaw.or.th) were blocked by this session's network policy. Section 172's wording, "ให้ใช้บังคับดังเช่นพระราชบัญญัติ", and its four purposes were confirmed through a web-search summary. **A human check of the มาตรา 5 / 172 phrases against ราชกิจจานุเบกษา or ocs.go.th is recommended.**
- The narration could not be transcribed, because the Whisper model download from huggingface.co was blocked. Law names were located acoustically instead. Their positions match the script anchors, but **nobody has listened through the narration word by word**, so a listener pass for material legal errors is recommended.

## 11. Mobile safe zone
`qc/safe_zone_report.json`:
- 1,219 samples and 3,911 measured essential-text boxes, including entrances, zooms and exits: **0 violations** of X 220–860 / Y 350–1430.
- The zone is fully visible under center-cover and aspect-fit at 375×812, 390×844, 430×932 and 9:19.5.
- It does not intersect the estimated TikTok / Reels / Shorts overlays. These overlay areas are estimates, not official specs.

## 12. Countdown
`qc/countdown_check.json`:
- Frames 6479–6628: 30 frames each for 5/4/3/2/1. No number appears outside that window.
- The narration is silent for the whole countdown.
- The first green highlight is frame 6661, on option ค, triggered by "ข้อ ค.". Nothing is highlighted earlier.
- The boundary frames were also confirmed in the MP4.

## 13. Final MP4
`EP32/output/NaiSibPro_EP32_Thai_Law_Hierarchy.mp4`

## 14. Re-render
```bash
shared/tools/build_episode.sh EP32          # ~10 min with WORKERS=4
node EP32/qc/qc_safezone.js && node EP32/qc/qc_countdown.js
```

## 15. Known limitations
1. **The video is 297.6 s, not ≤ 240 s.** This is an input-bound blocker (see section 6).
2. Beats are aligned to measured pauses and acoustically located keywords, not to a transcript. Some secondary beats are inferred and should be confirmed by ear:
   - hook 10.94–13.4 s
   - story 0–1.4 s and 27–30 s
   - answer 12.7–24 s
   - the promo LIKE / SHARE / FOLLOW split
3. The legal wording was not cross-checked against the official text in this session (see section 10).
4. The smallest secondary captions (23–25 px, such as process-panel notes) are about 8 CSS px on a 375-wide phone in aspect-fit. All primary legal labels are 25–56 px.
