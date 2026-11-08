# NaiSibPro EP.41 — รถไฟผ่านเสาไฟและสะพาน (ความเร็ว ระยะทาง เวลา)

**Final video:** `output/NaiSibPro_EP41_Train_Pole_Bridge.mp4` (1080×1920, 9:16, 30 fps, H.264 High + AAC 48 kHz stereo).

Rebuild with `shared/tools/build_episode.sh EP41`. Run the QC with:

```
node EP41/tools/qc_math.js EP41
node EP41/tools/qc_safezone.js EP41 0.25
EP41/tools/qc_video.sh EP41
```

> **Runtime blocker:** the seven supplied narration files add up to 196.9 s. With the mandatory 5 s countdown, the episode cannot be shorter than 201.9 s, so it ends at **203.1 s**, which is 23.1 s over the 180 s limit. The narration was not cut, sped up or re-voiced. See `qc/QC_REPORT.md` for options.

## Question
รถไฟขบวนหนึ่งวิ่งด้วยความเร็วคงที่ ผ่านเสาไฟใช้เวลา 8 วินาที และผ่านสะพานยาว 200 เมตร ใช้เวลา 18 วินาที รถไฟขบวนนี้มีความยาวเท่าใด?
ก. 120 เมตร · ข. 144 เมตร · **ค. 160 เมตร** · ง. 200 เมตร

The working: 18 − 8 = 10 s, 200 ÷ 10 = 20 m/s and 20 × 8 = 160 m. As a check, (160 + 200) ÷ 20 = 18 s.

## Files
| Path | What it is |
|---|---|
| `audio/` | The 7 narration files from the ZIP. They are byte-identical (md5 in `qc/audio_durations.txt`); only the doubled `.mp3.mp3` extension was dropped |
| `episode.json` | Segment order, the 5 s countdown, music bed and master gain |
| `source/index.html` | Page shell and the episode's blue theme overrides (the shared engine is left unchanged) |
| `source/math_logic.js` | Every number on screen is derived here from the three givens |
| `source/beats.js` | Phrase onsets measured from the narration, segment-local |
| `source/train_engine.js` | Train, track, signal pole, arch bridge, dimension arrows, event markers, stopwatch, constant-speed motion |
| `source/scenes.js` | The 8 scenes, SFX cues and the safe-width text fitting |
| `tools/` | QC scripts (math, safe zone and early reveal, video checks) |
| `qc/` | Reports, first frame, contact sheet |

## Shared changes
`shared/tools/audio_mix.py` gains two SFX kinds, `clack` (rail joint) and `horn`. The change is additive and earlier episodes are unaffected.
