#!/usr/bin/env bash
# EP20 QC on a rendered MP4: frame 0 still, contact sheet (1 frame / s), stream specs, loudness, start/black-frame check.
# usage: EP20/tools/qc_video.sh <mp4>   (writes into EP20/qc/)
set -euo pipefail
V="$1"; Q="$(cd "$(dirname "$0")/.." && pwd)/qc"; mkdir -p "$Q"
ffmpeg -v error -y -i "$V" -vf "select=eq(n\,0)" -frames:v 1 "$Q/frame_0001.png"
ffmpeg -v error -y -i "$V" -vf "fps=1,scale=180:320,tile=12x11:padding=4:color=black" -frames:v 1 "$Q/contact_sheet.png"
ffprobe -v error -show_entries stream=codec_name,profile,width,height,pix_fmt,r_frame_rate,avg_frame_rate,nb_frames,sample_rate,channels,bit_rate:format=duration,bit_rate -of default=nw=1 "$V" > "$Q/ffprobe.txt"
ffmpeg -hide_banner -i "$V" -af ebur128=peak=true -f null - 2>&1 | sed -n '/Summary/,$p' > "$Q/loudness.txt"
ffmpeg -hide_banner -i "$V" -t 3 -vf blackdetect=d=0.03:pix_th=0.10 -an -f null - 2>&1 | grep -E "blackdetect" > "$Q/blackdetect_start.txt" || echo "no black frames in the first 3 s" > "$Q/blackdetect_start.txt"
cat "$Q/ffprobe.txt" "$Q/loudness.txt" "$Q/blackdetect_start.txt"
