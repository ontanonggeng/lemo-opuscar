import {clamp,lerp,hash} from '/core/lib.js';
import {init,frame,push,pop,translate,rotate,scale,S,g,shape,fillOnly,stroke,ell,arc,spline,rr,rect,text,INK} from '/styles/scifi-toon/demo/toon.js';
import {nora,cal,fork,mater,forkling,P} from './chars.js';
import {DUR,q,VO,shotAt,T} from './story.js';

const canvas=document.getElementById('stage');canvas.width=innerWidth;canvas.height=innerHeight;init(canvas);
const U=canvas.width/540;
if(Math.abs(canvas.height/canvas.width-16/9)>.02)throw Error('One Clean Fork requires native 9:16');
const lines=await fetch('./lines.json').then(r=>r.json());
const dur=await fetch('./voices/dur.json').then(r=>r.json());
const lips=await fetch('./voices/lips.json').then(r=>r.json());
await document.fonts.ready;
const WM=new Image();WM.src='/brand/blackstar/v5/video/corner-watermark-white-512.png';await WM.decode();

const PAL={wall:'#d4c6ad',wallS:'#b4a38b',cab:'#9b694f',cabS:'#735044',counter:'#d39a68',floor:'#6d6972',
 navy:'#374755',orange:'#d17148',cream:'#f2e3c5',metal:'#999b98',metalS:'#676c6b',sink:'#526570',
 dish:'#e4d6bb',dark:'#201a27',cyan:P.cyan,noodle:P.noodle,red:'#c14f4e'};
const seg=(t,a,b)=>clamp((t-a)/(b-a),0,1),ss=x=>x*x*(3-2*x),ei=x=>1-Math.pow(1-clamp(x),3);
const Q=t=>q(t);
const voByWho=(who,t)=>{
 const tq=Q(t);
 for(const L of lines){
  const start=VO[L.id], d=dur[L.id]||0;
  if(L.who===who&&tq>=start&&tq<start+d){
    const i=Math.max(0,Math.min((lips[L.id]?.o||[]).length-1,Math.floor((tq-start)*24)));
    return {o:lips[L.id]?.o?.[i]||0,b:lips[L.id]?.b?.[i]||0,id:L.id};
  }
 }
 return {o:0,b:0,id:null};
};
const cam=(cx=270,cy=480,z=1)=>{
 translate(270,480);scale(z);translate(-cx,-cy);
};
const bg=col=>{g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle=col;g.fillRect(0,0,canvas.width,canvas.height);g.restore()};
const sh=(pts,fill,lw=5,shade=null)=>shape(pts,{fill,lw,shade});
const R=(x,y,w,h,r0,f,lw=5)=>sh(rr(x,y,w,h,r0),f,lw);
const E=(x,y,rx,ry,f,lw=5)=>sh(ell(x,y,rx,ry,36),f,lw);

