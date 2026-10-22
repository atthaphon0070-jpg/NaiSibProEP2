"""NaiSibPro EP15 mixer: cinematic score + night ambience + action/UI SFX under the narration.

usage: python3 EP15/tools/score.py EP15      (called by shared/tools/build_episode.sh via episode.json "mixer")
Inputs  <ep>/renders/narration.npy, timeline.json, sfx.json (events exported by the page)
Output  <ep>/renders/mix.wav. The narration is never time-stretched, re-voiced or EQ'd (gain 1.0);
only the bed (music + ambience + SFX) is ducked under it. No extra voices are created: every sound
here is synthesized (tones, filtered noise), so there is no speech and no third-party music.
"""
import json, os, sys, wave
import numpy as np

SR = 48000
EP = sys.argv[1]
CFG = json.load(open(os.path.join(EP, 'episode.json')))
B = lambda f: os.path.join(EP, CFG.get('build_dir', 'renders'), f)
narr = np.load(B('narration.npy')).astype(np.float64)
TL = json.load(open(B('timeline.json')))
EV = json.load(open(B('sfx.json')))['events']
N = len(narr); T = N / SR
rng = np.random.default_rng(15)
S = lambda k: TL[k][0]
D = lambda k: TL[k][1]

# ---------------------------------------------------------------- DSP helpers (numpy only)
def fft_filter(x, resp):
    """zero-phase filter by multiplying the spectrum with resp(freqs)"""
    n = len(x); X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR)
    return np.fft.irfft(X * resp(f), n)
def lowpass(x, fc, order=2): return fft_filter(x, lambda f: 1 / np.sqrt(1 + (f / fc) ** (2 * order)))
def highpass(x, fc, order=2): return fft_filter(x, lambda f: 1 / np.sqrt(1 + (fc / np.maximum(f, 1e-3)) ** (2 * order)))
def bandpass(x, lo, hi): return highpass(lowpass(x, hi), lo)
def env(n, a, d):
    t = np.arange(n) / SR; e = np.exp(-t / d); at = max(1, int(a * SR)); e[:at] *= np.linspace(0, 1, at); return e
def adsr(n, a, r):
    e = np.ones(n); ai, ri = max(1, int(a * SR)), max(1, int(r * SR)); e[:ai] = np.linspace(0, 1, ai); e[-ri:] *= np.linspace(1, 0, ri); return e
def noise(n): return rng.standard_normal(n)
def midi(m): return 440 * 2 ** ((m - 69) / 12)
def sine(f, n, ph=0): return np.sin(2 * np.pi * f * np.arange(n) / SR + ph)
def saw(f, n):
    t = np.arange(n) / SR; return 2 * ((t * f) % 1) - 1
def add(buf, x, t0, g=1.0):
    s = int(t0 * SR)
    if s >= len(buf) or s + len(x) <= 0: return
    if s < 0: x = x[-s:]; s = 0
    seg = x[:len(buf) - s]; buf[s:s + len(seg)] += seg * g
def norm(x): return x / (np.max(np.abs(x)) + 1e-9)
def ramp_curve(points):
    """piecewise-linear automation [(t, v), ...] → per-sample curve"""
    ts = np.array([p[0] for p in points]); vs = np.array([p[1] for p in points])
    return np.interp(np.arange(N) / SR, ts, vs)

