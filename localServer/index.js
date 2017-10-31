var socket = require("socket.io-client")("http://34.215.212.179:3000")

socket.on('connect', function () {
   console.log("connected!!")
});