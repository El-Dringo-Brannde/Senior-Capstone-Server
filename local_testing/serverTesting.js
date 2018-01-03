// For testing to see if the websocket is working on the AWS server
var socket = require('socket.io-client')('http://34.215.212.179:3002');
socket.on('connect', function(msg) {
   console.log('Connected!');
});

socket.on('data', (data) => {
   console.log(data);
});