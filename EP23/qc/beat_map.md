# EP23 beat map

Times are measured from the real recordings. Phrase starts come from pause segmentation (−38 dBFS, ≥140 ms gaps); words inside a phrase come from syllable-nucleus dips on the 10 ms energy envelope, matched to the transcript syllables. Every phrase was transcribed with a local Whisper-small recogniser (sherpa-onnx, used for timing and content checks only, never for audio). Optional lines: 04 "หรือ โพสต์" IS spoken (11.26–12.28 s); 06 "ฮาร์ดดิสก์จึงเหมือนตู้เก็บเอกสาร…ไม่มีงานให้ทำ" IS spoken (13.19–19.16 s).
Absolute time = file start (timeline.json) + file-relative time. Frame = round(absolute × 30). Visuals are keyed to these exact times in `source/beats.js`, so every reveal is within ±1 frame of its cue.

Countdown: 106.867–111.867 s = frames 3206–3355 (150 frames, no narration).

## 01_hook.mp3 (start 0.000 s, frame 0)

| beat | file s | abs s | frame | spoken → visual |
|---|---:|---:|---:|---|
| kw | 0.073 | 0.073 | 2 | เตรียมสอบนายสิบตำรวจ! (keyword already on screen at frame 0: PC + finger on the power button) |
| must | 1.736 | 1.736 | 52 | คดีนี้ต้องรู้! → pink chip |
| press | 3.474 | 3.474 | 104 | กดปุ่มเปิดคอม → finger presses, click |
| btn | 3.650 | 3.650 | 110 | ปุ่ม → button sinks |
| open | 3.880 | 3.880 | 116 | เปิดคอม → LED flickers once |
| but | 4.804 | 4.804 | 144 | แต่… |
| dark | 5.120 | 5.120 | 154 | จอดำสนิท → monitor/LED/room go dark (keyword stays bright), red chip |
| noSnd | 6.247 | 6.247 | 187 | ไม่มีเสียง → speaker icon, ✗ |
| noPic | 7.196 | 7.196 | 216 | ไม่มีภาพ → monitor icon, ✗ |
| nothing | 8.054 | 8.054 | 242 | ไม่มีอะไรเลย → chip |
| who | 9.538 | 9.538 | 286 | ผู้ต้องหา → crime-scene tape sweeps, red "ผู้ต้องหา…", short siren |
| whoQ | 10.559 | 10.559 | 317 | คือใคร → "คือใคร?" |
| end | 11.009 | 11.009 | 330 | speech ends |

## 02_story.mp3 (start 11.533 s, frame 346)

| beat | file s | abs s | frame | spoken → visual |
|---|---:|---:|---:|---|
| tip | 0.047 | 11.580 | 347 | สายสืบได้รับแจ้งเหตุ → walkie-talkie buzz, case folder slides in, "คดีด่วน" stamp (+0.95 s) |
| newbie | 2.072 | 13.605 | 408 | มือใหม่คนหนึ่ง → desk + box |
| buy | 3.253 | 14.786 | 444 | ซื้อชิ้นส่วน… |
| build | 4.220 | 15.753 | 473 | ประกอบคอมเอง → box opens, parts pop out |
| pressed | 5.401 | 16.934 | 508 | แต่กดเปิดแล้ว → dark PC, press |
| noOn | 6.614 | 18.147 | 544 | ไม่ติด → floating "?" + red "ไม่ติด!" |
| call | 7.624 | 19.157 | 575 | เราจึงเรียกผู้ต้องหาทั้งห้า → lineup wall drops in |
| line | 9.650 | 21.183 | 636 | เข้าแถว → "มาเข้าแถว!" |
| psu | 10.765 | 22.298 | 669 | พาวเวอร์ซัพพลาย → suspect 1 walks in + name |
| mb | 12.090 | 23.623 | 709 | เมนบอร์ด → suspect 2 |
| cpu | 13.083 | 24.616 | 738 | ซีพียู → suspect 3 |
| ram | 14.139 | 25.672 | 770 | แรม → suspect 4 |
| and | 14.781 | 26.314 | 789 | และ… |
| hdd | 15.080 | 26.613 | 798 | ฮาร์ดดิสก์ → suspect 5 |
| who | 16.103 | 27.636 | 829 | ใครคือตัวการ → nervous wobble, red chip |
| ask | 17.268 | 28.801 | 864 | มาสอบปากคำกัน → spotlight snaps on |
| end | 18.400 | 29.933 | 898 | speech ends |

