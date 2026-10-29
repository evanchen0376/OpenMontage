// Adapted from Lemo-Opuscar STYLE.md and demo/film.js (MIT; see LICENSE.lemo).
// Film story, poster designs, captions, and timeline are deliberately absent.
export {E} from './ease.js';
export function grid(g,{x=0,y=0,w,h,columns=12,rows=8,color='#D4D3CD'}={}) {
  g.save();g.strokeStyle=color;g.lineWidth=1;g.beginPath();
  for(let i=0;i<=columns;i++){g.moveTo(x+i*w/columns,y);g.lineTo(x+i*w/columns,y+h);}
  for(let i=0;i<=rows;i++){g.moveTo(x,y+i*h/rows);g.lineTo(x+w,y+i*h/rows);}
  g.stroke();g.restore();
}
export function clipReveal(g,box,fraction,draw) {
  g.save();g.beginPath();g.rect(box.x,box.y,box.w,box.h*Math.max(0,Math.min(1,fraction)));g.clip();draw(g);g.restore();
}
export function cutLine(g,x,y,w,p,color='#111') {
  g.save();g.fillStyle=color;g.fillRect(x,y,w*Math.max(0,Math.min(1,p)),2);g.restore();
}
