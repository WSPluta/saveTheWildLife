// Setup the scene
var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

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

var playerGeometry = new THREE.BoxGeometry(1, 1, 1);
var playerMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
var player = new THREE.Mesh(playerGeometry, playerMaterial);
player.position.set(0, 0, 0);
scene.add(player);

const materials = [
  new THREE.MeshBasicMaterial({ color: 0x00ff00 }), // Green material for wildlife
  new THREE.MeshBasicMaterial({ color: 0xff0000 }), // Red material for trash
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
  object.position.set(Math.random() * 10 - 5, Math.random() * 10 - 5, 0);
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

// Create a light to illuminate the scene
var light = new THREE.PointLight(0xffffff, 1, 100);
light.position.set(0, 0, 0);
scene.add(light);

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

// Update the position of the player based on keyboard input
function updatePlayerPosition() {
  if (keyboard["ArrowUp"]) {
    player.position.y += 0.1;
  }
  if (keyboard["ArrowDown"]) {
    player.position.y -= 0.1;
  }
  if (keyboard["ArrowLeft"]) {
    player.position.x -= 0.1;
  }
  if (keyboard["ArrowRight"]) {
    player.position.x += 0.1;
  }
  checkCollisions();
  // console.table({
  //   Position: player.position.toArray().join(", "),
  // });
    // Limit the player's movement to the boundaries of the map
    var halfMapWidth = mapGeometry.parameters.width / 2;
    var halfMapDepth = mapGeometry.parameters.height / 2;
    var playerX = player.position.x;
    var playerZ = player.position.z;
    if (playerX < -halfMapWidth) playerX = -halfMapWidth;
    if (playerX > halfMapWidth) playerX = halfMapWidth;
    if (playerZ < -halfMapDepth) playerZ = -halfMapDepth;
    if (playerZ > halfMapDepth) playerZ = halfMapDepth;
    player.position.x = playerX;
    player.position.z = playerZ;
  
}



var mapGeometry = new THREE.PlaneGeometry(50, 50);
var mapTexture = new THREE.TextureLoader().load('path/to/map.jpg');
var mapMaterial = new THREE.MeshBasicMaterial({ map: mapTexture });
var map = new THREE.Mesh(mapGeometry, mapMaterial);
map.rotation.x = -Math.PI / 2; // Rotate the map to lay flat on the ground
scene.add(map);

// Disable scrolling and right-clicking on the page
document.addEventListener('contextmenu', function (event) {
  event.preventDefault();
});
document.addEventListener('wheel', function (event) {
  event.preventDefault();
});


// Vertex shader
const waterVertexShader = `
  uniform float time;
  varying vec2 vUv;
  void main() {
    vUv = uv;
    vec3 pos = position;
    pos.z = sin(pos.x * 10.0 + time * 2.0) * 2.0 + sin(pos.y * 10.0 + time * 2.0) * 2.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

// Fragment shader
const waterFragmentShader = `
  uniform float time;
  uniform sampler2D map;
  varying vec2 vUv;
  void main() {
    vec4 color = texture2D(map, vUv);
    gl_FragColor = vec4(color.rgb * 0.2 + vec3(0.0, 0.1, 0.3) * 0.8, color.a);
    gl_FragColor.rgb += vec3(0.0, 0.1, 0.3) * sin(time * 2.0) * 0.1;
  }
`;

// Create water geometry
var waterGeometry = new THREE.PlaneGeometry(50, 50);
var waterMaterial = new THREE.MeshBasicMaterial({ color: 0x00aaff });
var water = new THREE.Mesh(waterGeometry, waterMaterial);
water.rotation.x = -Math.PI / 2;
water.position.set(0, -1, 0);
scene.add(water);



// Render the scene
function animate() {
  requestAnimationFrame(animate);
  updatePlayerPosition();
  renderer.render(scene, camera);
  checkCollisions();
  updatePlayerPosition();
  water.material.uniforms.time.value += 0.1;
  renderer.render(scene, camera);
}
animate();

