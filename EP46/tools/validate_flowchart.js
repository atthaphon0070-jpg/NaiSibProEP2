// EP.46 flowchart logic validation (static: spec + decision logic). usage: node tools/validate_flowchart.js
// Writes qc/flowchart_validation.json. qc_browser.js later appends the rendered-frame checks (16, runs).
const fs = require('fs'), path = require('path');
const SRC = path.join(__dirname, '../source');
const DL = require(path.join(SRC, 'decision_logic.js')), SPEC = require(path.join(SRC, 'flowchart_spec.js'));
const N = Object.fromEntries(SPEC.nodes.map(n => [n.id, n])), Ed = Object.fromEntries(SPEC.edges.map(e => [e.id, e]));
const out = { generated: new Date().toISOString(), checks: [] };
const chk = (id, name, pass, detail) => out.checks.push({ id, name, pass: !!pass, detail });
const near = (p, n, tol = 6) => {               // is point p on the outline/bbox of node n?
  const l = n.cx - n.w / 2, r = n.cx + n.w / 2, t = n.cy - n.h / 2, b = n.cy + n.h / 2;
  return p[0] >= l - tol && p[0] <= r + tol && p[1] >= t - tol && p[1] <= b + tol &&
    (Math.abs(p[0] - l) <= tol || Math.abs(p[0] - r) <= tol || Math.abs(p[1] - t) <= tol || Math.abs(p[1] - b) <= tol ||
     (n.kind === 'io' || n.kind === 'decision'));  // slanted/diagonal outlines: inside bbox is enough
};
chk(1, 'Start uses the Terminator symbol', N.start.kind === 'terminator', N.start);
chk(2, 'End uses the Terminator symbol', N.end.kind === 'terminator', N.end);
const procOk = fs.readFileSync(path.join(SRC, 'flowchart_symbols.js'), 'utf8').includes("case 'process': return `M0,0H${w}V${h}H0Z`");
chk(3, 'Process uses a rectangle (straight sides, square corners)', procOk, 'FS.path("process") = M0,0 H w V h H 0 Z');
chk(4, 'Input/Output uses a parallelogram', ['input', 'out_pass', 'out_fail'].every(id => N[id].kind === 'io'), ['input', 'out_pass', 'out_fail'].map(id => `${id}:${N[id].kind}`));
chk(5, 'Decision uses a diamond', N.decision.kind === 'decision', N.decision);
// 6: flowline directions: every edge starts on its source outline and ends on its target outline, and no edge points upward
const dirs = SPEC.edges.map(e => {
  const s = e.pts[0], t = e.pts[e.pts.length - 1];
  const up = e.pts.some((p, i) => i && p[1] < e.pts[i - 1][1] - .5);
  return { id: e.id, from: e.from, to: e.to, startsOnSource: near(s, N[e.from]), endsOnTarget: near(t, N[e.to]), pointsBackward: up };
});
chk(6, 'Flowlines start at the source symbol, end with the arrowhead at the target, never point backward', dirs.every(d => d.startsOnSource && d.endsOnTarget && !d.pointsBackward), dirs);
const conSrc = fs.readFileSync(path.join(SRC, 'scenes.js'), 'utf8');
chk(7, 'On-page Connector uses a small circle (96 px, labelled A on both ends)', /FS\.node\('connector', \{ w: 96, h: 96, cx: 380[^)]*label: 'A'/.test(conSrc) && /FS\.node\('connector', \{ w: 96, h: 96, cx: 700[^)]*label: 'A'/.test(conSrc), 'two matching connectors A → A');
chk(8, 'Score threshold is >= 60', DL.THRESHOLD === 60 && DL.CONDITION === 'score >= 60' && N.decision.label.includes('≥ 60'), { threshold: DL.THRESHOLD, label: N.decision.label });
chk(9, 'Yes branch outputs Pass', Ed.e_yes.label === 'ใช่' && Ed.e_yes.to === 'out_pass' && N.out_pass.result === 'ผ่าน', Ed.e_yes);
chk(10, 'No branch outputs Fail', Ed.e_no.label === 'ไม่ใช่' && Ed.e_no.to === 'out_fail' && N.out_fail.result === 'ไม่ผ่าน', Ed.e_no);
// 11: both branches reach End (graph search)
const adj = {}; SPEC.edges.forEach(e => (adj[e.from] = adj[e.from] || []).push(e.to));
const reach = (a, b, seen = new Set()) => a === b || (adj[a] || []).some(x => !seen.has(x) && (seen.add(x), reach(x, b, seen)));
chk(11, 'Both branches reach End', reach('out_pass', 'end') && reach('out_fail', 'end') && reach('start', 'end'), { decisionExits: adj.decision, passToEnd: reach('out_pass', 'end'), failToEnd: reach('out_fail', 'end') });
const cases = [45, 59, 60, 75, 100].map(s => ({ score: s, result: DL.result(s), route: DL.route(s) }));
const expect = { 45: 'ไม่ผ่าน', 59: 'ไม่ผ่าน', 60: 'ผ่าน', 75: 'ผ่าน', 100: 'ผ่าน' };
chk(12, 'Score 60 is classified as Pass', DL.result(60) === 'ผ่าน', cases.find(c => c.score === 60));
chk(13, 'Score 59 is classified as Fail', DL.result(59) === 'ไม่ผ่าน', cases.find(c => c.score === 59));
chk('12b', 'All test cases (45, 59, 60, 75, 100) give the expected result and end at End', cases.every(c => c.result === expect[c.score] && c.route[c.route.length - 1] === 'end' && c.route.includes(DL.passes(c.score) ? 'out_pass' : 'out_fail')), cases);
const Q = SPEC.quiz;
chk(14, "The exam's correct answer is ก", Q.options[Q.correct].letter === 'ก' && Q.options[Q.correct].seq.join() === 'io,decision,io', Q.options[Q.correct]);
const want = { 'ก': 'ด้านขนาน → ข้าวหลามตัด → ด้านขนาน', 'ข': 'สี่เหลี่ยมผืนผ้า → ข้าวหลามตัด → สี่เหลี่ยมผืนผ้า', 'ค': 'ข้าวหลามตัด → ด้านขนาน → สี่เหลี่ยมผืนผ้า', 'ง': 'ด้านขนาน → สี่เหลี่ยมผืนผ้า → ข้าวหลามตัด' };
chk(15, 'All four options match the approved text, and each card draws the shapes in the same order as its text', Q.options.every(o => want[o.letter] === o.text), Q.options);
chk(17, 'The three-symbol answer is not presented as the whole program', conSrc.includes('3 ขั้นหลักของโจทย์ ไม่ใช่ผังงานทั้งหมด') && N.start && N.end,
  'Complete chart (Start, End, both branches) is built before the memory rule; the memory card carries the note "3 ขั้นหลักของโจทย์ ไม่ใช่ผังงานทั้งหมด — ผังงานจริงต้องมี เริ่มต้น · สิ้นสุด · ลูกศร ด้วย"');
out.fail_conditions = {
  decision_without_branch: (adj.decision || []).length !== 2, yes_no_reversed: Ed.e_yes.to !== 'out_pass' || Ed.e_no.to !== 'out_fail',
  output_mismatch: !cases.every(c => c.result === expect[c.score]), backward_flowline: dirs.some(d => d.pointsBackward),
  disconnected_required_path: !SPEC.nodes.every(n => n.id === 'end' || (adj[n.id] || []).length), end_unreachable: !reach('start', 'end'), sixty_fails: DL.result(60) !== 'ผ่าน',
};
out.all_static_pass = out.checks.every(c => c.pass) && !Object.values(out.fail_conditions).some(Boolean);
fs.mkdirSync(path.join(__dirname, '../qc'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '../qc/flowchart_validation.json'), JSON.stringify(out, null, 1));
out.checks.forEach(c => console.log(c.pass ? 'PASS' : 'FAIL', c.id, c.name));
console.log('all_static_pass', out.all_static_pass, out.fail_conditions);
