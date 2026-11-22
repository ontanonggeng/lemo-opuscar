"""Original procedural score + foley + complete dialogue → out/mix.wav."""
import json,os,numpy as np,soundfile as sf
from scipy.signal import butter,sosfilt,fftconvolve
from scipy.ndimage import maximum_filter1d,uniform_filter1d
HERE=os.path.dirname(os.path.abspath(__file__));SR=48000;DUR=48;N=int(DUR*SR)
rng=np.random.default_rng(813)
lines=json.load(open(os.path.join(HERE,'lines.json')))
VO={'c01':.18,'n01':2.62,'c02':6.72,'n02':9.64,'c03':14.18,'c04':17.06,'n03':19.20,'c05':28.18,'n04':31.68,'c06':42.05,'n05':44.55}
v=np.zeros((N,2));fx=np.zeros((N,2));mus=np.zeros((N,2));amb=np.zeros((N,2))
def add(buf,x,t,g=.3,pan=0):
 if x.ndim==1:x=np.stack([x,x],1)
 a=int(t*SR);b=min(N,a+len(x));x=x[:b-a]
 if len(x)<=0:return
 buf[a:b,0]+=x[:,0]*g*(1-pan*.45);buf[a:b,1]+=x[:,1]*g*(1+pan*.45)
def env(d,k=6):
 tt=np.arange(int(d*SR))/SR;return np.exp(-tt*k)
def bp(x,lo,hi):
 sos=butter(3,[lo,hi],btype='bandpass',fs=SR,output='sos');return sosfilt(sos,x)
def noise(d):return rng.standard_normal(int(d*SR))
def tone(f,d):
 tt=np.arange(int(d*SR))/SR;return np.sin(2*np.pi*f*tt)
def metal(d=.42):
 x=bp(noise(d),1800,10000)*env(d,8)
 for f in [1100,1870,2940,4610]:x+=tone(f,d)*env(d,9+f/900)*.18
 return x/(np.max(np.abs(x))+1e-9)
def beep(f=900,d=.1):return tone(f,d)*env(d,22)
def hum(d):
 tt=np.arange(int(d*SR))/SR;return .7*tone(88,d)+.25*tone(176,d)+.12*np.sin(2*np.pi*(330+18*np.sin(2*np.pi*.7*tt))*tt)
def chirp():
 d=.28;tt=np.arange(int(d*SR))/SR;f=650+520*tt/d+90*np.sin(2*np.pi*15*tt)
 return np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/d)
# ambience, refrigerator and room
tt=np.arange(N)/SR
room=.006*np.sin(2*np.pi*60*tt)+.0025*np.sin(2*np.pi*120*tt)+.003*sosfilt(butter(2,240,btype='lowpass',fs=SR,output='sos'),noise(DUR))
amb[:,0]=room;amb[:,1]=room
# score: theremin + square-ish arpeggio, starts after premise, silence for cold pause.
def midi(n):return 440*2**((n-69)/12)
for t0,t1 in [(10.1,34.55),(38.5,46.45)]:
 start=int(t0*SR);end=int(t1*SR);tt2=np.arange(end-start)/SR
 # D minor low analog pulse, above rumble range
 bass=np.sin(2*np.pi*midi(50)*tt2)*.055
 arp=np.zeros_like(tt2)
 notes=[62,65,69,65,60,65,69,65]
 step=.25
 for k in range(int((t1-t0)/step)+1):
  a=int(k*step*SR);b=min(len(arp),a+int(.16*SR))
  if b>a:
   f=midi(notes[k%len(notes)]);u=np.arange(b-a)/SR
   arp[a:b]+=(np.sin(2*np.pi*f*u)+.25*np.sin(6*np.pi*f*u))*np.exp(-u*12)*.045
 lead=np.sin(2*np.pi*np.cumsum((midi(74)+6*np.sin(2*np.pi*5.2*tt2)))/SR)*.022
 m=bass+arp+lead;mus[start:end,0]+=m;mus[start:end,1]+=m
# final 1.5-second tiny sting after fork ding
u=np.arange(int(1.4*SR))/SR;sting=(np.sin(2*np.pi*midi(74)*u)+.3*np.sin(4*np.pi*midi(74)*u))*np.exp(-u*3)*.04
add(mus,sting,46.6,.8)
# foley schedule
for t0,g in [(0.1,.7),(.32,.55),(.55,.45),(20.9,.5),(21.2,.45),(22.9,.52),(24.7,.65),(25.0,.55),(25.35,.5),(25.7,.45),(26.1,.42)]:
 add(fx,metal(.5),t0,g,rng.uniform(-.5,.5))
add(fx,beep(1060,.13),13.25,.6);add(fx,hum(7.8),13.1,.055)
add(fx,beep(720,.08),16.55,.35);add(fx,beep(920,.08),17.0,.35);add(fx,beep(1150,.08),17.45,.35)
add(fx,chirp(),27.75,.5,.15)
add(fx,bp(noise(.24),200,1800)*env(.24,10),32.75,.55,-.3)
add(fx,metal(.7),36.7,.24,.1);add(fx,metal(.55),46.62,.65,0)
# dialogue, RMS matched and short early reflections
er=np.zeros(int(.075*SR));er[0]=1
for delay,g0 in [(.012,.22),(.023,.14),(.041,.08),(.061,.04)]:er[int(delay*SR)]+=g0
for l in lines:
 y,sr=sf.read(os.path.join(HERE,'voices',l['id']+'.wav'))
 if y.ndim>1:y=y.mean(1)
 y=y/(np.sqrt(np.mean(y*y))+1e-9)*.105
 yy=fftconvolve(y,er)[:len(y)+len(er)-1]
 pan=-.12 if l['who']=='NORA' else .12
 add(v,yy,VO[l['id']],1,pan)
# duck score ~-7dB under speech
act=(np.max(np.abs(v),axis=1)>.008).astype(float)
duck=1-.56*np.clip(uniform_filter1d(maximum_filter1d(act,int(.24*SR)),int(.12*SR)),0,1)
mix=mus*duck[:,None]+v+fx*.72+amb*.75
mix=np.tanh(mix*1.15)*.88
os.makedirs(os.path.join(HERE,'out'),exist_ok=True)
sf.write(os.path.join(HERE,'out/mix.wav'),mix.astype(np.float32),SR,subtype='PCM_24')
print('mix peak',np.max(np.abs(mix)),'voice RMS',np.sqrt(np.mean(v*v)),'music RMS',np.sqrt(np.mean(mus*mus)))
