const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 2, -5);
camera.lookAt(0, 0, 0);

const renderer = new THREE.WebGLRenderer({ canvas: document.getElementById('game-canvas') });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xadd8e6);

let score = 0;
let timeLeft = 180; // 3 minutes in seconds

// Create player
const playerGeometry = new THREE.BoxGeometry(1, 1, 1);
const playerMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const playerMesh = new THREE.Mesh(playerGeometry, playerMaterial);
playerMesh.position.y = 0.5;
scene.add(playerMesh);

// Create lights
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.position.set(0, 10, 0);
scene.add(pointLight);

// Spawn trash and marine wildlife every 10 seconds
const spawnInterval = 10000; // 10 seconds in milliseconds
let timeSinceLastSpawn = 0;

const trashGeometry = new THREE.BoxGeometry(1, 1, 1);
const trashMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });

const wildlifeGeometry = new THREE.SphereGeometry(0.5, 16, 16);
const wildlifeMaterial = new THREE.MeshBasicMaterial({ color: 0xff3333 });

const trashMeshes = [];
const wildlifeMeshes = [];