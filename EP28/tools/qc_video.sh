#!/usr/bin/env bash
# EP28 media QC on the rendered MP4 → EP28/qc/. usage: EP28/tools/qc_video.sh [mp4]
set -euo pipefail
EP="$(cd "$(dirname "$0")/.." && pwd)"; V="${1:-$EP/output/NaiSibPro_EP28_Network_Topology.mp4}"; Q="$EP/qc"; mkdir -p "$Q/phone" "$Q/tmp"
ffprobe -v error -show_entries stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,avg_frame_rate,nb_frames,sample_rate,channels:format=duration,bit_rate,size -of default=nw=1 "$V" > "$Q/ffprobe.txt"
ffmpeg -v error -y -i "$V" -vf "select=eq(n\,0)" -frames:v 1 "$Q/frame_0001.png"
ffmpeg -v error -y -i "$V" -vf "fps=1/3,scale=180:320,tile=12x10:padding=4:color=black" -frames:v 1 "$Q/contact_sheet.png"
ffmpeg -v error -i "$V" -f null - 2> "$Q/decode_errors.txt" || true
ffmpeg -hide_banner -i "$V" -vf blackdetect=d=0.05:pix_th=0.08 -an -f null - 2>&1 | grep blackdetect > "$Q/blackdetect.txt" || echo "no black segments" > "$Q/blackdetect.txt"
ffmpeg -hide_banner -i "$V" -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' > "$Q/loudness.txt"
# countdown frames 7735…7888 strip (one tile every 15 frames + both edges)
ffmpeg -v error -y -i "$V" -vf "select='between(n\,7735\,7888)*not(mod(n-7737\,15))+eq(n\,7736)+eq(n\,7886)+eq(n\,7887)',scale=216:384,tile=7x2:padding=4:color=black" -frames:v 1 "$Q/countdown_frames.jpg"
# audio silence during the countdown (narration-free): RMS of 257.95–262.85 s
ffmpeg -hide_banner -ss 257.95 -t 4.9 -i "$V" -af "astats=metadata=0:reset=0" -f null - 2>&1 | grep -E "RMS level|Peak level" | head -3 > "$Q/countdown_audio.txt"
# phone simulations on representative frames
rm -f "$Q/tmp/"*.png
for s in 0 15 82 98 122 136 148 168 186 192 205 219 250 260 264 300 328 352 360; do ffmpeg -v error -y -ss $s -i "$V" -frames:v 1 "$Q/tmp/f_$(printf %05.1f $s).png"; done
python3 "$EP/tools/phone_sim.py" "$Q/tmp" "$Q/phone" > /dev/null
cat "$Q/ffprobe.txt" "$Q/blackdetect.txt" "$Q/loudness.txt" "$Q/countdown_audio.txt"; echo "decode errors: $(wc -c < "$Q/decode_errors.txt") bytes"
