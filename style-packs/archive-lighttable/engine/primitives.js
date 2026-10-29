// Archive / loupe grammar adapted from Lemo-Opuscar (MIT), Canvas adapter.
// The full upstream WebGL compositor is retained in reference/source/film.js.
// This adapter implements flat-document magnification, not photograph depth.
import {text} from '../../shared/drawing.js';
export function lightTable(g,w,h) {
  const grad=g.createRadialGradient(w*.47,h*.4,10,w*.5,h*.5,w*.72);grad.addColorStop(0,'#FFFFFF');grad.addColorStop(1,'#DCE2E4');g.fillStyle=grad;g.fillRect(0,0,w,h);
}
export function archiveObject(g,image,{x,y,w,h,rotation=0,id='',date=''}) {
  if(!image)throw new Error('A decoded, licensed archive image is required');
  g.save();g.translate(x,y);g.rotate(rotation);g.shadowColor='rgba(24,40,48,.23)';g.shadowBlur=18;g.shadowOffsetY=7;
  // Keep source proportions; never cover-crop evidence.
  const iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height,k=Math.min(w/iw,h/ih),dw=iw*k,dh=ih*k;
  g.drawImage(image,-dw/2,-dh/2,dw,dh);g.shadowColor='transparent';text(g,id,-dw/2,dh/2+27,{size:17,font:'monospace',color:'#15171A',maxWidth:dw});text(g,date,-dw/2,dh/2+50,{size:15,color:'#52616B',maxWidth:dw});g.restore();
}
export function loupe(g,source,{x,y,r=120,magnification=1.7}) {
  if(!(r>0&&magnification>0))throw new Error('Positive lens size and magnification required');
  // Source is a separate complete table layer, never the destination canvas.
  g.save();g.shadowColor='rgba(15,30,40,.28)';g.shadowBlur=19;g.shadowOffsetY=12;g.beginPath();g.arc(x,y,r+9,0,Math.PI*2);g.fillStyle='#E1E9E9';g.fill();g.shadowColor='transparent';
  g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.clip();g.drawImage(source,x-r/magnification,y-r/magnification,2*r/magnification,2*r/magnification,x-r,y-r,2*r,2*r);
  const glint=g.createLinearGradient(x-r,y-r,x+r,y+r);glint.addColorStop(0,'rgba(255,255,255,.3)');glint.addColorStop(.6,'rgba(255,255,255,0)');g.fillStyle=glint;g.fillRect(x-r,y-r,r*2,r*2);g.restore();
  g.save();g.strokeStyle='#A7B8BA';g.lineWidth=3;g.beginPath();g.arc(x,y,r,0,Math.PI*2);g.stroke();g.restore();
}
