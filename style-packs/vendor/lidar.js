// LiDAR scan/cut-plane grammar adapted from Lemo-Opuscar (MIT).
// Real input positions must already be in a documented local metric frame.
import * as THREE from 'three';
export function pointSurvey({positions,colors,pointSize=3}) {
  if(!(positions instanceof Float32Array)||positions.length%3)throw new Error('Float32 xyz positions required');
  if(colors&&(!(colors instanceof Float32Array)||colors.length!==positions.length))throw new Error('Per-point RGB must match positions');
  const geometry=new THREE.BufferGeometry();geometry.setAttribute('position',new THREE.BufferAttribute(positions,3));
  if(colors)geometry.setAttribute('color',new THREE.BufferAttribute(colors,3));
  const material=new THREE.ShaderMaterial({uniforms:{scan:{value:1e8},pointSize:{value:pointSize}},vertexShader:`uniform float scan;uniform float pointSize;varying float a;varying float height;void main(){a=step(position.x,scan);height=position.y;vec4 p=modelViewMatrix*vec4(position,1.);gl_Position=projectionMatrix*p;gl_PointSize=pointSize;}`,fragmentShader:`varying float a;varying float height;void main(){if(a<.5||length(gl_PointCoord-.5)>.5)discard;vec3 c=mix(vec3(.15,.35,.28),vec3(.82,.95,.85),clamp(height/4.,0.,1.));gl_FragColor=vec4(c,1.);}`});
  const points=new THREE.Points(geometry,material);
  return {points,setScan:x=>{material.uniforms.scan.value=x;},dispose(){geometry.dispose();material.dispose();}};
}
