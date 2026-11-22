import fs from 'fs';
const D=new URL('.',import.meta.url).pathname;
const lines=JSON.parse(fs.readFileSync(D+'lines.json','utf8'));
const dur=JSON.parse(fs.readFileSync(D+'voices/dur.json','utf8'));
const ts=s=>{let ms=Math.round(s*1000);return String(Math.floor(ms/3600000)).padStart(2,'0')+':'+String(Math.floor(ms/60000)%60).padStart(2,'0')+':'+String(Math.floor(ms/1000)%60).padStart(2,'0')+','+String(ms%1000).padStart(3,'0')};
let out=[];lines.forEach((l,i)=>{const end=Math.min(44,l.at+dur[l.id]+.25);out.push(String(i+1),ts(l.at)+' --> '+ts(end),l.text,'')});
fs.mkdirSync(D+'out',{recursive:true});fs.writeFileSync(D+'out/subtitles_en.srt',out.join('\n'));
console.log('srt',lines.length);
