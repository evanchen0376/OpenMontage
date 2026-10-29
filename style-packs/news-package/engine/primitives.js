// Adapted from Lemo-Opuscar demo/main.js (MIT). Generic package grammar only.
import {text,clamp} from '../../shared/drawing.js';
export const palette={ink:'#121417',panel:'#22262C',accent:'#F2CF1D',gold:'#D4B064',paper:'#F4F1E8'};
export function strap(g,{x,y,w,height=112,category,headline,detail='',brand='',accent=palette.accent}) {
  g.save();g.fillStyle=accent;g.fillRect(x,y-46,230,46);text(g,category,x+18,y-13,{size:24,weight:800,color:palette.ink,maxWidth:194});
  g.fillStyle=palette.paper;g.fillRect(x,y,w,height);g.fillStyle=accent;g.fillRect(x,y,9,height);
  text(g,headline,x+28,y+height*.47,{size:38,weight:800,maxWidth:w-180});
  text(g,detail,x+28,y+height*.81,{size:18,color:'#6E5A1E',maxWidth:w-180});
  if(brand){g.fillStyle=palette.ink;g.fillRect(x+w-138,y,138,height);text(g,brand,x+w-69,y+height*.59,{size:22,weight:800,color:accent,align:'center',maxWidth:115});}g.restore();
}
export function splitFlap(g,{x,y,w=150,h=180,oldValue,newValue,progress=1}) {
  const k=clamp(progress),mid=y+h/2;g.save();g.fillStyle=palette.panel;g.fillRect(x,y,w,h);
  text(g,k<.5?oldValue:newValue,x+w/2,y+h*.73,{size:h*.7,color:palette.paper,weight:800,align:'center',maxWidth:w-20});
  g.fillStyle=palette.ink;g.fillRect(x,mid-2,w,4);
  if(k>0&&k<1){g.fillStyle='rgba(0,0,0,.35)';g.fillRect(x,mid,w,h*.5*Math.sin(k*Math.PI));}g.restore();
}
export function bandWipe(g,{x,w,h,color=palette.accent}){g.save();g.fillStyle=color;g.fillRect(x,0,w,h);g.fillStyle=palette.ink;g.fillRect(x+w,0,5,h);g.fillStyle=palette.gold;g.fillRect(x+w+5,0,14,h);g.restore();}
export function sourceLine(g,label,x,y,w){return text(g,label,x,y,{size:17,color:palette.gold,maxWidth:w});}
