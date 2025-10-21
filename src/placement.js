// Weight Balance - Surface Placement Logic
import * as THREE from 'three';
import { createCube } from './cubes.js';

// Setup placement system
export function setupPlacement(scene, camera, renderer, physicsWorld, onCubePlaced) {
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();
  
  // Available weights for placement
  const availableWeights = [1, 2, 3, 4, 5];
  let currentWeightIndex = 0;
  
  // Track mouse state to distinguish between click and drag
  let mouseDownPosition = { x: 0, y: 0 };
  let isDragging = false;
  const dragThreshold = 5; // pixels - minimum movement to consider it a drag
  
  // Mouse down handler
  function onMouseDown(event) {
    if (event.button === 0) { // Only left click
      mouseDownPosition.x = event.clientX;
      mouseDownPosition.y = event.clientY;
      isDragging = false;
    }
  }
  
  // Mouse move handler - track if we're dragging
  function onMouseMove(event) {
    if (event.buttons === 1) { // Left button is pressed
      const deltaX = Math.abs(event.clientX - mouseDownPosition.x);
      const deltaY = Math.abs(event.clientY - mouseDownPosition.y);
      
      if (deltaX > dragThreshold || deltaY > dragThreshold) {
        isDragging = true;
      }
    }
  }
  
  // Mouse up handler - only place cube if it wasn't a drag
  function onMouseUp(event) {
    if (event.button === 0 && !isDragging) { // Left click without drag
      // Calculate mouse position in normalized device coordinates
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
      
      // Update raycaster
      raycaster.setFromCamera(mouse, camera);
      
      // Find intersections with scene objects
      const intersects = raycaster.intersectObjects(scene.children, true);
      
      if (intersects.length > 0) {
        const intersection = intersects[0];
        const point = intersection.point;
        const face = intersection.face;
        
        // Check if we can place on this surface
        if (canPlaceOnSurface(intersection)) {
          // Calculate placement position
          const placementPosition = calculatePlacementPosition(point, face);
          
          // Get current weight
          const weight = availableWeights[currentWeightIndex];
          
          // Create cube
          const cube = createCube(weight, placementPosition);
          
          // Notify main application
          onCubePlaced(cube);
          
          // Cycle to next weight
          currentWeightIndex = (currentWeightIndex + 1) % availableWeights.length;
          
          console.log(`Placed weight-${weight} cube at:`, placementPosition);
        }
      }
    }
  }
  
  // Check if we can place on this surface
  function canPlaceOnSurface(intersection) {
    const object = intersection.object;
    
    // Can place on platform
    if (object.geometry && object.geometry.type === 'PlaneGeometry') {
      return true;
    }
    
    // Can place on top of cubes
    if (object.geometry && object.geometry.type === 'BoxGeometry') {
      // Check if we're clicking on the top face
      const face = intersection.face;
      const normal = face.normal.clone();
      object.localToWorld(normal);
      
      // Top face has normal pointing up
      return normal.y > 0.5;
    }
    
    return false;
  }
  
  // Calculate placement position
  function calculatePlacementPosition(point, face) {
    // Offset slightly above the surface
    const offset = 0.1;
    const position = point.clone();
    
    // Add offset in the direction of the face normal
    if (face) {
      const normal = face.normal.clone();
      position.add(normal.multiplyScalar(offset));
    } else {
      // Default to platform placement
      position.y += offset;
    }
    
    return position;
  }
  
  // Add mouse event listeners
  renderer.domElement.addEventListener('mousedown', onMouseDown);
  renderer.domElement.addEventListener('mousemove', onMouseMove);
  renderer.domElement.addEventListener('mouseup', onMouseUp);
  
  // Add keyboard controls for weight selection
  document.addEventListener('keydown', (event) => {
    const key = event.key;
    if (key >= '1' && key <= '5') {
      const weight = parseInt(key);
      const index = availableWeights.indexOf(weight);
      if (index !== -1) {
        currentWeightIndex = index;
        console.log(`Selected weight: ${weight}`);
      }
    }
  });
  
  console.log('Placement system initialized. Click to place cubes, use 1-5 keys to select weight, R to restart.');
}
