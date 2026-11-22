// Look-dev renderer for BLACKSTAR Portal Printer. Film timeline is added after style approval.
import { clamp,lerp,seg,ss,back } from '/core/lib.js';
import { init,frame,g,push,pop,translate,scale,reset,S,text,shape,rr,rect,fillOnly } from '/styles/scifi-toon/demo/toon.js';
import { marn,kip } from './cast.js';
import { warehouse,printer,portal,sluglet,parcel,jellyStamp,WCOL } from './world.js';

const canvas=document.getElementById('c');canvas.width=innerWidth;canvas.height=innerHeight;init(canvas);
const mode=new URLSearchParams(location.search).get('mode')||'hook';
window.DUR=1;
function cam(cx,cy,z){reset();translate(innerWidth/2,innerHeight/2);scale(z);translate(-cx,-cy);}
function title(s,y=140){text(s,540,y,{font:'800 46px "Baloo 2"',fill:'#fff',align:'center'});}
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
function hook(t){
 cam(540,975,1.0);
 warehouse(t);
 printer(540,910,.98,{screen:'ZONE ERROR',shake:2.5,t});
 portal(540,575,235,t,{open:1,kind:'frost'});
 parcel(540,1170,.9);
 sluglet(540,985,.95,t,{ice:1});
 marn({x:825,y:1610,s:.91,face:-1,t,lid:.55,look:[-.8,-.25],brow:-.25,mouth:{o:0,w:.88,sm:-.22}});
 kip({x:230,y:1610,s:.87,face:1,t,panic:1.15,lid:0,look:[.85,-.3],gesture:1,mouth:{o:.9,w:1.28,sm:-1}});
}
function signature(t){
 cam(540,1010,.96);
 warehouse(t);
 printer(540,930,1.0,{screen:'DELIVERED',paper:0,t});
 portal(540,700,260,t,{open:.9,kind:'office'});
 // parcel already lifting into the aperture; characters frame the action rather than sitting below it
 parcel(540,1115,.88,{damage:0});
 marn({x:825,y:1630,s:.91,face:-1,t,lid:.52,look:[-.8,-.15],gesture:.42,mouth:{o:0,w:.9,sm:-.18}});
 kip({x:230,y:1630,s:.88,face:1,t,panic:.7,lid:.08,look:[.8,-.15],gesture:.62,mouth:{o:.25,w:1.05,sm:-.55}});
}
window.render=t=>{frame(t,{amp:1.7});S.lwScale=1; if(mode==='marn')modelMarn(t);else if(mode==='kip')modelKip(t);else if(mode==='signature')signature(t);else hook(t);};
window.READY=true;
