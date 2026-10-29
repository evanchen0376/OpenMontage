// Independent material/mark studies. No upstream stories or finished shots.
import {paper,progress,clamp} from '../shared/drawing.js';
const cv=(w=1920,h=1080)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
const wave=(x,y,w,h,n=50)=>Array.from({length:n},(_,i)=>[x+i*w/(n-1),y+Math.sin(i/(n-1)*Math.PI*2)*h]);
export const paintingSlugs=['watercolor','impasto','ink-wash','crayon-book','one-line','urban-sketch','woodcut','engraving','risograph','ukiyoe','papercut-red','shadow-puppet','silkscreen-poster','stained-glass'];
export async function paintingStudy(slug,E,canvas) {
  const g=canvas.getContext('2d');
  if(slug==='watercolor'){
    const strokes=E.withSeed(19,()=>Array.from({length:28},(_,i)=>E.mk(wave(250,200+i*23,1400,Math.sin(i)*40+45),27,['#6E8D89','#D4AA69','#8A6A72'][Math.floor(i/10)%3],{nb:7,a:.72,prof:'brush'})));
    return t=>{paper(g,1920,1080,{base:'#F1E9DA'});E.drawList(g,strokes,progress(t,.15,5));};
  }
  if(slug==='impasto'){
    const {Impasto,Strokes,KNIFE}=E,layer=cv(1920,1080),engine=new Impasto(layer,{W:1920,H:1080,ss:1}),marks=new Strokes();
    for(let j=0;j<21;j++)for(let i=0;i<43;i++){const a=i/42,b=j/20;marks.push({x:180+i*36,y:150+j*36,ang:.12*Math.sin(i*7+j),len:50,wid:40,c:[.17+a*.2,.28+b*.25,.31+a*.17],c2:[.38+a*.2,.49+b*.2,.48],hgt:2,seed:i+j*43,type:KNIFE,rev:(j*43+i)/180});}
    const batch=engine.batch(marks.data());
    return t=>{engine.begin([.89,.85,.77]);engine.draw(batch,{t,appear:0,appDur:.45,n:Math.ceil(marks.n*progress(t,0,6)),grey:0,wet:.7});engine.finish({ground:[.89,.85,.77]});g.drawImage(layer,0,0);};
  }
  if(slug==='ink-wash'){
    const wet=cv(),dry=cv(),color=cv(),L={wet:wet.getContext('2d'),dry:dry.getContext('2d'),col:color.getContext('2d')};
    const strokes=Array.from({length:11},(_,i)=>E.mk(wave(230+i*55,550-i*20,1000-i*40,110+i*3),{w:65-i*4,tone:.08+i*.065,dry:i/13,seed:i+4}));
    return t=>{paper(g,1920,1080,{base:'#F3EFE4'});for(const a of Object.values(L))a.clearRect(0,0,1920,1080);E.drawSeq(L,strokes,progress(t,0,5));g.drawImage(wet,0,0);g.drawImage(dry,0,0);g.drawImage(color,0,0);};
  }
  if(slug==='crayon-book'){
    const {makeComp}=await import('../crayon-book/engine/gl.js');const layer=cv(),comp=makeComp(layer),L=E.layer();
    return t=>{E.clear(L);E.BOIL.step=Math.floor(t*12);const p=progress(t,.1,4.5);for(let i=0;i<5;i++)E.fill(L,[[240+i*290,730],[270+i*290,300-i*32],[470+i*290,290+i*25],[500+i*290,730]],{col:['#D2AA54','#668A7F','#BC6659','#62688D','#B7A268'][i],draw:clamp(p*5-i),seed:i+3,gap:11,w:14});comp.begin();comp.crayon(L.c);comp.finish();g.drawImage(layer,0,0);};
  }
  if(slug==='one-line'){
    const ink=await import('../one-line/engine/ink.js'),P=E.buildPath([{id:'curve',style:'adult',t:[0,6],parts:[{d:'M 220 650 C 400 200 620 160 800 550 S 1150 900 1500 300'}]}]);ink.prepare(P);
    const pp=await import('../one-line/engine/paper.js'),texture=pp.makePaper();
    return t=>{pp.drawPaper(g,texture,{cx:960,cy:540,k:1,r:0},1920,1080);ink.drawLine(g,P,(P.N-2)*progress(t,.1,6),(x,y)=>[x,y],1);};
  }
  if(slug==='urban-sketch'){
    const buildings=Array.from({length:7},(_,i)=>[[220+i*210,800],[220+i*210,340+(i%3)*80],[390+i*210,310+(i%3)*80],[390+i*210,800]]);
    return t=>{paper(g,1920,1080,{base:'#F3EBDB'});buildings.forEach((shape,i)=>E.sketchShape(g,shape,['#C8A578','#B0B9B1','#B8A8AA'][i%3],{p:progress(t,i*.4,1.7),seed:i+4,ink:3,wash:progress(t,2+i*.2,1.5)*.65}));};
  }
  if(slug==='woodcut'){
    const shape=E.shape([E.ellipse(960,540,460,330)],{sp:9,halo:12,seed:3,reveal:{t0:0,t1:6,key:(x,y)=>(x-500)/920}}),mask=cv(),a=mask.getContext('2d'),printer=E.makePrinter();
    return t=>{a.fillStyle='#000';a.fillRect(0,0,1920,1080);shape.draw(a,t);g.drawImage(printer.render(mask,null,{mode:'print',seed:3}),0,0);};
  }
  if(slug==='engraving'){
    const B=await import('../engraving/engine/engine/burin.js'),ink=new B.Ink();ink.group('hatch');
    for(let i=0;i<150;i++){const x=350+i*8;ink.add(wave(x,300,200,140,24),Array.from({length:24},(_,j)=>.3+2.4*Math.sin(Math.PI*j/23)));}ink.schedule('hatch',0,6);ink.build();
    return t=>{paper(g,1920,1080,{base:'#EFE6CF'});g.strokeStyle='#BBAF90';g.lineWidth=2;g.strokeRect(100,80,1720,920);ink.draw(g,t);};
  }
  if(slug==='risograph'){
    const {makeRiso}=await import('../risograph/engine/riso.js'),layer=cv(),render=makeRiso(layer,1920,1080);
    return t=>{E.clear();for(let i=0;i<5;i++){E.circle(400+i*280,540,190*progress(t,.1+i*.3,1.6),E.ink(i%3===0?.9:0,i%3===1?.9:0,i%3===2?.8:0));}render(E.plate,{seed:4,boil:.2,off:[[3,0],[-3,2],[0,-2]]});g.drawImage(layer,0,0);};
  }
  if(slug==='ukiyoe'){
    E.buildTextures();const base=cv(),b=base.getContext('2d');b.fillStyle=E.PAL.paper;b.fillRect(0,0,1920,1080);E.bokashi(b,0,0,1920,650,'#456B90',.9,.05);
    return t=>{g.drawImage(base,0,0);for(let i=0;i<5;i++){const y=480+i*110;E.fillPath(g,[[0,y],[300,y-90],[700,y-210],[1100,y-20],[1500,y-170],[1920,y-50],[1920,1080],[0,1080]],['#86938A','#647F78','#3E696A','#284C59','#163847'][i]);}g.save();g.translate(progress(t,0,7)*40,0);E.printTex(g,.16,.4);g.restore();};
  }
  if(slug==='papercut-red'||slug==='shadow-puppet'){
    const red=slug==='papercut-red';const object=E.piece([0,0,620,620],a=>{
      const shape=q=>{q.arc(310,310,285,0,Math.PI*2);};
      if(red)E.fill(a,shape);else E.fill(a,E.DYE.red,shape);
      for(let i=0;i<16;i++){const ang=i*Math.PI/8;E.cut(a,q=>{q.ellipse(310+Math.cos(ang)*175,310+Math.sin(ang)*175,55,18,ang,0,Math.PI*2);});}
      E.cut(a,q=>q.arc(310,310,95,0,Math.PI*2));
    },{seed:6});
    let transmit,front,glCanvas,screen;
    if(!red){transmit=cv();front=cv();glCanvas=cv();const {makeGL}=await import('../shadow-puppet/engine/gl.js');screen=makeGL(glCanvas);}
    return t=>{const a=red?g:transmit.getContext('2d');paper(a,1920,1080,{base:red?'#EFE3CC':'#FFFFFF'});a.save();a.translate(960,540);a.rotate((progress(t,0,7)-.5)*.35);a.translate(-310,-310);if(red)E.paperShadow(a,1,2);E.drawPiece(a,object);a.restore();if(!red){screen.render(transmit,front,{lamps:[[760+progress(t,0,7)*400,450,1,.5]],expo:1.8,cloth:1,time:t,bloom:.16});g.drawImage(glCanvas,0,0);}};
  }
  if(slug==='silkscreen-poster'){
    const texture=E.makeTextures('#F3E7D2',5),parts=[E.circlePath(700,520,290),E.rectPath(850,260,450,550),E.ringPath(1250,550,130,230)];
    return t=>{E.paperSheet(g,texture,0,0,1920,1080);parts.forEach((path,i)=>E.ink(g,{path},{color:['#D1583F','#23676A','#D5AE55'][i],clip:E.wipeRegion([100,100,1800,950],'right',progress(t,i*.7,2),5),reg:[i*2,-i*2]}));E.inkFinish(g,texture,0,0,1920,1080,.6,.6);};
  }
  if(slug==='stained-glass'){
    const pass=new E.Pass(g,cv().getContext('2d')),cells=E.voronoi(Array.from({length:23},(_,i)=>[280+(i*173%1350),160+(i*113%760)]),[220,100,1700,980]);
    return t=>{g.fillStyle='#191B20';g.fillRect(0,0,1920,1080);for(const cell of cells){pass.piece(E.softPoly(cell.pts),['#264D91','#AB3B31','#CBA756','#45877B'][cell.i%4],{id:cell.i});}g.save();g.globalCompositeOperation='screen';const gradient=g.createRadialGradient(600+progress(t,0,7)*800,470,20,1000,540,650);gradient.addColorStop(0,'rgba(255,221,161,.5)');gradient.addColorStop(1,'rgba(255,220,150,0)');g.fillStyle=gradient;g.fillRect(200,90,1520,900);g.restore();};
  }
  throw new Error('Missing painting study: '+slug);
}
