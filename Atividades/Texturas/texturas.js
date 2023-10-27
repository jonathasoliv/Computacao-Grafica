//adicionar o bump mapping, normal mapping, disceplement mapping
//adicionar as opções mapping no menu dat.gui


import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';
import dat from 'dat.gui';

// Scene, camera, and renderer setup
const scene = new THREE.Scene();
const perspectiveCamera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const orthographicCamera = new THREE.OrthographicCamera(window.innerWidth / -2, window.innerWidth / 2, window.innerHeight / 2, window.innerHeight / -2, 0.1, 1000);
let currentCamera = perspectiveCamera;


function updateProjection(type) {
  if (type === 'perspective') {
    currentCamera = perspectiveCamera;
    cube.scale.set(1, 1, 1);
    currentCamera.position.z = 5;
  } else if (type === 'orthographic') {
    currentCamera = orthographicCamera;
    cube.scale.set(50, 50, 50);
    currentCamera.position.z = 5;
  }
  controls.object = currentCamera;
}

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);


// adicionar luz direcional
const directionalLight = new THREE.DirectionalLight("yellow", 0.5);
scene.add(directionalLight);

//carregar as texturas mapping 
const bumpMapTexture = new THREE.TextureLoader().load('texture\planets\normalmapping.jpg');
const normalMapTexture = new THREE.TextureLoader().load('texture\planets\normalmapping.jpg');
const displacementMapTexture = new THREE.TextureLoader().load('texture\planets\normalmapping.jpg');


// adicionar esfera na cena
const geometry3 = new THREE.SphereGeometry();
const material3 = new THREE.MeshStandardMaterial({
  color: "red",
  wireframe: false,
  side: THREE.DoubleSide,
  bumpScale: 0.2,
  normalMap: normalMapTexture,
  displacementMap: displacementMapTexture,
  displacementScale: 0.1
});

const sphere = new THREE.Mesh(geometry3, material3);
scene.add(sphere);
sphere.position.x = 4;

//coordenadas polares para fazer o movimento de translacao dos objetos
var radius = 2;
var radiusPlano = 4;
var angle = 0;
sphere.position.x = radius * Math.cos(angle);
sphere.position.y = radius * Math.sin(angle) / 1.5;

// Add axis helper
const axesHelper = new THREE.AxesHelper(100);
scene.add(axesHelper);
currentCamera.position.z = 5;

// Add dat.GUI controls
const gui = new dat.GUI();
const projectionType = {
  type: 'perspective'
};
gui.add(projectionType, 'type', ['perspective', 'orthographic']).onChange(updateProjection);

// Add event listener for 'keydown' event
window.addEventListener('keydown', (event) => {
  if (event.key === 'c' || event.key === 'C') {
    material.wireframe = !material.wireframe;
  }
});

// Create FPS counter
const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

// definir variavel para mover a luz
let flag_mover_luz = 1;


// Animate function
function animate() {
  
  requestAnimationFrame(animate);

  // Begin FPS counter update
  stats.begin();

  // rotacao da esfera
  //sphere.rotation.x += 0.01;
  //sphere.rotation.y += 0.01;

  //mover a luz direcional
  if (directionalLight.position.x >= 2){
    flag_mover_luz = -1;
  } else if (directionalLight.position.x <=-2){
    flag_mover_luz = 1;
  }
  directionalLight.position.x += 0.05 * flag_mover_luz;

  //movimento de translação da esfera
  angle += 0.01; //angulo de abertura do objeto para fazer o movimento de rotação nas coordenadas polares
  directionalLight.position.x = radius * Math.cos(angle); 
  directionalLight.position.z = radius * Math.sin(angle) / 1.8; 
  directionalLight.rotation.x += 0.004;
  directionalLight.rotation.y += 0.004;
  directionalLight.rotation.z += 0.004;

 // piscar luz usando a intensidade
 //directionalLight.intensity = ((Math.random() * (0.8 - 0.2)) + 0.2);


  // Renderizar a cena
  renderer.render(scene, currentCamera);

  // End FPS counter update
  stats.end();
}

animate();
