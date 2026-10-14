# NaiSibPro EP.05 — โอนเงินผิดบัญชี ผู้รับเอาไปใช้ได้ไหม?

**Final video:** `output/NaiSibPro_EP05_Wrong_Transfer_Law.mp4`. It is 1080×1920 (9:16), 30 fps, H.264 High + AAC 48 kHz stereo, runs 150.6 s, and measures −14.2 LUFS with a true peak of −0.7 dBFS.

Rebuild it with `shared/tools/build_episode.sh EP05`.

## Timeline (audio-first, measured from the supplied narration)
| # | Scene | Audio | Start (s) | Length (s) |
|---|-------|-------|------:|------:|
| 1 | Hook: phone close-up, wrong transfer, receiver's notification, freeze title | 01_hook.mp3 | 0.00 | 15.49 |
| 2 | Story: นางเอ in a café → split screen → ต่อมา… → bank message → นายบี keeps and spends | 02_story.mp3 | 15.49 | 22.36 |
| 3 | Civil law: เงินโอนผิด ≠ ได้สิทธิเป็นเจ้าของ, ลาภมิควรได้ (ป.พ.พ. 406), must return | 03_civil.mp3 | 37.85 | 20.51 |
| 4 | Criminal law: knowing + dishonest use → เข้ากรอบ ยักยอก, ส่งมอบให้โดยสำคัญผิด (ป.อ. 352 ว.2) | 04_criminal.mp3 | 58.36 | 17.55 |
| 5 | Quiz (question read line by line, choices appear as they are spoken) | 05_quiz.mp3 | 75.91 | 27.48 |
| 6 | **Silent countdown 5→1** (exactly 150 frames, no narration) | — | 103.40 | 5.00 |
| 7 | Answer: ค. ยักยอก revealed on "ข้อ ค", 3-part checklist, civil reminder | 06_answer.mp3 | 108.40 | 19.49 |
| 8 | Promo (shared module) + end card | 07_promotion.mp3 | 127.89 | 20.92 (+1.8 s hold) |

The narration is mixed unedited, in the supplied order, with no speed change, no trimming and no processing on the voice alone. The animation beats are timed to phrase starts measured from the audio. A local Whisper pass was used only to read the timing; it generated no voice. The 5 s silence is padded onto a frame boundary.

The supplied narration is about 7 dB quieter than EP.04's. The finished mix (voice, music and SFX together) therefore gets one uniform +6 dB gain and a −1 dBFS lookahead peak limiter (`"master"` in `episode.json`). The limiter reduces gain by more than 1 dB in only about 2% of 10 ms windows.

## Assets used
- `audio/` holds the seven narration files from the ZIP. They are byte-identical; only the doubled `.mp3.mp3` extension was dropped.
- Logo (`shared/brand/logo.png`) and promo poster (`shared/brand/poster.jpg`) are the files already in the repo, and they match the ZIP's `lo.png` and the infographic.
- The mascot was cut out (background removed) from the two supplied mascot renders. The cut-outs are `shared/brand/mascot_presenter.png` (explainer and quiz) and `shared/brand/mascot_pose.png` (hook reaction, criminal scene, celebration). The square quiz-layout reference set the card style.
- The characters นางเอ (sender: bob haircut, pink blouse, lavender skirt) and นายบี (receiver: mint tee, denim) are original SVG rigs. The banking app is fictional and generic, with no real bank names or logos. All account numbers are made up.

## Legal framing
- Civil: money received by mistake with no lawful basis must be returned (ลาภมิควรได้, ป.พ.พ. มาตรา 406).
- Criminal: the scene and the quiz are framed as the episode's hypothetical. The receiver knows the money is not theirs, it came to them through a mistaken transfer, and they dishonestly use it. The on-screen note reads "*โจทย์ตัวอย่าง: ผู้รับรู้ข้อเท็จจริงแล้ว + เบียดบังโดยทุจริต", and the narration says "อาจเข้ากรอบ". Best exam answer: **ค. ยักยอก** (ป.อ. มาตรา 352 วรรคสอง, ทรัพย์ตกมาอยู่ในความครอบครองเพราะผู้อื่นส่งมอบให้โดยสำคัญผิด).
