// Strict decoded RGBA hashes: same page, reordered frames, then a fresh browser.
import { openDemo, closeServer } from '../../core/render/page.mjs';
import fs from 'node:fs';
const [dir,w,h,out]=process.argv.slice(2);
const size={w:Number(w),h:Number(h)};
const times=[0,2.5,4,5.5];
const report={method:'canvas RGBA SHA-256',samePage:{},freshBrowser:{},jpegDiagnostic:'separate'};
async function sample(page,t){
  return await page.evaluate(async t=>{
    window.render(t);
    const c=document.getElementById('stage');
    const pixels=c.getContext('2d').getImageData(0,0,c.width,c.height).data;
    const sum=await crypto.subtle.digest('SHA-256',pixels);
    return Array.from(new Uint8Array(sum),v=>v.toString(16).padStart(2,'0')).join('');
  },t);
}
const reference={};
let session;
function save(){fs.writeFileSync(out,JSON.stringify(report,null,2)+'\n');}
try {
  session=await openDemo(dir,size);
  report.contextPolicy=await session.page.evaluate(()=>window.CANVAS_POLICY);
  for(const t of times) reference[t]=await sample(session.page,t);
  report.reference=reference;
  for(const t of [...times].reverse()){
    const hash=await sample(session.page,t);
    report.samePage[t]={hash,match:hash===reference[t]};
  }
  await session.browser.close();session=null;
  session=await openDemo(dir,size);
  report.freshContextPolicy=await session.page.evaluate(()=>window.CANVAS_POLICY);
  for(const t of [...times].reverse()){
    const hash=await sample(session.page,t);
    report.freshBrowser[t]={hash,match:hash===reference[t]};
  }
  report.passed=[...Object.values(report.samePage),...Object.values(report.freshBrowser)].every(x=>x.match);
  console.log('DETERMINISM',JSON.stringify(report));
  if(!report.passed)process.exitCode=1;
} catch(e){report.error=String(e);process.exitCode=1;}
finally{save();if(session)await session.browser.close();closeServer();}
