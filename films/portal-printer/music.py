"""Original synthesized score for Portal Printer. No samples."""
from pathlib import Path
import json, math
import numpy as np
import soundfile as sf
HERE=Path(__file__).resolve().parent; SR=48000; DUR=44.0
tl=json.loads((HERE/"timeline.json").read_text())
N=int(DUR*SR); out=np.zeros(N,dtype=np.float64)
def add(y,t,g=.1):
    i=int(t*SR);j=min(N,i+len(y))
    if j>i:out[i:j]+=y[:j-i]*g
def tone(freq,dur,kind='sine',attack=.02,release=.08,vib=0):
    n=int(dur*SR);tt=np.arange(n)/SR
    ph=2*np.pi*freq*tt
    if vib:ph+=.5*np.sin(2*np.pi*vib*tt)*(1-np.exp(-tt/0.15))
    if kind=='square':y=np.sign(np.sin(ph))*.72+np.sign(np.sin(ph*2))*.16
    elif kind=='saw':y=sum(np.sin(ph*k)/k for k in range(1,6))
    else:y=np.sin(ph)+.13*np.sin(ph*2)+.06*np.sin(ph*3)
    env=np.ones(n);a=min(n,int(attack*SR));r=min(n,int(release*SR))
    if a:env[:a]=np.linspace(0,1,a)
    if r:env[-r:]=np.linspace(1,0,r)
    return y*env
def bass(t0,t1,root=73.42):
    beat=.5
    k=0;t=t0
    seq=[1,1.5,1.333,1.125]
    while t<t1:
        add(tone(root*seq[k%4],.34,'sine',.01,.09),t,.065);t+=beat;k+=1
def arp(t0,t1,root=146.83):
    notes=[1,1.1892,1.4983,1.7818]
    t=t0;k=0
    while t<t1:
        add(tone(root*notes[k%4],.105,'square',.005,.025),t,.018);t+=.125;k+=1
def theremin(t0,t1,root=293.66,step=.75):
    t=t0;k=0
    seq=[1,1.1225,.9439,1.3348]
    while t<t1:
        add(tone(root*seq[k%4],.48,'sine',.08,.16,5.1),t,.038);t+=step;k+=1
def noise_hit(t,dur=.09,g=.03,seed=1):
    rng=np.random.default_rng(seed);n=int(dur*SR);x=rng.normal(0,1,n)
    env=np.exp(-np.arange(n)/SR*35);add(x*env,t,g)
for c in tl["music"]:
    a,b,k=c["start"],c["end"],c["kind"]
    if k=='warehouse':
        bass(a,b,73.42);arp(a,b,146.83)
    elif k=='frost':
        bass(a,b,65.41)
        for i,t in enumerate(np.arange(a,b,.62)):add(tone(520+i%3*120,.22,'sine',.005,.12,6),float(t),.035)
    elif k=='jelly':
        bass(a,b,82.41)
        for i,t in enumerate(np.arange(a,b,.46)):
            add(tone(164.81*(1+[0,.122,.26][i%3]),.28,'saw',.02,.09),float(t),.025)
    elif k=='montage':
        t=a;i=0
        while t<b:
            noise_hit(t,.08,.03,30+i);add(tone(110*(1.0+.08*(i%3)),.18,'square',.002,.08),t,.035);t+=.45;i+=1
    elif k=='theme':
        bass(a,b,73.42);arp(a,b,146.83);theremin(a,b,293.66,.88)
    elif k=='sting':
        add(tone(146.83,.35,'saw',.01,.25),a,.06);add(tone(97.99,.55,'sine',.01,.35),a+.12,.08)
# soft limiter
out=np.tanh(out*1.1)*.88
(HERE/"out").mkdir(exist_ok=True)
sf.write(HERE/"out"/"music.wav",out.astype(np.float32),SR,subtype='PCM_24')
print("score",DUR,"s")
