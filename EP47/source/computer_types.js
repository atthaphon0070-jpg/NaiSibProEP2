// EP47 educational content: the five textbook computer categories, the official quiz and the
// on-screen wording. Everything the scenes print comes from here, so the QC script can check it.
// These five are an educational grouping (purpose / typical workload), NOT a speed ranking and
// NOT five mutually exclusive modern technical classes.
window.CT = {
  palette: {
    navy: '#142B53', blue: '#2F6BFF', cyan: '#22D3EE', light: '#95BFEF', ice: '#E6F4FF',
    pink: '#EE7FAA', yellow: '#FFD23F', green: '#22C55E', red: '#EF4444', text: '#31445D',
  },
  // order = narration order (not a ranking)
  types: [
    { key: 'micro', en: 'MICROCOMPUTER', short: 'MICRO', th: 'ไมโครคอมพิวเตอร์', role: 'คอมพิวเตอร์ส่วนบุคคล',
      recap: 'งานส่วนบุคคล', env: 'office', job: 'งานทั่วไป', jobIcon: 'doc',
      examples: ['PC ตั้งโต๊ะ', 'โน้ตบุ๊ก'] },
    { key: 'ws', en: 'WORKSTATION', short: 'WORKSTATION', th: 'เวิร์กสเตชัน', role: 'งานเฉพาะทางสมรรถนะสูง',
      recap: 'งานเฉพาะทาง', env: 'studio', job: 'โมเดล 3 มิติ', jobIcon: 'cube',
      examples: ['3D', 'CAD', 'วิศวกรรม'] },
    { key: 'mini', en: 'MINICOMPUTER', short: 'MINI', th: 'มินิคอมพิวเตอร์', role: 'ระบบขนาดกลางตามการแบ่งแบบดั้งเดิม',
      recap: 'ระบบขนาดกลางตามตำราแบบเดิม', env: 'mini', job: 'หลายคนใช้งาน', jobIcon: 'users',
      examples: ['หลายผู้ใช้', 'เทอร์มินัล'] },
    { key: 'mf', en: 'MAINFRAME', short: 'MAINFRAME', th: 'เมนเฟรมคอมพิวเตอร์', role: 'ธุรกรรมจำนวนมหาศาล',
      recap: 'ธุรกรรมจำนวนมาก', env: 'bank', job: 'ธุรกรรมธนาคาร', jobIcon: 'bank',
      examples: ['ธนาคาร', 'จองตั๋ว', 'ระบบองค์กร'] },
    { key: 'sc', en: 'SUPERCOMPUTER', short: 'SUPER', th: 'ซูเปอร์คอมพิวเตอร์', role: 'การคำนวณทางวิทยาศาสตร์ขนาดใหญ่',
      recap: 'การคำนวณมหาศาล', env: 'hpc', job: 'จำลองสภาพอากาศ', jobIcon: 'storm',
      examples: ['พยากรณ์อากาศ', 'งานวิจัย'] },
  ],
  quiz: {
    org1: { title: 'หน่วยงานที่ 1', text: 'ประมวลผลธุรกรรมทางการเงินจำนวนมหาศาลอย่างต่อเนื่อง', icon: 'bank' },
    org2: { title: 'หน่วยงานที่ 2', text: 'คำนวณแบบจำลองสภาพอากาศที่ซับซ้อนมาก', icon: 'storm' },
    ask: 'ควรใช้คอมพิวเตอร์ประเภทใดตามลำดับ?',
    // official choices (Thai text exactly as approved) + English names
    options: [
      { b: 'ก', th: 'ซูเปอร์คอมพิวเตอร์ และเมนเฟรม', en: ['Supercomputer', 'Mainframe'] },
      { b: 'ข', th: 'เมนเฟรม และซูเปอร์คอมพิวเตอร์', en: ['Mainframe', 'Supercomputer'] },
      { b: 'ค', th: 'เวิร์กสเตชัน และมินิคอมพิวเตอร์', en: ['Workstation', 'Minicomputer'] },
      { b: 'ง', th: 'ไมโครคอมพิวเตอร์ และเวิร์กสเตชัน', en: ['Microcomputer', 'Workstation'] },
    ],
    correct: 1,
    answerLine: 'เฉลย ข. เมนเฟรม และซูเปอร์คอมพิวเตอร์',
  },
};
