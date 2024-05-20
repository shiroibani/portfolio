// //Import the THREE.js library
// import * as THREE from 'https://cdn.skypack.dev/three@0.129.0/build/three.module.js';
// //To allow for the camera to move around the scene
// import { OrbitControls } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/controls/OrbitControls.js';
// //To allow for importing the .gltf file
// import { GLTFLoader } from 'https://cdn.skypack.dev/three@0.129.0/examples/jsm/loader/GLTFLoader.js';

//Manual from three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Create a Three.JS.Scene
const scene = new THREE.Scene();
//Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

//Keep the 3D object on a global variable so we can access it later
let object;

//OrbitControls allow the camera to move around the scene
let controls;

//Set which object to render
let objToRender = 'table';

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

//Load the .gltf file
loader.load(
    `models/${objToRender}/scene.gltf`,
    function (gltf) {
        //IF the file is loader, add it to the scene
        object = gltf.scene;
        scene.add(object);
    },
    function (xhr) {
        //While it is loading, log the progress
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    },
    function (error) {
        //If there is an error, log it
        console.log(error);
    }
);

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.z = objToRender.position === 'dino' ? 25 : 500;

//Add lights to the scene, so we can actually see the 3D model
const topLight = new THREE.DirectionalLight(0xffffff, 1); // (color, intensity)
topLight.position.set(500, 500, 500) //top-left-ish
topLight.castShadow = true;
scene.add(topLight);

const ambientLight = new THREE.AmbientLight(0xffffff, objToRender === 'dino' ? 5 : 1); // (color, intensity)
scene.add(ambientLight);

controls = new OrbitControls(camera, renderer.domElement);

//Render the scene
function animate(e) {
    requestAnimationFrame(animate);
    //Here we could add some code to update the scene, adding som automatic movement

    controls.update();

    // //Make the table rotation
    // if (object && objToRender === 'table') {
    //     //I've played with the constants here until it looked good
    //     var mouseX = 0, mouseY = 0;

    //     onmousedown = function (c) {
    //         //Make the table rotation
    //         if (c.button === 0) {
    //             mouseX = c.clientX;
    //             mouseY = c.clientY;
    //             onmousemove = function (e) {
    //                 object.rotation.y -= (mouseX - e.clientX) / 130;
    //                 object.rotation.x -= (mouseY - e.clientY) / 130;

    //                 mouseX = e.clientX;
    //                 mouseY = e.clientY;
    //             }
    //         }
    //         //Make the table move
    //         if (c.button === 1) {
    //             mouseX = c.clientX;
    //             mouseY = c.clientY;
    //             onmousemove = function (e) {
    //                 object.position.x -= (mouseX - e.clientX) / 2;
    //                 object.position.y += (mouseY - e.clientY) / 2;

    //                 mouseX = e.clientX;
    //                 mouseY = e.clientY;
    //             }
    //         }
    //     }

    //     onmouseup = function (e) {
    //         onmousemove = function (e) { }
    //     }
    // }

    // //Make the table zoom
    // if (object && objToRender === 'table') {
    //     onwheel = function (e) {
    //         if (camera.position.z < 800 || e.deltaY < 0) {
    //             camera.position.z += (e.deltaY / 3);
    //         }
    //         camera.updateProjectionMatrix();
    //         console.log('zoom', camera.position.z);
    //     };
    // }


    renderer.render(scene, camera);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

//Start the 3D rendering
animate();