varying vec2 vUv;
uniform float uTime;

void main(){
  vUv = uv;

  vec4 modelPosition=modelMatrix*vec4(position, 1);
  vec4 viewPosition=viewMatrix*modelPosition;
  vec4 projectedPosition=projectionMatrix*viewPosition;

  gl_Position=projectedPosition;
}