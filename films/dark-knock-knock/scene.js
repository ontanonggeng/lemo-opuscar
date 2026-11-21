// BLACKSTAR / Dark Knock-Knock Jokes. Original adult sci-fi sitcom animation.
// Lemo-Opuscar scifi-toon screen-space boiling contour engine, 12 fps acting.
import {init,frame,shape,fillOnly,stroke,ell,rr,rect,dot,text,push,pop,translate,scale,g} from '/styles/scifi-toon/demo/toon.js';
const canvas=document.getElementById('stage');canvas.width=540;canvas.height=960;init(canvas);
const response=await fetch('/films/dark-knock-knock/out/timeline.json');
if(!response.ok)throw new Error('Timeline missing. Assemble ElevenLabs tracks first.');
const timeline=await response.json();
const brandCard=new Image();brandCard.src='/brand/blackstar/v5/video/end-card-black-9x16.png';await brandCard.decode();
const W=540,H=960,ink='#17121d',ivory='#f5f0e4',lime='#d7fa28';
const orange='#f0a452',rust='#b85f4b',lilac='#8072a0';
window.DUR=timeline.duration;window.EV=[];window.READY=true;
const beat=t=>Math.floor(t*12)/12;
function polygon(p,c,lw=7){shape(p,{fill:c,lw})}
function rounded(x,y,w,h,r,c,lw=7){shape(rr(x,y,w,h,r),{fill:c,lw})}
function oval(x,y,rx,ry,c,lw=7){shape(ell(x,y,rx,ry,36),{fill:c,lw})}
function line(p,width=7){stroke(p,width)}
function eye(x,y,rx,ry,lid=.1,gaze=0){
  oval(x,y,rx,ry,'#fff',5);dot(x+gaze*rx*.4,y+3,Math.max(3,rx*.14),ink);
  if(lid>.02)polygon([[x-rx-4,y-ry-3],[x+rx+4,y-ry-3],[x+rx+4,y-ry+lid*ry*1.55],[x-rx-4,y-ry+lid*ry*1.55]],'#82739d',3);
}
function environment(panic){
  g.fillStyle='#272337';g.fillRect(0,0,W,H);
  for(let i=0;i<6;i++){rounded(-22+i*102,72,88,700,6,i%2?'#332b45':'#2b283c',4);line([[i*102+5,89],[i*102+5,745]],2)}
  g.fillStyle='#171520';g.fillRect(0,0,W,70);
  polygon([[0,88],[540,88],[540,98],[0,98]],'#52465e',2);
  oval(180,84,79,13,'#c5b9a3',4);oval(180,84,66,6,'#f6dfab',0);
  for(let i=0;i<4;i++)polygon([[6,340+i*78],[49,340+i*78],[49,353+i*78],[6,353+i*78]],'#53495f',3);
  rounded(296,173,221,607,21,'#15131d',10);
  rounded(308,184,195,579,14,'#494159',8);
  rounded(320,198,171,552,11,'#6e6681',8);
  polygon([[328,215],[344,205],[344,737],[328,737]],'#a098aa',3);
  rounded(332,217,151,118,5,'#342d48',6);
  rounded(353,233,111,82,4,'#251e38',5);
  for(const [x,y] of [[333,191],[490,191],[333,750],[490,750],[337,350],[486,350]])oval(x,y,5,5,'#ded5c6',2);
  polygon([[0,751],[540,751],[540,960],[0,960]],'#211d2c',0);
  polygon([[0,750],[540,750],[540,771],[0,771]],'#4a4150',0);
  for(let x=0;x<540;x+=108)line([[x,772],[x-24,960]],2);
  if(panic)for(let i=0;i<3;i++)polygon([[18+i*38,714],[28+i*38,714],[28+i*38,744],[18+i*38,744]],'#5c4d66',0);
}
function door(t,cue,wallKnock){
  rounded(352,357,101,84,21,'#272137',6);rounded(359,364,88,70,15,'#7d728e',5);
  eye(382,392,17,20,.55,-.4);eye(425,392,17,20,.55,-.4);
  const mouth=cue?.speaker==='D'?.22+.7*Math.abs(Math.sin(beat(t)*12.8)):.1;
  oval(405,419,20,3+mouth*15,'#241928',4);
  if(cue?.speaker==='D'&&mouth>.5)polygon([[391,417],[419,417],[416,423],[394,423]],'#eeeaeb',0);
  rounded(389,474,51,69,18,'#17121d',6);
  oval(414,494,20,19,'#c4b7a4',5);
  oval(407,491,5,7,'#1e1826',0);oval(421,491,5,7,'#1e1826',0);
  polygon([[412,503],[416,503],[414,508]],'#1e1826',0);
  line([[408,511],[408,515],[412,515],[412,511],[416,511],[416,515],[421,515]],2);
  oval(414,531,8,7,wallKnock?lime:'#696078',3);
  rounded(347,613,31,104,12,'#24212e',6);oval(362,666,13,14,'#c1b9a7',5);
  if(cue?.speaker==='D')oval(414,531,7+1.4*Math.abs(Math.sin(beat(t)*8)),6,lime,2);
  if(wallKnock)for(const [dx,dy] of [[6,-14],[-14,9],[16,25]])line([[323+dx,605+dy],[331+dx,594+dy],[340+dx,610+dy],[351+dx,601+dy]],5);
}
function nix(t,cue,panicked){
  const q=beat(t),jitter=panicked?Math.sin(q*41)*2.6:0;
  push();translate(145+jitter,753+Math.sin(q*2)*2);
  rounded(-84,-172,38,111,14,'#65546b',6);
  polygon([[-48,-89],[-19,-89],[-28,0],[-62,0]],'#4c4358');
  polygon([[21,-91],[50,-89],[61,0],[31,0]],'#4c4358');
  rounded(-76,-16,67,20,8,'#1a1824');rounded(11,-16,67,20,8,'#1a1824');
  polygon([[-68,-246],[-40,-281],[40,-282],[71,-242],[62,-80],[-57,-80]],'#f0a452');
  polygon([[-67,-236],[-45,-249],[-19,-213],[-48,-128],[-66,-130]],rust,4);
  polygon([[46,-261],[68,-238],[88,-149],[62,-143],[23,-218]],'#e18b48');
  polygon([[-61,-212],[-89,-153],[-79,-120],[-55,-142]],'#c87743');
  rounded(-85,-142,22,23,6,'#d6b889',4);rounded(67,-146,23,25,8,'#d6b889',4);
  line([[0,-254],[0,-88]],5);
  for(let i=0;i<3;i++)oval(13,-220+i*47,4,4,'#2e2a33',0);
  polygon([[-50,-300],[-77,-332],[-71,-380],[-22,-407],[47,-396],[81,-348],[63,-293]],'#ad624e');
  oval(2,-344,69,58,'#d9b789',7);
  oval(-30,-348,24,26,'#fff',5);oval(26,-350,27,27,'#fff',5);
  dot(-27+(panicked?7:3),-345,4,ink);dot(27+(panicked?6:3),-348,4,ink);
  line([[-54,-385],[-12,-387]],6);line([[5,-388],[46,-385]],6);
  const mouth=cue?.speaker==='N' ? (.22+.76*Math.abs(Math.sin(q*15.5))) : .12;
  oval(2,-306,19,2+mouth*19,'#3b2331',5);
  if(mouth>.55)polygon([[-9,-308],[14,-308],[12,-302],[-8,-302]],'#f3eee6',0);
  if(panicked)for(let k=0;k<3;k++)line([[-77+k*18,-405-k*5],[-88+k*18,-417-k*5]],4);
  polygon([[-62,-336],[-49,-344],[-45,-329],[-59,-318]],'#a85d4e',2);
  pop();
}
function caption(cue){
  if(!cue)return;
  const speaker=cue.speaker==='N'?'NIX':'DORIS',maxWidth=450,lines=[];
  g.font='bold 30px Arial,sans-serif';let current='';
  for(const word of cue.text.split(/\s+/)){
    const trial=current?current+' '+word:word;
    if(g.measureText(trial).width>maxWidth&&current){lines.push(current);current=word;}else current=trial;
  }
  if(current)lines.push(current);
  const boxY=844-Math.max(0,lines.length-1)*17;
  rounded(19,boxY-30,502,Math.max(106,lines.length*39+55),13,'#15121b',4);
  rounded(30,boxY-20,speaker==='NIX'?75:101,30,8,speaker==='NIX'?orange:lilac,3);
  g.textAlign='center';g.textBaseline='middle';
  g.font='bold 18px Arial,sans-serif';g.fillStyle=ink;
  g.fillText(speaker,speaker==='NIX'?67:79,boxY-5);
  g.font='bold 30px Arial,sans-serif';
  for(let i=0;i<lines.length;i++){
    const y=boxY+32+i*39;g.lineWidth=6;g.lineJoin='round';g.strokeStyle='#100d17';g.strokeText(lines[i],W/2,y);
    g.fillStyle=ivory;g.fillText(lines[i],W/2,y);
  }
}
function overlay(t,cue){
  const tag=t<4.5?'DOOR SECURITY / 2098':t<36?'HUMOR MODULE / ACTIVE':'TENANT STATUS / PENDING';
  rounded(19,118,Math.min(280,22+tag.length*12.8),34,4,'#131019',3);
  g.font='bold 18px monospace';g.textAlign='left';g.fillStyle='#ddd0c3';g.fillText(tag,32,141);
  rounded(19,169,8,11,2,lime,0);g.font='13px monospace';g.fillStyle='#c6c1c5';g.fillText('LEASE OS / V.0.0.13',33,179);
  if(t<2.8){g.font='900 30px Arial,sans-serif';g.fillStyle=ivory;g.fillText('DARK',23,233);g.fillText('KNOCK-KNOCK',23,266)}
  caption(cue);
}
window.render=function render(t){
  frame(t,{amp:1.7});
  if(t>=timeline.brandStart){g.fillStyle='#090c0b';g.fillRect(0,0,W,H);g.drawImage(brandCard,0,0,W,H);return}
  const cue=timeline.lines.find(e=>t>=e.start&&t<e.end)||null;
  const panicked=t>18||!!cue?.text.includes('lease')||!!cue?.text.includes('Disable');
  const wallKnock=t>40&&t<47.8;
  environment(panicked);
  let zoom=1,cx=270,cy=475;
  if(cue?.speaker==='D'&&/Nobody|terms|Exactly/.test(cue.text)){zoom=1.27;cx=363;cy=450}
  else if(cue?.speaker==='N'&&/WHO|Years|standing/.test(cue.text)){zoom=1.28;cx=173;cy=542}
  push();translate(W/2,H/2);scale(zoom);translate(-cx,-cy);
  door(t,cue,wallKnock);nix(t,cue,panicked);
  if(wallKnock&&Math.floor(t*5)%2===0){line([[45,415],[71,396],[59,443],[87,461]],5);line([[62,495],[87,475],[77,514]],4)}
  pop();
  if(t>=timeline.lines.at(-1).end){g.fillStyle='#16121e';g.fillRect(0,0,W,H);g.textAlign='center';g.font='bold 28px monospace';g.fillStyle=ivory;g.fillText('TENANT NOT FOUND',W/2,468)}
  overlay(t,cue);
};