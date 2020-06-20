
function handleResize() {
    var w = window.innerWidth;
    var h = window.innerHeight;

    var canvas = document.getElementById("background-canvas");
    canvas.width = w;
    canvas.height = h;

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
            if ((x + y) % 9 == 0 && y % 10 == 0) {
                pixels[4 * (y*w + x) + 0] = 0;
                pixels[4 * (y*w + x) + 1] = 0; 
                pixels[4 * (y*w + x) + 2] = 0;
                pixels[4 * (y*w + x) + 3] = 255;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

window.onload = handleResize; 
window.onresize = handleResize;

