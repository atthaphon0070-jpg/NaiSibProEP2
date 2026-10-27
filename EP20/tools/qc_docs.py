"""Writes EP20/qc/audio_durations.txt and EP20/qc/beat_map.md from the measured timeline + source/beats.js.
usage: python3 EP20/tools/qc_docs.py   (after shared/tools/audio_prep.py EP20)"""
import json, os, subprocess
EP = os.path.join(os.path.dirname(__file__), '..')
tl = json.load(open(os.path.join(EP, 'renders/timeline.json')))
src = open(os.path.join(EP, 'source/beats.js'), encoding='utf-8').read()
beats = json.loads(src[src.index('{'):src.rindex('}') + 1])
FPS = tl['fps']
files = {'hook': '01_hook.mp3', 'story': '02_story.mp3', 'know': '03_knowledge.mp3', 'expl': '04_explanation.mp3', 'quiz': '05_quiz.mp3', 'ans': '06_answer.mp3', 'promo': '07_promotion.mp3'}
with open(os.path.join(EP, 'qc/audio_durations.txt'), 'w') as f:
    f.write('NaiSibPro EP20 narration durations (ffprobe container duration / decoded sample length at 48 kHz)\n\n')
    tot = 0
    for k, fn in files.items():
        p = os.path.join(EP, 'audio', fn)
        pr = subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration:stream=sample_rate,channels,bit_rate', '-of', 'json', p], capture_output=True, text=True).stdout
        j = json.loads(pr); st = j['streams'][0]
        f.write(f"{fn:20s} {float(j['format']['duration']):8.3f} s  decoded {tl[k][1]:8.3f} s  starts {tl[k][0]:8.3f} s (frame {round(tl[k][0]*FPS)})  {st['sample_rate']} Hz {st['channels']} ch {int(st['bit_rate'])//1000} kbps\n")
        tot += tl[k][1]
    f.write(f"\nnarration total {tot:.3f} s; gaps between files 0.300 s (9 frames) x5; countdown {tl['cd'][1]:.3f} s = {round(tl['cd'][1]*FPS)} frames from {tl['cd'][0]:.3f} s (frame {round(tl['cd'][0]*FPS)}); 06_answer starts frame {round(tl['ans'][0]*FPS)}\n")
    f.write(f"video end {tl['end']:.3f} s = {round(tl['end']*FPS)} frames (0.9 s logo hold after the last word's file)\n")
with open(os.path.join(EP, 'qc/beat_map.md'), 'w', encoding='utf-8') as f:
    f.write('# EP20 beat map\n\n' + beats['_method'] + '\n\nEvery visual beat in `source/index.html` reads its time from `source/beats.js` (the same numbers as below). "Abs" is the time in the final video and "Frame" is its 30 fps frame index.\n')
    for k, fn in files.items():
        f.write(f"\n## {fn} (starts {tl[k][0]:.3f} s, length {tl[k][1]:.3f} s)\n\n| Beat | Local (s) | Abs (s) | Frame | Word / visual |\n|---|---:|---:|---:|---|\n")
        for name, (t, label) in beats[k].items():
            a = tl[k][0] + t
            f.write(f"| {name} | {t:.3f} | {a:.3f} | {round(a*FPS)} | {label} |\n")
    f.write(f"\n## Countdown\n\nSilent, frames {round(tl['cd'][0]*FPS)}–{round(tl['cd'][0]*FPS)+149} (150 frames): 5 → 4 → 3 → 2 → 1, 30 frames each, one tick per number.\n")
print('ok')