# ---------------------------------------------------------------- SFX
def sfx_sound(k):
    if k == 'step':      # sneaker on tile: soft low thump + tiny scuff
        n = int(.12 * SR); th = sine(95, n) * env(n, .002, .025); sc = bandpass(noise(n), 900, 4000) * env(n, .001, .02) * .25
        return th + sc
    if k == 'runstep':
        n = int(.14 * SR); th = sine(80, n) * env(n, .001, .035); sc = bandpass(noise(n), 700, 3500) * env(n, .001, .03) * .35
        return th + sc
    if k == 'punch':     # plausible, non-graphic contact: muffled low thud + short cloth slap
        n = int(.5 * SR); f = 120 * np.exp(-np.arange(n) / SR / .05) + 45
        th = np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .001, .09)
        sl = lowpass(noise(n), 2200) * env(n, .0008, .018) * .6
        return th + sl
    if k == 'body':      # stumble / knee on the pavement, soft
        n = int(.4 * SR); return lowpass(noise(n), 500) * env(n, .004, .08) * .8 + sine(60, n) * env(n, .003, .1) * .5
    if k == 'push':      # two hands on a shirt: cloth thump
        n = int(.35 * SR); return lowpass(noise(n), 900) * env(n, .002, .05) + sine(85, n) * env(n, .002, .06) * .6
    if k == 'scuff':     # shoe scrape
        n = int(.3 * SR); return bandpass(noise(n), 1200, 5000) * adsr(n, .03, .2) * .7
    if k == 'cloth':
        n = int(.25 * SR); return bandpass(noise(n), 600, 3000) * np.sin(np.linspace(0, np.pi, n)) ** 2 * .7
    if k == 'whoosh':
        n = int(.45 * SR); x = noise(n); return bandpass(x, 300, 2400) * np.sin(np.linspace(0, np.pi, n)) ** 3
    if k == 'heart':     # lub-dub
        n = int(.6 * SR); h = np.zeros(n)
        for t0, g in ((0, 1), (.19, .7)):
            m = int(.18 * SR); s = int(t0 * SR); h[s:s + m] += sine(52, m) * env(m, .004, .05) * g
        return lowpass(h, 180)
    if k == 'impactlow': # cinematic sub hit
        n = int(2.2 * SR); f = 70 * np.exp(-np.arange(n) / SR / .3) + 32
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .6) + lowpass(noise(n), 300) * env(n, .001, .12) * .5
    if k == 'freeze':    # freeze-frame: impact + crystalline shimmer
        n = int(1.8 * SR); hit = sine(58, n) * env(n, .001, .25) + lowpass(noise(n), 1500) * env(n, .0005, .03) * .5
        sh = sum(sine(f, n) * g for f, g in ((2093, .25), (3136, .18), (4186, .12))) * env(n, .01, .7)
        return hit + sh * .5
    if k == 'rewind':    # tape rewind: falling chirps with flutter
        n = int(1.4 * SR); t = np.arange(n) / SR
        f = 2400 * np.exp(-t * 1.2) * (1 + .12 * np.sin(2 * np.pi * 14 * t)) + 200
        x = np.sin(2 * np.pi * np.cumsum(f) / SR) * .35 + bandpass(noise(n), 1500, 7000) * .25
        return x * adsr(n, .05, .5) * (.6 + .4 * np.sin(2 * np.pi * 9 * t))
    if k == 'riser':
        n = int(1.6 * SR); t = np.arange(n) / SR; f = 180 + 900 * (t / t[-1]) ** 2
        return (np.sin(2 * np.pi * np.cumsum(f) / SR) * .3 + highpass(noise(n), 2000) * .3) * (t / t[-1]) ** 2
    if k == 'scan':
        n = int(1.0 * SR); t = np.arange(n) / SR; f = 1800 + 1600 * t
        return np.sin(2 * np.pi * np.cumsum(f) / SR) * np.sin(np.linspace(0, np.pi, n)) * .4
    if k == 'evidence':  # soft analysis pulse
        n = int(.9 * SR); return (sine(880, n) * .5 + sine(1320, n) * .3) * env(n, .003, .22) + sine(110, n) * env(n, .003, .08) * .6
    if k == 'ui':
        n = int(.12 * SR); return sine(1250, n) * env(n, .001, .03) * .6 + sine(620, n) * env(n, .001, .05) * .4
    if k in ('tick', 'tick2'):
        n = int(.12 * SR); f = 1700 if k == 'tick' else 2200
        return sine(f, n) * env(n, .0005, .025) + highpass(noise(n), 3000) * env(n, .0003, .006) * .4
    if k == 'reveal':    # warm, serious resolution chord (not a party sting)
        n = int(2.6 * SR); return sum(sine(midi(m), n) * g for m, g in ((62, .5), (66, .4), (69, .4), (74, .3))) * env(n, .01, .9)
    # brand-ending UI sounds used by the shared promo module
    if k in ('pop', 'click'):
        n = int(.1 * SR); f = 900 if k == 'pop' else 1500; return sine(f, n) * env(n, .001, .03) + sine(f * 1.5, n) * env(n, .001, .015) * .4
    if k in ('sparkle', 'ding', 'coin', 'success'):
        n = int(1.0 * SR); notes = {'sparkle': (88, 93, 96), 'ding': (84, 91), 'coin': (88, 95), 'success': (72, 76, 79, 84)}[k]
        out = np.zeros(n)
        for i, m in enumerate(notes):
            s0 = int(i * .06 * SR); x = sine(midi(m), n - s0) * env(n - s0, .002, .25); out[s0:] += x
        return out
    if k in ('swoosh', 'page'):
        n = int(.35 * SR); return bandpass(noise(n), 800, 5000) * np.sin(np.linspace(0, np.pi, n)) ** 2
    raise ValueError(k)

