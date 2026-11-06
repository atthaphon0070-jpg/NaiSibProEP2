# EP.38 beat map

Every beat is a phrase start measured from the supplied audio: 20 ms RMS above −38 dBFS, with phrases merged across gaps shorter than 0.18 s. No speech model could be downloaded in this environment because Hugging Face and the Whisper weight hosts are blocked. Words were therefore matched to phrases by order and length against the anchors in the brief. Choices ก/ข/ค/ง, "เฉลย/ข้อ ค", the To/CC/BCC lists and the CTA line up exactly. Rows marked *(phrase)* are measured pauses whose exact wording could not be confirmed. The visuals on those rows make no new spoken claim.

Absolute time = segment start + local time. Frame = round(abs × 30).

## 01_hook.mp3 — starts 0.000 s, 25.391 s long

| beat | local s | abs s | frame | narration anchor | picture |
|---|---:|---:|---:|---|---|
| kw | 0.10 | 0.10 | 3 | เตรียมสอบนายสิบ! | Frame 0 already shows the keyword, headline, email window and 50 icons (no entrance) |
| comp | 1.42 | 1.42 | 43 | วิชาคอมพิวเตอร์ | Subject pill; email window types lines |
| fail | 2.74 | 2.74 | 82 | ข้อนี้หลายคนตอบผิด! | Red "ข้อนี้หลายคนตอบผิด!" pill |
| n50 | 5.06 | 5.06 | 152 | ถ้าคุณต้องส่งอีเมลถึงคน 50 คน | "50 RECIPIENTS", wave through grid, 50 delivery lines |
| priv | 7.68 | 7.68 | 230 | …ไม่ต้องการให้ใครเห็นที่อยู่อีเมลของผู้รับคนอื่น | Grid spreads, privacy shields, eye opens then closes; "ห้ามเห็นอีเมลของกันและกัน" |
| three | 10.96 | 10.96 | 329 | คุณจะเลือกช่อง… | Three neutral field cards + question mark |
| to | 12.38 | 12.38 | 371 | To | To card glows |
| cc | 13.20 | 13.20 | 396 | CC | CC card glows |
| bcc | 14.23 | 14.23 | 427 | หรือ BCC? | BCC card glows (same neutral style) |
| x1 | 16.28 | 16.28 | 488 | (phrase, 1.9 s) | Cursor hovers between the three fields |
| risk | 18.61 | 18.61 | 558 | เลือกผิดอาจเปิดเผยข้อมูลของคนอื่นโดยไม่ตั้งใจ! | Applicant 02 received view with other addresses in To, red outline |
| go | 22.48 | 22.48 | 674 | (phrase, 2.6 s) | "To · CC · BCC ต่างกันอย่างไร?" |

## 02_story.mp3 — starts 25.391 s, 29.074 s long

| beat | local s | abs s | frame | narration anchor | picture |
|---|---:|---:|---:|---|---|
| office | 0.08 | 25.47 | 764 | สมมติว่าคุณเป็นเจ้าหน้าที่ฝ่ายธุรการ | Office set, officer typing, caption |
| assign | 2.82 | 28.21 | 846 | ได้รับมอบหมายให้ส่งอีเมลแจ้งกำหนดการอบรมถึงผู้สมัคร 50 คน | Monitor notification; draft card "แจ้งกำหนดการอบรม", counter 0→50 คน |
| boss | 7.65 | 33.04 | 991 | (lead-in) | Supervisor walks in |
| rule | 9.10 | 34.49 | 1035 | ผู้สมัครแต่ละคนต้องไม่เห็นที่อยู่อีเมลของผู้สมัครคนอื่น! | Speech bubble "ต้องรักษาความเป็นส่วนตัวของผู้สมัคร" + blue shield; officer worried |
| open | 13.29 | 38.68 | 1160 | คุณเปิดหน้าต่างเขียนอีเมล | Camera dives into the monitor → full composer |
| fields | 15.11 | 40.50 | 1215 | (lead-in) | Recipient rows shimmer |
| to | 17.31 | 42.70 | 1281 | To | To row glows |
| cc | 18.09 | 43.48 | 1304 | CC | CC row glows |
| bcc | 18.95 | 44.34 | 1330 | และ BCC | BCC row glows |
| all | 20.59 | 45.98 | 1379 | (phrase) | "ผู้สมัคร 50 คน" tray, cursor moves between rows |
| diff | 23.27 | 48.66 | 1460 | (phrase) | Green ticks: every field delivers |
| diff2 | 25.40 | 50.79 | 1524 | (phrase) | Eye icons blink: visibility is the difference |
| which | 27.70 | 53.09 | 1593 | แล้วควรเลือกช่องไหน? | "ควรเลือกช่องไหน?" |

