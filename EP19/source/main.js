// EP19 assembly: scene order, wipes and brand header on the shared engine (NSP.start).
(function () {
  const X = EP19, sc = window.SC || {};
  const order = ['hook', 'story', 'know', 'expl', 'quiz', 'promo'].filter(k => sc[k]);
  // background layer is always on (blueprint drift + screen shake)
  const bgl = { el: document.getElementById('bglayer'), a: 0, b: 1e9, draw: t => { X.drawBg(t); X.drawShake(t); } };
  const scenes = [bgl, ...order.map(k => sc[k])];
  // section wipes at the narration hand-offs; quiz -> answer stays in one scene; answer -> promo is cut after the memory-phrase hold
  const wipes = [X.S('story'), X.S('know'), X.S('expl'), X.S('quiz')];
  if (sc.promo) wipes.push(sc.promo.a);
  NSP.start({
    ep: 'EP.19 • งานสารบรรณ',
    brand: { showAt: 1.2, hideAt: sc.promo ? sc.promo.logoAt : 1e9 },
    wipes,
    scenes,
  });
})();
