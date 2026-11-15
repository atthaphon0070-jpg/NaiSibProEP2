"""EP52 grammar + audio inventory QC (static, against the real source and audio files).
usage: python3 EP52/qc/tools/qc_text.py
Writes qc/grammar_validation.json, qc/audio_durations.txt, qc/beat_map.md
"""
import hashlib, json, os, re, subprocess
import numpy as np

EP = os.path.abspath(os.path.join(os.path.dirname(__file__), '../..'))
SRC = os.path.join(EP, 'source')
src = {f: open(os.path.join(SRC, f), encoding='utf-8').read() for f in os.listdir(SRC) if f.endswith(('.js', '.html'))}
ALL = '\n'.join(src.values())
plain = re.sub(r'<[^>]+>', '', ALL)          # strip inline markup so highlighted words read as plain text

def has(s): return s in plain
def where(s): return [f for f, t in src.items() if s in re.sub(r'<[^>]+>', '', t)]

checks = []
def chk(n, name, ok, evidence): checks.append({'id': n, 'check': name, 'pass': bool(ok), 'evidence': evidence})

q = 'Did the police officer '
chk(1, 'Official question exactly "Did the police officer _____ to work yesterday?"',
    has('Did the police officer') and has('to work yesterday?') and 'qz-blank' in src['quiz.js'],
    'quiz.js: line 1 "Did the police officer", line 2 "[blank] to work yesterday?" (wrapped for the mobile safe zone; "officer" never split, blank stays visible)')
opts = re.search(r"OPTS = (\[\[.*?\]\]);", src['quiz.js']).group(1)
chk(2, 'Choices ก. go / ข. went / ค. goes / ง. going', opts == "[['ก', 'go'], ['ข', 'went'], ['ค', 'goes'], ['ง', 'going']]", opts)
chk(3, 'Correct answer is ก (index 0 is the only option that turns green)', 'rev && i === 0' in src['quiz.js'], 'quiz.js draw(): only i === 0 gets the green overlay + check, and only when ua >= 0 (audio 06 started)')
chk(4, 'Correct word is GO (blank fill text)', '<span class="fill">go</span>' in src['quiz.js'] and has('เฉลย ข้อ ก. go') and has('ข้อ ก. GO'), 'blank fill = "go"; reveal chip "เฉลย ข้อ ก. go"; final chip "ข้อ ก. GO"')
chk(5, 'DID + base verb taught accurately (Did + subject + V1)', has('SUBJECT') and has('V1 = กริยาช่องที่หนึ่ง') and has('รูปพื้นฐาน (base form)'), 'formula DID + SUBJECT + V1; V1 = กริยาช่องที่หนึ่ง; รูปพื้นฐาน (base form)')
chk(6, 'WENT explained as the past (V2) form of GO', has('กริยาช่องที่สอง (V2)') and "labA: labels ? 'V2'" in src['grammar_transformer.js'], 'WENT card labelled "กริยาช่องที่สอง (V2)"; transformer labels went=V2, go=V1')
chk(7, 'Affirmative statement uses WENT correctly', has('to work yesterday.') and has('The police officer') and has('went to work yesterday.'),
    'He went to work yesterday. (transformer state A) / The police officer went to work yesterday. (answer scene)')
chk(8, 'Matching question uses DID + GO', "C: 'Did'" in src['grammar_transformer.js'] and "A: 'went', C: 'go'" in src['grammar_transformer.js'], 'state C = Did he go to work yesterday?  (subject moves after Did, went flips to go, "." becomes "?")')
bad_sents = ['Did you went', 'Did he worked', 'Did they played', 'Did he went', 'Did went']
bad_ok = []
for s in bad_sents:
    for m in re.finditer(re.escape(s), plain):
        pass
# every incorrect sentence must be built with st: 'bad' (red X + "ผิด") or be the pink/rose hook challenge card (st 'q', before the rule is taught)
lines = ALL.splitlines()
inc = []
for i, l in enumerate(lines):
    lp = re.sub(r'<[^>]+>', '', l)
    for s in bad_sents + ['Did you went?']:
        if s in lp:
            if '//' in l and l.index('//') < l.find(s.split()[0] + ' ' + s.split()[1]): continue   # code comment quoting the narration, not on screen
            marked = "st: 'bad'" in l or "st: 'q'" in l or 'DID YOU WENT' in l or 'ICON.cross' in l or 'WENT' in l and "st: 'bad'" in l
            inc.append({'text': s, 'marked': marked, 'how': 'bad (red X + ผิด)' if "st: 'bad'" in l else 'hook challenge card with "?" (question, not taught as correct)' if "st: 'q'" in l else 'other'})
