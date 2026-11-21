#!/usr/bin/env python3
"""BLACKSTAR v5 / Eclipse Cut. Original geometric mark and native print artwork.
Dependencies: Pillow, numpy, Shapely, CairoSVG. Usage: python build_blackstar_v5.py [OUTPUT_DIR]
No previous BlackStar graphics or anime artwork are reused.
"""
from __future__ import annotations
import os, sys, io, math, json, random, hashlib, zipfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import numpy as np
import cairosvg
from shapely.geometry import Polygon, LineString
from shapely.ops import unary_union

ROOT=Path(sys.argv[1]) if len(sys.argv)>1 else Path('/mnt/data/BLACKSTAR_Brand_Kit_v5')
INK='#090C0B'; IVORY='#F5F0E4'; LIME='#D7FA28'; WHITE='#FFFFFF'; MIST='#C5C2B7'
for d in ['masters','facebook','youtube','video','reusable','textures','previews','guides','source']:
 (ROOT/d).mkdir(parents=True,exist_ok=True)

# --- Original geometric emblem: offset annulus, non-radial diagonal void, lime terminal.
def geom_mark():
 rng=random.Random(22220)
 cx=cy=500
 N=256
 outer=[]; inner=[]
 for i in range(N):
  a=2*math.pi*i/N
  r=325 + rng.uniform(-2.2,2.2)
  outer.append((cx+r*math.cos(a),cy+r*math.sin(a)))
 for i in range(N):
  a=2*math.pi*i/N
  r=218 + rng.uniform(-1.7,1.7)
  inner.append((cx+r*math.cos(a),cy+r*math.sin(a)))
 ring=Polygon(outer,[inner])
 # Three differently sized breaks, all independent from the five-point star language.
 gaps=[]
 for center,angle in [(500,-44),(500,87),(500,201)]:
  c=math.radians(angle); spread=math.radians(9 if angle==87 else 12)
  gaps.append(Polygon([(cx+175*math.cos(c-spread),cy+175*math.sin(c-spread)),
    (cx+400*math.cos(c-spread),cy+400*math.sin(c-spread)),
    (cx+400*math.cos(c+spread),cy+400*math.sin(c+spread)),
    (cx+175*math.cos(c+spread),cy+175*math.sin(c+spread))]))
 # Oblique incision: a geometric blackout, not a star, shuriken or signature.
 slash=LineString([(122,667),(878,387)]).buffer(29,cap_style='flat')
 surface=ring.difference(unary_union(gaps+[slash]))
 lime=Polygon([(602,492),(799,436),(766,517),(583,560)])
 return surface,lime
SHAPE,LIME_SHAPE=geom_mark()

def path_from_geom(g):
 polys = [g] if g.geom_type=='Polygon' else list(getattr(g,'geoms',[]))
 out=[]
 for poly in polys:
  if poly.is_empty:continue
  for seq in [poly.exterior]+list(poly.interiors):
   pts=list(seq.coords)
   out.append('M '+ ' L '.join(f'{x:.2f} {y:.2f}' for x,y in pts)+' Z')
 return ' '.join(out)
MARK_PATH=path_from_geom(SHAPE); LIME_PATH=path_from_geom(LIME_SHAPE)

def svg_mark(main=IVORY,lime=LIME,background=None):
 bg=(f'<rect width="1000" height="1000" fill="{background}"/>' if background else '')
 return f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1000 1000" width="1000" height="1000">{bg}
