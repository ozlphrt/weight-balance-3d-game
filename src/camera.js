// Weight Balance - Camera Controls
import * as THREE from 'three';

// Setup camera with orbit controls
export function setupCamera(renderer) {
  // Create perspective camera
  const camera = new THREE.PerspectiveCamera(
    75, // FOV
    window.innerWidth / window.innerHeight, // Aspect ratio
    0.1, // Near plane
    100 // Far plane
  );
  
  // Position camera for optimal game view - higher and better angle
  camera.position.set(6, 8, 6);
  camera.lookAt(0, 2, 0); // Look at platform level, not ground level
  
  // Setup orbit controls
  setupOrbitControls(camera, renderer);
  
  return camera;
}

// Setup orbit controls for camera movement
function setupOrbitControls(camera, renderer) {
  let isLeftMouseDown = false;
  let isRightMouseDown = false;
  let mouseX = 0, mouseY = 0;
  let targetX = 0, targetY = 0;
  let currentX = 0, currentY = 0;
  let targetPanX = 0, targetPanY = 0;
  let currentPanX = 0, currentPanY = 0;
  
  // Camera orbit parameters
  let radius = 10;
  const minRadius = 3;
  const maxRadius = 25;
  const target = new THREE.Vector3(0, 2, 0); // Target platform level
  
  // Set initial orbit angles for better view
  currentX = Math.PI / 4; // 45 degrees around
  currentY = Math.PI / 6; // 30 degrees up
  targetX = currentX;
  targetY = currentY;
  
  // Update camera position based on orbit
  function updateCameraPosition() {
    const x = Math.cos(currentY) * Math.cos(currentX) * radius;
    const y = Math.sin(currentY) * radius;
    const z = Math.cos(currentY) * Math.sin(currentX) * radius;
    
    camera.position.set(x + currentPanX, y + currentPanY, z);
    camera.lookAt(target.x + currentPanX, target.y + currentPanY, target.z);
  }
  
  // Mouse event handlers
  function onMouseDown(event) {
    if (event.button === 0) { // Left click - orbit
      isLeftMouseDown = true;
      renderer.domElement.style.cursor = 'grabbing';
    } else if (event.button === 2) { // Right click - pan
      isRightMouseDown = true;
      renderer.domElement.style.cursor = 'move';
    }
    
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  
  function onMouseUp(event) {
    if (event.button === 0) {
      isLeftMouseDown = false;
    } else if (event.button === 2) {
      isRightMouseDown = false;
    }
    
    if (!isLeftMouseDown && !isRightMouseDown) {
      renderer.domElement.style.cursor = 'grab';
    }
  }
  
  function onMouseMove(event) {
    const deltaX = event.clientX - mouseX;
    const deltaY = event.clientY - mouseY;
    
    if (isLeftMouseDown) {
      // Left click - orbit around target
      targetX += deltaX * 0.01;
      targetY += deltaY * 0.01;
      
      // Clamp vertical rotation
      targetY = Math.max(-Math.PI/2 + 0.1, Math.min(Math.PI/2 - 0.1, targetY));
    } else if (isRightMouseDown) {
      // Right click - pan camera
      const panSpeed = 0.01;
      targetPanX -= deltaX * panSpeed;
      targetPanY += deltaY * panSpeed;
    }
    
    mouseX = event.clientX;
    mouseY = event.clientY;
  }
  
  function onWheel(event) {
    event.preventDefault();
    
    // More responsive zoom
    const delta = event.deltaY * 0.002; // Increased sensitivity
    radius += delta;
    
    // Clamp radius
    radius = Math.max(minRadius, Math.min(maxRadius, radius));
    
    updateCameraPosition();
  }
  
  // Prevent context menu on right click
  function onContextMenu(event) {
    event.preventDefault();
  }
  
  // Smooth camera movement
  function animate() {
    currentX += (targetX - currentX) * 0.1;
    currentY += (targetY - currentY) * 0.1;
    currentPanX += (targetPanX - currentPanX) * 0.1;
    currentPanY += (targetPanY - currentPanY) * 0.1;
    
    updateCameraPosition();
    requestAnimationFrame(animate);
  }
  
  // Add event listeners
  renderer.domElement.addEventListener('mousedown', onMouseDown);
  renderer.domElement.addEventListener('mouseup', onMouseUp);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('wheel', onWheel);
  renderer.domElement.addEventListener('contextmenu', onContextMenu);
  
  // Start animation
  animate();
  
  // Initial camera position
  updateCameraPosition();
}
