# Product Requirements Document - Weight Balance

## Executive Summary

**Weight Balance** is a 3D physics-based puzzle game where players stack weighted cubes to build stable towers. The core challenge lies in managing weight distribution in real-time as physics continuously runs, requiring strategic thinking about placement order and tower stability.

**Target Platform**: PC (mouse/keyboard) with future mobile consideration  
**Development Phase**: Minimal Physics Prototype (v0.1.0)  
**Tech Stack**: JavaScript/TypeScript, Three.js, Cannon-es, Vite

## Core Game Design

### Physics Simulation
- **Continuous physics**: Physics engine runs at all times during construction
- **Real-time stability**: Towers must remain stable throughout the building process
- **Instant failure**: One topple results in immediate level restart
- **Stability validation**: 3-second stability test upon completion

### 3D Environment
- **Full 3D physics**: Towers can tip in any direction (360° tipping capability)
- **True physics simulation**: No simplified 2D approximations
- **Free orbit camera**: 360° viewing with mouse drag controls
- **Zoom capability**: Mouse wheel for close-up inspection

### Tile System
- **Weight-based variation**: All tiles are cubes with different weights
- **5 weight classes**: 1, 2, 3, 4, 5 units
- **Visual indicators**:
  - Weight 1: Small, light blue, displays "1"
  - Weight 2: Slightly larger, green, displays "2"  
  - Weight 3: Medium, yellow, displays "3"
  - Weight 4: Larger, orange, displays "4"
  - Weight 5: Largest, red, displays "5"

### Placement Mechanics
- **Surface placement only**: Tiles can only be placed on flat surfaces
- **Click-to-place**: Click on base platform or top of existing tiles
- **Free positioning**: X/Z positioning on surfaces without grid constraints
- **Physics validation**: Natural physics determines placement stability

### Level Structure
- **Fixed tile sets**: Each level provides exact tiles (e.g., "2× weight-1, 3× weight-3, 1× weight-5")
- **Complete usage required**: Must use ALL provided tiles
- **No unlimited supply**: Strategic resource management

### Platform Progression
- **Early levels**: Flat square platforms (5×5)
- **Mid-game**: Varying platform sizes
- **Late-game**: Shaped platforms (L-shape, cross, circle)
- **Expert levels**: Unstable/tilted platforms

## Win Conditions (Progressive Difficulty)

### Chapter 1 (Levels 1-10): Pure Stability
- Focus on building stable towers with increasing cube count
- No additional constraints beyond stability

### Chapter 2: Height Targets
- Stability requirement + minimum height targets
- Introduction of vertical challenge

### Chapter 3+: Positioning Requirements
- Stability + height + positioning constraints
- Example: "Heaviest tile must be in top third of tower"

## Rating System

### Stability Rating (★★★)
- Based on wobble/movement during 3-second stability test
- Minimal movement = 3 stars
- Moderate wobble = 2 stars  
- Significant movement = 1 star

### Efficiency Rating (★★★)
Combined metric evaluating:
- **Placement attempts**: Fewer attempts = better rating
- **Time taken**: Faster completion = better rating
- **Compactness**: Tighter bounding box = better rating
- **Center of mass**: Closer to platform center = better rating

## Progression System

### Chapter Structure
- **8-10 levels per chapter**
- **Sequential unlocking**: Must complete all levels in chapter to unlock next
- **Replay capability**: Can replay any completed level for better ratings
- **Mechanic introduction**: Each chapter introduces one new mechanic

## User Stories

### Core Gameplay
- As a player, I want to place weighted cubes on surfaces so I can build stable towers
- As a player, I want to see visual weight indicators so I can make informed placement decisions
- As a player, I want the physics to run continuously so I can see real-time stability feedback
- As a player, I want to restart immediately when my tower falls so I can try again quickly

### Camera & Controls
- As a player, I want to orbit around my tower so I can view it from all angles
- As a player, I want to zoom in/out so I can inspect details or see the full structure
- As a player, I want mouse-based controls so I can interact naturally

### Progression
- As a player, I want to see my ratings so I can track my improvement
- As a player, I want to unlock new levels so I can face increasing challenges
- As a player, I want to replay levels so I can improve my ratings

## Success Metrics

### Launch Metrics (v1.0)
- **Player retention**: 70% complete Chapter 1
- **Engagement**: Average 15 minutes per session
- **Difficulty curve**: 60% success rate on first attempt for levels 1-5
- **Performance**: Maintain 60fps with 20+ cubes on screen

### Prototype Metrics (v0.1.0)
- **Physics stability**: No physics glitches or unrealistic behavior
- **Performance**: 60fps with 5 cubes (prototype scope)
- **Usability**: Intuitive camera controls and placement mechanics

## Out of Scope (Explicitly)

### Mobile Platform
- **PC primary focus**: Design optimized for mouse/keyboard
- **Touch controls**: Future consideration only
- **Mobile UI**: Not in current scope

### Advanced Features (Post-Prototype)
- **Multiplayer**: Not in current scope
- **Level editor**: Not in current scope  
- **Advanced graphics**: Focus on gameplay over visual effects
- **Sound effects**: Not in prototype scope

## Technical Constraints

### Performance Requirements
- **Target framerate**: 60fps minimum
- **Physics timestep**: Fixed at 1/60s
- **Browser compatibility**: Latest 2 versions of Chrome, Firefox, Safari
- **Memory usage**: Efficient cube management for 20+ objects

### Development Constraints
- **Beginner-friendly setup**: Simple npm install and run
- **Modern JavaScript**: ES6+ features
- **Modular architecture**: Clear separation of concerns
- **Error handling**: Graceful failure for user input errors

## Risk Assessment

### Technical Risks
- **Physics performance**: Cannon-es may struggle with complex interactions
- **Browser compatibility**: Three.js features may vary across browsers
- **Memory leaks**: Continuous physics simulation requires careful cleanup

### Mitigation Strategies
- **Performance testing**: Regular benchmarking during development
- **Fallback options**: Alternative physics engines if Cannon-es fails
- **Progressive enhancement**: Core functionality works without advanced features

## Future Roadmap

### Phase 1: Minimal Prototype (Current)
- Basic physics and placement
- 5 cubes, flat platform
- Camera controls and restart

### Phase 2: Core Gameplay
- Level progression system
- Rating system implementation
- Multiple platform types

### Phase 3: Polish & Content
- Visual improvements
- Sound effects
- Additional level content

### Phase 4: Platform Expansion
- Mobile optimization
- Touch controls
- Cross-platform considerations
