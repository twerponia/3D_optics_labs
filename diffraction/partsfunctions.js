"use strict";
function makeBoard() {
    const groundmesh = new THREE.Mesh(new THREE.PlaneGeometry(36, 36));
    const loader = new THREE.TextureLoader();
    loader.load('board.jpg', (texture) => {
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.magFilter = THREE.NearestFilter;
        texture.repeat.set(36, 36);
        groundmesh.material = new THREE.MeshBasicMaterial({ map: texture });
        render();
    });
    return groundmesh;
}

function makeLaser() {
    const singleGeometry = new THREE.Geometry();
    const geometry0 = new THREE.CylinderGeometry(0.87, 0.87, 7, 32);
    const laser0 = new THREE.Mesh(geometry0);
    laser0.position.z = 4.6;
    laser0.position.y = -1;

    const geometry1 = new THREE.BoxGeometry(2.8, 4.6, 4);
    const laser1 = new THREE.Mesh(geometry1);
    laser1.position.z = 2.3;

    laser0.updateMatrix();
    laser1.updateMatrix();

    singleGeometry.merge(laser1.geometry, laser1.matrix, 1);
    singleGeometry.merge(laser0.geometry, laser0.matrix, 2);

    const lasermaterial = [
        mat2,
        mat2,
        mat2,
        mat0,
        mat0,
        mat0,
    ];
    const lasermesh = new THREE.Mesh(singleGeometry, lasermaterial);
    const plaque1 = makePlaque();
    lasermesh.add(plaque1);
    lasermesh.rotation.x = -Math.PI * 0.5;
    return lasermesh;
}
function makeBeamextender() {
    const geometry = new THREE.CylinderGeometry(0.8, 0.8, 3, 32);
    const extender = new THREE.Mesh(geometry, mat1);
    extender.position.z = 4.6;
    extender.position.y = 4;
    return extender;
}

function makeBeamexit() {
    const geometry = new THREE.CircleGeometry(beamradius, 32);
    const mat3a = new THREE.MeshBasicMaterial({ color: 0x220000 });
    const bexit = new THREE.Mesh(geometry, mat3a);
    bexit.rotation.x = -Math.PI * 0.5;
    bexit.position.y = 1.505;
    return bexit;
}
function makePlaque() {
    const geometry = new THREE.PlaneGeometry(4, 1);
    const plaque = new THREE.Mesh(geometry, plaquematerial);
    plaque.rotation.y = -Math.PI * 0.5;
    plaque.rotation.x = Math.PI * 0.5;
    plaque.position.x = -1.51;
    plaque.position.z = 3;
    return plaque;
}

function makeBase(x, z) {
    const geometry = new THREE.BoxGeometry(4, 0.25, 4);
    const material = [
        mat00,
        mat00,
        mat1,
        mat00,
        mat00,
        mat00,
    ];
    const obj1 = new THREE.Mesh(geometry, material);
    obj1.position.y = 0.125;  //bottom of base is at ground
    obj1.position.x = x;
    obj1.position.z = z;
    return obj1;
}

function makePostholder() {

    const singleGeometry = new THREE.Geometry();
    const geometry0 = new THREE.CylinderGeometry(0.25, 0.25, 2.5, 16, 1, 1);
    const postholder0 = new THREE.Mesh(geometry0);  //inner cylinder
    postholder0.position.y = 1.65;  //bottom of postholdertube is 0.4 units above ground

    const geometry1 = new THREE.CylinderGeometry(0.5, 0.5, 2.5, 16, 1, 1);
    const postholder1 = new THREE.Mesh(geometry1);  //outer cylinder
    postholder1.position.y = 1.65;

    const geometry2 = new THREE.RingGeometry(0.25, 0.5, 16);
    const postholder2 = new THREE.Mesh(geometry2);
    postholder2.position.y = 2.9;  //top cap
    postholder2.rotation.x = -Math.PI * 0.5;

    const geometry3 = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16, 1);
    const postholder3 = new THREE.Mesh(geometry3);  //knob
    postholder3.position.y = 2.5;
    postholder3.position.z = 0.6;
    postholder3.rotation.x = -Math.PI * 0.5;

    const geometry4 = new THREE.CylinderGeometry(2, 2, 0.1, 16);
    const postholder4 = new THREE.Mesh(geometry4);  // bottom plate to hold angle scale
    postholder4.position.y = 0.3;


    postholder0.updateMatrix();
    postholder1.updateMatrix();
    postholder2.updateMatrix();
    postholder3.updateMatrix();
    postholder4.updateMatrix();
    singleGeometry.merge(postholder0.geometry, postholder0.matrix, 0);
    singleGeometry.merge(postholder1.geometry, postholder1.matrix, 1);
    singleGeometry.merge(postholder2.geometry, postholder2.matrix, 1);
    singleGeometry.merge(postholder3.geometry, postholder3.matrix, 3);
    singleGeometry.merge(postholder4.geometry, postholder4.matrix, 4);

    const postmaterial = [
        mat0,
        mat1,
        mat1,
        mat2,
        mat5,
        mat5,
    ];

    const holdermesh = new THREE.Mesh(singleGeometry, postmaterial);
    return holdermesh;
}

function makeScreenholder() {
    const singleGeometry = new THREE.Geometry();
    const geometry0 = new THREE.CylinderGeometry(0.24, 0.24, 3.2, 16, 1);
    const post0 = new THREE.Mesh(geometry0);  //this is the post
    post0.position.y = 1.6;  //the post is 3.2 units high and its bottom is at y = 0
    post0.updateMatrix();
    singleGeometry.merge(post0.geometry, post0.matrix);
    const holdermaterial = new THREE.MeshBasicMaterial({ color: 0xffffff });
    const postmesh = new THREE.Mesh(singleGeometry, holdermaterial);
    return postmesh;
}

function makeScreen() {
    const geometry1 = new THREE.BoxGeometry(4, 2, 0.2);
    const screenmesh = new THREE.Mesh(geometry1, screenmaterial);
    return screenmesh;
}

