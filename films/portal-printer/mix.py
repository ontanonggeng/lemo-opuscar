"""Mix ambience, synthesized foley, original score and processed Kokoro voices."""
from pathlib import Path
import json, math
import numpy as np
import soundfile as sf
from scipy.signal import butter,sosfilt
HERE=Path(__file__).resolve().parent; SR=48000
lines=json.loads((HERE/"lines.json").read_text());tl=json.loads((HERE/"timeline.json").read_text())
dur=json.loads((HERE/"voices"/"dur.json").read_text());DUR=float(tl["duration"]);N=int(DUR*SR)
mix=np.zeros(N,dtype=np.float64)
music,sr=sf.read(HERE/"out"/"music.wav");music=music.mean(1) if getattr(music,'ndim',1)>1 else music
if sr!=SR:raise SystemExit("music sample rate")
# Duck music ~7 dB under dialogue with gentle edges.
gain=np.ones(N)
for L in lines:
    a=max(0,int((L["at"]-.08)*SR));b=min(N,int((L["at"]+dur[L["id"]]+.16)*SR))
    gain[a:b]=np.minimum(gain[a:b],.45)
# smooth envelope
w=max(1,int(.035*SR));gain=np.convolve(gain,np.ones(w)/w,mode='same')
mix[:len(music)]+=music*gain*.72
# fluorescent room tone + distant conveyor motor
tt=np.arange(N)/SR
mix+=.0042*np.sin(2*np.pi*60*tt)+.0015*np.sin(2*np.pi*120*tt)+.001*np.sin(2*np.pi*37*tt)
def overlay(y,t,g=1):
    i=int(t*SR);j=min(N,i+len(y))
    if i<N and j>i:mix[i:j]+=np.asarray(y[:j-i])*g
def voice(path,t):
    y,sr=sf.read(path);y=y.mean(1) if getattr(y,'ndim',1)>1 else y
    if sr!=SR:raise SystemExit("voice sample rate "+str(path))
    overlay(y,t,.78)
for L in lines:voice(HERE/"voices"/(L["id"]+".wav"),L["at"])
rng=np.random.default_rng(1234)
def noise(d,decay=20):
    n=int(d*SR);x=rng.normal(0,1,n);return x*np.exp(-np.arange(n)/SR*decay)
def sweep(d,f0,f1):
    n=int(d*SR);t=np.arange(n)/SR;k=(f1-f0)/max(d,1e-6);ph=2*np.pi*(f0*t+.5*k*t*t)
    return np.sin(ph)*np.sin(np.pi*np.arange(n)/max(1,n-1))**2
def click(d=.06):return noise(d,55)
def portal_open():
    y=sweep(.52,75,430)*.35+noise(.52,7)*.12
    return np.tanh(y*1.5)
def printer():
    n=int(.45*SR);y=np.zeros(n)
    for k in range(9):
        i=int(k*.048*SR);z=click(.038);y[i:i+len(z)]+=z*.6
    return y
def squish():
    return sweep(.25,220,85)*.18+noise(.22,18)*.07
for i,e in enumerate(tl["events"]):
    typ,t=e["type"],e["t"]
    if typ=="portal_open":overlay(portal_open(),t,.23)
    elif typ=="slug_drop":overlay(sweep(.16,170,70),t,.16)
    elif typ=="button":overlay(click(.07),t,.19)
    elif typ=="printer":overlay(printer(),t,.16)
    elif typ=="squish":overlay(squish(),t,.22)
    elif typ=="buzz":
        overlay(np.sign(sweep(.13,120,90)),t,.055)
    elif typ=="label_peel":overlay(noise(.22,22),t,.065)
    elif typ=="scan":overlay(sweep(.11,680,910),t,.09)
    elif typ=="suction":overlay(sweep(.58,380,58),t,.22)
    elif typ=="box_hit":overlay(noise(.18,25)+sweep(.18,120,55)*.4,t,.19)
# short wet chirp for final slug
overlay(sweep(.13,520,720)+.2*sweep(.13,1040,1440),42.78,.055)
mix=np.tanh(mix*.96)*.90
sf.write(HERE/"out"/"mix.wav",mix.astype(np.float32),SR,subtype='PCM_24')
print("mixed",DUR,"s")
