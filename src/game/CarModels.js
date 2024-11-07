import * as THREE from 'three';

export class CarModels {
  static getModel(type) {
    switch (type) {
      case 'sports':
        return CarModels.createSportsCar();
      case 'suv':
        return CarModels.createSUV();
      case 'muscle':
        return CarModels.createMuscleCar();
      case 'supercar':
        return CarModels.createSuperCar();
      default:
        return CarModels.createSportsCar();
    }
  }

  static createSportsCar() {
    const group = new THREE.Group();

    // Main body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.5, 4);
    const bodyMesh = new THREE.Mesh(
      bodyGeometry,
      new THREE.MeshPhongMaterial({ color: 0x000000 })
    );
    bodyMesh.position.y = 0.5;
    group.add(bodyMesh);

    // Hood and trunk (sloped)
    const hoodGeometry = new THREE.BoxGeometry(1.8, 0.2, 1);
    const hood = new THREE.Mesh(
      hoodGeometry,
      new THREE.MeshPhongMaterial({ color: 0x000000 })
    );
    hood.position.set(0, 0.6, 1.5);
    hood.rotation.x = -0.1;
    group.add(hood);

    // Cabin
    const cabinGeometry = new THREE.BoxGeometry(1.7, 0.7, 1.5);
    const cabin = new THREE.Mesh(
      cabinGeometry,
      new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    cabin.position.set(0, 0.85, 0);
    group.add(cabin);

    // Windows
    const windowMaterial = new THREE.MeshPhongMaterial({ 
      color: 0x222222,
      transparent: true,
      opacity: 0.7
    });

    const windshieldGeometry = new THREE.PlaneGeometry(1.6, 0.8);
    const windshield = new THREE.Mesh(windshieldGeometry, windowMaterial);
    windshield.position.set(0, 0.9, 0.7);
    windshield.rotation.x = -Math.PI / 3;
    group.add(windshield);

    return group;
  }

  static createSUV() {
    const group = new THREE.Group();

    // Main body (taller and wider)
    const bodyGeometry = new THREE.BoxGeometry(2.2, 1.2, 4.5);
    const bodyMesh = new THREE.Mesh(
      bodyGeometry,
      new THREE.MeshPhongMaterial({ color: 0x000000 })
    );
    bodyMesh.position.y = 0.6;
    group.add(bodyMesh);

    // Hood (more horizontal)
    const hoodGeometry = new THREE.BoxGeometry(2.1, 0.3, 1);
    const hood = new THREE.Mesh(
      hoodGeometry,
      new THREE.MeshPhongMaterial({ color: 0x000000 })
    );
    hood.position.set(0, 1.2, 1.7);
    group.add(hood);

    // Larger windows
    const windowMaterial = new THREE.MeshPhongMaterial({
      color: 0x222222,
      transparent: true,
      opacity: 0.7
    });

    const sideWindowGeometry = new THREE.PlaneGeometry(1, 0.8);
    const leftWindow = new THREE.Mesh(sideWindowGeometry, windowMaterial);
    leftWindow.position.set(-1.1, 1.2, 0);
    leftWindow.rotation.y = Math.PI / 2;
    group.add(leftWindow);

    const rightWindow = leftWindow.clone();
    rightWindow.position.x = 1.1;
    rightWindow.rotation.y = -Math.PI / 2;
    group.add(rightWindow);

    return group;
  }

  static createMuscleCar() {
    const group = new THREE.Group();

    // Wide, low body
    const bodyGeometry = new THREE.BoxGeometry(2.4, 0.6, 4.2);
    const bodyMesh = new THREE.Mesh(
      bodyGeometry,
      new THREE.MeshPhongMaterial({ color: 0x000000 })
    );
    bodyMesh.position.y = 0.4;
    group.add(bodyMesh);

    // Prominent hood with scoop
    const hoodGeometry = new THREE.BoxGeometry(2.2, 0.3, 1.5);
    const hood = new THREE.Mesh(
      hoodGeometry,
      new THREE.MeshPhongMaterial({ color: 0x000000 })
    );
    hood.position.set(0, 0.5, 1.2);
    group.add(hood);

    // Hood scoop
    const scoopGeometry = new THREE.BoxGeometry(0.8, 0.2, 0.8);
    const scoop = new THREE.Mesh(
      scoopGeometry,
      new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    scoop.position.set(0, 0.7, 1.2);
    group.add(scoop);

    return group;
  }

  static createSuperCar() {
    const group = new THREE.Group();

    // Low, sleek body
    const bodyGeometry = new THREE.BoxGeometry(2, 0.4, 4.5);
    const bodyMesh = new THREE.Mesh(
      bodyGeometry,
      new THREE.MeshPhongMaterial({ color: 0x000000 })
    );
    bodyMesh.position.y = 0.3;
    group.add(bodyMesh);

    // Aerodynamic hood
    const hoodGeometry = new THREE.BoxGeometry(1.9, 0.2, 1.2);
    const hood = new THREE.Mesh(
      hoodGeometry,
      new THREE.MeshPhongMaterial({ color: 0x000000 })
    );
    hood.position.set(0, 0.4, 1.5);
    hood.rotation.x = -0.15;
    group.add(hood);

    // Rear wing
    const wingGeometry = new THREE.BoxGeometry(2, 0.1, 0.4);
    const wing = new THREE.Mesh(
      wingGeometry,
      new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    wing.position.set(0, 0.8, -1.8);
    group.add(wing);

    // Wing supports
    const supportGeometry = new THREE.BoxGeometry(0.1, 0.4, 0.1);
    const leftSupport = new THREE.Mesh(
      supportGeometry,
      new THREE.MeshPhongMaterial({ color: 0x111111 })
    );
    leftSupport.position.set(-0.8, 0.6, -1.8);
    group.add(leftSupport);

    const rightSupport = leftSupport.clone();
    rightSupport.position.x = 0.8;
    group.add(rightSupport);

    return group;
  }
}