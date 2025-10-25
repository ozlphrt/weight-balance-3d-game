// Simple Audio Manager - No Web Audio API complexity
class SimpleAudioManager {
  constructor() {
    this.sounds = new Map();
    this.masterVolume = 0.5;
    this.isInitialized = false;
    
    // Simple sound effects using Web Audio API with proper error handling
    this.init();
  }
  
  async init() {
    try {
      // Create audio context only when needed
      this.audioContext = null;
      this.isInitialized = true;
      console.log('Simple Audio Manager initialized');
    } catch (error) {
      console.warn('Audio initialization failed:', error);
    }
  }
  
  // Create audio context only when first sound is played
  ensureAudioContext() {
    if (!this.audioContext) {
      try {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
      } catch (error) {
        console.warn('Audio context creation failed:', error);
        return false;
      }
    }
    
    // Resume if suspended
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    
    return true;
  }
  
  // Generate simple procedural sounds
  generateTone(frequency, duration, type = 'sine') {
    if (!this.ensureAudioContext()) return;
    
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();
    
    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    
    oscillator.frequency.setValueAtTime(frequency, this.audioContext.currentTime);
    oscillator.type = type;
    
    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(this.masterVolume * 0.3, this.audioContext.currentTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.001, this.audioContext.currentTime + duration);
    
    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }
  
  // Game-specific sound methods
  playCubePlacement(weight) {
    const frequency = 200 + (weight * 50); // Higher weight = higher pitch
    const duration = 0.1 + (weight * 0.05); // Heavier cubes = longer sound
    this.generateTone(frequency, duration, 'square');
  }
  
  playCubeCollision(weight1, weight2) {
    const avgWeight = (weight1 + weight2) / 2;
    const frequency = 150 + (avgWeight * 30);
    const duration = 0.15;
    this.generateTone(frequency, duration, 'sawtooth');
  }
  
  playStructureStrain(stability) {
    if (stability < 0.4) {
      const frequency = 80 + (1 - stability) * 40; // Lower stability = higher pitch
      this.generateTone(frequency, 0.3, 'triangle');
    }
  }
  
  playCollapse(type = 'start') {
    const frequencies = {
      start: 100,
      cascade: 80,
      impact: 60
    };
    this.generateTone(frequencies[type], 0.4, 'sawtooth');
  }
  
  playUIHover() {
    this.generateTone(800, 0.05, 'sine');
  }
  
  playUIClick() {
    this.generateTone(1000, 0.1, 'square');
  }
  
  playLevelComplete() {
    // Play a simple success chord
    this.generateTone(523, 0.2, 'sine'); // C5
    setTimeout(() => this.generateTone(659, 0.2, 'sine'), 100); // E5
    setTimeout(() => this.generateTone(784, 0.3, 'sine'), 200); // G5
  }
  
  playGameOver() {
    // Play a descending tone
    this.generateTone(200, 0.5, 'sawtooth');
  }
  
  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
  }
}

// Create global audio manager instance
export const audioManager = new SimpleAudioManager();
