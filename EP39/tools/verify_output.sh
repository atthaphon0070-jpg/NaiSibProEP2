#!/usr/bin/env bash
# usage: EP39/tools/verify_output.sh  -> inspects the final MP4, writes qc/media_probe.json, qc/first_frame.png,
#        qc/contact_sheet.png, qc/countdown_frames.png, qc/mobile_sim.png
set -euo pipefail
EP="$(cd "$(dirname "$0")/.." && pwd)"; cd "$EP"
OUT="$(python3 -c "import json;print(json.load(open('episode.json'))['output'])")"
ffprobe -v error -print_format json -show_format -show_streams -count_frames "$OUT" > qc/media_probe.json
ffmpeg -v error -y -i "$OUT" -vf "select=eq(n\,0)" -vframes 1 qc/first_frame.png
# contact sheet: one frame every 6 s, 6 × 6 grid
ffmpeg -v error -y -i "$OUT" -vf "fps=1/6,scale=240:-1,tile=6x6:padding=4:color=0x0B1B3A" -frames:v 1 qc/contact_sheet.png
# countdown boundaries: last pre-count frame, first frame of each numeral, first answer frame
CD=$(python3 -c "import json;print(round(json.load(open('renders/timeline.json'))['cd'][0]*30))")
SEL=$(python3 -c "c=$CD;print('+'.join(f'eq(n\\\\,{f})' for f in [c-1,c,c+29,c+30,c+60,c+90,c+120,c+149,c+150]))")
ffmpeg -v error -y -i "$OUT" -vf "select='$SEL',scale=216:-1,tile=9x1:padding=4:color=0x0B1B3A" -vsync 0 -frames:v 1 qc/countdown_frames.png
python3 - "$OUT" <<'PY'
import json,sys,subprocess,numpy as np
p=json.load(open('qc/media_probe.json')); v=[s for s in p['streams'] if s['codec_type']=='video'][0]; a=[s for s in p['streams'] if s['codec_type']=='audio'][0]
tl=json.load(open('renders/timeline.json'))
raw=subprocess.run(['ffmpeg','-v','error','-i',sys.argv[1],'-f','f32le','-ac','1','-ar','48000','-'],capture_output=True).stdout
x=np.frombuffer(raw,np.float32); sr=48000
def rms(a,b): s=x[int(a*sr):int(b*sr)]; return float(20*np.log10(np.sqrt(np.mean(s**2))+1e-9))
n0=np.load('renders/narration.npy')
cd0=tl['cd'][0]
res={'codec':v['codec_name'],'profile':v.get('profile'),'pix_fmt':v['pix_fmt'],'size':f"{v['width']}x{v['height']}",'fps':v['r_frame_rate'],'frames':int(v['nb_read_frames']),
 'video_duration':float(v['duration']),'audio_codec':a['codec_name'],'audio_rate':a['sample_rate'],'audio_channels':a['channels'],'container_duration':float(p['format']['duration']),
 'expected_frames':int(-(-tl['end']*30//1)),'countdown_narration_peak':float(np.max(np.abs(n0[int(cd0*sr):int((cd0+5)*sr)]))),
 'mix_rms_db':{'countdown':rms(cd0+.2,cd0+4.8),'answer_first_3s':rms(tl['ans'][0],tl['ans'][0]+3)}}
json.dump(res,open('qc/media_summary.json','w'),indent=1); print(json.dumps(res,indent=1))
PY
# phone simulation: three moving frames fit-to-height cropped to each phone, with modelled overlays shaded
python3 - "$OUT" <<'PY'
import sys,subprocess,json
from PIL import Image,ImageDraw
rep=json.load(open('qc/safe_zone_report.json'))
times=[3.0,52.0,120.0,160.0]
tiles=[]
for t in times:
    subprocess.run(['ffmpeg','-v','error','-y','-ss',str(t),'-i',sys.argv[1],'-frames:v','1','/tmp/_f.png'],check=True)
    fr=Image.open('/tmp/_f.png').convert('RGB')
    for ph,(pf,ov) in zip(rep['phones'],rep['overlaysModelled'].items()):
        im=fr.copy(); d=ImageDraw.Draw(im,'RGBA')
        for o in ov: d.rectangle([o['x0'],o['y0'],o['x1'],o['y1']],fill=(255,60,60,70))
        z=rep['zone']; d.rectangle([z['x0'],z['y0'],z['x1'],z['y1']],outline=(255,210,63,255),width=4)
        x0,x1=ph['visibleX']; im=im.crop((int(x0),0,int(x1),1920))
        w,hh=map(int,ph['screen'].split('x')); im=im.resize((w,hh))
        d=ImageDraw.Draw(im); d.text((6,6),f"{ph['screen']} {pf} t={t}",fill=(255,255,0))
        tiles.append(im)
W=sum(t.width for t in tiles[:3])+20; H=max(t.height for t in tiles)
sheet=Image.new('RGB',(W,H*len(times)+10*len(times)),(11,27,58))
for i,tile in enumerate(tiles):
    r,c=divmod(i,3); sheet.paste(tile,(c*(tiles[0].width+10) if c<2 else W-tile.width, r*(H+10)))
sheet.save('qc/mobile_sim.png')
PY
echo verified
