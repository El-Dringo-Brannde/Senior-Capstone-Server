let app = require('express')();
let socketServer = require('http').createServer(app);
let socket = require('socket.io')(socketServer); // start socket.io
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
      console.log("Added room " + room);
     }

     console.log("Returning room " + room);
     return room;
   }

   newRoom(id){
     if(rooms.indexOf(id) == -1){
       rooms.push(id);
       var room = rooms[rooms.length - 1];
      console.log("Added room " + room);
     }
   }

   findRoom(id){
     console.log("Finding room matching " + id);
     rooms.forEach(function(room){
       if(room.endsWith(id))
        console.log("Found room matching " + id + " at room " + room);
        return room;
     });
     console.log("Did not find room matching " + id);
     return 0;
   }

   getSocket() {
      return this.socket
   }
   onInit(){
     socketServer.listen(3002, () => console.log("Websocket server running on port 3002"));
     let self = this;
     socket.on('connect', function(con){
       console.log("New connection");
       con.emit('setRoom', rooms[rooms.length - 1]);
       con.on('getRoom', (msg) => {
         console.log("Finding room " + msg);
         var room = self.findRoom(msg);
         if(room){
           console.log("Found room, returning result");
          con.emit('setRoom', room);
         }
         else{
           console.log("Unable to find room, returning error");
           con.emit('setRoom', "error");
         }
       });
     });
   }

   returnData(data, session){
     console.log("Returning DB data");
     io.to(getRoom(session)).emit('data', data);
   }
}
module.exports = new socketIO();
