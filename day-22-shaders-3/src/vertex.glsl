varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform float uTime;

void main(){
  vUv = uv;
  vNormal = normal;
  vPosition = position;

  vec3 pos = position;

  // Wave displacment using position
  float wave = sin(pos.x * 6.0 + uTime) * 0.1;
  pos += normal * wave;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}