#!/usr/bin/env bash
# EP.34 build: measure the narration, derive Box's lip-sync envelope, then run the shared NaiSibPro build.
# usage: EP34/build.sh [--preview]
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
python3 "$ROOT/shared/tools/audio_prep.py" "$ROOT/EP34" >/dev/null
python3 "$ROOT/EP34/tools/voice_env.py" "$ROOT/EP34"
"$ROOT/shared/tools/build_episode.sh" EP34 "${1:-}"
