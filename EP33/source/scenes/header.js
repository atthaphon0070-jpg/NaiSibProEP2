// Persistent lesson header (hook phase B → explanation). Lives in the safe column at y ≈ 374–440.
add('sH', `<div id="hd" class="col c crit" style="top:376px"><div class="pillH" style="font-size:34px;padding:10px 30px">เตรียมสอบนายสิบ<span style="opacity:.6">|</span>วิชาคณิตศาสตร์</div></div>`);
function drawHeader(t) {
  const l = life(t, 4.75, QS - .45, { from: .5, dy: -30, d: .5, out: .3 });
  tf($('hd'), { ...l, y: l.y + bob(t, 0, 2) });
}
