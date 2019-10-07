import React, { Component} from 'react';
import * as THREE from 'three';
import { TWEEN } from '../../node_modules/three/examples/jsm/libs/tween.module.min.js';
import { CSS3DRenderer, CSS3DObject } from '../../node_modules/three/examples/jsm/renderers/CSS3DRenderer.js';
import '../css/style.css';
import data from './threeData';
import { func } from 'prop-types';

class ThreeComp extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
            screenstate : 'desktop',
        }

        this.table = [
            "Board",
            "Portfolio",
            "Introduce"
        ]

        this.targets = [];
        this.objects = [];

        this.renderer = new CSS3DRenderer();
        this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
        this.scene = new THREE.Scene();
        
        this.frameId = null;
        this.mount = null;
        this.skycube = null;
    }

    init = () => 
    {
        this.mount.appendChild(this.renderer.domElement);

        this.scene.add( this.mesh );

        this.camera.position.z = 300;

        this.create_CSS3DObject();

        this.skybox();

        this.animate();
    }

    transform = ( objects, duration ) => 
    {
        TWEEN.removeAll(); // 동작 초기화, 안하면 업데이트시 누적된 동작 수행됨

        for ( let i = 0; i < objects.length; i ++ ) {
            const object = objects[ i ];
            //const target = targets[ i ];
            new TWEEN.Tween( object.position )
                .to( { x: object.position.x, y: object.position.y, z: object.position.z }, duration)
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();
            new TWEEN.Tween( object.rotation )
                .to( { x: object.rotation.x, y: object.rotation.y, z: object.rotation.z }, duration )
                .easing( TWEEN.Easing.Exponential.InOut )
                .start();
        }
        new TWEEN.Tween( this )
            .to( {}, duration * 2 )
            .onUpdate( this.render )
            .start();
    }

    create_CSS3DObject = () => {

        for ( let i = 0; i < this.table.length; ++i ) {
            const element = document.createElement( 'div' );
            element.className = 'element';
            element.textContent = this.table[i];
            element.style.backgroundColor = 'rgba(0,127,127,' + ( Math.random() * 0.5 + 0.25 ) + ')';

            const object = new CSS3DObject( element );
            object.position.x = i * 10;
            object.position.y = i * 10;
            object.position.z = i * 10;
            this.scene.add( object );
            this.objects.push( object );

            // var object = new THREE.Object3D();
            // object.position.x = ( table[ i + 3 ] * 140 ) - 1330;
            // object.position.y = - ( table[ i + 4 ] * 180 ) + 990;
            // targets.push( object );
        }

        //this.transform( this.objects, 2000 );
    }

    skybox = () => {
        const self = this;
        const geometry = new THREE.CubeGeometry(9000,9000,9000);
        const cubeMaterials = [];
        const promises = [];

        data.map(url => {
            const loader = new THREE.TextureLoader();
            promises.push(loader.load(
                // resource URL
                url,
            
                // onLoad callback
                function ( texture ) {
                    return Promise.resolve();
                },
            
                // onProgress callback currently not supported
                undefined,
            
                // onError callback
                function ( err ) {
                    console.error( 'An error happened : ' + err );
                    return Promise.reject();
                }
            ));
        });  

        Promise.all(promises).then((values) => {

            for(let i = 0 ; i < values.length ; ++i) {
                const material = new THREE.MeshBasicMaterial( {
                    map: values[i],
                    side: THREE.DoubleSide
                 } );
                cubeMaterials.push(material);    
            }

            self.skycube = new THREE.Mesh( geometry, cubeMaterials );
            self.scene.add(self.skycube);  
        });
    }

    animate = () =>
    {        
        this.renderer.render( this.scene, this.camera );

        this.frameId = requestAnimationFrame(this.animate);

        TWEEN.update();
    }

    stop = () => {
        cancelAnimationFrame(this.frameId);
        this.mount.removeChild (this.renderer.domElement);  // 메모리 해제
    }

    resize = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    render () {
        return (
            <div id="three-renderer" ref={(mount) => { this.mount = mount }} >
            </div>
        );
    }

    componentDidMount () {
        window.addEventListener('resize', () => {setTimeout(this.resize, 100)});
        this.resize();
        this.init();
    }

    componentWillUnmount () {
        this.stop();
    }
}

export default ThreeComp;