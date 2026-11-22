// Original BLACKSTAR cast for Portal Printer — Marn and Kip.
import { clamp, lerp } from '/core/lib.js';
import { INK,push,pop,translate,rotate,scale,shape,fillOnly,stroke,ell,rr,rect,spline,noodle,arc,dot,text } from '/styles/scifi-toon/demo/toon.js';
import { eye,mouth,hand } from '/styles/scifi-toon/demo/chars.js';

export const P={
 skinM:'#9e644b',skinMs:'#754532',hairM:'#312a38',hairM2:'#4b3c50',
 vestM:'#2f6e68',vestMs:'#24524f',skirt:'#d39a3d',skirtS:'#9e6b2d',cargo:'#4c5764',boot:'#2d2c37',
 skinK:'#c79069',skinKs:'#9b684c',hairK:'#553c34',vestK:'#6f5a9f',vestKs:'#514276',
 shirt:'#eee3c9',pant:'#66737a',bootK:'#3a343e',white:'#fff',mouth:'#4a1a2a',
 label:'#f1e4c8',labelInk:'#3e3840'
};
const q=t=>Math.floor(t*12+1e-6)/12;
const limb=(a,b,bend,w0,w1,fill,lw=7)=>shape(noodle(a,b,bend,w0,w1),{fill,lw,shade:()=>{}});
const shadow=(pts,col)=>fillOnly(pts,col,{boil:.35});
function brow(x,y,w,tilt=0,lw=6){stroke([[x-w/2,y+tilt*w*.5],[x+w/2,y-tilt*w*.5]],lw);}
function label(x,y,a=0,s=1,txt='OHIO'){
 push();translate(x,y);rotate(a);scale(s);
 shape(rr(-58,-34,116,68,5),{fill:P.label,lw:5,shade:()=>shadow([[18,-34],[58,-34],[58,34],[9,34]],'#d4c4a4')});
 text(txt,0,-6,{font:'800 17px "VT323"',fill:P.labelInk});
 stroke([[-42,9],[41,9]],2.5,{line:P.labelInk,boil:.25});
 for(let i=0;i<7;i++)stroke([[-39+i*11,17],[-39+i*11,30]],2,{line:P.labelInk,boil:.15});
 pop();
}
export {label};

