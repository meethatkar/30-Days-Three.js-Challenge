import './style.css'
import * as THREE from "three";
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; //imported for project

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
// camera.position.set(0, 2, 5);    //WAS FOR LEARNING PURPOSE CODE
camera.position.set(0, 1.2, 4);     //gives premium feel
camera.lookAt(0, 0, 0);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));

// LEARNING CODE
// const geometry = new THREE.SphereGeometry(1, 32, 32);

// const material = new THREE.MeshStandardMaterial({
//   color: 0x00ffcc,
//   roughness: 0.3,
//   metalness: 0.7,
//   wireframe: true
// })

// // const material = new THREE.MeshBasicMaterial({
// //   color: 0x00ffcc,
// //   wireframe: true
// // })

// const sphere = new THREE.Mesh(geometry, material);
// scene.add(sphere);

// // scene.add(new THREE.AmbientLight(0xffffff, 0.4));

// const dirLight = new THREE.DirectionalLight(0xffffff, 1);
// dirLight.position.set(3, 5, 2);
// // scene.add(dirLight);

// function animate(){
//   requestAnimationFrame(animate);
//   sphere.rotation.y += 0.02;
//   renderer.render(scene, camera);
// }

// animate();

// LEVEL 1 PROJECT
const geometry =  new THREE.IcosahedronGeometry();
const material = new THREE.MeshStandardMaterial({
  color: 0x9be7ff,
  roughness: 0.25,
  metalness: 0.85
})
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// LIGHTING (TRIO EFFFECT)
const dirLight_1 = new THREE.DirectionalLight(0xffffff, 1.2);
dirLight_1.position.set(3, 5, 2);
const dirLight_2 = new THREE.DirectionalLight(0xffffff, 0.4);
dirLight_2.position.set(-3, 2, 1);
const ambientLight = new THREE.AmbientLight(0xffffff, 0.25);

scene.add(dirLight_1);
scene.add(dirLight_2);
scene.add(ambientLight);

const controls = new OrbitControls( camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.maxPolarAngle = Math.PI / 2;
controls.minPolarAngle = Math.PI / 2.5;

scene.fog = new THREE.Fog(0x0b0b0b, 4, 10);

function animate(){
  requestAnimationFrame(animate);
  mesh.rotation.x += 0.001;
  mesh.rotation.y += 0.003;
  renderer.render(scene, camera);
  controls.update();
}

animate();