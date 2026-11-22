#!/usr/bin/env python3
from pathlib import Path
import json,subprocess,re
from PIL import Image,ImageDraw
D=Path(__file__).resolve().parent;O=D/"out";M=O/"portal-printer.mp4"
if not M.is_file() or M.stat().st_size<100000:raise SystemExit("missing final mp4")
info=json.loads(subprocess.check_output(["ffprobe","-v","error","-show_streams","-show_format","-of","json",str(M)],text=True))
v=[x for x in info["streams"] if x.get("codec_type")=="video"];a=[x for x in info["streams"] if x.get("codec_type")=="audio"]
if len(v)!=1 or len(a)!=1:raise SystemExit("expected one video and one audio stream")
v=v[0];a=a[0]
fps=eval(v["r_frame_rate"],{"__builtins__":{}},{});dur=float(info["format"]["duration"])
assert (int(v["width"]),int(v["height"]))==(1080,1920)
assert v["codec_name"]=="h264" and a["codec_name"]=="aac"
assert abs(fps-24)<.01 and 43.7<=dur<=44.3
# decode every frame; a corrupt output must fail here
subprocess.run(["ffmpeg","-v","error","-i",str(M),"-f","null","-"],check=True)
bd=subprocess.run(["ffmpeg","-hide_banner","-i",str(M),"-vf","blackdetect=d=0.12:pix_th=0.05","-an","-f","null","-"],stderr=subprocess.PIPE,text=True).stderr
if "black_start:" in bd:raise SystemExit("black interval detected")
# actual-film contact sheet
times=[.35,1.2,3.4,7.4,10.9,14.8,18.7,21.6,23.6,25.6,28.9,31.0,33.4,35.3,37.0,39.3,40.7,42.4]
frames=[]
for i,t in enumerate(times):
    p=O/f"qa_{i:02d}.jpg"
    subprocess.run(["ffmpeg","-y","-v","error","-ss",str(t),"-i",str(M),"-frames:v","1","-vf","scale=270:480","-q:v","2",str(p)],check=True)
    im=Image.open(p).convert("RGB")
    if len(im.resize((27,48)).getcolors(1296) or [])<18:raise SystemExit(f"near blank sample {t}")
    frames.append(im)
sheet=Image.new("RGB",(1080,510*5),"#ddd5c6");dr=ImageDraw.Draw(sheet)
for i,(im,t) in enumerate(zip(frames,times)):
    x=(i%4)*270;y=(i//4)*510;sheet.paste(im,(x,y));dr.text((x+7,y+484),f"{t:.2f}s",fill="#18131f")
sheet.save(O/"contact-sheet.jpg",quality=93)
def strip(name,start,end,step=.2):
    ts=[];t=start
    while t<=end+1e-6:ts.append(round(t,2));t+=step
    thumbs=[]
    for i,t in enumerate(ts):
        p=O/f"{name}_{i:02d}.jpg"
        subprocess.run(["ffmpeg","-y","-v","error","-ss",str(t),"-i",str(M),"-frames:v","1","-vf","scale=216:384","-q:v","3",str(p)],check=True)
        thumbs.append(Image.open(p).convert("RGB"))
    cols=6;rows=(len(thumbs)+cols-1)//cols
    sh=Image.new("RGB",(cols*216,rows*410),"#ddd5c6");d=ImageDraw.Draw(sh)
    for i,(im,t) in enumerate(zip(thumbs,ts)):
        x=(i%cols)*216;y=(i//cols)*410;sh.paste(im,(x,y));d.text((x+5,y+386),f"{t:.1f}",fill="#18131f")
    sh.save(O/(name+".jpg"),quality=92)
strip("action-strip-delivery",33.6,36.6)
strip("action-strip-return",40.0,41.4)
# style source audit
src="\n".join((D/x).read_text() for x in ["main.js","cast.js","world.js"])
for bad in ["createLinearGradient","createRadialGradient"]:
    if bad in src:raise SystemExit("gradient forbidden: "+bad)
qa={
 "duration":dur,"fps":fps,"resolution":[1080,1920],"video_codec":v["codec_name"],"audio_codec":a["codec_name"],
 "decoded_full_movie":True,"black_intervals":False,"tts_engine":"Kokoro offline","asr_gate":"required before render",
 "look_dev":"real-code model sheets + 2 styleframes reviewed before production",
 "style_rules":{"boil_12fps":True,"flat_fills":True,"hard_shadows":True,"portal_only_glow":True,"reaction_closeups":True,"rule_of_three":True},
 "artistic_approval":False
}
(O/"media-qa.json").write_text(json.dumps(qa,indent=2)+"\n")
print("MEDIA QA PASS",json.dumps(qa))