export function marn(o={}){
 const x=o.x??540,y=o.y??1540,s=o.s??1,face=o.face??1,t=o.t??0;
 const look=o.look??[-.1,0],lid=o.lid??.48,browV=o.brow??-.12,m=o.mouth??{o:0,w:1,sm:-.18};
 const gesture=o.gesture??0,hold=o.hold??null,head=o.head??0;
 push();translate(x,y);scale(s*face,s);
 const tq=q(t),breath=Math.sin(tq*2.1)*3;
 translate(0,breath);
 // boots and cargo legs
 for(const sx of [-1,1]){
  const hip=[sx*34,-176],ank=[sx*38,-42];
  limb(hip,ank,sx*-6,46,38,P.cargo,7);
  shape(spline([[ank[0]-34,ank[1]+35],[ank[0]-31,ank[1]+4],[ank[0]+12,ank[1]],[ank[0]+55,ank[1]+18],[ank[0]+49,ank[1]+37]]),{fill:P.boot,lw:7,shade:()=>shadow([[ank[0]+10,ank[1]-5],[ank[0]+62,ank[1]+5],[ank[0]+62,ank[1]+42],[ank[0]+8,ank[1]+42]],'#22212b')});
 }
 // skirt: absurd hazard garment, strong trapezoid silhouette
 shape(spline([[-100,-250],[-86,-345],[85,-345],[105,-250],[88,-161],[-87,-161]]),{fill:P.skirt,lw:7,shade:()=>{
  shadow([[25,-350],[95,-342],[110,-245],[86,-160],[39,-163]],P.skirtS);
  for(let i=-2;i<=2;i++)shadow([[i*35-7,-325],[i*35+7,-325],[i*35+2,-185],[i*35-12,-185]],i%2?'#e9b653':'#bb7d31');
 }});
 // torso vest
 shape(spline([[-72,-470],[-105,-430],[-98,-333],[-72,-277],[72,-277],[99,-336],[105,-430],[71,-470]]),{fill:P.vestM,lw:7,shade:()=>{
  shadow([[-120,-500],[-18,-490],[-27,-270],[-105,-270]],P.vestMs);
  shadow([[7,-466],[38,-467],[62,-318],[25,-318]],'#3b827a');
 }});
 // undershirt collar and vest seams
 shape([[-28,-468],[0,-431],[27,-468],[16,-409],[-17,-409]],{fill:'#f0d9b4',lw:5});
 stroke([[0,-427],[0,-280]],5); stroke([[-63,-355],[63,-355]],4);
 // arms: shoulders rise before meaningful gesture
 const ant=Math.sin(clamp(gesture*1.8)*Math.PI)*12;
 const hR=hold==='label'?[95,-220-ant]:[83,-300-gesture*88-ant];
 const hL=hold==='label'?[45,-220-ant]:[-90,-300+gesture*18-ant];
 const shR=[72,-438],shL=[-72,-438];
 limb(shL,hL,-26,48,34,P.vestM,7); limb(shR,hR,30,48,34,P.vestM,7);
 hand(hL[0],hL[1],-.25,20,P.skinM,{fist:hold==='label',lw:6});
 hand(hR[0],hR[1],.2,20,P.skinM,{fist:hold==='label',lw:6});
 if(hold==='label')label(69,-225,0,0.64,'OHIO');
 // neck + head
 shape(rr(-23,-510,46,64,13),{fill:P.skinMs,lw:6});
 push();translate(0,-540);rotate(head);translate(0,540);
 // hair mass behind
 shape(spline([[-79,-555],[-83,-625],[-57,-680],[-6,-699],[48,-679],[76,-625],[75,-553],[50,-515],[-50,-516]]),{fill:P.hairM,lw:7,shade:()=>shadow([[-85,-650],[-25,-708],[10,-690],[-17,-538],[-75,-530]],P.hairM2)});
 // face
 shape(spline([[-55,-627],[-45,-662],[6,-674],[51,-651],[60,-603],[44,-536],[8,-514],[-35,-524],[-58,-561]]),{fill:P.skinM,lw:7,shade:()=>shadow([[-65,-650],[-18,-667],[-22,-514],[-58,-527]],P.skinMs)});
 // shaved side + blunt bob geometry
 shape(spline([[-76,-632],[-58,-683],[-10,-701],[39,-686],[77,-653],[62,-616],[25,-629],[1,-652],[-27,-627],[-47,-590],[-66,-586]]),{fill:P.hairM,lw:7,shade:()=>shadow([[-73,-663],[-26,-702],[-4,-685],[-31,-614],[-68,-587]],P.hairM2)});
 // shaved side hatch
 for(let i=0;i<4;i++)stroke([[-57+i*6,-606],[-45+i*6,-586]],2.5,{line:P.hairM2,boil:.25});
 // ears / eyes
 shape(ell(-52,-590,10,15,22),{fill:P.skinMs,lw:5});shape(ell(50,-587,9,14,22),{fill:P.skinMs,lw:5});
 eye(-24,-602,22,24,{lid,look,pupil:4.6,skin:P.skinM,lw:6});
 eye(20,-602,22,24,{lid:lid+.04,look,pupil:4.6,skin:P.skinM,lw:6});
 brow(-25,-637,35,browV,6);brow(21,-638,35,browV*.6,6);
 // nose and mouth
 shape([[-3,-603],[8,-577],[-6,-575]],{fill:P.skinMs,lw:3});
 mouth(1,-555,39,{...m,lw:6});
 // one square earring = character identifier
 shape(rr(49,-577,9,13,2),{fill:'#e3b04b',lw:3});
 pop();
 pop();
}

