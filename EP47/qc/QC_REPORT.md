# EP.47 QC report — Five Types of Computers

Every check below was run on the final page state. The media checks were run on the exported file `output/NaiSibPro_EP47_Five_Types_of_Computers.mp4`. To reproduce:

```bash
node EP47/tools/qc_page.js EP47 && python3 EP47/tools/qc_media.py EP47
```

## Verdict
| Area | Result | Evidence |
|---|---|---|
| Export format | **PASS** | 1080×1920, H.264 High, yuv420p, 30/1 fps constant (r = avg), AAC 48 kHz stereo, 6,620 frames, 220.67 s, 75.2 MB |
| Runtime ≤ 180 s | **FAIL: duration conflict, not fixable without editing narration** | The narration alone is 214.178 s. Narration + countdown is 219.18 s, 39.18 s over the limit. Silence at the file edges totals only 2.21 s. See `audio_durations.txt` |
| Narration preserved | **PASS** | 7/7 files match the ZIP's SHA-256. In the export, each file's least-squares gain is 0.995–0.998 and its correlation with the source is 0.986–0.991, in the approved order |
| Countdown | **PASS** | Frames 4630–4779 = 150 frames. Digits run 5,4,3,2,1 at exactly 30 frames each, and no digit shows outside them. Narration peak inside the window is 0.0 |
| No early reveal | **PASS** | All 1,213 frames from 3599 (quiz start) to 4811 were checked one by one. None shows a green option, check mark, dimming, green chip or "ข" header |
| Reveal | **PASS** | Frame 4812 (160.393 s), on "ข้อ ขอ ไข่". That is 32 frames after the countdown ends |
| Educational accuracy (14 checks) | **PASS 14/14** | `computer_types_validation.json`. The ranking rejection rule is not triggered |
| Safe zone (x 220–860, y 350–1430) | **PASS** | 2,207 sampled frames (every 3rd frame, all scenes) and 7,584 element checks: **0 violations at rest** |
| Platform overlays | **PASS** | No overlap between the critical zone and the TikTok, Reels or Shorts UI regions. On 375×812, 390×844 and 430×932 phones (fill-to-height), video x ≈ 97–983 is visible, so the critical zone is fully visible. See `mobile_overlays.png` |
| Thai typography | **PASS (visual)** | The bundled Prompt font (all weights preloaded before frame 0) shows no clipped vowels or tone marks in `first_frame.png`, `contact_sheet.png` or `countdown_frames.png`. Over-long lines auto-shrink to their box |
| Loudness | −14.2 LUFS integrated, −0.4 dBTP | Narration gain stays at 1.0. Only the music and SFX duck under it |

## Moving-frame safe-zone notes
- 261 of the samples catch elements mid-entrance, with an elastic or back-ease overshoot or a slide-in.
- The largest overshoot is 65 px: the quiz option cards slide in horizontally (the shared quiz component) for about 0.5 s. Everything else is ≤ 22 px.
- Every one of these samples is moving and settles inside the zone. All of them stay inside the visible phone area (x ≈ 97–983).

## Files in this folder
| File | What it shows |
|---|---|
| `audio_durations.txt` | Codec, rate, measured length, edge silence and SHA-256 per file; timeline starts; the duration conflict |
| `beat_map.md` | Every phrase anchor with local/global time and frame |
| `countdown_validation.json` | Per-frame digit runs, the early-reveal scan and the reveal timing |
| `countdown_frames.png` | Grabbed from the MP4: the frame before, the first and last frame of each digit, the frame after |
| `computer_types_validation.json` | The 14 required educational checks with evidence |
| `safe_zone_report.json` | Zone scan, transient samples, platform overlay rects, phone crops |
| `mobile_overlays.png` | Seven key moments on three phones with TikTok / Reels / Shorts UI masks (cyan box = critical zone) |
| `first_frame.png` | Frame 0 of the MP4: "เตรียมสอบนายสิบ" + "คอมพิวเตอร์ 5 ประเภท ต่างกันอย่างไร?" + five equal silhouettes |
| `contact_sheet.png` | One frame every 4 s from the MP4 |
| `onscreen_text.json`, `media_qc.json` | Raw text inventory and probe/loudness/integrity data |

## Known issues
1. **Runtime is 220.67 s, against a 180 s target.** This comes from the supplied narration and is reported as non-compliant. Meeting 180 s needs shorter re-recorded narration from the user. About 34 s would have to go from the scripts.
2. The reveal confetti bursts over option ข for about 1 s before it clears. The green highlight and check mark stay visible throughout.
3. The approved promo poster (`shared/brand/poster.jpg`) and the official logo are pink-accented brand assets. They are shown unchanged and small, so the episode stays blue-dominant.
