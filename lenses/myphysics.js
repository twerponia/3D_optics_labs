"use strict";
function rays1() {

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

    if (lensID == 0) {
        ctx1.fillStyle = "#ff0000";
        ctx1.beginPath();
        ctx1.ellipse(64, 32, beamradius * 32, beamradius * 32, 0, 0, 2 * Math.PI);
        ctx1.fill();
    }
    else {
        let xm, x, y, z = 0;
        let alpha, beta, gamma;

        //calulate the direction cosines
        alpha = Math.cos(Math.PI / 2 + rotangle);
        beta = 0;
        gamma = Math.sqrt(1 - alpha * alpha);
        let aprad = beamradius;
        let aprad2 = aprad * aprad;
        const nlist = [1, 1.52, 1];
        let tlist; let clist;

        // parameters of optical system
        if (lensID == 1) {
            clist = [1 / lensc[0], -1 / lensc[0], 0,];
            tlist = [0, lensc[1], (base[1].position.z - base[0].position.z - lensc[1] / 2) / gamma];
        }
        if (lensID == 2) {
            clist = [0, -1 / lensa[0], 0,];
            tlist = [0, lensa[1], (base[1].position.z - base[0].position.z - lensa[1]) / gamma];
        }
        if (lensID == 3) {
            clist = [0, -1 / lensb[0], 0,];
            tlist = [0, lensb[1], (base[1].position.z - base[0].position.z - lensb[1]) / gamma];
        }
        if (lensID == 4) {
            clist = [1 / lensb[0], 0, 0,];
            tlist = [0, lensb[1], (base[1].position.z - base[0].position.z) / gamma];
        }

        let arr, arrnew;
        (arr = []).length = 8976;
        arr.fill(0);
        (arrnew = []).length = 8192;
        arrnew.fill(0);

        x = 0; y = 0;
        rays0(alpha, beta, gamma);

        for (let j = 0; j < 1000; j++) {
            //pick a ray
            z = 0;
            x = -aprad + 2 * Math.random() * aprad;
            y = -aprad + 2 * Math.random() * aprad;
            if (x * x + y * y < aprad2) {
                rays(alpha, beta, gamma);
            }
        }
        makeavg();

        let ratio = Math.max(...arrnew);
        //console.log(ratio);
        if (ratio != 0) {
            arrnew = arrnew.map(v => v / ratio);
        }
        let b;
        for (let i = 0; i < 128; i++) {
            for (let j = 0; j < 64; j++) {
                b = arrnew[j * 128 + i];
                b = Math.pow(b, 1 / 3);
                makeInstance(i, j)
            }
        }

        function rays(alpha1, beta1, gamma1) {
            let x1, y1, z1, ea, Mz, M2a, costheta, Ta, nu;
            let costhetap, g, alphap, betap, gammap;
            for (let i = 0; i < 3; i++) {
                ea = tlist[i] * gamma1 - (x * alpha1 + y * beta1 + z * gamma1);
                Mz = z + ea * gamma1 - tlist[i];
                M2a = x * x + y * y + z * z - ea * ea + tlist[i] * tlist[i] - 2 * tlist[i] * z;
                costheta = gamma1 * gamma1 - clist[i] * (clist[i] * M2a - 2 * Mz);
                costheta = Math.sqrt(costheta);
                Ta = ea + (clist[i] * M2a - 2 * Mz) / (gamma1 + costheta);
                x1 = x + Ta * alpha1;
                y1 = y + Ta * beta1;
                z1 = z + Ta * gamma1 - tlist[i];
                if (i === 2) {
                    break;
                }
                nu = nlist[i] / nlist[i + 1];
                costhetap = Math.sqrt(1 - nu * nu * (1 - costheta * costheta));
                g = costhetap - nu * costheta;
                alphap = nu * alpha1 - clist[i] * g * x1;
                betap = nu * beta1 - clist[i] * g * y1;
                gammap = Math.sqrt(1 - alphap * alphap - betap * betap);
                x = x1; y = y1; z = z1;
                alpha1 = alphap; beta1 = betap; gamma1 = gammap;
            }
            makearray(-x1, y1);
        }

        function makearray(xi, yi) {
            let i, j;
            let xinew = (xi - xm);
            let yinew = yi;
            i = Math.round(34 * xinew + 68); //arbitrary scale
            j = Math.round(- 34 * yinew + 34);
            if (i >= 0 && j >= 0 && i < 132 && j < 68) {
                arr[j * 132 + i] = arr[j * 132 + i] + 1;
            }
        }

        function makeavg() {
            let temp;
            let a = [2, 2 - 2 / 9, 2 - 5 / 9, 0, 0, 0];
            //let a = [2, 2 - 1 / 9, 2 - 2 / 9, 2 - 4 / 9, 2 - 5 / 9, 2 - 8 / 9];
            for (let i = 0; i < 128; i++) {
                for (let j = 0; j < 64; j++) {
                    temp = a[0] * arr[(j + 2) * 132 + i + 2];
                    temp = temp + a[1] * (arr[(j + 2) * 132 + i + 3] + arr[(j + 2) * 132 + i + 1] + arr[(j + 1) * 132 + i + 2] + arr[(j + 3) * 132 + i + 2]);
                    temp = temp + a[2] * (arr[(j + 1) * 132 + i + 3] + arr[(j + 3) * 132 + i + 3] + arr[(j + 1) * 132 + i + 1] + arr[(j + 3) * 132 + i + 1]);
                    //temp = temp + a[3] * (arr[(j + 2) * 132 + i + 4] + arr[(j + 2) * 132 + i] + arr[j * 132 + i + 2] + arr[(j + 4) * 132 + i + 2]);
                    //temp = temp + a[4] * (arr[(j + 1) * 132 + i + 4] + arr[(j + 3) * 132 + i + 4] + arr[(j + 1) * 132 + i] + arr[(j + 3) * 132 + i]);
                    //temp = temp + a[4] * (arr[j * 132 + i + 3] + arr[j * 132 + i + 1] + arr[(j + 4) * 132 + i + 3] + arr[(j + 4) * 132 + i + 1]);
                    //temp = temp + a[5] * (arr[j * 132 + i + 4] + arr[j * 132 + i] + arr[(j + 4) * 132 + i + 4] + arr[(j + 4) * 132 + i]);
                    arrnew[j * 128 + i] = temp;
                }
            }
        }

        function makeInstance(i, j) {
            let col = "rgba(" + 255 + "," + 0 + "," + 0 + ", " + b + ")";
            ctx1.fillStyle = col;
            ctx1.fillRect(i, j, 1, 1)
        }

        function rays0(alpha1, beta1, gamma1) {
            let x1, y1, z1, ea, Mz, M2a, costheta, Ta, nu;
            let costhetap, g, alphap, betap, gammap;
            for (let i = 0; i < 3; i++) {
                ea = tlist[i] * gamma1 - (x * alpha1 + y * beta1 + z * gamma1);
                Mz = z + ea * gamma1 - tlist[i];
                M2a = x * x + y * y + z * z - ea * ea + tlist[i] * tlist[i] - 2 * tlist[i] * z;
                costheta = gamma1 * gamma1 - clist[i] * (clist[i] * M2a - 2 * Mz);
                costheta = Math.sqrt(costheta);
                Ta = ea + (clist[i] * M2a - 2 * Mz) / (gamma1 + costheta);
                x1 = x + Ta * alpha1;
                y1 = y + Ta * beta1;
                z1 = z + Ta * gamma1 - tlist[i];
                if (i === 2) {
                    break;
                }
                nu = nlist[i] / nlist[i + 1];
                costhetap = Math.sqrt(1 - nu * nu * (1 - costheta * costheta));
                g = costhetap - nu * costheta;
                alphap = nu * alpha1 - clist[i] * g * x1;
                betap = nu * beta1 - clist[i] * g * y1;
                gammap = Math.sqrt(1 - alphap * alphap - betap * betap);
                x = x1; y = y1; z = z1;
                alpha1 = alphap; beta1 = betap; gamma1 = gammap;
            }
            xm = -x1;
        }
    }
    screentexture.needsUpdate = true;
    render();
}
