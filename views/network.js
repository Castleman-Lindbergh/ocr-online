
function NeuralNetwork(serialization) {
	this.w = [];
	this.b = [];
	this.layers;
	this.params = [];

	// pass an image vector through the network
	this.forwardPass = function(img) {
		var activation = img;
		for (var l = 0; l < this.layers - 1; l++) {
			if (l == this.layers - 2) {
				return softMax(add(dot(this.w[l], activation), this.b[l]));
			} else {
				activation = sig(add(dot(this.w[l], activation), this.b[l]));
			}
		}
	}

	// construct off of serialization
	this.construct = function(s) {
		var sections = s.split("|");
		this.layers = parseInt(sections[0], 10);

		// retrieve parameters
		this.params = sections[1].split(",");
		for (var i = 0; i < this.params.length; i++) {
			this.params[i] = parseInt(this.params[i], 10);
		}

		var specs = sections[2].split(",");

		// for every bias vector
		for (var l = 0; l < this.layers - 1; l++) {
			this.b.push([]);
			// for each bias
			for (var j = 0; j < this.params[l + 1]; j++) {
				this.b[l].push([]);
				this.b[l][j][0] = parseFloat(specs.shift());
			}
		}

		// for every weight matrix
		for (var l = 0; l < this.layers - 1; l++) {
			this.w.push([]);
			// for every row
			for (var j = 0; j < this.params[l + 1]; j++) {
				this.w[l].push([]);
				// for every column
				for (var k = 0; k < this.params[l]; k++) {
					this.w[l][j][k] = parseFloat(specs.shift());
				}
			}
		}
	}

	this.construct(serialization);
}