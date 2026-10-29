// Integration fixture controller. Native artwork keeps its aspect ratio;
// labels and proof notes have separately authored landscape/portrait layouts.
import {text,line} from '../shared/drawing.js';
import {paintingSlugs,paintingStudy} from './painting-studies.js';
import {graphicSlugs,graphicStudy} from './graphic-studies.js';
import {threeSlugs,threeStudy} from './three-studies.js';
import {documentarySlugs,documentaryStudy} from './documentary-studies.js';
const cv=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
export async function extendedSpecimen(canvas,id) {
  const catalog=await fetch(new URL('../catalog.json',import.meta.url)).then(r=>r.json());
  const pack=catalog.packs.find(p=>p.id===id);if(!pack)throw new Error('Unknown style '+id);
  const E=await import(new URL(`../${pack.slug}/${pack.native_entry}`,import.meta.url));
  const art=cv(1920,1080),portrait=canvas.height>canvas.width,W=portrait?1080:1920,H=portrait?1920:1080,frame=cv(W,H),g=frame.getContext('2d'),out=canvas.getContext('2d');
  const factory=paintingSlugs.includes(pack.slug)?paintingStudy:graphicSlugs.includes(pack.slug)?graphicStudy:threeSlugs.includes(pack.slug)?threeStudy:documentarySlugs.includes(pack.slug)?documentaryStudy:null;
  if(!factory)throw new Error('No engineering study for '+id);
  const draw=await factory(pack.slug,E,art),texts=[];
  const add=(s,x,y,o)=>texts.push(text(g,s,x,y,o));
  return {texts,render(t){
    if(!Number.isFinite(t))throw new Error('Finite time required');
    const a=art.getContext('2d');a.resetTransform();a.globalAlpha=1;a.globalCompositeOperation='source-over';a.clearRect(0,0,1920,1080);draw(Math.max(0,Math.min(8,t)));
    g.fillStyle='#191E22';g.fillRect(0,0,W,H);texts.length=0;
    const pad=portrait?96:100;
    add(pack.name,pad,portrait?180:108,{size:portrait?65:58,weight:800,color:'#EDE8DA',maxWidth:W-pad*2});
    add(pack.slug.toUpperCase()+' / MATERIAL STUDY',pad,portrait?243:153,{size:portrait?22:20,font:'monospace',color:'#A9BFB9',maxWidth:W-pad*2});
    const box=portrait?{x:48,y:380,w:984,h:553.5}:{x:100,y:200,w:1720,h:720};
    const k=Math.min(box.w/1920,box.h/1080),w=1920*k,h=1080*k;
    g.drawImage(art,box.x+(box.w-w)/2,box.y+(box.h-h)/2,w,h);
    if(portrait){add('材质、图形与运动接口验证',pad,1070,{size:35,color:'#EDE8DA',maxWidth:W-pad*2});add('正式作品需要重新编排竖屏镜头',pad,1130,{size:31,color:'#ACB7AE',maxWidth:W-pad*2});}
    const y=portrait?1260:990;line(g,[[pad,y-34],[W-pad,y-34]],'#64716D',1);
    add('合成技术夹具 · 非真实财经事实或纪录素材',pad,y,{size:portrait?27:26,color:'#EDE8DA',maxWidth:W-pad*2});
    add('OPENMONTAGE / INDEPENDENT ENGINE STUDY',pad,y+42,{size:portrait?19:20,font:'monospace',color:'#ACB7AE',maxWidth:W-pad*2});
    out.drawImage(frame,0,0,canvas.width,canvas.height);
  }};
}
