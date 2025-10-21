# Weight Balance

A 3D physics-based puzzle game where players stack weighted cubes to build stable towers. Challenge yourself to create stable structures while managing weight distribution in real-time physics simulation.

## Quick Start

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation
```bash
git clone https://github.com/username/weight-balance.git
cd weight-balance
npm install
npm run dev
```

Open your browser to `http://localhost:5173` to start playing!

## How to Play

- **Click** on platform or cube surfaces to place cubes
- **Drag** mouse to orbit camera around your tower
- **Scroll** mouse wheel to zoom in/out
- **Build** stable towers using all provided cubes
- **Restart** when your tower falls

## Current Status
🚧 **Minimal Physics Prototype (v0.1.0)** - Basic physics simulation and cube placement

### What's Working
- ✅ 3D physics simulation with Cannon-es
- ✅ Cube placement system
- ✅ Camera orbit controls
- ✅ Restart functionality
- ✅ Weight-based cube visualization

### What's Coming Next
- 🔄 Level progression system
- 🔄 Rating system (stability + efficiency)
- 🔄 Multiple platform types
- 🔄 Advanced win conditions

## Tech Stack
- **Three.js** - 3D rendering and scene management
- **Cannon-es** - Physics simulation
- **Vite** - Development server and bundling
- **JavaScript** - Core language

## Development Roadmap
See [docs/TASKS.md](docs/TASKS.md) for detailed implementation plan.

## Project Structure
```
weight-balance/
├── docs/                   # Documentation
├── src/                    # Source code
│   ├── main.js            # Application entry point
│   ├── scene.js           # Three.js scene management
│   ├── physics.js         # Cannon-es physics world
│   ├── camera.js          # Camera controls
│   ├── cubes.js           # Cube creation & management
│   ├── placement.js       # Surface placement logic
│   └── utils.js           # Helper functions
├── public/                # Static assets
└── index.html             # HTML entry point
```

## Contributing
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Documentation
- [Product Requirements](docs/PRD.md) - Complete game design specification
- [Technical Architecture](docs/ARCHITECTURE.md) - System design and structure
- [Implementation Tasks](docs/TASKS.md) - Detailed development plan
- [Testing Procedures](docs/TESTING.md) - Testing and validation
- [Git Strategy](docs/GIT_STRATEGY.md) - Version control workflow

## License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments
- Built with [Three.js](https://threejs.org/) for 3D graphics
- Physics powered by [Cannon-es](https://github.com/schteppe/cannon.js)
- Development server by [Vite](https://vitejs.dev/)
