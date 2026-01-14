varying vec2 vUv;
uniform float uTime;
varying vec3 vNormal;
varying float vY;


void main(){
  vUv = uv;
  vNormal = normal;

  vec3 pos = position;

  float wave = sin(pos.x * 3.0 + uTime) * 0.1;
  pos += normal * wave;

  vY = pos.y;

  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}