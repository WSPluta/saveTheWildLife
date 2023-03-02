let canvas;
let player;

// Setup the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
renderer.physicallyCorrectLights = true;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Create a new loader
const loader = new THREE.GLTFLoader();

// Load the GLTF model
loader.load(
  'models/boat.gltf', // URL of the model
  function (gltf) {
    const boat = gltf.scene.children[0];

    // Set the boat's position and scale
    boat.position.set(0, 0, 0);
    boat.scale.set(1, 1, 1);
    boat.rotation.set(0,0,0);


    
    // Add the boat to the scene
    scene.add(boat);
    player=boat

  },
  undefined, // onProgress callback function
  function (error) {
    console.error(error);
  }
);

// Load the GLTF model
loader.load(
  'models/turtle.gltf', // URL of the model
  function (gltf) {
    const turtle = gltf.scene.children[0];

    // Set the turtle's position and scale
    turtle.position.set(5, 0, 0);
    turtle.scale.set(1, 1, 1);
    turtle.rotation.set(0,0,0);

    // Add the turtle to the scene
    scene.add(turtle);
    turtle.type = 'wildlife';
objects.push(turtle);

  },
  undefined, // onProgress callback function
  function (error) {
    console.error(error);
  }
);

const planeGeometry = new THREE.PlaneGeometry(23, 8);
const planeMaterial = new THREE.MeshPhongMaterial({ color: 0x0000FF });
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.position.set(0, 0, 0);
scene.add(plane);

// Add event listener to resize renderer when the window is resized
window.addEventListener('resize', function () {
  var width = window.innerWidth;
  var height = window.innerHeight;
  renderer.setSize(width, height);
  camera.aspect = width / height;
  camera.updateProjectionMatrix();
});


// Create an array to store the objects in the scene
const objects = [];

// Set up the timer
var timer = 180; // 3 minutes in seconds
// Create a variable to store the remaining time
let remainingTime = timer;
var timerDiv = document.createElement('div');
timerDiv.style.position = 'absolute';
timerDiv.style.top = '45px';
timerDiv.style.left = '10px';
timerDiv.style.color = 'white';
timerDiv.innerHTML = 'Time: ' + timer;
document.body.appendChild(timerDiv);
console.log(timer);

// Create a function to update the timer
function updateTimer() {
  // Subtract 1 second from the remaining time
  remainingTime--;

  // Check if the time has run out
  if (remainingTime <= 0) {
    // Display a message or trigger an event to indicate that time is up
    console.log("Time's up!");
    
    // Trigger game over event
    gameOver();
    
    return;
  }

  // Display the remaining time on the screen
  timerDiv.innerHTML = 'Time: ' + remainingTime;
  
  // Spawn trash and marine wildlife every 10 seconds
  if (remainingTime % 10 === 0) {
    createRandomObject();
  }

  // Schedule the next update in 1 second
  setTimeout(updateTimer, 1000);
}

// Start the timer
updateTimer();

function restart() {
  // Hide the restart button
  restartBtn.style.display = 'none';

  // Remove all objects from the scene
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    scene.remove(object);
  }
  objects.length = 0;

  // Reset the player's position and score
  player.position.set(0, 0, 0);
  score = 0;

  // Display the player's score on the screen
  scoreElement.innerHTML = 'Score: ' + score;

  // Reset the remaining time and display it on the screen
  remainingTime = timer;
  timerDiv.innerHTML = 'Time: ' + remainingTime;

  // Restart the timer
  updateTimer();
}

function gameOver() {
  // Display a message or trigger an event to indicate that the game is over
  console.log("Game over!");

  // Remove all objects from the scene
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];
    scene.remove(object);
  }
  objects.length = 0;

  // Reset the player's position and score
  player.position.set(0, 0, 0);
  score = 0;

  // Display the player's score on the screen
  scoreElement.innerHTML = 'Score: ' + score;

  // Reset the remaining time and display it on the screen
  remainingTime = timer;
  timerDiv.innerHTML = 'Time: ' + remainingTime;

  // Create a restart button
  const restartBtn = document.createElement('button');
  restartBtn.innerHTML = 'Restart';
  restartBtn.style.position = 'absolute';
  restartBtn.style.top = '100px';
  restartBtn.style.left = '10px';
  restartBtn.addEventListener('click', function() {
    // Reload the page to restart the game
    window.location.reload();
  });
  document.body.appendChild(restartBtn);

  // Stop the timer
  clearTimeout(timerId);
}

