# Changelog

All notable changes to the Weight Balance project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial project setup and documentation
- Complete technical architecture design
- Implementation task breakdown
- Testing procedures and validation
- Git workflow and version control strategy

## [0.1.0] - 2024-01-XX (Planned)

### Added
- Basic 3D scene setup with Three.js
- Physics simulation with Cannon-es
- Cube creation system with 5 weight classes
- Visual weight indicators (color, size, number display)
- Surface placement system for cubes
- Camera orbit controls (mouse drag)
- Mouse wheel zoom functionality
- Restart system for tower falls
- Basic platform (5×5 flat surface)
- Physics-based stability detection

### Technical Details
- **Physics Engine**: Cannon-es with fixed timestep (1/60s)
- **Rendering**: Three.js with WebGL renderer
- **Performance**: 60fps target with 5 cubes
- **Browser Support**: Chrome, Firefox, Safari (latest 2 versions)
- **Development**: Vite dev server with hot reload

### Known Limitations
- No level progression system
- No rating system
- No multiple platform types
- No advanced win conditions
- Limited to 5 cubes maximum
- No sound effects or advanced graphics

## [0.2.0] - Future Release

### Planned
- Level progression system
- Chapter-based structure (8-10 levels per chapter)
- Multiple platform types and sizes
- Advanced win conditions (height targets, positioning requirements)
- Improved UI and user experience
- Performance optimizations for more cubes

## [0.3.0] - Future Release

### Planned
- Rating system implementation
- Stability rating (based on wobble during 3-second test)
- Efficiency rating (placement attempts, time, compactness, center of mass)
- Level replay functionality
- Progress tracking and statistics

## [0.4.0] - Future Release

### Planned
- Advanced platform types (L-shape, cross, circle)
- Unstable/tilted platforms
- Complex positioning requirements
- Enhanced visual effects
- Improved physics behavior

## [1.0.0] - Future Release

### Planned
- Complete game with all planned features
- Mobile optimization and touch controls
- Sound effects and music
- Advanced graphics and visual polish
- Performance optimizations
- Full browser compatibility
- Production-ready deployment

## Development Notes

### Version 0.1.0 Focus
The minimal physics prototype focuses on core gameplay mechanics:
- **Physics Simulation**: Continuous physics with realistic behavior
- **Cube System**: Weight-based variation with clear visual indicators
- **Placement System**: Surface-based placement with physics validation
- **Camera Controls**: Intuitive orbit and zoom controls
- **Restart System**: Immediate restart on tower fall

### Future Considerations
- **Mobile Support**: Touch controls and responsive design
- **Performance**: Optimization for larger cube counts
- **Graphics**: Enhanced visual effects and animations
- **Audio**: Sound effects and background music
- **Analytics**: Player behavior tracking and insights

## Breaking Changes

### Version 0.1.0
- No breaking changes (initial release)

### Future Versions
- Breaking changes will be documented in detail
- Migration guides will be provided when necessary
- Deprecation warnings will be given in advance

## Security

### Version 0.1.0
- No security considerations (client-side only)
- No user data collection
- No external API calls

### Future Versions
- Security considerations will be documented as features are added
- User data handling will follow privacy best practices
- External dependencies will be regularly audited

## Performance

### Version 0.1.0 Targets
- **Frame Rate**: 60fps minimum
- **Memory Usage**: < 100MB with 5 cubes
- **Load Time**: < 3 seconds initial load
- **Physics**: Stable simulation with no glitches

### Future Optimizations
- Object pooling for cubes
- LOD system for complex scenes
- Texture atlasing for efficiency
- Memory management improvements

## Dependencies

### Version 0.1.0
- **Three.js**: Latest stable version
- **Cannon-es**: Modern fork of Cannon.js
- **Vite**: Development server and bundling
- **Node.js**: 16+ for development

### Future Dependencies
- Additional dependencies will be documented as they are added
- Regular updates to maintain security and performance
- Compatibility testing with new versions

## Contributors

### Version 0.1.0
- Initial development and documentation

### Future Versions
- Contributor credits will be maintained
- Contribution guidelines will be followed
- Code review process will be documented

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Support

### Version 0.1.0
- GitHub Issues for bug reports
- Documentation in `/docs` folder
- Development setup instructions in README

### Future Support
- Community forums and discussions
- User guides and tutorials
- Video documentation and demos
