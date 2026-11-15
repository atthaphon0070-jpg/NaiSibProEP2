// EP52 infographic cards: sentence cards (correct / incorrect / neutral), chips, labels, rule cards.
// Every builder returns a DOM node positioned in a full-width centring row, so the essential text stays
// around X = 540 (inside the 220–860 safe zone). Essential text nodes carry data-ess="1" for the safe-zone QC.
(function () {
  const { h, ICON } = window.NSP;
  document.head.insertAdjacentHTML('beforeend', `<style>
    .row{position:absolute;left:0;width:1080px;display:flex;justify-content:center;transform-origin:540px 50%}
    .sc{position:relative;display:flex;flex-direction:column;align-items:center;gap:6px;padding:22px 46px;border-radius:40px;background:linear-gradient(180deg,#fff,#FFF6FA);font-weight:800;color:#31445D;line-height:1.22;text-align:center;
        box-shadow:0 18px 40px rgba(20,43,83,.16),0 0 0 6px #fff,0 0 0 12px rgba(247,168,196,.75)}
    .sc.blue{background:linear-gradient(180deg,#fff,#F1F8FF);box-shadow:0 18px 40px rgba(20,43,83,.16),0 0 0 6px #fff,0 0 0 12px rgba(149,191,239,.85)}
    .sc.ok{background:linear-gradient(180deg,#fff,#EFFCF4);box-shadow:0 18px 40px rgba(34,197,94,.18),0 0 0 6px #fff,0 0 0 12px rgba(34,197,94,.55)}
    .sc.bad{background:linear-gradient(180deg,#fff,#FFF1F1);box-shadow:0 18px 40px rgba(239,68,68,.16),0 0 0 6px #fff,0 0 0 12px rgba(239,68,68,.5)}
    .sc .bdg{position:absolute;right:-30px;top:-30px;width:78px;height:78px;border-radius:50%;display:grid;place-items:center;box-shadow:0 0 0 6px #fff,0 8px 16px rgba(20,43,83,.2)}
    .sc.ok .bdg{background:#22C55E}.sc.bad .bdg{background:#EF4444}.sc.q .bdg{background:#FFD23F}
    .sc .tg{position:absolute;left:50%;bottom:-24px;translate:-50% 0;font-size:26px;font-weight:800;color:#fff;padding:3px 18px;border-radius:16px;white-space:nowrap}
    .sc.ok .tg{background:#22C55E}.sc.bad .tg{background:#EF4444}
    .sc.bad .strike{text-decoration:line-through;text-decoration-color:rgba(239,68,68,.75);text-decoration-thickness:.08em}
    .chip{display:inline-flex;align-items:center;gap:14px;padding:14px 32px;border-radius:999px;font-weight:800;white-space:nowrap;color:#fff}
    .chip.pink{background:linear-gradient(90deg,#EE7FAA,#FF91BA);box-shadow:0 12px 26px rgba(238,127,170,.42),inset 0 3px 0 rgba(255,255,255,.4)}
    .chip.blue{background:linear-gradient(90deg,#2F6BFF,#5C8DFF);box-shadow:0 12px 26px rgba(47,107,255,.35),inset 0 3px 0 rgba(255,255,255,.35)}
    .chip.navy{background:#142B53;box-shadow:0 12px 26px rgba(20,43,83,.3)}
    .chip.white{background:#fff;color:#31445D;box-shadow:0 12px 26px rgba(20,43,83,.16),0 0 0 4px rgba(149,191,239,.6)}
    .chip.ok{background:linear-gradient(90deg,#16A34A,#22C55E);box-shadow:0 12px 26px rgba(34,197,94,.35)}
    .chip.warn{background:linear-gradient(90deg,#F59E0B,#FFD23F);color:#142B53;box-shadow:0 12px 26px rgba(245,158,11,.35)}
    .wd{display:inline-block;padding:0 .22em;border-radius:.25em;color:#fff;line-height:1.15}
    .wd.d{background:linear-gradient(180deg,#FF91BA,#EE7FAA)}
    .wd.g{background:linear-gradient(180deg,#5C8DFF,#2F6BFF)}
    .wd.w{background:linear-gradient(180deg,#F7A8C4,#E9709F)}
    .wd.y{background:#FFF3C4;color:#142B53;box-shadow:inset 0 0 0 .05em #FFD23F}
    .wd.x{background:#EF4444}
    .big{font-weight:800;line-height:1;color:#142B53;text-shadow:5px 0 0 #fff,-5px 0 0 #fff,0 5px 0 #fff,0 -5px 0 #fff,4px 4px 0 #fff,-4px 4px 0 #fff,4px -4px 0 #fff,-4px -4px 0 #fff,0 12px 18px rgba(20,43,83,.2)}
    .ul{position:absolute;height:12px;border-radius:6px;background:#FFD23F;transform-origin:0 50%}
  </style>`);
  const badge = st => st === 'ok' ? `<div class="bdg">${ICON.check('#fff', 46)}</div>` : st === 'bad' ? `<div class="bdg">${ICON.cross('#fff', 46)}</div>` : st === 'q' ? `<div class="bdg" style="font-size:50px;color:#142B53">?</div>` : '';
  // sentence card: lines = array of HTML strings, st = 'ok' | 'bad' | 'q' | '' ; tag = small label under the card
  function sentence(parent, top, lines, { st = '', size = 56, cls = '', tag = '', id = '' } = {}) {
    const tg = tag === false ? '' : tag || (st === 'ok' ? 'ถูก' : st === 'bad' ? 'ผิด' : '');
    const el = h(`<div class="row c" ${id ? `id="${id}"` : ''} style="top:${top}px"><div class="sc ${st} ${cls}" style="font-size:${size}px">${lines.map(l => `<div data-ess="1" class="${st === 'bad' ? 'strike' : ''}" style="white-space:nowrap">${l}</div>`).join('')}${badge(st)}${tg ? `<div class="tg">${tg}</div>` : ''}</div></div>`);
    parent.appendChild(el); el.card = el.firstChild; return el;
  }
  function chip(parent, top, html, { col = 'pink', size = 40, id = '' } = {}) {
    const el = h(`<div class="row c" ${id ? `id="${id}"` : ''} style="top:${top}px"><div class="chip ${col}" data-ess="1" style="font-size:${size}px">${html}</div></div>`);
    parent.appendChild(el); return el;
  }
  function big(parent, top, html, { size = 110, id = '' } = {}) {
    const el = h(`<div class="row c" ${id ? `id="${id}"` : ''} style="top:${top}px"><div class="big" data-ess="1" style="font-size:${size}px;white-space:nowrap">${html}</div></div>`);
    parent.appendChild(el); return el;
  }
  // DID + X + Y formula as chips
  function formula(parent, top, parts, { size = 54 } = {}) {
    const el = h(`<div class="row c" style="top:${top}px"><div style="display:flex;align-items:center;gap:12px">${parts.map((p, i) => `${i ? `<span class="fp" style="font-weight:800;font-size:${size}px;color:#142B53">+</span>` : ''}<span class="chip ${p[1]} fpart" data-ess="1" style="font-size:${size}px;padding:12px 26px">${p[0]}</span>`).join('')}</div></div>`);
    parent.appendChild(el); el.parts = [...el.querySelectorAll('.fpart')]; return el;
  }
  window.CARDS = { sentence, chip, big, formula, badge };
})();
