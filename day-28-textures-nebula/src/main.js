import './style.css'
import * as THREE from 'three';
import vertex from "./nebula-shader/vertex.glsl?raw";
import fragment from "./nebula-shader/fragment.glsl?raw";
import vertexParticle from "./particles-shader/vertex.glsl?raw";
import fragmentParticle from "./particles-shader/fragment.glsl?raw";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// 1. CREATE THE SCENE (The World)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020); // Optional: Dark grey background

// 2. CREATE THE CAMERA (The Eyes)
const camera = new THREE.PerspectiveCamera(
    75,                                     // Field of View (FOV)
    window.innerWidth / window.innerHeight, // Aspect Ratio
    0.1,                                    // Near Clipping Plane
    1000                                    // Far Clipping Plane
);
camera.position.z = 5; // Move camera back so we can see the center

// 3. CREATE THE RENDERER (The Painter)
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const controls = new OrbitControls( camera, renderer.domElement );
controls.enableDamping = true;


// 4. ADD AN OBJECT
const geometry = new THREE.SphereGeometry(3, 20, 20);
const material = new THREE.ShaderMaterial({
  fragmentShader: fragment,
  vertexShader: vertex,
  transparent: true,
  uniforms:{
    uTime: {value: 0},
    uMouse: {value: new THREE.Vector2(0.5, 0.5)},
    uTexture: {value: new THREE.TextureLoader().load("/earth.webp")}
  }
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// PRATICLES CODE:-
const count = 2000
const positions = new Float32Array(count * 3)

for (let i = 0; i < count * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 20
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute(
  'position',
  new THREE.BufferAttribute(positions, 3)
)

const particleMaterial = new THREE.ShaderMaterial({
  blending: THREE.AdditiveBlending,     //make overlapping obejcts brighter, instead of darker
  transparent: true,
  size: 0.09,
  vertexShader: vertexParticle,
  fragmentShader: fragmentParticle,
  color: 0x2CFF05,
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

const clock = new THREE.Clock();

// 5. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.uTime.value = clock.getElapsedTime();
    // Draw the scene
    renderer.render(scene, camera);
    controls.update();
}

// 6. HANDLE WINDOW RESIZE (Keep things sharp)
window.addEventListener('resize', () => {
    // Update camera info
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the loop
animate();