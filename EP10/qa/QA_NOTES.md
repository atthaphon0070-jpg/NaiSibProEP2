# EP.10 — ใครกำลังโกหก? — Render & QA notes

Final file: `EP10/output/NAISIBPRO_EP10_LOGIC_MYSTERY_FINAL.mp4`. It is 1080×1920, 30 fps, H.264 High + AAC 48 kHz stereo, 175.33 s long (5,260 frames).

## Puzzle logic (checked in code before rendering, and again inside the page at load)
| Who took it | เอก “ผมไม่ได้หยิบแฟ้ม” | บอย “เอกเป็นคนหยิบแฟ้ม” | ชัย “บอยไม่ได้หยิบแฟ้ม” | True count | Result |
|---|---|---|---|---|---|
| เอก | false | true | true | 2 | invalid |
| **บอย** | true | false | false | **1** | **valid** |
| ชัย | true | false | true | 2 | invalid |

The only valid answer is **ข. บอย**. Every true/false badge in the video is computed from the same statement functions, not typed by hand.

## Audio
- Seven narration files, in order and each used once: 01_hook, 02_story, 03_statements, 04_thinking, 05_quiz, 06_answer, 07_promotion.
- In the final MP4, each file sits at an offset of +0.00 ms, measured by cross-correlation.
- The 5-second countdown runs from frame 3225 to frame 3374 (150 frames). The narration track inside that window is exact digital silence; only ticks and music play.
- 06_answer starts on frame 3375, which is also the first frame where option ข is highlighted.
- Mastering: a single uniform +5 dB gain across the whole soundtrack, with a latency-compensated peak limiter at −1.5 dBFS. The limiter acts on about 4 % of samples. Result: −15.0 LUFS integrated, −1.1 dBFS peak, no clipping.
- The narration is otherwise unchanged: same words, timing and speed, and no synthetic voices.

## Central Safe Zone V2 (x 190–870, y 300–1430)
- `qa/safezone_audit.js` renders the page every 0.25 s and measures every visible text run, plus logos, mascots and the countdown ring.
- Result: **0 violations in 6,338 measurements** (`qa/safezone_audit.json`).
- Exclusions, on purpose: the office set (background) and the full-frame wipe transition. For the round mascot photo, the circular frame is measured instead of the image inside it.
- `qa/safezone_guide_*.jpg` show the zone (dashed red) on top of mock platform overlays (grey: top tabs, right-side buttons, caption area, bottom bar).
- The guide is drawn only when rendering with `GUIDE=1`. The final render does not include it.

## Visual checks on the encoded MP4
- Frame 3224 (last quiz frame): all four options are neutral and no timer is showing.
- Frames 3226–3373: the countdown runs from 5 to 1 with no highlighting.
- Frame 3375: ข. บอย turns green.
- ffmpeg blackdetect found no black frames; freezedetect found no freezes of 1.5 s or longer.

## Known limitations
- No speech-to-text model can be downloaded in this environment. Narration order comes from the filenames and the expected structure. In-scene cues come from measured pauses, not from transcribed words.
- Thai font: Prompt (rounded, loopless, modern), at weights 500–700.
- The story, characters and question are original material for practising logical reasoning. They are not a past police exam question.
