
var IMAGE_RES = 28;
var net;
var w;
var reset;

// initialize image grid
var handwriting = new Array(IMAGE_RES);
for (var i = 0; i < IMAGE_RES; i++) {
	handwriting[i] = new Array(IMAGE_RES);
	for (var j = 0; j < IMAGE_RES; j++) {
		handwriting[i][j] = 0;
	}
}

function setup() {
	var canvas = createCanvas(windowWidth / 2, windowHeight);
	w = width / IMAGE_RES;
	canvas.position(windowWidth / 2, 0);
	canvas.style('z-index', '-1');
	noStroke();
}

function draw() {
	drawGrid();
}

function keyPressed() {
	if (keyCode === ENTER) classify();
}

// set grid values to 0
function resetGrid() {
	for (var r = 0; r < handwriting.length; r++) {
		for (var c = 0; c < handwriting[r].length; c++) {
			handwriting[r][c] = 0;
		}
	}
}

// display grid on screen
function drawGrid() {
	for (var r = 0; r < handwriting.length; r++) {
		for (var c = 0; c < handwriting[r].length; c++) {
			fill(handwriting[r][c]);
			rect(c * w, r * w, w, w);
		}
	}
}

// change grid values when mouse dragged
function mouseDragged() {
	if (reset) resetGrid(), reset = false;
	for (var r = 0; r < IMAGE_RES; r++) {
		for (var c = 0; c < IMAGE_RES; c++) {
			if (mouseX > c * w && mouseX < c * w + w && mouseY > r * w && mouseY < r * w + w) {
				drawAt(r, c);
			}
		}
	}
}

function drawAt(r, c) {
	handwriting[r][c] = 255;
	if (r + 1 < IMAGE_RES && handwriting[r + 1][c] == 0) handwriting[r + 1][c] = 200;
	if (r - 1 > -1 && handwriting[r - 1][c] == 0) handwriting[r - 1][c] = 200;
	if (c + 1 < IMAGE_RES && handwriting[r][c + 1] == 0) handwriting[r][c + 1] = 200;
	if (c - 1 > -1 && handwriting[r][c - 1] == 0) handwriting[r][c - 1] = 200;

	if (r + 1 < IMAGE_RES && c + 1 < IMAGE_RES && handwriting[r + 1][c + 1] == 0) handwriting[r + 1][c + 1] = 170;
	if (r - 1 > -1 && c + 1 < IMAGE_RES && handwriting[r - 1][c + 1] == 0) handwriting[r - 1][c + 1] = 170;
	if (r + 1 < IMAGE_RES && c - 1 > -1 && handwriting[r + 1][c - 1] == 0) handwriting[r + 1][c - 1] = 170;
	if (r - 1 > -1 && c - 1 > -1 && handwriting[r - 1][c - 1] == 0) handwriting[r - 1][c - 1] = 170;

}

// calculate coordinates of center of mass of image
function getCOM(img) {
	var Xweighted = 0, Yweighted = 0;
	var netMass = 0;

	for (var r = 0; r < IMAGE_RES; r++) {
		for (var c = 0; c < IMAGE_RES; c++) {
			if (img[r][c] > 0) {
				netMass++;
				Xweighted += c;
				Yweighted += r;
			}
		}
	}

	return {xcom: Math.floor(Xweighted / netMass), ycom: Math.floor(Yweighted / netMass)};
}

// recenter image so center of mass is at center of 28x28 grid
function recenter() {
	var com = getCOM(handwriting);
	var dx = 13 - com.xcom, dy = 13 - com.ycom;

	var copy = new Array(IMAGE_RES);
	for (var r = 0; r < IMAGE_RES; r++) {
		copy[r] = new Array(IMAGE_RES);
		for (var c = 0; c < IMAGE_RES; c++) {
			if (handwriting[r - dy] && handwriting[r - dy][c - dx]) {
				copy[r][c] = handwriting[r - dy][c - dx];
			} else {
				copy[r][c] = 0;
			}
		}
	}

	handwriting = copy;
}

// run classification on current handwriting state
function classify() {
	recenter();
	var x = vectorize(handwriting);
	var y = net.forwardPass(x);
	var max = 0;

	for (var i = 0; i < y.length; i++) {
		$('#' + i).attr("value", y[i] * 100);
		$('#' + i + 'p').text((y[i] * 100).toFixed(2) + '%');
		if (y[i] > y[max]) max = i;
	}

	$('#guess').text("That's a " + max + ".");
	reset = true;
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

	$(window).resize(function() {
		setup();
	});
});