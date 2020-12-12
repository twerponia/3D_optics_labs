
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

//mirror canvas
const canvm = document.createElement('canvas');
const ctxm = canvm.getContext('2d');
canvm.width = 16;
canvm.height = 16;
for (let i = 2; i < 4; i++) {
    mirrortexture[i] = new THREE.CanvasTexture(canvm);
    mirrortexture[i].needsUpdate = true;
    mirrormaterial[i] = [
        mat0,
        mat00,
        new THREE.MeshBasicMaterial({ map: mirrortexture[i] }),
    ];
}

//viewer canvas
const canv2 = document.createElement('canvas');
const ctx2 = canv2.getContext('2d');
canv2.width = 16;
canv2.height = 32;
const viewtexture = new THREE.CanvasTexture(canv2);
viewtexture.needsUpdate = true;
const viewmaterial = new THREE.MeshBasicMaterial({ map: viewtexture, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });

// glass block canvas
const canvf = document.createElement('canvas');
const ctxf = canvf.getContext('2d');
canvf.width = 32;
canvf.height = 16

const canvftexture = new THREE.CanvasTexture(canvf);
canvftexture.needsUpdate = true;
const canvfmaterial = new THREE.MeshBasicMaterial({ map: canvftexture, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });

const canvbtexture = new THREE.CanvasTexture(canvf);
canvbtexture.needsUpdate = true;
const canvbmaterial = new THREE.MeshBasicMaterial({ map: canvbtexture, side: THREE.DoubleSide, transparent: true, opacity: 0.5 });