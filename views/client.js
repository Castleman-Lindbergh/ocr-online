
var socket = io();
socket.on('net', function(data) {
	net = new NeuralNetwork(data.network);
});

var IMAGE_RES = 28;
var net;
var w;

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
	canvas.position(0, 0);
	canvas.style('z-index', '-1');
	noStroke();
}

function draw() {
	drawGrid();
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
	for (var r = 0; r < IMAGE_RES; r++) {
		for (var c = 0; c < IMAGE_RES; c++) {
			if (mouseX > c * w && mouseX < c * w + w && mouseY > r * w && mouseY < r * w + w) {
				handwriting[r][c] = 255;
				if (r + 1 < IMAGE_RES) handwriting[r + 1][c] = 255;
				if (c - 1 > -1) handwriting[r][c - 1] = 255;
				if (r + 1 < IMAGE_RES && c - 1 > -1) handwriting[r + 1][c - 1] = 255;
			}
		}
	}
}