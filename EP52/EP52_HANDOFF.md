# EP.52 handoff — DID YOU GO OR DID YOU WENT?

## 1. Episode
- **Title:** NaiSibPro EP.52 — DID YOU GO OR DID YOU WENT? The Grammar Trap That Looks Too Easy!
- **Subject:** เตรียมสอบนายสิบตำรวจ — วิชาภาษาอังกฤษ. Past Simple questions, **Did + V1** (not Did + V2).
- **Official question:** Did the police officer _____ to work yesterday? (ก. go · ข. went · ค. goes · ง. going). **Answer: ก. go**

## 2. Repository
`atthaphon0070-jpg/NaiSibProEP2`, branch `claude/quirky-planck-m893f8`, folder `EP52/`. No earlier episode was changed.
The only shared-code change adds look `P` (police officer) to `shared/engine/props_story.js`; existing looks are untouched.

## 3–4. Original audio inventory and exact durations
```
EP52 — original ElevenLabs narration inventory (measured from the files)

#  file                    duration_s  samples@44.1k  start_in_video_s  md5
--------------------------------------------------------------------------------------------------------------
1  01_hook.mp3                 22.831        1006848             0.000  84458314f633aeb740556b946d010dd3
2  02_story.mp3                24.686        1088641            22.831  e4787428b37c083c393d701ac95b32ab
3  03_knowledge.mp3            26.279        1158912            47.517  b85655c6523b792e4ae62e87aa935210
4  04_explanation.mp3          26.514        1169280            73.796  5301417c87fb1ba6274ad540279155bf
5  05_quiz.mp3                 27.402        1208448           100.310  00310c1863549383fd59aff8c66be0cb
   COUNTDOWN (silence)          5.000     150 frames           127.733  (frame-aligned; 0.0206 s pad)
6  06_answer.mp3               30.276        1335169           132.733  6d2c1bb69ced2e4caa1ea5d855c26e00
7  07_promotion.mp3            21.002         926208           163.009  ac2d959c095b73666e3ad7a354828de2
--------------------------------------------------------------------------------------------------------------
narration total: 178.991 s   + countdown 5.000 s   + frame pad 0.0206 s   + end tail 0.600 s
video timeline end: 184.612 s  (5538 frames @ 30 fps)
180 s target: narration + countdown alone = 183.991 s  →  EXCEEDS 180 s by 3.991 s. Audio was NOT trimmed or sped up (per brief); reported as a duration conflict.

Files are byte-identical copies of the ZIP contents (the ZIP used doubled ".mp3.mp3" names; only the extension was fixed).
```

## 5. Final runtime
**184.600 s** (5538 frames at 30 fps; container 184.612 s).
This is **over the 180 s target**. The supplied narration (178.991 s) plus the required 5 s countdown already totals 183.991 s. The audio was not trimmed or sped up. Getting under 180 s needs a shorter re-recording; the narration has to lose at least 4 s.

## 6. Scene timeline
| # | Scene | Audio | Start (s) | Length (s) |
|---|---|---|---:|---:|
| 1 | Opening hook — title from frame 0, Did you go vs Did you went, student, YESTERDAY trap | 01_hook.mp3 | 0.000 | 22.831 |
| 2 | Officer’s yesterday — calendar flip, walk home → road → police station, DID enters the question, WENT temptation | 02_story.mp3 | 22.831 | 24.686 |
| 3 | DID + V1 — auxiliary timeline, formula, 3 examples, incorrect forms, recap | 03_knowledge.mp3 | 47.517 | 26.279 |
| 4 | Statement vs question — WENT → GO signature transformation, Did he went ✗, memory rule | 04_explanation.mp3 | 73.796 | 26.514 |
| 5 | Official quiz — question, Thai meaning, four choices read one by one | 05_quiz.mp3 | 100.310 | 27.402 |
| 6 | Silent countdown 5 → 1 (150 frames) | — | 127.733 | 5.000 |
| 7 | Answer — ก. go, blank fills, DID = PAST / MAIN VERB = V1, statement with went, DID + V1, replay | 06_answer.mp3 | 132.733 | 30.276 |
| 8 | NaiSibPro promotion — comments, Did went → Did go, logo, 10,000+ questions, weekly updates, LIKE · SHARE · FOLLOW | 07_promotion.mp3 | 163.009 | 21.002 |

