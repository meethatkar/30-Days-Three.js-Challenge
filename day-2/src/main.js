import './style.css'
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  60, 
  window.innerWidth / window.innerHeight,
  0.1, 
  100
)
camera.position.set(0, 2, 6)

const canvas = document.querySelector("#canvas"); //withous passing this will also run the code, but three.js will do gloable DOM binding, it'll  refer to already  created canvas, but it's good practice to store it in variable and then pass that variable
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

const material = new THREE.MeshNormalMaterial({ wireframe: true });

const box =new THREE.Mesh(
  // changing last 3 value will increase or decrease segments, making it sharper or smooth
  new THREE.BoxGeometry(1, 1, 1, 1, 1, ),
  material
)
box.position.x = -2
scene.add(box);

const sphere = new THREE.Mesh(
  // changing last 2 value will increase or decrease segments, making it sharper or smooth
  new THREE.SphereGeometry(0.8, 10, 10),
  material
)
sphere.position.x = 0;
scene.add(sphere);

const torus = new THREE.Mesh(
  // changing last 2 value will increase or decrease segments, making it sharper or smooth
  new THREE.TorusGeometry(0.6, 0.25, 10, 10),
  material
)
torus.position.x = 2;
scene.add(torus);

window.addEventListener("resize",()=>{
  camera.aspect=window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);

})

function animate(){
  requestAnimationFrame(animate);

  box.rotation.y += 0.01
  sphere.rotation.y += 0.01
  torus.rotation.y += 0.01

  controls.update()
  renderer.render(scene, camera);
}

animate();