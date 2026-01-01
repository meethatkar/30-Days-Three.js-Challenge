import './style.css';
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b0b0e);

// scene.fog = new THREE.Fog(0x0b0b0e, 2, 15);
scene.fog = new THREE.FogExp2(0x0b0b0e, 0.08);

const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.set(0, 2, 6);

const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

const controls = new OrbitControls(camera, renderer.domElement);

const light = new THREE.PointLight(0xffd36b, 25, 30);
light.position.set(0, 5, 5);
scene.add(light);
scene.add(new THREE.AmbientLight(0x222222));

const geo = new THREE.IcosahedronGeometry(1, 1);
const mat = new THREE.MeshStandardMaterial({ color: 0x3399ff, roughness: 0.4});
const core = new THREE.Mesh(geo, mat);
scene.add(core);

const mistTex = new THREE.TextureLoader().load("/fog1.png");
mistTex.wrapS = mistTex.wrapT = THREE.ClampToEdgeWrapping;

const mistMat = new THREE.MeshBasicMaterial({
  map: mistTex,
  transparent: true,
  opacity: 0.5, 
  depthWrite: false,
  blending: THREE.AdditiveBlending,
  color: 0x5577bb
})

const mistPlan = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20),
  mistMat
);
mistPlan.position.set(0, 0, 5);
mistPlan.rotation.x = -Math.PI / 2.2;
scene.add(mistPlan);

for(let i=0; i<4; i++){
  const p = mistPlan.clone();
  p.position.z -= i*3;
  p.material.opacity = 0.3 - i * 0.04;
  scene.add(p);
}

function animate(){
  requestAnimationFrame(animate);

  core.rotation.y += 0.005;
  core.rotation.x += 0.002;

  scene.children.forEach((obj)=>{
    if(obj.material?.map === mistTex ){
      obj.position.x = Math.sin(Date.now() * 0.00015) * 1.5;
    }
  })
  controls.update();
  renderer.render(scene, camera);
};

animate();