LEVEL = {'step': .10, 'runstep': .14, 'punch': .34, 'body': .16, 'push': .22, 'scuff': .07, 'cloth': .08, 'whoosh': .10, 'heart': .30,
         'impactlow': .18, 'freeze': .15, 'rewind': .16, 'riser': .09, 'scan': .05, 'evidence': .12, 'ui': .08, 'tick': .30, 'tick2': .34, 'reveal': .10,
         'pop': .10, 'click': .10, 'sparkle': .07, 'ding': .10, 'coin': .07, 'success': .10, 'swoosh': .10, 'page': .10}
sfx = np.zeros(N); cache = {}
for e in EV:
    k = e['type']
    s = cache[k] if k in cache and k not in ('step', 'runstep', 'whoosh', 'cloth', 'scuff', 'swoosh', 'page') else sfx_sound(k)
    cache.setdefault(k, s)
    add(sfx, norm(s) * LEVEL[k] * e['gain'], e['t'])

# ---------------------------------------------------------------- ambience (night street; only during the reenactment)
amb = np.zeros(N)
L_AMB = int(S('clue') * SR) + SR * 2
base = lowpass(noise(L_AMB), 260, 2) * .9 + lowpass(noise(L_AMB), 900, 1) * .12           # distant traffic rumble
base *= .75 + .25 * np.sin(2 * np.pi * np.arange(L_AMB) / SR / 7.3)
amb[:L_AMB] += base
for i in range(14):                                                                          # car passes
    t0 = 1.5 + i * 5.7 + (i * 37 % 5) * .6
    if t0 > S('clue'): break
    n = int(3.2 * SR); x = bandpass(noise(n), 250, 1800) * np.sin(np.linspace(0, np.pi, n)) ** 2
    add(amb, x, t0, .5)
for t0 in (9.0, 31.0, 58.0):                                                                 # distant motorcycle (doppler)
    n = int(4.0 * SR); t = np.arange(n) / SR; f = 95 * (1 + .06 * np.tanh((2 - t) * 1.5))
    x = lowpass(np.sign(np.sin(2 * np.pi * np.cumsum(f) / SR)) * .5 + saw(f.mean() * 2, n) * .2, 1200) * np.sin(np.linspace(0, np.pi, n)) ** 2
    add(amb, x, t0, .25)