## 03_knowledge.mp3 (start 30.433 s, frame 913)

| beat | file s | abs s | frame | spoken → visual |
|---|---:|---:|---:|---|
| s1 | 0.067 | 30.500 | 915 | ผู้ต้องหารายที่หนึ่ง → suspect 1 to the table |
| psu | 1.919 | 32.352 | 971 | พาวเวอร์ซัพพลาย → case file pops (typewriter) |
| elec | 3.790 | 34.223 | 1027 | ไฟฟ้า → ⚡ + "= ไฟฟ้า" |
| feed | 4.775 | 35.208 | 1056 | จ่ายไฟให้ทุกชิ้น → current runs to the parts |
| noPow | 6.413 | 36.846 | 1105 | ไม่มีไฟ ก็ไม่มีอะไรทำงาน |
| nothing | 7.310 | 37.743 | 1132 | ก็ไม่มีอะไรทำงาน |
| e1 | 8.324 | 38.757 | 1163 | phrase end → "ขาดไม่ได้" stamp at +0.08 s |
| s2 | 9.086 | 39.519 | 1186 | รายที่สอง |
| mb | 10.259 | 40.692 | 1221 | เมนบอร์ด → file 2 |
| house | 11.750 | 42.183 | 1266 | บ้าน → 🏠 + "= บ้าน" |
| plug | 12.607 | 43.040 | 1291 | ทุกชิ้นต้องเสียบอยู่บนนี้ → CPU + RAM snap on |
| e2 | 14.210 | 44.643 | 1339 | phrase end → stamp |
| s3 | 14.866 | 45.299 | 1359 | รายที่สาม |
| cpu | 15.921 | 46.354 | 1391 | ซีพียู → file 3 |
| brain | 17.180 | 47.613 | 1428 | สมองของเครื่อง → 🧠, thought waves |
| noBrain | 18.477 | 48.910 | 1467 | ไม่มีสมอง ก็คิดอะไรไม่ได้ |
| e3 | 20.426 | 50.859 | 1526 | phrase end → stamp |
| s4 | 21.015 | 51.448 | 1543 | รายที่สี่ |
| ram | 22.000 | 52.433 | 1573 | แรม → file 4 |
| desk | 23.220 | 53.653 | 1610 | โต๊ะทำงาน → 🗂️ desk, files land |
| noRam | 24.320 | 54.753 | 1643 | ไม่มีแรม → small PC appears |
| fail | 25.820 | 56.253 | 1688 | ไม่ผ่านการตรวจตอนเปิด |
| beep | 28.180 | 58.613 | 1758 | ปี๊บ → red sound-wave rings + "ปี๊บ!" + soft beep |
| e4 | 28.797 | 59.230 | 1777 | phrase end → stamp |
| all | 29.343 | 59.776 | 1793 | ทั้งสี่ราย → four stamped files line up |
| must | 30.420 | 60.853 | 1826 | ขาดไม่ได้ → big red text, stamps pulse |
| end | 31.234 | 61.667 | 1850 | speech ends |

## 04_explanation.mp3 (start 62.233 s, frame 1867)

