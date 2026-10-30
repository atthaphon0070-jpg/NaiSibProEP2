# Box (บ็อกซ์), presenter rig from the MR BOXER character project

`core.js` and `puppet.js` are **unmodified copies** of `episodes/_shared/core.js` and `episodes/_shared/puppet.js` from the character repo `atthaphon0070-jpg/3D` (commit `a6fb281`). That repo locks the cast's design, so do not edit these files here. Copy them again from the source if the rig is updated.

Box is `CHARS.box`: red-brown fringe, sunglasses, open light-blue shirt over a cream tee, khaki shorts and a bead necklace. He is drawn on a full-frame `<canvas id="c">` with
`drawPuppet('box', x, groundY, scale, pose, { emo, talk, blink, glassesDown }, t, { flip, fingerL })`.
At scale 1 he is about 560 px tall.

The NaiSibPro engine runs inside an IIFE (`window.NSP`), so its helper names do not clash with the globals in `core.js`. Load order: `engine.js`, then `core.js`, `puppet.js`, then the episode script. EP.34 is the first episode that uses Box (see `EP34/source/episode.js` → `drawBox`).
