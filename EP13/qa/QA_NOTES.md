# EP.13 — เพิ่ม 20% แล้วลด 20% ได้ราคาเดิมจริงไหม? — Render & QA notes

**Final file:** `EP13/output/NAISIBPRO_EP13_PERCENT_TRAP_FINAL.mp4`
- 1080×1920, 30 fps, H.264 High (yuv420p) + AAC 48 kHz stereo.
- 219.57 s long (6,587 frames).
- Full decode reported no errors.
- All measured values are in `qa/verify_mp4.json`, written by `qa/verify_mp4.py` from the encoded file.

## Maths (checked in code and on every frame)
- **Single source of truth.** The page computes every number from one block: 100 → 20% of 100 = 20 → 120 → 20% of 120 = 24 → 96. It throws an error at load if any value or the answer index is wrong (ข. 96 บาท, the only option equal to 96).
- **Values on screen after the reveal** (from `qa/spoiler_audit.json`, every frame from the reveal to the promo): 20, 24, 94, 96, 100, 104, 120, plus step numbers 1–3. Nothing else.
- **100 is never presented as correct.** It appears only as:
  - the quick answers "เท่าเดิม!", which a trap then snaps,
  - the shortcut card's "ราคากลับมาเท่าเดิม?", stamped กับดัก!,
  - a neutral quiz option,
  - the crossed-out 100 in "ราคาไม่ได้กลับมาเป็น 100 บาท".
- **The shortcut card no longer claims "+20 −20 ≠ 0".** That arithmetic is true; the error is assuming the second step is −20. The video strikes through the −20 ("ลดครั้งหลัง ไม่ใช่ 20 บาท!") instead.

## No spoilers, exact countdown (`qa/spoiler_audit.js`, all 6,588 frames on the real page)
- **Before the reveal (148.27 s = "ข้อ ข", frame 4448):**
  - no visible 96 or 24 anywhere except the plain quiz option text "96 บาท",
  - no odometer resting on 96 or 24 (the discount spins roll *upward* into "?" so they never pass 96),
  - option ข never highlighted, and no "เฉลย".
- **Countdown:** frames 4209–4358, exactly 150 frames. The digit is correct on every frame (5, 4, 3, 2, 1).
- **Result: 0 issues.**
- **Checked on the encoded MP4:**
  - frame 4208, last quiz frame: options neutral;
  - 4209–4358: countdown;
  - 4359: "หมดเวลา!", still neutral;
  - 4449: ข. 96 บาท turns green with a gold ring and a check;
  - 4460: confetti.

## Audio
- **Narration files:** seven, in order and each used once: 01_hook, 02_story, 03_common_mistake, 04_thinking_method, 05_quiz, 06_answer, 07_promotion.
  - They are byte copies of the ZIP files with the doubled `.mp3.mp3` extension dropped.
  - Each was identified by content with a local Whisper pass, used for timing only; no voice was generated.
- **Placement in the final MP4** (cross-correlation of each source file against the encoded soundtrack): offsets of 0.00 to ±0.02 ms, normalised correlation 0.92–0.96.
- **Countdown window:** 140.30–145.30 s. The narration track is digital silence (peak 0.0); only ticks and a softer music bed play.
- **Mastering:** one uniform +7 dB gain plus a peak limiter at 0.80. The music bed ducks under the voice; the narration gain stays at 1.0.
  - Result: −14.2 LUFS integrated, −1.4 dBFS true peak after AAC.
  - The first master (limit 0.83) measured −0.9 dBTP, so the limit was lowered and the file re-muxed from the same frames.
- **SFX:** synthesised and timed to the visuals:
  - odometer ratchet `flip`, calculator `calc`, mousetrap `snap`, title `boom`,
  - coin landings, pops, whooshes, countdown ticks,
  - success chime on the reveal.

## Central Safe Zone V2 (x 190–870, y 300–1430)
- **Audit:** `qa/safezone_audit.js` (`STEP=0.1`) renders the page every 0.1 s. It measures every visible text run plus these boxes: countdown ring, logo and mascot images, quiz options, step nodes, calc pills, strip nodes, bars, brackets, odometer windows, chips, glass cards, bubbles, 3D % coins, the price tag, promo callouts and features.
- **Result: 0 violations in 48,078 measurements** (`qa/safezone_audit.json`).
- **Excluded on purpose:** the boutique set, which includes the shopkeeper and customers (background, `#world`), and the full-frame brand wipe.
- **Push-in:** boxes are read after CSS transforms, so the engine's scene push-in (scale up to 1.025) is included. Full-width panels use an inset column (x 202–858), and wide cards enter without overshoot.
- **Guide sheets:** `qa/safezone_guide_*.jpg` show the zone (dashed pink) over mock platform UI. The guide is drawn only with `GUIDE=1` and is not in the final render.
- **Webfont fix:** an audit run in parallel with the render measured text before the Prompt webfont had loaded. Cause: scenes start `display:none`, so `document.fonts.ready` alone can resolve early. `shared/tools/render.js` and both audits now load every font face first.
  - The first two frames of every render worker chunk (0, 1098, 2196, 3294, 4392, 5490) were re-rendered with the hardened renderer and are byte-identical to the final frames.

## Multi-agent visual QA
- **Method:** 106 guide frames, one per narration cue plus the countdown and reveal, were reviewed in four scene groups against a checklist:
  - phone readability and Thai shaping,
  - safe zone and platform UI,
  - composition,
  - maths, sync with the narration, and spoilers,
  - polish.
- **Verification:** every finding was handed to an adversarial verifier.
- **Round 1 (mistake and thinking scenes)** led to these fixes:
  - the shortcut card's "≠ 0" (mathematically wrong) became the struck-through −20;
  - the ≠ next to two "120 บาท" labels became the chip "ฐาน 100 ≠ ฐาน 120";
  - cards now grow with their rows, so there are no empty shells;
  - "20% ของ 100 = 20" resolves once the slice is added;
  - inactive step pills got more contrast and the header gap was fixed;
  - coin labels got padding;
  - the "ไม่ใช่เรื่องที่เดาเอา" caption is larger.
- **Round 2 (all scenes): 6 findings confirmed and fixed, 27 rejected** as transition frames, deliberate design or taste. The fixes:
  - the shopkeeper is now inside the safe zone and fully off-frame in the final wide shot;
  - the price-chain strip uses readable +20% / −20% tabs;
  - the "นี่แหละ!" callout has inner padding;
  - a real gap was opened for the bases chip;
  - the shortcut card grows ahead of its big digits, and the +/− styling is consistent;
  - the promo feature chips are laid out by measured width (they overlapped before).

## Shared-engine regression
- `props_story.js` (new look `Shop`) is additive. EP.05, EP.10 and EP.12 sample frames render byte-identical, except one EP.12 frame whose blurred plant varies run-to-run even with the original file (rasterisation noise, not a change).
- `props_shop.js` is new. The `audio_mix.py` SFX kinds are additive, so older episodes never call them.
- `render.js` now loads all fonts before the first frame, which can only remove early-frame font fallbacks.

## Known limitation
- **Shared promo config:** EP.12's promo uses the same fixed feature-chip x-positions that caused the overlap fixed here ("มากกว่า 10,000 ข้อ" is partly covered at about 204–212 s). EP.12 was not re-rendered in this change.
