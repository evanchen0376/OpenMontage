// Documentary drawing techniques adapted from the corresponding Lemo styles
// (MIT, LICENSE.lemo). Inputs are project-owned decoded frames/documents.
// No reference story, source footage, station identity, or voice is included.
const clamp=v=>Math.max(0,Math.min(1,v));
export function captionChunks(g,{chunks,index,x,y,width,fontSize=72,accent='#F2CF1D',ink='#111',paper='#FFF',entry=1}) {
  const chunk=chunks[index];if(!chunk)return;
  const scale=1+.16*(1-clamp(entry))**2;
  g.save();g.translate(x,y);g.scale(scale,scale);g.font=`900 ${fontSize}px sans-serif`;g.textBaseline='top';
  let cx=0,cy=0;
  for(const token of chunk){const w=g.measureText(token.text).width+24;if(cx+w>width&&cx){cx=0;cy+=fontSize*1.25;}
    g.fillStyle=token.key?accent:'rgba(0,0,0,.82)';g.fillRect(cx,cy,w,fontSize*1.2);g.fillStyle=token.key?ink:paper;g.fillText(token.text,cx+12,cy+4);cx+=w+8;
  }g.restore();
}
export function filmGate(g,frame,t,{width,height,damage=.5}={}) {
  const w=Math.min(width,height*1.37),x=(width-w)/2,step=Math.floor(t*24);
  const noise=n=>{const r=Math.sin(n*127.1+step*.13)*43758.5453;return r-Math.floor(r);};
  g.save();g.fillStyle='#080807';g.fillRect(0,0,width,height);g.beginPath();g.roundRect(x,0,w,height,18);g.clip();
  g.filter='grayscale(1) contrast(1.08) sepia(.08)';g.drawImage(frame,x+(noise(2)-.5)*damage*3,(noise(9)-.5)*damage*3,w,height);g.filter='none';
  g.globalAlpha=damage*(.01+.035*noise(3));g.fillStyle='#FFF7DF';g.fillRect(x,0,w,height);
  g.globalAlpha=damage*.3;g.strokeStyle='#D8D3BF';g.lineWidth=1;
  for(let i=0;i<3;i++){const sx=x+w*noise(i+19);g.beginPath();g.moveTo(sx,0);g.lineTo(sx+(noise(i+20)-.5)*10,height);g.stroke();}g.restore();
}
export function splitScreen(g,frames,{width,height,gap=8,columns=frames.length}={}) {
  if(!Number.isInteger(columns)||columns<1)throw new Error('Positive integer columns required');
  const rows=Math.ceil(frames.length/columns),w=(width-gap*(columns-1))/columns,h=(height-gap*(rows-1))/rows;
  frames.forEach((frame,i)=>{g.save();g.beginPath();g.rect((i%columns)*(w+gap),Math.floor(i/columns)*(h+gap),w,h);g.clip();g.drawImage(frame,(i%columns)*(w+gap),Math.floor(i/columns)*(h+gap),w,h);g.restore();});
}
export function countdown(g,eventSeconds,x,y,{size=92,color='#FFF'}={}) {
  if(!Number.isFinite(eventSeconds))throw new Error('Finite event time required');
  const sign=eventSeconds<0?'−':'+',n=Math.abs(Math.floor(eventSeconds));g.save();g.fillStyle=color;g.font=`700 ${size}px monospace`;g.fillText(`T ${sign} ${String(Math.floor(n/60)).padStart(2,'0')}:${String(n%60).padStart(2,'0')}`,x,y);g.restore();
}
export function montageWindow(g,frame,points,{grade=true}={}) {
  if(points.length<3)throw new Error('Polygon clip required');
  const xs=points.map(p=>p[0]),ys=points.map(p=>p[1]),x=Math.min(...xs),y=Math.min(...ys),w=Math.max(...xs)-x,h=Math.max(...ys)-y;
  g.save();g.beginPath();points.forEach((p,i)=>i?g.lineTo(...p):g.moveTo(...p));g.closePath();g.clip();if(grade)g.filter='grayscale(1) contrast(1.3)';g.drawImage(frame,x,y,w,h);g.restore();
}
export function cutAt(t,clips,{bpm=120,subdivision=1}={}) {
  if(!(bpm>0&&subdivision>0))throw new Error('Positive tempo and subdivision required');
  const tick=60/bpm/subdivision;
  let start=0;for(let i=0;i<clips.length;i++){const duration=clips[i].ticks*tick;if(!(duration>0))throw new Error('Positive clip duration required');if(t<start+duration)return {index:i,sourceSeconds:(t-start)*(clips[i].speed??1)+(clips[i].sourceIn??0),start};start+=duration;}
  return null;
}
export function telestrate(g,{points,kind='arrow',color='#F8EC54',width=8,progress=1}) {
  if(!points.length)return;g.save();g.strokeStyle=color;g.fillStyle=color;g.lineWidth=width;g.lineCap='round';g.lineJoin='round';
  if(kind==='ring'){const [x,y,r]=points[0];g.beginPath();g.ellipse(x,y,r,r*.3,0,0,Math.PI*2*clamp(progress));g.stroke();}
  else {const last=Math.max(1,Math.ceil((points.length-1)*clamp(progress)));g.beginPath();g.moveTo(...points[0]);for(let i=1;i<=Math.min(last,points.length-1);i++)g.lineTo(...points[i]);g.stroke();
    if(kind==='arrow'&&points.length>1&&progress>=.99){const a=points.at(-2),b=points.at(-1),ang=Math.atan2(b[1]-a[1],b[0]-a[0]);g.translate(...b);g.rotate(ang);g.beginPath();g.moveTo(0,0);g.lineTo(-width*3,-width*1.5);g.lineTo(-width*3,width*1.5);g.fill();}}
  g.restore();
}
export function rays(g,{width,height,phase=0,colors=['#FFD945','#FFB140'],count=20}) {
  g.save();g.translate(width/2,height/2);const r=Math.hypot(width,height);
  for(let i=0;i<count;i++){const a=phase+i*Math.PI*2/count;g.fillStyle=colors[i%colors.length];g.beginPath();g.moveTo(0,0);g.arc(0,0,r,a,a+Math.PI*2/count);g.fill();}g.restore();
}
export function appWindow(g,{x,y,w,h,title='界面示意',rows=[],active=0}) {
  g.save();g.fillStyle='#F8F9F6';g.shadowColor='rgba(0,0,0,.18)';g.shadowBlur=26;g.fillRect(x,y,w,h);g.shadowColor='transparent';g.fillStyle='#E6EAE4';g.fillRect(x,y,w,55);g.fillStyle='#293731';g.font='600 24px sans-serif';g.fillText(title,x+24,y+36);
  rows.forEach((r,i)=>{const yy=y+95+i*58;if(i===active){g.fillStyle='#DAE7C1';g.fillRect(x+16,yy-30,w-32,48);}g.fillStyle='#293731';g.font='24px sans-serif';g.fillText(r,x+30,yy);});g.restore();
}
export function pixelActor(g,{x,y,pixels,palette,scale=8}) {
  pixels.forEach((row,j)=>[...row].forEach((cell,i)=>{if(palette[cell]){g.fillStyle=palette[cell];g.fillRect(x+i*scale,y+j*scale,scale,scale);}}));
}
