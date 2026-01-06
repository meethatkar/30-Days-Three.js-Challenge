uniform float uTime;

varying vec2 vUv;
varying float vY;

void main() {
  vUv = uv;
  
  vec4 modelPosition = modelMatrix * vec4(position, 1.0);

  float wave = sin(modelPosition.x * 2.5 + uTime) * 0.4;
  modelPosition.y += wave;

  vY = modelPosition.y;

  vec4 viewPosition = viewMatrix * modelPosition;

  gl_Position = projectionMatrix * viewPosition;
}

