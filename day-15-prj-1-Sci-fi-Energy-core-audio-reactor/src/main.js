import './style.css'
import * as THREE from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

// Scene setup
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x1a1a2e);
scene.fog = new THREE.FogExp2(0x1a1a2e, 0.1);

// Camera setup
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
)
camera.position.z = 7

// Renderer setup
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)
renderer.toneMapping = THREE.ReinhardToneMapping;     //bloom ofen makes colors weird, so tonemapping helps

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true // Smooth camera movement
controls.dampingFactor = 0.05

// Create a cube
const geometry = new THREE.IcosahedronGeometry(2, 1);
const material = new THREE.MeshStandardMaterial({
  color: 0x00FEFC,
  metalness: 0.7,
  roughness: 0.3,
  wireframe: true,
  emissive: 0x00FEFC,
  emissiveIntensity: 0.3
})
const cube = new THREE.Mesh(geometry, material)
cube.visible = false; // Initially hidden
scene.add(cube);

const effectComposer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
effectComposer.addPass(renderPass);

const bloomPass = new UnrealBloomPass(
  window.innerWidth / window.innerHeight,
  1.2,
  0.7,
  0
)
effectComposer.addPass(bloomPass);

// PARTICLES
const particleCount = 300;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);

for (let i = 0; i <= particleCount * 3; i += 3) {
  const phi = Math.acos(-1 + (2 * Math.random()));   //vertical surrounding
  const theta = Math.sqrt(particleCount * Math.PI) * phi;   //horizontal surrounding 
  const radius = 5;

  positions[i] = radius * Math.cos(theta) * Math.sin(phi);    // X
  positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi);   //Y
  positions[i + 2] = radius * Math.cos(phi);
}
const particleGeo = new THREE.BufferGeometry();
particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));    //take 3 items from array and set them as one point (having x,y,z)

const particleMaterial = new THREE.PointsMaterial({
  blending: THREE.AdditiveBlending,     //make overlapping obejcts brighter, instead of darker
  transparent: true,
  size: 0.09,
  color: 0x2CFF05,
});

// const particleMesh = new THREE.Mesh(particleGeo, particleMaterial);      //big error, if used mesh it' will create triangles (join three points)
const particleMesh = new THREE.Points(particleGeo, particleMaterial);
scene.add(particleMesh);


let audioContext;

// Button click handler
const button = document.querySelector('button');
const mainWrapper = document.getElementById('main-wrapper');

button.addEventListener('click', () => {
  // Hide the main-wrapper
  mainWrapper.style.display = 'none';
  
  // Show the IcosahedronGeometry
  cube.visible = true;
  
  // Play audio
  if (!audioContext) {
    audioContext = new (window.AudioContext)();
    sound.play();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
})

const frictions = 0.995;

function animateParticles() {
  const positions = particleGeo.attributes.position.array;    //Gets the raw Float32Array of vertex positions from the geometry’s position attribute, This array holds x, y, z coordinates for each particle, Modifying this array updates the particle positions

  for (let i = 0; i < particleCount * 3; i += 3) {
    if (bassIntensity > 0.7) {
      const x = positions[i];
      const y = positions[i + 1];
      const z = positions[i + 2];

      velocities[i] += x * 0.002;
      velocities[i + 1] += y * 0.002;
      velocities[i + 2] += z * 0.002;
    }

    velocities[i] *= frictions;
    velocities[i + 1] *= frictions;
    velocities[i + 2] *= frictions;

    positions[i] += velocities[i];
    positions[i + 1] += velocities[i + 1];
    positions[i + 2] += velocities[i + 2];

    if (Math.abs(positions[i]) > 10) velocities[i] *= -1;     //reverse, if moving left, switch them to right, and vice-versa
    if (Math.abs(positions[i + 1]) > 10) velocities[i + 1] *= -1;
    if (Math.abs(positions[i + 2]) > 10) velocities[i + 2] *= -1;

    // 3. RESET FALLEN PARTICLES
    // If they go too far, snap them back to the center surface
    // This looks like they are being "reborn" from the core
    const distanceFromCenter = Math.sqrt(positions[i] ** 2 + positions[i + 1] ** 2 + positions[i + 2] ** 2);

    if (distanceFromCenter > 20) {
      // Reset Logic
      const phi = Math.acos(-1 + (2 * Math.random()));
      const theta = Math.sqrt(particleCount * Math.PI) * phi;
      const radius = 5;

      positions[i] = radius * Math.cos(theta) * Math.sin(phi);
      positions[i + 1] = radius * Math.sin(theta) * Math.sin(phi);
      positions[i + 2] = radius * Math.cos(phi);

      // Reset velocity
      velocities[i] = 0;
      velocities[i + 1] = 0;
      velocities[i + 2] = 0;
    }
  }
  particleGeo.attributes.position.needsUpdate = true;
}


// Add lights
const ambientLight = new THREE.AmbientLight(0x4D4DFF, 0.5)
scene.add(ambientLight)

const directionalLight = new THREE.DirectionalLight(0x4D4DFF, 0.5)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// AUDIO
const listner = new THREE.AudioListener();
camera.add(listner);
const sound = new THREE.Audio(listner);

const analyzer = new THREE.AudioAnalyser(sound, 256);

const audioLoader = new THREE.AudioLoader();
audioLoader.load("audio_sample_1.mp3", (buffer) => {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.7);
})

let bassIntensity;
// Animation loop
function animate() {
  requestAnimationFrame(animate)
  bassIntensity = 0;
  // Rotate the cube
  cube.rotation.y += 0.01;
  cube.rotation.x += 0.01
  if (sound.isPlaying) {
    const data = analyzer.getFrequencyData();
    const bass = data.slice(0, 50).reduce((a, b) => a + b, 0) / 50;
    bassIntensity = bass / 255;
  }
  const pulse = 1 + bassIntensity * 1.5;
  cube.scale.set(pulse, pulse, pulse);
  material.emissiveIntensity = 0.2 + bassIntensity * 2.0;
  animateParticles();
  controls.update();
  effectComposer.render(scene, camera)
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Start animation
animate()
