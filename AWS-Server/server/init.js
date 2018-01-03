var url = require('./../config/mongoURL');

module.exports = function (mongo) {
   return new Promise((res, rej) => {
      mongo.connect(url, (err, database) => {
         res(database.db('seniorCapstone'));
      });
   });
};