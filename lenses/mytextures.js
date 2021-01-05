"use strict";
//plaque canvas
function makeplaquemat(){
const canvp = document.createElement('canvas');
const ctxp = canvp.getContext('2d');
canvp.width = 128;
canvp.height = 32;
ctxp.fillStyle = "#ffffff";
ctxp.fillRect(0, 0, canvp.width, canvp.height);
ctxp.font = '12px Arial';
ctxp.fillStyle = 'black';
ctxp.fillText('He-Ne Laser', 3, 12);
ctxp.fillText('with Beam Expander', 3, 28);
const plaquetexture = new THREE.CanvasTexture(canvp);
plaquetexture.needsUpdate = true;
const plaquematerial = new THREE.MeshBasicMaterial({ map: plaquetexture });
return plaquematerial;
}

//angle canvas
const canv = document.createElement('canvas');
const ctx = canv.getContext('2d');
canv.width = 32;
canv.height = 16;
ctx.font = '12px Arial';
ctx.fillStyle = 'white';
ctx.fillText('0', 1, 12);

basetexture = new THREE.CanvasTexture(canv);
    basetexture.needsUpdate = true;
    angle = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: basetexture }));
    angle.rotation.x = -Math.PI * 0.5;
    angle.position.y = 0.5;
    angle.position.z = 1;


//screen canvas
const canv1 = document.createElement('canvas');
const ctx1 = canv1.getContext('2d');
canv1.width = 128;
canv1.height = 64;

const screentexture = new THREE.CanvasTexture(canv1);
screentexture.needsUpdate = true;

const screenmaterial = [
    mat00,
    mat00,
    mat00,
    mat00,
    new THREE.MeshBasicMaterial({ map: screentexture }),
    mat00,
];

// holdercanvas

function makeHoldertexture(i) {
    const canv2 = document.createElement('canvas');
    const ctx2 = canv2.getContext('2d');
    canv2.width = 64;
    canv2.height = 32;
    ctx2.fillStyle = "#ffffff";
    ctx2.fillRect(0, 0, canv1.width, canv1.height);
    ctx2.fillStyle = "#000000";
    ctx2.font = '16px sans-serif';
    const lenstext = "Lens " + (i + 1);
    ctx2.fillText(lenstext, 10, 20);
    let holdertexture = new THREE.CanvasTexture(canv2);
    holdertexture.needsUpdate = true;
    const holdermaterial = new THREE.MeshBasicMaterial({ map: holdertexture });
    return holdermaterial;
}