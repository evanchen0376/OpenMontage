// Engineering specimens, NOT a reusable film/scene catalog.
// Every figure is synthetic, visibly labelled. No TTS, BGM or remote assets.
import {text,line,paper,progress,clamp} from '../shared/drawing.js';

const canvas2=(w,h)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const names={'dataviz':'数据叙事','swiss-motion':'瑞士动态排版','iso-infographic':'等距信息图','news-package':'电视新闻包装','blueprint':'蓝图／工程制图','whiteboard':'白板讲解','halftone-dossier':'复古半调案卷','visual-investigation':'视觉调查','data-physical':'数据实物化','briefing-board':'工程简报板','archive-lighttable':'档案灯台','satellite-briefing':'卫星简报'};

export async function createSpecimen(canvas,id,{variant='a'}={}) {
  const slug=id.replace(/^lemo-/,''), portrait=canvas.height>canvas.width;
  if(!names[slug])throw new Error('Unknown specimen '+id);
  const W=portrait?1080:1920,H=portrait?1920:1080;
  const cv=canvas2(W,H),g=cv.getContext('2d');
  const out=canvas.getContext('2d'), ink=['news-package','visual-investigation','satellite-briefing','blueprint'].includes(slug)?'#ECEAE4':'#232B2F';
  const area={x:portrait?96:130,y:portrait?370:265,w:portrait?888:1660,h:portrait?770:580};
  const values=variant==='b'?[10,18,26]:[12,20,32];
  const header=()=>{
    text(g,names[slug],portrait?96:130,portrait?146:125,{size:portrait?65:72,weight:800,color:ink,maxWidth:W-200});
    text(g,'FINANCE / DRAWING STUDY',portrait?100:134,portrait?207:170,{size:22,color:ink,font:'monospace'});
    text(g,'示例数据 · 绘制技术测试',portrait?96:130,portrait?290:225,{size:30,color:ink});
  };
  const footer=()=>{
    const y=portrait?1290:991;
    line(g,[[96,y-35],[W-96,y-35]],ink,1);
    text(g,'合成夹具 / 非真实公告、档案或卫星影像',96,y,{size:portrait?25:24,color:ink,maxWidth:W-192});
    text(g,'SOURCE: OPENMONTAGE ENGINEERING FIXTURE · UNIT: DEMO',96,y+38,{size:portrait?17:18,color:ink,font:'monospace',maxWidth:W-192});
  };
  const chart=(t,color='#345C5B')=>{const a=area;const vertical=portrait;
    for(let i=0;i<3;i++){
      const y=a.y+60+i*(vertical?200:155),k=progress(t,.3+i*.4,1.4),width=(a.w-180)*values[i]/32;
      g.fillStyle=color;g.fillRect(a.x,y,width*k,vertical?96:85);
      text(g,['A 类','B 类','C 类'][i],a.x,y-17,{size:28,color:ink});
      text(g,values[i],a.x+width*k+18,y+59,{size:47,weight:700,color:ink});
    }
  };
  let draw;
  if(slug==='dataviz'){
    const E=await import('../dataviz/engine/engine.js');
    const layer=canvas2(1920,1080),lg=layer.getContext('2d');
    draw=t=>{
      E.drawPaper(lg,{x:960,y:540,zoom:1,roll:0},{dots:.4});
      const points=values.map((v,i)=>[260+i*620,840-v*18]);
      E.pencilStroke(lg,[[210,140],[210,850],[1690,850]],{color:E.P.ink,width:3,progress:progress(t,0,.8)});
      const tip=E.pencilStroke(lg,points,{width:7,color:E.P.blue,progress:progress(t,.7,3.2),seed:7});
      points.forEach((p,i)=>{if(t>.7+i*1.1){E.dataDot(lg,...p,15,E.P.blue);text(lg,values[i],p[0]+22,p[1]-28,{size:49,weight:700,color:E.P.ink});text(lg,['A','B','C'][i],p[0],905,{size:32,color:E.P.ink});}});
      E.drawPencil(lg,{tip,s:.9,lift:t>4?1:0,alpha:t>5?0:1});
      paper(g,W,H,{base:E.P.paper});g.drawImage(layer,area.x-20,area.y-25,area.w+40,area.h);
      text(g,'同口径比较，保留每个数据点',area.x,area.y+area.h+60,{size:portrait?32:38,color:E.P.ink,maxWidth:area.w});
    };
  } else if(slug==='swiss-motion'){
    const E=await import('../swiss-motion/engine/primitives.js');
    draw=t=>{g.fillStyle='#EAE9E5';g.fillRect(0,0,W,H);E.grid(g,{x:96,y:portrait?340:270,w:W-192,h:portrait?800:600,columns:portrait?6:12,rows:6});
      const n=variant==='b'?'03':'02';
      E.clipReveal(g,{x:area.x,y:area.y,w:area.w,h:portrait?360:430},progress(t,.1,1),()=>text(g,n,area.x-8,area.y+(portrait?320:390),{size:portrait?410:510,weight:900,color:'#111',maxWidth:area.w*.62}));
      g.fillStyle='#DE3F2C';const k=progress(t,.7,1.2);g.fillRect(portrait?area.x:1190,portrait?780:310,(portrait?760:400)*k,portrait?190:400);
      text(g,'费用也会复利',area.x,portrait?1100:865,{size:portrait?68:85,weight:800,maxWidth:area.w});
    };
  } else if(slug==='iso-infographic'){
    const {Iso,tri}=await import('../iso-infographic/engine/engine.js');
    draw=t=>{g.fillStyle='#F2E6D0';g.fillRect(0,0,W,H);const lg=canvas2(area.w,area.h),a=lg.getContext('2d'),iso=new Iso(a,area.w,area.h);iso.cam={x:0,y:0,z:0,k:portrait?18:28};
      iso.box(-13,-8,-1,26,16,1,tri('#B4A98D'));
      for(let i=0;i<3;i++){const k=progress(t,.25+i*.7,1.3);iso.box(-10+i*7,-3,0,4,6,(values[i]/4)*k,tri(['#739485','#D6AD5C','#C66B4F'][i]));}
      iso.flush();g.drawImage(lg,area.x,area.y+50);
      text(g,'供给 → 生产 → 消费',area.x,area.y+area.h+60,{size:portrait?44:54,maxWidth:area.w});
    };
  } else if(slug==='news-package'){
    const E=await import('../news-package/engine/primitives.js');
    draw=t=>{g.fillStyle=E.palette.ink;g.fillRect(0,0,W,H);const y=portrait?430:300;
      text(g,'本期三项观察',area.x,y,{size:portrait?48:60,weight:800,color:ink});
      values.forEach((v,i)=>{const x=area.x+i*(portrait?270:500);E.splitFlap(g,{x,y:y+95,w:portrait?220:340,h:portrait?230:300,oldValue:'00',newValue:String(v),progress:progress(t,.3+i*.4,1.1)});text(g,['市场','政策','企业'][i],x,y+(portrait?385:450),{size:32,color:E.palette.gold});});
      E.strap(g,{x:96,y:portrait?1050:840,w:W-192,category:'观察 / REVIEW',headline:'数据变化，需要放回背景',detail:'示例数据 · 非实时行情',brand:'研究'});
    };
  } else if(slug==='blueprint'){
    const E=await import('../blueprint/engine/draw.js'),{makePaper}=await import('../blueprint/engine/paper.js');
    const layer=canvas2(1920,1080),composite=makePaper(layer,1920,1080);
    draw=t=>{E.clear();E.setCam({x:960,y:540,z:1,r:0});
      const nodes=[[230,300],[790,300],[1350,300]];
      for(let i=0;i<3;i++) {E.line([[nodes[i][0],nodes[i][1]],[nodes[i][0]+330,nodes[i][1]],[nodes[i][0]+330,nodes[i][1]+300],[nodes[i][0],nodes[i][1]+300],[nodes[i][0],nodes[i][1]]],{u:progress(t,.2+i*.5,1),w:4});
        if(i<2)E.line([[nodes[i][0]+330,450],[nodes[i][0]+560,450]],{u:progress(t,1+i*.5,.8),w:3});}
      text(E.ov,'利率 → 融资成本 → 投资',200,780,{size:65,color:'#EFF5FF',weight:700,maxWidth:1500});
      text(E.ov,'机制示意 / SCHEMATIC',200,865,{size:33,color:'#C0D6EF'});
      composite(E.inkC,E.fxC,E.ovC,{sheet:[1920,1080],cam:{x:960,y:540,z:1,r:0},seed:7});
      g.fillStyle='#163365';g.fillRect(0,0,W,H);g.drawImage(layer,area.x-20,area.y-10,area.w+40,area.h+100);
    };
  } else if(slug==='whiteboard'){
    const E=await import('../whiteboard/engine/engine/wb.js');await E.loadFont('tech',new URL('../whiteboard/engine/fonts/EMSTech.json',import.meta.url));
    const tl=new E.Timeline(),pen=new E.Pen('black',E.INK.black),blue=new E.Pen('blue',E.INK.blue);
    tl.draw(pen,E.text('100 x (1 + r)',230,450,{h:140}),.1,{by:2.4});
    tl.draw(blue,E.arrow(320,650,1530,650,{w:12}),2.5,{by:3.5});
    tl.draw(blue,E.text('t = 1, 2, 3 ...',480,810,{h:90}),3.6,{by:5.8});
    const board=new E.Board(tl,{W:1920,H:1080}),cam=new E.Camera([[0,960,540,1],[8,950,540,1.03]]),layer=canvas2(1920,1080),a=layer.getContext('2d');
    draw=t=>{board.render(a,t,cam);for(const p of [pen,blue])E.drawMarker(a,p,E.penPose(p,t,cam),cam.at(t),t);g.fillStyle='#F1F0EB';g.fillRect(0,0,W,H);g.drawImage(layer,area.x-40,area.y-50,area.w+80,area.h+80);text(g,'本金、回报率与时间',area.x,area.y+area.h+85,{size:portrait?44:55,color:ink,maxWidth:area.w});};
  } else if(slug==='halftone-dossier'){
    const E=await import('../halftone-dossier/engine/primitives.js');
    draw=t=>{E.paper(g,W,H);E.halftone(g,{x:area.x,y:area.y,w:area.w,h:area.h,color:'#4F7871',density:(u,v)=>.12+.7*u*progress(t,0,2)});
      const y=area.y+160;g.fillStyle='#F4ECDD';g.fillRect(area.x+30,y-95,area.w-60,portrait?340:250);
      E.registration(g,(a,color)=>{text(a,'高收益',area.x+55,y,{size:portrait?126:165,weight:900,color,maxWidth:area.w-110});text(a,'≠ 低风险',area.x+55,y+(portrait?160:180),{size:portrait?110:140,weight:900,color,maxWidth:area.w-110});});
      const stamp=canvas2(400,160),a=stamp.getContext('2d');E.stamp(a,'核对假设',200,80,{w:330,h:95});g.drawImage(stamp,area.x+area.w-400,area.y+area.h-150);
    };
  } else if(slug==='visual-investigation'){
    const E=await import('../visual-investigation/engine/primitives.js');
    const doc=canvas2(700,440),a=doc.getContext('2d');paper(a,700,440,{base:'#DEE0DB'});text(a,'TECHNICAL FIXTURE',38,62,{size:30,weight:700});text(a,'非真实公告 · 转录示例',38,113,{size:28});['时点 A：发布信息','时点 B：补充说明','尚需核对统计口径'].forEach((s,i)=>text(a,s,38,200+i*70,{size:30}));
    draw=t=>{g.fillStyle=E.palette.bg;g.fillRect(0,0,W,H);const w=portrait?area.w:area.w*.57;
      E.evidenceFrame(g,doc,{x:area.x,y:area.y,w,h:portrait?480:510},{label:'文件线索',source:'合成测试卡',transcription:true});E.highlight(g,{x:area.x+20,y:area.y+185,w:w*.85,h:40,progress:progress(t,.5,1.4)});
      const x=portrait?area.x:area.x+w+65,y=portrait?area.y+565:area.y+40;E.clock(g,'T + 00:32',x,y+50);E.uncertainty(g,'推断：尚待验证',x,y+105,portrait?area.w:500);text(g,'先后 ≠ 因果',x,y+260,{size:portrait?58:60,color:ink,maxWidth:portrait?area.w:500});
    };
  } else if(slug==='data-physical'){
    const E=await import('../data-physical/engine/primitives.js');const layer=canvas2(area.w,area.h),scene=E.physicalScene(layer,{width:area.w,height:area.h});
    values.forEach((units,i)=>scene.stack({x:(i-1)*3.2,units,color:['#48736E','#A2ADA5','#B0A18A'][i]}));
    draw=t=>{g.fillStyle='#DBD7CD';g.fillRect(0,0,W,H);scene.render(t);g.drawImage(layer,area.x,area.y);text(g,'每片 = 1 个示例单位',area.x,area.y+area.h+65,{size:portrait?41:50,maxWidth:area.w});};
  } else if(slug==='briefing-board'){
    const E=await import('../briefing-board/engine/kit/board.js');
    const elements=[{id:'relation',type:'ink',kind:'line',points:[[400,600],[1600,600]],color:'blue',lw:12,t:.4,d:2.5,arrow:true}];
    ['供给约束','生产环节','需求变化'].forEach((s,i)=>elements.push({id:'n'+i,type:'card',xy:[420+i*540,420],w:420,h:230,z:12,rot:i===1?1:-1,paper:'#F7F1DD',lines:[{text:s,x:30,y:-20,size:53,font:'sc',color:'graphite'},{text:'示意节点',x:30,y:55,size:30,font:'sc',color:'blue'}],arrive:{kind:'drop',t:.1+i*.5,d:.8}}));
    await E.setScene({dur:8,hand:0,board:{w:2400,h:1400},cam:{x:960,y:540,z:.83},elements,subs:[]});const layer=canvas2(1920,1080);
    draw=t=>{E.renderScene(layer,t);g.fillStyle='#E5E1D8';g.fillRect(0,0,W,H);g.drawImage(layer,area.x-30,area.y-15,area.w+60,area.h+70);text(g,'材料与关系逐项落位',area.x,area.y+area.h+85,{size:portrait?42:52,maxWidth:area.w});};
  } else if(slug==='archive-lighttable'){
    const E=await import('../archive-lighttable/engine/primitives.js');const doc=canvas2(600,760),a=doc.getContext('2d');paper(a,600,760,{base:'#E9E4D8'});text(a,'技术测试卡',55,90,{size:50,weight:800});text(a,'NOT AN ARCHIVE',55,141,{size:26,font:'monospace'});for(let i=0;i<7;i++){text(a,'示例项目 '+(i+1),55,230+i*60,{size:29});text(a,String(values[i%3]),500,230+i*60,{size:32,align:'right',font:'monospace'});line(a,[[55,245+i*60],[520,245+i*60]],'#8B918B',1);}
    const table=canvas2(W,H),a2=table.getContext('2d');
    draw=t=>{E.lightTable(a2,W,H);E.archiveObject(a2,doc,{x:W*.43,y:portrait?760:570,w:portrait?620:600,h:portrait?800:650,rotation:-.045,id:'TEST-0001 · 合成夹具',date:'非真实招股书 / NOT EVIDENCE'});g.drawImage(table,0,0);E.loupe(g,table,{x:W*.58+progress(t,.3,4)*35,y:portrait?800:540,r:portrait?170:180,magnification:1.65});};
  } else if(slug==='satellite-briefing'){
    const E=await import('../satellite-briefing/engine/engine.js');const layer=canvas2(area.w,area.h),engine=new E.Engine(layer),world=canvas2(1024,512),a=world.getContext('2d');a.fillStyle='#354F55';a.fillRect(0,0,1024,512);a.strokeStyle='#9CABA4';a.lineWidth=2;for(let i=0;i<32;i++){a.beginPath();a.moveTo(i*32,0);a.lineTo(i*32,512);a.stroke();}for(let i=0;i<16;i++){a.beginPath();a.moveTo(0,i*32);a.lineTo(1024,i*32);a.stroke();}engine.upload('world',world);
    draw=t=>{g.fillStyle='#0E191E';g.fillRect(0,0,W,H);const cam=E.makeCamera({lat:25,lon:110,d:2500-progress(t,0,6)*1700},area.w,area.h);engine.draw({cam,slots:{},grey:.7,shade:.8});g.drawImage(layer,area.x,area.y);const p=E.project(cam,25,110);if(p){g.strokeStyle='#FFF';g.lineWidth=2;g.strokeRect(area.x+p[0]-45,area.y+p[1]-45,90,90);}text(g,'坐标与尺度测试网格',area.x,area.y+area.h+65,{size:portrait?40:50,color:ink,maxWidth:area.w});};
  }
  const texts=[];
  return {texts,render(t){g.setTransform(1,0,0,1,0,0);g.globalAlpha=1;g.clearRect(0,0,W,H);draw(clamp(t,0,8));header();footer();out.setTransform(canvas.width/W,0,0,canvas.height/H,0,0);out.clearRect(0,0,W,H);out.drawImage(cv,0,0);},dispose(){}};
}
