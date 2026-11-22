"""Process offline Kokoro into character voices and 24Hz lip envelopes."""
import json, os, sys
from pathlib import Path
import numpy as np
import soundfile as sf
from scipy.signal import lfilter
HERE=Path(__file__).resolve().parent
SR=48000
L=json.loads((HERE/"lines.json").read_text())
RAW=HERE/"out"/"raw"; VO=HERE/"voices"; VO.mkdir(parents=True,exist_ok=True)
def peq(x,f,gain_db,q=.9):
    A=10**(gain_db/40); w=2*np.pi*f/SR; al=np.sin(w)/(2*q)
    b=np.array([1+al*A,-2*np.cos(w),1-al*A]); a=np.array([1+al/A,-2*np.cos(w),1-al/A])
    return lfilter(b/a[0],a/a[0],x)
dur={}; lips={}
for line in L:
    y,sr=sf.read(RAW/(line["id"]+".wav"))
    if y.ndim>1:y=y.mean(1)
    if sr!=SR:
        from scipy.signal import resample_poly
        from math import gcd
        g=gcd(sr,SR);y=resample_poly(y,SR//g,sr//g)
    y=np.asarray(y,dtype=np.float64)
    peak=max(np.max(np.abs(y)),1e-6);y=y/peak*.84
    if line["who"]=="MARN":
        y=peq(y,180,2.4,.8);y=peq(y,3200,-1.2,1.1);y=.84*y+.16*np.tanh(y*2.0)/np.tanh(2.0)
    else:
        y=peq(y,3100,2.2,1.0);y=peq(y,190,-1.3,.8)
    y=y/(max(np.max(np.abs(y)),1e-6))*.88
    sf.write(VO/(line["id"]+".wav"),y.astype(np.float32),SR)
    dur[line["id"]]=round(len(y)/SR,3)
    hop=SR//24; arr=[]
    for i in range(int(np.ceil(len(y)/hop))):
        seg=y[i*hop:min(len(y),(i+1)*hop)]
        rms=float(np.sqrt(np.mean(seg*seg))) if len(seg) else 0
        arr.append(rms)
    p=np.percentile(arr,95)+1e-9
    openness=[round(float(np.clip((v/p-.06)/.72,0,1)),3) for v in arr]
    lips[line["id"]]={"o":openness}
(VO/"dur.json").write_text(json.dumps(dur,indent=2)+"\n")
(VO/"lips.json").write_text(json.dumps(lips,separators=(",",":"))+"\n")
print("processed",len(L),"lines")
