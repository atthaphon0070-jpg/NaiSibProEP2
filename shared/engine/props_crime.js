// NaiSibPro cinematic crime kit (shared, EP15+).
// CRIME.actor(look): adult three-quarter-view SVG rig for readable action staging (walk/run cycles,
//   punch, push, stagger, guard), ground-locked feet, a numeric facial-expression system and
//   world rim lighting. Faces right; dir:-1 mirrors it. Looks: Nont, Tae (EP15 character bible).
// CRIME.street(root): one continuous night location — a generic (fictional, unbranded) convenience
//   store on the left, parked motorcycle, closed shophouse, soi entrance, streetlights, Thai utility
//   poles, the sidewalk continuing right (escape route), road reflections, distant traffic —
//   as parallax depth layers with a camera (cx, cy, zoom, roll, dof).
// All drawings are original.
(function () {
  const { h, clamp, lerp, E } = window.NSP;
  const R = Math.PI / 180;
  let uid = 0;
  const dirv = (a, L) => [Math.sin(a * R) * L, Math.cos(a * R) * L];   // angle from straight down, + toward facing
  const f1 = n => Math.round(n * 10) / 10;
  // tapered capsule between two circles
  function cap(x1, y1, r1, x2, y2, r2) {
    const dx = x2 - x1, dy = y2 - y1, d = Math.hypot(dx, dy) || 1e-3, nx = -dy / d, ny = dx / d;
    return `M${f1(x1 + nx * r1)} ${f1(y1 + ny * r1)}L${f1(x2 + nx * r2)} ${f1(y2 + ny * r2)}A${r2} ${r2} 0 0 0 ${f1(x2 - nx * r2)} ${f1(y2 - ny * r2)}L${f1(x1 - nx * r1)} ${f1(y1 - ny * r1)}A${r1} ${r1} 0 0 0 ${f1(x1 + nx * r1)} ${f1(y1 + ny * r1)}Z`;
  }

  // ------------------------------------------------------------------ character bible
  const LOOKS = {
    // NONT / นนท์ — ~25–30, slim-to-average, short natural black hair, warm medium skin,
    // light beige overshirt (sleeves rolled to the forearm) over a dark-grey tee, dark jeans, black sneakers
    Nont: { skin: '#C98F67', skinD: '#A56F4B', skinL: '#E0AA80', hair: '#151317', hairL: '#2C2830', over: '#D8C5A2', overD: '#B49D76', tee: '#43464E', pants: '#2C3A57', pantsD: '#1F2940', shoe: '#18181C', sole: '#E8E8EA', sleeve: 'rolled', style: 'natural', width: 1, height: 1, lip: '#9A5B48', brow: '#1B1719' },
    // TAE / เต้ — ~26–32, slightly broader, short black hair with neatly trimmed sides, medium skin,
    // dark rust-red / burgundy short-sleeve casual shirt, black pants, dark shoes
    Tae: { skin: '#B98360', skinD: '#966343', skinL: '#D29C76', hair: '#121013', hairL: '#3A3438', over: '#7B2531', overD: '#59192A', tee: null, pants: '#1F1F24', pantsD: '#141418', shoe: '#2B231F', sole: '#3B332E', sleeve: 'short', style: 'fade', width: 1.12, height: 1.03, lip: '#8A4F3E', brow: '#141114' },
  };

  // ------------------------------------------------------------------ expressions (numeric, blendable)
  // brow: inner-end angle (+ = angry/furrow, - = worried), browY lift, eye open, squint, look (x,y),
  // mouth: w width, c curve (+smile), o open, teeth (clench), jaw (clench line), cheek raise
  const EXPR = {
    relaxed: { brow: -2, browY: 0, eye: 1, squint: .1, w: 1, c: .35, o: 0, teeth: 0, jaw: 0 },
    neutral: { brow: 0, browY: 0, eye: 1, squint: 0, w: 1, c: 0, o: 0, teeth: 0, jaw: 0 },
    curious: { brow: -6, browY: 3, eye: 1.05, squint: 0, w: .9, c: .05, o: .05, teeth: 0, jaw: 0 },
    irritated: { brow: 14, browY: -2, eye: .9, squint: .35, w: 1, c: -.45, o: 0, teeth: 0, jaw: .4 },
    confront: { brow: 18, browY: -3, eye: 1, squint: .3, w: 1.15, c: -.35, o: .45, teeth: .3, jaw: 0 },
    aggressive: { brow: 24, browY: -4, eye: 1.05, squint: .25, w: 1.2, c: -.5, o: .3, teeth: .8, jaw: .6 },
    surprised: { brow: -14, browY: 7, eye: 1.32, squint: 0, w: .8, c: 0, o: .75, teeth: 0, jaw: 0 },
    pain: { brow: -10, browY: -2, eye: .25, squint: 1, w: 1.15, c: -.55, o: .35, teeth: .6, jaw: .3 },
    focused: { brow: 12, browY: -2, eye: .95, squint: .25, w: 1, c: -.2, o: .12, teeth: .4, jaw: .5 },
    relieved: { brow: -9, browY: 2, eye: .7, squint: .2, w: 1, c: .1, o: .25, teeth: 0, jaw: 0 },
    hurt: { brow: -12, browY: 1, eye: .85, squint: .35, w: .95, c: -.35, o: .08, teeth: 0, jaw: .1 },
    angry: { brow: 26, browY: -5, eye: .95, squint: .45, w: 1.05, c: -.55, o: 0, teeth: 0, jaw: 1 },
    impulsive: { brow: 30, browY: -6, eye: 1.08, squint: .3, w: 1.2, c: -.6, o: .35, teeth: 1, jaw: .8 },
    startled: { brow: -16, browY: 8, eye: 1.35, squint: 0, w: .9, c: -.1, o: .6, teeth: 0, jaw: 0 },
    fearful: { brow: -18, browY: 6, eye: 1.25, squint: 0, w: 1.05, c: -.4, o: .35, teeth: .4, jaw: 0 },
    stunned: { brow: -6, browY: 2, eye: .55, squint: .5, w: 1, c: -.3, o: .3, teeth: 0, jaw: 0 },
  };
  const mixExpr = (a, b, k) => { const A = typeof a === 'string' ? EXPR[a] : a, B = typeof b === 'string' ? EXPR[b] : b, o = {}; for (const key in A) o[key] = lerp(A[key], B[key], k); return o; };

  // ------------------------------------------------------------------ poses
  // angles in degrees from straight down, + toward the facing direction.
  // leg: [thigh, knee bend(+ = shin swings back)], arm: [upper, elbow bend(+ = forearm forward/up)]
  const BASE = { lean: 0, legN: [4, 4], legF: [-4, 4], armN: [6, 14], armF: [-4, 14], handN: 0, handF: 0, neck: 0, tilt: 0, drop: 0, bob: 0 };
  const POSES = {
    stand: { ...BASE },
    relaxed: { ...BASE, lean: -1, legN: [8, 3], legF: [-6, 3], armN: [4, 10], armF: [-2, 10], neck: 2 },
    guard: { ...BASE, lean: 4, legN: [16, 10], legF: [-14, 8], armN: [30, 120], armF: [20, 125], handN: 1, handF: 1, neck: 2, drop: 6 },
    point: { ...BASE, lean: 6, legN: [12, 4], legF: [-8, 4], armN: [78, 8], armF: [-4, 20], handN: .5, neck: 4 },
    chest: { ...BASE, lean: -5, legN: [10, 4], legF: [-10, 4], armN: [-14, 28], armF: [-16, 30], neck: -4 },        // chest out, arms back
    palms: { ...BASE, lean: -6, legN: [6, 4], legF: [-12, 6], armN: [40, 70], armF: [30, 75], neck: -4 },              // "calm down" palms up
    windup: { ...BASE, lean: -4, legN: [18, 8], legF: [-16, 8], armN: [-38, 130], armF: [34, 110], handN: 1, handF: 1, neck: 3 },
    punch: { ...BASE, lean: 14, legN: [24, 12], legF: [-22, 6], armN: [88, 2], armF: [18, 120], handN: 1, handF: 1, neck: 6, drop: 10 },
    recoilHead: { ...BASE, lean: -16, legN: [4, 6], legF: [-20, 10], armN: [22, 90], armF: [8, 60], neck: -22, tilt: -18 },
    push: { ...BASE, lean: 16, legN: [26, 16], legF: [-24, 6], armN: [84, 12], armF: [78, 18], neck: 4, drop: 14 },
    pushed: { ...BASE, lean: -22, legN: [-6, 12], legF: [-26, 14], armN: [52, 30], armF: [40, 30], neck: -14, tilt: -10, drop: 8 },
    stumble: { ...BASE, lean: -12, legN: [-12, 18], legF: [16, 10], armN: [64, 40], armF: [-30, 40], neck: -6, tilt: -6, drop: 10 },
    handsDown: { ...BASE, lean: -3, legN: [6, 4], legF: [-8, 4], armN: [14, 30], armF: [6, 30], neck: -2 },
    faceTouch: { ...BASE, lean: 2, legN: [6, 4], legF: [-6, 4], armN: [36, 150], armF: [-4, 18], handN: .3, neck: 8, tilt: 6 },
    fists: { ...BASE, lean: 5, legN: [10, 6], legF: [-10, 6], armN: [8, 40], armF: [-6, 40], handN: 1, handF: 1, neck: 4, drop: 4 },
    lookBack: { ...BASE, lean: 6, legN: [14, 10], legF: [-12, 12], armN: [-16, 50], armF: [24, 60], neck: -4 },
    hit: { ...BASE, lean: 24, legN: [10, 24], legF: [-30, 20], armN: [40, 60], armF: [30, 80], neck: 18, tilt: 16, drop: 24 },   // struck from behind, folding forward
    kneel: { ...BASE, lean: 26, legN: [70, 120], legF: [-10, 100], armN: [60, 100], armF: [40, 110], neck: 16, tilt: 10, drop: 0 },
    pant: { ...BASE, lean: 12, legN: [12, 14], legF: [-12, 14], armN: [10, 24], armF: [-4, 24], neck: 6, drop: 10 },
  };
  const lerpA = (a, b, k) => [lerp(a[0], b[0], k), lerp(a[1], b[1], k)];
  function mixPose(a, b, k) {
    const A = typeof a === 'string' ? POSES[a] : a, B = typeof b === 'string' ? POSES[b] : b, o = {};
    for (const key in BASE) o[key] = Array.isArray(BASE[key]) ? lerpA(A[key], B[key], k) : lerp(A[key], B[key], k);
    return o;
  }
  // locomotion cycles: phase in radians; amt 0..1 blends from the given base pose
  function cycle(kind, ph, base = POSES.stand, amt = 1) {
    const s = Math.sin(ph), c = Math.cos(ph), run = kind === 'run', jog = kind === 'jog';
    const T = run ? 38 : jog ? 30 : 22, K = run ? 70 : jog ? 55 : 32;
    const o = {
      lean: run ? 14 : jog ? 9 : 3, drop: run ? 12 : jog ? 8 : 2, neck: run ? -4 : 0, tilt: 0,
      legN: [T * s, 8 + K * Math.max(0, -c) * (s < 0 ? 1 : .35)], legF: [-T * s, 8 + K * Math.max(0, c) * (s > 0 ? 1 : .35)],
      armN: [-(run ? 42 : jog ? 32 : 16) * s, run ? 92 : jog ? 80 : 22], armF: [(run ? 42 : jog ? 32 : 16) * s, run ? 92 : jog ? 80 : 22],
      handN: run || jog ? .7 : 0, handF: run || jog ? .7 : 0,
      bob: -(run ? 16 : jog ? 10 : 4) * Math.abs(c),
    };
    return mixPose(base, o, amt);
  }

  // ------------------------------------------------------------------ actor
  function actor(kind) {
    const L = LOOKS[kind], id = 'ca' + (++uid), W = L.width, HS = L.height;
    const TH = 136 * HS, SH = 134 * HS, UA = 112 * HS, FA = 102 * HS, TORSO = 196 * HS, NECK = 24 * HS;
    const tw = W;     // torso width factor
    const el = h(`<div class="actor" style="position:absolute;left:0;top:0;width:0;height:0">
      <svg class="ash" width="300" height="60" viewBox="-150 -30 300 60" style="position:absolute;left:-150px;top:-30px;overflow:visible"><ellipse class="shd" cx="0" cy="0" rx="92" ry="15" fill="rgba(5,8,18,.55)" filter="url(#${id}b)"/><defs><filter id="${id}b" x="-50%" y="-200%" width="200%" height="500%"><feGaussianBlur stdDeviation="5"/></filter></defs></svg>
      <div class="lit" style="position:absolute;left:0;top:0">
      <svg width="760" height="820" viewBox="-380 -780 760 820" style="position:absolute;left:-380px;top:-780px;overflow:visible">
        <defs>
          <linearGradient id="${id}sk" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${L.skinD}"/><stop offset=".55" stop-color="${L.skin}"/><stop offset="1" stop-color="${L.skinL}"/></linearGradient>
          <linearGradient id="${id}ov" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${L.overD}"/><stop offset=".6" stop-color="${L.over}"/><stop offset="1" stop-color="${L.over}"/></linearGradient>
          <linearGradient id="${id}pa" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${L.pantsD}"/><stop offset=".6" stop-color="${L.pants}"/></linearGradient>
        </defs>
        <g class="flip">
          <g class="armF" opacity="1"><path class="uaF" fill="${L.overD}"/><path class="faF" fill="${L.sleeve === 'rolled' ? L.overD : L.skinD}"/><path class="wrF" fill="${L.skinD}"/><g class="hdF"><path class="hdFp" fill="${L.skinD}"/></g></g>
          <g class="legF"><path class="thF" fill="${L.pantsD}"/><path class="snF" fill="${L.pantsD}"/><path class="shoeF" fill="${L.shoe}" stroke="${L.sole}" stroke-width="5"/></g>
          <g class="legN"><path class="thN" fill="url(#${id}pa)"/><path class="snN" fill="url(#${id}pa)"/><path class="shoeN" fill="${L.shoe}" stroke="${L.sole}" stroke-width="5"/></g>
          <g class="torso">
            <path class="pelvis" fill="url(#${id}pa)"/>
            <path class="body" fill="url(#${id}ov)"/>
            ${L.tee ? `<path class="tee" fill="${L.tee}"/><path class="lapel" fill="none" stroke="${L.overD}" stroke-width="5" stroke-linecap="round"/>` : `<path class="collar" fill="${L.overD}"/><path class="placket" fill="none" stroke="${L.overD}" stroke-width="4"/><g class="btns" fill="#2A0E14"></g>`}
            <path class="hem" fill="none" stroke="${L.overD}" stroke-width="6" stroke-linecap="round" opacity=".7"/>
          </g>
          <path class="neck" fill="${L.skinD}"/>
          <g class="head">
            <path class="hairBack" fill="${L.hair}"/>
            <path class="skull" fill="url(#${id}sk)" d="${L.style === 'fade' ? 'M-40 -36 C-50 -80 -28 -110 6 -110 C42 -110 58 -86 55 -58 C54 -48 58 -42 55 -32 C52 -14 40 -2 22 0 C4 2 -16 -4 -28 -14 C-35 -22 -39 -28 -40 -36Z' : 'M-38 -38 C-48 -78 -28 -108 6 -108 C40 -108 56 -84 53 -58 C52 -48 56 -42 52 -34 C47 -16 34 -3 18 -1 C3 1 -14 -6 -24 -18 C-31 -25 -36 -31 -38 -38Z'}"/>
            <path d="M53 -64 Q64 -53 60 -46 Q56 -41 50 -42" fill="${L.skin}" stroke="${L.skinD}" stroke-width="2"/>
            ${L.style === 'fade' ? `<path d="M-6 -20 C4 -6 22 0 40 -12 C46 -18 50 -26 52 -34 C44 -22 30 -16 14 -18 C6 -18 0 -20 -6 -20Z" fill="${L.hair}" opacity=".16"/>` : ''}
            <ellipse cx="-14" cy="-55" rx="9" ry="13" fill="${L.skin}"/><path d="M-16 -62 Q-10 -56 -14 -48" stroke="${L.skinD}" stroke-width="3" fill="none"/>
            <ellipse class="cheek" cx="34" cy="-38" rx="11" ry="6" fill="#E07B6A" opacity=".18"/>
            <path class="jawline" d="M-6 -30 Q2 -24 8 -26" stroke="${L.skinD}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0"/>
            <g class="eN" transform="translate(16 -60)"><path class="ewN" fill="#F4F1EC"/><circle class="irN" r="6" fill="#2E1E16"/><circle class="glN" r="1.6" fill="#fff"/><path class="lidN" fill="none" stroke="#1A1416" stroke-width="3.4" stroke-linecap="round"/><path class="lowN" fill="none" stroke="${L.skinD}" stroke-width="2" stroke-linecap="round"/></g>
            <g class="eF" transform="translate(43 -61)"><path class="ewF" fill="#F4F1EC"/><circle class="irF" r="5" fill="#2E1E16"/><circle class="glF" r="1.3" fill="#fff"/><path class="lidF" fill="none" stroke="#1A1416" stroke-width="3" stroke-linecap="round"/></g>
            <path class="brN" fill="none" stroke="${L.brow}" stroke-width="${L.style === 'fade' ? 7.5 : 5.5}" stroke-linecap="round"/>
            <path class="brF" fill="none" stroke="${L.brow}" stroke-width="${L.style === 'fade' ? 6.5 : 4.5}" stroke-linecap="round"/>
            <path class="mouth" fill="#4A1E1C" stroke="${L.lip}" stroke-width="3" stroke-linejoin="round"/>
            <path class="teeth" fill="#F2EEE6"/>
            <path class="hair" fill="${L.hair}"/>
            <path class="hairSide" fill="${L.hairL}" opacity="${L.style === 'fade' ? .5 : 0}"/>
            <path class="hairShine" fill="none" stroke="rgba(255,255,255,.14)" stroke-width="5" stroke-linecap="round"/>
          </g>
          <g class="armN"><path class="uaN" fill="url(#${id}ov)"/><path class="faN" fill="${L.sleeve === 'rolled' ? L.over : L.skin}"/><path class="cuffN" fill="${L.overD}"/><path class="wrN" fill="${L.skin}"/><g class="hdN"><path class="hdNp" fill="${L.skin}"/></g></g>
        </g>
      </svg></div></div>`);
    const q = s => el.querySelector(s);
    const N = {};
    ['flip', 'lit', 'ash', 'uaF', 'faF', 'wrF', 'hdF', 'hdFp', 'thF', 'snF', 'shoeF', 'thN', 'snN', 'shoeN', 'pelvis', 'body', 'tee', 'lapel', 'collar', 'placket', 'btns', 'hem', 'neck', 'head', 'hairBack', 'hair', 'hairSide', 'hairShine',
      'cheek', 'jawline', 'ewN', 'irN', 'glN', 'lidN', 'lowN', 'ewF', 'irF', 'glF', 'lidF', 'brN', 'brF', 'mouth', 'teeth', 'uaN', 'faN', 'cuffN', 'wrN', 'hdN', 'hdNp', 'shd'].forEach(k => N[k] = q('.' + k));
    // hair shapes (fixed per look)
    if (L.style === 'natural') {
      N.hair.setAttribute('d', 'M-40 -44 C-52 -80 -36 -114 4 -116 C30 -118 52 -104 56 -82 C58 -74 56 -70 54 -66 C50 -78 42 -84 30 -84 C34 -90 30 -92 24 -88 C14 -82 4 -84 -4 -80 C-10 -78 -14 -72 -18 -66 C-22 -60 -24 -52 -26 -44 C-30 -38 -36 -36 -40 -44Z');
      N.hairBack.setAttribute('d', 'M-40 -40 C-46 -60 -44 -84 -30 -98 L-24 -46Z');
      N.hairShine.setAttribute('d', 'M-14 -104 Q12 -112 34 -102');
    } else {
      N.hair.setAttribute('d', 'M-34 -70 C-40 -98 -22 -116 8 -118 C34 -120 54 -106 56 -84 C56 -78 55 -74 53 -70 C48 -80 40 -86 28 -86 C20 -88 10 -86 0 -86 C-14 -86 -24 -80 -34 -70Z');
      N.hairSide.setAttribute('d', 'M-37 -70 C-30 -80 -16 -86 -4 -86 C-12 -80 -18 -72 -22 -64 C-26 -58 -30 -54 -36 -56 C-40 -60 -40 -66 -37 -70Z');
      N.hairBack.setAttribute('d', 'M-38 -46 C-44 -60 -42 -72 -34 -76 L-26 -48Z');
      N.hairShine.setAttribute('d', 'M-6 -110 Q16 -116 38 -106');
    }
    // light: rim colours from the left/right in screen space (applied to the un-mirrored wrapper)
    el.light = (left = [255, 186, 112, .55], right = [96, 200, 255, .35], dark = 1) => {
      N.lit.style.filter = `drop-shadow(-4px -1px 0 rgba(${left.join(',')})) drop-shadow(4px 0 0 rgba(${right.join(',')})) brightness(${dark})`;
    };
    el.light();
    let last = null;
    el.pose = (p) => {
      const pz = { ...BASE, ...p }, dir = p.dir || 1;
      const ex = typeof p.expr === 'object' ? p.expr : EXPR[p.expr || 'neutral'];
      // ---- legs (FK), feet locked to the ground (y = 0) unless airborne
      const foot = (leg) => { const k = dirv(leg[0], TH), a = dirv(leg[0] - leg[1], SH); return { kx: k[0], ky: k[1], ax: k[0] + a[0], ay: k[1] + a[1] }; };
      const fN = foot(pz.legN), fF = foot(pz.legF);
      const ground = Math.max(fN.ay, fF.ay) + 22;
      const hip = [0, -ground + (pz.bob || 0)];
      const ihx = 0, ihy = hip[1];
      const leg = (f, thP, snP, shoeP, rT, near) => {
        const kx = ihx + f.kx, ky = ihy + f.ky, ax = ihx + f.ax, ay = ihy + f.ay;
        thP.setAttribute('d', cap(ihx + (near ? 8 : -6), ihy, 27 * W, kx, ky, 20 * W));
        snP.setAttribute('d', cap(kx, ky, 20 * W, ax, ay, 15 * W));
        // shoe: sole flat when grounded, pointing forward
        const lift = clamp((ground - 22 - (f.ay)) / 40);
        const toe = -lift * 18;
        shoeP.setAttribute('d', `M${f1(ax - 18)} ${f1(ay - 12)} Q${f1(ax - 22)} ${f1(ay + 14)} ${f1(ax - 8)} ${f1(ay + 18)} L${f1(ax + 46)} ${f1(ay + 18 + toe * .3)} Q${f1(ax + 62)} ${f1(ay + 14 + toe * .3)} ${f1(ax + 54)} ${f1(ay + 2 + toe * .2)} Q${f1(ax + 36)} ${f1(ay - 6)} ${f1(ax + 14)} ${f1(ay - 14)}Z`);
      };
      leg(fF, N.thF, N.snF, N.shoeF, 0, false); leg(fN, N.thN, N.snN, N.shoeN, 0, true);
      // ---- torso (rotated by lean about the hip)
      const ln = pz.lean * R, rot = (x, y) => [ihx + x * Math.cos(ln) - y * Math.sin(ln), ihy + x * Math.sin(ln) + y * Math.cos(ln)];
      const pt = (x, y) => { const r = rot(x, y); return `${f1(r[0])} ${f1(r[1])}`; };
      const tw2 = tw;
      N.pelvis.setAttribute('d', `M${pt(-40 * tw2, 10)} C${pt(-44 * tw2, -10)} ${pt(-40 * tw2, -30)} ${pt(-34 * tw2, -36)} L${pt(38 * tw2, -36)} C${pt(44 * tw2, -24)} ${pt(44 * tw2, 0)} ${pt(38 * tw2, 14)} Q${pt(0, 26)} ${pt(-40 * tw2, 10)}Z`);
      const T0 = -TORSO;
      N.body.setAttribute('d', `M${pt(-46 * tw2, -4)} C${pt(-52 * tw2, -60)} ${pt(-62 * tw2, -130)} ${pt(-58 * tw2, T0 + 30)} Q${pt(-56 * tw2, T0 + 2)} ${pt(-26 * tw2, T0 - 6)} L${pt(22 * tw2, T0 - 6)} Q${pt(52 * tw2, T0 - 2)} ${pt(60 * tw2, T0 + 40)} C${pt(66 * tw2, -120)} ${pt(54 * tw2, -70)} ${pt(50 * tw2, -2)} Q${pt(4, 12)} ${pt(-46 * tw2, -4)}Z`);
      N.hem.setAttribute('d', `M${pt(-42 * tw2, -6)} Q${pt(4, 12)} ${pt(46 * tw2, 0)}`);
      if (L.tee) {
        N.tee.setAttribute('d', `M${pt(18 * tw2, T0 - 4)} Q${pt(44 * tw2, T0)} ${pt(56 * tw2, T0 + 36)} C${pt(62 * tw2, -120)} ${pt(52 * tw2, -70)} ${pt(48 * tw2, -6)} L${pt(28 * tw2, -6)} C${pt(34 * tw2, -70)} ${pt(38 * tw2, -120)} ${pt(18 * tw2, T0 - 4)}Z`);
        N.lapel.setAttribute('d', `M${pt(16 * tw2, T0 - 4)} C${pt(38 * tw2, -120)} ${pt(34 * tw2, -70)} ${pt(28 * tw2, -8)}`);
      } else {
        N.collar.setAttribute('d', `M${pt(-12 * tw2, T0 - 6)} L${pt(26 * tw2, T0 - 6)} L${pt(40 * tw2, T0 + 18)} L${pt(22 * tw2, T0 + 8)} L${pt(8 * tw2, T0 + 20)}Z`);
        N.placket.setAttribute('d', `M${pt(34 * tw2, T0 + 14)} C${pt(44 * tw2, -120)} ${pt(42 * tw2, -60)} ${pt(38 * tw2, -6)}`);
        N.btns.innerHTML = [-150, -105, -60].map(y => { const r = rot(40 * tw2, y * HS); return `<circle cx="${f1(r[0])}" cy="${f1(r[1])}" r="3.4"/>`; }).join('');
      }
      // ---- neck and head
      const nb = rot(8, T0 + 4), nk = pz.neck * R + ln;
      const ht = [nb[0] + Math.sin(nk) * NECK, nb[1] - Math.cos(nk) * NECK];
      N.neck.setAttribute('d', cap(nb[0], nb[1] + 10, 18 * W, ht[0] + 2, ht[1] - 18, 15 * W));
      N.head.setAttribute('transform', `translate(${f1(ht[0])} ${f1(ht[1] + 10)}) rotate(${f1(pz.neck + pz.lean * .3 + pz.tilt)}) scale(1.14)`);
      // ---- arms (shoulders on the torso), elbow bends forward
      const arm = (a, sx, sy, uaP, faP, wrP, hdG, hdP, near, hand, cuffP) => {
        const s = rot(sx, sy);
        const ua = a[0] + pz.lean * .25, fa = ua + a[1];
        const e = dirv(ua, UA), w = dirv(fa, FA);
        const ex2 = s[0] + e[0], ey = s[1] + e[1], wx = ex2 + w[0], wy = ey + w[1];
        uaP.setAttribute('d', cap(s[0], s[1], 25 * W, ex2, ey, 18 * W) + `M${f1(s[0] - 28 * W)} ${f1(s[1] + 4)}a${f1(28 * W)} ${f1(28 * W)} 0 1 0 ${f1(56 * W)} 0a${f1(28 * W)} ${f1(28 * W)} 0 1 0 ${f1(-56 * W)} 0Z`);
        if (L.sleeve === 'rolled') {           // overshirt sleeve rolled to mid-forearm, bare wrist
          const mx = ex2 + w[0] * .55, my = ey + w[1] * .55;
          faP.setAttribute('d', cap(ex2, ey, 17 * W, mx, my, 16 * W));
          wrP.setAttribute('d', cap(mx, my, 12.5, wx, wy, 11.5));
          if (cuffP) cuffP.setAttribute('d', cap(mx - w[0] * .06, my - w[1] * .06, 17.5 * W, mx + w[0] * .04, my + w[1] * .04, 17 * W));
        } else {                                // short sleeve covers 70% of the upper arm, forearm bare
          const mx = s[0] + e[0] * .62, my = s[1] + e[1] * .62;
          uaP.setAttribute('d', cap(s[0], s[1], 26 * W, mx, my, 21 * W) + `M${f1(s[0] - 29 * W)} ${f1(s[1] + 4)}a${f1(29 * W)} ${f1(29 * W)} 0 1 0 ${f1(58 * W)} 0a${f1(29 * W)} ${f1(29 * W)} 0 1 0 ${f1(-58 * W)} 0Z`);
          faP.setAttribute('d', cap(mx, my, 15 * W, ex2, ey, 14 * W) + cap(ex2, ey, 14 * W, wx, wy, 12));
          wrP.setAttribute('d', '');
          if (cuffP) cuffP.setAttribute('d', '');
        }
        // hand: 0 = open relaxed hand, 1 = fist (blend picks the shape)
        const fist = hand > .5;
        hdP.setAttribute('d', fist ? 'M-15 -6 Q-17 18 0 22 Q18 22 18 6 Q19 -10 4 -12 Q-12 -14 -15 -6Z M10 -8 Q22 -6 18 6' : 'M-12 -4 Q-14 24 -4 34 Q6 40 12 30 Q16 14 12 -4 Q0 -10 -12 -4Z M10 2 Q22 8 18 18');
        hdG.setAttribute('transform', `translate(${f1(wx)} ${f1(wy)}) rotate(${f1(-fa)}) scale(1.25)`);
        return { sx: s[0], sy: s[1], ex: ex2, ey, wx, wy };
      };
      const aF = arm(pz.armF, -10 * tw2, T0 + 20, N.uaF, N.faF, N.wrF, N.hdF, N.hdFp, false, pz.handF, null);
      const aN = arm(pz.armN, 6 * tw2, T0 + 22, N.uaN, N.faN, N.wrN, N.hdN, N.hdNp, true, pz.handN, N.cuffN);
      // ---- face
      const eo = clamp(ex.eye * (1 - (p.blink || 0)), .04, 1.5), sq = ex.squint;
      const lookX = p.lookX || 0, lookY = p.lookY || 0;
      const eye = (ewP, irP, glP, lidP, lowP, rx, ry, k) => {
        const top = -ry * eo * (1 - sq * .45), bot = ry * (.85 - sq * .35);
        ewP.setAttribute('d', `M${-rx} 0 Q${-rx * .2} ${f1(top * 1.25)} ${rx} ${f1(top * .4)} Q${rx * .3} ${f1(bot * 1.1)} ${-rx} 0Z`);
        const ix = clamp(lookX, -1, 1) * rx * .45, iy = clamp(lookY, -1, 1) * ry * .3;
        irP.setAttribute('cx', f1(ix + rx * .1 * k)); irP.setAttribute('cy', f1(iy + top * .05));
        irP.style.display = eo < .2 ? 'none' : ''; glP.style.display = eo < .2 ? 'none' : '';
        glP.setAttribute('cx', f1(ix + rx * .1 * k + 1.8)); glP.setAttribute('cy', f1(iy + top * .05 - 2));
        lidP.setAttribute('d', `M${-rx - 2} 1 Q${-rx * .2} ${f1(top * 1.3 - 1)} ${rx + 2} ${f1(top * .4 - 1)}`);
        if (lowP) lowP.setAttribute('d', `M${-rx * .7} ${f1(bot + 3)} Q0 ${f1(bot + 5 + sq * 2)} ${rx * .7} ${f1(bot + 2)}`);
      };
      eye(N.ewN, N.irN, N.glN, N.lidN, N.lowN, 11.5, 9, 1); eye(N.ewF, N.irF, N.glF, N.lidF, null, 8, 8.5, 1.4);
      // brows: inner end toward the nose (+x); + brow angle pulls the inner end down (anger)
      const by = -76 - ex.browY, ba = ex.brow;
      N.brN.setAttribute('d', `M2 ${f1(by + 2 - ba * .1)} Q14 ${f1(by - 5 - ba * .05)} 27 ${f1(by + ba * .35)}`);
      N.brF.setAttribute('d', `M36 ${f1(by + ba * .3)} Q44 ${f1(by - 4)} 52 ${f1(by + 1 - ba * .08)}`);
      // mouth: corners (near side wider in 3/4), curve and opening
      const mx = 33, my = -25, wl = 15 * ex.w, wr = 9 * ex.w, cv = ex.c * 7, op = Math.max(ex.o * 20, ex.teeth * 7);
      const lx = mx - wl, rx2 = mx + wr, cy = my - cv;
      N.mouth.setAttribute('d', `M${f1(lx)} ${f1(cy)} Q${f1(mx)} ${f1(my + cv * .6 - op * .25)} ${f1(rx2)} ${f1(cy + 1)} Q${f1(mx)} ${f1(my + cv * .6 + op)} ${f1(lx)} ${f1(cy)}Z`);
      N.mouth.setAttribute('fill', op > 1.5 ? '#4A1E1C' : 'none');
      const tth = ex.teeth * clamp(op / 4 + .3);
      const ub = my + cv * .6 - op * .25, tb = Math.min(op * .75, 4 + 4 * tth);   // upper teeth hang from the upper lip
      N.teeth.setAttribute('d', tth > .05 ? `M${f1(lx + 4)} ${f1(cy + .5)} Q${f1(mx)} ${f1(ub + 1)} ${f1(rx2 - 2)} ${f1(cy + 1.5)} L${f1(rx2 - 3)} ${f1(cy + 1.5 + tb * .6)} Q${f1(mx)} ${f1(ub + 1 + tb * 1.25)} ${f1(lx + 5)} ${f1(cy + .5 + tb * .6)}Z` : '');
      N.jawline.setAttribute('opacity', f1(ex.jaw * .7));
      N.cheek.setAttribute('opacity', f1(.12 + Math.max(0, ex.c) * .25));
      // ---- placement
      N.flip.setAttribute("transform", `scale(${f1((dir < 0 ? -1 : 1) * Math.max(.18, Math.abs(dir)) * 100) / 100} 1)`);
      el.style.transform = `translate(${f1(p.x || 0)}px,${f1(p.y || 0)}px) scale(${p.scale || 1})`;
      N.shd.setAttribute('rx', f1(92 + Math.abs(fN.ax - fF.ax) * .25)); N.shd.setAttribute('cx', f1(((fN.ax + fF.ax) / 2 + 18) * dir));
      N.shd.setAttribute('opacity', f1(clamp(1 + (pz.bob || 0) / 60)));
      last = { dir, hip, aN, aF, ht, lean: pz.lean };
    };
    // world-space (actor-local, mirrored) points from the last pose
    el.pts = () => {
      const d = last.dir, m = (x, y) => ({ x: x * d, y });
      return { fistN: m(last.aN.wx, last.aN.wy), fistF: m(last.aF.wx, last.aF.wy), head: m(last.ht[0] + 10, last.ht[1] - 52), chest: m(10, last.hip[1] - TORSO * .7) };
    };
    el.pose({ x: 0, y: 0 });
    return el;
  }

  // ------------------------------------------------------------------ night street (one continuous location)
  // World: 4600 × 1920. Facade base y 1330; actors stand on the sidewalk around y 1505; curb y 1640; road below.
  const WORLD = { w: 4600, h: 1920, ground: 1505, store: [220, 1480], door: [640, 880], soi: [2480, 2860], lamps: [1270, 2700, 4080], poles: [1600, 3330], moto: 1760 };
  function street(root) {
    const layer = (cls, p, html, extra = '') => { const el = h(`<div class="lyr ${cls}" style="position:absolute;left:0;top:0;width:${WORLD.w}px;height:${WORLD.h}px;transform-origin:0 0;${extra}">${html}</div>`); el.p = p; root.appendChild(el); return el; };
    // ---- sky + far skyline
    const sky = layer('sky', .12, `<div style="position:absolute;left:-1200px;top:-1600px;width:7000px;height:4000px;background:linear-gradient(180deg,#060B1C 0%,#0B1734 38%,#173055 60%,#2F4466 72%,#6A5A5E 82%,#2B3550 100%)"></div>
      <div style="position:absolute;left:600px;top:700px;width:3600px;height:700px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,170,100,.32),rgba(255,170,100,0) 70%)"></div>
      ${[...Array(40)].map((_, i) => `<div style="position:absolute;left:${(i * 389) % 4600}px;top:${40 + (i * 157) % 520}px;width:3px;height:3px;border-radius:50%;background:#fff;opacity:${.25 + (i % 5) * .1}"></div>`).join('')}`);
    const blds = [...Array(26)].map((_, i) => { const w = 160 + (i * 67) % 150, hh = 380 + (i * 131) % 420, x = i * 180 - 60;
      const wins = [...Array(Math.floor(hh / 60))].map((_, r) => [...Array(Math.floor(w / 46))].map((_, c) => ((i * 7 + r * 3 + c * 5) % 9 < 3) ? `<div style="position:absolute;left:${14 + c * 46}px;top:${30 + r * 60}px;width:20px;height:26px;background:${(r + c + i) % 4 ? '#FFC879' : '#BFE6FF'};opacity:.55"></div>` : '').join('')).join('');
      return `<div style="position:absolute;left:${x}px;top:${1180 - hh}px;width:${w}px;height:${hh + 200}px;background:linear-gradient(180deg,#18223B,#101828);border-top:3px solid #24314F">${wins}</div>`; }).join('');
    const far = layer('far', .35, `<div class="farin" style="position:absolute;inset:0;filter:blur(2px)">${blds}
      <div style="position:absolute;left:0;top:1060px;width:4600px;height:400px;background:linear-gradient(180deg,rgba(60,70,100,0),rgba(110,100,120,.55))"></div></div>`);
    // ---- facade layer: store, shophouse, soi, wall, poles, lamps
    const S0 = WORLD.store[0], S1 = WORLD.store[1], D0 = WORLD.door[0], D1 = WORLD.door[1];
    const shelves = [...Array(5)].map((_, r) => `<div style="position:absolute;left:${(S0 + 90)}px;top:${930 + r * 76}px;width:${S1 - S0 - 180}px;height:12px;background:#C9D3D8"></div>` +
      [...Array(Math.floor((S1 - S0 - 180) / 34))].map((_, c) => { const pal = ['#E38B7D', '#F1C76C', '#7FC4A8', '#8DB5E8', '#E6A0C4', '#F2F0E6', '#9AD0D8']; const k = (r * 5 + c * 3) % 7; return `<div style="position:absolute;left:${S0 + 94 + c * 34}px;top:${930 + r * 76 - 44 + (c * 7 % 3) * 4}px;width:26px;height:${40 - (c * 7 % 3) * 4}px;border-radius:4px 4px 2px 2px;background:${pal[k]};opacity:.9"></div>`; }).join('')).join('');
    const store = `
      <!-- upper floors of the shophouse (3–4 storeys) -->
      <div style="position:absolute;left:${S0 - 30}px;top:-620px;width:${S1 - S0 + 60}px;height:760px;background:linear-gradient(180deg,#1E2638,#262F42);border-top:12px solid #343E55"></div>
      ${[0, 1].map(r => [0, 1, 2].map(i => `<div style="position:absolute;left:${S0 + 60 + i * 420}px;top:${-520 + r * 330}px;width:320px;height:220px;background:${(r + i) % 3 === 1 ? 'linear-gradient(180deg,#9FC6E8,#5E86B0)' : '#141A28'};border:10px solid #3A4459;opacity:${(r + i) % 3 === 1 ? .55 : 1}"></div><div style="position:absolute;left:${S0 + 50 + i * 420}px;top:${-290 + r * 330}px;width:340px;height:14px;background:#3A4459"></div>`).join('')).join('')}
      <div style="position:absolute;left:${S0 - 30}px;top:120px;width:${S1 - S0 + 60}px;height:450px;background:linear-gradient(180deg,#2A3346,#232B3C);border-top:10px solid #39435A"></div>
      ${[0, 1, 2].map(i => `<div style="position:absolute;left:${S0 + 60 + i * 420}px;top:200px;width:320px;height:230px;background:${i === 1 ? 'linear-gradient(180deg,#F6C98A,#D9935A)' : '#161C2A'};border:10px solid #3E485E;opacity:${i === 1 ? .8 : 1}"></div>
        <div style="position:absolute;left:${S0 + 50 + i * 420}px;top:440px;width:340px;height:16px;background:#3E485E"></div>`).join('')}
      <div style="position:absolute;left:${S0 + 960}px;top:330px;width:150px;height:86px;border-radius:8px;background:#C8CDD6"><div style="position:absolute;left:12px;top:14px;width:70px;height:58px;border-radius:50%;border:5px solid #9AA3B2"></div></div>
      <!-- sign band: fictional generic store sign (no real brand) -->
      <div style="position:absolute;left:${S0 - 40}px;top:560px;width:${S1 - S0 + 80}px;height:150px;background:linear-gradient(180deg,#14284A,#0E1D38);box-shadow:0 0 60px rgba(255,190,110,.35),inset 0 -6px 0 #F2B65E;border-radius:6px"></div>
      <div style="position:absolute;left:${S0}px;top:585px;width:${S1 - S0}px;height:100px;display:flex;align-items:center;justify-content:center;gap:28px;font-family:Prompt;font-weight:700;color:#FFE3B0;text-shadow:0 0 18px rgba(255,190,110,.9)">
        <svg width="74" height="74" viewBox="0 0 74 74"><circle cx="37" cy="37" r="33" fill="none" stroke="#FFD48A" stroke-width="5"/><path d="M46 18 A20 20 0 1 0 50 52 A15 15 0 1 1 46 18Z" fill="#FFD48A"/></svg>
        <span style="font-size:72px;letter-spacing:2px">ร้านสะดวกซื้อ</span><span style="font-size:56px;padding:2px 18px;border-radius:14px;background:#F2B65E;color:#14284A;text-shadow:none">24 ชม.</span></div>
      <!-- glass front -->
      <div style="position:absolute;left:${S0}px;top:710px;width:${S1 - S0}px;height:620px;background:linear-gradient(180deg,#F4FBFA 0%,#E2F0F0 55%,#CFE2E4 100%)"></div>
      ${[...Array(6)].map((_, i) => `<div style="position:absolute;left:${S0 + 40 + i * 210}px;top:740px;width:150px;height:14px;border-radius:7px;background:#fff;box-shadow:0 0 30px #fff,0 0 60px rgba(220,255,255,.9)"></div>`).join('')}
      ${shelves}
      <div style="position:absolute;left:${S1 - 260}px;top:800px;width:200px;height:520px;background:linear-gradient(180deg,#DFF6FF,#A9DDF2);border:8px solid #9FB3BE;box-shadow:0 0 50px rgba(160,230,255,.8)"></div>
      <div style="position:absolute;left:${S0}px;top:710px;width:${S1 - S0}px;height:620px;background:linear-gradient(115deg,rgba(255,255,255,0) 30%,rgba(255,255,255,.22) 38%,rgba(255,255,255,0) 46%,rgba(255,255,255,0) 66%,rgba(255,255,255,.14) 72%,rgba(255,255,255,0) 78%)"></div>
      ${[S0, D0 - 12, D1, (D0 + S0) / 2, (D1 + S1) / 2, S1 - 14, (D0 + D1) / 2 - 3].map(x => `<div style="position:absolute;left:${x}px;top:710px;width:14px;height:620px;background:#2C3442"></div>`).join('')}
      <div style="position:absolute;left:${S0}px;top:704px;width:${S1 - S0}px;height:14px;background:#2C3442"></div>
      <div style="position:absolute;left:${D0}px;top:740px;width:${D1 - D0}px;height:26px;background:#2C3442;display:grid;place-items:center"><div style="width:120px;height:8px;border-radius:4px;background:#86F0B0;box-shadow:0 0 10px #86F0B0"></div></div>
      <div style="position:absolute;left:${D0 + 30}px;top:980px;width:12px;height:180px;border-radius:6px;background:#9AA6B4"></div><div style="position:absolute;left:${D1 - 42}px;top:980px;width:12px;height:180px;border-radius:6px;background:#9AA6B4"></div>
      <div style="position:absolute;left:${S0 - 30}px;top:1318px;width:${S1 - S0 + 60}px;height:16px;background:#3A4252"></div>`;
    const shop = `<div style="position:absolute;left:${S1 + 30}px;top:-420px;width:${WORLD.soi[0] - S1 - 50}px;height:1752px;background:linear-gradient(180deg,#252C3D,#1C2231)"></div>
      ${[0, 1, 2].map(r => [0, 1].map(i => `<div style="position:absolute;left:${S1 + 110 + i * 470}px;top:${-330 + r * 280}px;width:330px;height:200px;background:${(r * 2 + i) % 4 === 1 ? 'linear-gradient(180deg,#F3C489,#C98650)' : '#121827'};opacity:${(r * 2 + i) % 4 === 1 ? .7 : 1};border:10px solid #3A4459"></div>`).join('')).join('')}
      <div style="position:absolute;left:${S1 + 70}px;top:640px;width:${WORLD.soi[0] - S1 - 130}px;height:690px;background:repeating-linear-gradient(180deg,#5A6372 0 16px,#4B5361 16px 20px);border-top:26px solid #39404D"></div>
      <div style="position:absolute;left:${S1 + 70}px;top:1100px;width:${WORLD.soi[0] - S1 - 130}px;height:230px;background:linear-gradient(180deg,rgba(255,180,110,0),rgba(255,180,110,.18))"></div>`;
    const [A0, A1] = WORLD.soi;
    const soi = `<div style="position:absolute;left:${A0 - 40}px;top:-200px;width:${A1 - A0 + 80}px;height:500px;background:#0C1220"></div><div style="position:absolute;left:${A0}px;top:300px;width:${A1 - A0}px;height:1032px;background:linear-gradient(180deg,#0B1222,#141B2C 60%,#1E2433)"></div>
      <div style="position:absolute;left:${A0}px;top:300px;width:${A1 - A0}px;height:1032px;clip-path:polygon(0 0,38% 46%,62% 46%,100% 0,100% 100%,0 100%);background:linear-gradient(180deg,#141A2A,#2A2F3C)"></div>
      <div style="position:absolute;left:${A0 + (A1 - A0) * .38}px;top:${300 + 1032 * .3}px;width:${(A1 - A0) * .24}px;height:${1032 * .16}px;background:radial-gradient(ellipse at 50% 40%,rgba(255,200,130,.8),rgba(255,200,130,0) 70%)"></div>
      <div style="position:absolute;left:${A0 - 40}px;top:300px;width:40px;height:1032px;background:#2E3546"></div><div style="position:absolute;left:${A1}px;top:300px;width:40px;height:1032px;background:#2E3546"></div>
      <div style="position:absolute;left:${A0 - 150}px;top:760px;width:14px;height:572px;background:#8A94A6"></div>
      <div style="position:absolute;left:${A0 - 250}px;top:730px;width:210px;height:76px;border-radius:10px;background:#1F5FAE;border:5px solid #fff;display:grid;place-items:center;font-family:Prompt;font-weight:700;font-size:44px;color:#fff">ซอย 9</div>`;
    const wall = `<div style="position:absolute;left:${A1 + 40}px;top:980px;width:${WORLD.w - A1}px;height:352px;background:linear-gradient(180deg,#3D4556,#2D3443);border-top:18px solid #4C5568"></div>
      ${[...Array(9)].map((_, i) => `<div style="position:absolute;left:${A1 + 80 + i * 200}px;top:${700 + (i % 3) * 30}px;width:${260 + (i % 2) * 60}px;height:${300 - (i % 3) * 30}px;border-radius:50%;background:radial-gradient(circle at 40% 35%,#2F5A4C,#173329 70%)"></div>`).join('')}
      ${[...Array(9)].map((_, i) => `<div style="position:absolute;left:${A1 + 60 + i * 200}px;top:998px;width:12px;height:334px;background:#2A303D"></div>`).join('')}`;
    const lamp = x => `<div style="position:absolute;left:${x - 9}px;top:330px;width:18px;height:1004px;background:linear-gradient(90deg,#4A5366,#2B3140)"></div>
      <div style="position:absolute;left:${x - 9}px;top:330px;width:160px;height:14px;border-radius:7px;background:#3E475A"></div>
      <div style="position:absolute;left:${x + 112}px;top:332px;width:70px;height:26px;border-radius:0 0 30px 30px;background:#FFE2A8;box-shadow:0 0 40px #FFC56E,0 0 120px rgba(255,190,100,.8)"></div>
      <div class="beam" style="position:absolute;left:${x - 210}px;top:350px;width:700px;height:1000px;background:linear-gradient(180deg,rgba(255,206,130,.32),rgba(255,206,130,0) 85%);clip-path:polygon(44% 0,56% 0,100% 100%,0 100%)"></div>`;
    const pole = x => `<div style="position:absolute;left:${x - 14}px;top:180px;width:28px;height:1152px;background:linear-gradient(90deg,#6A7180,#454B57)"></div>
      <div style="position:absolute;left:${x - 70}px;top:240px;width:140px;height:12px;background:#4A505C"></div><div style="position:absolute;left:${x - 50}px;top:300px;width:100px;height:10px;background:#4A505C"></div>
      <div style="position:absolute;left:${x - 30}px;top:420px;width:60px;height:90px;border-radius:8px;background:#5C6370"></div>`;
    const wires = `<svg width="${WORLD.w}" height="600" style="position:absolute;left:0;top:200px;overflow:visible">${[0, 1, 2, 3, 4].map(i => { const y = 50 + i * 26, xs = [-200, WORLD.poles[0], WORLD.poles[1], WORLD.w + 200]; let d = `M${xs[0]} ${y + 60}`; for (let k = 1; k < xs.length; k++) d += ` Q${(xs[k - 1] + xs[k]) / 2} ${y + 130 + i * 12} ${xs[k]} ${y}`; return `<path d="${d}" fill="none" stroke="#0D111B" stroke-width="${3 + (i % 2) * 2}" opacity=".9"/>`; }).join('')}</svg>`;
    const facade = layer('facade', .9, `<div class="fac" style="position:absolute;inset:0">${shop}${store}${soi}${wall}${WORLD.poles.map(pole).join('')}${wires}${WORLD.lamps.map(lamp).join('')}</div>`);
    // ---- ground layer: sidewalk, light pools, motorcycle, actors
    const tiles = `<div style="position:absolute;left:0;top:1330px;width:${WORLD.w}px;height:312px;background:linear-gradient(180deg,#4A4F5C 0%,#5A5F6A 40%,#626670 100%)"></div>
      <div style="position:absolute;left:0;top:1330px;width:${WORLD.w}px;height:312px;background:repeating-linear-gradient(90deg,rgba(20,24,32,.35) 0 3px,transparent 3px 120px),repeating-linear-gradient(180deg,rgba(20,24,32,.3) 0 2px,transparent 2px 64px);opacity:.8"></div>
      <div style="position:absolute;left:${S0 - 120}px;top:1330px;width:${S1 - S0 + 240}px;height:312px;background:radial-gradient(ellipse 60% 90% at 50% 0%,rgba(255,244,220,.55),rgba(255,230,190,.12) 60%,rgba(255,230,190,0) 80%)"></div>
      ${WORLD.lamps.map(x => `<div style="position:absolute;left:${x - 260}px;top:1380px;width:780px;height:320px;border-radius:50%;background:radial-gradient(ellipse,rgba(255,196,120,.42),rgba(255,196,120,0) 68%)"></div>`).join('')}
      <div style="position:absolute;left:0;top:1640px;width:${WORLD.w}px;height:34px;background:linear-gradient(180deg,#8B909B,#5D626D)"></div>
      <div style="position:absolute;left:${A0 - 300}px;top:1640px;width:900px;height:34px;background:repeating-linear-gradient(90deg,#C9474B 0 90px,#E9E9EC 90px 180px);opacity:.85"></div>
      <div style="position:absolute;left:0;top:1674px;width:${WORLD.w}px;height:1400px;background:linear-gradient(180deg,#1E2230,#141823 40%,#0E1119)"></div>
      <div style="position:absolute;left:0;top:2120px;width:${WORLD.w}px;height:12px;background:repeating-linear-gradient(90deg,#B8B396 0 200px,transparent 200px 360px);opacity:.35"></div>
      <div style="position:absolute;left:${S0 - 100}px;top:1680px;width:${S1 - S0 + 200}px;height:260px;background:radial-gradient(ellipse 50% 60% at 50% 0%,rgba(255,236,200,.28),rgba(255,236,200,0) 80%);filter:blur(4px)"></div>
      ${WORLD.lamps.map(x => `<div style="position:absolute;left:${x + 80}px;top:1690px;width:110px;height:260px;background:linear-gradient(180deg,rgba(255,200,120,.45),rgba(255,200,120,0));filter:blur(6px)"></div>`).join('')}
      <div style="position:absolute;left:0;top:1800px;width:${WORLD.w}px;height:10px;background:repeating-linear-gradient(90deg,#C9C3A2 0 160px,transparent 160px 300px);opacity:.5"></div>`;
    const M = WORLD.moto;
    const moto = `<svg width="520" height="340" viewBox="0 0 520 340" style="position:absolute;left:${M - 220}px;top:${1172}px;overflow:visible;transform:scale(.82);transform-origin:50% 100%">
      <ellipse cx="260" cy="318" rx="230" ry="16" fill="rgba(5,8,18,.5)"/>
      <circle cx="110" cy="250" r="66" fill="#15171C"/><circle cx="110" cy="250" r="40" fill="#3A3F4A"/><circle cx="110" cy="250" r="14" fill="#9AA2AE"/>
      <circle cx="410" cy="250" r="66" fill="#15171C"/><circle cx="410" cy="250" r="40" fill="#3A3F4A"/><circle cx="410" cy="250" r="14" fill="#9AA2AE"/>
      <path d="M110 250 L190 170 L330 170 L410 250" stroke="#5A606C" stroke-width="14" fill="none" stroke-linecap="round"/>
      <path d="M160 140 Q260 108 350 132 L372 186 Q262 204 168 190Z" fill="#B23A48"/><path d="M180 132 Q250 112 320 124 L326 140 Q252 130 186 146Z" fill="#1B1D22"/>
      <path d="M350 132 L392 70 L430 64" stroke="#3B404A" stroke-width="12" fill="none" stroke-linecap="round"/><circle cx="430" cy="64" r="16" fill="#EDEFF2"/>
      <path d="M372 186 L414 120 Q440 110 448 140 L420 200Z" fill="#8E2C38"/><ellipse cx="452" cy="122" rx="16" ry="12" fill="#FFF3D0"/>
      <rect x="200" y="196" width="110" height="48" rx="12" fill="#2E323B"/></svg>`;
    const ground = layer('ground', 1, `${tiles}${moto}<div class="actors" style="position:absolute;left:0;top:0"></div>`);
    // ---- foreground: passing traffic light streaks + blurred pole (depth cue in close-ups)
    const fg = layer('fg', 1.35, `<div class="traffic" style="position:absolute;left:0;top:1780px;width:${WORLD.w}px;height:200px;filter:blur(10px)"></div>
      <div class="fgpole" style="position:absolute;left:2050px;top:-200px;width:70px;height:2400px;background:linear-gradient(90deg,#1A1E28,#0A0D14);filter:blur(12px);opacity:0"></div>`);
    const traffic = fg.querySelector('.traffic');
    traffic.innerHTML = [...Array(6)].map((_, i) => `<div class="car" style="position:absolute;left:0;top:${30 + (i % 3) * 40}px;width:${200 + i * 30}px;height:${36 + (i % 2) * 14}px;border-radius:40px;background:${i % 2 ? 'radial-gradient(ellipse,rgba(255,80,60,.75),rgba(255,80,60,0) 70%)' : 'radial-gradient(ellipse,rgba(255,248,220,.85),rgba(255,248,220,0) 70%)'}"></div>`).join('');
    const cars = [...traffic.querySelectorAll('.car')];
    const layers = [sky, far, facade, ground, fg];
    // haze + volumetric grain over everything in the world (scene-space, not layer-space)
    const haze = h(`<div style="position:absolute;inset:0;pointer-events:none;background:linear-gradient(180deg,rgba(40,70,110,.10),rgba(255,170,110,.03) 60%,rgba(10,15,30,.12))"></div>`); root.appendChild(haze);
    const WC = WORLD.w / 2;
    function camera(cx, cy, z, t = 0, { dof = 0, roll = 0, fgPole = 0 } = {}) {
      layers.forEach(Ly => {
        const p = Ly.p, zl = p <= 1 ? 1 + (z - 1) * p : z * (1 + (p - 1) * .6), lx = lerp(WC, cx, p), ly = lerp(960, cy, Math.min(1.15, p));
        Ly.style.transform = `translate(540px,960px) rotate(${roll}deg) scale(${zl}) translate(${-lx}px,${-ly}px)`;
      });
      const b = clamp(dof) * 7;
      far.style.filter = `blur(${f1(1 + b * .7)}px)`; facade.style.filter = b > .2 ? `blur(${f1(b * .45)}px)` : '';
      sky.style.filter = b > .2 ? `blur(${f1(b * .5)}px)` : '';
      // distant traffic passes right→left / left→right on the road (time-based, deterministic)
      cars.forEach((c, i) => { const sp = 900 + i * 220, dirc = i % 2 ? -1 : 1, span = WORLD.w + 1200; const x = ((t * sp * dirc + i * 1300) % span + span) % span - 600; c.style.transform = `translateX(${f1(x)}px)`; });
      fg.querySelector('.fgpole').style.opacity = fgPole;
    }
    return { root, actors: ground.querySelector('.actors'), camera, layers, WORLD };
  }

  window.CRIME = { actor, street, POSES, EXPR, mixPose, mixExpr, cycle, LOOKS, WORLD };
})();
