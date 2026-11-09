// EP.46 data: the complete score-checking flowchart (world px; at zoom 1 it sits inside the
// mobile safe zone X 220–860, Y 350–1430) and the official four-choice exam question.
// Loaded by the page (window.SPEC) and by the QC validator (require()).
(function (root) {
  const nodes = [
    { id: 'start',    kind: 'terminator', cx: 540, cy: 410,  w: 280, h: 96,  label: 'เริ่มต้น', en: 'START' },
    { id: 'input',    kind: 'io',         cx: 540, cy: 565,  w: 360, h: 110, label: 'รับคะแนน', en: 'INPUT' },
    { id: 'decision', kind: 'decision',   cx: 540, cy: 790,  w: 400, h: 230, label: 'คะแนน ≥ 60 ?', en: 'DECISION' },
    { id: 'out_pass', kind: 'io',         cx: 370, cy: 1075, w: 300, h: 120, label: 'แสดงผล<br><b>ผ่าน</b>', en: 'OUTPUT', result: 'ผ่าน' },
    { id: 'out_fail', kind: 'io',         cx: 710, cy: 1075, w: 300, h: 120, label: 'แสดงผล<br><b>ไม่ผ่าน</b>', en: 'OUTPUT', result: 'ไม่ผ่าน' },
    { id: 'end',      kind: 'terminator', cx: 540, cy: 1350, w: 280, h: 96,  label: 'สิ้นสุด', en: 'END' },
  ];
  // pts: polyline from the source symbol's outline to the target symbol's outline; the arrowhead is drawn at the last point.
  const edges = [
    { id: 'e_start_in', from: 'start',    to: 'input',    pts: [[540, 458], [540, 508]] },
    { id: 'e_in_dec',   from: 'input',    to: 'decision', pts: [[540, 620], [540, 673]] },
    { id: 'e_yes',      from: 'decision', to: 'out_pass', pts: [[340, 790], [290, 790], [290, 1013]], branch: 'yes', label: 'ใช่', labelAt: [292, 742] },
    { id: 'e_no',       from: 'decision', to: 'out_fail', pts: [[740, 790], [790, 790], [790, 1013]], branch: 'no', label: 'ไม่ใช่', labelAt: [788, 742] },
    { id: 'e_pass_end', from: 'out_pass', to: 'end',      pts: [[370, 1135], [370, 1350], [398, 1350]] },
    { id: 'e_fail_end', from: 'out_fail', to: 'end',      pts: [[710, 1135], [710, 1350], [682, 1350]] },
  ];
  const SHAPE_TH = { io: 'ด้านขนาน', process: 'สี่เหลี่ยมผืนผ้า', decision: 'ข้าวหลามตัด', terminator: 'วงรี' };
  const quiz = {
    program: 'โปรแกรมตรวจผลสอบ',
    steps: ['รับคะแนน', 'ตรวจว่าคะแนน ≥ 60 หรือไม่', 'แสดงผล ผ่าน / ไม่ผ่าน'],
    question: 'สัญลักษณ์หลักทั้งสามขั้นตอนควรเรียงอย่างไร?',
    options: [
      { letter: 'ก', seq: ['io', 'decision', 'io'] },
      { letter: 'ข', seq: ['process', 'decision', 'process'] },
      { letter: 'ค', seq: ['decision', 'io', 'process'] },
      { letter: 'ง', seq: ['io', 'process', 'decision'] },
    ],
    correct: 0,
  };
  quiz.options.forEach(o => { o.text = o.seq.map(k => SHAPE_TH[k]).join(' → '); });
  const SPEC = { nodes, edges, quiz, SHAPE_TH };
  if (typeof module !== 'undefined' && module.exports) module.exports = SPEC; else root.SPEC = SPEC;
})(typeof window !== 'undefined' ? window : globalThis);
