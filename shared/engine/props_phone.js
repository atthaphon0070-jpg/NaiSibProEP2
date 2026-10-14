// NaiSibPro smartphone device (shared, EP05+). A large, glossy phone for screen-space close-ups.
// The screen is authored at a fixed 500 × 1060 design size; scale the whole device with NSP.tf.
//   const ph = PHONE.device();  ph.el (append anywhere), ph.screen(html) → adds a layer, returns it
//   PHONE.statusBar(time, dark)  PHONE.header(title, color)  PHONE.button(label, color)
// Generic, fictional banking UI only: no real bank names, logos or colours.
(function () {
  const { h } = window.NSP;
  const SW = 500, SH = 1060, BZ = 20;
  function device() {
    const el = h(`<div style="position:absolute;left:0;top:0;width:${SW + 2 * BZ}px;height:${SH + 2 * BZ + 4}px;transform-origin:50% 50%">
      <div style="position:absolute;inset:0;border-radius:86px;background:linear-gradient(145deg,#56627F 0%,#2D3550 55%,#20263A 100%);box-shadow:0 40px 80px rgba(50,40,90,.35),0 0 0 4px #8C97B3,inset 0 0 0 3px rgba(255,255,255,.25)"></div>
      <div style="position:absolute;right:-7px;top:240px;width:7px;height:120px;border-radius:0 4px 4px 0;background:#8C97B3"></div>
      <div style="position:absolute;left:-7px;top:200px;width:7px;height:70px;border-radius:4px 0 0 4px;background:#8C97B3"></div>
      <div class="ph-scr" style="position:absolute;left:${BZ}px;top:${BZ + 2}px;width:${SW}px;height:${SH}px;border-radius:68px;overflow:hidden;background:#F5F8FF"></div>
      <div style="position:absolute;left:${BZ + SW / 2 - 70}px;top:${BZ + 18}px;width:140px;height:40px;border-radius:20px;background:#141826"></div>
      <div class="ph-glare" style="position:absolute;left:${BZ}px;top:${BZ + 2}px;width:${SW}px;height:${SH}px;border-radius:68px;pointer-events:none;background:linear-gradient(115deg,rgba(255,255,255,.28) 0%,rgba(255,255,255,0) 28%,rgba(255,255,255,0) 70%,rgba(255,255,255,.10) 100%)"></div></div>`);
    const scr = el.querySelector('.ph-scr');
    return { el, scr, W: SW + 2 * BZ, H: SH + 2 * BZ + 4, screen(html) { const s = h(`<div style="position:absolute;inset:0">${html}</div>`); scr.appendChild(s); return s; } };
  }
  const statusBar = (time = '10:42', dark = false) => `<div style="position:absolute;left:0;right:0;top:0;height:70px;display:flex;align-items:center;justify-content:space-between;padding:12px 52px 0;font-family:Prompt;font-weight:700;font-size:24px;color:${dark ? '#fff' : '#31445D'}">
      <span>${time}</span><span style="display:flex;gap:8px;align-items:center"><svg width="30" height="20" viewBox="0 0 30 20"><rect x="0" y="12" width="5" height="8" rx="1.5" fill="currentColor"/><rect x="8" y="8" width="5" height="12" rx="1.5" fill="currentColor"/><rect x="16" y="4" width="5" height="16" rx="1.5" fill="currentColor"/><rect x="24" y="0" width="5" height="20" rx="1.5" fill="currentColor"/></svg>
      <svg width="40" height="20" viewBox="0 0 40 20"><rect x="1" y="2" width="33" height="16" rx="5" fill="none" stroke="currentColor" stroke-width="2.4"/><rect x="4.5" y="5.5" width="22" height="9" rx="2.5" fill="currentColor"/><rect x="35.5" y="7" width="3" height="6" rx="1.5" fill="currentColor"/></svg></span></div>`;
  const header = (title, c1 = '#6F9FE0', c2 = '#95BFEF') => `<div style="position:absolute;left:0;right:0;top:0;height:200px;background:linear-gradient(135deg,${c1},${c2});border-radius:0 0 46px 46px"></div>
      <div style="position:absolute;left:40px;top:100px;display:flex;align-items:center;gap:16px;font-family:Prompt;font-weight:800;font-size:40px;color:#fff">
        <svg width="34" height="34" viewBox="0 0 24 24"><path d="M15 5l-7 7 7 7" fill="none" stroke="#fff" stroke-width="3.2" stroke-linecap="round" stroke-linejoin="round"/></svg>${title}</div>`;
  const button = (label, c1 = '#EE7FAA', c2 = '#F7A8C8') => `<div class="ph-btn" style="height:96px;border-radius:48px;background:linear-gradient(90deg,${c1},${c2});display:grid;place-items:center;font-family:Prompt;font-weight:800;font-size:36px;color:#fff;box-shadow:0 12px 24px rgba(238,127,170,.35),inset 0 3px 0 rgba(255,255,255,.4)">${label}</div>`;
  // generic bank glyph (piggy coin) — not any real bank's mark
  const bankIcon = (s = 60, c = '#6F9FE0') => `<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="11" fill="${c}"/><path d="M5 10l7-4 7 4M6.5 10.5v6M10 10.5v6M14 10.5v6M17.5 10.5v6M5 17.5h14" stroke="#fff" stroke-width="1.8" stroke-linecap="round" fill="none"/></svg>`;
  window.PHONE = { device, statusBar, header, button, bankIcon, SW, SH };
})();
