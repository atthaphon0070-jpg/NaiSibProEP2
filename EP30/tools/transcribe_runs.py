"""EP30 timing-only transcription of each pause-delimited phrase (faster-whisper, Whisper-small CTranslate2 int8).
usage: python3 -I EP30/tools/transcribe_runs.py <model_dir> EP30/tools EP30/audio/0*.mp3
The text is used only to find where each scripted phrase starts; the narration itself is never modified."""
import sys, subprocess, numpy as np
sys.path.insert(0, sys.argv[2])
from segment import runs, decode
from faster_whisper import WhisperModel
m = WhisperModel(sys.argv[1], device="cpu", compute_type="int8", cpu_threads=4)
for f in sys.argv[3:]:
    a = decode(f); r, _ = runs(a, .18, -38)
    print("=====", f, flush=True)
    a16 = a[::3].copy()
    for s, e in r:
        clip = a16[int(max(0, s - .1) * 16000):int((e + .1) * 16000)]
        clip = np.concatenate([clip, np.zeros(8000, np.float32)])
        segs, _ = m.transcribe(clip, language="th", beam_size=5, condition_on_previous_text=False, without_timestamps=True)
        print(f"{s:6.2f}-{e:6.2f}  " + " ".join(x.text.strip() for x in segs), flush=True)
