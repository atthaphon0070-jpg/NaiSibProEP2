# EP.41 QC report

**Overall: content, math, safe zone, countdown and render all pass. One release blocker is open: the runtime is 203.1 s against a 180 s maximum.** That overrun comes from the supplied narration and needs the producer's decision; the details are below.

## 1. Runtime: BLOCKER (needs a decision)
| | seconds |
|---|---:|
| 7 narration files, unedited | 196.911 |
| Countdown (mandatory) | 5.000 |
| End hold after the last word | 1.200 |
| **Final MP4** | **203.112** |
| Limit | 180.000 |
| **Over by** | **23.1** |

Narration plus countdown alone is already 201.9 s, so no visual or timing change can reach 180 s. The speech is dense: the longest internal pause in any file is under 1 s, and there is no leading or trailing silence worth trimming. As the brief instructs, nothing was cut, sped up or re-voiced. The three ways to fix it:
1. Re-record shorter narration. Roughly 23 s has to go, most easily from `06_answer.mp3` (40.7 s) and `02_story.mp3` (26.8 s).
2. Approve a 3:23 runtime for this episode.
3. Approve cutting specific sentences, chosen by the producer.

## 2. Audio
- All 7 files are used, in the specified order, byte-identical to the ZIP (md5 in `audio_durations.txt`), with narration gain fixed at 1.0.
- The music bed and SFX (rail clacks, horn, stopwatch ticks, pops, reveal chime, countdown ticks) duck under the voice. The minimum bed gain is 0.27.
- The finished mix has no extra gain; a −1 dBFS safety limiter sits on the whole mix. It measures **−14.2 LUFS integrated** with a −0.6 dBFS peak.
- There is no dead air. The only planned silence is the 5 s thinking time, where only the ticks and a soft bed play.

## 3. Countdown and reveal
- The countdown runs from 139.233 to 144.233 s: **exactly 150 frames** (frames 4177–4326), 30 frames per digit, 5 → 4 → 3 → 2 → 1.
- The question and all four options stay visible and neutral during the countdown. The digits are verified in MP4 frames (see the contact sheet).
- **No early reveal.** The automated scan sampled every 0.25 s and found no option highlighted before the countdown ended (`early_answer_highlight: []`). The visual reveal lands at 145.333 s, on the spoken "ข้อ ค" in `06_answer.mp3`.

## 4. Math: PASS (12/12, `math_validation.json`)
Pole 8 s, bridge 18 s and 200 m give an extra time of 10 s, a speed of 20 m/s and a train length of 160 m. Reverse check: (160 + 200) ÷ 20 = 18 s. The correct option is **ค. 160 เมตร**, and only one option equals the answer. Every number on screen is generated from `source/math_logic.js`.

## 5. Visual logic
- The pole event starts when the front reaches the pole and ends when the tail passes it. A dashed "ghost" train marks the start position, and the arrow from the ghost's front to the train's front spans **only the train length**.
- The bridge event starts when the front reaches the start of the bridge and ends when the tail leaves the end of the bridge. The arrow spans **bridge (200 ม.) + train length**, drawn as two coloured segments.
- Train and bridge are drawn to the same scale throughout (1.15 px per metre), so 160 m : 200 m is true to proportion. Every demo moves at the same on-screen speed (constant speed), and the bridge crossing takes exactly 18/8 as long as the pole pass.
- The stopwatch counts story time, 0 → 8 and 0 → 18, in sync with the motion.

## 6. Safe zone: PASS (`safe_zone_report.json`)
The zone is x 220–860, y 350–1430. The scan sampled every 0.25 s through the whole episode, entrances and exits included: **813 samples, 5,013 element checks, 0 violations.** It checks every element tagged as essential: titles, chips, formulas, arrows and their labels, event markers, the question, options, countdown, stopwatch, logo and CTA. Scene art (train, track, panels) and the decorative mascots are not counted as essential.

## 7. Style and typography
- **Blue dominance:** the navy, electric blue, cyan and ice palette covers the background, panels, train, headers, quiz cards, countdown and wipes. Pink appears only as a thin trim stripe on the locomotive and in the unaltered official logo. Yellow marks key numbers; green is reserved for the correct answer; red marks the wrong assumption.
- **Typography:** Prompt (repo fonts) throughout, with line heights of 1.35–1.55. No clipped vowels or tone marks were seen in the reviewed frames. Wide lines are auto-fitted to ≤ 570 px. Arrows, checks, warnings and timers are SVG icons, because Prompt lacks those glyphs.
- **Frame zero (`first_frame.png`):** shows "เตรียมสอบนายสิบ!", "วิชาคณิตศาสตร์", the pole panel with 8 วินาที, the bridge panel with 200 เมตร and 18 วินาที, the train and "รถไฟยาวกี่เมตร?". There is no black frame and no delayed title.

## 8. Render: PASS
1080×1920, 30 fps, 6,093 frames, H.264 High (yuv420p) plus AAC-LC 48 kHz stereo at 192 kbps, faststart. The file is about 68 MB. It was fully decoded with `ffmpeg -xerror` with no errors, and the contact sheet frames were extracted from the MP4 itself.

## 9. Known limitations
- No speech-to-text model was reachable in the build environment (Hugging Face and the Whisper CDN are blocked). Beats are placed on **measured phrase onsets**, and shots were mapped to phrases by order and structure, following the master prompt's shot list. The quiz mapping is structurally certain (4 question phrases, then 4 letter + value pairs, a hint and the cue). In the other scenes a beat could land one phrase early or late if the recorded wording differs from the brief. Please do one listening pass; any beat is a one-number change in `source/beats.js`.
- Option ก. 120 does not correspond to an obvious wrong method. It is fine as a distractor; it is only noted.
