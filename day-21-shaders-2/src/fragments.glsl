varying vec2 vUv;
uniform float xVal;
uniform float yVal;
void main(){
  // vec4 color = vec4(xVal,yVal,xVal, 1);
  vec4 color = vec4(vUv.x,yVal,xVal, 1);
  gl_FragColor = color;
}