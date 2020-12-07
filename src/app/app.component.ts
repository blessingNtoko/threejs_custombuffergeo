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
  public textureLoad = new THREE.TextureLoader();

  ngOnInit() {
    this.init();
  }

  public init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.scene.background = new THREE.Color('grey');

    this.camera.position.set(0, 10, 10);
    this.camera.lookAt(0, 0, 0);
    this.orbControl.target.set(0, 0, 0);
    this.orbControl.update();

    this.addLight(-1, 2, 4);
    this.addLight(1, 2, -2);

    const vertices = [
      // front
      { pos: [-1, -1, 1], norm: [0, 0, 1], uv: [0, 0], },
      { pos: [1, -1, 1], norm: [0, 0, 1], uv: [1, 0], },
      { pos: [-1, 1, 1], norm: [0, 0, 1], uv: [0, 1], },

      { pos: [1, 1, 1], norm: [0, 0, 1], uv: [1, 1], },
      // right
      { pos: [1, -1, 1], norm: [1, 0, 0], uv: [0, 0], },
      { pos: [1, -1, -1], norm: [1, 0, 0], uv: [1, 0], },
      { pos: [1, 1, 1], norm: [1, 0, 0], uv: [0, 1], },

      { pos: [1, 1, -1], norm: [1, 0, 0], uv: [1, 1], },
      // back
      { pos: [1, -1, -1], norm: [0, 0, -1], uv: [0, 0], },
      { pos: [-1, -1, -1], norm: [0, 0, -1], uv: [1, 0], },
      { pos: [1, 1, -1], norm: [0, 0, -1], uv: [0, 1], },

      { pos: [-1, 1, -1], norm: [0, 0, -1], uv: [1, 1], },
      // left
      { pos: [-1, -1, -1], norm: [-1, 0, 0], uv: [0, 0], },
      { pos: [-1, -1, 1], norm: [-1, 0, 0], uv: [1, 0], },
      { pos: [-1, 1, -1], norm: [-1, 0, 0], uv: [0, 1], },

      { pos: [-1, 1, 1], norm: [-1, 0, 0], uv: [1, 1], },
      // top
      { pos: [1, 1, -1], norm: [0, 1, 0], uv: [0, 0], },
      { pos: [-1, 1, -1], norm: [0, 1, 0], uv: [1, 0], },
      { pos: [1, 1, 1], norm: [0, 1, 0], uv: [0, 1], },

      { pos: [-1, 1, 1], norm: [0, 1, 0], uv: [1, 1], },
      // bottom
      { pos: [1, -1, 1], norm: [0, -1, 0], uv: [0, 0], },
      { pos: [-1, -1, 1], norm: [0, -1, 0], uv: [1, 0], },
      { pos: [1, -1, -1], norm: [0, -1, 0], uv: [0, 1], },

      { pos: [-1, -1, -1], norm: [0, -1, 0], uv: [1, 1], },
    ];

    // const positions = [];
    // const normals = [];
    // const uvs = [];

    const numVertices = vertices.length;
    const posNumComponents = 3;
    const normNumComponents = 3;
    const uvNumComponents = 2;
    const positions = new Float32Array(numVertices * posNumComponents);
    const normals = new Float32Array(numVertices * normNumComponents);
    const uvs = new Float32Array(numVertices * uvNumComponents);
    let posNdx = 0;
    let normNdx = 0;
    let uvNdx = 0;

    for (const vertex of vertices) {
      // positions.push(...vertex.pos);
      // normals.push(...vertex.norm);
      // uvs.push(...vertex.uv);

      positions.set(vertex.pos, posNdx);
      normals.set(vertex.norm, normNdx);
      uvs.set(vertex.uv, uvNdx);

      posNdx += posNumComponents;
      normNdx += normNumComponents;
      uvNdx += uvNumComponents;
    };

    console.log('Positions ->', positions);
    console.log('Normals ->', normals);
    console.log('UVs ->', uvs);

    const buffGeo = new THREE.BufferGeometry();

    buffGeo.setAttribute('position', new THREE.BufferAttribute(positions, posNumComponents));
    buffGeo.setAttribute('normal', new THREE.BufferAttribute(normals, normNumComponents));
    buffGeo.setAttribute('uv', new THREE.BufferAttribute(uvs, uvNumComponents));

    buffGeo.setIndex([
      0, 1, 2, 2, 1, 3,
      4, 5, 6, 6, 5, 7,
      8, 9, 10, 10, 9, 11,
      12, 13, 14, 14, 13, 15,
      16, 17, 18, 18, 17, 19,
      20, 21, 22, 22, 21, 23
    ]);

    const texture = this.textureLoad.load('../assets/textures/stars.jpg');

    const cubes = [
      this.makeInst(buffGeo, 'green', -4, texture),
      this.makeInst(buffGeo, 'red', 4, texture),
      this.makeInst(buffGeo, 'blue', 0, texture)
    ];


    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });

    const animate = (time) => {
      time *= .001;

      cubes.forEach((cube, ndx) => {
        const speed = 1 + ndx * .1;
        const rotation = time * speed;
        cube.rotation.x = rotation;
        cube.rotation.y = rotation;
      });

      this.orbControl.update();


      this.renderer.render(this.scene, this.camera);
      requestAnimationFrame(animate);
    }
    requestAnimationFrame(animate);
  }

  public makeSpherePos(segmentsAround, segmentsDown) {
    const numVert = segmentsAround * segmentsDown * 6;
    const numComponents = 3;
    const positions = new Float32Array(numVert * numComponents);
    const indices = [];

    const longHelper = new THREE.Object3D();
    const latHelper = new THREE.Object3D();
    const pointHelper = new THREE.Object3D();
    longHelper.add(latHelper);
    latHelper.add(pointHelper);
    pointHelper.position.z = 1;
    const temp = new THREE.Vector3();

    const getPoint = (lat, long) => {
      latHelper.rotation.x = lat;
      longHelper.rotation.x = long;
      longHelper.updateMatrixWorld(true);
      return pointHelper.getWorldPosition(temp).toArray();
    }

    let posNdx = 0;
    let ndx = 0;
    for (let down = 0; down < segmentsDown; ++down) {
      const v0 = down / segmentsDown;
      const v1 = (down + 1) / segmentsDown;
      const lat0 = (v0 - .5) * Math.PI;
      const lat1 = (v1 - .5) * Math.PI;

      for (let across = 0; across < segmentsAround; ++across) {
        const u0 = across / segmentsAround;
        const u1 = (across + 1) / segmentsAround;
        const long0 = u0 * Math.PI * 2;
        const long1 = u1 * Math.PI * 2;

        positions.set(getPoint(lat0, long0), posNdx); posNdx += numComponents;
        positions.set(getPoint(lat1, long0), posNdx); posNdx += numComponents;
        positions.set(getPoint(lat0, long1), posNdx); posNdx += numComponents;
        positions.set(getPoint(lat1, long1), posNdx); posNdx += numComponents;

        indices.push(
          ndx, ndx + 1, ndx + 2,
          ndx + 2, ndx + 1, ndx + 3
        );
        ndx += 4;
      }
    }
    console.log('Positions & indices ->', {positions, indices});

    return {positions, indices}
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
