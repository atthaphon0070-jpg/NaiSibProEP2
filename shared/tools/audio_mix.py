"""NaiSibPro mixer (shared, EP03+): synthesized music + UI SFX under the narration.

usage: python3 shared/tools/audio_mix.py <episode_dir>
Inputs  <ep>/build/narration.npy, timeline.json, sfx.json (cues + marks exported by the page)
Output  <ep>/build/mix.wav. Narration is never time-stretched or re-voiced.
"""
import json, os, sys, numpy as np, wave
SR = 48000
EP = sys.argv[1]
CFG = json.load(open(os.path.join(EP, 'episode.json')))
B = lambda f: os.path.join(EP, CFG.get('build_dir', 'build'), f)
MCFG = CFG.get('music', {})
narr = np.load(B('narration.npy')).astype(np.float64)
TL = json.load(open(B('timeline.json')))
_sfx = json.load(open(B('sfx.json')))
ev, MARKS = _sfx['events'], _sfx.get('marks', {})
N = len(narr); T = N / SR
rng = np.random.default_rng(7)
t_all = np.arange(N) / SR

def env(n, a, d):  # attack/exp-decay envelope
    x = np.arange(n) / SR
    e = np.exp(-x / d)
    at = max(1, int(a * SR)); e[:at] *= np.linspace(0, 1, at)
    return e
def tone(f, dur, a=.003, d=.1, harm=((1, 1),)):
    n = int(dur * SR); x = np.arange(n) / SR
    s = sum(g * np.sin(2 * np.pi * f * k * x) for k, g in harm)
    return s * env(n, a, d)
def lp(x, a):  # one-pole lowpass, a in (0,1)
    y = np.empty_like(x); acc = 0.0
    for i in range(len(x)): acc += a * (x[i] - acc); y[i] = acc
    return y
def noise(n): return rng.standard_normal(n)

