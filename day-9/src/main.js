/*
We’ll reuse this foundation for:
dust fields
galaxies
portal fx
magic trails
crypto particle backgrounds
hero section FX 
*/

import './style.css'
import * as THREE from "three";
// Scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color(0x050505);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 6;

// Renderer
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const count = 6000;
const radius = 5;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);

const insideColor = new THREE.Color("#8538ff");
const outsideColor = new THREE.Color("#0011ff");

for (let i = 0; i < count; i++) {
  const i3 = i * 3;

  const r = Math.random() * radius;
  const angle = r * 1.5;

  positions[i3] = Math.cos(angle) * r;
  positions[i3 +1] = (Math.random() - 0.5) * 0.3;
  positions[i3 + 2] = Math.sin(angle) * r;

  const mixed = insideColor.clone();
  mixed.lerp(outsideColor, r / radius);
  colors[i3] = mixed.r;
  colors[i3 + 1] = mixed.g;
  colors[i3 + 2] = mixed.b;
}

const geometry = new THREE.BufferGeometry();
geometry.setAttribute(
  position,
  new THREE.BufferAttribute(positions, 3)
);
geometry.setAttribute(
colors,
new THREE.BufferAttribute(colors, 3)
);
const materail = new THREE.PointsMaterial({
  color: 0x4f8cff,
  size: 0.04,
  vertexColors: true,
  transparent: true,
  opacity: 0.8
});

const particles = new THREE.Points(geometry, materail);
scene.add(particles);

// Resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Animate
function animate() {
  requestAnimationFrame(animate);
  particles.rotation.y += 0.001;
  renderer.render(scene, camera);
}

animate();