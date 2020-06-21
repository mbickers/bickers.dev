
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

    // Create buffer to write pixel data directly
    var imageData = new ImageData(w, h);
    var pixels = imageData.data;

    var offset = window.pageYOffset;
    var pixelDistance = 8;

    // Calculate grid pattern and fill in pixels
    // y starting position for grid is based on offset for parallelax effect with individual pixels
    for (var y = Math.floor(offset*-0.1) % pixelDistance; y < h; y += pixelDistance) {
        for (var x = 0; x < w; x += pixelDistance) {

            // Map coordinates to more reasonable sizes
            var u = x/4000;
            // y coordinate is dependent on offset to provide scrolling effect of entire graph
            var v = (y + 0.5*offset)/4000;

            // Calculates the "height" at a position in the grid
            var expr = Math.sin(31*u + 27*v) + 5*Math.cos(5*u - 3*v) + Math.sin(20*u) + Math.cos(20*v);

            // Normalize the "height" to [0, 1]
            var normalized = (expr + 8) / 16;


            // Calculate the magnitude of the gradient of the height
            var du = -31*Math.cos(31*u + 27*v) + 5*Math.sin(5*u - 3*v) + -20*Math.cos(20*u);
            var dv = -27*Math.cos(31*u + 27*v) + -3*Math.sin(5*u - 3*v) + 20*Math.sin(20*v);
            var slope = Math.sqrt(du*du + dv*dv);

            // Draw "contours" along the height graph.
            // Slope is a factor so that contours along different slopes have approximately the same width
            if (normalized % 0.04 < 0.0005 * slope) {
                // Set alpha channel for image data (color is default black)
                pixels[4*(y*w + x) + 3] = 150;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}


window.onload = handleResize;

window.onscroll = draw;
window.onresize = handleResize;
