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

function makePostholder(height) {
    const singleGeometry = new THREE.Geometry();
    const geometry0 = new THREE.CylinderGeometry(0.25, 0.25, height, 16, 1, 1);
    const postholder0 = new THREE.Mesh(geometry0);  //inner cylinder
    postholder0.position.y = 0.4 + height / 2;  //bottom of postholdertube is 0.4 units above ground

    const geometry1 = new THREE.CylinderGeometry(0.5, 0.5, height, 16, 1, 1);
    const postholder1 = new THREE.Mesh(geometry1);  //outer cylinder
    postholder1.position.y = 0.4 + height / 2;

    const geometry2 = new THREE.RingGeometry(0.25, 0.5, 16);
    const postholder2 = new THREE.Mesh(geometry2);
    postholder2.position.y = height + 0.4;  //top cap
    postholder2.rotation.x = -Math.PI * 0.5;

    const geometry3 = new THREE.CylinderGeometry(0.25, 0.25, 0.2, 16, 1);
    const postholder3 = new THREE.Mesh(geometry3);  //knob
    postholder3.position.y = height;
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

function makeMeterholder() {
    const singleGeometry = new THREE.Geometry();
    const geometry0 = new THREE.CylinderGeometry(0.24, 0.24, 3.2, 16, 1);
    const meterholder0 = new THREE.Mesh(geometry0);  //this is the post
    meterholder0.position.y = 1.6;  //the post is 3.2 units high and its bottom is at y = 0

    const geometry1 = new THREE.CylinderGeometry(0.75, 0.75, 1, 16);
    const meterholder1 = new THREE.Mesh(geometry1);
    meterholder1.position.y = 3.9;
    meterholder1.rotation.x = -Math.PI * 0.5;

    meterholder0.updateMatrix();
    meterholder1.updateMatrix();
    singleGeometry.merge(meterholder0.geometry, meterholder0.matrix);
    singleGeometry.merge(meterholder1.geometry, meterholder1.matrix);

    const loader = new THREE.TextureLoader();
    const mat6 = new THREE.MeshBasicMaterial({ map: loader.load('bluetooth.jpg'), });

    //const holdermaterial = new THREE.MeshBasicMaterial({ color: 0x657383 });
    const holdermaterial = [
        mat00,
        mat6,
        mat1,
    ];

    const mholdermesh = new THREE.Mesh(singleGeometry, holdermaterial);
    return mholdermesh;
}

function makeMeter() {
    const geometry = new THREE.CylinderGeometry(0.25, 0.4, 0.4, 16, 1);
    const metermesh = new THREE.Mesh(geometry);
    metermesh.rotation.x = -Math.PI * 0.5;
    metermesh.position.z = 0.385;
    return metermesh;
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


function makeViewerpostholder() {
    const singleGeometry = new THREE.Geometry();
    const geometry1 = new THREE.CylinderGeometry(0.5, 0.5, 1, 16);
    const postholder1 = new THREE.Mesh(geometry1);
    postholder1.position.y = 0.9;  //bottom of postholder tube is 0.4 units above ground
    //the top is 1.4 units above ground

    const geometry4 = new THREE.CylinderGeometry(2, 2, 0.1, 16);
    const postholder4 = new THREE.Mesh(geometry4);
    postholder4.position.y = 0.3;

    postholder1.updateMatrix();
    postholder4.updateMatrix();

    singleGeometry.merge(postholder1.geometry, postholder1.matrix, 0);
    singleGeometry.merge(postholder4.geometry, postholder4.matrix, 1);

    const postmaterial = [
        mat1,
        mat5,
        mat5,
    ];
    const holdermesh = new THREE.Mesh(singleGeometry, postmaterial);
    return holdermesh;
}

function makeViewerpost() {
    const singleGeometry = new THREE.Geometry();
    const geometry0 = new THREE.CylinderGeometry(0.24, 0.24, 0.4, 16);
    const post0 = new THREE.Mesh(geometry0);
    post0.position.y = 1.2;  //the viewerpost is essentially invisible
    //the top is 1.4 units above ground
    post0.updateMatrix();
    singleGeometry.merge(post0.geometry, post0.matrix);
    const postmesh = new THREE.Mesh(singleGeometry, mat1);
    return postmesh;
}

function makeViewer() {
    const geometry1 = new THREE.PlaneGeometry(3, 6);
    const viewer1 = new THREE.Mesh(geometry1, viewmaterial);
    viewer1.position.y = 4.4;
    return viewer1;
}

function makePolarizerpost() {
    const singleGeometry = new THREE.Geometry();
    const geometry0 = new THREE.CylinderGeometry(0.24, 0.24, 2.8, 16);
    const post0 = new THREE.Mesh(geometry0);
    post0.position.y = 1.4;
    //the top is 2.2 units above ground
    post0.updateMatrix();
    singleGeometry.merge(post0.geometry, post0.matrix);
    const postmesh = new THREE.Mesh(singleGeometry, mat00);
    return postmesh;
}


function makePolarizer() {
    const singleGeometry = new THREE.Geometry();
    const geometry0 = new THREE.CylinderGeometry(0.5, 0.5, 0.25, 16, 1, 1);
    const pol0 = new THREE.Mesh(geometry0);  //inner cylinder
    pol0.rotation.x = -Math.PI * 0.5;

    const geometry1 = new THREE.CylinderGeometry(1.4, 1.4, 0.25, 16, 1, 1);
    const pol1 = new THREE.Mesh(geometry1);  //outer cylinder
    pol1.rotation.x = -Math.PI * 0.5;

    const geometry2 = new THREE.RingGeometry(0.5, 1.4, 16);  //top cap
    const pol2 = new THREE.Mesh(geometry2);
    pol2.position.z = 0.125
    

    const geometry3 = new THREE.RingGeometry(0.5, 1.4, 16);  //bottom cap
    const pol3 = new THREE.Mesh(geometry3);
    pol3.position.z = -0.125
 
    const geometry4 = new THREE.CircleGeometry(0.5, 16);  //polarizer
    const pol4 = new THREE.Mesh(geometry4);
  
    pol0.updateMatrix();
    pol1.updateMatrix();
    pol2.updateMatrix();
    pol3.updateMatrix();
    pol4.updateMatrix();

    singleGeometry.merge(pol4.geometry, pol4.matrix, 0);
    singleGeometry.merge(pol0.geometry, pol0.matrix, 1);
    singleGeometry.merge(pol1.geometry, pol1.matrix, 2);
    singleGeometry.merge(pol2.geometry, pol2.matrix, 3);
    singleGeometry.merge(pol3.geometry, pol3.matrix, 3);

    const mat8 = new THREE.MeshBasicMaterial({ color: "black", side: THREE.DoubleSide, transparent: true, opacity: 0.5 });
    const mat7 = new THREE.MeshBasicMaterial({ color: 0x25383c,  side: THREE.DoubleSide }); 
        const polmaterial = [
        mat8,
        mat1,
        mat1,
        mat7,
    ];
    const pmesh = new THREE.Mesh(singleGeometry, polmaterial);
    return pmesh;
}

function makeglass() {
    const geometry = new THREE.BoxGeometry(2.8, 1.4, 0.1);
    const material = [
        mat0,
        mat0,
        mat0,
        mat0,
        canvsmaterial,
        mat0,
    ];
    const block = new THREE.Mesh(geometry, material);
    return block;
}