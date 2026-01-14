uniform float uTime;

void main(){
  vec3 pos = position;
  pos.y += sin(pos.x * 2.0 + uTime) * 0.2;
  pos.x += sin(pos.y * 2.0 + uTime) * 0.2;
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = 2.5;
  gl_Position = projectionMatrix * mvPosition;
}