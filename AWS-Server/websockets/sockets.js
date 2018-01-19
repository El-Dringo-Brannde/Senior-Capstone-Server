let app = require('express')();
let socketServer = require('http').createServer(app);
let socket = require('socket.io')(socketServer); // start socket.io
let io = require('socket.io-emitter')({host: 'localhost', port: '3002'});
let rooms = [];

class socketIO {

   constructor() {
      this.socket = socket;
      this.onInit();
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
   onInit(){
     socketServer.listen(3002, () => console.log("Websocket server running on port 3002"));
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
   }

   returnData(data, session){
     io.to(getRoom(session)).emit('data', data);
   }
}
module.exports = new socketIO();
