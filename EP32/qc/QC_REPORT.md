# EP.32 — QC report

Final file: `output/NaiSibPro_EP32_Thai_Law_Hierarchy.mp4` (68.1 MB). Every result below was measured on the exported MP4 or on the page that rendered it.

| Check | Result | Evidence |
|---|---|---|
| Container / codecs | **PASS** | ffprobe: H.264 High, 1080×1920, DAR 9:16, yuv420p, constant 30/1 fps, 8,928 frames. AAC-LC, 48 kHz, stereo. |
| Playback integrity | **PASS** | Full decode (`ffmpeg -v error -f null`) reports 0 errors. |
| Loudness | **PASS** | −14.6 LUFS integrated, −0.2 dBFS sample peak. Narration gain is fixed at 1.0; only the music and SFX bed is ducked. |
| Duration ≤ 240 s | **FAIL — input-bound** | 297.608 s. The seven unmodified recordings alone total 291.396 s; with the mandatory 5 s countdown that is 296.396 s. Meeting 240 s would need **≥ 56.4 s less narration**. Under the brief's rules (no speed-up, no cuts, no re-voicing) this cannot be fixed in production. See `audio_durations.txt`. |
| First frame | **PASS** | `first_frame.png`: frame 0 shows the full text **เตรียมสอบ / นายสิบ**. No black frame, no logo-only intro, no entrance animation. |
| Countdown | **PASS** | `countdown_check.json`: starts at frame 6479 (215.967 s). Exactly 150 frames, 30 each for 5/4/3/2/1. No number shows outside the window. Frames 6478/6479/6508/6509/6628/6629 were also checked in the MP4. No narration plays (silent segment). |
| No early answer | **PASS** | No highlight until frame 6661 ("ข้อ ค." in 06_answer). The first and only green option is ค. Frame 6660 shows "หมดเวลา!" with all options neutral. |
| Safe zone X 220–860 / Y 350–1430 | **PASS** | `safe_zone_report.json`: 1,219 samples (every 0.25 s, plus ±0.1/0.3 s around each scene cut) and 3,911 measured boxes, including mid-entrance, zoom and exit states: **0 violations**. The zone is fully visible under center-cover and aspect-fit at 375×812, 390×844 and 430×932. Estimated TikTok / Reels / Shorts overlays do not intersect it. |
| Legal accuracy | **PASS** (see note) | `legal_accuracy_check.md`, checks 1–7. Official-text fetches were blocked in this session; a human should confirm the Section 5 and 172 phrases against ราชกิจจานุเบกษา or ocs.go.th. |
| Thai typography | **PASS (visual)** | Offline Prompt woff2 fonts. Stills were reviewed for clipped vowels and tone marks and for bad wraps; "พระราชบัญญัติ" on the story card was resized to stay on one line. Abbreviations are written พ.ร.บ. / พ.ร.ก. / พ.ร.ฎ. |
| Original audio | **PASS** | The audio files are byte-identical to the ZIP (SHA-256 in the handoff). They are mixed unedited and in order, with no time-stretch and no voice processing. |

Preview images in this folder: `first_frame.png`, `pyramid_preview.png` (133.5 s), `quiz_preview.png` (215.0 s) and `contact_sheet.png` (one frame every 12.4 s). All were extracted from the MP4.
