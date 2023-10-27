import * as THREE from 'three';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

let SCREEN_WIDTH = window.innerWidth;
let SCREEN_HEIGHT = window.innerHeight;
let aspect_ratio = SCREEN_WIDTH / SCREEN_HEIGHT;

let camera_perspective, active_camera, scene, renderer, stats, controls;
let shaderMesh;

const uniforms = {
    u_resolution: { type: "v2", value: new THREE.Vector2() },
    u_time: { type: "f", value: 1.0 },
    u_mouse: { type: "v2", value: new THREE.Vector2() },
}
const clock = new THREE.Clock();

function init() {
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x333333);
    camera_perspective = new THREE.PerspectiveCamera(45, aspect_ratio, 0.1, 1000);

    active_camera = camera_perspective;
    active_camera.position.set(1, 0.5, 10);

    let axesHelper = new THREE.AxesHelper(10);
    scene.add(axesHelper);

    function createShaderObject() {
        const basicVertexShader = `
                    void main() {
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                    }
                `;

        const basicFragmentShader = `
                    void main() {
                      gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
                    }
                `;

        const scaleVertexShader = `
                    void main() {
                        vec3 scale = vec3(2.0, 1.0, 1.0);
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position * scale, 1.0);
                    }
                `;

        const redAnimationFragmentShader = `
                    uniform vec2 u_mouse; // mouse position in screen pixels
                  uniform vec2 u_resolution; //Canvas size (width,height)
                  uniform float u_time; // shader playback time (in seconds)

                    void main() {
                      gl_FragColor = vec4(0.0, abs(sin(u_time)), 0.0, 1.0);
                    }
                `;

        const colorInterpFragmentShader = `
                uniform vec2 u_mouse; // mouse position in screen pixels
                  uniform vec2 u_resolution; //Canvas size (width,height)
                  uniform float u_time; // shader playback time (in seconds)

                    void main() {
                        vec2 st = gl_FragCoord.xy/u_resolution.xy; // px / 1920 e py / 1080
                        gl_FragColor = vec4(st.x,st.y,0.0,1.0);
                    }
                `;

        const normalVertexShader = `
                    varying vec3 v_normal; //alterar as cores do RGB dentro do vetor 
                    void main() {
                      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                      v_normal = normal;
                    }
                `;

        const normalFragmentShader = `
                     
                     uniform float u_time;
                     void main() {
                      // Calcula o fator de pulsação usando o seno do tempo
                      float frequency = 4.0;
                      float pulse = abs(sin(u_time * frequency)); //pulse calcula de 0 a 1 para mudar a cor

                     // Define a cor base como vermelho
                     vec3 color = vec3(0.0, 1.0, pulse); //vermelho, verde, azul
                      gl_FragColor = vec4(color, 1.0); //1.0 transparente ou nao transparente
                    }
                `;

        
        const cubeGeometry = new THREE.BoxGeometry(1, 1, 1); //1, 128, 256
        const planeGeometry = new THREE.PlaneGeometry(4, 4);
        const material = new THREE.ShaderMaterial({
            vertexShader: normalVertexShader,
            fragmentShader: normalFragmentShader,
            uniforms
        });

        shaderMesh = new THREE.Mesh(cubeGeometry, material);
        scene.add(shaderMesh);
        /*shaderMesh = new THREE.Mesh(cubeGeometry, material);
        shaderMesh.rotation.x = Math.PI / 4; // Rotação no eixo X
        shaderMesh.rotation.y = Math.PI / 4; // Rotação no eixo Y
        scene.add(shaderMesh);*/

        shaderMesh.position.set(1, 1, 1);
    }
    createShaderObject();

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    document.body.appendChild(renderer.domElement);

    stats = new Stats();
    document.body.appendChild(stats.dom);

    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;

    createControls(camera_perspective);
    window.addEventListener('resize', onWindowResize);
    window.addEventListener('mousemove', (e) => {
        window.addEventListener('resize', onWindowResize, false);
        uniforms.u_mouse.value.x = e.clientX;
        uniforms.u_mouse.value.y = e.clientY;
    })
}

function onWindowResize() {
    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;
    aspect_ratio = SCREEN_WIDTH / SCREEN_HEIGHT;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    active_camera.aspect = aspect_ratio;
    active_camera.updateProjectionMatrix();

    uniforms.u_resolution.value.x = window.innerWidth;
    uniforms.u_resolution.value.y = window.innerHeight;

    console.log(uniforms.u_resolution);
}

function createControls(camera) {
    active_camera = camera;
    active_camera.position.set(1, 0.5, 10);

    controls = new TrackballControls(active_camera, renderer.domElement);

    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.panSpeed = 0.8;

    controls.keys = ['KeyA', 'KeyS', 'KeyD'];
}

const animate = function () {
    requestAnimationFrame(animate);

    // Atualiza a rotação do cubo
    shaderMesh.rotation.x += 0.01; // Rotação no eixo X
    shaderMesh.rotation.y += 0.01; // Rotação no eixo Y

    uniforms.u_time.value = clock.getElapsedTime();

    controls.update();
    stats.update();

    renderer.render(scene, active_camera);
};

init();
animate();

/*LINKS:
  https://dev.to/maniflames/creating-a-custom-shader-in-threejs-3bhi
  https://www.youtube.com/watch?v=C8Cuwq1eqDw
  https://www.javascript.christmas/2020/10
  https://medium.com/@sidiousvic/how-to-use-shaders-as-materials-in-three-js-660d4cc3f12a
  https://thebookofshaders.com/
  https://threejs.org/docs/#api/en/materials/ShaderMaterial
  https://aerotwist.com/tutorials/an-introduction-to-shaders-part-1/
  https://www.shadertoy.com/
*/