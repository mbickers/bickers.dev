
var map = [[]];

let NUM_WAVES = 30;
let MAX_FREQ = 100;

function rand_uniform(x) {
    return Math.random()*2*x - x;
}

function createMap(w, h) {
    var x_freqs = new Array(NUM_WAVES);
    var y_freqs = new Array(NUM_WAVES);
    var phase = new Array(NUM_WAVES);
    var amp = new Array(NUM_WAVES);

    for (var i = 0; i < NUM_WAVES; i++) {
        x_freqs[i] = rand_uniform(MAX_FREQ);
        y_freqs[i] = rand_uniform(MAX_FREQ);
        phase[i] = rand_uniform(Math.PI / 2);
        amp[i] = rand_uniform(10);
    }

    
    map = new Array(w);

    for (var x = 0; x < w; x++) {
        map[x] = new Array(h);
        for (var y = 0; y < h; y++) {
            map[x][y] = 0;
            for (var i = 0; i < NUM_WAVES; i++) {
                map[x][y] += amp[i] * Math.cos(2*Math.PI*(x_freqs[i]*x + y_freqs[i]*y) + phase[i]);
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
    var pixels = imageData.data;

    console.log("Drawing");
    for (var x = 0; x < w; x++) {
        for (var y = 0; y < h; y++) {
            pixels[4 * (x*h + y)] = 128 - map[x][y];
            pixels[4 * (x*h + y) + 1] = 128 - map[x][y];
            pixels[4 * (x*h + y) + 2] = 128 - map[x][y];
            pixels[4 * (x*h + y) + 3] = 255;
        }
    }

    ctx.putImageData(imageData, 0, 0);
    console.log("DOne Drawing");
}

window.onload = function() {
    handleResize();
}
