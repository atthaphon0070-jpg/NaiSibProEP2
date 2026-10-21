// NaiSibPro frame renderer (shared, EP03+).
// usage: node shared/tools/render.js <episodeDir> sfx
//        node shared/tools/render.js <episodeDir> stills <outDir> t1,t2,...
//        node shared/tools/render.js <episodeDir> frames <outDir> <startFrame> <endFrame>
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const [, , ep, mode, out, a, b] = process.argv;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => { console.error('PAGEERR', e.message); process.exitCode = 2; });
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  // GUIDE=1 draws the episode's safe-zone / platform-overlay QA guide (never used for final renders)
  await page.goto('file://' + path.resolve(ep, 'source/index.html') + (process.env.GUIDE ? '?guide=1' : ''));
  await page.evaluate(() => window.ready);
  // load every webfont face up front: scenes start display:none, so document.fonts.ready alone can resolve before a face is requested
  await page.evaluate(() => Promise.all([...document.fonts].map(f => f.load().catch(() => null))).then(() => document.fonts.ready));
  const fps = await page.evaluate(() => window.TL.fps || 30);
  const BUILD = JSON.parse(fs.readFileSync(path.join(ep, 'episode.json'))).build_dir || 'build';
  if (mode === 'sfx') {
    fs.mkdirSync(path.join(ep, BUILD), { recursive: true });
    fs.writeFileSync(path.join(ep, BUILD, 'sfx.json'), JSON.stringify(await page.evaluate(() => ({ events: window.SFX, marks: window.MARKS || {} }))));
  } else if (mode === 'stills') {
    fs.mkdirSync(out, { recursive: true });
    for (const t of a.split(',').map(Number)) { await page.evaluate(t => renderAt(t), t); await page.screenshot({ path: `${out}/t_${t.toFixed(2)}.jpg`, type: 'jpeg', quality: 85 }); }
  } else {
    fs.mkdirSync(out, { recursive: true });
    for (let f = +a; f < +b; f++) {
      await page.evaluate(t => renderAt(t), f / fps);
      await page.screenshot({ path: `${out}/${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 93 });
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
