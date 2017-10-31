var app = require('express')();
var webSocketServer = require('http').createServer(app);
var io = require('socket.io')(webSocketServer);

io.on('connection', function (socket) {
   socket.broadcast.emit("connected", {
      message: "Ping!"
   });
   console.log("ping!")
});

app.get('/', (req, res) => {
   res.send("Hello world!");
})

app.get("/test", (req, res) => {
   console.log("You did the thing!!!");
   res.send("You did the thing!!!")
})

app.listen(3005, () => console.log("Server up and running on port 3005!"))
webSocketServer.listen(3000, () => console.log("Websocket running on port 3000!"));