let crud = require('./CRUD');

class mongoDB extends crud {
   constructor(mongo, collName, socket) {
      super(mongo, collName, socket)
   }

   aggregate(aggregate) {
      return new Promise((res, rej) => {
         this.db.aggregate(aggregate)
            .toArray((err, data) => {
               if (err)
                  res(err)
               res(data)
            });
      });
   }

   getSuggestion(userID) {
      return new Promise(async (res, rej) => {
         let result = await this.db.find({
            "query.userID": userID
         })
            .sort({
               _id: -1
            })
            .limit(1)
            .toArray();
         res(result)
      })
   }
}

module.exports = mongoDB;
