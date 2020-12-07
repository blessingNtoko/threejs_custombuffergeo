import { Component } from '@angular/core';
import { timeStamp } from 'console';
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

    const segmentsAround = 24;
    const segmentsDown = 16;
    const {positions, indices} = this.makeSpherePos(segmentsAround, segmentsDown);
    // Because positions returned are unit sphere positions so they are exactly the same values we need for normals so we can just duplicate them for the normals.
    const normals = positions.slice();

    const geometry = new THREE.BufferGeometry();
    const posNumComponents = 3;
    const normNumComponents = 3;

    const positionAttr = new THREE.BufferAttribute(positions, posNumComponents);
    positionAttr.setUsage(THREE.DynamicDrawUsage);
    geometry.setAttribute('position', positionAttr);
    geometry.setAttribute('normal', new THREE.BufferAttribute(normals, normNumComponents));
    geometry.setIndex(indices);

    const texture = this.textureLoad.load('../assets/textures/stars.jpg');

    const objs3D = [
      this.makeInst(geometry, 'red', 0, texture)
    ]

    window.addEventListener('resize', () => {
      this.renderer.setSize(window.innerWidth, window.innerHeight);
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
    });

    const animate = (time) => {
      time *= .001;
      const temp = new THREE.Vector3();

      for (let i = 0; i < positions.length; i += 3) {
        const quad = (i / 12 | 0);
        const ringID = quad / segmentsAround | 0;
        const ringQuadID = quad % segmentsAround;
        const ringU = ringQuadID / segmentsAround;
        const angle = ringU * Math.PI * 2;
        temp.fromArray(normals, i);
        temp.multiplyScalar(THREE.MathUtils.lerp(1, 1.4, Math.sin(time + ringID + angle) * .5 + .5));
        temp.toArray(positions, i);
      }
      positionAttr.needsUpdate = true;

      objs3D.forEach((obj, ndx) => {
        const speed = -.2 + ndx * .1;
        const rot = time * speed;
        obj.rotation.y = rot;
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
      longHelper.rotation.y = long;
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
