let mongoDB = require('./../database/mongoDB')
let _ = require('lodash')
let suggest = require('./../utility/suggestions')

module.exports = class logger extends mongoDB {
   constructor(mongoDB, collName) {
      super(mongoDB, collName, null)
      this.suggest = new suggest()
   }

   async logRoute(req, userID) {
      let lastQuery = {
         userID: userID
      };
      _.isEmpty(req.body) ? null : lastQuery.body = req.body;
      _.isEmpty(req.params) ? null : lastQuery.params = req.params;
      _.isEmpty(req.query) ? null : lastQuery.query = req.query;

      lastQuery = this.suggest.createSuggestion(lastQuery);
      return await this.insert(lastQuery)
   }
}
