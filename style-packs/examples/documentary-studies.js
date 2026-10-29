// Synthetic calibration targets, never substitutes for real documentary assets.
import {text,progress,line} from '../shared/drawing.js';
const cv=()=>{const c=document.createElement('canvas');c.width=1920;c.height=1080;return c;};
export const documentarySlugs=['caption-news','city-symphony','countdown','kino-montage','newsreel','telestrator','microscope'];
export async function documentaryStudy(slug,E,canvas) {
  const g=canvas.getContext('2d');
  const cards=Array.from({length:4},(_,i)=>{const c=cv(),a=c.getContext('2d');a.fillStyle=['#386261','#7C5F50','#53627B','#65704D'][i];a.fillRect(0,0,1920,1080);
    for(let j=0;j<7;j++){a.fillStyle=j%2?'#D4CDB6':'#A1AB9C';a.fillRect(140+j*235,720-(j%3)*120,170,200+(j%3)*120);}
    text(a,'TEST TARGET '+String(i+1).padStart(2,'0'),110,180,{size:100,color:'#F4EDDB',weight:900});text(a,'合成校准卡 · 非真实影像',110,280,{size:54,color:'#F4EDDB'});return c;});
  if(slug==='caption-news')return t=>{g.drawImage(cards[0],0,0);const chunks=[[{text:'事实',key:true},{text:'需要来源'}],[{text:'解释'},{text:'保留条件',key:true}],[{text:'数字',key:true},{text:'核对口径'}]];E.captionChunks(g,{chunks,index:Math.floor(t/2.7)%3,x:220,y:650,width:1480,fontSize:100,entry:progress(t%2.7,0,.25)});};
  if(slug==='city-symphony')return t=>{const i=Math.floor(t/1.8)%4;E.splitScreen(g,[cards[i],cards[(i+1)%4],cards[(i+2)%4]],{width:1920,height:1080,gap:14,columns:3});};
  if(slug==='countdown')return t=>{g.drawImage(cards[1],0,0);g.fillStyle='rgba(0,0,0,.8)';g.fillRect(230,370,1460,230);E.countdown(g,t-6,360,540,{size:150,color:'#F2D778'});line(g,[[280,680],[1640,680]],'#DDD8BD',3);g.fillStyle='#D94C35';g.fillRect(280,670,1360*progress(t,0,6),20);};
  if(slug==='kino-montage')return t=>{g.fillStyle='#C5B390';g.fillRect(0,0,1920,1080);const slide=progress(t,0,7)*200;E.montageWindow(g,cards[0],[[80+slide,120],[950,40],[800,990],[20,900]]);E.montageWindow(g,cards[2],[[1100,100],[1870,190],[1910,960],[970+slide,1040]]);g.fillStyle='#B83B2B';g.fillRect(890,0,75,1080);};
  if(slug==='newsreel')return t=>{const cut=E.cutAt(t,[{ticks:4},{ticks:3},{ticks:5},{ticks:4}],{bpm:120});E.filmGate(g,cards[cut?.index??3],t,{width:1920,height:1080,damage:.8});};
  if(slug==='telestrator')return t=>{g.drawImage(cards[3],0,0);E.telestrate(g,{points:[[760,750,250]],kind:'ring',color:'#F4D959',width:16,progress:progress(t,.2,2)});E.telestrate(g,{points:[[1250,330],[1030,440],[850,580]],color:'#F4D959',width:14,progress:progress(t,2.5,2)});};
  if(slug==='microscope'){
    const target=cv(),a=target.getContext('2d');a.fillStyle='#26363C';a.fillRect(0,0,1920,1080);for(let i=0;i<38;i++)for(let j=0;j<21;j++){a.fillStyle=(i+j)%2?'#A5B7AF':'#6B8987';a.fillRect(20+i*50,20+j*50,36,36);}text(a,'SYNTHETIC CALIBRATION GRID',120,220,{size:70,color:'#E8E9D7',weight:900});
    return t=>{const zoom=1+progress(t,0,6)*1.5;E.scanPlate(g,target,{x:0,y:0,width:1920,height:1080,roi:[.15,.1,1/zoom,.6/zoom]});E.roiBox(g,{x:400,y:350,width:800,height:500,label:'DEMO ROI / 非组织影像'});E.scaleBar(g,{x:1400,y:920,screenPixels:300,micronsPerPixel:1,sourceToScreen:zoom,color:'#F0E6B9'});};
  }
  throw new Error('Missing documentary study: '+slug);
}
