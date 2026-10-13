#!/usr/bin/env bash
# NaiSibPro episode build (shared, EP03+).  usage: shared/tools/build_episode.sh EP03 [--preview]
# --preview allows missing narration (silent placeholder) and writes <build_dir>/preview.mp4 instead of the final file.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"; EP="$ROOT/$1"; MODE="${2:-}"
T="$ROOT/shared/tools"
BD="$EP/$(python3 -c "import json;print(json.load(open('$EP/episode.json')).get('build_dir','build'))")"
if [ "$MODE" = "--preview" ]; then python3 "$T/audio_prep.py" "$EP" --allow-missing >/dev/null; else python3 "$T/audio_prep.py" "$EP" >/dev/null; fi
node "$T/render.js" "$EP" sfx
python3 "$T/audio_mix.py" "$EP"
FPS=$(python3 -c "import json;print(json.load(open('$BD/timeline.json'))['fps'])")
N=$(python3 -c "import json,math;t=json.load(open('$BD/timeline.json'));print(math.ceil(t['end']*t['fps']))")
W=${WORKERS:-4}; Q=$(( (N + W - 1) / W ))
rm -rf "$BD/frames"
for i in $(seq 0 $((W-1))); do s=$((i*Q)); e=$(( (i+1)*Q < N ? (i+1)*Q : N )); node "$T/render.js" "$EP" frames "$BD/frames" $s $e & done; wait
[ "$(ls "$BD/frames" | wc -l)" -eq "$N" ] || { echo "frame count mismatch"; exit 1; }
if [ "$MODE" = "--preview" ]; then OUT="$BD/preview.mp4"; else OUT="$EP/$(python3 -c "import json;print(json.load(open('$EP/episode.json'))['output'])")"; fi
mkdir -p "$(dirname "$OUT")"
ffmpeg -v error -y -framerate "$FPS" -i "$BD/frames/%05d.jpg" -i "$BD/mix.wav" -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 -r "$FPS" \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$OUT"
echo "done -> $OUT"
