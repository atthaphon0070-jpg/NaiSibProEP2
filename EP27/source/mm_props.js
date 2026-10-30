// NaiSibPro EP.27 prop library: Mail Merge (Word main document + Excel recipient list), Blue × Pink Fusion.
// Original vector illustrations only. The Word / Excel windows are simplified educational mock-ups
// (no Microsoft logos); every name and address is fictional ("ผู้รับ ก", "ที่อยู่ A" …).
//   MM.C                        Fusion palette
//   MM.IC                       icons (doc, Word tile, Excel tile, keyboard, tool, clock, printer, magnifier …)
//   MM.office(root, theme)      layered office with parallax camera; theme 'night' (deep navy) or 'day'
//   MM.letter(w)                letter card: same body, variable name / address slots; .set({...})
//   MM.sheet(rows, w)           recipient table (ชื่อ | ที่อยู่) with row highlight; .rowY(i)
//   MM.word(w)                  Word window: tabs, Mailings ribbon (5 commands), dropdown menu, main-document page
//   MM.stack(n, w)              stylized paper stack (n sheets, height driven by .set(fill))
//   MM.link(svg)                animated connector (draw-on path + travelling data dot)
(function () {
  const { h, clamp, lerp, E, P, tf } = window.NSP;
  const C = { navy: '#142B53', navy2: '#0C1B3A', blue: '#2F6BFF', cyan: '#22D3EE', pinkS: '#F8CFE2', pink: '#EE7FAA', lb: '#95BFEF', yel: '#FFD23F',
    bg: '#FFF8FC', ink: '#31445D', green: '#22C55E', red: '#EF4444', word: '#2B5FC9', wordD: '#1E4AA8', xl: '#1E9E5A', xlD: '#167A45', amber: '#F59E0B' };

  // ------------------------------------------------------------------ icons
  const IC = {
    doc: (w = 80, c = C.blue, fill = '#fff') => `<svg width="${w}" height="${w * 1.25}" viewBox="0 0 80 100"><path d="M8 3h44l25 25v65a5 5 0 0 1-5 5H8a5 5 0 0 1-5-5V8a5 5 0 0 1 5-5z" fill="${fill}" stroke="${c}" stroke-width="5"/><path d="M52 3v20a5 5 0 0 0 5 5h20" fill="none" stroke="${c}" stroke-width="5" stroke-linejoin="round"/><path d="M16 46h46M16 60h46M16 74h32" stroke="${c}" stroke-width="5.5" stroke-linecap="round" opacity=".55"/></svg>`,
    wordTile: (s = 80) => `<svg width="${s}" height="${s}" viewBox="0 0 80 80"><rect x="18" y="6" width="56" height="68" rx="9" fill="#fff" stroke="${C.word}" stroke-width="4"/><path d="M34 24h30M34 36h30M34 48h30M34 60h22" stroke="#9DB8EC" stroke-width="5" stroke-linecap="round"/><rect x="4" y="18" width="44" height="44" rx="10" fill="${C.word}"/><text x="26" y="50" font-size="32" font-weight="800" fill="#fff" text-anchor="middle" font-family="Prompt">W</text></svg>`,
    xlTile: (s = 80) => `<svg width="${s}" height="${s}" viewBox="0 0 80 80"><rect x="18" y="6" width="56" height="68" rx="9" fill="#fff" stroke="${C.xl}" stroke-width="4"/><path d="M34 22v48M52 22v48M28 32h46M28 46h46M28 60h46" stroke="#A6DDBE" stroke-width="3.5"/><rect x="4" y="18" width="44" height="44" rx="10" fill="${C.xl}"/><text x="26" y="50" font-size="32" font-weight="800" fill="#fff" text-anchor="middle" font-family="Prompt">X</text></svg>`,
    tool: (s = 120, c = C.cyan) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M14.5 3.5l6 6-11 11-6-6z" fill="${c}" opacity=".25"/><path d="M4 20L15 9" stroke="${c}" stroke-width="2.6" stroke-linecap="round"/><path d="M15 9l2.5-2.5" stroke="#fff" stroke-width="2.6" stroke-linecap="round"/><path d="M18 2.5l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8zM8 3l.5 1.3 1.3.5-1.3.5L8 6.6l-.5-1.3-1.3-.5 1.3-.5zM20.5 12l.5 1.3 1.3.5-1.3.5-.5 1.3-.5-1.3-1.3-.5 1.3-.5z" fill="${C.yel}"/></svg>`,
    clock: (s = 80, c = C.pink) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9.5" fill="#fff" stroke="${c}" stroke-width="2.4"/><path class="ck-h" d="M12 12V7" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/><path class="ck-m" d="M12 12h4" stroke="${C.ink}" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="12" r="1.4" fill="${C.ink}"/></svg>`,
    sweat: (s = 70) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2c3 5 6 8.5 6 12a6 6 0 0 1-12 0c0-3.5 3-7 6-12z" fill="#9FD8FF" stroke="#fff" stroke-width="1.6"/><path d="M9 14a3 3 0 0 0 2 3" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`,
    typo: (s = 70) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><text x="12" y="13" font-size="10" font-weight="800" fill="${C.ink}" text-anchor="middle" font-family="Prompt">Aa</text><path d="M3 18q1.5-2 3 0t3 0 3 0 3 0 3 0 3 0" stroke="${C.red}" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    check: (s = 60, bg = C.green) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${bg}"/><path d="M6.5 12.5l3.7 3.7 7.3-8" fill="none" stroke="#fff" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    cross: (s = 60, bg = C.red) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${bg}"/><path d="M8 8l8 8M16 8l-8 8" stroke="#fff" stroke-width="2.8" stroke-linecap="round"/></svg>`,
    warn: (s = 60) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 2.5L22.5 21h-21z" fill="#FFCF5C" stroke="#fff" stroke-width="1.4" stroke-linejoin="round"/><path d="M12 9v5.5" stroke="${C.ink}" stroke-width="2.6" stroke-linecap="round"/><circle cx="12" cy="17.6" r="1.5" fill="${C.ink}"/></svg>`,
    mag: (s = 60, c = C.blue) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="rgba(255,255,255,.8)" stroke="${c}" stroke-width="2.6"/><path d="M15 15l6 6" stroke="${c}" stroke-width="3.2" stroke-linecap="round"/></svg>`,
    swap: (s = 60, c = C.blue) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 8h13l-3-3M20 16H7l3 3" fill="none" stroke="${c}" stroke-width="2.6" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
    copy: (s = 60, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="8" y="8" width="12" height="13" rx="2.5" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M5 16V5a2 2 0 0 1 2-2h9" fill="none" stroke="${c}" stroke-width="2.4" stroke-linecap="round"/></svg>`,
    paste: (s = 60, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="5" y="5" width="14" height="16" rx="2.5" fill="none" stroke="${c}" stroke-width="2.4"/><rect x="9" y="3" width="6" height="4" rx="1.5" fill="${c}"/></svg>`,
    pen: (s = 60, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 20l1-5L16 4l4 4L9 19z" fill="none" stroke="${c}" stroke-width="2.4" stroke-linejoin="round"/><path d="M13.5 6.5l4 4" stroke="${c}" stroke-width="2.4"/></svg>`,
    printer: (s = 70, c = C.ink) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="6" y="3" width="12" height="6" rx="1" fill="#fff" stroke="${c}" stroke-width="2"/><rect x="2.5" y="8.5" width="19" height="9" rx="2.5" fill="${C.lb}" stroke="${c}" stroke-width="2"/><rect x="6.5" y="14" width="11" height="7.5" rx="1" fill="#fff" stroke="${c}" stroke-width="2"/><circle cx="18" cy="11.5" r="1.2" fill="${C.green}"/></svg>`,
    docs: (s = 70, c = C.blue) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="7" y="2.5" width="13" height="16" rx="2" fill="#E6EEFF" stroke="${c}" stroke-width="1.8"/><rect x="4" y="5.5" width="13" height="16" rx="2" fill="#fff" stroke="${c}" stroke-width="1.8"/><path d="M7 10h7M7 13h7M7 16h5" stroke="${c}" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    cursor: (s = 64) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 2l15 10.5-6.5 1.2 3.8 7-2.8 1.4-3.8-7L4 19.5z" fill="#fff" stroke="${C.ink}" stroke-width="1.6" stroke-linejoin="round"/></svg>`,
    gear: (s = 90, c = C.cyan) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 8.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7zm8.4 5l1.6 1.2-1.8 3.2-1.9-.6a7.6 7.6 0 0 1-1.9 1.1L16 20.5h-3.6l-.4-2a7.6 7.6 0 0 1-2-1.1l-1.9.6-1.8-3.2 1.5-1.2a7.4 7.4 0 0 1 0-2.2L6.3 10.2 8.1 7l1.9.6a7.6 7.6 0 0 1 2-1.1l.4-2H16l.4 2a7.6 7.6 0 0 1 1.9 1.1l1.9-.6 1.8 3.2-1.6 1.2a7.4 7.4 0 0 1 0 2.2z" fill="${c}"/></svg>`,
    heart: (s = 44, c = C.pink) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 21s-8-5.2-8-11a4.5 4.5 0 0 1 8-2.8A4.5 4.5 0 0 1 20 10c0 5.8-8 11-8 11z" fill="${c}"/></svg>`,
    like: (s = 64, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M7 10v11H3V10zM7 10l4-7a2.5 2.5 0 0 1 3 2.6L13.5 9H19a2 2 0 0 1 2 2.3l-1.4 8A2 2 0 0 1 17.6 21H7" fill="${c}"/></svg>`,
    share: (s = 64, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M13 4l8 7-8 7v-4C8 14 5 16 3 20c0-6 3-10 10-11z" fill="${c}"/></svg>`,
    bell: (s = 64, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M12 3a6 6 0 0 0-6 6v4l-2 3h16l-2-3V9a6 6 0 0 0-6-6zM10 19a2 2 0 0 0 4 0" fill="${c}"/></svg>`,
    comment: (s = 64, c = '#fff') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M4 4h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H10l-5 4v-4H4a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" fill="${c}"/></svg>`,
    db: (s = 64, c = C.blue) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><ellipse cx="12" cy="5.5" rx="8" ry="3" fill="#fff" stroke="${c}" stroke-width="2"/><path d="M4 5.5v13c0 1.7 3.6 3 8 3s8-1.3 8-3v-13M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" fill="none" stroke="${c}" stroke-width="2"/></svg>`,
    contacts: (s = 64, c = C.blue) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="3" y="3" width="18" height="18" rx="4" fill="#fff" stroke="${c}" stroke-width="2"/><circle cx="12" cy="10" r="3.2" fill="${c}"/><path d="M6.5 18c1-3 3-4 5.5-4s4.5 1 5.5 4" fill="${c}"/></svg>`,
    txt: (s = 64, c = C.blue) => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path d="M6 2.5h8l5 5v13a1.5 1.5 0 0 1-1.5 1.5h-11A1.5 1.5 0 0 1 5 20.5V4A1.5 1.5 0 0 1 6 2.5z" fill="#fff" stroke="${c}" stroke-width="2"/><text x="12" y="17.5" font-size="5.6" font-weight="800" fill="${c}" text-anchor="middle" font-family="Prompt">CSV</text></svg>`,
    kbd: (w = 300) => `<svg width="${w}" height="${w * .3}" viewBox="0 0 300 90"><rect x="2" y="2" width="296" height="86" rx="14" fill="#E9EEF8" stroke="#B7C4DC" stroke-width="3"/>${[0, 1, 2].map(r => [...Array(10 - r)].map((_, i) => `<rect class="kk" x="${14 + r * 10 + i * 27.5}" y="${12 + r * 24}" width="23" height="19" rx="4" fill="#fff"/>`).join('')).join('')}<rect class="kk" x="80" y="66" width="140" height="14" rx="5" fill="#fff"/></svg>`,
  };

  // ------------------------------------------------------------------ letter card (design 300 × 400)
  // slots: name / addr. modes: 'blank' | 'field' (placeholder «ชื่อ») | 'value' (recipient data) | 'typed' (manual text)
  function letter(w = 300, { head = C.pink } = {}) {
    const k = w / 300;
    const el = h(`<div class="mm-letter" style="position:relative;width:${w}px;height:${w * 4 / 3}px">
      <div style="position:absolute;left:0;top:0;width:300px;height:400px;transform:scale(${k});transform-origin:0 0;border-radius:18px;background:#fff;box-shadow:0 14px 30px rgba(20,43,83,.28),inset 0 0 0 2px #E3E9F5;overflow:hidden">
        <div style="height:16px;background:linear-gradient(90deg,${head},#95BFEF)"></div>
        <div style="position:absolute;right:20px;top:30px;width:44px;height:44px;border-radius:50%;border:4px solid #DCE6F4"></div>
        <div style="padding:26px 22px 0;font-weight:700;font-size:25px;line-height:1.35;color:${C.ink}">
          <div style="display:flex;gap:8px;align-items:center;height:42px"><span>เรียน</span><span class="lt-n" style="border-radius:10px;padding:0 8px;white-space:nowrap"></span></div>
          <div style="height:40px;display:flex;align-items:center"><span class="lt-a" style="border-radius:10px;padding:0 8px;font-size:22px;white-space:nowrap"></span></div></div>
        <div class="lt-body" style="position:absolute;left:22px;right:22px;top:150px;border-radius:12px;padding:10px 8px">
          ${[100, 92, 96, 70, 88, 60].map(p => `<div style="height:13px;width:${p}%;border-radius:7px;background:#DCE5F3;margin-bottom:14px"></div>`).join('')}</div>
        <div style="position:absolute;right:24px;bottom:22px;width:110px;height:12px;border-radius:6px;background:#C9D6EA"></div>
      </div></div>`);
    const n = el.querySelector('.lt-n'), a = el.querySelector('.lt-a'), body = el.querySelector('.lt-body');
    const styl = (sp, mode, glow) => {
      if (mode === 'field') { sp.style.background = `rgba(34,211,238,${.18 + .3 * glow})`; sp.style.color = '#0B6B9A'; sp.style.boxShadow = `0 0 0 ${2 + 3 * glow}px rgba(34,211,238,${.6 + .4 * glow})`; }
      else if (mode === 'value') { sp.style.background = `rgba(238,127,170,${.2 + .35 * glow})`; sp.style.color = '#B83A6C'; sp.style.boxShadow = `0 0 0 ${2 + 3 * glow}px rgba(238,127,170,${.5 + .5 * glow})`; }
      else { sp.style.background = 'transparent'; sp.style.color = C.ink; sp.style.boxShadow = 'none'; }
    };
    // s: { name, addr, mode, nameMode, addrMode, glow 0..1 (variable slots), body 0..1 (body highlight) }
    function set(s = {}) {
      const nm = s.nameMode || s.mode || 'blank', am = s.addrMode || s.mode || 'blank';
      n.textContent = nm === 'field' ? '«ชื่อ»' : (s.name ?? ''); a.textContent = am === 'field' ? '«ที่อยู่»' : (s.addr ?? '');
      styl(n, nm, s.glow || 0); styl(a, am, s.glow || 0);
      const b = s.body || 0; body.style.background = `rgba(34,211,238,${.16 * b})`; body.style.boxShadow = b > .01 ? `0 0 0 ${3 * b}px rgba(34,211,238,${.7 * b})` : 'none';
    }
    set({});
    return { el, set };
  }

  // ------------------------------------------------------------------ recipient table (design 600 wide)
  function sheet(rows, w = 600, { title = 'Excel · รายชื่อผู้รับ' } = {}) {
    const k = w / 600, RH = 74, HH = 64, TH = 58;
    const el = h(`<div style="position:relative;width:${w}px;height:${(TH + HH + RH * rows.length + 14) * k}px">
      <div style="position:absolute;left:0;top:0;width:600px;transform:scale(${k});transform-origin:0 0;border-radius:22px;background:#fff;box-shadow:0 18px 36px rgba(20,43,83,.28),0 0 0 4px rgba(30,158,90,.35);overflow:hidden;font-family:Prompt">
        <div style="height:${TH}px;display:flex;align-items:center;gap:12px;padding:0 18px;background:linear-gradient(90deg,${C.xl},#3BBF7A);color:#fff;font-weight:800;font-size:28px">${IC.xlTile(40).replace(/fill="#fff" stroke="#1E9E5A"/, 'fill="rgba(255,255,255,.9)" stroke="#fff"')}<span>${title}</span><span style="margin-left:auto;font-size:18px;font-weight:600;background:rgba(255,255,255,.22);padding:2px 10px;border-radius:10px">ข้อมูลสมมติ</span></div>
        <div style="display:flex;height:${HH}px;align-items:center;background:#E8F6EE;font-weight:800;font-size:30px;color:${C.xlD}">
          <div style="width:52px;text-align:center;font-size:18px;color:#7FA592"></div><div style="width:220px;padding-left:18px;border-left:2px solid #CFE8DA">ชื่อ</div><div style="flex:1;padding-left:18px;border-left:2px solid #CFE8DA">ที่อยู่</div></div>
        ${rows.map((r, i) => `<div class="sh-row" style="position:relative;display:flex;height:${RH}px;align-items:center;border-top:2px solid #E6EDF5;font-weight:700;font-size:31px;color:${C.ink}">
          <div class="sh-hl" style="position:absolute;inset:3px 4px;border-radius:12px;opacity:0;background:rgba(255,210,63,.35);box-shadow:0 0 0 3px ${C.yel}"></div>
          <div style="position:relative;width:52px;text-align:center;font-size:20px;color:#9AA8BC;font-weight:600">${i + 2}</div>
          <div class="sh-n" style="position:relative;width:220px;padding-left:18px;border-left:2px solid #EEF2F7;white-space:nowrap">${r[0]}</div>
          <div class="sh-a" style="position:relative;flex:1;padding-left:18px;border-left:2px solid #EEF2F7;white-space:nowrap">${r[1]}</div></div>`).join('')}
      </div></div>`);
    const rws = [...el.querySelectorAll('.sh-row')];
    return {
      el, k, rows: rws,
      hl: (i, v) => { const r = rws[i]; if (r) r.querySelector('.sh-hl').style.opacity = clamp(v); },
      rowY: i => (TH + HH + RH * i + RH / 2) * k,    // centre of row i, local px
      nameX: (52 + 110) * k, addrX: (272 + 164) * k,
    };
  }

  // ------------------------------------------------------------------ Word window (design 660 wide)
  const CMDS = [['Start Mail Merge', 'start'], ['Select Recipients', 'sel'], ['Insert Merge Field', 'ins'], ['Preview Results', 'prev'], ['Finish & Merge', 'fin']];
  const CMD_IC = {
    start: `<svg width="44" height="44" viewBox="0 0 24 24"><rect x="4" y="3" width="13" height="17" rx="2" fill="#fff" stroke="#2B5FC9" stroke-width="1.8"/><path d="M15 13l6 0M18 10l3 3-3 3" fill="none" stroke="#EE7FAA" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><path d="M7 8h7M7 11h5" stroke="#2B5FC9" stroke-width="1.6" stroke-linecap="round"/></svg>`,
    sel: `<svg width="44" height="44" viewBox="0 0 24 24"><circle cx="9" cy="8" r="3.4" fill="#2B5FC9"/><path d="M3 19c.8-4 3-5.5 6-5.5s5.2 1.5 6 5.5z" fill="#2B5FC9"/><circle cx="17" cy="9" r="2.6" fill="#EE7FAA"/><path d="M14.5 18c.5-3 2-4.2 3.8-4.2 1.8 0 3 1.2 3.4 4.2z" fill="#EE7FAA"/></svg>`,
    ins: `<svg width="44" height="44" viewBox="0 0 24 24"><rect x="2.5" y="7" width="19" height="10" rx="3" fill="#E0F9FD" stroke="#0EA5C6" stroke-width="1.8"/><text x="12" y="14.6" font-size="7" font-weight="800" fill="#0B6B9A" text-anchor="middle" font-family="Prompt">«  »</text></svg>`,
    prev: `<svg width="44" height="44" viewBox="0 0 24 24"><path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12z" fill="#fff" stroke="#2B5FC9" stroke-width="1.8"/><circle cx="12" cy="12" r="3.2" fill="#EE7FAA"/></svg>`,
    fin: `<svg width="44" height="44" viewBox="0 0 24 24"><rect x="3" y="4" width="11" height="14" rx="2" fill="#fff" stroke="#2B5FC9" stroke-width="1.8"/><rect x="9" y="7" width="11" height="14" rx="2" fill="#fff" stroke="#2B5FC9" stroke-width="1.8"/><path d="M12 14l2 2 4-4.5" fill="none" stroke="#22C55E" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/></svg>`,
  };
  function word(w = 660) {
    const k = w / 660;
    const el = h(`<div class="mm-word" style="position:relative;width:${w}px;height:${790 * k}px">
      <div class="wd-in" style="position:absolute;left:0;top:0;width:660px;height:790px;transform:scale(${k});transform-origin:0 0;border-radius:24px;background:#E7ECF5;box-shadow:0 26px 50px rgba(12,27,58,.35),0 0 0 4px rgba(47,107,255,.35);overflow:hidden;font-family:Prompt">
        <div style="height:56px;display:flex;align-items:center;gap:12px;padding:0 16px;background:linear-gradient(90deg,${C.wordD},${C.word});color:#fff">
          ${IC.wordTile(40).replace(/stroke="#2B5FC9"/, 'stroke="#fff"')}<span style="font-weight:800;font-size:26px">Word</span><span style="font-weight:600;font-size:20px;opacity:.85">จดหมายแจ้ง.docx</span>
          <span style="margin-left:auto;font-size:16px;font-weight:600;background:rgba(255,255,255,.2);padding:2px 10px;border-radius:10px">ภาพจำลอง</span></div>
        <div style="height:48px;display:flex;align-items:flex-end;gap:6px;padding:0 14px;background:#F4F6FB;font-weight:600;font-size:22px;color:#5D6B82">
          ${['File', 'Home', 'Insert', 'Layout', 'Mailings'].map((n, i) => `<div class="wd-tab" style="position:relative;padding:6px 14px 8px;border-radius:12px 12px 0 0">${n}<i style="position:absolute;left:10px;right:10px;bottom:0;height:4px;border-radius:2px;background:${C.word};opacity:0"></i></div>`).join('')}</div>
        <div class="wd-rib" style="position:relative;height:120px;display:flex;gap:4px;padding:8px 10px;background:#fff;border-bottom:2px solid #DCE3EF">
          <div class="wd-ribHome" style="position:absolute;inset:8px 10px;display:flex;gap:16px;align-items:center;padding-left:10px">${[56, 44, 70, 52, 62].map(x => `<div style="width:${x}px;height:56px;border-radius:10px;background:#EEF2F8"></div>`).join('')}</div>
          ${CMDS.map(([n, key]) => `<div class="wd-btn" data-k="${key}" style="position:relative;width:124px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;border-radius:14px;text-align:center;font-weight:600;font-size:16px;line-height:1.15;color:${C.ink}">${CMD_IC[key]}<span>${n.replace(' ', '<br>').replace('<br>Mail ', ' Mail<br>')}</span><div class="wd-ring" style="position:absolute;inset:-2px;border-radius:14px;box-shadow:0 0 0 4px ${C.pink},0 0 22px rgba(238,127,170,.8);background:rgba(238,127,170,.12);opacity:0"></div></div>`).join('')}
        </div>
        <div class="wd-area" style="position:absolute;left:0;right:0;top:224px;bottom:0;overflow:hidden">
          <div class="wd-page" style="position:absolute;left:60px;top:24px;width:540px;height:620px;border-radius:10px;background:#fff;box-shadow:0 10px 24px rgba(20,43,83,.18)">
            <div style="position:absolute;left:0;right:0;top:0;height:12px;border-radius:10px 10px 0 0;background:linear-gradient(90deg,#EE7FAA,#95BFEF)"></div>
            <div style="padding:40px 38px 0;font-weight:700;font-size:34px;color:${C.ink};line-height:1.3">
              <div style="display:flex;gap:12px;align-items:center;height:60px"><span class="wd-dear">เรียน</span><span class="wd-n" style="border-radius:12px;padding:0 10px;white-space:nowrap"></span><i class="wd-car" style="width:3px;height:40px;background:${C.blue}"></i></div>
              <div style="height:56px;display:flex;align-items:center"><span class="wd-a" style="border-radius:12px;padding:0 10px;font-size:30px;white-space:nowrap"></span></div></div>
            <div class="wd-body" style="position:absolute;left:38px;right:38px;top:190px;border-radius:14px;padding:12px 10px">
              ${[100, 94, 98, 76, 92, 64, 88].map((p, i) => `<div class="wd-bl" style="height:16px;width:${p}%;border-radius:8px;background:#DCE5F3;margin-bottom:20px"></div>`).join('')}</div>
            <div style="position:absolute;right:40px;bottom:40px;font-weight:600;font-size:22px;color:#9AA8BC">ขอแสดงความนับถือ</div>
          </div>
          <div class="wd-nav" style="position:absolute;right:20px;top:30px;display:flex;flex-direction:column;align-items:center;gap:8px;padding:12px 10px;border-radius:18px;background:#fff;box-shadow:0 8px 18px rgba(20,43,83,.2);font-weight:800;font-size:28px;color:${C.word}"><span style="font-size:18px;color:#7A8BA3">ผู้รับ</span><span class="wd-navn">1</span><span class="wd-next" style="display:grid;place-items:center;width:46px;height:46px;border-radius:50%;background:${C.word};color:#fff;font-size:24px">▶</span></div>
        </div>
        <div class="wd-menu" style="position:absolute;left:0;top:200px;width:330px;border-radius:18px;background:#fff;box-shadow:0 18px 36px rgba(20,43,83,.35),0 0 0 3px #C9D6EA;padding:10px;font-weight:700;font-size:26px;color:${C.ink};opacity:0"></div>
      </div></div>`);
    const q = s => el.querySelector(s), qa = s => [...el.querySelectorAll(s)];
    const tabs = qa('.wd-tab'), btns = qa('.wd-btn'), page = q('.wd-page'), menu = q('.wd-menu');
    const nameSp = q('.wd-n'), addrSp = q('.wd-a'), body = q('.wd-body'), bls = qa('.wd-bl');
    let menuKey = '';
    const slot = (sp, mode, txt, glow) => {
      sp.textContent = mode === 'field' ? txt : (txt || '');
      if (mode === 'field') { sp.style.background = `rgba(34,211,238,${.2 + .3 * glow})`; sp.style.color = '#0B6B9A'; sp.style.boxShadow = `0 0 0 ${3 + 3 * glow}px rgba(34,211,238,${.6 + .4 * glow})`; }
      else if (mode === 'value') { sp.style.background = `rgba(238,127,170,${.2 + .3 * glow})`; sp.style.color = '#B83A6C'; sp.style.boxShadow = `0 0 0 ${3 + 3 * glow}px rgba(238,127,170,${.5 + .5 * glow})`; }
      else { sp.style.background = 'transparent'; sp.style.color = C.ink; sp.style.boxShadow = 'none'; }
    };
    // s: { mailings 0..1 (tab active), hover tab idx, btn {key: 0..1 highlight}, ribbon 0..1 (mailings ribbon visible),
    //      menu: {items:[...], x, sel, o} , page 0..1, body 0..1 (lines typed), name/addr {mode, text}, glow, bodyHl, nav 0..1, navN, caret, t }
    function draw(s = {}) {
      const mt = clamp(s.mailings || 0);
      tabs.forEach((tb, i) => { const on = i === 4 ? mt : (i === 1 ? 1 - mt : 0); tb.style.background = on > .5 ? '#fff' : 'transparent'; tb.style.color = i === 4 && mt > .5 ? C.word : ''; tb.querySelector('i').style.opacity = on; tb.style.boxShadow = i === 4 && s.tabRing ? `0 0 0 ${4 * s.tabRing}px ${C.pink}` : 'none'; tb.style.fontWeight = i === 4 && mt > .5 ? 800 : 600; });
      const rb = clamp(s.ribbon ?? mt);
      q('.wd-ribHome').style.opacity = 1 - rb;
      btns.forEach((b, i) => { b.style.opacity = rb; const v = (s.btn || {})[b.dataset.k] || 0; b.querySelector('.wd-ring').style.opacity = clamp(v); b.style.transform = `scale(${1 + .06 * clamp(v) - .06 * (s.press?.[b.dataset.k] || 0)})`; });
      const m = s.menu;
      if (m && m.o > .001) {
        const key = m.items.join('|');
        if (key !== menuKey) { menuKey = key; menu.innerHTML = m.items.map(it => `<div class="wd-mi" style="padding:10px 16px;border-radius:12px;white-space:nowrap">${it}</div>`).join(''); }
        menu.style.left = (m.x ?? 20) + 'px'; menu.style.width = (m.w ?? 330) + 'px';
        tf(menu, { o: clamp(m.o), y: (1 - E.out(clamp(m.o))) * -16 });
        [...menu.children].forEach((it, i) => { const on = i === m.sel; it.style.background = on ? 'rgba(238,127,170,.18)' : 'transparent'; it.style.boxShadow = on ? `inset 0 0 0 3px ${C.pink}` : 'none'; it.style.color = on ? '#B83A6C' : ''; });
      } else menu.style.opacity = 0;
      const pg = clamp(s.page ?? 1); tf(page, { o: clamp(pg * 2), s: lerp(.92, 1, E.out(pg)), y: (1 - E.out(pg)) * 30 });
      const bd = s.body ?? 1; bls.forEach((b, i) => { b.style.transform = `scaleX(${clamp(bd * bls.length - i)})`; b.style.transformOrigin = '0 50%'; });
      q('.wd-dear').style.opacity = clamp(bd * 6);
      const nm = s.name || {}, ad = s.addr || {};
      slot(nameSp, nm.mode, nm.text, s.glow || 0); slot(addrSp, ad.mode, ad.text, s.glow || 0);
      nameSp.style.transform = `scale(${nm.pop ? 1 + .25 * Math.sin(Math.PI * clamp(nm.pop)) : 1})`; addrSp.style.transform = `scale(${ad.pop ? 1 + .25 * Math.sin(Math.PI * clamp(ad.pop)) : 1})`;
      const bh = s.bodyHl || 0; body.style.background = `rgba(34,211,238,${.14 * bh})`; body.style.boxShadow = bh > .01 ? `0 0 0 ${4 * bh}px rgba(34,211,238,${.7 * bh})` : 'none';
      q('.wd-car').style.opacity = s.caret && Math.floor((s.t || 0) * 3) % 2 === 0 ? 1 : 0;
      const nv = clamp(s.nav || 0); tf(q('.wd-nav'), { o: nv, s: lerp(.6, 1, E.out(nv)) }); q('.wd-navn').textContent = s.navN || 1;
      q('.wd-next').style.transform = `scale(${1 - .18 * (s.navPress || 0)})`;
    }
    // stage-space helpers (window-local, unscaled design units × k)
    const btnX = key => { const i = CMDS.findIndex(c => c[1] === key); return (10 + 4 * i + 124 * i + 62) * k; };
    const tabX = () => (14 + 4 * 6 + 470) * k;   // approximate centre of "Mailings"
    return { el, draw, k, btnX, tabX, BTN_Y: 164 * k, TAB_Y: 82 * k, nameXY: [(60 + 38 + 110 + 80) * k, (224 + 24 + 40 + 30) * k], addrXY: [(60 + 38 + 120) * k, (224 + 24 + 100 + 28) * k], pageTop: (224 + 24) * k };
  }

  // ------------------------------------------------------------------ paper stack (n sheets)
  function stack(n = 14, w = 200, tint = '#fff') {
    const el = h(`<div style="position:relative;width:${w}px;height:${w * 1.6}px"></div>`);
    const sh = [...Array(n)].map((_, i) => { const d = h(`<div style="position:absolute;left:0;bottom:0;width:${w}px;height:${w * .3}px;border-radius:8px;background:${tint};box-shadow:0 3px 0 #C9D4E6,0 6px 10px rgba(12,27,58,.18)"><div style="position:absolute;left:12%;right:20%;top:30%;height:12%;border-radius:4px;background:#DCE5F3"></div></div>`); el.appendChild(d); return d; });
    // fill 0..1: sheets landed; t for wobble
    function set(fill, t = 0) {
      const f = fill * n;
      sh.forEach((d, i) => { const u = clamp(f - i); const y = -i * w * .085 - (1 - E.out(u)) * 220; d.style.transform = `translate(${Math.sin(i * 2.3) * 8 + Math.sin(t * 3 + i) * u * 1.2}px,${y}px) rotate(${Math.sin(i * 1.7) * 3}deg)`; d.style.opacity = u > 0 ? clamp(u * 3) : 0; });
    }
    set(1);
    return { el, set };
  }

  // ------------------------------------------------------------------ connector (inside an <svg> overlay)
  function link(svg, { c = C.cyan, wdt = 7 } = {}) {
    const ns = 'http://www.w3.org/2000/svg';
    const glow = document.createElementNS(ns, 'path'), p = document.createElementNS(ns, 'path'), dot = document.createElementNS(ns, 'circle');
    glow.setAttribute('fill', 'none'); glow.setAttribute('stroke', c); glow.setAttribute('stroke-width', wdt * 3); glow.setAttribute('stroke-linecap', 'round'); glow.setAttribute('opacity', .22);
    p.setAttribute('fill', 'none'); p.setAttribute('stroke', c); p.setAttribute('stroke-width', wdt); p.setAttribute('stroke-linecap', 'round');
    dot.setAttribute('r', wdt * 1.5); dot.setAttribute('fill', '#fff'); dot.setAttribute('stroke', c); dot.setAttribute('stroke-width', wdt * .7);
    svg.append(glow, p, dot);
    // pts [x1,y1,x2,y2], draw 0..1, dot 0..1 (travel), o
    function set([x1, y1, x2, y2], draw, dt = -1, o = 1, bend = .45) {
      const dx = x2 - x1, dy = y2 - y1;
      const d = `M${x1} ${y1} C${x1 + dx * bend} ${y1 + dy * .05} ${x2 - dx * bend} ${y2 - dy * .05} ${x2} ${y2}`;
      p.setAttribute('d', d); glow.setAttribute('d', d);
      const L = p.getTotalLength() || 1, dr = clamp(draw);
      [p, glow].forEach(e => { e.setAttribute('stroke-dasharray', `${L} ${L}`); e.setAttribute('stroke-dashoffset', L * (1 - dr)); });
      p.setAttribute('opacity', o); glow.setAttribute('opacity', .22 * o);
      if (dt >= 0 && dt <= 1 && o > 0) { const pt = p.getPointAtLength(E.inOut(dt) * L); dot.setAttribute('cx', pt.x); dot.setAttribute('cy', pt.y); dot.setAttribute('opacity', o); } else dot.setAttribute('opacity', 0);
    }
    return { set };
  }

  // ------------------------------------------------------------------ monitor (screen design 860 × 540)
  function monitor(w = 420, dark = true) {
    const k = w / 900;
    const el = h(`<div style="position:relative;width:${w}px;height:${w * .78}px">
      <div style="position:absolute;left:${w * .41}px;top:${w * .6}px;width:${w * .18}px;height:${w * .13}px;background:linear-gradient(90deg,#7F8DA8,#C3CCDD,#7F8DA8)"></div>
      <div style="position:absolute;left:${w * .3}px;top:${w * .72}px;width:${w * .4}px;height:${w * .05}px;border-radius:${w * .03}px;background:linear-gradient(180deg,#C3CCDD,#8E9BB4)"></div>
      <div style="position:absolute;left:0;top:0;width:${w}px;height:${w * .64}px;border-radius:${w * .04}px;background:linear-gradient(180deg,#26365A,#18233D);box-shadow:0 ${w * .03}px ${w * .06}px rgba(0,0,0,.35),0 0 ${w * .08}px rgba(34,211,238,${dark ? .35 : .12})">
        <div class="m-scr" style="position:absolute;left:${20 * k}px;top:${20 * k}px;width:860px;height:540px;transform:scale(${k});transform-origin:0 0;border-radius:14px;overflow:hidden;background:#EAF1FB"></div></div></div>`);
    return { el, screen: el.querySelector('.m-scr') };
  }

  // ------------------------------------------------------------------ office set (world 1080 × 1920, parallax camera)
  function office(root, theme = 'night', { monX = 320 } = {}) {
    const N = theme === 'night';
    const wall = N ? 'linear-gradient(180deg,#1F3B70 0%,#142B53 60%,#0F2245 100%)' : 'linear-gradient(180deg,#EAF2FD 0%,#F6EAF4 70%,#F9E2EE 100%)';
    const floor = N ? 'linear-gradient(180deg,#0E1F40,#0A1730)' : 'linear-gradient(180deg,#CFDDF2,#BCCDE8)';
    const layer = (p, html) => { const el = h(`<div style="position:absolute;left:0;top:0;width:1080px;height:1920px;transform-origin:0 0">${html}</div>`); el.p = p; root.appendChild(el); return el; };
    const binder = (x, c, hh = 150) => `<div style="position:absolute;left:${x}px;bottom:0;width:38px;height:${hh}px;border-radius:6px;background:${c};box-shadow:inset -6px 0 0 rgba(0,0,0,.12)"><div style="position:absolute;left:8px;right:8px;top:22px;height:28px;border-radius:4px;background:#fff;opacity:.8"></div></div>`;
    const back = layer(.5, `
      <div style="position:absolute;left:-500px;top:-400px;width:2080px;height:1800px;background:${wall}"></div>
      <div style="position:absolute;left:-500px;top:1400px;width:2080px;height:900px;background:${floor}"></div>
      <div style="position:absolute;left:-500px;top:1392px;width:2080px;height:10px;background:${N ? '#22D3EE' : '#fff'};opacity:${N ? .35 : .9}"></div>
      <div style="position:absolute;left:40px;top:300px;width:380px;height:520px;border-radius:24px;background:${N ? '#0B1834' : '#fff'};box-shadow:0 0 0 12px ${N ? '#2A4479' : '#fff'},0 16px 30px rgba(0,0,0,.25)">
        <div style="position:absolute;inset:14px;border-radius:14px;overflow:hidden;background:${N ? 'linear-gradient(180deg,#0B1834,#1C3A72 80%,#3A3F86)' : 'linear-gradient(180deg,#BFDDFB,#E3F0FF 60%,#FFE3EF)'}">
          <div style="position:absolute;left:-20px;bottom:0;width:420px;height:200px;background:${N ? '#132C5C' : '#C4D6F1'};clip-path:polygon(0 60%,8% 30%,16% 30%,16% 10%,30% 10%,30% 40%,44% 40%,44% 0,60% 0,60% 35%,74% 35%,74% 20%,90% 20%,90% 50%,100% 50%,100% 100%,0 100%)"></div>
          ${N ? [...Array(18)].map((_, i) => `<div style="position:absolute;left:${20 + (i * 53) % 330}px;top:${330 + (i * 37) % 150}px;width:10px;height:14px;border-radius:2px;background:${i % 3 ? '#FFD23F' : '#22D3EE'};opacity:.7"></div>`).join('') : ''}
          ${[0, 1, 2, 3, 4, 5].map(i => `<div style="position:absolute;left:0;right:0;top:${i * 82}px;height:12px;background:rgba(255,255,255,${N ? .06 : .5})"></div>`).join('')}</div></div>
      <div class="of-cal" style="position:absolute;left:480px;top:330px;width:200px;height:230px;border-radius:18px;background:#fff;box-shadow:0 12px 24px rgba(0,0,0,.2);overflow:hidden;text-align:center;font-family:Prompt">
        <div style="height:60px;background:linear-gradient(90deg,#EE7FAA,#F7A8C8);color:#fff;font-weight:800;font-size:30px;line-height:60px">ปฏิทิน</div>
        <div class="of-calD" style="font-weight:800;font-size:46px;color:${C.ink};margin-top:24px">จันทร์</div><div style="font-weight:700;font-size:26px;color:#7A8BA3">08:30 น.</div></div>
      <div style="position:absolute;left:740px;top:320px;width:150px;height:150px;border-radius:50%;background:#fff;box-shadow:0 10px 22px rgba(0,0,0,.2),inset 0 0 0 10px ${C.pink}">
        <div class="of-hh" style="position:absolute;left:72px;top:40px;width:6px;height:36px;border-radius:3px;background:${C.ink};transform-origin:3px 35px"></div><div class="of-mm" style="position:absolute;left:72px;top:26px;width:6px;height:50px;border-radius:3px;background:${C.pink};transform-origin:3px 49px"></div></div>
      <div style="position:absolute;left:720px;top:560px;width:420px;height:220px;border-bottom:14px solid ${N ? '#2A4479' : '#fff'}">
        <div style="position:absolute;left:10px;bottom:0;width:400px;height:150px">${binder(0, '#EE7FAA')}${binder(44, '#95BFEF')}${binder(88, '#22D3EE', 130)}${binder(132, '#F8CFE2')}${binder(176, '#2F6BFF', 140)}${binder(220, '#FFD23F', 120)}${binder(264, '#95BFEF')}</div></div>
      <div style="position:absolute;left:820px;top:860px;width:250px;height:540px;border-radius:18px;background:${N ? 'linear-gradient(180deg,#2A4479,#1C3360)' : 'linear-gradient(180deg,#E6EDF8,#D2DDF0)'};box-shadow:0 16px 30px rgba(0,0,0,.25)">
        ${[0, 1, 2].map(i => `<div style="position:absolute;left:16px;right:16px;top:${18 + i * 172}px;height:154px;border-radius:12px;background:${N ? '#33508A' : '#F4F7FC'}"><div style="position:absolute;left:70px;top:24px;width:80px;height:14px;border-radius:7px;background:${N ? '#5C7CB8' : '#B7C6DE'}"></div></div>`).join('')}</div>
      <div style="position:absolute;left:880px;top:732px;width:150px;height:130px">${IC.printer(150)}</div>
      <div style="position:absolute;left:-60px;top:1040px;width:150px;height:360px"><div style="position:absolute;left:40px;bottom:0;width:80px;height:96px;border-radius:12px 12px 22px 22px;background:#EE7FAA"></div>
        ${[[-38, 0], [-10, -18], [22, -6], [-26, 30], [12, 22]].map(([r, dx]) => `<div style="position:absolute;left:${62 + dx}px;bottom:86px;width:44px;height:180px;border-radius:50% 50% 50% 50%/80% 80% 20% 20%;background:linear-gradient(180deg,#7EDDB5,#3FB487);transform-origin:50% 100%;transform:rotate(${r}deg)"></div>`).join('')}</div>`);
    const actors = layer(1, '');
    const mon = monitor(440, N);
    const front = layer(1, `
      <div style="position:absolute;left:40px;top:1240px;width:1000px;height:40px;border-radius:14px;background:${N ? 'linear-gradient(180deg,#F3D6E6,#E3B9CF)' : 'linear-gradient(180deg,#FFFFFF,#F1E6EE)'};box-shadow:0 6px 0 ${N ? '#C994B0' : '#E3D3DF'}"></div>
      <div style="position:absolute;left:80px;top:1280px;width:920px;height:420px;border-radius:0 0 26px 26px;background:${N ? 'linear-gradient(180deg,#D99BB9,#B87897)' : 'linear-gradient(180deg,#F4D3E2,#E9BCD2)'};box-shadow:0 26px 40px rgba(0,0,0,.3)">
        <div style="position:absolute;left:50px;top:40px;width:360px;height:130px;border-radius:16px;background:rgba(255,255,255,.3)"></div><div style="position:absolute;left:510px;top:40px;width:360px;height:130px;border-radius:16px;background:rgba(255,255,255,.3)"></div></div>
      <div class="of-kbd" style="position:absolute;left:${monX + 70}px;top:1196px">${IC.kbd(300)}</div>
`);
    const monWrap = h(`<div style="position:absolute;left:${monX}px;top:880px"></div>`); monWrap.appendChild(mon.el); front.appendChild(monWrap);
    const vig = h(`<div style="position:absolute;inset:0;pointer-events:none;background:radial-gradient(ellipse at 50% 45%,rgba(0,0,0,0) 55%,rgba(5,12,30,${N ? .45 : .15}) 100%)"></div>`); root.appendChild(vig);
    const layers = [back, actors, front];
    function camera(cx, cy, z, dof = 0) {
      layers.forEach(L => { const p = L.p, zl = 1 + (z - 1) * p, lx = lerp(540, cx, p), ly = lerp(960, cy, p); L.style.transform = `translate(540px,960px) scale(${zl}) translate(${-lx}px,${-ly}px)`; });
      back.style.filter = dof > .05 ? `blur(${dof * 6}px)` : '';
    }
    const keys = [...front.querySelectorAll('.kk')];
    function typing(t, on) { keys.forEach((kk, i) => { const hit = on && Math.floor(t * 14 + i * 7.3) % 9 === 0; kk.setAttribute('fill', hit ? C.cyan : '#fff'); }); }
    function clock(t, base = 8.5) { const hr = base + t / 60; back.querySelector('.of-hh').style.transform = `rotate(${(hr % 12) * 30}deg)`; back.querySelector('.of-mm').style.transform = `rotate(${(hr * 60 % 60) * 6}deg)`; }
    return { root, actors, front, back, camera, mon, typing, clock, cal: back.querySelector('.of-cal'), calD: back.querySelector('.of-calD') };
  }

  window.MM = { C, IC, letter, sheet, word, stack, link, monitor, office, CMDS };
})();
