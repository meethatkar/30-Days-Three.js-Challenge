import './style.css'
import * as THREE from "three"
import { gsap } from 'gsap'
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js"
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js"

// Get canvas element
const canvas = document.querySelector('#canvas')

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color("#020202")

// Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight
}

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
)
camera.position.z = 3
scene.add(camera)

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: canvas
})
renderer.setSize(sizes.width, sizes.height)

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4))

const dirLight = new THREE.DirectionalLight(0xffffff, 4.2)
dirLight.position.set(2, 2, 2)
scene.add(dirLight)

const backLight = new THREE.PointLight(0x6ef7d8, 2, 40)
backLight.position.set(-3, -2, -4)
scene.add(backLight)

const mainLight = new THREE.PointLight(0x2c7a67, 3.3, 40)
mainLight.position.set(3, 4, 6)
scene.add(mainLight)

// PARTICLES
const particalesCount = 900
const positions = new Float32Array(particalesCount * 3)

for (let i = 0; i < particalesCount * 3; i++) {
  positions[i] = (Math.random() - 0.5) * 30 // -15 to 15
}

const particaleGeo = new THREE.BufferGeometry()
particaleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3))

const particaleMat = new THREE.PointsMaterial({
  color: 0x44ff88,
  size: 0.055,
  transparent: true,
  opacity: 0.9
})

const stars = new THREE.Points(particaleGeo, particaleMat)
scene.add(stars)

// MOUSE PARALLAX
const mouse = {
  x: 0,
  y: 0
}

window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth - 0.5) * 2
  mouse.y = -(e.clientY / window.innerHeight + 0.5) * 2
})

// 3D TEXT
let textMesh
const loader = new FontLoader()

loader.load("/fonts/droid_sans_regular.typeface.json", (font) => {
  const textGeo = new TextGeometry("DAY 13", {
    font: font,
    size: 0.5,
    depth: 0.1,
    curveSegments: 18,
    bevelEnabled: true,
    bevelSize: 0.03,
    bevelThickness: 0.12,
    bevelSegments: 6,
  })

  const textMat = new THREE.MeshStandardMaterial({
    color: 0x24ffe6,
    metalness: 0.45,
    roughness: 0.25,
  })

  textMesh = new THREE.Mesh(textGeo, textMat)
  textGeo.center()
  textMesh.position.z = 1
  textMesh.rotation.x = 6.8
  scene.add(textMesh)
})

// Handle window resize
window.addEventListener('resize', () => {
  // Update sizes
  sizes.width = window.innerWidth
  sizes.height = window.innerHeight

  // Update camera
  camera.aspect = sizes.width / sizes.height
  camera.updateProjectionMatrix()

  // Update renderer
  renderer.setSize(sizes.width, sizes.height)
})

const clock = new THREE.Clock()

// Animation loop
const animate = () => {
  const t = clock.getElapsedTime()

  // PARALLAX EFFECT
  camera.position.x += (mouse.x * 1.3 - camera.position.x) * 0.15
  camera.position.y += (mouse.y * 1.2 - camera.position.y) * 0.15
  camera.lookAt(0, 0, 0)

  if (textMesh) {
    textMesh.rotation.y = Math.sin(t * 0.8) * 0.15
  }

  stars.rotation.y = t * 0.085
  stars.position.z = Math.sin(t * 0.2) * 0.8

  renderer.render(scene, camera)
  requestAnimationFrame(animate)
}

animate()
