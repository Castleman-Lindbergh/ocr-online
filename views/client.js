
var IMAGE_RES = 28;
var net;
var w;
var reset;
var penSize = 50;

// initialize image grid
var handwriting = new Array(IMAGE_RES);
for (var i = 0; i < IMAGE_RES; i++) {
	handwriting[i] = new Array(IMAGE_RES);
	for (var j = 0; j < IMAGE_RES; j++) {
		handwriting[i][j] = 0;
	}
}

function setup() {
	var DIM = windowWidth / 2 < windowHeight ? windowWidth / 2 : windowHeight;
	var canvas = createCanvas(DIM, DIM);
	w = width / IMAGE_RES;
	canvas.position(windowWidth / 2, (windowHeight - height) / 2);
	canvas.style('z-index', '-1');
	pixelDensity(1);
	noStroke();
	background(0);
}

// set grid values to 0
function resetGrid() {
	background(0);
	for (var r = 0; r < handwriting.length; r++) {
		for (var c = 0; c < handwriting[r].length; c++) {
			handwriting[r][c] = 0;
		}
	}
}

// display grid on screen
function drawGrid() {
	background(0);
	for (var r = 0; r < handwriting.length; r++) {
		for (var c = 0; c < handwriting[r].length; c++) {
			fill(handwriting[r][c]);
			rect(c * w, r * w, w, w);
		}
	}
}

// run classification on current handwriting state, render result
function classify() {
	// preprocess by reducing image resolution, centering by center of mass
	downSize();
	recenter();
	drawGrid();

	// pass vectorized image through network
	var x = vectorize(handwriting);
	var y = net.forwardPass(x);
	var max = 0;

	// update UI sliders / keep track of final classification
	for (var i = 0; i < y.length; i++) {
		$('#' + i).attr("value", y[i] * 100);
		$('#' + i + 'p').text((y[i] * 100).toFixed(2) + '%');
		if (y[i] > y[max]) max = i;
	}

	// render classification
	$('#guess').text("That's a " + max + ".");
	reset = true;	// allow grid to be reset
}

// press enter to classify
function keyPressed() { if (keyCode === ENTER) classify(); }

// draw when mouse dragged
function mouseDragged() {
	fill(255);
	if (reset) resetGrid(), reset = false;
	ellipse(mouseX, mouseY, penSize, penSize);
}

$(document).ready(function() {
	// construct network
	var socket = io();
	socket.on('net', function(data) {
		net = new NeuralNetwork(data.network);
	});

	// run classification
	$('#classify').click(function() {
		classify();
	});

	// reset canvas each time window is altered
	$(window).resize(function() {
		setup();
	});
});