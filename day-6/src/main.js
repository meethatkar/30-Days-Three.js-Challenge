import './style.css'
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0b);

const camera = new THREE.PerspectiveCamera(
  45,   //zoomed
  window.innerWidth/window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.5, 3);
camera.lookAt(0, 0, 0);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const mesh = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x9be7ff,
    roughness: 0.5,
    metalness: 0.5
  })
);
scene.add(mesh);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
keyLight.position.set(3, 3, 2);
scene.add(keyLight);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;

function animate(){
  requestAnimationFrame(animate);
  mesh.rotation.y += 0.003;
  controls.update();
  renderer.render(scene, camera);
}
animate();