## 03_knowledge.mp3 — starts 54.465 s, 31.164 s long

| beat | local s | abs s | frame | narration anchor | picture |
|---|---:|---:|---:|---|---|
| to | 0.06 | 54.53 | 1636 | เริ่มจากช่อง To! | To row highlight, "To = ผู้รับหลัก" |
| toDef | 1.70 | 56.17 | 1685 | (To definition) | applicant01@example.com chip into To |
| toSend | 4.50 | 58.97 | 1769 | (phrase) | Send → envelope to primary recipient |
| cc | 6.95 | 61.42 | 1842 | CC ย่อมาจาก… | CC row highlight, chief@example.com into CC |
| ccFull | 8.61 | 63.08 | 1892 | Carbon… | "CARBON COPY" |
| ccDef | 9.42 | 63.89 | 1917 | …Copy / สำเนา | "สำเนา" |
| ccSend | 11.37 | 65.84 | 1975 | (phrase) | Send → main + copy recipient (distinct look, copy badge) |
| ccEx | 14.28 | 68.75 | 2062 | (phrase) | hold |
| vis | 17.30 | 71.77 | 2153 | รายชื่อในช่อง To และ CC… | Applicant 01 received view, eye icons on To and CC |
| vis2 | 20.50 | 74.97 | 2249 | …ผู้รับอีเมลสามารถมองเห็นได้! | "To · CC = รายชื่อที่ผู้รับเห็น" |
| wrong | 23.80 | 78.27 | 2348 | ถ้าเรานำอีเมลผู้สมัครทั้ง 50 คนมาใส่ในสองช่องนี้ | Sender composer: 50 addresses in To (red row) |
| warn | 27.68 | 82.15 | 2464 | อาจทำให้ผู้สมัครเห็นที่อยู่อีเมลของกันและกัน | Applicant 02 view shows others; "เสี่ยงเปิดเผยรายชื่อ" |

## 04_explanation.mp3 — starts 85.629 s, 38.113 s long

| beat | local s | abs s | frame | narration anchor | picture |
|---|---:|---:|---:|---|---|
| bcc | 0.07 | 85.70 | 2571 | …ต้องใช้ช่อง BCC! | Shield + BCC |
| full | 3.43 | 89.06 | 2672 | BCC ย่อมาจาก Blind Carbon Copy | BLIND / CARBON / COPY kinetic type |
| th | 6.14 | 91.77 | 2753 | (สำเนาลับ) | "สำเนาลับ" (yellow learning point) |
| sender | 8.14 | 93.77 | 2813 | (phrase) | Sender view: To staff@, BCC 01/02/03 +47, "50 คน" |
| send | 9.86 | 95.49 | 2865 | (phrase) | Cursor clicks ส่ง; composer folds into envelope |
| deliver | 11.37 | 97.00 | 2910 | (phrase) | One envelope → 50 delivery lines → grid |
| rcv | 14.77 | 100.40 | 3012 | ผู้รับคนอื่นจะไม่เห็นรายชื่อที่อยู่ในช่อง BCC | Applicant 01 view: From/To only, dashed "ไม่เห็นรายชื่อ BCC ของคนอื่น" |
| both | 21.11 | 106.74 | 3202 | แม้แต่ผู้รับ BCC ด้วยกัน… | Applicant 02 and 03 views |
| both2 | 23.00 | 108.63 | 3259 | …ก็จะไม่เห็นรายชื่อ BCC คนอื่น! | "ผู้รับ BCC ด้วยกันก็ไม่เห็นกัน" |
| to | 26.63 | 112.26 | 3368 | To คือผู้รับหลัก! | Card To — ผู้รับหลัก |
| cc | 28.16 | 113.79 | 3414 | CC คือผู้รับสำเนา… | Card CC — สำเนา |
| bccC | 29.70 | 115.33 | 3460 | BCC คือผู้รับสำเนาที่ซ่อนรายชื่อ… (inside the 28.16 phrase) | Card BCC — สำเนาลับ (cyan emphasis) |
| limit | 31.78 | 117.41 | 3522 | BCC ไม่ได้ป้องกันผู้รับจากการส่งต่อข้อความนะครับ! | Forward card "BCC ไม่ได้ห้ามส่งต่ออีเมล" |
| wrap | 35.94 | 121.57 | 3647 | (phrase) | hold |

## 05_quiz.mp3 — starts 123.742 s, 28.291 s long

