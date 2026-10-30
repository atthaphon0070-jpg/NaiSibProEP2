#!/usr/bin/env bash
# EP30 checks on the exported MP4 itself: stream info, full decode, black frames, loudness, A/V duration,
# first frame, countdown boundary frames and a contact sheet. usage: EP30/tools/qc_video.sh
set -uo pipefail
EP="$(cd "$(dirname "$0")/.." && pwd)"; V="$EP/output/NaiSibPro_EP30_Probability_Without_Replacement.mp4"; Q="$EP/qc"
{
echo "== ffprobe"; ffprobe -v error -show_entries format=duration,size,bit_rate:stream=index,codec_name,profile,width,height,pix_fmt,r_frame_rate,avg_frame_rate,nb_frames,sample_rate,channels,duration -of default=nw=1 "$V"
echo; echo "== full decode (errors listed below, empty = none)"; ffmpeg -v error -i "$V" -f null - 2>&1 | head -20
echo; echo "== decoded video frames"; ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of default=nw=1 "$V"
echo; echo "== black frames (blackdetect d>=0.1 s, pix_th 0.10; empty = none)"; ffmpeg -v info -i "$V" -vf blackdetect=d=0.1:pix_th=0.10 -an -f null - 2>&1 | grep -o "black_start.*" | head
echo; echo "== loudness (EBU R128)"; ffmpeg -nostats -i "$V" -vn -af ebur128=peak=true -f null - 2>&1 | grep -A20 "Summary:" | grep -E "I:|LRA:|Peak:"
echo; echo "== silence during the countdown 195.333–200.333 s (narration-free check, volumedetect on that span)"; ffmpeg -v info -ss 195.36 -t 4.94 -i "$V" -vn -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
echo "== same measure on a spoken span for comparison (quiz 170–174 s)"; ffmpeg -v info -ss 170 -t 4 -i "$V" -vn -af volumedetect -f null - 2>&1 | grep -E "mean_volume|max_volume"
} > "$Q/video_checks.txt" 2>&1
ffmpeg -v error -y -i "$V" -vf "select=eq(n\,0)" -frames:v 1 "$Q/frame_0001.png"
ffmpeg -v error -y -i "$V" -vf "select='eq(n\,5859)+eq(n\,5860)+eq(n\,5889)+eq(n\,5890)+eq(n\,5919)+eq(n\,5920)+eq(n\,5949)+eq(n\,5950)+eq(n\,5979)+eq(n\,5980)+eq(n\,6009)+eq(n\,6010)',scale=270:480,tile=6x2" -vsync 0 -frames:v 1 "$Q/countdown_frames.jpg"
ffmpeg -v error -y -i "$V" -vf "fps=1/5,scale=216:384,tile=10x6:padding=4:color=white" -frames:v 1 "$Q/contact_sheet.png"
cat "$Q/video_checks.txt"
