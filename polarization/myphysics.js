"use strict";
function laserhit() {
    lpow.value = zero.toFixed(3);
    //clear all screens
    ctx1.fillStyle = "#ffffff";  //screen canvas
    ctx1.fillRect(0, 0, canv1.width, canv1.height);
    ctx1.fillStyle = "#000000";
    ctx1.beginPath();
    for (let i = 16; i < 128; i += 16) {
        ctx1.moveTo(i, 0);
        ctx1.lineTo(i, 16);
    }
    ctx1.stroke();

    ctx2.fillStyle = "#c9dbdc";  //viewer canvas
    ctx2.fillRect(0, 0, canv2.width, canv2.height);
    ctxs.fillStyle = "#9ca9a1";  //glass block front canvas
    ctxs.fillRect(0, 0, canvs.width, canvs.height);
    screentexture.needsUpdate = true;
    viewtexture.needsUpdate = true;
    canvstexture.needsUpdate = true;
    render();

    let intersects;
    // start the beam at the laser
    let lpower = 1.5;
    const raystart = new THREE.Vector3(-0.5, 4.6, 25);
    const raydirect = new THREE.Vector3(0, 0, -1);
    const raydirect1 = new THREE.Vector3(0, 0, -1);
    let canvradius = beamradius * 16;

    let hit = false;
    let beampol = undefined;  //define beam polarization
    let Ih = 0.5;
    let Iv = 0.5;
    let polaxis = 0;
    //follow the beam


    do {
        hit = false;
        raycaster.set(raystart, raydirect);
        intersects = raycaster.intersectObjects(world.children, true);
        if (intersects.length != 0) {
            let item = intersects[0];
            let objectHit = item.object;

            if (objectHit == viewer) {  //if the beam hits the viewer, it restarts from the other side
                intersectviewer();
            }
            if (objectHit == screen) {  //if the beam hits the screen it terminates
                intersectscreen();
            }
            if (objectHit == glassslide) {  //if the beam hits the glass block, it may restart fom the othere side 
                intersectglassslide();
            }
            if (objectHit == meter) {  //if the beam hits the meter it terminates
                intersectmeter();
            }
            for (let i = 4; i < elements; i++) {
                if (objectHit == polarizer[i]) {  //if the polarizer, it may restart fom the othere side  
                    intersectpolarizer(i);
                }
            }

        }
    }
    while (hit == true);


    function intersectscreen() {
        //first check if the laser beam hits the front of the screen
        const s = Math.sin(baseangle[2]);
        const c = Math.cos(baseangle[2]);
        const screendirect = new THREE.Vector3(-s, 0, -c);
        let dot = screendirect.dot(raydirect);

        if (dot > 0) {
            const cross = screendirect.cross(raydirect);
            cross.normalize();
            const crossy = cross.y;
            const crossangle = Math.acos(crossy);  //acos yiels an anle between 0 and pi
            let coord = new THREE.Vector3();
            coord.copy(intersects[0].point);  //world coordinates of center of beam on the screen
            screen.worldToLocal(coord);       //world coordinates of center of beem on the screen
            //the screen dimensions are 4 by 2, the screencanvas is 128 px by 64 px
            let cx = 32 * coord.x + 64;       //sreencanvas coordinates of center of beam
            let cy = -32 * coord.y + 32;
            let b = lpower / 1.5;
            b = Math.pow(b, 1 / 3);
            ctx1.fillStyle = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
            ctx1.beginPath();
            dot = Math.max(dot, 0.001);       //the beam spot on the screencanvas will be an ellipse
            //scale the major axis by 1/dot, rotate it with respect to the x-axis by -crossangle
            ctx1.ellipse(cx, cy, 2 * canvradius / dot, 2 * canvradius, -crossangle, 0, 2 * Math.PI);
            ctx1.fill();
            screentexture.needsUpdate = true;
            render()
        }
    }

    function intersectviewer() {
        const s = Math.sin(baseangle[3]);
        const c = Math.cos(baseangle[3]);
        const screendirect = new THREE.Vector3(-s, 0, -c);
        screendirect.normalize();
        let dot = screendirect.dot(raydirect);
        const cross = screendirect.cross(raydirect);
        cross.normalize();
        const crossy = cross.y;
        const crossangle = Math.acos(crossy);
        if (dot < 0) {  //the beam can pass through the viewer from both sides
            screendirect.set(s, 0, c);
            dot = screendirect.dot(raydirect);
        }
        let coord = new THREE.Vector3();
        coord.copy(intersects[0].point);
        viewer.worldToLocal(coord);
        //the viewer dimensions are 3 by 6, the viewercanvas is 16 px by 32 px
        let cx = 8 * coord.x / 1.5 + 8;    //viewercanvas coordinates of center of beam
        let cy = -16 * coord.y / 3 + 16;
        let b = lpower / 1.5;
        b = Math.pow(b, 1 / 3);
        ctx2.fillStyle = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
        ctx2.beginPath();
        dot = Math.max(dot, 0.001);  //the beam spot on the viewercanvas will be an ellipse
        //scale the major axis by 1/dot, rotate it with respect to the x-axis by -crossangle
        ctx2.ellipse(cx, cy, canvradius / 4 / dot, canvradius / 4, -crossangle, 0, 2 * Math.PI);
        ctx2.fill();
        viewtexture.needsUpdate = true;
        render();
        lpower = lpower * 0.95;
        raystart.copy(intersects[0].point);
        raydirect1.copy(raydirect);
        raystart.add(raydirect1.multiplyScalar(0.01));
        //start a new ray at the viewer exit
        hit = true;
    }

    function intersectmeter() {
        const s = Math.sin(baseangle[1]);
        const c = Math.cos(baseangle[1]);
        const screendirect = new THREE.Vector3(-s, 0, -c);
        screendirect.normalize();  //the normal to the meter, into the mirror
        const dot = screendirect.dot(raydirect);
        if (dot > 0.7) {
            let coord = new THREE.Vector3();
            coord.copy(intersects[0].point);
            meter.worldToLocal(coord);
            if (coord.x * coord.x + coord.y * coord.y < 0.16) {  //0.4 radius detector area
                lpow.value = lpower.toFixed(3);
            }
        }
    }

    function intersectpolarizer(i) {
        const s = Math.sin(baseangle[i]);
        const c = Math.cos(baseangle[i]);
        const screendirect = new THREE.Vector3(-s, 0, -c);
        screendirect.normalize();  //the normal to the polarizer, into the polarizer
        let dot = screendirect.dot(raydirect);
        let back = false;
        if (dot < 0) {  //the beam can pass through the polarizer from both sides
            screendirect.set(s, 0, c);
            dot = screendirect.dot(raydirect);
            back = true;
        }

        if (dot > 0.7) {
            let coord = new THREE.Vector3();
            coord.copy(intersects[0].point);
            polarizer[i].worldToLocal(coord);
            if (coord.x * coord.x + coord.y * coord.y < 0.2) {
                if (back == false) {
                    polaxis = polangle[i] % Math.PI;
                } else {
                    polaxis = (Math.PI - polangle[i]) % Math.PI;
                }
                const polaxis_x = Math.cos(polaxis);
                const polaxis_y = Math.sin(polaxis);


                if (beampol == undefined) {
                    lpower = lpower * (Math.pow(polaxis_x, 2) * Ih + Math.pow(polaxis_y, 2) * Iv) / (Ih + Iv);
                } else {
                    let redux = Math.cos(beampol - polaxis);
                    redux = redux * redux;
                    lpower = lpower * redux;
                }

                if (lpower < 0.0005) {
                    hit = false;
                }
                else {
                    beampol = polaxis;
                    hit = true;
                    raystart.copy(intersects[0].point);
                    raydirect1.copy(raydirect);
                    raystart.add(raydirect1);
                    //start a new ray at the polarizer exit
                }
            }
        }
    }


    function intersectglassslide() {
        let screendirect1 = new THREE.Vector3(0, 0, -1);
        let ng = 1.65;
        let scale = 16 / 1.4;
        const s = Math.sin(baseangle[0]);
        const c = Math.cos(baseangle[0]);
        const screendirect = new THREE.Vector3(-s, 0, -c);
        screendirect.normalize();  //the normal to the mirror, into the mirror
        let dot = screendirect.dot(raydirect);
        if (dot > 0.174) {   //~80 deg
            dot = Math.max(dot, 0.001);

            const sint = Math.sqrt(1 - dot * dot) / ng;
            const tdot = Math.sqrt(1 - sint * sint);
            const vmult = (dot - ng * tdot) / (dot + ng * tdot);
            const hmult = (ng * dot - tdot) / (ng * dot + tdot);

            if (beampol == undefined) {
                Ih = Ih * hmult * hmult;
                Iv = Iv * vmult * vmult;
                lpower = lpower * (Ih + Iv);
            } else {
                const Eh = Math.cos(beampol) * hmult;
                const Ev = Math.sin(beampol) * vmult;
                lpower = lpower * (Eh * Eh + Ev * Ev);
                beampol = (Math.atan(Ev / Eh) + Math.PI) % Math.PI;
            }
            screendirect1.copy(screendirect);
            const cross = screendirect1.cross(raydirect);
            cross.normalize();
            const crossy = cross.y;
            const crossangle = Math.acos(crossy);  //acos yiels an anle between 0 and pi
            let coord = new THREE.Vector3();
            coord.copy(intersects[0].point);
            glassslide.worldToLocal(coord);
            let cx = scale * coord.x + 16;
            let cy = -scale * coord.y + 8;
            let b = lpower / 100;
            b = Math.pow(b, 1 / 3);
            ctxs.fillStyle = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
            ctxs.beginPath();

            //scale the major axis by 1/dot, rotate it with respect to the x-axis by -crossangle
            ctxs.ellipse(cx, cy, canvradius / dot / 1.4, canvradius / 1.4, -crossangle, 0, 2 * Math.PI);
            ctxs.fill();
            canvstexture.needsUpdate = true;
            render();

            raystart.copy(intersects[0].point);
            raydirect.add(screendirect.multiplyScalar(-2 * dot));  //find the direction of the reflected beam
            raydirect.normalize();
            raydirect1.copy(raydirect);
            raystart.add(raydirect1.multiplyScalar(0.01)); //start the reflected beam
            hit = true;
        }
    }
}

