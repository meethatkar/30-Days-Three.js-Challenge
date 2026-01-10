import './style.css'
import * as THREE from 'three';
import vertex from "./vertex.glsl?raw";
import fragment from "./fragment.glsl?raw";

// 1. CREATE THE SCENE (The World)
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x202020); // Optional: Dark grey background

// 2. CREATE THE CAMERA (The Eyes)
const camera = new THREE.PerspectiveCamera(
    75,                                     // Field of View (FOV)
    window.innerWidth / window.innerHeight, // Aspect Ratio
    0.1,                                    // Near Clipping Plane
    1000                                    // Far Clipping Plane
);
camera.position.z = 5; // Move camera back so we can see the center

// 3. CREATE THE RENDERER (The Painter)
const canvas = document.querySelector("#canvas");
const renderer = new THREE.WebGLRenderer({ antialias: true, canvas });
renderer.setSize(window.innerWidth, window.innerHeight);

// 4. ADD AN OBJECT
const geometry = new THREE.BoxGeometry(2, 2, 2);
const material = new THREE.
ShaderMaterial({
  vertexShader: vertex,
  fragmentShader: fragment,
  uniforms:{
    uTime: {value: 0},
    uMouse: {value: new THREE.Vector2(0, 0)}
  },
  // wireframe: true
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

let clock = new THREE.Clock();

window.addEventListener("mousemove", (e)=>{
  material.uniforms.uMouse.value.x = e.clientX / window.innerWidth;
  material.uniforms.uMouse.value.y = 1 - e.clientY / window.innerHeight;
})

// 5. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    material.uniforms.uTime.value = clock.getElapsedTime();
    // Animation logic (rotate the cube)
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    // Draw the scene
    renderer.render(scene, camera);
}

// 6. HANDLE WINDOW RESIZE (Keep things sharp)
window.addEventListener('resize', () => {
    // Update camera info
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    // Update renderer size
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// Start the loop
animate();