import './style.css'
import * as THREE from "three";
import vertex from "./vertex.glsl?raw";
import fragment from "./fragment.glsl?raw";

const canvas = document.getElementById('canvas')

const scene = new THREE.Scene()

const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
})
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const geometry = new THREE.PlaneGeometry(2, 2, 128, 128)

const material = new THREE.ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms: {
    uTime: {value: 0},
    uMouse: {value: new THREE.Vector2(0.5, 0.5)}
  }
})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

window.addEventListener("mousemove",(e)=>{
  material.uniforms.uMouse.value.x = e.clientX / window.innerWidth;
  material.uniforms.uMouse.value.y = 1.0 - e.clientY / window.innerHeight;
})

const clock = new THREE.Clock();

function animate(){
  material.uniforms.uTime.value = clock.getElapsedTime();
  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}
animate();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight
  camera.updateProjectionMatrix()
  renderer.setSize(window.innerWidth, window.innerHeight)
})