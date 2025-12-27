import './style.css'
import * as THREE from 'three'
import gsap from "gsap";

// Scene
const scene = new THREE.Scene()
scene.background = new THREE.Color(0x0b0b0b);

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
)
camera.position.z = 6

// Renderer
const canvas = document.querySelector('#canvas')
const renderer = new THREE.WebGLRenderer({ canvas })
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

scene.add(new THREE.AmbientLight(0xffffff, 0.4));

const dirLight = new THREE.DirectionalLight(0xfffff, 1);
dirLight.position.set(3, 5, 2)
scene.add(dirLight);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("mousemove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;   //inverted so up 0,5 down 0 -5 for y
})

const objects = []; //raycaster works only on list
const geometry = new THREE.SphereGeometry(0.5, 32, 32);

for (let i = 0; i < 5; i++) {
  const material = new THREE.MeshStandardMaterial({
    color: 0x4f8cff,
    metalness: 0.7,
    roughness: 0.3,
    emissive: new THREE.Color(0x000000)
  });

  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.x = (i - 2) * 1.6;
  scene.add(sphere);
  objects.push(sphere);
}

window.addEventListener("click",(e)=>{
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects);

  if(hits.length > 0){
    gsap.to(hits[0].object.position,{
      z: 1,
      duration: 0.6,
      ease: "power3.out"
    })
  }
})

// Animation function
function animate() {
  requestAnimationFrame(animate)

  raycaster.setFromCamera(mouse, camera);
  const intesects = raycaster.intersectObjects(objects)

  objects.forEach(obj=>{
    gsap.to(obj.scale, {x: 1, y:1, z:1, duration: 0.3})
    obj.material.emissive.set(0x000000)
  });

  if(intesects.length > 0){
    const hovered = intesects[0].object

    gsap.to(hovered.scale,{
      x: 1.3,
      y:1.3,
      z:1.3,
      duration: 0.3
    })

    hovered.material.emissive.set(0x2233ff)
  }

  renderer.render(scene, camera)
}

animate()
