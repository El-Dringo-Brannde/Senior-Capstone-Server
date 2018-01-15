var mongoObj = require('mongodb').ObjectID;

module.exports = class CRUD {
   constructor(mongo, collName, socket) {
      this.mongoObj = mongoObj;
      this.db = mongo.collection(collName);
      this.socket = socket;

      this.onInit();
   }

   onInit() { } // virtual func

   async read(query) {
      return await this.db.find(query).toArray();
   }
};