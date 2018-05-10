/**
 * Module for logging the current state of the user to provide the
 * ability to pick uip where they left off it their session is
 * ended too early
 */

let mongoDB = require('./../../database/mongoDB')
let _ = require('lodash')

module.exports = class state extends mongoDB {
   constructor(mongoDB, collName, socket) {
      super(mongoDB, collName, null);
   }

   async updateState(req, userID) {
      let updateObj = {};
      _.isEmpty(req.body) ? null : updateObj.body = req.body;
      _.isEmpty(req.params) ? null : updateObj.params = req.params;
      _.isEmpty(req.query) ? null : updateObj.query = req.query;
      return await this.update({
         userID: userID
      }, updateObj)
   }

}
