#!/usr/bin/env bash
# usage: tools/stills.sh <outdir> <seg:local,local,...> ...   renders stills at TL[seg][0]+local and a labelled contact sheet
set -euo pipefail
EP="$(cd "$(dirname "$0")/.." && pwd)"; OUT="$1"; shift
TS=$(python3 -c "
import json,sys; tl=json.load(open('$EP/renders/timeline.json')); r=[]
for a in sys.argv[1:]:
    k,v=a.split(':'); r+= [round(tl[k][0]+float(x),3) for x in v.split(',')]
print(','.join(str(x) for x in r))" "$@")
rm -rf "$OUT"; node "$EP/../shared/tools/render.js" "$EP" stills "$OUT" "$TS"
python3 "$EP/tools/contact.py" "$OUT" "$OUT/sheet.jpg"
