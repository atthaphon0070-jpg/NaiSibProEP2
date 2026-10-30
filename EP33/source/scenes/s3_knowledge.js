// SCENE 03 — UNDERSTANDING THE SETS (03_knowledge.mp3): draw the Venn diagram, name the circles,
// light the overlap, show the double count, then point at "at least one subject".
(function () {
  const b = B.know;
  add('s3', `<div id="k-ttl" class="col c crit" style="top:466px"><div class="pillW" style="font-size:38px;padding:10px 30px;color:#2F6BFF;box-shadow:0 0 0 4px #95BFEF,0 10px 22px rgba(20,43,83,.14)">${IC.venn(40)}หลักการเซต + แผนภาพเวนน์</div></div>`);
  const vEl = add('s3', `<div id="k-venn" class="abs c" style="left:220px;top:540px"></div>`);
  const V = VENN.build(vEl);
  vEl.querySelectorAll('.vn-nA,.vn-nB,.vn-x2').forEach(e => e.classList.add('crit'));
  // captions (one at a time, y 1130–1400)
  const cap = (id, cls, html, top = 1150) => add('s3', `<div id="${id}" class="abs c crit box ${cls}" style="left:248px;top:${top}px;width:584px;min-height:150px;display:flex;align-items:center;justify-content:center;gap:18px;padding:16px 26px;text-align:center;line-height:1.3">${html}</div>`);
  cap('k-c0', '', `<div style="font-size:40px;font-weight:700">วงกลม <b class="nA">2</b> วง <b>ซ้อนกัน</b></div>`);
  cap('k-cA', '', `<div style="font-size:40px;font-weight:700">วงแรก = คนเรียน<b class="nA">คอมพิวเตอร์</b></div>`);
  cap('k-cB', 'pk', `<div style="font-size:40px;font-weight:700">วงที่สอง = คนเรียน<b class="nB">กฎหมาย</b></div>`);
  cap('k-cM', 'yel', `<div style="font-size:40px;font-weight:700">ตรงกลางที่ซ้อนกัน<br>= เรียน<b style="color:#B07F00">ทั้งสองวิชา</b></div>`);
  cap('k-cD', 'red', `<div style="display:flex;align-items:center;gap:20px"><div style="width:86px;height:86px;border-radius:50%;background:linear-gradient(135deg,#2F6BFF 50%,#EE7FAA 50%);display:grid;place-items:center;flex:none">${IC.person(58)}</div>
     <div style="text-align:left"><div style="font-size:36px;font-weight:700">คน 1 คน อยู่ได้ทั้ง 2 วง</div><div style="font-size:44px;font-weight:800;color:#EF4444">→ ถูกนับซ้ำ 2 ครั้ง!</div></div></div>`);
  cap('k-cK', 'grn', `<div><div style="display:flex;align-items:center;justify-content:center;gap:12px;font-size:34px;font-weight:700;color:#16A34A">${IC.bulb(40, '#16A34A')}ขั้นแรกของวิธีคิด</div><div style="font-size:42px;font-weight:800">ต้องหาคนที่เรียน<br>อย่างน้อยหนึ่งวิชาก่อน</div></div>`, 1130);
  add('s3', `<div id="k-mas" class="mas" style="left:-30px;top:1010px"><img src="../../shared/brand/mascot_presenter.png" style="height:380px"></div>`);

  const caps = [['k-c0', b.circles + .2, b.A], ['k-cA', b.A, b.B], ['k-cB', b.B, b.mid], ['k-cM', b.mid, b.dbl], ['k-cD', b.dbl, b.key], ['k-cK', b.key, 1e9]];
  sfx('pop', K0 + .2, .7); sfx('whoosh', K0 + b.venn, .4); sfx('pop', K0 + b.venn + .1, .6);
  sfx('riser', K0 + b.circles, .35); sfx('pop', K0 + b.A, .9); sfx('pop', K0 + b.B, .9);
  for (let i = 0; i < 12; i++) sfx('pop', K0 + b.A + .4 + i * .07, .18);
  for (let i = 0; i < 8; i++) sfx('pop', K0 + b.B + .4 + i * .07, .18);
  sfx('sparkle', K0 + b.mid + .1, .7); sfx('ding', K0 + b.mid + .2, .4);
  sfx('buzz', K0 + b.dbl + .1, .35); for (let i = 0; i < 4; i++) sfx('tick2', K0 + b.dbl + .5 + i * .52, .35);
  sfx('ding', K0 + b.key + .1, .6); sfx('sparkle', K0 + b.key + .3, .5);
  caps.forEach(([, a]) => sfx('whoosh', K0 + a - .05, .2));

  window.drawKnow = function (t) {
    const u = t - K0;
    tf($('k-ttl'), life(u, .1, 1e9, { from: .4, dy: 30, el: true, d: .8 }));
    tf(vEl, { s: lerp(.85, 1, E.back(P(u, b.venn, .7))), o: clamp((u - b.venn) * 3) });
    const dotA = P(u, b.A + .35, 1.4), dotB = P(u, b.B + .35, 1.0);
    V.set({
      t: u, u: P(u, b.venn, .6), tagU: P(u, b.venn + .2, .6), tagUtx: 'แผนภาพเวนน์',
      ca: P(u, b.circles, 1.0), cb: P(u, b.circles + .5, 1.0),
      na: P(u, b.A, .6), nb: P(u, b.B, .6),
      dots: { a: dotA, ab: dotA, b: dotB, out: 0 },
      hiAB: P(u, b.mid, .6) * (1 - .35 * P(u, b.key, .5)), dbl: P(u, b.dbl, .6) * (1 - P(u, b.key, .4)),
      hiUnion: P(u, b.key, .6),
    });
    // pulse the circle being named
    const pa = Math.max(0, 1 - Math.abs(u - b.A - .3) / .5), pb = Math.max(0, 1 - Math.abs(u - b.B - .3) / .5);
    V.el.querySelector('.vn-sa').setAttribute('stroke-width', 8 + 8 * pa);
    V.el.querySelector('.vn-sb').setAttribute('stroke-width', 8 + 8 * pb);
    caps.forEach(([id, a, z]) => tf($(id), life(u, a, z - .1, { from: .5, dy: 40, out: .2 })));
    masDraw($('k-mas'), u, b.mid, 1e9, { amp: 5, ph: 3 });
  };
})();
