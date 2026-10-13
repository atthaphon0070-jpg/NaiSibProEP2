// NaiSibPro legal prop library (shared). Pure SVG/CSS illustrations in the pastel brand style.
// Generic, decorative legal symbols only: no real government seals, badges or official emblems.
(function () {
  const { h, clamp, lerp, E } = window.NSP;
  let uid = 0;
  const GOLD = id => `<linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#FFF4C4"/><stop offset=".45" stop-color="#F2C766"/><stop offset="1" stop-color="#C08A2C"/></linearGradient>`;
  const GOLDV = id => `<linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFF1B8"/><stop offset=".5" stop-color="#EDBE5A"/><stop offset="1" stop-color="#B98429"/></linearGradient>`;

  // ---------- justice scales (animated beam) ----------
  function scales(size = 400) {
    const g = 'sg' + (++uid), gv = 'sv' + uid;
    const el = h(`<div style="position:relative;width:${size}px;height:${size * 1.05}px">
      <svg width="${size}" height="${size * 1.05}" viewBox="0 0 400 420" style="overflow:visible">
        <defs>${GOLD(g)}${GOLDV(gv)}<radialGradient id="${g}r" cx=".35" cy=".3"><stop offset="0" stop-color="#FFF8D8"/><stop offset="1" stop-color="#D9A23C"/></radialGradient></defs>
        <ellipse cx="200" cy="402" rx="120" ry="14" fill="rgba(120,80,40,.18)"/>
        <path d="M110 395 L290 395 L270 368 L130 368 Z" fill="url(#${gv})"/>
        <rect x="150" y="352" width="100" height="20" rx="8" fill="url(#${g})"/>
        <rect x="189" y="112" width="22" height="244" rx="10" fill="url(#${gv})"/>
        <rect x="193" y="118" width="6" height="232" rx="3" fill="rgba(255,255,255,.55)"/>
        <g class="beam"><rect x="52" y="100" width="296" height="16" rx="8" fill="url(#${g})"/><rect x="60" y="102" width="280" height="4" rx="2" fill="rgba(255,255,255,.6)"/></g>
        <circle cx="200" cy="96" r="22" fill="url(#${g}r)"/><circle cx="193" cy="89" r="6" fill="rgba(255,255,255,.75)"/>
        <g class="panL"><path d="M60 108 L22 240 M60 108 L98 240" stroke="#C99A3E" stroke-width="3"/><path d="M8 240 Q60 292 112 240 Z" fill="url(#${g})"/><path d="M14 242 Q60 262 106 242" stroke="rgba(255,255,255,.7)" stroke-width="4" fill="none"/></g>
        <g class="panR"><path d="M340 108 L302 240 M340 108 L378 240" stroke="#C99A3E" stroke-width="3"/><path d="M288 240 Q340 292 392 240 Z" fill="url(#${g})"/><path d="M294 242 Q340 262 386 242" stroke="rgba(255,255,255,.7)" stroke-width="4" fill="none"/></g>
      </svg></div>`);
    const beam = el.querySelector('.beam'), L = el.querySelector('.panL'), R = el.querySelector('.panR');
    el.tilt = deg => {
      const a = deg * Math.PI / 180;
      beam.setAttribute('transform', `rotate(${deg} 200 108)`);
      L.setAttribute('transform', `translate(${140 - 140 * Math.cos(a)} ${-140 * Math.sin(a)})`);
      R.setAttribute('transform', `translate(${-(140 - 140 * Math.cos(a))} ${140 * Math.sin(a)})`);
    };
    el.tilt(0);
    return el;
  }

  // ---------- 3D law book: closed cover that can open, plus a flippable page ----------
  // W/H = size of ONE page. Element width = 2W (spread). Closed: only the right half (cover) shows.
  function book(W = 320, H = 420, { title = 'กฎหมาย', left = '', right = '', flipFront = '', flipBack = '' } = {}) {
    const g = 'bk' + (++uid);
    const page = (side, html) => `<div class="pg ${side}" style="position:absolute;top:0;${side === 'bk-l' ? 'left:0' : `left:${W}px`};width:${W}px;height:${H}px;
      background:linear-gradient(${side === 'bk-l' ? '90deg,#FFFDF8 0%,#FFF9EF 88%,#EADBC6 100%' : '270deg,#FFFDF8 0%,#FFF9EF 88%,#EADBC6 100%'});
      border-radius:${side === 'bk-l' ? '18px 4px 4px 18px' : '4px 18px 18px 4px'};box-shadow:0 18px 30px rgba(90,70,60,.22), inset 0 0 0 2px #F3E6D3;overflow:hidden">${html}</div>`;
    const leaf = (cls, front, back, frontStyle) => `<div class="${cls}" style="position:absolute;top:0;left:${W}px;width:${W}px;height:${H}px;transform-origin:0 50%;transform-style:preserve-3d">
        <div style="position:absolute;inset:0;backface-visibility:hidden;${frontStyle}">${front}</div>
        <div style="position:absolute;inset:0;backface-visibility:hidden;transform:rotateY(180deg);background:linear-gradient(90deg,#FFFDF8 0%,#FFF9EF 88%,#EADBC6 100%);border-radius:18px 4px 4px 18px;box-shadow:inset 0 0 0 2px #F3E6D3;overflow:hidden">${back}</div></div>`;
    const coverFront = `<div style="position:absolute;inset:0;border-radius:6px 26px 26px 6px;background:linear-gradient(135deg,#F7B6D0 0%,#EE7FAA 55%,#D9608F 100%);box-shadow:inset 10px 0 0 rgba(0,0,0,.08), inset 0 0 0 6px rgba(255,255,255,.25), 0 22px 36px rgba(150,60,100,.3)">
        <div style="position:absolute;left:26px;right:26px;top:26px;bottom:26px;border:4px solid #F6D77E;border-radius:16px;opacity:.9"></div>
        <svg viewBox="0 0 400 420" style="position:absolute;left:${W * .3}px;top:${H * .2}px;width:${W * .4}px">${''}<defs>${GOLD(g)}</defs>
          <rect x="189" y="112" width="22" height="244" rx="10" fill="url(#${g})"/><rect x="52" y="100" width="296" height="16" rx="8" fill="url(#${g})"/>
          <path d="M60 108 L22 240 M60 108 L98 240 M340 108 L302 240 M340 108 L378 240" stroke="#F6D77E" stroke-width="6"/>
          <path d="M8 240 Q60 292 112 240 Z M288 240 Q340 292 392 240 Z" fill="url(#${g})"/><path d="M120 395 L280 395 L262 366 L138 366 Z" fill="url(#${g})"/></svg>
        <div style="position:absolute;left:0;right:0;top:${H * .64}px;text-align:center;font-weight:800;font-size:${W * .15}px;color:#FFF4C4;text-shadow:0 3px 0 #C0648A">${title}</div>
        <div style="position:absolute;left:0;top:0;bottom:0;width:22px;border-radius:6px 0 0 6px;background:linear-gradient(90deg,#C8557F,#E77BA6)"></div></div>`;
    const el = h(`<div style="position:relative;width:${2 * W}px;height:${H}px;perspective:1800px">
        <div class="edge" style="position:absolute;left:${W}px;top:${H - 4}px;width:${W - 14}px;height:16px;border-radius:0 0 10px 6px;background:repeating-linear-gradient(180deg,#FFF9EF 0 3px,#E9DAC4 3px 4px)"></div>
        ${page('bk-l', left)}${page('bk-r', right)}
        ${leaf('flip', flipFront, flipBack, `background:linear-gradient(270deg,#FFFDF8 0%,#FFF9EF 88%,#EADBC6 100%);border-radius:4px 18px 18px 4px;box-shadow:inset 0 0 0 2px #F3E6D3;overflow:hidden`)}
        ${leaf('cover', coverFront, '<div style="position:absolute;inset:0;background:linear-gradient(90deg,#FBE3EE,#F7CFE0);border-radius:18px 4px 4px 18px"></div>', '')}
      </div>`);
    const cover = el.querySelector('.cover'), flip = el.querySelector('.flip'), pl = el.querySelector('.bk-l');
    // open: 0 closed → 1 fully open; flipP: 0 → 1 turns one page
    el.set = (open, flipP = 0) => {
      cover.style.transform = `rotateY(${-178 * open}deg)`;
      cover.style.zIndex = open > .5 ? 1 : 5;
      pl.style.zIndex = 2;   // first page lies on top of the opened cover
      cover.style.visibility = open >= .97 ? 'hidden' : 'visible';
      pl.style.opacity = clamp((open - .45) * 4);
      flip.style.display = flipFront ? 'block' : 'none';
      flip.style.transform = `rotateY(${-178 * flipP}deg)`;
      flip.style.zIndex = flipP > .5 ? 2 : 3;
    };
    el.set(0);
    return el;
  }

  // ---------- court building ----------
  function court(w = 360) {
    const g = 'ct' + (++uid);
    return h(`<svg width="${w}" height="${w * .86}" viewBox="0 0 360 310"><defs>${GOLD(g)}
        <linearGradient id="${g}w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FFFFFF"/><stop offset="1" stop-color="#EAF1FB"/></linearGradient>
        <linearGradient id="${g}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#FBD3E5"/><stop offset="1" stop-color="#F5A9C7"/></linearGradient></defs>
      <ellipse cx="180" cy="300" rx="170" ry="10" fill="rgba(90,90,140,.15)"/>
      <path d="M180 8 L346 86 L14 86 Z" fill="url(#${g}p)" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="180" cy="58" r="17" fill="url(#${g})"/><path d="M168 58h24M180 46v24" stroke="#fff" stroke-width="3" stroke-linecap="round"/>
      <rect x="22" y="86" width="316" height="22" rx="6" fill="url(#${g}w)" stroke="#D8E3F2" stroke-width="2"/>
      ${[0, 1, 2, 3, 4].map(i => `<rect x="${44 + i * 62}" y="112" width="24" height="142" rx="8" fill="url(#${g}w)" stroke="#D8E3F2" stroke-width="2"/><rect x="${48 + i * 62}" y="116" width="6" height="134" rx="3" fill="#fff"/>`).join('')}
      <rect x="148" y="176" width="64" height="78" rx="30" fill="#95BFEF"/><rect x="156" y="184" width="22" height="70" rx="11" fill="#B8D9F8"/>
      <rect x="18" y="254" width="324" height="16" rx="6" fill="url(#${g}w)" stroke="#D8E3F2" stroke-width="2"/>
      <rect x="6" y="270" width="348" height="18" rx="6" fill="url(#${g}w)" stroke="#D8E3F2" stroke-width="2"/></svg>`);
  }

  // ---------- case folder / legal document ----------
  function folder(w = 220, label = 'แฟ้มคดี') {
    return h(`<div style="position:relative;width:${w}px;height:${w * .78}px">
      <svg width="${w}" height="${w * .78}" viewBox="0 0 220 172" style="position:absolute;inset:0">
        <path d="M10 22 Q10 10 22 10 H86 L102 26 H198 Q210 26 210 38 V156 Q210 166 198 166 H22 Q10 166 10 156Z" fill="#EE7FAA"/>
        <rect x="26" y="20" width="160" height="120" rx="8" fill="#fff" transform="rotate(-4 106 80)"/>
        <path d="M40 46h110M40 66h120M40 86h90" stroke="#D7E3F3" stroke-width="7" stroke-linecap="round" transform="rotate(-4 106 80)"/>
        <path d="M10 56 Q10 46 22 46 H198 Q210 46 210 56 V156 Q210 166 198 166 H22 Q10 166 10 156Z" fill="#F7AFCB"/>
        <path d="M18 60 H202" stroke="rgba(255,255,255,.7)" stroke-width="5" stroke-linecap="round"/></svg>
      <div style="position:absolute;left:0;right:0;top:${w * .44}px;display:flex;justify-content:center"><span style="background:#fff;border-radius:12px;padding:2px 14px;font-weight:700;font-size:${w * .12}px;color:#C8557F">${label}</span></div></div>`);
  }
  function doc(w = 200, title = 'คำฟ้อง') {
    return h(`<div style="position:relative;width:${w}px;height:${w * 1.3}px;filter:drop-shadow(0 14px 18px rgba(90,80,140,.25))">
      <svg width="${w}" height="${w * 1.3}" viewBox="0 0 200 260" style="position:absolute;inset:0">
        <path d="M14 8 H150 L190 48 V246 Q190 254 182 254 H14 Q6 254 6 246 V16 Q6 8 14 8Z" fill="#fff"/>
        <path d="M150 8 V40 Q150 48 158 48 H190Z" fill="#E2ECFA"/>
        <path d="M30 92h140M30 116h140M30 140h120M30 164h140M30 188h96" stroke="#DCE6F4" stroke-width="8" stroke-linecap="round"/>
        <rect x="120" y="206" width="56" height="30" rx="8" fill="#B8D9F8"/></svg>
      <div style="position:absolute;left:${w * .14}px;top:${w * .14}px;font-weight:800;font-size:${w * .15}px;color:#5E8FD6">${title}</div></div>`);
  }

  // ---------- cute rental house ----------
  function house(w = 340) {
    return h(`<div style="position:relative;width:${w}px;height:${w}px">
      <svg width="${w}" height="${w}" viewBox="0 0 340 340" style="position:absolute;inset:0">
        <ellipse cx="170" cy="322" rx="150" ry="14" fill="rgba(90,90,140,.16)"/>
        <path d="M250 150 L310 120 L310 300 L250 318Z" fill="#E7D9F2"/>
        <rect x="40" y="150" width="210" height="168" rx="10" fill="#FFF6EE"/>
        <path d="M20 160 L145 52 L270 160Z" fill="#F5A9C7" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>
        <path d="M145 52 L218 22 L326 120 L270 160Z" fill="#EE7FAA"/>
        <rect x="214" y="34" width="26" height="46" rx="4" fill="#E6A3BF"/>
        <rect x="70" y="200" width="56" height="52" rx="10" fill="#B8D9F8" stroke="#fff" stroke-width="6"/>
        <path d="M98 200v52M70 226h56" stroke="#fff" stroke-width="5"/>
        <rect x="156" y="216" width="64" height="102" rx="30" fill="#95BFEF"/><circle cx="206" cy="270" r="5" fill="#fff"/>
        <path d="M262 170 L298 154 V196 L262 210Z" fill="#B8D9F8" opacity=".9"/>
        <rect x="16" y="252" width="6" height="66" rx="3" fill="#C9A27C"/></svg>
      <div style="position:absolute;left:${w * -.04}px;top:${w * .64}px;transform:rotate(-8deg);background:#fff;border:4px solid #EE7FAA;border-radius:14px;padding:2px 14px;font-weight:800;font-size:${w * .085}px;color:#EE7FAA;box-shadow:0 6px 12px rgba(0,0,0,.1)">ให้เช่า</div></div>`);
  }
  function person(size = 150, color = '#95BFEF', label = '') {
    return h(`<div style="position:relative;width:${size}px;display:flex;flex-direction:column;align-items:center;gap:10px">
      <svg width="${size}" height="${size * 1.1}" viewBox="0 0 100 110"><circle cx="50" cy="30" r="22" fill="${color}"/><circle cx="43" cy="23" r="6" fill="rgba(255,255,255,.55)"/>
        <path d="M12 106 Q12 58 50 58 Q88 58 88 106Z" fill="${color}"/><path d="M24 98 Q26 70 50 68" stroke="rgba(255,255,255,.45)" stroke-width="6" fill="none" stroke-linecap="round"/></svg>
      ${label ? `<div style="background:#fff;border-radius:20px;padding:6px 18px;font-weight:700;font-size:${size * .2}px;box-shadow:0 6px 14px rgba(110,90,150,.15);white-space:nowrap">${label}</div>` : ''}</div>`);
  }
  function bill(w = 170) {
    return h(`<div style="position:relative;width:${w}px;height:${w * .5}px;border-radius:${w * .08}px;background:linear-gradient(135deg,#DDF6E8,#9FDDBE);box-shadow:0 10px 18px rgba(40,120,80,.22), inset 0 0 0 5px rgba(255,255,255,.6)">
      <div style="position:absolute;left:50%;top:50%;width:${w * .3}px;height:${w * .3}px;margin:-${w * .15}px;border-radius:50%;background:#fff;display:grid;place-items:center;font-weight:800;font-size:${w * .2}px;color:#26A269">฿</div></div>`);
  }
  function qmark(size = 260) {
    return h(`<div style="position:relative;width:${size}px;height:${size * 1.2}px;display:grid;place-items:center;font-weight:800;font-size:${size}px;line-height:1">
      <span style="position:absolute;color:#C8557F;transform:translate(10px,14px)">?</span>
      <span style="position:absolute;background:linear-gradient(160deg,#FFD6E6,#EE7FAA 60%,#D9608F);-webkit-background-clip:text;background-clip:text;color:transparent;filter:drop-shadow(0 0 0 #fff)">?</span>
      <span style="position:absolute;color:transparent;-webkit-text-stroke:6px #fff;opacity:.9">?</span></div>`);
  }

  window.LEGAL = { scales, book, court, folder, doc, house, person, bill, qmark };
})();
