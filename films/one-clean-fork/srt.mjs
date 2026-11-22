import fs from 'fs';import path from 'path';import {fileURLToPath} from 'url';import {openDemo,closeServer} from '../../core/render/page.mjs';
const dir=path.dirname(fileURLToPath(import.meta.url));const {browser,page}=await openDemo(dir,{w:1080,h:1920});
const subs=await page.evaluate(()=>window.SUBS);const ts=t=>{const ms=Math.round(t*1000),h=Math.floor(ms/3600000),m=Math.floor(ms/60000)%60,s=Math.floor(ms/1000)%60;return String(h).padStart(2,'0')+':'+String(m).padStart(2,'0')+':'+String(s).padStart(2,'0')+','+String(ms%1000).padStart(3,'0')};
fs.mkdirSync(path.join(dir,'out'),{recursive:true});
fs.writeFileSync(path.join(dir,'out','one-clean-fork.srt'),subs.map((x,i)=>String(i+1)+'\n'+ts(x.t0)+' --> '+ts(x.t1)+'\n'+x.who+': '+x.text+'\n').join('\n'));
console.log('srt cues',subs.length);await browser.close();closeServer();
