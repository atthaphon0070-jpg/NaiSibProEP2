"""EP19 final-file QC: everything here is measured on the FINAL MP4 (not on the page or a preview).

usage: python3 EP19/tools/qc_final.py EP19
Writes qc/final_qc.json, qc/frame_0001.png (frame index 0), qc/contact_sheet.png (1 frame per second),
qc/countdown_frames.png (first / last frame of every countdown number and the first answer frame).
"""
import json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

EP = sys.argv[1]
CFG = json.load(open(os.path.join(EP, "episode.json")))
MP4 = os.path.join(EP, CFG["output"])
TL = json.load(open(os.path.join(EP, CFG.get("build_dir", "build"), "timeline.json")))
QC = os.path.join(EP, "qc")
FPS = TL["fps"]
run = lambda *a: subprocess.run(a, capture_output=True, text=True)
res = {}

# ---- container / stream spec ----
pr = json.loads(run("ffprobe", "-v", "error", "-show_streams", "-show_format", "-of", "json", MP4).stdout)
v = next(s for s in pr["streams"] if s["codec_type"] == "video"); a = next(s for s in pr["streams"] if s["codec_type"] == "audio")
res["video"] = {k: v.get(k) for k in ("codec_name", "profile", "width", "height", "pix_fmt", "r_frame_rate", "avg_frame_rate", "nb_frames", "duration")}
res["audio"] = {k: a.get(k) for k in ("codec_name", "sample_rate", "channels", "bit_rate", "duration")}
res["format_duration"] = float(pr["format"]["duration"])
exp_frames = int(np.ceil(TL["end"] * FPS))
res["spec_ok"] = (v["codec_name"] == "h264" and v["profile"] == "High" and v["width"] == 1080 and v["height"] == 1920 and v["pix_fmt"] == "yuv420p"
                  and v["r_frame_rate"] == "30/1" and v["avg_frame_rate"] == "30/1" and abs(int(v["nb_frames"]) - exp_frames) <= 1   # shared builder muxes with -shortest: last frame may drop when audio ends <1 frame early
                  and a["codec_name"] == "aac" and a["sample_rate"] == "48000" and a["channels"] == 2)
res["expected_frames"] = exp_frames
res["av_duration_diff_s"] = round(abs(float(v["duration"]) - float(a["duration"])), 3)


def frame(i):
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", MP4, "-vf", f"select=eq(n\\,{i})", "-vsync", "0", "-frames:v", "1", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"],
                         capture_output=True, check=True).stdout
    return Image.frombytes("RGB", (1080, 1920), raw)


# ---- frame index 0 (first-frame hook rule) ----
f0 = frame(0); f0.save(os.path.join(QC, "frame_0001.png"))
arr = np.asarray(f0).astype(int)
yellow = (arr[..., 0] > 200) & (arr[..., 1] > 170) & (arr[..., 2] < 120)          # #FFD23F keyword pixels
ys, xs = np.nonzero(yellow[250:700]); ys = ys + 250
res["frame0"] = {"mean_luma": round(float(arr.mean()), 1), "keyword_yellow_px": int(yellow[250:700].sum()),
                 "keyword_bbox": [int(xs.min()), int(ys.min()), int(xs.max()), int(ys.max())] if len(xs) else None}
res["frame0_ok"] = res["frame0"]["keyword_yellow_px"] > 20000 and res["frame0"]["mean_luma"] > 15
bd = run("ffmpeg", "-v", "info", "-i", MP4, "-t", "2", "-vf", "blackdetect=d=0.03:pix_th=0.10", "-an", "-f", "null", "-").stderr
res["black_at_start"] = "black_start" in bd

