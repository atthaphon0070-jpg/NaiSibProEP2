// NaiSibPro EP.61 — government document office set, document officer and OfficialDocumentSorter.
// Screen-space 1080 × 1920 set. The officer is the shared jointed rig (props_story.js, look 'G'), seated behind the desk.
(function () {
  const { h, clamp, lerp, E, P, tf } = window.NSP;
  const BLUE = '#2F6BFF', SKY = '#95BFEF', ICE = '#E6F4FF', PINK = '#EE7FAA', PPINK = '#F7A8C4', BLUSH = '#FFE3EF';

  function office(root) {
    root.insertAdjacentHTML('beforeend', `
    <div class="of-world abs" style="left:0;top:0;width:1080px;height:1920px;transform-origin:540px 1100px">
      <svg class="abs" style="left:0;top:0" width="1080" height="1920" viewBox="0 0 1080 1920">
        <defs>
          <linearGradient id="ofWB" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EEF7FF"/><stop offset="1" stop-color="#D3E7FB"/></linearGradient>
          <linearGradient id="ofWP" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1F7"/><stop offset="1" stop-color="#FBD7E6"/></linearGradient>
          <linearGradient id="ofFl" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#EAD3BE"/><stop offset="1" stop-color="#D9BB9F"/></linearGradient>
        </defs>
        <rect x="0" y="0" width="540" height="1480" fill="url(#ofWB)"/><rect x="540" y="0" width="540" height="1480" fill="url(#ofWP)"/>
        <rect x="0" y="1060" width="1080" height="16" fill="#fff" opacity=".7"/>
        <rect x="0" y="1480" width="1080" height="440" fill="url(#ofFl)"/>
        ${[...Array(7)].map((_, i) => `<path d="M${-200 + i * 220} 1920 L${180 + i * 150} 1480" stroke="#CFAE8F" stroke-width="4" opacity=".55"/>`).join('')}
        <ellipse cx="540" cy="1700" rx="470" ry="130" fill="#F7A8C4" opacity=".55"/><ellipse cx="540" cy="1700" rx="400" ry="100" fill="none" stroke="#fff" stroke-width="8" stroke-dasharray="20 16" opacity=".8"/>
        <g transform="translate(70 1560)"><path d="M10 120 L20 200 H90 L100 120Z" fill="#2F6BFF"/><path d="M55 120 C20 60 0 40 10 0 C40 30 55 70 55 120 C60 60 80 20 110 10 C110 60 80 90 55 120Z" fill="#7BC89A"/></g>
        <g transform="translate(900 1560)"><path d="M10 120 L20 200 H90 L100 120Z" fill="#EE7FAA"/><path d="M55 120 C20 60 0 40 10 0 C40 30 55 70 55 120 C60 60 80 20 110 10 C110 60 80 90 55 120Z" fill="#7BC89A"/></g>
        <!-- window -->
        <g transform="translate(330 640)"><rect x="0" y="0" width="420" height="250" rx="22" fill="#fff"/><rect x="14" y="14" width="190" height="222" rx="12" fill="#CFE6FF"/><rect x="216" y="14" width="190" height="222" rx="12" fill="#FFDDEA"/>
          <circle cx="330" cy="70" r="30" fill="#FFF3C4"/><path d="M30 200 Q90 150 150 190 T204 180 V236 H14Z" fill="#B8D9F8"/><path d="M216 190 Q280 140 340 185 T406 170 V236 H216Z" fill="#F7BCD3"/>
          <ellipse cx="90" cy="70" rx="44" ry="16" fill="#fff" opacity=".9"/><ellipse cx="290" cy="120" rx="40" ry="14" fill="#fff" opacity=".9"/></g>
        <!-- blue filing cabinet (left) -->
        <g transform="translate(36 740)"><rect x="0" y="0" width="230" height="440" rx="18" fill="${SKY}"/><rect x="0" y="0" width="230" height="440" rx="18" fill="none" stroke="#7FAAE0" stroke-width="5"/>
          ${[0, 1, 2].map(i => `<rect x="18" y="${22 + i * 140}" width="194" height="122" rx="12" fill="#B8D9F8"/><rect x="85" y="${72 + i * 140}" width="60" height="16" rx="8" fill="#fff"/><rect x="70" y="${42 + i * 140}" width="90" height="22" rx="5" fill="#fff" opacity=".85"/>`).join('')}
          <rect x="30" y="-70" width="60" height="70" rx="6" fill="${BLUE}" opacity=".85"/><rect x="96" y="-84" width="52" height="84" rx="6" fill="#7FB2F0"/><rect x="154" y="-62" width="46" height="62" rx="6" fill="${PPINK}"/></g>
        <!-- pink shelf (right) -->
        <g transform="translate(820 690)"><rect x="0" y="0" width="226" height="490" rx="18" fill="${PPINK}"/><rect x="14" y="14" width="198" height="462" rx="12" fill="#FFE3EF"/>
          ${[0, 1, 2].map(r => `<rect x="14" y="${150 + r * 150}" width="198" height="12" fill="${PPINK}"/>` + [0, 1, 2, 3, 4].map(i => `<rect x="${28 + i * 36}" y="${50 + r * 150 + (i % 2) * 10}" width="28" height="${100 - (i % 2) * 10}" rx="5" fill="${['#EE7FAA', '#95BFEF', '#F7A8C4', '#2F6BFF', '#FF91BA'][(i + r) % 5]}"/>`).join('')).join('')}</g>
        <!-- clock -->
        <g transform="translate(220 560)"><circle r="62" fill="#fff" stroke="${SKY}" stroke-width="10"/><circle r="6" fill="#31445D"/><path class="of-hand" d="M0 0 V-40" stroke="#31445D" stroke-width="7" stroke-linecap="round"/><path class="of-hand2" d="M0 0 H30" stroke="${PINK}" stroke-width="6" stroke-linecap="round"/></g>
      </svg>
      <div class="of-actor abs" style="left:0;top:0"></div>
      <svg class="abs" style="left:0;top:0" width="1080" height="1920" viewBox="0 0 1080 1920">
        <!-- desk -->
        <rect x="40" y="1212" width="1000" height="268" rx="10" fill="#E5C49E"/>
        <rect x="70" y="1236" width="420" height="218" rx="16" fill="#EED3B2"/><rect x="590" y="1236" width="420" height="218" rx="16" fill="#EED3B2"/>
        <rect x="250" y="1430" width="60" height="12" rx="6" fill="#C9A47C"/><rect x="770" y="1430" width="60" height="12" rx="6" fill="#C9A47C"/>
        <rect x="24" y="1176" width="1032" height="44" rx="14" fill="#F3DDC1"/><rect x="24" y="1206" width="1032" height="14" rx="7" fill="#D6B08A"/>
        <!-- lamp -->
        <g transform="translate(60 1000)"><rect x="20" y="168" width="90" height="16" rx="8" fill="#31445D"/><path d="M62 170 L62 70 L104 30" stroke="#31445D" stroke-width="10" fill="none" stroke-linecap="round"/>
          <path d="M80 0 L150 28 L112 70 Z" fill="${PINK}"/><circle cx="104" cy="30" r="10" fill="#31445D"/><path d="M118 66 L150 118" stroke="#FFE7A0" stroke-width="22" opacity=".35" stroke-linecap="round"/></g>
        <!-- monitor -->
        <g transform="translate(880 1000)"><rect x="70" y="150" width="40" height="30" fill="#9AA7BD"/><rect x="40" y="172" width="100" height="12" rx="6" fill="#7A879D"/>
          <rect x="0" y="0" width="180" height="156" rx="16" fill="#31445D"/><rect x="10" y="10" width="160" height="124" rx="8" fill="${ICE}"/>
          <rect x="24" y="24" width="56" height="74" rx="6" fill="#fff" stroke="${SKY}" stroke-width="4"/><rect x="96" y="24" width="56" height="74" rx="6" fill="#fff" stroke="${PPINK}" stroke-width="4"/>
          <rect x="24" y="108" width="128" height="12" rx="6" fill="${SKY}"/></g>
        <!-- trays -->
        <g transform="translate(180 1118)"><path d="M0 26 L250 26 L232 92 L18 92 Z" fill="${BLUE}"/><path d="M0 26 L250 26 L246 40 L4 40Z" fill="#6E9BFF"/>
          <rect x="34" y="4" width="182" height="30" rx="4" fill="#fff" class="tray-paper"/></g>
        <g transform="translate(650 1118)"><path d="M0 26 L250 26 L232 92 L18 92 Z" fill="${PINK}"/><path d="M0 26 L250 26 L246 40 L4 40Z" fill="#FFA3C6"/>
          <rect x="34" y="4" width="182" height="30" rx="4" fill="#fff"/></g>
      </svg>
      <div class="of-plq abs c" style="left:120px;top:1262px;width:370px;height:150px;border-radius:26px;background:linear-gradient(180deg,#fff,${ICE});box-shadow:0 10px 20px rgba(47,107,255,.2),0 0 0 6px ${SKY};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px">
        <div style="font-weight:800;font-size:40px;color:${BLUE}">หนังสือภายใน</div><div class="plq-sub" style="font-weight:700;font-size:28px;color:#31445D">กระดาษบันทึกข้อความ</div></div>
      <div class="of-plq abs c" style="left:590px;top:1262px;width:370px;height:150px;border-radius:26px;background:linear-gradient(180deg,#fff,${BLUSH});box-shadow:0 10px 20px rgba(238,127,170,.25),0 0 0 6px ${PPINK};display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px">
        <div style="font-weight:800;font-size:40px;color:#D9558C">หนังสือภายนอก</div><div class="plq-sub" style="font-weight:700;font-size:28px;color:#31445D">กระดาษตราครุฑ</div></div>
    </div>`);
    const world = root.querySelector('.of-world');
    const ch = STORY.character('G');
    const wrap = h('<div style="position:absolute;left:0;top:0;transform-origin:0 0"></div>'); wrap.appendChild(ch);
    root.querySelector('.of-actor').appendChild(wrap);
    const FX = 540, FY = 1392, S = .98;
    wrap.style.transform = `translate(${FX}px,${FY}px) scale(${S})`;
    const plaques = [...root.querySelectorAll('.of-plq')], subs = [...root.querySelectorAll('.plq-sub')];
    const hands = root.querySelectorAll('.of-hand'), hand2 = root.querySelector('.of-hand2');
    return {
      world, ch, plaques, subs,
      cam(z = 1, dx = 0, dy = 0) { world.style.transform = `translate(${dx}px,${dy}px) scale(${z})`; },
      pose(p) { ch.pose(p); },
      hand() { const q = ch.handR(); return { x: FX + q.x * S, y: FY + q.y * S }; },
      clock(t) { hands[0].setAttribute('transform', `rotate(${t * 6})`); hand2.setAttribute('transform', `rotate(${t * 40})`); },
    };
  }

  // ---------------- OfficialDocumentSorter: two documents → two folders (states 1..5) ----------------
  // folder(kind): an open folder card that a mini document drops into; stamp ✓ on confirmation.
  function folder(kind) {
    const blue = kind === 'memo';
    const c1 = blue ? BLUE : PINK, c2 = blue ? SKY : PPINK, txt = blue ? 'กระดาษบันทึกข้อความ' : 'กระดาษตราครุฑ', who = blue ? 'หนังสือภายใน' : 'หนังสือภายนอก';
    const el = h(`<div class="abs c" style="left:0;top:0;width:340px;height:300px">
      <div style="position:absolute;left:0;top:30px;width:150px;height:60px;border-radius:22px 22px 0 0;background:${c1}"></div>
      <div style="position:absolute;left:0;top:60px;width:340px;height:240px;border-radius:0 26px 26px 26px;background:${c1};box-shadow:0 18px 30px ${blue ? 'rgba(47,107,255,.3)' : 'rgba(238,127,170,.35)'}"></div>
      <div class="fd-slot" style="position:absolute;left:70px;top:0;width:200px;height:240px"></div>
      <div class="fd-front" style="position:absolute;left:0;top:118px;width:340px;height:182px;border-radius:26px;background:linear-gradient(180deg,${c2},${c1});transform-origin:50% 100%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:2px;color:#fff">
        <div style="font-weight:700;font-size:28px;opacity:.95">${who}</div><div style="font-weight:800;font-size:${blue ? 32 : 38}px;white-space:nowrap">${txt}</div></div>
      <div class="fd-ok abs c" style="right:-20px;top:70px;width:84px;height:84px;border-radius:50%;background:#22C55E;display:grid;place-items:center;box-shadow:0 0 0 7px #fff,0 10px 20px rgba(34,197,94,.4)">${NSP.ICON.check('#fff', 52)}</div></div>`);
    const d = DOCS.doc(blue ? 'memo' : 'letter', 150, { frame: false });
    el.querySelector('.fd-slot').appendChild(d);
    return { el, d, front: el.querySelector('.fd-front'), ok: el.querySelector('.fd-ok') };
  }
  // draw sorter: u local time; a = docs drop time, b = confirm time
  function drawFolder(f, u, at, drop, ok) {
    tf(f.el, NSP.life(u, at, 1e9, { from: .4, dy: 60, el: true, d: .8 }));
    const k = E.out(P(u, drop, .55));
    tf(f.d, { x: 25, y: lerp(-420, 40, k), r: lerp(-14, -4, k), o: clamp((u - drop) * 6) });
    f.front.style.transform = `perspective(700px) rotateX(${lerp(0, 22, Math.sin(clamp((u - drop) / .6) * Math.PI))}deg)`;
    tf(f.ok, { s: E.elastic(P(u, ok, .8)), o: clamp((u - ok) * 6), r: (1 - E.out(P(u, ok, .5))) * -60 });
  }

  window.OFFICE = { office, folder, drawFolder };
})();
