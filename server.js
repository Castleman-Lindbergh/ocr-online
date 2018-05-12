var express         = require('express');
var mustacheExpress = require('mustache-express');
var bodyParser      = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.engine('html', mustacheExpress());
app.use('/', express.static('views'));

var server = require('http').createServer(app);
var io = require('socket.io')(server);

server.listen(8080, function() {
	console.log("OCR server listening on port 8080");
});