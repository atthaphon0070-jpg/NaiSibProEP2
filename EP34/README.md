# NaiSibPro EP.34 SPECIAL: 5 ยุคของคอมพิวเตอร์ (hosted by Box)

**Final video:** `output/NaiSibPro_EP34_5_Generations_of_Computers.mp4`. It is 1080×1920 (9:16), 30 fps, H.264 + AAC 48 kHz stereo, and runs **288.3 s (4:48)** and measures about −14 LUFS.

> ⚠️ **Over the 4-minute limit.** The seven supplied narration files add up to **286.46 s (4:46.5)** on their own. The video plays them unedited, in order, and adds a 1.8 s end-card hold. The pauses inside the files are short and natural: the longest is 0.71 s and all of them together come to roughly 20 s. Trimming them could not reach 4:00. Getting under 4:00 would need about 1.19× speed-up or removing about 47 s of narration, and the brief rules out both. So no cut was made. A ≤ 4:00 version needs shorter narration, or the owner's approval to drop specific lines.

Rebuild it with `EP34/build.sh`. That script measures the audio, writes Box's lip-sync envelope and then runs `shared/tools/build_episode.sh EP34`.

## Format
This is a special presenter-led explainer, not a quiz: there is no countdown and no answer reveal. **Box** (บ็อกซ์), from the MR BOXER character project, hosts the whole episode. The NaiSibPro brand system provides the palette, Prompt type, logo header, wipe, poster, CTA and end card.

## Timeline (audio-first, measured)
| # | Scene | Audio | Start (s) | Length (s) | Look |
|---|-------|-------|------:|------:|------|
| 1 | Hook: phone today → ENIAC room-size; Box walks in, name card; "5 ยุค" title + 5 era badges; clock "ย้อนเวลา" | 01_hook.mp3 | 0.00 | 35.16 | NaiSibPro pastel |
| 2 | Gen 1 Vacuum Tube: glowing tube, ENIAC wide shot (Box tiny for scale), heat + power, ≈18,000 tubes, recap | 02_gen1.mp3 | 35.16 | 38.43 | warm amber |
| 3 | Gen 2 Transistor: tube VS transistor, 4 benefits, mainframe with tape reels | 03_gen2.mp3 | 73.59 | 40.12 | mint/teal grid |
| 4 | Gen 3 IC: parts fly into one chip, magnified die, minicomputer, Box holds an IC | 04_gen3.mp3 | 113.71 | 37.25 | blue circuit |
| 5 | Gen 4 Microprocessor: CPU on one chip, turning point, Intel 4004 (1971), desktop → laptop → phone, home/office | 05_gen4.mp3 | 150.96 | 49.01 | lavender/pink |
| 6 | Gen 5 AI: neural net, NLP / image recognition / ML / data analysis, "AI runs on top of microprocessors (CPU · GPU)", Box lowers his sunglasses | 06_gen5.mp3 | 199.97 | 47.96 | dark neon |
| 7 | Summary of 5 generations → NaiSibPro logo + poster + features → CTA → end card | 07_summary_promotion.mp3 | 247.93 | 38.53 (+1.8 hold) | NaiSibPro pastel |

Era changes use a time-warp transition: speed streaks, a flash, a ring and the era number. The era pill and the 5-stop timeline stay at the top of the screen. The NaiSibPro wipe marks the summary and the promo.

**How the timing was set:** no transcript could be made in this environment, because the Whisper model download is blocked by the network policy. Beats are timed to phrase starts measured from the audio (pause detection, the same method as `audio_prep.py` cues), in the order of the content brief. The five summary items line up with the five short phrases at 3.59 / 4.53 / 6.06 / 7.06 / 8.42 s of `07_summary_promotion.mp3`. Box's mouth follows the measured voice level frame by frame (`tools/voice_env.py` → `source/env.js`).

## Audio
- `audio/` holds the seven files from the ZIP. They are byte-identical; only the doubled `.mp3.mp3` extension was dropped.
- The narration is not sped up, trimmed or re-voiced. The music bed and SFX are synthesized and duck under the voice.
- The narration measures about −17.5 LUFS, so the master gets one uniform +1.5 dB gain and a −1 dBFS limiter (`master` in `episode.json`).

## Assets
- **Box:** `shared/characters/box/` contains unmodified copies of the 3D repo's `core.js` and `puppet.js`. His design is kept exactly; only poses, expressions and positions are set per beat.
- **NaiSibPro:** `shared/brand/logo.png` and `poster.jpg` (the approved poster is shown whole), the engine, fonts and the end-card style from `promo.js`.
- **Props** (`source/art.js`) are new flat SVGs in the NaiSibPro style: vacuum tube, ENIAC, thermometer, gauge, transistor, mainframe, resistor/capacitor/diode, IC, die lens, minicomputer, CPU, Intel 4004 package (text only, no logo), PCs, house/office, neural net and AI tiles.

## Facts shown on screen
ENIAC (1946): about 18,000 vacuum tubes, about 30 tonnes, about 167 m², about 150 kW. Intel 4004 (1971): about 2,300 transistors, one of the first microprocessors. Gen 5 is framed as an emphasis on AI capability that still runs on microprocessor chips (CPU · GPU); older computing technology did not disappear. Era date ranges are given as approximate decades.
