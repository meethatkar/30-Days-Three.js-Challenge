import './style.css'
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0b);

const camera = new THREE.PerspectiveCamera(
  60, 
  window.innerWidth/window.innerHeight,
  0.1,
  100
);
camera.position.set(3, 3, 6);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// NEW
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(1, 64, 64),
//   new THREE.MeshStandardMaterial({
//     color: 0x00ffd5,
//     roughness: 0.3,
//     metalness: 0.6
//   })
// )
// sphere.castShadow = true;
// scene.add(sphere);

// const ground = new THREE.Mesh(
//   new THREE.PlaneGeometry(10, 10),
//   new THREE.MeshStandardMaterial({
//     color: 0x111111,
//     roughness: 0.9
//   })
// )
// ground.rotation.x = -Math.PI / 2;
// ground.position.y = -1.2;
// ground.receiveShadow = true;
// scene.add(ground);

// const amLight = new THREE.AmbientLight(0xffffff, 0.3);
// scene.add(amLight);

// const dirLight = new THREE.DirectionalLight(0xffffff, 1.2);
// dirLight.position.set(4, 6, 2);
// dirLight.castShadow = true;

// dirLight.shadow.mapSize.width = 1024
// dirLight.shadow.mapSize.height = 1024
// dirLight.shadow.camera.near = 1
// dirLight.shadow.camera.far = 15

// scene.add(dirLight);

// function animate(){
//   requestAnimationFrame(animate);
//   sphere.rotation.y += 0.01;
//   controls.update()
//   renderer.render(scene, camera)
// }

// animate();

// PROJECT
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 64, 64),
  new THREE.MeshStandardMaterial({
    roughness: 0.35,
    metalness: 0.35
  })
);
sphere.castShadow = true;   //new
scene.add(sphere);

const ambLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambLight);

const dirLight = new THREE.DirectionalLight(0xffffff, 1.3);
dirLight.position.set(6, 4, 2);   //x, y, z points
dirLight.shadow.mapSize.width = 1024,
dirLight.shadow.mapSize.height = 1024,
dirLight.shadow.camera.far = 15;
dirLight.shadow.camera.near = 1
dirLight.castShadow = true;   //new
scene.add(dirLight);

const ground = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0x222222,
    roughness: 0.9
  })
)
ground.receiveShadow = true;    //new
ground.position.y = -1.2;
ground.rotation.x = -Math.PI/2;   //90 deg rotation
scene.add(ground);
renderer.render(scene, camera);

function animate(){
  requestAnimationFrame(animate);
  ground.rotation.z += 0.001;
  renderer.render(scene, camera);
  controls.update();
}

animate();