| beat | file s | abs s | frame | spoken → visual |
|---|---:|---:|---:|---|
| path | 0.065 | 62.298 | 1869 | มาดูเส้นทางคดีกัน → cork board |
| press | 1.863 | 64.096 | 1923 | กดปุ่มเปิด → power-button pin |
| pow | 3.349 | 65.582 | 1967 | ไฟ… → string to the ⚡ pin |
| psu | 3.730 | 65.963 | 1979 | พาวเวอร์ซัพพลาย → ⚡ pin pops |
| run | 4.942 | 67.175 | 2015 | วิ่งเข้า… → string ⚡ → 🏠 with light pulse |
| mb | 5.470 | 67.703 | 2031 | เมนบอร์ด → 🏠 pin |
| check | 6.542 | 68.775 | 2063 | เครื่องจะตรวจ… |
| brain | 7.130 | 69.363 | 2081 | สมอง → 🧠 pin, ✓ |
| desk | 7.720 | 69.953 | 2099 | โต๊ะทำงาน → 🗂️ pin, ✓ |
| called | 8.775 | 71.008 | 2130 | เรียกว่า |
| postTh | 9.636 | 71.869 | 2156 | การตรวจตอนเปิดเครื่อง → green label |
| or | 11.259 | 73.492 | 2205 | หรือ |
| post | 11.793 | 74.026 | 2221 | โพสต์ (spoken) → "POST ✓" |
| pass | 12.906 | 75.139 | 2254 | ถ้าผ่าน → string to the monitor |
| bios | 14.660 | 76.893 | 2307 | ไบออส → monitor shows generic BIOS |
| memo | 15.650 | 77.883 | 2336 | จำง่าย ๆ ว่า |
| fai | 17.021 | 79.254 | 2378 | ไฟ → ⚡ |
| baan | 17.670 | 79.903 | 2397 | บ้าน → 🏠 |
| samong | 18.349 | 80.582 | 2417 | สมอง → 🧠 |
| to | 19.236 | 81.469 | 2444 | โต๊ะ → 🗂️ |
| kad | 19.867 | 82.100 | 2463 | ขาดตัวไหน ไม่ติด → big yellow rule (line 2 at +0.55 s) |
| kadEnd | 21.237 | 83.470 | 2504 | phrase end (rest beat to "แต่เดี๋ยวก่อน") |
| wait | 21.872 | 84.105 | 2523 | แต่เดี๋ยวก่อน → freeze flash, room darkens, spotlight swings |
| s5 | 22.923 | 85.156 | 2555 | ผู้ต้องหารายที่ห้า → spotlight on the Hard Disk, nervous |
| hdd | 24.367 | 86.600 | 2598 | ฮาร์ดดิสก์ → name |
| notYet | 25.299 | 87.532 | 2626 | ยังไม่ได้ตัดสิน → empty file with yellow "?" |
| end | 26.286 | 88.519 | 2656 | speech ends |

## 05_quiz.mp3 (start 89.067 s, frame 2672)

| beat | file s | abs s | frame | spoken → visual |
|---|---:|---:|---:|---|
| go | 0.071 | 89.138 | 2674 | ถึงเวลาตัดสินคดี → QUIZ banner + gavel strike |
| q | 1.992 | 91.059 | 2732 | อุปกรณ์ใดต่อไปนี้ → question line 1 |
| ifNo | 3.465 | 92.532 | 2776 | ถ้าไม่มี → line 2, yellow highlight |
| comp | 4.498 | 93.565 | 2807 | คอมพิวเตอร์ |
| still | 5.070 | 94.137 | 2824 | ยังเปิดติด → line 3, yellow highlight |
| bios | 5.983 | 95.050 | 2851 | และเข้าหน้าไบออสได้ → line 4 |
| o1 | 8.098 | 97.165 | 2915 | ข้อ ก. → card 1 |
| v1 | 8.882 | 97.949 | 2938 | ซีพียู |
| o2 | 10.093 | 99.160 | 2975 | ข้อ ข. → card 2 |
| v2 | 10.920 | 99.987 | 3000 | แรม |
| o3 | 11.852 | 100.919 | 3028 | ข้อ ค. → card 3 |
| v3 | 12.649 | 101.716 | 3051 | พาวเวอร์ซัพพลาย |
| o4 | 13.936 | 103.003 | 3090 | ข้อ ง. → card 4 |
| v4 | 14.724 | 103.791 | 3114 | ฮาร์ดดิสก์ |
| think | 15.967 | 105.034 | 3151 | ให้เวลาคิดห้าวินาที → countdown ring shows 5 |
| end | 17.562 | 106.629 | 3199 | speech ends; countdown starts at the next frame boundary |

## 06_answer.mp3 (start 111.867 s, frame 3356)

