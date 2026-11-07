import sys,subprocess,numpy as np
SR=16000
for p in sys.argv[1:]:
    a=np.frombuffer(subprocess.run(["ffmpeg","-v","error","-i",p,"-f","f32le","-ac","1","-ar",str(SR),"-"],capture_output=True).stdout,np.float32)
    w=int(.02*SR); rms=np.sqrt(np.convolve(a.astype(float)**2,np.ones(w)/w,"same"))
    v=rms>10**(-38/20)
    # segments
    segs=[];i=0;n=len(v)
    idx=np.flatnonzero(np.diff(v.astype(int)))+1
    b=[0]+list(idx)+[n]
    for s,e in zip(b[:-1],b[1:]):
        if v[s]: segs.append([s/SR,e/SR])
    # merge gaps <0.12
    m=[]
    for s,e in segs:
        if m and s-m[-1][1]<0.12: m[-1][1]=e
        else: m.append([s,e])
    print("==",p.split('/')[-1],"dur %.3f"%(len(a)/SR))
    print("  ".join("%.2f-%.2f"%(s,e) for s,e in m))
