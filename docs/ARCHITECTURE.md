# Technical Architecture - Weight Balance

## Technology Stack Justification

### Core Technologies

**Three.js (Latest Stable)**
- **Rationale**: Industry standard for 3D web graphics
- **Benefits**: Mature ecosystem, excellent documentation, active community
- **Use case**: Scene management, rendering, camera controls, geometry creation

**Cannon-es (Modern Fork)**
- **Rationale**: Cannon.js is deprecated; Cannon-es is the maintained fork
- **Benefits**: Full 3D physics simulation, good performance, Three.js integration
- **Use case**: Rigid body physics, collision detection, continuous simulation

**Vite**
- **Rationale**: Fast development server with hot module replacement
- **Benefits**: Quick iteration, modern bundling, TypeScript support
- **Use case**: Development server, build tooling, asset management

**JavaScript (ES6+)**
- **Rationale**: Native browser support, no compilation step for prototype
- **Benefits**: Fast development, easy debugging, broad compatibility
- **Future**: TypeScript migration planned for production

## File Structure & Responsibilities

```
weight-balance/
├── docs/                    # Documentation
│   ├── PRD.md              # Product requirements
│   ├── ARCHITECTURE.md     # This file
│   ├── TASKS.md            # Implementation tasks
│   ├── GIT_STRATEGY.md     # Version control
│   ├── TESTING.md          # Test procedures
│   └── GITHUB_SETUP.md     # Repository setup
├── src/                    # Source code
│   ├── main.js             # Application entry point
│   ├── scene.js            # Three.js scene management
│   ├── physics.js          # Cannon-es physics world
│   ├── camera.js           # Camera controls & orbit
│   ├── cubes.js            # Cube creation & management
│   ├── placement.js        # Surface placement logic
│   └── utils.js            # Helper functions
├── public/                 # Static assets
│   └── (future assets)
├── index.html              # HTML entry point
├── style.css               # Global styles
├── package.json            # Dependencies & scripts
├── .gitignore              # Git ignore rules
├── README.md               # Project overview
├── CHANGELOG.md            # Version history
└── .cursorrules            # Cursor AI rules
```

## Module Responsibilities

### main.js - Application Entry Point
- **Purpose**: Initialize application, coordinate modules
- **Responsibilities**:
  - Create Three.js renderer and canvas
  - Initialize scene, physics, camera systems
  - Set up event listeners
  - Start render loop
  - Handle application lifecycle

### scene.js - Three.js Scene Management
- **Purpose**: Manage 3D scene graph and rendering
- **Responsibilities**:
  - Create and configure Three.js scene
  - Add lighting (ambient + directional)
  - Manage scene objects (platform, cubes)
  - Handle render loop coordination
  - Scene cleanup and disposal

### physics.js - Physics World Management
- **Purpose**: Manage Cannon-es physics simulation
- **Responsibilities**:
  - Create physics world with gravity
  - Add physics bodies for platform and cubes
  - Handle physics timestep (fixed 1/60s)
  - Detect collisions and stability
  - Physics world cleanup

### camera.js - Camera Controls
- **Purpose**: Handle camera positioning and controls
- **Responsibilities**:
  - Set up perspective camera
  - Implement orbit controls (mouse drag)
  - Handle zoom (mouse wheel)
  - Camera state management
  - Coordinate with renderer

### cubes.js - Cube System
- **Purpose**: Create and manage weighted cubes
- **Responsibilities**:
  - Generate cubes with weight properties (1-5)
  - Apply visual styling (color, size, number display)
  - Create Three.js geometry and materials
  - Create corresponding physics bodies
  - Cube lifecycle management

### placement.js - Placement Logic
- **Purpose**: Handle cube placement on surfaces
- **Responsibilities**:
  - Raycast from mouse to detect surfaces
  - Validate placement positions
  - Create cube at placement location
  - Handle placement constraints
  - Integration with physics system

### utils.js - Helper Functions
- **Purpose**: Shared utility functions
- **Responsibilities**:
  - Math helpers (vector operations, distance)
  - Color utilities (weight-to-color mapping)
  - Debug helpers (logging, visualization)
  - Common calculations

## Three.js Scene Graph Structure

