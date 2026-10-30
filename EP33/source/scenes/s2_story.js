// SCENE 02 — THE TRAINING SCENARIO (02_story.mp3)
(function () {
  const b = B.story;
  // classroom / registration board
  const room = add('s2', `<div id="st-room" class="abs c box" style="left:248px;top:470px;width:584px;height:430px;overflow:hidden"></div>`);
  room.innerHTML = `
    <div style="position:absolute;left:0;right:0;top:0;height:96px;background:linear-gradient(90deg,#142B53,#2F6BFF);display:flex;align-items:center;justify-content:center;gap:14px;color:#fff;font-weight:800;font-size:31px;white-space:nowrap">${ICON.shield(48)}อบรมเตรียมสอบนายสิบตำรวจ</div>
    <div style="position:absolute;left:150px;top:118px;width:308px;height:110px;border-radius:16px;background:#E9F7F1;border:6px solid #C9A97C;display:flex;align-items:center;justify-content:center;font-weight:800;font-size:34px;color:#1E7A55">${IC.venn(56)}<span style="margin-left:8px">ติวคณิต</span></div>
    <div id="st-desks" style="position:absolute;left:24px;top:236px;width:560px;height:170px"></div>
    <div id="st-total" class="c" style="position:absolute;left:0;right:0;top:126px;display:flex;justify-content:center"><div class="pillH" style="font-size:44px;padding:12px 34px">ผู้สมัครทั้งหมด&nbsp;<span id="st-totn">360</span>&nbsp;คน</div></div>`;
  const desks = [...Array(14)].map((_, i) => {
    const r = Math.floor(i / 7), c = i % 7;
    const el = h(`<div class="abs c" style="left:${c * 80 + r * 20}px;top:${r * 82}px;width:70px;height:80px">
      <div style="position:absolute;left:12px;top:0">${IC.person(46, ['#5B8BFF', '#EE7FAA', '#8EA2C0', '#22D3EE'][(i * 3) % 4])}</div>
      <div style="position:absolute;left:0;top:42px;width:70px;height:26px;border-radius:8px;background:#C9A97C;box-shadow:inset 0 -5px 0 #A88A5F"></div></div>`);
    room.querySelector('#st-desks').appendChild(el); return el;
  });
  // data cards
  const card = (id, cls, top, icBg, icon, label, val) => add('s2', `<div id="${id}" class="dcard c crit" style="top:${top}px"><div class="ico" style="background:${icBg}">${icon}</div><div class="lb">${label}</div><div class="vl ${cls}">${val}<small>คน</small></div></div>`);
  card('st-c1', 'nA', 940, 'linear-gradient(160deg,#8FB0FF,#2F6BFF)', IC.laptop(52), 'เรียนคอมพิวเตอร์', 230);
  card('st-c2', 'nB', 1090, 'linear-gradient(160deg,#FFC2DA,#EE7FAA)', IC.scales(52), 'เรียนกฎหมาย', 190);
  card('st-c3', 'nO', 1240, 'linear-gradient(160deg,#FFE27A,#F2B705)', IC.nobook(52), 'ไม่เรียนทั้งสองวิชา', 50);
  // question + wrong instinct
  add('s2', `<div id="st-q" class="abs c crit box pk" style="left:248px;top:880px;width:584px;height:170px;display:flex;align-items:center;justify-content:center;gap:20px">
     <div class="big gP" style="font-size:120px">?</div><div style="font-size:42px;font-weight:800;line-height:1.3">เรียน<span class="nA">ทั้งสอง</span>วิชา<br>มีกี่คน?</div></div>`);
  add('s2', `<div id="st-wl" class="col c crit" style="top:1078px"><div class="tagT" style="background:#FFE4E4;color:#B91C1C">หลายคนรีบคิดแบบนี้…</div></div>`);
  add('s2', `<div id="st-w" class="col c crit" style="top:1130px"><div class="eq" style="font-size:52px"><span class="nA">230</span><span class="op">+</span><span class="nB">190</span><span class="op">−</span><span class="nT">360</span><span class="op">=</span><span id="st-60" class="nR" style="display:inline-block;position:relative">60<span id="st-60q" style="position:absolute;right:-4px;top:-56px;font-size:48px;color:#EF4444">?</span></span></div></div>`);
  add('s2', `<div id="st-wait" class="col c crit" style="top:1250px"><div class="stamp" style="flex-direction:column;gap:0;font-size:40px;line-height:1.3;padding:8px 34px"><span style="font-size:48px">เดี๋ยวก่อน!</span><span>ลืมอะไรไปหรือเปล่า?</span></div></div>`);
  add('s2', `<div id="st-mas" class="mas" style="left:845px;top:1080px"><img src="../../shared/brand/mascot_presenter.png" style="height:400px;transform:scaleX(-1)"></div>`);

  const PB = b.q - .1;  // phase B: cards slide up into a compact stack
  sfx('pop', ST0 + .3, .6); sfx('pop', ST0 + b.total, .8); [b.comp, b.law, b.neither].forEach(a => { sfx('whoosh', ST0 + a - .1, .35); sfx('pop', ST0 + a + .05, .9); });
  sfx('whoosh', ST0 + PB, .4); sfx('pop', ST0 + b.q + .2, .8); sfx('pop', ST0 + b.wrong, .6); sfx('type', ST0 + b.wrong + .4, .5); sfx('type', ST0 + b.wrong + 1.0, .5); sfx('type', ST0 + b.wrong + 1.6, .5);
  sfx('stamp', ST0 + b.wait + .1, .9); sfx('buzz', ST0 + b.wait + .15, .35);

  window.drawStory = function (t) {
    const u = t - ST0, up = E.inOut(P(u, PB, .7));
    const rm = life(u, .05, PB, { from: .6, dy: 60, out: .35 });
    tf(room, rm);
    desks.forEach((d, i) => tf(d, { ...life(u, .4 + i * .06, 1e9, { from: .2, dy: 20 }), y: life(u, .4 + i * .06).y + bob(u, i, 2, 3) }));
    tf(room.querySelector('#st-total'), life(u, b.total, 1e9, { from: .3, dy: 20, el: true, d: .8 }));
    room.querySelector('#st-totn').textContent = countUp(u, b.total, .9, M.GIVEN.total);
    // cards: pop in on narration, then stack at the top (y 470 / 600 / 730) for phase B
    [['st-c1', b.comp, 940, 470], ['st-c2', b.law, 1090, 600], ['st-c3', b.neither, 1240, 730]].forEach(([id, a, y0, y1], i) => {
      const l = life(u, a, 1e9, { from: .4, dy: 50, el: true, d: .8 });
      const hint = i === 2 && u > b.wait + .3 ? 1 : 0;   // the forgotten 50 glows once the warning lands
      tf($(id), { ...l, y: l.y + lerp(0, y1 - y0, up), s: l.s * lerp(1, .94, up) * (1 + .04 * hint * Math.sin((u - b.wait) * 6)) });
      $(id).style.boxShadow = hint ? `0 14px 30px rgba(20,43,83,.14),0 0 0 5px #fff,0 0 0 ${10 + 3 * Math.sin(u * 6)}px rgba(255,176,32,.85)` : '';
    });
    tf($('st-q'), life(u, b.q + .2, 1e9, { from: .4, dy: 40 }));
    tf($('st-wl'), life(u, b.wrong, 1e9, { from: .4, dy: 20 }));
    tf($('st-w'), life(u, b.wrong + .2, 1e9, { from: .5, dy: 30 }));
    tf($('st-60q'), life(u, b.wait + .2, 1e9, { from: .2, dy: 0, el: true }));
    $('st-60').style.transform = u > b.wait ? `rotate(${Math.sin(u * 5) * 4}deg)` : '';
    const wt = life(u, b.wait + .1, 1e9, { from: 2.2, dy: 0, d: .35 });
    tf($('st-wait'), { ...wt, r: -3 + (u > b.wait + .1 && u < b.wait + .5 ? Math.sin(u * 50) * 2 : 0) });
    masDraw($('st-mas'), u, b.wrong - .3, 1e9, { amp: 5, ph: 1 });
  };
})();
