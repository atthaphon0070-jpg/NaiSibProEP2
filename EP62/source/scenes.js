// EP62 scenes — audio-first. Every beat is (segment start + measured phrase time from beats.js).
(function () {
const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark } = NSP;
const T = window.TL, S = k => T[k][0], D = k => T[k][1];
const HK = S('hook'), ST = S('story'), KN = S('know'), EX = S('expl'), QZ = S('quiz'), CD = S('cd'), AN = S('ans'), PR = S('promo');
const B = window.BEATS;
const add = (p, html) => { const e = h(html); p.appendChild(e); return e; };
const ctr = (p, top, inner, crit = true) => add(p, `<div class="ctr c${crit ? ' crit' : ''}" style="top:${top}px">${inner}</div>`);
const swing = (u, a, b, d = .45) => life(u, a, b, { from: .5, dy: 40, d, out: .25 });
const QM = (s, c = '#EE7FAA') => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><circle cx="50" cy="50" r="46" fill="#fff"/><circle cx="50" cy="50" r="46" fill="none" stroke="${c}" stroke-width="7"/><path d="M36 38 Q36 22 51 22 Q66 22 66 36 Q66 46 55 51 Q50 54 50 62" fill="none" stroke="${c}" stroke-width="10" stroke-linecap="round"/><circle cx="50" cy="77" r="6.5" fill="${c}"/></svg>`;
const WARN = s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2.5 L22.5 20.5 H1.5Z" fill="#FFD23F" stroke="#fff" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 9v5.5" stroke="#31445D" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.4" fill="#31445D"/></svg>`;
const MAG = s => `<svg width="${s}" height="${s}" viewBox="0 0 100 100"><circle cx="40" cy="40" r="28" fill="rgba(230,244,255,.55)" stroke="#31445D" stroke-width="9"/><path d="M61 61 L88 88" stroke="#EE7FAA" stroke-width="15" stroke-linecap="round"/><path d="M27 30 Q32 20 44 19" stroke="#fff" stroke-width="6" fill="none" stroke-linecap="round"/></svg>`;
const TARGET = s => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="#fff"/><circle cx="12" cy="12" r="7.5" fill="#F7A8C4"/><circle cx="12" cy="12" r="5" fill="#fff"/><circle cx="12" cy="12" r="2.6" fill="#2F6BFF"/></svg>`;
const ARROW = (c = '#fff', s = 40) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3 12h16M13 6l6 6-6 6" stroke="${c}" stroke-width="3" fill="none" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
const blink = CHAR.blink;

// ======================================================================
// SCENE 1 — HOOK (01_hook.mp3). Frame 0 already shows the full opening composition.
// ======================================================================
const s1 = $('s1'), hb = B.hook;
const h1 = ctr(s1, 368, `<div class="pillB" style="font-size:50px;padding:12px 34px">เตรียมสอบนายสิบตำรวจ</div>`);
const h2 = ctr(s1, 474, `<div class="pillW" style="font-size:42px;padding:10px 32px">${ICON.book(46, '#2F6BFF')}วิชางานสารบรรณ</div>`);
const h3 = ctr(s1, 574, `<div class="stk" style="font-size:60px">คำสั่ง ระเบียบ ข้อบังคับ<br><span style="color:#EE7FAA;font-size:78px">หรือประกาศ?</span></div>`);
const hFold = CLS.folder(s1, { x: 380, y: 900, w: 320, hgt: 300, tone: 'blue', head1: 'หนังสือ', head2: 'สั่งการ?', headFs: 46, items: [] });
const HW = ['คำสั่ง', 'ระเบียบ', 'ข้อบังคับ', 'ประกาศ'];
const hOff = CHAR.officer(s1);
const hDocs = HW.map((w, i) => { const el = CLS.docCard(w, { w: 150, hgt: 190, fs: 33 }); el.classList.add('c', 'crit'); s1.appendChild(el); return el; });
const hQ = add(s1, `<div class="abs c" style="left:700px;top:930px">${QM(150)}</div>`);
const hMag = add(s1, `<div class="abs" style="left:0;top:0">${MAG(130)}</div>`);
const hQ4 = add(s1, `<div class="abs c" style="left:0;top:0">${QM(70)}</div>`);
const hTrapTx = ctr(s1, 1236, `<div class="pillW" style="font-size:36px;padding:10px 28px">${WARN(44)}บางคำ ไม่ได้อยู่หมวดเดียวกัน!</div>`);
const hShufTitle = ctr(s1, 560, `<div class="pillW" style="font-size:34px;padding:8px 26px">ตัวเลือกในข้อสอบ</div>`);
const hShufCard = add(s1, `<div class="abs c crit" style="left:236px;top:640px;width:608px;height:150px;border-radius:40px;background:#fff;box-shadow:0 18px 36px rgba(110,90,150,.18),0 0 0 6px #fff,0 0 0 12px rgba(149,191,239,.5)"></div>`);
const hShuf = SHUFFLE.build(s1, { x: 250, y: 678, w: 560, fs: 32 });
const hWarn = ctr(s1, 850, `<div class="pillRed" style="font-size:50px;padding:14px 40px">สลับคำเดียว = ตอบผิด!</div>`);
const hToday = ctr(s1, 970, `<div class="pillB" style="font-size:42px;padding:12px 34px">${TARGET(52)}วันนี้มาจับจุดหลอกให้แม่น!</div>`);
// card positions: in the officer's hands (frame 0), the row, the folder fan
const fanPos = i => ({ x: 540 + (i - 1.5) * 64, y: 1330 - Math.abs(i - 1.5) * 8, r: (i - 1.5) * 13, s: .62 });
const rowPos = i => ({ x: 220 + 75 + i * 163.3, y: 720, r: 0, s: 1 });
const fldPos = i => i < 3 ? { x: 450 + i * 90, y: 880, r: (i - 1) * 9, s: .82 } : { x: 760, y: 850, r: 14, s: .82 };
HW.forEach((_, i) => { sfx('pop', HK + hb.w[i] + .05, .8); sfx('whoosh', HK + hb.w[i] - .05, .3); });
sfx('pop', HK + hb.allDir, .7); [0, 1, 2].forEach(i => sfx('page', HK + hb.allDir + .35 + i * .3, .6)); sfx('whoosh', HK + hb.allDir + 1.3, .4);
sfx('whoosh', HK + hb.trap + .1, .5); [0, 1, 2, 3].forEach(i => sfx('tick2', HK + hb.trap + .4 + i * .5, .35)); sfx('pop', HK + hb.trap + 2.4, .8);
sfx('whoosh', HK + hb.warn - .1, .5); sfx('pop', HK + hb.warn + .1, .6); sfx('swoosh', HK + hb.warn + 1.3, .4); sfx('stamp', HK + hb.warn2 + .05, .9);
sfx('riser', HK + hb.today - .5, .5); sfx('sparkle', HK + hb.today + .2, .7); sfx('pop', HK + hb.today + .1, .8);
function drawHook(t) {
  const u = t - HK;
  // frame-0 titles: fully visible at u = 0 (entrance happened "before" the video), only breathing motion
  tf(h1, { s: 1 + .015 * Math.sin(u * 2.4), y: bob(u, 0, 3) });
  tf(h2, { s: 1 + .012 * Math.sin(u * 2.4 + 1), y: bob(u, 1, 3) });
  const t3 = 1 - E.in(P(u, 3.2, .35));
  tf(h3, { s: (1 + .02 * Math.sin(u * 2)) * lerp(.7, 1, t3), y: bob(u, 2, 3), o: t3 });
  // officer: holding documents → hands free → walks aside → worried → surprised → cheers
  const walk = P(u, hb.allDir - .3, 1.0);
  const ox = lerp(540, 880, E.inOut(walk)), oy = lerp(1720, 1840, E.inOut(walk)), os = lerp(1, .78, E.inOut(walk));
  let pose = CHAR.blend('hold', 'idle', P(u, hb.w[3], .5)), expr = 'smile', tilt = 0, lookX = 0, lookY = 0;
  if (u < hb.w[0]) { expr = 'curious'; lookY = .6; tilt = Math.sin(u * 1.5) * 3; }
  if (u >= hb.allDir) { pose = CHAR.blend('idle', 'think', P(u, hb.allDir + .8, .5)); expr = 'curious'; lookX = -.8; tilt = -6; }
  if (u >= hb.trap) { pose = CHAR.blend('think', 'shrug', P(u, hb.trap, .4)); expr = 'worried'; tilt = -8 + Math.sin(u * 3) * 2; }
  if (u >= hb.warn) { pose = CHAR.blend('shrug', 'idle', P(u, hb.warn, .4)); expr = 'surprise'; lookX = -.6; tilt = 0; }
  if (u >= hb.today) { pose = CHAR.blend('idle', 'point', P(u, hb.today, .4)); expr = 'happy'; tilt = 4; lookX = -.4; }
  hOff.pose({ t: u, ...pose, expr, tilt, lookX, lookY, blink: blink(u), walk: walk > 0 && walk < 1 ? u * 9 : 0, walkAmt: walk > 0 && walk < 1 ? 1 : 0, turn: walk > 0 && walk < 1 ? .5 : 0 });
  hOff.set(ox, oy + (u >= hb.warn && u < hb.warn + .4 ? -30 * Math.sin(P(u, hb.warn, .4) * Math.PI) : 0), os, 1 - P(u, hb.warn - .3, .3) + P(u, hb.today - .4, .4) * (u >= hb.today - .4 ? 1 : 0));
  // big question mark above the documents
  const qo = 1 - P(u, 3.3, .3);
  tf(hQ, { s: 1 + .06 * Math.sin(u * 3), r: Math.sin(u * 2) * 8, y: bob(u, 0, 10, 2.4), o: qo });
  // documents
  hDocs.forEach((el, i) => {
    const f = fanPos(i), r = rowPos(i), d = fldPos(i);
    const k1 = E.back(P(u, hb.w[i], .55)), ka = P(u, hb.w[i], .55);
    const go = hb.allDir + .3 + i * .3, k2 = E.inOut(P(u, go, .6));
    let x = lerp(f.x, r.x, E.inOut(ka)), y = lerp(f.y, r.y, E.inOut(ka)) - Math.sin(ka * Math.PI) * 160, rr = lerp(f.r, r.r, k1), s = lerp(f.s, r.s, k1);
    if (u >= go) {
      x = lerp(r.x, d.x, k2); y = lerp(r.y, d.y, k2) - Math.sin(k2 * Math.PI) * 120; rr = lerp(r.r, d.r, k2); s = lerp(r.s, d.s, k2);
      if (i === 3) { const hes = P(u, go + .6, 2.5); rr += Math.sin(u * 7) * 8 * (1 - hes * .6); x += Math.sin(u * 3.3) * 12; y += Math.sin(u * 4.1) * 8; }
    }
    // magnifier pass highlights each title
    const passAt = hb.trap + .4 + i * .5, hi = u > passAt && u < hb.warn - .2 ? 1 : 0;
    el.querySelector('.tt').style.background = hi ? (i === 3 ? 'rgba(255,210,63,.75)' : 'rgba(255,210,63,.35)') : '';
    const out = P(u, hb.warn - .3, .35);
    tf(el, { x: x - 75, y: y - 95 + (u < hb.w[0] ? bob(u, i, 3, 2) : 0), r: rr, s: s * (1 + (i === 3 && u > hb.trap + 2.4 ? .06 * Math.sin(u * 5) : 0)) * (1 - .4 * out), o: 1 - out });
    if (i === 3) tf(hQ4, { x: x + 30, y: y - 160 + bob(u, 0, 6, 3), s: E.elastic(P(u, hb.trap + 2.3, .7)) * (1 - out), o: clamp((u - hb.trap - 2.3) * 5) * (1 - out) });
  });
  hFold.draw(u, hb.allDir, hb.warn - .3, { glowAt: [hb.allDir + 1.2], dy: 60 });
  const mp = P(u, hb.trap + .2, 2.2), mx = lerp(470, 800, E.inOut(mp)), my = 800 + Math.sin(mp * Math.PI * 3) * 20;
  tf(hMag, { x: mx - 40, y: my - 50, o: clamp((u - hb.trap) * 4) * (1 - P(u, hb.trap + 2.6, .3)), r: -10 + Math.sin(u * 4) * 6 });
  tf(hTrapTx, swing(u, hb.trap + 2.4, hb.warn - .3));
  // warning: one changed word = wrong answer (teaching card; not the official quiz)
  const wb = hb.today - .3;
  tf(hShufTitle, swing(u, hb.warn, wb)); tf(hShufCard, swing(u, hb.warn, wb));
  hShuf.draw(t, [{ at: HK + hb.warn, list: ['คำสั่ง', 'ระเบียบ', 'ข้อบังคับ'], tint: 'none' }, { at: HK + hb.warn2 - .3, list: ['คำสั่ง', 'ระเบียบ', 'ประกาศ'], tint: 'none', mark: 'bad' }], HK + hb.warn + .1, HK + wb);
  const wl = life(u, hb.warn2, wb, { from: .2, dy: 0, el: true, d: .7 });
  tf(hWarn, { ...wl, r: Math.sin(P(u, hb.warn2, .6) * Math.PI * 4) * 4 });
  tf(hToday, { ...life(u, hb.today, 1e9, { from: .3, dy: 50, el: true, d: .8 }), y: -240 * 0 });
}

// ======================================================================
// SCENE 2 — FOUR DOCUMENTS ON THE DESK (02_story.mp3)
// ======================================================================
const s2 = $('s2'), sb = B.story;
const OF = CHAR.office(s2);
const sOff = CHAR.officer(OF.actors);
const SD = [['คำสั่ง', 'มอบหมายงาน'], ['ระเบียบ', 'แนวปฏิบัติงานประจำ'], ['ข้อบังคับ', 'ออกตามอำนาจกฎหมาย'], ['ประกาศ', 'แจ้งข้อมูลให้ประชาชนทราบ']];
const sCap = ctr(s2, 368, `<div class="pillW" style="font-size:40px;padding:10px 30px"><span style="width:48px;height:48px;border-radius:50%;background:linear-gradient(135deg,#F7A8C4 50%,#95BFEF 50%);display:grid;place-items:center">${ICON.docs(32, '#fff')}</span>เจ้าหน้าที่ธุรการ</div>`);
const sCap2 = ctr(s2, 368, `<div class="pillB" style="font-size:44px;padding:10px 34px">บนโต๊ะมีเอกสาร 4 ฉบับ</div>`);
const sDeskDocs = [0, 1, 2, 3].map(i => add(s2, `<div class="abs c" style="left:0;top:0;width:130px;height:96px;border-radius:10px;background:#fff;box-shadow:0 6px 12px rgba(80,90,150,.22),inset 0 6px 0 ${i % 2 ? '#95BFEF' : '#F7A8C4'}"></div>`));
const sCards = SD.map(([w, sub], i) => {
  const el = CLS.docCard(w, { sub, w: 300, hgt: 250, fs: 52, subFs: 25 }); el.classList.add('c', 'crit'); s2.appendChild(el);
  el.insertAdjacentHTML('beforeend', `<div style="position:absolute;left:12px;top:22px;font-size:20px;font-weight:700;color:#fff;background:#8A97AD;padding:2px 12px;border-radius:12px">ฉบับที่ ${i + 1}</div>`);
  return el;
});
const cell = i => ({ x: i % 2 ? 698 : 382, y: i < 2 ? 545 : 825 });
const sideCell = i => ({ x: i % 2 ? 452 : 300, y: i < 2 ? 560 : 720 });
const sFold = CLS.folder(s2, { x: 548, y: 440, w: 310, hgt: 420, tone: 'blue', head1: 'หนังสือ', head2: 'สั่งการ?', headFs: 46, items: [] });
const sFoldP = CLS.folder(s2, { x: 222, y: 440, w: 310, hgt: 420, tone: 'pink', head1: 'หนังสือ', head2: 'ประชาสัมพันธ์?', headFs: 38, items: [] });
const sQ = ctr(s2, 368, `<div class="pillBlue" style="font-size:40px;padding:10px 30px">หนังสือสั่งการทั้งหมดจริงหรือ?</div>`);
const sFind = ctr(s2, 368, `<div class="pillB" style="font-size:44px;padding:10px 34px">${MAG(50)}มาหาคำตอบกัน!</div>`);
const sThought = STORY.thought(QM(70, '#2F6BFF'), { w: 150, dir: -1 }); sThought.classList.add('c'); s2.appendChild(sThought);
sfx('pop', ST + .3, .6); for (let i = 0; i < 8; i++) sfx('key', ST + .6 + i * .16, .4);
sfx('pop', ST + sb.desk + .05, .7); [0, 1, 2, 3].forEach(i => sfx('page', ST + sb.desk + .2 + i * .22, .55));
sb.d.forEach((a, i) => { sfx('page', ST + a + .05, .8); sfx('pop', ST + sb.dw[i] + .3, .55); });
sfx('whoosh', ST + sb.q, .5); sfx('pop', ST + sb.q + .5, .7); sfx('pop', ST + sb.q2 + .1, .8);
sfx('whoosh', ST + sb.find - .1, .5); sfx('pop', ST + sb.find + .1, .9); sfx('sparkle', ST + sb.find + .3, .6);
function drawStory(t) {
  const u = t - ST;
  const zoom = 1 + .04 * E.inOut(P(u, 0, 4.4)) - .04 * E.inOut(P(u, sb.d[0] - .4, .8));
  OF.draw(u, Math.sin(u * .3) * 10, 0, zoom);
  // officer behind the desk
  let pose = CHAR.POSE.type, expr = 'smile', lookX = 0, lookY = .6, tilt = 0, turn = 0;
  if (u < sb.desk) pose = { armL: [26 + Math.sin(u * 14) * 4, 80 + Math.sin(u * 13) * 8], armR: [26 + Math.cos(u * 15) * 4, 80 + Math.cos(u * 12) * 8] };
  else if (u < sb.d[0]) { pose = CHAR.blend('type', 'idle', P(u, sb.desk, .4)); expr = 'surprise'; lookX = .6; turn = .3; }
  else if (u < sb.q) {
    const i = sb.d.filter(a => u >= a).length - 1, c = cell(i);
    pose = CHAR.blend('idle', i % 2 ? 'point' : 'present', P(u, sb.d[i], .4)); expr = i === 3 ? 'curious' : 'smile';
    lookX = c.x > 540 ? .8 : -.8; lookY = -1; tilt = c.x > 540 ? 6 : -6; turn = c.x > 540 ? .4 : -.4;
  } else if (u < sb.find) { pose = CHAR.POSE.think; expr = 'curious'; lookX = .6; lookY = -.8; tilt = 8 + Math.sin(u * 2) * 3; }
  else { pose = CHAR.blend('think', 'cheer', P(u, sb.find, .4)); expr = 'happy'; tilt = Math.sin(u * 6) * 4; }
  sOff.pose({ t: u, ...pose, expr, lookX, lookY, tilt, turn, blink: blink(u, 1) });
  sOff.set(540, 1610, .95);
  tf(sCap, swing(u, .3, sb.desk)); tf(sCap2, swing(u, sb.desk, sb.d[0] - .2));
  // small documents slide onto the desk
  sDeskDocs.forEach((el, i) => {
    const k = E.out(P(u, sb.desk + .2 + i * .22, .5)), gone = u >= sb.d[i];
    tf(el, { x: lerp(1250, 470 + i * 6, k) - (gone ? 0 : 0), y: 1296 - i * 8 - (1 - k) * 80, r: lerp(30, -4 + i * 3, k), o: (u > sb.desk ? 1 : 0) * (gone ? 0 : 1) });
  });
  // big document cards: lift from desk → 2×2 grid → beside the folder → leave
  sCards.forEach((el, i) => {
    const c = cell(i), sc = sideCell(i);
    const k = P(u, sb.d[i], .7), ke = E.out(k);
    let x = lerp(535, c.x, ke), y = lerp(1300, c.y, ke) - Math.sin(k * Math.PI) * 100, s = lerp(.4, 1, E.back(k)), ry = (1 - E.out(P(u, sb.d[i] + .15, .6))) * 90;
    const k2 = E.inOut(P(u, sb.q + i * .12, .7));
    if (u >= sb.q) { x = lerp(c.x, sc.x, k2); y = lerp(c.y, sc.y, k2); s = lerp(1, .5, k2); }
    const out = P(u, sb.find - .2, .4);
    tf(el, { x: x - 150, y: y - 125 - 120 * E.in(out), s: s * (1 + (u > sb.dw[i] && u < sb.dw[i] + .6 ? .05 * Math.sin(P(u, sb.dw[i], .6) * Math.PI) : 0)), ry, o: (u >= sb.d[i] ? 1 : 0) * (1 - out) });
    el.querySelector('.sb').style.opacity = u > sb.dw[i] + .3 ? 1 : 0;
    el.querySelector('.sb').style.color = u > sb.dw[i] + .3 && u < sb.dw[i] + 1.6 ? '#EE7FAA' : '';
  });
  sFold.draw(u, sb.q + .2, 1e9, { glowAt: [sb.q2 + .4], dy: 60 });
  sFoldP.draw(u, sb.find, 1e9, { glowAt: [sb.find + .2], dy: 60 });
  tf(sQ, swing(u, sb.q2, sb.find - .1));
  tf(sFind, life(u, sb.find, 1e9, { from: .3, dy: 40, el: true, d: .8 }));
  tf(sThought, { ...life(u, sb.q + .3, sb.find - .1, { from: .3, dy: 20, el: true, d: .8 }), x: 640, y: 905 + bob(u, 0, 6, 2) });
}

// ======================================================================
// SCENE 3 — OFFICIAL DOCUMENT CLASSIFICATION (03_knowledge.mp3)
// ======================================================================
const s3 = $('s3'), kb = B.know;
const kPh = add(s3, `<div class="abs c" style="left:548px;top:700px;width:296px;height:560px;border-radius:30px;border:6px dashed rgba(238,127,170,.6);background:rgba(255,255,255,.35);display:grid;place-items:center">${QM(120)}</div>`);
const kBlue = CLS.folder(s3, { x: 236, y: 700, w: 296, hgt: 560, tone: 'blue', head1: 'หนังสือ', head2: 'สั่งการ', headFs: 48, items: CLS.DIRECTIVE, itemFs: 38 });
const kPink = CLS.folder(s3, { x: 548, y: 700, w: 296, hgt: 560, tone: 'pink', head1: 'หนังสือ', head2: 'ประชาสัมพันธ์', headFs: 40, items: CLS.PUBLIC, itemFs: 38 });
[...kBlue.items, ...kPink.items].forEach(it => it.el.classList.add('crit'));
const kH1 = ctr(s3, 380, `<div class="pillBlue" style="font-size:44px;padding:12px 34px">หนังสือสั่งการ มี 3 ชนิด</div>`);
const kH2 = ctr(s3, 380, `<div class="pillPink" style="font-size:40px;padding:12px 30px">หนังสือประชาสัมพันธ์ มี 3 ชนิด</div>`);
const kG1 = ctr(s3, 372, `<div class="stk" style="font-size:54px"><span style="color:#2F6BFF">คำสั่ง ระเบียบ ข้อบังคับ</span><br>อยู่กลุ่มเดียวกัน</div>`);
const kG2 = ctr(s3, 372, `<div class="stk" style="font-size:54px"><span style="color:#EE7FAA">ประกาศ แถลงการณ์ ข่าว</span><br>อยู่อีกกลุ่มหนึ่ง!</div>`);
const kVS = add(s3, `<div class="abs c" style="left:500px;top:606px;width:80px;height:80px;border-radius:50%;display:grid;place-items:center;font-weight:800;font-size:34px;color:#fff;background:linear-gradient(135deg,#2F6BFF 50%,#EE7FAA 50%);box-shadow:0 0 0 6px #fff,0 10px 20px rgba(80,90,150,.3)">VS</div>`);
const kOff = CHAR.officer(s3);
const KC = { x: 540, y: 560 };
sfx('whoosh', KN + kb.dir, .5); sfx('pop', KN + kb.dir + .2, .8);
kb.n.forEach((a, i) => { sfx('pop', KN + a + .05, .9); sfx('whoosh', KN + kb.w[i] + .45, .35); sfx('page', KN + kb.w[i] + 1.0, .6); });
sfx('whoosh', KN + kb.pub, .5); sfx('pop', KN + kb.pub + .2, .8);
kb.pn.forEach((a, i) => { sfx('pop', KN + a + .05, .9); sfx('whoosh', KN + kb.pw[i] + .45, .35); sfx('page', KN + kb.pw[i] + 1.0, .6); });
sfx('ding', KN + kb.blue + .05, .5); kb.blueW.forEach(a => sfx('pop', KN + a, .5)); sfx('ding', KN + kb.pink + .05, .5); kb.pinkW.forEach(a => sfx('pop', KN + a, .5)); sfx('sparkle', KN + kb.pinkEnd + .1, .7);
function drawKnow(t) {
  const u = t - KN;
  tf(kPh, { ...life(u, kb.dir + .3, kb.pub, { from: .8, dy: 30 }), r: Math.sin(u * 2) * 1 });
  kBlue.draw(u, kb.dir, 1e9, { glowAt: [kb.blue, kb.pinkEnd + .3], dy: 60 });
  kPink.draw(u, kb.pub, 1e9, { glowAt: [kb.pink, kb.pinkEnd + .3], dy: 60 });
  const hiB = i => (u >= kb.blueW[i] && u < kb.blueEnd + 1.2 ? 1 : 0), hiP = i => (u >= kb.pinkW[i] && u < kb.pinkEnd + 1.2 ? 1 : 0);
  [0, 1, 2].forEach(i => {
    kBlue.drawItem(i, u, { at: kb.n[i], land: kb.w[i] + .45, from: KC, fromS: 1.7, hi: hiB(i) });
    kPink.drawItem(i, u, { at: kb.pn[i], land: kb.pw[i] + .45, from: KC, fromS: 1.7, hi: hiP(i) });
  });
  tf(kH1, swing(u, kb.dir + .1, kb.pub - .1)); tf(kH2, swing(u, kb.pub + .1, kb.blue - .1));
  tf(kG1, swing(u, kb.blue, kb.pink - .1)); tf(kG2, swing(u, kb.pink, 1e9));
  tf(kVS, { ...life(u, kb.pinkEnd, 1e9, { from: .2, dy: 0, el: true, d: .8 }), r: Math.sin(u * 2) * 6 });
  // officer below the folders points at whichever folder is being taught
  const pinkSide = (u >= kb.pub && u < kb.blue) || u >= kb.pink;
  const pose = u < kb.pinkEnd ? CHAR.POSE[pinkSide ? 'point' : 'pointL'] : CHAR.POSE.cheer;
  kOff.pose({ t: u, ...pose, expr: u < kb.pinkEnd ? 'smile' : 'happy', lookX: pinkSide ? .7 : -.7, lookY: -.8, tilt: pinkSide ? 5 : -5, blink: blink(u, 2) });
  kOff.set(540, 1960 + bob(u, 0, 4, 3), .62);
}

// ======================================================================
// SCENE 4 — THE ANNOUNCEMENT TRAP (04_explanation.mp3)
// ======================================================================
const s4 = $('s4'), xb = B.expl;
const xHd = ctr(s4, 368, `<div class="pillB" style="font-size:46px;padding:12px 36px">${WARN(50)}จุดหลอกสำคัญ!</div>`);
const xHd2 = ctr(s4, 368, `<div class="pillPink" style="font-size:46px;padding:12px 36px">${WARN(50)}ระวังคำว่า ประกาศ!</div>`);
const xDoc = CLS.docCard('ประกาศ', { w: 380, hgt: 470, fs: 74, sub: 'เรื่อง แนวทางปฏิบัติ (ตัวอย่าง)', subFs: 26 }); xDoc.classList.add('c', 'crit'); s4.appendChild(xDoc);
const xQ = add(s4, `<div class="abs c" style="left:770px;top:450px">${QM(110)}</div>`);
const xC1 = ctr(s4, 990, `<div class="pillW" style="font-size:34px;padding:8px 26px"><span style="width:40px;height:40px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${ICON.check('#fff', 28)}</span>เป็นเอกสารทางราชการ</div>`);
const xC2 = ctr(s4, 1070, `<div class="pillW" style="font-size:34px;padding:8px 26px"><span style="width:40px;height:40px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${ICON.check('#fff', 28)}</span>อาจใช้ชี้แจงแนวทางปฏิบัติ</div>`);
const xReg = ctr(s4, 470, `<div class="pillW" style="font-size:38px;padding:10px 30px">${ICON.book(44, '#2F6BFF')}ตามระเบียบงานสารบรรณ</div>`);
const xMap = ctr(s4, 470, `<div class="pillPink" style="font-size:38px;padding:10px 30px">ประกาศ ${ARROW('#fff', 40)} หนังสือประชาสัมพันธ์</div>`);
const xNot = ctr(s4, 470, `<div class="pillRed" style="font-size:42px;padding:10px 32px">${ICON.cross('#fff', 40)}ไม่ใช่หนังสือสั่งการ!</div>`);
const xSame = ctr(s4, 470, `<div class="pillPink" style="font-size:38px;padding:10px 30px">เช่นเดียวกับ แถลงการณ์ และข่าว</div>`);
const xBlue = CLS.folder(s4, { x: 236, y: 560, w: 296, hgt: 560, tone: 'blue', head1: 'หนังสือ', head2: 'สั่งการ', headFs: 46, items: CLS.DIRECTIVE, itemFs: 36 });
const xPink = CLS.folder(s4, { x: 548, y: 560, w: 296, hgt: 560, tone: 'pink', head1: 'หนังสือ', head2: 'ประชาสัมพันธ์', headFs: 40, items: CLS.PUBLIC, itemFs: 36 });
[...xPink.items].forEach(it => it.el.classList.add('crit'));
const xGhost = add(s4, `<div class="abs c" style="left:0;top:0"><div class="item pink" style="position:relative;height:80px;font-size:36px;padding:0 22px;opacity:.95">ประกาศ</div><div style="position:absolute;right:-24px;top:-24px;width:52px;height:52px;border-radius:50%;background:#EF4444;display:grid;place-items:center;box-shadow:0 0 0 4px #fff">${ICON.cross('#fff', 32)}</div></div>`);
const xCaution = add(s4, `<div class="abs c crit" style="left:240px;top:1150px;width:600px;border-radius:36px;padding:18px 16px;background:#fff;text-align:center;box-shadow:0 18px 36px rgba(110,90,150,.2),0 0 0 6px #fff,0 0 0 12px rgba(255,210,63,.7)">
  <div style="font-weight:800;font-size:48px;line-height:1.25;color:#31445D">ดูหมวดหนังสือ</div><div style="font-weight:700;font-size:34px;line-height:1.35;color:#5C6E88">ไม่ใช่แค่ชื่อที่ฟังดูเป็นทางการ!</div></div>`);
const xOff = CHAR.officer(s4);
const DOCC = { x: 540, y: 720 };
sfx('pop', EX + .1, .8); sfx('riser', EX + .3, .4); sfx('page', EX + .4, .9); sfx('ding', EX + xb.word + .05, .6);
sfx('pop', EX + xb.official + .6, .7); sfx('pop', EX + xb.guide + .6, .7);
sfx('whoosh', EX + xb.byReg, .5); sfx('pop', EX + xb.byReg + .2, .7);
sfx('whoosh', EX + xb.pubCat + .1, .5); sfx('success', EX + xb.pubCat + .75, .6);
sfx('buzz', EX + xb.notDir + .15, .6); sfx('pop', EX + xb.notDir + .1, .7);
sfx('pop', EX + xb.st + .05, .7); sfx('pop', EX + xb.news + .05, .7); sfx('page', EX + xb.st + .55, .5); sfx('page', EX + xb.news + .55, .5);
sfx('whoosh', EX + xb.caution - .1, .5); sfx('pop', EX + xb.caution + .15, .9); sfx('sparkle', EX + xb.caution2 + .3, .5);
function drawExpl(t) {
  const u = t - EX;
  tf(xHd, swing(u, .05, xb.word - .1)); tf(xHd2, swing(u, xb.word, xb.byReg - .1));
  // the announcement document (official look ≠ directive category)
  const dIn = life(u, .1, 1e9, { from: .4, dy: 80, d: .7 });
  const fly = E.inOut(P(u, xb.pubCat + .1, .5));
  const pulse = u > xb.word && u < xb.word + .8 ? .06 * Math.sin(P(u, xb.word, .8) * Math.PI) : 0;
  tf(xDoc, { x: lerp(DOCC.x - 190, xPink.items[0].cx - 190, fly), y: lerp(DOCC.y - 235, xPink.items[0].cy - 235, fly) + bob(u, 0, 5, 1.8) * (1 - fly), s: (dIn.s + pulse) * lerp(1, .25, fly) * lerp(1, .78, E.inOut(P(u, xb.byReg, .6))), o: dIn.o * (1 - P(u, xb.pubCat + .45, .15)), r: Math.sin(u * 1.4) * 2 * (1 - fly) });
  xDoc.querySelector('.tt').style.background = u > xb.word && u < xb.byReg ? 'rgba(255,210,63,.55)' : '';
  tf(xQ, { ...life(u, xb.word, xb.byReg, { from: .2, dy: 0, el: true, d: .8 }), r: Math.sin(u * 3) * 10 });
  tf(xC1, swing(u, xb.official + .5, xb.byReg - .1)); tf(xC2, swing(u, xb.guide + .5, xb.byReg - .1));
  // regulation classification
  tf(xReg, swing(u, xb.byReg + .1, xb.pubCat + .1)); tf(xMap, swing(u, xb.pubCat + .2, xb.notDir - .1));
  tf(xNot, { ...swing(u, xb.notDir, xb.same - .1), x: Math.sin(P(u, xb.notDir, .5) * Math.PI * 4) * 8 });
  tf(xSame, swing(u, xb.same, xb.caution - .1));
  const fade = P(u, xb.caution - .1, .5) * .0;
  xBlue.draw(u, xb.byReg + .3, 1e9, { dy: 60, nudge: u > xb.notDir && u < xb.notDir + .7 ? Math.sin(P(u, xb.notDir, .7) * Math.PI * 5) * 10 : 0, glowAt: [] });
  xPink.draw(u, xb.byReg + .45, 1e9, { dy: 60, glowAt: [xb.pubCat + .6, xb.news + .7] });
  [0, 1, 2].forEach(i => xBlue.drawItem(i, u, { at: xb.byReg + .7 + i * .12, land: xb.byReg + .7 + i * .12, dim: 1 }));
  xPink.drawItem(0, u, { at: xb.pubCat + .45, land: xb.pubCat + .45, from: { x: xPink.items[0].cx, y: xPink.items[0].cy }, fromS: 1, hi: u > xb.pubCat + .5 && u < xb.notDir ? 1 : 0 });
  xPink.drawItem(1, u, { at: xb.st, land: xb.st + .35, from: { x: 540, y: 1000 }, fromS: 1.4, hi: u > xb.st + .9 && u < xb.caution ? 1 : 0 });
  xPink.drawItem(2, u, { at: xb.news, land: xb.news + .35, from: { x: 540, y: 1000 }, fromS: 1.4, hi: u > xb.news + .9 && u < xb.caution ? 1 : 0 });
  // "not directive": announcement chip tries the blue folder and bounces off
  const g = P(u, xb.notDir, 1.6), gx = lerp(377, 377, g), gy = 640 - Math.sin(g * Math.PI) * 40;
  tf(xGhost, { x: gx - 90 + Math.sin(g * 18) * 10 * (1 - g), y: gy, o: clamp((u - xb.notDir) * 5) * (1 - P(u, xb.same - .2, .3)), r: Math.sin(g * 12) * 6 });
  const cl = life(u, xb.caution, 1e9, { from: .4, dy: 60, el: true, d: .9 });
  tf(xCaution, { ...cl, s: cl.s * (1 + .03 * Math.sin(P(u, xb.caution2, .8) * Math.PI)) });
  // officer: explains, then wags a finger at the caution
  let pose = CHAR.POSE.present, expr = 'smile';
  if (u >= xb.notDir && u < xb.same) { pose = CHAR.POSE.shrug; expr = 'worried'; }
  if (u >= xb.caution) { pose = { armL: [8, -6], armR: [118, 30 + Math.sin(u * 10) * 14] }; expr = 'sly'; }
  xOff.pose({ t: u, ...pose, expr, lookX: -.7, lookY: -.6, tilt: -4, blink: blink(u, 3) });
  xOff.set(930, 1980, .6);
}

// ======================================================================
// SCENE 5 — OFFICIAL QUIZ, 5 s COUNTDOWN, ANSWER (05_quiz.mp3 · silence · 06_answer.mp3)
// ======================================================================
const s5 = $('s5'), qb = B.quiz, ab = B.ans;
const qH1 = ctr(s5, 368, `<div class="pillB" style="font-size:42px;padding:10px 34px">เตรียมสอบนายสิบตำรวจ</div>`);
const qH2 = ctr(s5, 458, `<div class="pillW" style="font-size:30px;padding:6px 24px">${ICON.book(34, '#2F6BFF')}วิชางานสารบรรณ</div>`);
const qHA = ctr(s5, 372, `<div class="pillGreen" style="font-size:60px;padding:12px 46px">${ICON.check('#fff', 58)}เฉลยข้อ ง.</div>`);
const qHF = ctr(s5, 368, `<div class="pillB" style="font-size:44px;padding:10px 34px">สรุปจำง่าย ๆ</div>`);
const qCard = add(s5, `<div class="qcard2 c crit" style="top:512px"><div class="q">ข้อใดเป็นหนังสือสั่งการ<br>ครบทั้ง 3 ชนิด<br>ตามระเบียบงานสารบรรณ?</div></div>`);
const qOpts = QUIZ.build(s5, { top: 772, gap: 106 });
qOpts.forEach(o => o.el.classList.add('crit'));
const qBub = ctr(s5, 1220, `<div class="pillW" style="font-size:40px;padding:12px 34px">${ICON.timer(48, '#2F6BFF')}ให้เวลาคิด 5 วินาที!</div>`);
const qCdEl = add(s5, `<div class="abs c crit" style="left:435px;top:1200px"></div>`);
const qCd = NSP.buildCountdown(qCdEl, 210);
// answer panels (same box as the question card)
const panel = (inner, ring) => add(s5, `<div class="abs c crit" style="left:238px;top:512px;width:604px;height:230px;border-radius:38px;background:#fff;box-shadow:0 18px 40px rgba(110,90,150,.18),0 0 0 6px #fff,0 0 0 12px ${ring}">${inner}</div>`);
const qE = panel(`<div style="position:absolute;left:0;right:0;top:20px;display:flex;justify-content:center"><div class="pillBlue" style="font-size:34px;padding:6px 24px">จำแนกให้ถูกทั้ง 3 คำ</div></div>
  <div style="position:absolute;left:16px;right:16px;top:106px;display:flex;justify-content:space-between">${CLS.DIRECTIVE.map(w => `<div class="qeb" style="display:flex;align-items:center;gap:10px;height:84px;padding:0 10px;border-radius:22px;background:#EEF5FF;font-weight:800;font-size:31px;color:#1F4FC2"><span class="qbx" style="width:44px;height:44px;border-radius:12px;border:4px solid #95BFEF;background:#fff;display:grid;place-items:center"></span>${w}</div>`).join('')}</div>`, 'rgba(149,191,239,.6)');
const qEbx = [...qE.querySelectorAll('.qbx')];
const qSh = panel(`<div style="position:absolute;left:0;right:0;top:16px;display:flex;justify-content:center"><div class="pillW" style="font-size:32px;padding:6px 22px;box-shadow:0 0 0 4px #FFD6E6">ข้อสอบสับขาหลอก</div></div>
  <div class="qshl" style="position:absolute;left:0;right:0;top:76px;text-align:center;font-weight:700;font-size:30px;color:#5C6E88"></div>`, 'rgba(247,168,196,.65)');
const qShl = qSh.querySelector('.qshl');
const qShuf = SHUFFLE.build(qSh, { x: 16, y: 128, w: 572, fs: 32 });
const qPub = panel(`<div style="position:absolute;left:0;right:0;top:18px;display:flex;justify-content:center"><div class="pillPink" style="font-size:34px;padding:6px 24px">ทั้ง 3 คำ = หนังสือประชาสัมพันธ์</div></div>
  <div style="position:absolute;left:16px;right:16px;top:108px;display:flex;justify-content:space-between">${CLS.PUBLIC.map(w => `<div class="qpw" style="display:grid;place-items:center;width:180px;height:84px;border-radius:22px;background:linear-gradient(180deg,#FFE3EF,#FFC9DC);font-weight:800;font-size:34px;color:#B83A6C">${w}</div>`).join('')}</div>`, 'rgba(247,168,196,.65)');
const qPw = [...qPub.querySelectorAll('.qpw')];
const qMB = CLS.folder(s5, { x: 238, y: 1196, w: 294, hgt: 216, tone: 'blue', head1: 'หนังสือ', head2: 'สั่งการ', headFs: 40, items: [] });
const qMP = CLS.folder(s5, { x: 548, y: 1196, w: 294, hgt: 216, tone: 'pink', head1: 'หนังสือ', head2: 'ประชาสัมพันธ์', headFs: 34, items: [] });
// flying term clones (answer explanation)
const flyers = [];
QUIZ.OPTIONS[3][1].forEach((w, j) => flyers.push({ el: add(s5, `<div class="abs c" style="left:0;top:0">${CLS.chip(w, { fs: 30 }).outerHTML}</div>`), opt: 3, j, at: ab.cat + .1 + j * .25, to: qMB }));
[0, 1, 2].forEach(i => flyers.push({ el: add(s5, `<div class="abs c" style="left:0;top:0">${CLS.chip(QUIZ.OPTIONS[i][1][QUIZ.TRAP[i]], { fs: 30 }).outerHTML}</div>`), opt: i, j: QUIZ.TRAP[i], at: ab.kw[i] + .8, to: qMP }));
// final comparison (same classifier as scene 3)
const qFB = CLS.folder(s5, { x: 236, y: 470, w: 296, hgt: 600, tone: 'blue', head1: 'หนังสือ', head2: 'สั่งการ', headFs: 50, items: CLS.DIRECTIVE, itemFs: 38, itemH: 96, gap: 22, top: 230 });
const qFP = CLS.folder(s5, { x: 548, y: 470, w: 296, hgt: 600, tone: 'pink', head1: 'หนังสือ', head2: 'ประชาสัมพันธ์', headFs: 41, items: CLS.PUBLIC, itemFs: 38, itemH: 96, gap: 22, top: 230 });
[...qFB.items, ...qFP.items].forEach(it => it.el.classList.add('crit'));
const qOff = CHAR.officer(s5);
const qConf = NSP.buildConfetti(add(s5, `<div class="abs" style="inset:0"></div>`), 70, 540, 1110);
const optAt = qb.opt, termAt = qb.terms;
// SFX
sfx('whoosh', QZ, .5); sfx('pop', QZ + .2, .8); sfx('pop', QZ + qb.q, .8);
optAt.forEach(a => { sfx('whoosh', QZ + a - .05, .3); sfx('pop', QZ + a + .05, .75); });
sfx('pop', QZ + qb.think + .05, .8);
for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', CD + i, 1);
sfx('ding', AN + .08, .9); sfx('success', AN + .12, 1); sfx('sparkle', AN + .4, .7);
sfx('whoosh', AN + 2.3, .4); ab.terms.forEach(a => sfx('pop', AN + a + .1, .7)); sfx('pop', AN + ab.cat, .6); [0, 1, 2].forEach(j => sfx('whoosh', AN + ab.cat + .1 + j * .25, .3));
ab.k.forEach((a, i) => { sfx('whoosh', AN + a - .1, .35); sfx('swoosh', AN + a + .4, .35); sfx('pop', AN + ab.kw[i] + .05, .8); sfx('stamp', AN + ab.kw[i] + .45, .55); sfx('whoosh', AN + ab.kw[i] + .8, .3); });
sfx('pop', AN + ab.allPub, .7); sfx('ding', AN + ab.allPub2 + .1, .5);
sfx('whoosh', AN + ab.blue - .2, .6); ab.blueW.forEach(a => sfx('pop', AN + a + .05, .7)); sfx('pop', AN + ab.pinkHead, .7); ab.pinkW.forEach(a => sfx('pop', AN + a + .05, .7)); sfx('sparkle', AN + ab.pinkW[2] + .3, .7);
function drawQuiz(t) {
  const u = t - QZ, uc = t - CD, ua = t - AN;
  const rev = ua >= 0, fin = P(ua, ab.blue - .2, .5);
  // header
  const hOut = rev ? P(ua, 0, .2) : 0;
  tf(qH1, { ...life(u, .05, 1e9, { from: .5, dy: -30 }), o: life(u, .05).o * (1 - hOut) });
  tf(qH2, { ...life(u, .25, 1e9, { from: .5, dy: -30 }), o: life(u, .25).o * (1 - hOut) });
  tf(qHA, { ...life(ua, .05, ab.blue - .2, { from: .3, dy: 0, el: true, d: .8 }), y: bob(ua, 0, 3) });
  tf(qHF, swing(ua, ab.blue, 1e9));
  // question card → infographic E → shuffle → public-information panel
  const qc = life(u, qb.q - .1, 1e9, { from: .6, dy: 50 });
  const sw = (a, b) => life(ua, a, b, { from: .85, dy: 30, d: .45, out: .25 });
  tf(qCard, { ...qc, o: qc.o * (rev ? 1 - P(ua, 2.2, .3) : 1), y: qc.y + bob(u, 1, 3) });
  tf(qE, sw(2.4, ab.k[0] - .3));
  qEbx.forEach((b, j) => { const on = ua >= ab.terms[j] + .1; b.innerHTML = on ? ICON.check('#fff', 32) : ''; b.style.background = on ? '#22C55E' : '#fff'; b.style.borderColor = on ? '#22C55E' : '#95BFEF'; b.style.transform = `scale(${on ? 1 + .3 * Math.sin(P(ua, ab.terms[j] + .1, .35) * Math.PI) : 1})`; });
  tf(qSh, sw(ab.k[0] - .2, ab.allPub - .2));
  const ki = ab.k.filter(a => ua >= a - .2).length - 1;
  qShl.innerHTML = ki < 0 ? '' : `ข้อ ${'กขค'[ki]}. หลอกด้วยคำว่า <b style="color:#C9467A">${QUIZ.OPTIONS[ki][1][QUIZ.TRAP[ki]]}</b>`;
  const BASE = ['คำสั่ง', 'ระเบียบ', 'ข้อบังคับ'], steps = [];
  ab.k.forEach((a, i) => { steps.push({ at: AN + a - .2, list: BASE, tint: 'all' }); steps.push({ at: AN + ab.kw[i] - .1, list: QUIZ.OPTIONS[i][1], tint: 'all', mark: 'bad' }); });
  qShuf.draw(t, steps, AN + ab.k[0] - .2, AN + ab.allPub - .2);
  tf(qPub, sw(ab.allPub, ab.blue - .2));
  qPw.forEach((w, j) => { const a = ab.allPub + .2 + j * .25; w.style.transform = `scale(${E.back(P(ua, a, .5))})`; w.style.opacity = clamp((ua - a) * 5); });
  // options (neutral until the answer narration starts)
  QUIZ.draw(qOpts, u, ua, { optAt, termAt, trapAt: ab.kw.map(a => a - .05), litAt: ab.k, fade: fin });
  // thinking cue + countdown (exactly CD .. CD+5, no narration)
  tf(qBub, { ...life(u, qb.think, D('quiz') - .62, { from: .4, dy: 30, el: true, d: .7, out: .25 }), r: Math.sin(u * 3) * 2 });
  NSP.drawCountdown(qCd, uc, T.cd[1]);
  // ring pops in during the last 0.35 s of the narration tail so "5" is fully visible on the countdown's first frame
  if (uc < 0) { qCd.num.textContent = '5'; qCd.num.style.transform = ''; qCd.ring.setAttribute('stroke-dashoffset', 0); qCd.dot.setAttribute('cx', qCd.c); qCd.dot.setAttribute('cy', qCd.c - qCd.r); }
  if (uc < T.cd[1]) tf(qCd.el, { ...life(uc, -.3, 1e9, { from: .3, dy: 40, d: .28 }), s: life(uc, -.3, 1e9, { from: .3, dy: 40, d: .28 }).s * (uc >= 0 ? 1 + .05 * Math.max(0, 1 - (uc - Math.floor(uc)) / .25) : 1) });
  // mini folders + flying terms
  const mOut = ab.blue - .3;
  qMB.draw(ua, ab.cat - .2, mOut, { glowAt: [ab.cat + 1.0], dy: 50 });
  qMP.draw(ua, ab.k[0] - .3, mOut, { glowAt: [ab.kw[0] + 1.2, ab.kw[1] + 1.2, ab.kw[2] + 1.2], glowOn: ua > ab.allPub && ua < mOut ? .8 : 0, dy: 50 });
  flyers.forEach(f => {
    const o = qOpts[f.opt], st = QUIZ.wordCentre(o, f.j), k = P(ua, f.at, .75);
    const tx = f.to.x + f.to.w / 2, ty = f.to.y + 150;
    const x = lerp(st.x, tx, E.inOut(k)), y = lerp(st.y, ty, E.inOut(k)) - Math.sin(k * Math.PI) * 140;
    const el = f.el; el.style.left = '0px';
    tf(el, { x: x - el.firstChild.offsetWidth / 2, y: y - 30, s: lerp(1.1, .6, k), o: k > 0 && k < 1 ? 1 : 0, r: k * 20 });
  });
  // final comparison
  qFB.draw(ua, ab.blue, 1e9, { glowAt: [ab.blue + .3, ab.pinkW[2] + .6], dy: 60 });
  qFP.draw(ua, ab.pink, 1e9, { glowAt: [ab.pinkHead, ab.pinkW[2] + .6], dy: 60 });
  [0, 1, 2].forEach(i => {
    qFB.drawItem(i, ua, { at: ab.blueW[i] - .05, land: ab.blueW[i] + .25, fromS: 1.3, hi: ua > ab.blueW[i] + .3 && ua < ab.blueW[i] + 1.2 ? 1 : 0 });
    qFP.drawItem(i, ua, { at: ab.pinkW[i] - .2, land: ab.pinkW[i] - .05, fromS: 1.3, hi: ua > ab.pinkW[i] + .3 && ua < ab.pinkW[i] + 1.2 ? 1 : 0 });
  });
  NSP.drawConfetti(qConf, t, AN + .12, 2.6);
  // officer: thinking during the countdown, celebrating at the reveal, presenting the recap
  let pose = CHAR.POSE.think, expr = 'curious', tilt = 8 + Math.sin(u * 2) * 3, ox = 150, oy = 2000, os = .6;
  if (u < qb.after) { pose = CHAR.POSE.idle; expr = 'smile'; tilt = 0; }
  if (rev) { pose = ua < ab.cat ? CHAR.POSE.cheer : CHAR.POSE.present; expr = 'happy'; tilt = Math.sin(ua * 5) * 4; }
  const jump = rev && ua < 2 ? -Math.abs(Math.sin(ua * 6)) * 40 * (1 - ua / 2) : 0;
  qOff.pose({ t: u, ...pose, expr, tilt, lookX: .7, lookY: -.8, blink: blink(u, 4), crouch: rev && ua < 2 ? Math.max(0, Math.sin(ua * 6)) * .15 : 0 });
  qOff.set(ox, oy + jump + bob(u, 0, 3, 2), os);
}

// ======================================================================
// SCENE 6 — NAISIBPRO PROMO (07_promotion.mp3)
// ======================================================================
const s6 = $('s6'), pb = B.promo;
const BASE = NSP.BASE;
const pAsk = ctr(s6, 360, `<div class="stk" style="font-size:62px">คุณตอบถูก<span style="color:#22C55E">ข้อ ง.</span> ไหม?</div>`);
const pChat = add(s6, `<div class="abs c crit" style="left:236px;top:480px;width:608px;height:470px;border-radius:40px;background:#fff;box-shadow:0 20px 44px rgba(110,90,150,.2),0 0 0 6px #fff,0 0 0 12px rgba(149,191,239,.45)">
  <div style="height:84px;border-radius:40px 40px 0 0;background:linear-gradient(90deg,#EE7FAA,#F7A8C4 49%,#95BFEF 51%,#5E8FF0);display:flex;align-items:center;gap:12px;padding:0 30px;color:#fff;font-weight:800;font-size:34px">
    <svg width="42" height="42" viewBox="0 0 24 24"><path d="M4 5h16v11H9l-5 4z" fill="#fff"/></svg>ความคิดเห็น</div></div>`);
const CM = [['ข้อ ง. ครับ!', '#F7A8C4'], ['ตอบ ง. ถูกแล้ว', '#95BFEF'], ['เกือบพลาดข้อ ก.', '#F7A8C4']];
const pCm = CM.map(([tx, c], i) => add(pChat, `<div class="abs c" style="left:28px;top:${116 + i * 128}px;display:flex;align-items:center;gap:16px"><div style="width:76px;height:76px;border-radius:50%;background:${c};box-shadow:0 0 0 5px #fff,0 4px 10px rgba(0,0,0,.1);display:grid;place-items:center">${ICON.heart('#fff')}</div><div style="background:${i % 2 ? '#EEF5FF' : '#FFF0F6'};border-radius:26px;padding:14px 26px;font-weight:700;font-size:36px">${tx}</div></div>`));
const pHearts = [...Array(8)].map((_, i) => add(s6, `<div class="abs" style="left:0;top:0">${ICON.heart(i % 2 ? '#95BFEF' : '#EE7FAA')}</div>`));
const pRem = ctr(s6, 380, `<div class="stk" style="font-size:64px">อ่านทุกคำ<br><span style="color:#EE7FAA">ก่อนเลือกคำตอบ!</span></div>`);
const pRowCard = add(s6, `<div class="abs c" style="left:236px;top:700px;width:608px;height:150px;border-radius:40px;background:#fff;box-shadow:0 18px 36px rgba(110,90,150,.18),0 0 0 6px #fff,0 0 0 12px rgba(247,168,196,.5)"></div>`);
const pRow = SHUFFLE.build(s6, { x: 250, y: 738, w: 560, fs: 32 });
const pMag = add(s6, `<div class="abs" style="left:0;top:0">${MAG(120)}</div>`);
const pEyes = add(s6, `<div class="abs c" style="left:220px;top:900px;width:640px;display:flex;justify-content:center"><div class="pillW" style="font-size:34px;padding:8px 26px">${ICON.check('#22C55E', 40)}ตรวจครบทั้ง 3 คำ</div></div>`);
const pLogo = add(s6, `<div class="abs c" style="left:330px;top:400px;width:420px"><img src="${BASE}brand/logo.png" style="width:420px;display:block;filter:drop-shadow(0 18px 24px rgba(110,90,150,.3))"></div>`);
const pWord = ctr(s6, 860, `<div class="wordmark" style="font-size:110px">NaiSibPro</div>`);
const pThai = ctr(s6, 1010, `<div class="pillB" style="font-size:46px;padding:10px 40px">นายสิบโปร</div>`);
const pNum = ctr(s6, 640, `<div class="stk pnum" style="font-size:150px;line-height:1;color:#EE7FAA">10,000+</div>`);
const pNumTx = ctr(s6, 820, `<div class="pillBlue" style="font-size:44px;padding:10px 34px">${ICON.docs(46, '#fff')}ข้อสอบมากกว่าหมื่นข้อ</div>`);
const pWeek = ctr(s6, 920, `<div class="pillPink" style="font-size:44px;padding:10px 34px">${ICON.cal(46, '#fff')}อัปเดตทุกสัปดาห์</div>`);
const CTA = [['LIKE', '#EE7FAA', `<svg width="80" height="80" viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="#fff"/></svg>`],
  ['SHARE', '#2F6BFF', `<svg width="76" height="76" viewBox="0 0 24 24"><path d="M14 4l7 7-7 7v-4c-5 0-8 1.5-11 5 1-5 4-9.5 11-10z" fill="#fff"/></svg>`],
  ['FOLLOW', '#EE7FAA', `<svg width="80" height="80" viewBox="0 0 24 24"><circle cx="9" cy="8" r="4" fill="#fff"/><path d="M1.5 20c0-4 3.4-6.5 7.5-6.5s7.5 2.5 7.5 6.5z" fill="#fff"/><path d="M19 7v8M15 11h8" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`]];
const pCta = CTA.map(([l, c, ic], i) => add(s6, `<div class="abs c" style="left:${244 + i * 200}px;top:1080px;width:190px;display:flex;flex-direction:column;align-items:center;gap:10px">
  <div class="pci" style="width:150px;height:150px;border-radius:50%;background:${c === '#2F6BFF' ? 'linear-gradient(160deg,#95BFEF,#2F6BFF)' : 'linear-gradient(160deg,#FFC9DC,#EE7FAA)'};display:grid;place-items:center;box-shadow:0 14px 26px ${c}66,0 0 0 7px #fff">${ic}</div>
  <div style="font-weight:800;font-size:32px;color:${c};letter-spacing:1px">${l}</div></div>`));
const pCtaTx = ctr(s6, 1320, `<div class="pillB" style="font-size:42px;padding:10px 36px;letter-spacing:2px">LIKE · SHARE · FOLLOW</div>`);
const pHand = add(s6, `<div class="abs" style="left:0;top:0">${ICON.hand(110)}</div>`);
const pMas = add(s6, `<div class="abs" style="left:830px;top:1430px;transform-origin:50% 100%"><img src="${BASE}brand/mascot_pose.png" style="height:470px;display:block;filter:drop-shadow(0 16px 20px rgba(90,70,120,.28))"></div>`);
const pOff = CHAR.officer(s6);
const pConf = NSP.buildConfetti(add(s6, `<div class="abs" style="inset:0"></div>`), 60, 540, 700);
const PRESS = [pb.cta + .25, pb.cta + .85, pb.cta2 + .7];
mark('endcard', PR + pb.cta3);
sfx('pop', PR + .1, .8); [0.5, 1.2, 1.9].forEach(a => sfx('msg', PR + a, .9));
sfx('whoosh', PR + pb.remind - .1, .5); sfx('pop', PR + pb.remind + .1, .8); [0, 1, 2].forEach(i => sfx('tick2', PR + pb.remind + 1.4 + i * .8, .4)); sfx('success', PR + pb.remind + 4.0, .5);
sfx('riser', PR + pb.brand - .6, .6); sfx('ding', PR + pb.brand + .1, .8); sfx('sparkle', PR + pb.brand + .3, .9);
sfx('whoosh', PR + pb.bank - .1, .5); for (let i = 0; i < 8; i++) sfx('coin', PR + pb.bank + .2 + i * .12, .35); sfx('pop', PR + pb.weekly + .1, .8);
PRESS.forEach(a => { sfx('click', PR + a, .9); sfx('pop', PR + a + .05, .6); }); sfx('sparkle', PR + pb.cta3 + .1, .7);
function drawPromo(t) {
  const u = t - PR;
  const r1 = pb.remind - .1, r2 = pb.brand - .1, r3 = pb.bank - .1;
  tf(pAsk, swing(u, .05, r1)); tf(pChat, swing(u, .1, r1));
  pCm.forEach((c, i) => tf(c, life(u, .5 + i * .7, 1e9, { from: .3, dy: 30, el: true, d: .7 })));
  pHearts.forEach((el, i) => { const a = .6 + i * .3, k = P(u, a, 1.6); tf(el, { x: 620 + (i % 4) * 50 + Math.sin(u * 3 + i) * 20, y: 1000 - k * 420, o: Math.sin(k * Math.PI) * (u < r1 ? 1 : 0), s: .8 + .4 * k }); });
  tf(pRem, swing(u, pb.remind, r2)); tf(pRowCard, swing(u, pb.remind + .2, r2));
  pRow.draw(t, [{ at: PR + pb.remind, list: ['ระเบียบ', 'ข้อบังคับ', 'ข่าว'], tint: 'none' }, { at: PR + pb.remind + 3.2, list: ['ระเบียบ', 'ข้อบังคับ', 'ข่าว'], tint: 'all', mark: 'bad' }], PR + pb.remind + .3, PR + r2);
  const mk = P(u, pb.remind + 1.2, 2.4);
  tf(pMag, { x: lerp(250, 700, E.inOut(mk)), y: 690 + Math.sin(mk * Math.PI * 3) * 14, o: clamp((u - pb.remind - 1.0) * 4) * (1 - P(u, pb.remind + 3.9, .3)), r: -8 + Math.sin(u * 4) * 5 });
  tf(pEyes, swing(u, pb.remind + 4.0, r2));
  // brand reveal
  const lg = life(u, pb.brand, 1e9, { from: .2, dy: 120, el: true, d: 1.0 });
  const up = E.inOut(P(u, r3, .6));
  tf(pLogo, { ...lg, x: 0, y: lg.y + bob(u, 0, 8) * (1 - up) - 90 * up, s: lg.s * lerp(1, .62, up), r: Math.sin(u * 1.8) * 2 * (1 - up) });
  tf(pWord, swing(u, pb.brand + .4, r3)); tf(pThai, swing(u, pb.brand + .7, r3));
  NSP.drawConfetti(pConf, t, PR + pb.brand + .2, 2.6);
  // question bank + weekly update + CTA
  const nl = life(u, pb.bank, 1e9, { from: .4, dy: 50, el: true, d: .8 });
  tf(pNum, { ...nl, s: nl.s * (1 + .03 * Math.sin(u * 4)) });
  pNum.querySelector('.pnum').textContent = (Math.round(10000 * E.out(P(u, pb.bank + .1, 1.4)) / 100) * 100).toLocaleString('en-US') + '+';
  tf(pNumTx, swing(u, pb.bank + .4, 1e9)); tf(pWeek, life(u, pb.weekly, 1e9, { from: .3, dy: 40, el: true, d: .8 }));
  tf(pMas, { ...life(u, pb.bank + .3, 1e9, { from: .5, dy: 200, d: .8 }), r: Math.sin(u * 2) * 2 });
  pCta.forEach((el, i) => {
    const l = life(u, pb.cta + i * .15, 1e9, { from: .2, dy: 60, el: true, d: .8 });
    const pr = NSP.pressDepth(u, [PRESS[i]]);
    tf(el, { ...l, s: l.s * (1 - .12 * pr) * (1 + .03 * Math.sin(u * 5 + i)) });
    el.querySelector('.pci').style.boxShadow = u > PRESS[i] ? `0 14px 26px rgba(80,90,150,.3),0 0 0 7px #fff,0 0 0 14px ${i === 1 ? 'rgba(149,191,239,.8)' : 'rgba(247,168,196,.85)'}` : '';
  });
  tf(pCtaTx, life(u, pb.cta2, 1e9, { from: .3, dy: 40, el: true, d: .8 }));
  let hx = 0, hy = 0, ho = 0, hs = 1;
  if (u > pb.cta && u < pb.cta3) {
    const seg = PRESS.filter(a => u >= a - .45).length - 1, i = Math.max(0, seg);
    const a = PRESS[i] - .45, k = E.inOut(P(u, a, .4)), prev = Math.max(0, i - 1);
    hx = lerp(244 + prev * 200 + 70 + (seg < 0 ? 200 : 0), 244 + i * 200 + 70, k); hy = lerp(1260, 1170, k);
    ho = clamp((u - pb.cta) * 4) * (1 - P(u, pb.cta3 - .3, .3)); hs = 1 - .15 * NSP.pressDepth(u, PRESS);
  }
  pHand.style.transform = `translate(${hx}px,${hy}px) scale(${hs})`; pHand.style.opacity = ho;
  // officer waves goodbye beside the chat / reminder, then steps aside for the brand
  const wave = { armL: [8, -6], armR: [140, 20 + Math.sin(u * 8) * 22] };
  pOff.pose({ t: u, ...(u < r2 ? wave : CHAR.POSE.cheer), expr: 'happy', lookX: .5, tilt: Math.sin(u * 3) * 4, blink: blink(u, 5) });
  pOff.set(lerp(240, -200, E.in(P(u, r2, .6))), 1980, .62);
}

// ======================================================================
NSP.start({
  ep: 'EP.62 • งานสารบรรณ',
  brand: { showAt: -1, hideAt: PR - .2 },
  wipes: [ST, KN, EX, QZ, PR],
  scenes: [
    { el: $('s1'), a: 0, b: ST, draw: drawHook },
    { el: $('s2'), a: ST, b: KN, draw: drawStory },
    { el: $('s3'), a: KN, b: EX, draw: drawKnow },
    { el: $('s4'), a: EX, b: QZ, draw: drawExpl },
    { el: $('s5'), a: QZ, b: PR, draw: drawQuiz },
    { el: $('s6'), a: PR, b: 1e9, draw: drawPromo },
  ],
});
// frame 0 must not depend on the brand entrance easing: show it fully from t = 0
})();
