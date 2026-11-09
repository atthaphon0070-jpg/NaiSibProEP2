"""EP43 unit / content validation -> qc/unit_validation.json  (usage: python3 EP43/tools/unit_validate.py)"""
import json, os, re, subprocess
HERE = os.path.dirname(os.path.abspath(__file__)); EP = os.path.dirname(HERE)
D = json.loads(subprocess.run(['node', os.path.join(HERE, 'dump_data.js')], capture_output=True, text=True, check=True).stdout)
U = {u['k']: u for u in D['UNITS']}; Q = D['QUIZ']
src = {f: open(os.path.join(EP, 'source', f), encoding='utf-8').read() for f in ('scenes.js', 'data_ladder.js', 'index.html', 'units.js')}
allsrc = '\n'.join(src.values())
bits = lambda k: U[k]['bits'] if 'bits' in U[k] else 8 * 10 ** U[k]['exp']        # exact integers
byte_val = lambda k: 10 ** U[k].get('exp', 0)
checks = []
def chk(n, name, ok, detail=''):
    checks.append({'id': n, 'check': name, 'pass': bool(ok), 'detail': detail})
chk(1, '1 nibble = 4 bits', bits('nibble') == 4 and '1 nibble = 4 bits' in allsrc, f"nibble bits={bits('nibble')}")
chk(2, '1 Byte = 8 bits', bits('Byte') == 8 and '1 B = 8 bits' in allsrc and '8 bits = <span' in allsrc, f"Byte bits={bits('Byte')}")
chk(3, '1 Byte = 2 nibbles', bits('Byte') == 2 * bits('nibble') and '2 nibbles = 1 Byte' in allsrc)
EXP = {'kB': 3, 'MB': 6, 'GB': 9, 'TB': 12, 'PB': 15, 'EB': 18, 'ZB': 21, 'YB': 24, 'RB': 27, 'QB': 30}
for n, (k, e) in enumerate(EXP.items(), start=4):
    chk(n, f'1 {k} = 10^{e} B', U[k]['exp'] == e and U[k]['sym'] == k, f"{k}: 10^{U[k]['exp']} B = {byte_val(k):,} B")
dec = [k for k in EXP]
steps = [byte_val(dec[i + 1]) // byte_val(dec[i]) for i in range(len(dec) - 1)]
chk(14, 'decimal prefix steps are x1,000', all(s == 1000 for s in steps) and byte_val('kB') == 1000 * byte_val('Byte'), f'steps={sorted(set(steps))}')
shown = re.sub(r'#[0-9A-Fa-f]{6}\b', '', re.sub(r'//[^\n]*|/\*.*?\*/', '', allsrc, flags=re.S))   # drop comments + colour codes
binary = re.findall(r'1[,.]?024|KiB|MiB|GiB|TiB|2\^10|2<span class="ex">10', shown)
chk(15, 'main sequence does not mix decimal and binary standards', not binary and 'kB' in src['units.js'] and "big: 'KB'" not in src['units.js'], f'binary tokens found: {binary}')
order = sorted(['ZB', 'YB', 'RB', 'QB'], key=byte_val)
chk(16, 'final four-unit ranking is ZB -> YB -> RB -> QB', order == ['ZB', 'YB', 'RB', 'QB'], ' < '.join(f'{k} (10^{U[k]["exp"]})' for k in order))
correct = [b for b, toks in Q['options'] if toks == sorted(toks, key=byte_val)]
chk(17, 'correct quiz choice is ก (computed: the only ascending option)', correct == ['ก'] and Q['options'][Q['correct']][0] == 'ก',
    f"options={[b + ' ' + ' -> '.join(t) for b, t in Q['options']]}; ascending={correct}")
appr = [['ZB', 'YB', 'RB', 'QB'], ['ZB', 'RB', 'YB', 'QB'], ['YB', 'ZB', 'RB', 'QB'], ['ZB', 'YB', 'QB', 'RB']]
chk('17b', 'quiz options are exactly the approved four, in the approved internal order', [t for _, t in Q['options']] == appr and [b for b, _ in Q['options']] == ['ก', 'ข', 'ค', 'ง'])
chk(18, 'Ronna (R, 10^27) and Quetta (Q, 10^30) tied to the 2022 SI-prefix expansion (27th CGPM, Resolution 3)',
    U['RB'].get('si2022') and U['QB'].get('si2022') and U['RB']['p'] == 'R' and U['QB']['p'] == 'Q' and U['RB']['prefix'] == 'ronna' and U['QB']['prefix'] == 'quetta'
    and '2022' in src['scenes.js'] and 'CGPM ครั้งที่ 27 (2022) มติที่ 3' in src['scenes.js'] and not U['YB'].get('si2022'))
cdv = json.load(open(os.path.join(EP, 'qc', 'countdown_validation.json')))
chk(19, 'no final-answer highlight before the countdown ends', cdv['highlight_before_countdown_end'] is False and cdv['first_correct_highlight_s'] > cdv['countdown_start_s'] + 5,
    f"countdown {cdv['countdown_start_s']:.3f}-{cdv['countdown_start_s'] + 5:.3f} s; first highlight {cdv['first_correct_highlight_s']} s ({cdv['highlighted_option']})")
claims = re.findall(r'[^`<>]{0,40}ขนาดไฟล์สูงสุด[^`<>]{0,40}', allsrc)
chk(20, 'no claim of a maximum possible digital-file size (only the negated disclaimer)', all('ไม่ใช่' in c for c in claims) and 'คำนำหน้า SI ขนาดใหญ่ที่สุด' in allsrc, f'mentions={claims}')
# symbol case
syms = {k: U[k]['sym'] for k in U}
chk('S1', 'symbol case: b (bit), B (Byte), lowercase k in kB, uppercase R/Q', syms['bit'] == 'b' and syms['Byte'] == 'B' and syms['kB'] == 'kB' and syms['RB'] == 'RB' and syms['QB'] == 'QB'
    and not re.search(r'1 KB =|>KB<', allsrc), json.dumps(syms, ensure_ascii=False))
chk('S2', 'teaser uses the brief\'s simplified BIT/BYTE/KB chain only on the hook (formal ladder uses kB)', "['BIT', 'BYTE', 'KB', 'MB', 'GB', '?']" in src['scenes.js'])
chk('S3', 'tower order is bit -> nibble -> Byte -> kB ... QB', [u['k'] for u in D['UNITS']] == ['bit', 'nibble', 'Byte', 'kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB', 'RB', 'QB'])
chk('S4', 'bit -> nibble -> Byte is NOT shown as x1,000 (explicit on-screen note)', 'ไม่ใช่</span> × 1,000' in src['scenes.js'])
out = {'episode': 'EP43', 'all_pass': all(c['pass'] for c in checks), 'checks': checks,
       'values': {k: (f"{U[k]['bits']} bit(s)" if 'bits' in U[k] else f"10^{U[k]['exp']} B = {byte_val(k):,} B") for k in U},
       'references': ['BIPM — Resolution 3 of the 27th CGPM (2022): ronna R 10^27, quetta Q 10^30 (also ronto, quecto)',
                      'NIST — Metric (SI) Prefixes (quetta = 10^30 is the largest SI prefix)',
                      'NIST — Prefixes for binary multiples (KiB = 2^10 B; kB = 10^3 B)']}
json.dump(out, open(os.path.join(EP, 'qc', 'unit_validation.json'), 'w'), ensure_ascii=False, indent=1)
print(json.dumps({'all_pass': out['all_pass'], 'failed': [c for c in checks if not c['pass']]}, ensure_ascii=False, indent=1))
