// BLACKSTAR provisional original rig, Revision 4.
// Local origin is the floor contact. All geometry is drawn through native toon.js.
import {shape,fillOnly,ell,rr,rect,spline,noodle,dot,stroke,push,pop,translate,rotate,scale} from '/styles/scifi-toon/demo/toon.js';
export const INK='#211e29';
const WHITE='#f7f2e5';
export const cast={
 mara:{skin:'#bf8c6e',skinShadow:'#94674f',hair:'#413438',hairLight:'#594247',shirt:'#557d75',shadow:'#385951',light:'#729184',pants:'#44494c',pantsShadow:'#32373c',boot:'#323538',sole:'#25232b',width:41},
 tobin:{skin:'#dfad89',skinShadow:'#bd8869',hair:'#654735',hairLight:'#886343',shirt:'#bd7449',shadow:'#945333',light:'#d68d59',pants:'#66605a',pantsShadow:'#49453f',boot:'#363b40',sole:'#25232b',width:50}
};
const P=(pts,fill,lw=6,o={})=>shape(pts,{fill,lw,line:INK,...o});
const R=(x,y,w,h,r,fill,lw=5,o={})=>P(rr(x,y,w,h,r),fill,lw,o);
const E=(x,y,rx,ry,fill,lw=5,o={})=>P(ell(x,y,rx,ry),fill,lw,o);
const L=(pts,lw=3,color=INK)=>stroke(pts,lw,{line:color});
const F=(pts,c)=>fillOnly(pts,c,{boil:0});
const smooth=pts=>spline(pts,true,6);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function shaded(pts,c,shadow,shade,lw=6){
 return P(pts,c,lw,{shade:()=>F(shade,shadow)});
}
// Analytic two-bone elbow. Wrist is clamped to reachable distance;
// the meter and fingers use the solved wrist, not a separate path.
function arm(a,target,l1,l2,side){
 const dx=target[0]-a[0],dy=target[1]-a[1],raw=Math.hypot(dx,dy)||1;
 const d=clamp(raw,Math.abs(l1-l2)+.5,l1+l2-.5), ux=dx/raw,uy=dy/raw;
 const along=(l1*l1-l2*l2+d*d)/(2*d), bend=Math.sqrt(Math.max(0,l1*l1-along*along));
 return {elbow:[a[0]+ux*along-side*uy*bend,a[1]+uy*along+side*ux*bend],wrist:[a[0]+ux*d,a[1]+uy*d]};
}
function sleeve(c,a,b,width){
 const pts=noodle(a,b,0,width,width*.76);
 const dx=b[0]-a[0],dy=b[1]-a[1],n=Math.hypot(dx,dy)||1;
 const px=-dy/n*width*.45,py=dx/n*width*.45;
 shaded(pts,c.shirt,c.shadow,[a,[a[0]+px,a[1]+py],[b[0]+px,b[1]+py],b],5);
}
function hand(c,w,grip=false,flip=1){
 push();translate(w[0],w[1]);scale(flip,1);
 if(grip){
   // Palm behind meter handle; thumb and finger contours on top.
   P(smooth([[-9,-5],[-4,-11],[5,-10],[12,-3],[11,10],[3,15],[-6,10]]),c.skin,5);
   R(1,-34,31,43,5,'#b6aa88',6,{shade:()=>F([[20,-34],[32,-34],[32,9],[15,9]],'#817d6b')});
   R(5,-30,23,18,3,'#243936',3);
   L([[8,-20],[13,-20],[16,-25],[22,-18],[25,-18]],2.5,'#f0c36e');
   R(17,-6,9,7,2,'#c59157',2);
   L([[8,2],[12,2]],2);L([[8,5],[12,5]],2);
   P(smooth([[-4,-3],[4,-8],[12,-6],[13,-2],[7,3],[1,5],[-4,3]]),c.skin,4);
   P(smooth([[2,7],[8,5],[14,6],[15,10],[10,14],[3,14],[-1,11]]),c.skin,4);
   L([[8,7],[10,10]],2,c.skinShadow);
 }else{
   P(smooth([[-8,-5],[-5,-10],[4,-11],[10,-5],[11,4],[6,12],[-2,13],[-9,7]]),c.skin,5);
   L([[-2,3],[0,8],[4,9]],2.5,c.skinShadow);
   L([[4,2],[6,6]],2.5,c.skinShadow);
 }
 pop();
}
function limb(c,a,target,side,grip=false){
 const {elbow,wrist}=arm(a,target,42,39,side);
 sleeve(c,a,elbow,24);
 sleeve(c,elbow,wrist,20);
 const cuff=[elbow[0]+(wrist[0]-elbow[0])*.80,elbow[1]+(wrist[1]-elbow[1])*.80];
 L([cuff,[cuff[0]+(wrist[1]-elbow[1])*.18,cuff[1]-(wrist[0]-elbow[0])*.18]],3,c.shadow);
 hand(c,wrist,grip,grip?1:side);
 return wrist;
}
function leg(c,hip,knee,ankle,dir){
 const pts=smooth([[hip-16,-125],[hip+15,-125],[knee+12,-59],[ankle+11,-15],[ankle-13,-15],[knee-13,-58]]);
 shaded(pts,c.pants,c.pantsShadow,[[hip+5,-129],[hip+29,-129],[knee+17,-62],[ankle+14,-13],[ankle+3,-13]],6);
 L([[knee-9,-58],[knee+2,-55]],2.5,c.pantsShadow);
 const toe=ankle+dir*20;
 P(smooth([[ankle-13,-20],[ankle+12,-20],[toe+dir*7,-11],[toe+dir*7,-2],[ankle-dir*13,-2],[ankle-dir*16,-9]]),c.boot,5);
 L([[Math.min(ankle-dir*13,toe+dir*5),-4],[Math.max(ankle-dir*13,toe+dir*5),-4]],3,c.sole);
 L([[ankle-7,-14],[ankle+6,-14]],2.5,'#73746f');
}
function eye(c,x,y,rx,ry,look,blink,lid,alarm){
 E(x,y+3,rx+1,ry+3,c.skinShadow,0,{stroke:false});
 E(x,y,rx,ry,WHITE,4);
 const close=blink?1:lid;
 if(!blink)dot(x+look*rx*.40,y+alarm*1.3,3.0,INK);
 if(close>0){
  const top=y-ry,bottom=top+2*ry*close;
  const mask=rect(x-rx-2,top-2,2*rx+4,bottom-top+2);
  P(ell(x,y,rx,ry),null,3,{shade:()=>F(mask,c.skin)});
  L([[x-rx*.90,bottom],[x,bottom+1],[x+rx*.90,bottom-1]],3.5);
 }
}
function head(id,c,alarm,look,blink,tilt){
 push();translate(0,-244);rotate(tilt);
 const mara=id==='mara';
 // Distinct cheek/jaw profiles, ears and deliberately asymmetric hair.
 const face=mara?smooth([[-39,-46],[-25,-62],[13,-61],[38,-45],[41,-11],[34,21],[13,39],[-15,37],[-35,21],[-43,-9]])
 :smooth([[-49,-44],[-28,-58],[15,-60],[46,-44],[51,-9],[44,17],[24,39],[-5,42],[-32,30],[-48,7]]);
 E(mara?-39:-49,-4,9,13,c.skin,5);
 E(mara?40:48,-4,8,12,c.skinShadow,4);
 L([[mara?-44:-53,-5],[mara?-39:-48,-1],[mara?-42:-51,4]],2.5,c.skinShadow);
 shaded(face,c.skin,c.skinShadow,[[27,-64],[64,-64],[61,35],[28,46],[4,46],[22,25],[31,8],[27,-12]],7);
 if(mara){
  P(smooth([[-43,-19],[-48,-42],[-40,-60],[-19,-68],[8,-70],[28,-62],[45,-44],[43,-24],[26,-41],[10,-38],[-8,-35],[-27,-44],[-34,-21]]),c.hair,6);
  L([[-37,-50],[-20,-60],[4,-61],[23,-54]],3,c.hairLight);
  P([[-43,-20],[-33,-23],[-31,-9],[-40,-8]],c.hair,3);
  E(-41,9,3,3,'#bfa56e',2);
 }else{
  P(smooth([[-52,-20],[-59,-45],[-43,-62],[-23,-65],[-14,-77],[0,-67],[15,-73],[33,-61],[53,-54],[57,-32],[48,-21],[38,-39],[13,-38],[-9,-43],[-35,-35]]),c.hair,6);
  L([[-45,-48],[-24,-54],[-9,-57],[13,-55],[36,-48]],3,c.hairLight);
  L([[-14,30],[0,33],[14,29]],2.5,c.skinShadow);
 }
 const ey=mara?-13:-14;
 eye(c,-17,ey,mara?15:18,11+alarm*5,look,blink,mara?.36:0.10,alarm);
 eye(c,18,ey+1,mara?15:17,11+alarm*5,look,blink,mara?.35:0.10,alarm);
 L([[-31,ey-19-alarm*5],[-18,ey-22-alarm*7],[-5,ey-18-alarm*6]],4.5);
 L([[6,ey-18-alarm*7],[18,ey-21-alarm*8],[32,ey-18-alarm*5]],4.5);
 L([[-2,ey+1],[mara?5:9,ey+13],[0,ey+15]],3.5);
 if(alarm>.3){
   E(5,24,9+alarm*4,4+alarm*10,'#5f3039',5);
   if(alarm>.6)P(smooth([[-2,17],[10,17],[10,21],[-2,22]]),WHITE,1);
 }else if(mara)L([[-11,23],[1,21],[12,22]],3.5);
 else L([[-10,21],[2,23],[15,20]],3.5);
 pop();
}
export function drawActor(id,x,y,k,pose={}){
 const c=cast[id];if(!c)throw Error('Unknown actor '+id);
 const lift=pose.lift??0,alarm=pose.alarm??0,look=pose.look??0,blink=pose.blink??false;
 const lean=pose.lean??0,mara=id==='mara';
 push();translate(x,y);scale(k);
 // Both shoes are anchored to local y=0 on the projected walkable floor.
 const stance=mara?24:28;
 leg(c,-22,-stance,-stance,-1);leg(c,22,stance,stance,1);
 push();translate(lean,-117);rotate((mara?-.015:0)-alarm*.087);translate(0,117);scale(1,1+alarm*.025);
 const w=c.width;
 const body=mara?smooth([[-33,-220],[-w,-194],[-34,-152],[-37,-122],[5,-117],[35,-122],[39,-154],[w,-192],[32,-219],[-2,-228]])
 :smooth([[-39,-219],[-w,-198],[-47,-167],[-50,-133],[-31,-119],[17,-117],[47,-129],[51,-174],[w,-199],[37,-218],[0,-226]]);
 // Back arm first; then sculpted jacket and collared shirt.
 const backTarget=mara?[-52,-151]:[-59-alarm*12,-145+alarm*21];
 limb(c,[-w+8,-205],backTarget,-1,false);
 shaded(body,c.shirt,c.shadow,[[30,-228],[57,-221],[61,-117],[13,-115],[29,-146],[21,-178],[34,-204]],7);
 L([[-w+7,-194],[-w+11,-177]],3,c.light);
 if(mara){
  P([[-19,-226],[-24,-207],[-7,-194],[0,-211]],'#809d8c',3.5);
  P([[19,-226],[24,-208],[8,-195],[0,-211]],'#648b7e',3.5);
  L([[0,-208],[0,-127]],3,c.shadow);
  R(-29,-185,21,17,3,'#6e8e83',3);
  L([[-27,-180],[-10,-180]],2.5,INK);
  R(12,-159,22,23,3,'#50746c',3);
  R(-23,-201,15,8,2,'#cbb279',2);
 }else{
  P([[-31,-220],[-17,-204],[0,-211],[18,-202],[31,-218]],'#d8c3a3',5);
  R(-30,-179,25,16,4,'#b06b43',3);
  L([[-27,-171],[-8,-171]],2.5,c.shadow);
  L([[-35,-139],[-20,-145],[-4,-143]],3,c.shadow);
  L([[33,-133],[20,-135]],3,c.shadow);
 }
 R(-13,-242,26,22,7,c.skin,4,{shade:()=>F([[6,-244],[15,-244],[15,-220],[5,-220]],c.skinShadow)});
 head(id,c,alarm,look,blink,mara?-.025:-alarm*.11);
 const wristGoal=mara?[w+13+lift*32,-150-lift*80]:[w+12+alarm*18,-148-alarm*28];
 limb(c,[w-7,-204],wristGoal,1,!!pose.meter);
 pop();pop();
}
