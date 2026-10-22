#!/usr/bin/env bash
# NaiSibPro episode build (shared, EP03+).  usage: shared/tools/build_episode.sh EP03 [--preview]
# --preview allows missing narration (silent placeholder) and writes <build_dir>/preview.mp4 instead of the final file.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"; EP="$ROOT/$1"; MODE="${2:-}"
T="$ROOT/shared/tools"
BD="$EP/$(python3 -c "import json;print(json.load(open('$EP/episode.json')).get('build_dir','build'))")"
if [ "$MODE" = "--preview" ]; then python3 "$T/audio_prep.py" "$EP" --allow-missing >/dev/null; else python3 "$T/audio_prep.py" "$EP" >/dev/null; fi
node "$T/render.js" "$EP" sfx
# optional per-episode mixer (episode.json "mixer": "EP15/tools/score.py"); default is the shared pastel mixer
MIXER=$(python3 -c "import json;print(json.load(open('$EP/episode.json')).get('mixer',''))")
if [ -n "$MIXER" ]; then python3 "$ROOT/$MIXER" "$EP"; else python3 "$T/audio_mix.py" "$EP"; fi
# optional mastering (episode.json "master": {"gain_db": 6, "limit": 0.891}): one uniform gain on the whole mix and a
# lookahead peak limiter, for narration delivered quieter than the series' loudness. No time-stretching, no re-voicing.
MIX="$BD/mix.wav"
MASTER=$(python3 -c "import json;m=json.load(open('$EP/episode.json')).get('master');print(f\"volume={m['gain_db']}dB,alimiter=limit={m.get('limit',0.891)}:attack=3:release=80:level=disabled:latency=1\" if m else '')")
if [ -n "$MASTER" ]; then ffmpeg -v error -y -i "$BD/mix.wav" -af "$MASTER" -ar 48000 -c:a pcm_s16le "$BD/mix_master.wav"; MIX="$BD/mix_master.wav"; fi
FPS=$(python3 -c "import json;print(json.load(open('$BD/timeline.json'))['fps'])")
N=$(python3 -c "import json,math;t=json.load(open('$BD/timeline.json'));print(math.ceil(t['end']*t['fps']))")
W=${WORKERS:-4}; Q=$(( (N + W - 1) / W ))
rm -rf "$BD/frames"
for i in $(seq 0 $((W-1))); do s=$((i*Q)); e=$(( (i+1)*Q < N ? (i+1)*Q : N )); node "$T/render.js" "$EP" frames "$BD/frames" $s $e & done; wait
[ "$(ls "$BD/frames" | wc -l)" -eq "$N" ] || { echo "frame count mismatch"; exit 1; }
if [ "$MODE" = "--preview" ]; then OUT="$BD/preview.mp4"; else OUT="$EP/$(python3 -c "import json;print(json.load(open('$EP/episode.json'))['output'])")"; fi
mkdir -p "$(dirname "$OUT")"
ffmpeg -v error -y -framerate "$FPS" -i "$BD/frames/%05d.jpg" -i "$MIX" -map 0:v -map 1:a \
  -c:v libx264 -preset slow -crf 17 -pix_fmt yuv420p -profile:v high -level 4.2 -r "$FPS" \
  -c:a aac -b:a 192k -ar 48000 -shortest -movflags +faststart "$OUT"
echo "done -> $OUT"
