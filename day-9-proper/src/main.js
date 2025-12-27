import './style.css'
import * as THREE from "three";
import gsap from "gsap";

// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x111111);

// Camera
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  100
);
camera.position.z = 6;

// Renderer
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Lights
scene.add(new THREE.AmbientLight(0xffffff, 0.4));
const plLight = new THREE.PointLight(0xffffff, 0.9);
scene.add(plLight);

// Create multiple mesh "particles"
const objects = [];
const count = 250;   // using 250 for perf + clarity

for (let i = 0; i < count; i++) {
  const geo = new THREE.SphereGeometry(0.08, 8, 8);
  const mat = new THREE.MeshStandardMaterial({
    color: 0xfffff,
    roughness: 0.4,
    metalness: 0.6,
    emissive: 0x000000
  });

  const s = new THREE.Mesh(geo, mat);
  s.position.set(
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10,
    (Math.random() - 0.5) * 10
  );

  scene.add(s);
  objects.push(s);
}

// Raycast setup
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener("pointermove", (e) => {
  mouse.x = (e.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -(e.clientY / window.innerHeight) * 2 + 1;
});

// Hover & click behavior
let currentObj = null;

window.addEventListener("click", () => {
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects);

  if (hits.length > 0) {
    const obj = hits[0].object;
    gsap.to(obj.scale, {
      x: 2, y: 2, z: 2,
      duration: 0.6,
      ease: "elastic.out(1, 0.4)"
    });
  }
});

// Animate
const clock = new THREE.Clock();

function animate() {
  const t = clock.getElapsedTime();

  // Raycast each frame
  raycaster.setFromCamera(mouse, camera);
  const hits = raycaster.intersectObjects(objects);

  if (hits.length > 0) {
    const obj = hits[0].object;

    if (currentObj !== obj) {
      if (currentObj) {
        gsap.to(currentObj.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
        currentObj.material.color.set(0xfffff);
      }
      obj.material.color.set(0xffffff);
      gsap.to(obj.scale, { x: 1.4, y: 1.4, z: 1.4, duration: 0.3 });
      currentObj = obj;

      gsap.to(plLight, { intensity: 2, duration: 0.4, yoyo: true, repeat: 1 });
    }
  } else {
    if (currentObj) {
      gsap.to(currentObj.scale, { x: 1, y: 1, z: 1, duration: 0.3 });
      currentObj.material.color.set(0xfffff);
    }
    currentObj = null;
  }

  // Rotate entire field
  scene.rotation.y = t * 0.08;

  renderer.render(scene, camera);
  requestAnimationFrame(animate);
}

animate();

// Responsive resize
window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});
