// For testing to see if the websocket is working on the AWS server
var socket = require('socket.io-client')('http://35.169.224.183:3002');
socket.on('connect', msg => {
   console.log('Connected!');
});

socket.on('Pie_Chart', data => {
   console.log(data);
});

socket.on('Bar_Chart', data => {
   // console.log(data)
})

socket.on('home', data => console.log("Switching to home"))
socket.on('map', data => console.log("Switching to map", data))
console.log('Ok I\'m waiting')