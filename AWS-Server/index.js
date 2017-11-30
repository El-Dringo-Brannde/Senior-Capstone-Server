var app = require('express')();
var webSocketServer = require('http').createServer(app);
var io = require('socket.io')(webSocketServer);

io.on('connection', function (socket) {
   socket.broadcast.emit("connected", {
      message: "Ping!"
   });

   socket.on('message', function(msg){
     socket.emit('message', 'received');
   });


   app.post('/request', (req, res) => {
     res.status(200).send("hello");
     console.log("got a post");

   });
});

app.listen(3005, () => console.log("Server up and running on port 3005!"))
webSocketServer.listen(3000, () => console.log("Websocket running on port 3000!"));
