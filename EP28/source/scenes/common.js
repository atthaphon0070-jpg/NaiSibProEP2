// EP28 shared scene helpers: timing, captions, headers, navy circuit background, office set, link/node setters.
const { $, clamp, lerp, E, P, tf, life, bob, h, ICON, sfx, mark } = NSP;
const T = window.TL, S = k => T[k][0], D = k => T[k][1];
const BT = (seg, k) => window.BEATS[seg][k][0];
const SC = [];                                   // scenes: { el, a, b, draw(t), dark(t) → 0..1 }
let R = 2828; const rr = () => (R = (R * 16807) % 2147483647) / 2147483647;
function mkScene(id) { const d = h(`<div class="scene" id="${id}"></div>`); $('stage').insertBefore(d, $('brand')); return d; }
function add(par, html) { const e = h(html); par.appendChild(e); return e; }
const show = (el, u, a, b = 1e9, o = {}) => tf(el, life(u, a, b, { from: .6, dy: 16, out: .25, ...o }));
const pulse = (u, at, d = .35, k = .25) => 1 + k * Math.sin(Math.PI * clamp((u - at) / d));
const shake = (u, at, d = .3, a = 5) => (u >= at && u < at + d) ? Math.sin((u - at) * 90) * a * (1 - (u - at) / d) : 0;
const win = (u, a, b) => u >= a && u < b;
// caption: centred .cap at `top` (lines = html strings). The .cap itself is the measured critical box.
function cap(par, top, lines, cls = '', fs) {
  return add(par, `<div class="ctr" style="top:${top}px"><div class="cap crit ${cls}" ${fs ? `style="font-size:${fs}px"` : ''}>${lines.map(l => `<span class="ln">${l}</span>`).join('')}</div></div>`);
}
function chip(par, top, html, cls = 'pink', fs) { return add(par, `<div class="ctr" style="top:${top}px"><div class="chip crit ${cls}" ${fs ? `style="font-size:${fs}px"` : ''}>${html}</div></div>`); }
function memo(par, top, html, topo) { return add(par, `<div class="ctr" style="top:${top}px"><div class="memo crit" ${topo ? `data-topo="${topo}"` : ''}>${html}</div></div>`); }
// topic header: number badge + English name (yellow) + Thai name (pink pill)
function header(par, no, name, th, topo) {
  const e = add(par, `<div class="th"><div class="nm crit" data-topo="${topo || ''}">${no ? `<span class="no">${no}</span>` : ''}<span>${name}</span></div><div class="tt crit" data-topo="${topo || ''}">${th}</div></div>`);
  e.nm = e.querySelector('.nm'); e.tt = e.querySelector('.tt');
  return e;
}
function drawHeader(e, u, a, b, thAt) {
  tf(e, { o: 1 });
  show(e.nm, u, a, b, { from: .5, dy: 20 });
  show(e.tt, u, thAt ?? a + .3, b, { from: .4, dy: 16 });
}
// link / node setters on a TOPO state
const L = (S, a, b) => S.links.find(l => l.id === TOPO.lid(a, b));
const setL = (S, a, b, p) => { const l = L(S, a, b); if (l) Object.assign(l, p); return l; };
const setN = (S, id, p) => { if (S.nodes[id]) Object.assign(S.nodes[id], p); };
const eachPC = (S, f) => Object.keys(S.nodes).forEach(id => { if ((S.nodes[id].kind || 'pc') === 'pc') f(id, S.nodes[id]); });
// break animation for a link at local time u (starts at a): highlight → snap apart → red with ✕
function breakLink(S, a, b, u, at, { brk = .5, x = true } = {}) {
  if (u < at - .35) return;
  const l = L(S, a, b); if (!l) return;
  if (u < at) { l.st = 'hot'; return; }
  l.st = 'bad'; l.brk = brk; l.gap = E.back(P(u, at, .35)); l.spark = Math.max(0, 1 - (u - at) / .6); l.xs = x ? E.back(P(u, at + .1, .35)) : 0;
}
// centre-device failure: warning blink → red; all its links go dead (red dashed)
function failSwitch(S, sw, u, at) {
  if (u < at - .5) return 0;
  const n = S.nodes[sw]; const k = P(u, at, .25);
  n.warn = clamp((u - at + .5) / .3); n.fail = u < at ? (Math.sin(u * 30) > 0 ? .7 : 0) : 1;
  if (u >= at) S.links.forEach(l => { if (l.a === sw || l.b === sw) { l.st = 'dim'; l.red = true; l.o = 1 - .25 * k; } });
  return k;
}

