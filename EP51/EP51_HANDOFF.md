# EP.51 handoff — The police IS or ARE?

**Deliverable:** `EP51/output/NaiSibPro_EP51_The_Police_IS_or_ARE.mp4` (1080 × 1920, 30 fps, H.264 + AAC, 3:26.4, 47.5 MB)

## What the viewer sees (master timeline)

| Time | Audio | Content |
|---|---|---|
| 0:00 | 01 hook | Frame 0: เตรียมสอบนายสิบตำรวจ · วิชาภาษาอังกฤษ · THE POLICE IS or ARE? · one officer vs a group. Then POLICE with IS?/ARE?, the student ("looks easy… many get it wrong"), the spelling of POLICE under a magnifier, "ไม่ได้แปลว่าต้องใช้ IS เสมอไป", the "อย่าดูแค่ตัว S!" stamp |
| 0:22.9 | 02 story | Police station: one officer → A POLICE OFFICER (1 คน); two more walk in and search (search board) → THE POLICE (ภาพรวม); The police ___ with IS? vs ARE? |
| 0:48.5 | 03 knowledge | GrammarComparisonAnimation: A police officer **is** on duty → Two police officers **are** on duty (old verb flips as a red ✗), then blue/pink side-by-side panels "หนึ่งคนใช้ IS · หลายคนใช้ ARE (โดยทั่วไป)" |
| 1:21.2 | 04 explanation | Trap: group of four, THE POLICE = plural verb, "No final S ≠ automatically singular", A POLICE OFFICER (1 person), singular/plural panels, ✗ ดูแค่ตัว S / ✓ ดูความหมายของประธาน |
| 1:49.6 | 05 quiz | Exact question + Thai, 2 × 2 choices with neutral focus as each is read |
| 2:18.6 | — | 5 s silent countdown, pink + blue ring, frames 4158–4307 |
| 2:23.6 | 06 answer | ข. are turns green with a tick and confetti, "are" flies into the blank; officers search. Then the breakdown SUBJECT · VERB · REST, ✓ are / ✗ is (struck through), single officer: A police officer **is** looking for the suspect, memory lock (two equal panels) with a camera-flash freeze |
| 3:02.3 | 07 promotion | Comment prompt, "The police → ARE" review, logo + mascot, poster + 10,000+ ข้อ, อัปเดตทุกสัปดาห์, end card LIKE · SHARE · FOLLOW |

## Rebuild

```bash
shared/tools/build_episode.sh EP51
```

```bash
node EP51/tools/qc_page.js EP51 EP51/qc/onscreen_text.json && python3 EP51/tools/qc_media.py EP51
```

A full render takes about 6 minutes with 4 workers. Frames and the mix go to `EP51/renders/` (git-ignored).

## Shared changes

- `shared/tools/audio_mix.py`: adds the `radio` (soft static transition) and `shutter` (memory-lock freeze) cues. Older episodes don't use them, so their mixes are unchanged.
- `shared/tools/build_episode.sh` and `shared/README.md`: brought over from the EP.47 branch (optional `crf` in episode.json, the EP.47 computer cues). This branch started from `main`, which didn't have them yet.

## Known items

- **Runtime 206.4 s is above the 180 s target.** The seven recordings already add up to 200.2 s. Shorter takes would be needed to get under 3:00. `source/beats.js` would then need new phrase times, followed by a re-render.
- In 05_quiz the narrator says "ระวังนะครับ คำว่า Police ไม่มีตัว S ลงท้าย" before the countdown. It's shown as a neutral yellow warning chip, which is a hint, not the answer. No choice is highlighted.
- The cartoon officers are original SVG drawings in the mascot's uniform colours (no real insignia or text). The search board shows only an anonymous silhouette.
