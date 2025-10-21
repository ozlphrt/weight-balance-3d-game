# Three.js Text Orientation Guide

## Problem: Inward-Facing and Mirrored Text on 3D Objects

When placing text on multiple faces of 3D objects in Three.js, you may encounter issues where:
- Text appears on the "back" side of planes (inward-facing)
- Text appears mirrored/flipped on certain faces
- Some faces show text correctly while others don't

## Root Cause Analysis

### 1. PlaneGeometry Default Orientation
```javascript
const plane = new THREE.PlaneGeometry(); // Faces +Z direction by default
```
- `PlaneGeometry` always faces the +Z direction initially
- When rotated to different positions, some planes end up showing their "back" side
- Single-sided materials only render the "front" side

### 2. Texture Coordinate Issues
```javascript
// When rotating planes, texture coordinates can get flipped
plane.rotation.set(0, Math.PI, 0); // 180° rotation
// Result: Plane faces -Z but texture appears mirrored
```

### 3. Material Rendering Sides
```javascript
// Default material only renders front side
const material = new THREE.MeshBasicMaterial({ map: texture });
// If plane is rotated to show back side, nothing renders
```

## Solution: Multi-Face Text System

### Step 1: Use DoubleSide Material
```javascript
const textMaterial = new THREE.MeshBasicMaterial({ 
  map: texture,
  transparent: true,
  alphaTest: 0.1,
  side: THREE.DoubleSide  // ✅ Render both sides
});
```

### Step 2: Create Individual Canvas Per Face
```javascript
faces.forEach((face) => {
  // Create separate canvas for each face
  const faceCanvas = document.createElement('canvas');
  const faceContext = faceCanvas.getContext('2d');
  faceCanvas.width = 256;
  faceCanvas.height = 256;
  
  // Draw text with correct orientation for this specific face
  faceContext.fillStyle = textColor;
  faceContext.font = 'bold 120px Arial';
  faceContext.textAlign = 'center';
  faceContext.textBaseline = 'middle';
  
  // Apply face-specific transformations
  if (face.name === 'back') {
    faceContext.scale(-1, 1); // Flip horizontally
    faceContext.fillText(text, -128, 128);
  } else if (face.name === 'right') {
    faceContext.scale(-1, 1); // Flip horizontally
    faceContext.fillText(text, -128, 128);
  } else {
    // Normal orientation for other faces
    faceContext.fillText(text, 128, 128);
  }
  
  const faceTexture = new THREE.CanvasTexture(faceCanvas);
  // ... create material and mesh
});
```

### Step 3: Proper Face Positioning and Rotation
```javascript
const faces = [
  { pos: [0, 0, size/2 + 0.01], rot: [0, 0, 0], name: 'front' },
  { pos: [0, 0, -size/2 - 0.01], rot: [0, Math.PI, 0], name: 'back' },
  { pos: [size/2 + 0.01, 0, 0], rot: [0, -Math.PI/2, 0], name: 'right' },
  { pos: [-size/2 - 0.01, 0, 0], rot: [0, Math.PI/2, 0], name: 'left' },
  { pos: [0, size/2 + 0.01, 0], rot: [-Math.PI/2, 0, 0], name: 'top' },
  { pos: [0, -size/2 - 0.01, 0], rot: [Math.PI/2, 0, 0], name: 'bottom' }
];
```

## Best Practices

### 1. Always Use DoubleSide for Text/UI
```javascript
// ✅ Good
const material = new THREE.MeshBasicMaterial({
  side: THREE.DoubleSide,
  transparent: true
});

// ❌ Avoid
const material = new THREE.MeshBasicMaterial({
  side: THREE.FrontSide, // May cause invisible text
  transparent: true
});
```

### 2. Create Textures with Correct Orientation
```javascript
// ✅ Good - Draw with correct orientation from start
if (needsFlip) {
  context.scale(-1, 1);
  context.fillText(text, -x, y);
} else {
  context.fillText(text, x, y);
}

// ❌ Avoid - Flipping textures after creation
const texture = new THREE.CanvasTexture(canvas);
texture.flipX = true; // Unreliable
```

### 3. Test Each Face Individually
```javascript
// Create one face at a time and verify orientation
// Don't try to fix all faces simultaneously
const testFaces = ['front']; // Start with one face
// Then add: ['front', 'back'], ['front', 'back', 'right'], etc.
```

### 4. Use Visual Debugging
```javascript
// Add different colors or markers to identify faces
if (face.name === 'front') {
  context.fillStyle = 'red';
} else if (face.name === 'back') {
  context.fillStyle = 'blue';
}
// Makes it easier to debug which face is which
```