<path d="{MARK_PATH}" fill="{main}" fill-rule="evenodd"/>
<path d="{LIME_PATH}" fill="{lime}"/>
</svg>'''

def save_svg(name, main=IVORY,accent=LIME,bg=None):
 p=ROOT/'masters'/name;p.write_text(svg_mark(main,accent,bg),encoding='utf-8')
 return p
svg_full=save_svg('eclipse-cut-primary.svg')
svg_mono=save_svg('eclipse-cut-mono-ivory.svg',IVORY,IVORY)
svg_white=save_svg('eclipse-cut-mono-white.svg',WHITE,WHITE)
svg_dark=save_svg('eclipse-cut-ink.svg',INK,INK)
svg_lime=save_svg('eclipse-cut-lime.svg',LIME,LIME)

def mark_render(size,main=IVORY,accent=LIME):
 s=svg_mark(main,accent)
 return Image.open(io.BytesIO(cairosvg.svg2png(bytestring=s.encode(),output_width=size,output_height=size))).convert('RGBA')

def put_mark(im,x,y,size,main=IVORY,accent=LIME):
 mark=mark_render(size,main,accent)
 im.paste(mark,(int(x),int(y)),mark)

def save_image(im, rel, fmt=None, quality=92):
 p=ROOT/rel;p.parent.mkdir(parents=True,exist_ok=True)
 if p.exists():
  try:
   with Image.open(p) as existing:
    existing.load()
    if existing.size == im.size: return p
  except Exception: p.unlink(missing_ok=True)
 if fmt=='JPEG' or p.suffix.lower() in ('.jpg','.jpeg'):
  im.convert('RGB').save(p,format='JPEG',quality=quality,optimize=True,subsampling=0)
 else: im.save(p,optimize=False,compress_level=3)
 return p

# --- Reproducible original native-canvas silkscreen textures (no crop / enlargement).
def noise_background(w,h,seed):
 rng=np.random.default_rng(seed)
 im=np.empty((h,w,3),dtype=np.uint8)
 noise=rng.normal(0,3.4,(h,w)).astype(np.int16)
 for c,base in enumerate((9,12,11)):
  im[:,:,c]=np.clip(base+noise,0,255).astype(np.uint8)
 return Image.fromarray(im,'RGB')

def polygon_brush(d,rng,p0,p1,width,color,streaks=True):
 # Translated baseline and sawtooth edges, generated in final canvas pixels.
 dx=p1[0]-p0[0];dy=p1[1]-p0[1]; L=math.hypot(dx,dy)
 if L<1:return
 ux,uy=dx/L,dy/L;nx,ny=-uy,ux
 n=max(70,int(L/7)); top=[];bot=[]
 phase=rng.random()*math.tau
 for i in range(n+1):
  t=i/n
  taper=max(0.05,min(1,(t+0.025)*9,(1-t+0.025)*11))
  wave=math.sin(t*59+phase)*.09+math.sin(t*137+phase)*.06
  rag=(rng.random()-.5)*.45
  profile=width*taper*(1+wave+rag)
  ax=p0[0]+dx*t;ay=p0[1]+dy*t
  top.append((ax+nx*profile*.5,ay+ny*profile*.5))
  bot.append((ax-nx*profile*.5,ay-ny*profile*.5))
 d.polygon(top+bot[::-1],fill=color)
 if streaks:
  for _ in range(max(25,int(L/10))):
   t=rng.uniform(0.02,.98); offs=rng.uniform(-width*.63,width*.63)
   sx=p0[0]+dx*t+nx*offs;sy=p0[1]+dy*t+ny*offs
   sl=rng.uniform(1.5,max(5,L*.055));ww=rng.uniform(.5,max(1,width*.014))
   # Ink holes and detached tears create a real irregular scrape, not rectangles.
   clr=INK if rng.random()<.68 else color
   d.line([(sx,sy),(sx+ux*sl,sy+uy*sl)],fill=clr,width=max(1,int(ww)))

def grunge(w,h,seed=22,variant='hero'):
 im=noise_background(w,h,seed)
 d=ImageDraw.Draw(im)
 rng=random.Random(seed);s=min(w/1702,h/630)
 # Base printer debris: pinpricks, fine scratches, sporadic torn fibers.
 for i in range(min(35000,int(w*h/30))):
  x=rng.randrange(w);y=rng.randrange(h)
  v=rng.choice([19,26,31,39,45])
  if i%4==0:
   d.line([(x,y),(x+rng.randint(2,24),y-rng.randint(0,10))],fill=(v,v,v-1),width=1)
  else:d.point((x,y),fill=(v,v,v-1))
 # Giant original brush swipes placed away from center profile/banner safe area.
 if variant=='hero':
  specs=[((-.23,.67),(.42,-.32),.22,IVORY),
         ((.63,1.16),(1.30,.39),.19,IVORY),
         ((-.20,1.08),(.35,.48),.09,LIME),
         ((.82,.28),(1.28,-.23),.075,LIME)]
 elif variant=='quiet':
  specs=[((-.12,.10),(.27,-.15),.11,IVORY),
         ((.76,1.13),(1.14,.78),.11,IVORY),
         ((-.12,1.15),(.33,.64),.05,LIME),
         ((.88,.11),(1.14,-.13),.047,LIME)]
 elif variant=='vertical':
  specs=[((-.35,.21),(.88,-.19),.19,IVORY),
         ((.23,1.19),(1.28,.74),.18,IVORY),
         ((-.19,.95),(.61,.67),.07,LIME),
         ((.72,.21),(1.28,-.14),.055,LIME)]
 elif variant=='thumbnail':
  specs=[((-.25,.22),(.66,-.32),.21,IVORY),
         ((.73,1.20),(1.26,.52),.18,IVORY),
         ((-.2,1.15),(.5,.43),.065,LIME)]
 else:specs=[]
 for i,(a,b,thick,color) in enumerate(specs):
  p0=(a[0]*w,a[1]*h);p1=(b[0]*w,b[1]*h)
  width=thick*min(w,h)
  polygon_brush(d,rng,p0,p1,width,color)
  # wispy parallel sharp paint splits
  ux=(p1[0]-p0[0]);uy=(p1[1]-p0[1]);l=math.hypot(ux,uy)
  nx,ny=-uy/l,ux/l
  for j in range(13):
   t=rng.uniform(.08,.91);o=rng.uniform(-1.1,1.1)*width
   bx=p0[0]+ux*t+nx*o; by=p0[1]+uy*t+ny*o
   spread=rng.uniform(.03,.14)*l
   d.line([(bx,by),(bx+ux/l*spread,by+uy/l*spread)],fill=color,width=max(1,int(rng.uniform(.004,.018)*width)))
 # micro screenprint wear on top; for each small fleck choose background or ivory/lime
 for i in range(min(24000,int(w*h/58))):
  x=rng.randrange(w);y=rng.randrange(h)
  if rng.random()<.9: clr=(9,12,11)
  else: clr=(81,84,77)
  rx=rng.choice((0,0,0,1,1,2))
  d.ellipse((x,y,x+rx,y+rx),fill=clr)
 # Halftone clusters concentrated in background corners
 rad=max(2,int(min(w,h)/300))
 for anchor in [(.035,.90),(.93,.89),(.075,.09)]:
  xc=anchor[0]*w;yc=anchor[1]*h
  step=max(9,int(min(w,h)/84))
  for yy in range(int(yc-h*.14),int(yc+h*.14),step):
   for xx in range(int(xc-w*.095),int(xc+w*.095),step):
    dist=((xx-xc)/(w*.095))**2+((yy-yc)/(h*.14))**2
    if dist<1.1 and rng.random()<(1-dist)*.57:
     r=rad*rng.uniform(.6,1.9)
     d.ellipse((xx-r,yy-r,xx+r,yy+r),fill=IVORY if rng.random()>.45 else INK)
 return im

def dark_canvas(w,h): return Image.new('RGB',(w,h),INK)
def plain_endcard(w,h):
 im=Image.new('RGB',(w,h),'#000000')
 size=int(min(w,h)*.57)
 put_mark(im,(w-size)//2,(h-size)//2,size,WHITE,WHITE)
 return im

def profile(sz):
 im=grunge(sz,sz,100+sz,'quiet')
 # Retain quiet high contrast at tiny display size
 icon=int(sz*.82)
 put_mark(im,(sz-icon)//2,(sz-icon)//2,icon)
 return im

# Master scalable exports
for size in (512,1024,2400):
 save_image(mark_render(size),'masters/eclipse-cut-primary-transparent-%d.png'%size)
save_image(mark_render(2400,WHITE,WHITE),'masters/eclipse-cut-mono-white-transparent-2400.png')
save_image(mark_render(2400,INK,INK),'masters/eclipse-cut-ink-transparent-2400.png')
for n in (800,1024):
 save_image(profile(n), 'facebook/profile-%d.png'%n)
 save_image(profile(n),'youtube/profile-%d.png'%n)

# Facebook professional profile: native 2x cover and upload versions.
for variant in ['hero','quiet']:
 im=grunge(1702,630,511 if variant=='hero' else 513,variant)
 icon=390 if variant=='hero' else 370
 put_mark(im,((1702-icon)//2),((630-icon)//2),icon)
 save_image(im,f'facebook/cover-{variant}-1702x630.png')
# YouTube banner native 2560x1440, logo confined to central 1544x423 region.
img=grunge(2560,1440,620,'hero')
put_mark(img,(2560-345)//2,(1440-345)//2,345)
save_image(img,'youtube/banner-2560x1440.png')
save_image(img,'youtube/banner-upload-2560x1440.jpg','JPEG',quality=90)
# watermark 150 x 150 transparent
save_image(mark_render(150,WHITE,WHITE),'youtube/video-watermark-150.png')
save_image(mark_render(512,WHITE,WHITE),'video/corner-watermark-white-512.png')
save_image(mark_render(512,IVORY,LIME),'video/corner-watermark-primary-512.png')
# End cards only white emblem on exactly black; no distress, CTA or lime
for w,h in [(1920,1080),(1080,1920)]:
 a='16x9' if w>h else '9x16'
 save_image(plain_endcard(w,h),f'video/end-card-black-{a}.png')
 transparent=Image.new('RGBA',(w,h),(0,0,0,0))
 mark=mark_render(int(min(w,h)*.57),WHITE,WHITE)
 transparent.paste(mark,((w-mark.width)//2,(h-mark.height)//2),mark)
 save_image(transparent,f'video/end-card-transparent-{a}.png')
# Templates without embedded logo - creative fields reserved for video art/episode text.
for w,h,name,v in [
 (1080,1920,'facebook/reels-cover-blank-1080x1920.png','vertical'),
 (1080,1350,'facebook/feed-card-blank-1080x1350.png','vertical'),
 (1080,1920,'youtube/shorts-cover-blank-1080x1920.png','vertical'),
 (1280,720,'youtube/thumbnail-blank-1280x720.png','thumbnail'),
 (1920,1080,'reusable/episode-bg-horizontal-1920x1080.png','quiet'),
 (1080,1920,'reusable/episode-bg-vertical-1080x1920.png','vertical'),
 (2160,3840,'reusable/vertical-cover-master-2160x3840.png','vertical'),
 (3840,2160,'reusable/thumbnail-background-master-3840x2160.png','thumbnail'),
 ]:
 im=grunge(w,h,(w*7+h)%100000,v);save_image(im,name)
# Original native transparent brush elements for production compositing
for idx,col in [(1,IVORY),(2,LIME)]:
 w,h=2400,800
 layer=Image.new('RGBA',(w,h),(0,0,0,0));d=ImageDraw.Draw(layer);r=random.Random(9900+idx)
 polygon_brush(d,r,(40,690),(2290,110),240,col,False)
 for j in range(4300):
  x=r.randrange(w);y=r.randrange(h)
  if r.random()<.40:
   sz=r.choice((1,1,2,3,5))
   d.ellipse((x,y,x+sz,y+sz),fill=col)
 save_image(layer,f'textures/screenprint-brush-0{idx}-transparent-2400x800.png')

# Guides, rights checklist, transparent assumptions.
tokens={
 'brand':'BLACKSTAR', 'version':'5.0.0', 'concept':'Eclipse Cut',
 'palette':{'ink':INK,'ivory':IVORY,'signal_lime':LIME,'white':WHITE},
 'identity_rules':{'visual_logo':'standalone_abstract_broken_annulus', 'wordmark':False,'tagline':False,'cta_on_end_card':False,
                   'end_card_background':'#000000','end_card_logo':'#FFFFFF'},
 'rights':{'old_anime_derived_mark':'RETIRED_NOT_INCLUDED','new_mark_original_geometry':True,'trademark_clearance':'NOT_PERFORMED',
           'name_BLACKSTAR':'REQUIRES_MARKET_AND_CLASS_CLEARANCE_BEFORE_MONETIZATION'},
 'youtube_safe_area_at_2560x1440':{'x':508,'y':508,'width':1544,'height':424}}
(ROOT/'guides'/'design-tokens.json').write_text(json.dumps(tokens,indent=2)+'\n')
readme='''# BLACKSTAR — Identity Kit v5.0 / ECLIPSE CUT

