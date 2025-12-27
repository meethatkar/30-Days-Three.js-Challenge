import './style.css'
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { HDRLoader } from "three/addons/loaders/HDRLoader.js";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0b);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth/window.innerHeight,
  0.1, 
  100
);
camera.position.set(0, 1.5, 4);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({canvas, antialias:true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 0.5;

new HDRLoader().load("/hdri/pink_sky.hdr",(hdr)=>{
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = hdr;
});

const core = new THREE.Mesh(
  new THREE.SphereGeometry(0.8, 40, 40),
  new THREE.MeshStandardMaterial({
    color: 0x9be7ff,
    metalness: 1,
    roughness: 0.05
  })
);
scene.add(core);

const glass = new THREE.Mesh(
  new THREE.SphereGeometry(1, 40, 40),
  new THREE.MeshPhysicalMaterial({
    transmission: 1,
    thickness: 0.6,
    roughness: 0,
    metalness: 0,
    ior: 1.5,
    envMapIntensity: 1.5
  })
)
scene.add(glass);

scene.add(new THREE.AmbientLight(0xffffff, 0.3));

const rim = new THREE.DirectionalLight(0xffffff, 1);
rim.position.set(3, 3, 3);
scene.add(rim);

const controls = new OrbitControls(camera, renderer.domElement)
controls.enableDamping = true;
controls.enableZoom = false;
controls.enablePan = false;

const clock = new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);

  const t = clock.getElapsedTime();
  core.rotation.y += t*0.09
  glass.rotation.y += t*0.05

  core.position.y = Math.sin(t) * 0.1
  glass.position.y = Math.sin(t) * 0.1

  camera.position.x = Math.cos(t * 0.3) * 4;
  camera.position.x = Math.sin(t * 0.3) * 4;
  camera.lookAt(0, 0, 0);

  controls.update();
  renderer.render(scene, camera);
};
animate();