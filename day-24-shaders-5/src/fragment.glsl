uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;
varying float vY;
varying vec3 vNormal;

void main() {

  // base vertical gradient
  vec3 baseColor = vec3(vUv.y);

  // animated RGB color
  vec3 timeColor = vec3(
    sin(uTime + vY) * 0.5 + 0.5,
    sin(uTime + vY + 2.0) * 0.5 + 0.5,
    sin(uTime + vY + 4.0) * 0.5 + 0.5
  );

  // energy bands
  float band = step(0.0, sin(vUv.y * 12.0 + uTime));

  // smooth mouse mask
  float dist = distance(vUv, uMouse);
  float mouseMask = smoothstep(0.4, 0.0, dist)*0.3;

  // blend colors
  vec3 color = mix(baseColor, timeColor, band);
  color = mix(color, timeColor * 1.5, mouseMask);

  // safety clamp
  color = clamp(color, 0.0, 1.0);

  gl_FragColor = vec4(color, 1.0);
}
