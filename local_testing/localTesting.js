// For testing to see if the websocket is working on the AWS server
var socket = require('socket.io-client')('http://localhost:3002');
socket.on('connect', function(msg) {
    console.log('yay!')
});
socket.on('event', function(data) { });
socket.on('disconnect', function() { });

socket.on('Pie_Chart', (data) => {
    console.log(data);
});

socket.on('Bar_Chart', data => {
    console.log(data);
});


socket.on('Bubble_Chart', data => {
    console.log("BUBBLE ")
    console.log(data)
})

socket.on('home', data => console.log("Switching to home"))
socket.on('map', data => console.log("Switching to map"))