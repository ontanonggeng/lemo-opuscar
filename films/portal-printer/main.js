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
 cam(540,865,.88);
 warehouse(t);printer(540,900,.92,{screen:'ZONE ERROR',shake:2,t});
 portal(540,575,250,t,{open:1,kind:'frost'});parcel(540,1150,.8);sluglet(540,970,.8,t,{ice:1});
 marn({x:835,y:1460,s:.73,face:-1,t,lid:.55,look:[-.7,-.2],mouth:{o:0,w:.9,sm:-.2}});
 kip({x:210,y:1460,s:.70,face:1,t,panic:1,lid:.02,look:[.7,-.25],gesture:.85,mouth:{o:.75,w:1.2,sm:-.9}});
}
function signature(t){
 cam(540,900,.76);
 warehouse(t);printer(540,880,.95,{screen:'DELIVERED',paper:0,t});
 portal(540,660,300,t,{open:.92,kind:'office'});parcel(540,1070,.77,{damage:0});
 marn({x:855,y:1510,s:.78,face:-1,t,lid:.56,look:[-.6,-.1],hold:'label',mouth:{o:0,w:.9,sm:-.16}});
 kip({x:190,y:1510,s:.75,face:1,t,panic:.5,lid:.16,look:[.7,-.1],gesture:.3,mouth:{o:.15,w:1,sm:-.45}});
}
window.render=t=>{frame(t,{amp:1.7});S.lwScale=1; if(mode==='marn')modelMarn(t);else if(mode==='kip')modelKip(t);else if(mode==='signature')signature(t);else hook(t);};
window.READY=true;
