import './style.css'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
import * as THREE from 'three'
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x050510);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth/window.innerHeight,
  0.1,
  100
)
camera.position.set(0, 2.5, 6);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({antialias: true, canvas});
renderer.setSize(window.innerWidth, window.innerHeight);

new OrbitControls(camera, renderer.domElement);

const neonBlue = 0x00a2ff

const neonMat = new THREE.MeshBasicMaterial({
  color: neonBlue,
  wireframe: true
})

const pyrGeo = new THREE.ConeGeometry(2, 3, 4)
const pyramid = new THREE.Mesh(pyrGeo, neonMat)
pyramid.position.y = -0.5
scene.add(pyramid)


// ----------------------------------
//  grid
// ----------------------------------
const grid = new THREE.GridHelper(50, 100, neonBlue, neonBlue)
grid.position.y = -2
scene.add(grid)


// ----------------------------------
//  BLOOM MAGIC ✨
// ----------------------------------
const renderScene = new RenderPass(scene, camera)

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.4,    // strength
  0.4,    // radius
  0.0     // threshold
)

const composer = new EffectComposer(renderer)
composer.addPass(renderScene)
composer.addPass(bloomPass)


// ----------------------------------
//  animate
// ----------------------------------
function animate() {
  requestAnimationFrame(animate)

  pyramid.rotation.y += 0.01
  pyramid.rotation.x = Math.sin(performance.now() * 0.0002) * 0.3

  composer.render()
}

animate()


// ----------------------------------
//  responsive
// ----------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
  composer.setSize(window.innerWidth, window.innerHeight)
})