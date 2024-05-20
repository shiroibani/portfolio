//Manual from three.js
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

//Import Light
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';

//Import Helper
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { GUI } from 'three/addons/libs/lil-gui.module.min.js';

//Import Effect
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { BloomPass } from 'three/addons/postprocessing/BloomPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FilmPass } from 'three/addons/postprocessing/FilmPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

//Create a Three.JS.Scene
const scene = new THREE.Scene();
//Create a new camera with positions and angles
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
// const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 10000);

//Keep the 3D model on a global variable so we can access it later
const models = [];

//OrbitControls allow the camera to move around the scene
let controls;

//Set which model to render
let modelsToRender = 'magical';

//Set which component model to render
const comModelToRender = [];
comModelToRender.push('magicalGirl');
comModelToRender.push('magicalDecor');
// comModelToRender.push('magicalStar');

//Instantiate a loader for the .gltf file
const loader = new GLTFLoader();

function locationBlender(object, x, y, z) {
    object.position.set(x, z, -y);
};

function rotationBlender(object, x, y, z) {
    object.rotateOnWorldAxis(new THREE.Vector3(1, 0, 0), THREE.MathUtils.degToRad(-90 + x));
    object.rotateOnWorldAxis(new THREE.Vector3(0, 1, 0), THREE.MathUtils.degToRad(z));
    object.rotateOnWorldAxis(new THREE.Vector3(0, 0, 1), THREE.MathUtils.degToRad(y));
};

const girl = [];

