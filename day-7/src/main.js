import './style.css'
import * as THREE from "three";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";


const scene = new THREE.Scene();

const camera =  new THREE.PerspectiveCamera(
  60, 
  window.innerWidth/window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.5, 4);
camera.lookAt(0, 0, 0);

new HDRLoader().load("/hdri/studio.hdr", (envMap)=>{
  envMap.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = envMap;
  scene.background = envMap;
});

const textureLoader = new THREE.TextureLoader();
const colorMap = textureLoader.load("/textures/wall.png");

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.7;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;    //smooth rotation/movement

const material = new THREE.MeshStandardMaterial({
  map: colorMap,
  metalness: 0.5,
  roughness: 0.2
});

const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 32, 32),
  material
);

scene.add(sphere);

const clock = new THREE.Clock();

function animate(){
  const time = clock.getElapsedTime();
  requestAnimationFrame(animate);
  sphere.rotation.y = time*0.1;
  // camera.position.z = Math.sin(time * 0.3) * 2;
  // camera.position.x = Math.cos(time * 0.3) * 2;
  // camera.position.y = 1.5;
  renderer.render(scene, camera);
  controls.update();
}
animate();