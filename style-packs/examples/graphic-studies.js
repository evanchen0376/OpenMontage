import {paper,text,progress,line} from '../shared/drawing.js';
const cv=()=>{const c=document.createElement('canvas');c.width=1920;c.height=1080;return c;};
export const graphicSlugs=['art-deco','ascii-crt','cel-anime-80s','dark-keynote','game-show','hologram-hud','living-screencast','microgame','midcentury-toon','pictogram-motion','pixel-rpg','rubber-hose','scifi-toon','silent-film','spy-titles'];
export async function graphicStudy(slug,E,canvas) {
  const g=canvas.getContext('2d');
  if(slug==='art-deco'){
    const T=await import('../art-deco/engine/engine/type.js');
    return t=>{g.fillStyle='#101C19';g.fillRect(0,0,1920,1080);E.sunburst(g,960,550,{rays:56,r0:270,r1:1100,sheen:progress(t,0,7),part:progress(t,0,3),w:2});E.gline(g,E.stepArchPts(960,900,780,700),{closed:true,w:5,part:progress(t,.2,3),sheen:progress(t,0,7)});T.goldText(g,'1929',960,585,{size:170,sheen:progress(t,0,7),font:'serif'});};
  }
  if(slug==='ascii-crt'){
    await E.initTerm();const {makeCRT}=await import('../ascii-crt/engine/crt.js'),gl=cv(),crt=makeCRT(gl),raw=cv(),a=raw.getContext('2d');
    return t=>{a.fillStyle='#000';a.fillRect(0,0,1920,1080);const view={ox:130,oy:140,cw:27};['> SYSTEM / INDEX','DATA  100  104  108','COST  +01  +02  +03','> VERIFY SOURCE'].forEach((s,i)=>E.text(a,s.slice(0,Math.floor((t-i*.45)*15)),0,i*3,view));E.cursor(a,Math.floor(t*2)%2?0:1,13,view);crt.render(raw,Math.floor(t*24));g.drawImage(gl,0,0);};
  }
  if(slug==='cel-anime-80s'){
    return t=>{g.fillStyle='#26314B';g.fillRect(0,0,1920,1080);for(let i=0;i<8;i++){const x=i*260-progress(t,0,7)*130;E.cel(g,[[x,850],[x,300+(i%3)*110],[x+210,300+(i%3)*110],[x+210,850]],{f:'#596173',s:'#333D59',so:[-45,0],l:'#151C34',lw:4});}const bob=Math.sin(Math.floor(t*12)/12*3)*12;E.cel(g,[[760,820],[800,510+bob],[950,430+bob],[1110,515+bob],[1160,820]],{f:'#C89C79',s:'#805E61',so:[-95,20],h:'#E6C5A2',ho:[25,-25],l:'#202133',lw:5});};
  }
  if(slug==='dark-keynote'){
    return t=>{E.bg(g);E.grid(g);const k=progress(t,.3,2);for(let i=0;i<3;i++)E.panel(g,250+i*510,280+(1-k)*80,420,470,{radius:18});text(g,'1.00',960,610,{size:190,color:E.PAL.accent,weight:800,align:'center'});E.glow(g,960,520,700,E.PAL.accent,.08+progress(t,0,7)*.08);};
  }
  if(slug==='game-show'){
    return t=>{E.rays(g,{width:1920,height:1080,phase:t*.04});const y=530-Math.abs(Math.sin(t*3))*65;g.fillStyle='#F8F3DA';g.strokeStyle='#2A2850';g.lineWidth=14;g.beginPath();g.roundRect(340,y-150,1240,360,55);g.fill();g.stroke();text(g,t<3?'辨认风险':'核对条件',960,y+55,{size:145,color:'#2A2850',weight:900,align:'center'});text(g,'READY  /  CHECK',960,945,{size:60,color:'#2A2850',align:'center',weight:800});};
  }
  if(slug==='hologram-hud'){
    const hud=await import('../hologram-hud/engine/engine/hud.js'),theme=hud.theme(),holo=new E.Holo(),model=E.normalizeModel(E.modelFromPath([[-.8,0],[.8,0],[.8,1.7],[.3,2.2],[-.8,1.7]],{depth:.7,slices:6}));
    return t=>{hud.background(g,1920,1080,theme);const cam={target:[0,1,0],yaw:.35+progress(t,0,7)*.4,pitch:.25,dist:5,fov:.6};holo.draw(g,model,cam,{scan:{y:progress(t,.2,4)*3,band:.1},hue:190,spin:t*.03});holo.composite(g,1);hud.chrome(g,1920,1080,theme);};
  }
  if(slug==='living-screencast'){
    return t=>{g.fillStyle='#E9ECE5';g.fillRect(0,0,1920,1080);E.appWindow(g,{x:190,y:130,w:1540,h:800,title:'预算工具 · 界面测试',rows:['账户概览','本月支出','费用分类','导出记录'],active:Math.min(3,Math.floor(t/2))});E.pixelActor(g,{x:1400,y:520-Math.abs(Math.sin(t*4))*15,scale:16,palette:{'#':'#345C5B','o':'#D7DFCF'},pixels:['..####..','.######.','##o##o##','########','..####..','.##..##.']});};
  }
  if(slug==='microgame'){
    E.setCtx(g);
    return t=>{g.fillStyle=['#F0D94D','#CEDDD4','#E9A291'][Math.min(2,Math.floor(t/3))];g.fillRect(0,0,1920,1080);const k=progress(t%3,.1,.5);E.rrect(500,260,920,550,80,{fill:'#F8F2DF',stroke:'#272D43',lw:14});text(g,['核对单位','识别假设','检查来源'][Math.min(2,Math.floor(t/3))],960,560,{size:110,weight:900,align:'center',color:'#272D43'});g.fillStyle='#272D43';g.fillRect(500,865,920*(1-t%3/3),18);};
  }
  if(slug==='midcentury-toon'){
    return t=>{g.fillStyle='#EDE5CF';g.fillRect(0,0,1920,1080);E.plane(g,E.kidney(970,540,650,t*.025),'#618F8D');E.star(g,1430,330,150,{fill:'#DFA44D',line:0});E.atom(g,540,530,180,{color:'#2F4650'});E.paperFinish(g,1920,1080,.7);};
  }
  if(slug==='pictogram-motion'){
    const G=E.default,pattern=G.pattern(Object.keys(G.PAL)[0],7,{cell:150});
    return t=>{g.drawImage(pattern,-progress(t,0,7)*220,0);g.fillStyle=G.CREAM;g.fillRect(350,300,1220,480);G.maskText(g,'FLOW',960,630,'900 190px sans-serif',G.INK,progress(t,.2,2.5),{align:'center'});};
  }
  if(slug==='pixel-rpg'){
    const F=await import('../pixel-rpg/engine/font.js'),UI=await import('../pixel-rpg/engine/ui.js'),fb=new E.FB(),out=E.makeOut(canvas);
    return t=>{fb.clear(1);for(let i=0;i<16;i++)fb.rect(i*20,130-Math.sin(i)*9,18,50,4+i%3);UI.win(fb,30,24,260,95);F.text(fb,'BUDGET / DEMO',50,42,19,null,2);F.text(fb,'VERIFY THE COST',50,82,20,null,1);UI.hand(fb,220,85,t);out.present(fb,E.LUT.full||Object.values(E.LUT)[0]);out.show();};
  }
  if(slug==='rubber-hose'||slug==='scifi-toon'){
    E.init(canvas);
    return t=>{g.fillStyle=slug==='rubber-hose'?'#D8D4CA':'#C6D6CF';g.fillRect(0,0,1920,1080);E.frame(t);const bob=Math.sin(t*3)*28;E.shape(E.ell(960,600+bob,225,245),{fill:slug==='rubber-hose'?'#242322':'#D4A25D',lw:8});E.shape(E.ell(885,550+bob,48,66),{fill:'#F2E9CF',lw:5});E.shape(E.ell(1035,550+bob,48,66),{fill:'#F2E9CF',lw:5});E.dot(894,555+bob,15);E.dot(1044,555+bob,15);E.stroke([[850,760+bob],[760,850],[690,810]],14);E.stroke([[1070,760+bob],[1160,850],[1220,810]],14);};
  }
  if(slug==='silent-film'){
    const {damage}=await import('../silent-film/engine/engine/film.js');
    return t=>{g.fillStyle='#C8C4BA';g.fillRect(0,0,1920,1080);E.setFrame(t);for(let i=0;i<4;i++)E.drawShape(g,[[340+i*330,820],[340+i*330,400-i*55],[560+i*330,400-i*55],[560+i*330,820]],{value:.35,line:3,seed:i+3});damage(g,0,0,1920,1080,Math.floor(t*24),.5);};
  }
  if(slug==='spy-titles'){
    E.setG(g);
    return t=>{E.clear('#D9C8A4');const p=progress(t,.2,4);for(let i=0;i<5;i++){const x=200+i*330;E.piece([[x,100],[x+160,100],[x+370*p,1000],[x+210*p,1000]],['#1D2928','#A3352B','#B89C59'][i%3],{seed:i+2});}E.paperFinish(.6);};
  }
  throw new Error('Missing graphic study: '+slug);
}
