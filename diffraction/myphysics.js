"use strict";
function laserhit() {
    //clear the screen
    ctx1.fillStyle = "#ffffff";
    ctx1.fillRect(0, 0, canv1.width, canv1.height);
    ctx1.fillStyle = "#000000";
    ctx1.beginPath();
    ctx1.strokeStyle = "black";
    for (let i = 16; i < 128; i += 16) {
        ctx1.moveTo(i, 0);
        ctx1.lineTo(i, 16);
    }
    ctx1.stroke();
    screentexture.needsUpdate = true;
    render();

    let intersects;
    // start the beam at the laser
    const raystart = new THREE.Vector3(-0.5, 4.6, 25);
    const raydirect = new THREE.Vector3(0, 0, -1);
    let raydirect1 = new THREE.Vector3(0, 0, -1);
    let canvradius = beamradius * 32;
    let screenhit = 0;
    let hit = false;
    //follow the beam
    do {
        hit = false;
        raycaster.set(raystart, raydirect);
        intersects = raycaster.intersectObjects(world.children, true);
        if (intersects.length != 0) {
            let item = intersects[0];
            let objectHit = item.object;

            if (objectHit == screen) {
                intersectscreen();
            }

            if (objectHit == slit[1]) {
                intersectslit1();
            }

            if (objectHit == slit[2]) {
                intersectslit2();
            }

            if (objectHit == slit[3]) {
                intersectslit3();
            }

            if (objectHit == slit[4]) {
                intersectslit4();
            }
        }
    }
    while (hit == true);


    function intersectscreen() {
        let coord = new THREE.Vector3();
        coord.copy(intersects[0].point);
        let d = intersects[0].distance + 0.01;
        screen.worldToLocal(coord);
        //the screen dimensions are 4 by 2, the screencanvas is 128 px by 64 px
        if (screenhit == 0) {
            let cx = 32 * coord.x + 64;
            ctx1.fillStyle = "#ff0000";
            ctx1.beginPath();
            ctx1.ellipse(cx, 32, canvradius, canvradius, 0, 0, 2 * Math.PI);
            ctx1.fill();
        } else if (screenhit == 1) {
            //single slit, width w = 20 micron, I ∝ sin^2(πw(sinθ)/λ)/(πw(sinθ)/λ)^2
            for (let i = 0; i < 128; i++) {
                ctx1.beginPath();
                let a = (i - 64) / 32 - coord.x;
                let b = 1;
                if (a != 0) {
                    b = 4.963 * 20 * a / Math.sqrt(a * a + d * d);  //πw(sinθ)/λ
                    b = Math.sin(b) / b;
                    b = b * b;
                    b = Math.pow(b, 1 / 3);  //approximating the response of the eye                    
                }  // b sets the opacity of the color
                let col = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
                ctx1.strokeStyle = col;
                ctx1.moveTo(i, 28);
                ctx1.lineTo(i, 36);
                ctx1.stroke();
            }
        } else if (screenhit == 2) {
            //double slit, spacing d = 60 micron, I ∝ cos^2(πd(sinθ)/λ) * sin^2(πw(sinθ)/λ)/(πw(sinθ)/λ)^2
            for (let i = 0; i < 128; i++) {
                ctx1.beginPath();
                let a = (i - 64) / 32 - coord.x;
                let b = 1;
                if (a != 0) {
                    b = 4.963 * 20 * a / Math.sqrt(a * a + d * d);  //πw(sinθ)/λ
                    let double = b * 3;  //πd(sinθ)/λ
                    b = Math.sin(b) / b;
                    double = Math.cos(double) * Math.cos(double);
                    b = b * b * double * double;
                    b = Math.pow(b, 1 / 3);  //approximating the response of the eye
                }
                let col = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
                ctx1.strokeStyle = col;
                ctx1.moveTo(i, 28);
                ctx1.lineTo(i, 36);
                ctx1.stroke();
            }
        } else if (screenhit == 3) {
            //hair width w = 50 micron, same as single slit but add bright spot in the center
            let cx = 32 * coord.x + 64;
            ctx1.fillStyle = "#ff0000";
            ctx1.beginPath();
            ctx1.ellipse(cx, 32, canvradius, canvradius, 0, 0, 2 * Math.PI);
            ctx1.fill();
            for (let i = 0; i < 128; i++) {
                ctx1.beginPath();
                let a = (i - 64) / 32 - coord.x;
                let b = 1;
                if (a != 0) {
                    b = 4.963 * 50 * a / Math.sqrt(a * a + d * d);  //πw(sinθ)/λ
                    b = Math.sin(b) / b;
                    b = b * b;
                    b = Math.pow(b, 1 / 3);
                }
                let col = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
                ctx1.strokeStyle = col;
                ctx1.moveTo(i, 28);
                ctx1.lineTo(i, 36);
                ctx1.stroke();
            }
        } else if (screenhit == 4) {
            //four slits, slit spacing d = 60 micron
            for (let i = 0; i < 128; i++) {
                ctx1.beginPath();
                let a = (i - 64) / 32 - coord.x;
                let b = 1;
                if (a != 0) {
                    b = 4.963 * 20 * a / Math.sqrt(a * a + d * d);
                    let quad = 2 * b * 3;  //2πd(sinθ)/λ
                    b = Math.sin(b) / b;
                    b = b * b;

                    let quad1 = 1 + Math.cos(quad) + Math.cos(2 * quad) + Math.cos(3 * quad);
                    let quad2 = Math.sin(quad) + Math.sin(2 * quad) + Math.sin(3 * quad);
                    quad = (quad1 * quad1 + quad2 * quad2) / 16;
                    b = b * quad;
                    b = Math.pow(b, 1 / 3);
                }
                let col = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
                ctx1.strokeStyle = col;
                ctx1.moveTo(i, 28);
                ctx1.lineTo(i, 36);
                ctx1.stroke();
            }
        }
        screentexture.needsUpdate = true;
        render();
    }

    //check if one of the slit slides intersects the beam
    function intersectslit1() {
        if (screenhit == 0) {
            raystart.copy(intersects[0].point);
            raystart.add(raydirect1.multiplyScalar(0.01));
            raycaster.set(raystart, raydirect);
            hit = true;
            screenhit = 1;
            render();
        }
    }
    function intersectslit2() {
        if (screenhit == 0) {
            raystart.copy(intersects[0].point);
            raystart.add(raydirect1.multiplyScalar(0.01));
            raycaster.set(raystart, raydirect);
            hit = true;
            screenhit = 2;
            render();
        }
    }
    function intersectslit3() {
        if (screenhit == 0) {
            raystart.copy(intersects[0].point);
            raystart.add(raydirect1.multiplyScalar(0.01));
            raycaster.set(raystart, raydirect);
            hit = true;
            screenhit = 3;
            render();
        }
    }

    function intersectslit4() {
        if (screenhit == 0) {
            raystart.copy(intersects[0].point);
            raystart.add(raydirect1.multiplyScalar(0.01));
            raycaster.set(raystart, raydirect);
            hit = true;
            screenhit = 4;
            render();
        }
    }
}