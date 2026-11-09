// EP43 — FROM BIT TO QUETTABYTE — scene timeline (deterministic renderAt(t), audio-first).
// Every beat time is TL[segment][0] + BEATS[segment][...] (measured from the supplied narration).
(function () {
  const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark } = NSP;
  const TL = window.TL, B = window.BEATS, U = window.UNITS, QZ = window.QUIZ;
  const stage = $('stage'), brandEl = $('brand');
  const T0 = k => TL[k][0];
  const H = T0('hook'), S = T0('story'), K = T0('know'), X = T0('expl'), Q = T0('quiz'), CD = TL.cd[0], CDD = TL.cd[1], A = T0('ans'), PR = T0('promo'), END = TL.end;
  const FPS = TL.fps || 30;
  const at = (seg, key) => T0(seg) + B[seg][key];
  const bh = k => at('hook', k), bs = k => at('story', k), bk = k => at('know', k), bx = k => at('expl', k), bq = k => at('quiz', k), ba = k => at('ans', k), bp = k => at('promo', k);

  // ---------- helpers ----------
  function scene(id, a, b) { const el = h(`<div class="scene" id="${id}"></div>`); stage.insertBefore(el, brandEl); return { el, a, b }; }
  const add = (parent, html) => { const el = h(html); parent.appendChild(el); return el; };
  // centred block: left/top/width in px, critical text flagged for the safe-zone QC
  const put = (parent, x, y, w, inner, { crit = true, style = '' } = {}) => add(parent, `<div class="abs c ctr" ${crit ? 'data-crit="1"' : ''} style="left:${x}px;top:${y}px;width:${w}px;${style}">${inner}</div>`);
  const win = (t, a, b, d = .35, d2 = .3) => clamp((t - a) / d) * (1 - clamp((t - b) / d2));
  const pop = (el, t, a, b = 1e9, o = {}, extra = {}) => { const l = life(t, a, b, o); tf(el, { ...l, ...extra, y: l.y + (extra.y || 0), s: l.s * (extra.s ?? 1), o: l.o * (extra.o ?? 1) }); return l; };
  const arrowR = (s = 44, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="flex:none"><path d="M3 12h15M12 5l7 7-7 7" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const arrowU = (s = 44, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24" style="flex:none"><path d="M12 21V5M5 11l7-7 7 7" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
  const neq = (s = 120, c = '#FFD23F') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 9h16M4 15h16M16 4L8 20" fill="none" stroke="${c}" stroke-width="2.8" stroke-linecap="round"/></svg>`;
  const sup = e => `10<span class="ex">${e}</span>`;
  const unit = k => U.find(u => u.k === k);

  // ---------- background: navy depth + floating binary digits (parallax with the tower camera) ----------
  window.CAMY = 0;
  const bgx = $('bgx');
  const grid = add(bgx, `<svg class="abs" style="left:0;top:1180px" width="1080" height="740" viewBox="0 0 1080 740">
    <defs><linearGradient id="gfade" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#22D3EE" stop-opacity="0"/><stop offset="1" stop-color="#22D3EE" stop-opacity=".35"/></linearGradient></defs>
    ${[...Array(15)].map((_, i) => `<path d="M540 0 L${-1400 + i * 270} 740" stroke="url(#gfade)" stroke-width="2"/>`).join('')}
    <g class="hl">${[...Array(9)].map((_, i) => `<path d="M0 ${i * 90} H1080" stroke="url(#gfade)" stroke-width="2"/>`).join('')}</g></svg>`);
  const gridH = grid.querySelector('.hl');
  const digits = [];
  for (let i = 0; i < 46; i++) {
    const el = add(bgx, `<div class="dg">${NSP.rnd() > .5 ? '1' : '0'}</div>`);
    const d = { el, x: NSP.rnd() * 1080, y: NSP.rnd() * 1920, sp: 14 + NSP.rnd() * 30, sz: 18 + NSP.rnd() * 30, ph: NSP.rnd() * 6.28, par: .05 + NSP.rnd() * .2 };
    el.style.fontSize = d.sz + 'px'; digits.push(d);
  }
  const sweep = add(bgx, `<div class="abs" style="left:-200px;top:0;width:1480px;height:260px;background:linear-gradient(180deg,rgba(34,211,238,0),rgba(34,211,238,.08),rgba(34,211,238,0))"></div>`);
  function drawBgx(t) {
    digits.forEach(d => {
      let y = (d.y - t * d.sp + window.CAMY * d.par) % 2000; if (y < -60) y += 2000;
      tf(d.el, { x: d.x + Math.sin(t * .6 + d.ph) * 18, y, o: .1 + .12 * (.5 + .5 * Math.sin(t * 1.4 + d.ph)) });
    });
    gridH.setAttribute('transform', `translate(0 ${(t * 40 + window.CAMY * .1) % 90})`);
    tf(sweep, { y: ((t * 160) % 2600) - 400, o: 1 });
  }

  // ---------- custom blue wipe ----------
  const wipe = add(stage, `<div id="wipex">
    <div class="band" style="left:0;width:180px;background:#22D3EE"></div>
    <div class="band" style="left:180px;width:110px;background:#2F6BFF"></div>
    <div class="band" style="left:290px;width:1220px;background:linear-gradient(180deg,#142B53,#0B1A36)"></div>
    <div class="band" style="left:1510px;width:110px;background:#2F6BFF"></div>
    <div class="band" style="left:1620px;width:180px;background:#22D3EE"></div>
    <img src="${NSP.BASE}brand/logo.png"></div>`);
  const WIPES = [S, K, Q, PR];
  WIPES.forEach(b => sfx('swoosh', b - .35, .7));
  function drawWipe(t) {
    let wp = -1; const D = .9;
    WIPES.forEach(b => { if (t > b - D / 2 && t < b + D / 2) wp = (t - (b - D / 2)) / D; });
    if (wp < 0) { wipe.style.visibility = 'hidden'; return; }
    wipe.style.visibility = 'visible';
    wipe.style.transform = `translateX(${lerp(1200, -2100, E.inOut(wp))}px) skewX(-10deg)`;
    wipe.querySelector('img').style.transform = `skewX(10deg) rotate(${(wp - .5) * 30}deg) scale(${.8 + .2 * Math.sin(wp * Math.PI)})`;
  }

  const scenes = [];

  // =====================================================================
  // SCENE 01 — HOOK (frame zero: เตรียมสอบนายสิบ already fully visible)
  // =====================================================================
  {
    const sc = scene('s-hook', H, S); const R = sc.el;
    const title = put(R, 40, 360, 1000, `<div class="big-t glowt" style="font-size:78px">เตรียมสอบนายสิบ</div>`);
    const sub = put(R, 40, 478, 1000, `<div class="pillx" style="font-size:38px">วิชาคอมพิวเตอร์ · หน่วยข้อมูล</div>`);
    // teaser ladder (simplified teaser, not the formal table): BIT → BYTE → KB → MB → GB → ?
    const TZ = ['BIT', 'BYTE', 'KB', 'MB', 'GB', '?'];
    const tzx = i => 540 + (i < 5 ? (i % 2 ? 80 : -80) : 0), tzy = i => 1160 - i * 108;
    const tz = TZ.map((s, i) => put(R, tzx(i) - 120, tzy(i), 240, `<div class="uchip" style="font-size:${s === '?' ? 56 : 46}px;padding:8px 26px;min-width:${s === '?' ? 110 : 150}px;${s === '?' ? 'background:linear-gradient(180deg,#FFD23F,#FFB800);color:#142B53;border-color:#FFE58A' : ''}">${s}</div>`));
    const tzArr = TZ.slice(0, 5).map((_, i) => add(R, `<div class="abs" style="left:${523}px;top:${tzy(i) - 37}px">${arrowU(34)}</div>`));
    const q1 = put(R, 40, 1262, 1000, `<div class="big-t glowt" style="font-size:64px">หน่วยข้อมูลใหญ่ที่สุด<br><span style="color:var(--yl)">คืออะไร?</span></div>`);
    // 01C common assumptions
    const many = put(R, 40, 392, 1000, `<div class="pillx dark" style="font-size:46px">หลายคนอาจตอบว่า…</div>`);
    const cardTB = put(R, 240, 650, 300, `<div class="gcard" style="width:280px;height:330px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px"><div style="font-weight:800;font-size:130px;line-height:1;color:#fff" class="glowt">TB</div><div style="font-weight:700;font-size:40px;color:var(--lb)">เทราไบต์</div></div>`);
    const cardYB = put(R, 540, 650, 300, `<div class="gcard" style="width:280px;height:330px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:8px"><div style="font-weight:800;font-size:130px;line-height:1;color:#fff" class="glowt">YB</div><div style="font-weight:700;font-size:40px;color:var(--lb)">ยอตตะไบต์</div></div>`);
    const think = put(R, 40, 1070, 1000, `<div class="big-t" style="font-size:56px;color:var(--lb)">ใหญ่สุดแล้ว… จริงเหรอ?</div>`);
    const but = put(R, 40, 1230, 1000, `<div class="pillx yl" style="font-size:52px">แต่รู้ไหม?</div>`);
    // 01D / 01E — tower instance
    const twWrap = add(R, `<div class="abs" style="inset:0"></div>`);
    const tw = TOWER.build(twWrap, { id: 'h' });
    const now1 = put(R, 40, 382, 1000, `<div class="big-t glowt" style="font-size:48px">ปัจจุบันมีหน่วยที่<span style="color:var(--yl)">ใหญ่กว่า YB</span><br>อย่างเป็นทางการแล้ว!</div>`);
    const order = put(R, 40, 382, 1000, `<div class="pillx" style="font-size:42px">เรียงหน่วยข้อมูล เล็ก ${arrowR(40, '#fff')} ใหญ่</div>`);
    const chipBit = add(R, `<div class="abs c" data-crit="1" style="left:236px;top:0;width:200px;display:flex;justify-content:center"><div class="uchip" style="font-size:52px;padding:10px 26px">bit</div></div>`);
    const chipTop = add(R, `<div class="abs c" data-crit="1" style="left:640px;top:0;width:200px;display:flex;justify-content:center"><div class="uchip" style="font-size:60px;padding:8px 34px;background:linear-gradient(180deg,#FFD23F,#FFB800);color:#142B53;border-color:#FFE58A">?</div></div>`);
    const beam = add(R, `<svg class="abs" style="left:0;top:0" width="1080" height="1920"><path class="bm" d="M540 0" stroke="#E6F4FF" stroke-width="10" stroke-linecap="round" fill="none" style="filter:drop-shadow(0 0 14px #22D3EE)"/></svg>`).querySelector('.bm');
    const sideArr = add(R, `<div class="abs" style="left:880px;top:0;width:60px"><svg width="60" height="900" viewBox="0 0 60 900"><path d="M30 880V40M8 66L30 20l22 46" fill="none" stroke="#22D3EE" stroke-width="7" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`);
    const see = put(R, 60, 760, 960, `<div class="gcard" style="padding:36px 40px;display:flex;flex-direction:column;align-items:center;gap:18px"><div class="big-t glowt" style="font-size:58px">คุณจะเรียง<span style="color:var(--yl)">ถูก</span>ไหม?</div><div style="display:flex;gap:30px"><div style="width:96px;height:96px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${ICON.check('#fff', 60)}</div><div style="width:96px;height:96px;border-radius:50%;background:#EF4444;display:grid;place-items:center">${ICON.cross('#fff', 56)}</div></div></div>`);

    // sfx
    sfx('reveal', H + .05, .7);
    TZ.forEach((_, i) => sfx('blip', H + .25 + i * .12, .5));
    sfx('rise', bh('q') - .1, .7); sfx('pop', bh('tb'), .9); sfx('pop', bh('yb'), .9); sfx('stamp', bh('but'), .6);
    sfx('reveal', bh('now'), .9); sfx('rise', bh('today') - .1, .8); sfx('bit', bh('frombit'), .9); sfx('sparkle', bh('to') + .3, .8); sfx('ding', bh('see') + .1, .6);

    const KF = [[bh('now') - .4, 10, .62, 1300], [bh('today'), 10, .62, 1300], [bh('today') + 1.4, 6, .15, 916], [bh('see'), 6, .15, 916], [bh('see') + 1.2, 6, .17, 930]];
    sc.draw = t => {
      const u = t - H;
      // frame 0: title, subtitle, teaser ladder and question are already fully on screen (no entrance)
      const outA = clamp((t - (bh('many') - .35)) / .3);
      tf(title, { s: 1 + .015 * Math.sin(u * 2.2), o: 1 - outA, y: -40 * outA });
      tf(sub, { s: 1 + .06 * Math.max(0, 1 - Math.abs(t - bh('comp') - .1) / .25), o: 1 - outA });
      const rise = E.inOut(P(t, bh('q'), 1.6));
      tz.forEach((el, i) => {
        const big = i === 5 ? 1 + .3 * E.back(P(t, bh('q'), .5)) + .05 * Math.sin(u * 5) * P(t, bh('q'), .5) : 1;
        tf(el, { y: bob(u, i, 6, 2) - rise * 60 - i * rise * 10, s: big, o: 1 - outA });
      });
      tzArr.forEach((el, i) => tf(el, { y: bob(u, i + .5, 6, 2) - rise * 60 - i * rise * 10, o: (.8 + .2 * Math.sin(u * 4 - i)) * (1 - outA) }));
      tf(q1, { s: 1 + .06 * Math.max(0, 1 - Math.abs(t - bh('q') - .3) / .4), o: 1 - outA });
      const endC = bh('now') - .25;
      pop(many, t, bh('many'), endC, { from: .6, dy: 30 });
      pop(cardTB, t, bh('tb'), endC, { from: .3, dy: 60 }, { y: bob(u, 1, 8), r: -4 });
      pop(cardYB, t, bh('yb'), endC, { from: .3, dy: 60 }, { y: bob(u, 2, 8), r: 4 });
      pop(think, t, bh('yb') + .5, bh('but'), { from: .6, dy: 30 });
      pop(but, t, bh('but'), endC, { from: .4, dy: 20, el: true });
      // tower: YB + two hidden platforms above (labels hidden)
      const tOn = win(t, bh('now') - .4, bh('see') + 99, .45);
      twWrap.style.opacity = tOn; twWrap.style.visibility = tOn > 0 ? 'visible' : 'hidden';
      [chipBit, chipTop, sideArr].forEach(el => { el.style.visibility = tOn > 0 ? 'visible' : 'hidden'; });
      beam.style.visibility = tOn > 0 ? 'visible' : 'hidden';
      if (tOn > 0) {
        const cam = TOWER.camera(KF, t);
        tw.draw(t, cam, i => {
          const ghost = i >= 11;
          const zoomed = t >= bh('today');
          const act = i === 10 && !zoomed ? 1 : 0;
          return { o: (i >= 8 || zoomed) ? 1 : 0, act: zoomed ? .6 : act, hidden: ghost ? 1 : 0, lab: i === 10 ? 1 : .55, qo: 1, scale: i === 10 && !zoomed ? 1.25 : 1 };
        });
        const pr = E.inOut(P(t, bh('to'), 1.6)), yb0 = tw.screenY(0, cam), yb12 = tw.screenY(12, cam);
        beam.setAttribute('d', `M540 ${yb0} L540 ${lerp(yb0, yb12, pr)}`);
        beam.style.opacity = P(t, bh('to'), .2) * (1 - P(t, bh('see'), .3) * .6);
        pop(chipBit, t, bh('frombit'), 1e9, { from: .3, dy: 20, el: true }, { y: yb0 - 80 });
        pop(chipTop, t, bh('to') + 1.2, 1e9, { from: .3, dy: 20, el: true }, { y: yb12 - 45 + bob(u, 0, 6) });
        tf(sideArr, { y: yb12 - 40, o: P(t, bh('to'), .5) * .9, sy: E.out(P(t, bh('to'), 1.4)) });
        sideArr.style.transformOrigin = '50% 100%';
      }
      pop(now1, t, bh('now') + .1, bh('today') - .3, { from: .6, dy: 30 });
      pop(order, t, bh('today') + .2, 1e9, { from: .6, dy: 30 });
      pop(see, t, bh('see'), 1e9, { from: .5, dy: 40, el: true });
    };
    scenes.push(sc);
  }

  // =====================================================================
  // SCENE 02 — STORAGE DEVICES IN REAL LIFE
  // =====================================================================
  {
    const sc = scene('s-story', S, K); const R = sc.el;
    const flashSVG = `<svg width="300" height="420" viewBox="0 0 300 420"><rect x="95" y="10" width="110" height="90" rx="10" fill="#C9D9F2" stroke="#E6F4FF" stroke-width="5"/><rect x="118" y="34" width="22" height="22" rx="3" fill="#142B53"/><rect x="160" y="34" width="22" height="22" rx="3" fill="#142B53"/><rect x="60" y="92" width="180" height="300" rx="36" fill="url(#fg)" stroke="#22D3EE" stroke-width="6"/><defs><linearGradient id="fg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4583FF"/><stop offset="1" stop-color="#173C8C"/></linearGradient></defs><circle cx="150" cy="330" r="16" fill="#22D3EE"/><path d="M100 150h100M100 180h70" stroke="rgba(230,244,255,.6)" stroke-width="10" stroke-linecap="round"/></svg>`;
    const hddSVG = `<svg width="420" height="420" viewBox="0 0 420 420"><rect x="20" y="20" width="380" height="380" rx="40" fill="url(#hg)" stroke="#22D3EE" stroke-width="6"/><defs><linearGradient id="hg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2A5DD6"/><stop offset="1" stop-color="#10275A"/></linearGradient><radialGradient id="pl" cx=".4" cy=".35"><stop offset="0" stop-color="#E6F4FF"/><stop offset=".6" stop-color="#95BFEF"/><stop offset="1" stop-color="#5B7FB8"/></radialGradient></defs><circle class="platter" cx="200" cy="190" r="140" fill="url(#pl)"/><circle cx="200" cy="190" r="140" fill="none" stroke="rgba(20,43,83,.25)" stroke-width="3" stroke-dasharray="6 14" class="platter2"/><circle cx="200" cy="190" r="26" fill="#142B53"/><path d="M350 360L230 210" stroke="#E6F4FF" stroke-width="16" stroke-linecap="round"/><circle cx="350" cy="360" r="22" fill="#142B53" stroke="#E6F4FF" stroke-width="5"/>${[[46, 46], [374, 46], [46, 374]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="9" fill="#0B1A36"/>`).join('')}</svg>`;
    const head0 = put(R, 40, 382, 1000, `<div class="th-t glowt" style="font-size:50px;font-weight:800">สมมุติว่าคุณกำลังเลือกซื้อ<br><span style="color:var(--cy)">อุปกรณ์เก็บข้อมูล</span></div>`);
    const flash = add(R, `<div class="abs c" style="left:${540 - 150}px;top:640px;width:300px;height:420px">${flashSVG}</div>`);
    const hdd = add(R, `<div class="abs c" style="left:${540 - 210}px;top:640px;width:420px;height:420px">${hddSVG}</div>`);
    const platter = hdd.querySelector('.platter2');
    const lblF = put(R, 40, 392, 1000, `<div class="pillx dark" style="font-size:48px">แฟลชไดรฟ์ ความจุเป็น…</div>`);
    const lblH = put(R, 40, 392, 1000, `<div class="pillx dark" style="font-size:48px">ฮาร์ดดิสก์ ความจุเป็น…</div>`);
    const tagGB = put(R, 40, 1130, 1000, `<div class="uchip" style="font-size:110px;padding:14px 50px;gap:20px">GB<span style="font-size:44px;font-weight:700;color:var(--ice)">กิกะไบต์</span></div>`);
    const tagTB = put(R, 40, 1130, 1000, `<div class="uchip" style="font-size:110px;padding:14px 50px;gap:20px">TB<span style="font-size:44px;font-weight:700;color:var(--ice)">เทราไบต์</span></div>`);
    // data centre
    const dc = add(R, `<div class="abs" style="left:0;top:0;width:1080px;height:1920px"></div>`);
    const racks = [];
    const rackSVG = (w, hh) => `<svg width="${w}" height="${hh}" viewBox="0 0 100 220"><rect x="2" y="2" width="96" height="216" rx="8" fill="#10244A" stroke="#2F6BFF" stroke-width="3"/>${[...Array(10)].map((_, i) => `<rect x="10" y="${12 + i * 20}" width="80" height="13" rx="3" fill="#1B3A78"/><circle class="led" cx="80" cy="${18.5 + i * 20}" r="3.2" fill="#22D3EE"/><circle cx="70" cy="${18.5 + i * 20}" r="2.4" fill="#95BFEF"/>`).join('')}</svg>`;
    [[0, 560, .5], [1, 730, .72], [2, 920, 1]].forEach(([row, y, s]) => {
      const n = row === 0 ? 7 : row === 1 ? 5 : 4, w = 100 * 1.5 * s, hh = 220 * 1.5 * s, gap = 1080 / n;
      for (let i = 0; i < n; i++) racks.push({ el: add(dc, `<div class="abs c" style="left:${gap * (i + .5) - w / 2}px;top:${y}px;width:${w}px;height:${hh}px">${rackSVG(w, hh)}</div>`), row, i, leds: null });
    });
    racks.forEach(r => r.leds = [...r.el.querySelectorAll('.led')]);
    const net = add(dc, `<svg class="abs" style="left:0;top:0" width="1080" height="1920">${[...Array(16)].map((_, i) => { const x1 = 80 + (i * 137) % 920, y1 = 520 + (i * 97) % 760, x2 = 80 + (i * 211 + 300) % 920, y2 = 520 + (i * 151 + 200) % 760; return `<path class="nl" d="M${x1} ${y1} L${x2} ${y2}" stroke="#22D3EE" stroke-width="3" opacity=".5"/><circle cx="${x1}" cy="${y1}" r="8" fill="#22D3EE"/>`; }).join('')}</svg>`);
    const nls = [...net.querySelectorAll('.nl')];
    const headDC = put(R, 40, 382, 1000, `<div class="th-t glowt" style="font-size:44px;font-weight:800">ระบบจัดเก็บข้อมูล<span style="color:var(--cy)">ขนาดมหาศาล</span></div>`);
    const more = put(R, 40, 478, 1000, `<div class="pillx yl" style="font-size:44px">มีหน่วยที่ใหญ่กว่านั้นอีก!</div>`);
    const dimDC = add(R, `<div class="abs" style="inset:0;background:rgba(11,26,54,.6)"></div>`);
    const PBc = put(R, 40, 1000, 1000, `<div class="uchip" style="font-size:130px;padding:16px 56px;gap:22px">PB<span style="font-size:46px;font-weight:700;color:var(--ice)">เพตะไบต์</span></div>`);
    const EBc = put(R, 40, 760, 1000, `<div class="uchip" style="font-size:130px;padding:16px 56px;gap:22px">EB<span style="font-size:46px;font-weight:700;color:var(--ice)">เอกซะไบต์</span></div>`);
    // ranking ladder question
    const qhead1 = put(R, 40, 382, 1000, `<div class="pillx" style="font-size:42px">เรียงจากเล็ก ${arrowR(40, '#fff')} ใหญ่ได้ไหม?</div>`);
    const qhead2 = put(R, 40, 382, 1000, `<div class="pillx yl" style="font-size:52px">จำลำดับได้หรือไม่?</div>`);
    const slots = [...Array(7)].map((_, i) => put(R, 230, 1290 - i * 132, 290, `<div style="width:270px;height:108px;border-radius:28px;border:4px dashed rgba(149,191,239,.75);background:rgba(16,36,74,.6);display:grid;place-items:center;font-weight:800;font-size:56px;color:rgba(149,191,239,.8)">?</div>`, { crit: false }));
    const slotArr = add(R, `<div class="abs" style="left:520px;top:500px"><svg width="50" height="900" viewBox="0 0 50 900"><path d="M25 880V30M6 52L25 12l19 40" fill="none" stroke="#22D3EE" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/></svg></div>`);
    const FL = [['MB', 650, 510], ['bit', 760, 625], ['TB', 650, 740], ['kB', 760, 855], ['EB', 650, 970], ['Byte', 760, 1085], ['GB', 650, 1200], ['PB', 760, 1315]];
    const floats = FL.map(([s, x, y]) => ({ el: put(R, x - 90, y - 50, 180, `<div class="uchip" style="font-size:${s.length > 3 ? 44 : 56}px;padding:12px 18px;min-width:140px">${s}</div>`), x, y }));

    sfx('pop', S + .5, .7); sfx('pop', S + .7, .7);
    sfx('blip', bs('flash') + .3, .9); sfx('blip', bs('hdd') + .3, .9);
    sfx('rise', bs('huge') - .1, .8); for (let i = 0; i < 8; i++) sfx('bit', bs('huge') + .3 + i * .12, .5);
    sfx('pop', bs('more'), .8); sfx('boom', bs('pb'), .6); sfx('boom', bs('eb'), .6);
    sfx('whoosh', bs('q') - .1, .6); FL.forEach((_, i) => sfx('pop', bs('order') + .1 + i * .08, .35)); sfx('ding', bs('remember') + .1, .5);

    sc.draw = t => {
      const u = t - S;
      pop(head0, t, bs('buy') + .1, bs('flash') - .2, { from: .6, dy: 30 });
      // flash: shelf -> hero -> away
      const k1 = E.inOut(P(t, bs('flash') - .2, .6)), k2 = E.inOut(P(t, bs('hdd') - .2, .6)), k3 = E.inOut(P(t, bs('huge') - .1, .7));
      const fIn = life(t, S + .4, 1e9, { from: .3, dy: 80 });
      tf(flash, { x: lerp(lerp(-170, 0, k1), -260, k2), y: lerp(40, 0, k1) + bob(u, 0, 8), s: fIn.s * lerp(lerp(.7, 1.15, k1), .55, k2), o: fIn.o * (1 - .6 * k2) * (1 - k3), r: lerp(-8, 0, k1) });
      const hIn = life(t, S + .6, 1e9, { from: .3, dy: 80 });
      tf(hdd, { x: lerp(lerp(170, 300, k1), 0, k2), y: lerp(40, 0, k2) + bob(u, 1, 8), s: hIn.s * lerp(lerp(.6, .45, k1), 1, k2) * (1 - .6 * k3), o: hIn.o * lerp(1, .5, k1 * (1 - k2)) * (1 - k3), r: lerp(6, 0, k2) });
      platter.setAttribute('transform', `rotate(${u * 220} 200 190)`);
      pop(lblF, t, bs('flash'), bs('hdd') - .2, { from: .6, dy: 20 });
      pop(lblH, t, bs('hdd'), bs('huge') - .2, { from: .6, dy: 20 });
      pop(tagGB, t, bs('flash') + .25, bs('hdd') - .2, { from: .3, dy: 40, el: true });
      pop(tagTB, t, bs('hdd') + .25, bs('huge') - .2, { from: .3, dy: 40, el: true });
      // data centre grows
      const dcOn = win(t, bs('huge'), bs('q') - .1, .5);
      dc.style.opacity = dcOn; dc.style.visibility = dcOn > 0 ? 'visible' : 'hidden';
      const camUp = E.inOut(P(t, bs('pb') - .2, 1.6));
      racks.forEach(r => {
        const l = life(t, bs('huge') + .2 + r.row * .35 + r.i * .07, 1e9, { from: .3, dy: 120 });
        tf(r.el, { ...l, y: l.y + camUp * 260 * (.4 + r.row * .3) });
        r.leds.forEach((d, j) => d.setAttribute('opacity', (.3 + .7 * (Math.sin(u * 7 + j * 1.7 + r.i * 2.3) > 0)).toFixed(2)));
      });
      nls.forEach((n, i) => n.setAttribute('opacity', (P(t, bs('huge') + 1 + i * .12, .4) * (.3 + .3 * Math.sin(u * 3 + i))).toFixed(2)));
      tf(net.parentElement === dc ? net : net, { y: camUp * 200 });
      pop(headDC, t, bs('huge') + .1, bs('q') - .2, { from: .6, dy: 30 });
      pop(more, t, bs('more'), bs('pb') - .1, { from: .4, dy: 20, el: true });
      dimDC.style.opacity = .85 * P(t, bs('pb') - .2, .4) * dcOn;
      const lp = pop(PBc, t, bs('pb'), bs('q') - .2, { from: .3, dy: 60, el: true }, { y: E.inOut(P(t, bs('eb') - .1, .6)) * 200 });
      pop(EBc, t, bs('eb'), bs('q') - .2, { from: .3, dy: -80, el: true }, { y: E.inOut(P(t, bs('eb') - .1, .6)) * 60 });
      // question: blank ranking ladder + floating cards
      pop(qhead1, t, bs('order'), bs('remember') - .1, { from: .6, dy: 20 });
      pop(qhead2, t, bs('remember'), 1e9, { from: .4, dy: 20, el: true });
      slots.forEach((el, i) => pop(el, t, bs('q') + i * .07, 1e9, { from: .5, dy: 30 }));
      tf(slotArr, { o: P(t, bs('q') + .5, .5) * (.6 + .3 * Math.sin(u * 4)) });
      floats.forEach((f, i) => pop(f.el, t, bs('order') + .1 + i * .08, 1e9, { from: .3, dy: 50, el: true }, { y: bob(u, i * 1.3, 10, 1.8), r: Math.sin(u * 1.2 + i) * 6 }));
    };
    scenes.push(sc);
  }

  // =====================================================================
  // SCENE 03A — BIT, NIBBLE AND BYTE (micro data)
  // =====================================================================
  const KM_END = bk('then') + .5;
  {
    const sc = scene('s-micro', K, KM_END + .1); const R = sc.el;
    const head = put(R, 40, 382, 1000, `<div class="pillx" style="font-size:46px">เริ่มจากหน่วยพื้นฐาน</div>`);
    const VALS = [1, 0, 1, 1, 0, 1, 1, 0];
    const tiles = VALS.map((v, i) => { const el = add(R, `<div class="tile c" style="left:0;top:0;width:240px;height:240px;font-size:160px">${v}</div>`); return { el, v }; });
    const lblBit = put(R, 40, 930, 1000, `<div class="big-t glowt" style="font-size:96px">bit <span style="color:var(--yl)">(b)</span></div>`);
    const lblVal = put(R, 40, 1080, 1000, `<div class="pillx dark" style="font-size:46px">มีค่าได้ <b style="color:var(--yl);font-size:56px">0</b> หรือ <b style="color:var(--yl);font-size:56px">1</b></div>`);
    const brace4 = add(R, `<svg class="abs" style="left:240px;top:820px" width="600" height="70" viewBox="0 0 600 70"><path d="M10 8 Q10 34 60 34 H270 Q300 34 300 62 Q300 34 330 34 H540 Q590 34 590 8" fill="none" stroke="#FFD23F" stroke-width="7" stroke-linecap="round"/></svg>`);
    const lblNib = put(R, 40, 905, 1000, `<div class="big-t glowt" style="font-size:72px">4 bits = <span style="color:var(--yl)">1 nibble</span></div>`);
    const lblNibTh = put(R, 40, 1010, 1000, `<div class="pillx dark" style="font-size:44px">สี่บิต เรียกว่า หนึ่งนิบเบิล</div>`);
    // byte layout: 8 tiles of 68 px, 8 px gaps, +24 px between the two nibbles
    const bx8 = i => 232 + 34 + i * 76 + (i >= 4 ? 24 : 0);
    const boxByte = add(R, `<div class="abs" style="left:212px;top:686px;width:656px;height:128px;border-radius:30px;border:6px solid #FFD23F;box-shadow:0 0 30px rgba(255,210,63,.5),inset 0 0 30px rgba(255,210,63,.2)"></div>`);
    const nibTags = [0, 1].map(k => put(R, (k ? bx8(4) : bx8(0)) - 34 - 10, 826, 316, `<div class="pillx dark" style="font-size:30px;padding:6px 20px">nibble</div>`));
    const lblByte = put(R, 40, 920, 1000, `<div class="big-t glowt" style="font-size:80px">8 bits = <span style="color:var(--yl)">1 Byte</span></div>`);
    const lblByte2 = put(R, 40, 1040, 1000, `<div class="pillx" style="font-size:48px">2 nibbles = 1 Byte</div>`);
    const lblByte3 = put(R, 40, 1150, 1000, `<div class="th-t" style="font-size:36px;color:var(--lb)">bit ใช้ <b style="color:#fff">b</b> ตัวเล็ก · Byte ใช้ <b style="color:#fff">B</b> ตัวใหญ่</div>`);

    sfx('pop', K + .1, .6); sfx('bit', bk('bit'), 1); sfx('bit', bk('zero'), .7); sfx('bit', bk('one'), .7);
    for (let i = 1; i < 4; i++) sfx('bit', bk('four') + i * .1, .7); sfx('lock', bk('nibble'), .9);
    for (let i = 4; i < 8; i++) sfx('bit', bk('eight') + (i - 4) * .08, .6); sfx('lock', bk('byte'), 1); sfx('ding', bk('byte') + .15, .5);

    sc.draw = t => {
      const u = t - K;
      const fadeAll = 1 - P(t, KM_END - .55, .5);
      R.style.opacity = fadeAll;
      pop(head, t, bk('basic'), bk('four') - .2, { from: .6, dy: 20 });
      const kB_ = E.inOut(P(t, bk('four') - .15, .5)), kC = E.inOut(P(t, bk('eight') - .15, .5));
      const shrink = E.inOut(P(t, KM_END - .6, .55));
      tiles.forEach((tl, i) => {
        // layouts A (single), B (4 tiles), C (8 tiles)
        const ax = 540, ay = 760, as = 1;
        const bxx = 315 + Math.min(i, 3) * 150, byy = 740, bs_ = 130 / 240;
        const cx = bx8(i), cy = 750, cs = 68 / 240;
        let x = lerp(lerp(ax, bxx, kB_), cx, kC), y = lerp(lerp(ay, byy, kB_), cy, kC), s = lerp(lerp(as, bs_, kB_), cs, kC);
        // fold into the Byte platform
        x = lerp(x, 540, shrink); y = lerp(y, 1010, shrink); s *= lerp(1, .4, shrink);
        const appear = i === 0 ? bk('bit') : i < 4 ? bk('four') + i * .1 : bk('eight') + (i - 4) * .08;
        const l = life(t, appear, 1e9, { from: .2, dy: 0, d: .5, el: i === 0 });
        // value flip
        let v = tl.v;
        if (i === 0 && t < bk('four')) v = t >= bk('one') ? 1 : t >= bk('zero') ? 0 : (Math.floor(u * 1.6) % 2 ? 0 : 1);
        if (tl.el.textContent !== String(v)) tl.el.textContent = v;
        const flipPh = i === 0 && t < bk('four') ? Math.abs(Math.cos(Math.PI * Math.min(1, ((u * 1.6) % 1) / .25 + (t >= bk('zero') ? 1 : 0)))) : 1;
        tf(tl.el, { x: x - 120, y: y - 120 + bob(u, i, 4, 3), s: s * l.s, sx: s * l.s * (i === 0 && t < bk('zero') ? Math.max(.15, flipPh) : 1), sy: s * l.s, o: l.o });
        tl.el.style.borderColor = t >= bk('byte') ? '#FFD23F' : '';
      });
      pop(lblBit, t, bk('bit') + .1, bk('four') - .2, { from: .5, dy: 30 });
      pop(lblVal, t, bk('val'), bk('four') - .2, { from: .5, dy: 30 });
      const bo = win(t, bk('nibble'), bk('eight') - .2, .3);
      brace4.style.opacity = bo; brace4.style.transform = `scaleX(${E.back(P(t, bk('nibble'), .5))})`; brace4.style.transformOrigin = '50% 0';
      pop(lblNib, t, bk('nibble'), bk('eight') - .2, { from: .4, dy: 30, el: true });
      pop(lblNibTh, t, bk('called'), bk('eight') - .2, { from: .5, dy: 20 });
      const byOn = clamp((t - bk('byte')) / .4) * (1 - shrink);
      tf(boxByte, { o: byOn, s: lerp(1.15, 1, E.back(P(t, bk('byte'), .5))) });
      nibTags.forEach((el, k) => pop(el, t, bk('byte') + .5 + k * .12, KM_END - .6, { from: .5, dy: 10 }));
      pop(lblByte, t, bk('byte'), KM_END - .6, { from: .4, dy: 30, el: true });
      pop(lblByte2, t, bk('byte') + .6, KM_END - .6, { from: .5, dy: 20 });
      pop(lblByte3, t, bk('byte') + 1.0, KM_END - .6, { from: .5, dy: 20 });
    };
    scenes.push(sc);
  }

  // =====================================================================
  // SCENE 03B + 04 — THE DATA SIZE TOWER (kB → TB, recap, PB → YB, ×1,000, 2022, RONNA, QUETTA)
  // =====================================================================
  {
    const T_IN = bk('then') - .3;
    const sc = scene('s-tower', T_IN, Q); const R = sc.el;
    // phase C backdrop: server skyline
    const sky = add(R, `<div class="abs" style="left:-100px;top:1100px;width:1280px;height:820px"><svg width="1280" height="820" viewBox="0 0 1280 820">${[...Array(18)].map((_, i) => { const x = i * 72, hh = 220 + ((i * 137) % 300); return `<rect x="${x}" y="${820 - hh}" width="60" height="${hh}" rx="6" fill="#10244A" stroke="#2F6BFF" stroke-width="2"/>${[...Array(Math.floor(hh / 26))].map((_, j) => `<rect class="sl" x="${x + 10}" y="${820 - hh + 12 + j * 26}" width="40" height="8" rx="2" fill="#22D3EE" opacity=".5"/>`).join('')}`; }).join('')}</svg></div>`);
    const skyL = [...sky.querySelectorAll('.sl')];
    const twWrap = add(R, `<div class="abs" style="inset:0"></div>`);
    const tw = TOWER.build(twWrap, { id: 'm' });
    const burst = add(R, `<div class="abs" style="left:0;top:0;width:700px;height:240px;border-radius:50%;border:8px solid #E6F4FF;box-shadow:0 0 40px #22D3EE,inset 0 0 40px #22D3EE"></div>`);
    const flash = add(R, `<div class="abs" style="inset:0;background:radial-gradient(circle at 50% 50%,rgba(230,244,255,.9),rgba(34,211,238,.35) 40%,rgba(34,211,238,0) 70%)"></div>`);
    const headUp = put(R, 40, 382, 1000, `<div class="pillx" style="font-size:44px">${arrowU(42, '#fff')} ขนาดเพิ่มขึ้นเรื่อย ๆ</div>`);
    const exNote = put(R, 40, 458, 1000, `<div class="th-t" style="font-size:30px;color:var(--lb)">* ไอคอนเป็นตัวอย่างประกอบ ขนาดไฟล์จริงแตกต่างกันได้</div>`, { crit: false });
    const headRem = put(R, 40, 382, 1000, `<div class="pillx yl" style="font-size:44px">จำลำดับนี้ให้แม่น!</div>`);
    const notyet = put(R, 40, 380, 1000, `<div class="pillx yl" style="font-size:50px">แต่ยังไม่หมด! ${arrowU(46, '#142B53')}</div>`);
    const headBig = put(R, 40, 382, 1000, `<div class="pillx" style="font-size:44px">${arrowU(42, '#fff')} ข้อมูลขนาดมหาศาล</div>`);
    const topQ = put(R, 40, 382, 1000, `<div class="pillx dark" style="font-size:48px">สูงสุดแล้วหรือยัง?</div>`);
    // ×1,000 interlude card
    const dimT = add(R, `<div class="abs" style="inset:0;background:rgba(11,26,54,.72)"></div>`);
    const card = add(R, `<div class="abs gcard" style="left:150px;top:392px;width:780px;height:1010px"></div>`);
    const cTitle = put(R, 150, 420, 780, `<div class="th-t" style="font-size:44px;font-weight:800">คำนำหน้าหน่วย<span style="color:var(--cy)">ระบบฐานสิบ (SI)</span></div>`);
    const ROWS = [['kB', 'B'], ['MB', 'kB'], ['GB', 'MB'], ['TB', 'GB'], null, ['YB', 'ZB']];
    const cRows = ROWS.map((r, i) => put(R, 150, 512 + i * 82, 780, r ? `<div style="font-weight:800;font-size:52px;color:#fff;white-space:nowrap">1 ${r[0]} = <span style="color:var(--yl)">1,000</span> ${r[1]}</div>` : `<div style="display:flex;flex-direction:column;gap:8px">${[0, 1, 2].map(() => '<div style="width:12px;height:12px;border-radius:50%;background:#95BFEF"></div>').join('')}</div>`));
    const cBig = put(R, 150, 1018, 780, `<div class="pillx yl" style="font-size:58px;font-weight:800">แต่ละขั้น × 1,000</div>`);
    const cNote = put(R, 150, 1150, 780, `<div style="border-radius:28px;border:3px dashed rgba(149,191,239,.8);padding:16px 26px;text-align:center"><div style="font-weight:700;font-size:32px;white-space:nowrap">bit ${arrowR(28)} nibble ${arrowR(28)} Byte <span style="color:var(--rd)">ไม่ใช่</span> × 1,000</div><div style="font-weight:600;font-size:28px;color:var(--lb);white-space:nowrap">(4 bits = 1 nibble · 8 bits = 1 Byte)</div></div>`);
    // 2022 reveal header
    const y2022 = put(R, 40, 382, 1000, `<div class="big-t" style="font-size:100px;color:var(--yl);text-shadow:0 0 30px rgba(255,210,63,.6),0 6px 0 rgba(6,16,40,.7)">2022</div>`);
    const newSI = put(R, 40, 500, 1000, `<div class="pillx" style="font-size:36px;letter-spacing:1px">NEW SI PREFIXES · +2 ระดับ</div>`);
    const pRon = put(R, 240, 500, 300, `<div class="pillx yl" style="font-size:36px;padding:12px 26px">RONNA · R</div>`);
    const pQue = put(R, 540, 500, 300, `<div class="pillx yl" style="font-size:36px;padding:12px 26px">QUETTA · Q</div>`);
    // shuffle cards
    const SH = ['ZB', 'YB', 'RB', 'QB'];
    const SLOTS = [[390, 790], [690, 790], [390, 1060], [690, 1060]];
    const PERM = [[3, 0, 2, 1], [2, 1, 3, 0], [1, 3, 0, 2]];         // slot index of each card in 3 shuffles
    const shc = SH.map(s => add(R, `<div class="abs c" data-crit="1" style="left:0;top:0;width:260px;height:200px"><div class="gcard" style="width:260px;height:200px;display:grid;place-items:center;font-weight:800;font-size:116px;color:#fff;line-height:1"><span class="glowt">${s}</span></div></div>`));
    const shH1 = put(R, 40, 392, 1000, `<div class="th-t glowt" style="font-size:52px;font-weight:800">ถ้าเอามาเรียงลำดับ…</div>`);
    const shH2 = put(R, 40, 392, 1000, `<div class="th-t glowt" style="font-size:56px;font-weight:800">ใครอยู่<span style="color:var(--cy)">ก่อน</span>? ใครอยู่<span style="color:var(--yl)">หลัง</span>?</div>`);
    const shGo = put(R, 40, 1290, 1000, `<div class="pillx yl" style="font-size:52px">ลองทำข้อสอบกัน!</div>`);

    const REV = [T_IN, T_IN, T_IN, bk('kB'), bk('MB'), bk('GB'), bk('TB'), bx('PB'), bx('EB'), bx('ZB'), bx('YB'), bx('ronna'), bx('quetta')];
    const GHOST = [1e9, 1e9, 1e9, 1e9, 1e9, 1e9, 1e9, bk('notyet'), bk('notyet'), 1e9, 1e9, bx('interest'), bx('interest')];
    const REC = B.know.r.map(x => K + x);
    const IL0 = bx('dec') - .1, IL1 = bx('interest') - .1;          // ×1,000 interlude
    const SH0 = bx('sort') - .1;                                    // shuffle
    const KF = [
      [T_IN, 2, 1, 1060], [bk('kB') - .6, 2, 1, 1060], [bk('kB') + .05, 3, 1, 1060], [bk('MB') - .45, 3, 1, 1060], [bk('MB') + .05, 4, 1, 1060],
      [bk('GB') - .45, 4, 1, 1060], [bk('GB') + .05, 5, 1, 1060], [bk('TB') - .45, 5, 1, 1060], [bk('TB') + .05, 6, 1, 1060],
      [bk('rem') - .3, 6, 1, 1060], [bk('rem') + .6, 3, .3, 960], [bk('notyet') - .2, 3, .3, 960], [bk('notyet') + .7, 7, .62, 1000],
      [bx('next') + .1, 7, .62, 1000], [bx('next') + .9, 6, 1, 1060], [bx('PB') - .55, 6, 1, 1060], [bx('PB') + .05, 7, 1, 1060],
      [bx('EB') - .5, 7, 1, 1060], [bx('EB') + .05, 8, 1, 1060], [bx('ZB') - .5, 8, 1, 1060], [bx('ZB') + .05, 9, 1, 1060],
      [bx('YB') - .45, 9, 1, 1060], [bx('YB') + .1, 10, 1, 1060], [IL0, 10, 1.08, 1060], [IL0 + .9, 6.5, .3, 960], [IL1, 7.5, .3, 960],
      [IL1 + .9, 11.5, .72, 1060], [bx('quetta') + .4, 11.5, .72, 1060], [SH0, 11.7, .76, 1060],
    ];
    // sfx
    sfx('rise', bk('then') - .1, .6);
    ['kB', 'MB', 'GB', 'TB'].forEach(k => { sfx('whoosh', bk(k) - .45, .5); sfx('blip', bk(k), .9); });
    REC.forEach(x => sfx('blip', x, .55)); sfx('rise', bk('notyet'), .8);
    sfx('rise', bx('PB') - .55, .6); sfx('blip', bx('PB'), .9); sfx('rise', bx('EB') - .5, .6); sfx('blip', bx('EB'), .9);
    sfx('rise', bx('ZB') - .5, .7); sfx('boom', bx('ZB'), .7); sfx('rise', bx('YB') - .45, .7); sfx('reveal', bx('YB'), .8);
    sfx('whoosh', IL0, .5); ROWS.forEach((r, i) => r && sfx('pop', bx('dec') + .3 + i * .3, .45)); sfx('stamp', bx('x1000'), .7); sfx('pop', bx('x1000') + 1.4, .5);
    sfx('whoosh', IL1, .6); sfx('boom', bx('y2022'), .8); sfx('sparkle', bx('approved') + .3, .8);
    sfx('reveal', bx('ronna'), 1); sfx('reveal', bx('quetta'), 1); sfx('boom', bx('quetta') + .05, .6);
    sfx('whoosh', SH0 + .1, .6); sfx('whoosh', bx('first') - .2, .5); sfx('whoosh', bx('last') - .2, .5); sfx('pop', bx('test'), .7);
    mark('tower_in', T_IN);

    const actIdx = t => {           // which level is "active" during the recap
      let k = -1; REC.forEach((x, i) => { if (t >= x - .05) k = i; }); return k;
    };
    sc.draw = t => {
      const u = t - T_IN;
      R.style.opacity = clamp((t - T_IN) / .5);
      const cam = TOWER.camera(KF, t);
      window.CAMY = cam.f * 460 * cam.z;
      const inRecap = t >= bk('rem') && t < bk('notyet') + .2;
      const ra = actIdx(t);
      const il = win(t, IL0, IL1, .5, .5);
      const shOn = clamp((t - SH0) / .5);
      // backdrop for massive data (phase C)
      const skyO = clamp((cam.f - 6.4) / 1) * (1 - il * .7);
      sky.style.opacity = skyO * .9; sky.style.transform = `translateY(${(cam.f - 7) * 40}px)`;
      if (skyO > 0) skyL.forEach((s, j) => s.setAttribute('opacity', (Math.sin(t * 5 + j * 2.1) > .2 ? .8 : .25)));
      twWrap.style.opacity = 1 - shOn * .85;
      tw.draw(t, cam, i => {
        const rv = REV[i], gh = GHOST[i];
        if (t < rv && t < gh) return { o: 0 };
        const shown = t >= rv;
        const hidden = shown ? 1 - P(t, rv, .35) : 1;
        let act = clamp(1 - Math.abs(cam.f - i));
        let scale = 1, lab = 1;
        if (inRecap) { act = i === ra ? 1 : (i <= 6 ? .15 : 0); scale = i === ra ? 1.9 : 1.5; }
        if (t >= IL1 && t < SH0 + .2) { act = i >= 11 ? (t >= rv ? 1 : 0) : i === 10 ? .3 : 0; lab = i === 10 ? .5 : 1; }
        if (il > 0) act *= 1 - il * .5;
        const pi = P(t, rv, .55);
        return { o: shown ? clamp((t - rv) / .25 + (gh < rv ? 1 : 0)) : clamp((t - gh) / .4) * .9, act, hidden, lab, scale: scale * lerp(.5, 1, E.back(pi)), dy: (1 - E.out(pi)) * 60, chev: i < 11 && t >= REV[i + 1] && !inRecap ? .8 : 0 };
      });
      // reveal burst on the newest platform
      let last = -1; REV.forEach((r, i) => { if (i > 2 && t >= r && t < r + .9) last = i; });
      if (last >= 0) {
        const p = (t - REV[last]) / .9, y = tw.screenY(last, cam);
        tf(burst, { x: 540 - 350, y: y - 120, s: lerp(.4, 1.6, E.out(p)) * cam.z, o: 1 - p });
      } else tf(burst, { o: 0 });
      const fl = [bx('ZB'), bx('y2022'), bx('ronna'), bx('quetta')].reduce((m, x) => Math.max(m, t >= x ? Math.max(0, 1 - (t - x) / .5) : 0), 0);
      flash.style.opacity = fl * .7;
      // headers
      pop(headUp, t, bk('then') + .1, bk('rem') - .3, { from: .6, dy: 20 });
      exNote.style.opacity = win(t, bk('kB'), bk('rem') - .3, .4) * .9;
      pop(headRem, t, bk('rem') + .75, bk('notyet') - .1, { from: .5, dy: 20 });
      pop(notyet, t, bk('notyet'), bx('next') + .6, { from: .4, dy: 20, el: true });
      pop(headBig, t, bx('PB'), bx('YB') - .1, { from: .6, dy: 20 });
      pop(topQ, t, bx('YB') + .4, IL0, { from: .5, dy: 20 });
      // ×1,000 interlude
      dimT.style.opacity = il;
      tf(card, { o: il, s: lerp(.9, 1, E.back(P(t, IL0, .5))) });
      pop(cTitle, t, IL0 + .2, IL1 - .3, { from: .6, dy: 20 });
      cRows.forEach((el, i) => pop(el, t, bx('dec') + .3 + i * .3, IL1 - .3, { from: .5, dy: 20 }));
      pop(cBig, t, bx('x1000'), IL1 - .3, { from: .3, dy: 30, el: true });
      pop(cNote, t, bx('x1000') + 1.4, IL1 - .3, { from: .5, dy: 20 });
      // 2022 + new prefixes
      pop(y2022, t, bx('y2022') - .05, SH0, { from: .3, dy: 40, el: true });
      pop(newSI, t, bx('approved'), bx('ronna') - .1, { from: .5, dy: 20 });
      pop(pRon, t, bx('ronna'), SH0, { from: .4, dy: 20, el: true });
      pop(pQue, t, bx('quetta'), SH0, { from: .4, dy: 20, el: true });
      // shuffle
      const sw = [bx('first') - .25, bx('last') - .25];
      shc.forEach((el, c) => {
        let ph = 0; if (t >= sw[0]) ph = 1; if (t >= sw[1]) ph = 2;
        const from = ph === 0 ? PERM[0][c] : PERM[ph - 1][c], to = PERM[ph][c];
        const k = ph === 0 ? 1 : E.inOut(P(t, sw[ph - 1], .45));
        const x = lerp(SLOTS[from][0], SLOTS[to][0], k), y = lerp(SLOTS[from][1], SLOTS[to][1], k);
        const l = life(t, SH0 + .2 + c * .1, 1e9, { from: .3, dy: 60, el: true });
        const away = E.in(P(t, bx('test') + .5, .6));
        tf(el, { x: x - 130, y: y - 100 + l.y + bob(t, c, 6) - away * 1400, s: l.s * (1 + .08 * Math.sin(Math.PI * (k < 1 ? k : 0))), o: l.o * (1 - clamp(away * 3)), r: Math.sin(t * 1.4 + c) * 3 });
      });
      pop(shH1, t, SH0 + .1, bx('first') - .1, { from: .6, dy: 20 });
      pop(shH2, t, bx('first'), 1e9, { from: .5, dy: 20, el: true });
      pop(shGo, t, bx('test'), 1e9, { from: .4, dy: 30, el: true });
    };
    scenes.push(sc);
  }

  // =====================================================================
  // SCENE 05 + 06 — OFFICIAL QUIZ + EXACT 5 s COUNTDOWN (+ reveal on the same layout)
  // =====================================================================
  const QZ_END = ba('kai') + .75;
  {
    const sc = scene('s-quiz', Q, QZ_END + .4); const R = sc.el;
    const intro = put(R, 40, 520, 1000, `<div class="big-t glowt" style="font-size:72px">มาทดสอบ<br><span style="color:var(--cy)">ความรู้กัน!</span></div>`);
    const mas = add(R, `<div class="abs c" style="left:${540 - 200}px;top:820px;width:400px;transform-origin:50% 100%"><img src="${NSP.BASE}brand/mascot_presenter.png" style="width:330px;display:block;margin:0 auto;filter:drop-shadow(0 18px 24px rgba(0,0,0,.45))"></div>`);
    const qcard = add(R, `<div class="abs c gcard" style="left:170px;top:360px;width:740px;height:196px;display:flex;align-items:center;justify-content:center;padding:0 36px">
      <div class="abs" style="left:50%;top:-30px;translate:-50% 0"><div class="pillx yl" style="font-size:30px;padding:6px 24px">ข้อสอบนายสิบ · คอมพิวเตอร์</div></div>
      <div class="th-t" data-crit="1" style="font-size:44px;font-weight:700;color:#fff">ข้อใดเรียงหน่วยข้อมูล<br>จากขนาด<span style="color:var(--cy)">เล็ก</span>ไป<span style="color:var(--yl)">ใหญ่</span>ได้ถูกต้อง?</div></div>`);
    const opts = QZ.options.map(([b, toks], i) => {
      const el = add(R, `<div class="qopt c" style="top:${590 + i * 138}px"><div class="qb" data-crit="1">${b}</div><div class="qt" data-crit="1">${toks.map((s, k) => `${k ? `<span class="ar">${arrowR(40)}</span>` : ''}<span class="tk">${s}</span>`).join('')}</div><div class="ok">${ICON.check('#22C55E', 56)}</div></div>`);
      return { el, tks: [...el.querySelectorAll('.tk')], ars: [...el.querySelectorAll('.ar')], qb: el.querySelector('.qb'), ok: el.querySelector('.ok') };
    });
    const think = put(R, 40, 1236, 1000, `<div class="pillx dark" style="font-size:38px">${ICON.timer(42, '#22D3EE')} ลองคิดให้ดี · ให้เวลา 5 วินาที</div>`);
    // countdown (blue/cyan, neutral — gives no hint)
    const CS = 270, cr = CS * .4, Cc = 2 * Math.PI * cr;
    const cd = add(R, `<div class="abs c" data-crit="1" style="left:${540 - CS / 2}px;top:${1268 - CS / 2}px;width:${CS}px;height:${CS}px">
      <svg width="${CS}" height="${CS}" viewBox="0 0 ${CS} ${CS}" style="position:absolute;inset:0"><circle cx="${CS / 2}" cy="${CS / 2}" r="${CS * .47}" fill="#0F2A5C" stroke="rgba(149,191,239,.5)" stroke-width="3"/>
      <circle cx="${CS / 2}" cy="${CS / 2}" r="${cr}" fill="none" stroke="rgba(47,107,255,.35)" stroke-width="18"/>
      <circle class="ring" cx="${CS / 2}" cy="${CS / 2}" r="${cr}" fill="none" stroke="#22D3EE" stroke-width="18" stroke-linecap="round" stroke-dasharray="${Cc}" transform="rotate(-90 ${CS / 2} ${CS / 2})" style="filter:drop-shadow(0 0 10px #22D3EE)"/>
      ${[...Array(12)].map((_, k) => `<rect x="${CS / 2 - 3}" y="${CS * .02}" width="6" height="14" rx="3" fill="rgba(230,244,255,.6)" transform="rotate(${k * 30} ${CS / 2} ${CS / 2})"/>`).join('')}</svg>
      <div class="num" style="position:absolute;inset:0;display:grid;place-items:center;font-weight:800;font-size:150px;color:#fff;line-height:1;padding-top:8px;text-shadow:0 0 24px rgba(34,211,238,.8)">5</div></div>`);
    const cdRing = cd.querySelector('.ring'), cdNum = cd.querySelector('.num');
    const sol = put(R, 40, 1236, 1000, `<div class="pillx gr" style="font-size:60px;font-weight:800">เฉลย!</div>`);
    const conf = add(R, `<div class="abs" style="inset:0"></div>`);
    const cfs = NSP.buildConfetti(conf, 60, 540, 1000);
    cfs.forEach((c, i) => c.el.style.background = ['#22D3EE', '#2F6BFF', '#22C55E', '#95BFEF', '#E6F4FF', '#FFD23F'][i % 6]);

    sfx('pop', Q + .1, .7); sfx('whoosh', bq('q') - .1, .6); sfx('pop', bq('q') + .1, .8);
    B.quiz.opt.forEach((x, i) => { sfx('whoosh', Q + x - .1, .4); sfx('pop', Q + x + .05, .6); B.quiz.tok[i].forEach(y => sfx('bit', Q + y, .5)); });
    sfx('ding', bq('five') + .2, .4);
    for (let i = 0; i < 5; i++) sfx(i === 4 ? 'tick2' : 'tick', CD + i, 1);
    sfx('stamp', ba('sol'), .7); sfx('success', ba('ko'), 1); sfx('sparkle', ba('ko') + .2, .9);
    mark('cd_start', CD); mark('reveal', ba('ko'));

    sc.draw = t => {
      const u = t - Q;
      pop(intro, t, Q + .05, bq('q') - .25, { from: .5, dy: 30, el: true });
      const mi = life(t, Q + .15, bq('q') - .2, { from: .3, dy: 200 });
      tf(mas, { ...mi, y: mi.y + bob(u, 0, 6) });
      pop(qcard, t, bq('q'), 1e9, { from: .6, dy: 40 });
      const revealed = t >= ba('ko');
      opts.forEach((o, i) => {
        const a0 = Q + B.quiz.opt[i];
        const l = life(t, a0, 1e9, { from: .8, dy: 30, d: .5 });
        const xIn = 0;
        o.tks.forEach((tk, k) => { const tl = life(t, Q + B.quiz.tok[i][k], 1e9, { from: .2, dy: 20, d: .4, el: true }); tf(tk, { s: tl.s, o: Math.max(tl.o, 0), y: tl.y }); });
        o.ars.forEach((ar, k) => { ar.style.opacity = clamp((t - Q - B.quiz.tok[i][k + 1] + .15) / .2); });
        if (revealed && i === QZ.correct) {
          const ua = t - ba('ko');
          o.el.setAttribute('data-reveal', '1');
          o.el.style.background = 'linear-gradient(180deg,#22C55E,#15803D)';
          o.el.style.borderColor = '#BBF7D0';
          o.el.style.boxShadow = `0 10px 0 #0E5A2C, 0 0 ${40 + 14 * Math.sin(ua * 3)}px rgba(34,197,94,.75)`;
          o.qb.style.background = '#fff';
          tf(o.ok, { s: lerp(0, 1, E.elastic(P(ua, .1, .8))), o: clamp(ua / .1) });
          tf(o.el, { s: l.s * (1 + .03 * E.back(P(ua, 0, .5)) - .02 * P(ua, .5, .4)), o: 1 });
          o.el.style.filter = '';
        } else {
          o.el.removeAttribute('data-reveal');
          o.el.style.background = ''; o.el.style.borderColor = ''; o.el.style.boxShadow = ''; o.qb.style.background = '';
          tf(o.ok, { o: 0 });
          const dim = revealed ? .55 * E.out(P(t, ba('ko'), .45)) : 0;
          tf(o.el, { x: xIn, s: l.s * (1 - .04 * dim), o: l.o * (1 - dim) });
          o.el.style.filter = revealed ? `grayscale(${dim})` : '';
        }
      });
      pop(think, t, bq('think'), CD - .5, { from: .5, dy: 20 });
      // exact frame-based countdown: frame k (0..149) of the countdown shows 5 - floor(k / 30)
      const k = Math.round((t - CD) * FPS), NF = Math.round(CDD * FPS);
      const cl = life(t, CD - .25, A + .05, { from: .4, dy: 30, d: .25, out: .25 });
      if (k >= 0 && k < NF) {
        const n = 5 - Math.floor(k / FPS), fr = (k % FPS) / FPS;
        cdNum.textContent = n; cd.setAttribute('data-n', n);
        cdNum.style.transform = `scale(${lerp(1.4, 1, E.back(clamp(fr / .35)))})`;
        cdRing.setAttribute('stroke-dashoffset', (Cc * k / NF).toFixed(2));
        tf(cd, { ...cl, s: cl.s * (1 + .05 * Math.max(0, 1 - fr / .25)) });
      } else {
        cd.removeAttribute('data-n');
        if (k < 0) { cdNum.textContent = 5; cdRing.setAttribute('stroke-dashoffset', 0); }
        else { cdRing.setAttribute('stroke-dashoffset', Cc.toFixed(2)); }
        tf(cd, cl);
      }
      pop(sol, t, ba('sol'), 1e9, { from: .3, dy: 30, el: true });
      NSP.drawConfetti(cfs, t, ba('ko') + .05, 2.4);
      R.style.opacity = 1 - P(t, QZ_END, .4);
    };
    scenes.push(sc);
  }

  // =====================================================================
  // SCENE 07 — ANSWER: ZB → YB → RB → QB, ×1,000 steps, QUETTA, full ladder, bit ≠ Byte
  // =====================================================================
  {
    const A_IN = QZ_END - .05;
    const sc = scene('s-ans', A_IN, PR); const R = sc.el;
    const ansHead = put(R, 40, 382, 1000, `<div class="pillx gr" style="font-size:40px;font-weight:800">ข้อ ก. ZB ${arrowR(34, '#fff')} YB ${arrowR(34, '#fff')} RB ${arrowR(34, '#fff')} QB</div>`);
    const RW = ['ZB', 'YB', 'RB', 'QB'];
    const rowY = i => 1250 - i * 236;
    const rows = RW.map((k, i) => { const un = unit(k); return add(R, `<div class="abs c gcard" style="left:200px;top:${rowY(i)}px;width:680px;height:150px;display:flex;align-items:center;gap:26px;padding:0 34px">
      <div data-crit="1" style="width:190px;font-weight:800;font-size:100px;line-height:1;color:#fff" class="glowt">${k}</div>
      <div data-crit="1" style="display:flex;flex-direction:column;gap:2px"><div style="font-weight:700;font-size:34px;color:var(--lb);white-space:nowrap">${un.en} · ${un.th}</div><div style="font-weight:800;font-size:50px;color:var(--yl);white-space:nowrap">= ${sup(un.exp)} Bytes</div></div></div>`); });
    const steps = [0, 1, 2].map(i => put(R, 40, rowY(i) - 76, 1000, `<div class="pillx yl" style="font-size:36px;padding:8px 28px">${arrowU(34, '#142B53')} ${RW[i]} × 1,000 = ${RW[i + 1]}</div>`));
    const chevs = [0, 1, 2].map(i => add(R, `<div class="abs" style="left:${540 - 26}px;top:${rowY(i) - 66}px">${arrowU(52)}</div>`));
    // QUETTA card
    const qc = add(R, `<div class="abs gcard" style="left:130px;top:420px;width:820px;height:960px"></div>`);
    const qc1 = put(R, 130, 470, 820, `<div class="pillx yl" style="font-size:38px">คำนำหน้า SI ใหม่ (2022)</div>`);
    const qc2 = put(R, 130, 580, 820, `<div class="big-t glowt" style="font-size:84px">QUETTA = ${sup(30)}</div>`);
    const qc3 = put(R, 130, 730, 820, `<div class="big-t" style="font-size:84px;color:var(--yl)">QB = ${sup(30)} B</div>`);
    const qc4 = put(R, 130, 880, 820, `<div class="th-t" style="font-size:46px;color:#fff">คำนำหน้า SI ขนาดใหญ่ที่สุด<br><span style="color:var(--cy)">ที่รับรองในปัจจุบัน</span></div>`);
    const qc5 = put(R, 130, 1080, 820, `<div class="th-t" style="font-size:28px;color:var(--lb);font-weight:600">ที่มา: BIPM — CGPM ครั้งที่ 27 (2022) มติที่ 3</div>`);
    const qc6 = put(R, 130, 1150, 820, `<div style="border-radius:24px;border:3px dashed rgba(149,191,239,.7);padding:12px 22px;font-weight:600;font-size:31px;color:var(--ice);text-align:center;line-height:1.35">* เป็นหน่วยตามมาตรฐานการวัด<br>ไม่ใช่ “ขนาดไฟล์สูงสุดที่เป็นไปได้”</div>`);
    // full recap ladder (scrolling)
    const remH = put(R, 40, 382, 1000, `<div class="pillx yl" style="font-size:46px">จำไว้! เล็ก ${arrowR(42, '#142B53')} ใหญ่</div>`);
    const view = add(R, `<div class="abs" style="left:0;top:470px;width:1080px;height:930px;overflow:hidden;-webkit-mask-image:linear-gradient(180deg,transparent 0,#000 40px,#000 890px,transparent 930px)"></div>`);
    const lst = add(view, `<div class="abs" style="left:0;top:0;width:1080px;height:0"></div>`);
    const VAL = { bit: '1 b', nibble: '4 b', Byte: '8 b' };
    const LR = U.map((un, i) => add(lst, `<div class="lrow" data-crit="1" style="top:${-i * 118}px;${un.si2022 ? 'border-color:#FFD23F;box-shadow:0 0 24px rgba(255,210,63,.35)' : ''}"><div class="la" style="${un.big.length > 4 ? 'font-size:44px' : ''}">${un.big}</div><div class="ln">${un.th}</div><div class="lv">${un.exp ? sup(un.exp) + ' B' : VAL[un.k]}</div></div>`));
    const remH2 = put(R, 40, 382, 1000, `<div class="pillx" style="font-size:35px">ไม่ได้หยุดแค่ TB หรือ YB อีกต่อไป!</div>`);
    // bit ≠ Byte
    const dont = put(R, 40, 382, 1000, `<div class="pillx yl" style="font-size:48px">อย่าลืม!</div>`);
    const tBit = add(R, `<div class="abs c" data-crit="1" style="left:236px;top:560px;width:230px;height:300px"><div class="tile" style="position:relative;width:230px;height:300px;flex-direction:column;display:flex;gap:8px"><div style="font-size:150px">b</div><div style="font-size:40px;font-weight:700">bit · บิต</div></div></div>`);
    const tByte = add(R, `<div class="abs c" data-crit="1" style="left:614px;top:560px;width:230px;height:300px"><div class="tile" style="position:relative;width:230px;height:300px;flex-direction:column;display:flex;gap:8px;border-color:#FFD23F"><div style="font-size:150px">B</div><div style="font-size:40px;font-weight:700">Byte · ไบต์</div></div></div>`);
    const neqEl = add(R, `<div class="abs c" style="left:${540 - 60}px;top:650px;width:120px;height:120px">${neq(120)}</div>`);
    const neqT = put(R, 40, 920, 1000, `<div class="big-t glowt" style="font-size:66px">bit (b) ≠ Byte (B)</div>`.replace('≠', `<span style="display:inline-block;vertical-align:middle">${neq(70, '#fff')}</span>`));
    const eq8 = put(R, 40, 1050, 1000, `<div class="big-t" style="font-size:96px;color:var(--yl);text-shadow:0 0 26px rgba(255,210,63,.5)">1 B = 8 b</div>`);
    const eightB = [...Array(8)].map((_, i) => add(R, `<div class="tile c" style="left:${276 + i * 66}px;top:1220px;width:56px;height:56px;font-size:32px;border-radius:12px;border-width:3px">${[1, 0, 1, 1, 0, 1, 1, 0][i]}</div>`));

    RW.forEach(k => sfx('blip', ba(k.toLowerCase()), .9));
    sfx('lock', ba('qb') + .9, .9); sfx('pop', ba('x1'), .7); sfx('pop', ba('x2'), .7); sfx('pop', ba('x3'), .7);
    sfx('whoosh', ba('quetta') - .2, .6); sfx('reveal', ba('quetta'), .9); sfx('sparkle', ba('largest') + .8, .7);
    sfx('whoosh', ba('remember') - .1, .6); sfx('rise', ba('notonly') + .2, .7); sfx('pop', ba('dont'), .6);
    sfx('pop', ba('bit'), .8); sfx('pop', ba('byte'), .8); sfx('stamp', ba('byte') + .45, .8); for (let i = 0; i < 8; i++) sfx('bit', ba('diff') + .25 + i * .06, .5);

    const RW_END = ba('quetta') - .2;
    sc.draw = t => {
      const u = t - A_IN;
      R.style.opacity = clamp((t - A_IN) / .35);
      pop(ansHead, t, A_IN + .1, RW_END, { from: .5, dy: 20 });
      rows.forEach((el, i) => {
        const a0 = ba(RW[i].toLowerCase());
        const lk = E.back(P(t, ba('qb') + .9, .4));
        const l = life(t, a0, RW_END, { from: .4, dy: 80, d: .5 });
        tf(el, { ...l, s: l.s * (1 + .04 * Math.sin(Math.PI * clamp(lk))) });
        el.style.borderColor = t >= ba('qb') + .9 ? '#22D3EE' : '';
      });
      chevs.forEach((el, i) => { const o = P(t, ba('qb') + .9 + i * .08, .3) * (1 - P(t, [ba('x1'), ba('x2'), ba('x3')][i] - .1, .2)) * (1 - P(t, RW_END, .3)); tf(el, { o, y: bob(t, i, 5, 4) }); });
      steps.forEach((el, i) => pop(el, t, [ba('x1'), ba('x2'), ba('x3')][i], RW_END, { from: .3, dy: 20, el: true }));
      // QUETTA card
      const qOn = win(t, ba('quetta'), ba('remember') - .2, .45);
      tf(qc, { o: qOn, s: lerp(.92, 1, E.back(P(t, ba('quetta'), .5))) });
      pop(qc1, t, ba('quetta') + .1, ba('remember') - .25, { from: .5, dy: 20 });
      pop(qc2, t, ba('quetta') + .3, ba('remember') - .25, { from: .3, dy: 40, el: true });
      pop(qc3, t, ba('largest') + .2, ba('remember') - .25, { from: .4, dy: 30 });
      pop(qc4, t, ba('largest') + 1.0, ba('remember') - .25, { from: .5, dy: 20 });
      pop(qc5, t, ba('largest') + 2.0, ba('remember') - .25, { from: .6, dy: 10 });
      pop(qc6, t, ba('largest') + 2.4, ba('remember') - .25, { from: .6, dy: 10 });
      // ladder
      const lOn = win(t, ba('remember'), ba('dont') - .1, .4);
      view.style.opacity = lOn; view.style.visibility = lOn > 0 ? 'visible' : 'hidden';
      pop(remH, t, ba('remember'), ba('notonly') + .5, { from: .5, dy: 20 });
      pop(remH2, t, ba('notonly') + .5, ba('dont') - .1, { from: .5, dy: 20 });
      const sc_ = E.inOut(P(t, ba('notonly'), ba('dont') - ba('notonly') - .6));
      lst.style.transform = `translateY(${lerp(820, 820 + 12 * 118 - 740, sc_)}px)`;
      LR.forEach((el, i) => {
        const l = life(t, ba('remember') + .05 * i, 1e9, { from: .92, dy: 30 });
        const warn = (i === 6 || i === 10) && t > ba('notonly') + .5 ? .5 + .5 * Math.sin((t - ba('notonly')) * 7) : 0;
        tf(el, { ...l, y: l.y });
        el.style.borderColor = i === 12 ? '#FFD23F' : warn ? `rgba(239,68,68,${.5 + .5 * warn})` : '';
        el.style.boxShadow = warn ? `0 0 ${20 + 16 * warn}px rgba(239,68,68,.45)` : '';
      });
      // bit ≠ Byte
      pop(dont, t, ba('dont'), 1e9, { from: .4, dy: 20, el: true });
      pop(tBit, t, ba('bit'), 1e9, { from: .3, dy: 40 });
      pop(tByte, t, ba('byte'), 1e9, { from: .3, dy: 40 });
      pop(neqEl, t, ba('byte') + .45, 1e9, { from: .2, dy: 0, el: true });
      pop(neqT, t, ba('byte') + .5, 1e9, { from: .5, dy: 20 });
      pop(eq8, t, ba('diff'), 1e9, { from: .3, dy: 30, el: true });
      eightB.forEach((el, i) => pop(el, t, ba('diff') + .25 + i * .06, 1e9, { from: .2, dy: 20, el: true }));
    };
    scenes.push(sc);
  }

  // =====================================================================
  // SCENE 08 — NAISIBPRO PROMOTIONAL ENDING (blue)
  // =====================================================================
  {
    const sc = scene('s-promo', PR, END + 1); const R = sc.el;
    const who = put(R, 40, 382, 1000, `<div class="big-t glowt" style="font-size:58px">คุณตอบถูก<span style="color:var(--yl)">ข้อ ก.</span> ไหม?</div>`);
    const mini = put(R, 40, 500, 1000, `<div class="pillx gr" style="font-size:44px;font-weight:800">ก. ZB ${arrowR(36, '#fff')} YB ${arrowR(36, '#fff')} RB ${arrowR(36, '#fff')} QB</div>`);
    const CM = [['#2F6BFF', 'ตอบข้อ ก. ครับ!'], ['#22D3EE', 'QB ใหญ่สุดจริงด้วย'], ['#EE7FAA', 'เพิ่งรู้จัก Ronna เลย']];
    const cms = CM.map(([c, s], i) => put(R, 40, 690 + i * 140, 1000, `<div class="cmt"><div class="av" style="background:${c}"></div>${s}</div>`));
    const cmH = put(R, 40, 1150, 1000, `<div class="pillx" style="font-size:40px">${ICON.heart('#fff')} คอมเมนต์มาบอกกันหน่อย!</div>`);
    const bef = put(R, 40, 382, 1000, `<div class="th-t glowt" style="font-size:52px;font-weight:800">ก่อนดูคลิปนี้…</div>`);
    const kq = put(R, 40, 382, 1000, `<div class="big-t glowt" style="font-size:50px">เคยรู้จัก <span style="color:var(--yl)">Quettabyte</span> ไหม?</div>`);
    const hex = add(R, `<div class="abs c" data-crit="1" style="left:${540 - 210}px;top:560px;width:420px;height:440px"><svg width="420" height="440" viewBox="0 0 420 440" style="position:absolute;inset:0"><path d="M210 10l185 105v210L210 430 25 325V115z" fill="url(#hx)" stroke="#22D3EE" stroke-width="8" style="filter:drop-shadow(0 0 30px #22D3EE)"/><defs><linearGradient id="hx" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#4583FF"/><stop offset="1" stop-color="#142B53"/></linearGradient></defs></svg>
      <div style="position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center"><div style="font-weight:800;font-size:150px;line-height:1;color:#fff" class="glowt">QB</div><div style="font-weight:800;font-size:46px;color:var(--yl)">${sup(30)} B</div></div></div>`);
    const yn = put(R, 40, 1080, 1000, `<div style="display:flex;gap:30px"><div class="pillx" style="font-size:46px">เคย</div><div class="pillx dark" style="font-size:46px">ไม่เคย</div></div>`);
    const want = put(R, 40, 382, 1000, `<div class="th-t glowt" style="font-size:46px;font-weight:800">อยากฝึกข้อสอบ<span style="color:var(--cy)">คอมพิวเตอร์</span><br>อีกเยอะ ๆ?</div>`);
    const logo = add(R, `<div class="abs c" style="left:${540 - 230}px;top:540px;width:460px"><img src="${NSP.BASE}brand/logo.png" style="width:460px;display:block;filter:drop-shadow(0 0 40px rgba(34,211,238,.45))"></div>`);
    const word = put(R, 40, 1040, 1000, `<div style="font-weight:800;font-size:120px;line-height:1.1;background:linear-gradient(90deg,#95BFEF,#22D3EE 45%,#2F6BFF);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 6px 0 rgba(6,16,40,.6))">NaiSibPro</div>`);
    const wordTh = put(R, 40, 1180, 1000, `<div class="pillx" style="font-size:50px">มาฝึกกับ นายสิบโปร!</div>`);
    const n10k = put(R, 40, 720, 1000, `<div class="big-t" style="font-size:128px;color:var(--yl);text-shadow:0 0 30px rgba(255,210,63,.5),0 6px 0 rgba(6,16,40,.6)"><span class="cnt">10,000</span>+</div>`);
    const cnt = n10k.querySelector('.cnt');
    const bankT = put(R, 40, 905, 1000, `<div class="pillx dark" style="font-size:40px">${ICON.docs(46, '#22D3EE')} รวมข้อสอบมากกว่าหมื่นข้อ</div>`);
    const weekly = put(R, 40, 1035, 1000, `<div class="pillx" style="font-size:42px">${ICON.cal(46, '#fff')} อัปเดตทุกสัปดาห์</div>`);
    const lsf = put(R, 40, 820, 1000, `<div class="big-t glowt" style="font-size:52px">LIKE · SHARE · FOLLOW</div>`);
    const BTN = [['LIKE', `<svg width="70" height="70" viewBox="0 0 24 24"><path d="M2 10h4v11H2zM8 21h9.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 19 10h-5l.8-4.2A2 2 0 0 0 12.8 3.4L8 9z" fill="#fff"/></svg>`],
      ['SHARE', `<svg width="70" height="70" viewBox="0 0 24 24"><path d="M14 4l7 7-7 7v-4c-5 0-8 1.5-11 5 1-5 4-10 11-11z" fill="#fff"/></svg>`],
      ['FOLLOW', `<svg width="70" height="70" viewBox="0 0 24 24"><circle cx="10" cy="8" r="4" fill="#fff"/><path d="M2 21c0-4.4 3.6-7 8-7s8 2.6 8 7z" fill="#fff"/><path d="M19 6v6M16 9h6" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`]];
    const btns = BTN.map(([s, ic], i) => add(R, `<div class="abs c" data-crit="1" style="left:${330 + i * 210 - 95}px;top:960px;width:190px;height:200px;border-radius:40px;background:linear-gradient(180deg,#4583FF,#1E4FD0);border:4px solid #22D3EE;box-shadow:0 0 30px rgba(34,211,238,.45);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">${ic}<div style="font-weight:800;font-size:36px;color:#fff">${s}</div></div>`));
    const cur = add(R, `<div class="abs" style="left:0;top:0;width:110px;height:110px">${ICON.hand(110)}</div>`);
    const endBg = add(R, `<div class="abs" style="inset:0;background:radial-gradient(ellipse at 50% 45%,#1E4688,#0B1A36 75%)"></div>`);
    const eLogo = add(R, `<div class="abs c" style="left:${540 - 220}px;top:390px;width:440px"><img src="${NSP.BASE}brand/logo.png" style="width:440px;display:block;filter:drop-shadow(0 0 40px rgba(34,211,238,.45))"></div>`);
    const eTxt = put(R, 40, 1000, 1000, `<div class="big-t glowt" style="font-size:60px">แล้วเจอกัน<span style="color:var(--cy)">ข้อถัดไป!</span></div>`);
    const eTag = put(R, 40, 1125, 1000, `<div class="pillx" style="font-size:42px">NaiSibPro นายสิบโปร</div>`);
    const eConf = add(R, `<div class="abs" style="inset:0"></div>`);
    const ecf = NSP.buildConfetti(eConf, 50, 540, 700);
    ecf.forEach((c, i) => c.el.style.background = ['#22D3EE', '#2F6BFF', '#95BFEF', '#E6F4FF', '#FFD23F'][i % 5]);

    sfx('pop', bp('who'), .7); sfx('pop', bp('who') + .3, .6); CM.forEach((_, i) => sfx('msg', bp('comment') + i * .35, .9));
    sfx('whoosh', bp('before'), .5); sfx('reveal', bp('know'), .8); sfx('pop', bp('know') + 1.0, .5);
    sfx('whoosh', bp('want'), .5); sfx('riser', bp('nsp') - .8, .6); sfx('reveal', bp('nsp'), 1); sfx('sparkle', bp('nsp') + .4, .8);
    for (let i = 0; i < 6; i++) sfx('coin', bp('bank') + .2 + i * .15, .35); sfx('pop', bp('weekly'), .7);
    sfx('click', bp('like') + .25, .9); sfx('pop', bp('like') + .3, .6); sfx('click', bp('share') + .25, .9); sfx('pop', bp('share') + .3, .6); sfx('click', bp('follow') + .25, .9); sfx('pop', bp('follow') + .3, .6);
    sfx('whoosh', bp('bye') - .1, .6); sfx('ding', bp('bye') + .2, .8); sfx('sparkle', bp('bye') + .4, .8);
    mark('endcard', bp('bye'));

    sc.draw = t => {
      const u = t - PR;
      pop(who, t, bp('who'), bp('before') - .15, { from: .5, dy: 30, el: true });
      pop(mini, t, bp('who') + .3, bp('before') - .15, { from: .5, dy: 20 });
      cms.forEach((el, i) => pop(el, t, bp('comment') + i * .35, bp('before') - .15, { from: .6, dy: 40 }, { x: (1 - E.out(P(t, bp('comment') + i * .35, .45))) * (i % 2 ? 260 : -260), y: bob(u, i, 4) }));
      pop(cmH, t, bp('comment') + .1, bp('before') - .15, { from: .5, dy: 20 });
      pop(bef, t, bp('before'), bp('know') - .1, { from: .6, dy: 20 });
      pop(kq, t, bp('know'), bp('want') - .15, { from: .5, dy: 20, el: true });
      const hx = life(t, bp('before') + .2, bp('want') - .15, { from: .3, dy: 40, el: true });
      tf(hex, { ...hx, y: hx.y + bob(u, 0, 8), r: Math.sin(u * 1.2) * 3 });
      pop(yn, t, bp('know') + 1.0, bp('want') - .15, { from: .5, dy: 20 });
      pop(want, t, bp('want'), bp('bank') - .15, { from: .6, dy: 20 });
      // logo: big at nsp, then moves up for the stats
      const lg = life(t, bp('nsp') - .1, bp('like') - .15, { from: .2, dy: 160, d: .9, el: true });
      const up = E.inOut(P(t, bp('bank') - .2, .6));
      tf(logo, { ...lg, y: lg.y + bob(u, 0, 6) - up * 200, s: lg.s * lerp(1, .55, up) });
      pop(word, t, bp('nsp') + .3, bp('bank') - .15, { from: .5, dy: 30 });
      pop(wordTh, t, bp('nsp') + .5, bp('bank') - .15, { from: .5, dy: 20 });
      pop(n10k, t, bp('bank'), bp('like') - .15, { from: .4, dy: 30, el: true });
      cnt.textContent = (Math.round(10000 * E.out(P(t, bp('bank') + .1, 1.1)) / 100) * 100).toLocaleString('en-US');
      pop(bankT, t, bp('bank') + .2, bp('like') - .15, { from: .5, dy: 20 });
      pop(weekly, t, bp('weekly'), bp('like') - .15, { from: .4, dy: 20, el: true });
      pop(lsf, t, bp('like'), bp('bye') - .1, { from: .5, dy: 20 });
      const PRESS = [bp('like'), bp('share'), bp('follow')];
      btns.forEach((el, i) => {
        const l = life(t, bp('like') + i * .1, bp('bye') - .1, { from: .3, dy: 40, el: true });
        const pd = NSP.pressDepth(t, [PRESS[i] + .25]);
        tf(el, { ...l, s: l.s * (1 - .1 * pd) });
        el.style.background = t >= PRESS[i] + .25 ? 'linear-gradient(180deg,#22D3EE,#2F6BFF)' : '';
      });
      // cursor hops between the three buttons
      let cx = 900, cy = 1400, co = 0;
      if (t > bp('like') - .3 && t < bp('bye') - .1) {
        const seg = t < PRESS[1] - .2 ? 0 : t < PRESS[2] - .2 ? 1 : 2;
        const tx = 330 + seg * 210 - 20, ty = 1070;
        const k = E.inOut(P(t, (seg ? PRESS[seg] - .2 : bp('like') - .3), .4));
        const px = seg ? 330 + (seg - 1) * 210 - 20 : 900, py = seg ? 1070 : 1400;
        cx = lerp(px, tx, k); cy = lerp(py, ty, k); co = clamp((t - bp('like') + .3) / .2) * (1 - P(t, bp('bye') - .3, .2));
        cur.style.transform = `translate(${cx}px,${cy}px) scale(${1 - .15 * NSP.pressDepth(t, PRESS.map(x => x + .25))})`;
      }
      cur.style.opacity = co;
      // end card
      const ue = t - bp('bye');
      endBg.style.opacity = clamp(ue / .4); endBg.style.visibility = ue < 0 ? 'hidden' : 'visible';
      const l2 = life(ue, .1, 1e9, { from: .2, dy: 0, el: true, d: .9 });
      tf(eLogo, { ...l2, y: bob(ue, 0, 8) });
      pop(eTxt, ue, .35, 1e9, { from: .5, dy: 40 });
      pop(eTag, ue, .6, 1e9, { from: .5, dy: 30 });
      NSP.drawConfetti(ecf, t, bp('bye') + .25, 2.6);
    };
    scenes.push(sc);
  }

  // ---------- '×' glyph fix (Prompt's multiplication sign is tiny): replace with a drawn cross ----------
  (function fixTimes(root) {
    const w = document.createTreeWalker(root, NodeFilter.SHOW_TEXT); const hits = []; let n;
    while ((n = w.nextNode())) if (n.nodeValue.includes('×') && !n.parentElement.closest('svg')) hits.push(n);
    hits.forEach(n => { const sp = document.createElement('span'); sp.innerHTML = n.nodeValue.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/×/g, '<svg class="mul" viewBox="0 0 24 24" style="display:inline-block;width:.6em;height:.6em;vertical-align:.02em;margin:0 .06em"><path d="M5 5l14 14M19 5L5 19" stroke="currentColor" stroke-width="3.8" stroke-linecap="round"/></svg>'); n.replaceWith(sp); });
  })(stage);

  // ---------- start ----------
  NSP.start({ scenes, wipes: [], brand: { showAt: -1, hideAt: bp('nsp') - .3 }, ep: 'EP.43' });
  const base = window.renderAt;
  window.renderAt = t => { drawBgx(t); base(t); drawWipe(t); };
  window.EP43 = { H, S, K, X, Q, CD, CDD, A, PR, END, QZ_END };
})();
