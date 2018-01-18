var socket = require('socket.io-client')('http://34.215.212.179:3002');

var stdin = process.openStdin(); //needed for now to get the session number for room
var sessionID = -1;

stdin.addListener("data", function(d){
  sessionID = d.toString().trim();
  console.log("Session ID " + sessionID);
  socket.emit('broadcast', sessionID);
});

socket.on('connect', function(msg){
    //console.log(msg)
    console.log(msg);

});

socket.on('setRoom', function(msg){
  console.log("Join room " + msg);
});

socket.on('data', function(data){
	console.log(data);
});
socket.on('event', function(data){});
socket.on('disconnect', function(){});
