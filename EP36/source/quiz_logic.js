// EP.36 quiz — question, choices and the answer key, validated against LEGAL_DATA.
window.QUIZ = {
  header: 'เตรียมสอบนายสิบ | วิชากฎหมาย',
  lines: ['ข้อใดเป็นสังหาริมทรัพย์ที่การซื้อขาย', 'เสร็จเด็ดขาด ต้องทำเป็นหนังสือ', 'และจดทะเบียนต่อพนักงานเจ้าหน้าที่', 'มิฉะนั้นเป็นโมฆะ', 'ตาม ป.พ.พ. มาตรา 456 วรรคหนึ่ง?'],
  options: [['ก', 'รถยนต์ส่วนบุคคลทั่วไป', false], ['ข', 'รถจักรยานยนต์', false], ['ค', 'เรือมีระวางตั้งแต่ 5 ตันขึ้นไป', true], ['ง', 'โทรศัพท์มือถือ', false]],
  hint: 'อย่าสับสนระหว่างทะเบียนรถ กับ ม.456',
  countdown: { seconds: 5, framesPerNumber: 30 },
};
// self-check: exactly one keyed answer, it is option ค, and it is the only choice listed in s.456 para 1
(function () {
  const Q = window.QUIZ, L = window.LEGAL_DATA;
  const keyed = Q.options.filter(o => o[2]);
  const in456 = Q.options.filter(o => L.s456p1.items.includes(o[1]));
  const errs = [];
  if (keyed.length !== 1) errs.push('quiz must have exactly one correct option');
  if (!keyed[0] || keyed[0][0] !== 'ค') errs.push('correct option must be ค');
  if (in456.length !== 1 || in456[0] !== keyed[0]) errs.push('the keyed option must be the only s.456 para 1 item among the choices');
  if (L.anchors.car.in456) errs.push('car must not be treated as a s.456 para 1 item');
  Q.correct = Q.options.findIndex(o => o[2]);
  Q.errors = errs;
  if (errs.length) throw new Error('QUIZ LOGIC: ' + errs.join('; '));
})();
