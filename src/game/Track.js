import * as THREE from 'three';
import * as CANNON from 'cannon-es';

export class Track {
  constructor(scene, world) {
    this.createRaceTrack(scene);
    this.createPhysicsTrack(world);
    this.addTrackDecorations(scene);
  }

  createRaceTrack(scene) {
    // Create race track path
    const trackShape = new THREE.Shape();
    trackShape.moveTo(-50, -50);
    trackShape.lineTo(-50, 50);
    trackShape.lineTo(50, 50);
    trackShape.lineTo(50, -50);
    trackShape.lineTo(-50, -50);

    const hole = new THREE.Path();
    hole.moveTo(-30, -30);
    hole.lineTo(-30, 30);
    hole.lineTo(30, 30);
    hole.lineTo(30, -30);
    hole.lineTo(-30, -30);
    trackShape.holes.push(hole);

    // Create track geometry
    const extrudeSettings = {
      steps: 1,
      depth: 0.3,
      bevelEnabled: true,
      bevelThickness: 0.2,
      bevelSize: 0.1,
      bevelOffset: 0,
      bevelSegments: 3
    };

    const geometry = new THREE.ExtrudeGeometry(trackShape, extrudeSettings);
    
    // Create materials for track
    const materials = [
      new THREE.MeshPhongMaterial({ color: 0x333333 }), // Track surface
      new THREE.MeshPhongMaterial({ color: 0xff0000 }) // Track sides
    ];

    const mesh = new THREE.Mesh(geometry, materials);
    mesh.rotation.x = -Math.PI / 2;
    mesh.receiveShadow = true;
    scene.add(mesh);

    // Add track markings
    this.addTrackMarkings(scene);
  }

  addTrackMarkings(scene) {
    // Add white lines on the track edges
    const edgeGeometry = new THREE.PlaneGeometry(100, 0.3);
    const edgeMaterial = new THREE.MeshPhongMaterial({ 
      color: 0xffffff,
      side: THREE.DoubleSide
    });

    // Outer track markings
    for (let i = 0; i < 4; i++) {
      const edge = new THREE.Mesh(edgeGeometry, edgeMaterial);
      edge.rotation.x = -Math.PI / 2;
      
      if (i < 2) {
        edge.position.set(0, 0.01, i === 0 ? -50 : 50);
      } else {
        edge.rotation.z = Math.PI / 2;
        edge.position.set(i === 2 ? -50 : 50, 0.01, 0);
      }
      
      scene.add(edge);
    }

    // Add checkered pattern near finish line
    const checkerGeometry = new THREE.PlaneGeometry(1, 1);
    const whiteMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    const blackMaterial = new THREE.MeshPhongMaterial({ color: 0x000000 });

    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 2; j++) {
        const checker = new THREE.Mesh(
          checkerGeometry,
          (i + j) % 2 === 0 ? whiteMaterial : blackMaterial
        );
        checker.rotation.x = -Math.PI / 2;
        checker.position.set(-4 + i, 0.01, 44 + j);
        scene.add(checker);
      }
    }
  }

  createPhysicsTrack(world) {
    // Ground plane
    const groundShape = new CANNON.Plane();
    const groundBody = new CANNON.Body({ mass: 0 });
    groundBody.addShape(groundShape);
    groundBody.quaternion.setFromAxisAngle(
      new CANNON.Vec3(1, 0, 0),
      -Math.PI / 2
    );
    world.addBody(groundBody);

    // Track barriers
    this.addTrackBarriers(world);
  }

  addTrackBarriers(world) {
    const barrierShape = new CANNON.Box(new CANNON.Vec3(0.5, 1, 50));
    
    // Outer barriers
    const barriers = [
      { pos: [-50.5, 1, 0], rot: [0, 0, 0] },
      { pos: [50.5, 1, 0], rot: [0, 0, 0] },
      { pos: [0, 1, -50.5], rot: [0, Math.PI / 2, 0] },
      { pos: [0, 1, 50.5], rot: [0, Math.PI / 2, 0] }
    ];

    barriers.forEach(({ pos, rot }) => {
      const barrier = new CANNON.Body({
        mass: 0,
        position: new CANNON.Vec3(...pos)
      });
      barrier.addShape(barrierShape);
      barrier.quaternion.setFromEuler(...rot);
      world.addBody(barrier);
    });
  }

  addTrackDecorations(scene) {
    // Add tire barriers
    const tireGeometry = new THREE.TorusGeometry(0.4, 0.2, 8, 16);
    const tireMaterial = new THREE.MeshPhongMaterial({ color: 0x222222 });

    for (let i = 0; i < 40; i++) {
      const tire = new THREE.Mesh(tireGeometry, tireMaterial);
      const angle = (i / 40) * Math.PI * 2;
      const radius = 45;
      tire.position.set(
        Math.cos(angle) * radius,
        0.4,
        Math.sin(angle) * radius
      );
      scene.add(tire);
    }
  }
}