/**
 * Module for connecting and managing SocketIO
 */

let app = require('express')();
let socketServer = require('http')
   .createServer(app);
let socket = require('socket.io')(socketServer);
let rooms = [];

class socketIO {

   constructor() {
      this.socket = socket;
      this.onInit();
   }

   getSocket() {
      return this.socket
   }
   
   onInit() {
      socketServer.listen(3002, () => console.log("Websocket server running on port 3002"));
      let self = this;
      socket.on('connect', function (con) {
         console.log("New connection");
      });
   }

   returnData(data, session) {
      console.log("Returning DB data");
      io.emit('data', data);
   }
}
module.exports = new socketIO();