export function kip(o={}){
 const x=o.x??540,y=o.y??1540,s=o.s??1,face=o.face??-1,t=o.t??0;
 const look=o.look??[.25,-.1],lid=o.lid??.10,m=o.mouth??{o:0,w:1,sm:-.55};
 const panic=o.panic??.35,gesture=o.gesture??0,blink=o.blink??false,hold=o.hold??null;
 push();translate(x,y);scale(s*face,s);
 const tq=q(t),jit=panic>0?((Math.floor(tq*12)%2?1:-1)*panic*3):0;
 translate(jit,Math.sin(tq*3.4)*4);
 // skinny legs + boots
 for(const sx of [-1,1]){
  const hip=[sx*25,-205],ank=[sx*33+(sx>0?gesture*8:0),-35];
  limb(hip,ank,sx*8,30,24,P.pant,7);
  shape(spline([[ank[0]-24,ank[1]+30],[ank[0]-22,ank[1]+3],[ank[0]+8,ank[1]],[ank[0]+42,ank[1]+16],[ank[0]+36,ank[1]+31]]),{fill:P.bootK,lw:7});
 }
 // cream uniform base
 shape(spline([[-56,-504],[-91,-461],[-75,-311],[-56,-194],[58,-194],[78,-314],[94,-462],[56,-504]]),{fill:P.shirt,lw:7,shade:()=>shadow([[-99,-520],[-13,-510],[-20,-190],[-73,-185]],'#d7c8a9')});
 // inflatable safety vest = absurd costume silhouette
 shape(spline([[-68,-486],[-105,-460],[-111,-390],[-92,-318],[-48,-332],[-41,-456],[-13,-478]]),{fill:P.vestK,lw:7,shade:()=>shadow([[-108,-468],[-74,-477],[-65,-327],[-104,-315]],P.vestKs)});
 shape(spline([[66,-486],[103,-460],[111,-390],[92,-318],[48,-332],[41,-456],[13,-478]]),{fill:P.vestK,lw:7,shade:()=>shadow([[54,-482],[106,-463],[103,-316],[67,-328]],P.vestKs)});
 // puffy vest ribs
 for(let yy=-447;yy<=-350;yy+=32){stroke([[-94,yy],[-50,yy+4]],3.5);stroke([[49,yy+4],[94,yy]],3.5);}
 // scanner holster
 shape(rr(58,-305,55,86,8),{fill:'#353842',lw:6,shade:()=>shadow([[88,-305],[113,-305],[113,-219],[84,-219]],'#22242b')});
 text('BEEP',85,-259,{font:'400 13px "VT323"',fill:'#d8d26d'});
 // arms with anticipatory shoulder lift
 const up=gesture*100,shL=[-63,-462],shR=[63,-462];
 const hL=[-100,-310-up*.35],hR=hold==='box'?[112,-270]:[104,-300-up];
 limb(shL,hL,-35,35,25,P.shirt,7);limb(shR,hR,35,35,25,P.shirt,7);
 hand(hL[0],hL[1],-.3,18,P.skinK,{fist:false,lw:6});
 hand(hR[0],hR[1],.3,18,P.skinK,{fist:hold==='box',lw:6});
 // long neck
 shape(rr(-17,-557,34,75,12),{fill:P.skinKs,lw:6});
 // hair silhouette
 shape(spline([[-65,-644],[-58,-698],[-34,-732],[-15,-714],[2,-748],[18,-717],[43,-735],[38,-703],[68,-686],[61,-629],[34,-600],[-43,-603]]),{fill:P.hairK,lw:7,shade:()=>shadow([[-70,-730],[-14,-755],[-4,-601],[-63,-599]],'#3c2a27')});
 // long face
 shape(spline([[-47,-666],[-33,-699],[22,-699],[48,-665],[45,-607],[19,-566],[-21,-570],[-48,-610]]),{fill:P.skinK,lw:7,shade:()=>shadow([[-55,-700],[-11,-705],[-18,-567],[-50,-589]],P.skinKs)});
 // swept hair cap
 shape(spline([[-63,-675],[-51,-721],[-26,-737],[-4,-716],[21,-747],[45,-719],[66,-691],[51,-668],[17,-683],[-13,-677],[-38,-651]]),{fill:P.hairK,lw:7});
 // eyes almost touching
 if(blink){
  stroke([[-42,-644],[-8,-644]],6);stroke([[-4,-645],[31,-645]],6);
 }else{
  eye(-23,-643,24,27,{lid,look,pupil:4.3,skin:P.skinK,lw:6,jitter:jit*.25});
  eye(19,-644,24,27,{lid:lid*.6,look,pupil:4.3,skin:P.skinK,lw:6,jitter:jit*.25});
 }
 brow(-24,-682,36,.28+panic*.18,6);brow(20,-682,36,-.22-panic*.12,6);
 // long nose
 shape(spline([[-1,-644],[13,-616],[4,-603],[-8,-610]]),{fill:P.skinKs,lw:4});
 mouth(0,-585,42,{...m,lw:6});
 // eye bags
 stroke([[-40,-612],[-18,-607]],3,{line:P.skinKs,boil:.25});stroke([[3,-609],[28,-613]],3,{line:P.skinKs,boil:.25});
 pop();
}
