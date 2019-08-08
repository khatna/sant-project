// Setting up RENDERER, SCENE AND CAMERA
var renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

var camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 500);
camera.position.set(0, 10, 35);
camera.lookAt(0, 0, 0);

var scene = new THREE.Scene();
scene.background = new THREE.Color(0x000000);

// LIGHTS
var ambientLight = new THREE.AmbientLight(0x333333);	// 0.2
var light = new THREE.DirectionalLight(0xFFFFFFF, 0.8);
light.position.set(50, 200, 300).normalize();

// direction is set in GUI
scene.add(ambientLight);
scene.add(light);
        
// OBJECTS
var geometry_sun = new THREE.SphereGeometry(5, 30, 30);
var material_sun = new THREE.MeshPhongMaterial({color: 0xFFC303});
var sun = new THREE.Mesh(geometry_sun, material_sun);

var geometry_earth = new THREE.SphereGeometry(1, 30, 30);
var material_earth = new THREE.MeshPhongMaterial({color: 0x00AAFA});
var earth = new THREE.Mesh(geometry_earth, material_earth);
earth.position.x = 15 * Math.sin(Math.PI / 4);
earth.position.z = earth.position.x;

scene.add(sun);
scene.add(earth);

// Animate function 
var theta, vx, vz;
const v = 0.4;

function makeCircle(r) {
  let points = [];
  for (theta = 0; theta < 2 * Math.PI; theta += 0.1) {
    points.push([15*Math.cos(theta), 15*Math.sin(theta)]);
  }
  return points;
}

let i = 0;
let earth_d = makeCircle(10);
function animate() {
  requestAnimationFrame(animate);

  // Axis rotation
  sun.rotation.y += 0.01;
  sun.rotation.x += 0.005;
  earth.rotation.y += 0.01;
  earth.rotation.x += 0.005;

  // Orbit
  let len = earth_d.length;
  earth.position.x = earth_d[i % len][0];
  earth.position.z = earth_d[i % len][1];
  i++;

  renderer.render(scene, camera);
}

animate();