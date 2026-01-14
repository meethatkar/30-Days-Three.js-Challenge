uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

// random function
float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

// value noise
float noise(vec2 st) {
  vec2 i = floor(st);
  vec2 f = fract(st);

  float a = random(i);
  float b = random(i + vec2(1.0, 0.0));
  float c = random(i + vec2(0.0, 1.0));
  float d = random(i + vec2(1.0, 1.0));

  vec2 u = f * f * (3.0 - 2.0 * f);

  return mix(a, b, u.x) +
         (c - a) * u.y * (1.0 - u.x) +
         (d - b) * u.x * u.y;
}

void main() {

  // scale UVs
  vec2 st = vUv * 12.0;

  // animated noise
  float n = noise(st + uTime * 0.5);

  // base gradient
  vec3 base = vec3(vUv.y);

  // color from noise
  vec3 noiseColor = vec3(
    n,
    n * 0.8,
    1.0 - n
  );

  // mix base and noise
  vec3 color = mix(base, noiseColor, n);

  gl_FragColor = vec4(color, 1.0);
}
