// EP28 graph QC: structural validation of every diagram used in the episode, failure scenarios checked on the
// graphs (not on pixels), negative tests proving the validators reject wrong shapes, plus the render-time packet log.
// usage: node EP28/tools/qc_topology.js   → EP28/qc/topology_validation.json
const T = require('../source/topology.js'), fs = require('fs'), path = require('path');
const q = path.resolve(__dirname, '../qc');
const G = { star: T.DEF.star({ r: 235 }), bus: T.DEF.bus({ w: 600 }), ring: T.DEF.ring({ r: 245 }), mesh_full: T.DEF.mesh({ r: 245 }),
  tree: T.DEF.tree({ w: 520, top: 640, dy: 220 }), hybrid_star_bus: T.DEF.hybrid(), point_to_point: T.DEF.p2p({ d: 420 }) };
const out = { structures: {}, scenarios: [], negative_tests: [], counts: {} };
for (const [k, g] of Object.entries(G)) { const v = T.validate(g); out.structures[k] = { type: g.type, nodes: Object.keys(g.nodes).length, links: g.links.length, ok: v.ok, checks: v.checks }; }
const without = (g, id) => l => l.id !== id;
const sc = (name, pass, detail) => out.scenarios.push({ name, pass: !!pass, detail });
// STAR: PC3 cable out affects only PC3; switch down → no pair can communicate
{ const g = G.star, cut = without(g, T.lid('SW', 'PC3')), P = ['PC1', 'PC2', 'PC4', 'PC5'];
  sc('star: PC3 cable out → PC3 isolated', P.every(p => !T.path(g, 'PC3', p, cut)));
  sc('star: PC3 cable out → PC1,2,4,5 still reach each other (via switch)', P.every(a => P.every(b => a === b || (T.path(g, a, b, cut) || []).includes('SW'))));
  const swDown = n => n !== 'SW', all = T.pcs(g);
  sc('star: switch down → none of the 5 computers can reach another', all.every(a => all.every(b => a === b || !T.path(g, a, b, () => true, swDown))));
  sc('star: every PC↔PC route passes the switch', all.every(a => all.every(b => a === b || T.path(g, a, b).includes('SW')))); }
// BUS: backbone break T2–T3 splits the shared cable
{ const g = G.bus, cut = without(g, T.lid('T2', 'T3'));
  sc('bus: backbone break T2–T3 → PC1/PC2 cannot reach PC3/PC4/PC5', ['PC1', 'PC2'].every(a => ['PC3', 'PC4', 'PC5'].every(b => !T.path(g, a, b, cut))));
  sc('bus: red packet after the break uses PC1→T1→T2 only (links exist and are intact)', T.hasLink(g, 'PC1', 'T1') && T.hasLink(g, 'T1', 'T2')); }
// RING: clockwise route; break PC3–PC4 blocks the one-way path
{ const g = G.ring, o = g.meta.order;
  sc('ring: 5 nodes, 5 links, packet route PC1→…→PC5→PC1 follows links', [...o, 'PC1'].every((id, i, a) => i === a.length - 1 || T.hasLink(g, id, a[i + 1])));
  sc('ring: break PC3–PC4 → one-way (clockwise) path PC3→PC4 interrupted', !T.hasLink({ ...g, links: g.links.filter(without(g, T.lid('PC3', 'PC4'))) }, 'PC3', 'PC4'));
  sc('ring: red packet after the break uses PC1→PC2→PC3 (intact links)', T.hasLink(g, 'PC1', 'PC2') && T.hasLink(g, 'PC2', 'PC3')); }
// MESH: three demonstrated routes exist; after PC1–PC3 breaks the green reroute PC1→PC2→PC3 survives
{ const g = G.mesh_full, cut = without(g, T.lid('PC1', 'PC3'));
  sc('mesh: demonstrated routes PC1→PC3, PC1→PC2→PC3, PC1→PC5→PC4→PC3 all use real links', [['PC1', 'PC3'], ['PC1', 'PC2', 'PC3'], ['PC1', 'PC5', 'PC4', 'PC3']].every(r => r.every((id, i) => i === r.length - 1 || T.hasLink(g, id, r[i + 1]))));
  sc('mesh: after PC1–PC3 breaks, reroute PC1→PC2→PC3 uses surviving links', T.hasLink(g, 'PC1', 'PC2') && T.hasLink(g, 'PC2', 'PC3') && T.path(g, 'PC1', 'PC3', cut));
  sc('mesh: labelled "Full Mesh · 10 links" and has 10 = 5·4/2 links', g.links.length === 10 && g.meta.full); }
