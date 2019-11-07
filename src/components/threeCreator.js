import React, { Component} from 'react';
import * as THREE from 'three';
import { TWEEN } from '../../node_modules/three/examples/jsm/libs/tween.module.min.js';
import { CSS3DRenderer, CSS3DObject } from '../../node_modules/three/examples/jsm/renderers/CSS3DRenderer.js';
import '../css/style.css';
import './threeCSS.css';
import { tableData, skybox } from './threeData';
import { func } from 'prop-types';
import { Vector3 } from 'three';

import arrowL from '../image/arrow_left.png';
import arrowR from '../image/arrow_right.png';

class ThreeComp extends Component
{
    constructor(props) {
        super(props); // 부모 생성자. 없으면 this 구문 사용 불가능
        this.state = {
            screenstate : 'desktop',
            curTarget : 0,
        }

        this.table = tableData;

        this.objects = [];
        this.traceUi = null;

        this.renderer = new CSS3DRenderer();
        this.camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 10000 );
        this.scene = new THREE.Scene();
        this.rayCast = new THREE.Raycaster();
        this.mousevec = new THREE.Vector3();
        
        this.frameId = null;
        this.mount = null;
        this.skycube = null;
    }

    init = () => 
    {
        this.rayCast.setFromCamera(this.mousevec, this.camera);

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
            
            new TWEEN.Tween( object.position )
                .to( { x: object.position.x, y: object.position.y, z: object.position.z }, duration)
                .easing( TWEEN.Easing.Exponential.InOut )
                .onComplete(function () {
                    
                })
                .start();
            new TWEEN.Tween( object.rotation )
                .to( { x: object.rotation.x + 0.5, y: object.rotation.y + 0.5, z: object.rotation.z }, duration )
                .easing( TWEEN.Easing.Exponential.InOut )
                .onComplete(function () {
                    object.rotation.set(new Vector3(object.rotation.x + 0.5, object.rotation.y + 0.5, object.rotation.z));
                })
                .start();
        }
    }

    new_CSS3DObject = ( element, vec ) => {
        const object = new CSS3DObject( element );
        object.position.x = vec.x;
        object.position.y = vec.y;
        object.position.z = vec.z;
        this.scene.add( object );
        this.objects.push( object );
        return object;
    }

    create_CSS3DObject = () => {

        for ( let i = 0; i < this.table.length; ++i ) {
            const element = document.createElement( 'div' );
            switch (i) {
                case 0 : {
                    element.className = 'btn-style css3d';
                    break;
                }
            }

            element.innerHTML = this.table[i];
            element.style.backgroundColor = 'smokewhite';
            this.new_CSS3DObject( element, new Vector3(
                i * (Math.random() * 5000), 
                i * (Math.random() * 5000), 
                i * (Math.random() * 3000)));
        }
    }

    skybox = () => {
        const self = this;
        const geometry = new THREE.CubeGeometry(9000,9000,9000);
        const cubeMaterials = [];
        const promises = [];

        skybox.map(url => {
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

    // Control

    getIntersects = ( x, y ) => {
        x = ( x / window.innerWidth ) * 2 - 1;
        y = - ( y / window.innerHeight ) * 2 + 1;
        this.mousevec.set( x, y, 0.5 );
        this.rayCast.setFromCamera( this.mousevec, this.camera );
        return this.rayCast.intersectObjects( this.objects, true );
    }

    moveCamera = (targetNum) => 
    {
        TWEEN.removeAll();
        
        const self = this;
        const target = this.objects[targetNum];

        // 카메라를 맞출 기준점
        const targetW = target.element.clientWidth;
        const targetH = target.element.clientHeight;
        const center = targetW + targetH / 2;

        const windowW = this.mount.clientWidth;
        const windowH = this.mount.clientHeight;
        const windowC = windowW + windowH / 2;

        //const rad_fov = this.camera.fov * ( Math.PI / 180 );  // * (PI / 180) = to radian (atan param)
        //const distance = Math.abs( windowC /* size */ / Math.sin( rad_fov / 2 ) );

        const newPos = new Vector3(target.position.x, target.position.y, target.position.z + (3500 - windowC));
        new TWEEN.Tween( self.camera.position )
        .to( { x: newPos.x, y: newPos.y, z: newPos.z }, 600)
        .easing( TWEEN.Easing.Exponential.InOut )
        .onComplete(function () {
            self.camera.position.set(newPos.x, newPos.y, newPos.z);
            self.setState({ curTarget : targetNum });
        })
        .start();
    }

    onClick_move = (bleft) => 
    {
        if ((bleft && this.state.curTarget === 0) || 
            (!bleft && this.state.curTarget === this.objects.length - 1)) {
            return;
        }

        const targetNum = (bleft) ? this.state.curTarget - 1 : this.state.curTarget + 1;
        this.moveCamera(targetNum);
    }

    onMouseMove = (event) => 
    {
        event.preventDefault();
        var intersects = this.getIntersects( event.layerX, event.layerY );
        if ( intersects.length > 0 ) {
            intersects.forEach(obj => {
            })
        }
    }

    resize = () => {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    render () {
        return (
            <div id="three-renderer" ref={(mount) => { this.mount = mount }} >
                <img src={arrowL} className="btn-hover" style={{ 
                    position : 'absolute', transform: 'translateY(-50%)', 
                    width : '100px', height : '100px',
                    top : '50%', left : '0%', 
                    margin : '20px', zIndex : '1' }} onClick={() => {this.onClick_move(true)}} />
                <img src={arrowR} className="btn-hover" style={{ 
                    position : 'absolute', transform: 'translateY(-50%)', 
                    width : '100px', height : '100px',
                    top : '50%', left : 'calc(100% - 140px)', 
                    margin : '20px', zIndex : '1' }} onClick={() => {this.onClick_move(false)}} />
            </div>
        );
    }

    componentDidMount () {
        window.addEventListener('resize', () => {setTimeout(this.resize, 100)});
        this.renderer.domElement.addEventListener('mousemove', this.onMouseMove, false);
        this.resize();
        this.init();
        this.moveCamera(0);
    }

    componentWillUnmount () {
        this.stop();
    }
}

export default ThreeComp;