// Create a variable to store the timer ID
let timerId;

// Create a function to start the timer
function startTimer() {
  timerId = setTimeout(function() {
    // Display a message or trigger an event to indicate that time is up
    console.log("Time's up!");

    // Trigger game over event
    gameOver();
  }, timer * 1000);
}

// Start the timer
startTimer();

// Create a variable to keep track of the player's score
var score = 0;

// Display the player's score on the screen
var scoreElement = document.createElement('div');
scoreElement.style.position = 'absolute';
scoreElement.style.top = '10px';
scoreElement.style.left = '10px';
scoreElement.style.color = 'white';
scoreElement.style.fontSize = '24px';
scoreElement.innerHTML = 'Score: ' + score;
document.body.appendChild(scoreElement);
console.log(score);

const materials = [
  new THREE.MeshPhongMaterial({ color: 0x00ff00 }), // Green material for wildlife
  new THREE.MeshPhongMaterial({ color: 0xff0000 }), // Red material for trash
];

const geometries = [
  new THREE.SphereGeometry(),
  new THREE.BoxGeometry(),
];

// Create a random trash or wildlife object
function createRandomObject() {
  const isWildlife = Math.random() < 0.5; // 50% chance of being wildlife
  const geometry = isWildlife ? geometries[0] : geometries[1]; // Use sphere geometry for wildlife, cube geometry for trash
  const material = isWildlife ? materials[0] : materials[1];
  const object = new THREE.Mesh(geometry, material);
  object.position.set(
    Math.random() * 10 - 5, 
    Math.random() * 10 - 5, 0);
  const scale = Math.random() * 1; // Random scale value between 1 and 15
  object.scale.set(scale, scale, scale);
  object.type = isWildlife ? 'wildlife' : 'trash';
  scene.add(object);
  objects.push(object);
  console.table({
    Type: geometry.type,
    Color: material.color.getHexString(),
    Position: object.position.toArray().join(", "),
    Scale: object.scale.toArray().join(", "),
    ObjectType: object.type,
  });
}




// Check for collisions between the player and each object in the scene
function checkCollisions() {
  // Create a bounding box for the player
  const playerBox = new THREE.Box3().setFromObject(player);

  // Loop through each object in the scene
  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];

    // Create a bounding box for the object
    const objectBox = new THREE.Box3().setFromObject(object);

    // Check if the player's bounding box intersects with the object's bounding box
    if (playerBox.intersectsBox(objectBox)) {
      // Remove the object from the scene and the objects array
      scene.remove(object);
      objects.splice(i, 1);

      // Add or deduct points based on the object type
      if (object.type === 'trash') {
        score++;
        console.log("Score:", score);
      } else if (object.type === 'wildlife') {
        score--;
        console.log("Score:", score);
      }

      // Update the score element on the page
      scoreElement.innerHTML = 'Score: ' + score;
      // ... existing code to log the object information ...
    }
  }
}

function createObject() {
  createRandomObject();
  const timeInterval = Math.floor(Math.random() * 9000) + 1000; // Random time interval between 1 and 10 seconds
  setTimeout(createObject, timeInterval);
}

// Call createObject to start creating objects
createObject();

// Add ambient light to the scene
const ambientLight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientLight);

// Add directional light to the scene
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.90);
directionalLight.position.set(0, 0, 100);
scene.add(directionalLight);

// Position the camera to view the scene
camera.position.z = 5;

// Listen for keyboard events
var keyboard = {};
document.addEventListener("keydown", function (event) {
  keyboard[event.code] = true;
});
document.addEventListener("keyup", function (event) {
  keyboard[event.code] = false;
});

const playerSpeed = 0.1;

