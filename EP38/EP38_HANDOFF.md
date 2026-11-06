# EP.38 Handoff — To vs CC vs BCC (The Email Privacy Trap)

## 1. Episode
**NaiSibPro EP.38: To vs CC vs BCC, ส่งอีเมลถึง 50 คน ต้องใช้ช่องไหน?** The subject is computer studies (email communication). Answer: **ค. BCC**.

## 2. Repository / branch
`atthaphon0070-jpg/NaiSibProEP2`, branch `claude/funny-hamilton-aqnkfm`. No completed episode was modified: EP.02–EP.05 and their MP4s are untouched.

## 3. Original narration files
`EP38/audio/01_hook.mp3 … 07_promotion.mp3` come from the supplied ZIP and are byte-identical (md5 in `qc/audio_durations.txt`). Only the doubled `.mp3.mp3` extension was dropped. Each file plays once, in order 01→07, at unity gain. There is no time-stretch, trim, TTS or added speech.

## 4. Measured durations
| file | s |
|---|---:|
| 01_hook | 25.391 |
| 02_story | 29.074 |
| 03_knowledge | 31.164 |
| 04_explanation | 38.113 |
| 05_quiz | 28.291 |
| 06_answer | 45.401 |
| 07_promotion | 16.353 |
| **narration total** | **213.786** |

## 5. Final runtime — conflict reported
**219.99 s** (6,599 video frames = 219.97 s; the mux trims the last end-hold frame) = 213.786 s narration + 5.000 s countdown + a 0.0006 s frame-alignment pad + a 1.2 s end hold.
The brief targets 150–175 s with an absolute 180 s maximum. **That limit cannot be met with these recordings.** Narration plus the required countdown already comes to 218.79 s, 38.8 s over. Following the brief, the narration was not altered, and the runtime is reported here rather than labelled compliant. To reach ≤ 180 s, about 39–40 s of speech must be re-recorded or shortened; 06_answer (45 s) and 04_explanation (38 s) are the longest. There is no silent intro and no extended CTA hold.

## 6. Timeline (absolute seconds)
| scene | audio | start | length |
|---|---|---:|---:|
| 1 Hook: frame-zero keyword, 50 recipients, privacy, three fields, wrong-view risk | 01_hook | 0.000 | 25.391 |
| 2 Office story: officer, assignment, supervisor rule, dive into the composer, To/CC/BCC | 02_story | 25.391 | 29.074 |
| 3 To and CC: definitions, send animation, visible To/CC in the received view, 50-in-To mistake | 03_knowledge | 54.465 | 31.164 |
| 4 BCC: Blind Carbon Copy, sender view, 1→50 delivery, recipient views 01/02/03, comparison, forward limit | 04_explanation | 85.629 | 38.113 |
| 5 Quiz: question + ก To / ข CC / ค BCC / ง Reply All (neutral) | 05_quiz | 123.742 | 28.291 |
| 6 **Countdown 5→1** (no narration) | — | 152.033 | 5.000 |
| 7 Answer: ค green on "ข้อ ค", sender/recipient side by side, 50 icons, why not ก/ข/ง, summary | 06_answer | 157.033 | 45.401 |
| 8 Promo: comments, real logo, 10,000+ / weekly, poster, like/share/follow, end card | 07_promotion | 202.434 | 16.353 (+1.2 hold) |

Beat-by-beat detail is in `qc/beat_map.md`.

## 7. Shared assets reused
- `shared/brand/logo.png` and `poster.jpg` are used unmodified. The logo keeps its own colours.
- `shared/fonts` (Prompt Thai + Latin).
- `shared/engine/engine.js`: timing, `life()` entrances, wipes (recoloured blue), quiz cards (blue skin), the 5 s countdown (blue/cyan ring), confetti and the SFX registry.
- `shared/engine/props_story.js`: the 2D character rig, with **new additive looks O (officer, light-blue shirt, ID lanyard) and S (supervisor, navy shirt)**.
- `shared/tools/*`: audio_prep, audio_mix, render and build. `build_episode.sh` gained an optional `crf` setting (default 17, unchanged behaviour for earlier episodes).
- The shared `promo.js` was not used because its 8-beat pink layout does not fit this 16 s, 4-line promo voice. A blue promo scene was built from the same assets and the existing approved tagline.

## 8. New email UI components (`source/email_ui.js`, `source/recipient_visibility.js`)
- **Composer**: generic window with header, From/To/CC/BCC/เรื่อง rows, address chips, a count badge under the field label, body lines and the ส่ง button. It supports row glow and chip pop-in.
- **Inbox**: received-message view with viewer header, subject, From/To/CC rows, and a dashed "not shown" placeholder with an eye-off icon. It has a red outline variant for exposure.
- **AppGrid**: 50 recipient icons (10×5) with privacy shields, mail badges and a wave.
- **Paths**: one envelope branching to 50 animated delivery lines, shown as a visual metaphor only.
- Icons: eye, eye-off, shield-lock, lock, forward, reply-all, cursor, like/share/bell, comment.
- All addresses are fictional `@example.com` addresses: staff@, chief@, applicant01–03@. The other 47 appear as "+47 คน". No branded email UI is imitated.

