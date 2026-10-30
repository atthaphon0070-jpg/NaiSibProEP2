// SCENE 08 — PROMOTIONAL ENDING (07_promotion.mp3). Compact EP.33 layout kept inside the safe column
// (the shared promo.js uses the older 70–950 px column, so this episode builds its own beats from the same brand assets).
(function () {
  const b = B.promo, BR = NSP.BASE + 'brand/';
  const beat = (id, html) => add('s6', `<div id="${id}" class="abs c" style="left:248px;top:440px;width:584px;height:990px">${html}</div>`);
  const HEART = (s, c = '#EE7FAA') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="${c}"/></svg>`;
  const SHARE = (s, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M14 5l7 6-7 6v-3.5c-5 0-8 1.5-10 5 .5-5.5 3.5-9.5 10-10z" fill="${c}"/></svg>`;
  const BELL = (s, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6z" fill="${c}"/><circle cx="12" cy="19.5" r="2.2" fill="${c}"/></svg>`;
  const LIKE = (s, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M2 10h4v11H2zM8 21V10l5-7c1.4 0 2.4 1.2 2 2.6L14 10h6a2 2 0 0 1 2 2.3l-1.4 7A2 2 0 0 1 18.6 21z" fill="${c}"/></svg>`;
  // 8A — comment prompt
  beat('p-cmt', `
    <div class="crit" style="position:absolute;left:0;right:0;top:20px;text-align:center;font-size:50px;font-weight:800;line-height:1.3">ใครตอบถูก<span class="nG"> ข้อ ค.</span><br>คอมเมนต์มาบอกกันหน่อย!</div>
    <div class="box" style="position:absolute;left:16px;width:584px;top:220px;height:380px;padding:26px">
      ${[0, 1].map(i => `<div class="p-cm" style="display:flex;align-items:center;gap:16px;margin-bottom:22px"><div style="width:70px;height:70px;border-radius:50%;background:${i ? '#F8CFE2' : '#CFE0FF'};display:grid;place-items:center;flex:none">${IC.person(44, i ? '#EE7FAA' : '#2F6BFF')}</div>
        <div style="flex:1;background:#F2F6FD;border-radius:26px;padding:20px 22px"><div style="height:14px;width:${i ? 62 : 80}%;border-radius:7px;background:#DCE5F3;margin-bottom:12px"></div><div style="height:14px;width:${i ? 40 : 55}%;border-radius:7px;background:#DCE5F3"></div></div>${HEART(34, '#F8CFE2')}</div>`).join('')}
      <div class="p-cm crit" style="display:flex;align-items:center;gap:14px;height:96px;border-radius:48px;background:#fff;box-shadow:0 0 0 4px #2F6BFF;padding:0 12px 0 28px;margin-top:10px">
        <div style="flex:1;font-size:40px;font-weight:800;white-space:nowrap"><span id="p-typed"></span><span id="p-caret" style="color:#2F6BFF">|</span></div>
        <div id="p-send" style="width:72px;height:72px;border-radius:50%;background:linear-gradient(160deg,#8FB0FF,#2F6BFF);display:grid;place-items:center">${SHARE(40)}</div></div>
    </div>
    <div class="crit" style="position:absolute;left:0;right:0;top:640px;display:flex;justify-content:center"><div class="pillH" style="font-size:40px;padding:14px 34px">พิมพ์คำตอบในคอมเมนต์เลย!</div></div>`);
  // 8A' — want more practice
  beat('p-more', `
    <div class="crit" style="position:absolute;left:0;right:0;top:120px;text-align:center;font-size:54px;font-weight:800;line-height:1.35">อยากฝึกโจทย์<span class="nA">คณิต</span><br>แบบนี้อีก<span class="nB">เยอะ ๆ</span>?</div>
    <div style="position:absolute;left:0;right:0;top:360px;display:flex;justify-content:center;gap:22px">${['∩', '%', '÷', '√'].map((s, i) => `<div class="p-mi" style="width:120px;height:120px;border-radius:34px;display:grid;place-items:center;font-size:62px;font-weight:800;color:#fff;background:linear-gradient(160deg,${i % 2 ? '#FFC2DA,#EE7FAA' : '#8FB0FF,#2F6BFF'});box-shadow:0 12px 24px rgba(20,43,83,.2)">${s}</div>`).join('')}</div>`);
  // 8B — brand
  beat('p-brand', `
    <div class="p-logo" style="position:absolute;left:122px;top:30px;width:340px"><img src="${BR}logo.png" style="width:340px;filter:drop-shadow(0 16px 24px rgba(20,43,83,.25))"></div>
    <div class="crit" style="position:absolute;left:0;right:0;top:420px;text-align:center;font-size:44px;font-weight:700">มาฝึกกับ</div>
    <div class="crit wordmark" style="position:absolute;left:0;right:0;top:480px;text-align:center;font-size:118px">NaiSibPro</div>`);
  // 8C — question bank
  beat('p-bank', `
    <div class="crit" style="position:absolute;left:0;right:0;top:40px;text-align:center;font-size:44px;font-weight:800">รวมข้อสอบมากกว่า<span class="nB">หมื่นข้อ</span></div>
    <div class="crit" style="position:absolute;left:0;right:0;top:120px;display:flex;justify-content:center;align-items:baseline;gap:14px"><span class="big gP" id="p-num" style="font-size:116px">10,000+</span><span style="font-size:50px;font-weight:800">ข้อ</span></div>
    <div class="crit" style="position:absolute;left:0;right:0;top:420px;display:flex;justify-content:center"><div class="pillH" style="font-size:44px;padding:16px 36px">${ICON.cal(50, '#fff')}อัปเดตทุกสัปดาห์</div></div>
    <div style="position:absolute;left:122px;top:560px;width:340px;height:300px">${[...Array(6)].map((_, i) => `<div class="p-doc" style="position:absolute;left:${90 + (i % 2) * 18}px;top:${120 - i * 20}px;width:150px;height:190px;border-radius:16px;background:#fff;box-shadow:0 10px 18px rgba(20,43,83,.16);padding:22px 18px">${[90, 70, 85, 60].map(w => `<div style="height:12px;width:${w}%;border-radius:6px;background:#E2EAF7;margin-bottom:14px"></div>`).join('')}</div>`).join('')}</div>`);
  // 8C' — subjects + approved poster (shown whole)
  const SUBJ = ['กฎหมาย', 'คณิตศาสตร์', 'ภาษาไทย', 'ภาษาอังกฤษ', 'คอมพิวเตอร์', 'สารรอบรู้'];
  beat('p-subj', `
    <div class="crit" style="position:absolute;left:0;right:0;top:10px;text-align:center;font-size:42px;font-weight:800;line-height:1.3">มีครบหลายวิชา<br><span style="font-size:36px;color:#2F6BFF">สำหรับเตรียมสอบนายสิบตำรวจ</span></div>
    <div class="p-poster" style="position:absolute;left:0;top:170px;width:290px;height:515px;border-radius:26px;overflow:hidden;box-shadow:0 20px 40px rgba(20,43,83,.25),0 0 0 6px #fff"><img src="${BR}poster.jpg" style="width:290px;height:515px;display:block"></div>
    <div style="position:absolute;left:304px;top:190px;width:280px">${SUBJ.map((s, i) => `<div class="p-sj pillW crit" style="font-size:30px;padding:10px 20px;margin-bottom:16px;box-shadow:0 0 0 4px ${i % 2 ? '#F8CFE2' : '#CFE0FF'},0 8px 16px rgba(20,43,83,.12)"><span style="width:30px;height:30px;border-radius:50%;background:#22C55E;display:grid;place-items:center">${ICON.check('#fff', 20)}</span>${s}</div>`).join('')}</div>`);
  // 8D — CTA end card
  beat('p-cta', `
    <div class="p-elogo" style="position:absolute;left:182px;top:0;width:220px"><img src="${BR}logo.png" style="width:220px;filter:drop-shadow(0 12px 18px rgba(20,43,83,.22))"></div>
    <div class="crit wordmark" style="position:absolute;left:0;right:0;top:236px;text-align:center;font-size:88px">NaiSibPro</div>
    <div class="crit" style="position:absolute;left:0;right:0;top:380px;text-align:center;font-size:46px;font-weight:800;line-height:1.3">กดไลก์ กดแชร์<br>และกดติดตามไว้!</div>
    <div style="position:absolute;left:0;right:0;top:530px;display:flex;justify-content:center;gap:40px">
      ${[[LIKE(70), 'linear-gradient(160deg,#8FB0FF,#2F6BFF)', 'ไลก์'], [SHARE(70), 'linear-gradient(160deg,#67E8F9,#22D3EE)', 'แชร์'], [BELL(70), 'linear-gradient(160deg,#FFC2DA,#EE7FAA)', 'ติดตาม']].map(([ic, bg, lb]) => `
      <div class="p-btn crit" style="display:flex;flex-direction:column;align-items:center;gap:8px"><div class="p-bc" style="width:140px;height:140px;border-radius:50%;background:${bg};display:grid;place-items:center;box-shadow:0 14px 26px rgba(20,43,83,.22),0 0 0 6px #fff">${ic}</div><div style="font-size:32px;font-weight:800">${lb}</div></div>`).join('')}</div>
    <div class="p-hand" style="position:absolute;left:0;top:0;width:100px;height:100px">${ICON.hand(100)}</div>
    <div class="crit" id="p-bye" style="position:absolute;left:0;right:0;top:800px;display:flex;justify-content:center"><div class="pillW" style="font-size:40px;font-weight:800;padding:12px 34px;color:#2F6BFF;box-shadow:0 0 0 4px #95BFEF,0 10px 22px rgba(20,43,83,.14)">เจอกันข้อถัดไปครับ!</div></div>`);
  add('s6', `<div id="p-conf"></div>`);
  const conf = NSP.buildConfetti($('p-conf'), 60, 540, 900);
  const q = (id, s) => [...$(id).querySelectorAll(s)];
  const cms = q('p-cmt', '.p-cm'), mis = q('p-more', '.p-mi'), docs = q('p-bank', '.p-doc'), sjs = q('p-subj', '.p-sj'), btns = q('p-cta', '.p-btn');
  const PRESS = [b.cta + .9, b.cta + 1.6, b.cta + 2.3];
  const BEATS = [['p-cmt', b.cmt, b.more], ['p-more', b.more, b.brand], ['p-brand', b.brand, b.bank], ['p-bank', b.bank, b.subj], ['p-subj', b.subj, b.cta], ['p-cta', b.cta, 1e9]];
  BEATS.forEach(([, a]) => { sfx('whoosh', PR + a - .08, .35); sfx('pop', PR + a + .1, .7); });
  cms.forEach((_, i) => sfx('msg', PR + .5 + i * .55, .4)); for (let i = 0; i < 8; i++) sfx('type', PR + 1.9 + i * .1, .3); sfx('click', PR + 2.9, .6); sfx('sparkle', PR + b.brand + .3, .8); sfx('riser', PR + b.bank - .4, .4);
  for (let i = 0; i < 6; i++) sfx('coin', PR + b.bank + .2 + i * .15, .35); sfx('ding', PR + b.subj + .2, .5);
  PRESS.forEach(x => sfx('click', PR + x, .8)); sfx('success', PR + b.bye, .6);

  window.drawPromo = function (t) {
    const u = t - PR;
    BEATS.forEach(([id, a, z]) => tf($(id), life(u, a, z - .05, { from: .6, dy: 50, d: .5, out: .25 })));
    cms.forEach((c, i) => tf(c, life(u, .5 + i * .55, 1e9, { from: .3, dy: 30, el: true, d: .7 })));
    const TYPED = 'ข้อ ค. 110 คน'; $('p-typed').textContent = TYPED.slice(0, Math.floor(clamp((u - 1.9) / .9) * TYPED.length));
    $('p-caret').style.opacity = Math.sin(u * 10) > 0 ? 1 : 0; $('p-send').style.transform = `scale(${1 - .15 * NSP.pressDepth(u, [2.9])})`;
    mis.forEach((m, i) => tf(m, { ...life(u, b.more + .3 + i * .12, 1e9, { from: .2, dy: 40, el: true, d: .7 }), r: Math.sin(u * 3 + i) * 6 }));
    const lg = $('p-brand').querySelector('.p-logo'); tf(lg, { ...life(u, b.brand + .05, 1e9, { from: .2, dy: 0, el: true, d: 1 }), y: bob(u, 0, 8) });
    $('p-num').textContent = (Math.round(10000 * E.out(P(u, b.bank + .2, 1.2)) / 100) * 100).toLocaleString('en-US') + '+';
    docs.forEach((d, i) => tf(d, { ...life(u, b.bank + .2 + i * .1, 1e9, { from: .3, dy: -100, d: .4 }), r: i % 2 ? 4 : -4 }));
    tf($('p-subj').querySelector('.p-poster'), { ...life(u, b.subj + .1, 1e9, { from: .5, dy: 60 }), r: -3 + bob(u, 0, 1) });
    sjs.forEach((s, i) => tf(s, life(u, b.subj + .4 + i * .18, 1e9, { from: .3, dy: 20 })));
    tf($('p-cta').querySelector('.p-elogo'), { ...life(u, b.cta, 1e9, { from: .2, el: true, d: 1 }), y: bob(u, 0, 6) });
    btns.forEach((bt, i) => { const l = life(u, b.cta + .3 + i * .15, 1e9, { from: .2, dy: 30, el: true }); tf(bt, l);
      const on = u > PRESS[i]; bt.querySelector('.p-bc').style.transform = `scale(${(1 - .15 * NSP.pressDepth(u, [PRESS[i]])) * (on ? 1.06 : 1)})`;
      bt.querySelector('.p-bc').style.boxShadow = on ? '0 14px 26px rgba(20,43,83,.22),0 0 0 6px #fff,0 0 0 14px rgba(255,210,63,.8)' : ''; });
    // hand cursor taps like → share → follow (button centres at x 112/292/472 inside the beat box)
    const hx = [112, 292, 472], k = u < PRESS[0] ? 0 : u < PRESS[1] ? 1 : 2;
    const from = k ? hx[k - 1] : 540, mv = E.inOut(P(u, (k ? PRESS[k - 1] : b.cta + .4) + .1, .45));
    const hand = $('p-cta').querySelector('.p-hand');
    hand.style.transform = `translate(${lerp(from, hx[k], mv) - 10}px,${640 + (k ? 0 : lerp(120, 0, mv)) + 10 * NSP.pressDepth(u, PRESS)}px)`;
    hand.style.opacity = clamp((u - b.cta - .4) * 4) * (1 - P(u, b.bye, .3));
    tf($('p-bye'), life(u, b.bye, 1e9, { from: .3, dy: 20, el: true }));
    NSP.drawConfetti(conf, t, PR + b.bye + .1, 2.4);
  };
})();
