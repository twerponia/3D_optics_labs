"use strict";
//materials
const mat0 = new THREE.MeshBasicMaterial({ color: "black", side: THREE.DoubleSide });
const mat00 = new THREE.MeshBasicMaterial({ color: "black" });
const mat1 = new THREE.MeshBasicMaterial({ color: 0x25383c });  //postholder outside color
const mat2 = new THREE.MeshBasicMaterial({ color: 0x4863a0, side: THREE.DoubleSide });  //bluegray
const mat3 = new THREE.MeshBasicMaterial({ color: "red" });
const mat4 = new THREE.MeshBasicMaterial({ color: 0xbcc6cc });   // postcolor
const mat5 = new THREE.MeshBasicMaterial({ color: 0x736F6E });   //grey

//define global variables related to mouse action
let rotate = false;  //should the mouse rotate the view or drag the object?
let dragItem, dragItem0, dragItem1, dragItem2;  //the object to be dragged
let active;  //element selected by the mouse
let intersects;  //the objects intersected by raycaster
let dragging = false;  // is an object being dragged?
let deltax, deltaz, deltay;  //difference in the world coordinates of the object and the intersection point
let startX, startY, prevX, prevY;  //used for determining the rotation direction
const raycaster = new THREE.Raycaster();  //add the raycaster for picking objects with the mouse
const targetForDragging = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshBasicMaterial());
targetForDragging.rotation.x = -Math.PI * 0.5;
targetForDragging.material.visible = false;

//# of bases for elements
const elements = 5;
//arrays, so that an element can have the same index as its base
const base = new Array(elements);
const angle = new Array(elements);
const basetexture = new Array(elements);
const baseangle = new Array(elements);
const posthold = new Array(elements);
const slitholder = new Array(elements);
const slit = new Array(elements);
const slittexture = new Array(elements);
const canv2 = new Array(elements);
const ctx2 = new Array(elements);