//Load the .gltf file
comModelToRender.forEach(function (comModel) {
    loader.load(
        `models/${modelsToRender}/${comModel}/${comModel}.gltf`,
        function (gltf) {
            //IF the file is loader, add it to the scene
            const model = gltf.scene;
            model.scale.set(0.965, 0.965, 0.965);
            if (comModel == "magicalGirl") girl.push(model);
            scene.add(model);


            // const box = new THREE.Box3().setFromObject(model);
            // const helper = new THREE.Box3Helper(box, 0xffff00);
            // scene.add(helper);

            // const size = box.getSize(new THREE.Vector3());
            // console.log(comModel, size);
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
});

function getRndInteger(min, max) {
    return (Math.random() * (max - min + 0.1)) + min;
}

for (let i = 0; i < 20; i++) {
    loader.load(
        `models/${modelsToRender}/magicalStar/magicalStar.gltf`,
        function (gltf) {
            //IF the file is loader, add it to the scene
            const model = gltf.scene;

            //Random scale
            const scaleStart = getRndInteger(0.1, 1.5);
            model.scale.set(scaleStart, scaleStart, scaleStart);

            //Random position
            model.position.set(getRndInteger(-1, 1), getRndInteger(0, 2.5), getRndInteger(-1.3, -0.3));
            // console.log(model.position);

            //Random rotate star
            // model.rotateY(THREE.MathUtils.degToRad(getRndInteger(0, 360)));
            scene.add(model);

            const rndTrueFalse = Math.floor(getRndInteger(0, 1)) >= 0.5;
            models.push([model, rndTrueFalse]);
            // models.push(model);

            // const box = new THREE.Box3().setFromObject(model);
            // const helper = new THREE.Box3Helper(box, 0xffff00);
            // scene.add(helper);

            // const size = box.getSize(new THREE.Vector3());
            // console.log("magicalStar", size);
            // console.log("magicalStar", rndTrueFalse);
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
};

//Instantiate a new renderer and set its size
const renderer = new THREE.WebGLRenderer({ alpha: true });
renderer.setSize(window.innerWidth, window.innerHeight);
RectAreaLightUniformsLib.init();

//Render to screen
const renderScene = new RenderPass(scene, camera);
const composer = new EffectComposer(renderer);
composer.setSize(window.innerWidth, window.innerHeight);
composer.renderToScreen = true;
composer.addPass(renderScene);

//Bloom pass
const bloomPass = new BloomPass(
    1.3,    // strength
    2,   // kernel size
    0.001,    // sigma ?
    256,  // blur render target resolution
);
composer.addPass(bloomPass);

//Unreal bloom pass
const bloomUnreal = new UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.5,
    0.4,
    0.85,
);
bloomUnreal.threshold = 0.2;
bloomUnreal.strength = 0.2;
bloomUnreal.radius = 0;
composer.addPass(bloomUnreal);

//Film pass
const filmPass = new FilmPass(
    0,   // intensity
    false,  // grayscale
);
composer.addPass(filmPass);

//Output pass
const outputPass = new OutputPass();
composer.addPass(outputPass);

//Add the renderer to the DOM
document.getElementById("container3D").appendChild(renderer.domElement);

//Set how far the camera will be from the 3D model
camera.position.set(-0.006, 1.6, 2.6);

//Add helper to scene
// const axesHelper = new THREE.AxesHelper(50);
// scene.add(axesHelper);

// const gridHelper = new THREE.GridHelper(10, 10);
// scene.add(gridHelper);

// Add lights to the scene, so we can actually see the 3D model
const frontLight = new THREE.RectAreaLight(0xFF8B3B, 3, 0.5, 0.5);
locationBlender(frontLight, 0.037812, -0.766572, 1.46786);
rotationBlender(frontLight, 72.7745, 0, 5.23143);
scene.add(frontLight);
// frontLight.add(new RectAreaLightHelper(frontLight));

const backLight = new THREE.RectAreaLight(0x0085FF, 3, 0.5, 0.5);
locationBlender(backLight, 0.08943, 0.842982, 1.53952);
rotationBlender(backLight, 72.7745, 0, -190.552);
scene.add(backLight);
// backLight.add(new RectAreaLightHelper(backLight));

const sideLight = new THREE.RectAreaLight(0x0085FF, 3, 0.5, 0.5);
locationBlender(sideLight, -0.481353, -0.945952, 1.51179);
rotationBlender(sideLight, 72.7745, 0, -21.439);
scene.add(sideLight);
// sideLight.add(new RectAreaLightHelper(sideLight));

const rimLight = new THREE.RectAreaLight(0x0085FF, 3, 0.5, 0.5);
locationBlender(rimLight, -0.481353, -0.651173, 1.12635);
rotationBlender(rimLight, 72.7745, 0, -21.439);
scene.add(rimLight);
// rimLight.add(new RectAreaLightHelper(rimLight));

const laLight = new THREE.RectAreaLight(0x0085FF, 3, 0.5, 0.5);
locationBlender(laLight, -0.436287, -0.010681, 1.53952);
rotationBlender(laLight, 72.7745, 0, -134.556);
scene.add(laLight);
// laLight.add(new RectAreaLightHelper(laLight));

const la1Light = new THREE.RectAreaLight(0xFF8B3B, 1, 0.5, 0.5);
locationBlender(la1Light, -0.080517, -0.910185, 0.261748);
rotationBlender(la1Light, 89.9487, -1.54866, 4.99756);
scene.add(la1Light);
// la1Light.add(new RectAreaLightHelper(la1Light));

const la2Light = new THREE.RectAreaLight(0xFF8B3B, 1, 0.5, 0.5);
locationBlender(la2Light, 0.501232, -0.513139, 1.7147);
rotationBlender(la2Light, 89.9487, -1.54866, 4.99756);
scene.add(la2Light);
// la2Light.add(new RectAreaLightHelper(la2Light));

const la3Light = new THREE.RectAreaLight(0xFF8B3B, 1, 0.3, 0.3);
locationBlender(la3Light, -0.052843, -0.224934, 0.395);
rotationBlender(la3Light, 180, 0, 0);
scene.add(la3Light);
// la3Light.add(new RectAreaLightHelper(la3Light));

const sun = new THREE.DirectionalLight(0xFFFFFF, 1);
locationBlender(sun, -0.052843, -0.120896, 1.40966);
scene.add(sun);

const ambientLight = new THREE.AmbientLight(0xFFFFFF, 0.1);
scene.add(ambientLight);

//Create sphere
const material = new THREE.MeshBasicMaterial({ color: new THREE.Color("#46FFBE") });
const sphere = new THREE.Mesh(new THREE.IcosahedronGeometry(0.1, 15), material);
locationBlender(sphere, -0.052843, -0.57, 0.182);
sphere.layers.set(0);
scene.add(sphere);

const sphere1 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.029, 15), material);
locationBlender(sphere1, -0.052843, -0.325, 1.14);
sphere1.layers.set(0);
scene.add(sphere1);
girl.push(sphere1);

const sphere2 = new THREE.Mesh(new THREE.IcosahedronGeometry(0.07, 15), material);
locationBlender(sphere2, 0.363, -0.232, 1.684);
sphere2.layers.set(0);
scene.add(sphere2);
girl.push(sphere2);

//Set mouse controls
controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 1.3, 0);
// controls.autoRotate = true;
controls.enableRotate = false;
controls.enableZoom = false;
controls.enablePan = false;

