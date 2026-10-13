// usage: node render.js <outDir> <mode: stills t1,t2,...|frames start end>
const { chromium } = require('/opt/node22/lib/node_modules/playwright');
const path = require('path'), fs = require('fs');
const [, , out, mode, a, b] = process.argv;
(async () => {
  const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium', args: ['--allow-file-access-from-files', '--disable-web-security'] });
  const page = await browser.newPage({ viewport: { width: 1080, height: 1920 }, deviceScaleFactor: 1 });
  page.on('pageerror', e => console.error('PAGEERR', e.message));
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto('file://' + path.resolve(__dirname, 'public/index.html'));
  await page.evaluate(() => window.ready);
  fs.mkdirSync(out, { recursive: true });
  if (mode === 'sfx') { fs.writeFileSync(out + '/sfx.json', JSON.stringify(await page.evaluate(() => window.SFX))); }
  else if (mode === 'stills') {
    for (const t of a.split(',').map(Number)) { await page.evaluate(t => renderAt(t), t); await page.screenshot({ path: `${out}/t_${t.toFixed(2)}.jpg`, type: 'jpeg', quality: 85 }); }
  } else {
    const s = +a, e = +b;
    for (let f = s; f < e; f++) {
      await page.evaluate(t => renderAt(t), f / 30);
      await page.screenshot({ path: `${out}/${String(f).padStart(5, '0')}.jpg`, type: 'jpeg', quality: 93 });
    }
  }
  await browser.close();
})().catch(e => { console.error(e); process.exit(1); });
