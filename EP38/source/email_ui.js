// EP38 — fictional, generic email UI (not modelled on any real provider).
// Composer (sender view) and Inbox (received message, recipient view), plus icons.
// All addresses are fictional and use the reserved example.com domain.
(function () {
  const { h, tf, life, clamp, lerp, E, P } = window.NSP;

  const IC = {
    mail: (s = 60, c = '#fff', f = 'none') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="2.5" y="5" width="19" height="14" rx="2.5" fill="${f}" stroke="${c}" stroke-width="2"/><path d="M3.5 6.5l8.5 6.5 8.5-6.5" fill="none" stroke="${c}" stroke-width="2" stroke-linejoin="round"/></svg>`,
    send: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M3 11.5L21 3l-6.5 18-3.2-7.3z" fill="${c}"/><path d="M11.3 13.7L21 3" stroke="#2F6BFF" stroke-width="1.6"/></svg>`,
    eye: (s = 60, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round"/><circle cx="12" cy="12" r="3.6" fill="${c}"/></svg>`,
    eyeOff: (s = 60, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M1.5 12S5.5 5 12 5s10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" fill="none" stroke="${c}" stroke-width="2.2" stroke-linejoin="round" opacity=".55"/><circle cx="12" cy="12" r="3.6" fill="${c}" opacity=".55"/><path d="M3.5 3.5l17 17" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/></svg>`,
    shield: (s = 60, c = '#2F6BFF', k = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2l8 3v6c0 5-3.5 9-8 11-4.5-2-8-6-8-11V5z" fill="${c}"/><rect x="8.6" y="10.6" width="6.8" height="5.6" rx="1.2" fill="${k}"/><path d="M10 10.6V9a2 2 0 0 1 4 0v1.6" fill="none" stroke="${k}" stroke-width="1.6"/></svg>`,
    lock: (s = 60, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="4.5" y="10.5" width="15" height="11" rx="2.5" fill="${c}"/><path d="M8 10.5V7.5a4 4 0 0 1 8 0v3" fill="none" stroke="${c}" stroke-width="2.4"/><circle cx="12" cy="15.5" r="1.8" fill="#fff"/></svg>`,
    person: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="8.2" r="4.2" fill="${c}"/><path d="M3.8 21c.6-4.6 4-7.2 8.2-7.2s7.6 2.6 8.2 7.2z" fill="${c}"/></svg>`,
    warn: (s = 44, c = '#EF4444') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2.8L22.5 21H1.5z" fill="${c}" stroke="${c}" stroke-width="1.5" stroke-linejoin="round"/><path d="M12 9v5.5" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.4" fill="#fff"/></svg>`,
    fwd: (s = 60, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M14 5l7 7-7 7v-4.2C8.5 14.8 5 16.6 3 20c.6-5.6 3.6-10.4 11-11.2z" fill="${c}"/></svg>`,
    replyAll: (s = 60, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M8 6l-6 6 6 6" fill="none" stroke="${c}" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/><path d="M13 6l-6 6 6 6v-4c4 0 6.6 1.4 8.5 4.5C21 14 18.2 10.3 13 10z" fill="${c}"/></svg>`,
    cursor: (s = 70) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 2.5l15 9.2-6.6 1.3 3.8 7.2-3 1.5-3.7-7.2L4.6 19z" fill="#fff" stroke="#142B53" stroke-width="1.5" stroke-linejoin="round"/></svg>`,
    q: (s = 60, c = '#22D3EE') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="10.5" fill="${c}"/><path d="M9.2 9.2a2.9 2.9 0 1 1 4.3 2.5c-1 .6-1.5 1.2-1.5 2.4" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.4" fill="#fff"/></svg>`,
    comment: (s = 60, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="${c}"/><path d="M7 9h10M7 13h6" stroke="#fff" stroke-width="2" stroke-linecap="round"/></svg>`,
    like: (s = 60, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M2 10h4v11H2zM8 21V10l4.5-7.5c1.4 0 2.4 1.2 2.1 2.6L14 9h6a2 2 0 0 1 2 2.3l-1.4 7.6A2.6 2.6 0 0 1 18 21z" fill="${c}"/></svg>`,
    share: (s = 60, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="18" cy="5" r="3" fill="${c}"/><circle cx="6" cy="12" r="3" fill="${c}"/><circle cx="18" cy="19" r="3" fill="${c}"/><path d="M8.6 10.7l6.8-4M8.6 13.3l6.8 4" stroke="${c}" stroke-width="2.2"/></svg>`,
    bell: (s = 60, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2.5a6 6 0 0 0-6 6v4.5L4 16.5v1h16v-1L18 13V8.5a6 6 0 0 0-6-6z" fill="${c}"/><path d="M9.5 19.5a2.5 2.5 0 0 0 5 0" fill="${c}"/></svg>`,
    check: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4.5 12.5l5 5 10-11" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cross: (s = 40, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6 6l12 12M18 6L6 18" fill="none" stroke="${c}" stroke-width="3.4" stroke-linecap="round"/></svg>`,
    copy: (s = 40, c = '#2F6BFF') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="8" y="3" width="12" height="15" rx="2" fill="none" stroke="${c}" stroke-width="2"/><rect x="4" y="7" width="12" height="14" rx="2" fill="#fff" stroke="${c}" stroke-width="2"/></svg>`,
  };

  // fictional address helper
  const addr = n => `applicant${String(n).padStart(2, '0')}@example.com`;
  const chipHTML = (txt, { av = '', cls = '' } = {}) => `<span class="chip ${cls}">${av !== null ? `<span class="av">${av || IC.person(22)}</span>` : ''}${txt}</span>`;

  // Composer — rows: [{key:'from'|'to'|'cc'|'bcc'|'subj', label, th:bool, chips:[html], text, count}]
  function Composer(parent, { x = 220, y = 420, title = 'ข้อความใหม่', rows, body = 3, send = true } = {}) {
    const el = h(`<div class="cmp" style="left:${x}px;top:${y}px"></div>`);
    el.innerHTML = `<div class="hd">${IC.mail(40)}<span>${title}</span><span class="dots"><i></i><i></i><i></i></span></div>` +
      rows.map(r => `<div class="rw" data-k="${r.key}"><div class="glow"></div><div class="lb ${r.th ? 'th' : ''}">${r.label}</div><div class="ct">${(r.chips || []).join('')}${r.text || ''}</div>${r.count ? `<div class="cnt">${r.count}</div>` : ''}</div>`).join('') +
      (body ? `<div class="bd">${[92, 78, 60].slice(0, body).map(w => `<i style="width:${w}%"></i>`).join('')}</div>` : '') +
      (send ? `<div class="ft"><span class="sendb">${IC.send(34)}ส่ง</span><span class="tool"></span><span class="tool"></span></div>` : '');
    parent.appendChild(el);
    const R = {};
    el.querySelectorAll('.rw').forEach(rw => {
      R[rw.dataset.k] = { el: rw, glow: rw.querySelector('.glow'), lb: rw.querySelector('.lb'), chips: [...rw.querySelectorAll('.chip')], cnt: rw.querySelector('.cnt') };
    });
    return { el, R, sendb: el.querySelector('.sendb') };
  }
  // pulse a row highlight; k 0..1
  function rowGlow(row, k, col = '#2F6BFF') {
    row.glow.style.opacity = k;
    row.glow.style.boxShadow = `0 0 0 4px ${col},0 0 26px ${col}99`;
    row.lb.style.transform = `scale(${1 + .12 * k})`;
    row.lb.style.background = k > .5 ? col : '';
    row.lb.style.color = k > .5 ? '#fff' : '';
  }
  // chips pop in at their own times
  function chipsIn(chips, u, times, { from = .3 } = {}) {
    chips.forEach((c, i) => { const l = life(u, times[i] ?? times[times.length - 1], 1e9, { from, dy: 0, d: .4 }); c.style.transform = `scale(${l.s})`; c.style.opacity = l.o; });
  }

  // Inbox — received message as seen by one recipient
  // hdr: [{k:'From'|'To'|'CC', chips:[html]}]; ghost: html for the "not shown" placeholder
  function Inbox(parent, { x = 220, y = 420, who = '01', whoAddr = addr(1), hdr, ghost = '', bad = false, body = 2, tag = 'กล่องจดหมาย' } = {}) {
    const el = h(`<div class="ibx ${bad ? 'bad' : ''}" style="left:${x}px;top:${y}px"></div>`);
    el.innerHTML = `<div class="top"><span class="who">${who}</span><span>${whoAddr}</span><span class="tg">${IC.mail(34, "#2F6BFF")}</span></div>
      <div class="sj">แจ้งกำหนดการอบรม</div>
      ${hdr.map(r => `<div class="hr" data-k="${r.k}"><span class="k">${r.k}</span><span class="v">${r.chips.join('')}</span></div>`).join('')}
      ${ghost ? `<div class="ghost">${ghost}</div>` : ''}
      <div class="bd">${[90, 70, 52].slice(0, body).map(w => `<i style="width:${w}%"></i>`).join('')}</div>`;
    parent.appendChild(el);
    return { el, rows: [...el.querySelectorAll('.hr')], chips: [...el.querySelectorAll('.chip')], ghost: el.querySelector('.ghost') };
  }

  window.EMAIL = { IC, addr, chipHTML, Composer, rowGlow, chipsIn, Inbox };
})();
