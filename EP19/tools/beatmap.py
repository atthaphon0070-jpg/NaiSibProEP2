"""EP19 beat map: measured phrase boundaries for every narration file.

usage: python3 EP19/tools/beatmap.py EP19

Decodes each narration file, finds the voiced runs (20 ms RMS above -38 dBFS, gaps
shorter than 120 ms merged, blips shorter than 40 ms dropped) and labels them with
the approved transcript phrases in tools/phrases.json. The run count must match the
transcript exactly, otherwise the build stops (wrong / re-cut audio is never guessed).
Writes source/beats.js (window.BEATS, file-local seconds), qc/beat_map.md and
qc/audio_durations.txt. Scenes add TL[key][0] to get absolute time.
"""
import json, os, subprocess, sys
import numpy as np

SR = 48000
EP = sys.argv[1]
PH = json.load(open(os.path.join(EP, "tools", "phrases.json")))
TLF = os.path.join(EP, json.load(open(os.path.join(EP, "episode.json"))).get("build_dir", "build"), "timeline.json")


def decode(p):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", p, "-f", "f32le", "-ac", "1", "-ar", str(SR), "-"],
                         capture_output=True, check=True).stdout
    return np.frombuffer(raw, np.float32).astype(np.float64)


def runs(a):
    w = int(.02 * SR)
    rms = np.sqrt(np.convolve(a ** 2, np.ones(w) / w, "same"))
    v = rms > 10 ** (-38 / 20)
    e = np.flatnonzero(np.diff(v.astype(int)))
    st = [i / SR for i in e if v[i + 1]]
    en = [i / SR for i in e if not v[i + 1]]
    if v[0]: st = [0.0] + st
    if v[-1]: en = en + [len(a) / SR]
    out = []
    for s, t in zip(st, en):
        if out and s - out[-1][1] < .12: out[-1][1] = t
        else: out.append([s, t])
    return [[round(s, 3), round(t, 3)] for s, t in out if t - s > .04]


beats, dur, md = {}, {}, ["# EP19 beat map (measured from the narration)", "",
                          "Voiced runs: 20 ms RMS above −38 dBFS, gaps < 120 ms merged. Times are seconds from the start of each file;",
                          "**abs** is the time in the final video (frame = abs × 30). Labels are the approved transcript phrases.", ""]
tl = json.load(open(TLF)) if os.path.exists(TLF) else {}
for key, spec in PH.items():
    path = os.path.join(EP, spec["file"])
    a = decode(path)
    r = runs(a)
    if len(r) != len(spec["runs"]):
        sys.exit(f"{spec['file']}: {len(r)} voiced runs measured, transcript expects {len(spec['runs'])} — check the audio")
    beats[key] = [[s, t, lab] for (s, t), lab in zip(r, spec["runs"])]
    dur[key] = len(a) / SR
    off = tl.get(key, [None])[0]
    md += [f"## {key} — `{spec['file']}` ({dur[key]:.3f} s" + (f", starts at {off:.3f} s / frame {round(off * 30)}" if off is not None else "") + ")", "",
           "| # | start | end | abs start | frame | phrase |", "|--:|--:|--:|--:|--:|---|"]
    for i, (s, t, lab) in enumerate(beats[key]):
        ab = f"{off + s:.3f}" if off is not None else "—"
        fr = str(round((off + s) * 30)) if off is not None else "—"
        md.append(f"| {i} | {s:.3f} | {t:.3f} | {ab} | {fr} | {lab} |")
    md.append("")
open(os.path.join(EP, "source", "beats.js"), "w").write("window.BEATS=" + json.dumps(beats, ensure_ascii=False) + ";\n")
os.makedirs(os.path.join(EP, "qc"), exist_ok=True)
open(os.path.join(EP, "qc", "beat_map.md"), "w").write("\n".join(md) + "\n")
lines = ["EP19 narration durations (ffprobe container duration / decoded PCM length at 48 kHz)", ""]
for key, spec in PH.items():
    p = os.path.join(EP, spec["file"])
    fp = subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", p], capture_output=True, text=True).stdout.strip()
    lines.append(f"{os.path.basename(p):22s} ffprobe {float(fp):8.3f} s   decoded {dur[key]:8.3f} s   frames@30 {dur[key] * 30:7.1f}")
lines.append(f"{'TOTAL narration':22s}         {sum(dur.values()):8.3f} s")
if tl: lines.append(f"{'TOTAL video':22s}         {tl['end']:8.3f} s   ({round(tl['end'] * 30)} frames incl. gaps, 150-frame countdown, end hold)")
open(os.path.join(EP, "qc", "audio_durations.txt"), "w").write("\n".join(lines) + "\n")
print("beats ok:", {k: len(v) for k, v in beats.items()})
