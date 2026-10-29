// Physical data grammar adapted from Lemo-Opuscar data-physical (MIT).
// Data and layout are caller-owned. No demo spirals, timeline or music.
import * as THREE from 'three';
export function physicalScene(canvas,{width=1920,height=1080}={}) {
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,alpha:false,preserveDrawingBuffer:true});renderer.setSize(width,height,false);
  renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
  renderer.toneMapping=THREE.ACESFilmicToneMapping;renderer.toneMappingExposure=1.1;
  const scene=new THREE.Scene();scene.background=new THREE.Color('#DBD7CD');
  const camera=new THREE.PerspectiveCamera(33,width/height,.1,200);camera.position.set(12,10,17);camera.lookAt(0,2,0);
  scene.add(new THREE.HemisphereLight('#F2F5FF','#69604E',2));
  const key=new THREE.DirectionalLight('#FFF2DD',4);key.position.set(-6,12,5);key.castShadow=true;key.shadow.mapSize.set(2048,2048);key.shadow.camera.left=-15;key.shadow.camera.right=15;key.shadow.camera.top=15;key.shadow.camera.bottom=-15;key.shadow.bias=-.001;scene.add(key);
  const rim=new THREE.DirectionalLight('#BFD9F1',2);rim.position.set(6,6,-5);scene.add(rim);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(200,200),new THREE.MeshStandardMaterial({color:'#CEC7BA',roughness:.9}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  const stacks=[];
  function stack({x=0,z=0,units,unitValue=1,color='#526C6E',thickness=.18}) {
    if(!Number.isInteger(units)||units<0||units>2000||!(unitValue>0))throw new Error('Countable units (0–2000) and positive unitValue required');
    const group=new THREE.Group(),pieces=[];scene.add(group);
    for(let i=0;i<units;i++){
      const material=new THREE.MeshStandardMaterial({color:(i+1)%10===0?'#B69650':color,roughness:.38,metalness:.4});
      const mesh=new THREE.Mesh(new THREE.BoxGeometry(1.6,thickness,1.25),material);mesh.castShadow=true;mesh.receiveShadow=true;mesh.position.set(x+Math.sin(i*17)*.016,.08+i*(thickness+.025),z);mesh.rotation.y=Math.sin(i*29)*.012;group.add(mesh);pieces.push(mesh);
    }const record={group,pieces,units,unitValue,thickness};stacks.push(record);return record;
  }
  function render(t){for(const s of stacks)for(let i=0;i<s.pieces.length;i++){const u=Math.max(0,Math.min(1,(t-i*.09)/.28));s.pieces[i].visible=u>0;s.pieces[i].position.y=.08+i*(s.thickness+.025)+(1-u)*(1-u)*2.4;}renderer.render(scene,camera);}
  function dispose(){scene.traverse(o=>{o.geometry?.dispose();if(Array.isArray(o.material))o.material.forEach(m=>m.dispose());else o.material?.dispose();});renderer.dispose();}
  return {scene,camera,stack,render,dispose};
}
