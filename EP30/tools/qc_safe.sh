#!/usr/bin/env bash
# Runs the per-frame safe-zone check over the whole timeline in parallel and merges EP30/qc/safe_zone_report.json
set -euo pipefail
EP="$(cd "$(dirname "$0")/.." && pwd)"; TMP="$EP/renders/qc_safe"; mkdir -p "$TMP"; rm -f "$TMP"/*.json
N=$(python3 -c "import json,math;t=json.load(open('$EP/renders/timeline.json'));print(math.ceil(t['end']*t['fps']))")
W=${WORKERS:-4}; Q=$(( (N + W - 1) / W ))
for i in $(seq 0 $((W-1))); do s=$((i*Q)); e=$(( (i+1)*Q < N ? (i+1)*Q : N )); node "$EP/tools/qc_safe.js" $s $e "$TMP/part$i.json" & done; wait
python3 - "$TMP" "$EP/qc/safe_zone_report.json" "$N" <<'PY'
import json, sys, glob
parts = [json.load(open(f)) for f in sorted(glob.glob(sys.argv[1] + '/part*.json'))]
v = {}
for p in parts:
    for x in p['violations']:
        y = v.setdefault(x['el'], dict(x)) if x['el'] not in v else v[x['el']]
        if y is not x:
            y['frames'] += x['frames']; y['first'] = min(y['first'], x['first']); y['last'] = max(y['last'], x['last'])
            if x['maxOver'] > y['maxOver']: y.update(maxOver=x['maxOver'], rect=x['rect'], opacity=x['opacity'], at=x['at'])
ext = {k: (min if k in 'lt' else max)(p['extent'][k] for p in parts) for k in 'lrtb'}
mf = min((p['minFont'] for p in parts), key=lambda m: m['px'])
fonts = {}
for p in parts:
    for k, x in p['fonts'].items(): fonts[k] = min(x, fonts.get(k, 1e9))
small = sorted(fonts.items(), key=lambda kv: kv[1])[:15]
hits = {}
for p in parts:
    for x in p['simHits']:
        k = (x['sim'], x['el'], x['kind'])
        if k in hits: hits[k]['frames'] += x['frames']
        else: hits[k] = dict(x)
rep = {'zone': {'left': 220, 'right': 860, 'top': 350, 'bottom': 1430, 'canvas': [1080, 1920]},
       'method': 'Every frame (30 fps) of the full timeline is rendered in headless Chromium; every critical element (class "sz") whose effective opacity is >= 0.15 has its on-screen bounding box measured (getBoundingClientRect, includes scale/translate). Any box edge beyond the zone by more than 0.5 px is a violation.',
       'frames_checked': int(sys.argv[3]), 'element_checks': sum(p['checks'] for p in parts),
       'critical_extent': {k: round(x, 1) for k, x in ext.items()}, 'smallest_fully_visible_critical_text': mf, 'smallest_15_critical_labels_px': small, 'critical_labels_measured': len(fonts),
       'violations': sorted(v.values(), key=lambda x: -x['frames']), 'unresolved_critical_violations': len(v),
       'device_platform_simulation': {'method': 'Glyph boxes (DOM Range rects) of every active critical text node, every 2nd frame, tested against each simulated phone (cover = centre-crop fill, fit = aspect-fit) and generic TikTok / Reels / Shorts-style overlay regions mapped back to source pixels. A hit = text cropped off-screen or under a UI region.', 'simulations': parts[0]['sims'], 'hits': sorted(hits.values(), key=lambda x: -x['frames']), 'unresolved_hits': len(hits)}}
json.dump(rep, open(sys.argv[2], 'w'), ensure_ascii=False, indent=1)
print('frames', rep['frames_checked'], 'checks', rep['element_checks'], 'violations', len(v), 'extent', rep['critical_extent'], 'minFont', mf)
print('smallest:', small)
print('sim hits', len(hits))
for x in sorted(hits.values(), key=lambda x: -x['frames'])[:40]: print('  SIM', x['frames'], x['sim'], x['kind'], x['at'], x['rect'], x['el'])
for x in rep['violations'][:40]: print(' ', x['frames'], 'f', x['first'], '-', x['last'], 'over', x['maxOver'], x['rect'], x['opacity'], x['el'])
PY
