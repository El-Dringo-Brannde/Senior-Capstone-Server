var url = require('./../config/mongoURL');
module.exports = function(mongo, io) {
   return new Promise((res, rej) => {
      mongo.connect(url, (err, db) => {
         io.on('connection', function(socket) {
            socket.emit("connected", {
               message: "Ping!"
            });
            res({
               socket: socket,
               db: db
            });
         });
      });
   });
}; // jesus this is ugly, keeping it in one file