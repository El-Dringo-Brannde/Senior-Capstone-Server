var crud = require('./../database/CRUD');

module.exports = class sales extends crud {
   constructor(mongo, collName, socket) {
      super(mongo, collName, socket);
   }


};