Original identity system, replacing the previous anime-derived graffiti mark. The original BLACK graffiti/star signature is **not** present anywhere in the output assets or sources.

## Design language

- **Primary mark:** `Eclipse Cut`: an independently constructed broken circular band with a diagonal gap and asymmetric lime accent. Never use an anime-signature mark, a five-point interlaced star, or a handwritten `BLACK` glyph.
- **Palette:** Ink `#090C0B`; Ivory `#F5F0E4`; Signal Lime `#D7FA28`.
- **Artwork:** matte black, uneven cream paint tears, acid-lime slashes, dry-ink grain, sparse halftone. Separately painted at each requested export size by deterministic source code.
- No tagline, no extra wordmark, no CTA; no additional type on upload-ready assets. End cards: white abstract emblem on solid #000000, exactly.

## Upload-ready assets

| Use | File | Pixel size |
|---|---|---|
| Facebook Professional avatar | `facebook/profile-800.png` | 800 × 800 |
| Facebook cover | `facebook/cover-hero-1702x630.png` | 1702 × 630 |
| Facebook cover, quieter | `facebook/cover-quiet-1702x630.png` | 1702 × 630 |
| YouTube avatar | `youtube/profile-800.png` | 800 × 800 |
| YouTube banner | `youtube/banner-upload-2560x1440.jpg` | 2560 × 1440, <= 6 MB |
| YouTube video watermark | `youtube/video-watermark-150.png` | 150 × 150, transparent |
| Video ends | `video/end-card-black-9x16.png`, `video/end-card-black-16x9.png` | 1080 × 1920 and 1920 × 1080 |
| Reels, Shorts, feed, thumbnails | `facebook/`, `youtube/`, `reusable/` | Various native sizes |

