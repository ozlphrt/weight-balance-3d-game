// Weight Balance - Cube Creation & Management
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { createCubePhysicsBody } from './physics.js';
import { registerCubeMesh, getCurrentColorScheme } from './ui.js';

// Get current color scheme
function getWeightColors() {
  return getCurrentColorScheme().colors;
}

// Weight-to-size mapping
const WEIGHT_SIZES = {
  1: 0.4, // Small
  2: 0.5, // Slightly larger
  3: 0.6, // Medium
  4: 0.7, // Larger
  5: 0.8  // Largest
};

// GLTF loader instance
const gltfLoader = new GLTFLoader();
let cubeModel = null;

// Load the cube model
export async function loadCubeModel() {
  return new Promise((resolve, reject) => {
    gltfLoader.load(
      './round_cube/scene.gltf',
      (gltf) => {
        cubeModel = gltf.scene;
        console.log('Cube model loaded successfully');
        console.log('Model structure:', cubeModel);
        console.log('Model children:', cubeModel.children);
        console.log('Model position:', cubeModel.position);
        console.log('Model scale:', cubeModel.scale);
        resolve(gltf.scene);
      },
      (progress) => {
        console.log('Loading cube model...', (progress.loaded / progress.total * 100) + '%');
      },
      (error) => {
        console.error('Error loading cube model:', error);
        reject(error);
      }
    );
  });
}

// Create a cube with specified weight and position
export function createCube(weight, position) {
  // Validate weight
  if (weight < 1 || weight > 5) {
    throw new Error(`Invalid weight: ${weight}. Must be between 1 and 5.`);
  }
  
  // Create Three.js mesh using GLTF model
  const mesh = createCubeMesh(weight);
  mesh.position.set(position.x, position.y, position.z);
  
  // Create physics body
  const body = createCubePhysicsBody(weight, position);
  
  // Add weight number display
  addWeightDisplay(mesh, weight);
  
  return {
    mesh,
    body,
    weight,
    position: new THREE.Vector3(position.x, position.y, position.z)
  };
}

// Create Three.js mesh for cube using GLTF model
function createCubeMesh(weight) {
  // Temporarily use fallback geometry until GLTF model is working
  console.log('Using fallback geometry for now');
  return createFallbackCubeMesh(weight);
  
  // TODO: Re-enable GLTF model once debugging is complete
  /*
  if (!cubeModel) {
    console.warn('Cube model not loaded, falling back to basic geometry');
    return createFallbackCubeMesh(weight);
  }
  
  // Clone the GLTF model
  const mesh = cubeModel.clone();
  
  // Scale the mesh based on weight
  const size = WEIGHT_SIZES[weight];
  mesh.scale.setScalar(size);
  
  // Debug: Log mesh information
  console.log('Created mesh from GLTF model:', mesh);
  console.log('Mesh children count:', mesh.children.length);
  
  // Apply color to all materials in the model
  mesh.traverse((child) => {
    if (child.isMesh) {
      console.log('Found mesh child:', child);
      console.log('Child material:', child.material);
      
      // Update material color
      if (child.material) {
        // Handle different material types
        if (child.material.color) {
          child.material.color.setHex(getWeightColors()[weight]);
          console.log('Set color to:', getWeightColors()[weight]);
        }
        
        // Set material properties safely
        child.material.shininess = 30;
        if (child.material.specular) {
          child.material.specular.setHex(0x222222);
        }
        child.material.transparent = true;
        child.material.opacity = 0.95;
        
        // Ensure material is updated
        child.material.needsUpdate = true;
      }
      
      // Enable shadows
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
  
  return mesh;
  */
}

// Fallback function for when GLTF model isn't loaded
function createFallbackCubeMesh(weight) {
  const size = WEIGHT_SIZES[weight];
  const geometry = new THREE.BoxGeometry(size, size, size);
  
  // PBR material with realistic lighting response
  const material = new THREE.MeshStandardMaterial({ 
    color: getWeightColors()[weight],
    metalness: 0.1,        // Slight metallic look
    roughness: 0.3,        // Smooth but not mirror-like
    transparent: false     // Solid cubes, no transparency
  });
  
  const mesh = new THREE.Mesh(geometry, material);
  mesh.castShadow = true;
  mesh.receiveShadow = true;
  
  // Add weight display
  addWeightDisplay(mesh, weight);
  
  // Register mesh for color scheme updates
  registerCubeMesh(mesh, weight);
  
  return mesh;
}

