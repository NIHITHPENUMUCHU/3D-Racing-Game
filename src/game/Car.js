import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { CarModels } from './CarModels.js';

export class Car {
  constructor(scene, world, color = 0xff0000, isPlayer = false, carType = 'sports') {
    this.speed = 0;
    this.maxSpeed = this.getCarStats(carType).maxSpeed;
    this.acceleration = this.getCarStats(carType).acceleration;
    this.turnSpeed = this.getCarStats(carType).turnSpeed;
    this.powerSteering = this.getCarStats(carType).powerSteering;
    this.isPlayer = isPlayer;
    this.nitroAmount = 100;
    this.nitroRechargeRate = 10;
    this.nitroDepletionRate = 30;
    this.nitroSpeedBoost = 1.5;
    this.steeringAngle = 0;
    this.maxSteeringAngle = Math.PI / 3; // 60 degrees max steering angle
    
    // Create car body
    this.mesh = CarModels.getModel(carType);
    this.mesh.traverse(child => {
      if (child instanceof THREE.Mesh) {
        child.material = new THREE.MeshPhongMaterial({ color });
      }
    });
    scene.add(this.mesh);

    // Physics body dimensions based on car type
    const dimensions = this.getCarDimensions(carType);
    const shape = new CANNON.Box(new CANNON.Vec3(
      dimensions.width / 2,
      dimensions.height / 2,
      dimensions.length / 2
    ));
    
    this.body = new CANNON.Body({
      mass: dimensions.mass,
      position: new CANNON.Vec3(0, dimensions.height / 2, 0),
      shape,
      linearDamping: 0.5, // Add damping to prevent sliding
      angularDamping: 0.5 // Add angular damping for better control
    });
    world.addBody(this.body);

    // Wheels
    this.wheels = [];
    this.setupWheels(carType);

    // Camera setup for player
    if (isPlayer) {
      this.setupCameras();
    }

    // Current movement direction
    this.currentVelocity = new CANNON.Vec3(0, 0, 0);
  }

  getCarStats(type) {
    const stats = {
      sports: {
        maxSpeed: 50,
        acceleration: 0.5,
        turnSpeed: 0.03,
        powerSteering: 1.2
      },
      suv: {
        maxSpeed: 40,
        acceleration: 0.3,
        turnSpeed: 0.025,
        powerSteering: 0.8
      },
      muscle: {
        maxSpeed: 45,
        acceleration: 0.6,
        turnSpeed: 0.028,
        powerSteering: 1.0
      },
      supercar: {
        maxSpeed: 60,
        acceleration: 0.7,
        turnSpeed: 0.035,
        powerSteering: 1.5
      }
    };
    return stats[type] || stats.sports;
  }

  getCarDimensions(type) {
    const dimensions = {
      sports: {
        width: 2,
        height: 1,
        length: 4,
        mass: 1000
      },
      suv: {
        width: 2.2,
        height: 1.8,
        length: 4.5,
        mass: 2000
      },
      muscle: {
        width: 2.4,
        height: 1.3,
        length: 4.2,
        mass: 1500
      },
      supercar: {
        width: 2,
        height: 1,
        length: 4.5,
        mass: 800
      }
    };
    return dimensions[type] || dimensions.sports;
  }

  setupWheels(carType) {
    const dimensions = this.getCarDimensions(carType);
    const wheelRadius = 0.4;
    const wheelThickness = 0.3;
    
    const wheelGeometry = new THREE.CylinderGeometry(
      wheelRadius,
      wheelRadius,
      wheelThickness,
      32
    );
    const wheelMaterial = new THREE.MeshPhongMaterial({ color: 0x333333 });
    
    const wheelPositions = [
      { x: -dimensions.width/2 + 0.2, y: -dimensions.height/2 + wheelRadius, z: -dimensions.length/4 },
      { x: dimensions.width/2 - 0.2, y: -dimensions.height/2 + wheelRadius, z: -dimensions.length/4 },
      { x: -dimensions.width/2 + 0.2, y: -dimensions.height/2 + wheelRadius, z: dimensions.length/4 },
      { x: dimensions.width/2 - 0.2, y: -dimensions.height/2 + wheelRadius, z: dimensions.length/4 }
    ];

    wheelPositions.forEach((pos, index) => {
      const wheel = new THREE.Mesh(wheelGeometry, wheelMaterial);
      wheel.position.set(pos.x, pos.y, pos.z);
      wheel.rotation.x = Math.PI / 2;
      this.mesh.add(wheel);
      this.wheels.push({
        mesh: wheel,
        isFront: index < 2 // First two wheels are front wheels
      });
    });
  }

  setupCameras() {
    this.cameras = {
      chase: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000),
      cockpit: new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    };
    