# ---- countdown frames: 5 numbers x 30 frames, answer starts at frame 150 ----
c0 = round(TL["cd"][0] * FPS); a0 = round(TL["ans"][0] * FPS)
res["countdown"] = {"first_frame": c0, "frames": a0 - c0, "answer_first_frame": a0, "quiz_audio_end_frame": round((TL["quiz"][0] + TL["quiz"][1]) * FPS, 2)}
res["countdown_ok"] = a0 - c0 == 150
picks = [c0 - 1, c0, c0 + 29, c0 + 30, c0 + 59, c0 + 60, c0 + 89, c0 + 90, c0 + 119, c0 + 120, c0 + 149, a0]
sel = "+".join(f"eq(n\\,{i})" for i in picks)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", MP4, "-vf", f"select='{sel}'", "-vsync", "0", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
ims = np.frombuffer(raw, np.uint8).reshape(-1, 1920, 1080, 3)
sheet = Image.new("RGB", (6 * 270, 2 * 320), "black"); d = ImageDraw.Draw(sheet)
for k, (i, im) in enumerate(zip(picks, ims)):
    sheet.paste(Image.fromarray(im).crop((0, 280, 1080, 1440)).resize((270, 290)), (270 * (k % 6), 320 * (k // 6))); d.text((270 * (k % 6) + 6, 320 * (k // 6) + 296), f"frame {i} (cd+{i - c0})", fill="white")
sheet.save(os.path.join(QC, "countdown_frames.png"))

# ---- 1 fps contact sheet + static-stretch scan (all frames, 1/8 scale) ----
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", MP4, "-vf", "scale=135:240", "-f", "rawvideo", "-pix_fmt", "gray", "-"], capture_output=True, check=True).stdout
g = np.frombuffer(raw, np.uint8).reshape(-1, 240, 135).astype(np.int16)
diff = np.abs(np.diff(g, axis=0)).mean(axis=(1, 2))
still = diff < 0.15                                   # practically identical consecutive frames
best, cur, at = 0, 0, 0
for i, s in enumerate(still):
    cur = cur + 1 if s else 0
    if cur > best: best, at = cur, i - cur + 1
res["longest_static_run"] = {"frames": int(best), "seconds": round(best / FPS, 2), "from_frame": int(at)}
res["static_ok"] = best / FPS <= 2.5
n = len(g); secs = int(n // FPS) + 1; cols = 15; rows = (secs + cols - 1) // cols
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", MP4, "-vf", f"select=not(mod(n\\,{FPS})),scale=144:256", "-vsync", "0", "-f", "rawvideo", "-pix_fmt", "rgb24", "-"], capture_output=True, check=True).stdout
thumbs = np.frombuffer(raw, np.uint8).reshape(-1, 256, 144, 3)
cs = Image.new("RGB", (cols * 144, rows * 272), "black"); d = ImageDraw.Draw(cs)
for s, th in enumerate(thumbs):
    cs.paste(Image.fromarray(th), (144 * (s % cols), 272 * (s // cols))); d.text((144 * (s % cols) + 4, 272 * (s // cols) + 257), f"{s:3d}s", fill="white")
cs.save(os.path.join(QC, "contact_sheet.png"))

# ---- loudness / peaks ----
eb = run("ffmpeg", "-nostats", "-i", MP4, "-af", "ebur128=peak=true", "-f", "null", "-").stderr
summ = eb[eb.rfind("Summary"):]
grab = lambda key: float(summ.split(key)[1].split()[0])
res["loudness"] = {"integrated_lufs": grab("I:"), "lra_lu": grab("LRA:"), "true_peak_dbfs": grab("Peak:")}
vd = run("ffmpeg", "-i", MP4, "-af", "volumedetect", "-f", "null", "-").stderr
res["loudness"]["max_volume_db"] = float(vd.split("max_volume:")[1].split()[0])
res["loudness_ok"] = -17.5 <= res["loudness"]["integrated_lufs"] <= -14.5 and res["loudness"]["true_peak_dbfs"] < -0.5

res["all_ok"] = all(res[k] for k in ("spec_ok", "frame0_ok", "countdown_ok", "static_ok", "loudness_ok")) and not res["black_at_start"] and res["av_duration_diff_s"] < 0.05
json.dump(res, open(os.path.join(QC, "final_qc.json"), "w"), indent=1)
print(json.dumps(res, indent=1))
if not res["all_ok"]: sys.exit(1)
