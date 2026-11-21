# EP62 QC report

Every check below was run on the **exported MP4** (`output/NaiSibPro_EP62_Official_Document_Classification.mp4`, MD5 `cd775f5ec9c925a5109170ce57002394`) or on the same deterministic page that rendered it. Re-run with:

```bash
python3 EP62/qc/audio_qc.py
```

```bash
node EP62/qc/qc_probe.js
```

## Verdict
No release-blocking defect remains. Two items are open:
1. **Runtime is 195.66 s, not under 180 s.** The supplied narration alone is 189.05 s, and the recordings were not altered.
2. **The regulation page was not re-read in this session.** The government host is blocked from the render container (see Regulation).

## Export
| Check | Result |
|---|---|
| File | 71.8 MB MP4, faststart |
| Video | H.264 High, 1080×1920, yuv420p, 30/1 fps constant, **5,869 frames** (all decoded) |
| Audio | AAC-LC, 48 kHz, stereo, 192 kb/s |
| Duration | **195.659 s** (3 min 15.7 s) |
| Loudness | −14.2 LUFS integrated, LRA 4.5 LU, true peak −0.2 dBFS, **0 clipped samples** |

## Frame zero
`first_frame.png` is extracted from the MP4 (frame 0). It shows **เตรียมสอบนายสิบตำรวจ** (including ตำรวจ), **วิชางานสารบรรณ**, "คำสั่ง ระเบียบ ข้อบังคับ / หรือประกาศ?", the officer holding four documents (คำสั่ง, ระเบียบ, ข้อบังคับ, ประกาศ) and a large question mark. Nothing fades in; it is fully drawn at t = 0.

## Audio (`audio_durations.txt`, `audio_validation.json`)
- All seven files are present, in the required order. Each is **bit-identical** to the ZIP (same MD5) and is placed **bit-identical** in the narration track (sample-exact comparison).
- Narration gain is 1.0: no speed change, trimming, re-voicing or processing on the voice. Only the music and SFX bed ducks.
- Cross-correlating the narration track with the MP4 audio gives a **0 ms** offset.
- The last quiz word ends at 132.84 s. The countdown runs 133.000–138.000 s. Audio 06 starts at **138.000 s**, and its first voice is at 138.07 s.
- Narration inside the countdown window is **0.0** (digital silence). The MP4 mix there is −32 dBFS RMS: soft music plus five ticks.
- Audio 07 is complete: the last word is at 193.83 s, the video ends at 195.66 s, and `mp4_contains_promo_end` is true.
- No internal countdown existed in the recordings, so none was duplicated.

## Countdown and early reveal (`countdown_validation.json`)
- Countdown frames 3990–4139: **150 frames**. Each digit 5 / 4 / 3 / 2 / 1 shows for **30 frames**. No digit appears outside the window.
- 1,137 pre-reveal frames of the visible quiz scene were checked: **0** have a green overlay, ✓, ✕, dimming or greyscale on any option.
- The first frame with ง green is **4141**. Audio 06 starts at frame 4140 (138.000 s). The reveal waits for "เฉลย!".
- Before the reveal, all four options share the same style, size, colour, entrance and a **3.2 s** focus. The focus is neutral yellow, never green or red.

## Mobile safe zone (`safe_zone_report.json`)
Every element marked critical was measured: titles, document names, folders and their items, question, options, countdown, reveal panels, comparison and promo text. The probe sampled every 0.25 s over the whole video (783 samples, 3,117 element checks) against X 220–860 / Y 350–1430, with a 6 px tolerance. Bounding boxes include the scene push-in and motion.
- **Persistent violations: 0.**
- 11 transient flags, each ≤ 0.5 s. All are entrance motion: options sliding in from the side, folder items arcing in, and ง's 0.4 s scale "pop" at the reveal. Each settles inside the region.
- At 375×812 / 390×844 / 430×932 (the 9:16 video scaled to phone width, ~0.35–0.40×), quiz options are 39 px on the canvas, which is about 14–16 px on screen. Option letters are 62 px badges. The 640 px-wide essential column stays clear of the usual right-side action rail and bottom caption area on TikTok, Reels and Shorts. Device overlays were judged from the region geometry, not tested on real devices.

## Colour balance (blue = หนังสือสั่งการ, pink = หนังสือประชาสัมพันธ์)
Measured on 32 frames from the MP4, counting saturated pixels by hue: **pink 45.9 % / blue 54.1 %**. Per frame, the pink share ranges from 35 % to 55 %. The category colours are never swapped: every directive item is blue and every public-information item is pink, in all scenes.

## Regulation (`regulation_validation.json`)
- Directive documents: คำสั่ง, ระเบียบ, ข้อบังคับ (ข้อ 15). Public-information documents: ประกาศ, แถลงการณ์, ข่าว (ข้อ 19). The answer is **ง**. The traps are ก → ประกาศ, ข → แถลงการณ์, ค → ข่าว.
- The video never claims an announcement lacks legal effect. It shows ✓ เป็นเอกสารทางราชการ and ✓ อาจใช้ชี้แจงแนวทางปฏิบัติ, then classifies "ตามระเบียบงานสารบรรณ". It never says ระเบียบ and ข้อบังคับ are interchangeable.
- **Not re-verified online:** laws.md.go.th and saraban.go.th are blocked by this environment's network policy. The two clauses above are the regulation's well-known text. Please open the government link once to confirm.
- Document art is fictional: a generic seal, no Garuda, no signatures, no real orders.

## Thai text
- A string scan of the source finds no misspelled variant of แถลงการณ์ (every occurrence ends with ณ์) or ข้อบังคับ.
- The question is preserved word-for-word, split across three lines.
- Rendered frames were inspected for tone-mark placement, clipping and overlaps. One defect was found and fixed before the final render: the ✓/✕ markers covered the end of long options, so they now sit on the letter badge.

## Defects found and fixed during QC
1. Header pills drifted above y = 350 because of bobbing and the push-in. They were moved down.
2. 640 px panels grew past X 220/860 with the scene push-in. Panels were narrowed to 604–620 px.
3. The countdown "5" faded in over 3 frames. The ring now enters 0.3 s before, so all 150 frames show a full digit.
4. The "ให้เวลาคิด 5 วินาที!" bubble overlapped the countdown ring. It now leaves first.
5. The VS badge covered "ประกาศ" in scene 3. It was moved above the folders.
6. The ✓/✕ markers clipped "แถลงการณ์" and "ข้อบังคับ". They were moved onto the letter badge.

## Known limitations
- Word timings come from pause detection, not speech recognition (no ASR model could be downloaded here). Phrase starts are accurate to about 20 ms. Individual words inside a fast phrase, such as the final recap, are about ±0.3 s.
- The shared rig gained look `G`. EP05 was re-rendered as a regression check and matches its delivered MP4 (mean pixel difference 0.76/255, JPEG noise).
