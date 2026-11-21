// BLACKSTAR — Dark Knock-Knock Jokes V2
// Original ink-and-paint sci-fi sitcom artwork. Uses Lemo-Opuscar's native
// boiling screen-space outlines and real ElevenLabs amplitude envelopes.
// All sets, characters, lettering and animation are code-rendered.
import {
  init, frame, shape, fillOnly, stroke, ell, rr, rect, spline,
  noodle, arc, dot, push, pop, translate, rotate, scale, S, g, text as worldText
} from '/styles/scifi-toon/demo/toon.js';

const canvas = document.getElementById('stage');
const PX = Math.max(1, window.innerWidth / 540);
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
canvas.style.width = '100vw';
canvas.style.height = '100vh';
init(canvas);
const loaded = await fetch('/films/dark-knock-knock/out/timeline.json');
if (!loaded.ok) throw new Error('Missing V2 performance timeline. Run assemble.py.');
const show = await loaded.json();
if (show.version !== 2 || show.lines.length !== 31) throw new Error('Unexpected V2 timeline.');
const BRAND = new Image();
const WM = new Image();
BRAND.src = '/brand/blackstar/v5/video/end-card-black-9x16.png';
WM.src = '/brand/blackstar/v5/video/corner-watermark-white-512.png';
await Promise.all([BRAND.decode(), WM.decode()]);

window.DUR = show.duration;
window.EV = [];
window.READY = true;
const C = {
  ink:'#17121f', night:'#171521', panel:'#2d293d', panel2:'#34314a',
  edge:'#4a445d', window:'#141827', display:'#1e2938',
  cream:'#eee8dc', bone:'#d8cbb7', brass:'#d8a765',
  jacket:'#d78e4c', jacketDark:'#985338', skin:'#c99c7b',
  skinShade:'#946650', violet:'#7d7093', violet2:'#50475f',
  teal:'#7aa2a4', lemon:'#d6ed71', chalk:'#fff9e9'
};
const T = Math.PI * 2;
const q = t => Math.floor(t*12+.00001)/12;
const clamp = (x,a=0,b=1) => Math.max(a,Math.min(b,x));
const ease = x => { const z=clamp(x); return z*z*(3-2*z); };
function poly(points,color,lw=6,o={}){ shape(points,{fill:color,lw,...o}); }
function curve(points,color,lw=6){shape(spline(points,true,8),{fill:color,lw});}
function round(x,y,w,h,r,color,lw=5){shape(rr(x,y,w,h,r),{fill:color,lw});}
function oval(x,y,rx,ry,color,lw=5){shape(ell(x,y,rx,ry,Math.max(22,Math.floor((rx+ry)/2))),{fill:color,lw});}
function path(points,lw=4,col=C.ink){stroke(points,lw,{line:col});}
function flat(x,y,w,h,c){fillOnly(rect(x,y,w,h),c,{boil:0});}
function typography(msg,x,y,size,color=C.cream,align='left',font='Arial'){
  g.save();g.setTransform(PX,0,0,PX,0,0);
  g.fillStyle=color;g.font='800 '+size+'px '+font;g.textAlign=align;
  g.textBaseline='middle';g.fillText(msg,x,y);g.restore();
}
function frameRect(x,y,w,h,c){g.save();g.setTransform(PX,0,0,PX,0,0);
  g.fillStyle=c;g.fillRect(x,y,w,h);g.restore();}
