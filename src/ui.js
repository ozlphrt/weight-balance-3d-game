// Weight Balance - UI Management (Color Schemes & FPS Counter)
import * as THREE from 'three';

// Color scheme definitions
export const COLOR_SCHEMES = {
  professional: {
    name: 'Professional Gaming',
    colors: {
      1: 0x4A90E2, // Professional blue
      2: 0x7ED321, // Fresh green  
      3: 0xF5A623, // Amber gold
      4: 0xD0021B, // Deep red
      5: 0x9013FE  // Purple (heaviest)
    }
  },
  weight: {
    name: 'Weight Progression',
    colors: {
      1: 0xE8F4FD, // Very light blue (lightest)
      2: 0xB8E6B8, // Light green
      3: 0xFFE082, // Light amber
      4: 0xFF8A65, // Medium orange
      5: 0x5D4037  // Dark brown (heaviest)
    }
  },
  material: {
    name: 'Material Design',
    colors: {
      1: 0x2196F3, // Material blue
      2: 0x4CAF50, // Material green
      3: 0xFF9800, // Material orange
      4: 0xF44336, // Material red
      5: 0x9C27B0  // Material purple
    }
  },
  monochrome: {
    name: 'Monochromatic',
    colors: {
      1: 0xFFFFFF, // Pure white
      2: 0xC0C0C0, // Light silver
      3: 0x808080, // Medium gray
      4: 0x404040, // Dark gray
      5: 0x000000  // Pure black
    }
  },
  neon: {
    name: 'Neon Cyberpunk',
    colors: {
      1: 0x00FFFF, // Cyan
      2: 0x00FF00, // Lime green
      3: 0xFFFF00, // Electric yellow
      4: 0xFF00FF, // Magenta
      5: 0xFF0080  // Hot pink
    }
  },
  earth: {
    name: 'Earth Tones',
    colors: {
      1: 0x8B4513, // Saddle brown
      2: 0x228B22, // Forest green
      3: 0xDAA520, // Goldenrod
      4: 0xCD853F, // Peru
      5: 0x2F4F4F  // Dark slate gray
    }
  },
  ocean: {
    name: 'Ocean Depths',
    colors: {
      1: 0x87CEEB, // Sky blue
      2: 0x4682B4, // Steel blue
      3: 0x1E90FF, // Dodger blue
      4: 0x000080, // Navy
      5: 0x000033  // Deep ocean
    }
  },
  sunset: {
    name: 'Sunset Gradient',
    colors: {
      1: 0xFFE4B5, // Moccasin
      2: 0xFFA500, // Orange
      3: 0xFF6347, // Tomato
      4: 0xDC143C, // Crimson
      5: 0x8B0000  // Dark red
    }
  },
  forest: {
    name: 'Forest Green',
    colors: {
      1: 0x90EE90, // Light green
      2: 0x32CD32, // Lime green
      3: 0x228B22, // Forest green
      4: 0x006400, // Dark green
      5: 0x003300  // Very dark green
    }
  },
  royal: {
    name: 'Royal Purple',
    colors: {
      1: 0xDDA0DD, // Plum
      2: 0xDA70D6, // Orchid
      3: 0x9370DB, // Medium purple
      4: 0x8A2BE2, // Blue violet
      5: 0x4B0082  // Indigo
    }
  }
};

// Global variables for UI management
let currentColorScheme = 'professional';
let cubeMeshes = [];
let fpsCounter = null;
let lastTime = 0;
let frameCount = 0;

// Initialize UI
export function initializeUI() {
  setupFPSCounter();
  console.log('UI initialized with color scheme selector and FPS counter');
}

// Setup FPS counter
function setupFPSCounter() {
  fpsCounter = document.getElementById('fpsCounter');
  if (!fpsCounter) {
    console.warn('FPS counter element not found');
    return;
  }
  
  // Start FPS tracking
  requestAnimationFrame(updateFPS);
}

// Update FPS counter
function updateFPS(currentTime) {
  frameCount++;
  
  if (currentTime - lastTime >= 1000) { // Update every second
    const fps = Math.round((frameCount * 1000) / (currentTime - lastTime));
    fpsCounter.textContent = `FPS: ${fps}`;
    
    // Color code FPS
    if (fps >= 55) {
      fpsCounter.style.color = '#4CAF50'; // Green
    } else if (fps >= 30) {
      fpsCounter.style.color = '#FF9800'; // Orange
    } else {
      fpsCounter.style.color = '#F44336'; // Red
    }
    
    frameCount = 0;
    lastTime = currentTime;
  }
  
  requestAnimationFrame(updateFPS);
}

// Register cube mesh for color updates
export function registerCubeMesh(mesh, weight) {
  cubeMeshes.push({ mesh, weight });
}

// Change color scheme
export function changeColorScheme(schemeName) {
  if (!COLOR_SCHEMES[schemeName]) {
    console.warn(`Unknown color scheme: ${schemeName}`);
    return;
  }
  
  currentColorScheme = schemeName;
  const scheme = COLOR_SCHEMES[schemeName];
  
  console.log(`Changing to color scheme: ${scheme.name}`);
  
  // Update all registered cube meshes
  cubeMeshes.forEach(({ mesh, weight }) => {
    if (mesh.material && mesh.material.color) {
      const newColor = new THREE.Color(scheme.colors[weight]);
      mesh.material.color.copy(newColor);
      mesh.material.needsUpdate = true;
    }
  });
  
  // Update text colors on cube faces
  updateTextColors(scheme);
}

// Update text colors on cube faces
function updateTextColors(scheme) {
  cubeMeshes.forEach(({ mesh, weight }) => {
    // Find text meshes (children with MeshBasicMaterial)
    mesh.children.forEach(child => {
      if (child.material && child.material.type === 'MeshBasicMaterial') {
        // Update text color based on cube color with adaptive contrast
        const cubeColor = new THREE.Color(scheme.colors[weight]);
        
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
        
        // Redraw the canvas texture with new color
        const canvas = child.material.map.source;
        if (canvas && canvas.getContext) {
          const context = canvas.getContext('2d');
          
          // Clear and reset canvas
          context.clearRect(0, 0, canvas.width, canvas.height);
          context.setTransform(1, 0, 0, 1, 0, 0); // Reset transform
          
          // Set text properties
          context.fillStyle = textColorHex;
          context.font = 'bold 120px Arial';
          context.textAlign = 'center';
          context.textBaseline = 'middle';
          
          // Apply the same transformations as in cubes.js
          const faceName = child.userData.faceName || 'front';
          if (faceName === 'right' || faceName === 'left') {
            context.scale(-1, 1);
            context.fillText(weight.toString(), -128, 128);
          } else {
            context.fillText(weight.toString(), 128, 128);
          }
          
          // Force texture update
          child.material.map.needsUpdate = true;
          child.material.needsUpdate = true;
        }
      }
    });
  });
}

// Get current color scheme
export function getCurrentColorScheme() {
  return COLOR_SCHEMES[currentColorScheme];
}

// Clear registered meshes (for restart)
export function clearRegisteredMeshes() {
  cubeMeshes = [];
}
