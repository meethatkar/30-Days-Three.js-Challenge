import './style.css'
import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js"
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js"


const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0b);

const camera = new THREE.PerspectiveCamera(
  45,
  window.innerWidth/window.innerHeight,
  0.1,
  500
)
camera.position.set(2, 1, 4);
camera.lookAt(0, 0, 0);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({canvas});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const controls = new OrbitControls(camera, renderer.domElement);
controls.update();

const cyan = 0x00FEFC ;
const magenta = 0xEA00FF ;
const plane = new THREE.GridHelper(100, 100, magenta, 0xffffff );
plane.position.set(0, -2, 0);
scene.add(plane);

const geoArr = [];
for(let i=0; i<25; i++){
  const geo = new THREE.BoxGeometry(0.5, 2, 1);
  const mat = new THREE.MeshBasicMaterial({color: cyan});
  const box = new THREE.Mesh(geo, mat);
  box.position.set( i%2==0 ? i*2 : -i*2, 0, Math.random()*10 );
  scene.add(box);
  geoArr.push(box);
}

// //NEW LOGIC
const renderPass = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.5,
  0.1,
  0.8
)   
const compose = new EffectComposer(renderer);
compose.addPass(renderPass);
compose.addPass(bloomPass);

function animate(){
  requestAnimationFrame(animate);
  compose.render(scene, camera);      //NEW LOGIC
  plane.rotation.y += 0.001;
  geoArr.forEach((g)=>{   ////NEW LOGIC
    g.rotation.x += 0.02;
  })
  controls.update();
}
animate();