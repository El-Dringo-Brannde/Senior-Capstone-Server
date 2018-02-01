var socket = require('socket.io-client')('http://34.215.212.179:3002');

var stdin = process.openStdin(); //needed for now to get the session number for room
var sessionID = 0;

stdin.addListener("data", function(d){
  sessionID = d.toString().trim();
  console.log("Session ID " + sessionID);
  socket.emit('getRoom', sessionID);
});

socket.on('connect', function(msg){
    console.log("Connected to server");
});

socket.on('setRoom', function(msg){
  if(!sessionID)
    console.log("Session  " + msg);
});

socket.on('data', function(data){
	console.log(data);
});
socket.on('event', function(data){});
socket.on('disconnect', function(){});
