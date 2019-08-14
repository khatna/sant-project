// Setting up RENDERER, SCENE AND CAMERA
let renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 500);
var controls = new THREE.TrackballControls(camera, renderer.domElement);
camera.position.set(35, 10, 0);
camera.lookAt(0, 0, 0);
controls.update();

let scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// LIGHTS
let ambientLight = new THREE.AmbientLight(0xFF7777, 0.5);	// 0.2
let light = new THREE.DirectionalLight(0xFFFFFFF, 1.0);
light.position.set(30, 200, 0).normalize();

// direction is set in GUI
scene.add(ambientLight);
scene.add(light);

// OBJECTS

//This will add a starfield to the background of a scene
let starsGeometry = new THREE.Geometry();

for (k = 0; k < 10000; k++) {
  let star = new THREE.Vector3();
  star.x = THREE.Math.randFloatSpread(1800);
  star.y = THREE.Math.randFloatSpread(1800);
  star.z = THREE.Math.randFloatSpread(1800);

  starsGeometry.vertices.push(star);
}

let starsMaterial = new THREE.PointsMaterial({ color: 0xFFFFFF });
let starField = new THREE.Points(starsGeometry, starsMaterial);
scene.add(starField);

// Adding sun
let geometry_sun = new THREE.SphereGeometry(7, 24, 24);
let material_sun = new THREE.MeshPhongMaterial({ color: 0xFFC303 });
let sun = new THREE.Mesh(geometry_sun, material_sun);

// Earth - the only planet in the beggining
let geometry_earth = new THREE.SphereGeometry(1, 24, 24);
let material_earth = new THREE.MeshPhongMaterial({ color: 0x00AAFA });
let earth = new THREE.Mesh(geometry_earth, material_earth);

scene.add(sun);
scene.add(earth);

let planets = [];
planets.push(earth);

// Animate function 
function makeCircle(r) {
  let points = [];
  let incr = Math.random() * (0.1 - 0.005) + 0.005;
  let alpha = Math.random() * 2 * Math.PI;
  let gamma = Math.random() * 2 * Math.PI;
  for (beta = 0; beta < 2 * Math.PI; beta += incr) {
    points.push([
      r * Math.cos(alpha + beta) * Math.sin(gamma),
      r * Math.sin(alpha + beta),
      r * Math.cos(alpha + beta) * Math.cos(gamma)
    ]);
  }
  return points;
}

let paths = [];
paths.push(makeCircle(20));

let i = 0;
function animate() {
  requestAnimationFrame(animate);

  // Axis rotation
  sun.rotation.y += 0.025;

  // Orbit
  for (let j = 0; j < planets.length; j++) {
    let len = paths[j].length;
    planets[j].position.x = paths[j][i % len][0];
    planets[j].position.y = paths[j][i % len][1];
    planets[j].position.z = paths[j][i % len][2];
  } i++;

  renderer.render(scene, camera);
  controls.update();
}

animate();

// User controls
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  controls.handleResize();
  renderer.render();
}
window.addEventListener('resize', onWindowResize, false);

// Add planet functionality
let r = 25;
document.getElementById('add-planet').onclick = function () {
  let color = Math.random() * 0xFFC303;
  let geometry = new THREE.SphereGeometry(Math.random() * 2 + 0.5, 24, 24);
  let material = new THREE.MeshPhongMaterial({ color });
  let planet = new THREE.Mesh(geometry, material);
  planets.push(planet);
  paths.push(makeCircle(r));
  scene.add(planet);
  r += 5;
}