// Add weight number display on all cube faces
function addWeightDisplay(mesh, weight) {
  const size = WEIGHT_SIZES[weight];
  const cubeColor = new THREE.Color(getWeightColors()[weight]);
  
  // Calculate brightness to determine if we need light or dark text
  const brightness = (cubeColor.r * 299 + cubeColor.g * 587 + cubeColor.b * 114) / 1000;
  let textColor;
  
  if (brightness > 0.5) {
    // Light cube - use dark text
    textColor = cubeColor.clone().multiplyScalar(0.3);
  } else {
    // Dark cube - use light text
    textColor = cubeColor.clone().add(new THREE.Color(0.7, 0.7, 0.7));
  }
  
  const textColorHex = '#' + textColor.getHexString();
  
  // Create text canvas - make it bigger
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 256;
  
  // Draw weight number with brighter color - make it HUGE
  context.fillStyle = textColorHex;
  context.font = 'bold 120px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(weight.toString(), 128, 128);
  
  // Create text planes for all 6 faces
  const textGeometry = new THREE.PlaneGeometry(size * 0.95, size * 0.95);
  
  // Create individual textures and materials for each face
  const faces = [
    { pos: [0, 0, size/2 + 0.01], rot: [0, 0, 0], name: 'front' },           // Front
    { pos: [0, 0, -size/2 - 0.01], rot: [0, Math.PI, 0], name: 'back' },     // Back
    { pos: [size/2 + 0.01, 0, 0], rot: [0, -Math.PI/2, 0], name: 'right' },  // Right
    { pos: [-size/2 - 0.01, 0, 0], rot: [0, Math.PI/2, 0], name: 'left' },   // Left
    { pos: [0, size/2 + 0.01, 0], rot: [-Math.PI/2, 0, 0], name: 'top' },    // Top
    { pos: [0, -size/2 - 0.01, 0], rot: [Math.PI/2, 0, 0], name: 'bottom' }  // Bottom
  ];
  
  faces.forEach((face) => {
    // Create a separate canvas for each face to ensure correct orientation
    const faceCanvas = document.createElement('canvas');
    const faceContext = faceCanvas.getContext('2d');
    faceCanvas.width = 256;
    faceCanvas.height = 256;
    
    // Draw the number with proper orientation for each face
    faceContext.fillStyle = textColorHex;
    faceContext.font = 'bold 120px Arial';
    faceContext.textAlign = 'center';
    faceContext.textBaseline = 'middle';
    
    // Apply transformations based on debug test results:
    // Front: flipX=1, flipY=1 | Back: flipX=1, flipY=1 | Right: flipX=-1, flipY=1
    // Left: flipX=-1, flipY=1 | Top: flipX=1, flipY=1 | Bottom: flipX=1, flipY=1
    if (face.name === 'front') {
      // Front: flipX=1, flipY=1 (no flip)
      faceContext.fillText(weight.toString(), 128, 128);
    } else if (face.name === 'back') {
      // Back: flipX=1, flipY=1 (no flip)
      faceContext.fillText(weight.toString(), 128, 128);
    } else if (face.name === 'right') {
      // Right: flipX=-1, flipY=1 (flip horizontal)
      faceContext.scale(-1, 1);
      faceContext.fillText(weight.toString(), -128, 128);
    } else if (face.name === 'left') {
      // Left: flipX=-1, flipY=1 (flip horizontal)
      faceContext.scale(-1, 1);
      faceContext.fillText(weight.toString(), -128, 128);
    } else if (face.name === 'top') {
      // Top: flipX=1, flipY=1 (no flip)
      faceContext.fillText(weight.toString(), 128, 128);
    } else if (face.name === 'bottom') {
      // Bottom: flipX=1, flipY=1 (no flip)
      faceContext.fillText(weight.toString(), 128, 128);
    }
    
    const faceTexture = new THREE.CanvasTexture(faceCanvas);
    
    const textMaterial = new THREE.MeshBasicMaterial({ 
      map: faceTexture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide  // Render both sides of the plane
    });
    
    const textMesh = new THREE.Mesh(textGeometry, textMaterial);
    textMesh.position.set(face.pos[0], face.pos[1], face.pos[2]);
    textMesh.rotation.set(face.rot[0], face.rot[1], face.rot[2]);
    textMesh.userData.faceName = face.name; // Store face name for UI updates
    mesh.add(textMesh);
  });
}

// Get available cube weights for placement
export function getAvailableWeights() {
  return [1, 2, 3, 4, 5]; // For prototype, all weights available
}

// Create cube at random position (for testing)
export function createRandomCube(weight) {
  const position = {
    x: (Math.random() - 0.5) * 4,
    y: 5,
    z: (Math.random() - 0.5) * 4
  };
  
  return createCube(weight, position);
}
