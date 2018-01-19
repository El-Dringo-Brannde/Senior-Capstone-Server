let socket = require('socket.io')(3002); // start socket.io
let io = require('socket.io-emitter')({host: 'localhost', port: '3002'});
let rooms = [];

class socketIO {

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

   findRoom(id){
     rooms.forEach(function(room){
       if(room.endsWith(id))
        return room;
     });
     return 0;
   }

   getSocket() {
      return this.socket
   }

   socket.on('connect', function(msg){
     
   });

   socket.on('getRoom', function(msg){
     var room = findRoom(msg);
     if(room){
      socket.emit('setRoom', findRoom(id));
     }
     else{
       socket.emit('setRoom', "error");
     }
   });

   returnData(data, session){
     io.to(getRoom(session)).emit('data', data);
   }
}
module.exports = new socketIO();
