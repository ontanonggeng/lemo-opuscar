"""Post-process Kokoro voices into 48k mono WAVs + 24Hz lip envelopes using only repo core dependencies."""
import json,os,numpy as np,soundfile as sf
from scipy.signal import lfilter,resample_poly
from math import gcd
HERE=os.path.dirname(os.path.abspath(__file__));SR=48000
L=json.load(open(os.path.join(HERE,'lines.json')))
os.makedirs(os.path.join(HERE,'voices'),exist_ok=True)
def peq(x,f,gain_db,q=1):
 A=10**(gain_db/40);w=2*np.pi*f/SR;al=np.sin(w)/(2*q)
 b=[1+al*A,-2*np.cos(w),1-al*A];a=[1+al/A,-2*np.cos(w),1-al/A]
 return lfilter(np.array(b)/a[0],np.array(a)/a[0],x)
def resample(y,sr):
 if sr==SR:return y
 g=gcd(int(sr),SR);return resample_poly(y,SR//g,int(sr)//g)
dur={};lips={}
for l in L:
 y,sr=sf.read(os.path.join(HERE,'out/raw',l['id']+'.wav'))
 if y.ndim>1:y=y.mean(1)
 y=resample(np.asarray(y,dtype=np.float64),sr)
 if l['who']=='NORA':
  sat=np.tanh(y*2.0)/np.tanh(2.0);y=.78*y+.22*sat;y=peq(y,185,2.2,.85);y=peq(y,2900,-1.1,1)
 else:
  y=peq(y,3300,2.3,.9);y=peq(y,170,-1.0,.8)
 y=y/(np.abs(y).max()+1e-9)*.9
 sf.write(os.path.join(HERE,'voices',l['id']+'.wav'),y.astype(np.float32),SR)
 dur[l['id']]=round(len(y)/SR,3)
 # 24Hz 50ms RMS + spectral centroid, sampled later at 12fps drawing time.
 hop=SR//24;win=int(.05*SR);o=[];b=[]
 rms=[];cen=[]
 for start in range(0,len(y),hop):
  seg=y[max(0,start-win//2):min(len(y),start+win//2)]
  if len(seg)<64:seg=np.pad(seg,(0,64-len(seg)))
  w=np.hanning(len(seg));z=seg*w
  rms.append(float(np.sqrt(np.mean(z*z))))
  spec=np.abs(np.fft.rfft(z,n=4096));freq=np.fft.rfftfreq(4096,1/SR)
  cen.append(float((spec*freq).sum()/(spec.sum()+1e-9)))
 p=np.percentile(rms,95)+1e-9
 o=[round(float(np.clip((r/p-.08)/.82,0,1)),3) for r in rms]
 b=[round(float(np.clip((c-1100)/3000,0,1)),3) for c in cen]
 lips[l['id']]={'o':o,'b':b}
 print(l['id'],l['who'],dur[l['id']],l['text'])
json.dump(dur,open(os.path.join(HERE,'voices/dur.json'),'w'),indent=2)
json.dump(lips,open(os.path.join(HERE,'voices/lips.json'),'w'))