hum = (sine(120, L_AMB) * .5 + sine(240, L_AMB) * .2 + highpass(noise(L_AMB), 6000) * .05)  # store lights / fridge hum
amb_near_store = ramp_curve([(0, 0), (S('story') + 1.7, 0), (S('story') + 2.5, 1), (S('conflict') + 12.0, 1), (S('conflict') + 14.0, .2), (S('clue'), 0)])
amb[:L_AMB] += hum * .25 * amb_near_store[:L_AMB]
amb = norm(amb) * .06
amb *= ramp_curve([(0, 0), (.3, 1), (S('hook') + 4.5, 1), (S('hook') + 4.7, .35), (S('story'), .35), (S('story') + 1.6, .2), (S('story') + 2.2, 1),
                   (S('clue') - 2.4, 1), (S('clue') + .5, 0), (T, 0)])

# ---------------------------------------------------------------- cinematic score (D minor → D major resolution → bright brand ending)
mus = np.zeros(N)
def pad(notes, t0, dur, g=1.0, bright=1.0, lp=1800):
    n = int(dur * SR)
    x = sum(saw(midi(m), n) * .5 + saw(midi(m) * 1.004, n) * .5 for m in notes)
    x = lowpass(x, lp * bright, 2) * adsr(n, min(1.2, dur / 3), min(1.5, dur / 3))
    add(mus, x / len(notes), t0, g)
def piano(m, t0, g=1.0, d=1.6):
    n = int(d * 1.6 * SR); f = midi(m)
    x = (sine(f, n) + .45 * sine(2 * f, n) + .18 * sine(3 * f, n) + .06 * sine(4.02 * f, n)) * env(n, .003, d * .45)
    add(mus, x, t0, g)
def pulse(m, t0, dur, bpm, g=1.0, lp=600):
    beat = 60 / bpm / 2; k = 0
    while k * beat < dur:
        n = int(beat * .9 * SR); x = lowpass(saw(midi(m), n), lp) * env(n, .004, beat * .5)
        add(mus, x, t0 + k * beat, g * (1 if k % 2 == 0 else .7)); k += 1
def drone(m, t0, dur, g=1.0):
    n = int(dur * SR); x = lowpass(saw(midi(m), n) + saw(midi(m + 7), n) * .6, 300) * adsr(n, 1.0, 1.5); add(mus, x, t0, g)
def trem(notes, t0, dur, g=1.0):
    n = int(dur * SR); t = np.arange(n) / SR
    x = sum(sine(midi(m) * (1 + .003 * np.sin(2 * np.pi * 5.5 * t)), n) for m in notes) * (.6 + .4 * np.sin(2 * np.pi * 9 * t)) * adsr(n, dur * .8, .2)
    add(mus, x / len(notes), t0, g)
def tom(t0, g=1.0):
    n = int(.4 * SR); f = 110 * np.exp(-np.arange(n) / SR / .08) + 55; add(mus, np.sin(2 * np.pi * np.cumsum(f) / SR) * env(n, .002, .14), t0, g)
def hat(t0, g=1.0):
    n = int(.05 * SR); add(mus, highpass(noise(n), 7000) * env(n, .0005, .012), t0, g)

h0, st, cf, clu, qz, cd, an, pr = S('hook'), S('story'), S('conflict'), S('clue'), S('quiz'), S('cd'), S('ans'), S('promo')
FRZ = h0 + 4.61
# HOOK — immediate tension, then the suspended freeze
drone(38, h0, FRZ - h0 + .3, .9); pulse(38, h0, FRZ - h0, 100, .55); trem([74, 75, 81], h0 + .5, FRZ - h0 - .5, .35)
pad([50, 53, 57, 64], FRZ, st - FRZ - .9, .55, lp=1200); trem([86, 88], FRZ + .3, st - FRZ - 1.5, .12)
for i in range(int((st - FRZ - 1) / 1.2)): piano(74 if i % 2 == 0 else 76, FRZ + .8 + i * 1.2, .16, 1.2)
# STORY — restrained suspense (piano motif + low pad); a moment of quiet after the push
for k, (ch, m) in enumerate([([50, 57, 62, 65], 62), ([46, 53, 58, 62], 65), ([48, 55, 60, 64], 64), ([45, 52, 57, 61], 61)] * 3):
    t0 = st + 1.7 + k * 4.0
    if t0 > cf - 1: break
    pad(ch, t0, 4.4, .38, lp=900); piano(m + 12, t0 + .2, .22); piano(m + 7, t0 + 2.2, .14)
