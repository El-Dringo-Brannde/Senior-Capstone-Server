var socket = require('socket.io-client')('http://34.215.212.179:3002');
socket.on('connect', function(msg){
    console.log(msg)
});
socket.on('data', function(data){
	console.log(data);
});
socket.on('event', function(data){});
socket.on('disconnect', function(){});