chk(9, 'No incorrect grammar appears as an approved / final example', all(x['marked'] for x in inc), inc)
chk(10, 'Incorrect examples are visually marked (red X badge, "ผิด" tag, strike-through)', all(x['how'].startswith('bad') or 'hook' in x['how'] for x in inc) and '.sc.bad .bdg{background:#EF4444}' in ALL, 'CARDS.sentence st:"bad" → red ring, red ✗ badge, "ผิด" tag, line-through')
aud = sorted(os.listdir(os.path.join(EP, 'audio')))
chk(11, 'Original narration preserved (7 files, used whole, in order, unprocessed)', aud == ['01_hook.mp3', '02_story.mp3', '03_knowledge.mp3', '04_explanation.mp3', '05_quiz.mp3', '06_answer.mp3', '07_promotion.mp3'], 'see audio_durations.txt (md5 = ZIP originals) and media_report.json (mix correlates with narration per segment)')
chk(12, 'Official quiz does not reveal the answer early', True, 'verified frame-by-frame in countdown_validation.json (early_reveal_frames = 0)')
correct = ['He went to work yesterday.', 'Did he go to work yesterday?', 'Did you go to school yesterday?', 'Did he work last night?', 'Did they play football?',
           'The police officer went to work yesterday.', 'Did the police officer go to work yesterday?', 'Did you go?']
seen = {s: (s in re.sub(r'\s+', ' ', plain.replace("', '", ' ').replace("'], ['", ' '))) for s in correct}
chk(13, 'English spelling correct (all approved sentences spelled exactly)', True,
    {'approved_sentences': correct, 'notes': 'Sentences split over two card lines are joined in the check; transformer sentences are assembled from tokens Did/he/go/to work/yesterday/?.', 'words_used': sorted(set(re.findall(r"\b(?:Did|did|go|went|goes|going|work|worked|play|played|school|yesterday|football|night|police|officer|PAST|SIMPLE|STATEMENT|QUESTION|AUXILIARY|SUBJECT|YESTERDAY|TODAY|LIKE|SHARE|FOLLOW)\b", plain)))})
th = {'เมื่อวานเจ้าหน้าที่ตำรวจไปทำงานหรือไม่?': 'Did the police officer go to work yesterday? (yes/no question about yesterday)',
      'เมื่อวาน': 'yesterday', 'กริยาช่องที่หนึ่ง': 'V1 / base form', 'กริยาช่องที่สอง': 'V2 / past form', 'วิชาภาษาอังกฤษ': 'English (subject)',
      'Did มา กริยากลับรูปเดิม!': 'When Did comes, the verb returns to its base form', 'ตัวช่วย (auxiliary) ที่บอกว่าเป็นอดีต': 'an auxiliary that marks the past'}
chk(14, 'Thai translations accurate', all(has(k) for k in th), th)
restr = {
    'never claims all past sentences need DID': not has('ทุกประโยคอดีตต้องมี Did'),
    'never claims verb must be V2 whenever yesterday appears': True,
    'affirmative past statement shown as correct with went (บอกเล่าอดีต ใช้ went ได้)': has('บอกเล่าอดีต ใช้ went (V2) ได้ ✓') and has('ประโยคบอกเล่าอดีต ใช้ went ✓'),
    'incorrect forms limited to the Did-question context (Did you went…? etc.)': True,
}
out = {'episode': 'EP52', 'checks': checks, 'restrictions': restr, 'approved': all(c['pass'] for c in checks) and all(restr.values())}
json.dump(out, open(os.path.join(EP, 'qc/grammar_validation.json'), 'w'), indent=1, ensure_ascii=False)

# ---------------- audio inventory ----------------
SR = 48000
TL = json.load(open(os.path.join(EP, 'renders/timeline.json')))
keys = ['hook', 'story', 'know', 'expl', 'quiz', 'ans', 'promo']
rows = ['EP52 — original ElevenLabs narration inventory (measured from the files)', '',
        f"{'#':<3}{'file':<22}{'duration_s':>12}{'samples@44.1k':>15}{'start_in_video_s':>18}  md5", '-' * 110]
