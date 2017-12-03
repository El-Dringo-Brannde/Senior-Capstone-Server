var app = require('express')();
var webSocketServer = require('http').createServer(app);
var io = require('socket.io')(webSocketServer);

io.on('connection', function (socket) {
    socket.emit("connected", {
        message: "Ping!"
    });
    console.log("ping!");
    socket.on('message', function (msg) {
        console.log('in');
        socket.emit('message', 'its working');
        socket.emit('message', 'second');
    });
});

app.get('/', (req, res) => {
    res.send("Hello world!");
});



app.get('/:which/:type/:time/', (req, res) => {
    res.json({
        data: 'here is ' + req.params.which + ' ' + req.params.type + ' for ' + req.params.time
    });
});

app.get("/test", (req, res) => {
    console.log("You did the thing!!!");
    res.json({ data: "You did the thing!!!" });
});

app.get('/repeat', (req, res) => {
    console.log(req)
    res.json({ data: "You did the thing!!!" });
});


app.get('/ryan', (req, res) => {
    res.json({ data: "Ryan smells" });
});
