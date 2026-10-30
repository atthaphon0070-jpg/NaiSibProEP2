// SCENE 8 — PROMOTION (07_promotion.mp3): only the narrated claims (10,000+ questions, weekly updates, subjects).
// Real NaiSibPro logo + mascot; comments shown are generic fictional examples.
{
  const R0 = S('promo'), b = k => BT('promo', k);
  const el = mkScene('s8');
  const BASE = NSP.BASE;
  mark('endcard', R0 + b('next'));
  const ask = cap(el, 380, ['ตอบ <span class="pkc">ข.</span> ถูกไหม?'], 'pk', 64);
  const cmts = [['ข. ครับ!', '#95BFEF'], ['ข. Star Topology', '#F5A9C7'], ['ตอบ ข. ค่ะ ✓', '#9C8FE6']].map(([tx, c], i) => add(el, `<div class="abs crit cm" style="left:236px;top:${600 + i * 170}px;width:608px;height:140px;border-radius:36px;background:#fff;box-shadow:0 12px 26px rgba(110,90,150,.18),0 0 0 5px #fff;display:flex;align-items:center;gap:22px;padding:0 26px">
    <div style="width:84px;height:84px;border-radius:50%;background:${c};flex:none;display:grid;place-items:center">${ICON.heart('#fff')}</div>
    <div><div style="height:14px;width:120px;border-radius:7px;background:#E5EAF3;margin-bottom:12px"></div><div style="font-weight:700;font-size:42px;color:var(--dt);white-space:nowrap">${tx}</div></div></div>`));
  const cCmt = chip(el, 1150, '💬 คอมเมนต์มาบอกกัน!', 'pink', 44);
  const SIXT = ['star', 'bus', 'ring', 'mesh', 'tree', 'hybrid'];
  const grid = add(el, `<div class="abs" style="left:250px;top:540px;width:580px;display:grid;grid-template-columns:repeat(3,180px);gap:26px 20px">${SIXT.map(k => `<div class="g6 crit" data-topo="${k}" style="height:206px;border-radius:34px;background:radial-gradient(ellipse at 50% 40%,#1D3C78,#142B53 65%);box-shadow:0 0 0 5px #fff,0 12px 24px rgba(60,70,130,.3);display:flex;flex-direction:column;align-items:center;justify-content:center;gap:10px">${glyph(k, '#22D3EE', 92)}<div style="font-weight:800;font-size:36px;color:#FFD23F">${k.toUpperCase()}</div></div>`).join('')}</div>`);
  const g6 = [...grid.querySelectorAll('.g6')];
  const cMany = cap(el, 1080, ['จำได้ครบ<span class="pkc">กี่แบบ?</span>'], 'pk', 54);
  const cWant = cap(el, 380, ['อยากฝึก<span class="bl">ข้อสอบคอมพิวเตอร์</span>?'], 'lt', 40);
  const logo = add(el, `<div class="ctr" style="top:520px"><img class="crit" src="${BASE}brand/logo.png" style="width:400px"></div>`);
  const wm = add(el, `<div class="ctr" style="top:960px;flex-direction:column;align-items:center"><div class="wm crit" style="font-size:96px">NaiSibPro</div><div class="crit" style="font-weight:800;font-size:56px;color:var(--dt);text-shadow:0 4px 0 #fff">นายสิบโปร</div></div>`);
  const masc = add(el, `<img src="${BASE}brand/mascot_pose.png" style="position:absolute;left:770px;top:1350px;width:320px">`);
  const big = add(el, `<div class="ctr" style="top:600px;flex-direction:column;align-items:center;gap:10px"><div class="crit bn" style="font-weight:800;font-size:150px;line-height:1;background:linear-gradient(180deg,#FFC2DA,#EE7FAA 55%,#C8557F);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 4px 0 #fff)">10,000+</div><div class="crit" style="font-weight:800;font-size:60px;color:var(--dt)">ข้อสอบ</div></div>`);
  const bn = big.querySelector('.bn');
  const wk = chip(el, 960, `${ICON.cal(48, '#fff')} อัปเดตทุกสัปดาห์`, 'pink', 48);
  const SUBJ = [['คอมพิวเตอร์', 'comp'], ['กฎหมาย', 'law'], ['คณิตศาสตร์', 'math'], ['ภาษาไทย', 'thai'], ['วิชาอื่น ๆ', 'more']];
  const ic = { comp: `<svg width="64" height="64" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="13" rx="2" fill="#fff"/><path d="M8 21h8M12 16v5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    law: `<svg width="64" height="64" viewBox="0 0 24 24"><path d="M12 3v16M5 7h14M4 19h16" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><path d="M5 7l-3 6h6zM19 7l-3 6h6z" fill="#fff"/></svg>`,
    math: `<div style="font-weight:800;font-size:40px;color:#fff;line-height:1.05;text-align:center">+ −<br>× ÷</div>`, thai: `<div style="font-weight:800;font-size:64px;color:#fff;line-height:1">ก</div>`, more: `<div style="font-weight:800;font-size:56px;color:#fff;line-height:1">···</div>` };
  const subj = add(el, `<div class="abs" style="left:250px;top:520px;width:580px;display:flex;flex-wrap:wrap;justify-content:center;gap:24px 20px">${SUBJ.map(([n, k], i) => `<div class="sj crit" style="width:180px;height:200px;border-radius:34px;background:linear-gradient(180deg,#fff,#FFF3F9);box-shadow:0 12px 24px rgba(110,90,150,.16),0 0 0 5px #fff;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:12px;font-weight:700;font-size:32px;color:var(--dt)"><div style="width:96px;height:96px;border-radius:28px;display:grid;place-items:center;background:linear-gradient(160deg,${i % 2 ? '#B8D9F8,#2F6BFF' : '#FFD6E6,#EE7FAA'})">${ic[k]}</div>${n}</div>`).join('')}</div>`);
  const sj = [...subj.querySelectorAll('.sj')];
  const cSubj = cap(el, 1080, ['หลายวิชา<span class="pkc">สำหรับเตรียมสอบ</span>'], 'pk', 46);
  const BTN = [['like', 'กดไลก์', '<svg width="70" height="70" viewBox="0 0 24 24"><path d="M2 10h4v11H2zM8 21h9.5a2 2 0 0 0 2-1.6l1.4-7A2 2 0 0 0 19 10h-5l.8-4a2 2 0 0 0-3.6-1.4L8 10z" fill="#fff"/></svg>'],
    ['share', 'กดแชร์', '<svg width="70" height="70" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" fill="#fff"/><circle cx="6" cy="12" r="3" fill="#fff"/><circle cx="18" cy="19" r="3" fill="#fff"/><path d="M8.6 10.5l6.8-4M8.6 13.5l6.8 4" stroke="#fff" stroke-width="2"/></svg>'],
    ['follow', 'กดติดตาม', '<svg width="70" height="70" viewBox="0 0 24 24"><circle cx="10" cy="8" r="4" fill="#fff"/><path d="M2 21a8 8 0 0 1 16 0z" fill="#fff"/><path d="M20 8v6M17 11h6" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/></svg>']];
  const btns = add(el, `<div class="ctr" style="top:680px;gap:22px">${BTN.map(([k, n, s], i) => `<div class="bt crit" style="display:flex;flex-direction:column;align-items:center;gap:14px"><div class="bc" style="width:160px;height:160px;border-radius:50%;display:grid;place-items:center;background:linear-gradient(160deg,${i === 1 ? '#B8D9F8,#2F6BFF' : '#FFC2DA,#EE7FAA'});box-shadow:0 14px 28px rgba(110,90,150,.3),0 0 0 6px #fff">${s}</div><div class="bl2" style="font-weight:800;font-size:34px;color:var(--dt);white-space:nowrap">${n}</div></div>`).join('')}</div>`);
  const bt = [...btns.querySelectorAll('.bt')];
  const hand = add(el, `<div style="position:absolute;left:0;top:0;width:110px;height:110px">${ICON.hand(110)}</div>`);
  const endc = add(el, `<div class="abs" style="inset:0;background:linear-gradient(165deg,#FCE0EE 0%,#F3E7F8 45%,#D9E9FC 100%)">
    <div class="ctr" style="top:440px"><img class="crit ecl" src="${BASE}brand/logo.png" style="width:440px"></div>
    <div class="ctr" style="top:900px"><div class="wm crit ecw" style="font-size:110px">NaiSibPro</div></div>
    <div class="ctr" style="top:1060px"><div class="crit ect" style="font-weight:800;font-size:58px;color:var(--dt);text-shadow:0 4px 0 #fff">นายสิบโปร</div></div>
    <div class="ctr" style="top:1170px"><div class="cap pk crit ecn" style="font-size:40px"><span class="ln">มาเก็บคะแนนกัน<span class="pkc">ในข้อถัดไป!</span></span></div></div>
    <div class="ecf"></div></div>`);
  const conf = NSP.buildConfetti(endc.querySelector('.ecf'), 60, 540, 700);
  // ---- SFX
  sfx('pop', R0 + .1, .6); [0, 1, 2].forEach(i => sfx('msg', R0 + b('cmt') + i * .35, .6));
  g6.forEach((_, i) => sfx('pop', R0 + b('many') + .2 + i * .3, .5));
  sfx('riser', R0 + b('nsp') - .5, .5); sfx('sparkle', R0 + b('nsp') + .2, .8);
  for (let i = 0; i < 6; i++) sfx('coin', R0 + b('bank') + .15 + i * .15, .4); sfx('ding', R0 + b('weekly') + .1, .6);
  SUBJ.forEach(s => sfx('pop', R0 + b(s[1]), .6));
  [['like', 'like'], ['share', 'share'], ['follow', 'follow']].forEach(([k]) => sfx('click', R0 + b(k) + .25, .9)); sfx('success', R0 + b('follow') + .4, .6);
  sfx('whoosh', R0 + b('next') - .1, .6); sfx('ding', R0 + b('next') + .3, .7); sfx('sparkle', R0 + b('next') + .5, .8);
  function draw(t) {
    const u = t - R0;
    show(ask, u, b('who'), b('many') - .1, { from: .4, el: true, d: .7 });
    cmts.forEach((c, i) => show(c, u, b('cmt') + i * .35, b('many') - .1, { from: .5, dy: 60 }));
    show(cCmt, u, b('cmt') + .1, b('many') - .1);
    g6.forEach((e, i) => show(e, u, b('many') + .2 + i * .3, b('want') - .1, { from: .5, d: .5 }));
    show(cMany, u, b('many') + .1, b('want') - .1);
    show(cWant, u, b('want'), b('bank') - .1);
    const lg = life(u, b('nsp') - .1, b('bank') - .1, { from: .2, dy: 0, el: true, d: 1.0 });
    tf(logo, { ...lg, y: bob(u, 0, 8) });
    show(wm, u, b('nsp') + .3, b('bank') - .1, { from: .5, dy: 40 });
    tf(masc, { ...life(u, b('nsp') + .4, b('next') - .1, { from: .5, dy: 160, d: .7 }) });
    show(big, u, b('bank'), b('comp') - .1, { from: .3, el: true, d: .8 });
    bn.textContent = (Math.round(10000 * E.out(P(u, b('bank') + .1, 1.0)) / 100) * 100).toLocaleString('en-US') + '+';
    show(wk, u, b('weekly'), b('comp') - .1, { from: .3, el: true, d: .6 });
    sj.forEach((e, i) => show(e, u, b(SUBJ[i][1]), b('like') - .1, { from: .5, d: .5 }));
    show(cSubj, u, b('more') + .4, b('like') - .1);
    const PR = [b('like') + .25, b('share') + .25, b('follow') + .25];
    bt.forEach((e, i) => { show(e, u, b('like') - .1 + i * .1, b('next') - .05, { from: .5, d: .5 }); const bc = e.querySelector('.bc'); bc.style.transform = `scale(${(1 - .12 * NSP.pressDepth(u, [PR[i]])) * (u > PR[i] ? 1.04 : 1)})`; bc.style.boxShadow = u > PR[i] ? '0 14px 28px rgba(110,90,150,.3),0 0 0 6px #fff,0 0 0 14px rgba(34,197,94,.6)' : ''; });
    bt[2].querySelector('.bl2').textContent = u > PR[2] ? 'ติดตามแล้ว ✓' : 'กดติดตาม';
    let hx = 0, hy = 0, ho = 0;
    if (u > b('like') - .2 && u < b('next') - .1) { const xs = [358, 540, 722]; let j = 0; PR.forEach((p, i) => { if (u > p - .55) j = i; }); const kk = E.inOut(P(u, PR[j] - .55, .35)); const px = j ? xs[j - 1] : 900; hx = lerp(px, xs[j], kk) - 20; hy = 735; ho = 1; }
    hand.style.transform = `translate(${hx}px,${hy}px) scale(${1 - .15 * NSP.pressDepth(u, PR)})`; hand.style.opacity = ho;
    const ue = u - b('next');
    endc.style.visibility = ue < 0 ? 'hidden' : 'visible'; endc.style.clipPath = `circle(${E.out(P(ue, 0, .5)) * 1300}px at 540px 900px)`;
    tf(endc.querySelector('.ecl'), { ...life(ue, .1, 1e9, { from: .2, dy: 0, el: true, d: 1 }), y: bob(ue, 0, 8) });
    show(endc.querySelector('.ecw'), ue, .35, 1e9, { from: .5, dy: 40 });
    show(endc.querySelector('.ect'), ue, .55, 1e9, { from: .5, dy: 40 });
    show(endc.querySelector('.ecn'), ue, .8, 1e9, { from: .5, dy: 30 });
    NSP.drawConfetti(conf, t, R0 + b('next') + .3, 2.8);
  }
  SC.push({ el, a: R0, b: T.end + 1, draw, dark: () => 0 });
}
