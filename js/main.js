import * as THREE from 'three';

// Initialize scene, camera, and renderer
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 100);
const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Directional light
const light = new THREE.DirectionalLight();
light.position.set(-0.25, 0.5, 1);
scene.add(light);

// Coin
const texture = new THREE.TextureLoader();
const urls = ["plain-NormalMap.png", "head-NormalMap.png", "tail-NormalMap.png"];
const geometry = new THREE.CylinderGeometry(1, 1, 0.12, 1000);
const materials = urls.map(url => new THREE.MeshStandardMaterial({
        normalMap: texture.load(url),
        metalness: 0.8,
        roughness: 0.5,
        color: 0xffd300,
}));

const coin = new THREE.Mesh(geometry, materials);
coin.rotation.x = 0.5 * Math.PI / 2; // to start with heads at a slight angle
scene.add(coin);

camera.position.z = 5;

// Coin animation and render function
let flipSpeed = 0.02;
let tiltSpeed = 0;
let tiltDirection = 0; 

function animate() {
	requestAnimationFrame(animate);
    coin.rotation.x += flipSpeed;
    coin.rotation.z += tiltSpeed * tiltDirection;
    if (coin.rotation.z > 0.35 || coin.rotation.z < -0.35) {
        tiltDirection *= -1;
    }
	renderer.render(scene, camera);
}
animate();

// Click handlers
const instructions = document.getElementById('tap');
let flipping = false;

document.addEventListener('click', () => {
    if (flipping === false) {
        flipping = true;
        flipSpeed = 0.35;
        tiltSpeed = 0;
        coin.rotation.z = 0;
        instructions.textContent = 'tap screen to stop';
    } else {
        flipping = false;
        if (Math.random() < 0.5) {
            coin.rotation.x = Math.PI / 2;
            console.log('Heads!');
        } else {
            coin.rotation.x = 3 * Math.PI / 2;
            console.log('Tails!');
        }
        flipSpeed = 0;
        tiltSpeed = 0.0075;
        tiltDirection = 1;
        instructions.textContent = 'tap screen to flip';
    }
});

// Info handlers

let open = false;
const info = document.getElementById('info');

document.querySelector('i').addEventListener('click', event => {
    event.stopPropagation();
    if (open === false) {
        info.style.visibility = 'visible';
        open = true;
    } else {
        info.style.visibility = 'hidden';
        open = false;
    }
});

document.querySelector('a').addEventListener('click', event => {
    event.stopPropagation();
});