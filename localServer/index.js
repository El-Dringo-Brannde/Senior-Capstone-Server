var socket = require('socket.io-client')('http://34.215.212.179:3002');

var stdin = process.openStdin(); //needed for now to get the session number for room
var sessionID = -1;

stdin.addListener("data", function(d){
  sessionID = parseInt(d, 10);
  console.log("Joining room " + sessionID);
});

socket.on('connect', function(msg){
    console.log(msg)
    if(sessionID > -1){
      socket.emit('getRoom', sessionID);
    }
});
socket.on('reply', function(msg){
  room = parseInt(msg, 10);
  socket.join(room);
});
socket.on('data', function(data){
	console.log(data);
});
socket.on('event', function(data){});
socket.on('disconnect', function(){});
