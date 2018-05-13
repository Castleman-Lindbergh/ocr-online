
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

function dot(a, b) {
	
}

function add(a, b) {

}

function sig(a) {

}

function softMax(a) {
	
}