## 9. Email privacy validation — 14/14 PASS (`qc/email_privacy_validation.json`)
The checks run against the rendered page DOM at the relevant moments:
- To = primary recipient, and CC = visible copy (the received view lists To and CC with eye icons).
- BCC = Blind Carbon Copy.
- Received views for applicants 01, 02 and 03 show no BCC row and no other applicant address.
- Visible To (staff@example.com) stays visible to BCC recipients.
- The sender's composer shows all 50 in BCC.
- Reply All is labelled "ปุ่มคำสั่งตอบกลับ ไม่ใช่ช่องใส่ผู้รับ".
- Only example.com addresses appear.
- No option is green before the reveal, and exactly ค is green after it.
- The countdown is exactly 150 frames, 30 frames per digit.
- The forwarding limit is stated. BCC is never shown as encryption or as anonymising the sender.

## 10. Blue-dominant theme
The background is a navy radial with a drifting electric-blue grid and cyan particles. Cards are white or ice blue with electric-blue borders, and recipients/envelopes/paths are cyan. Yellow appears only on "สำเนาลับ", green only on correct states, and red only on mistakes and warnings. Pink is limited to the logo, a poster pin, a folder tab and a few particles.

I measured 220 frames sampled from the MP4 at 1 per second. Of the coloured (chromatic) pixels, **98.9 % are blue/navy/cyan and 0.5 % are pink**, with 0.2 % green, 0.2 % red and under 0.1 % yellow. The rest of the frame is white or grey text and cards.

## 11. iPhone safe zone (X 220–860, Y 350–1430)
- `qc/safe_zone_report.json` comes from an animated check of every essential (`.ess`) element at full opacity, sampled every 1/15 s through the whole timeline. It found **0 critical violations**. Transient overshoots under 0.5 s during back-ease pops and slide-ins are listed but not critical.
- The engine's 2.5 % scene push-in is disabled for this episode so the 640 px panels stay inside the zone.
- `qc/mobile_sim.png` shows 375×812, 390×844 and 430×932 in centre-crop (fill) and aspect-fit. The safe zone stays fully on screen in all of them.
- The smallest essential text (26–28 px) renders at about 9.7 pt in aspect-fit on a 375-pt phone. Headline and quiz text is 39–60 px, about 13–21 pt.
- The approximate short-video UI zones (right action rail, bottom caption, top bar) sit outside the zone, except a ~3 pt edge contact with the right rail in fill mode at 375/390 pt. Only card borders fall there, no text.

## 12. Countdown frame validation
Frames **4561–4710** (152.033–157.033 s) are exactly 150 frames. In the MP4, the digits 5/4/3/2/1 show for 30 frames each, and the narration peak inside the window is 0.0. One tick plays per second. The question and all four choices stay visible. ค turns green at frame 4743 (158.083 s), on the spoken "ข้อ ค" after the countdown.

## 13. Output
`EP38/output/NaiSibPro_EP38_To_CC_BCC_Email_Privacy.mp4` is 74.1 MB. It is H.264 High, yuv420p, 1080×1920, 30/1 CFR, 6,599 frames (219.97 s), container 219.99 s, with AAC LC 48 kHz stereo at 192 kbps and faststart. The whole file decodes without errors. It was encoded at CRF 19 because CRF 17 gave 100.5 MB, over GitHub's 100 MB file limit.

## 14. Re-render
```bash
shared/tools/build_episode.sh EP38
```
That runs audio_prep (timeline), SFX cue export, the mix, +0.6 dB mastering with a limiter, a 4-worker Chromium frame render and the x264/AAC mux. For a quick preview, use `node shared/tools/render.js EP38 stills <dir> 0,95,158`. The QC tools are:
```bash
node EP38/tools/safe_zone_check.js EP38 0.0666666666666667
```
```bash
node EP38/tools/email_privacy_check.js EP38
```
```bash
python3 -I EP38/tools/mobile_sim.py EP38 <frame.jpg>
```

## 15. Known issues / limitations
1. **Runtime is 220 s, over the 180 s limit**, because of the supplied narration length (see §5).
2. **Word-level timing could not be machine-transcribed.** Hugging Face and the Whisper model hosts are blocked by this environment's network policy. Beats come from measured pauses and were matched to the brief's anchors by order and length; quiz choices, the reveal, the To/CC/BCC lists and the CTA align exactly. About a dozen mid-paragraph phrases whose exact words are unknown carry only non-verbal visuals (cursor, ticks, eye icons) or holds, so the screen never asserts a sentence the voice may not say. Check the cut by ear, especially 02_story 20.6–27.3 s and 04_explanation 8.1–14.5 s.
3. The mobile UI zones are generic approximations, not the apps' real overlays.
4. Confetti on the reveal and end card uses the shared multicolour palette, which includes small pink pieces for about 2 s.
