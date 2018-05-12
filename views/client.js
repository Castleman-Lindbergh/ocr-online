
var socket = io();

socket.on('net', function(data) {
	console.log(data.network);
});