function kitchen(t,{mess=.35,power=true}={}){
 bg(PAL.wall);
 // flat wall/cabinet palette with hard shadow plane
 fillOnly(rect(0,0,540,960),PAL.wall,{boil:.2});
 fillOnly([[332,0],[540,0],[540,960],[382,960]],PAL.wallS,{boil:.25});
 // upper cabinets
 for(const [x,w] of [[20,142],[176,142],[333,187]]){
  R(x,80,w,180,10,PAL.cab,6);
  fillOnly(rect(x+w*.68,85,w*.32,170),PAL.cabS,{boil:.35});
  stroke([[x+w/2,86],[x+w/2,254]],4);
  E(x+w*.78,170,5,7,PAL.cream,2);
 }
 // refrigerator left
 R(18,286,126,285,12,'#677983',7);
 fillOnly(rect(99,291,40,274),'#4c606c',{boil:.3});
 stroke([[31,399],[128,399]],5);R(112,329,9,55,4,PAL.metal,3);
 // counter and cupboards
 R(149,306,372,245,9,PAL.counter,6);
 fillOnly(rect(380,312,136,232),'#a46f52',{boil:.35});
 R(149,294,372,30,5,PAL.cream,5);
 for(let x=164;x<500;x+=82){R(x,392,68,145,5,PAL.cab,5);E(x+54,455,4,5,PAL.cream,2)}
 // sink
 E(227,321,62,18,PAL.dark,4);E(227,318,55,12,PAL.sink,2);
 stroke(spline([[259,304],[271,278],[292,280],[293,314]],false),7);
 // dirty dish stack and noodle bowl; messy but readable
 for(let i=0;i<4;i++)E(347+i*3,304-i*5,37,8,i%2?PAL.dish:'#d5b9a1',4);
 R(385,279,70,31,9,'#d85f49',4);
 for(let i=0;i<7;i++)stroke([[395+i*8,292],[405+i*8,286]],2,{line:PAL.noodle});
 // floor
 fillOnly(rect(0,552,540,408),PAL.floor,{boil:.15});
 for(let y=588;y<960;y+=54)stroke([[0,y],[540,y-19]],2,{line:'#5d5965'});
 for(let x=32;x<540;x+=85)stroke([[x,555],[x-80,960]],1.5,{line:'#5a5660'});
 // table foreground
 E(280,786,190,33,'#3e3742',0);
 R(78,655,384,105,13,'#8d604d',6);
 fillOnly(rect(327,662,129,91),'#674a43',{boil:.3});
 // emergency fork frame on wall
 R(34,600,97,94,8,'#5f4a43',5);R(42,608,81,78,5,'#e7d2a8',3);
 text('EMERGENCY',82,620,{font:'800 8px "Baloo 2"',fill:INK});
 text('FORK',82,633,{font:'800 11px "Baloo 2"',fill:INK});
 fork(82,661,.55,.06);
 // MATER-8 sits as junk on the table
 mater(340,687,.72,{glow:power?.25:0,screen:power?'READY':'OFF',off:!power});
 // mess accents: no glows
 if(mess>.1){
  for(let i=0;i<4;i++)fork(160+i*22,708,.26,(i%2?.8:-.6));
 }
}
function forkCloud(t,count=30,{ceiling=false,progress=1}={}){
 for(let i=0;i<count;i++){
  const h1=hash(i*7.17),h2=hash(i*11.3+4),h3=hash(i*3.7+8);
  let x=110+h1*350,y=690-progress*(150+h2*580);
  const arcY=Math.sin(progress*Math.PI)*(120+80*h3);
  y-=arcY;
  const a=(h1-.5)*5+progress*(3+h3*8);
  fork(x,y,.28+.22*h2,a,{bent:h3>.78?.4:0});
 }
 if(ceiling){
  for(let i=0;i<12;i++){let x=45+i*41+(hash(i)*15-7),y=38+hash(i*2.1)*35;fork(x,y,.35,Math.PI+(hash(i*8)-.5)*.45)}
 }
}
function forkRain(t,a=35){
 const u=seg(t,T.spawn,T.machineGun+2.5);
 for(let i=0;i<a;i++){
  const delay=(i%10)*.055+Math.floor(i/10)*.12;
  const p=clamp((t-T.spawn-delay)/1.25,0,1);
  if(p<=0)continue;
  const sx=340+(hash(i*5)-.5)*70, sy=656;
  const ex=30+hash(i*7.1)*480, ey=175+hash(i*13.3)*570;
  const x=lerp(sx,ex,p),y=lerp(sy,ey,p)-Math.sin(p*Math.PI)*(100+hash(i*4)*140);
  fork(x,y,.22+.18*hash(i*2.4),p*7+(hash(i)-.5)*4);
 }
}
function talkN(t,extra={}){const m=voByWho('NORA',t);return {...extra,mouth:{o:m.o,w:1+.12*m.b,sm:extra.sm??-.2}}}
function talkC(t,extra={}){const m=voByWho('CAL',t);return {...extra,mouth:{o:m.o,w:1+.18*m.b,sm:extra.sm??-.5}}}