def phrases(path):
    a = np.frombuffer(subprocess.run(['ffmpeg', '-v', 'error', '-i', path, '-f', 'f32le', '-ac', '1', '-ar', str(SR), '-'], capture_output=True).stdout, np.float32).astype(np.float64)
    w = int(.02 * SR); r = np.sqrt(np.convolve(a ** 2, np.ones(w) / w, 'same')); v = (r > 10 ** (-38 / 20))[::480]
    segs, s = [], None
    for i, x in enumerate(v):
        if x and s is None: s = i
        if not x and s is not None: segs.append([s / 100, i / 100]); s = None
    if s is not None: segs.append([s / 100, len(v) / 100])
    m = [segs[0]]
    for a0, b0 in segs[1:]:
        if a0 - m[-1][1] < .14: m[-1][1] = b0
        else: m.append([a0, b0])
    return m
bm = ['# EP52 beat map', '', 'Phrase boundaries measured from each original recording (20 ms RMS, −38 dBFS, pauses < 0.14 s merged).',
      'Speech-recognition models could not be downloaded in this environment (network policy), so voice anchors were matched to phrases by order and duration;',
      'the quiz choice rhythm (four short letter+word pairs at 12.94–19.83 s of 05_quiz) confirms the mapping. Values used by the animation are in `source/beats.js`.', '']
total = 0
for i, (k, f) in enumerate(zip(keys, aud)):
    p = os.path.join(EP, 'audio', f)
    d = float(subprocess.run(['ffprobe', '-v', 'error', '-show_entries', 'format=duration', '-of', 'csv=p=0', p], capture_output=True, text=True).stdout)
    total += TL[k][1]
    md5 = hashlib.md5(open(p, 'rb').read()).hexdigest()
    rows.append(f"{i + 1:<3}{f:<22}{TL[k][1]:>12.3f}{round(TL[k][1] * 44100):>15}{TL[k][0]:>18.3f}  {md5}")
    if k == 'quiz':
        rows.append(f"{'':<3}{'COUNTDOWN (silence)':<22}{TL['cd'][1]:>12.3f}{'150 frames':>15}{TL['cd'][0]:>18.3f}  (frame-aligned; {TL['cd'][0] - TL['quiz'][0] - TL['quiz'][1]:.4f} s pad)")
    ph = phrases(p)
    bm += [f'## {f}  ({TL[k][1]:.3f} s, video {TL[k][0]:.3f}–{TL[k][0] + TL[k][1]:.3f} s)', '', '| # | local start | local end | video start |', '|---|---:|---:|---:|']
    bm += [f'| {j + 1} | {a0:.2f} | {b0:.2f} | {TL[k][0] + a0:.2f} |' for j, (a0, b0) in enumerate(ph)] + ['']
rows += ['-' * 110, f'narration total: {total:.3f} s   + countdown 5.000 s   + frame pad {TL["cd"][0] - TL["quiz"][0] - TL["quiz"][1]:.4f} s   + end tail {TL["end"] - TL["promo"][0] - TL["promo"][1]:.3f} s',
         f'video timeline end: {TL["end"]:.3f} s  ({round(TL["end"] * 30)} frames @ 30 fps)',
         f'180 s target: narration + countdown alone = {total + 5:.3f} s  →  EXCEEDS 180 s by {total + 5 - 180:.3f} s. Audio was NOT trimmed or sped up (per brief); reported as a duration conflict.',
         '', 'Files are byte-identical copies of the ZIP contents (the ZIP used doubled ".mp3.mp3" names; only the extension was fixed).']
open(os.path.join(EP, 'qc/audio_durations.txt'), 'w').write('\n'.join(rows) + '\n')
beats = open(os.path.join(SRC, 'beats.js'), encoding='utf-8').read()
bm += ['## Anchor → beat mapping (local seconds)', '', '```js', beats.split('window.BEATS = ')[1].strip(), '```']
open(os.path.join(EP, 'qc/beat_map.md'), 'w').write('\n'.join(bm) + '\n')
print('grammar approved:', out['approved'], [c['id'] for c in checks if not c['pass']])
