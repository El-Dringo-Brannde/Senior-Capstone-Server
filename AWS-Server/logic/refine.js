let mongoDB = require('./../database/mongoDB')
let _ = require('lodash')
module.exports = class refine extends mongoDB {
   constructor(mongoDB, collName) {
      super(mongoDB, collName, null)
   }

   function mergeRoute(req){
     let user = req.query.userID;
     let lastRequest = await this.find({"userID" : user}).sort({_id: -1}).limit(1);

     let mergedRoute = Object.assign({}, lastRequest, req);
     mergedRoute.params = Object.assign({}, lastRequest.params, req.params);
     mergedRoute.query = Object.assign({}, lastRequest.query, req.query);

     return mergedRoute;
   }
}
