// EP23 shared scene helpers: absolute timeline, beat lookup, centred anchors, label pops,
// suspect roster (kind, number, Thai + English names, analogy) used by every scene.
(function () {
  const { h, tf, life } = NSP;
  const TL = window.TL;
  const T = {
    hook0: TL.hook[0], story0: TL.story[0], know0: TL.know[0], expl0: TL.expl[0], quiz0: TL.quiz[0],
    cd0: TL.cd[0], cdLen: TL.cd[1], ans0: TL.ans[0], promo0: TL.promo[0], end: TL.end,
  };
  const at = (seg, k) => TL[seg][0] + BEATS[seg][k];
  const C = { blue: '#2F6BFF', cyan: '#22D3EE', yel: '#FFD23F', pink: '#FF3D7F', green: '#22C55E', red: '#EF4444', ink: '#0B1A3A' };
  // centred anchor: a zero-size box at (x, y); tf() on it scales around that point
  function A(root, x, y, html, cls = '', z = 0) {
    const a = h(`<div class="anc" style="left:${x}px;top:${y}px;${z ? 'z-index:' + z : ''}"><div class="ac ${cls}">${html}</div></div>`);
    root.appendChild(a); return a;
  }
  const layer = (root, z = 0) => { const l = h(`<div class="abs" style="inset:0;${z ? 'z-index:' + z : ''}"></div>`); root.appendChild(l); return l; };
  const pop = (t, a, b = 1e9, o = {}) => life(t, a, b, { from: .3, dy: 30, d: .5, out: .3, ...o });
  // the five suspects, in lineup order
  const SUS = [
    { kind: 'psu', num: 1, th: 'พาวเวอร์ซัพพลาย', en: 'Power Supply', ico: 'bolt', an: 'ไฟฟ้า' },
    { kind: 'mb', num: 2, th: 'เมนบอร์ด', en: 'Mainboard', ico: 'house', an: 'บ้าน' },
    { kind: 'cpu', num: 3, th: 'ซีพียู', en: 'CPU', ico: 'brain', an: 'สมอง' },
    { kind: 'ram', num: 4, th: 'แรม', en: 'RAM', ico: 'desk', an: 'โต๊ะทำงาน' },
    { kind: 'hdd', num: 5, th: 'ฮาร์ดดิสก์', en: 'Hard Disk', ico: 'cabinet', an: 'ตู้เก็บเอกสาร' },
  ];
  // small static suspect drawing (for photos, cards, icons)
  function mini(kind, num, scale, card = false) {
    const s = CASE.suspect(kind, { num, scale, card });
    s.pose({ t: 0 });
    s.el.style.position = 'absolute'; s.el.style.left = '50%'; s.el.style.top = '100%';
    return s;
  }
  window.EP23 = { T, at, C, A, layer, pop, SUS, mini };
  window.SC = {};
})();
