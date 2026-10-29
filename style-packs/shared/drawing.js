// OpenMontage drawing utilities. Geometry and text only; no stock scenes.
export const clamp = (v, a=0, b=1) => Math.max(a, Math.min(b, v));
export const ease = v => { v=clamp(v); return v*v*(3-2*v); };
export const progress = (t, start=0, duration=1) => ease((t-start)/duration);
export function line(g, points, color='#222', width=2, fraction=1) {
  if (!points.length || fraction<=0) return;
  g.save(); g.strokeStyle=color; g.lineWidth=width; g.lineCap='round';
  const lengths=points.slice(1).map((p,i)=>Math.hypot(p[0]-points[i][0],p[1]-points[i][1]));
  let left=lengths.reduce((a,b)=>a+b,0)*clamp(fraction);
  g.beginPath(); g.moveTo(...points[0]);
  for(let i=0;i<lengths.length;i++) { const k=Math.min(1,left/(lengths[i]||1)); g.lineTo(points[i][0]+(points[i+1][0]-points[i][0])*k, points[i][1]+(points[i+1][1]-points[i][1])*k); left-=lengths[i]; if(left<=0)break; }
  g.stroke();g.restore();
}
export function text(g, value, x, y, {size=32, color='#222', weight=500, font='sans-serif', maxWidth=Infinity, align='left'}={}) {
  value=String(value); g.save();g.textAlign=align;g.textBaseline='alphabetic';g.fillStyle=color;
  g.font=`${weight} ${size}px ${font}`;
  const measured=g.measureText(value).width;
  if(measured>maxWidth) { size*=maxWidth/measured;g.font=`${weight} ${size}px ${font}`; }
  g.fillText(value,x,y); const width=g.measureText(value).width;
  g.restore(); return {text:value,x0:align==='right'?x-width:align==='center'?x-width/2:x,y0:y-size,x1:align==='right'?x:align==='center'?x+width/2:x+width,y1:y+size*.2};
}
export function paper(g, width, height, {base='#F4ECDD', seed=17, strength=7}={}) {
  g.save();g.fillStyle=base;g.fillRect(0,0,width,height);
  let n=seed;const rand=()=>{n=(Math.imul(n,1664525)+1013904223)|0;return(n>>>0)/4294967296;};
  for(let i=0;i<5000;i++){g.fillStyle=`rgba(68,50,30,${rand()*strength/100})`;g.fillRect(rand()*width,rand()*height,1+rand()*2,.5+rand());}
  g.restore();
}
export async function loadImage(url) {
  const image=new Image();image.src=url;await image.decode();return image;
}
export function cover(g,image,x,y,w,h) {
  const iw=image.naturalWidth||image.width,ih=image.naturalHeight||image.height;
  if(!(iw>0&&ih>0)) throw new Error('Decoded image required');
  const k=Math.max(w/iw,h/ih);g.save();g.beginPath();g.rect(x,y,w,h);g.clip();g.drawImage(image,x+(w-iw*k)/2,y+(h-ih*k)/2,iw*k,ih*k);g.restore();
}
