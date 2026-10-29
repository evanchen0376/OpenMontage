import {stage,THREE} from '../vendor/three-stage.js';
import {progress} from '../shared/drawing.js';
const cv=(w=960,h=540)=>{const c=document.createElement('canvas');c.width=w;c.height=h;return c;};
export const threeSlugs=['backrooms','brick-toy','glass-product','hd-2d','lowpoly-island','paper-lantern','paper-popup','teardown','tilt-shift','white-model','lidar-survey'];
export async function threeStudy(slug,E,canvas) {
  const g=canvas.getContext('2d'),layer=cv(),S=stage(layer,{background:slug==='glass-product'?'#111820':slug==='lidar-survey'?'#050A0D':'#DCD6C7',orthographic:['lowpoly-island','hd-2d'].includes(slug)});
  let update=()=>{},draw=()=>S.render();
  if(slug==='backrooms'){
    const floor=new THREE.Mesh(new THREE.PlaneGeometry(35,35),new THREE.MeshStandardMaterial({map:E.carpet(),roughness:1}));floor.rotation.x=-Math.PI/2;S.scene.add(floor);
    for(let i=0;i<7;i++){const wall=new THREE.Mesh(new THREE.BoxGeometry(.5,5,12),new THREE.MeshStandardMaterial({map:E.wallpaper(),roughness:.9}));wall.position.set((i-3)*4,2.5,-2);S.scene.add(wall);}
    S.scene.fog=new THREE.Fog('#B4B195',6,35);S.camera.position.set(0,2.4,13);S.camera.lookAt(0,2,-12);update=t=>{S.camera.position.x=Math.sin(t*.2)*.5;};
  } else if(slug==='brick-toy'){
    const bricks=[];for(let i=0;i<12;i++){const b=E.brick(2,2,['#BC5143','#5C8B82','#D6B356'][i%3]);b.position.set((i%4-1.5)*2.05,Math.floor(i/4)*.98,0);S.scene.add(b);bricks.push(b);}
    update=t=>bricks.forEach((b,i)=>{const p=progress(t,.1+i*.25,.7);b.visible=p>0;b.position.y=Math.floor(i/4)*.98+(1-p)*4;b.rotation.z=0;});
  } else if(slug==='glass-product'){
    const P=await import('../glass-product/engine/product.js'),studio=E.makeStudio(S.renderer,S.scene);
    const glass=new THREE.Mesh(new THREE.TorusKnotGeometry(1.6,.55,160,20),P.glass({thickness:1.2,dispersion:2}));glass.position.y=2;S.scene.add(glass);
    studio.updateEnv({sweep:{x:0,I:3,az:0}});S.scene.backgroundIntensity=.5;
    update=t=>{glass.rotation.y=.2+progress(t,0,7)*.8;};
  } else if(slug==='hd-2d'){
    const K=await import('../hd-2d/engine/kit.js');
    for(let i=0;i<10;i++){const box=K.crate(1.5);box.position.set((i%5-2)*1.6,Math.floor(i/5)*1.5,-(i%2));S.scene.add(box);}
    const px=E.woodPlanks(64,64);const wall=new THREE.Mesh(new THREE.PlaneGeometry(11,5),new THREE.MeshStandardMaterial({map:E.texOf(px),roughness:.9}));wall.position.set(0,2.5,-3);S.scene.add(wall);update=t=>{S.camera.position.x=10+Math.sin(t*.2);S.camera.lookAt(0,1,0);};
  } else if(slug==='lowpoly-island'){
    const sea=E.makeSea(S.scene);const colors=['#758E7A','#9CAF86','#C3B085'];
    const cells=[];for(let i=0;i<19;i++){const angle=i*2.4,r=Math.sqrt(i)*1.1;const m=new THREE.Mesh(new THREE.CylinderGeometry(1,1,1.5,6),new THREE.MeshStandardMaterial({color:colors[i%3],flatShading:true}));m.position.set(Math.cos(angle)*r,.2,Math.sin(angle)*r);S.scene.add(m);cells.push(m);}
    update=t=>{sea.U.uTime.value=t;cells.forEach((m,i)=>{m.visible=t>i*.16;m.scale.y=Math.max(.001,progress(t,i*.16,.7));});};
  } else if(slug==='paper-lantern'){
    const U={uLight:{value:new THREE.Vector3(0,2,10)},uLightCol:{value:new THREE.Vector3(1,.75,.4)},uLightR:{value:5},uLit:{value:1}};
    const sheets=[];for(let i=0;i<5;i++){const sheet=E.sheet({w:9-i*.6,h:6-i*.5,ppm:100,z:-i*.55,y:3,U,trans:.65,draw:a=>{a.fillStyle=['#506C70','#668B83','#9BAE86','#D2BD83','#E4D7A5'][i];a.beginPath();a.rect(-5,-4,10,8);a.ellipse(0,.5,2.5-i*.28,2-i*.15,0,0,Math.PI*2);a.fill('evenodd');}});S.scene.add(sheet);sheets.push(sheet);}
    S.camera.position.set(5,5,16);S.camera.lookAt(0,3,0);update=t=>{U.uLight.value.x=-3+progress(t,0,7)*6;};
  } else if(slug==='paper-popup'){
    const cover=cv(800,600),a=cover.getContext('2d');a.fillStyle='#C2B27F';a.fillRect(0,0,800,600);a.fillStyle='#365D64';a.font='bold 80px sans-serif';a.fillText('STUDY',120,320);
    const book=E.makeBook({c:cover,m:cover});book.root.scale.setScalar(20);book.root.position.set(0,0,-2);S.scene.add(book.root);
    const {cutMesh}=await import('../paper-popup/engine/cutmesh.js'),pieces=[];
    for(let i=0;i<3;i++){const art=cv(400,600),a=art.getContext('2d');a.fillStyle=['#638A7D','#BC9658','#61788F'][i];a.fillRect(30,80,340,520);a.fillStyle='#F1E9CD';for(let j=0;j<3;j++)a.fillRect(70+j*95,180,45,230);const p=cutMesh({c:art,w:.08,h:.14,ax:.5,ay:1});p.position.set((i-1)*.12,.002,.18);book.stage.add(p);pieces.push(p);}
    update=t=>{book.setOpen(progress(t,.1,3)*Math.PI*.5);pieces.forEach((p,i)=>{p.rotation.x=-Math.PI*.5*(1-progress(t,1+i*.5,3));});};
  } else if(slug==='teardown'){
    const parts=[];for(let i=0;i<4;i++){const geo=E.keycapGeometry(1.8,1.8,.65);const part=new THREE.Mesh(geo,new THREE.MeshStandardMaterial({color:['#D8D5C8','#6A8D89','#C5AE69','#B4BBB0'][i],roughness:.4}));part.castShadow=true;part.position.set((i%2-.5)*2.5,1,Math.floor(i/2)*2.5-1);S.scene.add(part);parts.push(part);}
    update=t=>parts.forEach((p,i)=>{p.position.y=1+progress(t,.4+i*.3,2)*i*.8;});
  } else if(slug==='tilt-shift'){
    const post=E.makePost(S.renderer,S.scene,S.camera,960,540,{ssaa:1,ao:false});
    for(let i=0;i<35;i++){const h=.8+(i%5)*.6,m=new THREE.Mesh(new THREE.BoxGeometry(.8,h,.8),new THREE.MeshStandardMaterial({color:['#A6B2A3','#C6A78C','#ABB4B7'][i%3]}));m.position.set(i%7*1.25-4,h/2,Math.floor(i/7)*1.3-3);S.scene.add(m);}
    S.camera.position.set(10,12,13);S.camera.lookAt(0,0,0);update=t=>{S.camera.position.x=10+progress(t,0,7)*1.5;S.camera.lookAt(0,0,0);};draw=()=>post.composer.render();
  } else if(slug==='white-model'){
    const model={size:[1.4,1.1],decks:[],b:[],p:[]};for(let i=0;i<6;i++){const x=(i%3-1)*.38,z=(Math.floor(i/3)-.5)*.46,h=.12+i*.04;model.b.push([1900+i*20,h]);model.p.push([i,h,[[[x-.12,z-.16],[x+.12,z-.16],[x+.12,z+.16],[x-.12,z+.16]]]]);}
    const studio=E.makeStudio(480,270,model),water=new THREE.DataTexture(new Uint8Array(4*4*4).fill(255),4,4),zs=new THREE.DataTexture(new Uint8Array(4*4*4).fill(0),4,4);water.needsUpdate=zs.needsUpdate=true;studio.build(new Map([0,1,2,3,4,5].map(i=>[i,i])),water,zs);studio.camera.position.set(1.7,1.4,2.1);studio.camera.lookAt(0,.1,0);studio.renderer.shadowMap.needsUpdate=true;
    studio.U.uGrowOn.value=1;studio.U.uGT.value=[0,2,3,4,5];studio.U.uGS.value=[0,0,0,0,0];
    return t=>{studio.camera.position.x=1.7+progress(t,0,7)*.3;studio.camera.lookAt(0,.1,0);studio.U.uProj.value=progress(t,.5,3)*2;studio.U.uPreR.value=progress(t,.5,4)*2;studio.U.uNow.value=t;studio.house.intensity=2*(1-progress(t,.5,3)*.9);studio.hemi.intensity=.1;studio.renderer.render(studio.scene,studio.camera);g.drawImage(studio.renderer.domElement,0,0,1920,1080);};
  } else if(slug==='lidar-survey'){
    const values=[];for(let i=0;i<100;i++)for(let j=0;j<75;j++){const x=(i-50)*.1,z=(j-37)*.1;values.push(x,Math.sin(x*.8)*Math.cos(z*.7)+1,z);}
    const survey=E.pointSurvey({positions:new Float32Array(values),pointSize:3});S.scene.children[2].visible=false;S.scene.add(survey.points);update=t=>survey.setScan(-5+progress(t,0,6)*10);
  } else throw new Error('Missing 3D study: '+slug);
  return t=>{update(t);draw();g.drawImage(layer,0,0,1920,1080);};
}