def sfx_sound(kind):
    if kind in ('key', 'type'):
        n = int(.09 * SR); nz = np.diff(noise(n + 1)) * env(n, .0005, .006)
        thock = tone(170 if kind == 'key' else 240, .09, .001, .025)
        click = tone(2300, .09, .0005, .008)
        s = .35 * nz + .9 * thock + .35 * click
        return s * (1 if kind == 'key' else .6)
    if kind == 'click':
        return .5 * tone(1500, .06, .0005, .01) + .4 * tone(300, .06, .001, .02)
    if kind == 'pop':
        n = int(.14 * SR); x = np.arange(n) / SR
        f = 380 + 700 * (1 - np.exp(-x / .03))
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .045)
    if kind in ('whoosh', 'swoosh'):
        dur = .45 if kind == 'whoosh' else .75
        n = int(dur * SR); x = np.linspace(0, 1, n)
        nz = noise(n); a = 0.02 + 0.25 * np.sin(np.pi * x) ** 2
        y = lp(nz, 0.15) - lp(nz, 0.012)
        y *= np.sin(np.pi * x) ** 1.5
        return y * 1.6
    if kind == 'sparkle':
        out = np.zeros(int(.7 * SR))
        for i in range(7):
            f = 2200 + rng.random() * 2600; st = int(i * .07 * SR)
            b = tone(f, .25, .001, .06, ((1, 1), (2, .2)))
            out[st:st + len(b)] += b * (.6 - i * .05)
        return out * .6
    if kind == 'success':
        out = np.zeros(int(.9 * SR))
        for i, f in enumerate([1046.5, 1318.5, 1568.0, 2093.0]):
            st = int(i * .075 * SR); b = tone(f, .6, .002, .18, ((1, 1), (2, .25), (3, .08)))
            out[st:st + len(b)] += b * .5
        return out
    if kind == 'ding':
        return tone(1318.5, 1.6, .002, .45, ((1, 1), (2.01, .35), (3.0, .12), (4.2, .06))) * .7
    if kind in ('tick', 'tick2'):
        f = 1250 if kind == 'tick' else 1650
        return .8 * tone(f, .12, .0005, .02, ((1, 1), (2.7, .3))) + .3 * tone(f / 2, .12, .0005, .03)
    if kind == 'page':
        n = int(.38 * SR); x = np.linspace(0, 1, n)
        nz = noise(n); y = (lp(nz, .35) - lp(nz, .05)) * np.sin(np.pi * x) ** 2
        crk = np.zeros(n)
        for i in range(9):
            st = int((.08 + rng.random() * .22) * SR); b = np.diff(noise(int(.012 * SR) + 1)) * env(int(.012 * SR), .0005, .003)
            crk[st:st + len(b)] += b * .5
        return y + crk
    if kind == 'stamp':
        return tone(95, .35, .002, .09, ((1, 1), (2, .4))) + .4 * np.concatenate([np.diff(noise(int(.05 * SR) + 1)) * env(int(.05 * SR), .0005, .01), np.zeros(int(.3 * SR))])
    if kind == 'riser':
        n = int(.9 * SR); x = np.arange(n) / SR
        f = 300 * 2 ** (x / .9 * 2)
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * .4 + .25 * (lp(noise(n), .2))
        return s * np.linspace(0, 1, n) ** 2 * np.concatenate([np.ones(n - 2000), np.linspace(1, 0, 2000)])
    if kind == 'coin':
        return tone(1975, .25, .001, .06, ((1, 1), (1.5, .4))) + tone(2637, .25, .001, .08) * .6
    if kind == 'step':
        n = int(.1 * SR)
        return .9 * tone(95, .1, .002, .025) + .35 * np.diff(noise(n + 1)) * env(n, .001, .012)
    if kind == 'cloth':
        n = int(.32 * SR); x = np.linspace(0, 1, n)
        return (lp(noise(n), .25) - lp(noise(n), .03)) * np.sin(np.pi * x) ** 2 * 1.4
    if kind == 'zip':
        out = np.zeros(int(.3 * SR))
        for i in range(9):
            st = int(i * .028 * SR); m = int(.02 * SR); b = np.diff(noise(m + 1)) * env(m, .0005, .006)
            out[st:st + m] += b
        return out
    if kind == 'freeze':
        n = int(.45 * SR); x = np.linspace(0, 1, n)
        sw = (lp(noise(n), .3) - lp(noise(n), .05)) * x ** 3
        return np.concatenate([sw, np.zeros(int(.4 * SR))]) * .9 + np.concatenate([np.zeros(n), tone(2093, .4, .001, .08, ((1, 1), (1.5, .4)))]) * .6
    if kind == 'drop':
        n = int(.18 * SR)
        return tone(120, .25, .001, .05, ((1, 1), (2.3, .3))) + .5 * np.concatenate([np.diff(noise(n + 1)) * env(n, .0005, .02), np.zeros(int(.07 * SR))])
    if kind == 'rewind':
        n = int(.45 * SR); x = np.arange(n) / SR
        f = 1300 * np.exp(-x / .2) + 250
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + .4 * np.sin(2 * np.pi * 28 * x))
        return s * env(n, .005, .25) * .6
    # EP05 additions: phone / banking cues
    if kind == 'notify':   # two-note bank notification chime
        out = np.zeros(int(.9 * SR))
        for i, f in enumerate([1318.5, 1975.5]):
            st = int(i * .13 * SR); b = tone(f, .7, .002, .16, ((1, 1), (2, .3), (3.01, .1)))
            out[st:st + len(b)] += b * .55
        return out
    if kind == 'buzz':     # phone vibration, two pulses
        n = int(.22 * SR); x = np.arange(n) / SR
        p = np.sign(np.sin(2 * np.pi * 150 * x)) * .5 + np.sin(2 * np.pi * 300 * x) * .3
        p *= np.minimum(1, x / .01) * np.minimum(1, (x[-1] - x) / .02)
        return np.concatenate([p, np.zeros(int(.1 * SR)), p])
    if kind == 'msg':      # chat bubble blip
        n = int(.16 * SR); x = np.arange(n) / SR
        f = 900 + 900 * (1 - np.exp(-x / .025))
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .05)
    if kind == 'cash':     # register "ka-ching": metallic noise + bell
        n = int(.08 * SR); kk = np.diff(noise(n + 1)) * env(n, .0005, .015)
        bell = tone(2637, 1.0, .002, .3, ((1, 1), (1.5, .4), (2.76, .2)))
        out = np.zeros(int(1.1 * SR)); out[:n] += kk * .6; st = int(.09 * SR); out[st:st + len(bell)] += bell * .7
        return out
    # EP19 addition: soft "wrong answer" buzz (two low detuned tones, gentle attack)
    if kind == 'err':
        n = int(.32 * SR); x = np.arange(n) / SR
        s = (np.sin(2 * np.pi * 196 * x) + .7 * np.sin(2 * np.pi * 185 * x) + .25 * np.sin(2 * np.pi * 392 * x))
        return s * np.minimum(1, x / .015) * np.exp(-x / .12)
    raise ValueError(kind)

SFX_LEVEL = {'key': .20, 'type': .13, 'click': .16, 'pop': .14, 'whoosh': .10, 'swoosh': .16, 'sparkle': .10,
             'success': .16, 'ding': .17, 'tick': .30, 'tick2': .34, 'rewind': .13,
             'page': .16, 'stamp': .20, 'riser': .10, 'coin': .10,
             'step': .10, 'cloth': .10, 'zip': .12, 'freeze': .20, 'drop': .22,
             'notify': .18, 'buzz': .12, 'msg': .13, 'cash': .15, 'err': .14}
sfx = np.zeros(N)
cache = {}
for e in ev:
    k = e['type']
    s = sfx_sound(k) if k in ('whoosh', 'swoosh', 'sparkle', 'page', 'cloth', 'zip', 'freeze') else cache.setdefault(k, sfx_sound(k))
    s = s / (np.max(np.abs(s)) + 1e-9) * SFX_LEVEL[k] * e['gain']
    st = int(e['t'] * SR)
    if st < 0 or st >= N: continue
    seg = s[:N - st]; sfx[st:st + len(seg)] += seg

