
import * as THREE from 'https://cdn.skypack.dev/three@0.128.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.128.0/examples/jsm/controls/OrbitControls.js?min';

const container = document.getElementById('canvas-container');

// Scene
const scene = new THREE.Scene();

// Camera
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 100);
camera.position.set(0, 2, 7);

// Renderer
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setSize(container.clientWidth, container.clientHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
container.appendChild(renderer.domElement);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false;
controls.autoRotate = true;
controls.autoRotateSpeed = 2.0;
controls.maxPolarAngle = Math.PI / 2; // Limit vertical rotation

// --- Premium Jar Creation ---
const productGroup = new THREE.Group();
scene.add(productGroup);

// 1. Inner Cream (Solid)
const creamGeometry = new THREE.CylinderGeometry(1.3, 1.3, 1.8, 64);
const creamMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xFFFDD0, // Cream color
    roughness: 0.3,
    metalness: 0.0,
    subsurfaceScattering: true,
});
const cream = new THREE.Mesh(creamGeometry, creamMaterial);
cream.castShadow = true;
productGroup.add(cream);

// 2. Outer Glass Jar (Translucent)
const glassGeometry = new THREE.CylinderGeometry(1.5, 1.5, 2.0, 64);
const glassMaterial = new THREE.MeshPhysicalMaterial({
    color: 0xffffff,
    metalness: 0.1,
    roughness: 0.05,
    transmission: 0.3, // Glass effect
    opacity: 0.4,
    transparent: true,
    clearcoat: 1.0,
    side: THREE.DoubleSide
});
const glass = new THREE.Mesh(glassGeometry, glassMaterial);
glass.position.y = 0;
glass.castShadow = true;
productGroup.add(glass);

// 3. Gold Lid (Reflective)
const lidGeometry = new THREE.CylinderGeometry(1.55, 1.55, 0.5, 64);
const goldMaterial = new THREE.MeshStandardMaterial({
    color: 0xD4AF37, // Gold
    metalness: 1.0,
    roughness: 0.2, // Shiny but not mirror
    envMapIntensity: 2
});
const lid = new THREE.Mesh(lidGeometry, goldMaterial);
lid.position.y = 1.1;
lid.castShadow = true;
productGroup.add(lid);

// 4. Label (Floating off the surface)
const canvas = document.createElement('canvas');
canvas.width = 1024;
canvas.height = 512;
const ctx = canvas.getContext('2d');
ctx.clearRect(0, 0, 1024, 512);

// Stylish Text
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
// Gold Band
ctx.fillStyle = 'rgba(212, 175, 55, 0.1)';
ctx.fillRect(0, 100, 1024, 300);
// Text
ctx.font = 'bold 90px "Playfair Display", serif';
ctx.fillStyle = '#1A1A1A';
ctx.fillText('NIKESHA', 512, 220);
ctx.font = '40px sans-serif';
ctx.fillStyle = '#D4AF37';
ctx.fillText('LUXURY RADIANCE', 512, 300);

const labelTexture = new THREE.CanvasTexture(canvas);
const labelGeometry = new THREE.CylinderGeometry(1.52, 1.52, 1.4, 64, 1, true, -Math.PI / 1.5, Math.PI * 1.33);
const labelMaterial = new THREE.MeshBasicMaterial({ map: labelTexture, transparent: true });
const label = new THREE.Mesh(labelGeometry, labelMaterial);
label.rotation.y = -Math.PI;
productGroup.add(label);

// 5. Floating Ingredients (Orbs)
const ingredientsGroup = new THREE.Group();
productGroup.add(ingredientsGroup);

const orbGeo = new THREE.SphereGeometry(0.15, 32, 32);
const orbMat = new THREE.MeshPhysicalMaterial({ color: 0xD4AF37, metalness: 1, roughness: 0.2 });

for (let i = 0; i < 8; i++) {
    const orb = new THREE.Mesh(orbGeo, orbMat);
    const angle = (i / 8) * Math.PI * 2;
    orb.position.x = Math.cos(angle) * 2.5;
    orb.position.z = Math.sin(angle) * 2.5;
    orb.userData = { angle: angle, speed: 0.5 + Math.random() * 0.5, yOffset: Math.random() * 2 };
    ingredientsGroup.add(orb);
}

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
scene.add(ambientLight);

const spotLight = new THREE.SpotLight(0xffffff, 2);
spotLight.position.set(5, 10, 5);
spotLight.angle = Math.PI / 4;
spotLight.penumbra = 0.5;
spotLight.castShadow = true;
scene.add(spotLight);

const goldLight = new THREE.PointLight(0xD4AF37, 2, 10);
goldLight.position.set(-2, 1, 2);
scene.add(goldLight);

// Animation
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    // Float the product
    productGroup.position.y = Math.sin(time * 0.5) * 0.15;
    productGroup.rotation.y += 0.002;

    // Orbit Ingredients
    ingredientsGroup.children.forEach(orb => {
        orb.userData.angle += 0.01 * orb.userData.speed;
        orb.position.x = Math.cos(orb.userData.angle) * 2.2;
        orb.position.z = Math.sin(orb.userData.angle) * 2.2;
        orb.position.y = Math.sin(time + orb.userData.yOffset) * 0.5;
    });

    controls.update();
    renderer.render(scene, camera);
}

// Resize
window.addEventListener('resize', () => {
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
});

animate();
