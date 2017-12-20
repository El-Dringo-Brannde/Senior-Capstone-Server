// For testing to see if the websocket is working on the AWS server
var socket = require('socket.io-client')('http://localhost:3002');
socket.on('connect', function(msg) {
   console.log('yay!')
});
socket.on('event', function(data) {});
socket.on('disconnect', function() {});