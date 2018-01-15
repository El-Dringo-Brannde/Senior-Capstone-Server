let socket = require('socket.io')(3002); // start socket.io

class socketIO {
   constructor() {
      this.socket = socket;
   }

   getSocket() {
      return this.socket
   }

}
module.exports = new socketIO(); 