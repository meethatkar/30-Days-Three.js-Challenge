import './style.css'
import * as THREE from 'three';
import vertex from './vertex.glsl?raw';
import fragment from './fragment.glsl?raw';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

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
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.dampingFactor = 0.05;
controls.update();

// 4. ADD AN OBJECT
const geometry = new THREE.IcosahedronGeometry(2, 15);
const material = new THREE.ShaderMaterial({
    vertexShader: vertex,
    fragmentShader: fragment,
    wireframe: true,
    uniforms: {
        uTime: { value: 0.0 },
    }    
});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

// 5. ANIMATION LOOP
function animate() {
    requestAnimationFrame(animate);
    // Draw the scene
    renderer.render(scene, camera);
    material.uniforms.uTime.value = clock.getElapsedTime();
    controls.update();
}

const clock = new THREE.Clock();

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