| beat | local s | abs s | frame | narration anchor | picture |
|---|---:|---:|---:|---|---|
| title | 0.08 | 123.82 | 3715 | (intro) | เตรียมสอบนายสิบ + question box |
| q | 1.87 | 125.61 | 3768 | หากเจ้าหน้าที่ต้องส่งอีเมล… | Question lines appear one by one |
| a | 13.75 | 137.49 | 4125 | ก. To | option ก |
| b | 15.46 | 139.20 | 4176 | ข. CC | option ข |
| c | 17.51 | 141.25 | 4238 | ค. BCC | option ค (neutral) |
| d | 19.50 | 143.24 | 4297 | ง. Reply All | option ง |
| think | 21.86 | 145.60 | 4368 | (lead-in) | Privacy shield pulse |
| think2 | 22.95 | 146.69 | 4401 | ช่องไหนช่วยซ่อนรายชื่อผู้รับจากกันและกัน? | hold, all choices visible |
| cue | 26.39 | 150.13 | 4504 | ให้เวลาคิดห้าวินาที! | "คิด 5 วินาที" — ends 28.08 |

## COUNTDOWN — 152.033 → 157.033 s, frames 4561–4710 (exactly 150)

5 → 4 → 3 → 2 → 1, 30 frames each, with a tick on each second (tick2 on 1). There is no narration. The question and all four choices stay visible, ค is not highlighted, and there is one countdown only.

## 06_answer.mp3 — starts 157.033 s, 45.401 s long

| beat | local s | abs s | frame | narration anchor | picture |
|---|---:|---:|---:|---|---|
| sol | 0.06 | 157.09 | 4713 | เฉลย! | — |
| c | 1.05 | 158.08 | 4742 | ข้อ ค. | ค. BCC turns green + check + confetti; "เฉลย ข้อ ค. BCC" |
| bcc | 2.08 | 159.11 | 4773 | BCC! | hold |
| why | 4.03 | 161.06 | 4832 | BCC ใช้ส่งอีเมลโดยซ่อนรายชื่อผู้รับในช่องนี้จากผู้รับคนอื่น! | Side by side: ผู้ส่ง (eye) / ผู้รับ (eye-off) |
| fit | 8.60 | 165.63 | 4969 | จึงเหมาะกับสถานการณ์ที่ต้องส่งอีเมลถึงผู้สมัครจำนวนมาก… | 50 icons receive mail, shields |
| a | 17.10 | 174.13 | 5224 | ข้อ ก. To ใช้ระบุผู้รับหลัก | Row ก ✗ |
| b | 21.30 | 178.33 | 5350 | ข้อ ข. CC ใช้ส่งสำเนาให้ผู้รับทราบ | Row ข ✗ |
| d | 27.36 | 184.39 | 5532 | ข้อ ง. Reply All คือการตอบกลับทุกคนที่เกี่ยวข้อง | Row ง + Reply All button |
| dNot | 32.20 | 189.23 | 5677 | (…ไม่ใช่ช่องซ่อนรายชื่อ) | "ไม่ใช่ช่องซ่อนรายชื่อ" |
| sum | 35.04 | 192.07 | 5762 | (lead-in) | "จำง่าย ๆ" |
| to | 36.95 | 193.98 | 5820 | To ผู้รับหลัก! | To = ผู้รับหลัก |
| cc | 38.71 | 195.74 | 5872 | CC สำเนา! | CC = สำเนา |
| bcc2 | 40.90 | 197.93 | 5938 | BCC สำเนาลับ! | BCC = สำเนาลับ |
| fin | 43.42 | 200.45 | 6014 | (closing line) | "คำตอบ: ค. BCC" |

## 07_promotion.mp3 — starts 202.434 s, 16.353 s long

| beat | local s | abs s | frame | narration anchor | picture |
|---|---:|---:|---:|---|---|
| cm | 0.06 | 202.49 | 6075 | ใครตอบถูกข้อ ค. คอมเมนต์มาบอกกันหน่อย! | "ตอบ ค. ถูกไหม?" + comment bubbles |
| brand | 3.23 | 205.66 | 6170 | มาฝึกกับ NaiSibPro นายสิบโปร! | Official logo |
| bank | 5.81 | 208.24 | 6247 | รวมข้อสอบมากกว่าหมื่นข้อ | 10,000+ counter |
| week | 8.69 | 211.12 | 6334 | อัปเดตทุกสัปดาห์! | "อัปเดตทุกสัปดาห์!" |
| x | 10.67 | 213.10 | 6393 | (phrase) | Approved poster, shown whole |
| cta | 12.11 | 214.54 | 6436 | กดไลก์ กดแชร์ และกดติดตามไว้! | Like / share / follow pressed in turn |
| end | 14.70 | 217.13 | 6514 | (closing phrase) | End card (logo, tagline, เตรียมสอบนายสิบ); +1.2 s hold |