//Delta Time
let now = new Date();
let then = 0;

const points = [];
points.push(new THREE.Vector3(-0.05, -5, 0.2));
points.push(new THREE.Vector3(-0.05, 5, 0.2));

//Draw line
const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(
    geometry,
    new THREE.LineBasicMaterial({ color: 0xff00ff })
);
scene.add(line);

THREE.Object3D.prototype.rotateAroundWorldAxis = function () {

    // rotate object around axis in world space (the axis passes through point)
    // axis is assumed to be normalized
    // assumes object does not have a rotated parent

    var q = new THREE.Quaternion();

    return function rotateAroundWorldAxis(point, axis, angle) {

        q.setFromAxisAngle(axis, angle);

        this.applyQuaternion(q);

        this.position.sub(point);
        this.position.applyQuaternion(q);
        this.position.add(point);

        return this;

    }

}();

function rotateAroundAxis() {

    const vecA = points[0];
    const vecB = points[1];
    const vec = new THREE.Vector3();

    vec.copy(vecA).sub(vecB).normalize();

    if (girl.length >= 3) {
        girl.forEach(function (child) {
            child.rotateAroundWorldAxis(vecA, vec, 0.01);
        })
    }

}

//Render the scene
function animate(e) {
    requestAnimationFrame(animate);
    //Here we could add some code to update the scene, adding som automatic movement
    controls.update();

    // girl.rotation.y += 0.01;
    // console.log(vector);
    rotateAroundAxis();

    models.forEach(function (model) {
        // Rotate star 
        // model[0].rotation.y += 0.01;

        //Rotate star around center
        // model[0].position.applyEuler(new  THREE.Euler(0, THREE.MathUtils.degToRad(0.4), 0, 'XYZ'));

        // if (model[1]) {
        //     model[0].position.y += 0.001;
        //     if (model[0].position.y > 2) {
        //         model[1] = false;
        //     }
        // } else {
        //     model[0].position.y -= 0.001;
        //     if (model[0].position.y < 0.5) {
        //         model[1] = true;
        //     }
        // }

        if (model[1]) {
            model[0].scale.x -= 0.002;
            model[0].scale.y += 0.002;
            model[0].position.y += 0.0005;
            if (2 * model[0].scale.x <= model[0].scale.y) {
                model[1] = false;
            }
        } else {
            model[0].scale.x += 0.002;
            model[0].scale.y -= 0.002;
            model[0].position.y -= 0.0005;
            if (model[0].scale.x >= 2 * model[0].scale.y) {
                model[1] = true;
            }
        }
        // console.log(model[0].scale.x, model[0].scale.y);

    });

    renderer.render(scene, camera);

    now *= 0.001; // convert to seconds
    const deltaTime = now - then;
    then = now;

    composer.render(deltaTime);
    // console.log(camera.position.z);
}

//Add a listener to the window, so we can resize the window and the camera
window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});

//Start the 3D rendering
animate();