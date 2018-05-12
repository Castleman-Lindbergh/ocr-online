var express         = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser      = require('body-parser');
var fs				= require('fs');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.engine('html', mustacheExpress());
app.use('/', express.static('views'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

var network;

// read network file for distribution
function readNetSerialization(callback) {
	fs.readFile('./network.txt', 'UTF8', function(err, data) {
		if (err) throw err;
		network = data;
		callback();
	});
}

app.get('/', function(req, res) {
	res.render('client.html');
});

io.on('connection', function(socket) {
	// send network serialization
	socket.emit('net', {network: network});
});

readNetSerialization(function() {
	server.listen(8080, function() {
		console.log("OCR server listening on port 8080");
	});
});