function disaster(t){
 cam(270,485,1);
 kitchen(t,{mess:1});
 forkCloud(t,38,{ceiling:true,progress:.72+.15*Math.sin(t*2)});
 forkRain(t,42);
 nora(talkN(t,{x:183,y:842,s:.78,face:1,lid:.56,look:[.65,-.1],armR:{h:[20,128],bend:18},t:Q(t)}));
 cal(talkC(t,{x:405,y:844,s:.82,face:-1,nerv:1,look:[-.4,-.8],brow:1.1,armL:{h:[-48,33],bend:-24},armR:{h:[49,24],bend:30},t:Q(t)}));
}
function noraCU(t){
 const z=lerp(1.85,2.02,seg(t,2.4,5.7));
 cam(185,440,z);kitchen(t,{mess:1});forkCloud(t,16,{ceiling:true,progress:.8});
 nora(talkN(t,{x:183,y:842,s:.78,face:1,lid:.6,look:[.65,-.05],brow:-.1,t:Q(t),armR:{h:[18,128],bend:15}}));
}
function forkFrame(t){
 cam(82,647,3.4);kitchen(t,{mess:.5});
 const tap=seg(t,6.0,6.45);if(tap>0)stroke([[55,630],[109,692]],3,{line:'#ffffff'});
}
function twoEmergency(t){
 cam(278,500,1.12);kitchen(t,{mess:.4});
 const reach=ss(seg(t,9.85,10.1));
 nora(talkN(t,{x:190,y:842,s:.78,face:1,lid:.5,look:[-.6,.1],t:Q(t),armL:{h:[-70,-90*reach+105],bend:-45}}));
 cal(talkC(t,{x:404,y:844,s:.82,face:-1,nerv:.5,look:[-.6,-.1],brow:.8,t:Q(t),armR:{h:[25,90],bend:20}}));
}
function load(t){
 cam(317,635,1.8);kitchen(t,{mess:.4});
 const u=ss(seg(t,10.35,12.2));
 const fx=lerp(122,321,u),fy=lerp(645,650,u);
 nora(talkN(t,{x:190,y:842,s:.78,face:1,lid:.5,look:[.65,.3],t:Q(t),armL:{h:[-20,75],bend:-20}}));
 fork(fx,fy,.48,lerp(.1,1.58,u));
 mater(340,687,.72,{glow:.35+u*.6,lever:u,screen:u>.75?'COPY 1':'READY'});
}
function copyInsert(t){
 cam(340,650,2.62);kitchen(t,{mess:.4});
 const p=ss(seg(t,13.15,13.82));
 mater(340,687,.72,{glow:1,lever:1,screen:p<.35?'COPYING':'COPY COMPLETE',units:p<.35?'QTY 1':'QTY 2'});
 // One fork visibly becomes two above the slot; props move on ones.
 const spread=44*p;
 fork(340-spread,615,.62,-1.57-.15*p);fork(340+spread,615,.62,1.57+.15*p);
}
function calStop(t){
 cam(405,451,2.0);kitchen(t,{mess:.4});
 cal(talkC(t,{x:404,y:844,s:.82,face:-1,nerv:.55,look:[-.5,.3],brow:.8,t:Q(t),armR:{h:[40,20],bend:28}}));
}
function terminal(t){
 cam(340,679,2.75);kitchen(t,{mess:.5});
 const u=seg(t,16.3,18.95),num=Math.round(lerp(2,384,ss(seg(t,16.65,17.25))));
 mater(340,687,.72,{glow:.85,lever:1,screen:'HOUSEHOLD MODE',units:'UTENSIL DEFICIT: '+num});
 // Cal's shoulder OTS
 fillOnly(spline([[475,660],[540,623],[540,820],[466,811]]),P.shirtC,{boil:.5});stroke([[473,660],[473,809]],7);
}
function noraReact(t){
 cam(185,440,2.02);kitchen(t,{mess:.55});
 nora(talkN(t,{x:183,y:842,s:.78,face:1,lid:.59,look:[.95,.05],brow:.1,t:Q(t)}));
}
function objectThenReaction(t,kind){
 const starts={toasterFork:20.8,lampFork:22.75,slipperForks:24.55};const st=starts[kind];const local=t-st;
 if(local<.82){
  cam(kind==='slipperForks'?415:kind==='lampFork'?470:250,kind==='slipperForks'?825:kind==='lampFork'?490:360,kind==='slipperForks'?2.5:2.2);
  kitchen(t,{mess:.8});
  if(kind==='toasterFork'){R(215,342,70,50,9,'#ca6f49',5);fork(249,344,.5,Math.PI);}
  if(kind==='lampFork'){stroke([[470,401],[470,510]],7);shape(spline([[426,458],[514,458],[496,500],[445,500]]),{fill:'#d6b777',lw:6});fork(471,474,.56,.45)}
  if(kind==='slipperForks'){fork(437,829,.55,-.4);fork(456,820,.46,.8);fork(418,815,.43,-1.1)}
 }else{
  cam(404,446,2.0);kitchen(t,{mess:.85});forkRain(t,12);
  cal(talkC(t,{x:404,y:844,s:.82,face:-1,nerv:kind==='slipperForks'?1:.7,look:[-.8,-.2],brow:1.2,t:Q(t),armR:{h:[48,20],bend:30}}));
 }
 if(t>24.7)forkRain(t,42);
}
function forklingReveal(t){
 if(t<28.45){
  cam(385,670,2.5);kitchen(t,{mess:1});forkRain(t,30);
  const u=ss(seg(t,27.5,28.2));forkling(387,690-45*u,.9,t,{});
 }else{
  cam(405,448,2.0);kitchen(t,{mess:1});forkRain(t,22);
  cal(talkC(t,{x:404,y:844,s:.82,face:-1,nerv:1,look:[-.9,.2],brow:1.3,t:Q(t),armL:{h:[-50,20],bend:-28}}));
 }
}
function calMoved(t){
 cam(405,448,2.02);kitchen(t,{mess:1});forkRain(t,18);
 cal(talkC(t,{x:404,y:844,s:.82,face:-1,nerv:1,look:[-.95,.1],brow:1.35,t:Q(t),armR:{h:[55,14],bend:32}}));
}
function plug(t){
 if(t<32.38){
  cam(184,445,2.03);kitchen(t,{mess:1,power:true});forkRain(t,14);
  nora(talkN(t,{x:183,y:842,s:.78,face:1,lid:.62,look:[.8,.05],brow:-.05,t:Q(t)}));
  return;
 }
 // Physical action insert: Cal's hand anticipates, grabs, then pulls the plug out on ones.
 cam(461,704,2.5);kitchen(t,{mess:1,power:t<33.25});
 const grab=ss(seg(t,32.38,32.78)),pull=ss(seg(t,32.78,33.28));
 stroke(spline([[375,695],[420,716],[487-82*pull,708]],false),7,{line:PAL.dark});
 R(478-82*pull,695,22,28,5,'#333139',5);
 R(501,688,24,44,5,'#5f5556',5);stroke([[507,699],[519,699],[519,721],[507,721]],3,{line:'#c9c2ae'});
 // forearm enters from lower-right; fist closes around the plug before the pull.
 shape(spline([[540,820],[500,805],[485-78*pull,725],[461-73*pull,714],[449-65*pull,734],[480,827]]),{fill:P.skinC,lw:7});
 if(grab>.4){stroke([[462-70*pull,715],[476-72*pull,719]],4,{line:P.skinCs});}
 if(t>=33.28){
  // Return to the pair for the aftermath.
  cam(270,510,1.1);kitchen(t,{mess:1,power:false});
  nora({x:182,y:842,s:.78,face:1,lid:.58,look:[.5,.1],t:Q(t)});
  cal({x:409,y:844,s:.82,face:-1,nerv:.25,look:[-.7,.1],t:Q(t)});
 }
}
function silence(t){
 const z=lerp(1.05,1.16,seg(t,34.6,38.5));
 cam(270,510,z);kitchen(t,{mess:1,power:false});
 forkCloud(t,18,{ceiling:true,progress:.8});
 nora({x:184,y:842,s:.78,face:1,lid:.58,look:[.6,.1],t:Q(t)});
 cal({x:405,y:844,s:.82,face:-1,nerv:.05,look:[-.65,.1],lid:.2,t:Q(t)});
 forkling(386,704,.72,t,{peek:.6});
 if(t>T.drop){const p=seg(t,T.drop,38.5);fork(280,70+p*570,.38,p*5)}
}
function bowlInsert(t){
 cam(418,294,2.45);kitchen(t,{mess:1,power:false});
 // empty bowl, no noodle marks
 E(418,294,50,17,'#df6d51',5);shape(spline([[368,294],[468,294],[453,336],[383,336]]),{fill:'#d65f49',lw:6,shade:()=>fillOnly(rect(429,290,40,50),'#a8473d',{boil:.3})});
}
function massInsert(t){
 cam(340,686,3.0);kitchen(t,{mess:1,power:false});
 mater(340,687,.72,{off:false,glow:.55,screen:'MASS = MASS',units:'NOODLES → FORKS'});
}
function calDinner(t){
 cam(404,449,2.05);kitchen(t,{mess:1,power:false});
 cal(talkC(t,{x:404,y:844,s:.82,face:-1,nerv:.35,look:[-.7,.1],brow:.65,t:Q(t),armL:{h:[-40,35],bend:-20}}));
}
function noraUtensils(t){
 cam(184,445,2.03);kitchen(t,{mess:1,power:false});
 nora(talkN(t,{x:183,y:842,s:.78,face:1,lid:.62,look:[.8,.05],brow:-.05,t:Q(t)}));
}
function button(t){
 cam(270,520,1.12);kitchen(t,{mess:1,power:false});
 forkCloud(t,16,{ceiling:true,progress:.8});
 nora({x:184,y:842,s:.78,face:1,lid:.58,look:[.5,.15],t:Q(t)});
 cal({x:405,y:844,s:.82,face:-1,nerv:.15,look:[-.5,.15],t:Q(t)});
 // empty bowl on table
 E(270,691,44,14,'#df6d51',5);shape(spline([[226,691],[314,691],[300,728],[240,728]]),{fill:'#d65f49',lw:6});
 const p=ss(seg(t,46.58,47.35));fork(270,118+p*565,.62,p*6);
 if(t>47.05)forkling(310,700,.48,t,{peek:1});
}

