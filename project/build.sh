#!/usr/bin/env bash
# Rebuilds NaiSibPro_EP02_Excel_Shortcuts.mp4 from the assets in this folder.
# Needs: ffmpeg, python3 + numpy, node + playwright (Chromium).
set -euo pipefail
cd "$(dirname "$0")"
python3 audio_prep.py assets/audio .            # real audio durations -> timeline.json / public/timeline.js
node render.js . sfx                            # SFX cue list from the animation timeline
python3 audio_mix.py                            # narration + 5 s silent countdown + music + SFX -> mix.wav
N=$(python3 -c "import json,math;print(math.ceil(json.load(open('timeline.json'))['end']*30))")
Q=$(( (N + 3) / 4 ))
rm -rf frames
for i in 0 1 2 3; do s=$((i*Q)); e=$(( (i+1)*Q < N ? (i+1)*Q : N )); node render.js frames frames $s $e & done; wait
ffmpeg -v error -y -framerate 30 -i frames/%05d.jpg -i mix.wav -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 -r 30 \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart ../NaiSibPro_EP02_Excel_Shortcuts.mp4
echo "done -> ../NaiSibPro_EP02_Excel_Shortcuts.mp4"
