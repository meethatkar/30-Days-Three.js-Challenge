import './style.css';
import * as THREE from 'three';
import vertex from "./vertex.glsl?raw";
import fragment from "./fragments.glsl?raw";

// Get the canvas element
const canvas = document.getElementById('canvas')

// Create scene
const scene = new THREE.Scene()

window.addEventListener("mousemove", (e)=>{
  material.uniforms.xVal.value =e.clientX/window.innerWidth;
  material.uniforms.yVal.value =e.clientY/window.innerHeight;
});

// Create camera
const camera = new THREE.PerspectiveCamera(
  75, // Field of view
  window.innerWidth / window.innerHeight, // Aspect ratio
  0.1, // Near clipping plane
  1000 // Far clipping plane
)
camera.position.z = 5

// Create renderer
const renderer = new THREE.WebGLRenderer({ canvas: canvas })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(window.devicePixelRatio)

// Create a cube
const geometry = new THREE.PlaneGeometry(2, 2, 1)
const material = new THREE.ShaderMaterial({ 
  vertexShader: vertex,
  fragmentShader: fragment,
  side: THREE.DoubleSide,
  uniforms:{
    xVal: {value: 0},
    yVal: {value: 0}
  }
 })
 material.needsUpdate = true;
const cube = new THREE.Mesh(geometry, material)
scene.add(cube)

// Animation loop
function animate() {
  requestAnimationFrame(animate)
  // Render the scene
  renderer.render(scene, camera)
}

// Handle window resize
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})

// Start animation
animate()