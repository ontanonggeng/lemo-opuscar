from pathlib import Path
import json,subprocess,sys
from PIL import Image,ImageDraw
D=Path(__file__).resolve().parent;O=D/'out';M=O/'one-clean-fork.mp4'
if not M.exists() or M.stat().st_size<100000:raise SystemExit('missing final mp4')
probe=json.loads(subprocess.check_output(['ffprobe','-v','error','-show_streams','-show_format','-of','json',str(M)],text=True))
v=[s for s in probe['streams'] if s.get('codec_type')=='video'];a=[s for s in probe['streams'] if s.get('codec_type')=='audio']
if len(v)!=1 or len(a)!=1:raise SystemExit('stream count')
v=v[0];fps=eval(v['r_frame_rate'],{'__builtins__':{}},{})
dur=float(probe['format']['duration'])
assert (v['width'],v['height'])==(1080,1920) and v['codec_name']=='h264' and a[0]['codec_name']=='aac'
assert abs(float(fps)-24)<.01 and 47.7<=dur<=48.3
sub=(O/'one-clean-fork.srt').read_text()
if sub.count('-->')!=11:raise SystemExit('subtitle cue count')
asr=json.loads((D/'voices/asr-report.json').read_text())
if not all(x['ok'] for x in asr.values()):raise SystemExit('ASR mismatch')
# decode full movie, black detection
subprocess.run(['ffmpeg','-v','error','-i',str(M),'-f','null','-'],check=True)
black=subprocess.run(['ffmpeg','-hide_banner','-i',str(M),'-vf','blackdetect=d=.25:pix_th=.10','-an','-f','null','-'],capture_output=True,text=True).stderr
if 'black_start:' in black:raise SystemExit('black interval detected')
# sampled story contact sheet
times=[.25,2.9,6.2,9.8,13.5,15.1,17.2,19.5,21.2,23.1,25.1,28.0,30.1,32.9,35.5,39.1,41.2,43.0,45.1,47.1]
ims=[]
for i,t in enumerate(times):
 p=O/f'sample_{i:02}.jpg'
 subprocess.run(['ffmpeg','-y','-v','error','-ss',str(t),'-i',str(M),'-frames:v','1','-vf','scale=270:480','-q:v','3',str(p)],check=True)
 im=Image.open(p).convert('RGB')
 # cheap near-blank guard
 if len(im.resize((27,48)).getcolors(1296) or [])<20:raise SystemExit(f'near blank sample {t}')
 ims.append(im)
sheet=Image.new('RGB',(1080,510*5),'#e9e4d8');dr=ImageDraw.Draw(sheet)
for i,(im,t) in enumerate(zip(ims,times)):
 x=(i%4)*270;y=(i//4)*510;sheet.paste(im,(x,y));dr.text((x+8,y+484),f't={t:.2f}s',fill='#19151d')
sheet.save(O/'contact-sheet.jpg',quality=92)
# 0.2s strips around important physical actions (copy, machine-gun, unplug, final drop)
for label,a0,a1 in [('copy',13.0,14.2),('forkstorm',24.4,26.8),('unplug',32.2,33.6),('button',46.4,47.8)]:
 frames=[];t=a0
 while t<=a1+1e-6:
  p=O/f'{label}_{len(frames):02}.jpg'
  subprocess.run(['ffmpeg','-y','-v','error','-ss',f'{t:.2f}','-i',str(M),'-frames:v','1','-vf','scale=270:480','-q:v','3',str(p)],check=True)
  frames.append(Image.open(p).convert('RGB'));t+=.2
 st=Image.new('RGB',(270*len(frames),480),'#ddd')
 for j,im in enumerate(frames):st.paste(im,(j*270,0))
 st.save(O/f'strip-{label}.jpg',quality=90)
report={'duration':dur,'fps':float(fps),'width':1080,'height':1920,'video_codec':v['codec_name'],'audio_codec':a[0]['codec_name'],'asr_lines':len(asr),'asr_all_exact':True,'subtitle_cues':11,'black_intervals':0,'contact_sheet_samples':len(times),'action_strips':['copy','forkstorm','unplug','button'],'artistic_approval':False}
(O/'qa.json').write_text(json.dumps(report,indent=2)+'\n')
print(json.dumps(report,indent=2))
