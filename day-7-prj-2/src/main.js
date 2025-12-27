import './style.css'
import * as THREE from "three";
import gsap from "gsap";
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js';


const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 0, 6);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.outputColorSpace = THREE.SRGBColorSpace;
renderer.toneMapping = THREE.ACESFilmicToneMapping;   //adjust light birghtness naturally
renderer.toneMappingExposure = 0.5;

new RGBELoader().load("/hdri/pink_sky.hdr",(hdr)=>{
  hdr.mapping = THREE.EquirectangularReflectionMapping;
  scene.environment = hdr;
  scene.background = hdr
});

const geometry = new THREE.SphereGeometry(1, 64, 64);
const material = new THREE.MeshStandardMaterial({
  color: 0x9be7ff,
  roughness: 0.1,
  metalness: 0.9,
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

const keyLight = new THREE.DirectionalLight(0xffffff, 2);
keyLight.position.set(3, 2, 4);

const rimLight = new THREE.DirectionalLight(0x88ccff, 1.5);
rimLight.position.set(-4, 1, -2);

scene.add(keyLight, rimLight);

const tl = gsap.timeline({defaults: { ease: "power3.out"}});

tl.fromTo(
  camera.position,
  {z : 10 },
  { z: 6, duration: 2 }
)
.fromTo(
  keyLight.position,
  { x: -6 },
  { x: 3, duration: 2},
  "-=1.5"
)
.fromTo(
  mesh.rotation,
  { y: -Math.PI },
  { y: 0, duration: 2},
  "-=1.2"
);

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
};
animate();