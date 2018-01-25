var url = require('./../config/mongoURL');

module.exports = function(mongo) {
   return new Promise((res, rej) => {
      mongo.connect(url, (err, database) => {
         if (err)
            throw err
         res(database.db('seniorCapstone'));
      });
   });
};