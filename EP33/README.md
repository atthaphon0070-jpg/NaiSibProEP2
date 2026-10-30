# NaiSibPro EP.33 — คนที่เรียนสองวิชาพร้อมกันมีกี่คน? (เซตและการนับซ้ำ)

**Final video:** `output/NaiSibPro_EP33_Set_Overlap_Venn.mp4` (1080×1920, 9:16, 30 fps, H.264 High + AAC 48 kHz stereo, 206.2 s).

> ⚠️ **Over the 3-minute limit:** the seven supplied narration files alone run 200.18 s. With the required 5 s countdown the video is 205.2 s, plus a 1.0 s end-card hold. The narration was not shortened, sped up or trimmed. See `EP33_HANDOFF.md` → *Known issues* for the options.

Rebuild it with:

```bash
shared/tools/build_episode.sh EP33
```

Run QC with:

```bash
python3 shared/tools/audio_prep.py EP33 && node EP33/qc/validate.js
```

## Problem
There are 360 applicants: 230 study คอมพิวเตอร์, 190 study กฎหมาย, and 50 study neither. How many study both?
At least one subject = 360 − 50 = **310**, and both = 230 + 190 − 310 = **110**, so the answer is **ค. 110 คน**.
In the Venn diagram, computer-only = 120, both = 110, law-only = 80 and outside = 50, which sums to 360. The trap answer 60 (230 + 190 − 360) comes from forgetting to remove the 50 outside the circles first.

## Layout
| Path | What |
|---|---|
| `audio/` | the 7 ElevenLabs narration files from the ZIP (byte-identical; only the doubled `.mp3.mp3` extension dropped) |
| `episode.json` | segment order, 5 s countdown, output name, music settings |
| `source/index.html` | page shell: loads the shared engine, then the EP.33 modules and scenes |
| `source/math_logic.js` | the single source of every number shown on screen, plus the checks behind `qc/math_validation.json` |
| `source/venn.js` | **new** reusable animated Venn diagram (universe box, 2 circles, 36 people-dots at 1 dot = 10 people, overlap lens, outside highlight, double-count effect, region value tags) |
| `source/beats.js` | measured cue times for every narration file |
| `source/ep33.css` | Blue × Pink Fusion layer and safe-column components |
| `source/scenes/` | `header`, `s1_hook`, `s2_story`, `s3_knowledge`, `s4_explain`, `s5_quiz_answer`, `s6_promo` |
| `qc/` | QC script, reports and preview stills |
| `renders/` | build intermediates (git-ignored) |
