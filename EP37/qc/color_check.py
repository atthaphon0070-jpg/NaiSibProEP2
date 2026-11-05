"""EP.37 colour-dominance check on the rendered MP4 (1 frame/s, 270x480).
usage: python3 EP37/qc/color_check.py <video.mp4> > EP37/qc/color_report.json
Counts saturated pixels (S > 0.25, V > 0.15) by hue family. Blue family = navy/electric/cyan/sky (hue 180–255°),
pink family = hue 300–350°. Percentages are of saturated pixels (greys/whites excluded)."""
import sys, json, subprocess, numpy as np
W, H = 270, 480
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", sys.argv[1], "-vf", f"fps=1,scale={W}:{H}", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
fr = np.frombuffer(raw, np.uint8).reshape(-1, H, W, 3).astype(np.float32) / 255
mx, mn = fr.max(-1), fr.min(-1); d = mx - mn
s = np.where(mx > 0, d / np.maximum(mx, 1e-6), 0)
r, g, b = fr[..., 0], fr[..., 1], fr[..., 2]
hue = np.where(mx == r, (g - b) / np.maximum(d, 1e-6) % 6, np.where(mx == g, (b - r) / np.maximum(d, 1e-6) + 2, (r - g) / np.maximum(d, 1e-6) + 4)) * 60
sat = (s > .25) & (mx > .15)
fam = {"blue_cyan_navy": (hue >= 180) & (hue < 255), "violet": (hue >= 255) & (hue < 300), "pink": (hue >= 300) & (hue < 350),
       "red": (hue >= 350) | (hue < 15), "orange_yellow": (hue >= 15) & (hue < 70), "green": (hue >= 70) & (hue < 180)}
tot = sat.sum()
overall = {k: round(float((m & sat).sum() / tot * 100), 2) for k, m in fam.items()}
per = [round(float((fam["blue_cyan_navy"][i] & sat[i]).sum() / max(1, sat[i].sum()) * 100), 1) for i in range(len(fr))]
pinkper = [round(float((fam["pink"][i] & sat[i]).sum() / max(1, sat[i].sum()) * 100), 1) for i in range(len(fr))]
print(json.dumps({"frames_sampled": len(fr), "saturated_pixel_share_pct": overall,
                  "frames_where_blue_is_dominant_family": int(sum(1 for i in range(len(fr)) if per[i] == max(per[i], pinkper[i]) and per[i] > 50)),
                  "min_blue_share_any_frame_pct": min(per), "max_pink_share_any_frame_pct": max(pinkper), "blue_share_per_second": per}, indent=1))
