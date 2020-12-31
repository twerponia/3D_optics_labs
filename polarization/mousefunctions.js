"use strict";
//respond to wheel movement
function doWheel(evt) {
    //zoom in or out
    cr = cr + evt.deltaY / 10;
    cr = Math.min(100, Math.max(30, cr));
    camera.position.z = cr * Math.sin(cth) * Math.cos(cph);
    camera.position.y = cr * Math.cos(cth);
    camera.position.x = cr * Math.sin(cth) * Math.sin(cph);
    camera.lookAt(0, 0, 0);
    camera.updateProjectionMatrix();
    render();
}

//respond to mousedowm
function doMouseDown(evt) {
    if (dragging) {
        return;
    }
    let x = evt.clientX
    let y = evt.clientY
    prevX = startX = x;
    prevY = startY = y;
    //check if the mouse pointer is over an object that can be dragged
    dragging = mouseDownFunc(x, y, evt);  //true if mousepointer is over a visible object, including the ground
    if (dragging) {
        canvas.addEventListener("pointermove", doMouseMove);
        canvas.addEventListener("pointerup", doMouseUp);
    }
}

//decide if the mouse is over an object that can be dragged
function mouseDownFunc(x, y) {
    if (targetForDragging.parent == world) {
        world.remove(targetForDragging);  //the initial object should be a visible object
    }
    //cast a ray from the camera to the mouse pointer and find out if it intersects any child of the world
    let a = 2 * x / canvas.width - 1;
    let b = 1 - 2 * y / canvas.height;
    raycaster.setFromCamera(new THREE.Vector2(a, b), camera);
    let intersects = raycaster.intersectObjects(world.children, true);
    if (intersects.length === 0) {
        return false;
    }

    //the mousepointer is over a child of the world
    //there are children of children; ground, base postholder, post, attached element
    //unless the gound is intersected, dragItem2 will be the child that was actually intersected, dragItem will be the corresponding base 
    let item = intersects[0];
    let objectHit = item.object;
    //if the polarizer scal is intersected, dragItem2 will be the polarizer
    if (item.object == polplaque[4] || item.object == polplaque[5]) {
        objectHit = objectHit.parent;
    }
    dragItem = dragItem0 = dragItem1 = dragItem2 = objectHit;

    if (objectHit.parent != world) {
        objectHit = objectHit.parent;
        dragItem = objectHit;
    }

    if (objectHit.parent != world) {
        dragItem0 = objectHit;
        objectHit = objectHit.parent;
        dragItem = objectHit;
    }

    if (objectHit.parent != world) {
        dragItem1 = dragItem0;
        dragItem0 = objectHit;
        objectHit = objectHit.parent;
        dragItem = objectHit;
    }

    if (objectHit == world.children[0]) {
        dragItem = world.children[1]; //otherwise I get a weird snap of the ground
        rotate = true;  //if the mousepointer is over the ground, we want the mouse to rotate the view, not drag an object
        return true;
    }

    else {
        //keep track of which base is selected in a global variable
        for (let i = 1; i < elements + 1; i++) {
            if (objectHit == world.children[i]) {
                active = i;
            }
        }
        //get the nominal world position of the selected base and post
        const itemvec = new THREE.Vector3();
        const itemvec1 = new THREE.Vector3();
        dragItem.getWorldPosition(itemvec);  //itemvec is the world position of the base which can be dragged
        dragItem1.getWorldPosition(itemvec1);  //itemvec1 is the world position of the post which can be raised
        //calculate the difference between the raycaster intersection point and the nominal world position of the object
        deltax = item.point.x - itemvec.x;
        deltaz = item.point.z - itemvec.z;
        deltay = item.point.y - itemvec.y;
        deltay1 = item.point.y - itemvec1.y;

        world.add(targetForDragging); //add an invisible plane at the height of the interection point
        targetForDragging.position.set(0, item.point.y, 0);
        render();
        return true;
    }
}

//we only check for mouse move events if dragging is true
function doMouseMove(evt) {
    if (dragging) {
        let x = evt.clientX
        let y = evt.clientY
        //which mouse action is selected?       
        if (rotate) {                //rotate the view
            let dx = prevX - startX;
            let dy = prevY - startY;
            cth = cth - dy / 1000;
            cth = Math.min(1.49, Math.max(0.08, cth));
            cph = (cph - dx / 1000) % (2 * Math.PI);
            camera.position.z = cr * Math.sin(cth) * Math.cos(cph);
            camera.position.y = cr * Math.cos(cth);
            camera.position.x = cr * Math.sin(cth) * Math.sin(cph);
            camera.lookAt(0, 0, 0);
            camera.updateProjectionMatrix();
            startX = prevX;
            startY = prevY;
            prevX = x;
            prevY = y;
            render();
        } else if (selected == 2) { //lift the post
            mouseDragFuncUp(x, y);
        } else if (selected == 3) { //rotate the post
            mouseDragFuncRot(x);
        } else if (selected == 4) { //tilt the mirror
            mouseDragFuncPolrot(x);
        } else {                    //move the base
            mouseDragFunc(x, y);
        }
    }
}

