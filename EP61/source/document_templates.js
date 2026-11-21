// NaiSibPro EP.61 — official-document paper components (Classic 2D).
// InternalMemoDocument  : แบบกระดาษบันทึกข้อความ (หนังสือภายใน) — small Garuda top-left + heading "บันทึกข้อความ"
// ExternalOfficialLetter: แบบกระดาษตราครุฑ (หนังสือภายนอก) — large Garuda centred at the top, formal letter layout
// Layouts are simplified reconstructions of the standard templates. All text is fictional sample text
// (agency "สำนักงานตัวอย่าง", code "ตย", person "นายตัวอย่าง ใจดี"); no real agency, name or signature.
// Both papers carry a Garuda: the lesson is the paper FORMAT, never "has / has no Garuda".
(function () {
  const { h } = window.NSP;
  let uid = 0;

  // Simplified, respectful line-art Garuda (stylised; drawn for illustration, one colour like a printed letterhead).
  // viewBox: x −50..50, y −52..52 (height ≈ 104 units).
  function garuda(height = 100, col = '#1F2740') {
    const id = 'gr' + (++uid);
    const half = `
      <path d="M0 -52 L3.2 -44 L2.4 -40 L5.6 -38 L3.4 -35 L0 -35.5Z"/>
      <path d="M4.6 -20 C10 -22 13 -28 14 -36 L17.5 -40 L19 -35 C18 -26 14 -18 7 -14Z"/>
      <path d="M6 -16 C14 -30 28 -42 47 -47 C46 -41 43 -37 40 -35 C45 -32 44 -27 39 -25 C43 -21 41 -16 36 -15 C38 -10 34 -7 30 -8 C29 -3 25 -1 21 -3 C18 1 13 1 9 -3Z"/>
      <path d="M12 -17 C20 -24 28 -29 38 -32 M11 -10 C19 -15 27 -19 34 -21 M10 -4 C16 -7 22 -9 28 -10" stroke="#fff" stroke-width="1.6" fill="none" stroke-linecap="round"/>
      <path d="M3 14 L8 26 L13 28 L9 30 L4 29 L1 20Z"/>
      <path d="M0 18 C4 26 9 36 12 44 C8 46 5 45 3 42 C3 46 2 50 0 52Z"/>`;
    return `<svg width="${height}" height="${height}" viewBox="-52 -54 104 108" style="display:block;overflow:visible">
      <g fill="${col}">
        <g id="${id}">${half}</g><use href="#${id}" transform="scale(-1 1)"/>
        <ellipse cx="0" cy="-28" rx="5.6" ry="6.6"/>
        <path d="M-2 -24 L0 -20 L2 -24Z" fill="#fff" opacity=".9"/>
        <ellipse cx="0" cy="-2" rx="8.5" ry="18"/>
        <path d="M-5 -10 L5 -10 M-5 -4 L5 -4 M-5 2 L5 2" stroke="#fff" stroke-width="1.3" opacity=".75"/>
      </g></svg>`;
  }

  const line = (w, c = '#D8E0EC', hgt = 9) => `<span style="display:inline-block;height:${hgt}px;width:${w}px;border-radius:5px;background:${c};vertical-align:middle"></span>`;
  const dots = w => `<span style="display:inline-block;width:${w}px;border-bottom:3px dotted #9AA7BD;margin:0 6px;transform:translateY(-6px)"></span>`;

  // Design size 600 × 848 (A4 ratio). Returns an element; .garuda and .heading are exposed for zooms / highlights.
  function InternalMemoDocument({ frame = true } = {}) {
    const el = h(`<div class="ns-doc memo" style="position:absolute;left:0;top:0;width:600px;height:848px;transform-origin:0 0">
      ${frame ? `<div style="position:absolute;inset:-26px;border-radius:40px;background:linear-gradient(160deg,#BFDDFB,#95BFEF);box-shadow:0 26px 50px rgba(47,107,255,.28),0 0 0 6px #fff"></div>` : ''}
      <div class="paper" style="position:absolute;inset:0;background:#fff;border-radius:10px;box-shadow:0 6px 0 #D8E6F7;overflow:hidden;font-family:Prompt;color:#1F2740">
        <div class="garuda" style="position:absolute;left:44px;top:34px;width:62px;height:62px">${garuda(62)}</div>
        <div class="heading" style="position:absolute;left:0;right:0;top:34px;text-align:center;font-weight:800;font-size:52px;line-height:62px;letter-spacing:1px">บันทึกข้อความ</div>
        <div style="position:absolute;left:44px;right:40px;top:116px;font-size:25px;line-height:50px;font-weight:500">
          <div><b style="font-size:29px">ส่วนราชการ</b> สำนักงานตัวอย่าง กองกลาง</div>
          <div><b style="font-size:29px">ที่</b> ตย ๐๐๑/๒๕๖๘ <b style="font-size:29px;margin-left:46px">วันที่</b> ๑ ธันวาคม ๒๕๖๘</div>
          <div><b style="font-size:29px">เรื่อง</b> ขอความอนุเคราะห์ข้อมูล</div>
        </div>
        <div style="position:absolute;left:40px;right:40px;top:280px;border-top:3px solid #1F2740"></div>
        <div style="position:absolute;left:44px;right:40px;top:298px;font-size:25px;line-height:46px;font-weight:500">
          <div>เรียน ผู้อำนวยการกองตัวอย่าง</div>
          <div style="padding-left:70px">${line(400)}</div><div>${line(500)}</div><div>${line(470)}</div><div>${line(380)}</div>
          <div style="padding-left:70px;margin-top:8px">${line(300)}</div>
        </div>
        <div style="position:absolute;left:300px;top:640px;width:260px;text-align:center;font-size:22px;line-height:36px;color:#3A4560">
          <svg width="150" height="40" viewBox="0 0 150 40"><path d="M6 30 C24 4 34 36 52 16 S80 30 94 12 S124 26 144 10" stroke="#5E6F99" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
          <div>(นายตัวอย่าง ใจดี)</div><div>ตำแหน่งตัวอย่าง</div></div>
      </div></div>`);
    el.garuda = el.querySelector('.garuda'); el.heading = el.querySelector('.heading');
    return el;
  }

  function ExternalOfficialLetter({ frame = true } = {}) {
    const el = h(`<div class="ns-doc letter" style="position:absolute;left:0;top:0;width:600px;height:848px;transform-origin:0 0">
      ${frame ? `<div style="position:absolute;inset:-26px;border-radius:40px;background:linear-gradient(160deg,#FFD0E2,#F7A8C4);box-shadow:0 26px 50px rgba(238,127,170,.32),0 0 0 6px #fff"></div>` : ''}
      <div class="paper" style="position:absolute;inset:0;background:#fff;border-radius:10px;box-shadow:0 6px 0 #F5DCE7;overflow:hidden;font-family:Prompt;color:#1F2740">
        <div class="garuda" style="position:absolute;left:245px;top:26px;width:110px;height:110px">${garuda(110)}</div>
        <div style="position:absolute;left:40px;top:118px;font-size:23px;font-weight:600">ที่ ตย ๐๐๐๑/๒๓๔</div>
        <div style="position:absolute;right:36px;top:112px;width:200px;font-size:20px;line-height:28px;font-weight:500">สำนักงานตัวอย่าง<br>ถนนตัวอย่าง<br>กรุงเทพฯ ๑๐๐๐๐</div>
        <div style="position:absolute;left:0;right:0;top:212px;text-align:center;font-size:22px;font-weight:500"><span style="margin-left:60px">ธันวาคม ๒๕๖๘</span></div>
        <div style="position:absolute;left:40px;right:36px;top:254px;font-size:22px;line-height:38px;font-weight:500">
          <div><b>เรื่อง</b> ขอความร่วมมือในการจัดส่งข้อมูล</div>
          <div><b>เรียน</b> อธิบดีกรมตัวอย่าง</div>
          <div><b>อ้างถึง</b> ${line(250)}</div>
          <div><b>สิ่งที่ส่งมาด้วย</b> ${line(200)}</div>
          <div style="padding-left:70px;margin-top:6px">${line(380)}</div><div>${line(500)}</div><div>${line(470)}</div>
          <div style="padding-left:70px">${line(300)}</div>
        </div>
        <div style="position:absolute;left:0;right:0;top:590px;text-align:center;font-size:22px;line-height:34px;font-weight:500;color:#3A4560">
          <div style="margin-left:80px">ขอแสดงความนับถือ</div>
          <svg width="150" height="40" viewBox="0 0 150 40" style="margin-left:80px"><path d="M6 30 C24 4 34 36 52 16 S80 30 94 12 S124 26 144 10" stroke="#5E6F99" stroke-width="3" fill="none" stroke-linecap="round"/></svg>
          <div style="margin-left:80px">(นายตัวอย่าง ใจดี)</div><div style="margin-left:80px">ตำแหน่งตัวอย่าง</div></div>
        <div style="position:absolute;left:40px;top:770px;font-size:18px;line-height:26px;font-weight:500;color:#3A4560">ส่วนราชการเจ้าของเรื่อง<br>โทร. ๐ ๒๐๐๐ ๐๐๐๐</div>
      </div></div>`);
    el.garuda = el.querySelector('.garuda'); el.heading = el.querySelector('.garuda');
    return el;
  }

  // a scaled holder so a document can be placed by its on-screen size: doc(kind, widthPx)
  function doc(kind, w = 300, opts) {
    const d = kind === 'memo' ? InternalMemoDocument(opts) : ExternalOfficialLetter(opts);
    const s = w / 600;
    const wrap = h(`<div class="abs c" style="left:0;top:0;width:${w}px;height:${848 * s}px"></div>`);
    d.style.transform = `scale(${s})`;
    wrap.appendChild(d); wrap.doc = d; wrap.k = s;
    return wrap;
  }

  window.DOCS = { garuda, InternalMemoDocument, ExternalOfficialLetter, doc };
})();
