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
