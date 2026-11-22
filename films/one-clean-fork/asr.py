"""ASR gate: pad each line, resample without librosa, transcribe, fail on normalized mismatch."""
import json,re,os,numpy as np,soundfile as sf
from scipy.signal import resample_poly
from math import gcd
from faster_whisper import WhisperModel
HERE=os.path.dirname(os.path.abspath(__file__))
L=json.load(open(os.path.join(HERE,'lines.json')))
m=WhisperModel('base.en',device='cpu',compute_type='int8')
def norm(s):
 s=s.lower().replace("'","")
 s=re.sub(r'\bthree hundred (and )?eighty[- ]four\b','384',s)
 return re.sub(r'[^a-z0-9 ]','',s).split()
bad=0;report={}
for l in L:
 y,sr=sf.read(os.path.join(HERE,'voices',l['id']+'.wav'))
 if y.ndim>1:y=y.mean(1)
 if sr!=16000:
  g=gcd(int(sr),16000);y=resample_poly(y,16000//g,int(sr)//g)
 pad=np.zeros(int(.6*16000))
 segs,_=m.transcribe(np.concatenate([pad,y.astype(np.float32),pad]),beam_size=5,language='en')
 got=' '.join(s.text.strip() for s in segs)
 want=l.get('asr',l['text']);ok=norm(got)==norm(want);bad+=not ok
 report[l['id']]={'want':want,'got':got,'ok':ok}
 print(('OK  ' if ok else 'DIFF'),l['id'],'|',want,'→',got)
json.dump(report,open(os.path.join(HERE,'voices/asr-report.json'),'w'),indent=2)
if bad:raise SystemExit(f'{bad} ASR mismatch(es)')
