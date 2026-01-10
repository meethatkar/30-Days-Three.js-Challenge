uniform float uTime;
uniform vec2 uMouse;

varying vec2 vUv;

void main(){
  vec3 base = vec3(vUv.y * 0.6);

  // Wave distortion
  float wave = sin(vUv.x * 10. + uTime * 2.) * 0.1;
  float wave2 = sin(vUv.y * 12. - uTime * 1.5) * 0.1;

  float waves = wave + wave2;

  vec3 waveColor = vec3(
    sin(uTime) * 0.5 + 0.5,
    sin(uTime + 2.0) * 0.5 + 0.5,
    sin(uTime + 4.0) * 0.5 + 0.5
  );

  float dist = distance(vUv, uMouse);
  float mouseGlow = smoothstep(0.4, 0.0, dist);

  vec3 color = mix(base, waveColor, waves);
  color = mix(color, waveColor*1.5, mouseGlow);

  gl_FragColor = vec4(color, 1.0);
}