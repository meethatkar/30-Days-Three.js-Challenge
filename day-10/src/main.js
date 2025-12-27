import './style.css'
import './style.css'
import * as THREE from "three";

// --------------------
// SCENE
// --------------------
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0b);

// --------------------
// CAMERA (cinematic framing)
// --------------------
const camera = new THREE.PerspectiveCamera(
  50,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.5, 6);
camera.lookAt(0, 0, 0);

// --------------------
// RENDERER
// --------------------
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// --------------------
// LIGHTING (clean + premium)
// --------------------
scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const dirLight = new THREE.DirectionalLight(0xffffff, 1);
dirLight.position.set(3, 4, 2);
scene.add(dirLight);

// --------------------
// GROUP (core Day 10 concept)
// --------------------
const sculpture = new THREE.Group();
scene.add(sculpture);

// --------------------
// MATERIAL
// --------------------
const material = new THREE.MeshStandardMaterial({
  color: 0x9be7ff,
  metalness: 0.7,
  roughness: 0.3
});

// --------------------
// MULTIPLE MESHES INSIDE GROUP
// --------------------
for (let i = 0; i < 6; i++) {
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.6, 0.6),
    material
  );

  box.position.y = i * 0.5 - 1.25;
  box.rotation.y = i * 0.4;

  sculpture.add(box);
}

// --------------------
// TIME-BASED ANIMATION
// --------------------
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();

  sculpture.rotation.y = t * 0.4;
  sculpture.position.y = Math.sin(t) * 0.2;

  renderer.render(scene, camera);
}

animate();

// --------------------
// RESIZE HANDLING
// --------------------
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
