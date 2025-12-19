import './style.css'
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RGBELoader } from "three/addons/loaders/RGBELoader.js";

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth/window.innerHeight,
  0.1,
  100
)
camera.position.set(0, 1.2, 5);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.outputColorSpace = THREE.SRGBColorSpace;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true
controls.enableZoom = false;

// HDRI ENVIRONMENT
const rgbeLoader = new RGBELoader();
rgbeLoader.load("/hdri/studio_blue.hdr",(envMap)=>{
  envMap.mapping = THREE.EquirectangularReflectionMapping
  scene.environment = envMap
  scene.background = envMap
});


// TEXTURE
const textureLoader = new THREE.TextureLoader();
const surfaceTexture = textureLoader.load("/texture/wall.jpg");
surfaceTexture.colorSpace = THREE.SRGBColorSpace;

const product = new THREE.Mesh(
  new THREE.IcosahedronGeometry(1.1, 5),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.2,
    map: surfaceTexture
  })
)
scene.add(product);

scene.add( new THREE.AmbientLight(0xffffff, 0.15))

function animate(){
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
  controls.update();
  product.rotation.x += 0.002;
  product.rotation.y += 0.003;
}
animate();