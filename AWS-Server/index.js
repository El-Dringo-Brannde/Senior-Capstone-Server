var app = require('express')();
var webSocketServer = require('http').createServer(app);
var io = require('socket.io')(webSocketServer);
var mongo = require('mongodb');
var initServer = require('./server/init')(mongo, io);
var salesRoutes = require('./routes/sales');
var testRoutes = require('./routes/test');

webSocketServer.listen(3002, () => console.log("Server starting.."));

initServer.then(mongoSocket => {
   var mongo = mongoSocket.db;
   var socket = mongoSocket.socket;

   app.use('/sales', salesRoutes(mongoSocket, socket));
   app.use('/test', testRoutes(mongoSocket, socket));
   // ^^^ Init routes

   app.listen(3105, () => console.log('Server initialize finished, running on port 3105!')); // start server
});