# EP.36 legal logic check

**Result: PASS on all 7 release-blocking items.**

Legal basis (Thai Civil and Commercial Code, ป.พ.พ.):
- **ม.139**: อสังหาริมทรัพย์ means land, things attached to land permanently or forming one body with it, and real rights over those things.
- **ม.140**: สังหาริมทรัพย์ means all other property, including rights over that property.
- **ม.456 วรรคหนึ่ง**: a sale of immovable property not made in writing and registered with the competent official is void. The same rule applies to ships of 5 tons and over, rafts and beasts of burden.
- **Car**: an ordinary car is a movable. The transferor and transferee must notify the registrar of the transfer under the motor-vehicle law (กฎหมายว่าด้วยรถยนต์). That is an administrative registration duty, not the s.456 form-of-sale validity rule. On screen it is described only as "กฎหมายว่าด้วยรถยนต์", without a section number.

All on-screen legal wording comes from one data file, `source/legal_categories.js`. The quiz key is in `source/quiz_logic.js`, which **throws at page load** in any of these cases:
- the quiz does not have exactly one keyed answer;
- the key is not option ค;
- the key is not the only choice that appears in the s.456 para 1 list;
- the car is flagged as a s.456 item.

The page loaded without errors in QC (`safe_zone_report.json → page_errors: []`, `quiz.errors: []`).

| # | Check | Where | Result |
|---|---|---|---|
| 1 | House/land is presented as immovable property | Hook tag "อสังหาริมทรัพย์" under บ้าน + ที่ดิน. Scene 03A: ม.139 definition with examples ที่ดิน / บ้านติดที่ดิน / ไม้ยืนต้น. Answer row 1 | PASS |
| 2 | Car is presented as movable property | Hook tag "สังหาริมทรัพย์". Scene 03B example tile. 04A "รถยนต์มีทะเบียน = สังหาริมทรัพย์". 04B "รถยนต์ทั่วไป = สังหาริมทรัพย์ทั่วไป". Answer 07C and summary | PASS |
| 3 | Ships of 5 tons and over are placed under s.456 para 1 | 03C card "เรือมีระวางตั้งแต่ 5 ตันขึ้นไป" with a ≥ 5 ตัน badge. 04B ship rule "ต้องทำเป็นหนังสือและจดทะเบียน / มิฉะนั้นเป็นโมฆะ". Answer panel "ป.พ.พ. ม.456 วรรคหนึ่ง" lists อสังหาริมทรัพย์, เรือ 5 ตันขึ้นไป, แพ, สัตว์พาหนะ | PASS |
| 4 | Car registration is kept separate from s.456 sale validity | 04A: "โดยหลัก ไม่ต้องจดทะเบียนนิติกรรมตาม ม.456 สัญญาก็สมบูรณ์" and "ผู้โอน + ผู้รับโอน แจ้งการโอนต่อนายทะเบียน (เรื่องทะเบียนรถ — คนละเรื่องกับแบบซื้อขาย ม.456)". 04B split screen with ≠ and "ไม่ใช่เรื่องเดียวกัน!". Hint in the quiz | PASS |
| 5 | Correct answer is option ค (เรือมีระวางตั้งแต่ 5 ตันขึ้นไป) | `QUIZ.correct = 2` (ค); the reveal highlights ค only. Narration 06 says "เฉลย ข้อ ค" | PASS |
| 6 | No scene implies a car falls under s.456 para 1 | Every on-screen string that contains "456" or "ทะเบียน" was extracted from the page (49 strings) and reviewed. Each car mention is either "ไม่ใช่ ม.456" or a reference to vehicle registration/transfer. The promo line "ใครเคยคิดว่ารถยนต์ต้องจดทะเบียนซื้อขายเหมือนเรือบ้าง?" is framed as the misconception | PASS |
| 7 | No scene implies every registered property follows the same sale-form rule | Hook "มีทะเบียนเหมือนกัน แต่กฎหมายไม่เหมือนกัน". Memory hook "มีทะเบียน ≠ ต้องจดทะเบียนนิติกรรมซื้อขายตาม ม.456 เสมอไป". Final จุดจำ "มีทะเบียน ≠ กฎหมายซื้อขายเหมือนกัน" | PASS |

Other notes:
- Wrong options ข (รถจักรยานยนต์) and ง (โทรศัพท์มือถือ) are explained as ordinary movables and marked ✗. Option ก (car) is marked ✗ as well.
- The ship in the summary is labelled "สังหาริมทรัพย์ตามกฎหมาย / เข้าหลัก ม.456 วรรคหนึ่ง", which is the series' "สังหาริมทรัพย์ชนิดพิเศษ" teaching term. It is not presented as immovable.
- The narration was not checked word for word against an official transcript. The speech-recognition pass was used for timing only, and its output was approximate. The on-screen text follows the brief and the statutes; it does not quote the voice.
