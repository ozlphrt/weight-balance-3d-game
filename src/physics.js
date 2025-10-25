// Weight Balance - Cannon-es Physics World Management
import * as CANNON from 'cannon-es';

// Create and configure the physics world
export function createPhysicsWorld() {
  const world = new CANNON.World({
    gravity: new CANNON.Vec3(0, -9.82, 0), // Earth gravity
    broadphase: new CANNON.NaiveBroadphase(), // Reverted to stable version
    solver: new CANNON.GSSolver()
  });
  
  // Configure solver
  world.solver.iterations = 10; // Reverted to original
  world.solver.tolerance = 0.1;
  
  // Configure broadphase
  world.broadphase.useBoundingBoxes = true;
  
  // Set default material properties
  const defaultMaterial = new CANNON.Material('default');
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.4,
      restitution: 0.3
    }
  );
  world.addContactMaterial(defaultContactMaterial);
  world.defaultContactMaterial = defaultContactMaterial;
  
  // Add collision event listener for realistic sound effects
  world.addEventListener('postStep', () => {
    // Check for collisions and play appropriate sounds
    checkCollisions(world);
  });
  
  return world;
}

// Create physics body for cubes
export function createCubePhysicsBody(weight, position) {
  // Calculate size based on weight (1-5)
  const baseSize = 0.4;
  const size = baseSize + (weight - 1) * 0.1;
  
  // Create box shape
  const shape = new CANNON.Box(new CANNON.Vec3(size/2, size/2, size/2));
  
  // Create body with mass based on weight
  const body = new CANNON.Body({ 
    mass: weight,
    material: new CANNON.Material('cube')
  });
  
  body.addShape(shape);
  body.position.set(position.x, position.y, position.z);
  
  // Store weight data for collision sound effects
  body.userData = { weight: weight };
  
  // Set material properties
  body.material.friction = 0.4;
  body.material.restitution = 0.2;
  
  return body;
}

// Create physics body for platform
export function createPlatformPhysicsBody() {
  const shape = new CANNON.Plane();
  const body = new CANNON.Body({ mass: 0 }); // Static body
  body.addShape(shape);
  body.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
  
  return body;
}

// Collision detection for realistic sound effects
let lastCollisionTime = 0;
const collisionCooldown = 100; // Minimum time between collision sounds (ms)

function checkCollisions(world) {
  const currentTime = Date.now();
  
  // Only check for collisions every few frames to avoid spam
  if (currentTime - lastCollisionTime < collisionCooldown) {
    return;
  }
  
  // Get all bodies in the world
  const bodies = world.bodies;
  
  for (let i = 0; i < bodies.length; i++) {
    const bodyA = bodies[i];
    
    // Skip static bodies (platform)
    if (bodyA.mass === 0) continue;
    
    // Check if body is moving fast enough to make sound
    const velocity = bodyA.velocity.length();
    if (velocity < 0.5) continue; // Only play sounds for significant movement
    
    for (let j = i + 1; j < bodies.length; j++) {
      const bodyB = bodies[j];
      
      // Skip static bodies
      if (bodyB.mass === 0) continue;
      
      // Check if bodies are close enough to potentially collide
      const distance = bodyA.position.distanceTo(bodyB.position);
      const minDistance = 0.8; // Minimum distance for collision sound
      
      if (distance < minDistance) {
        // Calculate impact force based on relative velocity
        const relativeVelocity = bodyA.velocity.clone().vsub(bodyB.velocity);
        const impactForce = relativeVelocity.length();
        
        // Only play sound for significant impacts
        if (impactForce > 1.0) {
          // Get cube weights from body userData or estimate from mass
          const weightA = bodyA.userData?.weight || bodyA.mass;
          const weightB = bodyB.userData?.weight || bodyB.mass;
          
          
          lastCollisionTime = currentTime;
          break; // Only one collision sound per frame
        }
      }
    }
    
    if (currentTime - lastCollisionTime < collisionCooldown) {
      break; // Exit outer loop if we just played a sound
    }
  }
}
