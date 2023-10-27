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

// adicionar luz ambiente 
const ambientLight = new THREE.AmbientLight("white", 0.7);
scene.add(ambientLight);

// adicionar luz direcional
const directionalLight = new THREE.DirectionalLight("yellow", 0.5);
scene.add(directionalLight);

// adicionar a primeira luz spotlight
const spotLight = new THREE.SpotLight("red");
scene.add(spotLight);

spotLight.castShadow = true; 
spotLight.receiveShadow = true;
spotLight.position.set(3, 2, 3);
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
scene.add(spotLightHelper);

// adicionar a segunda luz spotlight
const spotLight2 = new THREE.SpotLight("blue");
scene.add(spotLight2);

spotLight2.castShadow = true;
spotLight2.receiveShadow = true;
spotLight2.position.set(3, 3, 3);
const spotLightHelper2 = new THREE.SpotLightHelper(spotLight2);
scene.add(spotLightHelper2);

// adicionar a terceira luz spotlight
const spotLight3 = new THREE.SpotLight("green");
scene.add(spotLight3);

spotLight3.castShadow = true;
spotLight3.receiveShadow = true;
spotLight3.position.set(2, 3, 3);
const spotLightHelper3 = new THREE.SpotLightHelper(spotLight3);
scene.add(spotLightHelper3);


// adicionar o cubo na cena
const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshPhongMaterial({
  color: "blue",
  wireframe: false,
  side: THREE.DoubleSide
});

const cube = new THREE.Mesh(geometry, material);
scene.add(cube);
cube.position.x = -4;

// adicionar esfera na cena
const geometry3 = new THREE.SphereGeometry();
const material3 = new THREE.MeshLambertMaterial({
  color: "red",
  wireframe: false,
  side: THREE.DoubleSide
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

// definir variaveis para mover as luzes
let flag_mover_luz = 1;
let flag_mover_luz2 = 1;
let flag_mover_luz3 = 1;


// Animate function
function animate() {
  
  requestAnimationFrame(animate);

  // Begin FPS counter update
  stats.begin();

  // rotacao do cubo e esfera
  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  sphere.rotation.x += 0.01;
  sphere.rotation.y += 0.01;

  // Mover a primeira luz spotlight
  if (spotLight.position.x >= 3) {
    flag_mover_luz = -1;
  } else if (spotLight.position.x <= -3) {
    flag_mover_luz = 1;
  }
  spotLight.position.x += 0.04 * flag_mover_luz; //atualizar a posicao da luz no eixo x

  //mover a segunda luz spotlight
  if (spotLight2.position.x >= 2){
    flag_mover_luz2 = -1;
  } else if (spotLight2.position.x <=-2){
    flag_mover_luz2 = 1;
  }
  spotLight2.position.x += 0.05 * flag_mover_luz2;

  //mover a terceira luz spotlight
  if (spotLight3.position.x >= 2){
    flag_mover_luz3 = -1;
  }else if (spotLight3.position.x <=-2){
    flag_mover_luz3 = 1;
  }
  spotLight3.position.x += 0.08 * flag_mover_luz3;

  //movimento de translação da esfera
  angle += 0.01; //angulo de abertura do objeto para fazer o movimento de rotação nas coordenadas polares
  sphere.position.x = radius * Math.cos(angle); 
  sphere.position.z = radius * Math.sin(angle) / 1.8; 
  sphere.rotation.x += 0.004;
  sphere.rotation.y += 0.004;
  sphere.rotation.z += 0.004;

  // atualizar as posições das luzes
  spotLightHelper.update();
  spotLightHelper2.update();
  spotLightHelper3.update();

 // piscar luz usando a intensidade
  spotLight.intensity  = ((Math.random() * (0.8 - 0.2)) + 0.2);
  spotLight2.intensity = ((Math.random() * (0.8 - 0.5)) + 0.5);
  spotLight3.intensity = ((Math.random() * (0.8 - 0.4)) + 0.8);

  ambientLight.intensity = ((Math.random() * (0.8 - 0.2)) + 0.2);
  directionalLight.intensity = ((Math.random() * (0.8 - 0.2)) + 0.2);


  // Renderizar a cena
  renderer.render(scene, currentCamera);

  // End FPS counter update
  stats.end();
}


animate();
