var mongoObj = require('mongodb').ObjectID;

module.exports = class CRUD {
   constructor(mongo, collName, socket) {
      this.mongoObj = mongoObj;
      this.db = mongo.collection(collName);
      this.socket = socket;

      this.onInit();
   }

   onInit() { } // virtual func

   read(query, res) {
      this.db.find(query)
         .toArray((err, result) => {
            this.socket.emit('data', result);
            res.json({
               data: result
            });
         });
   }
};