//drag in the xz plane
function mouseDragFunc(x, y) {
    let a = 2 * x / canvas.width - 1;
    let b = 1 - 2 * y / canvas.height;
    raycaster.setFromCamera(new THREE.Vector2(a, b), camera);
    const intersects = raycaster.intersectObject(targetForDragging);
    //when the base + childeren is dragged, the intersection point has to stay the same height above the ground
    if (intersects.length == 0) {
        return;
    }
    let locationX = intersects[0].point.x;
    let locationZ = intersects[0].point.z;
    let locationY = intersects[0].point.y;
    let coords = new THREE.Vector3(locationX - deltax, locationY - deltay, locationZ - deltaz);
    //coords hold the new worl position of the base
    //we want to make sure that we do not drag bases off the table or into each other
    world.worldToLocal(coords);
    let cond = 1;

    for (let i = 1; i < elements + 1; i++) {
        if (i != active && Math.abs(world.children[i].position.z - coords.z) <= 4) {  //check for collisions
            if (Math.abs(world.children[i].position.x - coords.x) <= 4) {
                cond = 0;
                break;
            }
        }
    }
    if (cond == 1) {
        a = Math.min(17.5, Math.max(-17.5, coords.x));  //set limits
        b = Math.min(17.5, Math.max(-17.5, coords.z));
        dragItem.position.set(a, coords.y, b);
    }
    laserhit();
    render();
}

// drag in the y-direction
function mouseDragFuncUp(x, y) {
    if (dragItem1 != dragItem0) {  //if the mousepointer was over the post
        let a = 2 * x / canvas.width - 1;
        let b = 1 - 2 * y / canvas.height;
        raycaster.setFromCamera(new THREE.Vector2(a, b), camera);
        const intersects = raycaster.intersectObject(dragItem1);
        if (intersects.length == 0) {
            return;
        }
        //and if the mouse pointer stays over the post   
        let locationY = intersects[0].point.y - deltay1;
        const itemvec = new THREE.Vector3();
        dragItem1.getWorldPosition(itemvec);
        let coords = new THREE.Vector3(itemvec.x, locationY, itemvec.z);
        world.worldToLocal(coords);
        b = Math.min(1.5, Math.max(0, coords.y));  //set limits
        dragItem1.position.y = b;
        laserhit();
        render();
    }

}

function mouseDragFuncRot(x) {
    if (dragItem != dragItem0) {  //if the mousepointer was over the postholder
        let rotangle = 0;
        let dx = prevX - startX;
        dragItem0.rotateY(dx / 1000);
        let _x = dragItem0.rotation.x;
        let _y = dragItem0.rotation.y;
        //console.log(_x, _y);  weird way threejs defines rotation angles
        if (_x == -0) {
            rotangle = 2 * Math.PI + _y
        } else {
            rotangle = 2 * Math.PI - _y - _x;
        }
        let b = (rotangle * 180 / Math.PI) % 360;
        baseangle[active - 1] = rotangle;
        ctx.clearRect(0, 0, canv.width, canv.height);
        //ctx.fillText(`${b}`, 4, 13);
        ctx.fillText(b.toFixed(1), 1, 12);
        basetexture[active - 1].needsUpdate = true;
        startX = prevX;
        prevX = x;
        laserhit();
        render();
    }
}

function mouseDragFuncPolrot(x) {
    if (dragItem1 != dragItem2 && dragItem2 == polarizer[4] || dragItem2 == polarizer[5] || dragItem2 == polarizer[6]) {
        //if the mousepointer was over the polarizer
        let rotangle = 0;
        let dx = prevX - startX;
        dragItem2.rotateZ(dx / 1000);
        let _y = dragItem2.rotation.y;
        let _z = dragItem2.rotation.z;
        //console.log(_x, _y);  weird way threejs defines rotation angles
        if (_y == -0) {
            rotangle = 2 * Math.PI + _z
        } else {
            rotangle = 2 * Math.PI - _z - _y;
        }
        let b = (rotangle * 180 / Math.PI) % 360;
        polangle[active - 1] = rotangle;
        ctxpol.clearRect(0, 0, 32, 16);
        ctxpol.fillStyle = '#25383c';
        ctxpol.fillRect(0, 0, 32, 16);
        ctxpol.fillStyle = 'white';
        ctxpol.fillText(b.toFixed(1), 1, 12);
        poltexture[active - 1].needsUpdate = true;
        startX = prevX;
        prevX = x;
        laserhit();
        render();
    }
}

//reset
function doMouseUp() {
    if (dragging) {
        canvas.removeEventListener("pointermove", doMouseMove);
        canvas.removeEventListener("pointerup", doMouseUp);
        if (snap == true) {
            let a = Math.floor(dragItem.position.x) + 0.5;
            let b = Math.floor(dragItem.position.z) + 0.5;
            dragItem.position.set(a, 0.125, b);
            laserhit();
            render();
        }
        dragging = false;
        rotate = false;
    }
}
