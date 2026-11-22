// Original warehouse, printer and wrong destinations for Portal Printer.
import { clamp,lerp,hash,TAU } from '/core/lib.js';
import { INK,push,pop,translate,rotate,scale,shape,fillOnly,stroke,ell,arc,rr,rect,spline,noodle,dot,text,g } from '/styles/scifi-toon/demo/toon.js';

export const WCOL={
 warehouse:'#9aaa92',warehouse2:'#74846f',floor:'#5c5b55',rust:'#bd693b',cream:'#eadcbd',box:'#b88755',boxS:'#8e6243',
 printer:'#6e7773',printerS:'#4c5654',screen:'#282c33',cyan:'#72eff0',cyan2:'rgba(114,239,240,.30)',ink:'#1b1422'
};
const shade=(p,c)=>fillOnly(p,c,{boil:.35});
export function warehouse(t,{alarm=0}={}){
 // flat bands only
 fillOnly(rect(-800,-1000,2800,860),WCOL.warehouse,{boil:.35});
 fillOnly(rect(-800,-140,2800,640),WCOL.warehouse2,{boil:.35});
 fillOnly(rect(-800,500,2800,1400),WCOL.floor,{boil:.35});
 // wall ribs and hazard stripes
 for(let x=-500;x<1800;x+=210)shape(rect(x,-180,12,670),{fill:'#667462',lw:4});
 for(let i=0;i<10;i++){
  const x=-120+i*130;
  shape([[x,470],[x+70,470],[x+28,522],[x-42,522]],{fill:i%2?WCOL.rust:'#3b3a38',lw:3});
 }
 // shelves with uneven warehouse clutter
 for(const [sy,sc] of [[90,.9],[300,1]]){
  shape(rect(-640,sy,430,22),{fill:'#40484a',lw:5});
  for(let i=0;i<4;i++){
   shape(rr(-610+i*95,sy-90-(i%2)*15,72,88+(i%2)*15,4),{fill:i%2?WCOL.box:'#d3a66c',lw:5,shade:()=>shade([[-610+i*95,sy-5],[-540+i*95,sy-5],[-540+i*95,sy-78]],WCOL.boxS)});
  }
 }
 // conveyor foreground
 shape([[130,480],[1420,480],[1545,650],[0,650]],{fill:'#4a4d50',lw:7,shade:()=>shade([[500,480],[1420,480],[1545,650],[650,650]],'#37393c')});
 for(let x=110;x<1450;x+=105)shape(ell(x,553,34,20,24),{fill:'#8e9796',lw:4});
 // overhead lamps: no glow, just flat fixtures
 for(const x of [70,530,990]){shape(rr(x,-315,185,48,16),{fill:'#3a4142',lw:6});shape(rect(x+18,-304,149,13),{fill:WCOL.cream,lw:3});}
 // background sign
 shape(rr(1080,-80,285,95,9),{fill:'#657169',lw:5});
 text('NIGHT SHIPPING',1222,-43,{font:'800 27px "Baloo 2"',fill:WCOL.cream});
 text('BAY 04',1222,-8,{font:'400 22px "VT323"',fill:'#d6c780'});
}
export function parcel(x,y,s=1,{damage=0,slime=0}={}){
 push();translate(x,y);scale(s);
 shape(rr(-110,-110,220,150,10),{fill:WCOL.box,lw:7,shade:()=>shade([[22,-110],[110,-110],[110,40],[44,40]],WCOL.boxS)});
 stroke([[-110,-49],[110,-49]],5);stroke([[0,-109],[0,-50]],5);
 shape(rect(-38,-104,76,48),{fill:'#d4ae70',lw:4});
 if(damage){
  stroke([[-83,-92],[-57,-61],[-81,-26]],7);stroke([[74,-75],[50,-44],[79,-20]],7);
  shape(spline([[45,-105],[84,-90],[65,-67],[97,-49],[68,-33],[104,-13],[62,7]]),{fill:'#6b4650',lw:5});
 }
 if(slime){
  for(const [dx,len] of [[-68,35],[28,50],[72,27]])shape(spline([[dx-12,-112],[dx+13,-112],[dx+10,-112+len*.6],[dx,-112+len],[dx-9,-112+len*.6]]),{fill:'#b5d83a',lw:4});
 }
 pop();
}
export function printer(x,y,s=1,{screen='READY',paper=0,paperText='OHIO',shake=0,t=0}={}){
 push();translate(x+(shake?Math.sin(Math.floor(t*24)*3.7)*shake:0),y);scale(s);
 // wheeled battered cart
 shape(rr(-180,-185,360,230,18),{fill:WCOL.printer,lw:7,shade:()=>shade([[55,-185],[180,-185],[180,45],[78,45]],WCOL.printerS)});
 shape(rr(-145,-155,210,82,8),{fill:'#4b5251',lw:6});
 shape(rr(-130,-143,180,58,5),{fill:WCOL.screen,lw:4});
 text(screen,-40,-111,{font:'400 23px "VT323"',fill:'#e5d36b'});
 // keypad
 for(let j=0;j<3;j++)for(let i=0;i<4;i++)shape(rr(76+i*26,-145+j*28,19,18,3),{fill:i===3&&j===2?WCOL.rust:'#a0a59d',lw:3});
 // thermal slot
 shape(rr(-116,-48,232,35,10),{fill:'#2c2f30',lw:5});
 if(paper>0){
  const L=lerp(0,100,paper);
  shape(rr(-95,-15,190,L,4),{fill:WCOL.cream,lw:4});
  if(L>55){text(paperText==='RETURN'?'RETURN TO SENDER':'SHIP TO: '+paperText,0,27,{font:'800 16px "VT323"',fill:INK});stroke([[-72,45],[68,45]],2.5);}
 }
 // dents / tape repair
 stroke([[-156,-30],[-142,-15],[-151,1]],4,{line:'#383d3d'});
 shape(rr(90,12,62,25,2),{fill:'#d4bd69',lw:3});text('88',121,27,{font:'800 13px "VT323"',fill:INK});
 // cart and wheels
 stroke([[-140,46],[-140,137]],9);stroke([[140,46],[140,137]],9);
 shape(ell(-140,143,28,28,26),{fill:'#34343b',lw:6});shape(ell(140,143,28,28,26),{fill:'#34343b',lw:6});
 pop();
}
function portalCore(cx,cy,rx,ry,t,kind,open){
 const R=open; if(R<=.001)return;
 push();translate(cx,cy);scale(R,R);
 // core and world bands; only portal uses cyan
 shape(ell(0,0,rx*.78,ry*.82,60),{fill:'#dffff0',lw:5});
 if(kind==='frost'){
  fillOnly(ell(0,18,rx*.72,ry*.72,50),'#344e9b',{boil:.3});
  shape(spline([[-rx*.65,55],[-80,5],[-15,28],[65,-10],[rx*.6,44],[rx*.62,ry*.62],[-rx*.63,ry*.62]]),{fill:'#f2e9df',lw:4});
  for(let i=0;i<5;i++)shape(ell(-110+i*55,-40+(i%2)*34,9,13,16),{fill:'#e46763',lw:3});
 } else if(kind==='jelly'){
  fillOnly(ell(0,0,rx*.72,ry*.74,50),'#9b2f79',{boil:.3});
  for(let i=0;i<6;i++)shape(ell(-105+i*42,40-Math.sin(i)*55,35,48,30),{fill:i%2?'#b7d83d':'#d9509c',lw:4});
 } else if(kind==='office'){
  fillOnly(ell(0,0,rx*.72,ry*.74,50),'#d8c7a8',{boil:.3});
  shape(rect(-rx*.66,30,rx*1.32,ry*.56),{fill:'#8e765f',lw:3});
  for(let i=0;i<3;i++){shape(rr(-120+i*85,-90,58,120,4),{fill:'#b8a78c',lw:4});shape(rect(-109+i*85,-72,36,12),{fill:'#6c6259',lw:2});}
 } else {
  fillOnly(ell(0,0,rx*.72,ry*.74,50),'#253a45',{boil:.3});
 }
 pop();
}
export function portal(cx,cy,r,t,{open=1,kind='frost',spin=1}={}){
 if(open<=.001)return;
 const R=r*open,rx=R*.75,ry=R;
 // flat translucent wash around aperture, no gradients
 shape(ell(cx,cy,rx*1.1,ry*1.08,70),{fill:'rgba(114,239,240,.13)',lw:0,boil:.4});
 portalCore(cx,cy,rx,ry,t,kind,open);
 // spiral arms, rim and sparks in the portal-only cyan
 for(let k=0;k<5;k++){
  const a=t*1.7*spin+k*TAU/5;
  const pts=[];
  for(let j=0;j<18;j++){
    const u=j/17,rad=lerp(R*.18,R*.72,u),aa=a+u*2.7;
    pts.push([cx+Math.cos(aa)*rad*.75,cy+Math.sin(aa)*rad]);
  }
  stroke(pts,6,{line:k%2?WCOL.cyan:'#bffeff',boil:.55});
 }
 // lumpy thick rim
 const rim=[];for(let i=0;i<72;i++){const a=i/72*TAU,w=1+.045*Math.sin(i*2.3+Math.floor(t*12)%3);rim.push([cx+Math.cos(a)*rx*w,cy+Math.sin(a)*ry*w]);}
 stroke([...rim,rim[0]],10,{line:INK,boil:1.2});stroke([...rim,rim[0]],5,{line:WCOL.cyan,boil:.8});
 for(let i=0;i<7;i++){const a=t*2+i*1.7,rrr=R*(.82+.07*Math.sin(i));dot(cx+Math.cos(a)*rrr*.75,cy+Math.sin(a)*rrr,4+(i%3),WCOL.cyan);}
 // bottom drips
 for(const dx of [-.28,.18,.42])shape(spline([[cx+dx*rx-8,cy+ry*.83],[cx+dx*rx+8,cy+ry*.82],[cx+dx*rx+6,cy+ry*(.98+Math.abs(dx)*.2)],[cx+dx*rx,cy+ry*(1.08+Math.abs(dx)*.2)],[cx+dx*rx-6,cy+ry*.98]]),{fill:WCOL.cyan,lw:5});
}
export function sluglet(x,y,s=1,t=0,{ice=0}={}){
 push();translate(x,y);scale(s);
 const wob=Math.sin(Math.floor(t*12)*.8)*4;
 shape(spline([[-72,0],[-64,-55],[-33,-83+wob],[5,-87-wob],[47,-65],[72,-18],[61,12],[-50,18]]),{fill:'#b5d83a',lw:7,shade:()=>shade([[22,-90],[76,-66],[70,12],[31,11]],'#7fa436')});
 // cardboard scrap on back
 shape(spline([[-28,-71],[27,-82],[53,-41],[8,-30],[-39,-39]]),{fill:WCOL.box,lw:5});
 for(const ex of [-35,-10,17,40]){shape(ell(ex,-48+(Math.abs(ex)%8),12,15,22),{fill:'#fff',lw:5});dot(ex+2,-46,3.8);}
 // little mouth and feelers
 stroke([[-12,-17],[4,-13],[17,-19]],4);stroke([[-54,-55],[-69,-91]],4);stroke([[48,-57],[65,-91]],4);
 dot(-69,-94,4);dot(66,-94,4);
 if(ice)for(let i=0;i<5;i++)shape([[ -60+i*29,-72],[-51+i*29,-96],[-43+i*29,-72]],{fill:'#f1e9df',lw:3});
 pop();
}
export function jellyStamp(x,y,s=1,t=0){
 push();translate(x,y);scale(s);
 const wag=Math.sin(t*8)*10;
 shape(noodle([0,0],[90,-35+wag],25,44,28),{fill:'#b7d83d',lw:7});
 shape(ell(105,-38+wag,34,26,28),{fill:'#d9509c',lw:6});
 text('NO',105,-33+wag,{font:'800 17px "Baloo 2"',fill:'#fff'});
 pop();
}
