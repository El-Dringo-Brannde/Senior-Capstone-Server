var mongoObj = require('mongodb').ObjectID;
module.exports = class CRUD {
   constructor(mongo, collName, socket) {
      this.mongoObj = mongoObj;
      this.db = mongo.collection(collName);
      this.socket = socket;
   }

   read(query, res) {
      this.db.find(query)
         .toArray((err, result) => {
            this.socket.emit('data', result);
            res.send(result);
         });
   }
};