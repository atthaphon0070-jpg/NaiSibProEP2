// Prints UNITS / QUIZ / BEATS from the episode source as JSON (used by unit_validate.py).
const vm = require('vm'), fs = require('fs'), path = require('path');
const ctx = { window: {} }; vm.createContext(ctx);
for (const f of ['units.js', 'beats.js']) vm.runInContext(fs.readFileSync(path.join(__dirname, '../source', f), 'utf8'), ctx);
console.log(JSON.stringify({ UNITS: ctx.window.UNITS, QUIZ: ctx.window.QUIZ, BEATS: ctx.window.BEATS }));
