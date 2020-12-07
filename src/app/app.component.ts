import { Component } from '@angular/core';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  public scene = new THREE.Scene();
  public renderer = new THREE.WebGLRenderer();
  public camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, .1, 1000);
  public orbControl = new OrbitControls(this.camera, this.renderer.domElement);

  ngOnInit() {
    this.init();
  }

  public init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('black');

    this.camera.position.set(0, 10, 10);
    this.camera.lookAt(0, 0, 0);
    this.orbControl.target.set(0, 0, 0);
    this.orbControl.update();

    const vertices = [
      // front
      { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0], },
      { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0], },
      { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1], },

      { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1], },
      { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0], },
      { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1], },
      // right
      { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0], },
      { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0], },
      { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1], },

      { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1], },
      { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0], },
      { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1], },
      // back
      { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0], },
      { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0], },
      { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1], },

      { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1], },
      { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0], },
      { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1], },
      // left
      { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0], },
      { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0], },
      { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1], },

      { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1], },
      { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0], },
      { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1], },
      // top
      { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0], },
      { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0], },
      { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1], },

      { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1], },
      { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0], },
      { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1], },
      // bottom
      { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0], },
      { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0], },
      { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1], },

      { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1], },
      { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0], },
      { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1], },
    ];

    const positions = [];
    const normals = [];
    const uvs = [];

    for (const vertex of vertices) {
      positions.push(...vertex.pos);
      normals.push(...vertex.norm);
      uvs.push(...vertex.uv);
    };

    console.log('Positions ->', positions);
    console.log('Normals ->', normals);
    console.log('UVs ->', uvs);

    const buffGeo = new THREE.BufferGeometry();
    const posNumComponents = 3;
    const normNumComponents = 3;
    const uvNumComponents = 2;

    buffGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(positions), posNumComponents));
    buffGeo.setAttribute('normal', new THREE.BufferAttribute(new Float32Array(normals), normNumComponents));
    buffGeo.setAttribute('uv', new THREE.BufferAttribute(new Float32Array(uvs), uvNumComponents));


    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });

    const animate = (time) => {
      time *= .001;

      this.orbControl.update();


      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  public makeInst(geometry, color, x, texture?) {
    const material = new THREE.MeshPhongMaterial({
      color,
      map: texture ? texture : null
    });

    const obj3D = new THREE.Mesh(geometry, material);
    this.scene.add(obj3D);

    obj3D.position.x = x;
    return obj3D;
  }

  public addLight(...pos) {
    const color = 'white';
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(pos[0], pos[1], pos[2]);
    this.scene.add(light);
  }
}