pulse(38, st + 9.7, 5.4, 112, .35, 500)
# CONFLICT — emotional escalation → pursuit drive → the hit → hollow aftermath → freeze
pad([50, 57, 62, 65], cf, 6.4, .35, lp=700)
pad([50, 56, 62, 65], cf + 6.2, 6.6, .5, lp=900); trem([74, 75], cf + 6.2, 6.6, .25)
drone(38, cf + 10.1, 3.0, .7)
bpm = 128; beat = 60 / bpm
for i in range(int(6.9 / beat * 2)):
    t0 = cf + 12.79 + i * beat / 2
    if i % 2 == 0: tom(t0, .55 if i % 8 else .8)
    hat(t0 + beat / 4, .25)
pulse(38, cf + 12.79, 6.9, bpm, .55, 900); pad([50, 53, 57, 62], cf + 12.79, 6.9, .4, lp=1400); trem([81, 82], cf + 15.5, 4.1, .2)
pad([38, 45, 51], cf + 20.0, 6.0, .42, lp=500)                                             # after the punch: hollow, dissonant
trem([87, 88], cf + 26.8, 2.6, .18)
# CLUE — investigative: quiet arpeggios over a low pad
arp = [62, 65, 69, 72, 69, 65]
for i in range(int((qz - clu - .5) / (60 / 96 / 2))):
    t0 = clu + .5 + i * 60 / 96 / 2; n = int(.18 * SR)
    add(mus, (sine(midi(arp[i % 6]), n) * .6 + sine(midi(arp[i % 6]) * 2, n) * .2) * env(n, .002, .09), t0, .22)
    if i % 2 == 0: hat(t0, .12)
for k in range(int((qz - clu) / 6) + 1): pad([50, 57, 62, 65] if k % 2 == 0 else [46, 53, 58, 62], clu + k * 6, 6.4, .3, lp=800)
# QUIZ — quiet suspense; COUNTDOWN — almost silent (ticks lead)
for k in range(int((cd - qz) / 6) + 1): pad([50, 57, 64] if k % 2 == 0 else [48, 55, 62], qz + k * 6, 6.4, .26, lp=700)
pad([50, 57], cd, 5.0, .12, lp=400)
# ANSWER — intelligent resolution: D major / G / Bm / A, swelling at the key message
prog = [[50, 57, 62, 66], [43, 55, 59, 62], [47, 54, 59, 62], [45, 52, 57, 61]]
for k in range(int((pr - an) / 4) + 1):
    t0 = an + k * 4.0
    if t0 > pr - 1.5: break
    pad(prog[k % 4], t0, 4.4, .36 if t0 < an + 44.7 else .42, lp=1500)
    piano(prog[k % 4][3] + 12, t0 + .1, .16); piano(prog[k % 4][2] + 12, t0 + 2.1, .1)
trem([78, 81, 86], an + 44.7, 6.0, .10)
# PROMO — hopeful, confident brand ending (100 BPM, C major)
bpm = 100; beat = 60 / bpm; bar = 4 * beat
pp = [[60, 64, 67, 71], [57, 60, 64, 67], [53, 57, 60, 64], [55, 59, 62, 65]]; rr = [48, 45, 41, 43]
for b in range(int((T - pr) / bar) + 1):
    t0 = pr + b * bar
    if t0 > T: break
    pad(pp[b % 4], t0, bar + .4, .5, lp=2600)
    for i, k in enumerate([0, 2, 1, 3, 2, 1, 3, 2]):
        n = int(.45 * SR); f = midi(pp[b % 4][k] + 12)
        add(mus, (sine(f, n) + .3 * sine(2 * f, n)) * env(n, .002, .13), t0 + i * beat / 2, .35 if i % 2 == 0 else .25)
    for i in (0, 2):
        n = int(beat * 1.5 * SR); add(mus, lowpass(saw(midi(rr[b % 4]), n), 400) * env(n, .01, .35), t0 + i * beat, .5)
