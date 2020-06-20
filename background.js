

function rand_gaussian(sigma) {
    var u1 = 0;
    while (u1 === 0) {
        u1 = Math.random();
    }

    var u2 = Math.random();

    var z0 = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);

    return z0 * sigma;
}


var map = [[0]];

let MIN_WAVELENGTH_COMPONENT_PX = 100;
let SPECTRAL_EXP = 2;
let AMP_FACTOR = 30;

function createMap(w, h) {

    var max_freq_x = Math.floor(w/MIN_WAVELENGTH_COMPONENT_PX);
    var max_freq_y = Math.floor(h/MIN_WAVELENGTH_COMPONENT_PX);

    var phase = new Array(max_freq_x + 1);
    var amp = new Array(max_freq_x + 1);

    for (var freq_x = 0; freq_x <= max_freq_x; freq_x++) {
        phase[freq_x] = new Array(max_freq_y + 1);
        amp[freq_x] = new Array(max_freq_y + 1);
        for (var freq_y = 0; freq_y <= max_freq_y; freq_y++) {
            if (freq_x == 0 && freq_y == 0) {
                continue;
            }

            phase[freq_x][freq_y] = Math.random() * Math.PI;

            var spectral_factor = Math.pow(freq_x*freq_x + freq_y*freq_y, -SPECTRAL_EXP/2)
            amp[freq_x][freq_y] = rand_gaussian(AMP_FACTOR) * spectral_factor;
        }
    }
    
    map = new Array(w);

    for (var x = 0; x < w; x++) {
        map[x] = new Array(h);
        for (var y = 0; y < h; y++) {
            map[x][y] = 0;


            for (var freq_x = 0; freq_x <= max_freq_x; freq_x++) {
                for (var freq_y = 0; freq_y <= max_freq_y; freq_y++) {
                    if (freq_x == 0 && freq_y == 0) {
                        continue;
                    }

                    var angle = 2 * Math.PI * (freq_x * x / w + freq_y * y / h);
                    map[x][y] += amp[freq_x][freq_y] * Math.cos(angle + phase[freq_x][freq_y]);
                }
            }
        }
    }


}

function handleResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    var canvas = document.getElementById("background-canvas");
    canvas.width = w;
    canvas.height = h;

    // If the new window is smaller just use the map and don't draw the unused parts
    if (map.length < w || map[0].length < h) {
        createMap(w, h);
    }

    window.requestAnimationFrame(draw)
}

function draw() {
    var canvas = document.getElementById("background-canvas");
    var ctx = canvas.getContext("2d");


    var w = canvas.width;
    var h = canvas.height;

    var imageData = ctx.getImageData(0, 0, w, h);
    w = imageData.width;
    h = imageData.height;
    var pixels = imageData.data;

    for (var y = 0; y < h; y++) {
        for (var x = 0; x < w; x++) {
            pixels[4 * (y*w + x) + 0] = 128 + map[x][y];
            pixels[4 * (y*w + x) + 1] = 128 + map[x][y];
            pixels[4 * (y*w + x) + 2] = 128 + map[x][y];
            pixels[4 * (y*w + x) + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

window.onload = function() {
    handleResize();
}