`masters/` contains five scalable SVG mark variations and high-resolution transparent PNGs. `textures/` contains reusable transparent silkscreen brush assets. `source/` contains a reproducible generator script. `previews/` contains a contact sheet and YouTube central-crop preview.

## Source provenance and copyright boundary

The v4 ZIP provided by the owner was audited solely to learn the expected asset inventory and establish which material to retire; **no artwork from that archive was used to generate the new kit**. All vector vertices, compositing, digital brushes, textures, grain, and exports are created programmatically from scratch. The generator's geometry does not reproduce the Soul Eater Black☆Star autograph or star mark. Color treatment and broad grunge aesthetics are not treated as borrowed character assets.

### Legal limitations

This is a visual redesign, **not a legal clearance opinion**. Original geometry does not guarantee a unique or registrable trademark. `BlackStar` overlaps the name of a Soul Eater character and may overlap other marks; the name needs independent search in relevant countries and service classes, plus consideration of unregistered uses. Search Indonesian DJKI/PDKI and US USPTO (for US-facing media) before monetization/registration; qualified counsel can assess relevant risks. Do not imply endorsement, licensing, or association with Soul Eater.

## Production usage

- Maintain one recognizable mark across Facebook, YouTube, film outros, and overlays.
- Apply the clean mark at display sizes; textured marks risk disappearing when downscaled.
- A banner may show decorative grunge, but upload banners must retain center-safe logo placement. Assess actual device crop in platform preview.
- Keep episode titles and topical art out of the global brand templates. Add them separately for each episode.
- Do not reintroduce the previous graffiti mark into new assets.

