import * as THREE from 'https://unpkg.com/three@0.126.1/build/three.module.js'
import {OrbitControls} from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js'
import {GLTFLoader} from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/GLTFLoader.js'
import {ColladaLoader} from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/ColladaLoader.js'
import {GUI} from 'https://unpkg.com/three@0.126.1/examples/jsm/libs/dat.gui.module'

//console.log(dat)

//Create constants
//let pylons, wayout, decision, wayfinding, regulatory, locations, groundPlane
//let compassMat
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 75, innerWidth / innerHeight, 0.01, 1000 )
const renderer = new THREE.WebGLRenderer()
const gltfLoader = new GLTFLoader

init()
animate()

function init() {

camera.position.z = 1.4
camera.position.y = 2
camera.position.x = -1
camera.lookAt( 3, 0, 0)

//Adding fog
var fogColor = new THREE.Color(0x999999);
scene.fog = new THREE.Fog(fogColor, 0.5, 12);

//Add grid helper
const grid = new THREE.GridHelper( 200, 400, 0xffffff, 0xffffff )
grid.material.opacity = 0.3
grid.material.transparent = true
scene.add( grid )

//Load GLTF model
gltfLoader.load('*********************************************', function (terrainScene) {
    
    //Adjust GLFT transforms
    terrainScene.scene.position.y = -0.1
    scene.add( terrainScene.scene )
},
    // called while loading is progressing
	function ( xhr ) {

		console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

	},
	// called when loading has errors
	function ( error ) {

		console.log( 'An error happened' );

	
}) 

//Create scene lights
const ambient = new THREE.AmbientLight(0x303030, 10.0)
const hemiLight = new THREE.HemisphereLight( 0xe5fbfc, 0x080820, 2 )
scene.add(hemiLight, ambient)

//Create OrbitController
const controls = new OrbitControls(camera, renderer.domElement)
controls.minDistance = 0.1
controls.maxDistance = 7
controls.enablePan = true
controls.maxPolarAngle = Math.PI/2 - 0.2

//Window resize
window.addEventListener( 'resize', onWindowResize )

//Set renderer options
renderer.setSize(innerWidth, innerHeight)
renderer.setPixelRatio(devicePixelRatio)
document.body.appendChild(renderer.domElement)

//Resize window
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix();

    renderer.setSize( window.innerWidth, window.innerHeight )
}
}

//Animate
function animate() {
    requestAnimationFrame(animate)
    //box.rotation.x += 0.01
    render()
}

//Render
function render() {
    renderer.render(scene, camera)
}
