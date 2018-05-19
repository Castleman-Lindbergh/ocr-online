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

// scale canvas image down to 28x28, by averaging intensity of each subsection
function downSize() {
	var SUB_RES = floor(width / 28);

	loadPixels();

	for (var r_start = 0; r_start < SUB_RES * IMAGE_RES; r_start += SUB_RES) {
		for (var c_start = 0; c_start < SUB_RES * IMAGE_RES; c_start += SUB_RES) {
			// set lower res pixel value to average of subimage values
			handwriting[r_start / SUB_RES][c_start / SUB_RES] = getAvg(r_start, c_start, SUB_RES);
		}
	}

	updatePixels();
}

// get the average intensity of a subsection of the canvas
function getAvg(r_start, c_start, sub) {
	var sum = 0;
	for (var r = r_start; r < r_start + sub; r++) {
		for (var c = c_start; c < c_start + sub; c++) {
			sum += pixelsAt(r, c);
		}
	}
	return sum / (sub * sub);
}

// get the value of the pixels array at a given row, column position
function pixelsAt(r, c) {
	return pixels[4 * (c + (r * floor(width)))];
}