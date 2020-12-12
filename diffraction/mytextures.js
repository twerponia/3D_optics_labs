"use strict";
//plaque canvas
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

//angle canvas
const canv = document.createElement('canvas');
const ctx = canv.getContext('2d');
canv.width = 32;
canv.height = 16;
ctx.font = '12px Arial';
ctx.fillStyle = 'white';
ctx.fillText('0', 1, 12);

for (let i = 0; i < elements; i++) {
    basetexture[i] = new THREE.CanvasTexture(canv);
    basetexture[i].needsUpdate = true;
}

for (let i = 0; i < elements; i++) {
    angle[i] = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.8), new THREE.MeshBasicMaterial({ map: basetexture[i] }));
    angle[i].rotation.x = -Math.PI * 0.5;
    angle[i].position.y = 0.5;
    angle[i].position.z = 1;
}

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

//slit canvas
for (let i = 1; i < elements; i++) {
    canv2[i] = document.createElement('canvas');
    ctx2[i] = canv2[i].getContext('2d');
    canv2[i].width = 32;
    canv2[i].height = 32;
    ctx2[i].fillStyle = 'white';
    ctx2[i].font = '12px Arial';
    ctx2[i].fillStyle = 'white';
    ctx2[i].fillText(i.toFixed(0), 1, 12);
}
ctx2[1].fillStyle = '#736F6E';
ctx2[1].fillRect(15, 4, 2, 24);
ctx2[2].fillStyle = '#736F6E';
ctx2[2].fillRect(13, 4, 2, 24);
ctx2[2].fillRect(17, 4, 2, 24);
ctx2[4].fillStyle = '#736F6E';
ctx2[4].fillRect(13, 4, 2, 24);
ctx2[4].fillRect(17, 4, 2, 24);
ctx2[4].fillRect(9, 4, 2, 24);
ctx2[4].fillRect(21, 4, 2, 24);
ctx2[3].fillStyle = 'white';
ctx2[3].fillRect(10, 10, 12, 12);
ctx2[3].fillStyle = '#835C3B';
ctx2[3].fillRect(15, 10, 2, 12);

for (let i = 1; i < elements; i++) {
    slittexture[i] = new THREE.CanvasTexture(canv2[i]);
    slittexture[i].needsUpdate = true;
}