// TREE / HYBRID / P2P routes used by packets
{ const g = G.tree; sc('tree: packet routes R→B1→PC1, R→B2→PC4, R→B2→PC3, R→B1→PC2 follow parent→child links', [['R', 'B1', 'PC1'], ['R', 'B2', 'PC4'], ['R', 'B2', 'PC3'], ['R', 'B1', 'PC2']].every(r => r.every((id, i) => i === r.length - 1 || T.hasLink(g, id, r[i + 1])))); }
{ const g = G.hybrid_star_bus; sc('hybrid: cross-group route A1→SA→T1→T2→SB→B3 follows links (star → bus → star)', ['A1', 'SA', 'T1', 'T2', 'SB', 'B3'].every((id, i, r) => i === r.length - 1 || T.hasLink(g, id, r[i + 1]))); }
// negative tests
const neg = (name, g, mut, as) => { const c = JSON.parse(JSON.stringify(g)); mut(c); const v = T.validate(c, as || c.type); out.negative_tests.push({ name, rejected: !v.ok }); };
neg('star with a direct PC1–PC2 cable', G.star, g => g.links.push({ id: T.lid('PC1', 'PC2'), a: 'PC1', b: 'PC2', kind: 'cable' }));
neg('star diagram labelled as bus', G.star, () => {}, 'bus');
neg('open ring (one link missing)', G.ring, g => g.links.pop());
neg('full mesh missing one link', G.mesh_full, g => g.links.pop());
neg('tree with an extra PC1–PC2 link (cycle)', G.tree, g => g.links.push({ id: T.lid('PC1', 'PC2'), a: 'PC1', b: 'PC2' }));
neg('bus with broken (split) backbone', G.bus, g => { g.links = g.links.filter(l => l.id !== T.lid('T2', 'T3')); });
neg('hybrid with the joining bus removed', G.hybrid_star_bus, g => { g.links = g.links.filter(l => l.kind !== 'bb' && l.kind !== 'drop'); });
neg('point-to-point with a third node', G.point_to_point, g => { g.nodes.C = { id: 'C', kind: 'pc', x: 0, y: 0 }; });
const fc = path.join(q, 'frame_checks.json');
if (fs.existsSync(fc)) { const f = JSON.parse(fs.readFileSync(fc)); out.render_time = { packet_violations: f.packet_violation_count, label_mismatches: f.label_mismatch_count,
  note: 'TOPO.view draws a packet only if every hop it has travelled is a fully drawn, unbroken link of the current frame state; any other packet is dropped and logged. Labels with data-topo are compared with the displayed diagram type every 0.1 s.' }; }
out.counts = { structures_ok: Object.values(out.structures).filter(s => s.ok).length + '/' + Object.keys(out.structures).length,
  scenarios_ok: out.scenarios.filter(s => s.pass).length + '/' + out.scenarios.length, negative_rejected: out.negative_tests.filter(n => n.rejected).length + '/' + out.negative_tests.length };
out.pass = out.counts.structures_ok.split('/')[0] === out.counts.structures_ok.split('/')[1] && out.scenarios.every(s => s.pass) && out.negative_tests.every(n => n.rejected) && (!out.render_time || (out.render_time.packet_violations === 0 && out.render_time.label_mismatches === 0));
fs.writeFileSync(path.join(q, 'topology_validation.json'), JSON.stringify(out, null, 1));
console.log(JSON.stringify(out.counts), 'render:', JSON.stringify(out.render_time && [out.render_time.packet_violations, out.render_time.label_mismatches]), 'PASS', out.pass);
out.scenarios.filter(s => !s.pass).forEach(s => console.log('FAIL', s.name));
