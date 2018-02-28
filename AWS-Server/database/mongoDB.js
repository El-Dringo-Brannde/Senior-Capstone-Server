let crud = require('./../database/CRUD');

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
}

module.exports = mongoDB;
