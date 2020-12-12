"use strict";
function laserhit() {
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
    ctxf.fillStyle = "#c9dbdc";  //glass block front canvas
    ctxf.fillRect(0, 0, canvf.width, canvf.height);
    ctxm.fillStyle = "#c9dbdc";  //mirror canvas
    ctxm.fillRect(0, 0, canvm.width, canvm.height);
    for (let i = 2; i < 4; i++) {
        mirrortexture[i].needsUpdate = true;
    }
    screentexture.needsUpdate = true;
    viewtexture.needsUpdate = true;
    canvftexture.needsUpdate = true;
    canvbtexture.needsUpdate = true;
    render();

    let intersects;
    // start the beam at the laser
    let lpower = 1.5;
    const raystart = new THREE.Vector3(-0.5, 4.6, 25);
    const raydirect = new THREE.Vector3(0, 0, -1);
    let raydirect1 = new THREE.Vector3(0, 0, -1);
    let canvradius = beamradius * 16;

    let hit = false;
    //follow the beam
    do {
        hit = false;
        raycaster.set(raystart, raydirect);
        intersects = raycaster.intersectObjects(world.children, true);
        if (intersects.length != 0) {
            let item = intersects[0];
            let objectHit = item.object;

            if (objectHit == viewer) {  //if the beam hits the viewer restart it from there
                intersectviewer();
            }
            if (objectHit == screen) {  //if the beam hits the screen it terminates
                intersectscreen();
            }

            if (objectHit == mirror[2]) {  //if the beam hits a mirror restart it from there
                intersectmirror(2);
            }

            if (objectHit == mirror[3]) {
                intersectmirror(3);
            }

            if (objectHit == glassblock) {  //if the beam hits the glass block, it may restart fom the othere side 
                intersectglassblock();
            }

        }
    }
    while (hit == true);


    function intersectscreen() {
        //first check if the laser beam hits the front of the screen
        const s = Math.sin(baseangle[1]);
        const c = Math.cos(baseangle[1]);
        const screendirect = new THREE.Vector3(-s, 0, -c);
        let dot = screendirect.dot(raydirect);

        if (dot > 0) {
            const cross = screendirect.cross(raydirect);
            cross.normalize();
            const crossy = cross.y
            const crossangle = Math.acos(crossy);  //acos yiels an anle between 0 and pi
            let coord = new THREE.Vector3();
            coord.copy(intersects[0].point);  //world coordinates of center of beam on the screen
            screen.worldToLocal(coord);       //world coordinates of center of beem on the screen
            //the screen dimensions are 4 by 2, the screencanvas is 128 px by 64 px
            let cx = 32 * coord.x + 64;       //sreencanvas coordinates of center of beam
            let cy = -32 * coord.y + 32;
            ctx1.fillStyle = "#ff0000";
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
        const s = Math.sin(baseangle[0]);
        const c = Math.cos(baseangle[0]);
        const screendirect = new THREE.Vector3(-s, 0, -c);
        let dot = screendirect.dot(raydirect);
        const cross = screendirect.cross(raydirect);
        cross.normalize();
        const crossy = cross.y
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
        ctx2.fillStyle = "#ff0000";
        ctx2.beginPath();
        dot = Math.max(dot, 0.001);  //the beam spot on the viewercanvas will be an ellipse
        //scale the major axis by 1/dot, rotate it with respect to the x-axis by -crossangle
        ctx2.ellipse(cx, cy, canvradius / 4 / dot, canvradius / 4, -crossangle, 0, 2 * Math.PI);
        ctx2.fill();
        viewtexture.needsUpdate = true;
        render();
        raystart.copy(intersects[0].point);
        raydirect1.copy(raydirect);
        raystart.add(raydirect1.multiplyScalar(0.01));
        //start a new ray at the viewer exit
        hit = true;
    }

    function intersectmirror(i) {
        let screendirect1 = new THREE.Vector3(0, 0, -1);
        const tilt = -mirror[i].rotation.x - Math.PI / 2;
        const st = Math.sin(tilt);
        const ct = Math.cos(tilt);
        const s = ct * Math.sin(baseangle[i]);
        const c = ct * Math.cos(baseangle[i]);
        const screendirect = new THREE.Vector3(-s, -st, -c);
        screendirect.normalize();  //the normal to the mirror, into the mirror
        let dot = screendirect.dot(raydirect);
        if (dot > 0) {

            dot = Math.max(dot, 0.001);
            raystart.copy(intersects[0].point);
            raydirect.add(screendirect.multiplyScalar(-2 * dot));  //find the direction of the reflected beam
            raydirect.normalize();
            raydirect1.copy(raydirect);
            raystart.add(raydirect1.multiplyScalar(0.01)); //start the reflected beam
            hit = true;

            dot = Math.max(dot, 0.001);
            screendirect1.copy(screendirect);
            const cross = screendirect1.cross(raydirect);
            cross.normalize();
            const crossy = cross.y;
            const crossangle = Math.acos(crossy);  //acos yiels an anle between 0 and pi
            let coord = new THREE.Vector3();
            coord.copy(intersects[0].point);
            mirror[i].worldToLocal(coord);
            let cx = 16 * coord.z + 8;  //mirror is rotated; should probably change mirror to single geometry
            let cy = 16 * coord.x + 8;
            let b = lpower / 100;
            b = Math.pow(b, 1 / 3);
            ctxm.fillStyle = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
            ctxm.beginPath();

            //scale the major axis by 1/dot, rotate it with respect to the x-axis by -crossangle
            ctxm.ellipse(cx, cy, canvradius, canvradius / dot, -crossangle, 0, 2 * Math.PI);
            ctxm.fill();
            mirrortexture[i].needsUpdate = true;
            render();

        }

    }

    function intersectglassblock() {
        //the block dimensions are 2.6 by 1.4, the block canvas is 32 px by 16 px     
        let coord = new THREE.Vector3();
        coord.copy(intersects[0].point);
        glassblock.worldToLocal(coord);

        if (Math.abs(coord.x) < 1.3995) { //check if the ray does not hit the edges
            if (Math.abs(coord.y) < 0.6995) {
                let scale = 16 / 1.4;
                let lray = new THREE.Vector3();
                const screendirect = new THREE.Vector3(0, 0, -1);
                //the block coordinate system is rotated ccw by baseangle abouyt the y-axis
                const s = Math.sin(baseangle[4]);
                const c = Math.cos(baseangle[4]);
                lray.z = raydirect.z * c + raydirect.x * s;
                lray.x = -raydirect.z * s + raydirect.x * c;
                lray.y = raydirect.y;
                lray.normalize();  //the direction of the incident beam in the block coordinate system
                let dot = screendirect.dot(lray);

                if (dot > 0) {
                    //the front dot
                    let cx = scale * coord.x + 16;
                    let cy = -scale * coord.y + 8;
                    let b = lpower / 100;
                    b = Math.pow(b, 1 / 3);
                    ctxf.fillStyle = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
                    ctxf.beginPath();

                    //scale the major axis by 1/dot
                    ctxf.ellipse(cx, cy, canvradius / dot / 1.4, canvradius / 1.4, 0, 0, 2 * Math.PI);
                    ctxf.fill();
                    canvftexture.needsUpdate = true;

                    //the back dot
                    let rcoord = new THREE.Vector3();
                    let dx = - lray.x * 2.8 / lray.z;  //the minus sign is there because lray.z is negative
                    let dy = - lray.y * 2.8 / lray.z;
                    let mult = 0;
                    let tantheta = Math.sqrt(Math.pow(lray.x, 2) + Math.pow(lray.y, 2)) / lray.z;  //the minus sign does not matter in the ratio below

                    if (tantheta != 0) {               //Snell's law
                        let theta = Math.atan(tantheta);
                        let thetar = Math.asin(Math.sin(theta) / 1.6);
                        mult = Math.tan(thetar) / tantheta;
                    }
                    rcoord.x = coord.x + mult * dx;   //these are the coordinates of the beam at the exit
                    rcoord.y = coord.y + mult * dy;
                    rcoord.z = -1.4;
                    hit = false;

                    if (Math.abs(rcoord.x) < 1.3995) {
                        if (Math.abs(rcoord.y) < 0.6995) {
                            glassblock.localToWorld(rcoord);
                            raystart.copy(rcoord);
                            raydirect1.copy(raydirect);
                            raystart.add(raydirect1.multiplyScalar(0.01));
                            hit = true;
                        }
                    }
                }

                if (dot < 0) {  //repeat with entrance and exit sides switched
                    //the back dot
                    let cx = -scale * coord.x + 16;
                    let cy = -scale * coord.y + 8;
                    let b = lpower / 100;
                    b = Math.pow(b, 1 / 3);
                    ctxf.fillStyle = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
                    ctxf.beginPath();

                    //scale the major axis by 1/dot
                    ctxf.ellipse(cx, cy, canvradius / -1 * dot / 1.4, canvradius / 1.4, 0, 0, 2 * Math.PI);
                    ctxf.fill();
                    canvbtexture.needsUpdate = true;

                    //the front dot
                    let rcoord = new THREE.Vector3();
                    let dx = lray.x * 2.8 / lray.z;
                    let dy = lray.y * 2.8 / lray.z;
                    let mult = 0;
                    let tantheta = Math.sqrt(Math.pow(lray.x, 2) + Math.pow(lray.y, 2)) / lray.z;

                    if (tantheta != 0) {
                        let theta = Math.atan(tantheta);
                        let thetar = Math.asin(Math.sin(theta) / 1.6);
                        mult = Math.tan(thetar) / tantheta;
                    }
                    rcoord.x = coord.x + mult * dx;
                    rcoord.y = coord.y + mult * dy;
                    rcoord.z = 1.4;
                    hit = false;

                    if (Math.abs(rcoord.x) < 1.3995) {
                        if (Math.abs(rcoord.y) < 0.6995) {
                            glassblock.localToWorld(rcoord);
                            raystart.copy(rcoord);
                            raydirect1.copy(raydirect);
                            raystart.add(raydirect1.multiplyScalar(0.01));
                            hit = true;
                        }
                    }
                }
            }
        }

    }
}