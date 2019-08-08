// Setting up RENDERER, SCENE AND CAMERA
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(35, 10, 0);
camera.lookAt(0, 0, 0);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// LIGHTS
var ambientLight = new THREE.AmbientLight(0xFF7777, 0.5);	// 0.2
var light = new THREE.DirectionalLight(0xFFFFFFF, 1.0);
light.position.set(30, 200, 0).normalize();

// direction is set in GUI
scene.add(ambientLight);
scene.add(light);
        
// OBJECTS
var geometry_sun = new THREE.SphereGeometry(5, 24, 24);
var material_sun = new THREE.MeshPhongMaterial({color: 0xFFC303});
var sun = new THREE.Mesh(geometry_sun, material_sun);

var geometry_earth = new THREE.SphereGeometry(1, 24, 24);
var material_earth = new THREE.MeshPhongMaterial({color: 0x00AAFA});
var earth = new THREE.Mesh(geometry_earth, material_earth);

scene.add(sun);
scene.add(earth);

let planets = [];
planets.push(earth);

// Animate function 
function makeCircle(r) {
  let points = [];
  let incr = Math.random() * (0.1 - 0.005) + 0.005;
  for (alpha = 0; alpha < 2 * Math.PI; alpha += incr) {
    points.push([r*Math.cos(alpha), r*Math.sin(alpha)]);
  }
  return points;
}

let paths = [];
paths.push(makeCircle(10));

let i = 0;
function animate() {
  requestAnimationFrame(animate);

  // Axis rotation
  sun.rotation.y += 0.005;

  // Orbit
  for (let j = 0; j < planets.length; j++) {
    let len = paths[j].length;
    planets[j].position.x = paths[j][i % len][0];
    planets[j].position.z = paths[j][i % len][1];
  } i++;

  renderer.render(scene, camera);
}

animate();

// User controls
// zoom in and out
function onScroll(event) {
  var fovMAX = 160;
  var fovMIN = 1;
  camera.fov -= event.wheelDeltaY / 180;
  camera.fov = Math.max(Math.min(camera.fov, fovMAX), fovMIN);
  camera.updateProjectionMatrix();
}

// camera controls (ONLY LEFT RIGHT AS OF NOW)
const d = Math.sqrt(1325);
function calculatePos(p, t) {
  return [
    d * Math.cos(p) * Math.cos(t), // x
    d * Math.sin(p),               // y
    d * Math.cos(p) * Math.sin(t)  // z
  ]
}

let phi = Math.acos(35 / Math.sqrt(1325));
let theta = 0;
function onKeyDown(event) {
  let k = event.key;
  if (k === 'ArrowLeft')
    theta += 0.25;
  else if (k === 'ArrowRight')
    theta -= 0.25;

  let [x, y, z] = calculatePos(phi, theta); 
  camera.position.set(x, y, z);
  camera.lookAt(0,0,0);
}

let r = 15;

document.getElementById('add-planet').onclick = function () {
  let color = Math.random() * 0xFFC303;
  let geometry = new THREE.SphereGeometry(1, 24, 24);
  let material = new THREE.MeshPhongMaterial({color});
  let planet = new THREE.Mesh(geometry, material);
  planets.push(planet);
  paths.push(makeCircle(r));
  scene.add(planet);
  r += 5;
}

document.addEventListener('mousewheel', onScroll);
document.addEventListener('keydown', onKeyDown);