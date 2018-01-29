let mongoDB = require('./../database/mongoDB')
let _ = require('lodash')
module.exports = class logger extends mongoDB {
   constructor(mongoDB, collName) {
      super(mongoDB, collName, null)
   }

   async logRoute(req, userID) {
      let insertObj = { userID: userID };
      _.isEmpty(req.body) ? null : insertObj.body = req.body;
      _.isEmpty(req.params) ? null : insertObj.params = req.params;
      _.isEmpty(req.query) ? null : insertObj.query = req.query;
      return await this.insert(insertObj)
   }
}