mus = norm(mus) * .10
# level each section to a target loudness (smooth 1 s crossfades between sections)
TARGET = {'hook': -35, 'story': -38, 'conflict': -36, 'clue': -39, 'quiz': -40, 'ans': -38, 'promo': -36}
pts = []
for nm, tg in TARGET.items():
    a, b = int(S(nm) * SR), int((S(nm) + D(nm)) * SR); r = 20 * np.log10(np.sqrt(np.mean(mus[a:b] ** 2)) + 1e-9)
    gl = 10 ** ((tg - r) / 20); pts += [(S(nm) + .5, gl), (S(nm) + D(nm) - .5, gl)]
pts.sort(); mus *= ramp_curve([(0, pts[0][1])] + pts + [(T, pts[-1][1])])
if os.environ.get('SCORE_DEBUG'):
    for nm in ('hook', 'story', 'conflict', 'clue', 'quiz', 'ans', 'promo'):
        a, b = int(S(nm) * SR), int((S(nm) + D(nm)) * SR); print('music rms', nm, round(20 * np.log10(np.sqrt(np.mean(mus[a:b] ** 2)) + 1e-9), 1))
mus *= ramp_curve([(0, 0), (.25, 1), (st - .5, 1), (st + .3, .2), (st + 1.6, 1), (an - .05, .55), (an + .2, 1), (pr - 1.2, 1), (pr - .3, .3), (pr + .4, 1), (T - 1.6, 1), (T, 0)])

# ---------------------------------------------------------------- mix: narration untouched, only the bed is ducked
bed = mus + amb + sfx
CEIL = .97
room = np.clip(CEIL - np.abs(narr), 0, None)
need = np.where(np.abs(bed) > room, room / (np.abs(bed) + 1e-9), 1.0)
w = int(.02 * SR)
from numpy.lib.stride_tricks import sliding_window_view
padn = np.pad(need, (w // 2, w - w // 2 - 1), constant_values=1.0)
g = sliding_window_view(padn, w).min(axis=1); g = np.convolve(g, np.ones(w) / w, 'same'); g = np.minimum(g, need)
# gentle speech ducking of music/ambience (keeps every Thai word intelligible)
speech = np.convolve(np.abs(narr), np.ones(int(.05 * SR)) / int(.05 * SR), 'same') > .01
duck = np.convolve(np.where(speech, .62, 1.0), np.ones(int(.25 * SR)) / int(.25 * SR), 'same')
mus_d, amb_d = mus * duck * g, amb * duck * g
L = narr + sfx * g + mus_d + amb_d
d12 = int(.012 * SR)
R = narr + sfx * g + np.concatenate([np.zeros(d12), mus_d[:-d12]]) + np.concatenate([np.zeros(d12 // 2), amb_d[:-(d12 // 2)]])
st2 = np.clip(np.stack([L, R], 1), -1, 1)
with wave.open(B('mix.wav'), 'wb') as wf:
    wf.setnchannels(2); wf.setsampwidth(2); wf.setframerate(SR); wf.writeframes((st2 * 32767).astype('<i2').tobytes())
print('dur %.2f' % T, 'narration gain 1.0', 'min bed gain %.3f' % g.min(), 'narr peak %.3f' % np.max(np.abs(narr)),
      'music rms %.4f' % np.sqrt(np.mean(mus ** 2)), 'amb rms %.4f' % np.sqrt(np.mean(amb ** 2)), 'sfx events', len(EV))
