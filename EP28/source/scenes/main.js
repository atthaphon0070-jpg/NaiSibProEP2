// EP28 master: background theme per frame, scene registry → NSP.start, wipes at the scene seams.
{
  const bgScene = { el: $('nbg'), a: 0, b: 1e9, draw(t) {
    let d = 0; SC.forEach(sc => { if (t >= sc.a && t < sc.b) d = sc.dark ? sc.dark(t) : 0; });
    drawNbg(t, d); document.body.dataset.theme = d > .5 ? 'dark' : 'light';
  } };
  const wipes = window.WIPES || [S('story'), S('know'), S('expl'), S('quiz'), S('ans') + 5.3, S('promo')];
  NSP.start({ scenes: [bgScene, ...SC], wipes, brand: { showAt: 1.0 }, ep: 'EP.28 คอมพิวเตอร์' });
  const _r = window.renderAt;
  window.renderAt = t => { window.TOPO_NOW = t; _r(t); };
  window.renderAt(0);
}
