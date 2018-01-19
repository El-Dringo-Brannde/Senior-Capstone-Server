var app = require('express')();
var io = require('./websockets/sockets'); // start socket.io
io = io.getSocket();
var mongo = require('mongodb');
var initServer = require('./server/init')(mongo);
var salesRoutes = require('./routes/sales');
var testRoutes = require('./routes/test');
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))

initServer.then(mongoSocket => {
   app.use('/sales', salesRoutes(mongoSocket, io));
   app.use('/test', testRoutes(mongoSocket, io));
   // ^^^ Init routes

   app.listen(3105, () => console.log('Server initialize finished, running on port 3105!')); // start server
});