function actorMouth(e,t){
  if(!e) return .04;
  const n = Math.floor((t-e.start)*12);
  return clamp((e.mouth12fps||[])[n] || .03,.03,1);
}
function eye(cx,cy,rx,ry,opt={}){
  // Eye bag and eyelid are independent acting layers, not a cartoon sticker.
  oval(cx,cy+5,rx+3,ry+4,opt.bag||C.skinShade,0);
  oval(cx,cy,rx,ry,C.chalk,4.5);
  const blink=opt.blink;
  if(blink){
    poly([[cx-rx+2,cy-2],[cx+rx-2,cy-3],[cx+rx-2,cy+4],[cx-rx+2,cy+4]],C.skin,0);
    path([[cx-rx+2,cy],[cx+rx-2,cy]],4.5);
  }else{
    dot(cx+clamp(opt.look||0,-1,1)*rx*.38,cy+3,Math.max(4.3,rx*.20),C.ink);
    if(opt.lid){
      const h=ry*(clamp(opt.lid)*1.15);
      poly([[cx-rx,cy-ry-1],[cx+rx,cy-ry-1],[cx+rx,cy-ry-1+h],[cx-rx,cy-ry-1+h]],opt.lidCol||C.skin,0);
      path([[cx-rx+1,cy-ry+h],[cx,cy-ry+h-2],[cx+rx-1,cy-ry+h]],3.5);
    }
  }
}
function drawBackground(t,e){
  // Perspective-painted industrial hallway: deliberately flat hard shadows,
  // with consistent ink widths and only two localized light sources.
  flat(-800,-800,2200,3000,C.night);
  poly([[-70,46],[601,46],[610,130],[-75,130]],'#232231',3);
  for(let i=0;i<9;i++){
    const x=i*79-47;
    poly([[x,126],[x+76,126],[x+68,760],[x+10,760]],i%2?'#302e42':'#29283b',2);
    poly([[x+5,132],[x+13,132],[x+18,754],[x+15,754]],'#454056',1);
  }
  // Wall-depth recesses, metal connections and conduit rivets.
  for(let y=165;y<734;y+=143){
    poly([[6,y],[82,y],[85,y+10],[4,y+10]],'#494254',3);
    oval(20,y+5,3.2,3.2,'#c6b6a6',1);
    oval(71,y+5,3.2,3.2,'#c6b6a6',1);
  }
  for(let x=10;x<600;x+=126){
    poly([[x,94],[x+106,94],[x+100,113],[x+8,113]],'#484354',3);
  }
  // Original overhead practical light with enamel housing and patterned grille.
  oval(182,111,96,24,'#14141c',6);
  oval(182,112,81,13,'#d4aa6b',4);
  oval(182,114,69,6,'#f2d9ac',1);
  poly([[111,119],[250,119],[256,132],[102,132]],'#b1a292',2);
  // Beam light affects nearby surfaces using hard-edged patches, no gradient.
  poly([[144,131],[230,131],[261,350],[84,350]],'#3b3948',0);
  // Floor surface with receding vanishing point.
  poly([[-300,755],[900,755],[1200,1200],[-450,1200]],'#24212f',0);
  poly([[-80,759],[620,759],[620,782],[-80,782]],'#4a4252',4);
  for(let i=-2;i<8;i++){
    const x=i*105;
    path([[x,780],[x-140,1110]],2,'#403849');
  }
  for(let y=815;y<1180;y+=78)path([[-200,y],[790,y]],2,'#3d3749');
  // Hanging lead cable and segmented pipes for additional spatial detail.
  poly([[22,135],[38,135],[45,396],[31,405]],'#64586a',3);
  path([[31,404],[24,471],[39,534]],4,'#7c7184');
  for(let i=0;i<6;i++)round(18,405+i*49,22,8,3,'#686072',2);
  // The warning light turns on only for a story event.
  if(e && /evicted|previous tenant/i.test(e.text)){
    poly([[2,139],[70,139],[67,158],[3,158]],'#b65550',4);
    round(8,144,52,8,3,'#f6be9d',0);
  }
}
function drawDoor(t,e){
  // DORIS is an intentionally anthropomorphic house appliance;
  // heavy frame, engraved control lines, clean recession, robust silhouette.
  round(281,181,241,604,23,'#11121d',10);
  poly([[284,196],[306,185],[307,768],[283,779]],'#716a80',4);
  round(309,194,188,557,18,'#605970',7);
  round(326,205,159,537,13,'#827b91',6);
  poly([[329,214],[350,206],[351,735],[330,739]],'#a69eaa',2);
  poly([[469,216],[484,210],[484,733],[468,732]],'#494358',2);
  round(345,275,128,159,14,'#1b1b30',6);
  round(355,286,109,135,10,'#2c2b44',4);
  // Two cast shadow wedges make the face hardware read as manufactured.
  poly([[360,294],[378,293],[375,414],[361,409]],'#524b68',1);
  poly([[445,292],[459,294],[459,410],[444,416]],'#1d1b2e',0);
  // Face: grounded inside a recessed glass panel, variable expressions.
  const speaking=e?.speaker==='D';
  const amp=speaking?actorMouth(e,t):.06;
  const lid=(e && e.text.includes('Exactly')) ? .64 : .28;
  const look=e?.text.includes('Your')?-.24:.05;
  const blink=(Math.floor(q(t)*4)%43===0)&&!speaking;
  eye(391,350,22,25,{bag:'#51445a',lid,lidCol:'#877e96',look,blink});
  eye(435,349,22,25,{bag:'#51445a',lid,lidCol:'#877e96',look,blink});
  // Industrial artificial-expression mouth (6 hand-drawn visemes).
  const mouthH=4+amp*22;
  oval(413,392,22+amp*3,mouthH,'#201a2d',4);
  if(amp>.47){
    poly([[400,387],[426,387],[423,392],[401,392]],C.chalk,1);
  }else{
    path([[401,393],[411,395],[423,391]],3);
  }
  // Brow screws and speaker grilles add functionality to the face plate.
  for(let i=0;i<5;i++)round(359+i*22,292,8,4,1,'#a99faf',0);
  for(let i=0;i<10;i++)round(348+i*12,438,7,2,1,'#393144',0);
  // Hardware ID chip, not random futuristic HUD ornament.
  round(355,469,106,31,5,'#282638',4);
  typography('D-ORIS  /  A.I.',408,485,13,'#bab3c3','center','monospace');
  // Physical knock-knock button: eccentric skull with ceramic incisions.
  round(375,517,76,112,23,'#211c2a',7);
  oval(413,555,31,30,'#d2c5b5',5);
  oval(400,549,7,11,'#27212c',1);
  oval(427,548,7,11,'#27212c',1);
  poly([[412,559],[405,569],[419,569]],'#29212b',0);
  for(let i=0;i<4;i++)round(398+i*10,577,7,13,1,'#2a222d',1);
  const active=speaking || e?.text==='Knock knock.';
  oval(413,605,11,9,active?C.lemon:'#55576a',3);
  // Shaded handle with a functional hinge.
  round(345,654,40,89,14,'#201c2c',7);
  poly([[352,663],[370,663],[369,725],[352,725]],'#5d556b',2);
  oval(365,694,11,15,C.bone,3);
  // Hinge pins and metal reflections.
  for(let y of [214,725]){
    for(let x of [334,477]){
      oval(x,y,5,5,'#e1d7cb',2);dot(x-1,y-1,1.4,'#5c546d');
    }
  }
  if(e?.text.includes('Rent')||e?.text.includes('years')){
    // Printed mechanical fee digits replace stock "hologram" glow clutter.
    round(374,454,67,10,2,'#efbb66',1);
  }
}
function drawNix(t,e){
  // NIX: overworked adult in an absurdly oversized thermal courier coat.
  // Asymmetric hood, neck rig, long nose and articulated fingers distinguish
  // the silhouette from common TV sci-fi cartoon archetypes.
  const now=q(t);
  const speaking=e?.speaker==='N';
  const amp=speaking?actorMouth(e,t):.05;
  const panic=/WHO|Years of|standing|Disable|inside the wall|complaint/i.test(e?.text||'');
  const turn=e?.speaker==='D' && /Rent|evicted|terms|Nobody/i.test(e.text);
  const headMove=panic?Math.sin(now*39)*3:Math.sin(now*2.1)*1.5;
  const breathe=Math.sin(now*2.2)*2;
  push();translate(150,774+breathe);
  // Grounding cast shadow + footwear.
  oval(-5,9,83,13,'#11111d',0);
  poly([[-46,-74],[-19,-72],[-23,-7],[-56,-7]],'#52465c',6);
  poly([[21,-77],[50,-74],[56,-8],[25,-8]],'#52465c',6);
  round(-67,-19,67,23,9,'#1d1a2b',5);
  round(15,-19,69,23,9,'#1d1a2b',5);
  // Jacket backpack and thermal tubing.
  curve([[-51,-229],[-82,-239],[-84,-137],[-65,-106],[-45,-131]],'#554255');
  round(-79,-196,21,63,10,'#8e625d',4);
  // Torso's main silhouette with recognizable large padded sleeves.
  curve([[-53,-235],[-35,-267],[35,-268],[60,-233],[61,-89],[-60,-88]],C.jacket,7);
  poly([[-52,-220],[-34,-243],[-23,-118],[-52,-105]],'#bc723d',1);
  poly([[26,-251],[44,-240],[55,-100],[28,-103]],'#e8a969',2);
  // Front flap and stormproof fastening.
  path([[-3,-254],[-1,-90]],5,C.ink);
  for(let y=-219;y<=-126;y+=40){
    poly([[3,y-3],[14,y+1],[7,y+10],[-2,y+6]],'#4e3b3b',2);
  }
  // Upper jacket lapels, doubled hem stitch.
  poly([[-39,-256],[-2,-227],[-17,-198],[-48,-233]],'#e7ae71',4);
  poly([[41,-256],[2,-227],[20,-196],[47,-234]],'#b35e39',4);
  path([[-50,-105],[-11,-105],[31,-105],[56,-105]],2,C.bone);
  // Neck seal and hood scallops.
  round(-32,-286,66,46,12,'#4c4359',5);
  poly([[-26,-266],[27,-266],[21,-246],[-21,-246]],'#a77d70',2);
  // Left articulated elbow; anticipation then a pointed, accusing hand.
  const gesture=/lease|Years|approved|Disable|knocking/i.test(e?.text||'');
  const armY=gesture?-192:-139;
  shape(noodle([-47,-229],[-75,armY],gesture?-9:17,26,21),{fill:'#b46d43',lw:6});
  oval(-76,armY,14,15,C.skin,4);
  if(gesture){
    shape(noodle([-74,armY-5],[-39,-212],-14,13,8),{fill:C.skin,lw:3});
  }else{
    for(let i=0;i<3;i++)path([[-85+i*5,armY+5],[-83+i*5,armY+15]],1.5);
  }
  // Right elbow rotates towards the lease reader during shock lines.
  const rightY=turn?-178:panic?-204:-146;
  shape(noodle([51,-220],[76,rightY],-23,31,22),{fill:C.jacket,lw:6});
  oval(78,rightY,15,15,C.skin,4);
  if(turn||panic){
    for(let i=0;i<3;i++)path([[81+i*3,rightY-7],[91+i*4,rightY-15]],2);
  }
  // Three-layer helmet shape and cheek protection.
  push();translate(headMove,0);
  curve([[-55,-292],[-74,-342],[-62,-395],[-10,-423],[35,-411],[65,-380],[70,-324],[52,-279]],'#52374b',7);
  poly([[-72,-362],[-61,-403],[-40,-416],[-31,-384]],'#9f5653',3);
  poly([[37,-404],[63,-374],[66,-349],[50,-357]],'#c77453',3);
  curve([[-54,-366],[-32,-399],[19,-399],[53,-375],[60,-322],[38,-283],[-20,-282],[-58,-312]],C.skin,6);
  poly([[-43,-307],[-10,-296],[32,-302],[47,-320],[45,-302],[26,-283],[-22,-285]],'#b98669',0);
  // Ears, nose, subtle eye bags and tiny lopsided scar.
  oval(-56,-336,11,16,C.skinShade,3);oval(56,-333,11,16,C.skinShade,3);
  poly([[1,-334],[9,-312],[-3,-308]],'#b98265',3);
  const look=turn ? .70 : (panic ? -.25 : .28);
  const blink=(Math.floor(t*2.3)%19===0)&&!panic;
  eye(-25,-348,24,26,{bag:'#aa7d68',look,lid:panic ? .01 : .11,lidCol:C.skin,blink});
  eye(25,-350,25,27,{bag:'#aa7d68',look,lid:panic ? .04 : .16,lidCol:C.skin,blink});
  path([[-51,-389],[-31,-393],[-10,-384]],panic?6:4.5);
  path([[5,-387],[27,-391],[49,-385]],panic?6:4.5);
  const mouthH=panic?8+amp*28:4+amp*23;
  oval(0,-308,21+amp*8,mouthH,'#3d2530',4);
  if(speaking && amp>.45){
    poly([[-14,-312],[15,-312],[14,-307],[-13,-307]],C.chalk,1);
    if(amp>.7)oval(0,-298,10,4,'#b75467',0);
  }
  if(panic){
    poly([[67,-382],[75,-396],[80,-376],[71,-366]],'#83bfc2',1);
    dot(74,-372,2,'#f2ded7');
  }
  path([[-49,-325],[-43,-317],[-36,-322]],2,C.skinShade);
  pop();
  pop();
}
function leaseCard(t,e){
  if(!e||!/lease|Rent|Years of|approved|terms you skipped/i.test(e.text))return;
  // Retro paper receipt device, not generic glowing interface.
  push();translate(215,574);
  rotate(-.08 + Math.sin(q(t)*6)*.012);
  round(0,0,130,131,9,'#1a222e',6);
  poly([[8,9],[121,9],[121,111],[9,111]],'#dad0b9',3);
  for(let i=0;i<3;i++)poly([[15,22+i*18],[116,22+i*18],[116,24+i*18],[15,24+i*18]],'#b4a994',0);
  worldText('AUTO-RENT',63,17,{font:'bold 11px monospace',fill:'#3c3541'});
  worldText('PAYMENT:',63,73,{font:'bold 14px monospace',fill:'#2c2630'});
  worldText(e.text.includes('Years')?'5 YEARS':'LIFETIME',64,97,{font:'bold 18px monospace',fill:'#a64e46'});
  // Tiny folded printer tape edge.
  poly([[4,124],[12,132],[22,124],[32,132],[42,124],[52,132],[62,124],[72,132],[82,124],[92,132],[102,124],[112,132],[123,125]],'#e2d9c7',2);
  pop();
}
function wallEvent(t,e){
  if(!e||!/inside the wall|previous tenant|Nobody lives here/i.test(e.text)) return;
  // A single original sight-gag: another tenant's fingers are lodged in the wall.
  // They animate in, creating tangible cause for the internal knocking.
  const wave=e.text.includes('previous')?1:.5;
  push();translate(284,654);rotate(.08*Math.sin(q(t)*5));
  poly([[-11,-15],[-18,-6],[-9,31],[18,28],[27,-7]],'#1d1a27',6);
  for(let j=0;j<3;j++){
    shape(noodle([j*10-5,13],[j*11-14,-30-5*wave*Math.sin(q(t)*9+j)],j*3,10,7),{fill:'#b2a49c',lw:4});
  }
  pop();
}
function topStrip(t,e){
  frameRect(0,0,540,85,'#171620');
  // In-world retro meter serial, rather than floating HUD everywhere.
  typography('CORRIDOR 13   /   SECURITY DOOR',25,40,16,'#ded5c6','left','monospace');
  frameRect(24,63,94,3,'#bd8565');
  frameRect(118,63,25,3,C.teal);
}
function captions(e,t){
  if(!e)return;
  const name=e.speaker==='D'?'DORIS':'NIX';
  const width=468, words=e.text.split(/\s+/);
  let lines=[],curr='';
  const fontSize=25;
  g.save();g.setTransform(PX,0,0,PX,0,0);g.font='800 '+fontSize+'px Arial';
  for(const w of words){
    const trial=curr?curr+' '+w:w;
    if(g.measureText(trial).width>width&&curr){lines.push(curr);curr=w;}else curr=trial;
  }
  if(curr)lines.push(curr);
  g.restore();
  const y=849-(lines.length-1)*16, height=lines.length*31+49;
  // Quiet theatrical caption band—no entire bottom third swallowed by a box.
  round(16,y-37,508,height,12,'#17131fe9',3);
  round(28,y-27,name==='NIX'?82:101,27,6,name==='NIX'?C.jacket:C.violet,1);
  typography(name,name==='NIX'?69:78,y-14,14,C.chalk,'center','Arial');
  for(let i=0;i<lines.length;i++){
    const cy=y+18+i*31;
    g.save();g.setTransform(PX,0,0,PX,0,0);g.textAlign='center';g.textBaseline='middle';
    g.font='800 '+fontSize+'px Arial';g.lineJoin='round';
    g.strokeStyle='#100d18';g.lineWidth=4.8;g.strokeText(lines[i],270,cy);
    g.fillStyle=C.chalk;g.fillText(lines[i],270,cy);g.restore();
  }
}
function watermark(){
  g.save();g.setTransform(PX,0,0,PX,0,0);
  g.globalAlpha=.72;
  // The original v5 transparent artwork has significant safe internal padding.
  // Draw 90x90; visible mark is about 58x58 and clear of captions/face.
  g.drawImage(WM,435,87,94,94);
  g.restore();
}
function camera(e){
  if(!e)return {z:1,x:270,y:476};
  if([4,10,18,26].includes(e.id))return {z:2.05,x:410,y:561};
  if([14,15,16,17].includes(e.id))return {z:1.18,x:316,y:558};
  if([23,24,25].includes(e.id))return {z:1.48,x:296,y:551};
  if([6,8,12,19,21,27,29,31].includes(e.id))return {z:1.79,x:405,y:362};
  if([7,9,13,20,22,28,30].includes(e.id))return {z:1.74,x:146,y:445};
  return {z:1,x:270,y:475};
}
function renderScene(t){
  frame(t,{amp:1.2}); // 3 alternating boil drawings, stepped at 12 fps
  S.lwScale=PX;
  scale(PX);
  // End card must remain entirely original, no watermark or extra wordmark.
  if(t>=show.brandStart){
    g.save();g.setTransform(PX,0,0,PX,0,0);
    g.drawImage(BRAND,0,0,540,960);g.restore();
    return;
  }
  const e=show.lines.find(c=>t>=c.start&&t<c.end)||null;
  const k=camera(e);
  // A hard camera cut; no crossfade or AI-generated interpolation artifacts.
  push();translate(270,480);scale(k.z);translate(-k.x,-k.y);
  drawBackground(t,e);
  drawDoor(t,e);
  wallEvent(t,e);
  drawNix(t,e);
  if([14,15,16,17].includes(e?.id))leaseCard(t,e);
  pop();
  topStrip(t,e);
  captions(e,t);
  watermark();
  if(!e&&t<.8)typography('DARK KNOCK-KNOCK',270,220,35,C.chalk,'center','Arial');
}
window.render = renderScene;
