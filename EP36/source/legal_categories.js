// EP.36 legal data — single source for on-screen legal labels and the QC logic check.
// Thai Civil and Commercial Code (ป.พ.พ.): s.139 (immovable), s.140 (movable), s.456 para 1 (form of sale).
window.LEGAL_DATA = {
  s139: { label: 'ป.พ.พ. มาตรา 139', term: 'อสังหาริมทรัพย์',
          def: 'ที่ดิน และทรัพย์อันติดอยู่กับที่ดินมีลักษณะเป็นการถาวร หรือประกอบเป็นอันเดียวกับที่ดิน รวมถึงทรัพยสิทธิอันเกี่ยวกับสิ่งเหล่านั้น',
          examples: ['ที่ดิน', 'บ้านที่ปลูกติดที่ดิน', 'ไม้ยืนต้น'] },
  s140: { label: 'ป.พ.พ. มาตรา 140', term: 'สังหาริมทรัพย์',
          def: 'ทรัพย์สินอื่นนอกจากอสังหาริมทรัพย์ รวมถึงสิทธิอันเกี่ยวกับทรัพย์สินนั้น',
          examples: ['รถยนต์', 'รถจักรยานยนต์', 'โทรศัพท์มือถือ', 'โต๊ะ', 'เก้าอี้'] },
  // s.456 para 1: sale must be in writing AND registered with the competent official, otherwise void.
  s456p1: { label: 'ป.พ.พ. มาตรา 456 วรรคหนึ่ง',
            form: 'ต้องทำเป็นหนังสือและจดทะเบียนต่อพนักงานเจ้าหน้าที่',
            consequence: 'มิฉะนั้นเป็นโมฆะ',
            items: ['อสังหาริมทรัพย์', 'เรือมีระวางตั้งแต่ 5 ตันขึ้นไป', 'แพ', 'สัตว์พาหนะ'] },
  // anchor objects used throughout the episode
  anchors: {
    house: { name: 'บ้าน + ที่ดิน', category: 'immovable', in456: true,  note: 'อสังหาริมทรัพย์ (ม.139)' },
    car:   { name: 'รถยนต์',       category: 'movable',   in456: false, note: 'สังหาริมทรัพย์ทั่วไป · มีทะเบียนรถ/แจ้งโอนตามกฎหมายว่าด้วยรถยนต์ · ไม่ใช่ ม.456 วรรคหนึ่ง' },
    ship:  { name: 'เรือมีระวางตั้งแต่ 5 ตันขึ้นไป', category: 'special-movable', in456: true, note: 'สังหาริมทรัพย์ที่เข้า ม.456 วรรคหนึ่ง' },
  },
  // the car's registration is a separate legal issue from the s.456 sale form
  carTransfer: 'ผู้โอนและผู้รับโอนต้องแจ้งการโอนต่อนายทะเบียน ตามกฎหมายว่าด้วยรถยนต์',
};
