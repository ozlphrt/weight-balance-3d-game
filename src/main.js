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
  
  // Cannon-es physics body
  const shape = new CANNON.Plane();
  const body = new CANNON.Body({ mass: 0 }); // Static body
  body.addShape(shape);
  body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  
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
    cube.body.position.y < -2 || 
    Math.abs(cube.body.position.x) > 3 || 
    Math.abs(cube.body.position.z) > 3
  );
  
  if (fallenCubes.length > 0) {
    console.log('Tower has fallen!');
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
