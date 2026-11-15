// EP52 narration beat map — local times (seconds from the start of each recording).
// Measured from the supplied ElevenLabs files (speech/pause detection, -38 dBFS, 20 ms RMS);
// every value is the measured start of a spoken phrase, mapped in order to the script's voice anchors.
// See ../qc/beat_map.md for the full phrase list of every file.
window.BEATS = {
  hook: {
    title: 0.11,        // "เตรียมสอบนายสิบตำรวจ!"
    subject: 1.63,      // "วิชาภาษาอังกฤษ!"
    go: 3.09,           // "Did you go"
    went: 4.23,         // "หรือ Did you went"
    which: 5.95,        // "แบบไหนถูกกันแน่?"
    easy: 7.62,         // "ข้อนี้ดูเหมือนง่ายมาก"
    trap: 9.26,         // "แต่หลายคนพลาดกันบ่อย!"
    yday: 11.21,        // "เพราะพอเห็นคำว่า yesterday"
    v2: 13.08,          // "ก็รีบเลือกกริยาช่องสองทันที"
    did: 15.42,         // "ถ้ามีคำว่า Did อยู่แล้ว"
    still: 18.40,       // "กริยาหลักยังต้องเป็นช่องสอง…"
    q: 20.95,           // "…อีกหรือเปล่า?"
  },
  story: {
    yday: 0.08,         // "เมื่อวาน"
    officer: 2.16,      // "มีเจ้าหน้าที่ตำรวจคนหนึ่งไปทำงานตามปกติ"
    ask: 6.09,          // lead-in to the question
    thq: 8.61,          // "เมื่อวานเจ้าหน้าที่ตำรวจไปทำงานหรือไม่"
    did: 11.83,         // "เราจะขึ้นต้นประโยคด้วยคำว่า Did"
    trap: 14.65,        // "หลายคนเผลอตอบว่า went"
    past: 17.79,        // "เพราะเป็นเหตุการณ์ในอดีต"
    but: 20.07,         // "แต่จริง ๆ แล้ว"
    rule: 21.64,        // "มีกฎสำคัญซ่อนอยู่ครับ!"
  },
  know: {
    aux: 0.08,          // "Did เป็นตัวช่วยบอกว่าเป็นอดีตอยู่แล้ว"
    rule: 5.29,         // "เมื่อมี Did นำหน้า กริยาหลักต้องกลับเป็นรูปพื้นฐาน"
    v1: 8.39,
    ex0: 11.74,
    ex1: 12.90,         // "Did you go to school yesterday?"
    ex2: 14.91,         // "Did he work last night?"
    ex3: 16.53,         // "Did they play football?"
    no1: 18.17,         // "ไม่ใช้ went"
    no2: 19.12,         // "worked"
    no3: 20.03,         // "หรือ played ครับ"
    recap: 21.18,
  },
  expl: {
    yday: 0.08,         // "เห็นคำว่า yesterday"
    v2: 3.38,           // "แล้วรีบเปลี่ยนกริยาเป็นช่องสองทันที"
    stmt: 6.17,         // "He went to work yesterday."
    ok: 9.52,
    did: 11.41,         // "แต่ถ้ามี Did แล้ว"
    q: 13.55,           // "Did he go to work yesterday?"
    ul: 15.12,
    wrong: 17.72,       // "ไม่ใช่ Did he went to work yesterday"
    memo: 20.55,
    memo2: 22.98,       // "Did มา กริยากลับรูปเดิม!"
  },
  quiz: {
    hdr: 0.07,
    q: 1.95,            // question read
    th: 5.33,           // Thai meaning
    opts: [12.94, 14.65, 16.40, 18.31],   // "กอ ไก่ go" / "ขอ ไข่ went" / "คอ ควาย goes" / "งอ งู going"
    optsEnd: [14.19, 16.03, 18.04, 19.83],
    which: 20.33,
    think: 25.49,       // "ให้เวลาคิดห้าวินาที!"
  },
  ans: {
    reveal: 0.08,       // "เฉลย!"
    choice: 1.02,       // "ข้อ กอ ไก่ go!"
    full: 4.86,         // "Did the police officer go to work yesterday?"
    why: 7.74,          // "Did เป็นตัวช่วยที่บอกอดีตอยู่แล้ว"
    v1: 10.07,
    base: 12.14,        // "กริยาหลักจึงต้องใช้รูปพื้นฐาน คือ go ไม่ใช่ went"
    notwent: 15.84,
    stmt: 16.99,        // "The police officer went to work yesterday."
    stmt2: 18.19,
    stmt3: 20.82,
    rule: 23.78,        // "Did บวกกริยาช่องหนึ่ง"
    ok: 25.50,          // "Did go ถูก"
    bad: 26.97,         // "Did went ผิด!"
    fin: 27.97,
  },
  promo: {
    comment: 0.06,      // "ใครตอบถูกข้อ กอ ไก่ คอมเมนต์มาบอกกันหน่อย!"
    err: 3.42,          // "คุณเคยเผลอใช้ Did went หรือเปล่า?"
    fix: 4.67,
    brand: 7.40,        // "มาฝึกกับ NaiSibPro นายสิบโปร!"
    bank: 10.26,        // "รวมข้อสอบมากกว่าหมื่นข้อ"
    weekly: 13.15,      // "อัปเดตทุกสัปดาห์!"
    like: 15.22,        // "กดไลก์"
    share: 16.64,       // "กดแชร์"
    follow: 17.44,      // "และกดติดตามไว้!"
    end: 19.43,
  },
};
