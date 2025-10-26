// Weight Balance - Main Application Entry Point
import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { createScene } from './scene.js';
import { createPhysicsWorld } from './physics.js';
import { setupCamera } from './camera.js';
import { createCube } from './cubes.js';
import { setupPlacement } from './placement.js';
import { showRestartButton, hideRestartButton } from './utils.js';
import { initializeUI, changeColorScheme, clearRegisteredMeshes } from './ui.js';
// import { audioManager } from './audio.js';

// Global application state
let scene, renderer, camera, physicsWorld;
let isGameRunning = false;
let cubes = [];
let platform;

// Object pooling for better performance
let cubePool = [];
const MAX_POOL_SIZE = 20;

// Game mechanics state
let gameScore = 0;
let currentLevel = 1;
let targetWeight = 8; // Target total weight for current level
let gameStartTime = 0;
let isGameWon = false;

// Initialize the application
async function init() {
  console.log('Initializing Weight Balance...');
  
  try {
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
    gameStartTime = Date.now();
    console.log('Weight Balance initialized successfully!');
    
    // Show initial level objective
    setTimeout(() => {
      showLevelObjective();
    }, 1000);
    
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
  // Three.js mesh with rounded box geometry
  const platformSize = 8; // Increased by 60% (5 * 1.6 = 8) for more visible difference
  const platformThickness = 0.3; // Increased thickness for better visual appeal
  const cornerRadius = 0.5; // Rounded corners
  
  // Create rounded box geometry
  const geometry = new THREE.BoxGeometry(
    platformSize, 
    platformThickness, 
    platformSize,
    8, // width segments
    2, // height segments  
    8  // depth segments
  );
  
  // Create smooth rounded corners using a better algorithm
  const positionAttribute = geometry.getAttribute('position');
  const positions = positionAttribute.array;
  
  for (let i = 0; i < positions.length; i += 3) {
    const x = positions[i];
    const y = positions[i + 1];
    const z = positions[i + 2];
    
    // Only modify vertices on the top and bottom faces
    if (Math.abs(y) > platformThickness/2 - 0.01) {
      const halfSize = platformSize / 2;
      
      // Calculate distance from each corner
      const cornerDistances = [
        Math.sqrt((x - halfSize) * (x - halfSize) + (z - halfSize) * (z - halfSize)), // Top-right
        Math.sqrt((x + halfSize) * (x + halfSize) + (z - halfSize) * (z - halfSize)), // Top-left
        Math.sqrt((x - halfSize) * (x - halfSize) + (z + halfSize) * (z + halfSize)), // Bottom-right
        Math.sqrt((x + halfSize) * (x + halfSize) + (z + halfSize) * (z + halfSize))  // Bottom-left
      ];
      
      // Find the closest corner
      const minDistance = Math.min(...cornerDistances);
      
      // If we're in a corner region, apply rounding
      if (minDistance < cornerRadius) {
        const cornerIndex = cornerDistances.indexOf(minDistance);
        let cornerX, cornerZ;
        
        switch (cornerIndex) {
          case 0: cornerX = halfSize; cornerZ = halfSize; break;  // Top-right
          case 1: cornerX = -halfSize; cornerZ = halfSize; break; // Top-left
          case 2: cornerX = halfSize; cornerZ = -halfSize; break; // Bottom-right
          case 3: cornerX = -halfSize; cornerZ = -halfSize; break; // Bottom-left
        }
        
        // Calculate direction from corner to vertex
        const dx = x - cornerX;
        const dz = z - cornerZ;
        const distance = Math.sqrt(dx * dx + dz * dz);
        
        if (distance > 0) {
          // Normalize and scale to corner radius
          const normalizedX = dx / distance;
          const normalizedZ = dz / distance;
          
          positions[i] = cornerX + normalizedX * cornerRadius;
          positions[i + 2] = cornerZ + normalizedZ * cornerRadius;
        }
      }
    }
  }
  
  geometry.computeVertexNormals(); // Recalculate normals for smooth lighting
  
  const material = new THREE.MeshStandardMaterial({ 
    color: 0x006622, // Darker, more saturated green
    metalness: 0.0,        // Non-metallic surface
    roughness: 0.8,        // Slightly less rough for more appeal
    transparent: false,    // Solid, no transparency
    opacity: 1.0
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.y = -platformThickness/2; // Position so top is at Y=0
  mesh.receiveShadow = true;
  mesh.castShadow = true; // Platform can cast shadows too
  
  // Cannon-es physics body - use a box that matches the visual thickness
  const shape = new CANNON.Box(new CANNON.Vec3(platformSize/2, platformThickness/2, platformSize/2));
  const body = new CANNON.Body({ mass: 0 }); // Static body
  body.addShape(shape);
  body.position.set(0, -platformThickness/2, 0); // Position to match mesh

  return { mesh, body };
}

// Performance monitoring variables
let frameCount = 0;
let lastTime = 0;

// Render loop with performance monitoring
function startRenderLoop() {
  function animate(currentTime) {
    requestAnimationFrame(animate);
    
    if (!isGameRunning) return;
    
    // Update physics with simple fixed timestep
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
    
    // Update game score and check win conditions
    if (cubes.length > 0) {
      updateScore();
    }
    
    // Performance monitoring (every 120 frames = ~2 seconds)
    frameCount++;
    if (frameCount % 120 === 0) {
      console.log(`Performance: ${cubes.length} total cubes active`);
    }
  }
  
  animate(0);
}

// Check if tower has fallen
function checkTowerStability() {
  const fallenCubes = cubes.filter(cube =>
    cube.body.position.y < -3 || // Fallen well below platform level
    Math.abs(cube.body.position.x) > 4.5 || // Fallen beyond platform edges with buffer (8/2 + 0.5)
    Math.abs(cube.body.position.z) > 4.5    // Fallen beyond platform edges with buffer (8/2 + 0.5)
  );

  if (fallenCubes.length > 0) {
    console.log('Game Over! Cube(s) fell off the platform:', fallenCubes.length);
    
    // Play collapse sounds
    // audioManager.playCollapse('start');
    // setTimeout(() => audioManager.playCollapse('cascade'), 200);
    // setTimeout(() => audioManager.playGameOver(), 800);
    
    showRestartButton();
    isGameRunning = false;
  }
}

// Handle cube placement
function onCubePlaced(cube) {
  cubes.push(cube);
  scene.add(cube.mesh);
  physicsWorld.addBody(cube.body);
  
  // Play placement sound
  // audioManager.playCubePlacement(cube.weight);
  
  console.log(`Cube placed: weight ${cube.weight}`);
}

// Object pooling functions for better performance
function getPooledCube(weight, position) {
  // Try to reuse a cube from the pool
  for (let i = 0; i < cubePool.length; i++) {
    const pooledCube = cubePool[i];
    if (pooledCube.weight === weight) {
      // Reset the cube
      pooledCube.mesh.position.set(position.x, position.y, position.z);
      pooledCube.body.position.set(position.x, position.y, position.z);
      pooledCube.body.velocity.set(0, 0, 0);
      pooledCube.body.angularVelocity.set(0, 0, 0);
      pooledCube.body.wakeUp();
      
      // Remove from pool and return
      cubePool.splice(i, 1);
      return pooledCube;
    }
  }
  
  // If no pooled cube available, create new one
  return createCube(weight, position);
}

function returnCubeToPool(cube) {
  if (cubePool.length < MAX_POOL_SIZE) {
    // Remove from scene and physics world
    scene.remove(cube.mesh);
    physicsWorld.removeBody(cube.body);
    
    // Add to pool
    cubePool.push(cube);
  }
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
  
  // Return all cubes to pool instead of destroying them
  cubes.forEach(cube => {
    returnCubeToPool(cube);
  });
  cubes = [];
  
  // Clear registered meshes for UI
  clearRegisteredMeshes();
  
  // Reset game state
  gameScore = 0;
  currentLevel = 1;
  targetWeight = 8;
  gameStartTime = Date.now();
  isGameWon = false;
  
  // Hide restart button
  hideRestartButton();
  
  // Resume game
  isGameRunning = true;
  
  console.log(`Game restarted! Starting Level 1 - Target Weight: 8. Pool size: ${cubePool.length}`);
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

// Game mechanics functions
function calculateTowerWeight() {
  if (cubes.length === 0) return 0;
  
  // Check if all cubes have stabilized (not moving much)
  if (!areAllCubesStabilized()) {
    return 0; // Don't count weight until everything is stable
  }
  
  // Only count cubes that are part of towers with 2+ cubes
  const platformTolerance = 0.5;
  
  // Group cubes into towers based on proximity
  const towers = [];
  const processedCubes = new Set();
  
  cubes.forEach(cube => {
    if (processedCubes.has(cube) || cube.body.position.y < -platformTolerance) return;
    
    // Start a new tower with this cube
    const tower = [cube];
    processedCubes.add(cube);
    
    // Find all cubes that are stacked on top of this one
    let foundMore = true;
    while (foundMore) {
      foundMore = false;
      cubes.forEach(otherCube => {
        if (processedCubes.has(otherCube) || otherCube.body.position.y < -platformTolerance) return;
        
        // Check if this cube is stacked on any cube in the current tower
        tower.forEach(towerCube => {
          const distance = Math.sqrt(
            Math.pow(towerCube.body.position.x - otherCube.body.position.x, 2) +
            Math.pow(towerCube.body.position.z - otherCube.body.position.z, 2)
          );
          
          // If cubes are close horizontally and one is above the other
          if (distance < 0.8 && Math.abs(otherCube.body.position.y - towerCube.body.position.y) > 0.3) {
            tower.push(otherCube);
            processedCubes.add(otherCube);
            foundMore = true;
          }
        });
      });
    }
    
    // Only count towers with 2 or more cubes
    if (tower.length >= 2) {
      towers.push(tower);
    }
  });
  
  if (towers.length === 0) return 0;
  
  // Find the highest tower (by total height, not just cube count)
  let highestTower = null;
  let maxTowerHeight = 0;
  
  towers.forEach(tower => {
    let towerHeight = 0;
    let towerWeight = 0;
    
    tower.forEach(cube => {
      towerHeight = Math.max(towerHeight, cube.body.position.y + (cube.weight * 0.1));
      towerWeight += cube.weight;
    });
    
    if (towerHeight > maxTowerHeight) {
      maxTowerHeight = towerHeight;
      highestTower = tower;
    }
  });
  
  // Return weight of only the highest tower
  if (highestTower) {
    const totalWeight = highestTower.reduce((total, cube) => total + cube.weight, 0);
    console.log(`🏗️ Found ${towers.length} towers, tallest has ${highestTower.length} cubes, weight: ${totalWeight}`);
    return totalWeight;
  }
  
  return 0;
}

function areAllCubesStabilized() {
  if (cubes.length === 0) return true;
  
  const velocityThreshold = 0.5; // Cubes are stable if moving slower than this
  const angularVelocityThreshold = 0.3; // Cubes are stable if rotating slower than this
  
  return cubes.every(cube => {
    const velocity = cube.body.velocity.length();
    const angularVelocity = cube.body.angularVelocity.length();
    
    return velocity < velocityThreshold && angularVelocity < angularVelocityThreshold;
  });
}

function calculateTowerHeight() {
  if (cubes.length === 0) return 0;
  
  let maxHeight = 0;
  cubes.forEach(cube => {
    // Only count cubes that are on or above the platform level
    if (cube.body.position.y >= -0.5) {
      const height = cube.body.position.y + (cube.weight * 0.1); // Add cube size
      maxHeight = Math.max(maxHeight, height);
    }
  });
  
  return maxHeight;
}

function calculateTowerStability() {
  if (cubes.length === 0) return 0;
  
  // Calculate center of mass
  let totalMass = 0;
  let weightedX = 0, weightedY = 0, weightedZ = 0;
  
  cubes.forEach(cube => {
    const mass = cube.weight;
    totalMass += mass;
    weightedX += cube.body.position.x * mass;
    weightedY += cube.body.position.y * mass;
    weightedZ += cube.body.position.z * mass;
  });
  
  const centerOfMass = {
    x: weightedX / totalMass,
    y: weightedY / totalMass,
    z: weightedZ / totalMass
  };
  
  // Stability based on how close center of mass is to platform center
  const distanceFromCenter = Math.sqrt(centerOfMass.x * centerOfMass.x + centerOfMass.z * centerOfMass.z);
  const maxDistance = 4.0; // Platform radius (8/2)
  const stability = Math.max(0, 1 - (distanceFromCenter / maxDistance));
  
  return stability;
}

function updateScore() {
  const currentWeight = calculateTowerWeight();
  const height = calculateTowerHeight();
  const stability = calculateTowerStability();
  
  // Score based on weight achieved (more intuitive than height)
  const weightScore = currentWeight * 10; // 10 points per weight unit
  const stabilityBonus = Math.floor(stability * 50); // Up to 50 bonus points
  const efficiencyBonus = Math.floor((cubes.length > 0 ? 100 / cubes.length : 0)); // Fewer cubes = more points
  
  gameScore = weightScore + stabilityBonus + efficiencyBonus;
  
  // Update UI display
  updateGameUI(currentWeight, stability);
  
  // Play structure strain sounds based on stability
  // audioManager.playStructureStrain(stability);
  
  // Check win condition - based on weight total, not height
  if (currentWeight >= targetWeight && !isGameWon) {
    isGameWon = true;
    console.log(`🎉 Level ${currentLevel} Complete! Weight: ${currentWeight}, Score: ${gameScore}`);
    
    // Play level complete sound
    // audioManager.playLevelComplete();
    
    showLevelComplete();
  }
  
  return { weight: currentWeight, height, stability, score: gameScore };
}

function updateGameUI(currentWeight, stability) {
  const levelDisplay = document.querySelector('#levelDisplay .metric-value');
  const targetDisplay = document.querySelector('#targetDisplay .metric-value');
  const scoreDisplay = document.querySelector('#scoreDisplay .metric-value');
  const heightDisplay = document.querySelector('#heightDisplay .metric-value');
  
  if (levelDisplay) levelDisplay.textContent = currentLevel;
  if (targetDisplay) targetDisplay.textContent = targetWeight;
  if (scoreDisplay) scoreDisplay.textContent = gameScore;
  
  // Show weight or stabilization status
  if (heightDisplay) {
    if (cubes.length > 0 && !areAllCubesStabilized()) {
      heightDisplay.textContent = "⏳"; // Sandglass emoji
      heightDisplay.style.color = "#ffa500"; // Orange for stabilizing
    } else {
      heightDisplay.textContent = currentWeight;
      heightDisplay.style.color = "#4CAF50"; // Green for stable
    }
  }
}

function showLevelComplete() {
  const currentWeight = calculateTowerWeight();
  const height = calculateTowerHeight();
  const stability = calculateTowerStability();
  
  console.log(`🎉 LEVEL ${currentLevel} COMPLETE! 🎉`);
  console.log(`Final Weight: ${currentWeight} units`);
  console.log(`Final Height: ${height.toFixed(1)} units`);
  console.log(`Stability: ${(stability * 100).toFixed(1)}%`);
  console.log(`Final Score: ${gameScore}`);
  
  // Advance to next level
  currentLevel++;
  targetWeight = 8 + (currentLevel - 1) * 3; // Progressive weight targets: 8, 11, 14, 17...
  isGameWon = false;
  gameScore = 0;
  
  console.log(`Starting Level ${currentLevel} - Target Weight: ${targetWeight}`);
  
  // Show objective for next level
  showLevelObjective();
}

function showLevelObjective() {
  const objectiveOverlay = document.getElementById('levelObjective');
  const objectiveTitle = document.getElementById('objectiveTitle');
  const objectiveText = document.getElementById('objectiveText');
  const objectiveHint = document.getElementById('objectiveHint');
  
  if (!objectiveOverlay || !objectiveTitle || !objectiveText || !objectiveHint) return;
  
  // Update objective content
  objectiveTitle.textContent = `Level ${currentLevel}`;
  objectiveText.textContent = `Build a tower with ${targetWeight} total weight!`;
  
  // Add level-specific hints
  if (currentLevel === 1) {
    objectiveHint.textContent = "Build your highest tower! Only the tallest tower counts after all cubes stabilize.";
  } else if (currentLevel === 2) {
    objectiveHint.textContent = "Focus on one impressive tower - multiple small towers won't help you.";
  } else if (currentLevel === 3) {
    objectiveHint.textContent = "Build tall and stable - use heavier cubes at the bottom for better balance.";
  } else {
    objectiveHint.textContent = "Master the art of building one perfect tower!";
  }
  
  // Show overlay
  objectiveOverlay.classList.remove('hidden');
  objectiveOverlay.classList.add('show');
  
  // Auto-hide after 6 seconds (longer since there's now an OK button)
  setTimeout(() => {
    hideLevelObjective();
  }, 6000);
}

function hideLevelObjective() {
  const objectiveOverlay = document.getElementById('levelObjective');
  if (!objectiveOverlay) return;
  
  objectiveOverlay.classList.remove('show');
  
  // Hide completely after transition
  setTimeout(() => {
    objectiveOverlay.classList.add('hidden');
  }, 500);
}

// Make hideLevelObjective globally accessible
window.hideLevelObjective = hideLevelObjective;

// Add backup event listener for OK button
document.addEventListener('DOMContentLoaded', () => {
  const okButton = document.getElementById('objectiveOK');
  if (okButton) {
    okButton.addEventListener('click', (e) => {
      console.log('OK button clicked via event listener!');
      e.preventDefault();
      hideLevelObjective();
    });
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
