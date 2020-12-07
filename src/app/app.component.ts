import { typeWithParameters } from '@angular/compiler/src/render3/util';
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

  }

  public init() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.camera.position.set(0, 10, 10);
    this.camera.lookAt(0, 0, 0);
    this.orbControl.update();

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
}
