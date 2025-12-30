import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

// ----------------------------------
//  basic scene setup
// ----------------------------------
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x050510) // near-black purple

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.set(0, 2.5, 6)
camera.lookAt(0, 0, 0)

const renderer = new THREE.WebGLRenderer({ antialias: true })
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true


// ----------------------------------
//  glowing wireframe material
// ----------------------------------
const neonBlue = 0x00a2ff
const material = new THREE.MeshBasicMaterial({
  color: neonBlue,
  wireframe: true
})


// ----------------------------------
//  pyramid geometry (four sides)
// ----------------------------------
const pyramidGeo = new THREE.ConeGeometry(
  2,      // radius
  3,      // height
  4       // segments → 4 sides = pyramid
)
const pyramid = new THREE.Mesh(pyramidGeo, material)
pyramid.position.y = -0.5
scene.add(pyramid)


// ----------------------------------
//  glowing grid plane
// ----------------------------------
const gridHelper = new THREE.GridHelper(50, 100, neonBlue, neonBlue)
gridHelper.position.y = -2
scene.add(gridHelper)


// ----------------------------------
//  animate
// ----------------------------------
function animate() {
  requestAnimationFrame(animate)

  pyramid.rotation.y += 0.01
  pyramid.rotation.x = Math.sin(performance.now() * 0.0002) * 0.3

  controls.update()
  renderer.render(scene, camera)
}

animate()


// ----------------------------------
//  responsive resize
// ----------------------------------
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})
