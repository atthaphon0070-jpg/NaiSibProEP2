// EP43 — official unit data (single source of truth for the tower, the recap ladder and qc/unit_validation.json).
// Decimal SI prefixes only (kB = 10^3 B ... QB = 10^30 B). Binary prefixes (KiB = 1,024 B) are a separate system
// and are deliberately NOT part of this ladder. bit -> nibble -> Byte are bit groupings, not x1,000 steps.
window.UNITS = [
  { k: 'bit',    big: 'bit',    sym: 'b',  en: 'bit',        th: 'บิต',       bits: 1, val: '0 หรือ 1' },
  { k: 'nibble', big: 'nibble', sym: '',   en: 'nibble',     th: 'นิบเบิล',    bits: 4, val: '4 bits' },
  { k: 'Byte',   big: 'Byte',   sym: 'B',  en: 'Byte',       th: 'ไบต์',      bits: 8, val: '8 bits' },
  { k: 'kB', big: 'kB', sym: 'kB', en: 'Kilobyte',   th: 'กิโลไบต์',   prefix: 'kilo',  p: 'k', exp: 3 },
  { k: 'MB', big: 'MB', sym: 'MB', en: 'Megabyte',   th: 'เมกะไบต์',   prefix: 'mega',  p: 'M', exp: 6 },
  { k: 'GB', big: 'GB', sym: 'GB', en: 'Gigabyte',   th: 'กิกะไบต์',   prefix: 'giga',  p: 'G', exp: 9 },
  { k: 'TB', big: 'TB', sym: 'TB', en: 'Terabyte',   th: 'เทราไบต์',   prefix: 'tera',  p: 'T', exp: 12 },
  { k: 'PB', big: 'PB', sym: 'PB', en: 'Petabyte',   th: 'เพตะไบต์',   prefix: 'peta',  p: 'P', exp: 15 },
  { k: 'EB', big: 'EB', sym: 'EB', en: 'Exabyte',    th: 'เอกซะไบต์',  prefix: 'exa',   p: 'E', exp: 18 },
  { k: 'ZB', big: 'ZB', sym: 'ZB', en: 'Zettabyte',  th: 'เซตตะไบต์',  prefix: 'zetta', p: 'Z', exp: 21 },
  { k: 'YB', big: 'YB', sym: 'YB', en: 'Yottabyte',  th: 'ยอตตะไบต์',  prefix: 'yotta', p: 'Y', exp: 24 },
  { k: 'RB', big: 'RB', sym: 'RB', en: 'Ronnabyte',  th: 'รอนนาไบต์',  prefix: 'ronna', p: 'R', exp: 27, si2022: true },
  { k: 'QB', big: 'QB', sym: 'QB', en: 'Quettabyte', th: 'เควตตาไบต์', prefix: 'quetta', p: 'Q', exp: 30, si2022: true },
];
// Official EP.43 quiz (order inside each choice is exactly as approved — never sorted).
window.QUIZ = {
  question: 'ข้อใดเรียงหน่วยข้อมูลจากขนาดเล็กไปใหญ่ได้ถูกต้อง?',
  options: [['ก', ['ZB', 'YB', 'RB', 'QB']], ['ข', ['ZB', 'RB', 'YB', 'QB']], ['ค', ['YB', 'ZB', 'RB', 'QB']], ['ง', ['ZB', 'YB', 'QB', 'RB']]],
  correct: 0,
};
