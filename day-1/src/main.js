import './style.css'
import * as THREE from "three"
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const scene = new THREE.Scene();

// scene.background = new THREE.Color("blue")

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
)
camera.position.z = 3;

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth,  window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

const geometry = new THREE.BoxGeometry(1, 1, 1);
const materail = new THREE.MeshBasicMaterial({color: 0x00ff99 });
const cube = new THREE.Mesh(geometry, materail);

cube.position.set(0, 0, 0);
scene.add(cube);

function animate(){
  requestAnimationFrame(animate);
  cube.rotation.z += 0.01;
  renderer.render(scene, camera);
}

animate();
