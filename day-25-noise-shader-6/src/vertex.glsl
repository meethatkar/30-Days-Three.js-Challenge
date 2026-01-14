// Standard uniforms and attributes provided by Three.js (automatically included with ShaderMaterial)
// uniform mat4 modelViewMatrix;
// uniform mat4 projectionMatrix;
// attribute vec3 position;
// attribute vec2 uv;

varying vec2 vUv; // Variable to pass data to the fragment shader

void main() {
    // 1. Pass the UV coordinates to the fragment shader
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}