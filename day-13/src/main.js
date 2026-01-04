import './style.css'
import * as THREE from 'three'
import { TTFLoader } from "three/examples/jsm/loaders/TTFLoader.js"
import { Font } from "three/examples/jsm/loaders/FontLoader.js"
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js'
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js"


// Get canvas element
const canvas = document.querySelector('#canvas')

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 5

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)


const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true
// controls.autoRotate = true     // auto rotate enabled
// controls.autoRotateSpeed = 2   // speed tweak

// State management
let isRotationEnabled = false
let isCirclesAnimationEnabled = true


// FONT
let textMesh = null
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
  const textGeo = new TextGeometry("Day 14 (three.js)", props);
  textGeo.center();
  const textMat = new THREE.MeshStandardMaterial({ color: 0xff00ee, })
  textMesh = new THREE.Mesh(textGeo, textMat);
  scene.add(textMesh);
})


// RAIN using PRATICLES
const rainGeo = new THREE.BufferGeometry();
const rainCount = 1200;

const rainPositions = new Float32Array(rainCount * 3);
for (let i = 0; i < rainCount * 3; i++) {
  rainPositions[i] = (Math.random() - 0.5) * 30;
  rainPositions[i + 1] = Math.random() * 20
  rainPositions[i + 2] = (Math.random() - 0.5) * 30
}

rainGeo.setAttribute("position", new THREE.BufferAttribute(rainPositions, 3))
const rainMat = new THREE.PointsMaterial({
  color: 0x99ccff,
  size: 0.08,
  transparent: true
})
const rain = new THREE.Points(rainGeo, rainMat);
scene.add(rain);
function animateRain() {
  // Animate Rain
  rainGeo.attributes.position.array.forEach((_, i) => {
    if (i % 3 === 1) {
      rainGeo.attributes.position.array[i] -= 0.08
      if (rainGeo.attributes.position.array[i] < -5) {
        rainGeo.attributes.position.array[i] = 10
      }
    }
  })
  rainGeo.attributes.position.needsUpdate = true;
}


// Lights
// Ambient Light - provides overall illumination
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8)
scene.add(ambientLight)

// Directional Light - simulates sunlight
const directionalLight = new THREE.DirectionalLight(0xffffff, 1)
directionalLight.position.set(5, 5, 5)
scene.add(directionalLight)

// Point Light - emits light in all directions from a point
const pointLight = new THREE.PointLight(0xff0000, 5, 100)
pointLight.position.set(-5, 2, 0)
scene.add(pointLight)

// Button controls
const enableRotationBtn = document.querySelector('#enableRotation')
const enableCirclesBtn = document.querySelector('#enableCircles')

enableRotationBtn.addEventListener('click', () => {
  // Enable rotation
  controls.autoRotate = true
  controls.autoRotateSpeed = 2
  isRotationEnabled = true

  // Disable circles animation and remove circles from scene
  isCirclesAnimationEnabled = false
  removeCircles()

  // Update button styles
  enableRotationBtn.classList.add('active')
  enableCirclesBtn.classList.remove('active')
})

enableCirclesBtn.addEventListener('click', () => {
  // Disable rotation
  controls.autoRotate = false
  isRotationEnabled = false

  // Enable circles animation and create circles
  isCirclesAnimationEnabled = true
  createCircles()

  // Reset camera and text to initial position
  camera.position.set(0, 0, 5)
  controls.target.set(0, 0, 0)
  controls.update()
  if (textMesh) textMesh.position.set(0, 0, 0)

  // Update button styles
  enableCirclesBtn.classList.add('active')
  enableRotationBtn.classList.remove('active')
})


// PULSE EFFECT BEHIDN TEXT
const circles = [];
const ringCount = 6;
const startScale = 0.8;
const endScale = 6;
const ringGrowSpeed = 0.01;

// Function to create and add circles to the scene
function createCircles() {
  for (let i = 0; i < ringCount; i++) {
    const geo = new THREE.RingGeometry(1, 1.05, 32)
    const mat = new THREE.MeshBasicMaterial({ color: 0x8800ff, side: THREE.DoubleSide, opacity: 1, transparent: true })
    const ring = new THREE.Mesh(geo, mat);
    ring.position.x = Math.PI * 0.05;
    ring.position.z = -0.5 - i * 0.25;   //new effect
    const initial = startScale + i * 0.2;
    ring.scale.set(initial, initial, initial);
    // old effect
    // ring.position.z = -  
    // //1st iamge code  (loop cause "-" means -i, that's why z = -i creates tunnel like effect)
    // ring.position.z = -1     
    //single ring cause all 20 rings are in same z index and moving all moving at same time 
    circles.push(ring);
    scene.add(ring)
  }
}

// Function to remove circles from the scene
function removeCircles() {
  circles.forEach((ring) => {
    scene.remove(ring)
    // Dispose of geometry and material to free memory
    ring.geometry.dispose()
    ring.material.dispose()
  })
  circles.length = 0 // Clear the array
}

function animateCircles() {
  circles.forEach((ring, idx) => {
    ring.scale.x += ringGrowSpeed;
    ring.scale.y += ringGrowSpeed;
    const fade = 1 - (ring.scale.x - startScale) / (endScale - startScale);
    ring.material.opacity = Math.max(0, fade);
    if (ring.scale.x > endScale) {
      ring.scale.set(startScale, startScale, startScale);
      ring.material.opacity = 1
    }
  })
}

// Initialize circles on page load
if (isCirclesAnimationEnabled) {
  createCircles()
}

// Initialize with circles animation enabled
enableCirclesBtn.classList.add('active')

// Animation loop
function animate() {
  requestAnimationFrame(animate)

  animateRain();

  // Conditionally animate circles based on state
  if (isCirclesAnimationEnabled) {
    animateCircles();
  }

  renderer.render(scene, camera)
  controls.update();
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

animate()