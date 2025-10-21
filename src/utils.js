// Weight Balance - Utility Functions
import * as THREE from 'three';

// Show restart button
export function showRestartButton() {
  const restartButton = document.getElementById('restartButton');
  if (restartButton) {
    restartButton.classList.remove('hidden');
  }
}

// Hide restart button
export function hideRestartButton() {
  const restartButton = document.getElementById('restartButton');
  if (restartButton) {
    restartButton.classList.add('hidden');
  }
}

// Calculate distance between two points
export function calculateDistance(point1, point2) {
  return point1.distanceTo(point2);
}

// Clamp value between min and max
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// Linear interpolation
export function lerp(a, b, t) {
  return a + (b - a) * t;
}

// Convert world position to screen coordinates
export function worldToScreen(worldPosition, camera, renderer) {
  const vector = worldPosition.clone();
  vector.project(camera);
  
  const x = (vector.x + 1) / 2 * renderer.domElement.clientWidth;
  const y = -(vector.y - 1) / 2 * renderer.domElement.clientHeight;
  
  return { x, y };
}

// Convert screen coordinates to world position
export function screenToWorld(screenX, screenY, camera) {
  const vector = new THREE.Vector3();
  vector.x = (screenX / window.innerWidth) * 2 - 1;
  vector.y = -(screenY / window.innerHeight) * 2 + 1;
  vector.z = 0.5;
  
  vector.unproject(camera);
  
  const direction = vector.sub(camera.position).normalize();
  const distance = -camera.position.y / direction.y;
  
  return camera.position.clone().add(direction.multiplyScalar(distance));
}

// Generate random color
export function randomColor() {
  return new THREE.Color(Math.random(), Math.random(), Math.random());
}

// Create debug sphere at position
export function createDebugSphere(position, color = 0xff0000, size = 0.1) {
  const geometry = new THREE.SphereGeometry(size, 8, 6);
  const material = new THREE.MeshBasicMaterial({ color });
  const sphere = new THREE.Mesh(geometry, material);
  sphere.position.copy(position);
  return sphere;
}

// Log performance metrics
export function logPerformance() {
  const info = renderer.info;
  console.log('Render Info:', {
    triangles: info.render.triangles,
    calls: info.render.calls,
    lines: info.render.lines,
    points: info.render.points
  });
}

// Format time in MM:SS format
export function formatTime(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
}

// Check if point is within bounds
export function isWithinBounds(point, bounds) {
  return point.x >= bounds.min.x && point.x <= bounds.max.x &&
         point.y >= bounds.min.y && point.y <= bounds.max.y &&
         point.z >= bounds.min.z && point.z <= bounds.max.z;
}

// Create bounding box from points
export function createBoundingBox(points) {
  const box = new THREE.Box3();
  points.forEach(point => box.expandByPoint(point));
  return box;
}