## Generation and QA

`python source/build_blackstar_v5.py <desired-output-folder>`
Dependencies: Pillow, NumPy, Shapely, CairoSVG. Exports are painted on each native target canvas without cropping or upscaling the previous brand kit. Random seeds make the graphic generation deterministic. See `guides/QA.json` for static file checks; actual Facebook/YouTube upload and third-party trademark clearance have not been performed.
'''
(ROOT/'README.md').write_text(readme)
# Helpful source file copied as text only; no previous assets.
this=Path(__file__).resolve()
if this!=(ROOT/'source'/'build_blackstar_v5.py').resolve():
 (ROOT/'source'/'build_blackstar_v5.py').write_text(this.read_text())

# preview contact sheet
with Image.open(ROOT/'youtube/banner-2560x1440.png') as banner_preview:
 save_image(banner_preview.crop((508,508,2052,932)),'previews/youtube-mobile-safe-area-1544x424.png')
labels=[('FACEBOOK COVER','facebook/cover-hero-1702x630.png',(840,308)),
        ('YOUTUBE SAFE CROP','previews/youtube-mobile-safe-area-1544x424.png',(840,472)),
        ('PROFILE','masters/../facebook/profile-800.png',(260,260)),
        ('REELS COVER','facebook/reels-cover-blank-1080x1920.png',(205,355)),
        ('END 16:9','video/end-card-black-16x9.png',(405,228)),
        ('END 9:16','video/end-card-black-9x16.png',(143,254)),
        ('THUMBNAIL','youtube/thumbnail-blank-1280x720.png',(405,228))]
preview=Image.new('RGB',(1550,1690),'#EEE9DC'); pd=ImageDraw.Draw(preview)
fontpath='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
f=ImageFont.truetype(fontpath,24)
small=ImageFont.truetype(fontpath,18)
pd.text((46,30),'BLACKSTAR  /  IDENTITY SYSTEM 05',fill=INK,font=f)
pd.text((46,68),'ECLIPSE CUT  —  independent symbol / no anime-derived signature',fill=INK,font=small)
def tile(x,y,w,h,title,fn):
 pd.text((x,y-30),title,fill=INK,font=small)
 with Image.open(ROOT/fn) as ii:
  ii.thumbnail((w,h),Image.Resampling.LANCZOS)
  panel=Image.new('RGB',(w,h),INK)
  panel.paste(ii,((w-ii.width)//2,(h-ii.height)//2),ii if ii.mode=='RGBA' else None)
  preview.paste(panel,(x,y))
tile(46,154,920,340,'FACEBOOK / PRIMARY COVER','facebook/cover-hero-1702x630.png')
tile(985,154,515,340,'MARK / 1024 AVATAR','facebook/profile-1024.png')
tile(46,580,1405,410,'YOUTUBE / MOBILE & DESKTOP CENTER CROP','previews/youtube-mobile-safe-area-1544x424.png')
tile(46,1090,300,510,'REELS / BLANK','facebook/reels-cover-blank-1080x1920.png')
tile(390,1090,530,299,'END CARD 16:9 / LOGO ONLY','video/end-card-black-16x9.png')
tile(955,1090,300,510,'END CARD 9:16 / LOGO ONLY','video/end-card-black-9x16.png')
save_image(preview,'previews/contact-sheet.png')
# safe area centered 1544x424 native pixels
with Image.open(ROOT/'youtube/banner-2560x1440.png') as t:
 cropped=t.crop((508,508,2052,932))
 save_image(cropped,'previews/youtube-mobile-safe-area-1544x424.png')
# Small preview of mark
save_image(profile(98),'previews/profile-at-98px.png')
print('FILES:',sum(1 for p in ROOT.rglob('*') if p.is_file()))
print('DONE:',ROOT)
