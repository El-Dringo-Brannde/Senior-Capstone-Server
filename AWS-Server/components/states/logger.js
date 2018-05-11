let mongoDB = require('./../../database/mongoDB')
let _ = require('lodash')
let suggest = require('./suggestions')

module.exports = class logger extends mongoDB {
   constructor(mongoDB, collName) {
      super(mongoDB, collName, null)
      this.suggest = new suggest()
   }

   /**
    * async logRoute - Log requests in database in order to suggest requests and
    * enable refining previous requests
    *
    * @param  {type} req    JSON object of request that was made
    * @param  {type} userID UserID of the requester
    * @return {type}        None
    */
   async logRoute(req, userID) {
      let lastQuery = {
         userID: userID
      };

      _.isEmpty(req.body) ? null : lastQuery.body = req.body;
      _.isEmpty(req.params) ? null : lastQuery.params = req.params;
      _.isEmpty(req.query) ? null : lastQuery.query = req.query;

      lastQuery = this.suggest.createSuggestion(lastQuery);
      let inserted = await this.insert(lastQuery)
      return inserted.ops[0]
   }
}
