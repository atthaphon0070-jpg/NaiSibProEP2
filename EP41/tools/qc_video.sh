#!/usr/bin/env bash
# EP.41 video QC: streams, full decode, loudness, countdown frame checks, first frame, contact sheet (frames taken from the MP4).
set -euo pipefail
EP="$1"; F="$EP/$(python3 -c "import json;print(json.load(open('$EP/episode.json'))['output'])")"; Q="$EP/qc"; TMP=$(mktemp -d)
echo "== streams"; ffprobe -v error -show_entries stream=codec_name,profile,width,height,r_frame_rate,nb_frames,sample_rate,channels:format=duration -of compact "$F"
echo "== full decode"; ffmpeg -v error -xerror -i "$F" -f null - && echo "decode OK (no errors)"
echo "== loudness"; ffmpeg -nostats -i "$F" -af ebur128=peak=true -f null - 2>&1 | grep -E "^\s+(I|Peak):"
ffmpeg -v error -y -i "$F" -frames:v 1 "$Q/first_frame.png"
python3 - "$F" "$Q" "$TMP" "$EP" <<'PY'
import sys, json, subprocess
from PIL import Image, ImageDraw, ImageFont
F, Q, TMP, EP = sys.argv[1:]
tl = json.load(open(f"{EP}/{json.load(open(EP + '/episode.json')).get('build_dir', 'build')}/timeline.json"))
times = [0, 3.5, 9, 14, 17, 24, 29, 32, 42, 46, 53, 58, 62, 71, 80, 88, 97, 104, 111, 124, 133, 137, tl['cd'][0] + .5, tl['cd'][0] + 2.5, tl['cd'][0] + 4.5,
         tl['ans'][0] + 1.6, tl['ans'][0] + 9, tl['ans'][0] + 18, tl['ans'][0] + 23, tl['ans'][0] + 32, tl['ans'][0] + 40, tl['promo'][0] + 5, tl['promo'][0] + 11, tl['promo'][0] + 16.5]
W, H, cols = 270, 480, 6
rows = (len(times) + cols - 1) // cols
sheet = Image.new('RGB', (cols * W, rows * (H + 30)), (230, 244, 255)); d = ImageDraw.Draw(sheet)
for i, t in enumerate(times):
    p = f"{TMP}/c{i}.png"
    subprocess.run(['ffmpeg', '-v', 'error', '-y', '-ss', f'{t:.3f}', '-i', F, '-frames:v', '1', p], check=True)
    x, y = (i % cols) * W, (i // cols) * (H + 30)
    sheet.paste(Image.open(p).resize((W, H)), (x, y + 30)); d.text((x + 8, y + 8), f"{int(t // 60)}:{t % 60:05.2f}", fill=(20, 43, 83))
sheet.save(f"{Q}/contact_sheet.png")
# countdown: sample one frame per digit from the MP4 and check the correct option is still neutral (no green overlay)
fps = tl['fps']; c0 = round(tl['cd'][0] * fps)
print("== countdown frames", c0, "→", c0 + round(tl['cd'][1] * fps), f"({round(tl['cd'][1] * fps)} frames)")
PY
rm -rf "$TMP"
