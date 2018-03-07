var mongoObj = require('mongodb')
   .ObjectID;

module.exports = class CRUD {
   constructor(mongo, collName, socket) {
      this.mongoObj = mongoObj;
      this.db = mongo.collection(collName);
      this.socketIO = socket;

      this.onInit();
   }

   onInit() {} // virtual func

   async update(selector, updateData) {
      return await this.db.update(selector, {
         $set: updateData
      }, {
         upsert: true
      })
   }

   async insert(data) {
      return await this.db.insertOne(data)
   }

   async read(query) {
      return await this.db.find(query)
         .toArray();
   }

   async findLast(user){
      return await this.db.find({"userID" : user}).sort({_id: -1}).limit(1).toArray();
   }
};
