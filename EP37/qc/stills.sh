#!/usr/bin/env bash
# usage: EP37/qc/stills.sh <outdir> t1,t2,...   (renders stills at the given seconds)
ROOT="$(cd "$(dirname "$0")/../.." && pwd)"
node "$ROOT/shared/tools/render.js" "$ROOT/EP37" stills "$1" "$2"
