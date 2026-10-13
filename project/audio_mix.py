"""Step 2: synthesize music + SFX, mix with narration (narration stays dominant)."""
import json, sys, numpy as np, wave
SR = 48000
narr = np.load('narration.npy').astype(np.float64)
TL = json.load(open('timeline.json'))
ev = json.load(open('sfx.json'))
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
    if kind == 'rewind':
        n = int(.45 * SR); x = np.arange(n) / SR
        f = 1300 * np.exp(-x / .2) + 250
        s = np.sin(2 * np.pi * np.cumsum(f) / SR) * (0.6 + .4 * np.sin(2 * np.pi * 28 * x))
        return s * env(n, .005, .25) * .6
    raise ValueError(kind)

SFX_LEVEL = {'key': .20, 'type': .13, 'click': .16, 'pop': .14, 'whoosh': .10, 'swoosh': .16, 'sparkle': .10,
             'success': .16, 'ding': .17, 'tick': .30, 'tick2': .34, 'rewind': .13}
sfx = np.zeros(N)
cache = {}
for e in ev:
    k = e['type']
    s = sfx_sound(k) if k in ('whoosh', 'swoosh', 'sparkle') else cache.setdefault(k, sfx_sound(k))
    s = s / (np.max(np.abs(s)) + 1e-9) * SFX_LEVEL[k] * e['gain']
    st = int(e['t'] * SR)
    if st < 0 or st >= N: continue
    seg = s[:N - st]; sfx[st:st + len(seg)] += seg

# ---------------- music: gentle 100 BPM pastel pop loop ----------------
bpm = 100; beat = 60 / bpm; bar = 4 * beat
def midi(m): return 440 * 2 ** ((m - 69) / 12)
prog = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 64]]  # Cmaj7 Am7 Fmaj7 G6
roots = [48, 45, 41, 43]
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
end_card = TL['promo'][0] + 18.94
ramp(end_card, TL['end'] - 1.6, 1, 1.25); ramp(TL['end'] - 1.6, T, 1.25, 0)
lvl[int((T - .01) * SR):] = 0
music = music * lvl
MUSIC_PEAK = .11
music = music / np.max(np.abs(music)) * MUSIC_PEAK

# narration: keep untouched apart from a single global gain so the mix doesn't clip
mix_m = narr + sfx + music
peak = np.max(np.abs(mix_m))
g = .97 / peak if peak > .97 else 1.0
left = (narr + sfx + music) * g
# subtle stereo: music slightly wide, narration centered
wide = np.concatenate([np.zeros(int(.012 * SR)), music[:-int(.012 * SR)]]) * g
L = left; R = (narr + sfx) * g + wide
st = np.stack([L, R], 1)
st = np.clip(st, -1, 1)
pcm = (st * 32767).astype('<i2')
with wave.open('mix.wav', 'wb') as w:
    w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(pcm.tobytes())
print('dur', T, 'gain', g, 'narr peak', np.max(np.abs(narr)), 'music rms', np.sqrt(np.mean(music ** 2)), 'narr rms', np.sqrt(np.mean(narr ** 2)))
