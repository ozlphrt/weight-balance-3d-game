// Weight Balance - Three.js Scene Management
import * as THREE from 'three';

// Create and configure the Three.js scene
export function createScene() {
  const scene = new THREE.Scene();
  
  // Set background color (dark, desaturated blue-gray)
  scene.background = new THREE.Color(0x1A1A2E);
  
  // Add fog for depth
  scene.fog = new THREE.Fog(0x1A1A2E, 10, 50);
  
  // Add lighting
  setupLighting(scene);
  
  return scene;
}

// Setup professional scene lighting
function setupLighting(scene) {
  // 1. Key Light (Main directional light - like sun)
  const keyLight = new THREE.DirectionalLight(0xffffff, 1.2);
  keyLight.position.set(8, 12, 6);
  keyLight.castShadow = true;
  
  // High-quality shadow configuration
  keyLight.shadow.camera.near = 0.1;
  keyLight.shadow.camera.far = 50;
  keyLight.shadow.camera.left = -15;
  keyLight.shadow.camera.right = 15;
  keyLight.shadow.camera.top = 15;
  keyLight.shadow.camera.bottom = -15;
  keyLight.shadow.mapSize.width = 4096;
  keyLight.shadow.mapSize.height = 4096;
  keyLight.shadow.bias = -0.0001;
  keyLight.shadow.normalBias = 0.02;
  
  scene.add(keyLight);
  
  // 2. Fill Light (Softer, from opposite side)
  const fillLight = new THREE.DirectionalLight(0x87CEEB, 0.4);
  fillLight.position.set(-6, 8, -4);
  scene.add(fillLight);
  
  // 3. Rim Light (Back lighting for edge definition)
  const rimLight = new THREE.DirectionalLight(0xffffff, 0.3);
  rimLight.position.set(-8, 6, -8);
  scene.add(rimLight);
  
  // 4. Ambient Light (Very subtle overall illumination)
  const ambientLight = new THREE.AmbientLight(0x404040, 0.2);
  scene.add(ambientLight);
  
  // 5. Hemisphere Light (Sky/ground color simulation)
  const hemisphereLight = new THREE.HemisphereLight(0x87CEEB, 0x228B22, 0.4);
  scene.add(hemisphereLight);
  
  // 6. Point Light (Accent lighting from above)
  const pointLight = new THREE.PointLight(0xffffff, 0.8, 20);
  pointLight.position.set(0, 10, 0);
  pointLight.castShadow = true;
  pointLight.shadow.mapSize.width = 2048;
  pointLight.shadow.mapSize.height = 2048;
  pointLight.shadow.camera.near = 0.1;
  pointLight.shadow.camera.far = 20;
  scene.add(pointLight);
  
  // 7. Spot Light (Focused lighting on the platform)
  const spotLight = new THREE.SpotLight(0xffffff, 0.6, 15, Math.PI / 6, 0.3, 1);
  spotLight.position.set(0, 8, 0);
  spotLight.target.position.set(0, 0, 0);
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  scene.add(spotLight);
  scene.add(spotLight.target);
}

// Add visual helpers for debugging (optional)
export function addDebugHelpers(scene) {
  // Axes helper
  const axesHelper = new THREE.AxesHelper(5);
  scene.add(axesHelper);
  
  // Grid helper
  const gridHelper = new THREE.GridHelper(10, 10);
  scene.add(gridHelper);
}
