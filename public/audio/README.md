# Audio Files for Weight Balance Game

This directory should contain high-quality, realistic sound effects for the game.

## Required Audio Files

### Cube Placement Sounds
- `cube-place-wood.mp3` - Light wood impact sound for light cubes (1-3 weight)
- `cube-place-heavy.mp3` - Heavy metal/stone impact for heavy cubes (4-5 weight)

### Collision Sounds  
- `cube-collision.mp3` - Light cube-to-cube collision
- `cube-collision-heavy.mp3` - Heavy cube collisions with more impact

### Structure Sounds
- `structure-creak.mp3` - Subtle creaking when structure is unstable
- `structure-strain.mp3` - Straining sound when structure is under stress

### Collapse Sounds
- `collapse-start.mp3` - Initial collapse sound
- `collapse-cascade.mp3` - Cascading collapse of multiple cubes
- `collapse-impact.mp3` - Final impact when cubes hit the ground

### UI Sounds
- `ui-hover.mp3` - Subtle hover sound for UI elements
- `ui-click.mp3` - Clean click sound for button presses
- `level-complete.mp3` - Success chime for level completion
- `game-over.mp3` - Failure sound for game over

### Ambient Sounds
- `ambient-physics.mp3` - Subtle ambient sound during gameplay

## Recommended Sources for High-Quality Audio

### Free Sources
1. **Freesound.org** - Search for:
   - "wood impact" or "wood thud"
   - "metal impact" or "metal clang"
   - "stone impact" or "rock drop"
   - "structure creak" or "wood creak"
   - "cascade" or "falling objects"
   - "UI click" or "button click"

2. **BBC Sound Effects Library** - Professional quality
   - Some free samples available
   - Search for "impact", "collision", "structure"

3. **Zapsplat** - Free tier available
   - High-quality game sound effects
   - Realistic material sounds

### Audio Specifications
- **Format**: MP3 or WAV
- **Sample Rate**: 44.1kHz or 48kHz
- **Bit Depth**: 16-bit minimum, 24-bit preferred
- **Duration**: 0.1s - 2.0s (most should be under 1 second)
- **Volume**: Normalized to prevent clipping

## Fallback System

If audio files are missing, the game will generate procedural fallback sounds using Web Audio API. These are functional but not as realistic as proper audio samples.

## Usage in Game

The audio system automatically:
- Loads all audio files on game start
- Plays appropriate sounds based on game events
- Adjusts volume based on cube weight and impact force
- Provides fallback sounds if files are missing
- Manages audio context and user interaction requirements
