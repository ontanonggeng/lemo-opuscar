// BLACKSTAR / The Undo Button — original animated 2D sitcom, native 9:16.
import {init,frame,shape,stroke,ell,rr,rect,spline,noodle,push,pop,translate,rotate,scale,S,g,text as drawText} from '/styles/scifi-toon/demo/toon.js';
const canvas=document.getElementById('stage');
canvas.width=innerWidth;canvas.height=innerHeight;
init(canvas);
if(Math.abs(canvas.height/canvas.width-16/9)>.02)throw Error('Native vertical viewport required');
const K=canvas.width/540;
const show=await fetch('/films/the-undo-button/out/performance.json').then(x=>{if(!x.ok)throw Error('Missing Kokoro performance.json');return x.json()});
if(show.lines.length!==10)throw Error('Missing TTS lines');
const WM=new Image();WM.src='/brand/blackstar/v5/video/corner-watermark-white-512.png';await WM.decode();
window.DUR=44;window.EV=[];
const C={ink:'#211d2b',wall:'#90a19c',shade:'#617b7b',ceiling:'#e2cdb1',sky:'#e6ae8e',sun:'#d37f76',floor:'#574b60',desk:'#a97860',edge:'#664854',ivory:'#f6ebd6',gold:'#e6ae55',gold2:'#b87848',skin:'#a96e55',skin2:'#754939',hair:'#3d344d',hair2:'#6e556b',white:'#fff9ed',teal:'#80c0b1',steel:'#9cabb0',screen:'#283c4a',red:'#c65b5a',coffee:'#54342f'};
const c=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),ease=x=>{x=c(x);return x*x*(3-2*x)},qt=t=>Math.floor(t*12+.0001)/12;
const poly=(p,f,lw=5)=>shape(p,{fill:f,lw}),r=(x,y,w,h,b,f,lw=4)=>poly(rr(x,y,w,h,b),f,lw),o=(x,y,rx,ry,f,lw=4)=>poly(ell(x,y,rx,ry,42),f,lw),line=(a,w=4,f=C.ink)=>stroke(a,w,{line:f}),curve=(a,f,lw=5)=>poly(spline(a,true,6),f,lw);
const txt=(s,x,y,z=19,f=C.ink,align='center')=>drawText(s,x,y,{font:'800 '+z+'px Arial',fill:f,align});
function bg(f){g.save();g.setTransform(1,0,0,1,0,0);g.fillStyle=f;g.fillRect(0,0,canvas.width,canvas.height);g.restore()}
function mouth(who,t){let a=show.lines.find(x=>x.who===who&&t>=x.start&&t<x.end);return a?(a.mouth12fps[Math.floor((t-a.start)*12)]||0):0}
function windowView(morning=false){
 r(33,92,238,282,8,C.ink,5);r(42,101,220,263,4,morning?C.ivory:C.sky,0);
 poly([[42,235],[262,206],[262,364],[42,364]],C.sun,0);
 for(let i=0;i<5;i++){let x=47+i*46;poly([[x,282-i*10],[x+34,277-i*7],[x+34,363],[x,363]],'#697786',0);for(let j=0;j<3;j++)r(x+7,301+j*18-i*6,7,4,1,C.ivory,0)}
 r(152,102,7,263,1,C.ink,0);r(42,231,220,5,1,C.ink,0);
 r(26,365,250,16,3,C.ivory,3);
 for(let i=0;i<5;i++)line([[45,118+i*19],[258,118+i*19]],1.5,'#aeafa4');
}
function remote(x,y,s=1,shrink=0){
 push();translate(x,y);scale(Math.max(.001,s*(1-shrink)));rotate(-.13);
 o(0,52,29,8,'#605158',0);r(-25,-66,50,118,11,C.ink,6);r(-19,-59,38,105,7,C.steel,2);
 r(-15,-50,30,31,4,C.screen,1);txt('UNDO',0,-40,9,C.ivory);txt('v01',0,-29,8,C.teal);
 o(0,11,16,16,C.red,3);o(-5,6,4,4,'#f5baa7',0);
 r(-12,34,24,3,1,C.ink,0);pop()
}
function loop(t){
 push();translate(467,581);
 o(0,30,36,9,'#584a52',0);
 poly([[-34,14],[-27,-34],[-10,-57],[14,-62],[31,-32],[35,14]],C.ink,5);
 poly([[-23,7],[-17,-31],[-1,-47],[9,-49],[23,-26],[23,7]],C.steel,2);
 r(-14,-35,27,33,5,C.screen,3);
 let speaking=mouth('LOOP',t)>0;
 o(0,-18,speaking?11:7,speaking?8:6,speaking?C.gold:C.teal,1);
 for(let i=0;i<4;i++)line([[-12+i*8,2],[-10+i*8,2]],2);
 pop()
}
function rae(x,y,s,t,emotion='flat',pajama=false){
 push();translate(x,y+Math.sin(qt(t)*2.1)*1.7);scale(s);
 o(1,7,61,11,'#433e4d',0);
 poly([[-45,-140],[-7,-141],[-9,-18],[-46,-18]],pajama?'#78809c':'#465d67');
 poly([[10,-142],[46,-141],[47,-19],[8,-18]],pajama?'#78809c':'#465d67');
 r(-55,-28,54,25,9,C.ink);r(7,-28,53,25,9,C.ink);
 curve([[-64,-298],[-38,-323],[37,-321],[70,-294],[60,-133],[-62,-132]],pajama?'#7c829e':C.gold,5);
 poly([[-61,-288],[-49,-300],[-37,-142],[-63,-141]],pajama?'#5b6282':C.gold2,1);
 poly([[32,-313],[58,-295],[59,-139],[31,-142]],pajama?'#636e8a':'#c28548',0);
 poly([[-22,-314],[0,-295],[25,-317],[24,-282],[-25,-283]],C.ivory,3);
 line([[0,-284],[0,-137]],4);for(let j=0;j<3;j++)o(1,-257+j*40,3,3,C.ink,1);
 const arm=emotion==='shock'?39:emotion==='panic'?53:0;
 poly(noodle([-58,-286],[-80,-211-arm],-20,29,22),pajama?'#777f9c':C.gold,4);
 poly(noodle([59,-287],[93,-211-arm],16,29,22),pajama?'#777f9c':C.gold,4);
 o(-80,-210-arm,14,18,C.skin,3);o(95,-210-arm,14,18,C.skin,3);
 r(-18,-365,37,52,8,C.skin2);
 curve([[-68,-395],[-72,-454],[-56,-492],[-14,-514],[39,-493],[65,-451],[59,-384],[40,-357],[-55,-358]],C.hair,6);
 curve([[-46,-465],[-32,-477],[30,-465],[49,-425],[39,-385],[-6,-369],[-43,-386]],C.skin,5);
 poly([[-43,-433],[-32,-406],[-32,-383],[-44,-393]],C.skin2,0);
 o(-47,-424,10,14,C.skin2,2);o(43,-418,9,14,C.skin2,2);
 curve([[-65,-462],[-51,-505],[-19,-515],[25,-504],[63,-473],[47,-454],[18,-465],[6,-480],[-12,-462],[-40,-445]],C.hair,5);
 poly([[-39,-489],[-14,-512],[13,-503],[10,-469],[-6,-457],[-22,-473]],C.hair2,0);
 for(const X of [-24,22]){
   o(X,-420,19,20,C.white,4);
   o(X+(emotion==='shock'?-6:1),-416,5,5,C.ink,1);
   if(emotion==='sleepy')poly([[X-17,-439],[X+17,-439],[X+17,-425],[X-17,-425]],C.skin,0);
 }
 let raised=emotion==='shock'||emotion==='panic';
 line([[-47,-453],[-29,-457-(raised?7:0)],[-12,-449]],4.8,C.hair);
 line([[7,-450],[27,-458-(raised?7:0)],[43,-448]],4.8,C.hair);
 poly([[-1,-422],[7,-397],[-4,-395]],C.skin2,1.5);
 let a=mouth('RAE',t);
 if(a>.1||raised){o(0,-387,12+3*a,5+15*a,'#663c45',3);if(a>.55)r(-9,-394,18,3,1,C.white,0)}
 else line([[-13,-388],[-3,-385],[12,-391]],3,'#663c45');
 o(47,-406,3,5,C.gold,1);r(37,-263,16,19,2,C.teal,2);
 pop()
}
function apartment(t,{morning=false,panic=false,close=false}={}){
 bg(C.wall);
 poly([[0,0],[540,0],[540,135],[0,153]],C.ceiling,0);
 poly([[303,123],[540,109],[540,666],[303,666]],C.shade,0);
 r(0,643,540,317,0,C.floor,0);for(let i=0;i<10;i++)line([[0,677+i*27],[540,662+i*27]],1.2,'#4c465a');
 windowView(morning);
 r(426,168,68,109,9,C.ink,5);r(433,178,54,72,5,C.screen,2);
 txt('LOOP',460,193,12,C.ivory);o(459,232,9,7,panic?C.red:C.teal,1);
 r(414,279,88,13,3,C.ivory,3);
 o(337,841,113,20,'#433e49',0);
 r(273,500,141,150,12,'#62565b',5);
 r(19,600,501,42,9,C.desk,5);poly([[22,639],[520,639],[523,672],[19,672]],C.edge,3);
 r(54,671,26,285,3,'#574552',2);r(473,671,25,285,3,'#574552',2);
 rae(316,823,close?1.26:1,t,panic?'shock':morning?'sleepy':'flat',morning);
 // Laptop and desk cover the lower half of the protagonist naturally.
 r(186,505,207,111,11,C.ink,6);r(198,517,183,88,5,C.screen,2);
 poly([[184,618],[393,618],[424,634],[157,634]],C.steel,4);
 r(51,605,103,17,4,C.ivory,1);o(90,605,19,5,'#75594e',1);
 loop(t);
}
function deskMacro(t,ending=false){
 bg(C.wall);poly([[0,0],[540,0],[540,240],[0,292]],C.ceiling,0);
 poly([[0,218],[540,203],[540,960],[0,960]],C.desk,0);
 for(let i=0;i<9;i++)line([[0,330+i*75],[540,306+i*75]],1.4,'#8c6156');
 poly([[54,517],[411,495],[478,689],[104,722]],C.ink,7);
 poly([[67,522],[410,503],[454,675],[110,704]],'#69717a',3);
 for(let row=0;row<4;row++)for(let j=0;j<10;j++)r(96+j*32+row*6,534+row*33-j*1.3,24,21,3,(row+j)%9===0?C.steel:C.ivory,2);
 o(188,419,103,24,'#69564e',0);o(276,376,35,49,C.ivory,5);
 r(148,301,130,122,26,C.ivory,6);
 poly([[161,314],[184,314],[191,416],[165,416]],'#cbb6a4',0);
 o(212,308,62,21,C.ink,4);o(212,305,54,12,C.coffee,1);
 let spill=ending?ease((t-35.3)/.9):1-ease((t-.55)/1.18);
 if(spill>.01){
  curve([[272,363],[300+spill*68,362],[336+spill*112,397+spill*58],[296+spill*100,438+spill*90],[264,425]],C.coffee,2);
  for(let i=0;i<8;i++)o(295+spill*(35+i*21),378+spill*((i%3)*41),4+spill*3,2+spill*2,C.coffee,0);
 }
 poly([[460,313],[540,289],[540,484],[438,469]],C.gold,4);
 poly(noodle([455,427],[376,538],-23,55,31),C.skin,4);o(378,537,25,24,C.skin,3);
 remote(380,544,1.35);
 if(ending)phoneReply();
}
function phoneReply(){
 push();translate(306,117);rotate(.08);
 r(-144,-66,288,228,23,C.ink,7);r(-129,-51,258,200,13,C.screen,3);
 txt('BOSS',0,-12,21,C.ivory);
 r(-113,21,226,75,11,'#49746c',1);txt('LOVE YOU TOO',0,57,23,C.white);
 txt('NEW MESSAGE',0,120,14,C.gold);pop()
}
function phoneInsert(t,revoked=false){
 bg('#74847f');poly([[0,0],[540,0],[540,960],[0,960]],C.wall,0);
 poly(noodle([54,865],[123,716],-22,93,69),C.gold,4);
 poly(noodle([498,857],[430,703],22,93,69),C.gold,4);
 push();translate(268,433);rotate(-.04);
 r(-190,-323,380,686,42,C.ink,8);r(-174,-307,348,648,31,C.screen,4);
 r(-42,-295,84,11,4,C.ink,0);
 txt('MESSAGES',0,-247,18,C.teal);
 r(-141,-206,281,65,11,C.steel,2);txt('BOSS',0,-176,22,C.ink);
 if(!revoked){r(-132,-90,264,131,14,'#60807a',2);txt('LOVE YOU',0,-46,31,C.white);txt('SENT',0,12,14,C.ivory)}
 else {r(-136,-97,272,97,12,'#426c67',2);txt('MESSAGE UNSENT',0,-50,21,C.white);
       r(-142,64,286,136,12,C.ivory,3);txt('WORK ACCOUNT',0,91,19);
       r(-121,121,242,55,8,C.red,2);txt('ACCESS REVOKED',0,146,20,C.white)}
 pop();
 push();translate(408,781);rotate(-.18);
 poly(noodle([76,230],[7,44],24,62,40),C.skin,4);remote(0,0,1.0);pop()
}
function rewind(t){
 apartment(t,{morning:true,panic:true});
 if(t<19){r(47,698,143,73,10,C.red,5);txt('ALARM',119,731,23,C.white);txt('06:00',153,165,29)}
}
function remoteClose(t){
 apartment(t,{panic:t>26,close:true});
 push();translate(385,588);rotate(.12);
 poly(noodle([113,149],[12,28],12,63,37),C.skin,4);remote(0,0,1.25);pop();
}
function vanish(t){
 bg(C.shade);r(36,207,470,550,21,C.ink,6);r(47,221,446,518,14,C.screen,2);
 txt('UNDO PURCHASE',270,315,28,C.ivory);txt('REMOTE / TODAY',270,365,19,C.ivory);
 const z=ease((t-31.7)/1.7);
 remote(270,546,2.05,z);
 if(z>.04){o(268,548,87*z,76*z,C.teal,2);o(268,548,57*z,47*z,C.ivory,2)}
}
function shot(t){
 return t<2.2?0:t<6.2?1:t<8?2:t<15?3:t<22.5?4:t<29.2?5:t<35.3?6:t<40.4?7:8;
}
function captions(t){
 const a=show.lines.find(x=>t>=x.start&&t<x.end+.08);
 if(!a)return;
 let rows=[],line='';
 for(const word of a.text.split(' ')){let trial=line?line+' '+word:word;if(trial.length>24&&line){rows.push(line);line=word}else line=trial}
 if(line)rows.push(line);
 let y=797-16*(rows.length-1);
 g.save();g.setTransform(K,0,0,K,0,0);
 g.fillStyle='rgba(25,21,35,.93)';g.beginPath();g.roundRect(19,y-45,502,53+32*rows.length,13);g.fill();
 g.fillStyle=a.who==='RAE'?C.gold:C.teal;g.beginPath();g.roundRect(31,y-38,a.who==='RAE'?72:80,25,6);g.fill();
 g.textBaseline='middle';g.textAlign='center';g.font='800 13px Arial';g.fillStyle=C.ink;
 g.fillText(a.who,a.who==='RAE'?67:71,y-25);
 for(let i=0;i<rows.length;i++){
  g.font='800 25px Arial';g.lineJoin='round';g.lineWidth=5.5;g.strokeStyle=C.ink;g.fillStyle=C.white;
  g.strokeText(rows[i],270,y+13+i*31);g.fillText(rows[i],270,y+13+i*31);
 }g.restore()
}
function watermark(){g.save();g.setTransform(K,0,0,K,0,0);g.globalAlpha=.68;g.drawImage(WM,433,39,85,85);g.restore()}
window.render=t=>{
 frame(t,{amp:.85});S.lwScale=K;scale(K);
 switch(shot(t)){
  case 0:deskMacro(t);break;
  case 1:apartment(t);break;
  case 2:phoneInsert(t);break;
  case 3:phoneInsert(t,true);break;
  case 4:rewind(t);break;
  case 5:remoteClose(t);break;
  case 6:vanish(t);break;
  case 7:deskMacro(t,true);break;
  case 8:apartment(t,{panic:true,close:true});break;
 }
 captions(t);watermark();
};
window.READY=true;
