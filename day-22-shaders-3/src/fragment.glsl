varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec2 uMouse;

void main(){
  vec3 uvColor = vec3(vUv, 1.0);

  vec3 lightDir = normalize(vec3(uMouse - 0.5, 1.0));

  float light = dot(normalize(vNormal), lightDir);
  light = clamp(light, 0.0, 1.0);

  float rim = 1.0 - abs(dot(normalize(vNormal), vec3(0.0, 0.0, 1.0)));
  rim = pow(rim, 2.5);

  vec3 color = 
    uvColor * 0.3 + 
    vec3(0.2, 0.6, 1.0) * light*2. +
    vec3(0.8, 0.9, 1.0) * rim;

  gl_FragColor = vec4(color, 1.0);
}