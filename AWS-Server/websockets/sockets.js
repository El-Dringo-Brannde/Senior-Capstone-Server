let socket = require('socket.io')(3002); // start socket.io
let io = require('socket.io-emitter')({host: '127.0.0.1', port: '3002'});


class socketIO {
   let rooms = [];

   constructor() {
      this.socket = socket;
   }

   getRoom(id){
     var room = rooms.indexOf(id);

     if(room == -1){
       rooms.push(id);
       room = rooms[rooms.length - 1];
     }

     return room;
   }

   getSocket() {
      return this.socket
   }

   returnData(data, session){
     io.to(getRoom(session)).emit('data', data);
   }
}
module.exports = new socketIO();
