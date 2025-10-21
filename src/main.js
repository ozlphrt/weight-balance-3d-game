// Weight Balance - Main Application Entry Point
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { createScene } from './scene.js';
import { createPhysicsWorld } from './physics.js';
import { setupCamera } from './camera.js';
import { createCube, loadCubeModel } from './cubes.js';
import { setupPlacement } from './placement.js';
import { showRestartButton, hideRestartButton } from './utils.js';
import { initializeUI, changeColorScheme, clearRegisteredMeshes } from './ui.js';

// Global application state
let scene, renderer, camera, physicsWorld;
let isGameRunning = false;
let cubes = [];
let platform;

// Initialize the application
async function init() {
  console.log('Initializing Weight Balance...');
  
  try {
    // Load cube model first
    console.log('Loading cube model...');
    await loadCubeModel();
    
    // Create Three.js scene
    scene = createScene();
    
    // Create renderer
    renderer = new THREE.WebGLRenderer({ 
      canvas: document.getElementById('gameCanvas'),
      antialias: true 
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Create physics world
    physicsWorld = createPhysicsWorld();
    
    // Setup camera
    camera = setupCamera(renderer);
    
    // Create platform
    platform = createPlatform();
    scene.add(platform.mesh);
    physicsWorld.addBody(platform.body);
    
    // Setup placement system
    setupPlacement(scene, camera, renderer, physicsWorld, onCubePlaced);
    
    // Initialize UI (color schemes and FPS counter)
    initializeUI();
    
    // Start render loop
    startRenderLoop();
    
    // Handle window resize
    window.addEventListener('resize', onWindowResize);
    
    isGameRunning = true;
    console.log('Weight Balance initialized successfully!');
    
    // Add three random cubes at startup (with small delay to ensure everything is ready)
    setTimeout(() => {
      addRandomStartupCubes();
    }, 500);
    
  } catch (error) {
    console.error('Failed to initialize Weight Balance:', error);
  }
}

// Create the base platform
function createPlatform() {
  // Three.js mesh
  const geometry = new THREE.PlaneGeometry(5, 5);
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x1A5A1A, // Darker, less saturated green
    metalness: 0.0,        // Non-metallic surface
    roughness: 1.0,        // Maximum roughness for gaming cloth (no reflection)
    transparent: true,
    opacity: 0.9
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.rotation.x = -Math.PI / 2; // Rotate to be horizontal
  mesh.receiveShadow = true;
  
  // Cannon-es physics body - use a thin box instead of infinite plane
  const platformSize = 5;
  const platformThickness = 0.1;
  const shape = new CANNON.Box(new CANNON.Vec3(platformSize/2, platformThickness/2, platformSize/2));
  const body = new CANNON.Body({ mass: 0 }); // Static body
  body.addShape(shape);
  body.position.set(0, -platformThickness/2, 0); // Position slightly below Y=0
  
  return { mesh, body };
}


// Render loop
function startRenderLoop() {
  function animate() {
    requestAnimationFrame(animate);
    
    if (!isGameRunning) return;
    
    // Update physics
    physicsWorld.step(1/60);
    
    // Sync physics bodies with Three.js meshes
    cubes.forEach(cube => {
      cube.mesh.position.copy(cube.body.position);
      cube.mesh.quaternion.copy(cube.body.quaternion);
    });
    
    // Render scene
    renderer.render(scene, camera);
    
    // Check for tower fall
    checkTowerStability();
  }
  
  animate();
}

// Check if tower has fallen
function checkTowerStability() {
  const fallenCubes = cubes.filter(cube => 
    cube.body.position.y < -3 || // Fallen well below platform level
    Math.abs(cube.body.position.x) > 3.5 || // Fallen beyond platform edges with buffer
    Math.abs(cube.body.position.z) > 3.5    // Fallen beyond platform edges with buffer
  );
  
  if (fallenCubes.length > 0) {
    console.log('Game Over! Cube(s) fell off the platform:', fallenCubes.length);
    showRestartButton();
    isGameRunning = false;
  }
}

// Handle cube placement
function onCubePlaced(cube) {
  cubes.push(cube);
  scene.add(cube.mesh);
  physicsWorld.addBody(cube.body);
  console.log(`Cube placed: weight ${cube.weight}`);
}

// Add random startup cubes that fall one after another
function addRandomStartupCubes() {
  console.log('=== STARTUP CUBES FUNCTION CALLED ===');
  console.log('Scene:', scene);
  console.log('Physics world:', physicsWorld);
  console.log('Adding three cubes that fall one after another...');
  
  // Base position - center of platform
  const baseX = 0;
  const baseZ = 0;
  const baseY = 4; // Above platform
  
  // Function to add a single cube
  function addSingleCube(cubeIndex) {
    if (cubeIndex >= 3) return; // Stop after 3 cubes
    
    // Random weight (1-5)
    const weight = Math.floor(Math.random() * 5) + 1;
    
    // Very close positions to ensure collision
    const offsetX = (Math.random() - 0.5) * 0.8; // -0.4 to 0.4
    const offsetZ = (Math.random() - 0.5) * 0.8; // -0.4 to 0.4
    const offsetY = Math.random() * 0.5; // 0 to 0.5 (slight height variation)
    
    const x = baseX + offsetX;
    const z = baseZ + offsetZ;
    const y = baseY + offsetY;
    
    // Create cube with position
    const position = { x, y, z };
    const cube = createCube(weight, position);
    
    // Add some random rotation for more interesting physics
    const randomRotation = Math.random() * Math.PI * 2;
    cube.mesh.rotation.y = randomRotation;
    cube.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), randomRotation);
    
    // Add to scene and physics
    console.log(`Adding cube ${cubeIndex + 1} to scene and physics...`);
    scene.add(cube.mesh);
    physicsWorld.addBody(cube.body);
    
    // Add to cubes array
    cubes.push(cube);
    
    console.log(`✅ Added cube ${cubeIndex + 1}: weight ${weight} at (${x.toFixed(2)}, ${y.toFixed(2)}, ${z.toFixed(2)})`);
    console.log(`Total cubes in array: ${cubes.length}`);
    
    // Wait for this cube to land before dropping the next one
    // Check if cube has landed (Y position close to platform level)
    const checkLanding = () => {
      if (cube.body.position.y <= 1.5) { // Close to platform level
        console.log(`Cube ${cubeIndex + 1} has landed, dropping next cube...`);
        // Wait a bit more for physics to settle, then drop next cube
        setTimeout(() => {
          addSingleCube(cubeIndex + 1);
        }, 500); // 500ms delay after landing
      } else {
        // Check again in 100ms
        setTimeout(checkLanding, 100);
      }
    };
    
    // Start checking for landing after a short delay
    setTimeout(checkLanding, 200);
  }
  
  // Start with the first cube
  addSingleCube(0);
  
  console.log('Sequential startup cubes scheduled!');
}

// Make color scheme function globally available
window.changeColorScheme = changeColorScheme;

// Restart game
window.restartGame = function() {
  console.log('Restarting game...');
  
  // Remove all cubes
  cubes.forEach(cube => {
    scene.remove(cube.mesh);
    physicsWorld.removeBody(cube.body);
  });
  cubes = [];
  
  // Clear registered meshes for UI
  clearRegisteredMeshes();
  
  // Hide restart button
  hideRestartButton();
  
  // Resume game
  isGameRunning = true;
  
  console.log('Game restarted!');
};

// Add keyboard controls
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  
  if (key === 'r') {
    event.preventDefault();
    restartGame();
    console.log('Game restarted via R key');
  }
});

// Handle window resize
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// Start the application
init();
