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
ctx.fillText(zero.toFixed(1), 1, 12);

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

//polarizer canvas
const canvpol = document.createElement('canvas');
const ctxpol = canvpol.getContext('2d');
canvpol.width = 32;
canvpol.height = 16;
ctxpol.fillStyle = '#25383c';
ctxpol.fillRect(0, 0, 32, 16);
ctxpol.font = '12px Arial';
ctxpol.fillStyle = 'white';
ctxpol.fillText(zero.toFixed(1), 1, 12);

for (let i = 4; i < elements; i++) {
    poltexture[i] = new THREE.CanvasTexture(canvpol);
    poltexture[i].needsUpdate = true;
    polplaque[i] = new THREE.Mesh(new THREE.PlaneGeometry(1.4, 0.7), new THREE.MeshBasicMaterial({ map: poltexture[i] }));
    polplaque[i].position.z = 0.25;
    polplaque[i].position.y = -0.8;
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

//viewer canvas
const canv2 = document.createElement('canvas');
const ctx2 = canv2.getContext('2d');
canv2.width = 16;
canv2.height = 32;

const viewtexture = new THREE.CanvasTexture(canv2);
viewtexture.needsUpdate = true;
const viewmaterial = new THREE.MeshBasicMaterial({ map: viewtexture, side: THREE.DoubleSide, transparent: true, opacity: 0.5});

// glass slide canvas
const canvs = document.createElement('canvas');
const ctxs = canvs.getContext('2d');
canvs.width = 32;
canvs.height = 16

const canvstexture = new THREE.CanvasTexture(canvs);
canvstexture.needsUpdate = true;
const canvsmaterial = new THREE.MeshBasicMaterial({ map: canvstexture, side: THREE.DoubleSide});

