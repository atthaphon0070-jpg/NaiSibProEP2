# EP.32 — Legal accuracy check (ลำดับศักดิ์ของกฎหมายไทย)

## Sources and how they were checked

The session's network policy blocked these hosts, so they could not be fetched: `constitutionalcourt.or.th`, `ilaw.or.th`, `huggingface.co`. The Office of the Council of State site was not attempted after those were refused.

- **Section 172:** a web search returned a summary of the 2017 Constitution's Section 172 with the wording "พระมหากษัตริย์จะทรงตราพระราชกำหนดให้ใช้บังคับดังเช่นพระราชบัญญัติก็ได้". It also returned the four purposes: ความปลอดภัยของประเทศ, ความปลอดภัยสาธารณะ, ความมั่นคงในทางเศรษฐกิจของประเทศ, ป้องปัดภัยพิบัติสาธารณะ. The source was iLaw, as summarised by the search tool.
- **Section 5:** the wording ("รัฐธรรมนูญเป็นกฎหมายสูงสุดของประเทศ … ขัดหรือแย้งต่อรัฐธรรมนูญ … เป็นอันใช้บังคับมิได้") was checked only against the reviewer's own knowledge of the 2017 Constitution. **It was not fetched from an official text in this session.**
- **Recommendation:** before release, a human should compare the on-screen Section 5 / 172 phrases against ราชกิจจานุเบกษา or ocs.go.th.

On-screen legal text is kept to short phrases that match the constitutional wording. No full section text is reproduced, and nothing is quoted that was not checked.

## Narration review

The narration was not transcribed, because the speech-recognition model download was blocked. Instead, key law names were located acoustically: each was matched against its spoken form in `05_quiz.mp3` using subsequence DTW on MFCCs. The positions found follow the script anchors in the brief:

- พ.ร.บ. = พ.ร.ก.: knowledge 28.74 / 31.94 / 36.68 / 38.98 s; answer 50.84 / 51.84 s.
- รัฐธรรมนูญ … มาตรา 172: answer 9.72 s.
- ก/ข/ง rejected as subordinate or local law: answer 28.08 / 33.71 / 38.09 s.

**No material legal error could be detected in this way, but the exact wording was not verified word-for-word.** A listener check is recommended (see the handoff).

## Checks

| # | Statement | What is on screen | Result |
|---|---|---|---|
| 1 | The Constitution is the supreme law | Gold apex tier "รัฐธรรมนูญ / กฎหมายสูงสุด". Card "กฎหมายสูงสุดของประเทศ · รัฐธรรมนูญ มาตรา 5". Card "กฎหมายอื่นขัดรัฐธรรมนูญไม่ได้ · ขัดหรือแย้ง → ใช้บังคับไม่ได้". Trap 1: "สูงสุด = รัฐธรรมนูญ". Recap fact card. | PASS |
| 2 | An Organic Act is its own category, not the Constitution | Separate pink tier "พระราชบัญญัติประกอบรัฐธรรมนูญ" below the Constitution. Card "ออกตามเรื่องที่รัฐธรรมนูญกำหนด · คนละฉบับกับรัฐธรรมนูญ". Trap 2 shows two separate documents with ≠ and "คนละฉบับ · ไม่ใช่ชื่อเรียกอื่น". No further claims about conflicts, repeal or amendment. | PASS |
| 3 | พ.ร.ก. has the force of a พ.ร.บ. | Both sit in the same blue tier as cards of equal size and height, with a central "=". Card "พ.ร.ก. ใช้บังคับดังเช่น พ.ร.บ. · ศักดิ์ระดับเดียวกัน". In Trap 3 and in the answer, the scale settles exactly level. The process panel separates them: "พ.ร.บ. → กระบวนการนิติบัญญัติ" and "พ.ร.ก. → เงื่อนไขตามรัฐธรรมนูญ · กรณีฉุกเฉิน จำเป็นรีบด่วน", so the procedures are not shown as identical. | PASS |
| 4 | Subordinate legislation is shown as examples | One navy tier "กฎหมายลำดับรอง" with chips "พ.ร.ฎ. · กฎกระทรวง · ข้อบัญญัติท้องถิ่น", side by side. Caption "ตัวอย่าง (ไม่ได้เรียงลำดับกันเอง)". No ranking among them. | PASS |
| 5 | Subordinate rules must stay within the enabling law's authority; the example is hypothetical | Story tag "สถานการณ์สมมติ · ไม่ใช่คดีจริง" is on screen for the whole story. Documents show only abstract lines, with no real provisions, seals or signatures. A link "พระราชบัญญัติ (กฎหมายแม่บท) → ให้อำนาจ → กฎกระทรวง (กฎหมายลำดับรอง)". Cards "ต้องอยู่ภายในอำนาจที่กฎหมายให้ไว้" and "ขัดกฎหมายแม่บทไม่ได้". | PASS |
| 6 | Section 172 is described accurately | "มาตรา 172" with the quote "ตราพระราชกำหนด ‘ให้ใช้บังคับดังเช่นพระราชบัญญัติ’" and the four purposes. "กรณีฉุกเฉิน จำเป็นรีบด่วน" paraphrases the section's second paragraph. Flow "ตราพระราชกำหนด → เสนอรัฐสภาพิจารณา · ตามกระบวนการที่รัฐธรรมนูญบัญญัติไว้ (ภาพอธิบายอย่างง่าย)". It does not suggest automatic approval or that a decree stays in force indefinitely. | PASS (official-text cross-check recommended, see above) |
| 7 | The exam answer is ค. พระราชกำหนด | The answer turns green with a ✓ only at 06_answer "ข้อ ค." (t = 222.017 s), after the countdown ends (220.967 s). ก, ข and ง get ✗ and drop into "กลุ่มกฎหมายลำดับรอง"; ง adds "ออกโดยองค์กรปกครองส่วนท้องถิ่น". The promo shows "ตอบ ค. ถูกไหม?". | PASS |

## Release-blocker review (legal)

- The Constitution is shown only as the supreme law. ✔
- พ.ร.บ. and พ.ร.ก. are never shown at different levels. Every scale with both cards settles level. ✔
- Subordinate laws are never given the force of an Act. ✔
- The Organic Act is never labelled as the Constitution. ✔
- No invented statutes, case citations or court decisions. The office case is labelled as hypothetical. ✔
- A caption marks the pyramid as an educational overview: "แผนภาพสรุปเพื่อการศึกษา". ✔
