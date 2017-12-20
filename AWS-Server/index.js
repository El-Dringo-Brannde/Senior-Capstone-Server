var app = require('express')();
var webSocketServer = require('http').createServer(app);
var io = require('socket.io')(webSocketServer);
var bodyParser = require('body-parser');
app.use(bodyParser.json());

var Mongo = require('mongodb').MongoClient;
var mongo_url = 'mongodb://localhost';

io.on('connection', function(socket){
        socket.emit('message', 'socket connected');

        app.post('/request', (req, res) => {
                console.log('received');
                console.log(req.body);
                res.writeHead(200, {'Content-Type': 'text/html'});
                res.end('thanks');

                Mongo.connect(mongo_url, function(err, db){
                if(err) return console.log(err);

                const sales = db.db('sdb');
                console.log('connected');
                sales.collection("sales").find(req.body).toArray(function(err, result){
                        if(err) throw err;
                        console.log(result);
                        db.close();
                        socket.emit('data', req.body);
                        });
                });
        });
});


app.listen(3008, () => console.log("Server up and running on port 3008!"))
webSocketServer.listen(3002, () => console.log("Websocket running on port 3002!"));