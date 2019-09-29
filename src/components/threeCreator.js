import React, { Component} from 'react';
import * as THREE from 'three';
import '../css/style.css';

class ThreeComp extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
            screenstate : 'desktop',
        }

        this.renderer = new THREE.WebGLRenderer();
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

        this.frameId = null;
        this.mount = null;

        // test model
        this.geometry = new THREE.BoxGeometry( 0.2, 0.2, 0.2 );
        this.material = new THREE.MeshNormalMaterial();
        this.mesh = new THREE.Mesh( this.geometry, this.material );

        this.Init = this.init.bind(this);
        this.Stop = this.stop.bind(this);
        this.Animate = this.animate.bind(this);
    }

    init() {

        this.mount.appendChild(this.renderer.domElement);

        this.scene.add( this.mesh );

        this.camera.position.z = 1;

        this.Animate();
    }

    animate () 
    {    
        this.mesh.rotation.x += 0.01;
        this.mesh.rotation.y += 0.02;
    
        this.renderer.render( this.scene, this.camera );

        this.frameId = requestAnimationFrame(this.Animate)
    }

    stop () {
        cancelAnimationFrame(this.frameId);
        this.mount.removeChild (this.renderer.domElement);  // 메모리 해제
    }

    resize () {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    render () {
        return (
            <div id="three-renderer" ref={(mount) => { this.mount = mount }} />
        );
    }

    componentDidMount () {
        window.addEventListener('resize', () => {setTimeout(this.resize.bind(this), 100)});
        this.resize();
        this.Init();
    }

    componentWillUnmount () {
        this.Stop();
    }
}

export default ThreeComp;