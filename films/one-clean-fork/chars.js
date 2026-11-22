// Original BLACKSTAR cast for One Clean Fork. Built on scifi-toon grammar, not demo character designs.
import {shape,fillOnly,stroke,ell,arc,spline,rr,rect,noodle,push,pop,translate,rotate,scale,text,dot,INK} from '/styles/scifi-toon/demo/toon.js';
import {eye,mouth,hand} from '/styles/scifi-toon/demo/chars.js';

export const P={
 skinN:'#9f684f', skinNs:'#794936', apron:'#b55d3f', apronS:'#87412f', shirtN:'#d5b985', pad:'#e59755',
 skinC:'#d6a477', skinCs:'#ad7955', shirtC:'#66778a', pantsC:'#b7845c', belt:'#443846',
 hairN:'#352d3d', hairC:'#544355', white:'#fff', navy:'#39434d', cream:'#efe2c6',
 steel:'#a7a8a2', steelD:'#73777a', cyan:'#63e0df', cyan2:'#c6ffff', red:'#c34e4d',
 noodle:'#d7aa48', fork:'#c8cbc6', forkS:'#8f9693', mouth:'#4b2432'
};

const hardShadow=(x,y,w,h,c)=>fillOnly(rect(x,y,w,h),c,{boil:.35});
export function fork(x,y,s=1,a=0,{bent=0}={}){
 push();translate(x,y);rotate(a);scale(s);
 shape(rr(-7,-38,14,68,5),{fill:P.fork,lw:5,shade:()=>hardShadow(0,-40,10,72,P.forkS)});
 for(let k=-1.5;k<=1.5;k++) stroke([[k*6,-38],[k*6,-58-bent*(k*3)]],4,{line:INK});
 stroke([[-14,-39],[14,-39]],4);
 pop();
}
export function mater(x,y,s=1,{lever=0,glow=0,screen='READY',units='',off=false}={}){
 push();translate(x,y);scale(s);
 shape(rr(-74,-48,148,96,16),{fill:'#7b7165',lw:7,shade:()=>fillOnly(rect(18,-52,64,104),'#5c554f',{boil:.35})});
 // Only luminous object in the film.
 if(!off&&glow>0){
  for(const [rrr,a] of [[56,.16],[42,.2]]) shape(ell(0,-7,rrr,30,32),{fill:P.cyan,stroke:false,alpha:a,boil:.35});
 }
 shape(rr(-54,-29,108,43,8),{fill:off?'#2d2b31':'#243b41',lw:5});
 text(screen,0,-14,{font:'400 16px "VT323"',fill:off?'#777':P.cyan2});
 if(units) text(units,0,3,{font:'400 12px "VT323"',fill:off?'#777':P.cyan});
 shape(rr(-56,27,112,12,5),{fill:'#4a4546',lw:4});
 shape(rr(52,-41,12,56,5),{fill:'#d3c47f',lw:4});
 shape(rr(54,-37+lever*22,8,19,3),{fill:P.red,lw:3});
 // taped name
 shape(rr(-70,-64,72,19,3),{fill:'#e5d68e',lw:3});
 text('MATER-8',-34,-54,{font:'800 10px "Baloo 2"',fill:INK});
 pop();
}
export function forkling(x,y,s=1,t=0,{peek=0}={}){
 push();translate(x,y);scale(s);
 const wob=Math.sin(Math.floor(t*12)*.75)*2;
 // noodle-bound body and bent-fork legs
 shape(spline([[-25,0],[-12,-31],[13,-29],[28,-4],[15,19],[-14,18]]),{fill:P.noodle,lw:6,shade:()=>fillOnly(rect(5,-38,26,65),'#b88635',{boil:.3})});
 for(const [sx,ang] of [[-1,-.6],[1,.6],[-1,-2.3],[1,2.3]]){
  push();translate(sx*18,7);rotate(ang+wob*.01);fork(0,0,.35,0,{bent:.5});pop();
 }
 eye(-9,-8,10,12,{skin:P.noodle,lid:peek?.25:0,pupil:3,lw:4,look:[.3,0]});
 eye(10,-9,10,12,{skin:P.noodle,lid:peek?.25:0,pupil:3,lw:4,look:[.3,0]});
 if(!peek) mouth(1,9,15,{o:.22+Math.max(0,Math.sin(t*9))*.2,sm:.5,lw:4,teeth:false});
 pop();
}
function noraHead(P0){
 shape(ell(-55,0,14,21,18),{fill:P.skinN,lw:6});
 const face=spline([[-54,-61],[-16,-87],[39,-82],[69,-49],[71,8],[52,62],[8,78],[-38,63],[-63,24]]);
 shape(face,{fill:P.skinN,lw:7,shade:()=>fillOnly(spline([[-70,2],[-12,12],[73,0],[78,88],[-70,88]]),P.skinNs,{boil:.35})});
 // compact bun + straight fringe, no spiky silhouette
 shape(spline([[-63,-48],[-40,-91],[4,-108],[52,-86],[72,-47],[45,-57],[24,-72],[2,-63],[-24,-75],[-49,-56]]),{fill:P.hairN,lw:7});
 shape(ell(38,-98,27,25,20),{fill:P.hairN,lw:6});
 stroke([[40,-119],[70,-141]],5);stroke([[48,-113],[76,-126]],5);
 const lid=P0.blink?1:(P0.lid??.5),look=P0.look||[0,0];
 eye(-17,-17,25,28,{skin:P.skinN,lid,look,pupil:4.2,lw:6,lower:.08});
 eye(27,-19,22,26,{skin:P.skinN,lid,look,pupil:4.2,lw:6,lower:.08});
 stroke([[-41,-48],[-18,-54+(P0.brow||0)*7]],6);
 stroke([[8,-52-(P0.brow||0)*5],[47,-46]],6);
 shape(spline([[7,-14],[20,12],[17,25],[3,23]]),{fill:P.skinN,lw:5,shade:()=>fillOnly(ell(15,20,7,5,12),P.skinNs,{boil:.2})});
 const m=P0.mouth||{};
 mouth(9,48,47,{o:m.o||0,w:m.w??1,sm:m.sm??-.25,skew:m.skew||0,lw:6});
}
export function nora(A){
 const f=A.face??1;
 push();translate(A.x,A.y+(A.bob||0));scale((A.s??1)*f,A.s??1);
 const q=A.t||0;
 // heavy slippers and cropped pants
 for(const sx of [-1,1]){
  shape(noodle([sx*24,-126],[sx*29,-24],sx*-5,34,28),{fill:P.navy,lw:7});
  shape(spline([[sx*29-31,-8],[sx*29-26,-27],[sx*29+9,-32],[sx*29+44,-14],[sx*29+39,4]]),{fill:'#d7a05d',lw:7,shade:()=>hardShadow(sx*29+11,-31,42,35,'#a66e45')});
 }
 push();rotate(A.lean??0);
 const shL=[-63,-283],shR=[62,-282],armL=A.armL||{h:[-18,125],bend:-20},armR=A.armR||{h:[18,125],bend:20};
 const arm=(sh,a,front=false)=>{
  const hp=[sh[0]+a.h[0],sh[1]+a.h[1]];
  shape(noodle(sh,hp,a.bend||0,41,31),{fill:P.shirtN,lw:7,shade:()=>front?fillOnly(rect(hp[0]-20,hp[1]-90,45,100),'#bca06c',{boil:.3}):null});
  hand(hp[0],hp[1],Math.atan2(hp[1]-sh[1],hp[0]-sh[0]),18,P.skinN,{fist:!!a.fist,lw:6});
  return hp;
 };
 arm(shL,armL);
 // body and absurd quilted oven-mitt shoulder epaulettes
 shape(spline([[-63,-295],[-92,-263],[-87,-128],[-53,-108],[52,-108],[88,-130],[91,-262],[62,-297],[25,-316],[-25,-316]]),{fill:P.apron,lw:7,shade:()=>fillOnly(spline([[16,-328],[92,-280],[100,-95],[35,-100]]),P.apronS,{boil:.35})});
 for(const sx of [-1,1]){
  shape(spline([[sx*48,-310],[sx*84,-322],[sx*102,-292],[sx*90,-262],[sx*58,-271]]),{fill:P.pad,lw:6});
  for(let i=0;i<3;i++)stroke([[sx*(60+i*10),-312],[sx*(76+i*7),-272]],3,{line:'#ba6e43'});
 }
 shape(spline([[-35,-307],[0,-280],[35,-307],[31,-150],[-31,-150]]),{fill:'#e1c79b',lw:5});
 stroke([[0,-278],[0,-122]],5);
 shape(rr(-45,-214,55,47,6),{fill:'#8f4a38',lw:5});
 text('N',-18,-189,{font:'800 19px "Baloo 2"',fill:P.cream});
 // neck + head
 shape(noodle([0,-310],[4,-348],0,30,27),{fill:P.skinN,lw:6});
 push();translate(3,-426);rotate(A.headTilt??.02);noraHead(A);pop();
 arm(shR,armR,true);
 pop();pop();
}
function calHead(A){
 for(const sx of [-1,1])shape(ell(sx*55,-1,13,21,16),{fill:P.skinC,lw:6});
 shape(spline([[-46,-74],[4,-96],[51,-71],[64,-18],[54,57],[10,81],[-43,64],[-61,10]]),{fill:P.skinC,lw:7,shade:()=>fillOnly(spline([[4,-100],[65,-80],[70,88],[24,88]]),P.skinCs,{boil:.35})});
 // soft triangular hair sweep; no spiky scientist silhouette
 shape(spline([[-54,-64],[-34,-101],[5,-113],[52,-86],[61,-62],[24,-72],[4,-87],[-16,-69]]),{fill:P.hairC,lw:7});
 const nerv=A.nerv||0,j=(Math.floor((A.t||0)*12)%2?1:-1)*nerv*2.5,look=A.look||[0,0];
 stroke([[-43,-50],[-15,-58-(A.brow??1)*8]],6);
 stroke([[42,-50],[15,-58-(A.brow??1)*8]],6);
 eye(-20,-15,25,28,{skin:P.skinC,lid:A.blink?1:(A.lid??.05),look,pupil:3.5,lw:6,jitter:j});
 eye(23,-14,24,28,{skin:P.skinC,lid:A.blink?1:(A.lid??.05),look,pupil:3.5,lw:6,jitter:j});
 shape(ell(1,18,8,7,12),{fill:P.skinCs,lw:4});
 const m=A.mouth||{};
 mouth(0,51,44,{o:m.o||0,w:m.w??1,sm:m.sm??-.7,skew:m.skew||0,lw:6});
}
export function cal(A){
 const f=A.face??1,n=A.nerv||0,j=(Math.floor((A.t||0)*12)%2?1:-1)*n*4;
 push();translate(A.x+j,A.y+(A.bob||0));scale((A.s??1)*f,A.s??1);
 for(const sx of [-1,1]){
  shape(noodle([sx*20,-116],[sx*27,-20],0,25,20),{fill:P.skinC,lw:6,shade:()=>hardShadow(sx>0?0:-60,-70,60,60,P.skinCs)});
  shape(spline([[sx*27-25,-5],[sx*27-22,-23],[sx*27+9,-25],[sx*27+34,-10],[sx*27+31,7]]),{fill:'#3a3942',lw:6});
 }
 push();rotate(A.lean??0);
 const shL=[-47,-239],shR=[48,-238],aL=A.armL||{h:[-8,112],bend:-12},aR=A.armR||{h:[8,112],bend:12};
 const arm=(sh,a)=>{
  const hp=[sh[0]+a.h[0],sh[1]+a.h[1]];
  shape(noodle(sh,hp,a.bend||0,26,19),{fill:P.skinC,lw:6});
  shape(noodle(sh,[sh[0]+(hp[0]-sh[0])*.35,sh[1]+(hp[1]-sh[1])*.35],0,38,34),{fill:P.shirtC,lw:6});
  hand(hp[0],hp[1],Math.atan2(hp[1]-sh[1],hp[0]-sh[0]),16,P.skinC,{fist:!!a.fist,lw:5});return hp;
 };
 arm(shL,aL);
 shape(spline([[-45,-248],[-70,-225],[-66,-104],[-40,-82],[42,-82],[68,-108],[70,-225],[46,-248]]),{fill:P.shirtC,lw:7,shade:()=>fillOnly(spline([[7,-260],[74,-240],[76,-70],[25,-72]]),'#4d6071',{boil:.35})});
 // giant crescent headphones around neck: signature silhouette
 stroke(arc(0,-244,66,49,Math.PI*.05,Math.PI*.95,24),16,{line:'#423748'});
 shape(rr(-75,-241,24,50,10),{fill:'#d48c4e',lw:6});shape(rr(51,-241,24,50,10),{fill:'#d48c4e',lw:6});
 // condiment packet belt
 shape(rr(-58,-116,116,20,6),{fill:P.belt,lw:5});
 for(let i=0;i<5;i++)shape(rr(-47+i*22,-127,14,25,3),{fill:['#d85d50','#e5c35b','#6aa36f','#d85d50','#e5c35b'][i],lw:3});
 shape(noodle([0,-247],[0,-278],0,27,24),{fill:P.skinC,lw:6});
 push();translate(0,-350);rotate(A.headTilt??0);calHead(A);pop();
 arm(shR,aR);
 pop();pop();
}