    this.currentCamera = 'chase';
    
    // Position the chase camera
    this.cameras.chase.position.set(0, 5, -10);
    this.cameras.chase.lookAt(this.mesh.position);
    
    // Position the cockpit camera
    this.cameras.cockpit.position.set(0, 1.5, 0);
    this.cameras.cockpit.lookAt(new THREE.Vector3(0, 1.5, 10));
    this.mesh.add(this.cameras.cockpit);
  }

  getCurrentCamera() {
    return this.cameras[this.currentCamera];
  }

  switchCamera() {
    this.currentCamera = this.currentCamera === 'chase' ? 'cockpit' : 'chase';
  }

  update(controls = {}, deltaTime = 1/60) {
    if (this.isPlayer || controls.ai) {
      // Handle nitro
      if (controls.nitro && this.nitroAmount > 0) {
        this.nitroAmount = Math.max(0, this.nitroAmount - this.nitroDepletionRate * deltaTime);
      } else {
        this.nitroAmount = Math.min(100, this.nitroAmount + this.nitroRechargeRate * deltaTime);
      }

      // Get the forward direction based on car's rotation
      const forward = new CANNON.Vec3(0, 0, 1);
      const right = new CANNON.Vec3(1, 0, 0);
      this.body.quaternion.vmult(forward, forward);
      this.body.quaternion.vmult(right, right);

      // Calculate acceleration based on controls
      const speedMultiplier = controls.nitro && this.nitroAmount > 0 ? this.nitroSpeedBoost : 1;
      let acceleration = new CANNON.Vec3(0, 0, 0);

      if (controls.forward) {
        forward.scale(this.acceleration * speedMultiplier, acceleration);
      } else if (controls.backward) {
        forward.scale(-this.acceleration * speedMultiplier * 0.5, acceleration);
      }

      // Apply acceleration to velocity
      this.body.velocity.vadd(acceleration, this.body.velocity);

      // Calculate power steering factor based on speed
      const currentSpeed = this.body.velocity.length();
      const speedFactor = Math.max(0.5, Math.min(1, currentSpeed / (this.maxSpeed * 0.5)));
      const powerSteeringFactor = this.powerSteering * (2 - speedFactor);

      // Update steering angle
      if (controls.left) {
        this.steeringAngle = Math.min(this.steeringAngle + this.turnSpeed * powerSteeringFactor, this.maxSteeringAngle);
      } else if (controls.right) {
        this.steeringAngle = Math.max(this.steeringAngle - this.turnSpeed * powerSteeringFactor, -this.maxSteeringAngle);
      } else {
        // Return steering to center
        this.steeringAngle *= 0.9;
      }

      // Apply steering
      this.body.angularVelocity.y = this.steeringAngle * 5 * speedFactor;

      // Update wheel rotations based on steering
      this.wheels.forEach((wheel, index) => {
        if (wheel.isFront) {
          wheel.mesh.rotation.y = this.steeringAngle;
        }
      });

      // Apply speed limits
      const currentSpeedSq = this.body.velocity.lengthSquared();
      const maxSpeedSq = Math.pow(this.maxSpeed * speedMultiplier, 2);
      if (currentSpeedSq > maxSpeedSq) {
        this.body.velocity.scale(Math.sqrt(maxSpeedSq / currentSpeedSq), this.body.velocity);
      }

      // Apply brakes
      if (controls.brake) {
        this.body.velocity.scale(0.95, this.body.velocity);
      }

      // Natural deceleration
      if (!controls.forward && !controls.backward) {
        this.body.velocity.scale(0.99, this.body.velocity);
      }
    }

    // Update visual position
    this.mesh.position.copy(this.body.position);
    this.mesh.quaternion.copy(this.body.quaternion);

    // Animate wheels
    const wheelSpeed = this.body.velocity.length() * 0.3;
    this.wheels.forEach(wheel => {
      wheel.mesh.rotation.x += wheelSpeed;
    });

    // Update chase camera position if player
    if (this.isPlayer && this.currentCamera === 'chase') {
      const cameraOffset = new THREE.Vector3(0, 5, -10);
      cameraOffset.applyQuaternion(this.mesh.quaternion);
      this.cameras.chase.position.copy(this.mesh.position).add(cameraOffset);
      this.cameras.chase.lookAt(this.mesh.position);
    }
  }

  reset() {
    this.speed = 0;
    this.steeringAngle = 0;
    this.body.position.set(0, 1, 0);
    this.body.velocity.set(0, 0, 0);
    this.body.angularVelocity.set(0, 0, 0);
    this.body.quaternion.setFromAxisAngle(new CANNON.Vec3(0, 1, 0), 0);
    this.nitroAmount = 100;
  }
}