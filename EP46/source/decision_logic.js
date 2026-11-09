// EP.46 decision logic — the single source of truth for the exam-score program.
// Pure functions, no DOM. Loaded by the page (window.DL) and by the QC validator (require()).
(function (root) {
  const THRESHOLD = 60;                          // "ตั้งแต่ 60 ขึ้นไป" → inclusive: score >= 60
  const passes = score => score >= THRESHOLD;    // never ">" — 60 must pass
  const result = score => passes(score) ? 'ผ่าน' : 'ไม่ผ่าน';
  const branch = score => passes(score) ? 'yes' : 'no';
  // Ordered walk through the flowchart spec (node, edge, node, ...) for one input score.
  // opts.from: first node (default 'start'); opts.until: last node (default 'end').
  function route(score, { from = 'start', until = 'end' } = {}) {
    const ok = passes(score);
    const full = ['start', 'e_start_in', 'input', 'e_in_dec', 'decision',
      ok ? 'e_yes' : 'e_no', ok ? 'out_pass' : 'out_fail', ok ? 'e_pass_end' : 'e_fail_end', 'end'];
    const a = full.indexOf(from), b = full.indexOf(until);
    if (a < 0 || b < 0 || b < a) throw new Error('bad route bounds ' + from + '→' + until);
    return full.slice(a, b + 1);
  }
  const DL = { THRESHOLD, passes, result, branch, route, CONDITION: 'score >= 60' };
  if (typeof module !== 'undefined' && module.exports) module.exports = DL; else root.DL = DL;
})(typeof window !== 'undefined' ? window : globalThis);
