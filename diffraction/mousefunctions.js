"use strict";
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

function mouseDownFunc(x, y) {
    if (targetForDragging.parent == world) {
        world.remove(targetForDragging);  //the initial object should be a visible object
    }
    let a = 2 * x / canvas.width - 1;
    let b = 1 - 2 * y / canvas.height;
    raycaster.setFromCamera(new THREE.Vector2(a, b), camera);
    let intersects = raycaster.intersectObjects(world.children, true);
    if (intersects.length === 0) {
        return false;
    }
    let item = intersects[0];
    let objectHit = item.object;
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
        dragItem = world.children[1];
        rotate = true;  // if the mousepointer is over the ground, we want the mouse to rotate the view, not drag an object
        return true;
    }

    else {
        for (let i = 1; i < elements + 1; i++) {
            if (objectHit == world.children[i]) {
                active = i;
            }
        }
        const itemvec = new THREE.Vector3();
        const itemvec1 = new THREE.Vector3();
        dragItem.getWorldPosition(itemvec);
        dragItem1.getWorldPosition(itemvec1);
        deltax = item.point.x - itemvec.x;
        deltaz = item.point.z - itemvec.z;
        deltay = item.point.y - itemvec.y;

        world.add(targetForDragging);
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
        //rotate or drag?
        if (rotate) {
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
        } else {
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
    if (intersects.length == 0) {
        return;
    }
    let locationX = intersects[0].point.x;
    let locationZ = intersects[0].point.z;
    let locationY = intersects[0].point.y;
    let coords = new THREE.Vector3(locationX - deltax, locationY - deltay, locationZ - deltaz);
    world.worldToLocal(coords);
    let cond = 1;

    for (let i = 1; i < elements + 1; i++) {
        if (i != active && Math.abs(world.children[i].position.z - coords.z) <= 4) {
            if (Math.abs(world.children[i].position.x - coords.x) <= 4) {
                cond = 0;
                break;
            }
        }
    }
    if (cond == 1) {
        const a = Math.min(17.5, Math.max(-17.5, coords.x));  //set limits
        const b = Math.min(17.5, Math.max(-17.5, coords.z));
        dragItem.position.set(a, coords.y, b);
    }
    laserhit();
    render();
}

//reset
function doMouseUp() {
    if (dragging) {
        canvas.removeEventListener("pointermove", doMouseMove);
        canvas.removeEventListener("pointerup", doMouseUp);
        const a = Math.floor(dragItem.position.x) + 0.5;
        const b = Math.floor(dragItem.position.z) + 0.5;
        dragItem.position.set(a, 0.125, b);
        laserhit();
        render();
        dragging = false;
        rotate = false;
    }
}