| beat | file s | abs s | frame | spoken → visual |
|---|---:|---:|---:|---|
| verdict | 0.066 | 111.933 | 3358 | คำตัดสิน → banner + gavel |
| d | 1.419 | 113.286 | 3399 | ข้อ ง. → card ง green ✓ ×1.08, others 40 %, gavel |
| hdd | 2.577 | 114.444 | 3433 | ฮาร์ดดิสก์ → chime + confetti |
| noHdd | 3.856 | 115.723 | 3472 | ไม่มีฮาร์ดดิสก์ → PC with an empty drive bay + monitor |
| stillOn | 5.221 | 117.088 | 3513 | ยังเปิดติด → LED on, fan glow, "ยังเปิดติด ✓" |
| bios | 7.060 | 118.927 | 3568 | ไบออส → BIOS screen, "เข้าหน้าไบออสได้ ✓" |
| win | 8.500 | 120.367 | 3611 | วินโดวส์ → "ไม่พบอุปกรณ์สำหรับบูต" screen, OS window icon |
| winNo | 8.960 | 120.827 | 3625 | ไม่ได้ → red ✗ |
| os | 10.096 | 121.963 | 3659 | เพราะระบบปฏิบัติการ → chip, OS icon + arrow + Hard Disk |
| stored | 11.360 | 123.227 | 3697 | ถูกเก็บไว้… → OS icon flies into the Hard Disk |
| cab0 | 13.190 | 125.057 | 3752 | ฮาร์ดดิสก์จึงเหมือน… (OPTIONAL line, spoken) → house + chip |
| cab | 14.510 | 126.377 | 3791 | ตู้เก็บเอกสาร → 🗄️ cabinet |
| noCab | 15.888 | 127.755 | 3833 | ไม่มีตู้ → cabinet gone, ✗ |
| house | 16.784 | 128.651 | 3860 | ก็ยังเข้าบ้านได้ → door opens |
| noWork | 18.160 | 130.027 | 3901 | แต่ไม่มีงานให้ทำ → empty desk |
| rest | 19.649 | 131.516 | 3945 | ส่วน… → cards return as the essentials list |
| cpu | 19.810 | 131.677 | 3950 | ซีพียู → card ก brightens, "ขาดไม่ได้" stamp, ✗ |
| ram | 20.992 | 132.859 | 3986 | แรม → card ข |
| psu | 21.490 | 133.357 | 4001 | พาวเวอร์ซัพพลาย → card ค |
| kad | 22.896 | 134.763 | 4043 | ขาดตัวไหน |
| sure | 23.931 | 135.798 | 4074 | เครื่องไม่ติดแน่นอน |
| dont | 25.652 | 137.519 | 4126 | และอย่าลืม → note box |
| gpuIf | 26.538 | 138.405 | 4152 | ถ้าซีพียูไม่มีกราฟิกในตัว → graphics-card icon + label |
| gpuNo | 27.690 | 139.557 | 4187 | ไม่มีกราฟิก… |
| card | 29.190 | 141.057 | 4232 | การ์ดจอ → "ต้องมีการ์ดจอ" |
| see | 30.178 | 142.045 | 4261 | ถึงจะเห็นภาพ |
| memo | 31.535 | 143.402 | 4302 | จำไว้เลย |
| fai | 32.722 | 144.589 | 4338 | ไฟ |
| baan | 33.190 | 145.057 | 4352 | บ้าน |
| samong | 33.770 | 145.637 | 4369 | สมอง |
| to | 34.605 | 146.472 | 4394 | โต๊ะ |
| kad2 | 35.191 | 147.058 | 4412 | ขาดตัวไหน → yellow rule line 1 |
| noOn | 36.203 | 148.070 | 4442 | ไม่ติด → line 2 (hold to the end of 06) |
| end | 36.690 | 148.557 | 4457 | speech ends |

## 07_promotion.mp3 (start 149.167 s, frame 4475)

| beat | file s | abs s | frame | spoken → visual |
|---|---:|---:|---:|---|
| closed | 0.072 | 149.239 | 4477 | ปิดคดีเรียบร้อย → folder closes, green "ปิดคดี" stamp (+0.62 s) |
| who | 1.648 | 150.815 | 4524 | ใครตอบถูก |
| comment | 2.660 | 151.827 | 4555 | คอมเมนต์ → comment icon |
| hdd | 3.433 | 152.600 | 4578 | ฮาร์ดดิสก์ → bubble "ฮาร์ดดิสก์ ✓" |
| now | 4.221 | 153.388 | 4602 | มาเลย |
| practice | 5.436 | 154.603 | 4638 | อยากฝึกข้อสอบคอมพิวเตอร์… → suspects parade |
| goto | 8.002 | 157.169 | 4715 | ไปที่ → real logo centre |
| brand | 8.641 | 157.808 | 4734 | นายสิบโปร → name |
| exams | 9.776 | 158.943 | 4768 | ข้อสอบมากกว่า → counter runs |
| tenk | 10.680 | 159.847 | 4795 | หมื่น → "10,000+" |
| weekly | 11.487 | 160.654 | 4820 | อัปเดตทุกสัปดาห์ |
| follow | 12.821 | 161.988 | 4860 | กดติดตามไว้ → button + tap |
| next | 13.940 | 163.107 | 4893 | คดีหน้า → new folder with "?" slides in |
| bye | 14.862 | 164.029 | 4921 | เจอกัน → logo hold |
| end | 15.392 | 164.559 | 4937 | speech ends |
