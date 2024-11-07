import * as THREE from 'three';
import * as CANNON from 'cannon-es';
import { Car } from './Car.js';
import { Track } from './Track.js';
import { Environment } from './Environment.js';

export class Game {
  constructor() {
    this.setupRenderer();
    this.setupPhysics();
    this.setupBasicLighting();
    
    // Initialize game elements
    this.environment = new Environment(this.scene);
    this.track = new Track(this.scene, this.world);
    this.playerCar = new Car(this.scene, this.world, 0xff0000, true, 'supercar');
    this.setupAICars();
    
    this.setupControls();
    this.setupUI();
    
    this.lastTime = performance.now();
    this.animate();
  }

  setupRenderer() {
    this.scene = new THREE.Scene();
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    document.body.appendChild(this.renderer.domElement);

    window.addEventListener('resize', () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      this.renderer.setSize(width, height);
      if (this.playerCar) {
        const camera = this.playerCar.getCurrentCamera();
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    });
  }

  setupPhysics() {
    this.world = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    });
    this.world.defaultContactMaterial.friction = 0.001;
    this.world.defaultContactMaterial.restitution = 0.1;
  }

  setupBasicLighting() {
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    this.scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(100, 100, 50);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    this.scene.add(directionalLight);
  }

  setupControls() {
    this.controls = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      brake: false,
      nitro: false
    };

    window.addEventListener('keydown', (e) => {
      switch(e.key) {
        case 'ArrowUp': this.controls.forward = true; break;
        case 'ArrowDown': this.controls.backward = true; break;
        case 'ArrowLeft': this.controls.left = true; break;
        case 'ArrowRight': this.controls.right = true; break;
        case ' ': this.controls.brake = true; break;
        case 'Shift': this.controls.nitro = true; break;
        case 'c': this.playerCar.switchCamera(); break;
      }
    });

    window.addEventListener('keyup', (e) => {
      switch(e.key) {
        case 'ArrowUp': this.controls.forward = false; break;
        case 'ArrowDown': this.controls.backward = false; break;
        case 'ArrowLeft': this.controls.left = false; break;
        case 'ArrowRight': this.controls.right = false; break;
        case ' ': this.controls.brake = false; break;
        case 'Shift': this.controls.nitro = false; break;
      }
    });
  }

  setupAICars() {
    this.aiCars = [];
    const aiTypes = ['sports', 'suv', 'muscle', 'supercar'];
    const aiColors = [0x00ff00, 0x0000ff, 0xffff00, 0xff00ff];
    
    for (let i = 0; i < 4; i++) {
      const aiCar = new Car(
        this.scene,
        this.world,
        aiColors[i],
        false,
        aiTypes[i]
      );
      aiCar.body.position.set(
        Math.random() * 20 - 10,
        1,
        Math.random() * 20 - 10
      );
      this.aiCars.push(aiCar);
    }
  }

  setupUI() {
    this.scoreElement = document.createElement('div');
    this.scoreElement.style.position = 'absolute';
    this.scoreElement.style.top = '20px';
    this.scoreElement.style.left = '20px';
    this.scoreElement.style.color = 'white';
    this.scoreElement.style.fontSize = '24px';
    this.scoreElement.style.fontFamily = 'Arial';
    document.body.appendChild(this.scoreElement);

    this.nitroElement = document.createElement('div');
    this.nitroElement.style.position = 'absolute';
    this.nitroElement.style.bottom = '20px';
    this.nitroElement.style.left = '20px';
    this.nitroElement.style.color = 'white';
    this.nitroElement.style.fontSize = '18px';
    this.nitroElement.style.fontFamily = 'Arial';
    document.body.appendChild(this.nitroElement);
  }

  updateUI() {
    this.scoreElement.textContent = `Score: ${Math.floor(this.playerCar.body.position.z)}`;
    this.nitroElement.textContent = `Nitro: ${Math.floor(this.playerCar.nitroAmount)}%`;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const currentTime = performance.now();
    const deltaTime = (currentTime - this.lastTime) / 1000;
    this.lastTime = currentTime;

    this.world.step(1/60);
    this.playerCar.update(this.controls, deltaTime);
    this.updateAICars(deltaTime);
    this.environment.update(deltaTime);
    this.updateUI();

    this.renderer.render(this.scene, this.playerCar.getCurrentCamera());
  }

  updateAICars(deltaTime) {
    this.aiCars.forEach((aiCar) => {
      const controls = {
        forward: true,
        left: Math.sin(Date.now() * 0.001) > 0.7,
        right: Math.sin(Date.now() * 0.001) < -0.7,
        brake: false,
        nitro: Math.random() > 0.9,
        ai: true
      };
      aiCar.update(controls, deltaTime);
    });
  }
}