### 5. Understand Coordinate Systems
```javascript
// Three.js coordinate system:
// +X = Right
// +Y = Up  
// +Z = Towards camera (front)
// -Z = Away from camera (back)

// When positioning planes:
// Front face: pos = [0, 0, +size/2]
// Back face:  pos = [0, 0, -size/2]
// Right face: pos = [+size/2, 0, 0]
// Left face:  pos = [-size/2, 0, 0]
// Top face:   pos = [0, +size/2, 0]
// Bottom face: pos = [0, -size/2, 0]
```

## Common Mistakes to Avoid

### 1. Using Single Texture for All Faces
```javascript
// ❌ Wrong - Same texture for all faces
const texture = new THREE.CanvasTexture(canvas);
faces.forEach(face => {
  const material = new THREE.MeshBasicMaterial({ map: texture });
  // All faces get same orientation
});

// ✅ Correct - Individual texture per face
faces.forEach(face => {
  const faceCanvas = createCanvasForFace(face);
  const faceTexture = new THREE.CanvasTexture(faceCanvas);
  const material = new THREE.MeshBasicMaterial({ map: faceTexture });
});
```

### 2. Incorrect Rotation Calculations
```javascript
// ❌ Wrong - Guessing rotations
plane.rotation.set(Math.PI, 0, 0); // May not face outward

// ✅ Correct - Systematic approach
// Front: [0, 0, 0]
// Back:  [0, Math.PI, 0] 
// Right: [0, -Math.PI/2, 0]
// Left:  [0, Math.PI/2, 0]
// Top:   [-Math.PI/2, 0, 0]
// Bottom: [Math.PI/2, 0, 0]
```

### 3. Not Testing All Viewing Angles
```javascript
// Test from multiple camera positions
camera.position.set(5, 5, 5);   // Test view 1
camera.position.set(-5, 5, 5);  // Test view 2
camera.position.set(0, 10, 0);  // Test view 3
// Ensure text is readable from all angles
```

## Debugging Checklist

When text orientation issues occur:

1. **Check material side**: Is it `DoubleSide`?
2. **Verify face positions**: Are planes positioned correctly?
3. **Test rotations**: Do rotations face planes outward?
4. **Canvas orientation**: Is text drawn with correct orientation?
5. **Texture coordinates**: Are UV coordinates correct?
6. **Camera angles**: Test from multiple viewing positions

## Example Implementation

```javascript
function createTextOnAllFaces(mesh, text, size) {
  const faces = [
    { pos: [0, 0, size/2 + 0.01], rot: [0, 0, 0], name: 'front' },
    { pos: [0, 0, -size/2 - 0.01], rot: [0, Math.PI, 0], name: 'back' },
    { pos: [size/2 + 0.01, 0, 0], rot: [0, -Math.PI/2, 0], name: 'right' },
    { pos: [-size/2 - 0.01, 0, 0], rot: [0, Math.PI/2, 0], name: 'left' },
    { pos: [0, size/2 + 0.01, 0], rot: [-Math.PI/2, 0, 0], name: 'top' },
    { pos: [0, -size/2 - 0.01, 0], rot: [Math.PI/2, 0, 0], name: 'bottom' }
  ];
  
  faces.forEach(face => {
    // Create canvas for this face
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;
    
    // Draw text with face-specific orientation
    context.fillStyle = '#ffffff';
    context.font = 'bold 120px Arial';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    
    if (face.name === 'back' || face.name === 'right') {
      context.scale(-1, 1);
      context.fillText(text, -128, 128);
    } else {
      context.fillText(text, 128, 128);
    }
    
    // Create texture and material
    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
      alphaTest: 0.1,
      side: THREE.DoubleSide
    });
    
    // Create and position text mesh
    const textGeometry = new THREE.PlaneGeometry(size * 0.9, size * 0.9);
    const textMesh = new THREE.Mesh(textGeometry, material);
    textMesh.position.set(face.pos[0], face.pos[1], face.pos[2]);
    textMesh.rotation.set(face.rot[0], face.rot[1], face.rot[2]);
    
    mesh.add(textMesh);
  });
}
```

## Summary

The key to successful multi-face text in Three.js is:
1. **DoubleSide materials** for visibility
2. **Individual canvases** for each face
3. **Correct orientation** from the start
4. **Systematic testing** of each face
5. **Understanding** Three.js coordinate systems

This approach ensures text is always readable and properly oriented on all faces of 3D objects.
