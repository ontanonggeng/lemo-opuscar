// BLACKSTAR — We Just Needed One Shipping Label
// Original 44 s vertical Sci-Fi Sitcom Toon, plus look-dev modes.
import { clamp,lerp,seg,ss,eo,ei,back,hash } from '/core/lib.js';
import { init,frame,g,reset,translate,scale,rotate,S,text,shape,rr,rect,fillOnly,stroke,ell } from '/styles/scifi-toon/demo/toon.js';
import { marn,kip } from './cast.js';
import { warehouse,printer,portal,sluglet,parcel,jellyStamp,WCOL } from './world.js';

const canvas=document.getElementById('c');canvas.width=innerWidth;canvas.height=innerHeight;init(canvas);
const params=new URLSearchParams(location.search), mode=params.get('mode')||'film';
const J=async p=>{try{const r=await fetch(p);if(r.ok)return await r.json()}catch{}return null};
const LINES=(await J('/films/portal-printer/lines.json'))||[];
const TL=(await J('/films/portal-printer/timeline.json'))||{duration:44,shots:[]};
const DURS=(await J('/films/portal-printer/voices/dur.json'))||{};
const LIPS=(await J('/films/portal-printer/voices/lips.json'))||{};
const WM=new Image();WM.src='/brand/blackstar/v5/video/corner-watermark-white-512.png';
try{await WM.decode()}catch{}
window.DUR=mode==='film'?44:1;window.EV=TL.events||[];
const q=t=>Math.floor(t*12+1e-6)/12;
function cam(cx,cy,z,rot=0,shake=0,t=0){
 reset();translate(innerWidth/2,innerHeight/2);
 if(shake){const k=Math.floor(t*24);translate((hash(k*3.7)-.5)*shake*2,(hash(k*7.1+9)-.5)*shake*2)}
 scale(z);if(rot)rotate(rot);translate(-cx,-cy);
}
const popOpen=x=>x<=0?0:Math.min(1.12,back(clamp(x/.30),1.7));
function talk(who,t){
 const tq=q(t);
 for(const l of LINES){
  if(l.who!==who)continue;
  const d=DURS[l.id]??Math.max(.5,l.text.length*.055);
  if(tq>=l.at&&tq<l.at+d){
   const lp=LIPS[l.id]?.o||[],k=Math.floor((tq-l.at)*24),o=lp[k]??(.35+.3*Math.sin(tq*20));
   return {o,w:.84+.22*(1-o),talking:true};
  }
 }
 return {o:0,w:1,talking:false};
}
function M(t,o={}){
 const a=talk('MARN',t),tq=q(t);
 return {x:825,y:1610,s:.91,face:-1,t,lid:.53,look:[-.45,-.08],brow:-.12,
  mouth:{o:a.o,w:a.w,sm:-.18},head:a.talking?(a.o-.25)*.035:Math.sin(tq*1.4)*.01,...o};
}
function K(t,o={}){
 const a=talk('KIP',t),tq=q(t);
 return {x:230,y:1610,s:.87,face:1,t,panic:.4,lid:.12,look:[.48,-.12],
  mouth:{o:a.o*1.12,w:a.w,sm:-.55},blink:Math.floor(tq*12)%43===0,...o};
}
function stage(t,{screen='READY',paper=0,paperText='OHIO',portalKind=null,portalOpen=0,portalR=235,boxY=1170,boxS=.9,damage=0,slime=0,shake=0}={}){
 warehouse(t);printer(540,910,.98,{screen,paper,paperText,shake,t});
 if(portalKind&&portalOpen>0)portal(540,575,portalR,t,{open:portalOpen,kind:portalKind});
 parcel(540,boxY,boxS,{damage,slime});
}
function tag(code,desc,col='#e46763'){
 g.save();g.setTransform(1,0,0,1,0,0);
 g.font='400 25px "VT323"';g.textAlign='left';g.textBaseline='top';
 g.fillStyle='rgba(27,20,34,.88)';g.fillRect(28,48,322,74);
 g.fillStyle=col;g.fillText(code,44,61);g.fillStyle='#fff7e7';g.fillText(desc,44,91);
 g.restore();
}
function subtitle(t){
 const l=LINES.find(x=>{
  const d=DURS[x.id]??Math.max(.5,x.text.length*.055);
  return t>=x.at&&t<x.at+d+.25;
 });
 if(!l)return;
 let rows=[],cur='';
 for(const w of l.text.split(/\s+/)){const trial=cur?cur+' '+w:w;if(trial.length>28&&cur){rows.push(cur);cur=w}else cur=trial}
 if(cur)rows.push(cur);rows=rows.slice(0,2);
 const y=1720-(rows.length-1)*31;
 g.save();g.setTransform(1,0,0,1,0,0);g.textAlign='center';g.textBaseline='middle';
 g.font='800 49px "Baloo 2"';g.lineJoin='round';g.lineWidth=11;g.strokeStyle='#1b1422';g.fillStyle='#fff';
 rows.forEach((r,i)=>{g.strokeText(r,540,y+i*58);g.fillText(r,540,y+i*58)});
 const pill=l.who==='MARN'?'#d39a3d':'#6f5a9f',name=l.who;
 g.fillStyle='#1b1422';g.beginPath();g.roundRect(35,y-34,142,46,18);g.fill();
 g.fillStyle=pill;g.beginPath();g.roundRect(41,y-29,130,36,14);g.fill();
 g.font='800 22px "Baloo 2"';g.fillStyle='#1b1422';g.fillText(name,106,y-11);
 g.restore();
}
function watermark(){
 if(!WM.complete||!WM.naturalWidth)return;
 g.save();g.setTransform(1,0,0,1,0,0);g.globalAlpha=.62;g.drawImage(WM,944,40,92,92);g.restore();
}
function filmShot(t){
 if(t<2.2)return 1;if(t<6.2)return 2;if(t<10.5)return 3;if(t<13.4)return 4;if(t<18)return 5;
 if(t<21)return 6;if(t<27)return 7;if(t<32.5)return 8;if(t<38.5)return 9;return 10;
}
// 0–2.2: mid-disaster hook.
function S1(t){
 const op=popOpen(t-.02),fall=eo(seg(t,.18,.88));
 cam(540,980,1.02,0,t<.45?9*(1-seg(t,.05,.45)):0,t);
 stage(t,{screen:'ZONE ERROR',portalKind:'frost',portalOpen:op,shake:t<.7?2.5:0});
 sluglet(540,lerp(635,985,fall),.95,t,{ice:1});
 marn(M(t,{look:[-.8,-.22],lid:.57,brow:-.2}));
 kip(K(t,{panic:1.1,lid:0,look:[.82,-.3],gesture:.9,mouth:{o:talk('KIP',t).o||.82,w:1.22,sm:-.95}}));
}
// 2.2–6.2: relationship two-shot and slow push.
function S2(t){
 const z=lerp(.98,1.06,ss(seg(t,2.2,6.2))),op=1-ei(seg(t,2.2,2.65));
 cam(540,1005,z);
 stage(t,{screen:'ECONOMY MODE',portalKind:'frost',portalOpen:op});
 sluglet(540,985,.95,t,{ice:1});
 marn(M(t,{look:[-.65,-.08],lid:.59,brow:-.24}));
 kip(K(t,{panic:.8,look:[.75,-.22],gesture:.25,lid:.03}));
}
// 6.2–10.5: printer insert, first controlled retry.
function S3(t){
 const press=ss(seg(t,6.25,6.8)),op=popOpen(t-6.92),paper=eo(seg(t,8.9,10.15));
 cam(540,795,1.22,0,t>6.9&&t<7.25?7*(1-seg(t,6.9,7.25)):0,t);
 stage(t,{screen:paper>.7?'FROST FREIGHT':'PRINTING...',paper,paperText:'FROST',portalKind:'frost',portalOpen:op,portalR:215,shake:t<7.2?2:0});
 kip(K(t,{x:170,y:1560,s:.72,gesture:press,panic:.8,look:[.8,-.25]}));
 marn(M(t,{x:905,y:1560,s:.75,look:[-.75,-.2],lid:.56}));
 tag('ZONE F-09','FROST FREIGHT','#e46763');
}
// 10.5–13.4: absurd image then reaction close-ups.
function S4(t){
 if(t<11.45){
  cam(245,965,1.43);
  warehouse(t);kip(K(t,{x:260,y:1570,s:1.04,panic:.82,lid:0,look:[.1,-.15],ice:1,mouth:{o:0,w:.8,sm:-.75}}));
 }else{
  cam(805,965,1.48);
  warehouse(t);marn(M(t,{x:815,y:1570,s:1.04,lid:.62,look:[-.22,.02],brow:-.28}));
 }
}
// 13.4–18: same printer framing, radically different world palette/detail.
function S5(t){
 const op=popOpen(t-13.42),reach=ss(seg(t,14.6,15.45));
 cam(540,810,1.17);
 stage(t,{screen:'CUSTOMS HOLD',portalKind:'jelly',portalOpen:op,portalR:220,shake:t<13.8?2:0});
 jellyStamp(580,855,reach,t);
 kip(K(t,{x:160,y:1570,s:.73,panic:1.0,look:[.85,-.15],gesture:.55}));
 marn(M(t,{x:910,y:1570,s:.75,lid:.56,look:[-.78,-.12]}));
 tag('ZONE J-22','JELLY CUSTOMS','#d9509c');
}
// 18–21: whip-pan dialogue between faces.
function S6(t){
 const u=ss(seg(t,19.28,19.55)),cx=lerp(245,825,u);
 cam(cx,950,1.38,0,u>0&&u<1?12:0,t);
 warehouse(t);
 kip(K(t,{x:250,y:1580,s:1.0,panic:.85,gesture:.45,look:[.4,-.1]}));
 marn(M(t,{x:820,y:1580,s:1.02,lid:.61,look:[-.25,0],brow:-.3}));
}
// 21–27: same framing, rule-of-three machine-gun worlds.
function S7(t){
 const ix=t<22.85?0:t<24.7?1:2,kinds=['frost','jelly','office'],names=[['ZONE T-11','TIDAL FORMS','#e46763'],['ZONE S-03','SENTIENT TAPE','#b7d83d'],['ZONE 1-A','COMPLETELY NORMAL','#8e765f']];
 const starts=[21,22.85,24.7],op=popOpen(t-starts[ix]+.04);
 cam(540,810,1.14);
 stage(t,{screen:['NO ROUTE','NO ROUTE','NO ROUTE'][ix],portalKind:kinds[ix],portalOpen:op,portalR:220,shake:3});
 kip(K(t,{x:158,y:1570,s:.72,panic:1.05,look:[.8,-.15],gesture:.25}));
 marn(M(t,{x:912,y:1570,s:.74,lid:.6,look:[-.8,-.1]}));
 tag(names[ix][0],names[ix][1],names[ix][2]);
}
// 27–32.5: suspiciously normal printer. Silence around the label.
function S8(t){
 const close=1-ei(seg(t,27,27.65)),paper=eo(seg(t,28.1,29.4));
 if(t<29.75){
  cam(540,810,1.31);
  stage(t,{screen:paper>.8?'LOCAL / OHIO':'LOCAL DELIVERY',paper,paperText:'OHIO',portalKind:'office',portalOpen:close,portalR:210});
  kip(K(t,{x:145,y:1580,s:.68,panic:.4,look:[.8,-.1]}));
  marn(M(t,{x:930,y:1580,s:.70,lid:.6,look:[-.8,-.1]}));
 }else{
  cam(540,1015,1.03);
  stage(t,{screen:'LOCAL / OHIO',paper:1,paperText:'OHIO'});
  kip(K(t,{panic:.25,lid:.18,look:[.45,-.08],mouth:{...K(t).mouth,sm:-.15}}));
  marn(M(t,{lid:.6,look:[-.4,-.05],brow:-.3}));
 }
}
// 32.5–38.5: wide signature shot, label → scan → suction.
function S9(t){
 const scan=seg(t,33.7,34.15),op=popOpen(t-34.2),suck=ei(seg(t,35.05,36.35));
 const by=lerp(1170,620,suck),bs=lerp(.90,.18,suck);
 cam(540,1010,lerp(.94,1.01,ss(seg(t,32.5,38.5))));
 warehouse(t);printer(540,910,.98,{screen:t<34.1?'LABEL LOCKED':t<36.4?'ROUTING...':'DELIVERED',t});
 if(op>0)portal(540,575,260,t,{open:op,kind:'office'});
 parcel(540,by,bs);
 marn(M(t,{gesture:t<33.7?.7:.15,hold:t<33.45?'label':null,look:[-.7,-.12],lid:.55}));
 kip(K(t,{panic:lerp(.35,.65,suck),gesture:.35,look:[.75,-.1],lid:.12}));
 if(scan>0&&scan<1)stroke([[420,1090-scan*170],[660,1090-scan*170]],6,{line:'#e8c45e',boil:.3});
}
// 38.5–44: return label, cold pause, box blast-back and final line.
function S10(t){
 const paper=eo(seg(t,38.75,39.75)),op=popOpen(t-40.05),fly=eo(seg(t,40.18,40.72));
 const boxY=t<40.18?640:lerp(640,1170,fly),boxS=t<40.18?.18:lerp(.18,.9,fly);
 cam(540,1010,lerp(.98,1.035,ss(seg(t,38.5,44))));
 warehouse(t);printer(540,910,.98,{screen:t<39.8?'DELIVERED':'RETURN',paper,paperText:'RETURN',shake:t>40.1&&t<40.7?4:0,t});
 if(op>0)portal(540,575,255,t,{open:op,kind:'office'});
 if(t>40.12)parcel(540,boxY,boxS,{damage:fly>.65?1:0,slime:fly>.75?1:0});
 marn(M(t,{lid:.62,look:[-.65,-.08],brow:-.28,mouth:{...M(t).mouth,sm:-.28}}));
 kip(K(t,{panic:t>40.6?.9:.35,lid:t>40.6?.03:.18,look:[.72,-.1],gesture:t>40.6?.7:.15}));
 if(t>42.65)sluglet(625,1065,.42,t,{ice:0});
}
function renderFilm(t){
 const s=filmShot(t);({1:S1,2:S2,3:S3,4:S4,5:S5,6:S6,7:S7,8:S8,9:S9,10:S10}[s])(t);
 subtitle(t);watermark();
}
// Look-dev pages — same actual drawing code.
function title(s,y=140){text(s,540,y,{font:'800 46px "Baloo 2"',fill:'#fff',align:'center'})}
function modelMarn(t){
 fillOnly(rect(-1000,-1000,3200,4000),'#807e76',{boil:.4});title('MARN — MODEL / ACTING');
 marn({x:280,y:1120,s:.78,face:1,t,lid:.48,look:[0,0],mouth:{o:0,w:1,sm:-.18}});
 marn({x:760,y:1120,s:.78,face:-1,t,lid:.52,look:[-.3,.1],mouth:{o:0,w:.9,sm:-.2},head:.04});
 marn({x:270,y:1780,s:.72,face:1,t,gesture:.8,lid:.18,brow:.5,look:[.55,-.2],mouth:{o:.7,w:1.15,sm:-.65}});
 marn({x:760,y:1780,s:.72,face:-1,t,hold:'label',lid:.6,brow:-.2,look:[.1,.2],mouth:{o:.1,w:.9,sm:.15}});
}
function modelKip(t){
 fillOnly(rect(-1000,-1000,3200,4000),'#7e8078',{boil:.4});title('KIP — MODEL / ACTING');
 kip({x:280,y:1130,s:.71,face:1,t,panic:.15,lid:.14,look:[0,0]});
 kip({x:760,y:1130,s:.71,face:-1,t,panic:.25,lid:.08,look:[.3,-.1]});
 kip({x:280,y:1800,s:.66,face:1,t,panic:1,gesture:1,lid:0,look:[.7,-.3],mouth:{o:.86,w:1.2,sm:-.9}});
 kip({x:760,y:1800,s:.66,face:-1,t,panic:.5,gesture:.25,lid:.3,look:[-.5,.1],mouth:{o:.12,w:.85,sm:-.4}});
}
function lookHook(t){
 cam(540,975,1.0);warehouse(t);printer(540,910,.98,{screen:'ZONE ERROR',shake:2.5,t});
 portal(540,575,235,t,{open:1,kind:'frost'});parcel(540,1170,.9);sluglet(540,985,.95,t,{ice:1});
 marn({x:825,y:1610,s:.91,face:-1,t,lid:.55,look:[-.8,-.25],brow:-.25,mouth:{o:0,w:.88,sm:-.22}});
 kip({x:230,y:1610,s:.87,face:1,t,panic:1.15,lid:0,look:[.85,-.3],gesture:1,mouth:{o:.9,w:1.28,sm:-1}});
}
function signature(t){
 cam(540,1010,.96);warehouse(t);printer(540,930,1.0,{screen:'DELIVERED',paper:0,t});
 portal(540,700,260,t,{open:.9,kind:'office'});parcel(540,1115,.88);
 marn({x:825,y:1630,s:.91,face:-1,t,lid:.52,look:[-.8,-.15],gesture:.42,mouth:{o:0,w:.9,sm:-.18}});
 kip({x:230,y:1630,s:.88,face:1,t,panic:.7,lid:.08,look:[.8,-.15],gesture:.62,mouth:{o:.25,w:1.05,sm:-.55}});
}
window.render=t=>{
 frame(t,{amp:1.7});S.lwScale=1;
 if(mode==='film')renderFilm(t);else if(mode==='marn')modelMarn(t);else if(mode==='kip')modelKip(t);else if(mode==='signature')signature(t);else lookHook(t);
};
window.READY=true;