// Update the position of the player based on keyboard input
function updatePlayerPosition() {
  // Update the player's position based on keyboard input
  if (keyboard["ArrowUp"]) {
    player.position.y = Math.min(player.position.y +playerSpeed+ 0.1, plane.geometry.parameters.height / 2);
    player.rotation.z = 0 ; // Set player rotation to north
  }
  if (keyboard["ArrowDown"]) {
    player.position.y = Math.max(player.position.y - 0.1, -plane.geometry.parameters.height / 2);
    player.rotation.z = Math.PI* 1 ; // Set player rotation to south
  }
  if (keyboard["ArrowLeft"]) {
    player.position.x = Math.max(player.position.x - 0.1, -plane.geometry.parameters.width / 2);
    player.rotation.z = Math.PI / 2; // Set player rotation to west
  }
  if (keyboard["ArrowRight"]) {
    player.position.x = Math.min(player.position.x + 0.1, plane.geometry.parameters.width / 2);
    player.rotation.z = -Math.PI / 2; // Set player rotation to east
  }
  if (keyboard["ArrowUp"] && keyboard["ArrowRight"]) {
    player.position.y = Math.min(player.position.y + 0.1, plane.geometry.parameters.height / 2);
    player.position.x = Math.min(player.position.x + 0.1, plane.geometry.parameters.width / 2);
    player.rotation.z = -Math.PI / 4; // Set player rotation to northeast
  }
  if (keyboard["ArrowUp"] && keyboard["ArrowLeft"]) {
    player.position.y = Math.min(player.position.y + 0.1, plane.geometry.parameters.height / 2);
    player.position.x = Math.max(player.position.x - 0.1, -plane.geometry.parameters.width / 2);
    player.rotation.z = Math.PI / 4; // Set player rotation to northwest
  }
  if (keyboard["ArrowDown"] && keyboard["ArrowRight"]) {
    player.position.y = Math.max(player.position.y - 0.1, -plane.geometry.parameters.height / 2);
    player.position.x = Math.min(player.position.x + 0.1, plane.geometry.parameters.width / 2);
    player.rotation.z = -Math.PI * 0.75; // Set player rotation to southeast
  }
  if (keyboard["ArrowDown"] && keyboard["ArrowLeft"]) {
    player.position.y = Math.max(player.position.y - 0.1, -plane.geometry.parameters.height / 2);
    player.position.x = Math.max(player.position.x - 0.1, -plane.geometry.parameters.width / 2);
    player.rotation.z = Math.PI * 0.75; // Set player rotation to southwest
  }
  
  // Create a bounding box for the plane
  const planeBoundingBox = new THREE.Box3().setFromObject(plane);

  // Create a bounding box for the player
  const playerBoundingBox = new THREE.Box3().setFromObject(player);

  // Check for intersection between the two bounding boxes
  if (playerBoundingBox.intersectsBox(planeBoundingBox)) {
    // Allow movement
    player.position.z = 0;
    // console.log("Player is on the plane.");
  } else {
    // Limit movement to the plane
    player.position.z = Math.max(player.position.z, 0);
    // console.log("Player is outside the plane.");
  }

  // Update the camera position to follow the player
  camera.position.x = player.position.x;
  camera.position.y = player.position.y;
  camera.position.z = player.position.z + 5;
  checkCollisions();
}


// Create an arrow to navigate player to objects
const arrowGeometry = new THREE.ConeGeometry(0.5, 1, 8);
const arrowMaterial = new THREE.MeshBasicMaterial({ color: 0xff0000 });
const arrow = new THREE.Mesh(arrowGeometry, arrowMaterial);
scene.add(arrow);

// Update the arrow position to point to the nearest object that is not within the camera range
function updateArrowPosition() {
  // Find the nearest object that is not within the camera range
  let nearestObject = null;
  let nearestDistance = Infinity;

  for (let i = 0; i < objects.length; i++) {
    const object = objects[i];

    // Check if the object is not within the camera range
    if (!isObjectWithinCameraRange(object)) {
      // Calculate the distance between the player and the object
      const distance = player.position.distanceTo(object.position);

      // Update the nearest object and distance if this object is closer
      if (distance < nearestDistance) {
        nearestObject = object;
        nearestDistance = distance;
      }
    }
  }

  // Update the arrow position and rotation to point to the nearest object
  if (nearestObject) {
    arrow.position.copy(player.position);
    arrow.position.z = 2;
    arrow.rotation.z = Math.atan2(
      nearestObject.position.y - player.position.y,
      nearestObject.position.x - player.position.x
    );
    arrow.visible = true;
  } else {
    arrow.visible = false;
  }
}

// Check if an object is within the camera range
function isObjectWithinCameraRange(object) {
  const distance = camera.position.distanceTo(object.position);
  return distance < 10;
}

// Render the scene
function animate() {
  requestAnimationFrame(animate);
  updatePlayerPosition();
  renderer.render(scene, camera);
  checkCollisions();
  updateArrowPosition();
}
animate();

var light = new THREE.PointLight(0xffffff, 0.1, 0.1);
light.position.set(0, 1, 0);
player.add(light);