## 7. Characters and assets
- **Police officer:** an original 2D/2.5D jointed SVG rig (shared look `P`). Brown short-sleeve uniform, peaked cap with a generic gold emblem (not an official insignia), badge, name bar, black belt and shoes. He walks, blinks, turns his head, gestures, waves, thinks and cheers. One design is used in every scene: in the world as the story actor, and in screen space as the presenter.
- **Student (hook):** shared look `A`, thinking pose.
- **Locations:** one 4400 px panorama with parallax layers. A = home, B = road (trees, lamps, "สถานีตำรวจ →" sign, drifting clouds), C = police station (Thai-inspired gable, generic sign "สถานีตำรวจ", pink/blue beacon).
- **Brand:** the approved `shared/brand/logo.png` at its original colours and proportions, and the shared Prompt Thai/Latin fonts.

## 8. Pink–blue 50:50
Split pink/blue backgrounds (diagonal), alternating pink/blue cards and chips, a dual-colour countdown ring, and the pink sidewalk, mauve road and split sky in the world. Measured on the exported MP4: **pink 53.5% / blue 46.5%** of coloured pixels (per scene: `qc/color_balance.json`).

## 9. Grammar transformation
`source/grammar_transformer.js`
- `GrammarSentenceTransformer` defines subject, auxiliary, verb (V2→V1 flip card), time, rest and punctuation tokens with states A and C. `draw(p)` is a pure function of p, so any frame renders the same.
- `DidVerbTransformation` (He went to work yesterday. → Did he go to work yesterday?) runs in this order: DID drops in, HE arcs to after DID, WENT (V2) flips to GO (V1), a small **PAST** marker travels from WENT into DID, and "." becomes "?". The finished question then gets a yellow underline under Did … go.
- It is used in scene 4 (large, three lines) and replayed at the end of scene 7.

## 10. Grammar validation
All 14 checks pass (`qc/grammar_validation.json`). Incorrect forms appear only in Did-question context, always with a red ✗ and "ผิด". Affirmative past statements with *went* are shown as correct.

## 11. Countdown
Frames 3832–3981: exactly 150 frames and 5.000 s, 30 frames per numeral. No narration, no early highlight, no filled blank. Audio 06 and the green ก highlight start on frame 3982 (`qc/countdown_validation.json`).

## 12. Mobile safe zone
0 violations across 924 sampled frames (glyph extents of every essential text node, X 220–860, Y 350–1430). On 375×812, 390×844 and 430×932 screens, cover-fit crops about 97 px per side, which leaves the safe zone fully visible (`qc/safe_zone_report.json`).

## 13. Final MP4
`EP52/output/NaiSibPro_EP52_Did_You_Go_or_Went.mp4`: 1080×1920, 30 fps CFR, H.264 High yuv420p, AAC 48 kHz stereo, 64.5 MB, integrated -12.0 LUFS, true peak -0.2 dBFS.

## 14. Re-render
```bash
shared/tools/build_episode.sh EP52
node EP52/qc/tools/qc_page.js
python3 EP52/qc/tools/qc_text.py
python3 EP52/qc/tools/qc_media.py
python3 EP52/qc/tools/make_report.py
```
A full build takes about 8 minutes on 4 cores.

## 15. Known issues and limitations
- **Runtime is 184.6 s, over 180 s.** See section 5.
- **Beat timing is pause-based.** Speech-recognition models could not be downloaded here because the network policy blocks the model hosts. Beats are placed on measured phrase starts and matched to the script's voice anchors by order and duration (`qc/beat_map.md`). The quiz choice rhythm confirms that mapping; the other cues haven't been checked against the actual words, so a watch-through for sync is recommended.
- **Wrapped text.** To stay inside the safe zone, the opening phrase is set on two lines (เตรียมสอบ / นายสิบตำรวจ) and the quiz question wraps as "Did the police officer" / "_____ to work yesterday?". "Officer" is never split and the blank stays visible.
- **Dropped tail frame.** The encoder's `-shortest` drops the last frame of the silent end tail (1/30 s). No content is lost.
