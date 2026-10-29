// Neutral ENGINEERING stage, no ready-made production scenes or story.
import * as THREE from 'three';
export {THREE};
export function stage(canvas,{background='#DED8CC',orthographic=false}={}) {
  const width=canvas.width,height=canvas.height;
  const renderer=new THREE.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setSize(width,height,false);renderer.setPixelRatio(1);renderer.shadowMap.enabled=true;renderer.shadowMap.type=THREE.PCFSoftShadowMap;renderer.outputColorSpace=THREE.SRGBColorSpace;
  const scene=new THREE.Scene();scene.background=new THREE.Color(background);
  const camera=orthographic?new THREE.OrthographicCamera(-6*width/height,6*width/height,6,-6,.1,100):new THREE.PerspectiveCamera(35,width/height,.1,100);camera.position.set(10,9,13);camera.lookAt(0,1,0);
  scene.add(new THREE.HemisphereLight('#E9F2FF','#776750',2));const key=new THREE.DirectionalLight('#FFF2D8',3);key.position.set(-5,12,7);key.castShadow=true;scene.add(key);
  const ground=new THREE.Mesh(new THREE.PlaneGeometry(100,100),new THREE.MeshStandardMaterial({color:background,roughness:.8}));ground.rotation.x=-Math.PI/2;ground.receiveShadow=true;scene.add(ground);
  return {renderer,scene,camera,render:()=>renderer.render(scene,camera),dispose(){scene.traverse(o=>{o.geometry?.dispose();o.material?.dispose?.();});renderer.dispose();}};
}
