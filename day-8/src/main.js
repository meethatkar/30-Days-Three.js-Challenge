import './style.css'
import * as THREE from 'three'

// Scene
const scene = new THREE.Scene()

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 5;

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove",(e)=>{
  mouse.x = (e.clientX / window.innerWidth) * 2 -1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 +1;
});

const objects = [];
for (let i=0 ;i<5; i++){
  const mesh = new THREE.Mesh(
    new THREE.SphereGeometry(0.5, 32, 32),
    new THREE.MeshStandardMaterial({
      color: 0x5555ff,
      metalness: 0.6,
      roughness: 0.3
    })
  );

  mesh.position.x = (i-2) * 1.5;
  scene.add(mesh);
  objects.push(mesh);
}

// Renderer
const canvas = document.querySelector('#canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)

// Animation function
function animate() {
  requestAnimationFrame(animate);

  raycaster.setFromCamera(mouse, camera);
  const intesects = raycaster.intersectObjects(objects);

  objects.forEach(obj => {
    obj.material.emissive.set(0x111111);
  });

  if(intesects.length > 0){
  intesects[0].object.material.emissive.set(0x2222ff);
  }
  
  renderer.render(scene, camera)
}

animate()