// ---------- navy circuit background (generated once, deterministic) ----------
{
  let d = '', pads = '';
  for (let i = 0; i < 48; i++) {
    let x = Math.round(rr() * 28) * 50, y = Math.round(rr() * 52) * 50; d += `M${x},${y}`; pads += `<circle cx="${x}" cy="${y}" r="7"/>`;
    for (let s = 0; s < 4; s++) {
      const dir = Math.floor(rr() * 4), Ln = (2 + Math.floor(rr() * 5)) * 50;
      if (dir === 0) x += Ln; else if (dir === 1) y += Ln; else if (dir === 2) { x += Ln * .7; y += Ln * .7; } else y -= Ln;
      d += `L${Math.round(x)},${Math.round(y)}`;
    }
    pads += `<circle cx="${Math.round(x)}" cy="${Math.round(y)}" r="9" fill="none" stroke-width="4"/>`;
  }
  $('circ').innerHTML = `<svg width="1400" height="2600" viewBox="0 0 1400 2600"><g stroke="#3D7BFF" stroke-opacity=".10" stroke-width="4" fill="none" stroke-linejoin="round"><path d="${d}"/></g><g fill="#3D7BFF" fill-opacity=".13" stroke="#3D7BFF" stroke-opacity=".13">${pads}</g></svg>`;
}
const NBP = [];
for (let i = 0; i < 26; i++) {
  const s = 6 + rr() * 10, pink = i % 4 === 0;
  const el = add($('nbp'), `<div class="nbp" style="width:${s}px;height:${s}px;background:${pink ? '#EE7FAA' : '#22D3EE'};box-shadow:0 0 ${s * 2}px ${pink ? '#EE7FAA' : '#22D3EE'}"></div>`);
  NBP.push({ el, x: rr() * 1080, y: rr() * 1920, sp: 10 + rr() * 26, ph: rr() * 6.3 });
}
function drawNbg(t, o) {
  $('nbg').style.opacity = o; $('nbg').style.visibility = o <= .001 ? 'hidden' : 'visible';
  if (o <= .001) return;
  tf($('circ'), { x: Math.sin(t * .05) * 60 - (t * 1.2) % 50, y: Math.cos(t * .04) * 50 });
  NBP.forEach(p => { let y = (p.y - t * p.sp) % 2000; if (y < -40) y += 2000; tf(p.el, { x: p.x + Math.sin(t * .7 + p.ph) * 20, y, o: .25 + .25 * Math.sin(t * 1.4 + p.ph) }); });
}

