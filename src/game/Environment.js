import * as THREE from 'three';

export class Environment {
  constructor(scene) {
    this.scene = scene;
    this.setupSkybox();
    this.addTrees();
    this.addStartLine();
    this.addFinishLine();
    this.addSpectatorStands();
  }

  setupSkybox() {
    const loader = new THREE.CubeTextureLoader();
    const texture = loader.load([
      'https://threejs.org/examples/textures/cube/skybox/px.jpg',
      'https://threejs.org/examples/textures/cube/skybox/nx.jpg',
      'https://threejs.org/examples/textures/cube/skybox/py.jpg',
      'https://threejs.org/examples/textures/cube/skybox/ny.jpg',
      'https://threejs.org/examples/textures/cube/skybox/pz.jpg',
      'https://threejs.org/examples/textures/cube/skybox/nz.jpg',
    ]);
    this.scene.background = texture;
  }

  createTree(x, z) {
    const tree = new THREE.Group();

    // Tree trunk
    const trunkGeometry = new THREE.CylinderGeometry(0.5, 0.7, 4, 8);
    const trunkMaterial = new THREE.MeshPhongMaterial({ color: 0x4a2f1b });
    const trunk = new THREE.Mesh(trunkGeometry, trunkMaterial);
    trunk.position.y = 2;
    tree.add(trunk);

    // Tree leaves
    const leavesGeometry = new THREE.ConeGeometry(2, 6, 8);
    const leavesMaterial = new THREE.MeshPhongMaterial({ color: 0x0a5f2c });
    const leaves = new THREE.Mesh(leavesGeometry, leavesMaterial);
    leaves.position.y = 6;
    tree.add(leaves);

    tree.position.set(x, 0, z);
    return tree;
  }

  addTrees() {
    for (let i = 0; i < 50; i++) {
      const angle = (i / 50) * Math.PI * 2;
      const radius = 60 + Math.random() * 10;
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      const tree = this.createTree(x, z);
      this.scene.add(tree);
    }
  }

  addStartLine() {
    // Create the start line ground marking
    const lineGeometry = new THREE.PlaneGeometry(10, 2);
    const lineMaterial = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const startLine = new THREE.Mesh(lineGeometry, lineMaterial);
    startLine.rotation.x = -Math.PI / 2;
    startLine.position.set(0, 0.01, -45);
    this.scene.add(startLine);

    // Create "START" text using boxes
    const letters = [
      this.createLetterS(-2, -45),
      this.createLetterT(-1, -45),
      this.createLetterA(0, -45),
      this.createLetterR(1, -45),
      this.createLetterT(2, -45)
    ];

    letters.forEach(letter => this.scene.add(letter));
  }

  createLetterS(x, z) {
    const group = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    const segments = [
      { pos: [0, 0, 0], scale: [0.6, 0.1, 0.1] },
      { pos: [-0.25, -0.15, 0], scale: [0.1, 0.3, 0.1] },
      { pos: [0, -0.3, 0], scale: [0.6, 0.1, 0.1] },
      { pos: [0.25, -0.45, 0], scale: [0.1, 0.3, 0.1] },
      { pos: [0, -0.6, 0], scale: [0.6, 0.1, 0.1] }
    ];

    segments.forEach(({ pos, scale }) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...pos);
      mesh.scale.set(...scale);
      group.add(mesh);
    });

    group.position.set(x, 0.1, z);
    return group;
  }

  createLetterT(x, z) {
    const group = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    const segments = [
      { pos: [0, 0, 0], scale: [0.6, 0.1, 0.1] },
      { pos: [0, -0.3, 0], scale: [0.1, 0.6, 0.1] }
    ];

    segments.forEach(({ pos, scale }) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...pos);
      mesh.scale.set(...scale);
      group.add(mesh);
    });

    group.position.set(x, 0.1, z);
    return group;
  }

  createLetterA(x, z) {
    const group = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    const segments = [
      { pos: [-0.15, -0.3, 0], scale: [0.1, 0.6, 0.1] },
      { pos: [0.15, -0.3, 0], scale: [0.1, 0.6, 0.1] },
      { pos: [0, 0, 0], scale: [0.4, 0.1, 0.1] },
      { pos: [0, -0.3, 0], scale: [0.4, 0.1, 0.1] }
    ];

    segments.forEach(({ pos, scale }) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...pos);
      mesh.scale.set(...scale);
      group.add(mesh);
    });

    group.position.set(x, 0.1, z);
    return group;
  }

  createLetterR(x, z) {
    const group = new THREE.Group();
    const material = new THREE.MeshPhongMaterial({ color: 0x000000 });
    
    const segments = [
      { pos: [-0.15, -0.3, 0], scale: [0.1, 0.6, 0.1] },
      { pos: [0.15, -0.15, 0], scale: [0.1, 0.3, 0.1] },
      { pos: [0, 0, 0], scale: [0.4, 0.1, 0.1] },
      { pos: [0, -0.3, 0], scale: [0.4, 0.1, 0.1] },
      { pos: [0.15, -0.45, 0], scale: [0.1, 0.3, 0.1] }
    ];

    segments.forEach(({ pos, scale }) => {
      const geometry = new THREE.BoxGeometry(1, 1, 1);
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...pos);
      mesh.scale.set(...scale);
      group.add(mesh);
    });

    group.position.set(x, 0.1, z);
    return group;
  }

  addFinishLine() {
    const geometry = new THREE.PlaneGeometry(10, 2);
    const material = new THREE.MeshPhongMaterial({
      color: 0xffffff,
      side: THREE.DoubleSide
    });
    const finishLine = new THREE.Mesh(geometry, material);
    finishLine.rotation.x = -Math.PI / 2;
    finishLine.position.set(0, 0.01, 45);
    this.scene.add(finishLine);

    // Add checkered pattern
    const checkerSize = 0.5;
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 4; j++) {
        const checkerGeometry = new THREE.PlaneGeometry(checkerSize, checkerSize);
        const checkerMaterial = new THREE.MeshPhongMaterial({
          color: (i + j) % 2 === 0 ? 0x000000 : 0xffffff,
          side: THREE.DoubleSide
        });
        const checker = new THREE.Mesh(checkerGeometry, checkerMaterial);
        checker.rotation.x = -Math.PI / 2;
        checker.position.set(
          -5 + i * checkerSize,
          0.02,
          45 - 1 + j * checkerSize
        );
        this.scene.add(checker);
      }
    }
  }

  addSpectatorStands() {
    const standGeometry = new THREE.BoxGeometry(5, 10, 20);
    const standMaterial = new THREE.MeshPhongMaterial({ color: 0x888888 });
    
    // Left stand
    const leftStand = new THREE.Mesh(standGeometry, standMaterial);
    leftStand.position.set(-60, 5, 0);
    this.scene.add(leftStand);

    // Right stand
    const rightStand = new THREE.Mesh(standGeometry, standMaterial);
    rightStand.position.set(60, 5, 0);
    this.scene.add(rightStand);
  }

  update(deltaTime) {
    // Add any dynamic environment updates here
  }
}