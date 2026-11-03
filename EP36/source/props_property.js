// NaiSibPro EP.36 — property props (original SVG art): house + land, car, large ship,
// motorcycle, phone, table, chair, tree, raft, beast of burden (buffalo), stamp, offices.
// Every prop returns an element sized to w px; moving parts are exposed as properties.
(function () {
  const { h } = window.NSP;
  let uid = 0;
  const svg = (w, vw, vh, body, extra = '') => h(`<div style="position:relative;width:${w}px;height:${w * vh / vw}px${extra}"><svg width="${w}" height="${w * vh / vw}" viewBox="0 0 ${vw} ${vh}" style="position:absolute;inset:0;overflow:visible">${body}</svg></div>`);

  // ---------------- house on its land plot (immovable anchor) ----------------
  function houseLand(w = 420) {
    const g = 'hl' + (++uid);
    const el = svg(w, 420, 360, `
      <defs><linearGradient id="${g}g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9BE3B5"/><stop offset="1" stop-color="#5CC48A"/></linearGradient>
        <linearGradient id="${g}s" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#C9A27C"/><stop offset="1" stop-color="#9C7650"/></linearGradient></defs>
      <ellipse cx="210" cy="340" rx="196" ry="16" fill="rgba(60,70,120,.16)"/>
      <path d="M14 270 L406 270 L392 326 L28 326Z" fill="url(#${g}s)"/>
      <path d="M40 300h40M120 312h30M230 300h50M330 314h34" stroke="rgba(255,255,255,.25)" stroke-width="6" stroke-linecap="round"/>
      <path d="M6 238 Q210 214 414 238 L406 276 L14 276Z" fill="url(#${g}g)"/>
      <path d="M30 246 Q210 228 392 246" stroke="rgba(255,255,255,.55)" stroke-width="5" fill="none" stroke-linecap="round"/>
      <g class="tree"><rect x="338" y="150" width="16" height="96" rx="7" fill="#9C7650"/>
        <circle cx="346" cy="132" r="46" fill="#5CC48A"/><circle cx="322" cy="150" r="30" fill="#4DB37C"/><circle cx="370" cy="148" r="30" fill="#6FD39A"/><circle cx="334" cy="116" r="14" fill="rgba(255,255,255,.35)"/></g>
      <path d="M210 140 L270 112 L270 236 L210 246Z" fill="#C9D9F5"/>
      <rect x="70" y="140" width="142" height="106" rx="8" fill="#FFF8F1"/>
      <path d="M52 148 L141 70 L230 148Z" fill="#EE7FAA" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>
      <path d="M141 70 L196 46 L284 118 L230 148Z" fill="#D9608F"/>
      <rect x="90" y="168" width="40" height="38" rx="8" fill="#95BFEF" stroke="#fff" stroke-width="5"/><path d="M110 168v38M90 187h40" stroke="#fff" stroke-width="4"/>
      <rect x="152" y="176" width="44" height="70" rx="20" fill="#2F6BFF"/><circle cx="186" cy="214" r="4" fill="#fff"/>
      <path d="M218 158 L262 140 V176 L218 192Z" fill="#95BFEF" opacity=".9"/>
      <g class="peg"><rect x="28" y="214" width="12" height="44" rx="3" fill="#fff" stroke="#31445D" stroke-width="3"/><rect x="26" y="208" width="16" height="12" rx="3" fill="#EF4444"/></g>
      <g class="peg"><rect x="386" y="214" width="12" height="44" rx="3" fill="#fff" stroke="#31445D" stroke-width="3"/><rect x="384" y="208" width="16" height="12" rx="3" fill="#EF4444"/></g>
      <path class="anchor" d="M70 246 V266 M212 246 V266" stroke="#31445D" stroke-width="5" stroke-linecap="round" opacity="0"/>`);
    el.tree = el.querySelector('.tree');
    return el;
  }

  // ---------------- car (movable; has a vehicle registration plate) ----------------
  function car(w = 380, body = '#2F6BFF') {
    const el = svg(w, 380, 200, `
      <ellipse cx="190" cy="188" rx="172" ry="11" fill="rgba(60,70,120,.18)"/>
      <path d="M22 140 Q18 104 52 98 L104 92 Q138 46 196 44 Q256 42 296 92 L338 100 Q364 106 362 140 L358 160 Q356 168 346 168 L34 168 Q24 168 22 158Z" fill="${body}"/>
      <path d="M118 92 Q146 60 194 58 L196 92Z" fill="#CFE6FF"/><path d="M208 58 Q252 60 280 92 L208 92Z" fill="#CFE6FF"/>
      <path d="M126 86 Q142 70 160 66" stroke="#fff" stroke-width="5" stroke-linecap="round" fill="none" opacity=".8"/>
      <path d="M30 122 H352" stroke="rgba(255,255,255,.35)" stroke-width="5"/>
      <rect x="196" y="104" width="22" height="7" rx="3.5" fill="rgba(255,255,255,.75)"/><rect x="114" y="104" width="22" height="7" rx="3.5" fill="rgba(255,255,255,.75)"/>
      <path d="M340 112 h18 v14 h-16z" fill="#FFD23F"/><path d="M24 112 h14 v14 h-16z" fill="#EF4444" opacity=".85"/>
      <g class="plate"><rect x="146" y="134" width="88" height="30" rx="6" fill="#fff" stroke="#31445D" stroke-width="3"/>
        <text x="190" y="155" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="16" fill="#31445D">กข 1234</text></g>
      <g class="whL" transform="translate(94 166)"><circle r="30" fill="#31445D"/><circle r="15" fill="#C9D3E3"/><path d="M0 -15V15M-15 0H15" stroke="#8D9BB3" stroke-width="4"/></g>
      <g class="whR" transform="translate(290 166)"><circle r="30" fill="#31445D"/><circle r="15" fill="#C9D3E3"/><path d="M0 -15V15M-15 0H15" stroke="#8D9BB3" stroke-width="4"/></g>`);
    const wl = el.querySelector('.whL'), wr = el.querySelector('.whR');
    el.spin = a => { wl.setAttribute('transform', `translate(94 166) rotate(${a})`); wr.setAttribute('transform', `translate(290 166) rotate(${a})`); };
    return el;
  }

  // ---------------- large ship (≥ 5 tons; special movable under s.456 para 1) ----------------
  function ship(w = 440) {
    const g = 'sh' + (++uid);
    const el = svg(w, 440, 300, `
      <defs><linearGradient id="${g}h" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1F3D73"/><stop offset="1" stop-color="#142B53"/></linearGradient>
        <linearGradient id="${g}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7FD9F0"/><stop offset="1" stop-color="#2F6BFF"/></linearGradient></defs>
      <g class="hull">
        <rect x="236" y="36" width="34" height="56" rx="6" fill="#EE7FAA"/><rect x="236" y="36" width="34" height="12" rx="5" fill="#142B53"/>
        <rect x="124" y="84" width="200" height="70" rx="12" fill="#fff"/><rect x="150" y="56" width="120" height="40" rx="10" fill="#F4F8FF"/>
        ${[0, 1, 2, 3, 4].map(i => `<rect x="${140 + i * 36}" y="104" width="24" height="20" rx="5" fill="#95BFEF"/>`).join('')}
        ${[0, 1, 2].map(i => `<rect x="${164 + i * 34}" y="66" width="20" height="16" rx="4" fill="#95BFEF"/>`).join('')}
        <path d="M30 150 H420 L384 236 Q378 248 364 248 H86 Q72 248 66 236Z" fill="url(#${g}h)"/>
        <path d="M44 172 H408" stroke="#EE7FAA" stroke-width="10"/>
        <circle cx="110" cy="204" r="9" fill="#fff" opacity=".85"/><circle cx="140" cy="204" r="9" fill="#fff" opacity=".85"/>
        <text x="300" y="218" text-anchor="middle" font-family="Prompt" font-weight="800" font-size="24" fill="#fff" opacity=".9">NSP-36</text>
        <path d="M384 150 L420 150 L410 172" fill="#2F6BFF"/>
        <path d="M70 140 Q66 110 82 96" stroke="#31445D" stroke-width="4" fill="none"/><path d="M82 96 l18 8 -18 8z" fill="#FFD23F"/></g>
      <g class="waves"><path d="M-10 246 Q20 232 50 246 T110 246 T170 246 T230 246 T290 246 T350 246 T410 246 T470 246 V300 H-10Z" fill="url(#${g}w)" opacity=".9"/>
        <path d="M-10 258 Q20 246 50 258 T110 258 T170 258 T230 258 T290 258 T350 258 T410 258 T470 258" stroke="#fff" stroke-width="5" fill="none" opacity=".7"/></g>`);
    el.hull = el.querySelector('.hull'); el.waves = el.querySelector('.waves');
    el.rock = t => { el.hull.setAttribute('transform', `translate(0 ${Math.sin(t * 2) * 4}) rotate(${Math.sin(t * 1.6) * 1.6} 225 200)`); el.waves.setAttribute('transform', `translate(${-((t * 30) % 60)} 0)`); };
    return el;
  }

  function moto(w = 260) {
    return svg(w, 260, 180, `<ellipse cx="130" cy="170" rx="116" ry="9" fill="rgba(60,70,120,.16)"/>
      <circle cx="56" cy="134" r="34" fill="#31445D"/><circle cx="56" cy="134" r="15" fill="#C9D3E3"/><circle cx="206" cy="134" r="34" fill="#31445D"/><circle cx="206" cy="134" r="15" fill="#C9D3E3"/>
      <path d="M56 134 L104 90 H168 L206 134" stroke="#8D9BB3" stroke-width="8" fill="none" stroke-linejoin="round"/>
      <path d="M86 92 Q100 64 150 66 Q186 68 196 92 L168 112 H104Z" fill="#EE7FAA"/><path d="M98 70 H146" stroke="#31445D" stroke-width="14" stroke-linecap="round"/>
      <path d="M192 88 L206 46 M196 46 h22" stroke="#31445D" stroke-width="8" stroke-linecap="round"/><circle cx="212" cy="64" r="8" fill="#FFD23F"/>`);
  }
  function phone(w = 130) {
    return svg(w, 130, 230, `<rect x="6" y="6" width="118" height="218" rx="22" fill="#31445D"/><rect x="14" y="20" width="102" height="180" rx="12" fill="url(#none)" style="fill:#CFE6FF"/>
      <rect x="22" y="34" width="86" height="22" rx="6" fill="#fff"/><rect x="22" y="66" width="40" height="40" rx="10" fill="#EE7FAA"/><rect x="68" y="66" width="40" height="40" rx="10" fill="#2F6BFF"/>
      <rect x="22" y="112" width="40" height="40" rx="10" fill="#22D3EE"/><rect x="68" y="112" width="40" height="40" rx="10" fill="#FFD23F"/><rect x="52" y="208" width="26" height="6" rx="3" fill="#8D9BB3"/>`);
  }
  function table(w = 220) {
    return svg(w, 220, 150, `<ellipse cx="110" cy="144" rx="96" ry="7" fill="rgba(60,70,120,.14)"/><rect x="10" y="30" width="200" height="22" rx="8" fill="#C9A27C"/><rect x="10" y="30" width="200" height="8" rx="4" fill="#E2C29E"/>
      <rect x="28" y="50" width="16" height="92" rx="5" fill="#9C7650"/><rect x="176" y="50" width="16" height="92" rx="5" fill="#9C7650"/>`);
  }
  function chair(w = 130) {
    return svg(w, 130, 190, `<ellipse cx="65" cy="184" rx="56" ry="6" fill="rgba(60,70,120,.14)"/><rect x="22" y="10" width="86" height="90" rx="14" fill="#95BFEF"/><rect x="14" y="96" width="102" height="20" rx="8" fill="#2F6BFF"/>
      <rect x="22" y="114" width="12" height="68" rx="4" fill="#31445D"/><rect x="96" y="114" width="12" height="68" rx="4" fill="#31445D"/>`);
  }
  function tree(w = 160) {
    return svg(w, 160, 200, `<ellipse cx="80" cy="192" rx="60" ry="7" fill="rgba(60,70,120,.14)"/><path d="M20 176 Q80 160 140 176 L140 190 L20 190Z" fill="#5CC48A"/>
      <rect x="70" y="90" width="20" height="92" rx="8" fill="#9C7650"/><circle cx="80" cy="70" r="56" fill="#5CC48A"/><circle cx="48" cy="92" r="32" fill="#4DB37C"/><circle cx="114" cy="90" r="32" fill="#6FD39A"/><circle cx="62" cy="48" r="16" fill="rgba(255,255,255,.35)"/>`);
  }
  function raft(w = 240) {
    return svg(w, 240, 130, `<path d="M-6 96 Q24 84 54 96 T114 96 T174 96 T234 96 T254 96 V130 H-6Z" fill="#7FD9F0" opacity=".8"/>
      ${[0, 1, 2, 3, 4, 5].map(i => `<rect x="${18 + i * 34}" y="54" width="30" height="50" rx="12" fill="${i % 2 ? '#C9A27C' : '#B58B60'}"/><path d="M${24 + i * 34} 62 v34" stroke="rgba(255,255,255,.3)" stroke-width="4"/>`).join('')}
      <path d="M14 70 H226 M14 92 H226" stroke="#7A5A3A" stroke-width="5"/><rect x="104" y="6" width="6" height="52" fill="#7A5A3A"/><path d="M110 8 L150 26 L110 42Z" fill="#EE7FAA"/>`);
  }
  function buffalo(w = 240) {
    return svg(w, 240, 170, `<ellipse cx="120" cy="164" rx="100" ry="7" fill="rgba(60,70,120,.16)"/>
      <rect x="52" y="112" width="18" height="50" rx="8" fill="#5B6478"/><rect x="82" y="116" width="18" height="46" rx="8" fill="#4A5266"/><rect x="146" y="116" width="18" height="46" rx="8" fill="#4A5266"/><rect x="172" y="112" width="18" height="50" rx="8" fill="#5B6478"/>
      <ellipse cx="122" cy="96" rx="82" ry="44" fill="#6B7590"/><path d="M48 90 Q60 70 90 68" stroke="rgba(255,255,255,.25)" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M200 84 Q218 82 224 98" stroke="#6B7590" stroke-width="8" fill="none" stroke-linecap="round"/>
      <g transform="translate(40 70)"><path d="M-30 -24 Q-62 -40 -50 -2 M12 -24 Q44 -40 32 -2" stroke="#E8DCC8" stroke-width="10" fill="none" stroke-linecap="round"/>
        <ellipse cx="-9" cy="0" rx="30" ry="28" fill="#5B6478"/><ellipse cx="-9" cy="16" rx="20" ry="13" fill="#8C95AC"/><circle cx="-20" cy="-6" r="4" fill="#fff"/><circle cx="2" cy="-6" r="4" fill="#fff"/>
        <circle cx="-15" cy="17" r="2.5" fill="#31445D"/><circle cx="-3" cy="17" r="2.5" fill="#31445D"/></g>`);
  }
  // rubber stamp: label inside a dashed round frame
  function stamp(size = 200, label = 'ทะเบียน', color = '#2F6BFF') {
    return h(`<div style="position:relative;width:${size}px;height:${size}px;border-radius:50%;border:${size * .05}px solid ${color};display:grid;place-items:center;background:rgba(255,255,255,.88);box-shadow:0 10px 22px rgba(40,60,120,.2)">
      <div style="position:absolute;inset:${size * .07}px;border-radius:50%;border:${size * .02}px dashed ${color}"></div>
      <div style="font-weight:800;font-size:${size * .2}px;color:${color};line-height:1.1;text-align:center;white-space:nowrap">${label}</div></div>`);
  }
  // government office front with a flag and a sign
  function office(w = 260, sign = 'สำนักงาน', color = '#2F6BFF') {
    return h(`<div style="position:relative;width:${w}px;height:${w * .8}px">
      <svg width="${w}" height="${w * .8}" viewBox="0 0 260 208" style="position:absolute;inset:0;overflow:visible">
        <ellipse cx="130" cy="202" rx="120" ry="7" fill="rgba(60,70,120,.15)"/>
        <path d="M20 70 L130 20 L240 70Z" fill="${color}"/><rect x="30" y="70" width="200" height="16" fill="#E2ECFA"/>
        ${[0, 1, 2, 3, 4].map(i => `<rect x="${44 + i * 38}" y="88" width="18" height="96" rx="4" fill="#fff" stroke="#D7E3F3" stroke-width="3"/>`).join('')}
        <rect x="20" y="182" width="220" height="18" rx="4" fill="#C9D3E3"/>
        <rect x="200" y="0" width="5" height="42" fill="#31445D"/><path d="M205 2 h34 v20 h-34z" fill="#EE7FAA"/><path d="M205 9 h34 v6 h-34z" fill="#fff"/></svg>
      <div style="position:absolute;left:0;right:0;top:${w * .18}px;display:flex;justify-content:center"><span style="background:#fff;border-radius:10px;padding:1px 12px;font-weight:700;font-size:${w * .08}px;color:${color};white-space:nowrap">${sign}</span></div></div>`);
  }
  // simple paper with a red seal (contract in writing)
  function contract(w = 150, title = 'หนังสือสัญญา') {
    return h(`<div style="position:relative;width:${w}px;height:${w * 1.3}px;filter:drop-shadow(0 10px 14px rgba(60,70,120,.22))">
      <svg width="${w}" height="${w * 1.3}" viewBox="0 0 150 195" style="position:absolute;inset:0"><path d="M10 6 H112 L144 38 V186 Q144 190 140 190 H10 Q6 190 6 186 V10 Q6 6 10 6Z" fill="#fff"/><path d="M112 6 V32 Q112 38 118 38 H144Z" fill="#E2ECFA"/>
        <path d="M24 70h100M24 90h100M24 110h80M24 130h100" stroke="#DCE6F4" stroke-width="7" stroke-linecap="round"/><circle cx="110" cy="160" r="18" fill="#EF4444" opacity=".85"/><path d="M102 160 l6 6 12 -12" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>
        <path d="M24 162 q12 -14 24 0 t24 0" stroke="#2F6BFF" stroke-width="4" fill="none" stroke-linecap="round"/></svg>
      <div style="position:absolute;left:0;right:0;top:${w * .14}px;text-align:center;font-weight:800;font-size:${w * .11}px;color:#2F6BFF;white-space:nowrap">${title}</div></div>`);
  }
  window.PROP = { houseLand, car, ship, moto, phone, table, chair, tree, raft, buffalo, stamp, office, contract };
})();
