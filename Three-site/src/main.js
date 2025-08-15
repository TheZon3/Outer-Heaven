import './style.css'
import './carousel.css'
import './carousel.js'


import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ 
  canvas: document.querySelector('#bg') 
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.z = 40;

renderer.render(scene, camera);

const world = new THREE.Group();
scene.add(world);

const geometry = new THREE.BoxGeometry(10, 10, 10);
const material = new THREE.MeshStandardMaterial({ color: 0xffffff, wireframe  : true});
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.position.x = -20;

const pointLight = new THREE.PointLight(0xffffff);
pointLight.position.set(5, 5, 5);
const ambientLight = new THREE.AmbientLight(0xffffff);
scene.add(pointLight, ambientLight);

const controls = new OrbitControls(camera, renderer.domElement);

function addStar (){
  const geometry = new THREE.SphereGeometry(0.1, 25, 24,24);
  const material = new THREE.MeshStandardMaterial( {color: 0xffffff, emissive: 0xffffff, emissiveIntensity: 600.5} ); 
  const star = new THREE.Mesh(geometry, material);
  
  const [x, y, z] = Array(3).fill().map(() => THREE.MathUtils.randFloatSpread(500));
  star.position.set (x, y, z);
  world.add(star);
}

Array(1000).fill().forEach(addStar);

// Section Animations---------------------------------------------------

// Define camera positions for each section
const sectionPositions = {
  section0: { x: -10, y: 10, z: -30 },
  section1: { x: -20, y: 2, z: -50 },
  section2: { x: -30, y: 4, z: -50 },
  section3: { x: -40, y: 8, z: -50 }
};

let currentSectionId = null;

// Use IntersectionObserver to detect when a section enters the viewport
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const sectionId = entry.target.id;

      if (sectionId !== currentSectionId) {
        currentSectionId = sectionId;
        moveCameraToSection(sectionId);
      }
    }
  });
}, {
  root: null,
  threshold: 0.5 // Trigger when 50% of section is visible
});

// Observe all sections
document.querySelectorAll(".snap-section").forEach(section => {
  observer.observe(section);
});

function moveCameraToSection(sectionId) {
  const target = sectionPositions[sectionId];
  if (!target) return;

  const duration = 600;
  const start = {
    x: camera.position.x,
    y: camera.position.y,
    z: camera.position.z
  };
  const startTime = performance.now();

  function animate(time) {
    const elapsed = time - startTime;
    const t = Math.min(elapsed / duration, 1);

    // Ease-in-out interpolation
    const ease = t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;

    camera.position.x = start.x + (target.x - start.x) * ease;
    camera.position.y = start.y + (target.y - start.y) * ease;
    camera.position.z = start.z + (target.z - start.z) * ease;

    if (t < 1) requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
}


function animate() {
  requestAnimationFrame(animate);
  world.rotation.x += 0.0005;
  world.rotation.y += 0.0005;


  controls.update();
  renderer.render(scene, camera);


}
animate();

// Responsive Navbar Toggle
const navbarToggle = document.getElementById('navbar-toggle');
const navbarLinks = document.getElementById('navbar-links');
if (navbarToggle && navbarLinks) {
  navbarToggle.addEventListener('click', () => {
    navbarLinks.classList.toggle('active');
  });
}

