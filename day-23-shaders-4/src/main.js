import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import vertexShader from './vertext.glsl?raw';
import fragmentShader from './fragment.glsl?raw';

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 3;

// Renderer
const canvas = document.getElementById('canvas');
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.dampingFactor = 0.05;

// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 60, 60);

// Material
const material = new THREE.ShaderMaterial({
  vertexShader: vertexShader,
  fragmentShader: fragmentShader,
  side: THREE.DoubleSide,
  uniforms: {
    uColor: { value: new THREE.Color(0x00aaff) },
    uTime: {value: 0}
  }
});

// Mesh
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

const clock =new THREE.Clock();

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  material.uniforms.uTime.value = time;

  // Update controls
  controls.update();
  renderer.render(scene, camera);
}

animate();

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

