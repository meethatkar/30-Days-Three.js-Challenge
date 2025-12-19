import './style.css';
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0b);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth/window.innerHeight,
  0.1,
  100
)
camera.position.set(0, 1.5, 4);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const control = new OrbitControls(camera, renderer.domElement);
control.enableDamping = true;

//HDRI
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/hdri/ground.hdr", (envMap)=>{
  envMap.mapping = THREE.EquirectangularReflectionMapping;

  scene.environment = envMap;
  scene.background = envMap;
})

// TEXTURE
const textureLoader = new THREE.TextureLoader();
const woodTexture = textureLoader.load('/texture/wood.jpg');

const cube = new THREE.Mesh(
  new THREE.SphereGeometry(1, 10, 10),
  new THREE.MeshStandardMaterial({
    map: woodTexture,
    roughness: 1,
    metalness: 1
  })
);
scene.add(cube);

// scene.add(new THREE.AmbientLight(0xffffff, 0.1));

const dirLight = new THREE.DirectionalLight(0x895129, 0.4);
dirLight.position.set(3, 4, 2);
// scene.add(dirLight);

function animate(){
  requestAnimationFrame(animate);
  control.update();
  renderer.render(scene, camera);
  cube.rotation.y += 0.01;
  cube.rotation.x += 0.01;
}
animate();