// ---------- office set (light 2D interior). Desk monitors sit exactly on the star layout's PC positions ----------
const STAR = TOPO.DEF.star({ cx: 540, cy: 900, r: 235 });
function buildOffice(par) {
  const pos = id => STAR.nodes[id];
  const desk = (x, y, w = 230) => `<g transform="translate(${x} ${y + 64})">
      <path d="M${-w / 2 - 18} 0 L${w / 2 + 18} 0 L${w / 2} 26 L${-w / 2} 26Z" fill="#E9D3B8"/><rect x="${-w / 2}" y="26" width="${w}" height="16" fill="#C9A982"/>
      <rect x="${-w / 2 + 10}" y="42" width="14" height="86" fill="#A98B67"/><rect x="${w / 2 - 24}" y="42" width="14" height="86" fill="#A98B67"/>
      <rect x="${w / 2 - 92}" y="42" width="70" height="70" rx="6" fill="#D9BE9C"/><rect x="${w / 2 - 70}" y="72" width="26" height="6" rx="3" fill="#A98B67"/>
      <rect x="${-w / 2 + 34}" y="-12" width="54" height="12" rx="4" fill="#5B6B8C"/></g>`;
  const chair = (x, y) => `<g transform="translate(${x} ${y + 150})"><rect x="-44" y="-62" width="88" height="70" rx="22" fill="#6F8FD6"/><rect x="-50" y="2" width="100" height="22" rx="11" fill="#5A79C0"/><rect x="-5" y="24" width="10" height="34" fill="#47557A"/><path d="M-40 66 L40 66" stroke="#47557A" stroke-width="10" stroke-linecap="round"/></g>`;
  let floorLines = '';
  for (let i = -8; i <= 8; i++) floorLines += `<path d="M540 330 L${540 + i * 200} 1920" stroke="#B8C4D8" stroke-width="3" opacity=".55"/>`;
  [760, 830, 930, 1070, 1260, 1520, 1860].forEach(y => { floorLines += `<path d="M0 ${y} H1080" stroke="#B8C4D8" stroke-width="3" opacity=".5"/>`; });
  const e = add(par, `<div class="office"><svg width="1080" height="1920" viewBox="0 0 1080 1920" style="position:absolute;inset:0">
    <defs><linearGradient id="of-w" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#E6F0FD"/><stop offset="1" stop-color="#F7ECF5"/></linearGradient>
      <linearGradient id="of-f" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#DCE4F1"/><stop offset="1" stop-color="#C7D2E4"/></linearGradient>
      <linearGradient id="of-sky" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9CCBFA"/><stop offset="1" stop-color="#DCEEFF"/></linearGradient></defs>
    <rect width="1080" height="740" fill="url(#of-w)"/><rect y="640" width="1080" height="100" fill="#D3E1F6"/><rect y="636" width="1080" height="8" fill="#BFD0EA"/>
    ${[[90, 'L'], [760, 'R']].map(([x]) => `<g transform="translate(${x} 280)"><rect width="230" height="290" rx="14" fill="#fff"/><rect x="14" y="14" width="202" height="262" rx="8" fill="url(#of-sky)"/>
      <circle cx="160" cy="80" r="26" fill="#FFF3B0"/><path d="M14 230 Q70 190 120 220 T216 205 V276 H14Z" fill="#B9E3C6"/>${[...Array(7)].map((_, i) => `<rect x="14" y="${22 + i * 36}" width="202" height="6" fill="#fff" opacity=".55"/>`).join('')}<rect x="109" y="14" width="12" height="262" fill="#fff"/></g>`).join('')}
    <g transform="translate(540 330)"><circle r="54" fill="#fff" stroke="#95BFEF" stroke-width="8"/><path class="of-hand" d="M0 0 V-34" stroke="#31445D" stroke-width="6" stroke-linecap="round"/><path class="of-hand2" d="M0 0 H24" stroke="#EE7FAA" stroke-width="6" stroke-linecap="round"/><circle r="6" fill="#31445D"/></g>
    <g transform="translate(540 470)"><rect x="-150" y="-36" width="300" height="72" rx="18" fill="#fff" stroke="#F5A9C7" stroke-width="5"/><text y="12" text-anchor="middle" font-family="Prompt" font-weight="700" font-size="32" fill="#31445D">ห้องคอมพิวเตอร์</text></g>
    <rect y="740" width="1080" height="1180" fill="url(#of-f)"/>${floorLines}
    <g transform="translate(990 600)"><rect x="-34" y="0" width="68" height="80" rx="12" fill="#EE7FAA"/><path d="M0 0 C-60 -40 -50 -120 0 -150 C50 -120 60 -40 0 0Z" fill="#5BBF83"/><path d="M0 0 C-20 -60 -10 -110 0 -150" stroke="#3E9A64" stroke-width="5" fill="none"/></g>
    <g transform="translate(92 1640)"><rect x="-44" y="0" width="88" height="96" rx="14" fill="#95BFEF"/><path d="M0 0 C-80 -50 -70 -160 0 -200 C70 -160 80 -50 0 0Z" fill="#5BBF83"/></g>
    ${desk(pos('PC1').x, pos('PC1').y, 250)}${desk(pos('PC5').x, pos('PC5').y)}${desk(pos('PC2').x, pos('PC2').y)}
    <g transform="translate(540 936)"><rect x="-80" y="0" width="160" height="96" rx="10" fill="#7C8DB0"/><rect x="-70" y="12" width="140" height="10" rx="5" fill="#5D6E92"/><rect x="-70" y="34" width="140" height="10" rx="5" fill="#5D6E92"/><rect x="-74" y="96" width="18" height="14" fill="#47557A"/><rect x="56" y="96" width="18" height="14" fill="#47557A"/></g>
    ${desk(pos('PC4').x, pos('PC4').y)}${desk(pos('PC3').x, pos('PC3').y)}
    ${chair(pos('PC4').x, pos('PC4').y)}${chair(pos('PC3').x, pos('PC3').y)}
  </svg></div>`);
  const actor = add(e, `<div style="position:absolute;left:0;top:0;transform-origin:0 0"></div>`);
  const ch = STORY.character('A'); actor.appendChild(ch);
  return { el: e, actor, ch, h1: e.querySelector('.of-hand'), h2: e.querySelector('.of-hand2') };
}
function drawOffice(of, u, o, { x = 880, y = 1560, s = .78, expr = 'smile', arm = 0, turn = -.4, wave = 0 } = {}) {
  of.el.style.opacity = o; of.el.style.visibility = o <= .001 ? 'hidden' : 'visible';
  if (o <= .001) return;
  of.h1.setAttribute('transform', `rotate(${u * 6})`); of.h2.setAttribute('transform', `rotate(${u * 40})`);
  of.actor.style.transform = `translate(${x}px,${y}px) scale(${s})`;
  of.ch.pose({ t: u, turn, lookX: -.6, blink: STORY.blinkAt(u, .7), expr, armL: [10 + 60 * arm, -6 + 30 * arm + Math.sin(u * 9) * 14 * wave], armR: [8, -6] });
}
// small glyph of a topology (for chips / icon rows); 120 × 90 viewBox
function glyph(type, c = '#22D3EE', s = 90) {
  const w = s * 4 / 3, st = `stroke="${c}" stroke-width="7" stroke-linecap="round" fill="none"`, dot = (x, y, r = 9) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${c}"/>`;
  const ring5 = [...Array(5)].map((_, i) => { const a = (-90 + i * 72) * Math.PI / 180; return [60 + 34 * Math.cos(a), 47 + 34 * Math.sin(a)]; });
  let g = '';
  if (type === 'star') g = ring5.map(([x, y]) => `<path d="M60 47 L${x} ${y}" ${st}/>`).join('') + ring5.map(([x, y]) => dot(x, y)).join('') + `<rect x="47" y="38" width="26" height="18" rx="5" fill="#FFD23F"/>`;
  if (type === 'bus') g = `<path d="M10 47 H110" ${st.replace('7', '9')} stroke="#FFD23F"/>` + [25, 48, 72, 95].map((x, i) => `<path d="M${x} 47 V${i % 2 ? 72 : 22}" ${st}/>` + dot(x, i % 2 ? 76 : 18)).join('');
  if (type === 'ring') g = ring5.map(([x, y], i) => { const [x2, y2] = ring5[(i + 1) % 5]; return `<path d="M${x} ${y} L${x2} ${y2}" ${st}/>`; }).join('') + ring5.map(([x, y]) => dot(x, y)).join('');
  if (type === 'mesh') { for (let i = 0; i < 5; i++) for (let j = i + 1; j < 5; j++) g += `<path d="M${ring5[i][0]} ${ring5[i][1]} L${ring5[j][0]} ${ring5[j][1]}" ${st.replace('7', '4')}/>`; g += ring5.map(([x, y]) => dot(x, y)).join(''); }
  if (type === 'tree') g = `<path d="M60 14 L32 46 M60 14 L88 46 M32 46 L18 80 M32 46 L46 80 M88 46 L74 80 M88 46 L102 80" ${st}/>` + [[60, 14], [32, 46], [88, 46]].map(([x, y]) => `<rect x="${x - 11}" y="${y - 8}" width="22" height="16" rx="4" fill="#FFD23F"/>`).join('') + [18, 46, 74, 102].map(x => dot(x, 80)).join('');
  if (type === 'hybrid') g = `<path d="M8 47 H112" ${st} stroke="#FFD23F"/><path d="M34 47 V30 M86 47 V64" ${st}/><path d="M34 30 L14 10 M34 30 L34 6 M34 30 L54 10 M86 64 L66 84 M86 64 L86 88 M86 64 L106 84" ${st.replace('7', '5')}/>` + [[14, 10], [34, 6], [54, 10], [66, 84], [86, 88], [106, 84]].map(([x, y]) => dot(x, y, 7)).join('') + `<rect x="25" y="23" width="18" height="14" rx="4" fill="#EE7FAA"/><rect x="77" y="57" width="18" height="14" rx="4" fill="#EE7FAA"/>`;
  if (type === 'p2p') g = `<path d="M22 47 H98" ${st}/>` + dot(22, 47, 13) + dot(98, 47, 13);
  return `<svg width="${w}" height="${s}" viewBox="0 0 120 90" style="overflow:visible">${g}</svg>`;
}
