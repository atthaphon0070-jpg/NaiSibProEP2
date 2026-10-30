// NaiSibPro EP.26 prop library: digital government correspondence.
// Original pastel illustrations only. Every office, address and document is fictional and generic:
// no real department names, seals, logos or e-mail addresses.
//   OFFICE.set(root)            office interior with parallax camera; returns { actors, front, camera, mon }
//   OFFICE.monitor(w)           desktop monitor; .screen is an 860 × 540 design-size div
//   OFFICE.mailUI()             fictional agency e-mail composer + outbox (sender's own "ส่งแล้ว" status)
//   OFFICE.diagram()            sender ↔ recipient network: send (blue), verify (lavender), acknowledgment (green)
//   OFFICE.printer(w)           printer with sheets feeding onto the output tray, status LED, freeze
//   OFFICE.IC                   icons (envelope, file, building, magnifier, hourglass, lock, plug, cursor …)
(function () {
  const { h, clamp, lerp, E, P, tf } = window.NSP;
  const BLUE = '#5E8FD6', GREEN = '#26A269', LAV = '#9C8FE6';

  // ------------------------------------------------------------------ icons
  const IC = {
    env: (w = 120, c = BLUE, mark = '') => `<svg width="${w}" height="${w * .72}" viewBox="0 0 120 86"><rect x="3" y="3" width="114" height="80" rx="12" fill="#fff" stroke="${c}" stroke-width="6"/><path d="M8 10 L60 50 L112 10" fill="none" stroke="${c}" stroke-width="6" stroke-linejoin="round"/>${mark}</svg>`,
    envCheck: (w = 120) => IC.env(w, GREEN, `<circle cx="98" cy="70" r="20" fill="${GREEN}" stroke="#fff" stroke-width="4"/><path d="M88 70l7 7 12-13" fill="none" stroke="#fff" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>`),
    file: (w = 70, c = '#E0517F', label = 'PDF') => `<svg width="${w}" height="${w * 1.25}" viewBox="0 0 80 100"><path d="M8 4h44l24 24v64a6 6 0 0 1-6 6H8a6 6 0 0 1-6-6V10a6 6 0 0 1 6-6z" fill="#fff" stroke="#C9D6EA" stroke-width="4"/><path d="M52 4v18a6 6 0 0 0 6 6h18" fill="#E2ECFA"/><rect x="10" y="56" width="56" height="26" rx="7" fill="${c}"/><text x="38" y="75" font-size="18" font-weight="800" fill="#fff" text-anchor="middle" font-family="Prompt">${label}</text><path d="M14 22h28M14 34h44M14 44h36" stroke="#DCE6F4" stroke-width="5" stroke-linecap="round"/></svg>`,
    building: (w = 200, c = '#95BFEF', roof = '#5E8FD6') => `<svg width="${w}" height="${w * .82}" viewBox="0 0 200 164"><ellipse cx="100" cy="158" rx="92" ry="7" fill="rgba(60,60,110,.15)"/><path d="M14 58 L100 10 L186 58Z" fill="${roof}" stroke="#fff" stroke-width="5" stroke-linejoin="round"/><rect x="24" y="58" width="152" height="12" rx="4" fill="#fff"/><rect x="28" y="70" width="144" height="76" fill="#FFF8FC"/>${[44, 76, 108, 140].map(x => `<rect x="${x}" y="74" width="16" height="70" rx="5" fill="${c}"/>`).join('')}<rect x="16" y="144" width="168" height="12" rx="4" fill="#fff" stroke="${c}" stroke-width="3"/><circle cx="100" cy="40" r="9" fill="#fff" opacity=".9"/></svg>`,
    mag: (w = 90, c = LAV) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="rgba(255,255,255,.75)" stroke="${c}" stroke-width="2.6"/><path d="M15 15l6 6" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/><path d="M7 8.5a3.5 3.5 0 0 1 3-2" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`,
    hour: (w = 60, c = '#E0A030') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/><path d="M9.5 18.5h5l-2.5-3z" fill="${c}"/></svg>`,
    lock: (w = 90, c = '#E0517F') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="${c}"/><rect x="8" y="10.5" width="8" height="6.5" rx="1.5" fill="#fff"/><path d="M9.6 10.5V9a2.4 2.4 0 0 1 4.8 0v1.5" fill="none" stroke="#fff" stroke-width="1.6"/></svg>`,
    plug: (w = 90, c = '#E0A030') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="12" rx="2" fill="none" stroke="${c}" stroke-width="2.2"/><path d="M9 20h6M12 16v4" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/><path d="M9 7.5l6 5M15 7.5l-6 5" stroke="#E0517F" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    cursor: (w = 70) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><path d="M4 2l15 10.5-6.5 1.2 3.8 7-2.8 1.4-3.8-7L4 19.5z" fill="#fff" stroke="#31445D" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    check: (w = 60, bg = GREEN) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${bg}"/><path d="M6.5 12.5l3.7 3.7 7.3-8" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cross: (w = 60, bg = '#E0517F') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${bg}"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/></svg>`,
    warn: (w = 120) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><path d="M12 2.5L22.5 21h-21z" fill="#FFCF5C" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 9v5.5" stroke="#31445D" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.5" fill="#31445D"/></svg>`,
    send: (w = 36, c = '#fff') => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><path d="M3 11.5L21 3l-6.5 18-3-7.5z" fill="${c}"/><path d="M11.5 13.5L21 3" stroke="rgba(0,0,0,.18)" stroke-width="1.6"/></svg>`,
    clip: (w = 34, c = BLUE) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><path d="M16 7l-7.5 7.5a2.5 2.5 0 0 0 3.5 3.5L19.5 10.5a4.5 4.5 0 0 0-6.4-6.4L5.6 11.6a6.5 6.5 0 0 0 9.2 9.2L19 16.6" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round"/></svg>`,
    eq: (w = 70, c = '#E0517F', not = true) => `<svg width="${w}" height="${w}" viewBox="0 0 24 24"><path d="M4 9h16M4 15h16" stroke="${c}" stroke-width="3" stroke-linecap="round"/>${not ? `<path d="M16 3.5L8 20.5" stroke="${c}" stroke-width="3" stroke-linecap="round"/>` : ''}</svg>`,
    arrow: (w = 70, c = BLUE) => `<svg width="${w}" height="${w * .6}" viewBox="0 0 40 24"><path d="M2 12h30M24 4l9 8-9 8" fill="none" stroke="${c}" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    paper: (w = 150, title = 'หนังสือราชการ') => `<div style="position:relative;width:${w}px;height:${w * 1.3}px;filter:drop-shadow(0 12px 16px rgba(90,80,140,.22))"><svg width="${w}" height="${w * 1.3}" viewBox="0 0 200 260" style="position:absolute;inset:0"><path d="M14 8 H150 L190 48 V246 Q190 254 182 254 H14 Q6 254 6 246 V16 Q6 8 14 8Z" fill="#fff"/><path d="M150 8 V40 Q150 48 158 48 H190Z" fill="#E2ECFA"/><circle cx="100" cy="74" r="18" fill="none" stroke="#C9D6EA" stroke-width="5"/><path d="M30 120h140M30 144h140M30 168h120M30 192h140M30 216h90" stroke="#DCE6F4" stroke-width="8" stroke-linecap="round"/></svg>${title ? `<div style="position:absolute;left:0;right:0;top:${w * .5}px;text-align:center"><span style="background:#fff;padding:0 6px;font-weight:800;font-size:${w * .12}px;color:#5E8FD6;white-space:nowrap">${title}</span></div>` : ''}</div>`,
  };

  // ------------------------------------------------------------------ office set (1080 × 1920 world, parallax camera)
  function set(root) {
    const layer = (p, html) => { const el = h(`<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0">${html}</div>`); el.p = p; root.appendChild(el); return el; };
    const binder = (x, c, hgt = 150) => `<div style="position:absolute;left:${x}px;bottom:0;width:40px;height:${hgt}px;border-radius:6px;background:${c};box-shadow:inset -6px 0 0 rgba(0,0,0,.08)"><div style="position:absolute;left:8px;right:8px;top:24px;height:30px;border-radius:4px;background:#fff;opacity:.85"></div><div style="position:absolute;left:14px;bottom:16px;width:12px;height:12px;border-radius:50%;background:#fff;opacity:.6"></div></div>`;
    const back = layer(.55, `
      <div style="position:absolute;left:-400px;top:-300px;width:1880px;height:1640px;background:linear-gradient(180deg,#FDF2F8 0%,#F5EEFA 55%,#E9F1FC 100%)"></div>
      <div style="position:absolute;left:-400px;top:1000px;width:1880px;height:22px;background:#fff;opacity:.9"></div>
      <div style="position:absolute;left:-400px;top:1022px;width:1880px;height:318px;background:linear-gradient(180deg,#E7EEFA,#DCE6F6)"></div>
      <div style="position:absolute;left:-400px;top:1340px;width:1880px;height:900px;background:linear-gradient(180deg,#CBD8EE,#B7C8E6)"></div>
      <div style="position:absolute;left:-400px;top:1340px;width:1880px;height:900px;background:repeating-linear-gradient(90deg,rgba(255,255,255,.18) 0 4px,transparent 4px 180px);opacity:.7"></div>
      <div style="position:absolute;left:40px;top:330px;width:400px;height:520px;border-radius:26px;background:#fff;box-shadow:0 16px 30px rgba(110,100,160,.16)">
        <div style="position:absolute;inset:18px;border-radius:14px;overflow:hidden;background:linear-gradient(180deg,#BFDDFB 0%,#E3F0FF 60%,#FFEAF3 100%)">
          <div style="position:absolute;left:30px;top:70px;width:140px;height:44px;border-radius:30px;background:#fff;opacity:.9;box-shadow:40px -16px 0 -6px #fff"></div>
          <div style="position:absolute;left:-20px;bottom:0;width:420px;height:150px;background:linear-gradient(180deg,#C9D9F2,#B4C8EA);clip-path:polygon(0 60%,8% 30%,16% 30%,16% 10%,30% 10%,30% 40%,44% 40%,44% 0,60% 0,60% 35%,74% 35%,74% 20%,90% 20%,90% 50%,100% 50%,100% 100%,0 100%)"></div>
          ${[0, 1, 2, 3, 4, 5, 6].map(i => `<div style="position:absolute;left:0;right:0;top:${i * 72}px;height:14px;background:rgba(255,255,255,.55)"></div>`).join('')}
        </div><div style="position:absolute;left:192px;top:18px;width:16px;bottom:18px;background:#fff"></div></div>
      <div style="position:absolute;left:520px;top:350px;width:150px;height:150px;border-radius:50%;background:#fff;box-shadow:0 10px 22px rgba(110,100,160,.18),inset 0 0 0 10px #F5A9C7">
        <div style="position:absolute;left:72px;top:34px;width:6px;height:44px;border-radius:3px;background:#31445D"></div><div style="position:absolute;left:72px;top:72px;width:40px;height:6px;border-radius:3px;background:#31445D"></div></div>
      <div style="position:absolute;left:600px;top:560px;width:440px;height:230px;border-bottom:16px solid #fff;filter:drop-shadow(0 8px 10px rgba(110,100,160,.15))">
        <div style="position:absolute;left:10px;bottom:0;width:420px;height:150px">${binder(0, '#F5A9C7')}${binder(46, '#95BFEF')}${binder(92, '#B8D9F8', 136)}${binder(138, '#EE7FAA')}${binder(184, '#C7B7EE', 140)}${binder(230, '#95BFEF')}${binder(276, '#F8CFE2', 130)}</div></div>
      <div style="position:absolute;left:600px;top:810px;width:440px;height:16px;background:#fff;border-radius:6px"></div>
      <div style="position:absolute;left:800px;top:880px;width:230px;height:470px;border-radius:18px;background:linear-gradient(180deg,#E6EDF8,#D2DDF0);box-shadow:0 16px 30px rgba(90,100,150,.18)">
        ${[0, 1, 2].map(i => `<div style="position:absolute;left:16px;right:16px;top:${18 + i * 150}px;height:134px;border-radius:12px;background:#F4F7FC;box-shadow:inset 0 -6px 0 rgba(0,0,0,.05)"><div style="position:absolute;left:70px;top:22px;width:60px;height:14px;border-radius:7px;background:#B7C6DE"></div><div style="position:absolute;left:58px;top:56px;width:84px;height:30px;border-radius:6px;background:#fff;border:3px solid #DCE4F2"></div></div>`).join('')}</div>
      <div style="position:absolute;left:-30px;top:1060px;width:130px;height:290px"><div style="position:absolute;left:30px;bottom:0;width:80px;height:90px;border-radius:12px 12px 22px 22px;background:#F5A9C7"></div>
        ${[[-40, 0], [-10, -18], [24, -6], [-28, 30], [14, 22]].map(([r, dx]) => `<div style="position:absolute;left:${54 + dx}px;bottom:80px;width:44px;height:170px;border-radius:50% 50% 50% 50%/80% 80% 20% 20%;background:linear-gradient(180deg,#9FDCC0,#6FC09B);transform-origin:50% 100%;transform:rotate(${r}deg)"></div>`).join('')}</div>`);
    const actors = layer(1, '');
    const mon = monitor(330);
    const front = layer(1, `
      <div style="position:absolute;left:90px;top:1180px;width:820px;height:36px;border-radius:14px;background:linear-gradient(180deg,#FFFFFF,#F1E6EE);box-shadow:0 6px 0 #E3D3DF"></div>
      <div style="position:absolute;left:120px;top:1216px;width:760px;height:330px;border-radius:0 0 22px 22px;background:linear-gradient(180deg,#F4D3E2,#E9BCD2);box-shadow:0 26px 40px rgba(110,80,130,.25)">
        <div style="position:absolute;left:40px;top:40px;width:300px;height:120px;border-radius:16px;background:rgba(255,255,255,.35)"></div>
        <div style="position:absolute;left:420px;top:40px;width:300px;height:120px;border-radius:16px;background:rgba(255,255,255,.35)"></div>
        <div style="position:absolute;left:160px;top:96px;width:60px;height:12px;border-radius:6px;background:#fff;opacity:.8"></div><div style="position:absolute;left:540px;top:96px;width:60px;height:12px;border-radius:6px;background:#fff;opacity:.8"></div></div>
      <div class="o-tray" style="position:absolute;left:110px;top:1100px;width:200px;height:90px">
        <div style="position:absolute;left:14px;top:4px;width:170px;height:60px;transform:rotate(-3deg);background:#fff;border-radius:6px;box-shadow:0 2px 0 #E6EAF2"></div>
        <div style="position:absolute;left:20px;top:12px;width:170px;height:60px;transform:rotate(2deg);background:#fff;border-radius:6px;box-shadow:0 2px 0 #E6EAF2"></div>
        <div style="position:absolute;left:0;top:44px;width:200px;height:46px;border-radius:10px;background:linear-gradient(180deg,#95BFEF,#6F9FE0)"></div></div>
      <div style="position:absolute;left:430px;top:1150px;width:260px;height:40px;border-radius:10px;background:#fff;box-shadow:0 6px 0 #D7DEEA">${[0, 1, 2].map(r => `<div style="position:absolute;left:14px;right:14px;top:${7 + r * 10}px;height:6px;border-radius:3px;background:repeating-linear-gradient(90deg,#DCE4F2 0 16px,transparent 16px 20px)"></div>`).join('')}</div>
      <div style="position:absolute;left:740px;top:1120px;width:58px;height:66px;border-radius:8px 8px 16px 16px;background:#fff;box-shadow:inset 0 -8px 0 #F5A9C7"><div style="position:absolute;right:-20px;top:16px;width:28px;height:30px;border-radius:50%;border:7px solid #fff"></div></div>`);
    const monWrap = h(`<div style="position:absolute;left:560px;top:850px"></div>`); monWrap.appendChild(mon.el); front.appendChild(monWrap);
    const layers = [back, actors, front];
    const vig = h(`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(60,40,80,.18) 100%)"></div>`); root.appendChild(vig);
    function camera(cx, cy, z, dof = 0) {
      layers.forEach(L => { const p = L.p, zl = 1 + (z - 1) * p, lx = lerp(540, cx, p), ly = lerp(960, cy, p); L.style.transform = `translate(540px,960px) scale(${zl}) translate(${-lx}px,${-ly}px)`; });
      back.style.filter = dof > .05 ? `blur(${dof * 6}px)` : '';
    }
    return { actors, front, camera, mon, back };
  }

  // ------------------------------------------------------------------ monitor (screen design size 860 × 540)
  function monitor(w = 900) {
    const k = w / 900;
    const el = h(`<div style="position:relative;width:${w}px;height:${w * .78}px">
      <div style="position:absolute;left:${w * .41}px;top:${w * .6}px;width:${w * .18}px;height:${w * .13}px;background:linear-gradient(90deg,#C9D3E4,#E8EDF6,#C9D3E4)"></div>
      <div style="position:absolute;left:${w * .3}px;top:${w * .72}px;width:${w * .4}px;height:${w * .05}px;border-radius:${w * .03}px;background:linear-gradient(180deg,#E8EDF6,#C3CDDF)"></div>
      <div style="position:absolute;left:0;top:0;width:${w}px;height:${w * .64}px;border-radius:${w * .04}px;background:linear-gradient(180deg,#3A4A63,#2A3850);box-shadow:0 ${w * .03}px ${w * .05}px rgba(40,50,90,.3),inset 0 0 0 ${Math.max(2, w * .006)}px rgba(255,255,255,.15)">
        <div class="m-scr" style="position:absolute;left:${20 * k}px;top:${20 * k}px;width:860px;height:540px;transform:scale(${k});transform-origin:0 0;border-radius:14px;overflow:hidden;background:#0F1726"></div>
        <div class="m-led" style="position:absolute;left:${w / 2 - 5}px;bottom:${w * .006}px;width:10px;height:${Math.max(3, w * .006)}px;border-radius:3px;background:#5FDC9B"></div></div></div>`);
    return { el, screen: el.querySelector('.m-scr'), led: el.querySelector('.m-led') };
  }

  // ------------------------------------------------------------------ fictional agency e-mail UI (860 × 540)
  function mailUI() {
    const el = h(`<div style="position:absolute;inset:0;font-family:Prompt">
      <div class="mu-wall" style="position:absolute;inset:0;background:linear-gradient(150deg,#FCE3EF,#E2EEFC)"></div>
      <div class="mu-win" style="position:absolute;left:24px;top:22px;width:812px;height:496px;border-radius:20px;background:#fff;box-shadow:0 14px 30px rgba(60,70,120,.25);overflow:hidden;transform-origin:50% 60%">
        <div style="height:66px;background:linear-gradient(90deg,#5E8FD6,#95BFEF);display:flex;align-items:center;gap:14px;padding:0 22px;color:#fff;font-weight:700;font-size:28px">
          ${['#FF8FB8', '#FFD36E', '#9FDCC0'].map(c => `<span style="width:16px;height:16px;border-radius:50%;background:${c}"></span>`).join('')}
          <span style="margin-left:8px">อีเมลหน่วยงาน</span><span style="margin-left:auto;font-size:20px;font-weight:600;background:rgba(255,255,255,.25);padding:2px 12px;border-radius:12px">ตัวอย่างสมมติ</span></div>
        <div class="mu-comp" style="position:absolute;left:0;right:0;top:66px;bottom:0">
          <div style="display:flex;align-items:center;gap:14px;height:72px;padding:0 26px;border-bottom:3px solid #EEF2F8;font-size:30px"><b style="color:#7A8BA3;width:90px">ถึง</b><span class="mu-to" style="font-weight:600"></span><i class="mu-car" style="width:3px;height:34px;background:#5E8FD6"></i></div>
          <div style="display:flex;align-items:center;gap:14px;height:72px;padding:0 26px;border-bottom:3px solid #EEF2F8;font-size:30px"><b style="color:#7A8BA3;width:90px">เรื่อง</b><span class="mu-sub" style="font-weight:600"></span></div>
          <div style="padding:22px 26px">${[92, 78, 60].map(w => `<div style="height:16px;width:${w}%;border-radius:8px;background:#EEF2F8;margin-bottom:14px"></div>`).join('')}</div>
          <div class="mu-att" style="position:absolute;left:26px;top:276px;display:flex;align-items:center;gap:12px;padding:8px 22px 8px 12px;border-radius:18px;background:#EEF5FF;box-shadow:0 0 0 3px #CFE0F7;font-weight:700;font-size:28px;color:#31445D">${IC.file(40)}<span>หนังสือราชการ.pdf</span>${IC.clip(30)}</div>
          <div class="mu-btn" style="position:absolute;right:28px;bottom:26px;display:flex;align-items:center;gap:12px;padding:12px 34px;border-radius:30px;background:linear-gradient(90deg,#EE7FAA,#F7A8C8);color:#fff;font-weight:800;font-size:34px;box-shadow:0 8px 18px rgba(238,127,170,.45)">${IC.send(34)}ส่ง</div></div>
        <div class="mu-out" style="position:absolute;left:0;right:0;top:66px;bottom:0;background:#fff">
          <div style="display:flex;align-items:center;gap:12px;height:70px;padding:0 26px;font-weight:800;font-size:32px;color:#31445D;border-bottom:3px solid #EEF2F8">${IC.send(32, '#5E8FD6')}กล่องส่งออก</div>
          <div class="mu-row" style="position:absolute;left:20px;right:20px;top:96px;height:150px;border-radius:20px;background:#F5F9FF;box-shadow:0 0 0 3px #DCE8F8;display:flex;align-items:center;gap:20px;padding:0 22px">
            <div style="flex:none">${IC.env(96)}</div>
            <div style="flex:1;min-width:0;line-height:1.35"><div style="font-weight:700;font-size:28px">ถึง: สารบรรณ หน่วยงาน B</div><div style="font-weight:600;font-size:24px;color:#7A8BA3">เรื่อง ขอเชิญประชุมคณะทำงาน</div><div style="display:flex;align-items:center;gap:6px;font-size:22px;color:#7A8BA3">${IC.clip(24, '#7A8BA3')}หนังสือราชการ.pdf</div></div>
            <div class="mu-st" style="flex:none;display:flex;align-items:center;gap:10px;padding:10px 24px;border-radius:26px;background:#5E8FD6;color:#fff;font-weight:800;font-size:32px">${IC.send(28)}ส่งแล้ว</div></div>
          <div class="mu-note" style="position:absolute;left:20px;right:20px;top:270px;text-align:center;font-weight:600;font-size:26px;color:#7A8BA3">สถานะฝั่งผู้ส่ง: อีเมลออกจากระบบแล้ว</div></div>
      </div>
      <div class="mu-off" style="position:absolute;inset:0;background:#0F1726"></div></div>`);
    const q = s => el.querySelector(s);
    const TO = 'สารบรรณ หน่วยงาน B (ตัวอย่าง)', SUB = 'ขอเชิญประชุมคณะทำงาน';
    // s: { on 0..1, win 0..1, to 0..1 typed, sub 0..1, att 0..1, press 0..1, out 0..1 (outbox page), st 0..1 (status pop) }
    function draw(s) {
      q('.mu-off').style.opacity = 1 - clamp(s.on ?? 1);
      const wn = s.win ?? 1;
      tf(q('.mu-win'), { s: lerp(.6, 1, E.back(wn)), o: clamp(wn * 3) });
      const nt = Math.round(TO.length * clamp(s.to ?? 1)), ns = Math.round(SUB.length * clamp(s.sub ?? 1));
      q('.mu-to').textContent = TO.slice(0, nt); q('.mu-sub').textContent = SUB.slice(0, ns);
      q('.mu-car').style.opacity = (s.to ?? 1) > 0 && (s.sub ?? 1) < 1 && Math.floor((s.t || 0) * 3) % 2 === 0 ? 1 : 0;
      const at = s.att ?? 1; tf(q('.mu-att'), { s: lerp(.3, 1, E.back(clamp(at))), o: clamp(at * 3) });
      const pr = s.press || 0; q('.mu-btn').style.transform = `scale(${1 - .1 * pr})`; q('.mu-btn').style.filter = pr > .01 ? `brightness(${1 - .15 * pr})` : '';
      const ou = clamp(s.out || 0); q('.mu-out').style.transform = `translateX(${(1 - E.out(ou)) * 820}px)`; q('.mu-out').style.visibility = ou > 0 ? 'visible' : 'hidden';
      const st = s.st ?? 1; tf(q('.mu-st'), { s: lerp(.3, 1, E.back(clamp(st))) * (1 + .05 * Math.sin((s.t || 0) * 5) * clamp(st)), o: clamp(st * 3) });
      tf(q('.mu-note'), { o: clamp((s.note || 0) * 2), y: (1 - E.out(clamp(s.note || 0))) * 20 });
    }
    return { el, draw, att: q('.mu-att'), btn: q('.mu-btn') };
  }

  // ------------------------------------------------------------------ sender ↔ recipient diagram (1080 × 720 box)
  // Outgoing (send) = blue upper arc A→B. Verify = lavender magnifier on A. Acknowledgment = green lower arc B→A.
  function diagram({ aLabel = 'หน่วยงาน A', aRole = 'ผู้ส่ง', bLabel = 'หน่วยงาน B', bRole = 'ผู้รับ' } = {}) {
    const AX = 190, BX = 890, NY = 250;
    const OUT = `M310 200 C420 40 660 40 770 200`, RET = `M770 330 C660 490 420 490 310 330`;
    const node = (x, lab, role, col) => `<div class="dg-node" style="position:absolute;left:${x - 130}px;top:${NY - 150}px;width:260px;display:flex;flex-direction:column;align-items:center">
        ${IC.building(220, col === 'pink' ? '#F5A9C7' : '#95BFEF', col === 'pink' ? '#EE7FAA' : '#5E8FD6')}
        <div style="margin-top:6px;padding:6px 24px;border-radius:24px;background:#fff;box-shadow:0 8px 18px rgba(110,90,150,.16);font-weight:800;font-size:36px;white-space:nowrap">${lab}</div>
        <div style="margin-top:6px;padding:2px 18px;border-radius:16px;background:${col === 'pink' ? '#EE7FAA' : '#5E8FD6'};color:#fff;font-weight:700;font-size:28px">${role}</div></div>`;
    const el = h(`<div style="position:absolute;left:0;width:1080px;height:720px">
      <svg width="1080" height="720" style="position:absolute;inset:0;overflow:visible">
        <path class="dg-outT" d="${OUT}" fill="none" stroke="rgba(94,143,214,.18)" stroke-width="14" stroke-linecap="round"/>
        <path class="dg-out" d="${OUT}" fill="none" stroke="${BLUE}" stroke-width="10" stroke-linecap="round"/>
        <path class="dg-pend" d="${RET}" fill="none" stroke="#B7C2D4" stroke-width="8" stroke-linecap="round" stroke-dasharray="4 22"/>
        <path class="dg-retT" d="${RET}" fill="none" stroke="rgba(38,162,105,.16)" stroke-width="14" stroke-linecap="round"/>
        <path class="dg-ret" d="${RET}" fill="none" stroke="${GREEN}" stroke-width="10" stroke-linecap="round"/>
        <g class="dg-outHead"><path d="M-14 -12 L8 0 L-14 12" fill="none" stroke="${BLUE}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g>
        <g class="dg-retHead"><path d="M-14 -12 L8 0 L-14 12" fill="none" stroke="${GREEN}" stroke-width="9" stroke-linecap="round" stroke-linejoin="round"/></g></svg>
      ${node(AX, aLabel, aRole, 'blue')}${node(BX, bLabel, bRole, 'pink')}
      <div class="dg-pk" style="position:absolute;left:0;top:0">${IC.env(104)}</div>
      <div class="dg-ak" style="position:absolute;left:0;top:0">${IC.envCheck(104)}</div>
      <div class="dg-dots"></div>
      <div class="dg-mag" style="position:absolute;left:${AX - 10}px;top:${NY - 120}px">${IC.mag(110)}</div>
      <div class="dg-sent c" style="position:absolute;left:${AX - 140}px;width:280px;top:${NY + 210}px;display:flex;justify-content:center"><div class="pill" style="font-size:32px;padding:8px 24px;color:#fff;background:${BLUE};box-shadow:0 8px 18px rgba(94,143,214,.4)">${IC.send(30)}ส่งแล้ว</div></div>
      <div class="dg-ver c" style="position:absolute;left:${AX - 170}px;width:340px;top:${NY + 278}px;display:flex;justify-content:center"><div class="pill" style="font-size:30px;padding:8px 22px;color:#fff;background:${LAV};box-shadow:0 8px 18px rgba(156,143,230,.4)"><span class="dg-vic" style="display:inline-grid">${IC.mag(34, '#fff')}</span>ตรวจสอบผลการส่ง</div></div>
      <div class="dg-ack c" style="position:absolute;left:${BX - 160}px;width:320px;top:${NY + 210}px;display:flex;justify-content:center"><div class="pill" style="font-size:32px;padding:8px 24px;color:#fff;background:${GREEN};box-shadow:0 8px 18px rgba(38,162,105,.4)">${IC.check(36, 'rgba(255,255,255,.25)')}แจ้งตอบรับ</div></div>
      <div class="dg-penC c" style="position:absolute;left:190px;width:700px;top:${NY + 370}px;display:flex;justify-content:center"><div class="pill" style="font-size:36px;padding:12px 32px;color:#B4572B;background:#FFF3DF;box-shadow:0 0 0 4px #FFD9A0,0 10px 22px rgba(200,140,60,.25)">${IC.hour(46)}ยังไม่ได้รับแจ้งตอบรับ</div></div>
      <div class="dg-done c" style="position:absolute;left:140px;width:800px;top:${NY + 370}px;display:flex;justify-content:center"><div class="pill" style="font-size:42px;font-weight:800;padding:14px 38px;color:#fff;background:linear-gradient(90deg,#26A269,#5FDC9B);box-shadow:0 14px 30px rgba(38,162,105,.4),0 0 0 6px #fff">${IC.check(52, 'rgba(255,255,255,.28)')}ได้รับแจ้งตอบรับแล้ว</div></div>
    </div>`);
    const q = s => el.querySelector(s);
    const pOut = q('.dg-out'), pRet = q('.dg-ret'), LO = pOut.getTotalLength(), LR = pRet.getTotalLength();
    [pOut, pRet].forEach((p, i) => { const L = i ? LR : LO; p.setAttribute('stroke-dasharray', `${L} ${L}`); });
    const dots = [...Array(5)].map(() => { const d = h(`<div style="position:absolute;width:16px;height:16px;border-radius:50%;background:#B8D9F8;box-shadow:0 0 12px #95BFEF"></div>`); q('.dg-dots').appendChild(d); return d; });
    const at = (p, L, u) => p.getPointAtLength(clamp(u) * L);
    function head(g, p, L, u, o) { const a = at(p, L, u), b = at(p, L, Math.min(1, u + .01)), a0 = at(p, L, Math.max(0, u - .01)); const ang = Math.atan2(b.y - a0.y, b.x - a0.x) * 180 / Math.PI; g.setAttribute('transform', `translate(${a.x} ${a.y}) rotate(${ang})`); g.style.opacity = o; }
    // s: { t, line 0..1 (out arc drawn), send 0..1 (packet), sent, pend, verify 0..1 (≥1 → checked), ackGen, ret 0..1 (ret arc drawn), ack 0..1 (packet back), done }
    function draw(s) {
      const t = s.t || 0, ln = clamp(s.line ?? s.send ?? 0), sd = clamp(s.send || 0), rl = clamp(s.ret ?? s.ack ?? 0), ak = clamp(s.ack || 0);
      pOut.setAttribute('stroke-dashoffset', LO * (1 - ln)); head(q('.dg-outHead'), pOut, LO, ln, ln > .02 ? 1 : 0);
      pRet.setAttribute('stroke-dashoffset', LR * (1 - rl)); head(q('.dg-retHead'), pRet, LR, rl, rl > .02 ? 1 : 0);
      q('.dg-pend').style.opacity = clamp(s.pend || 0) * (1 - rl); q('.dg-pend').setAttribute('stroke-dashoffset', -t * 30);
      const pk = q('.dg-pk'), a = at(pOut, LO, E.inOut(sd));
      tf(pk, { x: a.x - 52, y: a.y - 38 + Math.sin(sd * Math.PI) * -6, s: .55 + .45 * Math.sin(Math.PI * Math.min(1, sd * 1.4)) + (sd >= 1 ? .2 : 0), o: sd > 0 && sd < 1 ? 1 : 0 });
      dots.forEach((d, i) => { const u = sd - i * .05; const p = at(pOut, LO, E.inOut(clamp(u))); tf(d, { x: p.x - 8, y: p.y - 8, s: 1 - i * .15, o: u > 0 && sd < 1 ? .9 - i * .15 : 0 }); });
      const ak2 = q('.dg-ak'), b = at(pRet, LR, E.inOut(ak));
      tf(ak2, { x: b.x - 52, y: b.y - 38, s: .6 + .4 * Math.sin(Math.PI * Math.min(1, ak * 1.4)), o: ak > 0 && ak < 1 ? 1 : 0 });
      tf(q('.dg-sent'), { s: lerp(.3, 1, E.back(clamp(s.sent || 0))), o: clamp((s.sent || 0) * 3) });
      const vf = s.verify || 0;
      const ang = vf * Math.PI * 4;
      tf(q('.dg-mag'), { x: Math.cos(ang) * 40, y: Math.sin(ang) * 26, o: vf > 0 && vf < 1.15 ? clamp(vf * 6) * (1 - clamp((vf - 1) / .15)) : 0, s: 1 });
      tf(q('.dg-ver'), { s: lerp(.3, 1, E.back(clamp(vf * 1.6))), o: clamp(vf * 4) });
      q('.dg-vic').innerHTML = vf >= 1 ? IC.check(34, 'rgba(255,255,255,.3)') : IC.mag(34, '#fff');
      tf(q('.dg-ack'), { s: lerp(.3, 1, E.back(clamp(s.ackGen || 0))) * (1 + .06 * Math.max(0, 1 - Math.abs((s.ackGen || 0) - 1.2) * 3)), o: clamp((s.ackGen || 0) * 3) });
      const pc = clamp(s.pend || 0) * (1 - clamp(s.done || 0) * 3);
      tf(q('.dg-penC'), { s: lerp(.5, 1, E.back(clamp(s.pend || 0))), o: clamp(pc * 3), x: Math.sin(t * 9) * 4 * clamp(s.pend || 0) * (1 - clamp((s.pend || 0) - 1)) });
      const dn = s.done || 0; tf(q('.dg-done'), { s: lerp(.3, 1, E.elastic(clamp(dn))), o: clamp(dn * 4) });
      const nodes = el.querySelectorAll('.dg-node');
      nodes[0].style.transform = `scale(${1 + .06 * Math.max(0, 1 - Math.abs(ak - 1) * 6) * (ak > 0 ? 1 : 0)})`;
      nodes[1].style.transform = `scale(${1 + .06 * Math.max(0, 1 - Math.abs(sd - 1) * 6) * (sd > 0 ? 1 : 0)})`;
    }
    return { el, draw, AX, BX, NY };
  }

  // ------------------------------------------------------------------ printer (front view)
  function printer(w = 400) {
    const k = w / 400, N = 7;
    const el = h(`<div style="position:relative;width:${w}px;height:${w * .95}px">
      <div style="position:absolute;transform:scale(${k});transform-origin:0 0;left:0;top:0;width:400px;height:380px">
        <div style="position:absolute;left:90px;top:0;width:220px;height:90px;border-radius:10px 10px 0 0;background:#fff;box-shadow:inset 0 -4px 0 #E6EAF2"><div style="position:absolute;left:20px;right:20px;top:18px;height:8px;border-radius:4px;background:#E6EAF2"></div><div style="position:absolute;left:20px;right:40px;top:36px;height:8px;border-radius:4px;background:#E6EAF2"></div></div>
        <div style="position:absolute;left:60px;top:60px;width:280px;height:30px;border-radius:12px 12px 0 0;background:#C9D3E4"></div>
        <div style="position:absolute;left:0;top:84px;width:400px;height:190px;border-radius:34px;background:linear-gradient(180deg,#F4F7FC,#D8E1EF);box-shadow:0 20px 34px rgba(60,70,120,.25),inset 0 4px 0 #fff">
          <div style="position:absolute;left:280px;top:30px;width:90px;height:44px;border-radius:12px;background:#31445D"><div class="pr-led" style="position:absolute;left:12px;top:14px;width:16px;height:16px;border-radius:50%;background:#5FDC9B"></div><div style="position:absolute;left:38px;top:14px;width:16px;height:16px;border-radius:50%;background:#95BFEF"></div><div style="position:absolute;left:62px;top:16px;width:14px;height:12px;border-radius:3px;background:#5A6A85"></div></div>
          <div style="position:absolute;left:50px;top:118px;width:300px;height:26px;border-radius:13px;background:#2E3B52"></div></div>
        <div class="pr-sheets" style="position:absolute;left:0;top:0;width:400px;height:380px"></div>
        <div style="position:absolute;left:30px;top:300px;width:340px;height:40px;border-radius:0 0 22px 22px;background:linear-gradient(180deg,#C9D3E4,#AEBBD2);box-shadow:0 14px 20px rgba(60,70,120,.2)"></div>
        <div class="pr-glow" style="position:absolute;left:-30px;top:40px;width:460px;height:320px;border-radius:50px;box-shadow:0 0 0 8px #E0517F,0 0 40px 10px rgba(224,81,127,.5);opacity:0"></div>
      </div></div>`);
    const box = el.querySelector('.pr-sheets');
    const sheets = [...Array(N)].map((_, i) => { const s = h(`<div style="position:absolute;left:${80 + (i % 2) * 6}px;top:216px;width:240px;height:130px;transform-origin:50% 0;background:#fff;border-radius:6px;box-shadow:0 3px 0 #E1E7F1;overflow:hidden"><div style="position:absolute;left:24px;right:30px;top:24px;height:8px;border-radius:4px;background:#DCE6F4"></div><div style="position:absolute;left:24px;right:60px;top:44px;height:8px;border-radius:4px;background:#DCE6F4"></div><div style="position:absolute;left:24px;right:40px;top:64px;height:8px;border-radius:4px;background:#DCE6F4"></div></div>`); box.appendChild(s); return s; });
    // s: { feed (sheets emitted, float), frozen 0..1, retract 0..1 (last sheet pulled back), t }
    function draw(s) {
      const f = s.feed || 0, t = s.t || 0;
      sheets.forEach((sh, i) => {
        const u = clamp(f - i), stackY = 10 - Math.min(i, 5) * 7;
        let sy = lerp(0, 1, E.out(u)), y = 0;
        if (i === Math.floor(f) && s.retract) sy *= 1 - E.inOut(clamp(s.retract));
        y = u >= 1 ? stackY : 0;
        sh.style.transform = `translateY(${y + (s.shake || 0) * Math.sin(t * 50) * 2}px) scaleY(${sy}) rotate(${(i % 2 ? 1 : -1) * 1.5 * clamp(u)}deg)`;
        sh.style.opacity = u > 0.01 ? 1 : 0;
      });
      const fr = clamp(s.frozen || 0);
      el.querySelector('.pr-led').style.background = fr > .5 ? '#E0517F' : (Math.floor(t * 4) % 2 && f > 0 && f < N ? '#5FDC9B' : '#9FE6C2');
      el.querySelector('.pr-glow').style.opacity = fr * (.55 + .45 * Math.sin(t * 8));
    }
    return { el, draw, N };
  }

  window.OFFICE = { set, monitor, mailUI, diagram, printer, IC, BLUE, GREEN, LAV };
})();
