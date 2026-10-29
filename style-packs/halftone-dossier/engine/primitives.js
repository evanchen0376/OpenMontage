// Adapted from Lemo-Opuscar inline halftone(), buildPaper(), stampEl() (MIT).
import {paper as drawPaper,text} from '../../shared/drawing.js';
export const paper=(g,w,h)=>drawPaper(g,w,h,{base:'#F4ECDD',seed:37,strength:12});
export function halftone(g,{x,y,w,h,color='#274947',step=19,angle=-Math.PI/6,density=(u,v)=>.15+.7*u}) {
  g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.translate(x+w/2,y+h/2);g.rotate(angle);g.fillStyle=color;g.globalCompositeOperation='multiply';g.beginPath();
  const r=Math.hypot(w,h)/2;
  for(let a=-r;a<=r;a+=step)for(let b=-r;b<=r;b+=step){const d=Math.max(0,Math.min(1,density((a+r)/(2*r),(b+r)/(2*r))));g.moveTo(a+d*step*.7,b);g.arc(a,b,d*step*.7,0,Math.PI*2);}
  g.fill();g.restore();
}
export function stamp(g,label,x,y,{w=230,h=76,rotation=-.12,color='#B44433'}={}) {
  g.save();g.translate(x,y);g.rotate(rotation);g.strokeStyle=color;g.lineWidth=4;g.strokeRect(-w/2,-h/2,w,h);g.lineWidth=1;g.strokeRect(-w/2+7,-h/2+7,w-14,h-14);
  text(g,label,0,12,{size:32,weight:900,color,maxWidth:w-30,align:'center'});
  g.globalCompositeOperation='destination-out';for(let i=0;i<65;i++){const a=Math.sin(i*173.1)*.5+.5,b=Math.sin(i*17.9)*.5+.5;g.fillRect(-w/2+a*w,-h/2+b*h,2,1);}g.restore();
}
export function registration(g,draw,{dx=4,dy=3,color='#DC754D'}={}){g.save();g.translate(dx,dy);draw(g,color);g.restore();draw(g,'#182E32');}
