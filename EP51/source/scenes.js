// EP51 scene timeline. Every beat is keyed to the phrase starts measured from the narration (beats.js)
// and to the segment starts of the audio-first timeline (timeline.js). renderAt(t) is deterministic.
(function () {
  const { $, clamp, lerp, E, P, tf, life, bob, h, sfx, mark } = NSP;
  const T = window.TL, B = window.BEATS, ICO = CHAR.ICO;
  const FPS = T.fps, S = k => T[k][0];
  const H0 = S('hook'), ST0 = S('story'), KN0 = S('know'), EX0 = S('expl'), QS = S('quiz'), CD = S('cd'), AN = S('ans'), PR = S('promo'), END = T.end;
  const CDF = Math.round(CD * FPS), CDN = Math.round(T.cd[1] * FPS);   // countdown start frame, frame count (150)
  const AN2 = AN + B.ans.why - .25;   // answer part 2 (reasons, contrast, memory lock) starts on its own scene
  const BASE = NSP.BASE;
  const GROUND = 1420;

  // ---------------------------------------------------------------- helpers
  const add = (parent, html) => { const e = h(html); parent.appendChild(e); return e; };
  const row = (parent, top, inner, { left = 220, width = 640 } = {}) => add(parent, `<div class="row c" style="top:${top}px;left:${left}px;width:${width}px">${inner}</div>`);
  const pop = (el, u, a, b = 1e9, o = {}) => tf(el, life(u, a, b, { from: .5, dy: 40, d: .5, out: .3, ...o }));
  const popEl = (el, u, a, b = 1e9, o = {}) => tf(el, life(u, a, b, { from: .3, dy: 30, d: .7, out: .3, el: true, ...o }));
  const actor = (parent, look, opt = {}) => { const c = CHAR.officer(look, opt); parent.appendChild(c.el); return c; };
  // walk from x0 to x1 starting at a, d seconds; returns { x, walk, flip }
  const walkX = (u, a, d, x0, x1) => { const k = P(u, a, d); return { x: lerp(x0, x1, E.inOut(k)), walk: k > 0 && k < 1 ? (u - a) * 9 : null, flip: x1 < x0 && k > 0 && k < 1 }; };
  const steps = (abs, d, gain = .55) => { for (let s = .15; s < d - .1; s += Math.PI / 9) sfx('step', abs + s, gain); };
  const hdr = (parent, txt, cls = '', size = 44) => row(parent, 362, `<div class="hp ${cls}" style="font-size:${size}px" data-fit="640">${txt}</div>`);
  const drawHdr = (el, u, a, b = 1e9) => { const l = life(u, a, b, { from: .4, dy: -30, d: .5, out: .3 }); tf(el, { ...l, y: l.y + bob(u, 0, 3) }); };
  const salute = u => ({ armR: 150, foreR: 120, head: -3 });
  const tiles = (parent, top, word = 'POLICE') => {
    const el = row(parent, top, `<div style="display:flex;gap:10px">${[...word].map((c, i) => `<div class="tile ${i % 2 ? 'b' : 'p'} c">${c}</div>`).join('')}</div>`);
    return { el, ts: [...el.querySelectorAll('.tile')] };
  };
  const shake = (u, a, d = .5, amp = 10) => (u > a && u < a + d) ? Math.sin((u - a) * 40) * amp * (1 - (u - a) / d) : 0;

  // ======================================================================
  // SCENE 1 — HOOK (01_hook.mp3). Frame 0 already shows the full exam graphic.
  // ======================================================================
  const s1 = $('s1'), HB = B.hook;
  const h1q = add(s1, `<div class="abs c" style="left:466px;top:1010px">${ICO.q(130)}</div>`);
  const h1A = actor(s1, 'A', { scale: 1.2 });
  const h1G = ['B', 'C', 'D'].map(k => actor(s1, k));
  const h1S = actor(s1, 'S', { scale: 1.2 });
  const h1hdr = row(s1, 360, `<div class="hp" style="font-size:52px;padding:14px 42px" data-fit="640">เตรียมสอบนายสิบตำรวจ</div>`);
  const h1subj = row(s1, 466, `<div class="chip bl" style="font-size:38px;padding:10px 32px">วิชาภาษาอังกฤษ</div>`);
  const h1card = add(s1, `<div class="card dual c" style="top:566px;padding:20px 0 26px">
      <div class="big" style="font-size:98px" data-fit="600">THE POLICE</div>
      <div class="big" style="font-size:84px;margin-top:8px"><span class="vb is">IS</span> <span style="font-size:50px;color:#31445D">or</span> <span class="vb are">ARE</span><span style="color:#EE7FAA">?</span></div></div>`);
  const h1tagA = row(s1, 912, `<div class="chip bl" style="font-size:30px">${CHAR.person(40, '#fff')}1 คน</div>`, { left: 200, width: 200 });
  const h1tagG = row(s1, 912, `<div class="chip pk" style="font-size:30px">${CHAR.person(40, '#fff')}${CHAR.person(40, '#fff')}หลายคน</div>`, { left: 640, width: 240 });
  // P1: POLICE in the centre, IS? / ARE? approach from both sides
  const h1word = add(s1, `<div class="card dual c" style="top:566px;height:190px;display:grid;place-items:center"><div class="big" style="font-size:120px;letter-spacing:4px">POLICE</div></div>`);
  const h1is = add(s1, `<div class="abs c" style="left:220px;top:790px;width:300px;height:130px;border-radius:36px;display:grid;place-items:center;background:linear-gradient(180deg,#4D8DFF,#2F6BFF);box-shadow:0 0 0 6px #fff,0 16px 30px rgba(47,107,255,.35)"><div class="big" style="color:#fff;font-size:82px">IS?</div></div>`);
  const h1are = add(s1, `<div class="abs c" style="left:560px;top:790px;width:300px;height:130px;border-radius:36px;display:grid;place-items:center;background:linear-gradient(180deg,#FF91BA,#EE7FAA);box-shadow:0 0 0 6px #fff,0 16px 30px rgba(238,127,170,.38)"><div class="big" style="color:#fff;font-size:82px">ARE?</div></div>`);
  // P2: student — looks easy… but many answer wrong
  const h1easy = add(s1, `<div class="card c" style="top:566px;padding:26px 0"><div class="th" style="font-size:54px">ฟังดูเหมือนข้อสอบง่าย…</div></div>`);
  const h1trap = add(s1, `<div class="card blue c" style="top:566px;padding:22px 0 26px"><div class="th" style="font-size:44px;line-height:1.4">แต่คำนี้ทำให้</div><div class="big" style="font-size:72px;line-height:1.35;color:#EF4444">หลายคนตอบผิด!</div></div>`);
  const h1bub = add(s1, `<div class="bubble2 c" style="left:300px;top:790px;width:480px;height:150px"><span class="vb is" style="font-size:66px">IS</span><span style="font-size:60px;color:#EE7FAA">?</span><span class="vb are" style="font-size:66px">ARE</span><span style="font-size:60px;color:#2F6BFF">?</span>
      <svg width="60" height="40" viewBox="0 0 60 40" style="position:absolute;left:210px;bottom:-34px"><circle cx="20" cy="10" r="12" fill="#fff"/><circle cx="34" cy="30" r="8" fill="#fff"/></svg></div>`);
  const h1x = [[196, 610], [884, 640], [206, 776], [876, 770]].map(([x, y]) => add(s1, `<div class="abs c" style="left:${x - 30}px;top:${y - 30}px;width:60px;height:60px;border-radius:50%;background:#EF4444;display:grid;place-items:center;box-shadow:0 0 0 5px #fff">${ICO.cross(36)}</div>`));
  // P3: spelling of POLICE, "≠ ต้องใช้ IS เสมอไป", stamp
  const h1t = tiles(s1, 566);
  const h1mag = add(s1, `<div class="abs" style="left:0;top:0">${ICO.mag(150, '#142B53')}</div>`);
  const h1noS = row(s1, 712, `<div class="chip nv" style="font-size:36px">คำว่า POLICE ไม่มีตัว S ลงท้าย</div>`);
  const h1neq = add(s1, `<div class="card blue c" style="top:796px;padding:16px 10px"><div class="th" style="font-size:40px">ไม่ได้แปลว่า ต้องใช้ <span class="vb is">IS</span> เสมอไป</div></div>`);
  const h1stamp = row(s1, 930, `<div class="stamp" style="font-size:60px">อย่าดูแค่ตัว S!</div>`);
  // P4: easy technique to score
  const h1tech = add(s1, `<div class="card dual c" style="top:566px;padding:22px 0 24px"><div style="display:flex;align-items:center;justify-content:center;gap:16px">${ICO.bulb(76)}<div class="th" style="font-size:52px">เทคนิคจำง่าย ๆ</div></div>
      <div class="chip yl" style="font-size:36px;margin-top:12px">เก็บคะแนนข้อสอบ!</div></div>`);
  const P1 = HB.word - .15, P2 = HB.easy - .2, P3 = HB.because - .1, P4 = HB.tech - .1;
  sfx('pop', HB.subj, .6); sfx('whoosh', P1, .6); sfx('swoosh', HB.is - .2, .7); sfx('swoosh', HB.are - .2, .7); sfx('pop', HB.is + .1, .7); sfx('pop', HB.are + .1, .7);
  sfx('whoosh', P2, .6); sfx('pop', HB.easy + .2, .6); sfx('buzz', HB.trap + .1, .6); [0, 1, 2, 3].forEach(i => sfx('pop', HB.trap + .5 + i * .14, .5));
  sfx('whoosh', P3, .6); [...Array(6)].forEach((_, i) => sfx('click', HB.because + .1 + i * .09, .5)); sfx('scan', HB.noS - .05, .7); sfx('ding', HB.noS + 1.0, .6);
  sfx('pop', HB.notIs, .7); sfx('stamp', HB.notIs + 1.15, .9); sfx('sparkle', HB.tech + .2, .8); sfx('ding', HB.tech + .4, .5);
  steps(P2 + .2, 1.0); steps(P3 + .1, 1.2);
  function drawS1(t) {
    const u = t;
    // header + subject: on screen from frame 0
    tf(h1hdr, { s: 1 + .015 * Math.sin(u * 2.4), y: bob(u, 0, 3) });
    const sp = Math.max(0, 1 - Math.abs(u - HB.subj - .2) / .35);
    tf(h1subj, { s: (1 + .1 * sp) * (1 - .3 * E.out(P(u, P1 - .2, .4))), o: 1 - P(u, P1 - .2, .3) });
    // frame-0 card (THE POLICE / IS or ARE?) leaves at P1
    tf(h1card, { s: (1 + .012 * Math.sin(u * 3)) * (1 - .15 * E.out(P(u, P1, .3))), o: 1 - P(u, P1, .3), y: bob(u, 1, 4) });
    tf(h1tagA, { o: 1 - P(u, P1, .3), y: bob(u, 2, 4) }); tf(h1tagG, { o: 1 - P(u, P1, .3), y: bob(u, 3, 4) });
    tf(h1q, { y: bob(u, 0, 16, 2.2), r: Math.sin(u * 1.7) * 8, s: (1 + .05 * Math.sin(u * 3)) * (1 - P(u, P2 - .4, .35)), o: 1 - P(u, P2 - .4, .3) });
    // officers: one officer (left, pink side) vs a group (right, blue side); leave for the student beat, A returns for P3
    const gOut = P(u, P2 - .5, .45);
    if (u < P3) h1A.set({ x: 300, y: GROUND + 260 * E.in(gOut), t: u, o: 1 - gOut, expr: u > HB.word ? 'talk' : 'smile', talk: u > HB.word && u < HB.easy ? 1 : 0, head: u > HB.is && u < HB.are + 1.2 ? -4 : 0, armR: u > HB.word ? 70 : 8, foreR: u > HB.word ? 50 : 6 });
    else { const w = walkX(u, P3 + .1, 1.2, -150, 300); h1A.set({ x: w.x, y: GROUND, t: u, walk: w.walk, expr: 'talk', talk: u > HB.noS && u < HB.tech + 3 ? .8 : 0, armR: w.walk == null ? (u > HB.tech ? 150 : 135) : 4, foreR: w.walk == null ? (u > HB.tech ? 30 : 20) : 6, lookX: 1 }); }
    h1G.forEach((g, i) => g.set({ x: [660, 775, 890][i], y: GROUND + 260 * E.in(gOut), t: u + i * .9, o: 1 - gOut, expr: u > HB.are ? 'smile' : 'smile', head: Math.sin(u * 1.2 + i) * 2, armL: i === 1 && u > HB.are ? 70 : 6, foreL: i === 1 && u > HB.are ? 60 : 6 }));
    // P1
    pop(h1word, u, P1 + .1, P2 - .3, { from: .3 });
    const isK = E.out(P(u, HB.is - .25, .6)), arK = E.out(P(u, HB.are - .25, .6));
    tf(h1is, { x: lerp(-420, 0, isK) + Math.sin(u * 5) * 6 * isK, o: isK * (1 - P(u, P2 - .3, .3)), r: lerp(-20, -4, isK) + Math.sin(u * 3) * 2 });
    tf(h1are, { x: lerp(420, 0, arK) - Math.sin(u * 5) * 6 * arK, o: arK * (1 - P(u, P2 - .3, .3)), r: lerp(20, 4, arK) - Math.sin(u * 3) * 2 });
    // P2: student
    const sIn = P(u, P2, .5);
    let sx = 540;
    if (u >= P3 - .3) { const w = walkX(u, P3 - .3, 1.0, 540, 760); sx = w.x; }
    h1S.set({ x: sx, y: GROUND + (1 - E.back(sIn)) * 300, t: u, o: sIn, expr: u > HB.trap ? (u < HB.trap + 1.5 ? 'surprise' : 'think') : 'smile', armR: u > HB.trap + .6 ? 160 : 8, foreR: u > HB.trap + .6 ? 120 : 6, head: u > HB.trap + .6 ? 6 : 0, lookX: u > P3 ? -1 : 0 });
    pop(h1easy, u, HB.easy, HB.trap - .1, { from: .4 });
    const tr = life(u, HB.trap, P3 - .1, { from: .3, dy: 30, el: true, d: .7 });
    tf(h1trap, { ...tr, x: shake(u, HB.trap + .3, .5, 10) });
    tf(h1bub, { ...life(u, HB.easy + .5, P3 - .1, { from: .3, dy: 20, el: true, d: .7 }), y: bob(u, 0, 6) });
    h1bub.querySelectorAll('.vb').forEach((v, i) => { v.style.transform = `scale(${1 + .12 * Math.max(0, Math.sin(u * 4 + i * Math.PI))})`; });
    h1x.forEach((x, i) => tf(x, { ...life(u, HB.trap + .5 + i * .14, P3 - .2, { from: .1, dy: 0, el: true, d: .6 }), r: Math.sin(u * 3 + i) * 10 }));
    // P3: tiles + magnifier
    h1t.ts.forEach((tl, i) => {
      const l = life(u, HB.because + .1 + i * .09, P4 - .2, { from: .2, dy: -60, d: .55, el: true, out: .3 });
      const mk = i === 5 ? clamp((u - HB.noS - .9) / .3) : 0;
      tf(tl, { ...l, y: l.y + bob(u, i, 4), s: l.s * (1 + .12 * mk) });
      tl.style.boxShadow = mk > 0 ? `0 0 0 ${6 * mk}px #fff,0 0 0 ${12 * mk}px #FFD23F,0 16px 26px rgba(110,90,150,.22)` : '';
    });
    const mg = P(u, HB.noS - .05, 1.1), mo = clamp((u - HB.noS + .1) / .2) * (1 - clamp((u - HB.notIs + .2) / .3));
    tf(h1mag, { x: lerp(200, 710, E.inOut(mg)), y: 560 + Math.sin(mg * Math.PI * 3) * 14, o: mo, r: -10 + Math.sin(u * 4) * 4 });
    pop(h1noS, u, HB.noS + .9, P4 - .2);
    pop(h1neq, u, HB.notIs, P4 - .2, { from: .4 });
    const st = life(u, HB.notIs + 1.1, 1e9, { from: 2.2, dy: 0, d: .35, out: .3 });
    const stS = u < HB.notIs + 1.1 ? 0 : lerp(2.2, 1, E.out(P(u, HB.notIs + 1.1, .3)));
    tf(h1stamp, { o: st.o, s: stS * (1 + .03 * Math.sin(u * 4)), r: -5, y: u > P4 ? lerp(0, -110, E.inOut(P(u, P4, .6))) : 0 });
    // P4
    tf(h1tech, life(u, P4 + .2, 1e9, { from: .4, dy: 40, el: true, d: .8 }));
  }

  // ======================================================================
  // SCENE 2 — STORY (02_story.mp3): one officer at the station, then several officers searching
  // ======================================================================
  const s2 = $('s2'), SB = B.story;
  const s2set = CHAR.station(s2, { top: 600 });
  const s2board = CHAR.searchBoard(s2, { left: 415, top: 800, w: 250 });
  const s2ring = add(s2, `<svg class="abs" width="1080" height="700" viewBox="0 0 1080 700" style="left:0;top:960px;overflow:visible"><ellipse class="rg" cx="540" cy="330" rx="430" ry="250" fill="rgba(247,168,196,.18)" stroke="#EE7FAA" stroke-width="8" stroke-dasharray="26 18" stroke-linecap="round"/></svg>`);
  const s2rg = s2ring.querySelector('.rg');
  const s2A = actor(s2, 'A', { scale: 1.05 });
  const s2B = actor(s2, 'B', { prop: 'clipboard' });
  const s2C = actor(s2, 'C', { prop: 'magnifier' });
  const s2h0 = hdr(s2, 'ลองนึกภาพสถานการณ์นี้', 'bl');
  const s2one = row(s2, 452, `<div class="chip bl" style="font-size:36px">${CHAR.person(46, '#fff')}เจ้าหน้าที่ตำรวจ 1 คน · ปฏิบัติหน้าที่</div>`);
  const s2apo = add(s2, `<div class="card blue c" style="top:452px;padding:16px 0 20px"><div class="th" style="font-size:32px;color:#2F6BFF">ภาษาอังกฤษใช้คำว่า</div><div class="big" style="font-size:78px" data-fit="600">A POLICE OFFICER</div>
      <div class="chip bl" style="font-size:28px;margin-top:8px;padding:6px 20px">${CHAR.person(36, '#fff')}ตำรวจ 1 คน</div></div>`);
  const s2many = row(s2, 452, `<div class="chip pk" style="font-size:30px">${CHAR.person(40, '#fff')}${CHAR.person(40, '#fff')}${CHAR.person(40, '#fff')}หลายคน · ออกตามหาผู้ต้องสงสัย</div>`);
  const s2thep = add(s2, `<div class="card c" style="top:452px;padding:16px 0 20px"><div class="big" style="font-size:96px;color:#EE7FAA">THE POLICE</div>
      <div class="th" style="font-size:34px;margin-top:4px">= ตำรวจ <span style="color:#EE7FAA">(ในภาพรวม)</span></div></div>`);
  const s2fill = add(s2, `<div class="card dual c" style="top:452px;padding:18px 0 22px"><div class="th" style="font-size:32px;color:#2F6BFF">เติมคำกริยาลงในประโยค</div>
      <div class="big" style="font-size:76px;margin-top:4px">The police <span class="blank" style="min-width:2.6em"></span></div></div>`);
  const s2is = add(s2, `<div class="abs c" style="left:220px;top:700px;width:300px;height:120px;border-radius:34px;display:grid;place-items:center;background:linear-gradient(180deg,#4D8DFF,#2F6BFF);box-shadow:0 0 0 6px #fff,0 16px 30px rgba(47,107,255,.35)"><div class="big" style="color:#fff;font-size:76px">IS?</div></div>`);
  const s2are = add(s2, `<div class="abs c" style="left:560px;top:700px;width:300px;height:120px;border-radius:34px;display:grid;place-items:center;background:linear-gradient(180deg,#FF91BA,#EE7FAA);box-shadow:0 0 0 6px #fff,0 16px 30px rgba(238,127,170,.38)"><div class="big" style="color:#fff;font-size:76px">ARE?</div></div>`);
  const s2vs = row(s2, 728, `<div style="width:76px;height:76px;border-radius:50%;background:#142B53;color:#fff;font-weight:800;font-size:34px;display:grid;place-items:center;box-shadow:0 0 0 5px #fff">VS</div>`);
  const s2rev = row(s2, 452, `<div class="hp yl" style="font-size:40px">${ICO.book(48, '#142B53')}มาทบทวนหลักการกัน</div>`);
  sfx('radio', ST0 + .05, .9); sfx('pop', ST0 + SB.imagine + .1, .5); steps(ST0 + SB.one, 1.5);
  sfx('pop', ST0 + SB.one + .2, .6); sfx('pop', ST0 + SB.eng, .6); sfx('ding', ST0 + SB.apo, .6); sfx('sparkle', ST0 + SB.apo + .1, .5);
  steps(ST0 + SB.many, 1.6); sfx('pop', ST0 + SB.many + .1, .6); sfx('page', ST0 + SB.many + .9, .6);
  sfx('whoosh', ST0 + SB.thep - .1, .5); sfx('ding', ST0 + SB.thep + .4, .6); sfx('pop', ST0 + SB.fill, .6);
  sfx('swoosh', ST0 + SB.isare - .2, .7); sfx('pop', ST0 + SB.isare + .05, .6); sfx('pop', ST0 + SB.isare + .5, .6); sfx('pop', ST0 + SB.review, .6);
  function drawS2(t) {
    const u = t - ST0;
    tf(s2set, { y: (1 - E.out(P(u, 0, .8))) * 60 + Math.sin(u * .3) * 4, s: 1 + .02 * clamp(u / 25) });
    drawHdr(s2h0, u, SB.imagine, SB.eng - .1);
    pop(s2one, u, SB.one + .3, SB.eng - .1);
    tf(s2apo, life(u, SB.eng, SB.many - .1, { from: .5, dy: 40 }));
    tf(s2apo.querySelector('.big'), { s: lerp(.3, 1, E.back(P(u, SB.apo - .05, .5))), o: clamp((u - SB.apo + .05) / .2) });
    pop(s2many, u, SB.many + .2, SB.thep - .1);
    tf(s2thep, life(u, SB.thep, SB.fill - .1, { from: .3, dy: 30, el: true, d: .8 }));
    tf(s2fill, life(u, SB.fill, SB.review - .1, { from: .5, dy: 40 }));
    tf(s2fill.querySelector('.blank'), { s: 1, o: .5 + .5 * Math.abs(Math.sin(u * 4)) });
    const ik = E.out(P(u, SB.isare - .15, .55)), ak = E.out(P(u, SB.isare + .35, .55)), vo = 1 - P(u, SB.review - .1, .3);
    tf(s2is, { x: lerp(-400, 0, ik) + Math.sin(u * 6) * 5 * ik, o: ik * vo, r: -4 + Math.sin(u * 4) * 3 });
    tf(s2are, { x: lerp(400, 0, ak) - Math.sin(u * 6) * 5 * ak, o: ak * vo, r: 4 - Math.sin(u * 4) * 3 });
    tf(s2vs, { ...life(u, SB.isare + .7, SB.review - .1, { from: .2, dy: 0, el: true }), r: Math.sin(u * 3) * 8 });
    tf(s2rev, life(u, SB.review, 1e9, { from: .3, dy: 30, el: true, d: .7 }));
    tf(s2board, { ...life(u, SB.many + .8, 1e9, { from: .2, dy: -80, el: true, d: .8 }), r: Math.sin(u * 1.4) * 1.5 });
    s2rg.setAttribute('stroke-dashoffset', -u * 40);
    tf(s2ring, { o: clamp((u - SB.thep - .2) / .3) * (1 - clamp((u - SB.fill + .2) / .3)), s: .94 + .06 * E.back(P(u, SB.thep - .2, .5)) });
    // officers
    const aw = walkX(u, SB.one, 1.5, -160, 540);
    const searching = u > SB.many + 1.4;
    const thinkQ = u > SB.isare;
    s2A.set({ x: aw.x, y: GROUND, t: u, walk: aw.walk, expr: thinkQ ? 'think' : searching ? 'smile' : 'smile', ...(u > SB.one + 1.6 && u < SB.eng ? salute(u) : searching && !thinkQ ? { armR: 120, foreR: 10, lookX: 1 } : thinkQ ? { armR: 160, foreR: 120, head: 5 } : {}) });
    const bw = walkX(u, SB.many, 1.5, -160, 290), cw = walkX(u, SB.many + .2, 1.5, 1240, 800);
    s2B.set({ x: bw.x, y: GROUND, t: u + 1, walk: bw.walk, o: u > SB.many ? 1 : 0, expr: thinkQ ? 'think' : 'smile', armL: 30, foreL: 70, lookX: searching ? 1 : 0, head: searching ? Math.sin(u * 1.5) * 4 : 0 });
    s2C.set({ x: cw.x, y: GROUND, t: u + 2, walk: cw.walk, flip: cw.walk != null, o: u > SB.many ? 1 : 0, expr: thinkQ ? 'surprise' : 'smile', armR: searching ? 70 + Math.sin(u * 1.6) * 20 : 8, foreR: searching ? 70 : 6, lookX: searching ? -1 : 0 });
  }

  // ======================================================================
  // SCENE 3 — KNOWLEDGE (03_knowledge.mp3): basic IS / ARE with the GrammarComparisonAnimation
  // ======================================================================
  const s3 = $('s3'), KB = B.know;
  const s3h = hdr(s3, 'หลักพื้นฐาน IS / ARE', 'bl');
  const s3r1 = add(s3, `<div class="card blue c" style="top:452px;height:168px;padding:16px 0"><div class="th" style="font-size:40px">${CHAR.person(50, '#2F6BFF')} ประธานเป็นคนเดียว / สิ่งเดียว</div>
      <div class="th r2" style="font-size:44px;margin-top:6px">→ โดยทั่วไปใช้ <span class="vb is" style="font-size:54px">IS</span></div></div>`);
  const s3r2 = add(s3, `<div class="card c" style="top:452px;height:168px;padding:16px 0"><div class="th" style="font-size:40px">${CHAR.person(50, '#EE7FAA')}${CHAR.person(50, '#EE7FAA')} ประธานเป็นหลายคน</div>
      <div class="th r2" style="font-size:44px;margin-top:6px">→ โดยทั่วไปใช้ <span class="vb are" style="font-size:54px">ARE</span></div></div>`);
  const GCA = GC.GrammarComparisonAnimation(s3, {
    top: 664, cardH: 238, size: 56, stageY: GROUND, scale: 1.08, xs: 540, xg: [390, 680], countY: 940,
    main: 'A', extra: ['B'], count: ['1 คน', '2 คน'],
    A: { words: ['A', 'police', 'officer', { t: 'is', verb: 'is' }, 'on', 'duty.'], verbIdx: 3, verbCls: 'is', verbTxt: 'is', th: 'ตำรวจหนึ่งคนกำลังปฏิบัติหน้าที่', thAt: KB.s1th },
    B: { words: ['Two', 'police', 'officers', { t: 'are', verb: 'are' }, 'on', 'duty.'], verbIdx: 3, th: 'ตำรวจสองคนกำลังปฏิบัติหน้าที่', thAt: KB.s2th },
  });
  GCA.SA.ws.slice(0, 3).forEach(w => { w.el.style.color = '#2F6BFF'; });
  GCA.SB.ws.slice(0, 3).forEach(w => { w.el.style.color = '#EE7FAA'; });
  const s3eg1 = row(s3, 628, `<div class="chip yl" style="font-size:28px;padding:6px 20px">ตัวอย่าง</div>`);
  const s3eg2 = row(s3, 628, `<div class="chip yl" style="font-size:28px;padding:6px 20px">ตัวอย่าง</div>`);
  const GT = [KB.sing, KB.s1 - .05, KB.s1 + .62, KB.pl, KB.s2 - .05, KB.s2 + .75];
  // 03E: side-by-side comparison
  const s3pA = GC.panel(s3, { left: 220, top: 452, hgt: 470, theme: 'blue', head: '1 คน', subj: 'A police officer', verb: 'IS', looks: ['A'], scale: .5 });
  const s3pB = GC.panel(s3, { left: 550, top: 452, hgt: 470, theme: 'pink', head: 'หลายคน', subj: 'Two police officers', verb: 'ARE', looks: ['A', 'B'], scale: .5, subjSize: 30 });
  const s3gen = row(s3, 940, `<div class="chip" style="font-size:30px">หนึ่งคนใช้ <span class="vb is" style="margin:0 6px">IS</span> · หลายคนใช้ <span class="vb are" style="margin:0 6px">ARE</span> <span style="color:#7A8BA3;font-size:24px">(โดยทั่วไป)</span></div>`);
  const s3but = tiles(s3, 520);
  const s3warn = row(s3, 680, `<div class="hp yl" style="font-size:42px">${ICO.warn(52)}แต่ยังมีจุดที่ต้องระวัง!</div>`);
  sfx('radio', KN0 + .05, .8); sfx('pop', KN0 + KB.basic + .1, .6); steps(KN0 + KB.sing, 1.3);
  sfx('pop', KN0 + KB.sing + .1, .6); sfx('ding', KN0 + KB.sgIs + .3, .6); sfx('pop', KN0 + KB.eg1, .5);
  sfx('drop', KN0 + GT[2] + .2, .6); sfx('sparkle', KN0 + KB.s1 + .9, .4);
  sfx('whoosh', KN0 + KB.pl - .1, .5); steps(KN0 + KB.pl + .1, 1.4); sfx('pop', KN0 + KB.pl + .1, .6); sfx('ding', KN0 + KB.plAre + .3, .6);
  sfx('pop', KN0 + KB.eg2, .5); sfx('swoosh', KN0 + GT[5] - .1, .6); sfx('success', KN0 + GT[5] + .25, .5);
  sfx('whoosh', KN0 + KB.easy - .2, .6); sfx('pop', KN0 + KB.oneIs + .2, .7); sfx('pop', KN0 + KB.manyAre + .2, .7); sfx('buzz', KN0 + KB.but + .1, .5);
  function drawS3(t) {
    const u = t - KN0;
    drawHdr(s3h, u, KB.basic, KB.easy - .2);
    tf(s3r1, life(u, KB.sing, KB.pl - .15, { from: .5, dy: 40 }));
    tf(s3r1.querySelector('.r2'), life(u, KB.sgIs, 1e9, { from: .4, dy: 20, el: true, d: .7 }));
    tf(s3r2, life(u, KB.pl, KB.easy - .2, { from: .5, dy: 40 }));
    tf(s3r2.querySelector('.r2'), life(u, KB.plAre, 1e9, { from: .4, dy: 20, el: true, d: .7 }));
    pop(s3eg1, u, KB.eg1, KB.pl - .2, { from: .3 }); pop(s3eg2, u, KB.eg2, KB.easy - .2, { from: .3 });
    const gOut = KB.easy - .3;
    GCA.draw(u, GT, {
      out: 1e9,
      gesture: {
        main: v => (v > KB.s1 + .6 && v < KB.s1th + 1.5) || (v > KB.s2 + .7 && v < KB.s2th + 1.5) ? salute(v) : v > KB.but ? { armR: 30, foreR: 10 } : {},
        mainExpr: v => v > KB.but ? 'surprise' : (v > KB.oneIs && v < KB.oneIs + 1.2) ? 'happy' : 'smile',
        other: (v, i) => (v > KB.s2 + .7 && v < KB.s2th + 1.5) ? salute(v) : v > KB.but ? { expr: 'surprise' } : (v > KB.manyAre && v < KB.manyAre + 1.2) ? { expr: 'happy' } : {},
      },
    });
    // hide the sentence card when the side-by-side comparison takes over
    const sOut = P(u, gOut, .35);
    [GCA.root.children[0], GCA.SA.el, GCA.SB.el].forEach(e => { e.style.opacity = (parseFloat(e.style.opacity || 1)) * (1 - sOut); });
    GCA.root.querySelectorAll('.row').forEach(r => { r.style.opacity = parseFloat(r.style.opacity || 1) * (1 - sOut); });
    GC.drawPanel(s3pA, u, KB.easy, KB.but - .1, { t: u, pulseAt: [KB.oneIs] });
    GC.drawPanel(s3pB, u, KB.easy + .2, KB.but - .1, { t: u, pulseAt: [KB.manyAre] });
    pop(s3gen, u, KB.oneIs + .3, KB.but - .1, { from: .4 });
    s3but.ts.forEach((tl, i) => tf(tl, { ...life(u, KB.but + i * .07, 1e9, { from: .2, dy: -50, el: true, d: .55 }), y: bob(u, i, 4) }));
    const wn = life(u, KB.but + .5, 1e9, { from: .3, dy: 20, el: true, d: .7 });
    tf(s3warn, { ...wn, x: shake(u, KB.but + .6, .5, 8) });
  }

  // ======================================================================
  // SCENE 4 — EXPLANATION (04_explanation.mp3): the police takes a plural verb
  // ======================================================================
  const s4 = $('s4'), XB = B.expl;
  const s4h = hdr(s4, `${ICO.warn(52)}จุดหลอกสำคัญ!`, 'yl');
  const s4t = tiles(s4, 470);
  const s4mag = add(s4, `<div class="abs" style="left:0;top:0">${ICO.mag(150, '#142B53')}</div>`);
  const s4noS = add(s4, `<div class="card blue c" style="top:606px;padding:12px 0 14px"><div class="en" style="font-size:36px">No final S <span style="color:#EE7FAA">≠</span> automatically singular</div>
      <div class="th" style="font-size:30px;color:#2F6BFF">ไม่มี S ลงท้าย ไม่ได้แปลว่าเป็นเอกพจน์เสมอไป</div></div>`);
  const s4thep = add(s4, `<div class="card c" style="top:740px;padding:14px 0 18px"><div class="big" style="font-size:80px;color:#EE7FAA">THE POLICE</div>
      <div class="th" style="font-size:32px">= เจ้าหน้าที่ตำรวจ <b style="color:#EE7FAA">โดยรวม</b></div></div>`);
  const s4pv = row(s4, 930, `<div class="chip pk" style="font-size:34px">PLURAL VERB · ใช้กริยาพหูพจน์ → <span class="vb" style="background:#fff;color:#EE7FAA;margin-left:6px">ARE</span></div>`);
  const s4one = add(s4, `<div class="card blue c" style="top:470px;padding:16px 0 20px"><div class="th" style="font-size:32px;color:#2F6BFF">ต่างจากคำว่า</div><div class="big" style="font-size:76px;color:#2F6BFF" data-fit="600">A POLICE OFFICER</div></div>`);
  const s4oneT = row(s4, 690, `<div class="chip bl" style="font-size:34px">${CHAR.person(44, '#fff')}ONE PERSON · ตำรวจ 1 คน · เอกพจน์</div>`);
  const s4pA = add(s4, `<div class="pnl blue c" style="left:220px;top:470px;height:270px"><div class="ph">1 คน</div><div style="padding:20px 8px 0"><div class="en" style="font-size:34px" data-fit="290">A police officer</div>
      <div class="pnt" style="font-size:30px;margin-top:10px">singular · เอกพจน์</div><div class="pv" style="font-size:64px;margin-top:6px">IS</div></div></div>`);
  const s4pB = add(s4, `<div class="pnl pink c" style="left:550px;top:470px;height:270px"><div class="ph">ตำรวจโดยรวม</div><div style="padding:20px 8px 0"><div class="en" style="font-size:34px">The police</div>
      <div class="pnt" style="font-size:30px;margin-top:10px">plural · พหูพจน์</div><div class="pv" style="font-size:64px;margin-top:6px">ARE</div></div></div>`);
  const s4rule = add(s4, `<div class="card dual c" style="top:790px;padding:14px 20px;text-align:left">
      <div class="r1" style="display:flex;align-items:center;gap:14px;font-weight:700;font-size:36px"><span style="width:56px;height:56px;border-radius:50%;background:#EF4444;display:grid;place-items:center;flex:none">${ICO.cross(34)}</span><span data-fit="520">ดูแค่มีหรือไม่มีตัว S</span></div>
      <div class="r2" style="display:flex;align-items:center;gap:14px;font-weight:700;font-size:36px;margin-top:12px"><span style="width:56px;height:56px;border-radius:50%;background:#22C55E;display:grid;place-items:center;flex:none">${ICO.check(34)}</span><span data-fit="520">ดูความหมายของประธานด้วย</span></div></div>`);
  const s4try = row(s4, 660, `<div class="hp bl" style="font-size:46px">ลองเลือกคำตอบกันเลย!</div>`);
  const s4G = [actor(s4, 'B'), actor(s4, 'A'), actor(s4, 'C'), actor(s4, 'D')];
  const s4X0 = [300, 450, 630, 790];
  const XS = XB.so;   // panels + group return
  sfx('radio', EX0 + .05, .8); sfx('buzz', EX0 + XB.trap + .1, .5); [...Array(6)].forEach((_, i) => sfx('click', EX0 + XB.word + .05 + i * .08, .5));
  [0, 1, 2, 3].forEach(i => sfx('pop', EX0 + .3 + i * .12, .4)); sfx('pop', EX0 + XB.plural + .1, .6); sfx('ding', EX0 + XB.plural + 3.0, .6);
  sfx('scan', EX0 + XB.noS, .7); sfx('pop', EX0 + XB.noS + 1.1, .6);
  steps(EX0 + XB.diff - .2, 1.3); sfx('whoosh', EX0 + XB.diff, .5); sfx('pop', EX0 + XB.one + .1, .6);
  steps(EX0 + XS, 1.4); sfx('swoosh', EX0 + XB.exam - .1, .6); sfx('buzz', EX0 + XB.dont + .1, .5); sfx('success', EX0 + XB.meaning + .1, .5);
  sfx('whoosh', EX0 + XB.try - .1, .6); sfx('riser', EX0 + XB.try + .3, .5);
  function drawS4(t) {
    const u = t - EX0;
    drawHdr(s4h, u, XB.trap, XB.diff - .2);
    const tOut = XB.diff - .15;
    const zk = P(u, XB.noS - .1, .4) * (1 - P(u, XB.noS + 2.6, .4));
    s4t.ts.forEach((tl, i) => {
      const l = life(u, XB.word + i * .07, tOut, { from: .2, dy: -50, el: true, d: .55 });
      const mk = i === 5 ? clamp((u - XB.noS - 1.0) / .3) * (1 - clamp((u - tOut + .3) / .2)) : 0;
      tf(tl, { ...l, y: l.y + bob(u, i, 4), s: l.s * (1 + .08 * zk + .12 * mk) });
      tl.style.boxShadow = mk > 0 ? `0 0 0 ${6 * mk}px #fff,0 0 0 ${12 * mk}px #FFD23F` : '';
    });
    const mg = P(u, XB.noS - .05, 1.1), mo = clamp((u - XB.noS + .1) / .2) * (1 - clamp((u - XB.noS - 1.8) / .3));
    tf(s4mag, { x: lerp(200, 710, E.inOut(mg)), y: 462 + Math.sin(mg * Math.PI * 3) * 14, o: mo, r: -10 + Math.sin(u * 4) * 4 });
    pop(s4noS, u, XB.noS + 1.0, tOut, { from: .4 });
    tf(s4thep, life(u, XB.plural, tOut, { from: .4, dy: 40 }));
    pop(s4pv, u, XB.plural + 2.9, tOut, { from: .3, el: true, d: .7 });
    tf(s4one, life(u, XB.diff + .1, XS - .1, { from: .4, dy: 40 }));
    pop(s4oneT, u, XB.one, XS - .1, { from: .3, el: true, d: .7 });
    tf(s4pA, life(u, XB.exam - .1, XB.try - .1, { from: .5, dy: 50 }));
    tf(s4pB, life(u, XB.exam + .1, XB.try - .1, { from: .5, dy: 50 }));
    tf(s4rule, life(u, XB.dont - .1, XB.try - .1, { from: .6, dy: 40 }));
    tf(s4rule.querySelector('.r1'), { ...life(u, XB.dont, 1e9, { from: .3, dy: 20, el: true }), x: shake(u, XB.dont + .3, .5, 8) });
    tf(s4rule.querySelector('.r2'), life(u, XB.meaning, 1e9, { from: .3, dy: 20, el: true }));
    // fold into the quiz: panels flip on X
    const fold = P(u, XB.try - .1, .45);
    [s4pA, s4pB, s4rule].forEach(e => { if (fold > 0) e.style.transform += ` perspective(900px) rotateX(${fold * 90}deg)`; });
    tf(s4try, life(u, XB.try + .2, 1e9, { from: .3, dy: 30, el: true, d: .8 }));
    // officers: group of four → only A stays (others step out) → A left, group right again
    s4G.forEach((g, i) => {
      const isA = i === 1;
      let x = s4X0[i], walk = null, flip = false, o = clamp((u - .2 - i * .12) / .3);
      const dy = (1 - E.back(P(u, .2 + i * .12, .5))) * 200;
      if (u > XB.diff - .2) {
        if (isA) { const w = walkX(u, XB.diff - .2, 1.2, s4X0[1], 540); x = w.x; walk = w.walk; }
        else { const w = walkX(u, XB.diff - .2, 1.2, s4X0[i], i === 0 ? -170 : 1250); x = w.x; walk = w.walk; flip = i === 0 && walk != null; }
      }
      if (u > XS) {
        if (isA) { const w = walkX(u, XS, 1.3, 540, 330); x = w.x; walk = w.walk; flip = walk != null; }
        else { const w = walkX(u, XS + i * .15, 1.4, 1250, [640, 0, 760, 880][i]); x = w.x; walk = w.walk; flip = walk != null; }
      }
      const surprised = u > XB.noS && u < XB.noS + 2.5;
      g.set({ x, y: GROUND + dy, t: u + i * .8, walk, flip, o, expr: surprised ? 'surprise' : u > XB.try ? 'happy' : 'smile', ...(u > XB.try + .2 ? { armR: 150 + Math.sin(u * 8 + i) * 15, foreR: 30 } : isA && u > XB.one && u < XS ? { armR: 100, foreR: 40 } : {}) });
    });
  }

  // ======================================================================
  // SCENE 5 — QUIZ (05_quiz.mp3) + 5 s COUNTDOWN + REVEAL part 1 (06_answer.mp3 up to "เหตุผลก็คือ")
  // ======================================================================
  const s5 = $('s5'), QB = B.quiz, AB = B.ans;
  const q5mas = add(s5, `<img class="abs" src="${BASE}brand/mascot_presenter.png" style="left:-40px;top:1430px;height:470px">`);
  const q5h = row(s5, 356, `<div class="hp" style="font-size:46px" data-fit="640">เตรียมสอบนายสิบตำรวจ</div>`);
  const q5sub = row(s5, 452, `<div class="chip bl" style="font-size:30px;padding:6px 24px;letter-spacing:2px">ENGLISH GRAMMAR</div>`);
  const q5sol = row(s5, 356, `<div class="hp gr" style="font-size:52px">${ICO.check(52)}เฉลย!</div>`);
  const Q = QZ.buildQuestion(s5, { top: 524 });
  const OPTS = QZ.buildOptions(s5, { top: 884 });
  const OAT = [QB.oA, QB.oB, QB.oC, QB.oD];
  const CDW = QZ.buildCountdown(s5, { top: 1150, size: 280 });
  const q5which = row(s5, 1210, `<div class="chip nv" style="font-size:36px">ช่องว่างนี้ควรใช้คำใด?</div>`);
  const q5warn = row(s5, 1196, `<div class="hp yl" style="font-size:38px">${ICO.warn(48)}POLICE ไม่มีตัว S ลงท้าย</div>`);
  const q5pick = row(s5, 1210, `<div class="chip pk" style="font-size:38px">คุณจะเลือกข้อไหน?</div>`);
  const q5five = row(s5, 1206, `<div class="hp bl" style="font-size:40px">${ICO.timer(46)}ให้เวลาคิด 5 วินาที!</div>`);
  const q5ok = row(s5, 1196, `<div class="hp gr" style="font-size:40px">${ICO.check(46)}ประโยคที่ถูกต้อง</div>`);
  const q5fly = add(s5, `<div class="abs c" style="left:0;top:0"><span class="vb ok" style="font-size:66px;font-weight:800">are</span></div>`);
  const q5flash = add(s5, `<div class="flash"></div>`);
  const q5conf = NSP.buildConfetti(add(s5, `<div class="abs" style="inset:0"></div>`), 50, OPTS[1].cx, OPTS[1].cy);
  [...s5.querySelectorAll('.conf')].forEach((c, i) => { c.style.background = ['#EE7FAA', '#2F6BFF', '#22D3EE', '#FFD23F', '#F7A8C4', '#22C55E'][i % 6]; });
  const q5G = [actor(s5, 'B', { prop: 'clipboard' }), actor(s5, 'A'), actor(s5, 'C', { prop: 'magnifier' })];
  const q5board = CHAR.searchBoard(s5, { left: 650, top: 1070, w: 190 });
  sfx('radio', QS + .05, .8); sfx('whoosh', QS + QB.intro, .5); sfx('pop', QS + QB.inst + .1, .5);
  ['The', 'police', 'blank', 'looking', 'for', 'the', 'suspect'].forEach((_, i) => sfx('key', QS + QB.q + i * .12, .6));
  sfx('pop', QS + QB.th + .1, .5); sfx('pop', QS + QB.which, .6);
  OAT.forEach(a => { sfx('swoosh', QS + a - .2, .5); sfx('click', QS + a + .05, .6); });
  sfx('buzz', QS + QB.warn + .1, .4); sfx('pop', QS + QB.pick, .6); sfx('pop', QS + QB.five, .6);
  for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', CD + i, 1);
  sfx('riser', AN - .9, .5); sfx('ding', AN + AB.sol + .05, .7); sfx('success', AN + AB.kk + .05, 1); sfx('sparkle', AN + AB.kk + .2, 1);
  sfx('whoosh', AN + AB.are - .2, .6); sfx('drop', AN + AB.are + .35, .7); sfx('pop', AN + AB.correct, .6); sfx('sparkle', AN + AB.sent, .6); sfx('pop', AN + AB.th + .1, .5);
  steps(AN + AB.th + .1, 1.4);
  mark('countdown_start', CD); mark('answer_start', AN);
  // blank position (stage coordinates) for the flying answer
  const BLX = 540 + 120, BLY = 524 + 22 + 44 + 52;
  function drawS5(t) {
    const u = t - QS, ua = t - AN, f = Math.round((t - CD) * FPS);
    tf(q5mas, { y: (1 - E.back(P(u, .3, .6))) * 300 + bob(u, 0, 6), r: Math.sin(u * 1.3) * 2, o: 1 - clamp((ua - AB.th) / .4) });
    drawHdr(q5h, u, QB.intro, AN - QS - .05);
    pop(q5sub, u, QB.intro + .2, AN - QS - .05);
    tf(q5sol, life(ua, AB.sol, 1e9, { from: .3, dy: -30, el: true, d: .7 }));
    // question card
    tf(Q.el, life(u, QB.intro + .1, 1e9, { from: .6, dy: 50 }));
    tf(Q.qi, life(u, QB.inst, 1e9, { from: .5, dy: 16 }));
    tf(Q.l1, life(u, QB.q, 1e9, { from: .5, dy: 20 }));
    tf(Q.l2, life(u, QB.q + .5, 1e9, { from: .5, dy: 20 }));
    tf(Q.th, life(u, QB.th, 1e9, { from: .6, dy: 16 }));
    // blank: blinking before the reveal, filled with "are" only after the countdown
    const fk = P(ua, AB.are + .3, .35);
    Q.blank.style.borderBottomColor = ua > AB.are + .3 ? '#16A34A' : `rgba(20,43,83,${.55 + .45 * Math.abs(Math.sin(u * 3))})`;
    Q.fill.style.opacity = ua >= 0 ? fk : 0;
    Q.fill.style.transform = `scale(${lerp(1.6, 1, E.back(fk))})`;
    // sentence highlight sweep (5.51) + Thai pulse (8.02)
    const sw = P(ua, AB.sent, 1.4);
    Q.l1.style.backgroundImage = Q.l2.style.backgroundImage = ua > AB.sent ? `linear-gradient(90deg,rgba(255,210,63,.55) ${sw * 100}%,rgba(255,210,63,0) ${sw * 100}%)` : '';
    Q.l1.style.borderRadius = Q.l2.style.borderRadius = '16px';
    Q.th.style.transform = `scale(${1 + .1 * Math.max(0, 1 - Math.abs(ua - AB.th - 1.2) / .4)})`;
    // options (neutral focus while each is read), reveal after the countdown
    QZ.drawOptions(OPTS, u, OAT, ua < 0 ? -1 : ua - AB.kk, { hideAt: AB.th - AB.kk, focusEnd: QB.warn - .2 });
    pop(q5which, u, QB.which, QB.oA - .3);
    tf(q5warn, { ...life(u, QB.warn, QB.pick - .15, { from: .3, dy: 20, el: true, d: .7 }), x: shake(u, QB.warn + .2, .4, 6) });
    pop(q5pick, u, QB.pick, QB.five - .1);
    tf(q5five, life(u, QB.five, CD - QS - .05, { from: .3, dy: 20, el: true, d: .7 }));
    QZ.drawCountdown(CDW, f, FPS, CDN);
    tf(q5ok, life(ua, AB.correct, AB.th - .1, { from: .3, dy: 20, el: true, d: .7 }));
    // answer token flies from choice ข into the blank
    const fl = P(ua, AB.are - .1, .45);
    const x0 = OPTS[1].cx, y0 = OPTS[1].cy;
    tf(q5fly, { x: lerp(x0, BLX, E.inOut(fl)) - 60, y: lerp(y0, BLY, E.inOut(fl)) - 45 - Math.sin(fl * Math.PI) * 120, s: lerp(.8, 1.15, Math.sin(fl * Math.PI)), o: fl > 0 && fl < 1 ? 1 : 0 });
    q5flash.style.opacity = .55 * Math.max(0, 1 - Math.abs(ua - AB.kk) / .18) + .35 * Math.max(0, 1 - Math.abs(ua - AB.are - .35) / .15);
    NSP.drawConfetti(q5conf, t, AN + AB.kk, 2.4);
    // the police carry out the search (after the options leave)
    const gk = ua - AB.th;
    q5G.forEach((g, i) => {
      const w = walkX(gk, .1 + i * .15, 1.4, i < 2 ? -170 - i * 90 : 1250, [300, 470, 640][i]);
      g.set({ x: w.x, y: GROUND, t: t + i, walk: w.walk, flip: i === 2 && w.walk != null, o: gk > 0 ? 1 : 0, expr: 'smile', lookX: i === 2 ? -1 : 1, ...(i === 2 && w.walk == null ? { armR: 70 + Math.sin(t * 1.6) * 20, foreR: 70 } : i === 1 && w.walk == null ? { armR: 120, foreR: 10 } : { armL: 30, foreL: 70 }) });
    });
    tf(q5board, { ...life(gk, .9, 1e9, { from: .2, dy: -60, el: true, d: .8 }), r: Math.sin(t * 1.4) * 1.5 });
  }

  // ======================================================================
  // SCENE 6 — ANSWER part 2: why ARE, the single-officer contrast, memory lock
  // ======================================================================
  const s6 = $('s6');
  const a6h1 = hdr(s6, 'เหตุผลก็คือ…', '');
  const a6h2 = hdr(s6, `${CHAR.person(50, '#fff')}ถ้าเป็นตำรวจ 1 คน`, 'bl');
  const a6h3 = hdr(s6, 'จำให้แม่น!', 'nv', 50);
  // infographic C: SUBJECT | VERB | REMAINING PHRASE
  const blk = (txt, lab, c1, c2, size = 56) => `<div class="c" style="display:flex;flex-direction:column;align-items:center;gap:8px"><div style="padding:10px 22px;border-radius:24px;background:#fff;box-shadow:0 0 0 5px ${c1},0 12px 24px rgba(110,90,150,.18);font-weight:800;font-size:${size}px;color:#142B53;white-space:nowrap">${txt}</div><div class="lab" style="font-weight:800;font-size:24px;color:#fff;background:${c2};padding:4px 16px;border-radius:14px;white-space:nowrap">${lab}</div></div>`;
  const a6r1 = add(s6, `<div class="row" style="top:466px;gap:22px;align-items:flex-start">${blk('The police', 'SUBJECT · ประธาน', '#95BFEF', '#2F6BFF')}${blk('are', 'VERB · กริยา', '#F7A8C4', '#EE7FAA')}</div>`);
  const a6sub = a6r1.children[0], a6verb = a6r1.children[1];
  const a6r2 = add(s6, `<div class="row" style="top:640px">${blk('looking for the suspect.', 'ส่วนที่เหลือของประโยค', '#DCE2EA', '#7A8BA3', 46)}</div>`);
  const a6coll = row(s6, 790, `<div class="chip bl" style="font-size:32px">The police = เจ้าหน้าที่ตำรวจ<b>โดยรวม</b></div>`);
  const a6pv = row(s6, 790, `<div class="chip pk" style="font-size:32px">→ ต้องใช้กริยารูปพหูพจน์</div>`);
  const a6ok = add(s6, `<div class="card dual c" style="top:870px;padding:14px 18px;text-align:left">
      <div class="r1" style="display:flex;align-items:center;gap:14px"><span style="width:52px;height:52px;border-radius:50%;background:#22C55E;display:grid;place-items:center;flex:none">${ICO.check(32)}</span><span class="en" style="font-size:38px" data-fit="520">The police <span class="vb ok">are</span> looking…</span></div>
      <div class="r2" style="display:flex;align-items:center;gap:14px;margin-top:10px"><span style="width:52px;height:52px;border-radius:50%;background:#EF4444;display:grid;place-items:center;flex:none">${ICO.cross(32)}</span><span class="en" style="font-size:38px;color:#94A3B8;text-decoration:line-through;text-decoration-color:#EF4444;text-decoration-thickness:5px" data-fit="440">The police is looking…</span><span class="chip rd" style="font-size:24px;padding:4px 14px">ผิด</span></div></div>`);
  // phase C: single officer
  const a6s1 = GC.sentence(s6, { top: 476, size: 58, words: ['A', 'police', 'officer', { t: 'is', verb: 'is' }, 'looking', 'for', 'the', 'suspect.'], th: 'ตำรวจหนึ่งคนกำลังตามหาผู้ต้องสงสัย', thColor: '#2F6BFF' });
  const a6s1card = add(s6, `<div class="card blue c" style="top:452px;height:300px"></div>`);
  s6.insertBefore(a6s1card, a6s1.el);
  const a6soIs = row(s6, 790, `<div class="chip bl" style="font-size:36px">ประธานเป็นตำรวจ 1 คน → ใช้ <span class="vb" style="background:#fff;color:#2F6BFF;margin-left:6px">IS</span></div>`);
  // phase D: memory lock — two equal panels with the real characters inside
  const a6mem = add(s6, `<div class="abs c" style="left:190px;top:440px;width:700px;height:860px;transform-origin:50% 50%"></div>`);
  const a6frame = add(a6mem, `<div class="abs" style="inset:0;border-radius:40px;background:#fff;box-shadow:0 26px 60px rgba(110,90,150,.35)"></div>`);
  const a6pA = GC.panel(a6mem, { left: 30, top: 30, hgt: 600, theme: 'blue', head: 'ตำรวจ 1 คน', subj: 'A police officer', verb: 'IS', looks: ['A'], scale: .78 });
  const a6pB = GC.panel(a6mem, { left: 360, top: 30, hgt: 600, theme: 'pink', head: 'ตำรวจโดยรวม', subj: 'The police', verb: 'ARE', looks: ['B', 'A', 'C'], scale: .6 });
  a6pA.actors[0].px = 155; a6pB.actors.forEach((a, i) => { a.px = [80, 155, 230][i]; });
  const a6rule = add(a6mem, `<div class="abs" style="left:30px;top:666px;width:640px;text-align:center">
      <div class="en m1" style="font-size:44px">A police officer = <span class="vb is">IS</span></div>
      <div class="en m2" style="font-size:44px;margin-top:10px">The police = <span class="vb are">ARE</span></div></div>`);
  const a6pin = add(a6mem, `<div class="abs" style="left:322px;top:-26px;width:56px;height:56px;border-radius:50%;background:radial-gradient(circle at 35% 30%,#FF91BA,#EE7FAA 60%,#C8557F);box-shadow:0 6px 10px rgba(0,0,0,.25)"></div>`);
  const a6flash = add(s6, `<div class="flash"></div>`);
  const a6end = row(s6, 1330, `<div class="chip gr" style="font-size:32px">${ICO.check(36)}เข้าใจจุดนี้ = ลดโอกาสพลาดข้อสอบ!</div>`);
  const a6G = [actor(s6, 'B', { prop: 'clipboard' }), actor(s6, 'A'), actor(s6, 'C', { prop: 'magnifier' })];
  const FRZ = AB.mAre + 1.75;   // photographic memory freeze (narration continues)
  sfx('pop', AN + AB.why + .1, .6); sfx('pop', AN + AB.thep + .1, .7); sfx('ding', AN + AB.coll + .2, .5); steps(AN + AB.coll, 1.1);
  sfx('pop', AN + AB.pv + .1, .7); sfx('success', AN + AB.areNot + .1, .5); sfx('buzz', AN + AB.areNot + .9, .4);
  steps(AN + AB.swap, 1.3); sfx('whoosh', AN + AB.swap, .5); ['A', 'police', 'officer', 'is', 'looking', 'for', 'the', 'suspect'].forEach((_, i) => sfx('key', AN + AB.s1 + i * .11, .5)); sfx('pop', AN + AB.soIs, .6);
  sfx('swoosh', AN + AB.mem - .2, .7); sfx('pop', AN + AB.mIs + .2, .7); sfx('pop', AN + AB.mAre + .2, .7); sfx('shutter', AN + FRZ, 1); sfx('freeze', AN + FRZ + .05, .6); sfx('sparkle', AN + AB.end + .2, .5);
  mark('memory_freeze', AN + FRZ);
  function drawS6(t) {
    const ua = t - AN;
    drawHdr(a6h1, ua, AB.why - .2, AB.swap - .1);
    drawHdr(a6h2, ua, AB.swap, AB.mem - .2);
    drawHdr(a6h3, ua, AB.mem, 1e9);
    const bOut = AB.swap - .15;
    tf(a6sub, life(ua, AB.thep, bOut, { from: .3, dy: 40, el: true, d: .7 }));
    tf(a6verb, life(ua, AB.pv, bOut, { from: .3, dy: -60, el: true, d: .7 }));
    tf(a6r2.firstElementChild, life(ua, AB.pv + .6, bOut, { from: .4, dy: 30 }));
    tf(a6r1, { o: 1 }); tf(a6r2, { o: 1 });
    pop(a6coll, ua, AB.coll + .2, AB.pv - .1, { from: .4 });
    pop(a6pv, ua, AB.pv + .2, bOut, { from: .4 });
    tf(a6ok, life(ua, AB.areNot, bOut, { from: .5, dy: 40 }));
    tf(a6ok.querySelector('.r2'), { ...life(ua, AB.areNot + .8, 1e9, { from: .4, dy: 10 }), x: shake(ua, AB.areNot + 1.0, .5, 8) });
    // phase C
    const cOut = AB.mem - .2;
    tf(a6s1card, life(ua, AB.swap + .4, cOut, { from: .6, dy: 40 }));
    GC.drawSentence(a6s1, ua, AB.s1, { step: .11, out: cOut, thAt: AB.s1 + 1.4 });
    a6s1.ws[3].el.style.transform += ` scale(${1 + .2 * Math.max(0, 1 - Math.abs(ua - AB.soIs - .2) / .35)})`;
    pop(a6soIs, ua, AB.soIs, cOut, { from: .3, el: true, d: .7 });
    // characters for phases B and C
    const gather = P(ua, AB.coll, 1.1);
    a6G.forEach((g, i) => {
      let x = lerp([270, 540, 810][i], [400, 540, 680][i], E.inOut(gather)), walk = gather > 0 && gather < 1 ? (ua - AB.coll) * 9 : null, flip = i === 2 && walk != null;
      if (ua > AB.swap && i !== 1) { const w = walkX(ua, AB.swap, 1.3, x, i === 0 ? -180 : 1260); x = w.x; walk = w.walk; flip = i === 0 && walk != null; }
      const ci = (ua > AB.s1 && i === 1 && ua < cOut) ? { armR: 120, foreR: 10, lookX: 1 } : (ua > AB.soIs && i === 1) ? salute(ua) : {};
      g.set({ x, y: GROUND, t: t + i, walk, flip, o: 1 - P(ua, cOut, .3), expr: ua > AB.areNot && ua < AB.swap ? 'happy' : 'smile', ...(i === 2 && walk == null && ua < AB.swap ? { armR: 70 + Math.sin(t * 1.6) * 20, foreR: 70 } : ci) });
    });
    // phase D: memory lock
    const mIn = life(ua, AB.mem + .1, 1e9, { from: .6, dy: 60, d: .6 });
    const fz = P(ua, FRZ, .35);
    tf(a6mem, { ...mIn, r: -2.5 * E.back(fz), s: mIn.s * (1 - .04 * E.out(fz)) });
    a6frame.style.opacity = E.out(fz);
    tf(a6pin, { o: fz, s: lerp(2, 1, E.back(fz)), y: (1 - E.out(fz)) * -60 });
    const frozenT = ua > FRZ ? AN + FRZ : null;
    GC.drawPanel(a6pA, ua, AB.mem + .2, 1e9, { t, pulseAt: [AB.mIs + .1], frozen: frozenT });
    GC.drawPanel(a6pB, ua, AB.mem + .4, 1e9, { t, pulseAt: [AB.mAre + .1], frozen: frozenT });
    tf(a6rule.querySelector('.m1'), life(ua, AB.mIs, 1e9, { from: .3, dy: 20, el: true, d: .7 }));
    tf(a6rule.querySelector('.m2'), life(ua, AB.mAre, 1e9, { from: .3, dy: 20, el: true, d: .7 }));
    a6flash.style.opacity = .85 * Math.max(0, 1 - Math.abs(ua - FRZ) / .16);
    pop(a6end, ua, AB.end + .2, 1e9, { from: .3, el: true, d: .7 });
  }

  // ======================================================================
  // SCENE 7 — PROMOTION + END CARD (07_promotion.mp3)
  // ======================================================================
  const s7 = $('s7'), PB = B.promo;
  const p7q = add(s7, `<div class="card dual c" style="top:400px;padding:22px 0"><div class="th" style="font-size:54px">คุณตอบถูกข้อ <span style="color:#16A34A">ข.</span> ไหม?</div></div>`);
  const p7cm = add(s7, `<div class="card blue c" style="top:580px;height:440px;padding:24px 28px;text-align:left">
      <div style="display:flex;align-items:center;gap:12px;font-weight:800;font-size:32px;color:#2F6BFF">${ICO.comment(44, '#2F6BFF')}คอมเมนต์</div>
      ${[['ข้อ ข. ครับ!', '#2F6BFF'], ['The police are ✓', '#EE7FAA'], ['ข้อ ข. ค่ะ', '#22D3EE']].map(([tx, c], i) => `<div class="cm" style="display:flex;align-items:center;gap:14px;margin-top:24px"><div style="width:70px;height:70px;border-radius:50%;background:${c};display:grid;place-items:center;flex:none">${CHAR.person(50, '#fff', false)}</div><div style="background:${i % 2 ? '#FFE3EF' : '#E6F4FF'};font-weight:700;font-size:32px;padding:12px 22px;border-radius:22px;white-space:nowrap">${tx}</div><div class="lk" style="margin-left:auto">${NSP.ICON.heart('#EE7FAA')}</div></div>`).join('')}</div>`);
  const p7cbtn = row(s7, 1070, `<div class="btn pk" style="font-size:36px">${ICO.comment(42)}คอมเมนต์มาบอกกันหน่อย!</div>`);
  const p7b4 = hdr(s7, 'ก่อนดูคลิปนี้…', 'bl');
  const p7think = add(s7, `<div class="card dual c" style="top:470px;padding:20px 0 26px"><div class="th" style="font-size:40px">คุณคิดว่า</div><div class="big" style="font-size:90px">THE POLICE</div>
      <div class="big" style="font-size:44px;margin-top:4px;color:#31445D">ใช้ <span class="vb is pi" style="font-size:62px">IS</span> หรือ <span class="vb are pa" style="font-size:62px">ARE</span> ?</div></div>`);
  const p7ans = row(s7, 860, `<div class="hp gr" style="font-size:54px">THE POLICE → ARE ${ICO.check(50)}</div>`);
  const p7prac = row(s7, 1000, `<div class="chip yl" style="font-size:32px">${ICO.book(40, '#142B53')}ฝึกภาษาอังกฤษ + ข้อสอบตำรวจเพิ่ม</div>`);
  const p7logo = add(s7, `<img class="abs c" src="${BASE}brand/logo.png" style="left:330px;top:440px;width:420px">`);
  const p7wm = row(s7, 900, `<div class="wm" style="font-size:112px">NaiSibPro</div>`);
  const p7th = row(s7, 1046, `<div class="chip pk" style="font-size:40px;padding:10px 36px">นายสิบโปร</div>`);
  const p7mas = add(s7, `<img class="abs" src="${BASE}brand/mascot_presenter.png" style="left:770px;top:1080px;height:520px">`);
  const p7poster = add(s7, `<div class="abs c" style="left:260px;top:450px;width:290px;height:515px;border-radius:24px;overflow:hidden;box-shadow:0 20px 44px rgba(110,90,150,.4),0 0 0 7px #fff"><img src="${BASE}brand/poster.jpg" style="width:290px;height:515px;display:block"></div>`);
  const p7cnt = add(s7, `<div class="c" style="position:absolute;left:580px;top:560px;width:280px;text-align:center"><div class="cn big" style="font-size:64px;line-height:1;color:#EE7FAA">10,000+</div><div class="th" style="font-size:32px;color:#2F6BFF">ข้อสอบ</div></div>`);
  const p7bank = row(s7, 1010, `<div class="chip pk" style="font-size:36px">รวมข้อสอบมากกว่าหมื่นข้อ</div>`);
  const p7week = row(s7, 1110, `<div class="chip bl" style="font-size:36px">${ICO.cal(40)}อัปเดตทุกสัปดาห์!</div>`);
  const p7end = add(s7, `<div class="abs" style="inset:0;background:linear-gradient(118deg,#FFE3EF 0%,#F9C3DA 49%,#CBE2FA 51%,#EEF7FF 100%);visibility:hidden"></div>`);
  const e7logo = add(p7end, `<img class="abs c" src="${BASE}brand/logo.png" style="left:350px;top:400px;width:380px">`);
  const e7wm = row(p7end, 790, `<div class="wm" style="font-size:104px">NaiSibPro</div>`);
  const e7cta = row(p7end, 940, `<div style="font-weight:800;font-size:48px;letter-spacing:2px;color:#142B53;white-space:nowrap">LIKE · SHARE · FOLLOW</div>`);
  const e7btns = row(p7end, 1040, `<div style="display:flex;gap:14px"><div class="btn pk b1" style="font-size:30px">${ICO.like(36)}ไลก์</div><div class="btn b2" style="font-size:30px">${ICO.share(34)}แชร์</div><div class="btn cy b3" style="font-size:30px">${ICO.bell(36)}ติดตาม</div></div>`);
  const e7bye = row(p7end, 1190, `<div class="chip nv" style="font-size:32px">แล้วเจอกันคลิปถัดไป!</div>`);
  const e7G = [actor(p7end, 'B'), actor(p7end, 'A'), actor(p7end, 'C'), actor(p7end, 'D')];
  const e7hand = add(p7end, `<div class="abs" style="left:0;top:0">${NSP.ICON.hand(96)}</div>`);
  const e7conf = NSP.buildConfetti(add(p7end, `<div class="abs" style="inset:0"></div>`), 60, 540, 700);
  [...p7end.querySelectorAll('.conf')].forEach((c, i) => { c.style.background = ['#EE7FAA', '#2F6BFF', '#22D3EE', '#FFD23F', '#F7A8C4', '#95BFEF'][i % 6]; });
  const ENDC = PB.cta - .12;
  const BTN_AT = [PB.cta + .12, PB.cta + .76, PB.cta + 1.3];
  mark('endcard', PR + ENDC);
  sfx('radio', PR + .02, .6); sfx('pop', PR + PB.who + .1, .7); sfx('ding', PR + PB.kk + .1, .6); [0, 1, 2].forEach(i => sfx('msg', PR + PB.who + .6 + i * .5, .7)); sfx('click', PR + PB.comment + .3, .7);
  sfx('swoosh', PR + PB.before - .1, .6); sfx('pop', PR + PB.think + .1, .6); sfx('pop', PR + 7.38, .5); sfx('success', PR + 8.28 + .1, .6);
  sfx('pop', PR + PB.practice + .1, .6); sfx('riser', PR + PB.brand - .8, .5); sfx('whoosh', PR + PB.brand - .1, .6); sfx('sparkle', PR + PB.brand + .3, .8); sfx('ding', PR + PB.brand + .2, .6);
  sfx('whoosh', PR + PB.bank - .1, .5); for (let i = 0; i < 6; i++) sfx('coin', PR + PB.bank + .2 + i * .15, .4); sfx('pop', PR + PB.weekly, .7);
  sfx('whoosh', PR + ENDC, .7); sfx('ding', PR + ENDC + .3, .8); sfx('sparkle', PR + ENDC + .45, .9); BTN_AT.forEach(a => sfx('click', PR + a + .25, .7)); sfx('pop', PR + PB.bye, .6);
  function drawS7(t) {
    const u = t - PR;
    popEl(p7q, u, PB.who, PB.before - .2);
    tf(p7cm, life(u, PB.who + .3, PB.before - .2, { from: .7, dy: 60 }));
    [...p7cm.querySelectorAll('.cm')].forEach((c, i) => { tf(c, life(u, PB.who + .6 + i * .5, 1e9, { from: .4, dy: 30 })); c.querySelector('.lk').style.transform = `scale(${1 + .25 * Math.max(0, Math.sin((u - PB.kk - i * .3) * 4)) * (u > PB.kk ? 1 : 0)})`; });
    const cb = life(u, PB.comment, PB.before - .2, { from: .3, dy: 30, el: true });
    tf(p7cbtn, { ...cb, s: cb.s * (1 + .04 * Math.sin(u * 6)) });
    drawHdr(p7b4, u, PB.before, PB.practice - .2);
    tf(p7think, life(u, PB.think - .1, PB.brand - .2, { from: .5, dy: 40 }));
    const isW = Math.max(0, 1 - Math.abs(u - 7.5) / .35), arW = clamp((u - 8.28) / .25);
    p7think.querySelector('.pi').style.transform = `scale(${1 + .2 * isW}) rotate(${Math.sin(u * 20) * 6 * isW}deg)`;
    p7think.querySelector('.pi').style.opacity = 1 - .55 * arW;
    p7think.querySelector('.pa').style.transform = `scale(${1 + .2 * arW * (1 + .05 * Math.sin(u * 5))})`;
    p7think.querySelector('.pa').style.boxShadow = arW > 0 ? `0 0 0 ${5 * arW}px #fff,0 0 ${24 * arW}px rgba(34,197,94,.8)` : '';
    popEl(p7ans, u, 8.4, PB.brand - .2);
    popEl(p7prac, u, PB.practice + .1, PB.brand - .2);
    const lg = life(u, PB.brand, PB.bank - .1, { from: .2, dy: 120, el: true, d: 1.0, out: .3 });
    tf(p7logo, { ...lg, y: lg.y + bob(u, 0, 8), r: Math.sin(u * 1.8) * 2 });
    pop(p7wm, u, PB.brand + .4, PB.bank - .1); pop(p7th, u, PB.brand + .8, PB.bank - .1);
    tf(p7mas, { y: (1 - E.back(P(u, PB.brand + .5, .6))) * 500 + bob(u, 0, 6), o: clamp((u - PB.brand - .5) / .2) * (1 - P(u, ENDC - .1, .3)), r: Math.sin(u * 1.3) * 2 });
    tf(p7poster, { ...life(u, PB.bank, ENDC, { from: .6, dy: 60 }), r: -4 + Math.sin(u * 1.4) * 1.5 });
    tf(p7cnt, life(u, PB.bank + .2, ENDC, { from: .4, dy: 30 }));
    p7cnt.querySelector('.cn').textContent = (Math.round(10000 * E.out(P(u, PB.bank + .2, 1.2)) / 100) * 100).toLocaleString('en-US') + '+';
    pop(p7bank, u, PB.bank + .1, ENDC); popEl(p7week, u, PB.weekly, ENDC);
    // end card
    const ue = u - ENDC;
    p7end.style.visibility = ue < 0 ? 'hidden' : 'visible';
    p7end.style.clipPath = `circle(${E.out(P(ue, 0, .5)) * 1300}px at 540px 900px)`;
    tf(e7logo, { ...life(ue, .1, 1e9, { from: .2, dy: 0, el: true, d: 1.0 }), y: bob(ue, 0, 8) });
    pop(e7wm, ue, .35); pop(e7cta, ue, .55);
    tf(e7btns, life(ue, .7, 1e9, { from: .5, dy: 40 }));
    ['.b1', '.b2', '.b3'].forEach((s, i) => { const at = BTN_AT[i] - ENDC + .25; const pr = Math.max(0, 1 - Math.abs(ue - at) / .18); const b = e7btns.querySelector(s); b.style.transform = `scale(${1 - .1 * pr + .06 * Math.max(0, 1 - Math.abs(ue - at - .3) / .3)})`; b.style.filter = ue > at ? 'brightness(1.1) saturate(1.15)' : ''; });
    let hx = 0, hy = 0, ho = 0;
    if (ue > .8) { const seg = ue < BTN_AT[1] - ENDC ? 0 : ue < BTN_AT[2] - ENDC ? 1 : 2; const bx = [330, 545, 760][seg]; const k = E.inOut(P(ue, seg ? BTN_AT[seg] - ENDC - .35 : .8, .35)); const px = seg ? [330, 545, 760][seg - 1] : 700; hx = lerp(px, bx, k) - 20; hy = 1090 + 6 * Math.sin(ue * 8); ho = clamp((ue - .8) / .2) * (1 - clamp((ue - (BTN_AT[2] - ENDC + .9)) / .3)); }
    e7hand.style.transform = `translate(${hx}px,${hy}px) scale(${1 - .15 * NSP.pressDepth(ue, BTN_AT.map(a => a - ENDC + .2))})`; e7hand.style.opacity = ho;
    pop(e7bye, ue, PB.bye - ENDC, 1e9, { el: true, d: .7, from: .3 });
    e7G.forEach((g, i) => g.set({ x: [250, 430, 650, 830][i], y: 1720 + (1 - E.back(P(ue, .6 + i * .12, .6))) * 400, t: t + i, s: .9, expr: ue > PB.bye - ENDC ? 'happy' : 'smile', armR: 150 + Math.sin(t * 7 + i) * 18, foreR: 30, o: ue > .5 ? 1 : 0 }));
    NSP.drawConfetti(e7conf, t, PR + ENDC + .3, 2.8);
  }

  // ---------------------------------------------------------------- start
  NSP.start({
    ep: 'EP.51',
    brand: { showAt: -1 },
    wipes: [ST0, KN0, EX0, QS, AN2, PR],
    scenes: [
      { el: $('s1'), a: 0, b: ST0, draw: drawS1 },
      { el: $('s2'), a: ST0, b: KN0, draw: drawS2 },
      { el: $('s3'), a: KN0, b: EX0, draw: drawS3 },
      { el: $('s4'), a: EX0, b: QS, draw: drawS4 },
      { el: $('s5'), a: QS, b: AN2, draw: drawS5 },
      { el: $('s6'), a: AN2, b: PR, draw: drawS6 },
      { el: $('s7'), a: PR, b: END + 1, draw: drawS7 },
    ],
  });
  // shrink any text wider than its box (data-fit), then draw frame 0
  function fitAll() {
    const sc = [...document.querySelectorAll('.scene')]; const prev = sc.map(s => s.style.display); sc.forEach(s => s.style.display = 'block');
    document.querySelectorAll('[data-fit]').forEach(el => {
      const max = +el.dataset.fit; let fs = parseFloat(getComputedStyle(el).fontSize), g = 0;
      const rg = document.createRange();
      const w = () => { rg.selectNodeContents(el); return rg.getBoundingClientRect().width; };
      while (w() > max && fs > 14 && g++ < 90) { fs -= 1; el.style.fontSize = fs + 'px'; }
    });
    sc.forEach((s, i) => s.style.display = prev[i]);
  }
  const fontsLoaded = Promise.all([400, 500, 600, 700, 800].map(w => document.fonts.load(`${w} 40px Prompt`, 'กขคง ABC 0123')));
  window.ready = Promise.all([window.ready, fontsLoaded]).then(() => document.fonts.ready).then(() => { fitAll(); window.renderAt(0); return true; });
})();
