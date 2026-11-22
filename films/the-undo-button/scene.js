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
 push();translate(x,y+Math.sin(qt(t)*1.6)*1.0);scale(s);
 const speaking=mouth('RAE',t),talk=speaking>.1;
 const alarm=emotion==='shock'||emotion==='panic',sleep=emotion==='sleepy';
 const gesture=t>=2.2&&t<6.2?.4:t>=22.5&&t<29.2?.85:t>=40?.2:0;
 // Grounded legs, shadow, two visibly separate shoes.
 o(0,8,64,10,'#3c3544',0);
 poly([[-51,-142],[-8,-142],[-12,-20],[-52,-18]],pajama?'#65788b':'#374f59',4);
 poly([[11,-141],[49,-142],[49,-18],[10,-20]],pajama?'#69778d':'#405565',4);
 poly([[-49,-134],[-32,-134],[-35,-26],[-49,-27]],'#2f4351',0);
 r(-62,-29,59,27,11,'#262834',4);r(6,-29,60,27,11,'#262834',4);
 // High shoulders/collar touch the head silhouette, rather than a floating neck.
 r(-16,-371,33,34,10,C.skin2,3);
 curve([[-72,-328],[-59,-350],[-24,-362],[30,-357],[62,-345],[75,-300],[66,-141],[-68,-139],[-78,-298]],pajama?'#73839c':C.gold,6);
 poly([[-74,-313],[-63,-341],[-42,-347],[-48,-147],[-70,-148]],pajama?'#52667e':'#c18248',1);
 poly([[33,-351],[65,-332],[66,-147],[39,-145]],pajama?'#596f89':'#b97845',1);
 // Layered under-shirt and original asymmetric lapels.
 curve([[-33,-357],[2,-339],[34,-356],[22,-308],[-26,-308]],'#f1e4c9',4);
 poly([[-50,-343],[-19,-325],[-12,-294],[-41,-306]],'#f5c77c',3);
 poly([[49,-343],[14,-326],[17,-304],[42,-313]],'#bd7a49',3);
 line([[0,-305],[0,-143]],4,'#78513e');
 for(let j=0;j<3;j++)o(0,-275+j*40,3,3,'#6e4e42',0);
 poly([[-63,-170],[-31,-172],[-29,-148],[-64,-148]],'#b47b52',1);
 // Sleeves and forearms have two joints, wrist, palm, and finger detail.
 const rightUp=gesture*36+(alarm?27:0);
 poly(noodle([-64,-333],[-94,-282],-14,38,31),pajama?'#718098':C.gold,5);
 poly(noodle([-95,-281],[-97,-240],-8,26,16),C.skin,4);
 poly(noodle([64,-333],[89,-277-rightUp],17,36,30),pajama?'#718098':C.gold,5);
 poly(noodle([90,-276-rightUp],[113,-238-rightUp],-13,24,16),C.skin,4);
 r(-109,-251,24,17,7,pajama?'#5a6c81':'#b57845',3);
 r(100,-252-rightUp,26,15,6,pajama?'#5a6c81':'#b57845',3);
 o(-96,-235,15,18,C.skin,3);o(116,-235-rightUp,16,18,C.skin,3);
 for(let i=0;i<3;i++){
   line([[-106+i*7,-237],[-102+i*7,-226]],2,C.skin2);
   line([[108+i*6,-237-rightUp],[109+i*6,-226-rightUp]],2,C.skin2);
 }
 // Hair and face are one articulated head with mild blinks, look changes and attitude.
 const tilt=alarm?-.045:talk?Math.sin(qt(t)*4)*.025:t>40?.018:0;
 push();translate(0,-421);rotate(tilt);translate(0,421);
 curve([[-70,-398],[-74,-467],[-62,-500],[-31,-513],[12,-508],[51,-490],[69,-453],[62,-387],[35,-356],[-56,-357]],C.hair,6);
 o(-61,-417,16,26,C.hair2,3);o(58,-412,12,22,C.hair,3);
 // Cheeks, jaw, left hard cel-shadow and realistic ears.
 curve([[-48,-465],[-32,-477],[28,-472],[49,-439],[45,-384],[23,-365],[-25,-363],[-49,-384]],C.skin,5);
 poly([[-46,-437],[-35,-406],[-32,-373],[-44,-389]],C.skin2,0);
 o(-49,-424,10,14,C.skin2,2);o(46,-421,10,14,C.skin2,2);
 // Clear three-part original silhouette: side part, volume, and diagonal fringe.
 curve([[-69,-469],[-56,-509],[-27,-515],[9,-506],[39,-494],[65,-476],[52,-448],[30,-458],[19,-479],[1,-459],[-21,-455],[-42,-443]],C.hair,5);
 poly([[-44,-491],[-29,-511],[-10,-504],[6,-490],[-5,-469],[-29,-458]],C.hair2,1);
 line([[-60,-463],[-47,-480],[-24,-486]],2,'#88708a');
 // Heavy natural upper lids instead of permanently surprised googly eyes.
 const eyeY=-420,look=t<6?7:t<15?-6:t<23?4:t<35?-4:2;
 const blink=!alarm && (Math.floor(qt(t)*3.2)%44===0);
 for(const X of [-24,21]){
   o(X,eyeY,16.5,17.5,C.white,4);
   o(X+look*.5,eyeY+4,4.8,5.5,C.ink,0);
   if(!alarm){
     poly([[X-17,-439],[X+17,-439],[X+16,-435+(sleep?13:6)],[X-16,-435+(sleep?13:6)]],C.skin,0);
     line([[X-16,-434+(sleep?13:6)],[X+15,-434+(sleep?13:6)]],3.2,C.hair);
   }
   if(blink)line([[X-14,eyeY],[X+14,eyeY]],3.6,C.hair);
 }
 line([[-45,-451],[-29,-449-(alarm?9:0)],[-10,-451]],alarm?6:4.5,C.hair);
 line([[6,-450],[26,-453-(alarm?9:0)],[43,-447]],alarm?6:4.5,C.hair);
 // Nose is an organic wedge; mouth uses actual per-line Kokoro amplitude.
 poly([[-1,-421],[8,-400],[-5,-399]],C.skin2,1.8);
 o(-32,-392,8,4,'#bc7d63',0);o(27,-389,7,3,'#bc7d63',0);
 if(talk){o(1,-384,13+speaking*3,3+speaking*13,'#603944',3);if(speaking>.55)r(-10,-390,20,4,1,C.ivory,0)}
 else if(alarm){o(0,-386,10,13,'#573b42',3)}
 else line([[-14,-389],[-4,-386],[6,-389],[13,-392]],3,'#68444b');
 o(48,-404,3.5,5,C.gold,0);
 pop();
 // Tailored seam lines and tiny personal patch for silhouette continuity.
 line([[-63,-164],[-63,-149],[58,-149]],2,'#926442');
 r(39,-263,16,19,3,C.teal,2);
 pop();
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
 bg(C.wall);poly([[0,0],[540,0],[540,239],[0,292]],C.ceiling,0);
 poly([[0,222],[540,207],[540,960],[0,960]],C.desk,0);
 for(let i=0;i<9;i++)line([[0,337+i*72],[540,310+i*72]],1.4,'#916456');
 // Proper keyboard body and keybed with dimensional shadow.
 poly([[49,520],[414,497],[480,690],[101,725]],'#211e2d',8);
 poly([[62,529],[405,506],[455,680],[114,711]],'#63717a',3);
 poly([[62,530],[405,506],[407,525],[65,549]],'#9aa5a6',1);
 for(let row=0;row<4;row++)for(let j=0;j<10;j++){
  let xx=96+j*32+row*6, yy=536+row*34-j*1.3;
  r(xx,yy,23,21,3,(row+j)%11===0?'#a8b8ba':C.ivory,2);
 }
 const shift=ending?0:.30*(1-ease((t-.62)/.95));
 // Mug rotates back as coffee is unspilled. Handle stays attached to vessel.
 push();translate(211,416);rotate(shift);translate(-211,-416);
 o(191,421,100,21,'#6b514a',0);
 o(276,361,36,46,C.ivory,6);
 r(149,306,129,114,27,C.ivory,6);
 poly([[162,322],[185,319],[190,418],[161,417]],'#c9b6a6',0);
 o(213,314,61,19,C.ink,4);o(214,310,53,12,C.coffee,1);
 o(226,307,16,4,'#845646',0);
 pop();
 const spill=ending?ease((t-35.3)/.85):1-ease((t-.52)/1.2);
 if(spill>.015){
   // Coherent flat liquid surface, tapered toward the keyboard, not a dark blob.
   curve([[260,371],[291+spill*14,369],[322+spill*42,388+spill*22],[318+spill*56,423+spill*39],[280+spill*12,429],[251,404]],'#5b3630',2);
   for(let i=0;i<12;i++){
     const dx=292+spill*(13+(i%6)*18),dy=382+spill*((i%4)*27);
     o(dx,dy,1.5+spill*3,1+spill*2,C.coffee,0);
   }
 }
 // Rae's sleeve/forearm directly meets the physical red button.
 poly([[461,312],[540,299],[540,479],[437,458]],C.gold,4);
 poly(noodle([453,430],[372,536],-25,55,32),C.skin,4);
 o(379,537,24,24,C.skin,3);
 remote(382,548,1.32);
 if(!ending && t>.55 && t<1.72){
   const power=Math.sin(Math.PI*c((t-.55)/1.17));
   for(let i=0;i<3;i++){const rx=25+i*16+power*9,ry=24+i*16+power*9;const ring=ell(384,543,rx,ry,32);line([...ring,ring[0]],2.2,i===1?C.ivory:C.teal)}
   for(let i=0;i<3;i++)line([[275+i*19,366],[260+i*19,350]],2,C.ivory);
 }
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
 // Close two-shot: the remote sits in Rae's raised hand, not a detached foreground fist.
 remote(419,564,.86);
 if(t>27){line([[396,502],[405,488]],3,C.gold);line([[408,502],[421,489]],3,C.gold)}
}
function vanish(t){
 apartment(t,{panic:t>32.5,close:true});
 const z=ease((t-31.3)/2.8);
 // The object disappears from the character's existing hand, preserving contact.
 remote(418,557,.94,z);
 if(t>29.2 && t<35.3){
   r(18,122,194,83,11,C.screen,5);
   txt('UNDO PURCHASE',115,150,13,C.ivory);
   txt(z>.6?'REVERSED':'REMOTE / TODAY',115,178,13,z>.6?C.teal:C.gold);
 }
 if(z>.12 && z<.95){
   const ring=ell(418,557,17+z*46,18+z*48,40);line([...ring,ring[0]],3,C.teal);
 }
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
  case 8:apartment(t,{panic:false,close:true});break;
 }
 captions(t);watermark();
};
window.READY=true;
