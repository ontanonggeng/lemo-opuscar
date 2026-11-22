"""ASR gate: pad each short line, transcribe with faster-whisper, fail on exact normalized mismatch."""
import sys,json,re,os,numpy as np,soundfile as sf,librosa
from faster_whisper import WhisperModel
HERE=os.path.dirname(os.path.abspath(__file__))
L=json.load(open(os.path.join(HERE,'lines.json')))
m=WhisperModel('base.en',device='cpu',compute_type='int8')
norm=lambda s:re.sub(r'[^a-z0-9 ]','',s.lower().replace("'","")).split()
bad=0;report={}
for l in L:
 y,sr=sf.read(os.path.join(HERE,'voices',l['id']+'.wav'))
 y=librosa.resample(y,orig_sr=sr,target_sr=16000);pad=np.zeros(int(.6*16000))
 segs,_=m.transcribe(np.concatenate([pad,y,pad]).astype(np.float32),beam_size=5,language='en')
 got=' '.join(s.text.strip() for s in segs)
 want=l.get('asr',l['text']);ok=norm(got)==norm(want);bad+=not ok
 report[l['id']]={'want':want,'got':got,'ok':ok}
 print(('OK  ' if ok else 'DIFF'),l['id'],'|',want,'→',got)
json.dump(report,open(os.path.join(HERE,'voices/asr-report.json'),'w'),indent=2)
if bad:raise SystemExit(f'{bad} ASR mismatch(es)')
