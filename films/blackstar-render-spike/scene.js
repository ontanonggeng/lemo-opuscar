import { init, frame, shape, rect, rr, ell, fillOnly, stroke, dot, scale, S, g } from '/styles/scifi-toon/demo/toon.js';
import { drawActor } from './rig.js';
const canvas=document.getElementById('stage');
canvas.width=innerWidth;canvas.height=innerHeight;init(canvas);
const timeline=await fetch('./timeline.json').then(r=>{if(!r.ok)throw Error('Timeline missing');return r.json()});
if(timeline.durationFrames!==144||timeline.fps!==24||timeline.characterFps!==12)throw Error('Invalid fixture timeline');
const wm=new Image();wm.src='./out/corner-watermark.png';await wm.decode();
const portrait=innerHeight>innerWidth, W=portrait?540:960,H=portrait?960:540;
if(canvas.width!==W*2||canvas.height!==H*2)throw Error('Unsupported fixture viewport');
const ink='#252329', smooth=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)};
const at=id=>timeline.beats.find(b=>b.id===id).frame/timeline.fps;
function box(x,y,w,h,r,c,lw=4){shape(rr(x,y,w,h,r),{fill:c,lw,line:ink})}
function room(){
  fillOnly(rect(0,0,W,H),'#83968a',{boil:0});
  fillOnly(rect(0,H*.76,W,H*.24),'#526460',{boil:0});
  for(let x=32;x<W;x+=117)stroke([[x,0],[x,H*.76]],3,{line:'#62786e'});
  stroke([[0,H*.76],[W,H*.76]],5,{line:ink});
  box(W*.12,H*.12,W*.28,H*.19,9,'#475b56');
  box(W*.14,H*.14,W*.24,H*.14,6,'#bdc4ab',3);
  for(let x=W*.17;x<W*.36;x+=20)stroke([[x,H*.16],[x,H*.26]],2,{line:'#899786'});
  box(W*.62,H*.11,W*.25,H*.11,7,'#c4b691');
  for(let x=W*.65;x<W*.84;x+=14)dot(x,H*.165,2.3,ink);
}
function bench(t){
  const x=portrait?110:360,y=portrait?620:359,w=portrait?290:240;
  box(x,y,w,70,6,'#78877b',6);
  box(x+14,y+70,20,66,4,'#495955',5);
  box(x+w-34,y+70,20,66,4,'#495955',5);
  box(x+w*.38,y-79,90,80,8,'#455753',6);
  box(x+w*.38+9,y-70,72,55,5,'#273b39',3);
  const d=smooth((t-at('reaction'))/.6);
  const cx=x+w*.38+21,cy=y-29;
  stroke([[cx,cy],[cx+15,cy],[cx+22,cy-22*d],[cx+36,cy-22*d],[cx+49,cy-5*d]],3,{line:'#e5bc74'});
}
window.DUR=timeline.durationFrames/timeline.fps;
window.EV=[];
window.render=t=>{
  const f=Math.max(0,Math.min(timeline.durationFrames-1,Math.floor(t*timeline.fps+1e-6)));
  const q=Math.floor(f/2)/timeline.characterFps;
  // Reset all Canvas state and paint every pixel before resampled vector shapes.
  // Resampled corner vertices need not fully cover an antialiased framebuffer.
  canvas.width=canvas.width;
  frame(f/timeline.fps);S.lwScale=1;
  g.globalAlpha=1;g.globalCompositeOperation='source-over';
  g.fillStyle='#83968a';g.fillRect(0,0,canvas.width,canvas.height);
  scale(2);
  room();bench(q);
  const lift=smooth((q-at('lift'))/1.4)*(1-.18*smooth((q-at('settle'))/.7));
  const alarm=smooth((q-at('reaction'))/.35)*(1-.55*smooth((q-at('settle'))/.7));
  const a={lift,meter:true,look:1,lean:Math.sin(q*2)*1.7,blink:f>=26&&f<30};
  const b={alarm,look:-1,lean:Math.sin(q*1.7)*2,blink:f>=66&&f<70};
  if(portrait){drawActor('mara',145,590,.94,a);drawActor('tobin',342,800,.92,b);}
  else{drawActor('mara',260,465,1,a);drawActor('tobin',716,465,1,b);}
  // Draw the actual archive watermark after the scene, with aspect preserved.
  g.setTransform(1,0,0,1,0,0);
  const w=portrait?80:95,h=w*wm.naturalHeight/wm.naturalWidth;
  g.drawImage(wm,portrait?82:42,portrait?180:42,w,h);
};
window.render(0);window.READY=true;
