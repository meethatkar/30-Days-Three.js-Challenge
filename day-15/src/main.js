import { TTFLoader } from 'three/examples/jsm/loaders/TTFLoader.js';
import './style.css'
import * as THREE from "three";
import { Font } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';

// Create a scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("#0a0e27")

// Create a camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
camera.position.z = 5;

// Create a renderer and append to the canvas
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector('#canvas'),
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// TEXT
let textMesh = null;
const loader = new TTFLoader();
loader.load("/fonts/third.ttf", (font) => {
  const fontVar = new Font(font);
  const props = {
    font: fontVar,
    size: 1,
    depth: 0.1,
    curveSegments: 6,
    bevelEnabled: true,
    bevelThickness: 0.08,
    bevelSize: 0.01,
    bevelOffset: 0,
    bevelSegments: 2
  }
  const textGeo = new TextGeometry("AUDIO REACTIVE", props);
  const textMat = new THREE.MeshStandardMaterial({ 
    color: 0x00ffff,
    metalness: 0.8,
    roughness: 0.2,
    emissive: 0x00aaff,
    emissiveIntensity: 0.3
  });
  textGeo.center();
  textMesh = new THREE.Mesh(textGeo, textMat);
  scene.add(textMesh);
})

// PARTICLES
const particleCount = 2000;
const positions = new Float32Array(particleCount * 3);
const velocities = new Float32Array(particleCount * 3);

// Initialize particle positions and velocities
for (let i = 0; i < particleCount * 3; i += 3) {
  positions[i] = (Math.random() - 0.5) * 20;     // x
  positions[i + 1] = (Math.random() - 0.5) * 20;  // y
  positions[i + 2] = (Math.random() - 0.5) * 20;  // z
  
  velocities[i] = (Math.random() - 0.5) * 0.02;     // vx
  velocities[i + 1] = (Math.random() - 0.5) * 0.02; // vy
  velocities[i + 2] = (Math.random() - 0.5) * 0.02; // vz
}

const particleGeometry = new THREE.BufferGeometry();
particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

const particleMaterial = new THREE.PointsMaterial({
  color: 0x00d4ff,
  size: 0.06,
  transparent: true,
  opacity: 0.9,
  blending: THREE.AdditiveBlending
});

const particles = new THREE.Points(particleGeometry, particleMaterial);
scene.add(particles);

// LIGHTS
const ambientLight = new THREE.AmbientLight(0x001122, 0.3);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x00aaff, 0.8);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

const pointLight1 = new THREE.PointLight(0x00ffff, 1, 50);
pointLight1.position.set(-5, 3, 0);
scene.add(pointLight1);

const pointLight2 = new THREE.PointLight(0xff00ff, 0.8, 50);
pointLight2.position.set(5, -3, 0);
scene.add(pointLight2);

// CIRCLES
const circles = [];
const ringCount = 6;
const startScale = 0.8;
const endScale = 6;
const ringGrowSpeed = 0.01;
for (let i = 0; i < ringCount; i++) {
  const geo = new THREE.RingGeometry(1, 1.05, 32);
  const hue = (i / ringCount) * 0.3 + 0.7; // Purple to pink gradient
  const color = new THREE.Color().setHSL(hue, 0.9, 0.6);
  const mat = new THREE.MeshBasicMaterial({ 
    color: color,
    side: THREE.DoubleSide, 
    opacity: 1, 
    transparent: true 
  })
  const ring = new THREE.Mesh(geo, mat);
  // ring.position.x = Math.PI * 0.05;
  // ring.position.z = -0.5 - i * 0.25;
  // const initial = startScale + i * 0.2;
  // ring.scale.set(initial, initial, initial);
  circles.push(ring);
  scene.add(ring)
}

let audioContext;

window.addEventListener("click", () => {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
    sound.play();
  }

  if (audioContext.state === "suspended") {
    audioContext.resume();
  }

  pTag.remove();
});


const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);
const audioLoader = new THREE.AudioLoader();
audioLoader.load("audio/DJ_snake.mp3", (buffer) => {
  sound.setBuffer(buffer);
  sound.setLoop(true);
  sound.setVolume(0.7);
});

const analyzer = new THREE.AudioAnalyser(sound, 256);

function getBeat() {
  const data = analyzer.getFrequencyData();
  const avg = data.reduce((a, b) => a + b, 0) / data.length;
  return avg / 200;
}

// A factor between 0 and 1.
// 0.98 is a good balance for "space" physics.
const friction = 0.991; 

function animateParticles() {
  const positions = particleGeometry.attributes.position.array;
  
  for (let i = 0; i < particleCount * 3; i += 3) {
    
    // --- FRICTION LOGIC START ---
    // Slowly reduce velocity every frame so they don't accelerate forever
    velocities[i] *= friction;
    velocities[i + 1] *= friction;
    velocities[i + 2] *= friction;
    // --- FRICTION LOGIC END ---

    // Update positions
    positions[i] += velocities[i];
    positions[i + 1] += velocities[i + 1];
    positions[i + 2] += velocities[i + 2];
    
    // Boundary check and wrap around (Bounce effect)
    if (Math.abs(positions[i]) > 10) velocities[i] *= -1;
    if (Math.abs(positions[i + 1]) > 10) velocities[i + 1] *= -1;
    if (Math.abs(positions[i + 2]) > 10) velocities[i + 2] *= -1;
  }
  
  particleGeometry.attributes.position.needsUpdate = true;
}

function audioReactivePulse() {
  const beat = getBeat();

  circles.forEach((ring, index) => {
    const currentScale = 0.8 + beat * 0.8 + (index * 0.15);
    ring.scale.set(currentScale, currentScale, currentScale);

    // opacity fades based on scale
    ring.material.opacity = 1 - (currentScale * 0.15);
  });

  if (textMesh) {
    textMesh.position.y = beat * 0.3;
  }
  
  // Audio reactive particle scaling
  if (audioContext && audioContext.state === 'running') {
    const data = analyzer.getFrequencyData();
    const bass = data.slice(0, 20).reduce((a, b) => a + b, 0) / 20;
    const intensity = bass / 255;
    const scaleFactor = 0 + intensity * 0.9; // Scale from 1.0 to 1.3 based on beat
    particleMaterial.size = 0.06 * scaleFactor;
  } else {
    particleMaterial.size = 0.06; // Default size when no audio
  }
}

// Cursor following text
const pTag = document.querySelector('p');
let mouseX = 0;
let mouseY = 0;
let currentX = 0;
let currentY = 0;

window.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;
});

function updateTextPosition() {
  // Smooth interpolation for smooth following
  currentX += (mouseX - currentX) * 0.1;
  currentY += (mouseY - currentY) * 0.1;
  
  // Update p tag position
  pTag.style.left = currentX + 'px';
  pTag.style.top = currentY + 'px';
  
  requestAnimationFrame(updateTextPosition);
}

updateTextPosition();

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  animateParticles();
  audioReactivePulse();
  renderer.render(scene, camera);
}
animate();