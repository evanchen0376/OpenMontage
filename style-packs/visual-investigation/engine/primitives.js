// Adapted from Lemo-Opuscar inline plate(), hair(), clock(), ring() (MIT).
// Callers must supply real evidence; this module never fabricates documents.
import {text,cover} from '../../shared/drawing.js';
export const palette={bg:'#0B0C0E',panel:'#141619',line:'#2E3238',ink:'#ECEAE4',dim:'#8B9097',accent:'#FF4A2E'};
export function evidenceFrame(g,image,box,{label,source,transcription=false}={}) {
  const {x,y,w,h}=box;g.save();g.fillStyle=palette.panel;g.fillRect(x,y,w,h);
  if(image){g.filter='grayscale(1) contrast(1.15)';cover(g,image,x+1,y+1,w-2,h-60);g.filter='none';}
  g.strokeStyle=palette.line;g.strokeRect(x,y,w,h);
  text(g,label||'',x+18,y+h-33,{size:24,color:palette.ink,maxWidth:w-36});
  text(g,(transcription?'转录 · ':'')+(source||''),x+18,y+h-10,{size:14,color:palette.dim,maxWidth:w-36});g.restore();
}
export function highlight(g,{x,y,w,h,progress=1}) {g.save();g.fillStyle=palette.accent;g.globalAlpha=.28;g.fillRect(x,y,w*Math.max(0,Math.min(1,progress)),h);g.restore();}
export function clock(g,value,x,y){return text(g,value,x,y,{size:42,color:palette.ink,font:'monospace',weight:500});}
export function uncertainty(g,label,x,y,w=250){g.save();g.strokeStyle=palette.dim;g.setLineDash([7,6]);g.strokeRect(x,y,w,48);text(g,label,x+14,y+32,{size:22,color:palette.dim,maxWidth:w-28});g.restore();}
