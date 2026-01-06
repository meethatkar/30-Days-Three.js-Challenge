uniform vec3 uColor;
uniform float uTime;

varying float vY;

varying vec2 vUv;

void main() {
  float yFactor = vY * 0.8;

  // Time based coloring
  float r =sin(uTime + yFactor) * 0.5 + 0.5;
  float g =sin(uTime + yFactor + 2.0) * 0.5 + 0.5;
  float b =sin(uTime + yFactor + 4.0) * 0.5 + 0.5;

  float bands = sin((vUv.y + uTime *0.2) * 10.) * 0.15;

  vec3 color = vec3(r,g,b);

  gl_FragColor = vec4(color, 1.0);
}

