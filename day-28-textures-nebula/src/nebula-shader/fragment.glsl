varying vec2 vUv; // Receive the data passed from the vertex shader
uniform sampler2D uTexture;
uniform float uTime;
uniform vec2 uMouse;

void main() {
  vec2 uv = vUv;
  uv.x += sin(uv.y * 6.0 + uTime) * 0.03;  
  uv.y += sin(uv.x * 6.0 + uTime) * 0.03;  

  vec3 textureColor = texture2D(uTexture, uv).rgb;

  vec3 animatedColor = vec3(
    sin(uTime) * 0.5 + 0.5,     //normilized
    sin(uTime + 2.0) * 0.5 + 0.5,
    sin(uTime + 4.0) * 0.5 + 0.5 
  );

  // float dist = distance(vUv, uMouse);
  // float glow = smoothstep(0.4, 0.0, dist);

  // // mix everything
  // vec3 color = mix(textureColor, animatedColor, 0.4);
  // color = mix(color, animatedColor * 1.5, glow);
  // color = clamp(color, 0.0, 1.0);
  vec3 color = textureColor;

  gl_FragColor = vec4(color, 1.0); 
}