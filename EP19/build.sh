#!/usr/bin/env bash
# NaiSibPro EP19 one-command build.   usage: EP19/build.sh [--preview]
#   1. audio-first timeline (shared/tools/audio_prep.py, 9-frame gaps, exact 150-frame countdown)
#   2. beat map from the real narration (tools/beatmap.py -> source/beats.js, qc/beat_map.md, qc/audio_durations.txt)
#   3. layout QC on the live page (tools/qc_layout.js: safe zone, overlaps, font sizes)
#   4. frames + mix + MP4 via the shared builder (shared/tools/build_episode.sh)
#   5. final-file QC (tools/qc_final.py) unless --preview
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"; cd "$ROOT"
python3 shared/tools/audio_prep.py EP19 >/dev/null
python3 EP19/tools/beatmap.py EP19
node EP19/tools/qc_layout.js EP19 1
WORKERS="${WORKERS:-4}" shared/tools/build_episode.sh EP19 ${1:-}
if [ "${1:-}" = "--preview" ]; then
  ffmpeg -v error -y -i EP19/renders/preview.mp4 -vf scale=540:960 -c:v libx264 -crf 26 -c:a aac -b:a 128k EP19/renders/preview_540.mp4
  echo "preview -> EP19/renders/preview.mp4 (+ preview_540.mp4)"
else
  python3 EP19/tools/qc_final.py EP19
fi
