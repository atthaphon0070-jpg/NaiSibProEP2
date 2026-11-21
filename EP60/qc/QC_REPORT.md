# EP.60 QC report — CPU vs GPU ต่างกันอย่างไร?

**Final file:** `output/NaiSibPro_EP60_CPU_vs_GPU.mp4`. All checks below were run on this exact export, or on the page that rendered it frame by frame.

**Status: PASS.** No release-blocking defects are open.

| # | Check | Result | Evidence |
|---|---|---|---|
| 1 | Frame 0 shows "เตรียมสอบนายสิบตำรวจ" | PASS. It shows with วิชาคอมพิวเตอร์, the CPU/GPU split and "CPU vs GPU ต่างกันอย่างไร?". There is no black frame and no fade-in. | `first_frame.png` (frame index 0 extracted from the MP4) |
| 2 | Blue/pink balance close to 50:50 | PASS. Blue **48.3%**, pink **51.7%** | `media_qc.json` → `balance` (103 frames, one every 2 s). By scene (blue/pink): hook 53/47 · story 54/46 · know 40/60 · expl 46/54 · quiz 54/46 · ans 45/55 · promo 45/55 |
| 3 | Classic 2D style | PASS. 2D/2.5D SVG motion graphics with chip characters, a core-grid "team", data-flow lines, a pixel race, split screens and infographic cards. | `beat_map.md` |
| 4 | All 7 original narration files are used, in order, unedited | PASS. The files are byte-identical to the ZIP. There is no trimming, no speed change and no re-voicing. | `audio_durations.txt` |
| 5 | Timeline follows the real audio | PASS. Scene lengths are the decoded file lengths, and beats sit on measured phrase starts. | `audio_durations.txt`, `beat_map.md` |
| 6 | Quiz question and options match the approved script | PASS. They are word-for-word. | `source/index.html` (`OPTS`, `#q-text`) |
| 7 | Countdown is exactly 5 s / 150 frames | PASS. It runs over frames 4278–4427 (142.600–147.600 s), with digits 5→1 at 30 frames each. The narration track is silent there (peak 0.0). | `countdown_validation.json` |
| 8 | No early reveal | PASS. **0** frames show any hint before the countdown ends. The first reveal is at frame 4460 (148.67 s), on "ข้อ ข" in 06_answer. Before that all options are neutral; ก/ค pink and ข/ง blue alternate. | `countdown_validation.json` |
| 9 | Correct answer is ข. | PASS | `source/index.html` (`CORRECT = 1`) |
| 10 | CPU/GPU explanation is accurate | PASS. CPU = general-purpose, varied and complex control. GPU = parallel, many similar calculations. A red caution states that GPU is not faster at every task. Full HD = 1920 × 1080 = 2,073,600 px. | `beat_map.md` |
| 11 | Safe zone X 220–860, Y 350–1430 | PASS. **0** violations over 2067 samples (every 0.1 s). Every visible text run was measured, including entrances and exits. | `safe_zone_report.json` |
| 12 | Thai text is readable | PASS. Prompt Thai with offline woff2 fonts. Single-line labels are auto-fitted, so there are no collisions or clipped vowels or tone marks. The question is 40 px and the options are 30 px. | stills |
| 13 | Export specs | PASS. 1080×1920, 30/1 fps, h264 High yuv420p, aac 48000 Hz stereo | `media_qc.json` → `spec` |
| 14 | Audio level | PASS. -14.0 LUFS integrated, true peak -2.0 dBTP. Music sits under the voice, and the narration gain is 1.0. | `media_qc.json` → `audio` |

## Duration
The video runs **206.608 s (3:26.608)**, over the 3-minute target. The 7 supplied narration files alone run 199.8 s, and the brief says to keep every spoken word at natural speed. The extra time is the 5.0 s countdown and a 1.8 s end-card hold. Nothing was cut.

## Fixed during QC
1. **Blue/pink balance.** The first render measured 65% blue. The bottom margin used the shared sky-blue gradient end, and the pink blobs were nearly unsaturated. EP.60 now uses a neutral lavender gradient with blue and pink blobs in a criss-cross layout, which gives 48/52.
2. **Safe zone.** Off-screen slide entrances and exits, and the engine's 2.5% scene push-in, moved text outside X 220–860. Slides are now ≤ 30 px with fades, the push-in is 0.8%, and labels are auto-fitted after the fonts load. Elastic pops on edge-hugging titles are now ease-out-back.
3. **Loudness.** The first render measured −12.5 LUFS with a +0.8 dBTP true peak after AAC encoding. Master gain is now +0.5 dB with a −2.5 dBFS limiter, giving −14.0 LUFS and −2.0 dBTP.

## Known limitations
- **Beat timing is pause-based, not transcript-based.** The network policy blocks speech-model downloads, so no transcript was made. Shots sit on measured phrase starts in the order the brief describes. The quiz option and answer beats are anchored to clearly isolated short phrases. A few mid-paragraph beats, such as "ควบคุมการทำงานโดยรวม" at 9.4 s of 03, are placed between pauses and may sit up to about a second off the spoken words.
- The MP4 has 6,198 video frames. The timeline rounds up to 6,199, and the encoder's `-shortest` drops the final frame of end-card hold to match the audio length. The narration and countdown are unaffected.

## Re-run
```
shared/tools/build_episode.sh EP60
python3 EP60/qc/tools/media_qc.py EP60
node EP60/qc/tools/quiz_guard.js EP60 EP60/qc/countdown_validation.json
node EP60/qc/tools/safe_zone_check.js EP60 EP60/qc/safe_zone_report.json 0.1
```
