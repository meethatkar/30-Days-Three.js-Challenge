import './style.css'
import * as THREE from "three";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth/window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 1.5, 3);
camera.lookAt(0, 0, 0);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth,window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(1, 1, 1),
  new THREE.MeshStandardMaterial({
    metalness: 0.6,
    roughness: 0.4,
    color: 0x9be7ff,
    // wireframe: true
  })
);
scene.add(sphere);

const bg = new THREE.Mesh(
  new THREE.SphereGeometry(8, 32, 32),
  new THREE.MeshStandardMaterial({
    color: 0x111111,
    side: THREE.BackSide
  })
);
scene.add(bg);


scene.add(new THREE.AmbientLight(0xffffff, 0.5));
const dirLight = new THREE.DirectionalLight(0xfffff, 1);
dirLight.position.set(4, 8, 4);
scene.add(dirLight);

scene.fog = new THREE.Fog(0x0b0b0b, 4, 9);

// USING TIME
const clock = new THREE.Clock();

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  
  const time = clock.getElapsedTime();
  camera.position.x = Math.sin(time * 0.5) * 5;
  camera.position.z = Math.cos(time * 0.5) * 5;
  camera.position.y = 1.5;

  // dirLight.position.x = Math.sin(time) * 3;


  sphere.rotation.x += 0.003

  camera.lookAt(0, 0, 0);
}
animate();