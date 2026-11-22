// Provisional original rig. Geometry is not approved production art.
import { shape, fillOnly, ell, rr, rect, spline, noodle, dot, stroke, push, pop, translate, scale } from '/styles/scifi-toon/demo/toon.js';
const ink='#252329', white='#f7f2e4';
export const cast = {
  mara:{skin:'#c59473',hair:'#483934',shirt:'#597d77',shadow:'#3f625d',trousers:'#444a48',broad:false},
  tobin:{skin:'#dfae88',hair:'#5b4635',shirt:'#b96944',shadow:'#934e35',trousers:'#5d5750',broad:true}
};
const P=(pts,fill,lw=5)=>shape(pts,{fill,lw,line:ink});
const R=(x,y,w,h,r,fill,lw=5)=>P(rr(x,y,w,h,r),fill,lw);
const E=(x,y,rx,ry,fill,lw=5)=>P(ell(x,y,rx,ry),fill,lw);
export function drawActor(id,x,y,k,pose={}){
  const c=cast[id]; if(!c) throw new Error('Unknown actor: '+id);
  const lift=pose.lift??0, alarm=pose.alarm??0, blink=pose.blink??false;
  const lean=pose.lean??0, broad=c.broad?1:0;
  push(); translate(x,y); scale(k);
  // Local ground origin, fixed leg attachment and a grasp point at the wrist.
  E(0,-2,50,9,'#485b55',0);
  P(noodle([-23,-88],[-28,-12],-3,23,19),c.trousers);
  P(noodle([23,-88],[27,-12],3,23,19),c.trousers);
  R(-43,-18,35,15,6,ink,3); R(8,-18,35,15,6,ink,3);
  push(); translate(lean,0);
  P(noodle([-35,-175],[-50,-113],9,22,16),c.shirt);
  E(-50,-108,9,10,c.skin,4);
  const body=rr(-43-broad*6,-191,86+broad*12,107,18);
  shape(body,{fill:c.shirt,lw:6,line:ink,shade:()=>fillOnly(rect(18,-192,40,110),c.shadow,{boil:0})});
  R(-31,-174,23,13,3,'#dfc081',3);
  const wrist=[52+12*lift,-111-77*lift];
  P(noodle([39,-173],wrist,-12,22,16),c.shirt);
  E(wrist[0],wrist[1],10,12,c.skin,4);
  if(pose.meter){
    push(); translate(wrist[0]+3,wrist[1]-17);
    R(-9,-19,30,35,5,'#b6aa89',5); R(-4,-13,20,13,2,'#253a38',2);
    dot(6,-6,3,'#e3bd76'); stroke([[-3,9],[9,9]],3,{line:ink});
    // Fingers overlap the handle so the prop stays visibly in the hand.
    E(-5,10,8,6,c.skin,3); pop();
  }
  R(-12,-208,24,27,7,c.skin,4);
  const hw=broad?53:46;
  const face=broad?ell(0,-249,hw,52):rr(-hw,-301,hw*2,100,24);
  shape(face,{fill:c.skin,lw:6,line:ink,shade:()=>fillOnly(rect(22,-303,40,107),broad?'#bc896b':'#a9775c',{boil:0})});
  P(spline([[-hw,-260],[-hw,-298],[-20,-310],[20,-307],[hw,-289],[hw,-270],[25,-284],[-17,-281],[-hw+9,-264]],true,6),c.hair,5);
  if(c.broad)P([[-10,-307],[4,-319],[17,-309],[28,-312],[37,-297]],c.hair,4);
  for(const ex of [-19,19]){
    const ry=blink?2:11+alarm*5;
    E(ex,-251,15,ry,white,4);
    if(!blink)dot(ex+(pose.look??0)*5,-249,4,ink);
    stroke([[ex-12,-269-alarm*5],[ex+11,-268-alarm*7]],4,{line:ink});
  }
  stroke([[-2,-247],[-5,-235],[4,-235]],3,{line:ink});
  if(alarm>.4)E(4,-220,8,5+alarm*7,'#6c4145',4);
  else stroke([[-13,-220],[11,-221]],4,{line:ink});
  pop(); pop();
}