const SH={
 disaster,noraCU,forkFrame,twoEmergency,load,copyInsert,calStop,terminal,noraReact,
 toasterFork:(t)=>objectThenReaction(t,'toasterFork'),
 lampFork:(t)=>objectThenReaction(t,'lampFork'),
 slipperForks:(t)=>objectThenReaction(t,'slipperForks'),
 forkling:forklingReveal,calMoved,plug,silence,bowl:bowlInsert,mass:massInsert,calDinner,noraUtensils,button
};

const makeSubs=()=>{
 const arr=[];
 for(const L of lines){
  const t0=VO[L.id], speech=dur[L.id]||1;
  let t1=t0+Math.max(speech+.35,.9+(L.sub||L.text).length/17);
  // clip before intentional silent cold beat and before final button
  if(t0<34.6&&t1>34.55)t1=34.55;
  if(t0<46.5&&t1>46.45)t1=46.45;
  arr.push({id:L.id,who:L.who,text:L.sub||L.text,t0,t1:Math.min(t1,DUR-.05)});
 }
 return arr;
};
window.SUBS=makeSubs();
window.TEXTS=t=>window.SUBS.filter(s=>t>=s.t0&&t<s.t1).map((s,i)=>({id:s.id,text:s.text,x0:28,y0:760+i*78,x1:512,y1:855+i*78}));
function captions(t){
 const active=window.SUBS.filter(s=>t>=s.t0&&t<s.t1);
 if(!active.length)return;
 g.save();g.setTransform(U,0,0,U,0,0);
 active.slice(-2).forEach((a,idx)=>{
  const old=idx<active.slice(-2).length-1;g.globalAlpha=old?.7:1;
  const words=a.text.split(' '),rows=[];let row='';
  for(const w of words){const z=row?row+' '+w:w;if(z.length>28&&row){rows.push(row);row=w}else row=z}if(row)rows.push(row);
  const y=820-(rows.length-1)*25-idx*75;
  g.font='800 14px "Baloo 2"';const pill=a.who==='NORA'?'#d17148':'#66778a';
  g.fillStyle=pill;g.beginPath();g.roundRect(32,y-44,78,27,9);g.fill();
  g.fillStyle='#fff';g.textAlign='center';g.textBaseline='middle';g.fillText(a.who,71,y-30);
  rows.forEach((r0,j)=>{
   g.font='800 27px "Baloo 2"';g.lineJoin='round';g.lineWidth=10;g.strokeStyle=INK;g.fillStyle='#fff';
   g.strokeText(r0,270,y+j*31);g.fillText(r0,270,y+j*31);
  });
 });g.restore();
}
function cornerMark(){
 g.save();g.setTransform(U,0,0,U,0,0);g.globalAlpha=.72;g.drawImage(WM,440,30,72,72);g.restore();
}
window.render=t=>{
 frame(t,{amp:1.7});S.lwScale=1;scale(U);
 const name=shotAt(t)[2];const f=SH[name];if(!f)throw Error('Missing shot '+name);f(t);
 captions(t);cornerMark();
};
window.DUR=DUR;window.READY=true;
