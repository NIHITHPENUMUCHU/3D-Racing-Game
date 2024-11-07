import * as THREE from 'three';

export class Effects {
  constructor(scene, camera) {
    this.scene = scene;
    this.camera = camera;
    
    // Add environmental effects
    this.addFog();
    this.addSkybox();
  }

  addFog() {
    this.scene.fog = new THREE.FogExp2(0x888888, 0.002);
  }

  addSkybox() {
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

  update() {
    // Update any dynamic effects here
  }
}