#!/usr/bin/env python3
"""Validate real movie streams and extract visible story evidence."""
from pathlib import Path
import json,subprocess
from PIL import Image,ImageOps,ImageDraw
D=Path(__file__).resolve().parent
OUT=D/"out"; movie=OUT/"the-undo-button.mp4"
if not movie.is_file() or movie.stat().st_size < 10000:
    raise SystemExit("Final MP4 missing or too small")
result=json.loads(subprocess.check_output(["ffprobe","-v","error","-show_streams","-show_format","-of","json",str(movie)],text=True))
v=[x for x in result["streams"] if x.get("codec_type")=="video"];a=[x for x in result["streams"] if x.get("codec_type")=="audio"]
if len(v)!=1 or len(a)!=1:raise SystemExit("Required video/audio streams missing")
v=v[0]
if (v["width"],v["height"],v["codec_name"])!=(1080,1920,"h264"):raise SystemExit("Unexpected native video format")
if a[0]["codec_name"]!="aac":raise SystemExit("Unexpected audio format")
fps=float(v["r_frame_rate"].split("/")[0])/float(v["r_frame_rate"].split("/")[1])
dur=float(result["format"]["duration"])
if abs(fps-24)>.01 or not 43.7<=dur<=44.3:raise SystemExit("Unexpected frame rate or runtime")
perf=json.loads((OUT/"performance.json").read_text())
if len(perf["lines"])!=10:raise SystemExit("Missing generated dialogue segments")
if perf.get("source")!="Kokoro offline full-length line files":raise SystemExit("Unexpected TTS source")
if not (OUT/"the-undo-button.srt").is_file():raise SystemExit("Missing subtitles")
frames=[]
for i,t in enumerate([.2,1.2,3.2,7.1,10.0,16.5,20.,25.5,31.,34.5,37.,42.]):
    fp=OUT/("sample_%02d.jpg"%i)
    subprocess.run(["ffmpeg","-y","-v","error","-ss",str(t),"-i",str(movie),"-frames:v","1","-vf","scale=270:480","-q:v","3",str(fp)],check=True)
    img=Image.open(fp).convert("RGB")
    colors=img.resize((27,48)).getcolors(1296)
    if colors is not None and len(colors)<15:
        raise SystemExit("Near-blank sample at "+str(t))
    frames.append(img)
sheet=Image.new("RGB",(270*4,510*3),"#e9e4db")
draw=ImageDraw.Draw(sheet)
for i,img in enumerate(frames):
    x=(i%4)*270;y=(i//4)*510
    sheet.paste(img,(x,y));draw.text((x+8,y+482),"t=%.1fs"%[.2,1.2,3.2,7.1,10.,16.5,20.,25.5,31.,34.5,37.,42.][i],fill="#18151b")
sheet.save(OUT/"contact-sheet.jpg",quality=91)
report={"video":str(movie),"duration":dur,"fps":fps,"width":1080,"height":1920,"video_codec":v["codec_name"],"audio_codec":a[0]["codec_name"],"voice_engine":"Kokoro offline","dialogue_cues":len(perf["lines"]),"contact_sheet":"contact-sheet.jpg","samples":len(frames),"artistic_approval":False,"word_accurate_speech_verified":False}
(OUT/"media-qa.json").write_text(json.dumps(report,indent=2)+"\n")
print("MEDIA PASS",report)
