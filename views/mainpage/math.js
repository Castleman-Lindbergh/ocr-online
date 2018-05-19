
// convert handwriting to 784-d vector
function vectorize(image) {
	var v = [];
	for (var r = 0; r < image.length; r++) {
		for (var c = 0; c < image[r].length; c++) {
			v.push(image[r][c]);
		}
	}
	return v;
}

// dot matrix into vector
function dot(m, v) {
	var c = new Array(m.length);

	for (var i = 0; i < c.length; i++) {
		c[i] = 0;
		for (var n = 0; n < v.length; n++) {
			c[i] += m[i][n] * v[n];
		}
	}

	return c;
}

// vector add
function add(a, b) {
	var c = new Array(a.length);

	for (var i = 0; i < c.length; i++) {
		c[i] = a[i] + b[i];
	}

	return c;
}

// activation function
function sigmoid(x) {
	return (1 / (1 + Math.exp(-x)));
}


// apply sigmoid elementwise to a vector
function sig(a) {
	var c = new Array(a.length);
	for (var i = 0; i < c.length; i++) {
		c[i] = sigmoid(a[i]);
	}
	return c;	
}

// apply softmax to vector
function softMax(a) {
	var sum = 0.0;
	var c = new Array(a.length);

	for (var i = 0; i < a.length; i++) {
		sum += Math.exp(a[i]);
	}

	for (var i = 0; i < c.length; i++) {
		c[i] = Math.exp(a[i]) / sum;
	}
	
	return c;
}

// // sort output vector by confidence
// function order(output) {
// 	var swp = true;
// 	while (swp) {
// 		swp = false;
// 		for (var i = 0; i < output.length - 1; i++) {
// 			if (output[i].confidence < output[i + 1].confidence) {
// 				swap(output, i, i + 1);
// 				swp = true;
// 			}
// 		}
// 	}
// }

// // swap two array elements
// function swap(a, i1, i2) {
// 	var z = a[i1];
// 	a[i1] = a[i2];
// 	a[i2] = z;
// }