# ---------------- music: gentle 100 BPM pastel pop loop ----------------
bpm = MCFG.get('bpm', 100); beat = 60 / bpm; bar = 4 * beat
def midi(m): return 440 * 2 ** ((m - 69) / 12)
prog = MCFG.get('progression', [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 64]])
roots = MCFG.get('roots', [48, 45, 41, 43])
music = np.zeros(N)
pad = np.zeros(N); pl = np.zeros(N); bass = np.zeros(N); perc = np.zeros(N)
nbars = int(T / bar) + 2
for b in range(nbars):
    ch = prog[b % 4]; t0 = b * bar; s0 = int(t0 * SR)
    # pad
    n = int(bar * SR) + int(.6 * SR); x = np.arange(n) / SR
    e = np.minimum(1, x / .5) * np.minimum(1, np.maximum(0, (bar + .6 - x) / .6))
    p = sum(np.sin(2 * np.pi * midi(m) * x) + .5 * np.sin(2 * np.pi * midi(m) * 1.003 * x) for m in ch) * e
    seg = p[:max(0, N - s0)]; pad[s0:s0 + len(seg)] += seg
    # pluck arpeggio (8ths)
    pat = [0, 2, 1, 3, 2, 1, 3, 2]
    for i, k in enumerate(pat):
        st = int((t0 + i * beat / 2) * SR)
        if st >= N: break
        m = ch[k] + 12
        bl = tone(midi(m), .5, .002, .14, ((1, 1), (2, .3), (4, .05)))
        seg = bl[:N - st]; pl[st:st + len(seg)] += seg * (1 if i % 2 == 0 else .7)
    # bass on 1 and 3
    for i in (0, 2):
        st = int((t0 + i * beat) * SR)
        if st >= N: break
        bl = tone(midi(roots[b % 4]), beat * 1.6, .01, .35, ((1, 1), (2, .25)))
        seg = bl[:N - st]; bass[st:st + len(seg)] += seg
    # soft shaker on offbeats
    for i in range(8):
        st = int((t0 + i * beat / 2 + beat / 4) * SR)
        if st >= N: break
        n2 = int(.06 * SR); sh = np.diff(noise(n2 + 1)) * env(n2, .004, .015)
        seg = sh[:N - st]; perc[st:st + len(seg)] += seg * .5

def norm(x): return x / (np.max(np.abs(x)) + 1e-9)
music = .55 * norm(pad) + .5 * norm(pl) + .45 * norm(bass) + .12 * norm(perc)
# automation
cd0, cd1 = TL['cd'][0], TL['cd'][0] + TL['cd'][1]
lvl = np.full(N, 1.0)
def ramp(a, b, v0, v1):
    i0, i1 = int(a * SR), int(b * SR); lvl[i0:i1] = np.linspace(v0, v1, i1 - i0)
lvl[:] = 1.0
ramp(0, .6, 0, 1)
lvl[int(cd0 * SR):int(cd1 * SR)] = .45            # thinking time: softer, ticks lead
ramp(cd0 - .3, cd0, 1, .45); ramp(cd1, cd1 + .4, .45, 1)
end_card = MARKS.get('endcard', TL['end'] - 3.0)
ramp(end_card, TL['end'] - 1.6, 1, 1.25); ramp(TL['end'] - 1.6, T, 1.25, 0)
lvl[int((T - .01) * SR):] = 0
music = music * lvl
MUSIC_PEAK = MCFG.get('peak', .11)
music = music / np.max(np.abs(music)) * MUSIC_PEAK

# narration stays untouched (gain 1.0). If narration + bed would exceed the ceiling,
# only the bed (music + SFX) is turned down locally, with a smoothed gain curve.
CEIL = .97
bed = sfx + music
room = np.clip(CEIL - np.abs(narr), 0, None)
need = np.where(np.abs(bed) > room, room / (np.abs(bed) + 1e-9), 1.0)
w = int(.02 * SR)
from numpy.lib.stride_tricks import sliding_window_view
pad = np.pad(need, (w // 2, w - w // 2 - 1), constant_values=1.0)
bed_gain = sliding_window_view(pad, w).min(axis=1)               # look-around minimum
bed_gain = np.convolve(bed_gain, np.ones(w) / w, 'same')          # smooth
bed_gain = np.minimum(bed_gain, need)
g = 1.0
mus_g, sfx_g = music * bed_gain, sfx * bed_gain
L = narr + sfx_g + mus_g
wide = np.concatenate([np.zeros(int(.012 * SR)), mus_g[:-int(.012 * SR)]])
R = narr + sfx_g + wide
st = np.stack([L, R], 1)
st = np.clip(st, -1, 1)
pcm = (st * 32767).astype('<i2')
with wave.open(B('mix.wav'), 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('dur', T, 'narration gain', g, 'min bed gain', round(float(bed_gain.min()), 3), 'narr peak', np.max(np.abs(narr)), 'music rms', np.sqrt(np.mean(music ** 2)), 'narr rms', np.sqrt(np.mean(narr ** 2)))