```
Scene
├── AmbientLight (soft overall lighting)
├── DirectionalLight (main light source)
├── Platform (base platform mesh)
│   └── PlatformPhysics (Cannon-es body)
└── Cubes (group container)
    ├── Cube1 (mesh + physics body)
    ├── Cube2 (mesh + physics body)
    └── ... (additional cubes)
```

## Cannon-es Physics World Setup

### World Configuration
```javascript
// Physics world setup
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0), // Earth gravity
  broadphase: new CANNON.NaiveBroadphase(),
  solver: new CANNON.GSSolver()
});

// Fixed timestep for consistent physics
const timeStep = 1/60; // 60 FPS
```

### Body Types
- **Platform**: Static body (kinematic, no movement)
- **Cubes**: Dynamic bodies (affected by gravity and collisions)
- **Material properties**: Friction and restitution for realistic behavior

## Data Flow Architecture

### Initialization Flow
```
main.js → scene.js → physics.js → camera.js
    ↓
cubes.js (create initial cubes)
    ↓
placement.js (setup placement system)
    ↓
Start render loop
```

### Runtime Data Flow
```
User Input (mouse) → placement.js → cubes.js → physics.js
    ↓
Physics Update → scene.js → Renderer
    ↓
Camera Controls → camera.js → scene.js
```

### Event Flow
```
Mouse Click → placement.js → Validate → Create Cube → physics.js
    ↓
Physics Simulation → Stability Check → Game State Update
    ↓
Tower Fall → main.js → Restart Logic
```

## Performance Considerations

### Rendering Optimization
- **Frustum culling**: Only render visible objects
- **LOD system**: Future consideration for complex scenes
- **Instanced rendering**: For identical cube types (future optimization)

### Physics Optimization
- **Fixed timestep**: Consistent physics regardless of framerate
- **Broadphase optimization**: Efficient collision detection
- **Body pooling**: Reuse physics bodies when possible
- **Sleeping bodies**: Deactivate static objects

### Memory Management
- **Object pooling**: Reuse cube objects instead of creating/destroying
- **Texture atlasing**: Combine cube textures for efficiency
- **Geometry sharing**: Share geometry between identical cubes
- **Cleanup procedures**: Proper disposal of Three.js and Cannon-es objects

## Integration Points

### Three.js ↔ Cannon-es Synchronization
- **Position sync**: Update Three.js mesh positions from physics bodies
- **Rotation sync**: Update Three.js mesh rotations from physics bodies
- **Body creation**: Create physics bodies when cubes are placed
- **Body removal**: Clean up physics bodies when cubes are removed

### Event System
- **Mouse events**: Click detection for placement
- **Physics events**: Collision detection for stability
- **Camera events**: Orbit and zoom controls
- **Game events**: Restart, level completion

## Error Handling Strategy

### Physics Errors
- **Invalid placements**: Prevent placement outside valid areas
- **Physics glitches**: Detect and handle unrealistic physics behavior
- **Performance degradation**: Monitor framerate and adjust quality

### User Input Errors
- **Invalid clicks**: Handle clicks outside game area
- **Rapid clicking**: Debounce placement to prevent spam
- **Browser compatibility**: Graceful degradation for unsupported features

## Development Workflow

### Hot Reload Strategy
- **Vite HMR**: Automatic reload for code changes
- **Scene preservation**: Maintain game state during development
- **Physics debugging**: Visual debugging tools for physics

### Debugging Tools
- **Physics visualization**: Show physics bodies and constraints
- **Performance monitoring**: FPS counter and memory usage
- **Console logging**: Detailed logging for development
- **Visual helpers**: Axes, wireframes, bounding boxes

## Future Architecture Considerations

### Scalability
- **Level system**: Modular level loading and management
- **Save system**: Game state persistence
- **Settings system**: User preferences and configuration

### Extensibility
- **Plugin architecture**: Easy addition of new cube types
- **Mod system**: Community-created levels and content
- **API design**: Clean interfaces for future features

### Mobile Considerations
- **Touch controls**: Touch event handling
- **Performance scaling**: Reduced quality for mobile devices
- **Responsive design**: Adaptive UI for different screen sizes
