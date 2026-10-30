// writes qc/audio_durations.txt and qc/beat_map.md from audio files, timeline and beats.js
const fs = require('fs'), path = require('path'), { execSync } = require('child_process');
const ep = path.resolve(__dirname, '..'); global.window = {};
eval(fs.readFileSync(ep + '/source/beats.js', 'utf8')); eval(fs.readFileSync(ep + '/source/timeline.js', 'utf8'));
const B = window.BEATS, TL = window.TL;
const cfg = JSON.parse(fs.readFileSync(ep + '/episode.json'));
let a = 'EP28 narration — measured with ffprobe (original ElevenLabs files, byte-identical to the ZIP; only the doubled ".mp3.mp3" extension was dropped)\n\n';
a += 'file                  role          duration_s   md5                               master_start_s\n';
const role = { hook: 'Hook', story: 'Story', know: 'Knowledge', expl: 'Explanation', quiz: 'Quiz', ans: 'Answer', promo: 'Promotion' };
cfg.segments.forEach(s => {
  if (s.countdown) { a += `(silent countdown)    Countdown     ${s.countdown.toFixed(3).padStart(10)}   -                                 ${TL.cd[0].toFixed(3)}  (frames ${Math.round(TL.cd[0] * 30)}–${Math.round(TL.cd[0] * 30) + 149})\n`; return; }
  const f = ep + '/' + s.file, d = +execSync(`ffprobe -v error -show_entries format=duration -of csv=p=0 "${f}"`).toString(), md5 = execSync(`md5sum "${f}"`).toString().split(' ')[0];
  a += `${path.basename(f).padEnd(22)}${role[s.key].padEnd(14)}${d.toFixed(3).padStart(10)}   ${md5}  ${TL[s.key][0].toFixed(3)}\n`;
});
a += `\ntotal timeline ${TL.end.toFixed(3)} s (includes ${cfg.tail} s end-card hold) = ${Math.ceil(TL.end * 30)} frames @ 30 fps\n`;
fs.writeFileSync(ep + '/qc/audio_durations.txt', a);
let m = '# EP.28 beat map\n\nPhrase starts: 20 ms RMS speech map at −38 dBFS (pauses ≥ 0.12 s). Words: every pause-separated chunk was transcribed offline (Whisper large-v3-turbo via sherpa-onnx, Thai) and matched to the approved script. Times are seconds; **file** = inside the narration file, **master** = on the episode timeline. The countdown sits between the quiz and answer files.\n';
const segKey = { hook: 'hook', story: 'story', know: 'know', expl: 'expl', quiz: 'quiz', ans: 'ans', promo: 'promo' };
for (const [k, beats] of Object.entries(B)) {
  m += `\n## ${role[k]} — audio/${cfg.segments.find(s => s.key === k).file.split('/')[1]} (starts ${TL[k][0].toFixed(3)} s, ${TL[k][1].toFixed(3)} s long)\n\n| beat | file s | master s | narration (script wording) |\n|---|---:|---:|---|\n`;
  for (const [n, [t, tx]] of Object.entries(beats)) m += `| ${n} | ${t.toFixed(3)} | ${(TL[k][0] + t).toFixed(3)} | ${tx} |\n`;
  if (k === 'quiz') m += `\n**Countdown:** ${TL.cd[0].toFixed(3)}–${(TL.cd[0] + 5).toFixed(3)} s, frames ${Math.round(TL.cd[0] * 30)}–${Math.round(TL.cd[0] * 30) + 149} (150 frames, 5→1, 30 frames each, no narration).\n`;
}
fs.writeFileSync(ep + '/qc/beat_map.md', m);
console.log(a);
