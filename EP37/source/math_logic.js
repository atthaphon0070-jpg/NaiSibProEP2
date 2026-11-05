// NaiSibPro EP.37 — work-rate mathematics (single source of truth for every number on screen).
// Exact rational arithmetic; the tank level shown in every scene is computed from these functions,
// never from particles. Loaded by index.html (window.WR) and by qc/validate.js (module.exports).
(function (root) {
  const gcd = (a, b) => (b ? gcd(b, a % b) : Math.abs(a));
  const F = (n, d = 1) => { if (d < 0) { n = -n; d = -d; } const g = gcd(n, d) || 1; return { n: n / g, d: d / g }; };
  const add = (a, b) => F(a.n * b.d + b.n * a.d, a.d * b.d);
  const sub = (a, b) => add(a, F(-b.n, b.d));
  const inv = a => F(a.d, a.n);
  const val = a => a.n / a.d;
  const str = a => (a.d === 1 ? `${a.n}` : `${a.n}/${a.d}`);
  const over = (a, d) => ({ n: a.n * d / a.d, d });           // same value written over denominator d (unsimplified)

  // The approved problem
  const HOURS = { A: 4, B: 6, D: 12 };                          // A fills in 4 h, B fills in 6 h, drain empties a full tank in 12 h
  const RATE = { A: F(1, HOURS.A), B: F(1, HOURS.B), D: F(-1, HOURS.D) };   // tank per hour (drain negative)
  const LCD = 12;
  const INLET = add(RATE.A, RATE.B);                            // 5/12
  const NET = add(INLET, RATE.D);                               // 4/12 = 1/3
  const T_FULL = inv(NET);                                      // 3 h
  const T_TWO_TAPS = inv(INLET);                                // 12/5 h = 2 h 24 min (distractor ข: drain forgotten)

  const clamp = (x, a = 0, b = 1) => Math.min(b, Math.max(a, x));
  // Fill fraction (0..1) after h simulated hours from an empty tank, with the chosen devices open.
  // Constant-flow model: the bottom drain removes 1/12 tank/h whenever water is present; because the inflow
  // always exceeds it, the level is a straight line and never goes negative or above full.
  function level(h, { A = 0, B = 0, D = 0 } = {}, start = 0) {
    const r = A * val(RATE.A) + B * val(RATE.B) + D * val(RATE.D);
    return clamp(start + r * Math.max(0, h));
  }
  const drainOnly = h => level(h, { D: 1 }, 1);                  // full tank, drain alone: empty after 12 h
  const allThree = h => level(h, { A: 1, B: 1, D: 1 });         // the exam scenario
  const hm = hours => { const m = Math.round(hours * 60); return { h: Math.floor(m / 60), m: m % 60 }; };

  const WR = { F, add, sub, inv, val, str, over, HOURS, RATE, LCD, INLET, NET, T_FULL, T_TWO_TAPS, level, drainOnly, allThree, hm, clamp,
    ANSWER: { letter: 'ค', index: 2, text: '3 ชั่วโมง' },
    CHOICES: [['ก', '2 ชั่วโมง'], ['ข', '2 ชั่วโมง 24 นาที'], ['ค', '3 ชั่วโมง'], ['ง', '6 ชั่วโมง']] };
  if (typeof module !== 'undefined' && module.exports) module.exports = WR; else root.WR = WR;
})(typeof window !== 'undefined' ? window : globalThis);
