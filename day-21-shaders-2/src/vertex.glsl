varying vec2 vUv;

void main(){
  vUv = uv;       //setted the values, and the passed to fragment shader as we have to use this varying there.

  vec4 modelPosition=modelMatrix*vec4(position, 1);
  vec4 viewPosition=viewMatrix*modelPosition;
  vec4 projectedPosition=projectionMatrix*viewPosition;

  gl_Position=projectedPosition;
}