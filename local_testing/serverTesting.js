// For testing to see if the websocket is working on the AWS server
var socket = require('socket.io-client')('http://35.169.224.183:3002');
socket.on('connect', function (msg) {
   console.log('Connected!');
});

socket.on('data', (data) => {
   console.log(data);
});