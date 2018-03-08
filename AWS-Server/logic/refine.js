let mongoDB = require('./../database/mongoDB')
let _ = require('lodash')
module.exports = class refine extends mongoDB {
   constructor(mongoDB, collName) {
      super(mongoDB, collName, null)
   }

   async mergeRoute(req) {
      let user = req.query.userID;
      let lastRequest = await this.findLast(user);

      let mergedRoute = Object.assign({}, lastRequest[0], req);
      mergedRoute.params = Object.assign({}, lastRequest[0].params, req.params);
      mergedRoute.query = Object.assign({}, lastRequest[0].query, req.query);

      return mergedRoute;
   }
}
