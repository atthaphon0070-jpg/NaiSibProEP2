"""Writes EP30/qc/audio_durations.txt and EP30/qc/beat_map.md from the measured timeline + source/beats.js.
usage: python3 EP30/tools/qc_docs.py   (after shared/tools/audio_prep.py EP30)"""
import hashlib, json, os, subprocess
EP = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..')
tl = json.load(open(os.path.join(EP, 'renders/timeline.json')))
src = open(os.path.join(EP, 'source/beats.js'), encoding='utf-8').read()
beats = json.loads(src[src.index('{'):src.rindex('}') + 1])
FPS = tl['fps']
files = {'hook': '01_hook.mp3', 'story': '02_story.mp3', 'know': '03_knowledge.mp3', 'expl': '04_explanation.mp3',
         'quiz': '05_quiz.mp3', 'ans': '06_answer.mp3', 'promo': '07_promotion.mp3'}
role = {'hook': 'Hook', 'story': 'Story', 'know': 'Knowledge: without replacement', 'expl': 'Calculation', 'quiz': 'Quiz', 'ans': 'Answer', 'promo': 'Promotion'}
with open(os.path.join(EP, 'qc/audio_durations.txt'), 'w') as f:
    f.write('NaiSibPro EP30 narration (ElevenLabs originals from the supplied ZIP; only the doubled ".mp3.mp3" extension was dropped)\n')
    f.write('ffprobe container duration / decoded length at 48 kHz / start in the final timeline\n\n')
    tot = 0
    for k, fn in files.items():
        p = os.path.join(EP, 'audio', fn)
        j = json.loads(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=sample_rate,channels,bit_rate', '-of', 'json', p], capture_output=True, text=True).stdout)
        st = j['streams'][0]; md5 = hashlib.md5(open(p, 'rb').read()).hexdigest()
        f.write(f"{fn:24s} {role[k]:28s} {float(j['format']['duration']):8.3f} s  decoded {tl[k][1]:8.3f} s  starts {tl[k][0]:8.3f} s (frame {tl[k][0]*FPS:8.2f})  {st['sample_rate']} Hz {st['channels']} ch {int(st['bit_rate'])//1000} kbps  md5 {md5}\n")
        tot += tl[k][1]
    f.write(f"\nnarration total {tot:.3f} s\n")
    f.write("scene gaps: 0.350 s of silence after 01, 02, 03, 04 and 06 (transition wipes are centred in them); none between 05 and the countdown, none between the countdown and 06\n")
    f.write(f"countdown: {tl['cd'][1]:.3f} s = {round(tl['cd'][1]*FPS)} frames, frames {round(tl['cd'][0]*FPS)}–{round(tl['cd'][0]*FPS)+149} ({tl['cd'][0]:.4f}–{tl['cd'][0]+tl['cd'][1]:.4f} s); 05_quiz ends {tl['quiz'][0]+tl['quiz'][1]:.4f} s ({(tl['cd'][0]-tl['quiz'][0]-tl['quiz'][1])*1000:.1f} ms frame-alignment pad); 06_answer starts frame {round(tl['ans'][0]*FPS)}\n")
    f.write(f"video end {tl['end']:.3f} s = {round(tl['end']*FPS)} frames (1.8 s end-card hold after 07_promotion)\n")
with open(os.path.join(EP, 'qc/beat_map.md'), 'w', encoding='utf-8') as f:
    f.write('# EP30 beat map\n\n' + beats['_method'] + '\n\nEvery visual beat in `source/index.html` reads its time from `source/beats.js` (the numbers below). "Abs" is the time in the final video, "Frame" its 30 fps frame index.\n')
    for k, fn in files.items():
        f.write(f"\n## {fn} — {role[k]} (starts {tl[k][0]:.3f} s, length {tl[k][1]:.3f} s)\n\n| Beat | Local (s) | Abs (s) | Frame | Spoken phrase |\n|---|---:|---:|---:|---|\n")
        for name, (t, label) in beats[k].items():
            a = tl[k][0] + t
            f.write(f"| {name} | {t:.2f} | {a:.3f} | {round(a*FPS)} | {label} |\n")
        if k == 'quiz':
            f.write(f"\n## Countdown (silent)\n\nFrames {round(tl['cd'][0]*FPS)}–{round(tl['cd'][0]*FPS)+149} (150 frames): 5 → 4 → 3 → 2 → 1, 30 frames each, one tick per number. No narration.\n")
print('ok')
