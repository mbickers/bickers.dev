
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

    var imageData = new ImageData(w, h);
    var pixels = imageData.data;

    var offset = window.pageYOffset;

    for (var y = Math.floor(offset*-0.1) % 8; y < h; y += 8) {
        for (var x = 0; x < w; x += 8) {
            var u = x/4000;
            var v = (y + 0.5*offset)/4000;

            var expr = Math.sin(31*u + 27*v) + 5*Math.cos(5*u - 3*v) + Math.sin(20*u) + Math.cos(20*v);
            var normalized = (expr + 8) / 16;


            var du = -31*Math.cos(31*u + 27*v) + 5*Math.sin(5*u - 3*v) + -20*Math.cos(20*u);
            var dv = -27*Math.cos(31*u + 27*v) + -3*Math.sin(5*u - 3*v) + 20*Math.sin(20*v);

            var slope = Math.sqrt(du*du + dv*dv);

            if (normalized % 0.04 < 0.0005 * slope) {
                pixels[4 * (y*w + x) + 3] = 150;
            }
        }
    }

    ctx.putImageData(imageData, 0, 0);
}

window.onload = function() {
    window.onscroll = function(e) {
        window.requestAnimationFrame(draw);
    };
    handleResize(); 
};
window.onresize = handleResize;
