import { init, frame, shape, rect, rr, ell, fillOnly, stroke, dot, push, pop, translate, scale, S, g } from '/styles/scifi-toon/demo/toon.js';
import { drawActor } from './rig.js';
const canvas=document.getElementById('stage');
canvas.width=innerWidth;canvas.height=innerHeight;
// Choose an opaque, readback-oriented 2D context before native toon init.
// Chromium may otherwise switch GPU/CPU rasterization after repeated getImageData.
// Apply the same context policy to video capture, screenshots and hash tests.
const stableContext=canvas.getContext('2d',{alpha:false,willReadFrequently:true,colorSpace:'srgb'});
if(!stableContext||init(canvas)!==stableContext)throw Error('Canvas context initialization mismatch');
const attrs=stableContext.getContextAttributes();
if(attrs.alpha!==false||attrs.willReadFrequently!==true||attrs.colorSpace!=='srgb')throw Error('Unexpected Canvas raster policy');
window.CANVAS_POLICY=attrs;
const timeline=await fetch('./timeline.json').then(r=>{if(!r.ok)throw Error('Timeline missing');return r.json()});
if(timeline.durationFrames!==144||timeline.fps!==24||timeline.characterFps!==12)throw Error('Invalid fixture timeline');
const wm=new Image();wm.src='./out/corner-watermark.png';await wm.decode();
const portrait=innerHeight>innerWidth, W=portrait?540:960,H=portrait?960:540;
if(canvas.width!==W*2||canvas.height!==H*2)throw Error('Unsupported fixture viewport');
const ink='#211e29', smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
const at=id=>timeline.beats.find(b=>b.id===id).frame/timeline.fps;
const floorY=portrait?590:356;
const layouts=portrait?{mara:{x:123,y:727,k:1.20},tobin:{x:374,y:752,k:1.13},bench:{x:195,y:562,w:155,h:85}}:{mara:{x:225,y:492,k:1.23},tobin:{x:731,y:495,k:1.18},bench:{x:357,y:338,w:254,h:105}};
for(const a of [layouts.mara,layouts.tobin])if(a.y<=floorY+55||a.y>H-30)throw Error('Ground anchor is outside the walkable floor');
const P=(pts,c,lw=4,o={})=>shape(pts,{fill:c,lw,line:ink,...o});
const F=(pts,c)=>fillOnly(pts,c,{boil:0});
const L=(pts,lw=3,c=ink)=>stroke(pts,lw,{line:c});
function box(x,y,w,h,r,c,lw=4,o={}){P(rr(x,y,w,h,r),c,lw,o)}
function oval(x,y,rx,ry,c,lw=3,o={}){P(ell(x,y,rx,ry),c,lw,o)}
function panel(x,y,w,h){
 box(x,y,w,h,9,'#4b6463',5,{shade:()=>F([[x+w-15,y],[x+w,y],[x+w,y+h],[x+w-26,y+h]],'#344d4e')});
 box(x+11,y+11,w-22,h-22,5,'#b9c5b2',3);
 F([[x+14,y+14],[x+w-13,y+14],[x+w-13,y+25],[x+14,y+35]],'#d8d7b9');
 for(let i=22;i<w-16;i+=19)L([[x+i,y+30],[x+i,y+h-18]],2,'#80978b');
 for(const X of [x+7,x+w-7])for(const Y of [y+7,y+h-7])dot(X,Y,2.2,'#d0c7a3');
}
function room(){
 // Planes are fixed in screen-space layout, with a single visible wall/floor break.
 F(rect(0,0,W,H),'#748b80');
 F([[0,0],[W,0],[W,portrait?110:76],[0,portrait?140:91]],'#536b65');
 const beamY=portrait?120:65;
 F(rect(0,beamY,W,18),'#405958');L([[0,beamY+18],[W,beamY+18]],4,'#344946');
 // Small ceiling fixtures; light stays flat, not a gradient.
 const fx=W*.49;
 box(fx-68,beamY-29,136,21,6,'#344b4b',5);box(fx-56,beamY-23,112,9,4,'#ddc99b',0,{stroke:false});
 F([[fx-59,beamY-7],[fx+58,beamY-7],[fx+116,floorY-15],[fx-119,floorY-15]],'#83998a');
 for(let x=42;x<W;x+=portrait?123:157)L([[x,beamY+18],[x,floorY-15]],2,'#627b71');
 // A low equipment panel with visible depth and functional fasteners.
 const vx=portrait?42:62,vy=portrait?177:99,vw=portrait?151:184,vh=portrait?105:89;
 panel(vx,vy,vw,vh);
 const cx=portrait?390:W-167,cy=portrait?196:112,cw=portrait?100:142,ch=portrait?120:102;
 box(cx,cy,cw,ch,7,'#4b6560',5);
 box(cx+9,cy+9,cw-18,28,4,'#253d38',3);
 for(let i=0;i<3;i++){oval(cx+19+i*20,cy+23,4,4,i===0?'#d8b371':'#819d88',2);}
 for(let i=0;i<4;i++)L([[cx+14,cy+48+i*11],[cx+cw-14,cy+48+i*11]],2.5,'#314b46');
 // Conduit routes and mounting clips, not decorative HUD noise.
 const px=portrait?516:W-22;
 L([[px,beamY+20],[px,cy+ch+30],[cx+cw*.64,cy+ch+30],[cx+cw*.64,cy+ch]],10,'#465e5c');
 L([[px-2,beamY+20],[px-2,cy+ch+26],[cx+cw*.64,cy+ch+26]],2.3,'#b0b7a0');
 for(let yy=beamY+44;yy<cy+ch+12;yy+=53)box(px-8,yy,16,9,2,'#a29b82',2);
 // Floor extends to every character foot; tiles converge toward the wall.
 F(rect(0,floorY,W,H-floorY),'#445b59');
 F([[0,floorY],[W,floorY],[W,floorY+36],[0,floorY+21]],'#526c66');
 for(let x=-W;x<=W*2;x+=portrait?125:185){
  const vx=W*.55+(x-W*.55)*.20;
  L([[vx,floorY+3],[x,H+10]],2.5,'#3a514f');
 }
 for(const f of [.18,.44,.79])L([[0,floorY+(H-floorY)*f],[W,floorY+(H-floorY)*f]],2.5,'#3a514f');
 box(-8,floorY-14,W+16,17,1,'#435e58',3);
}
function shadow(x,y,k){
 // Flat, unoutlined floor contact shadow (not a floating outlined puddle).
 F(ell(x,y-1,55*k,8*k),'#304845');
}
function bench(t){
 const {x,y,w,h}=layouts.bench,d=portrait?21:29;
 // Four feet rest on the projected floor; shaded chassis and top plane.
 const bottom=y+h+d;
 const legBottom=portrait?689:473;
 F(ell(x+w/2,legBottom-1,w*.55,9),'#304845');
 for(const lx of [x+12,x+w-28])box(lx,y+h-5,15,legBottom-y-h+5,3,'#344846',4);
 P([[x-5,y],[x+12,y-d],[x+w+13,y-d],[x+w+5,y]],'#a3b09b',5);
 box(x-5,y,w+10,h,6,'#657d74',6,{shade:()=>F([[x+w-30,y],[x+w+8,y],[x+w+8,bottom],[x+w-45,bottom]],'#4b625e')});
 box(x+7,y+10,w*.47,h-21,4,'#526b64',4);
 box(x+w*.52,y+10,w*.40,h-21,4,'#82978a',4);
 L([[x+16,y+21],[x+w*.40,y+21]],3);
 L([[x+w*.64,y+22],[x+w*.82,y+22]],3);
 for(let i=0;i<3;i++)oval(x+w*.70+i*10,y+h-20,2.5,2.5,'#3b5350',1);
 const mw=portrait?102:128,mh=portrait?88:94,mx=x+w/2-mw/2,my=y-d-mh-13;
 box(mx+mw*.33,my+mh-1,mw*.34,14,3,'#354c4c',4);
 P([[mx,my+mh],[mx+mw,my+mh],[mx+mw-6,my+mh+8],[mx+6,my+mh+8]],'#738b80',3);
 box(mx,my,mw,mh,9,'#2e4547',6,{shade:()=>F([[mx+mw-16,my],[mx+mw,my],[mx+mw,my+mh],[mx+mw-25,my+mh]],'#233739')});
 box(mx+9,my+9,mw-20,mh-29,4,'#1d3332',3);
 const cx=mx+16,cy=my+mh*.52,span=mw-34;
 for(let i=0;i<3;i++)L([[cx,cy-11+i*12],[cx+span,cy-11+i*12]],1.2,'#35564e');
 const z=smooth((t-at('reaction'))/.6);
 L([[cx,cy],[cx+span*.22,cy],[cx+span*.40,cy-21*z],[cx+span*.67,cy-21*z],[cx+span,cy-4*z]],3,'#e4be76');
 oval(mx+mw-16,my+mh-10,4,4,z>.4?'#dbb16c':'#789587',2);
}
window.DUR=timeline.durationFrames/timeline.fps;window.EV=[];
window.render=t=>{
 const f=Math.max(0,Math.min(timeline.durationFrames-1,Math.floor(t*timeline.fps+1e-6)));
 const q=Math.floor(f/2)/timeline.characterFps;
 canvas.width=canvas.width;frame(f/timeline.fps);S.lwScale=1;
 g.globalAlpha=1;g.globalCompositeOperation='source-over';g.fillStyle='#748b80';g.fillRect(0,0,canvas.width,canvas.height);
 scale(2);
 room();bench(q);
 const anticipation=smooth((q-at('lift')+.32)/.32)*(1-smooth((q-at('lift'))/.25));
 const lift=smooth((q-at('lift'))/1.4)*(1-.18*smooth((q-at('settle'))/.7));
 const alarm=smooth((q-at('reaction'))/.30)*(1-.55*smooth((q-at('settle'))/.7));
 const a={lift,meter:true,look:.85,lean:-3*anticipation+3*lift,blink:f>=26&&f<30};
 const b={alarm,look:-.8,lean:Math.sin(q*1.7)*1.3+7*alarm,blink:f>=66&&f<70};
 for(const a of [layouts.mara,layouts.tobin])shadow(a.x,a.y,a.k);
 drawActor('mara',layouts.mara.x,layouts.mara.y,layouts.mara.k,a);
 drawActor('tobin',layouts.tobin.x,layouts.tobin.y,layouts.tobin.k,b);
 // Exact v5 raster asset; intentionally placed in an uncluttered corner.
 g.setTransform(1,0,0,1,0,0);
 const w=portrait?72:82,h=w*wm.naturalHeight/wm.naturalWidth;
 g.drawImage(wm,portrait?82:42,portrait?180:42,w,h);
};
window.render(0);window.READY=true;
