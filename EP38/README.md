# NaiSibPro EP.38 — To vs CC vs BCC: ส่งอีเมลถึง 50 คน ต้องใช้ช่องไหน?

**Final video:** `output/NaiSibPro_EP38_To_CC_BCC_Email_Privacy.mp4`. It is 1080×1920 (9:16), 30 fps constant, H.264 High yuv420p + AAC 48 kHz stereo. It runs **219.99 s** (6,599 frames) and measures −13.7 LUFS with a true peak of −0.5 dBTP.

> ⚠ **Runtime conflict.** The seven supplied recordings alone run 213.79 s. With the required 5 s countdown they come to 218.79 s, which is over the 180 s maximum. Per the brief, the narration was not sped up, cut or rearranged, so the video is 219.99 s. See `qc/audio_durations.txt`.

Rebuild it with `shared/tools/build_episode.sh EP38`. That takes about 8 minutes on 4 cores and writes the frames to `renders/` (git-ignored).

## Structure
| Path | What it is |
|---|---|
| `audio/01…07_*.mp3` | The original ElevenLabs narration, byte-identical to the ZIP |
| `episode.json` | Segment order, the 5 s countdown, music, mastering (+0.6 dB, −1 dBFS limiter) and `crf` 19 |
| `source/index.html` | Page loading the shared engine plus the files below |
| `source/ep38.css` | Blue-dominant theme layer (navy / electric blue / cyan / ice; pink only as an accent) |
| `source/email_ui.js` | Fictional generic email UI: `Composer` (sender view), `Inbox` (received message), chips, icons |
| `source/recipient_visibility.js` | 50-applicant grid, the one-to-50 delivery-path metaphor, blue background layer |
| `source/beats.js` | Beat map: measured phrase starts per narration file |
| `source/scenes.js` | Eight scenes: hook, office story, To/CC, BCC, quiz + countdown + answer, promo |
| `tools/safe_zone_check.js` | Animated safe-zone and text-clipping check, writing `qc/safe_zone_report.json` |
| `tools/email_privacy_check.js` | DOM-level check of the email privacy rules and the answer, writing `qc/email_privacy_validation.json` |
| `tools/mobile_sim.py` | Phone fill/fit simulation with generic short-video UI zones, writing `qc/mobile_sim.png` |
| `qc/` | Durations, beat map, validation reports, first frame, contact sheet, `QC_REPORT.md` |
| `EP38_HANDOFF.md` | Production handoff |

Shared changes are additive only. `props_story.js` gains looks **O** (officer) and **S** (supervisor). `build_episode.sh` gains an optional `crf` setting in episode.json, default 17, so earlier episodes build exactly as before.
